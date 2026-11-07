import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, RotateCcw, Home, Sparkles, Star as StarIcon, Check, ArrowRight, ArrowLeft, Trophy } from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface IdentifyItemsProps {
  onCollectStar: () => void;
  onNavigateHome?: () => void;
  onNavigateNext?: () => void;
  onNavigatePrev?: () => void;
  isActivityCompleted?: boolean;
}

export interface ItemChoice {
  id: string;
  name: string;
  emoji: string;
  bgColor: string;
  borderColor: string;
  category: 'toys' | 'home' | 'world';
}

export interface RoundData {
  target: ItemChoice;
  choices: ItemChoice[];
}

export interface IdentifyLevelConfig {
  levelNumber: number;
  title: string;
  subtitle: string;
  badgeEmoji: string;
  roundsCount: number;
  choicesPerRound: number;
  items: ItemChoice[];
}

const LEVEL_1_ITEMS: ItemChoice[] = [
  { id: 'ball', name: 'Ball', emoji: '⚽', bgColor: 'bg-blue-100 hover:bg-blue-200', borderColor: 'border-blue-400', category: 'toys' },
  { id: 'teddy', name: 'Teddy Bear', emoji: '🧸', bgColor: 'bg-amber-100 hover:bg-amber-200', borderColor: 'border-amber-400', category: 'toys' },
  { id: 'book', name: 'Book', emoji: '📚', bgColor: 'bg-indigo-100 hover:bg-indigo-200', borderColor: 'border-indigo-400', category: 'toys' },
  { id: 'pencil', name: 'Pencil', emoji: '✏️', bgColor: 'bg-yellow-100 hover:bg-yellow-200', borderColor: 'border-yellow-400', category: 'toys' },
  { id: 'car', name: 'Toy Car', emoji: '🚗', bgColor: 'bg-red-100 hover:bg-red-200', borderColor: 'border-red-400', category: 'toys' },
  { id: 'blocks', name: 'Blocks', emoji: '🧱', bgColor: 'bg-emerald-100 hover:bg-emerald-200', borderColor: 'border-emerald-400', category: 'toys' },
  { id: 'crayon', name: 'Crayon', emoji: '🖍️', bgColor: 'bg-purple-100 hover:bg-purple-200', borderColor: 'border-purple-400', category: 'toys' },
  { id: 'drum', name: 'Drum', emoji: '🥁', bgColor: 'bg-orange-100 hover:bg-orange-200', borderColor: 'border-orange-400', category: 'toys' },
];

const LEVEL_2_ITEMS: ItemChoice[] = [
  { id: 'apple', name: 'Apple', emoji: '🍎', bgColor: 'bg-rose-100 hover:bg-rose-200', borderColor: 'border-rose-400', category: 'home' },
  { id: 'cup', name: 'Cup', emoji: '☕', bgColor: 'bg-orange-100 hover:bg-orange-200', borderColor: 'border-orange-400', category: 'home' },
  { id: 'shoe', name: 'Shoe', emoji: '👟', bgColor: 'bg-cyan-100 hover:bg-cyan-200', borderColor: 'border-cyan-400', category: 'home' },
  { id: 'hat', name: 'Hat', emoji: '🧢', bgColor: 'bg-sky-100 hover:bg-sky-200', borderColor: 'border-sky-400', category: 'home' },
  { id: 'banana', name: 'Banana', emoji: '🍌', bgColor: 'bg-yellow-100 hover:bg-yellow-200', borderColor: 'border-yellow-400', category: 'home' },
  { id: 'cake', name: 'Cake', emoji: '🎂', bgColor: 'bg-pink-100 hover:bg-pink-200', borderColor: 'border-pink-400', category: 'home' },
  { id: 'clock', name: 'Clock', emoji: '⏰', bgColor: 'bg-amber-100 hover:bg-amber-200', borderColor: 'border-amber-400', category: 'home' },
  { id: 'toothbrush', name: 'Toothbrush', emoji: '🪥', bgColor: 'bg-teal-100 hover:bg-teal-200', borderColor: 'border-teal-400', category: 'home' },
  { id: 'plate', name: 'Plate', emoji: '🍽️', bgColor: 'bg-slate-100 hover:bg-slate-200', borderColor: 'border-slate-400', category: 'home' },
];

const LEVEL_3_ITEMS: ItemChoice[] = [
  { id: 'rocket', name: 'Rocket', emoji: '🚀', bgColor: 'bg-purple-100 hover:bg-purple-200', borderColor: 'border-purple-400', category: 'world' },
  { id: 'butterfly', name: 'Butterfly', emoji: '🦋', bgColor: 'bg-teal-100 hover:bg-teal-200', borderColor: 'border-teal-400', category: 'world' },
  { id: 'sun', name: 'Sun', emoji: '☀️', bgColor: 'bg-amber-100 hover:bg-amber-200', borderColor: 'border-amber-400', category: 'world' },
  { id: 'duck', name: 'Duck', emoji: '🦆', bgColor: 'bg-yellow-100 hover:bg-yellow-200', borderColor: 'border-yellow-400', category: 'world' },
  { id: 'star', name: 'Star', emoji: '⭐', bgColor: 'bg-yellow-100 hover:bg-yellow-200', borderColor: 'border-yellow-400', category: 'world' },
  { id: 'flower', name: 'Flower', emoji: '🌸', bgColor: 'bg-pink-100 hover:bg-pink-200', borderColor: 'border-pink-400', category: 'world' },
  { id: 'balloon', name: 'Balloon', emoji: '🎈', bgColor: 'bg-rose-100 hover:bg-rose-200', borderColor: 'border-rose-400', category: 'world' },
  { id: 'bicycle', name: 'Bicycle', emoji: '🚲', bgColor: 'bg-blue-100 hover:bg-blue-200', borderColor: 'border-blue-400', category: 'world' },
  { id: 'cat', name: 'Cat', emoji: '🐱', bgColor: 'bg-orange-100 hover:bg-orange-200', borderColor: 'border-orange-400', category: 'world' },
  { id: 'dog', name: 'Dog', emoji: '🐶', bgColor: 'bg-amber-100 hover:bg-amber-200', borderColor: 'border-amber-400', category: 'world' },
  { id: 'rainbow', name: 'Rainbow', emoji: '🌈', bgColor: 'bg-indigo-100 hover:bg-indigo-200', borderColor: 'border-indigo-400', category: 'world' },
];

export const IDENTIFY_LEVELS: IdentifyLevelConfig[] = [
  {
    levelNumber: 1,
    title: 'Level 1: Toys & School',
    subtitle: 'Find fun toys, school supplies and everyday basics!',
    badgeEmoji: '🧸',
    roundsCount: 4,
    choicesPerRound: 4,
    items: LEVEL_1_ITEMS,
  },
  {
    levelNumber: 2,
    title: 'Level 2: Home & Food',
    subtitle: 'Identify delicious foods, clothes and household objects!',
    badgeEmoji: '🍎',
    roundsCount: 5,
    choicesPerRound: 4,
    items: LEVEL_2_ITEMS,
  },
  {
    levelNumber: 3,
    title: 'Level 3: Nature & World',
    subtitle: 'Spot vehicles, animals, nature and outdoor wonders!',
    badgeEmoji: '🚀',
    roundsCount: 6,
    choicesPerRound: 4,
    items: LEVEL_3_ITEMS,
  },
];

function shuffleArray<T>(array: readonly T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function generateRoundsForLevel(config: IdentifyLevelConfig, excludeFirstId?: string): RoundData[] {
  let availableTargets = shuffleArray(config.items);

  if (excludeFirstId && availableTargets[0]?.id === excludeFirstId) {
    const otherIdx = availableTargets.findIndex((item) => item.id !== excludeFirstId);
    if (otherIdx > 0) {
      [availableTargets[0], availableTargets[otherIdx]] = [availableTargets[otherIdx], availableTargets[0]];
    }
  }

  const selectedTargets = availableTargets.slice(0, config.roundsCount);

  return selectedTargets.map((target) => {
    const distractors = config.items.filter((item) => item.id !== target.id);
    const shuffledDistractors = shuffleArray(distractors).slice(0, config.choicesPerRound - 1);
    const roundChoices = shuffleArray([target, ...shuffledDistractors]);

    return {
      target,
      choices: roundChoices,
    };
  });
}

export const IdentifyItems: React.FC<IdentifyItemsProps> = ({
  onCollectStar,
  onNavigateHome,
  onNavigateNext,
  onNavigatePrev,
  isActivityCompleted,
}) => {
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [completedLevels, setCompletedLevels] = useState<Set<number>>(new Set());
  const activeLevelConfig = IDENTIFY_LEVELS[currentLevel - 1] || IDENTIFY_LEVELS[0];

  const [rounds, setRounds] = useState<RoundData[]>(() => generateRoundsForLevel(activeLevelConfig));
  const [currentRoundIdx, setCurrentRoundIdx] = useState<number>(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [wobbleId, setWobbleId] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isLevelFinished, setIsLevelFinished] = useState<boolean>(false);

  const totalRounds = rounds.length;
  const currentRound = rounds[currentRoundIdx] || rounds[0];

  // Start or switch level
  const initLevel = useCallback((lvlNum: number) => {
    const config = IDENTIFY_LEVELS[lvlNum - 1] || IDENTIFY_LEVELS[0];
    const newRounds = generateRoundsForLevel(config);
    setRounds(newRounds);
    setCurrentRoundIdx(0);
    setIsLevelFinished(false);
    setSelectedId(null);
    setIsSuccess(false);
    setWobbleId(null);
  }, []);

  // When level changes, generate fresh rounds & speak instructions
  useEffect(() => {
    initLevel(currentLevel);
    soundManager.speak(`Level ${currentLevel}! Can you identify the items?`);
  }, [currentLevel, initLevel]);

  // Speak prompt when round changes
  useEffect(() => {
    if (!isLevelFinished && currentRound?.target) {
      const timer = setTimeout(() => {
        soundManager.speak(`Find the ${currentRound.target.name}!`);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [currentRoundIdx, isLevelFinished, currentRound]);

  const handleSpeakPrompt = useCallback(() => {
    if (currentRound?.target) {
      soundManager.speak(`Find the ${currentRound.target.name}!`);
    }
  }, [currentRound]);

  const handleChoiceClick = (choice: ItemChoice) => {
    if (isSuccess || isLevelFinished || !currentRound) return;

    if (choice.id === currentRound.target.id) {
      // Correct Match
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
          // Current level complete!
          setIsLevelFinished(true);
          setCompletedLevels((prev) => new Set(prev).add(currentLevel));
          onCollectStar();
          soundManager.playCelebration();
          soundManager.speak(`Awesome! You completed Level ${currentLevel}!`);
        }
      }, 1100);
    } else {
      // Incorrect Match
      setWobbleId(choice.id);
      soundManager.playPop();
      soundManager.speak(`Oops, that is the ${choice.name}! Find the ${currentRound.target.name}!`);
      setTimeout(() => setWobbleId(null), 500);
    }
  };

  const handleNextLevel = () => {
    soundManager.playPop();
    if (currentLevel < IDENTIFY_LEVELS.length) {
      setCurrentLevel(currentLevel + 1);
    } else {
      setCurrentLevel(1);
    }
  };

  const handleRestartLevel = () => {
    soundManager.playPop();
    const previousFirstTarget = rounds[0]?.target.id;
    const newRounds = generateRoundsForLevel(activeLevelConfig, previousFirstTarget);
    setRounds(newRounds);
    setCurrentRoundIdx(0);
    setIsLevelFinished(false);
    setSelectedId(null);
    setIsSuccess(false);
    setWobbleId(null);
  };

  return (
    <div
      id="identify-items-activity"
      className="w-full max-w-5xl mx-auto flex flex-col items-center justify-between p-2 sm:p-4 min-h-[calc(100vh-120px)] select-none relative overflow-hidden"
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FEE2E2] via-[#FEF2F2] to-[#FEF08A] -z-20" />
      <div className="absolute top-2 left-6 text-4xl sm:text-5xl animate-spin-slow pointer-events-none -z-10">☀️</div>
      <div className="absolute top-4 right-8 text-4xl sm:text-5xl opacity-80 animate-pulse pointer-events-none -z-10">☁️</div>
      <div className="absolute top-10 left-1/4 text-3xl opacity-70 animate-bounce delay-150 pointer-events-none -z-10">🎈</div>
      <div className="absolute top-3 right-1/3 text-4xl opacity-90 pointer-events-none -z-10">⭐</div>

      {/* 1. TOP HEADER & LEVEL SELECTOR BAR */}
      <div className="w-full max-w-4xl bg-white/95 rounded-3xl border-4 border-rose-300 shadow-lg p-3 sm:p-4 mb-3 flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#EF4444] border-2 border-white flex items-center justify-center text-2xl text-white shadow-md">
              🧸
            </div>
            <div className="text-left">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight">
                Identify The Items
              </h1>
              <p className="text-xs sm:text-sm font-bold text-rose-800">
                {activeLevelConfig.subtitle}
              </p>
            </div>
          </div>

          {/* Level Switcher Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {IDENTIFY_LEVELS.map((lvl) => {
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
                      ? 'bg-rose-500 text-white border-rose-700 shadow-md scale-105 ring-2 ring-rose-300'
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

        {/* Progress & Round indicator */}
        <div className="flex items-center justify-between gap-2 px-1">
          <div className="flex items-center gap-1.5">
            {rounds.map((_, idx) => (
              <div
                key={idx}
                className={`h-3 rounded-full transition-all duration-300 ${
                  idx < currentRoundIdx
                    ? 'w-6 bg-emerald-500'
                    : idx === currentRoundIdx
                    ? 'w-8 bg-rose-500 animate-pulse'
                    : 'w-3 bg-slate-200'
                }`}
              />
            ))}
          </div>
          <span className="text-xs font-black text-rose-800 bg-rose-100 px-3 py-1 rounded-full">
            Round {currentRoundIdx + 1} of {totalRounds}
          </span>
        </div>
      </div>

      {/* 2. MAIN ACTIVITY PLAYGROUND */}
      {!isLevelFinished && currentRound ? (
        <div className="w-full max-w-4xl flex-1 flex flex-col items-center justify-center gap-5 my-2">
          {/* Target Item Spotlight Banner */}
          <div className="w-full max-w-2xl bg-white/95 backdrop-blur-md rounded-3xl p-4 sm:p-5 shadow-xl border-4 border-rose-300 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-rose-100 border-2 border-rose-300 rounded-2xl flex items-center justify-center text-4xl shadow-inner animate-bounce">
                {currentRound.target.emoji}
              </div>
              <div className="text-left">
                <span className="text-xs font-extrabold text-rose-700 uppercase tracking-wider block">
                  Target Object
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-tight">
                  FIND THE {currentRound.target.name}!
                </h2>
              </div>
            </div>

            <button
              id="identify-items-voice-btn"
              onClick={handleSpeakPrompt}
              aria-label="Hear Prompt"
              className="bg-amber-400 hover:bg-amber-300 active:scale-90 text-amber-950 px-4 py-2.5 rounded-2xl border-b-4 border-amber-600 shadow-md transition-transform cursor-pointer flex items-center gap-1.5 font-black text-xs sm:text-sm uppercase shrink-0"
              title="Hear Prompt"
            >
              <Volume2 className="w-5 h-5" />
              <span>Hear</span>
            </button>
          </div>

          {/* 4 Large Tap-Friendly Choice Cards */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6 w-full max-w-2xl mx-auto">
            {currentRound.choices.map((choice) => {
              const isSelected = selectedId === choice.id;
              const isWobbling = wobbleId === choice.id;

              return (
                <motion.button
                  key={choice.id}
                  id={`identify-choice-btn-${choice.id}`}
                  onClick={() => handleChoiceClick(choice)}
                  animate={
                    isSelected
                      ? { scale: [1, 1.12, 1.05], rotate: [0, -4, 4, 0] }
                      : isWobbling
                      ? { x: [-8, 8, -6, 6, 0], rotate: [-6, 6, -4, 4, 0] }
                      : { scale: 1, rotate: 0 }
                  }
                  transition={{ duration: 0.35 }}
                  className={`relative flex flex-col items-center justify-center p-5 sm:p-7 min-h-[140px] sm:min-h-[160px] rounded-3xl border-4 ${
                    choice.borderColor
                  } ${choice.bgColor} shadow-lg hover:shadow-xl transition-all cursor-pointer select-none active:scale-95 ${
                    isSelected
                      ? 'ring-4 ring-rose-400 bg-rose-200 border-rose-500 shadow-2xl'
                      : ''
                  }`}
                >
                  <span className="text-6xl sm:text-7xl mb-2 filter drop-shadow select-none">
                    {choice.emoji}
                  </span>

                  <span className="text-base sm:text-xl font-black text-slate-800 tracking-tight uppercase">
                    {choice.name}
                  </span>

                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-3 -right-3 bg-emerald-500 text-white rounded-full p-2 shadow-lg"
                    >
                      <Check className="w-6 h-6 stroke-[3]" />
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      ) : null}

      {/* Level Completion Celebration Modal */}
      <AnimatePresence>
        {isLevelFinished && (
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
              className="bg-white rounded-3xl border-8 border-rose-400 shadow-2xl p-6 sm:p-8 max-w-md w-full flex flex-col items-center text-center relative overflow-hidden"
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
                Awesome! You identified all items in {activeLevelConfig.title.toLowerCase()}!
              </p>

              <div className="flex flex-col sm:flex-row gap-3 w-full">
                {currentLevel < IDENTIFY_LEVELS.length ? (
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
                  className="bg-rose-100 hover:bg-rose-200 text-rose-900 font-black py-3 px-4 rounded-2xl border-b-4 border-rose-300 shadow active:translate-y-1 transition-all cursor-pointer flex items-center justify-center gap-1.5 text-sm uppercase"
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
