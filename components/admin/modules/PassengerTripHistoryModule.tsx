import React from 'react';


import { CalendarDays, Star, ArrowUpRight } from 'lucide-react';





interface ModuleProps {


  onNotify: (message: string) => void;


}





const trips = [


  { id: 'PA-2201', route: 'Centro  Aeropuerto', date: 'Hoy, 07:45', price: '$4.90', rating: 5, status: 'Completado' },


  { id: 'PA-2194', route: 'Urdesa  Malecon', date: 'Ayer, 18:10', price: '$3.20', rating: 4, status: 'Completado' },


  { id: 'PA-2177', route: 'Alborada  Mall del Sol', date: 'Lun, 20:15', price: '$5.40', rating: 5, status: 'Completado' },


  { id: 'PA-2168', route: 'Kennedy  Centro', date: 'Lun, 08:40', price: '$2.80', rating: 4, status: 'Completado' }


];





export const PassengerTripHistoryModule: React.FC<ModuleProps> = ({ onNotify }) => {


  const handleNotify = (message: string, confirmText?: string) => {


    if (confirmText && !confirm(confirmText)) return;


    if (onNotify) onNotify(message);


  };


  return (


    <section className="space-y-6">


      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">


        <div>


          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Pasajeros</p>


          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Historial de viajes</h3>


          <p className="text-sm text-slate-500 dark:text-slate-400">


            Resumen de viajes completados, gastos y calificaciones.


          </p>


        </div>


        <button className="flex items-center gap-2 rounded-full border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 px-4 py-2 text-xs font-semibold text-slate-500 dark:text-slate-300">


          <CalendarDays size={14} />


          Últimos 30 días


        </button>


      </div>





      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">


        {[


          { label: 'Viajes totales', value: '18', tone: 'text-sky-500' },


          { label: 'Gasto mensual', value: '$74.30', tone: 'text-emerald-400' },


          { label: 'Promedio por viaje', value: '$4.10', tone: 'text-amber-400' },


          { label: 'Calificación promedio', value: '4.7', tone: 'text-rose-400' }


        ].map((stat) => (


          <div key={stat.label} className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-4 shadow-sm">


            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">{stat.label}</p>


            <p className={`mt-2 text-2xl font-bold ${stat.tone}`}>{stat.value}</p>


          </div>


        ))}


      </div>





      <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 shadow-sm">


        <div className="flex items-center justify-between">


          <h4 className="text-lg font-bold text-slate-900 dark:text-white">Viajes recientes</h4>


          <button


            onClick={() => handleNotify('Historial completo listo (demo).')}


            className="text-xs font-semibold text-sky-500 flex items-center gap-1"


          >


            Ver historial <ArrowUpRight size={12} />


          </button>


        </div>


        <div className="mt-4 space-y-3">


          {trips.map((trip) => (


            <div key={trip.id} className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 py-3">


              <div className="flex flex-wrap items-center justify-between gap-3">


                <div>


                  <p className="text-xs text-slate-400">{trip.id}  {trip.date}</p>


                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{trip.route}</p>


                  <p className="text-xs text-slate-500 dark:text-slate-300">{trip.status}</p>


                </div>


                <div className="text-right">


                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{trip.price}</p>


                  <div className="mt-1 flex items-center justify-end gap-1 text-amber-400">


                    {Array.from({ length: trip.rating }).map((_, i) => (


                      <Star key={`${trip.id}-star-${i}`} size={12} fill="currentColor" />


                    ))}


                  </div>


                </div>


              </div>


            </div>


          ))}


        </div>


      </div>


    </section>


  );


};





