import { ServiceType } from "../types";

const etaBase = (import.meta.env.VITE_ETA_URL as string | undefined)?.replace(/\/$/, '') || 'http://localhost:8788';

export interface EtaResult {
  distanceKm: number;
  etaMinutes: number;
  confidence: number;
  source: 'default' | 'fleet' | 'historic' | 'blended' | 'external';
  routeMs?: number;
  totalMs?: number;
  routeCacheHit?: boolean;
  routeInflightHit?: boolean;
}

const serviceTypeToMode: Record<ServiceType, 'car' | 'moto' | 'van'> = {
  [ServiceType.RIDE]: 'car',
  [ServiceType.DELIVERY]: 'moto',
  [ServiceType.HOURLY]: 'car',
  [ServiceType.TRIP]: 'car',
};

export async function fetchEta(
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number,
  serviceType: ServiceType = ServiceType.RIDE
): Promise<EtaResult | null> {
  try {
    const resp = await fetch(`${etaBase}/eta`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        startLat,
        startLng,
        endLat,
        endLng,
        mode: serviceTypeToMode[serviceType] || 'car'
      })
    });
    if (!resp.ok) throw new Error('ETA fetch failed');
    return await resp.json() as EtaResult;
  } catch (e) {
    console.warn('ETA service unavailable, using fallback', e);
    return null;
  }
}
