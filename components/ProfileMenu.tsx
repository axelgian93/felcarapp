
import React, { useState } from 'react';
import { X, User, CreditCard, History, Settings, LogOut, Star, ChevronRight, ShieldQuestion, MapPin, Shield, Plus, Trash2 } from 'lucide-react';
import { User as UserType } from '../types';

interface ProfileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserType;
  onLogout: () => void;
  onOpenHistory: () => void;
}

export const ProfileMenu: React.FC<ProfileMenuProps> = ({ isOpen, onClose, user, onLogout, onOpenHistory }) => {
  const [section, setSection] = useState<'MAIN' | 'EMERGENCY' | 'PREFS'>('MAIN');

  // Mock Contacts for Demo
  const [contacts, setContacts] = useState(user.emergencyContacts || [
    { id: 'c1', name: 'Mamá', phone: '0999999999', relation: 'Familia' }
  ]);

  // Must be after hooks
  if (!isOpen) return null;

  const renderMain = () => (
    <>
      {/* Header Profile Section */}
      <div className="bg-black text-white p-6 pt-10 relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition">
          <X size={24} className="text-white" />
        </button>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <img 
              src={user.photoUrl || `https://ui-avatars.com/api/?name=${user.name}&background=random`} 
              alt={user.name} 
              className="w-16 h-16 rounded-full border-4 border-white shadow-lg object-cover"
            />
            <div className="absolute -bottom-2 -right-2 bg-white text-black px-2 py-1 rounded-full shadow-md flex items-center gap-1 text-xs font-bold border border-gray-200">
              <Star size={10} className="text-yellow-400 fill-yellow-400" />
              {user.rating ? user.rating.toFixed(1) : '5.0'}
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold leading-tight">{user.name}</h2>
            <p className="text-sm text-gray-400">{user.email}</p>
            <span className="inline-block mt-1 text-[10px] bg-white/20 px-2 py-0.5 rounded uppercase tracking-wider">
              {user.role === 'RIDER' ? 'Pasajero' : 'Conductor'}
            </span>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex-grow overflow-y-auto py-4">
        <div className="px-4 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Mi Cuenta</div>
        
        <div className="space-y-1">
          <MenuItem icon={<User size={20} />} label="Datos Personales" onClick={() => {}} />
          <MenuItem icon={<CreditCard size={20} />} label="Billetera / Pagos" onClick={() => {}} />
          <MenuItem icon={<History size={20} />} label="Historial de Viajes" onClick={onOpenHistory} />
          <MenuItem icon={<MapPin size={20} />} label="Lugares Guardados" onClick={() => {}} />
        </div>

        {user.role === 'RIDER' && (
          <>
            <div className="px-4 mt-6 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Seguridad</div>
            <div className="space-y-1">
              <MenuItem icon={<Shield size={20} />} label="Contactos de Emergencia" onClick={() => setSection('EMERGENCY')} />
            </div>
          </>
        )}

        <div className="px-4 mt-6 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">General</div>
        <div className="space-y-1">
          <MenuItem icon={<ShieldQuestion size={20} />} label="Ayuda y Soporte" onClick={() => {}} />
          <MenuItem icon={<Settings size={20} />} label="Preferencias" onClick={() => setSection('PREFS')} />
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-gray-100 bg-gray-50">
        <button 
          onClick={onLogout} 
          className="w-full flex items-center justify-center gap-2 text-red-600 font-bold py-3 hover:bg-red-50 rounded-xl transition"
        >
          <LogOut size={18} /> Cerrar Sesión
        </button>
      </div>
    </>
  );

  const renderEmergency = () => (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-gray-100 flex items-center gap-3 bg-white">
         <button onClick={() => setSection('MAIN')} className="p-2 hover:bg-gray-100 rounded-full"><ChevronRight className="rotate-180" size={20}/></button>
         <h3 className="font-bold text-lg">Contactos de Emergencia</h3>
      </div>
      <div className="flex-grow p-4 bg-gray-50 space-y-3">
         <p className="text-sm text-gray-500 mb-4">Estas personas recibirán un enlace a tu ubicación si usas el botón SOS.</p>
         {contacts.map(c => (
            <div key={c.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
               <div>
                  <p className="font-bold">{c.name}</p>
                  <p className="text-xs text-gray-500">{c.relation} • {c.phone}</p>
               </div>
               <button className="text-red-400 p-2 hover:bg-red-50 rounded-full"><Trash2 size={18}/></button>
            </div>
         ))}
         <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-bold flex items-center justify-center gap-2 hover:border-black hover:text-black transition">
            <Plus size={20}/> Agregar Contacto
         </button>
      </div>
    </div>
  );

  const renderPrefs = () => (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-gray-100 flex items-center gap-3 bg-white">
         <button onClick={() => setSection('MAIN')} className="p-2 hover:bg-gray-100 rounded-full"><ChevronRight className="rotate-180" size={20}/></button>
         <h3 className="font-bold text-lg">Preferencias</h3>
      </div>
      <div className="flex-grow p-4 bg-gray-50 space-y-4">
         <div className="bg-white p-4 rounded-xl border border-gray-100 flex justify-between items-center">
            <span className="font-bold text-sm">Notificaciones Push</span>
            <div className="w-10 h-6 bg-black rounded-full relative"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div></div>
         </div>
         <div className="bg-white p-4 rounded-xl border border-gray-100 flex justify-between items-center">
            <span className="font-bold text-sm">Recibir Promociones</span>
            <div className="w-10 h-6 bg-black rounded-full relative"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div></div>
         </div>
         <div className="bg-white p-4 rounded-xl border border-gray-100">
            <span className="font-bold text-sm block mb-2">Idioma</span>
            <select className="w-full bg-gray-100 p-2 rounded-lg text-sm font-bold">
               <option>Español (Ecuador)</option>
               <option>English</option>
            </select>
         </div>
      </div>
    </div>
  );

  return (
    <div className="absolute inset-0 z-[60] bg-black/50 backdrop-blur-sm flex justify-end animate-fade-in">
      <div className="w-full md:w-[350px] h-full bg-white shadow-2xl flex flex-col animate-slide-left">
        {section === 'MAIN' && renderMain()}
        {section === 'EMERGENCY' && renderEmergency()}
        {section === 'PREFS' && renderPrefs()}
      </div>
    </div>
  );
};

const MenuItem = ({ icon, label, onClick }: any) => (
  <button 
    onClick={onClick}
    className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition border-b border-gray-50 last:border-0 group"
  >
    <div className="flex items-center gap-4 text-gray-700 group-hover:text-black">
      <div className="text-gray-400 group-hover:text-black transition">{icon}</div>
      <span className="font-medium text-sm">{item => label} {label}</span>
    </div>
    <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-800" />
  </button>
);
