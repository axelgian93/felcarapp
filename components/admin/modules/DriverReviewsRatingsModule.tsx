import React from 'react';


import { MessageSquare, ArrowUpRight } from 'lucide-react';





interface ModuleProps {


  onNotify: (message: string) => void;


}





const reviews = [


  { driver: 'Luis P.', rating: 4.9, comment: 'Muy puntual y amable.' },


  { driver: 'Carla S.', rating: 4.7, comment: 'Buen servicio, auto limpio.' },


  { driver: 'Marco T.', rating: 4.5, comment: 'Conducción segura.' }


];





export const DriverReviewsRatingsModule: React.FC<ModuleProps> = ({ onNotify }) => {


  const handleNotify = (message: string, confirmText?: string) => {


    if (confirmText && !confirm(confirmText)) return;


    if (onNotify) onNotify(message);


  };


  return (


    <section className="space-y-6">


      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">


        <div>


          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Conductores</p>


          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Reseñas y ratings</h3>


          <p className="text-sm text-slate-500 dark:text-slate-400">


            Seguimiento de calificaciones y comentarios.


          </p>


        </div>


        <button


          onClick={() => handleNotify('Detalle de reseñas listo (demo).')}


          className="flex items-center gap-2 rounded-full border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 px-4 py-2 text-xs font-semibold text-slate-500 dark:text-slate-300"


        >


          <ArrowUpRight size={14} /> Ver detalle


        </button>


      </div>





      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">


        {[


          { label: 'Rating promedio', value: '4.8', tone: 'text-amber-400' },


          { label: 'Reseñas nuevas', value: '22', tone: 'text-sky-500' },


          { label: 'Alertas', value: '3', tone: 'text-rose-400' },


          { label: 'Reconocimientos', value: '12', tone: 'text-emerald-400' }


        ].map((stat) => (


          <div key={stat.label} className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-4 shadow-sm">


            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">{stat.label}</p>


            <p className={`mt-2 text-2xl font-bold ${stat.tone}`}>{stat.value}</p>


          </div>


        ))}


      </div>





      <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 shadow-sm">


        <div className="flex items-center justify-between">


          <h4 className="text-lg font-bold text-slate-900 dark:text-white">Últimas reseñas</h4>


          <MessageSquare size={16} className="text-sky-500" />


        </div>


        <div className="mt-4 space-y-3">


          {reviews.map((review) => (


            <div key={review.driver} className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 py-3">


              <div className="flex items-center justify-between">


                <p className="text-sm font-semibold text-slate-900 dark:text-white">{review.driver}</p>


                <span className="text-xs font-semibold text-amber-400">{review.rating} </span>


              </div>


              <p className="text-xs text-slate-500 dark:text-slate-300 mt-1">{review.comment}</p>


            </div>


          ))}


        </div>


      </div>


    </section>


  );


};


