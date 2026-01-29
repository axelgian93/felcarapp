import React from 'react';


import { Wallet, Plus, ArrowUpRight } from 'lucide-react';





const centers = [


  { name: 'Ventas', spent: '$8,240', limit: '$12,000', status: 'En rango' },


  { name: 'Marketing', spent: '$6,120', limit: '$9,000', status: 'En rango' },


  { name: 'Operaciones', spent: '$9,880', limit: '$10,000', status: 'Cerca del límite' }


];





interface CostCenterManagementModuleProps {


  onNotify: (message: string) => void;


}





export const CostCenterManagementModule: React.FC<CostCenterManagementModuleProps> = ({ onNotify }) => {


  const handleCreate = () => {


    if (!confirm('Crear nuevo centro de costo')) return;


    if (onNotify) {


      onNotify('Centro de costo creado (mock).');


    }


  };


  return (


    <section className="space-y-6">


      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">


        <div>


          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Corporativo</p>


          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Centros de costo</h3>


          <p className="text-sm text-slate-500 dark:text-slate-400">


            Control de presupuestos y consumo por area.


          </p>


        </div>


        <button onClick={handleCreate} className="flex items-center gap-2 rounded-full bg-emerald-500 text-white px-4 py-2 text-xs font-semibold shadow-sm">


          <Plus size={14} /> Crear centro


        </button>


      </div>





      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">


        {[


          { label: 'Centros activos', value: '5', tone: 'text-sky-500' },


          { label: 'Gasto total', value: '$24,240', tone: 'text-emerald-400' },


          { label: 'Alertas', value: '1', tone: 'text-rose-400' },


          { label: 'Presupuesto total', value: '$31,000', tone: 'text-amber-400' }


        ].map((stat) => (


          <div key={stat.label} className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-4 shadow-sm">


            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">{stat.label}</p>


            <p className={`mt-2 text-2xl font-bold ${stat.tone}`}>{stat.value}</p>


          </div>


        ))}


      </div>





      <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 shadow-sm">


        <div className="flex items-center justify-between">


          <h4 className="text-lg font-bold text-slate-900 dark:text-white">Resumen por centro</h4>


          <button className="text-xs font-semibold text-sky-500 flex items-center gap-1">


            Ver detalle <ArrowUpRight size={12} />


          </button>


        </div>


        <div className="mt-4 space-y-3">


          {centers.map((center) => (


            <div key={center.name} className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 py-3">


              <div className="flex items-center justify-between">


                <p className="text-sm font-semibold text-slate-900 dark:text-white">{center.name}</p>


                <span className={`text-xs font-semibold ${center.status === 'En rango' ?  'text-emerald-400' : 'text-amber-400'}`}>


                  {center.status}


                </span>


              </div>


              <div className="mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-300">


                <span>Gastado {center.spent}</span>


                <span>Limite {center.limit}</span>


              </div>


            </div>


          ))}


        </div>


        <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">


          <Wallet size={14} /> Ajusta límites y reglas por centro.


        </div>


      </div>


    </section>


  );


};


