'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { INITIAL_BUSINESSES, INITIAL_CUSTOMERS, INITIAL_MENU_ITEMS, INITIAL_TRANSACTIONS } from '@/lib/store';
import { Business, Customer, MenuItem, StampTransaction } from '@/types';
import { CameraScanner } from '@/components/CameraScanner';
import { StampGrid } from '@/components/StampGrid';
import { AppleWalletCard } from '@/components/AppleWalletCard';
import { CounterQrModal } from '@/components/CounterQrModal';
import confetti from 'canvas-confetti';
import {
  Home,
  QrCode,
  Utensils,
  Users,
  CreditCard,
  Sparkles,
  TrendingUp,
  Gift,
  Plus,
  Search,
  MessageCircle,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Smartphone,
  Eye,
  EyeOff,
  Clock,
  ChevronRight,
  Store,
  Layers,
  ShoppingBag,
  Bell,
  Settings,
} from 'lucide-react';

export default function MobileAppPortal() {
  const [businesses, setBusinesses] = useState<Business[]>(INITIAL_BUSINESSES);
  const [selectedBusinessId, setSelectedBusinessId] = useState<string>(INITIAL_BUSINESSES[0].id);
  const [activeBottomTab, setActiveBottomTab] = useState<'home' | 'scanner' | 'menu' | 'crm' | 'wallet'>('home');

  // Scanner state
  const [scannedCustomer, setScannedCustomer] = useState<Customer | null>(null);
  const [scanMessage, setScanMessage] = useState<string | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);

  // Menu state
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);
  const [menuFilter, setMenuFilter] = useState('all');

  // Stand modal
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  // CRM Search
  const [crmSearch, setCrmSearch] = useState('');

  const business = businesses.find(b => b.id === selectedBusinessId) || businesses[0];
  const currentMenuItems = menuItems.filter(m => m.businessId === business.id);
  const currentCustomers = INITIAL_CUSTOMERS.filter(c => c.businessId === business.id);
  const currentTransactions = INITIAL_TRANSACTIONS.filter(t => t.businessId === business.id);

  // Scanner Handlers
  const handleScanCode = (token: string) => {
    setScanError(null);
    setScanMessage(null);
    const found = currentCustomers.find(c => c.qrCodeToken === token);
    if (found) {
      setScannedCustomer(found);
    } else {
      setScanError(`Código no encontrado: ${token}`);
    }
  };

  const handleAddStamp = (count: number = 1) => {
    if (!scannedCustomer) return;
    const prev = scannedCustomer.currentStamps;
    const target = business.loyaltyConfig.totalStamps;
    const updatedStamps = prev + count;
    const rewardReady = updatedStamps >= target;

    setScannedCustomer({
      ...scannedCustomer,
      currentStamps: updatedStamps,
      totalVisits: scannedCustomer.totalVisits + 1,
    });

    if (rewardReady) {
      setScanMessage('¡Premio desbloqueado! 🎉');
      confetti({ particleCount: 90, spread: 60 });
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
    setScanMessage('¡Premio canjeado con éxito!');
    confetti({ particleCount: 120, spread: 80 });
  };

  // Menu availability toggle
  const handleToggleStock = (itemId: string) => {
    setMenuItems(prev =>
      prev.map(item => (item.id === itemId ? { ...item, available: !item.available } : item))
    );
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-24 selection:bg-emerald-500 selection:text-black">
      {/* APP TOP BAR */}
      <header className="sticky top-0 z-40 bg-zinc-900/90 backdrop-blur-xl border-b border-zinc-800/80 px-4 py-3">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 text-black flex items-center justify-center font-black text-sm shadow-md shadow-emerald-500/20">
              C
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xs text-white tracking-tight">Clubify App</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <span className="text-[10px] text-zinc-400 font-medium">{business.name}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Store Switcher */}
            <select
              value={selectedBusinessId}
              onChange={e => {
                setSelectedBusinessId(e.target.value);
                setScannedCustomer(null);
              }}
              className="bg-zinc-800 border border-zinc-700 text-[11px] rounded-xl px-2 py-1 text-zinc-200 focus:outline-none"
            >
              {businesses.map(b => (
                <option key={b.id} value={b.id}>
                  {b.logoUrl} {b.name.split(' ')[0]}
                </option>
              ))}
            </select>

            <Link
              href={`/${business.slug}`}
              target="_blank"
              className="p-1.5 rounded-xl bg-zinc-800 text-zinc-300 hover:text-white"
              title="Abrir web pública del cliente"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-md mx-auto px-4 pt-4">
        {/* TAB 1: HOME / RESUMEN DEL DÍA */}
        {activeBottomTab === 'home' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            {/* Welcome banner */}
            <div className="bg-gradient-to-br from-emerald-950/60 via-zinc-900 to-zinc-900 border border-emerald-500/30 rounded-3xl p-5 shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                  Sistema Operativo del Negocio
                </span>
                <h2 className="text-lg font-black text-white">¡Buen día, equipo!</h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Resumen de actividad y fidelización de hoy.
                </p>

                {/* Quick actions */}
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <button
                    onClick={() => setActiveBottomTab('scanner')}
                    className="py-2.5 px-3 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
                  >
                    <QrCode className="w-4 h-4 stroke-[2.5]" />
                    <span>Escanear Tarjeta</span>
                  </button>

                  <button
                    onClick={() => setIsQrModalOpen(true)}
                    className="py-2.5 px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 border border-zinc-700 transition-all"
                  >
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Póster Mostrador</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3">
                <span className="text-[10px] text-zinc-400 block font-medium">Sellos Hoy</span>
                <span className="text-xl font-black text-emerald-400 mt-0.5 block">
                  {currentCustomers.length * 4 + 8}
                </span>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3">
                <span className="text-[10px] text-zinc-400 block font-medium">En Wallet</span>
                <span className="text-xl font-black text-white mt-0.5 block">
                  {currentCustomers.length * 12 + 18}
                </span>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3">
                <span className="text-[10px] text-zinc-400 block font-medium">Premios</span>
                <span className="text-xl font-black text-amber-400 mt-0.5 block">
                  {currentCustomers.length + 3}
                </span>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-xs text-white">Actividad Reciente en Caja</h3>
                <span className="text-[10px] text-zinc-500">Tiempo real</span>
              </div>

              <div className="space-y-2">
                {currentTransactions.map(tx => (
                  <div
                    key={tx.id}
                    className="p-2.5 bg-zinc-950 rounded-2xl border border-zinc-850 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                        {tx.type === 'REWARD_REDEEMED' ? '🎁' : '+1'}
                      </div>
                      <div>
                        <span className="font-bold text-white block text-[11px]">
                          {tx.customerName}
                        </span>
                        <span className="text-[10px] text-zinc-400">{tx.notes}</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-zinc-500">Hace 15 min</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: INTEGRATED SCANNER */}
        {activeBottomTab === 'scanner' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            {!scannedCustomer ? (
              <div className="space-y-3">
                <div className="text-center">
                  <h3 className="font-bold text-sm text-white">Escáner de Tarjetas Wallet</h3>
                  <p className="text-[11px] text-zinc-400">
                    Apunta la cámara al iPhone o Android del cliente.
                  </p>
                </div>

                {/* Camera scanner widget */}
                <CameraScanner onScan={handleScanCode} isScanningActive={!scannedCustomer} />

                {/* Quick test buttons for demo */}
                <div className="bg-zinc-900/60 p-3 rounded-2xl border border-zinc-800 text-xs">
                  <span className="text-[10px] text-zinc-400 block mb-1.5 font-bold uppercase tracking-wider">
                    Simular escaneo de prueba:
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleScanCode('CARD-AROMA-88219')}
                      className="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs rounded-xl flex-1 border border-zinc-700"
                    >
                      Carlos (6/8)
                    </button>
                    <button
                      onClick={() => handleScanCode('CARD-AROMA-19402')}
                      className="px-2.5 py-1.5 bg-amber-500/20 text-amber-300 text-xs font-bold rounded-xl flex-1 border border-amber-500/30"
                    >
                      Sofia (8/8 🎉)
                    </button>
                  </div>
                </div>

                {scanError && (
                  <div className="p-3 bg-red-950/60 border border-red-800/80 rounded-2xl text-xs text-red-300">
                    {scanError}
                  </div>
                )}
              </div>
            ) : (
              /* Scanned Customer Action View */
              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <div>
                    <h3 className="font-bold text-sm text-white">{scannedCustomer.name}</h3>
                    <p className="text-[11px] text-zinc-400">{scannedCustomer.phone}</p>
                  </div>
                  <span className="font-mono text-[10px] text-zinc-500 bg-zinc-950 px-2 py-1 rounded-lg">
                    {scannedCustomer.qrCodeToken}
                  </span>
                </div>

                {/* Visual Stamp Card */}
                <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-zinc-400">Progreso:</span>
                    <span className="font-black text-amber-400">
                      {scannedCustomer.currentStamps} de {business.loyaltyConfig.totalStamps} sellos
                    </span>
                  </div>

                  <StampGrid
                    totalStamps={business.loyaltyConfig.totalStamps}
                    currentStamps={scannedCustomer.currentStamps}
                    iconType={business.loyaltyConfig.stampIcon}
                    accentColor={business.loyaltyConfig.accentColor}
                    size="sm"
                  />
                </div>

                {scanMessage && (
                  <div className="p-2.5 bg-emerald-950/60 border border-emerald-800/80 rounded-xl text-xs text-emerald-300 text-center font-bold">
                    {scanMessage}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-2">
                  {scannedCustomer.currentStamps >= business.loyaltyConfig.totalStamps ? (
                    <button
                      onClick={handleRedeemReward}
                      className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20"
                    >
                      <Gift className="w-4 h-4" />
                      <span>Entregar Recompensa ({business.loyaltyConfig.rewardTitle})</span>
                    </button>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleAddStamp(1)}
                        className="py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs rounded-xl flex items-center justify-center gap-1 shadow-lg shadow-emerald-500/20"
                      >
                        <Plus className="w-4 h-4 stroke-[3]" />
                        <span>+1 Sello</span>
                      </button>

                      <button
                        onClick={() => handleAddStamp(2)}
                        className="py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs rounded-xl"
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
                    className="w-full py-2 bg-zinc-800 text-zinc-400 hover:text-white text-xs rounded-xl"
                  >
                    Escanear siguiente cliente
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: MENU & ORDERS */}
        {activeBottomTab === 'menu' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-white">Menú Digital & Disponibilidad</h3>
                <p className="text-[11px] text-zinc-400">
                  Toca el botón para activar o pausar productos al instante.
                </p>
              </div>

              <Link
                href={`/${business.slug}?tab=menu`}
                target="_blank"
                className="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold rounded-xl text-zinc-200 flex items-center gap-1"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Ver Menú</span>
              </Link>
            </div>

            <div className="space-y-2.5">
              {currentMenuItems.map(item => (
                <div
                  key={item.id}
                  className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3 flex items-center justify-between gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-white truncate">{item.name}</span>
                      {item.featured && (
                        <span className="text-[8px] bg-amber-500/20 text-amber-400 px-1 rounded font-bold">
                          Top
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-zinc-400 block">{item.category}</span>
                    <span className="text-xs font-black text-amber-400 block mt-0.5">
                      {business.currency}
                      {item.price}
                    </span>
                  </div>

                  {/* 1-touch stock availability button */}
                  <button
                    onClick={() => handleToggleStock(item.id)}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-bold flex items-center gap-1 transition-all ${
                      item.available
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}
                  >
                    {item.available ? (
                      <>
                        <Eye className="w-3 h-3" />
                        <span>Disponible</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3 h-3" />
                        <span>Agotado</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: CRM CLIENTES */}
        {activeBottomTab === 'crm' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-white">Directorio de Clientes CRM</h3>
                <p className="text-[11px] text-zinc-400">
                  Contacta a tus clientes por WhatsApp con 1 toque.
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              {currentCustomers.map(customer => {
                const cleanPhone = customer.phone.replace(/\D/g, '');
                const isReady = customer.currentStamps >= business.loyaltyConfig.totalStamps;

                return (
                  <div
                    key={customer.id}
                    className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-white">{customer.name}</span>
                        {isReady && (
                          <span className="text-[9px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded font-black">
                            🎁 Premio
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-zinc-400 font-mono block">
                        {customer.phone}
                      </span>
                      <span className="text-[11px] text-amber-400 font-bold block mt-0.5">
                        {customer.currentStamps}/{business.loyaltyConfig.totalStamps} sellos •{' '}
                        {customer.totalVisits} visitas
                      </span>
                    </div>

                    <a
                      href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                        `¡Hola ${customer.name}! 👋 En ${business.name} tienes ${customer.currentStamps} sellos. ¡Te esperamos!`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-xl flex items-center gap-1 text-[11px] font-bold"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 5: WALLET DESIGNER & DOWNLOAD */}
        {activeBottomTab === 'wallet' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="text-center">
              <h3 className="font-bold text-sm text-white">Tarjeta Digital de Lealtad</h3>
              <p className="text-[11px] text-zinc-400">
                Así se visualiza el pase en Apple Wallet y Google Wallet.
              </p>
            </div>

            <AppleWalletCard business={business} customer={currentCustomers[0]} />
          </div>
        )}
      </main>

      {/* MOBILE BOTTOM NAVIGATION BAR (SOYCLUBIFY STYLE) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-zinc-950/95 backdrop-blur-xl border-t border-zinc-800/80 py-2">
        <div className="max-w-md mx-auto grid grid-cols-5 text-center px-1">
          <button
            onClick={() => setActiveBottomTab('home')}
            className={`flex flex-col items-center justify-center py-1 transition-colors ${
              activeBottomTab === 'home' ? 'text-emerald-400 font-bold' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Home className="w-5 h-5 mb-1" />
            <span className="text-[9px]">Inicio</span>
          </button>

          <button
            onClick={() => setActiveBottomTab('scanner')}
            className={`flex flex-col items-center justify-center py-1 transition-colors ${
              activeBottomTab === 'scanner' ? 'text-emerald-400 font-bold' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <QrCode className="w-5 h-5 mb-1" />
            <span className="text-[9px]">Escanear</span>
          </button>

          <button
            onClick={() => setActiveBottomTab('menu')}
            className={`flex flex-col items-center justify-center py-1 transition-colors ${
              activeBottomTab === 'menu' ? 'text-emerald-400 font-bold' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Utensils className="w-5 h-5 mb-1" />
            <span className="text-[9px]">Menú</span>
          </button>

          <button
            onClick={() => setActiveBottomTab('crm')}
            className={`flex flex-col items-center justify-center py-1 transition-colors ${
              activeBottomTab === 'crm' ? 'text-emerald-400 font-bold' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Users className="w-5 h-5 mb-1" />
            <span className="text-[9px]">Clientes</span>
          </button>

          <button
            onClick={() => setActiveBottomTab('wallet')}
            className={`flex flex-col items-center justify-center py-1 transition-colors ${
              activeBottomTab === 'wallet' ? 'text-emerald-400 font-bold' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <CreditCard className="w-5 h-5 mb-1" />
            <span className="text-[9px]">Tarjeta</span>
          </button>
        </div>
      </nav>

      {/* Stand QR Modal */}
      <CounterQrModal
        business={business}
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
      />
    </div>
  );
}
