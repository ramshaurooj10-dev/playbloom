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

export type ShapeType = 'circle' | 'square' | 'triangle';

export type ShapeColor =
  | 'red'
  | 'blue'
  | 'yellow'
  | 'green'
  | 'purple'
  | 'orange'
  | 'pink'
  | 'cyan';

interface ColorDef {
  name: string;
  fill: string;
  gradientTop: string;
  gradientBottom: string;
  border: string;
  shadow: string;
  highlight: string;
}

const COLOR_MAP: Record<ShapeColor, ColorDef> = {
  red: {
    name: 'Red',
    fill: '#EF4444',
    gradientTop: '#F87171',
    gradientBottom: '#DC2626',
    border: '#B91C1C',
    shadow: '#991B1B',
    highlight: '#FECACA',
  },
  blue: {
    name: 'Blue',
    fill: '#3B82F6',
    gradientTop: '#60A5FA',
    gradientBottom: '#2563EB',
    border: '#1D4ED8',
    shadow: '#1E40AF',
    highlight: '#DBEAFE',
  },
  yellow: {
    name: 'Yellow',
    fill: '#FBBF24',
    gradientTop: '#FDE047',
    gradientBottom: '#F59E0B',
    border: '#D97706',
    shadow: '#B45309',
    highlight: '#FEF9C3',
  },
  green: {
    name: 'Green',
    fill: '#10B981',
    gradientTop: '#34D399',
    gradientBottom: '#059669',
    border: '#047857',
    shadow: '#065F46',
    highlight: '#D1FAE5',
  },
  purple: {
    name: 'Purple',
    fill: '#A855F7',
    gradientTop: '#C084FC',
    gradientBottom: '#9333EA',
    border: '#7E22CE',
    shadow: '#6B21A8',
    highlight: '#F3E8FF',
  },
  orange: {
    name: 'Orange',
    fill: '#F97316',
    gradientTop: '#FB923C',
    gradientBottom: '#EA580C',
    border: '#C2410C',
    shadow: '#9A3412',
    highlight: '#FFEDD5',
  },
  pink: {
    name: 'Pink',
    fill: '#EC4899',
    gradientTop: '#F472B6',
    gradientBottom: '#DB2777',
    border: '#BE185D',
    shadow: '#9D174D',
    highlight: '#FCE7F3',
  },
  cyan: {
    name: 'Cyan',
    fill: '#06B6D4',
    gradientTop: '#22D3EE',
    gradientBottom: '#0891B2',
    border: '#0E7490',
    shadow: '#155E75',
    highlight: '#CFFAFE',
  },
};

const ALL_SHAPE_COLORS: ShapeColor[] = [
  'red',
  'blue',
  'yellow',
  'green',
  'purple',
  'orange',
  'pink',
  'cyan',
];

interface FallingShapeItem {
  id: string;
  shape: ShapeType;
  color: ShapeColor;
  xPercent: number; // 6 to 88%
  yPercent: number; // -10 to 110%
  baseSpeed: number; // speed per frame
  sizePx: number; // 70 to 92px
  rotation: number;
  wobbleOffset: number;
  wobbleSpeed: number;
  isCollected?: boolean;
  isWrongShaking?: boolean;
  collectedAtX?: number;
  collectedAtY?: number;
}

interface SparkleParticle {
  id: string;
  x: number;
  y: number;
  emoji: string;
  vx: number;
  vy: number;
}

interface RoundDefinition {
  targetShape: ShapeType;
  targetNamePlural: string;
  targetNameSingular: string;
  voiceInstruction: string;
  targetCount: number;
  speedMultiplier: number;
  distractorShapeRatio: number; // probability of distractor vs target
  emoji: string;
}

const DEFAULT_ROUNDS: RoundDefinition[] = [
  {
    targetShape: 'circle',
    targetNamePlural: 'circles',
    targetNameSingular: 'circle',
    voiceInstruction: 'Pick the circles!',
    targetCount: 5,
    speedMultiplier: 0.85,
    distractorShapeRatio: 0.5,
    emoji: '🔴',
  },
  {
    targetShape: 'square',
    targetNamePlural: 'squares',
    targetNameSingular: 'square',
    voiceInstruction: 'Pick the squares!',
    targetCount: 5,
    speedMultiplier: 0.95,
    distractorShapeRatio: 0.55,
    emoji: '🟦',
  },
  {
    targetShape: 'triangle',
    targetNamePlural: 'triangles',
    targetNameSingular: 'triangle',
    voiceInstruction: 'Pick the triangles!',
    targetCount: 5,
    speedMultiplier: 1.0,
    distractorShapeRatio: 0.55,
    emoji: '🔺',
  },
];

interface ShapesCollectorFunProps {
  onCollectStar: () => void;
  onNavigateHome: () => void;
  onNavigateNext: () => void;
  onNavigatePrev: () => void;
  isActivityCompleted?: boolean;
}

/**
 * High-quality 2D Shape Illustration with depth, gloss, highlights, and shadow.
 */
export const ShapeIllustration: React.FC<{
  shape: ShapeType;
  color: ShapeColor;
  size?: number;
  className?: string;
}> = ({ shape, color, size = 80, className = '' }) => {
  const c = COLOR_MAP[color] || COLOR_MAP.red;
  const gradId = `grad-${shape}-${color}-${Math.random().toString(36).substring(2, 6)}`;
  const specId = `spec-${shape}-${color}-${Math.random().toString(36).substring(2, 6)}`;

  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-md overflow-visible"
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={c.gradientTop} />
            <stop offset="50%" stopColor={c.fill} />
            <stop offset="100%" stopColor={c.gradientBottom} />
          </linearGradient>
          <linearGradient id={specId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.75" />
            <stop offset="60%" stopColor="#FFFFFF" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
        </defs>

        {shape === 'circle' && (
          <g>
            {/* Soft contact shadow */}
            <ellipse cx="50" cy="92" rx="36" ry="6" fill="rgba(0,0,0,0.18)" />
            {/* Main Outer Rim */}
            <circle
              cx="50"
              cy="48"
              r="40"
              fill={`url(#${gradId})`}
              stroke={c.border}
              strokeWidth="4"
            />
            {/* 3D Depth Inner Highlight */}
            <ellipse
              cx="38"
              cy="34"
              rx="22"
              ry="14"
              transform="rotate(-25 38 34)"
              fill={`url(#${specId})`}
            />
            {/* Playful glint sparkle */}
            <circle cx="34" cy="28" r="4.5" fill="#FFFFFF" opacity="0.9" />
            <circle cx="43" cy="24" r="2.5" fill="#FFFFFF" opacity="0.7" />
          </g>
        )}

        {shape === 'square' && (
          <g>
            {/* Soft contact shadow */}
            <ellipse cx="50" cy="92" rx="38" ry="6" fill="rgba(0,0,0,0.18)" />
            {/* Main Rounded Box */}
            <rect
              x="12"
              y="10"
              width="76"
              height="76"
              rx="18"
              fill={`url(#${gradId})`}
              stroke={c.border}
              strokeWidth="4"
            />
            {/* Top Bevel Glint */}
            <path
              d="M 22 18 Q 50 14 78 18 Q 74 38 50 36 Q 26 38 22 18 Z"
              fill={`url(#${specId})`}
            />
            {/* Specular dots */}
            <circle cx="28" cy="24" r="4.5" fill="#FFFFFF" opacity="0.9" />
            <circle cx="38" cy="22" r="2.5" fill="#FFFFFF" opacity="0.7" />
          </g>
        )}

        {shape === 'triangle' && (
          <g>
            {/* Soft contact shadow */}
            <ellipse cx="50" cy="92" rx="38" ry="6" fill="rgba(0,0,0,0.18)" />
            {/* Triangle with Rounded Corners */}
            <path
              d="M 50 10 
                 L 86 76 
                 Q 90 84 80 84 
                 L 20 84 
                 Q 10 84 14 76 
                 Z"
              fill={`url(#${gradId})`}
              stroke={c.border}
              strokeWidth="4"
              strokeLinejoin="round"
            />
            {/* Specular Highlight Path */}
            <path
              d="M 50 20 L 72 70 Q 50 64 28 70 Z"
              fill={`url(#${specId})`}
            />
            {/* Sparkle glint */}
            <circle cx="48" cy="28" r="4" fill="#FFFFFF" opacity="0.9" />
            <circle cx="44" cy="38" r="2.5" fill="#FFFFFF" opacity="0.7" />
          </g>
        )}
      </svg>
    </div>
  );
};

export const ShapesCollectorFun: React.FC<ShapesCollectorFunProps> = ({
  onCollectStar,
  onNavigateHome,
  onNavigateNext,
  onNavigatePrev,
  isActivityCompleted = false,
}) => {
  // Game Rounds
  const [rounds, setRounds] = useState<RoundDefinition[]>(DEFAULT_ROUNDS);
  const [currentRoundIdx, setCurrentRoundIdx] = useState<number>(0);
  const [collectedCount, setCollectedCount] = useState<number>(0);

  // Activity Status: 'intro' | 'playing' | 'round_complete' | 'all_done'
  const [activityState, setActivityState] = useState<
    'intro' | 'playing' | 'round_complete' | 'all_done'
  >('intro');

  // Floating Count Display (e.g. 1, 2, 3, 4...)
  const [activeCountEffect, setActiveCountEffect] = useState<{
    number: number;
    x: number;
    y: number;
  } | null>(null);

  // Falling Items State
  const [fallingItems, setFallingItems] = useState<FallingShapeItem[]>([]);
  const [sparkles, setSparkles] = useState<SparkleParticle[]>([]);
  const [hasAwardedStar, setHasAwardedStar] = useState<boolean>(isActivityCompleted);

  // Gentle voice feedback throttling to prevent voice collisions
  const isSpeakingFeedbackRef = useRef<boolean>(false);
  const lastSpawnTimeRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);
  const timersRef = useRef<NodeJS.Timeout[]>([]);

  const currentRound = rounds[currentRoundIdx] || rounds[0];

  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  }, []);

  // Background Music and Initial Opening (Run once on mount)
  useEffect(() => {
    soundManager.startBackgroundMusic();
    clearAllTimers();
    soundManager.stopSpeech();
    setActivityState('intro');
    setCollectedCount(0);
    setFallingItems([]);

    soundManager.speak('Welcome to Shapes Collector Fun!');

    const t1 = setTimeout(() => {
      soundManager.speak("Let's collect some shapes!");
    }, 2400);

    const t2 = setTimeout(() => {
      setActivityState('playing');
      soundManager.speak(rounds[0].voiceInstruction);
    }, 4500);

    timersRef.current.push(t1, t2);

    return () => {
      clearAllTimers();
      soundManager.stopSpeech();
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [clearAllTimers]);

  // =========================================================================
  // 2. SHAPE SPAWNER HELPER
  // Randomizes colors, types, spawn lanes, speeds, sizes
  // =========================================================================
  const spawnNewShape = useCallback(
    (existingItems: FallingShapeItem[]): FallingShapeItem => {
      const allShapes: ShapeType[] = ['circle', 'square', 'triangle'];
      const target = currentRound.targetShape;

      // Determine shape: biased toward target shape so plenty of valid targets appear
      const isTarget = Math.random() > currentRound.distractorShapeRatio;
      let chosenShape: ShapeType = target;
      if (!isTarget) {
        const distractors = allShapes.filter((s) => s !== target);
        chosenShape = distractors[Math.floor(Math.random() * distractors.length)];
      }

      // Random color from rich palette (COLOR DOES NOT MATTER FOR CORRECTNESS)
      const chosenColor =
        ALL_SHAPE_COLORS[Math.floor(Math.random() * ALL_SHAPE_COLORS.length)];

      // Generate a horizontal position avoiding close crowding
      // Divides play area into 6 lanes with jitter
      const lane = Math.floor(Math.random() * 6);
      const baseLanePercent = 10 + lane * 14;
      const jitter = (Math.random() - 0.5) * 8;
      const xPercent = Math.max(8, Math.min(84, baseLanePercent + jitter));

      // Speed with round multiplier
      const baseSpeed =
        (0.24 + Math.random() * 0.16) * currentRound.speedMultiplier;
      const sizePx = 76 + Math.floor(Math.random() * 14); // 76px to 90px

      return {
        id: `shape-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        shape: chosenShape,
        color: chosenColor,
        xPercent,
        yPercent: -12 - Math.random() * 8,
        baseSpeed,
        sizePx,
        rotation: (Math.random() - 0.5) * 16,
        wobbleOffset: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.04 + Math.random() * 0.03,
      };
    },
    [currentRound]
  );

  // =========================================================================
  // 3. MAIN PHYSICS & FALLING ANIMATION LOOP
  // =========================================================================
  useEffect(() => {
    if (activityState !== 'playing') {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      return;
    }

    let lastTime = performance.now();

    const loop = (time: number) => {
      const dt = Math.min(32, time - lastTime); // cap frame delta
      lastTime = time;

      // Continuous spawning check (every ~900ms - 1300ms depending on round)
      const spawnInterval = Math.max(
        750,
        1200 / currentRound.speedMultiplier
      );
      if (time - lastSpawnTimeRef.current > spawnInterval) {
        setFallingItems((prev) => {
          // Limit max items on screen to keep uncluttered and performant
          if (prev.filter((i) => !i.isCollected).length < 7) {
            return [...prev, spawnNewShape(prev)];
          }
          return prev;
        });
        lastSpawnTimeRef.current = time;
      }

      // Update positions of all active shapes
      setFallingItems((prev) =>
        prev
          .map((item) => {
            if (item.isCollected) return item;

            const newY = item.yPercent + item.baseSpeed * (dt / 16);
            const newWobble = item.wobbleOffset + item.wobbleSpeed;
            // Subtle horizontal sway
            const sway = Math.sin(newWobble) * 0.12;

            return {
              ...item,
              yPercent: newY,
              xPercent: Math.max(6, Math.min(86, item.xPercent + sway)),
              wobbleOffset: newWobble,
            };
          })
          // Remove shapes that fell far past bottom screen edge (> 112%)
          .filter((item) => item.yPercent < 115)
      );

      // Update sparkle particles
      setSparkles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.15, // gravity
          }))
          .filter((p) => p.y < 700)
      );

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [activityState, currentRound, spawnNewShape]);

  // =========================================================================
  // 4. CLICK / TAP INTERACTION HANDLER
  // =========================================================================
  const handleShapeClick = (clickedItem: FallingShapeItem, e: React.MouseEvent) => {
    if (activityState !== 'playing' || clickedItem.isCollected) return;

    // Check if clicked shape matches target shape (COLOR DOES NOT MATTER)
    if (clickedItem.shape === currentRound.targetShape) {
      // ---------------------------------------------------------------------
      // A. CORRECT SHAPE COLLECTED!
      // ---------------------------------------------------------------------
      soundManager.playPop();

      // Spawn celebration sparkles at click coordinate
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = rect.left + rect.width / 2;
      const clickY = rect.top + rect.height / 2;

      const newSparkles: SparkleParticle[] = Array.from({ length: 6 }).map((_, i) => ({
        id: `sp-${Date.now()}-${i}`,
        x: clickX,
        y: clickY,
        emoji: ['✨', '⭐', '🌟', '💫', '🎉'][i % 5],
        vx: (Math.random() - 0.5) * 6,
        vy: -3 - Math.random() * 4,
      }));
      setSparkles((prev) => [...prev, ...newSparkles]);

      // Mark item as collected with exit animation
      setFallingItems((prev) =>
        prev.map((item) =>
          item.id === clickedItem.id
            ? { ...item, isCollected: true, collectedAtX: clickX, collectedAtY: clickY }
            : item
        )
      );

      // Increment count
      const nextCount = collectedCount + 1;
      setCollectedCount(nextCount);

      // Trigger single number counting audio ("1", "2", "3", "4"...)
      soundManager.speak(`${nextCount}`);

      // Show floating single count badge at tap position
      setActiveCountEffect({
        number: nextCount,
        x: clickX,
        y: Math.max(100, clickY - 40),
      });

      // Clear count effect after animation
      setTimeout(() => {
        setActiveCountEffect((curr) =>
          curr && curr.number === nextCount ? null : curr
        );
      }, 700);

      // Remove collected item from state after smooth pop animation
      setTimeout(() => {
        setFallingItems((prev) => prev.filter((item) => item.id !== clickedItem.id));
      }, 350);

      // Check if target count is reached!
      if (nextCount >= currentRound.targetCount) {
        setTimeout(() => {
          soundManager.playSuccess();
          soundManager.speak('Great job!');
        }, 600);

        // Check if this was the last round
        if (currentRoundIdx < rounds.length - 1) {
          setActivityState('round_complete');

          const nextRoundTimer = setTimeout(() => {
            const nextIdx = currentRoundIdx + 1;
            setCurrentRoundIdx(nextIdx);
            setCollectedCount(0);
            setFallingItems([]);
            setActivityState('playing');

            // Speak next round instruction via audio only
            const nextRoundDef = rounds[nextIdx];
            soundManager.speak(nextRoundDef.voiceInstruction);
          }, 2400);

          timersRef.current.push(nextRoundTimer);
        } else {
          // ALL ROUNDS COMPLETED!
          setActivityState('all_done');
          soundManager.playCelebration();
          soundManager.speak(
            'Wow! You collected all the shapes! You are a shapes champion!'
          );
          if (!hasAwardedStar) {
            setHasAwardedStar(true);
            onCollectStar();
          }
        }
      }
    } else {
      // ---------------------------------------------------------------------
      // B. WRONG SHAPE TAPPED: Gentle feedback, friendly wobble, NO punishment
      // ---------------------------------------------------------------------
      soundManager.playPop();

      // Trigger gentle friendly shake on the tapped shape
      setFallingItems((prev) =>
        prev.map((item) =>
          item.id === clickedItem.id ? { ...item, isWrongShaking: true } : item
        )
      );

      // Reset shake flag after animation
      setTimeout(() => {
        setFallingItems((prev) =>
          prev.map((item) =>
            item.id === clickedItem.id ? { ...item, isWrongShaking: false } : item
          )
        );
      }, 600);

      // Gentle voice feedback if not already speaking
      if (!isSpeakingFeedbackRef.current) {
        isSpeakingFeedbackRef.current = true;
        const tappedShapeName =
          clickedItem.shape === 'circle'
            ? 'a circle'
            : clickedItem.shape === 'square'
            ? 'a square'
            : 'a triangle';

        const targetShapeName = currentRound.targetNameSingular;

        const gentleResponses = [
          `That's ${tappedShapeName}. Find a ${targetShapeName}!`,
          `Try a ${targetShapeName}!`,
          `Look for a ${targetShapeName}!`,
        ];
        const chosenVoice =
          gentleResponses[Math.floor(Math.random() * gentleResponses.length)];
        soundManager.speak(chosenVoice);

        setTimeout(() => {
          isSpeakingFeedbackRef.current = false;
        }, 2200);
      }
    }
  };

  // Replay instruction voice
  const handleReplayInstruction = () => {
    soundManager.speak(currentRound.voiceInstruction);
  };

  // Fresh Game Shuffle
  const handleReplayShuffle = () => {
    clearAllTimers();
    soundManager.stopSpeech();
    soundManager.playPop();

    // Genuine shuffle of rounds order (while ensuring variety)
    const shuffledRounds = [...DEFAULT_ROUNDS].sort(() => Math.random() - 0.5);
    setRounds(shuffledRounds);
    setCurrentRoundIdx(0);
    setCollectedCount(0);
    setFallingItems([]);
    setActivityState('playing');
    soundManager.speak(shuffledRounds[0].voiceInstruction);
  };

  // =========================================================================
  // GLOBAL PREV NAVIGATION RULE: ONE STEP BACK INSIDE THE GAME
  // Round 5 -> Round 4 -> Round 3 -> Round 2 -> Round 1 -> Previous Activity
  // =========================================================================
  const handleStepBack = () => {
    clearAllTimers();
    soundManager.stopSpeech();
    soundManager.playPop();

    if (activityState === 'all_done' || activityState === 'round_complete') {
      setActivityState('playing');
      setCollectedCount(0);
    } else if (currentRoundIdx > 0) {
      const prevIdx = currentRoundIdx - 1;
      setCurrentRoundIdx(prevIdx);
      setCollectedCount(0);
      setFallingItems([]);
      setActivityState('playing');
      soundManager.speak(rounds[prevIdx].voiceInstruction);
    } else if (collectedCount > 0) {
      setCollectedCount(0);
      setFallingItems([]);
      soundManager.speak(currentRound.voiceInstruction);
    } else {
      // Round 0 with score 0: genuine exit to previous activity
      if (onNavigatePrev) {
        onNavigatePrev();
      }
    }
  };

  const isAllComplete =
    activityState === 'all_done' || isActivityCompleted;

  return (
    <div
      id="shapes-collector-fun-activity"
      className="fixed inset-0 w-full h-full bg-gradient-to-b from-[#EFF6FF] via-[#FEF9C3] to-[#FCE7F3] flex flex-col justify-between select-none overflow-hidden"
    >
      {/* ===================================================================== */}
      {/* TOP HEADER: MINIMAL & UNCLUTTERED                                     */}
      {/* ===================================================================== */}
      <header className="w-full max-w-5xl mx-auto pt-3 px-4 flex items-center justify-between z-30 shrink-0">
        {/* Left: Activity Badge */}
        <div className="flex items-center gap-2.5 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border-2 border-amber-300 shadow-md">
          <div className="flex items-center -space-x-1">
            <span className="text-xl">🔴</span>
            <span className="text-xl">🟦</span>
            <span className="text-xl">🔺</span>
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-black text-amber-950 tracking-tight uppercase leading-none">
              Shapes Collector Fun
            </h1>
            <p className="text-[11px] sm:text-xs font-extrabold text-amber-800 leading-tight">
              Round {currentRoundIdx + 1} of {rounds.length}
            </p>
          </div>
        </div>

        {/* Center: Audio Replay Button */}
        <button
          type="button"
          onClick={handleReplayInstruction}
          className="flex items-center gap-2 bg-white/95 hover:bg-amber-100 active:scale-95 text-amber-950 font-black px-4 py-2 rounded-2xl border-2 border-amber-300 shadow-md text-xs sm:text-sm cursor-pointer transition-all"
          aria-label="Replay instruction voice"
          title="Hear instruction voice again"
        >
          <Volume2 className="w-4 h-4 text-amber-700" />
          <span>Listen</span>
        </button>

        {/* Right: Quick Shuffle & Progress Star */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReplayShuffle}
            className="flex items-center gap-1.5 bg-white/95 hover:bg-amber-100 active:scale-95 text-amber-950 font-black px-3 py-2 rounded-2xl border-2 border-amber-300 shadow-md text-xs sm:text-sm cursor-pointer transition-all"
            title="Shuffle game"
          >
            <Shuffle className="w-4 h-4 text-amber-700" />
            <span className="hidden sm:inline">Shuffle</span>
          </button>

          <div className="flex items-center gap-1 bg-amber-100 px-3 py-2 rounded-2xl border-2 border-amber-300 text-amber-950 font-black text-xs sm:text-sm shadow-xs">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>
              {currentRoundIdx + (activityState === 'all_done' ? 1 : 0)}/
              {rounds.length}
            </span>
          </div>
        </div>
      </header>

      {/* ===================================================================== */}
      {/* CENTER: LARGE FALLING SHAPES ARENA                                   */}
      {/* ===================================================================== */}
      <main className="w-full flex-1 relative px-2 overflow-hidden flex items-center justify-center z-10">
        {/* Soft background clouds & sunshine atmosphere */}
        <div className="absolute inset-0 pointer-events-none -z-20 overflow-hidden flex flex-col justify-between">
          <div className="flex justify-between px-8 pt-4 opacity-40 text-4xl">
            <span>☁️</span>
            <span>✨</span>
            <span>☁️</span>
          </div>
          <div className="flex justify-between px-16 pb-4 opacity-30 text-3xl">
            <span>⭐</span>
            <span>🌈</span>
            <span>⭐</span>
          </div>
        </div>

        {/* 1. INTRO BANNER */}
        <AnimatePresence>
          {activityState === 'intro' && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: -20 }}
              className="absolute bg-white/95 backdrop-blur-md rounded-2xl border-2 border-amber-300 p-4 sm:p-5 shadow-lg text-center z-40 max-w-xs mx-4"
            >
              <div className="flex items-center justify-center gap-1.5 text-2xl mb-1.5">
                <span className="animate-bounce">🔴</span>
                <span className="animate-pulse">🟦</span>
                <span className="animate-bounce">🔺</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-amber-950 uppercase tracking-tight">
                Shapes Collector!
              </h2>
              <p className="text-xs sm:text-sm font-extrabold text-amber-800 mt-1">
                Listen carefully and tap the falling shapes!
              </p>
            </motion.div>
          )}

          {/* 2. ROUND COMPLETE BANNER */}
          {activityState === 'round_complete' && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="absolute bg-white/95 backdrop-blur-md rounded-2xl border-2 border-emerald-400 p-4 shadow-lg text-center z-40 max-w-xs mx-4"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-100 border-2 border-emerald-400 flex items-center justify-center text-2xl mx-auto mb-1.5">
                🎉
              </div>
              <h3 className="text-xl font-black text-emerald-950 uppercase tracking-tight">
                Great Job!
              </h3>
              <p className="text-xs font-extrabold text-emerald-800 mt-0.5">
                Get ready for the next round!
              </p>
            </motion.div>
          )}

          {/* 3. ALL DONE CELEBRATION MODAL (COMPACT & CLEAN) */}
          {activityState === 'all_done' && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-xs bg-white/95 rounded-2xl border-2 border-amber-400 p-5 shadow-xl text-center flex flex-col items-center z-40 my-auto mx-4"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 border-2 border-white shadow-md flex items-center justify-center text-2xl mb-2">
                🏆
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-amber-950 uppercase tracking-tight">
                Shapes Champion!
              </h2>
              <p className="text-xs sm:text-sm font-bold text-amber-800 mt-1">
                You collected all the shapes! Fantastic job!
              </p>

              <div className="flex items-center justify-center gap-2.5 my-3">
                <ShapeIllustration shape="circle" color="red" size={38} />
                <ShapeIllustration shape="square" color="blue" size={38} />
                <ShapeIllustration shape="triangle" color="yellow" size={38} />
              </div>

              <button
                type="button"
                onClick={handleReplayShuffle}
                className="w-full flex items-center justify-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-black px-5 py-2.5 rounded-xl border-b-3 border-emerald-700 shadow-md text-sm cursor-pointer transition-all mt-1"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Replay</span>
              </button>
            </motion.div>
          )}

          {/* 4. FLOATING POP COUNT BADGE (Single Counting: 1, 2, 3, 4...) */}
          {activeCountEffect && (
            <motion.div
              key={`count-badge-${activeCountEffect.number}`}
              initial={{ scale: 0.6, opacity: 0, y: 5 }}
              animate={{ scale: 1, opacity: 1, y: -20 }}
              exit={{ scale: 1.15, opacity: 0, y: -35 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="fixed pointer-events-none z-50 flex items-center justify-center"
              style={{
                left: activeCountEffect.x,
                top: activeCountEffect.y,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div className="bg-white/95 backdrop-blur-xs text-amber-950 font-black text-lg sm:text-xl px-3.5 py-1.5 rounded-full border-2 border-amber-400 shadow-md flex items-center gap-1.5">
                <span>{activeCountEffect.number}</span>
                <span className="text-base">✨</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sparkle Particles Layer */}
        {sparkles.map((sp) => (
          <div
            key={sp.id}
            className="fixed pointer-events-none text-2xl z-50 transition-opacity duration-300"
            style={{
              left: sp.x,
              top: sp.y,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {sp.emoji}
          </div>
        ))}

        {/* Dynamic Continuous Falling Shapes */}
        <div className="relative w-full h-full max-w-4xl mx-auto overflow-hidden">
          {fallingItems.map((item) => (
            <div
              key={item.id}
              onClick={(e) => handleShapeClick(item, e)}
              className={`absolute cursor-pointer transform transition-transform duration-75 active:scale-90 hover:scale-105 select-none touch-manipulation ${
                item.isWrongShaking ? 'animate-wiggle' : ''
              } ${item.isCollected ? 'scale-125 opacity-0 duration-300' : ''}`}
              style={{
                left: `${item.xPercent}%`,
                top: `${item.yPercent}%`,
                transform: `translate(-50%, -50%) rotate(${item.rotation}deg)`,
                width: item.sizePx,
                height: item.sizePx,
              }}
            >
              <ShapeIllustration
                shape={item.shape}
                color={item.color}
                size={item.sizePx}
              />
            </div>
          ))}
        </div>
      </main>

      {/* ===================================================================== */}
      {/* BOTTOM: CLEAN 3-BUTTON NAV (NO GOAL BAR)                              */}
      {/* ===================================================================== */}
      <footer className="w-full max-w-4xl mx-auto px-4 pb-3 z-30 shrink-0 flex flex-col items-center">
        {/* Global Standard 3-Button Bottom Navigation (PREV, HOME, NEXT) */}
        <ActivityBottomNav
          onNavigatePrev={handleStepBack}
          onNavigateHome={onNavigateHome}
          onNavigateNext={onNavigateNext}
          isNextUnlocked={isAllComplete}
        />
      </footer>
    </div>
  );
};
