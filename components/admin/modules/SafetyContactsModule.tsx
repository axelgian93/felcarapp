import React from 'react';


import { ShieldCheck, PhoneCall, Plus } from 'lucide-react';





interface ModuleProps {


  onNotify: (message: string) => void;


}





const contacts = [


  { name: 'Laura M.', role: 'Familiar', phone: '+593 999 000 221' },


  { name: 'Seguridad Empresa', role: 'Empresa', phone: '+593 999 555 120' },


  { name: 'Policia Local', role: 'Emergencia', phone: '911' }


];





export const SafetyContactsModule: React.FC<ModuleProps> = ({ onNotify }) => {


  const handleNotify = (message: string, confirmText?: string) => {


    if (confirmText && !confirm(confirmText)) return;


    if (onNotify) onNotify(message);


  };


  return (


    <section className="space-y-6">


      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">


        <div>


          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Configuración</p>


          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Contactos de seguridad</h3>


          <p className="text-sm text-slate-500 dark:text-slate-400">


            Gestiona contactos de emergencia y protocolos.


          </p>


        </div>


        <button


          onClick={() => handleNotify('Contacto agregado (demo).')}


          className="flex items-center gap-2 rounded-full bg-emerald-500 text-white px-4 py-2 text-xs font-semibold shadow-sm"


        >


          <Plus size={14} /> Agregar contacto


        </button>


      </div>





      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">


        {[


          { label: 'Contactos activos', value: '3', tone: 'text-emerald-400' },


          { label: 'Protocolos', value: '2', tone: 'text-sky-500' },


          { label: 'Alertas activas', value: '1', tone: 'text-rose-400' }


        ].map((stat) => (


          <div key={stat.label} className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-4 shadow-sm">


            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">{stat.label}</p>


            <p className={`mt-2 text-2xl font-bold ${stat.tone}`}>{stat.value}</p>


          </div>


        ))}


      </div>





      <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 shadow-sm">


        <div className="flex items-center justify-between">


          <h4 className="text-lg font-bold text-slate-900 dark:text-white">Lista de contactos</h4>


          <ShieldCheck size={16} className="text-emerald-400" />


        </div>


        <div className="mt-4 space-y-3">


          {contacts.map((contact) => (


            <div key={contact.name} className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 flex items-center justify-between">


              <div>


                <p className="text-sm font-semibold text-slate-900 dark:text-white">{contact.name}</p>


                <p className="text-xs text-slate-400">{contact.role}  {contact.phone}</p>


              </div>


              <button


                onClick={() => handleNotify('Llamada a contacto iniciada (demo).')}


                className="text-xs font-semibold text-sky-500 flex items-center gap-1"


              >


                <PhoneCall size={12} /> Llamar


              </button>


            </div>


          ))}


        </div>


      </div>


    </section>


  );


};


