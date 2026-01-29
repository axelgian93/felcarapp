import React from 'react';

import { Repeat, ArrowUpRight, BadgeCheck } from 'lucide-react';



const plans = [

  { name: 'Plan semanal', rides: '10 viajes', status: 'Activo' },

  { name: 'Plan mensual', rides: '40 viajes', status: 'Activo' },

  { name: 'Plan corporativo', rides: 'Ilimitado', status: 'En revisión' }

];



export const PassengerSubscriptionsModule: React.FC = () => {

  return (

    <section className="space-y-6">

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Pasajeros</p>

          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Suscripciones de viaje</h3>

          <p className="text-sm text-slate-500 dark:text-slate-400">

            Planes recurrentes y beneficios de suscripcion.

          </p>

        </div>

        <button className="flex items-center gap-2 rounded-full bg-emerald-500 text-white px-4 py-2 text-xs font-semibold shadow-sm">

          <Repeat size={14} /> Crear plan

        </button>

      </div>



      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {[

          { label: 'Suscripciones activas', value: '2', tone: 'text-sky-500' },

          { label: 'Viajes incluidos', value: '50', tone: 'text-emerald-400' },

          { label: 'Renovaciones', value: '8', tone: 'text-amber-400' },

          { label: 'Beneficios', value: '4', tone: 'text-rose-400' }

        ].map((stat) => (

          <div key={stat.label} className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-4 shadow-sm">

            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">{stat.label}</p>

            <p className={`mt-2 text-2xl font-bold ${stat.tone}`}>{stat.value}</p>

          </div>

        ))}

      </div>



      <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 shadow-sm">

        <div className="flex items-center justify-between">

          <h4 className="text-lg font-bold text-slate-900 dark:text-white">Planes activos</h4>

          <button className="text-xs font-semibold text-sky-500 flex items-center gap-1">

            Ver detalle <ArrowUpRight size={12} />

          </button>

        </div>

        <div className="mt-4 space-y-3">

          {plans.map((plan) => (

            <div key={plan.name} className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 flex items-center justify-between">

              <div>

                <p className="text-sm font-semibold text-slate-900 dark:text-white">{plan.name}</p>

                <p className="text-xs text-slate-400">{plan.rides}</p>

              </div>

              <span className={`text-xs font-semibold ${plan.status === 'Activo' ?  'text-emerald-400' : 'text-amber-400'}`}>

                {plan.status}

              </span>

            </div>

          ))}

        </div>

        <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">

          <BadgeCheck size={14} /> Administra límites y beneficios por plan.

        </div>

      </div>

    </section>

  );

};


