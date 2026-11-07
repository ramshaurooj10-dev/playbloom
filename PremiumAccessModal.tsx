import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Sparkles,
  CheckCircle2,
  Lock,
  RefreshCw,
  Zap,
  Star,
  Check,
} from 'lucide-react';
import { soundManager } from '../utils/audio';
import {
  unlockActivityViaAd,
  isActivityAdUnlocked,
} from '../utils/licenseService';
import { adMobService } from '../services/ads/AdMobService';
import {
  googlePlayBilling,
  GooglePlayEntitlement,
} from '../services/billing/GooglePlayBillingService';
import { LEARNING_ITEMS } from '../data/learningItems';
import { getNextAdUnlockTarget } from '../utils/dailyProgress';
import { ParentGateModal } from './common/ParentGate';

export interface PremiumAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedActivityTitle?: string;
  selectedActivityId?: string;
  selectedLevel?: number;
  // Kept for backward compatibility with App.tsx signatures (not used for individual login)
  userAccount?: any;
  onLoginSuccess?: (email: string) => void;
  onContinueWithGoogle?: () => Promise<void>;
  onLogout?: () => void;
}

export const PremiumAccessModal: React.FC<PremiumAccessModalProps> = ({
  isOpen,
  onClose,
  selectedActivityTitle,
  selectedActivityId,
  selectedLevel,
  userAccount,
}) => {
  const [isProcessingPurchase, setIsProcessingPurchase] = useState<string | null>(null);
  const [purchaseSuccessMessage, setPurchaseSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Entitlement states
  const [allPassStatus, setAllPassStatus] = useState(googlePlayBilling.hasAllActivitiesPass());
  const [pass3Status, setPass3Status] = useState(googlePlayBilling.has3ActivitiesPass());

  // Ad Unlock State
  const [isWatchingAd, setIsWatchingAd] = useState(false);
  const [adSuccessMessage, setAdSuccessMessage] = useState<string | null>(null);

  // Restore State
  const [isRestoring, setIsRestoring] = useState(false);
  const [restoreMessage, setRestoreMessage] = useState<string | null>(null);

  // Parent gate — every purchase/ad action requires a press-and-hold adult
  // check. Entry points to this modal are already gated; this is defence in
  // depth so a child who somehow reaches the open modal still cannot buy.
  const [parentGateOpen, setParentGateOpen] = useState(false);
  const pendingPurchaseRef = useRef<(() => void) | null>(null);

  const requireParentGate = (action: () => void) => {
    pendingPurchaseRef.current = action;
    setParentGateOpen(true);
  };

  const handleParentGateUnlock = () => {
    setParentGateOpen(false);
    const action = pendingPurchaseRef.current;
    pendingPurchaseRef.current = null;
    if (action) action();
  };

  // Subscribe to billing and license updates
  useEffect(() => {
    const updateEntitlements = () => {
      setAllPassStatus(googlePlayBilling.hasAllActivitiesPass());
      setPass3Status(googlePlayBilling.has3ActivitiesPass());
    };

    const unsubscribe = googlePlayBilling.subscribe(updateEntitlements);
    window.addEventListener('playroom_license_update', updateEntitlements);

    return () => {
      unsubscribe();
      window.removeEventListener('playroom_license_update', updateEntitlements);
    };
  }, []);

  // Update statuses when modal opens
  useEffect(() => {
    if (isOpen) {
      setAllPassStatus(googlePlayBilling.hasAllActivitiesPass());
      setPass3Status(googlePlayBilling.has3ActivitiesPass());
      setPurchaseSuccessMessage(null);
      setErrorMessage(null);
      setAdSuccessMessage(null);
      setRestoreMessage(null);
      setIsWatchingAd(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // 1. Calculate the real next ad unlock target based on child's sequential learning progression
  const nextAdTargetItem = getNextAdUnlockTarget();
  const nextAdTargetId = nextAdTargetItem?.id || 'big_small_sort';
  const nextAdTargetTitle = nextAdTargetItem?.title || 'Big & Small Sort';

  // 2. Identify the selected/clicked activity (if opened by tapping a card)
  let currentActivityId = selectedActivityId;
  if (!currentActivityId && selectedActivityTitle) {
    const matchedByTitle = LEARNING_ITEMS.find(
      (item) => item.title.toLowerCase() === selectedActivityTitle.toLowerCase()
    );
    if (matchedByTitle) {
      currentActivityId = matchedByTitle.id;
    }
  }
  if (!currentActivityId) {
    currentActivityId = nextAdTargetId;
  }

  const matchedLearningItem = LEARNING_ITEMS.find((item) => item.id === currentActivityId);

  const isCurrentAdUnlocked = isActivityAdUnlocked(currentActivityId);
  const isCurrentIn3Pack = pass3Status.unlockedActivities.includes(currentActivityId);
  const isCurrentUnlocked = allPassStatus.active || isCurrentIn3Pack || isCurrentAdUnlocked;

  // Handle Watch Ad (ALWAYS unlocks nextAdTargetId in the child's sequential learning path)
  const handleStartWatchAd = async () => {
    soundManager.playPop();
    setIsWatchingAd(true);
    setAdSuccessMessage(null);
    setErrorMessage(null);

    try {
      const targetId = nextAdTargetId;
      const targetTitle = nextAdTargetTitle;

      const result = await adMobService.showRewardedAd(targetId);

      setIsWatchingAd(false);
      if (result.rewarded) {
        unlockActivityViaAd(targetId);
        soundManager.playSuccess();
        setAdSuccessMessage(
          `Activity "${targetTitle}" is unlocked! Enjoy learning!`
        );
        setTimeout(() => {
          onClose();
        }, 1600);
      } else {
        setErrorMessage(result.error || 'Ad is not available right now. Please try again.');
      }
    } catch (err: any) {
      setIsWatchingAd(false);
      setErrorMessage(err.message || 'Ad playback encountered an error.');
    }
  };

  // Handle Google Play Purchase for Option 1 (Next 3 Activities - PKR 500 - 7 Days)
  const handlePurchase3Activities = async () => {
    soundManager.playPop();
    setIsProcessingPurchase('playroom_3activities_7d');
    setErrorMessage(null);
    setPurchaseSuccessMessage(null);

    try {
      const result = await googlePlayBilling.purchaseProduct(
        'playroom_3activities_7d',
        currentActivityId
      );

      if (result.success && result.entitlement) {
        soundManager.playSuccess();
        setPurchaseSuccessMessage(
          'Google Play purchase confirmed! Your Next 3 Activities pass is active for 7 days.'
        );
        setTimeout(() => {
          onClose();
        }, 1800);
      } else {
        setErrorMessage(result.error || 'Google Play purchase was not completed.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred with Google Play Billing.');
    } finally {
      setIsProcessingPurchase(null);
    }
  };

  // Handle Google Play Purchase for Option 2 (All Activities - PKR 5,000 - 30 Days)
  const handlePurchaseAllActivities = async () => {
    soundManager.playPop();
    setIsProcessingPurchase('playroom_all_activities_30d');
    setErrorMessage(null);
    setPurchaseSuccessMessage(null);

    try {
      const result = await googlePlayBilling.purchaseProduct('playroom_all_activities_30d');

      if (result.success && result.entitlement) {
        soundManager.playSuccess();
        setPurchaseSuccessMessage(
          'Google Play purchase confirmed! All PlayBloom activities are unlocked for 30 days.'
        );
        setTimeout(() => {
          onClose();
        }, 1800);
      } else {
        setErrorMessage(result.error || 'Google Play purchase was not completed.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred with Google Play Billing.');
    } finally {
      setIsProcessingPurchase(null);
    }
  };

  // Handle unlocking current activity under existing 3-Activities pass
  const handleClaim3PackSlot = () => {
    soundManager.playPop();
    const res = googlePlayBilling.unlockActivityUnder3Pack(currentActivityId);
    if (res.success) {
      soundManager.playSuccess();
      setPurchaseSuccessMessage(res.message);
      setTimeout(() => {
        onClose();
      }, 1500);
    } else {
      setErrorMessage(res.message);
    }
  };

  // Handle Restore Google Play Purchases
  const handleRestorePurchases = async () => {
    soundManager.playPop();
    setIsRestoring(true);
    setRestoreMessage(null);
    setErrorMessage(null);

    try {
      const res = await googlePlayBilling.restorePurchases();
      if (res.success) {
        soundManager.playSuccess();
        setRestoreMessage(res.message);
      } else {
        setErrorMessage(res.message || 'Could not restore purchases.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Restore failed. Please try again.');
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <AnimatePresence>
      <div
        id="premium-access-modal-overlay"
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto select-none"
      >
        <motion.div
          id="premium-access-dialog"
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-xl bg-white border-4 border-indigo-500 rounded-3xl shadow-2xl overflow-hidden my-6 text-slate-800"
        >
          {/* Top Header Banner */}
          <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 p-5 sm:p-6 text-white text-center relative border-b-4 border-indigo-800">
            <button
              id="premium-modal-close-btn"
              onClick={() => {
                soundManager.playPop();
                onClose();
              }}
              type="button"
              className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 bg-white/10 border-2 border-white/30 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-2 shadow-inner">
              💎
            </div>

            <div className="inline-flex items-center gap-1.5 bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[11px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Google Play Digital Access</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white drop-shadow-xs">
              Premium Access
            </h1>

            {selectedActivityTitle && (
              <p className="text-xs text-blue-100 font-semibold mt-1">
                Selected Activity:{' '}
                <span className="font-black text-amber-300">{selectedActivityTitle}</span>
              </p>
            )}
          </div>

          {/* Body Content */}
          <div className="p-5 sm:p-7 max-h-[75vh] overflow-y-auto space-y-6">
            {/* Active Entitlement Alerts */}
            {allPassStatus.active && (
              <div
                id="active-all-pass-alert"
                className="p-4 bg-purple-50 border-2 border-purple-300 rounded-2xl flex items-center justify-between gap-3 text-purple-950"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-200 flex items-center justify-center text-purple-800 shrink-0">
                    <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wide">
                      All Activities Unlocked
                    </h4>
                    <p className="text-[11px] font-bold text-purple-700">
                      Full access active ({allPassStatus.daysRemaining} days remaining)
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-black uppercase bg-purple-600 text-white px-2.5 py-1 rounded-full">
                  Active
                </span>
              </div>
            )}

            {pass3Status.active && !allPassStatus.active && (
              <div
                id="active-3pack-alert"
                className="p-4 bg-indigo-50 border-2 border-indigo-300 rounded-2xl space-y-2 text-indigo-950"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-indigo-600" />
                    <h4 className="text-xs font-black uppercase tracking-wide">
                      Next 3 Activities Pass Active
                    </h4>
                  </div>
                  <span className="text-[10px] font-black uppercase bg-indigo-600 text-white px-2.5 py-0.5 rounded-full">
                    {pass3Status.unlockedActivities.length}/3 Unlocked • {pass3Status.daysRemaining}d Left
                  </span>
                </div>

                {selectedActivityTitle && !isCurrentIn3Pack && pass3Status.canUnlockMore && (
                  <button
                    id="claim-3pack-activity-btn"
                    type="button"
                    onClick={() => requireParentGate(handleClaim3PackSlot)}
                    className="w-full mt-2 py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>Unlock "{selectedActivityTitle}" in your 3-Pack</span>
                  </button>
                )}
              </div>
            )}

            {/* Error or Success Notifications */}
            {purchaseSuccessMessage && (
              <div
                id="purchase-success-notification"
                className="p-3.5 bg-emerald-50 border-2 border-emerald-400 text-emerald-950 rounded-2xl text-xs font-bold flex items-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{purchaseSuccessMessage}</span>
              </div>
            )}

            {errorMessage && (
              <div
                id="purchase-error-notification"
                className="p-3.5 bg-rose-50 border-2 border-rose-300 text-rose-900 rounded-2xl text-xs font-bold"
              >
                ⚠️ {errorMessage}
              </div>
            )}

            {restoreMessage && (
              <div
                id="restore-message-notification"
                className="p-3 bg-blue-50 border-2 border-blue-300 text-blue-900 rounded-2xl text-xs font-bold text-center"
              >
                ℹ️ {restoreMessage}
              </div>
            )}

            {/* ========================================================================= */}
            {/* 3 INDIVIDUAL ACCESS OPTIONS: WATCH AD | OPTION 1 | OPTION 2               */}
            {/* ========================================================================= */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                  Select Unlock Method
                </span>
                <span className="text-[11px] font-bold text-slate-400">
                  No Login Required
                </span>
              </div>

              {/* ------------------------------------------------------------- */}
              {/* OPTION: WATCH AN AD (Free 1-Activity Unlock)                   */}
              {/* ------------------------------------------------------------- */}
              {!allPassStatus.active && (
                <div
                  id="watch-ad-option-card"
                  className="p-5 rounded-3xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/5 border-3 border-amber-300 shadow-xs"
                >
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5 text-left">
                      <div className="w-12 h-12 rounded-2xl bg-amber-400 border-2 border-amber-300 flex items-center justify-center text-2xl shadow-xs shrink-0">
                        🎬
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[10px] font-black uppercase tracking-wider bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
                            FREE REWARD
                          </span>
                          <span className="text-[10px] font-bold text-amber-800">
                            Sequential Unlock
                          </span>
                        </div>
                        <h3 className="text-base font-black text-slate-900 uppercase">
                          Watch an Ad to Unlock Your Next Activity
                        </h3>
                        <p className="text-xs text-slate-600 font-medium">
                          Watch an ad to unlock your NEXT activity: <span className="font-black text-slate-900">"{nextAdTargetTitle}"</span>. The ad never unlocks the activity you tapped — it always unlocks the next activity in your learning path.
                        </p>
                      </div>
                    </div>

                    <button
                      id="watch-ad-btn"
                      type="button"
                      onClick={() => requireParentGate(handleStartWatchAd)}
                      disabled={isWatchingAd}
                      className="w-full sm:w-auto px-5 py-3 bg-amber-500 hover:bg-amber-600 active:translate-y-0.5 text-slate-950 font-black text-xs uppercase tracking-wider rounded-2xl shadow-md transition-all cursor-pointer shrink-0 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isWatchingAd ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Requesting Ad...</span>
                        </>
                      ) : (
                        <>
                          <span>Unlock "{nextAdTargetTitle}"</span>
                        </>
                      )}
                    </button>
                  </div>

                  {isWatchingAd && (
                    <div className="mt-3 p-3 bg-slate-900 text-white rounded-2xl text-center space-y-1">
                      <div className="flex items-center justify-center gap-2 text-amber-300 font-bold text-xs">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Loading Rewarded Video Ad...</span>
                      </div>
                      <p className="text-[11px] text-slate-300">
                        Reward will unlock {nextAdTargetTitle} upon verified ad completion.
                      </p>
                    </div>
                  )}

                  {adSuccessMessage && (
                    <div className="mt-2 p-2 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-xl text-xs font-bold text-center">
                      ✅ {adSuccessMessage}
                    </div>
                  )}
                </div>
              )}

              {!isCurrentUnlocked && (
                <div className="flex items-center gap-3 py-1">
                  <div className="h-px bg-slate-200 flex-1" />
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    OR
                  </span>
                  <div className="h-px bg-slate-200 flex-1" />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* ------------------------------------------------------------- */}
                {/* OPTION 1: Next 3 Activities • PKR 500 • 7 Days                */}
                {/* ------------------------------------------------------------- */}
                <div
                  id="option-1-card"
                  className="bg-slate-50 hover:bg-indigo-50/40 border-3 border-indigo-200 hover:border-indigo-400 rounded-3xl p-5 flex flex-col justify-between transition-all text-left shadow-xs relative"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black uppercase tracking-wider bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded-full">
                        OPTION 1
                      </span>
                      <span className="text-xs font-bold text-slate-500">7 Days</span>
                    </div>

                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                      Next 3 Activities
                    </h3>

                    <p className="text-2xl font-black text-indigo-600 mt-1">
                      PKR 500
                    </p>

                    <p className="text-xs text-slate-600 font-medium mt-2 leading-relaxed">
                      Access for <strong>7 days</strong>. Choose and unlock any 3 premium learning activities.
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-200">
                    <button
                      id="unlock-3-activities-btn"
                      type="button"
                      disabled={isProcessingPurchase !== null}
                      onClick={() => requireParentGate(handlePurchase3Activities)}
                      className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-md active:translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      {isProcessingPurchase === 'playroom_3activities_7d' ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Connecting Google Play...</span>
                        </>
                      ) : pass3Status.active ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>3-Pack Active ({pass3Status.daysRemaining}d left)</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>Purchase</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* ------------------------------------------------------------- */}
                {/* OPTION 2: All Activities • PKR 5,000 • 30 Days                */}
                {/* ------------------------------------------------------------- */}
                <div
                  id="option-2-card"
                  className="bg-gradient-to-b from-purple-50/80 to-white hover:bg-purple-50 border-3 border-purple-400 rounded-3xl p-5 flex flex-col justify-between transition-all text-left shadow-md relative overflow-hidden"
                >
                  <div className="absolute top-3 right-3 bg-amber-400 text-amber-950 font-black text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                    <Star className="w-2.5 h-2.5 fill-amber-950 stroke-none" />
                    <span>FULL PASS</span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black uppercase tracking-wider bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-full">
                        OPTION 2
                      </span>
                      <span className="text-xs font-bold text-slate-500">30 Days</span>
                    </div>

                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                      All Activities
                    </h3>

                    <p className="text-2xl font-black text-purple-700 mt-1">
                      PKR 5,000
                    </p>

                    <p className="text-xs text-slate-600 font-medium mt-2 leading-relaxed">
                      Full Page 1 access for <strong>30 days</strong>. Unlocks 100% of Page 1 activities (Levels 1–6). Educator Hub is not included — it is for schools only.
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-purple-200">
                    <button
                      id="unlock-all-activities-btn"
                      type="button"
                      disabled={isProcessingPurchase !== null || allPassStatus.active}
                      onClick={() => requireParentGate(handlePurchaseAllActivities)}
                      className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-md active:translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      {isProcessingPurchase === 'playroom_all_activities_30d' ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Connecting Google Play...</span>
                        </>
                      ) : allPassStatus.active ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Active — Expires in {allPassStatus.daysRemaining} Days</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Purchase</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer / Restore Option */}
            <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <button
                id="restore-purchases-btn"
                type="button"
                onClick={handleRestorePurchases}
                disabled={isRestoring}
                className="text-slate-500 hover:text-indigo-600 font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRestoring ? 'animate-spin' : ''}`} />
                <span>Restore Google Play Purchases</span>
              </button>

              <button
                id="close-bottom-btn"
                type="button"
                onClick={() => {
                  soundManager.playPop();
                  onClose();
                }}
                className="text-slate-400 hover:text-slate-600 font-bold cursor-pointer"
              >
                Cancel / Close
              </button>
            </div>
          </div>
        </motion.div>
      </div>
      <ParentGateModal
        isOpen={parentGateOpen}
        onClose={() => {
          pendingPurchaseRef.current = null;
          setParentGateOpen(false);
        }}
        onUnlock={handleParentGateUnlock}
        title="Parents only — confirm to continue"
      />
    </AnimatePresence>
  );
};
