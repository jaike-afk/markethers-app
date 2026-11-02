'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { INITIAL_BUSINESSES, INITIAL_CUSTOMERS, INITIAL_MENU_ITEMS, INITIAL_TRANSACTIONS, INITIAL_SALES } from '@/lib/store';
import { Business, Customer, MenuItem, StampTransaction, SaleRecord } from '@/types';
import { getCurrentUser, logoutUser, UserAccount, isOwnerUser } from '@/lib/auth';
import { AppleWalletCard } from '@/components/AppleWalletCard';
import { CameraScanner } from '@/components/CameraScanner';
import { CounterQrModal } from '@/components/CounterQrModal';
import { GoogleReviewCard } from '@/components/GoogleReviewCard';
import { MenuManager } from '@/components/MenuManager';
import {
  LayoutDashboard,
  CreditCard,
  Users,
  QrCode,
  History,
  Star,
  ExternalLink,
  Smartphone,
  Play,
  Search,
  MessageCircle,
  LogOut,
  ChevronDown,
  Gift,
  Plus,
  CheckCircle2,
  X,
  FileText,
  Utensils,
  BookOpen,
  Share2,
  Menu,
  ShieldCheck,
  TrendingUp,
  Heart,
  Eye,
  EyeOff,
  Bell,
  Lock,
  ShoppingBag,
  DollarSign,
  Repeat,
  Sparkles,
  Ticket,
  Send,
  Save,
  Check,
  Store,
  HelpCircle,
  ArrowRight,
  Download,
  Phone,
  Zap,
  Calendar,
  Receipt,
  CircleDollarSign,
  BarChart3,
  Filter,
  ArrowUpRight,
  Wallet,
  Printer,
} from 'lucide-react';

export default function MarkethersAppPortal() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [authChecking, setAuthChecking] = useState(true);
  const isOwner = isOwnerUser(currentUser);
  const [copiedLink, setCopiedLink] = useState(false);

  const [businesses, setBusinesses] = useState<Business[]>(INITIAL_BUSINESSES);
  const [selectedBusinessId, setSelectedBusinessId] = useState<string>(INITIAL_BUSINESSES[0].id);

  const handleCopyStoreLink = () => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/${business.slug}`;
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  // Active navigation section
  const [activeSection, setActiveSection] = useState<
    | 'panel'
    | 'ventas'
    | 'tarjetas'
    | 'clientes'
    | 'escaner'
    | 'historial'
    | 'push'
    | 'resenas'
    | 'qr_menu'
    | 'qr_mostrador'
    | 'qr_descuento'
    | 'qr_resenas'
    | 'qr_infolink'
    | 'menu'
    | 'menu_libro'
    | 'infolink'
    | 'facturacion'
  >('panel');

  // Customer, Sales & Menu Database State (persisted in localStorage)
  const [allCustomers, setAllCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [allSales, setAllSales] = useState<SaleRecord[]>(INITIAL_SALES);
  const [allTransactions, setAllTransactions] = useState<StampTransaction[]>(INITIAL_TRANSACTIONS);
  const [allMenuItems, setAllMenuItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);

  // Period & Filter state for Executive Dashboard
  const [dashboardPeriod, setDashboardPeriod] = useState<'today' | '7d' | '30d' | 'all'>('today');
  const [movementFilter, setMovementFilter] = useState<'all' | 'sales' | 'stamps' | 'rewards'>('all');
  const [customerFilterTier, setCustomerFilterTier] = useState<'all' | 'vip' | 'frecuente' | 'nuevo'>('all');
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');

  // Modals for Owner actions
  const [isRecordSaleModalOpen, setIsRecordSaleModalOpen] = useState(false);
  const [isNewCustomerModalOpen, setIsNewCustomerModalOpen] = useState(false);
  const [selectedCustomerDetail, setSelectedCustomerDetail] = useState<Customer | null>(null);

  // Record Sale Form state
  const [saleCustomerId, setSaleCustomerId] = useState('');
  const [saleCustomerName, setSaleCustomerName] = useState('');
  const [saleCustomerPhone, setSaleCustomerPhone] = useState('');
  const [saleAmount, setSaleAmount] = useState('');
  const [saleItemsSummary, setSaleItemsSummary] = useState('');
  const [salePaymentMethod, setSalePaymentMethod] = useState<'card' | 'cash' | 'apple_pay' | 'transfer'>('card');
  const [saleStampsToAward, setSaleStampsToAward] = useState(1);

  // New Customer Form state
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerPhone, setNewCustomerPhone] = useState('');
  const [newCustomerEmail, setNewCustomerEmail] = useState('');
  const [newCustomerInitialStamps, setNewCustomerInitialStamps] = useState(1);
  const [newCustomerWalletType, setNewCustomerWalletType] = useState<'apple' | 'google'>('apple');
  const [newCustomerNotes, setNewCustomerNotes] = useState('');
  const [currentTimestamp, setCurrentTimestamp] = useState<number>(0);

  // Sidebar collapsible groups
  const [fidelizacionOpen, setFidelizacionOpen] = useState(true);
  const [marketingOpen, setMarketingOpen] = useState(true);
  const [menuDigitalOpen, setMenuDigitalOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Stand / QR modal
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [qrModalType, setQrModalType] = useState<'counter' | 'menu' | 'discount' | 'reviews' | 'infolink'>('counter');

  // Interactive Modals
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [isWhatsappModalOpen, setIsWhatsappModalOpen] = useState(false);
  const [isSupportChatOpen, setIsSupportChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'bot' | 'user'; text: string }>>([
    { sender: 'bot', text: '¡Hola! Soy tu asistente de Markethers. ¿En qué puedo ayudarte hoy con tu menú, tarjetas Wallet o reseñas?' },
  ]);

  // Insight alerts dismissal state
  const [dismissWhatsappAlert, setDismissWhatsappAlert] = useState(false);
  const [dismissDraftAlert, setDismissDraftAlert] = useState(false);
  const [isSitePublished, setIsSitePublished] = useState(false);

  // Scanner state inside Panel
  const [scannedCustomer, setScannedCustomer] = useState<Customer | null>(null);
  const [scanMessage, setScanMessage] = useState<string | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);

  // Push notification form state
  const [pushTitle, setPushTitle] = useState('¡Jueves 2x1 en Habibi Cantina! 🍹');
  const [pushMessage, setPushMessage] = useState('Ven hoy con tu tarjeta de lealtad y recibe doble sello en coctelería signature.');
  const [pushSentSuccess, setPushSentSuccess] = useState(false);

  const handleExportCSV = () => {
    const headers = ['Nombre', 'Telefono', 'Email', 'Codigo Wallet', 'Wallet', 'Nivel', 'Total Gastado ($)', 'Sellos Actuales', 'Total Visitas', 'Fecha Registro', 'Notas'];
    const rows = customers.map(c => [
      `"${c.name}"`,
      `"${c.phone}"`,
      `"${c.email || ''}"`,
      `"${c.qrCodeToken}"`,
      `"${c.walletPassType === 'google' ? 'Google Wallet' : 'Apple Wallet'}"`,
      `"${(c.tier || 'nuevo').toUpperCase()}"`,
      c.totalSpent || 0,
      c.currentStamps,
      c.totalVisits,
      `"${c.createdAt || new Date().toISOString()}"`,
      `"${c.notes || ''}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `base_datos_clientes_${business.slug}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Subscription & Payment state (Stripe & Gateway)
  const [subscription, setSubscription] = useState({
    planId: 'pro' as 'starter' | 'pro' | 'franchise',
    planName: 'Plan Pro Markethers',
    billingCycle: 'annual' as 'monthly' | 'annual',
    price: 32,
    status: 'trialing',
    trialDaysLeft: 14,
    trialEndsAt: '16 Nov 2026',
    cardBrand: 'Visa',
    cardLast4: '4242',
    cardHolder: 'Jaike Romero',
    gateway: 'stripe' as 'stripe' | 'mercadopago',
  });
  const [isUpdateCardModalOpen, setIsUpdateCardModalOpen] = useState(false);
  const [newCardNumber, setNewCardNumber] = useState('');
  const [newCardExp, setNewCardExp] = useState('');
  const [newCardCvc, setNewCardCvc] = useState('');
  const [newCardHolder, setNewCardHolder] = useState('Jaike Romero');
  const [newCardZip, setNewCardZip] = useState('06700');
  const [planChangeToast, setPlanChangeToast] = useState<string | null>(null);

  // Sync with localStorage & authenticate session on client load
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const user = getCurrentUser();
      if (!user) {
        // Redirigir a login si no hay sesión activa
        router.push('/login');
        return;
      }
      setCurrentUser(user);
      setAuthChecking(false);

      const customBiz: Business[] = JSON.parse(localStorage.getItem('markethers_custom_businesses') || '[]');
      const allAvailableBiz: Business[] = [...customBiz, ...INITIAL_BUSINESSES];
      const isSuperAdmin = user.email.toLowerCase() === 'jaikeromero@gmail.com';

      if (isSuperAdmin) {
        setBusinesses(allAvailableBiz);
        const activeBizId = localStorage.getItem('markethers_active_business_id') || user.businessId || allAvailableBiz[0].id;
        if (allAvailableBiz.some((b: Business) => b.id === activeBizId)) {
          setSelectedBusinessId(activeBizId);
        } else {
          setSelectedBusinessId(allAvailableBiz[0].id);
        }
      } else {
        // Strict merchant isolation: only ever view their own business
        const userBiz = allAvailableBiz.find((b: Business) => b.id === user.businessId) || customBiz[0] || INITIAL_BUSINESSES[0];
        setBusinesses([userBiz]);
        setSelectedBusinessId(userBiz.id);
        localStorage.setItem('markethers_active_business_id', userBiz.id);
      }

      const savedSub = localStorage.getItem('markethers_subscription');
      if (savedSub) {
        const parsed = JSON.parse(savedSub);
        setSubscription(prev => ({ ...prev, ...parsed }));
      }

      // Load or initialize customers DB
      const storedCustomers = localStorage.getItem('markethers_customers_db');
      if (storedCustomers) {
        try {
          setAllCustomers(JSON.parse(storedCustomers));
        } catch {
          setAllCustomers(INITIAL_CUSTOMERS);
        }
      } else {
        localStorage.setItem('markethers_customers_db', JSON.stringify(INITIAL_CUSTOMERS));
      }

      // Load or initialize sales DB
      const storedSales = localStorage.getItem('markethers_sales_db');
      if (storedSales) {
        try {
          setAllSales(JSON.parse(storedSales));
        } catch {
          setAllSales(INITIAL_SALES);
        }
      } else {
        localStorage.setItem('markethers_sales_db', JSON.stringify(INITIAL_SALES));
      }

      // Load or initialize transactions DB
      const storedTx = localStorage.getItem('markethers_transactions_db');
      if (storedTx) {
        try {
          setAllTransactions(JSON.parse(storedTx));
        } catch {
          setAllTransactions(INITIAL_TRANSACTIONS);
        }
      } else {
        localStorage.setItem('markethers_transactions_db', JSON.stringify(INITIAL_TRANSACTIONS));
      }

      // Load or initialize menu items DB
      const storedMenu = localStorage.getItem('markethers_menu_items_db');
      if (storedMenu) {
        try {
          setAllMenuItems(JSON.parse(storedMenu));
        } catch {
          setAllMenuItems(INITIAL_MENU_ITEMS);
        }
      } else {
        localStorage.setItem('markethers_menu_items_db', JSON.stringify(INITIAL_MENU_ITEMS));
      }

      setCurrentTimestamp(Date.now());
    } catch (e) {
      console.error(e);
      setAuthChecking(false);
    }
  }, [router]);

  const handleSelectPlan = (planId: 'starter' | 'pro' | 'franchise') => {
    const planDetails = {
      starter: { name: 'Plan Despegue', priceMonthly: 29, priceAnnual: 19 },
      pro: { name: 'Plan Pro Markethers', priceMonthly: 49, priceAnnual: 32 },
      franchise: { name: 'Plan Multi-Sucursal', priceMonthly: 99, priceAnnual: 65 },
    }[planId];

    const newPrice = subscription.billingCycle === 'annual' ? planDetails.priceAnnual : planDetails.priceMonthly;
    const updated = {
      ...subscription,
      planId,
      planName: planDetails.name,
      price: newPrice,
    };
    setSubscription(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('markethers_subscription', JSON.stringify(updated));
    }
    setPlanChangeToast(`¡Plan cambiado a "${planDetails.name}" exitosamente!`);
    setTimeout(() => setPlanChangeToast(null), 4000);
  };

  const handleToggleBillingCycle = () => {
    const nextCycle: 'monthly' | 'annual' = subscription.billingCycle === 'annual' ? 'monthly' : 'annual';
    const planDetails = {
      starter: { priceMonthly: 29, priceAnnual: 19 },
      pro: { priceMonthly: 49, priceAnnual: 32 },
      franchise: { priceMonthly: 99, priceAnnual: 65 },
    }[subscription.planId];
    const newPrice = nextCycle === 'annual' ? planDetails.priceAnnual : planDetails.priceMonthly;
    const updated: typeof subscription = {
      ...subscription,
      billingCycle: nextCycle,
      price: newPrice,
    };
    setSubscription(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('markethers_subscription', JSON.stringify(updated));
    }
    setPlanChangeToast(`Facturación cambiada a ${nextCycle === 'annual' ? 'Anual (Ahorras 35%)' : 'Mensual'}`);
    setTimeout(() => setPlanChangeToast(null), 4000);
  };

  const handleSaveCard = (e: React.FormEvent) => {
    e.preventDefault();
    const last4 = newCardNumber.replace(/\D/g, '').slice(-4) || '4242';
    const updated = {
      ...subscription,
      cardLast4: last4,
      cardHolder: newCardHolder || subscription.cardHolder,
      cardBrand: last4.startsWith('5') ? 'Mastercard' : 'Visa',
    };
    setSubscription(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('markethers_subscription', JSON.stringify(updated));
    }
    setIsUpdateCardModalOpen(false);
    setPlanChangeToast('¡Método de pago verificado y actualizado con Stripe!');
    setTimeout(() => setPlanChangeToast(null), 4000);
  };

  const handleDownloadReceipt = (receiptId: string, amount: string, date: string) => {
    const receiptText = `=====================================================
MARKETHERS OS - COMPROBANTE OFICIAL DE FACTURACIÓN
=====================================================
Recibo / Invoice ID: ${receiptId}
Fecha de Emisión: ${date}
Establecimiento: ${business.name}
Titular de Cuenta: ${subscription.cardHolder}
Método de Pago: ${subscription.cardBrand} terminada en •••• ${subscription.cardLast4}
Pasarela: Stripe Payments (Cifrado TLS 256-bit)

Concepto: Suscripción ${subscription.planName} (${subscription.billingCycle === 'annual' ? 'Pago Anual con Descuento' : 'Pago Mes a Mes'})
Total Abonado: ${amount}
Estado: PAGADO / ACTIVO
ID Transacción Stripe: ch_${Date.now().toString(36)}_${receiptId.toLowerCase()}

Garantía: 14 Días Blindada de Devolución
Contacto y Soporte: soporte@markethers.com
=====================================================`;
    const blob = new Blob([receiptText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Recibo_${receiptId}_Markethers.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Card Designer state
  const business = businesses.find(b => b.id === selectedBusinessId) || businesses[0];
  const [cardDesignerConfig, setCardDesignerConfig] = useState(business.loyaltyConfig);
  const [whatsappNumberInput, setWhatsappNumberInput] = useState(business.whatsapp || '525577889900');
  const [saveDesignerSuccess, setSaveDesignerSuccess] = useState(false);

  // Strictly isolate customers, sales, menuItems, and transactions per business ID (NO cross-tenant leaks)
  const customers = allCustomers.filter(c => c.businessId === business.id);
  const sales = allSales.filter(s => s.businessId === business.id);
  const menuItems = allMenuItems.filter(m => m.businessId === business.id);
  const transactions = allTransactions.filter(t => t.businessId === business.id);

  const handleUpdateMenuItems = (updatedItems: MenuItem[]) => {
    setAllMenuItems(prev => {
      const others = prev.filter(m => m.businessId !== business.id);
      const combined = [...others, ...updatedItems];
      if (typeof window !== 'undefined') {
        localStorage.setItem('markethers_menu_items_db', JSON.stringify(combined));
      }
      return combined;
    });
  };

  // Filtered by Executive Dashboard period
  const filteredSales = sales.filter(s => {
    if (dashboardPeriod === 'all' || !currentTimestamp) return true;
    const date = new Date(s.createdAt).getTime();
    if (dashboardPeriod === 'today') return currentTimestamp - date <= 24 * 60 * 60 * 1000;
    if (dashboardPeriod === '7d') return currentTimestamp - date <= 7 * 24 * 60 * 60 * 1000;
    if (dashboardPeriod === '30d') return currentTimestamp - date <= 30 * 24 * 60 * 60 * 1000;
    return true;
  });

  const filteredTransactions = transactions.filter(t => {
    if (dashboardPeriod === 'all' || !currentTimestamp) return true;
    const date = new Date(t.createdAt).getTime();
    if (dashboardPeriod === 'today') return currentTimestamp - date <= 24 * 60 * 60 * 1000;
    if (dashboardPeriod === '7d') return currentTimestamp - date <= 7 * 24 * 60 * 60 * 1000;
    if (dashboardPeriod === '30d') return currentTimestamp - date <= 30 * 24 * 60 * 60 * 1000;
    return true;
  });

  const totalSalesAmount = filteredSales.reduce((acc, s) => acc + s.amount, 0);
  const totalOrdersCount = filteredSales.length;
  const averageTicket = totalOrdersCount > 0 ? Math.round(totalSalesAmount / totalOrdersCount) : 0;
  const total30dSales = sales.reduce((acc, s) => acc + s.amount, 0);

  const totalStampsAwarded = filteredTransactions
    .filter(t => t.type === 'STAMP_ADDED')
    .reduce((acc, t) => acc + t.stampsChanged, 0);

  const totalRewardsRedeemed = filteredTransactions
    .filter(t => t.type === 'REWARD_REDEEMED')
    .length;

  const recurringCustomersCount = customers.filter(c => c.totalVisits >= 2).length;
  const appleWalletCount = customers.filter(c => c.walletPassType !== 'google').length;
  const googleWalletCount = customers.filter(c => c.walletPassType === 'google').length;

  const todayFormatted = 'domingo, 1 de noviembre';

  const handleOpenQr = (type: 'counter' | 'menu' | 'discount' | 'reviews' | 'infolink') => {
    setQrModalType(type);
    setIsQrModalOpen(true);
    setMobileSidebarOpen(false);
  };

  const handleScanCode = (token: string) => {
    setScanError(null);
    setScanMessage(null);
    const found = customers.find(c => c.qrCodeToken === token);
    if (found) {
      setScannedCustomer(found);
    } else {
      setScanError(`Código no encontrado: ${token}`);
    }
  };

  const handleAddStamp = (count: number = 1) => {
    if (!scannedCustomer) return;
    const target = business.loyaltyConfig.totalStamps;
    const updatedStamps = scannedCustomer.currentStamps + count;
    const unlocked = updatedStamps >= target;

    const updatedCustomer: Customer = {
      ...scannedCustomer,
      currentStamps: updatedStamps,
      totalVisits: scannedCustomer.totalVisits + 1,
      rewardsEarned: unlocked ? scannedCustomer.rewardsEarned + 1 : scannedCustomer.rewardsEarned,
      points: scannedCustomer.points + count * 10,
      lastVisitAt: new Date().toISOString(),
    };

    setScannedCustomer(updatedCustomer);
    const updatedList = allCustomers.map(c => (c.id === updatedCustomer.id ? updatedCustomer : c));
    setAllCustomers(updatedList);
    if (typeof window !== 'undefined') {
      localStorage.setItem('markethers_customers_db', JSON.stringify(updatedList));
    }

    const newTx: StampTransaction = {
      id: `tx_${Date.now()}`,
      businessId: business.id,
      customerId: updatedCustomer.id,
      customerName: updatedCustomer.name,
      type: 'STAMP_ADDED',
      stampsChanged: count,
      notes: unlocked ? '¡Completó tarjeta de sellos! 🎉' : `+${count} sello(s)`,
      staffName: currentUser?.name || 'Cajero',
      createdAt: new Date().toISOString(),
    };
    const updatedTxList = [newTx, ...allTransactions];
    setAllTransactions(updatedTxList);
    if (typeof window !== 'undefined') {
      localStorage.setItem('markethers_transactions_db', JSON.stringify(updatedTxList));
    }

    if (unlocked) {
      setScanMessage('¡Premio desbloqueado! 🎉');
    } else {
      setScanMessage(`+${count} Sello agregado.`);
    }
  };

  const handleRedeemReward = () => {
    if (!scannedCustomer) return;
    const target = business.loyaltyConfig.totalStamps;
    if (scannedCustomer.currentStamps < target) {
      setScanError(`Requiere ${target} sellos para canjear.`);
      return;
    }
    const updatedCustomer: Customer = {
      ...scannedCustomer,
      currentStamps: Math.max(0, scannedCustomer.currentStamps - target),
      rewardsRedeemed: scannedCustomer.rewardsRedeemed + 1,
      lastVisitAt: new Date().toISOString(),
    };
    setScannedCustomer(updatedCustomer);
    const updatedList = allCustomers.map(c => (c.id === updatedCustomer.id ? updatedCustomer : c));
    setAllCustomers(updatedList);
    if (typeof window !== 'undefined') {
      localStorage.setItem('markethers_customers_db', JSON.stringify(updatedList));
    }

    const newTx: StampTransaction = {
      id: `tx_${Date.now()}`,
      businessId: business.id,
      customerId: updatedCustomer.id,
      customerName: updatedCustomer.name,
      type: 'REWARD_REDEEMED',
      stampsChanged: -target,
      notes: `Canjeó premio: ${business.loyaltyConfig.rewardTitle || 'Premio'}`,
      staffName: currentUser?.name || 'Cajero',
      createdAt: new Date().toISOString(),
    };
    const updatedTxList = [newTx, ...allTransactions];
    setAllTransactions(updatedTxList);
    if (typeof window !== 'undefined') {
      localStorage.setItem('markethers_transactions_db', JSON.stringify(updatedTxList));
    }

    setScanMessage('¡Recompensa canjeada con éxito!');
  };

  const handleRecordSale = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(saleAmount) || 0;
    if (amountNum <= 0) return;

    let custName = saleCustomerName.trim() || 'Comensal en mostrador';
    let custId: string | undefined = undefined;
    let custPhone: string | undefined = saleCustomerPhone.trim();

    if (saleCustomerId) {
      const found = customers.find(c => c.id === saleCustomerId);
      if (found) {
        custName = found.name;
        custId = found.id;
        custPhone = found.phone;
      }
    }

    const stampsCount = Number(saleStampsToAward) || 1;

    const newSale: SaleRecord = {
      id: `sale_${Date.now()}`,
      businessId: business.id,
      customerId: custId,
      customerName: custName,
      customerPhone: custPhone,
      itemsSummary: saleItemsSummary.trim() || 'Consumo en establecimiento',
      amount: amountNum,
      paymentMethod: salePaymentMethod,
      stampsAwarded: stampsCount,
      status: 'completed',
      staffName: currentUser?.name || 'Cajero',
      createdAt: new Date().toISOString(),
    };

    const updatedSales = [newSale, ...allSales];
    setAllSales(updatedSales);
    if (typeof window !== 'undefined') {
      localStorage.setItem('markethers_sales_db', JSON.stringify(updatedSales));
    }

    if (custId) {
      const updatedCustomers = allCustomers.map(c => {
        if (c.id === custId) {
          const newStamps = c.currentStamps + stampsCount;
          const target = business.loyaltyConfig.totalStamps;
          const unlocked = newStamps >= target;
          return {
            ...c,
            currentStamps: newStamps,
            totalVisits: c.totalVisits + 1,
            totalSpent: (c.totalSpent || 0) + amountNum,
            rewardsEarned: unlocked ? c.rewardsEarned + 1 : c.rewardsEarned,
            points: c.points + stampsCount * 10,
            lastVisitAt: new Date().toISOString(),
          };
        }
        return c;
      });
      setAllCustomers(updatedCustomers);
      if (typeof window !== 'undefined') {
        localStorage.setItem('markethers_customers_db', JSON.stringify(updatedCustomers));
      }
    }

    const newTx: StampTransaction = {
      id: `tx_${Date.now()}`,
      businessId: business.id,
      customerId: custId || 'guest',
      customerName: custName,
      type: 'STAMP_ADDED',
      stampsChanged: stampsCount,
      notes: `Venta $${amountNum} (${saleItemsSummary || 'Consumo'}) • +${stampsCount} sello(s)`,
      staffName: currentUser?.name || 'Cajero',
      createdAt: new Date().toISOString(),
    };
    const updatedTxList = [newTx, ...allTransactions];
    setAllTransactions(updatedTxList);
    if (typeof window !== 'undefined') {
      localStorage.setItem('markethers_transactions_db', JSON.stringify(updatedTxList));
    }

    setSaleAmount('');
    setSaleItemsSummary('');
    setSaleCustomerName('');
    setSaleCustomerPhone('');
    setSaleCustomerId('');
    setIsRecordSaleModalOpen(false);
    setPlanChangeToast(`¡Venta de $${amountNum} y ${stampsCount} sello(s) registrados con éxito!`);
    setTimeout(() => setPlanChangeToast(null), 3500);
  };

  const handleAddNewCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomerName.trim() || !newCustomerPhone.trim()) return;

    const prefix = business.slug.substring(0, 5).toUpperCase();
    const rand = Math.floor(1000 + Math.random() * 9000);
    const token = `CARD-${prefix}-${rand}`;

    const newCust: Customer = {
      id: `cust_${Date.now()}`,
      businessId: business.id,
      name: newCustomerName.trim(),
      phone: newCustomerPhone.trim(),
      email: newCustomerEmail.trim() || undefined,
      qrCodeToken: token,
      currentStamps: Number(newCustomerInitialStamps) || 1,
      totalVisits: 1,
      rewardsEarned: 0,
      rewardsRedeemed: 0,
      points: 20,
      totalSpent: 0,
      tier: 'nuevo',
      walletPassType: newCustomerWalletType,
      notes: newCustomerNotes.trim() || undefined,
      createdAt: new Date().toISOString(),
      lastVisitAt: new Date().toISOString(),
    };

    const updated = [newCust, ...allCustomers];
    setAllCustomers(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('markethers_customers_db', JSON.stringify(updated));
    }

    const newTx: StampTransaction = {
      id: `tx_${Date.now()}`,
      businessId: business.id,
      customerId: newCust.id,
      customerName: newCust.name,
      type: 'STAMP_ADDED',
      stampsChanged: newCust.currentStamps,
      notes: 'Alta en base de datos • Sello de bienvenida',
      staffName: currentUser?.name || 'Administrador',
      createdAt: new Date().toISOString(),
    };
    const updatedTxList = [newTx, ...allTransactions];
    setAllTransactions(updatedTxList);
    if (typeof window !== 'undefined') {
      localStorage.setItem('markethers_transactions_db', JSON.stringify(updatedTxList));
    }

    setNewCustomerName('');
    setNewCustomerPhone('');
    setNewCustomerEmail('');
    setNewCustomerInitialStamps(1);
    setNewCustomerNotes('');
    setIsNewCustomerModalOpen(false);
    setPlanChangeToast(`¡Cliente "${newCust.name}" registrado en la base de datos!`);
    setTimeout(() => setPlanChangeToast(null), 3500);
  };

  const handleExportSalesCSV = () => {
    const headers = ['ID Venta', 'Fecha', 'Cliente', 'Telefono', 'Detalle Consumo', 'Monto ($)', 'Metodo Pago', 'Sellos Otorgados', 'Atendido Por'];
    const rows = sales.map(s => [
      `"${s.id}"`,
      `"${new Date(s.createdAt).toLocaleString('es-MX')}"`,
      `"${s.customerName}"`,
      `"${s.customerPhone || ''}"`,
      `"${s.itemsSummary}"`,
      s.amount,
      `"${s.paymentMethod}"`,
      s.stampsAwarded,
      `"${s.staffName}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ventas_y_movimientos_${business.slug}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSendPush = (e: React.FormEvent) => {
    e.preventDefault();
    setPushSentSuccess(true);
    setTimeout(() => setPushSentSuccess(false), 4000);
  };

  const handleSaveCardDesigner = (e: React.FormEvent) => {
    e.preventDefault();
    setBusinesses(prev =>
      prev.map(b => (b.id === business.id ? { ...b, loyaltyConfig: cardDesignerConfig } : b))
    );
    setSaveDesignerSuccess(true);
    setTimeout(() => setSaveDesignerSuccess(false), 3000);
  };

  const handleSaveWhatsapp = (e: React.FormEvent) => {
    e.preventDefault();
    setBusinesses(prev =>
      prev.map(b => (b.id === business.id ? { ...b, whatsapp: whatsappNumberInput } : b))
    );
    setIsWhatsappModalOpen(false);
    setDismissWhatsappAlert(true);
  };

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setChatInput('');
    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: 'Gracias por tu consulta. Tu equipo de soporte de Markethers está conectado 24/7 para ayudarte a maximizar tus clientes recurrentes.',
        },
      ]);
    }, 700);
  };

  if (authChecking) {
    return (
      <div className="min-h-screen bg-[#070c13] flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-400 via-teal-400 to-lime-400 flex items-center justify-center text-zinc-950 font-black shadow-xl shadow-emerald-500/20 mb-4 animate-pulse">
          <Sparkles className="w-6 h-6 text-zinc-950 fill-zinc-950" />
        </div>
        <p className="text-xs text-zinc-400 font-semibold tracking-wide">
          Verificando sesión segura...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex font-sans antialiased">
      {/* ========================================================= */}
      {/* 1. LEFT SIDEBAR (EXACT REPLICA FROM REFERENCE)             */}
      {/* ========================================================= */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0a111a] border-r border-slate-900 flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex-1 overflow-y-auto py-5 px-3 scrollbar-none">
          {/* Business Header with green origami icon */}
          <div className="flex items-center gap-3 px-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-400 to-lime-300 p-0.5 shadow-lg shadow-emerald-500/20 flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-[#0a111a] rounded-[10px] flex items-center justify-center text-xl">
                {business.logoUrl || '🍸'}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-white tracking-tight truncate leading-tight">
                  {business.name}
                </h2>
              </div>
              <span className="text-[11px] text-slate-400 font-medium block">
                {isOwner ? '👑 Modo Dueño Master' : 'Panel de control'}
              </span>
            </div>
          </div>

          {/* MAIN BUTTON: PANEL (GREEN PILL) */}
          <div className="mb-4">
            <button
              onClick={() => {
                setActiveSection('panel');
                setMobileSidebarOpen(false);
              }}
              className={`w-full py-2.5 px-3.5 rounded-xl flex items-center gap-2.5 text-xs font-bold transition-all shadow-md ${
                activeSection === 'panel'
                  ? 'bg-[#22c55e] text-[#0a111a] shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 stroke-[2.5]" />
              <span>{isOwner ? 'Panel Ejecutivo Dueño' : 'Panel de mi Negocio'}</span>
            </button>
          </div>

          {/* SECTION 1: TARJETAS DE FIDELIZACIÓN */}
          <div className="mb-4">
            <button
              onClick={() => setFidelizacionOpen(!fidelizacionOpen)}
              className="w-full flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-slate-400 px-2.5 py-1.5 hover:text-slate-200 transition-colors"
            >
              <span>Tarjetas de fidelización</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform ${
                  fidelizacionOpen ? 'rotate-0' : '-rotate-90'
                }`}
              />
            </button>

            {fidelizacionOpen && (
              <div className="space-y-0.5 mt-1">
                {/* Ventas & Movimientos ledger ONLY for Master Owner */}
                {isOwner && (
                  <button
                    onClick={() => {
                      setActiveSection('ventas');
                      setMobileSidebarOpen(false);
                    }}
                    className={`w-full py-2 px-3 rounded-xl flex items-center justify-between text-xs font-medium transition-colors ${
                      activeSection === 'ventas'
                        ? 'bg-slate-800 text-white font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900/40'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Receipt className="w-4 h-4 text-emerald-400" />
                      <span>Ventas & Movimientos</span>
                    </div>
                    <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded">
                      {sales.length}
                    </span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setActiveSection('clientes');
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full py-2 px-3 rounded-xl flex items-center justify-between text-xs font-medium transition-colors ${
                    activeSection === 'clientes'
                      ? 'bg-slate-800 text-white font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Users className="w-4 h-4 text-blue-400" />
                    <span>{isOwner ? 'Base de Clientes (CRM)' : 'Mis Comensales (Clientes)'}</span>
                  </div>
                  <span className="text-[10px] font-bold bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded">
                    {customers.length}
                  </span>
                </button>

                <button
                  onClick={() => {
                    setActiveSection('tarjetas');
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full py-2 px-3 rounded-xl flex items-center gap-2.5 text-xs font-medium transition-colors ${
                    activeSection === 'tarjetas'
                      ? 'bg-slate-800 text-white font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/40'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Tarjetas Wallet</span>
                </button>

                <button
                  onClick={() => {
                    setActiveSection('escaner');
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full py-2 px-3 rounded-xl flex items-center gap-2.5 text-xs font-medium transition-colors ${
                    activeSection === 'escaner'
                      ? 'bg-slate-800 text-white font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/40'
                  }`}
                >
                  <QrCode className="w-4 h-4" />
                  <span>Escáner</span>
                </button>

                <button
                  onClick={() => {
                    setActiveSection('historial');
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full py-2 px-3 rounded-xl flex items-center gap-2.5 text-xs font-medium transition-colors ${
                    activeSection === 'historial'
                      ? 'bg-slate-800 text-white font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/40'
                  }`}
                >
                  <History className="w-4 h-4" />
                  <span>Historial de sellos</span>
                </button>

                <button
                  onClick={() => {
                    setActiveSection('push');
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full py-2 px-3 rounded-xl flex items-center gap-2.5 text-xs font-medium transition-colors ${
                    activeSection === 'push'
                      ? 'bg-slate-800 text-white font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/40'
                  }`}
                >
                  <Bell className="w-4 h-4" />
                  <span>Push</span>
                </button>

                <button
                  onClick={() => {
                    setActiveSection('resenas');
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full py-2 px-3 rounded-xl flex items-center gap-2.5 text-xs font-medium transition-colors ${
                    activeSection === 'resenas'
                      ? 'bg-slate-800 text-white font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/40'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Reseña de Google</span>
                </button>
              </div>
            )}
          </div>

          {/* SECTION 2: MARKETING */}
          <div className="mb-4">
            <button
              onClick={() => setMarketingOpen(!marketingOpen)}
              className="w-full flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-slate-400 px-2.5 py-1.5 hover:text-slate-200 transition-colors"
            >
              <span>Marketing</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform ${
                  marketingOpen ? 'rotate-0' : '-rotate-90'
                }`}
              />
            </button>

            {marketingOpen && (
              <div className="space-y-0.5 mt-1">
                <button
                  onClick={() => handleOpenQr('menu')}
                  className="w-full py-2 px-3 rounded-xl flex items-center gap-2.5 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-900/40 transition-colors"
                >
                  <QrCode className="w-4 h-4" />
                  <span>QR Menú</span>
                </button>

                <button
                  onClick={() => handleOpenQr('counter')}
                  className="w-full py-2 px-3 rounded-xl flex items-center gap-2.5 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-900/40 transition-colors"
                >
                  <Store className="w-4 h-4" />
                  <span>QR Mostrador</span>
                </button>

                <button
                  onClick={() => handleOpenQr('discount')}
                  className="w-full py-2 px-3 rounded-xl flex items-center gap-2.5 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-900/40 transition-colors"
                >
                  <Ticket className="w-4 h-4" />
                  <span>QR Descuento</span>
                </button>

                <button
                  onClick={() => handleOpenQr('reviews')}
                  className="w-full py-2 px-3 rounded-xl flex items-center gap-2.5 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-900/40 transition-colors"
                >
                  <Star className="w-4 h-4" />
                  <span>QR Reseñas</span>
                </button>

                <button
                  onClick={() => handleOpenQr('infolink')}
                  className="w-full py-2 px-3 rounded-xl flex items-center gap-2.5 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-900/40 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  <span>QR InfoLink</span>
                </button>
              </div>
            )}
          </div>

          {/* SECTION 3: MENÚ DIGITAL */}
          <div className="mb-4">
            <button
              onClick={() => setMenuDigitalOpen(!menuDigitalOpen)}
              className="w-full flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-slate-400 px-2.5 py-1.5 hover:text-slate-200 transition-colors"
            >
              <span>Menú digital</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform ${
                  menuDigitalOpen ? 'rotate-0' : '-rotate-90'
                }`}
              />
            </button>

            {menuDigitalOpen && (
              <div className="space-y-0.5 mt-1">
                <button
                  onClick={() => {
                    setActiveSection('menu');
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full py-2 px-3 rounded-xl flex items-center gap-2.5 text-xs font-medium transition-colors ${
                    activeSection === 'menu'
                      ? 'bg-slate-800 text-white font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/40'
                  }`}
                >
                  <Utensils className="w-4 h-4" />
                  <span>Menú</span>
                </button>

                <button
                  onClick={() => {
                    setActiveSection('menu_libro');
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full py-2 px-3 rounded-xl flex items-center gap-2.5 text-xs font-medium transition-colors ${
                    activeSection === 'menu_libro'
                      ? 'bg-slate-800 text-white font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/40'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Menú libro</span>
                </button>

                <button
                  onClick={() => {
                    setActiveSection('infolink');
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full py-2 px-3 rounded-xl flex items-center gap-2.5 text-xs font-medium transition-colors ${
                    activeSection === 'infolink'
                      ? 'bg-slate-800 text-white font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/40'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>InfoLink</span>
                </button>
              </div>
            )}
          </div>

          {/* SECTION 4: SUSCRIPCIÓN & FACTURACIÓN */}
          <div className="mb-4">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-2.5 py-1.5 flex items-center justify-between">
              <span>Suscripción & Pagos</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[9px] font-bold">
                Activo
              </span>
            </div>

            <div className="space-y-0.5 mt-1">
              <button
                onClick={() => {
                  setActiveSection('facturacion');
                  setMobileSidebarOpen(false);
                }}
                className={`w-full py-2 px-3 rounded-xl flex items-center justify-between text-xs font-medium transition-colors ${
                  activeSection === 'facturacion'
                    ? 'bg-slate-800 text-white font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/40'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <CreditCard className="w-4 h-4 text-emerald-400" />
                  <span>Facturación & Plan</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                  {subscription.planId === 'starter' ? 'Despegue' : subscription.planId === 'franchise' ? 'Franquicia' : 'Pro'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* BOTTOM USER PROFILE */}
        <div className="p-3 border-t border-slate-900 bg-[#070c13] flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-500 text-zinc-950 font-black text-xs flex items-center justify-center shrink-0 shadow">
              {(currentUser?.name || 'Jaike Romero')
                .split(' ')
                .map((n: string) => n[0])
                .slice(0, 2)
                .join('')
                .toUpperCase() || 'MR'}
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-white block truncate">
                {currentUser?.name || 'Jaike Romero'}
              </span>
              <span className="text-[10px] text-slate-400 truncate block">
                {currentUser?.email || 'jaikeromero@gmail.com'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsSupportChatOpen(true)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors relative"
              title="Notificaciones"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-emerald-500 rounded-full" />
            </button>

            <button
              type="button"
              onClick={() => {
                logoutUser();
                router.push('/login');
              }}
              className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg transition-colors cursor-pointer"
              title="Cerrar sesión"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
        />
      )}

      {/* ========================================================= */}
      {/* 2. MAIN CONTENT AREA                                      */}
      {/* ========================================================= */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* TOP HEADER: EXACT MATCH */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900 tracking-tight">
                {isOwner ? 'Dashboard Ejecutivo Dueño' : 'Panel de Control'}
              </h1>
              <span className="text-xs text-slate-400 font-medium">
                / {todayFormatted}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Business switcher / Active business badge */}
            {isOwner ? (
              <select
                value={selectedBusinessId}
                onChange={e => setSelectedBusinessId(e.target.value)}
                className="hidden sm:block text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-700 outline-none"
              >
                {businesses.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            ) : (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="max-w-[160px] truncate">{business.name}</span>
                <span className="text-[10px] text-emerald-700 font-extrabold px-1.5 py-0.2 bg-emerald-50 rounded border border-emerald-200">
                  Tu Local
                </span>
              </div>
            )}

            {/* Active Subscription Pill Button */}
            <button
              onClick={() => setActiveSection('facturacion')}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 text-xs font-bold transition-all"
              title="Ver suscripción y facturación"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{subscription.planName} • Activo</span>
            </button>

            {/* Ver tutorial button */}
            <button
              onClick={() => setIsTutorialOpen(true)}
              className="px-4 py-1.5 bg-[#22c55e] hover:bg-emerald-600 text-white font-bold text-xs rounded-full flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.02]"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Ver tutorial</span>
            </button>

            {/* Buscar ⌘K */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-400 font-medium transition-colors"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span>Buscar</span>
              <kbd className="text-[10px] bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-500 font-mono">
                ⌘K
              </kbd>
            </button>
          </div>
        </header>

        {/* Dynamic Main Body Content */}
        <main className="p-4 sm:p-8 space-y-6 max-w-7xl mx-auto w-full flex-1">
          {/* ========================================================= */}
          {/* VIEW: MAIN PANEL (EXACT SCREENSHOT LAYOUT)                 */}
          {/* ========================================================= */}
          {activeSection === 'panel' && (
            <div className="space-y-6">
              {/* TU NEGOCIO HOY | 2 INSIGHTS */}
              {(!dismissWhatsappAlert || !dismissDraftAlert) && (
                <div>
                  <div className="flex items-center justify-between mb-2 px-1">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Tu negocio hoy
                    </span>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      {(!dismissWhatsappAlert && !dismissDraftAlert) ? '2 INSIGHTS' : '1 INSIGHT'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Alert 1: Print QR Codes for Tables & Counter */}
                    {!dismissWhatsappAlert && (
                      <div className="bg-white border-2 border-indigo-200 rounded-2xl p-4 shadow-sm relative flex items-start gap-3">
                        <button
                          onClick={() => setDismissWhatsappAlert(true)}
                          className="absolute top-3 right-3 text-slate-400 hover:text-slate-600"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                        <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                          <QrCode className="w-4 h-4" />
                        </div>
                        <div className="pr-4">
                          <span className="inline-block px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 text-[10px] font-black uppercase tracking-wider">
                            Recomendación
                          </span>
                          <h4 className="font-bold text-sm text-slate-900 mt-1">
                            Imprime tus Códigos QR para Mesas & Mostrador
                          </h4>
                          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                            Colócalos en tus mesas y punto de pago para que los clientes vean tu menú digital y guarden su tarjeta en Apple/Google Wallet.
                          </p>
                          <button
                            onClick={() => handleOpenQr('counter')}
                            className="mt-2 text-xs font-bold text-indigo-700 hover:underline flex items-center gap-1"
                          >
                            <span>Ver e Imprimir Códigos QR</span>
                            <span>→</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Alert 2: Mini-sitio borrador */}
                    {!dismissDraftAlert && (
                      <div className="bg-white border-2 border-emerald-400 rounded-2xl p-4 shadow-sm relative flex items-start gap-3">
                        <button
                          onClick={() => setDismissDraftAlert(true)}
                          className="absolute top-3 right-3 text-slate-400 hover:text-slate-600"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                        <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 text-base">
                          🔒
                        </div>
                        <div className="pr-4">
                          <span className="inline-block px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
                            Sugerencia
                          </span>
                          <h4 className="font-bold text-sm text-slate-900 mt-1">
                            {isSitePublished ? 'Tu mini-sitio está publicado' : 'Tu mini-sitio está en borrador'}
                          </h4>
                          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                            {isSitePublished
                              ? 'Cualquier comensal ya puede ver tu carta y agregar tu tarjeta Wallet.'
                              : 'Mientras esté oculto, nadie puede pedir desde tu link público.'}
                          </p>
                          <button
                            onClick={() => setIsSitePublished(!isSitePublished)}
                            className="mt-2 text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
                          >
                            <span>{isSitePublished ? 'Ver sitio en vivo' : 'Publicar sitio'}</span>
                            <span>→</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* IF OWNER: Executive Revenue & Audit Dashboard. IF CLIENT: Dedicated Store Operations Panel */}
              {isOwner ? (
                <>
                  {/* EXECUTIVE DASHBOARD CONTROLS & PERIOD SELECTOR (SOLO PARA DUEÑO) */}
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                          <span>Dashboard Ejecutivo de Ventas & Clientes</span>
                          <span className="text-[10px] bg-amber-100 text-amber-800 font-extrabold px-2 py-0.5 rounded-full uppercase">
                            Exclusivo Dueño
                          </span>
                        </h2>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Métricas de ingresos, base de datos de comensales y movimientos en tiempo real para <strong>{business.name}</strong>.
                      </p>
                    </div>

                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                  {/* Period filter buttons */}
                  <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600">
                    <button
                      type="button"
                      onClick={() => setDashboardPeriod('today')}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        dashboardPeriod === 'today'
                          ? 'bg-white text-slate-900 shadow-sm font-extrabold'
                          : 'hover:text-slate-900'
                      }`}
                    >
                      Hoy
                    </button>
                    <button
                      type="button"
                      onClick={() => setDashboardPeriod('7d')}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        dashboardPeriod === '7d'
                          ? 'bg-white text-slate-900 shadow-sm font-extrabold'
                          : 'hover:text-slate-900'
                      }`}
                    >
                      7 días
                    </button>
                    <button
                      type="button"
                      onClick={() => setDashboardPeriod('30d')}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        dashboardPeriod === '30d'
                          ? 'bg-white text-slate-900 shadow-sm font-extrabold'
                          : 'hover:text-slate-900'
                      }`}
                    >
                      30 días
                    </button>
                    <button
                      type="button"
                      onClick={() => setDashboardPeriod('all')}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        dashboardPeriod === 'all'
                          ? 'bg-white text-slate-900 shadow-sm font-extrabold'
                          : 'hover:text-slate-900'
                      }`}
                    >
                      Histórico
                    </button>
                  </div>

                  {/* Action: Registrar Venta */}
                  <button
                    type="button"
                    onClick={() => setIsRecordSaleModalOpen(true)}
                    className="flex-1 sm:flex-none px-4 py-2 bg-[#22c55e] hover:bg-emerald-600 text-black font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 cursor-pointer transition-all hover:scale-[1.02]"
                  >
                    <Receipt className="w-4 h-4 stroke-[2.5]" />
                    <span>Registrar Venta / Cobro</span>
                  </button>

                  {/* Action: Nuevo Cliente */}
                  <button
                    type="button"
                    onClick={() => setIsNewCustomerModalOpen(true)}
                    className="flex-1 sm:flex-none px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm cursor-pointer transition-all"
                  >
                    <Plus className="w-3.5 h-3.5 text-emerald-400" />
                    <span>+ Cliente</span>
                  </button>
                </div>
              </div>

              {/* SECTION: VENTAS & REVENUE METRICS */}
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2 px-1">
                  Métricas de Venta • {dashboardPeriod === 'today' ? 'Hoy' : dashboardPeriod === '7d' ? 'Últimos 7 días' : dashboardPeriod === '30d' ? 'Últimos 30 días' : 'Todo el Histórico'}
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Card 1: VENTAS / INGRESOS DEL PERIODO */}
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-emerald-600">
                        <DollarSign className="w-4 h-4 stroke-[2.5]" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">
                          Ventas ({dashboardPeriod === 'today' ? 'Hoy' : dashboardPeriod === '7d' ? '7d' : dashboardPeriod === '30d' ? '30d' : 'Histórico'})
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        +14.2%
                      </span>
                    </div>
                    <div className="text-3xl font-black text-slate-900 mt-2">
                      $ {totalSalesAmount.toLocaleString()}
                    </div>
                    <span className="text-xs text-slate-400 mt-1 block">
                      {totalOrdersCount} transacciones registradas
                    </span>
                  </div>

                  {/* Card 2: PEDIDOS / TRANSACCIONES */}
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center gap-1.5 text-emerald-600">
                      <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">
                        Transacciones
                      </span>
                    </div>
                    <div className="text-3xl font-black text-emerald-600 mt-2">
                      {totalOrdersCount}
                    </div>
                    <span className="text-xs text-slate-400 mt-1 block">
                      Ventas con ticket generado
                    </span>
                  </div>

                  {/* Card 3: TICKET PROMEDIO */}
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center gap-1.5 text-blue-600">
                      <TrendingUp className="w-4 h-4 stroke-[2.5]" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">
                        Ticket Promedio
                      </span>
                    </div>
                    <div className="text-3xl font-black text-blue-600 mt-2">
                      $ {averageTicket}
                    </div>
                    <span className="text-xs text-slate-400 mt-1 block">
                      Gasto promedio por comensal
                    </span>
                  </div>

                  {/* Card 4: FACTURACIÓN ACUMULADA */}
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center gap-1.5 text-indigo-600">
                      <CircleDollarSign className="w-4 h-4 stroke-[2.5]" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">
                        Facturación 30d
                      </span>
                    </div>
                    <div className="text-3xl font-black text-indigo-600 mt-2">
                      $ {total30dSales.toLocaleString()}
                    </div>
                    <span className="text-xs text-emerald-600 font-bold mt-1 block">
                      ✨ $0 comisiones a apps terceras
                    </span>
                  </div>
                </div>
              </div>

              {/* SECTION: CLIENTES Y FIDELIZACIÓN (DATOS VIVOS) */}
              <div>
                <div className="flex items-center justify-between mb-2 px-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Base de Datos de Clientes & Fidelización
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveSection('clientes')}
                    className="text-xs font-bold text-emerald-600 hover:underline"
                  >
                    Ver CRM completo ({customers.length} clientes) →
                  </button>
                </div>

                {/* Row 1: 6 cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 mb-3.5">
                  {/* CLIENTES REGISTRADOS */}
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Users className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">
                        Clientes
                      </span>
                    </div>
                    <div className="text-2xl font-black text-slate-900 mt-1.5">
                      {customers.length}
                    </div>
                    <span className="text-[10px] text-emerald-600 font-bold mt-1 block">
                      En base de datos
                    </span>
                  </div>

                  {/* RECURRENTES */}
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center gap-1.5 text-emerald-600">
                      <Repeat className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">
                        Recurrentes
                      </span>
                    </div>
                    <div className="text-2xl font-black text-emerald-600 mt-1.5">
                      {recurringCustomersCount}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      ≥2 visitas ({customers.length > 0 ? Math.round((recurringCustomersCount / customers.length) * 100) : 0}%)
                    </span>
                  </div>

                  {/* TARJETAS ACTIVAS */}
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center gap-1.5 text-emerald-600">
                      <CreditCard className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">
                        Tarjetas
                      </span>
                    </div>
                    <div className="text-2xl font-black text-emerald-600 mt-1.5">
                      {customers.length}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Activas en Wallet
                    </span>
                  </div>

                  {/* PASES EMITIDOS */}
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center gap-1.5 text-emerald-600">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">
                        Pases Wallet
                      </span>
                    </div>
                    <div className="text-2xl font-black text-emerald-600 mt-1.5">
                      {customers.length}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Descargados 100%
                    </span>
                  </div>

                  {/* APPLE VS GOOGLE */}
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center gap-1.5 text-blue-600">
                      <Smartphone className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">
                        Apple / Google
                      </span>
                    </div>
                    <div className="text-xs font-bold text-slate-800 mt-2.5 flex items-center gap-2">
                      <span>🍏 <strong>{appleWalletCount}</strong></span>
                      <span>🤖 <strong>{googleWalletCount}</strong></span>
                    </div>
                  </div>

                  {/* SELLOS OTORGADOS */}
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center gap-1.5 text-blue-600">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">
                        Sellos Otorgados
                      </span>
                    </div>
                    <div className="text-2xl font-black text-blue-600 mt-1.5">
                      {totalStampsAwarded}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Acumulados
                    </span>
                  </div>
                </div>

                {/* Row 2: 2 cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* RECOMPENSAS ENTREGADAS */}
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-emerald-600">
                        <Gift className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">
                          Recompensas & Premios Canjeados
                        </span>
                      </div>
                      <div className="text-2xl font-black text-emerald-600 mt-1.5">
                        {totalRewardsRedeemed} premios
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        Clientes que completaron su tarjeta y redimieron premio
                      </span>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl shrink-0">
                      🎁
                    </div>
                  </div>

                  {/* GOOGLE REVIEWS & RATING */}
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700">
                          Reputación Google Maps
                        </span>
                      </div>
                      <div className="text-2xl font-black text-slate-900 mt-1.5 flex items-center gap-2">
                        <span>{business.googleReviews.googleRating.toFixed(1)}</span>
                        <div className="flex text-amber-400 text-sm">★★★★★</div>
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        {business.googleReviews.totalReviews} reseñas 5 estrellas verificadas
                      </span>
                    </div>
                    <a
                      href={business.googleReviews.googleReviewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors"
                    >
                      Ver perfil →
                    </a>
                  </div>
                </div>
              </div>

              {/* BOTTOM SECTION: TOP PRODUCTOS & ACTIVIDAD RECIENTE */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                {/* Left: Top productos más vendidos (5 cols) */}
                <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                        <span>🏆</span>
                        <span>Platillos & Bebidas Más Vendidos</span>
                      </h3>
                      <button
                        type="button"
                        onClick={() => setActiveSection('menu')}
                        className="text-xs font-bold text-emerald-600 hover:underline"
                      >
                        Ver menú
                      </button>
                    </div>

                    <div className="space-y-3">
                      {menuItems.length === 0 ? (
                        <div className="p-6 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                          <p className="text-xs font-bold text-slate-700">Aún no hay platillos cargados</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Comienza agregando los productos estrella de tu carta.
                          </p>
                          <button
                            type="button"
                            onClick={() => setActiveSection('menu')}
                            className="mt-2 text-xs font-bold text-emerald-600 hover:underline inline-block"
                          >
                            + Gestionar Carta
                          </button>
                        </div>
                      ) : (
                        menuItems.slice(0, 4).map((item, idx) => (
                          <div key={item.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                            <div className="flex items-center gap-3 min-w-0">
                              <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 font-black text-[10px] flex items-center justify-center shrink-0">
                                #{idx + 1}
                              </span>
                              <div className="min-w-0">
                                <span className="text-xs font-bold text-slate-900 block truncate">
                                  {item.name}
                                </span>
                                <span className="text-[10px] text-slate-500 block">
                                  {item.category} • ${item.price}
                                </span>
                              </div>
                            </div>
                            <span className="text-xs font-black text-emerald-600 shrink-0">
                              +{12 - idx * 3} pedidos
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Total ítems en carta:</span>
                    <span className="font-bold text-slate-900">{menuItems.length} platillos</span>
                  </div>
                </div>

                {/* Right: Movimientos en vivo y auditoría (7 cols) */}
                <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span>Movimientos & Transacciones en Vivo</span>
                        </h3>
                        <p className="text-[11px] text-slate-400">
                          Registro cronológico de ventas, sellos y canjes de clientes.
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setActiveSection('ventas')}
                          className="text-xs font-bold text-emerald-600 hover:underline"
                        >
                          Ver historial completo ({transactions.length}) →
                        </button>
                      </div>
                    </div>

                    {/* Movement feed */}
                    <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
                      {transactions.length === 0 ? (
                        <div className="p-6 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                          <p className="text-xs font-bold text-slate-700">Sin movimientos registrados</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Las ventas y sellos de tarjetas Wallet se reflejarán aquí al instante.
                          </p>
                          <button
                            type="button"
                            onClick={() => setIsRecordSaleModalOpen(true)}
                            className="mt-2 text-xs font-bold text-emerald-600 hover:underline inline-block"
                          >
                            + Registrar primera venta
                          </button>
                        </div>
                      ) : (
                        transactions.slice(0, 5).map(t => (
                          <div
                            key={t.id}
                            className="p-3 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/70 transition-all flex items-center justify-between gap-3 text-xs"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div
                                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                                  t.type === 'REWARD_REDEEMED'
                                    ? 'bg-amber-100 text-amber-700'
                                    : t.notes?.includes('Venta')
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : 'bg-blue-100 text-blue-700'
                                }`}
                              >
                                {t.type === 'REWARD_REDEEMED' ? '🎁' : t.notes?.includes('Venta') ? '💰' : '⭐'}
                              </div>

                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-slate-900 truncate">
                                    {t.customerName}
                                  </span>
                                  <span
                                    className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase ${
                                      t.type === 'REWARD_REDEEMED'
                                        ? 'bg-amber-100 text-amber-800'
                                        : 'bg-emerald-100 text-emerald-800'
                                    }`}
                                  >
                                    {t.type === 'REWARD_REDEEMED' ? 'Premio' : 'Sello'}
                                  </span>
                                </div>
                                <span className="text-[11px] text-slate-500 block truncate mt-0.5">
                                  {t.notes || 'Operación en mostrador'}
                                </span>
                              </div>
                            </div>

                            <div className="text-right shrink-0">
                              <span className="font-mono text-[11px] text-slate-400 block">
                                {new Date(t.createdAt).toLocaleDateString('es-MX', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                              <span className="text-[10px] text-slate-500 font-medium">
                                {t.staffName}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 mt-4 flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={() => setIsRecordSaleModalOpen(true)}
                      className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Registrar nuevo movimiento manual</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleExportSalesCSV}
                      className="text-slate-500 hover:text-slate-800 flex items-center gap-1 font-semibold cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Exportar CSV</span>
                    </button>
                  </div>
                </div>
              </div>
                </>
              ) : (
                /* ========================================================= */
                /* CLIENT / MERCHANT PANEL VIEW (EXCLUSIVO PARA CLIENTES)    */
                /* ========================================================= */
                <div className="space-y-6">
                  {/* Hero Store Status & Direct InfoLink Access */}
                  <div className="bg-gradient-to-r from-[#0a111a] via-[#101b2a] to-[#0a111a] border border-slate-800 text-white rounded-3xl p-6 sm:p-7 shadow-xl relative overflow-hidden">
                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                            Panel de Tu Negocio
                          </span>
                          <span className="text-[10px] bg-emerald-500/10 text-emerald-300 font-extrabold px-2 py-0.5 rounded-full border border-emerald-500/20">
                            Activo
                          </span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                          {business.name}
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                          Bienvenido, <strong>{currentUser?.name || 'Comerciante'}</strong>. Monitorea tus comensales con tarjeta Wallet, visitas validadas y tu carta digital.
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto">
                        <Link
                          href={`/${business.slug}`}
                          target="_blank"
                          className="px-4 py-2.5 bg-[#22c55e] hover:bg-emerald-600 text-black font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02]"
                        >
                          <ExternalLink className="w-4 h-4 stroke-[2.5]" />
                          <span>Ver Mi Mini-Sitio en Vivo</span>
                        </Link>
                        <button
                          type="button"
                          onClick={handleCopyStoreLink}
                          className="px-4 py-2.5 bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 border border-slate-700 transition-colors"
                        >
                          {copiedLink ? (
                            <>
                              <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
                              <span className="text-emerald-400">¡Link Copiado!</span>
                            </>
                          ) : (
                            <>
                              <Share2 className="w-4 h-4 text-slate-400" />
                              <span>Copiar Link Bio</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Operational Metrics (Fidelización & Menú) */}
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2 px-1">
                      Métricas de tu Negocio & Clientes
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
                      {/* 1: Total Clientes */}
                      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm">
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <Users className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-bold uppercase tracking-wider">Clientes</span>
                        </div>
                        <div className="text-2xl font-black text-slate-900 mt-1.5">
                          {customers.length}
                        </div>
                        <span className="text-[10px] text-emerald-600 font-bold mt-1 block">
                          Base de datos activa
                        </span>
                      </div>

                      {/* 2: Apple Wallet */}
                      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm">
                        <div className="flex items-center gap-1.5 text-slate-800">
                          <CreditCard className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-bold uppercase tracking-wider">Apple Wallet</span>
                        </div>
                        <div className="text-2xl font-black text-slate-900 mt-1.5">
                          {customers.filter(c => c.walletPassType === 'apple').length}
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          Pases en iPhone
                        </span>
                      </div>

                      {/* 3: Google Wallet */}
                      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm">
                        <div className="flex items-center gap-1.5 text-slate-800">
                          <Smartphone className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-bold uppercase tracking-wider">Google Wallet</span>
                        </div>
                        <div className="text-2xl font-black text-slate-900 mt-1.5">
                          {customers.filter(c => c.walletPassType === 'google').length}
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          Pases en Android
                        </span>
                      </div>

                      {/* 4: Sellos Totales */}
                      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm">
                        <div className="flex items-center gap-1.5 text-emerald-600">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-bold uppercase tracking-wider">Sellos Dados</span>
                        </div>
                        <div className="text-2xl font-black text-emerald-600 mt-1.5">
                          {customers.reduce((acc, c) => acc + c.currentStamps, 0)}
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          Acumulados
                        </span>
                      </div>

                      {/* 5: Premios Canjeados */}
                      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm">
                        <div className="flex items-center gap-1.5 text-amber-600">
                          <Gift className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-bold uppercase tracking-wider">Premios</span>
                        </div>
                        <div className="text-2xl font-black text-amber-600 mt-1.5">
                          {customers.reduce((acc, c) => acc + (c.rewardsRedeemed || 0), 0)}
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          Canjeados
                        </span>
                      </div>

                      {/* 6: Google Reviews */}
                      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm">
                        <div className="flex items-center gap-1.5 text-amber-500">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span className="text-[10px] font-bold uppercase tracking-wider">Google Rating</span>
                        </div>
                        <div className="text-2xl font-black text-slate-900 mt-1.5">
                          {business.googleReviews.googleRating} ⭐
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          {business.googleReviews.totalReviews} reseñas
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Quick Shortcuts for Merchant */}
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2 px-1">
                      Herramientas Operativas de tu Local
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* Action 1: Tarjetas Wallet */}
                      <button
                        type="button"
                        onClick={() => setActiveSection('tarjetas')}
                        className="p-5 bg-white border border-slate-200/90 rounded-2xl hover:border-emerald-500 hover:shadow-md transition-all text-left group cursor-pointer"
                      >
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                          <CreditCard className="w-5 h-5 stroke-[2.5]" />
                        </div>
                        <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors">
                          Diseñar Tarjeta Wallet
                        </h4>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          Premio: <strong>{business.loyaltyConfig.rewardTitle}</strong> ({business.loyaltyConfig.totalStamps} sellos).
                        </p>
                        <span className="mt-3 text-xs font-bold text-emerald-600 flex items-center gap-1">
                          <span>Editar tarjeta</span>
                          <span>→</span>
                        </span>
                      </button>

                      {/* Action 2: Escáner de Caja */}
                      <button
                        type="button"
                        onClick={() => setActiveSection('escaner')}
                        className="p-5 bg-white border border-slate-200/90 rounded-2xl hover:border-blue-500 hover:shadow-md transition-all text-left group cursor-pointer"
                      >
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                          <QrCode className="w-5 h-5 stroke-[2.5]" />
                        </div>
                        <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-blue-700 transition-colors">
                          Escáner de Sellos en Caja
                        </h4>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          Usa la cámara de tu celular o tablet para sellar tarjetas y validar canjes al instante.
                        </p>
                        <span className="mt-3 text-xs font-bold text-blue-600 flex items-center gap-1">
                          <span>Abrir escáner</span>
                          <span>→</span>
                        </span>
                      </button>

                      {/* Action 3: Menú Digital */}
                      <button
                        type="button"
                        onClick={() => setActiveSection('menu')}
                        className="p-5 bg-white border border-slate-200/90 rounded-2xl hover:border-amber-500 hover:shadow-md transition-all text-left group cursor-pointer"
                      >
                        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                          <Utensils className="w-5 h-5 stroke-[2.5]" />
                        </div>
                        <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-amber-700 transition-colors">
                          Gestionar Menú Digital
                        </h4>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          {menuItems.length} platillos en tu carta. Sube fotos, videos cortos y actualiza precios.
                        </p>
                        <span className="mt-3 text-xs font-bold text-amber-600 flex items-center gap-1">
                          <span>Editar carta</span>
                          <span>→</span>
                        </span>
                      </button>

                      {/* Action 4: Stands QR */}
                      <button
                        type="button"
                        onClick={() => handleOpenQr('counter')}
                        className="p-5 bg-white border border-slate-200/90 rounded-2xl hover:border-purple-500 hover:shadow-md transition-all text-left group cursor-pointer"
                      >
                        <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                          <Printer className="w-5 h-5 stroke-[2.5]" />
                        </div>
                        <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-purple-700 transition-colors">
                          Stands QR para Mesas
                        </h4>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          Descarga e imprime los diseños en alta resolución para colocar en mesas y mostrador.
                        </p>
                        <span className="mt-3 text-xs font-bold text-purple-600 flex items-center gap-1">
                          <span>Ver stands QR</span>
                          <span>→</span>
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Customer Feed & Menu Overview */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                    {/* Clientes recientes con tarjeta activa */}
                    <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                              <Users className="w-4 h-4 text-emerald-600" />
                              <span>Comensales con Tarjeta Activa</span>
                            </h3>
                            <p className="text-[11px] text-slate-400">
                              Clientes que han instalado tu tarjeta en Apple Wallet o Google Wallet.
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setActiveSection('clientes')}
                            className="text-xs font-bold text-emerald-600 hover:underline"
                          >
                            Ver todos ({customers.length}) →
                          </button>
                        </div>

                        <div className="space-y-2.5">
                          {customers.length === 0 ? (
                            <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                              <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                              <p className="text-xs font-bold text-slate-700">Aún no hay clientes registrados</p>
                              <p className="text-[11px] text-slate-400 mt-0.5">
                                Aparecerán aquí en cuanto agreguen tu tarjeta a su celular.
                              </p>
                            </div>
                          ) : (
                            customers.slice(0, 4).map(c => (
                              <div key={c.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-500 text-zinc-950 font-black text-[10px] flex items-center justify-center shrink-0">
                                    {c.name.charAt(0)}
                                  </div>
                                  <div>
                                    <span className="font-bold text-slate-900 block">{c.name}</span>
                                    <span className="text-[10px] text-slate-400 font-mono block">{c.phone}</span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <span className="font-extrabold text-emerald-600 text-xs block">
                                    {c.currentStamps}/{business.loyaltyConfig.totalStamps} sellos
                                  </span>
                                  <span className="text-[10px] text-slate-400">
                                    {c.walletPassType === 'google' ? 'Google Wallet' : 'Apple Wallet'}
                                  </span>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 mt-4 flex items-center justify-between text-xs">
                        <button
                          type="button"
                          onClick={() => setIsNewCustomerModalOpen(true)}
                          className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>+ Registrar comensal manualmente</span>
                        </button>
                      </div>
                    </div>

                    {/* Platillos en Carta */}
                    <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                            <Utensils className="w-4 h-4 text-amber-500" />
                            <span>Platillos en Carta Digital</span>
                          </h3>
                          <button
                            type="button"
                            onClick={() => setActiveSection('menu')}
                            className="text-xs font-bold text-emerald-600 hover:underline"
                          >
                            Gestionar carta
                          </button>
                        </div>

                        <div className="space-y-2.5">
                          {menuItems.slice(0, 4).map((item) => (
                            <div key={item.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                              <div className="min-w-0">
                                <span className="font-bold text-slate-900 block truncate">{item.name}</span>
                                <span className="text-[10px] text-slate-500 block">{item.category}</span>
                              </div>
                              <span className="font-black text-slate-900 shrink-0 ml-2">
                                ${item.price}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-xs">
                        <span className="text-slate-500">Total en tu menú:</span>
                        <span className="font-bold text-slate-900">{menuItems.length} platillos</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* VIEW: VENTAS & MOVIMIENTOS (LEDGER FINANCIERO - SOLO DUEÑO)*/}
          {/* ========================================================= */}
          {activeSection === 'ventas' && (
            !isOwner ? (
              <div className="bg-white border border-slate-200/90 rounded-2xl p-12 text-center shadow-sm max-w-xl mx-auto my-12 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto text-xl font-bold">
                  🔒
                </div>
                <h3 className="font-black text-lg text-slate-900">Módulo Reservado para el Dueño</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  El libro contable de ventas ejecutivas y auditoría central de cobros es exclusivo para la administración del Propietario de Markethers.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveSection('panel')}
                  className="mt-4 px-4 py-2 bg-[#22c55e] text-black font-extrabold text-xs rounded-xl shadow-md cursor-pointer"
                >
                  Volver a mi Panel
                </button>
              </div>
            ) : (
            <div className="space-y-6">
              {/* Header card with summary & stats */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                        <Receipt className="w-5 h-5 stroke-[2.5]" />
                      </span>
                      <div>
                        <h2 className="text-lg font-black text-slate-900 tracking-tight">
                          Libro de Ventas & Movimientos
                        </h2>
                        <p className="text-xs text-slate-500">
                          Registro contable de ventas, métodos de cobro y sellos acumulados en {business.name}.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => setIsRecordSaleModalOpen(true)}
                      className="flex-1 sm:flex-none px-4 py-2.5 bg-[#22c55e] hover:bg-emerald-600 text-black font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 cursor-pointer"
                    >
                      <Plus className="w-4 h-4 stroke-[3]" />
                      <span>Registrar Cobro / Venta</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleExportSalesCSV}
                      className="px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer"
                      title="Descargar libro de ventas en CSV"
                    >
                      <Download className="w-4 h-4 text-emerald-400" />
                      <span>Exportar CSV</span>
                    </button>
                  </div>
                </div>

                {/* Financial KPI bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-5">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      Total Facturado ({dashboardPeriod === 'today' ? 'Hoy' : dashboardPeriod === '7d' ? '7 días' : dashboardPeriod === '30d' ? '30 días' : 'Histórico'})
                    </span>
                    <div className="text-2xl font-black text-emerald-600 mt-1">
                      $ {totalSalesAmount.toLocaleString()}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                      {totalOrdersCount} tickets completados
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      Ticket Promedio
                    </span>
                    <div className="text-2xl font-black text-blue-600 mt-1">
                      $ {averageTicket}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                      Por comensal
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      Cobrado con Tarjeta
                    </span>
                    <div className="text-2xl font-black text-slate-900 mt-1">
                      $ {sales.filter(s => s.paymentMethod === 'card' || s.paymentMethod === 'apple_pay').reduce((a, s) => a + s.amount, 0).toLocaleString()}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                      Terminal / Stripe / Apple Pay
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      Cobrado en Efectivo
                    </span>
                    <div className="text-2xl font-black text-slate-900 mt-1">
                      $ {sales.filter(s => s.paymentMethod === 'cash').reduce((a, s) => a + s.amount, 0).toLocaleString()}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                      Caja mostrador
                    </span>
                  </div>
                </div>
              </div>

              {/* Sales Table with Filters */}
              <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-sm">
                <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50/50">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-700">Filtro de período:</span>
                    <div className="flex bg-slate-200/70 p-0.5 rounded-lg text-xs font-bold">
                      <button
                        type="button"
                        onClick={() => setDashboardPeriod('today')}
                        className={`px-2.5 py-1 rounded-md transition-all ${dashboardPeriod === 'today' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}
                      >
                        Hoy
                      </button>
                      <button
                        type="button"
                        onClick={() => setDashboardPeriod('7d')}
                        className={`px-2.5 py-1 rounded-md transition-all ${dashboardPeriod === '7d' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}
                      >
                        7d
                      </button>
                      <button
                        type="button"
                        onClick={() => setDashboardPeriod('30d')}
                        className={`px-2.5 py-1 rounded-md transition-all ${dashboardPeriod === '30d' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}
                      >
                        30d
                      </button>
                      <button
                        type="button"
                        onClick={() => setDashboardPeriod('all')}
                        className={`px-2.5 py-1 rounded-md transition-all ${dashboardPeriod === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}
                      >
                        Histórico ({sales.length})
                      </button>
                    </div>
                  </div>

                  <span className="text-xs text-slate-500 font-medium">
                    Mostrando <strong>{filteredSales.length}</strong> de {sales.length} ventas registradas
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4 font-bold">Folio / Fecha</th>
                        <th className="py-3 px-4 font-bold">Cliente</th>
                        <th className="py-3 px-4 font-bold">Detalle del Consumo</th>
                        <th className="py-3 px-4 font-bold">Método de Pago</th>
                        <th className="py-3 px-4 font-bold text-right">Monto</th>
                        <th className="py-3 px-4 font-bold text-center">Sellos</th>
                        <th className="py-3 px-4 font-bold">Atendido por</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {filteredSales.map(s => (
                        <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-4 font-mono text-slate-500">
                            <span className="font-bold text-slate-800 block">#{s.id.slice(-6).toUpperCase()}</span>
                            <span className="text-[10px]">
                              {new Date(s.createdAt).toLocaleDateString('es-MX', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 font-bold text-slate-900">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center justify-center shrink-0">
                                {s.customerName.charAt(0)}
                              </div>
                              <div>
                                <span>{s.customerName}</span>
                                {s.customerPhone && (
                                  <span className="text-[10px] text-slate-400 font-mono block">
                                    {s.customerPhone}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 text-slate-700 font-medium max-w-xs truncate">
                            {s.itemsSummary}
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                              {s.paymentMethod === 'card' && '💳 Tarjeta'}
                              {s.paymentMethod === 'apple_pay' && '🍏 Apple Pay'}
                              {s.paymentMethod === 'cash' && '💵 Efectivo'}
                              {s.paymentMethod === 'transfer' && '📲 SPEI / Transf.'}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-right font-black text-slate-900 text-sm">
                            $ {s.amount.toFixed(2)}
                          </td>

                          <td className="py-3.5 px-4 text-center">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-black text-[11px] border border-emerald-200">
                              +{s.stampsAwarded} ⭐
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-slate-500 font-medium">
                            {s.staffName}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {filteredSales.length === 0 && (
                    <div className="p-12 text-center space-y-3">
                      <div className="text-4xl">🧾</div>
                      <h4 className="font-bold text-sm text-slate-800">
                        No hay ventas registradas en este período
                      </h4>
                      <p className="text-xs text-slate-400 max-w-sm mx-auto">
                        Registra una venta con el botón verde superior para ver el desglose en tiempo real.
                      </p>
                      <button
                        type="button"
                        onClick={() => setIsRecordSaleModalOpen(true)}
                        className="px-4 py-2 bg-[#22c55e] text-black font-extrabold text-xs rounded-xl shadow-md shadow-emerald-500/20"
                      >
                        + Registrar primera venta
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            )
          )}

          {/* ========================================================= */}
          {/* VIEW: TARJETAS (WALLET FIDELIZACIÓN DESIGNER)              */}
          {/* ========================================================= */}
          {activeSection === 'tarjetas' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="border-b border-slate-100 pb-4 mb-6">
                <h3 className="font-bold text-base text-slate-900">
                  Diseñador de Tarjeta para Apple & Google Wallet
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Los cambios se reflejan al instante en las tarjetas ya instaladas en los teléfonos de tus comensales.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <form onSubmit={handleSaveCardDesigner} className="lg:col-span-7 space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Premio al completar la tarjeta
                    </label>
                    <input
                      type="text"
                      value={cardDesignerConfig.rewardTitle}
                      onChange={e => setCardDesignerConfig({ ...cardDesignerConfig, rewardTitle: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white outline-none focus:ring-2 focus:ring-emerald-500/20"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Número de sellos necesarios
                      </label>
                      <select
                        value={cardDesignerConfig.totalStamps}
                        onChange={e => setCardDesignerConfig({ ...cardDesignerConfig, totalStamps: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none"
                      >
                        {[4, 5, 6, 8, 10, 12].map(n => (
                          <option key={n} value={n}>
                            {n} sellos para ganar
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Color de Fondo
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={cardDesignerConfig.cardBgColor}
                          onChange={e => setCardDesignerConfig({ ...cardDesignerConfig, cardBgColor: e.target.value })}
                          className="w-10 h-10 rounded-xl border border-slate-200 cursor-pointer p-0.5 bg-white"
                        />
                        <span className="text-xs font-mono text-slate-600">
                          {cardDesignerConfig.cardBgColor}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Términos & Condiciones del Programa
                    </label>
                    <textarea
                      rows={3}
                      value={cardDesignerConfig.terms}
                      onChange={e => setCardDesignerConfig({ ...cardDesignerConfig, terms: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white outline-none"
                    />
                  </div>

                  {saveDesignerSuccess && (
                    <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-800 font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>¡Diseño guardado y actualizado en todos los pases Wallet!</span>
                    </div>
                  )}

                  <div className="pt-3 flex gap-3">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#22c55e] hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-500/20 flex items-center gap-2 transition-all"
                    >
                      <Save className="w-4 h-4" />
                      <span>Guardar Cambios</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenQr('counter')}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-2"
                    >
                      <QrCode className="w-4 h-4" />
                      <span>Imprimir QR para Clientes</span>
                    </button>
                  </div>
                </form>

                <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4">
                    Vista previa en tiempo real
                  </span>
                  <AppleWalletCard
                    business={{
                      ...business,
                      loyaltyConfig: cardDesignerConfig,
                    }}
                    customer={customers[0]}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* VIEW: BASE DE DATOS DE CLIENTES & CRM                     */}
          {/* ========================================================= */}
          {activeSection === 'clientes' && (
            <div className="space-y-6">
              {/* Header card */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
                        <Users className="w-5 h-5 stroke-[2.5]" />
                      </span>
                      <div>
                        <h2 className="text-lg font-black text-slate-900 tracking-tight">
                          Base de Datos de Clientes (CRM)
                        </h2>
                        <p className="text-xs text-slate-500">
                          Directorio centralizado de comensales con tarjeta instalada en Apple & Google Wallet para {business.name}.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => setIsNewCustomerModalOpen(true)}
                      className="flex-1 sm:flex-none px-4 py-2.5 bg-[#22c55e] hover:bg-emerald-600 text-black font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 cursor-pointer"
                    >
                      <Plus className="w-4 h-4 stroke-[3]" />
                      <span>+ Nuevo Cliente</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleExportCSV}
                      className="px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer"
                      title="Descargar base de datos en CSV / Excel"
                    >
                      <Download className="w-4 h-4 text-emerald-400" />
                      <span>Exportar CSV</span>
                    </button>
                  </div>
                </div>

                {/* Customer KPI metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-5">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      Total Clientes
                    </span>
                    <div className="text-2xl font-black text-slate-900 mt-1">
                      {customers.length}
                    </div>
                    <span className="text-[10px] text-emerald-600 font-bold mt-0.5 block">
                      Pases Wallet activos
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      Clientes VIP
                    </span>
                    <div className="text-2xl font-black text-amber-600 mt-1">
                      {customers.filter(c => c.tier === 'vip' || (c.totalSpent || 0) > 500).length}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                      Alto ticket y lealtad
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      Clientes Recurrentes
                    </span>
                    <div className="text-2xl font-black text-emerald-600 mt-1">
                      {recurringCustomersCount}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                      ≥2 visitas ({customers.length > 0 ? Math.round((recurringCustomersCount / customers.length) * 100) : 0}%)
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      Consumo Total Clientes
                    </span>
                    <div className="text-2xl font-black text-indigo-600 mt-1">
                      $ {customers.reduce((acc, c) => acc + (c.totalSpent || 0), 0).toLocaleString()}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                      Facturado acumulado
                    </span>
                  </div>
                </div>
              </div>

              {/* Table with search and filter */}
              <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-sm">
                <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-50/50">
                  {/* Search bar */}
                  <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Buscar por nombre, teléfono o código Wallet..."
                      value={customerSearchQuery}
                      onChange={e => setCustomerSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-emerald-500"
                    />
                  </div>

                  {/* Tier filter */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-700">Filtrar:</span>
                    <div className="flex bg-slate-200/70 p-0.5 rounded-lg text-xs font-bold">
                      <button
                        type="button"
                        onClick={() => setCustomerFilterTier('all')}
                        className={`px-2.5 py-1 rounded-md transition-all ${customerFilterTier === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}
                      >
                        Todos ({customers.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setCustomerFilterTier('vip')}
                        className={`px-2.5 py-1 rounded-md transition-all ${customerFilterTier === 'vip' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}
                      >
                        VIP
                      </button>
                      <button
                        type="button"
                        onClick={() => setCustomerFilterTier('frecuente')}
                        className={`px-2.5 py-1 rounded-md transition-all ${customerFilterTier === 'frecuente' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}
                      >
                        Recurrentes
                      </button>
                      <button
                        type="button"
                        onClick={() => setCustomerFilterTier('nuevo')}
                        className={`px-2.5 py-1 rounded-md transition-all ${customerFilterTier === 'nuevo' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}
                      >
                        Nuevos
                      </button>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4 font-bold">Cliente</th>
                        <th className="py-3 px-4 font-bold">Teléfono / Móvil</th>
                        <th className="py-3 px-4 font-bold">Pase Wallet</th>
                        <th className="py-3 px-4 font-bold">Consumo Total</th>
                        <th className="py-3 px-4 font-bold">Sellos de Lealtad</th>
                        <th className="py-3 px-4 font-bold">Visitas</th>
                        <th className="py-3 px-4 font-bold text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {customers
                        .filter(c => {
                          if (customerFilterTier !== 'all' && c.tier !== customerFilterTier) return false;
                          if (!customerSearchQuery.trim()) return true;
                          const q = customerSearchQuery.toLowerCase();
                          return (
                            c.name.toLowerCase().includes(q) ||
                            c.phone.toLowerCase().includes(q) ||
                            c.qrCodeToken.toLowerCase().includes(q)
                          );
                        }).length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-12 text-center text-slate-500">
                            <div className="text-4xl mb-2">👥</div>
                            <p className="font-bold text-slate-800 text-sm">
                              {customers.length === 0
                                ? `Aún no hay clientes registrados en ${business.name}`
                                : 'No se encontraron clientes con este filtro'}
                            </p>
                            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                              {customers.length === 0
                                ? 'Tus comensales aparecerán aquí en cuanto instalen tu tarjeta en su Apple o Google Wallet, o registres su primer consumo.'
                                : 'Intenta cambiar el criterio de búsqueda o el filtro de categoría.'}
                            </p>
                            {customers.length === 0 && (
                              <button
                                type="button"
                                onClick={() => setIsNewCustomerModalOpen(true)}
                                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-[#22c55e] hover:bg-emerald-600 text-black font-extrabold text-xs rounded-xl shadow-md cursor-pointer transition-all"
                              >
                                <Plus className="w-4 h-4 stroke-[3]" />
                                <span>+ Registrar Primer Cliente</span>
                              </button>
                            )}
                          </td>
                        </tr>
                      ) : (
                        customers
                          .filter(c => {
                            if (customerFilterTier !== 'all' && c.tier !== customerFilterTier) return false;
                            if (!customerSearchQuery.trim()) return true;
                            const q = customerSearchQuery.toLowerCase();
                            return (
                              c.name.toLowerCase().includes(q) ||
                              c.phone.toLowerCase().includes(q) ||
                              c.qrCodeToken.toLowerCase().includes(q)
                            );
                          })
                          .map(c => {
                            const target = business.loyaltyConfig.totalStamps;
                            const pct = Math.min(100, Math.round((c.currentStamps / target) * 100));
                            return (
                              <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                                <td className="py-3.5 px-4 font-bold text-slate-900">
                                  <div className="flex items-center gap-2.5">
                                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-500 text-zinc-950 font-black text-[11px] flex items-center justify-center shrink-0">
                                      {c.name.charAt(0)}
                                    </div>
                                    <div>
                                      <div className="flex items-center gap-1.5">
                                        <span>{c.name}</span>
                                        {c.tier === 'vip' && (
                                          <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[9px] font-black uppercase">
                                            VIP
                                          </span>
                                        )}
                                      </div>
                                      <span className="text-[10px] text-slate-400 font-normal block">
                                        {c.email || 'Sin correo registrado'}
                                      </span>
                                    </div>
                                  </div>
                                </td>

                                <td className="py-3.5 px-4 font-mono text-slate-600">
                                  {c.phone}
                                </td>

                                <td className="py-3.5 px-4">
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                                    {c.walletPassType === 'google' ? '🤖 Google' : '🍏 Apple'} • {c.qrCodeToken.slice(-4)}
                                  </span>
                                </td>

                                <td className="py-3.5 px-4 font-bold text-slate-900">
                                  $ {(c.totalSpent || 0).toLocaleString()}
                                </td>

                                <td className="py-3.5 px-4">
                                  <div className="space-y-1">
                                    <div className="flex items-center justify-between text-[10px]">
                                      <span className="font-bold text-emerald-600">
                                        {c.currentStamps} de {target} sellos
                                      </span>
                                      <span className="text-slate-400">{pct}%</span>
                                    </div>
                                    <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                      <div
                                        className="h-full bg-emerald-500 rounded-full transition-all"
                                        style={{ width: `${pct}%` }}
                                      />
                                    </div>
                                  </div>
                                </td>

                                <td className="py-3.5 px-4 font-semibold text-slate-800">
                                  <div>{c.totalVisits} visitas</div>
                                  <span className="text-[10px] text-slate-400 block font-normal">
                                    {new Date(c.lastVisitAt).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}
                                  </span>
                                </td>

                                <td className="py-3.5 px-4 text-right">
                                  <div className="flex items-center justify-end gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => setSelectedCustomerDetail(c)}
                                      className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg text-xs transition-colors cursor-pointer"
                                      title="Ver ficha completa e historial"
                                    >
                                      Ver Ficha
                                    </button>

                                    <a
                                      href={`https://wa.me/${c.phone.replace(/\D/g, '')}?text=¡Hola ${c.name}! Te escribimos de ${business.name}.`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="p-1.5 bg-[#22c55e] hover:bg-emerald-600 text-white font-bold rounded-lg text-xs transition-colors"
                                      title="WhatsApp directo"
                                    >
                                      <MessageCircle className="w-3.5 h-3.5" />
                                    </a>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* VIEW: ESCÁNER DE SELLOS PARA CAJA                         */}
          {/* ========================================================= */}
          {activeSection === 'escaner' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm max-w-lg mx-auto">
              <h3 className="font-bold text-base text-slate-900 text-center mb-1">
                Escáner de Tarjetas Wallet
              </h3>
              <p className="text-xs text-slate-500 text-center mb-4">
                El mesero o cajero apunta la cámara al código QR de la tarjeta Apple o Google Wallet del cliente.
              </p>

              {!scannedCustomer ? (
                <div className="space-y-4">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1.5">
                      Probar escaneo inmediato con cliente demo:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {customers.map(c => (
                        <button
                          key={c.id}
                          onClick={() => handleScanCode(c.qrCodeToken)}
                          className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-800 text-xs rounded-lg border border-slate-200 font-semibold"
                        >
                          {c.name} ({c.currentStamps}/{business.loyaltyConfig.totalStamps} sellos)
                        </button>
                      ))}
                    </div>
                  </div>

                  <CameraScanner onScan={handleScanCode} isScanningActive={true} />

                  {scanError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
                      {scanError}
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{scannedCustomer.name}</h4>
                      <span className="text-xs text-slate-500">{scannedCustomer.phone}</span>
                    </div>
                    <span className="font-mono text-[10px] bg-white border border-slate-200 px-2 py-1 rounded text-slate-600">
                      {scannedCustomer.qrCodeToken}
                    </span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-slate-500 font-medium">Sellos actuales:</span>
                      <span className="font-black text-emerald-600">
                        {scannedCustomer.currentStamps} de {business.loyaltyConfig.totalStamps}
                      </span>
                    </div>
                  </div>

                  {scanMessage && (
                    <div className="p-2.5 bg-emerald-100 border border-emerald-300 rounded-xl text-xs text-emerald-900 font-bold text-center">
                      {scanMessage}
                    </div>
                  )}

                  <div className="space-y-2">
                    {scannedCustomer.currentStamps >= business.loyaltyConfig.totalStamps ? (
                      <button
                        onClick={handleRedeemReward}
                        className="w-full py-3 bg-[#22c55e] hover:bg-emerald-600 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20"
                      >
                        <Gift className="w-4 h-4" />
                        <span>Canjear {business.loyaltyConfig.rewardTitle}</span>
                      </button>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleAddStamp(1)}
                          className="py-3 bg-[#22c55e] hover:bg-emerald-600 text-white font-extrabold text-xs rounded-xl shadow-md shadow-emerald-500/20"
                        >
                          +1 Sello
                        </button>
                        <button
                          onClick={() => handleAddStamp(2)}
                          className="py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl"
                        >
                          +2 Sellos
                        </button>
                      </div>
                    )}

                    <button
                      onClick={() => {
                        setScannedCustomer(null);
                        setScanMessage(null);
                      }}
                      className="w-full py-2 text-slate-500 hover:text-slate-800 text-xs font-semibold"
                    >
                      Escanear siguiente cliente
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* VIEW: HISTORIAL DE SELLOS                                 */}
          {/* ========================================================= */}
          {activeSection === 'historial' && (
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="p-5 border-b border-slate-100">
                <h3 className="font-bold text-base text-slate-900">Historial de Sellos y Canjes</h3>
                <p className="text-xs text-slate-500">
                  Registro detallado de visitas validadas por el personal y premios canjeados.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4 font-bold">Fecha & Hora</th>
                      <th className="py-3 px-4 font-bold">Cliente</th>
                      <th className="py-3 px-4 font-bold">Operación</th>
                      <th className="py-3 px-4 font-bold">Sellos Otorgados</th>
                      <th className="py-3 px-4 font-bold">Atendido por</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {transactions.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-slate-500">
                          <div className="text-4xl mb-2">📜</div>
                          <p className="font-bold text-slate-800 text-sm">
                            No hay movimientos ni sellos registrados en {business.name} aún
                          </p>
                          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                            Cuando uses el escáner de caja para validar una visita o registres una venta, los movimientos quedarán auditados aquí.
                          </p>
                        </td>
                      </tr>
                    ) : (
                      transactions.map(t => (
                        <tr key={t.id} className="hover:bg-slate-50/80">
                          <td className="py-3 px-4 font-mono text-slate-500">
                            {new Date(t.createdAt).toLocaleDateString('es-MX', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </td>
                          <td className="py-3 px-4 font-bold text-slate-900">{t.customerName}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                t.type === 'REWARD_REDEEMED'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {t.type === 'REWARD_REDEEMED' ? '🎁 Canje de Premio' : '☑️ Sello de Visita'}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-bold text-emerald-600">
                            {t.type === 'REWARD_REDEEMED' ? 'Premio Entregado' : `+${t.stampsChanged}`}
                          </td>
                          <td className="py-3 px-4 text-slate-500">{t.staffName}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* VIEW: PUSH (NOTIFICACIONES A LA PANTALLA DE BLOQUEO)      */}
          {/* ========================================================= */}
          {activeSection === 'push' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="border-b border-slate-100 pb-4 mb-6">
                <h3 className="font-bold text-base text-slate-900">
                  Notificaciones Push a la Pantalla de Bloqueo
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Envía alertas y promociones directas a la pantalla de bloqueo de tus clientes sin costo de SMS.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <form onSubmit={handleSendPush} className="lg:col-span-7 space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Título de la Notificación
                    </label>
                    <input
                      type="text"
                      value={pushTitle}
                      onChange={e => setPushTitle(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Mensaje / Promoción
                    </label>
                    <textarea
                      rows={3}
                      value={pushMessage}
                      onChange={e => setPushMessage(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white outline-none"
                      required
                    />
                  </div>

                  {pushSentSuccess && (
                    <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-800 font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>¡Notificación Push enviada exitosamente a todos los pases Wallet!</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#22c55e] hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-500/20 flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Enviar Notificación Push Ahora</span>
                  </button>
                </form>

                {/* iPhone Lock Screen Simulator */}
                <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-slate-900 rounded-3xl text-white">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4">
                    Simulación en Pantalla de Bloqueo
                  </span>

                  <div className="w-full max-w-[280px] bg-slate-800/80 border border-slate-700 rounded-2xl p-4 shadow-xl backdrop-blur-md">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-2">
                      <div className="flex items-center gap-1.5 font-bold text-white">
                        <span>{business.logoUrl || '🍸'}</span>
                        <span>{business.name}</span>
                      </div>
                      <span>ahora</span>
                    </div>
                    <div className="font-bold text-xs text-white">{pushTitle}</div>
                    <div className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                      {pushMessage}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* VIEW: RESEÑAS DE GOOGLE                                   */}
          {/* ========================================================= */}
          {activeSection === 'resenas' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-6">
                <div>
                  <h3 className="font-bold text-base text-slate-900">Potenciador de Reseñas en Google Maps</h3>
                  <p className="text-xs text-slate-500">
                    Filtro inteligente de 5 estrellas: los comensales felices van a Google Maps; las quejas llegan a la gerencia en privado.
                  </p>
                </div>

                <a
                  href={business.googleReviews.googleReviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Ver Ficha en Google Maps</span>
                </a>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div>
                  <h4 className="font-bold text-xs text-slate-500 uppercase tracking-wider mb-3">
                    Probar el Filtro Inteligente de Calificación
                  </h4>
                  <GoogleReviewCard business={business} />
                </div>

                <div className="space-y-4">
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
                    <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                      <ShieldCheck className="w-5 h-5 text-emerald-600" />
                      <span>¿Cómo te protege el Filtro Inteligente?</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      • <strong>Si el comensal da 4 o 5 estrellas:</strong> Se abre Google Maps para que su reseña sea pública e impulse tu posicionamiento local.
                    </p>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      • <strong>Si el comensal da 1 a 3 estrellas:</strong> Se abre un formulario privado directo a la administración para resolver la queja de inmediato sin afectar tu rating público.
                    </p>
                  </div>

                  <button
                    onClick={() => handleOpenQr('reviews')}
                    className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow"
                  >
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span>Imprimir Stand de Mesa: "Califícanos en Google"</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* VIEW: MENÚ (ITEM BY ITEM: FOTOS, VIDEOS, PRECIOS)         */}
          {/* ========================================================= */}
          {activeSection === 'menu' && (
            <MenuManager
              business={business}
              menuItems={menuItems}
              initialTab="items"
              onUpdateBusiness={updated => {
                setBusinesses(prev =>
                  prev.map(b => (b.id === business.id ? { ...b, ...updated } : b))
                );
              }}
              onUpdateMenuItems={handleUpdateMenuItems}
            />
          )}

          {/* ========================================================= */}
          {/* VIEW: MENÚ LIBRO (SUBIR PDF / CARTA DISEÑADA)             */}
          {/* ========================================================= */}
          {activeSection === 'menu_libro' && (
            <MenuManager
              business={business}
              menuItems={menuItems}
              initialTab="pdf"
              onUpdateBusiness={updated => {
                setBusinesses(prev =>
                  prev.map(b => (b.id === business.id ? { ...b, ...updated } : b))
                );
              }}
              onUpdateMenuItems={handleUpdateMenuItems}
            />
          )}

          {/* ========================================================= */}
          {/* VIEW: INFOLINK                                            */}
          {/* ========================================================= */}
          {activeSection === 'infolink' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-6">
                <div>
                  <h3 className="font-bold text-base text-slate-900">InfoLink: Tu Mini-Sitio y Link en Bio</h3>
                  <p className="text-xs text-slate-500">
                    Centraliza tu menú interactivo o PDF, tarjeta Wallet y reseñas en una sola URL para tu biografía de Instagram y códigos QR.
                  </p>
                </div>

                <Link
                  href={`/${business.slug}`}
                  target="_blank"
                  className="px-4 py-2 bg-[#22c55e] hover:bg-emerald-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Abrir mi InfoLink en Vivo</span>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <span className="text-xs font-bold text-slate-700 block">URL de tu negocio:</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={`https://markethers.app/${business.slug}`}
                        className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-700"
                      />
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(`https://markethers.app/${business.slug}`);
                          alert('¡Enlace copiado al portapapeles!');
                        }}
                        className="px-3 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg"
                      >
                        Copiar
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenQr('infolink')}
                    className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2"
                  >
                    <QrCode className="w-4 h-4 text-emerald-400" />
                    <span>Descargar QR de InfoLink para Imprimir</span>
                  </button>
                </div>

                <div className="p-6 bg-slate-900 rounded-3xl text-center text-white space-y-3">
                  <div className="text-3xl">{business.logoUrl || '🍸'}</div>
                  <h4 className="font-bold text-sm">{business.name}</h4>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">{business.description}</p>
                  <div className="pt-2 flex justify-center">
                    <Link
                      href={`/${business.slug}`}
                      target="_blank"
                      className="px-4 py-2 bg-white text-slate-900 font-bold text-xs rounded-xl hover:bg-slate-100"
                    >
                      Probar experiencia cliente →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* VIEW: FACTURACIÓN & SUSCRIPCIÓN (STRIPE PAYMENTS)         */}
          {/* ========================================================= */}
          {activeSection === 'facturacion' && (
            <div className="space-y-6 animate-in fade-in">
              {/* Toast confirmation */}
              {planChangeToast && (
                <div className="p-4 bg-emerald-500 text-black font-extrabold text-xs rounded-2xl flex items-center justify-between shadow-lg shadow-emerald-500/20">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 fill-black text-emerald-500" />
                    <span>{planChangeToast}</span>
                  </div>
                  <button
                    onClick={() => setPlanChangeToast(null)}
                    className="p-1 hover:bg-black/10 rounded-lg text-black font-bold"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Header */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-black uppercase tracking-wider mb-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Facturación Segura con Stripe</span>
                  </div>
                  <h3 className="font-black text-xl text-slate-900 tracking-tight">
                    Suscripción & Métodos de Pago
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-xl">
                    Gestiona tu plan activo de Markethers, actualiza tus tarjetas bancarias y descarga tus comprobantes oficiales de pago.
                  </p>
                </div>

                {/* Billing cycle switcher button */}
                <button
                  onClick={handleToggleBillingCycle}
                  className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all active:scale-95 shrink-0"
                >
                  <Repeat className="w-3.5 h-3.5 text-emerald-400" />
                  <span>
                    Cambiar a {subscription.billingCycle === 'annual' ? 'Facturación Mensual' : 'Anual (Ahorra 35%)'}
                  </span>
                </button>
              </div>

              {/* Cards Grid: Active Plan + Payment Method */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                {/* Card 1: Active Subscription */}
                <div className="bg-white border-2 border-emerald-500/40 rounded-3xl p-6 shadow-sm flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-0 right-0 px-4 py-1.5 bg-gradient-to-l from-emerald-500 to-teal-500 text-black font-black text-[10px] uppercase tracking-wider rounded-bl-2xl shadow">
                    Prueba 14 Días Activa
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Tu Suscripción Actual
                    </span>
                    <h4 className="text-2xl font-black text-slate-900 tracking-tight">
                      {subscription.planName}
                    </h4>

                    <div className="mt-4 flex items-baseline gap-1.5">
                      <span className="text-4xl font-black text-slate-900">
                        ${subscription.price}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        USD / mes ({subscription.billingCycle === 'annual' ? 'facturado anualmente' : 'facturado mes a mes'})
                      </span>
                    </div>

                    <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5 text-xs text-slate-600">
                      <div className="flex items-center justify-between font-bold text-slate-800">
                        <span>Estado:</span>
                        <span className="text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full text-[11px]">
                          ● Activa (14 días gratis)
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Días restantes de prueba:</span>
                        <strong className="text-slate-900">{subscription.trialDaysLeft} días</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Próxima fecha de cobro:</span>
                        <span className="font-semibold text-slate-900">{subscription.trialEndsAt}</span>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2 text-xs text-slate-700">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                        <span>Tarjetas Apple Wallet & Google Wallet activas para clientes</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                        <span>Menú Digital visual con fotos, videos y visor PDF</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                        <span>Base de datos propia con exportación a CSV</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                        <span>Filtro Inteligente de Reseñas Google 5⭐</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400">¿Sin contratos forzosos?</span>
                    <button
                      onClick={() => {
                        if (confirm('¿Deseas cancelar tu suscripción? Puedes reactivarla en cualquier momento.')) {
                          alert('Tu suscripción continuará activa hasta el final de los 14 días de prueba.');
                        }
                      }}
                      className="text-slate-500 hover:text-red-600 font-bold underline transition-colors"
                    >
                      Cancelar suscripción con 1 clic
                    </button>
                  </div>
                </div>

                {/* Card 2: Stripe Payment Card */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Método de Pago Verificado
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold">
                        <ShieldCheck className="w-3 h-3 text-blue-600" />
                        <span>Stripe 256-Bit SSL</span>
                      </span>
                    </div>

                    {/* Styled Dark Credit Card */}
                    <div className="w-full bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-800 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden border border-slate-700">
                      <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

                      <div className="flex items-center justify-between mb-6">
                        <div className="w-10 h-7 rounded-md bg-gradient-to-r from-amber-300 to-amber-500 flex items-center justify-center shadow-inner">
                          <div className="w-6 h-4 border border-amber-800/40 rounded-sm" />
                        </div>
                        <span className="text-sm font-black italic tracking-wider text-slate-200">
                          {subscription.cardBrand.toUpperCase()}
                        </span>
                      </div>

                      <div className="font-mono text-lg sm:text-xl font-bold tracking-widest text-slate-100 mb-4">
                        •••• •••• •••• {subscription.cardLast4}
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
                        <div>
                          <span className="text-[9px] uppercase tracking-wider block text-slate-500">Titular</span>
                          <span className="font-bold text-white uppercase">{subscription.cardHolder}</span>
                        </div>
                        <div>
                          <span className="text-[9px] uppercase tracking-wider block text-slate-500">Vence</span>
                          <span className="font-mono font-bold text-white">12 / 28</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-emerald-50/70 border border-emerald-200/60 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Tarjeta autorizada con Stripe. <strong>$0.00 cobrados hoy.</strong></span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex gap-3">
                    <button
                      onClick={() => setIsUpdateCardModalOpen(true)}
                      className="flex-1 py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow transition-all active:scale-95"
                    >
                      <CreditCard className="w-4 h-4 text-emerald-400" />
                      <span>Actualizar Tarjeta / Método de Pago</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Plan Switcher Comparison Grid */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                <div>
                  <h4 className="font-black text-lg text-slate-900 tracking-tight">
                    Cambiar o Mejorar tu Plan de Markethers
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Elige el plan ideal según el tamaño de tu establecimiento. Los cambios se aplican al instante sin perder ningún dato de clientes o menú.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Starter Plan */}
                  <div
                    className={`rounded-2xl p-5 border-2 transition-all flex flex-col justify-between ${
                      subscription.planId === 'starter'
                        ? 'border-emerald-500 bg-emerald-50/20 shadow-md'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-black text-base text-slate-900">Plan Despegue</h5>
                        {subscription.planId === 'starter' && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
                            Plan Actual
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mb-4 min-h-[32px]">
                        Para locales pequeños que inician con menú digital y tarjetas de lealtad.
                      </p>
                      <div className="text-2xl font-black text-slate-900 mb-4">
                        ${subscription.billingCycle === 'annual' ? '19' : '29'}{' '}
                        <span className="text-xs text-slate-400 font-medium">USD / mes</span>
                      </div>
                      <ul className="space-y-2 text-xs text-slate-600 mb-6">
                        <li className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Hasta 400 clientes activos</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Menú Digital en mesa</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Tarjetas Apple & Google Wallet</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Escáner PWA para 2 meseros</span>
                        </li>
                      </ul>
                    </div>

                    <button
                      onClick={() => handleSelectPlan('starter')}
                      disabled={subscription.planId === 'starter'}
                      className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all ${
                        subscription.planId === 'starter'
                          ? 'bg-emerald-100 text-emerald-800 font-extrabold cursor-default'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                      }`}
                    >
                      {subscription.planId === 'starter' ? '✓ Plan Activo' : 'Cambiar a Despegue'}
                    </button>
                  </div>

                  {/* Pro Plan */}
                  <div
                    className={`rounded-2xl p-5 border-2 transition-all flex flex-col justify-between relative ${
                      subscription.planId === 'pro'
                        ? 'border-emerald-500 bg-emerald-50/20 shadow-md ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-emerald-500 to-lime-400 text-black text-[10px] font-black uppercase tracking-wider">
                      🔥 Más Elegido
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-black text-base text-slate-900">Plan Pro Markethers</h5>
                        {subscription.planId === 'pro' && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
                            Plan Actual
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mb-4 min-h-[32px]">
                        Para restaurantes y bares que quieren llenar mesas y dominar Google Maps.
                      </p>
                      <div className="text-2xl font-black text-slate-900 mb-4">
                        ${subscription.billingCycle === 'annual' ? '32' : '49'}{' '}
                        <span className="text-xs text-slate-400 font-medium">USD / mes</span>
                      </div>
                      <ul className="space-y-2 text-xs text-slate-600 mb-6">
                        <li className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span><strong>Clientes ILIMITADOS</strong></span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Menú con fotos Y VIDEOS de platillos</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Filtro de Reseñas Google Maps 5⭐</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>CRM con Exportación CSV & Push</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Escáneres ilimitados con PIN</span>
                        </li>
                      </ul>
                    </div>

                    <button
                      onClick={() => handleSelectPlan('pro')}
                      disabled={subscription.planId === 'pro'}
                      className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all ${
                        subscription.planId === 'pro'
                          ? 'bg-emerald-500 text-black font-extrabold cursor-default shadow-md shadow-emerald-500/20'
                          : 'bg-[#22c55e] hover:bg-emerald-600 text-black font-extrabold'
                      }`}
                    >
                      {subscription.planId === 'pro' ? '✓ Plan Activo' : 'Activar Plan Pro'}
                    </button>
                  </div>

                  {/* Franchise Plan */}
                  <div
                    className={`rounded-2xl p-5 border-2 transition-all flex flex-col justify-between ${
                      subscription.planId === 'franchise'
                        ? 'border-emerald-500 bg-emerald-50/20 shadow-md'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-black text-base text-slate-900">Multi-Sucursal</h5>
                        {subscription.planId === 'franchise' && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
                            Plan Actual
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mb-4 min-h-[32px]">
                        Para cadenas y marcas con varias sucursales y control centralizado.
                      </p>
                      <div className="text-2xl font-black text-slate-900 mb-4">
                        ${subscription.billingCycle === 'annual' ? '65' : '99'}{' '}
                        <span className="text-xs text-slate-400 font-medium">USD / mes</span>
                      </div>
                      <ul className="space-y-2 text-xs text-slate-600 mb-6">
                        <li className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Todo lo incluido en Pro</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Hasta 5 sucursales unificadas</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Dominio personalizado de marca</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Reportes comparativos y gerente</span>
                        </li>
                      </ul>
                    </div>

                    <button
                      onClick={() => handleSelectPlan('franchise')}
                      disabled={subscription.planId === 'franchise'}
                      className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all ${
                        subscription.planId === 'franchise'
                          ? 'bg-emerald-100 text-emerald-800 font-extrabold cursor-default'
                          : 'bg-slate-900 hover:bg-slate-800 text-white'
                      }`}
                    >
                      {subscription.planId === 'franchise' ? '✓ Plan Activo' : 'Mejorar a Multi-Sucursal'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Invoices & Receipts History */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                  <div>
                    <h4 className="font-bold text-base text-slate-900">Historial de Facturas & Comprobantes</h4>
                    <p className="text-xs text-slate-500">Recibos emitidos automáticamente por Stripe Payments.</p>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 bg-slate-50 text-slate-700 rounded-lg border border-slate-200">
                    2 Comprobantes
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4 font-bold">No. Recibo</th>
                        <th className="py-3 px-4 font-bold">Fecha</th>
                        <th className="py-3 px-4 font-bold">Concepto</th>
                        <th className="py-3 px-4 font-bold">Monto</th>
                        <th className="py-3 px-4 font-bold">Estado</th>
                        <th className="py-3 px-4 font-bold text-right">Comprobante</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      <tr className="hover:bg-slate-50/80">
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">MK-2026-001</td>
                        <td className="py-3 px-4 text-slate-500">Hoy (1 Nov 2026)</td>
                        <td className="py-3 px-4 font-medium">Activación Periodo de Prueba (14 Días)</td>
                        <td className="py-3 px-4 font-bold text-slate-900">$0.00 USD</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            Pagado
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleDownloadReceipt('MK-2026-001', '$0.00 USD', '1 Nov 2026')}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-bold text-xs transition-colors"
                          >
                            <Download className="w-3.5 h-3.5 text-slate-600" />
                            <span>Descargar</span>
                          </button>
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50/80">
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">MK-2026-002</td>
                        <td className="py-3 px-4 text-slate-500">{subscription.trialEndsAt}</td>
                        <td className="py-3 px-4 font-medium">Renovación {subscription.planName}</td>
                        <td className="py-3 px-4 font-bold text-slate-900">${subscription.price}.00 USD</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                            Programado
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className="text-[11px] text-slate-400 italic">Al finalizar prueba</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ========================================================= */}
      {/* 3. FLOATING ACTION SUPPORT / CHAT BUBBLE                   */}
      {/* ========================================================= */}
      <button
        onClick={() => setIsSupportChatOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-12 h-12 bg-[#22c55e] hover:bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-xl shadow-emerald-500/30 transition-transform hover:scale-110 active:scale-95"
        title="Asistente Markethers"
      >
        <MessageCircle className="w-6 h-6 fill-current" />
      </button>

      {/* ========================================================= */}
      {/* 4. MODALS (TUTORIAL, SEARCH, WHATSAPP, QR, SUPPORT)       */}
      {/* ========================================================= */}

      {/* Support Chat Dialog */}
      {isSupportChatOpen && (
        <div className="fixed bottom-20 right-6 z-50 w-80 sm:w-96 bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-2">
          <div className="bg-[#0a111a] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-emerald-500 text-black font-black text-xs flex items-center justify-center">
                M
              </div>
              <div>
                <h4 className="font-bold text-xs">Asistente Markethers</h4>
                <span className="text-[10px] text-emerald-400">En línea 24/7</span>
              </div>
            </div>
            <button
              onClick={() => setIsSupportChatOpen(false)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 space-y-3 h-64 overflow-y-auto bg-slate-50 text-xs">
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                  msg.sender === 'user'
                    ? 'ml-auto bg-[#22c55e] text-white font-medium rounded-br-none'
                    : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <form onSubmit={handleSendChatMessage} className="p-3 bg-white border-t border-slate-100 flex gap-2">
            <input
              type="text"
              placeholder="Escribe tu consulta..."
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <button
              type="submit"
              className="px-3 py-2 bg-[#22c55e] text-white font-bold text-xs rounded-xl shadow"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* Tutorial Modal */}
      {isTutorialOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 text-slate-900 shadow-2xl relative">
            <button
              onClick={() => setIsTutorialOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-emerald-600 mb-2">
              <Play className="w-5 h-5 fill-current" />
              <h3 className="font-black text-lg">Tutorial Rápido Markethers</h3>
            </div>
            <p className="text-xs text-slate-500 mb-6">
              Aprende en 3 pasos cómo fidelizar a tus comensales y multiplicar tus ventas.
            </p>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="w-6 h-6 rounded-full bg-emerald-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  1
                </span>
                <div>
                  <h4 className="font-bold text-slate-900">Diseña tu tarjeta Apple & Google Wallet</h4>
                  <p className="text-slate-500 mt-0.5">
                    Define cuántos sellos y cuál es el premio. Tus clientes la guardan en su celular sin descargar apps pesadas.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="w-6 h-6 rounded-full bg-emerald-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  2
                </span>
                <div>
                  <h4 className="font-bold text-slate-900">Sube tu Menú (Platillo por platillo o tu PDF)</h4>
                  <p className="text-slate-500 mt-0.5">
                    Agrega fotos y videos de tus platillos con precio, o sube directamente el diseño PDF de tu carta.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="w-6 h-6 rounded-full bg-emerald-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  3
                </span>
                <div>
                  <h4 className="font-bold text-slate-900">Escanea y acumula reseñas 5 estrellas</h4>
                  <p className="text-slate-500 mt-0.5">
                    Con el escáner web de tu celular sumas sellos en 1 segundo y activas el filtro inteligente de Google Maps.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setIsTutorialOpen(false)}
                className="px-5 py-2.5 bg-[#22c55e] hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-500/20"
              >
                ¡Entendido, vamos a empezar!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp Configuration Modal */}
      {isWhatsappModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 text-slate-900 shadow-2xl relative">
            <button
              onClick={() => setIsWhatsappModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-emerald-600 mb-2">
              <MessageCircle className="w-5 h-5" />
              <h3 className="font-black text-lg">Configurar WhatsApp del Negocio</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Ingresa el número al que deseas que lleguen los pedidos y los feedbacks de comensales.
            </p>

            <form onSubmit={handleSaveWhatsapp} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Número de WhatsApp (con código de país)
                </label>
                <input
                  type="text"
                  value={whatsappNumberInput}
                  onChange={e => setWhatsappNumberInput(e.target.value)}
                  placeholder="ej. 525577889900"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500/20"
                  required
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setIsWhatsappModalOpen(false)}
                  className="px-4 py-2 text-slate-500 hover:text-slate-800 text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#22c55e] hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-500/20"
                >
                  Guardar WhatsApp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Search Modal (⌘K) */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-4 shadow-2xl relative">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                autoFocus
                placeholder="Escribe para buscar... (Menú, Tarjetas, Clientes, QR, Reseñas)"
                value={searchFilter}
                onChange={e => setSearchFilter(e.target.value)}
                className="flex-1 text-xs outline-none text-slate-800"
              />
              <button
                onClick={() => setIsSearchOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xs"
              >
                ESC
              </button>
            </div>

            <div className="mt-3 space-y-1 text-xs max-h-60 overflow-y-auto">
              {[
                { label: 'Panel General', id: 'panel', icon: '📊' },
                { label: 'Tarjetas de Lealtad (Apple & Google Wallet)', id: 'tarjetas', icon: '💳' },
                { label: 'Directorio de Clientes VIP', id: 'clientes', icon: '👥' },
                { label: 'Escáner de Sellos para Caja', id: 'escaner', icon: '📷' },
                { label: 'Historial de Visitas & Sellos', id: 'historial', icon: '🕒' },
                { label: 'Notificaciones Push a la Pantalla de Bloqueo', id: 'push', icon: '🔔' },
                { label: 'Filtro Inteligente de Reseñas Google 5⭐', id: 'resenas', icon: '⭐' },
                { label: 'Menú Digital: Platillo por platillo (Fotos y Videos)', id: 'menu', icon: '🍽️' },
                { label: 'Menú Libro: Subir PDF de tu Carta Diseñada', id: 'menu_libro', icon: '📖' },
                { label: 'InfoLink: Mini-sitio y link en bio', id: 'infolink', icon: '📲' },
                { label: 'Suscripción & Métodos de Pago (Stripe)', id: 'facturacion', icon: '💳' },
              ]
                .filter(item => item.label.toLowerCase().includes(searchFilter.toLowerCase()))
                .map(item => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id as any);
                      setIsSearchOpen(false);
                    }}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 flex items-center gap-2.5 text-slate-700 font-medium"
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Update Payment Card Modal (Stripe) */}
      {isUpdateCardModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 text-slate-900 shadow-2xl relative">
            <button
              onClick={() => setIsUpdateCardModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-slate-900 mb-1">
              <CreditCard className="w-5 h-5 text-emerald-600" />
              <h3 className="font-black text-lg">Actualizar Tarjeta con Stripe</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Tus datos bancarios se transmiten con cifrado bancario TLS de 256 bits directo a Stripe.
            </p>

            <form onSubmit={handleSaveCard} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Nombre del Titular de la Tarjeta *
                </label>
                <input
                  type="text"
                  required
                  value={newCardHolder}
                  onChange={e => setNewCardHolder(e.target.value)}
                  placeholder="ej. Jaike Romero"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Número de Tarjeta (Stripe) *
                </label>
                <input
                  type="text"
                  required
                  maxLength={19}
                  value={newCardNumber}
                  onChange={e => {
                    const v = e.target.value.replace(/\D/g, '').slice(0, 16);
                    setNewCardNumber(v.replace(/(.{4})/g, '$1 ').trim());
                  }}
                  placeholder="4242 •••• •••• 4242"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Vencimiento (MM/AA) *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={5}
                    value={newCardExp}
                    onChange={e => {
                      const v = e.target.value.replace(/\D/g, '').slice(0, 4);
                      if (v.length > 2) {
                        setNewCardExp(v.slice(0, 2) + '/' + v.slice(2));
                      } else {
                        setNewCardExp(v);
                      }
                    }}
                    placeholder="12/28"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Código CVC / CVV *
                  </label>
                  <input
                    type="password"
                    required
                    maxLength={4}
                    value={newCardCvc}
                    onChange={e => setNewCardCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    placeholder="•••"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Código Postal de Facturación *
                </label>
                <input
                  type="text"
                  required
                  value={newCardZip}
                  onChange={e => setNewCardZip(e.target.value)}
                  placeholder="ej. 06700"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsUpdateCardModalOpen(false)}
                  className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#22c55e] hover:bg-emerald-600 text-white font-extrabold text-xs rounded-xl shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Guardar y Verificar con Stripe</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Registrar Venta / Cobro Manual */}
      {isRecordSaleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 text-slate-900 shadow-2xl relative">
            <button
              onClick={() => setIsRecordSaleModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <Receipt className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-lg">Registrar Venta / Movimiento</h3>
                <span className="text-xs text-slate-500 block">
                  Registra el cobro en caja y suma sellos de fidelización al cliente.
                </span>
              </div>
            </div>

            <form onSubmit={handleRecordSale} className="space-y-4 mt-5">
              {/* Cliente selector */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Cliente Registrado (Opcional)
                </label>
                <select
                  value={saleCustomerId}
                  onChange={e => {
                    const id = e.target.value;
                    setSaleCustomerId(id);
                    if (id) {
                      const c = customers.find(item => item.id === id);
                      if (c) {
                        setSaleCustomerName(c.name);
                        setSaleCustomerPhone(c.phone);
                      }
                    } else {
                      setSaleCustomerName('');
                      setSaleCustomerPhone('');
                    }
                  }}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none"
                >
                  <option value="">Comensal mostrador / Anónimo</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.phone}) • {c.currentStamps}/{business.loyaltyConfig.totalStamps} sellos
                    </option>
                  ))}
                </select>
              </div>

              {!saleCustomerId && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Nombre del Cliente (Mostrador)
                    </label>
                    <input
                      type="text"
                      placeholder="ej. Carlos / Mesa 2"
                      value={saleCustomerName}
                      onChange={e => setSaleCustomerName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Teléfono de Contacto
                    </label>
                    <input
                      type="tel"
                      placeholder="ej. +52 55 1234 5678"
                      value={saleCustomerPhone}
                      onChange={e => setSaleCustomerPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Monto & Sellos */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Monto de la Venta ($) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                    <input
                      type="number"
                      step="any"
                      required
                      placeholder="0.00"
                      value={saleAmount}
                      onChange={e => setSaleAmount(e.target.value)}
                      className="w-full pl-7 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Sellos a Otorgar *
                  </label>
                  <select
                    value={saleStampsToAward}
                    onChange={e => setSaleStampsToAward(Number(e.target.value))}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-emerald-700 outline-none"
                  >
                    {[1, 2, 3, 4, 5, 6].map(n => (
                      <option key={n} value={n}>
                        +{n} Sello(s) de fidelización
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Items summary */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Concepto / Detalle del Consumo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ej. 2x Mezcalitas Artesanales, 1x Tacos de Birria"
                  value={saleItemsSummary}
                  onChange={e => setSaleItemsSummary(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              {/* Payment method */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Método de Pago
                </label>
                <div className="grid grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setSalePaymentMethod('card')}
                    className={`py-2 px-2 text-center rounded-xl border text-xs font-bold transition-all ${
                      salePaymentMethod === 'card'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    💳 Tarjeta
                  </button>
                  <button
                    type="button"
                    onClick={() => setSalePaymentMethod('cash')}
                    className={`py-2 px-2 text-center rounded-xl border text-xs font-bold transition-all ${
                      salePaymentMethod === 'cash'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    💵 Efectivo
                  </button>
                  <button
                    type="button"
                    onClick={() => setSalePaymentMethod('apple_pay')}
                    className={`py-2 px-2 text-center rounded-xl border text-xs font-bold transition-all ${
                      salePaymentMethod === 'apple_pay'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    🍏 Apple Pay
                  </button>
                  <button
                    type="button"
                    onClick={() => setSalePaymentMethod('transfer')}
                    className={`py-2 px-2 text-center rounded-xl border text-xs font-bold transition-all ${
                      salePaymentMethod === 'transfer'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    📲 Transf.
                  </button>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsRecordSaleModalOpen(false)}
                  className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#22c55e] hover:bg-emerald-600 text-black font-extrabold text-xs rounded-xl shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Guardar Venta & Otorgar Sellos</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Registrar Nuevo Cliente en Base de Datos */}
      {isNewCustomerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 text-slate-900 shadow-2xl relative">
            <button
              onClick={() => setIsNewCustomerModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-lg">Nuevo Cliente en Base de Datos</h3>
                <span className="text-xs text-slate-500 block">
                  Genera la tarjeta de lealtad y activa su pase de Wallet.
                </span>
              </div>
            </div>

            <form onSubmit={handleAddNewCustomer} className="space-y-4 mt-5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Nombre Completo del Cliente *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ej. Valentina Flores"
                  value={newCustomerName}
                  onChange={e => setNewCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Teléfono / WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="ej. +52 55 1234 5678"
                  value={newCustomerPhone}
                  onChange={e => setNewCustomerPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Correo Electrónico (Opcional)
                </label>
                <input
                  type="email"
                  placeholder="ej. cliente@email.com"
                  value={newCustomerEmail}
                  onChange={e => setNewCustomerEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Sellos Iniciales
                  </label>
                  <select
                    value={newCustomerInitialStamps}
                    onChange={e => setNewCustomerInitialStamps(Number(e.target.value))}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none"
                  >
                    <option value={1}>1 Sello (Bienvenida)</option>
                    <option value={2}>2 Sellos</option>
                    <option value={3}>3 Sellos</option>
                    <option value={4}>4 Sellos</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Dispositivo Preferido
                  </label>
                  <select
                    value={newCustomerWalletType}
                    onChange={e => setNewCustomerWalletType(e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none"
                  >
                    <option value="apple">🍏 Apple Wallet</option>
                    <option value="google">🤖 Google Wallet</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Notas sobre el Cliente
                </label>
                <input
                  type="text"
                  placeholder="ej. Cliente frecuente, prefiere mesa en terraza"
                  value={newCustomerNotes}
                  onChange={e => setNewCustomerNotes(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsNewCustomerModalOpen(false)}
                  className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4 text-emerald-400 stroke-[3]" />
                  <span>Registrar en CRM</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Expediente & Ficha Detallada del Cliente */}
      {selectedCustomerDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-6 text-slate-900 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedCustomerDetail(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Profile header */}
            <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-400 to-teal-500 text-zinc-950 font-black text-lg flex items-center justify-center shadow-md">
                {selectedCustomerDetail.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-lg text-slate-900">
                    {selectedCustomerDetail.name}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black uppercase">
                    {selectedCustomerDetail.tier || 'Frecuente'}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 font-mono mt-0.5">
                  <span>{selectedCustomerDetail.phone}</span>
                  <span>•</span>
                  <span>{selectedCustomerDetail.qrCodeToken}</span>
                </div>
              </div>
            </div>

            {/* Quick stats grid */}
            <div className="grid grid-cols-3 gap-3 my-4">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Sellos Actuales
                </span>
                <span className="text-xl font-black text-emerald-600 mt-1 block">
                  {selectedCustomerDetail.currentStamps} de {business.loyaltyConfig.totalStamps}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Total Visitas
                </span>
                <span className="text-xl font-black text-slate-900 mt-1 block">
                  {selectedCustomerDetail.totalVisits}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Gasto Acumulado
                </span>
                <span className="text-xl font-black text-indigo-600 mt-1 block">
                  $ {(selectedCustomerDetail.totalSpent || 0).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Loyalty card preview */}
            <div className="p-4 rounded-2xl bg-[#0a111a] text-white my-4 relative overflow-hidden">
              <div className="flex items-center justify-between text-xs mb-3">
                <span className="font-bold flex items-center gap-1.5 text-emerald-400">
                  <CreditCard className="w-4 h-4" />
                  <span>Pase Oficial de {business.name}</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {selectedCustomerDetail.walletPassType === 'google' ? 'Google Wallet' : 'Apple Wallet'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Premio</span>
                  <span className="text-sm font-bold text-white block mt-0.5">
                    {business.loyaltyConfig.rewardTitle}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-emerald-400">
                    {selectedCustomerDetail.currentStamps}/{business.loyaltyConfig.totalStamps}
                  </span>
                </div>
              </div>
            </div>

            {/* Historial de movimientos de este cliente */}
            <div>
              <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wider mb-2">
                Historial de Visitas y Compras
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {transactions
                  .filter(t => t.customerId === selectedCustomerDetail.id || t.customerName === selectedCustomerDetail.name)
                  .map(t => (
                    <div key={t.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-800 block">
                          {t.notes || (t.type === 'REWARD_REDEEMED' ? 'Premio canjeado' : '+1 Sello')}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(t.createdAt).toLocaleString('es-MX')}
                        </span>
                      </div>
                      <span className="font-bold text-emerald-600">
                        {t.type === 'REWARD_REDEEMED' ? '🎁 Canje' : `+${t.stampsChanged} sellos`}
                      </span>
                    </div>
                  ))}
                {transactions.filter(t => t.customerId === selectedCustomerDetail.id || t.customerName === selectedCustomerDetail.name).length === 0 && (
                  <p className="text-xs text-slate-400 py-3 text-center">
                    Sin transacciones previas registradas.
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-100 mt-4 flex items-center gap-3">
              <a
                href={`https://wa.me/${selectedCustomerDetail.phone.replace(/\D/g, '')}?text=¡Hola ${selectedCustomerDetail.name}! Te escribimos de ${business.name}.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 bg-[#22c55e] hover:bg-emerald-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Contactar por WhatsApp</span>
              </a>
              <button
                type="button"
                onClick={() => {
                  setSelectedCustomerDetail(null);
                  setSaleCustomerId(selectedCustomerDetail.id);
                  setSaleCustomerName(selectedCustomerDetail.name);
                  setSaleCustomerPhone(selectedCustomerDetail.phone);
                  setIsRecordSaleModalOpen(true);
                }}
                className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Receipt className="w-4 h-4 text-emerald-400" />
                <span>Registrar Venta a Cliente</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stand QR Modal */}
      <CounterQrModal
        business={business}
        type={qrModalType}
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
      />
    </div>
  );
}
