import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { GoogleGenAI, Type } from '@google/genai';
import { randomUUID } from 'crypto';
import pino from 'pino';
import pinoHttp from 'pino-http';
import client from 'prom-client';

const app = express();
app.use(cors());
app.use(express.json());

const logger = pino({ level: process.env.LOG_LEVEL || 'info' });
const register = new client.Registry();
client.collectDefaultMetrics({ register });
const httpCounter = new client.Counter({
  name: 'proxy_http_requests_total',
  help: 'HTTP requests',
  labelNames: ['route', 'method', 'status'],
  registers: [register],
});
const httpDuration = new client.Histogram({
  name: 'proxy_http_request_duration_seconds',
  help: 'HTTP request duration seconds',
  labelNames: ['route'],
  buckets: [0.1, 0.3, 0.5, 1, 2, 5],
  registers: [register],
});

// request id middleware
app.use((req: Request, _res: Response, next: NextFunction) => {
  (req as any).id = req.headers['x-request-id'] || randomUUID();
  next();
});
app.use(pinoHttp({ logger }));

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn('GEMINI_API_KEY no está definido; el proxy responderá 503');
}
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// POST /api/estimate { origin, destination, currentLat, currentLng, serviceType }
app.post('/api/estimate', async (req: Request, res: Response) => {
  const start = process.hrtime.bigint();
  if (!ai) return res.status(503).json({ error: 'Gemini API key missing' });
  const { origin, destination, currentLat, currentLng, serviceType } = req.body;
  try {
    const schema = {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          name: { type: Type.STRING },
          price: { type: Type.NUMBER },
          currency: { type: Type.STRING },
          eta: { type: Type.NUMBER },
          duration: { type: Type.NUMBER },
          description: { type: Type.STRING },
          capacity: { type: Type.STRING }
        },
        required: ['id', 'name', 'price', 'currency', 'eta', 'duration', 'description', 'capacity']
      }
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `User location: ${currentLat}, ${currentLng} (approx ${origin}). Destination: "${destination}". Service: ${serviceType}`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: schema,
        temperature: 0.4
      }
    });
    const text = response.text;
    if (!text) return res.status(500).json({ error: 'Empty response' });
    const resp = JSON.parse(text);
    httpCounter.inc({ route: 'estimate', method: 'POST', status: '200' });
    const dur = Number(process.hrtime.bigint() - start) / 1e9;
    httpDuration.observe({ route: 'estimate' }, dur);
    return res.json(resp);
  } catch (e: any) {
    httpCounter.inc({ route: 'estimate', method: 'POST', status: '500' });
    logger.error({ err: e?.message || e, reqId: (req as any).id }, 'estimate error');
    return res.status(500).json({ error: e?.message || 'Proxy error' });
  }
});

// POST /api/coords { destination, nearbyLat, nearbyLng }
app.post('/api/coords', async (req: Request, res: Response) => {
  const start = process.hrtime.bigint();
  if (!ai) return res.status(503).json({ error: 'Gemini API key missing' });
  const { destination, nearbyLat, nearbyLng } = req.body;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `I am at ${nearbyLat}, ${nearbyLng} (Guayaquil, EC). The user wants to go to "${destination}". 
       Generate a JSON object with 'lat' and 'lng'. Return coordinates in Guayaquil.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: { lat: { type: Type.NUMBER }, lng: { type: Type.NUMBER } },
          required: ['lat', 'lng']
        }
      }
    });
    const text = response.text;
    if (!text) return res.status(500).json({ error: 'Empty response' });
    const resp = JSON.parse(text);
    httpCounter.inc({ route: 'coords', method: 'POST', status: '200' });
    const dur = Number(process.hrtime.bigint() - start) / 1e9;
    httpDuration.observe({ route: 'coords' }, dur);
    return res.json(resp);
  } catch (e: any) {
    httpCounter.inc({ route: 'coords', method: 'POST', status: '500' });
    logger.error({ err: e?.message || e, reqId: (req as any).id }, 'coords error');
    return res.status(500).json({ error: e?.message || 'Proxy error' });
  }
});

app.get('/health', (_req, res) => {
  res.json({ ok: true, ai: !!ai });
});

app.get('/metrics', (_req, res) => {
  res.setHeader('Content-Type', 'text/plain; version=0.0.4');
  res.send(register.metrics());
});

const PORT = process.env.PORT || 8787;
app.listen(PORT, () => console.log(`Gemini proxy listo en :${PORT}`));
