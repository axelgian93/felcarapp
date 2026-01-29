import React from 'react';


import { CreditCard, FileText, ArrowUpRight, Building2 } from 'lucide-react';





interface ModuleProps {


  onNotify: (message: string) => void;


}





const invoices = [


  { id: 'INV-9921', amount: '$12,450', status: 'Pendiente', date: 'Hoy' },


  { id: 'INV-9918', amount: '$9,120', status: 'Pagada', date: 'Ayer' },


  { id: 'INV-9902', amount: '$6,740', status: 'Vencida', date: '12 Ene' }


];





export const CorporateBillingManagement: React.FC<ModuleProps> = ({ onNotify }) => {


  const handleNotify = (message: string, confirmText?: string) => {


    if (confirmText && !confirm(confirmText)) return;


    if (onNotify) onNotify(message);


  };


  return (


    <section className="space-y-6">


      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">


        <div>


          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Corporate</p>


          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Gestión de facturación</h3>


          <p className="text-sm text-slate-500 dark:text-slate-400">


            Estado de facturas, métodos de pago y límites corporativos.


          </p>


        </div>


        <button


          onClick={() => handleNotify('Reporte exportado (demo).')}


          className="flex items-center gap-2 rounded-full border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 px-4 py-2 text-xs font-semibold text-slate-500 dark:text-slate-300"


        >


          <FileText size={14} />


          Exportar reporte


        </button>


      </div>





      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">


        {[


          { label: 'Saldo mensual', value: '$42,800', tone: 'text-sky-500' },


          { label: 'Crédito usado', value: '$19,420', tone: 'text-amber-400' },


          { label: 'Facturas pendientes', value: '3', tone: 'text-rose-400' },


          { label: 'Pagos procesados', value: '$28,100', tone: 'text-emerald-400' }


        ].map((stat) => (


          <div key={stat.label} className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-4 shadow-sm">


            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">{stat.label}</p>


            <p className={`mt-2 text-2xl font-bold ${stat.tone}`}>{stat.value}</p>


          </div>


        ))}


      </div>





      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">


        <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 shadow-sm">


          <div className="flex items-center justify-between">


            <h4 className="text-lg font-bold text-slate-900 dark:text-white">Facturas recientes</h4>


            <button


              onClick={() => handleNotify('Listado de facturas listo (demo).')}


              className="text-xs font-semibold text-sky-500 flex items-center gap-1"


            >


              Ver todo <ArrowUpRight size={12} />


            </button>


          </div>


          <div className="mt-4 space-y-3">


            {invoices.map((invoice) => (


              <div key={invoice.id} className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 flex flex-wrap items-center justify-between gap-3">


                <div>


                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{invoice.id}</p>


                  <p className="text-xs text-slate-400">{invoice.date}</p>


                </div>


                <span className="text-sm font-semibold text-slate-900 dark:text-white">{invoice.amount}</span>


                <span className={`text-xs font-semibold ${


                  invoice.status === 'Pagada' ? 'text-emerald-400' : invoice.status === 'Vencida' ? 'text-rose-400' : 'text-amber-400'


                }`}>


                  {invoice.status}


                </span>


              </div>


            ))}


          </div>


        </div>





        <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 shadow-sm">


          <h4 className="text-lg font-bold text-slate-900 dark:text-white">Métodos de pago</h4>


          <div className="mt-4 space-y-3">


            {['Visa corporativa', 'Transferencia bancaria', 'Wallet empresarial'].map((method) => (


              <div key={method} className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 flex items-center justify-between">


                <span className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-2">


                  <CreditCard size={14} /> {method}


                </span>


                <button


                onClick={() => handleNotify('Método de pago listo (demo).')}


                className="text-xs font-semibold text-sky-500"


              >


                Editar


              </button>


              </div>


            ))}


          </div>


          <div className="mt-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 px-4 py-3 text-center text-xs text-slate-400">


            + Agregar método de pago


          </div>


        </div>


      </div>





      <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 shadow-sm">


        <h4 className="text-lg font-bold text-slate-900 dark:text-white">Límites por centro de costo</h4>


        <div className="mt-4 grid gap-3 md:grid-cols-3">


          {['Ventas', 'Marketing', 'Operaciones'].map((dept) => (


            <div key={dept} className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 py-3">


              <p className="text-xs text-slate-400 uppercase tracking-[0.2em]">{dept}</p>


              <p className="mt-2 text-lg font-bold text-slate-900 dark:text-white">$8,400</p>


              <p className="text-xs text-slate-400">Disponible 42%</p>


            </div>


          ))}


        </div>


        <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">


          <Building2 size={14} /> Configurar políticas por departamento


        </div>


      </div>


    </section>


  );


};


