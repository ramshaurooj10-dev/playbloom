import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Volume2, Star as StarIcon, Check, Sparkles } from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { ActivityBottomNav } from './ActivityBottomNav';

interface HealthyFoodSortProps {
  onCollectStar: () => void;
  onNavigateHome?: () => void;
  onNavigateNext?: () => void;
  onNavigatePrev?: () => void;
  isActivityCompleted?: boolean;
}

export type HealthCategory = 'everyday' | 'sometimes';

export interface FoodItemDefinition {
  id: string;
  name: string;
  emoji: string;
  phrase: string;
  category: HealthCategory;
}

export interface FoodCardItem extends FoodItemDefinition {
  instanceId: string;
  isSorted: boolean;
  sortedTo?: HealthCategory;
}

// 1. EVERYDAY FOODS POOL (Carrot included, NO BEANS, NO TOMATO)
const EVERYDAY_FOODS: FoodItemDefinition[] = [
  {
    id: 'apple',
    name: 'Apple',
    emoji: '🍎',
    phrase: 'I am a fruit. Eating fruit every day is a healthy choice!',
    category: 'everyday',
  },
  {
    id: 'carrot',
    name: 'Carrot',
    emoji: '🥕',
    phrase: 'I am a vegetable. Vegetables are healthy for every day!',
    category: 'everyday',
  },
  {
    id: 'broccoli',
    name: 'Broccoli',
    emoji: '🥦',
    phrase: 'I am a vegetable. Choose me for a healthy everyday meal!',
    category: 'everyday',
  },
  {
    id: 'banana',
    name: 'Banana',
    emoji: '🍌',
    phrase: 'I am a fruit. I am a healthy everyday choice!',
    category: 'everyday',
  },
  {
    id: 'orange',
    name: 'Orange',
    emoji: '🍊',
    phrase: 'I am a fruit. Choose me for a healthy everyday meal!',
    category: 'everyday',
  },
  {
    id: 'strawberry',
    name: 'Strawberry',
    emoji: '🍓',
    phrase: 'I am a strawberry. Eating fruit every day is a healthy choice!',
    category: 'everyday',
  },
  {
    id: 'cucumber',
    name: 'Cucumber',
    emoji: '🥒',
    phrase: 'I am a cucumber. Vegetables are a healthy everyday choice!',
    category: 'everyday',
  },
  {
    id: 'spinach',
    name: 'Spinach',
    emoji: '🥬',
    phrase: 'I am spinach. Vegetables are healthy for every day!',
    category: 'everyday',
  },
  {
    id: 'egg',
    name: 'Egg',
    emoji: '🥚',
    phrase: 'I am an egg. I can be part of a healthy meal!',
    category: 'everyday',
  },
  {
    id: 'milk',
    name: 'Milk',
    emoji: '🥛',
    phrase: 'I am milk. I am a healthy everyday choice!',
    category: 'everyday',
  },
  {
    id: 'yogurt',
    name: 'Yogurt',
    emoji: '🥣',
    phrase: 'I am yogurt. I can be part of a healthy everyday meal!',
    category: 'everyday',
  },
  {
    id: 'water',
    name: 'Water',
    emoji: '💧',
    phrase: 'I am water. I am a healthy drink for every day!',
    category: 'everyday',
  },
  {
    id: 'bread',
    name: 'Whole-Grain Bread',
    emoji: '🍞',
    phrase: 'I am whole-grain bread. I can be part of a healthy everyday meal!',
    category: 'everyday',
  },
];

// 2. SOMETIMES FOOD POOL (Child-friendly positive treats)
const SOMETIMES_FOODS: FoodItemDefinition[] = [
  {
    id: 'pizza',
    name: 'Pizza',
    emoji: '🍕',
    phrase: 'I am pizza. Eating me every day is not a healthy choice. I am a sometimes food!',
    category: 'sometimes',
  },
  {
    id: 'fries',
    name: 'Fries',
    emoji: '🍟',
    phrase: 'I am fries. Eating me every day is not a healthy choice. I am a sometimes food!',
    category: 'sometimes',
  },
  {
    id: 'donut',
    name: 'Donut',
    emoji: '🍩',
    phrase: 'I am a donut. I am a sometimes food, not an everyday food!',
    category: 'sometimes',
  },
  {
    id: 'candy',
    name: 'Candy',
    emoji: '🍬',
    phrase: 'I am candy. I am a sometimes food!',
    category: 'sometimes',
  },
  {
    id: 'ice_cream',
    name: 'Ice Cream',
    emoji: '🍦',
    phrase: 'I am ice cream. I am a sometimes food!',
    category: 'sometimes',
  },
  {
    id: 'soda',
    name: 'Soda',
    emoji: '🥤',
    phrase: 'I am soda. I am not a healthy everyday drink. I am a sometimes drink!',
    category: 'sometimes',
  },
  {
    id: 'chocolate',
    name: 'Chocolate',
    emoji: '🍫',
    phrase: 'I am chocolate. I am a sometimes food!',
    category: 'sometimes',
  },
  {
    id: 'cake',
    name: 'Cake',
    emoji: '🍰',
    phrase: 'I am cake. I am a sometimes food!',
    category: 'sometimes',
  },
  {
    id: 'cookies',
    name: 'Cookies',
    emoji: '🍪',
    phrase: 'I am cookies. I am a sometimes food!',
    category: 'sometimes',
  },
];

// Fisher-Yates helper
function shuffleList<T>(list: T[]): T[] {
  const arr = [...list];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Generate 8 balanced cards (4 Everyday + 4 Sometimes) shuffled freshly every round
const generateShuffledFoodBoard = (excludeIds?: string[]): FoodCardItem[] => {
  const shuffledEveryday = shuffleList(EVERYDAY_FOODS);
  const shuffledSometimes = shuffleList(SOMETIMES_FOODS);

  let pickedEveryday = shuffledEveryday.slice(0, 4);
  let pickedSometimes = shuffledSometimes.slice(0, 4);

  if (excludeIds && excludeIds.length > 0) {
    const excludeSet = new Set(excludeIds);
    const freshEveryday = shuffledEveryday.filter((f) => !excludeSet.has(f.id));
    const freshSometimes = shuffledSometimes.filter((f) => !excludeSet.has(f.id));

    if (freshEveryday.length >= 3) {
      pickedEveryday = shuffleList([
        ...freshEveryday.slice(0, 3),
        ...shuffledEveryday.filter((f) => excludeSet.has(f.id)).slice(0, 1),
      ]);
    }
    if (freshSometimes.length >= 3) {
      pickedSometimes = shuffleList([
        ...freshSometimes.slice(0, 3),
        ...shuffledSometimes.filter((f) => excludeSet.has(f.id)).slice(0, 1),
      ]);
    }
  }

  const combined = [...pickedEveryday, ...pickedSometimes].map((food) => ({
    ...food,
    instanceId: `${food.id}_${Math.random().toString(36).substring(2, 9)}_${Date.now()}`,
    isSorted: false,
  }));

  return shuffleList(shuffleList(combined));
};

export const HealthyFoodSort: React.FC<HealthyFoodSortProps> = ({
  onCollectStar,
  onNavigateHome,
  onNavigateNext,
  onNavigatePrev,
  isActivityCompleted = false,
}) => {
  const [foods, setFoods] = useState<FoodCardItem[]>(() => generateShuffledFoodBoard());
  const [selectedFoodId, setSelectedFoodId] = useState<string | null>(null);
  const [wobbleSide, setWobbleSide] = useState<HealthCategory | null>(null);
  const [isAllCompleted, setIsAllCompleted] = useState(false);
  const [dragHoverTarget, setDragHoverTarget] = useState<HealthCategory | null>(null);

  const leftDropRef = useRef<HTMLDivElement>(null);
  const rightDropRef = useRef<HTMLDivElement>(null);
  const lastSpokenFoodRef = useRef<string | null>(null);
  const lastSpokenTimeRef = useRef<number>(0);

  // Initial greeting
  useEffect(() => {
    soundManager.speak('Sort the food! Put everyday foods on the left, and sometimes foods on the right.');
  }, []);

  // Filter unsorted and sorted items
  const unsortedFoods = foods.filter((f) => !f.isSorted);
  const everydayFoods = foods.filter((f) => f.isSorted && f.sortedTo === 'everyday');
  const sometimesFoods = foods.filter((f) => f.isSorted && f.sortedTo === 'sometimes');

  // Handle tapping a food to hear its voice clue
  const handleFoodTap = (food: FoodCardItem) => {
    const now = Date.now();
    if (lastSpokenFoodRef.current !== food.id || now - lastSpokenTimeRef.current > 600) {
      lastSpokenFoodRef.current = food.id;
      lastSpokenTimeRef.current = now;
      soundManager.playPop();
      soundManager.speak(food.phrase);
    }
    setSelectedFoodId(food.instanceId);
  };

  // Perform sort attempt
  const handleSortItem = (foodInstanceId: string, targetCategory: HealthCategory) => {
    const food = foods.find((f) => f.instanceId === foodInstanceId);
    if (!food || food.isSorted) return;

    if (food.category === targetCategory) {
      // CORRECT SORT
      soundManager.playSuccess();
      soundManager.speak('Great job!');

      setFoods((prev) =>
        prev.map((item) =>
          item.instanceId === foodInstanceId
            ? { ...item, isSorted: true, sortedTo: targetCategory }
            : item
        )
      );
      setSelectedFoodId(null);
      setDragHoverTarget(null);

      // Check if this was the last item
      const remaining = foods.filter((f) => !f.isSorted && f.instanceId !== foodInstanceId);
      if (remaining.length === 0) {
        setTimeout(() => {
          setIsAllCompleted(true);
          onCollectStar();
          soundManager.playCelebration();
          soundManager.speak('Great Job! You know your healthy foods!');
        }, 800);
      }
    } else {
      // WRONG SORT - Gentle feedback, food returns to starting place
      soundManager.playError();
      soundManager.speak('Try again!');
      setWobbleSide(targetCategory);
      setTimeout(() => setWobbleSide(null), 600);
      setDragHoverTarget(null);
    }
  };

  // Drag End Collision Detection
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, food: FoodCardItem) => {
    let clientX = 0;
    let clientY = 0;

    if ('changedTouches' in event && event.changedTouches.length > 0) {
      clientX = event.changedTouches[0].clientX;
      clientY = event.changedTouches[0].clientY;
    } else if ('clientX' in event) {
      clientX = (event as MouseEvent).clientX;
      clientY = (event as MouseEvent).clientY;
    }

    if (leftDropRef.current && rightDropRef.current) {
      const leftRect = leftDropRef.current.getBoundingClientRect();
      const rightRect = rightDropRef.current.getBoundingClientRect();

      const inLeft =
        clientX >= leftRect.left &&
        clientX <= leftRect.right &&
        clientY >= leftRect.top &&
        clientY <= leftRect.bottom;

      const inRight =
        clientX >= rightRect.left &&
        clientX <= rightRect.right &&
        clientY >= rightRect.top &&
        clientY <= rightRect.bottom;

      if (inLeft) {
        handleSortItem(food.instanceId, 'everyday');
        return;
      }
      if (inRight) {
        handleSortItem(food.instanceId, 'sometimes');
        return;
      }
    }
    setDragHoverTarget(null);
  };

  // Replay
  const handleReplay = () => {
    soundManager.playPop();
    soundManager.speak("Let's sort healthy foods again!");
    const currentIds = foods.map((f) => f.id);
    setFoods(generateShuffledFoodBoard(currentIds));
    setSelectedFoodId(null);
    setWobbleSide(null);
    setIsAllCompleted(false);
    setDragHoverTarget(null);
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center justify-center p-2 sm:p-4 select-none">
      {/* TOP HEADER: Clean Title & Controls */}
      <div className="w-full flex items-center justify-between bg-white border-4 border-emerald-300 rounded-3xl px-4 sm:px-6 py-2.5 shadow-md mb-3">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl sm:text-3xl">🥗</span>
          <div>
            <h1 className="text-lg sm:text-2xl font-black text-emerald-950 tracking-tight leading-none uppercase">
              HEALTHY FOOD
            </h1>
            <p className="text-[11px] sm:text-xs font-bold text-emerald-700">
              Sort everyday healthy foods & sometimes treats
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Audio repeat */}
          <button
            type="button"
            onClick={() =>
              soundManager.speak(
                'Sort the food! Put everyday foods on the left, and sometimes foods on the right.'
              )
            }
            className="p-2 bg-emerald-100 hover:bg-emerald-200 border-2 border-emerald-300 rounded-2xl text-emerald-800 transition-all cursor-pointer shadow-xs active:scale-95"
            title="Repeat instructions"
          >
            <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Replay */}
          <button
            type="button"
            onClick={handleReplay}
            className="flex items-center gap-1 bg-amber-100 hover:bg-amber-200 border-2 border-amber-300 px-3 py-1.5 rounded-2xl text-amber-900 font-black text-xs sm:text-sm transition-all cursor-pointer shadow-xs active:scale-95"
            title="Restart and shuffle"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">REPLAY</span>
          </button>

          {/* Star Badge */}
          <div className="flex items-center gap-1.5 bg-amber-100 border-2 border-amber-300 px-3.5 py-1 rounded-full text-amber-900 font-black text-xs sm:text-sm">
            <StarIcon className="w-4 h-4 fill-amber-400 text-amber-500" />
            <span>{isActivityCompleted || isAllCompleted ? '⭐ COMPLETED' : '1 STAR'}</span>
          </div>
        </div>
      </div>

      {/* MAIN PLAY AREA */}
      {!isAllCompleted ? (
        <div className="w-full flex flex-col items-center">
          {/* TWO LARGE DESTINATION CATEGORY SECTIONS (LEFT: EVERYDAY FOODS, RIGHT: SOMETIMES FOODS) */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4">
            {/* LEFT SECTION: EVERYDAY FOODS */}
            <motion.div
              ref={leftDropRef}
              animate={
                wobbleSide === 'everyday'
                  ? { x: [-10, 10, -8, 8, 0] }
                  : dragHoverTarget === 'everyday'
                  ? { scale: 1.02 }
                  : { scale: 1 }
              }
              transition={{ duration: 0.3 }}
              className={`relative flex flex-col items-center justify-between p-4 sm:p-5 rounded-3xl border-4 transition-all min-h-[175px] sm:min-h-[195px] shadow-lg ${
                wobbleSide === 'everyday'
                  ? 'bg-rose-50 border-rose-400 ring-4 ring-rose-200'
                  : 'bg-emerald-50/90 border-emerald-400 ring-4 ring-emerald-100'
              }`}
            >
              {/* Category Header Banner */}
              <div className="w-full flex items-center justify-between bg-emerald-500 text-white px-4 py-2 rounded-2xl shadow-sm mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl">🥕</span>
                  <span className="font-black text-xs sm:text-base tracking-wide uppercase">
                    EVERYDAY FOODS
                  </span>
                </div>
                <span className="text-xs font-black bg-white/20 px-2.5 py-0.5 rounded-full">
                  {everydayFoods.length} / 4
                </span>
              </div>

              {/* Settled Sorted Foods Tray */}
              <div className="w-full min-h-[75px] bg-white/80 border-2 border-dashed border-emerald-300 rounded-2xl p-2.5 flex flex-wrap items-center justify-center gap-2">
                {everydayFoods.length === 0 ? (
                  <p className="text-xs font-bold text-emerald-600/80 text-center py-2">
                    Drag or tap everyday healthy foods here!
                  </p>
                ) : (
                  everydayFoods.map((item) => (
                    <motion.div
                      key={item.instanceId}
                      initial={{ scale: 0.4, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex items-center gap-1.5 bg-emerald-100 border-2 border-emerald-300 px-3 py-1.5 rounded-2xl shadow-xs"
                    >
                      <span className="text-2xl">{item.emoji}</span>
                      <span className="text-xs font-black text-emerald-950">{item.name}</span>
                      <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                    </motion.div>
                  ))
                )}
              </div>

              {/* Tap to place button (Accessibility for touch & quick sorting) */}
              {selectedFoodId && (
                <button
                  type="button"
                  onClick={() => handleSortItem(selectedFoodId, 'everyday')}
                  className="mt-2.5 w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black py-2 px-3 rounded-xl border-b-4 border-emerald-700 shadow-md active:translate-y-0.5 transition-all text-xs uppercase tracking-wide cursor-pointer"
                >
                  Place Selected Food Here ➔
                </button>
              )}
            </motion.div>

            {/* RIGHT SECTION: SOMETIMES FOODS */}
            <motion.div
              ref={rightDropRef}
              animate={
                wobbleSide === 'sometimes'
                  ? { x: [-10, 10, -8, 8, 0] }
                  : dragHoverTarget === 'sometimes'
                  ? { scale: 1.02 }
                  : { scale: 1 }
              }
              transition={{ duration: 0.3 }}
              className={`relative flex flex-col items-center justify-between p-4 sm:p-5 rounded-3xl border-4 transition-all min-h-[175px] sm:min-h-[195px] shadow-lg ${
                wobbleSide === 'sometimes'
                  ? 'bg-rose-50 border-rose-400 ring-4 ring-rose-200'
                  : 'bg-amber-50/90 border-amber-400 ring-4 ring-amber-100'
              }`}
            >
              {/* Category Header Banner */}
              <div className="w-full flex items-center justify-between bg-amber-500 text-white px-4 py-2 rounded-2xl shadow-sm mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl">🍕</span>
                  <span className="font-black text-xs sm:text-base tracking-wide uppercase">
                    SOMETIMES FOODS
                  </span>
                </div>
                <span className="text-xs font-black bg-white/20 px-2.5 py-0.5 rounded-full">
                  {sometimesFoods.length} / 4
                </span>
              </div>

              {/* Settled Sorted Foods Tray */}
              <div className="w-full min-h-[75px] bg-white/80 border-2 border-dashed border-amber-300 rounded-2xl p-2.5 flex flex-wrap items-center justify-center gap-2">
                {sometimesFoods.length === 0 ? (
                  <p className="text-xs font-bold text-amber-700/80 text-center py-2">
                    Drag or tap sometimes treat foods here!
                  </p>
                ) : (
                  sometimesFoods.map((item) => (
                    <motion.div
                      key={item.instanceId}
                      initial={{ scale: 0.4, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex items-center gap-1.5 bg-amber-100 border-2 border-amber-300 px-3 py-1.5 rounded-2xl shadow-xs"
                    >
                      <span className="text-2xl">{item.emoji}</span>
                      <span className="text-xs font-black text-amber-950">{item.name}</span>
                      <Check className="w-3.5 h-3.5 text-amber-600 stroke-[3]" />
                    </motion.div>
                  ))
                )}
              </div>

              {/* Tap to place button */}
              {selectedFoodId && (
                <button
                  type="button"
                  onClick={() => handleSortItem(selectedFoodId, 'sometimes')}
                  className="mt-2.5 w-full bg-amber-500 hover:bg-amber-600 text-white font-black py-2 px-3 rounded-xl border-b-4 border-amber-700 shadow-md active:translate-y-0.5 transition-all text-xs uppercase tracking-wide cursor-pointer"
                >
                  Place Selected Food Here ➔
                </button>
              )}
            </motion.div>
          </div>

          {/* FOOD CARDS TRAY / SELECTION POOL */}
          <div className="w-full bg-white/95 border-4 border-sky-300 rounded-3xl p-4 sm:p-5 shadow-xl flex flex-col items-center">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">👆</span>
              <p className="text-xs sm:text-sm font-black text-slate-700 uppercase tracking-wide">
                Tap to hear food clue • Drag or tap to sort
              </p>
            </div>

            {/* Grid of Unsorted Food Items (STATIC while waiting - no continuous bouncing) */}
            <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl">
              <AnimatePresence>
                {unsortedFoods.map((food) => {
                  const isSelected = selectedFoodId === food.instanceId;

                  return (
                    <motion.div
                      key={food.instanceId}
                      layout
                      drag
                      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                      dragElastic={0.8}
                      whileDrag={{ scale: 1.15, zIndex: 60 }}
                      onDragEnd={(e) => handleDragEnd(e, food)}
                      onClick={() => handleFoodTap(food)}
                      className={`relative flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl border-4 cursor-grab active:cursor-grabbing select-none transition-all shadow-md touch-none ${
                        isSelected
                          ? 'bg-amber-100 border-amber-500 ring-4 ring-amber-300 scale-105 shadow-xl'
                          : 'bg-gradient-to-b from-white to-slate-50 border-slate-200 hover:border-sky-300 hover:shadow-lg'
                      }`}
                    >
                      {/* Food Emoji */}
                      <span className="text-4xl sm:text-5xl mb-1 filter drop-shadow-xs">
                        {food.emoji}
                      </span>

                      {/* Clean Food Name */}
                      <span className="text-xs sm:text-sm font-black text-slate-800 tracking-tight text-center">
                        {food.name}
                      </span>

                      {/* Tap Prompt Speaker Icon */}
                      <div className="absolute top-1.5 right-1.5 p-1 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
                        <Volume2 className="w-3 h-3" />
                      </div>

                      {/* Selection Glow Indicator */}
                      {isSelected && (
                        <div className="absolute -bottom-2 bg-amber-500 text-white font-black text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                          SELECTED
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        </div>
      ) : (
        /* COMPLETION SCREEN */
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-2xl bg-white border-4 border-emerald-400 rounded-3xl p-6 sm:p-8 shadow-2xl text-center flex flex-col items-center my-4"
        >
          <div className="w-20 h-20 bg-emerald-100 border-4 border-emerald-400 rounded-full flex items-center justify-center text-4xl shadow-inner mb-4">
            🥗
          </div>

          <div className="inline-flex items-center gap-1.5 bg-amber-100 border-2 border-amber-300 px-4 py-1.5 rounded-full text-amber-900 font-black text-sm uppercase mb-2">
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span>Activity Completed!</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-emerald-950 tracking-tight uppercase mb-2">
            Great Job!
          </h2>

          <p className="text-base sm:text-lg font-bold text-emerald-800 mb-6 max-w-md">
            You know your healthy foods! You sorted everyday foods and sometimes treat foods
            perfectly!
          </p>

          <button
            type="button"
            onClick={handleReplay}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-lg py-3.5 px-8 rounded-2xl border-b-6 border-emerald-700 shadow-lg active:translate-y-1 transition-all cursor-pointer uppercase tracking-wider mb-2"
          >
            <RotateCcw className="w-5 h-5 stroke-[2.5]" />
            <span>Play Again</span>
          </button>
        </motion.div>
      )}

      {/* STANDARD BOTTOM NAVIGATION: [ PREV ] [ HOME ] [ NEXT ] */}
      <ActivityBottomNav
        onNavigatePrev={onNavigatePrev}
        onNavigateHome={onNavigateHome}
        onNavigateNext={onNavigateNext}
        isNextUnlocked={isActivityCompleted || isAllCompleted}
      />
    </div>
  );
};
