import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, RotateCcw, Volume2, Star as StarIcon, ArrowLeft, ArrowRight, Home, Check, Trophy, Heart } from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface AnimalFoodMatchProps {
  onCollectStar: () => void;
  onNavigateHome?: () => void;
  onNavigateNext?: () => void;
  onNavigatePrev?: () => void;
  isActivityCompleted?: boolean;
}

export interface AnimalData {
  id: string;
  name: string;
  emoji: string;
  foodId: string;
  foodName: string;
  foodEmoji: string;
  bgGradient: string;
  borderColor: string;
  idleAnim?: any;
  speechHint: string;
}

export interface FoodData {
  id: string;
  name: string;
  emoji: string;
  animalId: string;
  animalName: string;
  bgGradient: string;
  borderColor: string;
  speechHint: string;
}

export interface MatchLevelConfig {
  levelNumber: number;
  title: string;
  subtitle: string;
  badgeEmoji: string;
  themeColor: string;
  pairs: AnimalData[];
}

const LEVEL_CONFIGS: MatchLevelConfig[] = [
  {
    levelNumber: 1,
    title: 'Level 1: Friendly Pets',
    subtitle: 'Match 4 cute pet friends with their favorite foods!',
    badgeEmoji: '🐶',
    themeColor: 'from-amber-400 to-orange-400',
    pairs: [
      {
        id: 'monkey',
        name: 'Monkey',
        emoji: '🐵',
        foodId: 'banana',
        foodName: 'Banana',
        foodEmoji: '🍌',
        bgGradient: 'from-amber-100 to-amber-200',
        borderColor: 'border-amber-400',
        idleAnim: { y: [-2, 2, -2], rotate: [-2, 2, -2] },
        speechHint: 'I am a playful monkey! I love yellow bananas!',
      },
      {
        id: 'rabbit',
        name: 'Rabbit',
        emoji: '🐰',
        foodId: 'carrot',
        foodName: 'Carrot',
        foodEmoji: '🥕',
        bgGradient: 'from-orange-100 to-amber-100',
        borderColor: 'border-orange-400',
        idleAnim: { scaleY: [1, 1.05, 1], y: [-2, 2, -2] },
        speechHint: 'Hop hop! I am a bunny rabbit! I love crunchy carrots!',
      },
      {
        id: 'cat',
        name: 'Cat',
        emoji: '🐱',
        foodId: 'milk',
        foodName: 'Milk',
        foodEmoji: '🥛',
        bgGradient: 'from-sky-100 to-blue-100',
        borderColor: 'border-sky-400',
        idleAnim: { x: [-2, 2, -2], rotate: [-2, 2, -2] },
        speechHint: 'Meow! I am a sweet cat! I love drinking fresh milk!',
      },
      {
        id: 'dog',
        name: 'Dog',
        emoji: '🐶',
        foodId: 'bone',
        foodName: 'Bone',
        foodEmoji: '🦴',
        bgGradient: 'from-yellow-100 to-orange-100',
        borderColor: 'border-yellow-400',
        idleAnim: { rotate: [-2, 2, -2], y: [-2, 2, -2] },
        speechHint: 'Woof woof! I am a friendly dog! I love yummy bones!',
      },
    ],
  },
  {
    levelNumber: 2,
    title: 'Level 2: Farm & Forest',
    subtitle: 'Help 5 farm and forest animals find their tasty meals!',
    badgeEmoji: '🦁',
    themeColor: 'from-emerald-400 to-teal-500',
    pairs: [
      {
        id: 'lion',
        name: 'Lion',
        emoji: '🦁',
        foodId: 'meat',
        foodName: 'Meat',
        foodEmoji: '🥩',
        bgGradient: 'from-red-100 to-rose-200',
        borderColor: 'border-red-400',
        idleAnim: { scale: [1, 1.03, 1], y: [-1, 1, -1] },
        speechHint: 'Roar! I am the king lion! I eat fresh meat!',
      },
      {
        id: 'bear',
        name: 'Bear',
        emoji: '🐻',
        foodId: 'honey',
        foodName: 'Honey',
        foodEmoji: '🍯',
        bgGradient: 'from-yellow-100 to-amber-200',
        borderColor: 'border-amber-400',
        idleAnim: { y: [-2, 2, -2], rotate: [-1, 1, -1] },
        speechHint: 'Grrr! I am a big bear! I love sweet golden honey!',
      },
      {
        id: 'cow',
        name: 'Cow',
        emoji: '🐮',
        foodId: 'grass',
        foodName: 'Fresh Grass',
        foodEmoji: '🌿',
        bgGradient: 'from-emerald-100 to-green-200',
        borderColor: 'border-emerald-400',
        idleAnim: { x: [-1, 1, -1], scaleY: [1, 1.02, 1] },
        speechHint: 'Moo! I am a farm cow! I love green grass!',
      },
      {
        id: 'mouse',
        name: 'Mouse',
        emoji: '🐭',
        foodId: 'cheese',
        foodName: 'Cheese',
        foodEmoji: '🧀',
        bgGradient: 'from-amber-100 to-yellow-200',
        borderColor: 'border-yellow-400',
        idleAnim: { y: [-3, 3, -3] },
        speechHint: 'Squeak squeak! I am a tiny mouse! I love yellow cheese!',
      },
      {
        id: 'horse',
        name: 'Horse',
        emoji: '🐴',
        foodId: 'hay',
        foodName: 'Golden Hay',
        foodEmoji: '🌾',
        bgGradient: 'from-orange-100 to-amber-200',
        borderColor: 'border-orange-400',
        idleAnim: { rotate: [-1, 1, -1], y: [-2, 2, -2] },
        speechHint: 'Neigh! I am a fast horse! I love golden hay!',
      },
    ],
  },
  {
    levelNumber: 3,
    title: 'Level 3: Safari & Nature',
    subtitle: 'Master 5 wild safari and nature animal food matches!',
    badgeEmoji: '🐼',
    themeColor: 'from-purple-400 to-indigo-500',
    pairs: [
      {
        id: 'panda',
        name: 'Panda',
        emoji: '🐼',
        foodId: 'bamboo',
        foodName: 'Bamboo',
        foodEmoji: '🎋',
        bgGradient: 'from-emerald-100 to-teal-200',
        borderColor: 'border-emerald-400',
        idleAnim: { y: [-2, 2, -2], rotate: [-1, 1, -1] },
        speechHint: 'Hi! I am a cute panda! I munch on green bamboo stalks!',
      },
      {
        id: 'frog',
        name: 'Frog',
        emoji: '🐸',
        foodId: 'fly',
        foodName: 'Fly',
        foodEmoji: '🪰',
        bgGradient: 'from-lime-100 to-green-200',
        borderColor: 'border-lime-400',
        idleAnim: { scaleY: [1, 1.08, 1], y: [-3, 3, -3] },
        speechHint: 'Ribbit! I am a jumping frog! I catch flying bugs!',
      },
      {
        id: 'squirrel',
        name: 'Squirrel',
        emoji: '🐿️',
        foodId: 'nut',
        foodName: 'Acorn Nut',
        foodEmoji: '🌰',
        bgGradient: 'from-amber-100 to-orange-200',
        borderColor: 'border-amber-400',
        idleAnim: { rotate: [-2, 2, -2], y: [-2, 2, -2] },
        speechHint: 'Chitter chitter! I am a squirrel! I collect crunchy acorn nuts!',
      },
      {
        id: 'penguin',
        name: 'Penguin',
        emoji: '🐧',
        foodId: 'fish',
        foodName: 'Little Fish',
        foodEmoji: '🐟',
        bgGradient: 'from-sky-100 to-cyan-200',
        borderColor: 'border-sky-400',
        idleAnim: { x: [-2, 2, -2], rotate: [-2, 2, -2] },
        speechHint: 'Waddle waddle! I am a polar penguin! I swim and catch little fish!',
      },
      {
        id: 'elephant',
        name: 'Elephant',
        emoji: '🐘',
        foodId: 'leaves',
        foodName: 'Big Leaves',
        foodEmoji: '🍃',
        bgGradient: 'from-slate-100 to-emerald-100',
        borderColor: 'border-teal-400',
        idleAnim: { scale: [1, 1.03, 1], y: [-1, 1, -1] },
        speechHint: 'Pawoo! I am a mighty elephant! I love fresh green tree leaves!',
      },
    ],
  },
];

// Helper to shuffle arrays
function shuffleList<T>(list: readonly T[]): T[] {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export const AnimalFoodMatch: React.FC<AnimalFoodMatchProps> = ({
  onCollectStar,
  onNavigateHome,
  onNavigateNext,
  onNavigatePrev,
  isActivityCompleted,
}) => {
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [selectedAnimalId, setSelectedAnimalId] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Set<string>>(new Set());
  const [wrongSelection, setWrongSelection] = useState<{ animalId?: string; foodId?: string } | null>(null);
  const [shuffledFoods, setShuffledFoods] = useState<FoodData[]>([]);
  const [showLevelCelebration, setShowLevelCelebration] = useState(false);
  const [completedLevels, setCompletedLevels] = useState<Set<number>>(new Set());
  const [isSuccessShake, setIsSuccessShake] = useState<string | null>(null);

  const activeLevelConfig = LEVEL_CONFIGS[currentLevel - 1] || LEVEL_CONFIGS[0];

  // Initialize foods and reset level state
  const startLevel = useCallback((lvlNum: number) => {
    const config = LEVEL_CONFIGS[lvlNum - 1] || LEVEL_CONFIGS[0];
    const foodList: FoodData[] = config.pairs.map((animal) => ({
      id: animal.foodId,
      name: animal.foodName,
      emoji: animal.foodEmoji,
      animalId: animal.id,
      animalName: animal.name,
      bgGradient: animal.bgGradient,
      borderColor: animal.borderColor,
      speechHint: animal.speechHint,
    }));

    // Ensure food order is thoroughly shuffled and different from animal order
    let shuffled = shuffleList(foodList);
    if (shuffled.length > 1 && shuffled.every((f, idx) => f.animalId === config.pairs[idx].id)) {
      shuffled = [...shuffled.slice(1), shuffled[0]];
    }

    setShuffledFoods(shuffled);
    setSelectedAnimalId(null);
    setMatchedPairs(new Set());
    setWrongSelection(null);
    setShowLevelCelebration(false);
  }, []);

  // Set up initial level on mount or level switch
  useEffect(() => {
    startLevel(currentLevel);
    soundManager.speak(`Level ${currentLevel}! Match each animal to what it eats!`);
  }, [currentLevel, startLevel]);

  // Handle Animal click
  const handleSelectAnimal = (animal: AnimalData) => {
    if (matchedPairs.has(animal.id)) return;

    soundManager.playPop();
    soundManager.speak(animal.name);
    setSelectedAnimalId(animal.id);
    setWrongSelection(null);
  };

  // Handle Food click
  const handleSelectFood = (food: FoodData) => {
    if (matchedPairs.has(food.animalId)) return;

    soundManager.playPop();

    if (!selectedAnimalId) {
      soundManager.speak(`That's ${food.name}! Tap an animal first!`);
      return;
    }

    const currentAnimal = activeLevelConfig.pairs.find((a) => a.id === selectedAnimalId);
    if (!currentAnimal) return;

    // Check if match is correct
    if (food.animalId === selectedAnimalId) {
      soundManager.playMunch();
      soundManager.playSuccess();
      soundManager.speak(`Yummy! The ${currentAnimal.name} eats ${food.name}!`);

      const nextMatched = new Set(matchedPairs);
      nextMatched.add(selectedAnimalId);
      setMatchedPairs(nextMatched);
      setIsSuccessShake(selectedAnimalId);
      setTimeout(() => setIsSuccessShake(null), 800);
      setSelectedAnimalId(null);

      // Check if all pairs in this level are matched
      if (nextMatched.size === activeLevelConfig.pairs.length) {
        soundManager.playCelebration();
        setCompletedLevels((prev) => new Set(prev).add(currentLevel));
        onCollectStar();
        setTimeout(() => {
          setShowLevelCelebration(true);
        }, 600);
      }
    } else {
      // Incorrect match feedback
      soundManager.playPop();
      soundManager.speak(`Oops! The ${currentAnimal.name} does not eat ${food.name}. Try again!`);
      setWrongSelection({ animalId: selectedAnimalId, foodId: food.id });
      setTimeout(() => {
        setWrongSelection(null);
      }, 700);
    }
  };

  const handleNextLevel = () => {
    soundManager.playPop();
    if (currentLevel < LEVEL_CONFIGS.length) {
      setCurrentLevel(currentLevel + 1);
    } else {
      setCurrentLevel(1);
    }
  };

  const handleRestartLevel = () => {
    soundManager.playPop();
    startLevel(currentLevel);
  };

  return (
    <div
      id="animal-food-fun-activity"
      className="w-full max-w-5xl mx-auto flex flex-col items-center justify-between p-2 sm:p-4 min-h-[calc(100vh-120px)] select-none relative overflow-hidden"
    >
      {/* Preschool Animated Canvas Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#BAE6FD] via-[#E0F2FE] to-[#DCFCE7] -z-20" />

      {/* Floating Decorative Scenery */}
      <div className="absolute top-2 left-6 text-4xl sm:text-5xl animate-spin-slow pointer-events-none -z-10">☀️</div>
      <div className="absolute top-4 right-8 text-4xl sm:text-5xl opacity-80 animate-pulse pointer-events-none -z-10">☁️</div>
      <div className="absolute top-10 left-1/4 text-3xl opacity-70 animate-bounce delay-150 pointer-events-none -z-10">☁️</div>
      <div className="absolute top-3 right-1/3 text-4xl opacity-90 pointer-events-none -z-10">🌈</div>

      {/* Top Banner & Level Selector Card */}
      <div className="w-full max-w-4xl bg-white/95 rounded-3xl border-4 border-amber-300 shadow-lg p-3 sm:p-4 mb-3 flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#06B6D4] border-2 border-white flex items-center justify-center text-2xl text-white shadow-md">
              🐾
            </div>
            <div className="text-left">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight">
                Animal Food Fun
              </h1>
              <p className="text-xs sm:text-sm font-bold text-teal-800">
                {activeLevelConfig.subtitle}
              </p>
            </div>
          </div>

          {/* Level Switcher Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            {LEVEL_CONFIGS.map((lvl) => {
              const isActive = lvl.levelNumber === currentLevel;
              const isDone = completedLevels.has(lvl.levelNumber);
              return (
                <button
                  key={lvl.levelNumber}
                  type="button"
                  onClick={() => {
                    soundManager.playPop();
                    setCurrentLevel(lvl.levelNumber);
                  }}
                  className={`px-3 py-1.5 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer border-b-4 ${
                    isActive
                      ? 'bg-amber-500 text-white border-amber-700 shadow-md scale-105 ring-2 ring-amber-300'
                      : isDone
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200'
                      : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                  }`}
                >
                  <span>{lvl.badgeEmoji}</span>
                  <span>Level {lvl.levelNumber}</span>
                  {isDone && <Check className="w-4 h-4 text-emerald-600 ml-0.5" />}
                </button>
              );
            })}

            <button
              type="button"
              onClick={handleRestartLevel}
              className="flex items-center gap-1 bg-purple-500 hover:bg-purple-600 text-white font-black px-3 py-1.5 rounded-2xl border-b-4 border-purple-800 shadow-md active:translate-y-1 transition-all cursor-pointer text-xs uppercase ml-1"
              title="Restart Level"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Progress Bar & Instructions */}
        <div className="w-full bg-slate-100 rounded-full h-3.5 p-0.5 border-2 border-slate-200 flex items-center overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-teal-400 via-emerald-400 to-amber-400 rounded-full transition-all duration-300"
            style={{
              width: `${(matchedPairs.size / activeLevelConfig.pairs.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Main Matching Playfield */}
      <div className="w-full max-w-4xl flex-1 flex flex-col md:flex-row items-center justify-center gap-6 sm:gap-10 my-2">
        {/* Left Column: Animals */}
        <div className="w-full md:w-1/2 flex flex-col gap-3">
          <div className="flex items-center justify-between px-2">
            <span className="text-sm sm:text-base font-black text-slate-800 flex items-center gap-1.5 uppercase">
              <span>🐾</span>
              <span>1. Choose Animal</span>
            </span>
            <span className="text-xs font-bold text-teal-700">
              {matchedPairs.size}/{activeLevelConfig.pairs.length} Matched
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {activeLevelConfig.pairs.map((animal) => {
              const isSelected = selectedAnimalId === animal.id;
              const isMatched = matchedPairs.has(animal.id);
              const isWrong = wrongSelection?.animalId === animal.id;

              return (
                <motion.button
                  key={animal.id}
                  type="button"
                  whileHover={!isMatched ? { scale: 1.03 } : {}}
                  whileTap={!isMatched ? { scale: 0.96 } : {}}
                  animate={
                    isWrong
                      ? { x: [-8, 8, -8, 8, 0] }
                      : isSuccessShake === animal.id
                      ? { scale: [1, 1.15, 1], rotate: [-4, 4, 0] }
                      : {}
                  }
                  transition={{ duration: 0.3 }}
                  onClick={() => handleSelectAnimal(animal)}
                  disabled={isMatched}
                  className={`relative p-3 sm:p-4 rounded-3xl border-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all shadow-md overflow-hidden ${
                    isMatched
                      ? 'bg-emerald-50 border-emerald-400 opacity-60 cursor-default scale-95 shadow-none'
                      : isSelected
                      ? 'bg-amber-100 border-amber-500 ring-4 ring-amber-300 shadow-xl scale-105'
                      : `${animal.bgGradient} ${animal.borderColor} hover:shadow-lg`
                  }`}
                >
                  {isMatched && (
                    <div className="absolute top-2 right-2 bg-emerald-500 text-white rounded-full p-1 shadow">
                      <Check className="w-4 h-4" />
                    </div>
                  )}

                  <span className="text-4xl sm:text-5xl drop-shadow-sm select-none">
                    {animal.emoji}
                  </span>

                  <span className="font-black text-sm sm:text-base text-slate-800 uppercase tracking-tight">
                    {animal.name}
                  </span>

                  {isSelected && (
                    <span className="text-[10px] font-black uppercase tracking-wider bg-amber-500 text-white px-2 py-0.5 rounded-full animate-pulse">
                      Selected
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Foods */}
        <div className="w-full md:w-1/2 flex flex-col gap-3">
          <div className="flex items-center justify-between px-2">
            <span className="text-sm sm:text-base font-black text-slate-800 flex items-center gap-1.5 uppercase">
              <span>🍽️</span>
              <span>2. Pick Favorite Food</span>
            </span>
            <span className="text-xs font-bold text-amber-700">
              {selectedAnimalId ? 'Ready to Match!' : 'Tap an animal first'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {shuffledFoods.map((food) => {
              const isMatched = matchedPairs.has(food.animalId);
              const isWrong = wrongSelection?.foodId === food.id;

              return (
                <motion.button
                  key={food.id}
                  type="button"
                  whileHover={!isMatched ? { scale: 1.03 } : {}}
                  whileTap={!isMatched ? { scale: 0.96 } : {}}
                  animate={isWrong ? { x: [-8, 8, -8, 8, 0] } : {}}
                  transition={{ duration: 0.3 }}
                  onClick={() => handleSelectFood(food)}
                  disabled={isMatched}
                  className={`relative p-3 sm:p-4 rounded-3xl border-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all shadow-md overflow-hidden ${
                    isMatched
                      ? 'bg-emerald-50 border-emerald-400 opacity-60 cursor-default scale-95 shadow-none'
                      : isWrong
                      ? 'bg-rose-100 border-rose-400 ring-2 ring-rose-300'
                      : `${food.bgGradient} ${food.borderColor} hover:shadow-lg`
                  }`}
                >
                  {isMatched && (
                    <div className="absolute top-2 right-2 bg-emerald-500 text-white rounded-full p-1 shadow">
                      <Check className="w-4 h-4" />
                    </div>
                  )}

                  <span className="text-4xl sm:text-5xl drop-shadow-sm select-none">
                    {food.emoji}
                  </span>

                  <span className="font-black text-sm sm:text-base text-slate-800 uppercase tracking-tight">
                    {food.name}
                  </span>

                  {isMatched && (
                    <span className="text-[10px] font-bold text-emerald-800">
                      For {food.animalName}!
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Level Completion Celebration Modal */}
      <AnimatePresence>
        {showLevelCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              className="bg-white rounded-3xl border-8 border-amber-400 shadow-2xl p-6 sm:p-8 max-w-md w-full flex flex-col items-center text-center relative overflow-hidden"
            >
              <div className="text-6xl sm:text-7xl mb-3 animate-bounce">🎉</div>
              <div className="flex gap-2 mb-3">
                {[...Array(currentLevel)].map((_, i) => (
                  <StarIcon key={i} className="w-8 h-8 text-amber-400 fill-amber-400 animate-pulse" />
                ))}
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-tight mb-2">
                Level {currentLevel} Completed!
              </h2>

              <p className="text-slate-600 font-bold text-sm sm:text-base mb-6">
                Super job! You matched all the {activeLevelConfig.title.toLowerCase()} with their favorite foods!
              </p>

              <div className="flex flex-col sm:flex-row gap-3 w-full">
                {currentLevel < LEVEL_CONFIGS.length ? (
                  <button
                    type="button"
                    onClick={handleNextLevel}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-black py-3 px-4 rounded-2xl border-b-4 border-emerald-700 shadow-lg active:translate-y-1 transition-all cursor-pointer flex items-center justify-center gap-2 text-base uppercase"
                  >
                    <span>Play Level {currentLevel + 1}</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      if (onNavigateNext) onNavigateNext();
                      else if (onNavigateHome) onNavigateHome();
                    }}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-black py-3 px-4 rounded-2xl border-b-4 border-emerald-700 shadow-lg active:translate-y-1 transition-all cursor-pointer flex items-center justify-center gap-2 text-base uppercase"
                  >
                    <span>All Levels Done!</span>
                    <Trophy className="w-5 h-5" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleRestartLevel}
                  className="bg-amber-100 hover:bg-amber-200 text-amber-900 font-black py-3 px-4 rounded-2xl border-b-4 border-amber-300 shadow active:translate-y-1 transition-all cursor-pointer flex items-center justify-center gap-1.5 text-sm uppercase"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Replay</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation Bar */}
      <div className="w-full max-w-3xl flex items-center justify-between mt-3 pt-2 border-t-2 border-slate-200/80">
        <button
          type="button"
          onClick={() => {
            soundManager.playPop();
            if (onNavigatePrev) onNavigatePrev();
          }}
          className="flex items-center gap-2 bg-white/90 hover:bg-white text-slate-700 font-black px-4 py-2 rounded-2xl border-2 border-slate-300 shadow-sm active:translate-y-0.5 transition-all cursor-pointer text-xs sm:text-sm uppercase"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <button
          type="button"
          onClick={() => {
            soundManager.playPop();
            if (onNavigateHome) onNavigateHome();
          }}
          className="flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-amber-950 font-black px-5 py-2.5 rounded-2xl border-b-4 border-amber-600 shadow-md active:translate-y-1 transition-all cursor-pointer text-xs sm:text-sm uppercase"
        >
          <Home className="w-4 h-4" />
          <span>Home</span>
        </button>

        <button
          type="button"
          onClick={() => {
            soundManager.playPop();
            if (onNavigateNext) onNavigateNext();
          }}
          className="flex items-center gap-2 bg-white/90 hover:bg-white text-slate-700 font-black px-4 py-2 rounded-2xl border-2 border-slate-300 shadow-sm active:translate-y-0.5 transition-all cursor-pointer text-xs sm:text-sm uppercase"
        >
          <span>Next</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
