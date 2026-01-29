import React from 'react';


import { PiggyBank, TrendingDown, TrendingUp, ArrowUpRight } from 'lucide-react';





interface ModuleProps {


  onNotify: (message: string) => void;


}





const categories = [


  { label: 'Polticas optimizadas', value: '$3,420', trend: '+12%', tone: 'text-emerald-400' },


  { label: 'Rutas eficientes', value: '$2,180', trend: '+8%', tone: 'text-sky-400' },


  { label: 'Viajes compartidos', value: '$1,260', trend: '+5%', tone: 'text-amber-400' }


];





export const CorporateSavingsAnalytics: React.FC<ModuleProps> = ({ onNotify }) => {


  const handleNotify = (message: string, confirmText?: string) => {


    if (confirmText && !confirm(confirmText)) return;


    if (onNotify) onNotify(message);


  };


  return (


    <section className="space-y-6">


      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">


        <div>


          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Corporativo</p>


          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Analtica de ahorros</h3>


          <p className="text-sm text-slate-500 dark:text-slate-400">


            Comparativo de ahorro, cumplimiento y oportunidades.


          </p>


        </div>


        <button


          onClick={() => handleNotify('Reporte de ahorros exportado (demo).')}


          className="flex items-center gap-2 rounded-full border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 px-4 py-2 text-xs font-semibold text-slate-500 dark:text-slate-300"


        >


          <ArrowUpRight size={14} />


          Exportar


        </button>


      </div>





      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">


        {[


          { label: 'Ahorro mensual', value: '$6,860', icon: PiggyBank, tone: 'text-emerald-400' },


          { label: 'Cumplimiento', value: '93%', icon: TrendingUp, tone: 'text-sky-400' },


          { label: 'Desvos', value: '7%', icon: TrendingDown, tone: 'text-rose-400' },


          { label: 'Viajes optimizados', value: '128', icon: TrendingUp, tone: 'text-amber-400' }


        ].map((stat) => {


          const Icon = stat.icon;


          return (


            <div key={stat.label} className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-4 shadow-sm">


              <div className="flex items-center justify-between">


                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">{stat.label}</p>


                <Icon size={16} className={stat.tone} />


              </div>


              <p className={`mt-2 text-2xl font-bold ${stat.tone}`}>{stat.value}</p>


            </div>


          );


        })}


      </div>





      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">


        <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 shadow-sm">


          <h4 className="text-lg font-bold text-slate-900 dark:text-white">Ahorro por categora</h4>


          <div className="mt-4 space-y-3">


            {categories.map((item) => (


              <div key={item.label} className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 py-3">


                <div className="flex items-center justify-between">


                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.label}</p>


                  <span className={`text-sm font-bold ${item.tone}`}>{item.value}</span>


                </div>


                <p className="text-xs text-slate-400 mt-1">{item.trend} vs mes anterior</p>


              </div>


            ))}


          </div>


        </div>





        <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 shadow-sm">


          <h4 className="text-lg font-bold text-slate-900 dark:text-white">Oportunidades</h4>


          <div className="mt-4 space-y-3 text-xs text-slate-500 dark:text-slate-300">


            <div className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 py-3">


              <p className="font-semibold text-slate-900 dark:text-white">Optimizar rutas nocturnas</p>


              <p className="mt-1">Ahorro potencial $420 mensuales</p>


            </div>


            <div className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 py-3">


              <p className="font-semibold text-slate-900 dark:text-white">Ms viajes compartidos</p>


              <p className="mt-1">Incremento del 6% en ahorro</p>


            </div>


          </div>


          <button className="mt-4 w-full rounded-full bg-slate-900 dark:bg-sky-500 text-white py-2 text-xs font-semibold">


            Revisar polticas


          </button>


        </div>


      </div>


    </section>


  );


};


