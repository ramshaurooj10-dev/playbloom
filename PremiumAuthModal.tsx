import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Star, Sparkles, User, Mail, ShieldCheck, CheckCircle2, ArrowRight, X, Smartphone } from 'lucide-react';
import { soundManager } from '../utils/audio';
import { isDevPreviewEnvironment } from '../utils/devMode';

export interface UserAccount {
  id?: string;
  email: string;
  isLoggedIn: boolean;
  role?: 'user' | 'parent' | 'school_admin' | 'super_admin' | 'admin';
  hasPage1Access?: boolean;
  hasPage2SchoolAccess?: boolean;
  schoolName?: string;
  licenseKey?: string;
}

interface PremiumAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedActivityTitle?: string;
  userAccount: UserAccount | null;
  onLoginSuccess: (email: string) => void;
  onLogout: () => void;
  onLaunchActivityDirectly?: () => void;
}

export const PremiumAuthModal: React.FC<PremiumAuthModalProps> = ({
  isOpen,
  onClose,
  selectedActivityTitle,
  userAccount,
  onLoginSuccess,
  onLogout,
  onLaunchActivityDirectly,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [noticeToast, setNoticeToast] = useState('');

  if (!isOpen) return null;

  const handleModalClose = () => {
    soundManager.playPop();
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (!password || password.length < 4) {
      setErrorMsg('Please enter a password (at least 4 characters).');
      return;
    }

    if (activeTab === 'signup' && password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please try again.');
      return;
    }

    soundManager.playPop();
    soundManager.speak('Account connected! Welcome to Premium Learning!');
    onLoginSuccess(email.trim());
  };

  const handleUpgradeClick = () => {
    soundManager.playPop();
    soundManager.speak('Monthly Premium subscription coming soon!');
    setNoticeToast('Monthly Premium Subscription coming soon! 🚀 Thank you for choosing PlayBloom.');
    setTimeout(() => {
      setNoticeToast('');
    }, 4000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg bg-white border-[6px] border-[#3B82F6] rounded-3xl shadow-2xl overflow-hidden my-8"
        >
          {/* Top Header Banner */}
          <div className="bg-gradient-to-r from-[#2563EB] via-[#3B82F6] to-[#60A5FA] p-5 text-white text-center relative border-b-4 border-[#1D4ED8]">
            <button
              onClick={handleModalClose}
              type="button"
              className="absolute top-3 right-3 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-colors cursor-pointer"
              title="Close Modal"
            >
              <X className="w-5 h-5 stroke-[3]" />
            </button>

            <div className="inline-flex items-center justify-center w-14 h-14 bg-amber-400 border-4 border-white rounded-full mb-2 shadow-md">
              {userAccount?.isLoggedIn ? (
                <Sparkles className="w-8 h-8 text-slate-900 fill-amber-300 animate-pulse" />
              ) : (
                <Lock className="w-8 h-8 text-slate-900 stroke-[2.5]" />
              )}
            </div>

            {selectedActivityTitle && (
              <div className="inline-block bg-amber-300 text-amber-950 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wide mb-1 border border-amber-400 shadow-sm">
                ⭐ {selectedActivityTitle}
              </div>
            )}

            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white drop-shadow-sm">
              {userAccount?.isLoggedIn ? 'Premium Learning' : 'Unlock More Learning Fun!'}
            </h2>
            <p className="text-xs sm:text-sm font-bold text-blue-100 mt-1">
              {userAccount?.isLoggedIn
                ? 'Unlock all our new educational activities.'
                : 'Create an account to access Premium activities.'}
            </p>
          </div>

          {/* Body Content */}
          <div className="p-6">
            {/* Developer Preview Environment Banner */}
            {isDevPreviewEnvironment() && (
              <div className="mb-4 p-3 bg-amber-100 border-2 border-amber-400 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-2 text-amber-950 font-black text-xs shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🛠️</span>
                  <span>Developer Preview Active: Test all activities directly.</span>
                </div>
                {onLaunchActivityDirectly && (
                  <button
                    onClick={() => {
                      soundManager.playPop();
                      onLaunchActivityDirectly();
                      onClose();
                    }}
                    className="px-3 py-1.5 bg-amber-400 hover:bg-amber-500 text-amber-950 font-black rounded-xl border border-amber-600 shadow-xs active:scale-95 transition-transform text-xs shrink-0 cursor-pointer"
                  >
                    Test Activity Now
                  </button>
                )}
              </div>
            )}

            {/* Toast Notification */}
            {noticeToast && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-amber-100 border-2 border-amber-400 text-amber-900 text-xs sm:text-sm font-black rounded-2xl flex items-center justify-between gap-2 shadow-sm"
              >
                <span>{noticeToast}</span>
                <span className="text-lg">⭐</span>
              </motion.div>
            )}

            {userAccount?.isLoggedIn ? (
              /* LOGGED IN VIEW */
              <div className="flex flex-col items-center text-center py-2 space-y-5">
                <div className="w-full bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 flex items-center gap-3 text-left">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-black text-blue-500 uppercase tracking-wider">
                      Connected Account
                    </span>
                    <span className="text-sm font-black text-slate-800 break-all">
                      {userAccount.email}
                    </span>
                  </div>
                </div>

                <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-3.5 flex items-center justify-center gap-2 text-emerald-900 font-black text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Your account is ready!</span>
                </div>

                <button
                  type="button"
                  onClick={handleUpgradeClick}
                  className="w-full bg-[#EC4899] hover:bg-[#DB2777] text-white font-black text-lg py-3.5 px-6 rounded-2xl border-b-6 border-[#BE185D] shadow-xl active:translate-y-1 transition-all cursor-pointer uppercase tracking-wider flex items-center justify-center gap-2 group"
                >
                  <Sparkles className="w-6 h-6 fill-amber-300 stroke-white group-hover:rotate-12 transition-transform" />
                  <span>Upgrade to Premium</span>
                </button>

                <button
                  type="button"
                  onClick={handleModalClose}
                  className="text-xs font-black text-slate-500 hover:text-slate-800 uppercase tracking-wider pt-2 cursor-pointer"
                >
                  Back to PlayBloom
                </button>
              </div>
            ) : (
              /* LOGIN / SIGNUP VIEW */
              <div className="space-y-4">
                {/* Tab Switcher */}
                <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-2xl border-2 border-slate-200">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('signup');
                      setErrorMsg('');
                    }}
                    className={`py-2 text-xs sm:text-sm font-black uppercase rounded-xl transition-all cursor-pointer ${
                      activeTab === 'signup'
                        ? 'bg-[#3B82F6] text-white shadow-md'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Create Account
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('login');
                      setErrorMsg('');
                    }}
                    className={`py-2 text-xs sm:text-sm font-black uppercase rounded-xl transition-all cursor-pointer ${
                      activeTab === 'login'
                        ? 'bg-[#3B82F6] text-white shadow-md'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Log In
                  </button>
                </div>

                {errorMsg && (
                  <div className="p-3 bg-rose-100 border-2 border-rose-300 text-rose-800 text-xs font-bold rounded-2xl">
                    {errorMsg}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3.5 pt-1">
                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wide mb-1">
                      Parent / Guardian Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="parent@example.com"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-2 border-slate-300 focus:border-blue-500 rounded-2xl text-sm font-bold text-slate-800 outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wide mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-2 border-slate-300 focus:border-blue-500 rounded-2xl text-sm font-bold text-slate-800 outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {activeTab === 'signup' && (
                    <div>
                      <label className="block text-xs font-black text-slate-700 uppercase tracking-wide mb-1">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        <input
                          type="password"
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-2 border-slate-300 focus:border-blue-500 rounded-2xl text-sm font-bold text-slate-800 outline-none transition-colors"
                        />
                      </div>
                    </div>
                  )}

                  <div className="pt-2 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleModalClose}
                      className="w-1/3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-black py-3 rounded-2xl border-b-4 border-slate-300 active:translate-y-0.5 text-xs sm:text-sm uppercase tracking-wide transition-all cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="w-2/3 bg-[#10B981] hover:bg-[#059669] text-white font-black py-3 rounded-2xl border-b-4 border-[#047857] shadow-lg active:translate-y-0.5 text-xs sm:text-sm uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>{activeTab === 'signup' ? 'Create Account' : 'Log In'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
