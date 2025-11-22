import React from 'react';
import { X, Home, Briefcase, MapPin, ArrowUpCircle, ArrowRightCircle } from 'lucide-react';
import { User, Location } from '../types';

interface SavedPlacesModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onSelect: (location: Location, type: 'PICKUP' | 'DESTINATION') => void;
}

export const SavedPlacesModal: React.FC<SavedPlacesModalProps> = ({ isOpen, onClose, user, onSelect }) => {
  if (!isOpen) return null;

  const places = [
    { 
      id: 'home', 
      label: 'Casa', 
      icon: <Home size={24} />, 
      data: user.savedPlaces?.home 
    },
    { 
      id: 'work', 
      label: 'Trabajo', 
      icon: <Briefcase size={24} />, 
      data: user.savedPlaces?.work 
    }
  ];

  const hasPlaces = places.some(p => p.data);

  return (
    <div className="absolute inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-slide-up">
        
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center gap-2">
             <MapPin className="text-red-500" /> Mis Lugares
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 bg-gray-50/50 min-h-[200px]">
          {!hasPlaces && (
            <div className="text-center py-8 text-gray-400">
              <MapPin size={48} className="mx-auto mb-2 opacity-20" />
              <p>No tienes lugares guardados en tu perfil.</p>
            </div>
          )}

          {places.map((place) => (
            place.data && (
              <div key={place.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-3 rounded-full ${place.id === 'home' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
                    {place.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{place.label}</h3>
                    <p className="text-xs text-gray-500 line-clamp-1">{place.data.address || 'Sin dirección'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => onSelect(place.data!, 'PICKUP')}
                    className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-gray-50 text-gray-700 text-xs font-bold hover:bg-black hover:text-white transition group"
                  >
                    <ArrowUpCircle size={16} className="text-gray-400 group-hover:text-white" />
                    Como Partida
                  </button>
                  <button 
                    onClick={() => onSelect(place.data!, 'DESTINATION')}
                    className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-gray-50 text-gray-700 text-xs font-bold hover:bg-black hover:text-white transition group"
                  >
                    <ArrowRightCircle size={16} className="text-gray-400 group-hover:text-white" />
                    Como Destino
                  </button>
                </div>
              </div>
            )
          ))}
        </div>
        
        <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
          <p className="text-[10px] text-gray-400">Puedes gestionar estos lugares en tu Perfil.</p>
        </div>
      </div>
    </div>
  );
};