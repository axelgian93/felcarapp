import React from 'react';


import { Moon, Sun, Monitor } from 'lucide-react';





interface ModuleProps {


  onNotify: (message: string) => void;


}





export const NightModeConfigurationModule: React.FC<ModuleProps> = ({ onNotify }) => {


  const handleNotify = (message: string, confirmText?: string) => {


    if (confirmText && !confirm(confirmText)) return;


    if (onNotify) onNotify(message);


  };


  return (


    <section className="space-y-6">


      <div>


        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Configuración</p>


        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Modo nocturno</h3>


        <p className="text-sm text-slate-500 dark:text-slate-400">


          Ajustes de tema y preferencias de pantalla.


        </p>


      </div>





      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">


        {[


          { label: 'Tema actual', value: 'Automatico', icon: Monitor, tone: 'text-sky-500' },


          { label: 'Horario nocturno', value: '19:00 - 06:00', icon: Moon, tone: 'text-emerald-400' },


          { label: 'Brillo auto', value: 'Activo', icon: Sun, tone: 'text-amber-400' }


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


          { title: 'Auto alternar tema', note: 'Cambia a dark según horario.', action: 'Auto alternar activado (demo).' },


          { title: 'Preferencias manuales', note: 'Preferencias manuales listas (demo).' },


          { title: 'Contraste adicional', note: 'Contraste adicional listo (demo).' },


          { title: 'Mapa nocturno', note: 'Mapa nocturno listo (demo).' }


        ].map((item) => (


          <button


            key={item.title}


            onClick={() => handleNotify(item.action || `${item.title} listo (demo).`)}


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


