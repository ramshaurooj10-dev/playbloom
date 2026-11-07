import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Volume2, Star as StarIcon, Sparkles } from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { ActivityBottomNav } from './ActivityBottomNav';

interface BuildHealthyPlateProps {
  onCollectStar: () => void;
  onNavigateHome?: () => void;
  onNavigateNext?: () => void;
  onNavigatePrev?: () => void;
  isActivityCompleted?: boolean;
}

export interface PlateFoodItem {
  id: string;
  name: string;
  emoji: string;
  tapPhrase: string;
  rejectPhrase?: string;
  isHealthy: boolean;
  typeGroup: 'fruit' | 'vegetable' | 'protein' | 'grain' | 'drink' | 'treat';
}

export interface FoodInstance extends PlateFoodItem {
  instanceId: string;
  isOnPlate: boolean;
}

// 1. HEALTHY EVERYDAY FOOD POOL (NO BEANS, NO TOMATO, CARROT INCLUDED)
const HEALTHY_POOL: PlateFoodItem[] = [
  {
    id: 'apple',
    name: 'Apple',
    emoji: '🍎',
    tapPhrase: 'I am a fruit. I am a healthy everyday choice. Choose me!',
    isHealthy: true,
    typeGroup: 'fruit',
  },
  {
    id: 'carrot',
    name: 'Carrot',
    emoji: '🥕',
    tapPhrase: 'I am a vegetable. I am healthy for every day. Choose me!',
    isHealthy: true,
    typeGroup: 'vegetable',
  },
  {
    id: 'broccoli',
    name: 'Broccoli',
    emoji: '🥦',
    tapPhrase: 'I am a vegetable. I am a healthy everyday choice!',
    isHealthy: true,
    typeGroup: 'vegetable',
  },
  {
    id: 'banana',
    name: 'Banana',
    emoji: '🍌',
    tapPhrase: 'I am a fruit. I am healthy for every day!',
    isHealthy: true,
    typeGroup: 'fruit',
  },
  {
    id: 'egg',
    name: 'Egg',
    emoji: '🥚',
    tapPhrase: 'I am an egg. I can be part of a healthy meal!',
    isHealthy: true,
    typeGroup: 'protein',
  },
  {
    id: 'yogurt',
    name: 'Yogurt',
    emoji: '🥣',
    tapPhrase: 'I am yogurt. I can be part of a healthy meal!',
    isHealthy: true,
    typeGroup: 'protein',
  },
  {
    id: 'bread',
    name: 'Whole-Grain Bread',
    emoji: '🍞',
    tapPhrase: 'I am whole-grain bread. I can be part of a healthy meal!',
    isHealthy: true,
    typeGroup: 'grain',
  },
  {
    id: 'water',
    name: 'Water',
    emoji: '💧',
    tapPhrase: 'I am water. I am a healthy drink for every day!',
    isHealthy: true,
    typeGroup: 'drink',
  },
  {
    id: 'strawberry',
    name: 'Strawberry',
    emoji: '🍓',
    tapPhrase: 'I am a strawberry. I am a healthy fruit for every day. Choose me!',
    isHealthy: true,
    typeGroup: 'fruit',
  },
  {
    id: 'spinach',
    name: 'Spinach',
    emoji: '🥬',
    tapPhrase: 'I am spinach. I am a healthy vegetable for every day. Choose me!',
    isHealthy: true,
    typeGroup: 'vegetable',
  },
  {
    id: 'orange',
    name: 'Orange',
    emoji: '🍊',
    tapPhrase: 'I am an orange. I am a healthy everyday choice. Choose me!',
    isHealthy: true,
    typeGroup: 'fruit',
  },
  {
    id: 'milk',
    name: 'Milk',
    emoji: '🥛',
    tapPhrase: 'I am milk. I am a healthy everyday choice. Choose me!',
    isHealthy: true,
    typeGroup: 'drink',
  },
  {
    id: 'cucumber',
    name: 'Cucumber',
    emoji: '🥒',
    tapPhrase: 'I am a cucumber. I am a healthy vegetable. Choose me!',
    isHealthy: true,
    typeGroup: 'vegetable',
  },
];

// 2. SOMETIMES FOOD POOL (Friendly treat clues)
const SOMETIMES_POOL: PlateFoodItem[] = [
  {
    id: 'pizza',
    name: 'Pizza',
    emoji: '🍕',
    tapPhrase:
      "I am pizza. I am a sometimes food. Don't choose me for your everyday healthy plate.",
    rejectPhrase: "Don't pick me! I am not a healthy choice for your everyday plate.",
    isHealthy: false,
    typeGroup: 'treat',
  },
  {
    id: 'fries',
    name: 'Fries',
    emoji: '🍟',
    tapPhrase: 'I am fries. I am a sometimes food.',
    rejectPhrase: 'Not me! I am a sometimes food.',
    isHealthy: false,
    typeGroup: 'treat',
  },
  {
    id: 'donut',
    name: 'Donut',
    emoji: '🍩',
    tapPhrase: 'I am a donut. I am a sometimes food.',
    rejectPhrase: "Don't pick me! I am a sometimes food.",
    isHealthy: false,
    typeGroup: 'treat',
  },
  {
    id: 'candy',
    name: 'Candy',
    emoji: '🍬',
    tapPhrase: 'I am candy. I am a sometimes food.',
    rejectPhrase: 'Not me! I am a sometimes food.',
    isHealthy: false,
    typeGroup: 'treat',
  },
  {
    id: 'soda',
    name: 'Soda',
    emoji: '🥤',
    tapPhrase: 'I am soda. I am not a healthy everyday drink.',
    rejectPhrase: "Don't pick me! I am not a healthy choice for your everyday plate.",
    isHealthy: false,
    typeGroup: 'treat',
  },
  {
    id: 'chocolate',
    name: 'Chocolate',
    emoji: '🍫',
    tapPhrase: 'I am chocolate. I am a sometimes food.',
    rejectPhrase: 'Not me! I am a sometimes food.',
    isHealthy: false,
    typeGroup: 'treat',
  },
  {
    id: 'ice_cream',
    name: 'Ice Cream',
    emoji: '🍦',
    tapPhrase: 'I am ice cream. I am a sometimes food.',
    rejectPhrase: "Don't pick me! I am a sometimes food.",
    isHealthy: false,
    typeGroup: 'treat',
  },
  {
    id: 'cake',
    name: 'Cake',
    emoji: '🍰',
    tapPhrase: 'I am cake. I am a sometimes food.',
    rejectPhrase: "Don't pick me! I am a sometimes food.",
    isHealthy: false,
    typeGroup: 'treat',
  },
  {
    id: 'cookies',
    name: 'Cookies',
    emoji: '🍪',
    tapPhrase: 'I am cookies. I am a sometimes food.',
    rejectPhrase: 'Not me! I am a sometimes food.',
    isHealthy: false,
    typeGroup: 'treat',
  },
];

// Helper: Fisher-Yates shuffle
function shuffleArray<T>(list: T[]): T[] {
  const arr = [...list];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Generate 8 balanced choices around the plate (4-5 healthy variety + 3-4 sometimes treats)
const generatePlateBoard = (): FoodInstance[] => {
  // Ensure we get a variety of healthy types (e.g. 1 fruit, 1 veg, 1 grain/protein, 1 drink/extra)
  const fruits = HEALTHY_POOL.filter((f) => f.typeGroup === 'fruit');
  const veggies = HEALTHY_POOL.filter((f) => f.typeGroup === 'vegetable');
  const grains = HEALTHY_POOL.filter((f) => f.typeGroup === 'grain');
  const proteins = HEALTHY_POOL.filter((f) => f.typeGroup === 'protein');
  const drinks = HEALTHY_POOL.filter((f) => f.typeGroup === 'drink');

  const pickedHealthy: PlateFoodItem[] = [
    shuffleArray(fruits)[0],
    shuffleArray(veggies)[0],
    shuffleArray([...grains, ...proteins])[0],
    shuffleArray(drinks)[0],
    shuffleArray([...fruits, ...veggies, ...proteins, ...grains])[0],
  ];

  // Remove potential duplicates in healthy selections
  const uniqueHealthy = Array.from(new Set(pickedHealthy.map((f) => f.id)))
    .map((id) => pickedHealthy.find((f) => f.id === id)!)
    .slice(0, 4);

  // Pick 3 sometimes treats
  const pickedSometimes = shuffleArray(SOMETIMES_POOL).slice(0, 4);

  const combined = [...uniqueHealthy, ...pickedSometimes].map((food) => ({
    ...food,
    instanceId: `${food.id}_${Math.random().toString(36).substring(2, 9)}_${Date.now()}`,
    isOnPlate: false,
  }));

  return shuffleArray(combined);
};

export const BuildHealthyPlate: React.FC<BuildHealthyPlateProps> = ({
  onCollectStar,
  onNavigateHome,
  onNavigateNext,
  onNavigatePrev,
  isActivityCompleted = false,
}) => {
  const [foods, setFoods] = useState<FoodInstance[]>(() => generatePlateBoard());
  const [selectedFoodId, setSelectedFoodId] = useState<string | null>(null);
  const [shakingFoodId, setShakingFoodId] = useState<string | null>(null);
  const [isPlateComplete, setIsPlateComplete] = useState(false);

  const plateDropRef = useRef<HTMLDivElement>(null);
  const lastSpokenFoodRef = useRef<string | null>(null);
  const lastSpokenTimeRef = useRef<number>(0);

  // Voice on start: "Let's make a healthy plate!" then "Choose foods for your plate."
  useEffect(() => {
    soundManager.speak("Let's make a healthy plate! Choose foods for your plate.");
  }, []);

  const plateFoods = foods.filter((f) => f.isOnPlate);
  const availableFoods = foods.filter((f) => !f.isOnPlate);

  // Target count of healthy foods to fill the plate (all 4 healthy choices present in the round)
  const totalHealthyCount = foods.filter((f) => f.isHealthy).length;

  // Food tap handler: plays voice clue
  const handleFoodTap = (food: FoodInstance) => {
    if (food.isOnPlate || isPlateComplete) return;

    const now = Date.now();
    if (lastSpokenFoodRef.current !== food.id || now - lastSpokenTimeRef.current > 600) {
      lastSpokenFoodRef.current = food.id;
      lastSpokenTimeRef.current = now;
      soundManager.playPop();
      soundManager.speak(food.tapPhrase);
    }
    setSelectedFoodId(food.instanceId);
  };

  // Attempt to place food on the plate
  const handlePlaceFoodOnPlate = (foodInstanceId: string) => {
    const food = foods.find((f) => f.instanceId === foodInstanceId);
    if (!food || food.isOnPlate || isPlateComplete) return;

    if (food.isHealthy) {
      // HEALTHY FOOD - snaps onto plate
      soundManager.playSuccess();
      soundManager.speak('Great choice!');

      const updatedFoods = foods.map((f) =>
        f.instanceId === foodInstanceId ? { ...f, isOnPlate: true } : f
      );
      setFoods(updatedFoods);
      setSelectedFoodId(null);

      // Check if all healthy foods from the tray are placed on the plate
      const placedCount = updatedFoods.filter((f) => f.isOnPlate && f.isHealthy).length;
      if (placedCount >= totalHealthyCount) {
        setTimeout(() => {
          setIsPlateComplete(true);
          onCollectStar();
          soundManager.playCelebration();
          soundManager.speak('Great job! You made a healthy plate!');
        }, 900);
      }
    } else {
      // SOMETIMES FOOD - Food speaks reject phrase & returns to original position
      soundManager.playError();
      const reject =
        food.rejectPhrase || "Don't pick me! I am not a healthy choice for your everyday plate.";
      soundManager.speak(reject);

      setShakingFoodId(foodInstanceId);
      setTimeout(() => {
        setShakingFoodId(null);
      }, 700);
      setSelectedFoodId(null);
    }
  };

  // Drag End Collision Detection
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, food: FoodInstance) => {
    if (food.isOnPlate || isPlateComplete || !plateDropRef.current) return;

    let clientX = 0;
    let clientY = 0;

    if ('changedTouches' in event && event.changedTouches.length > 0) {
      clientX = event.changedTouches[0].clientX;
      clientY = event.changedTouches[0].clientY;
    } else if ('clientX' in event) {
      clientX = (event as MouseEvent).clientX;
      clientY = (event as MouseEvent).clientY;
    }

    const plateRect = plateDropRef.current.getBoundingClientRect();
    const isInsidePlate =
      clientX >= plateRect.left &&
      clientX <= plateRect.right &&
      clientY >= plateRect.top &&
      clientY <= plateRect.bottom;

    if (isInsidePlate) {
      handlePlaceFoodOnPlate(food.instanceId);
    }
  };

  // Replay
  const handleReplay = () => {
    soundManager.playPop();
    soundManager.speak("Let's make another healthy plate! Choose foods for your plate.");
    setFoods(generatePlateBoard());
    setSelectedFoodId(null);
    setShakingFoodId(null);
    setIsPlateComplete(false);
  };

  // Natural plate positions for placed items (balanced and clean without overlapping)
  const getPlateItemPositionClass = (index: number, total: number) => {
    if (total === 1) return 'col-span-2 row-span-2 place-self-center';
    if (total === 2) return 'place-self-center';
    if (total === 3) {
      if (index === 2) return 'col-span-2 place-self-center';
      return 'place-self-center';
    }
    return 'place-self-center';
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center justify-center p-2 sm:p-4 select-none">
      {/* TOP HEADER: Clean Title & Controls */}
      <div className="w-full flex items-center justify-between bg-white border-4 border-sky-300 rounded-3xl px-4 sm:px-6 py-2.5 shadow-md mb-3">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl sm:text-3xl">🍽️</span>
          <div>
            <h1 className="text-lg sm:text-2xl font-black text-sky-950 tracking-tight leading-none uppercase">
              BUILD MY HEALTHY PLATE
            </h1>
            <p className="text-[11px] sm:text-xs font-bold text-sky-700">
              Listen to the foods and choose healthy everyday choices
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Audio Repeat Button */}
          <button
            type="button"
            onClick={() =>
              soundManager.speak("Let's make a healthy plate! Choose foods for your plate.")
            }
            className="p-2 bg-sky-100 hover:bg-sky-200 border-2 border-sky-300 rounded-2xl text-sky-800 transition-all cursor-pointer shadow-xs active:scale-95"
            title="Repeat instructions"
          >
            <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Replay Button */}
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
            <span>{isActivityCompleted || isPlateComplete ? '⭐ COMPLETED' : '1 STAR'}</span>
          </div>
        </div>
      </div>

      {/* MAIN ACTIVITY STAGE */}
      {!isPlateComplete ? (
        <div className="w-full flex flex-col items-center">
          {/* LARGE CLEAN EMPTY PLATE (CENTER VISUAL FOCUS - NO HINTS, NO DRAWN SECTIONS, NO GHOST LABELS) */}
          <div className="w-full flex flex-col items-center justify-center mb-4">
            <div
              ref={plateDropRef}
              className="relative w-[290px] h-[290px] sm:w-[360px] sm:h-[360px] md:w-[390px] md:h-[390px] rounded-full bg-gradient-to-b from-slate-50 via-white to-slate-100 border-[12px] sm:border-[16px] border-slate-200/90 shadow-2xl p-4 sm:p-6 flex flex-col items-center justify-center ring-8 ring-sky-200/60"
            >
              {plateFoods.length === 0 ? (
                /* Completely Empty Plate Placeholder text */
                <div className="flex flex-col items-center justify-center text-center p-4">
                  <span className="text-4xl sm:text-5xl opacity-40 mb-2">🍽️</span>
                  <p className="text-xs sm:text-sm font-black text-slate-400 uppercase tracking-wide max-w-[200px]">
                    Your plate is empty. Choose healthy foods to build your meal!
                  </p>
                </div>
              ) : (
                /* Foods Settled Naturally on Plate (Grid of natural plate placements) */
                <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-3 p-2 items-center justify-center">
                  <AnimatePresence>
                    {plateFoods.map((food, idx) => (
                      <motion.div
                        key={food.instanceId}
                        initial={{ scale: 0.2, opacity: 0, y: -20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.2, opacity: 0 }}
                        transition={{ type: 'spring', damping: 18, stiffness: 220 }}
                        className={`flex flex-col items-center justify-center p-2.5 sm:p-3 bg-white/95 rounded-3xl border-3 border-sky-300 shadow-md ${getPlateItemPositionClass(
                          idx,
                          plateFoods.length
                        )}`}
                      >
                        <span className="text-3xl sm:text-5xl mb-0.5 filter drop-shadow-xs">
                          {food.emoji}
                        </span>
                        <span className="text-[11px] sm:text-xs font-black text-slate-800 text-center leading-tight">
                          {food.name}
                        </span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}

              {/* Tap to Place Button when a food is selected */}
              {selectedFoodId && (
                <div className="absolute -bottom-4 z-30">
                  <button
                    type="button"
                    onClick={() => handlePlaceFoodOnPlate(selectedFoodId)}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-black py-2 px-5 rounded-full border-b-4 border-emerald-700 shadow-xl active:translate-y-0.5 transition-all text-xs uppercase tracking-wide cursor-pointer flex items-center gap-1.5 animate-pulse"
                  >
                    <span>Place on Plate ➔</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* FOOD SELECTION TRAY: Arranged Around / Below the Plate */}
          <div className="w-full bg-white/95 border-4 border-amber-300 rounded-3xl p-3.5 sm:p-5 shadow-xl flex flex-col items-center">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-base sm:text-lg">👆</span>
              <p className="text-xs sm:text-sm font-black text-slate-700 uppercase tracking-wide">
                Tap food to listen • Drag or tap to place on your plate
              </p>
            </div>

            {/* Grid of Food Choices (STATIC while waiting - no continuous bouncing/floating) */}
            <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5 max-w-3xl">
              <AnimatePresence>
                {availableFoods.map((food) => {
                  const isSelected = selectedFoodId === food.instanceId;
                  const isShaking = shakingFoodId === food.instanceId;

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
                      animate={
                        isShaking
                          ? { x: [-10, 10, -8, 8, 0] }
                          : isSelected
                          ? { scale: 1.05 }
                          : { scale: 1 }
                      }
                      transition={{ duration: 0.3 }}
                      className={`relative flex flex-col items-center justify-center p-2.5 sm:p-3.5 rounded-2xl border-4 cursor-grab active:cursor-grabbing select-none transition-all shadow-md touch-none ${
                        isSelected
                          ? 'bg-amber-100 border-amber-500 ring-4 ring-amber-300 shadow-xl'
                          : isShaking
                          ? 'bg-rose-50 border-rose-400 ring-4 ring-rose-200'
                          : 'bg-gradient-to-b from-white to-slate-50 border-slate-200 hover:border-amber-400 hover:shadow-lg'
                      }`}
                    >
                      {/* Food Emoji */}
                      <span className="text-4xl sm:text-5xl mb-1 filter drop-shadow-xs">
                        {food.emoji}
                      </span>

                      {/* Food Name */}
                      <span className="text-xs sm:text-sm font-black text-slate-800 tracking-tight text-center">
                        {food.name}
                      </span>

                      {/* Speaker Prompt Icon */}
                      <div className="absolute top-1.5 right-1.5 p-1 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
                        <Volume2 className="w-3 h-3" />
                      </div>

                      {/* Selected Badge */}
                      {isSelected && (
                        <div className="absolute -bottom-2 bg-amber-500 text-white font-black text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
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
        /* COMPLETION SCREEN: Show Completed Colorful Healthy Plate */
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-2xl bg-white border-4 border-sky-400 rounded-3xl p-6 sm:p-8 shadow-2xl text-center flex flex-col items-center my-4"
        >
          {/* Completed Plate Showcase */}
          <div className="w-24 h-24 bg-gradient-to-br from-amber-100 via-sky-100 to-emerald-100 border-4 border-sky-400 rounded-full flex items-center justify-center text-5xl shadow-inner mb-4">
            🍽️
          </div>

          <div className="inline-flex items-center gap-1.5 bg-amber-100 border-2 border-amber-300 px-4 py-1.5 rounded-full text-amber-900 font-black text-sm uppercase mb-2">
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span>Plate Completed!</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-sky-950 tracking-tight uppercase mb-2">
            Great Job!
          </h2>

          <p className="text-base sm:text-lg font-bold text-sky-900 mb-4 max-w-md">
            You made a healthy plate! You chose healthy everyday foods for a wonderful meal!
          </p>

          {/* List of Placed Foods */}
          <div className="w-full flex flex-wrap items-center justify-center gap-2 mb-6">
            {plateFoods.map((f) => (
              <span
                key={f.instanceId}
                className="bg-emerald-100 border-2 border-emerald-300 text-emerald-950 text-xs font-black px-3 py-1.5 rounded-full shadow-xs flex items-center gap-1.5"
              >
                <span>{f.emoji}</span>
                <span>{f.name}</span>
              </span>
            ))}
          </div>

          <button
            type="button"
            onClick={handleReplay}
            className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-black text-lg py-3.5 px-8 rounded-2xl border-b-6 border-sky-700 shadow-lg active:translate-y-1 transition-all cursor-pointer uppercase tracking-wider"
          >
            <RotateCcw className="w-5 h-5 stroke-[2.5]" />
            <span>Build Another Plate</span>
          </button>
        </motion.div>
      )}

      {/* STANDARD BOTTOM NAVIGATION: [ PREV ] [ HOME ] [ NEXT ] */}
      <ActivityBottomNav
        onNavigatePrev={onNavigatePrev}
        onNavigateHome={onNavigateHome}
        onNavigateNext={onNavigateNext}
        isNextUnlocked={isActivityCompleted || isPlateComplete}
      />
    </div>
  );
};
