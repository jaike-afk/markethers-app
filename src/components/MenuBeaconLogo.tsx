'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface MenuBeaconLogoProps {
  variant?: 'dark' | 'light' | 'original';
  height?: number; // Visual height in pixels, e.g. 26, 30, 34, 40
  showSubtitle?: boolean;
  withLink?: boolean;
  className?: string;
  priority?: boolean;
}

export function MenuBeaconLogo({
  variant = 'dark',
  height = 28,
  showSubtitle = true,
  withLink = true,
  className = '',
  priority = false,
}: MenuBeaconLogoProps) {
  // Original aspect ratio: 1008 / 172 = 5.86
  const width = Math.round(height * 5.86);

  const src =
    variant === 'light'
      ? '/brand/logo-light.png'
      : variant === 'original'
      ? '/brand/logo-original.png'
      : '/brand/logo-dark.png';

  const content = (
    <div className={`inline-flex flex-col select-none group min-w-0 ${className}`}>
      <div className="flex items-center">
        <Image
          src={src}
          alt="MenuBeacon.app"
          width={width * 2}
          height={height * 2}
          priority={priority}
          className="h-6 sm:h-7 md:h-8 w-auto object-contain transition-all duration-200 group-hover:brightness-110"
        />
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
        className="inline-flex items-center focus:outline-none focus:ring-2 focus:ring-emerald-500/50 rounded-lg min-w-0"
        aria-label="MenuBeacon Inicio"
      >
        {content}
      </Link>
    );
  }

  return content;
}
