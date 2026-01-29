import React from 'react';

import { TrendingUp, ArrowUpRight, Car } from 'lucide-react';



const units = [

  { id: 'VH-2201', profit: '$1,240', status: 'Alto' },

  { id: 'VH-2198', profit: '$820', status: 'Medio' },

  { id: 'VH-2186', profit: '$520', status: 'Bajo' }

];



interface ModuleProps {

  onNotify: (message: string) => void;

}



export const VehicleProfitabilityAnalyticsModule: React.FC<ModuleProps> = ({ onNotify }) => {

  const handleNotify = (message: string, confirmText?: string) => {

    if (confirmText && !confirm(confirmText)) return;

    if (onNotify) onNotify(message);

  };

  return (

    <section className="space-y-6">

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Operaciones</p>

          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Rentabilidad de vehículos</h3>

          <p className="text-sm text-slate-500 dark:text-slate-400">

            Análisis de ingresos vs costos por unidad.

          </p>

        </div>

        <button

          onClick={() => handleNotify('Exportacion de rentabilidad lista (demo).')}

          className="flex items-center gap-2 rounded-full border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 px-4 py-2 text-xs font-semibold text-slate-500 dark:text-slate-300"

        >

          <ArrowUpRight size={14} /> Exportar

        </button>

      </div>



      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {[

          { label: 'Rentabilidad promedio', value: '18%', tone: 'text-emerald-400' },

          { label: 'Unidades alto margen', value: '24', tone: 'text-sky-500' },

          { label: 'Costos altos', value: '6', tone: 'text-rose-400' },

          { label: 'Ingreso mensual', value: '$24,600', tone: 'text-amber-400' }

        ].map((stat) => (

          <div key={stat.label} className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-4 shadow-sm">

            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">{stat.label}</p>

            <p className={`mt-2 text-2xl font-bold ${stat.tone}`}>{stat.value}</p>

          </div>

        ))}

      </div>



      <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 shadow-sm">

        <div className="flex items-center justify-between">

          <h4 className="text-lg font-bold text-slate-900 dark:text-white">Ranking por unidad</h4>

          <TrendingUp size={16} className="text-emerald-400" />

        </div>

        <div className="mt-4 space-y-3">

          {units.map((unit) => (

            <div key={unit.id} className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 flex items-center justify-between">

              <div>

                <p className="text-sm font-semibold text-slate-900 dark:text-white">{unit.id}</p>

                <p className="text-xs text-slate-400">Rentabilidad {unit.status}</p>

              </div>

              <span className="text-xs font-semibold text-emerald-400">{unit.profit}</span>

            </div>

          ))}

        </div>

        <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">

          <Car size={14} /> Ajusta asignación según margen.

        </div>

      </div>

    </section>

  );

};


