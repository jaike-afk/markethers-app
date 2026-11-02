'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [storesOpen, setStoresOpen] = useState(false);

  const sampleStores = [
    { name: 'Café Aroma (Especialidad)', slug: 'aroma-cafe', icon: '☕' },
    { name: 'Barber King (Barbería)', slug: 'barber-king', icon: '💈' },
    { name: 'Craft Burger Lab', slug: 'burger-craft', icon: '🍔' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-zinc-950 font-black shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-zinc-950 fill-zinc-950" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-white">
                Markethers
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Wallet SaaS
              </span>
            </div>
            <span className="text-[10px] text-zinc-400 -mt-1 block">
              Clubify Alternative
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
              className="px-3 py-2 rounded-xl text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors flex items-center gap-1.5"
            >
              <Store className="w-4 h-4 text-amber-400" />
              <span>Ver Negocios Demo</span>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
            </button>

            {storesOpen && (
              <div className="absolute top-full left-0 mt-1.5 w-64 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 px-3 py-1.5">
                  Tiendas de Demostración
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
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors ${
              pathname === '/app'
                ? 'bg-emerald-500/10 text-emerald-400 font-semibold'
                : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <span>Clubify App Móvil (/app)</span>
          </Link>

          <Link
            href="/scanner"
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors ${
              pathname === '/scanner'
                ? 'bg-amber-500/10 text-amber-400 font-semibold'
                : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <QrCode className="w-4 h-4 text-emerald-400" />
            <span>Escáner de Cajero (PWA)</span>
          </Link>

          <Link
            href="/dashboard"
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors ${
              pathname === '/dashboard'
                ? 'bg-amber-500/10 text-amber-400 font-semibold'
                : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-indigo-400" />
            <span>Panel de Negocio</span>
          </Link>
        </nav>

        {/* Action button */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            href="/aroma-cafe"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <CreditCard className="w-4 h-4" />
            <span>Probar Tarjeta Cliente</span>
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-800 bg-zinc-950 px-4 py-4 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-zinc-500 px-2">
            Negocios Demo
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
              <span>Abrir App Móvil (/app)</span>
            </Link>

            <Link
              href="/scanner"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-zinc-900 text-zinc-200 text-sm font-medium"
            >
              <QrCode className="w-4 h-4 text-emerald-400" />
              <span>Escáner de Cajero</span>
            </Link>

            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-zinc-900 text-zinc-200 text-sm font-medium"
            >
              <LayoutDashboard className="w-4 h-4 text-indigo-400" />
              <span>Panel de Negocio</span>
            </Link>

            <Link
              href="/aroma-cafe"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 text-center py-2.5 rounded-xl bg-amber-500 text-zinc-950 font-bold text-sm"
            >
              Probar Tarjeta Cliente (Café Aroma)
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
