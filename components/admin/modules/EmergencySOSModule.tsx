import React from 'react';


import { ShieldAlert, PhoneCall, Share2 } from 'lucide-react';





interface ModuleProps {


  onNotify: (message: string) => void;


}





export const EmergencySOSModule: React.FC<ModuleProps> = ({ onNotify }) => {


  const handleNotify = (message: string, confirmText?: string) => {


    if (confirmText && !confirm(confirmText)) return;


    if (onNotify) onNotify(message);


  };


  return (


    <section className="space-y-6">


      <div>


        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Pasajeros</p>


        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">SOS de emergencia</h3>


        <p className="text-sm text-slate-500 dark:text-slate-400">


          Acceso rápido a asistencia y contactos de seguridad.


        </p>


      </div>





      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">


        <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-6 shadow-sm text-center">


          <div className="mx-auto h-20 w-20 rounded-full bg-rose-500/15 flex items-center justify-center">


            <ShieldAlert size={32} className="text-rose-500" />


          </div>


          <h4 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">Boton SOS</h4>


          <p className="text-xs text-slate-500 dark:text-slate-300 mt-2">


            Presiona para notificar al centro de monitoreo.


          </p>


          <button


            onClick={() => handleNotify('Emergencia activada (demo).', 'Confirmar alerta SOS')}


            className="mt-5 w-full rounded-full bg-rose-500 text-white py-3 text-sm font-semibold"


          >


            Activar emergencia


          </button>


        </div>





        <div className="space-y-4">


          <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 shadow-sm">


            <h4 className="text-lg font-bold text-slate-900 dark:text-white">Contactos de confianza</h4>


            <div className="mt-4 space-y-3">


              {['Laura M.', 'Carlos P.', 'Oficina Seguridad'].map((name) => (


                <div key={name} className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 flex items-center justify-between">


                  <span className="text-sm text-slate-900 dark:text-white">{name}</span>


                  <button


                  onClick={() => handleNotify('Editar contacto listo (demo).')}


                  className="text-xs font-semibold text-sky-500"


                >


                  Editar


                </button>


                </div>


              ))}


            </div>


          </div>





          <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 shadow-sm">


            <h4 className="text-lg font-bold text-slate-900 dark:text-white">Acciones rápidas</h4>


            <div className="mt-4 grid gap-2 sm:grid-cols-2">


              <button


                onClick={() => handleNotify('Llamada de emergencia iniciada (demo).', 'Confirmar llamada de emergencia')}


                className="flex items-center justify-center gap-2 rounded-full bg-slate-900 dark:bg-sky-500 text-white py-2 text-xs font-semibold"


              >


                <PhoneCall size={14} /> Llamar 911


              </button>


              <button


                onClick={() => handleNotify('Compartir viaje listo (demo).')}


                className="flex items-center justify-center gap-2 rounded-full border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 text-slate-600 dark:text-slate-200 py-2 text-xs font-semibold"


              >


                <Share2 size={14} /> Compartir viaje


              </button>


            </div>


          </div>


        </div>


      </div>


    </section>


  );


};


