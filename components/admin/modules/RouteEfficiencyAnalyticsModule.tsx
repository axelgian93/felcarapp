import React from 'react';

import { Route, TrendingUp, ArrowUpRight } from 'lucide-react';



const metrics = [

  { label: 'Distancia promedio', value: '6.2 km', tone: 'text-sky-500' },

  { label: 'Tiempo promedio', value: '18 min', tone: 'text-emerald-400' },

  { label: 'Desvios', value: '4.8%', tone: 'text-rose-400' },

  { label: 'Ahorro estimado', value: '$1,240', tone: 'text-amber-400' }

];



interface ModuleProps {

  onNotify: (message: string) => void;

}



export const RouteEfficiencyAnalyticsModule: React.FC<ModuleProps> = ({ onNotify }) => {

  const handleNotify = (message: string, confirmText?: string) => {

    if (confirmText && !confirm(confirmText)) return;

    if (onNotify) onNotify(message);

  };



  return (

    <section className="space-y-6">

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Operaciones</p>

          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Eficiencia de rutas</h3>

          <p className="text-sm text-slate-500 dark:text-slate-400">

            Análisis de tiempos, distancias y cumplimiento.

          </p>

        </div>

        <button

          onClick={() => handleNotify('Reporte exportado (mock).', 'Exportar reporte')}

          className="flex items-center gap-2 rounded-full border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 px-4 py-2 text-xs font-semibold text-slate-500 dark:text-slate-300"

        >

          <ArrowUpRight size={14} /> Exportar

        </button>

      </div>



      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {metrics.map((stat) => (

          <div key={stat.label} className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-4 shadow-sm">

            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">{stat.label}</p>

            <p className={`mt-2 text-2xl font-bold ${stat.tone}`}>{stat.value}</p>

          </div>

        ))}

      </div>



      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">

        <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <h4 className="text-lg font-bold text-slate-900 dark:text-white">Comparativo semanal</h4>

            <TrendingUp size={16} className="text-emerald-400" />

          </div>

          <div className="mt-4 h-56 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-800/40 flex items-center justify-center text-xs text-slate-400">

            Grafico de eficiencia semanal

          </div>

        </div>



        <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 shadow-sm">

          <h4 className="text-lg font-bold text-slate-900 dark:text-white">Alertas de ruta</h4>

          <div className="mt-4 space-y-3 text-xs text-slate-500 dark:text-slate-300">

            {[

              '3 rutas con desvio alto',

              '2 rutas con retraso > 10 min',

              '1 zona con baja cobertura'

            ].map((alert) => (

              <div key={alert} className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 flex items-center gap-2">

                <Route size={14} className="text-sky-500" /> {alert}

              </div>

            ))}

          </div>

        </div>

      </div>

    </section>

  );

};


