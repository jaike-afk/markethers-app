'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { INITIAL_BUSINESSES, INITIAL_CUSTOMERS, INITIAL_MENU_ITEMS, INITIAL_TRANSACTIONS, INITIAL_SALES, INITIAL_MERCHANT_CLIENTS, INITIAL_EMAIL_CAMPAIGNS, INITIAL_TRACKED_QRS } from '@/lib/store';
import { Business, Customer, MenuItem, StampTransaction, SaleRecord, MerchantClientAccount, EmailCampaign, TrackedQRCode } from '@/types';
import QRCode from 'qrcode';
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
  Building,
  Wrench,
  KeyRound,
  AlertTriangle,
  Clock,
  RefreshCw,
  UserCheck,
  Mail,
  Copy,
  CheckCheck,
  FileSpreadsheet,
  SendHorizontal,
  Trash2,
  MapPin,
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
    | 'comercios'
    | 'ventas'
    | 'tarjetas'
    | 'clientes'
    | 'qr_studio'
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

  // Tracked QR Codes & Real-Time Scan Analytics State
  const [trackedQrs, setTrackedQrs] = useState<TrackedQRCode[]>(INITIAL_TRACKED_QRS);
  const [qrFilterType, setQrFilterType] = useState<'all' | 'menu' | 'loyalty' | 'table' | 'reviews'>('all');
  const [qrSearchQuery, setQrSearchQuery] = useState('');
  const [isCreateQrModalOpen, setIsCreateQrModalOpen] = useState(false);
  const [selectedTrackedQrForModal, setSelectedTrackedQrForModal] = useState<TrackedQRCode | null>(null);
  const [modalRenderedQrDataUrl, setModalRenderedQrDataUrl] = useState<string>('');

  // Form State for Creating New Tracked QR
  const [newQrName, setNewQrName] = useState('');
  const [newQrType, setNewQrType] = useState<'menu' | 'loyalty' | 'table' | 'reviews'>('menu');
  const [newQrLocation, setNewQrLocation] = useState('Mesas');
  const [newQrTableNumber, setNewQrTableNumber] = useState('');
  const [newQrNotes, setNewQrNotes] = useState('');

  // Master SaaS Merchant Portfolio & Technical Support Impersonation State
  const [merchantClients, setMerchantClients] = useState<MerchantClientAccount[]>(INITIAL_MERCHANT_CLIENTS);
  const [impersonatedMerchant, setImpersonatedMerchant] = useState<MerchantClientAccount | null>(null);
  const [merchantFilterStatus, setMerchantFilterStatus] = useState<'all' | 'active' | 'trialing' | 'past_due' | 'cancelled'>('all');
  const [merchantSearchQuery, setMerchantSearchQuery] = useState('');

  // Modals for Merchant Portfolio Management
  const [editingMerchantBilling, setEditingMerchantBilling] = useState<MerchantClientAccount | null>(null);
  const [isNewMerchantModalOpen, setIsNewMerchantModalOpen] = useState(false);
  const [newMerchantBusinessName, setNewMerchantBusinessName] = useState('');
  const [newMerchantOwnerName, setNewMerchantOwnerName] = useState('');
  const [newMerchantEmail, setNewMerchantEmail] = useState('');
  const [newMerchantPhone, setNewMerchantPhone] = useState('');
  const [newMerchantCity, setNewMerchantCity] = useState('');
  const [newMerchantCategory, setNewMerchantCategory] = useState('Restaurante');
  const [newMerchantPlan, setNewMerchantPlan] = useState<'starter' | 'pro' | 'franchise'>('pro');
  const [newMerchantStatus, setNewMerchantStatus] = useState<'active' | 'trialing' | 'past_due'>('trialing');
  const [newMerchantAmountDue, setNewMerchantAmountDue] = useState('0');
  const [newMerchantTotalPaid, setNewMerchantTotalPaid] = useState('0');
  const [newMerchantNotes, setNewMerchantNotes] = useState('');

  // Copy to Clipboard (Multi-platform Paste) State
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);
  const [copyModalContext, setCopyModalContext] = useState<'customers' | 'merchants'>('customers');
  const [copyModalFormat, setCopyModalFormat] = useState<'table' | 'emails' | 'phones'>('table');
  const [copyToast, setCopyToast] = useState<string | null>(null);

  // Email Marketing Campaign System State
  const [emailCampaigns, setEmailCampaigns] = useState<EmailCampaign[]>(INITIAL_EMAIL_CAMPAIGNS);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailContext, setEmailContext] = useState<'customers' | 'merchants'>('customers');
  const [emailAudienceFilter, setEmailAudienceFilter] = useState<string>('all');
  const [emailSelectedTemplate, setEmailSelectedTemplate] = useState<string>('promo');
  const [emailSubject, setEmailSubject] = useState<string>('');
  const [emailPreheader, setEmailPreheader] = useState<string>('');
  const [emailBody, setEmailBody] = useState<string>('');
  const [emailButtonText, setEmailButtonText] = useState<string>('Ver Menú & Tarjeta Digital');
  const [emailButtonUrl, setEmailButtonUrl] = useState<string>('');
  const [emailSenderName, setEmailSenderName] = useState<string>('');
  const [emailSendingState, setEmailSendingState] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [emailSendingProgress, setEmailSendingProgress] = useState<number>(0);
  const [emailDirectRecipient, setEmailDirectRecipient] = useState<{ name: string; email: string } | null>(null);
  const [isEmailHistoryModalOpen, setIsEmailHistoryModalOpen] = useState(false);
  const [emailCustomRecipients, setEmailCustomRecipients] = useState<string>('');
  const [emailTestAddress, setEmailTestAddress] = useState<string>('');
  const [resendApiKey, setResendApiKey] = useState<string>('');
  const [showEmailSettings, setShowEmailSettings] = useState<boolean>(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState<string | null>(null);

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
    { sender: 'bot', text: '¡Hola! Soy tu asistente de MenuBeacon. ¿En qué puedo ayudarte hoy con tu menú, tarjetas Wallet o reseñas?' },
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

  const handleExportMerchantsCSV = () => {
    const headers = [
      'ID',
      'Negocio',
      'Propietario',
      'Email',
      'Telefono',
      'Ciudad',
      'Categoria',
      'Estado',
      'Plan',
      'Lo Que Pagan (USD/mes)',
      'Ciclo Facturacion',
      'Lo Que Pagaron (USD)',
      'Lo Que Deben (USD)',
      'Proxima Facturacion',
      'Fecha Registro',
      'Notas',
    ];
    const rows = merchantClients.map(m => [
      `"${m.id}"`,
      `"${m.businessName}"`,
      `"${m.ownerName}"`,
      `"${m.email}"`,
      `"${m.phone}"`,
      `"${m.city}"`,
      `"${m.category}"`,
      `"${m.status}"`,
      `"${m.planName}"`,
      m.monthlyPrice,
      `"${m.billingCycle}"`,
      m.totalPaid,
      m.amountDue,
      `"${m.nextBillingDate}"`,
      `"${m.createdAt}"`,
      `"${m.notes || ''}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `cartera_clientes_saas_markethers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Subscription & Payment state (Stripe & Gateway)
  const [subscription, setSubscription] = useState({
    planId: 'pro' as 'starter' | 'pro' | 'franchise',
    planName: 'Plan Pro MenuBeacon',
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

      // Load or initialize SaaS Merchant Clients DB
      const storedMerchants = localStorage.getItem('markethers_merchant_clients_db');
      if (storedMerchants) {
        try {
          setMerchantClients(JSON.parse(storedMerchants));
        } catch {
          setMerchantClients(INITIAL_MERCHANT_CLIENTS);
        }
      } else {
        localStorage.setItem('markethers_merchant_clients_db', JSON.stringify(INITIAL_MERCHANT_CLIENTS));
      }

      // Load or initialize Email Campaigns DB
      const storedCampaigns = localStorage.getItem('markethers_email_campaigns_db');
      if (storedCampaigns) {
        try {
          setEmailCampaigns(JSON.parse(storedCampaigns));
        } catch {
          setEmailCampaigns(INITIAL_EMAIL_CAMPAIGNS);
        }
      } else {
        localStorage.setItem('markethers_email_campaigns_db', JSON.stringify(INITIAL_EMAIL_CAMPAIGNS));
      }

      // Load or initialize Tracked QRs DB
      const storedTrackedQrs = localStorage.getItem('markethers_tracked_qrs_db');
      if (storedTrackedQrs) {
        try {
          setTrackedQrs(JSON.parse(storedTrackedQrs));
        } catch {
          setTrackedQrs(INITIAL_TRACKED_QRS);
        }
      } else {
        localStorage.setItem('markethers_tracked_qrs_db', JSON.stringify(INITIAL_TRACKED_QRS));
      }

      const storedApiKey = localStorage.getItem('markethers_resend_api_key');
      if (storedApiKey) {
        setResendApiKey(storedApiKey);
      }

      setCurrentTimestamp(Date.now());
    } catch (e) {
      console.error(e);
      setAuthChecking(false);
    }
  }, [router]);

  const handleCopyFormattedList = (context: 'customers' | 'merchants', format: 'table' | 'emails' | 'phones') => {
    let textToCopy = '';
    let count = 0;

    if (context === 'customers') {
      if (format === 'table') {
        const headers = ['Nombre', 'Email', 'Teléfono', 'Visitas', 'Gasto Total ($)', 'Sellos Actuales', 'Nivel', 'Wallet Token', 'Notas'];
        const rows = customers.map(c => [
          c.name,
          c.email || '',
          c.phone,
          c.totalVisits,
          c.totalSpent || 0,
          c.currentStamps,
          (c.tier || 'nuevo').toUpperCase(),
          c.qrCodeToken,
          c.notes || '',
        ].join('\t'));
        textToCopy = [headers.join('\t'), ...rows].join('\n');
        count = customers.length;
      } else if (format === 'emails') {
        const validEmails = customers.map(c => c.email?.trim()).filter(Boolean) as string[];
        textToCopy = validEmails.join(', ');
        count = validEmails.length;
      } else {
        const phones = customers.map(c => c.phone.replace(/[^\d+]/g, '')).filter(Boolean);
        textToCopy = phones.join(', ');
        count = phones.length;
      }
    } else {
      // merchants
      if (format === 'table') {
        const headers = ['Negocio', 'Propietario', 'Email', 'Teléfono', 'Ciudad', 'Categoría', 'Estado', 'Plan', 'Lo Que Pagan ($/mes)', 'Lo Que Pagaron ($)', 'Lo Que Deben ($)', 'Próxima Facturación', 'Notas'];
        const rows = merchantClients.map(m => [
          m.businessName,
          m.ownerName,
          m.email,
          m.phone,
          m.city,
          m.category,
          m.status,
          m.planName,
          m.monthlyPrice,
          m.totalPaid,
          m.amountDue,
          m.nextBillingDate,
          m.notes || '',
        ].join('\t'));
        textToCopy = [headers.join('\t'), ...rows].join('\n');
        count = merchantClients.length;
      } else if (format === 'emails') {
        const validEmails = merchantClients.map(m => m.email.trim()).filter(Boolean);
        textToCopy = validEmails.join(', ');
        count = validEmails.length;
      } else {
        const phones = merchantClients.map(m => m.phone.replace(/[^\d+]/g, '')).filter(Boolean);
        textToCopy = phones.join(', ');
        count = phones.length;
      }
    }

    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(textToCopy);
      const formatLabels = {
        table: 'formato Tabla (Excel / Sheets / CRM)',
        emails: 'solo Correos Electrónicos (Mailchimp / Klaviyo / Gmail)',
        phones: 'solo Teléfonos / WhatsApp',
      };
      setCopyToast(`¡${count} contactos copiados en ${formatLabels[format]}! Abre tu otra plataforma y presiona Pegar (Ctrl+V / Cmd+V).`);
      setTimeout(() => setCopyToast(null), 5000);
      setIsCopyModalOpen(false);
    }
  };

  const openEmailCampaignModal = (
    context: 'customers' | 'merchants',
    singleRecipient?: { name: string; email: string }
  ) => {
    setEmailContext(context);
    setEmailSendingState('idle');
    setEmailSendingProgress(0);

    if (singleRecipient) {
      setEmailDirectRecipient(singleRecipient);
      setEmailAudienceFilter('single');
      setEmailSenderName(business.name);
      setEmailSubject(`Mensaje de ${business.name} para ${singleRecipient.name}`);
      setEmailPreheader('Tienes un mensaje directo de nuestro equipo.');
      setEmailBody(`Hola ${singleRecipient.name},\n\nNos ponemos en contacto contigo directamente desde ${business.name}.\n\n¿En qué podemos apoyarte hoy?`);
      setEmailButtonText('Ver Menú & Tarjeta');
      setEmailButtonUrl(typeof window !== 'undefined' ? `${window.location.origin}/${business.slug}` : 'https://markethers.app');
    } else {
      setEmailDirectRecipient(null);
      setEmailAudienceFilter('all');
      if (context === 'customers') {
        setEmailSenderName(business.name);
        setEmailSelectedTemplate('promo');
        setEmailSubject(`¡Fin de semana especial en ${business.name}! 🍹 Doble sello en tu visita`);
        setEmailPreheader(`Presenta tu tarjeta en Apple/Google Wallet y acumula más rápido tu ${business.loyaltyConfig.rewardTitle}.`);
        setEmailBody(`Hola {{nombre}},\n\n¡Queremos consentirte este fin de semana en ${business.name}!\n\nAl visitarnos y presentar tu tarjeta de fidelización en tu celular, te abonamos doble sello por tu consumo para que alcances antes tu recompensa:\n\n✨ ${business.loyaltyConfig.rewardTitle} ✨\n\n¡Te esperamos con el mejor servicio y ambiente!`);
        setEmailButtonText('Ver Menú & Abrir Tarjeta');
        setEmailButtonUrl(typeof window !== 'undefined' ? `${window.location.origin}/${business.slug}` : 'https://markethers.app');
      } else {
        setEmailSenderName('MenuBeacon (Markethers)');
        setEmailSelectedTemplate('update');
        setEmailSubject('Nuevas herramientas activadas en tu plataforma MenuBeacon (por Markethers) 🚀');
        setEmailPreheader('Descubre el nuevo sistema de campañas de correo y exportación.');
        setEmailBody(`Hola {{nombre}},\n\nTe saludamos del equipo de MenuBeacon (un producto de Markethers). Hemos liberado una actualización importante en tu panel de control:\n\n1. Sistema integrado de Campañas de Email para tus comensales.\n2. Exportación directa compatible con Mailchimp, Excel y Google Sheets.\n3. Métricas en vivo y modo soporte técnico.\n\nPuedes entrar a tu cuenta para probarlas hoy mismo.`);
        setEmailButtonText('Acceder a mi Panel');
        setEmailButtonUrl('https://markethers.app/app');
      }
    }

    setIsEmailModalOpen(true);
  };

  const handleApplyEmailTemplate = (templateId: string) => {
    setEmailSelectedTemplate(templateId);
    if (emailContext === 'customers') {
      if (templateId === 'promo') {
        setEmailSubject(`¡Fin de semana especial en ${business.name}! 🍹 Doble sello en tu visita`);
        setEmailPreheader(`Presenta tu tarjeta Wallet y duplica tus beneficios.`);
        setEmailBody(`Hola {{nombre}},\n\n¡Queremos consentirte este fin de semana en ${business.name}!\n\nPresenta tu tarjeta en Apple o Google Wallet al pagar tu consumo y recibe doble sello para estar más cerca de tu premio:\n\n✨ ${business.loyaltyConfig.rewardTitle} ✨\n\n¡Te esperamos con la mesa lista!`);
        setEmailButtonText('Ver Menú & Tarjeta');
      } else if (templateId === 'menu') {
        setEmailSubject(`Descubre los nuevos platillos y bebidas en ${business.name} 🍽️`);
        setEmailPreheader(`Actualizamos nuestra carta con nuevas recetas artesanales.`);
        setEmailBody(`Hola {{nombre}},\n\nTenemos grandes novedades gastronómicas en ${business.name}. Acabamos de incorporar nuevos platillos y especialidades elaboradas con ingredientes frescos.\n\nVen a probar nuestras creaciones de la temporada y acumula sellos en tu pase digital.`);
        setEmailButtonText('Explorar Nuevo Menú');
      } else if (templateId === 'reactivation') {
        setEmailSubject(`¡Hola {{nombre}}! Hace tiempo que no nos vemos en ${business.name} 🎁`);
        setEmailPreheader(`Te regalamos 1 sello de cortesía en tu próxima visita.`);
        setEmailBody(`Hola {{nombre}},\n\n¡Te hemos echado de menos en ${business.name}!\n\nPara celebrar tu regreso, en tu próxima visita te obsequiamos 1 sello de cortesía directo en tu tarjeta digital en Apple o Google Wallet.\n\n¡Vuelve a visitarnos pronto!`);
        setEmailButtonText('Abrir mi Tarjeta Digital');
      } else if (templateId === 'reviews') {
        setEmailSubject(`¿Cómo fue tu experiencia en ${business.name}? ⭐`);
        setEmailPreheader(`Tu opinión nos ayuda a mejorar y te recompensa.`);
        setEmailBody(`Hola {{nombre}},\n\nMuchas gracias por visitarnos en ${business.name}. Tu experiencia es lo más importante para todo nuestro equipo.\n\n¿Nos regalarías 1 minuto de tu tiempo dejándonos tu reseña en Google? Nos ayudaría muchísimo y te regalamos un sello adicional en tu próxima visita.`);
        setEmailButtonText('Dejar Reseña en Google');
        setEmailButtonUrl(business.googleReviews.googleReviewUrl);
      } else {
        setEmailSubject(`Mensaje de ${business.name}`);
        setEmailPreheader('Novedades para ti.');
        setEmailBody(`Hola {{nombre}},\n\nTe escribimos desde ${business.name} para compartirte novedades...`);
        setEmailButtonText('Ver Detalles');
      }
    } else {
      // merchants context
      if (templateId === 'update') {
        setEmailSubject('Novedades y mejoras activadas en tu cuenta de MenuBeacon 🚀');
        setEmailPreheader('Herramientas diseñadas para aumentar la lealtad y el ticket promedio.');
        setEmailBody(`Estimado(a) {{nombre}},\n\nTe informamos que tu plataforma MenuBeacon (un producto de Markethers) cuenta con nuevas herramientas:\n\n- Campañas de email marketing masivo para comensales.\n- Exportación compatible con Excel, Google Sheets y Mailchimp.\n- Tarjetas de Apple & Google Wallet optimizadas.\n\nRevisa tu panel de administración para comenzar a utilizarlas.`);
        setEmailButtonText('Entrar a mi Panel');
      } else if (templateId === 'billing') {
        setEmailSubject(`Estado de Cuenta y Notificación de Facturación - {{negocio}}`);
        setEmailPreheader('Resumen de tu suscripción en MenuBeacon.');
        setEmailBody(`Hola {{nombre}},\n\nTe saludamos del área administrativa de MenuBeacon (Markethers). Te recordamos el estado de tu cuenta correspondiente a {{negocio}}:\n\n- Cuota mensual programada.\n- Si requieres comprobante fiscal o asistencia para conciliar tu saldo, responde a este correo y nuestro equipo te atenderá con gusto.`);
        setEmailButtonText('Ver Estado de Cuenta');
      } else {
        setEmailSubject(`Aviso importante para {{negocio}}`);
        setEmailPreheader('Comunicado de MenuBeacon.');
        setEmailBody(`Hola {{nombre}},\n\nNos comunicamos respecto a tu cuenta en {{negocio}}...`);
        setEmailButtonText('Ir al Panel');
      }
    }
  };

  const getRecipientEmailsList = (): { emails: string[]; count: number } => {
    if (emailDirectRecipient) {
      return { emails: [emailDirectRecipient.email], count: 1 };
    }
    if (emailContext === 'customers') {
      let filtered = customers;
      if (emailAudienceFilter === 'vip') {
        filtered = customers.filter(c => c.tier === 'vip' || (c.totalSpent || 0) > 500);
      } else if (emailAudienceFilter === 'frecuente') {
        filtered = customers.filter(c => c.totalVisits >= 2);
      } else if (emailAudienceFilter === 'inactivos') {
        filtered = customers.filter(c => c.totalVisits <= 1);
      }
      const valid = filtered.map(c => c.email?.trim()).filter(Boolean) as string[];
      let combined = [...valid];
      if (emailCustomRecipients.trim()) {
        const parsedCustom = emailCustomRecipients
          .split(/[\n,;]+/)
          .map(e => e.trim())
          .filter(e => e.includes('@'));
        combined = [...combined, ...parsedCustom];
      }
      const unique = Array.from(new Set(combined));
      return { emails: unique, count: unique.length };
    } else {
      let filtered = merchantClients;
      if (emailAudienceFilter === 'active') {
        filtered = merchantClients.filter(m => m.status === 'active');
      } else if (emailAudienceFilter === 'trialing') {
        filtered = merchantClients.filter(m => m.status === 'trialing');
      } else if (emailAudienceFilter === 'past_due') {
        filtered = merchantClients.filter(m => m.status === 'past_due');
      }
      const valid = filtered.map(m => m.email.trim()).filter(Boolean);
      let combined = [...valid];
      if (emailCustomRecipients.trim()) {
        const parsedCustom = emailCustomRecipients
          .split(/[\n,;]+/)
          .map(e => e.trim())
          .filter(e => e.includes('@'));
        combined = [...combined, ...parsedCustom];
      }
      const unique = Array.from(new Set(combined));
      return { emails: unique, count: unique.length };
    }
  };

  const getGmailComposeUrl = () => {
    const { emails } = getRecipientEmailsList();
    const bcc = encodeURIComponent(emails.join(','));
    const subject = encodeURIComponent(emailSubject.replace('{{nombre}}', 'Estimado cliente').replace('{{negocio}}', business.name));
    const body = encodeURIComponent(
      `${emailBody.replace('{{nombre}}', 'Estimado cliente').replace('{{negocio}}', business.name)}\n\n${emailButtonText ? `👉 ${emailButtonText}: ${emailButtonUrl}\n\n` : ''}---\nEnviado desde ${business.name}`
    );
    return `https://mail.google.com/mail/?view=cm&fs=1&bcc=${bcc}&su=${subject}&body=${body}`;
  };

  const getOutlookComposeUrl = () => {
    const { emails } = getRecipientEmailsList();
    const bcc = encodeURIComponent(emails.join(';'));
    const subject = encodeURIComponent(emailSubject.replace('{{nombre}}', 'Estimado cliente').replace('{{negocio}}', business.name));
    const body = encodeURIComponent(
      `${emailBody.replace('{{nombre}}', 'Estimado cliente').replace('{{negocio}}', business.name)}\n\n${emailButtonText ? `👉 ${emailButtonText}: ${emailButtonUrl}\n\n` : ''}---\nEnviado desde ${business.name}`
    );
    return `https://outlook.live.com/mail/0/deeplink/compose?bcc=${bcc}&subject=${subject}&body=${body}`;
  };

  const handleSendTestEmail = async () => {
    if (!emailTestAddress || !emailTestAddress.includes('@')) {
      alert('Por favor ingresa una dirección de correo válida para la prueba (ej: tu-correo@gmail.com).');
      return;
    }
    setEmailSendingState('sending');
    setEmailSendingProgress(30);
    setEmailErrorMessage(null);

    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipients: [emailTestAddress.trim()],
          subject: `[PRUEBA] ${emailSubject.replace('{{nombre}}', 'Prueba').replace('{{negocio}}', business.name)}`,
          body: emailBody.replace('{{nombre}}', 'Prueba').replace('{{negocio}}', business.name),
          senderName: emailSenderName || business.name,
          buttonText: emailButtonText,
          buttonUrl: emailButtonUrl,
          apiKey: resendApiKey,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al enviar prueba');

      setEmailSendingState('idle');
      if (data.mode === 'resend_api') {
        alert(`¡Correo de prueba enviado con éxito a ${emailTestAddress} vía Resend API! Revisa tu bandeja de entrada.`);
      } else {
        const testUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(emailTestAddress.trim())}&su=${encodeURIComponent(`[PRUEBA] ${emailSubject.replace('{{nombre}}', 'Prueba').replace('{{negocio}}', business.name)}`)}&body=${encodeURIComponent(emailBody.replace('{{nombre}}', 'Prueba').replace('{{negocio}}', business.name))}`;
        window.open(testUrl, '_blank');
      }
    } catch (e: any) {
      setEmailSendingState('idle');
      alert(`Error al enviar prueba: ${e.message}`);
    }
  };

  const handleSaveResendApiKey = (key: string) => {
    setResendApiKey(key);
    if (typeof window !== 'undefined') {
      localStorage.setItem('markethers_resend_api_key', key.trim());
    }
    setCopyToast('Clave de API de Resend guardada correctamente');
    setTimeout(() => setCopyToast(null), 3000);
  };

  const handleSendEmailCampaign = async (e?: React.FormEvent) => {
    if (e && e.preventDefault) e.preventDefault();
    setEmailErrorMessage(null);
    const { emails, count } = getRecipientEmailsList();
    if (count === 0) {
      alert('No hay contactos con correo electrónico en la audiencia seleccionada. Agrega direcciones en la casilla "Correos adicionales".');
      return;
    }

    setEmailSendingState('sending');
    setEmailSendingProgress(25);

    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipients: emails,
          subject: emailSubject.replace('{{nombre}}', 'Estimado cliente').replace('{{negocio}}', business.name),
          body: emailBody.replace('{{nombre}}', 'Estimado cliente').replace('{{negocio}}', business.name),
          senderName: emailSenderName || business.name,
          replyTo: emailContext === 'customers' ? (business.phone ? `contacto@${business.slug}.com` : 'hola@markethers.app') : 'administracion@markethers.app',
          buttonText: emailButtonText,
          buttonUrl: emailButtonUrl,
          apiKey: resendApiKey,
        }),
      });

      setEmailSendingProgress(75);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al conectar con el servicio de correo.');
      }

      setEmailSendingProgress(100);
      setEmailSendingState('success');

      const newCampaign: EmailCampaign = {
        id: `camp_${Date.now()}`,
        businessId: emailContext === 'customers' ? business.id : 'admin_master',
        senderName: emailSenderName || business.name,
        replyTo: emailContext === 'customers' ? (business.phone ? `contacto@${business.slug}.com` : 'hola@markethers.app') : 'administracion@markethers.app',
        subject: emailSubject,
        preheader: emailPreheader,
        body: emailBody,
        buttonText: emailButtonText,
        buttonUrl: emailButtonUrl,
        audience: emailDirectRecipient ? `Directo a ${emailDirectRecipient.name}` : `${emailAudienceFilter} (${count} destinatarios)`,
        recipientsCount: count,
        recipientEmails: emails,
        status: 'sent',
        sentAt: new Date().toISOString(),
        templateType: emailSelectedTemplate,
      };

      const updatedCampaigns = [newCampaign, ...emailCampaigns];
      setEmailCampaigns(updatedCampaigns);
      if (typeof window !== 'undefined') {
        localStorage.setItem('markethers_email_campaigns_db', JSON.stringify(updatedCampaigns));
      }

      if (data.mode === 'resend_api') {
        setCopyToast(`¡Campaña de email entregada con éxito a ${count} contacto(s) vía Resend API! 🚀`);
      } else {
        setCopyToast(`¡Campaña registrada para ${count} contacto(s)! Puedes abrirla también con 1-clic en Gmail.`);
      }

      setTimeout(() => {
        setIsEmailModalOpen(false);
        setEmailSendingState('idle');
      }, 1600);
    } catch (err: any) {
      console.error(err);
      setEmailSendingState('error');
      setEmailErrorMessage(err?.message || 'Error al enviar la campaña de correo');
    }
  };

  const saveMerchantClientsList = (updated: MerchantClientAccount[]) => {
    setMerchantClients(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('markethers_merchant_clients_db', JSON.stringify(updated));
    }
  };

  const handleUpdateMerchantBilling = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMerchantBilling) return;
    const updated = merchantClients.map(m => {
      if (m.id === editingMerchantBilling.id) {
        return editingMerchantBilling;
      }
      return m;
    });
    saveMerchantClientsList(updated);
    setEditingMerchantBilling(null);
  };

  const handleQuickMarkPaid = (client: MerchantClientAccount) => {
    const updated = merchantClients.map(m => {
      if (m.id === client.id) {
        return {
          ...m,
          totalPaid: Number(m.totalPaid) + Number(m.amountDue),
          amountDue: 0,
          status: (m.status === 'past_due' ? 'active' : m.status) as 'active' | 'trialing' | 'past_due' | 'cancelled',
          notes: `${m.notes || ''} [Cobro registrado ${new Date().toLocaleDateString('es-ES')}]`.trim(),
        };
      }
      return m;
    });
    saveMerchantClientsList(updated);
  };

  const handleCreateNewMerchant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMerchantBusinessName.trim() || !newMerchantOwnerName.trim()) return;

    const planNames: Record<string, string> = {
      starter: 'Plan Despegue',
      pro: 'Plan Pro MenuBeacon',
      franchise: 'Plan Multi-Sucursal',
    };
    const planPrices: Record<string, number> = {
      starter: 29,
      pro: 49,
      franchise: 99,
    };

    const newClient: MerchantClientAccount = {
      id: `merch_${Date.now()}`,
      businessId: `biz_${Date.now()}`,
      businessName: newMerchantBusinessName.trim(),
      ownerName: newMerchantOwnerName.trim(),
      email: newMerchantEmail.trim().toLowerCase(),
      phone: newMerchantPhone.trim() || '+52 55 0000 0000',
      city: newMerchantCity.trim() || 'Ciudad de México',
      category: newMerchantCategory,
      status: newMerchantStatus,
      planId: newMerchantPlan,
      planName: planNames[newMerchantPlan] || 'Plan Pro MenuBeacon',
      billingCycle: 'monthly',
      monthlyPrice: planPrices[newMerchantPlan] || 49,
      totalPaid: parseFloat(newMerchantTotalPaid) || 0,
      amountDue: parseFloat(newMerchantAmountDue) || 0,
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      cardLast4: '4242',
      cardBrand: 'Visa',
      notes: newMerchantNotes.trim() || 'Comercio agregado manualmente por el Propietario.',
    };

    // Provision matching Business entry
    const newBiz: Business = {
      id: newClient.businessId,
      slug: newClient.businessName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      name: newClient.businessName,
      tagline: newClient.category,
      description: `Comercio gestionado en MenuBeacon - ${newClient.city}`,
      category: newClient.category,
      logoUrl: '🏢',
      coverUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
      phone: newClient.phone,
      whatsapp: newClient.phone.replace(/\D/g, ''),
      instagram: '',
      address: newClient.city,
      city: newClient.city,
      pinCode: '1234',
      currency: '$',
      loyaltyConfig: {
        totalStamps: 6,
        rewardTitle: 'Recompensa de Fidelidad',
        rewardDescription: 'Válido al completar 6 sellos en tu celular.',
        stampIcon: 'gift',
        cardBgColor: '#0a111a',
        cardTextColor: '#ffffff',
        accentColor: '#22c55e',
        terms: 'Un sello por consumo.',
        allowCashback: false,
      },
      googleReviews: {
        googleReviewUrl: 'https://search.google.com/',
        googleRating: 5.0,
        totalReviews: 5,
        rewardForReview: '+1 Sello extra',
        smartFilterEnabled: true,
      },
      menuDisplayMode: 'both',
    };

    setBusinesses(prev => [newBiz, ...prev]);
    if (typeof window !== 'undefined') {
      const existingBizList = JSON.parse(localStorage.getItem('markethers_custom_businesses') || '[]');
      localStorage.setItem('markethers_custom_businesses', JSON.stringify([...existingBizList, newBiz]));
    }

    saveMerchantClientsList([newClient, ...merchantClients]);
    setIsNewMerchantModalOpen(false);
    setNewMerchantBusinessName('');
    setNewMerchantOwnerName('');
    setNewMerchantEmail('');
    setNewMerchantPhone('');
    setNewMerchantCity('');
    setNewMerchantNotes('');
    setNewMerchantAmountDue('0');
    setNewMerchantTotalPaid('0');
  };

  const handleImpersonate = (client: MerchantClientAccount) => {
    const existing = businesses.find(b => b.id === client.businessId);
    if (!existing) {
      const mockBiz: Business = {
        id: client.businessId,
        slug: client.businessName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        name: client.businessName,
        tagline: client.category,
        description: `Comercio gestionado en MenuBeacon - ${client.city}`,
        category: client.category,
        logoUrl: '🏢',
        coverUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
        phone: client.phone,
        whatsapp: client.phone.replace(/\D/g, ''),
        instagram: '',
        address: client.city,
        city: client.city,
        pinCode: '1234',
        currency: '$',
        loyaltyConfig: {
          totalStamps: 6,
          rewardTitle: 'Recompensa de Fidelidad',
          rewardDescription: 'Válido al completar 6 sellos en tu celular.',
          stampIcon: 'gift',
          cardBgColor: '#0a111a',
          cardTextColor: '#ffffff',
          accentColor: '#22c55e',
          terms: 'Un sello por consumo.',
          allowCashback: false,
        },
        googleReviews: {
          googleReviewUrl: 'https://search.google.com/',
          googleRating: 5.0,
          totalReviews: 10,
          rewardForReview: '+1 Sello extra',
          smartFilterEnabled: true,
        },
        menuDisplayMode: 'both',
      };
      setBusinesses(prev => [mockBiz, ...prev]);
    }

    setSelectedBusinessId(client.businessId);
    setImpersonatedMerchant(client);
    setActiveSection('panel');
  };

  const handleExitImpersonation = () => {
    setImpersonatedMerchant(null);
    setSelectedBusinessId(INITIAL_BUSINESSES[0].id);
    setActiveSection('comercios');
  };

  const handleSelectPlan = (planId: 'starter' | 'pro' | 'franchise') => {
    const planDetails = {
      starter: { name: 'Plan Despegue', priceMonthly: 29, priceAnnual: 19 },
      pro: { name: 'Plan Pro MenuBeacon', priceMonthly: 49, priceAnnual: 32 },
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
    link.download = `Recibo_${receiptId}_MenuBeacon.txt`;
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

  // Real-Time Analytics & Computed Stats for Tracked QRs
  const businessTrackedQrs = trackedQrs.filter(q => q.businessId === business.id);
  const totalQrScans = businessTrackedQrs.reduce((sum, q) => sum + (q.scansCount || 0), 0);
  const totalQrScansToday = businessTrackedQrs.reduce((sum, q) => sum + (q.scansToday || 0), 0);
  const totalMenuScans = businessTrackedQrs
    .filter(q => q.type === 'menu' || q.type === 'table')
    .reduce((sum, q) => sum + (q.scansCount || 0), 0);
  const totalLoyaltyScans = businessTrackedQrs
    .filter(q => q.type === 'loyalty')
    .reduce((sum, q) => sum + (q.scansCount || 0), 0);
  const topScannedQr = [...businessTrackedQrs].sort((a, b) => (b.scansCount || 0) - (a.scansCount || 0))[0] || null;

  const filteredTrackedQrs = businessTrackedQrs.filter(qr => {
    if (qrFilterType !== 'all' && qr.type !== qrFilterType) return false;
    if (qrSearchQuery.trim()) {
      const q = qrSearchQuery.toLowerCase();
      const matchName = qr.name.toLowerCase().includes(q);
      const matchLocation = qr.location?.toLowerCase().includes(q) || false;
      const matchTable = qr.tableNumber?.toLowerCase().includes(q) || false;
      const matchNotes = qr.notes?.toLowerCase().includes(q) || false;
      return matchName || matchLocation || matchTable || matchNotes;
    }
    return true;
  });

  const handleCreateTrackedQr = () => {
    if (!newQrName.trim()) return;

    const newId = `qr-${Date.now().toString(36)}`;
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://menubeacon.app';

    let targetUrl = `${origin}/${business.slug}?qr=${newId}`;
    if (newQrType === 'menu') {
      targetUrl += `&tab=menu`;
    } else if (newQrType === 'loyalty') {
      targetUrl += `&tab=card`;
    } else if (newQrType === 'table') {
      targetUrl += `&tab=menu`;
      if (newQrTableNumber.trim()) {
        targetUrl += `&table=${encodeURIComponent(newQrTableNumber.trim())}`;
      }
    } else if (newQrType === 'reviews') {
      targetUrl += `&tab=info`;
    }

    const newTrackedQr: TrackedQRCode = {
      id: newId,
      businessId: business.id,
      name: newQrName.trim(),
      type: newQrType,
      targetUrl,
      location: newQrLocation.trim() || undefined,
      tableNumber: newQrTableNumber.trim() || undefined,
      scansCount: 0,
      scansToday: 0,
      createdAt: new Date().toISOString(),
      notes: newQrNotes.trim() || undefined,
      isActive: true,
    };

    const updated = [newTrackedQr, ...trackedQrs];
    setTrackedQrs(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('markethers_tracked_qrs_db', JSON.stringify(updated));
    }

    setNewQrName('');
    setNewQrType('menu');
    setNewQrLocation('Mesas');
    setNewQrTableNumber('');
    setNewQrNotes('');
    setIsCreateQrModalOpen(false);

    setCopyToast(`¡Código QR "${newTrackedQr.name}" generado exitosamente!`);
    setTimeout(() => setCopyToast(null), 3500);
  };

  const handleSimulateScan = (qrId: string) => {
    const updated = trackedQrs.map(qr => {
      if (qr.id === qrId) {
        return {
          ...qr,
          scansCount: (qr.scansCount || 0) + 1,
          scansToday: (qr.scansToday || 0) + 1,
          lastScannedAt: new Date().toISOString(),
        };
      }
      return qr;
    });
    setTrackedQrs(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('markethers_tracked_qrs_db', JSON.stringify(updated));
    }
    const found = updated.find(q => q.id === qrId);
    setCopyToast(`¡Visita registrada! Escaneo contabilizado en "${found?.name || 'QR'}" (+1 visita)`);
    setTimeout(() => setCopyToast(null), 3500);
  };

  const handleDeleteTrackedQr = (qrId: string) => {
    if (typeof window !== 'undefined' && !window.confirm('¿Seguro que deseas eliminar este código QR de tu catálogo?')) {
      return;
    }
    const updated = trackedQrs.filter(q => q.id !== qrId);
    setTrackedQrs(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('markethers_tracked_qrs_db', JSON.stringify(updated));
    }
    setCopyToast('Código QR eliminado de tu catálogo');
    setTimeout(() => setCopyToast(null), 3000);
  };

  const handleOpenQrStandModal = async (qr: TrackedQRCode) => {
    setSelectedTrackedQrForModal(qr);
    try {
      const dataUrl = await QRCode.toDataURL(qr.targetUrl, {
        width: 600,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
      });
      setModalRenderedQrDataUrl(dataUrl);
    } catch (e) {
      console.error('Error rendering QR data URL for stand modal:', e);
    }
  };

  const handleQuickCreateMenuQr = () => {
    setNewQrName('Menú Digital Principal');
    setNewQrType('menu');
    setNewQrLocation('Comedor Principal');
    setNewQrTableNumber('');
    setNewQrNotes('Código QR para consultar la carta y platos');
    setIsCreateQrModalOpen(true);
  };

  const handleQuickCreateLoyaltyQr = () => {
    setNewQrName('Plan de Afiliación & Tarjeta Wallet');
    setNewQrType('loyalty');
    setNewQrLocation('Caja / Mostrador');
    setNewQrTableNumber('');
    setNewQrNotes('Código QR para que los clientes se afilien a Apple & Google Wallet');
    setIsCreateQrModalOpen(true);
  };

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
          text: 'Gracias por tu consulta. Tu equipo de soporte de MenuBeacon (Markethers) está conectado 24/7 para ayudarte a maximizar tus clientes recurrentes.',
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
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex font-sans antialiased overflow-x-hidden max-w-full w-full">
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
          <div className="mb-2">
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

          {/* EXCLUSIVE OWNER / MANAGER SAAS CLIENTS PORTFOLIO */}
          {isOwner && (
            <div className="mb-4">
              <button
                onClick={() => {
                  setActiveSection('comercios');
                  setMobileSidebarOpen(false);
                }}
                className={`w-full py-2.5 px-3.5 rounded-xl flex items-center justify-between text-xs font-bold transition-all shadow-md ${
                  activeSection === 'comercios'
                    ? 'bg-amber-500 text-slate-950 shadow-amber-500/20 font-extrabold'
                    : 'bg-amber-500/10 border border-amber-500/20 text-amber-300 hover:bg-amber-500/20 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Building className="w-4 h-4 stroke-[2.5]" />
                  <span>Cartera de Clientes</span>
                </div>
                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
                  activeSection === 'comercios' ? 'bg-slate-950 text-amber-300' : 'bg-amber-400/20 text-amber-300'
                }`}>
                  {merchantClients.length}
                </span>
              </button>
            </div>
          )}

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
                  onClick={() => {
                    setActiveSection('qr_studio');
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full py-2.5 px-3 rounded-xl flex items-center justify-between text-xs font-bold transition-all mb-1 ${
                    activeSection === 'qr_studio'
                      ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-indigo-400 hover:text-white hover:bg-indigo-950/40 border border-indigo-500/20'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <QrCode className="w-4 h-4 text-indigo-300 stroke-[2.5]" />
                    <span>Estudio de QRs & Visitas</span>
                  </div>
                  <span className="text-[10px] font-black bg-indigo-950/80 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-500/40">
                    {totalQrScans} visitas
                  </span>
                </button>

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
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen min-w-0 max-w-full overflow-x-hidden w-full">
        {/* TOP HEADER: EXACT MATCH */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-3.5 sm:px-8 py-3 sm:py-3.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl shrink-0"
              title="Abrir menú"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 min-w-0">
              <h1 className="text-base sm:text-xl font-black text-slate-900 tracking-tight truncate">
                {activeSection === 'comercios'
                  ? 'Cartera de Clientes'
                  : activeSection === 'qr_studio'
                  ? 'QRs & Visitas'
                  : activeSection === 'clientes'
                  ? 'Base de Clientes'
                  : isOwner
                  ? 'Dashboard Dueño'
                  : 'Panel de Control'}
              </h1>
              <span className="text-xs text-slate-400 font-medium hidden md:inline">
                / {todayFormatted}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
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
              className="px-3 sm:px-4 py-1.5 bg-[#22c55e] hover:bg-emerald-600 text-white font-bold text-xs rounded-full flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.02]"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span className="hidden sm:inline">Ver tutorial</span>
              <span className="sm:hidden">Tutorial</span>
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

        {/* TOP STICKY TECHNICAL SUPPORT IMPERSONATION BANNER */}
        {impersonatedMerchant && (
          <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 text-slate-950 px-4 sm:px-8 py-3 shadow-md flex flex-wrap items-center justify-between gap-3 sticky top-0 z-40 border-b border-amber-600">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-black/20 flex items-center justify-center font-bold text-lg shadow-inner">
                🛠️
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-xs font-black tracking-wide uppercase text-slate-950">
                    Modo Soporte Técnico Activo
                  </p>
                  <span className="bg-black/20 text-slate-950 text-[10px] px-2 py-0.5 rounded-full font-extrabold uppercase">
                    Acceso Manager
                  </span>
                </div>
                <p className="text-xs font-medium text-slate-900 mt-0.5">
                  Estás gestionando la cuenta de: <strong className="font-extrabold text-black">{impersonatedMerchant.businessName}</strong> ({impersonatedMerchant.ownerName} &bull; {impersonatedMerchant.email} &bull; {impersonatedMerchant.phone})
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveSection('comercios')}
                className="px-3.5 py-1.5 bg-black/20 hover:bg-black/30 text-slate-950 text-xs font-bold rounded-xl transition-all"
              >
                Ver Cartera de Clientes
              </button>
              <button
                onClick={handleExitImpersonation}
                className="px-4 py-1.5 bg-slate-950 hover:bg-slate-900 text-white text-xs font-black rounded-xl shadow-lg transition-all flex items-center gap-1.5"
              >
                <X className="w-3.5 h-3.5" />
                <span>Salir de Soporte Técnico</span>
              </button>
            </div>
          </div>
        )}

        {/* Dynamic Main Body Content */}
        <main className="p-3.5 sm:p-8 space-y-5 sm:space-y-6 max-w-7xl mx-auto w-full flex-1 pb-28 lg:pb-8">
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

                  {/* Action: Cartera de Clientes */}
                  <button
                    type="button"
                    onClick={() => setActiveSection('comercios')}
                    className="flex-1 sm:flex-none px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm cursor-pointer transition-all"
                  >
                    <Building className="w-3.5 h-3.5" />
                    <span>Cartera de Clientes ({merchantClients.length})</span>
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
                  El libro contable de ventas ejecutivas y auditoría central de cobros es exclusivo para la administración del Propietario de MenuBeacon / Markethers.
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

                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => setIsNewCustomerModalOpen(true)}
                      className="flex-1 sm:flex-none px-4 py-2.5 bg-[#22c55e] hover:bg-emerald-600 text-black font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 cursor-pointer transition-all hover:scale-[1.02]"
                    >
                      <Plus className="w-4 h-4 stroke-[3]" />
                      <span>+ Nuevo Cliente</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCopyModalContext('customers');
                        setIsCopyModalOpen(true);
                      }}
                      className="px-3.5 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold text-xs rounded-xl flex items-center gap-1.5 border border-blue-200 transition-colors shadow-sm"
                      title="Copiar lista de contactos para pegar en Excel, Google Sheets, Mailchimp, Klaviyo, etc."
                    >
                      <Copy className="w-4 h-4 text-blue-600" />
                      <span>Copiar para Pegar</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => openEmailCampaignModal('customers')}
                      className="px-3.5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02]"
                      title="Crear y enviar campaña de email marketing a comensales"
                    >
                      <Mail className="w-4 h-4 text-white" />
                      <span>Campaña Email</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleExportCSV}
                      className="px-3 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer transition-colors"
                      title="Descargar base de datos en CSV / Excel"
                    >
                      <Download className="w-4 h-4 text-emerald-400" />
                      <span>CSV</span>
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

                {/* MOBILE CARDS LIST FOR CUSTOMERS */}
                <div className="sm:hidden divide-y divide-slate-100">
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
                    <div className="py-8 text-center text-slate-500">
                      <p className="font-bold text-sm">No se encontraron clientes</p>
                      <p className="text-xs text-slate-400 mt-1">Prueba cambiando los filtros de búsqueda.</p>
                    </div>
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
                        return (
                          <div key={c.id} className="p-4 space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-500 text-zinc-950 font-black text-xs flex items-center justify-center shrink-0">
                                  {c.name.charAt(0)}
                                </div>
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-bold text-sm text-slate-900">{c.name}</span>
                                    {c.tier === 'vip' && (
                                      <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[9px] font-black uppercase">
                                        VIP
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[11px] text-slate-500 font-mono">{c.phone}</span>
                                </div>
                              </div>

                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                                {c.walletPassType === 'google' ? '🤖 Google' : '🍏 Apple'}
                              </span>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-xl text-center text-xs">
                              <div>
                                <span className="text-[10px] text-slate-400 uppercase font-bold block">Sellos</span>
                                <span className="font-black text-slate-900">{c.currentStamps} / {target}</span>
                              </div>
                              <div>
                                <span className="text-[10px] text-slate-400 uppercase font-bold block">Visitas</span>
                                <span className="font-black text-slate-900">{c.totalVisits}</span>
                              </div>
                              <div>
                                <span className="text-[10px] text-slate-400 uppercase font-bold block">Consumo</span>
                                <span className="font-black text-emerald-600">${(c.totalSpent || 0).toLocaleString()}</span>
                              </div>
                            </div>

                            {/* Quick Action Buttons */}
                            <div className="flex items-center gap-2 pt-0.5">
                              <button
                                type="button"
                                onClick={() => setSelectedCustomerDetail(c)}
                                className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5"
                              >
                                <UserCheck className="w-3.5 h-3.5 text-slate-500" />
                                <span>Ver Ficha</span>
                              </button>

                              {c.email && (
                                <button
                                  type="button"
                                  onClick={() => openEmailCampaignModal('customers', { name: c.name, email: c.email! })}
                                  className="p-2 bg-blue-50 text-blue-700 rounded-xl"
                                  title="Enviar Email"
                                >
                                  <Mail className="w-4 h-4" />
                                </button>
                              )}

                              <a
                                href={`https://wa.me/${c.phone.replace(/\D/g, '')}?text=¡Hola ${c.name}! Te escribimos de ${business.name}.`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-[#22c55e] text-white rounded-xl"
                                title="WhatsApp"
                              >
                                <MessageCircle className="w-4 h-4" />
                              </a>
                            </div>
                          </div>
                        );
                      })
                  )}
                </div>

                {/* DESKTOP TABLE */}
                <div className="overflow-x-auto hidden sm:block">
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

                                    {c.email && (
                                      <button
                                        type="button"
                                        onClick={() => openEmailCampaignModal('customers', { name: c.name, email: c.email! })}
                                        className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-lg text-xs transition-colors"
                                        title={`Enviar correo directo a ${c.email}`}
                                      >
                                        <Mail className="w-3.5 h-3.5" />
                                      </button>
                                    )}

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
          {/* VIEW: ESTUDIO DE CÓDIGOS QR ÚNICOS & ANALÍTICA DE VISITAS */}
          {/* ========================================================= */}
          {activeSection === 'qr_studio' && (
            <div className="space-y-6">
              {/* Header card */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-5 border-b border-slate-100">
                  <div className="flex items-start sm:items-center gap-3">
                    <span className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/20">
                      <QrCode className="w-6 h-6 stroke-[2.5]" />
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-black text-slate-900 tracking-tight">
                          Generador de Códigos QR Únicos & Control de Visitas
                        </h2>
                        <span className="bg-indigo-50 text-indigo-700 text-[10px] font-black px-2 py-0.5 rounded-full border border-indigo-200">
                          {businessTrackedQrs.length} QRs Activos
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Genera códigos QR específicos para tus menús, tu plan de afiliación a tarjeta digital, y cada mesa o mostrador de {business.name}. Rastreo en tiempo real de cuántas personas visitan cada uno.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                    <button
                      type="button"
                      onClick={handleQuickCreateMenuQr}
                      className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all"
                    >
                      <Utensils className="w-3.5 h-3.5 text-slate-500" />
                      <span>+ QR Menú Rápido</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleQuickCreateLoyaltyQr}
                      className="px-3.5 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all"
                    >
                      <CreditCard className="w-3.5 h-3.5 text-amber-700" />
                      <span>+ QR Afiliación Rápido</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setNewQrName('');
                        setNewQrType('menu');
                        setNewQrLocation('Mesas');
                        setNewQrTableNumber('');
                        setNewQrNotes('');
                        setIsCreateQrModalOpen(true);
                      }}
                      className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-indigo-600/20 flex items-center gap-2 transition-all hover:scale-[1.02]"
                    >
                      <Plus className="w-4 h-4 stroke-[3]" />
                      <span>Generar Nuevo QR Único</span>
                    </button>
                  </div>
                </div>

                {/* 4 KPI Analytics Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mt-5">
                  <div className="bg-slate-50/80 border border-slate-200/80 rounded-xl p-4">
                    <span className="text-[11px] font-bold text-slate-500 block uppercase tracking-wider">
                      Total Visitas / Escaneos
                    </span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-2xl font-black text-slate-900">
                        {totalQrScans.toLocaleString()}
                      </span>
                      <span className="text-[11px] font-bold text-emerald-600 flex items-center">
                        <TrendingUp className="w-3 h-3 mr-0.5" />
                        +{totalQrScansToday} hoy
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                      En {businessTrackedQrs.length} códigos QR activos
                    </span>
                  </div>

                  <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-4">
                    <span className="text-[11px] font-bold text-indigo-700 block uppercase tracking-wider">
                      Consultas al Menú Digital
                    </span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-2xl font-black text-indigo-950">
                        {totalMenuScans.toLocaleString()}
                      </span>
                      <span className="text-[11px] font-bold text-indigo-600">
                        {totalQrScans > 0 ? Math.round((totalMenuScans / totalQrScans) * 100) : 0}% del tráfico
                      </span>
                    </div>
                    <span className="text-[10px] text-indigo-500 mt-0.5 block">
                      Mesas, barra y delivery
                    </span>
                  </div>

                  <div className="bg-amber-50/60 border border-amber-100 rounded-xl p-4">
                    <span className="text-[11px] font-bold text-amber-800 block uppercase tracking-wider">
                      Afiliaciones Club Lealtad
                    </span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-2xl font-black text-amber-950">
                        {totalLoyaltyScans.toLocaleString()}
                      </span>
                      <span className="text-[11px] font-bold text-amber-700">
                        {totalQrScans > 0 ? Math.round((totalLoyaltyScans / totalQrScans) * 100) : 0}% conversión
                      </span>
                    </div>
                    <span className="text-[10px] text-amber-600 mt-0.5 block">
                      Comensales que abrieron tarjeta
                    </span>
                  </div>

                  <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-4">
                    <span className="text-[11px] font-bold text-emerald-800 block uppercase tracking-wider">
                      QR Más Exitoso / Top Mesa
                    </span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-base font-black text-emerald-950 truncate max-w-[160px]" title={topScannedQr?.name || 'N/A'}>
                        {topScannedQr?.name || 'Sin datos'}
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-700 mt-0.5 block">
                      {topScannedQr ? `${topScannedQr.scansCount} escaneos acumulados` : 'Crea tu primer QR'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Filters & Search Toolbar */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
                  <button
                    onClick={() => setQrFilterType('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                      qrFilterType === 'all'
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Todos ({businessTrackedQrs.length})
                  </button>
                  <button
                    onClick={() => setQrFilterType('menu')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                      qrFilterType === 'menu'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    🍽️ Menú ({businessTrackedQrs.filter(q => q.type === 'menu').length})
                  </button>
                  <button
                    onClick={() => setQrFilterType('loyalty')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                      qrFilterType === 'loyalty'
                        ? 'bg-amber-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    💳 Afiliación ({businessTrackedQrs.filter(q => q.type === 'loyalty').length})
                  </button>
                  <button
                    onClick={() => setQrFilterType('table')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                      qrFilterType === 'table'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    🪑 Mesas ({businessTrackedQrs.filter(q => q.type === 'table').length})
                  </button>
                  <button
                    onClick={() => setQrFilterType('reviews')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                      qrFilterType === 'reviews'
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    ⭐ Reseñas ({businessTrackedQrs.filter(q => q.type === 'reviews').length})
                  </button>
                </div>

                <div className="relative w-full md:w-72">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={qrSearchQuery}
                    onChange={e => setQrSearchQuery(e.target.value)}
                    placeholder="Buscar por nombre, mesa o ubicación..."
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                  {qrSearchQuery && (
                    <button
                      onClick={() => setQrSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                    >
                      &times;
                    </button>
                  )}
                </div>
              </div>

              {/* QR Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTrackedQrs.length === 0 ? (
                  <div className="col-span-full bg-white border border-slate-200/90 rounded-2xl p-12 text-center">
                    <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl mx-auto flex items-center justify-center mb-3">
                      <QrCode className="w-8 h-8" />
                    </div>
                    <h3 className="text-base font-black text-slate-900">No se encontraron códigos QR</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                      {qrSearchQuery || qrFilterType !== 'all'
                        ? 'No hay códigos QR que coincidan con los filtros seleccionados.'
                        : 'Crea tu primer código QR para tu menú digital o plan de afiliación y empieza a medir las visitas.'}
                    </p>
                    <button
                      onClick={() => setIsCreateQrModalOpen(true)}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md inline-flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Crear Código QR Ahora</span>
                    </button>
                  </div>
                ) : (
                  filteredTrackedQrs.map(qr => {
                    const isMenu = qr.type === 'menu';
                    const isLoyalty = qr.type === 'loyalty';
                    const isTable = qr.type === 'table';
                    const isReviews = qr.type === 'reviews';

                    return (
                      <div
                        key={qr.id}
                        className="bg-white border border-slate-200/90 hover:border-indigo-300 rounded-2xl p-5 shadow-sm transition-all hover:shadow-md flex flex-col justify-between"
                      >
                        <div>
                          {/* Card Top: Badges */}
                          <div className="flex items-center justify-between gap-2 mb-3">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 ${
                                isMenu
                                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                  : isLoyalty
                                  ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                  : isTable
                                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                  : 'bg-purple-50 text-purple-700 border border-purple-200'
                              }`}
                            >
                              {isMenu && <Utensils className="w-3 h-3" />}
                              {isLoyalty && <CreditCard className="w-3 h-3" />}
                              {isTable && <Store className="w-3 h-3" />}
                              {isReviews && <Star className="w-3 h-3" />}
                              <span>
                                {isMenu
                                  ? 'Menú Digital'
                                  : isLoyalty
                                  ? 'Plan de Afiliación'
                                  : isTable
                                  ? `Mesa ${qr.tableNumber || ''}`
                                  : 'Reseñas & Info'}
                              </span>
                            </span>

                            {qr.location && (
                              <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-slate-400" />
                                <span>{qr.location}</span>
                              </span>
                            )}
                          </div>

                          {/* QR Title & Notes */}
                          <h3 className="text-base font-black text-slate-900 tracking-tight leading-snug">
                            {qr.name}
                          </h3>
                          {qr.notes && (
                            <p className="text-xs text-slate-500 mt-1 line-clamp-1">{qr.notes}</p>
                          )}

                          {/* Live Scan Tracker Highlight */}
                          <div className="mt-4 p-3 bg-gradient-to-r from-slate-50 to-indigo-50/40 rounded-xl border border-slate-200/80 flex items-center justify-between">
                            <div>
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                Control de Visitas
                              </span>
                              <div className="flex items-baseline gap-1.5">
                                <span className="text-xl font-black text-slate-900">
                                  {qr.scansCount || 0}
                                </span>
                                <span className="text-xs font-bold text-slate-500">visitas</span>
                              </div>
                            </div>

                            <div className="text-right">
                              <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                                +{qr.scansToday || 0} hoy
                              </span>
                              <span className="text-[10px] text-slate-400 block mt-0.5">
                                {qr.lastScannedAt
                                  ? `Último: ${new Date(qr.lastScannedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                                  : 'Sin visitas aún'}
                              </span>
                            </div>
                          </div>

                          {/* Target Link preview */}
                          <div className="mt-3 flex items-center justify-between gap-2 p-2 bg-slate-50 rounded-lg border border-slate-100 text-[11px] text-slate-600 font-mono">
                            <span className="truncate">{qr.targetUrl}</span>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(qr.targetUrl);
                                setCopyToast('¡Enlace de rastreo copiado!');
                                setTimeout(() => setCopyToast(null), 3000);
                              }}
                              className="p-1 hover:text-slate-900"
                              title="Copiar URL"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Card Actions Bottom */}
                        <div className="mt-5 pt-3 border-t border-slate-100 flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleOpenQrStandModal(qr)}
                              className="flex-1 py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-all"
                            >
                              <Printer className="w-3.5 h-3.5" />
                              <span>Ver Stand / Imprimir</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleSimulateScan(qr.id)}
                              className="py-2 px-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold text-xs rounded-xl transition-all"
                              title="Simular escaneo de comensal (+1 visita para probar el contador)"
                            >
                              <Zap className="w-3.5 h-3.5 inline mr-1 text-emerald-600" />
                              <span>+1 Visita</span>
                            </button>
                          </div>

                          <div className="flex items-center justify-between pt-1">
                            <a
                              href={qr.targetUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                            >
                              <ExternalLink className="w-3 h-3" />
                              <span>Abrir como comensal</span>
                            </a>

                            <button
                              type="button"
                              onClick={() => handleDeleteTrackedQr(qr.id)}
                              className="text-[11px] font-bold text-slate-400 hover:text-red-600 flex items-center gap-1 transition-colors"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Eliminar</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
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
                        value={typeof window !== 'undefined' ? `${window.location.origin}/${business.slug}` : `https://menubeacon.app/${business.slug}`}
                        className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-700"
                      />
                      <button
                        onClick={() => {
                          const url = typeof window !== 'undefined' ? `${window.location.origin}/${business.slug}` : `https://menubeacon.app/${business.slug}`;
                          navigator.clipboard.writeText(url);
                          setCopyToast('¡Enlace copiado al portapapeles!');
                          setTimeout(() => setCopyToast(null), 3000);
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
                    Gestiona tu plan activo de MenuBeacon, actualiza tus tarjetas bancarias y descarga tus comprobantes oficiales de pago.
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
                    Cambiar o Mejorar tu Plan de MenuBeacon
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
                        <h5 className="font-black text-base text-slate-900">Plan Pro MenuBeacon</h5>
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

          {/* ========================================================= */}
          {/* VIEW: CARTERA DE CLIENTES SAAS (CONSOLA DUEÑO / MANAGER)  */}
          {/* ========================================================= */}
          {activeSection === 'comercios' && (
            <div className="space-y-6">
              {/* TOP HEADER BAR */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
                      <Building className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                        <span>Cartera de Clientes & Suscripciones</span>
                        <span className="text-[10px] bg-amber-100 text-amber-900 font-extrabold px-2 py-0.5 rounded-full uppercase">
                          Consola Dueño
                        </span>
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Control general de comercios activos, pruebas, cuentas morosas (lo que deben), ingresos cobrados (lo que pagaron) y accesos directos de soporte técnico.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                  <button
                    onClick={() => {
                      setCopyModalContext('merchants');
                      setIsCopyModalOpen(true);
                    }}
                    className="flex-1 sm:flex-none px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 border border-amber-200 transition-all shadow-sm"
                    title="Copiar lista de comercios para pegar en Excel, Google Sheets, Mailchimp, etc."
                  >
                    <Copy className="w-3.5 h-3.5 text-amber-700" />
                    <span>Copiar para Pegar</span>
                  </button>

                  <button
                    onClick={() => openEmailCampaignModal('merchants')}
                    className="flex-1 sm:flex-none px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02]"
                    title="Enviar comunicado o estado de cuenta por correo a los comercios"
                  >
                    <Mail className="w-3.5 h-3.5 text-white" />
                    <span>Campaña Email</span>
                  </button>

                  <button
                    onClick={handleExportMerchantsCSV}
                    className="flex-1 sm:flex-none px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all"
                    title="Exportar cartera completa a Excel / CSV"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-600" />
                    <span>Exportar CSV</span>
                  </button>

                  <button
                    onClick={() => setIsNewMerchantModalOpen(true)}
                    className="flex-1 sm:flex-none px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-slate-900/10 transition-all hover:scale-[1.02]"
                  >
                    <Plus className="w-3.5 h-3.5 text-amber-400 stroke-[3]" />
                    <span>+ Registrar Comercio</span>
                  </button>
                </div>
              </div>

              {/* 4 FINANCIAL & OPERATIONAL KPIS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* KPI 1: TOTAL COMERCIOS */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span className="font-bold uppercase tracking-wider text-[11px]">Total Comercios</span>
                    <Store className="w-4 h-4 text-slate-400" />
                  </div>
                  <div className="text-2xl font-black text-slate-900 mt-1">
                    {merchantClients.length}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1 text-[10px] font-bold">
                    <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {merchantClients.filter(m => m.status === 'active').length} Activos
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                      {merchantClients.filter(m => m.status === 'trialing').length} En Prueba
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                      {merchantClients.filter(m => m.status === 'past_due').length} Mora
                    </span>
                  </div>
                </div>

                {/* KPI 2: MRR RECURRENTE (LO QUE PAGAN) */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span className="font-bold uppercase tracking-wider text-[11px]">MRR Recurrente (Lo que pagan)</span>
                    <Repeat className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div className="text-2xl font-black text-slate-900 mt-1">
                    ${merchantClients.filter(m => m.status === 'active' || m.status === 'trialing').reduce((acc, m) => acc + (m.monthlyPrice || 0), 0)}.00{' '}
                    <span className="text-xs text-slate-400 font-semibold">USD/mes</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2">
                    Facturación estimada por suscripciones activas
                  </p>
                </div>

                {/* KPI 3: HISTÓRICO RECAUDADO (LO QUE PAGARON) */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span className="font-bold uppercase tracking-wider text-[11px]">Total Cobrado (Lo que pagaron)</span>
                    <CircleDollarSign className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="text-2xl font-black text-emerald-600 mt-1">
                    ${merchantClients.reduce((acc, m) => acc + (m.totalPaid || 0), 0)}.00{' '}
                    <span className="text-xs text-slate-400 font-semibold">USD</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2">
                    Ingresos históricos acumulados cobrados
                  </p>
                </div>

                {/* KPI 4: CARTERA VENCIDA (LO QUE DEBEN) */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span className="font-bold uppercase tracking-wider text-[11px]">Cartera Vencida (Lo que deben)</span>
                    <AlertTriangle className={`w-4 h-4 ${merchantClients.reduce((acc, m) => acc + (m.amountDue || 0), 0) > 0 ? 'text-rose-500' : 'text-slate-400'}`} />
                  </div>
                  <div className={`text-2xl font-black mt-1 ${
                    merchantClients.reduce((acc, m) => acc + (m.amountDue || 0), 0) > 0 ? 'text-rose-600' : 'text-slate-900'
                  }`}>
                    ${merchantClients.reduce((acc, m) => acc + (m.amountDue || 0), 0)}.00{' '}
                    <span className="text-xs text-slate-400 font-semibold">USD</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2">
                    {merchantClients.filter(m => m.amountDue > 0).length > 0 ? (
                      <span className="text-rose-600 font-bold">
                        ⚠️ {merchantClients.filter(m => m.amountDue > 0).length} cuenta(s) con saldo pendiente
                      </span>
                    ) : (
                      <span className="text-emerald-600 font-semibold">
                        ✅ Todos los comercios al corriente
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* SEARCH & FILTER TABS */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                {/* Status Tabs */}
                <div className="flex flex-wrap items-center bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600">
                  <button
                    onClick={() => setMerchantFilterStatus('all')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      merchantFilterStatus === 'all'
                        ? 'bg-white text-slate-900 shadow-sm font-black'
                        : 'hover:text-slate-900'
                    }`}
                  >
                    Todos ({merchantClients.length})
                  </button>
                  <button
                    onClick={() => setMerchantFilterStatus('active')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      merchantFilterStatus === 'active'
                        ? 'bg-white text-slate-900 shadow-sm font-black'
                        : 'hover:text-slate-900'
                    }`}
                  >
                    Activos ({merchantClients.filter(m => m.status === 'active').length})
                  </button>
                  <button
                    onClick={() => setMerchantFilterStatus('trialing')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      merchantFilterStatus === 'trialing'
                        ? 'bg-white text-slate-900 shadow-sm font-black'
                        : 'hover:text-slate-900'
                    }`}
                  >
                    En Prueba ({merchantClients.filter(m => m.status === 'trialing').length})
                  </button>
                  <button
                    onClick={() => setMerchantFilterStatus('past_due')}
                    className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                      merchantFilterStatus === 'past_due'
                        ? 'bg-rose-500 text-white shadow-sm font-black'
                        : 'text-rose-700 hover:text-rose-900'
                    }`}
                  >
                    <span>Con Deuda / Mora</span>
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      merchantFilterStatus === 'past_due' ? 'bg-rose-700 text-white' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {merchantClients.filter(m => m.status === 'past_due').length}
                    </span>
                  </button>
                  <button
                    onClick={() => setMerchantFilterStatus('cancelled')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      merchantFilterStatus === 'cancelled'
                        ? 'bg-white text-slate-900 shadow-sm font-black'
                        : 'hover:text-slate-900'
                    }`}
                  >
                    Cancelados ({merchantClients.filter(m => m.status === 'cancelled').length})
                  </button>
                </div>

                {/* Search input */}
                <div className="relative min-w-[280px]">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Buscar negocio, dueño, correo o ciudad..."
                    value={merchantSearchQuery}
                    onChange={e => setMerchantSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                  {merchantSearchQuery && (
                    <button
                      onClick={() => setMerchantSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* MERCHANT CLIENTS LIST TABLE */}
              <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px] font-bold">
                        <th className="py-3.5 px-4">Comercio & Propietario</th>
                        <th className="py-3.5 px-4">Estado de Cuenta</th>
                        <th className="py-3.5 px-4">Lo Que Pagan</th>
                        <th className="py-3.5 px-4">Lo Que Pagaron</th>
                        <th className="py-3.5 px-4">Lo Que Deben</th>
                        <th className="py-3.5 px-4 text-right">Acceso Técnico & Gestión</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {merchantClients
                        .filter(m => {
                          const matchesStatus = merchantFilterStatus === 'all' || m.status === merchantFilterStatus;
                          const q = merchantSearchQuery.toLowerCase().trim();
                          const matchesQuery = !q || (
                            m.businessName.toLowerCase().includes(q) ||
                            m.ownerName.toLowerCase().includes(q) ||
                            m.email.toLowerCase().includes(q) ||
                            m.phone.toLowerCase().includes(q) ||
                            m.city.toLowerCase().includes(q)
                          );
                          return matchesStatus && matchesQuery;
                        })
                        .map(client => {
                          const isCurrentActiveBiz = selectedBusinessId === client.businessId;
                          return (
                            <tr
                              key={client.id}
                              className={`hover:bg-amber-50/40 transition-colors ${
                                isCurrentActiveBiz ? 'bg-amber-50/30' : ''
                              }`}
                            >
                              {/* 1. COMERCIO & PROPIETARIO */}
                              <td className="py-4 px-4">
                                <div className="flex items-start gap-3">
                                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-base shrink-0 shadow-sm">
                                    🏢
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <h4 className="font-extrabold text-sm text-slate-900">
                                        {client.businessName}
                                      </h4>
                                      {isCurrentActiveBiz && (
                                        <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 text-[9px] font-black uppercase">
                                          En sesión
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-xs text-slate-600 font-medium mt-0.5">
                                      {client.ownerName} &bull; <span className="text-slate-400">{client.category}</span>
                                    </p>
                                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400 mt-1">
                                      <span className="font-mono text-slate-500">{client.email}</span>
                                      <span>&bull;</span>
                                      <span>{client.phone}</span>
                                      <span>&bull;</span>
                                      <span>{client.city}</span>
                                    </div>
                                    {client.notes && (
                                      <p className="text-[11px] text-amber-800 bg-amber-50/80 px-2 py-0.5 rounded mt-1.5 inline-block border border-amber-200/50">
                                        📝 {client.notes}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </td>

                              {/* 2. ESTADO DE CUENTA */}
                              <td className="py-4 px-4">
                                <div>
                                  {client.status === 'active' && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                      <span>Activo</span>
                                    </span>
                                  )}
                                  {client.status === 'trialing' && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-blue-100 text-blue-800 border border-blue-200">
                                      <Clock className="w-3 h-3 text-blue-600" />
                                      <span>Prueba 14d</span>
                                    </span>
                                  )}
                                  {client.status === 'past_due' && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-rose-100 text-rose-800 border border-rose-300 animate-pulse">
                                      <AlertTriangle className="w-3 h-3 text-rose-600" />
                                      <span>En Mora / Debe</span>
                                    </span>
                                  )}
                                  {client.status === 'cancelled' && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                                      <X className="w-3 h-3 text-slate-500" />
                                      <span>Cancelado</span>
                                    </span>
                                  )}
                                  <div className="text-[10px] text-slate-400 mt-1">
                                    Registrado: {new Date(client.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                                  </div>
                                </div>
                              </td>

                              {/* 3. LO QUE PAGAN */}
                              <td className="py-4 px-4">
                                <div>
                                  <div className="font-black text-sm text-slate-900">
                                    ${client.monthlyPrice}.00 USD <span className="text-[10px] text-slate-400 font-normal">/mes</span>
                                  </div>
                                  <div className="text-[11px] font-semibold text-slate-600 mt-0.5">
                                    {client.planName}
                                  </div>
                                  <div className="text-[10px] text-slate-400 mt-0.5">
                                    {client.billingCycle === 'annual' ? 'Ciclo Anual (-35%)' : 'Ciclo Mensual'}
                                  </div>
                                  <div className="text-[10px] text-slate-500 font-mono mt-1">
                                    Próx: {client.nextBillingDate}
                                  </div>
                                </div>
                              </td>

                              {/* 4. LO QUE PAGARON */}
                              <td className="py-4 px-4">
                                <div>
                                  <div className="font-extrabold text-sm text-emerald-700">
                                    ${client.totalPaid}.00 USD
                                  </div>
                                  <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                                    <CreditCard className="w-3 h-3 text-slate-400" />
                                    <span>•••• {client.cardLast4 || '4242'} ({client.cardBrand || 'Visa'})</span>
                                  </div>
                                  <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-mono mt-1 inline-block">
                                    Pasarela Stripe OK
                                  </span>
                                </div>
                              </td>

                              {/* 5. LO QUE DEBEN */}
                              <td className="py-4 px-4">
                                <div>
                                  {client.amountDue > 0 ? (
                                    <div>
                                      <div className="font-black text-base text-rose-600">
                                        ${client.amountDue}.00 USD
                                      </div>
                                      <span className="inline-block mt-0.5 px-2 py-0.5 rounded bg-rose-50 text-rose-700 text-[10px] font-black uppercase border border-rose-200">
                                        Saldo Pendiente
                                      </span>
                                      <button
                                        onClick={() => handleQuickMarkPaid(client)}
                                        className="mt-1 text-[10px] font-bold text-emerald-700 hover:text-emerald-900 underline block"
                                        title="Registrar que el cliente ya liquidó este monto"
                                      >
                                        ✓ Marcar Pagado ($0)
                                      </button>
                                    </div>
                                  ) : (
                                    <div>
                                      <div className="font-extrabold text-xs text-emerald-600 flex items-center gap-1">
                                        <Check className="w-3.5 h-3.5" />
                                        <span>Al corriente ($0.00)</span>
                                      </div>
                                      <span className="text-[10px] text-slate-400 block mt-0.5">
                                        Sin adeudos pendientes
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </td>

                              {/* 6. ACCIONES (ACCESO TÉCNICO, AJUSTAR, WHATSAPP) */}
                              <td className="py-4 px-4 text-right">
                                <div className="flex flex-col sm:flex-row items-end sm:items-center justify-end gap-2">
                                  {/* Botón Principal: Acceso Técnico / Impersonate */}
                                  <button
                                    onClick={() => handleImpersonate(client)}
                                    className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs rounded-xl shadow-sm transition-all hover:scale-[1.02] flex items-center gap-1.5"
                                    title="Iniciar sesión en la cuenta del cliente por soporte técnico"
                                  >
                                    <KeyRound className="w-3.5 h-3.5" />
                                    <span>Acceso Técnico</span>
                                  </button>

                                  {/* Botón Ajustar Deuda / Cuenta */}
                                  <button
                                    onClick={() => setEditingMerchantBilling(client)}
                                    className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1"
                                    title="Editar deuda, pagos y estado del comercio"
                                  >
                                    <Wrench className="w-3 h-3 text-slate-500" />
                                    <span>Ajustar</span>
                                  </button>

                                  {/* Botón Correo Directo */}
                                  <button
                                    type="button"
                                    onClick={() => openEmailCampaignModal('merchants', { name: client.ownerName, email: client.email })}
                                    className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl transition-colors"
                                    title={`Enviar correo directo a ${client.email}`}
                                  >
                                    <Mail className="w-4 h-4" />
                                  </button>

                                  {/* Botón WhatsApp Directo */}
                                  <a
                                    href={`https://wa.me/${client.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                                      client.amountDue > 0
                                        ? `Hola ${client.ownerName}, te saludamos de MenuBeacon respecto a tu cuenta en ${client.businessName} para coordinar tu saldo pendiente de $${client.amountDue} USD. ¿En qué podemos apoyarte?`
                                        : `Hola ${client.ownerName}, te saludamos del equipo de MenuBeacon. ¿Cómo podemos apoyarte hoy con tu menú o tarjetas de lealtad en ${client.businessName}?`
                                    )}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl transition-colors"
                                    title="Contactar al dueño por WhatsApp"
                                  >
                                    <MessageCircle className="w-4 h-4" />
                                  </a>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>

                  {merchantClients.filter(m => {
                    const matchesStatus = merchantFilterStatus === 'all' || m.status === merchantFilterStatus;
                    const q = merchantSearchQuery.toLowerCase().trim();
                    const matchesQuery = !q || (
                      m.businessName.toLowerCase().includes(q) ||
                      m.ownerName.toLowerCase().includes(q) ||
                      m.email.toLowerCase().includes(q) ||
                      m.phone.toLowerCase().includes(q) ||
                      m.city.toLowerCase().includes(q)
                    );
                    return matchesStatus && matchesQuery;
                  }).length === 0 && (
                    <div className="py-12 text-center text-slate-400">
                      <Store className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                      <p className="text-sm font-bold text-slate-700">No se encontraron comercios</p>
                      <p className="text-xs text-slate-400 mt-1">Prueba cambiando los filtros de búsqueda o registra un nuevo comercio.</p>
                    </div>
                  )}
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
        title="Asistente MenuBeacon"
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
                <h4 className="font-bold text-xs">Asistente MenuBeacon</h4>
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
              <h3 className="font-black text-lg">Tutorial Rápido MenuBeacon</h3>
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

      {/* Modal: Ajustar Cuenta & Facturación de Comercio (SaaS Manager) */}
      {editingMerchantBilling && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 text-slate-900 shadow-2xl relative">
            <button
              onClick={() => setEditingMerchantBilling(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center font-bold">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-lg">Ajustar Cuenta & Facturación</h3>
                <span className="text-xs text-slate-500 block font-medium">
                  {editingMerchantBilling.businessName} &bull; {editingMerchantBilling.ownerName}
                </span>
              </div>
            </div>

            <form onSubmit={handleUpdateMerchantBilling} className="space-y-4 mt-5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Estado de Cuenta
                  </label>
                  <select
                    value={editingMerchantBilling.status}
                    onChange={e =>
                      setEditingMerchantBilling({
                        ...editingMerchantBilling,
                        status: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none"
                  >
                    <option value="active">🟢 Activo</option>
                    <option value="trialing">🔵 En Prueba 14d</option>
                    <option value="past_due">🔴 En Mora / Con Deuda</option>
                    <option value="cancelled">⚪ Cancelado</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Plan Afiliado
                  </label>
                  <select
                    value={editingMerchantBilling.planId}
                    onChange={e => {
                      const pid = e.target.value as any;
                      const pnames = { starter: 'Plan Despegue', pro: 'Plan Pro MenuBeacon', franchise: 'Plan Multi-Sucursal', enterprise: 'Enterprise' };
                      setEditingMerchantBilling({
                        ...editingMerchantBilling,
                        planId: pid,
                        planName: (pnames as any)[pid] || editingMerchantBilling.planName,
                      });
                    }}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none"
                  >
                    <option value="starter">Plan Despegue ($29/m)</option>
                    <option value="pro">Plan Pro MenuBeacon ($49/m)</option>
                    <option value="franchise">Plan Multi-Sucursal ($99/m)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Lo Que Deben (Saldo Pendiente USD)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={editingMerchantBilling.amountDue}
                    onChange={e =>
                      setEditingMerchantBilling({
                        ...editingMerchantBilling,
                        amountDue: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold font-mono text-rose-600 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Lo Que Pagaron (Total Histórico USD)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={editingMerchantBilling.totalPaid}
                    onChange={e =>
                      setEditingMerchantBilling({
                        ...editingMerchantBilling,
                        totalPaid: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold font-mono text-emerald-600 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Cuota Recurrente ($ USD/mes)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editingMerchantBilling.monthlyPrice}
                    onChange={e =>
                      setEditingMerchantBilling({
                        ...editingMerchantBilling,
                        monthlyPrice: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold font-mono text-slate-900 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Próxima Fecha de Cobro
                  </label>
                  <input
                    type="text"
                    value={editingMerchantBilling.nextBillingDate}
                    onChange={e =>
                      setEditingMerchantBilling({
                        ...editingMerchantBilling,
                        nextBillingDate: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Notas de Soporte / Observaciones Internas
                </label>
                <textarea
                  rows={2}
                  value={editingMerchantBilling.notes || ''}
                  onChange={e =>
                    setEditingMerchantBilling({
                      ...editingMerchantBilling,
                      notes: e.target.value,
                    })
                  }
                  placeholder="ej. Acordó pago diferido el próximo viernes vía transferencia..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditingMerchantBilling(null)}
                  className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar Cambios de Cuenta</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Registrar Nuevo Comercio Manualmente (SaaS Manager) */}
      {isNewMerchantModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 text-slate-900 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsNewMerchantModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
                <Building className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="font-black text-lg">Registrar Nuevo Comercio</h3>
                <span className="text-xs text-slate-500 block">
                  Añade un nuevo cliente a tu cartera de comercios con cuenta aprovisionada.
                </span>
              </div>
            </div>

            <form onSubmit={handleCreateNewMerchant} className="space-y-3.5 mt-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Nombre Comercial del Negocio *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ej. Tacos El Pastor Dorado"
                  value={newMerchantBusinessName}
                  onChange={e => setNewMerchantBusinessName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Nombre del Propietario *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ej. Carlos Mendoza"
                    value={newMerchantOwnerName}
                    onChange={e => setNewMerchantOwnerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Giro / Categoría
                  </label>
                  <select
                    value={newMerchantCategory}
                    onChange={e => setNewMerchantCategory(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none"
                  >
                    <option value="Restaurante & Comida">Restaurante</option>
                    <option value="Bar & Cantina">Bar & Cantina</option>
                    <option value="Cafetería & Brunch">Cafetería & Brunch</option>
                    <option value="Paletería & Heladería">Paletería & Heladería</option>
                    <option value="Pizzería Artesanal">Pizzería Artesanal</option>
                    <option value="Barbería & Spa">Barbería & Spa</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Email de Contacto *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="carlos@negocio.com"
                    value={newMerchantEmail}
                    onChange={e => setNewMerchantEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Teléfono / WhatsApp *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+52 55 1234 5678"
                    value={newMerchantPhone}
                    onChange={e => setNewMerchantPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Ciudad & Ubicación
                </label>
                <input
                  type="text"
                  placeholder="ej. Ciudad de México / Guadalajara"
                  value={newMerchantCity}
                  onChange={e => setNewMerchantCity(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Plan Suscripción
                  </label>
                  <select
                    value={newMerchantPlan}
                    onChange={e => setNewMerchantPlan(e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none"
                  >
                    <option value="starter">Plan Despegue ($29/m)</option>
                    <option value="pro">Plan Pro MenuBeacon ($49/m)</option>
                    <option value="franchise">Plan Multi-Sucursal ($99/m)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Estado Inicial
                  </label>
                  <select
                    value={newMerchantStatus}
                    onChange={e => setNewMerchantStatus(e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none"
                  >
                    <option value="trialing">Prueba 14 Días</option>
                    <option value="active">Activo (Al día)</option>
                    <option value="past_due">En Mora / Pendiente</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Lo Que Deben (USD)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={newMerchantAmountDue}
                    onChange={e => setNewMerchantAmountDue(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Lo Que Pagaron (USD)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={newMerchantTotalPaid}
                    onChange={e => setNewMerchantTotalPaid(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Notas Internas
                </label>
                <input
                  type="text"
                  placeholder="ej. Alta directa vía llamada de ventas..."
                  value={newMerchantNotes}
                  onChange={e => setNewMerchantNotes(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsNewMerchantModalOpen(false)}
                  className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4 text-amber-400 stroke-[3]" />
                  <span>Aprovisionar y Dar de Alta</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FLOATING COPY / CAMPAIGN TOAST */}
      {copyToast && (
        <div className="fixed top-5 right-5 z-50 max-w-md bg-slate-950 text-white p-4 rounded-2xl shadow-2xl border border-emerald-500/40 flex items-start gap-3 animate-in fade-in slide-in-from-top-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
            <CheckCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="flex-1 text-xs">
            <h5 className="font-extrabold text-sm text-emerald-400">Acción completada</h5>
            <p className="text-slate-300 mt-0.5 leading-relaxed">{copyToast}</p>
          </div>
          <button
            onClick={() => setCopyToast(null)}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* MODAL: COPIAR LISTA PARA OTRAS PLATAFORMAS (EXCEL, MAILCHIMP, ETC) */}
      {isCopyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 text-slate-900 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsCopyModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Copy className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-lg text-slate-900">
                  Copiar Lista para Otras Plataformas
                </h3>
                <span className="text-xs text-slate-500 block">
                  Exporta y pega en 1 clic en Excel, Google Sheets, Mailchimp, Klaviyo, Brevo o Notion.
                </span>
              </div>
            </div>

            {/* Target Audience Note */}
            <div className="my-4 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">
                  {copyModalContext === 'customers' ? `Comensales de ${business.name}` : 'Cartera de Comercios Afiliados'}
                </span>
                <span className="text-[11px] text-slate-500">
                  {copyModalContext === 'customers'
                    ? `${customers.length} contactos registrados en base de datos`
                    : `${merchantClients.length} comercios en cartera`}
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-black uppercase">
                Listo para Pegar
              </span>
            </div>

            {/* Format Options */}
            <div className="space-y-2.5 my-4">
              <button
                type="button"
                onClick={() => setCopyModalFormat('table')}
                className={`w-full p-3.5 rounded-2xl border-2 text-left transition-all flex items-start gap-3 ${
                  copyModalFormat === 'table'
                    ? 'border-blue-600 bg-blue-50/40 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  copyModalFormat === 'table' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h5 className="font-bold text-xs text-slate-900">
                      Formato Tabla (Excel, Google Sheets, Notion, Airtable)
                    </h5>
                    <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">
                      Recomendado
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    Separado por tabulaciones. Al presionar <strong>Pegar (Ctrl+V / Cmd+V)</strong> en Excel o Google Sheets, cada dato se ordena en su propia celda automáticamente.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setCopyModalFormat('emails')}
                className={`w-full p-3.5 rounded-2xl border-2 text-left transition-all flex items-start gap-3 ${
                  copyModalFormat === 'emails'
                    ? 'border-blue-600 bg-blue-50/40 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  copyModalFormat === 'emails' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  <Mail className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h5 className="font-bold text-xs text-slate-900">
                      Solo Correos Electrónicos (Mailchimp, Klaviyo, Brevo, Gmail)
                    </h5>
                    <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded">
                      Email Mkt
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    Lista separada por comas (ej. <code>juan@email.com, maria@email.com</code>). Ideal para pegar directo en CCO (Bcc) de Gmail o en importadores de audiencia.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setCopyModalFormat('phones')}
                className={`w-full p-3.5 rounded-2xl border-2 text-left transition-all flex items-start gap-3 ${
                  copyModalFormat === 'phones'
                    ? 'border-blue-600 bg-blue-50/40 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  copyModalFormat === 'phones' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  <Phone className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h5 className="font-bold text-xs text-slate-900">
                      Solo Teléfonos & WhatsApp
                    </h5>
                    <span className="text-[10px] font-bold bg-purple-100 text-purple-800 px-1.5 py-0.2 rounded">
                      SMS / WhatsApp
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    Números limpios para campañas de WhatsApp masivo o difusiones SMS.
                  </p>
                </div>
              </button>
            </div>

            {/* Quick preview */}
            <div className="bg-slate-900 text-slate-200 rounded-xl p-3 font-mono text-[11px] overflow-x-auto max-h-24 scrollbar-none mb-5">
              <span className="text-[9px] uppercase tracking-wider text-slate-500 block mb-1">Vista previa:</span>
              {copyModalContext === 'customers' ? (
                copyModalFormat === 'emails' ? (
                  customers.map(c => c.email).filter(Boolean).slice(0, 3).join(', ') + '...'
                ) : copyModalFormat === 'phones' ? (
                  customers.map(c => c.phone).slice(0, 3).join(', ') + '...'
                ) : (
                  `Nombre\tEmail\tTeléfono\tVisitas...\n${customers.slice(0, 2).map(c => `${c.name}\t${c.email || ''}\t${c.phone}`).join('\n')}...`
                )
              ) : (
                copyModalFormat === 'emails' ? (
                  merchantClients.map(m => m.email).slice(0, 3).join(', ') + '...'
                ) : copyModalFormat === 'phones' ? (
                  merchantClients.map(m => m.phone).slice(0, 3).join(', ') + '...'
                ) : (
                  `Negocio\tDueño\tEmail\tTeléfono...\n${merchantClients.slice(0, 2).map(m => `${m.businessName}\t${m.ownerName}\t${m.email}`).join('\n')}...`
                )
              )}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsCopyModalOpen(false)}
                className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
              >
                Cerrar
              </button>
              <button
                type="button"
                onClick={() => handleCopyFormattedList(copyModalContext, copyModalFormat)}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
              >
                <Copy className="w-4 h-4" />
                <span>Copiar al Portapapeles (Cmd+C / Ctrl+C)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: SISTEMA DE CAMPAÑAS DE EMAIL MARKETING */}
      {isEmailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-5xl w-full text-slate-900 shadow-2xl relative max-h-[92vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-600/20">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-base sm:text-lg text-slate-900">
                      Sistema de Campañas de Email Marketing
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-900 text-[10px] font-black uppercase">
                      {emailContext === 'customers' ? business.name : 'Consola Manager'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Diseña y envía correos con diseño profesional a tus comensales y contactos registrados.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEmailHistoryModalOpen(true)}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                >
                  <History className="w-3.5 h-3.5 text-slate-500" />
                  <span>Historial ({emailCampaigns.length})</span>
                </button>
                <button
                  onClick={() => setIsEmailModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-700 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body: 2 Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto">
              {/* Left Column: Editor & Controls (7 cols) */}
              <div className="lg:col-span-7 p-4 sm:p-6 space-y-4 border-r border-slate-100">
                {/* 1. Audiencia */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                      1. Audiencia / Destinatarios
                    </label>
                    <span className="text-[11px] font-extrabold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                      {getRecipientEmailsList().count} contactos con email
                    </span>
                  </div>

                  {emailDirectRecipient ? (
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900 block">Envío Individual Directo:</span>
                        <span className="text-slate-600">{emailDirectRecipient.name} ({emailDirectRecipient.email})</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setEmailDirectRecipient(null)}
                        className="text-xs font-bold text-amber-900 underline"
                      >
                        Cambiar a Masivo
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <select
                        value={emailAudienceFilter}
                        onChange={e => setEmailAudienceFilter(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500/20"
                      >
                        {emailContext === 'customers' ? (
                          <>
                            <option value="all">👥 Todos los comensales ({customers.filter(c => c.email).length} con email)</option>
                            <option value="vip">⭐ Clientes VIP / Alto Consumo ({customers.filter(c => (c.tier === 'vip' || (c.totalSpent || 0) > 500) && c.email).length})</option>
                            <option value="frecuente">🔁 Clientes Recurrentes ≥2 Visitas ({customers.filter(c => c.totalVisits >= 2 && c.email).length})</option>
                            <option value="inactivos">⏰ Clientes Inactivos (Reactivación) ({customers.filter(c => c.totalVisits <= 1 && c.email).length})</option>
                          </>
                        ) : (
                          <>
                            <option value="all">🏢 Todos los comercios ({merchantClients.length} afiliados)</option>
                            <option value="active">🟢 Comercios Activos al Día ({merchantClients.filter(m => m.status === 'active').length})</option>
                            <option value="trialing">🔵 Comercios en Prueba 14d ({merchantClients.filter(m => m.status === 'trialing').length})</option>
                            <option value="past_due">🔴 Comercios con Deuda / Mora ({merchantClients.filter(m => m.status === 'past_due').length})</option>
                          </>
                        )}
                      </select>

                      {getRecipientEmailsList().count === 0 && (
                        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <strong>Sin correos en este filtro:</strong> Los contactos seleccionados actualmente no tienen correo electrónico registrado en la base de datos (fueron registrados solo con teléfono).
                            <span className="block mt-1 text-[11px] text-amber-800">
                              Escribe correos en la casilla &quot;Correos adicionales o de prueba&quot; abajo para poder despachar la campaña.
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Manual additional / test recipients */}
                  <div className="mt-2.5">
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      ➕ Correos adicionales o de prueba (separados por comas)
                    </label>
                    <input
                      type="text"
                      value={emailCustomRecipients}
                      onChange={e => setEmailCustomRecipients(e.target.value)}
                      placeholder="ej: tu.correo@gmail.com, socia@negocio.com"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none font-medium"
                    />
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Total destinatarios calculados: <strong>{getRecipientEmailsList().count} contactos</strong> con correo válido.
                    </span>
                  </div>
                </div>

                {/* 2. Plantillas Rápidas */}
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider text-[10px] block mb-1.5">
                    2. Cargar Plantilla Pre-diseñada
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {emailContext === 'customers' ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleApplyEmailTemplate('promo')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            emailSelectedTemplate === 'promo' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          }`}
                        >
                          🎁 Promoción 2x1
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApplyEmailTemplate('menu')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            emailSelectedTemplate === 'menu' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          }`}
                        >
                          🍽️ Nuevo Menú
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApplyEmailTemplate('reactivation')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            emailSelectedTemplate === 'reactivation' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          }`}
                        >
                          ⏰ Te Extrañamos (+1 Sello)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApplyEmailTemplate('reviews')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            emailSelectedTemplate === 'reviews' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          }`}
                        >
                          ⭐ Reseña Google
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => handleApplyEmailTemplate('update')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            emailSelectedTemplate === 'update' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          }`}
                        >
                          🚀 Nuevas Funciones
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApplyEmailTemplate('billing')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            emailSelectedTemplate === 'billing' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          }`}
                        >
                          🧾 Estado de Cuenta
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* 3. Nombre del Remitente & Asunto */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Nombre del Remitente
                    </label>
                    <input
                      type="text"
                      value={emailSenderName}
                      onChange={e => setEmailSenderName(e.target.value)}
                      placeholder={business.name}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Texto Pre-encabezado
                    </label>
                    <input
                      type="text"
                      value={emailPreheader}
                      onChange={e => setEmailPreheader(e.target.value)}
                      placeholder="Vista previa en la bandeja de entrada..."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700">
                      Asunto del Correo *
                    </label>
                    <div className="flex items-center gap-1 text-[10px] text-slate-400">
                      <span>Insertar:</span>
                      <button
                        type="button"
                        onClick={() => setEmailSubject(prev => prev + ' {{nombre}}')}
                        className="px-1.5 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-mono font-bold"
                      >
                        &#123;&#123;nombre&#125;&#125;
                      </button>
                      <button
                        type="button"
                        onClick={() => setEmailSubject(prev => prev + ' {{negocio}}')}
                        className="px-1.5 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-mono font-bold"
                      >
                        &#123;&#123;negocio&#125;&#125;
                      </button>
                    </div>
                  </div>
                  <input
                    type="text"
                    required
                    value={emailSubject}
                    onChange={e => setEmailSubject(e.target.value)}
                    placeholder="ej. ¡Fin de semana especial con 2x1!"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none"
                  />
                </div>

                {/* 4. Cuerpo del Correo */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Cuerpo del Mensaje (Mensaje Principal) *
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={emailBody}
                    onChange={e => setEmailBody(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none resize-none leading-relaxed font-sans"
                    placeholder="Escribe el mensaje de tu correo..."
                  />
                </div>

                {/* 5. Botón de Llamado a la Acción (CTA) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Texto del Botón (CTA)
                    </label>
                    <input
                      type="text"
                      value={emailButtonText}
                      onChange={e => setEmailButtonText(e.target.value)}
                      placeholder="Ver Menú Digital"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Enlace de Destino
                    </label>
                    <input
                      type="text"
                      value={emailButtonUrl}
                      onChange={e => setEmailButtonUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: Visual Email Preview (5 cols) */}
              <div className="lg:col-span-5 p-4 sm:p-6 bg-slate-100/70 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <span className="font-extrabold uppercase tracking-wider text-[10px]">
                      Vista Previa en Tiempo Real
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Gmail / Apple Mail</span>
                  </div>

                  {/* Mock Email Client Container */}
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden text-xs">
                    {/* Fake Mail Client Header */}
                    <div className="bg-slate-50 px-3.5 py-2 border-b border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">Inbox Preview</span>
                    </div>

                    <div className="p-3.5 border-b border-slate-100 bg-white">
                      <div className="text-[11px] text-slate-500">
                        <strong>De:</strong> {emailSenderName || business.name} &lt;hola@markethers.app&gt;
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        <strong>Para:</strong> {emailDirectRecipient ? emailDirectRecipient.email : `carlos.mendoza@email.com (+ ${Math.max(0, getRecipientEmailsList().count - 1)} en CCO)`}
                      </div>
                      <div className="text-xs font-bold text-slate-900 mt-1.5 truncate">
                        {emailSubject.replace('{{nombre}}', 'Carlos').replace('{{negocio}}', business.name) || 'Asunto del correo'}
                      </div>
                      {emailPreheader && (
                        <div className="text-[11px] text-slate-400 italic truncate mt-0.5">
                          {emailPreheader}
                        </div>
                      )}
                    </div>

                    {/* Styled Email Body */}
                    <div className="p-4 space-y-3 bg-[#fafafa]">
                      {/* Brand Header */}
                      <div className="bg-[#0a111a] text-white p-3.5 rounded-xl text-center">
                        <div className="text-xl mb-1">{business.logoUrl || '🍸'}</div>
                        <h4 className="font-black text-sm text-white tracking-tight">{business.name}</h4>
                        <p className="text-[10px] text-emerald-400 font-medium">{business.tagline || 'Experiencia & Sabor'}</p>
                      </div>

                      {/* Content Card */}
                      <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs space-y-2.5 text-slate-800 text-[11px] leading-relaxed whitespace-pre-wrap">
                        {emailBody.replace('{{nombre}}', 'Carlos').replace('{{negocio}}', business.name).replace('{{premio}}', business.loyaltyConfig.rewardTitle) || 'Aquí aparecerá el texto de tu mensaje...'}
                      </div>

                      {/* CTA Button */}
                      {emailButtonText && (
                        <div className="text-center pt-1">
                          <span className="inline-block px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-black text-xs rounded-xl shadow-md cursor-default">
                            {emailButtonText} →
                          </span>
                        </div>
                      )}

                      {/* Email Footer */}
                      <div className="pt-3 border-t border-slate-200 text-center text-[10px] text-slate-400 space-y-0.5">
                        <p>Enviado a través de <strong>MenuBeacon Platform (un producto de Markethers)</strong></p>
                        <p>{business.address} &bull; {business.city}</p>
                        <p className="text-slate-400 underline cursor-pointer">Cancelar suscripción de promociones</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions & Sending Progress */}
                <div className="pt-4 space-y-3">
                  {/* Test Email Box */}
                  <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-xs space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>Enviar prueba a mi correo:</span>
                      </span>
                      <span className="text-[10px] text-slate-400">Verifica cómo llega</span>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="email"
                        value={emailTestAddress}
                        onChange={e => setEmailTestAddress(e.target.value)}
                        placeholder="ej: tu.correo@gmail.com"
                        className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleSendTestEmail}
                        className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition-colors whitespace-nowrap"
                      >
                        🧪 Enviar Prueba
                      </button>
                    </div>
                  </div>

                  {emailSendingState === 'sending' && (
                    <div className="bg-white p-3 rounded-xl border border-indigo-200 shadow-sm space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-indigo-900">
                        <span>Entregando correos...</span>
                        <span>{emailSendingProgress}%</span>
                      </div>
                      <div className="w-full h-2 bg-indigo-50 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-600 transition-all duration-300"
                          style={{ width: `${emailSendingProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {emailSendingState === 'success' && (
                    <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-2">
                      <CheckCheck className="w-4 h-4 text-emerald-600" />
                      <span>¡Campaña entregada con éxito a {getRecipientEmailsList().count} contactos!</span>
                    </div>
                  )}

                  {emailSendingState === 'error' && emailErrorMessage && (
                    <div className="p-3 bg-rose-50 text-rose-800 border border-rose-200 rounded-xl text-xs font-bold flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>{emailErrorMessage}</span>
                    </div>
                  )}

                  {/* Sending Buttons */}
                  <div className="space-y-2">
                    {/* Primary Button 1: One-Click Gmail Web */}
                    <a
                      href={getGmailComposeUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-rose-600/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                      title="Abre Gmail Web directamente con todos los contactos en CCO y el correo redactado"
                    >
                      <Mail className="w-4 h-4 text-white" />
                      <span>🔴 Enviar con 1-Clic desde Gmail Web ({getRecipientEmailsList().count} en CCO)</span>
                    </a>

                    <div className="flex flex-col sm:flex-row gap-2">
                      {/* Primary Button 2: Automated Server Sending */}
                      <button
                        type="button"
                        disabled={emailSendingState === 'sending' || getRecipientEmailsList().count === 0}
                        onClick={handleSendEmailCampaign}
                        className="flex-1 py-2.5 px-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-all"
                        title="Enviar automáticamente a través de la API del servidor (Resend)"
                      >
                        <SendHorizontal className="w-3.5 h-3.5" />
                        <span>🚀 Enviar Automático (Servidor)</span>
                      </button>

                      <a
                        href={getOutlookComposeUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                        title="Abrir en Outlook Web"
                      >
                        <span>Outlook Web</span>
                      </a>

                      <a
                        href={`mailto:?bcc=${encodeURIComponent(getRecipientEmailsList().emails.join(','))}&subject=${encodeURIComponent(emailSubject.replace('{{nombre}}', 'Estimado cliente'))}&body=${encodeURIComponent(emailBody)}`}
                        className="px-3 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                        title="Abrir en programa de correo predeterminado (Apple Mail, Thunderbird)"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                        <span>Apple Mail</span>
                      </a>
                    </div>
                  </div>

                  {/* Resend API Key Config Toggle */}
                  <div className="pt-2 border-t border-slate-200/80">
                    <button
                      type="button"
                      onClick={() => setShowEmailSettings(!showEmailSettings)}
                      className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                    >
                      <Wrench className="w-3.5 h-3.5" />
                      <span>{showEmailSettings ? 'Ocultar ajustes de servidor' : '⚙️ Configurar Servidor Resend API (Envío 100% en background)'}</span>
                    </button>

                    {showEmailSettings && (
                      <div className="mt-2 p-3 bg-white rounded-xl border border-indigo-200 text-xs space-y-2">
                        <span className="font-bold text-slate-800 block">Clave de API de Resend (resend.com):</span>
                        <div className="flex gap-2">
                          <input
                            type="password"
                            value={resendApiKey}
                            onChange={e => setResendApiKey(e.target.value)}
                            placeholder="re_xxxxxxxxxxxxxx"
                            className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveResendApiKey(resendApiKey)}
                            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg transition-colors"
                          >
                            Guardar
                          </button>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-relaxed">
                          Con tu clave gratuita de Resend, el botón <em>&quot;Enviar Automático&quot;</em> despacha correos reales en segundo plano sin abrir ninguna pestaña externa.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: HISTORIAL DE CAMPAÑAS DE EMAIL ENVIADAS */}
      {isEmailHistoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 text-slate-900 shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setIsEmailHistoryModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <History className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-lg">Historial de Campañas de Email</h3>
                <span className="text-xs text-slate-500 block">
                  Registro de difusiones promocionales y avisos enviados a través de MenuBeacon.
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {emailCampaigns.map(camp => (
                <div key={camp.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase flex items-center gap-1">
                      <CheckCheck className="w-3 h-3 text-emerald-600" />
                      <span>Entregado</span>
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {new Date(camp.sentAt).toLocaleString('es-MX', { dateStyle: 'medium', timeStyle: 'short' })}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-sm text-slate-900">{camp.subject}</h4>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{camp.body}</p>

                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                    <div>
                      <strong>Audiencia:</strong> {camp.audience}
                    </div>
                    <div className="font-bold text-indigo-700">
                      {camp.recipientsCount} destinatarios
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 mt-5 text-right">
              <button
                type="button"
                onClick={() => setIsEmailHistoryModalOpen(false)}
                className="py-2.5 px-4 bg-slate-900 text-white font-bold text-xs rounded-xl"
              >
                Cerrar Historial
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: GENERADOR DE NUEVO CÓDIGO QR ÚNICO CON RASTREO     */}
      {/* ========================================================= */}
      {isCreateQrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-6 text-slate-900 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsCreateQrModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <QrCode className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="font-black text-lg text-slate-900">Generar Código QR Único</h3>
                <span className="text-xs text-slate-500 block">
                  Asigna un QR a tu menú, plan de afiliación a tarjetas Wallet, o una mesa específica con contador de visitas individual.
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {/* Type Selector */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">
                  ¿A dónde dirigirá este Código QR?
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setNewQrType('menu');
                      if (!newQrName) setNewQrName('Menú Digital Principal');
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      newQrType === 'menu'
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 shadow-sm ring-2 ring-indigo-500/20'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/70 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-black text-xs">
                      <Utensils className="w-4 h-4 text-indigo-600" />
                      <span>🍽️ Menú Digital</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                      Muestra toda la carta y precios sin contacto.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setNewQrType('loyalty');
                      if (!newQrName) setNewQrName('Plan de Afiliación & Tarjeta Wallet');
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      newQrType === 'loyalty'
                        ? 'border-amber-600 bg-amber-50/70 text-amber-950 shadow-sm ring-2 ring-amber-500/20'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/70 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-black text-xs">
                      <CreditCard className="w-4 h-4 text-amber-600" />
                      <span>💳 Plan de Afiliación</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                      Invita al comensal a guardar su tarjeta Apple / Google Wallet.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setNewQrType('table');
                      if (!newQrName) setNewQrName('Mesa 1');
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      newQrType === 'table'
                        ? 'border-blue-600 bg-blue-50/70 text-blue-950 shadow-sm ring-2 ring-blue-500/20'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/70 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-black text-xs">
                      <Store className="w-4 h-4 text-blue-600" />
                      <span>🪑 Mesa Específica</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                      Menú con identificador de mesa para pedidos y control.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setNewQrType('reviews');
                      if (!newQrName) setNewQrName('Reseñas en Google & InfoLink');
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      newQrType === 'reviews'
                        ? 'border-purple-600 bg-purple-50/70 text-purple-950 shadow-sm ring-2 ring-purple-500/20'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/70 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-black text-xs">
                      <Star className="w-4 h-4 text-purple-600" />
                      <span>⭐ Google Reviews</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                      Enlace directo a dejar reseñas 5 estrellas y redes.
                    </p>
                  </button>
                </div>
              </div>

              {/* QR Name */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Nombre descriptivo del QR *
                </label>
                <input
                  type="text"
                  value={newQrName}
                  onChange={e => setNewQrName(e.target.value)}
                  placeholder="Ej: Mesa 4 Terraza, Menú Cócteles, Afiliación Caja"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
                />
              </div>

              {/* Location & Table # */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Ubicación física en el local
                  </label>
                  <select
                    value={newQrLocation}
                    onChange={e => setNewQrLocation(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none font-medium"
                  >
                    <option value="Mesas">Mesas / Comedor Principal</option>
                    <option value="Caja">Caja / Mostrador de Pago</option>
                    <option value="Barra">Barra / Barra de Tragos</option>
                    <option value="Terraza">Terraza / Zona Exterior</option>
                    <option value="Entrada">Entrada / Puerta / Stand Hostess</option>
                    <option value="Delivery">Empaques / Takeout / Delivery</option>
                    <option value="Redes">Redes Sociales / Instagram</option>
                  </select>
                </div>

                {newQrType === 'table' ? (
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Número / Nombre de Mesa *
                    </label>
                    <input
                      type="text"
                      value={newQrTableNumber}
                      onChange={e => setNewQrTableNumber(e.target.value)}
                      placeholder="Ej: Mesa 1, Mesa VIP, Barra 3"
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none font-medium"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Identificador de Mesa (Opcional)
                    </label>
                    <input
                      type="text"
                      value={newQrTableNumber}
                      onChange={e => setNewQrTableNumber(e.target.value)}
                      placeholder="Opcional, ej: Mesa 1"
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none font-medium"
                    />
                  </div>
                )}
              </div>

              {/* Internal notes */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Notas o especificaciones del soporte (Opcional)
                </label>
                <input
                  type="text"
                  value={newQrNotes}
                  onChange={e => setNewQrNotes(e.target.value)}
                  placeholder="Ej: Soporte acrílico 10x15cm, colocado frente al espejo"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none font-medium"
                />
              </div>

              {/* Live URL Preview */}
              <div className="p-3 bg-indigo-50/50 rounded-2xl border border-indigo-100 text-xs">
                <span className="font-bold text-indigo-900 block mb-1">
                  🔗 Trazabilidad & Rastreo en Tiempo Real:
                </span>
                <p className="text-[11px] text-indigo-800 leading-relaxed font-mono break-all">
                  {(typeof window !== 'undefined' ? window.location.origin : 'https://menubeacon.app')}/
                  {business.slug}?qr=qr-xxx&tab={newQrType === 'loyalty' ? 'card' : newQrType === 'reviews' ? 'info' : 'menu'}
                  {newQrTableNumber ? `&table=${encodeURIComponent(newQrTableNumber)}` : ''}
                </p>
                <p className="text-[10px] text-indigo-600 mt-1">
                  Cada vez que un comensal apunte su cámara a este código, el sistema registrará una visita en vivo y lo contabilizará en tu tablero.
                </p>
              </div>

              {/* Action buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateQrModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  disabled={!newQrName.trim()}
                  onClick={handleCreateTrackedQr}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl shadow-md shadow-indigo-600/20 flex items-center gap-1.5 transition-all hover:scale-[1.02]"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>Crear y Habilitar Rastreo</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: STAND ACRÍLICO / MESA PARA IMPRIMIR CON QR DE ALTA */}
      {/* ========================================================= */}
      {selectedTrackedQrForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 text-slate-900 shadow-2xl relative max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setSelectedTrackedQrForModal(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Stand Acrylic Mockup Preview (Printable area) */}
            <div id="printable-stand-area" className="p-6 bg-gradient-to-b from-slate-50 via-white to-slate-50 rounded-2xl border-2 border-slate-300/80 shadow-md text-center">
              {/* Business Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full shadow-sm mb-4">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
                  {business.name}
                </span>
              </div>

              {/* Title & Call to Action */}
              <h3 className="text-xl font-black text-slate-950 tracking-tight leading-tight">
                {selectedTrackedQrForModal.type === 'menu'
                  ? '¡Explora Nuestro Menú Digital!'
                  : selectedTrackedQrForModal.type === 'loyalty'
                  ? '¡Únete al Club VIP & Gana Premios!'
                  : selectedTrackedQrForModal.type === 'table'
                  ? `Mesa ${selectedTrackedQrForModal.tableNumber || ''} • Menú en tu Móvil`
                  : '¡Califícanos en Google!'}
              </h3>
              <p className="text-xs text-slate-600 mt-1 max-w-xs mx-auto">
                {selectedTrackedQrForModal.type === 'loyalty'
                  ? 'Apunta tu cámara para añadir tu Tarjeta de Lealtad a Apple Wallet o Google Wallet.'
                  : 'Apunta la cámara de tu teléfono móvil a este código para ver la carta y ordenar al instante.'}
              </p>

              {/* High-Res QR Code Image */}
              <div className="my-5 p-4 bg-white rounded-2xl shadow-sm border border-slate-200 inline-block">
                {modalRenderedQrDataUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={modalRenderedQrDataUrl}
                    alt={`Código QR ${selectedTrackedQrForModal.name}`}
                    className="w-52 h-52 mx-auto rounded-xl object-contain"
                  />
                ) : (
                  <div className="w-52 h-52 flex items-center justify-center bg-slate-100 rounded-xl text-xs text-slate-400">
                    Generando QR de alta resolución...
                  </div>
                )}
                <span className="text-[10px] font-bold text-slate-400 block mt-2 tracking-wide uppercase">
                  Sin descargar aplicaciones
                </span>
              </div>

              {/* Location & Stand Footer */}
              <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-500">
                {selectedTrackedQrForModal.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{selectedTrackedQrForModal.location}</span>
                  </span>
                )}
                <span>&bull;</span>
                <span className="text-indigo-600 font-bold">
                  {selectedTrackedQrForModal.name}
                </span>
              </div>

              {/* Live Visits Counter Badge */}
              <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
                <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{selectedTrackedQrForModal.scansCount || 0} visitas registradas</span>
                </span>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">
                  +{selectedTrackedQrForModal.scansToday || 0} hoy
                </span>
              </div>
            </div>

            {/* Action Bar Bottom */}
            <div className="mt-5 space-y-2">
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimir Stand (10x15cm)</span>
                </button>

                {modalRenderedQrDataUrl && (
                  <a
                    href={modalRenderedQrDataUrl}
                    download={`qr_${business.slug}_${selectedTrackedQrForModal.name.toLowerCase().replace(/\s+/g, '_')}.png`}
                    className="px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Descargar PNG</span>
                  </a>
                )}
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => handleSimulateScan(selectedTrackedQrForModal.id)}
                  className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <Zap className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Probar Escaneo / +1 Visita</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedTrackedQrForModal(null)}
                  className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-800"
                >
                  Cerrar
                </button>
              </div>
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
