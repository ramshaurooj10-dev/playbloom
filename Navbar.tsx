import React, { useState, useEffect, useRef } from 'react';
import {
  Home,
  Volume2,
  VolumeX,
  Star,
  Sparkles,
  User,
  Lock,
  Search,
  X,
  ChevronRight,
  SlidersHorizontal,
  Mic,
  Check,
  Play,
  Menu,
  School,
  Calendar,
  LogOut,
  RotateCcw,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ActivityId } from '../types';
import { soundManager, VOICE_PERSONAS, VoicePersonaId, VoicePersona } from '../utils/audio';
import { ParentGateModal } from './common/ParentGate';
import { UserAccount } from './PremiumAuthModal';
import { SchoolLicense } from '../types/payment';
import { LEARNING_ITEMS, LearningItem } from '../data/learningItems';
import { useDeveloperMode } from '../utils/devMode';
import { checkActivityAccess } from '../utils/licenseService';
import { VoiceSelectorModal } from './common/VoiceSelectorModal';

interface NavbarProps {
  currentActivity: ActivityId;
  onNavigateHome: () => void;
  onSelectActivity?: (id: ActivityId) => void;
  starsCount: number;
  activityTitle?: string;
  activityEmoji?: string;
  onOpenPremiumModal?: (title?: string, level?: number, activityId?: string) => void;
  userAccount?: UserAccount | null;
  onOpenEducatorHub?: () => void;
  onLogout?: () => void;
  activeSchoolLicense?: SchoolLicense | null;
  onResetStars?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentActivity,
  onNavigateHome,
  onSelectActivity,
  starsCount,
  activityTitle,
  activityEmoji,
  onOpenPremiumModal,
  userAccount,
  onOpenEducatorHub,
  onLogout,
  activeSchoolLicense,
  onResetStars,
}) => {
  const [soundEnabled, setSoundEnabled] = useState(soundManager.enabled);
  const { isDeveloperMode: isDev } = useDeveloperMode();

  // Parent gate (Wave 2): OPTIONS, RESET and the Educator Hub entry are
  // adult-only. Once a parent passes the hold-gate, this Navbar session
  // remembers it so they are not asked again for every tap. RESET still
  // always asks for a confirmation dialog before wiping stars/progress.
  const [parentVerified, setParentVerified] = useState(false);
  const [parentGateOpen, setParentGateOpen] = useState(false);
  const [pendingParentAction, setPendingParentAction] = useState<'options' | 'reset' | 'hub' | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const requestParentAction = (action: 'options' | 'reset' | 'hub') => {
    soundManager.playPop();
    if (parentVerified) {
      runParentAction(action);
      return;
    }
    setPendingParentAction(action);
    setParentGateOpen(true);
  };

  const runParentAction = (action: 'options' | 'reset' | 'hub') => {
    if (action === 'options') {
      setIsControlsOpen((prev) => !prev);
    } else if (action === 'reset') {
      setShowResetConfirm(true);
    } else if (action === 'hub' && onOpenEducatorHub) {
      setIsControlsOpen(false);
      onOpenEducatorHub();
    }
  };

  const handleParentGateUnlock = () => {
    setParentVerified(true);
    setParentGateOpen(false);
    if (pendingParentAction) {
      runParentAction(pendingParentAction);
      setPendingParentAction(null);
    }
  };

  // Consolidated Quick Controls Bar State
  const [isControlsOpen, setIsControlsOpen] = useState(false);
  const controlsContainerRef = useRef<HTMLDivElement>(null);

  // Preschool Educator Hub Hamburger Menu State
  const [isEducatorMenuOpen, setIsEducatorMenuOpen] = useState(false);
  const educatorMenuRef = useRef<HTMLDivElement>(null);

  // Close Educator Menu on click outside or escape key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        isEducatorMenuOpen &&
        educatorMenuRef.current &&
        !educatorMenuRef.current.contains(e.target as Node)
      ) {
        const toggleBtn = document.getElementById('educator-hamburger-btn');
        if (toggleBtn && toggleBtn.contains(e.target as Node)) return;
        setIsEducatorMenuOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isEducatorMenuOpen) {
        setIsEducatorMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isEducatorMenuOpen]);

  const isSchoolActive = Boolean(
    typeof window !== 'undefined' && (() => {
      try {
        const raw = localStorage.getItem('playroom_active_school_license');
        if (!raw) return false;
        const lic = JSON.parse(raw);
        return lic && lic.status === 'ACTIVE' && lic.expiryDate && new Date(lic.expiryDate).getTime() > Date.now();
      } catch {
        return false;
      }
    })()
  );
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [activeVoicePersona, setActiveVoicePersona] = useState<VoicePersona>(() => soundManager.getActivePersona());

  useEffect(() => {
    const onVoiceChange = () => {
      setActiveVoicePersona(soundManager.getActivePersona());
    };
    window.addEventListener('playroom_voice_changed', onVoiceChange);
    return () => {
      window.removeEventListener('playroom_voice_changed', onVoiceChange);
    };
  }, []);

  // Search State inside Controls Bar
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSearchCategory, setSelectedSearchCategory] = useState<string>('All');
  const searchInputRef = useRef<HTMLInputElement>(null);

  const toggleSound = () => {
    const newStatus = !soundEnabled;
    soundManager.enabled = newStatus;
    setSoundEnabled(newStatus);
    if (newStatus) {
      soundManager.startBackgroundMusic();
      soundManager.playPop();
    } else {
      soundManager.stopSpeech();
      soundManager.stopBackgroundMusic();
    }
  };

  const handleHomeClick = () => {
    soundManager.playPop();
    setIsControlsOpen(false);
    onNavigateHome();
  };

  const handleSelectPersonaDirect = (persona: VoicePersona) => {
    soundManager.playPop();
    soundManager.setVoicePersona(persona.id, true);
    setActiveVoicePersona(soundManager.getActivePersona());
  };

  // Close controls bar when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        isControlsOpen &&
        controlsContainerRef.current &&
        !controlsContainerRef.current.contains(e.target as Node)
      ) {
        const toggleBtn = document.getElementById('quick-controls-toggle-btn');
        if (toggleBtn && toggleBtn.contains(e.target as Node)) return;
        setIsControlsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isControlsOpen) {
        setIsControlsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isControlsOpen]);

  // Filtered search results
  const searchResults = React.useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return LEARNING_ITEMS.filter((item) => {
      const matchesCategory =
        selectedSearchCategory === 'All' ||
        item.learningArea.toLowerCase().includes(selectedSearchCategory.toLowerCase()) ||
        (selectedSearchCategory === 'Free' && item.isFree) ||
        (selectedSearchCategory === 'Premium' && !item.isFree);

      if (!matchesCategory) return false;
      if (!query) return true;

      return (
        item.title.toLowerCase().includes(query) ||
        item.subtitle.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.learningArea.toLowerCase().includes(query) ||
        item.keywords.some((k) => k.toLowerCase().includes(query))
      );
    });
  }, [searchQuery, selectedSearchCategory]);

  const handleSelectSearchResult = (item: LearningItem) => {
    soundManager.playPop();
    soundManager.speak(item.title);
    setIsControlsOpen(false);
    setSearchQuery('');

    const levelNum = typeof item.level === 'number' ? item.level : parseInt(String(item.level), 10) || 1;
    const access = checkActivityAccess(item.id, levelNum, userAccount?.email, false);
    const hasAccess = (item.isFree && levelNum === 1) || access.hasAccess;

    if (hasAccess) {
      if (onSelectActivity) {
        onSelectActivity(item.id);
      }
    } else if (onOpenPremiumModal) {
      onOpenPremiumModal(item.title, item.level, item.id);
    }
  };

  const searchCategories = [
    { label: 'All', icon: '✨' },
    { label: 'Literacy', icon: '🔤' },
    { label: 'Math', icon: '🔢' },
    { label: 'Colors & Shapes', icon: '🎨' },
    { label: 'Logic', icon: '🧩' },
    { label: 'Observation', icon: '🔍' },
    { label: 'Motor', icon: '✍️' },
    { label: 'Free', icon: '⭐' },
  ];

  const currentSchoolLicense = activeSchoolLicense || (() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('playroom_active_school_license');
        if (raw) return JSON.parse(raw);
      } catch (_) {}
    }
    return null;
  })();

  const schoolName = currentSchoolLicense?.schoolName || userAccount?.schoolName || 'Partner School';
  const expiryRaw = currentSchoolLicense?.expiryDate || currentSchoolLicense?.validUntil;
  const expiryFormatted = expiryRaw
    ? new Date(expiryRaw).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Subscription active';

  return (
    <header className="sticky top-0 z-40 w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-[#FDE047] border-b-6 sm:border-b-8 border-[#EAB308] shadow-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
        {/* Left: Home Button or Playroom Logo */}
        {currentActivity !== 'home' && currentActivity !== 'welcome' ? (
          <button
            id="home-btn-nav"
            type="button"
            onClick={handleHomeClick}
            className="flex items-center gap-1.5 sm:gap-2 bg-[#6BCB77] hover:bg-[#58B368] text-white font-black px-3.5 sm:px-5 py-1.5 sm:py-2.5 rounded-2xl border-b-4 border-[#16A34A] active:border-b-0 active:translate-y-1 shadow-md transition-all cursor-pointer text-sm sm:text-lg tracking-wide uppercase shrink-0"
          >
            <Home className="w-4 h-4 sm:w-6 sm:h-6 stroke-[3]" />
            <span>HOME</span>
          </button>
        ) : (
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-white border-3 sm:border-4 border-amber-400 flex items-center justify-center text-lg sm:text-2xl shadow-inner">
              🧸
            </div>
            <span className="text-lg sm:text-3xl font-black text-[#1D4ED8] tracking-tight uppercase drop-shadow-xs">
              PLAYBLOOM
            </span>
          </div>
        )}

        {/* Center: Current Activity Indicator if inside an activity (hidden on educator hub) */}
        {currentActivity !== 'home' && currentActivity !== 'welcome' && currentActivity !== 'educator_hub' && activityTitle && (
          <div className="hidden md:flex items-center gap-2 bg-white/95 text-blue-900 px-4 py-1.5 rounded-full border-2 border-white shadow-xs font-black text-xs sm:text-sm uppercase max-w-[240px] lg:max-w-xs truncate">
            <span className="text-base">{activityEmoji}</span>
            <span className="truncate">{activityTitle}</span>
          </div>
        )}

        {/* Right Primary Controls */}
        {currentActivity === 'educator_hub' ? (
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 relative">
            {/* 1. STARS COUNTER - Child Progress Reward (VISIBLE) */}
            <div
              id="star-counter"
              className="flex items-center gap-1 sm:gap-1.5 bg-white text-amber-950 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-2xl border-2 sm:border-3 border-amber-300 shadow-xs font-black text-xs sm:text-base select-none"
              title="Stars collected (Child's Learning Progress)"
            >
              <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-400 text-amber-500 animate-pulse shrink-0" />
              <span className="leading-none">{starsCount}</span>
              <Sparkles className="w-3 h-3 text-amber-500 hidden sm:inline shrink-0" />
            </div>

            {/* 2. NEW HAMBURGER MENU (☰ Three-Line Navbar) */}
            <div className="relative">
              <button
                id="educator-hamburger-btn"
                type="button"
                onClick={() => {
                  soundManager.playPop();
                  setIsEducatorMenuOpen((prev) => !prev);
                }}
                className={`p-2 sm:p-2.5 rounded-2xl border-2 sm:border-3 transition-all cursor-pointer shadow-xs active:translate-y-0.5 flex items-center justify-center ${
                  isEducatorMenuOpen
                    ? 'bg-indigo-900 text-white border-indigo-950 shadow-inner'
                    : 'bg-white hover:bg-amber-100 text-slate-800 border-amber-400 hover:border-amber-500'
                }`}
                title="Educator Menu"
                aria-label="Preschool Educator Menu"
              >
                {isEducatorMenuOpen ? (
                  <X className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
                ) : (
                  <Menu className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
                )}
              </button>

              {/* Hamburger Dropdown Menu: Contains ONLY Help & Complain, Logout, School Name, Expires [date] */}
              <AnimatePresence>
                {isEducatorMenuOpen && (
                  <motion.div
                    ref={educatorMenuRef}
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white rounded-3xl border-4 border-amber-400 shadow-2xl p-4 sm:p-5 text-slate-800 space-y-3 z-50 select-none"
                  >
                    {/* School Name (Partner School) */}
                    <div className="bg-indigo-50/90 border-2 border-indigo-200 rounded-2xl p-3 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white border border-indigo-200 flex items-center justify-center shrink-0 text-indigo-700 shadow-xs">
                        <School className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[10px] font-black uppercase text-indigo-600 tracking-wider">
                          Partner School
                        </div>
                        <div className="text-xs sm:text-sm font-black text-indigo-950 truncate">
                          {schoolName}
                        </div>
                      </div>
                    </div>

                    {/* Subscription renews [date] (was: "License Expiration / Expires") */}
                    <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-3 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 text-slate-600 shadow-xs">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                          School Subscription
                        </div>
                        <div className="text-xs sm:text-sm font-black text-slate-800">
                          {expiryRaw ? `Subscription renews ${expiryFormatted}` : expiryFormatted}
                        </div>
                      </div>
                    </div>

                    {/* Logout */}
                    {onLogout && (
                      <button
                        id="educator-menu-logout-btn"
                        type="button"
                        onClick={() => {
                          soundManager.playPop();
                          setIsEducatorMenuOpen(false);
                          onLogout();
                        }}
                        className="w-full flex items-center gap-3 p-3 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 border-2 border-rose-300 transition-all cursor-pointer active:scale-98 shadow-xs text-left"
                      >
                        <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                          <LogOut className="w-5 h-5 stroke-[2.5]" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs sm:text-sm font-black text-rose-900">
                            Logout
                          </div>
                          <div className="text-[11px] font-semibold text-rose-700 truncate">
                            End school session & lock
                          </div>
                        </div>
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* 1. STARS COUNTER - Child Progress Reward (VISIBLE THROUGHOUT ALL APP) */}
            <div
              id="star-counter"
              className="flex items-center gap-1 sm:gap-1.5 bg-white text-amber-950 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-2xl border-2 sm:border-3 border-amber-300 shadow-xs font-black text-xs sm:text-base select-none"
              title="Stars collected (Child's Learning Progress)"
            >
              <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-400 text-amber-500 animate-pulse shrink-0" />
              <span className="leading-none">{starsCount}</span>
              <Sparkles className="w-3 h-3 text-amber-500 hidden sm:inline shrink-0" />
            </div>

            {/* 1B. RESET STARS BUTTON — parent-gated + confirmed (Wave 2).
                A child tapping this used to wipe all stars/progress instantly. */}
            <button
              id="navbar-reset-stars-btn"
              type="button"
              onClick={() => requestParentAction('reset')}
              className="flex items-center gap-1 bg-amber-50 hover:bg-amber-100 text-amber-950 border-2 sm:border-3 border-amber-300 hover:border-amber-400 px-2 sm:px-2.5 py-1.5 sm:py-2 rounded-2xl shadow-xs active:translate-y-0.5 transition-all cursor-pointer font-black text-xs select-none"
              title="Reset Earned Stars to 0 (parents only)"
              aria-label="Reset Earned Stars to Zero"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-700 stroke-[2.5]" />
              <span className="text-[11px] font-black uppercase tracking-tight">RESET</span>
            </button>

            {/* 2. PRESCHOOL EDUCATORS HUB (Page 2 Navigation) — parent-gated (Wave 2) */}
            {currentActivity !== 'welcome' && onOpenEducatorHub && (
              <button
                id="educators-hub-nav-btn"
                type="button"
                onClick={() => requestParentAction('hub')}
                className="flex items-center gap-1.5 bg-white hover:bg-indigo-50 text-indigo-900 border-2 sm:border-3 border-indigo-400 font-black text-xs px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-2xl shadow-xs hover:shadow-md transition-all cursor-pointer uppercase tracking-tight active:translate-y-0.5"
                title="Open Preschool Educators Hub (Page 2)"
              >
                <span className="text-sm sm:text-base">👩‍🏫</span>
                <span className="hidden sm:inline">PRESCHOOL EDUCATORS HUB</span>
                <span className="sm:hidden">EDUCATORS</span>
              </button>
            )}

            {/* 3. CONSOLIDATED QUICK CONTROLS BAR TOGGLE — parent-gated (Wave 2).
                Houses Voice, Sound, Premium, Search. Children must not reach purchases/settings. */}
            <button
              id="quick-controls-toggle-btn"
              type="button"
              onClick={() => requestParentAction('options')}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-2xl font-black text-xs border-2 sm:border-3 transition-all cursor-pointer uppercase tracking-tight active:translate-y-0.5 shadow-xs ${
                isControlsOpen
                  ? 'bg-indigo-900 text-white border-indigo-950 shadow-inner'
                  : 'bg-white hover:bg-amber-100 text-slate-800 border-amber-400 hover:border-amber-500'
              }`}
              title="Open Quick Settings & Voice Bar"
              aria-label="App Controls & Settings"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
              <span className="hidden sm:inline">{isControlsOpen ? 'CLOSE' : 'OPTIONS'}</span>
            </button>

          </div>
        )}
      </div>

      {/* CONSOLIDATED QUICK CONTROLS BAR (VOICE SELECT, SOUND, PREMIUM, SEARCH) */}
      <AnimatePresence>
        {isControlsOpen && (
          <motion.div
            ref={controlsContainerRef}
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="max-w-4xl mx-auto mt-3 bg-white/98 backdrop-blur-md rounded-3xl border-4 border-amber-400 shadow-2xl p-4 sm:p-5 text-slate-800 space-y-4"
          >
            {/* Top Bar of Quick Menu */}
            <div className="flex items-center justify-between border-b-2 border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">⚙️</span>
                <h3 className="text-sm sm:text-base font-black uppercase text-indigo-950 tracking-tight">
                  App Options & Quick Controls
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsControlsOpen(false)}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl cursor-pointer transition-colors"
                title="Close controls bar"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            {/* Grid of Main Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
              {/* 1. NARRATOR VOICE SELECTOR */}
              <div className="bg-purple-50/70 border-2 border-purple-200 rounded-2xl p-3.5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Mic className="w-4 h-4 text-purple-700 stroke-[2.5]" />
                    <span className="text-xs font-black uppercase text-purple-950">Narrator Voice</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playPop();
                      setIsVoiceModalOpen(true);
                    }}
                    className="text-[11px] font-black uppercase text-purple-700 hover:text-purple-900 underline cursor-pointer"
                  >
                    Test & Settings
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {VOICE_PERSONAS.slice(0, 3).map((persona) => {
                    const isActive = activeVoicePersona.id === persona.id;
                    return (
                      <button
                        key={persona.id}
                        type="button"
                        onClick={() => handleSelectPersonaDirect(persona)}
                        className={`p-2 rounded-xl text-center transition-all cursor-pointer border-2 flex flex-col items-center justify-center gap-1 ${
                          isActive
                            ? 'bg-purple-600 text-white border-purple-700 shadow-sm font-black'
                            : 'bg-white hover:bg-purple-100 text-slate-700 border-purple-200 font-bold'
                        }`}
                      >
                        <span className="text-xl leading-none">{persona.avatar}</span>
                        <span className="text-[11px] leading-tight truncate w-full">{persona.shortName}</span>
                        {isActive && <Check className="w-3 h-3 text-amber-300 stroke-[3]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. SOUND & MUSIC TOGGLE */}
              <div className="bg-sky-50/70 border-2 border-sky-200 rounded-2xl p-3.5 space-y-2.5 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">🔊</span>
                    <span className="text-xs font-black uppercase text-sky-950">Audio & Music</span>
                  </div>
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                      soundEnabled
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : 'bg-rose-100 text-rose-800 border-rose-300'
                    }`}
                  >
                    {soundEnabled ? 'Active' : 'Muted'}
                  </span>
                </div>

                <button
                  type="button"
                  id="sound-toggle-btn"
                  onClick={toggleSound}
                  className={`w-full py-2.5 px-3 rounded-xl font-black text-xs uppercase flex items-center justify-center gap-2 transition-all cursor-pointer border-2 shadow-xs ${
                    soundEnabled
                      ? 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-600 active:translate-y-0.5'
                      : 'bg-slate-200 hover:bg-slate-300 text-slate-700 border-slate-300 active:translate-y-0.5'
                  }`}
                >
                  {soundEnabled ? (
                    <>
                      <Volume2 className="w-4 h-4 stroke-[2.5]" />
                      <span>Sound Effects ON (Tap to Mute)</span>
                    </>
                  ) : (
                    <>
                      <VolumeX className="w-4 h-4 stroke-[2.5]" />
                      <span>Muted (Tap to Unmute Sounds)</span>
                    </>
                  )}
                </button>
              </div>

              {/* 3. ACCESS & MEMBERSHIP (PREMIUM / SCHOOL KEY) */}
              <div className="bg-amber-50/70 border-2 border-amber-200 rounded-2xl p-3.5 space-y-2.5 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">👑</span>
                    <span className="text-xs font-black uppercase text-amber-950">App Membership</span>
                  </div>
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                      isSchoolActive
                        ? 'bg-indigo-100 text-indigo-800 border-indigo-300'
                        : userAccount?.isLoggedIn
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : 'bg-amber-100 text-amber-900 border-amber-300'
                    }`}
                  >
                    {isSchoolActive ? 'School Subscription' : userAccount?.isLoggedIn ? 'Parent Member' : 'Free Mode'}
                  </span>
                </div>

                {onOpenPremiumModal && (
                  <button
                    type="button"
                    id="parent-account-btn"
                    onClick={() => {
                      soundManager.playPop();
                      setIsControlsOpen(false);
                      onOpenPremiumModal();
                    }}
                    className="w-full py-2.5 px-3 bg-amber-400 hover:bg-amber-300 text-amber-950 border-2 border-amber-500 rounded-xl font-black text-xs uppercase flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:translate-y-0.5"
                  >
                    {isSchoolActive || userAccount?.isLoggedIn ? (
                      <>
                        <User className="w-4 h-4 stroke-[2.5]" />
                        <span>Manage Account & Subscription</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 stroke-[2.5]" />
                        <span>Unlock Premium / School Subscription</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* 4. OFFLINE PLAY (info only — Play Store is the install; there is
                  no "Install to Device" button in the Play app) */}
              <div className="bg-pink-50/70 border-2 border-pink-200 rounded-2xl p-3.5 space-y-2.5 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">📱</span>
                    <span className="text-xs font-black uppercase text-pink-950">Offline Play</span>
                  </div>
                </div>
                <p className="text-[11px] font-bold text-pink-900 leading-relaxed">
                  Your unlocked activities still work offline. Buying needs internet.
                </p>
              </div>
            </div>

            {/* Search Activities Section inside Controls */}
            <div className="pt-2 border-t-2 border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Search className="w-4 h-4 text-blue-600 stroke-[2.5]" />
                  <span className="text-xs font-black uppercase text-slate-800">
                    Find Games & Learning Activities
                  </span>
                </div>
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="text-[11px] font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    Clear Search
                  </button>
                )}
              </div>

              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  id="activity-search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search games, rhymes, letters, numbers, colors..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 hover:bg-white focus:bg-white border-2 border-slate-200 focus:border-blue-500 rounded-2xl text-xs sm:text-sm font-bold text-slate-800 placeholder-slate-400 outline-none transition shadow-inner"
                />
              </div>

              {/* Category Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {searchCategories.map((cat) => {
                  const isActive = selectedSearchCategory === cat.label;
                  return (
                    <button
                      key={cat.label}
                      type="button"
                      onClick={() => {
                        soundManager.playPop();
                        setSelectedSearchCategory(cat.label);
                      }}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-black flex items-center gap-1 whitespace-nowrap transition cursor-pointer border ${
                        isActive
                          ? 'bg-blue-600 text-white border-blue-700 shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                      }`}
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Results List if search query or specific category is selected */}
              {(searchQuery || selectedSearchCategory !== 'All') && (
                <div className="max-h-48 overflow-y-auto pr-1 space-y-1.5 pt-1">
                  {searchResults.length > 0 ? (
                    searchResults.slice(0, 8).map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelectSearchResult(item)}
                        className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 transition text-left cursor-pointer group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-xl flex-shrink-0">{item.emoji}</span>
                          <div className="min-w-0">
                            <span className="font-black text-slate-800 text-xs group-hover:text-blue-700 truncate block">
                              {item.title}
                            </span>
                            <span className="text-[10px] text-slate-400 truncate block">
                              {item.learningArea}
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] font-black uppercase text-blue-600 flex items-center gap-0.5">
                          Play <ChevronRight className="w-3 h-3" />
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="text-center py-4 text-xs font-bold text-slate-400">
                      No activities match your search.
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Voice Narrator Full Settings Modal */}
      <VoiceSelectorModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
      />

      {/* Parent gate for OPTIONS / RESET / Educator Hub entry */}
      <ParentGateModal
        isOpen={parentGateOpen}
        onClose={() => {
          setParentGateOpen(false);
          setPendingParentAction(null);
        }}
        onUnlock={handleParentGateUnlock}
        title="Parents Only"
      />

      {/* RESET confirmation — shown only after the parent gate passes */}
      {showResetConfirm && (
        <div
          className="fixed inset-0 z-[100] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 select-none"
          role="dialog"
          aria-modal="true"
          aria-label="Confirm reset"
        >
          <div className="bg-white rounded-3xl border-4 border-amber-400 shadow-2xl p-6 max-w-sm w-full text-center space-y-4">
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">
              Reset all stars?
            </h3>
            <p className="text-sm font-bold text-slate-600">
              Are you sure? This deletes all stars and completed activities.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowResetConfirm(false);
                  soundManager.playPop();
                  if (onResetStars) onResetStars();
                }}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black uppercase cursor-pointer"
              >
                Yes, delete all
              </button>
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-black uppercase cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
