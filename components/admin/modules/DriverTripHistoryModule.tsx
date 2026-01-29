import React from 'react';


import { CalendarDays, Star, MapPin, ArrowUpRight, Filter } from 'lucide-react';





interface ModuleProps {


  onNotify: (message: string) => void;


}





const trips = [


  { id: 'TR-8821', origin: 'Centro', destination: 'Aeropuerto', date: 'Hoy, 08:20', amount: '$14.60', rating: 5, status: 'Completado' },


  { id: 'TR-8804', origin: 'La Alborada', destination: 'Mall del Sol', date: 'Ayer, 19:12', amount: '$9.40', rating: 4, status: 'Completado' },


  { id: 'TR-8781', origin: 'Urdesa', destination: 'Malecon', date: 'Ayer, 14:05', amount: '$6.80', rating: 5, status: 'Completado' },


  { id: 'TR-8744', origin: 'Kennedy', destination: 'Policentro', date: 'Lun, 21:45', amount: '$8.10', rating: 4, status: 'Completado' }


];





export const DriverTripHistoryModule: React.FC<ModuleProps> = ({ onNotify }) => {


  const handleNotify = (message: string, confirmText?: string) => {


    if (confirmText && !confirm(confirmText)) return;


    if (onNotify) onNotify(message);


  };


  return (


    <section className="space-y-6">


      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">


        <div>


          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Conductores</p>


          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Historial de viajes</h3>


          <p className="text-sm text-slate-500 dark:text-slate-400">


            Últimos viajes, ingresos y evaluación de servicio.


          </p>


        </div>


        <div className="flex items-center gap-2">


          <button


            onClick={() => handleNotify('Filtro de fechas aplicado (demo).')}


            className="flex items-center gap-2 rounded-full border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 px-4 py-2 text-xs font-semibold text-slate-500 dark:text-slate-300"


          >


            <CalendarDays size={14} />


             - ltimos 7 d - as


          </button>


          <button


            onClick={() => handleNotify('Filtros avanzados listos (demo).')}


            className="p-2 rounded-full border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 text-slate-500 dark:text-slate-300"


          >


            <Filter size={16} />


          </button>


        </div>


      </div>





      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">


        {[


          { label: 'Viajes completados', value: '28', tone: 'text-sky-500' },


          { label: 'Ingresos semana', value: '$286.40', tone: 'text-emerald-400' },


          { label: 'Calificación promedio', value: '4.8', tone: 'text-amber-400' },


          { label: 'Tiempo online', value: '26h', tone: 'text-rose-400' }


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


                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{trip.origin}  {trip.destination}</p>


                  <div className="mt-1 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-300">


                    <MapPin size={12} /> {trip.status}


                  </div>


                </div>


                <div className="text-right">


                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{trip.amount}</p>


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





