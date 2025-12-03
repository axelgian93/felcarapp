
import { Location } from '../../types';

const RECENT_PLACES_KEY = 'felcar_recent_places';
const MAX_RECENT = 5;

export const PlacesService = {
  getRecentPlaces: (): Location[] => {
    try {
      const stored = localStorage.getItem(RECENT_PLACES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.warn("Error reading recent places", e);
      return [];
    }
  },

  addRecentPlace: (place: Location) => {
    if (!place || !place.address) return;
    
    try {
        const current = PlacesService.getRecentPlaces();
        
        // Filter out existing entries with same address to avoid duplicates
        const filtered = current.filter(p => p.address !== place.address);
        
        // Add new place to the beginning
        const updated = [place, ...filtered].slice(0, MAX_RECENT);
        
        localStorage.setItem(RECENT_PLACES_KEY, JSON.stringify(updated));
    } catch (e) {
        console.warn("Error saving recent place", e);
    }
  }
};
