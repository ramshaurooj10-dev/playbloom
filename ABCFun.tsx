import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, ArrowLeft, ArrowRight, Home, Sparkles, Trophy, RotateCcw, Star } from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface ABCFunProps {
  onCollectStar: () => void;
  onNavigateHome?: () => void;
  onNavigateNext?: () => void;
  onNavigatePrev?: () => void;
  isActivityCompleted?: boolean;
}

interface ABCItem {
  letter: string;
  lowercase: string;
  word: string;
  emoji: string;
  color: string;
  borderColor: string;
  bgGradient: string;
}

const ALPHABET: ABCItem[] = [
  { letter: 'A', lowercase: 'a', word: 'Apple', emoji: '🍎', color: 'text-red-600', borderColor: 'border-red-400', bgGradient: 'from-red-100 via-rose-50 to-orange-100' },
  { letter: 'B', lowercase: 'b', word: 'Ball', emoji: '⚽', color: 'text-blue-600', borderColor: 'border-blue-400', bgGradient: 'from-blue-100 via-sky-50 to-indigo-100' },
  { letter: 'C', lowercase: 'c', word: 'Cat', emoji: '🐱', color: 'text-amber-600', borderColor: 'border-amber-400', bgGradient: 'from-amber-100 via-yellow-50 to-orange-100' },
  { letter: 'D', lowercase: 'd', word: 'Dog', emoji: '🐶', color: 'text-orange-600', borderColor: 'border-orange-400', bgGradient: 'from-orange-100 via-amber-50 to-yellow-100' },
  { letter: 'E', lowercase: 'e', word: 'Elephant', emoji: '🐘', color: 'text-sky-600', borderColor: 'border-sky-400', bgGradient: 'from-sky-100 via-blue-50 to-cyan-100' },
  { letter: 'F', lowercase: 'f', word: 'Fish', emoji: '🐟', color: 'text-cyan-600', borderColor: 'border-cyan-400', bgGradient: 'from-cyan-100 via-teal-50 to-sky-100' },
  { letter: 'G', lowercase: 'g', word: 'Goat', emoji: '🐐', color: 'text-yellow-600', borderColor: 'border-yellow-500', bgGradient: 'from-yellow-100 via-amber-50 to-lime-100' },
  { letter: 'H', lowercase: 'h', word: 'Hat', emoji: '🎩', color: 'text-purple-600', borderColor: 'border-purple-400', bgGradient: 'from-purple-100 via-fuchsia-50 to-pink-100' },
  { letter: 'I', lowercase: 'i', word: 'Igloo', emoji: '🧊', color: 'text-pink-600', borderColor: 'border-pink-400', bgGradient: 'from-pink-100 via-rose-50 to-purple-100' },
  { letter: 'J', lowercase: 'j', word: 'Jam', emoji: '🍓', color: 'text-emerald-600', borderColor: 'border-emerald-400', bgGradient: 'from-emerald-100 via-green-50 to-teal-100' },
  { letter: 'K', lowercase: 'k', word: 'Kite', emoji: '🪁', color: 'text-rose-600', borderColor: 'border-rose-400', bgGradient: 'from-rose-100 via-pink-50 to-red-100' },
  { letter: 'L', lowercase: 'l', word: 'Lion', emoji: '🦁', color: 'text-amber-600', borderColor: 'border-amber-500', bgGradient: 'from-amber-100 via-yellow-50 to-orange-100' },
  { letter: 'M', lowercase: 'm', word: 'Monkey', emoji: '🐒', color: 'text-yellow-700', borderColor: 'border-yellow-500', bgGradient: 'from-yellow-100 via-amber-50 to-lime-100' },
  { letter: 'N', lowercase: 'n', word: 'Nest', emoji: '🪹', color: 'text-stone-600', borderColor: 'border-stone-400', bgGradient: 'from-stone-100 via-amber-50 to-orange-100' },
  { letter: 'O', lowercase: 'o', word: 'Orange', emoji: '🍊', color: 'text-indigo-600', borderColor: 'border-indigo-400', bgGradient: 'from-indigo-100 via-purple-50 to-blue-100' },
  { letter: 'P', lowercase: 'p', word: 'Parrot', emoji: '🦜', color: 'text-slate-700', borderColor: 'border-slate-400', bgGradient: 'from-slate-100 via-gray-50 to-zinc-100' },
  { letter: 'Q', lowercase: 'q', word: 'Queen', emoji: '👑', color: 'text-yellow-600', borderColor: 'border-yellow-500', bgGradient: 'from-yellow-100 via-amber-50 to-pink-100' },
  { letter: 'R', lowercase: 'r', word: 'Rabbit', emoji: '🐰', color: 'text-teal-600', borderColor: 'border-teal-400', bgGradient: 'from-teal-100 via-emerald-50 to-cyan-100' },
  { letter: 'S', lowercase: 's', word: 'Sun', emoji: '☀️', color: 'text-amber-500', borderColor: 'border-amber-400', bgGradient: 'from-amber-100 via-yellow-50 to-orange-100' },
  { letter: 'T', lowercase: 't', word: 'Tiger', emoji: '🐯', color: 'text-orange-600', borderColor: 'border-orange-500', bgGradient: 'from-orange-100 via-amber-50 to-yellow-100' },
  { letter: 'U', lowercase: 'u', word: 'Umbrella', emoji: '☂️', color: 'text-violet-600', borderColor: 'border-violet-400', bgGradient: 'from-violet-100 via-purple-50 to-pink-100' },
  { letter: 'V', lowercase: 'v', word: 'Van', emoji: '🚐', color: 'text-amber-700', borderColor: 'border-amber-600', bgGradient: 'from-amber-100 via-orange-50 to-yellow-100' },
  { letter: 'W', lowercase: 'w', word: 'Whale', emoji: '🐳', color: 'text-blue-600', borderColor: 'border-blue-400', bgGradient: 'from-blue-100 via-cyan-50 to-sky-100' },
  { letter: 'X', lowercase: 'x', word: 'Xylophone', emoji: '🎼', color: 'text-fuchsia-600', borderColor: 'border-fuchsia-400', bgGradient: 'from-fuchsia-100 via-pink-50 to-purple-100' },
  { letter: 'Y', lowercase: 'y', word: 'Yak', emoji: '🐂', color: 'text-red-500', borderColor: 'border-red-400', bgGradient: 'from-red-100 via-rose-50 to-amber-100' },
  { letter: 'Z', lowercase: 'z', word: 'Zebra', emoji: '🦓', color: 'text-slate-800', borderColor: 'border-slate-500', bgGradient: 'from-slate-100 via-gray-100 to-sky-100' },
];

const generateOptions = (targetLetter: string, prevOptions?: string[]): string[] => {
  const others = ALPHABET.map((item) => item.letter).filter((l) => l !== targetLetter);
  const shuffledOthers = [...others].sort(() => Math.random() - 0.5);
  const threeDistractors = shuffledOthers.slice(0, 3);
  let fourChoices = [targetLetter, ...threeDistractors].sort(() => Math.random() - 0.5);

  if (prevOptions && prevOptions.length === 4) {
    let attempts = 0;
    while (fourChoices.join('') === prevOptions.join('') && attempts < 20) {
      const reshuffledOthers = [...others].sort(() => Math.random() - 0.5);
      fourChoices = [targetLetter, ...reshuffledOthers.slice(0, 3)].sort(() => Math.random() - 0.5);
      attempts++;
    }
  }
  return fourChoices;
};

export const ABCFun: React.FC<ABCFunProps> = ({
  onCollectStar,
  onNavigateHome,
  onNavigateNext,
  onNavigatePrev,
  isActivityCompleted,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [shakenOption, setShakenOption] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [letterBounceCount, setLetterBounceCount] = useState(0);
  const [objectBounceCount, setObjectBounceCount] = useState(0);

  const currentItem = ALPHABET[selectedIndex];

  // Initialize or update options when current letter changes
  useEffect(() => {
    if (!isCompleted) {
      const newChoices = generateOptions(currentItem.letter);
      setOptions(newChoices);
      setSelectedOption(null);
      setIsCorrect(null);
      setShakenOption(null);

      // Trigger the phonics instruction as soon as the new letter appears
      const timer = setTimeout(() => {
        soundManager.speak(`${currentItem.letter} for ${currentItem.word}. Find the letter ${currentItem.letter}.`);
      }, 150);

      return () => clearTimeout(timer);
    }
  }, [selectedIndex, isCompleted]);

  // Handle letter option click
  const handleSelectOption = (letter: string) => {
    if (isCorrect === true || isCompleted) return;

    if (letter === currentItem.letter) {
      setSelectedOption(letter);
      setIsCorrect(true);
      soundManager.playSuccess();
      soundManager.speak('Great job!');

      if (selectedIndex === ALPHABET.length - 1) {
        // Completed all cards A to Z!
        setTimeout(() => {
          setIsCompleted(true);
          onCollectStar();
          soundManager.speak('Excellent! You completed ABC Fun!');
        }, 1000);
      } else {
        // Move to the next alphabet card after correct selection
        setTimeout(() => {
          setSelectedIndex((prev) => prev + 1);
        }, 1200);
      }
    } else {
      // Wrong answer - shake and allow another attempt
      setSelectedOption(letter);
      setShakenOption(letter);
      soundManager.playError();
      soundManager.speak('Try again.');

      setTimeout(() => {
        setShakenOption(null);
        setSelectedOption(null);
      }, 800);
    }
  };

  // Tap letter -> Voice repeats "A for Apple. Find the letter A."
  const handleTapLetter = () => {
    soundManager.playPop();
    setLetterBounceCount((prev) => prev + 1);
    soundManager.speak(`${currentItem.letter} for ${currentItem.word}. Find the letter ${currentItem.letter}.`);
  };

  // Tap picture/object -> Voice says "A for Apple. Find the letter A."
  const handleTapObject = () => {
    soundManager.playPop();
    setObjectBounceCount((prev) => prev + 1);
    soundManager.speak(`${currentItem.letter} for ${currentItem.word}. Find the letter ${currentItem.letter}.`);
  };

  // Previous letter - step by step
  const handlePrev = () => {
    soundManager.playPop();
    if (isCompleted) {
      setIsCompleted(false);
      setSelectedIndex(ALPHABET.length - 1);
    } else if (selectedIndex > 0) {
      setSelectedIndex((prev) => prev - 1);
    } else {
      if (onNavigatePrev) {
        onNavigatePrev();
      }
    }
  };

  // Next letter
  const handleNext = () => {
    soundManager.playPop();
    if (isCompleted) setIsCompleted(false);
    const nextIdx = (selectedIndex + 1) % ALPHABET.length;
    setSelectedIndex(nextIdx);
  };

  const handleRestart = () => {
    soundManager.playPop();
    setSelectedIndex(0);
    setIsCompleted(false);
    const newChoices = generateOptions(ALPHABET[0].letter, options);
    setOptions(newChoices);
    setSelectedOption(null);
    setIsCorrect(null);
    setShakenOption(null);
    soundManager.speak(`${ALPHABET[0].letter} for ${ALPHABET[0].word}. Find the letter ${ALPHABET[0].letter}.`);
  };

  return (
    <div id="activity-abc-fun" className="w-full max-w-3xl mx-auto p-3 sm:p-6 flex flex-col items-center select-none">
      {/* Top Header & Letter Progress Bar */}
      <div className="w-full flex items-center justify-between gap-3 mb-4 bg-white/90 p-4 rounded-3xl border-4 border-amber-300 shadow-md">
        <div className="flex items-center gap-2">
          <span className="text-3xl sm:text-4xl">🔤</span>
          <h2 className="text-2xl sm:text-3xl font-black text-amber-950 uppercase tracking-wide">
            ABC FUN
          </h2>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center gap-2 bg-amber-100 px-4 py-2 rounded-2xl border-2 border-amber-300 shadow-inner">
          <Star className="w-5 h-5 fill-amber-400 text-amber-500 animate-bounce" />
          <span className="font-black text-amber-950 text-sm sm:text-base">
            {selectedIndex + 1} / 26
          </span>
        </div>
      </div>

      {/* 2D Stage Scene Container */}
      <div className={`relative w-full rounded-3xl bg-gradient-to-b ${currentItem.bgGradient} border-8 border-white shadow-2xl p-4 sm:p-8 flex flex-col items-center justify-center min-h-[460px] overflow-hidden gap-5`}>
        {/* Floating Cartoon Decorations */}
        <div className="absolute top-3 left-4 text-3xl opacity-70 animate-bounce">☁️</div>
        <div className="absolute top-4 right-6 text-3xl opacity-70 animate-pulse">☁️</div>
        <div className="absolute top-2 right-1/3 text-2xl opacity-60">✨</div>
        <div className="absolute top-3 left-1/3 text-2xl opacity-60">⭐</div>

        <AnimatePresence mode="wait">
          {isCompleted ? (
            /* Activity Completion Card */
            <motion.div
              key="completion-banner"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white/95 rounded-3xl border-6 border-amber-300 p-6 sm:p-10 shadow-2xl text-center flex flex-col items-center gap-4 my-auto z-10"
            >
              <div className="w-20 h-20 bg-amber-100 rounded-full border-4 border-amber-400 flex items-center justify-center text-4xl shadow-md animate-bounce">
                🏆
              </div>
              <h3 className="text-2xl sm:text-4xl font-black text-amber-950">
                Excellent! You completed ABC Fun!
              </h3>
              <p className="text-base sm:text-xl font-bold text-amber-800">
                You earned 1 Star! ⭐
              </p>
              <motion.button
                type="button"
                onClick={handleRestart}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-2 inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-black text-lg sm:text-xl px-8 py-4 rounded-2xl border-b-4 border-green-700 shadow-xl cursor-pointer uppercase tracking-wider"
              >
                <RotateCcw className="w-6 h-6" />
                <span>Play Again</span>
              </motion.button>
            </motion.div>
          ) : (
            /* Regular Learning & Quiz Card */
            <motion.div
              key={`card-${currentItem.letter}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="w-full flex flex-col items-center justify-center gap-5 z-10"
            >
              {/* 1. TOP: Large Animated Letter & Object */}
              <div className="w-full flex flex-row flex-wrap items-center justify-center gap-4 sm:gap-6 z-10">
                {/* Large Letter */}
                <motion.div
                  key={`letter-${currentItem.letter}-${letterBounceCount}`}
                  initial={{ scale: 0.9, y: -5 }}
                  animate={{ scale: [1, 1.08, 1], y: 0 }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                  onClick={handleTapLetter}
                  className="cursor-pointer group"
                >
                  <div className={`px-6 py-3 sm:px-10 sm:py-5 bg-white rounded-3xl border-6 ${currentItem.borderColor} shadow-xl flex items-center justify-center gap-3 transform group-hover:scale-105 transition-transform active:scale-95`}>
                    <span className={`text-6xl sm:text-8xl font-black ${currentItem.color} tracking-tight drop-shadow-sm`}>
                      {currentItem.letter}
                    </span>
                    <span className={`text-4xl sm:text-6xl font-extrabold ${currentItem.color} opacity-80`}>
                      {currentItem.lowercase}
                    </span>
                  </div>
                </motion.div>

                {/* Matching Object Character */}
                <motion.div
                  key={`object-${currentItem.word}-${objectBounceCount}`}
                  initial={{ scale: 0.9, y: 5 }}
                  animate={{ scale: [1, 1.08, 1], rotate: [0, -3, 3, 0] }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                  onClick={handleTapObject}
                  className="cursor-pointer group"
                >
                  <div className="px-6 py-3 sm:px-8 sm:py-4 bg-white/95 rounded-3xl border-4 border-white shadow-xl flex items-center justify-center gap-3 transform group-hover:scale-105 transition-transform active:scale-95">
                    <span className="text-5xl sm:text-7xl drop-shadow-sm">
                      {currentItem.emoji}
                    </span>
                    <span className="text-2xl sm:text-4xl font-black text-slate-800 tracking-wide">
                      {currentItem.word}
                    </span>
                  </div>
                </motion.div>
              </div>

              {/* 2. BOTTOM: Interactive Letter Selection */}
              <div className="w-full z-10 mt-2 bg-white/90 backdrop-blur-sm rounded-3xl p-4 sm:p-6 border-4 border-amber-300 shadow-xl text-center flex flex-col items-center gap-3">
                <p className="text-lg sm:text-2xl font-black text-amber-950 uppercase tracking-wide flex items-center justify-center gap-2">
                  <span>Find the letter</span>
                  <span className="text-2xl sm:text-3xl text-amber-600 underline font-black">
                    {currentItem.letter}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playPop();
                      soundManager.speak(`${currentItem.letter} for ${currentItem.word}. Find the letter ${currentItem.letter}.`);
                    }}
                    className="ml-1 p-2 bg-amber-200 hover:bg-amber-300 rounded-full border-2 border-amber-400 text-amber-900 transition-transform active:scale-95 cursor-pointer flex items-center justify-center shadow-sm"
                    title="Listen again"
                  >
                    <Volume2 className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </p>

                {/* 3-4 Large Colorful Letter Option Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mt-1">
                  {options.map((opt, idx) => {
                    const isThisSelected = selectedOption === opt;
                    const isThisCorrect = isThisSelected && isCorrect;
                    const isThisShaken = shakenOption === opt;

                    const colorClasses = [
                      'bg-amber-100 hover:bg-amber-200 border-amber-400 text-amber-950',
                      'bg-sky-100 hover:bg-sky-200 border-sky-400 text-sky-950',
                      'bg-emerald-100 hover:bg-emerald-200 border-emerald-400 text-emerald-950',
                      'bg-rose-100 hover:bg-rose-200 border-rose-400 text-rose-950',
                    ][idx % 4];

                    return (
                      <motion.button
                        key={`${currentItem.letter}-opt-${opt}-${idx}`}
                        type="button"
                        onClick={() => handleSelectOption(opt)}
                        animate={
                          isThisShaken
                            ? { x: [-12, 12, -12, 12, 0] }
                            : isThisCorrect
                            ? { scale: [1, 1.25, 1], rotate: [0, -5, 5, 0] }
                            : {}
                        }
                        transition={{ duration: 0.35 }}
                        className={`w-16 h-16 sm:w-20 sm:h-20 text-3xl sm:text-4xl font-black rounded-2xl sm:rounded-3xl border-4 shadow-lg flex items-center justify-center cursor-pointer active:scale-95 transition-all ${
                          isThisCorrect
                            ? 'bg-emerald-400 border-emerald-600 text-white ring-4 ring-emerald-300 shadow-emerald-200 scale-110'
                            : isThisShaken
                            ? 'bg-rose-400 border-rose-600 text-white'
                            : colorClasses
                        }`}
                      >
                        {opt}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Child-Friendly Navigation Controls */}
      <div className="w-full max-w-2xl mt-6 grid grid-cols-3 gap-3 sm:gap-6">
        {/* Previous Button */}
        <button
          type="button"
          onClick={handlePrev}
          className="flex items-center justify-center gap-2 bg-[#4D96FF] hover:bg-blue-500 text-white font-black py-4 px-3 sm:px-6 rounded-3xl border-b-8 border-[#2563EB] shadow-xl active:border-b-2 active:translate-y-1.5 transition-all cursor-pointer text-base sm:text-xl uppercase"
        >
          <ArrowLeft className="w-6 h-6 stroke-[3]" />
          <span>PREV</span>
        </button>

        {/* Home Button */}
        <button
          type="button"
          onClick={() => {
            soundManager.playPop();
            if (onNavigateHome) onNavigateHome();
          }}
          className="flex items-center justify-center gap-2 bg-[#F7D060] hover:bg-amber-400 text-amber-950 font-black py-4 px-3 sm:px-6 rounded-3xl border-b-8 border-[#CA8A04] shadow-xl active:border-b-2 active:translate-y-1.5 transition-all cursor-pointer text-base sm:text-xl uppercase"
        >
          <Home className="w-6 h-6 stroke-[3]" />
          <span>HOME</span>
        </button>

        {/* Next Button */}
        <button
          type="button"
          onClick={() => {
            if (isCompleted || isActivityCompleted) {
              soundManager.playPop();
              if (onNavigateNext) onNavigateNext();
            } else {
              soundManager.playPop();
              soundManager.speak('Finish the activity to unlock next!');
            }
          }}
          className={`flex items-center justify-center gap-2 font-black py-4 px-3 sm:px-6 rounded-3xl shadow-xl transition-all text-base sm:text-xl uppercase ${
            isCompleted || isActivityCompleted
              ? 'bg-[#6BCB77] hover:bg-emerald-500 text-white border-b-8 border-[#16A34A] active:border-b-2 active:translate-y-1.5 cursor-pointer'
              : 'bg-slate-300 text-slate-500 border-b-4 border-slate-400 cursor-not-allowed opacity-70'
          }`}
        >
          <span>NEXT</span>
          <ArrowRight className="w-6 h-6 stroke-[3]" />
        </button>
      </div>
    </div>
  );
};



