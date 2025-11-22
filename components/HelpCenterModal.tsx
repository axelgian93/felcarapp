import React from 'react';
import { X, HelpCircle, AlertTriangle, PackageX, ChevronRight, MessageSquare, Phone } from 'lucide-react';

interface HelpCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpCenterModal: React.FC<HelpCenterModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const faqs = [
    "¿Cómo cancelo un viaje?",
    "Tarifas y recargos explicados",
    "Seguridad en Taxi Baby",
    "Problemas con mi tarjeta"
  ];

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
              <button className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center gap-2 hover:border-red-200 hover:shadow-md transition">
                 <div className="p-3 bg-red-50 text-red-600 rounded-full"><AlertTriangle size={24} /></div>
                 <span className="text-xs font-bold text-center">Reportar Driver</span>
              </button>
              <button className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center gap-2 hover:border-blue-200 hover:shadow-md transition">
                 <div className="p-3 bg-blue-50 text-blue-600 rounded-full"><PackageX size={24} /></div>
                 <span className="text-xs font-bold text-center">Objeto Perdido</span>
              </button>
              <button className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center gap-2 hover:border-green-200 hover:shadow-md transition">
                 <div className="p-3 bg-green-50 text-green-600 rounded-full"><MessageSquare size={24} /></div>
                 <span className="text-xs font-bold text-center">Cobro Incorrecto</span>
              </button>
              <button className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center gap-2 hover:border-orange-200 hover:shadow-md transition">
                 <div className="p-3 bg-orange-50 text-orange-600 rounded-full"><Phone size={24} /></div>
                 <span className="text-xs font-bold text-center">Contactar Soporte</span>
              </button>
           </div>

           {/* FAQ */}
           <h3 className="text-sm font-bold text-gray-900 mb-4">Preguntas Frecuentes</h3>
           <div className="space-y-2">
              {faqs.map((q, i) => (
                 <button key={i} className="w-full bg-white p-4 rounded-xl border border-gray-100 flex justify-between items-center hover:bg-gray-50">
                    <span className="text-sm font-medium text-gray-700">{q}</span>
                    <ChevronRight size={16} className="text-gray-400" />
                 </button>
              ))}
           </div>
        </div>

        <div className="p-4 bg-white border-t border-gray-100">
           <button className="w-full bg-black text-white py-3 rounded-xl font-bold">Abrir Chat de Soporte</button>
        </div>

      </div>
    </div>
  );
};