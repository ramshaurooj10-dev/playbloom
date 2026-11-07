import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, RotateCcw, Volume2, Star as StarIcon, Check } from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { ActivityBottomNav } from './ActivityBottomNav';

interface BigSmallSortProps {
  onCollectStar: () => void;
  onNavigateHome?: () => void;
  onNavigateNext?: () => void;
  onNavigatePrev?: () => void;
  isActivityCompleted?: boolean;
}

interface RoundItem {
  id: string;
  name: string;
  emoji: string;
  size: 'big' | 'small';
}

interface ObjectDef {
  id: string;
  name: string;
  emoji: string;
  bgGradient: string;
}

interface RoundData {
  roundNum: number;
  question: 'big' | 'small';
  title: string;
  object: ObjectDef;
  bigItem: RoundItem;
  smallItem: RoundItem;
  bgGradient: string;
  displayItems: RoundItem[];
}

const OBJECT_POOL: ObjectDef[] = [
  { id: 'elephant', name: 'Elephant', emoji: '🐘', bgGradient: 'from-amber-100 to-rose-100' },
  { id: 'bear', name: 'Bear', emoji: '🧸', bgGradient: 'from-orange-100 to-amber-100' },
  { id: 'bus', name: 'Bus', emoji: '🚌', bgGradient: 'from-sky-100 to-blue-100' },
  { id: 'tree', name: 'Tree', emoji: '🌳', bgGradient: 'from-emerald-100 to-teal-100' },
  { id: 'whale', name: 'Whale', emoji: '🐳', bgGradient: 'from-blue-100 to-indigo-100' },
  { id: 'sun', name: 'Sun', emoji: '☀️', bgGradient: 'from-yellow-100 to-amber-100' },
  { id: 'castle', name: 'Castle', emoji: '🏰', bgGradient: 'from-purple-100 to-indigo-100' },
  { id: 'dino', name: 'Dinosaur', emoji: '🦕', bgGradient: 'from-lime-100 to-emerald-100' },
  { id: 'mouse', name: 'Mouse', emoji: '🐭', bgGradient: 'from-stone-100 to-amber-100' },
  { id: 'ladybug', name: 'Ladybug', emoji: '🐞', bgGradient: 'from-rose-100 to-pink-100' },
  { id: 'car', name: 'Car', emoji: '🚗', bgGradient: 'from-red-100 to-amber-100' },
  { id: 'flower', name: 'Flower', emoji: '🌸', bgGradient: 'from-pink-100 to-rose-100' },
  { id: 'fish', name: 'Goldfish', emoji: '🐟', bgGradient: 'from-cyan-100 to-blue-100' },
  { id: 'star', name: 'Little Star', emoji: '⭐', bgGradient: 'from-amber-100 to-yellow-100' },
  { id: 'key', name: 'Key', emoji: '🔑', bgGradient: 'from-yellow-100 to-amber-100' },
  { id: 'chick', name: 'Baby Chick', emoji: '🐥', bgGradient: 'from-amber-100 to-orange-100' },
];

const generateShuffledRounds = (): RoundData[] => {
  // 1. Pick 8 objects randomly from pool without repetition
  const selectedObjects = [...OBJECT_POOL]
    .sort(() => Math.random() - 0.5)
    .slice(0, 8);

  return selectedObjects.map((obj, index) => {
    // 2. Randomly select target size (BIG or SMALL)
    const targetSize: 'big' | 'small' = Math.random() < 0.5 ? 'big' : 'small';
    const title = targetSize === 'big'
      ? `Find the BIG ${obj.name}!`
      : `Find the SMALL ${obj.name}!`;

    const bigItem: RoundItem = {
      id: `${obj.id}_big`,
      name: `Big ${obj.name}`,
      emoji: obj.emoji,
      size: 'big',
    };

    const smallItem: RoundItem = {
      id: `${obj.id}_small`,
      name: `Small ${obj.name}`,
      emoji: obj.emoji,
      size: 'small',
    };

    // 3. Randomize button positions (left vs right)
    const displayItems = [bigItem, smallItem].sort(() => Math.random() - 0.5);

    return {
      roundNum: index + 1,
      question: targetSize,
      title,
      object: obj,
      bigItem,
      smallItem,
      bgGradient: obj.bgGradient,
      displayItems,
    };
  });
};

export const BigSmallSort: React.FC<BigSmallSortProps> = ({
  onCollectStar,
  onNavigateHome,
  onNavigateNext,
  onNavigatePrev,
  isActivityCompleted = false,
}) => {
  const [rounds, setRounds] = useState<RoundData[]>(() => generateShuffledRounds());
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [starsEarned, setStarsEarned] = useState<number>(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [shakeId, setShakeId] = useState<string | null>(null);
  const [isRoundFinished, setIsRoundFinished] = useState(false);
  const [isAllFinished, setIsAllFinished] = useState(false);

  const currentRound = rounds[currentRoundIndex];

  // Voice narration on round change
  useEffect(() => {
    if (currentRound && !isRoundFinished && !isAllFinished) {
      soundManager.speak(currentRound.title);
    }
  }, [currentRoundIndex, isRoundFinished, isAllFinished]);

  const handlePlayAgain = () => {
    soundManager.playPop();
    soundManager.speak("Let's play Big and Small Sort again!");
    setRounds(generateShuffledRounds());
    setCurrentRoundIndex(0);
    setSelectedId(null);
    setIsCorrect(null);
    setShakeId(null);
    setIsRoundFinished(false);
    setIsAllFinished(false);
  };

  const handleSelectItem = (item: RoundItem) => {
    if (isRoundFinished || isAllFinished) return;

    setSelectedId(item.id);
    const targetSize = currentRound.question;

    if (item.size === targetSize) {
      // Correct answer
      soundManager.playSuccess();
      soundManager.speak(`Great job! That is the ${item.size.toUpperCase()} ${currentRound.object.name}!`);
      setIsCorrect(true);
      setIsRoundFinished(true);
      setStarsEarned((prev) => prev + 1);

      // Check if this was the last round
      if (currentRoundIndex === rounds.length - 1) {
        onCollectStar();
        setTimeout(() => {
          setIsAllFinished(true);
          soundManager.playCelebration();
          soundManager.speak("Amazing! You finished Big and Small Sort!");
        }, 1200);
      } else {
        setTimeout(() => {
          handleNextRound();
        }, 1200);
      }
    } else {
      // Incorrect answer
      soundManager.playPop();
      soundManager.speak(`Oops! That is the ${item.size.toUpperCase()} one. Try finding the ${targetSize.toUpperCase()} one!`);
      setIsCorrect(false);
      setShakeId(item.id);
      setTimeout(() => {
        setShakeId(null);
        setSelectedId(null);
        setIsCorrect(null);
      }, 900);
    }
  };

  const handleNextRound = () => {
    soundManager.playPop();
    if (currentRoundIndex < rounds.length - 1) {
      setCurrentRoundIndex((prev) => prev + 1);
      setSelectedId(null);
      setIsCorrect(null);
      setShakeId(null);
      setIsRoundFinished(false);
    } else {
      setIsAllFinished(true);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center p-2 sm:p-4">
      {/* Top Banner Header: Title, Round & Star Counts ONLY */}
      <div className="w-full bg-white/90 backdrop-blur-md border-4 border-amber-300 rounded-3xl p-3 sm:p-4 shadow-lg mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-amber-100 px-3 py-1.5 rounded-2xl border-2 border-amber-300">
            <span className="text-xl">🐘</span>
            <h1 className="text-base sm:text-xl font-black text-amber-950 uppercase tracking-wide">
              Big & Small Sort
            </h1>
          </div>
        </div>

        {/* Stars & Progress Badges */}
        <div className="flex items-center gap-2">
          <div className="bg-blue-100 text-blue-900 font-black text-xs sm:text-sm px-3 py-1.5 rounded-2xl border-2 border-blue-300 flex items-center gap-1">
            <span>{currentRoundIndex + 1} / 8</span>
          </div>

          <div className="bg-amber-400 text-amber-950 font-black text-xs sm:text-sm px-3 py-1.5 rounded-2xl border-2 border-amber-300 flex items-center gap-1 shadow-xs">
            <StarIcon className="w-4 h-4 fill-amber-100 stroke-amber-950" />
            <span>{starsEarned}</span>
          </div>
        </div>
      </div>

      {/* Main Activity Card */}
      <div className={`w-full bg-gradient-to-br ${currentRound.bgGradient} border-4 border-amber-400 rounded-3xl p-4 sm:p-8 shadow-2xl flex flex-col items-center relative overflow-hidden min-h-[420px] justify-between`}>
        {/* Question Banner */}
        <div className="text-center mt-4 mb-4">
          <div className="inline-flex items-center gap-2 bg-white px-6 py-2.5 rounded-full border-4 border-amber-300 shadow-md mb-2">
            <button
              type="button"
              onClick={() => soundManager.speak(currentRound.title)}
              className="p-1 bg-amber-100 hover:bg-amber-200 rounded-full text-amber-900 transition-transform active:scale-90 cursor-pointer"
              title="Repeat Sound"
            >
              <Volume2 className="w-5 h-5" />
            </button>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
              {currentRound.title}
            </h2>
          </div>
          <p className="text-xs sm:text-sm font-black text-slate-600 uppercase tracking-wide">
            Tap the {currentRound.question === 'big' ? 'BIG' : 'SMALL'} {currentRound.object.name} {currentRound.object.emoji}!
          </p>
        </div>

        {/* 2 Big vs Small Choice Cards */}
        {!isAllFinished ? (
          <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-6 my-auto items-center justify-center">
            {currentRound.displayItems.map((item) => {
              const isBig = item.size === 'big';
              return (
                <motion.button
                  key={item.id}
                  type="button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.95 }}
                  animate={shakeId === item.id ? { x: [-10, 10, -10, 10, 0] } : {}}
                  onClick={() => handleSelectItem(item)}
                  className={`bg-white border-4 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col items-center justify-center cursor-pointer relative transition-colors ${
                    selectedId === item.id && isCorrect
                      ? 'border-emerald-500 bg-emerald-50 ring-4 ring-emerald-300'
                      : selectedId === item.id && isCorrect === false
                      ? 'border-rose-500 bg-rose-50'
                      : 'border-amber-300 hover:border-amber-400'
                  }`}
                >
                  <span
                    className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full mb-2 ${
                      isBig ? 'text-amber-700 bg-amber-100' : 'text-slate-500 bg-slate-100'
                    }`}
                  >
                    {isBig ? 'BIG SIZE' : 'SMALL SIZE'}
                  </span>
                  <span
                    className={`my-2 drop-shadow-md select-none ${
                      isBig ? 'text-7xl sm:text-8xl transform scale-125' : 'text-3xl sm:text-4xl'
                    }`}
                  >
                    {item.emoji}
                  </span>
                  <span className="text-lg sm:text-xl font-black text-slate-800 mt-2">
                    {item.name}
                  </span>

                  {selectedId === item.id && isCorrect && (
                    <div className="absolute top-3 right-3 bg-emerald-500 text-white rounded-full p-2 shadow-md">
                      <Check className="w-6 h-6 stroke-[3]" />
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        ) : (
          /* Completion Screen with PLAY AGAIN button */
          <div className="flex flex-col items-center justify-center text-center my-auto p-6 bg-white/90 backdrop-blur-md rounded-3xl border-4 border-amber-400 shadow-xl max-w-lg">
            <div className="text-6xl mb-3 animate-bounce">🎉</div>
            <h3 className="text-2xl sm:text-3xl font-black text-amber-950 uppercase mb-2">
              BIG & SMALL SORT COMPLETE!
            </h3>
            <div className="flex items-center gap-1.5 bg-amber-200 border-2 border-amber-400 px-4 py-1.5 rounded-full mb-3">
              <StarIcon className="w-5 h-5 fill-amber-400 text-amber-600" />
              <span className="font-black text-amber-950 text-sm">Star Earned!</span>
            </div>
            <p className="text-base font-bold text-slate-700 mb-5">
              You matched all Big & Small items perfectly! Outstanding job!
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
