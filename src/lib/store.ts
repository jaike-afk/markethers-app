import { Business, Customer, MenuItem, StampTransaction, SaleRecord, MerchantClientAccount } from '@/types';

export const INITIAL_BUSINESSES: Business[] = [
  {
    id: 'biz_habibi_0',
    slug: 'habibi-bar',
    name: 'Habibi Bar Cantina',
    tagline: 'Coctelería de autor & botanas mexicanas',
    description: 'La auténtica experiencia de cantina moderna con cocteles artesanales y cocina de barrio.',
    category: 'Bar & Cantina',
    logoUrl: '🍸',
    coverUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=80',
    phone: '+52 55 7788 9900',
    whatsapp: '525577889900',
    instagram: 'habibi.cantina',
    address: 'Calle Orizaba 42, Roma Norte',
    city: 'Ciudad de México',
    pinCode: '1234',
    currency: '$',
    loyaltyConfig: {
      totalStamps: 6,
      rewardTitle: '1 Trago Signature o Mezcal Gratis',
      rewardDescription: 'Válido en tu 7ma visita para cualquier coctel de la casa o mezcal artesanal.',
      stampIcon: 'glass',
      cardBgColor: '#0a111a',
      cardTextColor: '#ffffff',
      accentColor: '#22c55e',
      terms: 'Un sello por visita con consumo mínimo de $150.',
      allowCashback: false,
    },
    googleReviews: {
      googleReviewUrl: 'https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY7',
      googleRating: 4.9,
      totalReviews: 142,
      rewardForReview: '+1 Sello extra en tu tarjeta',
      smartFilterEnabled: true,
    },
    menuPdfUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80',
    menuPdfName: 'Habibi_Carta_Cantina.pdf',
    menuDisplayMode: 'both',
  },
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
    googleReviews: {
      googleReviewUrl: 'https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4',
      googleRating: 4.9,
      totalReviews: 248,
      rewardForReview: '+1 Sello extra de regalo',
      smartFilterEnabled: true,
    },
    menuPdfUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80',
    menuPdfName: 'Carta_Aroma_Cafe_Oficial.pdf',
    menuDisplayMode: 'both',
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
    googleReviews: {
      googleReviewUrl: 'https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY5',
      googleRating: 4.8,
      totalReviews: 189,
      rewardForReview: '+1 Sello extra de regalo',
      smartFilterEnabled: true,
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
    googleReviews: {
      googleReviewUrl: 'https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY6',
      googleRating: 4.9,
      totalReviews: 312,
      rewardForReview: '+1 Sello extra de regalo',
      smartFilterEnabled: true,
    },
  },
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust_habibi_1',
    businessId: 'biz_habibi_0',
    name: 'Jaike Romero',
    phone: '+52 55 4422 1100',
    email: 'jaikeromero@email.com',
    qrCodeToken: 'CARD-HABIBI-1029',
    currentStamps: 4,
    totalVisits: 4,
    rewardsEarned: 0,
    rewardsRedeemed: 0,
    points: 80,
    totalSpent: 620,
    tier: 'vip',
    walletPassType: 'apple',
    notes: 'Cliente VIP • Le gusta la coctelería signature',
    createdAt: '2026-10-20T12:00:00Z',
    lastVisitAt: '2026-11-01T20:30:00Z',
  },
  {
    id: 'cust_habibi_2',
    businessId: 'biz_habibi_0',
    name: 'Lucía Méndez',
    phone: '+52 55 6677 8899',
    email: 'lucia.mendez@email.com',
    qrCodeToken: 'CARD-HABIBI-4491',
    currentStamps: 6,
    totalVisits: 6,
    rewardsEarned: 1,
    rewardsRedeemed: 1,
    points: 120,
    totalSpent: 940,
    tier: 'vip',
    walletPassType: 'apple',
    notes: 'Frecuenta los jueves de 2x1',
    createdAt: '2026-10-15T18:30:00Z',
    lastVisitAt: '2026-11-01T21:15:00Z',
  },
  {
    id: 'cust_habibi_3',
    businessId: 'biz_habibi_0',
    name: 'Rodrigo Garza',
    phone: '+52 55 3344 5566',
    email: 'r.garza@email.com',
    qrCodeToken: 'CARD-HABIBI-8820',
    currentStamps: 3,
    totalVisits: 3,
    rewardsEarned: 0,
    rewardsRedeemed: 0,
    points: 60,
    totalSpent: 480,
    tier: 'frecuente',
    walletPassType: 'google',
    notes: 'Consumo habitual en barra',
    createdAt: '2026-10-28T19:00:00Z',
    lastVisitAt: '2026-11-01T22:05:00Z',
  },
  {
    id: 'cust_habibi_4',
    businessId: 'biz_habibi_0',
    name: 'Valeria Morales',
    phone: '+52 55 7788 4411',
    email: 'valeria.m@email.com',
    qrCodeToken: 'CARD-HABIBI-9921',
    currentStamps: 2,
    totalVisits: 2,
    rewardsEarned: 0,
    rewardsRedeemed: 0,
    points: 40,
    totalSpent: 290,
    tier: 'nuevo',
    walletPassType: 'apple',
    notes: 'Primer registro por código QR en mesa',
    createdAt: '2026-10-30T14:20:00Z',
    lastVisitAt: '2026-11-02T01:30:00Z',
  },
  {
    id: 'cust_habibi_5',
    businessId: 'biz_habibi_0',
    name: 'Daniel Sotomayor',
    phone: '+52 55 9911 3322',
    email: 'daniel.soto@email.com',
    qrCodeToken: 'CARD-HABIBI-6612',
    currentStamps: 5,
    totalVisits: 8,
    rewardsEarned: 1,
    rewardsRedeemed: 0,
    points: 150,
    totalSpent: 1250,
    tier: 'vip',
    walletPassType: 'apple',
    notes: 'Cliente de alto ticket • Recomendado',
    createdAt: '2026-10-10T16:00:00Z',
    lastVisitAt: '2026-11-01T23:00:00Z',
  },
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
    totalSpent: 860,
    tier: 'vip',
    walletPassType: 'apple',
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
    totalSpent: 590,
    tier: 'vip',
    walletPassType: 'google',
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
    totalSpent: 195,
    tier: 'nuevo',
    walletPassType: 'apple',
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
    totalSpent: 1120,
    tier: 'vip',
    walletPassType: 'apple',
    createdAt: '2026-08-15T12:00:00Z',
    lastVisitAt: '2026-10-29T18:00:00Z',
  },
];

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  // Habibi Bar Cantina Menu
  {
    id: 'menu_habibi_1',
    businessId: 'biz_habibi_0',
    name: 'Mezcalita de la Casa (Maracuyá & Sal de Gusano)',
    description: 'Mezcal espadín artesanal, infusión de maracuyá fresco, toque de limón y escarchado con sal de gusano oaxaqueña.',
    price: 145,
    category: 'Coctelería Signature',
    imageUrl: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=400&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    available: true,
    featured: true,
  },
  {
    id: 'menu_habibi_2',
    businessId: 'biz_habibi_0',
    name: 'Tacos de Birria Doraditos (3 piezas)',
    description: 'Carne braseada en adobo tradicional con queso fundido, cebollita, cilantro y consomé caliente para chopear.',
    price: 160,
    category: 'Botanas de Cantina',
    imageUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=400&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    available: true,
    featured: true,
  },
  {
    id: 'menu_habibi_3',
    businessId: 'biz_habibi_0',
    name: 'Guacamole Rústico con Totopos & Chicharrón',
    description: 'Aguacate hass machacado con pico de gallo, queso cotija y crujiente de chicharrón de cerdo.',
    price: 110,
    category: 'Botanas de Cantina',
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80',
    available: true,
    featured: false,
  },
  {
    id: 'menu_habibi_4',
    businessId: 'biz_habibi_0',
    name: 'Paloma Brava con Tequila Reposado',
    description: 'Tequila 100% agave, jugo de toronja natural, refresco de toronja artesanal y rim de sal rosa.',
    price: 135,
    category: 'Coctelería Signature',
    imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=400&q=80',
    available: true,
    featured: false,
  },
  // Aroma Cafe Menu
  {
    id: 'menu_1',
    businessId: 'biz_aroma_1',
    name: 'Flat White de Origen (Chiapas)',
    description: 'Doble ristretto con leche cremada y microespuma sedosa.',
    price: 65,
    category: 'Café de Especialidad',
    imageUrl: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=400&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
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
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
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

export const INITIAL_SALES: SaleRecord[] = [
  {
    id: 'sale_h_1',
    businessId: 'biz_habibi_0',
    customerId: 'cust_habibi_1',
    customerName: 'Jaike Romero',
    customerPhone: '+52 55 4422 1100',
    itemsSummary: '2x Mezcalita Signature, 1x Tacos de Birria',
    amount: 450,
    paymentMethod: 'card',
    stampsAwarded: 2,
    status: 'completed',
    staffName: 'Cajero 1',
    createdAt: '2026-11-01T20:30:00Z',
  },
  {
    id: 'sale_h_2',
    businessId: 'biz_habibi_0',
    customerId: 'cust_habibi_2',
    customerName: 'Lucía Méndez',
    customerPhone: '+52 55 6677 8899',
    itemsSummary: '1x Paloma Brava, 1x Botana Surtida Cantinera',
    amount: 320,
    paymentMethod: 'apple_pay',
    stampsAwarded: 1,
    status: 'completed',
    staffName: 'Cajero 2',
    createdAt: '2026-11-01T21:15:00Z',
  },
  {
    id: 'sale_h_3',
    businessId: 'biz_habibi_0',
    customerId: 'cust_habibi_3',
    customerName: 'Rodrigo Garza',
    customerPhone: '+52 55 3344 5566',
    itemsSummary: '3x Mezcal Artesanal, 2x Tacos de Birria',
    amount: 580,
    paymentMethod: 'card',
    stampsAwarded: 2,
    status: 'completed',
    staffName: 'Cajero 1',
    createdAt: '2026-11-01T22:05:00Z',
  },
  {
    id: 'sale_h_4',
    businessId: 'biz_habibi_0',
    customerId: 'cust_habibi_5',
    customerName: 'Daniel Sotomayor',
    customerPhone: '+52 55 9911 3322',
    itemsSummary: '4x Mezcalita de la Casa, 3x Botanas Cantina',
    amount: 790,
    paymentMethod: 'apple_pay',
    stampsAwarded: 2,
    status: 'completed',
    staffName: 'Cajero 1',
    createdAt: '2026-11-01T23:00:00Z',
  },
  {
    id: 'sale_h_5',
    businessId: 'biz_habibi_0',
    customerId: 'cust_habibi_4',
    customerName: 'Valeria Morales',
    customerPhone: '+52 55 7788 4411',
    itemsSummary: '1x Mezcalita Maracuyá, 1x Guacamole',
    amount: 290,
    paymentMethod: 'card',
    stampsAwarded: 1,
    status: 'completed',
    staffName: 'Cajero 2',
    createdAt: '2026-11-02T01:30:00Z',
  },
  {
    id: 'sale_h_6',
    businessId: 'biz_habibi_0',
    customerName: 'Comensal Mesa 4 (Mostrador)',
    itemsSummary: '2x Cerveza Artesanal, 1x Tacos Dorados',
    amount: 210,
    paymentMethod: 'cash',
    stampsAwarded: 1,
    status: 'completed',
    staffName: 'Cajero 2',
    createdAt: '2026-11-02T02:15:00Z',
  },
  {
    id: 'sale_a_1',
    businessId: 'biz_aroma_1',
    customerId: 'cust_1',
    customerName: 'Carlos Mendoza',
    customerPhone: '+52 55 8899 1122',
    itemsSummary: '1x Flat White Chiapas, 1x Avocado Toast',
    amount: 200,
    paymentMethod: 'card',
    stampsAwarded: 1,
    status: 'completed',
    staffName: 'Barista 1',
    createdAt: '2026-10-31T09:15:00Z',
  },
  {
    id: 'sale_a_2',
    businessId: 'biz_aroma_1',
    customerId: 'cust_2',
    customerName: 'Sofia Valenzuela',
    customerPhone: '+52 55 7766 5544',
    itemsSummary: '1x Cold Brew Nitro, 1x Croissant Almendras',
    amount: 135,
    paymentMethod: 'apple_pay',
    stampsAwarded: 1,
    status: 'completed',
    staffName: 'Barista 1',
    createdAt: '2026-11-01T11:00:00Z',
  },
];

export const INITIAL_TRANSACTIONS: StampTransaction[] = [
  {
    id: 'tx_h_1',
    businessId: 'biz_habibi_0',
    customerId: 'cust_habibi_1',
    customerName: 'Jaike Romero',
    type: 'STAMP_ADDED',
    stampsChanged: 2,
    notes: 'Consumo $450 • 2 cocteles de la casa',
    staffName: 'Cajero 1',
    createdAt: '2026-11-01T20:30:00Z',
  },
  {
    id: 'tx_h_2',
    businessId: 'biz_habibi_0',
    customerId: 'cust_habibi_2',
    customerName: 'Lucía Méndez',
    type: 'STAMP_ADDED',
    stampsChanged: 1,
    notes: 'Visita #6 registrada • Tarjeta completada',
    staffName: 'Cajero 2',
    createdAt: '2026-11-01T21:15:00Z',
  },
  {
    id: 'tx_h_3',
    businessId: 'biz_habibi_0',
    customerId: 'cust_habibi_2',
    customerName: 'Lucía Méndez',
    type: 'REWARD_REDEEMED',
    stampsChanged: -6,
    notes: 'Canjeó premio: 1 Trago Signature Gratis 🎁',
    staffName: 'Cajero 2',
    createdAt: '2026-11-01T21:20:00Z',
  },
  {
    id: 'tx_h_4',
    businessId: 'biz_habibi_0',
    customerId: 'cust_habibi_3',
    customerName: 'Rodrigo Garza',
    type: 'STAMP_ADDED',
    stampsChanged: 2,
    notes: 'Consumo $580 • Barra central',
    staffName: 'Cajero 1',
    createdAt: '2026-11-01T22:05:00Z',
  },
  {
    id: 'tx_h_5',
    businessId: 'biz_habibi_0',
    customerId: 'cust_habibi_4',
    customerName: 'Valeria Morales',
    type: 'STAMP_ADDED',
    stampsChanged: 1,
    notes: 'Activación Apple Wallet + Sello de bienvenida',
    staffName: 'Sistema Wallet',
    createdAt: '2026-11-02T01:30:00Z',
  },
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

export const INITIAL_MERCHANT_CLIENTS: MerchantClientAccount[] = [
  {
    id: 'merch_habibi_0',
    businessId: 'biz_habibi_0',
    businessName: 'Habibi Bar Cantina',
    ownerName: 'Jaike Romero',
    email: 'jaikeromero@gmail.com',
    phone: '+52 55 7788 9900',
    city: 'Ciudad de México',
    category: 'Bar & Cantina',
    status: 'active',
    planId: 'pro',
    planName: 'Plan Pro Markethers',
    billingCycle: 'annual',
    monthlyPrice: 32,
    totalPaid: 384,
    amountDue: 0,
    nextBillingDate: '2026-11-20',
    createdAt: '2026-01-15T10:00:00Z',
    lastLoginAt: '2026-11-02T05:30:00Z',
    cardLast4: '4242',
    cardBrand: 'Visa',
    notes: 'Cuenta del fundador / Sede principal',
  },
  {
    id: 'merch_aroma_1',
    businessId: 'biz_aroma_1',
    businessName: 'Café Aroma Especialidad',
    ownerName: 'Andrea Valenzuela',
    email: 'andrea.valenzuela@cafearoma.com',
    phone: '+52 55 1234 5678',
    city: 'Guadalajara, JAL',
    category: 'Cafetería & Brunch',
    status: 'active',
    planId: 'starter',
    planName: 'Plan Despegue',
    billingCycle: 'monthly',
    monthlyPrice: 29,
    totalPaid: 232,
    amountDue: 0,
    nextBillingDate: '2026-11-15',
    createdAt: '2026-03-12T14:20:00Z',
    lastLoginAt: '2026-11-01T18:10:00Z',
    cardLast4: '8812',
    cardBrand: 'Mastercard',
    notes: 'Al día en sus pagos mensuales. Alto volumen de sellos Wallet.',
  },
  {
    id: 'merch_barber_2',
    businessId: 'biz_barber_2',
    businessName: 'Barber King Studio',
    ownerName: 'Mateo Delgado',
    email: 'm.delgado@barberking.mx',
    phone: '+52 55 9876 5432',
    city: 'Monterrey, NL',
    category: 'Barbería & Grooming',
    status: 'past_due',
    planId: 'pro',
    planName: 'Plan Pro Markethers',
    billingCycle: 'monthly',
    monthlyPrice: 49,
    totalPaid: 147,
    amountDue: 49, // Lo que debe
    nextBillingDate: '2026-10-28 (Vencido)',
    createdAt: '2026-07-01T12:00:00Z',
    lastLoginAt: '2026-10-25T11:45:00Z',
    cardLast4: '3190',
    cardBrand: 'Visa',
    notes: 'Pago mensual pendiente. Reintentando cobro automático.',
  },
  {
    id: 'merch_burger_3',
    businessId: 'biz_burger_3',
    businessName: 'Smash Burger Co.',
    ownerName: 'Roberto Lozano',
    email: 'roberto@smashburger.co',
    phone: '+52 55 5566 7788',
    city: 'Querétaro, QRO',
    category: 'Restaurante & Hamburguesas',
    status: 'cancelled',
    planId: 'starter',
    planName: 'Plan Despegue',
    billingCycle: 'monthly',
    monthlyPrice: 29,
    totalPaid: 87,
    amountDue: 0,
    nextBillingDate: 'Cancelado',
    createdAt: '2026-05-10T16:00:00Z',
    lastLoginAt: '2026-08-15T09:30:00Z',
    cardLast4: '1092',
    cardBrand: 'Visa',
    notes: 'Cuenta suspendida por solicitud del cliente.',
  },
  {
    id: 'merch_paleta_4',
    businessId: 'biz_paleta_4',
    businessName: 'La Michoacana Real',
    ownerName: 'Carmen Gutiérrez',
    email: 'carmen@paleteriamichoacana.com',
    phone: '+52 55 2233 4455',
    city: 'Puebla, PUE',
    category: 'Paletería & Heladería',
    status: 'trialing',
    planId: 'pro',
    planName: 'Plan Pro Markethers',
    billingCycle: 'annual',
    monthlyPrice: 32,
    totalPaid: 0,
    amountDue: 0,
    nextBillingDate: '2026-11-16 (14 días prueba)',
    createdAt: '2026-11-02T04:15:00Z',
    lastLoginAt: '2026-11-02T05:10:00Z',
    cardLast4: '4242',
    cardBrand: 'Visa',
    notes: 'Prueba gratuita de 14 días activa. Tarjeta verificada.',
  },
];

// Helper to get global state in server memory or initialized state
class DataStore {
  private businesses: Business[] = [...INITIAL_BUSINESSES];
  private customers: Customer[] = [...INITIAL_CUSTOMERS];
  private menuItems: MenuItem[] = [...INITIAL_MENU_ITEMS];
  private transactions: StampTransaction[] = [...INITIAL_TRANSACTIONS];
  private sales: SaleRecord[] = [...INITIAL_SALES];

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

  updateBusiness(id: string, updates: Partial<Business>): Business | null {
    const index = this.businesses.findIndex(b => b.id === id);
    if (index === -1) return null;
    this.businesses[index] = { ...this.businesses[index], ...updates };
    return this.businesses[index];
  }

  updateBusinessConfig(businessId: string, updates: Partial<Business>): Business | null {
    const idx = this.businesses.findIndex(b => b.id === businessId);
    if (idx === -1) return null;
    this.businesses[idx] = { ...this.businesses[idx], ...updates };
    return this.businesses[idx];
  }

  addBusiness(business: Business): Business {
    this.businesses.unshift(business);
    return business;
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

  // Sales
  getSalesByBusiness(businessId: string): SaleRecord[] {
    return this.sales.filter(s => s.businessId === businessId);
  }

  addSale(sale: Omit<SaleRecord, 'id' | 'createdAt'>): SaleRecord {
    const newSale: SaleRecord = {
      ...sale,
      id: `sale_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.sales.unshift(newSale);
    return newSale;
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
