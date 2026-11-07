import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Volume2, Star as StarIcon, Check, Sparkles } from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { ActivityBottomNav } from './ActivityBottomNav';

interface OddOneOutProps {
  onCollectStar: () => void;
  onNavigateHome?: () => void;
  onNavigateNext?: () => void;
  onNavigatePrev?: () => void;
  isActivityCompleted?: boolean;
}

interface ItemOption {
  id: string;
  name: string;
  emoji: string;
  categoryPhrase: string; // e.g. "I am a flower.", "I am an animal."
  isOdd: boolean;
}

interface QuestionTemplate {
  id: string;
  groupCategoryName: string;
  sameItems: { name: string; emoji: string; categoryPhrase: string }[];
  oddItem: { name: string; emoji: string; categoryPhrase: string };
}

interface QuestionData {
  id: string;
  groupCategoryName: string;
  items: ItemOption[];
  oddItem: ItemOption;
}

// 10 Crystal-Clear, Child-Friendly Preschool Groups (4 same-category objects + 1 obvious odd object)
const QUESTION_TEMPLATES: QuestionTemplate[] = [
  {
    id: 'flowers_cat',
    groupCategoryName: 'Flowers',
    sameItems: [
      { name: 'Flower', emoji: '🌸', categoryPhrase: 'I am a flower.' },
      { name: 'Tulip', emoji: '🌷', categoryPhrase: 'I am a flower.' },
      { name: 'Daisy', emoji: '🌼', categoryPhrase: 'I am a flower.' },
      { name: 'Rose', emoji: '🌹', categoryPhrase: 'I am a flower.' },
    ],
    oddItem: { name: 'Cat', emoji: '🐱', categoryPhrase: 'I am an animal.' },
  },
  {
    id: 'animals_baby',
    groupCategoryName: 'Animals',
    sameItems: [
      { name: 'Dog', emoji: '🐶', categoryPhrase: 'I am an animal.' },
      { name: 'Cat', emoji: '🐱', categoryPhrase: 'I am an animal.' },
      { name: 'Rabbit', emoji: '🐰', categoryPhrase: 'I am an animal.' },
      { name: 'Bear', emoji: '🐻', categoryPhrase: 'I am an animal.' },
    ],
    oddItem: { name: 'Baby', emoji: '👶', categoryPhrase: 'I am a person.' },
  },
  {
    id: 'birds_fish',
    groupCategoryName: 'Birds',
    sameItems: [
      { name: 'Bird', emoji: '🐦', categoryPhrase: 'I am a bird.' },
      { name: 'Parrot', emoji: '🦜', categoryPhrase: 'I am a bird.' },
      { name: 'Owl', emoji: '🦉', categoryPhrase: 'I am a bird.' },
      { name: 'Penguin', emoji: '🐧', categoryPhrase: 'I am a bird.' },
    ],
    oddItem: { name: 'Fish', emoji: '🐟', categoryPhrase: 'I am a fish.' },
  },
  {
    id: 'fruits_carrot',
    groupCategoryName: 'Fruits',
    sameItems: [
      { name: 'Apple', emoji: '🍎', categoryPhrase: 'I am a fruit.' },
      { name: 'Banana', emoji: '🍌', categoryPhrase: 'I am a fruit.' },
      { name: 'Strawberry', emoji: '🍓', categoryPhrase: 'I am a fruit.' },
      { name: 'Orange', emoji: '🍊', categoryPhrase: 'I am a fruit.' },
    ],
    oddItem: { name: 'Carrot', emoji: '🥕', categoryPhrase: 'I am a vegetable.' },
  },
  {
    id: 'vegetables_apple',
    groupCategoryName: 'Vegetables',
    sameItems: [
      { name: 'Carrot', emoji: '🥕', categoryPhrase: 'I am a vegetable.' },
      { name: 'Broccoli', emoji: '🥦', categoryPhrase: 'I am a vegetable.' },
      { name: 'Cucumber', emoji: '🥒', categoryPhrase: 'I am a vegetable.' },
      { name: 'Corn', emoji: '🌽', categoryPhrase: 'I am a vegetable.' },
    ],
    oddItem: { name: 'Apple', emoji: '🍎', categoryPhrase: 'I am a fruit.' },
  },
  {
    id: 'toys_banana',
    groupCategoryName: 'Toys',
    sameItems: [
      { name: 'Teddy Bear', emoji: '🧸', categoryPhrase: 'I am a toy.' },
      { name: 'Soccer Ball', emoji: '⚽', categoryPhrase: 'I am a toy.' },
      { name: 'Kite', emoji: '🪁', categoryPhrase: 'I am a toy.' },
      { name: 'Yo-yo', emoji: '🪀', categoryPhrase: 'I am a toy.' },
    ],
    oddItem: { name: 'Banana', emoji: '🍌', categoryPhrase: 'I am a fruit.' },
  },
  {
    id: 'clothing_apple',
    groupCategoryName: 'Clothing',
    sameItems: [
      { name: 'Shirt', emoji: '👕', categoryPhrase: 'I am clothes.' },
      { name: 'Jeans', emoji: '👖', categoryPhrase: 'I am clothes.' },
      { name: 'Dress', emoji: '👗', categoryPhrase: 'I am clothes.' },
      { name: 'Cap', emoji: '🧢', categoryPhrase: 'I am clothes.' },
    ],
    oddItem: { name: 'Apple', emoji: '🍎', categoryPhrase: 'I am a fruit.' },
  },
  {
    id: 'school_dog',
    groupCategoryName: 'School Supplies',
    sameItems: [
      { name: 'Pencil', emoji: '✏️', categoryPhrase: 'I am a school item.' },
      { name: 'Book', emoji: '📚', categoryPhrase: 'I am a school item.' },
      { name: 'Crayon', emoji: '🖍️', categoryPhrase: 'I am a school item.' },
      { name: 'Scissors', emoji: '✂️', categoryPhrase: 'I am a school item.' },
    ],
    oddItem: { name: 'Dog', emoji: '🐶', categoryPhrase: 'I am an animal.' },
  },
  {
    id: 'animals_car',
    groupCategoryName: 'Animals',
    sameItems: [
      { name: 'Dog', emoji: '🐶', categoryPhrase: 'I am an animal.' },
      { name: 'Cat', emoji: '🐱', categoryPhrase: 'I am an animal.' },
      { name: 'Rabbit', emoji: '🐰', categoryPhrase: 'I am an animal.' },
      { name: 'Panda', emoji: '🐼', categoryPhrase: 'I am an animal.' },
    ],
    oddItem: { name: 'Car', emoji: '🚗', categoryPhrase: 'I am a vehicle.' },
  },
  {
    id: 'food_teddy',
    groupCategoryName: 'Foods',
    sameItems: [
      { name: 'Apple', emoji: '🍎', categoryPhrase: 'I am food.' },
      { name: 'Banana', emoji: '🍌', categoryPhrase: 'I am food.' },
      { name: 'Strawberry', emoji: '🍓', categoryPhrase: 'I am food.' },
      { name: 'Orange', emoji: '🍊', categoryPhrase: 'I am food.' },
    ],
    oddItem: { name: 'Teddy Bear', emoji: '🧸', categoryPhrase: 'I am a toy.' },
  },
];

const GRADIENTS = [
  'from-amber-100 via-orange-50 to-teal-100',
  'from-sky-100 via-cyan-50 to-amber-100',
  'from-emerald-100 via-teal-50 to-indigo-100',
  'from-rose-100 via-pink-50 to-sky-100',
  'from-violet-100 via-fuchsia-50 to-yellow-100',
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

// Generate 8 randomized questions per game
const generateGameQuestions = (): { questions: QuestionData[]; bgGradient: string } => {
  const shuffledTemplates = shuffleArray(QUESTION_TEMPLATES).slice(0, 8);

  const questions: QuestionData[] = shuffledTemplates.map((tmpl, qIdx) => {
    const sameItemsFormatted: ItemOption[] = tmpl.sameItems.map((item, idx) => ({
      id: `q${qIdx}_same_${idx}_${Math.random().toString(36).substring(2, 7)}`,
      name: item.name,
      emoji: item.emoji,
      categoryPhrase: item.categoryPhrase,
      isOdd: false,
    }));

    const oddItemFormatted: ItemOption = {
      id: `q${qIdx}_odd_${Math.random().toString(36).substring(2, 7)}`,
      name: tmpl.oddItem.name,
      emoji: tmpl.oddItem.emoji,
      categoryPhrase: tmpl.oddItem.categoryPhrase,
      isOdd: true,
    };

    // Shuffle all 5 items together so the odd object position changes unpredictably
    const combined = shuffleArray([...sameItemsFormatted, oddItemFormatted]);

    return {
      id: `question_${qIdx}_${tmpl.id}`,
      groupCategoryName: tmpl.groupCategoryName,
      items: combined,
      oddItem: oddItemFormatted,
    };
  });

  const bgGradient = GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)];
  return { questions, bgGradient };
};

export const OddOneOut: React.FC<OddOneOutProps> = ({
  onCollectStar,
  onNavigateHome,
  onNavigateNext,
  onNavigatePrev,
  isActivityCompleted = false,
}) => {
  const [{ questions, bgGradient }, setGame] = useState(generateGameQuestions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [shakingItemId, setShakingItemId] = useState<string | null>(null);
  const [droppedOddItem, setDroppedOddItem] = useState<ItemOption | null>(null);
  const [isSuccessing, setIsSuccessing] = useState(false);
  const [isAllFinished, setIsAllFinished] = useState(false);

  const dropZoneRef = useRef<HTMLDivElement>(null);

  // Voice instruction on start & question change
  useEffect(() => {
    if (!isAllFinished) {
      soundManager.speak('Find the one that does not belong!');
    }
  }, [currentQuestionIndex, isAllFinished]);

  const handlePlayAgain = () => {
    soundManager.playPop();
    soundManager.speak("Let's find the odd one out again!");
    setGame(generateGameQuestions());
    setCurrentQuestionIndex(0);
    setSelectedItemId(null);
    setShakingItemId(null);
    setDroppedOddItem(null);
    setIsSuccessing(false);
    setIsAllFinished(false);
  };

  // Evaluation logic for any item dropped or confirmed into the right-side basket
  const evaluateItem = (item: ItemOption) => {
    if (isSuccessing || isAllFinished) return;

    if (item.isOdd) {
      // CORRECT ODD OBJECT
      setIsSuccessing(true);
      setDroppedOddItem(item);
      soundManager.playSuccess();
      soundManager.speak(item.categoryPhrase);

      setTimeout(() => {
        soundManager.speak('Great job!');
      }, 600);

      setTimeout(() => {
        if (currentQuestionIndex + 1 >= questions.length) {
          // Finished all 8 challenges
          onCollectStar();
          setIsAllFinished(true);
          soundManager.playCelebration();
          soundManager.speak('Awesome! You found all the ones that did not belong!');
        } else {
          // Automatically advance to next question (NO manual next button)
          setCurrentQuestionIndex((prev) => prev + 1);
          setSelectedItemId(null);
          setDroppedOddItem(null);
          setIsSuccessing(false);
        }
      }, 1500);
    } else {
      // WRONG OBJECT: Belongs to the group
      soundManager.playPop();
      setShakingItemId(item.id);
      setSelectedItemId(null);

      // Voice: Identify category, then say "No, I belong here! I'm not the odd one!"
      soundManager.speak(item.categoryPhrase);
      setTimeout(() => {
        soundManager.speak("No, I belong here! I'm not the odd one!");
      }, 650);

      setTimeout(() => {
        setShakingItemId(null);
      }, 850);
    }
  };

  // Tap handler (Speaks category immediately)
  const handleItemTap = (item: ItemOption) => {
    if (isSuccessing || isAllFinished) return;
    soundManager.playPop();
    setSelectedItemId(item.id);
    soundManager.speak(item.categoryPhrase);
  };

  // Drag End handler: checks if released over the right-side Odd One Out basket
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: { point: { x: number; y: number } }, item: ItemOption) => {
    if (isSuccessing || isAllFinished) return;

    if (dropZoneRef.current) {
      const rect = dropZoneRef.current.getBoundingClientRect();
      const { x, y } = info.point;

      // Generous target detection for preschoolers
      if (x >= rect.left - 25 && x <= rect.right + 25 && y >= rect.top - 25 && y <= rect.bottom + 25) {
        evaluateItem(item);
        return;
      }
    }

    // Dropped outside: speak category and return to place
    soundManager.playPop();
    setSelectedItemId(item.id);
    soundManager.speak(item.categoryPhrase);
  };

  // Right basket click handler (accessible tap-to-drop flow)
  const handleDropZoneClick = () => {
    if (isSuccessing || isAllFinished) return;
    if (!selectedItemId) {
      soundManager.playPop();
      soundManager.speak('Drag the odd object here!');
      return;
    }

    const currentQ = questions[currentQuestionIndex];
    const selectedItem = currentQ.items.find((i) => i.id === selectedItemId);
    if (selectedItem) {
      evaluateItem(selectedItem);
    }
  };

  const currentQ = questions[currentQuestionIndex] || questions[0];
  const selectedItem = currentQ?.items.find((i) => i.id === selectedItemId);

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center justify-center p-2 sm:p-4">
      {/* Top Banner Header */}
      <div className="w-full bg-white/90 backdrop-blur-md border-4 border-amber-300 rounded-3xl p-3 sm:p-4 shadow-lg mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-amber-100 px-3 py-1.5 rounded-2xl border-2 border-amber-300">
            <span className="text-xl">🔍</span>
            <h1 className="text-base sm:text-xl font-black text-amber-950 uppercase tracking-wide">
              ODD ONE OUT
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
        className={`w-full bg-gradient-to-br ${bgGradient} border-4 border-amber-400 rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col items-center relative overflow-hidden min-h-[460px] justify-between transition-colors duration-500`}
      >
        {/* Instruction Subheader */}
        <div className="text-center mt-1 mb-3">
          <div className="inline-flex items-center gap-2 bg-white px-6 py-2 rounded-full border-4 border-amber-300 shadow-md mb-1">
            <button
              type="button"
              onClick={() => soundManager.speak('Find the one that does not belong!')}
              className="p-1 bg-amber-100 hover:bg-amber-200 rounded-full text-amber-900 transition-transform active:scale-90 cursor-pointer"
            >
              <Volume2 className="w-5 h-5" />
            </button>
            <h2 className="text-base sm:text-2xl font-black text-slate-800 tracking-tight uppercase">
              FIND THE ONE THAT DOES NOT BELONG!
            </h2>
          </div>
          <p className="text-xs sm:text-sm font-black text-slate-600 uppercase tracking-wide">
            Drag the odd object from the left into the basket on the right!
          </p>
        </div>

        {!isAllFinished ? (
          /* SIDE-BY-SIDE MAIN GAMEPLAY: LEFT (Object Group) vs RIGHT (Odd-One-Out Basket) */
          <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 my-auto items-stretch max-w-4xl">
            {/* LEFT SIDE: The 5 Objects in One Clear Group */}
            <div className="md:col-span-7 bg-white/85 backdrop-blur-xs border-4 border-amber-300 rounded-3xl p-4 sm:p-5 shadow-xl flex flex-col items-center justify-between min-h-[260px]">
              <div className="flex items-center justify-between w-full mb-2">
                <span className="text-xs font-black text-amber-950/80 uppercase tracking-wider bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
                  👀 Find the odd one!
                </span>
                <span className="text-xs font-bold text-slate-500">
                  4 belong together + 1 odd
                </span>
              </div>

              {/* Objects Container */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQ.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 my-auto py-2 w-full"
                >
                  {currentQ.items.map((item) => {
                    const isSelected = selectedItemId === item.id;
                    const isShaking = shakingItemId === item.id;
                    const isDropped = droppedOddItem?.id === item.id;

                    if (isDropped) {
                      // Disappear from left group once placed inside the basket
                      return (
                        <div
                          key={item.id}
                          className="w-16 h-20 sm:w-20 sm:h-24 rounded-2xl border-2 border-dashed border-amber-300/60 bg-amber-50/50 flex items-center justify-center"
                        >
                          <Sparkles className="w-6 h-6 text-amber-400 animate-pulse" />
                        </div>
                      );
                    }

                    return (
                      <motion.div
                        key={item.id}
                        drag
                        dragSnapToOrigin
                        dragMomentum={false}
                        whileDrag={{ scale: 1.25, zIndex: 60, cursor: 'grabbing' }}
                        onDragStart={() => {
                          setSelectedItemId(item.id);
                          soundManager.speak(item.categoryPhrase);
                        }}
                        onDragEnd={(e, info) => handleDragEnd(e, info, item)}
                        animate={
                          isShaking
                            ? { x: [-8, 8, -6, 6, -3, 3, 0] }
                            : isSelected
                            ? { scale: 1.08 }
                            : { scale: 1 }
                        }
                        transition={{ duration: 0.3 }}
                        onClick={() => handleItemTap(item)}
                        className={`relative flex flex-col items-center justify-center w-16 h-20 sm:w-20 sm:h-24 p-2 rounded-2xl border-3 sm:border-4 transition-colors cursor-grab active:cursor-grabbing select-none shadow-md touch-none ${
                          isSelected
                            ? 'bg-amber-100 border-amber-500 ring-4 ring-amber-300 shadow-lg'
                            : 'bg-white hover:bg-amber-50 border-slate-200 hover:border-amber-300'
                        }`}
                      >
                        {/* Static Object Visual */}
                        <span className="text-3xl sm:text-4xl select-none leading-none filter drop-shadow-xs pointer-events-none">
                          {item.emoji}
                        </span>
                        <span className="text-[10px] sm:text-xs font-black text-slate-700 mt-1 truncate max-w-[60px] sm:max-w-[72px] pointer-events-none">
                          {item.name}
                        </span>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </AnimatePresence>

              <div className="text-[11px] font-black text-amber-900/60 uppercase tracking-wide mt-1">
                👉 Drag the odd one to the right ➔
              </div>
            </div>

            {/* RIGHT SIDE: Dedicated Cute Wicker Basket / Odd One Out Target Tray */}
            <div
              ref={dropZoneRef}
              onClick={handleDropZoneClick}
              className={`md:col-span-5 relative rounded-b-[2.5rem] rounded-t-3xl p-4 sm:p-5 border-4 transition-all duration-200 flex flex-col items-center justify-between min-h-[260px] shadow-2xl cursor-pointer ${
                isSuccessing
                  ? 'border-emerald-600 bg-gradient-to-b from-emerald-100 via-amber-50 to-teal-100 ring-4 ring-emerald-300 scale-[1.02]'
                  : selectedItemId
                  ? 'border-amber-500 bg-gradient-to-b from-amber-100 via-orange-50 to-amber-200 ring-4 ring-amber-300 scale-[1.02]'
                  : 'border-amber-400 bg-gradient-to-b from-amber-50 via-yellow-50 to-orange-100 hover:border-amber-500'
              }`}
            >
              {/* Basket Handle Arc */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-28 h-6 border-t-4 border-l-4 border-r-4 border-amber-700/60 rounded-t-full pointer-events-none" />

              {/* Basket Header Badge */}
              <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black text-sm sm:text-base px-4 py-1.5 rounded-full shadow-md border-2 border-amber-300">
                <span className="text-lg">🧺</span>
                <span>ODD ONE OUT</span>
              </div>

              {/* Center Tray Container */}
              <div className="w-full flex-1 flex flex-col items-center justify-center my-2">
                {droppedOddItem ? (
                  /* Success Placed State Inside Basket */
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center justify-center"
                  >
                    <div className="flex items-center gap-1.5 bg-emerald-600 text-white font-black text-xs sm:text-sm px-3 py-1 rounded-full shadow-md mb-2">
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>FOUND!</span>
                    </div>
                    <span className="text-5xl sm:text-6xl filter drop-shadow-md">
                      {droppedOddItem.emoji}
                    </span>
                    <span className="text-xs sm:text-sm font-black text-emerald-950 mt-1">
                      {droppedOddItem.name}
                    </span>
                  </motion.div>
                ) : (
                  /* Waiting Target State */
                  <div className="w-full bg-amber-100/80 border-2 border-dashed border-amber-400/80 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-inner min-h-[110px]">
                    <span className="text-3xl mb-1 filter drop-shadow-xs">🧺</span>
                    <span className="text-xs sm:text-sm font-black text-amber-950 uppercase tracking-wide">
                      {selectedItem ? `👉 Tap to put ${selectedItem.name} here!` : 'Drag it here!'}
                    </span>
                    <span className="text-[11px] font-bold text-amber-800/70 mt-0.5">
                      Drop the one that does not belong
                    </span>
                  </div>
                )}
              </div>

              <div className="text-[11px] font-black text-amber-900/70 uppercase tracking-wide">
                {selectedItem ? 'Ready to drop!' : 'Waiting for odd object'}
              </div>
            </div>
          </div>
        ) : (
          /* Completion Screen with PLAY AGAIN button */
          <div className="flex flex-col items-center justify-center text-center my-auto p-6 bg-white/90 backdrop-blur-md rounded-3xl border-4 border-amber-400 shadow-xl max-w-lg">
            <div className="text-6xl mb-3 animate-bounce">🎉</div>
            <h3 className="text-2xl sm:text-3xl font-black text-amber-950 uppercase mb-2">
              ODD ONE OUT STAR!
            </h3>
            <div className="flex items-center gap-1.5 bg-amber-200 border-2 border-amber-400 px-4 py-1.5 rounded-full mb-3">
              <StarIcon className="w-5 h-5 fill-amber-400 text-amber-600" />
              <span className="font-black text-amber-950 text-sm">Star Earned!</span>
            </div>
            <p className="text-base font-bold text-slate-700 mb-5">
              You found all the ones that didn't belong! Outstanding visual observation and classification!
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
