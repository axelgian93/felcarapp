import React from 'react';


import { DollarSign, CalendarDays, ArrowUpRight, Banknote, CheckCircle2 } from 'lucide-react';





const payouts = [


  { id: 'ST-8821', date: 'Hoy', amount: '$128.40', status: 'Procesado' },


  { id: 'ST-8802', date: 'Ayer', amount: '$96.10', status: 'Pendiente' },


  { id: 'ST-8786', date: 'Lun', amount: '$110.25', status: 'Procesado' }


];





interface DriverPayoutSettlementDashboardProps {


  onNotify: (message: string) => void;


}





export const DriverPayoutSettlementDashboard: React.FC<DriverPayoutSettlementDashboardProps> = ({ onNotify }) => {


  const handleProcess = () => {


    if (!confirm('Procesar pagos pendientes')) return;


    if (onNotify) {


      onNotify('Pagos procesados (mock).');


    }


  };


  return (


    <section className="space-y-6">


      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">


        <div>


          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Conductores</p>


          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Pagos y liquidaciones</h3>


          <p className="text-sm text-slate-500 dark:text-slate-400">


            Resumen de pagos, comisiones y estado de liquidaciones.


          </p>


        </div>


        <button onClick={handleProcess} className="flex items-center gap-2 rounded-full bg-emerald-500 text-white px-4 py-2 text-xs font-semibold shadow-sm">


          <Banknote size={14} />


          Procesar pagos


        </button>


      </div>





      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">


        {[


          { label: 'Saldo disponible', value: '$342.80', icon: DollarSign, tone: 'text-emerald-400' },


          { label: 'Liquidacin prxima', value: 'Jue, 30', icon: CalendarDays, tone: 'text-sky-400' },


          { label: 'Comisin aplicada', value: '15%', icon: ArrowUpRight, tone: 'text-amber-400' },


          { label: 'Pagos pendientes', value: '2', icon: CheckCircle2, tone: 'text-rose-400' }


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


            <h4 className="text-lg font-bold text-slate-900 dark:text-white">Historial de liquidaciones</h4>


            <button


              onClick={() => onNotify && onNotify('Historial completo listo (demo).')}


              className="text-xs font-semibold text-sky-500"


            >


              Ver todo


            </button>


          </div>


          <div className="mt-4 space-y-3">


            {payouts.map((item) => (


              <div key={item.id} className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 flex items-center justify-between">


                <div>


                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.id}</p>


                  <p className="text-xs text-slate-400">{item.date}</p>


                </div>


                <span className="text-sm font-semibold text-slate-900 dark:text-white">{item.amount}</span>


                <span className={`text-xs font-semibold ${item.status === 'Procesado' ?  'text-emerald-400' : 'text-amber-400'}`}>


                  {item.status}


                </span>


              </div>


            ))}


          </div>


        </div>





        <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 shadow-sm">


          <h4 className="text-lg font-bold text-slate-900 dark:text-white">Detalle de comisiones</h4>


          <div className="mt-4 space-y-3 text-xs text-slate-500 dark:text-slate-300">


            <div className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 flex items-center justify-between">


              <span>Tarifa por servicio</span>


              <span className="font-semibold text-slate-900 dark:text-white">-$24.60</span>


            </div>


            <div className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 flex items-center justify-between">


              <span>Bonos aplicados</span>


              <span className="font-semibold text-emerald-400">+$18.00</span>


            </div>


            <div className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 flex items-center justify-between">


              <span>Ajustes</span>


              <span className="font-semibold text-slate-900 dark:text-white">-$4.20</span>


            </div>


          </div>


          <button


            onClick={() => onNotify && onNotify('Detalle de comisiones listo (demo).')}


            className="mt-4 w-full rounded-full bg-slate-900 dark:bg-sky-500 text-white py-2 text-xs font-semibold"


          >


            Ver desglose


          </button>


        </div>


      </div>


    </section>


  );


};


