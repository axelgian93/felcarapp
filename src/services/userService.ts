import { db } from "../firebaseConfig";
import { 
  collection, 
  doc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot,
  query,
  orderBy,
  arrayUnion,
  setDoc,
  serverTimestamp
} from "firebase/firestore";
import { User, AccountStatus, SavedPlace, UserRole } from "../../types";

export const UserService = {
  
  // 1. Listen to ALL users in real-time (for Admin Dashboard)
  subscribeToAllUsers: (onUpdate: (users: User[]) => void) => {
    // Order by creation time to see newest first
    const q = query(collection(db, "users"), orderBy("createdAt", "desc"));

    return onSnapshot(q, (snapshot) => {
      const users = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          // Ensure timestamps are converted to numbers for UI
          createdAt: data.createdAt?.toMillis ? data.createdAt.toMillis() : Date.now()
        } as User;
      });
      onUpdate(users);
    }, (error) => {
      console.warn("Error subscribing to users:", error);
    });
  },

  // 2. Approve a user (Pending -> Active)
  approveUser: async (userId: string) => {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, { 
      status: AccountStatus.ACTIVE 
    });
  },

  // 3. Reject a user (Pending -> Rejected)
  rejectUser: async (userId: string) => {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, { 
      status: AccountStatus.REJECTED 
    });
  },

  // 4. Toggle Suspend/Active
  updateUserStatus: async (userId: string, newStatus: AccountStatus) => {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, { 
      status: newStatus 
    });
  },

  // 5. Delete User Profile (Note: This deletes the Firestore doc, not the Auth account due to client SDK limits)
  deleteUserProfile: async (userId: string) => {
    await deleteDoc(doc(db, "users", userId));
  },

  // 6. Add a Saved Place
  addSavedPlace: async (userId: string, place: SavedPlace) => {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
       savedPlaces: arrayUnion(place)
    });
  },

  // 7. Update User Profile Photo
  updateUserPhoto: async (userId: string, photoUrl: string) => {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, { photoUrl });
  },

  // 8. Update Vehicle Photo
  updateCarPhoto: async (userId: string, photoUrl: string) => {
    const userRef = doc(db, "users", userId);
    // Needs dot notation to update nested field
    await updateDoc(userRef, { "driverDetails.carPhotoUrl": photoUrl });
  },

  // 9. SUPERADMIN: Move User to another Cooperative
  updateUserCooperative: async (userId: string, newCooperativeId: string) => {
     const userRef = doc(db, "users", userId);
     await updateDoc(userRef, { cooperativeId: newCooperativeId });
  },

  // 10. SUPERADMIN: Edit User Details
  updateUserDetails: async (userId: string, data: Partial<User>) => {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, data);
  },

  // 11. Create ADMIN/USER Profile (Provisioning)
  // This allows Admins/SuperAdmins to pre-create profiles. 
  // The user claims it when they register with the same email.
  createUser: async (userData: { 
      name: string, 
      email: string, 
      phone: string, 
      cedula: string,
      role: UserRole, 
      cooperativeId: string,
      driverDetails?: any // Optional: Only for drivers
  }) => {
     // Generate a pseudo ID since we can't create Auth User from client easily
     const newId = `prov_${Date.now()}`;
     
     const newUser: User = {
        id: newId,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        cedula: userData.cedula,
        role: userData.role,
        status: AccountStatus.ACTIVE, // Pre-approved since admin created it
        cooperativeId: userData.cooperativeId,
        photoUrl: `https://ui-avatars.com/api/?name=${userData.name}&background=random`,
        createdAt: Date.now(),
        rating: 5.0,
        driverDetails: userData.driverDetails // Add vehicle data if provided
     };

     await setDoc(doc(db, "users", newId), {
        ...newUser,
        createdAt: serverTimestamp()
     });
  },

  // Legacy method kept for compatibility, wraps createUser
  createAdminProfile: async (adminData: { name: string, email: string, cooperativeId: string, phone: string }) => {
      await UserService.createUser({
          ...adminData,
          cedula: '',
          role: UserRole.ADMIN
      });
  }
};