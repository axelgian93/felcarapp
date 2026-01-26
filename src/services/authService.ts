
// Guidelines: Using compat API to resolve "no exported member" errors
import firebase from 'firebase/compat/app';
import { auth, db } from "../firebaseConfig";
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
    cooperativeId: data.cooperativeId,
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
  
  getUserProfile: async (uid: string, fbUser?: any): Promise<User | null> => {
    try {
      // Using compat API for Firestore
      const userDoc = await db.collection("users").doc(uid).get();

      if (userDoc.exists) {
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

  createProfileFromFallback: async (fbUser: any): Promise<User> => {
    console.warn(`Creating missing profile for ${fbUser.email}...`);
    
    const mockMatch = INITIAL_USERS.find(u => u.email.toLowerCase() === fbUser.email?.toLowerCase());

    let newProfile: any;

    if (mockMatch) {
        const { id, password, ...rest } = mockMatch;
        newProfile = {
            ...rest,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };
    } else {
        newProfile = {
            email: fbUser.email || '',
            name: fbUser.displayName || 'Usuario Sin Nombre',
            role: UserRole.RIDER,
            status: AccountStatus.ACTIVE,
            cooperativeId: 'coop-global',
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            photoUrl: fbUser.photoURL || `https://ui-avatars.com/api/?name=${fbUser.email}&background=random`,
            phone: '',
            rating: 5.0
        };
    }

    const cleanProfile = cleanFirestoreData(newProfile);
    await db.collection("users").doc(fbUser.uid).set(cleanProfile);
    return mapDocToUser(fbUser.uid, cleanProfile);
  },

  register: async (userData: Omit<User, 'id' | 'status'>, pass: string, coopCode: string): Promise<User> => {
    // 1. Create Auth User using compat API
    const userCredential = await auth.createUserWithEmailAndPassword(userData.email, pass);
    const fbUser = userCredential.user!;

    // 2. Determine Cooperative ID based on code
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
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      rating: 5.0
    };

    const cleanProfile = cleanFirestoreData(newProfile);
    await db.collection("users").doc(fbUser.uid).set(cleanProfile);
    
    return mapDocToUser(fbUser.uid, cleanProfile);
  },

  login: async (email: string, pass: string): Promise<User> => {
    try {
      // Using compat API for login
      const userCredential = await auth.signInWithEmailAndPassword(email, pass);
      const fbUser = userCredential.user!;

      const userDoc = await db.collection("users").doc(fbUser.uid).get();

      if (userDoc.exists) {
        return mapDocToUser(fbUser.uid, userDoc.data());
      } else {
        return await AuthService.createProfileFromFallback(fbUser);
      }
    } catch (error: any) {
      const mockUser = INITIAL_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (mockUser && mockUser.password === pass) {
         if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
            console.log(`Auto-seeding demo user: ${email}`);
            try {
               const { id, password, ...profileData } = mockUser;
               return await AuthService.register(profileData, pass, ''); 
            } catch (regError: any) {
               console.error("Auto-seed failed:", regError);
               throw error;
            }
         }
      }
      throw error;
    }
  },

  logout: async () => {
    await auth.signOut();
  },

  updateUserPassword: async (newPass: string) => {
    const user = auth.currentUser;
    if (user) {
      await user.updatePassword(newPass);
    } else {
      throw new Error("No user logged in");
    }
  }
};
