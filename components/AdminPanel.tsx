import React, { useState, useEffect, useRef } from 'react';


import L from 'leaflet';


import { 


  LayoutDashboard, Users, Car, Map as MapIcon, 

  DollarSign, Settings, Headphones, BarChart3, 

  Bell, LogOut, X, 

  Eye, 

  TrendingUp, 

  Shield, 

  Ban, Trash2, CheckCircle, Lock,

  Building, Briefcase, RefreshCw, Edit, Power, Plus,

  Percent, User as UserIcon, UserCog, Menu, Layers

} from 'lucide-react';

import { 


  User, UserRole, AccountStatus, TripHistoryItem, Driver, 


  PricingConfig, SupportTicket, Cooperative, Company, CarType


} from '../types';


import { NotificationsModal } from './NotificationsModal';

import { AdminFamilyModules } from './admin/AdminFamilyModules';

import { CompanyService } from '../src/services/companyService';


import { CooperativeService } from '../src/services/cooperativeService';


import { UserService } from '../src/services/userService';


import { SupportService } from '../src/services/supportService';


import { HelpCenterModal } from './HelpCenterModal'; 





interface AdminPanelProps {

  users: User[];

  tripHistory: TripHistoryItem[];

  availableDrivers: Driver[];

  onApprove: (userId: string) => void;

  onReject: (userId: string) => void;

  onToggleStatus: (userId: string) => void;

  onDeleteUser: (userId: string) => void;

  onLogout: () => void;

  onChangePassword: () => void;

  onNotify: (message: string) => void;

  currentUser: User; 

  cooperatives: Cooperative[]; 

}




const DEFAULT_PRICING: PricingConfig = {


  baseRate: 1.50,


  perKm: 0.35,


  perMin: 0.10,


  minFare: 2.00,


  commissionPct: 20,


  bookingFee: 0.25


};





type AdminView = 'MODULES' | 'DASHBOARD' | 'RIDERS' | 'DRIVERS' | 'ADMINS' | 'TRIPS' | 'FINANCE' | 'CONFIG' | 'SUPPORT' | 'ANALYTICS' | 'ROLES' | 'MARKETING' | 'CORPORATE' | 'COOPERATIVES';




export const AdminPanel: React.FC<AdminPanelProps> = ({ 

  users, 

  tripHistory, 

  availableDrivers = [], 

  onApprove, 

  onReject, 

  onToggleStatus, 

  onDeleteUser, 

  onLogout,

  onChangePassword,

  onNotify,

  currentUser,

  cooperatives

}) => {

  const [activeView, setActiveView] = useState<AdminView>('MODULES');

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);


  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);


  


  // SUPERADMIN FILTER


  const [selectedCoopFilter, setSelectedCoopFilter] = useState<string | 'ALL'>(


     currentUser.role === UserRole.SUPERADMIN ? 'ALL' : (currentUser.cooperativeId || 'ALL')


  );





  const currentAdminCoop = cooperatives.find(c => c.id === currentUser.cooperativeId);


  // Removed unused selectedUser


  const [companies, setCompanies] = useState<Company[]>([]);


  const [tickets, setTickets] = useState<SupportTicket[]>([]);


  const [ticketFilter, setTicketFilter] = useState<'ALL' | 'OPEN' | 'CLOSED'>('ALL');


  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);


  const [isCreateTicketOpen, setIsCreateTicketOpen] = useState(false);


  const [globalConfig, setGlobalConfig] = useState<PricingConfig>(DEFAULT_PRICING);


  const [adminPricing, setAdminPricing] = useState<PricingConfig>(DEFAULT_PRICING);


  


  // MODAL STATES


  const [isCreateCoopOpen, setIsCreateCoopOpen] = useState(false);


  const [isTransferUserOpen, setIsTransferUserOpen] = useState(false);


  const [userToTransfer, setUserToTransfer] = useState<User | null>(null);


  const [editingCoop, setEditingCoop] = useState<Cooperative | null>(null);


  const [viewingAdminsFor, setViewingAdminsFor] = useState<Cooperative | null>(null); 


  const [isCreateCompanyOpen, setIsCreateCompanyOpen] = useState(false);


  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);





  // FORMS


  const [editCoopForm, setEditCoopForm] = useState({


     name: '', baseRate: '', perKm: '', perMin: '', minFare: '', commission: '', bookingFee: ''


  });


  const [editingUser, setEditingUser] = useState<User | null>(null);


  const [editUserForm, setEditUserForm] = useState({ name: '', email: '', phone: '', cedula: '' });


  const [editingCompany, setEditingCompany] = useState<Company | null>(null);


  const [editCompanyForm, setEditCompanyForm] = useState({


     name: '', creditLimit: '', contactName: '', hasCustomPricing: false,


     baseRate: '', perKm: '', perMin: '', minFare: ''


  });


  const [newCompanyForm, setNewCompanyForm] = useState({


     name: '', ruc: '', email: '', address: '', creditLimit: '', contactName: '', cooperativeId: ''


  });


  


  // Unified User Creation Form


  const [newUserForm, setNewUserForm] = useState({


     name: '', email: '', phone: '', cedula: '', 


     role: UserRole.RIDER, 


     cooperativeId: ''


  });


  


  // Driver Specific Form in Admin


  const [newDriverForm, setNewDriverForm] = useState({


     plate: '', carModel: '', carYear: '', carColor: '#000000', carType: CarType.SEDAN


  });





  const [newCoopName, setNewCoopName] = useState('');


  const [newCoopCode, setNewCoopCode] = useState('');


  const [targetCoopId, setTargetCoopId] = useState('');


  


  const dashboardMapRef = useRef<HTMLDivElement>(null);


  const mapInstanceRef = useRef<L.Map | null>(null);


  // Corrected Type: CircleMarker extends Layer, not Marker directly in TypeScript strictness sometimes, but both are Layers.


  const markersRef = useRef<L.Layer[]>([]); 


  const resizeObserverRef = useRef<ResizeObserver | null>(null);





  useEffect(() => {


    if (currentAdminCoop) {


      setAdminPricing(currentAdminCoop.pricing);


    }


  }, [currentAdminCoop, activeView]);





  const filteredUsers = users.filter(u => {


     if (u.role === UserRole.DRIVER) return true; 


     if (selectedCoopFilter === 'ALL') return true;


     return u.cooperativeId === selectedCoopFilter;


  });





  const filteredHistory = tripHistory.filter(t => {


     if (selectedCoopFilter === 'ALL') return true;


     return t.cooperativeId === selectedCoopFilter;


  });





  const activeDrivers = users.filter(u => u.role === UserRole.DRIVER && u.status === AccountStatus.ACTIVE).length;


  const onlineDrivers = availableDrivers.length; 


  const revenueTotal = filteredHistory.reduce((acc, t) => acc + t.price, 0);





  useEffect(() => {


     const unsub = CompanyService.subscribeToCompanies(selectedCoopFilter, (data) => setCompanies(data));


     return () => unsub();


  }, [selectedCoopFilter]);





  useEffect(() => {


     const unsub = SupportService.subscribeToTickets(currentUser, selectedCoopFilter, (data) => setTickets(data));


     return () => unsub();


  }, [currentUser, selectedCoopFilter]);





  useEffect(() => {


    return () => {


      if (resizeObserverRef.current) resizeObserverRef.current.disconnect();


      if (mapInstanceRef.current) { mapInstanceRef.current.off(); mapInstanceRef.current.remove(); mapInstanceRef.current = null; markersRef.current = []; }


    };


  }, [activeView]);





  useEffect(() => {


    if (activeView === 'DASHBOARD' && dashboardMapRef.current) {


      if (!mapInstanceRef.current) {


        const map = L.map(dashboardMapRef.current, { zoomControl: false }).setView([-2.1894, -79.8891], 12);


        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', { attribution: '&copy; OpenStreetMap', maxZoom: 19 }).addTo(map);


        mapInstanceRef.current = map;


        resizeObserverRef.current = new ResizeObserver(() => { map.invalidateSize(); });


        resizeObserverRef.current.observe(dashboardMapRef.current);


      }


      if (mapInstanceRef.current) {


        const map = mapInstanceRef.current;


        markersRef.current.forEach(m => { try { m.remove(); } catch(e) {} });


        markersRef.current = [];


        availableDrivers.forEach(d => {


          const color = Math.random() > 0.7 ? '#ef4444' : '#22c55e';


          const marker = L.circleMarker([d.coords.lat, d.coords.lng], { radius: 6, fillColor: color, color: '#fff', weight: 2, fillOpacity: 1 }).addTo(map);


          markersRef.current.push(marker);


        });


      }


    }


  }, [activeView, availableDrivers]);





  const handleResetCredit = async (companyId: string) => {


     if (confirm("Confirmar recepción de pago y reiniciar crédito del mes")) {


        await CompanyService.processMonthlyPayment(companyId);


        alert("Pago registrado y crédito reiniciado.");


     }


  };





  const handleCreateCoop = async () => {


     if (!newCoopName || !newCoopCode) return;


     try {


        await CooperativeService.createCooperative(newCoopName, newCoopCode, DEFAULT_PRICING);


        setIsCreateCoopOpen(false);


        setNewCoopName('');


        setNewCoopCode('');


        alert("Cooperativa Creada Exitosamente");


     } catch (e) {


        alert("Error al crear cooperativa");


     }


  };





  const handleCreateCompany = async () => {


     const assignedCoopId = currentUser.role === UserRole.SUPERADMIN ? newCompanyForm.cooperativeId : currentUser.cooperativeId;


     


     if (!newCompanyForm.name || !newCompanyForm.ruc || !assignedCoopId) {


        alert("Por favor complete nombre, RUC y cooperativa.");


        return;


     }





     try {


        await CompanyService.createCompany({


           name: newCompanyForm.name,


           ruc: newCompanyForm.ruc,


           email: newCompanyForm.email,


           address: newCompanyForm.address,


           creditLimit: parseFloat(newCompanyForm.creditLimit) || 0,


           contactName: newCompanyForm.contactName,


           cooperativeId: assignedCoopId,


           usedCredit: 0,


           status: 'ACTIVE',


           billingCycle: 'MONTHLY'


        });


        setIsCreateCompanyOpen(false);


        setNewCompanyForm({ name: '', ruc: '', email: '', address: '', creditLimit: '', contactName: '', cooperativeId: '' });


        alert("Empresa creada exitosamente");


     } catch (e) {


        alert("Error al crear empresa");


     }


  };





  // Generalized User Creation Handler


  const handleCreateUser = async () => {


      // Determine cooperative


      let targetCoop = newUserForm.cooperativeId;


      if (currentUser.role !== UserRole.SUPERADMIN) {


          targetCoop = currentUser.cooperativeId || 'coop-global';


      }





      if (!newUserForm.name || !newUserForm.email || !targetCoop) {


          alert("Por favor complete nombre, email y cooperativa.");


          return;


      }


      


      // Driver Specific Validations


      let driverDetails = undefined;


      if (newUserForm.role === UserRole.DRIVER) {


         if (!newDriverForm.plate || !newDriverForm.carModel) {


            alert("Para conductores, la Placa y Modelo son obligatorios.");


            return;


         }


         driverDetails = {


            ...newDriverForm,


            licenseNumber: newUserForm.cedula,


            insurancePolicy: 'N/A'


         };


      }





      try {


          await UserService.createUser({


              name: newUserForm.name,


              email: newUserForm.email,


              phone: newUserForm.phone,


              cedula: newUserForm.cedula,


              role: newUserForm.role,


              cooperativeId: targetCoop,


              driverDetails: driverDetails


          });


          setIsCreateUserModalOpen(false);


          setNewUserForm({ name: '', email: '', phone: '', cedula: '', role: UserRole.RIDER, cooperativeId: '' });


          setNewDriverForm({ plate: '', carModel: '', carYear: '', carColor: '#000000', carType: CarType.SEDAN });


          alert("Usuario creado exitosamente. El perfil esta listo para ser reclamado.");


      } catch (e) {


          alert("Error al crear usuario.");


      }


  };





  const handleTransferUser = async () => {


     if (!userToTransfer || !targetCoopId) return;


     try {


        await UserService.updateUserCooperative(userToTransfer.id, targetCoopId);


        setIsTransferUserOpen(false);


        setUserToTransfer(null);


        alert(`Usuario movido a ${cooperatives.find(c=>c.id === targetCoopId)?.name || "N/A"}`);


     } catch (e) {


        alert("Error al transferir usuario");


     }


  };





  const handleDeleteUserClick = async (userId: string) => {


     if (confirm("¿ESTÁS SEGURO Esta acción eliminará permanentemente al usuario y no se puede deshacer.")) {


        if (onDeleteUser) onDeleteUser(userId);


     }


  };





  const handleSaveGlobalConfig = () => {


     alert("Configuración global actualizada. Esta tarifa aplicará a usuarios sin cooperativa.");


  };





  const handleSaveAdminPricing = async () => {


    if (!currentAdminCoop) return;


    try {


      await CooperativeService.updateCooperative(currentAdminCoop.id, {


        pricing: adminPricing


      });


      alert("Tarifas de la cooperativa actualizadas correctamente.");


    } catch (e) {


      alert("Error al guardar tarifas.");


    }


  };





  const handleResolveTicket = async (ticketId: string) => {


     const ticket = tickets.find(t => t.id === ticketId);


     if (!ticket) return;

     const newStatus = ticket.status === 'CLOSED' ? 'IN_PROGRESS' : 'CLOSED';


     await SupportService.updateTicketStatus(ticketId, newStatus);


     if (selectedTicket?.id === ticketId) {


         setSelectedTicket(prev => prev ? {...prev, status: newStatus} : null);


     }


  };





  const handleEditCoopClick = (coop: Cooperative) => {


      setEditingCoop(coop);


      setEditCoopForm({


          name: coop.name,


          baseRate: coop.pricing.baseRate.toString(),


          perKm: coop.pricing.perKm.toString(),


          perMin: coop.pricing.perMin.toString(),


          minFare: coop.pricing.minFare.toString(),


          commission: coop.pricing.commissionPct.toString(),


          bookingFee: coop.pricing.bookingFee.toString()


      });


  };





  const handleSaveCoopChanges = async () => {


      if (!editingCoop) return;


      try {


          const updatedPricing: PricingConfig = {


              baseRate: parseFloat(editCoopForm.baseRate) || 0,


              perKm: parseFloat(editCoopForm.perKm) || 0,


              perMin: parseFloat(editCoopForm.perMin) || 0,


              minFare: parseFloat(editCoopForm.minFare) || 0,


              commissionPct: parseFloat(editCoopForm.commission) || 0,


              bookingFee: parseFloat(editCoopForm.bookingFee) || 0


          };





          await CooperativeService.updateCooperative(editingCoop.id, {


              name: editCoopForm.name,


              pricing: updatedPricing


          });


          setEditingCoop(null);


          alert("Cooperativa actualizada correctamente");


      } catch (e) {


          alert("Error al actualizar cooperativa");


      }


  };





  const handleToggleCoopStatus = async (coop: Cooperative) => {


      if (confirm(`?Estás seguro de ${coop.status === 'ACTIVE' ? 'DESACTIVAR' : 'ACTIVAR'} esta cooperativa`)) {


          await CooperativeService.toggleStatus(coop.id, coop.status);


      }


  };





  const handleEditUserClick = (user: User) => {


    setEditingUser(user);


    setEditUserForm({


      name: user.name,


      email: user.email,


      phone: user.phone || '',


      cedula: user.cedula || ''


    });


  };





  const handleSaveUserChanges = async () => {


    if (!editingUser) return;


    try {


      await UserService.updateUserDetails(editingUser.id, {


        name: editUserForm.name,


        phone: editUserForm.phone,


        cedula: editUserForm.cedula


      });


      setEditingUser(null);


      alert("Usuario actualizado");


    } catch (e) {


      alert("Error al actualizar usuario");


    }


  };





  const handleEditCompanyClick = (comp: Company) => {


    setEditingCompany(comp);


    setEditCompanyForm({


       name: comp.name,


       creditLimit: comp.creditLimit.toString(),


       contactName: comp.contactName || '',


       hasCustomPricing: !!comp.customPricing,


       baseRate: comp.customPricing?.baseRate?.toString() || '',


       perKm: comp.customPricing?.perKm?.toString() || '',


       perMin: comp.customPricing?.perMin?.toString() || '',


       minFare: comp.customPricing?.minFare?.toString() || ''


    });


  };





  const handleSaveCompanyChanges = async () => {


     if (!editingCompany) return;


     try {


       let customPricing = undefined;


       if (editCompanyForm.hasCustomPricing) {


           customPricing = {


               baseRate: parseFloat(editCompanyForm.baseRate) || 0,


               perKm: parseFloat(editCompanyForm.perKm) || 0,


               perMin: parseFloat(editCompanyForm.perMin) || 0,


               minFare: parseFloat(editCompanyForm.minFare) || 0,


               commissionPct: DEFAULT_PRICING.commissionPct, 


               bookingFee: DEFAULT_PRICING.bookingFee


           };


       }


       await CompanyService.updateCompany(editingCompany.id, {


          name: editCompanyForm.name,


          creditLimit: parseFloat(editCompanyForm.creditLimit),


          contactName: editCompanyForm.contactName,


          customPricing: customPricing


       });


       setEditingCompany(null);


       alert("Empresa actualizada");


     } catch (e) {


       alert("Error al actualizar empresa");


     }


  };





  // Trigger to open modal with pre-set role


  const openCreateUserModal = (role: UserRole) => {


     setNewUserForm(prev => ({ ...prev, role }));


     setIsCreateUserModalOpen(true);


  };





  const renderDashboard = () => (


    <div className="space-y-6 animate-fade-in">


       {/* Stats Grid */}


       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">


          <StatCard title="Clientes" value={filteredUsers.filter(u=>u.role===UserRole.RIDER).length} icon={<Users className="text-blue-600"/>} color="bg-blue-50" />


          <StatCard title="Conductores" value={activeDrivers} sub={`${onlineDrivers} En linea`} icon={<Car className="text-orange-600"/>} color="bg-orange-50" />


          <StatCard title="Ingresos" value={`$${revenueTotal.toFixed(2)}`} sub="Total Bruto" icon={<DollarSign className="text-green-600"/>} color="bg-green-50" />


          <StatCard title="Viajes" value={filteredHistory.length} icon={<MapIcon className="text-purple-600"/>} color="bg-purple-50" />


       </div>


       {/* Map */}


       <div className="bg-white dark:bg-slate-900 dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 dark:border-slate-800 overflow-hidden h-96 relative">


          <div ref={dashboardMapRef} className="w-full h-full z-0" />


          <div className="absolute top-4 right-4 bg-white dark:bg-slate-900 dark:bg-slate-900/90 p-3 rounded-lg shadow-md z-10">


             <h4 className="text-xs font-bold uppercase text-gray-500 dark:text-slate-400 dark:text-slate-400 mb-2">Estado de Flota</h4>


             <div className="flex items-center gap-2 mb-1"><div className="w-3 h-3 rounded-full bg-green-500"></div><span className="text-xs font-bold">Disponible</span></div>


             <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500"></div><span className="text-xs font-bold">Ocupado</span></div>


          </div>


       </div>


    </div>


  );





  const renderUsers = (role: UserRole) => {


    const roleUsers = filteredUsers.filter(u => u.role === role);


    const pendingUsers = roleUsers.filter(u => u.status === AccountStatus.PENDING);


    const otherUsers = roleUsers.filter(u => u.status !== AccountStatus.PENDING);


    


    // Sort pending first


    const displayList = [...pendingUsers, ...otherUsers];





    const title = role === UserRole.RIDER ? 'Clientes' : role === UserRole.DRIVER ? 'Conductores' : 'Administradores';


    const Icon = role === UserRole.RIDER ? Users : role === UserRole.DRIVER ? Car : UserCog;





    return (


      <div className="bg-white dark:bg-slate-900 dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 dark:border-slate-800 overflow-hidden animate-fade-in">


        <div className="p-4 border-b border-gray-100 dark:border-slate-800 dark:border-slate-800 flex justify-between items-center bg-gray-50 dark:bg-slate-800 dark:bg-slate-800">


           <h3 className="font-bold text-gray-700 dark:text-slate-300 dark:text-slate-300 flex items-center gap-2">


              <Icon size={18} /> Directorio de {title}


           </h3>


           <div className="flex gap-2">


               <button onClick={() => openCreateUserModal(role)} className="bg-slate-900 dark:bg-sky-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-slate-900/90 dark:hover:bg-sky-500/90">


                  <Plus size={14} /> Nuevo {role === UserRole.DRIVER ? 'Conductor' : 'Usuario'}


               </button>


               <span className="text-xs font-bold bg-white dark:bg-slate-900 dark:bg-slate-900 border px-2 py-1 rounded text-gray-500 dark:text-slate-400 dark:text-slate-400 self-center">{displayList.length} Registros</span>


           </div>


        </div>


        <div className="overflow-x-auto">


          <table className="w-full text-left text-sm">


            <thead className="bg-gray-100 dark:bg-slate-800 dark:bg-slate-800 text-gray-500 dark:text-slate-400 dark:text-slate-400 font-bold uppercase text-xs">


              <tr>


                <th className="px-6 py-4">Usuario</th>


                <th className="px-6 py-4">Estado</th>


                <th className="px-6 py-4">Cooperativa</th>


                <th className="px-6 py-4 text-center">Acciones</th>


              </tr>


            </thead>


            <tbody className="divide-y divide-gray-100">


               {displayList.map(u => (


                  <tr

                    key={u.id}

                    className={`transition-colors ${

                      u.status === AccountStatus.PENDING
                          ? 'bg-amber-50/70 dark:bg-amber-500/10'
                          : 'even:bg-slate-50/60 dark:even:bg-slate-900/40'

                    } hover:bg-slate-100 dark:hover:bg-slate-900/60`}

                  >

                     <td className="px-6 py-4">


                        <div className="flex items-center gap-3">


                           <img src={u.photoUrl} className="w-10 h-10 rounded-full bg-gray-200 object-cover" />


                           <div>


                              <p className="font-bold text-gray-900 dark:text-slate-100 dark:text-slate-100">{u.name}</p>


                              <p className="text-xs text-gray-500 dark:text-slate-400 dark:text-slate-400">{u.email}</p>


                              {u.phone && <p className="text-xs text-gray-400 dark:text-slate-500 dark:text-slate-500">{u.phone}</p>}


                           </div>


                        </div>


                     </td>


                     <td className="px-6 py-4">


                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${


                           u.status === AccountStatus.ACTIVE ? 'bg-green-100 text-green-700 border-green-200' :


                           u.status === AccountStatus.PENDING ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :


                           'bg-red-100 text-red-700 border-red-200'


                        }`}>


                           {u.status}


                        </span>


                     </td>


                     <td className="px-6 py-4">


                        <span className="text-xs font-mono bg-gray-100 dark:bg-slate-800 dark:bg-slate-800 px-2 py-1 rounded text-gray-600 dark:text-slate-300 dark:text-slate-300">


                           {cooperatives.find(c => c.id === u.cooperativeId)?.code || 'GLOBAL'}


                        </span>


                     </td>


                     <td className="px-6 py-4">


                        <div className="flex justify-center gap-2">


                           {u.status === AccountStatus.PENDING ? (


                              <>


                                 <button onClick={() => onApprove(u.id)} className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200" title="Aprobar"><CheckCircle size={16}/></button>


                                 <button onClick={() => onReject(u.id)} className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200" title="Rechazar"><X size={16}/></button>


                              </>


                           ) : (


                              <>


                                 <button onClick={() => handleEditUserClick(u)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100" title="Editar"><Edit size={16}/></button>


                                 {/* CHANGE COOPERATIVE BUTTON FOR RIDERS OR ADMINS (SUPERADMIN ONLY) */}


                                 {currentUser.role === UserRole.SUPERADMIN && (role === UserRole.RIDER || role === UserRole.ADMIN) && (


                                     <button onClick={() => { setUserToTransfer(u); setIsTransferUserOpen(true); }} className="p-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100" title="Cambiar Cooperativa"><RefreshCw size={16}/></button>


                                 )}


                                 {onToggleStatus && (


                                   <button
                                     onClick={() => onToggleStatus(u.id)}
                                     className={`p-2 rounded-lg ${u.status === 'ACTIVE' ? 'bg-gray-100 dark:bg-slate-800 dark:bg-slate-800 text-gray-500 dark:text-slate-400 dark:text-slate-400 hover:bg-gray-200' : 'bg-green-100 text-green-600'}`}
                                     title={u.status === 'ACTIVE' ? 'Bloquear' : 'Activar'}
                                   >
                                     {u.status === 'ACTIVE' ? <Ban size={16}/> : <CheckCircle size={16}/>}
                                   </button>


                                 )}


                                  <button onClick={() => handleDeleteUserClick(u.id)} className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100" title="Eliminar"><Trash2 size={16}/></button>


                              </>


                           )}


                        </div>


                     </td>


                  </tr>


               ))}


            </tbody>


          </table>


        </div>


      </div>


    );


  };





  const renderTrips = () => (


      <div className="bg-white dark:bg-slate-900 dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 dark:border-slate-800 overflow-hidden animate-fade-in">


        <div className="p-4 border-b border-gray-100 dark:border-slate-800 dark:border-slate-800 bg-gray-50 dark:bg-slate-800 dark:bg-slate-800 font-bold text-gray-700 dark:text-slate-300 dark:text-slate-300 flex gap-2 items-center">


            <MapIcon size={18}/> Historial de Viajes


        </div>


        <div className="overflow-x-auto">


            <table className="w-full text-left text-sm">


                <thead className="bg-gray-100 dark:bg-slate-800 dark:bg-slate-800 text-gray-500 dark:text-slate-400 dark:text-slate-400 font-bold uppercase text-xs">


                    <tr><th className="px-6 py-4">Fecha</th><th className="px-6 py-4">Ruta</th><th className="px-6 py-4">Pasajero</th><th className="px-6 py-4">Precio</th><th className="px-6 py-4">Estado</th></tr>


                </thead>


                <tbody className="divide-y divide-gray-100">


                    {filteredHistory.map(trip => (


                        <tr key={trip.id} className="transition-colors even:bg-slate-50/60 dark:even:bg-slate-900/40 hover:bg-slate-100 dark:hover:bg-slate-900/60">

                            <td className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-slate-400 dark:text-slate-400">{new Date(trip.date).toLocaleDateString()}</td>


                            <td className="px-6 py-4">


                                <div className="text-xs">


                                    <p className="font-bold text-green-700">De: {trip.pickupAddress}</p>


                                    <p className="font-bold text-red-700">A: {trip.destinationAddress}</p>


                                </div>


                            </td>


                            <td className="px-6 py-4">{trip.counterpartName}</td>


                            <td className="px-6 py-4 font-black">{trip.currency}{trip.price.toFixed(2)}</td>


                            <td className="px-6 py-4">


                                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${trip.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{trip.status}</span>


                            </td>


                        </tr>


                    ))}


                </tbody>


            </table>


        </div>


      </div>


  );





  const renderCooperatives = () => {


    if (currentUser.role !== UserRole.SUPERADMIN) return <div className="p-10 text-center text-red-500 font-bold">Acceso Denegado</div>;





    return (


        <div className="space-y-6 animate-fade-in">


            <div className="flex justify-between items-center">


                <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100 dark:text-slate-100 flex items-center gap-2"><Building /> Cooperativas (Tenants)</h2>


                <button onClick={() => setIsCreateCoopOpen(true)} className="bg-slate-900 dark:bg-sky-500 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-900/90 dark:hover:bg-sky-500/90"><Plus size={18} /> Nueva Cooperativa</button>


            </div>


            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">


                {cooperatives.map(coop => {


                   const userCount = users.filter(u => u.cooperativeId === coop.id).length;


                   return (


                      <div key={coop.id} className={`bg-white dark:bg-slate-900 dark:bg-slate-900 rounded-2xl p-6 shadow-sm border-2 transition ${coop.status === 'ACTIVE' ? 'border-transparent' : 'border-red-200 bg-red-50'}`}>


                          <div className="flex justify-between items-start mb-4">


                              <div className="w-12 h-12 bg-gray-100 dark:bg-slate-800 dark:bg-slate-800 rounded-xl flex items-center justify-center font-black text-xl text-gray-400 dark:text-slate-500 dark:text-slate-500">


                                  {coop.code.substring(0, 2)}


                              </div>


                              <div className="flex gap-2">


                                  <button onClick={() => setViewingAdminsFor(coop)} className="p-2 hover:bg-purple-100 rounded-lg text-purple-600" title="Gestionar Admins"><Shield size={18}/></button>


                                  <button onClick={() => handleEditCoopClick(coop)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-900/60 rounded-lg text-gray-500 dark:text-slate-400"><Settings size={18}/></button>

                                  <button onClick={() => handleToggleCoopStatus(coop)} className={`p-2 rounded-lg ${coop.status === 'ACTIVE' ? 'text-green-500 hover:bg-green-50' : 'text-red-500 hover:bg-red-100'}`}><Power size={18}/></button>


                              </div>


                          </div>


                          <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 dark:text-slate-100 mb-1">{coop.name}</h3>


                          <div className="flex items-center gap-2 mb-4">


                              <span className="bg-gray-100 dark:bg-slate-800 dark:bg-slate-800 text-gray-600 dark:text-slate-300 dark:text-slate-300 px-2 py-1 rounded text-xs font-mono font-bold">{coop.code}</span>


                              <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${coop.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{coop.status}</span>


                          </div>


                          <div className="grid grid-cols-2 gap-4 border-t border-gray-100 dark:border-slate-800 dark:border-slate-800 pt-4">


                              <div><p className="text-xs text-gray-400 dark:text-slate-500 dark:text-slate-500 uppercase font-bold">Usuarios</p><p className="font-bold text-lg">{userCount}</p></div>


                              <div><p className="text-xs text-gray-400 dark:text-slate-500 dark:text-slate-500 uppercase font-bold">Comisión</p><p className="font-bold text-lg">{coop.pricing.commissionPct}%</p></div>


                          </div>


                      </div>


                   );


                })}


            </div>


        </div>


    );


  };





  const renderCorporate = () => (


      <div className="space-y-6 animate-fade-in">


         <div className="flex justify-between items-center">


             <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100 dark:text-slate-100 flex items-center gap-2"><Briefcase /> Empresas (B2B)</h2>


             <button onClick={() => setIsCreateCompanyOpen(true)} className="bg-slate-900 dark:bg-sky-500 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-900/90 dark:hover:bg-sky-500/90"><Plus size={18} /> Nueva Empresa</button>


         </div>


         <div className="bg-white dark:bg-slate-900 dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 dark:border-slate-800 overflow-hidden">


             <table className="w-full text-left text-sm">


                 <thead className="bg-gray-100 dark:bg-slate-800 dark:bg-slate-800 text-gray-500 dark:text-slate-400 dark:text-slate-400 font-bold uppercase text-xs">


                     <tr>


                        <th className="px-6 py-4">Empresa</th>


                        {currentUser.role === UserRole.SUPERADMIN && <th className="px-6 py-4">Cooperativa</th>}


                        <th className="px-6 py-4">RUC</th>


                        <th className="px-6 py-4">Crédito</th>


                        <th className="px-6 py-4">Consumo</th>


                        <th className="px-6 py-4">Estado</th>


                        <th className="px-6 py-4 text-center">Acciones</th>


                     </tr>


                 </thead>


                 <tbody className="divide-y divide-gray-100">


                     {companies.map(comp => (


                         <tr key={comp.id}>


                             <td className="px-6 py-4 font-bold">{comp.name}</td>


                             {currentUser.role === UserRole.SUPERADMIN && (


                                <td className="px-6 py-4 font-mono text-xs">


                                   {cooperatives.find(c => c.id === comp.cooperativeId)?.name || 'N/A'}


                                </td>


                             )}


                             <td className="px-6 py-4 font-mono text-xs">{comp.ruc}</td>


                             <td className="px-6 py-4">${comp.creditLimit.toFixed(2)}</td>


                             <td className="px-6 py-4">


                                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden mb-1">


                                    <div className={`h-full ${comp.usedCredit > comp.creditLimit * 0.9 ? 'bg-red-500' : 'bg-blue-500'}`} style={{width: `${Math.min((comp.usedCredit/comp.creditLimit)*100, 100)}%`}}></div>


                                </div>


                                <span className="text-xs font-bold">${comp.usedCredit.toFixed(2)}</span>


                             </td>


                             <td className="px-6 py-4"><span className="bg-green-100 text-green-700 px-2 py-1 rounded text-[10px] font-bold">{comp.status}</span></td>


                             <td className="px-6 py-4 flex justify-center gap-2">


                                <button onClick={() => handleEditCompanyClick(comp)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-900/60 rounded text-gray-500 dark:text-slate-400" title="Editar"><Edit size={16}/></button>

                                <button onClick={() => handleResetCredit(comp.id)} className="p-2 hover:bg-green-50 rounded text-green-600" title="Registrar Pago / Reiniciar"><RefreshCw size={16}/></button>


                             </td>


                         </tr>


                     ))}


                 </tbody>


             </table>


         </div>


      </div>


  );





  const renderConfig = () => {


    // Determine which config to edit


    const isSuper = currentUser.role === UserRole.SUPERADMIN;


    


    // If SuperAdmin, showing Global Config by default in this view


    // If Admin, showing their own Coop Config


    const configToEdit = isSuper ? globalConfig : adminPricing;


    const setConfig = isSuper ? setGlobalConfig : setAdminPricing;


    const saveHandler = isSuper ? handleSaveGlobalConfig : handleSaveAdminPricing;


    const title = isSuper ? "Configuración global de tarifas" : `Tarifas: ${currentAdminCoop?.name || "-"}`;





    return (


      <div className="max-w-4xl mx-auto animate-fade-in">


        <div className="flex justify-between items-center mb-6">


           <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100 dark:text-slate-100 flex items-center gap-2"><Settings /> {title}</h2>


           <button onClick={saveHandler} className="bg-slate-900 dark:bg-sky-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:bg-slate-900/90 dark:hover:bg-sky-500/90"><Settings size={18}/> Guardar Cambios</button>


        </div>


        


        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


           <div className="bg-white dark:bg-slate-900 dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 dark:border-slate-800">


              <h3 className="font-bold text-gray-700 dark:text-slate-300 dark:text-slate-300 mb-4 flex items-center gap-2"><DollarSign size={18}/> Tarifas Base</h3>


              <div className="space-y-4">


                 <div>


                    <label className="text-xs font-bold text-gray-500 dark:text-slate-400 dark:text-slate-400 uppercase">Tarifa de Arranque ($)</label>


                    <input type="number" step="0.10" value={configToEdit.baseRate} onChange={e=>setConfig({...configToEdit, baseRate: parseFloat(e.target.value)})} className="w-full mt-1 p-3 bg-white dark:bg-slate-900 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 dark:border-slate-800 rounded-xl font-bold" />


                 </div>


                 <div>


                    <label className="text-xs font-bold text-gray-500 dark:text-slate-400 dark:text-slate-400 uppercase">Costo por Km ($)</label>


                    <input type="number" step="0.01" value={configToEdit.perKm} onChange={e=>setConfig({...configToEdit, perKm: parseFloat(e.target.value)})} className="w-full mt-1 p-3 bg-white dark:bg-slate-900 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 dark:border-slate-800 rounded-xl font-bold" />


                 </div>


                 <div>


                    <label className="text-xs font-bold text-gray-500 dark:text-slate-400 dark:text-slate-400 uppercase">Costo por Minuto ($)</label>


                    <input type="number" step="0.01" value={configToEdit.perMin} onChange={e=>setConfig({...configToEdit, perMin: parseFloat(e.target.value)})} className="w-full mt-1 p-3 bg-white dark:bg-slate-900 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 dark:border-slate-800 rounded-xl font-bold" />


                 </div>


              </div>


           </div>





           <div className="bg-white dark:bg-slate-900 dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 dark:border-slate-800">


              <h3 className="font-bold text-gray-700 dark:text-slate-300 dark:text-slate-300 mb-4 flex items-center gap-2"><Percent size={18}/> Comisiones y límites</h3>


              <div className="space-y-4">


                 <div>


                    <label className="text-xs font-bold text-gray-500 dark:text-slate-400 dark:text-slate-400 uppercase">Tarifa mínima de viaje ($)</label>


                    <input type="number" step="0.50" value={configToEdit.minFare} onChange={e=>setConfig({...configToEdit, minFare: parseFloat(e.target.value)})} className="w-full mt-1 p-3 bg-white dark:bg-slate-900 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 dark:border-slate-800 rounded-xl font-bold" />


                 </div>


                 <div>


                    <label className="text-xs font-bold text-gray-500 dark:text-slate-400 dark:text-slate-400 uppercase">Tasa de reserva / tecnológica ($)</label>


                    <input type="number" step="0.05" value={configToEdit.bookingFee} onChange={e=>setConfig({...configToEdit, bookingFee: parseFloat(e.target.value)})} className="w-full mt-1 p-3 bg-white dark:bg-slate-900 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 dark:border-slate-800 rounded-xl font-bold" />


                 </div>


                 <div>


                    <label className="text-xs font-bold text-gray-500 dark:text-slate-400 dark:text-slate-400 uppercase">Comisión plataforma (%)</label>


                    <input type="number" step="1" value={configToEdit.commissionPct} onChange={e=>setConfig({...configToEdit, commissionPct: parseFloat(e.target.value)})} className="w-full mt-1 p-3 bg-white dark:bg-slate-900 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 dark:border-slate-800 rounded-xl font-bold" />


                 </div>


              </div>


           </div>


        </div>


      </div>


    );


  };





  const renderSupport = () => {


    // Filter locally based on ticketFilter state


    const displayTickets = tickets.filter(t => {


       if (ticketFilter === 'ALL') return true;


       return t.status === ticketFilter;


    });





    return (


      <div className="space-y-6 animate-fade-in">


        <div className="flex justify-between items-center">


           <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100 dark:text-slate-100 flex items-center gap-2"><Headphones /> Soporte y Tickets</h2>


           <div className="flex gap-2">


              <button onClick={()=>setIsCreateTicketOpen(true)} className="bg-slate-900 dark:bg-sky-500 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-900/90 dark:hover:bg-sky-500/90"><Plus size={16}/> Crear Ticket</button>


              <div className="bg-white dark:bg-slate-900 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 dark:border-slate-800 rounded-xl p-1 flex">


                 {(['ALL', 'OPEN', 'CLOSED'] as const).map(f => (


                    <button

                      key={f}

                      onClick={() => setTicketFilter(f)}

                      className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
                        ticketFilter === f
                          ? 'bg-slate-900 dark:bg-sky-500 text-white'
                          : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900/60'
                      }`}

                    >

                       {f === 'ALL' ? 'Todos' : f === 'OPEN' ? 'Abiertos' : 'Cerrados'}


                    </button>


                 ))}


              </div>


           </div>


        </div>





        <div className="grid grid-cols-1 gap-4">


           {displayTickets.length === 0 ? (


              <div className="bg-white dark:bg-slate-900 dark:bg-slate-900 p-12 rounded-xl text-center text-gray-400 dark:text-slate-500 dark:text-slate-500 border border-dashed border-gray-300">


                 <Headphones size={48} className="mx-auto mb-4 opacity-20"/>


                 <p>No hay tickets en esta vista.</p>


              </div>


           ) : (


              displayTickets.map(ticket => (


                 <div key={ticket.id} className="bg-white dark:bg-slate-900 dark:bg-slate-900 p-6 rounded-xl border border-gray-200 dark:border-slate-800 dark:border-slate-800 shadow-sm flex justify-between items-center hover:shadow-md transition">


                    <div className="flex gap-4">


                       <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${ticket.priority === 'HIGH' ? 'bg-red-100 text-red-600' : ticket.priority === 'MEDIUM' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>


                          {ticket.priority.charAt(0)}


                       </div>


                       <div>


                          <div className="flex items-center gap-2 mb-1">


                             <span className="text-xs font-mono font-bold text-gray-400 dark:text-slate-500 dark:text-slate-500">{ticket.ticketNumber}</span>


                             <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${ticket.status === 'OPEN' ? 'bg-green-100 text-green-700' : ticket.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 dark:bg-slate-800 dark:bg-slate-800 text-gray-600 dark:text-slate-300 dark:text-slate-300'}`}>{ticket.status}</span>


                          </div>


                          <h3 className="font-bold text-gray-900 dark:text-slate-100 dark:text-slate-100">{ticket.subject}</h3>


                          <p className="text-sm text-gray-500 dark:text-slate-400 dark:text-slate-400 line-clamp-1">{ticket.description}</p>


                          <div className="mt-2 flex items-center gap-4 text-xs text-gray-400 dark:text-slate-500 dark:text-slate-500">


                             <span className="flex items-center gap-1"><UserIcon size={12}/> {ticket.userName} ({ticket.userRole})</span>


                             <span>{new Date(ticket.date).toLocaleDateString()}</span>


                          </div>


                       </div>


                    </div>


                    <button

                      onClick={() => setSelectedTicket(ticket)}

                      className="p-2 bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-slate-300 rounded-xl hover:bg-slate-900 hover:text-white dark:hover:bg-slate-900/80 transition"

                      title="Ver Detalle"

                    >

                      <Eye size={20} />

                    </button>

                 </div>


              ))


           )}


        </div>


      </div>


    );


  };





  const renderAnalytics = () => (


     <div className="space-y-6 animate-fade-in">


        <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100 dark:text-slate-100 flex items-center gap-2"><BarChart3 /> Reportes y Métricas</h2>


        


        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


           <div className="bg-white dark:bg-slate-900 dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 dark:border-slate-800">


              <h3 className="font-bold text-gray-700 dark:text-slate-300 dark:text-slate-300 mb-6">Viajes diarios (?ltima Semana)</h3>


              <div className="flex items-end justify-between h-48 gap-2">


                 {[45, 60, 35, 80, 70, 90, 50].map((h, i) => (


                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group">


                       <div className="w-full bg-blue-500 rounded-t-lg transition-all group-hover:bg-blue-600 relative" style={{height: `${h}%`}}>


                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-900 dark:bg-sky-500 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition">{h}</div>


                       </div>


                       <span className="text-xs font-bold text-gray-400 dark:text-slate-500 dark:text-slate-500">D{i+1}</span>


                    </div>


                 ))}


              </div>


           </div>





           <div className="bg-white dark:bg-slate-900 dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 dark:border-slate-800">


              <h3 className="font-bold text-gray-700 dark:text-slate-300 dark:text-slate-300 mb-6">Métodos de Pago</h3>


              <div className="space-y-4">


                 {[


                    { l: 'Efectivo', v: 60, c: 'bg-green-500' },


                    { l: 'Tarjeta', v: 25, c: 'bg-blue-500' },


                    { l: 'Corporativo', v: 10, c: 'bg-purple-500' },


                    { l: 'Wallet', v: 5, c: 'bg-orange-500' },


                 ].map(m => (


                    <div key={m.l}>


                       <div className="flex justify-between text-sm mb-1 font-bold"><span>{m.l}</span><span>{m.v}%</span></div>


                       <div className="w-full bg-gray-100 dark:bg-slate-800 dark:bg-slate-800 rounded-full h-2 overflow-hidden"><div className={`h-full ${m.c}`} style={{width: `${m.v}%`}}></div></div>


                    </div>


                 ))}


              </div>


           </div>


        </div>


     </div>


  );





  const renderFinance = () => {


     // EXACT PROFIT CALCULATION BASED ON TRIP SNAPSHOTS


     const totalVolume = revenueTotal;


     


     // Calculate platform commission based on each trip's specific snapshot or default


     const platformCommission = filteredHistory.reduce((acc, trip) => {


         const commPct = trip.commissionSnapshot || 20; // Default to 20 if missing (legacy data)


         return acc + (trip.price * (commPct / 100));


     }, 0);





     const driverPayouts = totalVolume - platformCommission;


     const pendingPayouts = driverPayouts * 0.30; 





     return (


        <div className="space-y-6 animate-fade-in">


           <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100 dark:text-slate-100 flex items-center gap-2"><DollarSign /> Finanzas</h2>


           


           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">


              <StatCard title="Volumen Total" value={`$${totalVolume.toFixed(2)}`} sub="Bruto Generado" icon={<DollarSign className="text-blue-600"/>} color="bg-blue-50" />


              <StatCard title="Comisiones" value={`$${platformCommission.toFixed(2)}`} sub="Ingreso plataforma (real)" icon={<TrendingUp className="text-green-600"/>} color="bg-green-50" />


              <StatCard title="Por Pagar" value={`$${pendingPayouts.toFixed(2)}`} sub="A Conductores" icon={<DollarSign className="text-orange-600"/>} color="bg-orange-50" />


           </div>





           <div className="bg-white dark:bg-slate-900 dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 dark:border-slate-800 overflow-hidden">


              <div className="p-4 border-b border-gray-100 dark:border-slate-800 dark:border-slate-800 font-bold">Transacciones Recientes</div>


              <table className="w-full text-left text-sm">


                 <thead className="bg-gray-50 dark:bg-slate-800 dark:bg-slate-800 text-gray-500 dark:text-slate-400 dark:text-slate-400 font-bold uppercase text-xs">


                    <tr><th className="px-6 py-4">Fecha</th><th className="px-6 py-4">Concepto</th><th className="px-6 py-4">Coop</th><th className="px-6 py-4 text-right">Comisión</th></tr>


                 </thead>


                 <tbody className="divide-y divide-gray-100">


                    {filteredHistory.slice(0, 10).map((trip) => {


                       const commPct = trip.commissionSnapshot || 20;


                       const commAmount = trip.price * (commPct / 100);


                       return (


                           <tr key={trip.id} className="transition-colors even:bg-slate-50/60 dark:even:bg-slate-900/40 hover:bg-slate-100 dark:hover:bg-slate-900/60">

                              <td className="px-6 py-4">{new Date(trip.date).toLocaleDateString()}</td>


                              <td className="px-6 py-4">Cobro Viaje #{trip.id.slice(0,4)}</td>


                              <td className="px-6 py-4"><span className="bg-gray-100 dark:bg-slate-800 dark:bg-slate-800 px-2 py-1 rounded text-xs font-bold">{trip.cooperativeId ? cooperatives.find(c => c.id === trip.cooperativeId)?.code : 'N/A'}</span></td>


                              <td className="px-6 py-4 text-right font-bold text-green-600">


                                  +${commAmount.toFixed(2)} <span className="text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500">({commPct}%)</span>


                              </td>


                           </tr>


                       );


                    })}


                 </tbody>


              </table>


           </div>


        </div>


     );


  };





  const MenuItem = ({ view, icon, label }: any) => (

    <button

      onClick={() => {

        setActiveView(view);

        setIsSidebarOpen(false);

      }}

      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold rounded-lg transition ${

        activeView === view
          ? 'bg-sky-500/15 text-sky-500'
          : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900/60 hover:text-slate-900 dark:hover:text-white'

      }`}

    >

      {icon} {label}

    </button>

  );

  


  const StatCard = ({ title, value, trend, sub, icon, color }: any) => (


    <div className="bg-white dark:bg-slate-900 dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 dark:border-slate-800 hover:shadow-md transition">


       <div className="flex justify-between items-start mb-4"><div className={`p-3 rounded-xl ${color}`}>{icon}</div>{trend && <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">{trend}</span>}</div>


       <h3 className="text-3xl font-black text-gray-900 dark:text-slate-100 dark:text-slate-100 mb-1">{value}</h3>


       <p className="text-xs text-gray-500 dark:text-slate-400 dark:text-slate-400 font-bold uppercase">{title}</p>


       {sub && <p className="text-xs text-gray-400 dark:text-slate-500 dark:text-slate-500 mt-1">{sub}</p>}


    </div>


  );





  return (

    <div className="h-full w-full bg-gray-50 dark:bg-[#0b1219] text-slate-900 dark:text-slate-100 font-sans flex flex-col md:flex-row overflow-hidden">

      {/* Sidebar */}


      {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)} />}


      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col h-screen shadow-xl transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>

        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">

          <div className="flex items-center gap-3">


            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold">FR</div>


            <div>


              <h1 className="font-bold text-lg leading-none">FelcarRide</h1>


              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase">

                 {currentUser.role === UserRole.SUPERADMIN ? 'Super Admin' : 'Administrador'}


              </span>


              {currentUser.role === UserRole.ADMIN && (


                <div className="text-xs text-blue-400 font-bold mt-1 truncate max-w-[140px]" title={currentAdminCoop?.name || ""}>


                   {currentAdminCoop ? currentAdminCoop.name : 'Sin asignar'}


                </div>


              )}


            </div>


          </div>


          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-400"><X size={24} /></button>

        </div>


        


        {currentUser.role === UserRole.SUPERADMIN && (


            <div className="p-4 border-b border-slate-200 dark:border-slate-800">

               <label className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 mb-1 block">Filtrar Cooperativa</label>

               <div className="relative">

                  <Building size={14} className="absolute left-3 top-2.5 text-slate-400"/>

                  <select 

                     className="w-full bg-slate-50 dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-100 rounded-lg py-2 pl-9 pr-2 border border-slate-200 dark:border-slate-800 focus:border-sky-500 outline-none appearance-none"

                     value={selectedCoopFilter}

                     onChange={(e) => setSelectedCoopFilter(e.target.value)}

                  >

                     <option value="ALL">Todas las Cooperativas</option>


                     {cooperatives.map(coop => (


                        <option key={coop.id} value={coop.id}>{coop.name}</option>


                     ))}


                  </select>


               </div>


            </div>


        )}





        <div className="flex-grow overflow-y-auto py-4 px-3 space-y-1">

          <MenuItem view="MODULES" icon={<Layers size={18} />} label="Modulos UI" />

          <MenuItem view="DASHBOARD" icon={<LayoutDashboard size={18} />} label="Dashboard" />

          


          {currentUser.role === UserRole.SUPERADMIN && (


             <>


               <div className="px-3 py-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mt-4">Plataforma</div>

               <MenuItem view="COOPERATIVES" icon={<Building size={18} />} label="Cooperativas" />


               <MenuItem view="ADMINS" icon={<UserCog size={18} />} label="Administradores" />


             </>


          )}





          <div className="px-3 py-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mt-4">Operaciones</div>

          <MenuItem view="RIDERS" icon={<Users size={18} />} label="Clientes" />


          <MenuItem view="DRIVERS" icon={<Car size={18} />} label="Conductores" />


          <MenuItem view="TRIPS" icon={<MapIcon size={18} />} label="Viajes" />


          <MenuItem view="CORPORATE" icon={<Briefcase size={18} />} label="Empresas (B2B)" />


          <div className="px-3 py-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mt-4">Negocio</div>

          <MenuItem view="FINANCE" icon={<DollarSign size={18} />} label="Finanzas" />


          


          <MenuItem view="CONFIG" icon={<Settings size={18} />} label={currentUser.role === UserRole.SUPERADMIN ? "Tarifas globales" : "Mis tarifas"} />


          


          <MenuItem view="SUPPORT" icon={<Headphones size={18} />} label="Soporte" />


          <MenuItem view="ANALYTICS" icon={<BarChart3 size={18} />} label="Reportes" />


        </div>





        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2">

          {onChangePassword && (

            <button

              onClick={onChangePassword}

              className="flex items-center gap-3 w-full px-4 py-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900/60 rounded-lg transition"

            >

              <Lock size={18} /> Password

            </button>

          )}

          <button onClick={onLogout} className="flex items-center gap-3 w-full px-4 py-2 text-rose-400 hover:bg-rose-500/10 rounded-lg transition">

            <LogOut size={18} /> Salir

          </button>

        </div>

      </div>





      {/* Main Content Area */}


      <div className="flex-grow md:ml-72 h-full transition-all duration-300 overflow-y-auto">

         <div className="p-4 md:p-8 min-h-full">


            {/* Header */}


            <div className="flex justify-between items-center mb-6 md:mb-8">


               <div className="flex items-center gap-3">


                  <button

                    onClick={() => setIsSidebarOpen(true)}

                    className="md:hidden p-2 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"

                  >

                    <Menu size={24} />

                  </button>

                  <h1 className="md:hidden font-bold text-lg text-slate-900 dark:text-white">FelcarRide</h1>

               </div>

               <div className="flex items-center gap-4 ml-auto">

                  <button

                    onClick={() => setIsNotificationsOpen(true)}

                    className="relative p-2 bg-white dark:bg-slate-900 rounded-full shadow-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition"

                  >

                    <Bell size={20} className="text-slate-600 dark:text-slate-300" />

                    <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900"></span>

                  </button>

                  <div className="w-9 h-9 md:w-10 md:h-10 bg-sky-600 rounded-full flex items-center justify-center text-white font-bold text-sm">AD</div>

               </div>

            </div>


            


            {/* Module Render */}


            {activeView === 'MODULES' && <AdminFamilyModules onNotify={onNotify} />}

            {activeView === 'DASHBOARD' && renderDashboard()}

            {activeView === 'RIDERS' && renderUsers(UserRole.RIDER)}


            {activeView === 'DRIVERS' && renderUsers(UserRole.DRIVER)}


            {activeView === 'ADMINS' && renderUsers(UserRole.ADMIN)}


            {activeView === 'TRIPS' && renderTrips()}


            {activeView === 'COOPERATIVES' && renderCooperatives()}


            {activeView === 'CORPORATE' && renderCorporate()}


            {activeView === 'CONFIG' && renderConfig()}


            {activeView === 'SUPPORT' && renderSupport()}


            {activeView === 'ANALYTICS' && renderAnalytics()}


            {activeView === 'FINANCE' && renderFinance()}


         </div>


      </div>


      


      {/* Modals */}


      <NotificationsModal isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />


      


      {selectedTicket && (


          <div className="absolute inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">


             <div className="bg-white dark:bg-slate-900 dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl p-6 relative">


                <button onClick={() => setSelectedTicket(null)} className="absolute top-4 right-4 text-gray-400 dark:text-slate-500 dark:text-slate-500 hover:text-black dark:text-slate-100"><X size={24}/></button>


                <div className="flex items-center gap-2 mb-4">


                   <h2 className="text-xl font-bold">Ticket {selectedTicket.ticketNumber}</h2>


                   <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${selectedTicket.status === 'OPEN' ? 'bg-green-100 text-green-700' : 'bg-gray-100 dark:bg-slate-800 dark:bg-slate-800 text-gray-600 dark:text-slate-300 dark:text-slate-300'}`}>{selectedTicket.status}</span>


                </div>


                


                <div className="space-y-4 mb-6">


                   <div className="bg-gray-50 dark:bg-slate-800 dark:bg-slate-800 p-4 rounded-xl">


                      <p className="text-xs font-bold text-gray-400 dark:text-slate-500 dark:text-slate-500 uppercase mb-1">Asunto</p>


                      <p className="font-bold">{selectedTicket.subject}</p>


                   </div>


                   <div className="bg-gray-50 dark:bg-slate-800 dark:bg-slate-800 p-4 rounded-xl">


                      <p className="text-xs font-bold text-gray-400 dark:text-slate-500 dark:text-slate-500 uppercase mb-1">Descripción</p>


                      <p className="text-sm">{selectedTicket.description}</p>


                   </div>


                   {selectedTicket.attachments && selectedTicket.attachments.length > 0 && (


                      <div>


                         <p className="text-xs font-bold text-gray-400 dark:text-slate-500 dark:text-slate-500 uppercase mb-2">Evidencias</p>


                         <div className="flex gap-2 overflow-x-auto">


                            {selectedTicket.attachments.map((src, i) => (


                               <img key={i} src={src} className="w-24 h-24 rounded-lg object-cover border border-gray-200 dark:border-slate-800 dark:border-slate-800" />


                            ))}


                         </div>


                      </div>


                   )}


                </div>





                <div className="flex gap-3">


                   <button onClick={() => setSelectedTicket(null)} className="flex-1 py-3 bg-gray-100 dark:bg-slate-800 dark:bg-slate-800 font-bold rounded-xl">Cerrar</button>


                   <button onClick={() => handleResolveTicket(selectedTicket.id)} className={`flex-1 py-3 font-bold rounded-xl text-white ${selectedTicket.status === 'CLOSED' ?  'bg-blue-600' : 'bg-green-600'}`}>

                      {selectedTicket.status === 'CLOSED' ? 'Reabrir ticket' : 'Marcar resuelto'}


                   </button>


                </div>


             </div>


          </div>


      )}





      {isCreateTicketOpen && <HelpCenterModal isOpen={isCreateTicketOpen} onClose={() => setIsCreateTicketOpen(false)} user={currentUser} />}





      {/* CREATE COOP MODAL */}


      {isCreateCoopOpen && (


          <div className="absolute inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">


             <div className="bg-white dark:bg-slate-900 dark:bg-slate-900 w-full max-w-sm rounded-2xl shadow-2xl p-6">


                <h3 className="text-lg font-bold mb-4">Nueva Cooperativa</h3>


                <div className="space-y-3 mb-6">


                   <input type="text" placeholder="Nombre (Ej: Coop Modelo)" value={newCoopName} onChange={e=>setNewCoopName(e.target.value)} className="w-full bg-gray-50 dark:bg-slate-800 dark:bg-slate-800 p-3 rounded-xl font-bold border border-gray-200 dark:border-slate-800 dark:border-slate-800" />


                   <input type="text" placeholder="Código (Ej: MODELO)" value={newCoopCode} onChange={e=>setNewCoopCode(e.target.value.toUpperCase())} className="w-full bg-gray-50 dark:bg-slate-800 dark:bg-slate-800 p-3 rounded-xl font-bold border border-gray-200 dark:border-slate-800 dark:border-slate-800 uppercase" />


                </div>


                <div className="flex gap-2">


                   <button onClick={() => setIsCreateCoopOpen(false)} className="flex-1 py-3 bg-gray-100 dark:bg-slate-800 dark:bg-slate-800 font-bold rounded-xl">Cancelar</button>


                   <button onClick={handleCreateCoop} className="flex-1 py-3 bg-slate-900 dark:bg-sky-500 text-white font-bold rounded-xl">Crear</button>


                </div>


             </div>


          </div>


      )}





      {/* CREATE COMPANY MODAL */}


      {isCreateCompanyOpen && (


         <div className="absolute inset-0 z-[80] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">


             <div className="bg-white dark:bg-slate-900 dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl p-6 overflow-y-auto max-h-[90vh]">


                 <h3 className="text-lg font-bold mb-4">Nueva Empresa (B2B)</h3>


                 <div className="space-y-4 mb-6">


                     <div>


                        <label className="text-xs font-bold text-gray-500 dark:text-slate-400 dark:text-slate-400 uppercase">Nombre</label>


                        <input type="text" className="w-full mt-1 p-3 bg-white dark:bg-slate-900 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 dark:border-slate-800 rounded-xl font-bold" value={newCompanyForm.name} onChange={e=>setNewCompanyForm({...newCompanyForm, name: e.target.value})} />


                     </div>


                     <div>


                        <label className="text-xs font-bold text-gray-500 dark:text-slate-400 dark:text-slate-400 uppercase">RUC</label>


                        <input type="text" className="w-full mt-1 p-3 bg-white dark:bg-slate-900 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 dark:border-slate-800 rounded-xl font-bold" value={newCompanyForm.ruc} onChange={e=>setNewCompanyForm({...newCompanyForm, ruc: e.target.value})} />


                     </div>


                     <div>


                        <label className="text-xs font-bold text-gray-500 dark:text-slate-400 dark:text-slate-400 uppercase">Correo (Facturación)</label>


                        <input type="email" className="w-full mt-1 p-3 bg-white dark:bg-slate-900 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 dark:border-slate-800 rounded-xl font-bold" value={newCompanyForm.email} onChange={e=>setNewCompanyForm({...newCompanyForm, email: e.target.value})} />


                     </div>


                     <div>


                        <label className="text-xs font-bold text-gray-500 dark:text-slate-400 dark:text-slate-400 uppercase">Dirección</label>


                        <input type="text" className="w-full mt-1 p-3 bg-white dark:bg-slate-900 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 dark:border-slate-800 rounded-xl font-bold" value={newCompanyForm.address} onChange={e=>setNewCompanyForm({...newCompanyForm, address: e.target.value})} />


                     </div>


                     <div className="grid grid-cols-2 gap-4">


                         <div>


                            <label className="text-xs font-bold text-gray-500 dark:text-slate-400 dark:text-slate-400 uppercase">Crédito ($)</label>


                            <input type="number" className="w-full mt-1 p-3 bg-white dark:bg-slate-900 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 dark:border-slate-800 rounded-xl font-bold" value={newCompanyForm.creditLimit} onChange={e=>setNewCompanyForm({...newCompanyForm, creditLimit: e.target.value})} />


                         </div>


                         <div>


                            <label className="text-xs font-bold text-gray-500 dark:text-slate-400 dark:text-slate-400 uppercase">Contacto</label>


                            <input type="text" className="w-full mt-1 p-3 bg-white dark:bg-slate-900 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 dark:border-slate-800 rounded-xl font-bold" value={newCompanyForm.contactName} onChange={e=>setNewCompanyForm({...newCompanyForm, contactName: e.target.value})} />


                         </div>


                     </div>


                     


                     {/* Cooperative Selection (SuperAdmin Only) */}


                     {currentUser.role === UserRole.SUPERADMIN && (


                        <div>


                            <label className="text-xs font-bold text-gray-500 dark:text-slate-400 dark:text-slate-400 uppercase">Cooperativa Asignada</label>


                            <select className="w-full mt-1 p-3 bg-white dark:bg-slate-900 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 dark:border-slate-800 rounded-xl font-bold" value={newCompanyForm.cooperativeId} onChange={e=>setNewCompanyForm({...newCompanyForm, cooperativeId: e.target.value})}>


                                <option value="">Seleccione...</option>


                                {cooperatives.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}


                            </select>


                        </div>


                     )}


                 </div>


                 <div className="flex gap-2">


                     <button onClick={() => setIsCreateCompanyOpen(false)} className="flex-1 py-3 bg-gray-100 dark:bg-slate-800 dark:bg-slate-800 font-bold rounded-xl">Cancelar</button>


                     <button onClick={handleCreateCompany} className="flex-1 py-3 bg-slate-900 dark:bg-sky-500 text-white font-bold rounded-xl">Crear</button>


                 </div>


             </div>


         </div>


      )}





      {/* CREATE USER MODAL (ADMIN/RIDER/DRIVER) */}


      {isCreateUserModalOpen && (


          <div className="absolute inset-0 z-[80] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">


             <div className="bg-white dark:bg-slate-900 dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl p-6 overflow-y-auto max-h-[90vh]">


                 <h3 className="text-lg font-bold mb-4">Crear Nuevo Usuario</h3>


                 <div className="space-y-4 mb-6">


                     <div>


                        <label className="text-xs font-bold text-gray-500 dark:text-slate-400 dark:text-slate-400 uppercase">Rol</label>


                        <div className="flex bg-gray-100 dark:bg-slate-800 dark:bg-slate-800 p-1 rounded-xl mt-1">


                            <button onClick={() => setNewUserForm(prev => ({...prev, role: UserRole.RIDER}))} className={`flex-1 py-2 text-xs font-bold rounded-lg ${newUserForm.role === UserRole.RIDER ? 'bg-white dark:bg-slate-900 dark:bg-slate-900 shadow text-black dark:text-slate-100' : 'text-gray-500 dark:text-slate-400 dark:text-slate-400'}`}>Cliente</button>


                            <button onClick={() => setNewUserForm(prev => ({...prev, role: UserRole.DRIVER}))} className={`flex-1 py-2 text-xs font-bold rounded-lg ${newUserForm.role === UserRole.DRIVER ? 'bg-white dark:bg-slate-900 dark:bg-slate-900 shadow text-black dark:text-slate-100' : 'text-gray-500 dark:text-slate-400 dark:text-slate-400'}`}>Conductor</button>


                            {currentUser.role === UserRole.SUPERADMIN && (


                                <button onClick={() => setNewUserForm(prev => ({...prev, role: UserRole.ADMIN}))} className={`flex-1 py-2 text-xs font-bold rounded-lg ${newUserForm.role === UserRole.ADMIN ? 'bg-white dark:bg-slate-900 dark:bg-slate-900 shadow text-black dark:text-slate-100' : 'text-gray-500 dark:text-slate-400 dark:text-slate-400'}`}>Admin</button>


                            )}


                        </div>


                     </div>





                     <div>


                        <label className="text-xs font-bold text-gray-500 dark:text-slate-400 dark:text-slate-400 uppercase">Nombre Completo</label>


                        <input type="text" className="w-full mt-1 p-3 bg-white dark:bg-slate-900 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 dark:border-slate-800 rounded-xl font-bold" value={newUserForm.name} onChange={e=>setNewUserForm({...newUserForm, name: e.target.value})} />


                     </div>


                     <div>


                        <label className="text-xs font-bold text-gray-500 dark:text-slate-400 dark:text-slate-400 uppercase">Email</label>


                        <input type="email" className="w-full mt-1 p-3 bg-white dark:bg-slate-900 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 dark:border-slate-800 rounded-xl font-bold" value={newUserForm.email} onChange={e=>setNewUserForm({...newUserForm, email: e.target.value})} />


                     </div>


                     <div className="grid grid-cols-2 gap-4">


                        <div>


                            <label className="text-xs font-bold text-gray-500 dark:text-slate-400 dark:text-slate-400 uppercase">Cédula</label>


                            <input type="text" className="w-full mt-1 p-3 bg-white dark:bg-slate-900 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 dark:border-slate-800 rounded-xl font-bold" value={newUserForm.cedula} onChange={e=>setNewUserForm({...newUserForm, cedula: e.target.value})} />


                        </div>


                        <div>


                            <label className="text-xs font-bold text-gray-500 dark:text-slate-400 dark:text-slate-400 uppercase">Teléfono</label>


                            <input type="text" className="w-full mt-1 p-3 bg-white dark:bg-slate-900 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 dark:border-slate-800 rounded-xl font-bold" value={newUserForm.phone} onChange={e=>setNewUserForm({...newUserForm, phone: e.target.value})} />


                        </div>


                     </div>





                     {/* DRIVER SPECIFIC FIELDS */}


                     {newUserForm.role === UserRole.DRIVER && (


                         <div className="bg-gray-50 dark:bg-slate-800 dark:bg-slate-800 p-4 rounded-xl border border-gray-100 dark:border-slate-800 dark:border-slate-800 space-y-3">


                             <p className="text-xs font-black text-gray-900 dark:text-slate-100 dark:text-slate-100 uppercase border-b border-gray-200 dark:border-slate-800 dark:border-slate-800 pb-2">Datos del Vehículo</p>


                             


                             <div className="grid grid-cols-2 gap-3">


                                 <div>


                                     <label className="text-[10px] font-bold text-gray-500 dark:text-slate-400 dark:text-slate-400 uppercase">Placa</label>


                                     <input type="text" className="w-full p-2 bg-white dark:bg-slate-900 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 dark:border-slate-800 rounded-lg text-sm font-bold uppercase" value={newDriverForm.plate} onChange={e=>setNewDriverForm({...newDriverForm, plate: e.target.value.toUpperCase()})} />


                                 </div>


                                 <div>


                                     <label className="text-[10px] font-bold text-gray-500 dark:text-slate-400 dark:text-slate-400 uppercase">Año</label>


                                     <input type="number" className="w-full p-2 bg-white dark:bg-slate-900 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 dark:border-slate-800 rounded-lg text-sm font-bold" value={newDriverForm.carYear} onChange={e=>setNewDriverForm({...newDriverForm, carYear: e.target.value})} />


                                 </div>


                             </div>


                             


                             <div>


                                 <label className="text-[10px] font-bold text-gray-500 dark:text-slate-400 dark:text-slate-400 uppercase">Modelo</label>


                                 <input type="text" className="w-full p-2 bg-white dark:bg-slate-900 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 dark:border-slate-800 rounded-lg text-sm font-bold" value={newDriverForm.carModel} onChange={e=>setNewDriverForm({...newDriverForm, carModel: e.target.value})} />


                             </div>





                             <div className="grid grid-cols-2 gap-3">


                                 <div>


                                     <label className="text-[10px] font-bold text-gray-500 dark:text-slate-400 dark:text-slate-400 uppercase">Color</label>


                                     <input type="color" className="w-full h-10 p-1 bg-white dark:bg-slate-900 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 dark:border-slate-800 rounded-lg cursor-pointer" value={newDriverForm.carColor} onChange={e=>setNewDriverForm({...newDriverForm, carColor: e.target.value})} />


                                 </div>


                                 <div>


                                     <label className="text-[10px] font-bold text-gray-500 dark:text-slate-400 dark:text-slate-400 uppercase">Tipo</label>


                                     <select className="w-full h-10 p-1 bg-white dark:bg-slate-900 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 dark:border-slate-800 rounded-lg text-sm font-bold" value={newDriverForm.carType} onChange={e=>setNewDriverForm({...newDriverForm, carType: e.target.value as CarType})}>


                                         <option value={CarType.SEDAN}>Sedan</option>


                                         <option value={CarType.SUV}>SUV</option>


                                         <option value={CarType.MOTORCYCLE}>Moto</option>


                                     </select>


                                 </div>


                             </div>


                         </div>


                     )}





                     {/* Cooperative Select (Only if SuperAdmin) */}


                     {currentUser.role === UserRole.SUPERADMIN && (


                        <div>


                            <label className="text-xs font-bold text-gray-500 dark:text-slate-400 dark:text-slate-400 uppercase">Asignar a Cooperativa</label>


                            <select className="w-full mt-1 p-3 bg-white dark:bg-slate-900 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 dark:border-slate-800 rounded-xl font-bold" value={newUserForm.cooperativeId} onChange={e=>setNewUserForm({...newUserForm, cooperativeId: e.target.value})}>


                                <option value="">Seleccione...</option>


                                <option value="coop-global">Global (Sin Cooperativa)</option>


                                {cooperatives.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}


                            </select>


                        </div>


                     )}


                 </div>


                 <div className="flex gap-2">


                     <button onClick={() => setIsCreateUserModalOpen(false)} className="flex-1 py-3 bg-gray-100 dark:bg-slate-800 dark:bg-slate-800 font-bold rounded-xl">Cancelar</button>


                     <button onClick={handleCreateUser} className="flex-1 py-3 bg-slate-900 dark:bg-sky-500 text-white font-bold rounded-xl">Crear Usuario</button>


                 </div>


             </div>


          </div>


      )}





      {/* MANAGE ADMINS MODAL (Legacy View inside Cooperatives) */}


      {viewingAdminsFor && (


          <div className="absolute inset-0 z-[80] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">


             <div className="bg-white dark:bg-slate-900 dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">


                 <div className="flex justify-between items-center mb-6">


                     <h3 className="text-xl font-bold">Administradores: {viewingAdminsFor.name}</h3>


                     <button onClick={() => setViewingAdminsFor(null)}><X size={24} className="text-gray-400 dark:text-slate-500 dark:text-slate-500"/></button>


                 </div>


                 


                 {/* List of Admins */}


                 <div className="mb-8">


                     <table className="w-full text-left text-sm mb-4">


                         <thead className="bg-gray-100 dark:bg-slate-800 dark:bg-slate-800 text-gray-500 dark:text-slate-400 dark:text-slate-400 font-bold uppercase text-xs">


                             <tr>


                                 <th className="px-4 py-3">Nombre</th>


                                 <th className="px-4 py-3">Email</th>


                                 <th className="px-4 py-3 text-center">Acciones</th>


                             </tr>


                         </thead>


                         <tbody className="divide-y divide-gray-100">


                             {users.filter(u => u.role === UserRole.ADMIN && u.cooperativeId === viewingAdminsFor.id).map(admin => (


                                 <tr key={admin.id}>


                                     <td className="px-4 py-3 font-bold">{admin.name}</td>


                                     <td className="px-4 py-3 text-gray-500 dark:text-slate-400 dark:text-slate-400">{admin.email}</td>


                                     <td className="px-4 py-3 flex justify-center gap-2">


                                         <button onClick={() => handleEditUserClick(admin)} className="text-blue-500 hover:bg-blue-50 p-1 rounded"><Edit size={16}/></button>


                                         <button onClick={() => handleDeleteUserClick(admin.id)} className="text-red-500 hover:bg-red-50 p-1 rounded"><Trash2 size={16}/></button>


                                     </td>


                                 </tr>


                             ))}


                         </tbody>


                     </table>


                     {users.filter(u => u.role === UserRole.ADMIN && u.cooperativeId === viewingAdminsFor.id).length === 0 && (


                         <p className="text-center text-gray-400 dark:text-slate-500 dark:text-slate-500 text-sm">No hay administradores asignados.</p>


                     )}


                 </div>


             </div>


          </div>


      )}





      {editingCoop && (


          <div className="absolute inset-0 z-[80] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">


              <div className="bg-white dark:bg-slate-900 dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">


                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">Editar Cooperativa <span className="text-gray-400 dark:text-slate-500 dark:text-slate-500 text-sm font-mono">{editingCoop.code}</span></h3>


                  


                  <div className="space-y-4 mb-6">


                      <div>


                          <label className="text-xs font-bold text-gray-500 dark:text-slate-400 dark:text-slate-400 uppercase">Nombre</label>


                          <input type="text" className="w-full mt-1 p-3 bg-white dark:bg-slate-900 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 dark:border-slate-800 rounded-xl font-bold" value={editCoopForm.name} onChange={e=>setEditCoopForm({...editCoopForm, name: e.target.value})} />


                      </div>


                      


                      <div className="grid grid-cols-2 gap-4">


                          <div>


                              <label className="text-xs font-bold text-gray-500 dark:text-slate-400 dark:text-slate-400 uppercase">Tarifa Base ($)</label>


                              <input type="number" step="0.1" className="w-full mt-1 p-3 bg-white dark:bg-slate-900 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 dark:border-slate-800 rounded-xl font-bold" value={editCoopForm.baseRate} onChange={e=>setEditCoopForm({...editCoopForm, baseRate: e.target.value})} />


                          </div>


                          <div>


                              <label className="text-xs font-bold text-gray-500 dark:text-slate-400 dark:text-slate-400 uppercase">Por Km ($)</label>


                              <input type="number" step="0.05" className="w-full mt-1 p-3 bg-white dark:bg-slate-900 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 dark:border-slate-800 rounded-xl font-bold" value={editCoopForm.perKm} onChange={e=>setEditCoopForm({...editCoopForm, perKm: e.target.value})} />


                          </div>


                          <div>


                              <label className="text-xs font-bold text-gray-500 dark:text-slate-400 dark:text-slate-400 uppercase">Por Min ($)</label>


                              <input type="number" step="0.05" className="w-full mt-1 p-3 bg-white dark:bg-slate-900 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 dark:border-slate-800 rounded-xl font-bold" value={editCoopForm.perMin} onChange={e=>setEditCoopForm({...editCoopForm, perMin: e.target.value})} />


                          </div>


                          <div>


                              <label className="text-xs font-bold text-gray-500 dark:text-slate-400 dark:text-slate-400 uppercase">Mínima ($)</label>


                              <input type="number" step="0.5" className="w-full mt-1 p-3 bg-white dark:bg-slate-900 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 dark:border-slate-800 rounded-xl font-bold" value={editCoopForm.minFare} onChange={e=>setEditCoopForm({...editCoopForm, minFare: e.target.value})} />


                          </div>


                          <div>


                              <label className="text-xs font-bold text-gray-500 dark:text-slate-400 dark:text-slate-400 uppercase">Comisión (%)</label>


                              <input type="number" step="1" className="w-full mt-1 p-3 bg-white dark:bg-slate-900 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 dark:border-slate-800 rounded-xl font-bold" value={editCoopForm.commission} onChange={e=>setEditCoopForm({...editCoopForm, commission: e.target.value})} />


                          </div>


                          <div>


                              <label className="text-xs font-bold text-gray-500 dark:text-slate-400 dark:text-slate-400 uppercase">Tasa Reserva ($)</label>


                              <input type="number" step="0.05" className="w-full mt-1 p-3 bg-white dark:bg-slate-900 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 dark:border-slate-800 rounded-xl font-bold" value={editCoopForm.bookingFee} onChange={e=>setEditCoopForm({...editCoopForm, bookingFee: e.target.value})} />


                          </div>


                      </div>


                  </div>





                  <div className="flex gap-2">


                      <button onClick={() => setEditingCoop(null)} className="flex-1 py-3 bg-gray-100 dark:bg-slate-800 dark:bg-slate-800 font-bold rounded-xl">Cancelar</button>


                      <button onClick={handleSaveCoopChanges} className="flex-1 py-3 bg-slate-900 dark:bg-sky-500 text-white font-bold rounded-xl">Guardar</button>


                  </div>


              </div>


          </div>


      )}





      {isTransferUserOpen && (


          <div className="absolute inset-0 z-[80] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">


             <div className="bg-white dark:bg-slate-900 dark:bg-slate-900 w-full max-w-sm rounded-2xl shadow-2xl p-6">


                <h3 className="text-lg font-bold mb-2">Cambiar Cooperativa</h3>


                <p className="text-sm text-gray-500 dark:text-slate-400 dark:text-slate-400 mb-4">Usuario: <span className="font-bold text-black dark:text-slate-100">{userToTransfer?.name || "-"}</span></p>


                <div className="mb-6">


                    <label className="text-xs font-bold text-gray-500 dark:text-slate-400 dark:text-slate-400 uppercase">Nueva Cooperativa</label>


                    <select className="w-full mt-1 bg-gray-50 dark:bg-slate-800 dark:bg-slate-800 border border-gray-200 dark:border-slate-800 dark:border-slate-800 p-3 rounded-xl font-bold" value={targetCoopId} onChange={e => setTargetCoopId(e.target.value)}>


                        <option value="">Seleccione...</option>


                        {cooperatives.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}


                    </select>


                </div>


                <div className="flex gap-2">


                   <button onClick={() => setIsTransferUserOpen(false)} className="flex-1 py-3 bg-gray-100 dark:bg-slate-800 dark:bg-slate-800 font-bold rounded-xl">Cancelar</button>


                   <button onClick={handleTransferUser} disabled={!targetCoopId} className="flex-1 py-3 bg-slate-900 dark:bg-sky-500 text-white font-bold rounded-xl disabled:opacity-50">Transferir</button>


                </div>


             </div>


          </div>


      )}





      {editingUser && (


        <div className="absolute inset-0 z-[80] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">


          <div className="bg-white dark:bg-slate-900 dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl p-6">


            <h3 className="text-lg font-bold mb-4">Editar Usuario</h3>


            <div className="space-y-4 mb-6">


               <div>


                  <label className="text-xs font-bold text-gray-500 dark:text-slate-400 dark:text-slate-400 uppercase">Nombre</label>


                  <input type="text" className="w-full mt-1 p-3 bg-white dark:bg-slate-900 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 dark:border-slate-800 rounded-xl font-bold" value={editUserForm.name} onChange={e=>setEditUserForm({...editUserForm, name: e.target.value})} />


               </div>


               <div>


                  <label className="text-xs font-bold text-gray-500 dark:text-slate-400 dark:text-slate-400 uppercase">Cédula</label>


                  <input type="text" className="w-full mt-1 p-3 bg-white dark:bg-slate-900 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 dark:border-slate-800 rounded-xl font-bold" value={editUserForm.cedula} onChange={e=>setEditUserForm({...editUserForm, cedula: e.target.value})} />


               </div>


               <div>


                  <label className="text-xs font-bold text-gray-500 dark:text-slate-400 dark:text-slate-400 uppercase">Teléfono</label>


                  <input type="text" className="w-full mt-1 p-3 bg-white dark:bg-slate-900 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 dark:border-slate-800 rounded-xl font-bold" value={editUserForm.phone} onChange={e=>setEditUserForm({...editUserForm, phone: e.target.value})} />


               </div>


            </div>


            <div className="flex gap-2">


               <button onClick={() => setEditingUser(null)} className="flex-1 py-3 bg-gray-100 dark:bg-slate-800 dark:bg-slate-800 font-bold rounded-xl">Cancelar</button>


               <button onClick={handleSaveUserChanges} className="flex-1 py-3 bg-slate-900 dark:bg-sky-500 text-white font-bold rounded-xl">Guardar</button>


            </div>


          </div>


        </div>


      )}





      {editingCompany && (


        <div className="absolute inset-0 z-[80] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">


          <div className="bg-white dark:bg-slate-900 dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">


            <h3 className="text-lg font-bold mb-4">Editar Empresa (B2B)</h3>


            <div className="space-y-4 mb-6">


               <div>


                  <label className="text-xs font-bold text-gray-500 dark:text-slate-400 dark:text-slate-400 uppercase">Nombre Empresa</label>


                  <input type="text" className="w-full mt-1 p-3 bg-white dark:bg-slate-900 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 dark:border-slate-800 rounded-xl font-bold" value={editCompanyForm.name} onChange={e=>setEditCompanyForm({...editCompanyForm, name: e.target.value})} />


               </div>


               <div className="grid grid-cols-2 gap-4">


                   <div>


                      <label className="text-xs font-bold text-gray-500 dark:text-slate-400 dark:text-slate-400 uppercase">Crédito Mensual ($)</label>


                      <input type="number" className="w-full mt-1 p-3 bg-white dark:bg-slate-900 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 dark:border-slate-800 rounded-xl font-bold" value={editCompanyForm.creditLimit} onChange={e=>setEditCompanyForm({...editCompanyForm, creditLimit: e.target.value})} />


                   </div>


                   <div>


                      <label className="text-xs font-bold text-gray-500 dark:text-slate-400 dark:text-slate-400 uppercase">Contacto</label>


                      <input type="text" className="w-full mt-1 p-3 bg-white dark:bg-slate-900 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 dark:border-slate-800 rounded-xl font-bold" value={editCompanyForm.contactName} onChange={e=>setEditCompanyForm({...editCompanyForm, contactName: e.target.value})} />


                   </div>


               </div>


               


               {/* Custom Pricing Toggle */}


               <div className="bg-gray-50 dark:bg-slate-800 dark:bg-slate-800 p-4 rounded-xl border border-gray-100 dark:border-slate-800 dark:border-slate-800 mt-4">


                   <div className="flex items-center gap-2 mb-4">


                       <input type="checkbox" id="hasCustomPrice" checked={editCompanyForm.hasCustomPricing} onChange={e=>setEditCompanyForm({...editCompanyForm, hasCustomPricing: e.target.checked})} className="w-5 h-5" />


                       <label htmlFor="hasCustomPrice" className="font-bold text-sm text-gray-700 dark:text-slate-300 dark:text-slate-300 select-none cursor-pointer">Usar Tarifas Personalizadas</label>


                   </div>


                   


                   {editCompanyForm.hasCustomPricing && (


                       <div className="grid grid-cols-2 gap-4 animate-fade-in">


                          <div>


                              <label className="text-xs font-bold text-gray-500 dark:text-slate-400 dark:text-slate-400 uppercase">Base ($)</label>


                              <input type="number" step="0.1" className="w-full mt-1 p-2 bg-white dark:bg-slate-900 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 dark:border-slate-800 rounded-lg font-bold" value={editCompanyForm.baseRate} onChange={e=>setEditCompanyForm({...editCompanyForm, baseRate: e.target.value})} />


                          </div>


                          <div>


                              <label className="text-xs font-bold text-gray-500 dark:text-slate-400 dark:text-slate-400 uppercase">Km ($)</label>


                              <input type="number" step="0.05" className="w-full mt-1 p-2 bg-white dark:bg-slate-900 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 dark:border-slate-800 rounded-lg font-bold" value={editCompanyForm.perKm} onChange={e=>setEditCompanyForm({...editCompanyForm, perKm: e.target.value})} />


                          </div>


                          <div>


                              <label className="text-xs font-bold text-gray-500 dark:text-slate-400 dark:text-slate-400 uppercase">Min ($)</label>


                              <input type="number" step="0.05" className="w-full mt-1 p-2 bg-white dark:bg-slate-900 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 dark:border-slate-800 rounded-lg font-bold" value={editCompanyForm.perMin} onChange={e=>setEditCompanyForm({...editCompanyForm, perMin: e.target.value})} />


                          </div>


                          <div>


                              <label className="text-xs font-bold text-gray-500 dark:text-slate-400 dark:text-slate-400 uppercase">Mínima ($)</label>


                              <input type="number" step="0.5" className="w-full mt-1 p-2 bg-white dark:bg-slate-900 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 dark:border-slate-800 rounded-lg font-bold" value={editCompanyForm.minFare} onChange={e=>setEditCompanyForm({...editCompanyForm, minFare: e.target.value})} />


                          </div>


                       </div>


                   )}


               </div>


            </div>


            <div className="flex gap-2">


               <button onClick={() => setEditingCompany(null)} className="flex-1 py-3 bg-gray-100 dark:bg-slate-800 dark:bg-slate-800 font-bold rounded-xl">Cancelar</button>


               <button onClick={handleSaveCompanyChanges} className="flex-1 py-3 bg-slate-900 dark:bg-sky-500 text-white font-bold rounded-xl">Guardar</button>


            </div>


          </div>


        </div>


      )}


    </div>


  );


};



















