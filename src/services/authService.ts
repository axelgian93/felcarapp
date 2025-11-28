
import { auth, db } from "../firebaseConfig";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  deleteUser,
  updatePassword,
  User as FirebaseUser 
} from "firebase/auth";
import { 
  doc, 
  setDoc, 
  getDoc, 
  Timestamp,
  collection,
  query,
  where,
  getDocs
} from "firebase/firestore";
import { User, UserRole, AccountStatus } from "../../types";
// Import mock data to seed DB if profile missing
import { INITIAL_USERS, INITIAL_COOPERATIVES } from "../mockData";

// Helper to remove undefined fields recursively to prevent Firestore errors
const cleanFirestoreData = (obj: any): any => {
  if (obj === undefined) return undefined;
  if (obj === null) return null;
  
  if (typeof obj === 'object' && typeof obj.toMillis === 'function') {
      return obj;
  }
  
  if (obj instanceof Date) return obj;
  
  if (Array.isArray(obj)) {
    return obj.map(v => cleanFirestoreData(v)).filter(v => v !== undefined);
  }
  
  if (typeof obj === 'object') {
    const newObj: any = {};
    Object.keys(obj).forEach(key => {
      const val = cleanFirestoreData(obj[key]);
      if (val !== undefined) {
        newObj[key] = val;
      }
    });
    return newObj;
  }
  
  return obj;
};

// Map Firestore data to our App User type
const mapDocToUser = (id: string, data: any): User => {
  return {
    id: id,
    email: data.email,
    name: data.name,
    role: data.role as UserRole,
    status: data.status as AccountStatus,
    cooperativeId: data.cooperativeId, // MULTI-TENANT MAPPING
    photoUrl: data.photoUrl,
    phone: data.phone,
    cedula: data.cedula,
    rating: data.rating,
    driverDetails: data.driverDetails,
    savedPlaces: data.savedPlaces,
    paymentMethods: data.paymentMethods,
    createdAt: data.createdAt?.toMillis ? data.createdAt.toMillis() : Date.now(),
    companyId: data.companyId
  };
};

export const AuthService = {
  
  createProfileFromFallback: async (fbUser: FirebaseUser): Promise<User> => {
    console.warn(`Creating missing profile for ${fbUser.email}...`);
    
    // Check if this email matches a mock user to seed with rich data
    const mockMatch = INITIAL_USERS.find(u => u.email.toLowerCase() === fbUser.email?.toLowerCase());

    let newProfile: any;

    if (mockMatch) {
        // Exclude 'id' and 'password' from the spread
        const { id, password, ...rest } = mockMatch;
        newProfile = {
            ...rest,
            createdAt: Timestamp.now()
        };
    } else {
        newProfile = {
            email: fbUser.email || '',
            name: fbUser.displayName || 'Usuario Sin Nombre',
            role: UserRole.RIDER,
            status: AccountStatus.ACTIVE,
            cooperativeId: 'coop-global', // Default to global if healing
            createdAt: Timestamp.now(),
            photoUrl: fbUser.photoURL || `https://ui-avatars.com/api/?name=${fbUser.email}&background=random`,
            phone: '',
            rating: 5.0
        };
    }

    const cleanProfile = cleanFirestoreData(newProfile);
    await setDoc(doc(db, "users", fbUser.uid), cleanProfile);
    return mapDocToUser(fbUser.uid, cleanProfile);
  },

  login: async (email: string, pass: string): Promise<User> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, pass);
      const fbUser = userCredential.user;

      const userDocRef = doc(db, "users", fbUser.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        return mapDocToUser(fbUser.uid, userDoc.data());
      } else {
        return await AuthService.createProfileFromFallback(fbUser);
      }
    } catch (error: any) {
      // AUTO-SEEDING FOR MOCK USERS
      const mockUser = INITIAL_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (mockUser && mockUser.password === pass) {
         if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
            console.log(`Auto-seeding demo user: ${email}`);
            try {
               const { id, password, ...profileData } = mockUser;
               // Bypass code check for mock seeding
               return await AuthService.register(profileData, pass, ''); 
            } catch (regError: any) {
               console.error("Auto-seed failed:", regError);
               // Pass through existing user error
               if (regError.message && regError.message.includes("ya está registrado")) {
                  throw mapAuthError(error); 
               }
               // Warn about weak passwords in console if that's the cause
               if (regError.code === 'auth/weak-password') {
                  console.error("CRITICAL: Mock user password is too weak for Firebase (needs 6+ chars). Update src/mockData.ts");
               }
            }
         }
      }

      console.error("Login Error:", error);
      throw mapAuthError(error);
    }
  },

  register: async (userData: Omit<User, 'id' | 'status'>, pass: string, coopCode: string): Promise<User> => {
    let fbUser: FirebaseUser | null = null;
    
    // Default to 'coop-global' if not provided
    // Preserve existing cooperativeId if passed (e.g. from Mock Data seeding)
    let assignedCooperativeId: string = userData.cooperativeId || 'coop-global'; 

    // Validate Cooperative Code (QR Simulation) if provided
    if (userData.role === UserRole.RIDER || userData.role === UserRole.ADMIN) {
       if (coopCode && coopCode.trim() !== '') {
           const coopMatch = INITIAL_COOPERATIVES.find(c => c.code.toUpperCase() === coopCode.toUpperCase());
           if (coopMatch) {
              assignedCooperativeId = coopMatch.id;
           } else {
              throw new Error("Código de Cooperativa inválido. Déjelo vacío para usar el servicio Global.");
           }
       } 
       // If coopCode is empty, we keep 'coop-global' (or whatever was in userData)
    }
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, pass);
      fbUser = userCredential.user;

      const newUserId = fbUser.uid;
      const newUserProfile = {
        ...userData,
        status: AccountStatus.PENDING,
        cooperativeId: assignedCooperativeId, // Bind user to tenant or global
        createdAt: Timestamp.now(),
        rating: 5.0,
        totalTrips: 0
      };

      const cleanProfile = cleanFirestoreData(newUserProfile);
      await setDoc(doc(db, "users", newUserId), cleanProfile);

      return {
        id: newUserId,
        status: AccountStatus.PENDING,
        cooperativeId: assignedCooperativeId,
        ...userData
      };
    } catch (error: any) {
      console.error("Register Error:", error);
      if (fbUser) {
         try {
           await deleteUser(fbUser);
         } catch (deleteErr) {
           console.error("Failed to rollback user creation", deleteErr);
         }
      }
      throw mapAuthError(error);
    }
  },

  logout: async () => {
    await signOut(auth);
  },

  getUserProfile: async (uid: string, fallbackUser?: FirebaseUser): Promise<User | null> => {
    try {
      const userDocRef = doc(db, "users", uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        return mapDocToUser(uid, userDoc.data());
      } else if (fallbackUser) {
         return await AuthService.createProfileFromFallback(fallbackUser);
      }
      return null;
    } catch (e) {
      console.error("Error fetching user profile:", e);
      if (fallbackUser) {
        try {
           return await AuthService.createProfileFromFallback(fallbackUser);
        } catch (recoveryError) {
           console.error("Recovery failed:", recoveryError);
        }
      }
      throw e;
    }
  },

  updateUserPassword: async (newPassword: string): Promise<void> => {
    const user = auth.currentUser;
    if (user) {
      try {
        await updatePassword(user, newPassword);
      } catch (error: any) {
        console.error("Error updating password", error);
        if (error.code === 'auth/requires-recent-login') {
          throw new Error("Por seguridad, debes cerrar sesión e ingresar nuevamente antes de cambiar la contraseña.");
        }
        throw mapAuthError(error);
      }
    } else {
      throw new Error("No hay usuario autenticado.");
    }
  }
};

const mapAuthError = (error: any): Error => {
  const code = error.code;
  let msg = "Error desconocido.";
  if (code === 'auth/invalid-email') msg = "El correo no es válido.";
  if (code === 'auth/user-disabled') msg = "Usuario deshabilitado.";
  if (code === 'auth/user-not-found') msg = "Usuario no registrado.";
  if (code === 'auth/wrong-password') msg = "Contraseña incorrecta.";
  if (code === 'auth/email-already-in-use') msg = "Este correo ya está registrado.";
  if (code === 'auth/weak-password') msg = "La contraseña es muy débil (mínimo 6 caracteres).";
  if (code === 'auth/invalid-credential') msg = "Credenciales incorrectas. Si eres usuario nuevo, regístrate primero.";
  if (code === 'permission-denied') msg = "Error de permisos. Contacta soporte.";
  if (code === 'auth/requires-recent-login') msg = "Sesión expirada. Inicia sesión nuevamente para continuar.";
  return new Error(msg);
};
