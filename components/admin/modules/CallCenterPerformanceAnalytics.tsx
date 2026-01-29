import React from 'react';


import { Headphones, Timer, TrendingUp, PhoneCall, MessageSquare, ArrowUpRight } from 'lucide-react';





interface ModuleProps {


  onNotify: (message: string) => void;


}





const agents = [


  { name: 'Lucia R.', chats: 48, calls: 22, score: 94 },


  { name: 'Diego M.', chats: 40, calls: 18, score: 91 },


  { name: 'Ana C.', chats: 36, calls: 20, score: 89 }


];





export const CallCenterPerformanceAnalytics: React.FC<ModuleProps> = ({ onNotify }) => {


  const handleNotify = (message: string, confirmText?: string) => {


    if (confirmText && !confirm(confirmText)) return;


    if (onNotify) onNotify(message);


  };


  return (


    <section className="space-y-6">


      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">


        <div>


          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Operaciones</p>


          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Analtica de call center</h3>


          <p className="text-sm text-slate-500 dark:text-slate-400">


            Rendimiento por canal, tiempos de respuesta y calidad.


          </p>


        </div>


        <button


          onClick={() => handleNotify('Detalle de analítica listo (demo).')}


          className="flex items-center gap-2 rounded-full border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 px-4 py-2 text-xs font-semibold text-slate-500 dark:text-slate-300"


        >


          <ArrowUpRight size={14} />


          Ver detalle


        </button>


      </div>





      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">


        {[


          { label: 'Tiempo promedio', value: '1m 24s', icon: Timer, tone: 'text-emerald-400' },


          { label: 'Contactos activos', value: '38', icon: Headphones, tone: 'text-sky-400' },


          { label: 'Satisfaccin', value: '4.7', icon: TrendingUp, tone: 'text-amber-400' },


          { label: 'Abandonos', value: '3.2%', icon: PhoneCall, tone: 'text-rose-400' }


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


            <h4 className="text-lg font-bold text-slate-900 dark:text-white">Canales activos</h4>


            <span className="text-xs text-slate-400">Últimas 24h</span>


          </div>


          <div className="mt-4 space-y-3">


            {[


              { label: 'Chat en vivo', value: 62, icon: MessageSquare, color: 'bg-sky-500' },


              { label: 'Llamadas', value: 38, icon: PhoneCall, color: 'bg-emerald-400' },


              { label: 'Correo', value: 22, icon: Headphones, color: 'bg-amber-400' }


            ].map((item) => {


              const Icon = item.icon;


              return (


                <div key={item.label} className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 py-3">


                  <div className="flex items-center justify-between">


                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">


                      <span className={`h-2 w-2 rounded-full ${item.color}`} />


                      <Icon size={14} />


                      {item.label}


                    </div>


                    <span className="text-sm font-semibold text-slate-900 dark:text-white">{item.value}</span>


                  </div>


                  <div className="mt-3 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">


                    <div className={`h-full ${item.color}`} style={{ width: `${item.value}%` }} />


                  </div>


                </div>


              );


            })}


          </div>


        </div>





        <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 shadow-sm">


          <h4 className="text-lg font-bold text-slate-900 dark:text-white">Top agentes</h4>


          <div className="mt-4 space-y-3">


            {agents.map((agent) => (


              <div key={agent.name} className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 py-3">


                <div className="flex items-center justify-between">


                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{agent.name}</p>


                  <span className="text-xs font-semibold text-emerald-400">{agent.score} pts</span>


                </div>


                <div className="mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-300">


                  <span>Chats: {agent.chats}</span>


                  <span>Llamadas: {agent.calls}</span>


                </div>


              </div>


            ))}


          </div>


        </div>


      </div>


    </section>


  );


};


