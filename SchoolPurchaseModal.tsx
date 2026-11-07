import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  School,
  CheckCircle2,
  Clock,
  X,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  RefreshCw,
  Loader2,
  CalendarClock,
  Ban,
} from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { googlePlayBilling } from '../../services/billing/GooglePlayBillingService';

// School subscription — Play Billing only. No license key, no email round-trip,
// no manual payment. Schools subscribe in Google Play and the subscription
// itself decides access (see SchoolAccessGate).
// Price: Rs 50,000/month in Pakistan; USD $99/month abroad
// (Play Console country-specific pricing, one Play Billing system).

const SCHOOL_PRODUCT_ID = 'playroom_school_monthly' as const;

interface SchoolSubscriptionStatus {
  active: boolean;
  expiryDate?: string;
  daysRemaining?: number;
}

/**
 * Reads the school subscription from Google Play Billing.
 * NOTE FOR THE BACKEND AGENT: googlePlayBilling.hasSchoolSubscription() is
 * part of the parallel contract and may not exist yet — this reader guards
 * for it and reports "not subscribed" until it lands.
 */
const readSchoolSubscription = (): SchoolSubscriptionStatus => {
  const svc = googlePlayBilling as unknown as {
    hasSchoolSubscription?: () => SchoolSubscriptionStatus;
  };
  if (typeof svc.hasSchoolSubscription === 'function') {
    try {
      return svc.hasSchoolSubscription();
    } catch {
      return { active: false };
    }
  }
  return { active: false };
};

const formatDate = (iso?: string): string => {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
};

interface SchoolPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribed?: () => void;
}

export const SchoolPurchaseModal: React.FC<SchoolPurchaseModalProps> = ({
  isOpen,
  onClose,
  onSubscribed,
}) => {
  const [subscription, setSubscription] = useState<SchoolSubscriptionStatus>({
    active: false,
  });
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setErrorMessage('');
    setSuccessMessage('');
    setSubscription(readSchoolSubscription());

    const refresh = () => setSubscription(readSchoolSubscription());
    const unsubscribe =
      typeof googlePlayBilling.subscribe === 'function'
        ? googlePlayBilling.subscribe(refresh)
        : () => {};
    window.addEventListener('playroom_license_update', refresh);
    return () => {
      unsubscribe();
      window.removeEventListener('playroom_license_update', refresh);
    };
  }, [isOpen]);

  const handleSubscribe = async () => {
    soundManager.playPop();
    setIsPurchasing(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // NOTE: 'playroom_school_monthly' is added to purchaseProduct() by the
      // parallel backend agent (Play Billing contract). Cast until it lands.
      const result = await googlePlayBilling.purchaseProduct(
        SCHOOL_PRODUCT_ID as never
      );

      if (result.success) {
        soundManager.playSuccess();
        setSubscription(readSchoolSubscription());
        setSuccessMessage(
          'School subscription active! Your school now has full access to Page 1 and Page 2 (Preschool Educator Hub).'
        );
        if (onSubscribed) onSubscribed();
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setErrorMessage(result.error || 'Google Play purchase was not completed.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'An error occurred with Google Play Billing.');
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleRestorePurchases = async () => {
    soundManager.playPop();
    setIsRestoring(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await googlePlayBilling.restorePurchases();
      if (res.success) {
        setSubscription(readSchoolSubscription());
        setSuccessMessage(res.message);
      } else {
        setErrorMessage(res.message || 'Could not restore purchases.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Restore failed. Please try again.');
    } finally {
      setIsRestoring(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/50 backdrop-blur-xs overflow-y-auto select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          className="w-full max-w-xl bg-white border-4 border-indigo-300 rounded-3xl shadow-2xl overflow-hidden my-auto text-slate-800"
        >
          {/* Modal Header */}
          <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 text-white p-5 sm:p-6 border-b-4 border-indigo-500 relative">
            <button
              type="button"
              onClick={() => {
                soundManager.playPop();
                onClose();
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-xl transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/10 border-2 border-indigo-400/40 rounded-2xl flex items-center justify-center text-2xl shadow-inner">
                🏫
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full mb-1">
                  <School className="w-3 h-3" />
                  <span>Google Play Subscription</span>
                </div>
                <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight">
                  School Subscription
                </h2>
              </div>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-5 sm:p-7 max-h-[75vh] overflow-y-auto space-y-5">
            {errorMessage && (
              <div className="p-3.5 bg-rose-50 border-2 border-rose-300 rounded-2xl text-rose-700 text-xs font-bold flex items-start gap-2.5 shadow-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-3.5 bg-emerald-50 border-2 border-emerald-400 text-emerald-900 rounded-2xl text-xs font-bold flex items-start gap-2.5 shadow-xs">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                <span>{successMessage}</span>
              </div>
            )}

            {subscription.active ? (
              /* ---------- ACTIVE SUBSCRIPTION STATE ---------- */
              <div className="space-y-4">
                <div className="p-5 bg-emerald-50 border-2 border-emerald-300 rounded-2xl text-center space-y-2">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 border-2 border-emerald-300 rounded-full flex items-center justify-center mx-auto text-3xl">
                    ✅
                  </div>
                  <h3 className="text-lg font-black text-slate-900 uppercase">
                    School Subscription Active
                  </h3>
                  <p className="text-xs font-bold text-emerald-900 leading-relaxed">
                    Your school has full access to Page 1 (all activities) and
                    Page 2 (Preschool Educator Hub).
                  </p>
                  {subscription.expiryDate && (
                    <p className="text-xs font-bold text-slate-700 bg-white border border-emerald-200 rounded-xl px-3 py-2 inline-block">
                      Subscription renews {formatDate(subscription.expiryDate)}
                      {typeof subscription.daysRemaining === 'number' &&
                        ` (${subscription.daysRemaining} days remaining)`}
                    </p>
                  )}
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-600 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <CalendarClock className="w-4 h-4 text-indigo-600" />
                    <span>Manage your subscription in Google Play</span>
                  </div>
                  <p>
                    To cancel or change the subscription, open Google Play →
                    Payments &amp; subscriptions → Subscriptions → PlayBloom.
                    Access locks automatically when the subscription ends.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    soundManager.playPop();
                    onClose();
                  }}
                  className="w-full bg-indigo-900 hover:bg-indigo-950 text-white font-black text-xs uppercase tracking-wider py-3.5 rounded-2xl shadow-md transition-all cursor-pointer"
                >
                  Continue to Educator Hub
                </button>
              </div>
            ) : (
              /* ---------- SUBSCRIBE STATE ---------- */
              <>
                {/* Price card */}
                <div className="bg-indigo-50/80 border-2 border-indigo-200 rounded-2xl p-5 text-center space-y-1">
                  <div className="inline-flex items-center gap-1.5 bg-amber-400 text-amber-950 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                    <Sparkles className="w-3 h-3" />
                    <span>For Schools &amp; Preschools</span>
                  </div>
                  <p className="text-3xl font-black text-indigo-900 mt-2">
                    Rs 50,000<span className="text-base font-bold text-slate-600"> / month</span>
                  </p>
                  <p className="text-[11px] font-bold text-slate-500">
                    Billed through Google Play. Outside Pakistan the same
                    subscription is $99/month (Google Play country-specific pricing).
                  </p>
                </div>

                {/* What it unlocks */}
                <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 space-y-2.5">
                  <h3 className="text-xs font-black uppercase tracking-wide text-slate-800">
                    What your school gets
                  </h3>
                  <ul className="text-xs text-slate-600 space-y-2 font-medium">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Full Page 1</strong> — all PlayBloom activities (Levels 1–6) for your students.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Full Page 2 — Preschool Educator Hub</strong> — Lesson Planner, Teacher Assessment, Activity Planner, Printable Worksheets, Flash Cards, Teaching Tips &amp; Rhymes.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Unlimited classroom devices</strong> for your teachers &amp; students.</span>
                    </li>
                  </ul>
                </div>

                {/* Auto-renew / cancel terms */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-600 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <Clock className="w-4 h-4 text-indigo-600" />
                    <span>Auto-renews monthly — cancel anytime</span>
                  </div>
                  <p>
                    The subscription renews automatically every month until you
                    cancel it in Google Play. You can cancel anytime; your
                    school keeps access until the end of the paid month, then
                    access locks automatically.
                  </p>
                  <div className="flex items-start gap-1.5 pt-1">
                    <Ban className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                    <span>No license key needed — access is decided by your Google Play subscription, not a key or email.</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>No login required. Payment is handled securely by Google Play.</span>
                  </div>
                </div>

                <button
                  id="school-subscribe-btn"
                  type="button"
                  onClick={handleSubscribe}
                  disabled={isPurchasing}
                  className="w-full bg-gradient-to-r from-indigo-600 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900 text-white font-black text-xs sm:text-sm uppercase tracking-wider py-3.5 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isPurchasing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Connecting Google Play...</span>
                    </>
                  ) : (
                    <>
                      <School className="w-4 h-4 stroke-[2.5]" />
                      <span>Subscribe — Rs 50,000 / month</span>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-between text-xs pt-1">
                  <button
                    type="button"
                    onClick={handleRestorePurchases}
                    disabled={isRestoring}
                    className="text-slate-500 hover:text-indigo-600 font-bold flex items-center gap-1.5 cursor-pointer transition-colors disabled:opacity-60"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isRestoring ? 'animate-spin' : ''}`} />
                    <span>Restore Google Play Purchases</span>
                  </button>
                  <span className="text-slate-400 font-bold">No Login Required</span>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
