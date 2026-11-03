'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/lib/translations';
import {
  Check,
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowRight,
  MessageCircle,
  Clock,
  HelpCircle,
} from 'lucide-react';

export function PricingSection() {
  const { language, mounted } = useLanguage();
  const activeLang = mounted ? language : 'es';
  const t = translations[activeLang].pricing;

  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  return (
    <section id="precios" className="max-w-6xl mx-auto px-4 sm:px-6 py-20 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[700px] h-[400px] bg-gradient-to-r from-emerald-500/10 via-amber-500/10 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-bold mb-4">
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span>{t.tag}</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          {t.headline}{' '}
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
            {t.headlineHighlight}
          </span>
        </h2>

        <p className="mt-4 text-sm sm:text-base text-zinc-300 max-w-2xl mx-auto leading-relaxed">
          {t.subtitle}
        </p>

        {/* Billing Cycle Switcher */}
        <div className="mt-8 inline-flex items-center bg-zinc-900/90 border border-zinc-800 rounded-2xl p-1.5 shadow-xl">
          <button
            type="button"
            onClick={() => setBillingCycle('monthly')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              billingCycle === 'monthly'
                ? 'bg-zinc-800 text-white shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            {t.monthly}
          </button>

          <button
            type="button"
            onClick={() => setBillingCycle('annual')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              billingCycle === 'annual'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-black shadow-lg shadow-emerald-500/20 font-black'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span>{t.annual}</span>
            <span
              className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                billingCycle === 'annual'
                  ? 'bg-black/30 text-white'
                  : 'bg-emerald-500/20 text-emerald-300'
              }`}
            >
              {t.annualDiscount}
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        {t.plans.map(plan => {
          const price = billingCycle === 'annual' ? plan.annualPrice : plan.monthlyPrice;

          return (
            <div
              key={plan.id}
              className={`rounded-3xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-200 relative ${
                plan.popular
                  ? 'bg-gradient-to-b from-zinc-900 via-zinc-900/95 to-zinc-950 border-2 border-emerald-500 shadow-2xl shadow-emerald-500/10 lg:-translate-y-2'
                  : 'bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-emerald-500 to-lime-400 text-zinc-950 text-[11px] font-black uppercase tracking-wider shadow-md">
                  {plan.badge || '🔥 Recomendado'}
                </div>
              )}

              <div>
                {/* Plan Header */}
                <div className="border-b border-zinc-800/80 pb-6 mb-6">
                  <h3 className="text-xl font-black text-white">{plan.name}</h3>
                  <p className="text-xs text-zinc-400 mt-1 min-h-[34px] leading-relaxed">
                    {plan.description}
                  </p>

                  <div className="mt-5 flex items-baseline gap-1.5">
                    <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                      ${price}
                    </span>
                    <span className="text-xs text-zinc-400 font-medium">USD / mes</span>
                  </div>

                  <span className="text-[11px] text-emerald-400/90 font-medium block mt-1">
                    {billingCycle === 'annual' ? t.billedAnnually : t.billedMonthly}
                  </span>
                </div>

                {/* Features Checklist */}
                <div className="space-y-3.5 mb-8">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-xs">
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          plan.popular
                            ? 'bg-emerald-500 text-black'
                            : 'bg-zinc-800 text-emerald-400'
                        }`}
                      >
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                      <span className="text-zinc-200 leading-tight">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div>
                <Link
                  href={`/register?plan=${plan.id}&billing=${billingCycle}`}
                  className={`w-full py-3.5 rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 ${
                    plan.popular
                      ? 'bg-[#22c55e] hover:bg-emerald-600 text-black shadow-emerald-500/25 hover:scale-[1.02]'
                      : 'bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700'
                  }`}
                >
                  <span>{plan.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* 14-Day Money Back Guarantee Box */}
      <div className="mt-14 max-w-3xl mx-auto bg-gradient-to-r from-emerald-950/60 via-zinc-900 to-emerald-950/60 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 text-center space-y-2 shadow-xl">
        <div className="inline-flex items-center gap-2 text-emerald-400 font-extrabold text-sm sm:text-base">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span>{t.guaranteeTitle}</span>
        </div>
        <p className="text-xs text-zinc-300 max-w-xl mx-auto leading-relaxed">
          {t.guaranteeDesc}
        </p>

        {/* 3 Trust points */}
        <div className="pt-3 flex flex-wrap items-center justify-center gap-4 text-[11px] text-zinc-400 font-semibold border-t border-emerald-500/20 mt-4">
          <span className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
            {t.trust1}
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
            {t.trust2}
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
            {t.trust3}
          </span>
        </div>
      </div>
    </section>
  );
}
