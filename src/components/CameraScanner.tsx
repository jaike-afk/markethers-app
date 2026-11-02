'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Camera, CameraOff, Keyboard, Volume2, AlertCircle } from 'lucide-react';

interface CameraScannerProps {
  onScan: (decodedText: string) => void;
  isScanningActive: boolean;
}

export function CameraScanner({ onScan, isScanningActive }: CameraScannerProps) {
  const [manualCode, setManualCode] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const scannerRef = useRef<any>(null);
  const isTransitioningRef = useRef(false);
  const elementId = 'html5qr-code-full-region';

  // Audio beep generator using Web Audio API
  const playBeep = useCallback(() => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // 880Hz
      gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.15);

      if (navigator.vibrate) {
        navigator.vibrate([80]);
      }
    } catch (e) {
      console.warn('Audio feedback failed:', e);
    }
  }, []);

  const stopScanner = useCallback(async () => {
    if (isTransitioningRef.current) return;
    if (scannerRef.current) {
      try {
        isTransitioningRef.current = true;
        // Html5Qrcode.getState() === 2 is SCANNING
        if (scannerRef.current.isScanning) {
          await scannerRef.current.stop();
        }
      } catch (err) {
        // Silently ignore already stopped state
      } finally {
        isTransitioningRef.current = false;
        setCameraActive(false);
      }
    }
  }, []);

  const startScanner = useCallback(async () => {
    if (isTransitioningRef.current) return;
    setCameraError(null);

    try {
      isTransitioningRef.current = true;
      const { Html5Qrcode } = await import('html5-qrcode');

      // Ensure previous scanner instance is cleared
      if (scannerRef.current) {
        try {
          if (scannerRef.current.isScanning) {
            await scannerRef.current.stop();
          }
          await scannerRef.current.clear();
        } catch (e) {
          // ignore
        }
      }

      scannerRef.current = new Html5Qrcode(elementId);

      await scannerRef.current.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        (decodedText: string) => {
          playBeep();
          onScan(decodedText);
        },
        () => {
          // Ignore periodic frame scanning misses
        }
      );
      setCameraActive(true);
    } catch (err: any) {
      // Don't show transition warnings as errors
      const msg = err?.message || String(err);
      if (!msg.includes('Cannot transition')) {
        setCameraError(
          'No se pudo acceder a la cámara o no hay permisos. Puedes ingresar el código manual abajo.'
        );
      }
      setCameraActive(false);
    } finally {
      isTransitioningRef.current = false;
    }
  }, [onScan, playBeep]);

  // Clean cleanup on unmount
  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        try {
          if (scannerRef.current.isScanning) {
            scannerRef.current.stop().catch(() => {});
          }
        } catch (e) {}
      }
    };
  }, []);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    playBeep();
    onScan(manualCode.trim().toUpperCase());
    setManualCode('');
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto">
      {/* Scanner Viewport */}
      <div className="relative w-full aspect-square bg-zinc-950 rounded-3xl overflow-hidden border-2 border-zinc-800 shadow-2xl flex flex-col items-center justify-center">
        <div id={elementId} className="w-full h-full object-cover" />

        {/* Scanning Target Crosshair Overlay */}
        {cameraActive && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-64 h-64 border-2 border-dashed border-emerald-400/80 rounded-2xl relative animate-pulse">
              <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-emerald-400" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-emerald-400" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-emerald-400" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-emerald-400" />
            </div>
            <div className="absolute bottom-6 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-[11px] text-emerald-300 font-medium">
              Apunta la cámara al QR de la Wallet del cliente
            </div>
          </div>
        )}

        {/* Fallback when camera not running */}
        {!cameraActive && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-zinc-400 bg-zinc-900/90">
            {cameraError ? (
              <div className="space-y-3">
                <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
                <p className="text-xs text-zinc-300 max-w-xs">{cameraError}</p>
                <button
                  onClick={startScanner}
                  className="px-4 py-2 bg-emerald-500 text-black font-bold text-xs rounded-xl shadow"
                >
                  Reintentar Cámara
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <Camera className="w-12 h-12 text-zinc-600 mx-auto" />
                <p className="text-xs text-zinc-400">
                  Presiona el botón para encender la cámara del escáner
                </p>
                <button
                  onClick={startScanner}
                  className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
                >
                  Encender Cámara
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Camera Toggle Button */}
      <div className="flex gap-2 w-full mt-3">
        {cameraActive ? (
          <button
            onClick={stopScanner}
            className="flex-1 py-2 px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <CameraOff className="w-3.5 h-3.5" />
            <span>Pausar Cámara</span>
          </button>
        ) : (
          <button
            onClick={startScanner}
            className="flex-1 py-2 px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Activar Cámara</span>
          </button>
        )}
      </div>

      {/* Manual Code Input Option */}
      <form onSubmit={handleManualSubmit} className="w-full mt-4">
        <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-1.5 font-medium">
          <Keyboard className="w-3.5 h-3.5 text-zinc-500" />
          <span>Ingresar código de tarjeta manualmente:</span>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Ej: CARD-AROMA-88219"
            value={manualCode}
            onChange={e => setManualCode(e.target.value)}
            className="flex-1 bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 px-3 py-2.5 rounded-xl text-xs font-mono uppercase focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="submit"
            className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded-xl transition-colors"
          >
            Validar
          </button>
        </div>
      </form>
    </div>
  );
}
