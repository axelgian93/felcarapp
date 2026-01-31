



import { useState, useEffect, useRef, useLayoutEffect, lazy, Suspense } from 'react';



import { 


  Map as MapIcon, MapPin, Home, Briefcase, Heart, Bell, Menu, Sun, Moon, 


  DollarSign, Clock, History, Power, Car, X, Calendar, Locate, Search,


  CheckCircle2, MessageSquare, LogOut, Lock, Clock as ClockIcon


} from 'lucide-react';


import { MapBackground } from './components/MapBackground';



import { AuthScreen } from './components/AuthScreen';



import { ProfileMenu } from './components/ProfileMenu';







// Lazy-loaded modales/paneles pesados para reducir el bundle inicial



const AdminPanel = lazy(() => import('./components/AdminPanel').then(m => ({ default: m.AdminPanel })));



const TripHistory = lazy(() => import('./components/TripHistory').then(m => ({ default: m.TripHistory })));



const SavedPlacesModal = lazy(() => import('./components/SavedPlacesModal').then(m => ({ default: m.SavedPlacesModal })));



const PaymentMethodsModal = lazy(() => import('./components/PaymentMethodsModal').then(m => ({ default: m.PaymentMethodsModal })));



const ChangePasswordModal = lazy(() => import('./components/ChangePasswordModal').then(m => ({ default: m.ChangePasswordModal })));



const ScheduledRidesModal = lazy(() => import('./components/ScheduledRidesModal').then(m => ({ default: m.ScheduledRidesModal })));



const DriverEarningsModal = lazy(() => import('./components/DriverEarningsModal').then(m => ({ default: m.DriverEarningsModal })));



const NotificationsModal = lazy(() => import('./components/NotificationsModal').then(m => ({ default: m.NotificationsModal })));



const HelpCenterModal = lazy(() => import('./components/HelpCenterModal').then(m => ({ default: m.HelpCenterModal })));







import { useTheme } from './src/context/ThemeContext';



import { AuthService } from './src/services/authService';



import { TripService } from './src/services/tripService';



import { UserService } from './src/services/userService';



import { MapService } from './src/services/mapService';



import { CooperativeService } from './src/services/cooperativeService';



import { CompanyService } from './src/services/companyService';



import { PlacesService } from './src/services/placesService';



import { getRideEstimates } from './services/geminiService';


import { fetchEta, EtaResult } from './services/etaService';


import { Capacitor } from '@capacitor/core';


import { Geolocation } from '@capacitor/geolocation';
import { Camera } from '@capacitor/camera';






import { 



  User, UserRole, RideStatus, Location, Driver, RideOption, ServiceType, 



  TripHistoryItem, Cooperative, Company, AccountStatus, PaymentMethod 



} from './types';



import { auth } from './src/firebaseConfig';



import { onAuthStateChanged } from 'firebase/auth';







export default function App() {


  const { theme, toggleTheme } = useTheme();


  const isNative = Capacitor.isNativePlatform();


  



  // Auth State



  const [currentUser, setCurrentUser] = useState<User | null>(null);



  const [isLoadingAuth, setIsLoadingAuth] = useState(true);



  const [authError, setAuthError] = useState<string | null>(null);



  const [authSuccess, setAuthSuccess] = useState<string | null>(null);







  // App Flow State



  const [status, setStatus] = useState<RideStatus>(RideStatus.IDLE);



  const [notification, setNotification] = useState<string | null>(null);







  // Map & Location State



  const [userLocation, setUserLocation] = useState<Location>({ lat: -2.1894, lng: -79.8891 }); 



  const [mapCenterCoords, setMapCenterCoords] = useState<Location>({ lat: -2.1894, lng: -79.8891 });



  const [gpsSignal, setGpsSignal] = useState(0);
  const [showPermissionsPrompt, setShowPermissionsPrompt] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("felcar-permissions-ack") !== "true";
  });



  const [pickupText, setPickupText] = useState('');



  const [pickupLocation, setPickupLocation] = useState<Location | null>(null);



  const [destinationText, setDestinationText] = useState('');



  const [destinationLocation, setDestinationLocation] = useState<Location | null>(null);



  const [addressSuggestions, setAddressSuggestions] = useState<Location[]>([]);



  const [recentPlaces, setRecentPlaces] = useState<Location[]>([]);



  const [activeField, setActiveField] = useState<'PICKUP' | 'DESTINATION' | 'SCHEDULE_PICKUP' | 'SCHEDULE_DESTINATION' | null>(null);



  const [isPickingOnMap, setIsPickingOnMap] = useState(false);



  const [pickingTarget, setPickingTarget] = useState<'PICKUP' | 'DESTINATION' | 'SAVED_PLACE' | 'SCHEDULE_PICKUP' | 'SCHEDULE_DESTINATION'>('PICKUP');



  



  // Selection State



  const [selectedServiceType, setSelectedServiceType] = useState<ServiceType>(ServiceType.RIDE);



  const [rideOptions, setRideOptions] = useState<RideOption[]>([]);



  const [selectedRide, setSelectedRide] = useState<RideOption | null>(null);



  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>(PaymentMethod.CASH);







  // Ride State



  const [assignedDriver, setAssignedDriver] = useState<Driver | null>(null); 



  const [currentRider, setCurrentRider] = useState<User | null>(null); 



  const [incomingRequest, setIncomingRequest] = useState<any | null>(null); 



  const [tripOtp, setTripOtp] = useState<string | null>(null);



  



  // Driver specific



  const [isDriverOnline, setIsDriverOnline] = useState(false);



  const [onlineDuration] = useState('00:00'); 



  const [driverOtpInput, setDriverOtpInput] = useState('');



  const [showOtpInput, setShowOtpInput] = useState(false);



  const [driverEarningsTab, setDriverEarningsTab] = useState<'EARNINGS' | 'HISTORY' | 'HOURS'>('EARNINGS');



  const [isDriverEarningsOpen, setIsDriverEarningsOpen] = useState(false);







  // Data State



  const [allUsers, setAllUsers] = useState<User[]>([]);



  const [availableDrivers, setAvailableDrivers] = useState<Driver[]>([]);



  const [tripHistory] = useState<TripHistoryItem[]>([]);



  const [cooperatives, setCooperatives] = useState<Cooperative[]>([]);



  const [currentCooperative, setCurrentCooperative] = useState<Cooperative | null>(null);



  const [currentCompany, setCurrentCompany] = useState<Company | null>(null);



  const [routeEta, setRouteEta] = useState<EtaResult | null>(null);







  const formatEtaRange = (eta: EtaResult | null) => {



    if (!eta || !eta.etaMinutes) return null;



    const base = eta.etaMinutes;



    const delta = Math.max(1, Math.round(base * 0.15));



    const low = Math.max(1, base - delta);



    const high = base + delta;



    return `${low}-${high} min`;



  };







  // Modals State



  const [isProfileOpen, setIsProfileOpen] = useState(false);



  const [isHistoryOpen, setIsHistoryOpen] = useState(false);



  const [historyInitialTab, setHistoryInitialTab] = useState<'LIST' | 'EXPENSES'>('LIST');



  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);



  const [isPlacesModalOpen, setIsPlacesModalOpen] = useState(false);



  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);



  const [isSchedulingOpen, setIsSchedulingOpen] = useState(false);



  const [isScheduledRidesListOpen, setIsScheduledRidesListOpen] = useState(false);



  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);



  const [tempSavedPlaceLocation, setTempSavedPlaceLocation] = useState<Location | null>(null);



  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);







  // Schedule Form



  const [scheduleForm, setScheduleForm] = useState({



      pickup: '',



      destination: '',



      pickupCoords: null as Location | null,



      destinationCoords: null as Location | null,



      date: '',



      time: '',



      notes: ''



  });







  // UI overlay height tracking to ajustar padding dinamico del mapa



  const overlayRef = useRef<HTMLDivElement | null>(null);



  const [uiBottomPadding, setUiBottomPadding] = useState(260);







  const simulationIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);



  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);







  const handlePermissionsAccept = async () => {
    setShowPermissionsPrompt(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("felcar-permissions-ack", "true");
      if ("Notification" in window && Notification.permission === "default") {
        try {
          await Notification.requestPermission();
        } catch (_) {}
      }
    }
    try {
      await Camera.requestPermissions({ permissions: ['camera', 'photos'] });
    } catch (_) {}
    try {
      await Geolocation.requestPermissions();
    } catch (_) {}
    forceLocationRefresh();
  };

  const handlePermissionsLater = () => {
    setShowPermissionsPrompt(false);
  };

  // --- GPS UTILS ---


  const requestLocation = async () => {


      const onSuccess = (lat: number, lng: number) => {


          const loc = { lat, lng };


          setUserLocation(loc);


          setMapCenterCoords(loc);


          setPickupLocation(loc);


          setPickupText('Ubicación actual');


          setGpsSignal(prev => prev + 1);


      };





      const onError = (err: any) => {


          console.warn("GPS Error:", err);


          const msg = err.message || "Error GPS: Activa ubicación y concede permisos.";


          showNotification(msg);


      };





      try {


          if (isNative) {


              await Geolocation.requestPermissions();


              const pos = await Geolocation.getCurrentPosition({


                  enableHighAccuracy: true,


                  timeout: 10000,


              });


              onSuccess(pos.coords.latitude, pos.coords.longitude);


          } else if (navigator.geolocation) {


              navigator.geolocation.getCurrentPosition(


                  (pos) => onSuccess(pos.coords.latitude, pos.coords.longitude),


                  onError,


                  { 


                      enableHighAccuracy: true, 


                      timeout: 10000, 


                      maximumAge: 0 


                  }


              );


          } else {


              showNotification("Tu dispositivo no soporta geolocalización.");


          }


      } catch (err) {


          onError(err);


      }


  };





  const forceLocationRefresh = () => { requestLocation(); };






  // --- DRIVER MOVEMENT SIMULATION ---



  useEffect(() => {



    if ((status === RideStatus.DRIVER_ASSIGNED || status === RideStatus.IN_PROGRESS) && assignedDriver) {



       if (simulationIntervalRef.current) clearInterval(simulationIntervalRef.current);







       simulationIntervalRef.current = setInterval(() => {



          setAssignedDriver(prev => {



             if (!prev) return null;



             let target: Location | null = null;



             if (status === RideStatus.DRIVER_ASSIGNED) target = pickupLocation;



             else if (status === RideStatus.IN_PROGRESS) target = destinationLocation;







             if (!target) return prev;







             const latDiff = target.lat - prev.coords.lat;



             const lngDiff = target.lng - prev.coords.lng;



             



             const newCoords = {



                lat: prev.coords.lat + latDiff * 0.05,



                lng: prev.coords.lng + lngDiff * 0.05



             };







             if (status === RideStatus.IN_PROGRESS) {



                setUserLocation(newCoords);



                setPickupLocation(newCoords); 



             }







             return { ...prev, coords: newCoords };



          });



       }, 1000);



    } else {



       if (simulationIntervalRef.current) {



          clearInterval(simulationIntervalRef.current);



          simulationIntervalRef.current = null;



       }



    }



    return () => { if (simulationIntervalRef.current) clearInterval(simulationIntervalRef.current); };



  }, [status, assignedDriver?.id, pickupLocation, destinationLocation]);











  // --- EFFECTS ---



  useEffect(() => {



    // Guidelines: Fix for modular auth error by using compat style auth instance



    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {



      setIsLoadingAuth(true);



      if (firebaseUser) {



        try {



          const profile = await AuthService.getUserProfile(firebaseUser.uid, firebaseUser);



          if (profile) {



            setCurrentUser(profile);



            setRecentPlaces(PlacesService.getRecentPlaces());



            



            requestLocation();

            // Warm up ETA/OSRM to avoid first-request latency
            fetch(`${(import.meta.env.VITE_ETA_URL as string | undefined)?.replace(/\/$/, '') || 'http://localhost:8788'}/health`).catch(() => undefined);


          }


        } catch (error) {


          console.error("Profile load error", error);



        }



      } else {



        setCurrentUser(null);



      }



      setIsLoadingAuth(false);



    });



    return () => unsubscribe();



  }, []);







  // Measure overlay height whenever layout changes to adjust map padding



  useLayoutEffect(() => {



    if (overlayRef.current) {



      const rect = overlayRef.current.getBoundingClientRect();



      setUiBottomPadding(Math.max(220, Math.round(rect.height + 80)));



    }



  }, [status, activeField, isPickingOnMap, isSchedulingOpen, isHistoryOpen, isPaymentModalOpen, isPlacesModalOpen, isHelpModalOpen, isNotificationsOpen, isDriverEarningsOpen, isScheduledRidesListOpen, rideOptions.length]);







  // Data Subscriptions



  useEffect(() => {



    if (!currentUser) return;



    const coopUnsub = CooperativeService.subscribeToCooperatives((data) => {



       setCooperatives(data);



       if (currentUser.cooperativeId) {



          setCurrentCooperative(data.find(c => c.id === currentUser.cooperativeId) || null);



       }



    });



    if (currentUser.companyId) {



       CompanyService.getCompanyById(currentUser.companyId).then(setCurrentCompany);



    }



    const usersUnsub = UserService.subscribeToAllUsers((users) => {



       setAllUsers(users);



       const drivers = users



         .filter(u => u.role === UserRole.DRIVER && u.status === AccountStatus.ACTIVE && u.driverDetails)



         .map(u => ({



            id: u.id,



            name: u.name,



            rating: u.rating || 5.0,



            carModel: u.driverDetails!.carModel,



            carYear: u.driverDetails!.carYear,



            carColor: u.driverDetails!.carColor,



            carType: u.driverDetails!.carType,



            plate: u.driverDetails!.plate,



            photoUrl: u.photoUrl || '',



            coords: { lat: -2.1894 + (Math.random() * 0.01 - 0.005), lng: -79.8891 + (Math.random() * 0.01 - 0.005) },



            status: 'AVAILABLE'



         } as Driver));



       setAvailableDrivers(drivers);



    });



    



    return () => { coopUnsub(); usersUnsub(); };



  }, [currentUser]);







  // --- HANDLERS ---



  const showNotification = (msg: string) => {



     setNotification(msg);



     setTimeout(() => setNotification(null), 3000);



  };







    const getAuthErrorMessage = (error: any) => {
    const code = error?.code || "";
    if (code === "auth/invalid-credential" || code === "auth/wrong-password") return "Correo o contraseña incorrectos.";
    if (code === "auth/user-not-found") return "Correo o contraseña incorrectos.";
    if (code === "auth/too-many-requests") return "Demasiados intentos. Intenta nuevamente en unos minutos.";
    if (code === "auth/network-request-failed") return "No se pudo conectar. Revisa tu conexión a internet.";
    return "No pudimos iniciar sesión. Verifica tus datos e inténtalo nuevamente.";
  };

const handleLogin = async (email: string, pass: string) => {



     try {



        setAuthError(null);



        const user = await AuthService.login(email, pass);



        setCurrentUser(user);



     } catch (e: any) {



        setAuthError(getAuthErrorMessage(e));



     }



  };







  const handleRegister = async (user: Omit<User, 'id' | 'status'>, pass: string, coopCode: string) => {


     try {


        setAuthError(null);


        await AuthService.register(user, pass, coopCode);


        setAuthSuccess("Registro exitoso. Tu cuenta está PENDIENTE DE APROBACIÓN.");


     } catch (e: any) {


        setAuthError(e.message);


     }


  };





  const handleResetPassword = async (email: string) => {


     try {


        setAuthError(null);


        setAuthSuccess(null);


        await AuthService.resetPassword(email);


        setAuthSuccess("Revisa tu correo para restablecer tu contraseña.");


     } catch (e: any) {


        setAuthError(e.message || "No se pudo enviar el enlace de recuperación.");


     }


  };






  const handleLogout = async () => {



     await AuthService.logout();



     setCurrentUser(null);



     resetApp();



  };







  const handleAddressInput = (val: string, field: typeof activeField) => {



      if (field === 'PICKUP') setPickupText(val);



      else if (field === 'DESTINATION') setDestinationText(val);



      else if (field === 'SCHEDULE_PICKUP') setScheduleForm(prev => ({ ...prev, pickup: val }));



      else if (field === 'SCHEDULE_DESTINATION') setScheduleForm(prev => ({ ...prev, destination: val }));







      if (debounceRef.current) clearTimeout(debounceRef.current);







      if (val.length > 2) {



         debounceRef.current = setTimeout(async () => {



             const results = await MapService.searchAddress(val);



             setAddressSuggestions(results);



         }, 500);



      } else {



         setAddressSuggestions([]);



      }



  };







  const handleSelectLocation = (place: Location, type: 'PICKUP' | 'DESTINATION' | 'SCHEDULE_PICKUP' | 'SCHEDULE_DESTINATION') => {



      PlacesService.addRecentPlace(place);



      setRecentPlaces(PlacesService.getRecentPlaces());







      if (type === 'PICKUP') { 



        setPickupText(place.address || ''); 



        setPickupLocation(place); 



      } 



      else if (type === 'DESTINATION') { 



        setDestinationText(place.address || ''); 



        setDestinationLocation(place); 



        // Si no hay pickup definido, asumimos ubicacion actual para que el mapa trace ruta



        if (!pickupLocation) { 



          setPickupLocation(userLocation); 



          setPickupText('Ubicación actual'); 



        }



      }



      else if (type === 'SCHEDULE_PICKUP') { setScheduleForm(prev => ({ ...prev, pickup: place.address || '', pickupCoords: place })); }



      else if (type === 'SCHEDULE_DESTINATION') { setScheduleForm(prev => ({ ...prev, destination: place.address || '', destinationCoords: place })); }



      



      setActiveField(null); 



      setAddressSuggestions([]);



  };







  // ETA auto-calculo cuando hay origen y destino



  useEffect(() => {



    const loadEta = async () => {



      if (!pickupLocation || !destinationLocation) { setRouteEta(null); return; }



      const eta = await fetchEta(pickupLocation?.lat, pickupLocation?.lng, destinationLocation?.lat, destinationLocation?.lng, selectedServiceType);



      setRouteEta(eta);



    };



    loadEta();



  }, [pickupLocation?.lat, pickupLocation?.lng, destinationLocation?.lat, destinationLocation?.lng, selectedServiceType]);







  // ETA en tiempo real durante asignacion y viaje



  useEffect(() => {



    let active = true;



    let timer: ReturnType<typeof setInterval> | null = null;







    const tick = async () => {



      if (!assignedDriver) return;



      try {



        if (status === RideStatus.DRIVER_ASSIGNED && pickupLocation) {



          const eta = await fetchEta(assignedDriver?.coords?.lat, assignedDriver?.coords?.lng, pickupLocation?.lat, pickupLocation?.lng, selectedServiceType);



          if (active) {



            setRouteEta(eta);



            if (eta && (eta.distanceKm <= 0.2 || eta.etaMinutes <= 1)) { if (timer) { clearInterval(timer); timer = null; } }



          }



        } else if (status === RideStatus.IN_PROGRESS && destinationLocation) {



          const start = assignedDriver.coords || userLocation;



          const eta = await fetchEta(start.lat, start.lng, destinationLocation?.lat, destinationLocation?.lng, selectedServiceType);



          if (active) {



            setRouteEta(eta);



            if (eta && (eta.distanceKm <= 0.2 || eta.etaMinutes <= 1)) { if (timer) { clearInterval(timer); timer = null; } }



          }



        }



      } catch (_) {



        if (active) setRouteEta(null);



      }



    };







    if ((status === RideStatus.DRIVER_ASSIGNED && pickupLocation) || (status === RideStatus.IN_PROGRESS && destinationLocation)) {



      tick();



      timer = setInterval(tick, 20000);



    }







    return () => {



      active = false;



      if (timer) clearInterval(timer);



    };



  }, [



    status,



    assignedDriver?.coords?.lat,



    assignedDriver?.coords?.lng,



    pickupLocation?.lat,



    pickupLocation?.lng,



    destinationLocation?.lat,



    destinationLocation?.lng,



    selectedServiceType,



    userLocation.lat,



    userLocation.lng



  ]);







  const handleSearchRide = async () => {



     if (!pickupLocation || !destinationLocation) {



        showNotification("Selecciona ubicación válida");



        return;



     }



     setStatus(RideStatus.CHOOSING);



     try {



        const options = await getRideEstimates(



           pickupText || 'Origen',



           destinationText || 'Destino',



           pickupLocation?.lat,



           pickupLocation?.lng,



           selectedServiceType



        );



        const etaMinutes = routeEta?.etaMinutes;



        const optionsWithEta = etaMinutes ? options.map(opt => ({ ...opt, eta: etaMinutes })) : options;



        setRideOptions(currentCooperative ? optionsWithEta.map(opt => ({...opt, price: opt.price})) : optionsWithEta);



     } catch (e) {



        showNotification("Error calculando tarifas");



        setStatus(RideStatus.IDLE);



     }



  };







  const handleRequestRide = async () => {



     if (!currentUser || !selectedRide || !pickupLocation || !destinationLocation) return;



     const otp = Math.floor(1000 + Math.random() * 9000).toString();



     setTripOtp(otp);



     await TripService.requestTrip(currentUser, pickupLocation, destinationLocation, pickupText, destinationText, selectedRide, selectedPaymentMethod, otp, '');



     setStatus(RideStatus.SEARCHING);



     setTimeout(() => {



        if (availableDrivers.length > 0) {



           const driver = availableDrivers[0];



           const offsetDriver = { ...driver, coords: { lat: pickupLocation.lat + 0.005, lng: pickupLocation.lng + 0.005 } };



           setAssignedDriver(offsetDriver);



           setStatus(RideStatus.DRIVER_ASSIGNED);



           showNotification(`Conductor ${driver.name} asignado`);



        }



     }, 3000);



  };







  const resetApp = () => {



     setStatus(RideStatus.IDLE);



     setDestinationText('');



     setDestinationLocation(null);



     setSelectedRide(null);



     setAssignedDriver(null);



     setIncomingRequest(null);



     setTripOtp(null);



  };







  const handleVerifyStartTrip = () => {



      if (driverOtpInput === tripOtp) { setStatus(RideStatus.IN_PROGRESS); showNotification("Viaje iniciado"); } 



      else { showNotification("Código incorrecto"); }



  };







  const finishTripDriver = async () => {



     setStatus(RideStatus.COMPLETED);



     setTimeout(() => { resetApp(); }, 2000);



  };







  // Admin Handlers



  const handleApproveUser = (uid: string) => UserService.approveUser(uid);



  const handleRejectUser = (uid: string) => UserService.rejectUser(uid);



  const handleToggleStatus = (uid: string) => {



     const u = allUsers.find(x => x.id === uid);



     if (u) UserService.updateUserStatus(uid, u.status === AccountStatus.ACTIVE ? AccountStatus.SUSPENDED : AccountStatus.ACTIVE);



  };



  const handleDeleteUser = (uid: string) => UserService.deleteUserProfile(uid);



  const handleOpenReports = () => showNotification("Reportes no disponibles en demo");



  const handleOpenEarnings = (tab: 'EARNINGS' | 'HISTORY' | 'HOURS') => { setDriverEarningsTab(tab); setIsDriverEarningsOpen(true); };



  const acceptRequest = () => {



      setStatus(RideStatus.DRIVER_ASSIGNED);



      setIncomingRequest(null);



      setCurrentRider({ id: 'rider-mock', name: incomingRequest.riderName || 'Pasajero', role: UserRole.RIDER, status: AccountStatus.ACTIVE, email: 'rider@test.com', photoUrl: incomingRequest.riderPhoto || 'https://ui-avatars.com/api/name=Rider', cooperativeId: currentUser?.cooperativeId });



      setTripOtp("1234");



  };







  const handlePickSavedPlace = () => {



      setIsPlacesModalOpen(false); setIsPickingOnMap(true); setPickingTarget('SAVED_PLACE');



  };







  const handleOpenSchedule = () => {



      const defaultPickupText = (pickupText === '' || pickupText === 'Ubicación actual') ? 'Ubicación actual' : pickupText;



      const defaultPickupCoords = (pickupText === '' || pickupText === 'Ubicación actual') ? userLocation : pickupLocation;



      setScheduleForm({



          pickup: defaultPickupText,



          destination: destinationText,



          pickupCoords: defaultPickupCoords,



          destinationCoords: destinationLocation,



          date: new Date().toISOString().split('T')[0],



          time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),



          notes: ''



      });



      setIsSchedulingOpen(true);



  };







  const handleConfirmSchedule = async () => {



      if (!currentUser) return;



      if (!scheduleForm.pickup || !scheduleForm.destination || !scheduleForm.date || !scheduleForm.time) { showNotification("Por favor completa todos los campos."); return; }



      const dateTimeStr = `${scheduleForm.date}T${scheduleForm.time}`;



      const scheduleTimestamp = new Date(dateTimeStr).getTime();



      try {



          await TripService.createScheduledRide({



              userId: currentUser.id,



              pickupAddress: scheduleForm.pickup,



              destinationAddress: scheduleForm.destination,



              pickupCoords: scheduleForm.pickupCoords || undefined,



              destinationCoords: scheduleForm.destinationCoords || undefined,



              serviceType: selectedServiceType,



              date: scheduleTimestamp,



              status: 'PENDING',



              notes: scheduleForm.notes



          });



          setIsSchedulingOpen(false);



          showNotification("Viaje reservado exitosamente.");



      } catch (e) { showNotification("Error al reservar viaje."); }



  };







  const renderSavedPlacesSuggestions = (type: 'PICKUP' | 'DESTINATION' | 'SCHEDULE_PICKUP' | 'SCHEDULE_DESTINATION') => {



     return (



        <div className="w-full bg-white dark:bg-slate-900 dark:bg-gray-800 rounded-b-xl shadow-xl z-[70] overflow-hidden border border-gray-100 dark:border-slate-800 dark:border-gray-700 animate-slide-up max-h-[50vh] overflow-y-auto mt-1 relative">



           {addressSuggestions.length > 0 && (



              <div className="border-b border-gray-100 dark:border-slate-800 dark:border-gray-700">



                 <p className="text-[10px] uppercase font-bold text-gray-400 dark:text-slate-500 p-3 pb-1">Resultados</p>



                 {addressSuggestions.map((place, idx) => (



                    <button key={`api-${idx}`} onClick={() => handleSelectLocation(place, type)} className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-gray-700 text-left transition">



                       <div className="p-2 bg-gray-100 dark:bg-slate-800 dark:bg-gray-600 rounded-full text-gray-500 dark:text-slate-400 dark:text-gray-300"><MapPin size={16} /></div>



                       <div><p className="font-bold text-sm dark:text-white line-clamp-1">{place.address}</p>{place.subtitle && <p className="text-[10px] text-gray-500 dark:text-slate-400 line-clamp-1">{place.subtitle}</p>}</div>



                    </button>



                 ))}



              </div>



           )}



           {(currentUser?.savedPlaces?.length ?? 0) > 0 && (



              <div>



                 <p className="text-[10px] uppercase font-bold text-gray-400 dark:text-slate-500 p-3 pb-1">Guardados</p>



                 {currentUser?.savedPlaces?.map((place, idx) => (



                    <button key={idx} onClick={() => handleSelectLocation(place.coords, type)} className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-gray-700 text-left transition">



                       <div className="p-2 bg-gray-100 dark:bg-slate-800 dark:bg-gray-600 rounded-full">{place.type === 'HOME' ? <Home size={16} /> : place.type === 'WORK' ? <Briefcase size={16} /> : <Heart size={16} />}</div>



                       <div><p className="font-bold text-sm dark:text-white">{place.name}</p><p className="text-xs text-gray-500 dark:text-slate-400 line-clamp-1">{place.address}</p></div>



                    </button>



                 ))}



              </div>



           )}



           {recentPlaces.length > 0 && (



              <div className="border-t border-gray-100 dark:border-slate-800 dark:border-gray-700">



                 <p className="text-[10px] uppercase font-bold text-gray-400 dark:text-slate-500 p-3 pb-1">Recientes</p>



                 {recentPlaces.map((place, idx) => (



                    <button key={`rec-${idx}`} onClick={() => handleSelectLocation(place, type)} className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-gray-700 text-left transition">



                       <div className="p-2 bg-gray-100 dark:bg-slate-800 dark:bg-gray-600 rounded-full text-gray-500 dark:text-slate-400 dark:text-gray-300"><ClockIcon size={16} /></div>



                       <div><p className="font-bold text-sm dark:text-white line-clamp-1">{place.address}</p><p className="text-[10px] text-gray-500 dark:text-slate-400">Reciente</p></div>



                    </button>



                 ))}



              </div>



           )}



           <button onClick={() => { setIsPickingOnMap(true); setPickingTarget(type); if (type.includes('SCHEDULE')) setIsSchedulingOpen(false); setActiveField(null); }} className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-gray-700 text-left transition border-t border-gray-50 dark:border-gray-700 bg-black text-white dark:bg-white dark:bg-slate-900 dark:text-black dark:text-slate-100">



              <div className="p-2 bg-white dark:bg-slate-900 dark:bg-black rounded-full text-black dark:text-slate-100 dark:text-white"><MapIcon size={16} /></div>



              <div><p className="font-bold text-sm">Seleccionar en el mapa</p><p className="text-xs opacity-80">Fijar ubicación manualmente</p></div>



           </button>



        </div>



     );



  };







  if (isLoadingAuth) return <div className="h-full w-full flex items-center justify-center bg-black text-white"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-white"></div></div>;



  if (!currentUser) return <AuthScreen onLogin={handleLogin} onRegister={handleRegister} onResetPassword={handleResetPassword} error={authError} successMessage={authSuccess} onClearError={() => { setAuthError(null); setAuthSuccess(null); }} />;


  if (currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.SUPERADMIN) {



    return <><AdminPanel users={allUsers} tripHistory={tripHistory} availableDrivers={availableDrivers} onApprove={handleApproveUser} onReject={handleRejectUser} onToggleStatus={handleToggleStatus} onDeleteUser={handleDeleteUser} onLogout={handleLogout} onChangePassword={() => setIsChangePasswordOpen(true)} onNotify={showNotification} currentUser={currentUser} cooperatives={cooperatives} /><ChangePasswordModal isOpen={isChangePasswordOpen} onClose={() => setIsChangePasswordOpen(false)} onSuccess={() => showNotification("Contraseña actualizada")} />{notification && <div className="absolute top-10 right-10 z-[100] bg-black text-white px-6 py-3 rounded-full shadow-2xl animate-bounce-in"><span className="text-sm font-bold">{notification}</span></div>}</>;


  }







  const displayUser = currentUser.role === UserRole.DRIVER ? currentRider : assignedDriver;







  return (



    <div className="h-full w-full relative flex flex-col font-sans bg-white dark:bg-slate-900 dark:bg-gray-900 text-slate-900 dark:text-white overflow-hidden">

      {showPermissionsPrompt && (
        <div className="absolute inset-0 z-[90] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">Permisos necesarios</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Para ofrecer viajes seguros, necesitamos acceso a tu ubicación (GPS), notificaciones, cámara y fotos/galería.</p>
            <div className="flex gap-3">
              <button onClick={handlePermissionsLater} className="flex-1 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-bold">Más tarde</button>
              <button onClick={handlePermissionsAccept} className="flex-1 py-2 rounded-xl bg-emerald-500 text-white font-bold">Permitir</button>
            </div>
          </div>
        </div>
      )}




      <div className="absolute inset-0 z-0">



        <MapBackground userLocation={userLocation} pickupLocation={pickupLocation ?? userLocation} destinationLocation={destinationLocation} availableDrivers={availableDrivers} assignedDriver={assignedDriver ?? null} isSearching={status === RideStatus.SEARCHING} isPickingOnMap={isPickingOnMap} status={status} onCenterChange={(lat, lng) => setMapCenterCoords({lat, lng})} onStartPickDestination={() => { setIsPickingOnMap(true); setPickingTarget('DESTINATION'); }} onLocate={forceLocationRefresh} gpsSignal={gpsSignal} uiBottomPadding={uiBottomPadding} />



      </div>







      {notification && <div className="absolute top-24 left-1/2 transform -translate-x-1/2 bg-black/80 dark:bg-white dark:bg-slate-900/90 backdrop-blur text-white dark:text-black dark:text-slate-100 px-6 py-3 rounded-full shadow-2xl z-[60] flex items-center gap-2 animate-bounce-in w-max max-w-[90%]"><Bell size={16} className="text-yellow-400 dark:text-blue-600 shrink-0" /><span className="text-sm font-medium truncate">{notification}</span></div>}







      <nav className="absolute top-0 left-0 right-0 p-4 z-40 flex justify-between items-center pointer-events-none">



        <button onClick={() => setIsProfileOpen(true)} className="bg-white dark:bg-slate-900 dark:bg-gray-800 text-black dark:text-slate-100 dark:text-white p-3 rounded-full shadow-lg pointer-events-auto hover:scale-105 transition"><Menu size={24} /></button>



        <div className="pointer-events-auto flex items-center gap-2">



           <button onClick={toggleTheme} className="bg-white dark:bg-slate-900 dark:bg-gray-800 p-3 rounded-full shadow-lg">{theme === 'dark' ? <Sun size={20} className="text-white"/> : <Moon size={20} />}</button>



           <button onClick={() => setIsNotificationsOpen(true)} className="bg-white dark:bg-slate-900 dark:bg-gray-800 text-black dark:text-slate-100 dark:text-white p-1 pr-3 rounded-full shadow-lg flex items-center gap-2">



             <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden"><img src={currentUser.photoUrl} alt="User" className="w-full h-full object-cover" /></div>



             {currentCooperative ? <span className="text-[9px] uppercase font-black bg-yellow-400 text-black dark:text-slate-100 px-1 rounded">{currentCooperative.code}</span> : <span className="text-[9px] uppercase font-black bg-gray-200 text-gray-600 dark:text-slate-300 px-1 rounded">GLOBAL</span>}



             <span className="font-bold text-sm hidden md:inline">{currentUser.name.split(' ')[0]}</span>



           </button>



        </div>



      </nav>







      {isPickingOnMap && (



         <div className="absolute bottom-10 left-0 right-0 px-6 z-50 flex flex-col items-center animate-slide-up">



            <div className="bg-white dark:bg-slate-900 dark:bg-gray-800 p-4 rounded-2xl shadow-2xl w-full max-w-md text-center space-y-4">



               <h3 className="font-bold text-lg dark:text-white">Fijar ubicación en el mapa</h3>



               <button onClick={async () => {



                   const addr = await MapService.getAddressFromCoords(mapCenterCoords.lat, mapCenterCoords.lng);



                   const loc = { lat: mapCenterCoords.lat, lng: mapCenterCoords.lng, address: addr };



                   if (pickingTarget === 'PICKUP') { setPickupLocation(loc); setPickupText(addr); setIsPickingOnMap(false); } 



                   else if (pickingTarget === 'DESTINATION') { setDestinationLocation(loc); setDestinationText(addr); setIsPickingOnMap(false); } 



                   else if (pickingTarget === 'SAVED_PLACE') { setTempSavedPlaceLocation(loc); setIsPickingOnMap(false); setIsProfileOpen(true); setIsPlacesModalOpen(true); }



                   else if (pickingTarget === 'SCHEDULE_PICKUP') { setScheduleForm(prev => ({...prev, pickup: addr, pickupCoords: loc})); setIsPickingOnMap(false); setIsSchedulingOpen(true); }



                   else if (pickingTarget === 'SCHEDULE_DESTINATION') { setScheduleForm(prev => ({...prev, destination: addr, destinationCoords: loc})); setIsPickingOnMap(false); setIsSchedulingOpen(true); }



                 }} className="w-full bg-black dark:bg-white dark:bg-slate-900 text-white dark:text-black dark:text-slate-100 py-3 rounded-xl font-bold">Confirmar ubicación</button>



               <button onClick={() => { 



                   setIsPickingOnMap(false); 



                   if (pickingTarget === 'SAVED_PLACE') { setIsProfileOpen(true); setIsPlacesModalOpen(true); } 



                   if (pickingTarget === 'SCHEDULE_PICKUP' || pickingTarget === 'SCHEDULE_DESTINATION') { setIsSchedulingOpen(true); }



               }} className="text-red-500 text-sm font-bold">Cancelar</button>



            </div>



         </div>



      )}







      {currentUser.role === UserRole.DRIVER && status === RideStatus.IDLE && !isPickingOnMap && (



        <div className="absolute bottom-0 w-full bg-white dark:bg-slate-900 dark:bg-gray-900 rounded-t-3xl shadow-2xl z-30 p-6 animate-slide-up">



           <div className="flex justify-between items-center mb-6">



              <div><h2 className="text-2xl font-bold dark:text-white">Panel Conductor</h2><p className="text-gray-400 dark:text-slate-500 text-sm flex items-center gap-2">{isDriverOnline ? <>En línea <span className="font-mono text-black dark:text-slate-100 dark:text-white bg-gray-100 dark:bg-slate-800 dark:bg-gray-800 px-2 rounded-md ml-1">{onlineDuration}</span></> : 'Desconectado'}</p></div>



              <button onClick={() => setIsDriverOnline(!isDriverOnline)} className={`p-4 rounded-full shadow-lg transition transform active:scale-95 ${isDriverOnline ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}><Power size={24} /></button>



           </div>



           <div className="bg-gray-50 dark:bg-slate-800 dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-slate-800 dark:border-gray-700 flex items-center gap-4 mb-4">



              <div className="w-16 h-12 bg-white dark:bg-slate-900 dark:bg-gray-700 rounded-lg overflow-hidden shadow-sm flex items-center justify-center">{currentUser.driverDetails?.carPhotoUrl ? <img src={currentUser.driverDetails?.carPhotoUrl} alt="Car" className="w-full h-full object-cover" /> : <Car size={24} className="text-gray-400 dark:text-slate-500" />}</div>



              <div><p className="font-bold text-gray-900 dark:text-slate-100 dark:text-white">{currentUser.driverDetails?.carModel || "-"}</p><div className="flex items-center gap-2 text-xs text-gray-500 dark:text-slate-400 dark:text-gray-400 dark:text-slate-500 font-mono mt-0.5"><span className="bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded text-gray-700 dark:text-slate-300 dark:text-gray-300 font-bold">{currentUser.driverDetails?.plate || "-"}</span><span className="w-3 h-3 rounded-full border border-gray-300" style={{ backgroundColor: currentUser.driverDetails?.carColor || "#9CA3AF" }}></span></div></div>



           </div>



           <div className="grid grid-cols-3 gap-3 mb-4">



               <button onClick={() => handleOpenEarnings('EARNINGS')} className="flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-800 dark:bg-gray-800 p-4 rounded-2xl hover:bg-gray-100 dark:hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-gray-700 transition"><div className="p-2 bg-green-100 dark:bg-green-900 rounded-full mb-1 text-green-600 dark:text-green-300"><DollarSign size={20} /></div><span className="text-xs font-bold dark:text-white">Ganancias</span></button>



               <button onClick={() => handleOpenEarnings('HOURS')} className="flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-800 dark:bg-gray-800 p-4 rounded-2xl hover:bg-gray-100 dark:hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-gray-700 transition"><div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-full mb-1 text-orange-600 dark:text-orange-300"><Clock size={20} /></div><span className="text-xs font-bold dark:text-white">Horas</span></button>



               <button onClick={() => handleOpenEarnings('HISTORY')} className="flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-800 dark:bg-gray-800 p-4 rounded-2xl hover:bg-gray-100 dark:hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-gray-700 transition"><div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full mb-1 text-blue-600 dark:text-blue-300"><History size={20} /></div><span className="text-xs font-bold dark:text-white">Historial</span></button>



           </div>



           {isDriverOnline && <div className="text-center p-4 bg-gray-50 dark:bg-slate-800 dark:bg-gray-800 rounded-xl animate-pulse"><p className="text-sm font-bold text-gray-500 dark:text-slate-400 dark:text-gray-400 dark:text-slate-500">Esperando solicitudes...</p></div>}



        </div>



      )}







      {currentUser.role === UserRole.DRIVER && incomingRequest && (



         <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">



            <div className="bg-white dark:bg-slate-900 dark:bg-gray-800 w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-bounce-in">



               <div className="h-2 bg-gray-100 dark:bg-slate-800 w-full"><div className="h-full bg-green-500 transition-all duration-1000 ease-linear" style={{ width: `${(incomingRequest.timeLeft / 30) * 100}%` }}></div></div>



               <div className="p-6">



                  <div className="flex justify-center mb-2"><span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded border border-yellow-200 uppercase">Cooperativa: {cooperatives.find(c => c.id === incomingRequest.cooperativeId)?.name || 'General'}</span></div>



                  <div className="text-center mb-6"><h2 className="text-2xl font-black text-gray-900 dark:text-slate-100 dark:text-white">${incomingRequest.price.toFixed(2)}</h2><p className="text-gray-500 dark:text-slate-400 text-sm">{incomingRequest.distance}</p></div>



                  <div className="space-y-4 mb-6 dark:text-gray-300"><div><p className="text-xs text-gray-400 dark:text-slate-500">De</p><p className="font-bold">{incomingRequest.pickup}</p></div><div><p className="text-xs text-gray-400 dark:text-slate-500">A</p><p className="font-bold">{incomingRequest.destination}</p></div></div>



                  <div className="flex gap-3"><button onClick={() => setIncomingRequest(null)} className="flex-1 py-3 bg-gray-100 dark:bg-slate-800 dark:bg-gray-700 text-gray-600 dark:text-slate-300 dark:text-gray-300 font-bold rounded-xl">Rechazar</button><button onClick={acceptRequest} className="flex-[2] py-3 bg-black dark:bg-white dark:bg-slate-900 text-white dark:text-black dark:text-slate-100 font-bold rounded-xl shadow-xl">Aceptar</button></div>



               </div>



            </div>



         </div>



      )}







      {currentUser.role === UserRole.RIDER && status === RideStatus.IDLE && !isPickingOnMap && (


        <div ref={overlayRef} className={`absolute bottom-0 w-full bg-[#0b1220] text-slate-100 shadow-2xl transition-all duration-300 ease-in-out flex flex-col ${activeField ? 'h-full top-0 rounded-none z-[60]' : 'rounded-t-3xl z-30'}`}>


          <div className={`${activeField ? 'pt-16 px-6 pb-2' : 'p-6 pb-0'} relative`}>


            {activeField && (


              <div className="flex items-center mb-4">


                <button onClick={() => { setActiveField(null); setAddressSuggestions([]); }} className="p-2 hover:bg-white dark:bg-slate-900/5 rounded-full"><X size={24}/></button>


                <h2 className="font-bold text-lg ml-2">Planifica tu viaje</h2>


              </div>


            )}





            {/* Inputs */}


            <div className={`mt-6 space-y-3 ${activeField ? '' : ''} relative`}>


              <div className="bg-white dark:bg-slate-900/5 rounded-2xl px-4 py-3 border border-white/10 flex items-center gap-3">


                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>


                <input


                  type="text"


                  className="bg-transparent w-full text-sm font-semibold placeholder:text-slate-400 focus:outline-none"


                  placeholder="Ubicación actual"


                  value={pickupText}


                  onFocus={() => { setActiveField('PICKUP'); if (pickupText === 'Ubicación actual') setPickupText(''); }}


                  onBlur={() => { if (pickupText === '') setPickupText('Ubicación actual'); }}


                  onChange={(e) => handleAddressInput(e.target.value, 'PICKUP')}


                />


                <button onClick={forceLocationRefresh} className="p-2 bg-white dark:bg-slate-900/10 rounded-full hover:bg-white dark:bg-slate-900/20" title="Forzar GPS"><Locate size={16} /></button>


              </div>


              {activeField === 'PICKUP' && renderSavedPlacesSuggestions('PICKUP')}





              <div className="bg-white dark:bg-slate-900/5 rounded-2xl px-4 py-4 border border-white/10 flex items-center gap-3">


                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>


                <input


                  type="text"


                  className="bg-transparent w-full text-lg font-bold placeholder:text-slate-400 focus:outline-none"


                  placeholder="A dónde vamos"


                  value={destinationText}


                  onFocus={() => setActiveField('DESTINATION')}


                  onChange={(e) => handleAddressInput(e.target.value, 'DESTINATION')}


                />


              </div>


              {activeField === 'DESTINATION' && renderSavedPlacesSuggestions('DESTINATION')}


            </div>


          </div>





          <div className="flex-grow overflow-y-auto p-6 pt-2">


            {!activeField && (


              <div className="grid grid-cols-4 gap-2 mb-5">


                {[ServiceType.RIDE, ServiceType.DELIVERY, ServiceType.TRIP].map(st => (


                  <button key={st} onClick={() => setSelectedServiceType(st)} className={`flex flex-col items-center gap-1 p-2 rounded-2xl border text-xs font-semibold transition ${selectedServiceType === st ? 'bg-blue-500 text-white border-blue-400 shadow-lg shadow-blue-500/30' : 'bg-white dark:bg-slate-900/5 border-white/10 text-slate-300'}`}><Car size={20} /><span className="text-[10px] font-bold">{st}</span></button>


                ))}


                <button onClick={handleOpenSchedule} className="flex flex-col items-center gap-1 p-2 rounded-2xl border bg-white dark:bg-slate-900/5 border-white/10 text-slate-300 hover:bg-white dark:bg-slate-900/10 transition"><Calendar size={20} /><span className="text-[10px] font-bold">Agendar</span></button>


              </div>


            )}





            {!activeField && (


              <button onClick={handleSearchRide} disabled={!destinationText} className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-500 transition disabled:opacity-50 shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2">


                <Search size={20} /> Buscar viaje


              </button>


            )}





            {!activeField && (


              <div className="mt-4 flex items-center justify-between text-sm">


                {currentCooperative ? <span className="text-slate-400">Operado por <span className="font-semibold text-slate-200">{currentCooperative.name}</span></span> : <span className="text-slate-400">Cooperativa Global</span>}


                {currentCompany && <span className="inline-flex items-center gap-1 bg-white dark:bg-slate-900/5 px-3 py-1 rounded-full text-[11px] uppercase tracking-wide text-slate-300"><Briefcase size={12}/> {currentCompany.name}</span>}


              </div>


            )}


          </div>


        </div>


      )}






      {status === RideStatus.CHOOSING && (



        <div className="absolute bottom-0 w-full bg-white dark:bg-slate-900 dark:bg-gray-900 rounded-t-3xl shadow-2xl z-30 animate-slide-up">



           <div className="p-4 border-b border-gray-100 dark:border-slate-800 dark:border-gray-800 flex items-center gap-3"><button onClick={resetApp} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-gray-800 rounded-full"><X size={20} className="dark:text-white"/></button><h3 className="font-bold dark:text-white">Elige tu viaje</h3></div>



           <div className="max-h-[35vh] overflow-y-auto p-4 space-y-3">



             {rideOptions.map((opt) => (



                 <div key={opt.id} onClick={() => setSelectedRide(opt)} className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition ${selectedRide?.id === opt.id ? 'border-black dark:border-white bg-gray-50 dark:bg-slate-800 dark:bg-gray-800' : 'border-transparent hover:bg-gray-50 dark:hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-gray-800'}`}><div className="flex-grow"><div className="flex justify-between items-center dark:text-white"><h4 className="font-bold text-lg">{opt.name}</h4><span className="font-bold text-lg">{opt.currency}{opt.price.toFixed(2)}</span></div><p className="text-xs text-gray-500 dark:text-slate-400">{formatEtaRange(routeEta) || `${opt.eta} min`}  {opt.duration} min viaje {routeEta && routeEta.confidence < 0.5 && <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] bg-yellow-100 text-yellow-700 font-bold uppercase">estimaci�n baja</span>}</p></div></div>



             ))}



           </div>



           <div className="p-6 border-t border-gray-100 dark:border-slate-800 dark:border-gray-800 bg-white dark:bg-slate-900 dark:bg-gray-900 pb-8 space-y-4"><button onClick={handleRequestRide} disabled={!selectedRide} className="w-full bg-black dark:bg-white dark:bg-slate-900 text-white dark:text-black dark:text-slate-100 font-bold py-4 rounded-xl shadow-xl hover:scale-[1.02] transition disabled:opacity-50">Confirmar {selectedRide ? selectedRide.name : "viaje"}</button></div>



        </div>



      )}







      {(status === RideStatus.SEARCHING || status === RideStatus.DRIVER_ASSIGNED || status === RideStatus.IN_PROGRESS || status === RideStatus.COMPLETED) && (



        <div ref={overlayRef} className="absolute bottom-0 w-full bg-white dark:bg-slate-900 dark:bg-gray-900 rounded-t-3xl shadow-2xl z-30 animate-slide-up">



          {status === RideStatus.SEARCHING && (



             <div className="p-8 text-center dark:text-white"><div className="w-16 h-16 bg-gray-100 dark:bg-slate-800 dark:bg-gray-800 rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse"><Search size={32} /></div><h3 className="font-bold text-xl mb-2">Buscando conductor...</h3><button onClick={resetApp} className="w-full py-3 rounded-xl border border-gray-200 dark:border-slate-800 dark:border-gray-700 text-red-500 font-bold text-sm hover:bg-red-50 dark:hover:bg-red-900/20">Cancelar</button></div>



          )}



          {(status !== RideStatus.SEARCHING && displayUser) && (



             <div className="p-0">



                <div className="bg-black dark:bg-gray-800 text-white p-4 px-6 flex items-center justify-between"><span className="text-lg font-bold">{status === RideStatus.IN_PROGRESS ? 'En Viaje' : 'Conductor Asignado'}</span><span className="font-bold text-lg">${(selectedRide?.price ?? incomingRequest.price).toFixed(2)}</span></div>



                <div className="p-6 dark:text-white">



                   <div className="flex items-center gap-4 mb-6"><img src={displayUser.photoUrl} className="w-16 h-16 rounded-full border-4 border-white dark:border-gray-700 shadow-lg object-cover" /><div><h3 className="font-bold text-xl">{displayUser.name}</h3>{currentUser.role === UserRole.RIDER && assignedDriver && <p className="text-sm text-gray-500 dark:text-slate-400">{assignedDriver.carModel}  {assignedDriver.plate}</p>}</div></div>



                   {currentUser.role === UserRole.RIDER && routeEta && (



                     <div className="mb-4 flex items-center gap-2 text-sm text-gray-600 dark:text-slate-300 dark:text-gray-300">



                        <ClockIcon size={16} />



                        <span className="font-bold">{formatEtaRange(routeEta) || `${routeEta.etaMinutes} min`}</span>



                        {routeEta.confidence < 0.5 && <span className="text-[10px] px-2 py-1 bg-yellow-100 text-yellow-700 font-bold uppercase rounded-full">estimaci�n baja</span>}



                        <span className="text-xs text-gray-400 dark:text-slate-500">{status === RideStatus.DRIVER_ASSIGNED ? 'a la recogida' : 'al destino'}</span>
                        {routeEta.totalMs !== undefined && (
                          <span className="text-[10px] text-gray-400 dark:text-slate-500">c�lculo: {routeEta.totalMs} ms</span>
                        )}



                     </div>



                   )}



                   {currentUser.role === UserRole.RIDER && status === RideStatus.DRIVER_ASSIGNED && tripOtp && <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 rounded-xl p-4 mb-6 text-center"><p className="text-blue-600 dark:text-blue-400 text-xs font-bold uppercase mb-1">Código de Seguridad</p><p className="text-3xl font-black text-blue-900 dark:text-white tracking-[0.5em]">{tripOtp}</p></div>}



                   <div className="grid grid-cols-2 gap-3 mb-4"><button onClick={() => showNotification("Chat no disponible")} className="bg-gray-100 dark:bg-slate-800 dark:bg-gray-800 py-3 rounded-xl font-bold flex items-center justify-center gap-2"><MessageSquare size={20} /> Chat</button><button onClick={handleLogout} className="bg-gray-100 dark:bg-slate-800 dark:bg-gray-800 py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-red-500"><LogOut size={20} /> Salir</button></div>



                   {currentUser.role === UserRole.DRIVER && status === RideStatus.DRIVER_ASSIGNED && (<div className="flex gap-2">{showOtpInput ? <><input type="text" value={driverOtpInput} onChange={e=>setDriverOtpInput(e.target.value)} className="flex-grow bg-gray-100 dark:bg-slate-800 dark:bg-gray-800 rounded-xl px-4 text-center font-bold" placeholder="PIN" /><button onClick={handleVerifyStartTrip} className="bg-green-600 text-white px-6 rounded-xl font-bold"><CheckCircle2/></button></> : <button onClick={() => setShowOtpInput(true)} className="w-full bg-black dark:bg-white dark:bg-slate-900 text-white dark:text-black dark:text-slate-100 py-4 rounded-xl font-bold flex items-center justify-center gap-2"><Lock size={20}/> Iniciar Viaje</button>}</div>)}



                   {currentUser.role === UserRole.DRIVER && status === RideStatus.IN_PROGRESS && <button onClick={finishTripDriver} className="w-full bg-red-600 text-white py-4 rounded-xl font-bold">Finalizar Viaje</button>}



                </div>



             </div>



          )}



        </div>



      )}







      <ProfileMenu isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} user={currentUser} onLogout={handleLogout} onOpenHistory={() => {setIsProfileOpen(false); setHistoryInitialTab('LIST'); setIsHistoryOpen(true);}} onOpenPayments={() => {setIsProfileOpen(false); setIsPaymentModalOpen(true);}} onOpenSavedPlaces={() => {setIsProfileOpen(false); setIsPlacesModalOpen(true);}} onOpenHelp={() => {setIsProfileOpen(false); setIsHelpModalOpen(true);}} onOpenReports={handleOpenReports} onChangePassword={() => {setIsProfileOpen(false); setIsChangePasswordOpen(true);}} onOpenScheduledRides={() => {setIsProfileOpen(false); setIsScheduledRidesListOpen(true);}} onRequestPermissions={handlePermissionsAccept} riderStats={currentUser.role === UserRole.RIDER ? { todayAmount: `$${tripHistory.length > 0 ? (tripHistory.length * 5).toFixed(2) : '0.00'}`, todayDeltaLabel: '+5% vs ayer', tripsThisWeek: tripHistory.length || 0, tier: 'Gold', tierStatus: 'Estable' } : undefined} />



      <Suspense fallback={null}>



        <TripHistory isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} history={tripHistory} userRole={currentUser.role} initialTab={historyInitialTab} onBack={() => { setIsHistoryOpen(false); setIsProfileOpen(true); }} />



        {isPlacesModalOpen && <SavedPlacesModal isOpen={isPlacesModalOpen} onClose={() => {setIsPlacesModalOpen(false); setTempSavedPlaceLocation(null);}} user={currentUser} onSelect={(loc, type) => handleSelectLocation(loc, type)} onPickFromMap={handlePickSavedPlace} prefilledLocation={tempSavedPlaceLocation} />}



        {isPaymentModalOpen && <PaymentMethodsModal isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)} user={currentUser} onSelectMethod={(m) => setSelectedPaymentMethod(m)} />}



        <ChangePasswordModal isOpen={isChangePasswordOpen} onClose={() => setIsChangePasswordOpen(false)} onSuccess={() => showNotification("Contraseña actualizada")} />



        <ScheduledRidesModal isOpen={isScheduledRidesListOpen} onClose={() => setIsScheduledRidesListOpen(false)} user={currentUser} />



        <NotificationsModal isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />



        <DriverEarningsModal isOpen={isDriverEarningsOpen} onClose={() => setIsDriverEarningsOpen(false)} tripHistory={tripHistory} initialTab={driverEarningsTab} />



        <HelpCenterModal isOpen={isHelpModalOpen} onClose={() => setIsHelpModalOpen(false)} user={currentUser} />



      </Suspense>



      {isSchedulingOpen && (



        <div className="absolute inset-0 z-[80] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">



           <div className="bg-white dark:bg-slate-900 dark:bg-gray-800 w-full max-w-sm rounded-3xl p-6 shadow-xl animate-slide-up flex flex-col max-h-[90vh]">



              <div className="flex justify-between items-center mb-6"><h2 className="text-xl font-bold flex items-center gap-2 dark:text-white"><Calendar size={24}/> Agendar Viaje</h2><button onClick={() => setIsSchedulingOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-gray-700 rounded-full"><X size={20} className="dark:text-white"/></button></div>



              <div className="space-y-4 overflow-y-auto">



                 <div className="relative"><label className="block text-xs font-bold text-gray-500 dark:text-slate-400 mb-1 uppercase">Origen</label><div className="relative"><div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-green-500 rounded-full z-10"></div><input type="text" className="w-full bg-gray-50 dark:bg-slate-800 dark:bg-gray-700 dark:text-white p-3 pl-8 rounded-xl font-bold text-sm pr-20 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition" value={scheduleForm.pickup} onChange={e => handleAddressInput(e.target.value, 'SCHEDULE_PICKUP')} onFocus={() => { setActiveField('SCHEDULE_PICKUP'); if (scheduleForm.pickup === 'Ubicación actual') { setScheduleForm(prev => ({ ...prev, pickup: '' })); } }} onBlur={() => { if (scheduleForm.pickup.trim() === '') { setScheduleForm(prev => ({ ...prev, pickup: 'Ubicación actual', pickupCoords: userLocation })); } }} placeholder="Dirección de recogida" /><div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1"><button onClick={() => { setScheduleForm(prev => ({...prev, pickup: 'Ubicación actual', pickupCoords: userLocation})); forceLocationRefresh(); }} className="p-1.5 bg-white dark:bg-slate-900 dark:bg-black rounded-full text-black dark:text-slate-100 dark:text-white shadow-sm border border-gray-200 dark:border-slate-800 dark:border-gray-600 hover:scale-105 transition" title="Usar ubicación actual"><Locate size={14} /></button>{scheduleForm.pickupCoords && scheduleForm.pickup !== 'Ubicación actual' && (<div className="p-1.5 text-green-500"><MapPin size={16} /></div>)}</div></div>{activeField === 'SCHEDULE_PICKUP' && renderSavedPlacesSuggestions('SCHEDULE_PICKUP')}</div>



                 <div className="relative"><label className="block text-xs font-bold text-gray-500 dark:text-slate-400 mb-1 uppercase">Destino</label><div className="relative"><div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-black dark:bg-white dark:bg-slate-900 rounded-full z-10"></div><input type="text" className="w-full bg-gray-50 dark:bg-slate-800 dark:bg-gray-700 dark:text-white p-3 pl-8 rounded-xl font-bold text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition" value={scheduleForm.destination} onChange={e => handleAddressInput(e.target.value, 'SCHEDULE_DESTINATION')} onFocus={() => setActiveField('SCHEDULE_DESTINATION')} placeholder="A dónde vamos" />{scheduleForm.destinationCoords && (<div className="absolute right-3 top-3 text-black dark:text-slate-100 dark:text-white"><MapPin size={16} /></div>)}</div>{activeField === 'SCHEDULE_DESTINATION' && renderSavedPlacesSuggestions('SCHEDULE_DESTINATION')}</div>



                 <div className="grid grid-cols-2 gap-4"><div><label className="block text-xs font-bold text-gray-500 dark:text-slate-400 mb-1 uppercase">Fecha</label><input type="date" className="w-full bg-gray-50 dark:bg-slate-800 dark:bg-gray-700 dark:text-white p-3 rounded-xl font-bold text-sm" value={scheduleForm.date} onChange={e => setScheduleForm({...scheduleForm, date: e.target.value})} /></div><div><label className="block text-xs font-bold text-gray-500 dark:text-slate-400 mb-1 uppercase">Hora</label><input type="time" className="w-full bg-gray-50 dark:bg-slate-800 dark:bg-gray-700 dark:text-white p-3 rounded-xl font-bold text-sm" value={scheduleForm.time} onChange={e => setScheduleForm({...scheduleForm, time: e.target.value})} /></div></div>



                 <div><label className="block text-xs font-bold text-gray-500 dark:text-slate-400 mb-1 uppercase">Observaciones</label><textarea className="w-full bg-gray-50 dark:bg-slate-800 dark:bg-gray-700 dark:text-white p-3 rounded-xl font-bold text-sm resize-none h-20" placeholder="Cantidad de personas, maletas, mascotas..." value={scheduleForm.notes} onChange={e => setScheduleForm({...scheduleForm, notes: e.target.value})}></textarea></div>



                 <button className="w-full bg-black dark:bg-white dark:bg-slate-900 text-white dark:text-black dark:text-slate-100 py-4 rounded-xl font-bold mt-4 shadow-lg" onClick={handleConfirmSchedule}>Confirmar Reserva</button>



              </div>



           </div>



        </div>



      )}



    </div>



  );



}











