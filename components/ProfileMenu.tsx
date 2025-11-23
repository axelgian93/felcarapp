
import React, { useState } from 'react';
import { X, User, CreditCard, History, Settings, LogOut, Star, ChevronRight, ShieldQuestion, MapPin, Shield, Plus, Trash2, Phone, Mail, FileText, Car, Percent } from 'lucide-react';
import { User as UserType, UserRole } from '../types';

interface ProfileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserType;
  onLogout: () => void;
  onOpenHistory: () => void;
  onOpenPayments: () => void;
  onOpenSavedPlaces: () => void;
  onOpenHelp: () => void;
  onOpenPromotions?: () => void;
}

export const ProfileMenu: React.FC<ProfileMenuProps> = ({ 
  isOpen, 
  onClose, 
  user, 
  onLogout, 
  onOpenHistory,
  onOpenPayments,
  onOpenSavedPlaces,
  onOpenHelp,
  onOpenPromotions
}) => {
  const [section, setSection] = useState<'MAIN' | 'EMERGENCY' | 'PREFS' | 'PERSONAL' | 'VEHICLE' | 'DOCS'>('MAIN');

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
              {user.role === UserRole.RIDER ? 'Pasajero' : 'Conductor'}
            </span>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex-grow overflow-y-auto py-4">
        <div className="px-4 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Mi Cuenta</div>
        
        <div className="space-y-1">
          <MenuItem icon={<User size={20} />} label="Datos Personales" onClick={() => setSection('PERSONAL')} />
          
          {/* Driver Specific Items */}
          {user.role === UserRole.DRIVER && (
            <>
              <MenuItem icon={<Car size={20} />} label="Mi Vehículo" onClick={() => setSection('VEHICLE')} />
              <MenuItem icon={<FileText size={20} />} label="Documentos" onClick={() => setSection('DOCS')} />
            </>
          )}

          <MenuItem icon={<CreditCard size={20} />} label="Billetera / Pagos" onClick={onOpenPayments} />
          <MenuItem icon={<History size={20} />} label="Historial de Viajes" onClick={onOpenHistory} />
          
          {/* Rider Specific Items */}
          {user.role === UserRole.RIDER && (
            <>
              <MenuItem icon={<MapPin size={20} />} label="Lugares Guardados" onClick={onOpenSavedPlaces} />
              {onOpenPromotions && (
                 <MenuItem icon={<Percent size={20} />} label="Promociones Activas" onClick={onOpenPromotions} />
              )}
            </>
          )}
        </div>

        {user.role === UserRole.RIDER && (
          <>
            <div className="px-4 mt-6 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Seguridad</div>
            <div className="space-y-1">
              <MenuItem icon={<Shield size={20} />} label="Contactos de Emergencia" onClick={() => setSection('EMERGENCY')} />
            </div>
          </>
        )}

        <div className="px-4 mt-6 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">General</div>
        <div className="space-y-1">
          <MenuItem icon={<ShieldQuestion size={20} />} label="Ayuda y Soporte" onClick={onOpenHelp} />
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

  const renderPersonal = () => (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-gray-100 flex items-center gap-3 bg-white">
         <button onClick={() => setSection('MAIN')} className="p-2 hover:bg-gray-100 rounded-full"><ChevronRight className="rotate-180" size={20}/></button>
         <h3 className="font-bold text-lg">Datos Personales</h3>
      </div>
      <div className="flex-grow p-6 bg-gray-50 space-y-6">
         <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <div className="bg-gray-100 p-2 rounded-full"><User size={20} className="text-gray-600" /></div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold">Nombre Completo</p>
                <p className="font-bold text-gray-900">{user.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <div className="bg-gray-100 p-2 rounded-full"><CreditCard size={20} className="text-gray-600" /></div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold">Cédula / ID</p>
                <p className="font-bold text-gray-900">{user.cedula || 'No registrado'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <div className="bg-gray-100 p-2 rounded-full"><Mail size={20} className="text-gray-600" /></div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold">Correo Electrónico</p>
                <p className="font-bold text-gray-900">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-gray-100 p-2 rounded-full"><Phone size={20} className="text-gray-600" /></div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold">Teléfono</p>
                <p className="font-bold text-gray-900">{user.phone || 'No registrado'}</p>
              </div>
            </div>
         </div>
         <p className="text-center text-xs text-gray-400">Para editar estos datos, contacta a soporte.</p>
      </div>
    </div>
  );

  const renderVehicle = () => (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-gray-100 flex items-center gap-3 bg-white">
         <button onClick={() => setSection('MAIN')} className="p-2 hover:bg-gray-100 rounded-full"><ChevronRight className="rotate-180" size={20}/></button>
         <h3 className="font-bold text-lg">Mi Vehículo</h3>
      </div>
      <div className="flex-grow p-6 bg-gray-50 space-y-6">
         <div className="flex justify-center my-4">
            <div className="w-40 h-40 bg-white rounded-full flex items-center justify-center shadow-inner border-4 border-gray-100">
              <Car size={64} className="text-gray-800" />
            </div>
         </div>
         <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <p className="text-xs text-gray-500 uppercase font-bold">Placa</p>
                  <div className="bg-yellow-400 px-2 py-1 rounded border-2 border-black inline-block mt-1">
                    <p className="font-black text-lg font-mono leading-none">{user.driverDetails?.plate}</p>
                  </div>
               </div>
               <div>
                  <p className="text-xs text-gray-500 uppercase font-bold">Año</p>
                  <p className="font-bold text-lg">{user.driverDetails?.carYear}</p>
               </div>
               <div className="col-span-2">
                  <p className="text-xs text-gray-500 uppercase font-bold">Modelo</p>
                  <p className="font-bold text-lg">{user.driverDetails?.carModel}</p>
               </div>
               <div className="col-span-2 flex items-center gap-2">
                  <p className="text-xs text-gray-500 uppercase font-bold">Color:</p>
                  <div 
                    className="w-6 h-6 rounded-full border border-gray-300 shadow-sm" 
                    style={{ backgroundColor: user.driverDetails?.carColor }}
                  ></div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );

  const renderDocs = () => (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-gray-100 flex items-center gap-3 bg-white">
         <button onClick={() => setSection('MAIN')} className="p-2 hover:bg-gray-100 rounded-full"><ChevronRight className="rotate-180" size={20}/></button>
         <h3 className="font-bold text-lg">Documentos</h3>
      </div>
      <div className="flex-grow p-6 bg-gray-50 space-y-4">
         {[
            { name: 'Licencia de Conducir', status: 'VALID' },
            { name: 'Matrícula / Revisión', status: 'VALID' },
            { name: 'Antecedentes Penales', status: 'VALID' }
         ].map((doc, i) => (
            <div key={i} className="bg-white p-4 rounded-xl border border-gray-200 flex justify-between items-center">
               <div className="flex items-center gap-3">
                  <FileText className="text-blue-500" size={24} />
                  <span className="font-bold text-sm">{doc.name}</span>
               </div>
               <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded uppercase">Vigente</span>
            </div>
         ))}
      </div>
    </div>
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
        {section === 'PERSONAL' && renderPersonal()}
        {section === 'VEHICLE' && renderVehicle()}
        {section === 'DOCS' && renderDocs()}
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
