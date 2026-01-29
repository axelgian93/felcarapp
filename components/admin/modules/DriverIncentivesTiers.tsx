import React from 'react';


import { Award, TrendingUp, Flame, ShieldCheck, ChevronRight } from 'lucide-react';





interface ModuleProps {


  onNotify: (message: string) => void;


}





const incentives = [


  { label: 'Bono de horas pico', value: '+$48', note: '12 viajes completados', tone: 'text-emerald-400' },


  { label: 'Rachas de 5 viajes', value: '+$22', note: '2 rachas hoy', tone: 'text-sky-400' },


  { label: 'Excelencia en servicio', value: '+$15', note: 'Calificación 4.9', tone: 'text-amber-400' }


];





const tiers = [


  { name: 'Bronce', trips: 0, perks: 'Soporte estandar' },


  { name: 'Plata', trips: 40, perks: 'Prioridad media' },


  { name: 'Oro', trips: 80, perks: 'Prioridad alta' },


  { name: 'Elite', trips: 120, perks: 'Bonos especiales' }


];





const goals = [


  { label: 'Viajes semanales', current: 32, target: 45 },


  { label: 'Aceptacion', current: 92, target: 95 },


  { label: 'Tiempo en linea', current: 26, target: 30 }


];





export const DriverIncentivesTiers: React.FC<ModuleProps> = ({ onNotify }) => {


  const handleNotify = (message: string, confirmText?: string) => {


    if (confirmText && !confirm(confirmText)) return;


    if (onNotify) onNotify(message);


  };


  return (


    <section className="space-y-6">


      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">


        <div>


          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Conductores</p>


          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Incentivos y niveles</h3>


          <p className="text-sm text-slate-500 dark:text-slate-400">


            Seguimiento de bonificaciones, progreso y beneficios por nivel.


          </p>


        </div>


        <button


          onClick={() => handleNotify('Incentivo creado (demo).')}


          className="flex items-center gap-2 rounded-full bg-emerald-500 text-white px-4 py-2 text-xs font-semibold shadow-sm"


        >


          <Award size={14} />


          Crear incentivo


        </button>


      </div>





      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">


        {[


          { label: 'Nivel actual', value: 'Oro', icon: Award, tone: 'text-amber-400' },


          { label: 'Viajes este mes', value: '64', icon: Flame, tone: 'text-rose-400' },


          { label: 'Bono acumulado', value: '$185', icon: TrendingUp, tone: 'text-emerald-400' },


          { label: 'Aceptacion', value: '92%', icon: ShieldCheck, tone: 'text-sky-400' }


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


          <div className="flex items-center justify-between">


            <h4 className="text-lg font-bold text-slate-900 dark:text-white">Bonificaciones activas</h4>


            <button


              onClick={() => handleNotify('Listado de bonificaciones listo (demo).')}


              className="text-xs font-semibold text-sky-500 flex items-center gap-1"


            >


              Ver todo <ChevronRight size={12} />


            </button>


          </div>


          <div className="mt-4 space-y-3">


            {incentives.map((item) => (


              <div key={item.label} className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 py-3">


                <div className="flex items-center justify-between">


                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.label}</p>


                  <span className={`text-sm font-bold ${item.tone}`}>{item.value}</span>


                </div>


                <p className="text-xs text-slate-400 mt-1">{item.note}</p>


              </div>


            ))}


          </div>


        </div>





        <div className="space-y-6">


          <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 shadow-sm">


            <h4 className="text-lg font-bold text-slate-900 dark:text-white">Progreso de nivel</h4>


            <p className="text-xs text-slate-400 mt-1">16 viajes para alcanzar Elite</p>


            <div className="mt-4 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">


              <div className="h-full bg-amber-400" style={{ width: '68%' }} />


            </div>


            <div className="mt-4 grid gap-3">


              {tiers.map((tier, index) => (


                <div key={tier.name} className="flex items-center justify-between text-xs">


                  <span className="text-slate-500 dark:text-slate-300">


                    {index === 2 ? 'Actual' : tier.trips === 0 ? 'Inicio' : `${tier.trips}+ viajes`}


                  </span>


                  <span className="font-semibold text-slate-900 dark:text-white">{tier.name}</span>


                  <span className="text-slate-400">{tier.perks}</span>


                </div>


              ))}


            </div>


          </div>





          <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 shadow-sm">


            <h4 className="text-lg font-bold text-slate-900 dark:text-white">Objetivos semanales</h4>


            <div className="mt-4 space-y-3">


              {goals.map((goal) => {


                const pct = Math.min(100, Math.round((goal.current / goal.target) * 100));


                return (


                  <div key={goal.label}>


                    <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">


                      <span>{goal.label}</span>


                      <span>{goal.current}/{goal.target}</span>


                    </div>


                    <div className="mt-2 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">


                      <div className="h-full bg-sky-500" style={{ width: `${pct}%` }} />


                    </div>


                  </div>


                );


              })}


            </div>


          </div>


        </div>


      </div>


    </section>


  );


};





