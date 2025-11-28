
import { db } from "../firebaseConfig";
import { 
  collection, 
  doc, 
  updateDoc, 
  onSnapshot,
  query,
  orderBy,
  addDoc,
  serverTimestamp,
  getDocs
} from "firebase/firestore";
import { Cooperative, PricingConfig } from "../../types";
import { INITIAL_COOPERATIVES } from "../mockData";

export const CooperativeService = {
  
  // 1. Listen to all cooperatives
  subscribeToCooperatives: (onUpdate: (coops: Cooperative[]) => void) => {
    const q = query(collection(db, "cooperatives"), orderBy("name"));

    return onSnapshot(q, (snapshot) => {
      // Fallback to mock data if empty (for demo/first run)
      if (snapshot.empty && INITIAL_COOPERATIVES.length > 0) {
         // Optionally seed here, but for now just return mock
         onUpdate(INITIAL_COOPERATIVES);
         return;
      }

      const coops = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Cooperative));
      onUpdate(coops);
    }, (error) => {
      console.warn("Error subscribing to cooperatives (Permission denied or Network error). Using mock data.", error);
      onUpdate(INITIAL_COOPERATIVES);
    });
  },

  // 2. Create a new Cooperative
  createCooperative: async (name: string, code: string, pricing: PricingConfig) => {
     const newCoop = {
        name,
        code: code.toUpperCase(),
        status: 'ACTIVE',
        pricing,
        createdAt: serverTimestamp()
     };
     await addDoc(collection(db, "cooperatives"), newCoop);
  },

  // 3. Update Pricing or Details
  updateCooperative: async (coopId: string, data: Partial<Cooperative>) => {
     const ref = doc(db, "cooperatives", coopId);
     await updateDoc(ref, data);
  },

  // 4. Toggle Status
  toggleStatus: async (coopId: string, currentStatus: 'ACTIVE' | 'INACTIVE') => {
    const ref = doc(db, "cooperatives", coopId);
    await updateDoc(ref, { 
       status: currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' 
    });
  },

  // Helper to seed if needed (can be called from App.tsx)
  seedInitialCooperatives: async () => {
    try {
       const snap = await getDocs(collection(db, "cooperatives"));
       if (snap.empty) {
         for (const coop of INITIAL_COOPERATIVES) {
           await addDoc(collection(db, "cooperatives"), coop);
         }
       }
    } catch(e) {
       console.warn("Seeding cooperatives skipped due to permissions.");
    }
  }
};
