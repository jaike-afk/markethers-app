'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, Mail, Lock, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { authenticateUser } from '@/lib/auth';
import { MenuBeaconLogo } from '@/components/MenuBeaconLogo';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      const result = authenticateUser(email, password);
      if (!result.success) {
        setError(result.error || 'Credenciales incorrectas');
        setLoading(false);
        return;
      }

      if (result.user?.businessId && typeof window !== 'undefined') {
        localStorage.setItem('markethers_active_business_id', result.user.businessId);
      }

      setLoading(false);
      router.push('/app');
    }, 400);
  };

  const handleUseDemoAccount = () => {
    setEmail('jaikeromero@gmail.com');
    setPassword('password123');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans antialiased flex flex-col justify-between py-12 px-4 sm:px-6">
      {/* Brand Header */}
      <div className="max-w-md w-full mx-auto">
        <div className="flex justify-center mb-8">
          <MenuBeaconLogo variant="pill" height={44} showSubtitle={true} priority />
        </div>

        {/* Card */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-black text-white">Inicia sesión en tu cuenta</h1>
            <p className="text-xs text-zinc-400">
              Accede a tu panel para gestionar tu menú, tarjetas Wallet y clientes.
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-3.5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-2xl text-xs font-semibold flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-zinc-300 block mb-1">
                Correo Electrónico
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="ej. tu@negocio.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-zinc-300">Contraseña</label>
                <a href="#" className="text-[11px] text-emerald-400 hover:underline">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              <input
                type="password"
                required
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#22c55e] hover:bg-emerald-600 text-black font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.01] disabled:opacity-50"
            >
              {loading ? (
                <span>Verificando credenciales...</span>
              ) : (
                <>
                  <span>Entrar a mi Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-zinc-800 text-center text-xs text-zinc-400">
            ¿Aún no tienes cuenta para tu negocio?{' '}
            <Link href="/register" className="text-emerald-400 font-bold hover:underline">
              Empieza gratis 14 días
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-zinc-500">
        MenuBeacon • Un producto de Markethers • Fidelización Wallet & Menú Digital
      </div>
    </div>
  );
}
