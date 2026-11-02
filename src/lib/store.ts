import { Business, Customer, MenuItem, StampTransaction } from '@/types';

export const INITIAL_BUSINESSES: Business[] = [
  {
    id: 'biz_aroma_1',
    slug: 'aroma-cafe',
    name: 'Café Aroma Especialidad',
    tagline: 'Granos de origen, tostados a la perfección',
    description: 'Café de especialidad, brunch artesanal y repostería recién horneada.',
    category: 'Cafetería & Brunch',
    logoUrl: '☕',
    coverUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80',
    phone: '+52 55 1234 5678',
    whatsapp: '525512345678',
    instagram: 'aroma.cafemx',
    address: 'Av. Providencia 1420, Col. Del Valle',
    city: 'Ciudad de México',
    pinCode: '1234',
    currency: '$',
    loyaltyConfig: {
      totalStamps: 8,
      rewardTitle: '1 Café de Especialidad Gratis',
      rewardDescription: 'Válido para cualquier Flat White, Cappuccino, Cold Brew o Latte mediano.',
      stampIcon: 'coffee',
      cardBgColor: '#1c1917', // stone-900
      cardTextColor: '#fafaf9',
      accentColor: '#f59e0b', // amber-500
      terms: 'Un sello por cada bebida consumida. No acumulable con otras promociones.',
      allowCashback: true,
      pointsRatio: 1,
    },
  },
  {
    id: 'biz_barber_2',
    slug: 'barber-king',
    name: 'Barber King Studio',
    tagline: 'Estilo clásico, precisión moderna',
    description: 'Cortes de autor, perfilado de barba con toalla caliente y rituales de cuidado masculino.',
    category: 'Barbería & Grooming',
    logoUrl: '💈',
    coverUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1200&q=80',
    phone: '+52 55 9876 5432',
    whatsapp: '525598765432',
    instagram: 'barberking.mx',
    address: 'Calle Roma Norte 89',
    city: 'Ciudad de México',
    pinCode: '1234',
    currency: '$',
    loyaltyConfig: {
      totalStamps: 5,
      rewardTitle: 'Corte o Perfilado de Barba Gratis',
      rewardDescription: 'Disfruta de tu 6to servicio sin costo con tratamiento capilar incluido.',
      stampIcon: 'scissors',
      cardBgColor: '#0f172a', // slate-900
      cardTextColor: '#f8fafc',
      accentColor: '#38bdf8', // sky-400
      terms: 'Un sello por servicio realizado. Válido con cita previa.',
      allowCashback: false,
    },
  },
  {
    id: 'biz_burger_3',
    slug: 'burger-craft',
    name: 'Craft Burger Lab',
    tagline: 'Smash burgers & cerveza artesanal',
    description: 'Carne 100% Angus, pan brioche horneado a diario y salsas de la casa.',
    category: 'Hamburguesería & Bar',
    logoUrl: '🍔',
    coverUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=80',
    phone: '+52 55 4433 2211',
    whatsapp: '525544332211',
    instagram: 'craftburger.lab',
    address: 'Corredor Gastronómico 45, Condesa',
    city: 'Ciudad de México',
    pinCode: '1234',
    currency: '$',
    loyaltyConfig: {
      totalStamps: 6,
      rewardTitle: 'Combo Deluxe Gratis',
      rewardDescription: 'Hamburguesa doble smash + papas truffle + bebida a elección.',
      stampIcon: 'burger',
      cardBgColor: '#7f1d1d', // red-900
      cardTextColor: '#fef2f2',
      accentColor: '#fbbf24', // amber-400
      terms: 'Un sello por combo o hamburguesa consumida. Válido en salón y para llevar.',
    },
  },
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust_1',
    businessId: 'biz_aroma_1',
    name: 'Carlos Mendoza',
    phone: '+52 55 8899 1122',
    email: 'carlos.mendoza@email.com',
    qrCodeToken: 'CARD-AROMA-88219',
    currentStamps: 6,
    totalVisits: 14,
    rewardsEarned: 1,
    rewardsRedeemed: 1,
    points: 140,
    createdAt: '2026-09-12T10:30:00Z',
    lastVisitAt: '2026-10-31T09:15:00Z',
  },
  {
    id: 'cust_2',
    businessId: 'biz_aroma_1',
    name: 'Sofia Valenzuela',
    phone: '+52 55 7766 5544',
    email: 'sofia.v@email.com',
    qrCodeToken: 'CARD-AROMA-19402',
    currentStamps: 8, // Ready to redeem!
    totalVisits: 8,
    rewardsEarned: 1,
    rewardsRedeemed: 0,
    points: 95,
    createdAt: '2026-10-01T15:20:00Z',
    lastVisitAt: '2026-11-01T11:00:00Z',
  },
  {
    id: 'cust_3',
    businessId: 'biz_aroma_1',
    name: 'Mateo Fernández',
    phone: '+52 55 3322 1100',
    email: 'mateo.f@email.com',
    qrCodeToken: 'CARD-AROMA-44910',
    currentStamps: 2,
    totalVisits: 2,
    rewardsEarned: 0,
    rewardsRedeemed: 0,
    points: 20,
    createdAt: '2026-10-25T14:10:00Z',
    lastVisitAt: '2026-10-28T16:45:00Z',
  },
  {
    id: 'cust_4',
    businessId: 'biz_barber_2',
    name: 'Alejandro Rios',
    phone: '+52 55 1199 8833',
    email: 'ale.rios@email.com',
    qrCodeToken: 'CARD-BARBER-33012',
    currentStamps: 4,
    totalVisits: 9,
    rewardsEarned: 1,
    rewardsRedeemed: 1,
    points: 120,
    createdAt: '2026-08-15T12:00:00Z',
    lastVisitAt: '2026-10-29T18:00:00Z',
  },
];

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  // Aroma Cafe Menu
  {
    id: 'menu_1',
    businessId: 'biz_aroma_1',
    name: 'Flat White de Origen (Chiapas)',
    description: 'Doble ristretto con leche cremada y microespuma sedosa.',
    price: 65,
    category: 'Café de Especialidad',
    imageUrl: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=400&q=80',
    available: true,
    featured: true,
  },
  {
    id: 'menu_2',
    businessId: 'biz_aroma_1',
    name: 'Cold Brew Nitro 16 hrs',
    description: 'Extracción en frío durante 16 horas infundido con nitrógeno para textura cremosa.',
    price: 75,
    category: 'Café de Especialidad',
    imageUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=400&q=80',
    available: true,
    featured: true,
  },
  {
    id: 'menu_3',
    businessId: 'biz_aroma_1',
    name: 'Avocado Toast & Huevo Poché',
    description: 'Pan de masa madre, aguacate hass, dukkah de frutos secos y brotes orgánicos.',
    price: 135,
    category: 'Brunch & Salados',
    imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=400&q=80',
    available: true,
    featured: true,
  },
  {
    id: 'menu_4',
    businessId: 'biz_aroma_1',
    name: 'Croissant Almendras & Vainilla',
    description: 'Hojaldre 100% mantequilla relleno de crema frangipane y almendras tostadas.',
    price: 60,
    category: 'Repostería',
    imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=400&q=80',
    available: true,
    featured: false,
  },
  {
    id: 'menu_5',
    businessId: 'biz_aroma_1',
    name: 'Matcha Latte Ceremonial Uji',
    description: 'Té verde japonés grado ceremonial con leche de avena vaporizada.',
    price: 80,
    category: 'Bebidas sin Café',
    imageUrl: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=400&q=80',
    available: true,
  },

  // Barber King Menu
  {
    id: 'menu_6',
    businessId: 'biz_barber_2',
    name: 'Corte Clásico + Lavado Capilar',
    description: 'Diseño personalizado con tijera o máquina, lavado y estilizado con cera mate.',
    price: 280,
    category: 'Cortes',
    available: true,
    featured: true,
  },
  {
    id: 'menu_7',
    businessId: 'biz_barber_2',
    name: 'Ritual de Barba & Toalla Caliente',
    description: 'Perfilado con navaja japonesa, aceites esenciales, toallas calientes y masaje facial.',
    price: 220,
    category: 'Barba',
    available: true,
    featured: true,
  },

  // Craft Burger Menu
  {
    id: 'menu_8',
    businessId: 'biz_burger_3',
    name: 'The Bacon Truffle Smash',
    description: 'Doble patty 90g smashed, queso cheddar madurado, tocino ahumado y mayo de trufa negra.',
    price: 195,
    category: 'Hamburguesas',
    available: true,
    featured: true,
  },
];

export const INITIAL_TRANSACTIONS: StampTransaction[] = [
  {
    id: 'tx_1',
    businessId: 'biz_aroma_1',
    customerId: 'cust_1',
    customerName: 'Carlos Mendoza',
    type: 'STAMP_ADDED',
    stampsChanged: 1,
    notes: 'Consumo Flat White',
    staffName: 'Cajero 1',
    createdAt: '2026-10-31T09:15:00Z',
  },
  {
    id: 'tx_2',
    businessId: 'biz_aroma_1',
    customerId: 'cust_2',
    customerName: 'Sofia Valenzuela',
    type: 'STAMP_ADDED',
    stampsChanged: 1,
    notes: 'Alcanzó los 8 sellos 🎉',
    staffName: 'Cajero 1',
    createdAt: '2026-11-01T11:00:00Z',
  },
];

// Helper to get global state in server memory or initialized state
class DataStore {
  private businesses: Business[] = [...INITIAL_BUSINESSES];
  private customers: Customer[] = [...INITIAL_CUSTOMERS];
  private menuItems: MenuItem[] = [...INITIAL_MENU_ITEMS];
  private transactions: StampTransaction[] = [...INITIAL_TRANSACTIONS];

  // Businesses
  getBusinesses(): Business[] {
    return this.businesses;
  }

  getBusinessBySlug(slug: string): Business | undefined {
    return this.businesses.find(b => b.slug.toLowerCase() === slug.toLowerCase());
  }

  getBusinessById(id: string): Business | undefined {
    return this.businesses.find(b => b.id === id);
  }

  updateBusinessConfig(businessId: string, updates: Partial<Business>): Business | null {
    const idx = this.businesses.findIndex(b => b.id === businessId);
    if (idx === -1) return null;
    this.businesses[idx] = { ...this.businesses[idx], ...updates };
    return this.businesses[idx];
  }

  // Customers
  getCustomersByBusiness(businessId: string): Customer[] {
    return this.customers.filter(c => c.businessId === businessId);
  }

  getCustomerByToken(token: string): Customer | undefined {
    return this.customers.find(c => c.qrCodeToken === token);
  }

  getCustomerById(id: string): Customer | undefined {
    return this.customers.find(c => c.id === id);
  }

  registerCustomer(data: { businessId: string; name: string; phone: string; email?: string }): Customer {
    const existing = this.customers.find(
      c => c.businessId === data.businessId && c.phone.replace(/\D/g, '') === data.phone.replace(/\D/g, '')
    );
    if (existing) {
      return existing;
    }

    const biz = this.getBusinessById(data.businessId);
    const prefix = biz ? biz.slug.substring(0, 5).toUpperCase() : 'PASS';
    const rand = Math.floor(10000 + Math.random() * 90000);
    const token = `CARD-${prefix}-${rand}`;

    const newCustomer: Customer = {
      id: `cust_${Date.now()}`,
      businessId: data.businessId,
      name: data.name,
      phone: data.phone,
      email: data.email,
      qrCodeToken: token,
      currentStamps: 1, // Welcome stamp!
      totalVisits: 1,
      rewardsEarned: 0,
      rewardsRedeemed: 0,
      points: 10,
      createdAt: new Date().toISOString(),
      lastVisitAt: new Date().toISOString(),
    };

    this.customers.unshift(newCustomer);

    // Record welcome stamp transaction
    this.transactions.unshift({
      id: `tx_${Date.now()}`,
      businessId: data.businessId,
      customerId: newCustomer.id,
      customerName: newCustomer.name,
      type: 'STAMP_ADDED',
      stampsChanged: 1,
      notes: 'Sello de bienvenida por activación',
      staffName: 'Sistema',
      createdAt: new Date().toISOString(),
    });

    return newCustomer;
  }

  addStamp(customerId: string, count: number = 1, staffName: string = 'Cajero'): { customer: Customer; rewardUnlocked: boolean } | null {
    const customer = this.customers.find(c => c.id === customerId);
    if (!customer) return null;

    const biz = this.getBusinessById(customer.businessId);
    const targetStamps = biz?.loyaltyConfig.totalStamps || 8;

    const prevStamps = customer.currentStamps;
    customer.currentStamps += count;
    customer.totalVisits += 1;
    customer.lastVisitAt = new Date().toISOString();
    customer.points += count * 10;

    let rewardUnlocked = false;
    if (customer.currentStamps >= targetStamps && prevStamps < targetStamps) {
      customer.rewardsEarned += 1;
      rewardUnlocked = true;
    }

    this.transactions.unshift({
      id: `tx_${Date.now()}`,
      businessId: customer.businessId,
      customerId: customer.id,
      customerName: customer.name,
      type: 'STAMP_ADDED',
      stampsChanged: count,
      notes: rewardUnlocked ? '¡Completó tarjeta de sellos! 🎉' : `+${count} sello(s)`,
      staffName,
      createdAt: new Date().toISOString(),
    });

    return { customer, rewardUnlocked };
  }

  redeemReward(customerId: string, staffName: string = 'Cajero'): { customer: Customer; success: boolean } | null {
    const customer = this.customers.find(c => c.id === customerId);
    if (!customer) return null;

    const biz = this.getBusinessById(customer.businessId);
    const targetStamps = biz?.loyaltyConfig.totalStamps || 8;

    if (customer.currentStamps < targetStamps) {
      return { customer, success: false };
    }

    // Reset stamps or deduct target stamps
    customer.currentStamps -= targetStamps;
    customer.rewardsRedeemed += 1;
    customer.lastVisitAt = new Date().toISOString();

    this.transactions.unshift({
      id: `tx_${Date.now()}`,
      businessId: customer.businessId,
      customerId: customer.id,
      customerName: customer.name,
      type: 'REWARD_REDEEMED',
      stampsChanged: -targetStamps,
      notes: `Canjeó premio: ${biz?.loyaltyConfig.rewardTitle || 'Premio'}`,
      staffName,
      createdAt: new Date().toISOString(),
    });

    return { customer, success: true };
  }

  // Transactions
  getTransactionsByBusiness(businessId: string): StampTransaction[] {
    return this.transactions.filter(t => t.businessId === businessId);
  }

  // Menu Items
  getMenuItems(businessId: string): MenuItem[] {
    return this.menuItems.filter(m => m.businessId === businessId);
  }

  addMenuItem(item: Omit<MenuItem, 'id'>): MenuItem {
    const newItem: MenuItem = {
      ...item,
      id: `menu_${Date.now()}`,
    };
    this.menuItems.push(newItem);
    return newItem;
  }

  updateMenuItem(id: string, updates: Partial<MenuItem>): MenuItem | null {
    const index = this.menuItems.findIndex(m => m.id === id);
    if (index === -1) return null;
    this.menuItems[index] = { ...this.menuItems[index], ...updates };
    return this.menuItems[index];
  }

  deleteMenuItem(id: string): boolean {
    const prevLength = this.menuItems.length;
    this.menuItems = this.menuItems.filter(m => m.id !== id);
    return this.menuItems.length < prevLength;
  }
}

// Global singleton for server-side persistence in dev runtime
const globalForStore = global as unknown as { appStore?: DataStore };
export const store = globalForStore.appStore ?? new DataStore();
if (process.env.NODE_ENV !== 'production') globalForStore.appStore = store;
