import React from 'react';


import { Bell, Users, FileText, CreditCard, Car, ChevronRight, Building } from 'lucide-react';





interface ModuleProps {


  onNotify: (message: string) => void;


}





const quickActions = [


  { label: 'Agregar empleado', icon: Users, tone: 'text-sky-500' },


  { label: 'Pagar factura', icon: CreditCard, tone: 'text-emerald-400' },


  { label: 'Reportes', icon: FileText, tone: 'text-violet-400' },


  { label: 'Gestionar flota', icon: Car, tone: 'text-amber-400' }


];





const recentActivity = [


  { title: 'Nuevo empleado agregado', subtitle: 'Sarah Jenkins  Marketing', time: 'hace 2h' },


  { title: 'Factura pagada', subtitle: '#INV-9021  1,240.00', time: 'hace 5h' },


  { title: 'Actualización de políticas', subtitle: 'Límites de viaje ajustados para Ventas', time: 'hace 1d' }


];





const costCenters = ['Sales', 'Mkt', 'Ops', 'Eng', 'HR'];





export const CorporateAdminDashboard: React.FC<ModuleProps> = ({ onNotify }) => {


  const handleNotify = (message: string, confirmText?: string) => {


    if (confirmText && !confirm(confirmText)) return;


    if (onNotify) onNotify(message);


  };


  return (


    <section className="space-y-6">


      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">


        <div className="flex items-center gap-3">


          <div className="h-10 w-10 rounded-xl bg-sky-500/15 text-sky-500 flex items-center justify-center">


            <Building size={18} />


          </div>


          <div>


            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Corporate</p>


            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Acme Corp Fleet</h3>


            <p className="text-sm text-slate-500 dark:text-slate-400">Administrador global</p>


          </div>


        </div>


        <button


          onClick={() => handleNotify('Notificaciones corporativas (demo).')}


          className="relative p-2 rounded-full border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 text-slate-500 dark:text-slate-300"


        >


          <Bell size={16} />


          <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-sky-500" />


        </button>


      </div>





      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">


        <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-4 shadow-sm">


          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Gasto mensual</p>


          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">$12,450</p>


          <p className="text-xs text-emerald-400 font-semibold mt-1">+12.4%</p>


        </div>


        <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-4 shadow-sm">


          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Personal activo</p>


          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">842</p>


          <p className="text-xs text-rose-400 font-semibold mt-1">-2%</p>


        </div>


        <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-4 shadow-sm">


          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Facturas pendientes</p>


          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">3</p>


          <button


            onClick={() => handleNotify('Pago de factura iniciado (demo).', 'Confirmar pago')}


            className="mt-3 rounded-full bg-sky-500/15 text-sky-500 text-xs font-semibold px-3 py-1"


          >


            Pagar ahora


          </button>


        </div>


        <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-4 shadow-sm">


          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Centros de costo</p>


          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">$42,800</p>


          <p className="text-xs text-slate-400 mt-1">Asignación total</p>


        </div>


      </div>





      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">


        <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 shadow-sm">


          <div className="flex items-center justify-between">


            <div>


              <p className="text-sm font-semibold text-slate-900 dark:text-white">Gasto por centro de costo</p>


              <p className="text-xs text-slate-400">Asignación total</p>


            </div>


            <ChevronRight size={16} className="text-slate-400" />


          </div>


          <p className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">$42,800.00</p>


          <div className="mt-4 flex flex-wrap gap-2 text-[10px] uppercase text-slate-400">


            {costCenters.map((tag) => (


              <span key={tag} className="rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-1">


                {tag}


              </span>


            ))}


          </div>


          <div className="mt-4 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">


            <div className="h-full bg-sky-500" style={{ width: '70%' }} />


          </div>


        </div>





        <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 shadow-sm">


          <h4 className="text-lg font-bold text-slate-900 dark:text-white">Acciones rápidas</h4>


          <div className="mt-4 grid grid-cols-2 gap-3">


            {quickActions.map((action) => {


              const Icon = action.icon;


              return (


                <button


                  key={action.label}


                  onClick={() => handleNotify(action.label + ' listo (demo).')}


                  className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-4 shadow-sm flex flex-col items-start gap-3"


                >


                  <span className={`h-10 w-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center ${action.tone}`}>


                    <Icon size={18} />


                  </span>


                  <span className="text-sm font-semibold text-slate-900 dark:text-white">{action.label}</span>


                </button>


              );


            })}


          </div>


        </div>


      </div>





      <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 shadow-sm">


        <div className="flex items-center justify-between">


          <h4 className="text-lg font-bold text-slate-900 dark:text-white">Actividad reciente</h4>


          <button


          onClick={() => handleNotify('Actividad completa lista (demo).')}


          className="text-xs text-sky-500 font-semibold"


        >


          Ver todo


        </button>


        </div>


        <div className="mt-4 grid gap-3 md:grid-cols-2">


          {recentActivity.map((item) => (


            <div key={item.title} className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 py-3">


              <p className="font-semibold text-slate-900 dark:text-white">{item.title}</p>


              <p className="text-xs text-slate-400">{item.subtitle}</p>


              <p className="mt-2 text-[10px] text-slate-400">{item.time}</p>


            </div>


          ))}


        </div>


      </div>


    </section>


  );


};


