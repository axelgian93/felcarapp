
import { Location } from '../../types';

interface NominatimResult {
  place_id: number;
  lat: string;
  lon: string;
  name: string;
  display_name: string;
  class: string;
  type: string;
  importance: number;
  address: {
    road?: string;
    suburb?: string;
    city?: string;
    town?: string;
    state?: string;
    neighbourhood?: string;
    shop?: string;
    amenity?: string;
    building?: string;
  };
}

// Centro Geográfico de referencia
const GYE_CENTER = { lat: -2.1600, lng: -79.9000 };

const getDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; 
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const translateType = (type: string): string => {
    const dict: Record<string, string> = {
        'mall': 'Centro Comercial',
        'shopping_mall': 'Centro Comercial',
        'supermarket': 'Supermercado',
        'restaurant': 'Restaurante',
        'university': 'Universidad',
        'hospital': 'Hospital',
        'stadium': 'Estadio',
        'bus_station': 'Terminal',
        'aerodrome': 'Aeropuerto',
        'park': 'Parque',
        'residential': 'Residencial',
        'cinema': 'Cine',
        'bank': 'Banco'
    };
    return dict[type] || '';
};

export const MapService = {
  searchAddress: async (query: string): Promise<Location[]> => {
    if (!query || query.trim().length < 3) return [];

    // --- STRATEGY: 2-STEP SEARCH ---
    
    // 1. Try standard search with context injection
    let results = await fetchNominatim(query, true);

    // 2. If specific search fails (e.g. "Mall del Norte" might fail with strict viewbox),
    // try a broader search appending city name explicitly and relaxing bounds.
    if (results.length === 0 && !query.toLowerCase().includes('guayaquil')) {
        // console.log("Retrying with broad search...");
        results = await fetchNominatim(`${query} Guayaquil`, false);
    }

    return processResults(results, query);
  },

  getAddressFromCoords: async (lat: number, lng: number): Promise<string> => {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&email=demo@felcar.app`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Network error");
      const data = await response.json();
      
      if (data.name) return data.name;
      
      const addr = data.address || {};
      const parts = [addr.road, addr.neighbourhood || addr.suburb].filter(Boolean);
      return parts.join(', ') || 'Ubicación seleccionada';
    } catch (error) {
      return 'Ubicación en mapa';
    }
  }
};

// --- INTERNAL HELPERS ---

async function fetchNominatim(query: string, strictBounds: boolean): Promise<NominatimResult[]> {
    try {
        // Widen the box significantly to include North (Daule/Sambo) and South
        // West, North, East, South
        const viewbox = '-80.30,-1.50,-79.50,-2.60'; 
        
        let url = `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(query)}&limit=15&addressdetails=1&extratags=1&email=demo@felcar.app`;
        
        if (strictBounds) {
            // In strict mode, use viewbox and bounded=1
            // Also inject context if missing
            if (!query.toLowerCase().includes('ecuador')) {
                url = `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(query + ", Guayas, Ecuador")}&limit=15&viewbox=${viewbox}&bounded=1&addressdetails=1&email=demo@felcar.app`;
            }
        } else {
            // In broad mode, no bounded=1, let it search globally but prioritize viewbox
            url += `&viewbox=${viewbox}`; 
        }

        const response = await fetch(url, { headers: { 'Accept-Language': 'es-EC,es;q=0.9' } });
        if (!response.ok) return [];
        return await response.json();
    } catch (e) {
        return [];
    }
}

function processResults(data: NominatimResult[], query: string): Location[] {
    const uniqueResults: Location[] = [];
    const seenNames = new Set<string>();
    const normQuery = query.toLowerCase().trim();

    data.forEach((item) => {
        const lat = parseFloat(item.lat);
        const lng = parseFloat(item.lon);

        // 1. Distance Filter (Post-Processing)
        // Discard anything > 40km from center (Catches bad results from other countries)
        const dist = getDistanceKm(lat, lng, GYE_CENTER.lat, GYE_CENTER.lng);
        if (dist > 40) return;

        // 2. Formatting
        let title = item.name || item.display_name.split(',')[0];
        const typeLabel = translateType(item.type || item.class);
        const addr = item.address || {};
        
        const contextParts = [];
        if (typeLabel) contextParts.push(typeLabel);
        if (addr.neighbourhood) contextParts.push(addr.neighbourhood);
        else if (addr.suburb) contextParts.push(addr.suburb);
        
        // Important: Show "Via Daule" or "Samborondon" if applicable
        if (addr.city && addr.city !== 'Guayaquil') contextParts.push(addr.city);
        else if (addr.town) contextParts.push(addr.town);

        const subtitle = contextParts.join(' • ') || 'Guayaquil';

        // 3. Deduplication
        const normName = title.toLowerCase().trim();
        let isDuplicate = false;
        
        if (seenNames.has(normName)) {
            // Check spatial duplicate (same location)
            const existing = uniqueResults.find(r => r.address?.toLowerCase().trim() === normName);
            if (existing) {
                const d = getDistanceKm(lat, lng, existing.lat, existing.lng);
                // If it's very close (< 500m), it's a duplicate node/way from OSM.
                // If it's far, it might be a different branch (e.g. McDonald's Centro vs McDonald's Norte)
                if (d < 0.5) isDuplicate = true; 
            }
        }

        if (!isDuplicate) {
            seenNames.add(normName);

            // Boost score if title matches query closely
            let scoreBoost = 0;
            if (normName.startsWith(normQuery)) scoreBoost += 3;
            else if (normName.includes(normQuery)) scoreBoost += 2;
            else {
              const tokens = normQuery.split(/\s+/);
              const matches = tokens.filter(t => normName.includes(t)).length;
              scoreBoost += matches * 0.5;
            }

            uniqueResults.push({
                lat, lng, address: title, subtitle,
                // @ts-ignore
                _importance: (item.importance || 0) + scoreBoost
            });
        }
    });

    // 4. Sort by Importance (Promote Malls/Commercial areas + text match)
    uniqueResults.sort((a: any, b: any) => b._importance - a._importance);

    return uniqueResults.slice(0, 8);
}
