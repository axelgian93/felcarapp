import React from 'react';


import { Clock, Bell, ArrowUpRight } from 'lucide-react';





const logs = [


  { task: 'Cambio de aceite', due: '12 Feb', status: 'Pendiente' },


  { task: 'Revisión frenos', due: '18 Feb', status: 'Programado' },


  { task: 'Inspeccion luces', due: '05 Feb', status: 'Completado' }


];





interface ModuleProps {


  onNotify: (message: string) => void;


}





export const MaintenanceLogRemindersModule: React.FC<ModuleProps> = ({ onNotify }) => {


  const handleNotify = (message: string, confirmText?: string) => {


    if (confirmText && !confirm(confirmText)) return;


    if (onNotify) onNotify(message);


  };


  return (


    <section className="space-y-6">


      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">


        <div>


          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Operaciones</p>


          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Log y recordatorios</h3>


          <p className="text-sm text-slate-500 dark:text-slate-400">


            Historial y recordatorios de mantenimiento.


          </p>


        </div>


        <button

          onClick={() => handleNotify('Historial de mantenimiento listo (demo).')}

          className="flex items-center gap-2 rounded-full border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 px-4 py-2 text-xs font-semibold text-slate-500 dark:text-slate-300"

        >

          <ArrowUpRight size={14} /> Ver historial

        </button>

      </div>





      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">


        {[


          { label: 'Recordatorios activos', value: '6', tone: 'text-amber-400' },


          { label: 'Tareas completadas', value: '28', tone: 'text-emerald-400' },


          { label: 'Pendientes', value: '4', tone: 'text-rose-400' },


          { label: 'Próximo vencimiento', value: '12 Feb', tone: 'text-sky-500' }


        ].map((stat) => (


          <div key={stat.label} className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-4 shadow-sm">


            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">{stat.label}</p>


            <p className={`mt-2 text-2xl font-bold ${stat.tone}`}>{stat.value}</p>


          </div>


        ))}


      </div>





      <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 shadow-sm">


        <div className="flex items-center justify-between">


          <h4 className="text-lg font-bold text-slate-900 dark:text-white">Próximas tareas</h4>


          <Bell size={16} className="text-amber-400" />


        </div>


        <div className="mt-4 space-y-3">


          {logs.map((item) => (


            <div key={item.task} className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 flex items-center justify-between">


              <div>


                <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.task}</p>


                <p className="text-xs text-slate-400">Vence {item.due}</p>


              </div>


              <span className={`text-xs font-semibold ${item.status === 'Completado' ? 'text-emerald-400' : item.status === 'Programado' ? 'text-sky-500' : 'text-amber-400'}`}>


                {item.status}


              </span>


            </div>


          ))}


        </div>


        <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">


          <Clock size={14} /> Configura recordatorios automáticos por kilometraje.


        </div>


      </div>


    </section>


  );


};





