
import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { 
  LayoutDashboard, Users, Car, Map as MapIcon, 
  DollarSign, Settings, Headphones, BarChart3, 
  Bell, LogOut, Search, Filter, Check, X, 
  Eye, MoreVertical, AlertTriangle, FileText, 
  TrendingUp, CreditCard, Calendar, Shield, 
  MessageSquare, MapPin, Navigation, Tag,
  PieChart, Activity, UserX, AlertOctagon,
  Star, Menu
} from 'lucide-react';
import { 
  User, UserRole, AccountStatus, AdminReport, 
  SystemNotification, TripHistoryItem, Driver, 
  PricingConfig, SupportTicket, Transaction, PaymentMethod 
} from '../types';

interface AdminPanelProps {
  users: User[];
  tripHistory: TripHistoryItem[];
  availableDrivers?: Driver[];
  onApprove: (userId: string) => void;
  onReject: (userId: string) => void;
  onLogout: () => void;
}

// --- MOCK DATA FOR NEW MODULES ---
const MOCK_PRICING: PricingConfig = {
  city: 'Guayaquil',
  baseRate: 1.50,
  perKm: 0.35,
  perMin: 0.10,
  minFare: 2.00,
  commissionPct: 20,
  bookingFee: 0.25
};

const MOCK_TICKETS: SupportTicket[] = [
  { id: 't1', userId: 'rider-demo', userName: 'Pasajero Gye', userRole: UserRole.RIDER, subject: 'Cobro duplicado', description: 'Me cobraron dos veces el viaje al centro.', status: 'OPEN', priority: 'HIGH', date: Date.now() - 86400000 },
  { id: 't2', userId: 'driver-demo', userName: 'Conductor Gye', userRole: UserRole.DRIVER, subject: 'Pasajero no pagó', description: 'El usuario se bajó sin pagar en efectivo.', status: 'IN_PROGRESS', priority: 'MEDIUM', date: Date.now() - 172800000 },
];

const MOCK_FINANCE: Transaction[] = [
  { id: 'tr1', userId: 'driver-demo', userName: 'Conductor Gye', amount: 45.50, type: 'PAYOUT', status: 'PENDING', date: Date.now(), method: 'Bank Transfer' },
  { id: 'tr2', userId: 'system', userName: 'GeminiRide', amount: 12.30, type: 'COMMISSION', status: 'PAID', date: Date.now() - 3600000, method: 'Internal' },
];

type AdminView = 'DASHBOARD' | 'RIDERS' | 'DRIVERS' | 'TRIPS' | 'FINANCE' | 'CONFIG' | 'SUPPORT' | 'ANALYTICS' | 'ROLES' | 'MARKETING';
type AnalyticsTab = 'TRIPS' | 'REVENUE' | 'DRIVERS' | 'RIDERS' | 'RISK';

export const AdminPanel: React.FC<AdminPanelProps> = ({ users, tripHistory, availableDrivers = [], onApprove, onReject, onLogout }) => {
  const [activeView, setActiveView] = useState<AdminView>('DASHBOARD');
  const [analyticsTab, setAnalyticsTab] = useState<AnalyticsTab>('TRIPS');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile Sidebar State
  
  // Global States
  const [pricing, setPricing] = useState<PricingConfig>(MOCK_PRICING);
  const [tickets, setTickets] = useState<SupportTicket[]>(MOCK_TICKETS);
  
  // Dashboard Map Refs
  const dashboardMapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  // --- HELPER: STATS CALCULATION ---
  const activeDrivers = users.filter(u => u.role === UserRole.DRIVER && u.status === AccountStatus.ACTIVE).length;
  const onlineDrivers = availableDrivers.length;
  const revenueTotal = tripHistory.reduce((acc, t) => acc + t.price, 0);
  const platformRevenue = revenueTotal * (pricing.commissionPct / 100);

  // --- EFFECT: OPERATIONAL MAP FIX ---
  useEffect(() => {
    // Cleanup function to remove map when view changes
    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.off();
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markersRef.current = [];
      }
    };
  }, [activeView]);

  useEffect(() => {
    if (activeView === 'DASHBOARD' && dashboardMapRef.current) {
      
      // Initialize Map only if it doesn't exist
      if (!mapInstanceRef.current) {
        const map = L.map(dashboardMapRef.current, { zoomControl: false }).setView([-2.1894, -79.8891], 12);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; OpenStreetMap',
          maxZoom: 19
        }).addTo(map);
        mapInstanceRef.current = map;

        // Mock Heatmap Zones
        L.circle([-2.1500, -79.8900], { color: 'transparent', fillColor: '#ef4444', fillOpacity: 0.3, radius: 1200 }).addTo(map); // Norte
        L.circle([-2.1900, -79.8800], { color: 'transparent', fillColor: '#f59e0b', fillOpacity: 0.3, radius: 800 }).addTo(map); // Centro

        // FIX: Add ResizeObserver to force map redraw when container size changes
        resizeObserverRef.current = new ResizeObserver(() => {
          map.invalidateSize();
        });
        resizeObserverRef.current.observe(dashboardMapRef.current);
      }

      // Update Drivers Logic
      if (mapInstanceRef.current) {
        const map = mapInstanceRef.current;
        
        // Clear old markers safely
        markersRef.current.forEach(m => {
             try { m.remove(); } catch(e) {} 
        });
        markersRef.current = [];
        
        availableDrivers.forEach(d => {
          const isBusy = Math.random() > 0.7; // Mock busy status
          const color = isBusy ? '#ef4444' : '#22c55e';
          const marker = L.circleMarker([d.coords.lat, d.coords.lng], {
            radius: 6,
            fillColor: color,
            color: '#fff',
            weight: 2,
            fillOpacity: 1
          }).addTo(map);
          marker.bindTooltip(`${d.name} (${isBusy ? 'Ocupado' : 'Libre'})`);
          markersRef.current.push(marker);
        });
      }
    }
  }, [activeView, availableDrivers]);

  // --- RENDER: SIDEBAR ---
  const renderSidebar = () => (
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar Content */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white flex flex-col h-screen shadow-xl transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold">FR</div>
            <div>
              <h1 className="font-bold text-lg leading-none">FelcarRide</h1>
              <span className="text-[10px] text-gray-500 uppercase">Admin Panel</span>
            </div>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-400">
            <X size={24} />
          </button>
        </div>
        
        <div className="flex-grow overflow-y-auto py-4 space-y-1">
          <MenuItem view="DASHBOARD" icon={<LayoutDashboard size={18} />} label="Dashboard" />
          <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase mt-4">Operaciones</div>
          <MenuItem view="RIDERS" icon={<Users size={18} />} label="Riders (Clientes)" />
          <MenuItem view="DRIVERS" icon={<Car size={18} />} label="Drivers (Conductores)" />
          <MenuItem view="TRIPS" icon={<MapIcon size={18} />} label="Viajes y Monitoreo" />
          <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase mt-4">Negocio</div>
          <MenuItem view="FINANCE" icon={<DollarSign size={18} />} label="Pagos y Finanzas" />
          <MenuItem view="CONFIG" icon={<Settings size={18} />} label="Tarifas y Config" />
          <MenuItem view="MARKETING" icon={<Tag size={18} />} label="Marketing y Push" />
          <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase mt-4">Soporte</div>
          <MenuItem view="SUPPORT" icon={<Headphones size={18} />} label="Quejas y Tickets" />
          <MenuItem view="ANALYTICS" icon={<BarChart3 size={18} />} label="Reportes" />
        </div>

        <div className="p-4 border-t border-gray-800">
          <button onClick={onLogout} className="flex items-center gap-3 w-full px-4 py-2 text-red-400 hover:bg-gray-800 rounded-lg transition">
            <LogOut size={18} /> Salir
          </button>
        </div>
      </div>
    </>
  );

  const MenuItem = ({ view, icon, label }: { view: AdminView, icon: React.ReactNode, label: string }) => (
    <button 
      onClick={() => { setActiveView(view); setIsSidebarOpen(false); }}
      className={`w-full flex items-center gap-3 px-6 py-3 text-sm font-medium transition border-l-4 ${activeView === view ? 'border-blue-500 bg-gray-800 text-white' : 'border-transparent text-gray-400 hover:text-white hover:bg-gray-800'}`}
    >
      {icon} {label}
    </button>
  );

  // --- RENDER: DASHBOARD ---
  const renderDashboard = () => (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-800">Visión General</h2>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Ingresos Hoy" value={`$${(revenueTotal * 0.15).toFixed(2)}`} trend="+12%" icon={<DollarSign className="text-green-600" />} color="bg-green-50" />
        <StatCard title="Viajes Activos" value={tripHistory.filter(t => t.status === 'IN_PROGRESS').length.toString()} sub="En curso ahora" icon={<Navigation className="text-blue-600" />} color="bg-blue-50" />
        <StatCard title="Drivers Online" value={`${onlineDrivers} / ${activeDrivers}`} sub="Conectados" icon={<Car className="text-orange-600" />} color="bg-orange-50" />
        <StatCard title="Tickets Abiertos" value={tickets.filter(t => t.status === 'OPEN').length.toString()} trend="Atención req." icon={<AlertTriangle className="text-red-600" />} color="bg-red-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Operational Map */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden h-[400px] flex flex-col">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold flex items-center gap-2"><MapIcon size={18}/> Mapa Operativo</h3>
            <div className="flex gap-3 text-xs font-bold">
              <span className="flex items-center gap-1"><div className="w-2 h-2 bg-green-500 rounded-full"></div> Libre</span>
              <span className="flex items-center gap-1"><div className="w-2 h-2 bg-red-500 rounded-full"></div> Ocupado</span>
            </div>
          </div>
          {/* Map Container needs to be relative for Leaflet */}
          <div className="flex-grow bg-gray-100 relative" ref={dashboardMapRef}></div>
        </div>

        {/* KPIs */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
             <h3 className="font-bold text-lg mb-4">KPIs Clave</h3>
             <div className="space-y-4">
                <KpiRow label="Tiempo Espera" value="3.2 min" />
                <KpiRow label="Calif. Drivers" value="4.8 ★" />
                <KpiRow label="Tasa Cancelación" value="4.5%" />
                <KpiRow label="Ticket Promedio" value="$4.20" />
             </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
             <h3 className="font-bold text-lg mb-4">Zonas Top</h3>
             <div className="space-y-3">
                <div className="flex justify-between text-sm"><span className="text-gray-600">1. Mall del Sol</span> <span className="font-bold text-green-600">Alta</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-600">2. Centro</span> <span className="font-bold text-yellow-600">Media</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-600">3. Samborondón</span> <span className="font-bold text-yellow-600">Media</span></div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );

  // --- RENDER: ANALYTICS (NEW MODULE) ---
  const renderAnalytics = () => {
    // Mock Data Generation for charts
    const hourlyData = [5,3,2,1,2,8,15,25,32,28,24,22,28,35,40,38,30,45,55,40,25,15,10,6]; // 24h demand
    const maxDemand = Math.max(...hourlyData);
    
    const topDrivers = [
      { name: 'Conductor Gye', trips: 142, earnings: 650.50, rating: 4.9 },
      { name: 'Juan Pérez', trips: 120, earnings: 520.20, rating: 4.8 },
      { name: 'Maria Lopez', trips: 98, earnings: 410.00, rating: 4.7 },
      { name: 'Carlos Ruiz', trips: 85, earnings: 350.00, rating: 4.9 },
    ];

    const riskDrivers = [
      { name: 'Luis V.', cancels: 15, total: 40, rate: '37%' },
      { name: 'Ana M.', cancels: 8, total: 35, rate: '22%' },
    ];

    return (
      <div className="space-y-6 animate-fade-in">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-800">Reportes</h2>
            <div className="flex flex-wrap bg-white rounded-lg p-1 border border-gray-200 shadow-sm w-full md:w-auto overflow-x-auto">
               {(['TRIPS', 'REVENUE', 'DRIVERS', 'RIDERS', 'RISK'] as AnalyticsTab[]).map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setAnalyticsTab(tab)}
                    className={`flex-1 md:flex-none px-3 py-2 text-xs font-bold rounded-md transition whitespace-nowrap ${analyticsTab === tab ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                  >
                     {tab === 'TRIPS' && 'Viajes'}
                     {tab === 'REVENUE' && 'Ingresos'}
                     {tab === 'DRIVERS' && 'Drivers'}
                     {tab === 'RIDERS' && 'Riders'}
                     {tab === 'RISK' && 'Riesgo'}
                  </button>
               ))}
            </div>
         </div>

         {/* TAB: TRIPS */}
         {analyticsTab === 'TRIPS' && (
            <div className="space-y-6">
               <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard title="Total Viajes" value="1,254" sub="Mes" icon={<MapIcon />} color="bg-blue-50" />
                  <StatCard title="Completados" value="1,100" sub="87%" icon={<Check />} color="bg-green-50" />
                  <StatCard title="Cancelados" value="154" sub="12%" icon={<X />} color="bg-red-50" />
                  <StatCard title="Distancia" value="5,400km" sub="Total" icon={<Navigation />} color="bg-orange-50" />
               </div>

               <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                  <h3 className="font-bold text-lg mb-6 flex items-center gap-2"><BarChart3 size={20} /> Demanda por Horas</h3>
                  <div className="flex items-end justify-between h-48 gap-1">
                     {hourlyData.map((val, i) => (
                        <div key={i} className="flex flex-col items-center flex-1 group">
                           <div className="w-full bg-blue-50 rounded-t-sm relative h-full flex items-end">
                              <div 
                                className="w-full bg-blue-600 hover:bg-blue-800 transition-all rounded-t-sm" 
                                style={{ height: `${(val/maxDemand)*100}%` }}
                              ></div>
                           </div>
                           <span className="text-[9px] text-gray-400 mt-2 hidden md:block">{i}h</span>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         )}

         {/* TAB: REVENUE */}
         {analyticsTab === 'REVENUE' && (
            <div className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                     <h3 className="text-gray-500 font-bold uppercase text-xs mb-2">Ingresos Brutos</h3>
                     <p className="text-3xl lg:text-4xl font-black text-gray-900">$12,540</p>
                     <p className="text-xs text-green-600 font-bold mt-2">+8.5%</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                     <h3 className="text-gray-500 font-bold uppercase text-xs mb-2">Comisión</h3>
                     <p className="text-3xl lg:text-4xl font-black text-blue-600">$2,508</p>
                     <p className="text-xs text-gray-400 mt-2">20%</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                     <h3 className="text-gray-500 font-bold uppercase text-xs mb-2">Neto Drivers</h3>
                     <p className="text-3xl lg:text-4xl font-black text-green-600">$10,032</p>
                     <p className="text-xs text-gray-400 mt-2">Dispersado</p>
                  </div>
               </div>
            </div>
         )}

         {/* TAB: DRIVERS */}
         {analyticsTab === 'DRIVERS' && (
            <div className="space-y-6">
               <div className="grid grid-cols-3 gap-4">
                  <StatCard title="Activos" value="120" sub="Flota" icon={<Car />} color="bg-blue-50" />
                  <StatCard title="Online" value="85" sub="Hoy" icon={<Activity />} color="bg-green-50" />
                  <StatCard title="Rating" value="4.7" sub="Prom" icon={<Star />} color="bg-yellow-50" />
               </div>

               <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
                  <div className="p-4 border-b border-gray-100 font-bold">
                     <h3>Top Conductores</h3>
                  </div>
                  <table className="w-full text-sm text-left min-w-[500px]">
                     <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
                        <tr>
                           <th className="px-6 py-3">Nombre</th>
                           <th className="px-6 py-3">Viajes</th>
                           <th className="px-6 py-3">Ganancias</th>
                           <th className="px-6 py-3">Rating</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-100">
                        {topDrivers.map((d, i) => (
                           <tr key={i} className="hover:bg-gray-50">
                              <td className="px-6 py-3 font-bold">{d.name}</td>
                              <td className="px-6 py-3">{d.trips}</td>
                              <td className="px-6 py-3 text-green-600 font-mono">${d.earnings.toFixed(2)}</td>
                              <td className="px-6 py-3 flex items-center gap-1"><Star size={12} className="text-yellow-400 fill-yellow-400" /> {d.rating}</td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
         )}
         
         {/* Other tabs simplified for brevity but follow same pattern */}
         {analyticsTab === 'RIDERS' && <div className="p-10 text-center text-gray-400">Datos de Riders en desarrollo</div>}
         {analyticsTab === 'RISK' && <div className="p-10 text-center text-gray-400">Análisis de Riesgo en desarrollo</div>}
      </div>
    );
  };

  // --- RENDER: USERS (RIDERS/DRIVERS) ---
  const renderUserList = (role: UserRole) => {
    const targetUsers = users.filter(u => u.role === role);
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">{role === UserRole.RIDER ? 'Riders' : 'Drivers'}</h2>
          <div className="flex gap-2">
             <button className="bg-black text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2"><LogOut size={16} className="rotate-180"/> CSV</button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[600px]">
            <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-xs">
              <tr>
                <th className="px-6 py-4">Usuario</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4">{role === UserRole.DRIVER ? 'Vehículo' : 'Stats'}</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {targetUsers.map(u => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={u.photoUrl} className="w-10 h-10 rounded-full bg-gray-200" />
                      <div>
                        <p className="font-bold text-gray-900">{u.name}</p>
                        <p className="text-xs text-gray-500">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${u.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : u.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {role === UserRole.DRIVER && u.driverDetails ? (
                      <div>
                        <p className="font-bold">{u.driverDetails.carModel}</p>
                        <p className="text-xs text-gray-500 font-mono">{u.driverDetails.plate}</p>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-500">N/A</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {u.status === 'PENDING' && (
                       <div className="flex justify-end gap-2">
                          <button onClick={() => onApprove(u.id)} className="text-xs bg-green-600 text-white px-2 py-1 rounded">Ok</button>
                          <button onClick={() => onReject(u.id)} className="text-xs bg-red-600 text-white px-2 py-1 rounded">X</button>
                       </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // --- RENDER: TRIPS ---
  const renderTrips = () => (
    <div className="space-y-6 animate-fade-in">
       <h2 className="text-2xl font-bold text-gray-800">Viajes</h2>
       <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[700px]">
             <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-xs">
                <tr>
                   <th className="px-6 py-4">ID</th>
                   <th className="px-6 py-4">Ruta</th>
                   <th className="px-6 py-4">Tarifa</th>
                   <th className="px-6 py-4">Estado</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-gray-100">
                {tripHistory.map(trip => (
                   <tr key={trip.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-mono text-xs font-bold">#{trip.id.slice(0,6)}</td>
                      <td className="px-6 py-4 max-w-xs truncate">
                         {trip.pickupAddress} -> {trip.destinationAddress}
                      </td>
                      <td className="px-6 py-4 font-bold">
                         {trip.currency}{trip.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                         <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${trip.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {trip.status}
                         </span>
                      </td>
                   </tr>
                ))}
             </tbody>
          </table>
       </div>
    </div>
  );

  return (
    <div className="h-full w-full bg-gray-50 font-sans flex flex-col md:flex-row overflow-hidden">
      {/* Sidebar */}
      {renderSidebar()}
      
      {/* Main Content - Scrollable Area */}
      <div className="flex-grow md:ml-64 h-full transition-all duration-300 overflow-y-auto">
         <div className="p-4 md:p-8 min-h-full">
            {/* Topbar Mobile */}
            <div className="flex justify-between items-center mb-6 md:mb-8">
               <div className="flex items-center gap-3">
                  <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 bg-white rounded-lg shadow-sm border border-gray-200 text-gray-700">
                     <Menu size={24} />
                  </button>
                  <h1 className="md:hidden font-bold text-lg">FelcarRide</h1>
               </div>

               <div className="flex items-center gap-4 ml-auto">
                  <button className="relative p-2 bg-white rounded-full shadow-sm hover:bg-gray-50">
                     <Bell size={20} className="text-gray-600" />
                     <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                  </button>
                  <div className="w-9 h-9 md:w-10 md:h-10 bg-blue-900 rounded-full flex items-center justify-center text-white font-bold text-sm">AD</div>
               </div>
            </div>

            {/* View Routing */}
            {activeView === 'DASHBOARD' && renderDashboard()}
            {activeView === 'RIDERS' && renderUserList(UserRole.RIDER)}
            {activeView === 'DRIVERS' && renderUserList(UserRole.DRIVER)}
            {activeView === 'TRIPS' && renderTrips()}
            {activeView === 'FINANCE' && <div className="text-center py-10">Módulo Finanzas</div>}
            {activeView === 'CONFIG' && <div className="text-center py-10">Configuración</div>}
            {activeView === 'SUPPORT' && <div className="text-center py-10">Soporte</div>}
            {activeView === 'MARKETING' && <div className="text-center py-10 text-gray-400">Marketing</div>}
            {activeView === 'ANALYTICS' && renderAnalytics()}
         </div>
      </div>
    </div>
  );
};

// --- SUBCOMPONENTS ---

const StatCard = ({ title, value, trend, sub, icon, color }: any) => (
   <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition">
      <div className="flex justify-between items-start mb-4">
         <div className={`p-3 rounded-xl ${color}`}>{icon}</div>
         {trend && <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">{trend}</span>}
      </div>
      <h3 className="text-3xl font-black text-gray-900 mb-1">{value}</h3>
      <p className="text-xs text-gray-500 font-bold uppercase">{title}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
   </div>
);

const KpiRow = ({ label, value }: any) => (
   <div className="flex justify-between items-center border-b border-gray-50 last:border-0 pb-3 last:pb-0">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="font-bold text-gray-900">{value}</span>
   </div>
);
