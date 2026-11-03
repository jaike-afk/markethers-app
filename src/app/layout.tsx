import type { Metadata, Viewport } from 'next';
import { Suspense } from 'react';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { LanguageProvider } from '@/context/LanguageContext';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'MenuBeacon | Plataforma de Fidelización en Apple Wallet & Menú Digital (Un producto de Markethers)',
  description:
    'MenuBeacon (un producto de Markethers): Fidelización para comercios locales. Tarjetas de sellos en Apple Wallet y Google Wallet, menús digitales con QR y base de clientes sin comisiones.',
  icons: {
    icon: '/icon.png',
    apple: '/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased overflow-x-clip max-w-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-zinc-950 text-white overflow-x-clip max-w-full w-full" suppressHydrationWarning>
        <LanguageProvider>
          <Suspense fallback={<div className="h-16 border-b border-zinc-800 bg-zinc-950/80" />}>
            <Navbar />
          </Suspense>
          <main className="flex-1 overflow-x-clip max-w-full w-full">{children}</main>
        </LanguageProvider>
      </body>
    </html>
  );
}
