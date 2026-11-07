import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  RotateCcw,
  Volume2,
  Check,
  Star,
  Sparkles,
  Shuffle,
  Trophy,
} from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { ActivityBottomNav } from './ActivityBottomNav';

// ============================================================================
// TYPES & DEFINITIONS
// ============================================================================

export type FishLearningCategory = 'alphabets' | 'numbers' | 'colors';

export type FishColor =
  | 'red'
  | 'blue'
  | 'yellow'
  | 'green'
  | 'purple'
  | 'orange'
  | 'pink'
  | 'cyan';

export interface FishColorDef {
  name: string;
  fill: string;
  topGrad: string;
  botGrad: string;
  finGradStart: string;
  finGradEnd: string;
  stroke: string;
  badgeBg: string;
  badgeText: string;
  highlight: string;
}

export const FISH_COLOR_PALETTE: Record<FishColor, FishColorDef> = {
  red: {
    name: 'Red',
    fill: '#EF4444',
    topGrad: '#FCA5A5',
    botGrad: '#DC2626',
    finGradStart: '#F87171',
    finGradEnd: '#B91C1C',
    stroke: '#991B1B',
    badgeBg: '#FEE2E2',
    badgeText: '#991B1B',
    highlight: '#FFF1F2',
  },
  blue: {
    name: 'Blue',
    fill: '#3B82F6',
    topGrad: '#93C5FD',
    botGrad: '#1D4ED8',
    finGradStart: '#60A5FA',
    finGradEnd: '#1E40AF',
    stroke: '#1E3A8A',
    badgeBg: '#DBEAFE',
    badgeText: '#1E40AF',
    highlight: '#EFF6FF',
  },
  yellow: {
    name: 'Yellow',
    fill: '#FACC15',
    topGrad: '#FEF08A',
    botGrad: '#EAB308',
    finGradStart: '#FDE047',
    finGradEnd: '#CA8A04',
    stroke: '#854D0E',
    badgeBg: '#FEF9C3',
    badgeText: '#854D0E',
    highlight: '#FEFCE8',
  },
  green: {
    name: 'Green',
    fill: '#22C55E',
    topGrad: '#86EFAC',
    botGrad: '#15803D',
    finGradStart: '#4ADE80',
    finGradEnd: '#166534',
    stroke: '#14532D',
    badgeBg: '#DCFCE7',
    badgeText: '#166534',
    highlight: '#F0FDF4',
  },
  purple: {
    name: 'Purple',
    fill: '#A855F7',
    topGrad: '#D8B4FE',
    botGrad: '#7E22CE',
    finGradStart: '#C084FC',
    finGradEnd: '#6B21A8',
    stroke: '#581C87',
    badgeBg: '#F3E8FF',
    badgeText: '#6B21A8',
    highlight: '#FAF5FF',
  },
  orange: {
    name: 'Orange',
    fill: '#F97316',
    topGrad: '#FDBA74',
    botGrad: '#C2410C',
    finGradStart: '#FB923C',
    finGradEnd: '#9A3412',
    stroke: '#7C2D12',
    badgeBg: '#FFEDD5',
    badgeText: '#9A3412',
    highlight: '#FFF7ED',
  },
  pink: {
    name: 'Pink',
    fill: '#EC4899',
    topGrad: '#F9A8D4',
    botGrad: '#BE185D',
    finGradStart: '#F472B6',
    finGradEnd: '#9D174D',
    stroke: '#831843',
    badgeBg: '#FCE7F3',
    badgeText: '#9D174D',
    highlight: '#FDF2F8',
  },
  cyan: {
    name: 'Cyan',
    fill: '#06B6D4',
    topGrad: '#67E8F9',
    botGrad: '#0E7490',
    finGradStart: '#22D3EE',
    finGradEnd: '#155E75',
    stroke: '#164E63',
    badgeBg: '#CFFAFE',
    badgeText: '#155E75',
    highlight: '#ECFEFF',
  },
};

const ALL_COLORS: FishColor[] = [
  'red',
  'blue',
  'yellow',
  'green',
  'purple',
  'orange',
  'pink',
  'cyan',
];

const ALPHABET_POOL = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const NUMBER_POOL = [1, 2, 3, 4, 5, 6, 7, 8, 9];

// Single Target Challenge Inside a Category
export interface FishChallenge {
  category: FishLearningCategory;
  targetAlphabet?: string;
  targetNumber?: number;
  targetColor?: FishColor;
  voiceInstruction: string;
  audioHint: string;
}

// Interactive Active Swimming Fish Instance
export interface SwimmingFish {
  id: string;
  xPercent: number; // 5% - 85%
  yPercent: number; // 10% - 75%
  vx: number; // Horizontal velocity (percentage per frame, signed)
  baseYPercent: number;
  swayAmp: number;
  swayFreq: number;
  swayPhase: number;
  direction: 1 | -1; // 1 = swimming right, -1 = swimming left
  color: FishColor;
  label?: string; // Alphabet letter or Number string
  isTarget: boolean;
  sizePx: number;
  scale: number;
  opacity: number;
  isPopping?: boolean;
  wiggleOffset: number;
}

// Underwater Bubble
export interface AmbientBubble {
  id: string;
  xPercent: number;
  yPercent: number;
  speed: number;
  size: number;
  wobbleSpeed: number;
  wobbleAmp: number;
  phase: number;
  opacity: number;
}

// Sparkle Particle Effect on Correct Tap
export interface SparkleFX {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  opacity: number;
  shape: 'star' | 'circle';
}

interface FishHuntingProps {
  onCollectStar?: () => void;
  onNavigateHome: () => void;
  onNavigateNext?: () => void;
  onNavigatePrev?: () => void;
  isActivityCompleted?: boolean;
}

// Helper: Fisher-Yates shuffle array clone
function shuffleArray<T>(arr: T[]): T[] {
  const cloned = [...arr];
  for (let i = cloned.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cloned[i], cloned[j]] = [cloned[j], cloned[i]];
  }
  return cloned;
}

// ============================================================================
// CUTE 2D/3D-DEPTH FISH SVG ILLUSTRATION
// ============================================================================

export const CuteFishSVG: React.FC<{
  color: FishColor;
  direction: 1 | -1;
  label?: string;
  size?: number;
  isTarget?: boolean;
  isPopping?: boolean;
}> = ({ color, direction, label, size = 110, isPopping = false }) => {
  const palette = FISH_COLOR_PALETTE[color] || FISH_COLOR_PALETTE.orange;
  const isFacingRight = direction === 1;

  return (
    <div
      className={`relative select-none pointer-events-auto transition-transform duration-200 ${
        isPopping ? 'scale-125' : 'active:scale-95'
      }`}
      style={{
        width: size,
        height: size * 0.72,
        transform: isFacingRight ? 'scaleX(1)' : 'scaleX(-1)',
      }}
    >
      <svg
        viewBox="0 0 120 86"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible drop-shadow-md"
      >
        <defs>
          <linearGradient
            id={`fishBodyGrad-${color}`}
            x1="20"
            y1="15"
            x2="95"
            y2="75"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={palette.topGrad} />
            <stop offset="0.45" stopColor={palette.fill} />
            <stop offset="1" stopColor={palette.botGrad} />
          </linearGradient>

          <linearGradient
            id={`fishFinGrad-${color}`}
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >
            <stop stopColor={palette.finGradStart} />
            <stop offset="1" stopColor={palette.finGradEnd} />
          </linearGradient>

          <linearGradient
            id={`fishBellyGrad-${color}`}
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="1" stopColor="#FFFFFF" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {/* 1. TAIL FIN (Back) */}
        <path
          d="M32 43 C16 22, 6 28, 12 43 C6 58, 16 64, 32 43 Z"
          fill={`url(#fishFinGrad-${color})`}
          stroke={palette.stroke}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* Tail fin texture lines */}
        <path
          d="M16 36 Q25 41 30 43"
          stroke={palette.stroke}
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.6"
        />
        <path
          d="M16 50 Q25 45 30 43"
          stroke={palette.stroke}
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.6"
        />

        {/* 2. DORSAL FIN (Top) */}
        <path
          d="M52 24 C60 10, 78 12, 82 27 Z"
          fill={`url(#fishFinGrad-${color})`}
          stroke={palette.stroke}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path
          d="M62 17 Q66 22 68 26"
          stroke={palette.stroke}
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.6"
        />
        <path
          d="M72 17 Q75 22 77 26"
          stroke={palette.stroke}
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.6"
        />

        {/* 3. VENTRAL FIN (Bottom) */}
        <path
          d="M58 62 C66 76, 78 74, 76 60 Z"
          fill={`url(#fishFinGrad-${color})`}
          stroke={palette.stroke}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* 4. MAIN BODY (Plump & Rounded for preschool delight) */}
        <ellipse
          cx="64"
          cy="43"
          rx="36"
          ry="24"
          fill={`url(#fishBodyGrad-${color})`}
          stroke={palette.stroke}
          strokeWidth="3.2"
        />

        {/* Top 3D highlight glow */}
        <ellipse
          cx="64"
          cy="26"
          rx="22"
          ry="6"
          fill="#FFFFFF"
          opacity="0.45"
        />

        {/* White Cute Belly Stripe */}
        <path
          d="M48 28 C55 36, 55 50, 48 58"
          stroke="#FFFFFF"
          strokeWidth="3.5"
          strokeLinecap="round"
          opacity="0.85"
        />
        <path
          d="M60 25 C68 35, 68 51, 60 61"
          stroke="#FFFFFF"
          strokeWidth="3.5"
          strokeLinecap="round"
          opacity="0.85"
        />

        {/* 5. SIDE PECTORAL FIN */}
        <path
          d="M52 45 C60 41, 65 48, 55 54 Z"
          fill={`url(#fishFinGrad-${color})`}
          stroke={palette.stroke}
          strokeWidth="2"
        />

        {/* 6. BIG EXPRESSIVE PRESCHOOL EYE */}
        {/* Outer White Sclera */}
        <circle
          cx="84"
          cy="37"
          r="8.5"
          fill="#FFFFFF"
          stroke={palette.stroke}
          strokeWidth="2"
        />
        {/* Dark Pupil */}
        <circle cx="86" cy="37" r="4.8" fill="#1E293B" />
        {/* Cute Sparkle Catchlights */}
        <circle cx="87.5" cy="35" r="2" fill="#FFFFFF" />
        <circle cx="84.5" cy="39" r="1" fill="#FFFFFF" />

        {/* 7. ROSY CHEEK */}
        <ellipse
          cx="80"
          cy="48"
          rx="4.5"
          ry="2.8"
          fill="#FB7185"
          opacity="0.65"
        />

        {/* 8. SMILING MOUTH */}
        <path
          d="M96 44 Q92 48 89 44"
          stroke={palette.stroke}
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Little bubble popping from mouth */}
        <circle
          cx="103"
          cy="40"
          r="3"
          fill="#E0F2FE"
          stroke="#38BDF8"
          strokeWidth="1"
          opacity="0.85"
        />
        <circle
          cx="109"
          cy="33"
          r="2"
          fill="#E0F2FE"
          stroke="#38BDF8"
          strokeWidth="0.8"
          opacity="0.85"
        />
      </svg>

      {/* 9. CENTER BADGE FOR ALPHABET / NUMBER (Counter-flipped so text is always upright) */}
      {label && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{
            transform: isFacingRight ? 'none' : 'scaleX(-1)',
            left: '-6%',
          }}
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 border-3 border-slate-900/40 shadow-lg flex items-center justify-center transform translate-x-1 sm:translate-x-2">
            <span className="font-black text-slate-950 text-2xl sm:text-3xl leading-none tracking-tight">
              {label}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// MAIN FISH HUNTING COMPONENT
// ============================================================================

export const FishHunting: React.FC<FishHuntingProps> = ({
  onCollectStar,
  onNavigateHome,
  onNavigateNext,
  onNavigatePrev,
  isActivityCompleted = false,
}) => {
  // --------------------------------------------------------------------------
  // GAME PROGRESS STATE & MULTI-LEVEL SHUFFLE ENGINE
  // --------------------------------------------------------------------------

  // Level 1: Category Order (e.g. ['alphabets', 'numbers', 'colors'])
  const [categoryOrder, setCategoryOrder] = useState<FishLearningCategory[]>(() =>
    shuffleArray<FishLearningCategory>(['alphabets', 'numbers', 'colors'])
  );
  const [categoryIndex, setCategoryIndex] = useState<number>(0);

  // Level 2: Targets per Category (Generated fresh on each replay / category switch)
  const [categoryChallenges, setCategoryChallenges] = useState<FishChallenge[]>(
    []
  );
  const [challengeIndex, setChallengeIndex] = useState<number>(0);

  // Top-Level State Machine
  const [activityState, setActivityState] = useState<
    'intro' | 'playing' | 'category_transition' | 'all_done'
  >('intro');

  // Swimming Fish on Screen
  const [fishes, setFishes] = useState<SwimmingFish[]>([]);
  // Sparkle FX Particles
  const [sparkles, setSparkles] = useState<SparkleFX[]>([]);
  // Ambient Bubbles
  const [ambientBubbles, setAmbientBubbles] = useState<AmbientBubble[]>([]);

  // Ref tracking
  const arenaRef = useRef<HTMLDivElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());
  const timersRef = useRef<NodeJS.Timeout[]>([]);
  const isTransitioningRef = useRef<boolean>(false);

  // Floating Pop Effect at Tap Point
  const [popFeedback, setPopFeedback] = useState<{
    text: string;
    x: number;
    y: number;
    color: string;
  } | null>(null);

  // Clear all pending timeouts safely
  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  }, []);

  // --------------------------------------------------------------------------
  // LEVEL 2 GENERATOR: BUILD SHUFFLED TARGETS FOR GIVEN CATEGORY
  // --------------------------------------------------------------------------
  const buildChallengesForCategory = useCallback(
    (cat: FishLearningCategory): FishChallenge[] => {
      if (cat === 'alphabets') {
        // Pick 4 shuffled target letters from pool
        const shuffledLetters = shuffleArray(ALPHABET_POOL).slice(0, 4);
        return shuffledLetters.map((letter) => ({
          category: 'alphabets',
          targetAlphabet: letter,
          voiceInstruction: `Hunt the fish with alphabet ${letter}!`,
          audioHint: `Find the fish with ${letter}!`,
        }));
      }

      if (cat === 'numbers') {
        // Pick 4 shuffled target numbers from pool
        const shuffledNums = shuffleArray(NUMBER_POOL).slice(0, 4);
        return shuffledNums.map((num) => ({
          category: 'numbers',
          targetNumber: num,
          voiceInstruction: `Hunt number ${num}!`,
          audioHint: `Look for number ${num}!`,
        }));
      }

      // Colors Category: Pick 4 shuffled target colors
      const shuffledCols = shuffleArray(ALL_COLORS).slice(0, 4);
      return shuffledCols.map((col) => {
        const colName = FISH_COLOR_PALETTE[col].name;
        return {
          category: 'colors',
          targetColor: col,
          voiceInstruction: `Hunt the ${colName.toLowerCase()} fish!`,
          audioHint: `Find the ${colName.toLowerCase()} fish!`,
        };
      });
    },
    []
  );

  // Current Active Challenge Helper
  const currentCategory = categoryOrder[categoryIndex] || 'alphabets';
  const currentChallenge = categoryChallenges[challengeIndex];

  // --------------------------------------------------------------------------
  // SPAWN SWIMMING FISH FOR THE CURRENT CHALLENGE
  // --------------------------------------------------------------------------
  const spawnFishPopulation = useCallback(
    (challenge: FishChallenge) => {
      if (!challenge) return;

      const newFishes: SwimmingFish[] = [];
      const totalCount = 6; // Target + 5 Distractors (Preschool friendly balance)

      // Color selection helper
      const shuffledColors = shuffleArray(ALL_COLORS);

      // 1. Create Target Fish
      let targetColor: FishColor = 'orange';
      let targetLabel: string | undefined = undefined;

      if (challenge.category === 'alphabets') {
        targetLabel = challenge.targetAlphabet!;
        targetColor = shuffledColors[0];
      } else if (challenge.category === 'numbers') {
        targetLabel = `${challenge.targetNumber!}`;
        targetColor = shuffledColors[0];
      } else {
        targetColor = challenge.targetColor!;
        targetLabel = undefined;
      }

      // Random starting direction & mild, gentle speed (preschool-friendly pace)
      const targetDir: 1 | -1 = Math.random() > 0.5 ? 1 : -1;
      const targetSpeed = 0.016 + Math.random() * 0.008; // Mild, calm swim
      const targetY = 20 + Math.random() * 55;

      newFishes.push({
        id: `fish-target-${Date.now()}-${Math.random()}`,
        xPercent: targetDir === 1 ? 10 + Math.random() * 15 : 75 - Math.random() * 15,
        yPercent: targetY,
        vx: targetDir * targetSpeed,
        baseYPercent: targetY,
        swayAmp: 2.5 + Math.random() * 2,
        swayFreq: 0.0012 + Math.random() * 0.0005,
        swayPhase: Math.random() * Math.PI * 2,
        direction: targetDir,
        color: targetColor,
        label: targetLabel,
        isTarget: true,
        sizePx: 120,
        scale: 1,
        opacity: 1,
        wiggleOffset: Math.random() * 100,
      });

      // 2. Create Distractor Fishes
      // Prepare distractor pools
      const distractorLetters = shuffleArray(
        ALPHABET_POOL.filter((l) => l !== challenge.targetAlphabet)
      );
      const distractorNumbers = shuffleArray(
        NUMBER_POOL.filter((n) => n !== challenge.targetNumber)
      );
      const distractorColors = shuffleArray(
        ALL_COLORS.filter((c) => c !== challenge.targetColor)
      );

      for (let i = 0; i < totalCount - 1; i++) {
        let dColor: FishColor = 'blue';
        let dLabel: string | undefined = undefined;

        if (challenge.category === 'alphabets') {
          dLabel = distractorLetters[i % distractorLetters.length];
          dColor = shuffledColors[(i + 1) % shuffledColors.length];
        } else if (challenge.category === 'numbers') {
          dLabel = `${distractorNumbers[i % distractorNumbers.length]}`;
          dColor = shuffledColors[(i + 1) % shuffledColors.length];
        } else {
          dColor = distractorColors[i % distractorColors.length];
          dLabel = undefined;
        }

        const dDir: 1 | -1 = Math.random() > 0.5 ? 1 : -1;
        const dSpeed = 0.014 + Math.random() * 0.008; // Mild, calm distractor swim
        const dY = 15 + Math.random() * 65;

        // Distribute starting positions nicely across screen
        const startX = (15 + (i * 70) / (totalCount - 1) + Math.random() * 8) % 85;

        newFishes.push({
          id: `fish-distractor-${i}-${Date.now()}-${Math.random()}`,
          xPercent: Math.max(5, Math.min(85, startX)),
          yPercent: dY,
          vx: dDir * dSpeed,
          baseYPercent: dY,
          swayAmp: 2.2 + Math.random() * 2,
          swayFreq: 0.0011 + Math.random() * 0.0006,
          swayPhase: Math.random() * Math.PI * 2,
          direction: dDir,
          color: dColor,
          label: dLabel,
          isTarget: false,
          sizePx: 110 + (Math.random() * 15 - 7),
          scale: 1,
          opacity: 1,
          wiggleOffset: Math.random() * 100,
        });
      }

      setFishes(newFishes);
    },
    []
  );

  // --------------------------------------------------------------------------
  // INITIALIZE AMBIENT WATER BUBBLES
  // --------------------------------------------------------------------------
  useEffect(() => {
    const bubbles: AmbientBubble[] = [];
    for (let i = 0; i < 18; i++) {
      bubbles.push({
        id: `bubble-${i}`,
        xPercent: Math.random() * 95,
        yPercent: Math.random() * 100,
        speed: 0.03 + Math.random() * 0.04,
        size: 8 + Math.random() * 16,
        wobbleSpeed: 0.002 + Math.random() * 0.002,
        wobbleAmp: 1.5 + Math.random() * 2,
        phase: Math.random() * Math.PI * 2,
        opacity: 0.35 + Math.random() * 0.45,
      });
    }
    setAmbientBubbles(bubbles);
  }, []);

  // --------------------------------------------------------------------------
  // INITIAL GAME START / REPLAY SHUFFLE INITIALIZER
  // --------------------------------------------------------------------------
  const startFreshGame = useCallback(() => {
    clearAllTimers();
    soundManager.stopSpeech();
    isTransitioningRef.current = false;

    // LEVEL 1: Shuffle Category Order
    const newCatOrder = shuffleArray<FishLearningCategory>([
      'alphabets',
      'numbers',
      'colors',
    ]);
    setCategoryOrder(newCatOrder);
    setCategoryIndex(0);

    // LEVEL 2: Build fresh challenges for round 1 category
    const initialChallenges = buildChallengesForCategory(newCatOrder[0]);
    setCategoryChallenges(initialChallenges);
    setChallengeIndex(0);

    setActivityState('intro');
    setPopFeedback(null);
    setSparkles([]);

    // Voice announcement & start sequence
    const t1 = setTimeout(() => {
      soundManager.speak(
        'Fish Hunting Fun! Hunt only the requested fish!'
      );
    }, 600);

    const t2 = setTimeout(() => {
      setActivityState('playing');
      const firstChallenge = initialChallenges[0];
      if (firstChallenge) {
        spawnFishPopulation(firstChallenge);
        soundManager.speak(firstChallenge.voiceInstruction);
      }
    }, 3800);

    timersRef.current.push(t1, t2);
  }, [buildChallengesForCategory, clearAllTimers, spawnFishPopulation]);

  // Mount effect: Start background music & fresh game
  useEffect(() => {
    soundManager.startBackgroundMusic();
    startFreshGame();

    return () => {
      clearAllTimers();
      soundManager.stopSpeech();
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [clearAllTimers, startFreshGame]);

  // --------------------------------------------------------------------------
  // REPEAT INSTRUCTION VOICE BUTTON ("Listen" header control)
  // --------------------------------------------------------------------------
  const handleReplayInstruction = useCallback(() => {
    if (currentChallenge) {
      soundManager.speak(currentChallenge.voiceInstruction);
    }
  }, [currentChallenge]);

  // --------------------------------------------------------------------------
  // PHYSICS ANIMATION LOOP: Continuous Natural Swimming & Bubbles
  // --------------------------------------------------------------------------
  useEffect(() => {
    const updatePhysics = (now: number) => {
      const delta = Math.min(40, now - lastTimeRef.current);
      lastTimeRef.current = now;

      // 1. Update Fish Movement
      setFishes((prevFishes) =>
        prevFishes.map((fish) => {
          if (fish.isPopping) return fish;

          let newX = fish.xPercent + fish.vx * delta;
          let newDirection = fish.direction;
          let newVx = fish.vx;

          // Boundary turn-around with smooth turn buffer
          if (newX > 88 && fish.vx > 0) {
            newVx = -Math.abs(fish.vx);
            newDirection = -1;
          } else if (newX < 4 && fish.vx < 0) {
            newVx = Math.abs(fish.vx);
            newDirection = 1;
          }

          // Gentle vertical sinusoidal swimming sway
          const sway =
            Math.sin(now * fish.swayFreq + fish.swayPhase) * fish.swayAmp;
          const newY = Math.max(10, Math.min(80, fish.baseYPercent + sway));

          return {
            ...fish,
            xPercent: newX,
            yPercent: newY,
            vx: newVx,
            direction: newDirection,
          };
        })
      );

      // 2. Update Ambient Bubbles Floating Upwards
      setAmbientBubbles((prevBubbles) =>
        prevBubbles.map((bubble) => {
          let newY = bubble.yPercent - bubble.speed * (delta / 16);
          let newX =
            bubble.xPercent +
            Math.sin(now * bubble.wobbleSpeed + bubble.phase) *
              (bubble.wobbleAmp / 100);

          if (newY < -5) {
            newY = 105;
            newX = Math.random() * 95;
          }

          return {
            ...bubble,
            xPercent: newX,
            yPercent: newY,
          };
        })
      );

      // 3. Update Sparkle Particle Physics
      setSparkles((prevSparkles) =>
        prevSparkles
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.12, // subtle gravity
            opacity: p.opacity - 0.025,
          }))
          .filter((p) => p.opacity > 0)
      );

      animFrameRef.current = requestAnimationFrame(updatePhysics);
    };

    animFrameRef.current = requestAnimationFrame(updatePhysics);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  // --------------------------------------------------------------------------
  // SPAWN SPARKLE PARTICLES AT TAP POINT
  // --------------------------------------------------------------------------
  const triggerSparklesAt = (clickX: number, clickY: number) => {
    const newSparkles: SparkleFX[] = [];
    const colors = ['#FDE047', '#67E8F9', '#F472B6', '#4ADE80', '#FFFFFF'];

    for (let i = 0; i < 14; i++) {
      const angle = (Math.PI * 2 * i) / 14 + (Math.random() - 0.5) * 0.4;
      const speed = 2.5 + Math.random() * 4.5;
      newSparkles.push({
        id: `sparkle-${Date.now()}-${i}-${Math.random()}`,
        x: clickX,
        y: clickY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5,
        size: 8 + Math.random() * 10,
        color: colors[i % colors.length],
        opacity: 1,
        shape: i % 2 === 0 ? 'star' : 'circle',
      });
    }

    setSparkles((prev) => [...prev, ...newSparkles]);
  };

  // --------------------------------------------------------------------------
  // ADVANCE TO NEXT TARGET / CATEGORY / COMPLETION
  // --------------------------------------------------------------------------
  const advanceToNext = useCallback(() => {
    const nextChallengeIdx = challengeIndex + 1;

    // Check if more challenges remain in current category
    if (nextChallengeIdx < categoryChallenges.length) {
      setChallengeIndex(nextChallengeIdx);
      const nextChallenge = categoryChallenges[nextChallengeIdx];
      spawnFishPopulation(nextChallenge);
      soundManager.speak(nextChallenge.voiceInstruction);
      isTransitioningRef.current = false;
      return;
    }

    // Current category completed! Check if more categories remain
    const nextCategoryIdx = categoryIndex + 1;
    if (nextCategoryIdx < categoryOrder.length) {
      // Category Transition! Automatic progression
      setActivityState('category_transition');
      const nextCat = categoryOrder[nextCategoryIdx];
      const newChallenges = buildChallengesForCategory(nextCat);

      const t1 = setTimeout(() => {
        setCategoryIndex(nextCategoryIdx);
        setCategoryChallenges(newChallenges);
        setChallengeIndex(0);
        setActivityState('playing');

        const firstChall = newChallenges[0];
        spawnFishPopulation(firstChall);
        soundManager.speak(firstChall.voiceInstruction);
        isTransitioningRef.current = false;
      }, 2200);

      timersRef.current.push(t1);
      return;
    }

    // ALL 3 CATEGORIES (ALPHABETS, NUMBERS, COLORS) ARE COMPLETED!
    if (onCollectStar) {
      onCollectStar();
    }
    setActivityState('all_done');
    soundManager.playCelebration();
    soundManager.speak('Great job! You hunted all the fish!');
    isTransitioningRef.current = false;
  }, [
    buildChallengesForCategory,
    categoryChallenges,
    categoryIndex,
    categoryOrder,
    challengeIndex,
    onCollectStar,
    spawnFishPopulation,
  ]);

  // --------------------------------------------------------------------------
  // FISH TAP HANDLER (CHILD INTERACTION)
  // --------------------------------------------------------------------------
  const handleFishTap = (
    e: React.MouseEvent | React.TouchEvent,
    fish: SwimmingFish
  ) => {
    if (activityState !== 'playing' || isTransitioningRef.current) return;

    // Get tap coordinate
    const rect = arenaRef.current?.getBoundingClientRect();
    let clickX = 200;
    let clickY = 200;

    if ('touches' in e && e.touches.length > 0) {
      clickX = e.touches[0].clientX;
      clickY = e.touches[0].clientY;
    } else if ('clientX' in e) {
      clickX = (e as React.MouseEvent).clientX;
      clickY = (e as React.MouseEvent).clientY;
    }

    if (rect) {
      clickX = Math.max(20, Math.min(rect.width - 20, clickX - rect.left));
      clickY = Math.max(20, Math.min(rect.height - 20, clickY - rect.top));
    }

    // CASE 1: WRONG FISH TAPPED -> Friendly encouraging hint, do NOT penalize or remove
    if (!fish.isTarget) {
      soundManager.playPop();
      if (currentChallenge) {
        soundManager.speak(currentChallenge.audioHint);
      }
      return;
    }

    // CASE 2: CORRECT FISH TAPPED!
    isTransitioningRef.current = true;

    // Pop sound & sparkles
    soundManager.playSuccess();
    triggerSparklesAt(clickX, clickY);

    // Voice praise: "Great job!"
    soundManager.speak('Great job!');

    // Show floating pop feedback badge
    setPopFeedback({
      text: 'Great Job! ✨',
      x: clickX,
      y: Math.max(80, clickY - 40),
      color: FISH_COLOR_PALETTE[fish.color].badgeBg,
    });

    setTimeout(() => {
      setPopFeedback(null);
    }, 1200);

    // Mark fish as popping
    setFishes((prev) =>
      prev.map((f) => (f.id === fish.id ? { ...f, isPopping: true } : f))
    );

    // Fade and remove collected fish
    setTimeout(() => {
      setFishes((prev) => prev.filter((f) => f.id !== fish.id));
    }, 450);

    // Automatically transition to next target / category
    const tAdvance = setTimeout(() => {
      advanceToNext();
    }, 1400);

    timersRef.current.push(tAdvance);
  };

  // --------------------------------------------------------------------------
  // STEP BACK NAVIGATION HELPER
  // --------------------------------------------------------------------------
  const handleStepBack = () => {
    if (challengeIndex > 0) {
      const prevIdx = challengeIndex - 1;
      setChallengeIndex(prevIdx);
      const prevChall = categoryChallenges[prevIdx];
      spawnFishPopulation(prevChall);
      soundManager.speak(prevChall.voiceInstruction);
    } else if (categoryIndex > 0) {
      const prevCatIdx = categoryIndex - 1;
      const prevCat = categoryOrder[prevCatIdx];
      const prevChallenges = buildChallengesForCategory(prevCat);
      setCategoryIndex(prevCatIdx);
      setCategoryChallenges(prevChallenges);
      setChallengeIndex(prevChallenges.length - 1);
      const lastChall = prevChallenges[prevChallenges.length - 1];
      spawnFishPopulation(lastChall);
      soundManager.speak(lastChall.voiceInstruction);
    } else if (onNavigatePrev) {
      onNavigatePrev();
    } else {
      onNavigateHome();
    }
  };

  // Category Title Helper for clean header badge
  const categoryTitle =
    currentCategory === 'alphabets'
      ? 'Alphabet Round'
      : currentCategory === 'numbers'
      ? 'Number Round'
      : 'Color Round';

  return (
    <div
      id="fish-hunting-activity"
      className="relative w-full min-h-[calc(100vh-80px)] flex flex-col justify-between overflow-hidden select-none bg-gradient-to-b from-[#38BDF8] via-[#0284C7] to-[#0369A1]"
    >
      {/* ===================================================================== */}
      {/* 2D UNDERWATER OCEAN CANVAS WITH DEPTH & AMBIENT PLANTS                */}
      {/* ===================================================================== */}
      {/* Background Soft Sun Rays */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/35 via-sky-300/10 to-transparent pointer-events-none -z-10" />

      {/* Sea Floor Sandy Bed */}
      <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-[#D97706]/70 via-[#F59E0B]/40 to-transparent pointer-events-none -z-10" />

      {/* Underwater Coral & Sea Plants (Left & Right) */}
      <div className="absolute bottom-1 left-2 pointer-events-none -z-10 opacity-80 flex items-end gap-1">
        <span className="text-4xl sm:text-6xl animate-pulse">🌿</span>
        <span className="text-3xl sm:text-5xl -ml-3">🪸</span>
        <span className="text-2xl sm:text-4xl -ml-2 text-emerald-400">🌱</span>
      </div>

      <div className="absolute bottom-1 right-2 pointer-events-none -z-10 opacity-80 flex items-end gap-1">
        <span className="text-3xl sm:text-5xl text-emerald-300">🌱</span>
        <span className="text-4xl sm:text-6xl -ml-2">🪸</span>
        <span className="text-3xl sm:text-5xl -ml-3 animate-pulse">🌿</span>
      </div>

      {/* Gentle Floating Ambient Bubbles */}
      {ambientBubbles.map((b) => (
        <div
          key={b.id}
          className="absolute rounded-full bg-white/40 border border-white/70 shadow-xs pointer-events-none"
          style={{
            left: `${b.xPercent}%`,
            top: `${b.yPercent}%`,
            width: `${b.size}px`,
            height: `${b.size}px`,
            opacity: b.opacity,
          }}
        />
      ))}

      {/* ===================================================================== */}
      {/* TOP HEADER: MINIMAL & CLEAN (NO LARGE UI BARS)                        */}
      {/* ===================================================================== */}
      <header className="w-full max-w-5xl mx-auto px-4 pt-3 z-30 shrink-0 flex items-center justify-between gap-2">
        {/* Left: Round Pill & Category */}
        <div className="flex items-center gap-2">
          <div className="bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border-2 border-sky-200 shadow-md flex items-center gap-2">
            <span className="text-xl">🐠</span>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-sky-800 uppercase tracking-widest leading-none">
                ROUND {categoryIndex + 1} OF 3
              </span>
              <span className="text-xs sm:text-sm font-black text-slate-900 leading-tight">
                {categoryTitle}
              </span>
            </div>
          </div>
        </div>

        {/* Center: Audio Replay Button ("Listen" to the instruction again) */}
        <button
          type="button"
          onClick={handleReplayInstruction}
          className="flex items-center gap-2 bg-white/95 hover:bg-sky-100 active:scale-95 text-sky-950 font-black px-4 py-2 rounded-2xl border-2 border-sky-300 shadow-md text-xs sm:text-sm cursor-pointer transition-all"
          aria-label="Replay voice instruction"
          title="Hear instruction voice again"
        >
          <Volume2 className="w-4 h-4 text-sky-700 animate-pulse" />
          <span>Listen</span>
        </button>

        {/* Right: Quick Shuffle & Progress Star */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={startFreshGame}
            className="flex items-center gap-1.5 bg-white/95 hover:bg-sky-100 active:scale-95 text-sky-900 font-black px-3.5 py-2 rounded-2xl border-2 border-sky-200 shadow-md text-xs cursor-pointer transition-all"
            aria-label="Shuffle & Play Fresh Game"
            title="Start fresh game"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Shuffle</span>
          </button>

          <div className="w-10 h-10 rounded-2xl bg-amber-400 border-2 border-amber-300 flex items-center justify-center shadow-md">
            <Star
              className={`w-5 h-5 ${
                isActivityCompleted
                  ? 'text-amber-950 fill-amber-300'
                  : 'text-amber-950 fill-amber-200'
              }`}
            />
          </div>
        </div>
      </header>

      {/* ===================================================================== */}
      {/* MAIN PLAY AREA: EXPANSIVE IMMERSIVE UNDERWATER ARENA                  */}
      {/* NO LARGE UI BARS - FULL FOCUS ON MOVING FISH                          */}
      {/* ===================================================================== */}
      <main
        ref={arenaRef}
        className="w-full flex-1 relative px-2 overflow-hidden flex items-center justify-center z-10 min-h-[380px]"
      >
        {/* SWIMMING FISH LAYER */}
        <AnimatePresence>
          {activityState === 'playing' &&
            fishes.map((fish) => (
              <motion.div
                key={fish.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: fish.isPopping ? 1.3 : fish.scale,
                  opacity: fish.isPopping ? 0 : fish.opacity,
                }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute cursor-pointer touch-manipulation z-20"
                style={{
                  left: `${fish.xPercent}%`,
                  top: `${fish.yPercent}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                onClick={(e) => handleFishTap(e, fish)}
                onTouchStart={(e) => handleFishTap(e, fish)}
              >
                <CuteFishSVG
                  color={fish.color}
                  direction={fish.direction}
                  label={fish.label}
                  size={fish.sizePx}
                  isTarget={fish.isTarget}
                  isPopping={fish.isPopping}
                />
              </motion.div>
            ))}
        </AnimatePresence>

        {/* POP FEEDBACK BADGE ("Great Job! ✨" - compact floating chip) */}
        <AnimatePresence>
          {popFeedback && (
            <motion.div
              key="pop-feedback-badge"
              initial={{ scale: 0.6, opacity: 0, y: 5 }}
              animate={{ scale: 1, opacity: 1, y: -20 }}
              exit={{ scale: 1.1, opacity: 0, y: -35 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="absolute pointer-events-none z-50 flex items-center justify-center"
              style={{
                left: popFeedback.x,
                top: popFeedback.y,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div className="bg-white/95 backdrop-blur-xs text-amber-900 font-extrabold text-sm sm:text-base px-3.5 py-1.5 rounded-full border-2 border-amber-300 shadow-md flex items-center gap-1.5">
                <span>{popFeedback.text}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SPARKLE PARTICLES LAYER */}
        <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden">
          {sparkles.map((p) => (
            <div
              key={p.id}
              className="absolute rounded-full flex items-center justify-center pointer-events-none"
              style={{
                left: p.x,
                top: p.y,
                width: p.size,
                height: p.size,
                backgroundColor: p.color,
                opacity: p.opacity,
                boxShadow: `0 0 10px ${p.color}`,
              }}
            >
              {p.shape === 'star' && (
                <Sparkles className="w-full h-full text-white fill-white" />
              )}
            </div>
          ))}
        </div>

        {/* OVERLAYS & STATE MODALS (COMPACT & CLEAN) */}
        <AnimatePresence>
          {/* 1. INTRO SPLASH */}
          {activityState === 'intro' && (
            <motion.div
              key="fish-intro-splash"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 border-2 border-sky-300 shadow-lg text-center max-w-xs mx-4 z-50 flex flex-col items-center"
            >
              <div className="w-12 h-12 rounded-full bg-sky-100 border-2 border-sky-300 flex items-center justify-center text-2xl mb-1.5 shadow-inner">
                🐠
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-sky-950 uppercase tracking-tight">
                Fish Hunting!
              </h2>
              <p className="text-xs sm:text-sm font-extrabold text-sky-800 mt-1">
                Listen carefully and hunt the requested fish!
              </p>
            </motion.div>
          )}

          {/* 2. CATEGORY TRANSITION MODAL ("Great Job!") */}
          {activityState === 'category_transition' && (
            <motion.div
              key="cat-transition-splash"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 border-2 border-emerald-300 shadow-lg text-center max-w-xs mx-4 z-50 flex flex-col items-center"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-100 border-2 border-emerald-300 flex items-center justify-center text-2xl mb-1.5 shadow-inner animate-bounce">
                🎉
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-emerald-950 tracking-tight">
                Great Job!
              </h3>
              <p className="text-xs sm:text-sm font-extrabold text-emerald-800 mt-1">
                Get ready for the next challenge!
              </p>
            </motion.div>
          )}

          {/* 3. ALL DONE CELEBRATION (REPLAY BUTTON ONLY - COMPACT & CLEAN) */}
          {activityState === 'all_done' && (
            <motion.div
              key="fish-all-done"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white/95 backdrop-blur-md rounded-2xl p-5 sm:p-6 border-2 border-amber-400 shadow-xl text-center max-w-xs mx-4 z-50 flex flex-col items-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-amber-600 mb-1.5 shadow-inner">
                <Trophy className="w-7 h-7 stroke-[2.5]" />
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-amber-950 tracking-tight uppercase">
                Great Job!
              </h2>
              <p className="text-xs sm:text-sm font-bold text-amber-800 mt-1">
                You hunted all the fish! Fantastic job!
              </p>

              <div className="flex items-center justify-center gap-2 my-2.5">
                <span className="text-2xl animate-bounce">🐠</span>
                <span className="text-2xl animate-bounce delay-100">🐡</span>
                <span className="text-2xl animate-bounce delay-200">🐟</span>
              </div>

              {/* REPLAY BUTTON */}
              <button
                type="button"
                onClick={startFreshGame}
                className="w-full flex items-center justify-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-black px-5 py-2.5 rounded-xl border-b-3 border-emerald-700 shadow-md text-sm cursor-pointer transition-all mt-1"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Replay</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ===================================================================== */}
      {/* BOTTOM: CLEAN 3-BUTTON NAV (NO LARGE GOAL BAR)                        */}
      {/* ===================================================================== */}
      <footer className="w-full max-w-4xl mx-auto px-4 pb-3 z-30 shrink-0 flex flex-col items-center">
        {/* Global Standard 3-Button Bottom Navigation (PREV, HOME, NEXT) */}
        <ActivityBottomNav
          onNavigatePrev={handleStepBack}
          onNavigateHome={onNavigateHome}
          onNavigateNext={onNavigateNext}
        />
      </footer>
    </div>
  );
};
