import React from 'react';


import { Shield, Lock, KeyRound } from 'lucide-react';





interface ModuleProps {


  onNotify: (message: string) => void;


}





export const PrivacySecuritySettingsModule: React.FC<ModuleProps> = ({ onNotify }) => {


  const handleNotify = (message: string, confirmText?: string) => {


    if (confirmText && !confirm(confirmText)) return;


    if (onNotify) onNotify(message);


  };


  return (


    <section className="space-y-6">


      <div>


        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Configuración</p>


        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Privacidad y seguridad</h3>


        <p className="text-sm text-slate-500 dark:text-slate-400">


          Ajustes de proteccion, permisos y control de datos.


        </p>


      </div>





      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">


        {[


          { label: 'Autenticación 2FA', value: 'Activo', icon: Shield, tone: 'text-emerald-400' },


          { label: 'Sesiones abiertas', value: '3', icon: Lock, tone: 'text-sky-500' },


          { label: 'Rotación de claves', value: '30 días', icon: KeyRound, tone: 'text-amber-400' }


        ].map((stat) => {


          const Icon = stat.icon;


          return (


            <div key={stat.label} className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-4 shadow-sm">


              <div className="flex items-center justify-between">


                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">{stat.label}</p>


                <Icon size={16} className={stat.tone} />


              </div>


              <p className={`mt-2 text-2xl font-bold ${stat.tone}`}>{stat.value}</p>


            </div>


          );


        })}


      </div>





      <div className="grid gap-6 lg:grid-cols-2">


        {[


          { title: 'Permisos de acceso', note: 'Revisar roles y accesos por perfil.', action: 'Permisos de acceso listo (demo).' },


          { title: 'Política de datos', note: 'Retención y uso de información sensible.', action: 'Política de datos lista (demo).' },


          { title: 'Alertas de seguridad', note: 'Notificaciones ante actividad inusual.', action: 'Alertas de seguridad listas (demo).' },


          { title: 'Dispositivos confiables', note: 'Controla los dispositivos registrados.', action: 'Dispositivos confiables listos (demo).' }


        ].map((item) => (


          <button


            key={item.title}


            onClick={() => item.action && handleNotify(item.action)}


            className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 text-left"


          >


            <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.title}</p>


            <p className="text-xs text-slate-500 dark:text-slate-300 mt-1">{item.note}</p>


          </button>


        ))}


      </div>


    </section>


  );


};


