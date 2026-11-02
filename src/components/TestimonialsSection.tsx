'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/lib/translations';
import { Star, Quote, TrendingUp, CheckCircle2 } from 'lucide-react';

export function TestimonialsSection() {
  const { language, mounted } = useLanguage();
  const activeLang = mounted ? language : 'es';
  const t = translations[activeLang].testimonials;

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20 border-t border-zinc-900 relative">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-bold mb-3">
          <Star className="w-3.5 h-3.5 fill-current" />
          <span>{t.tag}</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          {t.headline}{' '}
          <span className="bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-300 bg-clip-text text-transparent">
            {t.headlineHighlight}
          </span>
        </h2>

        <p className="text-sm text-zinc-400 mt-2">
          {t.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {t.items.map((item, idx) => (
          <div
            key={idx}
            className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 sm:p-7 flex flex-col justify-between hover:border-zinc-700 transition-all shadow-xl"
          >
            <div>
              {/* Stars & Metric Pill */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(item.stars)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  {item.metric}
                </span>
              </div>

              {/* Quote */}
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed italic">
                "{item.quote}"
              </p>
            </div>

            {/* Author info */}
            <div className="pt-5 mt-5 border-t border-zinc-800/80 flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xl shrink-0">
                {item.avatar}
              </div>

              <div>
                <h4 className="font-bold text-xs text-white leading-tight">
                  {item.name}
                </h4>
                <span className="text-[11px] text-zinc-400 font-medium block">
                  {item.role} • <strong>{item.business}</strong>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
