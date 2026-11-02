'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CameraScanner } from '@/components/CameraScanner';
import { StampGrid } from '@/components/StampGrid';
import { INITIAL_BUSINESSES, INITIAL_CUSTOMERS } from '@/lib/store';
import { Business, Customer } from '@/types';
import {
  Lock,
  Unlock,
  QrCode,
  Sparkles,
  Gift,
  Plus,
  Minus,
  CheckCircle2,
  RefreshCw,
  Store,
  User,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';

export default function CashierScannerPage() {
  const [selectedBusinessId, setSelectedBusinessId] = useState<string>(INITIAL_BUSINESSES[0].id);
  const [pin, setPin] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pinError, setPinError] = useState(false);

  // Scanned customer state
  const [scannedCustomer, setScannedCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);
  const [actionErrorMessage, setActionErrorMessage] = useState<string | null>(null);

  const business =
    INITIAL_BUSINESSES.find(b => b.id === selectedBusinessId) || INITIAL_BUSINESSES[0];

  // Auto unlock for demo ease, but show PIN interface
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === business.pinCode || pin === '1234') {
      setIsUnlocked(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleScanCode = async (decodedToken: string) => {
    setIsLoading(true);
    setActionSuccessMessage(null);
    setActionErrorMessage(null);

    try {
      const res = await fetch(`/api/customers?token=${encodeURIComponent(decodedToken)}`);
      const data = await res.json();

      if (res.ok && data.customer) {
        setScannedCustomer(data.customer);
      } else {
        // Check local storage customers DB before falling back to initial demo
        let localCusts: typeof INITIAL_CUSTOMERS = [];
        try {
          localCusts = JSON.parse(localStorage.getItem('markethers_customers_db') || '[]');
        } catch {
          localCusts = [];
        }
        const localFound = localCusts.find(c => c.qrCodeToken === decodedToken) || INITIAL_CUSTOMERS.find(c => c.qrCodeToken === decodedToken);
        if (localFound) {
          setScannedCustomer(localFound);
        } else {
          setActionErrorMessage(`Código no reconocido: "${decodedToken}". Verifica la tarjeta.`);
        }
      }
    } catch (err) {
      console.error(err);
      setActionErrorMessage('Error al consultar el cliente');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddStamp = async (count: number = 1) => {
    if (!scannedCustomer) return;
    setIsLoading(true);
    setActionSuccessMessage(null);
    setActionErrorMessage(null);

    try {
      const res = await fetch('/api/stamps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add_stamp',
          customerId: scannedCustomer.id,
          token: scannedCustomer.qrCodeToken,
          count,
          staffName: 'Cajero Mostrador',
        }),
      });

      const data = await res.json();

      if (res.ok && data.customer) {
        setScannedCustomer(data.customer);
        setActionSuccessMessage(data.message);

        if (data.rewardUnlocked) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        }
      } else {
        // Local simulation fallback
        const updated = {
          ...scannedCustomer,
          currentStamps: scannedCustomer.currentStamps + count,
          totalVisits: scannedCustomer.totalVisits + 1,
        };
        setScannedCustomer(updated);
        setActionSuccessMessage(`+${count} Sello añadido localmente.`);
      }
    } catch (err) {
      console.error(err);
      setActionErrorMessage('Error al registrar sello');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRedeemReward = async () => {
    if (!scannedCustomer) return;
    setIsLoading(true);
    setActionSuccessMessage(null);
    setActionErrorMessage(null);

    try {
      const res = await fetch('/api/stamps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'redeem_reward',
          customerId: scannedCustomer.id,
          token: scannedCustomer.qrCodeToken,
          staffName: 'Cajero Mostrador',
        }),
      });

      const data = await res.json();

      if (res.ok && data.customer) {
        setScannedCustomer(data.customer);
        setActionSuccessMessage(data.message);
        confetti({
          particleCount: 150,
          spread: 90,
          origin: { y: 0.5 },
        });
      } else {
        setActionErrorMessage(data.error || 'No se pudo canjear la recompensa');
      }
    } catch (err) {
      console.error(err);
      setActionErrorMessage('Error al canjear recompensa');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetScanner = () => {
    setScannedCustomer(null);
    setActionSuccessMessage(null);
    setActionErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-16">
      {/* Top Bar */}
      <div className="border-b border-zinc-800 bg-zinc-900/60 backdrop-blur-md px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <QrCode className="w-5 h-5" />
            </span>
            <div>
              <h1 className="font-bold text-sm tracking-tight">Escáner de Lealtad (PWA)</h1>
              <p className="text-[10px] text-zinc-400">Punto de Venta / Terminal de Cajero</p>
            </div>
          </div>

          {/* Business Selector */}
          <div className="flex items-center gap-2">
            <select
              value={selectedBusinessId}
              onChange={e => {
                setSelectedBusinessId(e.target.value);
                setScannedCustomer(null);
              }}
              className="bg-zinc-800 border border-zinc-700 text-xs rounded-xl px-2.5 py-1.5 text-zinc-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              {INITIAL_BUSINESSES.map(b => (
                <option key={b.id} value={b.id}>
                  {b.logoUrl} {b.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <main className="max-w-lg mx-auto px-4 pt-6">
        {/* Step 1: Cashier Lock Screen */}
        {!isUnlocked ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 text-center max-w-sm mx-auto shadow-2xl mt-8">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="text-lg font-bold text-white">Terminal Protegida</h2>
            <p className="text-xs text-zinc-400 mt-1 mb-6">
              Ingresa el PIN de cajero para desbloquear el escáner de {business.name}.
            </p>

            <form onSubmit={handlePinSubmit} className="space-y-4">
              <div>
                <input
                  type="password"
                  maxLength={6}
                  placeholder="PIN (Demo: 1234)"
                  value={pin}
                  onChange={e => setPin(e.target.value)}
                  className={`w-full text-center text-2xl tracking-widest font-mono bg-zinc-950 border ${
                    pinError ? 'border-red-500' : 'border-zinc-800'
                  } rounded-2xl py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500`}
                />
                {pinError && (
                  <span className="text-[11px] text-red-400 mt-1.5 block">
                    PIN incorrecto. (Usa: 1234)
                  </span>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm rounded-2xl transition-all shadow-lg shadow-amber-500/20"
              >
                Desbloquear Escáner
              </button>

              <button
                type="button"
                onClick={() => {
                  setPin('1234');
                  setIsUnlocked(true);
                }}
                className="text-[11px] text-zinc-500 hover:text-zinc-300 underline block mx-auto"
              >
                Autocompletar PIN Demo (1234)
              </button>
            </form>
          </div>
        ) : !scannedCustomer ? (
          /* Step 2: Active Camera View */
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-zinc-900/60 p-3 rounded-2xl border border-zinc-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-semibold text-zinc-200">{business.name}</span>
              </div>
              <button
                onClick={() => setIsUnlocked(false)}
                className="text-zinc-400 hover:text-white flex items-center gap-1 text-[11px]"
              >
                <Lock className="w-3 h-3" />
                <span>Bloquear</span>
              </button>
            </div>

            {/* Quick Demo Test Buttons */}
            <div className="bg-zinc-900/40 p-3 rounded-2xl border border-zinc-800/80">
              <span className="text-[11px] text-zinc-400 font-medium block mb-2">
                ⚡ Clientes demo listos para probar sin cámara:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleScanCode('CARD-AROMA-88219')}
                  className="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-xs text-zinc-200 border border-zinc-700/50"
                >
                  Carlos Mendoza (6/8)
                </button>
                <button
                  onClick={() => handleScanCode('CARD-AROMA-19402')}
                  className="px-2.5 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-xl text-xs font-semibold border border-amber-500/30"
                >
                  Sofia Valenzuela (8/8 🎉)
                </button>
              </div>
            </div>

            {/* Live Camera Scanner */}
            <CameraScanner onScan={handleScanCode} isScanningActive={!scannedCustomer} />

            {actionErrorMessage && (
              <div className="p-3 bg-red-950/60 border border-red-800/80 rounded-2xl text-xs text-red-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{actionErrorMessage}</span>
              </div>
            )}
          </div>
        ) : (
          /* Step 3: Customer Scanned & Stamp Actions */
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-5 animate-in fade-in duration-200">
            {/* Header / Customer Info */}
            <div className="flex items-start justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-lg border border-amber-500/30">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">{scannedCustomer.name}</h3>
                  <p className="text-xs text-zinc-400">{scannedCustomer.phone}</p>
                  <span className="text-[10px] font-mono text-zinc-500">
                    {scannedCustomer.qrCodeToken}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-zinc-500 block">
                  Visitas Totales
                </span>
                <span className="text-sm font-bold text-zinc-200">
                  {scannedCustomer.totalVisits}
                </span>
              </div>
            </div>

            {/* Stamp Status & Visual Grid */}
            <div className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800/80">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-zinc-300">Progreso de Sellos</span>
                <span className="text-sm font-black text-amber-400">
                  {scannedCustomer.currentStamps} de {business.loyaltyConfig.totalStamps}
                </span>
              </div>

              <StampGrid
                totalStamps={business.loyaltyConfig.totalStamps}
                currentStamps={scannedCustomer.currentStamps}
                iconType={business.loyaltyConfig.stampIcon}
                accentColor={business.loyaltyConfig.accentColor}
                size="md"
              />

              {/* Reward status */}
              {scannedCustomer.currentStamps >= business.loyaltyConfig.totalStamps ? (
                <div className="mt-3 p-3 bg-gradient-to-r from-amber-500/20 to-amber-600/20 border border-amber-500/40 rounded-xl text-center">
                  <div className="flex items-center justify-center gap-1.5 text-amber-300 font-extrabold text-xs">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>¡PREMIO DESBLOQUEADO!</span>
                  </div>
                  <p className="text-xs text-white font-semibold mt-1">
                    {business.loyaltyConfig.rewardTitle}
                  </p>
                </div>
              ) : (
                <div className="mt-2 text-center text-[11px] text-zinc-400">
                  Faltan{' '}
                  <strong className="text-zinc-200">
                    {business.loyaltyConfig.totalStamps - scannedCustomer.currentStamps}
                  </strong>{' '}
                  sellos para su próximo premio: {business.loyaltyConfig.rewardTitle}
                </div>
              )}
            </div>

            {/* Feedback Notifications */}
            {actionSuccessMessage && (
              <div className="p-3 bg-emerald-950/60 border border-emerald-800/80 rounded-2xl text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{actionSuccessMessage}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2.5">
              {scannedCustomer.currentStamps >= business.loyaltyConfig.totalStamps ? (
                <button
                  onClick={handleRedeemReward}
                  disabled={isLoading}
                  className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-sm rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-amber-500/30 transition-all active:scale-[0.99]"
                >
                  <Gift className="w-5 h-5 text-black" />
                  <span>Entregar & Canjear Premio</span>
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleAddStamp(1)}
                    disabled={isLoading}
                    className="py-3.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm rounded-2xl flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-amber-500/20 active:scale-[0.99]"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>Añadir 1 Sello</span>
                  </button>

                  <button
                    onClick={() => handleAddStamp(2)}
                    disabled={isLoading}
                    className="py-3.5 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-1.5 transition-all active:scale-[0.99]"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Añadir 2 Sellos</span>
                  </button>
                </div>
              )}

              <button
                onClick={handleResetScanner}
                className="w-full py-2.5 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold rounded-2xl flex items-center justify-center gap-2 transition-colors mt-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Escanear Siguiente Cliente</span>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
