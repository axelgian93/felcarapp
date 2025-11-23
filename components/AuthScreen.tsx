
import React, { useState } from 'react';
import { Mail, Lock, User as UserIcon, ArrowRight, Car, ShieldAlert, CreditCard, Calendar, Palette, ShieldCheck } from 'lucide-react';
import { User, UserRole, CarType } from '../types';
import * as SecurityService from '../services/securityService';

interface AuthScreenProps {
  onLogin: (email: string, password: string) => void;
  onRegister: (user: Omit<User, 'id' | 'status'>, password: string) => void;
  error?: string | null;
  onClearError?: () => void;
}

// Common car colors for quick selection
const CAR_COLORS = [
  { name: 'Blanco', hex: '#FFFFFF', border: true },
  { name: 'Negro', hex: '#1F2937', border: false },
  { name: 'Plata', hex: '#9CA3AF', border: false },
  { name: 'Rojo', hex: '#DC2626', border: false },
  { name: 'Azul', hex: '#2563EB', border: false },
  { name: 'Amarillo', hex: '#FBBF24', border: false },
];

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin, onRegister, error, onClearError }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.RIDER);
  const [localError, setLocalError] = useState<string | null>(null);
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [cedula, setCedula] = useState('');
  const [phone, setPhone] = useState('');
  
  // Driver specific
  const [carModel, setCarModel] = useState('');
  const [carYear, setCarYear] = useState('');
  const [plate, setPlate] = useState('');
  // Insurance state removed
  const [carColor, setCarColor] = useState('#FFFFFF');
  const [carType, setCarType] = useState<CarType>(CarType.SEDAN);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    
    // Sanitization
    const cleanEmail = SecurityService.sanitizeInput(email).toLowerCase();
    const cleanName = SecurityService.sanitizeInput(name);
    
    if (isRegistering) {
      // 1. Validate Cedula
      if (!SecurityService.validateEcuadorianCedula(cedula)) {
        setLocalError("La Cédula ingresada no es válida en Ecuador.");
        return;
      }

      // 2. Validate Password Strength
      const passCheck = SecurityService.validatePasswordStrength(password);
      if (!passCheck.valid) {
        setLocalError(`Contraseña insegura: ${passCheck.message}`);
        return;
      }

      const newUser: Omit<User, 'id' | 'status'> = {
        email: cleanEmail,
        name: cleanName,
        role: selectedRole,
        cedula,
        phone: SecurityService.sanitizeInput(phone),
        photoUrl: `https://ui-avatars.com/api/?name=${cleanName}&background=random`,
        driverDetails: selectedRole === UserRole.DRIVER ? {
          carModel: SecurityService.sanitizeInput(carModel),
          carYear: SecurityService.sanitizeInput(carYear),
          plate: SecurityService.sanitizeInput(plate).toUpperCase(),
          carColor,
          carType,
          licenseNumber: cedula, 
          insurancePolicy: 'N/A' // Default value since field is removed
        } : undefined
      };
      onRegister(newUser, password);
    } else {
      onLogin(cleanEmail, password);
    }
  };

  return (
    <div className="absolute inset-0 bg-black z-50 flex flex-col items-center justify-center p-6 text-white overflow-y-auto">
      <div className="w-full max-w-md space-y-6 my-auto">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-8 tracking-tighter flex items-center justify-center gap-2">
            <ShieldCheck className="text-blue-500" size={36} /> FelcarRide
          </h1>
          {isRegistering && (
             <p className="text-gray-400 mb-2 font-medium">Registro de Usuario</p>
          )}
        </div>

        <div className="bg-gray-900 p-8 rounded-3xl shadow-2xl border border-gray-800">
          
          {/* Role Selector for Registration */}
          {isRegistering && (
            <div className="flex bg-gray-800 p-1 rounded-xl mb-6">
              <button 
                type="button"
                onClick={() => setSelectedRole(UserRole.RIDER)}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition flex items-center justify-center gap-2 ${selectedRole === UserRole.RIDER ? 'bg-white text-black shadow-md' : 'text-gray-400 hover:text-gray-200'}`}
              >
                <UserIcon size={16} /> Pasajero
              </button>
              <button 
                type="button"
                onClick={() => setSelectedRole(UserRole.DRIVER)}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition flex items-center justify-center gap-2 ${selectedRole === UserRole.DRIVER ? 'bg-white text-black shadow-md' : 'text-gray-400 hover:text-gray-200'}`}
              >
                <Car size={16} /> Conductor
              </button>
            </div>
          )}

          {(error || localError) && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl mb-4 text-sm flex items-center gap-2 animate-pulse">
              <ShieldAlert size={16} />
              {error || localError}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegistering && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-3.5 text-gray-500" size={20} />
                    <input
                      type="text"
                      placeholder="Nombre y Apellido"
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-white transition text-sm"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="relative">
                    <CreditCard className="absolute left-4 top-3.5 text-gray-500" size={20} />
                    <input
                      type="text"
                      placeholder="Cédula (10 dígitos)"
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-white transition text-sm"
                      value={cedula}
                      onChange={(e) => {
                         const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                         setCedula(val);
                      }}
                      required
                    />
                  </div>
                </div>

                <div className="relative">
                    <input
                      type="tel"
                      placeholder="Teléfono Móvil"
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl py-3 px-4 focus:outline-none focus:border-white transition text-sm"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                </div>

                {selectedRole === UserRole.DRIVER && (
                  <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 space-y-3 animate-fade-in">
                     <p className="text-xs text-gray-400 font-bold uppercase mb-2">Datos del Vehículo</p>
                     
                     {/* Tipo de Carro */}
                     <div className="flex gap-2 mb-2">
                       <button type="button" onClick={() => setCarType(CarType.SEDAN)} className={`flex-1 py-2 rounded border text-xs font-bold ${carType === CarType.SEDAN ? 'bg-white text-black border-white' : 'bg-transparent border-gray-600 text-gray-400'}`}>Sedan / Hatch</button>
                       <button type="button" onClick={() => setCarType(CarType.SUV)} className={`flex-1 py-2 rounded border text-xs font-bold ${carType === CarType.SUV ? 'bg-white text-black border-white' : 'bg-transparent border-gray-600 text-gray-400'}`}>SUV / 4x4</button>
                     </div>

                     <div className="grid grid-cols-2 gap-3">
                        <div className="relative col-span-2">
                           <Car className="absolute left-3 top-3 text-gray-500" size={18} />
                           <input
                             type="text"
                             placeholder="Modelo (Ej: Kia Rio)"
                             className="w-full bg-gray-800 border border-gray-700 rounded-xl py-3 pl-10 px-4 focus:outline-none focus:border-white transition text-sm"
                             value={carModel}
                             onChange={(e) => setCarModel(e.target.value)}
                             required
                           />
                        </div>
                        <div className="relative">
                           <Calendar className="absolute left-3 top-3 text-gray-500" size={18} />
                           <input
                             type="number"
                             placeholder="Año"
                             min="1990"
                             max={new Date().getFullYear() + 1}
                             className="w-full bg-gray-800 border border-gray-700 rounded-xl py-3 pl-10 px-4 focus:outline-none focus:border-white transition text-sm"
                             value={carYear}
                             onChange={(e) => setCarYear(e.target.value)}
                             required
                           />
                        </div>
                        <input
                          type="text"
                          placeholder="Placa (GBA-1234)"
                          className="w-full bg-gray-800 border border-gray-700 rounded-xl py-3 px-4 focus:outline-none focus:border-white transition text-sm uppercase"
                          value={plate}
                          onChange={(e) => setPlate(e.target.value)}
                          required
                        />
                     </div>

                     {/* Color Selector */}
                     <div>
                       <label className="text-[10px] text-gray-400 font-bold uppercase mb-1 block">Color del Vehículo</label>
                       <div className="flex gap-2 justify-between">
                         {CAR_COLORS.map((c) => (
                           <button
                             key={c.name}
                             type="button"
                             onClick={() => setCarColor(c.hex)}
                             className={`w-8 h-8 rounded-full transition-transform ${c.border ? 'border border-gray-400' : ''} ${carColor === c.hex ? 'ring-2 ring-white scale-110' : 'opacity-70 hover:opacity-100'}`}
                             style={{ backgroundColor: c.hex }}
                             title={c.name}
                           />
                         ))}
                         <div className="relative w-8 h-8 overflow-hidden rounded-full bg-gradient-to-br from-red-500 via-green-500 to-blue-500">
                            <input 
                              type="color" 
                              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                              value={carColor}
                              onChange={(e) => setCarColor(e.target.value)}
                            />
                         </div>
                       </div>
                     </div>
                  </div>
                )}
              </>
            )}
            
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 text-gray-500" size={20} />
              <input
                type="email"
                placeholder="Correo electrónico"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-white transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-3.5 text-gray-500" size={20} />
              <input
                type="password"
                placeholder="Contraseña"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-white transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            {isRegistering && (
               <p className="text-[10px] text-gray-500 px-2">
                  La contraseña debe tener 8+ caracteres, una mayúscula y un número.
               </p>
            )}

            <button
              type="submit"
              className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition flex items-center justify-center gap-2 mt-4"
            >
              {isRegistering ? 'Validar y Registrar' : 'Ingresar'} <ArrowRight size={20} />
            </button>
          </form>

          <div className="mt-6 text-center">
             <p className="text-xs text-gray-500 mb-4">
               {isRegistering 
                 ? "Tus datos serán encriptados y validados por el admin."
                 : "Acceso Seguro"}
             </p>
             <div className="h-px bg-gray-800 w-full mb-4"></div>
            <button 
              onClick={() => { setIsRegistering(!isRegistering); if (onClearError) onClearError(); setLocalError(null); }}
              className="text-blue-400 hover:text-blue-300 text-sm font-medium"
            >
              {isRegistering ? '¿Ya tienes cuenta aprobada? Inicia sesión' : '¿Nuevo usuario? Regístrate aquí'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
