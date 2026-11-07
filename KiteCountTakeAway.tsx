import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  RotateCcw,
  Volume2,
  Check,
  Star,
  Sparkles,
  Scissors,
  Trophy,
} from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { ActivityBottomNav } from './ActivityBottomNav';

// ----------------------------------------------------------------------------
// TYPES & COLOR PALETTES
// ----------------------------------------------------------------------------

export type KiteColor =
  | 'ruby_red'
  | 'sun_yellow'
  | 'ocean_blue'
  | 'emerald_green'
  | 'royal_purple'
  | 'bright_orange'
  | 'cotton_pink'
  | 'cyan_sky';

export type KitePattern = 'solid' | 'stripes' | 'diamonds' | 'stars' | 'polka' | 'dual';

export interface KiteColorDef {
  name: string;
  gradTop: string;
  gradBottom: string;
  border: string;
  accent: string;
  faceEyes: string;
  bowColors: string[];
}

const KITE_COLOR_PALETTES: Record<KiteColor, KiteColorDef> = {
  ruby_red: {
    name: 'Red',
    gradTop: '#FDA4AF',
    gradBottom: '#E11D48',
    border: '#9F1239',
    accent: '#FFE4E6',
    faceEyes: '#1E293B',
    bowColors: ['#38BDF8', '#4ADE80', '#FBBF24'],
  },
  sun_yellow: {
    name: 'Yellow',
    gradTop: '#FEF08A',
    gradBottom: '#F59E0B',
    border: '#B45309',
    accent: '#FFFBEB',
    faceEyes: '#1E293B',
    bowColors: ['#F43F5E', '#A855F7', '#38BDF8'],
  },
  ocean_blue: {
    name: 'Blue',
    gradTop: '#93C5FD',
    gradBottom: '#2563EB',
    border: '#1E40AF',
    accent: '#EFF6FF',
    faceEyes: '#0F172A',
    bowColors: ['#FBBF24', '#F43F5E', '#34D399'],
  },
  emerald_green: {
    name: 'Green',
    gradTop: '#86EFAC',
    gradBottom: '#16A34A',
    border: '#14532D',
    accent: '#F0FDF4',
    faceEyes: '#1E293B',
    bowColors: ['#FB923C', '#E879F9', '#38BDF8'],
  },
  royal_purple: {
    name: 'Purple',
    gradTop: '#D8B4FE',
    gradBottom: '#9333EA',
    border: '#581C87',
    accent: '#FAF5FF',
    faceEyes: '#1E293B',
    bowColors: ['#FDE047', '#34D399', '#FB923C'],
  },
  bright_orange: {
    name: 'Orange',
    gradTop: '#FDBA74',
    gradBottom: '#EA580C',
    border: '#7C2D12',
    accent: '#FFF7ED',
    faceEyes: '#1E293B',
    bowColors: ['#38BDF8', '#4ADE80', '#C084FC'],
  },
  cotton_pink: {
    name: 'Pink',
    gradTop: '#F9A8D4',
    gradBottom: '#DB2777',
    border: '#831843',
    accent: '#FDF2F8',
    faceEyes: '#1E293B',
    bowColors: ['#67E8F9', '#FBBF24', '#A855F7'],
  },
  cyan_sky: {
    name: 'Cyan',
    gradTop: '#67E8F9',
    gradBottom: '#0891B2',
    border: '#164E63',
    accent: '#ECFEFF',
    faceEyes: '#0F172A',
    bowColors: ['#F43F5E', '#FBBF24', '#4ADE80'],
  },
};

const ALL_KITE_COLORS: KiteColor[] = [
  'ruby_red',
  'sun_yellow',
  'ocean_blue',
  'emerald_green',
  'royal_purple',
  'bright_orange',
  'cotton_pink',
  'cyan_sky',
];

const ALL_PATTERNS: KitePattern[] = ['solid', 'stripes', 'diamonds', 'stars', 'polka', 'dual'];

export interface KiteItem {
  id: string;
  index: number;
  color: KiteColor;
  pattern: KitePattern;
  xPercent: number; // 10% to 90%
  yPercent: number; // 15% to 65%
  swayDuration: number;
  swayDelay: number;
  rotation: number;
  isCut: boolean;
  cutOrder: number | null;
  tapCountNumber: number | null;
}

export interface RoundConfig {
  startCount: number;
  takeAwayCount: number;
}

// Preset round templates for rich variety in early subtraction
const ROUND_TEMPLATES: RoundConfig[] = [
  { startCount: 4, takeAwayCount: 1 }, // 3 left
  { startCount: 5, takeAwayCount: 2 }, // 3 left
  { startCount: 3, takeAwayCount: 1 }, // 2 left
  { startCount: 5, takeAwayCount: 3 }, // 2 left
  { startCount: 6, takeAwayCount: 2 }, // 4 left
  { startCount: 4, takeAwayCount: 2 }, // 2 left
  { startCount: 6, takeAwayCount: 1 }, // 5 left
  { startCount: 3, takeAwayCount: 2 }, // 1 left
  { startCount: 5, takeAwayCount: 1 }, // 4 left
];

// Helper to layout kites cleanly without overlapping
function generateKitesLayout(count: number): { x: number; y: number }[] {
  if (count === 1) {
    return [{ x: 50, y: 38 }];
  }
  if (count === 2) {
    return [
      { x: 30, y: 36 },
      { x: 70, y: 36 },
    ];
  }
  if (count === 3) {
    return [
      { x: 22, y: 38 },
      { x: 50, y: 32 },
      { x: 78, y: 40 },
    ];
  }
  if (count === 4) {
    return [
      { x: 18, y: 34 },
      { x: 39, y: 44 },
      { x: 61, y: 32 },
      { x: 82, y: 42 },
    ];
  }
  if (count === 5) {
    return [
      { x: 14, y: 36 },
      { x: 32, y: 28 },
      { x: 50, y: 44 },
      { x: 68, y: 30 },
      { x: 86, y: 40 },
    ];
  }
  // 6 Kites
  return [
    { x: 14, y: 32 },
    { x: 30, y: 44 },
    { x: 46, y: 28 },
    { x: 62, y: 44 },
    { x: 78, y: 30 },
    { x: 90, y: 46 },
  ];
}

// Generate distinct round items
function createKitesForRound(round: RoundConfig, roundIndex: number): KiteItem[] {
  const positions = generateKitesLayout(round.startCount);
  const shuffledColors = [...ALL_KITE_COLORS].sort(() => Math.random() - 0.5);

  return positions.map((pos, idx) => {
    const color = shuffledColors[idx % shuffledColors.length];
    const pattern = ALL_PATTERNS[idx % ALL_PATTERNS.length];
    return {
      id: `kite_r${roundIndex}_${idx}_${Date.now()}`,
      index: idx,
      color,
      pattern,
      xPercent: pos.x,
      yPercent: pos.y,
      swayDuration: 2.6 + Math.random() * 1.4,
      swayDelay: Math.random() * 1.5,
      rotation: (idx % 2 === 0 ? -4 : 4) + (Math.random() * 4 - 2),
      isCut: false,
      cutOrder: null,
      tapCountNumber: null,
    };
  });
}

// Pick 5 randomized rounds for each gameplay session
function pickRandomRounds(): RoundConfig[] {
  const shuffled = [...ROUND_TEMPLATES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 5);
}

// Generate 4 distinct number options containing the correct answer
function generateNumberChoices(correctAnswer: number, maxNumber: number): number[] {
  const choices = new Set<number>([correctAnswer]);
  const possible = [1, 2, 3, 4, 5, 6].filter((n) => n <= Math.max(4, maxNumber));

  while (choices.size < 4 && choices.size < possible.length) {
    const randomNum = possible[Math.floor(Math.random() * possible.length)];
    choices.add(randomNum);
  }

  // Fallback if small range
  let fallback = 1;
  while (choices.size < 4) {
    choices.add(fallback);
    fallback++;
  }

  return Array.from(choices).sort((a, b) => a - b);
}

// ----------------------------------------------------------------------------
// COMPONENT PROPS
// ----------------------------------------------------------------------------

interface KiteCountTakeAwayProps {
  onCollectStar?: () => void;
  onNavigateHome?: () => void;
  onNavigateNext?: () => void;
  onNavigatePrev?: () => void;
  isActivityCompleted?: boolean;
}

// ----------------------------------------------------------------------------
// MAIN COMPONENT
// ----------------------------------------------------------------------------

export const KiteCountTakeAway: React.FC<KiteCountTakeAwayProps> = ({
  onCollectStar,
  onNavigateHome,
  onNavigateNext,
  onNavigatePrev,
  isActivityCompleted = false,
}) => {
  // Rounds state
  const [rounds, setRounds] = useState<RoundConfig[]>(pickRandomRounds);
  const [currentRoundIdx, setCurrentRoundIdx] = useState<number>(0);
  const [kites, setKites] = useState<KiteItem[]>([]);
  const [cutCount, setCutCount] = useState<number>(0);

  // Phase: 'intro' -> 'cutting' -> 'counting' -> 'celebrating' -> 'completed'
  const [phase, setPhase] = useState<'intro' | 'cutting' | 'counting' | 'celebrating' | 'completed'>('intro');
  const [hasSettled, setHasSettled] = useState<boolean>(false);
  const [wrongShakeId, setWrongShakeId] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [sparklesList, setSparklesList] = useState<{ id: number; x: number; y: number }[]>([]);
  const [snipEffect, setSnipEffect] = useState<{ x: number; y: number } | null>(null);
  const [starsEarned, setStarsEarned] = useState<number>(0);

  const currentRound = rounds[currentRoundIdx] || rounds[0];
  const targetCut = currentRound.takeAwayCount;
  const remainingCount = currentRound.startCount - targetCut;

  // Number choices for answering phase
  const numberChoices = React.useMemo(() => {
    return generateNumberChoices(remainingCount, currentRound.startCount);
  }, [remainingCount, currentRound.startCount]);

  // Track timers for clean unmount
  const timersRef = useRef<NodeJS.Timeout[]>([]);
  const addTimer = (fn: () => void, ms: number) => {
    const timer = setTimeout(fn, ms);
    timersRef.current.push(timer);
    return timer;
  };

  const clearAllTimers = () => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  };

  // --------------------------------------------------------------------------
  // SOUND TOGGLE & INITIALIZATION
  // --------------------------------------------------------------------------

  useEffect(() => {
    soundManager.startBackgroundMusic();
    return () => {
      clearAllTimers();
    };
  }, []);

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundManager.enabled = !next;
    if (next) {
      soundManager.stopBackgroundMusic();
    } else {
      soundManager.startBackgroundMusic();
    }
  };

  // --------------------------------------------------------------------------
  // INIT OR ADVANCE ROUND
  // --------------------------------------------------------------------------

  const startRound = useCallback((roundIndex: number, roundList: RoundConfig[]) => {
    clearAllTimers();
    const round = roundList[roundIndex];
    if (!round) return;

    const initialKites = createKitesForRound(round, roundIndex);
    setKites(initialKites);
    setCutCount(0);
    setPhase('intro');
    setHasSettled(false);
    setWrongShakeId(null);
    setSnipEffect(null);

    // Initial voice introduction
    const startNum = round.startCount;
    const text = startNum === 1 ? 'Look! There is 1 kite!' : `Look! There are ${startNum} kites!`;
    soundManager.speak(text);

    // Let kites fly in and settle
    addTimer(() => {
      setHasSettled(true);
    }, 1600);

    // Prompt to cut
    addTimer(() => {
      setPhase('cutting');
      const takeNum = round.takeAwayCount;
      const cutText = takeNum === 1 ? 'Cut 1 kite!' : `Cut ${takeNum} kites!`;
      soundManager.speak(cutText);
    }, 2400);
  }, []);

  // Initialize round on mount or round index change
  useEffect(() => {
    if (phase !== 'completed') {
      startRound(currentRoundIdx, rounds);
    }
  }, [currentRoundIdx, rounds, startRound]);

  // --------------------------------------------------------------------------
  // SPEAK CURRENT INSTRUCTION (REPEAT BUTTON)
  // --------------------------------------------------------------------------

  const handleRepeatInstruction = () => {
    soundManager.playPop();
    if (phase === 'intro') {
      const text = currentRound.startCount === 1 ? 'Look! There is 1 kite!' : `Look! There are ${currentRound.startCount} kites!`;
      soundManager.speak(text);
    } else if (phase === 'cutting') {
      const needed = targetCut - cutCount;
      if (needed === 1) {
        soundManager.speak('Cut 1 kite!');
      } else {
        soundManager.speak(`Cut ${needed} more kites!`);
      }
    } else if (phase === 'counting') {
      soundManager.speak('How many kites are left? Count them and tap the number!');
    } else if (phase === 'completed') {
      soundManager.speak('Great job! You did it! Tap replay to play again!');
    }
  };

  // --------------------------------------------------------------------------
  // KITE TAP HANDLER (CUTTING OR COUNTING)
  // --------------------------------------------------------------------------

  const handleKiteTap = (kiteId: string) => {
    const kite = kites.find((k) => k.id === kiteId);
    if (!kite) return;

    // DURING CUTTING PHASE: CUT THE KITE
    if (phase === 'cutting') {
      if (kite.isCut) return; // cannot tap already cut kite

      const newCutCount = cutCount + 1;
      setCutCount(newCutCount);

      // Play snip and string release sound
      soundManager.playSnipCut();
      soundManager.playKiteFlyAway();

      // Trigger scissors sparkle visual at kite location
      setSnipEffect({ x: kite.xPercent, y: kite.yPercent });
      addTimer(() => setSnipEffect(null), 800);

      // Update kite state to cut & flying away
      setKites((prev) =>
        prev.map((k) => (k.id === kiteId ? { ...k, isCut: true, cutOrder: newCutCount } : k))
      );

      // Verbal count of cut kites: "One!", "Two!", "Three!"
      const countWords = ['One!', 'Two!', 'Three!', 'Four!', 'Five!'];
      const word = countWords[newCutCount - 1] || `${newCutCount}!`;
      soundManager.speak(word);

      // Check if all needed kites have been cut
      if (newCutCount >= targetCut) {
        // Transition to counting phase
        addTimer(() => {
          setPhase('counting');
          soundManager.speak('How many kites are left?');
        }, 1100);
      }
      return;
    }

    // DURING COUNTING PHASE: TAP REMAINING KITE FOR CONCRETE COUNTING
    if (phase === 'counting' && !kite.isCut) {
      soundManager.playPop();
      const currentTapCount = (kite.tapCountNumber || 0) + 1;
      setKites((prev) =>
        prev.map((k) => (k.id === kiteId ? { ...k, tapCountNumber: currentTapCount } : k))
      );
      // Small sparkle
      setSparklesList((prev) => [
        ...prev,
        { id: Date.now() + Math.random(), x: kite.xPercent, y: kite.yPercent },
      ]);
    }
  };

  // --------------------------------------------------------------------------
  // NUMBER ANSWER TAP HANDLER
  // --------------------------------------------------------------------------

  const handleSelectNumber = (chosenNum: number) => {
    if (phase !== 'counting') return;

    if (chosenNum === remainingCount) {
      // CORRECT ANSWER!
      setPhase('celebrating');
      setWrongShakeId(null);
      soundManager.playSuccess();
      setStarsEarned((prev) => prev + 1);

      // Encouraging praise phrases
      const praises = ['Great job!', 'Super! That is right!', 'Awesome!', 'You got it!'];
      const praise = praises[currentRoundIdx % praises.length];
      soundManager.speak(praise);

      // Show sparkle celebration
      setSparklesList([
        { id: 1, x: 30, y: 30 },
        { id: 2, x: 50, y: 40 },
        { id: 3, x: 70, y: 30 },
        { id: 4, x: 50, y: 20 },
      ]);

      // Move to next round or complete
      addTimer(() => {
        setSparklesList([]);
        if (currentRoundIdx + 1 < rounds.length) {
          setCurrentRoundIdx((prev) => prev + 1);
        } else {
          // All rounds completed!
          setPhase('completed');
          soundManager.playCelebration();
          if (onCollectStar) onCollectStar();
          soundManager.speak('Great job! You did it!');
        }
      }, 1700);
    } else {
      // WRONG ANSWER: Gentle hint without ending round
      soundManager.playError();
      setWrongShakeId(chosenNum);
      soundManager.speak("Let's count the kites again.");
      addTimer(() => setWrongShakeId(null), 800);
    }
  };

  // --------------------------------------------------------------------------
  // REPLAY GAME (SHUFFLES ALL ROUNDS, COLORS, NUMBERS, POSITIONS)
  // --------------------------------------------------------------------------

  const handleReplay = () => {
    soundManager.playPop();
    const freshRounds = pickRandomRounds();
    setRounds(freshRounds);
    setCurrentRoundIdx(0);
    setStarsEarned(0);
    startRound(0, freshRounds);
  };

  // --------------------------------------------------------------------------
  // RENDER KITE SVG HELPER
  // --------------------------------------------------------------------------

  const renderKiteSvg = (kite: KiteItem) => {
    const colorDef = KITE_COLOR_PALETTES[kite.color];

    return (
      <svg
        viewBox="0 0 120 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md overflow-visible select-none pointer-events-none"
      >
        <defs>
          <linearGradient id={`grad_${kite.id}`} x1="20" y1="10" x2="80" y2="90" gradientUnits="userSpaceOnUse">
            <stop stopColor={colorDef.gradTop} />
            <stop offset="1" stopColor={colorDef.gradBottom} />
          </linearGradient>

          {/* Sparkle star symbol */}
          <g id={`starMini_${kite.id}`}>
            <path d="M0 -5 L1.5 -1.5 L5 0 L1.5 1.5 L0 5 L-1.5 1.5 L-5 0 L-1.5 -1.5 Z" fill="#FFFFFF" opacity="0.8" />
          </g>
        </defs>

        {/* 1. TAIL STRING & DECORATIVE BOWS */}
        <path
          d="M60 85 Q72 105 58 125 Q46 142 62 155"
          stroke="#FDE047"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Bow 1 */}
        <g transform="translate(64, 102) rotate(15)">
          <path d="M0 0 L8 -6 L8 6 Z M0 0 L-8 -6 L-8 6 Z" fill={colorDef.bowColors[0]} stroke="#0F172A" strokeWidth="1" />
          <circle cx="0" cy="0" r="2.5" fill="#FFFFFF" />
        </g>
        {/* Bow 2 */}
        <g transform="translate(54, 126) rotate(-18)">
          <path d="M0 0 L8 -6 L8 6 Z M0 0 L-8 -6 L-8 6 Z" fill={colorDef.bowColors[1]} stroke="#0F172A" strokeWidth="1" />
          <circle cx="0" cy="0" r="2.5" fill="#FFFFFF" />
        </g>
        {/* Bow 3 */}
        <g transform="translate(62, 148) rotate(12)">
          <path d="M0 0 L8 -6 L8 6 Z M0 0 L-8 -6 L-8 6 Z" fill={colorDef.bowColors[2]} stroke="#0F172A" strokeWidth="1" />
          <circle cx="0" cy="0" r="2.5" fill="#FFFFFF" />
        </g>

        {/* 2. DIAMOND KITE BODY */}
        <polygon
          points="60,6 108,45 60,85 12,45"
          fill={`url(#grad_${kite.id})`}
          stroke={colorDef.border}
          strokeWidth="4"
          strokeLinejoin="round"
        />

        {/* Pattern overlays */}
        {kite.pattern === 'stripes' && (
          <g opacity="0.35">
            <line x1="30" y1="30" x2="90" y2="30" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" />
            <line x1="24" y1="45" x2="96" y2="45" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" />
            <line x1="36" y1="60" x2="84" y2="60" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" />
          </g>
        )}

        {kite.pattern === 'diamonds' && (
          <g opacity="0.35">
            <polygon points="60,20 84,45 60,70 36,45" fill="#FFFFFF" />
          </g>
        )}

        {kite.pattern === 'stars' && (
          <g transform="translate(60, 45)">
            <use href={`#starMini_${kite.id}`} x="-24" y="-10" transform="scale(1.2)" />
            <use href={`#starMini_${kite.id}`} x="24" y="-10" transform="scale(1.2)" />
            <use href={`#starMini_${kite.id}`} x="0" y="16" transform="scale(1.4)" />
          </g>
        )}

        {kite.pattern === 'polka' && (
          <g fill="#FFFFFF" opacity="0.45">
            <circle cx="40" cy="30" r="4.5" />
            <circle cx="80" cy="30" r="4.5" />
            <circle cx="60" cy="22" r="4" />
            <circle cx="60" cy="68" r="4" />
            <circle cx="34" cy="48" r="3.5" />
            <circle cx="86" cy="48" r="3.5" />
          </g>
        )}

        {kite.pattern === 'dual' && (
          <polygon
            points="60,6 108,45 60,85"
            fill="#FFFFFF"
            opacity="0.22"
          />
        )}

        {/* 3. WOODEN CROSS SPARS */}
        <line x1="60" y1="6" x2="60" y2="85" stroke={colorDef.accent} strokeWidth="3" opacity="0.9" />
        <line x1="12" y1="45" x2="108" y2="45" stroke={colorDef.accent} strokeWidth="3" opacity="0.9" />

        {/* Center Spar Cross Knot */}
        <circle cx="60" cy="45" r="4" fill="#FBBF24" stroke="#B45309" strokeWidth="1.5" />

        {/* 4. CUTE SMILING FACE */}
        {/* Left Eye */}
        <circle cx="46" cy="36" r="4" fill={colorDef.faceEyes} />
        <circle cx="47.5" cy="34.5" r="1.5" fill="#FFFFFF" />

        {/* Right Eye */}
        <circle cx="74" cy="36" r="4" fill={colorDef.faceEyes} />
        <circle cx="75.5" cy="34.5" r="1.5" fill="#FFFFFF" />

        {/* Rosy Cheeks */}
        <ellipse cx="40" cy="44" rx="4.5" ry="3" fill="#FB7185" opacity="0.75" />
        <ellipse cx="80" cy="44" rx="4.5" ry="3" fill="#FB7185" opacity="0.75" />

        {/* Big Happy Smile */}
        <path
          d="M50 44 Q60 54 70 44"
          stroke={colorDef.faceEyes}
          strokeWidth="3.2"
          strokeLinecap="round"
          fill="none"
        />

        {/* Cute Sparkle at top corner */}
        <path d="M60 12 L62 8 L64 12 L68 14 L64 16 L62 20 L60 16 L56 14 Z" fill="#FEF08A" />
      </svg>
    );
  };

  // --------------------------------------------------------------------------
  // RENDER
  // --------------------------------------------------------------------------

  return (
    <div className="relative w-full min-h-[92vh] flex flex-col items-center justify-between p-3 sm:p-5 select-none overflow-hidden font-sans">
      {/* -------------------------------------------------------------------- */}
      {/* CHEERFUL SKY BACKGROUND & CLOUDS */}
      {/* -------------------------------------------------------------------- */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#60A5FA] via-[#7DD3FC] to-[#BAE6FD] pointer-events-none overflow-hidden">
        {/* Soft Smiling Sun in Corner */}
        <div className="absolute top-4 right-6 sm:right-12 w-20 sm:w-28 h-20 sm:h-28">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 36, repeat: Infinity, ease: 'linear' }}
            className="w-full h-full relative"
          >
            {/* Sun Rays */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
              <div
                key={deg}
                className="absolute top-1/2 left-1/2 w-4 h-1.5 sm:w-6 sm:h-2 bg-[#FDE047] rounded-full origin-left opacity-80"
                style={{ transform: `rotate(${deg}deg) translate(28px, -50%)` }}
              />
            ))}
            {/* Sun Disc */}
            <div className="absolute inset-2 sm:inset-3 bg-gradient-to-tr from-[#F59E0B] via-[#FBBF24] to-[#FEF08A] rounded-full shadow-lg border-2 border-amber-300 flex items-center justify-center">
              <span className="text-xl sm:text-2xl">😊</span>
            </div>
          </motion.div>
        </div>

        {/* Animated Floating Clouds */}
        <motion.div
          animate={{ x: [-20, 40, -20] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-14 left-8 w-44 sm:w-60 h-16 sm:h-20 bg-white/85 rounded-full blur-[0.5px] shadow-sm flex items-center"
        >
          <div className="w-20 h-20 bg-white/85 rounded-full absolute -top-7 left-8" />
          <div className="w-16 h-16 bg-white/85 rounded-full absolute -top-5 left-24" />
        </motion.div>

        <motion.div
          animate={{ x: [30, -30, 30] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-36 right-16 sm:right-32 w-48 sm:w-64 h-16 bg-white/75 rounded-full blur-[0.5px]"
        >
          <div className="w-18 h-18 bg-white/75 rounded-full absolute -top-7 left-12" />
          <div className="w-14 h-14 bg-white/75 rounded-full absolute -top-4 left-28" />
        </motion.div>

        {/* Subtle Wind Swirl Lines */}
        <svg className="absolute inset-0 w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M 50 140 Q 250 110 450 140 T 850 130"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray="12 12"
          />
          <path
            d="M 150 280 Q 400 250 650 290 T 1050 270"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="10 10"
          />
        </svg>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* TOP HEADER: TITLE, PROGRESS STARS & SOUND TOGGLE */}
      {/* -------------------------------------------------------------------- */}
      <div className="relative z-20 w-full max-w-4xl flex items-center justify-between gap-2 bg-white/90 backdrop-blur-md px-3 sm:px-5 py-2.5 rounded-3xl shadow-lg border-2 border-sky-200">
        {/* Activity Name & Round Indicator */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-tr from-rose-500 to-amber-400 rounded-2xl flex items-center justify-center text-xl sm:text-2xl shadow-md border-2 border-white">
            🪁
          </div>
          <div>
            <h1 className="text-base sm:text-xl font-black text-sky-950 tracking-tight flex items-center gap-1.5">
              Kite Count & Take Away
            </h1>
            <div className="text-xs sm:text-sm font-bold text-sky-700">
              Round {phase === 'completed' ? rounds.length : currentRoundIdx + 1} of {rounds.length}
            </div>
          </div>
        </div>

        {/* Stars Progress Indicator */}
        <div className="flex items-center gap-1 sm:gap-1.5 bg-amber-100/90 px-3 py-1.5 rounded-full border border-amber-300 shadow-inner">
          {Array.from({ length: rounds.length }).map((_, idx) => (
            <Star
              key={idx}
              className={`w-5 h-5 sm:w-6 sm:h-6 transition-all duration-300 ${
                idx < currentRoundIdx || (phase === 'completed' && idx < rounds.length)
                  ? 'text-amber-500 fill-amber-400 scale-110 drop-shadow-sm'
                  : idx === currentRoundIdx && phase !== 'completed'
                  ? 'text-amber-400 fill-amber-200 animate-pulse'
                  : 'text-gray-300 fill-gray-200'
              }`}
            />
          ))}
        </div>

        {/* Action Controls: Repeat Voice & Mute */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={handleRepeatInstruction}
            className="p-2 sm:p-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-2xl shadow-md border-b-4 border-sky-700 active:border-b-0 active:translate-y-1 transition-all cursor-pointer"
            title="Hear instruction again"
            aria-label="Repeat Audio Instruction"
          >
            <Volume2 className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button
            type="button"
            onClick={toggleMute}
            className={`p-2 sm:p-2.5 rounded-2xl shadow-md border-b-4 active:border-b-0 active:translate-y-1 transition-all cursor-pointer ${
              isMuted
                ? 'bg-rose-500 border-rose-700 text-white'
                : 'bg-emerald-500 border-emerald-700 text-white'
            }`}
            title={isMuted ? 'Unmute audio' : 'Mute audio'}
            aria-label="Toggle Mute"
          >
            <span className="text-xs sm:text-sm font-black">{isMuted ? 'MUTED' : 'AUDIO'}</span>
          </button>
        </div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* INTERACTIVE INSTRUCTION BANNER */}
      {/* -------------------------------------------------------------------- */}
      <div className="relative z-20 w-full max-w-2xl my-2 flex justify-center">
        <motion.div
          key={`${phase}_${currentRoundIdx}_${cutCount}`}
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.25 }}
          className={`w-full text-center px-4 py-2.5 rounded-3xl shadow-xl border-4 text-white flex items-center justify-center gap-3 ${
            phase === 'intro'
              ? 'bg-gradient-to-r from-sky-500 to-blue-600 border-white'
              : phase === 'cutting'
              ? 'bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 border-yellow-200 animate-pulse'
              : phase === 'counting'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 border-emerald-200'
              : phase === 'celebrating'
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 border-white'
              : 'bg-gradient-to-r from-amber-500 to-yellow-500 border-white'
          }`}
        >
          {phase === 'intro' && (
            <p className="text-lg sm:text-2xl font-black tracking-wide drop-shadow-md">
              👀 Look! There {currentRound.startCount === 1 ? 'is 1 kite' : `are ${currentRound.startCount} kites`}!
            </p>
          )}

          {phase === 'cutting' && (
            <div className="flex items-center gap-2">
              <Scissors className="w-6 h-6 sm:w-8 sm:h-8 stroke-[2.5] animate-bounce" />
              <p className="text-lg sm:text-2xl font-black tracking-wide drop-shadow-md">
                Cut {targetCut === 1 ? '1 kite' : `${targetCut} kites`}!
                {targetCut > 1 && (
                  <span className="ml-2 text-sm sm:text-base font-bold bg-white/30 px-2.5 py-0.5 rounded-full">
                    ({cutCount}/{targetCut} cut)
                  </span>
                )}
              </p>
            </div>
          )}

          {phase === 'counting' && (
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 sm:w-7 sm:h-7" />
              <p className="text-lg sm:text-2xl font-black tracking-wide drop-shadow-md">
                How many kites are left? Count them!
              </p>
            </div>
          )}

          {phase === 'celebrating' && (
            <p className="text-xl sm:text-3xl font-black tracking-wide drop-shadow-md flex items-center gap-2">
              🎉 Great Job! {remainingCount} {remainingCount === 1 ? 'kite is' : 'kites are'} left!
            </p>
          )}

          {phase === 'completed' && (
            <p className="text-xl sm:text-3xl font-black tracking-wide drop-shadow-md">
              🏆 Kite Math Completed!
            </p>
          )}
        </motion.div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* MAIN GAME STAGE: FLYING KITES SKY CANVAS */}
      {/* -------------------------------------------------------------------- */}
      <div className="relative z-10 w-full max-w-5xl h-[340px] sm:h-[420px] my-auto flex items-center justify-center overflow-visible">
        {/* Scissors Snip Visual Overlay */}
        <AnimatePresence>
          {snipEffect && (
            <motion.div
              initial={{ scale: 0, opacity: 1, rotate: -20 }}
              animate={{ scale: 1.4, opacity: 1, rotate: 10 }}
              exit={{ scale: 1.8, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute z-40 pointer-events-none flex items-center justify-center"
              style={{
                left: `${snipEffect.x}%`,
                top: `${snipEffect.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div className="relative">
                <div className="w-16 h-16 bg-white/90 rounded-full shadow-2xl flex items-center justify-center border-4 border-rose-500">
                  <Scissors className="w-9 h-9 text-rose-600 stroke-[3]" />
                </div>
                <div className="absolute -top-3 -right-3 text-2xl animate-spin">✨</div>
                <div className="absolute -bottom-2 -left-2 text-xl">✂️</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Confetti & Sparkles Overlay */}
        <AnimatePresence>
          {sparklesList.map((sparkle) => (
            <motion.div
              key={sparkle.id}
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: [0, 1.3, 0], opacity: [0, 1, 0] }}
              transition={{ duration: 1.2 }}
              className="absolute z-30 pointer-events-none text-3xl"
              style={{
                left: `${sparkle.x}%`,
                top: `${sparkle.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              ✨⭐✨
            </motion.div>
          ))}
        </AnimatePresence>

        {/* ------------------------------------------------------------------ */}
        {/* KITES IN SKY */}
        {/* ------------------------------------------------------------------ */}
        {phase !== 'completed' &&
          kites.map((kite) => {
            const isCut = kite.isCut;

            return (
              <motion.div
                key={kite.id}
                initial={{
                  opacity: 0,
                  scale: 0.65,
                  y: 280,
                  x: kite.index % 2 === 0 ? -30 : 30,
                  rotate: kite.rotation + (kite.index % 2 === 0 ? -20 : 20),
                }}
                animate={
                  isCut
                    ? {
                        // KITE CUT: FLIES AWAY UPWARD AND OFF SCREEN
                        opacity: [1, 1, 0],
                        y: [-5, -240, -650],
                        x: [0, kite.index % 2 === 0 ? -90 : 90, kite.index % 2 === 0 ? -220 : 220],
                        rotate: [kite.rotation, kite.rotation + (kite.index % 2 === 0 ? -35 : 35)],
                        scale: [1, 0.9, 0.6],
                      }
                    : phase === 'celebrating'
                    ? {
                        // CELEBRATING: GENTLE CELEBRATION HOP
                        opacity: 1,
                        scale: [1, 1.1, 1],
                        y: [0, -18, 0],
                        x: 0,
                        rotate: [kite.rotation, kite.rotation + (kite.index % 2 === 0 ? 5 : -5), kite.rotation],
                      }
                    : {
                        // UNCUT KITE: SETTLED IN ITS VISIBLE SPOT (STILL FOR CLEAR COUNTING)
                        opacity: 1,
                        scale: 1,
                        y: 0,
                        x: 0,
                        rotate: kite.rotation,
                      }
                }
                transition={
                  isCut
                    ? { duration: 1.2, ease: [0.32, 0, 0.67, 0] }
                    : phase === 'celebrating'
                    ? { duration: 0.8, repeat: 1, ease: 'easeInOut' }
                    : {
                        duration: 1.5,
                        delay: hasSettled ? 0 : kite.index * 0.1,
                        ease: [0.22, 1, 0.36, 1],
                      }
                }
                style={{
                  position: 'absolute',
                  left: `${kite.xPercent}%`,
                  top: `${kite.yPercent}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                className={`w-28 h-36 sm:w-36 sm:h-48 cursor-pointer touch-manipulation z-20 ${
                  isCut ? 'pointer-events-none' : ''
                }`}
                onClick={() => handleKiteTap(kite.id)}
              >
                {/* Kite Container */}
                <div className="relative w-full h-full group">
                  {/* Scissors Hover / Cue Indicator when in cutting phase */}
                  {phase === 'cutting' && !isCut && (
                    <motion.div
                      animate={{ scale: [1, 1.15, 1], rotate: [-10, 10, -10] }}
                      transition={{ duration: 1.2, repeat: Infinity }}
                      className="absolute -top-3 -right-2 bg-rose-500 text-white p-1.5 sm:p-2 rounded-full shadow-lg border-2 border-white z-30 flex items-center justify-center"
                    >
                      <Scissors className="w-4 h-4 sm:w-5 sm:h-5" />
                    </motion.div>
                  )}

                  {/* Concrete Counting Badge if child taps remaining kite in counting phase */}
                  {phase === 'counting' && !isCut && kite.tapCountNumber && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1.2 }}
                      className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-950 font-black text-lg sm:text-xl w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-lg border-2 border-white z-30"
                    >
                      {kite.tapCountNumber}
                    </motion.div>
                  )}

                  {/* Cut Order badge while flying away */}
                  {isCut && kite.cutOrder && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-rose-600 text-white font-black text-base px-2 py-0.5 rounded-full shadow-md z-30">
                      ✂️ Cut #{kite.cutOrder}
                    </div>
                  )}

                  {/* Main Kite SVG */}
                  <div className="w-full h-full transition-transform active:scale-95 group-hover:scale-105">
                    {renderKiteSvg(kite)}
                  </div>
                </div>
              </motion.div>
            );
          })}

        {/* ------------------------------------------------------------------ */}
        {/* COMPLETION SCREEN POPUP */}
        {/* ------------------------------------------------------------------ */}
        {phase === 'completed' && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-xl bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-amber-300 flex flex-col items-center text-center z-30"
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-tr from-amber-400 to-yellow-300 rounded-3xl flex items-center justify-center text-4xl sm:text-5xl shadow-xl border-4 border-white mb-3 animate-bounce">
              <Trophy className="w-12 h-12 sm:w-14 sm:h-14 text-amber-900" />
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-amber-950 tracking-tight mb-2">
              Great Job! You Did It! 🎉
            </h2>
            <p className="text-base sm:text-lg font-bold text-sky-800 mb-5 max-w-md">
              You mastered counting kites, taking them away, and finding how many are left!
            </p>

            {/* Stars Row */}
            <div className="flex items-center justify-center gap-2 mb-6">
              {Array.from({ length: rounds.length }).map((_, i) => (
                <div
                  key={i}
                  className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center border-2 border-amber-300 shadow-md"
                >
                  <Star className="w-7 h-7 text-amber-500 fill-amber-400" />
                </div>
              ))}
            </div>

            {/* Replay Button */}
            <button
              type="button"
              onClick={handleReplay}
              className="flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-black text-xl sm:text-2xl py-4 px-8 rounded-3xl border-b-8 border-green-800 shadow-2xl active:border-b-2 active:translate-y-1.5 transition-all cursor-pointer w-full max-w-xs"
            >
              <RotateCcw className="w-7 h-7 stroke-[3]" />
              <span>REPLAY</span>
            </button>
          </motion.div>
        )}
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* NUMBER ANSWER CHOICES UNDERNEATH SKY */}
      {/* -------------------------------------------------------------------- */}
      <div className="relative z-20 w-full max-w-3xl flex flex-col items-center mt-2">
        {phase === 'counting' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full bg-white/90 backdrop-blur-md rounded-3xl p-4 sm:p-5 shadow-2xl border-4 border-sky-300 flex flex-col items-center"
          >
            <div className="text-center font-black text-sky-950 text-base sm:text-lg mb-3">
              Tap the number of kites left in the sky:
            </div>

            <div className="grid grid-cols-4 gap-3 sm:gap-6 w-full max-w-lg">
              {numberChoices.map((num) => {
                const isWrongShaking = wrongShakeId === num;

                return (
                  <motion.button
                    key={num}
                    type="button"
                    onClick={() => handleSelectNumber(num)}
                    animate={
                      isWrongShaking
                        ? { x: [-10, 10, -8, 8, -4, 4, 0] }
                        : { scale: 1 }
                    }
                    transition={{ duration: 0.5 }}
                    className={`h-20 sm:h-24 rounded-3xl font-black text-3xl sm:text-5xl shadow-xl flex items-center justify-center cursor-pointer transition-all border-b-8 active:border-b-2 active:translate-y-1.5 ${
                      isWrongShaking
                        ? 'bg-rose-100 border-rose-500 text-rose-700'
                        : 'bg-gradient-to-b from-amber-300 to-amber-400 hover:from-amber-200 hover:to-amber-300 text-amber-950 border-amber-600 shadow-amber-500/30'
                    }`}
                  >
                    {num}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* If in cutting phase, show prompt hint card */}
        {phase === 'cutting' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white/80 backdrop-blur-sm px-6 py-2.5 rounded-2xl border-2 border-sky-200 text-sky-900 font-bold text-sm sm:text-base text-center shadow-md"
          >
            ✂️ Tap any flying kite to cut its string and watch it fly away!
          </motion.div>
        )}

        {/* If in intro phase, show visual countdown hint */}
        {phase === 'intro' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white/80 backdrop-blur-sm px-6 py-2.5 rounded-2xl border-2 border-sky-200 text-sky-900 font-bold text-sm sm:text-base text-center shadow-md"
          >
            👀 Count all the kites flying in the sky!
          </motion.div>
        )}
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* BOTTOM NAVIGATION (PREV / HOME / NEXT) */}
      {/* -------------------------------------------------------------------- */}
      <div className="relative z-20 w-full flex justify-center">
        <ActivityBottomNav
          onNavigatePrev={onNavigatePrev}
          onNavigateHome={onNavigateHome}
          onNavigateNext={onNavigateNext}
          isNextUnlocked={isActivityCompleted || phase === 'completed'}
        />
      </div>
    </div>
  );
};
