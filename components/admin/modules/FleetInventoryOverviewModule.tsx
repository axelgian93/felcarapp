import React from 'react';

import { Car, ArrowUpRight, Wrench } from 'lucide-react';



const fleet = [

  { id: 'VH-2201', model: 'Toyota Prius', status: 'Disponible' },

  { id: 'VH-2198', model: 'Kia Rio', status: 'Mantenimiento' },

  { id: 'VH-2186', model: 'Nissan Versa', status: 'Disponible' }

];



interface ModuleProps {

  onNotify: (message: string) => void;

}



export const FleetInventoryOverviewModule: React.FC<ModuleProps> = ({ onNotify }) => {

  const handleNotify = (message: string, confirmText?: string) => {

    if (confirmText && !confirm(confirmText)) return;

    if (onNotify) onNotify(message);

  };



  return (

    <section className="space-y-6">

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Operaciones</p>

          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Inventario de flota</h3>

          <p className="text-sm text-slate-500 dark:text-slate-400">

            Estado de vehículos, disponibilidad y mantenimiento.

          </p>

        </div>

        <button

          onClick={() => handleNotify('Detalle no disponible en demo.')}

          className="flex items-center gap-2 rounded-full border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 px-4 py-2 text-xs font-semibold text-slate-500 dark:text-slate-300"

        >

          <ArrowUpRight size={14} /> Ver detalle

        </button>

      </div>



      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {[

          { label: 'Vehículos activos', value: '142', tone: 'text-sky-500' },

          { label: 'Disponibles', value: '118', tone: 'text-emerald-400' },

          { label: 'Mantenimiento', value: '12', tone: 'text-amber-400' },

          { label: 'Fuera de servicio', value: '4', tone: 'text-rose-400' }

        ].map((stat) => (

          <div key={stat.label} className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-4 shadow-sm">

            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">{stat.label}</p>

            <p className={`mt-2 text-2xl font-bold ${stat.tone}`}>{stat.value}</p>

          </div>

        ))}

      </div>



      <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 shadow-sm">

        <div className="flex items-center justify-between">

          <h4 className="text-lg font-bold text-slate-900 dark:text-white">Unidades recientes</h4>

          <Wrench size={16} className="text-amber-400" />

        </div>

        <div className="mt-4 space-y-3">

          {fleet.map((item) => (

            <div key={item.id} className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 flex items-center justify-between">

              <div>

                <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.id}</p>

                <p className="text-xs text-slate-400">{item.model}</p>

              </div>

              <span className={`text-xs font-semibold ${item.status === 'Disponible' ?  'text-emerald-400' : 'text-amber-400'}`}>

                {item.status}

              </span>

            </div>

          ))}

        </div>

        <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">

          <Car size={14} /> Planifica mantenimientos preventivos.

        </div>

      </div>

    </section>

  );

};


