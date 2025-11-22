
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
  Star
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

  // ... [Rest of the AdminPanel code remains unchanged] ...
  
  // --- RENDER: SIDEBAR ---
  const renderSidebar = () => (
    <div className="w-64 bg-gray-900 text-white flex flex-col h-screen fixed left-0 top-0 z-50 shadow-xl">
      <div className="p-6 border-b border-gray-800 flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold">GR</div>
        <div>
           <h1 className="font-bold text-lg leading-none">GeminiRide</h1>
           <span className="text-[10px] text-gray-500 uppercase">Admin Panel</span>
        </div>
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
  );

  const MenuItem = ({ view, icon, label }: { view: AdminView, icon: React.ReactNode, label: string }) => (
    <button 
      onClick={() => setActiveView(view)}
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
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden h-[500px] flex flex-col">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold flex items-center gap-2"><MapIcon size={18}/> Mapa Operativo en Vivo</h3>
            <div className="flex gap-3 text-xs font-bold">
              <span className="flex items-center gap-1"><div className="w-2 h-2 bg-green-500 rounded-full"></div> Libre</span>
              <span className="flex items-center gap-1"><div className="w-2 h-2 bg-red-500 rounded-full"></div> Ocupado</span>
            </div>
          </div>
          {/* Map Container needs to be relative for Leaflet */}
          <div className="flex-grow bg-gray-100 relative" ref={dashboardMapRef} style={{ minHeight: '400px' }}></div>
        </div>

        {/* KPIs */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
             <h3 className="font-bold text-lg mb-4">KPIs Clave</h3>
             <div className="space-y-4">
                <KpiRow label="Tiempo Espera Promedio" value="3.2 min" />
                <KpiRow label="Calif. Promedio Drivers" value="4.8 ★" />
                <KpiRow label="Tasa Cancelación" value="4.5%" />
                <KpiRow label="Ticket Promedio" value="$4.20" />
             </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
             <h3 className="font-bold text-lg mb-4">Zonas Top Demanda</h3>
             <div className="space-y-3">
                <div className="flex justify-between text-sm"><span className="text-gray-600">1. Mall del Sol</span> <span className="font-bold">High</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-600">2. Centro</span> <span className="font-bold">Med</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-600">3. Samborondón</span> <span className="font-bold">Med</span></div>
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
         <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Reportes y Analítica</h2>
            <div className="flex bg-white rounded-lg p-1 border border-gray-200 shadow-sm">
               {(['TRIPS', 'REVENUE', 'DRIVERS', 'RIDERS', 'RISK'] as AnalyticsTab[]).map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setAnalyticsTab(tab)}
                    className={`px-4 py-2 text-xs font-bold rounded-md transition ${analyticsTab === tab ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                  >
                     {tab === 'TRIPS' && 'Viajes'}
                     {tab === 'REVENUE' && 'Ingresos'}
                     {tab === 'DRIVERS' && 'Drivers'}
                     {tab === 'RIDERS' && 'Riders'}
                     {tab === 'RISK' && 'Cancelaciones'}
                  </button>
               ))}
            </div>
         </div>

         {/* TAB: TRIPS */}
         {analyticsTab === 'TRIPS' && (
            <div className="space-y-6">
               <div className="grid grid-cols-4 gap-4">
                  <StatCard title="Total Viajes" value="1,254" sub="Este Mes" icon={<MapIcon />} color="bg-blue-50" />
                  <StatCard title="Completados" value="1,100" sub="87% Tasa de éxito" icon={<Check />} color="bg-green-50" />
                  <StatCard title="Cancelados" value="154" sub="12% Tasa de error" icon={<X />} color="bg-red-50" />
                  <StatCard title="Distancia Total" value="5,400 km" sub="Recorridos" icon={<Navigation />} color="bg-orange-50" />
               </div>

               <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                  <h3 className="font-bold text-lg mb-6 flex items-center gap-2"><BarChart3 size={20} /> Demanda por Horas (Picos)</h3>
                  <div className="flex items-end justify-between h-48 gap-1">
                     {hourlyData.map((val, i) => (
                        <div key={i} className="flex flex-col items-center flex-1 group">
                           <div className="w-full bg-blue-50 rounded-t-sm relative h-full flex items-end">
                              <div 
                                className="w-full bg-blue-600 hover:bg-blue-800 transition-all rounded-t-sm" 
                                style={{ height: `${(val/maxDemand)*100}%` }}
                              ></div>
                           </div>
                           <span className="text-[9px] text-gray-400 mt-2">{i}h</span>
                           {/* Tooltip */}
                           <div className="opacity-0 group-hover:opacity-100 absolute -mt-8 bg-black text-white text-xs px-2 py-1 rounded pointer-events-none">
                              {val} viajes
                           </div>
                        </div>
                     ))}
                  </div>
                  <p className="text-center text-xs text-gray-400 mt-4">Hora del día (00:00 - 23:59)</p>
               </div>
            </div>
         )}

         {/* TAB: REVENUE */}
         {analyticsTab === 'REVENUE' && (
            <div className="space-y-6">
               <div className="grid grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                     <h3 className="text-gray-500 font-bold uppercase text-xs mb-2">Ingresos Totales (Bruto)</h3>
                     <p className="text-4xl font-black text-gray-900">$12,540.00</p>
                     <p className="text-xs text-green-600 font-bold mt-2">+8.5% vs mes anterior</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                     <h3 className="text-gray-500 font-bold uppercase text-xs mb-2">Comisión Plataforma</h3>
                     <p className="text-4xl font-black text-blue-600">$2,508.00</p>
                     <p className="text-xs text-gray-400 mt-2">Calculado al 20%</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                     <h3 className="text-gray-500 font-bold uppercase text-xs mb-2">Ingreso Neto Drivers</h3>
                     <p className="text-4xl font-black text-green-600">$10,032.00</p>
                     <p className="text-xs text-gray-400 mt-2">Pagos dispersados</p>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                     <h3 className="font-bold mb-4">Métodos de Pago</h3>
                     <div className="space-y-4">
                        <div className="flex items-center justify-between">
                           <div className="flex items-center gap-2"><CreditCard size={16} /> Tarjeta de Crédito</div>
                           <span className="font-bold">45%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2"><div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }}></div></div>
                        
                        <div className="flex items-center justify-between pt-2">
                           <div className="flex items-center gap-2"><DollarSign size={16} /> Efectivo</div>
                           <span className="font-bold">55%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2"><div className="bg-green-600 h-2 rounded-full" style={{ width: '55%' }}></div></div>
                     </div>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                     <h3 className="font-bold mb-4">Ingresos por Zona</h3>
                     <div className="space-y-3">
                        <div className="flex justify-between border-b border-gray-50 pb-2"><span className="text-sm">Norte (Samborondón)</span> <span className="font-mono font-bold">$4,200</span></div>
                        <div className="flex justify-between border-b border-gray-50 pb-2"><span className="text-sm">Centro</span> <span className="font-mono font-bold">$3,100</span></div>
                        <div className="flex justify-between border-b border-gray-50 pb-2"><span className="text-sm">Sur</span> <span className="font-mono font-bold">$1,800</span></div>
                        <div className="flex justify-between border-b border-gray-50 pb-2"><span className="text-sm">Vía a la Costa</span> <span className="font-mono font-bold">$2,400</span></div>
                     </div>
                  </div>
               </div>
            </div>
         )}

         {/* TAB: DRIVERS */}
         {analyticsTab === 'DRIVERS' && (
            <div className="space-y-6">
               <div className="grid grid-cols-3 gap-4">
                  <StatCard title="Drivers Activos" value="120" sub="Total flota" icon={<Car />} color="bg-blue-50" />
                  <StatCard title="Conectados Hoy" value="85" sub="70% de la flota" icon={<Activity />} color="bg-green-50" />
                  <StatCard title="Calif. Promedio" value="4.7" sub="Estrellas" icon={<Star />} color="bg-yellow-50" />
               </div>

               <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-4 border-b border-gray-100 font-bold flex justify-between">
                     <h3>Top Conductores (Rendimiento)</h3>
                     <button className="text-blue-600 text-xs font-bold">Ver Todos</button>
                  </div>
                  <table className="w-full text-sm text-left">
                     <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
                        <tr>
                           <th className="px-6 py-3">Nombre</th>
                           <th className="px-6 py-3">Viajes</th>
                           <th className="px-6 py-3">Ganancias</th>
                           <th className="px-6 py-3">Calificación</th>
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

         {/* TAB: RIDERS */}
         {analyticsTab === 'RIDERS' && (
            <div className="space-y-6">
               <div className="grid grid-cols-3 gap-4">
                   <StatCard title="Nuevos Registros" value="+45" sub="Últimos 7 días" icon={<Users />} color="bg-blue-50" />
                   <StatCard title="Riders Activos" value="850" sub="Viajaron este mes" icon={<Activity />} color="bg-indigo-50" />
                   <StatCard title="Cupones Usados" value="230" sub="Total redimidos" icon={<Tag />} color="bg-pink-50" />
               </div>
               <div className="bg-white p-8 rounded-xl border border-gray-200 text-center text-gray-400">
                  <Users size={48} className="mx-auto mb-4 opacity-20" />
                  <p>Lista detallada de comportamiento de usuarios en desarrollo.</p>
               </div>
            </div>
         )}

         {/* TAB: RISK / CANCELLATIONS */}
         {analyticsTab === 'RISK' && (
            <div className="space-y-6">
               <div className="bg-red-50 border border-red-100 p-6 rounded-2xl flex items-center gap-6">
                  <div className="p-4 bg-red-100 rounded-full text-red-600"><AlertOctagon size={32} /></div>
                  <div>
                     <h3 className="text-xl font-bold text-red-800">Análisis de Cancelaciones</h3>
                     <p className="text-red-600 text-sm">Monitoreo de fraude y calidad de servicio.</p>
                  </div>
                  <div className="ml-auto text-right">
                     <p className="text-2xl font-black text-red-800">12.5%</p>
                     <p className="text-xs font-bold text-red-600">Tasa Global</p>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                     <h3 className="font-bold mb-4">Motivos de Cancelación</h3>
                     <div className="space-y-4">
                        <div>
                           <div className="flex justify-between text-sm mb-1"><span>Cancelado por Rider</span> <span className="font-bold">60%</span></div>
                           <div className="w-full bg-gray-100 h-2 rounded-full"><div className="bg-orange-500 h-2 rounded-full" style={{width: '60%'}}></div></div>
                        </div>
                        <div>
                           <div className="flex justify-between text-sm mb-1"><span>Cancelado por Driver</span> <span className="font-bold">30%</span></div>
                           <div className="w-full bg-gray-100 h-2 rounded-full"><div className="bg-red-500 h-2 rounded-full" style={{width: '30%'}}></div></div>
                        </div>
                        <div>
                           <div className="flex justify-between text-sm mb-1"><span>No Show / Sistema</span> <span className="font-bold">10%</span></div>
                           <div className="w-full bg-gray-100 h-2 rounded-full"><div className="bg-gray-500 h-2 rounded-full" style={{width: '10%'}}></div></div>
                        </div>
                     </div>
                  </div>

                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                     <div className="p-4 border-b border-gray-100 bg-red-50/50">
                        <h3 className="font-bold text-red-800 flex items-center gap-2"><UserX size={18}/> Drivers Riesgo (Alta Cancelación)</h3>
                     </div>
                     <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                           <tr>
                              <th className="px-4 py-2">Driver</th>
                              <th className="px-4 py-2 text-center">Cancelados</th>
                              <th className="px-4 py-2 text-center">Tasa</th>
                              <th className="px-4 py-2"></th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                           {riskDrivers.map((d,i) => (
                              <tr key={i}>
                                 <td className="px-4 py-3 font-bold">{d.name}</td>
                                 <td className="px-4 py-3 text-center">{d.cancels}/{d.total}</td>
                                 <td className="px-4 py-3 text-center text-red-600 font-bold">{d.rate}</td>
                                 <td className="px-4 py-3 text-right"><button className="text-xs bg-gray-100 hover:bg-red-100 hover:text-red-600 px-2 py-1 rounded font-bold">Alertar</button></td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>
            </div>
         )}
      </div>
    );
  };

  // --- RENDER: USERS (RIDERS/DRIVERS) ---
  const renderUserList = (role: UserRole) => {
    const targetUsers = users.filter(u => u.role === role);
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Gestión de {role === UserRole.RIDER ? 'Riders' : 'Drivers'}</h2>
          <div className="flex gap-2">
             <button className="bg-gray-100 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2"><Filter size={16}/> Filtros</button>
             <button className="bg-black text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2"><LogOut size={16} className="rotate-180"/> Exportar CSV</button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-xs">
              <tr>
                <th className="px-6 py-4">Usuario</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4">{role === UserRole.DRIVER ? 'Vehículo' : 'Estadísticas'}</th>
                {role === UserRole.DRIVER && <th className="px-6 py-4">Docs</th>}
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
                        <p className="text-xs text-gray-500">{u.phone || 'N/A'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${u.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : u.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                      {u.status}
                    </span>
                    {role === UserRole.DRIVER && availableDrivers.some(d => d.id === u.id) && (
                      <span className="ml-2 w-2 h-2 inline-block rounded-full bg-green-500" title="Conectado"></span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {role === UserRole.DRIVER && u.driverDetails ? (
                      <div>
                        <p className="font-bold">{u.driverDetails.carModel}</p>
                        <p className="text-xs text-gray-500 font-mono">{u.driverDetails.plate}</p>
                      </div>
                    ) : (
                      <div>
                         <p className="text-xs text-gray-500">Viajes: {Math.floor(Math.random() * 50)}</p>
                         <p className="text-xs text-gray-500">Gasto: ${Math.floor(Math.random() * 200)}</p>
                      </div>
                    )}
                  </td>
                  {role === UserRole.DRIVER && (
                    <td className="px-6 py-4">
                       <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 font-bold">Vigente</span>
                    </td>
                  )}
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-gray-100 rounded text-gray-500"><MoreVertical size={16}/></button>
                    {u.status === 'PENDING' && (
                       <div className="flex justify-end gap-2 mt-1">
                          <button onClick={() => onApprove(u.id)} className="text-xs bg-green-600 text-white px-2 py-1 rounded">Aprobar</button>
                          <button onClick={() => onReject(u.id)} className="text-xs bg-red-600 text-white px-2 py-1 rounded">Rechazar</button>
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
       <h2 className="text-2xl font-bold text-gray-800">Monitoreo de Viajes</h2>
       <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex gap-4 overflow-x-auto">
             {['Todos', 'En Curso', 'Completados', 'Cancelados'].map(f => (
                <button key={f} className="px-4 py-2 rounded-lg bg-gray-100 text-sm font-bold text-gray-600 hover:bg-gray-200 whitespace-nowrap">{f}</button>
             ))}
          </div>
          <table className="w-full text-left text-sm">
             <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-xs">
                <tr>
                   <th className="px-6 py-4">ID / Fecha</th>
                   <th className="px-6 py-4">Ruta</th>
                   <th className="px-6 py-4">Driver / Rider</th>
                   <th className="px-6 py-4">Tarifa</th>
                   <th className="px-6 py-4">Estado</th>
                   <th className="px-6 py-4"></th>
                </tr>
             </thead>
             <tbody className="divide-y divide-gray-100">
                {tripHistory.map(trip => (
                   <tr key={trip.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                         <p className="font-mono text-xs font-bold">#{trip.id.slice(0,6)}</p>
                         <p className="text-xs text-gray-500">{new Date(trip.date).toLocaleDateString()}</p>
                      </td>
                      <td className="px-6 py-4 max-w-xs">
                         <div className="flex items-center gap-2 text-xs mb-1"><div className="w-2 h-2 bg-green-500 rounded-full"></div> <span className="truncate">{trip.pickupAddress}</span></div>
                         <div className="flex items-center gap-2 text-xs font-bold"><div className="w-2 h-2 bg-red-500 rounded-full"></div> <span className="truncate">{trip.destinationAddress}</span></div>
                      </td>
                      <td className="px-6 py-4">
                         <p className="text-xs">Con: {trip.counterpartName}</p>
                      </td>
                      <td className="px-6 py-4 font-bold">
                         {trip.currency}{trip.price.toFixed(2)}
                         <span className="block text-[10px] font-normal text-gray-400">Efectivo</span>
                      </td>
                      <td className="px-6 py-4">
                         <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${trip.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : trip.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                            {trip.status}
                         </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                         <button className="text-blue-600 font-bold text-xs hover:underline">Ver Mapa</button>
                      </td>
                   </tr>
                ))}
             </tbody>
          </table>
       </div>
    </div>
  );

  // --- RENDER: FINANCE ---
  const renderFinance = () => (
     <div className="space-y-6 animate-fade-in">
        <h2 className="text-2xl font-bold text-gray-800">Finanzas y Pagos</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-black text-white p-6 rounded-2xl shadow-lg">
              <p className="text-gray-400 text-xs font-bold uppercase">Ingresos Totales (Plataforma)</p>
              <h3 className="text-3xl font-black mt-2">${platformRevenue.toFixed(2)}</h3>
              <p className="text-xs text-gray-400 mt-2">Acumulado del mes</p>
           </div>
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <p className="text-gray-400 text-xs font-bold uppercase">Pendiente de Pago a Drivers</p>
              <h3 className="text-3xl font-black mt-2 text-gray-800">$1,205.00</h3>
              <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-bold">Procesar Pagos</button>
           </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
           <div className="p-4 border-b border-gray-100 font-bold">Transacciones Recientes</div>
           <div className="divide-y divide-gray-100">
              {MOCK_FINANCE.map(t => (
                 <div key={t.id} className="p-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                       <div className={`p-2 rounded-lg ${t.type === 'PAYOUT' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                          {t.type === 'PAYOUT' ? <CreditCard size={18}/> : <DollarSign size={18}/>}
                       </div>
                       <div>
                          <p className="font-bold text-sm">{t.userName}</p>
                          <p className="text-xs text-gray-500">{t.type} • {new Date(t.date).toLocaleDateString()}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className={`font-bold ${t.type === 'PAYOUT' ? 'text-red-600' : 'text-green-600'}`}>
                          {t.type === 'PAYOUT' ? '-' : '+'}${t.amount.toFixed(2)}
                       </p>
                       <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded text-gray-500">{t.status}</span>
                    </div>
                 </div>
              ))}
           </div>
        </div>
     </div>
  );

  // --- RENDER: CONFIG ---
  const renderConfig = () => (
     <div className="space-y-6 animate-fade-in">
        <h2 className="text-2xl font-bold text-gray-800">Configuración de Tarifas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-4">
              <h3 className="font-bold text-lg border-b border-gray-100 pb-2">Tarifas Base ({pricing.city})</h3>
              <ConfigInput label="Tarifa Base (Arranque)" value={pricing.baseRate} prefix="$" />
              <ConfigInput label="Costo por KM" value={pricing.perKm} prefix="$" />
              <ConfigInput label="Costo por Minuto" value={pricing.perMin} prefix="$" />
              <ConfigInput label="Tarifa Mínima" value={pricing.minFare} prefix="$" />
           </div>
           
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-4">
              <h3 className="font-bold text-lg border-b border-gray-100 pb-2">Reglas de Negocio</h3>
              <ConfigInput label="Comisión Plataforma" value={pricing.commissionPct} suffix="%" />
              <ConfigInput label="Booking Fee (Seguridad)" value={pricing.bookingFee} prefix="$" />
              <div className="pt-4">
                 <button className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800">Guardar Cambios</button>
              </div>
           </div>
        </div>
     </div>
  );

  // --- RENDER: SUPPORT ---
  const renderSupport = () => (
     <div className="space-y-6 animate-fade-in">
        <h2 className="text-2xl font-bold text-gray-800">Soporte y Tickets</h2>
        <div className="grid grid-cols-1 gap-4">
           {tickets.map(ticket => (
              <div key={ticket.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                 <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-full shrink-0 ${ticket.priority === 'HIGH' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                       <AlertTriangle size={20} />
                    </div>
                    <div>
                       <div className="flex items-center gap-2 mb-1">
                          <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase">#{ticket.id}</span>
                          <h4 className="font-bold text-gray-900">{ticket.subject}</h4>
                       </div>
                       <p className="text-sm text-gray-600 mb-1">{ticket.description}</p>
                       <p className="text-xs text-gray-400">Reportado por: {ticket.userName} ({ticket.userRole}) • Hace {Math.floor((Date.now() - ticket.date)/3600000)}h</p>
                    </div>
                 </div>
                 <div className="flex gap-2">
                    <button className="bg-black text-white px-4 py-2 rounded-lg text-sm font-bold">Responder</button>
                    <button className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-sm font-bold">Cerrar</button>
                 </div>
              </div>
           ))}
        </div>
     </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex">
      {/* Sidebar */}
      {renderSidebar()}
      
      {/* Main Content */}
      <div className="flex-grow ml-64 p-8">
         {/* Topbar */}
         <div className="flex justify-between items-center mb-8">
            <div className="relative">
               <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
               <input type="text" placeholder="Buscar usuario, viaje, ID..." className="bg-white border border-gray-200 pl-10 pr-4 py-2 rounded-full w-96 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="flex items-center gap-4">
               <button className="relative p-2 bg-white rounded-full shadow-sm hover:bg-gray-50">
                  <Bell size={20} className="text-gray-600" />
                  <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
               </button>
               <div className="w-10 h-10 bg-blue-900 rounded-full flex items-center justify-center text-white font-bold">AD</div>
            </div>
         </div>

         {/* View Routing */}
         {activeView === 'DASHBOARD' && renderDashboard()}
         {activeView === 'RIDERS' && renderUserList(UserRole.RIDER)}
         {activeView === 'DRIVERS' && renderUserList(UserRole.DRIVER)}
         {activeView === 'TRIPS' && renderTrips()}
         {activeView === 'FINANCE' && renderFinance()}
         {activeView === 'CONFIG' && renderConfig()}
         {activeView === 'SUPPORT' && renderSupport()}
         {activeView === 'MARKETING' && <div className="text-center py-20 text-gray-400 font-bold text-xl">Módulo de Marketing Próximamente</div>}
         {activeView === 'ANALYTICS' && renderAnalytics()}
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

const ConfigInput = ({ label, value, prefix, suffix }: any) => (
   <div>
      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{label}</label>
      <div className="relative">
         {prefix && <span className="absolute left-3 top-2.5 text-gray-500 font-bold">{prefix}</span>}
         <input 
           type="number" 
           defaultValue={value} 
           className={`w-full bg-gray-50 border border-gray-200 rounded-lg py-2 text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-black ${prefix ? 'pl-8' : 'pl-3'} ${suffix ? 'pr-8' : 'pr-3'}`}
         />
         {suffix && <span className="absolute right-3 top-2.5 text-gray-500 font-bold">{suffix}</span>}
      </div>
   </div>
);
