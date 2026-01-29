import React from 'react';


import { Accessibility, Eye, Mic, CheckCircle2 } from 'lucide-react';





interface ModuleProps {


  onNotify: (message: string) => void;


}





export const AccessibilityInclusionSettingsModule: React.FC<ModuleProps> = ({ onNotify }) => {


  const handleNotify = (message: string, confirmText?: string) => {


    if (confirmText && !confirm(confirmText)) return;


    if (onNotify) onNotify(message);


  };


  return (


    <section className="space-y-6">


      <div>


        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Configuración</p>


        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Accesibilidad e inclusión</h3>


        <p className="text-sm text-slate-500 dark:text-slate-400">


          Preferencias para mejorar la experiencia de usuarios.


        </p>


      </div>





      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">


        {[


          { label: 'Modo alto contraste', value: 'Desactivado', icon: Eye, tone: 'text-sky-500' },


          { label: 'Lectura en voz', value: 'Activo', icon: Mic, tone: 'text-emerald-400' },


          { label: 'Asistencia visual', value: 'Configurado', icon: Accessibility, tone: 'text-amber-400' },


          { label: 'Preferencias guardadas', value: '8', icon: CheckCircle2, tone: 'text-rose-400' }


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


          { title: 'Idioma y lectura', note: 'Define idioma, lectura automática y subtítulos.', action: 'Preferencias de idioma listas (demo).' },


          { title: 'Preferencias de movilidad', note: 'Solicitudes de vehículo accesible.', action: 'Preferencias de movilidad listas (demo).' },


          { title: 'Soporte inclusivo', note: 'Canales especiales de soporte.', action: 'Soporte inclusivo listo (demo).' },


          { title: 'Alertas visuales', note: 'Notificaciones con iconografia mejorada.', action: 'Alertas visuales listas (demo).' }


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


