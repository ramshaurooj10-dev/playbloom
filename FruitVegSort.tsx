import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Volume2, Star as StarIcon, Check } from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { ActivityBottomNav } from './ActivityBottomNav';

interface FruitVegSortProps {
  onCollectStar: () => void;
  onNavigateHome?: () => void;
  onNavigateNext?: () => void;
  onNavigatePrev?: () => void;
  isActivityCompleted?: boolean;
}

type FoodCategory = 'fruit' | 'vegetable';

interface FoodDefinition {
  id: string;
  name: string;
  emoji: string;
  phrase: string;
  category: FoodCategory;
}

interface FoodItem extends FoodDefinition {
  instanceId: string;
  isSorted: boolean;
}

// Comprehensive Unambiguous Fruits Pool (12 clear items, NO TOMATO)
const FRUIT_POOL: FoodDefinition[] = [
  { id: 'apple', name: 'Apple', emoji: '🍎', phrase: 'I am an apple.', category: 'fruit' },
  { id: 'banana', name: 'Banana', emoji: '🍌', phrase: 'I am a banana.', category: 'fruit' },
  { id: 'orange', name: 'Orange', emoji: '🍊', phrase: 'I am an orange.', category: 'fruit' },
  { id: 'strawberry', name: 'Strawberry', emoji: '🍓', phrase: 'I am a strawberry.', category: 'fruit' },
  { id: 'watermelon', name: 'Watermelon', emoji: '🍉', phrase: 'I am a watermelon.', category: 'fruit' },
  { id: 'grapes', name: 'Grapes', emoji: '🍇', phrase: 'I am grapes.', category: 'fruit' },
  { id: 'pear', name: 'Pear', emoji: '🍐', phrase: 'I am a pear.', category: 'fruit' },
  { id: 'mango', name: 'Mango', emoji: '🥭', phrase: 'I am a mango.', category: 'fruit' },
  { id: 'pineapple', name: 'Pineapple', emoji: '🍍', phrase: 'I am a pineapple.', category: 'fruit' },
  { id: 'peach', name: 'Peach', emoji: '🍑', phrase: 'I am a peach.', category: 'fruit' },
  { id: 'cherries', name: 'Cherries', emoji: '🍒', phrase: 'I am cherries.', category: 'fruit' },
  { id: 'lemon', name: 'Lemon', emoji: '🍋', phrase: 'I am a lemon.', category: 'fruit' },
];

// Comprehensive Unambiguous Vegetables Pool (12 clear items, NO TOMATO, NO PEAS)
const VEGETABLE_POOL: FoodDefinition[] = [
  { id: 'carrot', name: 'Carrot', emoji: '🥕', phrase: 'I am a carrot.', category: 'vegetable' },
  { id: 'brinjal', name: 'Brinjal', emoji: '🍆', phrase: 'I am a brinjal.', category: 'vegetable' },
  { id: 'broccoli', name: 'Broccoli', emoji: '🥦', phrase: 'I am broccoli.', category: 'vegetable' },
  { id: 'cucumber', name: 'Cucumber', emoji: '🥒', phrase: 'I am a cucumber.', category: 'vegetable' },
  { id: 'corn', name: 'Corn', emoji: '🌽', phrase: 'I am corn.', category: 'vegetable' },
  { id: 'bell_pepper', name: 'Bell Pepper', emoji: '🫑', phrase: 'I am a bell pepper.', category: 'vegetable' },
  { id: 'lettuce', name: 'Lettuce', emoji: '🥬', phrase: 'I am lettuce.', category: 'vegetable' },
  { id: 'potato', name: 'Potato', emoji: '🥔', phrase: 'I am a potato.', category: 'vegetable' },
  { id: 'mushroom', name: 'Mushroom', emoji: '🍄', phrase: 'I am a mushroom.', category: 'vegetable' },
  { id: 'onion', name: 'Onion', emoji: '🧅', phrase: 'I am an onion.', category: 'vegetable' },
  { id: 'garlic', name: 'Garlic', emoji: '🧄', phrase: 'I am garlic.', category: 'vegetable' },
  { id: 'sweet_potato', name: 'Sweet Potato', emoji: '🍠', phrase: 'I am a sweet potato.', category: 'vegetable' },
];

const GRADIENTS = [
  'from-amber-100 via-orange-50 to-emerald-100',
  'from-sky-100 via-emerald-50 to-lime-100',
  'from-rose-100 via-amber-50 to-teal-100',
  'from-yellow-100 via-emerald-50 to-cyan-100',
  'from-orange-100 via-lime-50 to-amber-100',
];

// Fisher-Yates shuffle helper
function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

const generateShuffledFoodBoard = (previousItemIds?: string[]): { items: FoodItem[]; bgGradient: string } => {
  // Select 5 random fruits out of 12
  const shuffledFruits = shuffleArray(FRUIT_POOL);
  // Select 5 random vegetables out of 12
  const shuffledVegetables = shuffleArray(VEGETABLE_POOL);

  let selectedFruits = shuffledFruits.slice(0, 5);
  let selectedVegetables = shuffledVegetables.slice(0, 5);

  // If previous items were provided, ensure the combination differs
  if (previousItemIds && previousItemIds.length > 0) {
    const prevSet = new Set(previousItemIds);
    // Find unpicked fruits & vegetables
    const freshFruits = shuffledFruits.filter(f => !prevSet.has(f.id));
    const freshVegetables = shuffledVegetables.filter(v => !prevSet.has(v.id));

    // Guarantee fresh picks if available
    if (freshFruits.length >= 3) {
      selectedFruits = shuffleArray([...freshFruits.slice(0, 3), ...shuffledFruits.filter(f => prevSet.has(f.id)).slice(0, 2)]);
    }
    if (freshVegetables.length >= 3) {
      selectedVegetables = shuffleArray([...freshVegetables.slice(0, 3), ...shuffledVegetables.filter(v => prevSet.has(v.id)).slice(0, 2)]);
    }
  }

  const combined: FoodItem[] = [...selectedFruits, ...selectedVegetables].map((f) => ({
    ...f,
    instanceId: `${f.id}_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`,
    isSorted: false,
  }));

  // Thorough Fisher-Yates multi-pass shuffle so layout, positions and order are fresh every time
  const shuffledItems = shuffleArray(shuffleArray(combined));
  const bgGradient = GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)];

  return { items: shuffledItems, bgGradient };
};

export const FruitVegSort: React.FC<FruitVegSortProps> = ({
  onCollectStar,
  onNavigateHome,
  onNavigateNext,
  onNavigatePrev,
  isActivityCompleted = false,
}) => {
  const [{ items, bgGradient }, setBoard] = useState(generateShuffledFoodBoard);
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);
  const [wrongShakeBasket, setWrongShakeBasket] = useState<FoodCategory | null>(null);
  const [isAllFinished, setIsAllFinished] = useState(false);

  // Spoken instruction on start
  useEffect(() => {
    if (!isAllFinished) {
      soundManager.speak('Sort the food into the right basket!');
    }
  }, [isAllFinished]);

  const handlePlayAgain = () => {
    soundManager.playPop();
    soundManager.speak("Let's sort fruits and vegetables again!");
    const previousIds = items.map((i) => i.id);
    setBoard(generateShuffledFoodBoard(previousIds));
    setSelectedItemIndex(null);
    setWrongShakeBasket(null);
    setIsAllFinished(false);
  };

  const handleSelectFood = (index: number) => {
    if (isAllFinished) return;
    const item = items[index];
    if (item.isSorted) return;

    soundManager.playPop();
    setSelectedItemIndex(index);
    // Voice immediately speaks: "I am a [name]."
    soundManager.speak(item.phrase);
  };

  const handleChooseBasket = (chosenCategory: FoodCategory) => {
    if (selectedItemIndex === null || isAllFinished) {
      soundManager.playPop();
      soundManager.speak('Tap a food first, then choose its basket!');
      return;
    }

    const currentItem = items[selectedItemIndex];
    if (currentItem.isSorted) return;

    if (currentItem.category === chosenCategory) {
      // CORRECT
      soundManager.playSuccess();
      soundManager.speak('Great job!');

      const updatedItems = [...items];
      updatedItems[selectedItemIndex] = { ...currentItem, isSorted: true };
      setBoard((prev) => ({ ...prev, items: updatedItems }));
      setSelectedItemIndex(null);

      // Check if all 10 are sorted
      const sortedCount = updatedItems.filter((it) => it.isSorted).length;
      if (sortedCount === updatedItems.length) {
        onCollectStar();
        setTimeout(() => {
          setIsAllFinished(true);
          soundManager.playCelebration();
          soundManager.speak('Fantastic! You sorted all the fruits and vegetables!');
        }, 800);
      }
    } else {
      // WRONG
      setWrongShakeBasket(chosenCategory);
      // Gentle explanatory category reminder
      if (currentItem.category === 'vegetable') {
        soundManager.speak('I am a vegetable.');
      } else {
        soundManager.speak('I am a fruit.');
      }

      setTimeout(() => {
        setWrongShakeBasket(null);
      }, 600);
    }
  };

  const sortedCount = items.filter((it) => it.isSorted).length;
  const unsortedItems = items.map((item, idx) => ({ item, originalIndex: idx })).filter((x) => !x.item.isSorted);
  const sortedFruits = items.filter((it) => it.isSorted && it.category === 'fruit');
  const sortedVegetables = items.filter((it) => it.isSorted && it.category === 'vegetable');

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center p-2 sm:p-4">
      {/* Top Banner Header */}
      <div className="w-full bg-white/90 backdrop-blur-md border-4 border-amber-300 rounded-3xl p-3 sm:p-4 shadow-lg mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-amber-100 px-3 py-1.5 rounded-2xl border-2 border-amber-300">
            <span className="text-xl">🍎</span>
            <h1 className="text-base sm:text-xl font-black text-amber-950 uppercase tracking-wide">
              Fruit & Vegetable Sort
            </h1>
          </div>
        </div>

        {/* Counter & Stars */}
        <div className="flex items-center gap-2">
          <div className="bg-emerald-100 text-emerald-900 font-black text-xs sm:text-sm px-3 py-1.5 rounded-2xl border-2 border-emerald-300 flex items-center gap-1">
            <span>Sorted: {sortedCount} / 10</span>
          </div>

          <div className="bg-amber-400 text-amber-950 font-black text-xs sm:text-sm px-3 py-1.5 rounded-2xl border-2 border-amber-300 flex items-center gap-1 shadow-xs">
            <StarIcon className="w-4 h-4 fill-amber-100 stroke-amber-950" />
            <span>{sortedCount === 10 || isActivityCompleted ? 1 : 0}</span>
          </div>
        </div>
      </div>

      {/* Main Play Area */}
      <div
        className={`w-full bg-gradient-to-br ${bgGradient} border-4 border-amber-400 rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col items-center relative overflow-hidden min-h-[440px] justify-between transition-colors duration-500`}
      >
        {/* Instruction Subheader */}
        <div className="text-center mt-1 mb-3">
          <div className="inline-flex items-center gap-2 bg-white px-6 py-2 rounded-full border-4 border-amber-300 shadow-md mb-1">
            <button
              type="button"
              onClick={() => soundManager.speak('Sort the food into the right basket!')}
              className="p-1 bg-amber-100 hover:bg-amber-200 rounded-full text-amber-900 transition-transform active:scale-90 cursor-pointer"
            >
              <Volume2 className="w-5 h-5" />
            </button>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight uppercase">
              SORT THE FOOD INTO THE RIGHT BASKET!
            </h2>
          </div>
          <p className="text-xs sm:text-sm font-black text-slate-600 uppercase tracking-wide">
            Tap a food item, then choose its basket!
          </p>
        </div>

        {!isAllFinished ? (
          <div className="w-full flex flex-col items-center gap-4 my-auto">
            {/* TOP AREA: 2 Cute Woven Baskets */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl">
              {/* FRUITS BASKET */}
              <motion.button
                type="button"
                onClick={() => handleChooseBasket('fruit')}
                animate={wrongShakeBasket === 'fruit' ? { x: [-8, 8, -6, 6, -3, 3, 0] } : {}}
                transition={{ duration: 0.4 }}
                className={`relative w-full rounded-b-[2.5rem] rounded-t-2xl p-4 sm:p-5 shadow-xl flex flex-col items-center justify-between min-h-[160px] cursor-pointer transition-all duration-200 border-4 ${
                  selectedItemIndex !== null
                    ? 'border-rose-500 bg-gradient-to-b from-rose-100 via-amber-50 to-red-100 ring-4 ring-rose-300 scale-[1.02]'
                    : 'border-rose-400 bg-gradient-to-b from-rose-50 via-amber-50 to-red-50 hover:border-rose-500'
                }`}
              >
                {/* Cute Basket Handle Arc */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-6 border-t-4 border-l-4 border-r-4 border-amber-700/60 rounded-t-full pointer-events-none" />

                {/* Basket Header Badge */}
                <div className="flex items-center gap-2 bg-gradient-to-r from-rose-500 to-red-600 text-white font-black text-base sm:text-lg px-5 py-1.5 rounded-full shadow-md border-2 border-rose-300">
                  <span className="text-xl">🍎</span>
                  <span>FRUITS BASKET</span>
                </div>

                <span className="text-xs font-black text-rose-800 uppercase tracking-wide my-1">
                  {selectedItemIndex !== null ? '👉 Tap to put fruit here! 👈' : 'Sort fruits into this basket'}
                </span>

                {/* Inner Woven Basket Collection Tray */}
                <div className="w-full bg-amber-100/80 border-2 border-dashed border-amber-400/80 rounded-2xl p-2 min-h-[52px] flex flex-wrap items-center justify-center gap-1.5 shadow-inner">
                  {sortedFruits.map((f) => (
                    <span
                      key={f.instanceId}
                      className="text-2xl sm:text-3xl select-none filter drop-shadow-xs"
                      title={f.name}
                    >
                      {f.emoji}
                    </span>
                  ))}
                  {sortedFruits.length === 0 && (
                    <span className="text-xs font-bold text-amber-700/60 italic">
                      Empty Fruit Basket
                    </span>
                  )}
                </div>
              </motion.button>

              {/* VEGETABLES BASKET */}
              <motion.button
                type="button"
                onClick={() => handleChooseBasket('vegetable')}
                animate={wrongShakeBasket === 'vegetable' ? { x: [-8, 8, -6, 6, -3, 3, 0] } : {}}
                transition={{ duration: 0.4 }}
                className={`relative w-full rounded-b-[2.5rem] rounded-t-2xl p-4 sm:p-5 shadow-xl flex flex-col items-center justify-between min-h-[160px] cursor-pointer transition-all duration-200 border-4 ${
                  selectedItemIndex !== null
                    ? 'border-emerald-600 bg-gradient-to-b from-emerald-100 via-lime-50 to-teal-100 ring-4 ring-emerald-300 scale-[1.02]'
                    : 'border-emerald-500 bg-gradient-to-b from-emerald-50 via-lime-50 to-teal-50 hover:border-emerald-600'
                }`}
              >
                {/* Cute Basket Handle Arc */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-6 border-t-4 border-l-4 border-r-4 border-amber-700/60 rounded-t-full pointer-events-none" />

                {/* Basket Header Badge */}
                <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-black text-base sm:text-lg px-5 py-1.5 rounded-full shadow-md border-2 border-emerald-300">
                  <span className="text-xl">🥕</span>
                  <span>VEGETABLES BASKET</span>
                </div>

                <span className="text-xs font-black text-emerald-800 uppercase tracking-wide my-1">
                  {selectedItemIndex !== null ? '👉 Tap to put vegetable here! 👈' : 'Sort vegetables into this basket'}
                </span>

                {/* Inner Woven Basket Collection Tray */}
                <div className="w-full bg-emerald-100/80 border-2 border-dashed border-emerald-400/80 rounded-2xl p-2 min-h-[52px] flex flex-wrap items-center justify-center gap-1.5 shadow-inner">
                  {sortedVegetables.map((v) => (
                    <span
                      key={v.instanceId}
                      className="text-2xl sm:text-3xl select-none filter drop-shadow-xs"
                      title={v.name}
                    >
                      {v.emoji}
                    </span>
                  ))}
                  {sortedVegetables.length === 0 && (
                    <span className="text-xs font-bold text-emerald-700/60 italic">
                      Empty Vegetable Basket
                    </span>
                  )}
                </div>
              </motion.button>
            </div>

            {/* Sorting Indicator Arrow */}
            <div className="flex items-center gap-2 bg-white/90 border-2 border-amber-300 px-4 py-1 rounded-full shadow-xs">
              <span className="text-amber-900 font-black text-xs sm:text-sm tracking-wide uppercase">
                ↓ SORT FOODS BELOW INTO THE BASKETS ABOVE ↓
              </span>
            </div>

            {/* BOTTOM AREA: Mixed Food Items Grid (STATIC Objects) */}
            <div className="w-full max-w-3xl bg-white/85 backdrop-blur-xs border-3 border-amber-200 rounded-3xl p-3 sm:p-4 shadow-inner min-h-[140px] flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
              <AnimatePresence>
                {unsortedItems.map(({ item, originalIndex }) => {
                  const isSelected = selectedItemIndex === originalIndex;

                  return (
                    <motion.button
                      key={item.instanceId}
                      layout
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      type="button"
                      onClick={() => handleSelectFood(originalIndex)}
                      className={`flex flex-col items-center justify-center w-[72px] h-[80px] sm:w-[90px] sm:h-[96px] rounded-2xl border-3 sm:border-4 transition-all cursor-pointer select-none ${
                        isSelected
                          ? 'bg-amber-100 border-amber-500 ring-4 ring-amber-300 scale-105 shadow-lg'
                          : 'bg-white hover:bg-amber-50 border-slate-200 hover:border-amber-300 shadow-md'
                      }`}
                    >
                      <span className="text-3xl sm:text-4xl select-none leading-none">
                        {item.emoji}
                      </span>
                      <span className="text-[10px] sm:text-xs font-black text-slate-700 mt-1 truncate max-w-[64px] sm:max-w-[80px]">
                        {item.name}
                      </span>
                    </motion.button>
                  );
                })}
              </AnimatePresence>

              {unsortedItems.length === 0 && (
                <div className="text-sm font-black text-emerald-700 py-3 flex items-center gap-1.5">
                  <Check className="w-5 h-5 text-emerald-600 stroke-[3]" />
                  <span>All foods sorted into the right baskets!</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Completion Screen with PLAY AGAIN button */
          <div className="flex flex-col items-center justify-center text-center my-auto p-6 bg-white/90 backdrop-blur-md rounded-3xl border-4 border-amber-400 shadow-xl max-w-lg">
            <div className="text-6xl mb-3 animate-bounce">🎉</div>
            <h3 className="text-2xl sm:text-3xl font-black text-amber-950 uppercase mb-2">
              SORTING STAR!
            </h3>
            <div className="flex items-center gap-1.5 bg-amber-200 border-2 border-amber-400 px-4 py-1.5 rounded-full mb-3">
              <StarIcon className="w-5 h-5 fill-amber-400 text-amber-600" />
              <span className="font-black text-amber-950 text-sm">Star Earned!</span>
            </div>
            <p className="text-base font-bold text-slate-700 mb-5">
              You sorted all the fruits and vegetables! Outstanding classification skills!
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
