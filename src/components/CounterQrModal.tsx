'use client';

import React, { useEffect, useState, useRef } from 'react';
import QRCode from 'qrcode';
import { Business } from '@/types';
import { Printer, Download, X, QrCode as QrIcon, Sparkles } from 'lucide-react';

interface CounterQrModalProps {
  business: Business;
  isOpen: boolean;
  onClose: () => void;
  type?: 'menu' | 'counter' | 'discount' | 'reviews' | 'infolink';
}

export function CounterQrModal({ business, isOpen, onClose, type = 'counter' }: CounterQrModalProps) {
  const [qrUrl, setQrUrl] = useState<string>('');
  const printRef = useRef<HTMLDivElement>(null);

  const qrConfig = {
    counter: {
      title: 'QR Mostrador / Tarjeta de Lealtad',
      desc: 'Coloca este poster con código QR en tu caja para que tus clientes instalen su tarjeta Wallet en 1 segundo.',
      badge: '¡Club de Clientes VIP!',
      subbadge: `Suma ${business?.loyaltyConfig?.totalStamps || 6} sellos digitales en tu celular`,
      path: '',
    },
    menu: {
      title: 'QR Menú Digital para Mesas',
      desc: 'Coloca este QR en cada mesa o barra para que los comensales consulten la carta completa con fotos y videos.',
      badge: '¡Escanea la Carta Digital!',
      subbadge: 'Menú interactivo con fotos, videos y precios en tiempo real',
      path: '?tab=menu',
    },
    discount: {
      title: 'QR Descuento & Promoción Flash',
      desc: 'Ofrece un incentivo especial de bienvenida para capturar nuevos clientes al instante.',
      badge: '¡Descuento de Bienvenida!',
      subbadge: 'Escanea y recibe un beneficio exclusivo en tu consumo de hoy',
      path: '?promo=bienvenida',
    },
    reviews: {
      title: 'QR Reseñas de Google (Filtro 5⭐)',
      desc: 'Estimula calificaciones positivas de 5 estrellas en Google Maps con filtro inteligente.',
      badge: '⭐ ¡Califícanos en Google!',
      subbadge: 'Tu opinión nos importa. Ayúdanos a seguir mejorando',
      path: '?action=review',
    },
    infolink: {
      title: 'QR InfoLink Todo-en-Uno',
      desc: 'El QR universal que centraliza tu menú digital, tarjeta Wallet, reseñas Google y redes en un solo link.',
      badge: '📲 Conecta con Nosotros',
      subbadge: 'Menú Digital • Tarjetas Wallet • Reseñas Google',
      path: '',
    },
  }[type];

  useEffect(() => {
    if (!isOpen) return;
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://markethers.app';
    const reviewUrl = business?.googleReviews?.googleReviewUrl;
    const targetUrl = type === 'reviews' && reviewUrl
      ? reviewUrl
      : `${origin}/${business?.slug || 'demo'}${qrConfig.path}`;

    QRCode.toDataURL(targetUrl, {
      width: 400,
      margin: 1,
      color: {
        dark: '#18181b',
        light: '#ffffff',
      },
    })
      .then(url => setQrUrl(url))
      .catch(err => console.error(err));
  }, [isOpen, business?.slug, business?.googleReviews?.googleReviewUrl, type, qrConfig.path]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-lg w-full p-6 text-white shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-full bg-zinc-800/80"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-emerald-400 mb-2">
          <QrIcon className="w-5 h-5" />
          <h3 className="font-bold text-lg text-white">{qrConfig.title}</h3>
        </div>
        <p className="text-xs text-zinc-400 mb-6">
          {qrConfig.desc}
        </p>

        {/* Printable Stand Preview */}
        <div
          ref={printRef}
          className="bg-white text-zinc-900 p-8 rounded-3xl shadow-xl border-4 border-emerald-400/40 text-center flex flex-col items-center justify-between min-h-[460px]"
        >
          {/* Header */}
          <div>
            <div className="text-4xl mb-1">{business.logoUrl}</div>
            <h2 className="text-2xl font-black tracking-tight">{business.name}</h2>
            <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider mt-0.5">
              Markethers Smart QR
            </p>
          </div>

          {/* Reward Callout */}
          <div className="my-4 bg-emerald-50 border border-emerald-200 rounded-2xl p-4 w-full">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
              {qrConfig.badge}
            </span>
            <p className="text-sm font-black text-slate-950 mt-0.5">
              {type === 'counter' ? business.loyaltyConfig.rewardTitle : business.tagline}
            </p>
            <span className="text-[11px] text-emerald-700 mt-1 block">
              {qrConfig.subbadge}
            </span>
          </div>

          {/* Big QR Code */}
          <div className="p-3 bg-zinc-50 rounded-2xl border-2 border-zinc-900/10 shadow-inner">
            {qrUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={qrUrl}
                alt="QR Mostrador"
                className="w-48 h-48 object-contain rounded-xl"
              />
            ) : (
              <div className="w-48 h-48 flex items-center justify-center text-xs text-zinc-400">
                Generando QR...
              </div>
            )}
          </div>

          {/* Steps */}
          <div className="w-full mt-4 pt-3 border-t border-zinc-200 grid grid-cols-3 gap-2 text-[10px] text-zinc-600 font-medium">
            <div className="bg-zinc-100 p-2 rounded-xl">
              <span className="font-bold text-zinc-900 block text-xs">1</span>
              Apunta tu cámara
            </div>
            <div className="bg-zinc-100 p-2 rounded-xl">
              <span className="font-bold text-zinc-900 block text-xs">2</span>
              Añade a tu Wallet
            </div>
            <div className="bg-zinc-100 p-2 rounded-xl">
              <span className="font-bold text-zinc-900 block text-xs">3</span>
              Suma y Gana
            </div>
          </div>

          <div className="mt-3 text-[9px] text-zinc-400 tracking-wider uppercase font-semibold">
            Sin descargar apps pesadas • Apple Wallet & Google Wallet
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={handlePrint}
            className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-amber-500/20"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Stand / Guardar PDF</span>
          </button>
          <button
            onClick={onClose}
            className="py-3 px-5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold text-sm rounded-xl transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
