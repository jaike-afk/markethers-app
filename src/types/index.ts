export type StampIconType = 'coffee' | 'star' | 'gift' | 'heart' | 'scissors' | 'burger' | 'pizza' | 'cupcake';

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
  createdAt: string;
  lastVisitAt: string;
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
  available: boolean;
  featured?: boolean;
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
  notes?: string;
}
