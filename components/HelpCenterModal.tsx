
import React, { useState } from 'react';
import { X, HelpCircle, AlertTriangle, PackageX, ChevronRight, MessageSquare, Phone, ChevronDown } from 'lucide-react';

interface HelpCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpCenterModal: React.FC<HelpCenterModalProps> = ({ isOpen, onClose }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const faqs = [
    {
      q: "¿Cómo cancelo un viaje?",
      a: "Puedes cancelar tu viaje pulsando el botón 'Cancelar' en la pantalla de espera. Si el conductor ya ha llegado o lleva mucho tiempo en camino, podría aplicarse una pequeña tarifa de cancelación."
    },
    {
      q: "Tarifas y recargos explicados",
      a: "Nuestras tarifas se calculan basándose en la distancia y el tiempo estimado. En momentos de alta demanda, puede aplicarse una tarifa dinámica para asegurar disponibilidad de conductores."
    },
    {
      q: "Seguridad en el Viaje",
      a: "Todos nuestros viajes son monitoreados por GPS. Tanto conductores como pasajeros pasan por filtros de seguridad. Utiliza el botón SOS en caso de emergencia."
    },
    {
      q: "Problemas con mi tarjeta",
      a: "Asegúrate de que tu tarjeta tenga fondos suficientes y esté habilitada para compras en línea. Si el problema persiste, intenta eliminarla y volver a agregarla o usa efectivo."
    }
  ];

  const toggleFaq = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="absolute inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center p-4 animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-t-3xl md:rounded-3xl shadow-2xl overflow-hidden animate-slide-up h-[80vh] flex flex-col">
        
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-black text-white">
          <h2 className="text-xl font-bold flex items-center gap-2">
             <HelpCircle size={24} /> Centro de Ayuda
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition">
            <X size={24} />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-6 bg-gray-50">
           {/* Quick Actions */}
           <h3 className="text-sm font-bold text-gray-900 mb-4">Reportar un problema</h3>
           <div className="grid grid-cols-2 gap-3 mb-8">
              <button className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center gap-2 hover:border-red-200 hover:shadow-md transition active:scale-95">
                 <div className="p-3 bg-red-50 text-red-600 rounded-full"><AlertTriangle size={24} /></div>
                 <span className="text-xs font-bold text-center">Reportar Driver</span>
              </button>
              <button className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center gap-2 hover:border-blue-200 hover:shadow-md transition active:scale-95">
                 <div className="p-3 bg-blue-50 text-blue-600 rounded-full"><PackageX size={24} /></div>
                 <span className="text-xs font-bold text-center">Objeto Perdido</span>
              </button>
              <button className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center gap-2 hover:border-green-200 hover:shadow-md transition active:scale-95">
                 <div className="p-3 bg-green-50 text-green-600 rounded-full"><MessageSquare size={24} /></div>
                 <span className="text-xs font-bold text-center">Cobro Incorrecto</span>
              </button>
              <button className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center gap-2 hover:border-orange-200 hover:shadow-md transition active:scale-95">
                 <div className="p-3 bg-orange-50 text-orange-600 rounded-full"><Phone size={24} /></div>
                 <span className="text-xs font-bold text-center">Contactar Soporte</span>
              </button>
           </div>

           {/* FAQ */}
           <h3 className="text-sm font-bold text-gray-900 mb-4">Preguntas Frecuentes</h3>
           <div className="space-y-2">
              {faqs.map((item, i) => (
                 <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden transition-all duration-300">
                   <button 
                    onClick={() => toggleFaq(i)}
                    className="w-full p-4 flex justify-between items-center hover:bg-gray-50 text-left"
                   >
                      <span className="text-sm font-bold text-gray-700">{item.q}</span>
                      {expandedIndex === i ? (
                        <ChevronDown size={16} className="text-black" />
                      ) : (
                        <ChevronRight size={16} className="text-gray-400" />
                      )}
                   </button>
                   
                   {expandedIndex === i && (
                     <div className="px-4 pb-4 text-xs text-gray-500 leading-relaxed bg-gray-50/50 animate-fade-in">
                       {item.a}
                     </div>
                   )}
                 </div>
              ))}
           </div>
        </div>

        <div className="p-4 bg-white border-t border-gray-100">
           <button className="w-full bg-black text-white py-3 rounded-xl font-bold shadow-lg active:scale-95 transition">
             Abrir Chat de Soporte
           </button>
        </div>

      </div>
    </div>
  );
};
