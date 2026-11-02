'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppleWalletCard } from '@/components/AppleWalletCard';
import { INITIAL_BUSINESSES, INITIAL_CUSTOMERS } from '@/lib/store';
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
  Store,
  Layers,
  Check,
  X,
} from 'lucide-react';

export default function HomePage() {
  const [selectedDemoTab, setSelectedDemoTab] = useState<'card' | 'scanner' | 'dashboard'>('card');
  const demoBusiness = INITIAL_BUSINESSES[0]; // Café Aroma
  const demoCustomer = INITIAL_CUSTOMERS[0]; // Carlos Mendoza

  const [simulatedStamps, setSimulatedStamps] = useState(demoCustomer.currentStamps);

  const addInteractiveStamp = () => {
    if (simulatedStamps >= demoBusiness.loyaltyConfig.totalStamps) {
      setSimulatedStamps(1);
    } else {
      setSimulatedStamps(prev => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-amber-500 selection:text-black">
      {/* Glow gradient background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-b from-amber-500/15 via-amber-600/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* HERO SECTION */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-16 text-center">
        {/* Release badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Alternativa de código abierto estilo SoyClubify</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
          Fidelización en{' '}
          <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">
            Apple Wallet & Google Wallet
          </span>{' '}
          para tu negocio local.
        </h1>

        <p className="mt-6 text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Reemplaza las tarjetas de cartón por tarjetas de sellos digitales que tus clientes guardan
          en su teléfono en 10 segundos. <strong>Sin apps que descargar</strong>, con escáner web
          para cajeros y pedidos directos por WhatsApp.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/aroma-cafe"
            className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-black text-sm rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-amber-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Probar como Cliente (Café Aroma)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/scanner"
            className="w-full sm:w-auto px-6 py-3.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 font-bold text-sm rounded-2xl flex items-center justify-center gap-2 transition-all"
          >
            <QrCode className="w-4 h-4 text-emerald-400" />
            <span>Probar Escáner de Cajero</span>
          </Link>

          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-6 py-3.5 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 border border-zinc-800/80 font-semibold text-sm rounded-2xl flex items-center justify-center gap-2 transition-all"
          >
            <span>Ver Panel de Negocio</span>
          </Link>
        </div>

        {/* Quick Social Proof Metrics */}
        <div className="mt-14 pt-8 border-t border-zinc-900 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center max-w-3xl mx-auto text-xs text-zinc-400">
          <div>
            <div className="text-xl sm:text-2xl font-black text-white">+85%</div>
            <span>Tasa de adopción vs apps</span>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-white">0 descargas</div>
            <span>En Apple & Google Wallet</span>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-white">1 toque</div>
            <span>Para sumar sellos en caja</span>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-white">100% Web</div>
            <span>Listo para montar en tu nube</span>
          </div>
        </div>
      </section>

      {/* INTERACTIVE DEMO SANDBOX */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-1">
              Simulador Interactivo
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Prueba la experiencia en vivo
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Experimenta los tres lados de la plataforma: cliente, cajero y dueño de tienda.
            </p>

            {/* Sandbox Tabs */}
            <div className="flex p-1 bg-zinc-950 rounded-2xl border border-zinc-800 mt-5 max-w-md mx-auto">
              <button
                onClick={() => setSelectedDemoTab('card')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                  selectedDemoTab === 'card'
                    ? 'bg-amber-500 text-black shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                1. Tarjeta Cliente
              </button>
              <button
                onClick={() => setSelectedDemoTab('scanner')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                  selectedDemoTab === 'scanner'
                    ? 'bg-amber-500 text-black shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                2. Escáner Cajero
              </button>
              <button
                onClick={() => setSelectedDemoTab('dashboard')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                  selectedDemoTab === 'dashboard'
                    ? 'bg-amber-500 text-black shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                3. Panel Negocio
              </button>
            </div>
          </div>

          {/* TAB 1: CARD SIMULATION */}
          {selectedDemoTab === 'card' && (
            <div className="flex flex-col items-center animate-in fade-in duration-200">
              <div className="mb-4">
                <button
                  onClick={addInteractiveStamp}
                  className="px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-xs rounded-xl border border-amber-500/40 flex items-center gap-1.5 transition-all shadow-md active:scale-95"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Simular consumo (+1 Sello interactivo)</span>
                </button>
              </div>

              <AppleWalletCard
                business={demoBusiness}
                customer={{
                  ...demoCustomer,
                  currentStamps: simulatedStamps,
                }}
              />
            </div>
          )}

          {/* TAB 2: SCANNER TEASER */}
          {selectedDemoTab === 'scanner' && (
            <div className="max-w-md mx-auto text-center space-y-4 animate-in fade-in duration-200">
              <div className="p-6 bg-zinc-950 rounded-3xl border border-zinc-800">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-3 border border-emerald-500/20">
                  <QrCode className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-base text-white">Escáner Web PWA Instantáneo</h3>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Tu personal abre la web en cualquier teléfono o tablet con cámara. Al apuntar al
                  QR del cliente, suma sellos o canjea el premio con un solo toque y sonido de
                  confirmación.
                </p>
                <div className="mt-5">
                  <Link
                    href="/scanner"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all"
                  >
                    <span>Abrir Escáner Completo</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DASHBOARD TEASER */}
          {selectedDemoTab === 'dashboard' && (
            <div className="max-w-md mx-auto text-center space-y-4 animate-in fade-in duration-200">
              <div className="p-6 bg-zinc-950 rounded-3xl border border-zinc-800">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto mb-3 border border-indigo-500/20">
                  <Users className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-base text-white">CRM & Diseñador de Tarjetas</h3>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Conoce quiénes son tus clientes más fieles, cuántas veces han venido, y reactiva a
                  quienes llevan días sin volver mediante mensajes automáticos de WhatsApp.
                </p>
                <div className="mt-5">
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-500/20 transition-all"
                  >
                    <span>Abrir Panel de Control</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* COMPARISON SECTION: CARDBOARD VS WALLET */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-1">
            ¿Por qué los clientes lo prefieren?
          </span>
          <h2 className="text-3xl font-black text-white tracking-tight">
            Tarjetas de Papel vs. Apple / Google Wallet
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Physical card */}
          <div className="bg-zinc-900/40 border border-red-500/20 rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center">
                <X className="w-5 h-5 stroke-[3]" />
              </div>
              <h3 className="font-bold text-lg text-white">Tarjetas Tradicionales de Cartón</h3>
            </div>
            <ul className="space-y-3 text-xs text-zinc-400">
              <li className="flex items-start gap-2.5">
                <X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>El 70% de los clientes las olvida en casa o las pierde en la billetera.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>Cero datos: No sabes quién es tu cliente ni cuándo fue su última visita.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>Costo continuo de diseño e imprenta cada vez que se agotan.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>Facilidad de fraude o autorrelleno de sellos con sellos de goma.</span>
              </li>
            </ul>
          </div>

          {/* Digital Wallet */}
          <div className="bg-gradient-to-b from-amber-500/10 to-zinc-900/60 border border-amber-500/40 rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Check className="w-5 h-5 stroke-[3]" />
              </div>
              <h3 className="font-bold text-lg text-white">Tarjeta Digital en Wallet Nativa</h3>
            </div>
            <ul className="space-y-3 text-xs text-zinc-300">
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Siempre en su iPhone o Android, junto a sus tarjetas de crédito.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Captura nombre y WhatsApp en el primer escaneo para tu CRM.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Notificaciones en pantalla de bloqueo al recibir sellos o estar cerca.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Seguridad total con códigos QR dinámicos y registro por cajero.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* SAMPLE STORES GRID */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-1">
            Ejemplos por Industria
          </span>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Negocios que usan este modelo
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {INITIAL_BUSINESSES.map(store => (
            <Link
              key={store.slug}
              href={`/${store.slug}`}
              className="group bg-zinc-900/80 hover:bg-zinc-850 border border-zinc-800 hover:border-amber-500/50 rounded-2xl p-5 transition-all block text-left"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl p-2 rounded-xl bg-zinc-800 group-hover:scale-110 transition-transform">
                  {store.logoUrl}
                </span>
                <span className="text-[10px] uppercase font-bold text-zinc-500">
                  {store.loyaltyConfig.totalStamps} Sellos
                </span>
              </div>
              <h3 className="font-bold text-sm text-white group-hover:text-amber-400 transition-colors">
                {store.name}
              </h3>
              <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2">{store.tagline}</p>
              <div className="mt-3 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px]">
                <span className="text-amber-400 font-semibold">{store.category}</span>
                <span className="text-zinc-500 group-hover:text-white transition-colors flex items-center gap-0.5">
                  Ver tienda <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-zinc-900 py-12 text-center text-xs text-zinc-500">
        <p className="font-semibold text-zinc-400">
          Markethers Loyalty SaaS — Sistema de Fidelización para Apple Wallet & Google Wallet
        </p>
        <p className="mt-1">
          Diseñado con Next.js 16, TypeScript, Tailwind CSS y compatibilidad PassKit.
        </p>
      </footer>
    </div>
  );
}
