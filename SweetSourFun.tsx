import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Volume2, Star, Sparkles, BookOpen, Play, Check, ChevronRight } from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { ActivityBottomNav } from './ActivityBottomNav';
import {
  FoodId,
  TasteType,
  FOOD_DATABASE,
  SOUR_FOOD_IDS,
  SWEET_FOOD_IDS,
  Food2DIllustration,
} from '../illustrations/Food2DIllustrations';

interface SweetSourFunProps {
  onCollectStar: () => void;
  onNavigateHome: () => void;
  onNavigateNext: () => void;
  onNavigatePrev: () => void;
  isActivityCompleted?: boolean;
}

// Particle interface for celebratory bursts
interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  shape: 'circle' | 'square' | 'star';
  rotation: number;
}

// Question types
export type QuestionType =
  | 'taste_check' // "Am I sweet or sour?" with 2 big choice buttons
  | 'choose_sour' // "Which one is sour?" with 3 food cards
  | 'choose_sweet'; // "Which one is sweet?" with 3 food cards

export interface QuizRound {
  id: string;
  type: QuestionType;
  voicePrompt: string;
  textPrompt: string;
  // For taste_check:
  targetFoodId?: FoodId;
  correctTaste?: TasteType;
  buttonOrder?: ('sweet' | 'sour')[]; // Shuffled position of SWEET/SOUR buttons
  // For choose_sour / choose_sweet:
  options?: FoodId[];
  correctFoodId?: FoodId;
}

// Curated Intro Foods List (8 diverse foods covering sweet & sour)
const INTRO_FOOD_LIST: FoodId[] = [
  'lemon',
  'strawberry',
  'tamarind',
  'mango',
  'kiwi',
  'banana',
  'pickle',
  'watermelon',
];

// Helper to shuffle an array (Fisher-Yates)
function shuffleArray<T>(array: readonly T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Generate genuinely fresh, randomized quiz rounds with anti-repetition
function generateQuizRounds(previousUsedFoods: FoodId[] = []): QuizRound[] {
  // Sort pool prioritizing foods that weren't used in the immediate previous game
  const freshSour = shuffleArray(
    SOUR_FOOD_IDS.filter((id) => !previousUsedFoods.includes(id))
  );
  const leftoverSour = shuffleArray(
    SOUR_FOOD_IDS.filter((id) => previousUsedFoods.includes(id))
  );
  const sourPool = [...freshSour, ...leftoverSour];

  const freshSweet = shuffleArray(
    SWEET_FOOD_IDS.filter((id) => !previousUsedFoods.includes(id))
  );
  const leftoverSweet = shuffleArray(
    SWEET_FOOD_IDS.filter((id) => previousUsedFoods.includes(id))
  );
  const sweetPool = [...freshSweet, ...leftoverSweet];

  const rounds: QuizRound[] = [];
  let lastUsedFood: FoodId | null = null;

  // Plan 6 rich rounds with balanced question types:
  // 2 taste_check (1 sour, 1 sweet)
  // 2 choose_sour
  // 2 choose_sweet
  const questionTypes: QuestionType[] = [
    'taste_check',
    'taste_check',
    'choose_sour',
    'choose_sour',
    'choose_sweet',
    'choose_sweet',
  ];

  const shuffledTypes = shuffleArray(questionTypes);

  let sourIdx = 0;
  let sweetIdx = 0;

  for (let i = 0; i < shuffledTypes.length; i++) {
    const qType = shuffledTypes[i];
    const roundId = `round_${Date.now()}_${i}_${Math.random().toString(36).substring(2, 6)}`;

    if (qType === 'taste_check') {
      // Alternate or random sour vs sweet
      const isSour = (i + Math.floor(Math.random() * 2)) % 2 === 0;
      let targetFood: FoodId;

      if (isSour) {
        targetFood = sourPool[sourIdx % sourPool.length];
        sourIdx++;
      } else {
        targetFood = sweetPool[sweetIdx % sweetPool.length];
        sweetIdx++;
      }

      // Avoid repeating consecutive food
      if (targetFood === lastUsedFood) {
        if (isSour) {
          targetFood = sourPool[sourIdx % sourPool.length];
          sourIdx++;
        } else {
          targetFood = sweetPool[sweetIdx % sweetPool.length];
          sweetIdx++;
        }
      }

      lastUsedFood = targetFood;
      const foodData = FOOD_DATABASE[targetFood];

      const prompts = [
        'Am I sweet or sour?',
        `Is ${foodData.name.toLowerCase()} sweet or sour?`,
        'How do I taste? Sweet or sour?',
      ];
      const prompt = prompts[Math.floor(Math.random() * prompts.length)];

      // Randomize button placement: left/right
      const buttonOrder: ('sweet' | 'sour')[] =
        Math.random() < 0.5 ? ['sweet', 'sour'] : ['sour', 'sweet'];

      rounds.push({
        id: roundId,
        type: 'taste_check',
        voicePrompt: prompt,
        textPrompt: prompt,
        targetFoodId: targetFood,
        correctTaste: foodData.taste,
        buttonOrder,
      });
    } else if (qType === 'choose_sour') {
      // 1 sour target + 2 sweet distractors
      let targetSour = sourPool[sourIdx % sourPool.length];
      sourIdx++;

      if (targetSour === lastUsedFood) {
        targetSour = sourPool[sourIdx % sourPool.length];
        sourIdx++;
      }
      lastUsedFood = targetSour;

      // Pick 2 sweet distractors
      const availableSweet = sweetPool.filter((s) => s !== lastUsedFood);
      const shuffledSweet = shuffleArray(availableSweet);
      const distractors = [shuffledSweet[0], shuffledSweet[1]];

      // Shuffle options positions so target isn't predictable
      const options = shuffleArray([targetSour, distractors[0], distractors[1]]);

      const voicePrompts = [
        'Which one is sour?',
        'Choose the sour one!',
        'Find the sour food!',
      ];
      const prompt = voicePrompts[Math.floor(Math.random() * voicePrompts.length)];

      rounds.push({
        id: roundId,
        type: 'choose_sour',
        voicePrompt: prompt,
        textPrompt: prompt,
        correctFoodId: targetSour,
        options,
      });
    } else {
      // choose_sweet: 1 sweet target + 2 sour distractors
      let targetSweet = sweetPool[sweetIdx % sweetPool.length];
      sweetIdx++;

      if (targetSweet === lastUsedFood) {
        targetSweet = sweetPool[sweetIdx % sweetPool.length];
        sweetIdx++;
      }
      lastUsedFood = targetSweet;

      // Pick 2 sour distractors
      const availableSour = sourPool.filter((s) => s !== lastUsedFood);
      const shuffledSour = shuffleArray(availableSour);
      const distractors = [shuffledSour[0], shuffledSour[1]];

      // Shuffle options positions
      const options = shuffleArray([targetSweet, distractors[0], distractors[1]]);

      const voicePrompts = [
        'Which one is sweet?',
        'Choose the sweet one!',
        'Find the sweet food!',
      ];
      const prompt = voicePrompts[Math.floor(Math.random() * voicePrompts.length)];

      rounds.push({
        id: roundId,
        type: 'choose_sweet',
        voicePrompt: prompt,
        textPrompt: prompt,
        correctFoodId: targetSweet,
        options,
      });
    }
  }

  return rounds;
}

export const SweetSourFun: React.FC<SweetSourFunProps> = ({
  onCollectStar,
  onNavigateHome,
  onNavigateNext,
  onNavigatePrev,
  isActivityCompleted,
}) => {
  // Activity Modes: 'intro' (Meet the foods) or 'quiz' (Interactive game) or 'complete'
  const [gameMode, setGameMode] = useState<'intro' | 'quiz' | 'complete'>('intro');

  // Intro State
  const [introIndex, setIntroIndex] = useState<number>(0);
  const [introShowTasteBadge, setIntroShowTasteBadge] = useState<boolean>(false);
  const [isIntroAutoPlaying, setIsIntroAutoPlaying] = useState<boolean>(true);

  // Quiz State
  const [rounds, setRounds] = useState<QuizRound[]>(() => generateQuizRounds());
  const [currentRoundIndex, setCurrentRoundIndex] = useState<number>(0);
  const [starsEarned, setStarsEarned] = useState<number>(0);
  const [shakeChoiceId, setShakeChoiceId] = useState<string | null>(null);
  const [isCorrectCelebration, setIsCorrectCelebration] = useState<boolean>(false);
  const [particles, setParticles] = useState<ConfettiPiece[]>([]);

  // Refs for tracking anti-repetition across replays and timing
  const isProcessingRef = useRef<boolean>(false);
  const introTimerRef = useRef<NodeJS.Timeout | null>(null);
  const introNextTimerRef = useRef<NodeJS.Timeout | null>(null);
  const speechTimerRef = useRef<NodeJS.Timeout | null>(null);
  const nextRoundTimerRef = useRef<NodeJS.Timeout | null>(null);
  const usedFoodsHistoryRef = useRef<FoodId[]>([]);

  const currentRound = rounds[currentRoundIndex];
  const currentIntroFoodId = INTRO_FOOD_LIST[introIndex];
  const currentIntroFood = FOOD_DATABASE[currentIntroFoodId];

  // Trigger celebration particles
  const triggerConfetti = (count: number = 28) => {
    const colors = ['#F59E0B', '#EC4899', '#10B981', '#38BDF8', '#8B5CF6', '#F43F5E', '#EAB308'];
    const shapes: ('circle' | 'square' | 'star')[] = ['circle', 'square', 'star'];
    const newParticles: ConfettiPiece[] = Array.from({ length: count }).map((_, i) => ({
      id: Date.now() + i,
      x: (Math.random() - 0.5) * 420,
      y: (Math.random() - 0.5) * 300 - 20,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 12 + 8,
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      rotation: Math.random() * 360,
    }));
    setParticles(newParticles);

    setTimeout(() => {
      setParticles([]);
    }, 1200);
  };

  // --- INTRO SEQUENCER (STRICT >= 4 SECONDS PER FOOD) ---
  const playIntroFood = useCallback(
    (index: number) => {
      if (introTimerRef.current) clearTimeout(introTimerRef.current);
      if (introNextTimerRef.current) clearTimeout(introNextTimerRef.current);
      if (speechTimerRef.current) clearTimeout(speechTimerRef.current);

      if (index >= INTRO_FOOD_LIST.length) {
        // Intro complete -> Transition to Quiz
        soundManager.speak("Now let's play!");
        setTimeout(() => {
          setGameMode('quiz');
          setCurrentRoundIndex(0);
          setStarsEarned(0);
          isProcessingRef.current = false;
        }, 1200);
        return;
      }

      setIntroIndex(index);
      setIntroShowTasteBadge(false);

      const foodId = INTRO_FOOD_LIST[index];
      const food = FOOD_DATABASE[foodId];

      // Part 1: Food appears -> Spoken greeting: "I am a [food]."
      soundManager.speak(food.introGreeting);

      // Part 2: After 1.6s -> Reveal taste badge & speak taste: "I am [sour/sweet]!"
      introTimerRef.current = setTimeout(() => {
        setIntroShowTasteBadge(true);
        soundManager.playPop();
        soundManager.speak(food.introTaste);

        // Part 3: Keep food on screen for AT LEAST 4.5+ SECONDS TOTAL
        // (1.6s initial + 3.0s observation = 4.6s total on screen)
        introNextTimerRef.current = setTimeout(() => {
          if (isIntroAutoPlaying) {
            playIntroFood(index + 1);
          }
        }, 3000);
      }, 1600);
    },
    [isIntroAutoPlaying]
  );

  // Start background music and trigger intro on mount
  useEffect(() => {
    soundManager.startBackgroundMusic();
    if (gameMode === 'intro') {
      playIntroFood(0);
    }
    return () => {
      if (introTimerRef.current) clearTimeout(introTimerRef.current);
      if (introNextTimerRef.current) clearTimeout(introNextTimerRef.current);
      if (speechTimerRef.current) clearTimeout(speechTimerRef.current);
      if (nextRoundTimerRef.current) clearTimeout(nextRoundTimerRef.current);
    };
  }, [gameMode]);

  // --- QUIZ QUESTION PROMPT (FAST & IMMEDIATE) ---
  useEffect(() => {
    if (gameMode !== 'quiz' || !currentRound) return;

    isProcessingRef.current = false;
    setIsCorrectCelebration(false);
    setShakeChoiceId(null);

    if (speechTimerRef.current) clearTimeout(speechTimerRef.current);
    speechTimerRef.current = setTimeout(() => {
      soundManager.speak(currentRound.voicePrompt);
    }, 200);

    return () => {
      if (speechTimerRef.current) clearTimeout(speechTimerRef.current);
    };
  }, [gameMode, currentRoundIndex]);

  // Skip Intro -> Jump to Quiz
  const handleStartQuizNow = () => {
    if (introTimerRef.current) clearTimeout(introTimerRef.current);
    if (introNextTimerRef.current) clearTimeout(introNextTimerRef.current);
    if (speechTimerRef.current) clearTimeout(speechTimerRef.current);
    soundManager.playPop();
    soundManager.speak("Now let's play!");
    setGameMode('quiz');
    setCurrentRoundIndex(0);
    setStarsEarned(0);
    isProcessingRef.current = false;
  };

  // Replay Game: Genuinely fresh options and anti-repetition
  const handleReplayGame = () => {
    if (speechTimerRef.current) clearTimeout(speechTimerRef.current);
    if (nextRoundTimerRef.current) clearTimeout(nextRoundTimerRef.current);

    soundManager.playPop();

    // Record previously used main foods for anti-repetition
    const currentRoundFoods: FoodId[] = rounds
      .map((r) => r.targetFoodId || r.correctFoodId)
      .filter((id): id is FoodId => Boolean(id));
    usedFoodsHistoryRef.current = currentRoundFoods;

    const freshRounds = generateQuizRounds(usedFoodsHistoryRef.current);

    setRounds(freshRounds);
    setCurrentRoundIndex(0);
    setStarsEarned(0);
    setShakeChoiceId(null);
    setIsCorrectCelebration(false);
    setParticles([]);
    isProcessingRef.current = false;
    setGameMode('quiz');
  };

  // Switch back to review foods intro
  const handleReviewFoods = () => {
    if (speechTimerRef.current) clearTimeout(speechTimerRef.current);
    if (nextRoundTimerRef.current) clearTimeout(nextRoundTimerRef.current);
    soundManager.playPop();
    setGameMode('intro');
    setIntroIndex(0);
    setIsIntroAutoPlaying(true);
    isProcessingRef.current = false;
  };

  // Step-by-step previous navigation handler
  const handleInternalPrev = () => {
    if (speechTimerRef.current) clearTimeout(speechTimerRef.current);
    if (nextRoundTimerRef.current) clearTimeout(nextRoundTimerRef.current);
    soundManager.playPop();

    if (gameMode === 'complete') {
      setGameMode('quiz');
      setCurrentRoundIndex(rounds.length - 1);
      setIsCorrectCelebration(false);
      isProcessingRef.current = false;
    } else if (gameMode === 'quiz') {
      if (currentRoundIndex > 0) {
        setCurrentRoundIndex((prev) => prev - 1);
        setIsCorrectCelebration(false);
        setShakeChoiceId(null);
        isProcessingRef.current = false;
      } else {
        // Step back from quiz start to the last intro food item
        setGameMode('intro');
        setIntroIndex(INTRO_FOOD_LIST.length - 1);
        setIsIntroAutoPlaying(false);
        isProcessingRef.current = false;
      }
    } else if (gameMode === 'intro') {
      if (introIndex > 0) {
        setIntroIndex((prev) => prev - 1);
        setIsIntroAutoPlaying(false);
      } else {
        // No earlier steps in this activity -> allow navigation to previous activity
        if (onNavigatePrev) {
          onNavigatePrev();
        }
      }
    }
  };

  // --- QUIZ ANSWER HANDLERS (STRICT FLOW: Pop -> "Great job!" -> Quick Next Question) ---

  // Handle Type A: Taste Check (Sweet vs Sour buttons)
  const handleSelectTaste = (selectedTaste: TasteType) => {
    if (isProcessingRef.current || !currentRound || currentRound.type !== 'taste_check') return;

    const isCorrect = selectedTaste === currentRound.correctTaste;

    if (isCorrect) {
      // 1. Lock immediately to prevent duplicate taps
      isProcessingRef.current = true;

      // 2. Play short success sound & pop
      soundManager.playPop();
      soundManager.playReinforcementMusic();
      setIsCorrectCelebration(true);
      setStarsEarned((prev) => prev + 1);

      // 3. Small success animation burst
      triggerConfetti(28);

      // 4. Say ONLY: "Great job!" (No extra explanation, no food repetition)
      soundManager.speak('Great job!');

      // 5. Smoothly & quickly move to the next question
      if (currentRoundIndex >= rounds.length - 1) {
        onCollectStar();
        nextRoundTimerRef.current = setTimeout(() => {
          setGameMode('complete');
          soundManager.playCelebration();
          soundManager.speak('Great job! You did it!');
        }, 900);
      } else {
        nextRoundTimerRef.current = setTimeout(() => {
          setCurrentRoundIndex((prev) => prev + 1);
        }, 850);
      }
    } else {
      // Wrong Answer: Gentle error sound + card wiggle + quick guidance
      soundManager.playError();
      setShakeChoiceId(selectedTaste);

      soundManager.speak('Try again!');

      setTimeout(() => {
        setShakeChoiceId(null);
      }, 500);
    }
  };

  // Handle Type B & C: Choose the food card (3 food cards)
  const handleSelectFoodCard = (foodId: FoodId) => {
    if (isProcessingRef.current || !currentRound || currentRound.type === 'taste_check') return;

    const isCorrect = foodId === currentRound.correctFoodId;

    if (isCorrect) {
      // 1. Lock immediately
      isProcessingRef.current = true;

      // 2. Short success sound & pop
      soundManager.playPop();
      soundManager.playReinforcementMusic();
      setIsCorrectCelebration(true);
      setStarsEarned((prev) => prev + 1);

      // 3. Small success particle burst
      triggerConfetti(28);

      // 4. Say ONLY: "Great job!" (No extra explanation, no food repetition)
      soundManager.speak('Great job!');

      // 5. Smoothly & quickly advance to next question
      if (currentRoundIndex >= rounds.length - 1) {
        onCollectStar();
        nextRoundTimerRef.current = setTimeout(() => {
          setGameMode('complete');
          soundManager.playCelebration();
          soundManager.speak('Great job! You did it!');
        }, 900);
      } else {
        nextRoundTimerRef.current = setTimeout(() => {
          setCurrentRoundIndex((prev) => prev + 1);
        }, 850);
      }
    } else {
      // Wrong choice
      soundManager.playError();
      setShakeChoiceId(foodId);

      soundManager.speak('Try again!');

      setTimeout(() => {
        setShakeChoiceId(null);
      }, 500);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-between p-2 sm:p-4 min-h-[640px]">
      {/* 1. Header Bar: Title, Mode Indicator & Progress */}
      <div className="w-full flex items-center justify-between bg-white/95 backdrop-blur-xs border-4 border-amber-300 rounded-3xl p-3 sm:p-4 shadow-lg mb-4">
        {/* Left: Mode Title */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-400 to-rose-400 rounded-2xl flex items-center justify-center text-2xl shadow-md border-2 border-white">
            🍋
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-amber-950 tracking-wide flex items-center gap-1.5">
              SWEET & SOUR FUN
            </h1>
            <p className="text-xs sm:text-sm font-bold text-amber-700">
              {gameMode === 'intro'
                ? 'Meet Sweet & Sour Foods'
                : gameMode === 'quiz'
                ? 'Taste Classification Quiz'
                : 'Activity Complete!'}
            </p>
          </div>
        </div>

        {/* Right: Progress Tracker / Controls */}
        <div className="flex items-center gap-2">
          {gameMode === 'intro' && (
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-black bg-amber-100 text-amber-900 border-2 border-amber-300 px-3 py-1.5 rounded-full shadow-xs">
                Food {introIndex + 1} / {INTRO_FOOD_LIST.length}
              </span>
              <button
                onClick={handleStartQuizNow}
                className="flex items-center gap-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black text-xs sm:text-sm px-3.5 py-2 rounded-2xl shadow-md border-2 border-white transition-all transform active:scale-95 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Play Quiz</span>
              </button>
            </div>
          )}

          {gameMode === 'quiz' && (
            <div className="flex items-center gap-2">
              {/* Question Progress 1/6 */}
              <div className="flex items-center gap-1 bg-amber-100 border-2 border-amber-300 px-3 py-1.5 rounded-2xl shadow-xs">
                <span className="text-xs sm:text-sm font-black text-amber-900">
                  {currentRoundIndex + 1} / {rounds.length}
                </span>
              </div>
              {/* Stars Earned */}
              <div className="flex items-center gap-1 bg-yellow-300 border-2 border-amber-400 px-2.5 py-1.5 rounded-2xl shadow-xs">
                <Star className="w-4 h-4 fill-amber-600 text-amber-700" />
                <span className="text-xs sm:text-sm font-black text-amber-950">{starsEarned}</span>
              </div>
              {/* Switch to Intro review button */}
              <button
                onClick={handleReviewFoods}
                title="Review Food Introduction"
                className="p-2 bg-sky-100 hover:bg-sky-200 border-2 border-sky-300 rounded-2xl text-sky-800 transition-colors shadow-xs cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
              </button>
            </div>
          )}

          {gameMode === 'complete' && (
            <button
              onClick={handleReplayGame}
              className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-500 border-2 border-amber-600 text-amber-950 font-black px-3.5 py-1.5 rounded-2xl shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="text-xs sm:text-sm">Replay</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Main Center Interactive Stage */}
      <div className="w-full relative flex-1 flex flex-col items-center justify-between">
        {/* Floating Celebration Confetti */}
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
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className="absolute pointer-events-none z-50 flex items-center justify-center top-1/2 left-1/2"
              style={{ width: p.size, height: p.size }}
            >
              {p.shape === 'star' ? (
                <Sparkles className="w-full h-full drop-shadow-md" style={{ color: p.color }} />
              ) : p.shape === 'circle' ? (
                <div className="w-full h-full rounded-full shadow-md" style={{ backgroundColor: p.color }} />
              ) : (
                <div className="w-full h-full rounded-xs shadow-md" style={{ backgroundColor: p.color }} />
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* ---------------------------------------------------- */}
        {/* MODE A: PART 1 — CALM FOOD INTRODUCTION STAGE */}
        {/* ---------------------------------------------------- */}
        {gameMode === 'intro' && (
          <motion.div
            key={`intro_${currentIntroFoodId}`}
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className={`w-full bg-gradient-to-b ${currentIntroFood.colorTheme.bg} border-4 ${currentIntroFood.colorTheme.border} rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col items-center justify-between min-h-[460px] relative overflow-hidden`}
          >
            {/* Top Prompt Banner */}
            <div className="w-full flex items-center justify-between">
              <div className="inline-flex items-center gap-2 bg-white/90 border-2 border-amber-300 px-4 py-1.5 rounded-full shadow-xs">
                <span className="text-xs sm:text-sm font-black text-amber-900">
                  FOOD {introIndex + 1} OF {INTRO_FOOD_LIST.length}
                </span>
              </div>

              {/* Speak again button */}
              <button
                onClick={() => {
                  soundManager.speak(`${currentIntroFood.introGreeting} ${currentIntroFood.introTaste}`);
                }}
                className="flex items-center gap-1.5 bg-white/90 hover:bg-white border-2 border-amber-300 px-3 py-1.5 rounded-2xl shadow-xs text-amber-900 font-bold text-xs sm:text-sm active:scale-95 transition-all cursor-pointer"
              >
                <Volume2 className="w-4 h-4 text-amber-600" />
                <span>Hear Again</span>
              </button>
            </div>

            {/* Hero Centered 2D Food Illustration with gentle floating animation */}
            <div className="my-3 flex flex-col items-center justify-center relative">
              {/* Soft background radial highlight halo */}
              <div className="absolute w-56 h-56 bg-white/70 rounded-full blur-xl pointer-events-none" />

              <motion.div
                animate={{
                  y: [0, -8, 0, 6, 0],
                  scale: [1, 1.02, 1, 0.99, 1],
                  rotate: [0, 1.5, 0, -1.5, 0],
                }}
                transition={{
                  duration: 3.8,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="z-10 relative cursor-pointer"
                onClick={() => {
                  soundManager.playPop();
                  soundManager.speak(currentIntroFood.introGreeting);
                }}
              >
                <Food2DIllustration foodId={currentIntroFoodId} size="xl" />
              </motion.div>

              {/* Food Name Headline */}
              <motion.h2
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl sm:text-4xl font-black text-slate-800 mt-2 tracking-tight drop-shadow-xs"
              >
                {currentIntroFood.name}
              </motion.h2>
            </div>

            {/* Dynamic Intro Badges & Speech Prompts */}
            <div className="flex flex-col items-center gap-2.5 z-10">
              {/* Speech bubble: "I am a [food]!" */}
              <div className="bg-white px-5 py-2 rounded-2xl border-2 border-slate-300 shadow-md">
                <p className="text-base sm:text-xl font-black text-slate-800 tracking-wide text-center">
                  "{currentIntroFood.introGreeting}"
                </p>
              </div>

              {/* Taste Reveal Badge */}
              <AnimatePresence>
                {introShowTasteBadge && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.4, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.4 }}
                    transition={{ type: 'spring', damping: 14, stiffness: 260 }}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl border-3 shadow-lg ${
                      currentIntroFood.taste === 'sour'
                        ? 'bg-gradient-to-r from-yellow-300 to-amber-400 border-yellow-500 text-yellow-950'
                        : 'bg-gradient-to-r from-rose-400 to-pink-500 border-rose-600 text-white'
                    }`}
                  >
                    <span className="text-2xl">
                      {currentIntroFood.taste === 'sour' ? '🍋' : '🍬'}
                    </span>
                    <span className="text-lg sm:text-2xl font-black tracking-wider uppercase">
                      {currentIntroFood.introTaste}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom Nav Controls in Intro */}
            <div className="w-full flex items-center justify-between mt-4 pt-2 border-t-2 border-amber-200/60 z-10">
              <button
                disabled={introIndex === 0}
                onClick={() => playIntroFood(introIndex - 1)}
                className={`px-4 py-2 rounded-2xl font-black text-sm border-2 transition-all cursor-pointer ${
                  introIndex === 0
                    ? 'opacity-40 border-slate-300 bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'border-amber-300 bg-white hover:bg-amber-50 text-amber-900 active:scale-95 shadow-xs'
                }`}
              >
                ◀ Previous
              </button>

              <div className="flex items-center gap-1.5">
                {INTRO_FOOD_LIST.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => playIntroFood(i)}
                    className={`w-3 h-3 rounded-full transition-all cursor-pointer ${
                      i === introIndex
                        ? 'bg-amber-500 scale-125 ring-2 ring-amber-300'
                        : i < introIndex
                        ? 'bg-emerald-400'
                        : 'bg-slate-300 hover:bg-slate-400'
                    }`}
                  />
                ))}
              </div>

              {introIndex < INTRO_FOOD_LIST.length - 1 ? (
                <button
                  onClick={() => playIntroFood(introIndex + 1)}
                  className="flex items-center gap-1 px-4 py-2 rounded-2xl font-black text-sm border-2 border-amber-400 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-500 hover:to-yellow-500 text-amber-950 active:scale-95 shadow-md cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleStartQuizNow}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-2xl font-black text-sm border-2 border-emerald-500 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white active:scale-95 shadow-md cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Start Quiz!</span>
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/* ---------------------------------------------------- */}
        {/* MODE B: PART 2 & 3 — QUIZ GAMEPLAY STAGE */}
        {/* ---------------------------------------------------- */}
        {gameMode === 'quiz' && currentRound && (
          <motion.div
            key={currentRound.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="w-full bg-gradient-to-b from-sky-50 via-white to-amber-50 border-4 border-amber-400 rounded-3xl p-4 sm:p-6 shadow-xl flex flex-col items-center justify-between min-h-[480px] relative overflow-hidden"
          >
            {/* Top Prompt Banner with Voice Button */}
            <div className="w-full flex items-center justify-center mb-2">
              <motion.div
                initial={{ scale: 0.96 }}
                animate={{ scale: 1 }}
                className="inline-flex items-center gap-2.5 bg-white border-3 border-amber-300 px-5 py-2.5 rounded-full shadow-md"
              >
                <button
                  onClick={() => soundManager.speak(currentRound.voicePrompt)}
                  className="p-1.5 bg-amber-100 hover:bg-amber-200 rounded-full text-amber-900 transition-transform active:scale-90 cursor-pointer"
                  title="Hear question again"
                >
                  <Volume2 className="w-5 h-5 text-amber-700" />
                </button>
                <h2 className="text-lg sm:text-2xl font-black text-slate-800 tracking-wide text-center">
                  {currentRound.textPrompt}
                </h2>
              </motion.div>
            </div>

            {/* --------------------------------------------- */}
            {/* QUIZ FORMAT 1: "Am I sweet or sour?" */}
            {/* --------------------------------------------- */}
            {currentRound.type === 'taste_check' && currentRound.targetFoodId && (
              <div className="w-full flex-1 flex flex-col items-center justify-between py-2">
                {/* Center Hero Food */}
                <div className="flex flex-col items-center justify-center my-2">
                  <motion.div
                    animate={
                      isCorrectCelebration
                        ? {
                            scale: [1, 1.2, 1.1],
                            y: [0, -14, -8],
                            rotate: [0, -6, 6, 0],
                          }
                        : {
                            y: [0, -6, 0, 4, 0],
                            rotate: [0, 1.2, 0, -1.2, 0],
                          }
                    }
                    transition={
                      isCorrectCelebration
                        ? { duration: 0.6, ease: 'easeOut' }
                        : { duration: 3.4, repeat: Infinity, ease: 'easeInOut' }
                    }
                    className="relative"
                  >
                    <Food2DIllustration
                      foodId={currentRound.targetFoodId}
                      size="xl"
                      isAnimated={false}
                    />

                    {/* Celebration Star Badge on Correct */}
                    {isCorrectCelebration && (
                      <motion.div
                        initial={{ scale: 0, rotate: -30 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="absolute -top-3 -right-3 bg-gradient-to-r from-amber-400 to-yellow-300 border-2 border-white rounded-full p-2 shadow-lg"
                      >
                        <Check className="w-6 h-6 text-amber-950 stroke-[3.5]" />
                      </motion.div>
                    )}
                  </motion.div>

                  <span className="text-2xl sm:text-3xl font-black text-slate-800 mt-2">
                    {FOOD_DATABASE[currentRound.targetFoodId].name}
                  </span>
                </div>

                {/* Bottom 2 Large Choice Buttons with Shuffled Left/Right Order */}
                <div className="w-full max-w-xl grid grid-cols-2 gap-4 sm:gap-6 mt-4">
                  {(currentRound.buttonOrder || ['sweet', 'sour']).map((tasteBtn) => {
                    const isSweet = tasteBtn === 'sweet';
                    const isSelectedAndShaking = shakeChoiceId === tasteBtn;
                    const isCorrectBtnCelebrated =
                      isCorrectCelebration && currentRound.correctTaste === tasteBtn;

                    if (isSweet) {
                      return (
                        <motion.button
                          key="btn_sweet"
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.95 }}
                          animate={
                            isSelectedAndShaking
                              ? { x: [-10, 10, -8, 8, 0] }
                              : isCorrectBtnCelebrated
                              ? { scale: [1, 1.08, 1.04] }
                              : {}
                          }
                          transition={{ duration: 0.35 }}
                          onClick={() => handleSelectTaste('sweet')}
                          className={`relative flex flex-col items-center justify-center p-4 sm:p-5 rounded-3xl border-4 shadow-xl transition-all cursor-pointer select-none ${
                            isCorrectBtnCelebrated
                              ? 'bg-gradient-to-br from-rose-400 to-pink-500 border-white text-white ring-4 ring-pink-300 scale-105'
                              : 'bg-gradient-to-br from-pink-50 via-rose-100 to-pink-200 hover:from-pink-100 hover:to-rose-200 border-rose-400 text-rose-950'
                          }`}
                        >
                          <span className="text-4xl sm:text-5xl mb-1 drop-shadow-sm">🍬</span>
                          <span className="text-xl sm:text-3xl font-black tracking-wider uppercase">
                            SWEET
                          </span>
                          <span className="text-xs sm:text-sm font-bold opacity-80 mt-0.5">
                            Like Strawberries & Honey
                          </span>
                        </motion.button>
                      );
                    }

                    return (
                      <motion.button
                        key="btn_sour"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.95 }}
                        animate={
                          isSelectedAndShaking
                            ? { x: [-10, 10, -8, 8, 0] }
                            : isCorrectBtnCelebrated
                            ? { scale: [1, 1.08, 1.04] }
                            : {}
                        }
                        transition={{ duration: 0.35 }}
                        onClick={() => handleSelectTaste('sour')}
                        className={`relative flex flex-col items-center justify-center p-4 sm:p-5 rounded-3xl border-4 shadow-xl transition-all cursor-pointer select-none ${
                          isCorrectBtnCelebrated
                            ? 'bg-gradient-to-br from-yellow-400 to-amber-500 border-white text-yellow-950 ring-4 ring-amber-300 scale-105'
                            : 'bg-gradient-to-br from-yellow-50 via-amber-100 to-yellow-200 hover:from-yellow-100 hover:to-amber-200 border-amber-400 text-amber-950'
                        }`}
                      >
                        <span className="text-4xl sm:text-5xl mb-1 drop-shadow-sm">🍋</span>
                        <span className="text-xl sm:text-3xl font-black tracking-wider uppercase">
                          SOUR
                        </span>
                        <span className="text-xs sm:text-sm font-bold opacity-80 mt-0.5">
                          Like Lemons & Limes
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ----------------------------------------------------------- */}
            {/* QUIZ FORMAT 2 & 3: "Choose the sour/sweet one!" (3 cards) */}
            {/* ----------------------------------------------------------- */}
            {currentRound.type !== 'taste_check' && currentRound.options && (
              <div className="w-full flex-1 flex flex-col items-center justify-center py-4">
                {/* 3 Food Choices Side-by-Side with Shuffled Positions */}
                <div className="w-full max-w-2xl grid grid-cols-3 gap-3 sm:gap-5 my-auto">
                  {currentRound.options.map((optFoodId) => {
                    const optFood = FOOD_DATABASE[optFoodId];
                    const isTargetCorrect = optFoodId === currentRound.correctFoodId;
                    const isThisShaking = shakeChoiceId === optFoodId;
                    const isCelebrated = isCorrectCelebration && isTargetCorrect;

                    return (
                      <motion.button
                        key={optFoodId}
                        whileHover={{ scale: 1.04, y: -4 }}
                        whileTap={{ scale: 0.96 }}
                        animate={
                          isThisShaking
                            ? { x: [-10, 10, -8, 8, 0] }
                            : isCelebrated
                            ? {
                                scale: [1, 1.14, 1.08],
                                y: [0, -10, -5],
                              }
                            : {}
                        }
                        transition={{ duration: 0.35 }}
                        onClick={() => handleSelectFoodCard(optFoodId)}
                        className={`relative flex flex-col items-center justify-between p-3 sm:p-5 rounded-3xl border-4 shadow-xl transition-all cursor-pointer select-none min-h-[180px] sm:min-h-[220px] ${
                          isCelebrated
                            ? 'bg-gradient-to-b from-amber-100 to-yellow-200 border-emerald-500 ring-4 ring-emerald-300 scale-105'
                            : `bg-gradient-to-b ${optFood.colorTheme.bg} ${optFood.colorTheme.border} hover:shadow-2xl`
                        }`}
                      >
                        {/* Food Illustration */}
                        <div className="my-auto">
                          <Food2DIllustration
                            foodId={optFoodId}
                            size="md"
                            isAnimated={!isCelebrated}
                          />
                        </div>

                        {/* Food Name Label */}
                        <span className="text-base sm:text-xl font-black text-slate-800 mt-2 text-center">
                          {optFood.name}
                        </span>

                        {/* Checked Badge on Success */}
                        {isCelebrated && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-2.5 -right-2.5 bg-emerald-500 border-2 border-white rounded-full p-1.5 shadow-md"
                          >
                            <Check className="w-5 h-5 text-white stroke-[3.5]" />
                          </motion.div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* ---------------------------------------------------- */}
        {/* MODE C: ACTIVITY COMPLETION CELEBRATION */}
        {/* ---------------------------------------------------- */}
        {gameMode === 'complete' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full bg-gradient-to-b from-amber-50 via-yellow-50 to-rose-50 border-4 border-amber-400 rounded-3xl p-6 sm:p-10 shadow-2xl flex flex-col items-center justify-center text-center min-h-[460px] relative overflow-hidden"
          >
            {/* Trophy & Stars Header */}
            <motion.div
              animate={{
                rotate: [0, -6, 6, 0],
                scale: [1, 1.08, 1],
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-6xl sm:text-7xl mb-3 drop-shadow-md"
            >
              🏆
            </motion.div>

            <h2 className="text-3xl sm:text-4xl font-black text-amber-950 mb-1">
              GREAT JOB! YOU DID IT!
            </h2>
            <p className="text-base sm:text-lg font-bold text-amber-800 mb-6 max-w-md">
              You know all the sweet and sour foods! Strawberry, mango, lemon, tamarind, kiwi, and more!
            </p>

            {/* Display a cute row of Sweet & Sour foods */}
            <div className="flex items-center justify-center gap-2 sm:gap-4 mb-6 bg-white/80 border-2 border-amber-300 rounded-3xl p-3 sm:p-4 shadow-md">
              <Food2DIllustration foodId="lemon" size="sm" />
              <Food2DIllustration foodId="strawberry" size="sm" />
              <Food2DIllustration foodId="mango" size="sm" />
              <Food2DIllustration foodId="tamarind" size="sm" />
              <Food2DIllustration foodId="kiwi" size="sm" />
              <Food2DIllustration foodId="watermelon" size="sm" />
            </div>

            {/* Replay & Review Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={handleReplayGame}
                className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-500 hover:to-yellow-500 text-amber-950 font-black text-base sm:text-lg px-6 py-3 rounded-2xl shadow-lg border-2 border-white transition-all transform active:scale-95 cursor-pointer"
              >
                <RotateCcw className="w-5 h-5" />
                <span>REPLAY</span>
              </button>

              <button
                onClick={handleReviewFoods}
                className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-800 font-black text-base sm:text-lg px-6 py-3 rounded-2xl shadow-md border-2 border-slate-300 transition-all transform active:scale-95 cursor-pointer"
              >
                <BookOpen className="w-5 h-5 text-amber-600" />
                <span>MEET FOODS AGAIN</span>
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* 3. Bottom Activity Navigation */}
      <div className="w-full flex justify-center mt-3">
        <ActivityBottomNav
          onNavigatePrev={handleInternalPrev}
          onNavigateHome={onNavigateHome}
          onNavigateNext={onNavigateNext}
          isNextUnlocked={gameMode === 'complete' || Boolean(isActivityCompleted)}
        />
      </div>
    </div>
  );
};
