import React from 'react';


import { BadgeCheck, Users, Plus, ArrowUpRight } from 'lucide-react';





const passes = [


  { name: 'Pase Oro', owners: 42, status: 'Activo' },


  { name: 'Pase Ejecutivo', owners: 18, status: 'Activo' },


  { name: 'Pase Visitante', owners: 12, status: 'En revisión' }


];





interface CorporatePassManagementProps {


  onNotify: (message: string) => void;


}





export const CorporatePassManagement: React.FC<CorporatePassManagementProps> = ({ onNotify }) => {


  const handleCreate = () => {


    if (!confirm('Crear nuevo pase corporativo')) return;


    if (onNotify) {


      onNotify('Pase creado (mock).');


    }


  };


  return (


    <section className="space-y-6">


      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">


        <div>


          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Corporativo</p>


          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Gestión de pases</h3>


          <p className="text-sm text-slate-500 dark:text-slate-400">


            Administra pases corporativos, cupos y beneficiarios.


          </p>


        </div>


        <button onClick={handleCreate} className="flex items-center gap-2 rounded-full bg-emerald-500 text-white px-4 py-2 text-xs font-semibold shadow-sm">


          <Plus size={14} /> Crear pase


        </button>


      </div>





      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">


        {[


          { label: 'Pases activos', value: '3', tone: 'text-sky-500' },


          { label: 'Usuarios con pase', value: '72', tone: 'text-emerald-400' },


          { label: 'Uso mensual', value: '1,240', tone: 'text-amber-400' },


          { label: 'Ahorro estimado', value: '$2,180', tone: 'text-rose-400' }


        ].map((stat) => (


          <div key={stat.label} className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-4 shadow-sm">


            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">{stat.label}</p>


            <p className={`mt-2 text-2xl font-bold ${stat.tone}`}>{stat.value}</p>


          </div>


        ))}


      </div>





      <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 shadow-sm">


        <div className="flex items-center justify-between">


          <h4 className="text-lg font-bold text-slate-900 dark:text-white">Pases vigentes</h4>


          <button className="text-xs font-semibold text-sky-500 flex items-center gap-1">


            Ver detalle <ArrowUpRight size={12} />


          </button>


        </div>


        <div className="mt-4 space-y-3">


          {passes.map((item) => (


            <div key={item.name} className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 flex items-center justify-between">


              <div>


                <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.name}</p>


                <p className="text-xs text-slate-400 flex items-center gap-1">


                  <Users size={12} /> {item.owners} usuarios


                </p>


              </div>


              <span className={`text-xs font-semibold ${item.status === 'Activo' ?  'text-emerald-400' : 'text-amber-400'}`}>


                {item.status}


              </span>


            </div>


          ))}


        </div>


      </div>





      <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40 p-5 text-xs text-slate-400 flex items-center gap-2">


        <BadgeCheck size={14} />


        Define reglas por pase y límites por colaborador.


      </div>


    </section>


  );


};


