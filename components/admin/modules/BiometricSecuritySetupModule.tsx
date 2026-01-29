import React from 'react';


import { Fingerprint, ShieldCheck } from 'lucide-react';





interface ModuleProps {


  onNotify: (message: string) => void;


}





const methods = [


  { name: 'Huella digital', status: 'Activo' },


  { name: 'Reconocimiento facial', status: 'Activo' },


  { name: 'PIN de respaldo', status: 'Configurado' }


];





export const BiometricSecuritySetupModule: React.FC<ModuleProps> = ({ onNotify }) => {


  const handleNotify = (message: string, confirmText?: string) => {


    if (confirmText && !confirm(confirmText)) return;


    if (onNotify) onNotify(message);


  };


  return (


    <section className="space-y-6">


      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">


        <div>


          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Configuración</p>


          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Seguridad biométrica</h3>


          <p className="text-sm text-slate-500 dark:text-slate-400">


            Autenticación reforzada y métodos de acceso.


          </p>


        </div>


        <button


          onClick={() => handleNotify('Configuración biométrica lista (demo).')}


          className="flex items-center gap-2 rounded-full bg-emerald-500 text-white px-4 py-2 text-xs font-semibold shadow-sm"


        >


          <Fingerprint size={14} /> Configurar


        </button>


      </div>





      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">


        {[


          { label: 'Usuarios protegidos', value: '128', tone: 'text-emerald-400' },


          { label: 'Intentos bloqueados', value: '6', tone: 'text-rose-400' },


          { label: 'Nivel de seguridad', value: 'Alto', tone: 'text-sky-500' }


        ].map((stat) => (


          <div key={stat.label} className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-4 shadow-sm">


            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">{stat.label}</p>


            <p className={`mt-2 text-2xl font-bold ${stat.tone}`}>{stat.value}</p>


          </div>


        ))}


      </div>





      <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 shadow-sm">


        <div className="flex items-center justify-between">


          <h4 className="text-lg font-bold text-slate-900 dark:text-white">Métodos configurados</h4>


          <ShieldCheck size={16} className="text-emerald-400" />


        </div>


        <div className="mt-4 space-y-3">


          {methods.map((item) => (


            <div key={item.name} className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 flex items-center justify-between">


              <span className="text-sm font-semibold text-slate-900 dark:text-white">{item.name}</span>


              <span className={`text-xs font-semibold ${item.status === 'Activo' ?  'text-emerald-400' : 'text-amber-400'}`}>


                {item.status}


              </span>


            </div>


          ))}


        </div>


        <button


          onClick={() => handleNotify('Políticas biometría listas (demo).')}


          className="mt-4 w-full rounded-full bg-slate-900 dark:bg-sky-500 text-white py-2 text-xs font-semibold"


        >


          Revisar políticas


        </button>


      </div>


    </section>


  );


};


