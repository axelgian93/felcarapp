import React from 'react';


import { PhoneCall, Share2, Clock, ShieldCheck, MapPin } from 'lucide-react';





interface ModuleProps {


  onNotify: (message: string) => void;


}





export const PassengerTripTrackingModule: React.FC<ModuleProps> = ({ onNotify }) => {


  const handleNotify = (message: string, confirmText?: string) => {


    if (confirmText && !confirm(confirmText)) return;


    if (onNotify) onNotify(message);


  };


  return (


    <section className="space-y-6">


      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">


        <div>


          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Pasajeros</p>


          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Seguimiento de viaje</h3>


          <p className="text-sm text-slate-500 dark:text-slate-400">


            Estado en tiempo real, conductor asignado y llegada estimada.


          </p>


        </div>


        <button


          onClick={() => handleNotify('Estado SOS verificado (demo).')}


          className="flex items-center gap-2 rounded-full border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 px-4 py-2 text-xs font-semibold text-slate-500 dark:text-slate-300"


        >


          <ShieldCheck size={14} />


          SOS activo


        </button>


      </div>





      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">


        <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 shadow-sm">


          <div className="flex items-center justify-between">


            <h4 className="text-lg font-bold text-slate-900 dark:text-white">Mapa en vivo</h4>


            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">


              <Clock size={12} /> 3 min para llegada


            </span>


          </div>


          <div className="mt-4 h-72 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-800/40 flex items-center justify-center text-xs text-slate-400">


            Vista de seguimiento en tiempo real


          </div>


          <div className="mt-4 grid gap-3 sm:grid-cols-2">


            {[


              { label: 'Recogida', value: 'Av. Central 120' },


              { label: 'Destino', value: 'Aeropuerto T1' }


            ].map((item) => (


              <div key={item.label} className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 py-3">


                <p className="text-xs text-slate-400">{item.label}</p>


                <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">


                  <MapPin size={14} className="text-sky-500" />


                  {item.value}


                </p>


              </div>


            ))}


          </div>


        </div>





        <div className="space-y-6">


          <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 shadow-sm">


            <h4 className="text-lg font-bold text-slate-900 dark:text-white">Conductor asignado</h4>


            <div className="mt-4 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 py-3">


              <div className="flex items-center justify-between">


                <div>


                  <p className="text-sm font-semibold text-slate-900 dark:text-white">Maria Torres</p>


                  <p className="text-xs text-slate-400">Toyota Prius  ABC-721</p>


                </div>


                <span className="text-xs font-semibold text-emerald-400">4.9 </span>


              </div>


              <div className="mt-3 flex flex-wrap gap-2">


                <button


                  onClick={() => handleNotify('Llamada al conductor iniciada (demo).')}


                  className="flex-1 min-w-[120px] rounded-full border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 py-2 text-xs font-semibold text-slate-500 dark:text-slate-300 flex items-center justify-center gap-2"


                >


                  <PhoneCall size={14} /> Llamar


                </button>


                <button


                  onClick={() => handleNotify('Ruta compartida (demo).')}


                  className="flex-1 min-w-[120px] rounded-full bg-slate-900 dark:bg-sky-500 text-white py-2 text-xs font-semibold flex items-center justify-center gap-2"


                >


                  <Share2 size={14} /> Compartir ruta


                </button>


              </div>


            </div>


          </div>





          <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 shadow-sm">


            <h4 className="text-lg font-bold text-slate-900 dark:text-white">Progreso del viaje</h4>


            <div className="mt-4 space-y-3 text-xs text-slate-500 dark:text-slate-300">


              {[


                { label: 'Conductor en camino', time: '08:22' },


                { label: 'Llegada al punto de recogida', time: '08:25' },


                { label: 'Viaje en curso', time: '08:28' }


              ].map((step, index) => (


                <div key={step.label} className="flex items-center justify-between">


                  <span className={index === 2 ? 'text-slate-900 dark:text-white font-semibold' : ''}>{step.label}</span>


                  <span className="text-slate-400">{step.time}</span>


                </div>


              ))}


            </div>


          </div>


        </div>


      </div>


    </section>


  );


};





