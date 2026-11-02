'use client';

import React from 'react';
import { Coffee, Scissors, Utensils, Star, Gift, Heart, Sparkles, Check } from 'lucide-react';
import { StampIconType } from '@/types';

interface StampGridProps {
  totalStamps: number;
  currentStamps: number;
  iconType: StampIconType;
  accentColor?: string;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onStampClick?: (index: number) => void;
}

export function StampGrid({
  totalStamps,
  currentStamps,
  iconType,
  accentColor = '#f59e0b',
  size = 'md',
  interactive = false,
  onStampClick,
}: StampGridProps) {
  const getIcon = (isFilled: boolean, isLast: boolean) => {
    const iconClass = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-7 h-7' : 'w-5 h-5';

    if (isFilled) {
      return <Check className={`${iconClass} text-white stroke-[3]`} />;
    }

    if (isLast) {
      return <Gift className={`${iconClass} text-amber-300 animate-pulse`} />;
    }

    switch (iconType) {
      case 'coffee':
        return <Coffee className={iconClass} />;
      case 'scissors':
        return <Scissors className={iconClass} />;
      case 'burger':
      case 'pizza':
        return <Utensils className={iconClass} />;
      case 'heart':
        return <Heart className={iconClass} />;
      default:
        return <Star className={iconClass} />;
    }
  };

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-14 h-14 text-base',
  };

  return (
    <div className="grid grid-cols-4 sm:grid-cols-4 gap-2.5 sm:gap-3 justify-items-center my-3">
      {Array.from({ length: totalStamps }).map((_, index) => {
        const isFilled = index < currentStamps;
        const isNext = index === currentStamps;
        const isLast = index === totalStamps - 1;

        return (
          <div
            key={index}
            onClick={() => interactive && onStampClick && onStampClick(index)}
            className={`relative flex flex-col items-center justify-center rounded-2xl transition-all duration-300 ${
              sizeClasses[size]
            } ${
              interactive ? 'cursor-pointer hover:scale-105 active:scale-95' : ''
            } ${
              isFilled
                ? 'shadow-md shadow-emerald-500/20 text-white scale-100'
                : isNext
                ? 'border-2 border-dashed animate-pulse text-zinc-400 bg-zinc-800/50'
                : 'border border-zinc-700/60 bg-zinc-900/60 text-zinc-500'
            }`}
            style={{
              backgroundColor: isFilled ? accentColor : undefined,
              borderColor: isNext ? accentColor : undefined,
            }}
          >
            {/* Number badge */}
            <span
              className={`absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center ${
                isFilled
                  ? 'bg-zinc-900 text-white'
                  : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
              }`}
            >
              {index + 1}
            </span>

            {/* Icon */}
            {getIcon(isFilled, isLast)}

            {/* Sparkle badge for reward */}
            {isLast && !isFilled && (
              <span className="absolute -bottom-1 text-[8px] font-black uppercase tracking-wider text-amber-300 bg-amber-950/80 px-1 rounded-sm border border-amber-600/50">
                Premio
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
