import React from 'react';


import { KeyRound, Mail, ShieldCheck } from 'lucide-react';





interface ModuleProps {


  onNotify: (message: string) => void;


}





const steps = [


  { title: 'Solicitud enviada', detail: 'Correo con código enviado' },


  { title: 'Verificación', detail: 'Código valido por 10 minutos' },


  { title: 'Nueva clave', detail: 'Actualiza tu contraseña' }


];





export const AccountRecoveryModule: React.FC<ModuleProps> = ({ onNotify }) => {


  const handleNotify = (message: string, confirmText?: string) => {


    if (confirmText && !confirm(confirmText)) return;


    if (onNotify) onNotify(message);


  };


  return (


    <section className="space-y-6">


      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">


        <div>


          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Configuración</p>


          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Recuperación de cuenta</h3>


          <p className="text-sm text-slate-500 dark:text-slate-400">


            Flujo de verificación y restablecimiento de contraseña.


          </p>


        </div>


        <button


          onClick={() => handleNotify('Código de recuperación enviado (demo).')}


          className="flex items-center gap-2 rounded-full bg-emerald-500 text-white px-4 py-2 text-xs font-semibold shadow-sm"


        >


          <Mail size={14} /> Enviar código


        </button>


      </div>





      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">


        {[


          { label: 'Solicitudes hoy', value: '12', tone: 'text-sky-500' },


          { label: 'Exitosas', value: '10', tone: 'text-emerald-400' },


          { label: 'Pendientes', value: '2', tone: 'text-amber-400' },


          { label: 'Bloqueadas', value: '1', tone: 'text-rose-400' }


        ].map((stat) => (


          <div key={stat.label} className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-4 shadow-sm">


            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">{stat.label}</p>


            <p className={`mt-2 text-2xl font-bold ${stat.tone}`}>{stat.value}</p>


          </div>


        ))}


      </div>





      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">


        <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 shadow-sm">


          <h4 className="text-lg font-bold text-slate-900 dark:text-white">Flujo recomendado</h4>


          <div className="mt-4 space-y-3">


            {steps.map((step, index) => (


              <div key={step.title} className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 py-3">


                <div className="flex items-center justify-between">


                  <p className="text-sm font-semibold text-slate-900 dark:text-white">Paso {index + 1}: {step.title}</p>


                  <ShieldCheck size={14} className="text-emerald-400" />


                </div>


                <p className="text-xs text-slate-500 dark:text-slate-300 mt-1">{step.detail}</p>


              </div>


            ))}


          </div>


        </div>





        <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 shadow-sm">


          <h4 className="text-lg font-bold text-slate-900 dark:text-white">Políticas de seguridad</h4>


          <div className="mt-4 space-y-3 text-xs text-slate-500 dark:text-slate-300">


            <div className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 flex items-center gap-2">


              <KeyRound size={14} className="text-sky-500" /> Código valido 10 minutos


            </div>


            <div className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 flex items-center gap-2">


              <KeyRound size={14} className="text-amber-400" /> Maximo 3 intentos


            </div>


          </div>


          <button


            onClick={() => handleNotify('Políticas de recuperación listas (demo).')}


            className="mt-4 w-full rounded-full bg-slate-900 dark:bg-sky-500 text-white py-2 text-xs font-semibold"


          >


            Ajustar políticas


          </button>


        </div>


      </div>


    </section>


  );


};


