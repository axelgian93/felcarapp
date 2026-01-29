import React from 'react';


import { MapPin, Users, ArrowUpRight } from 'lucide-react';





const ranks = [


  { name: 'Terminal Norte', queue: 14, avg: '18 min' },


  { name: 'Aeropuerto', queue: 22, avg: '26 min' },


  { name: 'Centro', queue: 10, avg: '14 min' }


];





interface ModuleProps {


  onNotify: (message: string) => void;


}





export const TaxiRankQueuesModule: React.FC<ModuleProps> = ({ onNotify }) => {


  const handleNotify = (message: string, confirmText?: string) => {


    if (confirmText && !confirm(confirmText)) return;


    if (onNotify) onNotify(message);


  };


  return (


    <section className="space-y-6">


      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">


        <div>


          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Operaciones</p>


          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Colas de taxis</h3>


          <p className="text-sm text-slate-500 dark:text-slate-400">


            Control de filas y tiempos por paradero.


          </p>


        </div>


        <button

          onClick={() => handleNotify('Vista de mapa de paraderos lista (demo).')}

          className="flex items-center gap-2 rounded-full border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 px-4 py-2 text-xs font-semibold text-slate-500 dark:text-slate-300"

        >

          <ArrowUpRight size={14} /> Ver mapa

        </button>

      </div>





      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">


        {[


          { label: 'Paraderos activos', value: '6', tone: 'text-sky-500' },


          { label: 'Conductores en cola', value: '46', tone: 'text-emerald-400' },


          { label: 'Tiempo promedio', value: '19 min', tone: 'text-amber-400' },


          { label: 'Alertas', value: '2', tone: 'text-rose-400' }


        ].map((stat) => (


          <div key={stat.label} className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-4 shadow-sm">


            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">{stat.label}</p>


            <p className={`mt-2 text-2xl font-bold ${stat.tone}`}>{stat.value}</p>


          </div>


        ))}


      </div>





      <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 shadow-sm">


        <div className="flex items-center justify-between">


          <h4 className="text-lg font-bold text-slate-900 dark:text-white">Paraderos</h4>


          <Users size={16} className="text-sky-500" />


        </div>


        <div className="mt-4 space-y-3">


          {ranks.map((rank) => (


            <div key={rank.name} className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 flex items-center justify-between">


              <div>


                <p className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">


                  <MapPin size={14} className="text-sky-500" /> {rank.name}


                </p>


                <p className="text-xs text-slate-400">Espera {rank.avg}</p>


              </div>


              <span className="text-xs font-semibold text-emerald-400">{rank.queue} en cola</span>


            </div>


          ))}


        </div>


      </div>


    </section>


  );


};





