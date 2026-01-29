import React from 'react';


import { CalendarDays, Bell, ArrowUpRight } from 'lucide-react';





interface ModuleProps {


  onNotify: (message: string) => void;


}





const rides = [


  { route: 'Centro -> Aeropuerto', date: 'Jue 30, 07:30', status: 'Confirmado' },


  { route: 'Oficina -> Hotel', date: 'Vie 31, 18:10', status: 'Pendiente' },


  { route: 'Casa -> Terminal', date: 'Sab 1, 09:00', status: 'Confirmado' }


];





export const PassengerScheduledRideModule: React.FC<ModuleProps> = ({ onNotify }) => {


  const handleNotify = (message: string, confirmText?: string) => {


    if (confirmText && !confirm(confirmText)) return;


    if (onNotify) onNotify(message);


  };


  return (


    <section className="space-y-6">


      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">


        <div>


          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Pasajeros</p>


          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Viajes programados</h3>


          <p className="text-sm text-slate-500 dark:text-slate-400">


            Agenda y recordatorios de viajes futuros.


          </p>


        </div>


        <button


          onClick={() => handleNotify('Viaje programado (demo).')}


          className="flex items-center gap-2 rounded-full bg-emerald-500 text-white px-4 py-2 text-xs font-semibold shadow-sm"


        >


          <CalendarDays size={14} /> Programar viaje


        </button>


      </div>





      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">


        {[


          { label: 'Viajes futuros', value: '3', tone: 'text-sky-500' },


          { label: 'Recordatorios activos', value: '2', tone: 'text-emerald-400' },


          { label: 'Reprogramaciones', value: '1', tone: 'text-amber-400' },


          { label: 'Cancelaciones', value: '0', tone: 'text-rose-400' }


        ].map((stat) => (


          <div key={stat.label} className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-4 shadow-sm">


            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">{stat.label}</p>


            <p className={`mt-2 text-2xl font-bold ${stat.tone}`}>{stat.value}</p>


          </div>


        ))}


      </div>





      <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 shadow-sm">


        <div className="flex items-center justify-between">


          <h4 className="text-lg font-bold text-slate-900 dark:text-white">Agenda reciente</h4>


          <button


            onClick={() => handleNotify('Agenda completa lista (demo).')}


            className="text-xs font-semibold text-sky-500 flex items-center gap-1"


          >


            Ver todo <ArrowUpRight size={12} />


          </button>


        </div>


        <div className="mt-4 space-y-3">


          {rides.map((ride) => (


            <div key={ride.route} className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 flex items-center justify-between">


              <div>


                <p className="text-sm font-semibold text-slate-900 dark:text-white">{ride.route}</p>


                <p className="text-xs text-slate-400">{ride.date}</p>


              </div>


              <span className={`text-xs font-semibold ${ride.status === 'Confirmado' ?  'text-emerald-400' : 'text-amber-400'}`}>


                {ride.status}


              </span>


            </div>


          ))}


        </div>


        <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">


          <Bell size={14} /> Activa recordatorios automaticos para tus viajes.


        </div>


      </div>


    </section>


  );


};


