
import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface CancellationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

export const CancellationModal: React.FC<CancellationModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [selectedReason, setSelectedReason] = useState<string>('');

  if (!isOpen) return null;

  const reasons = [
    "El conductor no se mueve",
    "El tiempo de espera es muy largo",
    "El conductor solicitó cancelar",
    "Encontré otro transporte",
    "Cambié de planes",
    "Ubicación incorrecta del conductor"
  ];

  const handleConfirm = () => {
    if (selectedReason) {
      onConfirm(selectedReason);
    }
  };

  return (
    <div className="absolute inset-0 z-[80] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-slide-up">
        
        <div className="p-5 bg-red-50 border-b border-red-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-red-700 flex items-center gap-2">
             <AlertTriangle size={20} /> Cancelar Viaje
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-red-100 rounded-full transition text-red-400">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <p className="text-gray-600 text-sm mb-4 font-medium">
            Por favor, cuéntanos por qué deseas cancelar el viaje. Esto nos ayuda a mejorar el servicio.
          </p>

          <div className="space-y-2 mb-6">
            {reasons.map((reason) => (
              <button
                key={reason}
                onClick={() => setSelectedReason(reason)}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition border ${
                  selectedReason === reason 
                    ? 'bg-black text-white border-black' 
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                }`}
              >
                {reason}
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="flex-1 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition"
            >
              Volver
            </button>
            <button 
              onClick={handleConfirm}
              disabled={!selectedReason}
              className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              Confirmar
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
