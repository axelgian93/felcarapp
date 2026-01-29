import React from 'react';


import { MapPin, Truck, Clock, AlertTriangle, ArrowUpRight } from 'lucide-react';





interface ModuleProps {


  onNotify: (message: string) => void;


}





const stats = [


  { label: 'Entregas activas', value: '86', tone: 'text-sky-500' },


  { label: 'En ruta', value: '54', tone: 'text-emerald-400' },


  { label: 'Con incidencias', value: '8', tone: 'text-rose-400' },


  { label: 'Promedio ETA', value: '12m', tone: 'text-amber-400' }


];





const deliveries = [


  { id: 'DL-2045', route: 'Centro  Norte', driver: 'Marco P.', eta: '8m', status: 'En ruta' },


  { id: 'DL-2091', route: 'Terminal  Samborondon', driver: 'Ana R.', eta: '15m', status: 'En ruta' },


  { id: 'DL-2102', route: 'Mall  Urdesa', driver: 'Luis C.', eta: 'Retraso', status: 'Incidencia' },


  { id: 'DL-2120', route: 'Kennedy  Via a la Costa', driver: 'Paola M.', eta: '10m', status: 'En ruta' }


];





export const ActiveDeliveriesMonitor: React.FC<ModuleProps> = ({ onNotify }) => {


  const handleNotify = (message: string, confirmText?: string) => {


    if (confirmText && !confirm(confirmText)) return;


    if (onNotify) onNotify(message);


  };


  return (


    <section className="space-y-6">


      <div>


        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Operaciones</p>


        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Monitoreo de entregas</h3>


        <p className="text-sm text-slate-500 dark:text-slate-400">


          Seguimiento en tiempo real de envíos activos, rutas y alertas.


        </p>


      </div>





      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">


        {stats.map((stat) => (


          <div key={stat.label} className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-4 shadow-sm">


            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">{stat.label}</p>


            <p className={`mt-2 text-2xl font-bold ${stat.tone}`}>{stat.value}</p>


          </div>


        ))}


      </div>





      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">


        <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 shadow-sm">


          <div className="flex items-center justify-between">


            <h4 className="text-lg font-bold text-slate-900 dark:text-white">Mapa de actividad</h4>


            <button


              onClick={() => handleNotify('Mapa operativo listo (demo).')}


              className="text-xs font-semibold text-sky-500 flex items-center gap-1"


            >


              Ver mapa completo <ArrowUpRight size={12} />


            </button>


          </div>


          <div className="mt-4 h-56 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400">


            <MapPin size={20} />


            <span className="ml-2 text-sm">Placeholder mapa operativo</span>


          </div>


        </div>





        <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 shadow-sm">


          <h4 className="text-lg font-bold text-slate-900 dark:text-white">Alertas recientes</h4>


          <div className="mt-4 space-y-3">


            {[


              { title: 'Retraso detectado', subtitle: 'DL-2102  7 min', tone: 'text-rose-400' },


              { title: 'Desvio de ruta', subtitle: 'DL-2045  1 km', tone: 'text-amber-400' },


              { title: 'Llegada a destino', subtitle: 'DL-2031  Completado', tone: 'text-emerald-400' }


            ].map((alert) => (


              <div key={alert.title} className="flex items-center gap-3 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 py-3">


                <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-900 flex items-center justify-center">


                  <AlertTriangle size={14} className={alert.tone} />


                </div>


                <div>


                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{alert.title}</p>


                  <p className="text-xs text-slate-400">{alert.subtitle}</p>


                </div>


              </div>


            ))}


          </div>


        </div>


      </div>





      <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 shadow-sm">


        <div className="flex items-center justify-between">


          <h4 className="text-lg font-bold text-slate-900 dark:text-white">Entregas activas</h4>


          <button


            onClick={() => handleNotify('Lista completa de entregas (demo).')}


            className="text-xs font-semibold text-sky-500"


          >


            Ver todo


          </button>


        </div>


        <div className="mt-4 space-y-3">


          {deliveries.map((delivery) => (


            <div key={delivery.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 py-3">


              <div>


                <p className="text-sm font-semibold text-slate-900 dark:text-white">{delivery.id}</p>


                <p className="text-xs text-slate-400">{delivery.route}</p>


              </div>


              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">


                <Truck size={14} />


                {delivery.driver}


              </div>


              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">


                <Clock size={14} />


                {delivery.eta}


              </div>


              <span className={`text-xs font-semibold ${delivery.status === 'Incidencia' ?  'text-rose-400' : 'text-emerald-400'}`}>


                {delivery.status}


              </span>


            </div>


          ))}


        </div>


      </div>


    </section>


  );


};


