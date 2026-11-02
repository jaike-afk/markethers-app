'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { INITIAL_BUSINESSES, INITIAL_CUSTOMERS, INITIAL_MENU_ITEMS, INITIAL_TRANSACTIONS } from '@/lib/store';
import { Business, Customer, MenuItem, StampTransaction } from '@/types';
import { AppleWalletCard } from '@/components/AppleWalletCard';
import { CameraScanner } from '@/components/CameraScanner';
import { CounterQrModal } from '@/components/CounterQrModal';
import {
  LayoutDashboard,
  CreditCard,
  Users,
  QrCode,
  History,
  Bell,
  Star,
  ExternalLink,
  Smartphone,
  Lock,
  Play,
  Search,
  MessageCircle,
  LogOut,
  ChevronDown,
  ShoppingBag,
  TrendingUp,
  DollarSign,
  Gift,
  HelpCircle,
  Plus,
  CheckCircle2,
  X,
  FileText,
  Sliders,
  Utensils,
  BookOpen,
  Share2,
  Menu,
} from 'lucide-react';

export default function ClubifyAppPortal() {
  const [businesses, setBusinesses] = useState<Business[]>(INITIAL_BUSINESSES);
  const [selectedBusinessId, setSelectedBusinessId] = useState<string>(INITIAL_BUSINESSES[0].id);

  // Active navigation view
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
    | 'qr_infolink'
    | 'menu'
    | 'infolink'
  >('panel');

  // Sidebar collapsible groups
  const [fidelizacionOpen, setFidelizacionOpen] = useState(true);
  const [marketingOpen, setMarketingOpen] = useState(true);
  const [menuDigitalOpen, setMenuDigitalOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Dismissible insights banners
  const [showBanner1, setShowBanner1] = useState(true);
  const [showBanner2, setShowBanner2] = useState(true);

  // Stand modal
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  // Scanner state inside Panel
  const [scannedCustomer, setScannedCustomer] = useState<Customer | null>(null);
  const [scanMessage, setScanMessage] = useState<string | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);

  const business = businesses.find(b => b.id === selectedBusinessId) || businesses[0];
  const customers = INITIAL_CUSTOMERS.filter(c => c.businessId === business.id);
  const menuItems = INITIAL_MENU_ITEMS.filter(m => m.businessId === business.id);
  const transactions = INITIAL_TRANSACTIONS.filter(t => t.businessId === business.id);

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

  // Dynamic formatted date in Spanish
  const todayFormatted = 'domingo, 1 de noviembre';

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex font-sans antialiased">
      {/* ========================================================= */}
      {/* LEFT SIDEBAR (DARK THEME, IDENTICAL TO SCREENSHOT)        */}
      {/* ========================================================= */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0a111a] border-r border-slate-900 flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top: Business Logo & Brand */}
        <div className="flex-1 overflow-y-auto py-5 px-3 scrollbar-none">
          {/* Business Header */}
          <div className="flex items-center gap-3 px-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-lime-400 p-0.5 shadow-lg shadow-emerald-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-[#0a111a] rounded-[10px] flex items-center justify-center text-xl">
                {business.logoUrl || '🍸'}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-bold text-white tracking-tight truncate leading-tight">
                {business.name}
              </h2>
              <span className="text-[11px] text-slate-400 font-medium block">
                Panel de control
              </span>
            </div>
          </div>

          {/* MAIN ITEM: PANEL (ACTIVE PILL) */}
          <div className="mb-4">
            <button
              onClick={() => {
                setActiveSection('panel');
                setMobileSidebarOpen(false);
              }}
              className={`w-full py-2.5 px-3 rounded-xl flex items-center gap-2.5 text-xs font-bold transition-all shadow-md ${
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
              className="w-full flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-emerald-500/80 px-2.5 py-1.5 hover:text-emerald-400"
            >
              <span>Tarjetas de Fidelización</span>
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
                      ? 'bg-slate-800/80 text-white font-bold'
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
                      ? 'bg-slate-800/80 text-white font-bold'
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
                      ? 'bg-slate-800/80 text-white font-bold'
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
                      ? 'bg-slate-800/80 text-white font-bold'
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
                      ? 'bg-slate-800/80 text-white font-bold'
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
                      ? 'bg-slate-800/80 text-white font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/40'
                  }`}
                >
                  <Star className="w-4 h-4" />
                  <span>Reseña de Google</span>
                </button>
              </div>
            )}
          </div>

          {/* SECTION 2: MARKETING */}
          <div className="mb-4">
            <button
              onClick={() => setMarketingOpen(!marketingOpen)}
              className="w-full flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-emerald-500/80 px-2.5 py-1.5 hover:text-emerald-400"
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
                    setIsQrModalOpen(true);
                    setMobileSidebarOpen(false);
                  }}
                  className="w-full py-2 px-3 rounded-xl flex items-center gap-2.5 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-900/40 transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  <span>QR Menú</span>
                </button>

                <button
                  onClick={() => {
                    setIsQrModalOpen(true);
                    setMobileSidebarOpen(false);
                  }}
                  className="w-full py-2 px-3 rounded-xl flex items-center gap-2.5 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-900/40 transition-colors"
                >
                  <QrCode className="w-4 h-4" />
                  <span>QR Mostrador</span>
                </button>

                <button
                  onClick={() => {
                    setIsQrModalOpen(true);
                    setMobileSidebarOpen(false);
                  }}
                  className="w-full py-2 px-3 rounded-xl flex items-center gap-2.5 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-900/40 transition-colors"
                >
                  <Gift className="w-4 h-4" />
                  <span>QR Descuento</span>
                </button>

                <button
                  onClick={() => {
                    setIsQrModalOpen(true);
                    setMobileSidebarOpen(false);
                  }}
                  className="w-full py-2 px-3 rounded-xl flex items-center gap-2.5 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-900/40 transition-colors"
                >
                  <Star className="w-4 h-4" />
                  <span>QR Reseñas</span>
                </button>

                <button
                  onClick={() => {
                    setIsQrModalOpen(true);
                    setMobileSidebarOpen(false);
                  }}
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
              className="w-full flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-emerald-500/80 px-2.5 py-1.5 hover:text-emerald-400"
            >
              <span>Menú Digital</span>
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
                      ? 'bg-slate-800/80 text-white font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/40'
                  }`}
                >
                  <Utensils className="w-4 h-4" />
                  <span>Menú</span>
                </button>

                <button
                  onClick={() => {
                    setActiveSection('menu');
                    setMobileSidebarOpen(false);
                  }}
                  className="w-full py-2 px-3 rounded-xl flex items-center gap-2.5 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-900/40 transition-colors"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Menú libro</span>
                </button>

                <Link
                  href={`/${business.slug}`}
                  target="_blank"
                  className="w-full py-2 px-3 rounded-xl flex items-center gap-2.5 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-900/40 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>InfoLink</span>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Sidebar: User Profile & Quick Actions */}
        <div className="p-3 border-t border-slate-900 bg-[#070c13] flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
              JR
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-white block truncate">
                Jaike Ro...
              </span>
              <span className="text-[10px] text-slate-400 truncate block">
                jaikeromer...
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button className="p-1.5 text-slate-400 hover:text-white rounded-lg">
              <Bell className="w-4 h-4" />
            </button>
            <Link href="/" className="p-1.5 text-slate-400 hover:text-white rounded-lg" title="Salir">
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
      {/* MAIN CONTENT AREA (BRIGHT, CLEAN SAAS STYLE)              */}
      {/* ========================================================= */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb Title */}
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900 tracking-tight capitalize">
                {activeSection}
              </h1>
              <span className="text-xs text-slate-400 font-medium">
                / {todayFormatted}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Green Tutorial Button */}
            <button className="px-3.5 py-1.5 bg-[#22c55e] hover:bg-emerald-600 text-white font-bold text-xs rounded-full flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all">
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Ver tutorial</span>
            </button>

            {/* Search Bar with ⌘K badge */}
            <div className="hidden sm:flex items-center gap-2 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-500 transition-colors cursor-pointer">
              <Search className="w-3.5 h-3.5" />
              <span>Buscar</span>
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white border border-slate-200 rounded-md text-slate-400">
                ⌘K
              </kbd>
            </div>
          </div>
        </header>

        {/* Dynamic Main Body Content */}
        <main className="p-4 sm:p-8 space-y-6 max-w-7xl mx-auto w-full flex-1">
          {/* ========================================================= */}
          {/* VIEW: MAIN PANEL (EXACT MATCH OF SCREENSHOT)              */}
          {/* ========================================================= */}
          {activeSection === 'panel' && (
            <div className="space-y-6">
              {/* TOP BANNER INSIGHTS ("TU NEGOCIO HOY - 2 INSIGHTS") */}
              <div>
                <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-slate-400 mb-2.5">
                  <span>Tu negocio hoy</span>
                  <span className="text-[11px] font-bold text-slate-400">2 Insights</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {/* Banner 1: WhatsApp Configuration Warning */}
                  {showBanner1 && (
                    <div className="bg-amber-50/70 border border-amber-300 rounded-2xl p-4 flex items-start justify-between gap-3 relative shadow-sm">
                      <div className="flex items-start gap-3">
                        <span className="text-xl p-1.5 rounded-xl bg-amber-100 text-amber-800 shrink-0">
                          📱
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-200/90 text-amber-900">
                              Atención
                            </span>
                          </div>
                          <h4 className="font-bold text-sm text-slate-900 mt-1">
                            Configura tu WhatsApp del negocio
                          </h4>
                          <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                            Es donde te llegan los pedidos. Sin esto, los clientes no pueden enviarte sus carritos.
                          </p>
                          <a
                            href={`/${business.slug}`}
                            target="_blank"
                            className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 hover:text-amber-950 mt-2"
                          >
                            <span>Configurar →</span>
                          </a>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowBanner1(false)}
                        className="text-slate-400 hover:text-slate-600 p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Banner 2: Mini-sitio en borrador */}
                  {showBanner2 && (
                    <div className="bg-emerald-50/70 border border-emerald-300 rounded-2xl p-4 flex items-start justify-between gap-3 relative shadow-sm">
                      <div className="flex items-start gap-3">
                        <span className="text-xl p-1.5 rounded-xl bg-emerald-100 text-emerald-800 shrink-0">
                          🔒
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-200/90 text-emerald-900">
                              Sugerencia
                            </span>
                          </div>
                          <h4 className="font-bold text-sm text-slate-900 mt-1">
                            Tu mini-sitio está en borrador
                          </h4>
                          <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                            Mientras esté oculto, nadie puede pedir desde tu link público.
                          </p>
                          <Link
                            href={`/${business.slug}`}
                            target="_blank"
                            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-950 mt-2"
                          >
                            <span>Publicar sitio →</span>
                          </Link>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowBanner2(false)}
                        className="text-slate-400 hover:text-slate-600 p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION: HOY (4 METRIC CARDS) */}
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-slate-400 block mb-2.5">
                  Hoy
                </span>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm hover:border-slate-300 transition-colors">
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                      <ShoppingBag className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-[11px] text-emerald-600">Pedidos Hoy</span>
                    </div>
                    <div className="text-2xl font-black text-slate-900">0</div>
                    <span className="text-[11px] text-slate-400 mt-1 block">0 en 30d</span>
                  </div>

                  <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm hover:border-slate-300 transition-colors">
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-[11px] text-emerald-600">Ingresos Hoy</span>
                    </div>
                    <div className="text-2xl font-black text-slate-900">$ 0</div>
                    <span className="text-[11px] text-slate-400 mt-1 block">$ 0 en 7d</span>
                  </div>

                  <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm hover:border-slate-300 transition-colors">
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                      <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
                      <span className="text-[11px] text-blue-600">Ticket Promedio</span>
                    </div>
                    <div className="text-2xl font-black text-slate-900">$ 0</div>
                    <span className="text-[11px] text-slate-400 mt-1 block">últimos 30 días</span>
                  </div>

                  <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm hover:border-slate-300 transition-colors">
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-[11px] text-emerald-600">Ingresos 30D</span>
                    </div>
                    <div className="text-2xl font-black text-slate-900">$ 0</div>
                    <span className="text-[11px] text-slate-400 mt-1 block">&nbsp;</span>
                  </div>
                </div>
              </div>

              {/* SECTION: CLIENTES Y FIDELIZACIÓN (8 KPI CARDS) */}
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-slate-400 block mb-2.5">
                  Clientes y Fidelización
                </span>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
                  {/* Clientes */}
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      👥 Clientes
                    </span>
                    <div className="text-2xl font-black text-slate-900">
                      {customers.length || 1}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 block">+0 este mes</span>
                  </div>

                  {/* Recurrentes */}
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 block mb-1">
                      🔄 Recurrentes
                    </span>
                    <div className="text-2xl font-black text-slate-900">0</div>
                    <span className="text-[10px] text-slate-400 mt-1 block">≥2 pedidos</span>
                  </div>

                  {/* Tarjetas */}
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 block mb-1">
                      💳 Tarjetas
                    </span>
                    <div className="text-2xl font-black text-slate-900">2</div>
                    <span className="text-[10px] text-slate-400 mt-1 block">&nbsp;</span>
                  </div>

                  {/* Pases en Wallet */}
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 block mb-1">
                      📲 Pases en Wallet
                    </span>
                    <div className="text-2xl font-black text-slate-900">2</div>
                    <span className="text-[10px] text-slate-400 mt-1 block">de 2 emitidos</span>
                  </div>

                  {/* Apple vs Google */}
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 block mb-1">
                      📱 Apple vs Google
                    </span>
                    <div className="text-sm font-bold text-slate-900 mt-2 flex items-center gap-2">
                      <span>🍎 <strong>2</strong> <small className="text-slate-400">(100%)</small></span>
                      <span>🤖 <strong>0</strong> <small className="text-slate-400">(0%)</small></span>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 block">&nbsp;</span>
                  </div>

                  {/* Sellos (30D) */}
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 block mb-1">
                      ☑️ Sellos (30D)
                    </span>
                    <div className="text-2xl font-black text-blue-600">0</div>
                    <span className="text-[10px] text-slate-400 mt-1 block">&nbsp;</span>
                  </div>

                  {/* Recompensas (30D) */}
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 block mb-1">
                      🎁 Recompensas (30D)
                    </span>
                    <div className="text-2xl font-black text-emerald-600">0</div>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      premios canjeados con sellos
                    </span>
                  </div>

                  {/* Calificación */}
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 block mb-1">
                      ✨ Calificación
                    </span>
                    <div className="text-2xl font-black text-slate-400">—</div>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Aún sin calificaciones
                    </span>
                  </div>
                </div>
              </div>

              {/* BOTTOM SPLIT: TOP PRODUCTOS & ACTIVIDAD RECIENTE */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Top productos */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[200px] shadow-sm">
                  <span className="text-3xl mb-2">🏆</span>
                  <h4 className="font-bold text-sm text-slate-900">Top productos</h4>
                  <p className="text-xs text-slate-400 max-w-xs mt-1">
                    Cuando llegue el primer pedido, aquí verás tus productos más vendidos.
                  </p>
                </div>

                {/* Actividad reciente */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[200px]">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h4 className="font-bold text-xs text-slate-900">Actividad reciente</h4>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      Últimos 14 días
                    </span>
                  </div>

                  <div className="text-center py-6">
                    <span className="text-3xl block mb-2">📋</span>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      Sin actividad todavía. Aquí verás pedidos, sellos y nuevos clientes en cuanto empiecen a llegar.
                    </p>
                  </div>

                  <div className="text-right">
                    <button
                      onClick={() => setActiveSection('escaner')}
                      className="text-xs text-emerald-600 font-bold hover:underline"
                    >
                      Probar escáner ahora →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* VIEW: TARJETAS (WALLET DESIGNER)                          */}
          {/* ========================================================= */}
          {activeSection === 'tarjetas' && (
            <div className="space-y-4">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-base text-slate-900">Configuración de Tarjetas Wallet</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Personaliza cómo ven la tarjeta de lealtad tus clientes en Apple Wallet y Google Wallet.
                </p>
                <div className="mt-6 flex justify-center">
                  <AppleWalletCard business={business} customer={customers[0]} />
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* VIEW: CLIENTES (CRM)                                      */}
          {/* ========================================================= */}
          {activeSection === 'clientes' && (
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Directorio de Clientes</h3>
                  <p className="text-xs text-slate-500">Base de datos de clientes con tarjetas emitidas.</p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4 font-bold">Cliente</th>
                      <th className="py-3 px-4 font-bold">Teléfono / WhatsApp</th>
                      <th className="py-3 px-4 font-bold">Tarjeta Token</th>
                      <th className="py-3 px-4 font-bold">Sellos</th>
                      <th className="py-3 px-4 font-bold">Visitas</th>
                      <th className="py-3 px-4 font-bold text-right">Contacto</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {customers.map(c => (
                      <tr key={c.id} className="hover:bg-slate-50/80">
                        <td className="py-3.5 px-4 font-bold text-slate-900">{c.name}</td>
                        <td className="py-3.5 px-4 font-mono text-slate-600">{c.phone}</td>
                        <td className="py-3.5 px-4 font-mono text-slate-500">{c.qrCodeToken}</td>
                        <td className="py-3.5 px-4 font-bold text-emerald-600">
                          {c.currentStamps} / {business.loyaltyConfig.totalStamps}
                        </td>
                        <td className="py-3.5 px-4 font-semibold">{c.totalVisits}</td>
                        <td className="py-3.5 px-4 text-right">
                          <a
                            href={`https://wa.me/${c.phone.replace(/\D/g, '')}?text=¡Hola ${c.name}!`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold rounded-lg text-[11px]"
                          >
                            <MessageCircle className="w-3 h-3" />
                            WhatsApp
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
          {/* VIEW: ESCÁNER                                             */}
          {/* ========================================================= */}
          {activeSection === 'escaner' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm max-w-lg mx-auto">
              <h3 className="font-bold text-base text-slate-900 text-center mb-1">
                Escáner de Tarjetas de Caja
              </h3>
              <p className="text-xs text-slate-500 text-center mb-4">
                Apunta la cámara del dispositivo al código QR de la Wallet del cliente o prueba con un código demo.
              </p>

              {!scannedCustomer ? (
                <div className="space-y-4">
                  {/* Demo test buttons */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1.5">
                      Probar con cliente de muestra:
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleScanCode('CARD-AROMA-88219')}
                        className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs rounded-lg border border-slate-200 font-semibold"
                      >
                        Carlos (6/8 sellos)
                      </button>
                      <button
                        onClick={() => handleScanCode('CARD-AROMA-19402')}
                        className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs rounded-lg border border-emerald-200 font-bold"
                      >
                        Sofia (8/8 🎉 Premio listo)
                      </button>
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
                /* Scanned customer card */
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
                      <span className="text-slate-500 font-medium">Progreso de Sellos:</span>
                      <span className="font-black text-emerald-600">
                        {scannedCustomer.currentStamps} de {business.loyaltyConfig.totalStamps} sellos
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
          {/* VIEW: MENÚ DIGITAL                                        */}
          {/* ========================================================= */}
          {activeSection === 'menu' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-slate-900">Menú Digital & Catálogo</h3>
                  <p className="text-xs text-slate-500">
                    Platillos y bebidas que tus clientes ven en el InfoLink.
                  </p>
                </div>
                <Link
                  href={`/${business.slug}?tab=menu`}
                  target="_blank"
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Ver Menú Público</span>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {menuItems.map(item => (
                  <div
                    key={item.id}
                    className="p-3.5 border border-slate-200 rounded-xl bg-slate-50 flex items-center justify-between"
                  >
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">{item.name}</h4>
                      <span className="text-[10px] text-slate-500 block">{item.category}</span>
                      <span className="text-xs font-black text-emerald-600 block mt-1">
                        ${item.price}
                      </span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                      Disponible
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ========================================================= */}
      {/* FLOATING GREEN WHATSAPP BUTTON (MATCHING SCREENSHOT)      */}
      {/* ========================================================= */}
      <a
        href={`https://wa.me/${business.whatsapp || '525512345678'}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-[#22c55e] hover:bg-emerald-600 text-white flex items-center justify-center shadow-xl shadow-emerald-500/30 transition-transform hover:scale-110 active:scale-95"
        title="Soporte y contacto vía WhatsApp"
      >
        <MessageCircle className="w-6 h-6 fill-white text-emerald-500" />
      </a>

      {/* Stand QR Modal */}
      <CounterQrModal
        business={business}
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
      />
    </div>
  );
}
