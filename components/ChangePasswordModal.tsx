
import React, { useState } from 'react';
import { X, Lock, CheckCircle2, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import * as SecurityService from '../services/securityService';
import { AuthService } from '../src/services/authService';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    const strength = SecurityService.validatePasswordStrength(newPassword);
    if (!strength.valid) {
      setError(strength.message || "Contraseña insegura.");
      return;
    }

    setIsLoading(true);
    try {
      await AuthService.updateUserPassword(newPassword);
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
        setSuccess(false);
        setNewPassword('');
        setConfirmPassword('');
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Error al actualizar la contraseña.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="absolute inset-0 z-[80] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-slide-up">
        
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-black text-white">
          <h2 className="text-xl font-bold flex items-center gap-2">
             <Lock size={20} /> Cambiar Contraseña
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {success ? (
            <div className="text-center py-8">
               <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={32} />
               </div>
               <h3 className="text-xl font-bold text-gray-800">¡Contraseña Actualizada!</h3>
               <p className="text-gray-500 text-sm mt-2">Tu seguridad ha sido mejorada.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium flex items-center gap-2">
                  <AlertTriangle size={16} /> {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nueva Contraseña</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-4 pr-10 focus:outline-none focus:border-black transition"
                    placeholder="Mínimo 8 caracteres"
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Confirmar Contraseña</label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:outline-none focus:border-black transition"
                  placeholder="Repite la contraseña"
                  required
                />
              </div>

              <div className="pt-2">
                 <button 
                   type="submit" 
                   disabled={isLoading}
                   className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition disabled:opacity-50 flex justify-center items-center gap-2"
                 >
                   {isLoading ? 'Actualizando...' : 'Guardar Nueva Contraseña'}
                 </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
