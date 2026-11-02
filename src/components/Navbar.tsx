'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/lib/translations';
import {
  Sparkles,
  QrCode,
  LayoutDashboard,
  Store,
  ChevronDown,
  Menu,
  X,
  CreditCard,
  Smartphone,
  Globe,
  Zap,
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [storesOpen, setStoresOpen] = useState(false);
  const { language, setLanguage, mounted } = useLanguage();
  const activeLang = mounted ? language : 'es';
  const t = translations[activeLang].nav;

  // When on the dedicated /app panel, hide the landing page navbar
  if (pathname === '/app') {
    return null;
  }

  const sampleStores = [
    { name: activeLang === 'es' ? 'Café Aroma (Especialidad)' : 'Café Aroma (Specialty)', slug: 'aroma-cafe', icon: '☕' },
    { name: activeLang === 'es' ? 'Barber King (Barbería)' : 'Barber King (Barbershop)', slug: 'barber-king', icon: '💈' },
    { name: 'Craft Burger Lab', slug: 'burger-craft', icon: '🍔' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-400 via-teal-400 to-lime-400 flex items-center justify-center text-zinc-950 font-black shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-zinc-950 fill-zinc-950" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-white">
                Markethers
              </span>
            </div>
            <span
              className="text-[10px] text-zinc-400 -mt-0.5 block"
              suppressHydrationWarning
            >
              {t.brandSubtitle}
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
          {/* Stores dropdown */}
          <div className="relative">
            <button
              onClick={() => setStoresOpen(!storesOpen)}
              onBlur={() => setTimeout(() => setStoresOpen(false), 200)}
              className="px-3 py-2 rounded-xl text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors flex items-center gap-1.5 text-xs font-semibold"
            >
              <Store className="w-4 h-4 text-emerald-400" />
              <span>{t.demoStores}</span>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
            </button>

            {storesOpen && (
              <div className="absolute top-full left-0 mt-1.5 w-64 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 px-3 py-1.5">
                  {t.demoStoresTitle}
                </div>
                {sampleStores.map(store => (
                  <Link
                    key={store.slug}
                    href={`/${store.slug}`}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-zinc-800/80 transition-colors text-zinc-200 hover:text-white text-xs"
                    onClick={() => setStoresOpen(false)}
                  >
                    <span className="text-base">{store.icon}</span>
                    <span className="font-medium">{store.name}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/app"
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 text-xs font-semibold transition-colors ${
              pathname === '/app'
                ? 'bg-emerald-500/10 text-emerald-400 font-bold'
                : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <span>{t.appPortal}</span>
          </Link>

          <Link
            href="/scanner"
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 text-xs font-semibold transition-colors ${
              pathname === '/scanner'
                ? 'bg-emerald-500/10 text-emerald-400 font-bold'
                : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <QrCode className="w-4 h-4 text-emerald-400" />
            <span>{t.cashierScanner}</span>
          </Link>

          <Link
            href="/#precios"
            className="px-3 py-2 rounded-xl flex items-center gap-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors"
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>{t.pricingNav}</span>
          </Link>

          <Link
            href="/dashboard"
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 text-xs font-semibold transition-colors ${
              pathname === '/dashboard'
                ? 'bg-emerald-500/10 text-emerald-400 font-bold'
                : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-blue-400" />
            <span>{t.merchantPanel}</span>
          </Link>
        </nav>

        {/* Action button & Bilingual switcher */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Bilingual Switcher */}
          <div className="flex items-center bg-zinc-900/90 border border-zinc-800 rounded-xl p-1 text-xs">
            <button
              onClick={() => setLanguage('es')}
              className={`px-2.5 py-1 rounded-lg transition-all text-[11px] font-black flex items-center gap-1 ${
                language === 'es'
                  ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
              title="Cambiar a Español"
            >
              <span>🇲🇽</span>
              <span>ES</span>
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 rounded-lg transition-all text-[11px] font-black flex items-center gap-1 ${
                language === 'en'
                  ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
              title="Switch to English"
            >
              <span>🇺🇸</span>
              <span>EN</span>
            </button>
          </div>

          <Link
            href="/login"
            className="text-xs font-semibold text-zinc-300 hover:text-white px-2.5 py-1.5 transition-colors"
          >
            {activeLang === 'es' ? 'Iniciar Sesión' : 'Log In'}
          </Link>

          <Link
            href="/register"
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-lime-400 hover:from-emerald-400 hover:to-lime-300 text-zinc-950 font-black text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{activeLang === 'es' ? 'Empezar Gratis' : 'Start Free'}</span>
          </Link>
        </div>

        {/* Mobile menu toggle & quick lang */}
        <div className="flex items-center gap-2 sm:hidden">
          <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl p-0.5 text-xs">
            <button
              onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
              className="px-2 py-1 rounded-lg text-xs font-bold text-emerald-400 flex items-center gap-1"
            >
              <Globe className="w-3 h-3" />
              <span>{language.toUpperCase()}</span>
            </button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-800 bg-zinc-950 px-4 py-4 space-y-3">
          {/* Mobile Language Switcher */}
          <div className="flex items-center justify-between pb-3 border-b border-zinc-900 px-1">
            <span className="text-xs text-zinc-400 font-medium flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.langSelect}:</span>
            </span>
            <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl p-1 text-xs">
              <button
                onClick={() => setLanguage('es')}
                className={`px-3 py-1 rounded-lg text-xs font-black ${
                  language === 'es' ? 'bg-emerald-500 text-black' : 'text-zinc-400'
                }`}
              >
                🇲🇽 Español
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 rounded-lg text-xs font-black ${
                  language === 'en' ? 'bg-emerald-500 text-black' : 'text-zinc-400'
                }`}
              >
                🇺🇸 English
              </button>
            </div>
          </div>

          <div className="text-xs font-bold uppercase tracking-wider text-zinc-500 px-2">
            {t.demoStoresTitle}
          </div>
          <div className="grid grid-cols-1 gap-1">
            {sampleStores.map(store => (
              <Link
                key={store.slug}
                href={`/${store.slug}`}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-zinc-900 text-zinc-200 text-sm"
              >
                <span>{store.icon}</span>
                <span>{store.name}</span>
              </Link>
            ))}
          </div>

          <div className="pt-2 border-t border-zinc-900 flex flex-col gap-2">
            <Link
              href="/app"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 text-sm font-bold border border-emerald-500/20"
            >
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>{t.appPortal}</span>
            </Link>

            <Link
              href="/scanner"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-zinc-900 text-zinc-200 text-sm font-medium"
            >
              <QrCode className="w-4 h-4 text-emerald-400" />
              <span>{t.cashierScanner}</span>
            </Link>

            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-zinc-900 text-zinc-200 text-sm font-medium"
            >
              <LayoutDashboard className="w-4 h-4 text-blue-400" />
              <span>{t.merchantPanel}</span>
            </Link>

            <Link
              href="/aroma-cafe"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 text-center py-2.5 rounded-xl bg-emerald-500 text-zinc-950 font-bold text-sm shadow-md shadow-emerald-500/20"
            >
              {t.tryCustomerCard}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}