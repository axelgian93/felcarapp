import React from 'react';


import { Bell, ArrowUpRight } from 'lucide-react';





const rules = [


  { name: 'Zona urbana', limit: '60 km/h', status: 'Activo' },


  { name: 'Vías rápidas', limit: '90 km/h', status: 'Activo' },


  { name: 'Zona escolar', limit: '40 km/h', status: 'En revisión' }


];





interface SpeedAlertConfigurationModuleProps {


  onNotify: (message: string) => void;


}





export const SpeedAlertConfigurationModule: React.FC<SpeedAlertConfigurationModuleProps> = ({ onNotify }) => {


  const handleCreate = () => {


    if (!confirm('Crear nueva regla de velocidad')) return;


    if (onNotify) {


      onNotify('Regla de velocidad creada (mock).');


    }


  };


  return (


    <section className="space-y-6">


      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">


        <div>


          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Operaciones</p>


          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Configuración de velocidad</h3>


          <p className="text-sm text-slate-500 dark:text-slate-400">


            Reglas y umbrales para alertas de velocidad.


          </p>


        </div>


        <button onClick={handleCreate} className="flex items-center gap-2 rounded-full bg-emerald-500 text-white px-4 py-2 text-xs font-semibold shadow-sm">


          <Bell size={14} /> Nueva regla


        </button>


      </div>





      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">


        {[


          { label: 'Reglas activas', value: '3', tone: 'text-sky-500' },


          { label: 'Alertas diarias', value: '12', tone: 'text-rose-400' },


          { label: 'Cumplimiento', value: '88%', tone: 'text-emerald-400' },


          { label: 'Zonas monitoreadas', value: '5', tone: 'text-amber-400' }


        ].map((stat) => (


          <div key={stat.label} className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-4 shadow-sm">


            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">{stat.label}</p>


            <p className={`mt-2 text-2xl font-bold ${stat.tone}`}>{stat.value}</p>


          </div>


        ))}


      </div>





      <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 shadow-sm">


        <div className="flex items-center justify-between">


          <h4 className="text-lg font-bold text-slate-900 dark:text-white">Reglas configuradas</h4>


          <ArrowUpRight size={16} className="text-sky-500" />


        </div>


        <div className="mt-4 space-y-3">


          {rules.map((rule) => (


            <div key={rule.name} className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 flex items-center justify-between">


              <div>


                <p className="text-sm font-semibold text-slate-900 dark:text-white">{rule.name}</p>


                <p className="text-xs text-slate-400">Limite {rule.limit}</p>


              </div>


              <span className={`text-xs font-semibold ${rule.status === 'Activo' ?  'text-emerald-400' : 'text-amber-400'}`}>


                {rule.status}


              </span>


            </div>


          ))}


        </div>


      </div>


    </section>


  );


};


