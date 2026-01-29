import React from 'react';


import { Bell, Search, TrendingDown, TrendingUp, CheckCircle2, PhoneCall, MessageSquare, Filter } from 'lucide-react';





interface ModuleProps {


  onNotify: (message: string) => void;


}





const stats = [


  { label: 'Tickets abiertos', value: '124', delta: '12%', trend: 'up' },


  { label: 'Respuesta promedio', value: '12m', delta: '4m', trend: 'down' },


  { label: 'SLA activo', value: '98%', delta: 'Estable', trend: 'ok' },


  { label: 'Resueltos hoy', value: '38', delta: '+6', trend: 'up' }


];





const tickets = [


  { id: '#4592', name: 'Alex Johnson', note: 'Pago fallo dos veces y el banco si débito.', time: '10:46 PM', status: 'Alta' },


  { id: '#8829', name: 'Claudia Rojas', note: 'Conductor no llegó al punto acordado.', time: '09:58 PM', status: 'Media' },


  { id: '#4921', name: 'Jorge Leon', note: 'App se congeló durante el pago.', time: '08:12 PM', status: 'Baja' },


  { id: '#8429', name: 'Maria Paz', note: 'Cobro duplicado en viaje corporativo.', time: '07:40 PM', status: 'Alta' }


];





export const AdminSupportDashboard: React.FC<ModuleProps> = ({ onNotify }) => {


  const handleNotify = (message: string, confirmText?: string) => {


    if (confirmText && !confirm(confirmText)) return;


    if (onNotify) onNotify(message);


  };


  return (


    <section className="space-y-6">


      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">


        <div>


          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Soporte</p>


          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Centro de soporte</h3>


          <p className="text-sm text-slate-500 dark:text-slate-400">


            Gestión operativa de tickets, SLA y conversaciones activas.


          </p>


        </div>


        <div className="flex items-center gap-2">


          <button


            onClick={() => handleNotify('Filtros aplicados (demo).')}


            className="flex items-center gap-2 rounded-full border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 px-4 py-2 text-xs font-semibold text-slate-500 dark:text-slate-300"


          >


            <Filter size={14} />


            Filtros


          </button>


          <button


            onClick={() => handleNotify('Búsqueda lista (demo).')}


            className="p-2 rounded-full border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 text-slate-500 dark:text-slate-300"


          >


            <Search size={16} />


          </button>


          <button


            onClick={() => handleNotify('Notificaciones revisadas (demo).')}


            className="relative p-2 rounded-full border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 text-slate-500 dark:text-slate-300"


          >


            <Bell size={16} />


            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-rose-500" />


          </button>


        </div>


      </div>





      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">


        {stats.map((stat) => (


          <div


            key={stat.label}


            className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-4 shadow-sm"


          >


            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">{stat.label}</p>


            <div className="mt-2 flex items-end justify-between">


              <span className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</span>


              <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">


                {stat.trend === 'up' && <TrendingUp size={12} className="text-emerald-400" />}


                {stat.trend === 'down' && <TrendingDown size={12} className="text-rose-400" />}


                {stat.trend === 'ok' && <CheckCircle2 size={12} className="text-emerald-400" />}


                {stat.delta}


              </span>


            </div>


          </div>


        ))}


      </div>





      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">


        <div className="space-y-6">


          <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 shadow-sm">


            <div className="flex items-center justify-between">


              <div>


                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Distribución</p>


                <h4 className="text-lg font-bold text-slate-900 dark:text-white">Pasajero vs conductor</h4>


              </div>


              <span className="text-sky-500 font-bold text-lg">60/40</span>


            </div>


            <div className="mt-4 space-y-4 text-xs font-semibold text-slate-600 dark:text-slate-300">


              <div className="grid grid-cols-[100px_1fr_40px] items-center gap-3">


                <span>Pasajero</span>


                <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">


                  <div className="h-full bg-sky-500" style={{ width: '60%' }} />


                </div>


                <span className="text-right text-slate-400">60%</span>


              </div>


              <div className="grid grid-cols-[100px_1fr_40px] items-center gap-3">


                <span>Conductor</span>


                <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">


                  <div className="h-full bg-indigo-400" style={{ width: '40%' }} />


                </div>


                <span className="text-right text-slate-400">40%</span>


              </div>


            </div>


          </div>





          <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 shadow-sm">


            <div className="flex items-center justify-between">


              <h4 className="text-lg font-bold text-slate-900 dark:text-white">Acciones rápidas</h4>


              <button


                onClick={() => handleNotify('Configuración de acciones lista (demo).')}


                className="text-xs font-semibold text-sky-500"


              >


                Configurar


              </button>


            </div>


            <div className="mt-4 flex flex-wrap gap-2">


              {['Reasignar: Finanzas', 'Soporte técnico', 'Escalar a admin', 'Cerrar ticket'].map((action, index) => (


                <button


                  key={action}


                  onClick={() => handleNotify(action + ' listo (demo).', action === 'Cerrar ticket' ?  'Cerrar este ticket' : undefined)}


                  className={`rounded-full px-4 py-2 text-[11px] font-semibold ${


                    index === 3 ? 'bg-rose-500/15 text-rose-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-200'


                  }`}


                >


                  {action}


                </button>


              ))}


            </div>


          </div>


        </div>





        <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 shadow-sm">


          <div className="flex items-center justify-between">


            <h4 className="text-lg font-bold text-slate-900 dark:text-white">Solicitudes entrantes</h4>


            <button


              onClick={() => handleNotify('Lista completa de tickets (demo).')}


              className="text-xs font-semibold text-sky-500"


            >


              Ver todo


            </button>


          </div>


          <div className="mt-4 space-y-3">


            {tickets.map((ticket) => (


              <div


                key={ticket.id}


                className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-4"


              >


                <div className="flex items-start justify-between gap-3">


                  <div>


                    <p className="text-xs text-slate-400">


                      Ticket {ticket.id}  {ticket.status}


                    </p>


                    <h5 className="text-sm font-semibold text-slate-900 dark:text-white">{ticket.name}</h5>


                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{ticket.note}</p>


                  </div>


                  <span className="text-[10px] text-slate-400">{ticket.time}</span>


                </div>


                <div className="mt-3 flex flex-wrap gap-2">


                  <button


                    onClick={() => handleNotify('Llamada iniciada (demo).')}


                    className="flex items-center gap-2 rounded-full bg-white dark:bg-slate-900 px-3 py-1 text-[11px] font-semibold text-slate-600 dark:text-slate-200 border border-slate-200/70 dark:border-slate-800"


                  >


                    <PhoneCall size={12} /> Llamar


                  </button>


                  <button


                    onClick={() => handleNotify('Respuesta preparada (demo).')}


                    className="flex items-center gap-2 rounded-full bg-sky-500/15 px-3 py-1 text-[11px] font-semibold text-sky-500"


                  >


                    <MessageSquare size={12} /> Responder


                  </button>


                </div>


              </div>


            ))}


          </div>


        </div>


      </div>


    </section>


  );


};


