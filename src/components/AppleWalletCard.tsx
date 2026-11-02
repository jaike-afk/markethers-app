'use client';

import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import confetti from 'canvas-confetti';
import { Business, Customer } from '@/types';
import { StampGrid } from './StampGrid';
import {
  Sparkles,
  Info,
  RotateCw,
  Share2,
  CheckCircle2,
  Download,
  Smartphone,
  ExternalLink,
} from 'lucide-react';

interface AppleWalletCardProps {
  business: Business;
  customer: Customer;
  onRefresh?: () => void;
}

export function AppleWalletCard({ business, customer, onRefresh }: AppleWalletCardProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isFlipped, setIsFlipped] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [walletType, setWalletType] = useState<'apple' | 'google'>('apple');
  const [copiedToken, setCopiedToken] = useState(false);

  const config = business.loyaltyConfig;
  const isRewardReady = customer.currentStamps >= config.totalStamps;
  const remainingStamps = Math.max(0, config.totalStamps - customer.currentStamps);

  useEffect(() => {
    QRCode.toDataURL(customer.qrCodeToken, {
      width: 260,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    })
      .then(url => setQrDataUrl(url))
      .catch(err => console.error('Error generating QR:', err));
  }, [customer.qrCodeToken]);

  const handleAppleWalletClick = () => {
    setWalletType('apple');
    setShowWalletModal(true);
    // Trigger festive confetti if reward is ready
    if (isRewardReady) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
      });
    }
  };

  const handleGoogleWalletClick = () => {
    setWalletType('google');
    setShowWalletModal(true);
  };

  const copyToken = () => {
    navigator.clipboard.writeText(customer.qrCodeToken);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  return (
    <div className="w-full max-w-sm mx-auto select-none">
      {/* Wallet Pass Outer Container with 3D Flip */}
      <div className="perspective-1000 relative">
        <div
          className={`relative w-full rounded-3xl p-5 shadow-2xl transition-all duration-500 text-white overflow-hidden border border-white/10 ${
            isRewardReady ? 'ring-2 ring-amber-400/80 shadow-amber-500/20' : ''
          }`}
          style={{
            backgroundColor: config.cardBgColor || '#1c1917',
          }}
        >
          {/* Subtle background glow */}
          <div
            className="absolute -top-24 -right-24 w-60 h-60 rounded-full blur-3xl opacity-20 pointer-events-none"
            style={{ backgroundColor: config.accentColor }}
          />

          {!isFlipped ? (
            /* FRONT OF THE CARD */
            <div className="relative z-10 flex flex-col justify-between">
              {/* Header: Logo & Business Name */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl p-1.5 rounded-xl bg-white/10 backdrop-blur-md">
                    {business.logoUrl}
                  </span>
                  <div>
                    <h3 className="font-bold text-sm tracking-tight leading-none text-white">
                      {business.name}
                    </h3>
                    <span className="text-[10px] text-zinc-400 font-medium">
                      {business.category}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setIsFlipped(true)}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-zinc-300"
                  title="Ver reverso de la tarjeta"
                >
                  <Info className="w-4 h-4" />
                </button>
              </div>

              {/* Status / Customer Name */}
              <div className="flex items-end justify-between mt-4">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold block">
                    Titular
                  </span>
                  <span className="text-base font-bold text-white tracking-tight">
                    {customer.name}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold block">
                    Sellos
                  </span>
                  <span
                    className="text-lg font-black tracking-tight"
                    style={{ color: config.accentColor }}
                  >
                    {customer.currentStamps} / {config.totalStamps}
                  </span>
                </div>
              </div>

              {/* Visual Stamp Card Grid */}
              <div className="my-2 p-3 rounded-2xl bg-black/25 backdrop-blur-sm border border-white/5">
                <StampGrid
                  totalStamps={config.totalStamps}
                  currentStamps={customer.currentStamps}
                  iconType={config.stampIcon}
                  accentColor={config.accentColor}
                  size="md"
                />

                {/* Reward Banner */}
                <div className="mt-2 text-center">
                  {isRewardReady ? (
                    <div className="py-1 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md animate-bounce">
                      <Sparkles className="w-3.5 h-3.5 text-black" />
                      ¡PREMIO LISTO PARA CANJEAR!
                    </div>
                  ) : (
                    <div className="text-[11px] text-zinc-300 flex items-center justify-center gap-1">
                      <span>Próximo premio:</span>
                      <strong className="text-white font-semibold">
                        {config.rewardTitle}
                      </strong>
                    </div>
                  )}
                </div>
              </div>

              {/* QR Code Section */}
              <div className="mt-2 pt-3 border-t border-white/10 flex flex-col items-center">
                <div className="p-2.5 bg-white rounded-2xl shadow-lg border border-zinc-200">
                  {qrDataUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={qrDataUrl}
                      alt="Código QR de fidelización"
                      className="w-32 h-32 object-contain rounded-lg"
                    />
                  ) : (
                    <div className="w-32 h-32 bg-zinc-200 animate-pulse rounded-lg flex items-center justify-center text-xs text-zinc-400">
                      Cargando QR...
                    </div>
                  )}
                </div>

                {/* Token and copy button */}
                <button
                  onClick={copyToken}
                  className="mt-2 text-[10px] tracking-widest font-mono text-zinc-400 hover:text-white flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-full transition-colors"
                >
                  <span>{customer.qrCodeToken}</span>
                  {copiedToken ? (
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Share2 className="w-3 h-3 text-zinc-400" />
                  )}
                </button>
                <span className="text-[10px] text-zinc-400 mt-1">
                  Muestra este QR en caja para recibir tus sellos
                </span>
              </div>
            </div>
          ) : (
            /* BACK OF THE CARD */
            <div className="relative z-10 min-h-[460px] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <h4 className="font-bold text-sm text-white">Detalles del Pase</h4>
                  <button
                    onClick={() => setIsFlipped(false)}
                    className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-zinc-300"
                    title="Volver al frente"
                  >
                    <RotateCw className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3.5 mt-4 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-zinc-400 block">
                      Términos y Condiciones
                    </span>
                    <p className="text-zinc-200 mt-0.5 leading-relaxed text-[11px]">
                      {config.terms}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-zinc-400 block">
                      Sucursal & Ubicación
                    </span>
                    <p className="text-zinc-200 mt-0.5 text-[11px]">
                      {business.address}, {business.city}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-zinc-400 block">
                      Historial
                    </span>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <div className="bg-white/5 p-2 rounded-xl">
                        <span className="text-[10px] text-zinc-400 block">Visitas totales</span>
                        <span className="text-sm font-bold text-white">
                          {customer.totalVisits}
                        </span>
                      </div>
                      <div className="bg-white/5 p-2 rounded-xl">
                        <span className="text-[10px] text-zinc-400 block">Premios canjeados</span>
                        <span className="text-sm font-bold text-emerald-400">
                          {customer.rewardsRedeemed}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-zinc-400 block">
                      Notificaciones de Pase
                    </span>
                    <p className="text-[10px] text-zinc-400 mt-0.5">
                      Recibirás alertas automáticas en tu pantalla de bloqueo cuando sumes un sello
                      o cuando estés cerca del local.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 text-center">
                <button
                  onClick={() => setIsFlipped(false)}
                  className="w-full py-2 bg-white/10 hover:bg-white/20 text-xs font-semibold rounded-xl transition-colors"
                >
                  Volver al frente de la tarjeta
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons: Add to Apple Wallet & Add to Google Wallet */}
      <div className="mt-4 flex flex-col gap-2.5">
        <button
          onClick={handleAppleWalletClick}
          className="w-full bg-black hover:bg-zinc-900 border border-zinc-800 text-white font-medium py-3 px-4 rounded-2xl flex items-center justify-center gap-3 shadow-lg hover:shadow-black/50 transition-all active:scale-[0.99]"
        >
          {/* Apple Logo SVG */}
          <svg className="w-5 h-5 fill-current" viewBox="0 0 170 170">
            <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.74 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.66-7.85-11.88-14.42-6.09-9.5-10.9-20.48-14.42-32.93-3.52-12.45-5.28-24.16-5.28-35.13 0-14.42 3.69-26.43 11.07-36.03 7.38-9.6 16.6-14.48 27.67-14.65 4.58 0 9.87 1.25 15.87 3.75 6 2.5 10.15 3.79 12.45 3.87 1.83 0 6.13-1.37 12.91-4.11 6.78-2.74 12.42-4 16.92-3.79 12.74.84 22.84 5.92 30.3 15.24-11.05 6.73-16.48 16.14-16.29 28.24.19 9.61 3.96 17.65 11.31 24.12 7.35 6.47 16.23 10.14 26.65 11-2.12 6.53-4.63 13.06-7.53 19.59zM119.22 31.84c0-7.39 2.68-14.43 8.04-21.13 5.36-6.7 12.06-10.71 20.1-12.03.22 1.3.33 2.5.33 3.6 0 7.39-2.82 14.63-8.46 21.72-5.64 7.09-12.47 11.19-20.49 12.3-.44-1.52-.66-2.92-.66-4.2l.14-.26z" />
          </svg>
          <span className="text-sm font-semibold tracking-tight">
            Guardar en Apple Wallet
          </span>
        </button>

        <button
          onClick={handleGoogleWalletClick}
          className="w-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-white font-medium py-3 px-4 rounded-2xl flex items-center justify-center gap-3 shadow-md transition-all active:scale-[0.99]"
        >
          {/* Google Wallet Icon */}
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span className="text-sm font-semibold tracking-tight">
            Guardar en Google Wallet
          </span>
        </button>
      </div>

      {/* Modal: Wallet Pass Info & Real Download Simulation */}
      {showWalletModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-sm w-full p-6 text-white shadow-2xl relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-zinc-800 text-amber-400">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base">
                  {walletType === 'apple' ? 'Pase de Apple Wallet' : 'Pase de Google Wallet'}
                </h3>
                <p className="text-xs text-zinc-400">{business.name}</p>
              </div>
            </div>

            <div className="bg-zinc-950/60 p-4 rounded-2xl border border-zinc-800/80 mb-4 text-xs space-y-2">
              <div className="flex justify-between text-zinc-400">
                <span>ID de Tarjeta:</span>
                <span className="font-mono text-white font-semibold">{customer.qrCodeToken}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Sellos actuales:</span>
                <span className="text-amber-400 font-bold">
                  {customer.currentStamps} de {config.totalStamps}
                </span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Titular:</span>
                <span className="text-white font-medium">{customer.name}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Estado:</span>
                <span className="text-emerald-400 font-medium">Activa en tiempo real</span>
              </div>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed mb-5">
              {walletType === 'apple' ? (
                <>
                  En producción, este botón descarga el archivo <strong>.pkpass</strong> firmado
                  con tu cuenta de <strong>Apple Developer</strong> y se agrega nativamente a tu
                  iPhone.
                </>
              ) : (
                <>
                  En producción, este botón conecta con <strong>Google Wallet API</strong> para
                  guardar la tarjeta con un toque en tu cuenta de Google.
                </>
              )}
            </p>

            <div className="space-y-2">
              <a
                href={`/api/wallet/${walletType}/${customer.qrCodeToken}`}
                download={walletType === 'apple' ? `${business.slug}-pass.pkpass` : undefined}
                target={walletType === 'google' ? '_blank' : undefined}
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-amber-500/20"
              >
                <Download className="w-4 h-4" />
                <span>Descargar Pase Digital ({walletType.toUpperCase()})</span>
              </a>

              <button
                onClick={() => setShowWalletModal(false)}
                className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold rounded-xl transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
