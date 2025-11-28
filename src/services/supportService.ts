
import { db } from "../firebaseConfig";
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  onSnapshot, 
  query, 
  where, 
  orderBy, 
  serverTimestamp 
} from "firebase/firestore";
import { SupportTicket, User, UserRole } from "../../types";
import { MOCK_TICKETS } from "../mockData";

export const SupportService = {
  
  // 1. Create new Ticket
  createTicket: async (user: User, subject: string, description: string, priority: 'LOW'|'MEDIUM'|'HIGH', attachments: string[]) => {
    // Generate readable Ticket Number
    const ticketNumber = `#${Math.floor(10000 + Math.random() * 90000)}`;

    const newTicket = {
      ticketNumber,
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      cooperativeId: user.cooperativeId || null,
      subject,
      description,
      status: 'OPEN',
      priority,
      attachments: attachments || [],
      date: Date.now(), // Client side timestamp for immediate UI
      createdAt: serverTimestamp()
    };

    await addDoc(collection(db, "tickets"), newTicket);
    return ticketNumber;
  },

  // 2. Subscribe to Tickets (Role Based Access Control)
  subscribeToTickets: (
    user: User, 
    filterCoopId: string | 'ALL', 
    onUpdate: (tickets: SupportTicket[]) => void
  ) => {
    let q;
    
    // Permission Logic
    if (user.role === UserRole.SUPERADMIN) {
        if (filterCoopId === 'ALL') {
             q = query(collection(db, "tickets"), orderBy("date", "desc"));
        } else {
             q = query(collection(db, "tickets"), where("cooperativeId", "==", filterCoopId));
        }
    } else if (user.role === UserRole.ADMIN) {
        // Admin needs to see:
        // 1. Riders from their Coop
        // 2. ALL Drivers (Global)
        // Firestore OR queries are limited. We fetch all recent tickets and filter in the UI component 
        // to support this specific hybrid logic without complex composite indexes.
        q = query(collection(db, "tickets"), orderBy("date", "desc")); 
    } else {
        // Riders/Drivers only see THEIR tickets
        q = query(collection(db, "tickets"), where("userId", "==", user.id));
    }

    return onSnapshot(q, (snapshot) => {
        if (snapshot.empty) {
           // Fallback to MOCK DATA if firestore is empty for demo
           let mocks = MOCK_TICKETS;
           if (user.role === UserRole.RIDER || user.role === UserRole.DRIVER) {
               mocks = mocks.filter(t => t.userId === user.id);
           } 
           // Admin filtering logic for mocks is handled in AdminPanel usually, but basic here:
           else if (user.role === UserRole.ADMIN) {
               mocks = mocks.filter(t => t.cooperativeId === user.cooperativeId || t.userRole === UserRole.DRIVER);
           }
           onUpdate(mocks);
           return;
        }

        const tickets = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data
            } as SupportTicket;
        });
        
        // Client side sort if needed (composite index limits)
        tickets.sort((a,b) => b.date - a.date);
        onUpdate(tickets);

    }, (error) => {
        console.warn("Support sub error:", error);
        onUpdate(MOCK_TICKETS);
    });
  },

  // 3. Update Ticket Status
  updateTicketStatus: async (ticketId: string, status: 'OPEN' | 'IN_PROGRESS' | 'CLOSED') => {
      // Check if it's a mock ID
      if (ticketId.startsWith('t-')) return; 

      const ref = doc(db, "tickets", ticketId);
      await updateDoc(ref, { status });
  }
};
