import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import {
  School,
  ArrowLeft,
  CheckCircle2,
  Lock,
  ShieldCheck,
  Clock,
  RefreshCw,
  CalendarClock,
} from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { UserAccount } from '../PremiumAuthModal';
import { googlePlayBilling } from '../../services/billing/GooglePlayBillingService';
import { SchoolPurchaseModal } from './SchoolPurchaseModal';

// School entry is decided ONLY by the Google Play school subscription
// (playroom_school_monthly, Rs 50,000/month). There is no license key, no
// school-request form, and no email round-trip any more.
//
// NOTE FOR THE BACKEND AGENT: googlePlayBilling.hasSchoolSubscription() is
// part of the parallel contract and may not exist yet — this gate guards
// for it and treats a missing method as "no active subscription" until it
// lands.

interface SchoolSubscriptionStatus {
  active: boolean;
  expiryDate?: string;
  daysRemaining?: number;
}

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

interface SchoolAccessGateProps {
  onBackToPlayroom: () => void;
  onSchoolLoginSuccess?: (schoolAccount: UserAccount, activeLicense?: any) => void;
  onOpenInquiry?: () => void;
  revocationNotice?: { isRevoked: boolean; message?: string; schoolName?: string; licenseKey?: string } | null;
  expiredNotice?: { isExpired: boolean; message?: string; schoolName?: string; licenseKey?: string } | null;
}

export const SchoolAccessGate: React.FC<SchoolAccessGateProps> = ({
  onBackToPlayroom,
  onSchoolLoginSuccess,
  onOpenInquiry,
  revocationNotice,
  expiredNotice,
}) => {
  const [subscription, setSubscription] = useState<SchoolSubscriptionStatus | null>(null);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const enteredRef = useRef(false);

  const enterHub = (sub: SchoolSubscriptionStatus) => {
    if (enteredRef.current) return;
    enteredRef.current = true;
    const schoolAccount: UserAccount = {
      id: 'school_subscriber',
      email: '',
      isLoggedIn: true,
      role: 'school_admin',
      hasPage1Access: true,
      hasPage2SchoolAccess: true,
      schoolName: 'School Subscriber',
    };
    soundManager.playSuccess();
    if (onSchoolLoginSuccess) {
      onSchoolLoginSuccess(schoolAccount);
    }
  };

  const refreshSubscription = () => {
    const sub = readSchoolSubscription();
    setSubscription(sub);
    if (sub.active) {
      enterHub(sub);
    }
    return sub;
  };

  // Check the subscription on mount and whenever billing state changes.
  useEffect(() => {
    refreshSubscription();
    const unsubscribe =
      typeof googlePlayBilling.subscribe === 'function'
        ? googlePlayBilling.subscribe(() => refreshSubscription())
        : () => {};
    const onUpdate = () => refreshSubscription();
    window.addEventListener('playroom_license_update', onUpdate);
    return () => {
      unsubscribe();
      window.removeEventListener('playroom_license_update', onUpdate);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCheckAgain = () => {
    soundManager.playPop();
    setIsChecking(true);
    const sub = refreshSubscription();
    if (!sub.active) {
      setTimeout(() => setIsChecking(false), 600);
    }
  };

  const handleSubscribeClick = () => {
    soundManager.playPop();
    if (onOpenInquiry) {
      // The Hub wires this to the same SchoolPurchaseModal (subscription checkout).
      onOpenInquiry();
    } else {
      setIsPurchaseModalOpen(true);
    }
  };

  const handleReturnHome = () => {
    soundManager.playPop();
    onBackToPlayroom();
  };

  const accessEnded = Boolean(revocationNotice?.isRevoked || expiredNotice?.isExpired);

  // Active subscription: let the Hub in (enterHub fires from the effect above;
  // this is the fallback UI if the callback has not unmounted the gate yet).
  if (subscription?.active) {
    return (
      <div className="w-full max-w-lg mx-auto bg-white border-4 border-emerald-300 rounded-3xl shadow-2xl overflow-hidden text-slate-800 p-6 sm:p-8 text-center space-y-4">
        <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-300">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-lg sm:text-xl font-black text-slate-900 uppercase">
          School Subscription Active
        </h2>
        {subscription.expiryDate && (
          <p className="text-xs font-bold text-slate-600 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2 inline-block">
            Subscription renews {formatDate(subscription.expiryDate)}
            {typeof subscription.daysRemaining === 'number' &&
              ` (${subscription.daysRemaining} days remaining)`}
          </p>
        )}
        <button
          type="button"
          onClick={() => enterHub(subscription)}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm uppercase tracking-wider py-3 px-4 rounded-xl shadow-md transition-colors cursor-pointer"
        >
          Enter Educator Hub
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/40 backdrop-blur-xs overflow-y-auto select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-lg bg-white border-4 border-indigo-300 rounded-3xl shadow-2xl overflow-hidden text-slate-800 my-auto"
      >
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 p-5 sm:p-6 text-white text-center border-b-4 border-indigo-500 relative">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/10 border-2 border-indigo-300/40 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl mx-auto mb-2.5 shadow-inner">
            🏫
          </div>
          <div className="inline-flex items-center gap-1.5 bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full mb-2">
            <Lock className="w-3.5 h-3.5" />
            <span>School Administration Access</span>
          </div>
          <h1 className="text-lg sm:text-2xl font-black uppercase tracking-tight text-white drop-shadow-sm">
            Preschool Educator Hub
          </h1>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-7 space-y-5">
          <div className="bg-indigo-50/90 border-2 border-indigo-100 rounded-2xl p-4 text-center">
            <p className="text-xs sm:text-sm font-bold text-indigo-950 leading-relaxed">
              Preschool Educator Hub is reserved for schools with an active
              school subscription.
            </p>
            <p className="text-[11px] sm:text-xs text-slate-600 font-medium mt-1.5 leading-relaxed">
              Includes classroom curriculum tools, teacher assessments, lesson
              planners, visual activity guides, and printable worksheets.
            </p>
          </div>

          {accessEnded && (
            <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 text-center text-xs font-bold text-amber-900">
              Your previous school access has ended. Subscribe below to restore
              access to the Educator Hub.
            </div>
          )}

          {/* Subscription price card */}
          <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 text-center space-y-1">
            <p className="text-3xl font-black text-indigo-900">
              Rs 50,000<span className="text-base font-bold text-slate-600"> / month</span>
            </p>
            <p className="text-[11px] font-bold text-slate-500">
              Outside Pakistan the same subscription is $99/month (Google Play
              country-specific pricing).
            </p>
            <ul className="text-xs text-slate-600 space-y-1.5 font-medium text-left pt-3">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Full Page 1</strong> — all PlayBloom activities (Levels 1–6).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Full Page 2 — Preschool Educator Hub</strong> for your teachers.</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <span>Auto-renews monthly. Cancel anytime in Google Play — access locks automatically when the subscription ends.</span>
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>No license key needed — your Google Play subscription is your access. No login required.</span>
              </li>
            </ul>
          </div>

          <button
            id="gate-subscribe-btn"
            type="button"
            onClick={handleSubscribeClick}
            className="w-full bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 hover:from-indigo-500 hover:to-indigo-700 text-white font-black text-xs sm:text-sm tracking-wide py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <School className="w-4 h-4 stroke-[2.5]" />
            <span>Subscribe — Rs 50,000 / month</span>
          </button>

          <div className="flex items-center justify-between gap-2 text-xs">
            <button
              type="button"
              onClick={handleCheckAgain}
              disabled={isChecking}
              className="text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
              <span>Already subscribed? Check again</span>
            </button>
            <span className="text-slate-400 font-bold flex items-center gap-1">
              <CalendarClock className="w-3.5 h-3.5" />
              Manage in Google Play
            </span>
          </div>

          <button
            id="return-to-playroom-gate-btn"
            type="button"
            onClick={handleReturnHome}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider py-2 px-4 rounded-xl border border-slate-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to PlayBloom</span>
          </button>
        </div>
      </motion.div>

      {/* Subscription checkout (used when the Hub has not wired onOpenInquiry) */}
      <SchoolPurchaseModal
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
        onSubscribed={() => {
          setIsPurchaseModalOpen(false);
          refreshSubscription();
        }}
      />
    </div>
  );
};
