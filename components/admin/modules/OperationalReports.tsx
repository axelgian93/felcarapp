import React from 'react';


import { Calendar, TrendingDown, TrendingUp, BarChart3 } from 'lucide-react';





const stats = [


  { label: 'Conductores activos', value: '42', delta: '5%', trend: 'up' },


  { label: 'Finalización', value: '94.2%', delta: '-2%', trend: 'down' },


  { label: 'Ingreso por vehículo', value: '128.50', delta: '+12% vs semana pasada', trend: 'up' },


  { label: 'Viajes totales (24h)', value: '1,240', delta: '+8%', trend: 'up' }


];





const hourly = [


  { label: '00h', value: 20 },


  { label: '04h', value: 50 },


  { label: '08h', value: 90 },


  { label: '12h', value: 55 },


  { label: '16h', value: 75 },


  { label: '20h', value: 30 }


];





const b2bClients = [


  { name: 'Acme Global Tech', value: '12,450', trips: '850 viajes', color: 'bg-sky-500' },


  { name: 'Starlight Logistics', value: '8,920', trips: '420 viajes', color: 'bg-violet-500' },


  { name: 'Nova Retail', value: '5,110', trips: '260 viajes', color: 'bg-emerald-400' }


];





const financialRows = [


  { label: 'Ingresos brutos', value: '45,200.00', tone: 'text-slate-700 dark:text-slate-100' },


  { label: 'Comisiones del sistema (15%)', value: '-6,780.00', tone: 'text-rose-400' },


  { label: 'Bono B2B', value: '+1,240.00', tone: 'text-emerald-400' },


  { label: 'Ingreso neto de flota', value: '39,660.00', tone: 'text-sky-500' }


];





interface OperationalReportsProps {


  onNotify: (message: string) => void;


}





export const OperationalReports: React.FC<OperationalReportsProps> = ({ onNotify }) => {


  const handleExport = () => {


    if (onNotify) {


      onNotify('Reporte exportado (mock).');


    }


  };


  return (


    <section className="space-y-6">


      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">


        <div>


          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Operaciones</p>


          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Reportes operativos</h3>


          <p className="text-sm text-slate-500 dark:text-slate-400">


            Visión diaria de demanda, flota y rentabilidad.


          </p>


        </div>


        <div className="flex items-center gap-2">


          <button className="flex items-center gap-2 rounded-full border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 px-4 py-2 text-xs font-semibold text-slate-500 dark:text-slate-300">


            <Calendar size={14} />


            Últimos 7 días


          </button>


          <button


            onClick={handleExport}


            className="flex items-center gap-2 rounded-full bg-slate-900 dark:bg-sky-500 text-white px-4 py-2 text-xs font-semibold"


          >


            Exportar


          </button>


        </div>


      </div>





      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">


        {stats.map((stat) => (


          <div


            key={stat.label}


            className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-4 shadow-sm"


          >


            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">{stat.label}</p>


            <div className="mt-2 flex items-end justify-between">


              <span className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</span>


              <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">


                {stat.trend === 'up' ? (


                  <TrendingUp size={12} className="text-emerald-400" />


                ) : (


                  <TrendingDown size={12} className="text-rose-400" />


                )}


                {stat.delta}


              </span>


            </div>


          </div>


        ))}


      </div>





      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">


        <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 shadow-sm">


          <div className="flex items-center justify-between">


            <div>


              <h4 className="text-lg font-bold text-slate-900 dark:text-white">Picos de demanda por hora</h4>


              <p className="text-xs text-slate-400">Distribución de demanda (24h)</p>


            </div>


            <span className="text-xs font-semibold text-sky-500">Ver en vivo</span>


          </div>


          <div className="mt-4 flex items-center gap-2 text-slate-500 dark:text-slate-400">


            <BarChart3 size={16} className="text-sky-500" />


            <span className="text-sm font-semibold text-slate-900 dark:text-white">1,240</span>


            <span className="text-xs">Viajes totales</span>


          </div>


          <div className="mt-5 grid grid-cols-6 items-end gap-3 text-[10px] text-slate-400">


            {hourly.map((bar) => (


              <div key={bar.label} className="flex flex-col items-center gap-2">


                <div


                  className="w-full rounded-t-md bg-sky-500/30 dark:bg-sky-500/40"


                  style={{ height: `${bar.value}%` }}


                />


                <span>{bar.label}</span>


              </div>


            ))}


          </div>


        </div>





        <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 shadow-sm">


          <div className="flex items-center justify-between">


            <h4 className="text-lg font-bold text-slate-900 dark:text-white">Gasto por cliente B2B</h4>


            <button className="text-xs text-slate-400">...</button>


          </div>


          <div className="mt-4 space-y-3">


            {b2bClients.map((client) => (


              <div key={client.name} className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-4">


                <div className="flex items-center justify-between">


                  <div className="flex items-center gap-3">


                    <span className={`h-9 w-9 rounded-xl ${client.color} bg-opacity-80`} />


                    <div>


                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{client.name}</p>


                      <p className="text-xs text-slate-400">{client.trips} este mes</p>


                    </div>


                  </div>


                  <span className="text-sm font-bold text-slate-900 dark:text-white">{client.value}</span>


                </div>


                <div className="mt-3 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">


                  <div className={`h-full ${client.color}`} style={{ width: '72%' }} />


                </div>


              </div>


            ))}


          </div>


        </div>


      </div>





      <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 shadow-sm">


        <h4 className="text-lg font-bold text-slate-900 dark:text-white">Desempeno financiero</h4>


        <div className="mt-4 grid gap-3 md:grid-cols-2">


          {financialRows.map((row) => (


            <div key={row.label} className="flex items-center justify-between rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 py-3">


              <span className="text-sm text-slate-500 dark:text-slate-400">{row.label}</span>


              <span className={`font-semibold ${row.tone}`}>{row.value}</span>


            </div>


          ))}


        </div>


      </div>


    </section>


  );


};


