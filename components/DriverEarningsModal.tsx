import React, { useState, useEffect } from 'react';
import { X, DollarSign, Clock, TrendingUp, Star, CreditCard, Banknote, Gift, List } from 'lucide-react';
import { DriverAnalytics, TripHistoryItem, PaymentMethod } from '../types';

interface DriverEarningsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripHistory: TripHistoryItem[]; // Pass full history to filter locally
  initialTab?: 'EARNINGS' | 'HISTORY' | 'HOURS';
}

// Mock Analytics Data with Session Logs
const MOCK_ANALYTICS: DriverAnalytics = {
  earnings: {
    today: { gross: 45.50, commission: 9.10, bonus: 5.00, net: 41.40 },
    week: { gross: 320.00, commission: 64.00, bonus: 25.00, net: 281.00 },
    month: { gross: 1250.00, commission: 250.00, bonus: 100.00, net: 1100.00 },
  },
  onlineStats: {
    todayHours: 5.5,
    weekHours: 38.0,
    tripsPerHour: 2.1,
    dailyBreakdown: [
      { day: 'Lun', hours: 6 },
      { day: 'Mar', hours: 5.5 },
      { day: 'Mié', hours: 8 },
      { day: 'Jue', hours: 4 },
      { day: 'Vie', hours: 9 },
      { day: 'Sáb', hours: 5.5 }, // Today
      { day: 'Dom', hours: 0 },
    ],
    sessionLogs: [
      { id: 's1', date: 'Hoy', startTime: '08:00 AM', endTime: '12:00 PM', duration: '4h 00m' },
      { id: 's2', date: 'Hoy', startTime: '02:00 PM', endTime: '03:30 PM', duration: '1h 30m' },
      { id: 's3', date: 'Ayer', startTime: '09:00 AM', endTime: '06:00 PM', duration: '9h 00m' }
    ]
  }
};

export const DriverEarningsModal: React.FC<DriverEarningsModalProps> = ({ isOpen, onClose, tripHistory, initialTab = 'EARNINGS' }) => {
  const [activeTab, setActiveTab] = useState<'EARNINGS' | 'HISTORY' | 'HOURS'>(initialTab);
  const [earningsPeriod, setEarningsPeriod] = useState<'today' | 'week' | 'month'>('today');

  // Sync tab when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  // Must be after hooks
  if (!isOpen) return null;

  // Filter history for demo (assume all passed history belongs to driver for this mock)
  const driverHistory = [...tripHistory].sort((a, b) => b.date - a.date);

  const renderEarnings = () => {
    const data = MOCK_ANALYTICS.earnings[earningsPeriod];
    const periodLabels = { today: 'Hoy', week: 'Esta Semana', month: 'Este Mes' };

    return (
      <div className="space-y-6 animate-fade-in">
        {/* Period Selector */}
        <div className="flex bg-gray-100 p-1 rounded-xl">
          {(['today', 'week', 'month'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setEarningsPeriod(p)}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                earningsPeriod === p ? 'bg-white shadow-sm text-black' : 'text-gray-500'
              }`}
            >
              {p === 'today' ? 'Día' : p === 'week' ? 'Semana' : 'Mes'}
            </button>
          ))}
        </div>

        {/* Big Net Card */}
        <div className="bg-black text-white p-6 rounded-3xl shadow-lg text-center">
          <p className="text-gray-400 text-xs font-bold uppercase mb-1">Ganancia Neta ({periodLabels[earningsPeriod]})</p>
          <h2 className="text-4xl font-black">${data.net.toFixed(2)}</h2>
          <p className="text-xs text-gray-500 mt-2">Disponible para retiro</p>
        </div>

        {/* Breakdown */}
        <div className="space-y-3">
          <h3 className="font-bold text-sm text-gray-900">Desglose</h3>
          <div className="bg-white border border-gray-100 rounded-xl p-4 space-y-3 shadow-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">Tarifas de Viajes (Bruto)</span>
              <span className="font-bold">${data.gross.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-red-500">
              <span className="text-sm">Comisión Plataforma</span>
              <span className="font-bold">-${data.commission.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-green-600">
              <div className="flex items-center gap-1">
                <Gift size={14} />
                <span className="text-sm">Bonificaciones</span>
              </div>
              <span className="font-bold">+${data.bonus.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
              <span className="font-bold text-black">Total Ganado</span>
              <span className="font-black text-lg border-b-2 border-black">${data.net.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <button className="w-full bg-green-600 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-green-700 transition">
          Solicitar Retiro
        </button>
      </div>
    );
  };

  const renderHistory = () => (
    <div className="space-y-4 animate-fade-in">
      <h3 className="font-bold text-lg text-black">Historial Reciente</h3>
      <div className="space-y-3 overflow-y-auto max-h-[50vh] pr-1">
        {driverHistory.map((trip) => (
          <div key={trip.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
             <div className="flex justify-between mb-2">
                <div>
                   <p className="font-bold text-sm flex items-center gap-2 text-gray-900">
                      {new Date(trip.date).toLocaleDateString()} 
                      <span className="text-gray-400 font-normal">• {new Date(trip.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                   </p>
                </div>
                <div className="font-black text-right text-gray-900">
                   {trip.currency}{trip.price.toFixed(2)}
                </div>
             </div>
             
             <div className="flex items-center gap-2 mb-3">
                <div className={`p-1 rounded ${trip.paymentMethod === PaymentMethod.CASH ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                   {trip.paymentMethod === PaymentMethod.CASH ? <Banknote size={12} /> : <CreditCard size={12} />}
                </div>
                <span className="text-xs font-bold text-gray-500">{trip.paymentMethod === PaymentMethod.CASH ? 'Efectivo' : 'Tarjeta'}</span>
                
                {trip.rating && (
                   <div className="ml-auto flex items-center gap-1 bg-yellow-50 px-2 py-0.5 rounded-lg">
                      <Star size={10} className="text-yellow-500 fill-yellow-500" />
                      <span className="text-xs font-bold text-yellow-700">{trip.rating.toFixed(1)}</span>
                   </div>
                )}
             </div>

             <div className="text-xs space-y-1 pl-2 border-l-2 border-gray-100">
                <p className="text-gray-900 truncate"><span className="w-2 h-2 inline-block bg-green-500 rounded-full mr-1"></span> {trip.pickupAddress}</p>
                <p className="font-medium text-gray-700 truncate"><span className="w-2 h-2 inline-block bg-gray-400 rounded-full mr-1"></span> {trip.destinationAddress}</p>
             </div>

             <div className="mt-3 pt-2 border-t border-gray-50 flex gap-4 text-[10px] text-gray-400 font-mono">
                <span>Dist: {trip.distance || '3.2'}km</span>
                <span>Dur: {trip.duration || '15'}min</span>
             </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderHours = () => {
    const stats = MOCK_ANALYTICS.onlineStats;
    const maxHours = Math.max(...stats.dailyBreakdown.map(d => d.hours));

    return (
      <div className="space-y-6 animate-fade-in">
        <div className="grid grid-cols-2 gap-4">
           <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 text-center">
              <Clock className="mx-auto text-orange-500 mb-2" />
              <h3 className="text-2xl font-black text-orange-700">{stats.todayHours}h</h3>
              <p className="text-xs text-orange-600/70 font-bold uppercase">Hoy Conectado</p>
           </div>
           <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 text-center">
              <TrendingUp className="mx-auto text-blue-500 mb-2" />
              <h3 className="text-2xl font-black text-blue-700">{stats.tripsPerHour}</h3>
              <p className="text-xs text-blue-600/70 font-bold uppercase">Viajes / Hora</p>
           </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
           <h3 className="font-bold text-sm mb-4 text-gray-900">Horas Conectado (Semana Actual)</h3>
           <div className="flex items-end justify-between h-32 gap-2">
              {stats.dailyBreakdown.map((day, i) => (
                 <div key={i} className="flex flex-col items-center gap-2 flex-1">
                    <div 
                      className="w-full bg-black rounded-t-md transition-all hover:bg-gray-700 relative group"
                      style={{ height: `${(day.hours / maxHours) * 100}%`, minHeight: '4px' }}
                    >
                       <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap">
                          {day.hours}h
                       </div>
                    </div>
                    <span className="text-[10px] font-bold text-gray-400">{day.day}</span>
                 </div>
              ))}
           </div>
           <div className="mt-4 text-center">
              <span className="text-xs font-bold bg-gray-100 text-black px-4 py-2 rounded-full border border-gray-300">
                Total Semanal: {stats.weekHours}h
              </span>
           </div>
        </div>

        {/* New Session Log Section */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-sm mb-4 flex items-center gap-2 text-gray-900">
               <List size={16}/> Registro de Sesiones
            </h3>
            <div className="space-y-0 divide-y divide-gray-100">
                {stats.sessionLogs?.map(session => (
                    <div key={session.id} className="py-3 flex justify-between items-center">
                        <div>
                            <p className="text-xs font-bold text-gray-900">{session.date}</p>
                            <div className="flex items-center gap-1 text-[10px] text-gray-500">
                                <Clock size={10}/> {session.startTime} - {session.endTime}
                            </div>
                        </div>
                        <span className="bg-gray-100 text-gray-700 text-xs font-mono font-bold px-2 py-1 rounded">
                            {session.duration}
                        </span>
                    </div>
                ))}
            </div>
        </div>
      </div>
    );
  };

  return (
    <div className="absolute inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center p-4 animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-t-3xl md:rounded-3xl shadow-2xl overflow-hidden animate-slide-up flex flex-col h-[85vh] md:h-auto">
        
        {/* Header */}
        <div className="p-5 bg-black text-white flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center gap-2">
             <DollarSign size={24} /> Panel de Driver
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition">
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
           <button 
             onClick={() => setActiveTab('EARNINGS')}
             className={`flex-1 py-4 text-sm font-bold border-b-2 transition ${activeTab === 'EARNINGS' ? 'border-black text-black' : 'border-transparent text-gray-400'}`}
           >
             Ganancias
           </button>
           <button 
             onClick={() => setActiveTab('HISTORY')}
             className={`flex-1 py-4 text-sm font-bold border-b-2 transition ${activeTab === 'HISTORY' ? 'border-black text-black' : 'border-transparent text-gray-400'}`}
           >
             Historial
           </button>
           <button 
             onClick={() => setActiveTab('HOURS')}
             className={`flex-1 py-4 text-sm font-bold border-b-2 transition ${activeTab === 'HOURS' ? 'border-black text-black' : 'border-transparent text-gray-400'}`}
           >
             Tiempos
           </button>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto p-6 bg-gray-50">
           {activeTab === 'EARNINGS' && renderEarnings()}
           {activeTab === 'HISTORY' && renderHistory()}
           {activeTab === 'HOURS' && renderHours()}
        </div>

      </div>
    </div>
  );
};