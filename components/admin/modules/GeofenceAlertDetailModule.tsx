import React from 'react';

import { MapPin, AlertTriangle, ArrowUpRight } from 'lucide-react';




const alerts = [


  { zone: 'Zona Norte', driver: 'VH-2198', time: '10:42', status: 'Alerta' },


  { zone: 'Zona Centro', driver: 'VH-2204', time: '09:30', status: 'Resuelto' },


  { zone: 'Aeropuerto', driver: 'VH-2186', time: '08:55', status: 'Alerta' }


];





interface GeofenceAlertDetailModuleProps {


  onNotify: (message: string) => void;


}





export const GeofenceAlertDetailModule: React.FC<GeofenceAlertDetailModuleProps> = ({ onNotify }) => {


  const handleViewMap = () => {


    if (onNotify) {


      onNotify('Mapa de alertas no disponible en demo.');


    }


  };


  return (


    <section className="space-y-6">


      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">


        <div>


          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Operaciones</p>


          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Alertas de geocercas</h3>


          <p className="text-sm text-slate-500 dark:text-slate-400">


            Eventos de entrada/salida de zonas controladas.


          </p>


        </div>


        <button onClick={handleViewMap} className="flex items-center gap-2 rounded-full border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 px-4 py-2 text-xs font-semibold text-slate-500 dark:text-slate-300">


          <ArrowUpRight size={14} /> Ver mapa


        </button>


      </div>





      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">


        {[


          { label: 'Alertas activas', value: '3', tone: 'text-rose-400' },


          { label: 'Zonas monitoreadas', value: '8', tone: 'text-sky-500' },


          { label: 'Resolucion promedio', value: '6 min', tone: 'text-amber-400' },


          { label: 'Incidentes hoy', value: '5', tone: 'text-emerald-400' }


        ].map((stat) => (


          <div key={stat.label} className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-4 shadow-sm">


            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">{stat.label}</p>


            <p className={`mt-2 text-2xl font-bold ${stat.tone}`}>{stat.value}</p>


          </div>


        ))}


      </div>





      <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 shadow-sm">


        <div className="flex items-center justify-between">


          <h4 className="text-lg font-bold text-slate-900 dark:text-white">Eventos recientes</h4>


          <AlertTriangle size={16} className="text-rose-400" />


        </div>


        <div className="mt-4 space-y-3">


          {alerts.map((item) => (


            <div key={`${item.zone}-${item.time}`} className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 flex items-center justify-between">


              <div>


                <p className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">


                  <MapPin size={14} className="text-sky-500" /> {item.zone}


                </p>


                <p className="text-xs text-slate-400">Unidad {item.driver}  {item.time}</p>


              </div>


              <span className={`text-xs font-semibold ${item.status === 'Resuelto' ?  'text-emerald-400' : 'text-rose-400'}`}>


                {item.status}


              </span>


            </div>


          ))}


        </div>


      </div>


    </section>


  );


};



