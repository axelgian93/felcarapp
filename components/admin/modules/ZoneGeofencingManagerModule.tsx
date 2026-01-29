import React from 'react';


import { Shield, MapPin, ArrowUpRight } from 'lucide-react';





const zones = [


  { name: 'Centro', radius: '2.4 km', status: 'Activo' },


  { name: 'Aeropuerto', radius: '3.1 km', status: 'Activo' },


  { name: 'Zona Industrial', radius: '1.8 km', status: 'En revisión' }


];





interface ZoneGeofencingManagerModuleProps {


  onNotify: (message: string) => void;


}





export const ZoneGeofencingManagerModule: React.FC<ZoneGeofencingManagerModuleProps> = ({ onNotify }) => {


  const handleCreate = () => {


    if (!confirm('Crear nueva geocerca')) return;


    if (onNotify) {


      onNotify('Geocerca creada (mock).');


    }


  };





  const handleViewMap = () => {


    if (onNotify) {


      onNotify('Mapa de geocercas no disponible en demo.');


    }


  };


  return (


    <section className="space-y-6">


      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">


        <div>


          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Operaciones</p>


          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Gestor de geocercas</h3>


          <p className="text-sm text-slate-500 dark:text-slate-400">


            Configura zonas, radios y reglas operativas.


          </p>


        </div>


        <button onClick={handleCreate} className="flex items-center gap-2 rounded-full bg-emerald-500 text-white px-4 py-2 text-xs font-semibold shadow-sm">


          <Shield size={14} /> Crear zona


        </button>


      </div>





      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">


        <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 shadow-sm">


          <div className="flex items-center justify-between">


            <h4 className="text-lg font-bold text-slate-900 dark:text-white">Mapa de geocercas</h4>


            <button onClick={handleViewMap} className="text-xs font-semibold text-sky-500 flex items-center gap-1">


              Ver mapa <ArrowUpRight size={12} />


            </button>


          </div>


          <div className="mt-4 h-72 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-800/40 flex items-center justify-center text-xs text-slate-400">


            Vista de zonas y radios


          </div>


        </div>





        <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 shadow-sm">


          <h4 className="text-lg font-bold text-slate-900 dark:text-white">Zonas activas</h4>


          <div className="mt-4 space-y-3">


            {zones.map((zone) => (


              <div key={zone.name} className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 py-3">


                <div className="flex items-center justify-between">


                  <p className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">


                    <MapPin size={14} className="text-sky-500" /> {zone.name}


                  </p>


                  <span className={`text-xs font-semibold ${zone.status === 'Activo' ?  'text-emerald-400' : 'text-amber-400'}`}>


                    {zone.status}


                  </span>


                </div>


                <p className="text-xs text-slate-400">Radio {zone.radius}</p>


              </div>


            ))}


          </div>


        </div>


      </div>


    </section>


  );


};


