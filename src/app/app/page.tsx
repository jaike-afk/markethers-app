'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { INITIAL_BUSINESSES, INITIAL_CUSTOMERS, INITIAL_MENU_ITEMS, INITIAL_TRANSACTIONS } from '@/lib/store';
import { Business, Customer, MenuItem, StampTransaction } from '@/types';
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
} from 'lucide-react';

export default function MarkethersAppPortal() {
  const [businesses, setBusinesses] = useState<Business[]>(INITIAL_BUSINESSES);
  const [selectedBusinessId, setSelectedBusinessId] = useState<string>(INITIAL_BUSINESSES[0].id);

  // Active navigation section
  const [activeSection, setActiveSection] = useState<
    | 'panel'
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
  >('panel');

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
    const headers = ['Nombre', 'Telefono', 'Email', 'Codigo Wallet', 'Sellos Actuales', 'Total Visitas', 'Fecha Registro'];
    const rows = customers.map(c => [
      `"${c.name}"`,
      `"${c.phone}"`,
      `"${c.email || ''}"`,
      `"${c.qrCodeToken}"`,
      c.currentStamps,
      c.totalVisits,
      `"${c.createdAt || new Date().toISOString()}"`,
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

  // Card Designer state
  const business = businesses.find(b => b.id === selectedBusinessId) || businesses[0];
  const [cardDesignerConfig, setCardDesignerConfig] = useState(business.loyaltyConfig);
  const [whatsappNumberInput, setWhatsappNumberInput] = useState(business.whatsapp || '525577889900');
  const [saveDesignerSuccess, setSaveDesignerSuccess] = useState(false);

  const customers = INITIAL_CUSTOMERS.filter(c => c.businessId === business.id);
  const menuItems = INITIAL_MENU_ITEMS.filter(m => m.businessId === business.id);
  const transactions = INITIAL_TRANSACTIONS.filter(t => t.businessId === business.id);

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
    setScannedCustomer({
      ...scannedCustomer,
      currentStamps: updatedStamps,
      totalVisits: scannedCustomer.totalVisits + 1,
    });
    if (updatedStamps >= target) {
      setScanMessage('¡Premio desbloqueado! 🎉');
    } else {
      setScanMessage(`+${count} Sello agregado.`);
    }
  };

  const handleRedeemReward = () => {
    if (!scannedCustomer) return;
    const target = business.loyaltyConfig.totalStamps;
    setScannedCustomer({
      ...scannedCustomer,
      currentStamps: Math.max(0, scannedCustomer.currentStamps - target),
      rewardsRedeemed: scannedCustomer.rewardsRedeemed + 1,
    });
    setScanMessage('¡Recompensa canjeada con éxito!');
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
                Panel de control
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
              <span>Panel</span>
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
                  <span>Tarjetas</span>
                </button>

                <button
                  onClick={() => {
                    setActiveSection('clientes');
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full py-2 px-3 rounded-xl flex items-center gap-2.5 text-xs font-medium transition-colors ${
                    activeSection === 'clientes'
                      ? 'bg-slate-800 text-white font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/40'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Clientes</span>
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
        </div>

        {/* BOTTOM USER PROFILE: JAIKE ROMERO */}
        <div className="p-3 border-t border-slate-900 bg-[#070c13] flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow">
              JR
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-white block truncate">
                Jaike Romero
              </span>
              <span className="text-[10px] text-slate-400 truncate block">
                jaikeromer...
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

            <Link
              href="/"
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
              title="Cerrar sesión / Volver a la página principal"
            >
              <LogOut className="w-4 h-4" />
            </Link>
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
                Panel
              </h1>
              <span className="text-xs text-slate-400 font-medium">
                / {todayFormatted}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Business switcher */}
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

              {/* SECTION: HOY */}
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2 px-1">
                  Hoy
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Card 1: PEDIDOS HOY */}
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center gap-1.5 text-emerald-600">
                      <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">
                        Pedidos hoy
                      </span>
                    </div>
                    <div className="text-3xl font-black text-emerald-600 mt-2">0</div>
                    <span className="text-xs text-slate-400 mt-1 block">0 en 30d</span>
                  </div>

                  {/* Card 2: INGRESOS HOY */}
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center gap-1.5 text-emerald-600">
                      <DollarSign className="w-4 h-4 stroke-[2.5]" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">
                        Ingresos hoy
                      </span>
                    </div>
                    <div className="text-3xl font-black text-emerald-600 mt-2">$ 0</div>
                    <span className="text-xs text-slate-400 mt-1 block">$ 0 en 7d</span>
                  </div>

                  {/* Card 3: TICKET PROMEDIO */}
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center gap-1.5 text-blue-600">
                      <TrendingUp className="w-4 h-4 stroke-[2.5]" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">
                        Ticket promedio
                      </span>
                    </div>
                    <div className="text-3xl font-black text-blue-600 mt-2">$ 0</div>
                    <span className="text-xs text-slate-400 mt-1 block">últimos 30 días</span>
                  </div>

                  {/* Card 4: INGRESOS 30D */}
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center gap-1.5 text-emerald-600">
                      <DollarSign className="w-4 h-4 stroke-[2.5]" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">
                        Ingresos 30d
                      </span>
                    </div>
                    <div className="text-3xl font-black text-emerald-600 mt-2">$ 0</div>
                    <span className="text-xs text-slate-400 mt-1 block">Sin costos de comisión</span>
                  </div>
                </div>
              </div>

              {/* SECTION: CLIENTES Y FIDELIZACIÓN */}
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2 px-1">
                  Clientes y fidelización
                </span>

                {/* Row 1: 6 cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 mb-3.5">
                  {/* CLIENTES */}
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Users className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">
                        Clientes
                      </span>
                    </div>
                    <div className="text-2xl font-black text-slate-900 mt-1.5">1</div>
                    <span className="text-[10px] text-slate-400 mt-1 block">+0 este mes</span>
                  </div>

                  {/* RECURRENTES */}
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center gap-1.5 text-emerald-600">
                      <Repeat className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">
                        Recurrentes
                      </span>
                    </div>
                    <div className="text-2xl font-black text-emerald-600 mt-1.5">0</div>
                    <span className="text-[10px] text-slate-400 mt-1 block">≥2 pedidos</span>
                  </div>

                  {/* TARJETAS */}
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center gap-1.5 text-emerald-600">
                      <CreditCard className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">
                        Tarjetas
                      </span>
                    </div>
                    <div className="text-2xl font-black text-emerald-600 mt-1.5">2</div>
                    <span className="text-[10px] text-slate-400 mt-1 block">Activas</span>
                  </div>

                  {/* PASES EN WALLET */}
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center gap-1.5 text-emerald-600">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">
                        Pases en Wallet
                      </span>
                    </div>
                    <div className="text-2xl font-black text-emerald-600 mt-1.5">2</div>
                    <span className="text-[10px] text-slate-400 mt-1 block">de 2 emitidos</span>
                  </div>

                  {/* APPLE VS GOOGLE */}
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center gap-1.5 text-blue-600">
                      <Smartphone className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">
                        Apple vs Google
                      </span>
                    </div>
                    <div className="text-xs font-bold text-slate-800 mt-2.5 flex items-center gap-2">
                      <span>🍎 <strong>2</strong> (100%)</span>
                      <span>🤖 <strong>0</strong> (0%)</span>
                    </div>
                  </div>

                  {/* SELLOS (30D) */}
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center gap-1.5 text-blue-600">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">
                        Sellos (30d)
                      </span>
                    </div>
                    <div className="text-2xl font-black text-blue-600 mt-1.5">0</div>
                    <span className="text-[10px] text-slate-400 mt-1 block">Registrados</span>
                  </div>
                </div>

                {/* Row 2: 2 cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* RECOMPENSAS (30D) */}
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center gap-1.5 text-emerald-600">
                      <Gift className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">
                        Recompensas (30d)
                      </span>
                    </div>
                    <div className="text-2xl font-black text-emerald-600 mt-1.5">0</div>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      premios canjeados con sellos
                    </span>
                  </div>

                  {/* CALIFICACIÓN */}
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center gap-1.5 text-blue-600">
                      <Star className="w-3.5 h-3.5 fill-blue-500" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">
                        Calificación
                      </span>
                    </div>
                    <div className="text-2xl font-black text-slate-400 mt-1.5">—</div>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Aún sin calificaciones
                    </span>
                  </div>
                </div>
              </div>

              {/* BOTTOM SECTION: TOP PRODUCTOS & ACTIVIDAD RECIENTE */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
                {/* Left: Top productos */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                  <h3 className="font-bold text-sm text-slate-800">Top productos</h3>

                  <div className="py-12 text-center space-y-2">
                    <div className="text-4xl">🏆</div>
                    <h4 className="font-bold text-xs text-slate-800">Top productos</h4>
                    <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                      Cuando llegue el primer pedido, aquí verás tus productos más vendidos.
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex justify-center">
                    <button
                      onClick={() => setActiveSection('menu')}
                      className="text-xs font-bold text-emerald-600 hover:underline"
                    >
                      Ver platillos en carta →
                    </button>
                  </div>
                </div>

                {/* Right: Actividad reciente */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-slate-800">Actividad reciente</h3>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Últimos 14 días
                    </span>
                  </div>

                  <div className="py-12 text-center space-y-2">
                    <div className="text-4xl">📋</div>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                      Sin actividad todavía. Aquí verás pedidos, sellos y nuevos clientes en cuanto empiecen a llegar.
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex justify-center">
                    <button
                      onClick={() => setActiveSection('escaner')}
                      className="text-xs font-bold text-emerald-600 hover:underline"
                    >
                      Abrir escáner de sellos →
                    </button>
                  </div>
                </div>
              </div>
            </div>
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
          {/* VIEW: CLIENTES (CRM DE SOCIOS REGISTRADOS)                */}
          {/* ========================================================= */}
          {activeSection === 'clientes' && (
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold text-base text-slate-900">Base de Datos de Clientes & CRM</h3>
                  <p className="text-xs text-slate-500">
                    Comensales registrados con tarjeta de fidelización en Apple Wallet y Google Wallet.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200">
                    {customers.length} Clientes activos
                  </span>
                  <button
                    onClick={handleExportCSV}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
                    title="Descargar base de datos en CSV / Excel"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Exportar CSV</span>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4 font-bold">Cliente</th>
                      <th className="py-3 px-4 font-bold">Teléfono / Móvil</th>
                      <th className="py-3 px-4 font-bold">Código Wallet</th>
                      <th className="py-3 px-4 font-bold">Sellos acumulados</th>
                      <th className="py-3 px-4 font-bold">Visitas totales</th>
                      <th className="py-3 px-4 font-bold text-right">Contacto directo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {customers.map(c => (
                      <tr key={c.id} className="hover:bg-slate-50/80">
                        <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-bold text-[10px] flex items-center justify-center">
                            {c.name.charAt(0)}
                          </div>
                          <span>{c.name}</span>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-600">{c.phone}</td>
                        <td className="py-3.5 px-4 font-mono text-slate-500">{c.qrCodeToken}</td>
                        <td className="py-3.5 px-4 font-bold text-emerald-600">
                          {c.currentStamps} de {business.loyaltyConfig.totalStamps} sellos
                        </td>
                        <td className="py-3.5 px-4 font-semibold">{c.totalVisits} visitas</td>
                        <td className="py-3.5 px-4 text-right flex items-center justify-end gap-1.5">
                          <a
                            href={`tel:${c.phone}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs shadow-sm transition-colors"
                            title="Llamar al cliente"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>Llamar</span>
                          </a>
                          <a
                            href={`https://wa.me/${c.phone.replace(/\D/g, '')}?text=¡Hola ${c.name}! Te escribimos de ${business.name}.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#22c55e] hover:bg-emerald-600 text-white font-bold rounded-lg text-xs shadow-sm transition-colors"
                            title="Enviar mensaje directo"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>Mensaje</span>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
                    {transactions.map(t => (
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
                    ))}
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
