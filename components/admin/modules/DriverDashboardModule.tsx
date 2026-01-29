import React from 'react';


import { MapPin, Zap, Trophy, Car, ArrowUpRight } from 'lucide-react';





interface ModuleProps {


  onNotify: (message: string) => void;


}





export const DriverDashboardModule: React.FC<ModuleProps> = ({ onNotify }) => {


  const handleNotify = (message: string, confirmText?: string) => {


    if (confirmText && !confirm(confirmText)) return;


    if (onNotify) onNotify(message);


  };


  return (


    <section className="space-y-6">


      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">


        <div>


          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Driver</p>


          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Panel del conductor</h3>


          <p className="text-sm text-slate-500 dark:text-slate-400">


            Estado, demanda y métricas de rendimiento en tiempo real.


          </p>


        </div>


        <button


          onClick={() => handleNotify('Estado del conductor actualizado (demo).')}


          className="rounded-full bg-emerald-500 text-white px-4 py-2 text-xs font-semibold"


        >


          En linea


        </button>


      </div>





      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">


        {[


          { label: 'Ganancia hoy', value: '$142.50', icon: Zap, tone: 'text-emerald-400' },


          { label: 'Viajes', value: '8', icon: Car, tone: 'text-sky-500' },


          { label: 'Nivel', value: 'Gold', icon: Trophy, tone: 'text-amber-400' },


          { label: 'Surge', value: '1.4x', icon: MapPin, tone: 'text-rose-400' }


        ].map((stat) => {


          const Icon = stat.icon;


          return (


            <div key={stat.label} className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-4 shadow-sm">


              <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">


                <Icon size={18} className={stat.tone} />


              </div>


              <p className="mt-3 text-xs uppercase tracking-[0.2em] text-slate-400">{stat.label}</p>


              <p className={`text-2xl font-bold ${stat.tone}`}>{stat.value}</p>


            </div>


          );


        })}


      </div>





      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">


        <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 shadow-sm">


          <div className="flex items-center justify-between">


            <h4 className="text-lg font-bold text-slate-900 dark:text-white">Mapa de demanda</h4>


            <button


              onClick={() => handleNotify('Mapa de demanda listo (demo).')}


              className="text-xs font-semibold text-sky-500 flex items-center gap-1"


            >


              Ver mapa <ArrowUpRight size={12} />


            </button>


          </div>


          <div className="mt-4 h-56 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400">


            <MapPin size={20} />


            <span className="ml-2 text-sm">Placeholder mapa</span>


          </div>


        </div>





        <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 shadow-sm">


          <h4 className="text-lg font-bold text-slate-900 dark:text-white">Estado de la jornada</h4>


          <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">


            <div className="flex items-center justify-between">


              <span>Horas conectadas</span>


              <span className="font-semibold">5h 20m</span>


            </div>


            <div className="flex items-center justify-between">


              <span>Aceptacion</span>


              <span className="font-semibold">92%</span>


            </div>


            <div className="flex items-center justify-between">


              <span>Cancelaciones</span>


              <span className="font-semibold">3%</span>


            </div>


            <button


              onClick={() => handleNotify('Panel de rendimiento listo (demo).')}


              className="w-full mt-2 rounded-xl bg-slate-900 dark:bg-sky-500 text-white py-2 text-sm font-semibold"


            >


              Ir a rendimiento


            </button>


          </div>


        </div>


      </div>


    </section>


  );


};


