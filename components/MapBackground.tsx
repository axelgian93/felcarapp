
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Location, Driver, CarType } from '../types';
import { MapPin, Locate } from 'lucide-react';

// Fix for default leaflet marker icons in React
const iconRetinaUrl = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png';
const iconUrl = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png';
const shadowUrl = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png';

L.Marker.prototype.options.icon = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});

// Custom SVG Icons based on Type and Color
const createCarIcon = (type: CarType, color: string, rotation: number = 0) => {
  let svgContent = '';
  
  // Outline color (darker version of fill or black)
  const stroke = '#000000'; // subtle border
  const glassColor = '#334155'; // Dark window tint
  const headlightColor = '#FEF08A'; // Yellowish light
  const taillightColor = '#DC2626'; // Red light
  const size = 44; // Slightly larger for details

  // Note: Icons are drawn facing UP (North) in the SVG ViewBox 0 0 64 64.
  // Center is roughly 32, 32.
  
  switch (type) {
    case CarType.SUV:
      // Boxier, larger shape with roof rails
      svgContent = `
        <svg width="${size}" height="${size}" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g>
            <!-- Drop Shadow -->
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.4"/>
            </filter>
            
            <g filter="url(#shadow)">
              <!-- Chassis Main Body -->
              <path d="M14 16 C14 10, 50 10, 50 16 V 54 C 50 58, 14 58, 14 54 Z" fill="${color}" stroke="${stroke}" stroke-width="1"/>
              
              <!-- Hood Detail -->
              <path d="M16 16 L48 16 L46 24 H18 Z" fill="rgba(0,0,0,0.1)"/>

              <!-- Windshield (Front) -->
              <path d="M16 22 Q32 18 48 22 L46 30 Q32 28 18 30 Z" fill="${glassColor}"/>
              
              <!-- Roof -->
              <rect x="16" y="30" width="32" height="16" rx="2" fill="${color}"/>
              <!-- Roof Rails -->
              <rect x="18" y="30" width="2" height="16" fill="rgba(0,0,0,0.2)"/>
              <rect x="44" y="30" width="2" height="16" fill="rgba(0,0,0,0.2)"/>

              <!-- Rear Window -->
              <path d="M18 46 H46 L44 50 H20 Z" fill="${glassColor}"/>

              <!-- Side Mirrors -->
              <path d="M14 24 L10 22 L10 26 Z" fill="${color}" stroke="${stroke}" stroke-width="0.5"/>
              <path d="M50 24 L54 22 L54 26 Z" fill="${color}" stroke="${stroke}" stroke-width="0.5"/>

              <!-- Headlights -->
              <path d="M15 10 L22 12 L22 10 Z" fill="${headlightColor}"/>
              <path d="M49 10 L42 12 L42 10 Z" fill="${headlightColor}"/>

              <!-- Taillights -->
              <rect x="15" y="56" width="8" height="2" fill="${taillightColor}"/>
              <rect x="41" y="56" width="8" height="2" fill="${taillightColor}"/>
            </g>
          </g>
        </svg>
      `;
      break;

    case CarType.MOTORCYCLE:
      // Slim shape, helmet visible
      svgContent = `
        <svg width="${size}" height="${size}" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g filter="url(#shadow)">
             <!-- Front Wheel -->
             <rect x="29" y="6" width="6" height="8" rx="2" fill="#1e293b"/>
             
             <!-- Body Fairing -->
             <path d="M26 14 H38 L36 26 H28 Z" fill="${color}" stroke="${stroke}" stroke-width="1"/>
             
             <!-- Handlebars -->
             <path d="M20 18 H44" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
             <circle cx="20" cy="18" r="2" fill="#1e293b"/>
             <circle cx="44" cy="18" r="2" fill="#1e293b"/>

             <!-- Seat -->
             <path d="M28 26 H36 V 42 H28 Z" fill="#1e293b"/>
             
             <!-- Rear Fender -->
             <path d="M29 42 H35 V 48 H29 Z" fill="${color}"/>
             
             <!-- Rear Wheel -->
             <rect x="29" y="46" width="6" height="8" rx="2" fill="#1e293b"/>

             <!-- Rider Helmet (Circle) -->
             <circle cx="32" cy="30" r="6" fill="#fbbf24" stroke="black" stroke-width="1"/>
             <!-- Rider Shoulders -->
             <path d="M24 32 Q32 28 40 32" stroke="${color}" stroke-width="4" stroke-linecap="round"/>
             
             <!-- Headlight -->
             <path d="M29 14 Q32 12 35 14" fill="${headlightColor}"/>
          </g>
        </svg>
      `;
      break;

    case CarType.SEDAN:
    default:
      // Streamlined, distinct trunk
      svgContent = `
        <svg width="${size}" height="${size}" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
           <g>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.4"/>
            </filter>
            
            <g filter="url(#shadow)">
              <!-- Chassis -->
              <path d="M16 12 Q32 8 48 12 V 52 Q32 56 16 52 Z" fill="${color}" stroke="${stroke}" stroke-width="1"/>
              
              <!-- Windshield (Front) -->
              <path d="M18 20 Q32 16 46 20 L44 26 Q32 24 20 26 Z" fill="${glassColor}"/>
              
              <!-- Roof -->
              <path d="M19 26 H45 V 38 H19 Z" fill="${color}" fill-opacity="0.9"/>
              
              <!-- Rear Window -->
              <path d="M20 38 H44 L42 42 H22 Z" fill="${glassColor}"/>
              
              <!-- Side Mirrors -->
              <path d="M16 22 L12 20 L12 24 Z" fill="${color}" stroke="${stroke}" stroke-width="0.5"/>
              <path d="M48 22 L52 20 L52 24 Z" fill="${color}" stroke="${stroke}" stroke-width="0.5"/>

              <!-- Headlights -->
              <path d="M17 12 L24 14 L24 12 Z" fill="${headlightColor}"/>
              <path d="M47 12 L40 14 L40 12 Z" fill="${headlightColor}"/>

              <!-- Taillights -->
              <path d="M17 52 L24 50 L24 52 Z" fill="${taillightColor}"/>
              <path d="M47 52 L40 50 L40 52 Z" fill="${taillightColor}"/>
              
              <!-- Sunroof (Optional Detail) -->
              <rect x="24" y="28" width="16" height="6" rx="1" fill="rgba(0,0,0,0.2)"/>
            </g>
          </g>
        </svg>
      `;
      break;
  }

  return L.divIcon({
    html: `<div style="transform: rotate(${rotation}deg); transition: transform 0.3s linear; width:${size}px; height:${size}px; display:flex; align-items:center; justify-content:center;">
            ${svgContent}
           </div>`,
    className: 'custom-car-icon',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2]
  });
};

interface MapBackgroundProps {
  userLocation: Location;
  pickupLocation?: Location; 
  destinationLocation?: Location | null;
  availableDrivers: Driver[]; 
  assignedDriver?: Driver | null;
  isSearching?: boolean; 
  isPickingOnMap?: boolean;
  onCenterChange?: (lat: number, lng: number) => void;
  onStartPickDestination?: () => void;
}

export const MapBackground: React.FC<MapBackgroundProps> = ({ 
  userLocation, 
  pickupLocation,
  destinationLocation, 
  availableDrivers,
  assignedDriver,
  isSearching = false,
  isPickingOnMap = false,
  onCenterChange,
  onStartPickDestination
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  
  const userMarkerRef = useRef<L.Marker | null>(null);
  const pickupMarkerRef = useRef<L.Marker | null>(null);
  const destMarkerRef = useRef<L.Marker | null>(null);
  const routeLineRef = useRef<L.Polyline | null>(null);
  const searchPulseRef = useRef<L.Marker | null>(null);
  
  const driversMarkersRef = useRef<Map<string, L.Marker>>(new Map());

  // Initialize Map
  useEffect(() => {
    if (mapContainerRef.current && !mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false
      }).setView([userLocation.lat, userLocation.lng], 15);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 20,
        subdomains: 'abcd'
      }).addTo(mapInstanceRef.current);

      // Listen for drag events
      mapInstanceRef.current.on('moveend', () => {
        if (onCenterChange && mapInstanceRef.current) {
          const center = mapInstanceRef.current.getCenter();
          onCenterChange(center.lat, center.lng);
        }
      });

      // Resize Observer
      resizeObserverRef.current = new ResizeObserver(() => {
        mapInstanceRef.current?.invalidateSize();
      });
      resizeObserverRef.current.observe(mapContainerRef.current);
    }

    // Cleanup function to destroy map and observers on unmount
    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.off();
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Handle Map Picking Mode logic
  useEffect(() => {
     // Logic handled by the overlay div in return
  }, [isPickingOnMap]);

  // Update User/Pickup Markers and Searching Animation
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const effectivePickup = pickupLocation || userLocation;

    // User GPS Marker
    const userIcon = L.divIcon({
      className: 'user-gps-dot',
      html: '<div style="width: 16px; height: 16px; background-color: #3b82f6; border: 3px solid white; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
      iconSize: [16, 16]
    });

    if (!userMarkerRef.current) {
      userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon }).addTo(map);
    } else {
      userMarkerRef.current.setLatLng([userLocation.lat, userLocation.lng]);
    }

    // SEARCHING RADAR ANIMATION
    if (isSearching) {
      const radarIcon = L.divIcon({
        className: 'custom-radar',
        html: `
          <div class="relative">
            <div class="radar-ring"></div>
            <div class="radar-dot"></div>
          </div>
        `,
        iconSize: [0, 0] // Handled by CSS
      });

      if (!searchPulseRef.current) {
        searchPulseRef.current = L.marker([effectivePickup.lat, effectivePickup.lng], { 
          icon: radarIcon,
          zIndexOffset: 100 // Below cars, above map
        }).addTo(map);
      } else {
        searchPulseRef.current.setLatLng([effectivePickup.lat, effectivePickup.lng]);
      }
    } else {
      if (searchPulseRef.current) {
        searchPulseRef.current.remove();
        searchPulseRef.current = null;
      }
    }

    if (!destinationLocation && !isSearching && !isPickingOnMap) {
       // Keep view centered on pickup if not routing and not picking manually
       map.setView([effectivePickup.lat, effectivePickup.lng], map.getZoom());
    }

  }, [userLocation, pickupLocation, destinationLocation, isSearching, isPickingOnMap]);

  // Update Route and Destination (Real Road Routing via OSRM)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const fetchRoute = async (start: Location, end: Location) => {
       try {
         // OSRM uses Lng,Lat format
         const response = await fetch(`https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`);
         const data = await response.json();
         
         if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
            const route = data.routes[0];
            // OSRM returns [lng, lat], Leaflet needs [lat, lng]
            const coordinates = route.geometry.coordinates.map((coord: number[]) => [coord[1], coord[0]]);
            const distanceKm = (route.distance / 1000).toFixed(1);
            const durationMin = Math.round(route.duration / 60);
            
            if (routeLineRef.current) {
               routeLineRef.current.setLatLngs(coordinates);
               routeLineRef.current.setTooltipContent(`${distanceKm} km • ${durationMin} min`);
            } else {
               routeLineRef.current = L.polyline(coordinates, { 
                  color: 'black', 
                  weight: 5, 
                  opacity: 0.8,
                  lineCap: 'round'
               }).addTo(map);
               
               routeLineRef.current.bindTooltip(`${distanceKm} km • ${durationMin} min`, { 
                  permanent: true, 
                  direction: 'center', 
                  className: 'route-tooltip',
                  sticky: true 
               });
            }
            
            // Fit bounds slightly padded
            const bounds = L.latLngBounds(coordinates);
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
         } else {
           // Fallback to straight line if OSRM fails
           drawStraightLine(start, end);
         }
       } catch (e) {
         console.error("Routing error", e);
         drawStraightLine(start, end);
       }
    };

    const drawStraightLine = (start: Location, end: Location) => {
       const latlngs = [
          [start.lat, start.lng],
          [end.lat, end.lng]
       ] as L.LatLngExpression[];

       const startLatLng = L.latLng(start.lat, start.lng);
       const endLatLng = L.latLng(end.lat, end.lng);
       const distanceMeters = startLatLng.distanceTo(endLatLng);
       const distanceKm = (distanceMeters / 1000).toFixed(1);

       if (routeLineRef.current) {
          routeLineRef.current.setLatLngs(latlngs);
          routeLineRef.current.setTooltipContent(`${distanceKm} km (Directo)`);
       } else {
          routeLineRef.current = L.polyline(latlngs, { 
             color: 'black', 
             weight: 4, 
             opacity: 0.7, 
             dashArray: '5, 10' 
          }).addTo(map);
          
          routeLineRef.current.bindTooltip(`${distanceKm} km (Directo)`, { 
             permanent: true, 
             direction: 'center', 
             className: 'route-tooltip',
             sticky: true 
          });
       }
       map.fitBounds(L.latLngBounds(latlngs), { padding: [80, 80], maxZoom: 16 });
    };

    if (destinationLocation && !isPickingOnMap) {
      // 1. Destination Marker
      if (!destMarkerRef.current) {
        destMarkerRef.current = L.marker([destinationLocation.lat, destinationLocation.lng])
          .addTo(map)
          .bindPopup("Destino");
      } else {
        destMarkerRef.current.setLatLng([destinationLocation.lat, destinationLocation.lng]);
      }

      const startPos = pickupLocation || userLocation;
      
      // 2. Pickup Dot (Start of route)
      const startIcon = L.divIcon({
        html: `<div style="background:black; width:12px; height:12px; border-radius:50%; border:2px solid white;"></div>`,
        className: 'pickup-dot',
        iconSize: [12, 12]
      });

      if (!pickupMarkerRef.current) {
        pickupMarkerRef.current = L.marker([startPos.lat, startPos.lng], { icon: startIcon }).addTo(map);
      } else {
        pickupMarkerRef.current.setLatLng([startPos.lat, startPos.lng]);
      }

      // 3. Calculate Real Route
      fetchRoute(startPos, destinationLocation);

    } else {
      // Cleanup if destination removed or picking on map
      if (destMarkerRef.current) { destMarkerRef.current.remove(); destMarkerRef.current = null; }
      if (routeLineRef.current) { routeLineRef.current.remove(); routeLineRef.current = null; }
      if (pickupMarkerRef.current) { pickupMarkerRef.current.remove(); pickupMarkerRef.current = null; }
    }
  }, [destinationLocation, pickupLocation, userLocation, isPickingOnMap]);

  // Handle Drivers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const driversToShow = assignedDriver ? [assignedDriver] : availableDrivers;
    const currentDriverIds = new Set(driversToShow.map(d => d.id));

    // Remove old markers safely
    const driversToRemove: string[] = [];
    driversMarkersRef.current.forEach((marker, id) => {
      if (!currentDriverIds.has(id)) {
        marker.remove();
        driversToRemove.push(id);
      }
    });
    driversToRemove.forEach(id => driversMarkersRef.current.delete(id));

    driversToShow.forEach(driver => {
      const isAssigned = assignedDriver?.id === driver.id;
      const displayColor = isAssigned ? driver.carColor : '#9ca3af'; 
      const zIndex = isAssigned ? 1000 : 500;
      const mockHeading = parseInt(driver.id.split('-')[1] || '0') * 45; 

      if (driversMarkersRef.current.has(driver.id)) {
        const marker = driversMarkersRef.current.get(driver.id)!;
        const oldLatLng = marker.getLatLng();
        
        let rotation = mockHeading;
        if (isAssigned && oldLatLng.lat !== driver.coords.lat) {
           const dx = driver.coords.lng - oldLatLng.lng;
           const dy = driver.coords.lat - oldLatLng.lat;
           // Leaflet 0 degrees is North. Atan2(x,y) gives angle from North clockwise
           rotation = (Math.atan2(dx, dy) * 180) / Math.PI;
        }

        // Only update if position actually changed to prevent DOM thrashing
        if (oldLatLng.lat !== driver.coords.lat || oldLatLng.lng !== driver.coords.lng) {
            marker.setLatLng([driver.coords.lat, driver.coords.lng]);
            // Update icon for rotation/color
            marker.setIcon(createCarIcon(driver.carType, displayColor, rotation));
            marker.setZIndexOffset(zIndex);
        }
      } else {
        const marker = L.marker([driver.coords.lat, driver.coords.lng], {
          icon: createCarIcon(driver.carType, displayColor, mockHeading),
          zIndexOffset: zIndex
        }).addTo(map);
        driversMarkersRef.current.set(driver.id, marker);
      }
    });

  }, [availableDrivers, assignedDriver]);

  // Locating Button Functionality
  const handleLocateUser = () => {
    if(mapInstanceRef.current) {
       mapInstanceRef.current.flyTo([userLocation.lat, userLocation.lng], 15, { duration: 1.5 });
    }
  };

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainerRef} className="absolute inset-0 w-full h-full bg-gray-200" />
      
      {/* GPS Recenter Button */}
      <button 
        onClick={handleLocateUser}
        className="absolute bottom-20 right-4 z-[400] bg-white p-3 rounded-full shadow-xl border border-gray-100 hover:bg-gray-50 transition active:scale-95 text-gray-700"
        title="Mi Ubicación"
      >
         <Locate size={24} />
      </button>

      {/* Map Picking Mode Trigger Button */}
      {!isPickingOnMap && !isSearching && !assignedDriver && onStartPickDestination && (
        <button 
          onClick={onStartPickDestination}
          className="absolute bottom-36 right-4 z-[400] bg-white p-3 rounded-full shadow-xl border border-gray-100 hover:bg-gray-50 hover:scale-105 transition active:scale-95"
          title="Seleccionar destino en el mapa"
        >
           <MapPin size={24} className="text-black" />
           <span className="absolute -top-1 -right-1 flex h-3 w-3">
             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
             <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
           </span>
        </button>
      )}

      {/* Map Selection Pin Overlay */}
      {isPickingOnMap && (
        <div className="absolute inset-0 pointer-events-none z-[1000] flex items-center justify-center pb-8">
           <div className="relative flex flex-col items-center animate-bounce-small">
              <div className="text-black drop-shadow-xl">
                 <MapPin size={48} fill="black" className="text-black" />
              </div>
              <div className="w-2 h-2 bg-black/50 rounded-full blur-sm mt-[-2px]"></div>
           </div>
        </div>
      )}
    </div>
  );
};
