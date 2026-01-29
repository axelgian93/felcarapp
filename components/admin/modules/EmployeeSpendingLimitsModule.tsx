import React from 'react';


import { ShieldCheck, Plus, ArrowUpRight } from 'lucide-react';





interface ModuleProps {


  onNotify: (message: string) => void;


}





const limits = [


  { name: 'Gerencia', cap: '$120', status: 'Activo' },


  { name: 'Supervision', cap: '$60', status: 'Activo' },


  { name: 'Operativo', cap: '$30', status: 'En revisión' }


];





export const EmployeeSpendingLimitsModule: React.FC<ModuleProps> = ({ onNotify }) => {


  const handleNotify = (message: string, confirmText?: string) => {


    if (confirmText && !confirm(confirmText)) return;


    if (onNotify) onNotify(message);


  };


  return (


    <section className="space-y-6">


      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">


        <div>


          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Corporativo</p>


          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Límites de gasto</h3>


          <p className="text-sm text-slate-500 dark:text-slate-400">


            Reglas por rol y topes diarios o semanales.


          </p>


        </div>


        <button


          onClick={() => handleNotify('Límite agregado (demo).')}


          className="flex items-center gap-2 rounded-full bg-emerald-500 text-white px-4 py-2 text-xs font-semibold shadow-sm"


        >


          <Plus size={14} /> Agregar límite


        </button>


      </div>





      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">


        {[


          { label: 'Reglas activas', value: '3', tone: 'text-sky-500' },


          { label: 'Aprobaciones', value: '6', tone: 'text-amber-400' },


          { label: 'Excepciones', value: '2', tone: 'text-rose-400' },


          { label: 'Cumplimiento', value: '92%', tone: 'text-emerald-400' }


        ].map((stat) => (


          <div key={stat.label} className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-4 shadow-sm">


            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">{stat.label}</p>


            <p className={`mt-2 text-2xl font-bold ${stat.tone}`}>{stat.value}</p>


          </div>


        ))}


      </div>





      <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 shadow-sm">


        <div className="flex items-center justify-between">


          <h4 className="text-lg font-bold text-slate-900 dark:text-white">Topes por rol</h4>


          <button


            onClick={() => handleNotify('Detalle de límites listo (demo).')}


            className="text-xs font-semibold text-sky-500 flex items-center gap-1"


          >


            Ver detalle <ArrowUpRight size={12} />


          </button>


        </div>


        <div className="mt-4 space-y-3">


          {limits.map((item) => (


            <div key={item.name} className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 flex items-center justify-between">


              <div>


                <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.name}</p>


                <p className="text-xs text-slate-400">Tope diario {item.cap}</p>


              </div>


              <span className={`text-xs font-semibold ${item.status === 'Activo' ?  'text-emerald-400' : 'text-amber-400'}`}>


                {item.status}


              </span>


            </div>


          ))}


        </div>


        <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">


          <ShieldCheck size={14} /> Ajusta reglas por equipo.


        </div>


      </div>


    </section>


  );


};


