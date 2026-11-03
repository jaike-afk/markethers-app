'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/lib/translations';
import {
  UploadCloud,
  FileText,
  Camera,
  CheckCircle2,
  Sparkles,
  Smartphone,
  Utensils,
  Plus,
  Trash2,
  Edit3,
  MessageCircle,
  ExternalLink,
  QrCode,
  Check,
  RefreshCw,
  ShoppingBag,
  ArrowRight,
  Zap,
} from 'lucide-react';

export function DigitalMenuShowcase() {
  const { language, mounted } = useLanguage();
  const activeLang = mounted ? language : 'es';
  const t = translations[activeLang].menuSpotlight;

  const [activeTab, setActiveTab] = useState<'upload' | 'platform'>('upload');

  // State for simulated upload
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');

  // State for simulated platform editor
  const [demoItems, setDemoItems] = useState([
    {
      id: '1',
      name: activeLang === 'es' ? 'Flat White Especialidad' : 'Specialty Flat White',
      category: activeLang === 'es' ? 'Cafés' : 'Coffee',
      price: 65,
      available: true,
      icon: '☕',
    },
    {
      id: '2',
      name: activeLang === 'es' ? 'Avocado Toast & Huevo' : 'Avocado Toast & Egg',
      category: activeLang === 'es' ? 'Desayunos' : 'Brunch',
      price: 135,
      available: true,
      icon: '🥑',
    },
    {
      id: '3',
      name: activeLang === 'es' ? 'Croissant de Almendras' : 'Almond Croissant',
      category: activeLang === 'es' ? 'Panadería' : 'Pastry',
      price: 55,
      available: false, // demonstrates Sold Out toggle
      icon: '🥐',
    },
  ]);

  const handleSimulateUpload = (fileName: string) => {
    setIsUploading(true);
    setUploadSuccess(false);
    setUploadedFileName(fileName);

    setTimeout(() => {
      setIsUploading(false);
      setUploadSuccess(true);
    }, 1200);
  };

  const toggleAvailability = (id: string) => {
    setDemoItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, available: !item.available } : item
      )
    );
  };

  const updatePrice = (id: string, delta: number) => {
    setDemoItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, price: Math.max(10, item.price + delta) } : item
      )
    );
  };

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20 relative overflow-hidden">
      {/* Background glow accent - strictly clipped */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 max-w-full">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[600px] h-[350px] bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-transparent blur-3xl" />
      </div>

      {/* Header section */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-bold mb-4 shadow-sm">
          <span>{t.tag}</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          {t.headline}{' '}
          <span className="bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-300 bg-clip-text text-transparent">
            {t.headlineHighlight}
          </span>
        </h2>
        <p className="mt-4 text-sm sm:text-base text-zinc-300 max-w-2xl mx-auto leading-relaxed">
          {t.description}
        </p>
      </div>

      {/* Two Tab Buttons */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mb-10 max-w-xl mx-auto">
        <button
          onClick={() => setActiveTab('upload')}
          className={`w-full sm:w-1/2 py-3 px-4 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all shadow-lg ${
            activeTab === 'upload'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 shadow-amber-500/25 scale-[1.02]'
              : 'bg-zinc-900/80 text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          <UploadCloud className="w-4 h-4" />
          <span>{t.tabUpload}</span>
        </button>

        <button
          onClick={() => setActiveTab('platform')}
          className={`w-full sm:w-1/2 py-3 px-4 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all shadow-lg ${
            activeTab === 'platform'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-zinc-950 shadow-emerald-500/25 scale-[1.02]'
              : 'bg-zinc-900/80 text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>{t.tabPlatform}</span>
        </button>
      </div>

      {/* TAB CONTENT 1: UPLOAD EXISTING MENU */}
      {activeTab === 'upload' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-zinc-900/50 border border-amber-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl animate-in fade-in duration-200">
          {/* Left Explanation Column */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-1">
                {language === 'es' ? 'Cero tecleo • Listo en 60 segundos' : 'Zero typing • Ready in 60s'}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {t.uploadTitle}
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 mt-2 leading-relaxed">
                {t.uploadSubtitle}
              </p>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-zinc-300">
              <div className="flex items-start gap-3 bg-zinc-950/60 p-3.5 rounded-2xl border border-zinc-800/80">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black shrink-0">
                  1
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">{t.uploadStep1Title}</h4>
                  <p className="text-xs text-zinc-400 mt-0.5">{t.uploadStep1Desc}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-zinc-950/60 p-3.5 rounded-2xl border border-zinc-800/80">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black shrink-0">
                  2
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">{t.uploadStep2Title}</h4>
                  <p className="text-xs text-zinc-400 mt-0.5">{t.uploadStep2Desc}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-zinc-950/60 p-3.5 rounded-2xl border border-zinc-800/80">
                <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-black shrink-0">
                  3
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">{t.uploadStep3Title}</h4>
                  <p className="text-xs text-zinc-400 mt-0.5">{t.uploadStep3Desc}</p>
                </div>
              </div>
            </div>

            {/* Formats accepted badges */}
            <div className="flex flex-wrap items-center gap-2 pt-2 text-[11px] text-zinc-400">
              <span className="font-semibold text-zinc-300">
                {language === 'es' ? 'Acepta:' : 'Accepts:'}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-zinc-800 font-mono text-zinc-300">PDF</span>
              <span className="px-2 py-0.5 rounded-md bg-zinc-800 font-mono text-zinc-300">JPG / PNG</span>
              <span className="px-2 py-0.5 rounded-md bg-zinc-800 font-mono text-zinc-300">
                {language === 'es' ? 'Foto de Celular' : 'Smartphone Photo'}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-zinc-800 font-mono text-zinc-300">Instagram / Drive</span>
            </div>
          </div>

          {/* Right Interactive Simulator Column */}
          <div className="lg:col-span-6 bg-zinc-950 p-6 sm:p-8 rounded-3xl border border-zinc-800 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>{language === 'es' ? 'Simulador de Carga' : 'Upload Simulator'}</span>
              </span>
              <span className="text-[10px] text-zinc-500">
                {language === 'es' ? 'Prueba la extracción en vivo' : 'Test live extraction'}
              </span>
            </div>

            {/* Dropzone container */}
            <div className="border-2 border-dashed border-zinc-700 hover:border-amber-500/60 transition-colors rounded-2xl p-6 text-center space-y-3 bg-zinc-900/40">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/20">
                <UploadCloud className="w-6 h-6" />
              </div>
              <p className="text-xs text-zinc-300 font-medium">
                {t.uploadSimDrag}
              </p>
              <div className="pt-2">
                <span className="text-[11px] text-zinc-500 block mb-2">
                  {t.uploadSimOr}
                </span>
                <button
                  onClick={() => handleSimulateUpload('Carta_Aroma_2025.pdf')}
                  disabled={isUploading}
                  className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-zinc-950 font-black text-xs rounded-xl shadow-md shadow-amber-500/20 transition-all flex items-center gap-2 mx-auto active:scale-95"
                >
                  {isUploading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>{language === 'es' ? 'Digitalizando platillos...' : 'Digitizing dishes...'}</span>
                    </>
                  ) : (
                    <>
                      <FileText className="w-3.5 h-3.5" />
                      <span>{t.uploadSimButton}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Extraction Result Preview */}
            {uploadSuccess && (
              <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-2xl p-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{t.uploadSimSuccessTitle}</span>
                </div>
                <p className="text-[11px] text-zinc-300 leading-relaxed">
                  {t.uploadSimSuccessMsg}
                </p>

                {/* Sample items extracted */}
                <div className="space-y-2 pt-1 border-t border-emerald-500/20">
                  <div className="flex items-center justify-between text-xs bg-zinc-900/80 p-2 rounded-xl">
                    <span className="font-bold text-white">☕ Cappuccino Doble</span>
                    <span className="font-mono text-emerald-400 font-black">$58</span>
                  </div>
                  <div className="flex items-center justify-between text-xs bg-zinc-900/80 p-2 rounded-xl">
                    <span className="font-bold text-white">🥐 Croissant de Jamón Serrano</span>
                    <span className="font-mono text-emerald-400 font-black">$85</span>
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <Link
                    href="/aroma-cafe?tab=menu"
                    target="_blank"
                    className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 hover:underline"
                  >
                    <span>{language === 'es' ? 'Ver menú digital generado →' : 'View generated live menu →'}</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: BUILD INSIDE PLATFORM */}
      {activeTab === 'platform' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-zinc-900/50 border border-emerald-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl animate-in fade-in duration-200">
          {/* Left Explanation Column */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                {language === 'es' ? 'Editor Visual • Control Total' : 'Visual Editor • Full Control'}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {t.platformTitle}
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 mt-2 leading-relaxed">
                {t.platformSubtitle}
              </p>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-zinc-300">
              <div className="flex items-start gap-3 bg-zinc-950/60 p-3.5 rounded-2xl border border-zinc-800/80">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black shrink-0">
                  1
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">{t.platformStep1Title}</h4>
                  <p className="text-xs text-zinc-400 mt-0.5">{t.platformStep1Desc}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-zinc-950/60 p-3.5 rounded-2xl border border-zinc-800/80">
                <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-black shrink-0">
                  2
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">{t.platformStep2Title}</h4>
                  <p className="text-xs text-zinc-400 mt-0.5">{t.platformStep2Desc}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-zinc-950/60 p-3.5 rounded-2xl border border-zinc-800/80">
                <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-black shrink-0">
                  3
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">{t.platformStep3Title}</h4>
                  <p className="text-xs text-zinc-400 mt-0.5">{t.platformStep3Desc}</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-850 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl border border-zinc-700 transition-colors"
              >
                <span>{language === 'es' ? 'Abrir Administrador de Menú' : 'Open Menu Manager'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Interactive Simulator Column */}
          <div className="lg:col-span-6 bg-zinc-950 p-6 sm:p-8 rounded-3xl border border-zinc-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block">
                  {t.platformSimDemoCategory}
                </span>
                <span className="text-[10px] text-zinc-500">
                  {language === 'es' ? 'Toca los botones para editar en vivo' : 'Click buttons to edit live'}
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {language === 'es' ? 'Vista Administrador' : 'Admin View'}
              </span>
            </div>

            {/* List of items with interactive price and availability toggles */}
            <div className="space-y-3">
              {demoItems.map(item => (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    item.available
                      ? 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-700'
                      : 'bg-zinc-900/30 border-red-500/20 opacity-70'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xl p-1.5 rounded-xl bg-zinc-800">{item.icon}</span>
                      <div>
                        <h5 className="font-bold text-xs text-white flex items-center gap-2">
                          <span>{item.name}</span>
                          {!item.available && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-red-500/20 text-red-400 font-bold uppercase">
                              {t.platformSimSoldOut}
                            </span>
                          )}
                        </h5>
                        <span className="text-[10px] text-zinc-400">{item.category}</span>
                      </div>
                    </div>

                    {/* Price and Stock Controls */}
                    <div className="flex items-center gap-2.5">
                      {/* Price editor */}
                      <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1 gap-1.5">
                        <span className="text-xs font-black text-emerald-400">${item.price}</span>
                        <div className="flex flex-col text-[9px] text-zinc-400 leading-none">
                          <button
                            onClick={() => updatePrice(item.id, 5)}
                            className="hover:text-emerald-400 font-bold px-0.5"
                            title="Subir $5"
                          >
                            ▲
                          </button>
                          <button
                            onClick={() => updatePrice(item.id, -5)}
                            className="hover:text-red-400 font-bold px-0.5"
                            title="Bajar $5"
                          >
                            ▼
                          </button>
                        </div>
                      </div>

                      {/* Stock Toggle Button */}
                      <button
                        onClick={() => toggleAvailability(item.id)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold transition-all ${
                          item.available
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30'
                            : 'bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30'
                        }`}
                      >
                        {item.available ? t.platformSimAvailable : t.platformSimSoldOut}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-emerald-950/30 border border-emerald-500/20 rounded-xl text-center text-xs text-emerald-300 font-medium flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{t.platformSimPriceUpdated}</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
