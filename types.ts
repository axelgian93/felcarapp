
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
  commission?: number; // Snapshot of the profit % for this ride option
}

export interface Location {
  lat: number;
  lng: number;
  address?: string;
  subtitle?: string; // Extra details like neighborhood or street
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
  ADMIN = 'ADMIN',
  SUPERADMIN = 'SUPERADMIN'
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

export interface SavedPlace {
  id: string;
  name: string; // "Casa", "Trabajo", "Gym"
  address: string;
  coords: Location;
  type: 'HOME' | 'WORK' | 'OTHER';
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
  
  // MULTI-TENANT FIELD
  cooperativeId?: string; // Links User to a specific Cooperative (Tenant)
  
  // CORPORATE B2B FIELD
  companyId?: string; // Links User to a specific Company (Client)

  totalTrips?: number;
  totalSpent?: number; // For riders
  totalEarnings?: number; // For drivers
  savedPlaces?: SavedPlace[]; // Refactored to Array for multiple places
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
    carPhotoUrl?: string; // Added field for car photo
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
  TRANSFER = 'TRANSFER',
  CORPORATE = 'CORPORATE' // B2B Credit
}

export interface TripHistoryItem {
  id: string;
  cooperativeId?: string; // Tenant tracking for the trip
  companyId?: string; // B2B tracking
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
  commissionSnapshot?: number; // The % commission that was valid when this trip was taken
}

export interface ScheduledRide {
  id: string;
  userId: string;
  date: number; // Timestamp for the scheduled time
  pickupAddress: string;
  pickupCoords?: Location;
  destinationAddress: string;
  destinationCoords?: Location;
  serviceType: ServiceType;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  notes?: string;
  createdAt: number;
}

// --- MULTI-TENANT CONFIG ---

export interface PricingConfig {
  baseRate: number;
  perKm: number;
  perMin: number;
  minFare: number;
  commissionPct: number;
  bookingFee: number;
}

export interface Cooperative {
  id: string;
  name: string;
  code: string; // The "QR Code" or Invitation Code
  logoUrl?: string;
  pricing: PricingConfig;
  status: 'ACTIVE' | 'INACTIVE';
}

// --- CORPORATE B2B2C ---

export interface Company {
  id: string;
  name: string;
  ruc: string;
  email: string;
  address: string;
  
  // Tenant Link
  cooperativeId: string; // Which Coop serves this company
  
  // Credit System
  creditLimit: number; // Monthly Max
  usedCredit: number; // Current consumption
  billingCycle: 'MONTHLY' | 'BIWEEKLY';
  status: 'ACTIVE' | 'SUSPENDED';
  
  contactName?: string;
  contactPhone?: string;

  // CUSTOM PRICING FOR B2B
  customPricing?: PricingConfig; // If present, overrides Cooperative pricing
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
  ticketNumber: string; // Readable ID e.g. #83910
  userId: string;
  userName: string;
  userRole: UserRole;
  cooperativeId?: string;
  tripId?: string;
  subject: string;
  description: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'CLOSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  date: number;
  attachments?: string[]; // Array of Photo URLs (Base64 or Link)
}

export interface Transaction {
  id: string;
  userId: string;
  userName: string;
  cooperativeId?: string;
  amount: number;
  type: 'PAYOUT' | 'COMMISSION' | 'REFUND';
  status: 'PAID' | 'PENDING';
  date: number;
  method: string;
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

export interface SessionLog {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: string;
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
    sessionLogs?: SessionLog[]; // Added for specific session reporting
  };
}

export interface DriverDocument {
  id: string;
  name: string;
  status: 'VALID' | 'EXPIRED' | 'PENDING';
  expiryDate: string;
}
