
/**
 * Security Service for Client-Side Protection
 * Includes: SHA-256 Hashing, Input Sanitization, Data Masking, and ID Validation
 */

// --- 1. CRYPTOGRAPHY ---

export const hashPassword = async (plainText: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(plainText);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
};

// --- 2. VALIDATION (ECUADOR SPECIFIC) ---

export const validateEcuadorianCedula = (cedula: string): boolean => {
  if (!cedula || cedula.length !== 10) return false;
  
  // Check region code (first 2 digits, must be between 01 and 24 or 30)
  const region = parseInt(cedula.substring(0, 2));
  if (region < 1 || region > 24) {
     if (region !== 30) return false; 
  }

  // Third digit must be < 6 for individuals
  const thirdDigit = parseInt(cedula.substring(2, 3));
  if (thirdDigit >= 6) return false;

  // Module 10 Algorithm
  const coefs = [2, 1, 2, 1, 2, 1, 2, 1, 2];
  const verifier = parseInt(cedula.substring(9, 10));
  let total = 0;

  for (let i = 0; i < 9; i++) {
    const digit = parseInt(cedula.substring(i, i + 1));
    let product = digit * coefs[i];
    if (product >= 10) product -= 9;
    total += product;
  }

  const mod = total % 10;
  const result = mod === 0 ? 0 : 10 - mod;

  return result === verifier;
};

export const validatePasswordStrength = (password: string): { valid: boolean; message?: string } => {
  if (password.length < 8) return { valid: false, message: "Mínimo 8 caracteres" };
  if (!/[A-Z]/.test(password)) return { valid: false, message: "Requiere una mayúscula" };
  if (!/[0-9]/.test(password)) return { valid: false, message: "Requiere un número" };
  return { valid: true };
};

// --- 3. DATA MASKING ---

export const maskEmail = (email: string): string => {
  const [user, domain] = email.split('@');
  if (user.length <= 2) return email;
  return `${user.substring(0, 2)}****@${domain}`;
};

export const maskPhone = (phone: string): string => {
  if (!phone || phone.length < 6) return phone;
  return `${phone.substring(0, 3)}****${phone.substring(phone.length - 3)}`;
};

export const maskCreditCard = (last4: string): string => {
  return `•••• •••• •••• ${last4}`;
};

// --- 4. SANITIZATION ---

export const sanitizeInput = (input: string): string => {
  // Basic prevention of script tags and HTML injection
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};
