import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ShieldCheck, X } from 'lucide-react';
import { soundManager } from '../../utils/audio';

/**
 * ParentGate — the single adult check for the whole app (Wave 2, 2026-11-07).
 *
 * No login, no PIN, no account: a parent presses and holds for 3 seconds.
 * A small child cannot do this accidentally; an adult can do it easily.
 * Visible progress (fill bar + countdown) so the hold is discoverable.
 *
 * Two forms:
 * - <ParentGate onUnlock={...} /> — inline hold button (e.g. HomeScreen
 *   parent-progress section).
 * - <ParentGateModal isOpen onClose onUnlock /> — modal overlay used before
 *   an adult action (OPTIONS panel, RESET, Educator Hub entry, purchase
 *   entry points in App.tsx). The caller performs the action in onUnlock.
 *
 * Kid flow (START -> tap a card -> play) is never gated.
 */

const HOLD_MS = 3000;

function useHoldToUnlock(onUnlock: () => void, active: boolean) {
  const [progress, setProgress] = useState(0); // 0..1
  const [holding, setHolding] = useState(false);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef(0);
  const unlockedRef = useRef(false);
  const onUnlockRef = useRef(onUnlock);
  onUnlockRef.current = onUnlock;

  const cancel = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setHolding(false);
    setProgress(0);
  }, []);

  // Reset if the gate is hidden / closed mid-hold.
  useEffect(() => {
    if (!active) {
      unlockedRef.current = false;
      cancel();
    }
  }, [active, cancel]);

  useEffect(() => cancel, [cancel]);

  const start = useCallback(() => {
    if (!active || unlockedRef.current) return;
    startRef.current = performance.now();
    setHolding(true);
    const tick = (now: number) => {
      const elapsed = now - startRef.current;
      const p = Math.min(elapsed / HOLD_MS, 1);
      setProgress(p);
      if (p >= 1) {
        unlockedRef.current = true;
        rafRef.current = null;
        setHolding(false);
        try {
          soundManager.playPop();
        } catch (_) {}
        onUnlockRef.current();
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [active]);

  const holdHandlers = {
    onPointerDown: (e: React.PointerEvent) => {
      e.preventDefault();
      start();
    },
    onPointerUp: cancel,
    onPointerLeave: cancel,
    onPointerCancel: cancel,
    onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
    onKeyDown: (e: React.KeyboardEvent) => {
      if ((e.key === 'Enter' || e.key === ' ') && !e.repeat) {
        e.preventDefault();
        start();
      }
    },
    onKeyUp: (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') cancel();
    },
  };

  return { progress, holding, holdHandlers };
}

export const ParentGate: React.FC<{
  onUnlock: () => void;
  label?: string;
  className?: string;
}> = ({ onUnlock, label, className }) => {
  const { progress, holding, holdHandlers } = useHoldToUnlock(onUnlock, true);
  const secondsLeft = Math.max(0, Math.ceil((1 - progress) * (HOLD_MS / 1000)));

  return (
    <div className={className}>
      <button
        type="button"
        aria-label="Parent check: press and hold for 3 seconds to continue"
        {...holdHandlers}
        className={`relative w-full overflow-hidden py-3 px-4 rounded-2xl border-2 font-black text-sm uppercase tracking-wide transition-colors cursor-pointer select-none touch-none ${
          holding
            ? 'bg-indigo-600 text-white border-indigo-700'
            : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border-indigo-300'
        }`}
      >
        <span
          aria-hidden
          className="absolute inset-y-0 left-0 bg-indigo-500/40 transition-none"
          style={{ width: `${progress * 100}%` }}
        />
        <span className="relative flex items-center justify-center gap-2">
          <ShieldCheck className="w-5 h-5 shrink-0" />
          <span>
            {holding
              ? `Keep holding… ${secondsLeft}s`
              : label || 'Parents: press & hold for 3 seconds'}
          </span>
        </span>
      </button>
      <p className="text-center text-[11px] font-bold text-slate-500 mt-1.5">
        For parents only — children cannot open this area.
      </p>
    </div>
  );
};

export const ParentGateModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onUnlock: () => void;
  title?: string;
}> = ({ isOpen, onClose, onUnlock, title }) => {
  const { progress, holding, holdHandlers } = useHoldToUnlock(onUnlock, isOpen);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  const secondsLeft = Math.max(0, Math.ceil((1 - progress) * (HOLD_MS / 1000)));

  return (
    <div
      className="fixed inset-0 z-[100] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 select-none"
      role="dialog"
      aria-modal="true"
      aria-label="Parent check"
    >
      <div className="bg-white rounded-3xl border-4 border-indigo-300 shadow-2xl p-6 max-w-sm w-full text-center space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-indigo-600" />
            <span>{title || 'Parents Only'}</span>
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-slate-400 hover:text-slate-600 font-bold text-xl cursor-pointer px-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-sm font-bold text-slate-600">
          This area is for parents. Press and hold the button below for 3 seconds to continue.
        </p>
        <button
          type="button"
          aria-label="Parent check: press and hold for 3 seconds to continue"
          {...holdHandlers}
          className={`relative w-full overflow-hidden py-4 px-4 rounded-2xl border-2 font-black text-sm uppercase tracking-wide transition-colors cursor-pointer select-none touch-none ${
            holding
              ? 'bg-indigo-600 text-white border-indigo-700'
              : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border-indigo-300'
          }`}
        >
          <span
            aria-hidden
            className="absolute inset-y-0 left-0 bg-indigo-500/40 transition-none"
            style={{ width: `${progress * 100}%` }}
          />
          <span className="relative">
            {holding ? `Keep holding… ${secondsLeft}s` : 'Press & hold for 3 seconds'}
          </span>
        </button>
        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-black uppercase cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
