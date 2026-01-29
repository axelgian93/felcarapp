import React from 'react';

import { MapPin, Flame, ArrowUpRight } from 'lucide-react';



const hotspots = [

  { zone: 'Centro', level: 'Alto', surge: '1.6x' },

  { zone: 'Aeropuerto', level: 'Medio', surge: '1.3x' },

  { zone: 'Terminal', level: 'Medio', surge: '1.2x' }

];



interface ModuleProps {

  onNotify: (message: string) => void;

}



export const DemandHeatMapModule: React.FC<ModuleProps> = ({ onNotify }) => {

  const handleNotify = (message: string, confirmText?: string) => {

    if (confirmText && !confirm(confirmText)) return;

    if (onNotify) onNotify(message);

  };



  return (

    <section className="space-y-6">

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Operaciones</p>

          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Mapa de calor</h3>

          <p className="text-sm text-slate-500 dark:text-slate-400">

            Visualizacion de demanda en tiempo real.

          </p>

        </div>

        <button

          onClick={() => handleNotify('Vista en vivo no disponible en demo.')}

          className="flex items-center gap-2 rounded-full border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 px-4 py-2 text-xs font-semibold text-slate-500 dark:text-slate-300"

        >

          <ArrowUpRight size={14} /> Ver en vivo

        </button>

      </div>



      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">

        <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <h4 className="text-lg font-bold text-slate-900 dark:text-white">Mapa operativo</h4>

            <span className="text-xs font-semibold text-rose-400 flex items-center gap-1">

              <Flame size={12} /> Alta demanda

            </span>

          </div>

          <div className="mt-4 h-72 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-800/40 flex items-center justify-center text-xs text-slate-400">

            Heatmap en tiempo real

          </div>

        </div>



        <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 shadow-sm">

          <h4 className="text-lg font-bold text-slate-900 dark:text-white">Zonas críticas</h4>

          <div className="mt-4 space-y-3">

            {hotspots.map((hotspot) => (

              <div key={hotspot.zone} className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 py-3">

                <div className="flex items-center justify-between">

                  <p className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">

                    <MapPin size={14} className="text-sky-500" /> {hotspot.zone}

                  </p>

                  <span className="text-xs font-semibold text-rose-400">{hotspot.surge}</span>

                </div>

                <p className="text-xs text-slate-400">Nivel {hotspot.level}</p>

              </div>

            ))}

          </div>

        </div>

      </div>

    </section>

  );

};


