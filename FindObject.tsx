import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, RotateCcw, Home, Sparkles, Star, Check } from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { ActivityBottomNav } from './ActivityBottomNav';

interface FindObjectProps {
  onCollectStar: () => void;
  onNavigateHome?: () => void;
  onNavigateNext?: () => void;
  onNavigatePrev?: () => void;
  isActivityCompleted?: boolean;
}

interface ObjectChoice {
  id: string;
  name: string;
  emoji: string;
  bgColor: string;
  borderColor: string;
}

interface RoundData {
  target: ObjectChoice;
  choices: ObjectChoice[];
}

const ROUNDS_DATA: RoundData[] = [
  // Round 1: Rocket
  {
    target: { id: 'rocket', name: 'Rocket', emoji: '🚀', bgColor: 'bg-indigo-100 hover:bg-indigo-200', borderColor: 'border-indigo-400' },
    choices: [
      { id: 'car', name: 'Car', emoji: '🚗', bgColor: 'bg-red-100 hover:bg-red-200', borderColor: 'border-red-400' },
      { id: 'rocket', name: 'Rocket', emoji: '🚀', bgColor: 'bg-indigo-100 hover:bg-indigo-200', borderColor: 'border-indigo-400' },
      { id: 'apple', name: 'Apple', emoji: '🍎', bgColor: 'bg-rose-100 hover:bg-rose-200', borderColor: 'border-rose-400' },
      { id: 'star', name: 'Star', emoji: '⭐', bgColor: 'bg-amber-100 hover:bg-amber-200', borderColor: 'border-amber-400' },
    ],
  },
  // Round 2: Apple
  {
    target: { id: 'apple', name: 'Apple', emoji: '🍎', bgColor: 'bg-rose-100 hover:bg-rose-200', borderColor: 'border-rose-400' },
    choices: [
      { id: 'ball', name: 'Ball', emoji: '⚽', bgColor: 'bg-blue-100 hover:bg-blue-200', borderColor: 'border-blue-400' },
      { id: 'teddy_bear', name: 'Teddy Bear', emoji: '🧸', bgColor: 'bg-amber-100 hover:bg-amber-200', borderColor: 'border-amber-400' },
      { id: 'apple', name: 'Apple', emoji: '🍎', bgColor: 'bg-rose-100 hover:bg-rose-200', borderColor: 'border-rose-400' },
      { id: 'duck', name: 'Duck', emoji: '🦆', bgColor: 'bg-yellow-100 hover:bg-yellow-200', borderColor: 'border-yellow-400' },
    ],
  },
  // Round 3: Teddy Bear
  {
    target: { id: 'teddy_bear', name: 'Teddy Bear', emoji: '🧸', bgColor: 'bg-amber-100 hover:bg-amber-200', borderColor: 'border-amber-400' },
    choices: [
      { id: 'teddy_bear', name: 'Teddy Bear', emoji: '🧸', bgColor: 'bg-amber-100 hover:bg-amber-200', borderColor: 'border-amber-400' },
      { id: 'cap', name: 'Cap', emoji: '🧢', bgColor: 'bg-cyan-100 hover:bg-cyan-200', borderColor: 'border-cyan-400' },
      { id: 'flower', name: 'Flower', emoji: '🌸', bgColor: 'bg-pink-100 hover:bg-pink-200', borderColor: 'border-pink-400' },
      { id: 'banana', name: 'Banana', emoji: '🍌', bgColor: 'bg-yellow-100 hover:bg-yellow-200', borderColor: 'border-yellow-400' },
    ],
  },
  // Round 4: Star
  {
    target: { id: 'star', name: 'Star', emoji: '⭐', bgColor: 'bg-amber-100 hover:bg-amber-200', borderColor: 'border-amber-400' },
    choices: [
      { id: 'balloon', name: 'Balloon', emoji: '🎈', bgColor: 'bg-rose-100 hover:bg-rose-200', borderColor: 'border-rose-400' },
      { id: 'cat', name: 'Cat', emoji: '🐱', bgColor: 'bg-orange-100 hover:bg-orange-200', borderColor: 'border-orange-400' },
      { id: 'star', name: 'Star', emoji: '⭐', bgColor: 'bg-amber-100 hover:bg-amber-200', borderColor: 'border-amber-400' },
      { id: 'shoe', name: 'Shoe', emoji: '👟', bgColor: 'bg-emerald-100 hover:bg-emerald-200', borderColor: 'border-emerald-400' },
    ],
  },
  // Round 5: Car
  {
    target: { id: 'car', name: 'Car', emoji: '🚗', bgColor: 'bg-red-100 hover:bg-red-200', borderColor: 'border-red-400' },
    choices: [
      { id: 'book', name: 'Book', emoji: '📚', bgColor: 'bg-emerald-100 hover:bg-emerald-200', borderColor: 'border-emerald-400' },
      { id: 'car', name: 'Car', emoji: '🚗', bgColor: 'bg-red-100 hover:bg-red-200', borderColor: 'border-red-400' },
      { id: 'sun', name: 'Sun', emoji: '☀️', bgColor: 'bg-amber-100 hover:bg-amber-200', borderColor: 'border-amber-400' },
      { id: 'fish', name: 'Fish', emoji: '🐟', bgColor: 'bg-sky-100 hover:bg-sky-200', borderColor: 'border-sky-400' },
    ],
  },
  // Round 6: Ball
  {
    target: { id: 'ball', name: 'Ball', emoji: '⚽', bgColor: 'bg-blue-100 hover:bg-blue-200', borderColor: 'border-blue-400' },
    choices: [
      { id: 'butterfly', name: 'Butterfly', emoji: '🦋', bgColor: 'bg-purple-100 hover:bg-purple-200', borderColor: 'border-purple-400' },
      { id: 'cake', name: 'Cake', emoji: '🎂', bgColor: 'bg-pink-100 hover:bg-pink-200', borderColor: 'border-pink-400' },
      { id: 'dog', name: 'Dog', emoji: '🐶', bgColor: 'bg-amber-100 hover:bg-amber-200', borderColor: 'border-amber-400' },
      { id: 'ball', name: 'Ball', emoji: '⚽', bgColor: 'bg-blue-100 hover:bg-blue-200', borderColor: 'border-blue-400' },
    ],
  },
];

export const FindObject: React.FC<FindObjectProps> = ({
  onCollectStar,
  onNavigateHome,
  onNavigateNext,
  onNavigatePrev,
  isActivityCompleted,
}) => {
  const [currentRoundIdx, setCurrentRoundIdx] = useState<number>(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [wobbleId, setWobbleId] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isGameFinished, setIsGameFinished] = useState<boolean>(false);

  const totalRounds = ROUNDS_DATA.length;
  const currentRound = ROUNDS_DATA[currentRoundIdx];

  // Speak prompt when round changes
  useEffect(() => {
    if (!isGameFinished && currentRound) {
      const timer = setTimeout(() => {
        soundManager.speak(`Find the ${currentRound.target.name}!`);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [currentRoundIdx, isGameFinished, currentRound]);

  const handleSpeakPrompt = () => {
    if (currentRound) {
      soundManager.speak(`Find the ${currentRound.target.name}!`);
    }
  };

  const handleChoiceClick = (choice: ObjectChoice) => {
    if (isSuccess || isGameFinished) return;

    if (choice.id === currentRound.target.id) {
      // Correct Match!
      setSelectedId(choice.id);
      setIsSuccess(true);
      soundManager.playSuccess();
      soundManager.playStarCatch();
      soundManager.speak(`Great job! You found the ${choice.name}!`);

      setTimeout(() => {
        setIsSuccess(false);
        setSelectedId(null);

        if (currentRoundIdx + 1 < totalRounds) {
          setCurrentRoundIdx((prev) => prev + 1);
        } else {
          // All 6 rounds complete!
          setIsGameFinished(true);
          onCollectStar();
          soundManager.playCelebration();
          soundManager.speak('Awesome! You completed Find the Object!');
        }
      }, 1200);
    } else {
      // Incorrect Match
      setWobbleId(choice.id);
      soundManager.playPop();
      soundManager.speak(`Oops, that is the ${choice.name}! Find the ${currentRound.target.name}!`);
      setTimeout(() => setWobbleId(null), 500);
    }
  };

  const handleRestart = () => {
    soundManager.playPop();
    setCurrentRoundIdx(0);
    setIsGameFinished(false);
    setSelectedId(null);
    setIsSuccess(false);
    setWobbleId(null);
  };

  return (
    <div
      id="find-object-activity"
      className="w-full max-w-4xl mx-auto flex flex-col gap-4 pb-6 select-none"
    >
      {/* 1. TOP HEADER BAR */}
      <div className="w-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 rounded-3xl p-3 sm:p-4 shadow-lg border-4 border-emerald-700 text-white flex items-center justify-between gap-3">
        {/* Home Button */}
        <button
          id="find-object-home-btn"
          onClick={onNavigateHome}
          aria-label="Back to Home"
          className="bg-black/25 hover:bg-black/40 active:scale-95 text-white px-3.5 py-2 rounded-2xl border-2 border-white/30 shadow-sm transition-transform flex items-center gap-1.5 font-black text-sm cursor-pointer shrink-0"
        >
          <Home className="w-5 h-5 text-amber-200" />
          <span className="hidden sm:inline">Home</span>
        </button>

        {/* Big Instruction Prompt with Speaker */}
        <div className="flex items-center gap-2 sm:gap-3 justify-center text-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl shadow-inner border border-white/40 shrink-0">
            {currentRound?.target.emoji || '🔍'}
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-wider text-white uppercase drop-shadow-sm leading-tight">
              FIND THE {currentRound?.target.name}!
            </h1>
            <button
              id="find-object-voice-btn"
              onClick={handleSpeakPrompt}
              aria-label="Hear Prompt"
              className="bg-amber-300 hover:bg-amber-200 active:scale-90 text-amber-950 p-1.5 sm:p-2 rounded-xl border border-white shadow-sm transition-transform cursor-pointer shrink-0"
              title="Hear Prompt"
            >
              <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-amber-950" />
            </button>
          </div>
        </div>

        {/* Round Counter */}
        <div className="bg-black/30 px-3.5 py-1.5 rounded-2xl border border-white/30 text-white font-black text-xs sm:text-sm flex items-center gap-1.5 shrink-0">
          <span className="text-amber-300">★</span>
          <span>
            {currentRoundIdx + 1} / {totalRounds}
          </span>
        </div>
      </div>

      {/* 2. MAIN ACTIVITY PLAYGROUND */}
      {!isGameFinished ? (
        <div className="w-full bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-xl border-4 border-emerald-300 flex flex-col items-center gap-6 min-h-[420px] justify-center">
          {/* Target Object Spotlight Banner */}
          <div className="bg-gradient-to-r from-emerald-100 via-teal-50 to-emerald-100 border-3 border-emerald-300 rounded-2xl px-6 py-3 shadow-inner flex items-center gap-3">
            <span className="text-sm sm:text-base font-bold text-emerald-800 uppercase tracking-wide">
              Target Object:
            </span>
            <span className="text-3xl animate-bounce">{currentRound.target.emoji}</span>
            <span className="text-xl sm:text-2xl font-black text-emerald-900">
              {currentRound.target.name}
            </span>
          </div>

          {/* 4 Large Tap-Friendly Choice Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 w-full max-w-3xl">
            {currentRound.choices.map((choice) => {
              const isSelected = selectedId === choice.id;
              const isWobbling = wobbleId === choice.id;

              return (
                <motion.button
                  key={choice.id}
                  id={`choice-btn-${choice.id}`}
                  onClick={() => handleChoiceClick(choice)}
                  animate={
                    isSelected
                      ? { scale: [1, 1.15, 1.08], rotate: [0, -6, 6, 0] }
                      : isWobbling
                      ? { x: [-8, 8, -6, 6, 0], rotate: [-8, 8, -5, 5, 0] }
                      : { scale: 1, rotate: 0 }
                  }
                  transition={{ duration: 0.4 }}
                  className={`relative flex flex-col items-center justify-center p-5 sm:p-6 rounded-3xl border-4 ${
                    choice.borderColor
                  } ${choice.bgColor} shadow-lg hover:shadow-xl transition-all cursor-pointer select-none active:scale-95 ${
                    isSelected ? 'ring-4 ring-emerald-400 bg-emerald-100' : ''
                  }`}
                  aria-label={choice.name}
                >
                  {/* Choice Emoji */}
                  <span className="text-6xl sm:text-7xl mb-3 drop-shadow-sm">
                    {choice.emoji}
                  </span>

                  {/* Choice Label */}
                  <span className="text-lg sm:text-xl font-black text-slate-800 tracking-wide">
                    {choice.name}
                  </span>

                  {/* Success Sparkles */}
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: [0, 1.3, 1], opacity: 1 }}
                      className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    >
                      <Sparkles className="w-16 h-16 text-yellow-400 animate-spin fill-yellow-200" />
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* 6 Round Progress Indicator Dots */}
          <div className="flex items-center gap-2 pt-2">
            {ROUNDS_DATA.map((_, idx) => (
              <div
                key={idx}
                className={`h-3 rounded-full transition-all duration-300 ${
                  idx < currentRoundIdx
                    ? 'w-6 bg-emerald-500 shadow-xs'
                    : idx === currentRoundIdx
                    ? 'w-10 bg-emerald-600 shadow-md animate-pulse'
                    : 'w-4 bg-slate-300'
                }`}
              />
            ))}
          </div>
        </div>
      ) : (
        /* 3. COMPLETION CELEBRATION SCREEN */
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 18 }}
          id="find-object-completion-screen"
          className="w-full bg-gradient-to-b from-emerald-500 via-teal-600 to-emerald-700 rounded-3xl p-6 sm:p-10 border-4 border-emerald-400 shadow-2xl text-white flex flex-col items-center justify-center text-center gap-5 min-h-[420px]"
        >
          <div className="relative">
            <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-tr from-amber-300 to-yellow-100 rounded-full border-4 border-white flex items-center justify-center text-5xl sm:text-6xl shadow-xl animate-bounce">
              🎯
            </div>
            <Sparkles className="w-10 h-10 text-yellow-300 absolute -top-2 -right-2 animate-spin" />
            <Star className="w-8 h-8 text-amber-300 fill-amber-300 absolute -bottom-1 -left-2 animate-pulse" />
          </div>

          <div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-wide text-white drop-shadow-md">
              GREAT JOB!
            </h2>
            <p className="text-sm sm:text-lg text-emerald-100 font-bold max-w-md mt-1">
              You found all 6 objects correctly! You are super sharp!
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
            <button
              id="find-object-replay-btn"
              onClick={handleRestart}
              className="bg-amber-400 hover:bg-amber-300 active:scale-95 text-amber-950 font-black text-base sm:text-xl px-8 py-3.5 rounded-2xl border-3 border-white shadow-xl flex items-center gap-2 cursor-pointer transition-transform"
            >
              <RotateCcw className="w-6 h-6 stroke-[2.5]" />
              <span>PLAY AGAIN</span>
            </button>

            <button
              id="find-object-finish-home-btn"
              onClick={onNavigateHome}
              className="bg-black/30 hover:bg-black/50 active:scale-95 text-white font-bold text-base sm:text-lg px-6 py-3.5 rounded-2xl border-2 border-white/40 shadow-md flex items-center gap-2 cursor-pointer transition-transform"
            >
              <Home className="w-5 h-5 text-amber-200" />
              <span>Back to Home</span>
            </button>
          </div>
        </motion.div>
      )}

      {/* 4. BOTTOM NAVIGATION */}
      <div className="w-full flex justify-center mt-2">
        <ActivityBottomNav
          onNavigatePrev={onNavigatePrev}
          onNavigateHome={onNavigateHome}
          onNavigateNext={onNavigateNext}
          isNextUnlocked={isGameFinished || Boolean(isActivityCompleted)}
        />
      </div>
    </div>
  );
};
