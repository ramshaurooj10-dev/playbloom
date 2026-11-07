import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Volume2, Star as StarIcon, Sparkles, ArrowRight, Check } from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { ActivityBottomNav } from './ActivityBottomNav';
import {
  BalloonIllustration,
  BalloonColor,
  BALLOON_COLOR_CONFIGS,
} from '../common/BalloonIllustration';
import { PremiumCardIllustration } from '../common/PremiumCardIllustration';

interface BalloonCountProps {
  onCollectStar: () => void;
  onNavigateHome?: () => void;
  onNavigateNext?: () => void;
  onNavigatePrev?: () => void;
  isActivityCompleted?: boolean;
}

interface BalloonItem {
  id: string;
  color: BalloonColor;
  xPercent: number; // Position percentage inside sky container
  yPercent: number;
  width: number;
  height: number;
  swayDuration: number;
  floatDelay: number;
}

interface QuestionConfig {
  count: number;
  choices: number[];
}

const NUMBER_WORDS: Record<number, string> = {
  1: 'one',
  2: 'two',
  3: 'three',
  4: 'four',
  5: 'five',
  6: 'six',
  7: 'seven',
  8: 'eight',
  9: 'nine',
  10: 'ten',
};

const ALL_COLORS: BalloonColor[] = [
  'red',
  'blue',
  'yellow',
  'green',
  'purple',
  'pink',
  'orange',
  'cyan',
];

// Generate intelligent 3-choice randomized answer options
function generateChoices(targetCount: number): number[] {
  const choicesSet = new Set<number>([targetCount]);

  // Generate plausible nearby distractors
  const potentialDistractors = [
    targetCount - 1,
    targetCount + 1,
    targetCount - 2,
    targetCount + 2,
    targetCount - 3,
    targetCount + 3,
  ].filter((n) => n >= 1 && n <= 10 && n !== targetCount);

  // Shuffle distractors
  const shuffled = [...potentialDistractors].sort(() => Math.random() - 0.5);

  for (const d of shuffled) {
    choicesSet.add(d);
    if (choicesSet.size >= 3) break;
  }

  // Fallback if needed
  let fallback = 1;
  while (choicesSet.size < 3 && fallback <= 10) {
    if (fallback !== targetCount) choicesSet.add(fallback);
    fallback++;
  }

  // Return shuffled array so correct answer is at a random position
  return Array.from(choicesSet).sort(() => Math.random() - 0.5);
}

// Generate organic, non-overlapping child-friendly balloon coordinates
function generateBalloons(count: number): BalloonItem[] {
  const balloons: BalloonItem[] = [];
  const shuffledColors = [...ALL_COLORS].sort(() => Math.random() - 0.5);

  // Define grid layout bounds depending on balloon count
  let cols = 3;
  let rows = 1;
  if (count <= 3) {
    cols = count;
    rows = 1;
  } else if (count <= 6) {
    cols = 3;
    rows = 2;
  } else if (count <= 8) {
    cols = 4;
    rows = 2;
  } else {
    cols = 5;
    rows = 2;
  }

  // Pre-calculate cellular slots with randomized organic jitter
  const slots: { x: number; y: number }[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      slots.push({
        x: ((c + 0.5) / cols) * 82 + 9, // 9% to 91% horizontal
        y: ((r + 0.5) / rows) * 68 + 12, // 12% to 80% vertical
      });
    }
  }

  // Shuffle slots and pick first `count`
  const selectedSlots = [...slots].sort(() => Math.random() - 0.5).slice(0, count);

  selectedSlots.forEach((slot, index) => {
    // Add minor organic jitter (-4% to +4%)
    const jitterX = (Math.random() - 0.5) * 8;
    const jitterY = (Math.random() - 0.5) * 8;
    const color = shuffledColors[index % shuffledColors.length];

    // Slightly varied child-friendly size
    const baseWidth = count > 6 ? 72 : count > 4 ? 82 : 92;
    const sizeRatio = 0.92 + Math.random() * 0.16;
    const width = Math.round(baseWidth * sizeRatio);
    const height = Math.round(width * 1.48);

    balloons.push({
      id: `balloon-${index}-${Date.now()}`,
      color,
      xPercent: Math.max(8, Math.min(88, slot.x + jitterX)),
      yPercent: Math.max(10, Math.min(78, slot.y + jitterY)),
      width,
      height,
      swayDuration: 3.2 + Math.random() * 1.8,
      floatDelay: Math.random() * 2,
    });
  });

  return balloons;
}

// Generate randomized question sequence (e.g. 6 rounds spanning easy to higher quantities)
function generateQuestionRounds(): QuestionConfig[] {
  // Balanced progression: Start with 1-5, then mix in 6-10
  const easyPool = [2, 3, 4, 5].sort(() => Math.random() - 0.5);
  const midPool = [4, 5, 6, 7, 8].sort(() => Math.random() - 0.5);
  const highPool = [6, 7, 8, 9, 10].sort(() => Math.random() - 0.5);

  const counts = [
    easyPool[0],
    easyPool[1],
    midPool[0],
    midPool[1],
    highPool[0],
    highPool[1],
  ];

  return counts.map((count) => ({
    count,
    choices: generateChoices(count),
  }));
}

export const BalloonCount: React.FC<BalloonCountProps> = ({
  onCollectStar,
  onNavigateHome,
  onNavigateNext,
  onNavigatePrev,
  isActivityCompleted = false,
}) => {
  // Game state
  const [questions, setQuestions] = useState<QuestionConfig[]>(() => generateQuestionRounds());
  const [currentRoundIdx, setCurrentRoundIdx] = useState<number>(0);
  const [balloons, setBalloons] = useState<BalloonItem[]>([]);
  const [tappedBalloons, setTappedBalloons] = useState<Set<string>>(new Set());

  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [shakeChoice, setShakeChoice] = useState<number | null>(null);
  const [isRising, setIsRising] = useState<boolean>(false);
  const [isAllCompleted, setIsAllCompleted] = useState<boolean>(false);
  const [starsEarned, setStarsEarned] = useState<number>(0);

  const currentQuestion = questions[currentRoundIdx] || questions[0];
  const targetCount = currentQuestion?.count || 3;
  const currentChoices = currentQuestion?.choices || [2, 3, 4];

  // Initialize or update balloons whenever current round changes
  useEffect(() => {
    if (isAllCompleted) return;
    const newBalloons = generateBalloons(targetCount);
    setBalloons(newBalloons);
    setTappedBalloons(new Set());
    setSelectedChoice(null);
    setIsCorrect(null);
    setShakeChoice(null);
    setIsRising(false);

    // Speak voice prompt: "How many balloons?"
    const timer = setTimeout(() => {
      soundManager.speak('How many balloons?');
    }, 250);

    return () => clearTimeout(timer);
  }, [currentRoundIdx, targetCount, isAllCompleted]);

  // Voice re-hear helper
  const handleHearPrompt = () => {
    soundManager.playPop();
    soundManager.speak('How many balloons?');
  };

  // Tap balloon tracking support
  const handleBalloonTap = (id: string) => {
    soundManager.playPop();
    setTappedBalloons((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Handle number choice selection
  const handleSelectChoice = (choice: number) => {
    if (selectedChoice !== null && isCorrect === true) return;
    if (isAllCompleted) return;

    if (choice === targetCount) {
      // Correct choice
      setSelectedChoice(choice);
      setIsCorrect(true);
      setIsRising(true);
      soundManager.playSuccess();

      const numberWord = NUMBER_WORDS[targetCount] || `${targetCount}`;
      soundManager.speak(`Great job! There are ${numberWord} balloons!`);

      setStarsEarned((prev) => prev + 1);

      // Check if finished all rounds
      if (currentRoundIdx + 1 >= questions.length) {
        onCollectStar();
        setTimeout(() => {
          setIsAllCompleted(true);
          soundManager.playCelebration();
          soundManager.speak('Great job! You counted all the balloons!');
        }, 1600);
      } else {
        // Auto-advance after short pleasant delay
        setTimeout(() => {
          setCurrentRoundIdx((prev) => prev + 1);
        }, 1600);
      }
    } else {
      // Wrong choice: gentle guidance, recount encouragement
      soundManager.playPop();
      const promptText = Math.random() > 0.5 ? "Let's count again." : 'Try again!';
      soundManager.speak(promptText);
      setShakeChoice(choice);
      setSelectedChoice(choice);
      setIsCorrect(false);

      setTimeout(() => {
        setShakeChoice(null);
        setSelectedChoice(null);
        setIsCorrect(null);
      }, 850);
    }
  };

  // Replay & full reshuffle
  const handleReplay = () => {
    soundManager.playPop();
    soundManager.speak('Let us count the balloons again! How many balloons?');
    const newQuestions = generateQuestionRounds();
    setQuestions(newQuestions);
    setCurrentRoundIdx(0);
    setIsAllCompleted(false);
    setSelectedChoice(null);
    setIsCorrect(null);
    setShakeChoice(null);
    setIsRising(false);
    setStarsEarned(0);
  };

  return (
    <div
      id="balloon-count-activity"
      className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center p-2 sm:p-4 select-none"
    >
      {/* MAIN CONTAINER */}
      <div className="w-full bg-gradient-to-b from-sky-400 via-sky-300 to-sky-200 border-4 sm:border-6 border-sky-500 rounded-3xl p-3 sm:p-5 shadow-2xl flex flex-col items-center relative overflow-hidden min-h-[580px] justify-between">
        {/* Soft Background Clouds for Sky Atmosphere */}
        <div className="absolute top-4 left-6 text-5xl opacity-40 pointer-events-none select-none">
          ☁️
        </div>
        <div className="absolute top-12 right-10 text-6xl opacity-35 pointer-events-none select-none">
          ☁️
        </div>
        <div className="absolute bottom-28 left-16 text-4xl opacity-30 pointer-events-none select-none">
          ☁️
        </div>
        <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-yellow-200/40 blur-2xl pointer-events-none" />

        {/* TOP CONTROL & HUD BAR */}
        <div className="w-full flex flex-col gap-2 z-20">
          <div className="w-full flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
            {/* Title Badge */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 bg-white/95 border-2 border-sky-400 px-3.5 py-1.5 rounded-2xl shadow-sm">
                <div className="w-6 h-8 flex items-center justify-center">
                  <BalloonIllustration color="red" width={22} height={32} showString={false} />
                </div>
                <h1 className="text-base sm:text-xl font-black text-sky-950 uppercase tracking-tight">
                  BALLOON COUNT
                </h1>
              </div>
            </div>

            {/* Round Badge, Stars & Replay Button */}
            <div className="flex items-center gap-2">
              {/* Round indicator */}
              <div className="bg-white/90 border-2 border-sky-400 px-3 py-1 rounded-xl shadow-xs text-xs sm:text-sm font-black text-sky-900 flex items-center gap-1">
                <span>Round</span>
                <span className="text-sky-600 font-extrabold">{currentRoundIdx + 1}</span>
                <span>/</span>
                <span>{questions.length}</span>
              </div>

              {/* Star Badge */}
              <div className="bg-amber-300 border-2 border-amber-500 px-3 py-1 rounded-xl shadow-xs text-xs sm:text-sm font-black text-amber-950 flex items-center gap-1.5">
                <StarIcon className="w-4 h-4 fill-amber-500 text-amber-950" />
                <span>{starsEarned}</span>
              </div>

              {/* Replay Button */}
              <button
                type="button"
                onClick={handleReplay}
                title="Restart & Reshuffle Activity"
                className="w-9 h-9 sm:w-10 sm:h-10 bg-amber-300 hover:bg-amber-400 border-2 border-amber-500 rounded-xl flex items-center justify-center text-amber-950 shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                <RotateCcw className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* QUESTION PROMPT BANNER */}
          <div className="w-full bg-white/95 border-3 sm:border-4 border-sky-400 rounded-2xl sm:rounded-3xl p-3 shadow-md flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {/* Speaker Re-hear button */}
              <button
                type="button"
                onClick={handleHearPrompt}
                title="Hear Question Again"
                className="w-10 h-10 sm:w-12 sm:h-12 bg-sky-500 hover:bg-sky-600 border-b-4 border-sky-700 rounded-2xl flex items-center justify-center text-white shadow-md active:border-b-0 active:translate-y-1 transition-all cursor-pointer shrink-0"
              >
                <Volume2 className="w-6 h-6 stroke-[2.5]" />
              </button>

              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
                  How many balloons?
                </h2>
                <p className="text-xs sm:text-sm font-bold text-sky-700">
                  Count the floating balloons and tap the matching number!
                </p>
              </div>
            </div>

            {/* Subtle tip pill */}
            <div className="hidden md:flex items-center gap-1.5 bg-sky-100 border border-sky-300 text-sky-900 px-3 py-1.5 rounded-xl text-xs font-black">
              <span>💡</span>
              <span>Tap balloons to help you count!</span>
            </div>
          </div>
        </div>

        {/* CENTER: SKY AREA WITH GENTLY FLOATING BALLOONS */}
        <div className="w-full flex-1 relative min-h-[300px] sm:min-h-[340px] my-2 overflow-hidden rounded-2xl border-2 border-sky-300/60 bg-gradient-to-b from-sky-300/40 to-sky-200/30">
          <AnimatePresence mode="wait">
            {!isAllCompleted && (
              <motion.div
                key={`round-balloons-${currentRoundIdx}`}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 w-full h-full"
              >
                {balloons.map((balloon) => {
                  const isTapped = tappedBalloons.has(balloon.id);

                  return (
                    <motion.div
                      key={balloon.id}
                      style={{
                        position: 'absolute',
                        left: `${balloon.xPercent}%`,
                        top: `${balloon.yPercent}%`,
                        transform: 'translate(-50%, -50%)',
                      }}
                      animate={
                        isRising
                          ? {
                              y: [0, -160],
                              opacity: [1, 0.7],
                              transition: { duration: 1.4, ease: 'easeIn' },
                            }
                          : {
                              y: [-5, 5, -5],
                              x: [-3, 3, -3],
                              transition: {
                                duration: balloon.swayDuration,
                                repeat: Infinity,
                                ease: 'easeInOut',
                                delay: balloon.floatDelay,
                              },
                            }
                      }
                      className="cursor-pointer select-none"
                    >
                      <div className="relative group">
                        <BalloonIllustration
                          color={balloon.color}
                          width={balloon.width}
                          height={balloon.height}
                          isTapped={isTapped}
                          onTap={() => handleBalloonTap(balloon.id)}
                        />

                        {/* Optional Tap Checkmark / Count Helper Pill */}
                        {isTapped && (
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="absolute -top-2 -right-2 bg-white/95 border-2 border-amber-400 text-amber-900 rounded-full w-6 h-6 flex items-center justify-center text-xs font-black shadow-md pointer-events-none"
                          >
                            ✓
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* BOTTOM: LARGE EASY-TO-TAP NUMBER BUTTON CHOICES */}
        <div className="w-full z-20 mt-1 mb-1">
          <div className="w-full max-w-xl mx-auto flex items-center justify-center gap-4 sm:gap-6">
            {currentChoices.map((choice) => {
              const isSelected = selectedChoice === choice;
              const isShaking = shakeChoice === choice;

              let buttonStyles =
                'bg-white text-slate-800 border-amber-300 border-b-6 hover:border-amber-400 hover:bg-amber-50';

              if (isSelected && isCorrect === true) {
                buttonStyles =
                  'bg-emerald-500 text-white border-emerald-700 border-b-6 ring-4 ring-emerald-300 scale-105';
              } else if (isSelected && isCorrect === false) {
                buttonStyles = 'bg-rose-500 text-white border-rose-700 border-b-6';
              }

              return (
                <motion.button
                  key={`choice-${choice}`}
                  type="button"
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.92 }}
                  animate={isShaking ? { x: [-10, 10, -10, 10, 0] } : {}}
                  transition={{ duration: 0.35 }}
                  onClick={() => handleSelectChoice(choice)}
                  className={`flex-1 min-w-[90px] sm:min-w-[120px] max-w-[150px] py-4 sm:py-5 px-3 sm:px-6 rounded-3xl font-black text-3xl sm:text-4xl shadow-xl flex items-center justify-center cursor-pointer transition-all active:border-b-2 active:translate-y-1 relative ${buttonStyles}`}
                >
                  <span>{choice}</span>

                  {/* Checkmark icon for correct selection */}
                  {isSelected && isCorrect === true && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-3 -right-3 bg-emerald-600 border-2 border-white text-white rounded-full p-1.5 shadow-md"
                    >
                      <Check className="w-5 h-5 stroke-[3]" />
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* COMPLETION CELEBRATION MODAL */}
        <AnimatePresence>
          {isAllCompleted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 z-40 flex items-center justify-center bg-white/95 backdrop-blur-sm p-4"
            >
              <div className="bg-gradient-to-b from-sky-50 via-amber-50 to-blue-50 border-6 sm:border-8 border-sky-400 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col items-center text-center max-w-md w-full">
                {/* Balloon Celebration Visual */}
                <div className="w-24 h-24 mb-4 rounded-full bg-white border-4 border-sky-300 flex items-center justify-center shadow-lg animate-bounce relative shrink-0">
                  <PremiumCardIllustration id="balloon_count" />
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-sky-950 tracking-tight uppercase">
                  BALLOON COUNT CHAMPION!
                </h3>

                <p className="text-sm sm:text-base font-bold text-sky-800 mt-2 mb-4">
                  You counted all the balloons correctly! Super counting and number skills!
                </p>

                {/* Star Award Badge */}
                <div className="flex items-center gap-2 bg-amber-200 border-2 border-amber-400 px-4 py-2 rounded-full font-black text-amber-950 text-base mb-6 shadow-sm">
                  <StarIcon className="w-6 h-6 fill-amber-400 text-amber-600" />
                  <span>STAR EARNED!</span>
                </div>

                {/* Action Buttons: Play Again & Next */}
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <button
                    type="button"
                    onClick={handleReplay}
                    className="flex-1 flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-black py-3.5 px-6 rounded-2xl border-b-6 border-sky-700 shadow-lg active:border-b-2 active:translate-y-1 transition-all cursor-pointer text-base uppercase"
                  >
                    <RotateCcw className="w-5 h-5 stroke-[3]" />
                    <span>Play Again</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (onNavigateNext) onNavigateNext();
                      else if (onNavigateHome) onNavigateHome();
                    }}
                    className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-black py-3.5 px-6 rounded-2xl border-b-6 border-emerald-700 shadow-lg active:border-b-2 active:translate-y-1 transition-all cursor-pointer text-base uppercase"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-5 h-5 stroke-[3]" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Standard Bottom Navigation: [ PREV ] [ HOME ] [ NEXT ] */}
      <ActivityBottomNav
        onNavigatePrev={onNavigatePrev}
        onNavigateHome={onNavigateHome}
        onNavigateNext={onNavigateNext}
        isNextUnlocked={isActivityCompleted || isAllCompleted}
      />
    </div>
  );
};
