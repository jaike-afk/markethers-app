'use client';

import React, { useState } from 'react';
import { Business, Customer, MenuItem, CartItem } from '@/types';
import { AppleWalletCard } from '@/components/AppleWalletCard';
import { CounterQrModal } from '@/components/CounterQrModal';
import {
  CreditCard,
  Utensils,
  MapPin,
  Clock,
  Phone,
  Camera,
  ShoppingBag,
  Sparkles,
  QrCode,
  Plus,
  Minus,
  MessageCircle,
  Share2,
  Check,
  Search,
  Play,
  FileText,
  Download,
  Video,
  X,
} from 'lucide-react';

interface ClientStoreViewProps {
  business: Business;
  initialCustomer?: Customer | null;
  menuItems: MenuItem[];
}

export function ClientStoreView({
  business,
  initialCustomer,
  menuItems,
}: ClientStoreViewProps) {
  const [activeTab, setActiveTab] = useState<'card' | 'menu' | 'info'>('card');
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(
    initialCustomer || null
  );

  // Registration Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [regError, setRegError] = useState('');

  // Cart State for Menu
  const [cart, setCart] = useState<Record<string, number>>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [menuSearch, setMenuSearch] = useState('');
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [customerMenuViewMode, setCustomerMenuViewMode] = useState<'interactive' | 'pdf'>(
    business.menuDisplayMode === 'pdf' ? 'pdf' : 'interactive'
  );
  const [activeVideoModal, setActiveVideoModal] = useState<{ name: string; url: string } | null>(null);

  // Check URL param ?tab=menu on mount
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('tab') === 'menu') {
        setActiveTab('menu');
      }
    }
  }, []);

  // Categories list
  const categories = ['all', ...Array.from(new Set(menuItems.map(m => m.category)))];

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setRegError('Por favor completa tu nombre y número de teléfono');
      return;
    }
    setIsRegistering(true);
    setRegError('');

    try {
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId: business.id,
          name: name.trim(),
          phone: phone.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.customer) {
        setCurrentCustomer(data.customer);
      } else {
        setRegError(data.error || 'Error al activar tu tarjeta');
      }
    } catch (err) {
      console.error(err);
      setRegError('Error de conexión');
    } finally {
      setIsRegistering(false);
    }
  };

  // Cart helpers
  const addToCart = (itemId: string) => {
    setCart(prev => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => {
      const current = prev[itemId] || 0;
      if (current <= 1) {
        const copy = { ...prev };
        delete copy[itemId];
        return copy;
      }
      return { ...prev, [itemId]: current - 1 };
    });
  };

  const totalCartCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const totalCartAmount = Object.entries(cart).reduce((sum, [itemId, qty]) => {
    const item = menuItems.find(m => m.id === itemId);
    return sum + (item ? item.price * qty : 0);
  }, 0);



  const filteredItems = menuItems.filter(item => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      !menuSearch.trim() ||
      item.name.toLowerCase().includes(menuSearch.toLowerCase()) ||
      item.description.toLowerCase().includes(menuSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-24">
      {/* Hero Cover Banner */}
      <div className="relative h-44 sm:h-56 w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={business.coverUrl}
          alt={business.name}
          className="w-full h-full object-cover brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={() => setIsQrModalOpen(true)}
            className="p-2.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-amber-400 border border-white/10 transition-transform active:scale-95"
            title="Ver stand de mostrador para imprimir"
          >
            <QrCode className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Business Profile Info Header */}
      <div className="max-w-md mx-auto px-4 -mt-14 relative z-10 text-center">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-zinc-900 border-2 border-zinc-700 shadow-2xl flex items-center justify-center text-4xl mb-3">
          {business.logoUrl}
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          {business.name}
        </h1>
        <p className="text-xs text-amber-400 font-medium mt-0.5">{business.tagline}</p>
        <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto leading-relaxed">
          {business.description}
        </p>

        {/* Quick Contact Icons */}
        <div className="flex items-center justify-center gap-3 mt-3">
          {business.whatsapp && (
            <a
              href={`https://wa.me/${business.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors flex items-center gap-1.5 text-xs font-semibold"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          )}
          {business.instagram && (
            <a
              href={`https://instagram.com/${business.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20 hover:bg-pink-500/20 transition-colors flex items-center gap-1.5 text-xs font-semibold"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>@{business.instagram}</span>
            </a>
          )}
        </div>

        {/* Navigation Tabs (InfoLink Style) */}
        <div className="flex p-1 bg-zinc-900/90 rounded-2xl border border-zinc-800 mt-5 shadow-lg">
          <button
            onClick={() => setActiveTab('card')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'card'
                ? 'bg-amber-500 text-zinc-950 shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Tarjeta Wallet</span>
          </button>

          <button
            onClick={() => setActiveTab('menu')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'menu'
                ? 'bg-amber-500 text-zinc-950 shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>Menú & Pedidos</span>
            {totalCartCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-zinc-950 text-white text-[10px] flex items-center justify-center font-bold">
                {totalCartCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('info')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'info'
                ? 'bg-amber-500 text-zinc-950 shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Info & Horarios</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-md mx-auto px-4 mt-6">
        {/* TAB 1: LOYALTY CARD */}
        {activeTab === 'card' && (
          <div>
            {currentCustomer ? (
              <div className="space-y-4">
                <AppleWalletCard business={business} customer={currentCustomer} />
                <div className="text-center pt-2">
                  <button
                    onClick={() => setCurrentCustomer(null)}
                    className="text-[11px] text-zinc-500 hover:text-zinc-300 underline"
                  >
                    ¿No eres {currentCustomer.name}? Cambiar o activar otra tarjeta
                  </button>
                </div>
              </div>
            ) : (
              /* Registration Form for New Customer */
              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl">
                <div className="text-center mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-2 border border-amber-500/20">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Activa tu Tarjeta Digital</h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Guárdala en tu Apple Wallet o Google Wallet y acumula sellos en cada visita.
                  </p>

                  <div className="mt-3 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 font-semibold flex items-center justify-center gap-1.5">
                    <span>🎁 Regalo de bienvenida:</span>
                    <strong className="text-white">+1 Sello de cortesía al activar</strong>
                  </div>
                </div>

                <form onSubmit={handleRegister} className="space-y-3.5">
                  <div>
                    <label className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider block mb-1">
                      Nombre Completo
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Daniel Morales"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      required
                      className="w-full bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider block mb-1">
                      WhatsApp / Celular
                    </label>
                    <input
                      type="tel"
                      placeholder="Ej: +52 55 1234 5678"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      required
                      className="w-full bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  {regError && (
                    <div className="text-xs text-red-400 bg-red-950/40 p-2.5 rounded-xl border border-red-900/50">
                      {regError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isRegistering}
                    className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-extrabold text-sm rounded-xl transition-all shadow-lg shadow-amber-500/20 active:scale-[0.99] flex items-center justify-center gap-2"
                  >
                    {isRegistering ? (
                      <span>Generando tu Pase...</span>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4" />
                        <span>Obtener mi Tarjeta Gratis</span>
                      </>
                    )}
                  </button>

                  <p className="text-[10px] text-zinc-500 text-center mt-2">
                    Sin descargas ni registros largos. 100% integrado a tu teléfono.
                  </p>
                </form>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: DIGITAL MENU & WHATSAPP ORDERS */}
        {activeTab === 'menu' && (
          <div className="space-y-4">
            {/* Top Mode Switcher if PDF is uploaded */}
            {business.menuPdfUrl && business.menuDisplayMode !== 'interactive' && (
              <div className="flex bg-zinc-900 border border-zinc-800 rounded-2xl p-1 gap-1">
                <button
                  type="button"
                  onClick={() => setCustomerMenuViewMode('interactive')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    customerMenuViewMode === 'interactive'
                      ? 'bg-amber-500 text-zinc-950 shadow-md font-extrabold'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Utensils className="w-3.5 h-3.5" />
                  <span>Carta Interactiva</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCustomerMenuViewMode('pdf')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    customerMenuViewMode === 'pdf'
                      ? 'bg-amber-500 text-zinc-950 shadow-md font-extrabold'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Ver Carta en PDF</span>
                </button>
              </div>
            )}

            {/* IF PDF VIEW MODE IS ACTIVE */}
            {customerMenuViewMode === 'pdf' && business.menuPdfUrl ? (
              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold text-white truncate max-w-[200px]">
                      {business.menuPdfName || 'Carta Oficial'}
                    </span>
                  </div>
                  <a
                    href={business.menuPdfUrl}
                    download={business.menuPdfName || 'carta.pdf'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs font-bold flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Descargar</span>
                  </a>
                </div>

                {/* PDF Frame */}
                <div className="w-full h-[520px] rounded-2xl bg-zinc-950 border border-zinc-800 overflow-hidden flex items-center justify-center">
                  {business.menuPdfUrl.endsWith('.pdf') ||
                  business.menuPdfUrl.startsWith('data:application/pdf') ? (
                    <iframe
                      src={business.menuPdfUrl}
                      title="Carta PDF"
                      className="w-full h-full border-none"
                    />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={business.menuPdfUrl}
                      alt="Carta Diseñada"
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => setActiveTab('card')}
                    className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Guardar Tarjeta Wallet & Sumar Sellos</span>
                  </button>
                  {business.phone && (
                    <a
                      href={`tel:${business.phone}`}
                      className="py-3 px-4 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2"
                    >
                      <Phone className="w-4 h-4 text-emerald-400" />
                      <span>Llamar al Local</span>
                    </a>
                  )}
                </div>
              </div>
            ) : (
              /* INTERACTIVE ITEM-BY-ITEM MENU */
              <>
                {/* Search Input for Menu */}
                <div className="relative">
                  <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Buscar platillo, bebida o ingrediente..."
                    value={menuSearch}
                    onChange={e => setMenuSearch(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                {/* Category pills */}
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                        selectedCategory === cat
                          ? 'bg-amber-500 text-zinc-950'
                          : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                      }`}
                    >
                      {cat === 'all' ? 'Todos' : cat}
                    </button>
                  ))}
                </div>

                {/* Menu Items List */}
                <div className="space-y-3">
                  {filteredItems.map(item => {
                    const qty = cart[item.id] || 0;
                    const isOutOfStock = !item.available;

                    return (
                      <div
                        key={item.id}
                        className={`bg-zinc-900 border rounded-2xl p-3.5 flex gap-3.5 items-center justify-between transition-colors ${
                          isOutOfStock ? 'border-zinc-850 opacity-60' : 'border-zinc-800 hover:border-zinc-700'
                        }`}
                      >
                        {item.imageUrl && (
                          <div className="relative shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-16 h-16 rounded-xl object-cover"
                            />
                            {/* Video Pill on Image */}
                            {item.videoUrl && (
                              <button
                                type="button"
                                onClick={() =>
                                  setActiveVideoModal({
                                    name: item.name,
                                    url: item.videoUrl!,
                                  })
                                }
                                className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/80 hover:bg-black text-white text-[9px] font-bold flex items-center gap-1 shadow"
                                title="Ver video del plato"
                              >
                                <Play className="w-2.5 h-2.5 text-emerald-400 fill-emerald-400" />
                                <span>Video</span>
                              </button>
                            )}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-bold text-sm text-white truncate">{item.name}</h4>
                            {item.featured && (
                              <span className="text-[9px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded-md border border-amber-500/30">
                                Top
                              </span>
                            )}
                            {isOutOfStock && (
                              <span className="text-[9px] font-bold uppercase tracking-wider bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded-md border border-red-500/30">
                                Agotado
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-zinc-400 line-clamp-2 mt-0.5">
                            {item.description}
                          </p>

                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm font-extrabold text-amber-400">
                              {business.currency}
                              {item.price}
                            </span>

                            {item.videoUrl && !item.imageUrl && (
                              <button
                                type="button"
                                onClick={() =>
                                  setActiveVideoModal({
                                    name: item.name,
                                    url: item.videoUrl!,
                                  })
                                }
                                className="text-[10px] text-emerald-400 hover:underline flex items-center gap-1 font-bold"
                              >
                                <Play className="w-2.5 h-2.5 fill-current" />
                                <span>Ver video</span>
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Quantity controls */}
                        {!isOutOfStock ? (
                          <div className="flex items-center gap-1.5 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
                            {qty > 0 && (
                              <>
                                <button
                                  onClick={() => removeFromCart(item.id)}
                                  className="p-1.5 hover:bg-zinc-800 text-zinc-300 rounded-lg transition-colors"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="text-xs font-bold px-1 text-white">{qty}</span>
                              </>
                            )}
                            <button
                              onClick={() => addToCart(item.id)}
                              className="p-1.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 rounded-lg transition-colors font-bold"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] text-zinc-500 font-medium px-2 py-1 bg-zinc-950 rounded-lg border border-zinc-800">
                            No disponible
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* Sticky Table Order Summary Bar when items selected */}
            {totalCartCount > 0 && customerMenuViewMode === 'interactive' && (
              <div className="fixed bottom-4 left-4 right-4 max-w-md mx-auto z-40">
                <div className="bg-zinc-900 border border-amber-500/50 rounded-2xl p-3.5 shadow-2xl flex items-center justify-between backdrop-blur-xl">
                  <div>
                    <span className="text-[10px] text-zinc-400 uppercase font-bold block">
                      {totalCartCount} platillo(s) seleccionados
                    </span>
                    <span className="text-base font-black text-amber-400">
                      Total estimado: {business.currency}
                      {totalCartAmount}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCart({})}
                      className="py-2 px-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white font-bold text-xs rounded-xl transition-all"
                      title="Limpiar selección"
                    >
                      Limpiar
                    </button>
                    <button
                      onClick={() => setActiveTab('card')}
                      className="py-2.5 px-3.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all active:scale-95"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Sumar Sellos</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: BUSINESS INFO & HOURS */}
        {activeTab === 'info' && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-5 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">
                Ubicación & Dirección
              </span>
              <div className="flex items-start gap-2 text-zinc-200">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  {business.address}, {business.city}
                </span>
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">
                Horario de Atención
              </span>
              <div className="space-y-1.5 text-zinc-300">
                <div className="flex justify-between">
                  <span>Lunes a Viernes</span>
                  <span className="font-semibold text-white">08:00 AM – 09:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sábados y Domingos</span>
                  <span className="font-semibold text-white">09:00 AM – 10:00 PM</span>
                </div>
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">
                Canales de Atención
              </span>
              <div className="space-y-2">
                <a
                  href={`tel:${business.phone}`}
                  className="flex items-center gap-2 p-2.5 bg-zinc-950 rounded-xl hover:bg-zinc-800 text-zinc-200 transition-colors"
                >
                  <Phone className="w-4 h-4 text-amber-400" />
                  <span>{business.phone}</span>
                </a>
                <a
                  href={`https://wa.me/${business.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2.5 bg-zinc-950 rounded-xl hover:bg-zinc-800 text-emerald-400 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat Directo por WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Video Preview Modal */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-sm w-full p-4 text-white shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-3">
              <span className="text-xs font-bold text-zinc-300 flex items-center gap-1.5 truncate">
                <Video className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="truncate">{activeVideoModal.name}</span>
              </span>
              <button
                type="button"
                onClick={() => setActiveVideoModal(null)}
                className="p-1 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="w-full aspect-video rounded-2xl overflow-hidden bg-black flex items-center justify-center">
              <video
                src={activeVideoModal.url}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}

      {/* Printable Counter QR Modal */}
      <CounterQrModal
        business={business}
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
      />
    </div>
  );
}
