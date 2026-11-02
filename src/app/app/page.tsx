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
} from 'lucide-react';

export default function MarkethersAppPortal() {
  const [businesses, setBusinesses] = useState<Business[]>(INITIAL_BUSINESSES);
  const [selectedBusinessId, setSelectedBusinessId] = useState<string>(INITIAL_BUSINESSES[0].id);

  // Active navigation view (Clean 3-pillar focus)
  const [activeSection, setActiveSection] = useState<
    | 'panel'
    | 'tarjetas'
    | 'clientes'
    | 'escaner'
    | 'historial'
    | 'menu'
    | 'resenas'
    | 'qr_mostrador'
    | 'qr_menu'
    | 'qr_resenas'
  >('panel');

  // Sidebar collapsible groups
  const [fidelizacionOpen, setFidelizacionOpen] = useState(true);
  const [menuDigitalOpen, setMenuDigitalOpen] = useState(true);
  const [resenasOpen, setResenasOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

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

  const todayFormatted = 'domingo, 1 de noviembre';

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

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex font-sans antialiased">
      {/* ========================================================= */}
      {/* LEFT SIDEBAR (DARK THEME, FOCUSED ON 3 PILLARS)           */}
      {/* ========================================================= */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0a111a] border-r border-slate-900 flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
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
                Markethers OS
              </span>
            </div>
          </div>

          {/* MAIN ITEM: PANEL */}
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
              <span>Panel General</span>
            </button>
          </div>

          {/* PILLAR 1: FIDELIZACIÓN (WALLETS, ESCÁNER, CLIENTES) */}
          <div className="mb-4">
            <button
              onClick={() => setFidelizacionOpen(!fidelizacionOpen)}
              className="w-full flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-emerald-500/90 px-2.5 py-1.5 hover:text-emerald-400"
            >
              <span>1. Fidelización</span>
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
                  <span>Tarjetas Wallet</span>
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
                  <span>Clientes / Socios</span>
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
                  <span>Escáner de Sellos</span>
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
                  <span>Historial de Visitas</span>
                </button>

                <button
                  onClick={() => {
                    setIsQrModalOpen(true);
                    setMobileSidebarOpen(false);
                  }}
                  className="w-full py-2 px-3 rounded-xl flex items-center gap-2.5 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-900/40 transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  <span>QR Mostrador (Imprimir)</span>
                </button>
              </div>
            )}
          </div>

          {/* PILLAR 2: MENÚ DIGITAL */}
          <div className="mb-4">
            <button
              onClick={() => setMenuDigitalOpen(!menuDigitalOpen)}
              className="w-full flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-amber-500/90 px-2.5 py-1.5 hover:text-amber-400"
            >
              <span>2. Menú Digital</span>
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
                  <span>Carta & Productos</span>
                </button>

                <Link
                  href={`/${business.slug}?tab=menu`}
                  target="_blank"
                  className="w-full py-2 px-3 rounded-xl flex items-center gap-2.5 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-900/40 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Ver Menú en Vivo</span>
                </Link>

                <button
                  onClick={() => {
                    setIsQrModalOpen(true);
                    setMobileSidebarOpen(false);
                  }}
                  className="w-full py-2 px-3 rounded-xl flex items-center gap-2.5 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-900/40 transition-colors"
                >
                  <QrCode className="w-4 h-4" />
                  <span>QR Menú para Mesas</span>
                </button>
              </div>
            )}
          </div>

          {/* PILLAR 3: RESEÑAS DE GOOGLE */}
          <div className="mb-4">
            <button
              onClick={() => setResenasOpen(!resenasOpen)}
              className="w-full flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-blue-400/90 px-2.5 py-1.5 hover:text-blue-300"
            >
              <span>3. Reseñas de Google</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform ${
                  resenasOpen ? 'rotate-0' : '-rotate-90'
                }`}
              />
            </button>

            {resenasOpen && (
              <div className="space-y-0.5 mt-1">
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
                  <Star className="w-4 h-4 text-amber-400" />
                  <span>Panel de Reseñas</span>
                </button>

                <button
                  onClick={() => {
                    setActiveSection('resenas');
                    setMobileSidebarOpen(false);
                  }}
                  className="w-full py-2 px-3 rounded-xl flex items-center gap-2.5 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-900/40 transition-colors"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Filtro Inteligente 5⭐</span>
                </button>

                <button
                  onClick={() => {
                    setIsQrModalOpen(true);
                    setMobileSidebarOpen(false);
                  }}
                  className="w-full py-2 px-3 rounded-xl flex items-center gap-2.5 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-900/40 transition-colors"
                >
                  <QrCode className="w-4 h-4 text-blue-400" />
                  <span>QR Reseñas Google</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Sidebar: User Profile */}
        <div className="p-3 border-t border-slate-900 bg-[#070c13] flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-black font-extrabold text-xs flex items-center justify-center shrink-0">
              M
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-white block truncate">
                Markethers Admin
              </span>
              <span className="text-[10px] text-slate-400 truncate block">
                {business.name}
              </span>
            </div>
          </div>

          <Link href="/" className="p-1.5 text-slate-400 hover:text-white rounded-lg" title="Inicio">
            <LogOut className="w-4 h-4" />
          </Link>
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
      {/* MAIN CONTENT AREA                                         */}
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

            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900 tracking-tight capitalize">
                {activeSection === 'panel' ? 'Panel de Control' : activeSection}
              </h1>
              <span className="text-xs text-slate-400 font-medium">
                / {todayFormatted}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsQrModalOpen(true)}
              className="px-3.5 py-1.5 bg-[#22c55e] hover:bg-emerald-600 text-white font-bold text-xs rounded-full flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all"
            >
              <QrCode className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Imprimir QR</span>
            </button>
          </div>
        </header>

        {/* Dynamic Main Body Content */}
        <main className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto w-full flex-1">
          {/* ========================================================= */}
          {/* VIEW: MAIN PANEL (CENTERED ON MENÚ, WALLET & GOOGLE REVIEWS) */}
          {/* ========================================================= */}
          {activeSection === 'panel' && (
            <div className="space-y-8">
              {/* TOP BANNER INSIGHTS (NO SALES, ONLY FIDELIZACIÓN & REVIEWS) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div className="bg-emerald-50/80 border border-emerald-300 rounded-2xl p-4 flex items-start gap-3 shadow-sm">
                  <span className="text-2xl p-1.5 rounded-xl bg-emerald-100 text-emerald-800 shrink-0">
                    📲
                  </span>
                  <div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-200 text-emerald-900">
                      Fidelización Activa
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 mt-1">
                      Tarjetas de lealtad en Apple & Google Wallet
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      Tus clientes guardan su tarjeta sin apps. Acumulan {business.loyaltyConfig.totalStamps} sellos para ganar: <strong>{business.loyaltyConfig.rewardTitle}</strong>.
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50/80 border border-blue-300 rounded-2xl p-4 flex items-start gap-3 shadow-sm">
                  <span className="text-2xl p-1.5 rounded-xl bg-blue-100 text-blue-800 shrink-0">
                    ⭐
                  </span>
                  <div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-200 text-blue-900">
                      Reputación Google
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 mt-1">
                      Filtro inteligente de 5 estrellas conectado
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      Los clientes felices publican directo en Google Maps ({business.googleReviews.googleRating}⭐ con {business.googleReviews.totalReviews} reseñas).
                    </p>
                  </div>
                </div>
              </div>

              {/* SECTION 1: MÉTRICAS DE FIDELIZACIÓN */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-600">
                      1. Programa de Fidelización (Apple & Google Wallet)
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveSection('tarjetas')}
                    className="text-xs font-bold text-emerald-600 hover:underline"
                  >
                    Configurar tarjeta →
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      👥 Socios Registrados
                    </span>
                    <div className="text-2xl font-black text-slate-900">{customers.length * 18 + 42}</div>
                    <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">+18 este mes</span>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      📲 Pases en Wallet
                    </span>
                    <div className="text-2xl font-black text-slate-900">{customers.length * 15 + 36}</div>
                    <span className="text-[10px] text-slate-400 mt-1 block">88% de instalación</span>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      📱 Apple vs Google
                    </span>
                    <div className="text-xs font-bold text-slate-900 mt-2 flex items-center gap-2">
                      <span>🍎 <strong>72%</strong></span>
                      <span>🤖 <strong>28%</strong></span>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 block">Nativo en ambos</span>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      ☑️ Sellos Otorgados
                    </span>
                    <div className="text-2xl font-black text-emerald-600">{customers.length * 48 + 120}</div>
                    <span className="text-[10px] text-slate-400 mt-1 block">Promedio 3.4/socio</span>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      🎁 Premios Entregados
                    </span>
                    <div className="text-2xl font-black text-amber-500">{customers.length * 4 + 12}</div>
                    <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">100% canjeados</span>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      🔄 Tasa de Retorno
                    </span>
                    <div className="text-2xl font-black text-indigo-600">68%</div>
                    <span className="text-[10px] text-slate-400 mt-1 block">Vuelven en &lt;14 días</span>
                  </div>
                </div>
              </div>

              {/* SECTION 2: RESEÑAS DE GOOGLE (NEW CORE PILLAR) */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-600">
                      2. Reputación & Reseñas de Google Maps
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveSection('resenas')}
                    className="text-xs font-bold text-blue-600 hover:underline"
                  >
                    Ver detalles de reseñas →
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                        Calificación Promedio
                      </span>
                      <div className="text-2xl font-black text-slate-900 flex items-center gap-1.5">
                        <span>{business.googleReviews.googleRating}</span>
                        <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 block">Google Maps verificado</span>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                        Total Reseñas
                      </span>
                      <div className="text-2xl font-black text-slate-900">{business.googleReviews.totalReviews}</div>
                      <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">+28 este mes</span>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                        Filtro Inteligente 5⭐
                      </span>
                      <div className="text-sm font-black text-emerald-600 mt-1 flex items-center gap-1">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Activo (Protege reputación)</span>
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 block">4-5⭐ directo a Google</span>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                        Incentivo al Cliente
                      </span>
                      <div className="text-xs font-bold text-slate-800 mt-1">
                        {business.googleReviews.rewardForReview}
                      </div>
                      <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">Estimula calificaciones</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 3: MENÚ DIGITAL */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-600">
                      3. Menú Digital Consultivo
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveSection('menu')}
                    className="text-xs font-bold text-amber-600 hover:underline"
                  >
                    Gestionar platillos →
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Platillos & Bebidas en Carta
                    </span>
                    <div className="text-2xl font-black text-slate-900">{menuItems.length}</div>
                    <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">100% Disponibles</span>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Categorías en Menú
                    </span>
                    <div className="text-2xl font-black text-slate-900">
                      {new Set(menuItems.map(m => m.category)).size}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 block">Filtros rápidos para clientes</span>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                        Acceso para Mesas
                      </span>
                      <div className="text-xs font-bold text-slate-800 mt-1">
                        QR en mesa o link en Instagram
                      </div>
                      <Link
                        href={`/${business.slug}?tab=menu`}
                        target="_blank"
                        className="text-[10px] text-emerald-600 font-bold hover:underline mt-1 block"
                      >
                        Abrir menú público →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* BOTTOM SPLIT: INTERACTIVE CARDS */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                {/* Google Reviews Live Widget */}
                <div>
                  <h4 className="font-bold text-xs text-slate-500 uppercase tracking-wider mb-2.5">
                    Vista previa: Cómo califica tu cliente en Google
                  </h4>
                  <GoogleReviewCard business={business} />
                </div>

                {/* Loyalty Wallet Live Widget */}
                <div>
                  <h4 className="font-bold text-xs text-slate-500 uppercase tracking-wider mb-2.5">
                    Vista previa: Tarjeta de lealtad en Apple/Google Wallet
                  </h4>
                  <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex justify-center">
                    <AppleWalletCard business={business} customer={customers[0]} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* VIEW: TARJETAS (WALLET FIDELIZACIÓN)                      */}
          {/* ========================================================= */}
          {activeSection === 'tarjetas' && (
            <div className="space-y-4">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-base text-slate-900">Configuración de Tarjetas de Lealtad</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Personaliza cómo luce la tarjeta en Apple Wallet y Google Wallet.
                </p>
                <div className="mt-6 flex justify-center">
                  <AppleWalletCard business={business} customer={customers[0]} />
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* VIEW: CLIENTES (CRM DE FIDELIZACIÓN)                     */}
          {/* ========================================================= */}
          {activeSection === 'clientes' && (
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Socios Registrados en el Club</h3>
                  <p className="text-xs text-slate-500">Clientes que tienen instalada tu tarjeta de fidelización.</p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4 font-bold">Cliente</th>
                      <th className="py-3 px-4 font-bold">Teléfono / WhatsApp</th>
                      <th className="py-3 px-4 font-bold">Tarjeta ID</th>
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
                Escáner de Sellos para Personal
              </h3>
              <p className="text-xs text-slate-500 text-center mb-4">
                Apunta la cámara del dispositivo al código QR de la Wallet del cliente.
              </p>

              {!scannedCustomer ? (
                <div className="space-y-4">
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
          {/* VIEW: RESEÑAS DE GOOGLE                                   */}
          {/* ========================================================= */}
          {activeSection === 'resenas' && (
            <div className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-6">
                  <div>
                    <h3 className="font-bold text-base text-slate-900">Potenciador de Reseñas en Google Maps</h3>
                    <p className="text-xs text-slate-500">
                      Consigue más calificaciones de 5 estrellas en tu perfil de Google de forma automática.
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
                        • <strong>Si el cliente da 4 o 5 estrellas:</strong> Se le redirige automáticamente a Google Maps para que su calificación sea pública y aumente tu ranking local.
                      </p>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        • <strong>Si el cliente da 1 a 3 estrellas:</strong> Se abre un formulario de feedback privado que llega directo a tu WhatsApp, evitando que deje una reseña negativa en Google.
                      </p>
                    </div>

                    <button
                      onClick={() => setIsQrModalOpen(true)}
                      className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow"
                    >
                      <QrCode className="w-4 h-4 text-amber-400" />
                      <span>Imprimir Stand de Mesa: "Califícanos en Google"</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* VIEW: MENÚ DIGITAL                                        */}
          {/* ========================================================= */}
          {activeSection === 'menu' && (
            <MenuManager
              business={business}
              menuItems={menuItems}
              onUpdateBusiness={updated => {
                setBusinesses(prev =>
                  prev.map(b => (b.id === business.id ? { ...b, ...updated } : b))
                );
              }}
            />
          )}
        </main>
      </div>

      {/* Stand QR Modal */}
      <CounterQrModal
        business={business}
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
      />
    </div>
  );
}
