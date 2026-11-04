'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface MenuBeaconLogoProps {
  variant?: 'original' | 'pill' | 'dark' | 'light';
  height?: number; // Visual target height
  showSubtitle?: boolean;
  withLink?: boolean;
  className?: string;
  priority?: boolean;
}

export function MenuBeaconLogo({
  variant = 'pill',
  height = 36,
  showSubtitle = false,
  withLink = true,
  className = '',
  priority = false,
}: MenuBeaconLogoProps) {
  // Original aspect ratio: 1008 / 172 = 5.86
  const width = Math.round(height * 5.86);

  // Variant sources:
  // 'original' or 'pill': 100% original brand colors (dark navy Menu + teal Beacon + navy .app + amber swoop)
  // 'dark': white Menu + teal Beacon + light slate .app
  // 'light': transparent original colors
  const src =
    variant === 'dark'
      ? '/brand/logo-dark.png'
      : '/brand/logo-light.png';

  const isPill = variant === 'pill';

  const imgContent = (
    <Image
      src={src}
      alt="MenuBeacon.app"
      width={width * 2}
      height={height * 2}
      priority={priority}
      className="h-7 sm:h-8 md:h-9 lg:h-10 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]"
    />
  );

  const content = isPill ? (
    <div className={`inline-flex flex-col select-none group min-w-0 ${className}`}>
      <div className="flex items-center bg-white hover:bg-white/95 px-3 sm:px-4 py-1.5 rounded-2xl shadow-lg shadow-black/30 border border-white/20 transition-all">
        {imgContent}
      </div>
      {showSubtitle && (
        <span
          className="text-[9px] sm:text-[10px] text-zinc-400 font-medium tracking-tight mt-1 text-center block truncate"
          suppressHydrationWarning
        >
          Un producto de Markethers
        </span>
      )}
    </div>
  ) : (
    <div className={`inline-flex flex-col select-none group min-w-0 ${className}`}>
      <div className="flex items-center">
        {imgContent}
      </div>
      {showSubtitle && (
        <span
          className="text-[9px] sm:text-[10px] text-zinc-400 font-medium tracking-tight -mt-0.5 block truncate"
          suppressHydrationWarning
        >
          Un producto de Markethers
        </span>
      )}
    </div>
  );

  if (withLink) {
    return (
      <Link
        href="/"
        className="inline-flex items-center focus:outline-none focus:ring-2 focus:ring-emerald-500/50 rounded-2xl min-w-0 shrink-0"
        aria-label="MenuBeacon Inicio"
      >
        {content}
      </Link>
    );
  }

  return content;
}
