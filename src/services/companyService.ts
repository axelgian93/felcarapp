
import { db } from "../firebaseConfig";
import { 
  collection, 
  doc, 
  updateDoc, 
  onSnapshot,
  query,
  orderBy,
  where,
  addDoc,
  serverTimestamp,
  increment,
  getDoc
} from "firebase/firestore";
import { Company } from "../../types";
import { INITIAL_COMPANIES } from "../mockData";

export const CompanyService = {
  
  // 1. Get Company details by ID
  getCompanyById: async (companyId: string): Promise<Company | null> => {
    // For demo fallback
    const mock = INITIAL_COMPANIES.find(c => c.id === companyId);
    if (mock) return mock;

    const docRef = doc(db, "companies", companyId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
       return { id: snap.id, ...snap.data() } as Company;
    }
    return null;
  },

  // 2. Listen to companies (Filtered by Tenant/Coop)
  subscribeToCompanies: (coopId: string | 'ALL', onUpdate: (companies: Company[]) => void) => {
    let q;
    if (coopId === 'ALL') {
       q = query(collection(db, "companies"), orderBy("name"));
    } else {
       q = query(collection(db, "companies"), where("cooperativeId", "==", coopId));
    }

    return onSnapshot(q, (snapshot) => {
      // If empty in Firestore, return mock data for demo purposes if appropriate
      if (snapshot.empty && INITIAL_COMPANIES.length > 0) {
         if (coopId === 'ALL') onUpdate(INITIAL_COMPANIES);
         else onUpdate(INITIAL_COMPANIES.filter(c => c.cooperativeId === coopId));
         return;
      }

      const companies = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Company));
      onUpdate(companies);
    }, (error) => {
      console.warn("Error subscribing to companies:", error);
      // Fallback on error
      if (coopId === 'ALL') onUpdate(INITIAL_COMPANIES);
      else onUpdate(INITIAL_COMPANIES.filter(c => c.cooperativeId === coopId));
    });
  },

  // 3. Add Usage (After Trip)
  recordTripUsage: async (companyId: string, amount: number) => {
    const docRef = doc(db, "companies", companyId);
    await updateDoc(docRef, {
       usedCredit: increment(amount)
    });
  },

  // 4. Reset Credit (Bill Paid)
  processMonthlyPayment: async (companyId: string) => {
     const docRef = doc(db, "companies", companyId);
     await updateDoc(docRef, {
        usedCredit: 0
     });
  },

  // 5. Check if Company has credit available
  checkCreditAvailability: async (companyId: string, estimatedPrice: number): Promise<boolean> => {
     const company = await CompanyService.getCompanyById(companyId);
     if (!company) return false;
     if (company.status !== 'ACTIVE') return false;
     
     const remaining = company.creditLimit - company.usedCredit;
     return remaining >= estimatedPrice;
  },

  // 6. Create Company (Full Implementation)
  createCompany: async (companyData: Omit<Company, 'id'>) => {
     await addDoc(collection(db, "companies"), {
        ...companyData,
        usedCredit: 0,
        status: 'ACTIVE',
        createdAt: serverTimestamp()
     });
  },

  // 7. Update Company Details (Now including customPricing)
  updateCompany: async (companyId: string, data: Partial<Company>) => {
     const docRef = doc(db, "companies", companyId);
     
     // Ensure nested objects are handled correctly by firestore if passed wholly
     await updateDoc(docRef, data);
  }
};
