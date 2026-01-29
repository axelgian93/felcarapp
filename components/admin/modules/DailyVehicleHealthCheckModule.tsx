import React from 'react';


import { ClipboardCheck, ArrowUpRight, AlertTriangle } from 'lucide-react';





interface ModuleProps {


  onNotify: (message: string) => void;


}





const checks = [


  { item: 'Frenos', status: 'OK' },


  { item: 'Luces', status: 'OK' },


  { item: 'Neumaticos', status: 'Revisar' },


  { item: 'Documentos', status: 'OK' }


];





export const DailyVehicleHealthCheckModule: React.FC<ModuleProps> = ({ onNotify }) => {


  const handleNotify = (message: string, confirmText?: string) => {


    if (confirmText && !confirm(confirmText)) return;


    if (onNotify) onNotify(message);


  };


  return (


    <section className="space-y-6">


      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">


        <div>


          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Conductores</p>


          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Chequeo diario del vehículo</h3>


          <p className="text-sm text-slate-500 dark:text-slate-400">


            Verificación rápida antes de iniciar turno.


          </p>


        </div>


        <button


          onClick={() => handleNotify('Historial de chequeos listo (demo).')}


          className="flex items-center gap-2 rounded-full border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 px-4 py-2 text-xs font-semibold text-slate-500 dark:text-slate-300"


        >


          <ArrowUpRight size={14} /> Ver historial


        </button>


      </div>





      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">


        {[


          { label: 'Checks completados', value: '18', tone: 'text-emerald-400' },


          { label: 'Pendientes', value: '2', tone: 'text-amber-400' },


          { label: 'Alertas', value: '1', tone: 'text-rose-400' },


          { label: 'Tiempo promedio', value: '4 min', tone: 'text-sky-500' }


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


            <ClipboardCheck size={16} className="text-emerald-400" />


          </div>


          <div className="mt-4 space-y-3">


            {checks.map((item) => (


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


          <h4 className="text-lg font-bold text-slate-900 dark:text-white">Alertas</h4>


          <div className="mt-4 space-y-3 text-xs text-slate-500 dark:text-slate-300">


            <div className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 flex items-center gap-2">


              <AlertTriangle size={14} className="text-amber-400" /> Neumatico delantero bajo


            </div>


            <div className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 flex items-center gap-2">


              <AlertTriangle size={14} className="text-rose-400" /> Luz trasera pendiente


            </div>


          </div>


        </div>


      </div>


    </section>


  );


};


