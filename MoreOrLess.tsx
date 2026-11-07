import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { RotateCcw, Volume2, Star as StarIcon, Check } from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { ActivityBottomNav } from './ActivityBottomNav';

interface MoreOrLessProps {
  onCollectStar: () => void;
  onNavigateHome?: () => void;
  onNavigateNext?: () => void;
  onNavigatePrev?: () => void;
  isActivityCompleted?: boolean;
}

interface ObjectDef {
  id: string;
  name: string;
  emoji: string;
  bgGradient: string;
}

interface GroupOption {
  id: string;
  count: number;
  emoji: string;
}

interface RoundData {
  roundNum: number;
  targetType: 'more' | 'less';
  object: ObjectDef;
  optionA: GroupOption;
  optionB: GroupOption;
  displayOptions: GroupOption[];
}

const OBJECT_POOL: ObjectDef[] = [
  { id: 'apple', name: 'Apples', emoji: '🍎', bgGradient: 'from-rose-100 to-amber-100' },
  { id: 'star', name: 'Stars', emoji: '⭐', bgGradient: 'from-amber-100 to-yellow-100' },
  { id: 'cookie', name: 'Cookies', emoji: '🍪', bgGradient: 'from-amber-100 to-orange-100' },
  { id: 'balloon', name: 'Balloons', emoji: '🎈', bgGradient: 'from-pink-100 to-rose-100' },
  { id: 'flower', name: 'Flowers', emoji: '🌸', bgGradient: 'from-pink-100 to-purple-100' },
  { id: 'fish', name: 'Fish', emoji: '🐟', bgGradient: 'from-sky-100 to-blue-100' },
  { id: 'duck', name: 'Ducks', emoji: '🦆', bgGradient: 'from-yellow-100 to-amber-100' },
  { id: 'strawberry', name: 'Strawberries', emoji: '🍓', bgGradient: 'from-red-100 to-rose-100' },
  { id: 'candy', name: 'Candies', emoji: '🍬', bgGradient: 'from-purple-100 to-pink-100' },
  { id: 'heart', name: 'Hearts', emoji: '💖', bgGradient: 'from-rose-100 to-pink-100' },
];

const generateShuffledRounds = (): RoundData[] => {
  const selectedObjects = [...OBJECT_POOL]
    .sort(() => Math.random() - 0.5)
    .slice(0, 8);

  return selectedObjects.map((obj, index) => {
    const targetType: 'more' | 'less' = Math.random() < 0.5 ? 'more' : 'less';

    // Generate two distinct counts between 1 and 6
    let count1 = Math.floor(Math.random() * 5) + 2; // 2 to 6
    let count2 = Math.floor(Math.random() * 4) + 1; // 1 to 4
    while (count1 === count2) {
      count2 = Math.floor(Math.random() * 5) + 1;
    }

    const optionA: GroupOption = {
      id: `${obj.id}_c${count1}`,
      count: count1,
      emoji: obj.emoji,
    };

    const optionB: GroupOption = {
      id: `${obj.id}_c${count2}`,
      count: count2,
      emoji: obj.emoji,
    };

    const displayOptions = [optionA, optionB].sort(() => Math.random() - 0.5);

    return {
      roundNum: index + 1,
      targetType,
      object: obj,
      optionA,
      optionB,
      displayOptions,
    };
  });
};

export const MoreOrLess: React.FC<MoreOrLessProps> = ({
  onCollectStar,
  onNavigateHome,
  onNavigateNext,
  onNavigatePrev,
  isActivityCompleted = false,
}) => {
  const [rounds, setRounds] = useState<RoundData[]>(() => generateShuffledRounds());
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [starsEarned, setStarsEarned] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [shakeId, setShakeId] = useState<string | null>(null);
  const [isRoundFinished, setIsRoundFinished] = useState(false);
  const [isAllFinished, setIsAllFinished] = useState(false);

  const currentRound = rounds[currentRoundIndex];

  // Audio prompt
  useEffect(() => {
    if (!currentRound || isAllFinished) return;
    const word = currentRound.targetType === 'more' ? 'more' : 'less';
    soundManager.speak(`Which group has ${word}?`);
  }, [currentRoundIndex, isAllFinished]);

  const handlePlayAgain = () => {
    soundManager.playPop();
    soundManager.speak("Let's play More or Less again!");
    setRounds(generateShuffledRounds());
    setCurrentRoundIndex(0);
    setSelectedOptionId(null);
    setIsCorrect(null);
    setShakeId(null);
    setIsRoundFinished(false);
    setIsAllFinished(false);
  };

  const handleSelectOption = (option: GroupOption) => {
    if (isRoundFinished || isAllFinished) return;

    setSelectedOptionId(option.id);

    const otherOption = currentRound.displayOptions.find((o) => o.id !== option.id)!;
    const isTargetMore = currentRound.targetType === 'more';
    const isAnswerCorrect = isTargetMore
      ? option.count > otherOption.count
      : option.count < otherOption.count;

    if (isAnswerCorrect) {
      soundManager.playSuccess();
      soundManager.speak('Great job!');
      setIsCorrect(true);
      setIsRoundFinished(true);
      setStarsEarned((prev) => prev + 1);

      if (currentRoundIndex === rounds.length - 1) {
        onCollectStar();
        setTimeout(() => {
          setIsAllFinished(true);
          soundManager.playCelebration();
          soundManager.speak('Fantastic! You completed More or Less!');
        }, 1200);
      } else {
        setTimeout(() => {
          handleNextRound();
        }, 1200);
      }
    } else {
      soundManager.playPop();
      soundManager.speak('Oops, try again!');
      setIsCorrect(false);
      setShakeId(option.id);
      setTimeout(() => {
        setShakeId(null);
        setSelectedOptionId(null);
        setIsCorrect(null);
      }, 900);
    }
  };

  const handleNextRound = () => {
    if (currentRoundIndex < rounds.length - 1) {
      setCurrentRoundIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setIsCorrect(null);
      setShakeId(null);
      setIsRoundFinished(false);
    } else {
      setIsAllFinished(true);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center p-2 sm:p-4">
      {/* Top Banner Header: Icon, Title, Round & Stars ONLY (NO middle buttons) */}
      <div className="w-full bg-white/90 backdrop-blur-md border-4 border-amber-300 rounded-3xl p-3 sm:p-4 shadow-lg mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-amber-100 px-3 py-1.5 rounded-2xl border-2 border-amber-300">
            <span className="text-xl">⚖️</span>
            <h1 className="text-base sm:text-xl font-black text-amber-950 uppercase tracking-wide">
              More or Less
            </h1>
          </div>
        </div>

        {/* Progress & Stars Badges */}
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
      <div
        className={`w-full bg-gradient-to-br ${currentRound.object.bgGradient} border-4 border-amber-400 rounded-3xl p-4 sm:p-8 shadow-2xl flex flex-col items-center relative overflow-hidden min-h-[420px] justify-between transition-colors duration-500`}
      >
        <div className="text-center mt-2 mb-4">
          <div className="inline-flex items-center gap-2 bg-white px-6 py-2.5 rounded-full border-4 border-amber-300 shadow-md mb-2">
            <button
              type="button"
              onClick={() =>
                soundManager.speak(
                  `Which group has ${currentRound.targetType === 'more' ? 'more' : 'less'}?`
                )
              }
              className="p-1 bg-amber-100 hover:bg-amber-200 rounded-full text-amber-900 transition-transform active:scale-90 cursor-pointer"
            >
              <Volume2 className="w-5 h-5" />
            </button>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
              {currentRound.targetType === 'more' ? 'MORE' : 'LESS'}
            </h2>
          </div>
          <p className="text-xs sm:text-sm font-black text-slate-600 uppercase tracking-wide">
            Tap the group with {currentRound.targetType === 'more' ? 'MORE' : 'FEWER'}{' '}
            {currentRound.object.name}!
          </p>
        </div>

        {/* 2 Option Cards */}
        {!isAllFinished ? (
          <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-6 my-auto items-center justify-center">
            {currentRound.displayOptions.map((opt) => {
              return (
                <motion.button
                  key={opt.id}
                  type="button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.95 }}
                  animate={shakeId === opt.id ? { x: [-10, 10, -10, 10, 0] } : {}}
                  onClick={() => handleSelectOption(opt)}
                  className={`bg-white border-4 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col items-center justify-center cursor-pointer relative transition-colors ${
                    selectedOptionId === opt.id && isCorrect
                      ? 'border-emerald-500 bg-emerald-50 ring-4 ring-emerald-300'
                      : selectedOptionId === opt.id && isCorrect === false
                      ? 'border-rose-500 bg-rose-50'
                      : 'border-amber-300 hover:border-amber-400'
                  }`}
                >
                  {/* Grid of emojis showing count */}
                  <div className="flex flex-wrap items-center justify-center gap-2 my-2 min-h-[90px] max-w-[220px]">
                    {Array.from({ length: opt.count }).map((_, i) => (
                      <span
                        key={i}
                        className="text-4xl sm:text-5xl drop-shadow-md select-none transform hover:scale-110 transition-transform"
                      >
                        {opt.emoji}
                      </span>
                    ))}
                  </div>

                  <span className="text-lg sm:text-xl font-black text-slate-800 mt-2">
                    {opt.count} {currentRound.object.name}
                  </span>

                  {selectedOptionId === opt.id && isCorrect && (
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
              MORE OR LESS COMPLETE!
            </h3>
            <div className="flex items-center gap-1.5 bg-amber-200 border-2 border-amber-400 px-4 py-1.5 rounded-full mb-3">
              <StarIcon className="w-5 h-5 fill-amber-400 text-amber-600" />
              <span className="font-black text-amber-950 text-sm">Star Earned!</span>
            </div>
            <p className="text-base font-bold text-slate-700 mb-5">
              You compared More & Less perfectly! Fantastic job!
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
