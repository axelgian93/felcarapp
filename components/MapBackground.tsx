


import React, { useEffect, useRef } from 'react';


import L from 'leaflet';


import { Location, Driver, CarType, RideStatus } from '../types';


import { MapPin, Locate } from 'lucide-react';


import { useTheme } from '../src/context/ThemeContext';





// Base OSRM endpoint: prefer local/proxy if provided, fallback to public demo


const OSRM_BASE = ((import.meta.env.VITE_OSRM_URL as string | undefined) ?? '').replace(/\/$/, '') || 'http://localhost:5000';
const FALLBACK_OSRM_BASE = 'https://router.project-osrm.org';
const ETA_BASE = ((import.meta.env.VITE_ETA_URL as string | undefined) ?? '').replace(/\/$/, '') || 'http://localhost:8788';





// Fix for default leaflet marker icons


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





// Haversine Distance for Fallback Calculation


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





// Custom SVG Icons (Unchanged logic)


const createCarIcon = (type: CarType, color: string, rotation: number = 0) => {


  let svgContent = '';


  const strokeColor = 'rgba(0,0,0,0.6)';


  const glassColor = '#282c34';


  const size = 48;





  switch (type) {


    case CarType.SUV:


      svgContent = `<svg width="${size}" height="${size}" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><g transform="translate(32, 32) scale(0.9) translate(-32, -32)"><filter id="dropShadow" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.25"/></filter><g filter="url(#dropShadow)"><path d="M14 12 C14 10 16 8 18 8 H46 C48 8 50 10 50 12 V 54 C50 57 48 58 46 58 H18 C16 58 14 57 14 54 Z" fill="${color}" stroke="${strokeColor}" stroke-width="1"/><path d="M16 18 H48 L46 26 H18 Z" fill="${glassColor}"/><rect x="17" y="28" width="30" height="18" rx="2" fill="${color}" fill-opacity="0.9" stroke="rgba(0,0,0,0.1)" stroke-width="0.5"/><path d="M18 48 H46 L45 52 H19 Z" fill="${glassColor}"/><path d="M20 28 V 46" stroke="rgba(0,0,0,0.3)" stroke-width="1.5" stroke-linecap="round"/><path d="M44 28 V 46" stroke="rgba(0,0,0,0.3)" stroke-width="1.5" stroke-linecap="round"/><path d="M14 19 L10 21 V 24 L14 22 Z" fill="${color}" stroke="${strokeColor}" stroke-width="0.5"/><path d="M50 19 L54 21 V 24 L50 22 Z" fill="${color}" stroke="${strokeColor}" stroke-width="0.5"/><path d="M15 9 L19 11 V 8 Z" fill="#FFFDE7"/><path d="M49 9 L45 11 V 8 Z" fill="#FFFDE7"/></g></g></svg>`;


      break;


    case CarType.MOTORCYCLE:


      svgContent = `<svg width="${size}" height="${size}" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><g transform="translate(32, 32) scale(0.85) translate(-32, -32)"><filter id="dropShadow" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="2" stdDeviation="1.5" flood-opacity="0.3"/></filter><g filter="url(#dropShadow)"><path d="M18 20 H46" stroke="#374151" stroke-width="2.5" stroke-linecap="round"/><path d="M29 18 H35 V 52 H29 Z" fill="${color}" stroke="${strokeColor}" stroke-width="1"/><rect x="28" y="34" width="8" height="12" rx="2" fill="#1f2937"/><circle cx="32" cy="38" r="6" fill="#fbbf24" stroke="#000" stroke-width="1"/><path d="M29 18 Q32 15 35 18" fill="#fef3c7"/><rect x="30" y="8" width="4" height="8" rx="1" fill="#374151"/></g></g></svg>`;


      break;


    case CarType.SEDAN:


    default:


      svgContent = `<svg width="${size}" height="${size}" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><g transform="translate(32, 32) scale(0.9) translate(-32, -32)"><filter id="dropShadow" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.25"/></filter><g filter="url(#dropShadow)"><path d="M16 10 C16 8 18 6 22 6 H42 C46 6 48 8 48 10 V 54 C48 57 46 58 42 58 H22 C18 58 16 57 16 54 Z" fill="${color}" stroke="${strokeColor}" stroke-width="1"/><path d="M18 18 C24 16 40 16 46 18 L44 26 H20 Z" fill="${glassColor}"/><path d="M20 26 H44 V 40 H20 Z" fill="${color}" fill-opacity="0.9"/><path d="M21 40 H43 L42 45 H22 Z" fill="${glassColor}"/><path d="M16 19 L12 21 V 23 L16 22 Z" fill="${color}" stroke="${strokeColor}" stroke-width="0.5"/><path d="M48 19 L52 21 V 23 L48 22 Z" fill="${color}" stroke="${strokeColor}" stroke-width="0.5"/><path d="M17 6 L21 9 V 6 Z" fill="#FFFDE7"/><path d="M47 6 L43 9 V 6 Z" fill="#FFFDE7"/><rect x="18" y="56" width="6" height="2" fill="#ef4444" rx="1"/><rect x="40" y="56" width="6" height="2" fill="#ef4444" rx="1"/></g></g></svg>`;


      break;


  }





  return L.divIcon({


    html: `<div style="transform: rotate(${rotation}deg); transition: transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1); width:${size}px; height:${size}px; display:flex; align-items:center; justify-content:center; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));">


            ${svgContent}


           </div>`,


    className: 'custom-car-icon',


    iconSize: [size, size],


    iconAnchor: [size / 2, size / 2]


  });


};





interface MapBackgroundProps {


  userLocation: Location;


  pickupLocation: Location; 


  destinationLocation: Location | null;


  availableDrivers: Driver[]; 


  assignedDriver: Driver | null;


  isSearching: boolean; 


  isPickingOnMap: boolean;


  status: RideStatus;


  onCenterChange: (lat: number, lng: number) => void;


  onStartPickDestination: () => void;


  onLocate: () => void;


  gpsSignal: number;


  uiBottomPadding: number;


}





export const MapBackground: React.FC<MapBackgroundProps> = ({ 


  userLocation, 


  pickupLocation,


  destinationLocation, 


  availableDrivers,


  assignedDriver,


  isSearching = false,


  isPickingOnMap = false,


  status = RideStatus.IDLE,


  onCenterChange,


  onStartPickDestination,


  onLocate,


  gpsSignal = 0,


  uiBottomPadding = 0


}) => {


  const mapContainerRef = useRef<HTMLDivElement>(null);


  const mapInstanceRef = useRef<L.Map | null>(null);


  const tileLayerRef = useRef<L.TileLayer | null>(null);


  


  const userMarkerRef = useRef<L.Marker | null>(null);


  const pickupMarkerRef = useRef<L.Marker | null>(null);


  const destMarkerRef = useRef<L.Marker | null>(null);


  const routeLineRef = useRef<L.Polyline | null>(null);


  const routeTooltipRef = useRef<L.Tooltip | null>(null);
  const routeRequestRef = useRef<{ key: string; controller: AbortController } | null>(null);


  const driversMarkersRef = useRef<Map<string, L.Marker>>(new Map());


  


  const { theme } = useTheme();



  const getFitPadding = () => {
    const side = 48;
    const top = 64;
    const bottom = Math.min(280, Math.max(140, uiBottomPadding + 100));
    return {
      paddingTopLeft: [side, top] as [number, number],
      paddingBottomRight: [side, bottom] as [number, number]
    };
  };





  // 1. Initialize Map & Force Initial Center


  useEffect(() => {


    if (mapContainerRef.current && !mapInstanceRef.current) {


      mapInstanceRef.current = L.map(mapContainerRef.current, {


        zoomControl: false,


        attributionControl: false


      }).setView([userLocation.lat, userLocation.lng], 15);





      tileLayerRef.current = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {


        maxZoom: 20,


        subdomains: 'abcd'


      }).addTo(mapInstanceRef.current);





      mapInstanceRef.current.on('moveend', () => {


        if (onCenterChange && mapInstanceRef.current) {


          const center = mapInstanceRef.current.getCenter();


          onCenterChange(center.lat, center.lng);


        }


      });


    }


    // Force center immediately on mount if location exists


    if (mapInstanceRef.current && userLocation.lat !== -2.1894) {


       mapInstanceRef.current.setView([userLocation.lat, userLocation.lng], 16);


    }





    return () => {


      if (mapInstanceRef.current) {


        mapInstanceRef.current.off();


        mapInstanceRef.current.remove();


        mapInstanceRef.current = null;


      }


    };


  }, []);





  // 2. Handle Theme


  useEffect(() => {


    if (mapInstanceRef.current && tileLayerRef.current) {


      const darkUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';


      const lightUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';


      tileLayerRef.current.setUrl(theme === 'dark' ? darkUrl : lightUrl);


    }


  }, [theme]);





  // 3. GPS FlyTo Interaction


  useEffect(() => {


      if (mapInstanceRef.current && gpsSignal > 0) {


          const map = mapInstanceRef.current;


          map.flyTo([userLocation.lat, userLocation.lng], 16, {


              duration: 1.0,


              easeLinearity: 0.5


          });


          if (uiBottomPadding > 0) {


              map.once('moveend', () => {


                  const size = map.getSize();


                  const panelHeight = Math.min(uiBottomPadding, size.y);


                  const visibleCenterY = Math.max(0, (size.y - panelHeight) / 2);


                  const point = map.latLngToContainerPoint([userLocation.lat, userLocation.lng]);


                  const deltaY = point.y - visibleCenterY;


                  if (Math.abs(deltaY) > 1) {


                      map.panBy([0, deltaY], { animate: true });


                  }


              });


          }


      }


  }, [gpsSignal, uiBottomPadding, userLocation.lat, userLocation.lng]);





  // 4. CAMERA AUTO-FIT LOGIC (Dynamic Centering & Tracking)


  useEffect(() => {


      const map = mapInstanceRef.current;


      if (!map || isPickingOnMap) return;

      if (routeLineRef.current) return;





      // Ideally, fit to the ROUTE LINE if available to show full path context


      if (routeLineRef.current && (status === RideStatus.DRIVER_ASSIGNED || status === RideStatus.IN_PROGRESS)) {


          // Only refit if we haven't moved manually 


          // For this demo, we want to follow the action.


          // We create a bounds that includes the driver and the target + some route context


      }





      const bounds = L.latLngBounds([]);


      let hasPoints = false;





      // Scenario A: Driver Coming to Pickup (DRIVER_ASSIGNED)


      // Show Driver and Pickup Point


      if (status === RideStatus.DRIVER_ASSIGNED && assignedDriver && pickupLocation) {


          bounds.extend([assignedDriver.coords.lat, assignedDriver.coords.lng]);


          bounds.extend([pickupLocation.lat, pickupLocation.lng]);


          hasPoints = true;


      }


      // Scenario B: Driving to Destination (IN_PROGRESS)


      // Show Driver (User inside) and Destination


      else if (status === RideStatus.IN_PROGRESS && assignedDriver && destinationLocation) {


          bounds.extend([assignedDriver.coords.lat, assignedDriver.coords.lng]);


          bounds.extend([destinationLocation.lat, destinationLocation.lng]);


          hasPoints = true;


      }


      // Scenario C: Planning (IDLE/CHOOSING)


      // Show Pickup and Dest


      else if ((status === RideStatus.IDLE || status === RideStatus.CHOOSING) && pickupLocation && destinationLocation) {


          bounds.extend([pickupLocation.lat, pickupLocation.lng]);


          bounds.extend([destinationLocation.lat, destinationLocation.lng]);


          hasPoints = true;


      }





      if (hasPoints && bounds.isValid()) {

          const { paddingTopLeft, paddingBottomRight } = getFitPadding();
          map.fitBounds(bounds, { paddingTopLeft, paddingBottomRight, maxZoom: 15, animate: true, duration: 1 });

      }





  }, [status, assignedDriver?.coords?.lat, assignedDriver?.coords?.lng, pickupLocation, destinationLocation, isPickingOnMap, uiBottomPadding]);








  // 5. ROUTE DRAWING LOGIC (Async with Fallback)


  useEffect(() => {


    const map = mapInstanceRef.current;


    if (!map) return;





    let routeStart: Location | null = null;


    let routeEnd: Location | null = null;


    let showPickupMarker = false;


    let showDestMarker = false;





    // Determine Route Points


    if (status === RideStatus.DRIVER_ASSIGNED && assignedDriver && pickupLocation) {


        routeStart = assignedDriver.coords;


        routeEnd = pickupLocation;


        showPickupMarker = true;


    } else if (status === RideStatus.IN_PROGRESS && assignedDriver && destinationLocation) {


        routeStart = assignedDriver.coords;


        routeEnd = destinationLocation;


        showDestMarker = true;


    } else if (pickupLocation && destinationLocation && !isPickingOnMap) {


        routeStart = pickupLocation;


        routeEnd = destinationLocation;


        showPickupMarker = true;


        showDestMarker = true;


    } else if (status === RideStatus.IDLE && pickupLocation) {


        showPickupMarker = true;


    }





    // Update Markers Visibility


    if (showPickupMarker && pickupLocation) {


        if (!pickupMarkerRef.current) pickupMarkerRef.current = L.marker([pickupLocation.lat, pickupLocation.lng]).addTo(map);


        else pickupMarkerRef.current.setLatLng([pickupLocation.lat, pickupLocation.lng]);


    } else if (pickupMarkerRef.current) {


        pickupMarkerRef.current.remove(); pickupMarkerRef.current = null;


    }





    if (showDestMarker && destinationLocation) {


        if (!destMarkerRef.current) destMarkerRef.current = L.marker([destinationLocation.lat, destinationLocation.lng]).addTo(map);


        else destMarkerRef.current.setLatLng([destinationLocation.lat, destinationLocation.lng]);


    } else if (destMarkerRef.current) {


        destMarkerRef.current.remove(); destMarkerRef.current = null;


    }





    // Draw Route


    if (routeStart && routeEnd && !isPickingOnMap) {


        drawRoute(map, routeStart, routeEnd, status, theme, routeLineRef, routeTooltipRef, routeRequestRef, getFitPadding());


    } else {


        // Clear route if not valid


        if (routeLineRef.current) { routeLineRef.current.remove(); routeLineRef.current = null; }


        if (routeTooltipRef.current) { routeTooltipRef.current.remove(); routeTooltipRef.current = null; }


    }





  }, [status, assignedDriver?.id, pickupLocation, destinationLocation, isPickingOnMap, theme]); 








  // --- USER GPS DOT ---


  useEffect(() => {


    const map = mapInstanceRef.current;


    if (!map) return;


    // Only show user dot if not inside a car in progress (optional visual preference)


    // But keeping it always visible is good for reference.


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


  }, [userLocation]);





  // --- DRIVERS MARKERS ---


  useEffect(() => {


    const map = mapInstanceRef.current;


    if (!map) return;


    const driversToShow = assignedDriver ? [assignedDriver] : availableDrivers;


    const currentIds = new Set(driversToShow.map(d => d.id));





    // Remove old


    driversMarkersRef.current.forEach((marker, id) => {


      if (!currentIds.has(id)) { marker.remove(); driversMarkersRef.current.delete(id); }


    });





    // Add/Update


    driversToShow.forEach(driver => {


      const isAssigned = assignedDriver?.id === driver.id;


      if (driversMarkersRef.current.has(driver.id)) {


        const marker = driversMarkersRef.current.get(driver.id)!;


        marker.setLatLng([driver.coords.lat, driver.coords.lng]);


        marker.setZIndexOffset(isAssigned ? 1000 : 500);


      } else {


        const marker = L.marker([driver.coords.lat, driver.coords.lng], {


          icon: createCarIcon(driver.carType, driver.carColor),


          zIndexOffset: isAssigned ? 1000 : 500


        }).addTo(map);


        driversMarkersRef.current.set(driver.id, marker);


      }


    });


  }, [availableDrivers, assignedDriver]);





  // Locate Button Handler


  const handleLocateUser = () => { if (onLocate) onLocate(); };





  return (


    <div className="relative w-full h-full">


      <div ref={mapContainerRef} className="absolute inset-0 w-full h-full bg-gray-200 dark:bg-gray-800" />


      


      <button onClick={handleLocateUser} className="absolute bottom-28 right-4 z-[400] bg-white dark:bg-slate-900 p-3 rounded-full shadow-xl border border-gray-100 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900/70 transition active:scale-95 text-gray-700 dark:text-slate-300">

         <Locate size={24} />

      </button>




      {!isPickingOnMap && !isSearching && status === RideStatus.IDLE && onStartPickDestination && (


        <button onClick={onStartPickDestination} className="absolute bottom-44 right-4 z-[400] bg-white dark:bg-slate-900 p-3 rounded-full shadow-xl border border-gray-100 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900/70 hover:scale-105 transition active:scale-95">

           <MapPin size={24} className="text-black dark:text-slate-100" />

        </button>

      )}




      {isPickingOnMap && (


        <div className="absolute inset-0 pointer-events-none z-[1000] flex items-center justify-center pb-8">


           <div className="relative flex flex-col items-center animate-bounce-small">


              <div className="text-black dark:text-slate-100 drop-shadow-xl">


                 <MapPin size={48} fill={theme === 'dark' ?  'white' : 'black'} className="text-black dark:text-slate-100 dark:text-white" />


              </div>


              <div className="w-2 h-2 bg-black/50 rounded-full blur-sm mt-[-2px]"></div>


           </div>


        </div>


      )}


    </div>


  );


};





// --- ROUTE DRAWING ---





async function drawRoute(


    map: L.Map, 


    start: Location, 


    end: Location, 


    status: RideStatus, 


    theme: string, 


    routeLineRef: React.MutableRefObject<L.Polyline | null>,
    tooltipRef: React.MutableRefObject<L.Tooltip | null>,
    routeRequestRef: React.MutableRefObject<{ key: string; controller: AbortController } | null>,
    padding: { paddingTopLeft: [number, number]; paddingBottomRight: [number, number] }


) {


    let lineColor = theme === 'dark' ?  '#60a5fa' : 'black';


    if (status === RideStatus.DRIVER_ASSIGNED) lineColor = '#10b981';

    const routeKey = `${start.lat},${start.lng}:${end.lat},${end.lng}:${status}`;

    if (routeRequestRef.current?.key === routeKey && routeLineRef.current) {
        routeLineRef.current.setStyle({ color: lineColor, weight: 5, dashArray: undefined, opacity: 0.8 });
        return;
    }

    if (routeRequestRef.current?.controller) {
        routeRequestRef.current.controller.abort();
    }

    const controller = new AbortController();
    routeRequestRef.current = { key: routeKey, controller };
    const { signal } = controller;





    // Helper for Fallback (Straight Line)


    const drawFallback = () => {


        const { paddingTopLeft, paddingBottomRight } = padding;


        if (routeLineRef.current) {


            routeLineRef.current.setLatLngs([[start.lat, start.lng], [end.lat, end.lng]]);


            routeLineRef.current.setStyle({ dashArray: '10, 10', weight: 4, color: lineColor, opacity: 0.6 });


        } else {


            routeLineRef.current = L.polyline([[start.lat, start.lng], [end.lat, end.lng]], {


                color: lineColor, weight: 4, opacity: 0.6, dashArray: '10, 10'


            }).addTo(map);


        }


        


        const distKm = getDistanceKm(start.lat, start.lng, end.lat, end.lng).toFixed(1);


        const center = L.latLng(


            (start.lat + end.lat) / 2,


            (start.lng + end.lng) / 2


        );


        


        if (tooltipRef.current) {


            tooltipRef.current.setLatLng(center).setContent(`${distKm} km`);


        } else {


            tooltipRef.current = L.tooltip({ permanent: true, direction: 'center', className: 'route-tooltip' })


                .setLatLng(center)


                .setContent(`${distKm} km`)


                .addTo(map);


        }


        // Ajustar vista para incluir ruta completa y la ciudad


        if (routeLineRef.current) {


            const bounds = routeLineRef.current.getBounds().extend([start.lat, start.lng]).extend([end.lat, end.lng]);


            map.fitBounds(bounds, { paddingTopLeft, paddingBottomRight, maxZoom: 15 });


        }


    };





    try {


        const { paddingTopLeft, paddingBottomRight } = padding;


        const fetchRoute = async (baseUrl: string) => {


            const url = `${baseUrl}/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`;


            const response = await fetch(url, { signal });


            if (!response.ok) throw new Error("Fetch failed");


            const data = await response.json();


            if (data.code !== 'Ok' || !data.routes?.[0]?.geometry?.coordinates?.length) {


                throw new Error("No route");


            }


            return data;


        };


        const fetchRouteFromEta = async () => {


            const response = await fetch(`${ETA_BASE}/eta`, {


                method: 'POST',


                headers: { 'Content-Type': 'application/json' },
                signal,


                body: JSON.stringify({


                    startLat: start.lat,


                    startLng: start.lng,


                    endLat: end.lat,


                    endLng: end.lng,


                    mode: 'car'


                })


            });


            if (!response.ok) throw new Error('ETA route fetch failed');


            const data = await response.json();


            if (!data?.routeGeoJson?.coordinates?.length) throw new Error('ETA route missing geometry');


            return data;


        };


        let data;


        try {


            data = await fetchRouteFromEta();


        } catch (error) {

            if (signal.aborted) return;

            const allowOsrmDirect = Boolean((import.meta.env.VITE_OSRM_URL as string | undefined) ?? '');
            if (!allowOsrmDirect) throw error;

            try {

                data = await fetchRoute(OSRM_BASE);

            } catch (fallbackError) {

                if (signal.aborted) return;

                if (OSRM_BASE !== FALLBACK_OSRM_BASE) {

                    data = await fetchRoute(FALLBACK_OSRM_BASE);

                } else {

                    throw fallbackError;

                }

            }

        }

        if (signal.aborted) return;

        const route = data.routes?.[0];


        const geometry = route?.geometry || data.routeGeoJson;


        const coords = geometry.coordinates.map((c: number[]) => [c[1], c[0]]);


        const distKm = ((route?.distance ?? (data.distanceKm ?? 0) * 1000) / 1000).toFixed(1);


        const timeMin = Math.round((route?.duration ?? (data.etaMinutes ?? 0) * 60) / 60);





        if (routeLineRef.current) {


            routeLineRef.current.setLatLngs(coords);


            routeLineRef.current.setStyle({ color: lineColor, weight: 5, dashArray: undefined, opacity: 0.8 });


        } else {


            routeLineRef.current = L.polyline(coords, { color: lineColor, weight: 5, opacity: 0.8 }).addTo(map);


        }





        // Update tooltip


        const centerPoint = coords[Math.floor(coords.length / 2)];


        if (tooltipRef.current) {


            tooltipRef.current.setLatLng(centerPoint as L.LatLngExpression).setContent(`${timeMin} min  ${distKm} km`);


        } else {


            tooltipRef.current = L.tooltip({ permanent: true, direction: 'center', className: 'route-tooltip' })


                .setLatLng(centerPoint as L.LatLngExpression)


                .setContent(`${timeMin} min  ${distKm} km`)


                .addTo(map);


        }





        // Ajustar vista al trazar la ruta completa


        if (routeLineRef.current) {


            const bounds = routeLineRef.current.getBounds().extend([start.lat, start.lng]).extend([end.lat, end.lng]);


            map.fitBounds(bounds, { paddingTopLeft, paddingBottomRight, maxZoom: 15 });


        }





    } catch (e) {


        drawFallback();


    }


}








