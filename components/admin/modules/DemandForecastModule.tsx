import React from 'react';

import { CalendarDays, ArrowUpRight } from 'lucide-react';



const zones = [

  { name: 'Centro', demand: 78 },

  { name: 'Norte', demand: 64 },

  { name: 'Sur', demand: 51 },

  { name: 'Aeropuerto', demand: 43 }

];



interface ModuleProps {

  onNotify: (message: string) => void;

}



export const DemandForecastModule: React.FC<ModuleProps> = ({ onNotify }) => {

  const handleNotify = (message: string, confirmText?: string) => {

    if (confirmText && !confirm(confirmText)) return;

    if (onNotify) onNotify(message);

  };



  return (

    <section className="space-y-6">

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Operaciones</p>

          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Pronostico de demanda</h3>

          <p className="text-sm text-slate-500 dark:text-slate-400">

            Proyeccion de viajes por zona y horario.

          </p>

        </div>

        <button className="flex items-center gap-2 rounded-full border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 px-4 py-2 text-xs font-semibold text-slate-500 dark:text-slate-300">

          <CalendarDays size={14} /> Próxima semana

        </button>

      </div>



      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {[

          { label: 'Demanda total', value: '1,420', tone: 'text-sky-500' },

          { label: 'Zonas críticas', value: '4', tone: 'text-rose-400' },

          { label: 'Pico previsto', value: '18:00', tone: 'text-amber-400' },

          { label: 'Variacion', value: '+9%', tone: 'text-emerald-400' }

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

            <h4 className="text-lg font-bold text-slate-900 dark:text-white">Curva de demanda</h4>

            <button

              onClick={() => handleNotify('Detalle no disponible en demo.')}

              className="text-xs font-semibold text-sky-500 flex items-center gap-1"

            >

              Ver detalle <ArrowUpRight size={12} />

            </button>

          </div>

          <div className="mt-4 h-56 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-800/40 flex items-center justify-center text-xs text-slate-400">

            Grafico horario de demanda

          </div>

        </div>



        <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 shadow-sm">

          <h4 className="text-lg font-bold text-slate-900 dark:text-white">Top zonas</h4>

          <div className="mt-4 space-y-3">

            {zones.map((zone) => (

              <div key={zone.name} className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 py-3">

                <div className="flex items-center justify-between text-sm font-semibold text-slate-900 dark:text-white">

                  <span>{zone.name}</span>

                  <span className="text-slate-400">{zone.demand}%</span>

                </div>

                <div className="mt-2 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">

                  <div className="h-full bg-sky-500" style={{ width: `${zone.demand}%` }} />

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

    </section>

  );

};


