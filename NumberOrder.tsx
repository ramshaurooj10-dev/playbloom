import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Volume2, Star as StarIcon, Check, Sparkles, ArrowRight } from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { ActivityBottomNav } from './ActivityBottomNav';

interface NumberOrderProps {
  onCollectStar: () => void;
  onNavigateHome?: () => void;
  onNavigateNext?: () => void;
  onNavigatePrev?: () => void;
  isActivityCompleted?: boolean;
}

export interface NumberItem {
  value: number;
  label: string;
  name: string;
  color: string;
  borderColor: string;
  textColor: string;
  shadowColor: string;
  dotCount: number;
}

export interface OrderChallenge {
  id: string;
  sequence: number[]; // Correct ascending order, e.g. [1, 2, 3, 4, 5]
  shuffledNumbers: number[]; // Random starting layout, e.g. [4, 1, 5, 2, 3]
  min: number;
  max: number;
}

// Preset rich styles for numbers 1 to 10
const NUMBER_STYLE_MAP: Record<number, {
  name: string;
  color: string;
  borderColor: string;
  textColor: string;
  shadowColor: string;
  badgeBg: string;
}> = {
  1: {
    name: 'One',
    color: 'bg-teal-500',
    borderColor: 'border-teal-700',
    textColor: 'text-white',
    shadowColor: 'shadow-teal-700/50',
    badgeBg: 'bg-teal-100 text-teal-800',
  },
  2: {
    name: 'Two',
    color: 'bg-amber-500',
    borderColor: 'border-amber-700',
    textColor: 'text-white',
    shadowColor: 'shadow-amber-700/50',
    badgeBg: 'bg-amber-100 text-amber-800',
  },
  3: {
    name: 'Three',
    color: 'bg-purple-500',
    borderColor: 'border-purple-700',
    textColor: 'text-white',
    shadowColor: 'shadow-purple-700/50',
    badgeBg: 'bg-purple-100 text-purple-800',
  },
  4: {
    name: 'Four',
    color: 'bg-emerald-500',
    borderColor: 'border-emerald-700',
    textColor: 'text-white',
    shadowColor: 'shadow-emerald-700/50',
    badgeBg: 'bg-emerald-100 text-emerald-800',
  },
  5: {
    name: 'Five',
    color: 'bg-rose-500',
    borderColor: 'border-rose-700',
    textColor: 'text-white',
    shadowColor: 'shadow-rose-700/50',
    badgeBg: 'bg-rose-100 text-rose-800',
  },
  6: {
    name: 'Six',
    color: 'bg-cyan-500',
    borderColor: 'border-cyan-700',
    textColor: 'text-white',
    shadowColor: 'shadow-cyan-700/50',
    badgeBg: 'bg-cyan-100 text-cyan-800',
  },
  7: {
    name: 'Seven',
    color: 'bg-indigo-500',
    borderColor: 'border-indigo-700',
    textColor: 'text-white',
    shadowColor: 'shadow-indigo-700/50',
    badgeBg: 'bg-indigo-100 text-indigo-800',
  },
  8: {
    name: 'Eight',
    color: 'bg-pink-500',
    borderColor: 'border-pink-700',
    textColor: 'text-white',
    shadowColor: 'shadow-pink-700/50',
    badgeBg: 'bg-pink-100 text-pink-800',
  },
  9: {
    name: 'Nine',
    color: 'bg-lime-500',
    borderColor: 'border-lime-700',
    textColor: 'text-white',
    shadowColor: 'shadow-lime-700/50',
    badgeBg: 'bg-lime-100 text-lime-800',
  },
  10: {
    name: 'Ten',
    color: 'bg-amber-400',
    borderColor: 'border-amber-600',
    textColor: 'text-amber-950',
    shadowColor: 'shadow-amber-600/50',
    badgeBg: 'bg-amber-200 text-amber-900',
  },
};

const GRADIENTS = [
  'from-teal-100 via-sky-50 to-amber-100',
  'from-sky-100 via-teal-50 to-lime-100',
  'from-emerald-100 via-amber-50 to-cyan-100',
  'from-amber-100 via-rose-50 to-teal-100',
  'from-purple-100 via-indigo-50 to-emerald-100',
  'from-rose-100 via-amber-50 to-sky-100',
];

// Fisher-Yates array shuffle with guaranteed non-ordered starting layout
function shuffleNonSorted(array: number[]): number[] {
  if (array.length <= 1) return [...array];
  let shuffled = [...array];
  let attempts = 0;
  
  while (attempts < 15) {
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    // Check if it matches ascending order exactly
    const isAlreadySorted = shuffled.every((val, idx) => val === array[idx]);
    if (!isAlreadySorted) break;
    attempts++;
  }

  // Guarantee at least one element is swapped if shuffle landed sorted
  if (shuffled.every((val, idx) => val === array[idx])) {
    const temp = shuffled[0];
    shuffled[0] = shuffled[shuffled.length - 1];
    shuffled[shuffled.length - 1] = temp;
  }

  return shuffled;
}

// 8 curated progressive challenges starting easy (1-3, 1-4, 1-5, 2-6, 3-7, 1-6, 4-9, 1-8)
const generateChallenges = (): { challenges: OrderChallenge[]; bgGradient: string } => {
  const bgGradient = GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)];

  const challengeSequences: number[][] = [
    [1, 2, 3],             // Challenge 1: 1-3 (3 items)
    [1, 2, 3, 4],          // Challenge 2: 1-4 (4 items)
    [1, 2, 3, 4, 5],       // Challenge 3: 1-5 (5 items)
    [2, 3, 4, 5, 6],       // Challenge 4: 2-6 (5 items starting from 2)
    [3, 4, 5, 6, 7],       // Challenge 5: 3-7 (5 items starting from 3)
    [1, 2, 3, 4, 5, 6],    // Challenge 6: 1-6 (6 items)
    [4, 5, 6, 7, 8, 9],    // Challenge 7: 4-9 (6 items starting from 4)
    [1, 2, 3, 4, 5, 6, 7, 8], // Challenge 8: 1-8 (8 items)
  ];

  const challenges: OrderChallenge[] = challengeSequences.map((seq, index) => {
    const shuffledNumbers = shuffleNonSorted(seq);
    return {
      id: `order_c_${index}_${Math.random().toString(36).substring(2, 6)}`,
      sequence: seq,
      shuffledNumbers,
      min: seq[0],
      max: seq[seq.length - 1],
    };
  });

  return { challenges, bgGradient };
};

export const NumberOrder: React.FC<NumberOrderProps> = ({
  onCollectStar,
  onNavigateHome,
  onNavigateNext,
  onNavigatePrev,
  isActivityCompleted = false,
}) => {
  const [{ challenges, bgGradient }, setGame] = useState(generateChallenges);
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);

  // Placed slots: map slot index -> number placed
  const [placedSlots, setPlacedSlots] = useState<Record<number, number>>({});
  const [selectedCardValue, setSelectedCardValue] = useState<number | null>(null);
  const [shakingValue, setShakingValue] = useState<number | null>(null);
  const [isSuccessCelebrating, setIsSuccessCelebrating] = useState(false);
  const [isAllFinished, setIsAllFinished] = useState(false);

  // Slot element refs for drag proximity / collision detection
  const slotRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const currentChallenge = challenges[currentChallengeIndex] || challenges[0];

  // Voice instruction on challenge change
  useEffect(() => {
    if (isAllFinished) return;
    soundManager.speak('Put the numbers in order.');
    setPlacedSlots({});
    setSelectedCardValue(null);
    setShakingValue(null);
    setIsSuccessCelebrating(false);
  }, [currentChallengeIndex, isAllFinished]);

  // Handle Play Again (Full game restart with fresh shuffles)
  const handlePlayAgain = () => {
    soundManager.speak("Let's put the numbers in order again!");
    setGame(generateChallenges());
    setCurrentChallengeIndex(0);
    setPlacedSlots({});
    setSelectedCardValue(null);
    setShakingValue(null);
    setIsSuccessCelebrating(false);
    setIsAllFinished(false);
  };

  // Try placing a number into a target slot index
  const handleTryPlaceNumber = (numValue: number, targetSlotIndex: number) => {
    if (isSuccessCelebrating || isAllFinished) return;

    const expectedValue = currentChallenge.sequence[targetSlotIndex];

    if (numValue === expectedValue) {
      // CORRECT PLACEMENT
      soundManager.playPop();
      const style = NUMBER_STYLE_MAP[numValue];
      if (style) {
        soundManager.speak(style.name);
      } else {
        soundManager.speak(String(numValue));
      }

      const nextPlaced = { ...placedSlots, [targetSlotIndex]: numValue };
      setPlacedSlots(nextPlaced);
      setSelectedCardValue(null);

      // Check if all slots in the current sequence are correctly filled
      const allFilled = currentChallenge.sequence.every(
        (_, idx) => nextPlaced[idx] !== undefined
      );

      if (allFilled) {
        setIsSuccessCelebrating(true);
        soundManager.playCelebration();
        soundManager.speak('Great job!');

        setTimeout(() => {
          if (currentChallengeIndex + 1 >= challenges.length) {
            // Whole 8-challenge activity finished!
            onCollectStar();
            setIsAllFinished(true);
            soundManager.speak('You put all the numbers in order! Great job!');
          } else {
            // Automatically advance to next shuffled challenge
            setCurrentChallengeIndex((prev) => prev + 1);
          }
        }, 1600);
      }
    } else {
      // WRONG PLACEMENT
      soundManager.playPop();
      soundManager.speak('Try again!');
      setShakingValue(numValue);
      setTimeout(() => {
        setShakingValue(null);
        setSelectedCardValue(null);
      }, 600);
    }
  };

  // Drag End Detection using pointer release coordinates
  const handleCardDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    numValue: number
  ) => {
    if (isSuccessCelebrating || isAllFinished) return;

    const point =
      'changedTouches' in event
        ? event.changedTouches[0]
        : (event as MouseEvent);
    const dropX = point.clientX;
    const dropY = point.clientY;

    let nearestSlotIndex: number | null = null;
    let shortestDistance = Infinity;

    // Check collision with all available empty slots
    currentChallenge.sequence.forEach((_, slotIdx) => {
      // Skip if slot is already occupied
      if (placedSlots[slotIdx] !== undefined) return;

      const el = slotRefs.current[slotIdx];
      if (el) {
        const rect = el.getBoundingClientRect();
        const centerX = (rect.left + rect.right) / 2;
        const centerY = (rect.top + rect.bottom) / 2;
        const dist = Math.hypot(dropX - centerX, dropY - centerY);

        // Generous preschool drop target hitbox (within 75px radius or inside bounding box + padding)
        const isInsideGenerousBox =
          dropX >= rect.left - 35 &&
          dropX <= rect.right + 35 &&
          dropY >= rect.top - 35 &&
          dropY <= rect.bottom + 35;

        if (isInsideGenerousBox && dist < shortestDistance) {
          shortestDistance = dist;
          nearestSlotIndex = slotIdx;
        }
      }
    });

    if (nearestSlotIndex !== null) {
      handleTryPlaceNumber(numValue, nearestSlotIndex);
    } else {
      // Dropped away from any slot -> smooth spring back
      soundManager.playPop();
      soundManager.speak('Try again!');
      setShakingValue(numValue);
      setTimeout(() => setShakingValue(null), 500);
    }
  };

  // Tap Card Selection (Dual-interaction fallback)
  const handleCardClick = (numValue: number) => {
    if (isSuccessCelebrating || isAllFinished) return;
    if (selectedCardValue === numValue) {
      setSelectedCardValue(null);
    } else {
      setSelectedCardValue(numValue);
      soundManager.playPop();
      const style = NUMBER_STYLE_MAP[numValue];
      if (style) {
        soundManager.speak(style.name);
      }
    }
  };

  // Tap Slot Target
  const handleSlotClick = (slotIndex: number) => {
    if (isSuccessCelebrating || isAllFinished) return;
    if (placedSlots[slotIndex] !== undefined) return;

    if (selectedCardValue !== null) {
      handleTryPlaceNumber(selectedCardValue, slotIndex);
    }
  };

  // Available cards in tray: cards not yet correctly placed
  const placedValuesSet = new Set(Object.values(placedSlots));
  const availableCards = currentChallenge.shuffledNumbers.filter(
    (num) => !placedValuesSet.has(num)
  );

  const totalCardsInSequence = currentChallenge.sequence.length;

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center p-2 sm:p-4">
      {/* Top Banner Header */}
      <div className="w-full flex items-center justify-between bg-white border-4 border-amber-300 rounded-3xl px-4 sm:px-6 py-2.5 shadow-md mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl sm:text-3xl">🔢</span>
          <div>
            <h1 className="text-base sm:text-lg font-black text-amber-950 tracking-tight leading-tight">
              NUMBER ORDER
            </h1>
            <p className="text-[11px] sm:text-xs font-bold text-amber-700">
              Challenge: {currentChallengeIndex + (isAllFinished ? 1 : 0)} / {challenges.length}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-amber-100 border-2 border-amber-300 px-3 py-1 rounded-full text-amber-900 font-black text-xs">
          <StarIcon className="w-4 h-4 fill-amber-400 text-amber-500" />
          <span>{isActivityCompleted || isAllFinished ? '⭐ STAR EARNED' : '1 STAR'}</span>
        </div>
      </div>

      {/* Main Play Area Card */}
      <div
        className={`w-full bg-gradient-to-br ${bgGradient} border-4 border-amber-400 rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col items-center relative overflow-hidden min-h-[520px] justify-between transition-colors duration-500`}
      >
        {/* Instruction Header */}
        <div className="text-center mt-1 mb-3">
          <div className="inline-flex items-center gap-2 bg-white px-6 py-2 rounded-full border-4 border-amber-300 shadow-md mb-1.5">
            <button
              type="button"
              onClick={() => soundManager.speak('Put the numbers in order.')}
              className="text-amber-600 hover:text-amber-800 transition-colors cursor-pointer"
              title="Repeat instruction"
            >
              <Volume2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <h2 className="text-base sm:text-xl font-black text-amber-950 tracking-wide">
              Put the numbers in order
            </h2>
          </div>
          <p className="text-xs sm:text-sm font-black text-slate-600 uppercase tracking-wide">
            Drag the cards into the empty slots from left to right!
          </p>
        </div>

        {/* SEQUENCE SLOTS AREA (TOP/CENTER) */}
        <div className="w-full max-w-3xl flex flex-col items-center my-auto py-2">
          {/* Subtle Directional Arrow Guide */}
          <div className="w-full flex items-center justify-between px-4 mb-2 max-w-2xl text-[11px] sm:text-xs font-black text-amber-900/70 uppercase tracking-wider select-none">
            <span>First ({currentChallenge.min})</span>
            <div className="flex items-center gap-1">
              <span>Small to Big</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </div>
            <span>Last ({currentChallenge.max})</span>
          </div>

          {/* Sequence Rail Slots */}
          <div
            className={`w-full flex items-center justify-center flex-wrap gap-2.5 sm:gap-3.5 px-2 py-3 bg-white/70 backdrop-blur-xs rounded-3xl border-4 border-amber-300 shadow-inner`}
          >
            {currentChallenge.sequence.map((expectedNumber, slotIndex) => {
              const placedNumber = placedSlots[slotIndex];
              const isFilled = placedNumber !== undefined;
              const style = isFilled ? NUMBER_STYLE_MAP[placedNumber] : null;

              return (
                <div
                  key={`slot_${slotIndex}`}
                  ref={(el) => {
                    slotRefs.current[slotIndex] = el;
                  }}
                  onClick={() => handleSlotClick(slotIndex)}
                  className={`relative flex items-center justify-center rounded-2xl sm:rounded-3xl transition-all select-none cursor-pointer ${
                    totalCardsInSequence > 6
                      ? 'w-12 h-16 sm:w-16 sm:h-22 text-2xl sm:text-4xl'
                      : totalCardsInSequence > 4
                      ? 'w-14 h-20 sm:w-20 sm:h-26 text-3xl sm:text-5xl'
                      : 'w-16 h-22 sm:w-24 sm:h-30 text-4xl sm:text-6xl'
                  } ${
                    isFilled
                      ? `${style?.color} ${style?.borderColor} ${style?.textColor} border-b-6 sm:border-b-8 shadow-lg scale-100`
                      : selectedCardValue !== null
                      ? 'bg-amber-50/90 border-4 border-dashed border-amber-400 shadow-md hover:bg-amber-100 hover:scale-105'
                      : 'bg-white/60 border-4 border-dashed border-amber-300/80 shadow-inner hover:border-amber-400'
                  }`}
                >
                  {isFilled ? (
                    <motion.div
                      initial={{ scale: 0.5, rotate: -10 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                      className="flex flex-col items-center justify-center w-full h-full"
                    >
                      <span className="font-black leading-none drop-shadow-md">
                        {placedNumber}
                      </span>
                      {/* Check badge */}
                      <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white rounded-full p-0.5 border-2 border-white shadow-xs">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    </motion.div>
                  ) : (
                    <div className="flex flex-col items-center justify-center opacity-40">
                      <span className="text-xl sm:text-2xl font-black text-amber-800">
                        ?
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* SHUFFLED NUMBER CARDS TRAY (BOTTOM AREA) */}
        <div className="w-full max-w-3xl flex flex-col items-center mt-3 mb-1">
          <div className="text-xs sm:text-sm font-black text-amber-950 uppercase tracking-wider mb-2 select-none flex items-center gap-1.5">
            <span>Numbers To Drag</span>
            {selectedCardValue !== null && (
              <span className="text-[11px] font-bold bg-amber-400 text-amber-950 px-2 py-0.5 rounded-full animate-pulse">
                Tap an empty slot above!
              </span>
            )}
          </div>

          <div className="w-full flex items-center justify-center flex-wrap gap-3 sm:gap-4 min-h-[90px] sm:min-h-[110px] p-2 bg-amber-100/60 rounded-3xl border-2 border-amber-300/60">
            <AnimatePresence mode="popLayout">
              {availableCards.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 text-emerald-800 font-black text-sm sm:text-base py-2"
                >
                  <Sparkles className="w-5 h-5 text-emerald-600 animate-spin" />
                  <span>All numbers placed in order!</span>
                </motion.div>
              ) : (
                availableCards.map((numValue) => {
                  const style = NUMBER_STYLE_MAP[numValue] || {
                    color: 'bg-teal-500',
                    borderColor: 'border-teal-700',
                    textColor: 'text-white',
                    shadowColor: 'shadow-teal-700/50',
                    name: String(numValue),
                  };

                  const isSelected = selectedCardValue === numValue;
                  const isShaking = shakingValue === numValue;

                  return (
                    <motion.div
                      key={`card_${numValue}`}
                      layout
                      drag
                      dragSnapToOrigin={true}
                      whileDrag={{ scale: 1.15, zIndex: 50 }}
                      onDragEnd={(e) => handleCardDragEnd(e, numValue)}
                      onClick={() => handleCardClick(numValue)}
                      animate={
                        isShaking
                          ? { x: [-10, 10, -10, 10, 0] }
                          : isSelected
                          ? { scale: [1, 1.08, 1], y: -4 }
                          : { scale: 1, y: 0 }
                      }
                      transition={{ duration: isShaking ? 0.4 : 0.2 }}
                      className={`relative flex flex-col items-center justify-center rounded-2xl sm:rounded-3xl border-b-6 sm:border-b-8 shadow-xl cursor-grab active:cursor-grabbing select-none transition-shadow touch-none ${
                        style.color
                      } ${style.borderColor} ${style.textColor} ${style.shadowColor} ${
                        totalCardsInSequence > 6
                          ? 'w-13 h-18 sm:w-18 sm:h-24 text-3xl sm:text-5xl'
                          : totalCardsInSequence > 4
                          ? 'w-15 h-20 sm:w-20 sm:h-26 text-4xl sm:text-5xl'
                          : 'w-18 h-24 sm:w-24 sm:h-30 text-5xl sm:text-6xl'
                      } ${
                        isSelected
                          ? 'ring-4 ring-amber-400 ring-offset-2 shadow-2xl'
                          : 'hover:scale-105 active:scale-95'
                      }`}
                    >
                      <span className="font-black leading-none drop-shadow-md">
                        {numValue}
                      </span>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* SINGLE CHALLENGE SUCCESS CELEBRATION OVERLAY */}
        <AnimatePresence>
          {isSuccessCelebrating && !isAllFinished && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 z-30 flex items-center justify-center bg-black/20 backdrop-blur-xs p-4"
            >
              <div className="bg-white border-6 border-amber-400 rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center animate-bounce">
                <div className="text-5xl mb-2">🌟</div>
                <h3 className="text-2xl sm:text-3xl font-black text-amber-950 uppercase tracking-wide">
                  Great Job!
                </h3>
                <p className="text-sm sm:text-base font-bold text-amber-800 mt-1">
                  You put the numbers in order!
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ALL CHALLENGES FINISHED CELEBRATION OVERLAY */}
        <AnimatePresence>
          {isAllFinished && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 z-40 flex items-center justify-center bg-white/95 backdrop-blur-sm p-4"
            >
              <div className="bg-gradient-to-b from-amber-50 to-orange-50 border-8 border-amber-400 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col items-center text-center max-w-md w-full">
                <div className="text-6xl sm:text-7xl mb-2 animate-bounce">🏆</div>
                <h3 className="text-2xl sm:text-3xl font-black text-amber-950 tracking-tight">
                  NUMBER ORDER MASTER!
                </h3>
                <p className="text-sm sm:text-base font-bold text-amber-800 mt-2 mb-4">
                  You arranged all number sequences in perfect order!
                </p>

                <div className="flex items-center gap-2 bg-amber-200 border-2 border-amber-400 px-4 py-2 rounded-full font-black text-amber-950 text-base mb-6">
                  <StarIcon className="w-6 h-6 fill-amber-400 text-amber-600" />
                  <span>STAR EARNED!</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <button
                    type="button"
                    onClick={handlePlayAgain}
                    className="flex-1 flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-500 text-amber-950 font-black py-3.5 px-6 rounded-2xl border-b-6 border-amber-600 shadow-lg active:border-b-2 active:translate-y-1 transition-all cursor-pointer text-base uppercase"
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
        isNextUnlocked={isActivityCompleted || isAllFinished}
      />
    </div>
  );
};
