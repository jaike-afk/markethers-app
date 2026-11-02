export type StampIconType = 'coffee' | 'star' | 'gift' | 'heart' | 'scissors' | 'burger' | 'pizza' | 'cupcake' | 'glass';

export interface LoyaltyCardConfig {
  totalStamps: number;
  rewardTitle: string;
  rewardDescription: string;
  stampIcon: StampIconType;
  cardBgColor: string;
  cardTextColor: string;
  accentColor: string;
  terms: string;
  allowCashback?: boolean;
  pointsRatio?: number; // e.g. 1 USD = 1 pt
}

export interface GoogleReviewConfig {
  googleReviewUrl: string;
  googleRating: number;
  totalReviews: number;
  rewardForReview?: string;
  smartFilterEnabled?: boolean; // 4-5 stars to Google, 1-3 stars to internal private feedback
}

export interface Business {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  logoUrl: string;
  coverUrl: string;
  phone: string;
  whatsapp: string;
  instagram: string;
  address: string;
  city: string;
  pinCode: string; // Cashier access PIN (e.g. 1234)
  currency: string;
  loyaltyConfig: LoyaltyCardConfig;
  googleReviews: GoogleReviewConfig;
  menuPdfUrl?: string;
  menuPdfName?: string;
  menuDisplayMode?: 'interactive' | 'pdf' | 'both';
}

export interface Customer {
  id: string;
  businessId: string;
  name: string;
  phone: string;
  email?: string;
  qrCodeToken: string;
  currentStamps: number;
  totalVisits: number;
  rewardsEarned: number;
  rewardsRedeemed: number;
  points: number;
  totalSpent?: number;
  tier?: 'vip' | 'frecuente' | 'nuevo';
  walletPassType?: 'apple' | 'google';
  notes?: string;
  createdAt: string;
  lastVisitAt: string;
}

export interface SaleRecord {
  id: string;
  businessId: string;
  customerId?: string;
  customerName: string;
  customerPhone?: string;
  itemsSummary: string;
  amount: number;
  paymentMethod: 'cash' | 'card' | 'apple_pay' | 'transfer';
  stampsAwarded: number;
  status: 'completed' | 'refunded';
  notes?: string;
  staffName: string;
  createdAt: string;
}

export interface StampTransaction {
  id: string;
  businessId: string;
  customerId: string;
  customerName: string;
  type: 'STAMP_ADDED' | 'STAMP_REMOVED' | 'REWARD_REDEEMED' | 'POINTS_ADDED';
  stampsChanged: number;
  pointsChanged?: number;
  notes?: string;
  staffName: string;
  createdAt: string;
}

export interface MenuItem {
  id: string;
  businessId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  videoUrl?: string;
  available: boolean;
  featured?: boolean;
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
  notes?: string;
}
