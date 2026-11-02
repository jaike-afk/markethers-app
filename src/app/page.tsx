'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppleWalletCard } from '@/components/AppleWalletCard';
import { GoogleReviewCard } from '@/components/GoogleReviewCard';
import { DigitalMenuShowcase } from '@/components/DigitalMenuShowcase';
import { InfoLinkSection } from '@/components/InfoLinkSection';
import { PricingSection } from '@/components/PricingSection';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { INITIAL_BUSINESSES, INITIAL_CUSTOMERS } from '@/lib/store';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/lib/translations';
import {
  Sparkles,
  Smartphone,
  QrCode,
  Users,
  Utensils,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Gift,
  Clock,
  ChevronRight,
  ChevronDown,
  Store,
  Layers,
  Check,
  X,
  Play,
  Share2,
  MessageCircle,
  Bell,
  Heart,
  HelpCircle,
  DollarSign,
  Coffee,
  Scissors,
  Award,
  BarChart3,
  Flame,
  FileText,
  CreditCard,
  UploadCloud,
  Globe,
  Star,
} from 'lucide-react';

export default function HomePage() {
  const { language, setLanguage, mounted } = useLanguage();
  const activeLang = mounted ? language : 'es';
  const t = translations[activeLang];

  const [interactiveStamps, setInteractiveStamps] = useState(6);
  const [roiCustomersPerDay, setRoiCustomersPerDay] = useState(75);
  const [roiAverageTicket, setRoiAverageTicket] = useState(90);
  const [selectedIndustry, setSelectedIndustry] = useState<'cafe' | 'barber' | 'restaurant'>('cafe');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const demoBusiness = INITIAL_BUSINESSES[0]; // Café Aroma
  const demoCustomer = INITIAL_CUSTOMERS[0]; // Carlos Mendoza

  // Calculations for ROI section
  const monthlyRevenue = roiCustomersPerDay * roiAverageTicket * 30;
  const estimatedRecovered = Math.round(monthlyRevenue * 0.20); // 20% recovered revenue
  const returnVisitsGained = Math.round(roiCustomersPerDay * 30 * 0.22); // 22% more visits

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const industriesData = {
    cafe: {
      title: activeLang === 'es' ? 'Cafeterías, Reposterías & Brunch' : 'Cafes, Bakeries & Brunch',
      example:
        activeLang === 'es'
          ? 'Por cada 8 bebidas o desayunos consumidos, el 9º café de especialidad es gratis.'
          : 'For every 8 specialty drinks or meals ordered, the 9th specialty coffee is on the house.',
      result: activeLang === 'es' ? '+34% de visitas recurrentes entre semana.' : '+34% repeat weekday visits.',
      icon: '☕',
      badge: activeLang === 'es' ? 'El programa más popular' : 'Most popular loyalty format',
    },
    barber: {
      title: activeLang === 'es' ? 'Barberías, Salones & Spas' : 'Barbershops, Salons & Spas',
      example:
        activeLang === 'es'
          ? 'En tu 5to corte de cabello, recibe un ritual de barba o tratamiento capilar sin costo.'
          : 'On your 5th haircut, receive a complimentary beard grooming ritual or scalp treatment.',
      result:
        activeLang === 'es'
          ? 'El 82% de los clientes vuelve antes de 21 días para no perder su racha.'
          : '82% of clients rebook within 21 days to maintain their loyalty streak.',
      icon: '💈',
      badge: activeLang === 'es' ? 'Citas recurrentes automáticas' : 'Automatic repeat bookings',
    },
    restaurant: {
      title: activeLang === 'es' ? 'Paleterías, Restaurantes & Bares' : 'Popsicle & Ice Cream Shops, Restaurants & Bars',
      example:
        activeLang === 'es'
          ? 'Suma 6 visitas o consumos y llévate una paleta artesanal doble, trago o postre de la casa.'
          : 'Collect 6 visits or purchases and unlock a free artisan popsicle, drink or house dessert.',
      result:
        activeLang === 'es'
          ? '+45% de clientes frecuentes y mayor ticket promedio en mostrador.'
          : '+45% repeat customers and higher average spend at checkout.',
      icon: '🍦',
      badge: activeLang === 'es' ? 'Fidelización directa en mostrador' : 'Direct in-store loyalty',
    },
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-emerald-500 selection:text-black">
      {/* Background glow lighting effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-emerald-500/15 via-teal-600/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* ========================================================= */}
      {/* 1. HERO SECTION                                           */}
      {/* ========================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-16 text-center">
        {/* Release / Category Badge & Language Quick Switcher */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-bold">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>{t.hero.badge}</span>
          </div>

          <div className="inline-flex items-center bg-zinc-900/90 border border-zinc-800 rounded-full p-1 text-xs">
            <button
              onClick={() => setLanguage('es')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                language === 'es'
                  ? 'bg-emerald-500 text-black shadow font-black'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              🇲🇽 Español
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
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
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white max-w-5xl mx-auto leading-[1.08]">
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

        {/* Feature Checkmarks */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-zinc-400 font-medium">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {t.hero.check1}
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {t.hero.check2}
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {t.hero.check3}
          </span>
        </div>

        {/* Hero Interactive Wallet Preview */}
        <div className="mt-14 max-w-4xl mx-auto bg-gradient-to-b from-zinc-900/90 via-zinc-900/40 to-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-zinc-800/80">
            <div className="text-left">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block mb-0.5">
                {t.hero.simTitle}
              </span>
              <h3 className="text-xl font-black text-white">{t.hero.simSubtitle}</h3>
            </div>

            <button
              onClick={() => setInteractiveStamps(prev => (prev >= 8 ? 1 : prev + 1))}
              className="px-5 py-2.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-xs rounded-xl border border-emerald-500/40 flex items-center gap-2 transition-all active:scale-95 shrink-0 shadow-lg shadow-emerald-500/10"
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
      {/* 2. DIGITAL MENU SPOTLIGHT: UPLOAD OR BUILD IN PLATFORM   */}
      {/* ========================================================= */}
      <DigitalMenuShowcase />

      {/* ========================================================= */}
      {/* 2.5 INFOLINK ALL-IN-ONE ECOSYSTEM (LINK-IN-BIO + QR)     */}
      {/* ========================================================= */}
      <InfoLinkSection />

      {/* ========================================================= */}
      {/* 3. GOOGLE REVIEWS 5-STAR SMART FILTER SPOTLIGHT           */}
      {/* ========================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20 border-t border-zinc-900">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold mb-3 border border-blue-500/20">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>{t.googleReviews.tag}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            {t.googleReviews.headline}{' '}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-amber-300 bg-clip-text text-transparent">
              {t.googleReviews.headlineHighlight}
            </span>
          </h2>
          <p className="text-sm text-zinc-300 mt-3 max-w-2xl mx-auto leading-relaxed">
            {t.googleReviews.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
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

            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5">
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
      {/* 3.5 REAL-WORLD TESTIMONIALS & RESULTS                     */}
      {/* ========================================================= */}
      <TestimonialsSection />

      {/* ========================================================= */}
      {/* 4. THE BIG PROBLEM VS THE MODERN SOLUTION                 */}
      {/* ========================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20 border-t border-zinc-900">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-1">
            {t.problem.tag}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            {t.problem.headline}
          </h2>
          <p className="text-sm text-zinc-400 mt-2">
            {t.problem.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Cardboard Failure */}
          <div className="bg-zinc-900/40 border border-red-500/20 rounded-3xl p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-400 flex items-center justify-center font-bold text-xl mb-4 border border-red-500/20">
                📦
              </div>
              <h3 className="font-bold text-lg text-white">{t.problem.cardboardTitle}</h3>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                {t.problem.cardboardDesc}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-zinc-800/80 text-[11px] font-bold text-red-400 flex items-center gap-1.5">
              <X className="w-4 h-4 shrink-0" />
              <span>{t.problem.cardboardFooter}</span>
            </div>
          </div>

          {/* Heavy Custom App Failure */}
          <div className="bg-zinc-900/40 border border-amber-500/20 rounded-3xl p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-xl mb-4 border border-amber-500/20">
                📲
              </div>
              <h3 className="font-bold text-lg text-white">{t.problem.appTitle}</h3>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                {t.problem.appDesc}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-zinc-800/80 text-[11px] font-bold text-amber-400 flex items-center gap-1.5">
              <X className="w-4 h-4 shrink-0" />
              <span>{t.problem.appFooter}</span>
            </div>
          </div>

          {/* The Markethers Solution */}
          <div className="bg-gradient-to-b from-emerald-500/15 via-zinc-900 to-zinc-900 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xl">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xl mb-4 border border-emerald-500/30">
                ⚡
              </div>
              <h3 className="font-bold text-lg text-white">{t.problem.solutionTitle}</h3>
              <p className="text-xs text-zinc-300 mt-2 leading-relaxed">
                {t.problem.solutionDesc}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-emerald-500/20 text-[11px] font-extrabold text-emerald-400 flex items-center gap-1.5">
              <Check className="w-4 h-4 shrink-0 stroke-[3]" />
              <span>{t.problem.solutionFooter}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. THE 3 CORE MODULES EXPLAINED IN DETAIL                */}
      {/* ========================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-1">
            {t.pillars.tag}
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            {t.pillars.headline}
          </h2>
          <p className="text-sm text-zinc-400 mt-3">
            {t.pillars.subtitle}
          </p>
        </div>

        <div className="space-y-16">
          {/* PILAR 1: TARJETAS EN WALLET */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center bg-zinc-900/50 border border-zinc-800/80 rounded-3xl p-8 sm:p-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold mb-4">
                <CreditCard className="w-3.5 h-3.5" />
                <span>{t.pillars.pillar1Tag}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {t.pillars.pillar1Title}
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 mt-3 leading-relaxed">
                {t.pillars.pillar1Desc}
              </p>

              <div className="mt-6 space-y-3 text-xs text-zinc-400">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>{t.pillars.pillar1Item1Title}</strong> {t.pillars.pillar1Item1Desc}
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>{t.pillars.pillar1Item2Title}</strong> {t.pillars.pillar1Item2Desc}
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>{t.pillars.pillar1Item3Title}</strong> {t.pillars.pillar1Item3Desc}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-zinc-950 p-6 rounded-3xl border border-zinc-800 text-center">
              <div className="max-w-xs mx-auto">
                <AppleWalletCard business={demoBusiness} customer={demoCustomer} />
              </div>
            </div>
          </div>

          {/* PILAR 2: ESCÁNER WEB PARA PERSONAL */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center bg-zinc-900/50 border border-zinc-800/80 rounded-3xl p-8 sm:p-12">
            <div className="order-2 lg:order-1 bg-zinc-950 p-8 rounded-3xl border border-zinc-800 text-center">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
                <QrCode className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-white">{t.pillars.pillar2Tag}</h4>
              <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
                {t.pillars.pillar2Desc}
              </p>
              <div className="mt-5 flex justify-center">
                <Link
                  href="/scanner"
                  className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-500/20 flex items-center gap-2"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{t.pillars.pillar2TryScanner}</span>
                </Link>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold mb-4">
                <QrCode className="w-3.5 h-3.5" />
                <span>{t.pillars.pillar2Tag}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {t.pillars.pillar2Title}
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 mt-3 leading-relaxed">
                {t.pillars.pillar2Desc}
              </p>

              <div className="mt-6 space-y-3 text-xs text-zinc-400">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>{t.pillars.pillar2Item1Title}</strong> {t.pillars.pillar2Item1Desc}
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>{t.pillars.pillar2Item2Title}</strong> {t.pillars.pillar2Item2Desc}
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>{t.pillars.pillar2Item3Title}</strong> {t.pillars.pillar2Item3Desc}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 6. COMPARISON TABLE: CARTÓN vs APP PROPIA vs MARKETHERS   */}
      {/* ========================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20 border-t border-zinc-900">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-1">
            {t.comparison.tag}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            {t.comparison.headline}
          </h2>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-950/80 text-zinc-400 uppercase text-[10px] tracking-wider border-b border-zinc-800">
                <tr>
                  <th className="py-4 px-6 font-bold">{t.comparison.colFeature}</th>
                  <th className="py-4 px-6 font-bold text-red-400">{t.comparison.colPaper}</th>
                  <th className="py-4 px-6 font-bold text-amber-400">{t.comparison.colApp}</th>
                  <th className="py-4 px-6 font-black text-emerald-400 bg-emerald-500/10">
                    {t.comparison.colMarkethers}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/80 text-zinc-300">
                <tr>
                  <td className="py-4 px-6 font-bold text-white">{t.comparison.row1Title}</td>
                  <td className="py-4 px-6 text-zinc-400">{t.comparison.row1Paper}</td>
                  <td className="py-4 px-6 text-red-400 font-semibold">{t.comparison.row1App}</td>
                  <td className="py-4 px-6 text-emerald-400 font-black bg-emerald-500/5">
                    {t.comparison.row1Markethers}
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-bold text-white">{t.comparison.row2Title}</td>
                  <td className="py-4 px-6 text-zinc-400">{t.comparison.row2Paper}</td>
                  <td className="py-4 px-6 text-red-400 font-semibold">{t.comparison.row2App}</td>
                  <td className="py-4 px-6 text-emerald-400 font-black bg-emerald-500/5">
                    {t.comparison.row2Markethers}
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-bold text-white">{t.comparison.row3Title}</td>
                  <td className="py-4 px-6 text-zinc-400">{t.comparison.row3Paper}</td>
                  <td className="py-4 px-6 text-zinc-300">{t.comparison.row3App}</td>
                  <td className="py-4 px-6 text-emerald-400 font-black bg-emerald-500/5">
                    {t.comparison.row3Markethers}
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-bold text-white">{t.comparison.row4Title}</td>
                  <td className="py-4 px-6 text-red-400 font-bold">{t.comparison.row4Paper}</td>
                  <td className="py-4 px-6 text-zinc-300">{t.comparison.row4App}</td>
                  <td className="py-4 px-6 text-emerald-400 font-black bg-emerald-500/5">
                    {t.comparison.row4Markethers}
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-bold text-white">{t.comparison.row5Title}</td>
                  <td className="py-4 px-6 text-red-400 font-bold">{t.comparison.row5Paper}</td>
                  <td className="py-4 px-6 text-zinc-300">{t.comparison.row5App}</td>
                  <td className="py-4 px-6 text-emerald-400 font-black bg-emerald-500/5">
                    {t.comparison.row5Markethers}
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-bold text-white">{t.comparison.row6Title}</td>
                  <td className="py-4 px-6 text-zinc-400">{t.comparison.row6Paper}</td>
                  <td className="py-4 px-6 text-red-400 font-semibold">{t.comparison.row6App}</td>
                  <td className="py-4 px-6 text-emerald-400 font-black bg-emerald-500/5">
                    {t.comparison.row6Markethers}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 6.5 TRANSPARENT PRICING & GUARANTEE                       */}
      {/* ========================================================= */}
      <PricingSection />

      {/* ========================================================= */}
      {/* 7. INTERACTIVE ROI CALCULATOR                             */}
      {/* ========================================================= */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-20 border-t border-zinc-900">
        <div className="bg-gradient-to-br from-zinc-900 via-zinc-900/90 to-zinc-950 border border-zinc-800 rounded-3xl p-8 sm:p-12 shadow-2xl">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-1">
              {t.roi.tag}
            </span>
            <h2 className="text-3xl font-black text-white tracking-tight">
              {t.roi.headline}
            </h2>
            <p className="text-xs text-zinc-400 mt-2">
              {t.roi.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Sliders */}
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs font-bold text-zinc-300 mb-2">
                  <span>{t.roi.sliderClients}</span>
                  <span className="text-emerald-400 text-sm font-black">{roiCustomersPerDay}</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="300"
                  step="5"
                  value={roiCustomersPerDay}
                  onChange={e => setRoiCustomersPerDay(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer h-2 bg-zinc-800 rounded-lg"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-zinc-300 mb-2">
                  <span>{t.roi.sliderTicket}</span>
                  <span className="text-emerald-400 text-sm font-black">${roiAverageTicket}</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="400"
                  step="5"
                  value={roiAverageTicket}
                  onChange={e => setRoiAverageTicket(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer h-2 bg-zinc-800 rounded-lg"
                />
              </div>

              <div className="p-4 bg-zinc-950/80 rounded-2xl border border-zinc-800 text-xs text-zinc-400 space-y-1">
                <span className="font-bold text-white block">{t.roi.baseCalculo}</span>
                <p>{t.roi.monthlyEst} <strong>${monthlyRevenue.toLocaleString()}</strong></p>
                <p>{t.roi.avgLift} <strong>+18% ~ +25%</strong></p>
              </div>
            </div>

            {/* Results Box */}
            <div className="bg-zinc-950 p-6 sm:p-8 rounded-3xl border border-emerald-500/30 text-center space-y-5">
              <span className="text-[11px] uppercase font-bold tracking-wider text-emerald-400 block">
                {t.roi.extraRevenueBadge}
              </span>
              <div className="text-4xl sm:text-5xl font-black text-white">
                +${estimatedRecovered.toLocaleString()}
              </div>
              <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                {t.roi.extraVisitsNotice}
              </p>

              <div className="pt-4 border-t border-zinc-800">
                <Link
                  href="/app"
                  className="w-full py-3 bg-[#22c55e] hover:bg-emerald-600 text-black font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                >
                  <span>{t.roi.ctaButton}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 8. USE CASES BY INDUSTRY                                  */}
      {/* ========================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20 border-t border-zinc-900">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-1">
            {t.industries.tag}
          </span>
          <h2 className="text-3xl font-black text-white tracking-tight">
            {t.industries.headline}
          </h2>
        </div>

        {/* Industry Tabs */}
        <div className="flex justify-center gap-2 mb-8">
          {(['cafe', 'barber', 'restaurant'] as const).map(ind => (
            <button
              key={ind}
              onClick={() => setSelectedIndustry(ind)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedIndustry === ind
                  ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              {industriesData[ind].title.split(',')[0]}
            </button>
          ))}
        </div>

        {/* Selected Industry Card */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-8 max-w-3xl mx-auto text-center space-y-4">
          <span className="text-4xl">{industriesData[selectedIndustry].icon}</span>
          <h3 className="text-xl font-bold text-white">{industriesData[selectedIndustry].title}</h3>
          <p className="text-xs sm:text-sm text-zinc-300 max-w-xl mx-auto leading-relaxed">
            <strong>{t.industries.recommendedMechanic}</strong> {industriesData[selectedIndustry].example}
          </p>
          <div className="pt-2">
            <span className="inline-block px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-black rounded-full border border-emerald-500/20">
              {industriesData[selectedIndustry].result}
            </span>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 9. FREQUENTLY ASKED QUESTIONS (FAQ)                       */}
      {/* ========================================================= */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-20 border-t border-zinc-900">
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
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between text-xs sm:text-sm font-bold text-white"
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
      {/* 10. FINAL CALL TO ACTION (CTA)                            */}
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
                className="w-full sm:w-auto px-6 py-4 bg-zinc-900 text-white border border-zinc-700 hover:bg-zinc-800 font-bold text-sm rounded-2xl transition-all"
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
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-500 text-black flex items-center justify-center font-black text-xs">
              M
            </div>
            <span className="font-bold text-white">Markethers</span>
            <span className="text-[10px] text-zinc-400">— {t.footer.slogan}</span>
          </div>

          <div className="flex items-center gap-4 text-zinc-400">
            <button
              onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
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
