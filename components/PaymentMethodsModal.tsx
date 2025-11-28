


import React, { useState, useEffect } from 'react';
import { X, CreditCard, Wallet, Banknote, Plus, Trash2, Gift, Building2, Briefcase } from 'lucide-react';
import { User, PaymentMethod, Company } from '../types';
import { CompanyService } from '../src/services/companyService';

interface PaymentMethodsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onSelectMethod: (method: PaymentMethod, cardId?: string) => void;
}

export const PaymentMethodsModal: React.FC<PaymentMethodsModalProps> = ({ isOpen, onClose, user, onSelectMethod }) => {
  const [promoCode, setPromoCode] = useState('');
  const [userCompany, setUserCompany] = useState<Company | null>(null);

  useEffect(() => {
     const fetchCompany = async () => {
        if (user.companyId) {
           const comp = await CompanyService.getCompanyById(user.companyId);
           setUserCompany(comp);
        }
     };
     fetchCompany();
  }, [user]);

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center p-4 animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-t-3xl md:rounded-3xl shadow-2xl overflow-hidden animate-slide-up flex flex-col max-h-[90vh]">
        
        {/* Header Updated to Black */}
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-black text-white flex-shrink-0">
          <h2 className="text-xl font-bold flex items-center gap-2">
             <Wallet className="text-white" /> Métodos de Pago
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition">
            <X size={24} className="text-white" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto flex-grow bg-white">
          
          {/* CORPORATE OPTION (If User has companyId) */}
          {userCompany && (
             <button 
               onClick={() => { onSelectMethod(PaymentMethod.CORPORATE); onClose(); }}
               className="w-full flex items-center justify-between p-4 rounded-2xl border-2 border-black hover:bg-gray-50 transition group shadow-md"
             >
               <div className="flex items-center gap-4">
                  <div className="p-3 bg-black text-white rounded-xl">
                     <Briefcase size={24} />
                  </div>
                  <div className="text-left">
                     <h3 className="font-bold text-gray-900">Crédito Corporativo</h3>
                     <p className="text-xs text-gray-500 font-bold">{userCompany.name}</p>
                     <p className="text-[10px] text-green-600 font-bold mt-1">Saldo Disp: ${(userCompany.creditLimit - userCompany.usedCredit).toFixed(2)}</p>
                  </div>
               </div>
               <div className="w-5 h-5 rounded-full border-2 border-gray-300 group-hover:border-black group-hover:bg-black"></div>
             </button>
          )}

          {/* Cash Option */}
          <button 
            onClick={() => { onSelectMethod(PaymentMethod.CASH); onClose(); }}
            className="w-full flex items-center justify-between p-4 rounded-2xl border border-gray-200 hover:border-green-500 hover:bg-green-50 transition group"
          >
            <div className="flex items-center gap-4">
               <div className="p-3 bg-green-100 text-green-600 rounded-xl">
                  <Banknote size={24} />
               </div>
               <div className="text-left">
                  <h3 className="font-bold text-gray-900">Efectivo</h3>
                  <p className="text-xs text-gray-500">Pago directo al conductor</p>
               </div>
            </div>
            <div className="w-5 h-5 rounded-full border-2 border-gray-300 group-hover:border-green-500 group-hover:bg-green-500"></div>
          </button>

          {/* Transfer Option */}
          <button 
            onClick={() => { onSelectMethod(PaymentMethod.TRANSFER); onClose(); }}
            className="w-full flex items-center justify-between p-4 rounded-2xl border border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition group"
          >
            <div className="flex items-center gap-4">
               <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
                  <Building2 size={24} />
               </div>
               <div className="text-left">
                  <h3 className="font-bold text-gray-900">Transferencia Bancaria</h3>
                  <p className="text-xs text-gray-500">Sube el comprobante al chat</p>
               </div>
            </div>
            <div className="w-5 h-5 rounded-full border-2 border-gray-300 group-hover:border-purple-500 group-hover:bg-purple-500"></div>
          </button>

          {/* Cards */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Mis Tarjetas</h3>
            {user.paymentMethods?.map((card) => (
              <div key={card.id} className="flex items-center gap-2">
                 <button 
                   onClick={() => { onSelectMethod(PaymentMethod.CARD, card.id); onClose(); }}
                   className="flex-grow flex items-center justify-between p-4 rounded-2xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition group"
                 >
                    <div className="flex items-center gap-4">
                       <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                          <CreditCard size={24} />
                       </div>
                       <div className="text-left">
                          <h3 className="font-bold text-gray-900 capitalize">{card.brand} •••• {card.last4}</h3>
                          <p className="text-xs text-gray-500">Expira: {card.expiry}</p>
                       </div>
                    </div>
                 </button>
                 <button className="p-4 text-red-400 hover:bg-red-50 rounded-xl transition">
                    <Trash2 size={20} />
                 </button>
              </div>
            ))}
            
            <button className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 font-bold text-sm flex items-center justify-center gap-2 hover:border-gray-400 hover:text-gray-600 transition">
               <Plus size={18} /> Agregar Nueva Tarjeta
            </button>
          </div>

          {/* Coupons */}
          <div className="pt-4 border-t border-gray-100">
             <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Cupones y Promos</h3>
             <div className="flex gap-2">
                <div className="relative flex-grow">
                   <Gift className="absolute left-3 top-3 text-gray-400" size={18} />
                   <input 
                     type="text" 
                     placeholder="Código promocional" 
                     className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm font-bold focus:outline-none focus:border-black uppercase"
                     value={promoCode}
                     onChange={(e) => setPromoCode(e.target.value)}
                   />
                </div>
                <button className="bg-black text-white px-4 py-2 rounded-xl font-bold text-sm">Aplicar</button>
             </div>
          </div>
        </div>

        {/* Footer Close Button */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex-shrink-0">
           <button 
             onClick={onClose}
             className="w-full bg-white border border-gray-200 text-gray-900 font-bold py-3 rounded-xl hover:bg-gray-100 transition shadow-sm"
           >
             Cerrar
           </button>
        </div>

      </div>
    </div>
  );
};
