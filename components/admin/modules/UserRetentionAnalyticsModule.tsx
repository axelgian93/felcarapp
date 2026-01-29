import React from 'react';
import { TrendingUp, Users, ArrowUpRight } from 'lucide-react';

const cohorts = [
  { label: 'Semana 1', value: '82%', trend: '+4%' },
  { label: 'Semana 2', value: '68%', trend: '+2%' },
  { label: 'Semana 3', value: '56%', trend: '-1%' }
];

export const UserRetentionAnalyticsModule: React.FC = () => {
  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Operaciones</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Retención de usuarios</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Cohortes, abandono y reactivacion de usuarios.
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-full border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 px-4 py-2 text-xs font-semibold text-slate-500 dark:text-slate-300">
          <ArrowUpRight size={14} /> Ver detalle
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Retención 30 días', value: '64%', tone: 'text-emerald-400' },
          { label: 'Nuevos usuarios', value: '420', tone: 'text-sky-500' },
          { label: 'Churn', value: '12%', tone: 'text-rose-400' },
          { label: 'Reactivados', value: '86', tone: 'text-amber-400' }
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
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">Cohortes semanales</h4>
            <TrendingUp size={16} className="text-emerald-400" />
          </div>
          <div className="mt-4 h-56 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-800/40 flex items-center justify-center text-xs text-slate-400">
            Grafico de cohortes
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 shadow-sm">
          <h4 className="text-lg font-bold text-slate-900 dark:text-white">Detalle por semana</h4>
          <div className="mt-4 space-y-3">
            {cohorts.map((item) => (
              <div key={item.label} className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 py-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.label}</p>
                  <span className="text-xs font-semibold text-slate-400">{item.trend}</span>
                </div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white mt-2">{item.value}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Users size={14} /> Segmenta por tipo de usuario.
          </div>
        </div>
      </div>
    </section>
  );
};

