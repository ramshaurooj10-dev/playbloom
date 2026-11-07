import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, Sparkles, RotateCcw, Star, ArrowLeft, ArrowRight, Home } from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface CountingFunProps {
  onCollectStar: () => void;
  onNavigateHome?: () => void;
  onNavigateNext?: () => void;
  onNavigatePrev?: () => void;
  isActivityCompleted?: boolean;
}

interface CountChallenge {
  id: string;
  count: number;
  itemName: string;
  itemEmoji: string;
  bgGradient: string;
  borderColor: string;
  options: number[];
}

const CHALLENGES: CountChallenge[] = [
  {
    id: 'stars_3',
    count: 3,
    itemName: 'stars',
    itemEmoji: '⭐',
    bgGradient: 'from-amber-100 via-yellow-50 to-orange-100',
    borderColor: 'border-amber-400',
    options: [1, 2, 3, 4],
  },
  {
    id: 'apples_5',
    count: 5,
    itemName: 'apples',
    itemEmoji: '🍎',
    bgGradient: 'from-rose-100 via-red-50 to-pink-100',
    borderColor: 'border-rose-400',
    options: [3, 4, 5, 6],
  },
  {
    id: 'balloons_2',
    count: 2,
    itemName: 'balloons',
    itemEmoji: '🎈',
    bgGradient: 'from-sky-100 via-blue-50 to-indigo-100',
    borderColor: 'border-sky-400',
    options: [1, 2, 3, 5],
  },
  {
    id: 'toys_4',
    count: 4,
    itemName: 'teddy bears',
    itemEmoji: '🧸',
    bgGradient: 'from-orange-100 via-amber-50 to-yellow-100',
    borderColor: 'border-orange-400',
    options: [2, 3, 4, 6],
  },
  {
    id: 'cars_6',
    count: 6,
    itemName: 'cars',
    itemEmoji: '🚗',
    bgGradient: 'from-cyan-100 via-sky-50 to-blue-100',
    borderColor: 'border-cyan-400',
    options: [4, 5, 6, 7],
  },
  {
    id: 'ducks_3',
    count: 3,
    itemName: 'ducks',
    itemEmoji: '🦆',
    bgGradient: 'from-yellow-100 via-amber-50 to-lime-100',
    borderColor: 'border-yellow-400',
    options: [2, 3, 4, 5],
  },
  {
    id: 'flowers_7',
    count: 7,
    itemName: 'flowers',
    itemEmoji: '🌸',
    bgGradient: 'from-pink-100 via-rose-50 to-fuchsia-100',
    borderColor: 'border-pink-400',
    options: [5, 6, 7, 8],
  },
  {
    id: 'icecreams_8',
    count: 8,
    itemName: 'ice creams',
    itemEmoji: '🍦',
    bgGradient: 'from-purple-100 via-fuchsia-50 to-pink-100',
    borderColor: 'border-purple-400',
    options: [6, 7, 8, 9],
  },
];

const generateRandomChallenges = (prevChallenges?: CountChallenge[]): CountChallenge[] => {
  let shuffled = CHALLENGES.map((c) => ({
    ...c,
    options: [...c.options].sort(() => Math.random() - 0.5),
  })).sort(() => Math.random() - 0.5);

  if (prevChallenges && prevChallenges.length > 0) {
    const prevFirstId = prevChallenges[0]?.id;
    let attempts = 0;
    while (shuffled[0]?.id === prevFirstId && attempts < 20) {
      shuffled = CHALLENGES.map((c) => ({
        ...c,
        options: [...c.options].sort(() => Math.random() - 0.5),
      })).sort(() => Math.random() - 0.5);
      attempts++;
    }
  }

  return shuffled;
};

export const CountingFun: React.FC<CountingFunProps> = ({
  onCollectStar,
  onNavigateHome,
  onNavigateNext,
  onNavigatePrev,
  isActivityCompleted,
}) => {
  const [challenges, setChallenges] = useState<CountChallenge[]>(() => generateRandomChallenges());
  const [challengeIdx, setChallengeIdx] = useState(0);
  const [tappedIndices, setTappedIndices] = useState<number[]>([]);
  const [shakingOption, setShakingOption] = useState<number | null>(null);
  const [isCelebrating, setIsCelebrating] = useState(false);
  const [celebrationMsg, setCelebrationMsg] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [isGameFinished, setIsGameFinished] = useState(false);

  const currentChallenge = challenges[challengeIdx] || challenges[0];

  // Voice instruction when starting a new round & reset tapped items
  useEffect(() => {
    setTappedIndices([]);
    if (!isGameFinished && currentChallenge) {
      soundManager.speak(`Count the ${currentChallenge.itemName}`);
    }
  }, [challengeIdx, isGameFinished]);

  const handleItemTap = (idx: number) => {
    if (isCelebrating || tappedIndices.includes(idx)) return;

    const nextCount = tappedIndices.length + 1;
    setTappedIndices((prev) => [...prev, idx]);
    soundManager.playPop();
    soundManager.speak(nextCount.toString());
  };

  const handleHearPrompt = () => {
    soundManager.speak(`Count the ${currentChallenge.itemName}`);
  };

  const handleNumberSelect = (numChoice: number) => {
    if (isCelebrating) return;

    if (numChoice === currentChallenge.count) {
      // Correct answer!
      setIsCelebrating(true);
      setCelebrationMsg('Great Job! 🎉');
      setFeedbackMsg(null);
      soundManager.playSuccess();
      soundManager.speak('Great job!');

      setTimeout(() => {
        setIsCelebrating(false);
        setCelebrationMsg(null);

        if (challengeIdx < challenges.length - 1) {
          setChallengeIdx((prev) => prev + 1);
        } else {
          setIsGameFinished(true);
          onCollectStar();
          soundManager.playCelebration();
          soundManager.speak('Great job! You completed all the counting games!');
        }
      }, 1800);
    } else {
      // Wrong answer
      setShakingOption(numChoice);
      setFeedbackMsg('Try again! 🌸');
      soundManager.playError();
      soundManager.speak('Try again!');

      setTimeout(() => {
        setShakingOption(null);
      }, 600);
    }
  };

  const handleRestart = () => {
    soundManager.playPop();
    const newChallenges = generateRandomChallenges(challenges);
    setChallenges(newChallenges);
    setChallengeIdx(0);
    setTappedIndices([]);
    setIsGameFinished(false);
    setIsCelebrating(false);
    setShakingOption(null);
    setCelebrationMsg(null);
    setFeedbackMsg(null);
  };

  // Step-by-step previous navigation handler
  const handleInternalPrev = () => {
    soundManager.playPop();
    if (isGameFinished) {
      setIsGameFinished(false);
      setChallengeIdx(challenges.length - 1);
      setTappedIndices([]);
      setIsCelebrating(false);
    } else if (challengeIdx > 0) {
      setChallengeIdx((prev) => prev - 1);
      setTappedIndices([]);
      setIsCelebrating(false);
      setShakingOption(null);
      setCelebrationMsg(null);
      setFeedbackMsg(null);
    } else {
      if (onNavigatePrev) {
        onNavigatePrev();
      }
    }
  };

  return (
    <div id="activity-counting-fun" className="w-full max-w-4xl mx-auto p-4 sm:p-6 select-none">
      {/* Playful Scene Container */}
      <div className="relative bg-gradient-to-b from-sky-100 via-blue-50 to-indigo-100 rounded-3xl border-8 border-white shadow-2xl p-5 sm:p-8 overflow-hidden">
        {/* Background Decorative Emojis */}
        <div className="absolute top-3 left-4 text-3xl opacity-20 pointer-events-none">⭐</div>
        <div className="absolute top-4 right-6 text-3xl opacity-20 pointer-events-none">🎈</div>
        <div className="absolute bottom-4 left-6 text-4xl opacity-15 pointer-events-none">🔢</div>
        <div className="absolute bottom-3 right-8 text-3xl opacity-20 pointer-events-none">✨</div>

        {!isGameFinished ? (
          <>
            {/* Top: Header & Instructions */}
            <div className="text-center mb-6 relative z-10">
              <div className="inline-flex items-center gap-2 bg-sky-600 text-white font-black text-xs sm:text-sm px-4 py-1 rounded-full shadow-md mb-2 uppercase tracking-wide">
                <span>Counting Fun</span>
                <span className="bg-sky-800 px-2 py-0.5 rounded-full text-[10px]">
                  {challengeIdx + 1} / {challenges.length}
                </span>
              </div>

              {/* Main Prompt Banner */}
              <motion.div
                key={currentChallenge.id}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white/90 backdrop-blur-sm border-4 border-sky-300 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3 max-w-2xl mx-auto"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-yellow-200 to-amber-300 rounded-2xl border-3 border-amber-400 flex items-center justify-center text-3xl sm:text-4xl shadow-inner animate-bounce">
                    {currentChallenge.itemEmoji}
                  </div>
                  <div className="text-left">
                    <h2 className="text-2xl sm:text-3xl font-black text-sky-950">
                      Count the <span className="text-sky-600 font-extrabold capitalize underline">{currentChallenge.itemName}</span>
                    </h2>
                    <p className="text-xs sm:text-sm font-bold text-sky-700">
                      How many do you see? Tap the number below 👇
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleHearPrompt}
                  className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 active:scale-95 text-white font-black text-xs sm:text-sm px-4 py-2.5 rounded-xl border-b-4 border-sky-700 shadow-md cursor-pointer transition-all"
                  title="Listen to instruction"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Listen</span>
                </button>
              </motion.div>

              {/* Feedback Message */}
              {feedbackMsg && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 text-sm sm:text-base font-black text-amber-800 bg-amber-100 border-2 border-amber-300 rounded-full py-1 px-4 inline-block shadow-sm"
                >
                  {feedbackMsg}
                </motion.p>
              )}
            </div>

            {/* Center: Large Clear Objects for Counting */}
            <div className={`relative bg-gradient-to-b ${currentChallenge.bgGradient} border-4 ${currentChallenge.borderColor} rounded-3xl p-6 sm:p-8 shadow-inner mb-6 max-w-2xl mx-auto min-h-[180px] sm:min-h-[220px] flex items-center justify-center`}>
              <motion.div
                key={currentChallenge.id}
                className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 max-w-xl"
              >
                {Array.from({ length: currentChallenge.count }).map((_, idx) => {
                  const isTapped = tappedIndices.includes(idx);
                  const countNum = isTapped ? tappedIndices.indexOf(idx) + 1 : null;

                  return (
                    <motion.button
                      key={idx}
                      type="button"
                      onClick={() => handleItemTap(idx)}
                      disabled={isTapped || isCelebrating}
                      whileTap={!isTapped ? { scale: 0.88 } : undefined}
                      animate={
                        isTapped
                          ? { scale: [1, 1.15, 1] }
                          : isCelebrating
                          ? {
                              scale: [1, 1.3, 0.9, 1.15, 1],
                              y: [0, -20, 0, -10, 0],
                              rotate: [0, -10, 10, -5, 0],
                            }
                          : { scale: 1, y: 0, rotate: 0 }
                      }
                      transition={{
                        duration: isCelebrating ? 0.6 : 0.25,
                        delay: isCelebrating ? idx * 0.08 : 0,
                      }}
                      className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-3 shadow-md flex items-center justify-center text-4xl sm:text-5xl select-none transition-all ${
                        isTapped
                          ? 'bg-amber-200/90 border-amber-500 scale-105 ring-4 ring-amber-300/60'
                          : 'bg-white/90 border-amber-300 hover:border-amber-400 hover:bg-white cursor-pointer'
                      }`}
                    >
                      {currentChallenge.itemEmoji}

                      {/* Running Count Badge */}
                      {isTapped && countNum !== null && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-2 -right-2 bg-amber-500 text-white font-black text-xs sm:text-sm w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center shadow-lg border-2 border-white"
                        >
                          {countNum}
                        </motion.span>
                      )}
                    </motion.button>
                  );
                })}
              </motion.div>

              {/* Sparkles Overlay when Correct */}
              <AnimatePresence>
                {isCelebrating && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1.2 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute inset-0 pointer-events-none flex items-center justify-center"
                  >
                    <div className="relative w-full h-full flex items-center justify-center">
                      <Sparkles className="w-20 h-20 text-yellow-400 animate-spin" />
                      <span className="absolute top-4 left-6 text-3xl animate-ping">✨</span>
                      <span className="absolute bottom-4 right-8 text-3xl animate-ping">⭐</span>
                      <span className="absolute top-6 right-8 text-3xl animate-bounce">🎉</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom: Big Child-Friendly Number Choices */}
            <div className="max-w-2xl mx-auto relative z-10">
              <p className="text-center font-black text-sky-900 text-sm sm:text-base mb-3">
                Tap the correct number:
              </p>
              <div className="grid grid-cols-4 gap-3 sm:gap-4">
                {currentChallenge.options.map((num) => {
                  const isShaking = shakingOption === num;

                  return (
                    <motion.button
                      key={num}
                      type="button"
                      onClick={() => handleNumberSelect(num)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.92 }}
                      animate={
                        isShaking
                          ? {
                              x: [-10, 10, -8, 8, -4, 4, 0],
                            }
                          : { x: 0 }
                      }
                      transition={{ duration: isShaking ? 0.4 : 0.2 }}
                      className={`h-16 sm:h-20 rounded-2xl border-b-6 shadow-lg flex items-center justify-center text-3xl sm:text-4xl font-black transition-all cursor-pointer bg-gradient-to-b from-white to-sky-100 border-sky-400 text-sky-900 hover:from-sky-100 hover:to-sky-200 hover:border-sky-500`}
                    >
                      {num}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Celebration Popup Banner */}
            <AnimatePresence>
              {celebrationMsg && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -20 }}
                  className="mt-6 text-center z-20"
                >
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-lg sm:text-xl px-6 py-3 rounded-2xl border-4 border-white shadow-2xl">
                    <Sparkles className="w-6 h-6 text-yellow-300" />
                    <span>{celebrationMsg}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          /* Completion Screen */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8 sm:py-12 relative z-10"
          >
            <div className="w-24 h-24 bg-yellow-300 rounded-full border-4 border-yellow-500 mx-auto flex items-center justify-center text-5xl shadow-xl mb-4 animate-bounce">
              🏆
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-sky-950 mb-2">
              Counting Master!
            </h2>
            <p className="text-base sm:text-lg font-bold text-sky-800 mb-6 max-w-md mx-auto">
              Hooray! You counted all the objects correctly! 🌟
            </p>

            <div className="flex items-center justify-center gap-2 mb-8">
              {[...Array(6)].map((_, i) => (
                <Star key={i} className="w-8 h-8 text-yellow-400 fill-yellow-400 drop-shadow-md animate-pulse" />
              ))}
            </div>

            <button
              type="button"
              onClick={handleRestart}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 active:scale-95 text-white font-black text-lg px-8 py-4 rounded-2xl border-b-6 border-emerald-800 shadow-xl cursor-pointer transition-all"
            >
              <RotateCcw className="w-6 h-6" />
              <span>Play Again</span>
            </button>
          </motion.div>
        )}
      </div>

      {/* Child-Friendly Navigation Controls */}
      <div className="w-full max-w-2xl mt-6 grid grid-cols-3 gap-3 sm:gap-6">
        {/* Previous Button */}
        <button
          type="button"
          onClick={handleInternalPrev}
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
            if (isGameFinished || isActivityCompleted) {
              soundManager.playPop();
              if (onNavigateNext) onNavigateNext();
            } else {
              soundManager.playPop();
              soundManager.speak('Complete all counting games to unlock next!');
            }
          }}
          className={`flex items-center justify-center gap-2 font-black py-4 px-3 sm:px-6 rounded-3xl shadow-xl transition-all text-base sm:text-xl uppercase ${
            isGameFinished || isActivityCompleted
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

