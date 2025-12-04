import { db } from "../firebaseConfig";
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  onSnapshot, 
  query, 
  where, 
  serverTimestamp,
  limit
} from "firebase/firestore";
import { RideStatus, Location, RideOption, User, PaymentMethod, ScheduledRide } from "../../types";

export const TripService = {
  
  // 1. RIDER: Create a new trip request
  requestTrip: async (
    rider: User, 
    pickup: Location, 
    destination: Location, 
    pickupAddress: string,
    destAddress: string,
    rideOption: RideOption,
    paymentMethod: PaymentMethod,
    otp: string,
    note: string
  ) => {
    const tripData = {
      riderId: rider.id,
      riderName: rider.name,
      riderPhoto: rider.photoUrl,
      riderRating: rider.rating || 5.0,
      
      // Multi-tenant & B2B links
      cooperativeId: rider.cooperativeId || 'coop-global',
      companyId: rider.companyId || null,

      pickupCoords: pickup,
      destinationCoords: destination,
      pickupAddress: pickupAddress,
      destinationAddress: destAddress,
      
      price: rideOption.price,
      currency: rideOption.currency,
      serviceName: rideOption.name,
      
      // Store the specific commission snapshot for accurate accounting later
      commissionSnapshot: rideOption.commission || 20, 

      paymentMethod: paymentMethod,
      note: note,
      otp: otp, 
      
      status: RideStatus.SEARCHING,
      createdAt: serverTimestamp(),
      
      driverId: null,
      driverName: null,
      driverPhoto: null,
      driverCar: null,
      driverLocation: null
    };

    const docRef = await addDoc(collection(db, "trips"), tripData);
    return docRef.id;
  },

  // 2. RIDER & DRIVER: Listen to a specific trip updates
  subscribeToTrip: (tripId: string, onUpdate: (data: any) => void) => {
    return onSnapshot(doc(db, "trips", tripId), (doc) => {
      if (doc.exists()) {
        onUpdate({ id: doc.id, ...doc.data() });
      }
    }, (error) => {
      console.warn("Error subscribing to trip:", error);
    });
  },

  // 3. DRIVER: Listen for available trips nearby (Simplified: All Searching trips)
  subscribeToAvailableTrips: (onUpdate: (trips: any[]) => void) => {
    // Client side sort due to lack of composite index on created_at
    const q = query(
      collection(db, "trips"),
      where("status", "==", RideStatus.SEARCHING),
      limit(20)
    );

    return onSnapshot(q, (snapshot) => {
      const trips = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      trips.sort((a: any, b: any) => {
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.createdAt || 0);
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.createdAt || 0);
        return timeB - timeA;
      });

      onUpdate(trips);
    }, (error) => {
      console.warn("Error subscribing to available trips:", error);
      onUpdate([]);
    });
  },

  // 4. DRIVER: Accept a trip
  acceptTrip: async (tripId: string, driver: User, location: Location) => {
    const tripRef = doc(db, "trips", tripId);
    
    await updateDoc(tripRef, {
      status: RideStatus.DRIVER_ASSIGNED,
      driverId: driver.id,
      driverName: driver.name,
      driverPhoto: driver.photoUrl,
      driverRating: driver.rating || 5.0,
      driverCar: driver.driverDetails || {},
      driverLocation: location,
      acceptedAt: serverTimestamp()
    });
  },

  updateTripStatus: async (tripId: string, status: RideStatus) => {
    const tripRef = doc(db, "trips", tripId);
    await updateDoc(tripRef, { status });
  },

  updateDriverLocation: async (tripId: string, location: Location) => {
    const tripRef = doc(db, "trips", tripId);
    await updateDoc(tripRef, { driverLocation: location });
  },
  
  cancelTrip: async (tripId: string) => {
     const tripRef = doc(db, "trips", tripId);
     await updateDoc(tripRef, { status: 'CANCELLED' }); 
  },

  // --- SCHEDULED RIDES ---

  createScheduledRide: async (data: Omit<ScheduledRide, 'id' | 'createdAt'>) => {
      await addDoc(collection(db, "scheduled_rides"), {
          ...data,
          createdAt: serverTimestamp(),
          status: 'PENDING'
      });
  },

  subscribeToScheduledRides: (userId: string, onUpdate: (rides: ScheduledRide[]) => void) => {
      const q = query(collection(db, "scheduled_rides"), where("userId", "==", userId));
      return onSnapshot(q, (snapshot) => {
          const rides = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ScheduledRide));
          // Sort locally
          rides.sort((a, b) => a.date - b.date);
          onUpdate(rides);
      });
  },

  updateScheduledRide: async (rideId: string, data: Partial<ScheduledRide>) => {
      const ref = doc(db, "scheduled_rides", rideId);
      await updateDoc(ref, data);
  },

  cancelScheduledRide: async (rideId: string) => {
      const ref = doc(db, "scheduled_rides", rideId);
      await updateDoc(ref, { status: 'CANCELLED' });
  }
};