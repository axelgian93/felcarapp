import React, { useState } from 'react';


import { X, User, CreditCard, History, Settings, LogOut, Star, ChevronRight, ShieldQuestion, MapPin, Shield, Plus, Trash2, Phone, Mail, FileText, Car, Percent, ArrowLeft, Camera, BarChart3, Lock, Calendar } from 'lucide-react';


import { User as UserType, UserRole } from '../types';
import { useTheme } from '../src/context/ThemeContext';


import { ImageService } from '../src/services/imageService';


import { UserService } from '../src/services/userService';





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


  onOpenReports: () => void;


  onChangePassword: () => void;


  onOpenScheduledRides: () => void;
  onRequestPermissions?: () => void;
  riderStats?: {
    todayAmount: string;
    todayDeltaLabel: string;
    tripsThisWeek: number;
    tier: string;
    tierStatus: string;
  };


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


  onOpenPromotions,


  onOpenReports,


  onChangePassword,


  onOpenScheduledRides,
  onRequestPermissions,
  riderStats


}) => {


  const [section, setSection] = useState<'MAIN' | 'EMERGENCY' | 'PREFS' | 'PERSONAL' | 'VEHICLE' | 'DOCS'>('MAIN');

  const { theme, toggleTheme } = useTheme();





  // Mock Contacts for Demo


  const [contacts] = useState(user.emergencyContacts || [


    { id: 'c1', name: 'Mamá', phone: '0999999999', relation: 'Familia' }


  ]);





  const handleUpdateProfilePhoto = async () => {


    const photo = await ImageService.takePhoto();


    if (photo) {


      await UserService.updateUserPhoto(user.id, photo);


    }


  };





  const handleUpdateCarPhoto = async () => {


    const photo = await ImageService.takePhoto();


    if (photo) {


      await UserService.updateCarPhoto(user.id, photo);


    }


  };





  // Must be after hooks


  if (!isOpen) return null;





  const renderMain = () => (


    <>


      {/* Header Profile Section */}


      <div className="modal-header p-6 pt-10 relative">

  <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-white dark:bg-slate-900/20 rounded-full transition">


          <X size={24} className="text-white" />


        </button>


        


        <div className="flex items-center gap-4">


          <div className="relative group">


            <img 


              src={user.photoUrl || `https://ui-avatars.com/api/name=${user.name}&background=random`} 


              alt={user.name} 


              className="w-16 h-16 rounded-full border-4 border-white shadow-lg object-cover"


            />


             {/* Camera Icon Overlay */}


             <button 


               onClick={handleUpdateProfilePhoto}


               className="absolute bottom-0 right-0 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-1.5 rounded-full shadow-md border border-gray-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900/60 transition z-10"


             >


               <Camera size={12} />


             </button>





            <div className="absolute -bottom-2 -left-1 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 px-2 py-1 rounded-full shadow-md flex items-center gap-1 text-xs font-bold border border-gray-200 dark:border-slate-800">


              <Star size={10} className="text-yellow-400 fill-yellow-400" />


              {user.rating ? user.rating.toFixed(1) : '5.0'}


            </div>


          </div>


          <div>


            <h2 className="text-xl font-bold leading-tight">{user.name}</h2>


            <p className="text-sm text-gray-400 dark:text-slate-500">{user.email}</p>


            <span className="inline-block mt-1 text-[10px] bg-white dark:bg-slate-900/20 px-2 py-0.5 rounded uppercase tracking-wider">


              {user.role === UserRole.RIDER ? 'Pasajero' : 'Conductor'}


            </span>


          </div>


        </div>


      </div>





      {user.role === UserRole.RIDER && riderStats && (


        <div className="px-6 pb-4">


          <div className="grid grid-cols-3 gap-3">


            <div className="bg-gray-50 dark:bg-slate-800 rounded-2xl p-3 border border-gray-100 dark:border-slate-800">


              <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1">Hoy</div>


              <div className="text-lg font-bold mt-1">{riderStats.todayAmount}</div>


              <p className="text-[10px] text-emerald-500 mt-1">{riderStats.todayDeltaLabel}</p>


            </div>


            <div className="bg-gray-50 dark:bg-slate-800 rounded-2xl p-3 border border-gray-100 dark:border-slate-800">


              <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1">Viajes</div>


              <div className="text-lg font-bold mt-1">{riderStats.tripsThisWeek}</div>


              <p className="text-[10px] text-slate-400 mt-1">Esta semana</p>


            </div>


            <div className="bg-gray-50 dark:bg-slate-800 rounded-2xl p-3 border border-gray-100 dark:border-slate-800">


              <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1">Nivel</div>


              <div className="text-lg font-bold mt-1">{riderStats.tier}</div>


              <p className="text-[10px] text-amber-500 mt-1">{riderStats.tierStatus}</p>


            </div>


          </div>


        </div>


      )}



      {/* Menu Items */}


      <div className="flex-grow overflow-y-auto py-4">


        <div className="px-4 mb-2 text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">Mi Cuenta</div>


        


        <div className="space-y-1">


          <MenuItem icon={<User size={20} />} label="Datos personales" onClick={() => setSection('PERSONAL')} />


          


          {/* Driver Specific Items */}


          {user.role === UserRole.DRIVER && (


            <>


              <MenuItem icon={<Car size={20} />} label="Mi Vehículo" onClick={() => setSection('VEHICLE')} />


              <MenuItem icon={<FileText size={20} />} label="Documentos" onClick={() => setSection('DOCS')} />


            </>


          )}





          <MenuItem icon={<CreditCard size={20} />} label="Billetera / Pagos" onClick={onOpenPayments} />


          <MenuItem icon={<History size={20} />} label="Historial de viajes" onClick={onOpenHistory} />


          


          {/* Rider Specific Items */}


          {user.role === UserRole.RIDER && (


            <>


              {onOpenScheduledRides && (


                  <MenuItem icon={<Calendar size={20} />} label="Viajes reservados" onClick={onOpenScheduledRides} />


              )}


              <MenuItem icon={<MapPin size={20} />} label="Lugares guardados" onClick={onOpenSavedPlaces} />


              {onOpenPromotions && (


                 <MenuItem icon={<Percent size={20} />} label="Promociones activas" onClick={onOpenPromotions} />


              )}


            </>


          )}





          {/* Report Button */}


          {onOpenReports && (


             <MenuItem icon={<BarChart3 size={20} />} label="Reportes" onClick={onOpenReports} />


          )}


        </div>





        {user.role === UserRole.RIDER && (


          <>


            <div className="px-4 mt-6 mb-2 text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">Seguridad</div>


            <div className="space-y-1">


              <MenuItem icon={<Shield size={20} />} label="Contactos de Emergencia" onClick={() => setSection('EMERGENCY')} />


            </div>


          </>


        )}





        <div className="px-4 mt-6 mb-2 text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">General</div>


        <div className="space-y-1">


          <MenuItem icon={<ShieldQuestion size={20} />} label="Ayuda y Soporte" onClick={onOpenHelp} />
          <MenuItem icon={<Settings size={20} />} label={`Tema: ${theme === 'dark' ? 'Oscuro' : 'Claro'}`} onClick={toggleTheme} />



          <MenuItem icon={<Settings size={20} />} label="Preferencias" onClick={() => setSection('PREFS')} />


        </div>


      </div>





      {/* Footer */}


      <div className="p-6 border-t border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800">


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


      <div className="p-5 border-b border-gray-100 dark:border-slate-800 flex items-center gap-3 bg-white dark:bg-slate-900">


         <button onClick={() => setSection('MAIN')} className="p-2 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 rounded-full transition">


            <ArrowLeft size={20} className="text-slate-900 dark:text-slate-100" />


         </button>


         <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">Datos personales</h3>


      </div>


      <div className="flex-grow p-6 bg-gray-50 dark:bg-slate-800 space-y-6">


         {/* Edit Profile Photo Center */}


         <div className="flex flex-col items-center justify-center">


            <div className="relative">


                <img 


                  src={user.photoUrl || `https://ui-avatars.com/api/name=${user.name}`} 


                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md" 


                />


                <button 


                  onClick={handleUpdateProfilePhoto}


               className="absolute bottom-0 right-0 bg-slate-900 dark:bg-sky-500 text-white p-2 rounded-full hover:scale-105 transition shadow-lg"

                >


                  <Camera size={16} />


                </button>


            </div>


            <p className="text-xs text-gray-400 dark:text-slate-500 mt-2">Toca la cámara para actualizar</p>


         </div>





         <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm space-y-4">


            <div className="flex items-center gap-3 border-b border-gray-100 dark:border-slate-800 pb-4">


              <div className="bg-gray-100 dark:bg-slate-800 p-2 rounded-full"><User size={20} className="text-gray-600 dark:text-slate-300" /></div>


              <div>


                <p className="text-xs text-gray-500 dark:text-slate-400 uppercase font-bold">Nombre completo</p>


                <p className="font-bold text-gray-900 dark:text-slate-100">{user.name}</p>


              </div>


            </div>


            <div className="flex items-center gap-3 border-b border-gray-100 dark:border-slate-800 pb-4">


              <div className="bg-gray-100 dark:bg-slate-800 p-2 rounded-full"><CreditCard size={20} className="text-gray-600 dark:text-slate-300" /></div>


              <div>


                <p className="text-xs text-gray-500 dark:text-slate-400 uppercase font-bold">Cédula / ID</p>


                <p className="font-bold text-gray-900 dark:text-slate-100">{user.cedula || 'No registrado'}</p>


              </div>


            </div>


            <div className="flex items-center gap-3 border-b border-gray-100 dark:border-slate-800 pb-4">


              <div className="bg-gray-100 dark:bg-slate-800 p-2 rounded-full"><Mail size={20} className="text-gray-600 dark:text-slate-300" /></div>


              <div>


                <p className="text-xs text-gray-500 dark:text-slate-400 uppercase font-bold">Correo electrónico</p>


                <p className="font-bold text-gray-900 dark:text-slate-100">{user.email}</p>


              </div>


            </div>


            <div className="flex items-center gap-3">


              <div className="bg-gray-100 dark:bg-slate-800 p-2 rounded-full"><Phone size={20} className="text-gray-600 dark:text-slate-300" /></div>


              <div>


                <p className="text-xs text-gray-500 dark:text-slate-400 uppercase font-bold">Teléfono</p>


                <p className="font-bold text-gray-900 dark:text-slate-100">{user.phone || 'No registrado'}</p>


              </div>


            </div>


         </div>


         


         {/* Change Password Button */}


         {onChangePassword && (


             <button 


                onClick={onChangePassword}


                className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-bold py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900/60 transition flex items-center justify-center gap-2 shadow-sm"

             >


                <Lock size={18} /> Cambiar Contraseña


             </button>


         )}


      </div>


    </div>


  );





  const renderVehicle = () => (


    <div className="flex flex-col h-full">


      <div className="p-5 border-b border-gray-100 dark:border-slate-800 flex items-center gap-3 bg-white dark:bg-slate-900">


         <button onClick={() => setSection('MAIN')} className="p-2 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 rounded-full transition">


             <ArrowLeft size={20} className="text-slate-900 dark:text-slate-100" />


         </button>


         <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">Mi Vehículo</h3>


      </div>


      <div className="flex-grow p-6 bg-gray-50 dark:bg-slate-800 space-y-6">


         


         {/* Car Photo Section */}


         <div className="w-full h-48 bg-gray-200 rounded-2xl overflow-hidden shadow-inner relative flex items-center justify-center group">


            {user.driverDetails?.carPhotoUrl ? (


                <img src={user.driverDetails?.carPhotoUrl} alt="Car" className="w-full h-full object-cover" />


            ) : (


                <div className="flex flex-col items-center text-gray-400 dark:text-slate-500">


                    <Car size={48} className="mb-2" />


                    <span className="text-xs font-bold">Sin foto</span>


                </div>


            )}


            {/* Edit Photo Button Overlay */}


            <button 


              onClick={handleUpdateCarPhoto}


              className="absolute bottom-3 right-3 p-3 bg-white dark:bg-slate-900 rounded-full shadow-lg hover:bg-slate-100 dark:hover:bg-slate-900/60 transition"


            >


                <Camera size={20} className="text-slate-900 dark:text-slate-100" />


            </button>


         </div>





         <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm space-y-4">


            <div className="grid grid-cols-2 gap-4">


               <div>


                  <p className="text-xs text-gray-500 dark:text-slate-400 uppercase font-bold">Placa</p>


                  <div className="bg-yellow-400 px-2 py-1 rounded border-2 border-black inline-block mt-1">


                    <p className="font-black text-lg text-slate-900 dark:text-slate-100 font-mono leading-none">{user.driverDetails?.plate || "-"}</p>


                  </div>


               </div>


               <div>


                  <p className="text-xs text-gray-500 dark:text-slate-400 uppercase font-bold">Año</p>


                  <p className="font-bold text-lg text-gray-900 dark:text-slate-100">{user.driverDetails?.carYear || "-"}</p>


               </div>


               <div className="col-span-2">


                  <p className="text-xs text-gray-500 dark:text-slate-400 uppercase font-bold">Modelo</p>


                  <p className="font-bold text-lg text-gray-900 dark:text-slate-100">{user.driverDetails?.carModel || "-"}</p>


               </div>


               <div className="col-span-2 flex items-center gap-2">


                  <p className="text-xs text-gray-500 dark:text-slate-400 uppercase font-bold">Color:</p>


                  <div 


                    className="w-6 h-6 rounded-full border border-gray-300 shadow-sm" 


                    style={{ backgroundColor: user.driverDetails?.carColor || "#9CA3AF" }}


                  ></div>


                  <span className="text-gray-900 dark:text-slate-100 font-medium">{user.driverDetails?.carColor || "#9CA3AF"}</span>


               </div>


            </div>


         </div>


      </div>


    </div>


  );





  const renderDocs = () => (


    <div className="flex flex-col h-full">


      <div className="p-5 border-b border-gray-100 dark:border-slate-800 flex items-center gap-3 bg-white dark:bg-slate-900">


         <button onClick={() => setSection('MAIN')} className="p-2 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 rounded-full transition">


             <ArrowLeft size={20} className="text-slate-900 dark:text-slate-100" />


         </button>


         <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">Documentos</h3>


      </div>


      <div className="flex-grow p-6 bg-gray-50 dark:bg-slate-800 space-y-4">


         {[


            { name: 'Licencia de Conducir', status: 'VALID' },


            { name: 'Matrícula / Revisión', status: 'VALID' },


            { name: 'Antecedentes Penales', status: 'VALID' }


         ].map((doc, i) => (


            <div key={i} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-200 dark:border-slate-800 flex justify-between items-center">


               <div className="flex items-center gap-3">


                  <FileText className="text-blue-500" size={24} />


                  <span className="font-bold text-sm text-gray-900 dark:text-slate-100">{doc.name}</span>


               </div>


               <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded uppercase">Vigente</span>


            </div>


         ))}


      </div>


    </div>


  );





  const renderEmergency = () => (


    <div className="flex flex-col h-full">


      <div className="p-5 border-b border-gray-100 dark:border-slate-800 flex items-center gap-3 bg-white dark:bg-slate-900">


         <button onClick={() => setSection('MAIN')} className="p-2 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 rounded-full transition">


             <ArrowLeft size={20} className="text-slate-900 dark:text-slate-100" />


         </button>


         <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">Contactos de Emergencia</h3>


      </div>


      <div className="flex-grow p-4 bg-gray-50 dark:bg-slate-800 space-y-3">


         <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">Estas personas recibirán un enlace a tu ubicación si usas el botón SOS.</p>


         {contacts.map(c => (


            <div key={c.id} className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 flex justify-between items-center">


               <div>


                  <p className="font-bold text-gray-900 dark:text-slate-100">{c.name}</p>


                  <p className="text-xs text-gray-500 dark:text-slate-400">{c.relation}  {c.phone}</p>


               </div>


               <button className="text-red-400 p-2 hover:bg-red-50 rounded-full"><Trash2 size={18}/></button>


            </div>


         ))}


         <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 dark:text-slate-400 font-bold flex items-center justify-center gap-2 hover:border-black hover:text-slate-900 dark:text-slate-100 transition">


            <Plus size={20}/> Agregar contacto


         </button>


      </div>


    </div>


  );





  const renderPrefs = () => (


    <div className="flex flex-col h-full">


      <div className="p-5 border-b border-gray-100 dark:border-slate-800 flex items-center gap-3 bg-white dark:bg-slate-900">


         <button onClick={() => setSection('MAIN')} className="p-2 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 rounded-full transition">


             <ArrowLeft size={20} className="text-slate-900 dark:text-slate-100" />


         </button>


         <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">Preferencias</h3>


      </div>


      <div className="flex-grow p-4 bg-gray-50 dark:bg-slate-800 space-y-4">
         {onRequestPermissions && (
           <button onClick={onRequestPermissions} className="w-full bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-100 dark:border-slate-800 text-left font-bold text-sm text-gray-900 dark:text-slate-100">Solicitar permisos de la app</button>
         )}
         <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-100 dark:border-slate-800 flex justify-between items-center">
            <span className="font-bold text-sm text-gray-900 dark:text-slate-100">Tema</span>
            <button onClick={toggleTheme} className="px-3 py-1 rounded-full text-xs font-bold border border-gray-200 dark:border-slate-700">
              {theme === 'dark' ? 'Oscuro' : 'Claro'}
            </button>
         </div>


         <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-100 dark:border-slate-800 flex justify-between items-center">


            <span className="font-bold text-sm text-gray-900 dark:text-slate-100">Notificaciones push</span>


            <div className="w-10 h-6 bg-black rounded-full relative"><div className="absolute right-1 top-1 w-4 h-4 bg-white dark:bg-slate-900 rounded-full"></div></div>


         </div>


         <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-100 dark:border-slate-800 flex justify-between items-center">


            <span className="font-bold text-sm text-gray-900 dark:text-slate-100">Recibir promociones</span>


            <div className="w-10 h-6 bg-black rounded-full relative"><div className="absolute right-1 top-1 w-4 h-4 bg-white dark:bg-slate-900 rounded-full"></div></div>


         </div>


         <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-100 dark:border-slate-800">


            <span className="font-bold text-sm block mb-2 text-gray-900 dark:text-slate-100">Idioma</span>


            <select className="w-full bg-gray-100 dark:bg-slate-800 p-2 rounded-lg text-sm font-bold text-gray-900 dark:text-slate-100">


               <option>Español (Ecuador)</option>


               <option>English</option>


            </select>


         </div>


      </div>


    </div>


  );





  return (


    <div className="absolute inset-0 z-[60] bg-black/50 backdrop-blur-sm flex justify-end animate-fade-in">


      <div className="w-full md:w-[350px] h-full bg-white dark:bg-slate-900 shadow-2xl flex flex-col animate-slide-left">


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


    className="w-full px-6 py-4 flex items-center justify-between transition border-b border-gray-50 last:border-0 group even:bg-slate-50/60 dark:even:bg-slate-900/40 hover:bg-slate-100 dark:hover:bg-slate-900/60"


  >


    <div className="flex items-center gap-4 text-gray-700 dark:text-slate-300 group-hover:text-slate-900 dark:text-slate-100">


      <div className="text-gray-400 dark:text-slate-500 group-hover:text-slate-900 dark:text-slate-100 transition">{icon}</div>


      <span className="font-medium text-sm text-slate-900 dark:text-slate-100">{label}</span>


    </div>


    <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-800 dark:text-slate-100" />


  </button>


);





