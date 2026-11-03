'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Lock,
  ArrowRight,
  Store,
  User,
  Mail,
  Phone,
  Building,
  Check,
  Star,
  Zap,
  AlertCircle,
} from 'lucide-react';
import { store } from '@/lib/store';
import { Business, Customer, MenuItem, StampTransaction, MerchantClientAccount } from '@/types';
import { validateCreditCard, saveUser } from '@/lib/auth';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPlan = searchParams.get('plan') || 'pro';

  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [selectedPlan, setSelectedPlan] = useState<'starter' | 'pro' | 'enterprise'>(
    initialPlan === 'starter' || initialPlan === 'enterprise' ? initialPlan : 'pro'
  );

  // Form inputs
  const [businessName, setBusinessName] = useState('');
  const [businessCategory, setBusinessCategory] = useState('Restaurante & Bar');
  const [whatsapp, setWhatsapp] = useState('');
  const [city, setCity] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Payment mock state
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'mercadopago'>('stripe');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExp, setCardExp] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const planPricing = {
    starter: { monthly: 29, annual: 19, name: 'Plan Starter' },
    pro: { monthly: 49, annual: 32, name: 'Plan Pro MenuBeacon' },
    enterprise: { monthly: 99, annual: 65, name: 'Multi-Sucursal' },
  }[selectedPlan];

  const currentPrice = billingCycle === 'annual' ? planPricing.annual : planPricing.monthly;

  const handleCardNumberChange = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    const formatted = digits.replace(/(.{4})/g, '$1 ').trim();
    setCardNumber(formatted);
  };

  const handleExpChange = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) {
      setCardExp(`${digits.slice(0, 2)}/${digits.slice(2)}`);
    } else {
      setCardExp(digits);
    }
  };

  const handleCvcChange = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    setCardCvc(digits);
  };

  const fillTestCard = () => {
    setCardNumber('4242 4242 4242 4242');
    setCardExp('12/28');
    setCardCvc('123');
    setPaymentError(null);
  };

  const handleNextStep1 = () => {
    setPaymentError(null);
    if (!businessName.trim()) {
      setPaymentError('Por favor ingresa el nombre comercial de tu negocio.');
      return;
    }
    setStep(2);
  };

  const handleNextStep2 = () => {
    setPaymentError(null);
    if (!ownerName.trim()) {
      setPaymentError('Por favor ingresa tu nombre completo.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setPaymentError('Por favor ingresa un correo electrónico válido.');
      return;
    }
    if (!password || password.length < 6) {
      setPaymentError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    setStep(3);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError(null);

    // Strict validation of credit card
    const cardValidation = validateCreditCard(cardNumber, cardExp, cardCvc);
    if (!cardValidation.valid) {
      setPaymentError(cardValidation.error || 'Tarjeta de crédito inválida.');
      return;
    }

    setLoading(true);

    // Simulate account provisioning
    setTimeout(() => {
      const slug = (businessName || 'mi-negocio')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const newBiz: Business = {
        id: `biz_${Date.now()}`,
        slug: slug || 'mi-restaurante',
        name: businessName || 'Mi Negocio MenuBeacon',
        tagline: 'Comida deliciosa & hospitalidad',
        description: 'Menú digital y tarjeta de lealtad en Apple & Google Wallet.',
        category: businessCategory,
        logoUrl: '🍸',
        coverUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=80',
        phone: whatsapp || '+52 55 1234 5678',
        whatsapp: (whatsapp || '525512345678').replace(/\D/g, ''),
        instagram: '',
        address: city || 'Dirección del Local',
        city: city || 'Ciudad',
        pinCode: '1234',
        currency: '$',
        loyaltyConfig: {
          totalStamps: 6,
          rewardTitle: '1 Bebida o Platillo de la Casa Gratis',
          rewardDescription: 'Válido al completar 6 sellos en tu celular.',
          stampIcon: 'glass',
          cardBgColor: '#0a111a',
          cardTextColor: '#ffffff',
          accentColor: '#22c55e',
          terms: 'Un sello por consumo. No acumulable.',
          allowCashback: false,
        },
        googleReviews: {
          googleReviewUrl: 'https://search.google.com/',
          googleRating: 5.0,
          totalReviews: 1,
          rewardForReview: '+1 Sello extra de regalo',
          smartFilterEnabled: true,
        },
        menuDisplayMode: 'both',
      };

      const userAccount = {
        id: `user_${Date.now()}`,
        email: email.trim().toLowerCase(),
        password,
        name: ownerName || 'Propietario',
        businessId: newBiz.id,
        businessName: newBiz.name,
        planId: selectedPlan,
        role: 'client' as const,
        createdAt: new Date().toISOString(),
      };

      const saveRes = saveUser(userAccount);
      if (!saveRes.success) {
        setPaymentError(saveRes.error || 'Error al registrar usuario.');
        setLoading(false);
        return;
      }

      store.addBusiness(newBiz);

      // Auto-provision initial owner customer, initial transaction, and starter menu items
      const cleanPrefix = (slug || 'BIZ').slice(0, 4).toUpperCase().replace(/[^A-Z0-9]/g, 'X');
      const ownerCustomer: Customer = {
        id: `cust_${newBiz.id}_owner`,
        businessId: newBiz.id,
        name: ownerName || 'Propietario',
        phone: whatsapp || '+52 55 1234 5678',
        email: email.trim().toLowerCase(),
        qrCodeToken: `CARD-${cleanPrefix}-1001`,
        currentStamps: 1,
        totalVisits: 1,
        rewardsEarned: 0,
        rewardsRedeemed: 0,
        points: 20,
        totalSpent: 0,
        tier: 'vip',
        walletPassType: 'apple',
        notes: 'Pase del Propietario / Tarjeta de prueba inicial',
        createdAt: new Date().toISOString(),
        lastVisitAt: new Date().toISOString(),
      };

      const initialTx: StampTransaction = {
        id: `tx_${Date.now()}_welcome`,
        businessId: newBiz.id,
        customerId: ownerCustomer.id,
        customerName: ownerCustomer.name,
        type: 'STAMP_ADDED',
        stampsChanged: 1,
        notes: 'Sello de bienvenida por activación de cuenta',
        staffName: 'Sistema MenuBeacon',
        createdAt: new Date().toISOString(),
      };

      // Generate 3 starter menu items adapted to the merchant's category
      let starterItems: MenuItem[] = [];
      const catLower = (businessCategory || '').toLowerCase();
      if (catLower.includes('palet') || catLower.includes('helad')) {
        starterItems = [
          {
            id: `menu_${Date.now()}_1`,
            businessId: newBiz.id,
            name: 'Paleta Artesanal de Frutas Naturales',
            category: 'Paletas de Agua',
            price: 35,
            description: 'Elaborada artesanalmente con fruta 100% natural (Fresa, Mango Chamoy, Maracuyá o Limón).',
            imageUrl: 'https://images.unsplash.com/photo-1505394033641-40c6ad1178d7?auto=format&fit=crop&w=400&q=80',
            available: true,
            featured: true,
          },
          {
            id: `menu_${Date.now()}_2`,
            businessId: newBiz.id,
            name: 'Nieve Cremosa Especial (2 Bolas)',
            category: 'Nieves de Leche',
            price: 55,
            description: 'Receta tradicional cremosa de vainilla con nuez garapiñada y chocolate belga.',
            imageUrl: 'https://images.unsplash.com/photo-1560008511-11c63416e52d?auto=format&fit=crop&w=400&q=80',
            available: true,
            featured: true,
          },
          {
            id: `menu_${Date.now()}_3`,
            businessId: newBiz.id,
            name: 'Mangonada Especial con Chamoy & Gomitas',
            category: 'Especialidades',
            price: 65,
            description: 'Nieve de mango con chamoy de la casa, chilito Tajín y gomitas de tamarindo.',
            imageUrl: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=400&q=80',
            available: true,
            featured: false,
          },
        ];
      } else if (catLower.includes('caf') || catLower.includes('brunch')) {
        starterItems = [
          {
            id: `menu_${Date.now()}_1`,
            businessId: newBiz.id,
            name: 'Flat White de Especialidad',
            category: 'Bebidas Calientes',
            price: 65,
            description: 'Doble shot de espresso de grano mexicano con microespuma de leche texturizada sedosa.',
            imageUrl: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=400&q=80',
            available: true,
            featured: true,
          },
          {
            id: `menu_${Date.now()}_2`,
            businessId: newBiz.id,
            name: 'Tostada de Aguacate con Huevo Poché',
            category: 'Brunch & Desayunos',
            price: 130,
            description: 'Pan de masa madre tostado, puré de aguacate fresco, huevo poché orgánico y dukkah.',
            imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=400&q=80',
            available: true,
            featured: true,
          },
          {
            id: `menu_${Date.now()}_3`,
            businessId: newBiz.id,
            name: 'Croissant Horneado de Almendras',
            category: 'Repostería Artesanal',
            price: 55,
            description: 'Hojaldre 100% de mantequilla relleno de crema frangipane y almendras fileteadas.',
            imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=400&q=80',
            available: true,
            featured: false,
          },
        ];
      } else if (catLower.includes('bar') || catLower.includes('cantina') || catLower.includes('pub')) {
        starterItems = [
          {
            id: `menu_${Date.now()}_1`,
            businessId: newBiz.id,
            name: 'Cóctel Signature de la Casa',
            category: 'Coctelería de Autor',
            price: 140,
            description: 'Destilado premium, infusión de frutos de temporada y jarabe artesanal.',
            imageUrl: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=400&q=80',
            available: true,
            featured: true,
          },
          {
            id: `menu_${Date.now()}_2`,
            businessId: newBiz.id,
            name: 'Botana Clásica de Cantina',
            category: 'Botanas & Entradas',
            price: 120,
            description: 'Selección de la casa servida con salsas tradicionales y totopos crujientes.',
            imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80',
            available: true,
            featured: true,
          },
          {
            id: `menu_${Date.now()}_3`,
            businessId: newBiz.id,
            name: 'Cerveza Artesanal de Línea',
            category: 'Cervezas',
            price: 85,
            description: 'Cerveza de barril estilo artesanal servida bien fría en tarro escarchado.',
            imageUrl: 'https://images.unsplash.com/photo-1608270119337-1422b4ca1a2a?auto=format&fit=crop&w=400&q=80',
            available: true,
            featured: false,
          },
        ];
      } else {
        starterItems = [
          {
            id: `menu_${Date.now()}_1`,
            businessId: newBiz.id,
            name: 'Platillo Insignia de la Casa',
            category: 'Especialidades',
            price: 185,
            description: 'Nuestra receta más destacada con ingredientes frescos seleccionados del día.',
            imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80',
            available: true,
            featured: true,
          },
          {
            id: `menu_${Date.now()}_2`,
            businessId: newBiz.id,
            name: 'Entrada Tradicional & Ensalada Fresca',
            category: 'Entradas',
            price: 115,
            description: 'Combinación fresca de vegetales de huerto con vinagreta de la casa.',
            imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80',
            available: true,
            featured: true,
          },
          {
            id: `menu_${Date.now()}_3`,
            businessId: newBiz.id,
            name: 'Bebida Refrescante Artesanal',
            category: 'Bebidas',
            price: 45,
            description: 'Agua infusionada natural con menta, pepino y toque cítrico.',
            imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=400&q=80',
            available: true,
            featured: false,
          },
        ];
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('markethers_active_business_id', newBiz.id);
        const existingBizList = JSON.parse(localStorage.getItem('markethers_custom_businesses') || '[]');
        localStorage.setItem('markethers_custom_businesses', JSON.stringify([...existingBizList, newBiz]));

        // Persist initial owner customer in customer DB
        const existingCustomers = JSON.parse(localStorage.getItem('markethers_customers_db') || '[]');
        localStorage.setItem('markethers_customers_db', JSON.stringify([ownerCustomer, ...existingCustomers]));

        // Persist welcome transaction in transaction DB
        const existingTx = JSON.parse(localStorage.getItem('markethers_transactions_db') || '[]');
        localStorage.setItem('markethers_transactions_db', JSON.stringify([initialTx, ...existingTx]));

        // Persist starter menu items in menu DB
        const existingMenu = JSON.parse(localStorage.getItem('markethers_menu_items_db') || '[]');
        localStorage.setItem('markethers_menu_items_db', JSON.stringify([...starterItems, ...existingMenu]));

        localStorage.setItem(
          'markethers_subscription',
          JSON.stringify({
            planId: selectedPlan,
            planName: planPricing.name,
            billingCycle,
            price: currentPrice,
            status: 'trialing',
            trialDaysLeft: 14,
            trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            }),
            cardLast4: cardValidation.last4,
            cardBrand: cardValidation.brand,
            cardHolder: ownerName || 'Propietario',
            gateway: paymentMethod,
          })
        );

        // Register in Master Merchant Portfolio for Owner / Manager Console
        const newMerchantClient: MerchantClientAccount = {
          id: `merch_${Date.now()}`,
          businessId: newBiz.id,
          businessName: newBiz.name,
          ownerName: ownerName || 'Propietario',
          email: email.trim().toLowerCase(),
          phone: whatsapp || '+52 55 1234 5678',
          city: city || 'Ciudad',
          category: businessCategory || 'Restaurante',
          status: 'trialing',
          planId: selectedPlan,
          planName: planPricing.name,
          billingCycle,
          monthlyPrice: currentPrice,
          totalPaid: 0,
          amountDue: 0,
          nextBillingDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] + ' (14d prueba)',
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
          cardLast4: cardValidation.last4,
          cardBrand: cardValidation.brand,
          notes: 'Registro autónomo vía web con tarjeta de crédito verificada.',
        };
        const existingMerchantClients = JSON.parse(localStorage.getItem('markethers_merchant_clients_db') || '[]');
        localStorage.setItem('markethers_merchant_clients_db', JSON.stringify([newMerchantClient, ...existingMerchantClients]));
      }

      setLoading(false);
      router.push('/app');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans antialiased py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Brand Header */}
        <div className="flex items-center justify-between pb-8 border-b border-zinc-800">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-400 via-teal-400 to-lime-400 flex items-center justify-center text-zinc-950 font-black shadow-lg shadow-emerald-500/20">
              <Sparkles className="w-5 h-5 text-zinc-950 fill-zinc-950" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-white block">
                MenuBeacon
              </span>
              <span className="text-[10px] text-zinc-400 -mt-1 block">
                Un producto de Markethers
              </span>
            </div>
          </Link>

          <div className="text-right text-xs">
            <span className="text-zinc-400">¿Ya tienes cuenta?</span>{' '}
            <Link href="/login" className="text-emerald-400 font-bold hover:underline">
              Iniciar Sesión
            </Link>
          </div>
        </div>

        {/* Headline */}
        <div className="text-center max-w-2xl mx-auto my-8">
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-bold inline-block mb-3">
            ✨ Prueba Gratuita de 14 Días • Cancela cuando quieras
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Activa tu cuenta de MenuBeacon en 2 minutos
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-2">
            Configura tu menú digital, activa tus tarjetas de Apple/Google Wallet y recibe tus primeros clientes hoy mismo.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: REGISTRATION FORM */}
          <div className="lg:col-span-7 bg-zinc-900/70 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
            {/* Step Indicators */}
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-zinc-800 text-xs">
              <button
                type="button"
                onClick={() => setStep(1)}
                className={`flex items-center gap-2 font-bold ${
                  step === 1 ? 'text-emerald-400' : 'text-zinc-500'
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    step === 1 ? 'bg-emerald-500 text-black' : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  1
                </span>
                <span>Negocio</span>
              </button>

              <div className="h-0.5 flex-1 mx-3 bg-zinc-800" />

              <button
                type="button"
                onClick={handleNextStep1}
                className={`flex items-center gap-2 font-bold ${
                  step === 2 ? 'text-emerald-400' : 'text-zinc-500'
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    step === 2 ? 'bg-emerald-500 text-black' : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  2
                </span>
                <span>Administrador</span>
              </button>

              <div className="h-0.5 flex-1 mx-3 bg-zinc-800" />

              <button
                type="button"
                onClick={() => {
                  if (step === 1) {
                    if (!businessName.trim()) {
                      setPaymentError('Por favor ingresa el nombre comercial de tu negocio.');
                      return;
                    }
                    setStep(2);
                  } else if (step === 2) {
                    handleNextStep2();
                  }
                }}
                className={`flex items-center gap-2 font-bold ${
                  step === 3 ? 'text-emerald-400' : 'text-zinc-500'
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    step === 3 ? 'bg-emerald-500 text-black' : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  3
                </span>
                <span>Activación</span>
              </button>
            </div>

            {/* Error Banner */}
            {paymentError && (
              <div className="mb-6 p-4 rounded-2xl bg-red-950/60 border border-red-500/50 flex items-start gap-3 text-red-200 text-xs animate-in fade-in">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold block text-red-300">No se pudo procesar la solicitud:</span>
                  <p>{paymentError}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* STEP 1: BUSINESS DATA */}
              {step === 1 && (
                <div className="space-y-4 animate-in fade-in">
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <Store className="w-4 h-4 text-emerald-400" />
                    <span>Paso 1: Información de tu Establecimiento</span>
                  </h3>

                  <div>
                    <label className="text-xs font-bold text-zinc-300 block mb-1">
                      Nombre Comercial del Negocio *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="ej. Habibi Bar Cantina, Café Aroma, La Trattoria"
                      value={businessName}
                      onChange={e => setBusinessName(e.target.value)}
                      className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-zinc-300 block mb-1">
                        Giro / Categoría *
                      </label>
                      <select
                        value={businessCategory}
                        onChange={e => setBusinessCategory(e.target.value)}
                        className="w-full px-3 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white outline-none"
                      >
                        <option value="Restaurantes & Bares">Restaurantes & Bares</option>
                        <option value="Paleterías & Heladerías">Paleterías & Heladerías</option>
                        <option value="Cafetería & Brunch">Cafetería & Brunch</option>
                        <option value="Barbería & Salón">Barbería & Salón</option>
                        <option value="Postres & Panadería">Postres & Panadería</option>
                        <option value="Otro">Otro Comercio Local</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-zinc-300 block mb-1">
                        Ciudad / País *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="ej. Ciudad de México, Monterrey, Bogotá"
                        value={city}
                        onChange={e => setCity(e.target.value)}
                        className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-zinc-300 block mb-1">
                      Teléfono Oficial del Negocio *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="ej. +1 (555) 234-5678 o móvil de contacto"
                      value={whatsapp}
                      onChange={e => setWhatsapp(e.target.value)}
                      className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 outline-none focus:border-emerald-500"
                    />
                    <span className="text-[11px] text-zinc-500 mt-1 block">
                      Número principal para contacto con clientes y alertas del sistema.
                    </span>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleNextStep1}
                      className="w-full py-3.5 bg-[#22c55e] hover:bg-emerald-600 text-black font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
                    >
                      <span>Siguiente: Datos de Acceso</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: ADMIN CREDENTIALS */}
              {step === 2 && (
                <div className="space-y-4 animate-in fade-in">
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <User className="w-4 h-4 text-emerald-400" />
                    <span>Paso 2: Cuenta del Propietario / Administrador</span>
                  </h3>

                  <div>
                    <label className="text-xs font-bold text-zinc-300 block mb-1">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="ej. Jaike Romero"
                      value={ownerName}
                      onChange={e => setOwnerName(e.target.value)}
                      className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-zinc-300 block mb-1">
                      Correo Electrónico (Para iniciar sesión) *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="ej. jaikeromero@gmail.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-zinc-300 block mb-1">
                      Contraseña Segura *
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Mínimo 8 caracteres"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="pt-2 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="py-3.5 px-4 bg-zinc-800 text-zinc-300 font-bold text-xs rounded-xl hover:bg-zinc-700 cursor-pointer"
                    >
                      Atrás
                    </button>
                    <button
                      type="button"
                      onClick={handleNextStep2}
                      className="flex-1 py-3.5 bg-[#22c55e] hover:bg-emerald-600 text-black font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
                    >
                      <span>Siguiente: Activar Suscripción</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: PAYMENT GATEWAY & SUBSCRIPTION */}
              {step === 3 && (
                <div className="space-y-4 animate-in fade-in">
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-emerald-400" />
                    <span>Paso 3: Pasarela de Pago & Activación de Prueba</span>
                  </h3>

                  {/* Payment Method Switcher */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('stripe')}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        paymentMethod === 'stripe'
                          ? 'border-emerald-500 bg-emerald-500/10 text-white'
                          : 'border-zinc-800 bg-zinc-950 text-zinc-400'
                      }`}
                    >
                      <div className="font-bold text-xs flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Tarjeta (Stripe)</span>
                      </div>
                      <span className="text-[10px] text-zinc-400 block mt-0.5">
                        Visa, Mastercard, Amex, Apple Pay
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('mercadopago')}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        paymentMethod === 'mercadopago'
                          ? 'border-emerald-500 bg-emerald-500/10 text-white'
                          : 'border-zinc-800 bg-zinc-950 text-zinc-400'
                      }`}
                    >
                      <div className="font-bold text-xs flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-blue-400" />
                        <span>Mercado Pago</span>
                      </div>
                      <span className="text-[10px] text-zinc-400 block mt-0.5">
                        Débito local, SPEI, OXXO
                      </span>
                    </button>
                  </div>

                  {/* Card fields */}
                  <div className="space-y-3 bg-zinc-950 p-4 rounded-2xl border border-zinc-800">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold text-zinc-400 block">
                        Número de Tarjeta *
                      </label>
                      <button
                        type="button"
                        onClick={fillTestCard}
                        className="text-[10px] text-emerald-400 hover:text-emerald-300 font-bold underline cursor-pointer"
                      >
                        ⚡ Rellenar tarjeta de prueba Stripe
                      </button>
                    </div>
                    <input
                      type="text"
                      maxLength={19}
                      placeholder="4242 4242 4242 4242"
                      value={cardNumber}
                      onChange={e => handleCardNumberChange(e.target.value)}
                      className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-xs text-white font-mono outline-none focus:border-emerald-500 tracking-wider"
                    />

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-zinc-400 block mb-1">
                          Vencimiento (MM/AA) *
                        </label>
                        <input
                          type="text"
                          maxLength={5}
                          placeholder="12/28"
                          value={cardExp}
                          onChange={e => handleExpChange(e.target.value)}
                          className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-xs text-white font-mono outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-zinc-400 block mb-1">
                          CVC / CVV *
                        </label>
                        <input
                          type="password"
                          maxLength={4}
                          placeholder="123"
                          value={cardCvc}
                          onChange={e => handleCvcChange(e.target.value)}
                          className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-xs text-white font-mono outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Free trial callout */}
                  <div className="p-3.5 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl text-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                      <ShieldCheck className="w-4 h-4 shrink-0" />
                      <span>Total a pagar hoy: $0.00 USD</span>
                    </div>
                    <p className="text-[11px] text-zinc-300 leading-relaxed">
                      Tu prueba gratuita dura 14 días. No se cobrará nada hoy. Recibirás un aviso por correo antes de que termine tu periodo de prueba y puedes cancelar con un solo clic.
                    </p>
                  </div>

                  <div className="pt-2 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="py-3.5 px-4 bg-zinc-800 text-zinc-300 font-bold text-xs rounded-xl hover:bg-zinc-700"
                    >
                      Atrás
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 py-4 bg-[#22c55e] hover:bg-emerald-600 text-black font-extrabold text-sm rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/25 transition-all disabled:opacity-50"
                    >
                      {loading ? (
                        <span>Creando tu cuenta y activando dashboard...</span>
                      ) : (
                        <>
                          <span>Comenzar Prueba Gratuita y Entrar al Panel</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* RIGHT: ORDER SUMMARY & VALUE PILLARS */}
          <div className="lg:col-span-5 space-y-4">
            {/* Plan Card */}
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Resumen de tu suscripción
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-black uppercase">
                  14 Días Gratis
                </span>
              </div>

              {/* Plan Switcher */}
              <div className="my-4">
                <div className="flex bg-zinc-950 p-1 rounded-xl border border-zinc-800 mb-3">
                  <button
                    type="button"
                    onClick={() => setBillingCycle('annual')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      billingCycle === 'annual'
                        ? 'bg-emerald-500 text-black shadow'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Anual (Ahorra 35%)
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingCycle('monthly')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      billingCycle === 'monthly'
                        ? 'bg-emerald-500 text-black shadow'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Mensual
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-base text-white">{planPricing.name}</h4>
                    <span className="text-xs text-zinc-400">
                      {billingCycle === 'annual' ? 'Facturado anualmente' : 'Facturado mes a mes'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-white">${currentPrice}</span>
                    <span className="text-xs text-zinc-400">/mes</span>
                  </div>
                </div>
              </div>

              {/* Features included */}
              <div className="space-y-2.5 pt-4 border-t border-zinc-800 text-xs">
                <div className="flex items-center gap-2 text-zinc-300">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 stroke-[3]" />
                  <span>Menú digital interactivo (fotos, videos y precios)</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-300">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 stroke-[3]" />
                  <span>Subida directa de Menú en PDF o diseño existente</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-300">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 stroke-[3]" />
                  <span>Pases de lealtad Apple & Google Wallet ilimitados</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-300">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 stroke-[3]" />
                  <span>Filtro inteligente de 5 estrellas en Google Maps</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-300">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 stroke-[3]" />
                  <span>Escáner web para empleados sin descargar apps</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-300">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 stroke-[3]" />
                  <span>0% comisiones sobre tus ventas</span>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="mt-5 pt-4 border-t border-zinc-800 space-y-2 text-xs">
                <div className="flex justify-between text-zinc-400">
                  <span>Prueba de 14 días:</span>
                  <span className="text-emerald-400 font-bold">$0.00 USD</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Cobro al día 14:</span>
                  <span>
                    ${billingCycle === 'annual' ? currentPrice * 12 : currentPrice} USD
                  </span>
                </div>
                <div className="flex justify-between text-white font-bold text-sm pt-2 border-t border-zinc-800">
                  <span>Total hoy:</span>
                  <span className="text-emerald-400 text-base">$0.00 USD</span>
                </div>
              </div>
            </div>

            {/* Testimonial card */}
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-5 space-y-3">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <p className="text-xs text-zinc-300 italic leading-relaxed">
                "Subí mi menú en 10 minutos y en la primera semana más de 80 clientes guardaron la tarjeta en su iPhone. Mis clientes vuelven el doble."
              </p>
              <div className="text-[11px] font-bold text-zinc-400">
                — Carlos R., Dueño de Bistro Roma
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center justify-center gap-4 text-[10px] text-zinc-500 font-medium">
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-400" />
                Seguridad SSL 256 bits
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                Garantía de reembolso
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white text-xs">
          Cargando formulario de registro...
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
