
import React from 'react';
import { X, Bell, Info, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // Mock Notifications
  const notifications = [
    {
      id: 1,
      title: '¡Bienvenido a FelcarRide!',
      message: 'Gracias por unirte a nuestra plataforma. Completa tu perfil para una mejor experiencia.',
      type: 'INFO',
      time: 'Hace 2 días',
      read: true
    },
    {
      id: 2,
      title: 'Documentos Verificados',
      message: 'Tus documentos han sido aprobados exitosamente.',
      type: 'SUCCESS',
      time: 'Hace 1 día',
      read: true
    },
    {
      id: 3,
      title: 'Mantenimiento Programado',
      message: 'La app tendrá una breve pausa operativa este domingo de 3am a 4am.',
      type: 'WARNING',
      time: 'Hace 2 horas',
      read: false
    },
    {
      id: 4,
      title: '¡Nueva Promo!',
      message: 'Usa el código FELCAR20 para obtener 20% de descuento en tu próximo viaje.',
      type: 'INFO',
      time: 'Hace 5 min',
      read: false
    }
  ];

  return (
    <div className="absolute inset-0 z-[80] bg-black/60 backdrop-blur-sm flex justify-end animate-fade-in">
      <div className="w-full md:w-[400px] h-full bg-white shadow-2xl flex flex-col animate-slide-left">
        
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-black text-white">
          <h2 className="text-xl font-bold flex items-center gap-2">
             <Bell size={20} /> Notificaciones
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition">
            <X size={24} />
          </button>
        </div>

        {/* List */}
        <div className="flex-grow overflow-y-auto p-4 bg-gray-50 space-y-3">
           {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                 <Bell size={48} className="opacity-20 mb-2"/>
                 <p>No tienes notificaciones nuevas</p>
              </div>
           ) : (
              notifications.map((notif) => (
                 <div key={notif.id} className={`p-4 rounded-xl border transition hover:shadow-sm ${notif.read ? 'bg-white border-gray-100' : 'bg-blue-50 border-blue-100'}`}>
                    <div className="flex items-start gap-3">
                       <div className={`p-2 rounded-full shrink-0 ${
                          notif.type === 'SUCCESS' ? 'bg-green-100 text-green-600' :
                          notif.type === 'WARNING' ? 'bg-orange-100 text-orange-600' :
                          'bg-blue-100 text-blue-600'
                       }`}>
                          {notif.type === 'SUCCESS' ? <CheckCircle2 size={18} /> :
                           notif.type === 'WARNING' ? <AlertTriangle size={18} /> :
                           <Info size={18} />}
                       </div>
                       <div>
                          <h3 className={`text-sm font-bold ${notif.read ? 'text-gray-800' : 'text-black'}`}>{notif.title}</h3>
                          <p className="text-xs text-gray-500 mt-1 leading-relaxed">{notif.message}</p>
                          <div className="flex items-center gap-1 mt-2 text-[10px] text-gray-400 font-medium">
                             <Clock size={10} /> {notif.time}
                          </div>
                       </div>
                       {!notif.read && (
                          <div className="w-2 h-2 rounded-full bg-red-500 shrink-0 mt-1"></div>
                       )}
                    </div>
                 </div>
              ))
           )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-white">
           <button className="w-full py-3 text-xs font-bold text-gray-500 hover:bg-gray-50 rounded-xl transition">
              Marcar todas como leídas
           </button>
        </div>

      </div>
    </div>
  );
};
