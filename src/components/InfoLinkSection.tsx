'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/lib/translations';
import {
  Smartphone,
  ExternalLink,
  Utensils,
  CreditCard,
  Star,
  MessageCircle,
  MapPin,
  Sparkles,
  CheckCircle2,
  Share2,
} from 'lucide-react';

export function InfoLinkSection() {
  const { language, mounted } = useLanguage();
  const activeLang = mounted ? language : 'es';
  const t = translations[activeLang].infoLink;

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20 border-t border-zinc-900 relative">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Explanation Column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.tag}</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            {t.headline}{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
              {t.headlineHighlight}
            </span>
          </h2>

          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-xl">
            {t.subtitle}
          </p>

          <div className="space-y-4 pt-2">
            <div className="flex items-start gap-3 bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20 font-bold">
                🍽️
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-white">
                  {t.feature1Title}
                </h4>
                <p className="text-xs text-zinc-400 mt-0.5">{t.feature1Desc}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20 font-bold">
                📲
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-white">
                  {t.feature2Title}
                </h4>
                <p className="text-xs text-zinc-400 mt-0.5">{t.feature2Desc}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20 font-bold">
                ⭐
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-white">
                  {t.feature3Title}
                </h4>
                <p className="text-xs text-zinc-400 mt-0.5">{t.feature3Desc}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20 font-bold">
                💬
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-white">
                  {t.feature4Title}
                </h4>
                <p className="text-xs text-zinc-400 mt-0.5">{t.feature4Desc}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Phone Mockup Preview */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="w-full max-w-[320px] bg-zinc-950 rounded-[40px] p-4 border-[6px] border-zinc-800 shadow-2xl shadow-emerald-500/10 relative">
            {/* Notch */}
            <div className="w-28 h-4 bg-zinc-800 rounded-b-xl mx-auto mb-3" />

            {/* Inner Phone Content */}
            <div className="space-y-4 text-center">
              {/* Profile Avatar */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 mx-auto flex items-center justify-center text-3xl shadow-lg shadow-amber-500/20">
                ☕
              </div>

              <div>
                <div className="flex items-center justify-center gap-1.5">
                  <h3 className="font-black text-sm text-white">Café Aroma</h3>
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 fill-blue-400" />
                </div>
                <span className="text-[10px] text-zinc-400">Cafetería & Brunch de Especialidad</span>
                <span className="text-[10px] text-emerald-400 font-mono block mt-0.5">
                  markethers.com/aroma-cafe
                </span>
              </div>

              {/* Action Buttons Mockup */}
              <div className="space-y-2 text-left pt-1">
                <Link
                  href="/aroma-cafe"
                  target="_blank"
                  className="w-full py-2.5 px-3 bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 font-black text-xs rounded-xl flex items-center justify-between shadow-md transition-transform hover:scale-[1.02]"
                >
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-zinc-950" />
                    <span>Tarjeta Apple/Google Wallet</span>
                  </div>
                  <span className="text-[10px] bg-black/20 px-1.5 py-0.5 rounded font-bold">
                    Gratis
                  </span>
                </Link>

                <Link
                  href="/aroma-cafe?tab=menu"
                  target="_blank"
                  className="w-full py-2.5 px-3 bg-zinc-900 hover:bg-zinc-850 text-white border border-zinc-800 text-xs font-bold rounded-xl flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Utensils className="w-4 h-4 text-amber-400" />
                    <span>Menú con Fotos & Videos</span>
                  </div>
                  <span className="text-[10px] text-zinc-400">Ver carta</span>
                </Link>

                <Link
                  href="/aroma-cafe"
                  target="_blank"
                  className="w-full py-2.5 px-3 bg-zinc-900 hover:bg-zinc-850 text-white border border-zinc-800 text-xs font-bold rounded-xl flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span>Calificarnos en Google Maps</span>
                  </div>
                  <span className="text-[10px] text-amber-400 font-bold">4.9⭐</span>
                </Link>

                <a
                  href="https://wa.me/525512345678"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 text-xs font-bold rounded-xl flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                    <span>Chat de WhatsApp</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold">Directo</span>
                </a>
              </div>

              <div className="pt-2 text-[10px] text-zinc-500">
                Poderoso para bio de Instagram & QR de mesas
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
