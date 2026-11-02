'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { Business, MenuItem } from '@/types';
import {
  Utensils,
  Plus,
  UploadCloud,
  FileText,
  Video,
  Image as ImageIcon,
  Edit2,
  Trash2,
  CheckCircle2,
  ExternalLink,
  Search,
  Eye,
  EyeOff,
  Sparkles,
  X,
  Play,
  Download,
  Layers,
  Check,
  RefreshCw,
  QrCode,
  AlertCircle,
} from 'lucide-react';

interface MenuManagerProps {
  business: Business;
  menuItems: MenuItem[];
  onUpdateBusiness?: (updated: Partial<Business>) => void;
  onUpdateMenuItems?: (items: MenuItem[]) => void;
}

export function MenuManager({
  business,
  menuItems: initialMenuItems,
  onUpdateBusiness,
  onUpdateMenuItems,
}: MenuManagerProps) {
  // Navigation between the two main ways of managing the menu
  const [activeMode, setActiveMode] = useState<'items' | 'pdf'>('items');

  // Menu items state
  const [items, setItems] = useState<MenuItem[]>(initialMenuItems);
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Modal for creating/editing item
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formVideoUrl, setFormVideoUrl] = useState('');
  const [formAvailable, setFormAvailable] = useState(true);
  const [formFeatured, setFormFeatured] = useState(false);
  const [previewVideoModalUrl, setPreviewVideoModalUrl] = useState<string | null>(null);

  // PDF Menu state
  const [pdfUrl, setPdfUrl] = useState<string>(business.menuPdfUrl || '');
  const [pdfName, setPdfName] = useState<string>(business.menuPdfName || 'Carta_Oficial.pdf');
  const [displayMode, setDisplayMode] = useState<'interactive' | 'pdf' | 'both'>(
    business.menuDisplayMode || 'both'
  );
  const [pdfSaveSuccess, setPdfSaveSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  const categories = ['all', ...Array.from(new Set(items.map(m => m.category)))];

  const filteredItems = items.filter(item => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.description.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  // Open modal for new item
  const handleOpenNewModal = () => {
    setEditingItem(null);
    setFormName('');
    setFormCategory(categories[1] || 'Especialidades');
    setFormPrice('');
    setFormDescription('');
    setFormImageUrl('');
    setFormVideoUrl('');
    setFormAvailable(true);
    setFormFeatured(false);
    setIsModalOpen(true);
  };

  // Open modal for editing
  const handleOpenEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormCategory(item.category);
    setFormPrice(item.price.toString());
    setFormDescription(item.description);
    setFormImageUrl(item.imageUrl || '');
    setFormVideoUrl(item.videoUrl || '');
    setFormAvailable(item.available);
    setFormFeatured(Boolean(item.featured));
    setIsModalOpen(true);
  };

  // Handle image upload from computer/phone
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = ev => {
        if (ev.target?.result) {
          setFormImageUrl(ev.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle PDF upload
  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPdfName(file.name);
      const reader = new FileReader();
      reader.onload = ev => {
        if (ev.target?.result) {
          const res = ev.target.result as string;
          setPdfUrl(res);
          setPdfSaveSuccess(true);
          if (onUpdateBusiness) {
            onUpdateBusiness({
              menuPdfUrl: res,
              menuPdfName: file.name,
              menuDisplayMode: displayMode,
            });
          }
          setTimeout(() => setPdfSaveSuccess(false), 3000);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Save Item (Create or Update)
  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPrice) return;

    if (editingItem) {
      // Update
      const updatedList = items.map(it =>
        it.id === editingItem.id
          ? {
              ...it,
              name: formName.trim(),
              category: formCategory.trim() || 'General',
              price: parseFloat(formPrice) || 0,
              description: formDescription.trim(),
              imageUrl: formImageUrl.trim(),
              videoUrl: formVideoUrl.trim(),
              available: formAvailable,
              featured: formFeatured,
            }
          : it
      );
      setItems(updatedList);
      if (onUpdateMenuItems) onUpdateMenuItems(updatedList);
    } else {
      // Create new
      const newItem: MenuItem = {
        id: `menu_${Date.now()}`,
        businessId: business.id,
        name: formName.trim(),
        category: formCategory.trim() || 'General',
        price: parseFloat(formPrice) || 0,
        description: formDescription.trim(),
        imageUrl: formImageUrl.trim(),
        videoUrl: formVideoUrl.trim(),
        available: formAvailable,
        featured: formFeatured,
      };
      const updatedList = [newItem, ...items];
      setItems(updatedList);
      if (onUpdateMenuItems) onUpdateMenuItems(updatedList);
    }

    setIsModalOpen(false);
  };

  // Toggle availability in 1 click
  const handleToggleAvailable = (id: string) => {
    const updatedList = items.map(it =>
      it.id === id ? { ...it, available: !it.available } : it
    );
    setItems(updatedList);
    if (onUpdateMenuItems) onUpdateMenuItems(updatedList);
  };

  // Delete item
  const handleDeleteItem = (id: string) => {
    if (confirm('¿Eliminar este platillo del menú?')) {
      const updatedList = items.filter(it => it.id !== id);
      setItems(updatedList);
      if (onUpdateMenuItems) onUpdateMenuItems(updatedList);
    }
  };

  // Save PDF Settings
  const handleSavePdfSettings = () => {
    setPdfSaveSuccess(true);
    if (onUpdateBusiness) {
      onUpdateBusiness({
        menuPdfUrl: pdfUrl,
        menuPdfName: pdfName,
        menuDisplayMode: displayMode,
      });
    }
    setTimeout(() => setPdfSaveSuccess(false), 3000);
  };

  // Quick preset sample photos
  const sampleFoodPhotos = [
    { label: '☕ Café', url: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=600&q=80' },
    { label: '🍔 Hamburguesa', url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80' },
    { label: '🥑 Desayuno / Toast', url: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80' },
    { label: '🥐 Panadería / Postre', url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80' },
    { label: '🍸 Cóctel / Bebida', url: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=600&q=80' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner: Selector between 2 ways of adding menu */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-amber-100 text-amber-800 text-base">
                🍽️
              </span>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                Gestor de Menú Digital
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Elige cómo deseas administrar tu carta para que tus clientes la vean en su teléfono o mesa.
            </p>
          </div>

          <Link
            href={`/${business.slug}?tab=menu`}
            target="_blank"
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow transition-all shrink-0"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Ver Menú Público en Vivo</span>
          </Link>
        </div>

        {/* 2 Navigation Pills: Items vs PDF */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setActiveMode('items')}
            className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 ${
              activeMode === 'items'
                ? 'bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm'
                : 'bg-slate-50 border-slate-200 hover:bg-slate-100/80 text-slate-600'
            }`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                activeMode === 'items'
                  ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-500/30'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-xs text-slate-900">
                  1. Artículo por Artículo en el Sistema
                </h4>
                {activeMode === 'items' && (
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-200 text-emerald-900">
                    Activo
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                Carga platillos individuales con <strong>fotos de alta resolución, videos de preparación</strong>, precios, ingredientes y control de stock.
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('pdf')}
            className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 ${
              activeMode === 'pdf'
                ? 'bg-amber-50/80 border-amber-500 ring-2 ring-amber-500/20 shadow-sm'
                : 'bg-slate-50 border-slate-200 hover:bg-slate-100/80 text-slate-600'
            }`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                activeMode === 'pdf'
                  ? 'bg-amber-600 text-white font-bold shadow-md shadow-amber-500/30'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-xs text-slate-900">
                  2. Subir Menú Diseñado (PDF / Foto)
                </h4>
                {activeMode === 'pdf' && (
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-amber-200 text-amber-900">
                    Activo
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                Si ya tienes tu carta diseñada en PDF o imagen de imprenta, <strong>súbela directamente</strong> para que tus clientes la hojeen en mesa.
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODE 1: ARTÍCULO POR ARTÍCULO (FOTOS, VIDEOS, PRECIOS)     */}
      {/* ========================================================= */}
      {activeMode === 'items' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
          {/* Controls Bar: Search, Category Filters, New Item Button */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar platillo, ingrediente..."
                value={searchFilter}
                onChange={e => setSearchFilter(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                {items.length} productos ({items.filter(i => i.available).length} disponibles)
              </span>

              <button
                type="button"
                onClick={handleOpenNewModal}
                className="px-4 py-2 bg-[#22c55e] hover:bg-emerald-600 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all hover:scale-105"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Agregar Platillo / Bebida</span>
              </button>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat === 'all' ? 'Todos los Platillos' : cat}
              </button>
            ))}
          </div>

          {/* Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map(item => (
              <div
                key={item.id}
                className={`border rounded-2xl p-4 transition-all flex flex-col justify-between ${
                  item.available
                    ? 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                    : 'bg-slate-50/70 border-slate-200 opacity-60'
                }`}
              >
                <div>
                  {/* Media Banner: Photo & Video Preview Badge */}
                  <div className="relative w-full h-36 rounded-xl overflow-hidden bg-slate-100 mb-3 border border-slate-100">
                    {item.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-1">
                        <ImageIcon className="w-8 h-8 stroke-[1.5]" />
                        <span className="text-[10px]">Sin foto</span>
                      </div>
                    )}

                    {/* Video Badge (clickable to play) */}
                    {item.videoUrl && (
                      <button
                        type="button"
                        onClick={() => setPreviewVideoModalUrl(item.videoUrl || null)}
                        className="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg bg-black/80 hover:bg-black text-white text-[10px] font-bold flex items-center gap-1.5 backdrop-blur-md shadow-md transition-transform hover:scale-105"
                      >
                        <Play className="w-3 h-3 text-emerald-400 fill-emerald-400" />
                        <span>Ver Video</span>
                      </button>
                    )}

                    {/* Stock pill on top-right */}
                    <button
                      type="button"
                      onClick={() => handleToggleAvailable(item.id)}
                      className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold shadow-sm transition-transform hover:scale-105 ${
                        item.available
                          ? 'bg-emerald-500 text-white'
                          : 'bg-red-500 text-white'
                      }`}
                    >
                      {item.available ? 'En Carta' : 'Agotado'}
                    </button>

                    {item.featured && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-400 text-amber-950 shadow-sm flex items-center gap-1">
                        <Sparkles className="w-3 h-3 fill-current" />
                        <span>Top</span>
                      </span>
                    )}
                  </div>

                  {/* Header info */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 leading-tight">
                        {item.name}
                      </h4>
                      <span className="text-[10px] font-semibold text-emerald-600 block mt-0.5">
                        {item.category}
                      </span>
                    </div>
                    <span className="text-base font-black text-slate-900">
                      ${item.price}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                    {item.description || 'Sin descripción detallada.'}
                  </p>
                </div>

                {/* Bottom actions: Edit, Delete, Toggle Availability */}
                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(item)}
                      className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-slate-900 transition-colors"
                      title="Editar platillo"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-1.5 hover:bg-red-50 rounded-lg text-red-500 hover:text-red-700 transition-colors"
                      title="Eliminar platillo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleAvailable(item.id)}
                    className="text-[11px] font-bold text-slate-500 hover:text-slate-900"
                  >
                    {item.available ? 'Marcar agotado' : 'Marcar disponible'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200">
              <Utensils className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <h5 className="font-bold text-sm text-slate-800">No se encontraron platillos</h5>
              <p className="text-xs text-slate-500 mt-0.5">
                Prueba con otro término de búsqueda o agrega un nuevo platillo a tu carta.
              </p>
              <button
                type="button"
                onClick={handleOpenNewModal}
                className="mt-3 px-4 py-2 bg-[#22c55e] text-white text-xs font-bold rounded-xl"
              >
                + Agregar Platillo
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* MODE 2: SUBIR MENÚ DISEÑADO (PDF O FOTO DE CARTA)        */}
      {/* ========================================================= */}
      {activeMode === 'pdf' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-8">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Carga tu Carta en PDF o Imagen Diseñada
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Ideal si ya tienes un archivo diseñado en Illustrator, Canva o imprenta. Tus comensales podrán abrirlo directamente en su teléfono.
            </p>
          </div>

          {/* Drag & Drop Upload Zone */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 space-y-4">
              <div
                onClick={() => pdfInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-amber-500 transition-colors rounded-3xl p-8 text-center cursor-pointer bg-slate-50/70 hover:bg-amber-50/20 space-y-3 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform shadow-inner">
                  <UploadCloud className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">
                    Arrastra aquí tu carta o haz clic para subir
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Formatos soportados: <strong>PDF, JPG, PNG</strong> (hasta 25MB)
                  </p>
                </div>
                <button
                  type="button"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow inline-flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Seleccionar archivo</span>
                </button>
                <input
                  ref={pdfInputRef}
                  type="file"
                  accept=".pdf,image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={handlePdfUpload}
                />
              </div>

              {/* Display mode options */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block">
                  ¿Cómo quieres que lo vean tus comensales en mesa?
                </span>

                <div className="space-y-2 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer p-2 rounded-xl hover:bg-white transition-colors">
                    <input
                      type="radio"
                      name="displayMode"
                      value="both"
                      checked={displayMode === 'both'}
                      onChange={() => setDisplayMode('both')}
                      className="accent-emerald-600"
                    />
                    <div>
                      <strong className="text-slate-900 block font-bold">Ambos (Recomendado)</strong>
                      <span className="text-slate-500 text-[11px]">
                        Pueden ver la carta diseñada en PDF o navegar los productos interactivos para pedir por WhatsApp.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer p-2 rounded-xl hover:bg-white transition-colors">
                    <input
                      type="radio"
                      name="displayMode"
                      value="pdf"
                      checked={displayMode === 'pdf'}
                      onChange={() => setDisplayMode('pdf')}
                      className="accent-emerald-600"
                    />
                    <div>
                      <strong className="text-slate-900 block font-bold">Solo Carta en PDF</strong>
                      <span className="text-slate-500 text-[11px]">
                        Abre directamente el visor de tu carta diseñada sin lista interactiva.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer p-2 rounded-xl hover:bg-white transition-colors">
                    <input
                      type="radio"
                      name="displayMode"
                      value="interactive"
                      checked={displayMode === 'interactive'}
                      onChange={() => setDisplayMode('interactive')}
                      className="accent-emerald-600"
                    />
                    <div>
                      <strong className="text-slate-900 block font-bold">Solo Menú Interactivo</strong>
                      <span className="text-slate-500 text-[11px]">
                        Muestra la lista de productos y carrito de pedidos por WhatsApp.
                      </span>
                    </div>
                  </label>
                </div>

                <button
                  type="button"
                  onClick={handleSavePdfSettings}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow transition-all"
                >
                  Guardar Preferencias de Menú
                </button>
              </div>

              {pdfSaveSuccess && (
                <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-xl text-emerald-900 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>¡Carta y modo de visualización guardados con éxito!</span>
                </div>
              )}
            </div>

            {/* Right: Live Interactive PDF Preview Viewer */}
            <div className="lg:col-span-7 bg-slate-900 text-white rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold truncate max-w-xs">{pdfName}</span>
                </div>
                <div className="flex items-center gap-2">
                  {pdfUrl && (
                    <a
                      href={pdfUrl}
                      download={pdfName}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors"
                    >
                      <Download className="w-3 h-3" />
                      <span>Descargar</span>
                    </a>
                  )}
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                    Listo para mesas
                  </span>
                </div>
              </div>

              {/* Preview frame */}
              <div className="w-full h-[450px] rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center relative">
                {pdfUrl ? (
                  // If it's a PDF or image
                  pdfUrl.startsWith('data:application/pdf') || pdfUrl.endsWith('.pdf') ? (
                    <iframe
                      src={pdfUrl}
                      title="Carta PDF Preview"
                      className="w-full h-full border-none"
                    />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={pdfUrl}
                      alt="Carta Diseñada"
                      className="w-full h-full object-contain"
                    />
                  )
                ) : (
                  <div className="text-center p-6 text-slate-500 space-y-2">
                    <FileText className="w-12 h-12 mx-auto stroke-1 text-slate-600" />
                    <p className="text-xs">Aún no has subido una carta en PDF.</p>
                    <button
                      type="button"
                      onClick={() => pdfInputRef.current?.click()}
                      className="px-3.5 py-1.5 bg-amber-500 text-black text-xs font-bold rounded-xl"
                    >
                      Subir archivo ahora
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Vista previa de comensal en mesa</span>
                <Link
                  href={`/${business.slug}?tab=menu`}
                  target="_blank"
                  className="text-emerald-400 font-bold hover:underline flex items-center gap-1"
                >
                  <span>Probar en vivo como cliente</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: ADD / EDIT ITEM (INCLUYE FOTOS Y VIDEOS)            */}
      {/* ========================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 text-slate-900 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  {editingItem ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </div>
                <h3 className="font-bold text-base text-slate-900">
                  {editingItem ? 'Editar Platillo' : 'Agregar Nuevo Platillo'}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="mt-4 space-y-4">
              {/* Name */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Nombre del Platillo / Bebida *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Hamburguesa Trufada Doble"
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Category & Price */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    Categoría *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Cafés, Platos, Postres"
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    Precio ({business.currency}) *
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    placeholder="Ej: 120"
                    value={formPrice}
                    onChange={e => setFormPrice(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Descripción / Ingredientes
                </label>
                <textarea
                  rows={2}
                  placeholder="Ej: Pan artesanal brioche, carne Angus 180g, queso cheddar fundido y mermelada de tocino."
                  value={formDescription}
                  onChange={e => setFormDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* FOTO DEL PLATILLO */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Foto del Platillo</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[10px] font-bold text-emerald-600 hover:underline"
                  >
                    Subir foto desde tu dispositivo
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </div>

                <input
                  type="url"
                  placeholder="O pega el enlace de la imagen..."
                  value={formImageUrl}
                  onChange={e => setFormImageUrl(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />

                {/* Suggestions */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  <span className="text-[10px] text-slate-400">Sugerir foto:</span>
                  {sampleFoodPhotos.map(sample => (
                    <button
                      key={sample.label}
                      type="button"
                      onClick={() => setFormImageUrl(sample.url)}
                      className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-medium text-slate-600 hover:border-emerald-500 hover:text-emerald-700"
                    >
                      {sample.label}
                    </button>
                  ))}
                </div>

                {formImageUrl && (
                  <div className="relative w-full h-28 rounded-xl overflow-hidden mt-2 border border-slate-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={formImageUrl}
                      alt="Vista previa"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setFormImageUrl('')}
                      className="absolute top-1.5 right-1.5 p-1 bg-black/70 hover:bg-black text-white rounded-full"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              {/* VIDEO DEL PLATILLO (NUEVO) */}
              <div className="p-3.5 bg-blue-50/70 rounded-2xl border border-blue-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-blue-600" />
                    <span>Video del Platillo (Reels / Shorts / MP4)</span>
                  </label>
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                    ¡Vende 2x más!
                  </span>
                </div>
                <p className="text-[10px] text-blue-700 leading-relaxed">
                  Pega el enlace de video de la preparación o humo de tu platillo para despertar el apetito del comensal.
                </p>

                <input
                  type="url"
                  placeholder="https://ejemplo.com/video-hamburguesa.mp4"
                  value={formVideoUrl}
                  onChange={e => setFormVideoUrl(e.target.value)}
                  className="w-full bg-white border border-blue-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />

                {/* Sample video button */}
                <div className="flex items-center gap-2 pt-0.5">
                  <button
                    type="button"
                    onClick={() =>
                      setFormVideoUrl(
                        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
                      )
                    }
                    className="text-[10px] font-bold text-blue-600 hover:underline"
                  >
                    + Usar video de muestra de alta cocina
                  </button>
                  {formVideoUrl && (
                    <button
                      type="button"
                      onClick={() => setFormVideoUrl('')}
                      className="text-[10px] text-red-500 hover:underline ml-auto"
                    >
                      Quitar video
                    </button>
                  )}
                </div>

                {formVideoUrl && (
                  <div className="relative w-full h-32 rounded-xl overflow-hidden mt-2 bg-black border border-blue-200 flex items-center justify-center">
                    <video
                      src={formVideoUrl}
                      controls
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
              </div>

              {/* Switches: Available & Featured */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <label className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formAvailable}
                    onChange={e => setFormAvailable(e.target.checked)}
                    className="w-4 h-4 accent-emerald-600 rounded"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Disponible</span>
                    <span className="text-[10px] text-slate-500">En stock para pedidos</span>
                  </div>
                </label>

                <label className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formFeatured}
                    onChange={e => setFormFeatured(e.target.checked)}
                    className="w-4 h-4 accent-amber-500 rounded"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Platillo Estrella</span>
                    <span className="text-[10px] text-slate-500">Destacado en el menú</span>
                  </div>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#22c55e] hover:bg-emerald-600 text-white font-extrabold text-xs rounded-xl shadow-md shadow-emerald-500/20"
                >
                  {editingItem ? 'Guardar Cambios' : 'Crear Platillo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIDEO PREVIEW MODAL */}
      {previewVideoModalUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-lg w-full p-4 text-white shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-3">
              <span className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                <Video className="w-4 h-4 text-emerald-400" />
                <span>Video del Platillo</span>
              </span>
              <button
                type="button"
                onClick={() => setPreviewVideoModalUrl(null)}
                className="p-1 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="w-full aspect-video rounded-2xl overflow-hidden bg-black flex items-center justify-center">
              <video
                src={previewVideoModalUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
