import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Volume2, Star as StarIcon, Sparkles, Check, Heart } from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { ActivityBottomNav } from './ActivityBottomNav';
import { PremiumCardIllustration } from '../common/PremiumCardIllustration';

interface FeedAnimalProps {
  onCollectStar: () => void;
  onNavigateHome?: () => void;
  onNavigateNext?: () => void;
  onNavigatePrev?: () => void;
  isActivityCompleted?: boolean;
}

export type AnimalId =
  | 'rabbit'
  | 'cow'
  | 'monkey'
  | 'lion'
  | 'bird'
  | 'fish'
  | 'elephant'
  | 'giraffe'
  | 'cat'
  | 'ant'
  | 'squirrel'
  | 'bee'
  | 'frog'
  | 'chicken'
  | 'panda'
  | 'koala';

export type FoodId =
  | 'carrot'
  | 'grass'
  | 'banana'
  | 'meat'
  | 'seeds'
  | 'fish_food'
  | 'leaves'
  | 'cake'
  | 'fish'
  | 'milk'
  | 'sweets'
  | 'nut'
  | 'flower'
  | 'fly'
  | 'grains'
  | 'bamboo';

interface FoodItem {
  id: FoodId;
  name: string;
  emoji: string;
  tapSpeech: string;
  color: string;
  borderColor: string;
  bgColor: string;
}

interface AnimalConfig {
  id: AnimalId;
  name: string;
  emoji: string;
  title: string;
  correctFood: FoodId;
  wrongFoods: [FoodId, FoodId];
  voiceIntro: string;
  themeColor: string;
  cardBg: string;
  foodDishName: string;
}

const FOOD_REGISTRY: Record<FoodId, FoodItem> = {
  carrot: {
    id: 'carrot',
    name: 'Carrot',
    emoji: '🥕',
    tapSpeech: 'I am a carrot.',
    color: 'text-orange-600',
    borderColor: 'border-orange-300',
    bgColor: 'bg-orange-50 hover:bg-orange-100/80',
  },
  grass: {
    id: 'grass',
    name: 'Grass',
    emoji: '🌿',
    tapSpeech: 'I am grass.',
    color: 'text-emerald-600',
    borderColor: 'border-emerald-300',
    bgColor: 'bg-emerald-50 hover:bg-emerald-100/80',
  },
  banana: {
    id: 'banana',
    name: 'Banana',
    emoji: '🍌',
    tapSpeech: 'I am a banana.',
    color: 'text-amber-600',
    borderColor: 'border-amber-300',
    bgColor: 'bg-amber-50 hover:bg-amber-100/80',
  },
  meat: {
    id: 'meat',
    name: 'Meat',
    emoji: '🥩',
    tapSpeech: 'I am meat.',
    color: 'text-rose-600',
    borderColor: 'border-rose-300',
    bgColor: 'bg-rose-50 hover:bg-rose-100/80',
  },
  seeds: {
    id: 'seeds',
    name: 'Seeds',
    emoji: '🌾',
    tapSpeech: 'I am seeds.',
    color: 'text-yellow-700',
    borderColor: 'border-yellow-300',
    bgColor: 'bg-yellow-50 hover:bg-yellow-100/80',
  },
  fish_food: {
    id: 'fish_food',
    name: 'Fish Food',
    emoji: '🥣',
    tapSpeech: 'I am fish food.',
    color: 'text-cyan-600',
    borderColor: 'border-cyan-300',
    bgColor: 'bg-cyan-50 hover:bg-cyan-100/80',
  },
  leaves: {
    id: 'leaves',
    name: 'Leaves',
    emoji: '🍃',
    tapSpeech: 'I am leaves.',
    color: 'text-lime-600',
    borderColor: 'border-lime-300',
    bgColor: 'bg-lime-50 hover:bg-lime-100/80',
  },
  cake: {
    id: 'cake',
    name: 'Cake',
    emoji: '🍰',
    tapSpeech: 'I am cake.',
    color: 'text-pink-600',
    borderColor: 'border-pink-300',
    bgColor: 'bg-pink-50 hover:bg-pink-100/80',
  },
  fish: {
    id: 'fish',
    name: 'Fish',
    emoji: '🐟',
    tapSpeech: 'I am a fish.',
    color: 'text-blue-600',
    borderColor: 'border-blue-300',
    bgColor: 'bg-blue-50 hover:bg-blue-100/80',
  },
  milk: {
    id: 'milk',
    name: 'Milk',
    emoji: '🥛',
    tapSpeech: 'I am milk.',
    color: 'text-sky-600',
    borderColor: 'border-sky-300',
    bgColor: 'bg-sky-50 hover:bg-sky-100/80',
  },
  sweets: {
    id: 'sweets',
    name: 'Sweets',
    emoji: '🍬',
    tapSpeech: 'I am sweets.',
    color: 'text-pink-600',
    borderColor: 'border-pink-300',
    bgColor: 'bg-pink-50 hover:bg-pink-100/80',
  },
  nut: {
    id: 'nut',
    name: 'Nut',
    emoji: '🌰',
    tapSpeech: 'I am a nut.',
    color: 'text-amber-700',
    borderColor: 'border-amber-300',
    bgColor: 'bg-amber-50 hover:bg-amber-100/80',
  },
  flower: {
    id: 'flower',
    name: 'Flower',
    emoji: '🌸',
    tapSpeech: 'I am a flower.',
    color: 'text-rose-600',
    borderColor: 'border-rose-300',
    bgColor: 'bg-rose-50 hover:bg-rose-100/80',
  },
  fly: {
    id: 'fly',
    name: 'Fly',
    emoji: '🪰',
    tapSpeech: 'I am a fly.',
    color: 'text-emerald-700',
    borderColor: 'border-emerald-300',
    bgColor: 'bg-emerald-50 hover:bg-emerald-100/80',
  },
  grains: {
    id: 'grains',
    name: 'Grains',
    emoji: '🌽',
    tapSpeech: 'I am grains.',
    color: 'text-yellow-600',
    borderColor: 'border-yellow-300',
    bgColor: 'bg-yellow-50 hover:bg-yellow-100/80',
  },
  bamboo: {
    id: 'bamboo',
    name: 'Bamboo',
    emoji: '🎋',
    tapSpeech: 'I am bamboo.',
    color: 'text-emerald-600',
    borderColor: 'border-emerald-300',
    bgColor: 'bg-emerald-50 hover:bg-emerald-100/80',
  },
};

const ALL_ANIMALS: AnimalConfig[] = [
  {
    id: 'rabbit',
    name: 'Rabbit',
    emoji: '🐰',
    title: 'RABBIT IS HUNGRY!',
    correctFood: 'carrot',
    wrongFoods: ['meat', 'cake'],
    voiceIntro: 'I am a rabbit. I like carrots!',
    themeColor: 'border-orange-400',
    cardBg: 'from-orange-50 via-amber-50 to-orange-100',
    foodDishName: 'Rabbit Dish',
  },
  {
    id: 'cow',
    name: 'Cow',
    emoji: '🐮',
    title: 'COW IS HUNGRY!',
    correctFood: 'grass',
    wrongFoods: ['fish', 'cake'],
    voiceIntro: 'I am a cow. I eat grass!',
    themeColor: 'border-emerald-400',
    cardBg: 'from-emerald-50 via-teal-50 to-green-100',
    foodDishName: 'Cow Pasture',
  },
  {
    id: 'monkey',
    name: 'Monkey',
    emoji: '🐵',
    title: 'MONKEY IS HUNGRY!',
    correctFood: 'banana',
    wrongFoods: ['carrot', 'fish'],
    voiceIntro: 'I am a monkey. I like bananas!',
    themeColor: 'border-amber-400',
    cardBg: 'from-amber-50 via-yellow-50 to-orange-100',
    foodDishName: 'Monkey Bowl',
  },
  {
    id: 'lion',
    name: 'Lion',
    emoji: '🦁',
    title: 'LION IS HUNGRY!',
    correctFood: 'meat',
    wrongFoods: ['banana', 'grass'],
    voiceIntro: 'I am a lion. I eat meat!',
    themeColor: 'border-rose-400',
    cardBg: 'from-rose-50 via-amber-50 to-orange-100',
    foodDishName: 'Lion Platter',
  },
  {
    id: 'bird',
    name: 'Bird',
    emoji: '🐦',
    title: 'BIRD IS HUNGRY!',
    correctFood: 'seeds',
    wrongFoods: ['carrot', 'meat'],
    voiceIntro: 'I am a bird. I eat seeds!',
    themeColor: 'border-sky-400',
    cardBg: 'from-sky-50 via-blue-50 to-cyan-100',
    foodDishName: 'Bird Feeder',
  },
  {
    id: 'fish',
    name: 'Fish',
    emoji: '🐠',
    title: 'FISH IS HUNGRY!',
    correctFood: 'fish_food',
    wrongFoods: ['banana', 'grass'],
    voiceIntro: 'I am a fish. I eat fish food!',
    themeColor: 'border-cyan-400',
    cardBg: 'from-cyan-50 via-sky-50 to-blue-100',
    foodDishName: 'Aquarium Bowl',
  },
  {
    id: 'elephant',
    name: 'Elephant',
    emoji: '🐘',
    title: 'ELEPHANT IS HUNGRY!',
    correctFood: 'banana',
    wrongFoods: ['meat', 'fish'],
    voiceIntro: 'I am an elephant. I like bananas!',
    themeColor: 'border-indigo-400',
    cardBg: 'from-indigo-50 via-slate-50 to-blue-100',
    foodDishName: 'Elephant Trough',
  },
  {
    id: 'giraffe',
    name: 'Giraffe',
    emoji: '🦒',
    title: 'GIRAFFE IS HUNGRY!',
    correctFood: 'leaves',
    wrongFoods: ['fish', 'cake'],
    voiceIntro: 'I am a giraffe. I eat leaves!',
    themeColor: 'border-lime-400',
    cardBg: 'from-lime-50 via-amber-50 to-yellow-100',
    foodDishName: 'Tree Branch Basket',
  },
  {
    id: 'cat',
    name: 'Cat',
    emoji: '🐱',
    title: 'CAT IS HUNGRY!',
    correctFood: 'milk',
    wrongFoods: ['banana', 'grass'],
    voiceIntro: 'I am a cat. I like milk!',
    themeColor: 'border-pink-400',
    cardBg: 'from-pink-50 via-purple-50 to-pink-100',
    foodDishName: 'Cat Saucer',
  },
  {
    id: 'ant',
    name: 'Ant',
    emoji: '🐜',
    title: 'ANT IS HUNGRY!',
    correctFood: 'sweets',
    wrongFoods: ['fish', 'meat'],
    voiceIntro: 'I am an ant. I love sweets!',
    themeColor: 'border-rose-400',
    cardBg: 'from-rose-50 via-amber-50 to-red-100',
    foodDishName: 'Ant Hill Plate',
  },
  {
    id: 'squirrel',
    name: 'Squirrel',
    emoji: '🐿️',
    title: 'SQUIRREL IS HUNGRY!',
    correctFood: 'nut',
    wrongFoods: ['fish', 'meat'],
    voiceIntro: 'I am a squirrel. I like nuts!',
    themeColor: 'border-amber-400',
    cardBg: 'from-amber-50 via-orange-50 to-yellow-100',
    foodDishName: 'Tree Stump Basket',
  },
  {
    id: 'bee',
    name: 'Bee',
    emoji: '🐝',
    title: 'BEE IS HUNGRY!',
    correctFood: 'flower',
    wrongFoods: ['carrot', 'meat'],
    voiceIntro: 'I am a bee. I like flowers!',
    themeColor: 'border-yellow-400',
    cardBg: 'from-yellow-50 via-amber-50 to-lime-100',
    foodDishName: 'Honeycomb Bowl',
  },
  {
    id: 'frog',
    name: 'Frog',
    emoji: '🐸',
    title: 'FROG IS HUNGRY!',
    correctFood: 'fly',
    wrongFoods: ['cake', 'banana'],
    voiceIntro: 'I am a frog. I eat flies!',
    themeColor: 'border-emerald-400',
    cardBg: 'from-emerald-50 via-green-50 to-teal-100',
    foodDishName: 'Lily Pad',
  },
  {
    id: 'chicken',
    name: 'Chicken',
    emoji: '🐔',
    title: 'CHICKEN IS HUNGRY!',
    correctFood: 'grains',
    wrongFoods: ['fish', 'cake'],
    voiceIntro: 'I am a chicken. I eat grains!',
    themeColor: 'border-amber-400',
    cardBg: 'from-amber-50 via-yellow-50 to-orange-100',
    foodDishName: 'Coop Feeder',
  },
  {
    id: 'panda',
    name: 'Panda',
    emoji: '🐼',
    title: 'PANDA IS HUNGRY!',
    correctFood: 'bamboo',
    wrongFoods: ['meat', 'fish'],
    voiceIntro: 'I am a panda. I like bamboo!',
    themeColor: 'border-teal-400',
    cardBg: 'from-teal-50 via-slate-50 to-emerald-100',
    foodDishName: 'Bamboo Mat',
  },
  {
    id: 'koala',
    name: 'Koala',
    emoji: '🐨',
    title: 'KOALA IS HUNGRY!',
    correctFood: 'leaves',
    wrongFoods: ['meat', 'cake'],
    voiceIntro: 'I am a koala. I eat leaves!',
    themeColor: 'border-slate-400',
    cardBg: 'from-slate-50 via-emerald-50 to-teal-100',
    foodDishName: 'Eucalyptus Branch',
  },
];

// High quality custom illustration for each animal with interactive states
const AnimalIllustration: React.FC<{
  animal: AnimalConfig;
  state: 'idle' | 'hungry' | 'eating' | 'happy' | 'wrong';
}> = ({ animal, state }) => {
  return (
    <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center select-none">
      {/* Decorative Soft Aura */}
      <div
        className={`absolute inset-0 rounded-full blur-xl transition-all duration-500 ${
          state === 'eating' || state === 'happy'
            ? 'bg-amber-300/60 scale-110'
            : state === 'wrong'
            ? 'bg-rose-300/40 scale-95'
            : 'bg-white/80 scale-100'
        }`}
      />

      {/* Main Animal Character Display */}
      <motion.div
        animate={
          state === 'eating'
            ? {
                scale: [1, 1.12, 1.05, 1.15, 1],
                rotate: [0, -3, 3, -2, 0],
                y: [0, -6, 0, -4, 0],
              }
            : state === 'happy'
            ? {
                scale: [1, 1.1, 1],
                y: [0, -10, 0],
              }
            : state === 'wrong'
            ? {
                x: [-6, 6, -4, 4, 0],
                rotate: [-4, 4, -2, 2, 0],
              }
            : {
                y: [-2, 2, -2],
                rotate: [-1, 1, -1],
              }
        }
        transition={{
          duration: state === 'eating' ? 0.8 : state === 'wrong' ? 0.45 : 3.5,
          repeat: state === 'idle' ? Infinity : 0,
          ease: 'easeInOut',
        }}
        className="relative z-10 flex flex-col items-center justify-center"
      >
        {/* Render Animal Emoji & SVG Styling */}
        <div className="relative">
          <span className="text-8xl sm:text-9xl leading-none filter drop-shadow-md select-none transform transition-transform">
            {animal.emoji}
          </span>

          {/* Happy Blush Cheeks */}
          {(state === 'eating' || state === 'happy' || state === 'idle') && (
            <div className="absolute inset-x-0 bottom-2 flex justify-between px-4 pointer-events-none opacity-80">
              <span className="w-4 h-2.5 rounded-full bg-pink-400/60 blur-xs" />
              <span className="w-4 h-2.5 rounded-full bg-pink-400/60 blur-xs" />
            </div>
          )}

          {/* Eating / Love Reactions */}
          {state === 'eating' && (
            <div className="absolute -top-3 -right-2 flex space-x-1 animate-bounce">
              <span className="text-2xl">✨</span>
              <span className="text-2xl text-rose-500">💖</span>
            </div>
          )}

          {state === 'happy' && (
            <div className="absolute -top-4 -right-1 flex space-x-1">
              <span className="text-2xl animate-spin">⭐</span>
              <span className="text-2xl">🎉</span>
            </div>
          )}

          {state === 'wrong' && (
            <div className="absolute -top-2 -right-1">
              <span className="text-2xl">💭</span>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

// Robust unbiased Fisher-Yates array shuffler
function shuffleArray<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export const FeedAnimal: React.FC<FeedAnimalProps> = ({
  onCollectStar,
  onNavigateHome,
  onNavigateNext,
  onNavigatePrev,
  isActivityCompleted = false,
}) => {
  // Game sequence state - initialized with a freshly shuffled array of all 16 animals
  const [animalQueue, setAnimalQueue] = useState<AnimalConfig[]>(() =>
    shuffleArray(ALL_ANIMALS)
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffledFoodChoices, setShuffledFoodChoices] = useState<FoodItem[]>([]);
  const [sessionNonce, setSessionNonce] = useState(1);
  const [animalState, setAnimalState] = useState<'idle' | 'hungry' | 'eating' | 'happy' | 'wrong'>(
    'hungry'
  );
  const [isCompleted, setIsCompleted] = useState(false);
  const [isFeedingActive, setIsFeedingActive] = useState(false);
  const [isDropTargetHovered, setIsDropTargetHovered] = useState(false);
  const [eatenFood, setEatenFood] = useState<FoodItem | null>(null);

  // References
  const dropZoneRef = useRef<HTMLDivElement | null>(null);
  const isAdvancingRef = useRef(false);

  // Initialize and shuffle animal questions with a fresh Fisher-Yates shuffle on every Replay
  const initializeGame = useCallback(() => {
    soundManager.stopSpeech();
    const freshShuffled = shuffleArray(ALL_ANIMALS);
    setAnimalQueue(freshShuffled);
    setCurrentIndex(0);
    setSessionNonce((prev) => prev + 1);
    setIsCompleted(false);
    setIsFeedingActive(false);
    setEatenFood(null);
    setAnimalState('hungry');
    setIsDropTargetHovered(false);
    isAdvancingRef.current = false;
  }, []);

  const currentAnimal = animalQueue[currentIndex] || ALL_ANIMALS[0];

  // Prepare freshly randomized 3-choice food options whenever current animal, index, or session changes
  useEffect(() => {
    if (!currentAnimal) return;

    const correct = FOOD_REGISTRY[currentAnimal.correctFood];
    const wrong1 = FOOD_REGISTRY[currentAnimal.wrongFoods[0]];
    const wrong2 = FOOD_REGISTRY[currentAnimal.wrongFoods[1]];

    const choices = shuffleArray([correct, wrong1, wrong2]);
    setShuffledFoodChoices(choices);
    setAnimalState('hungry');
    setEatenFood(null);
    setIsFeedingActive(false);
    setIsDropTargetHovered(false);
    isAdvancingRef.current = false;

    // Friendly prompt on animal arrival
    const timer = setTimeout(() => {
      soundManager.stopSpeech();
      soundManager.speak(currentAnimal.voiceIntro);
    }, 350);

    return () => clearTimeout(timer);
  }, [currentAnimal, currentIndex, sessionNonce]);

  // Voice playback handler for user clicking audio replay button
  const handleReplayVoice = () => {
    soundManager.stopSpeech();
    soundManager.speak(currentAnimal.voiceIntro);
  };

  // Tap handler on food cards: short food identifier
  const handleFoodTap = (food: FoodItem) => {
    if (isAdvancingRef.current || isFeedingActive) return;
    soundManager.stopSpeech();
    soundManager.playPop();
    soundManager.speak(food.tapSpeech);
  };

  // Check if pointer / food is within the generous feeding drop zone
  const checkIsInFeedingZone = (point: { x: number; y: number }): boolean => {
    if (!dropZoneRef.current) return false;
    const rect = dropZoneRef.current.getBoundingClientRect();
    // Substantially enlarged preschool feeding drop zone
    // Covers the animal's mouth, head, face, dish, and the generous surrounding radius
    const bufferX = 140;
    const bufferTop = 100;
    const bufferBottom = 120;
    const inBox =
      point.x >= rect.left - bufferX &&
      point.x <= rect.right + bufferX &&
      point.y >= rect.top - bufferTop &&
      point.y <= rect.bottom + bufferBottom;

    const cx = (rect.left + rect.right) / 2;
    const cy = (rect.top + rect.bottom) / 2;
    const dist = Math.hypot(point.x - cx, point.y - cy);
    const radiusThreshold = Math.max(rect.width, rect.height) * 0.95 + 90;

    return inBox || dist <= radiusThreshold;
  };

  // Immediate feeding trigger when correct food enters feeding area
  const triggerCorrectFeed = (food: FoodItem) => {
    if (isAdvancingRef.current || isFeedingActive) return;
    isAdvancingRef.current = true;
    setIsFeedingActive(true);
    setIsDropTargetHovered(false);
    setEatenFood(food);
    setAnimalState('eating');

    // Play munch & correct chime
    soundManager.stopSpeech();
    soundManager.playMunch();

    setTimeout(() => {
      soundManager.playSuccess();
      soundManager.speak('Yummy! Great job!');
      setAnimalState('happy');
    }, 300);

    // Advance to next animal after short eating pause
    setTimeout(() => {
      if (currentIndex + 1 >= animalQueue.length) {
        // Completed all animals!
        setIsCompleted(true);
        soundManager.stopSpeech();
        soundManager.playCelebration();
        soundManager.speak('Great job! You fed all the animals!');
        onCollectStar();
      } else {
        setCurrentIndex((prev) => prev + 1);
      }
    }, 1600);
  };

  // Active drag handler: tracks hover and immediately triggers correct feeding upon entering zone
  const handleDragMove = (
    food: FoodItem,
    point: { x: number; y: number }
  ) => {
    if (isAdvancingRef.current || isFeedingActive) return;
    const inside = checkIsInFeedingZone(point);
    setIsDropTargetHovered(inside);

    if (inside && food.id === currentAnimal.correctFood) {
      triggerCorrectFeed(food);
    }
  };

  // Drag release handler
  const handleDragEnd = (
    food: FoodItem,
    point: { x: number; y: number }
  ) => {
    if (isAdvancingRef.current || isFeedingActive) return;

    setIsDropTargetHovered(false);
    const inside = checkIsInFeedingZone(point);

    if (inside) {
      if (food.id === currentAnimal.correctFood) {
        triggerCorrectFeed(food);
      } else {
        // --- WRONG FOOD DRAGGED ---
        setAnimalState('wrong');
        soundManager.stopSpeech();
        soundManager.playError();
        soundManager.speak("That's not my food. Try again!");

        setTimeout(() => {
          setAnimalState('hungry');
        }, 900);
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 py-3 sm:py-6 flex flex-col items-center select-none">
      {/* Activity Card Outer Frame */}
      <div
        className={`w-full bg-gradient-to-b ${currentAnimal.cardBg} border-4 sm:border-6 ${currentAnimal.themeColor} rounded-3xl sm:rounded-4xl p-4 sm:p-6 shadow-xl relative overflow-hidden transition-colors duration-500`}
      >
        {/* Floating Background Sparkles */}
        <div className="absolute top-4 left-4 text-2xl opacity-40 pointer-events-none animate-pulse">
          ✨
        </div>
        <div className="absolute top-8 right-6 text-2xl opacity-40 pointer-events-none animate-bounce">
          🌟
        </div>

        {/* Top Header Controls */}
        <div className="flex items-center justify-between gap-2 mb-3 sm:mb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={handleReplayVoice}
              className="p-2.5 sm:p-3 bg-white hover:bg-orange-50 active:scale-95 text-orange-600 rounded-2xl border-2 sm:border-3 border-orange-300 shadow-md transition-all flex items-center justify-center cursor-pointer"
              title="Repeat Animal Voice"
              aria-label="Repeat Animal Voice"
            >
              <Volume2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <button
              onClick={initializeGame}
              className="p-2.5 sm:p-3 bg-white hover:bg-slate-50 active:scale-95 text-slate-600 rounded-2xl border-2 sm:border-3 border-slate-300 shadow-md transition-all flex items-center justify-center cursor-pointer"
              title="Restart Activity"
              aria-label="Restart Activity"
            >
              <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Activity Title Banner */}
          <div className="text-center px-2">
            <h2 className="text-lg sm:text-2xl font-black text-slate-800 tracking-tight uppercase">
              FEED THE ANIMAL
            </h2>
            <div className="inline-flex items-center gap-1.5 bg-white/90 px-3 py-1 rounded-full border border-orange-200 shadow-xs mt-0.5">
              <span className="text-xs sm:text-sm font-bold text-orange-700">
                {currentAnimal.emoji} {currentAnimal.title}
              </span>
            </div>
          </div>

          {/* Progress Pill */}
          <div className="flex items-center gap-1 bg-white/90 px-3 py-1.5 rounded-2xl border-2 border-orange-200 shadow-sm">
            <span className="text-xs sm:text-sm font-black text-orange-950">
              {currentIndex + 1} / {animalQueue.length || 16}
            </span>
          </div>
        </div>

        {/* MAIN PLAYABLE CANVAS */}
        <div className="relative flex flex-col items-center justify-center py-2 sm:py-4">
          {/* CENTER ANIMAL CONTAINER & DROP ZONE */}
          <div
            ref={dropZoneRef}
            className={`relative flex flex-col items-center justify-center p-3 sm:p-5 rounded-3xl transition-all duration-300 ${
              isDropTargetHovered
                ? 'scale-105 ring-4 ring-orange-400 bg-white/60'
                : 'scale-100'
            }`}
          >
            {/* Animal Character */}
            <AnimalIllustration animal={currentAnimal} state={animalState} />

            {/* Generous Feeding Drop Target Bowl */}
            <div
              className={`mt-1 px-4 py-2 rounded-2xl border-3 flex items-center gap-2 transition-all ${
                animalState === 'eating'
                  ? 'bg-amber-100 border-amber-400 scale-105 shadow-md'
                  : 'bg-white/90 border-dashed border-orange-300 shadow-sm'
              }`}
            >
              <span className="text-lg">🍽️</span>
              <span className="text-xs sm:text-sm font-extrabold text-slate-700">
                {animalState === 'eating'
                  ? `Munching ${eatenFood?.name || 'Food'}!`
                  : `Drag food here to feed ${currentAnimal.name}!`}
              </span>
              {animalState === 'eating' && (
                <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
              )}
            </div>
          </div>

          {/* FOOD CHOICES: 3 LARGE, SPACED-OUT DRAGGABLE CARDS */}
          <div className="w-full max-w-2xl mt-4 sm:mt-6">
            <div className="text-center mb-2">
              <span className="text-xs sm:text-sm font-bold text-slate-600 bg-white/80 px-3 py-1 rounded-full border border-slate-200 shadow-2xs">
                👇 Drag the right food to the {currentAnimal.name}:
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:gap-6 justify-items-center">
              {shuffledFoodChoices.map((food, slotIdx) => {
                const isThisFoodEaten =
                  isFeedingActive && eatenFood?.id === food.id;

                return (
                  <motion.div
                    key={`food-slot-${sessionNonce}-${currentIndex}-${slotIdx}-${food.id}`}
                    drag={!isAdvancingRef.current}
                    dragSnapToOrigin={true}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    whileDrag={{
                      scale: 1.18,
                      zIndex: 50,
                      boxShadow: '0 20px 30px rgba(0,0,0,0.2)',
                    }}
                    onDragStart={() => setIsDropTargetHovered(true)}
                    onDrag={(_e, info) => handleDragMove(food, info.point)}
                    onDragEnd={(_e, info) => handleDragEnd(food, info.point)}
                    onClick={() => handleFoodTap(food)}
                    className={`relative w-full max-w-[150px] sm:max-w-[190px] aspect-square flex flex-col items-center justify-center p-2 sm:p-4 rounded-2xl sm:rounded-3xl border-3 sm:border-4 ${food.borderColor} ${food.bgColor} shadow-md sm:shadow-lg cursor-grab active:cursor-grabbing transition-colors ${
                      isThisFoodEaten ? 'opacity-0 scale-50' : 'opacity-100'
                    }`}
                  >
                    {/* Food Emoji Icon */}
                    <span className="text-4xl sm:text-6xl drop-shadow-sm select-none pointer-events-none mb-1">
                      {food.emoji}
                    </span>

                    {/* Food Label */}
                    <span
                      className={`text-xs sm:text-base font-black ${food.color} tracking-tight select-none pointer-events-none text-center leading-tight`}
                    >
                      {food.name}
                    </span>

                    {/* Drag Hint Pill */}
                    <span className="mt-1 text-[10px] sm:text-xs font-semibold text-slate-500 select-none pointer-events-none opacity-75">
                      Drag me
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Progress Bar Indicators at bottom */}
        <div className="flex items-center justify-center gap-1.5 mt-4 sm:mt-6">
          {animalQueue.map((_, idx) => (
            <div
              key={idx}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx < currentIndex
                  ? 'w-6 bg-emerald-500'
                  : idx === currentIndex
                  ? 'w-8 bg-orange-500 ring-2 ring-orange-300'
                  : 'w-2 bg-slate-300'
              }`}
            />
          ))}
        </div>

        {/* COMPLETION MODAL */}
        <AnimatePresence>
          {isCompleted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 z-40 flex items-center justify-center bg-white/95 backdrop-blur-sm p-4"
            >
              <div className="bg-gradient-to-b from-orange-50 via-amber-50 to-orange-100 border-6 sm:border-8 border-orange-400 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col items-center text-center max-w-md w-full">
                {/* Visual Icon matching the main Feed the Animal card */}
                <div className="w-24 h-24 mb-4 rounded-full bg-white border-4 border-orange-300 flex items-center justify-center shadow-lg animate-bounce relative shrink-0">
                  <PremiumCardIllustration id="feed_animal" />
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-orange-950 tracking-tight uppercase">
                  ANIMAL FRIEND CHAMPION!
                </h3>
                <p className="text-sm sm:text-base font-bold text-orange-800 mt-2 mb-6">
                  You fed all {animalQueue.length} animals their favorite foods!
                  Yummy! 🎉
                </p>

                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <button
                    onClick={initializeGame}
                    className="flex-1 py-3.5 px-4 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-black text-base sm:text-lg rounded-2xl border-b-4 border-orange-700 shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <RotateCcw className="w-5 h-5" />
                    Play Again
                  </button>

                  {onNavigateHome && (
                    <button
                      onClick={onNavigateHome}
                      className="flex-1 py-3.5 px-4 bg-white hover:bg-slate-50 active:scale-95 text-slate-700 font-bold text-base sm:text-lg rounded-2xl border-2 border-slate-300 shadow-md transition-all flex items-center justify-center cursor-pointer"
                    >
                      Back to Home
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Standard Activity Bottom Navigation */}
      <ActivityBottomNav
        onPrev={onNavigatePrev}
        onNext={onNavigateNext}
        onHome={onNavigateHome}
        prevTitle="Balloon Count"
        nextTitle="Catch the Star"
        homeTitle="Home"
      />
    </div>
  );
};
