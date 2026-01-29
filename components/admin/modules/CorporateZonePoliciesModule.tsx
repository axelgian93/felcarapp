import React from 'react';


import { MapPin, ShieldCheck, ArrowUpRight } from 'lucide-react';





const zones = [


  { name: 'Zona Verde', rule: 'Libre', status: 'Activo' },


  { name: 'Zona Amarilla', rule: 'Aprobación', status: 'Activo' },


  { name: 'Zona Roja', rule: 'Restringido', status: 'En revisión' }


];





interface CorporateZonePoliciesModuleProps {


  onNotify: (message: string) => void;


}





export const CorporateZonePoliciesModule: React.FC<CorporateZonePoliciesModuleProps> = ({ onNotify }) => {


  const handleUpdate = () => {


    if (!confirm('Aplicar cambios de políticas de zona')) return;


    if (onNotify) {


      onNotify('Políticas de zona actualizadas (mock).');


    }


  };


  return (


    <section className="space-y-6">


      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">


        <div>


          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Corporativo</p>


          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Políticas de zona</h3>


          <p className="text-sm text-slate-500 dark:text-slate-400">


            Control geografico y restricciones de viaje.


          </p>


        </div>


        <button className="flex items-center gap-2 rounded-full border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 px-4 py-2 text-xs font-semibold text-slate-500 dark:text-slate-300">


          <ArrowUpRight size={14} /> Ver mapa


        </button>


      </div>





      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">


        <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 shadow-sm">


          <div className="flex items-center justify-between">


            <h4 className="text-lg font-bold text-slate-900 dark:text-white">Mapa corporativo</h4>


            <span className="text-xs font-semibold text-emerald-400">3 zonas activas</span>


          </div>


          <div className="mt-4 h-72 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-800/40 flex items-center justify-center text-xs text-slate-400">


            Vista de zonas y restricciones


          </div>


        </div>





        <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 shadow-sm">


          <h4 className="text-lg font-bold text-slate-900 dark:text-white">Reglas por zona</h4>


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


                <p className="text-xs text-slate-400">Regla: {zone.rule}</p>


              </div>


            ))}


          </div>


          <button onClick={handleUpdate} className="mt-4 w-full rounded-full bg-slate-900 dark:bg-sky-500 text-white py-2 text-xs font-semibold flex items-center justify-center gap-2">


            <ShieldCheck size={14} /> Ajustar políticas


          </button>


        </div>


      </div>


    </section>


  );


};


