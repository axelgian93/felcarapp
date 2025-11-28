

import React, { useState, useEffect } from 'react';
import { X, Home, Briefcase, MapPin, ArrowUpCircle, ArrowRightCircle, Plus, Star, Navigation, Map } from 'lucide-react';
import { User, Location, SavedPlace } from '../types';
import { UserService } from '../src/services/userService';

interface SavedPlacesModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onSelect: (location: Location, type: 'PICKUP' | 'DESTINATION') => void;
  onPickFromMap?: () => void; // New callback for map selection
  prefilledLocation?: Location | null; // Data coming back from map pick
}

export const SavedPlacesModal: React.FC<SavedPlacesModalProps> = ({ 
  isOpen, 
  onClose, 
  user, 
  onSelect,
  onPickFromMap,
  prefilledLocation 
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newPlaceName, setNewPlaceName] = useState('');
  const [newPlaceAddress, setNewPlaceAddress] = useState('');
  // Mock suggestions state
  const [suggestions, setSuggestions] = useState<string[]>([]);
  
  // If opening with prefilled location from Map Pick
  useEffect(() => {
    if (prefilledLocation && isOpen) {
        setIsAdding(true);
        setNewPlaceAddress(prefilledLocation.address || 'Ubicación seleccionada en mapa');
    }
  }, [prefilledLocation, isOpen]);

  // Mock autocomplete logic
  const handleAddressChange = (val: string) => {
    setNewPlaceAddress(val);
    if (val.length > 2) {
       setSuggestions([
         `${val} - Centro`,
         `${val} - Norte`,
         `${val} - Samborondón`
       ]);
    } else {
       setSuggestions([]);
    }
  };

  if (!isOpen) return null;

  // Combine fixed logic with new array structure
  const savedPlaces: SavedPlace[] = user.savedPlaces || [];
  
  const handleSavePlace = async () => {
     if (!newPlaceName || !newPlaceAddress) return;
     
     const coords = prefilledLocation || { lat: -2.1894, lng: -79.8891 }; // Use picked or mock
     
     const newPlace: SavedPlace = {
        id: Math.random().toString(36).substr(2, 9),
        name: newPlaceName,
        address: newPlaceAddress,
        coords: coords,
        type: 'OTHER'
     };

     await UserService.addSavedPlace(user.id, newPlace);
     setIsAdding(false);
     setNewPlaceName('');
     setNewPlaceAddress('');
     setSuggestions([]);
  };

  return (
    <div className="absolute inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-slide-up flex flex-col max-h-[85vh]">
        
        {/* Header Black as requested */}
        <div className="p-5 border-b border-gray-800 bg-black text-white flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center gap-2">
             <MapPin className="text-red-500" /> Mis Lugares
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition">
            <X size={20} className="text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 bg-gray-50/50 flex-grow overflow-y-auto">
          {savedPlaces.length === 0 && !isAdding && (
            <div className="text-center py-8 text-gray-400">
              <MapPin size={48} className="mx-auto mb-2 opacity-20" />
              <p>No tienes lugares guardados.</p>
            </div>
          )}

          {/* List of Places */}
          {!isAdding && savedPlaces.map((place) => (
              <div key={place.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-3 rounded-full ${
                      place.type === 'HOME' ? 'bg-blue-50 text-blue-600' : 
                      place.type === 'WORK' ? 'bg-orange-50 text-orange-600' : 
                      'bg-pink-50 text-pink-600'
                  }`}>
                    {place.type === 'HOME' ? <Home size={20} /> : 
                     place.type === 'WORK' ? <Briefcase size={20} /> : <Star size={20} />}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{place.name}</h3>
                    <p className="text-xs text-gray-500 line-clamp-1">{place.address}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => onSelect(place.coords, 'PICKUP')}
                    className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-gray-50 text-gray-700 text-xs font-bold hover:bg-black hover:text-white transition group"
                  >
                    <ArrowUpCircle size={16} className="text-gray-400 group-hover:text-white" />
                    Como Partida
                  </button>
                  <button 
                    onClick={() => onSelect(place.coords, 'DESTINATION')}
                    className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-gray-50 text-gray-700 text-xs font-bold hover:bg-black hover:text-white transition group"
                  >
                    <ArrowRightCircle size={16} className="text-gray-400 group-hover:text-white" />
                    Como Destino
                  </button>
                </div>
              </div>
          ))}

          {/* Add New Place Form */}
          {isAdding && (
             <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm animate-fade-in space-y-3">
                <h3 className="font-bold text-sm text-black">Nuevo Lugar</h3>
                <input 
                   type="text" 
                   placeholder="Nombre (Ej: Gym, Casa de Mamá)" 
                   className="w-full bg-gray-50 p-3 rounded-xl text-sm font-bold border border-gray-100 text-black placeholder:text-gray-400"
                   value={newPlaceName}
                   onChange={e => setNewPlaceName(e.target.value)}
                />
                
                <div className="relative">
                    <input 
                       type="text" 
                       placeholder="Dirección" 
                       className="w-full bg-gray-50 p-3 rounded-xl text-sm border border-gray-100 text-black placeholder:text-gray-400 pr-10"
                       value={newPlaceAddress}
                       onChange={e => handleAddressChange(e.target.value)}
                    />
                    {/* Pick on Map Trigger */}
                    {onPickFromMap && (
                       <button 
                         onClick={onPickFromMap}
                         className="absolute right-2 top-2 p-1.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 text-black shadow-sm"
                         title="Seleccionar en mapa"
                       >
                          <Map size={16} />
                       </button>
                    )}
                    
                    {/* Autocomplete Suggestions */}
                    {suggestions.length > 0 && (
                      <div className="absolute top-full left-0 right-0 bg-white border border-gray-100 shadow-xl rounded-xl mt-1 z-10 overflow-hidden">
                         {suggestions.map((s, idx) => (
                            <button
                               key={idx}
                               onClick={() => { setNewPlaceAddress(s); setSuggestions([]); }}
                               className="w-full text-left px-4 py-3 text-xs font-bold text-gray-700 hover:bg-gray-50 border-b border-gray-50 last:border-0"
                            >
                               {s}
                            </button>
                         ))}
                      </div>
                    )}
                </div>

                <div className="flex gap-2 pt-2">
                   <button onClick={() => setIsAdding(false)} className="flex-1 py-2 text-gray-500 font-bold text-xs">Cancelar</button>
                   <button onClick={handleSavePlace} className="flex-1 py-2 bg-black text-white rounded-lg font-bold text-xs">Guardar</button>
                </div>
             </div>
          )}

          {!isAdding && (
             <button 
               onClick={() => setIsAdding(true)}
               className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400 hover:border-black hover:text-black transition"
             >
                <Plus size={24} className="mb-1"/>
                <span className="text-xs font-bold">Agregar Nuevo Favorito</span>
             </button>
          )}

        </div>
      </div>
    </div>
  );
};
