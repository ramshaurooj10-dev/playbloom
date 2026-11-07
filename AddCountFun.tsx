import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  RotateCcw,
  Volume2,
  Star,
  Sparkles,
  Trophy,
  Check,
  Plus,
} from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { ActivityBottomNav } from './ActivityBottomNav';
import { AddObjectItem, ObjectType } from '../common/AddObjectItem';

// ----------------------------------------------------------------------------
// INTERFACES & DEFINITIONS
// ----------------------------------------------------------------------------

export interface AddCountQuestion {
  id: string;
  objectType: ObjectType;
  objectNameSingle: string;
  objectNamePlural: string;
  leftCount: number;
  rightCount: number;
  total: number;
  options: number[];
  themeColor: {
    bg: string;
    border: string;
    badge: string;
    text: string;
  };
}

interface AddCountFunProps {
  onCollectStar?: () => void;
  onNavigateHome?: () => void;
  onNavigateNext?: () => void;
  onNavigatePrev?: () => void;
  isActivityCompleted?: boolean;
}

const OBJECT_INFO: Record<
  ObjectType,
  {
    single: string;
    plural: string;
    theme: { bg: string; border: string; badge: string; text: string };
  }
> = {
  ice_cream: {
    single: 'Ice Cream',
    plural: 'Ice Creams',
    theme: {
      bg: 'bg-rose-500',
      border: 'border-rose-700',
      badge: 'bg-rose-100 text-rose-800 border-rose-300',
      text: 'text-rose-600',
    },
  },
  teddy: {
    single: 'Teddy Bear',
    plural: 'Teddy Bears',
    theme: {
      bg: 'bg-amber-500',
      border: 'border-amber-700',
      badge: 'bg-amber-100 text-amber-800 border-amber-300',
      text: 'text-amber-600',
    },
  },
  toy_car: {
    single: 'Toy Car',
    plural: 'Toy Cars',
    theme: {
      bg: 'bg-sky-500',
      border: 'border-sky-700',
      badge: 'bg-sky-100 text-sky-800 border-sky-300',
      text: 'text-sky-600',
    },
  },
  candy: {
    single: 'Candy',
    plural: 'Candies',
    theme: {
      bg: 'bg-purple-500',
      border: 'border-purple-700',
      badge: 'bg-purple-100 text-purple-800 border-purple-300',
      text: 'text-purple-600',
    },
  },
  lollipop: {
    single: 'Lollipop',
    plural: 'Lollipops',
    theme: {
      bg: 'bg-orange-500',
      border: 'border-orange-700',
      badge: 'bg-orange-100 text-orange-800 border-orange-300',
      text: 'text-orange-600',
    },
  },
};

const ALL_OBJECT_TYPES: ObjectType[] = ['ice_cream', 'teddy', 'toy_car', 'candy', 'lollipop'];

// Preschool friendly addition combinations: max total is 6 (1+1 to 4+2)
const ADDITION_PAIRS: [number, number][] = [
  [1, 1],
  [1, 2],
  [2, 1],
  [2, 2],
  [2, 3],
  [3, 2],
  [3, 1],
  [1, 3],
  [4, 1],
  [1, 4],
  [3, 3],
  [4, 2],
  [2, 4],
];

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Generate 4 plausible, unique choices including the correct total (range 1-8)
function generateOptionChoices(correctTotal: number): number[] {
  const distractors = new Set<number>();
  const candidates = [
    correctTotal - 1,
    correctTotal + 1,
    correctTotal - 2,
    correctTotal + 2,
    correctTotal + 3,
    correctTotal - 3,
  ].filter((n) => n >= 1 && n <= 8 && n !== correctTotal);

  const shuffledCandidates = shuffleArray(candidates);
  for (const num of shuffledCandidates) {
    if (distractors.size < 3) {
      distractors.add(num);
    }
  }

  // Fallback if needed
  let fallback = 1;
  while (distractors.size < 3) {
    if (fallback !== correctTotal && !distractors.has(fallback)) {
      distractors.add(fallback);
    }
    fallback++;
  }

  return shuffleArray([correctTotal, ...Array.from(distractors)]);
}

/**
 * Generate a set of rich, randomized questions.
 * Ensures:
 * - Different object types across questions
 * - Different quantities
 * - Excludes previous first question signature on replay
 */
function generateQuestionSet(
  count = 5,
  excludeSignature?: { objectType: ObjectType; left: number; right: number }
): AddCountQuestion[] {
  // Shuffle object types to ensure diverse objects across questions
  let objectQueue = shuffleArray(ALL_OBJECT_TYPES);
  while (objectQueue.length < count) {
    objectQueue = [...objectQueue, ...shuffleArray(ALL_OBJECT_TYPES)];
  }

  // Shuffle addition combinations
  let pairQueue = shuffleArray(ADDITION_PAIRS);
  while (pairQueue.length < count) {
    pairQueue = [...pairQueue, ...shuffleArray(ADDITION_PAIRS)];
  }

  // If excludeSignature given (on replay), ensure first question is distinct
  if (excludeSignature) {
    if (
      objectQueue[0] === excludeSignature.objectType &&
      pairQueue[0][0] === excludeSignature.left &&
      pairQueue[0][1] === excludeSignature.right
    ) {
      // Swap with next distinct object
      const otherObjIdx = objectQueue.findIndex((o) => o !== excludeSignature.objectType);
      if (otherObjIdx > 0) {
        [objectQueue[0], objectQueue[otherObjIdx]] = [objectQueue[otherObjIdx], objectQueue[0]];
      }
      // Rotate pairQueue
      const otherPairIdx = pairQueue.findIndex(
        (p) => p[0] !== excludeSignature.left || p[1] !== excludeSignature.right
      );
      if (otherPairIdx > 0) {
        [pairQueue[0], pairQueue[otherPairIdx]] = [pairQueue[otherPairIdx], pairQueue[0]];
      }
    }
  }

  const questions: AddCountQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const objType = objectQueue[i];
    const [left, right] = pairQueue[i];
    const total = left + right;
    const info = OBJECT_INFO[objType];

    questions.push({
      id: `q_${objType}_${left}_${right}_${Date.now()}_${Math.random()}`,
      objectType: objType,
      objectNameSingle: info.single,
      objectNamePlural: info.plural,
      leftCount: left,
      rightCount: right,
      total,
      options: generateOptionChoices(total),
      themeColor: info.theme,
    });
  }

  return questions;
}

// ----------------------------------------------------------------------------
// COMPONENT
// ----------------------------------------------------------------------------

export const AddCountFun: React.FC<AddCountFunProps> = ({
  onCollectStar,
  onNavigateHome,
  onNavigateNext,
  onNavigatePrev,
  isActivityCompleted,
}) => {
  const [questions, setQuestions] = useState<AddCountQuestion[]>(() => generateQuestionSet(5));
  const [currentQIdx, setCurrentQIdx] = useState<number>(0);

  // States for animation flow:
  // 'separated' -> show left & right groups with "+" sign
  // 'combining' -> moving together
  // 'combined' -> merged into single group, ready for counting and answer
  // 'celebrating' -> correct answer selected
  // 'completed' -> all questions finished
  const [groupState, setGroupState] = useState<'separated' | 'combining' | 'combined'>('separated');
  const [phase, setPhase] = useState<'playing' | 'celebrating' | 'completed'>('playing');

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [wrongShakeAnswer, setWrongShakeAnswer] = useState<number | null>(null);
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number }[]>([]);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const currentQ = questions[currentQIdx] || questions[0];
  const totalQuestions = questions.length;

  const timersRef = useRef<NodeJS.Timeout[]>([]);
  const addTimer = (fn: () => void, ms: number) => {
    const t = setTimeout(fn, ms);
    timersRef.current.push(t);
    return t;
  };

  const clearAllTimers = () => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  };

  // Start background music
  useEffect(() => {
    soundManager.startBackgroundMusic();
    return () => {
      clearAllTimers();
      soundManager.stopSpeech();
    };
  }, []);

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundManager.enabled = !next;
    if (next) {
      soundManager.stopBackgroundMusic();
    } else {
      soundManager.startBackgroundMusic();
    }
  };

  /**
   * Run the exact voice and visual animation sequence for each question:
   * 1. Left and right groups are separated.
   * 2. Say: "Let's add them together!"
   * 3. Visually animate the two groups moving toward each other and becoming one combined group.
   * 4. Play subtle swoosh / combine pop sound effect.
   * 5. Say: "Now count them!"
   * 6. Then say: "How many are there altogether?"
   * 7. Enable large answer buttons.
   */
  const startQuestionSequence = useCallback((q: AddCountQuestion) => {
    clearAllTimers();
    soundManager.stopSpeech();

    // Reset visual state
    setGroupState('separated');
    setPhase('playing');
    setSelectedAnswer(null);
    setWrongShakeAnswer(null);
    setSparkles([]);

    // Step 1: Initial voice "Let's add them together!" after small pause
    addTimer(() => {
      soundManager.speak("Let's add them together!", () => {
        // Step 2: Animate groups moving toward each other
        addTimer(() => {
          setGroupState('combining');
          soundManager.playPop();

          // Step 3: Transition to combined state
          addTimer(() => {
            setGroupState('combined');
            soundManager.playTidySnap();

            // Step 4: Voice narration "Now count them!" -> "How many are there altogether?"
            addTimer(() => {
              soundManager.speak('Now count them!', () => {
                addTimer(() => {
                  soundManager.speak('How many are there altogether?');
                }, 400);
              });
            }, 300);
          }, 800);
        }, 300);
      });
    }, 400);
  }, []);

  // Trigger question flow when question index changes
  useEffect(() => {
    if (phase !== 'completed') {
      startQuestionSequence(currentQ);
    }
  }, [currentQIdx, questions, startQuestionSequence]);

  // Voice repeat button
  const handleRepeatInstruction = () => {
    soundManager.playPop();
    if (phase === 'completed') {
      soundManager.speak('Great job! You are an addition superstar! Tap replay to play again!');
      return;
    }

    if (groupState === 'combined') {
      soundManager.speak('Count them! How many are there altogether?');
    } else {
      soundManager.speak("Let's add them together!");
    }
  };

  // Handle number choice selection
  const handleSelectOption = (choice: number) => {
    if (phase !== 'playing') return;

    soundManager.playPop();

    if (choice === currentQ.total) {
      // CORRECT ANSWER!
      setSelectedAnswer(choice);
      setPhase('celebrating');
      setWrongShakeAnswer(null);

      // Play success chime + celebration
      soundManager.playSuccess();
      soundManager.playStarCatch();

      // Voice: "Great job!"
      soundManager.speak('Great job!');

      // Sparkles effect
      setSparkles([
        { id: 1, x: 25, y: 30 },
        { id: 2, x: 50, y: 20 },
        { id: 3, x: 75, y: 30 },
      ]);

      // Automatically move to next question after celebration
      addTimer(() => {
        setSparkles([]);
        if (currentQIdx + 1 < totalQuestions) {
          setCurrentQIdx((prev) => prev + 1);
        } else {
          // All questions finished!
          setPhase('completed');
          soundManager.playCelebration();
          if (onCollectStar) onCollectStar();
          soundManager.speak('Great job! You know how to add and count!');
        }
      }, 2200);
    } else {
      // WRONG ANSWER
      soundManager.playError();
      setWrongShakeAnswer(choice);
      setSelectedAnswer(choice);

      // Say: "Let's count again."
      soundManager.speak("Let's count again.");

      // Clear shake after brief moment, keep question on screen, allow child to try again
      addTimer(() => {
        setWrongShakeAnswer(null);
        setSelectedAnswer(null);
      }, 900);
    }
  };

  // --------------------------------------------------------------------------
  // REPLAY GAME (GUARANTEED FRESH RANDOM QUESTION SET)
  // --------------------------------------------------------------------------
  const handleReplay = () => {
    soundManager.playPop();
    const prevSig = {
      objectType: currentQ.objectType,
      left: currentQ.leftCount,
      right: currentQ.rightCount,
    };
    const freshQuestions = generateQuestionSet(5, prevSig);
    setQuestions(freshQuestions);
    setCurrentQIdx(0);
    setPhase('playing');
    setGroupState('separated');
    setSelectedAnswer(null);
    setWrongShakeAnswer(null);
    setSparkles([]);
    startQuestionSequence(freshQuestions[0]);
  };

  return (
    <div
      id="add-count-fun-activity"
      className="min-h-screen bg-gradient-to-b from-[#FEFCE8] via-[#FFFBEB] to-[#FEF3C7] flex flex-col items-center justify-between p-3 sm:p-6 select-none font-sans text-slate-800"
    >
      {/* --------------------------------------------------------------------- */}
      {/* TOP HEADER / CONTROLS                                                 */}
      {/* --------------------------------------------------------------------- */}
      <div className="w-full max-w-4xl flex items-center justify-between gap-2 px-2 py-2">
        {/* Title & Progress Badge */}
        <div className="flex items-center gap-3">
          <div className="bg-[#F59E0B] text-white p-2.5 sm:p-3 rounded-2xl shadow-md border-2 border-[#D97706] flex items-center justify-center">
            <Plus className="w-6 h-6 stroke-[3]" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-amber-950 tracking-tight flex items-center gap-2">
              <span>ADD & COUNT FUN</span>
              <span className="text-xs sm:text-sm font-extrabold bg-amber-200 text-amber-900 px-2.5 py-0.5 rounded-full border border-amber-300">
                LEVEL 6
              </span>
            </h1>
            <p className="text-xs sm:text-sm font-bold text-amber-800">
              Question {currentQIdx + 1} of {totalQuestions}
            </p>
          </div>
        </div>

        {/* Action Controls (Audio Speak, Mute, Replay) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Audio Speaker Prompt Repeat */}
          <button
            type="button"
            onClick={handleRepeatInstruction}
            className="p-3 bg-white hover:bg-amber-50 text-amber-700 rounded-2xl shadow-md border-2 border-amber-200 active:scale-95 transition cursor-pointer flex items-center gap-1.5"
            title="Hear instruction again"
            aria-label="Repeat speech"
          >
            <Volume2 className="w-6 h-6 stroke-[2.5]" />
            <span className="hidden sm:inline font-bold text-xs">LISTEN</span>
          </button>

          {/* Mute Toggle */}
          <button
            type="button"
            onClick={toggleMute}
            className="p-3 bg-white hover:bg-amber-50 text-amber-700 rounded-2xl shadow-md border-2 border-amber-200 active:scale-95 transition cursor-pointer text-xs font-black"
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {isMuted ? '🔇' : '🎵'}
          </button>

          {/* Replay */}
          <button
            type="button"
            onClick={handleReplay}
            className="p-3 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-2xl shadow-md border-2 border-amber-300 active:scale-95 transition cursor-pointer flex items-center gap-1.5 font-black text-xs"
            title="Shuffle and play a new question set"
          >
            <RotateCcw className="w-5 h-5 stroke-[2.5]" />
            <span className="hidden sm:inline">REPLAY</span>
          </button>
        </div>
      </div>

      {/* Progress Dots */}
      <div className="w-full max-w-md flex items-center justify-center gap-2 my-1">
        {questions.map((q, idx) => {
          const isDone = idx < currentQIdx || phase === 'completed';
          const isCurrent = idx === currentQIdx && phase !== 'completed';
          return (
            <div
              key={q.id}
              className={`h-3 rounded-full transition-all duration-300 ${
                isCurrent
                  ? 'w-8 bg-[#F59E0B] shadow-md ring-2 ring-amber-300'
                  : isDone
                  ? 'w-3 bg-emerald-500'
                  : 'w-3 bg-amber-200'
              }`}
            />
          );
        })}
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* MAIN PLAY AREA                                                        */}
      {/* --------------------------------------------------------------------- */}
      <main className="w-full max-w-4xl flex-1 flex flex-col items-center justify-center relative py-2 px-2">
        <AnimatePresence mode="wait">
          {phase !== 'completed' ? (
            <motion.div
              key={currentQ.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="w-full flex flex-col items-center justify-center gap-4 sm:gap-6"
            >
              {/* Voice / Step Banner */}
              <div className="w-full max-w-xl text-center">
                <div className="inline-flex items-center justify-center gap-2 bg-white/95 px-5 py-2.5 rounded-3xl shadow-sm border-2 border-amber-200 text-amber-950 font-black text-base sm:text-xl">
                  {groupState === 'separated' && (
                    <span>
                      Let's add them together!
                    </span>
                  )}
                  {groupState === 'combining' && (
                    <span className="text-[#D97706] animate-pulse">
                      Adding together...
                    </span>
                  )}
                  {groupState === 'combined' && (
                    <span className="text-emerald-700">
                      Now count them! How many altogether?
                    </span>
                  )}
                </div>
              </div>

              {/* Object Stage Card */}
              <div className="w-full max-w-2xl bg-white rounded-3xl p-4 sm:p-8 shadow-xl border-4 border-amber-200 relative overflow-hidden flex flex-col items-center justify-center min-h-[220px] sm:min-h-[280px]">
                {/* Background Sparkles for Success */}
                {sparkles.length > 0 && (
                  <div className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center">
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1.2, opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-amber-400 font-black text-4xl sm:text-6xl flex items-center gap-2 drop-shadow-md"
                    >
                      <Sparkles className="w-12 h-12 text-yellow-400 fill-yellow-400 animate-spin" />
                      <span>{currentQ.total}!</span>
                      <Star className="w-12 h-12 text-amber-400 fill-amber-400 animate-bounce" />
                    </motion.div>
                  </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* SEPARATED / COMBINING STAGE                                   */}
                {/* ------------------------------------------------------------- */}
                {groupState !== 'combined' && (
                  <div className="w-full flex items-center justify-center gap-3 sm:gap-8">
                    {/* LEFT GROUP */}
                    <motion.div
                      animate={
                        groupState === 'combining'
                          ? { x: 50, scale: 1.05 }
                          : { x: 0, scale: 1 }
                      }
                      transition={{ duration: 0.7, ease: 'easeInOut' }}
                      className="flex flex-col items-center gap-2"
                    >
                      <div className="flex flex-wrap items-center justify-center gap-2 bg-amber-50/80 p-3 sm:p-4 rounded-2xl border-2 border-amber-200 shadow-inner min-w-[100px] sm:min-w-[140px] min-h-[100px]">
                        {Array.from({ length: currentQ.leftCount }).map((_, idx) => (
                          <motion.div
                            key={`left_${idx}`}
                            initial={{ scale: 0, rotate: -10 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: idx * 0.1, type: 'spring' }}
                          >
                            <AddObjectItem type={currentQ.objectType} size="md" />
                          </motion.div>
                        ))}
                      </div>
                      <span className="text-base sm:text-xl font-black text-amber-900 bg-amber-200 px-3 py-0.5 rounded-full">
                        {currentQ.leftCount}
                      </span>
                    </motion.div>

                    {/* PLUS SIGN */}
                    <motion.div
                      animate={
                        groupState === 'combining'
                          ? { scale: 0, opacity: 0 }
                          : { scale: 1, opacity: 1 }
                      }
                      transition={{ duration: 0.4 }}
                      className="flex items-center justify-center w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-[#F59E0B] text-white shadow-md border-2 border-[#D97706]"
                    >
                      <Plus className="w-6 h-6 sm:w-8 sm:h-8 stroke-[3.5]" />
                    </motion.div>

                    {/* RIGHT GROUP */}
                    <motion.div
                      animate={
                        groupState === 'combining'
                          ? { x: -50, scale: 1.05 }
                          : { x: 0, scale: 1 }
                      }
                      transition={{ duration: 0.7, ease: 'easeInOut' }}
                      className="flex flex-col items-center gap-2"
                    >
                      <div className="flex flex-wrap items-center justify-center gap-2 bg-amber-50/80 p-3 sm:p-4 rounded-2xl border-2 border-amber-200 shadow-inner min-w-[100px] sm:min-w-[140px] min-h-[100px]">
                        {Array.from({ length: currentQ.rightCount }).map((_, idx) => (
                          <motion.div
                            key={`right_${idx}`}
                            initial={{ scale: 0, rotate: 10 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: idx * 0.1, type: 'spring' }}
                          >
                            <AddObjectItem type={currentQ.objectType} size="md" />
                          </motion.div>
                        ))}
                      </div>
                      <span className="text-base sm:text-xl font-black text-amber-900 bg-amber-200 px-3 py-0.5 rounded-full">
                        {currentQ.rightCount}
                      </span>
                    </motion.div>
                  </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* COMBINED STAGE: All objects together with numbers for counting */}
                {/* ------------------------------------------------------------- */}
                {groupState === 'combined' && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', damping: 14 }}
                    className="w-full flex flex-col items-center justify-center gap-3"
                  >
                    {/* Math Equation Formula Tag */}
                    <div className="flex items-center gap-2 text-sm sm:text-base font-black text-amber-950 bg-amber-100 px-4 py-1 rounded-full border border-amber-300">
                      <span>{currentQ.leftCount}</span>
                      <span>+</span>
                      <span>{currentQ.rightCount}</span>
                      <span>=</span>
                      <span className="text-rose-600">?</span>
                    </div>

                    {/* Combined Objects Grid */}
                    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 p-4 bg-amber-50/90 rounded-3xl border-2 border-amber-200 shadow-inner max-w-lg">
                      {Array.from({ length: currentQ.total }).map((_, idx) => {
                        const countNumber = idx + 1;
                        return (
                          <motion.div
                            key={`combined_${idx}`}
                            initial={{ scale: 0, y: 15 }}
                            animate={{ scale: 1, y: 0 }}
                            transition={{ delay: idx * 0.08, type: 'spring' }}
                            className="relative flex flex-col items-center group cursor-pointer"
                            onClick={() => {
                              soundManager.playPop();
                              soundManager.speak(`${countNumber}`);
                            }}
                          >
                            <AddObjectItem type={currentQ.objectType} size="lg" />
                            {/* Little number helper badge under each object */}
                            <span className="mt-1 text-xs sm:text-sm font-black bg-white text-slate-700 px-2 py-0.5 rounded-full shadow-sm border border-slate-200">
                              {countNumber}
                            </span>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* ------------------------------------------------------------- */}
              {/* LARGE TOUCH-FRIENDLY ANSWER CHOICES                           */}
              {/* ------------------------------------------------------------- */}
              <div className="w-full max-w-xl flex flex-col items-center gap-2">
                <p className="text-xs sm:text-sm font-bold text-amber-900/80">
                  Tap the matching total number:
                </p>

                <div className="w-full grid grid-cols-4 gap-3 sm:gap-4">
                  {currentQ.options.map((opt) => {
                    const isSelected = selectedAnswer === opt;
                    const isShaking = wrongShakeAnswer === opt;
                    const isCorrectSelected = isSelected && opt === currentQ.total;
                    const isWrongSelected = isSelected && opt !== currentQ.total;

                    return (
                      <motion.button
                        key={`choice_${opt}`}
                        type="button"
                        onClick={() => handleSelectOption(opt)}
                        disabled={phase === 'celebrating' || groupState !== 'combined'}
                        whileHover={groupState === 'combined' ? { scale: 1.05 } : {}}
                        whileTap={groupState === 'combined' ? { scale: 0.95 } : {}}
                        animate={
                          isShaking
                            ? { x: [-8, 8, -6, 6, -3, 3, 0] }
                            : isCorrectSelected
                            ? { scale: [1, 1.15, 1.08] }
                            : {}
                        }
                        transition={{ duration: 0.4 }}
                        className={`py-4 sm:py-6 px-2 rounded-3xl font-black text-3xl sm:text-4xl shadow-xl transition-all cursor-pointer flex flex-col items-center justify-center border-b-8 relative select-none ${
                          groupState !== 'combined'
                            ? 'opacity-60 cursor-not-allowed bg-slate-100 text-slate-400 border-slate-300 border-b-4'
                            : isCorrectSelected
                            ? 'bg-emerald-500 text-white border-emerald-700 shadow-emerald-400/50'
                            : isWrongSelected
                            ? 'bg-rose-500 text-white border-rose-700'
                            : 'bg-white hover:bg-amber-50 text-amber-950 border-amber-300 hover:border-amber-400 active:border-b-2 active:translate-y-1.5'
                        }`}
                      >
                        <span>{opt}</span>
                        {isCorrectSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-2 -right-2 bg-yellow-400 text-amber-950 p-1.5 rounded-full shadow-md"
                          >
                            <Check className="w-4 h-4 stroke-[4]" />
                          </motion.div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          ) : (
            /* --------------------------------------------------------------- */
            /* COMPLETION SCREEN WITH REPLAY                                   */
            /* --------------------------------------------------------------- */
            <motion.div
              key="completed_screen"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-10 shadow-2xl border-4 border-amber-300 flex flex-col items-center text-center gap-6"
            >
              {/* Trophy with Stars */}
              <div className="relative">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center shadow-lg border-4 border-white">
                  <Trophy className="w-14 h-14 text-amber-950 fill-amber-950" />
                </div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
                  className="absolute -inset-2 pointer-events-none"
                >
                  <Star className="w-6 h-6 text-yellow-400 fill-yellow-400 absolute top-0 left-0" />
                  <Sparkles className="w-6 h-6 text-amber-500 fill-amber-500 absolute bottom-0 right-0" />
                </motion.div>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-amber-950">
                  GREAT JOB!
                </h2>
                <p className="text-base sm:text-lg font-bold text-amber-800 mt-1">
                  You are an Addition Superstar!
                </p>
                <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-1">
                  You counted all the toys, treats, and candies!
                </p>
              </div>

              {/* Action Buttons */}
              <div className="w-full flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={handleReplay}
                  className="w-full py-4 px-6 rounded-3xl bg-[#F59E0B] hover:bg-amber-600 text-white font-black text-lg sm:text-xl shadow-xl border-b-8 border-[#D97706] active:border-b-2 active:translate-y-1.5 transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-6 h-6 stroke-[3]" />
                  <span>PLAY AGAIN (REPLAY)</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* --------------------------------------------------------------------- */}
      {/* BOTTOM NAVIGATION                                                     */}
      {/* --------------------------------------------------------------------- */}
      <ActivityBottomNav
        onNavigateHome={onNavigateHome}
        onNavigatePrev={onNavigatePrev}
        onNavigateNext={onNavigateNext}
        isNextUnlocked={isActivityCompleted || phase === 'completed'}
      />
    </div>
  );
};
