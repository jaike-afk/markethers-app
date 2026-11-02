'use client';

import React, { useState } from 'react';
import QRCode from 'qrcode';
import { Business } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { Star, MessageCircle, ExternalLink, QrCode, CheckCircle2, ShieldCheck, Heart } from 'lucide-react';

interface GoogleReviewCardProps {
  business: Business;
  mode?: 'interactive' | 'display' | 'poster';
}

export function GoogleReviewCard({ business, mode = 'interactive' }: GoogleReviewCardProps) {
  const { language } = useLanguage();
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [submittedPrivate, setSubmittedPrivate] = useState(false);

  const googleConfig = business.googleReviews || {
    googleRating: 4.9,
    totalReviews: 240,
    googleReviewUrl: `https://search.google.com/local/writereview?placeid=${business.slug}`,
    rewardForReview: language === 'es' ? '+1 Sello extra de regalo' : '+1 Bonus stamp reward',
  };

  const handleStarClick = (rating: number) => {
    setSelectedRating(rating);
    if (rating >= 4) {
      // 4 or 5 stars: Direct to official Google Maps review!
      setTimeout(() => {
        window.open(googleConfig.googleReviewUrl, '_blank');
      }, 400);
    }
  };

  const handleSendPrivateFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;

    const message = `*${language === 'es' ? 'Feedback Privado de Cliente' : 'Private Customer Feedback'} (${selectedRating} ⭐)*\n\n"${feedbackText}"\n\n${language === 'es' ? 'Negocio' : 'Business'}: ${business.name}`;
    window.open(`https://wa.me/${business.whatsapp}?text=${encodeURIComponent(message)}`, '_blank');
    setSubmittedPrivate(true);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm max-w-md w-full mx-auto text-slate-800">
      {/* Google Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          {/* Official Google G SVG */}
          <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center p-2 shadow-inner">
            <svg className="w-full h-full" viewBox="0 0 24 24">
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
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900 leading-tight">
              {language === 'es' ? 'Reseñas en Google' : 'Google Reviews'}
            </h4>
            <span className="text-[11px] text-slate-500">{business.name}</span>
          </div>
        </div>

        {/* Current Rating Pill */}
        <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-xl">
          <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
          <span className="font-black text-xs text-amber-900">{googleConfig.googleRating}</span>
          <span className="text-[10px] text-amber-700">({googleConfig.totalReviews})</span>
        </div>
      </div>

      {/* Main Interactive Star Filter */}
      <div className="py-6 text-center">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
          {language === 'es'
            ? '¿Cómo calificarías tu experiencia hoy?'
            : 'How would you rate your experience today?'}
        </span>
        <p className="text-sm font-semibold text-slate-900 mb-4">
          {language === 'es' ? 'Toca una estrella para calificar' : 'Tap a star to rate'}
        </p>

        {/* 5 Stars Selector */}
        <div className="flex justify-center items-center gap-2.5">
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              type="button"
              onClick={() => handleStarClick(star)}
              className="p-1.5 transition-transform hover:scale-125 active:scale-95 group focus:outline-none"
            >
              <Star
                className={`w-8 h-8 ${
                  selectedRating && star <= selectedRating
                    ? 'fill-amber-400 text-amber-500'
                    : 'text-slate-300 group-hover:text-amber-300'
                } transition-colors`}
              />
            </button>
          ))}
        </div>

        {/* Reward incentive banner */}
        {googleConfig.rewardForReview && (
          <div className="mt-4 inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full text-[11px] font-bold">
            <Heart className="w-3.5 h-3.5 fill-emerald-500 text-emerald-600" />
            <span>
              {language === 'es' ? 'Incentivo:' : 'Reward:'} {googleConfig.rewardForReview}
            </span>
          </div>
        )}
      </div>

      {/* Dynamic Feedback Based on Stars */}
      {selectedRating && (
        <div className="pt-4 border-t border-slate-100">
          {selectedRating >= 4 ? (
            /* 4 or 5 STARS -> REDIRECT TO GOOGLE MAPS */
            <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 text-center space-y-3">
              <div className="flex items-center justify-center gap-1 text-emerald-700 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>
                  {language === 'es'
                    ? `¡Muchas gracias por tus ${selectedRating} estrellas!`
                    : `Thank you so much for your ${selectedRating} stars!`}
                </span>
              </div>
              <p className="text-xs text-slate-600">
                {language === 'es'
                  ? 'Tu opinión nos ayuda muchísimo a seguir creciendo. Se abrirá la ficha oficial de Google Maps para publicar tu reseña.'
                  : 'Your feedback means the world to us! Opening our official Google Maps listing to share your rating.'}
              </p>
              <a
                href={googleConfig.googleReviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full py-2.5 bg-[#22c55e] hover:bg-emerald-600 text-white font-extrabold text-xs rounded-xl shadow-md transition-all"
              >
                <span>{language === 'es' ? 'Abrir Google Maps y Publicar' : 'Open Google Maps & Publish'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ) : (
            /* 1, 2 OR 3 STARS -> PRIVATE FEEDBACK SHIELD */
            <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 space-y-3">
              {!submittedPrivate ? (
                <form onSubmit={handleSendPrivateFeedback} className="space-y-2.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                    <ShieldCheck className="w-4 h-4 text-amber-700" />
                    <span>
                      {language === 'es'
                        ? 'Lamentamos que tu experiencia no haya sido perfecta'
                        : 'We are sorry your experience was not perfect'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    {language === 'es'
                      ? 'Tu opinión es muy importante para el dueño del negocio. Cuéntanos qué falló para solucionarlo de inmediato:'
                      : 'Your voice matters to the store owner. Tell us what fell short so we can make it right immediately:'}
                  </p>
                  <textarea
                    rows={2}
                    value={feedbackText}
                    onChange={e => setFeedbackText(e.target.value)}
                    placeholder={
                      language === 'es'
                        ? 'Escribe tu mensaje privado aquí...'
                        : 'Type your private feedback here...'
                    }
                    required
                    className="w-full bg-white border border-amber-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                  <button
                    type="submit"
                    className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center justify-center gap-1.5"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>
                      {language === 'es'
                        ? 'Enviar Feedback Directo al Dueño'
                        : 'Send Direct Message to Owner'}
                    </span>
                  </button>
                </form>
              ) : (
                <div className="text-center py-2 text-xs font-bold text-emerald-800 flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>
                    {language === 'es'
                      ? 'Mensaje enviado. ¡Nos pondremos en contacto contigo!'
                      : 'Feedback sent. We will get in touch with you!'}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
