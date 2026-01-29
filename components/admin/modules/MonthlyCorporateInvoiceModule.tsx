import React from 'react';


import { FileText, ArrowUpRight } from 'lucide-react';





interface ModuleProps {


  onNotify: (message: string) => void;


}





const invoices = [


  { id: 'INV-2401', period: 'Enero', amount: '$12,450', status: 'Pendiente' },


  { id: 'INV-2398', period: 'Diciembre', amount: '$10,980', status: 'Pagada' },


  { id: 'INV-2389', period: 'Noviembre', amount: '$9,760', status: 'Pagada' }


];





export const MonthlyCorporateInvoiceModule: React.FC<ModuleProps> = ({ onNotify }) => {


  const handleNotify = (message: string, confirmText?: string) => {


    if (confirmText && !confirm(confirmText)) return;


    if (onNotify) onNotify(message);


  };


  return (


    <section className="space-y-6">


      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">


        <div>


          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Corporativo</p>


          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Factura mensual</h3>


          <p className="text-sm text-slate-500 dark:text-slate-400">


            Detalle de cargos y estado de facturación.


          </p>


        </div>


        <button


          onClick={() => handleNotify('Factura descargada (demo).')}


          className="flex items-center gap-2 rounded-full border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 px-4 py-2 text-xs font-semibold text-slate-500 dark:text-slate-300"


        >


          <FileText size={14} /> Descargar PDF


        </button>


      </div>





      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">


        {[


          { label: 'Factura actual', value: '$12,450', tone: 'text-sky-500' },


          { label: 'Saldo pendiente', value: '$4,200', tone: 'text-rose-400' },


          { label: 'Fecha corte', value: '30 Ene', tone: 'text-amber-400' },


          { label: 'Pagos realizados', value: '$8,250', tone: 'text-emerald-400' }


        ].map((stat) => (


          <div key={stat.label} className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-4 shadow-sm">


            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">{stat.label}</p>


            <p className={`mt-2 text-2xl font-bold ${stat.tone}`}>{stat.value}</p>


          </div>


        ))}


      </div>





      <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 shadow-sm">


        <div className="flex items-center justify-between">


          <h4 className="text-lg font-bold text-slate-900 dark:text-white">Historial de facturas</h4>


          <button


            onClick={() => handleNotify('Detalle de facturas listo (demo).')}


            className="text-xs font-semibold text-sky-500 flex items-center gap-1"


          >


            Ver detalle <ArrowUpRight size={12} />


          </button>


        </div>


        <div className="mt-4 space-y-3">


          {invoices.map((invoice) => (


            <div key={invoice.id} className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 flex items-center justify-between">


              <div>


                <p className="text-sm font-semibold text-slate-900 dark:text-white">{invoice.id}</p>


                <p className="text-xs text-slate-400">{invoice.period}</p>


              </div>


              <span className="text-sm font-semibold text-slate-900 dark:text-white">{invoice.amount}</span>


              <span className={`text-xs font-semibold ${invoice.status === 'Pagada' ?  'text-emerald-400' : 'text-amber-400'}`}>


                {invoice.status}


              </span>


            </div>


          ))}


        </div>


      </div>


    </section>


  );


};


