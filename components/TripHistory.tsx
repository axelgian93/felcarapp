
import React, { useState, useMemo, useEffect } from 'react';
import { X, Calendar, MapPin, Clock, ArrowRight, Wallet, TrendingUp, AlertCircle, CreditCard, Banknote, Car, Building2, ArrowLeft } from 'lucide-react';
import { TripHistoryItem, UserRole, PaymentMethod } from '../types';

interface TripHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  history: TripHistoryItem[];
  userRole: UserRole;
  onBack?: () => void;
  initialTab?: 'LIST' | 'EXPENSES'; // Added prop
}

export const TripHistory: React.FC<TripHistoryProps> = ({ 
  isOpen, 
  onClose, 
  history, 
  userRole, 
  onBack,
  initialTab = 'LIST'
}) => {
  const [activeTab, setActiveTab] = useState<'LIST' | 'EXPENSES'>('LIST');

  // Sync tab when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  // --- ANALYTICS LOGIC (For Riders) ---
  const expensesStats = useMemo(() => {
    if (userRole !== UserRole.RIDER) return null;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const thisMonthTrips = history.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear && t.status === 'COMPLETED';
    });

    const totalMonth = thisMonthTrips.reduce((sum, t) => sum + t.price, 0);

    const cancelledTrips = history.filter(t => t.status === 'CANCELLED');
    
    // Weekly breakdown (Simple 4 weeks simulation based on day of month)
    const weeklyData = [0, 0, 0, 0];
    thisMonthTrips.forEach(t => {
      const day = new Date(t.date).getDate();
      const weekIndex = Math.min(Math.floor((day - 1) / 7), 3);
      weeklyData[weekIndex] += t.price;
    });

    return {
      totalMonth,
      weeklyData,
      cancelledCount: cancelledTrips.length,
      tripsCount: thisMonthTrips.length
    };
  }, [history, userRole]);

  // Early return MUST be after all hooks
  if (!isOpen) return null;

  const renderExpenses = () => {
    if (!expensesStats) return null;
    const maxWeek = Math.max(...expensesStats.weeklyData, 1); // Avoid divide by zero

    return (
      <div className="p-4 space-y-6 animate-fade-in">
         {/* Total Card */}
         <div className="bg-black text-white p-6 rounded-3xl shadow-xl text-center">
            <div className="flex justify-center mb-2 opacity-50">
               <Wallet size={24} />
            </div>
            <h2 className="text-4xl font-black">${expensesStats.totalMonth.toFixed(2)}</h2>
            <p className="text-xs text-gray-400 font-bold uppercase mt-1">Gasto Total este Mes</p>
         </div>

         {/* Weekly Chart */}
         <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
               <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <TrendingUp size={18} className="text-blue-600"/> Gasto Semanal
               </h3>
            </div>
            <div className="flex items-end justify-between h-32 gap-3">
               {expensesStats.weeklyData.map((amount, idx) => (
                  <div key={idx} className="flex flex-col items-center flex-1 gap-2 group">
                     <div className="w-full bg-gray-100 rounded-t-lg relative h-full overflow-hidden">
                        <div 
                          className="absolute bottom-0 left-0 right-0 bg-blue-600 transition-all duration-1000 group-hover:bg-blue-700"
                          style={{ height: `${(amount / maxWeek) * 100}%` }}
                        ></div>
                     </div>
                     <span className="text-[10px] font-bold text-gray-400">Sem {idx + 1}</span>
                     <span className="text-[10px] font-bold text-blue-600">${amount.toFixed(0)}</span>
                  </div>
               ))}
            </div>
         </div>

         {/* Stats Grid */}
         <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-2xl border border-green-100">
               <p className="text-green-600/70 text-[10px] font-bold uppercase mb-1">Viajes Realizados</p>
               <p className="text-2xl font-black text-green-700">{expensesStats.tripsCount}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-2xl border border-red-100">
               <p className="text-red-600/70 text-[10px] font-bold uppercase mb-1">Cancelados</p>
               <div className="flex items-end gap-1">
                  <p className="text-2xl font-black text-red-700">{expensesStats.cancelledCount}</p>
                  <AlertCircle size={16} className="text-red-400 mb-1.5"/>
               </div>
            </div>
         </div>
      </div>
    );
  };

  const renderList = () => (
    <div className="flex-grow overflow-y-auto p-4 bg-gray-50 space-y-4">
      {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <Calendar size={48} className="mb-4 text-gray-300"/>
            <p className="text-black font-bold">No tienes viajes registrados aún.</p>
          </div>
      ) : (
        [...history].sort((a,b) => b.date - a.date).map((trip) => (
          <div key={trip.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 transition hover:shadow-md">
            
            {/* Header: Date & Price */}
            <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-50">
                <div className="flex items-center gap-2 text-gray-500">
                  <Calendar size={14} />
                  <span className="text-xs font-bold">
                    {new Date(trip.date).toLocaleDateString()} • {new Date(trip.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
                <span className="font-black text-lg">{trip.currency}{trip.price.toFixed(2)}</span>
            </div>
            
            {/* Driver/Rider Info */}
            <div className="flex items-center gap-3 mb-4 bg-gray-50 p-2 rounded-lg">
                <img src={trip.counterpartPhoto || "https://ui-avatars.com/api/?background=random"} className="w-8 h-8 rounded-full bg-gray-200 object-cover" alt="Avatar"/>
                <div className="flex-grow">
                    <p className="font-bold text-sm text-gray-900">{trip.counterpartName}</p>
                    <p className="text-xs text-gray-500 uppercase">{userRole === UserRole.RIDER ? 'Tu Conductor' : 'Pasajero'}</p>
                </div>
                {userRole === UserRole.RIDER && (
                  <div className="bg-white p-1.5 rounded border border-gray-200">
                     <Car size={16} className="text-gray-600" />
                  </div>
                )}
            </div>
            
            {/* Route */}
            <div className="relative pl-4 space-y-3 border-l-2 border-gray-100 ml-1.5 mb-3">
                <div className="relative">
                  <div className="absolute -left-[21px] top-1 w-3 h-3 bg-gray-300 rounded-full border-2 border-white"></div>
                  <p className="text-xs text-gray-500 line-clamp-1" title={trip.pickupAddress}>{trip.pickupAddress}</p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[21px] top-1 w-3 h-3 bg-black rounded-full border-2 border-white"></div>
                  <p className="text-xs font-bold text-gray-800 line-clamp-1" title={trip.destinationAddress}>{trip.destinationAddress}</p>
                </div>
            </div>
            
            {/* Footer: Status & Payment */}
            <div className="flex justify-between items-center pt-1">
               <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${trip.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {trip.status === 'COMPLETED' ? 'Finalizado' : 'Cancelado'}
                  </span>
               </div>
               
               <div className="flex items-center gap-1 text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {trip.paymentMethod === PaymentMethod.CARD ? <CreditCard size={12} /> : 
                   trip.paymentMethod === PaymentMethod.TRANSFER ? <Building2 size={12} /> : <Banknote size={12} />}
                  <span>{trip.paymentMethod === PaymentMethod.CARD ? 'Tarjeta' : 
                         trip.paymentMethod === PaymentMethod.TRANSFER ? 'Transferencia' : 'Efectivo'}</span>
               </div>
            </div>
          </div>
        ))
      )}
    </div>
  );

  return (
    <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-end animate-fade-in">
      <div className="w-full md:w-[400px] h-full bg-white shadow-2xl flex flex-col animate-slide-left">
        
        {/* Header */}
        <div className="p-5 bg-white z-10 border-b border-gray-100 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <button onClick={onBack || onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
                <ArrowLeft size={20} className="text-black" />
             </button>
             <h2 className="text-xl font-bold flex items-center gap-2">
                <Clock size={20} /> Historial
             </h2>
          </div>
        </div>

        {/* Tabs (Only for Riders) */}
        {userRole === UserRole.RIDER && (
           <div className="flex border-b border-gray-100 bg-white">
              <button 
                onClick={() => setActiveTab('LIST')} 
                className={`flex-1 py-3 text-sm font-bold border-b-2 transition ${activeTab === 'LIST' ? 'border-black text-black' : 'border-transparent text-gray-400'}`}
              >
                 Mis Viajes
              </button>
              <button 
                onClick={() => setActiveTab('EXPENSES')} 
                className={`flex-1 py-3 text-sm font-bold border-b-2 transition ${activeTab === 'EXPENSES' ? 'border-black text-black' : 'border-transparent text-gray-400'}`}
              >
                 Gastos
              </button>
           </div>
        )}

        {/* Content Switch */}
        <div className="flex-grow overflow-y-auto bg-gray-50">
           {activeTab === 'LIST' && renderList()}
           {activeTab === 'EXPENSES' && renderExpenses()}
        </div>
      </div>
    </div>
  );
};
