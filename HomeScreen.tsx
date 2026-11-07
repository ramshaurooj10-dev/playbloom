import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ActivityId, ActivityInfo } from '../types';
import { soundManager } from '../utils/audio';
import {
  Lock,
  Star,
  CheckCircle2,
  BookOpen,
  Smile,
  X,
  Play,
  Award,
  Sparkles,
  Clock,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { useDeveloperMode } from '../utils/devMode';
import {
  getCompletedToday,
  getCompletedAllTime,
  getGlobalStarsCount,
  getRecentlyCompleted,
  getLearningAreaStats,
  RecentCompletion,
} from '../utils/dailyProgress';
import {
  LEARNING_ITEMS,
  LEARNING_AREAS_INFO,
  LEVELS,
  LearningItem,
  LearningAreaDetail,
} from '../data/learningItems';
import { BubblePopIcon } from './common/BubblePopIcon';
import { BalloonIllustration } from './common/BalloonIllustration';
import { FeedAnimalIcon } from './common/FeedAnimalIcon';
import { CatchStarsIcon } from './common/CatchStarsIcon';
import { CleanRoomIcon } from './common/CleanRoomIcon';
import { DetectiveSpyIcon } from './common/DetectiveSpyIcon';
import { SpyHiddenObjectsIcon } from './common/SpyHiddenObjectsIcon';
import { BuildGardenIcon } from './common/BuildGardenIcon';
import { WhatComesTogetherIcon } from './common/WhatComesTogetherIcon';
import { SweetSourIcon } from './common/SweetSourIcon';
import { AnimalParentsBabiesIcon } from './common/AnimalParentsBabiesIcon';
import { FishHuntingIcon } from './common/FishHuntingIcon';
import { ColorFunIcon } from './common/ColorFunIcon';
import { KiteCountIcon } from './common/KiteCountIcon';
import { TrafficLightIcon } from './common/TrafficLightIcon';
import { IdentifyItemsCardIcon } from './common/IdentifyItemsCardIcon';
import { FindDifferenceIcon } from './common/FindDifferenceIcon';
import { AddCountFunIcon } from './common/AddCountFunIcon';
import { SortItFunIcon } from './common/SortItFunIcon';
import { AboutPlayroomModal } from './common/AboutPlayroomModal';
import { ParentGate } from './common/ParentGate';
import { UserAccount } from './PremiumAuthModal';
import { isAdminAccount } from '../utils/userAuthService';
import { checkLevelAccess, checkActivityAccess } from '../utils/licenseService';
import { googlePlayBilling } from '../services/billing/GooglePlayBillingService';
import {
  ACTIVITIES,
  PREMIUM_ACTIVITIES,
  PREMIUM_ACTIVITY_SKILLS,
  PremiumActivityInfo,
} from '../data/activitiesList';
import { PremiumCardIllustration } from './common/PremiumCardIllustration';

export {
  ACTIVITIES,
  PREMIUM_ACTIVITIES,
  PREMIUM_ACTIVITY_SKILLS,
  PremiumCardIllustration,
};
export type { PremiumActivityInfo };

interface HomeScreenProps {
  onSelectActivity: (id: ActivityId) => void;
  onOpenPremiumModal?: (title?: string, level?: number, activityId?: string) => void;
  completedCount?: number;
  totalStars?: number;
  userAccount?: UserAccount | null;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onSelectActivity,
  onOpenPremiumModal,
  completedCount = 0,
  totalStars,
  userAccount,
}) => {
  const [selectedAreaFilter, setSelectedAreaFilter] = useState<string | null>(null);
  const [openedAreaModal, setOpenedAreaModal] = useState<LearningAreaDetail | null>(null);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  // Parent-gated adult progress section (Wave 2): the 8 learning-area cards
  // with domain progress / outcomes sit behind the parent gate. The child's
  // "Activities Completed Today" strip below stays visible to everyone.
  const [parentProgressUnlocked, setParentProgressUnlocked] = useState(false);
  const [todayCompleted, setTodayCompleted] = useState<ActivityId[]>([]);
  const [allTimeCompleted, setAllTimeCompleted] = useState<ActivityId[]>([]);
  const [recentCompletions, setRecentCompletions] = useState<RecentCompletion[]>([]);
  const [starsTotal, setStarsTotal] = useState<number>(() => totalStars ?? getGlobalStarsCount());
  const { isDeveloperMode: isDev } = useDeveloperMode();
  const [, setBillingUpdateKey] = useState(0);
  const [isDeviceOnline, setIsDeviceOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });

  // Subscribe to real-time Google Play Billing and License entitlement changes and network state
  useEffect(() => {
    const handleUpdate = () => {
      setBillingUpdateKey((prev) => prev + 1);
    };

    const handleOnline = () => {
      setIsDeviceOnline(true);
      setBillingUpdateKey((prev) => prev + 1);
    };

    const handleOffline = () => {
      setIsDeviceOnline(false);
      setBillingUpdateKey((prev) => prev + 1);
    };

    const handleStarsReset = () => {
      setStarsTotal(0);
      setAllTimeCompleted([]);
      setTodayCompleted([]);
      setRecentCompletions([]);
    };

    const unsubscribe = googlePlayBilling.subscribe(handleUpdate);
    window.addEventListener('playroom_license_update', handleUpdate);
    window.addEventListener('playroom_admin_view_change', handleUpdate);
    window.addEventListener('playroom_stars_reset', handleStarsReset);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      unsubscribe();
      window.removeEventListener('playroom_license_update', handleUpdate);
      window.removeEventListener('playroom_admin_view_change', handleUpdate);
      window.removeEventListener('playroom_stars_reset', handleStarsReset);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    soundManager.speak("Welcome to PlayBloom! Choose an activity!");

    // Load real today, all-time, and star progress
    setTodayCompleted(getCompletedToday());
    setAllTimeCompleted(getCompletedAllTime());
    setRecentCompletions(getRecentlyCompleted());
    setStarsTotal(getGlobalStarsCount());
  }, [totalStars]);

  // Learning Area Progress Statistics
  const areaStats = useMemo(() => {
    return getLearningAreaStats(allTimeCompleted);
  }, [allTimeCompleted]);

  // Filtered items based on learning area filter if selected
  const filteredItems = useMemo(() => {
    if (selectedAreaFilter !== null) {
      return LEARNING_ITEMS.filter((item) =>
        item.learningArea.toLowerCase().includes(selectedAreaFilter.toLowerCase()) ||
        selectedAreaFilter.toLowerCase().includes(item.learningArea.toLowerCase())
      );
    }
    return LEARNING_ITEMS;
  }, [selectedAreaFilter]);

  const handleItemClick = (item: LearningItem) => {
    soundManager.playPop();
    soundManager.speak(item.title);

    // Check authoritative dynamic license access
    const levelNum = typeof item.level === 'number' ? item.level : parseInt(String(item.level), 10) || 1;
    const access = checkActivityAccess(item.id, levelNum, userAccount?.email);

    if (access.allowed) {
      onSelectActivity(item.id);
    } else if (onOpenPremiumModal) {
      onOpenPremiumModal(item.title, item.level, item.id);
    }
  };

  const handleAreaCardClick = (area: LearningAreaDetail) => {
    // Adult progress detail lives behind the parent gate.
    if (!parentProgressUnlocked) return;
    soundManager.playPop();
    setOpenedAreaModal(area);
  };

  const handleFilterByArea = (areaTitle: string) => {
    soundManager.playPop();
    if (selectedAreaFilter === areaTitle) {
      setSelectedAreaFilter(null);
    } else {
      setSelectedAreaFilter(areaTitle);
      const el = document.getElementById('activities-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
    setOpenedAreaModal(null);
  };

  const renderActivityCard = (item: LearningItem, index: number) => {
    const isCompleted = allTimeCompleted.includes(item.id);
    const levelNum = typeof item.level === 'number' ? item.level : parseInt(String(item.level), 10) || 1;
    const access = checkActivityAccess(item.id, levelNum, userAccount?.email);
    const hasAccess = access.allowed;
    const isOffline = !isDeviceOnline;

    return (
      <motion.button
        key={item.id}
        id={`learning-card-${item.id}`}
        type="button"
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: (index % 6) * 0.04 }}
        onClick={() => handleItemClick(item)}
        className={`group relative flex flex-col items-center justify-center p-6 rounded-3xl ${item.color} border-[6px] border-white border-b-[12px] ${item.borderColor} ${item.shadowColor} shadow-2xl transition-all cursor-pointer hover:scale-[1.03] active:border-b-[4px] active:translate-y-[8px] text-left w-full`}
      >
        {/* Level & Status Sticker Badge */}
        <div className="absolute -top-3 -right-3 flex items-center gap-1.5">
          <span
            className={`text-white border-2 border-white px-3 py-1 rounded-full font-black text-xs uppercase tracking-wider flex items-center gap-1 shadow-md transform rotate-3 ${
              item.isFree
                ? 'bg-emerald-500'
                : hasAccess
                ? 'bg-emerald-600'
                : isOffline
                ? 'bg-rose-500 text-white'
                : 'bg-amber-400 text-amber-950'
            }`}
          >
            {item.isFree ? (
              <>
                <Star className="w-3.5 h-3.5 fill-amber-300 stroke-emerald-900" />
                <span>L1 FREE</span>
              </>
            ) : hasAccess ? (
              <>
                <Star className="w-3.5 h-3.5 fill-white stroke-emerald-900" />
                <span>L{item.level} UNLOCKED</span>
              </>
            ) : isOffline ? (
              <>
                <Lock className="w-3.5 h-3.5 stroke-white stroke-[2.5]" />
                <span>L{item.level} OFFLINE LOCKED</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5 stroke-amber-950 stroke-[2.5]" />
                <span>L{item.level} PREMIUM</span>
              </>
            )}
          </span>
        </div>

        {/* Completion Checkmark */}
        {isCompleted && (
          <div className="absolute top-3 left-3 bg-emerald-500 text-white rounded-full p-1.5 shadow-md border-2 border-white" title="Completed!">
            <CheckCircle2 className="w-4 h-4 stroke-[3]" />
          </div>
        )}

        {/* Large Circular Icon Container */}
        <div className="w-24 h-24 mb-4 rounded-full bg-white border-4 border-white/80 flex items-center justify-center text-5xl shadow-inner group-hover:rotate-6 transition-transform relative">
          <PremiumCardIllustration id={item.id} />
        </div>

        {/* Learning Area Pill */}
        <div className="mb-2 bg-black/25 backdrop-blur-xs text-white text-[11px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full border border-white/30">
          {item.learningArea}
        </div>

        {/* Title & Subtitle */}
        <h3 className="text-xl sm:text-2xl font-black tracking-wide mb-1 text-center uppercase drop-shadow-sm text-white">
          {item.title}
        </h3>
        <p className="text-xs font-bold text-center px-3 py-1 rounded-full border border-white/40 bg-black/15 text-white/90 mb-3">
          {item.subtitle}
        </p>

        {/* Action Button Pill */}
        <div
          className={`mt-2 flex items-center gap-1.5 text-xs font-black uppercase tracking-wider px-5 py-2 rounded-full shadow-md transition-colors ${
            hasAccess
              ? 'bg-white text-slate-900 group-hover:bg-amber-300'
              : 'bg-amber-300 text-amber-950 border border-amber-400 group-hover:bg-amber-400'
          }`}
        >
          {hasAccess ? (
            <>
              <span>TAP TO PLAY</span>
              <span>➔</span>
            </>
          ) : (
            <>
              <Lock className="w-3.5 h-3.5 stroke-[3]" />
              <span>UNLOCK ACTIVITY</span>
            </>
          )}
        </div>
      </motion.button>
    );
  };

  return (
    <div id="playroom-home" className="relative w-full min-h-[calc(100vh-100px)] flex flex-col justify-between overflow-hidden">
      {/* 2D Cartoon Playroom Background Walls & Floor */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#BAE6FD] via-[#E0F2FE] to-[#FEF08A] -z-20" />

      {/* Decorative Clouds floating in sky blue wall area */}
      <div className="absolute top-4 left-6 text-4xl opacity-80 animate-pulse pointer-events-none -z-10">☁️</div>
      <div className="absolute top-10 right-12 text-5xl opacity-80 animate-bounce delay-300 pointer-events-none -z-10">☁️</div>
      <div className="absolute top-2 left-1/3 text-3xl opacity-70 pointer-events-none -z-10">⭐</div>
      <div className="absolute top-8 right-1/3 text-3xl opacity-70 pointer-events-none -z-10">✨</div>

      {/* Main Playroom Container */}
      <div className="max-w-6xl mx-auto w-full px-4 pt-4 pb-16 flex flex-col items-center">
        {/* Playroom Title & Wooden Toy Shelf Banner */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: -15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center mb-6 w-full flex flex-col items-center"
        >
          {/* Toy Shelf Visual Bar — decorative only (Wave 2): the emojis used
              to look tappable (cursor-pointer + hover zoom) but did nothing.
              They are now plain decoration with no pointer affordance. */}
          <div className="relative w-full max-w-2xl bg-[#FDE047] border-4 border-[#EAB308] rounded-2xl p-2.5 shadow-md mb-3 flex items-center justify-around" aria-hidden="true">
            <span className="text-3xl sm:text-4xl">🧸</span>
            <span className="text-3xl sm:text-4xl">🚀</span>
            <span className="text-3xl sm:text-4xl">📚</span>
            <span className="text-3xl sm:text-4xl">🧩</span>
            <span className="text-3xl sm:text-4xl">⚽</span>
            <span className="text-3xl sm:text-4xl">🎨</span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-[#1D4ED8] tracking-tight drop-shadow-[0_6px_0_rgba(255,255,255,1)] mb-2">
            PLAYBLOOM
          </h1>
          <div className="inline-block bg-[#2563EB] text-white font-black text-sm sm:text-base md:text-lg uppercase tracking-wider px-6 py-2 rounded-full border-4 border-white shadow-lg transform -rotate-1">
            LET'S LEARN AND PLAY!
          </div>
        </motion.div>

        {/* Active Filter Indicator if Area Filter is Selected */}
        {selectedAreaFilter !== null && (
          <div className="flex items-center justify-between gap-3 mb-6 bg-purple-100 text-purple-950 px-5 py-2.5 rounded-full border-2 border-purple-300 font-black text-xs sm:text-sm shadow-sm w-full max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-base">🔍</span>
              <span>Showing: <strong>{selectedAreaFilter}</strong> ({filteredItems.length} activities)</span>
            </div>
            <button
              type="button"
              onClick={() => setSelectedAreaFilter(null)}
              className="bg-purple-600 text-white hover:bg-purple-700 px-3 py-1 rounded-full text-xs font-black cursor-pointer shadow-xs transition-colors"
            >
              Show All Levels 1–6
            </button>
          </div>
        )}

        {/* Offline Mode Status Banner — honest wording (Wave 2):
            unlocked activities keep working offline; only buying needs internet.
            (Play Store handles app updates — no "Update Now" banner any more.) */}
        {!isDeviceOnline && (
          <div className="w-full max-w-3xl mb-8 bg-slate-900 text-white rounded-3xl border-4 border-amber-400 p-4 sm:p-5 shadow-xl flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border-2 border-rose-400 flex items-center justify-center shrink-0 text-rose-400">
              <Lock className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div className="flex-1 space-y-0.5">
              <div className="inline-block bg-amber-400 text-slate-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider">
                Offline Mode Active
              </div>
              <h4 className="text-base font-black text-white uppercase tracking-tight">
                You&apos;re offline
              </h4>
              <p className="text-xs font-semibold text-slate-300">
                Your unlocked activities still work. Buying needs internet.
              </p>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* [ALL LEVEL 1–6 ACTIVITIES]                                               */}
        {/* ========================================================================= */}
        <div id="activities-section" className="w-full mb-12">
          {selectedAreaFilter !== null ? (
            /* Filtered View */
            <div className="w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 w-full">
                {filteredItems.map((item, index) => renderActivityCard(item, index))}
              </div>
            </div>
          ) : (
            /* Standard Full Levels 1 to 6 View */
            <div className="w-full space-y-12">
              {LEVELS.map((lvl) => {
                const levelItems = LEARNING_ITEMS.filter((item) => item.level === lvl.level);
                if (levelItems.length === 0) return null;
                return (
                  <div key={lvl.level} className="w-full">
                    {/* Level Header Banner */}
                    <div className={`w-full rounded-3xl ${lvl.bgColor} border-4 ${lvl.borderColor} p-5 sm:p-6 mb-6 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5`}>
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-white border-2 border-slate-200 flex items-center justify-center text-3xl shadow-inner shrink-0">
                          {lvl.level === 1 ? '🌟' : lvl.level === 2 ? '🔢' : lvl.level === 3 ? '✏️' : lvl.level === 4 ? '🍎' : lvl.level === 5 ? '🌿' : '🏆'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs font-black uppercase tracking-widest px-3 py-0.5 rounded-full border ${
                              lvl.isFree ? 'bg-emerald-500 text-white border-emerald-600' : 'bg-amber-400 text-amber-950 border-amber-500'
                            }`}>
                              {lvl.badge}
                            </span>
                            <span className="text-xs font-black text-slate-500 uppercase">{lvl.itemRange}</span>
                          </div>
                          <h3 className={`text-2xl sm:text-3xl font-black ${lvl.accentColor} uppercase tracking-tight`}>
                            {lvl.title}
                          </h3>
                          <p className="text-xs sm:text-sm font-bold text-slate-600 mt-0.5">
                            {lvl.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Level Activities Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 w-full">
                      {levelItems.map((item, index) => renderActivityCard(item, index))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* MY LEARNING JOURNEY TODAY (Immediately after Level 6)                    */}
        {/* ========================================================================= */}
        <div id="learning-areas-card" className="w-full max-w-5xl mb-8 bg-white/95 border-4 border-[#3B82F6] rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-[#2563EB] text-white font-black text-xs sm:text-sm uppercase tracking-widest px-5 py-2 rounded-full border-4 border-white shadow-md mb-2">
              <BookOpen className="w-4 h-4 stroke-white stroke-[3]" />
              <span>EARLY CHILDHOOD CURRICULUM</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tight">
              MY LEARNING JOURNEY TODAY
            </h2>
            <p className="text-xs sm:text-sm font-bold text-slate-600">
              Explore your learning areas and track activities completed today
            </p>
          </div>

          {/* ========================================================================= */}
          {/* SUBSECTION: ACTIVITIES COMPLETED TODAY                                   */}
          {/* ========================================================================= */}
          <div id="activities-completed-today-card" className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-300 rounded-2xl p-5 mb-6 shadow-xs">
            <div className="flex items-center justify-between mb-3.5 border-b border-amber-200/80 pb-2.5">
              <h3 className="font-black text-sm sm:text-base uppercase tracking-wide text-amber-950 flex items-center gap-2">
                <span>⭐</span>
                <span>ACTIVITIES COMPLETED TODAY</span>
              </h3>
              {todayCompleted.length > 0 && (
                <span className="text-xs font-black bg-amber-200 text-amber-900 px-3 py-0.5 rounded-full border border-amber-300">
                  {todayCompleted.length} Completed
                </span>
              )}
            </div>

            {todayCompleted.length === 0 ? (
              <div className="bg-white/80 border-2 border-dashed border-amber-300 rounded-xl p-5 text-center">
                <div className="text-2xl mb-1">🌱</div>
                <h4 className="font-black text-sm text-amber-950 uppercase tracking-wide mb-1">
                  NO ACTIVITIES COMPLETED TODAY
                </h4>
                <p className="text-xs font-bold text-amber-800">
                  Start an activity to begin your learning journey today.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {todayCompleted.map((actId) => {
                  const item = LEARNING_ITEMS.find((i) => i.id === actId);
                  if (!item) return null;
                  return (
                    <div
                      key={`completed-today-item-${actId}`}
                      className="bg-white border-2 border-emerald-300 rounded-xl p-3 flex items-center justify-between shadow-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-emerald-600 font-black text-sm shrink-0">✓</span>
                        <span className="text-lg shrink-0">{item.emoji}</span>
                        <span className="font-black text-xs text-slate-900 uppercase truncate">
                          {item.title}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-amber-500 shrink-0 ml-1">⭐</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 8 Learning Areas Grid — ADULT PROGRESS, behind the parent gate
              (Wave 2). The "Activities Completed Today" strip above stays
              visible to the child; area progress / outcomes do not. */}
          {!parentProgressUnlocked ? (
            <div className="bg-indigo-50 border-2 border-indigo-200 rounded-2xl p-5 text-center">
              <h3 className="font-black text-sm sm:text-base uppercase tracking-wide text-indigo-950 mb-1">
                🔒 Learning Progress — Parents Only
              </h3>
              <p className="text-xs font-bold text-indigo-800 mb-4">
                See which learning areas your child has practiced and what they have mastered.
              </p>
              <div className="max-w-sm mx-auto">
                <ParentGate
                  onUnlock={() => setParentProgressUnlocked(true)}
                  label="Parents: press & hold to view progress"
                />
              </div>
            </div>
          ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 w-full">
            {LEARNING_AREAS_INFO.map((area) => {
              const stats = areaStats[area.title];
              const percent = stats ? stats.percentage : 0;
              const isSelected = selectedAreaFilter === area.title;

              return (
                <motion.button
                  key={area.id}
                  id={`learning-area-btn-${area.id}`}
                  type="button"
                  onClick={() => handleAreaCardClick(area)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`text-left p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-blue-600 ring-2 ring-blue-400 bg-blue-50 shadow-md'
                      : `${area.border} ${area.bg} hover:shadow-md`
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className="w-10 h-10 bg-white rounded-xl border border-black/10 flex items-center justify-center text-xl shadow-inner shrink-0">
                        {area.icon}
                      </div>
                      <h4 className={`font-black text-xs uppercase tracking-wide ${area.textColor} leading-tight`}>
                        {area.title}
                      </h4>
                    </div>
                    <p className="text-[11px] font-bold text-slate-600 leading-relaxed mb-3">
                      {area.description}
                    </p>
                  </div>

                  {/* Progress Indicator */}
                  <div className="mt-2 pt-2 border-t border-black/10">
                    <div className="flex items-center justify-between text-[10px] font-black text-slate-700 mb-1">
                      <span>{stats ? `${stats.completedActivities}/${stats.totalActivities} Activities` : '0 Activities'}</span>
                      <span className="text-blue-700">{percent}%</span>
                    </div>
                    <div className="w-full h-2 bg-white rounded-full overflow-hidden border border-black/10">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <div className="mt-2 text-[10px] font-black text-blue-700 flex items-center gap-1">
                      <span>View Outcomes & Games</span>
                      <span>➔</span>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* LEARNING AREA OUTCOMES & DETAILS MODAL DIALOG (parent-gated: only
            reachable after the progress gate above is passed)              */}
        {/* ========================================================================= */}
        <AnimatePresence>
          {openedAreaModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="bg-white rounded-3xl border-4 border-[#3B82F6] max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative"
              >
                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setOpenedAreaModal(null)}
                  className="absolute top-4 right-4 w-9 h-9 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-600 font-black cursor-pointer border border-slate-300 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Modal Header */}
                <div className="flex items-center gap-3.5 mb-4">
                  <div className="w-14 h-14 bg-blue-50 border-2 border-blue-200 rounded-2xl flex items-center justify-center text-3xl shadow-inner shrink-0">
                    {openedAreaModal.icon}
                  </div>
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-blue-700 bg-blue-100 px-3 py-0.5 rounded-full">
                      Learning Area Domain
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-tight mt-0.5">
                      {openedAreaModal.title}
                    </h3>
                  </div>
                </div>

                <p className="text-xs sm:text-sm font-bold text-slate-600 mb-6 leading-relaxed">
                  {openedAreaModal.description}
                </p>

                {/* Domain Mastery Bar */}
                {(() => {
                  const stats = areaStats[openedAreaModal.title];
                  const percent = stats ? stats.percentage : 0;
                  return (
                    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6">
                      <div className="flex items-center justify-between text-xs font-black text-blue-950 mb-1.5">
                        <span>Domain Progress</span>
                        <span>{stats ? `${stats.completedActivities} / ${stats.totalActivities} Completed (${percent}%)` : '0%'}</span>
                      </div>
                      <div className="w-full h-3 bg-white rounded-full overflow-hidden border border-blue-200">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })()}

                {/* Target Learning Outcomes List */}
                <div className="mb-6">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 mb-3 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-blue-600" />
                    <span>Target Learning Outcomes</span>
                  </h4>

                  <div className="space-y-2">
                    {openedAreaModal.outcomes.map((outcome) => {
                      const isMastered = outcome.activityIds.some((actId) => allTimeCompleted.includes(actId));
                      return (
                        <div
                          key={outcome.id}
                          className={`p-3 rounded-xl border flex items-center justify-between ${
                            isMastered ? 'bg-emerald-50 border-emerald-300' : 'bg-slate-50 border-slate-200'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-lg">{outcome.icon}</span>
                            <span className="font-black text-xs text-slate-800">{outcome.title}</span>
                          </div>
                          {isMastered ? (
                            <span className="inline-flex items-center gap-1 bg-emerald-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full">
                              <CheckCircle2 className="w-3 h-3 stroke-[3]" />
                              <span>Mastered</span>
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-slate-500 bg-white border border-slate-200 px-2.5 py-0.5 rounded-full">
                              Practice to master
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Related Activities in this Area */}
                <div className="mb-6">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 mb-3 flex items-center gap-1.5">
                    <Play className="w-4 h-4 text-blue-600" />
                    <span>Activities in {openedAreaModal.title}</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {LEARNING_ITEMS.filter((item) =>
                      item.learningArea.toLowerCase().includes(openedAreaModal.title.toLowerCase()) ||
                      openedAreaModal.title.toLowerCase().includes(item.learningArea.toLowerCase())
                    ).map((item) => {
                      const isDone = allTimeCompleted.includes(item.id);
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            setOpenedAreaModal(null);
                            handleItemClick(item);
                          }}
                          className="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl text-left cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-2 overflow-hidden">
                            <span className="text-lg shrink-0">{item.emoji}</span>
                            <div className="overflow-hidden">
                              <div className="font-black text-xs text-slate-900 truncate uppercase">{item.title}</div>
                              <div className="text-[10px] font-bold text-slate-500">Level {item.level} • {item.isFree ? 'Free' : 'Premium'}</div>
                            </div>
                          </div>
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                          ) : (
                            <span className="text-[10px] font-black text-blue-600 shrink-0">Play ➔</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Modal Footer Controls */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => handleFilterByArea(openedAreaModal.title)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-black px-4 py-2 rounded-xl shadow-sm cursor-pointer transition-colors"
                  >
                    Filter PlayBloom by this Area
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpenedAreaModal(null)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black px-4 py-2 rounded-xl border border-slate-300 cursor-pointer transition-colors"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ========================================================================= */}
        {/* BOTTOM SECTION: 📚 ABOUT PLAYBLOOM (Feedback was removed with the
            Wave 1 feedback/Supabase deletion — its modal file no longer exists) */}
        {/* ========================================================================= */}
        <div id="page1-bottom-actions-container" className="w-full max-w-5xl">
          {/* CARD 1: ABOUT PLAYBLOOM */}
          <motion.button
            id="page1-about-playroom-card-btn"
            type="button"
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.985 }}
            onClick={() => {
              soundManager.playPop();
              setIsAboutModalOpen(true);
            }}
            className="group w-full bg-white hover:bg-blue-50/50 border-2 border-slate-300 hover:border-blue-400 rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all text-left flex items-center justify-between gap-4 cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 border-2 border-blue-300 rounded-2xl flex items-center justify-center text-2xl shadow-inner shrink-0 group-hover:scale-105 transition-transform">
                📚
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                  Overview
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-tight mt-1">
                  ABOUT PLAYBLOOM
                </h3>
                <p className="text-xs text-slate-500 font-medium line-clamp-1">
                  Why we created PlayBloom • Features • Educator Space
                </p>
              </div>
            </div>

            <span className="bg-slate-100 group-hover:bg-blue-600 text-slate-600 group-hover:text-white p-2.5 rounded-xl transition-colors shrink-0">
              <ChevronRight className="w-5 h-5 stroke-[2.5]" />
            </span>
          </motion.button>
        </div>

        {/* ABOUT PLAYBLOOM MODAL */}
        <AboutPlayroomModal
          isOpen={isAboutModalOpen}
          onClose={() => setIsAboutModalOpen(false)}
        />
      </div>
    </div>
  );
};
