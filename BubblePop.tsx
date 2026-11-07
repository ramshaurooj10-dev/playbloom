import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Volume2, Star as StarIcon, Sparkles, ArrowRight, Check } from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { ActivityBottomNav } from './ActivityBottomNav';
import { BubblePopIcon } from '../common/BubblePopIcon';
import { PremiumCardIllustration } from '../common/PremiumCardIllustration';

interface BubblePopProps {
  onCollectStar: () => void;
  onNavigateHome?: () => void;
  onNavigateNext?: () => void;
  onNavigatePrev?: () => void;
  isActivityCompleted?: boolean;
}

export type ColorType = 'red' | 'blue' | 'yellow' | 'green' | 'purple' | 'pink' | 'orange';

export interface ColorDef {
  id: ColorType;
  name: string;
  voiceName: string;
  bgGradient: string;
  glowColor: string;
  textColor: string;
  badgeBg: string;
}

const COLOR_DEFS: Record<ColorType, ColorDef> = {
  red: {
    id: 'red',
    name: 'Red',
    voiceName: 'red',
    bgGradient: 'from-red-300 via-red-500 to-rose-600',
    glowColor: 'shadow-red-500/50',
    textColor: 'text-red-950',
    badgeBg: 'bg-red-500 text-white border-red-600',
  },
  blue: {
    id: 'blue',
    name: 'Blue',
    voiceName: 'blue',
    bgGradient: 'from-sky-300 via-blue-500 to-indigo-600',
    glowColor: 'shadow-blue-500/50',
    textColor: 'text-blue-950',
    badgeBg: 'bg-blue-500 text-white border-blue-600',
  },
  yellow: {
    id: 'yellow',
    name: 'Yellow',
    voiceName: 'yellow',
    bgGradient: 'from-amber-200 via-yellow-400 to-amber-500',
    glowColor: 'shadow-yellow-400/50',
    textColor: 'text-amber-950',
    badgeBg: 'bg-yellow-400 text-amber-950 border-yellow-500',
  },
  green: {
    id: 'green',
    name: 'Green',
    voiceName: 'green',
    bgGradient: 'from-emerald-200 via-emerald-500 to-green-600',
    glowColor: 'shadow-emerald-500/50',
    textColor: 'text-emerald-950',
    badgeBg: 'bg-emerald-500 text-white border-emerald-600',
  },
  purple: {
    id: 'purple',
    name: 'Purple',
    voiceName: 'purple',
    bgGradient: 'from-purple-200 via-purple-500 to-fuchsia-600',
    glowColor: 'shadow-purple-500/50',
    textColor: 'text-purple-950',
    badgeBg: 'bg-purple-500 text-white border-purple-600',
  },
  pink: {
    id: 'pink',
    name: 'Pink',
    voiceName: 'pink',
    bgGradient: 'from-pink-200 via-pink-400 to-rose-500',
    glowColor: 'shadow-pink-400/50',
    textColor: 'text-pink-950',
    badgeBg: 'bg-pink-400 text-white border-pink-500',
  },
  orange: {
    id: 'orange',
    name: 'Orange',
    voiceName: 'orange',
    bgGradient: 'from-amber-200 via-orange-400 to-orange-600',
    glowColor: 'shadow-orange-400/50',
    textColor: 'text-orange-950',
    badgeBg: 'bg-orange-500 text-white border-orange-600',
  },
};

export type GameMode = 'color' | 'number';

export interface ActiveBubble {
  id: string;
  color: ColorType;
  number?: number;
  x: number; // percentage (0 to 100)
  y: number; // percentage (0 to 100)
  vx: number; // velocity x
  vy: number; // velocity y
  size: number; // size in px
  isPopping: boolean;
  isWobbling: boolean;
}

export interface PopParticle {
  id: string;
  x: number; // in px
  y: number; // in px
  color: string;
  dx: number;
  dy: number;
  size: number;
}

const COLOR_ROUNDS: ColorType[] = ['red', 'blue', 'yellow', 'green', 'purple'];
const NUMBER_ROUNDS: number[] = [3, 5, 2, 7, 4];
const TARGET_POPS_PER_COLOR_ROUND = 3;
const TARGET_POPS_PER_NUMBER_ROUND = 2;

interface SpatialZone {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}

const SCATTER_ZONES: SpatialZone[] = [
  { xMin: 12, xMax: 26, yMin: 12, yMax: 26 }, // Upper-Left
  { xMin: 38, xMax: 62, yMin: 10, yMax: 24 }, // Upper-Middle
  { xMin: 74, xMax: 88, yMin: 12, yMax: 26 }, // Upper-Right
  { xMin: 10, xMax: 24, yMin: 42, yMax: 58 }, // Middle-Left
  { xMin: 38, xMax: 62, yMin: 40, yMax: 56 }, // Center
  { xMin: 76, xMax: 90, yMin: 42, yMax: 58 }, // Middle-Right
  { xMin: 12, xMax: 26, yMin: 72, yMax: 86 }, // Lower-Left
  { xMin: 38, xMax: 62, yMin: 72, yMax: 86 }, // Lower-Middle
  { xMin: 74, xMax: 88, yMin: 72, yMax: 86 }, // Lower-Right
];

export const BubblePop: React.FC<BubblePopProps> = ({
  onCollectStar,
  onNavigateHome,
  onNavigateNext,
  onNavigatePrev,
  isActivityCompleted = false,
}) => {
  // Game Modes & Round state
  const [gameMode, setGameMode] = useState<GameMode>('color');
  const [colorRoundIdx, setColorRoundIdx] = useState<number>(0);
  const [numberRoundIdx, setNumberRoundIdx] = useState<number>(0);

  // Active rounds sequence (can be shuffled on replay)
  const [colorRounds, setColorRounds] = useState<ColorType[]>(COLOR_ROUNDS);
  const [numberRounds, setNumberRounds] = useState<number[]>(NUMBER_ROUNDS);

  // Round stats & counts
  const [currentRoundPops, setCurrentRoundPops] = useState<number>(0);
  const [totalBubblesPopped, setTotalBubblesPopped] = useState<number>(0);

  // Bubbles & Particles
  const [bubbles, setBubbles] = useState<ActiveBubble[]>([]);
  const [particles, setParticles] = useState<PopParticle[]>([]);

  // UI feedback & Celebration states
  const [isRoundSuccess, setIsRoundSuccess] = useState<boolean>(false);
  const [roundSuccessMessage, setRoundSuccessMessage] = useState<string>('');
  const [isAllCompleted, setIsAllCompleted] = useState<boolean>(false);
  const [starAwarded, setStarAwarded] = useState<boolean>(false);

  // Container measurement ref
  const playAreaRef = useRef<HTMLDivElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const lastSpokenRef = useRef<number>(0);

  const currentColorTarget = colorRounds[colorRoundIdx] || 'red';
  const currentNumberTarget = numberRounds[numberRoundIdx] || 5;

  const targetRequiredCount =
    gameMode === 'color' ? TARGET_POPS_PER_COLOR_ROUND : TARGET_POPS_PER_NUMBER_ROUND;

  // Generate initial bubbles list with natural organic 2D scatter across the full play area
  const generateBubbles = useCallback(
    (mode: GameMode, targetColor: ColorType, targetNum: number): ActiveBubble[] => {
      const allColors: ColorType[] = ['red', 'blue', 'yellow', 'green', 'purple', 'pink', 'orange'];
      const totalCount = 7; // 7 generous, non-overlapping bubbles on screen
      const list: ActiveBubble[] = [];

      // Pick random distinct spatial zones from our 9-zone layout
      const shuffledZones = [...SCATTER_ZONES].sort(() => Math.random() - 0.5);

      // Ensure at least 3 matching target items for color, 2 for number
      const targetCount = mode === 'color' ? 3 : 2;

      // Create item types first
      const itemTypes: { isTarget: boolean }[] = [];
      for (let i = 0; i < totalCount; i++) {
        itemTypes.push({ isTarget: i < targetCount });
      }
      // Shuffle target positions so they are in random zones every time
      const shuffledTypes = itemTypes.sort(() => Math.random() - 0.5);

      for (let i = 0; i < totalCount; i++) {
        const zone = shuffledZones[i] || SCATTER_ZONES[i % SCATTER_ZONES.length];

        // Scatter naturally within zone with gentle jitter
        const posX = zone.xMin + Math.random() * (zone.xMax - zone.xMin);
        const posY = zone.yMin + Math.random() * (zone.yMax - zone.yMin);

        let bubbleColor: ColorType;
        let bubbleNumber: number;

        if (shuffledTypes[i].isTarget) {
          if (mode === 'color') {
            bubbleColor = targetColor;
            bubbleNumber = Math.floor(Math.random() * 9) + 1;
          } else {
            bubbleColor = allColors[Math.floor(Math.random() * allColors.length)];
            bubbleNumber = targetNum;
          }
        } else {
          if (mode === 'color') {
            const nonTargetColors = allColors.filter((c) => c !== targetColor);
            bubbleColor = nonTargetColors[Math.floor(Math.random() * nonTargetColors.length)];
            bubbleNumber = Math.floor(Math.random() * 9) + 1;
          } else {
            bubbleColor = allColors[Math.floor(Math.random() * allColors.length)];
            // Non-target numbers between 1 and 9
            const possibleNums = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((n) => n !== targetNum);
            bubbleNumber = possibleNums[Math.floor(Math.random() * possibleNums.length)];
          }
        }

        // Slow, gentle independent velocity & direction
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.022 + Math.random() * 0.022; // very smooth, gentle drift
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;
        const size = Math.floor(Math.random() * 14) + 78; // 78px to 92px

        list.push({
          id: `bubble_${Date.now()}_${i}_${Math.random()}`,
          color: bubbleColor,
          number: bubbleNumber,
          x: Math.max(10, Math.min(90, posX)),
          y: Math.max(10, Math.min(88, posY)),
          vx,
          vy,
          size,
          isPopping: false,
          isWobbling: false,
        });
      }

      return list;
    },
    []
  );

  // Announce the target instruction with voice
  const speakInstruction = useCallback(
    (mode: GameMode, colorTgt: ColorType, numTgt: number) => {
      const now = Date.now();
      if (now - lastSpokenRef.current < 400) return;
      lastSpokenRef.current = now;

      if (mode === 'color') {
        const cName = COLOR_DEFS[colorTgt].voiceName;
        soundManager.speak(`Find the ${cName} bubbles!`);
      } else {
        soundManager.speak(`Find number ${numTgt}!`);
      }
    },
    []
  );

  // Initialize or reset round
  const startRound = useCallback(
    (mode: GameMode, cIdx: number, nIdx: number, customCRounds?: ColorType[], customNRounds?: number[]) => {
      const activeCRounds = customCRounds || colorRounds;
      const activeNRounds = customNRounds || numberRounds;
      const tColor = activeCRounds[cIdx] || 'red';
      const tNum = activeNRounds[nIdx] || 5;

      setCurrentRoundPops(0);
      setIsRoundSuccess(false);
      const newBubbles = generateBubbles(mode, tColor, tNum);
      setBubbles(newBubbles);

      // Speak instruction after brief delay
      setTimeout(() => {
        speakInstruction(mode, tColor, tNum);
      }, 350);
    },
    [colorRounds, numberRounds, generateBubbles, speakInstruction]
  );

  // Initial mount start
  useEffect(() => {
    startRound('color', 0, 0);
  }, []);

  // Main physics loop for gentle, smooth, independent floating & collision-free spacing
  useEffect(() => {
    let lastTime = performance.now();

    const updatePhysics = (currentTime: number) => {
      const dt = Math.min((currentTime - lastTime) / 16.667, 2); // normalize delta time
      lastTime = currentTime;

      if (!isRoundSuccess && !isAllCompleted) {
        setBubbles((prevBubbles) => {
          const updated = prevBubbles.map((bubble) => {
            if (bubble.isPopping) return bubble;

            let nx = bubble.x + bubble.vx * dt;
            let ny = bubble.y + bubble.vy * dt;
            let nvx = bubble.vx;
            let nvy = bubble.vy;

            // Safe area boundaries (percent)
            const minX = 8;
            const maxX = 92;
            const minY = 10;
            const maxY = 88;

            // Soft wall bouncing with gentle damping
            if (nx <= minX) {
              nx = minX;
              nvx = Math.abs(nvx);
            } else if (nx >= maxX) {
              nx = maxX;
              nvx = -Math.abs(nvx);
            }

            if (ny <= minY) {
              ny = minY;
              nvy = Math.abs(nvy);
            } else if (ny >= maxY) {
              ny = maxY;
              nvy = -Math.abs(nvy);
            }

            return {
              ...bubble,
              x: nx,
              y: ny,
              vx: nvx,
              vy: nvy,
            };
          });

          // Soft bubble-to-bubble anti-overlap separation
          for (let i = 0; i < updated.length; i++) {
            if (updated[i].isPopping) continue;
            for (let j = i + 1; j < updated.length; j++) {
              if (updated[j].isPopping) continue;

              const dx = updated[i].x - updated[j].x;
              const dy = updated[i].y - updated[j].y;
              const dist = Math.hypot(dx, dy);
              const minAllowedDist = 18; // safe separation margin

              if (dist < minAllowedDist && dist > 0.01) {
                const push = (minAllowedDist - dist) * 0.02;
                const pushX = (dx / dist) * push;
                const pushY = (dy / dist) * push;

                updated[i].x += pushX;
                updated[i].y += pushY;
                updated[j].x -= pushX;
                updated[j].y -= pushY;
              }
            }
          }

          return updated;
        });
      }

      animFrameRef.current = requestAnimationFrame(updatePhysics);
    };

    animFrameRef.current = requestAnimationFrame(updatePhysics);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isRoundSuccess, isAllCompleted]);

  // Spawn replacement bubble in the least crowded spatial zone
  const spawnSingleBubble = (targetColor: ColorType, targetNum: number, mode: GameMode) => {
    const allColors: ColorType[] = ['red', 'blue', 'yellow', 'green', 'purple', 'pink', 'orange'];
    const isTarget = Math.random() < 0.45; // 45% chance to be target

    let bColor: ColorType;
    let bNum: number;

    if (mode === 'color') {
      if (isTarget) {
        bColor = targetColor;
      } else {
        const nonTargets = allColors.filter((c) => c !== targetColor);
        bColor = nonTargets[Math.floor(Math.random() * nonTargets.length)];
      }
      bNum = Math.floor(Math.random() * 9) + 1;
    } else {
      bColor = allColors[Math.floor(Math.random() * allColors.length)];
      if (isTarget) {
        bNum = targetNum;
      } else {
        const possibleNums = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((n) => n !== targetNum);
        bNum = possibleNums[Math.floor(Math.random() * possibleNums.length)];
      }
    }

    setBubbles((prev) => {
      const active = prev.filter((b) => !b.isPopping);

      // Find the zone with the maximum distance from all active bubbles
      let bestZone = SCATTER_ZONES[0];
      let maxMinDist = -1;

      SCATTER_ZONES.forEach((zone) => {
        const midX = (zone.xMin + zone.xMax) / 2;
        const midY = (zone.yMin + zone.yMax) / 2;

        let minDistToAny = 999;
        active.forEach((b) => {
          const d = Math.hypot(b.x - midX, b.y - midY);
          if (d < minDistToAny) minDistToAny = d;
        });

        if (minDistToAny > maxMinDist) {
          maxMinDist = minDistToAny;
          bestZone = zone;
        }
      });

      const startX = bestZone.xMin + Math.random() * (bestZone.xMax - bestZone.xMin);
      const startY = bestZone.yMin + Math.random() * (bestZone.yMax - bestZone.yMin);
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.022 + Math.random() * 0.022;

      const newB: ActiveBubble = {
        id: `bubble_spawn_${Date.now()}_${Math.random()}`,
        color: bColor,
        number: bNum,
        x: Math.max(10, Math.min(90, startX)),
        y: Math.max(10, Math.min(88, startY)),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.floor(Math.random() * 14) + 78,
        isPopping: false,
        isWobbling: false,
      };

      return [...active, newB];
    });
  };

  // Create burst particles for satisfying pop feedback
  const createPopParticles = (xPercent: number, yPercent: number, colorId: ColorType) => {
    if (!playAreaRef.current) return;
    const rect = playAreaRef.current.getBoundingClientRect();
    const originX = (xPercent / 100) * rect.width;
    const originY = (yPercent / 100) * rect.height;

    const newParticles: PopParticle[] = [];
    const colorHex = COLOR_DEFS[colorId]?.glowColor || 'white';

    for (let i = 0; i < 6; i++) {
      const angle = (i * (Math.PI * 2)) / 6 + (Math.random() * 0.4 - 0.2);
      const dist = 30 + Math.random() * 30;
      newParticles.push({
        id: `part_${Date.now()}_${i}_${Math.random()}`,
        x: originX,
        y: originY,
        color: colorHex,
        dx: Math.cos(angle) * dist,
        dy: Math.sin(angle) * dist,
        size: Math.floor(Math.random() * 8) + 8,
      });
    }

    setParticles((prev) => [...prev, ...newParticles]);

    // Clean up particles after animation
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !newParticles.some((np) => np.id === p.id)));
    }, 450);
  };

  // Handle child tapping a bubble
  const handleBubbleTap = (bubble: ActiveBubble) => {
    if (isRoundSuccess || isAllCompleted || bubble.isPopping) return;

    let isCorrect = false;
    if (gameMode === 'color') {
      isCorrect = bubble.color === currentColorTarget;
    } else {
      isCorrect = bubble.number === currentNumberTarget;
    }

    if (isCorrect) {
      // Play pop sound
      soundManager.playPop();

      // Trigger pop animation
      createPopParticles(bubble.x, bubble.y, bubble.color);

      setBubbles((prev) =>
        prev.map((b) => (b.id === bubble.id ? { ...b, isPopping: true } : b))
      );

      const nextRoundPops = currentRoundPops + 1;
      setCurrentRoundPops(nextRoundPops);
      setTotalBubblesPopped((prev) => prev + 1);

      // Short encouraging voice praise occasionally
      const praises = ['Great job!', 'Pop!', 'Super!', 'Awesome!', 'Nice pop!'];
      const randomPraise = praises[Math.floor(Math.random() * praises.length)];

      // Check if round target is met
      if (nextRoundPops >= targetRequiredCount) {
        // Complete current round
        setIsRoundSuccess(true);
        soundManager.playSuccess();

        if (gameMode === 'color') {
          const colorName = COLOR_DEFS[currentColorTarget].name;
          const msg = `${targetRequiredCount} ${colorName} Bubbles Popped!`;
          setRoundSuccessMessage(msg);
          soundManager.speak(`Great job! ${targetRequiredCount} ${colorName.toLowerCase()} bubbles!`);

          setTimeout(() => {
            if (colorRoundIdx + 1 < colorRounds.length) {
              const nextCIdx = colorRoundIdx + 1;
              setColorRoundIdx(nextCIdx);
              startRound('color', nextCIdx, numberRoundIdx);
            } else {
              // Transition from Color Mode to Number Mode!
              setGameMode('number');
              setColorRoundIdx(0);
              setNumberRoundIdx(0);
              soundManager.speak('Awesome! Now let’s pop NUMBER bubbles!');
              setTimeout(() => {
                startRound('number', 0, 0);
              }, 1200);
            }
          }, 1800);
        } else {
          // In Number Mode
          const numVal = currentNumberTarget;
          const msg = `Found Number ${numVal}!`;
          setRoundSuccessMessage(msg);
          soundManager.speak(`Great job! You found number ${numVal}!`);

          setTimeout(() => {
            if (numberRoundIdx + 1 < numberRounds.length) {
              const nextNIdx = numberRoundIdx + 1;
              setNumberRoundIdx(nextNIdx);
              startRound('number', colorRoundIdx, nextNIdx);
            } else {
              // ALL ROUNDS FINISHED!
              setIsAllCompleted(true);
              soundManager.playCelebration();
              soundManager.speak('AMAZING JOB! You are a Bubble Pop champion!');
              if (!starAwarded) {
                setStarAwarded(true);
                onCollectStar();
              }
            }
          }, 1800);
        }
      } else {
        // Round continuing: speak praise and spawn replacement bubble
        if (nextRoundPops === 1 || Math.random() < 0.4) {
          soundManager.speak(randomPraise);
        }
        setTimeout(() => {
          spawnSingleBubble(currentColorTarget, currentNumberTarget, gameMode);
        }, 400);
      }
    } else {
      // Wrong bubble tapped: gentle wobble, non-scary audio, no penalty
      soundManager.playError();
      soundManager.speak('Try again!');

      setBubbles((prev) =>
        prev.map((b) => (b.id === bubble.id ? { ...b, isWobbling: true } : b))
      );

      setTimeout(() => {
        setBubbles((prev) =>
          prev.map((b) => (b.id === bubble.id ? { ...b, isWobbling: false } : b))
        );
      }, 500);
    }
  };

  // Replay & full shuffle reset
  const handleReplay = () => {
    soundManager.playPop();
    soundManager.stopSpeech();

    // Reshuffle sequences
    const shuffledColors = [...COLOR_ROUNDS].sort(() => Math.random() - 0.5);
    const shuffledNums = [...NUMBER_ROUNDS].sort(() => Math.random() - 0.5);

    setColorRounds(shuffledColors);
    setNumberRounds(shuffledNums);
    setGameMode('color');
    setColorRoundIdx(0);
    setNumberRoundIdx(0);
    setCurrentRoundPops(0);
    setTotalBubblesPopped(0);
    setIsRoundSuccess(false);
    setIsAllCompleted(false);

    startRound('color', 0, 0, shuffledColors, shuffledNums);
  };

  // Calculate current progress display
  const currentStep =
    gameMode === 'color' ? colorRoundIdx + 1 : 5 + numberRoundIdx + 1;
  const totalSteps = 10;

  return (
    <div className="w-full flex flex-col items-center select-none pb-4">
      {/* MAIN GAME CONTAINER CARD */}
      <div className="w-full max-w-4xl bg-gradient-to-b from-sky-100 via-cyan-50 to-blue-100 border-4 sm:border-6 border-sky-400 rounded-3xl sm:rounded-[36px] shadow-2xl p-3.5 sm:p-5 flex flex-col items-center relative overflow-hidden min-h-[580px] sm:min-h-[640px]">
        
        {/* Soft Background Decorative Bubbly Elements */}
        <div className="absolute -top-12 -left-12 w-40 h-40 rounded-full bg-white/40 blur-xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-56 h-56 rounded-full bg-cyan-200/40 blur-2xl pointer-events-none" />
        <div className="absolute top-1/3 left-4 w-12 h-12 rounded-full bg-sky-200/50 blur-md pointer-events-none" />
        <div className="absolute bottom-1/4 right-8 w-16 h-16 rounded-full bg-blue-200/50 blur-md pointer-events-none" />

        {/* TOP CONTROLS & INSTRUCTION BAR */}
        <div className="w-full flex flex-col items-center gap-2.5 z-20">
          {/* Header Row: Title, Mode Pill, Counters, Replay */}
          <div className="w-full flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
            {/* Title & Mode Pill */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-white/90 border-2 border-sky-300 px-3 py-1 rounded-2xl shadow-xs">
                <BubblePopIcon size="xs" />
                <span className="text-base sm:text-lg font-black text-sky-950 uppercase tracking-tight">
                  Bubble Pop
                </span>
              </div>

              {/* Mode Badge */}
              <span
                className={`text-xs sm:text-sm font-black px-2.5 py-1 rounded-xl border-2 shadow-xs uppercase tracking-wide ${
                  gameMode === 'color'
                    ? 'bg-pink-100 text-pink-900 border-pink-300'
                    : 'bg-indigo-100 text-indigo-900 border-indigo-300'
                }`}
              >
                {gameMode === 'color' ? '🎨 Colors' : '🔢 Numbers'}
              </span>
            </div>

            {/* Stats & Replay Button */}
            <div className="flex items-center gap-2">
              {/* Round Progress */}
              <div className="bg-white/90 border-2 border-sky-300 px-2.5 sm:px-3 py-1 rounded-xl shadow-xs text-xs sm:text-sm font-black text-sky-900 flex items-center gap-1">
                <span>Round</span>
                <span className="text-sky-600">
                  {gameMode === 'color' ? colorRoundIdx + 1 : numberRoundIdx + 1}
                </span>
                <span>/</span>
                <span>5</span>
              </div>

              {/* Total Popped Counter */}
              <div className="bg-amber-100 border-2 border-amber-300 px-2.5 sm:px-3 py-1 rounded-xl shadow-xs text-xs sm:text-sm font-black text-amber-950 flex items-center gap-1.5">
                <span>Popped:</span>
                <span className="text-amber-700">{totalBubblesPopped}</span>
                <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-sky-400 via-sky-300 to-sky-200 border border-white shadow-xs relative flex items-center justify-center">
                  <div className="absolute top-0.5 left-0.5 w-1 h-1 rounded-full bg-white/90" />
                </div>
              </div>

              {/* Replay Button */}
              <button
                type="button"
                onClick={handleReplay}
                title="Restart Activity"
                className="w-9 h-9 sm:w-10 sm:h-10 bg-amber-300 hover:bg-amber-400 border-2 border-amber-500 rounded-xl flex items-center justify-center text-amber-950 shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                <RotateCcw className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* MAIN INSTRUCTION BANNER */}
          <div className="w-full bg-white/95 border-3 sm:border-4 border-sky-400 rounded-2xl sm:rounded-3xl p-3 sm:p-3.5 shadow-md flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Speaker Re-hear button */}
              <button
                type="button"
                onClick={() =>
                  speakInstruction(gameMode, currentColorTarget, currentNumberTarget)
                }
                title="Hear Instruction Again"
                className="w-10 h-10 sm:w-12 sm:h-12 bg-sky-500 hover:bg-sky-600 border-b-4 border-sky-700 rounded-2xl flex items-center justify-center text-white shadow-md active:border-b-0 active:translate-y-1 transition-all cursor-pointer shrink-0"
              >
                <Volume2 className="w-6 h-6 stroke-[2.5]" />
              </button>

              {/* Target Prompt Text */}
              <div className="flex flex-col">
                <span className="text-[11px] sm:text-xs font-bold text-sky-600 uppercase tracking-wider">
                  Listening Challenge
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-lg sm:text-2xl font-black text-sky-950 tracking-tight">
                    {gameMode === 'color' ? (
                      <>
                        Find the{' '}
                        <span
                          className={`px-2 py-0.5 rounded-lg text-white border inline-block shadow-xs ${COLOR_DEFS[currentColorTarget].badgeBg}`}
                        >
                          {COLOR_DEFS[currentColorTarget].name.toUpperCase()}
                        </span>{' '}
                        bubbles!
                      </>
                    ) : (
                      <>
                        Find number{' '}
                        <span className="px-2.5 py-0.5 rounded-lg bg-indigo-600 text-white border-2 border-indigo-700 inline-block shadow-xs">
                          {currentNumberTarget}
                        </span>
                        !
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Target Progress Counter (e.g. 2 / 3) */}
            <div className="flex flex-col items-end shrink-0">
              <span className="text-[10px] sm:text-xs font-bold text-sky-600 uppercase">
                Goal
              </span>
              <div className="flex items-center gap-1 bg-sky-100 border border-sky-300 px-2.5 py-1 rounded-xl font-black text-sky-900 text-sm sm:text-base">
                <span className="text-sky-700">{currentRoundPops}</span>
                <span>/</span>
                <span>{targetRequiredCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* BUBBLE PLAY AREA (STAGE) */}
        <div
          ref={playAreaRef}
          className="relative w-full flex-1 my-3 bg-gradient-to-b from-sky-200/40 via-cyan-100/30 to-blue-200/40 rounded-2xl border-2 border-dashed border-sky-300/80 overflow-hidden min-h-[380px] sm:min-h-[420px] select-none"
        >
          {/* Gentle Stage Waves Background */}
          <div className="absolute inset-0 opacity-15 pointer-events-none flex flex-col justify-around">
            <div className="w-full h-12 bg-white rounded-full blur-md" />
            <div className="w-full h-16 bg-white rounded-full blur-lg" />
            <div className="w-full h-12 bg-white rounded-full blur-md" />
          </div>

          {/* ACTIVE BUBBLES */}
          {bubbles.map((bubble) => {
            const colorDef = COLOR_DEFS[bubble.color] || COLOR_DEFS.blue;

            return (
              <div
                key={bubble.id}
                onClick={() => handleBubbleTap(bubble)}
                style={{
                  left: `${bubble.x}%`,
                  top: `${bubble.y}%`,
                  width: `${bubble.size}px`,
                  height: `${bubble.size}px`,
                  transform: 'translate(-50%, -50%)',
                }}
                className={`absolute cursor-pointer select-none transition-transform duration-150 active:scale-90 ${
                  bubble.isWobbling ? 'animate-shake' : ''
                } ${bubble.isPopping ? 'scale-125 opacity-0 transition-all duration-200 pointer-events-none' : ''}`}
              >
                {/* 3D Glossy Bubble Container */}
                <div
                  className={`relative w-full h-full rounded-full bg-gradient-to-tr ${colorDef.bgGradient} ${colorDef.glowColor} border-2 sm:border-3 border-white/80 shadow-lg flex items-center justify-center overflow-hidden`}
                >
                  {/* Top-Left Glossy Highlight Crescent */}
                  <div className="absolute top-1.5 left-2 w-1/3 h-1/3 rounded-full bg-white/85 blur-[0.5px] pointer-events-none" />

                  {/* Tiny secondary sparkle specular highlight */}
                  <div className="absolute top-4 left-5 w-1.5 h-1.5 rounded-full bg-white pointer-events-none" />

                  {/* Bottom-Right Soft Inner Glow */}
                  <div className="absolute bottom-1.5 right-2 w-1/4 h-1/4 rounded-full bg-white/35 blur-[1px] pointer-events-none" />

                  {/* Center Number for Number Mode */}
                  {gameMode === 'number' && bubble.number !== undefined && (
                    <span className="relative z-10 text-3xl sm:text-4xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] select-none">
                      {bubble.number}
                    </span>
                  )}

                  {/* Subtle Shimmer for Color Mode */}
                  {gameMode === 'color' && (
                    <span className="text-xl sm:text-2xl opacity-80 drop-shadow-xs select-none">
                      ✨
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {/* POP BURST PARTICLES */}
          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ x: p.x, y: p.y, opacity: 1, scale: 1 }}
              animate={{
                x: p.x + p.dx,
                y: p.y + p.dy,
                opacity: 0,
                scale: 0.3,
              }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              style={{
                width: `${p.size}px`,
                height: `${p.size}px`,
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-white border border-cyan-300 shadow-sm pointer-events-none z-30"
            />
          ))}

          {/* SINGLE ROUND SUCCESS TOAST OVERLAY */}
          <AnimatePresence>
            {isRoundSuccess && !isAllCompleted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                className="absolute inset-0 z-30 flex items-center justify-center bg-sky-950/20 backdrop-blur-xs p-4 pointer-events-none"
              >
                <div className="bg-white border-4 sm:border-6 border-sky-400 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col items-center text-center animate-bounce">
                  <div className="text-5xl sm:text-6xl mb-1">🎉</div>
                  <h3 className="text-2xl sm:text-3xl font-black text-sky-950 uppercase tracking-wide">
                    Great Job!
                  </h3>
                  <p className="text-base sm:text-lg font-black text-sky-700 mt-1">
                    {roundSuccessMessage}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ALL ROUNDS COMPLETED CELEBRATION MODAL */}
        <AnimatePresence>
          {isAllCompleted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 z-40 flex items-center justify-center bg-white/95 backdrop-blur-sm p-4"
            >
              <div className="bg-gradient-to-b from-sky-50 via-cyan-50 to-blue-50 border-6 sm:border-8 border-sky-400 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col items-center text-center max-w-md w-full">
                {/* Visual Icon matching the main Bubble Pop card */}
                <div className="w-24 h-24 mb-4 rounded-full bg-white border-4 border-sky-300 flex items-center justify-center shadow-lg animate-bounce relative shrink-0">
                  <PremiumCardIllustration id="bubble_pop" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-sky-950 tracking-tight uppercase">
                  BUBBLE POP CHAMPION!
                </h3>
                <p className="text-sm sm:text-base font-bold text-sky-800 mt-2 mb-4">
                  You popped all the colors and numbers! Super listening and tapping!
                </p>

                {/* Star Award Badge */}
                <div className="flex items-center gap-2 bg-amber-200 border-2 border-amber-400 px-4 py-2 rounded-full font-black text-amber-950 text-base mb-6 shadow-sm">
                  <StarIcon className="w-6 h-6 fill-amber-400 text-amber-600" />
                  <span>STAR EARNED!</span>
                </div>

                {/* Action Buttons: Play Again & Next */}
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <button
                    type="button"
                    onClick={handleReplay}
                    className="flex-1 flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-black py-3.5 px-6 rounded-2xl border-b-6 border-sky-700 shadow-lg active:border-b-2 active:translate-y-1 transition-all cursor-pointer text-base uppercase"
                  >
                    <RotateCcw className="w-5 h-5 stroke-[3]" />
                    <span>Play Again</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (onNavigateNext) onNavigateNext();
                      else if (onNavigateHome) onNavigateHome();
                    }}
                    className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-black py-3.5 px-6 rounded-2xl border-b-6 border-emerald-700 shadow-lg active:border-b-2 active:translate-y-1 transition-all cursor-pointer text-base uppercase"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-5 h-5 stroke-[3]" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Standard Bottom Navigation: [ PREV ] [ HOME ] [ NEXT ] */}
      <ActivityBottomNav
        onNavigatePrev={onNavigatePrev}
        onNavigateHome={onNavigateHome}
        onNavigateNext={onNavigateNext}
        isNextUnlocked={isActivityCompleted || isAllCompleted}
      />
    </div>
  );
};
