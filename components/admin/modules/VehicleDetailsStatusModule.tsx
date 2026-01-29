import React from 'react';


import { ArrowUpRight, Gauge, AlertTriangle } from 'lucide-react';





interface ModuleProps {


  onNotify: (message: string) => void;


}





const issues = [


  { item: 'Frenos', status: 'OK' },


  { item: 'Luces', status: 'Revisar' },


  { item: 'Neumaticos', status: 'OK' }


];





export const VehicleDetailsStatusModule: React.FC<ModuleProps> = ({ onNotify }) => {


  const handleNotify = (message: string, confirmText?: string) => {


    if (confirmText && !confirm(confirmText)) return;


    if (onNotify) onNotify(message);


  };


  return (


    <section className="space-y-6">


      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">


        <div>


          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Conductores</p>


          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Estado del vehículo</h3>


          <p className="text-sm text-slate-500 dark:text-slate-400">


            Detalle técnico y alertas del vehículo.


          </p>


        </div>


        <button


          onClick={() => handleNotify('Historial del vehículo listo (demo).')}


          className="flex items-center gap-2 rounded-full border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 px-4 py-2 text-xs font-semibold text-slate-500 dark:text-slate-300"


        >


          <ArrowUpRight size={14} /> Ver historial


        </button>


      </div>





      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">


        {[


          { label: 'Kilometraje', value: '42,120 km', tone: 'text-sky-500' },


          { label: 'Último mantenimiento', value: '12 Ene', tone: 'text-emerald-400' },


          { label: 'Alertas', value: '1', tone: 'text-rose-400' },


          { label: 'Próxima revisión', value: '28 Feb', tone: 'text-amber-400' }


        ].map((stat) => (


          <div key={stat.label} className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-4 shadow-sm">


            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">{stat.label}</p>


            <p className={`mt-2 text-2xl font-bold ${stat.tone}`}>{stat.value}</p>


          </div>


        ))}


      </div>





      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">


        <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 shadow-sm">


          <div className="flex items-center justify-between">


            <h4 className="text-lg font-bold text-slate-900 dark:text-white">Checklist rápido</h4>


            <Gauge size={16} className="text-sky-500" />


          </div>


          <div className="mt-4 space-y-3">


            {issues.map((item) => (


              <div key={item.item} className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 flex items-center justify-between">


                <span className="text-sm text-slate-900 dark:text-white">{item.item}</span>


                <span className={`text-xs font-semibold ${item.status === 'OK' ?  'text-emerald-400' : 'text-amber-400'}`}>


                  {item.status}


                </span>


              </div>


            ))}


          </div>


        </div>





        <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 shadow-sm">


          <h4 className="text-lg font-bold text-slate-900 dark:text-white">Alertas activas</h4>


          <div className="mt-4 space-y-3 text-xs text-slate-500 dark:text-slate-300">


            <div className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 flex items-center gap-2">


              <AlertTriangle size={14} className="text-amber-400" /> Luz trasera izquierda


            </div>


            <div className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 flex items-center gap-2">


              <AlertTriangle size={14} className="text-rose-400" /> Presion de llantas baja


            </div>


          </div>


        </div>


      </div>


    </section>


  );


};


