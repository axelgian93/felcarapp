
export enum RideStatus {
  IDLE = 'IDLE',
  ESTIMATING = 'ESTIMATING',
  CHOOSING = 'CHOOSING',
  SEARCHING = 'SEARCHING',
  DRIVER_ASSIGNED = 'DRIVER_ASSIGNED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}

export enum ServiceType {
  RIDE = 'RIDE',        // Standard Taxi
  DELIVERY = 'DELIVERY', // Package/Moto
  HOURLY = 'HOURLY',     // Rent by hour
  TRIP = 'TRIP'         // Interprovincial
}

export enum CarType {
  SEDAN = 'SEDAN',
  SUV = 'SUV',
  MOTORCYCLE = 'MOTORCYCLE'
}

export interface RideOption {
  id: string;
  name: string;
  price: number;
  currency: string;
  eta: number; // minutes away
  duration: number; // trip duration minutes or hours if hourly service
  description: string;
  capacity: number | string; // number of seats or package size
}

export interface Location {
  lat: number;
  lng: number;
  address?: string;
}

// Map entity driver
export interface Driver {
  id: string;
  name: string;
  rating: number;
  carModel: string;
  carYear: string;
  carColor: string; // Hex code or name
  carType: CarType;
  plate: string;
  photoUrl: string;
  coords: Location;
  // Real-time operational state
  status?: 'AVAILABLE' | 'BUSY' | 'OFFLINE';
  lastActive?: number;
}

// User Account Types
export enum UserRole {
  RIDER = 'RIDER',
  DRIVER = 'DRIVER',
  ADMIN = 'ADMIN'
}

export enum AccountStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  REJECTED = 'REJECTED',
  SUSPENDED = 'SUSPENDED' // Blocked
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relation: string;
}

export interface PaymentCard {
  id: string;
  last4: string;
  brand: 'visa' | 'mastercard' | 'amex';
  expiry: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  photoUrl?: string;
  role: UserRole;
  status: AccountStatus;
  cedula?: string; // Ecuadorian ID
  phone?: string;
  rating?: number; // User rating (both Rider and Driver)
  createdAt?: number; // Registration date
  totalTrips?: number;
  totalSpent?: number; // For riders
  totalEarnings?: number; // For drivers
  savedPlaces?: {
    home?: Location;
    work?: Location;
  };
  emergencyContacts?: EmergencyContact[];
  paymentMethods?: PaymentCard[];
  preferences?: {
    notifications: boolean;
    language: 'es' | 'en';
    promos: boolean;
  };
  driverDetails?: {
    plate: string;
    carModel: string;
    carYear: string;
    carColor: string; // Hex string
    carType: CarType;
    licenseNumber: string;
    insurancePolicy: string; 
    documentsStatus?: 'VALID' | 'EXPIRED' | 'PENDING';
    zone?: string;
  };
  password?: string; 
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: number;
  isSelf: boolean;
}

export enum PaymentMethod {
  CASH = 'CASH',
  CARD = 'CARD',
  WALLET = 'WALLET',
  TRANSFER = 'TRANSFER'
}

export interface TripHistoryItem {
  id: string;
  date: number; // timestamp
  pickupAddress: string;
  destinationAddress: string;
  destinationCoords?: Location; // Added for history suggestions
  price: number;
  currency: string;
  status: 'COMPLETED' | 'CANCELLED' | 'IN_PROGRESS';
  role: UserRole; 
  counterpartName: string; 
  counterpartPhoto?: string;
  rating?: number;
  feedbackTags?: string[];
  comment?: string;
  serviceType?: ServiceType;
  paymentMethod?: PaymentMethod; 
  duration?: number; // minutes
  distance?: number; // km
  tip?: number;
  breakdown?: {
    base: number;
    distance: number;
    time: number;
    fees: number;
  };
}

export interface ScheduledRide {
  id: string;
  date: Date;
  pickupAddress: string;
  destinationAddress: string;
  serviceType: ServiceType;
}

// --- ADMIN SPECIFIC TYPES ---

export interface AdminReport {
  id: string;
  title: string;
  type: 'FINANCIAL' | 'INCIDENT' | 'SYSTEM' | 'USER';
  date: number;
  status: 'RESOLVED' | 'PENDING' | 'REVIEW';
  summary: string;
  severity?: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
  timestamp: number;
  read: boolean;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  tripId?: string;
  subject: string;
  description: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'CLOSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  date: number;
}

export interface Transaction {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  type: 'PAYOUT' | 'COMMISSION' | 'REFUND';
  status: 'PAID' | 'PENDING';
  date: number;
  method: string;
}

export interface PricingConfig {
  city: string;
  baseRate: number;
  perKm: number;
  perMin: number;
  minFare: number;
  commissionPct: number;
  bookingFee: number;
}

export interface DriverEarnings {
  today: number;
  week: number;
  month: number;
  pendingPayout: number;
  history: {
    date: string;
    amount: number;
    trips: number;
  }[];
}

export interface DriverAnalytics {
  earnings: {
    today: { gross: number; commission: number; bonus: number; net: number };
    week: { gross: number; commission: number; bonus: number; net: number };
    month: { gross: number; commission: number; bonus: number; net: number };
  };
  onlineStats: {
    todayHours: number;
    weekHours: number;
    tripsPerHour: number;
    dailyBreakdown: { day: string; hours: number }[];
  };
}

export interface DriverDocument {
  id: string;
  name: string;
  status: 'VALID' | 'EXPIRED' | 'PENDING';
  expiryDate: string;
}
