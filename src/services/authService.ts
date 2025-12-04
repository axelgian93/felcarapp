import { auth, db } from "../firebaseConfig";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  updatePassword,
  User as FirebaseUser 
} from "firebase/auth";
import { 
  doc, 
  setDoc, 
  getDoc, 
  Timestamp
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
  
  getUserProfile: async (uid: string, fbUser?: FirebaseUser): Promise<User | null> => {
    try {
      const userDocRef = doc(db, "users", uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        return mapDocToUser(uid, userDoc.data());
      } else if (fbUser) {
        return await AuthService.createProfileFromFallback(fbUser);
      }
      return null;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  },

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

  register: async (userData: Omit<User, 'id' | 'status'>, pass: string, coopCode: string): Promise<User> => {
    // 1. Create Auth User
    const userCredential = await createUserWithEmailAndPassword(auth, userData.email, pass);
    const fbUser = userCredential.user;

    // 2. Determine Cooperative ID based on code (if provided)
    let targetCoopId = 'coop-global';
    if (coopCode) {
         const coop = INITIAL_COOPERATIVES.find(c => c.code === coopCode);
         if (coop) targetCoopId = coop.id;
    }

    // 3. Create Profile in Firestore
    const newProfile = {
      ...userData,
      status: AccountStatus.PENDING,
      cooperativeId: targetCoopId,
      createdAt: Timestamp.now(),
      rating: 5.0
    };

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
               
               // DEBUGGING: Return clearer errors for APK testing
               if (regError.code === 'auth/email-already-in-use') {
                  throw new Error(`El usuario ${email} ya existe pero la contraseña es incorrecta. Bórralo en Firebase Auth o usa la contraseña antigua.`);
               }
               if (regError.code === 'auth/network-request-failed') {
                  throw new Error("Error de conexión. Verifica tu internet o las restricciones de la API Key en Google Cloud (Android vs Web).");
               }
               if (regError.code === 'auth/weak-password') {
                  throw new Error("Error crítico: La contraseña del usuario de prueba es muy débil.");
               }

               // Pass through existing user error if it was just a wrong password attempt originally
               throw error;
            }
         }
      }
      throw error;
    }
  },

  logout: async () => {
    await signOut(auth);
  },

  updateUserPassword: async (newPass: string) => {
    const user = auth.currentUser;
    if (user) {
      await updatePassword(user, newPass);
    } else {
      throw new Error("No user logged in");
    }
  }
};