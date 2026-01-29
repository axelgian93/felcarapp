import React from 'react';


import { Users, Search, Filter, ShieldCheck, Mail } from 'lucide-react';





interface ModuleProps {


  onNotify: (message: string) => void;


}





const members = [


  { name: 'Camila Vega', role: 'Admin', dept: 'Operaciones', status: 'Activo' },


  { name: 'Diego Ruiz', role: 'Supervisor', dept: 'Ventas', status: 'Activo' },


  { name: 'Ana Torres', role: 'Empleado', dept: 'Marketing', status: 'Invitado' },


  { name: 'Luis Gómez', role: 'Empleado', dept: 'Operaciones', status: 'Activo' }


];





export const CorporateUserDirectory: React.FC<ModuleProps> = ({ onNotify }) => {


  const handleNotify = (message: string, confirmText?: string) => {


    if (confirmText && !confirm(confirmText)) return;


    if (onNotify) onNotify(message);


  };


  return (


    <section className="space-y-6">


      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">


        <div>


          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Corporate</p>


          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Directorio de usuarios</h3>


          <p className="text-sm text-slate-500 dark:text-slate-400">


            Gestiona equipos, roles y permisos de la cuenta corporativa.


          </p>


        </div>


        <div className="flex items-center gap-2">


          <button


            onClick={() => handleNotify('Filtros aplicados (demo).')}


            className="flex items-center gap-2 rounded-full border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 px-4 py-2 text-xs font-semibold text-slate-500 dark:text-slate-300"


          >


            <Filter size={14} />


            Filtrar


          </button>


          <button


            onClick={() => handleNotify('Busqueda lista (demo).')}


            className="flex items-center gap-2 rounded-full border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 px-4 py-2 text-xs font-semibold text-slate-500 dark:text-slate-300"


          >


            <Search size={14} />


            Buscar


          </button>


          <button


            onClick={() => handleNotify('Nuevo usuario listo (demo).')}


            className="rounded-full bg-slate-900 dark:bg-sky-500 text-white px-4 py-2 text-xs font-semibold"


          >


            + Nuevo usuario


          </button>


        </div>


      </div>





      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">


        {[


          { label: 'Usuarios activos', value: '842' },


          { label: 'Admins', value: '12' },


          { label: 'Invitaciones', value: '4' },


          { label: 'Departamentos', value: '6' }


        ].map((stat) => (


          <div key={stat.label} className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-4 shadow-sm">


            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">{stat.label}</p>


            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>


          </div>


        ))}


      </div>





      <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 shadow-sm">


        <h4 className="text-lg font-bold text-slate-900 dark:text-white">Equipo principal</h4>


        <div className="mt-4 grid gap-3 md:grid-cols-2">


          {members.map((member) => (


            <div key={member.name} className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 flex items-center justify-between">


              <div>


                <p className="text-sm font-semibold text-slate-900 dark:text-white">{member.name}</p>


                <p className="text-xs text-slate-400">{member.role} ? {member.dept}</p>


              </div>


              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">


                {member.role === 'Admin' ? <ShieldCheck size={14} /> : <Users size={14} />}


                {member.status}


              </div>


            </div>


          ))}


        </div>


        <button


          onClick={() => handleNotify('Invitaciones masivas enviadas (demo).')}


          className="mt-4 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400"


        >


          <Mail size={14} /> Enviar invitaciones masivas


        </button>


      </div>


    </section>


  );


};


