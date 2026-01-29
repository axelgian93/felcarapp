import React from 'react';


import { Activity, Users, Car, AlertTriangle, ArrowUpRight, MapPin } from 'lucide-react';





interface ModuleProps {


  onNotify: (message: string) => void;


}





const liveStats = [


  { label: 'Usuarios activos', value: '2,450', tone: 'text-sky-500' },


  { label: 'Conductores en linea', value: '312', tone: 'text-emerald-400' },


  { label: 'Viajes en curso', value: '180', tone: 'text-amber-400' },


  { label: 'Alertas críticas', value: '3', tone: 'text-rose-400' }


];





const liveFeed = [


  { title: 'Alerta SOS', subtitle: 'Zona: Urdesa  Rider ID 992', tone: 'text-rose-400' },


  { title: 'Pico de demanda', subtitle: 'Centro  +28% vs promedio', tone: 'text-amber-400' },


  { title: 'Congestion', subtitle: 'Via a la Costa  2.4 km', tone: 'text-slate-400' }


];





export const SuperAdminLiveMonitor: React.FC<ModuleProps> = ({ onNotify }) => {


  const handleNotify = (message: string, confirmText?: string) => {


    if (confirmText && !confirm(confirmText)) return;


    if (onNotify) onNotify(message);


  };


  return (


    <section className="space-y-6">


      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">


        <div>


          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Super Admin</p>


          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Monitor en vivo</h3>


          <p className="text-sm text-slate-500 dark:text-slate-400">


            Vista global de actividad, alertas y desempeno en tiempo real.


          </p>


        </div>


        <button


          onClick={() => handleNotify('Live activo (demo).')}


          className="flex items-center gap-2 rounded-full border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 px-4 py-2 text-xs font-semibold text-slate-500 dark:text-slate-300"


        >


          <Activity size={14} />


          Live activo


        </button>


      </div>





      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">


        {liveStats.map((stat) => (


          <div key={stat.label} className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-4 shadow-sm">


            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">{stat.label}</p>


            <p className={`mt-2 text-2xl font-bold ${stat.tone}`}>{stat.value}</p>


          </div>


        ))}


      </div>





      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">


        <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 shadow-sm">


          <div className="flex items-center justify-between">


            <h4 className="text-lg font-bold text-slate-900 dark:text-white">Mapa en vivo</h4>


            <button


              onClick={() => handleNotify('Mapa global listo (demo).')}


              className="text-xs font-semibold text-sky-500 flex items-center gap-1"


            >


              Abrir mapa <ArrowUpRight size={12} />


            </button>


          </div>


          <div className="mt-4 h-64 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400">


            <MapPin size={20} />


            <span className="ml-2 text-sm">Placeholder mapa global</span>


          </div>


        </div>





        <div className="space-y-6">


          <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 shadow-sm">


            <h4 className="text-lg font-bold text-slate-900 dark:text-white">Alertas críticas</h4>


            <div className="mt-4 space-y-3">


              {liveFeed.map((item) => (


                <div key={item.title} className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 py-3">


                  <div className="flex items-center gap-3">


                    <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-900 flex items-center justify-center">


                      <AlertTriangle size={14} className={item.tone} />


                    </div>


                    <div>


                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.title}</p>


                      <p className="text-xs text-slate-400">{item.subtitle}</p>


                    </div>


                  </div>


                </div>


              ))}


            </div>


          </div>





          <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 shadow-sm">


            <h4 className="text-lg font-bold text-slate-900 dark:text-white">Uso por segmento</h4>


            <div className="mt-4 space-y-3 text-xs text-slate-500 dark:text-slate-400">


              {[


                { label: 'Riders', value: 62, color: 'bg-sky-500' },


                { label: 'Drivers', value: 28, color: 'bg-emerald-400' },


                { label: 'Corporate', value: 10, color: 'bg-amber-400' }


              ].map((row) => (


                <div key={row.label}>


                  <div className="flex justify-between mb-1 font-semibold">


                    <span>{row.label}</span>


                    <span>{row.value}%</span>


                  </div>


                  <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">


                    <div className={`h-full ${row.color}`} style={{ width: `${row.value}%` }} />


                  </div>


                </div>


              ))}


            </div>


          </div>


        </div>


      </div>





      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">


        {[


          { label: 'Riders activos', value: '1,820', icon: Users },


          { label: 'Drivers activos', value: '298', icon: Car },


          { label: 'Tickets abiertos', value: '86', icon: AlertTriangle },


          { label: 'Alertas zona', value: '12', icon: Activity }


        ].map((item) => {


          const Icon = item.icon;


          return (


            <div key={item.label} className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-4 shadow-sm flex items-center gap-3">


              <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">


                <Icon size={18} />


              </div>


              <div>


                <p className="text-xs text-slate-400 uppercase tracking-[0.2em]">{item.label}</p>


                <p className="text-lg font-bold text-slate-900 dark:text-white">{item.value}</p>


              </div>


            </div>


          );


        })}


      </div>


    </section>


  );


};


