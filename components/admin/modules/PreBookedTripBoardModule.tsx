import React from 'react';

import { CalendarDays, ArrowUpRight } from 'lucide-react';



const bookings = [

  { id: 'BK-1201', route: 'Centro -> Aeropuerto', date: 'Jue 30, 06:30', status: 'Confirmado' },

  { id: 'BK-1198', route: 'Oficina -> Hotel', date: 'Jue 30, 08:10', status: 'Pendiente' },

  { id: 'BK-1187', route: 'Mall -> Terminal', date: 'Jue 30, 10:00', status: 'Confirmado' }

];



interface ModuleProps {

  onNotify: (message: string) => void;

}



export const PreBookedTripBoardModule: React.FC<ModuleProps> = ({ onNotify }) => {

  const handleNotify = (message: string, confirmText?: string) => {

    if (confirmText && !confirm(confirmText)) return;

    if (onNotify) onNotify(message);

  };



  return (

    <section className="space-y-6">

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Operaciones</p>

          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Pre-booked board</h3>

          <p className="text-sm text-slate-500 dark:text-slate-400">

            Seguimiento de viajes programados para asignación.

          </p>

        </div>

        <button className="flex items-center gap-2 rounded-full border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 px-4 py-2 text-xs font-semibold text-slate-500 dark:text-slate-300">

          <CalendarDays size={14} /> Hoy

        </button>

      </div>



      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {[

          { label: 'Viajes programados', value: '18', tone: 'text-sky-500' },

          { label: 'Asignados', value: '12', tone: 'text-emerald-400' },

          { label: 'Pendientes', value: '6', tone: 'text-amber-400' },

          { label: 'Demora media', value: '8 min', tone: 'text-rose-400' }

        ].map((stat) => (

          <div key={stat.label} className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-4 shadow-sm">

            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">{stat.label}</p>

            <p className={`mt-2 text-2xl font-bold ${stat.tone}`}>{stat.value}</p>

          </div>

        ))}

      </div>



      <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 shadow-sm">

        <div className="flex items-center justify-between">

          <h4 className="text-lg font-bold text-slate-900 dark:text-white">Agenda de hoy</h4>

          <button

            onClick={() => handleNotify('Detalle no disponible en demo.')}

            className="text-xs font-semibold text-sky-500 flex items-center gap-1"

          >

            Ver detalle <ArrowUpRight size={12} />

          </button>

        </div>

        <div className="mt-4 space-y-3">

          {bookings.map((item) => (

            <div key={item.id} className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 flex items-center justify-between">

              <div>

                <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.id}</p>

                <p className="text-xs text-slate-400">{item.route}</p>

              </div>

              <span className="text-xs text-slate-400">{item.date}</span>

              <span className={`text-xs font-semibold ${item.status === 'Confirmado' ?  'text-emerald-400' : 'text-amber-400'}`}>

                {item.status}

              </span>

            </div>

          ))}

        </div>

      </div>

    </section>

  );

};


