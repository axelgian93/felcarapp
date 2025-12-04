import React, { useEffect, useState } from 'react';
import { X, Calendar, Trash2, FileText, Car, Package, Map, Info, AlertTriangle } from 'lucide-react';
import { ScheduledRide, User, ServiceType } from '../types';
import { TripService } from '../src/services/tripService';

interface ScheduledRidesModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

export const ScheduledRidesModal: React.FC<ScheduledRidesModalProps> = ({ isOpen, onClose, user }) => {
  const [rides, setRides] = useState<ScheduledRide[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Custom Confirmation State
  const [rideToCancel, setRideToCancel] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
        const unsub = TripService.subscribeToScheduledRides(user.id, (data) => {
            setRides(data.filter(r => r.status !== 'CANCELLED' && r.status !== 'COMPLETED'));
            setLoading(false);
        });
        return () => unsub();
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleCancelClick = (rideId: string) => {
      setRideToCancel(rideId);
  };

  const confirmCancellation = async () => {
      if (rideToCancel) {
          await TripService.cancelScheduledRide(rideToCancel);
          setRideToCancel(null);
      }
  };

  const getServiceIcon = (type: ServiceType) => {
      switch (type) {
          case ServiceType.DELIVERY: return <Package size={16} />;
          case ServiceType.TRIP: return <Map size={16} />;
          default: return <Car size={16} />;
      }
  };

  const getServiceLabel = (type: ServiceType) => {
      switch (type) {
          case ServiceType.RIDE: return 'Viaje Estándar';
          case ServiceType.DELIVERY: return 'Envío / Encomienda';
          case ServiceType.TRIP: return 'Viaje Interprovincial';
          case ServiceType.HOURLY: return 'Alquiler por Horas';
          default: return type;
      }
  };

  return (
    <div className="absolute inset-0 z-[80] bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center p-4 animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-t-3xl md:rounded-3xl shadow-2xl overflow-hidden animate-slide-up flex flex-col h-[90vh] md:h-auto md:max-h-[85vh] relative">
        
        {/* Header */}
        <div className="p-6 bg-black text-white flex justify-between items-center shrink-0">
          <h2 className="text-xl font-bold flex items-center gap-2">
             <Calendar size={24} className="text-yellow-400"/> Viajes Reservados
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition">
            <X size={24} />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-4 bg-gray-100 space-y-4">
            {loading ? (
                <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-2 border-black border-t-transparent"></div></div>
            ) : rides.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400 text-center">
                    <Calendar size={64} className="mb-4 opacity-20"/>
                    <p className="font-bold text-lg text-gray-500">Sin reservas activas</p>
                    <p className="text-xs mt-1">Tus viajes programados aparecerán aquí.</p>
                </div>
            ) : (
                rides.map(ride => (
                    <div key={ride.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden relative">
                        {/* Status Strip */}
                        <div className={`h-1.5 w-full ${ride.status === 'CONFIRMED' ? 'bg-green-500' : 'bg-yellow-400'}`}></div>
                        
                        <div className="p-5">
                            {/* Header: Time & Status */}
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-3xl font-black text-gray-900 tracking-tight">
                                        {new Date(ride.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </h3>
                                    <div className="flex items-center gap-1 text-gray-500 font-bold text-xs uppercase mt-1">
                                        <Calendar size={12}/>
                                        {new Date(ride.date).toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })}
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                    ride.status === 'CONFIRMED' 
                                        ? 'bg-green-100 text-green-700 border border-green-200' 
                                        : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                                }`}>
                                    {ride.status === 'CONFIRMED' ? 'Asignado' : 'Pendiente'}
                                </span>
                            </div>

                            {/* Route Visual */}
                            <div className="relative pl-6 space-y-8 border-l-2 border-dashed border-gray-200 ml-2 mb-6">
                                {/* Origin */}
                                <div className="relative">
                                    <div className="absolute -left-[31px] top-0.5 h-4 w-4 bg-white rounded-full border-[3px] border-green-500 shadow-sm z-10"></div>
                                    <div className="relative -top-1">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-0.5">Punto de Partida</p>
                                        <p className="font-bold text-sm text-gray-900 leading-tight">{ride.pickupAddress}</p>
                                    </div>
                                </div>
                                {/* Destination */}
                                <div className="relative">
                                    <div className="absolute -left-[31px] top-0.5 h-4 w-4 bg-black rounded-full border-[3px] border-white shadow-sm z-10"></div>
                                    <div className="relative -top-1">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-0.5">Destino</p>
                                        <p className="font-bold text-sm text-gray-900 leading-tight">{ride.destinationAddress}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Service Details Card */}
                            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 mb-4">
                                <div className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-200">
                                    <div className="p-2 bg-white rounded-full shadow-sm text-black">
                                        {getServiceIcon(ride.serviceType)}
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase">Tipo de Servicio</p>
                                        <p className="font-bold text-sm text-gray-900">{getServiceLabel(ride.serviceType)}</p>
                                    </div>
                                </div>
                                
                                {ride.notes ? (
                                    <div className="flex gap-3">
                                        <FileText size={16} className="text-gray-400 mt-0.5 shrink-0"/>
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase">Observaciones</p>
                                            <p className="text-xs text-gray-600 italic leading-relaxed">"{ride.notes}"</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex gap-2 text-gray-400 text-xs items-center">
                                        <Info size={14}/> Sin observaciones adicionales
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <button 
                                onClick={() => handleCancelClick(ride.id)}
                                className="w-full py-3 border border-red-100 bg-red-50 text-red-600 text-xs font-bold rounded-xl hover:bg-red-100 hover:border-red-200 transition flex items-center justify-center gap-2"
                            >
                                <Trash2 size={16} /> Cancelar Reserva
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>

        {/* Custom Cancellation Confirmation Dialog */}
        {rideToCancel && (
            <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in">
                <div className="bg-white rounded-2xl p-6 w-full max-w-xs text-center shadow-2xl">
                    <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">¿Cancelar Reserva?</h3>
                    <p className="text-sm text-gray-500 mb-6">Esta acción no se puede deshacer. Tendrás que agendar nuevamente si cambias de opinión.</p>
                    <div className="flex gap-3">
                        <button 
                            onClick={() => setRideToCancel(null)} 
                            className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition"
                        >
                            Volver
                        </button>
                        <button 
                            onClick={confirmCancellation} 
                            className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition shadow-lg"
                        >
                            Sí, Cancelar
                        </button>
                    </div>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};