import React from 'react';


import { Shield, Users, ArrowUpRight } from 'lucide-react';





interface ModuleProps {


  onNotify: (message: string) => void;


}





const roles = [


  { name: 'Admin', access: 'Completo', status: 'Activo' },


  { name: 'Operaciones', access: 'Limitado', status: 'Activo' },


  { name: 'Soporte', access: 'Lectura', status: 'En revisión' }


];





export const DataPermissionsControlModule: React.FC<ModuleProps> = ({ onNotify }) => {


  const handleNotify = (message: string, confirmText?: string) => {


    if (confirmText && !confirm(confirmText)) return;


    if (onNotify) onNotify(message);


  };


  return (


    <section className="space-y-6">


      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">


        <div>


          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Configuración</p>


          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Datos y permisos</h3>


          <p className="text-sm text-slate-500 dark:text-slate-400">


            Control de acceso por roles y equipos.


          </p>


        </div>


        <button


          onClick={() => handleNotify('Gestión de permisos lista (demo).')}


          className="flex items-center gap-2 rounded-full border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 px-4 py-2 text-xs font-semibold text-slate-500 dark:text-slate-300"


        >


          <ArrowUpRight size={14} /> Gestionar


        </button>


      </div>





      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">


        {[


          { label: 'Roles activos', value: '5', tone: 'text-sky-500' },


          { label: 'Accesos pendientes', value: '3', tone: 'text-amber-400' },


          { label: 'Incidentes', value: '1', tone: 'text-rose-400' },


          { label: 'Usuarios con acceso', value: '86', tone: 'text-emerald-400' }


        ].map((stat) => (


          <div key={stat.label} className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-4 shadow-sm">


            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">{stat.label}</p>


            <p className={`mt-2 text-2xl font-bold ${stat.tone}`}>{stat.value}</p>


          </div>


        ))}


      </div>





      <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 shadow-sm">


        <div className="flex items-center justify-between">


          <h4 className="text-lg font-bold text-slate-900 dark:text-white">Roles y permisos</h4>


          <Shield size={16} className="text-sky-500" />


        </div>


        <div className="mt-4 space-y-3">


          {roles.map((role) => (


            <div key={role.name} className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 flex items-center justify-between">


              <div>


                <p className="text-sm font-semibold text-slate-900 dark:text-white">{role.name}</p>


                <p className="text-xs text-slate-400">Acceso {role.access}</p>


              </div>


              <span className={`text-xs font-semibold ${role.status === 'Activo' ?  'text-emerald-400' : 'text-amber-400'}`}>


                {role.status}


              </span>


            </div>


          ))}


        </div>


        <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">


          <Users size={14} /> Ajusta permisos por equipo.


        </div>


      </div>


    </section>


  );


};


