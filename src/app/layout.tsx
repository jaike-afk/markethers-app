import type { Metadata } from 'next';
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
  title: 'Markethers | Plataforma de Fidelización en Apple Wallet & Google Wallet',
  description:
    'SaaS de lealtad para comercios locales. Tarjetas de sellos digitales en Apple Wallet y Google Wallet, menús digitales y escáner PWA para cajeros sin necesidad de apps.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-zinc-950 text-white" suppressHydrationWarning>
        <LanguageProvider>
          <Suspense fallback={<div className="h-16 border-b border-zinc-800 bg-zinc-950/80" />}>
            <Navbar />
          </Suspense>
          <div className="flex-1">{children}</div>
        </LanguageProvider>
      </body>
    </html>
  );
}
