import React from 'react';

import { CalendarDays, Users, ArrowUpRight } from 'lucide-react';



const shifts = [

  { day: 'Lunes', slots: '08:00 - 16:00', coverage: '80%' },

  { day: 'Martes', slots: '10:00 - 18:00', coverage: '72%' },

  { day: 'Miercoles', slots: '12:00 - 20:00', coverage: '65%' }

];



interface ModuleProps {

  onNotify: (message: string) => void;

}



export const ShiftSchedulerModule: React.FC<ModuleProps> = ({ onNotify }) => {

  const handleNotify = (message: string, confirmText?: string) => {

    if (confirmText && !confirm(confirmText)) return;

    if (onNotify) onNotify(message);

  };



  return (

    <section className="space-y-6">

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Operaciones</p>

          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Scheduler de turnos</h3>

          <p className="text-sm text-slate-500 dark:text-slate-400">

            Planificacion de turnos y cobertura por franja.

          </p>

        </div>

        <button className="flex items-center gap-2 rounded-full border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 px-4 py-2 text-xs font-semibold text-slate-500 dark:text-slate-300">

          <CalendarDays size={14} /> Semana actual

        </button>

      </div>



      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {[

          { label: 'Turnos activos', value: '12', tone: 'text-sky-500' },

          { label: 'Conductores asignados', value: '86', tone: 'text-emerald-400' },

          { label: 'Cobertura promedio', value: '74%', tone: 'text-amber-400' },

          { label: 'Alertas', value: '3', tone: 'text-rose-400' }

        ].map((stat) => (

          <div key={stat.label} className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-4 shadow-sm">

            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">{stat.label}</p>

            <p className={`mt-2 text-2xl font-bold ${stat.tone}`}>{stat.value}</p>

          </div>

        ))}

      </div>



      <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 shadow-sm">

        <div className="flex items-center justify-between">

          <h4 className="text-lg font-bold text-slate-900 dark:text-white">Cobertura semanal</h4>

          <button

            onClick={() => handleNotify('Detalle no disponible en demo.')}

            className="text-xs font-semibold text-sky-500 flex items-center gap-1"

          >

            Ver detalle <ArrowUpRight size={12} />

          </button>

        </div>

        <div className="mt-4 space-y-3">

          {shifts.map((shift) => (

            <div key={shift.day} className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 flex items-center justify-between">

              <div>

                <p className="text-sm font-semibold text-slate-900 dark:text-white">{shift.day}</p>

                <p className="text-xs text-slate-400">{shift.slots}</p>

              </div>

              <span className="text-xs font-semibold text-emerald-400">{shift.coverage}</span>

            </div>

          ))}

        </div>

        <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">

          <Users size={14} /> Ajusta turnos según picos de demanda.

        </div>

      </div>

    </section>

  );

};


