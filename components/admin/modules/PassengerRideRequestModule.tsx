import React from 'react';


import { MapPin, Navigation, CreditCard, Star, ShieldCheck } from 'lucide-react';





interface ModuleProps {


  onNotify: (message: string) => void;


}





const rideTypes = [


  { name: 'Economico', eta: '4 min', price: '$3.80' },


  { name: 'Confort', eta: '6 min', price: '$5.40' },


  { name: 'Van', eta: '8 min', price: '$7.90' }


];





export const PassengerRideRequestModule: React.FC<ModuleProps> = ({ onNotify }) => {


  const handleNotify = (message: string, confirmText?: string) => {


    if (confirmText && !confirm(confirmText)) return;


    if (onNotify) onNotify(message);


  };


  return (


    <section className="space-y-6">


      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">


        <div>


          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Pasajeros</p>


          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Solicitud de viaje</h3>


          <p className="text-sm text-slate-500 dark:text-slate-400">


            Flujo de selección de ruta, tipo de vehículo y pago.


          </p>


        </div>


        <button


          onClick={() => handleNotify('Modo viaje seguro activado (demo).')}


          className="flex items-center gap-2 rounded-full border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 px-4 py-2 text-xs font-semibold text-slate-500 dark:text-slate-300"


        >


          <ShieldCheck size={14} />


          Viaje seguro


        </button>


      </div>





      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">


        <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 shadow-sm">


          <div className="flex items-center justify-between">


            <h4 className="text-lg font-bold text-slate-900 dark:text-white">Mapa y ruta</h4>


            <button


              onClick={() => handleNotify('Detalle de ruta listo (demo).')}


              className="text-xs font-semibold text-sky-500"


            >


              Ver detalle


            </button>


          </div>


          <div className="mt-4 h-64 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-800/40 flex items-center justify-center text-xs text-slate-400">


            Vista de mapa interactivo


          </div>


          <div className="mt-4 grid gap-3 sm:grid-cols-2">


            {[


              { label: 'Origen', value: 'Av. Central 120' },


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


            <h4 className="text-lg font-bold text-slate-900 dark:text-white">Opciones de viaje</h4>


            <div className="mt-4 space-y-3">


              {rideTypes.map((type, index) => (


                <button


                  key={type.name}


                  className={`w-full rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${


                    index === 0 ? 'border-sky-500 bg-sky-500/10 text-slate-900 dark:text-white' : 'border-slate-200/70 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-200'


                  }`}


                >


                  <div className="flex items-center justify-between">


                    <span>{type.name}</span>


                    <span className="text-xs text-slate-400">{type.eta}</span>


                  </div>


                  <p className="mt-1 text-xs text-slate-400">Estimado {type.price}</p>


                </button>


              ))}


            </div>


          </div>





          <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 shadow-sm">


            <h4 className="text-lg font-bold text-slate-900 dark:text-white">Pago y confirmación</h4>


            <div className="mt-4 space-y-3">


              <div className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 flex items-center justify-between">


                <span className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-2">


                  <CreditCard size={14} /> Visa  4821


                </span>


                <button


                onClick={() => handleNotify('Método de pago listo (demo).')}


                className="text-xs font-semibold text-sky-500"


              >


                Cambiar


              </button>


              </div>


              <div className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 flex items-center justify-between">


                <span className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-2">


                  <Star size={14} /> Propina sugerida


                </span>


                <span className="text-sm font-semibold text-slate-900 dark:text-white">$1.00</span>


              </div>


            </div>


            <button


              onClick={() => handleNotify('Solicitud de viaje enviada (demo).')}


              className="mt-5 w-full rounded-full bg-emerald-500 text-white py-3 text-sm font-semibold flex items-center justify-center gap-2"


            >


              <Navigation size={16} />


              Solicitar viaje


            </button>


          </div>


        </div>


      </div>


    </section>


  );


};





