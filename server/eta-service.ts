import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { randomUUID } from 'crypto';
import pino from 'pino';
import pinoHttp from 'pino-http';
import client from 'prom-client';

type Mode = 'car' | 'moto' | 'van';

interface EtaRequest {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  mode?: Mode;
  cooperativeId?: string;
}

interface EtaResponse {
  distanceKm: number;
  etaMinutes: number;
  confidence: number;
  source: 'default' | 'fleet' | 'historic' | 'blended' | 'external';
  routeGeoJson?: any;
}

// Logger
const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

// Metrics
const register = new client.Registry();
client.collectDefaultMetrics({ register });
const httpCounter = new client.Counter({
  name: 'eta_http_requests_total',
  help: 'HTTP requests',
  labelNames: ['route', 'method', 'status'],
  registers: [register],
});
const httpDuration = new client.Histogram({
  name: 'eta_http_request_duration_seconds',
  help: 'HTTP request duration seconds',
  labelNames: ['route'],
  buckets: [0.1, 0.3, 0.5, 1, 2, 5, 10],
  registers: [register],
});
const osrmDuration = new client.Histogram({
  name: 'eta_osrm_duration_seconds',
  help: 'OSRM call duration seconds',
  labelNames: ['route'],
  buckets: [0.05, 0.1, 0.2, 0.5, 1, 2],
  registers: [register],
});
const cacheHits = new client.Counter({
  name: 'eta_cache_hits_total',
  help: 'ETA cache hits',
  labelNames: ['cache'],
  registers: [register],
});
const cacheMiss = new client.Counter({
  name: 'eta_cache_misses_total',
  help: 'ETA cache misses',
  labelNames: ['cache'],
  registers: [register],
});

const app = express();
app.use(cors());
app.use(express.json());

// request id middleware
app.use((req: Request, _res: Response, next: NextFunction) => {
  (req as any).id = req.headers['x-request-id'] || randomUUID();
  next();
});
app.use(pinoHttp({ logger }));

const PORT = process.env.PORT || 8788;
const OSRM_BASE = (process.env.OSRM_URL || 'http://localhost:5000').replace(/\/$/, '');

// Default speeds by mode (km/h) used while no telemetry service exists.
const DEFAULT_SPEEDS: Record<Mode, number> = {
  car: 35,
  moto: 40,
  van: 30,
};

// Simple in-memory cache for recent OSRM/ETA lookups to reduce churn.
type CacheEntry<T> = { value: T; expires: number };
const routeCache = new Map<string, CacheEntry<{ distanceKm: number; geometry: any }>>();
const etaCache = new Map<string, CacheEntry<EtaResponse>>();
const CACHE_TTL_MS = 15_000; // 15s suited for moving vehicles

const now = () => Date.now();

function makeKey(parts: (string | number | undefined)[]) {
  return parts
    .map((p) => {
      if (typeof p === 'number') return p.toFixed(4); // ~11m precision to improve cache hits
      return String(p ?? '');
    })
    .join('|');
}

// Placeholder: in futuro, leer de Redis/DB con velocidades recientes.
async function getEffectiveSpeedKph(mode: Mode): Promise<{ kph: number; source: EtaResponse['source']; confidence: number }> {
  return { kph: DEFAULT_SPEEDS[mode] ?? DEFAULT_SPEEDS.car, source: 'default', confidence: 0.2 };
}

async function getRoute(startLat: number, startLng: number, endLat: number, endLng: number) {
  const key = makeKey(['route', startLat, startLng, endLat, endLng]);
  const cached = routeCache.get(key);
  if (cached && cached.expires > now()) {
    cacheHits.inc({ cache: 'route' });
    return cached.value;
  }
  cacheMiss.inc({ cache: 'route' });

  const startOsrm = process.hrtime.bigint();
  const url = `${OSRM_BASE}/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`;
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`OSRM error ${resp.status}`);
  const data = await resp.json();
  if (data.code !== 'Ok' || !data.routes?.[0]) throw new Error('OSRM no route');
  const route = data.routes[0];
  const value = {
    distanceKm: route.distance / 1000,
    geometry: route.geometry,
  };
  const dur = Number(process.hrtime.bigint() - startOsrm) / 1e9;
  osrmDuration.observe({ route: 'route' }, dur);
  routeCache.set(key, { value, expires: now() + CACHE_TTL_MS });
  return value;
}

app.post('/eta', async (req: Request, res: Response) => {
  const body = req.body as EtaRequest;
  const { startLat, startLng, endLat, endLng } = body;
  const mode: Mode = (body.mode as Mode) || 'car';

  if ([startLat, startLng, endLat, endLng].some((v) => typeof v !== 'number')) {
    return res.status(400).json({ error: 'Parámetros inválidos' });
  }

  try {
    const cacheKey = makeKey(['eta', startLat, startLng, endLat, endLng, mode]);
    const cached = etaCache.get(cacheKey);
    if (cached && cached.expires > now()) {
      cacheHits.inc({ cache: 'eta' });
      return res.json(cached.value);
    }
    cacheMiss.inc({ cache: 'eta' });
    const start = process.hrtime.bigint();

    const [{ distanceKm, geometry }, speedInfo] = await Promise.all([
      getRoute(startLat, startLng, endLat, endLng),
      getEffectiveSpeedKph(mode),
    ]);

    const etaHours = distanceKm / Math.max(speedInfo.kph, 5);
    const etaMinutes = Math.round(etaHours * 60 + 2); // +2 min buffer

    const response: EtaResponse = {
      distanceKm: Number(distanceKm.toFixed(2)),
      etaMinutes,
      confidence: speedInfo.confidence,
      source: speedInfo.source,
      routeGeoJson: geometry,
    };

    etaCache.set(cacheKey, { value: response, expires: now() + CACHE_TTL_MS });
    const dur = Number(process.hrtime.bigint() - start) / 1e9;
    httpDuration.observe({ route: 'eta' }, dur);
    httpCounter.inc({ route: 'eta', method: 'POST', status: '200' });
    return res.json(response);
  } catch (err: any) {
    httpCounter.inc({ route: 'eta', method: 'POST', status: '500' });
    logger.error({ err: err?.message || err, reqId: (req as any).id }, 'ETA error');
    return res.status(500).json({ error: err?.message || 'ETA service error' });
  }
});

app.get('/health', async (_req, res) => {
  try {
    const testUrl = `${OSRM_BASE}/route/v1/driving/-79.8891,-2.1894;-79.8891,-2.1894?overview=false`;
    const r = await fetch(testUrl, { method: 'GET' });
    const ok = r.ok;
    return res.json({ ok, osrm: ok ? 'up' : 'down' });
  } catch (e) {
    return res.status(500).json({ ok: false, osrm: 'down' });
  }
});

app.get('/metrics', async (_req, res) => {
  res.setHeader('Content-Type', 'text/plain; version=0.0.4');
  res.send(await register.metrics());
});

app.listen(PORT, () => console.log(`ETA service running on :${PORT} using OSRM ${OSRM_BASE}`));
