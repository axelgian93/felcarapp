
import { User, UserRole, AccountStatus, CarType, TripHistoryItem, ServiceType, PaymentMethod, Cooperative, Company, SupportTicket } from '../types';

// --- MOCK TENANTS (COOPERATIVES) ---
export const INITIAL_COOPERATIVES: Cooperative[] = [
  {
    id: 'coop-global',
    name: 'Felcar Global',
    code: 'GLOBAL',
    status: 'ACTIVE',
    pricing: {
      baseRate: 1.50,
      perKm: 0.35,
      perMin: 0.10,
      minFare: 2.00,
      commissionPct: 20, // Global users generate 20% commission for platform
      bookingFee: 0.25
    }
  },
  {
    id: 'coop-a',
    name: 'Cooperativa Modelo',
    code: 'MODELO2025',
    status: 'ACTIVE',
    pricing: {
      baseRate: 1.50,
      perKm: 0.35,
      perMin: 0.10,
      minFare: 2.00,
      commissionPct: 15, // This coop negotiated 15%
      bookingFee: 0.25
    }
  },
  {
    id: 'coop-b',
    name: 'Taxi Rápido VIP',
    code: 'VIP593',
    status: 'ACTIVE',
    pricing: {
      baseRate: 2.50,
      perKm: 0.50,
      perMin: 0.15,
      minFare: 4.00,
      commissionPct: 15,
      bookingFee: 0.50
    }
  }
];

// --- MOCK B2B COMPANIES ---
export const INITIAL_COMPANIES: Company[] = [
  {
    id: 'comp-1',
    name: 'Corporación El Rosado',
    ruc: '0990004196001',
    email: 'finanzas@elrosado.com',
    address: 'Av. 9 de Octubre 123',
    cooperativeId: 'coop-a', 
    creditLimit: 500.00,
    usedCredit: 125.50,
    billingCycle: 'MONTHLY',
    status: 'ACTIVE',
    contactName: 'Juan Finanzas',
    customPricing: {
      baseRate: 1.25,
      perKm: 0.30,
      perMin: 0.08,
      minFare: 1.50,
      commissionPct: 10,
      bookingFee: 0.00
    }
  },
  {
    id: 'comp-2',
    name: 'Banco del Pacífico',
    ruc: '0990005555001',
    email: 'logistica@pacifico.com',
    address: 'Francisco de Orellana',
    cooperativeId: 'coop-b',
    creditLimit: 2000.00,
    usedCredit: 1950.00,
    billingCycle: 'MONTHLY',
    status: 'ACTIVE',
    contactName: 'Maria Logistica'
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'admin-legacy',
    name: 'Admin General',
    email: 'admin@admin.com',
    password: 'admin123', // Updated to 6+ chars
    role: UserRole.SUPERADMIN,
    status: AccountStatus.ACTIVE,
    photoUrl: 'https://ui-avatars.com/api/?name=Admin+General&background=000&color=fff'
  },
  {
    id: 'super-admin',
    name: 'Super Admin',
    email: 'super@admin.com',
    password: 'super123', // Updated to 6+ chars
    role: UserRole.SUPERADMIN,
    status: AccountStatus.ACTIVE,
    photoUrl: 'https://ui-avatars.com/api/?name=Super+Admin&background=000&color=fff'
  },
  {
    id: 'admin-coop-a',
    name: 'Admin Modelo',
    email: 'adminA@coop.com',
    password: 'admin123', // Updated to 6+ chars
    role: UserRole.ADMIN,
    cooperativeId: 'coop-a',
    status: AccountStatus.ACTIVE,
    photoUrl: 'https://ui-avatars.com/api/?name=Admin+A&background=random'
  },
  {
    id: 'rider-demo',
    name: 'Pasajero Gye (Corp)',
    email: 'rider@demo.com',
    password: '123456', // Updated to 6+ chars
    role: UserRole.RIDER,
    cooperativeId: 'coop-a',
    companyId: 'comp-1',
    status: AccountStatus.ACTIVE,
    cedula: '0910020030',
    phone: '0991234567',
    rating: 4.8, 
    photoUrl: 'https://ui-avatars.com/api/?name=Rider+Gye&background=random',
    savedPlaces: [
      { id: 'sp1', name: 'Casa', type: 'HOME', coords: { lat: -2.1498, lng: -79.8855 }, address: "Sauces 4, Mz 123" },
      { id: 'sp2', name: 'Trabajo', type: 'WORK', coords: { lat: -2.1894, lng: -79.8891 }, address: "Av. 9 de Octubre y Boyacá" }
    ],
    paymentMethods: [
       { id: 'card1', brand: 'visa', last4: '4242', expiry: '12/25' }
    ]
  },
  {
    id: 'driver-demo',
    name: 'Conductor Gye',
    email: 'driver@demo.com',
    password: '123456', // Updated to 6+ chars
    role: UserRole.DRIVER,
    cooperativeId: 'coop-global',
    status: AccountStatus.ACTIVE,
    cedula: '0920030040',
    phone: '0987654321',
    rating: 4.9,
    photoUrl: 'https://ui-avatars.com/api/?name=Driver+Gye&background=random',
    driverDetails: { 
      plate: 'GBA-1234', 
      carModel: 'Chevrolet Spark GT', 
      carYear: '2021',
      carColor: '#DC2626',
      carType: CarType.SEDAN,
      licenseNumber: '12345',
      insurancePolicy: 'SEG-999888'
    }
  }
];

export const MOCK_HISTORY: TripHistoryItem[] = [
  {
    id: 'h1',
    cooperativeId: 'coop-a',
    companyId: 'comp-1',
    date: Date.now() - 86400000, 
    pickupAddress: 'Mall del Sol',
    destinationAddress: 'Puerto Santa Ana',
    destinationCoords: { lat: -2.1815, lng: -79.8765 },
    price: 3.50,
    currency: '$',
    status: 'COMPLETED',
    role: UserRole.RIDER,
    counterpartName: 'Carlos Driver',
    counterpartPhoto: 'https://ui-avatars.com/api/?name=Carlos&background=random',
    rating: 5,
    serviceType: ServiceType.RIDE,
    paymentMethod: PaymentMethod.CORPORATE,
    distance: 5.2,
    duration: 18,
    commissionSnapshot: 15 // Coop A has 15%
  },
  {
    id: 'h2',
    cooperativeId: 'coop-b',
    date: Date.now() - 172800000, 
    pickupAddress: 'Aeropuerto JJO',
    destinationAddress: 'Centro',
    price: 8.00,
    currency: '$',
    status: 'COMPLETED',
    role: UserRole.DRIVER,
    counterpartName: 'Pasajero Gye',
    counterpartPhoto: 'https://ui-avatars.com/api/?name=Rider&background=random',
    rating: 5,
    serviceType: ServiceType.RIDE,
    paymentMethod: PaymentMethod.CARD,
    distance: 8.1,
    duration: 25,
    commissionSnapshot: 15
  },
  {
    id: 'h3',
    cooperativeId: 'coop-global',
    date: Date.now() - 250000000, 
    pickupAddress: 'Terminal Terrestre',
    destinationAddress: 'Sauces 8',
    price: 4.20,
    currency: '$',
    status: 'COMPLETED',
    role: UserRole.RIDER,
    counterpartName: 'Luis Driver',
    counterpartPhoto: 'https://ui-avatars.com/api/?name=Luis&background=random',
    rating: 4,
    serviceType: ServiceType.RIDE,
    paymentMethod: PaymentMethod.CASH,
    distance: 4.5,
    duration: 15,
    commissionSnapshot: 20 // Global has 20%
  }
];

export const MOCK_TICKETS: SupportTicket[] = [
   {
      id: 't-101',
      ticketNumber: '#10192',
      userId: 'rider-demo',
      userName: 'Pasajero Gye',
      userRole: UserRole.RIDER,
      cooperativeId: 'coop-a',
      subject: 'Cobro duplicado',
      description: 'Me cobraron dos veces por el viaje al aeropuerto del día martes.',
      status: 'OPEN',
      priority: 'HIGH',
      date: Date.now() - 3600000,
      attachments: []
   },
   {
      id: 't-102',
      ticketNumber: '#23004',
      userId: 'driver-demo',
      userName: 'Conductor Gye',
      userRole: UserRole.DRIVER,
      subject: 'Actualización de documentos',
      description: 'Subí mi nueva licencia pero sigue apareciendo como pendiente.',
      status: 'IN_PROGRESS',
      priority: 'MEDIUM',
      date: Date.now() - 86400000,
      attachments: []
   }
];
