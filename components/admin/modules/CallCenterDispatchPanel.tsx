import React from 'react';


import { Headphones, Radio, MapPin, Clock, User, Car, ArrowUpRight } from 'lucide-react';





interface ModuleProps {


  onNotify: (message: string) => void;


}





const agents = [


  { name: 'Ana Torres', status: 'En llamada', active: 4 },


  { name: 'Diego Ruiz', status: 'Disponible', active: 2 },


  { name: 'Camila Vega', status: 'En llamada', active: 3 },


  { name: 'Juan Perez', status: 'Descanso', active: 1 }


];





const requests = [


  { id: 'RQ-982', rider: 'Paula M.', pickup: 'City Mall', eta: '3m', status: 'Pendiente' },


  { id: 'RQ-986', rider: 'Luis A.', pickup: 'Kennedy', eta: '6m', status: 'Asignado' },


  { id: 'RQ-991', rider: 'Andrea C.', pickup: 'Urdesa', eta: '5m', status: 'Pendiente' }


];





export const CallCenterDispatchPanel: React.FC<ModuleProps> = ({ onNotify }) => {


  const handleNotify = (message: string, confirmText?: string) => {


    if (confirmText && !confirm(confirmText)) return;


    if (onNotify) onNotify(message);


  };


  return (


    <section className="space-y-6">


      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">


        <div>


          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Operaciones</p>


          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Despacho Call Center</h3>


          <p className="text-sm text-slate-500 dark:text-slate-400">


            Panel de asignación manual y control de llamadas.


          </p>


        </div>


        <button


          onClick={() => handleNotify('Modo despacho actualizado (demo).')}


          className="flex items-center gap-2 rounded-full border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 px-4 py-2 text-xs font-semibold text-slate-500 dark:text-slate-300"


        >


          <Radio size={14} />


          Modo despacho activo


        </button>


      </div>





      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">


        <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 shadow-sm">


          <div className="flex items-center justify-between">


            <h4 className="text-lg font-bold text-slate-900 dark:text-white">Solicitudes entrantes</h4>


            <button


              onClick={() => handleNotify('Tablero de solicitudes listo (demo).')}


              className="text-xs font-semibold text-sky-500 flex items-center gap-1"


            >


              Ver tablero <ArrowUpRight size={12} />


            </button>


          </div>


          <div className="mt-4 space-y-3">


            {requests.map((req) => (


              <div key={req.id} className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 py-3">


                <div className="flex items-center justify-between">


                  <div>


                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{req.id}</p>


                    <p className="text-xs text-slate-400">{req.pickup}</p>


                  </div>


                  <span className={`text-xs font-semibold ${req.status === 'Pendiente' ?  'text-amber-400' : 'text-emerald-400'}`}>


                    {req.status}


                  </span>


                </div>


                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">


                  <span className="flex items-center gap-1"><User size={12} /> {req.rider}</span>


                  <span className="flex items-center gap-1"><MapPin size={12} /> {req.pickup}</span>


                  <span className="flex items-center gap-1"><Clock size={12} /> ETA {req.eta}</span>


                </div>


                <div className="mt-3 flex gap-2">


                  <button


                  onClick={() => handleNotify('Solicitud asignada (demo).')}


                  className="rounded-full bg-slate-900 dark:bg-sky-500 text-white px-3 py-1 text-[11px] font-semibold"


                >


                  Asignar


                </button>


                  <button


                  onClick={() => handleNotify('Reprogramación lista (demo).')}


                  className="rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1 text-[11px] font-semibold"


                >


                  Reprogramar


                </button>


                </div>


              </div>


            ))}


          </div>


        </div>





        <div className="space-y-6">


          <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 shadow-sm">


            <h4 className="text-lg font-bold text-slate-900 dark:text-white">Agentes en linea</h4>


            <div className="mt-4 space-y-3">


              {agents.map((agent) => (


                <div key={agent.name} className="flex items-center justify-between rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 py-3">


                  <div className="flex items-center gap-3">


                    <div className="h-9 w-9 rounded-full bg-slate-200 dark:bg-slate-900 flex items-center justify-center text-slate-500">


                      <Headphones size={16} />


                    </div>


                    <div>


                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{agent.name}</p>


                      <p className="text-xs text-slate-400">{agent.status}</p>


                    </div>


                  </div>


                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{agent.active} activos</span>


                </div>


              ))}


            </div>


          </div>





          <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 shadow-sm">


            <h4 className="text-lg font-bold text-slate-900 dark:text-white">Flota sugerida</h4>


            <div className="mt-4 space-y-3">


              {['Carlos M.  Sedan', 'Rosa L.  SUV', 'Galo P.  Moto'].map((driver) => (


                <div key={driver} className="flex items-center justify-between rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 py-3">


                  <span className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-2">


                    <Car size={14} /> {driver}


                  </span>


                  <button


                  onClick={() => handleNotify('Conductor asignado (demo).')}


                  className="text-xs font-semibold text-sky-500"


                >


                  Asignar


                </button>


                </div>


              ))}


            </div>


          </div>


        </div>


      </div>


    </section>


  );


};


