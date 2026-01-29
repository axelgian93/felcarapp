import React from 'react';


import { ArrowUpRight, DollarSign } from 'lucide-react';





interface ModuleProps {


  onNotify: (message: string) => void;


}





const days = [


  { day: 'Lunes', amount: '$42.50', trips: 8 },


  { day: 'Martes', amount: '$38.20', trips: 7 },


  { day: 'Miercoles', amount: '$46.10', trips: 9 }


];





export const WeeklyEarningsSummaryModule: React.FC<ModuleProps> = ({ onNotify }) => {


  const handleNotify = (message: string, confirmText?: string) => {


    if (confirmText && !confirm(confirmText)) return;


    if (onNotify) onNotify(message);


  };


  return (


    <section className="space-y-6">


      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">


        <div>


          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Conductores</p>


          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Resumen semanal</h3>


          <p className="text-sm text-slate-500 dark:text-slate-400">


            Ingresos por día y metas semanales.


          </p>


        </div>


        <button


          onClick={() => handleNotify('Detalle semanal listo (demo).')}


          className="flex items-center gap-2 rounded-full border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 px-4 py-2 text-xs font-semibold text-slate-500 dark:text-slate-300"


        >


          <ArrowUpRight size={14} /> Ver detalle


        </button>


      </div>





      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">


        {[


          { label: 'Ingresos semana', value: '$286.40', tone: 'text-emerald-400' },


          { label: 'Viajes completados', value: '28', tone: 'text-sky-500' },


          { label: 'Objetivo', value: '86%', tone: 'text-amber-400' },


          { label: 'Bonos', value: '$36', tone: 'text-rose-400' }


        ].map((stat) => (


          <div key={stat.label} className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-4 shadow-sm">


            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">{stat.label}</p>


            <p className={`mt-2 text-2xl font-bold ${stat.tone}`}>{stat.value}</p>


          </div>


        ))}


      </div>





      <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 shadow-sm">


        <div className="flex items-center justify-between">


          <h4 className="text-lg font-bold text-slate-900 dark:text-white">Detalle por día</h4>


          <DollarSign size={16} className="text-emerald-400" />


        </div>


        <div className="mt-4 space-y-3">


          {days.map((item) => (


            <div key={item.day} className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 flex items-center justify-between">


              <div>


                <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.day}</p>


                <p className="text-xs text-slate-400">{item.trips} viajes</p>


              </div>


              <span className="text-xs font-semibold text-emerald-400">{item.amount}</span>


            </div>


          ))}


        </div>


      </div>


    </section>


  );


};


