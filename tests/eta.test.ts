import { describe, it, expect } from 'vitest';

// Simple contract test against local ETA service
const ETA_URL = process.env.VITE_ETA_URL || 'http://localhost:8788';

describe('ETA service', () => {
  it('should return distance and eta', async () => {
    const res = await fetch(`${ETA_URL}/eta`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        startLat: -2.1701,
        startLng: -79.9224,
        endLat: -2.1461,
        endLng: -79.9640,
        mode: 'car'
      })
    });
    expect(res.ok).toBe(true);
    const data = await res.json();
    expect(data.distanceKm).toBeGreaterThan(0);
    expect(data.etaMinutes).toBeGreaterThan(0);
  });
});
