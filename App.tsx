
import React, { useState, useEffect, useRef } from 'react';
import { Navigation, Menu, Star, Clock, CreditCard, Phone, ShieldCheck, X, User as UserIcon, CheckCircle2, MapPin, Search, LogOut, MessageSquare, Bell, History, Package, Calendar, Timer, Car, ChevronRight, Home, Briefcase, Map as MapIcon, Locate, Bus, Power, DollarSign, TrendingUp, Navigation2, Bookmark, Share2, AlertTriangle, Gift, Banknote, FileText, Plus, Shield, Building2, Wand2, FastForward } from 'lucide-react';
import { MapBackground } from './components/MapBackground';
import { AuthScreen } from './components/AuthScreen';
import { AdminPanel } from './components/AdminPanel';
import { ChatWindow } from './components/ChatWindow';
import { TripHistory } from './components/TripHistory';
import { RatingModal } from './components/RatingModal';
import { ProfileMenu } from './components/ProfileMenu';
import { SavedPlacesModal } from './components/SavedPlacesModal';
import { PaymentMethodsModal } from './components/PaymentMethodsModal';
import { HelpCenterModal } from './components/HelpCenterModal';
import { DriverEarningsModal } from './components/DriverEarningsModal';
import { CancellationModal } from './components/CancellationModal';
import { RideStatus, RideOption, Location, Driver, User, UserRole, AccountStatus, ChatMessage, TripHistoryItem, ServiceType, ScheduledRide, CarType, PaymentMethod } from './types';
import * as GeminiService from './services/geminiService';
import * as SecurityService from './services/securityService';

// Mock initial location (Guayaquil, Ecuador)
const DEFAULT_LOCATION: Location = { lat: -2.1894, lng: -79.8891 };

// --- MOCK DATABASE ---
const INITIAL_USERS: User[] = [
  {
    id: 'admin-001',
    name: 'Super Admin',
    email: 'admin@admin.com',
    password: 'admin', 
    role: UserRole.ADMIN,
    status: AccountStatus.ACTIVE,
    photoUrl: 'https://ui-avatars.com/api/?name=Admin&background=000&color=fff'
  },
  {
    id: 'rider-demo',
    name: 'Pasajero Gye',
    email: 'rider@demo.com',
    password: '123',
    role: UserRole.RIDER,
    status: AccountStatus.ACTIVE,
    cedula: '0910020030',
    phone: '0991234567',
    rating: 4.8, // Added Rider Rating
    photoUrl: 'https://ui-avatars.com/api/?name=Rider+Gye&background=random',
    savedPlaces: {
      home: { lat: -2.1498, lng: -79.8855, address: "Sauces 4, Mz 123" }, 
      work: { lat: -2.1894, lng: -79.8891, address: "Av. 9 de Octubre y Boyacá" }
    },
    paymentMethods: [
       { id: 'card1', brand: 'visa', last4: '4242', expiry: '12/25' }
    ]
  },
  {
    id: 'driver-demo',
    name: 'Conductor Gye',
    email: 'driver@demo.com',
    password: '123',
    role: UserRole.DRIVER,
    status: AccountStatus.ACTIVE,
    cedula: '0920030040',
    phone: '0987654321',
    rating: 4.9,
    photoUrl: 'https://ui-avatars.com/api/?name=Driver+Gye&background=random',
    driverDetails: { 
      plate: 'GBA-1234', 
      carModel: 'Chevrolet Spark GT', 
      carYear: '2021',
      carColor: '#DC2626', // Red
      carType: CarType.SEDAN,
      licenseNumber: '12345',
      insurancePolicy: 'SEG-999888'
    }
  }
];

// Mock History
const MOCK_HISTORY: TripHistoryItem[] = [
  {
    id: 'h1',
    date: Date.now() - 86400000, 
    pickupAddress: 'Mall del Sol',
    destinationAddress: 'Puerto Santa Ana',
    destinationCoords: { lat: -2.1815, lng: -79.8765 },
    price: 3.50,
    currency: '$',
    status: 'COMPLETED',
    role: UserRole.RIDER,
    counterpartName: 'Carlos Driver',
    counterpartPhoto: 'https://ui-avatars.com/api/?name=Carlos&background=random',
    rating: 5,
    serviceType: ServiceType.RIDE,
    paymentMethod: PaymentMethod.CASH,
    distance: 5.2,
    duration: 18
  },
  {
    id: 'h2',
    date: Date.now() - 172800000, 
    pickupAddress: 'Aeropuerto JJO',
    destinationAddress: 'Centro',
    price: 5.00,
    currency: '$',
    status: 'COMPLETED',
    role: UserRole.DRIVER,
    counterpartName: 'Pasajero Gye',
    counterpartPhoto: 'https://ui-avatars.com/api/?name=Rider&background=random',
    rating: 5,
    serviceType: ServiceType.RIDE,
    paymentMethod: PaymentMethod.CARD,
    distance: 8.1,
    duration: 25
  }
];

interface Suggestion {
  id: string; // place_id or custom id
  title: string; // display_name short
  subtitle: string; // display_name full
  lat: number;
  lng: number;
  type: 'API' | 'HISTORY' | 'SAVED' | 'COORD';
  distance?: number; // Distance in km from user
  score?: number; // Internal relevance score
}

// Helper: Haversine Distance
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Helper: Check if string is coordinate pair
const parseCoordinates = (text: string): {lat: number, lng: number} | null => {
  // Regex for Lat, Lng (e.g. -2.123, -79.123)
  const coordRegex = /^([-+]?([1-8]?\d(\.\d+)?|90(\.0+)?))\s*,\s*([-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?))$/;
  const match = text.trim().match(coordRegex);
  if (match) {
    return { lat: parseFloat(match[1]), lng: parseFloat(match[5]) };
  }
  return null;
};

// IMPORTANT: Guayaquil Keywords for Boosting Score
const IMPORTANT_KEYWORDS = [
  'centro de convenciones', 
  'aeropuerto', 
  'terminal terrestre', 
  'mall del sol', 
  'san marino', 
  'riocentro', 
  'policentro', 
  'malecon 2000', 
  'puerto santa ana', 
  'estadio',
  'hospital'
];

export default function App() {
  // --- Global State ---
  const [allUsers, setAllUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [tripHistory, setTripHistory] = useState<TripHistoryItem[]>(MOCK_HISTORY);
  const [scheduledRides, setScheduledRides] = useState<ScheduledRide[]>([]);
  
  // --- UI Toggles ---
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSchedulingOpen, setIsSchedulingOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [isPlacesModalOpen, setIsPlacesModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isEarningsModalOpen, setIsEarningsModalOpen] = useState(false); // Driver Earnings
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  // --- Ride App State ---
  const [status, setStatus] = useState<RideStatus>(RideStatus.IDLE);
  const [selectedServiceType, setSelectedServiceType] = useState<ServiceType>(ServiceType.RIDE);
  const [driverNote, setDriverNote] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>(PaymentMethod.CASH);
  const [selectedCardId, setSelectedCardId] = useState<string | undefined>(undefined);
  
  const [userLocation, setUserLocation] = useState<Location>(DEFAULT_LOCATION);
  const [pickupText, setPickupText] = useState('Ubicación actual');
  const [pickupLocation, setPickupLocation] = useState<Location>(DEFAULT_LOCATION);
  
  const [destinationText, setDestinationText] = useState('');
  const [destinationLocation, setDestinationLocation] = useState<Location | null>(null);
  
  // Active Field Tracker for Autocomplete
  const [activeField, setActiveField] = useState<'PICKUP' | 'DESTINATION' | null>(null);

  // Map Picking Mode
  const [isPickingOnMap, setIsPickingOnMap] = useState(false);
  const [pickingTarget, setPickingTarget] = useState<'DESTINATION' | 'PICKUP'>('DESTINATION');
  const [mapCenterCoords, setMapCenterCoords] = useState<Location>(DEFAULT_LOCATION);
  
  // Autocomplete State
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Scheduling Inputs
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');

  const [rideOptions, setRideOptions] = useState<RideOption[]>([]);
  const [selectedRide, setSelectedRide] = useState<RideOption | null>(null);
  const [availableDrivers, setAvailableDrivers] = useState<Driver[]>([]);
  const [assignedDriver, setAssignedDriver] = useState<Driver | null>(null);
  const [currentRider, setCurrentRider] = useState<{name: string, photoUrl: string, rating: number} | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [unreadMessages, setUnreadMessages] = useState(0);

  // --- Driver Specific State ---
  const [isDriverOnline, setIsDriverOnline] = useState(false);
  const [incomingRequest, setIncomingRequest] = useState<any | null>(null); // Mock request data
  const [driverStats, setDriverStats] = useState({ earnings: 150.50, trips: 12, hours: 5.5 });

  const movementIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // --- Auth Handlers ---

  const handleLogin = (email: string, pass: string) => {
    setAuthError(null);
    // In real app: Verify hash. Here we check both plain (for demo users) and hash
    const user = allUsers.find(u => u.email === email && u.password === pass);
    
    if (user) {
      if (user.status === AccountStatus.PENDING) {
        setAuthError("Tu cuenta está en revisión. Te notificaremos pronto.");
        return;
      }
      if (user.status === AccountStatus.REJECTED) {
        setAuthError("Solicitud rechazada.");
        return;
      }
      setCurrentUser(user);
    } else {
      setAuthError("Credenciales incorrectas.");
    }
  };

  const handleRegister = (userData: Omit<User, 'id' | 'status'>, pass: string) => {
    if (allUsers.some(u => u.email === userData.email)) {
      setAuthError("El correo ya está registrado.");
      return;
    }
    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`,
      status: AccountStatus.PENDING,
      password: pass 
    };
    setAllUsers([...allUsers, newUser]);
    showNotification(`Solicitud enviada. Espera aprobación.`);
    setAuthError("Registro exitoso. Espera aprobación.");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    resetApp();
    setAuthError(null);
    setIsProfileOpen(false);
    setIsDriverOnline(false);
  };

  // --- Admin ---
  const handleApproveUser = (userId: string) => {
    setAllUsers(prev => prev.map(user => {
      if (user.id === userId) {
        showNotification(`Usuario ${user.name} aprobado.`);
        return { ...user, status: AccountStatus.ACTIVE };
      }
      return user;
    }));
  };

  const handleRejectUser = (userId: string) => {
    setAllUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, status: AccountStatus.REJECTED } : user
    ));
  };

  // --- Notification ---
  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  // --- Chat ---
  const handleSendMessage = (text: string) => {
    const cleanText = SecurityService.sanitizeInput(text);
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: currentUser?.id || 'unknown',
      text: cleanText,
      timestamp: Date.now(),
      isSelf: true
    };
    setChatMessages(prev => [...prev, newMessage]);

    setTimeout(() => {
      // Mock response logic
      const sender = currentUser?.role === UserRole.DRIVER ? 'Pasajero' : 'Conductor';
      const reply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        senderId: 'counterpart',
        text: `Respuesta simulada del ${sender}.`,
        timestamp: Date.now(),
        isSelf: false
      };
      setChatMessages(prev => [...prev, reply]);
      if (!isChatOpen) setUnreadMessages(prev => prev + 1);
    }, 2000);
  };

  // --- Driver Logic ---
  const toggleDriverStatus = () => {
    setIsDriverOnline(!isDriverOnline);
    if (!isDriverOnline) {
      showNotification("Estás en línea. Esperando solicitudes...");
    } else {
      showNotification("Te has desconectado.");
    }
  };

  const handleSimulateRequest = () => {
    if (!isDriverOnline) {
       showNotification("Debes estar ONLINE para recibir solicitudes.");
       return;
    }
    setIncomingRequest({
       id: 'req-' + Date.now(),
       pickup: 'Mall del Sol',
       destination: 'Puerto Santa Ana',
       price: 4.50,
       distance: '3.5 km',
       passenger: 'Usuario Demo',
       timeLeft: 15 // 15 seconds to accept
    });
  };

  // Driver request timer
  useEffect(() => {
    let interval: any;
    if (incomingRequest && incomingRequest.timeLeft > 0) {
      interval = setInterval(() => {
        setIncomingRequest((prev: any) => {
           if (prev && prev.timeLeft > 0) {
              return { ...prev, timeLeft: prev.timeLeft - 1 };
           }
           return prev;
        });
      }, 1000);
    } else if (incomingRequest && incomingRequest.timeLeft === 0) {
      setIncomingRequest(null);
      showNotification("Solicitud expirada (Ningún conductor aceptó). Reporte enviado.");
      // Simulate report to admin logic here if needed
    }
    return () => clearInterval(interval);
  }, [incomingRequest]);

  const acceptRequest = () => {
    // Save Rider Info
    setCurrentRider({
      name: incomingRequest.passenger,
      photoUrl: `https://ui-avatars.com/api/?name=${incomingRequest.passenger}&background=random`,
      rating: 4.8
    });

    setIncomingRequest(null);
    setStatus(RideStatus.DRIVER_ASSIGNED); // First go to assigned
    
    // Assign current user as driver mock
    setAssignedDriver({
       id: currentUser!.id,
       name: currentUser!.name,
       carModel: currentUser!.driverDetails!.carModel,
       carYear: currentUser!.driverDetails!.carYear,
       carType: currentUser!.driverDetails!.carType,
       plate: currentUser!.driverDetails!.plate,
       carColor: currentUser!.driverDetails!.carColor,
       photoUrl: currentUser!.photoUrl || '',
       coords: userLocation,
       rating: currentUser!.rating || 5.0
    });
    // Set mock rider
    setDestinationLocation({ lat: -2.1815, lng: -79.8765 }); // Puerto Santa Ana
    showNotification("Viaje Aceptado. Dirígete al punto de recogida.");
  };

  const finishTripDriver = () => {
     setStatus(RideStatus.COMPLETED);
     setDriverStats(prev => ({
        ...prev,
        trips: prev.trips + 1,
        earnings: prev.earnings + (incomingRequest?.price || 4.50)
     }));
     setShowRatingModal(true);
  };

  const simulateTripMovement = () => {
     if (assignedDriver) {
        let target: Location | null = null;
        
        if (status === RideStatus.DRIVER_ASSIGNED && pickupLocation) {
           target = pickupLocation;
           showNotification("Simulación: Llegando al punto de recogida...");
        } else if (status === RideStatus.IN_PROGRESS && destinationLocation) {
           target = destinationLocation;
           showNotification("Simulación: Llegando al destino...");
        }

        if (target) {
           setAssignedDriver(prev => prev ? { ...prev, coords: target! } : null);
        }
     }
  };

  // --- Ride Logic ---
  const resetApp = () => {
    setStatus(RideStatus.IDLE);
    setRideOptions([]);
    setSelectedRide(null);
    setAssignedDriver(null);
    setCurrentRider(null);
    setDestinationLocation(null);
    setDestinationText('');
    setChatMessages([]);
    setUnreadMessages(0);
    setIncomingRequest(null);
    setDriverNote('');
  };

  // Handle Rider Simulation Button
  const handleSimulationDemo = () => {
     setPickupText('Mall del Sol');
     setPickupLocation({ lat: -2.1552, lng: -79.8946, address: 'Mall del Sol' });
     setDestinationText('Puerto Santa Ana');
     setDestinationLocation({ lat: -2.1815, lng: -79.8765, address: 'Puerto Santa Ana' });
     showNotification('Simulación: Ubicaciones cargadas');
     // Auto trigger search after a short delay
     setTimeout(() => {
        handleSearchRide();
     }, 500);
  };

  // Handle Cancel Trip Confirmation
  const handleConfirmCancellation = (reason: string) => {
     setIsCancelModalOpen(false);
     resetApp();
     showNotification(`Viaje cancelado. Motivo: ${reason}`);
     // In real app, send this to backend
  };

  // Generate nearby drivers
  useEffect(() => {
    if (!currentUser) return;
    
    // If we are assigned a driver, we only show that one (handled in map). 
    // If waiting, we show "ghost" drivers.
    const generateDrivers = () => {
      const count = 5;
      const drivers: Driver[] = [];
      const baseLat = userLocation.lat;
      const baseLng = userLocation.lng;

      for (let i = 0; i < count; i++) {
        // Random car types and colors for variety
        const types = [CarType.SEDAN, CarType.SUV, CarType.SEDAN, CarType.SUV, CarType.MOTORCYCLE];
        const colors = ['#DC2626', '#2563EB', '#000000', '#FFFFFF', '#FBBF24', '#9CA3AF'];
        
        drivers.push({
          id: `d-${i}`,
          name: `Conductor ${i + 1}`,
          rating: 4.5 + Math.random() * 0.5,
          carModel: i % 2 === 0 ? 'Kia Rio' : 'Toyota Fortuner',
          carYear: '2020',
          plate: `GBA-${1000 + i}`,
          carColor: colors[Math.floor(Math.random() * colors.length)],
          carType: types[Math.floor(Math.random() * types.length)],
          photoUrl: `https://ui-avatars.com/api/?name=D+${i}&background=random`,
          coords: {
            lat: baseLat + (Math.random() - 0.5) * 0.01,
            lng: baseLng + (Math.random() - 0.5) * 0.01
          }
        });
      }
      setAvailableDrivers(drivers);
    };

    generateDrivers();
    const interval = setInterval(generateDrivers, 10000); // Refresh positions occasionally
    return () => clearInterval(interval);
  }, [userLocation, currentUser]);

  // Driver Movement Simulation (Interpolation)
  useEffect(() => {
    // Fix: Allow movement in both ASSIGNED and IN_PROGRESS states
    if ((status === RideStatus.DRIVER_ASSIGNED || status === RideStatus.IN_PROGRESS) && assignedDriver && pickupLocation) {
       
       movementIntervalRef.current = setInterval(() => {
          setAssignedDriver(prev => {
             if (!prev) return null;
             const speedFactor = 0.0001; // Movement speed
             // Target depends on status: Destination if In Progress, otherwise Pickup
             const target = (status === RideStatus.IN_PROGRESS && destinationLocation) ? destinationLocation : pickupLocation;
             
             if (!target) return prev;

             const dx = target.lat - prev.coords.lat;
             const dy = target.lng - prev.coords.lng;
             const dist = Math.sqrt(dx*dx + dy*dy);
             
             if (dist < 0.0005) {
                // Arrived
                return prev;
             }

             return {
               ...prev,
               coords: {
                 lat: prev.coords.lat + (dx / dist) * speedFactor,
                 lng: prev.coords.lng + (dy / dist) * speedFactor
               }
             };
          });
       }, 1000);
    }

    return () => {
      if (movementIntervalRef.current) clearInterval(movementIntervalRef.current);
    };
  }, [status, assignedDriver, pickupLocation, destinationLocation]);

  // Search Ride
  const handleSearchRide = async () => {
    if (!destinationLocation) {
      showNotification("Por favor selecciona un destino.");
      return;
    }
    setStatus(RideStatus.ESTIMATING);
    
    // Use current locations
    const pLat = pickupLocation.lat;
    const pLng = pickupLocation.lng;

    const options = await GeminiService.getRideEstimates(
      pickupText,
      destinationText,
      pLat,
      pLng,
      selectedServiceType
    );
    setRideOptions(options);
    setStatus(RideStatus.CHOOSING);
  };

  const handleRequestRide = () => {
    if (!selectedRide) return;
    setStatus(RideStatus.SEARCHING);
    
    // Simulate nearest neighbor search
    setTimeout(() => {
      // Find nearest driver
      let nearest = availableDrivers[0];
      let minDst = 9999;
      
      availableDrivers.forEach(d => {
         const dst = Math.sqrt(Math.pow(d.coords.lat - userLocation.lat, 2) + Math.pow(d.coords.lng - userLocation.lng, 2));
         if (dst < minDst) {
           minDst = dst;
           nearest = d;
         }
      });

      setAssignedDriver(nearest);
      setStatus(RideStatus.DRIVER_ASSIGNED);
      showNotification("Conductor encontrado.");
    }, 4000);
  };

  const handleScheduleRide = () => {
    const newSchedule: ScheduledRide = {
       id: Date.now().toString(),
       date: new Date(scheduleDate + 'T' + scheduleTime),
       pickupAddress: pickupText,
       destinationAddress: destinationText,
       serviceType: selectedServiceType
    };
    setScheduledRides([...scheduledRides, newSchedule]);
    setIsSchedulingOpen(false);
    showNotification("Viaje programado exitosamente.");
    resetApp();
  };

  // --- Autocomplete Logic ---
  const handleAddressType = async (text: string, isPickup: boolean) => {
    if (isPickup) setPickupText(text);
    else setDestinationText(text);
    
    // Check for coordinates
    const coords = parseCoordinates(text);
    if (coords) {
       const place: Suggestion = { 
          id: 'coord', title: text, subtitle: 'Coordenadas GPS', lat: coords.lat, lng: coords.lng, type: 'COORD' 
       };
       setSuggestions([place]);
       setShowSuggestions(true);
       return;
    }

    if (text.length < 3) {
       setSuggestions([]);
       return;
    }

    // 1. Mock History & Saved Matches
    let localMatches: Suggestion[] = [];
    
    // Add Saved Places
    if (currentUser?.savedPlaces?.home) {
       if ('casa'.includes(text.toLowerCase())) {
          localMatches.push({ id: 'home', title: 'Casa', subtitle: currentUser.savedPlaces.home.address || '', lat: currentUser.savedPlaces.home.lat, lng: currentUser.savedPlaces.home.lng, type: 'SAVED' });
       }
    }
    if (currentUser?.savedPlaces?.work) {
       if ('trabajo'.includes(text.toLowerCase())) {
          localMatches.push({ id: 'work', title: 'Trabajo', subtitle: currentUser.savedPlaces.work.address || '', lat: currentUser.savedPlaces.work.lat, lng: currentUser.savedPlaces.work.lng, type: 'SAVED' });
       }
    }

    // Add History Matches
    tripHistory.forEach(h => {
       if (h.destinationAddress.toLowerCase().includes(text.toLowerCase()) && h.destinationCoords) {
          localMatches.push({
             id: h.id, title: h.destinationAddress, subtitle: 'Reciente', lat: h.destinationCoords.lat, lng: h.destinationCoords.lng, type: 'HISTORY'
          });
       }
    });

    // 2. API Search (Debounced in real app, here simplified)
    try {
      // Viewbox for Guayaquil area preference
      const viewbox = "-80.1,-1.9,-79.6,-2.4"; 
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(text)}&countrycodes=ec&limit=8&viewbox=${viewbox}&bounded=0&addressdetails=1&layer=address,poi&dedupe=0`);
      const data = await response.json();
      
      const apiResults: Suggestion[] = data.map((item: any) => ({
        id: item.place_id,
        title: item.name || item.address.road || item.address.suburb || text,
        subtitle: item.display_name,
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
        type: 'API'
      }));
      
      // 3. Merge and Score
      let combined = [...localMatches, ...apiResults];
      
      // Calculate Scores for sorting
      combined = combined.map(item => {
         let score = 1000;
         
         // Distance penalty
         const dist = calculateDistance(userLocation.lat, userLocation.lng, item.lat, item.lng);
         score -= dist * 10; 
         item.distance = dist;

         // Keyword Bonus
         if (IMPORTANT_KEYWORDS.some(kw => item.title.toLowerCase().includes(kw) || item.subtitle.toLowerCase().includes(kw))) {
            score += 500;
         }

         // Exact match bonus
         if (item.title.toLowerCase().startsWith(text.toLowerCase())) {
            score += 200;
         }
         
         item.score = score;
         return item;
      });

      // Sort by score descending
      combined.sort((a, b) => (b.score || 0) - (a.score || 0));

      setSuggestions(combined);
      setShowSuggestions(true);

    } catch (e) {
      console.error("Autocomplete error", e);
    }
  };

  const selectSuggestion = (s: Suggestion) => {
     const loc: Location = { lat: s.lat, lng: s.lng, address: s.title };
     
     // Use the active field state to determine where to put the value
     if (activeField === 'PICKUP') {
        setPickupLocation(loc);
        setPickupText(s.title);
     } else {
        setDestinationLocation(loc);
        setDestinationText(s.title);
     }
     setShowSuggestions(false);
  };

  // Handle Picking from Map
  const enableMapPicking = (target: 'DESTINATION' | 'PICKUP') => {
     setIsPickingOnMap(true);
     setPickingTarget(target);
     setMapCenterCoords(userLocation); // Start at user location
     setShowSuggestions(false);
  };

  const confirmMapPick = async () => {
     setIsPickingOnMap(false);
     const { lat, lng } = mapCenterCoords;
     
     // Reverse geocode for address
     let address = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
     try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        const data = await res.json();
        if (data && data.display_name) {
           address = data.display_name.split(',')[0];
        }
     } catch (e) {}

     const loc = { lat, lng, address };
     if (pickingTarget === 'PICKUP') {
        setPickupLocation(loc);
        setPickupText(address);
     } else {
        setDestinationLocation(loc);
        setDestinationText(address);
     }
  };

  // Save Place Handler
  const handlePlaceSelect = (loc: Location, type: 'PICKUP' | 'DESTINATION') => {
    if (type === 'PICKUP') {
      setPickupLocation(loc);
      setPickupText(loc.address || '');
    } else {
      setDestinationLocation(loc);
      setDestinationText(loc.address || '');
    }
    setIsPlacesModalOpen(false);
  };

  const handleRatingSubmit = (rating: number, tags: string[], comment: string) => {
    setShowRatingModal(false);
    // Logic to save rating and tags
    if (rating < 3) {
       showNotification("Gracias por tu reporte. Un administrador revisará el caso.");
    } else {
       showNotification("¡Gracias por calificar!");
    }
    
    if (currentUser?.role === UserRole.DRIVER) {
       resetApp(); // Driver goes back to search mode
       setIsDriverOnline(true);
    } else {
       resetApp();
    }
  };

  const handleSOS = () => {
    // Simulate notifying emergency contacts
    showNotification("¡SOS Enviado! Tus contactos de emergencia han recibido tu ubicación.");
    // In real app, this would trigger backend SMS/Alert
  };

  const handleShareTrip = () => {
    showNotification("Enlace de viaje copiado al portapapeles.");
  };

  // Determine display user for live trip (If Driver, show Rider. If Rider, show Driver)
  // Also check if we have valid data
  const displayUser = currentUser?.role === UserRole.DRIVER ? currentRider : assignedDriver;
  const displayRole = currentUser?.role === UserRole.DRIVER ? 'Pasajero' : 'Conductor';
  
  // Render Admin Panel if Admin logged in
  if (currentUser?.role === UserRole.ADMIN) {
    return (
      <AdminPanel 
        users={allUsers}
        tripHistory={tripHistory}
        availableDrivers={availableDrivers}
        onApprove={handleApproveUser}
        onReject={handleRejectUser}
        onLogout={handleLogout}
      />
    );
  }

  // Render Auth Screen if not logged in
  if (!currentUser) {
    return (
      <AuthScreen 
        onLogin={handleLogin}
        onRegister={handleRegister}
        error={authError}
        onClearError={() => setAuthError(null)}
      />
    );
  }

  return (
    <div className="h-full w-full relative flex flex-col font-sans">
      
      {/* 1. Map Background */}
      <div className="absolute inset-0 z-0">
        <MapBackground 
          userLocation={userLocation}
          pickupLocation={pickupLocation}
          destinationLocation={destinationLocation}
          availableDrivers={availableDrivers}
          assignedDriver={assignedDriver}
          isSearching={status === RideStatus.SEARCHING}
          isPickingOnMap={isPickingOnMap}
          onCenterChange={(lat, lng) => setMapCenterCoords({lat, lng})}
          onStartPickDestination={() => enableMapPicking('DESTINATION')}
        />
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="absolute top-24 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur text-white px-6 py-3 rounded-full shadow-2xl z-[60] flex items-center gap-2 animate-bounce-in text-center w-max max-w-[90%]">
          <Bell size={16} className="text-yellow-400 shrink-0" />
          <span className="text-sm font-medium truncate">{notification}</span>
        </div>
      )}

      {/* 2. Header Navbar */}
      <nav className="absolute top-0 left-0 right-0 p-4 z-40 flex justify-between items-center bg-gradient-to-b from-black/60 to-transparent pointer-events-none">
        <button onClick={() => setIsProfileOpen(true)} className="bg-white text-black p-3 rounded-full shadow-lg pointer-events-auto hover:scale-105 transition">
          <Menu size={24} />
        </button>

        <div className="pointer-events-auto flex items-center gap-2">
           {/* Saved Places Button for Riders */}
           {currentUser.role === UserRole.RIDER && (
             <button 
               onClick={() => setIsPlacesModalOpen(true)}
               className="bg-black/20 hover:bg-black/40 text-white p-2 md:px-4 md:py-2 rounded-full flex items-center gap-2 transition backdrop-blur-sm border border-white/10"
             >
                <Bookmark size={18} className="text-yellow-400 fill-yellow-400" /> 
                <span className="hidden md:inline text-sm font-bold">Mis Lugares</span>
             </button>
           )}

           <button 
             onClick={() => {}}
             className="bg-white text-black p-1 pr-3 rounded-full shadow-lg flex items-center gap-2 hover:bg-gray-100 transition"
           >
             <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden">
               <img src={currentUser.photoUrl} alt="User" className="w-full h-full object-cover" />
             </div>
             <span className="font-bold text-sm hidden md:inline">{currentUser.name.split(' ')[0]}</span>
           </button>
        </div>
      </nav>

      {/* PROMO BANNER FOR RIDER */}
      {currentUser.role === UserRole.RIDER && status === RideStatus.IDLE && (
         <div className="absolute top-20 left-4 right-4 z-10 pointer-events-none">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 rounded-2xl shadow-lg flex items-center justify-between pointer-events-auto animate-fade-in">
               <div>
                  <p className="font-black text-lg">10% OFF</p>
                  <p className="text-xs opacity-90">En tu próximo viaje con tarjeta</p>
               </div>
               <button className="bg-white text-indigo-600 px-3 py-1 rounded-lg text-xs font-bold">Usar</button>
            </div>
         </div>
      )}

      {/* 3. Main Interface Layers */}

      {/* --- LAYER: MAP PICKING CONFIRMATION --- */}
      {isPickingOnMap && (
         <div className="absolute bottom-10 left-0 right-0 px-6 z-50 flex flex-col items-center animate-slide-up">
            <div className="bg-white p-4 rounded-2xl shadow-2xl w-full max-w-md text-center space-y-4">
               <h3 className="font-bold text-lg">Fijar ubicación en el mapa</h3>
               <p className="text-gray-500 text-sm">Mueve el mapa para ubicar el punto exacto.</p>
               <button 
                 onClick={confirmMapPick}
                 className="w-full bg-black text-white py-3 rounded-xl font-bold"
               >
                 Confirmar ubicación
               </button>
               <button 
                 onClick={() => setIsPickingOnMap(false)}
                 className="text-red-500 text-sm font-bold"
               >
                 Cancelar
               </button>
            </div>
         </div>
      )}

      {/* --- LAYER: DRIVER DASHBOARD --- */}
      {currentUser.role === UserRole.DRIVER && status === RideStatus.IDLE && !isPickingOnMap && (
        <div className="absolute bottom-0 w-full bg-white rounded-t-3xl shadow-2xl z-30 p-6 animate-slide-up">
           <div className="flex justify-between items-center mb-6">
              <div>
                 <h2 className="text-2xl font-bold">Hola, {currentUser.name.split(' ')[0]}</h2>
                 <p className="text-gray-400 text-sm">
                   {isDriverOnline ? '🟢 En línea' : '🔴 Desconectado'}
                 </p>
              </div>
              <button 
                onClick={toggleDriverStatus}
                className={`p-4 rounded-full shadow-lg transition transform active:scale-95 ${isDriverOnline ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}
              >
                <Power size={24} />
              </button>
           </div>

           {/* Stats */}
           <div className="grid grid-cols-3 gap-3 mb-6" onClick={() => setIsEarningsModalOpen(true)}>
              {/* Earnings */}
              <div className="bg-green-50 border border-green-100 p-4 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition">
                 <div className="bg-green-100 p-2 rounded-full text-green-600 mb-1">
                    <DollarSign size={20} strokeWidth={2.5} />
                 </div>
                 <p className="text-green-600/70 text-[10px] uppercase font-extrabold tracking-wide mt-1">Ganancia</p>
                 <p className="font-black text-xl text-green-700">${driverStats.earnings}</p>
              </div>
              {/* Trips */}
              <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition">
                 <div className="bg-blue-100 p-2 rounded-full text-blue-600 mb-1">
                    <Car size={20} strokeWidth={2.5} />
                 </div>
                 <p className="text-blue-600/70 text-[10px] uppercase font-extrabold tracking-wide mt-1">Viajes</p>
                 <p className="font-black text-xl text-blue-700">{driverStats.trips}</p>
              </div>
              {/* Hours */}
              <div className="bg-orange-50 border border-orange-100 p-4 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition">
                 <div className="bg-orange-100 p-2 rounded-full text-orange-600 mb-1">
                    <Clock size={20} strokeWidth={2.5} />
                 </div>
                 <p className="text-orange-600/70 text-[10px] uppercase font-extrabold tracking-wide mt-1">Horas</p>
                 <p className="font-black text-xl text-orange-700">{driverStats.hours}h</p>
              </div>
           </div>
           
           {isDriverOnline ? (
             <button 
               onClick={handleSimulateRequest}
               className="w-full py-4 bg-black text-white rounded-xl font-bold flex items-center justify-center gap-2 animate-pulse"
             >
               <Search size={20} /> Simular Solicitud de Viaje
             </button>
           ) : (
             <div className="text-center text-gray-400 p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
               Conéctate para recibir viajes.
             </div>
           )}
        </div>
      )}

      {/* --- LAYER: DRIVER INCOMING REQUEST --- */}
      {currentUser.role === UserRole.DRIVER && incomingRequest && (
         <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
            <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-bounce-in">
               {/* Timer Bar */}
               <div className="h-2 bg-gray-100 w-full">
                  <div 
                    className="h-full bg-green-500 transition-all duration-1000 ease-linear" 
                    style={{ width: `${(incomingRequest.timeLeft / 15) * 100}%` }}
                  ></div>
               </div>
               
               <div className="p-6">
                  <div className="text-center mb-6">
                     <h2 className="text-2xl font-black text-gray-900">${incomingRequest.price.toFixed(2)}</h2>
                     <p className="text-gray-500 text-sm">{incomingRequest.distance} • Tarifa Estándar</p>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                     <div className="flex gap-3">
                        <div className="flex flex-col items-center gap-1">
                           <div className="w-3 h-3 rounded-full bg-green-500"></div>
                           <div className="w-0.5 h-8 bg-gray-200"></div>
                           <div className="w-3 h-3 rounded-full bg-black"></div>
                        </div>
                        <div className="space-y-6">
                           <div>
                              <p className="text-xs text-gray-400">Recogida</p>
                              <p className="font-bold text-sm">{incomingRequest.pickup}</p>
                           </div>
                           <div>
                              <p className="text-xs text-gray-400">Destino</p>
                              <p className="font-bold text-sm">{incomingRequest.destination}</p>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="flex gap-3">
                     <button 
                       onClick={() => setIncomingRequest(null)}
                       className="flex-1 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl"
                     >
                       Rechazar
                     </button>
                     <button 
                       onClick={acceptRequest}
                       className="flex-[2] py-3 bg-black text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-xl hover:scale-105 transition"
                     >
                       Aceptar ({incomingRequest.timeLeft}s)
                     </button>
                  </div>
               </div>
            </div>
         </div>
      )}


      {/* --- LAYER: RIDER HOME / SEARCH --- */}
      {currentUser.role === UserRole.RIDER && status === RideStatus.IDLE && !isPickingOnMap && (
        <div className="absolute bottom-0 w-full bg-white rounded-t-3xl shadow-2xl z-30 animate-slide-up">
          
          <div className="p-6 space-y-4 pb-10">
             {/* Simulation Helper Button */}
             <div className="flex justify-end mb-2">
               <button 
                  onClick={handleSimulationDemo} 
                  className="text-xs bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-3 py-1.5 rounded-full font-bold flex items-center gap-1 shadow-lg hover:scale-105 transition"
                  title="Llenar datos de prueba"
               >
                  <Wand2 size={12} /> Demo
               </button>
             </div>

            {/* Inputs */}
            <div className="space-y-3 relative">
               {/* Pickup */}
               <div className={`relative bg-gray-100 rounded-xl flex items-center px-4 py-3 border transition ${activeField === 'PICKUP' ? 'border-black bg-white shadow-sm' : 'border-transparent'}`}>
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3 shrink-0"></div>
                  <input 
                    type="text" 
                    className="bg-transparent w-full text-sm font-semibold placeholder:text-gray-400 focus:outline-none"
                    placeholder="Punto de partida"
                    value={pickupText}
                    onFocus={() => { setActiveField('PICKUP'); handleAddressType(pickupText, true); }} 
                    onChange={(e) => handleAddressType(e.target.value, true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} 
                  />
                  {pickupText && (
                    <button onClick={() => { setPickupText(''); setPickupLocation(DEFAULT_LOCATION); }} className="p-1 text-gray-400"><X size={14} /></button>
                  )}
               </div>
               
               {/* Destination */}
               <div className={`relative bg-gray-100 rounded-xl flex items-center px-4 py-3 border transition shadow-sm ${activeField === 'DESTINATION' ? 'border-black bg-white' : 'border-transparent'}`}>
                  <div className="w-2 h-2 bg-black rounded-full mr-3 shrink-0"></div>
                  <input 
                    type="text" 
                    className="bg-transparent w-full text-lg font-bold placeholder:text-gray-400 focus:outline-none"
                    placeholder="¿A dónde vamos?"
                    value={destinationText}
                    onFocus={() => { setActiveField('DESTINATION'); if(destinationText) handleAddressType(destinationText, false); }} 
                    onChange={(e) => handleAddressType(e.target.value, false)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  />
               </div>

               {/* Saved Quick Access */}
               {!destinationText && (
                 <div className="flex gap-3 overflow-x-auto pt-2 scrollbar-hide">
                    <button onClick={() => { if(currentUser.savedPlaces?.home) handlePlaceSelect(currentUser.savedPlaces.home, 'DESTINATION'); }} className="bg-gray-50 px-4 py-2 rounded-full flex items-center gap-2 text-sm font-bold text-gray-600 hover:bg-gray-100 border border-gray-100 whitespace-nowrap">
                       <Home size={16}/> Casa
                    </button>
                    <button onClick={() => { if(currentUser.savedPlaces?.work) handlePlaceSelect(currentUser.savedPlaces.work, 'DESTINATION'); }} className="bg-gray-50 px-4 py-2 rounded-full flex items-center gap-2 text-sm font-bold text-gray-600 hover:bg-gray-100 border border-gray-100 whitespace-nowrap">
                       <Briefcase size={16}/> Trabajo
                    </button>
                    <button onClick={() => setIsPlacesModalOpen(true)} className="bg-gray-50 px-3 py-2 rounded-full flex items-center gap-2 text-sm font-bold text-gray-600 hover:bg-gray-100 border border-gray-100">
                       <Plus size={16}/>
                    </button>
                 </div>
               )}

               {/* Dropdown Suggestions - Changed to relative so it expands the sheet */}
               {showSuggestions && suggestions.length > 0 && (
                 <div className="relative bg-white rounded-xl shadow-sm border border-gray-100 mt-2 max-h-60 overflow-y-auto z-50">
                    <button 
                      onMouseDown={() => enableMapPicking(activeField || 'DESTINATION')}
                      className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-50 border-b border-gray-50"
                    >
                       <div className="bg-gray-100 p-2 rounded-full"><MapPin size={16} /></div>
                       <span className="font-bold text-sm text-blue-600">Fijar ubicación en el mapa</span>
                    </button>

                    {suggestions.map((s) => (
                       <button 
                         key={s.id}
                         onMouseDown={() => selectSuggestion(s)} 
                         className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-50 border-b border-gray-50 last:border-0"
                       >
                          <div className={`p-2 rounded-full ${s.type === 'HISTORY' ? 'bg-orange-50 text-orange-500' : s.type === 'SAVED' ? 'bg-blue-50 text-blue-500' : 'bg-gray-100 text-gray-500'}`}>
                             {s.type === 'HISTORY' ? <History size={16} /> : s.type === 'SAVED' ? <Star size={16} /> : <MapPin size={16} />}
                          </div>
                          <div className="flex-grow">
                             <p className="font-bold text-sm text-gray-900">{s.title}</p>
                             <p className="text-xs text-gray-500 line-clamp-1">{s.subtitle}</p>
                          </div>
                          {s.distance && (
                             <span className="text-[10px] bg-gray-100 px-2 py-1 rounded text-gray-500 font-mono">
                                {s.distance.toFixed(1)} km
                             </span>
                          )}
                       </button>
                    ))}
                 </div>
               )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button 
                 onClick={() => setIsSchedulingOpen(true)}
                 className="flex-1 bg-gray-100 hover:bg-gray-200 text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition"
              >
                 <Calendar size={18} /> Agendar
              </button>
              <button 
                onClick={handleSearchRide}
                disabled={!destinationLocation}
                className="flex-[2] bg-black text-white font-bold py-3 rounded-xl hover:scale-[1.02] transition disabled:opacity-50 disabled:hover:scale-100 shadow-xl"
              >
                Buscar {selectedServiceType === ServiceType.DELIVERY ? 'Envío' : 'Viaje'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- LAYER: RIDE SELECTION (IMPROVED) --- */}
      {status === RideStatus.CHOOSING && (
        <div className="absolute bottom-0 w-full bg-white rounded-t-3xl shadow-2xl z-30 animate-slide-up">
           <div className="p-4 border-b border-gray-100 flex items-center gap-3">
              <button onClick={resetApp} className="p-2 hover:bg-gray-100 rounded-full"><X size={20}/></button>
              <h3 className="font-bold">Elige tu viaje</h3>
           </div>
           
           {/* Ride Options List */}
           <div className="max-h-[35vh] overflow-y-auto p-4 space-y-3">
             {rideOptions.length === 0 ? (
                <div className="text-center py-8 text-gray-400">Cargando tarifas...</div>
             ) : (
               rideOptions.map((opt) => (
                 <div 
                   key={opt.id}
                   onClick={() => setSelectedRide(opt)}
                   className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition ${selectedRide?.id === opt.id ? 'border-black bg-gray-50' : 'border-transparent hover:bg-gray-50'}`}
                 >
                    <div className="w-12 h-12 bg-gray-200 rounded-lg mr-4 flex items-center justify-center">
                       <Car size={24} className="text-gray-600" />
                    </div>
                    <div className="flex-grow">
                       <div className="flex justify-between items-center">
                          <h4 className="font-bold text-lg">{opt.name}</h4>
                          <span className="font-bold text-lg">{opt.currency}{opt.price.toFixed(2)}</span>
                       </div>
                       <div className="flex gap-2 text-xs text-gray-500">
                          <span>{opt.capacity} pers</span>
                          <span>•</span>
                          <span className="text-green-600 font-bold">{opt.eta} min</span>
                          <span>•</span>
                          <span>{opt.duration} min viaje</span>
                       </div>
                    </div>
                 </div>
               ))
             )}
           </div>

           {/* Selection Actions Area */}
           <div className="p-6 border-t border-gray-100 bg-white pb-8 space-y-4">
              
              {/* Payment & Notes */}
              <div className="flex gap-3">
                 <button 
                    onClick={() => setIsPaymentModalOpen(true)} 
                    className="flex-1 flex items-center justify-between bg-gray-50 px-4 py-3 rounded-xl border border-gray-200 text-sm font-bold"
                 >
                    <span className="flex items-center gap-2">
                       {selectedPaymentMethod === PaymentMethod.CASH ? <Banknote size={18} className="text-green-600"/> : 
                        selectedPaymentMethod === PaymentMethod.CARD ? <CreditCard size={18} className="text-blue-600"/> :
                        <Building2 size={18} className="text-purple-600"/>}
                       {selectedPaymentMethod === PaymentMethod.CASH ? 'Efectivo' : 
                        selectedPaymentMethod === PaymentMethod.CARD ? 'Tarjeta' : 'Transferencia'}
                    </span>
                    <ChevronRight size={16} className="text-gray-400" />
                 </button>
                 
                 {/* Note Input (Taxi Baby) */}
                 <div className="relative flex-[2]">
                    <MessageSquare size={16} className="absolute left-3 top-3.5 text-gray-400"/>
                    <input 
                       type="text" 
                       placeholder="Nota (ej: Bebé)" 
                       className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-9 pr-3 text-sm focus:outline-none focus:border-black"
                       value={driverNote}
                       onChange={(e) => setDriverNote(SecurityService.sanitizeInput(e.target.value))}
                    />
                 </div>
              </div>

              <button 
                onClick={handleRequestRide}
                disabled={!selectedRide}
                className="w-full bg-black text-white font-bold py-4 rounded-xl shadow-xl hover:scale-[1.02] transition disabled:opacity-50"
              >
                 Confirmar {selectedRide?.name}
              </button>
           </div>
        </div>
      )}

      {/* --- LAYER: RIDE IN PROGRESS / SEARCHING / COMPLETED --- */}
      {(status === RideStatus.SEARCHING || status === RideStatus.DRIVER_ASSIGNED || status === RideStatus.IN_PROGRESS || status === RideStatus.COMPLETED) && (displayUser) && (
        <div className="absolute bottom-0 w-full bg-white rounded-t-3xl shadow-2xl z-30 animate-slide-up">
          
          {/* SEARCHING STATE */}
          {status === RideStatus.SEARCHING && (
             <div className="p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse">
                   <Search size={32} />
                </div>
                <h3 className="font-bold text-xl mb-2">Buscando tu conductor...</h3>
                <div className="flex justify-center gap-4 text-sm text-gray-500 mb-6">
                   <span>{selectedRide?.name}</span>
                   <span>•</span>
                   <span>~{selectedRide?.eta} min</span>
                </div>
                <button onClick={resetApp} className="w-full py-3 rounded-xl border border-gray-200 text-red-500 font-bold text-sm hover:bg-red-50">Cancelar Solicitud</button>
             </div>
          )}

          {/* LIVE TRIP STATES */}
          {(status === RideStatus.DRIVER_ASSIGNED || status === RideStatus.IN_PROGRESS || status === RideStatus.COMPLETED) && (
             <div className="p-0">
                
                {/* Header Status Bar */}
                <div className="bg-black text-white p-4 px-6 flex items-center justify-between">
                   <div>
                      <span className="text-xs font-bold uppercase tracking-widest block text-gray-400">
                         {status === RideStatus.DRIVER_ASSIGNED ? 'En camino' : 
                          status === RideStatus.IN_PROGRESS ? 'En ruta al destino' : 'Llegaste'}
                      </span>
                      {status !== RideStatus.COMPLETED && (
                         <span className="text-lg font-bold">
                            Llegada: {new Date(Date.now() + 15 * 60000).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                         </span>
                      )}
                   </div>
                   <div className="text-right">
                      <span className="block font-bold text-lg">{selectedRide?.currency}{selectedRide?.price.toFixed(2) || incomingRequest?.price.toFixed(2)}</span>
                      <span className="text-xs bg-white/20 px-2 py-0.5 rounded">
                        {selectedPaymentMethod === PaymentMethod.CASH ? 'Efectivo' : 
                         selectedPaymentMethod === PaymentMethod.CARD ? 'Tarjeta' : 'Transferencia'}
                      </span>
                   </div>
                </div>

                {/* Driver & Car Info */}
                <div className="p-6">
                   <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                         <div className="relative">
                            <img src={displayUser.photoUrl} className="w-16 h-16 rounded-full border-4 border-white shadow-lg object-cover" />
                            <div className="absolute -bottom-1 -right-1 bg-black text-white text-[10px] px-1.5 py-0.5 rounded flex items-center gap-0.5">
                               <Star size={8} fill="white" /> {displayUser.rating?.toFixed(1)}
                            </div>
                         </div>
                         <div>
                            <h3 className="font-bold text-xl">{displayUser.name}</h3>
                            {/* Only show Car details if viewing a Driver */}
                            {currentUser.role === UserRole.RIDER && (assignedDriver) && (
                              <>
                                <div className="flex items-center gap-2 mt-1">
                                   <span className="w-3 h-3 rounded-full border border-gray-300 shadow-sm" style={{ backgroundColor: assignedDriver.carColor }} title={assignedDriver.carColor}></span>
                                   <p className="text-sm text-gray-500 font-medium">{assignedDriver.carModel}</p>
                                </div>
                                <p className="text-xs text-gray-400">{assignedDriver.carType}</p>
                              </>
                            )}
                            {currentUser.role === UserRole.DRIVER && (
                               <p className="text-sm text-gray-500">Pasajero</p>
                            )}
                         </div>
                      </div>
                      
                      {/* License Plate (Only if viewing driver) */}
                      {currentUser.role === UserRole.RIDER && assignedDriver && (
                        <div className="bg-yellow-400 text-black border-4 border-black px-3 py-1 rounded-lg shadow-sm transform rotate-1 text-center">
                           <p className="text-[8px] font-bold uppercase leading-none mb-0.5">Placa</p>
                           <p className="text-lg font-black font-mono tracking-widest leading-none">{assignedDriver.plate}</p>
                        </div>
                      )}
                   </div>

                   {/* Trip Actions (Call/Chat/Share) */}
                   <div className="grid grid-cols-4 gap-3 mb-6">
                      <button 
                         onClick={() => setIsChatOpen(true)}
                         className="col-span-1 bg-gray-100 py-3 rounded-xl font-bold flex flex-col items-center justify-center gap-1 hover:bg-gray-200 transition relative text-xs"
                      >
                         <MessageSquare size={20} /> 
                         Chat
                         {unreadMessages > 0 && (
                            <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full"></span>
                         )}
                      </button>
                      <button className="col-span-1 bg-gray-100 py-3 rounded-xl font-bold flex flex-col items-center justify-center gap-1 hover:bg-gray-200 transition text-xs">
                         <Phone size={20} /> Llamar
                      </button>
                      <button onClick={handleShareTrip} className="col-span-1 bg-gray-100 py-3 rounded-xl font-bold flex flex-col items-center justify-center gap-1 hover:bg-gray-200 transition text-xs">
                         <Share2 size={20} /> Compartir
                      </button>
                      {/* SOS BUTTON (Only for Rider in Progress) */}
                      {currentUser.role === UserRole.RIDER && status === RideStatus.IN_PROGRESS && (
                         <button onClick={handleSOS} className="col-span-1 bg-red-100 text-red-600 py-3 rounded-xl font-bold flex flex-col items-center justify-center gap-1 hover:bg-red-200 transition text-xs animate-pulse">
                            <Shield size={20} /> SOS
                         </button>
                      )}
                      {/* Cancel Button (Only if assigned but not started or rider) */}
                      {currentUser.role === UserRole.RIDER && status === RideStatus.DRIVER_ASSIGNED && (
                         <button onClick={() => setIsCancelModalOpen(true)} className="col-span-1 bg-gray-100 text-red-500 py-3 rounded-xl font-bold flex flex-col items-center justify-center gap-1 hover:bg-red-50 transition text-xs">
                            <X size={20} /> Cancelar
                         </button>
                      )}
                   </div>
                   
                   {/* Driver Controls */}
                   {currentUser.role === UserRole.DRIVER && (
                      <div className="border-t border-gray-100 pt-4 flex gap-2">
                         {/* SIMULATION BUTTON FOR DRIVER */}
                         {(status === RideStatus.DRIVER_ASSIGNED || status === RideStatus.IN_PROGRESS) && (
                           <button 
                             onClick={simulateTripMovement}
                             className="bg-purple-100 text-purple-700 p-4 rounded-xl font-bold shadow-sm hover:bg-purple-200 transition flex flex-col items-center justify-center text-[10px]"
                             title="Saltar trayecto (Solo pruebas)"
                           >
                             <FastForward size={20} />
                             <span>Simular</span>
                           </button>
                         )}
                         
                         {status === RideStatus.DRIVER_ASSIGNED ? (
                            <button 
                              onClick={() => setStatus(RideStatus.IN_PROGRESS)}
                              className="flex-grow bg-black text-white py-4 rounded-xl font-bold text-lg shadow-lg"
                            >
                              <Navigation2 size={20} className="inline mr-2" /> Iniciar Viaje
                            </button>
                         ) : status === RideStatus.IN_PROGRESS ? (
                            <button 
                              onClick={finishTripDriver}
                              className="flex-grow bg-red-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-red-700 transition"
                            >
                              Finalizar Viaje
                            </button>
                         ) : null}
                      </div>
                   )}
                </div>
             </div>
          )}
        </div>
      )}

      {/* 4. Overlays / Modals */}
      
      <ChatWindow 
        isOpen={isChatOpen} 
        onClose={() => { setIsChatOpen(false); setUnreadMessages(0); }}
        messages={chatMessages}
        onSendMessage={handleSendMessage}
        recipientName={currentUser.role === UserRole.DRIVER ? SecurityService.maskEmail(currentRider?.name || 'Pasajero') : SecurityService.maskEmail(assignedDriver?.name || 'Conductor')}
        recipientPhoto={currentUser.role === UserRole.DRIVER ? currentRider?.photoUrl || '' : assignedDriver?.photoUrl || ''}
      />

      <TripHistory 
        isOpen={isHistoryOpen} 
        onClose={() => setIsHistoryOpen(false)}
        history={tripHistory}
        userRole={currentUser.role}
      />

      <ProfileMenu 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)}
        user={currentUser}
        onLogout={handleLogout}
        onOpenHistory={() => { setIsProfileOpen(false); setIsHistoryOpen(true); }}
      />

      <SavedPlacesModal
        isOpen={isPlacesModalOpen}
        onClose={() => setIsPlacesModalOpen(false)}
        user={currentUser}
        onSelect={handlePlaceSelect}
      />

      <PaymentMethodsModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        user={currentUser}
        onSelectMethod={(method, id) => { setSelectedPaymentMethod(method); setSelectedCardId(id); }}
      />

      <HelpCenterModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />

      <DriverEarningsModal
         isOpen={isEarningsModalOpen}
         onClose={() => setIsEarningsModalOpen(false)}
         tripHistory={tripHistory}
      />

      {/* Cancellation Modal */}
      <CancellationModal 
         isOpen={isCancelModalOpen}
         onClose={() => setIsCancelModalOpen(false)}
         onConfirm={handleConfirmCancellation}
      />

      {/* Scheduling Modal */}
      {isSchedulingOpen && (
         <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl">
               <h3 className="text-xl font-bold mb-4">Programar Viaje</h3>
               
               {/* Location Inputs in Modal */}
               <div className="space-y-3 mb-6">
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                     <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Desde</label>
                     <input 
                        type="text" 
                        value={pickupText} 
                        onChange={(e) => handleAddressType(e.target.value, true)}
                        className="w-full bg-transparent font-bold text-sm outline-none"
                        placeholder="Punto de partida"
                     />
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                     <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Hasta</label>
                     <input 
                        type="text" 
                        value={destinationText} 
                        onChange={(e) => handleAddressType(e.target.value, false)}
                        className="w-full bg-transparent font-bold text-sm outline-none"
                        placeholder="Destino"
                     />
                  </div>
               </div>

               <div className="space-y-4">
                  <div>
                     <label className="block text-sm font-bold mb-2">Fecha</label>
                     <input 
                       type="date" 
                       className="w-full bg-gray-100 p-3 rounded-xl"
                       value={scheduleDate}
                       onChange={(e) => setScheduleDate(e.target.value)}
                     />
                  </div>
                  <div>
                     <label className="block text-sm font-bold mb-2">Hora</label>
                     <input 
                       type="time" 
                       className="w-full bg-gray-100 p-3 rounded-xl"
                       value={scheduleTime}
                       onChange={(e) => setScheduleTime(e.target.value)}
                     />
                  </div>
                  <div className="flex gap-3 mt-6">
                     <button onClick={() => setIsSchedulingOpen(false)} className="flex-1 py-3 font-bold text-gray-500 hover:bg-gray-100 rounded-xl">Cancelar</button>
                     <button onClick={handleScheduleRide} className="flex-1 py-3 bg-black text-white font-bold rounded-xl shadow-lg">Confirmar</button>
                  </div>
               </div>
            </div>
         </div>
      )}

      {/* Rating Modal - Update Logic to handle generic subject */}
      {showRatingModal && (
        <RatingModal 
           subjectName={currentUser.role === UserRole.RIDER ? (assignedDriver?.name || 'Conductor') : (currentRider?.name || incomingRequest?.passenger || 'Pasajero')}
           subjectPhoto={currentUser.role === UserRole.RIDER ? (assignedDriver?.photoUrl || '') : (currentRider?.photoUrl || 'https://ui-avatars.com/api/?name=Pasajero&background=random')}
           subjectRole={currentUser.role === UserRole.RIDER ? UserRole.DRIVER : UserRole.RIDER}
           amount={`$${selectedRide?.price.toFixed(2) || incomingRequest?.price.toFixed(2) || '0.00'}`}
           onSubmit={handleRatingSubmit}
           onClose={() => handleRatingSubmit(5, [], '')} 
        />
      )}

    </div>
  );
}
