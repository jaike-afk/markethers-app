'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppleWalletCard } from '@/components/AppleWalletCard';
import { GoogleReviewCard } from '@/components/GoogleReviewCard';
import { DigitalMenuShowcase } from '@/components/DigitalMenuShowcase';
import { PricingSection } from '@/components/PricingSection';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { MenuBeaconLogo } from '@/components/MenuBeaconLogo';
import { INITIAL_BUSINESSES, INITIAL_CUSTOMERS } from '@/lib/store';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/lib/translations';
import {
  Sparkles,
  Smartphone,
  QrCode,
  Users,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Zap,
  ChevronDown,
  Bell,
  Star,
  Globe,
  CreditCard,
  FileText,
  UploadCloud,
  Check,
  Mail,
  Filter,
  Download,
} from 'lucide-react';

export default function HomePage() {
  const { language, setLanguage, mounted } = useLanguage();
  const activeLang = mounted ? language : 'es';
  const t = translations[activeLang];

  const [interactiveStamps, setInteractiveStamps] = useState(6);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const demoBusiness = INITIAL_BUSINESSES[0]; // Café Aroma
  const demoCustomer = INITIAL_CUSTOMERS[0]; // Carlos Mendoza

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-emerald-500 selection:text-black overflow-x-clip relative max-w-full w-full">
      {/* Background glow lighting effects - strictly clipped */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 max-w-full">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[450px] sm:h-[600px] bg-gradient-to-b from-emerald-500/15 via-teal-600/5 to-transparent blur-3xl" />
      </div>

      {/* ========================================================= */}
      {/* 1. HERO SECTION                                           */}
      {/* ========================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-16 text-center">
        {/* Release / Category Badge & Language Quick Switcher */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-bold">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>{t.hero.badge}</span>
          </div>

          <div className="inline-flex items-center bg-zinc-900/90 border border-zinc-800 rounded-full p-1 text-xs">
            <button
              onClick={() => setLanguage('es')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                language === 'es'
                  ? 'bg-emerald-500 text-black shadow font-black'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              🇲🇽 Español
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                language === 'en'
                  ? 'bg-emerald-500 text-black shadow font-black'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              🇺🇸 English
            </button>
          </div>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-6xl md:text-7xl font-black tracking-tight text-white max-w-5xl mx-auto leading-[1.12] sm:leading-[1.08]">
          {t.hero.headlinePart1}{' '}
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-lime-300 bg-clip-text text-transparent">
            {t.hero.headlineHighlight}
          </span>{' '}
          {t.hero.headlinePart2}
        </h1>

        {/* Deep Sub-headline */}
        <p className="mt-6 text-base sm:text-xl text-zinc-300 max-w-3xl mx-auto leading-relaxed font-normal">
          {t.hero.subtitle}
        </p>

        {/* High-Impact CTA Row */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <Link
            href="/app"
            className="w-full sm:w-auto px-8 py-4 bg-[#22c55e] hover:bg-emerald-600 text-black font-extrabold text-sm rounded-2xl flex items-center justify-center gap-2.5 shadow-xl shadow-emerald-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>{t.hero.ctaPrimary}</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </Link>

          <Link
            href="/aroma-cafe"
            className="w-full sm:w-auto px-7 py-4 bg-zinc-900 hover:bg-zinc-850 text-white border border-zinc-800 font-bold text-sm rounded-2xl flex items-center justify-center gap-2 transition-all hover:border-zinc-700"
          >
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <span>{t.hero.ctaSecondary}</span>
          </Link>

          <Link
            href="/scanner"
            className="w-full sm:w-auto px-6 py-4 bg-zinc-900/60 hover:bg-zinc-850 text-zinc-300 border border-zinc-800/80 font-semibold text-sm rounded-2xl flex items-center justify-center gap-2 transition-all"
          >
            <QrCode className="w-4 h-4 text-emerald-400" />
            <span>{t.hero.ctaScanner}</span>
          </Link>
        </div>

        {/* 4 Core Selling Feature Badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs font-semibold">
          <span className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{activeLang === 'es' ? '1. Recompensas en Apple & Google Wallet' : '1. Apple & Google Wallet Rewards'}</span>
          </span>
          <span className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300">
            <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
            <span>{activeLang === 'es' ? '2. CRM de tus Clientes (Base de Datos)' : '2. Customer CRM & Database'}</span>
          </span>
          <span className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{activeLang === 'es' ? '3. Menú Digital (En Sistema o tu PDF)' : '3. Digital Menu (Platform or PDF)'}</span>
          </span>
          <span className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300">
            <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
            <span>{activeLang === 'es' ? '4. Filtro 5⭐ para Reseñas en Google Maps' : '4. 5⭐ Google Maps Reviews Filter'}</span>
          </span>
        </div>

        {/* Hero Interactive Wallet Preview */}
        <div className="mt-12 max-w-4xl mx-auto bg-gradient-to-b from-zinc-900/90 via-zinc-900/40 to-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-zinc-800/80">
            <div className="text-left">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block mb-0.5">
                {t.hero.simTitle}
              </span>
              <h3 className="text-xl font-black text-white">{t.hero.simSubtitle}</h3>
            </div>

            <button
              onClick={() => setInteractiveStamps(prev => (prev >= 8 ? 1 : prev + 1))}
              className="px-5 py-2.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-xs rounded-xl border border-emerald-500/40 flex items-center gap-2 transition-all active:scale-95 shrink-0 shadow-lg shadow-emerald-500/10 cursor-pointer"
            >
              <Zap className="w-4 h-4 text-emerald-400 fill-current" />
              <span>{t.hero.simButton}</span>
            </button>
          </div>

          <div className="pt-6 flex justify-center">
            <AppleWalletCard
              business={demoBusiness}
              customer={{
                ...demoCustomer,
                currentStamps: interactiveStamps,
              }}
            />
          </div>
        </div>

        {/* Social Proof Stats Bar */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 sm:p-6 bg-zinc-900/60 border border-zinc-800 rounded-3xl text-center backdrop-blur-md">
            <div>
              <div className="text-2xl sm:text-3xl font-black text-white">{t.statsBar.activeBusinesses}</div>
              <div className="text-xs text-zinc-400 mt-1">{t.statsBar.activeBusinessesLabel}</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-amber-400">{t.statsBar.rating}</div>
              <div className="text-xs text-zinc-400 mt-1">{t.statsBar.ratingLabel}</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-400">{t.statsBar.walletsCreated}</div>
              <div className="text-xs text-zinc-400 mt-1">{t.statsBar.walletsCreatedLabel}</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-white">{t.statsBar.zeroCommission}</div>
              <div className="text-xs text-zinc-400 mt-1">{t.statsBar.zeroCommissionLabel}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. PILAR 1: RECOMPENSAS EN APPLE & GOOGLE WALLET           */}
      {/* ========================================================= */}
      <section id="recompensas" className="max-w-6xl mx-auto px-4 sm:px-6 py-20 border-t border-zinc-900">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-bold mb-4">
            <CreditCard className="w-4 h-4 text-emerald-400" />
            <span>{activeLang === 'es' ? 'Pilar 1: Fidelización & Recompensas' : 'Pillar 1: Loyalty & Rewards'}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            {activeLang === 'es' ? 'Tarjetas de sellos nativas en el celular de tus comensales' : 'Native stamp cards right on your diners’ phones'}
          </h2>
          <p className="mt-4 text-sm sm:text-base text-zinc-300 max-w-2xl mx-auto leading-relaxed">
            {activeLang === 'es'
              ? 'Tus clientes no tienen que descargar apps pesadas ni crear cuentas tediosas. Guardan su tarjeta en Apple Wallet o Google Wallet en 5 segundos.'
              : 'Your customers don’t need to download bulky apps or fill out forms. They save their card into Apple Wallet or Google Wallet in 5 seconds.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-zinc-900/50 border border-emerald-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl">
          <div className="lg:col-span-7 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-zinc-950/70 p-4 rounded-2xl border border-zinc-800 space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{activeLang === 'es' ? '0 Descargas de Apps' : '0 App Downloads'}</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {activeLang === 'es'
                    ? '+85% de adopción en mostrador frente a solo 15% que logran las apps tradicionales.'
                    : '+85% checkout adoption vs only 15% achieved by separate custom apps.'}
                </p>
              </div>

              <div className="bg-zinc-950/70 p-4 rounded-2xl border border-zinc-800 space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <Bell className="w-4 h-4 shrink-0" />
                  <span>{activeLang === 'es' ? 'Alertas de Cercanía' : 'Proximity Push'}</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {activeLang === 'es'
                    ? 'El celular de tus comensales les muestra su tarjeta en pantalla de bloqueo cuando caminan cerca de tu negocio.'
                    : 'Your diners receive a lock-screen alert reminding them to stop by whenever they walk near your store.'}
                </p>
              </div>

              <div className="bg-zinc-950/70 p-4 rounded-2xl border border-zinc-800 space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <QrCode className="w-4 h-4 shrink-0" />
                  <span>{activeLang === 'es' ? 'Escaneo en 2 Segundos' : '2-Second Web Scan'}</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {activeLang === 'es'
                    ? 'Tus cajeros o meseros escanean desde cualquier teléfono celular o tablet con PIN, sin comprar terminales caras.'
                    : 'Staff scans directly using any smartphone camera with a 4-digit PIN. Zero dedicated hardware.'}
                </p>
              </div>

              <div className="bg-zinc-950/70 p-4 rounded-2xl border border-zinc-800 space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <Users className="w-4 h-4 shrink-0" />
                  <span>{activeLang === 'es' ? 'Conexión Directa al CRM' : 'Direct CRM Sync'}</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {activeLang === 'es'
                    ? 'Cada tarjeta guardada registra automáticamente nombre y teléfono en tu base de datos para volver a atraerlos.'
                    : 'Every saved pass automatically logs diner names and phones into your database to drive re-orders.'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/aroma-cafe"
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all"
              >
                <Smartphone className="w-4 h-4" />
                <span>{activeLang === 'es' ? 'Probar Tarjeta en Vivo (Demo)' : 'Try Live Card Demo'}</span>
              </Link>
              <Link
                href="/scanner"
                className="px-6 py-3 bg-zinc-900 hover:bg-zinc-850 text-zinc-300 hover:text-white font-bold text-xs rounded-xl border border-zinc-800 flex items-center gap-2 transition-all"
              >
                <QrCode className="w-4 h-4 text-emerald-400" />
                <span>{activeLang === 'es' ? 'Abrir Escáner de Cajero' : 'Open Cashier Scanner'}</span>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            <AppleWalletCard business={demoBusiness} customer={demoCustomer} />
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. PILAR 2: CRM & BASE DE DATOS DE TUS CLIENTES           */}
      {/* ========================================================= */}
      <section id="crm" className="max-w-6xl mx-auto px-4 sm:px-6 py-20 border-t border-zinc-900">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-400 text-xs font-bold mb-4">
            <Users className="w-4 h-4 text-purple-400" />
            <span>{activeLang === 'es' ? 'Pilar 2: CRM & Base de Datos de Clientes' : 'Pillar 2: Customer CRM & Database'}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            {activeLang === 'es'
              ? 'Tu propia base de datos de comensales. Sin depender de terceros.'
              : 'Your own diner database. Zero dependency on third parties.'}
          </h2>
          <p className="mt-4 text-sm sm:text-base text-zinc-300 max-w-2xl mx-auto leading-relaxed">
            {activeLang === 'es'
              ? 'Las apps de delivery se quedan con los datos de tus clientes. Con MenuBeacon, cada visita captura nombre, teléfono celular y frecuencia para que llenes tu restaurante cuando tú decidas.'
              : 'Delivery apps keep your customer data. With MenuBeacon, every visit captures names, mobile numbers, and visit frequency so you can fill tables on demand.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-zinc-900/50 border border-purple-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          {/* Left Column: Key Features */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-zinc-950/70 p-4 rounded-2xl border border-zinc-800 space-y-1.5">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{activeLang === 'es' ? 'Captura Automática al Guardar Wallet' : 'Auto-Capture on Wallet Save'}</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {activeLang === 'es'
                  ? 'Sin formularios largos. Cuando el comensal añade su tarjeta de sellos a Apple o Google Wallet, sus datos se sincronizan al instante en tu CRM.'
                  : 'Zero tedious forms. When diners save their pass to Apple or Google Wallet, their details sync instantly to your CRM.'}
              </p>
            </div>

            <div className="bg-zinc-950/70 p-4 rounded-2xl border border-zinc-800 space-y-1.5">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                <Filter className="w-4 h-4 shrink-0" />
                <span>{activeLang === 'es' ? 'Segmentación Inteligente (VIP & En Riesgo)' : 'Smart Segmentation (VIP & At-Risk)'}</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {activeLang === 'es'
                  ? 'Identifica a tus clientes más fieles (VIP) y detecta automáticamente a los que llevan más de 20 días sin volver para reactivarlos con una cortesía.'
                  : 'Identify your most loyal VIPs and automatically spot diners who haven’t visited in 20+ days to win them back with a perk.'}
              </p>
            </div>

            <div className="bg-zinc-950/70 p-4 rounded-2xl border border-zinc-800 space-y-1.5">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                <Mail className="w-4 h-4 shrink-0" />
                <span>{activeLang === 'es' ? 'Campañas de Email & Difusión en 1 Clic' : '1-Click Email Marketing Campaigns'}</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {activeLang === 'es'
                  ? 'Envía promociones de fin de semana, dobles sellos o menú nuevo con plantillas prediseñadas. Llena mesas los días lentos sin gastar en anuncios.'
                  : 'Broadcast weekend promotions, double-stamp days, or seasonal menus with prebuilt templates. Fill tables on slow days without ad spend.'}
              </p>
            </div>

            <div className="bg-zinc-950/70 p-4 rounded-2xl border border-zinc-800 space-y-1.5">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                <Download className="w-4 h-4 shrink-0" />
                <span>{activeLang === 'es' ? 'Exportación Total (Excel, CSV & Mailchimp)' : 'Full Data Export (Excel, CSV & Mailchimp)'}</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {activeLang === 'es'
                  ? 'Tus datos son tuyos. Exporta tu lista de contactos con 1 clic para usarla en WhatsApp Business, campañas de Meta Ads o tu hoja de cálculo favorita.'
                  : 'Your data belongs to you. Export contacts with 1 click for WhatsApp Business, Meta Ads lookalike audiences, or your favorite spreadsheet.'}
              </p>
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                href="/app"
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white font-black text-xs rounded-xl shadow-lg shadow-purple-500/25 flex items-center gap-2 transition-all"
              >
                <Users className="w-4 h-4" />
                <span>{activeLang === 'es' ? 'Explorar CRM en el Panel' : 'Explore CRM Dashboard'}</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Visual Mockup of the CRM */}
          <div className="lg:col-span-6 bg-slate-950 border border-purple-500/25 rounded-2xl p-4 sm:p-5 shadow-2xl space-y-3">
            {/* Mockup CRM Top Header */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-bold text-white">{activeLang === 'es' ? 'Cartera de Clientes Activos' : 'Active Customer Directory'}</span>
                <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-black text-[10px]">240 contactos</span>
              </div>
              <span className="text-[10px] text-zinc-400 flex items-center gap-1 font-semibold">
                <Download className="w-3 h-3 text-purple-400" />
                <span>CSV / Excel</span>
              </span>
            </div>

            {/* Quick Filter Tabs */}
            <div className="flex items-center gap-1.5 text-[11px] overflow-x-auto pb-1">
              <span className="px-2.5 py-1 rounded-lg bg-purple-500 text-black font-extrabold cursor-default">
                {activeLang === 'es' ? 'Todos (240)' : 'All (240)'}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-zinc-900 text-zinc-400 border border-zinc-800 cursor-default">
                ⭐ {activeLang === 'es' ? 'VIP (+6 visitas)' : 'VIP (6+ visits)'}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-zinc-900 text-zinc-400 border border-zinc-800 cursor-default">
                ⚠️ {activeLang === 'es' ? 'En Riesgo (>20 días)' : 'At Risk (>20 days)'}
              </span>
            </div>

            {/* Sample Customer Rows */}
            <div className="space-y-2 pt-1">
              {/* Customer 1 */}
              <div className="p-3 rounded-xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-between gap-3 text-xs hover:border-purple-500/40 transition-colors">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 to-amber-600 text-zinc-950 font-black flex items-center justify-center shrink-0 text-xs">
                    👑
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-white truncate">Carlos Mendoza</span>
                      <span className="px-1.5 py-0.2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded text-[9px] font-black">
                        VIP
                      </span>
                    </div>
                    <span className="text-[10px] text-zinc-400 block truncate">+52 55 1234 5678 • Última visita: Hoy</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-black font-black text-[10px] block">
                    6 / 6 Sellos 🎉
                  </span>
                  <span className="text-[9px] text-emerald-400 mt-0.5 block font-medium">Recompensa lista</span>
                </div>
              </div>

              {/* Customer 2 */}
              <div className="p-3 rounded-xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-between gap-3 text-xs hover:border-purple-500/40 transition-colors">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-teal-400 to-emerald-500 text-zinc-950 font-black flex items-center justify-center shrink-0 text-xs">
                    ☕
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-white truncate">Mariana Soto</span>
                      <span className="px-1.5 py-0.2 bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded text-[9px] font-black">
                        Frecuente
                      </span>
                    </div>
                    <span className="text-[10px] text-zinc-400 block truncate">+52 55 9876 5432 • Última visita: Ayer</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-200 font-bold text-[10px] block border border-zinc-700">
                    4 / 6 Sellos
                  </span>
                  <span className="text-[9px] text-zinc-400 mt-0.5 block">Faltan 2 sellos</span>
                </div>
              </div>

              {/* Customer 3 */}
              <div className="p-3 rounded-xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-between gap-3 text-xs hover:border-amber-500/40 transition-colors">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-red-500 text-white font-black flex items-center justify-center shrink-0 text-xs">
                    ⚠️
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-white truncate">Roberto Gómez</span>
                      <span className="px-1.5 py-0.2 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded text-[9px] font-black">
                        En Riesgo
                      </span>
                    </div>
                    <span className="text-[10px] text-zinc-400 block truncate">+52 55 3344 5566 • Hace 26 días</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="px-2 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-black flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    <span>Reactivar</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Micro email campaign banner inside mockup */}
            <div className="p-3 bg-purple-950/40 border border-purple-500/30 rounded-xl flex items-center justify-between text-xs text-purple-200">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-purple-400 shrink-0" />
                <span className="text-[11px] font-medium leading-tight">
                  {activeLang === 'es' ? 'Campaña: "¡Te extrañamos! Doble sello este jueves"' : 'Campaign: "We miss you! 2x stamps this Thursday"'}
                </span>
              </div>
              <span className="px-2 py-0.5 rounded bg-purple-500 text-black font-black text-[9px] shrink-0">
                1 Clic
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. PILAR 3: MENÚ DIGITAL (EN SISTEMA O SUBE TU PDF)        */}
      {/* ========================================================= */}
      <div id="menu-digital">
        <DigitalMenuShowcase />
      </div>

      {/* ========================================================= */}
      {/* 5. PILAR 4: REVIEWS EN GOOGLE MAPS (FILTRO 5 ESTRELLAS)   */}
      {/* ========================================================= */}
      <section id="reviews" className="max-w-6xl mx-auto px-4 sm:px-6 py-20 border-t border-zinc-900">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs font-bold mb-4">
            <Star className="w-4 h-4 text-blue-400 fill-current" />
            <span>{activeLang === 'es' ? 'Pilar 4: Reseñas en Google Maps' : 'Pillar 4: Google Maps Reviews'}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            {t.googleReviews.headline}{' '}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-amber-300 bg-clip-text text-transparent">
              {t.googleReviews.headlineHighlight}
            </span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-zinc-300 max-w-2xl mx-auto leading-relaxed">
            {t.googleReviews.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-zinc-900/50 border border-blue-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl">
          {/* Explanation on Left */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-5 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>{t.googleReviews.filterHighTitle}</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {t.googleReviews.filterHighDesc}
              </p>
            </div>

            <div className="bg-amber-950/40 border border-amber-500/30 rounded-2xl p-5 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <ShieldCheck className="w-5 h-5 shrink-0" />
                <span>{t.googleReviews.filterLowTitle}</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {t.googleReviews.filterLowDesc}
              </p>
            </div>

            <div className="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-5">
              <h4 className="font-bold text-xs text-white uppercase tracking-wider mb-1">
                ⭐ {t.googleReviews.benefitTitle}
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {t.googleReviews.benefitDesc}
              </p>
            </div>
          </div>

          {/* Interactive Google Review Card on Right */}
          <div className="lg:col-span-6 flex justify-center">
            <GoogleReviewCard business={demoBusiness} />
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 6. TESTIMONIOS REALES DE COMERCIOS                        */}
      {/* ========================================================= */}
      <TestimonialsSection />

      {/* ========================================================= */}
      {/* 7. PLANES & PRECIOS TRANSPARENTES                         */}
      {/* ========================================================= */}
      <PricingSection />

      {/* ========================================================= */}
      {/* 8. PREGUNTAS FRECUENTES (FAQ)                              */}
      {/* ========================================================= */}
      <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 py-20 border-t border-zinc-900">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-1">
            {t.faq.tag}
          </span>
          <h2 className="text-3xl font-black text-white tracking-tight">
            {t.faq.headline}
          </h2>
        </div>

        <div className="space-y-3">
          {t.faq.items.map((item, idx) => (
            <div
              key={idx}
              className="bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden transition-colors hover:border-zinc-700"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between text-xs sm:text-sm font-bold text-white cursor-pointer"
              >
                <span>{item.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-emerald-400 transition-transform ${
                    openFaq === idx ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-4 sm:px-5 pb-5 text-xs text-zinc-300 leading-relaxed border-t border-zinc-800/60 pt-3">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 9. LLAMADO A LA ACCIÓN FINAL (CTA)                        */}
      {/* ========================================================= */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-20">
        <div className="bg-gradient-to-r from-emerald-950 via-zinc-900 to-emerald-950 border border-emerald-500/40 rounded-3xl p-8 sm:p-14 text-center shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto relative z-10">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-400 block mb-2">
              {t.cta.tag}
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              {t.cta.headline}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 mt-4 leading-relaxed">
              {t.cta.subtitle}
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/app"
                className="w-full sm:w-auto px-8 py-4 bg-[#22c55e] hover:bg-emerald-600 text-black font-extrabold text-sm rounded-2xl shadow-xl shadow-emerald-500/30 transition-all hover:scale-[1.02]"
              >
                {t.cta.btnPanel}
              </Link>
              <Link
                href="/aroma-cafe"
                className="w-full sm:w-auto px-6 py-4 bg-zinc-900 text-white border border-zinc-700 hover:bg-zinc-850 font-bold text-sm rounded-2xl transition-all"
              >
                {t.cta.btnDemo}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-zinc-900 py-12 text-center text-xs text-zinc-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <MenuBeaconLogo height={24} showSubtitle={false} />
            <span className="text-[11px] text-zinc-600 hidden sm:inline">•</span>
            <span className="text-[11px] text-zinc-400">{t.footer.slogan}</span>
          </div>

          <div className="flex items-center gap-4 text-zinc-400">
            <button
              onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{language === 'es' ? 'Switch to English' : 'Cambiar a Español'}</span>
            </button>
            <Link href="/app" className="hover:text-white transition-colors">
              {language === 'es' ? 'Panel /app' : 'App Portal'}
            </Link>
            <Link href="/dashboard" className="hover:text-white transition-colors">
              Dashboard
            </Link>
            <Link href="/scanner" className="hover:text-white transition-colors">
              {language === 'es' ? 'Escáner' : 'Scanner'}
            </Link>
            <Link href="/aroma-cafe" className="hover:text-white transition-colors">
              {language === 'es' ? 'Demo Cliente' : 'Customer Demo'}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
