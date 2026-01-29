import React from 'react';


import { Building2, CheckCircle2, MapPin, ShieldCheck } from 'lucide-react';





const policies = [


  { name: 'Viajes nocturnos', status: 'Activo', detail: 'Hasta 22:00' },


  { name: 'Zonas restringidas', status: 'Activo', detail: 'Zona roja' },


  { name: 'Aprobación previa', status: 'En revisión', detail: 'Gerencia' }


];





interface CorporateTravelPoliciesProps {


  onNotify: (message: string) => void;


}





export const CorporateTravelPolicies: React.FC<CorporateTravelPoliciesProps> = ({ onNotify }) => {


  const handleUpdate = () => {


    if (!confirm('Aplicar cambios de políticas de viaje')) return;


    if (onNotify) {


      onNotify('Políticas de viaje actualizadas (mock).');


    }


  };





  const handleCreate = () => {


    if (!confirm('Crear nueva política')) return;


    if (onNotify) {


      onNotify('Política creada (mock).');


    }


  };





  return (


    <section className="space-y-6">


      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">


        <div>


          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Corporativo</p>


          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Políticas de viaje</h3>


          <p className="text-sm text-slate-500 dark:text-slate-400">Define reglas, límites y aprobaciones.</p>


        </div>


        <button


          onClick={handleCreate}


          className="flex items-center gap-2 rounded-full bg-emerald-500 text-white px-4 py-2 text-xs font-semibold shadow-sm"


        >


          <Building2 size={14} /> Crear política


        </button>


      </div>





      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">


        {[


          { label: 'Políticas activas', value: '4', tone: 'text-sky-500' },


          { label: 'Aprobaciones', value: '6', tone: 'text-amber-400' },


          { label: 'Alertas', value: '2', tone: 'text-rose-400' },


          { label: 'Cumplimiento', value: '92%', tone: 'text-emerald-400' }


        ].map((stat) => (


          <div key={stat.label} className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-4 shadow-sm">


            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">{stat.label}</p>


            <p className={`mt-2 text-2xl font-bold ${stat.tone}`}>{stat.value}</p>


          </div>


        ))}


      </div>





      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">


        <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 shadow-sm">


          <h4 className="text-lg font-bold text-slate-900 dark:text-white">Reglas configuradas</h4>


          <div className="mt-4 space-y-3">


            {policies.map((policy) => (


              <div key={policy.name} className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 py-3">


                <div className="flex items-center justify-between">


                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{policy.name}</p>


                  <span className={`text-xs font-semibold ${policy.status === 'Activo' ?  'text-emerald-400' : 'text-amber-400'}`}>


                    {policy.status}


                  </span>


                </div>


                <p className="text-xs text-slate-400">{policy.detail}</p>


              </div>


            ))}


          </div>


        </div>





        <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 shadow-sm">


          <h4 className="text-lg font-bold text-slate-900 dark:text-white">Zonas y límites</h4>


          <div className="mt-4 space-y-3 text-xs text-slate-500 dark:text-slate-300">


            <div className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 flex items-center gap-2">


              <MapPin size={14} className="text-sky-500" /> Zona verde sin aprobación


            </div>


            <div className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 flex items-center gap-2">


              <ShieldCheck size={14} className="text-amber-400" /> Límite diario $120


            </div>


          </div>


          <button


            onClick={handleUpdate}


            className="mt-4 w-full rounded-xl bg-slate-900 dark:bg-sky-500 text-white py-3 text-sm font-semibold"


          >


            Guardar cambios


          </button>


          <button


            onClick={handleUpdate}


            className="mt-3 w-full rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 py-3 text-sm font-semibold text-slate-600 dark:text-slate-300"


          >


            Restaurar reglas


          </button>


          <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">


            <CheckCircle2 size={14} /> Políticas sincronizadas


          </div>


        </div>


      </div>


    </section>


  );


};


