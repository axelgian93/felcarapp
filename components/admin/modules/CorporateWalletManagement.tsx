import React from 'react';


import { Plus, ArrowUpRight, ShieldCheck } from 'lucide-react';





const wallets = [


  { name: 'Wallet general', balance: '$18,420', status: 'Activo' },


  { name: 'Wallet proyectos', balance: '$6,200', status: 'Activo' },


  { name: 'Wallet viajes VIP', balance: '$2,480', status: 'Pendiente' }


];





interface CorporateWalletManagementProps {


  onNotify: (message: string) => void;


}





export const CorporateWalletManagement: React.FC<CorporateWalletManagementProps> = ({ onNotify }) => {


  const handleTopUp = () => {


    if (!confirm('Recargar fondos en wallet')) return;


    if (onNotify) {


      onNotify('Recarga aplicada (mock).');


    }


  };


  return (


    <section className="space-y-6">


      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">


        <div>


          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Corporativo</p>


          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Gestión de wallets</h3>


          <p className="text-sm text-slate-500 dark:text-slate-400">


            Fondos corporativos, recargas y control de saldos.


          </p>


        </div>


        <button onClick={handleTopUp} className="flex items-center gap-2 rounded-full bg-emerald-500 text-white px-4 py-2 text-xs font-semibold shadow-sm">


          <Plus size={14} /> Recargar fondos


        </button>


      </div>





      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">


        {[


          { label: 'Saldo total', value: '$27,100', tone: 'text-emerald-400' },


          { label: 'Gasto mensual', value: '$12,450', tone: 'text-sky-500' },


          { label: 'Wallets activas', value: '2', tone: 'text-amber-400' },


          { label: 'Alertas', value: '1', tone: 'text-rose-400' }


        ].map((stat) => (


          <div key={stat.label} className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-4 shadow-sm">


            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">{stat.label}</p>


            <p className={`mt-2 text-2xl font-bold ${stat.tone}`}>{stat.value}</p>


          </div>


        ))}


      </div>





      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">


        <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 shadow-sm">


          <div className="flex items-center justify-between">


            <h4 className="text-lg font-bold text-slate-900 dark:text-white">Wallets corporativas</h4>


            <button className="text-xs font-semibold text-sky-500 flex items-center gap-1">


              Ver detalle <ArrowUpRight size={12} />


            </button>


          </div>


          <div className="mt-4 space-y-3">


            {wallets.map((item) => (


              <div key={item.name} className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 flex items-center justify-between">


                <div>


                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.name}</p>


                  <p className="text-xs text-slate-400">Balance disponible</p>


                </div>


                <div className="text-right">


                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.balance}</p>


                  <p className={`text-xs font-semibold ${item.status === 'Activo' ?  'text-emerald-400' : 'text-amber-400'}`}>


                    {item.status}


                  </p>


                </div>


              </div>


            ))}


          </div>


        </div>





        <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 shadow-sm">


          <h4 className="text-lg font-bold text-slate-900 dark:text-white">Controles y seguridad</h4>


          <div className="mt-4 space-y-3 text-xs text-slate-500 dark:text-slate-300">


            <div className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 py-3">


              <p className="font-semibold text-slate-900 dark:text-white">Límite de gasto diario</p>


              <p className="mt-1">$1,200 por centro de costo</p>


            </div>


            <div className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 py-3">


              <p className="font-semibold text-slate-900 dark:text-white">Alertas automáticas</p>


              <p className="mt-1">Aviso cuando el saldo baja del 15%</p>


            </div>


          </div>


          <button className="mt-4 w-full rounded-full bg-slate-900 dark:bg-sky-500 text-white py-2 text-xs font-semibold flex items-center justify-center gap-2">


            <ShieldCheck size={14} /> Ajustar políticas


          </button>


        </div>


      </div>


    </section>


  );


};


