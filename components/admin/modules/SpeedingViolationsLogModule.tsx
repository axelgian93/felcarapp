import React from 'react';


import { ArrowUpRight, AlertTriangle } from 'lucide-react';





const speeds = [


  { driver: 'VH-2210', speed: '92 km/h', limit: '60 km/h', status: 'Alerta' },


  { driver: 'VH-2198', speed: '78 km/h', limit: '60 km/h', status: 'Alerta' },


  { driver: 'VH-2204', speed: '62 km/h', limit: '60 km/h', status: 'Resuelto' }


];





interface SpeedingViolationsLogModuleProps {


  onNotify: (message: string) => void;


}





export const SpeedingViolationsLogModule: React.FC<SpeedingViolationsLogModuleProps> = ({ onNotify }) => {


  const handleView = () => {


    if (onNotify) {


      onNotify('Detalle de excesos no disponible en demo.');


    }


  };


  return (


    <section className="space-y-6">


      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">


        <div>


          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Operaciones</p>


          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Registro de exceso de velocidad</h3>


          <p className="text-sm text-slate-500 dark:text-slate-400">


            Historial de alertas y resoluciones.


          </p>


        </div>


        <button onClick={handleView} className="flex items-center gap-2 rounded-full border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 px-4 py-2 text-xs font-semibold text-slate-500 dark:text-slate-300">


          <ArrowUpRight size={14} /> Ver detalle


        </button>


      </div>





      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">


        {[


          { label: 'Alertas activas', value: '4', tone: 'text-rose-400' },


          { label: 'Límite promedio', value: '60 km/h', tone: 'text-sky-500' },


          { label: 'Resolucion', value: '86%', tone: 'text-emerald-400' },


          { label: 'Incidentes hoy', value: '7', tone: 'text-amber-400' }


        ].map((stat) => (


          <div key={stat.label} className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-4 shadow-sm">


            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">{stat.label}</p>


            <p className={`mt-2 text-2xl font-bold ${stat.tone}`}>{stat.value}</p>


          </div>


        ))}


      </div>





      <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 shadow-sm">


        <div className="flex items-center justify-between">


          <h4 className="text-lg font-bold text-slate-900 dark:text-white">Alertas recientes</h4>


          <AlertTriangle size={16} className="text-rose-400" />


        </div>


        <div className="mt-4 space-y-3">


          {speeds.map((item) => (


            <div key={item.driver} className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 flex items-center justify-between">


              <div>


                <p className="text-sm font-semibold text-slate-900 dark:text-white">Unidad {item.driver}</p>


                <p className="text-xs text-slate-400">{item.speed}  Limite {item.limit}</p>


              </div>


              <span className={`text-xs font-semibold ${item.status === 'Resuelto' ?  'text-emerald-400' : 'text-rose-400'}`}>


                {item.status}


              </span>


            </div>


          ))}


        </div>


      </div>


    </section>


  );


};



