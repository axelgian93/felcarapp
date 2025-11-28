


import React, { useState } from 'react';
import { X, HelpCircle, AlertTriangle, PackageX, ChevronRight, MessageSquare, Phone, ChevronDown, Send, Camera, Paperclip, CheckCircle2 } from 'lucide-react';
import { User } from '../types';
import { SupportService } from '../src/services/supportService';
import { ImageService } from '../src/services/imageService';

interface HelpCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: User; // Pass user for creating ticket
}

export const HelpCenterModal: React.FC<HelpCenterModalProps> = ({ isOpen, onClose, user }) => {
  const [activeTab, setActiveTab] = useState<'FAQ' | 'CREATE_TICKET'>('FAQ');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // Ticket Form
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'LOW'|'MEDIUM'|'HIGH'>('MEDIUM');
  const [attachments, setAttachments] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const faqs = [
    { q: "¿Cómo cancelo un viaje?", a: "Puedes cancelar tu viaje pulsando el botón 'Cancelar' en la pantalla de espera." },
    { q: "Tarifas y recargos", a: "Nuestras tarifas se calculan basándose en la distancia y el tiempo estimado." },
    { q: "Seguridad", a: "Todos nuestros viajes son monitoreados por GPS. Usa el botón SOS en emergencia." },
    { q: "Problemas con tarjeta", a: "Asegúrate de que tu tarjeta tenga fondos suficientes." }
  ];

  const toggleFaq = (index: number) => setExpandedIndex(expandedIndex === index ? null : index);

  const handleAddPhoto = async () => {
     const photo = await ImageService.takePhoto();
     if (photo) {
        setAttachments([...attachments, photo]);
     }
  };

  const handleSubmitTicket = async () => {
     if (!user || !subject || !description) return;
     setIsSubmitting(true);
     try {
        const ticketNum = await SupportService.createTicket(user, subject, description, priority, attachments);
        setSuccessMsg(`Ticket creado: ${ticketNum}`);
        // Reset form
        setSubject('');
        setDescription('');
        setAttachments([]);
        setTimeout(() => {
           setSuccessMsg(null);
           onClose();
        }, 2000);
     } catch (e) {
        alert("Error al crear el ticket");
     } finally {
        setIsSubmitting(false);
     }
  };

  return (
    <div className="absolute inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center p-4 animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-t-3xl md:rounded-3xl shadow-2xl overflow-hidden animate-slide-up h-[85vh] flex flex-col">
        
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-black text-white">
          <h2 className="text-xl font-bold flex items-center gap-2">
             <HelpCircle size={24} /> Centro de Ayuda
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition">
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
           <button onClick={() => setActiveTab('FAQ')} className={`flex-1 py-4 text-sm font-bold border-b-2 transition ${activeTab === 'FAQ' ? 'border-black text-black' : 'border-transparent text-gray-400'}`}>Preguntas</button>
           <button onClick={() => setActiveTab('CREATE_TICKET')} className={`flex-1 py-4 text-sm font-bold border-b-2 transition ${activeTab === 'CREATE_TICKET' ? 'border-black text-black' : 'border-transparent text-gray-400'}`}>Nuevo Ticket</button>
        </div>

        <div className="flex-grow overflow-y-auto p-6 bg-gray-50">
           {activeTab === 'FAQ' && (
              <>
                <h3 className="text-sm font-bold text-gray-900 mb-4">Temas Comunes</h3>
                <div className="space-y-2">
                    {faqs.map((item, i) => (
                        <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                        <button onClick={() => toggleFaq(i)} className="w-full p-4 flex justify-between items-center hover:bg-gray-50 text-left">
                            <span className="text-sm font-bold text-gray-700">{item.q}</span>
                            {expandedIndex === i ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </button>
                        {expandedIndex === i && <div className="px-4 pb-4 text-xs text-gray-500 bg-gray-50/50">{item.a}</div>}
                        </div>
                    ))}
                </div>
                <button onClick={() => setActiveTab('CREATE_TICKET')} className="w-full mt-6 bg-black text-white py-3 rounded-xl font-bold shadow-lg">Contactar Soporte</button>
              </>
           )}

           {activeTab === 'CREATE_TICKET' && (
              <div className="space-y-4 animate-fade-in">
                 {successMsg ? (
                    <div className="flex flex-col items-center justify-center h-64 text-center">
                       <CheckCircle2 size={48} className="text-green-500 mb-4" />
                       <h3 className="text-xl font-bold text-gray-900">¡Enviado!</h3>
                       <p className="text-gray-500">{successMsg}</p>
                    </div>
                 ) : (
                    <>
                       <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-4">
                          <p className="text-xs text-blue-700 font-medium">Cuéntanos tu problema. Te responderemos en menos de 24 horas.</p>
                       </div>

                       <div>
                          <label className="text-xs font-bold text-gray-500 uppercase">Asunto</label>
                          <input type="text" className="w-full mt-1 p-3 bg-white border border-gray-200 rounded-xl font-bold text-sm" placeholder="Ej: Objeto perdido" value={subject} onChange={e=>setSubject(e.target.value)} />
                       </div>

                       <div>
                          <label className="text-xs font-bold text-gray-500 uppercase">Descripción</label>
                          <textarea className="w-full mt-1 p-3 bg-white border border-gray-200 rounded-xl text-sm h-32 resize-none" placeholder="Detalla lo sucedido..." value={description} onChange={e=>setDescription(e.target.value)}></textarea>
                       </div>

                       <div>
                          <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Evidencias (Fotos)</label>
                          <div className="flex gap-2 overflow-x-auto pb-2">
                             <button onClick={handleAddPhoto} className="w-20 h-20 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-black hover:text-black transition shrink-0">
                                <Camera size={20} />
                                <span className="text-[10px] font-bold mt-1">Agregar</span>
                             </button>
                             {attachments.map((src, idx) => (
                                <div key={idx} className="w-20 h-20 bg-gray-200 rounded-xl overflow-hidden shrink-0 relative">
                                   <img src={src} className="w-full h-full object-cover" />
                                   <button onClick={() => setAttachments(attachments.filter((_, i) => i !== idx))} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5"><X size={12}/></button>
                                </div>
                             ))}
                          </div>
                       </div>

                       <div>
                           <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Prioridad</label>
                           <div className="flex bg-gray-100 p-1 rounded-xl">
                              {(['LOW', 'MEDIUM', 'HIGH'] as const).map(p => (
                                 <button key={p} onClick={() => setPriority(p)} className={`flex-1 py-2 rounded-lg text-xs font-bold transition ${priority === p ? 'bg-white shadow text-black' : 'text-gray-500'}`}>
                                    {p === 'LOW' ? 'Baja' : p === 'MEDIUM' ? 'Media' : 'Alta'}
                                 </button>
                              ))}
                           </div>
                       </div>

                       <button 
                         onClick={handleSubmitTicket}
                         disabled={!subject || !description || isSubmitting}
                         className="w-full bg-black text-white py-4 rounded-xl font-bold shadow-xl hover:bg-gray-800 transition disabled:opacity-50 flex items-center justify-center gap-2"
                       >
                         {isSubmitting ? 'Enviando...' : <><Send size={18}/> Enviar Ticket</>}
                       </button>
                    </>
                 )}
              </div>
           )}
        </div>
      </div>
    </div>
  );
};
