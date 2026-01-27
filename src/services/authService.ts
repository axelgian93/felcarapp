
import { auth, db } from "../firebaseConfig";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updatePassword, 
  sendPasswordResetEmail,
  User as FirebaseUser 
} from "firebase/auth";
import { 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp 
} from "firebase/firestore";
import { User, UserRole, AccountStatus } from "../../types";
import { INITIAL_USERS, INITIAL_COOPERATIVES } from "../mockData";

// Helper to remove undefined fields recursively to prevent Firestore errors
const cleanFirestoreData = (obj: any): any => {
  if (obj === undefined) return undefined;
  if (obj === null) return null;
  if (typeof obj === 'object' && typeof (obj as any).toMillis === 'function') return obj;
  if (obj instanceof Date) return obj;
  if (Array.isArray(obj)) return obj.map(v => cleanFirestoreData(v)).filter(v => v !== undefined);
  if (typeof obj === 'object') {
    const newObj: any = {};
    Object.keys(obj).forEach(key => {
      const val = cleanFirestoreData((obj as any)[key]);
      if (val !== undefined) newObj[key] = val;
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
  
  getUserProfile: async (uid: string, fbUser?: FirebaseUser): Promise<User | null> => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
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
    
    const mockMatch = fbUser.email 
      ? INITIAL_USERS.find(u => u.email.toLowerCase() === fbUser.email!.toLowerCase())
      : undefined;

    let newProfile: any;

    if (mockMatch) {
        const { id, password, ...rest } = mockMatch;
        newProfile = {
            ...rest,
            createdAt: serverTimestamp()
        };
    } else {
        newProfile = {
            email: fbUser.email || '',
            name: fbUser.displayName || 'Usuario Sin Nombre',
            role: UserRole.RIDER,
            status: AccountStatus.ACTIVE,
            cooperativeId: 'coop-global',
            createdAt: serverTimestamp(),
            photoUrl: fbUser.photoURL || (fbUser.email ? `https://ui-avatars.com/api/?name=${fbUser.email}&background=random` : ''),
            phone: '',
            rating: 5.0
        };
    }

    const cleanProfile = cleanFirestoreData(newProfile);
    await setDoc(doc(db, "users", fbUser.uid), cleanProfile);
    return mapDocToUser(fbUser.uid, cleanProfile);
  },

  register: async (userData: Omit<User, 'id' | 'status'>, pass: string, coopCode: string): Promise<User> => {
    const userCredential = await createUserWithEmailAndPassword(auth, userData.email, pass);
    const fbUser = userCredential.user!;

    let targetCoopId = 'coop-global';
    if (coopCode) {
         const coop = INITIAL_COOPERATIVES.find(c => c.code === coopCode);
         if (coop) targetCoopId = coop.id;
    }

    const newProfile = {
      ...userData,
      status: AccountStatus.PENDING,
      cooperativeId: targetCoopId,
      createdAt: serverTimestamp(),
      rating: 5.0
    };

    const cleanProfile = cleanFirestoreData(newProfile);
    await setDoc(doc(db, "users", fbUser.uid), cleanProfile);
    
    return mapDocToUser(fbUser.uid, cleanProfile);
  },

  login: async (email: string, pass: string): Promise<User> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, pass);
      const fbUser = userCredential.user!;

      const userDoc = await getDoc(doc(db, "users", fbUser.uid));

      if (userDoc.exists()) {
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
    await signOut(auth);
  },

  updateUserPassword: async (newPass: string) => {
    const user = auth.currentUser;
    if (user) {
      await updatePassword(user, newPass);
    } else {
      throw new Error("No user logged in");
    }
  },

  resetPassword: async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  }
};
