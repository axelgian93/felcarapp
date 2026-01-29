import React from 'react';

import { CheckCircle2, ArrowUpRight } from 'lucide-react';




const approvals = [


  { name: 'Viaje a Zona Amarilla', requester: 'Maria Perez', status: 'Pendiente' },


  { name: 'Viaje nocturno', requester: 'Luis Rivera', status: 'Pendiente' },


  { name: 'Ruta VIP', requester: 'Ana Torres', status: 'Aprobado' }


];





interface CorporateTripApprovalsModuleProps {


  onNotify: (message: string) => void;


}





export const CorporateTripApprovalsModule: React.FC<CorporateTripApprovalsModuleProps> = ({ onNotify }) => {


  const handleDecision = (name: string, decision: 'Aprobar' | 'Rechazar') => {


    if (decision === 'Rechazar') {


      if (!confirm(`Confirmar rechazo para ${name}`)) return;


    } else {


      if (!confirm(`Confirmar aprobación para ${name}`)) return;


    }


    if (onNotify) {


      onNotify(`${decision} solicitud (mock): ${name}`);


    }


  };


  return (


    <section className="space-y-6">


      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">


        <div>


          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Corporativo</p>


          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Aprobaciones de viajes</h3>


          <p className="text-sm text-slate-500 dark:text-slate-400">


            Gestión de solicitudes y aprobaciones internas.


          </p>


        </div>


        <button className="flex items-center gap-2 rounded-full border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 px-4 py-2 text-xs font-semibold text-slate-500 dark:text-slate-300">


          <ArrowUpRight size={14} /> Ver todo


        </button>


      </div>





      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">


        {[


          { label: 'Pendientes', value: '4', tone: 'text-amber-400' },


          { label: 'Aprobadas', value: '18', tone: 'text-emerald-400' },


          { label: 'Rechazadas', value: '2', tone: 'text-rose-400' },


          { label: 'Tiempo promedio', value: '2.4h', tone: 'text-sky-500' }


        ].map((stat) => (


          <div key={stat.label} className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-4 shadow-sm">


            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">{stat.label}</p>


            <p className={`mt-2 text-2xl font-bold ${stat.tone}`}>{stat.value}</p>


          </div>


        ))}


      </div>





      <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 shadow-sm">


        <div className="flex items-center justify-between">


          <h4 className="text-lg font-bold text-slate-900 dark:text-white">Solicitudes recientes</h4>


          <CheckCircle2 size={16} className="text-emerald-400" />


        </div>


        <div className="mt-4 space-y-3">


          {approvals.map((item) => (


            <div key={item.name} className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 flex items-center justify-between">


              <div>


                <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.name}</p>


                <p className="text-xs text-slate-400">Solicita {item.requester}</p>


              </div>


              <div className="flex items-center gap-2">


                <span className={`text-xs font-semibold ${item.status === 'Aprobado' ?  'text-emerald-400' : 'text-amber-400'}`}>


                  {item.status}


                </span>


                {item.status === 'Pendiente' && (


                  <>


                    <button


                      onClick={() => handleDecision(item.name, 'Aprobar')}


                      className="rounded-full bg-emerald-500/15 text-emerald-400 px-3 py-1 text-[11px] font-semibold"


                    >


                      Aprobar


                    </button>


                    <button


                      onClick={() => handleDecision(item.name, 'Rechazar')}


                      className="rounded-full bg-rose-500/15 text-rose-400 px-3 py-1 text-[11px] font-semibold"


                    >


                      Rechazar


                    </button>


                  </>


                )}


              </div>


            </div>


          ))}


        </div>


      </div>


    </section>


  );


};


