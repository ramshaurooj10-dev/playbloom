import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Lock, WifiOff, ArrowLeft, Sparkles, RefreshCw } from 'lucide-react';
import { checkActivityAccess, ActivityAccessResult } from '../../utils/licenseService';
import { LEARNING_ITEMS } from '../../data/learningItems';
import { soundManager } from '../../utils/audio';

interface ActivityAccessGuardProps {
  activityId: string;
  levelNumber?: number;
  userEmail?: string | null;
  onBackToHome: () => void;
  onOpenPremiumModal?: (title?: string, level?: number, activityId?: string) => void;
  children: React.ReactNode;
}

export const ActivityAccessGuard: React.FC<ActivityAccessGuardProps> = ({
  activityId,
  levelNumber,
  userEmail,
  onBackToHome,
  onOpenPremiumModal,
  children,
}) => {
  const [accessResult, setAccessResult] = useState<ActivityAccessResult>(() => {
    return checkActivityAccess(activityId, levelNumber, userEmail);
  });
  const [isRetrying, setIsRetrying] = useState(false);

  const item = LEARNING_ITEMS.find((i) => i.id === activityId);
  const effectiveLevel = levelNumber ?? (item?.level ? Number(item.level) : 1);

  // Re-verify on network changes or license updates
  useEffect(() => {
    const evaluate = () => {
      const result = checkActivityAccess(activityId, levelNumber, userEmail);
      setAccessResult(result);
    };

    evaluate();

    const handleOnline = () => evaluate();
    const handleOffline = () => evaluate();

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('playroom_license_update', evaluate);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('playroom_license_update', evaluate);
    };
  }, [activityId, levelNumber, userEmail]);

  // If access is allowed, render the activity immediately
  if (accessResult.allowed) {
    return <>{children}</>;
  }

  const handleRetry = async () => {
    soundManager.playPop();
    setIsRetrying(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const res = checkActivityAccess(activityId, levelNumber, userEmail);
      setAccessResult(res);
    } finally {
      setIsRetrying(false);
    }
  };

  const handleUnlockClick = () => {
    soundManager.playPop();
    if (onOpenPremiumModal) {
      onOpenPremiumModal(item?.title || 'Premium Activity', effectiveLevel, activityId);
    }
  };

  // Render Fail-Closed Lock Screen
  return (
    <div
      id={`activity-lock-guard-${activityId}`}
      className="min-h-[80vh] flex items-center justify-center p-4 select-none"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-lg bg-white rounded-3xl border-4 border-amber-400 shadow-2xl p-6 sm:p-8 text-center flex flex-col items-center space-y-5"
      >
        {/* Visual Badge Icon */}
        <div className="relative">
          <div
            className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center border-4 shadow-inner ${
              accessResult.reason === 'OFFLINE'
                ? 'bg-rose-100 border-rose-300 text-rose-600'
                : 'bg-amber-100 border-amber-300 text-amber-600'
            }`}
          >
            {accessResult.reason === 'OFFLINE' ? (
              <WifiOff className="w-10 h-10 sm:w-12 sm:h-12 stroke-[2.5]" />
            ) : (
              <Lock className="w-10 h-10 sm:w-12 sm:h-12 stroke-[2.5]" />
            )}
          </div>
          <div className="absolute -bottom-1 -right-1 bg-white p-1.5 rounded-full border-2 border-slate-300 shadow-md">
            <span className="text-xl">
              {accessResult.reason === 'OFFLINE' ? '🔒' : '⭐'}
            </span>
          </div>
        </div>

        {/* Title & Level Tag */}
        <div className="space-y-1.5">
          <div
            className={`inline-block text-[11px] font-black uppercase px-3 py-1 rounded-full border tracking-wider ${
              accessResult.reason === 'OFFLINE'
                ? 'bg-rose-100 text-rose-800 border-rose-300'
                : 'bg-amber-100 text-amber-900 border-amber-300'
            }`}
          >
            {accessResult.reason === 'OFFLINE'
              ? 'Offline Locked'
              : `Level ${effectiveLevel} Premium Activity`}
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-tight">
            {item?.title || 'Premium Activity'}
          </h2>
          <p className="text-sm font-semibold text-slate-600 leading-relaxed max-w-sm mx-auto">
            {accessResult.reason === 'OFFLINE'
              ? 'Level 1 activities are free to play offline. Level 2–6 activities require internet to verify subscription and load resources.'
              : 'This activity is locked. You can unlock it with an individual pass, 3-activity pack, or school license.'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-3 pt-2">
          {accessResult.reason === 'OFFLINE' ? (
            <>
              <button
                type="button"
                onClick={onBackToHome}
                className="w-full py-3.5 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-black text-sm uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <ArrowLeft className="w-4 h-4 stroke-[3]" />
                <span>Play Level 1 Free Activities</span>
              </button>
              <button
                type="button"
                onClick={handleRetry}
                disabled={isRetrying}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-all"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRetrying ? 'animate-spin' : ''}`} />
                <span>{isRetrying ? 'Checking Network...' : 'Check Connection Again'}</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handleUnlockClick}
                className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 active:scale-95 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Sparkles className="w-4 h-4 fill-amber-950" />
                <span>Unlock Activity</span>
              </button>
              <button
                type="button"
                onClick={onBackToHome}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5 stroke-[3]" />
                <span>Back to Home</span>
              </button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};
