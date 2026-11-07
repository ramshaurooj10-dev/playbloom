import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Volume2, Star as StarIcon, Check, Sparkles } from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { ActivityBottomNav } from './ActivityBottomNav';

interface PatternFunProps {
  onCollectStar: () => void;
  onNavigateHome?: () => void;
  onNavigateNext?: () => void;
  onNavigatePrev?: () => void;
  isActivityCompleted?: boolean;
}

interface PatternItem {
  id: string;
  name: string;
  emoji: string;
}

type PatternType = 'AB' | 'ABC' | 'AAB' | 'ABB';

interface RoundData {
  roundNum: number;
  patternType: PatternType;
  sequence: PatternItem[];
  missingIndex: number;
  correctItem: PatternItem;
  displayOptions: PatternItem[];
  bgGradient: string;
}

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  shape: 'circle' | 'square' | 'star';
  rotation: number;
}

const ITEM_POOL: PatternItem[] = [
  { id: 'apple', name: 'Apple', emoji: '🍎' },
  { id: 'star', name: 'Star', emoji: '⭐' },
  { id: 'balloon', name: 'Balloon', emoji: '🎈' },
  { id: 'flower', name: 'Flower', emoji: '🌸' },
  { id: 'fish', name: 'Fish', emoji: '🐟' },
  { id: 'butterfly', name: 'Butterfly', emoji: '🦋' },
  { id: 'strawberry', name: 'Strawberry', emoji: '🍓' },
  { id: 'car', name: 'Car', emoji: '🚗' },
  { id: 'toy', name: 'Teddy Bear', emoji: '🧸' },
  { id: 'blue_circle', name: 'Blue Circle', emoji: '🔵' },
  { id: 'red_triangle', name: 'Red Triangle', emoji: '🔺' },
  { id: 'yellow_circle', name: 'Yellow Circle', emoji: '🟡' },
  { id: 'green_circle', name: 'Green Circle', emoji: '🟢' },
];

const GRADIENTS = [
  'from-amber-100 via-orange-50 to-rose-100',
  'from-sky-100 via-blue-50 to-indigo-100',
  'from-emerald-100 via-teal-50 to-cyan-100',
  'from-pink-100 via-purple-50 to-rose-100',
  'from-yellow-100 via-amber-50 to-orange-100',
  'from-purple-100 via-indigo-50 to-blue-100',
  'from-rose-100 via-pink-50 to-amber-100',
  'from-teal-100 via-emerald-50 to-sky-100',
];

const generateShuffledRounds = (): RoundData[] => {
  const patternTypes: PatternType[] = ['AB', 'AB', 'ABC', 'ABC', 'AAB', 'ABB', 'AB', 'ABC'];
  const shuffledTypes = [...patternTypes].sort(() => Math.random() - 0.5);

  return shuffledTypes.map((type, index) => {
    // Pick 3 random distinct items from pool for this round
    const shuffledPool = [...ITEM_POOL].sort(() => Math.random() - 0.5);
    const itemA = shuffledPool[0];
    const itemB = shuffledPool[1];
    const itemC = shuffledPool[2];

    let unit: PatternItem[] = [];
    let sequenceLength = 6;

    if (type === 'AB') {
      unit = [itemA, itemB];
      sequenceLength = 5 + Math.floor(Math.random() * 2); // 5 or 6
    } else if (type === 'ABC') {
      unit = [itemA, itemB, itemC];
      sequenceLength = 6; // e.g., A B C A B C
    } else if (type === 'AAB') {
      unit = [itemA, itemA, itemB];
      sequenceLength = 6; // e.g., A A B A A B
    } else {
      unit = [itemA, itemB, itemB];
      sequenceLength = 6; // e.g., A B B A B B
    }

    // Build full sequence
    const sequence: PatternItem[] = [];
    for (let i = 0; i < sequenceLength; i++) {
      sequence.push(unit[i % unit.length]);
    }

    // Determine missing index (randomized: could be last, second to last, or middle)
    const validMissingIndices = [sequenceLength - 1, sequenceLength - 1, sequenceLength - 2, 2, 3];
    const missingIndex = validMissingIndices[Math.floor(Math.random() * validMissingIndices.length)];

    const correctItem = sequence[missingIndex];

    // Distractor choices: pool items not equal to correctItem
    const remainingItems = ITEM_POOL.filter((item) => item.id !== correctItem.id);
    const shuffledRemaining = [...remainingItems].sort(() => Math.random() - 0.5);
    const distractors = shuffledRemaining.slice(0, 2);

    // Answer choices (1 correct + 2 distractors), shuffled
    const displayOptions = [correctItem, ...distractors].sort(() => Math.random() - 0.5);

    return {
      roundNum: index + 1,
      patternType: type,
      sequence,
      missingIndex,
      correctItem,
      displayOptions,
      bgGradient: GRADIENTS[index % GRADIENTS.length],
    };
  });
};

export const PatternFun: React.FC<PatternFunProps> = ({
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
  const [particles, setParticles] = useState<ConfettiPiece[]>([]);

  const speechTimerRef = useRef<NodeJS.Timeout | null>(null);
  const nextRoundTimerRef = useRef<NodeJS.Timeout | null>(null);

  const currentRound = rounds[currentRoundIndex];

  // Particle generator for celebration bursts on correct answer
  const triggerConfetti = (count: number = 32) => {
    const colors = ['#38BDF8', '#F59E0B', '#10B981', '#EC4899', '#8B5CF6', '#F43F5E', '#FBBF24'];
    const shapes: ('circle' | 'square' | 'star')[] = ['circle', 'square', 'star'];
    const newParticles: ConfettiPiece[] = Array.from({ length: count }).map((_, i) => ({
      id: Date.now() + i,
      x: (Math.random() - 0.5) * 450,
      y: (Math.random() - 0.5) * 320 - 40,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 12 + 8,
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      rotation: Math.random() * 360,
    }));
    setParticles(newParticles);

    setTimeout(() => {
      setParticles([]);
    }, 1600);
  };

  // Audio prompt when round changes
  useEffect(() => {
    if (!currentRound || isAllFinished) return;
    if (speechTimerRef.current) clearTimeout(speechTimerRef.current);
    speechTimerRef.current = setTimeout(() => {
      soundManager.speak('What comes next?');
    }, 250);

    return () => {
      if (speechTimerRef.current) clearTimeout(speechTimerRef.current);
    };
  }, [currentRoundIndex, isAllFinished]);

  const handlePlayAgain = () => {
    if (speechTimerRef.current) clearTimeout(speechTimerRef.current);
    if (nextRoundTimerRef.current) clearTimeout(nextRoundTimerRef.current);

    soundManager.playPop();
    soundManager.speak("Let's play Pattern Fun again!");
    setRounds(generateShuffledRounds());
    setCurrentRoundIndex(0);
    setSelectedOptionId(null);
    setIsCorrect(null);
    setShakeId(null);
    setIsRoundFinished(false);
    setIsAllFinished(false);
    setParticles([]);
  };

  const handleSelectOption = (item: PatternItem) => {
    if (isRoundFinished || isAllFinished) return;

    setSelectedOptionId(item.id);

    const isAnswerCorrect = item.id === currentRound.correctItem.id;

    if (isAnswerCorrect) {
      // 1. Play reinforcement music & pop effect immediately
      soundManager.playPop();
      soundManager.playReinforcementMusic();
      setIsCorrect(true);
      setIsRoundFinished(true);
      setStarsEarned((prev) => prev + 1);

      // Trigger colorful visual sparkle burst
      triggerConfetti(36);

      // Spoken positive reinforcement with slight delay so reinforcement chime rings out
      const praisePhrases = [
        'Great job! You found what comes next!',
        'Super! That completes the pattern!',
        'Awesome job!',
        'Yes! You got it right!',
      ];
      const selectedPraise = praisePhrases[Math.floor(Math.random() * praisePhrases.length)];

      setTimeout(() => {
        soundManager.speak(selectedPraise);
      }, 220);

      if (currentRoundIndex === rounds.length - 1) {
        onCollectStar();
        nextRoundTimerRef.current = setTimeout(() => {
          setIsAllFinished(true);
          soundManager.playCelebration();
          soundManager.speak('Fantastic! You completed Pattern Fun!');
        }, 1500);
      } else {
        nextRoundTimerRef.current = setTimeout(() => {
          handleNextRound();
        }, 1500);
      }
    } else {
      // Wrong choice: gentle tone, encourage looking at the pattern
      soundManager.playError();
      const retryPhrases = [
        'Try again! Look at the pattern.',
        'Not quite. What comes next?',
        'Look carefully and try another one!',
      ];
      const randomRetry = retryPhrases[Math.floor(Math.random() * retryPhrases.length)];
      soundManager.speak(randomRetry);

      setIsCorrect(false);
      setShakeId(item.id);
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
      {/* Top Banner Header: Title, Progress & Stars Badges */}
      <div className="w-full bg-white/90 backdrop-blur-md border-4 border-amber-300 rounded-3xl p-3 sm:p-4 shadow-lg mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-amber-100 px-3 py-1.5 rounded-2xl border-2 border-amber-300">
            <span className="text-xl">🧩</span>
            <h1 className="text-base sm:text-xl font-black text-amber-950 uppercase tracking-wide">
              Pattern Fun
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
        className={`w-full bg-gradient-to-br ${currentRound.bgGradient} border-4 border-amber-400 rounded-3xl p-4 sm:p-8 shadow-2xl flex flex-col items-center relative overflow-hidden min-h-[420px] justify-between transition-colors duration-500`}
      >
        {/* Floating Celebration Particles on Correct Answer */}
        <AnimatePresence>
          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ x: 0, y: 0, opacity: 1, scale: 0.2, rotate: 0 }}
              animate={{
                x: p.x,
                y: p.y,
                opacity: 0,
                scale: 1.4,
                rotate: p.rotation,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.3, ease: 'easeOut' }}
              className="absolute pointer-events-none z-50 flex items-center justify-center top-1/2 left-1/2"
              style={{ width: p.size, height: p.size }}
            >
              {p.shape === 'star' ? (
                <Sparkles
                  className="w-full h-full drop-shadow-md"
                  style={{ color: p.color }}
                />
              ) : p.shape === 'circle' ? (
                <div
                  className="w-full h-full rounded-full shadow-md"
                  style={{ backgroundColor: p.color }}
                />
              ) : (
                <div
                  className="w-full h-full rounded-xs shadow-md"
                  style={{ backgroundColor: p.color }}
                />
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        <div className="text-center mt-2 mb-4">
          <div className="inline-flex items-center gap-2 bg-white px-6 py-2.5 rounded-full border-4 border-amber-300 shadow-md mb-2">
            <button
              type="button"
              onClick={() => soundManager.speak('What comes next?')}
              className="p-1 bg-amber-100 hover:bg-amber-200 rounded-full text-amber-900 transition-transform active:scale-90 cursor-pointer"
            >
              <Volume2 className="w-5 h-5" />
            </button>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight uppercase">
              WHAT COMES NEXT?
            </h2>
          </div>
          <p className="text-xs sm:text-sm font-black text-slate-600 uppercase tracking-wide">
            Look at the pattern and choose the missing item!
          </p>
        </div>

        {!isAllFinished ? (
          <div className="w-full flex flex-col items-center my-auto gap-6">
            {/* Pattern Display Row */}
            <div className="w-full max-w-3xl bg-white/90 backdrop-blur-md border-4 border-amber-300 rounded-3xl p-4 sm:p-6 shadow-xl flex flex-wrap items-center justify-center gap-2 sm:gap-4 min-h-[120px]">
              {currentRound.sequence.map((item, idx) => {
                const isMissing = idx === currentRound.missingIndex;

                if (isMissing) {
                  return (
                    <motion.div
                      key={`missing_${idx}`}
                      animate={{ scale: [1, 1.08, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                      className={`w-14 h-14 sm:w-20 sm:h-20 rounded-2xl border-4 border-dashed flex items-center justify-center shadow-inner transition-colors ${
                        isCorrect
                          ? 'border-emerald-500 bg-emerald-100'
                          : 'border-amber-400 bg-amber-50'
                      }`}
                    >
                      {isCorrect ? (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="text-3xl sm:text-5xl drop-shadow-md select-none"
                        >
                          {currentRound.correctItem.emoji}
                        </motion.span>
                      ) : (
                        <span className="text-2xl sm:text-4xl font-black text-amber-600 animate-pulse">
                          ❓
                        </span>
                      )}
                    </motion.div>
                  );
                }

                return (
                  <div
                    key={`item_${idx}_${item.id}`}
                    className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl bg-amber-50/80 border-2 border-amber-200 flex items-center justify-center shadow-xs"
                  >
                    <motion.span
                      animate={{
                        y: [0, -3, 0],
                        rotate: [0, idx % 2 === 0 ? 2 : -2, 0],
                      }}
                      transition={{
                        duration: 2 + (idx % 3) * 0.4,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                      className="text-3xl sm:text-5xl drop-shadow-md select-none"
                    >
                      {item.emoji}
                    </motion.span>
                  </div>
                );
              })}
            </div>

            {/* 3 Answer Option Cards */}
            <div className="w-full max-w-xl grid grid-cols-3 gap-3 sm:gap-6 items-center justify-center">
              {currentRound.displayOptions.map((opt) => {
                const isSelected = selectedOptionId === opt.id;

                return (
                  <motion.button
                    key={opt.id}
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    animate={shakeId === opt.id ? { x: [-10, 10, -10, 10, 0] } : {}}
                    onClick={() => handleSelectOption(opt)}
                    className={`bg-white border-4 rounded-3xl p-4 sm:p-6 shadow-xl flex flex-col items-center justify-center cursor-pointer relative transition-colors h-28 sm:h-36 ${
                      isSelected && isCorrect
                        ? 'border-emerald-500 bg-emerald-50 ring-4 ring-emerald-300'
                        : isSelected && isCorrect === false
                        ? 'border-rose-500 bg-rose-50'
                        : 'border-amber-300 hover:border-amber-400'
                    }`}
                  >
                    <motion.span
                      whileHover={{ scale: 1.15, rotate: 6 }}
                      className="text-4xl sm:text-6xl drop-shadow-md select-none"
                    >
                      {opt.emoji}
                    </motion.span>

                    <span className="text-xs sm:text-sm font-black text-slate-700 mt-2 truncate max-w-full">
                      {opt.name}
                    </span>

                    {isSelected && isCorrect && (
                      <div className="absolute top-2 right-2 bg-emerald-500 text-white rounded-full p-1.5 shadow-md">
                        <Check className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3]" />
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        ) : (
          /* Completion Screen with PLAY AGAIN button */
          <div className="flex flex-col items-center justify-center text-center my-auto p-6 bg-white/90 backdrop-blur-md rounded-3xl border-4 border-amber-400 shadow-xl max-w-lg">
            <div className="text-6xl mb-3 animate-bounce">🎉</div>
            <h3 className="text-2xl sm:text-3xl font-black text-amber-950 uppercase mb-2">
              PATTERN PRO!
            </h3>
            <div className="flex items-center gap-1.5 bg-amber-200 border-2 border-amber-400 px-4 py-1.5 rounded-full mb-3">
              <StarIcon className="w-5 h-5 fill-amber-400 text-amber-600" />
              <span className="font-black text-amber-950 text-sm">Star Earned!</span>
            </div>
            <p className="text-base font-bold text-slate-700 mb-5">
              You explored repeating patterns and learned to predict what comes next!
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
