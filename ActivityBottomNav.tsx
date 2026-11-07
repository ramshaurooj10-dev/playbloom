import React from 'react';
import { ArrowLeft, Home, ArrowRight } from 'lucide-react';
import { soundManager } from '../../utils/audio';

export interface ActivityBottomNavProps {
  onNavigatePrev?: () => void;
  onNavigateHome?: () => void;
  onNavigateNext?: () => void;
  onPrev?: () => void;
  onHome?: () => void;
  onNext?: () => void;
  prevTitle?: string;
  nextTitle?: string;
  homeTitle?: string;
  isNextUnlocked?: boolean;
  isNextDisabled?: boolean;
  isCompleted?: boolean;
}

export const ActivityBottomNav: React.FC<ActivityBottomNavProps> = ({
  onNavigatePrev,
  onNavigateHome,
  onNavigateNext,
  onPrev,
  onHome,
  onNext,
  prevTitle,
  nextTitle,
  homeTitle,
  isNextUnlocked,
  isNextDisabled,
  isCompleted,
}) => {
  const handlePrev = onNavigatePrev || onPrev;
  const handleHome = onNavigateHome || onHome;
  const handleNext = onNavigateNext || onNext;

  const unlocked =
    isNextUnlocked !== undefined
      ? isNextUnlocked
      : isNextDisabled !== undefined
      ? !isNextDisabled
      : isCompleted !== undefined
      ? isCompleted
      : true;

  return (
    <div className="w-full max-w-2xl mt-4 grid grid-cols-3 gap-3 sm:gap-6">
      {/* PREV */}
      <button
        type="button"
        onClick={() => {
          soundManager.playPop();
          if (handlePrev) {
            handlePrev();
          } else if (handleHome) {
            handleHome();
          }
        }}
        className="flex items-center justify-center gap-2 bg-[#F7D060] hover:bg-amber-400 text-amber-950 font-black py-4 px-3 sm:px-6 rounded-3xl border-b-8 border-[#CA8A04] shadow-xl active:border-b-2 active:translate-y-1.5 transition-all cursor-pointer text-base sm:text-xl uppercase"
      >
        <ArrowLeft className="w-6 h-6 stroke-[3]" />
        <span>{prevTitle || 'PREV'}</span>
      </button>

      {/* HOME */}
      <button
        type="button"
        onClick={() => {
          soundManager.playPop();
          if (handleHome) handleHome();
        }}
        className="flex items-center justify-center gap-2 bg-[#4D96FF] hover:bg-blue-500 text-white font-black py-4 px-3 sm:px-6 rounded-3xl border-b-8 border-[#2563EB] shadow-xl active:border-b-2 active:translate-y-1.5 transition-all cursor-pointer text-base sm:text-xl uppercase"
      >
        <Home className="w-6 h-6 stroke-[3]" />
        <span>{homeTitle || 'HOME'}</span>
      </button>

      {/* NEXT */}
      <button
        type="button"
        onClick={() => {
          if (unlocked) {
            soundManager.playPop();
            if (handleNext) handleNext();
          } else {
            soundManager.playPop();
            soundManager.speak('Finish the activity to unlock next!');
          }
        }}
        className={`flex items-center justify-center gap-2 font-black py-4 px-3 sm:px-6 rounded-3xl shadow-xl transition-all text-base sm:text-xl uppercase ${
          unlocked
            ? 'bg-[#6BCB77] hover:bg-emerald-500 text-white border-b-8 border-[#16A34A] active:border-b-2 active:translate-y-1.5 cursor-pointer'
            : 'bg-slate-300 text-slate-500 border-b-4 border-slate-400 cursor-not-allowed opacity-70'
        }`}
      >
        <span>{nextTitle || 'NEXT'}</span>
        <ArrowRight className="w-6 h-6 stroke-[3]" />
      </button>
    </div>
  );
};
