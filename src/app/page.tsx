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
  ChevronDown,
  Store,
  Layers,
  Check,
  X,
  Play,
  Share2,
  MessageCircle,
  Bell,
  Heart,
  HelpCircle,
  DollarSign,
  Coffee,
  Scissors,
  Award,
  BarChart3,
  Flame,
  FileText,
  CreditCard,
} from 'lucide-react';

export default function HomePage() {
  const [interactiveStamps, setInteractiveStamps] = useState(6);
  const [roiCustomersPerDay, setRoiCustomersPerDay] = useState(75);
  const [roiAverageTicket, setRoiAverageTicket] = useState(90);
  const [selectedIndustry, setSelectedIndustry] = useState<'cafe' | 'barber' | 'restaurant'>('cafe');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const demoBusiness = INITIAL_BUSINESSES[0]; // Café Aroma
  const demoCustomer = INITIAL_CUSTOMERS[0]; // Carlos Mendoza

  // Calculations for ROI section
  const monthlyRevenue = roiCustomersPerDay * roiAverageTicket * 30;
  const estimatedRecovered = Math.round(monthlyRevenue * 0.18); // 18% recovered revenue
  const returnVisitsGained = Math.round(roiCustomersPerDay * 30 * 0.22); // 22% more visits

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const industriesData = {
    cafe: {
      title: 'Cafeterías, Reposterías & Brunch',
      example: 'Por cada 8 bebidas o desayunos consumidos, el 9º café de especialidad es gratis.',
      result: '+34% de visitas recurrentes entre semana.',
      icon: '☕',
      badge: 'El programa más popular',
    },
    barber: {
      title: 'Barberías, Salones & Spas',
      example: 'En tu 5to corte de cabello, recibe un ritual de barba o tratamiento capilar sin costo.',
      result: 'El 82% de los clientes vuelve antes de 21 días para no perder su racha.',
      icon: '💈',
      badge: 'Citas recurrentes automáticas',
    },
    restaurant: {
      title: 'Hamburgueserías, Pizzerías & Bares',
      example: 'Suma 6 pedidos o visitas y llévate una hamburguesa deluxe o postre de la casa.',
      result: '+45% pedidos directos por WhatsApp sin comisiones de delivery.',
      icon: '🍔',
      badge: 'Cero comisiones a apps terceras',
    },
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-emerald-500 selection:text-black">
      {/* Background glow lighting effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-gradient-to-b from-emerald-500/15 via-emerald-600/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* ========================================================= */}
      {/* 1. HERO SECTION                                           */}
      {/* ========================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-16 text-center">
        {/* Release / Category Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-bold mb-6">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>El Sistema Operativo y Club de Fidelización para Negocios Locales</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white max-w-5xl mx-auto leading-[1.08]">
          Fideliza a tus clientes en{' '}
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 bg-clip-text text-transparent">
            Apple Wallet & Google Wallet
          </span>{' '}
          sin apps que descargar.
        </h1>

        {/* Deep Sub-headline */}
        <p className="mt-6 text-base sm:text-xl text-zinc-300 max-w-3xl mx-auto leading-relaxed font-normal">
          Reemplaza las tarjetas de cartón que tus clientes siempre pierden por{' '}
          <strong className="text-white">tarjetas de sellos digitales que viven en su teléfono</strong>. 
          Incluye escáner web para tu personal en caja, pedidos directos por WhatsApp y menú digital interactivo.
        </p>

        {/* High-Impact CTA Row */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <Link
            href="/app"
            className="w-full sm:w-auto px-8 py-4 bg-[#22c55e] hover:bg-emerald-600 text-black font-extrabold text-sm rounded-2xl flex items-center justify-center gap-2.5 shadow-xl shadow-emerald-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Ver Panel de Control (/app)</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </Link>

          <Link
            href="/aroma-cafe"
            className="w-full sm:w-auto px-7 py-4 bg-zinc-900 hover:bg-zinc-850 text-white border border-zinc-800 font-bold text-sm rounded-2xl flex items-center justify-center gap-2 transition-all hover:border-zinc-700"
          >
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <span>Probar como Cliente (Café Aroma)</span>
          </Link>

          <Link
            href="/scanner"
            className="w-full sm:w-auto px-6 py-4 bg-zinc-900/60 hover:bg-zinc-850 text-zinc-300 border border-zinc-800/80 font-semibold text-sm rounded-2xl flex items-center justify-center gap-2 transition-all"
          >
            <QrCode className="w-4 h-4 text-emerald-400" />
            <span>Escáner de Cajero</span>
          </Link>
        </div>

        {/* Feature Checkmarks */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-zinc-400 font-medium">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Sin tarjeta de crédito requerida
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Listo en menos de 5 minutos
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Compatible con 100% de iPhone & Android
          </span>
        </div>

        {/* Hero Product Live Interactive Preview */}
        <div className="mt-14 max-w-4xl mx-auto bg-gradient-to-b from-zinc-900/90 via-zinc-900/40 to-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-zinc-800/80">
            <div className="text-left">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block mb-0.5">
                Simulador en tiempo real
              </span>
              <h3 className="text-xl font-black text-white">Así interactúa el cliente con su tarjeta</h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Haz clic en el botón para simular cómo suma sellos en tu cafetería o restaurante.
              </p>
            </div>

            <button
              onClick={() => setInteractiveStamps(prev => (prev >= 8 ? 1 : prev + 1))}
              className="px-5 py-2.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-xs rounded-xl border border-emerald-500/40 flex items-center gap-2 transition-all active:scale-95 shrink-0 shadow-lg shadow-emerald-500/10"
            >
              <Zap className="w-4 h-4 text-emerald-400 fill-current" />
              <span>Simular compra de cliente (+1 Sello)</span>
            </button>
          </div>

          <div className="pt-6 flex justify-center">
            <AppleWalletCard
              business={demoBusiness}
              customer={{
                ...demoCustomer,
                currentStamps: interactiveStamps,
              }}
            />
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. THE BIG PROBLEM VS THE MODERN SOLUTION                 */}
      {/* ========================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20 border-t border-zinc-900">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-1">
            El Fin del Cartón y las Apps Pesadas
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            ¿Por qué el 80% de los clientes nunca vuelve a tu negocio?
          </h2>
          <p className="text-sm text-zinc-400 mt-2">
            La mayoría de los negocios locales pierden miles de dólares en clientes que quisieron volver, 
            pero los olvidaron porque la tarjeta de cartón quedó en otro pantalón.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Cardboard Failure */}
          <div className="bg-zinc-900/40 border border-red-500/20 rounded-3xl p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-400 flex items-center justify-center font-bold text-xl mb-4 border border-red-500/20">
                📦
              </div>
              <h3 className="font-bold text-lg text-white">Tarjetas de Cartón</h3>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                El 72% de los clientes las pierde o las deja en casa. No te dan el número de WhatsApp ni el nombre de nadie. Cuando se terminan, tienes que volver a pagar imprenta.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-zinc-800/80 text-[11px] font-bold text-red-400 flex items-center gap-1.5">
              <X className="w-4 h-4 shrink-0" />
              <span>Cero datos de contacto • Se pierden siempre</span>
            </div>
          </div>

          {/* Heavy Custom App Failure */}
          <div className="bg-zinc-900/40 border border-amber-500/20 rounded-3xl p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-xl mb-4 border border-amber-500/20">
                📲
              </div>
              <h3 className="font-bold text-lg text-white">Crear tu Propia App Móvil</h3>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                Cuesta miles de dólares programarla y pagar las tiendas de Apple y Google. El 85% de los clientes en fila se rehúsa a esperar que descargue 80MB de app en App Store.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-zinc-800/80 text-[11px] font-bold text-amber-400 flex items-center gap-1.5">
              <X className="w-4 h-4 shrink-0" />
              <span>Costo prohibitivo • Tasa de rechazo del 85%</span>
            </div>
          </div>

          {/* The Markethers Solution */}
          <div className="bg-gradient-to-b from-emerald-500/15 via-zinc-900 to-zinc-900 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xl">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xl mb-4 border border-emerald-500/30">
                ⚡
              </div>
              <h3 className="font-bold text-lg text-white">La Solución: Apple & Google Wallet</h3>
              <p className="text-xs text-zinc-300 mt-2 leading-relaxed">
                La tarjeta se agrega con 1 toque al iPhone o Android de tu cliente en su app nativa de Wallet. Sin descargas, siempre a la mano junto a sus tarjetas de crédito y con avisos en pantalla.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-emerald-500/20 text-[11px] font-extrabold text-emerald-400 flex items-center gap-1.5">
              <Check className="w-4 h-4 shrink-0 stroke-[3]" />
              <span>Adopción inmediata • 100% de retención</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. THE 4 CORE MODULES EXPLAINED IN DETAIL                */}
      {/* ========================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-1">
            Los 4 Pilares del Producto
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Todo lo que tu negocio necesita en una sola plataforma
          </h2>
          <p className="text-sm text-zinc-400 mt-3">
            Conoce a fondo las 4 herramientas integradas que transforman clientes esporádicos en clientes recurrentes.
          </p>
        </div>

        <div className="space-y-16">
          {/* PILAR 1: TARJETAS EN WALLET */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center bg-zinc-900/50 border border-zinc-800/80 rounded-3xl p-8 sm:p-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold mb-4">
                <CreditCard className="w-3.5 h-3.5" />
                <span>Pilar 1: Fidelización Nativa</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Tarjetas de Sellos y Puntos en Apple Wallet y Google Wallet
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 mt-3 leading-relaxed">
                Olvídate de comprar sellos de tinta o mandar a imprimir tarjetas de cartón. Tu cliente escanea el QR en mostrador o mesa, escribe su nombre y WhatsApp y en menos de 10 segundos tiene su tarjeta guardada en su iPhone o teléfono Android.
              </p>

              <div className="mt-6 space-y-3 text-xs text-zinc-400">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Notificaciones Push en Pantalla de Bloqueo:</strong> Al sumar un sello o cuando el cliente esté cerca de tu local gracias a geofencing.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Personalización Total:</strong> Tu logotipo, colores corporativos, ícono (café, pizza, tijeras, estrella) y reglas de recompensa.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Seguridad Antifraude:</strong> Cada pase cuenta con un código QR criptográfico único que solo puede ser leído por tu terminal autorizada.</span>
                </div>
              </div>
            </div>

            <div className="bg-zinc-950 p-6 rounded-3xl border border-zinc-800 text-center">
              <div className="max-w-xs mx-auto">
                <AppleWalletCard business={demoBusiness} customer={demoCustomer} />
              </div>
            </div>
          </div>

          {/* PILAR 2: ESCÁNER WEB PARA PERSONAL */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center bg-zinc-900/50 border border-zinc-800/80 rounded-3xl p-8 sm:p-12">
            <div className="order-2 lg:order-1 bg-zinc-950 p-8 rounded-3xl border border-zinc-800 text-center">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
                <QrCode className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-white">Escáner Web PWA</h4>
              <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
                Cualquier smartphone se convierte en un escáner de alta velocidad con sonido de confirmación y lluvia de confeti.
              </p>
              <div className="mt-5 flex justify-center">
                <Link
                  href="/scanner"
                  className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-500/20 flex items-center gap-2"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Probar Escáner en Vivo</span>
                </Link>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold mb-4">
                <QrCode className="w-3.5 h-3.5" />
                <span>Pilar 2: Escáner sin Hardware</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Cero aparatos caros: Tu personal usa cualquier celular o tablet
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 mt-3 leading-relaxed">
                No tienes que gastar en pistolas láser ni terminales POS propietarias. Tu cajero, mesero o barista abre la dirección web de tu escáner en su teléfono, introduce su PIN y listo:
              </p>

              <div className="mt-6 space-y-3 text-xs text-zinc-400">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Operación en 2 Segundos:</strong> Apunta la cámara al QR del cliente y pulsa "+1 Sello".</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Alerta Sonora y Visual:</strong> Emite un pitido de confirmación y celebra en pantalla cuando el cliente completa la tarjeta para su regalo.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Auditoría por Cajero:</strong> Cada sello queda registrado con fecha, hora y nombre del empleado que lo otorgó.</span>
                </div>
              </div>
            </div>
          </div>

          {/* PILAR 3: MENÚ DIGITAL & WHATSAPP */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center bg-zinc-900/50 border border-zinc-800/80 rounded-3xl p-8 sm:p-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold mb-4">
                <Utensils className="w-3.5 h-3.5" />
                <span>Pilar 3: InfoLink & Menú WhatsApp</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Menú digital interactivo con pedidos directos a tu WhatsApp
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 mt-3 leading-relaxed">
                Tus clientes ven tu catálogo con fotos de alta calidad, precios actualizados y categorías. Agregan platillos a su carrito y al hacer clic en ordenar, te llega un mensaje de WhatsApp perfectamente redactado con el desglose del pedido.
              </p>

              <div className="mt-6 space-y-3 text-xs text-zinc-400">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>0% Comisiones de Delivery:</strong> Todo el dinero va directo a tu cuenta sin intermediarios.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Control de Disponibilidad en 1 Toque:</strong> ¿Se acabó el pan brioche o la leche de avena? Márcalo como "Agotado" al instante desde cocina.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Enlace para tu Instagram:</strong> Tu propio bio-link (`markethers.com/tu-negocio`) con horarios, dirección en mapa y botón de chat.</span>
                </div>
              </div>
            </div>

            <div className="bg-zinc-950 p-6 rounded-3xl border border-zinc-800">
              <div className="space-y-3">
                <div className="bg-zinc-900 p-3.5 rounded-2xl border border-zinc-800 flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-xs text-white">Flat White de Origen</h5>
                    <span className="text-[10px] text-zinc-400">Doble ristretto con leche cremada</span>
                    <span className="text-xs font-black text-emerald-400 block mt-1">$65</span>
                  </div>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-bold px-2 py-1 rounded-lg">
                    Disponible
                  </span>
                </div>

                <div className="bg-zinc-900 p-3.5 rounded-2xl border border-zinc-800 flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-xs text-white">Avocado Toast & Huevo Poché</h5>
                    <span className="text-[10px] text-zinc-400">Pan masa madre con aguacate y dukkah</span>
                    <span className="text-xs font-black text-emerald-400 block mt-1">$135</span>
                  </div>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-bold px-2 py-1 rounded-lg">
                    Disponible
                  </span>
                </div>

                <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-center text-xs text-emerald-300 font-bold flex items-center justify-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  <span>Recibe pedidos ordenados por WhatsApp al instante</span>
                </div>
              </div>
            </div>
          </div>

          {/* PILAR 4: CRM INTELIGENTE & REACTIVACIÓN */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center bg-zinc-900/50 border border-zinc-800/80 rounded-3xl p-8 sm:p-12">
            <div className="order-2 lg:order-1 bg-zinc-950 p-6 rounded-3xl border border-zinc-800">
              <div className="space-y-3">
                <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white block">Carlos Mendoza</span>
                    <span className="text-[10px] text-zinc-400 font-mono">+52 55 8899 1122</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                    VIP (14 visitas)
                  </span>
                </div>

                <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white block">Sofia Valenzuela</span>
                    <span className="text-[10px] text-zinc-400 font-mono">+52 55 7766 5544</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300">
                    🎁 Premio Listo (8/8)
                  </span>
                </div>

                <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white block">Mateo Fernández</span>
                    <span className="text-[10px] text-zinc-400 font-mono">Última visita: hace 28 días</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-300">
                    ⚠️ En Riesgo
                  </span>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-bold mb-4">
                <Users className="w-3.5 h-3.5" />
                <span>Pilar 4: CRM & Retención</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Tu propia base de datos de clientes capturada automáticamente
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 mt-3 leading-relaxed">
                Cada vez que un cliente se registra para obtener su tarjeta, pasa a formar parte de tu CRM. Sabrás quiénes son tus clientes más fieles, cuándo vinieron por última vez y a quiénes estás a punto de perder para enviarles un recordatorio antes de que vayan con la competencia.
              </p>

              <div className="mt-6 space-y-3 text-xs text-zinc-400">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Segmentación Inteligente:</strong> Clientes Nuevos, Clientes VIP y Clientes en Riesgo.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Reactivación por WhatsApp:</strong> Botón directo con mensaje personalizado: <em>"¡Hola Mateo! Te extrañamos en Café Aroma, ven hoy por tu 2x1"</em>.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. COMPARISON TABLE: CARTÓN vs APP PROPIA vs MARKETHERS   */}
      {/* ========================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20 border-t border-zinc-900">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-1">
            Comparativa Clara
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            ¿Cómo se compara frente a otras opciones?
          </h2>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-950/80 text-zinc-400 uppercase text-[10px] tracking-wider border-b border-zinc-800">
                <tr>
                  <th className="py-4 px-6 font-bold">Característica</th>
                  <th className="py-4 px-6 font-bold text-red-400">Tarjetas de Cartón</th>
                  <th className="py-4 px-6 font-bold text-amber-400">App Móvil Propia</th>
                  <th className="py-4 px-6 font-black text-emerald-400 bg-emerald-500/10">Markethers OS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/80 text-zinc-300">
                <tr>
                  <td className="py-4 px-6 font-bold text-white">Descarga por el cliente</td>
                  <td className="py-4 px-6 text-zinc-400">No aplica</td>
                  <td className="py-4 px-6 text-red-400 font-semibold">Obligatoria (App Store 80MB)</td>
                  <td className="py-4 px-6 text-emerald-400 font-black bg-emerald-500/5">0 Descargas (Apple/Google Wallet)</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-bold text-white">Tasa de adopción de clientes</td>
                  <td className="py-4 px-6 text-zinc-400">Baja (se pierden)</td>
                  <td className="py-4 px-6 text-red-400 font-semibold">Menos del 15%</td>
                  <td className="py-4 px-6 text-emerald-400 font-black bg-emerald-500/5">+85% de los clientes en caja</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-bold text-white">Captura de WhatsApp / CRM</td>
                  <td className="py-4 px-6 text-red-400 font-bold">Imposible</td>
                  <td className="py-4 px-6 text-zinc-300">Sí</td>
                  <td className="py-4 px-6 text-emerald-400 font-black bg-emerald-500/5">Automática en primer escaneo</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-bold text-white">Notificaciones en pantalla</td>
                  <td className="py-4 px-6 text-red-400 font-bold">No</td>
                  <td className="py-4 px-6 text-zinc-300">Sí (si no las silencian)</td>
                  <td className="py-4 px-6 text-emerald-400 font-black bg-emerald-500/5">Nativas de Apple Wallet & Google</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-bold text-white">Costo de inversión inicial</td>
                  <td className="py-4 px-6 text-zinc-400">Imprenta recurrente</td>
                  <td className="py-4 px-6 text-red-400 font-semibold">$3,000 - $10,000 USD</td>
                  <td className="py-4 px-6 text-emerald-400 font-black bg-emerald-500/5">Prácticamente cero</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-bold text-white">Hardware para personal</td>
                  <td className="py-4 px-6 text-zinc-400">Sello de tinta</td>
                  <td className="py-4 px-6 text-zinc-400">POS dedicado</td>
                  <td className="py-4 px-6 text-emerald-400 font-black bg-emerald-500/5">Cualquier celular o tablet con cámara</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. INTERACTIVE ROI CALCULATOR                             */}
      {/* ========================================================= */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-20 border-t border-zinc-900">
        <div className="bg-gradient-to-br from-zinc-900 via-zinc-900/90 to-zinc-950 border border-zinc-800 rounded-3xl p-8 sm:p-12 shadow-2xl">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-1">
              Calculadora de Retorno de Inversión
            </span>
            <h2 className="text-3xl font-black text-white tracking-tight">
              ¿Cuánto dinero extra puedes generar con fidelización?
            </h2>
            <p className="text-xs text-zinc-400 mt-2">
              Ajusta los controles según las cifras de tu negocio y mira el impacto en ingresos mensuales.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Sliders */}
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs font-bold text-zinc-300 mb-2">
                  <span>Clientes atendidos por día:</span>
                  <span className="text-emerald-400 text-sm font-black">{roiCustomersPerDay} clientes</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="300"
                  step="5"
                  value={roiCustomersPerDay}
                  onChange={e => setRoiCustomersPerDay(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer h-2 bg-zinc-800 rounded-lg"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-zinc-300 mb-2">
                  <span>Ticket promedio de consumo:</span>
                  <span className="text-emerald-400 text-sm font-black">${roiAverageTicket}</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="400"
                  step="5"
                  value={roiAverageTicket}
                  onChange={e => setRoiAverageTicket(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer h-2 bg-zinc-800 rounded-lg"
                />
              </div>

              <div className="p-4 bg-zinc-950/80 rounded-2xl border border-zinc-800 text-xs text-zinc-400 space-y-1">
                <span className="font-bold text-white block">Base de cálculo:</span>
                <p>Ingreso mensual estimado: <strong>${monthlyRevenue.toLocaleString()}</strong></p>
                <p>Tasa promedio de aumento de frecuencia con Wallet: <strong>+18% a +25%</strong></p>
              </div>
            </div>

            {/* Results Box */}
            <div className="bg-zinc-950 p-6 sm:p-8 rounded-3xl border border-emerald-500/30 text-center space-y-5">
              <span className="text-[11px] uppercase font-bold tracking-wider text-emerald-400 block">
                Ingreso Adicional Estimado al Mes
              </span>
              <div className="text-4xl sm:text-5xl font-black text-white">
                +${estimatedRecovered.toLocaleString()}
              </div>
              <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                Generado por <strong>+{returnVisitsGained} visitas extra</strong> de clientes que vuelven a tu local en vez de ir con la competencia.
              </p>

              <div className="pt-4 border-t border-zinc-800">
                <Link
                  href="/app"
                  className="w-full py-3 bg-[#22c55e] hover:bg-emerald-600 text-black font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                >
                  <span>Comenzar Ahora Mismo</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 6. USE CASES BY INDUSTRY                                  */}
      {/* ========================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20 border-t border-zinc-900">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-1">
            Adaptable a Cualquier Giro
          </span>
          <h2 className="text-3xl font-black text-white tracking-tight">
            Diseñado para los comercios locales que mueven la ciudad
          </h2>
        </div>

        {/* Industry Tabs */}
        <div className="flex justify-center gap-2 mb-8">
          {(['cafe', 'barber', 'restaurant'] as const).map(ind => (
            <button
              key={ind}
              onClick={() => setSelectedIndustry(ind)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedIndustry === ind
                  ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              {industriesData[ind].title.split(',')[0]}
            </button>
          ))}
        </div>

        {/* Selected Industry Card */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-8 max-w-3xl mx-auto text-center space-y-4">
          <span className="text-4xl">{industriesData[selectedIndustry].icon}</span>
          <h3 className="text-xl font-bold text-white">{industriesData[selectedIndustry].title}</h3>
          <p className="text-xs sm:text-sm text-zinc-300 max-w-xl mx-auto leading-relaxed">
            <strong>Mecánica recomendada:</strong> {industriesData[selectedIndustry].example}
          </p>
          <div className="pt-2">
            <span className="inline-block px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-black rounded-full border border-emerald-500/20">
              {industriesData[selectedIndustry].result}
            </span>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 7. FREQUENTLY ASKED QUESTIONS (FAQ)                       */}
      {/* ========================================================= */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-20 border-t border-zinc-900">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-1">
            Resolvemos tus Dudas
          </span>
          <h2 className="text-3xl font-black text-white tracking-tight">
            Preguntas Frecuentes
          </h2>
        </div>

        <div className="space-y-3">
          {[
            {
              q: '¿Mis clientes necesitan descargar una aplicación de la App Store o Play Store?',
              a: 'No. Ese es el gran poder de esta plataforma. Las tarjetas se guardan nativamente en Apple Wallet (en iPhone) y Google Wallet (en Android) con solo escanear el QR o abrir el enlace. Ambas billeteras ya vienen preinstaladas en prácticamente el 100% de los teléfonos modernos.',
            },
            {
              q: '¿Qué pasa si mi cliente cambia de celular o pierde su teléfono?',
              a: 'No pierde sus sellos. Como la tarjeta está vinculada a su cuenta de iCloud o cuenta de Google, al iniciar sesión en su nuevo teléfono la tarjeta de lealtad reaparece automáticamente con sus sellos intactos.',
            },
            {
              q: '¿Necesito comprar algún aparato especial para que mis cajeros lean los sellos?',
              a: 'No. El personal o cajero simplemente abre la web del escáner en cualquier teléfono o tablet con cámara (Safari o Chrome) y escanea la pantalla del cliente. Es instantáneo.',
            },
            {
              q: '¿Cómo funciona el menú con pedidos de WhatsApp?',
              a: 'El cliente ve tu catálogo de productos en su teléfono, agrega lo que quiere ordenar y al dar clic en "Pedir por WhatsApp", el sistema abre un chat directamente con el número de tu negocio con todo el pedido desglosado y el monto total calculado.',
            },
            {
              q: '¿Puedo personalizar el logotipo y los colores de la tarjeta?',
              a: 'Sí, totalmente. Desde tu panel de control puedes elegir tus colores corporativos, subir tu logo, elegir la cantidad de sellos (ej: 5, 6, 8 o 10 sellos) y definir el nombre exacto de tu premio.',
            },
            {
              q: '¿Cómo monto este sistema en internet para mi negocio?',
              a: 'Todo el sistema está programado en Next.js y listo para desplegarse con un solo clic en plataformas gratuitas como Vercel o Railway, con certificado SSL (HTTPS) y soporte para tu propio dominio personalizado.',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden transition-colors hover:border-zinc-700"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between text-xs sm:text-sm font-bold text-white"
              >
                <span>{item.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-emerald-400 transition-transform ${
                    openFaq === idx ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-4 sm:px-5 pb-5 text-xs text-zinc-400 leading-relaxed border-t border-zinc-800/60 pt-3">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 8. FINAL CALL TO ACTION (CTA)                             */}
      {/* ========================================================= */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-20">
        <div className="bg-gradient-to-r from-emerald-950 via-zinc-900 to-emerald-950 border border-emerald-500/40 rounded-3xl p-8 sm:p-14 text-center shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto relative z-10">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-400 block mb-2">
              Empieza a fidelizar hoy
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Transforma visitantes casuales en clientes frecuentes
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 mt-4 leading-relaxed">
              Únete a la nueva generación de negocios locales que ya no dependen del cartón ni de las comisiones de apps terceras.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/app"
                className="w-full sm:w-auto px-8 py-4 bg-[#22c55e] hover:bg-emerald-600 text-black font-extrabold text-sm rounded-2xl shadow-xl shadow-emerald-500/30 transition-all hover:scale-[1.02]"
              >
                Abrir Panel de Control (/app)
              </Link>
              <Link
                href="/aroma-cafe"
                className="w-full sm:w-auto px-6 py-4 bg-zinc-900 text-white border border-zinc-700 hover:bg-zinc-800 font-bold text-sm rounded-2xl transition-all"
              >
                Ver Tienda Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-zinc-900 py-12 text-center text-xs text-zinc-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-500 text-black flex items-center justify-center font-black text-xs">
              M
            </div>
            <span className="font-bold text-white">Markethers Loyalty SaaS</span>
            <span className="text-[10px] text-zinc-400">— Sistema Operativo de Lealtad & Menú</span>
          </div>

          <div className="flex gap-4 text-zinc-400">
            <Link href="/app" className="hover:text-white transition-colors">Panel /app</Link>
            <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
            <Link href="/scanner" className="hover:text-white transition-colors">Escáner</Link>
            <Link href="/aroma-cafe" className="hover:text-white transition-colors">Demo Cliente</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
