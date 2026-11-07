import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  RotateCcw,
  Volume2,
  Play,
  Check,
  ChevronLeft,
  Heart,
  Star,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { ActivityBottomNav } from './ActivityBottomNav';
import {
  AnimalFamilyId,
  ANIMAL_FAMILIES,
  ALL_ANIMAL_FAMILY_IDS,
  AnimalIllustration,
} from '../illustrations/AnimalFamilyIllustrations';

interface AnimalParentsBabiesProps {
  onCollectStar: () => void;
  onNavigateHome: () => void;
  onNavigateNext: () => void;
  onNavigatePrev: () => void;
  isActivityCompleted?: boolean;
}

// Particle for celebration confetti
interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  rotation: number;
}

// Helper: Fisher-Yates array shuffle
function shuffleArray<T>(array: readonly T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export const AnimalParentsBabies: React.FC<AnimalParentsBabiesProps> = ({
  onCollectStar,
  onNavigateHome,
  onNavigateNext,
  onNavigatePrev,
  isActivityCompleted = false,
}) => {
  // Activity Modes: 'learn' (Intro) | 'matching' (Quiz) | 'completed' (Celebration)
  const [activityMode, setActivityMode] = useState<'learn' | 'matching' | 'completed'>('learn');

  // --- PART 1: LEARN MODE (INTRODUCTION) STATE ---
  const [learnIndex, setLearnIndex] = useState<number>(0);
  const lastIntroIndexRef = useRef<number>(0);
  const [isNarratingIntro, setIsNarratingIntro] = useState<boolean>(false);
  const introTimersRef = useRef<NodeJS.Timeout[]>([]);

  // --- PART 2: MATCHING QUIZ STATE ---
  // 10 animals split into 2 clear rounds of 5 pairs each for clean preschool layout
  const [roundNumber, setRoundNumber] = useState<1 | 2>(1);
  const [round1Animals, setRound1Animals] = useState<AnimalFamilyId[]>([]);
  const [round2Animals, setRound2Animals] = useState<AnimalFamilyId[]>([]);

  // Current active column arrangements (completely shuffled)
  const [leftBabyOrder, setLeftBabyOrder] = useState<AnimalFamilyId[]>([]);
  const [rightParentOrder, setRightParentOrder] = useState<AnimalFamilyId[]>([]);

  // Selected Baby in Step 1
  const [selectedBabyId, setSelectedBabyId] = useState<AnimalFamilyId | null>(null);

  // Set of matched animal IDs
  const [matchedAnimalIds, setMatchedAnimalIds] = useState<Set<AnimalFamilyId>>(new Set());

  // Visual effects
  const [justMatchedId, setJustMatchedId] = useState<AnimalFamilyId | null>(null);
  const [shakeParentId, setShakeParentId] = useState<AnimalFamilyId | null>(null);
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const [hasAwardedStar, setHasAwardedStar] = useState<boolean>(isActivityCompleted);

  // Clear all pending intro timers
  const clearIntroTimers = useCallback(() => {
    introTimersRef.current.forEach((t) => clearTimeout(t));
    introTimersRef.current = [];
  }, []);

  // Initialize and shuffle matching game rounds
  const setupMatchingGame = useCallback(() => {
    const allShuffled = shuffleArray(ALL_ANIMAL_FAMILY_IDS);
    const r1 = allShuffled.slice(0, 5);
    const r2 = allShuffled.slice(5, 10);

    setRound1Animals(r1);
    setRound2Animals(r2);
    setRoundNumber(1);
    setMatchedAnimalIds(new Set());
    setSelectedBabyId(null);
    setJustMatchedId(null);

    // Completely independent shuffling for left baby column and right parent column
    setLeftBabyOrder(shuffleArray(r1));
    setRightParentOrder(shuffleArray(r1));
  }, []);

  // Setup Round 2 when Round 1 completes
  const setupRound2 = useCallback((r2List: AnimalFamilyId[]) => {
    setRoundNumber(2);
    setSelectedBabyId(null);
    setJustMatchedId(null);
    setLeftBabyOrder(shuffleArray(r2List));
    setRightParentOrder(shuffleArray(r2List));
  }, []);

  // Mount background music & initial setup
  useEffect(() => {
    soundManager.startBackgroundMusic();
    setupMatchingGame();
    return () => {
      clearIntroTimers();
      soundManager.stopSpeech();
    };
  }, [setupMatchingGame, clearIntroTimers]);

  // Switch to Quiz / Matching Game
  const startMatchingGame = useCallback(() => {
    clearIntroTimers();
    soundManager.stopSpeech();
    soundManager.playPop();
    setActivityMode('matching');
    setupMatchingGame();

    setTimeout(() => {
      soundManager.speak("Now let's match the babies with their parents!");
    }, 300);
  }, [clearIntroTimers, setupMatchingGame]);

  // Switch back to Learn Mode (Introduction from beginning)
  const startLearnMode = useCallback(() => {
    clearIntroTimers();
    soundManager.stopSpeech();
    soundManager.playPop();
    setActivityMode('learn');
    setLearnIndex(0);
  }, [clearIntroTimers]);

  // ============================================================
  // AUTO-NEXT INTRODUCTION ENGINE
  // Shows 1 family at a time: Voice plays -> 3s viewing time -> Auto-next
  // ============================================================
  useEffect(() => {
    if (activityMode !== 'learn') return;

    lastIntroIndexRef.current = learnIndex;
    clearIntroTimers();
    soundManager.stopSpeech();
    setIsNarratingIntro(true);

    const currentFamily = ANIMAL_FAMILIES[ALL_ANIMAL_FAMILY_IDS[learnIndex]];

    // Step 1: Speak Parent ("I am a dog.")
    soundManager.speak(currentFamily.parentIntro);

    // Step 2: Speak Baby ("My baby is a puppy!") after parent speaks (~1.8s)
    const babySpeechTimer = setTimeout(() => {
      soundManager.speak(currentFamily.babyIntro);

      // Step 3: Wait for baby speech (~1.8s) + 3-second visual viewing time = ~4.8s total
      const viewTimeTimer = setTimeout(() => {
        setIsNarratingIntro(false);

        // Step 4: Auto-advance to next family or open quiz
        if (learnIndex < ALL_ANIMAL_FAMILY_IDS.length - 1) {
          setLearnIndex((prev) => prev + 1);
        } else {
          // Reached the 10th family -> automatically open quiz!
          startMatchingGame();
        }
      }, 4800); // 1.8s speech + 3.0s viewing time

      introTimersRef.current.push(viewTimeTimer);
    }, 1800);

    introTimersRef.current.push(babySpeechTimer);

    return () => {
      clearIntroTimers();
    };
  }, [learnIndex, activityMode, clearIntroTimers, startMatchingGame]);

  // Replay audio narration on current card
  const handleReplayIntroAudio = () => {
    clearIntroTimers();
    soundManager.stopSpeech();
    setIsNarratingIntro(true);

    const currentFamily = ANIMAL_FAMILIES[ALL_ANIMAL_FAMILY_IDS[learnIndex]];
    soundManager.speak(currentFamily.parentIntro);

    const babySpeechTimer = setTimeout(() => {
      soundManager.speak(currentFamily.babyIntro);

      const viewTimeTimer = setTimeout(() => {
        setIsNarratingIntro(false);
        if (learnIndex < ALL_ANIMAL_FAMILY_IDS.length - 1) {
          setLearnIndex((prev) => prev + 1);
        } else {
          startMatchingGame();
        }
      }, 4800);

      introTimersRef.current.push(viewTimeTimer);
    }, 1800);

    introTimersRef.current.push(babySpeechTimer);
  };

  // Trigger celebration confetti
  const triggerConfetti = () => {
    const colors = ['#F59E0B', '#EF4444', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#FBBF24'];
    const pieces: ConfettiPiece[] = Array.from({ length: 45 }).map((_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 90 + 5,
      y: -10,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 12 + 6,
      rotation: Math.random() * 360,
    }));
    setConfetti(pieces);
    setTimeout(() => setConfetti([]), 3500);
  };

  // ============================================================
  // QUIZ MATCHING INTERACTION
  // ============================================================

  // Step 1: Child taps a baby on the left
  const handleTapBaby = (babyId: AnimalFamilyId) => {
    if (matchedAnimalIds.has(babyId)) return; // Already matched
    soundManager.playPop();

    if (selectedBabyId === babyId) {
      soundManager.speak(`Who is my parent?`);
      return;
    }

    setSelectedBabyId(babyId);
    soundManager.speak(`Who is my parent?`);
  };

  // Step 2: Child taps a parent on the right
  const handleTapParent = (parentId: AnimalFamilyId) => {
    if (matchedAnimalIds.has(parentId)) return; // Already matched

    if (!selectedBabyId) {
      soundManager.playPop();
      soundManager.speak(`First tap a baby on the left!`);
      return;
    }

    const currentBaby = selectedBabyId;

    // Check match correctness
    if (currentBaby === parentId) {
      // CORRECT MATCH!
      soundManager.playSuccess();
      soundManager.speak('Great job!');

      setJustMatchedId(currentBaby);
      const nextMatched = new Set(matchedAnimalIds);
      nextMatched.add(currentBaby);
      setMatchedAnimalIds(nextMatched);
      setSelectedBabyId(null);

      // Check round / game completion
      const currentRoundPool = roundNumber === 1 ? round1Animals : round2Animals;
      const allCurrentRoundMatched = currentRoundPool.every((id) => nextMatched.has(id));

      if (allCurrentRoundMatched) {
        if (roundNumber === 1) {
          // Advance to Round 2 after celebratory pause
          setTimeout(() => {
            soundManager.playCelebration();
            soundManager.speak('Round 1 complete! Now match 5 more animal families!');
            setupRound2(round2Animals);
          }, 1400);
        } else {
          // ALL 10 MATCHED! COMPLETION!
          setTimeout(() => {
            soundManager.playCelebration();
            soundManager.speak('Great job!');
            triggerConfetti();
            setActivityMode('completed');
            if (!hasAwardedStar) {
              setHasAwardedStar(true);
              onCollectStar();
            }
          }, 1400);
        }
      }
    } else {
      // WRONG ANSWER
      soundManager.playError();
      soundManager.speak('Try again!');
      setShakeParentId(parentId);
      setTimeout(() => setShakeParentId(null), 600);
      // Keep selectedBabyId selected so the child can try another parent
    }
  };

  // ============================================================
  // INTERNAL PREVIOUS NAVIGATION HANDLER
  // Strict step-by-step back navigation:
  // - In completed: goes back to matching quiz
  // - In matching quiz round 2: goes back to round 1
  // - In matching quiz round 1: goes back to last visited intro step
  // - In intro: goes back one family (e.g. Horse -> Cow -> Cat -> Dog)
  // - Only when at step 0 (Dog) does PREV exit the activity
  // ============================================================
  const handleInternalPrev = () => {
    clearIntroTimers();
    soundManager.stopSpeech();
    soundManager.playPop();

    if (activityMode === 'completed') {
      setActivityMode('matching');
    } else if (activityMode === 'matching') {
      if (roundNumber === 2) {
        setRoundNumber(1);
        setSelectedBabyId(null);
        setJustMatchedId(null);
        setLeftBabyOrder(shuffleArray(round1Animals));
        setRightParentOrder(shuffleArray(round1Animals));
      } else {
        // Return to the exact intro step before the quiz
        setActivityMode('learn');
        setLearnIndex(lastIntroIndexRef.current);
      }
    } else if (activityMode === 'learn') {
      if (learnIndex > 0) {
        setLearnIndex((prev) => prev - 1);
      } else {
        // No earlier steps in this activity -> allow navigation to previous activity
        if (onNavigatePrev) {
          onNavigatePrev();
        }
      }
    }
  };

  const currentLearnFamily = ANIMAL_FAMILIES[ALL_ANIMAL_FAMILY_IDS[learnIndex]];
  const totalMatchedCount = matchedAnimalIds.size;
  const isAllComplete = totalMatchedCount === 10 || isActivityCompleted;

  return (
    <div
      id="animal-parents-babies-activity"
      className="min-h-screen bg-gradient-to-b from-[#FEF9C3] via-[#ECFDF5] to-[#E0F2FE] p-3 sm:p-6 flex flex-col items-center select-none relative overflow-hidden"
    >
      {/* Top Header Card */}
      <header className="w-full max-w-3xl flex items-center justify-between bg-white/95 backdrop-blur-xs rounded-3xl p-3 sm:p-4 shadow-lg border-4 border-amber-300 mb-4 z-20">
        {/* Left: Activity Title & Subtitle */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-2xl sm:text-3xl shadow-md border-2 border-amber-200 shrink-0">
            🦁
          </div>
          <div>
            <h1 className="text-lg sm:text-2xl font-black text-amber-950 tracking-tight flex items-center gap-1.5">
              Animal Parents & Babies
            </h1>
            <p className="text-xs sm:text-sm font-bold text-amber-800/80">
              {activityMode === 'learn'
                ? `Learn Families (${learnIndex + 1} of 10)`
                : activityMode === 'matching'
                ? `Matching Quiz • Round ${roundNumber} of 2`
                : 'All Families Reunited! 🎉'}
            </p>
          </div>
        </div>

        {/* Right: Quick Action Controls & Star Counter */}
        <div className="flex items-center gap-2">
          {activityMode === 'learn' && (
            <button
              type="button"
              onClick={startMatchingGame}
              className="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-black px-3 py-2 rounded-2xl border-b-3 border-emerald-700 shadow-md text-xs sm:text-sm transition-all cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Skip to Quiz</span>
            </button>
          )}

          {activityMode === 'matching' && (
            <button
              type="button"
              onClick={handleInternalPrev}
              className="flex items-center gap-1 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-black px-3 py-2 rounded-2xl border-b-3 border-amber-700 shadow-md text-xs sm:text-sm transition-all cursor-pointer"
              title="Go back to introduction"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Intro</span>
            </button>
          )}

          {/* Progress Star Counter */}
          <div className="flex items-center gap-1 bg-amber-100 px-3 py-2 rounded-2xl border-2 border-amber-300 text-amber-900 font-black text-xs sm:text-sm">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>{totalMatchedCount}/10</span>
          </div>
        </div>
      </header>

      {/* Main Interactive Stage */}
      <main className="w-full max-w-3xl flex-1 flex flex-col items-center justify-center z-10">
        <AnimatePresence mode="wait">
          {/* ============================================================ */}
          {/* 1. INTRODUCTION (ONE FAMILY AT A TIME WITH AUTO-NEXT)        */}
          {/* ============================================================ */}
          {activityMode === 'learn' && (
            <motion.section
              key={`learn-${learnIndex}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="w-full flex flex-col items-center"
            >
              {/* Family Presentation Card */}
              <div
                className={`w-full max-w-2xl bg-gradient-to-b ${currentLearnFamily.colorTheme.bg} rounded-3xl border-4 ${currentLearnFamily.colorTheme.border} p-4 sm:p-7 shadow-xl flex flex-col items-center relative overflow-hidden`}
              >
                {/* Animal Family Counter & Status Header */}
                <div className="w-full flex items-center justify-between gap-2 mb-3">
                  <div className="bg-white/95 border-2 border-amber-300 rounded-full px-3.5 py-1 text-xs sm:text-sm font-black text-amber-950 shadow-xs flex items-center gap-1.5">
                    <span>Family {learnIndex + 1} of 10</span>
                    <span className="text-amber-400">•</span>
                    <span>{currentLearnFamily.parentName} &amp; {currentLearnFamily.babyName}</span>
                  </div>

                  {/* Auto-playing indicator */}
                  <div className="bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-full px-3 py-1 text-[11px] sm:text-xs font-black flex items-center gap-1 shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span>Auto-Playing</span>
                  </div>
                </div>

                {/* PARENT (CLEARLY BIG) + BABY (CLEARLY SMALL) Presentation */}
                <div className="w-full flex items-center justify-center gap-3 sm:gap-6 my-2 sm:my-4">
                  {/* ADULT PARENT CONTAINER (NOTICABLY LARGER) */}
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
                    className="flex flex-col items-center bg-white/90 rounded-3xl p-4 sm:p-5 border-4 border-amber-400 shadow-xl flex-1 max-w-[210px] sm:max-w-[240px] text-center"
                  >
                    <div className="flex items-center gap-1 bg-amber-400 text-amber-950 font-black text-xs sm:text-sm px-3 py-1 rounded-full uppercase tracking-wider shadow-xs mb-2">
                      <span>👑</span>
                      <span>PARENT (BIG)</span>
                    </div>

                    {/* Large Adult Vector */}
                    <div className="w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center my-1">
                      <AnimalIllustration
                        type="parent"
                        animalId={currentLearnFamily.id}
                        size="xl"
                      />
                    </div>

                    <div className="mt-1">
                      <p className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                        {currentLearnFamily.parentName}
                      </p>
                      <p className="text-xs sm:text-sm font-black text-amber-800 italic mt-0.5">
                        &ldquo;{currentLearnFamily.parentIntro}&rdquo;
                      </p>
                    </div>
                  </motion.div>

                  {/* Center Connecting Heart */}
                  <motion.div
                    animate={{ scale: [1, 1.25, 1], rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-pink-500 text-white flex items-center justify-center shadow-lg border-2 border-white text-lg shrink-0"
                  >
                    <Heart className="w-5 h-5 sm:w-6 sm:h-6 fill-white" />
                  </motion.div>

                  {/* BABY ANIMAL CONTAINER (NOTICABLY SMALLER) */}
                  <motion.div
                    animate={{ y: [0, 5, 0] }}
                    transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                    className="flex flex-col items-center bg-white/90 rounded-3xl p-3 sm:p-4 border-3 border-pink-400 shadow-lg flex-1 max-w-[160px] sm:max-w-[190px] text-center"
                  >
                    <div className="flex items-center gap-1 bg-pink-300 text-pink-950 font-black text-[11px] sm:text-xs px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-2xs mb-2">
                      <span>👶</span>
                      <span>BABY (SMALL)</span>
                    </div>

                    {/* Small Baby Vector */}
                    <div className="w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center my-1">
                      <AnimalIllustration
                        type="baby"
                        animalId={currentLearnFamily.id}
                        size="md"
                      />
                    </div>

                    <div className="mt-1">
                      <p className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
                        {currentLearnFamily.babyName}
                      </p>
                      <p className="text-xs sm:text-sm font-black text-pink-700 italic mt-0.5">
                        &ldquo;{currentLearnFamily.babyIntro}&rdquo;
                      </p>
                    </div>
                  </motion.div>
                </div>

                {/* Voice Replay & Readout Banner */}
                <div className="w-full bg-white/95 rounded-2xl p-3 sm:p-3.5 border-2 border-amber-300 shadow-sm flex items-center justify-between gap-3 mt-1">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleReplayIntroAudio}
                      className={`w-11 h-11 rounded-2xl ${
                        isNarratingIntro ? 'bg-amber-400 animate-pulse' : 'bg-amber-500 hover:bg-amber-600'
                      } text-white flex items-center justify-center shadow-md active:scale-90 transition-all cursor-pointer shrink-0`}
                      aria-label="Replay voice narration"
                    >
                      <Volume2 className="w-6 h-6" />
                    </button>
                    <div>
                      <p className="text-sm sm:text-base font-black text-amber-950 leading-snug">
                        &ldquo;{currentLearnFamily.parentIntro} {currentLearnFamily.babyIntro}&rdquo;
                      </p>
                      <p className="text-xs font-bold text-amber-700">
                        Listening... Next family loads automatically in ~3 seconds
                      </p>
                    </div>
                  </div>
                </div>

                {/* Dot step progress bar (Hands-Free Intro) */}
                <div className="w-full flex items-center justify-center gap-1.5 mt-3 pt-2">
                  {ALL_ANIMAL_FAMILY_IDS.map((famId, idx) => (
                    <button
                      key={famId}
                      type="button"
                      onClick={() => {
                        soundManager.playPop();
                        setLearnIndex(idx);
                      }}
                      className={`h-2.5 rounded-full transition-all cursor-pointer ${
                        idx === learnIndex
                          ? 'bg-amber-600 w-7'
                          : idx < learnIndex
                          ? 'bg-amber-400 w-2.5'
                          : 'bg-amber-200 w-2.5'
                      }`}
                      aria-label={`Jump to family ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </motion.section>
          )}

          {/* ============================================================ */}
          {/* 2. MATCHING QUIZ (LEFT: BABIES SMALL | RIGHT: PARENTS LARGE) */}
          {/* ============================================================ */}
          {activityMode === 'matching' && (
            <motion.section
              key={`matching-round-${roundNumber}`}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3 }}
              className="w-full flex flex-col items-center"
            >
              {/* Top Instruction Banner & Prev-to-Intro Button */}
              <div className="w-full bg-white/95 rounded-2xl px-3.5 py-2.5 border-3 border-amber-300 shadow-md mb-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl">👉</span>
                  <p className="text-xs sm:text-sm font-black text-amber-950">
                    {!selectedBabyId ? (
                      <span className="text-sky-900">
                        Step 1: Tap a <span className="underline decoration-pink-500 font-extrabold text-pink-700">small baby</span> on the left!
                      </span>
                    ) : (
                      <span className="text-emerald-800 font-black animate-pulse">
                        Step 2: Who is the parent of the{' '}
                        <span className="text-pink-600 underline font-extrabold">
                          {ANIMAL_FAMILIES[selectedBabyId].babyName}
                        </span>
                        ? Tap the big parent on the right!
                      </span>
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playPop();
                      if (selectedBabyId) {
                        soundManager.speak(`Who is my parent?`);
                      } else {
                        soundManager.speak(`Tap a small baby on the left, then tap its big parent on the right!`);
                      }
                    }}
                    className="p-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 cursor-pointer shadow-2xs"
                    aria-label="Hear instructions"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Two Column Synchronized Layout: Left BABIES (Small), Right PARENTS (Big) */}
              <div className="w-full flex flex-col gap-2.5 sm:gap-3">
                {/* Column Headers Row */}
                <div className="grid grid-cols-2 gap-3 sm:gap-5">
                  <div className="bg-pink-100/90 border-2 border-pink-300 text-pink-950 px-3 py-1.5 rounded-2xl text-center font-black text-xs sm:text-sm shadow-xs flex items-center justify-center gap-1.5">
                    <span>👶</span>
                    <span className="tracking-wide">BABIES</span>
                  </div>
                  <div className="bg-amber-100/90 border-2 border-amber-300 text-amber-950 px-3 py-1.5 rounded-2xl text-center font-black text-xs sm:text-sm shadow-xs flex items-center justify-center gap-1.5">
                    <span>👑</span>
                    <span className="tracking-wide">PARENTS</span>
                  </div>
                </div>

                {/* Synchronized Matching Rows */}
                {leftBabyOrder.map((babyId, index) => {
                  const parentId = rightParentOrder[index];
                  const babyData = ANIMAL_FAMILIES[babyId];
                  const isBabyMatched = matchedAnimalIds.has(babyId);
                  const isBabySelected = selectedBabyId === babyId;
                  const isBabyJustMatched = justMatchedId === babyId;

                  const parentData = parentId ? ANIMAL_FAMILIES[parentId] : null;
                  const isParentMatched = parentId ? matchedAnimalIds.has(parentId) : false;
                  const isParentShaking = parentId ? shakeParentId === parentId : false;

                  return (
                    <div
                      key={`matching-row-${babyId}-${parentId || index}`}
                      className="grid grid-cols-2 gap-3 sm:gap-5 items-stretch"
                    >
                      {/* LEFT: BABY CARD */}
                      <motion.button
                        key={`baby-${babyId}`}
                        type="button"
                        onClick={() => handleTapBaby(babyId)}
                        disabled={isBabyMatched}
                        whileHover={!isBabyMatched ? { scale: 1.02 } : {}}
                        whileTap={!isBabyMatched ? { scale: 0.97 } : {}}
                        animate={
                          isBabySelected
                            ? { scale: [1, 1.03, 1], y: [0, -3, 0] }
                            : isBabyJustMatched
                            ? { scale: [1, 1.08, 1] }
                            : {}
                        }
                        transition={
                          isBabySelected
                            ? { duration: 1.5, repeat: Infinity }
                            : { duration: 0.2 }
                        }
                        className={`w-full h-[74px] sm:h-[84px] p-2 sm:p-2.5 rounded-2xl border-3 transition-all flex items-center justify-between gap-2 text-left relative cursor-pointer shadow-md ${
                          isBabyMatched
                            ? 'bg-emerald-50/90 border-emerald-400 opacity-75 cursor-default'
                            : isBabySelected
                            ? 'bg-pink-100 border-pink-500 ring-4 ring-pink-300 shadow-xl'
                            : 'bg-white hover:bg-pink-50/70 border-pink-200 hover:border-pink-400'
                        }`}
                      >
                        {/* Baby Vector (Small Box) */}
                        <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center bg-pink-50 rounded-xl shadow-2xs border border-pink-200 shrink-0">
                          <AnimalIllustration
                            type="baby"
                            animalId={babyId}
                            size="sm"
                          />
                        </div>

                        {/* Label */}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-black text-slate-900 truncate">
                            {babyData.babyName}
                          </p>
                          <p className="text-[10px] sm:text-[11px] font-bold text-pink-700 truncate">
                            Baby
                          </p>
                        </div>

                        {/* Status Icon */}
                        <div className="shrink-0">
                          {isBabyMatched ? (
                            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                              <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
                            </div>
                          ) : isBabySelected ? (
                            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-pink-500 text-white flex items-center justify-center shadow-xs animate-bounce">
                              <span className="text-[10px]">❓</span>
                            </div>
                          ) : (
                            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 border-dashed border-pink-300" />
                          )}
                        </div>
                      </motion.button>

                      {/* RIGHT: PARENT CARD */}
                      {parentId && parentData && (
                        <motion.button
                          key={`parent-${parentId}`}
                          type="button"
                          onClick={() => handleTapParent(parentId)}
                          disabled={isParentMatched}
                          whileHover={!isParentMatched ? { scale: 1.02 } : {}}
                          whileTap={!isParentMatched ? { scale: 0.97 } : {}}
                          animate={
                            isParentShaking
                              ? { x: [-8, 8, -6, 6, -3, 3, 0] }
                              : {}
                          }
                          transition={{ duration: 0.4 }}
                          className={`w-full h-[74px] sm:h-[84px] p-2 sm:p-2.5 rounded-2xl border-3 transition-all flex items-center justify-between gap-2 text-left relative cursor-pointer shadow-md ${
                            isParentMatched
                              ? 'bg-emerald-50/90 border-emerald-400 opacity-75 cursor-default'
                              : selectedBabyId
                              ? 'bg-amber-50/90 hover:bg-amber-100 border-amber-400 hover:border-amber-500 ring-2 ring-amber-200'
                              : 'bg-white hover:bg-amber-50/80 border-amber-200 hover:border-amber-300'
                          }`}
                        >
                          {/* Parent Vector (Noticeably Larger Animal Box) */}
                          <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center bg-amber-50 rounded-xl shadow-2xs border border-amber-200 shrink-0">
                            <AnimalIllustration
                              type="parent"
                              animalId={parentId}
                              size="md"
                            />
                          </div>

                          {/* Label */}
                          <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm font-black text-slate-900 truncate">
                              {parentData.parentName}
                            </p>
                            <p className="text-[10px] sm:text-[11px] font-bold text-amber-800 truncate">
                              Parent
                            </p>
                          </div>

                          {/* Status Icon */}
                          <div className="shrink-0">
                            {isParentMatched ? (
                              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                                <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
                              </div>
                            ) : (
                              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 border-dashed border-amber-300" />
                            )}
                          </div>
                        </motion.button>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.section>
          )}

          {/* ============================================================ */}
          {/* 3. COMPLETION CELEBRATION SCREEN                            */}
          {/* ============================================================ */}
          {activityMode === 'completed' && (
            <motion.section
              key="completed-screen"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.4 }}
              className="w-full flex flex-col items-center"
            >
              {/* Confetti particles */}
              {confetti.map((piece) => (
                <motion.div
                  key={piece.id}
                  initial={{ x: `${piece.x}vw`, y: '-5vh', opacity: 1, rotate: piece.rotation }}
                  animate={{ y: '105vh', opacity: 0, rotate: piece.rotation + 360 }}
                  transition={{ duration: 3.2, ease: 'easeOut' }}
                  className="fixed pointer-events-none z-50 rounded-full"
                  style={{
                    backgroundColor: piece.color,
                    width: `${piece.size}px`,
                    height: `${piece.size}px`,
                  }}
                />
              ))}

              <div className="w-full max-w-2xl bg-white/95 rounded-3xl border-4 border-amber-400 p-6 sm:p-8 shadow-2xl flex flex-col items-center text-center">
                {/* Celebration Star Badge */}
                <motion.div
                  animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-300 border-4 border-white shadow-xl flex items-center justify-center text-4xl mb-3"
                >
                  ⭐
                </motion.div>

                <h2 className="text-2xl sm:text-3xl font-black text-amber-950 tracking-tight">
                  Great Job! You Matched All 10 Families!
                </h2>
                <p className="text-sm sm:text-base font-bold text-amber-800 mt-1 max-w-md">
                  Every baby is happily united with its parent! You are an animal expert!
                </p>

                {/* 10 Paired Families Showcase Mini-Grid */}
                <div className="w-full grid grid-cols-2 sm:grid-cols-5 gap-2 my-5">
                  {ALL_ANIMAL_FAMILY_IDS.map((famId) => {
                    const data = ANIMAL_FAMILIES[famId];
                    return (
                      <div
                        key={`showcase-${famId}`}
                        className="bg-amber-50 rounded-2xl p-2 border-2 border-amber-200 flex flex-col items-center justify-center shadow-2xs"
                      >
                        <div className="flex items-center -space-x-2">
                          <span className="text-2xl">{data.parentEmoji}</span>
                          <span className="text-2xl">{data.babyEmoji}</span>
                        </div>
                        <p className="text-[11px] font-black text-amber-950 mt-1">
                          {data.parentName} &amp; {data.babyName}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Action Buttons */}
                <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playPop();
                      setupMatchingGame();
                      setActivityMode('matching');
                    }}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-black px-6 py-3.5 rounded-2xl border-b-4 border-emerald-700 shadow-lg text-base cursor-pointer transition-all"
                  >
                    <RotateCcw className="w-5 h-5" />
                    <span>Play Again (New Shuffle)</span>
                  </button>

                  <button
                    type="button"
                    onClick={startLearnMode}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-black px-6 py-3.5 rounded-2xl border-b-4 border-amber-700 shadow-lg text-base cursor-pointer transition-all"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Watch Intro Again</span>
                  </button>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom 3-Button Navigation (PREV, HOME, NEXT) */}
      <footer className="w-full flex justify-center mt-auto pt-2 z-20">
        <ActivityBottomNav
          onNavigatePrev={handleInternalPrev}
          onNavigateHome={onNavigateHome}
          onNavigateNext={onNavigateNext}
          isNextUnlocked={isAllComplete}
        />
      </footer>
    </div>
  );
};
