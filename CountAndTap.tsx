import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Volume2, Star as StarIcon, Check } from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { ActivityBottomNav } from './ActivityBottomNav';

interface CountAndTapProps {
  onCollectStar: () => void;
  onNavigateHome?: () => void;
  onNavigateNext?: () => void;
  onNavigatePrev?: () => void;
  isActivityCompleted?: boolean;
}

interface CountObject {
  id: string;
  nameSingular: string;
  namePlural: string;
  emoji: string;
}

interface QuestionData {
  id: string;
  object: CountObject;
  count: number;
  options: number[]; // 3 distinct number choices (baskets)
  correctOptionIndex: number;
}

const NUMBER_WORDS: Record<number, string> = {
  1: 'one',
  2: 'two',
  3: 'three',
  4: 'four',
  5: 'five',
  6: 'six',
  7: 'seven',
  8: 'eight',
  9: 'nine',
  10: 'ten',
};

const OBJECT_POOL: CountObject[] = [
  { id: 'balloon', nameSingular: 'balloon', namePlural: 'balloons', emoji: '🎈' },
  { id: 'kite', nameSingular: 'kite', namePlural: 'kites', emoji: '🪁' },
  { id: 'flower', nameSingular: 'flower', namePlural: 'flowers', emoji: '🌸' },
  { id: 'star', nameSingular: 'star', namePlural: 'stars', emoji: '⭐' },
  { id: 'apple', nameSingular: 'apple', namePlural: 'apples', emoji: '🍎' },
  { id: 'strawberry', nameSingular: 'strawberry', namePlural: 'strawberries', emoji: '🍓' },
  { id: 'butterfly', nameSingular: 'butterfly', namePlural: 'butterflies', emoji: '🦋' },
  { id: 'fish', nameSingular: 'fish', namePlural: 'fish', emoji: '🐟' },
  { id: 'teddy', nameSingular: 'teddy bear', namePlural: 'teddy bears', emoji: '🧸' },
  { id: 'ball', nameSingular: 'ball', namePlural: 'balls', emoji: '⚽' },
  { id: 'banana', nameSingular: 'banana', namePlural: 'bananas', emoji: '🍌' },
  { id: 'duck', nameSingular: 'duck', namePlural: 'ducks', emoji: '🦆' },
];

const GRADIENTS = [
  'from-sky-100 via-blue-50 to-amber-100',
  'from-amber-100 via-orange-50 to-teal-100',
  'from-emerald-100 via-teal-50 to-indigo-100',
  'from-rose-100 via-pink-50 to-sky-100',
  'from-violet-100 via-purple-50 to-yellow-100',
];

// Helper to Fisher-Yates shuffle
function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Generate realistic nearby distractors for a count (range 1-10)
function generateNumberChoices(count: number): number[] {
  const choices = new Set<number>();
  choices.add(count);

  // Generate reasonable nearby distractors (-2, -1, +1, +2, +3)
  const candidateOffsets = shuffleArray([-2, -1, 1, 2, 3, -3]);
  for (const offset of candidateOffsets) {
    const val = count + offset;
    if (val >= 1 && val <= 10 && !choices.has(val)) {
      choices.add(val);
      if (choices.size === 3) break;
    }
  }

  // Fallback if needed
  let fallbackVal = 1;
  while (choices.size < 3) {
    if (!choices.has(fallbackVal)) {
      choices.add(fallbackVal);
    }
    fallbackVal++;
  }

  return shuffleArray(Array.from(choices));
}

// Generate 8 progressive, randomized questions (Quantities 1–10)
const generateGameQuestions = (): { questions: QuestionData[]; bgGradient: string } => {
  const shuffledObjects = shuffleArray(OBJECT_POOL);

  // Progressive quantity brackets for 8 questions:
  // Q1, Q2: 1–3
  // Q3, Q4: 4–5
  // Q5, Q6: 6–7
  // Q7, Q8: 8–10
  const countPools = [
    [1, 2, 3],
    [1, 2, 3],
    [4, 5],
    [4, 5],
    [6, 7],
    [6, 7],
    [8, 9, 10],
    [8, 9, 10],
  ];

  const questions: QuestionData[] = countPools.map((pool, idx) => {
    const object = shuffledObjects[idx % shuffledObjects.length];
    const count = pool[Math.floor(Math.random() * pool.length)];
    const options = generateNumberChoices(count);
    const correctOptionIndex = options.indexOf(count);

    return {
      id: `q_${idx}_${object.id}_${count}_${Math.random().toString(36).substring(2, 6)}`,
      object,
      count,
      options,
      correctOptionIndex,
    };
  });

  const bgGradient = GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)];
  return { questions, bgGradient };
};

// Identical uniform basket styling for all 3 choices
const BASKET_STYLE = {
  rimBg: 'bg-amber-400',
  rimBorder: 'border-amber-600',
  bodyBg: 'bg-gradient-to-b from-amber-50 to-amber-100/90',
  bodyBorder: 'border-amber-400',
  numBg: 'bg-amber-500',
  numText: 'text-white',
  wickerPattern: 'border-amber-300/80',
};

export const CountAndTap: React.FC<CountAndTapProps> = ({
  onCollectStar,
  onNavigateHome,
  onNavigateNext,
  onNavigatePrev,
  isActivityCompleted = false,
}) => {
  const [{ questions, bgGradient }, setGame] = useState(generateGameQuestions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedBasketIndex, setSelectedBasketIndex] = useState<number | null>(null);
  const [isSuccessing, setIsSuccessing] = useState(false);
  const [shakingBasketIndex, setShakingBasketIndex] = useState<number | null>(null);
  const [tappedItemIndices, setTappedItemIndices] = useState<Set<number>>(new Set());
  const [isAllFinished, setIsAllFinished] = useState(false);

  // References to calculate exact basket target offsets for falling/flying animation
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const basketRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [animationDeltas, setAnimationDeltas] = useState<{ x: number; y: number }[]>([]);

  const currentQ = questions[currentQuestionIndex] || questions[0];

  // Voice instruction when question changes
  useEffect(() => {
    if (!isAllFinished && currentQ) {
      const objectName = currentQ.count === 1 ? currentQ.object.nameSingular : currentQ.object.namePlural;
      soundManager.speak(`How many ${objectName}?`);
    }
    setTappedItemIndices(new Set());
    setSelectedBasketIndex(null);
    setShakingBasketIndex(null);
    setIsSuccessing(false);
    setAnimationDeltas([]);
  }, [currentQuestionIndex, isAllFinished]);

  const handlePlayAgain = () => {
    soundManager.playPop();
    soundManager.speak("Let's count and tap again!");
    setGame(generateGameQuestions());
    setCurrentQuestionIndex(0);
    setSelectedBasketIndex(null);
    setShakingBasketIndex(null);
    setIsSuccessing(false);
    setIsAllFinished(false);
    setTappedItemIndices(new Set());
    setAnimationDeltas([]);
  };

  // Optional tap highlight for individual objects to help count one-by-one
  const handleObjectTap = (index: number) => {
    if (isSuccessing || isAllFinished) return;
    soundManager.playPop();
    setTappedItemIndices((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  // Handle child tapping a numbered basket
  const handleBasketSelect = (basketNumber: number, basketIndex: number) => {
    if (isSuccessing || isAllFinished) return;

    setSelectedBasketIndex(basketIndex);

    if (basketNumber === currentQ.count) {
      // CORRECT BASKET SELECTED
      setIsSuccessing(true);

      // Compute visual translation offsets from each object to the chosen basket
      const targetBasketEl = basketRefs.current[basketIndex];
      if (targetBasketEl) {
        const basketRect = targetBasketEl.getBoundingClientRect();
        const basketCenterX = basketRect.left + basketRect.width / 2;
        const basketCenterY = basketRect.top + basketRect.height / 3;

        const deltas = Array.from({ length: currentQ.count }).map((_, i) => {
          const itemEl = itemRefs.current[i];
          if (itemEl) {
            const itemRect = itemEl.getBoundingClientRect();
            const itemCenterX = itemRect.left + itemRect.width / 2;
            const itemCenterY = itemRect.top + itemRect.height / 2;
            return {
              x: basketCenterX - itemCenterX,
              y: basketCenterY - itemCenterY,
            };
          }
          return { x: 0, y: 180 };
        });
        setAnimationDeltas(deltas);
      }

      soundManager.playSuccess();
      const rawWord = NUMBER_WORDS[currentQ.count] || currentQ.count.toString();
      const numberWord = rawWord.charAt(0).toUpperCase() + rawWord.slice(1);
      soundManager.speak(`Great job! ${numberWord}!`);

      setTimeout(() => {
        if (currentQuestionIndex + 1 >= questions.length) {
          // All 8 challenges completed
          onCollectStar();
          setIsAllFinished(true);
          soundManager.playCelebration();
          soundManager.speak('You counted them all!');
        } else {
          // Advance automatically to next challenge (NO manual next button)
          setCurrentQuestionIndex((prev) => prev + 1);
        }
      }, 1600);
    } else {
      // WRONG BASKET SELECTED
      soundManager.playPop();
      setShakingBasketIndex(basketIndex);
      soundManager.speak('Try again!');

      setTimeout(() => {
        setShakingBasketIndex(null);
        setSelectedBasketIndex(null);
      }, 700);
    }
  };

  const objectNameText = currentQ.count === 1 ? currentQ.object.nameSingular : currentQ.object.namePlural;

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center p-2 sm:p-4">
      {/* Top Banner Header */}
      <div className="w-full bg-white/90 backdrop-blur-md border-4 border-amber-300 rounded-3xl p-3 sm:p-4 shadow-lg mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-amber-100 px-3 py-1.5 rounded-2xl border-2 border-amber-300">
            <span className="text-xl">🎯</span>
            <h1 className="text-base sm:text-xl font-black text-amber-950 uppercase tracking-wide">
              COUNT & TAP
            </h1>
          </div>
        </div>

        {/* Counter & Stars (No Round Numbers) */}
        <div className="flex items-center gap-2">
          <div className="bg-sky-100 text-sky-900 font-black text-xs sm:text-sm px-3 py-1.5 rounded-2xl border-2 border-sky-300 flex items-center gap-1">
            <span>Completed: {isAllFinished ? 8 : currentQuestionIndex} / 8</span>
          </div>

          <div className="bg-amber-400 text-amber-950 font-black text-xs sm:text-sm px-3 py-1.5 rounded-2xl border-2 border-amber-300 flex items-center gap-1 shadow-xs">
            <StarIcon className="w-4 h-4 fill-amber-100 stroke-amber-950" />
            <span>{isAllFinished || isActivityCompleted ? 1 : 0}</span>
          </div>
        </div>
      </div>

      {/* Main Play Area */}
      <div
        ref={containerRef}
        className={`w-full bg-gradient-to-br ${bgGradient} border-4 border-amber-400 rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col items-center relative overflow-hidden min-h-[500px] justify-between transition-colors duration-500`}
      >
        {/* Instruction Subheader */}
        <div className="text-center mt-1 mb-2">
          <div className="inline-flex items-center gap-2 bg-white px-6 py-2 rounded-full border-4 border-amber-300 shadow-md mb-1">
            <button
              type="button"
              onClick={() => soundManager.speak(`How many ${objectNameText}?`)}
              className="p-1 bg-amber-100 hover:bg-amber-200 rounded-full text-amber-900 transition-transform active:scale-90 cursor-pointer"
            >
              <Volume2 className="w-5 h-5" />
            </button>
            <h2 className="text-lg sm:text-2xl font-black text-slate-800 tracking-tight uppercase">
              HOW MANY {objectNameText}?
            </h2>
          </div>
          <p className="text-xs sm:text-sm font-black text-slate-600 uppercase tracking-wide">
            Count the floating {objectNameText} and tap the matching basket below!
          </p>
        </div>

        {!isAllFinished ? (
          <div className="w-full flex flex-col items-center justify-between gap-6 my-auto max-w-2xl flex-1">
            {/* UPPER SKY / AIR AREA: FLOATING STATIC OBJECTS */}
            <div className="w-full bg-white/75 backdrop-blur-xs border-4 border-sky-200 rounded-3xl p-5 sm:p-6 shadow-inner flex flex-col items-center justify-center min-h-[190px] relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQ.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 max-w-lg mt-2"
                >
                  {Array.from({ length: currentQ.count }).map((_, idx) => {
                    const isTapped = tappedItemIndices.has(idx);
                    const delta = animationDeltas[idx] || { x: 0, y: 0 };

                    return (
                      <motion.div
                        key={idx}
                        ref={(el) => {
                          itemRefs.current[idx] = el;
                        }}
                        animate={
                          isSuccessing && animationDeltas.length > 0
                            ? {
                                x: delta.x,
                                y: delta.y,
                                scale: [1, 1.1, 0.25],
                                opacity: [1, 1, 0],
                                rotate: [0, (idx % 2 === 0 ? 1 : -1) * 15, 0],
                              }
                            : {
                                y: [-3, 3, -3],
                                x: 0,
                                scale: 1,
                                opacity: 1,
                                rotate: 0,
                              }
                        }
                        transition={
                          isSuccessing
                            ? {
                                duration: 0.85,
                                delay: idx * 0.04,
                                ease: [0.25, 1, 0.5, 1],
                              }
                            : {
                                y: {
                                  repeat: Infinity,
                                  duration: 2.8 + (idx % 4) * 0.4,
                                  ease: 'easeInOut',
                                  delay: (idx * 0.25) % 1.5,
                                },
                              }
                        }
                        className="relative"
                      >
                        <motion.button
                          type="button"
                          onClick={() => handleObjectTap(idx)}
                          whileTap={{ scale: 0.92 }}
                          className={`relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border-3 sm:border-4 transition-all cursor-pointer select-none shadow-md ${
                            isTapped
                              ? 'bg-amber-100 border-amber-500 ring-3 ring-amber-300 scale-105'
                              : 'bg-white hover:bg-sky-50 border-sky-200 hover:border-sky-300'
                          }`}
                          title="Tap to count"
                        >
                          <span className="text-3xl sm:text-4xl filter drop-shadow-xs leading-none select-none">
                            {currentQ.object.emoji}
                          </span>
                        </motion.button>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </AnimatePresence>

              <div className="text-[11px] font-black text-slate-500 uppercase tracking-wide mt-3 text-center">
                👉 Tap objects to help count one by one!
              </div>
            </div>

            {/* LOWER AREA: 3 CUTE NUMBERED BASKETS */}
            <div className="w-full">
              <div className="text-center mb-2">
                <span className="text-xs sm:text-sm font-black text-amber-950 bg-amber-200/90 px-4 py-1 rounded-full border-2 border-amber-400 uppercase tracking-wide">
                  🧺 Tap the correct basket:
                </span>
              </div>

              <div className="w-full grid grid-cols-3 gap-3 sm:gap-6">
                {currentQ.options.map((optionVal, optIdx) => {
                  const isSelected = selectedBasketIndex === optIdx;
                  const isCorrect = isSuccessing && isSelected && optionVal === currentQ.count;
                  const isShaking = shakingBasketIndex === optIdx;

                  return (
                    <motion.button
                      key={optionVal}
                      ref={(el) => {
                        basketRefs.current[optIdx] = el;
                      }}
                      type="button"
                      onClick={() => handleBasketSelect(optionVal, optIdx)}
                      disabled={isSuccessing}
                      animate={
                        isShaking
                          ? { x: [-8, 8, -6, 6, -3, 3, 0] }
                          : isCorrect
                          ? { scale: [1, 1.08, 1], y: [0, -6, 0] }
                          : {}
                      }
                      transition={{ duration: 0.35 }}
                      whileHover={{ scale: isSuccessing ? 1 : 1.03 }}
                      whileTap={{ scale: isSuccessing ? 1 : 0.95 }}
                      className={`relative flex flex-col items-center justify-between p-2 sm:p-3 rounded-3xl border-4 shadow-xl active:translate-y-1 transition-all cursor-pointer select-none ${
                        BASKET_STYLE.bodyBorder
                      } ${BASKET_STYLE.bodyBg} ${
                        isCorrect
                          ? 'ring-4 ring-emerald-400 border-emerald-500 bg-emerald-50'
                          : isSelected
                          ? 'ring-4 ring-amber-300'
                          : 'hover:shadow-2xl'
                      }`}
                    >
                      {/* Basket Handle / Rim */}
                      <div
                        className={`w-full py-1 sm:py-1.5 px-2 rounded-2xl border-2 flex items-center justify-center gap-1.5 ${BASKET_STYLE.rimBg} ${BASKET_STYLE.rimBorder} text-white shadow-xs`}
                      >
                        <span className="text-sm sm:text-base">🧺</span>
                        <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider">
                          BASKET
                        </span>
                      </div>

                      {/* Basket Weave / Inner Body with Large Number */}
                      <div className="w-full flex flex-col items-center justify-center my-2 sm:my-3 relative">
                        {/* Wicker decorative hatch pattern */}
                        <div className="absolute inset-0 opacity-15 pointer-events-none flex flex-col justify-around">
                          <div className={`border-b-2 border-dashed ${BASKET_STYLE.wickerPattern}`} />
                          <div className={`border-b-2 border-dashed ${BASKET_STYLE.wickerPattern}`} />
                        </div>

                        {/* Large Numeral */}
                        <div
                          className={`w-14 h-14 sm:w-18 sm:h-18 rounded-2xl flex items-center justify-center font-black text-3xl sm:text-5xl shadow-md border-3 border-white ${BASKET_STYLE.numBg} ${BASKET_STYLE.numText}`}
                        >
                          {optionVal}
                        </div>

                        <span className="text-[11px] sm:text-xs font-black text-slate-700 uppercase tracking-wider mt-1.5">
                          {NUMBER_WORDS[optionVal] || ''}
                        </span>
                      </div>

                      {/* Correct Check Badge (ONLY displayed after child taps and answers correctly) */}
                      {isCorrect && (
                        <div className="absolute -top-3 bg-emerald-500 text-white p-1.5 rounded-full border-2 border-white shadow-lg animate-bounce">
                          <Check className="w-5 h-5 stroke-[3]" />
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* Completion Screen with PLAY AGAIN button */
          <div className="flex flex-col items-center justify-center text-center my-auto p-6 bg-white/90 backdrop-blur-md rounded-3xl border-4 border-amber-400 shadow-xl max-w-lg">
            <div className="text-6xl mb-3 animate-bounce">🎉</div>
            <h3 className="text-2xl sm:text-3xl font-black text-amber-950 uppercase mb-2">
              COUNTING STAR!
            </h3>
            <div className="flex items-center gap-1.5 bg-amber-200 border-2 border-amber-400 px-4 py-1.5 rounded-full mb-3">
              <StarIcon className="w-5 h-5 fill-amber-400 text-amber-600" />
              <span className="font-black text-amber-950 text-sm">Star Earned!</span>
            </div>
            <p className="text-base font-bold text-slate-700 mb-5">
              You counted them all! Outstanding quantity recognition and basket matching!
            </p>

            {/* ONLY Replay Button */}
            <button
              type="button"
              onClick={handlePlayAgain}
              className="flex items-center justify-center gap-2 bg-[#4D96FF] hover:bg-blue-500 text-white font-black py-3.5 px-8 rounded-2xl border-b-6 border-[#2563EB] shadow-lg active:border-b-2 active:translate-y-1 transition-all cursor-pointer text-base sm:text-lg uppercase"
            >
              <RotateCcw className="w-5 h-5 stroke-[3]" />
              <span>PLAY AGAIN</span>
            </button>
          </div>
        )}
      </div>

      {/* SINGLE Bottom Navigation Bar: PREV | HOME | NEXT */}
      <ActivityBottomNav
        onNavigatePrev={onNavigatePrev}
        onNavigateHome={onNavigateHome}
        onNavigateNext={onNavigateNext}
        isNextUnlocked={isAllFinished || isActivityCompleted}
      />
    </div>
  );
};

