'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Business, Customer, MenuItem, StampTransaction } from '@/types';
import { AppleWalletCard } from '@/components/AppleWalletCard';
import { CounterQrModal } from '@/components/CounterQrModal';
import { MenuManager } from '@/components/MenuManager';
import {
  Users,
  CreditCard,
  Sparkles,
  TrendingUp,
  Gift,
  QrCode,
  Search,
  MessageCircle,
  ExternalLink,
  Plus,
  Palette,
  Utensils,
  History,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Save,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Image as ImageIcon,
  X,
  Download,
  Phone,
} from 'lucide-react';

interface ClientDashboardViewProps {
  initialBusinesses: Business[];
  initialCustomers: Customer[];
  initialMenuItems: MenuItem[];
  initialTransactions: StampTransaction[];
}

export function ClientDashboardView({
  initialBusinesses,
  initialCustomers,
  initialMenuItems,
  initialTransactions,
}: ClientDashboardViewProps) {
  const [businesses, setBusinesses] = useState<Business[]>(initialBusinesses);
  const [selectedBusinessId, setSelectedBusinessId] = useState<string>(initialBusinesses[0].id);
  const [activeTab, setActiveTab] = useState<'crm' | 'designer' | 'menu' | 'transactions'>('crm');
  const [searchQuery, setSearchQuery] = useState('');
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Menu State
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);

  const business = businesses.find(b => b.id === selectedBusinessId) || businesses[0];
  const customers = initialCustomers.filter(c => c.businessId === business.id);
  const currentBusinessMenuItems = menuItems.filter(m => m.businessId === business.id);
  const transactions = initialTransactions.filter(t => t.businessId === business.id);

  // Card Designer Form State
  const [designerConfig, setDesignerConfig] = useState(business.loyaltyConfig);

  const handleBusinessChange = (id: string) => {
    setSelectedBusinessId(id);
    const b = businesses.find(x => x.id === id);
    if (b) {
      setDesignerConfig(b.loyaltyConfig);
    }
  };

  const handleSaveCardConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setBusinesses(prev =>
      prev.map(b => (b.id === business.id ? { ...b, loyaltyConfig: designerConfig } : b))
    );
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleExportCSV = () => {
    const headers = ['Nombre', 'Telefono', 'Email', 'Codigo Wallet', 'Sellos Actuales', 'Total Visitas', 'Fecha Registro'];
    const rows = customers.map(c => [
      `"${c.name}"`,
      `"${c.phone}"`,
      `"${c.email || ''}"`,
      `"${c.qrCodeToken}"`,
      c.currentStamps,
      c.totalVisits,
      `"${c.createdAt || new Date().toISOString()}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `base_datos_clientes_${business.slug}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredCustomers = customers.filter(
    c =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.qrCodeToken.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sample photo presets for quick testing
  const sampleImages = [
    { label: '☕ Café Especial', url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80' },
    { label: '🥐 Croissant', url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=400&q=80' },
    { label: '🥑 Avocado Toast', url: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=400&q=80' },
    { label: '🍔 Burger', url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80' },
    { label: '🍰 Postre', url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=400&q=80' },
  ];

  // Sample customer for live designer preview
  const previewCustomer: Customer = {
    id: 'preview_1',
    businessId: business.id,
    name: 'Cliente Ejemplo',
    phone: '+52 55 1234 5678',
    qrCodeToken: `PREVIEW-${business.slug.substring(0, 4).toUpperCase()}`,
    currentStamps: Math.min(designerConfig.totalStamps - 1, 5),
    totalVisits: 7,
    rewardsEarned: 1,
    rewardsRedeemed: 1,
    points: 70,
    createdAt: '2026-11-01T10:00:00Z',
    lastVisitAt: '2026-11-01T12:00:00Z',
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-20">
      {/* Top Header */}
      <div className="border-b border-zinc-800 bg-zinc-900/60 backdrop-blur-md px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl p-2 rounded-2xl bg-zinc-800 border border-zinc-700">
              {business.logoUrl}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-white tracking-tight">{business.name}</h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Plan Pro Activo
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Dashboard de Fidelidad, CRM & Menú Digital MenuBeacon • Un producto de Markethers
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Store Switcher */}
            <select
              value={selectedBusinessId}
              onChange={e => handleBusinessChange(e.target.value)}
              className="bg-zinc-800 border border-zinc-700 text-xs rounded-xl px-3 py-2 text-zinc-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              {businesses.map(b => (
                <option key={b.id} value={b.id}>
                  {b.logoUrl} {b.name}
                </option>
              ))}
            </select>

            <button
              onClick={() => setIsQrModalOpen(true)}
              className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 border border-zinc-700 transition-colors"
            >
              <QrCode className="w-4 h-4 text-amber-400" />
              <span>Stand Mostrador</span>
            </button>

            <Link
              href={`/${business.slug}`}
              target="_blank"
              className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Ver Web Cliente</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 space-y-6">
        {/* KPI METRIC CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-zinc-900 border border-zinc-800/80 rounded-2xl p-4 sm:p-5">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-xs font-semibold">Socios Activos</span>
              <Users className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-white">{customers.length * 18 + 42}</div>
            <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> +24% este mes
            </span>
          </div>

          <div className="bg-zinc-900 border border-zinc-800/80 rounded-2xl p-4 sm:p-5">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-xs font-semibold">En Apple/Google Wallet</span>
              <Smartphone className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-black text-white">{customers.length * 15 + 36}</div>
            <span className="text-[10px] text-zinc-400 font-medium mt-1 block">
              88% tasa de instalación
            </span>
          </div>

          <div className="bg-zinc-900 border border-zinc-800/80 rounded-2xl p-4 sm:p-5">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-xs font-semibold">Sellos Entregados</span>
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-white">{customers.length * 48 + 120}</div>
            <span className="text-[10px] text-zinc-400 font-medium mt-1 block">
              Promedio 3.4 sellos/cliente
            </span>
          </div>

          <div className="bg-zinc-900 border border-zinc-800/80 rounded-2xl p-4 sm:p-5">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-xs font-semibold">Premios Canjeados</span>
              <Gift className="w-4 h-4 text-pink-400" />
            </div>
            <div className="text-2xl font-black text-white">{customers.length * 4 + 12}</div>
            <span className="text-[10px] text-emerald-400 font-medium mt-1 block">
              100% clientes fidelizados
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-zinc-800 gap-2 sm:gap-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('crm')}
            className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'crm'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Clientes & CRM ({customers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('designer')}
            className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'designer'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Diseñador de Tarjeta Wallet</span>
          </button>

          <button
            onClick={() => setActiveTab('menu')}
            className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'menu'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <Utensils className="w-4 h-4" />
            <span>Menú Digital & Pedidos ({currentBusinessMenuItems.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('transactions')}
            className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'transactions'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Historial de Escaneos</span>
          </button>
        </div>

        {/* TAB 1: CRM & CUSTOMERS */}
        {activeTab === 'crm' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar por nombre, teléfono o código..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-zinc-400">
                  Total socios: <strong className="text-white">{filteredCustomers.length}</strong>
                </span>
                <button
                  onClick={handleExportCSV}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
                  title="Descargar base de datos completa en CSV"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>Exportar CSV</span>
                </button>
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-950/60 text-zinc-400 uppercase text-[10px] tracking-wider border-b border-zinc-800">
                    <tr>
                      <th className="py-3 px-4 font-bold">Cliente</th>
                      <th className="py-3 px-4 font-bold">Teléfono / Móvil</th>
                      <th className="py-3 px-4 font-bold">Tarjeta ID</th>
                      <th className="py-3 px-4 font-bold">Sellos Actuales</th>
                      <th className="py-3 px-4 font-bold">Visitas</th>
                      <th className="py-3 px-4 font-bold">Estado</th>
                      <th className="py-3 px-4 font-bold text-right">Contacto</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/80">
                    {filteredCustomers.map(customer => {
                      const isReady = customer.currentStamps >= business.loyaltyConfig.totalStamps;
                      const cleanPhone = customer.phone.replace(/\D/g, '');

                      return (
                        <tr key={customer.id} className="hover:bg-zinc-800/40 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-xs">
                              {customer.name[0]}
                            </div>
                            <span>{customer.name}</span>
                          </td>
                          <td className="py-3.5 px-4 text-zinc-300 font-mono text-[11px]">
                            {customer.phone}
                          </td>
                          <td className="py-3.5 px-4 text-zinc-400 font-mono text-[11px]">
                            {customer.qrCodeToken}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-extrabold text-amber-400">
                              {customer.currentStamps}
                            </span>
                            <span className="text-zinc-500">
                              {' '}
                              / {business.loyaltyConfig.totalStamps}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-zinc-300 font-semibold">
                            {customer.totalVisits}
                          </td>
                          <td className="py-3.5 px-4">
                            {isReady ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                🎁 Premio Listo
                              </span>
                            ) : customer.totalVisits >= 5 ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                                ⭐ Cliente VIP
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-800 text-zinc-400">
                                Activo
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-right flex items-center justify-end gap-1.5">
                            <a
                              href={`tel:${customer.phone}`}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold text-[11px] transition-colors"
                              title="Llamar al cliente"
                            >
                              <Phone className="w-3 h-3 text-amber-400" />
                              <span>Llamar</span>
                            </a>
                            <a
                              href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                                `¡Hola ${customer.name}! 👋 En ${business.name} queremos recordarte que tienes ${customer.currentStamps} sellos acumulados. ¡Ven hoy a sumar más!`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-semibold text-[11px] transition-colors border border-emerald-500/20"
                            >
                              <MessageCircle className="w-3 h-3" />
                              <span>Mensaje</span>
                            </a>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LIVE CARD DESIGNER */}
        {activeTab === 'designer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="font-bold text-base text-white">Configuración del Programa</h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Personaliza cómo luce tu tarjeta en Apple Wallet y Google Wallet.
                </p>
              </div>

              {saveSuccess && (
                <div className="p-3 bg-emerald-950/60 border border-emerald-800/80 rounded-2xl text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>¡Tarjeta de lealtad actualizada y sincronizada en tiempo real!</span>
                </div>
              )}

              <form onSubmit={handleSaveCardConfig} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1.5">
                    Número de Sellos para Recompensa
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[5, 6, 8, 10].map(num => (
                      <button
                        key={num}
                        type="button"
                        onClick={() =>
                          setDesignerConfig(prev => ({ ...prev, totalStamps: num }))
                        }
                        className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                          designerConfig.totalStamps === num
                            ? 'bg-amber-500 text-black border-amber-500 shadow-md'
                            : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
                        }`}
                      >
                        {num} Sellos
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1.5">
                    Nombre del Premio
                  </label>
                  <input
                    type="text"
                    value={designerConfig.rewardTitle}
                    onChange={e =>
                      setDesignerConfig(prev => ({ ...prev, rewardTitle: e.target.value }))
                    }
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    placeholder="Ej: 1 Café de especialidad gratis"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1.5">
                    Ícono del Sello
                  </label>
                  <div className="grid grid-cols-4 gap-2 text-xs font-medium">
                    {[
                      { id: 'coffee', label: '☕ Café' },
                      { id: 'scissors', label: '💈 Barbería' },
                      { id: 'burger', label: '🍔 Comida' },
                      { id: 'star', label: '⭐ Estrella' },
                    ].map(item => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() =>
                          setDesignerConfig(prev => ({
                            ...prev,
                            stampIcon: item.id as any,
                          }))
                        }
                        className={`py-2 px-2 text-center rounded-xl border transition-all text-xs ${
                          designerConfig.stampIcon === item.id
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500 font-bold'
                            : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1.5">
                    Color de Fondo de la Tarjeta
                  </label>
                  <div className="flex items-center gap-2">
                    {['#1c1917', '#0f172a', '#7f1d1d', '#14532d', '#3b0764'].map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() =>
                          setDesignerConfig(prev => ({ ...prev, cardBgColor: color }))
                        }
                        className={`w-8 h-8 rounded-full border-2 transition-transform ${
                          designerConfig.cardBgColor === color
                            ? 'border-white scale-110 shadow-lg'
                            : 'border-transparent hover:scale-105'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                    <input
                      type="color"
                      value={designerConfig.cardBgColor}
                      onChange={e =>
                        setDesignerConfig(prev => ({ ...prev, cardBgColor: e.target.value }))
                      }
                      className="w-8 h-8 rounded-full bg-transparent border-0 cursor-pointer"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1.5">
                    Color de Acento / Sellos
                  </label>
                  <div className="flex items-center gap-2">
                    {['#f59e0b', '#38bdf8', '#10b981', '#ec4899', '#8b5cf6'].map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() =>
                          setDesignerConfig(prev => ({ ...prev, accentColor: color }))
                        }
                        className={`w-8 h-8 rounded-full border-2 transition-transform ${
                          designerConfig.accentColor === color
                            ? 'border-white scale-110 shadow-lg'
                            : 'border-transparent hover:scale-105'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1.5">
                    Términos y Condiciones (Reverso del Pase)
                  </label>
                  <textarea
                    rows={2}
                    value={designerConfig.terms}
                    onChange={e =>
                      setDesignerConfig(prev => ({ ...prev, terms: e.target.value }))
                    }
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all active:scale-[0.99]"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar y Actualizar Wallets</span>
                </button>
              </form>
            </div>

            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="text-center mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
                  Vista Previa en Vivo
                </span>
                <span className="text-[11px] text-zinc-500">
                  Así verán la tarjeta tus clientes en su iPhone y Android
                </span>
              </div>

              <div className="w-full max-w-sm">
                <AppleWalletCard
                  business={{
                    ...business,
                    loyaltyConfig: designerConfig,
                  }}
                  customer={previewCustomer}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: COMPLETE MENU MANAGER */}
        {activeTab === 'menu' && (
          <MenuManager
            business={business}
            menuItems={currentBusinessMenuItems}
            onUpdateBusiness={updated => {
              setBusinesses(prev =>
                prev.map(b => (b.id === business.id ? { ...b, ...updated } : b))
              );
            }}
            onUpdateMenuItems={updated => {
              setMenuItems(prev => [
                ...prev.filter(m => m.businessId !== business.id),
                ...updated,
              ]);
            }}
          />
        )}

        {/* TAB 4: TRANSACTIONS LOG */}
        {activeTab === 'transactions' && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
              <h3 className="font-bold text-sm text-white">Registro de Actividad en Caja</h3>
              <span className="text-xs text-zinc-400">Tiempo real</span>
            </div>
            <div className="divide-y divide-zinc-800/80 text-xs">
              {transactions.map(tx => (
                <div
                  key={tx.id}
                  className="p-4 flex items-center justify-between hover:bg-zinc-800/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
                        tx.type === 'REWARD_REDEEMED'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {tx.type === 'REWARD_REDEEMED' ? (
                        <Gift className="w-4 h-4" />
                      ) : (
                        <Plus className="w-4 h-4 stroke-[3]" />
                      )}
                    </div>
                    <div>
                      <span className="font-bold text-white block">{tx.customerName}</span>
                      <span className="text-[11px] text-zinc-400">{tx.notes}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`font-black text-xs block ${
                        tx.stampsChanged > 0 ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                    >
                      {tx.stampsChanged > 0 ? `+${tx.stampsChanged} sello` : 'Premio Canjeado'}
                    </span>
                    <span className="text-[10px] text-zinc-500">
                      {tx.createdAt.split('T')[1]?.substring(0, 5) || '10:00'} hrs
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Stand QR Modal */}
      <CounterQrModal
        business={business}
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
      />
    </div>
  );
}
