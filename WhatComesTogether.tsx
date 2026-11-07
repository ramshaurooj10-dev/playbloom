import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, Volume2, Star, RotateCcw, Sparkles, Heart, CheckCircle2 } from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { ActivityBottomNav } from './ActivityBottomNav';
import {
  generateWhatComesTogetherRounds,
  GameRound,
  PairItem,
} from '../../data/whatComesTogetherData';

interface WhatComesTogetherProps {
  onCollectStar: () => void;
  onNavigateHome?: () => void;
  onNavigateNext?: () => void;
  onNavigatePrev?: () => void;
  isActivityCompleted?: boolean;
}

// Visual Floating Particle for celebration
interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  shape: 'circle' | 'square' | 'star';
  rotation: number;
}

export const WhatComesTogether: React.FC<WhatComesTogetherProps> = ({
  onCollectStar,
  onNavigateHome,
  onNavigateNext,
  onNavigatePrev,
  isActivityCompleted,
}) => {
  // Game state
  const [rounds, setRounds] = useState<GameRound[]>(() => generateWhatComesTogetherRounds());
  const [currentRoundIndex, setCurrentRoundIndex] = useState<number>(0);
  const [selectedChoice, setSelectedChoice] = useState<PairItem | null>(null);
  const [isMatched, setIsMatched] = useState<boolean>(false);
  const [wrongChoiceId, setWrongChoiceId] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [isGameComplete, setIsGameComplete] = useState<boolean>(false);
  const [previousPairIds, setPreviousPairIds] = useState<string[]>([]);
  const [particles, setParticles] = useState<ConfettiPiece[]>([]);

  // Audio timer ref to prevent overlapping speech
  const speechTimerRef = useRef<NodeJS.Timeout | null>(null);
  const nextRoundTimerRef = useRef<NodeJS.Timeout | null>(null);

  const currentRound = rounds[currentRoundIndex] || rounds[0];

  // Particle generator for match bursts
  const triggerConfetti = (count: number = 30) => {
    const colors = ['#38BDF8', '#F59E0B', '#10B981', '#EC4899', '#8B5CF6', '#F43F5E', '#FBBF24'];
    const shapes: ('circle' | 'square' | 'star')[] = ['circle', 'square', 'star'];
    const newParticles: ConfettiPiece[] = Array.from({ length: count }).map((_, i) => ({
      id: Date.now() + i,
      x: (Math.random() - 0.5) * 450,
      y: (Math.random() - 0.5) * 350 - 50,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 14 + 8,
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      rotation: Math.random() * 360,
    }));
    setParticles(newParticles);

    setTimeout(() => {
      setParticles([]);
    }, 1800);
  };

  // Play question voice prompt
  const speakCurrentQuestion = useCallback((isIntro: boolean = false) => {
    if (speechTimerRef.current) clearTimeout(speechTimerRef.current);

    speechTimerRef.current = setTimeout(() => {
      if (!currentRound) return;
      const questionText = currentRound.pair.promptQuestion;
      if (isIntro) {
        soundManager.speak(`What Comes Together! ${questionText}`);
      } else {
        soundManager.speak(questionText);
      }
    }, 250);
  }, [currentRound]);

  // Initial load speech
  useEffect(() => {
    speakCurrentQuestion(true);
    return () => {
      if (speechTimerRef.current) clearTimeout(speechTimerRef.current);
      if (nextRoundTimerRef.current) clearTimeout(nextRoundTimerRef.current);
    };
  }, []);

  // Whenever round changes (and not completed)
  useEffect(() => {
    if (!isGameComplete && currentRoundIndex > 0) {
      speakCurrentQuestion(false);
    }
  }, [currentRoundIndex, isGameComplete, speakCurrentQuestion]);

  // Handle choice selection
  const handleSelectChoice = (choice: PairItem) => {
    if (isLocked || isMatched || isGameComplete) return;

    const isCorrect = choice.id === currentRound.pair.correct.id;

    if (isCorrect) {
      // 1. Correct Answer
      setIsLocked(true);
      setSelectedChoice(choice);
      setIsMatched(true);
      setWrongChoiceId(null);

      // Play success chimes & pop
      soundManager.playPop();
      setTimeout(() => {
        soundManager.playSuccess();
      }, 100);

      // Trigger colorful particle burst
      triggerConfetti(35);

      // Voice feedback: immediate short confirmation + optional reason
      const shouldGiveReason = currentRoundIndex % 2 === 1 && currentRound.pair.whyVoice;
      const voiceText = shouldGiveReason
        ? `${currentRound.pair.successVoice} ${currentRound.pair.whyVoice}`
        : currentRound.pair.successVoice;

      setTimeout(() => {
        soundManager.speak(voiceText);
      }, 200);

      // Auto advance to next round
      nextRoundTimerRef.current = setTimeout(() => {
        if (currentRoundIndex + 1 < rounds.length) {
          setCurrentRoundIndex((prev) => prev + 1);
          setSelectedChoice(null);
          setIsMatched(false);
          setIsLocked(false);
        } else {
          // Game Completed!
          handleGameFinish();
        }
      }, shouldGiveReason ? 3200 : 2300);

    } else {
      // 2. Wrong Answer: Provide gentle feedback and allow retry
      soundManager.playError();
      setWrongChoiceId(choice.id);

      // Random gentle retry voice
      const wrongPhrases = [
        "Not that one. Look carefully, what goes with it?",
        "Try again! What belongs with it?",
        "Almost! Try another one.",
      ];
      const randomPhrase = wrongPhrases[Math.floor(Math.random() * wrongPhrases.length)];
      soundManager.speak(randomPhrase);

      // Clear shake state after animation
      setTimeout(() => {
        setWrongChoiceId(null);
      }, 700);
    }
  };

  // Handle entire 8-round game completion
  const handleGameFinish = () => {
    setIsGameComplete(true);
    setIsLocked(false);
    onCollectStar();

    // Fanfare sound
    soundManager.playCelebration();
    triggerConfetti(65);

    setTimeout(() => {
      soundManager.speak("Wow! Great job! You found everything that comes together!");
    }, 400);

    // Save current pair IDs for anti-repetition on next replay
    const completedIds = rounds.map((r) => r.pair.id);
    setPreviousPairIds(completedIds);
  };

  // Replay Game with completely randomized fresh set
  const handleReplay = () => {
    soundManager.playPop();
    const newRounds = generateWhatComesTogetherRounds(previousPairIds);
    setRounds(newRounds);
    setCurrentRoundIndex(0);
    setSelectedChoice(null);
    setIsMatched(false);
    setWrongChoiceId(null);
    setIsLocked(false);
    setIsGameComplete(false);

    setTimeout(() => {
      const firstQ = newRounds[0].pair.promptQuestion;
      soundManager.speak(`Let's play again! ${firstQ}`);
    }, 300);
  };

  // Step-by-step previous navigation handler
  const handleInternalPrev = () => {
    soundManager.playPop();
    if (isGameComplete) {
      setIsGameComplete(false);
      setCurrentRoundIndex(rounds.length - 1);
      setSelectedChoice(null);
      setIsMatched(false);
      setWrongChoiceId(null);
      setIsLocked(false);
    } else if (currentRoundIndex > 0) {
      setCurrentRoundIndex((prev) => prev - 1);
      setSelectedChoice(null);
      setIsMatched(false);
      setWrongChoiceId(null);
      setIsLocked(false);
    } else {
      if (onNavigatePrev) {
        onNavigatePrev();
      }
    }
  };

  // Re-read current question button
  const handleReplayVoice = () => {
    soundManager.playPop();
    speakCurrentQuestion(false);
  };

  return (
    <div
      id="what-comes-together-activity"
      className="w-full max-w-5xl mx-auto flex flex-col gap-3 sm:gap-4 pb-8 select-none"
    >
      {/* 1. Header Bar */}
      <div className="w-full bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 rounded-3xl p-3 sm:p-4 shadow-lg border-4 border-blue-700 text-white flex items-center justify-between gap-2 sm:gap-4">
        {/* Back to Home Button */}
        <button
          id="wct-home-btn"
          onClick={onNavigateHome}
          aria-label="Back to Home"
          className="bg-black/25 hover:bg-black/40 active:scale-95 text-white px-3 sm:px-4 py-2 rounded-2xl border-2 border-white/30 shadow-sm transition-transform flex items-center gap-1.5 font-black text-sm cursor-pointer shrink-0"
        >
          <Home className="w-5 h-5 text-amber-200" />
          <span className="hidden sm:inline">Home</span>
        </button>

        {/* Title and Voice Hear Button */}
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-2xl md:text-3xl font-black tracking-wider text-white uppercase drop-shadow-sm flex items-center gap-1.5 sm:gap-2">
              <span>🪥</span> WHAT COMES TOGETHER? <span>🥣</span>
            </h1>
            <button
              id="wct-voice-btn"
              onClick={handleReplayVoice}
              aria-label="Hear Question"
              className="bg-amber-300 hover:bg-amber-200 active:scale-90 text-amber-950 p-1.5 sm:p-2 rounded-xl border border-white shadow-sm transition-transform cursor-pointer"
              title="Hear question again"
            >
              <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-amber-950" />
            </button>
          </div>
          <p className="text-xs sm:text-sm font-bold text-sky-100 mt-0.5">
            {isGameComplete
              ? 'All Pairs Discovered!'
              : `Round ${currentRoundIndex + 1} of ${rounds.length}`}
          </p>
        </div>

        {/* Round Progress Stars */}
        <div className="bg-black/30 px-3 sm:px-4 py-1.5 rounded-2xl border border-white/30 text-white font-black text-xs sm:text-sm flex items-center gap-1.5 shrink-0">
          <Star className="w-4 h-4 text-amber-300 fill-amber-300" />
          <span>
            {currentRoundIndex + 1} / {rounds.length}
          </span>
        </div>
      </div>

      {/* 2. Main Game Viewport */}
      <div
        id="what-comes-together-stage"
        className="relative w-full min-h-[460px] sm:min-h-[520px] rounded-3xl overflow-hidden border-4 border-sky-400 shadow-2xl bg-gradient-to-b from-sky-50 via-blue-50/50 to-indigo-100 flex flex-col items-center justify-between p-4 sm:p-6 text-center select-none"
      >
        {/* Floating Confetti Layer */}
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 1, scale: 0, x: 0, y: 0, rotate: 0 }}
            animate={{
              opacity: [1, 1, 0],
              scale: [0, 1.2, 0.8],
              x: p.x,
              y: p.y + 120,
              rotate: p.rotation,
            }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="absolute z-40 pointer-events-none"
            style={{ left: '50%', top: '45%' }}
          >
            {p.shape === 'star' ? (
              <span style={{ color: p.color, fontSize: `${p.size + 4}px` }}>⭐</span>
            ) : (
              <div
                style={{
                  backgroundColor: p.color,
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  borderRadius: p.shape === 'circle' ? '50%' : '3px',
                }}
              />
            )}
          </motion.div>
        ))}

        <AnimatePresence mode="wait">
          {!isGameComplete ? (
            <motion.div
              key={`round-${currentRoundIndex}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full flex flex-col items-center justify-between flex-1 gap-4"
            >
              {/* TOP SECTION: PROMPT OBJECT */}
              <div className="w-full flex flex-col items-center gap-2">
                {/* Question Prompt Badge */}
                <div className="inline-flex items-center gap-2 bg-white/95 px-4 sm:px-6 py-1.5 sm:py-2 rounded-full border-2 border-sky-300 shadow-sm">
                  <span className="text-xs sm:text-sm md:text-base font-black text-sky-900 uppercase tracking-wide">
                    {currentRound.pair.promptQuestion}
                  </span>
                  <button
                    onClick={handleReplayVoice}
                    className="p-1 rounded-full hover:bg-sky-100 text-sky-600 transition-colors"
                    title="Repeat question"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                {/* The Main Target Object Card (Prominently Centered) */}
                <div className="relative flex items-center justify-center mt-1">
                  <motion.div
                    animate={
                      isMatched
                        ? { scale: [1, 1.1, 1], y: [0, -5, 0] }
                        : { y: [0, -4, 0] }
                    }
                    transition={
                      isMatched
                        ? { duration: 0.5 }
                        : { repeat: Infinity, duration: 3, ease: 'easeInOut' }
                    }
                    className={`relative bg-gradient-to-br ${currentRound.pair.prompt.color} p-4 sm:p-6 rounded-3xl border-4 ${
                      isMatched ? 'border-emerald-400 ring-4 ring-emerald-200' : currentRound.pair.prompt.borderColor
                    } shadow-xl flex flex-col items-center justify-center min-w-[150px] sm:min-w-[190px]`}
                  >
                    {/* Big Emoji */}
                    <span className="text-6xl sm:text-7xl md:text-8xl drop-shadow-md select-none transform transition-transform hover:scale-110">
                      {currentRound.pair.prompt.emoji}
                    </span>

                    {/* Label */}
                    <span className="mt-2 text-base sm:text-lg font-black text-slate-800 tracking-wide uppercase">
                      {currentRound.pair.prompt.name}
                    </span>

                    {/* Tag / Category hint */}
                    <span className="text-[11px] sm:text-xs font-bold text-slate-600 bg-white/80 px-2 py-0.5 rounded-full mt-1">
                      {currentRound.pair.prompt.tag}
                    </span>
                  </motion.div>

                  {/* CONNECTING BOND ANIMATION WHEN MATCHED */}
                  <AnimatePresence>
                    {isMatched && selectedChoice && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute -bottom-7 sm:-bottom-8 z-20 flex items-center gap-1.5 bg-emerald-500 text-white px-3 sm:px-4 py-1 rounded-full border-2 border-white shadow-lg font-black text-xs sm:text-sm animate-bounce"
                      >
                        <Heart className="w-4 h-4 fill-white" />
                        <span>GO TOGETHER!</span>
                        <Sparkles className="w-4 h-4 fill-amber-300 text-amber-300" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* BOTTOM SECTION: 4 BIG CHILD-FRIENDLY CHOICES */}
              <div className="w-full flex flex-col items-center gap-2 mt-2">
                <div className="text-xs sm:text-sm font-black text-slate-500 uppercase tracking-wider">
                  Tap the one that goes with it:
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 w-full max-w-3xl">
                  {currentRound.choices.map((choice, index) => {
                    const isSelected = selectedChoice?.id === choice.id;
                    const isCorrect = choice.id === currentRound.pair.correct.id;
                    const isWrong = wrongChoiceId === choice.id;

                    return (
                      <motion.button
                        key={`${choice.id}-${index}`}
                        id={`choice-btn-${index}`}
                        onClick={() => handleSelectChoice(choice)}
                        disabled={isLocked || isMatched}
                        animate={
                          isWrong
                            ? { x: [-10, 10, -8, 8, -4, 4, 0] }
                            : isMatched && isCorrect
                            ? { scale: [1, 1.08, 1.03], y: -8 }
                            : {}
                        }
                        transition={{ duration: 0.4 }}
                        whileHover={!isLocked && !isMatched ? { scale: 1.04, y: -3 } : {}}
                        whileTap={!isLocked && !isMatched ? { scale: 0.95 } : {}}
                        className={`relative rounded-3xl p-3 sm:p-5 flex flex-col items-center justify-center transition-all cursor-pointer select-none border-4 ${
                          isMatched && isCorrect
                            ? 'bg-emerald-100 border-emerald-500 shadow-emerald-300 shadow-xl ring-4 ring-emerald-300/60'
                            : isWrong
                            ? 'bg-rose-100 border-rose-400 shadow-rose-300 shadow-lg'
                            : `bg-gradient-to-b ${choice.color} ${choice.borderColor} shadow-lg hover:shadow-xl`
                        }`}
                      >
                        {/* Correct Checkmark Badge */}
                        {isMatched && isCorrect && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-3 -right-3 bg-emerald-500 text-white rounded-full p-1 border-2 border-white shadow-md"
                          >
                            <CheckCircle2 className="w-5 h-5" />
                          </motion.div>
                        )}

                        {/* Large Object Emoji */}
                        <span className="text-5xl sm:text-6xl md:text-7xl drop-shadow-sm mb-1 sm:mb-2">
                          {choice.emoji}
                        </span>

                        {/* Object Label */}
                        <span
                          className={`text-sm sm:text-base font-black tracking-wide ${
                            isMatched && isCorrect
                              ? 'text-emerald-900'
                              : isWrong
                              ? 'text-rose-900'
                              : 'text-slate-800'
                          }`}
                        >
                          {choice.name}
                        </span>

                        {/* Tag */}
                        <span className="text-[10px] sm:text-xs font-semibold text-slate-500 bg-white/70 px-2 py-0.5 rounded-full mt-1">
                          {choice.tag}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Progress Dots Bar */}
              <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-2">
                {rounds.map((_, idx) => (
                  <div
                    key={`dot-${idx}`}
                    className={`h-2.5 sm:h-3 rounded-full transition-all duration-300 ${
                      idx === currentRoundIndex
                        ? 'w-6 sm:w-8 bg-sky-500 shadow-sm'
                        : idx < currentRoundIndex
                        ? 'w-2.5 sm:w-3 bg-emerald-400'
                        : 'w-2.5 sm:w-3 bg-slate-300'
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          ) : (
            /* COMPLETION CELEBRATION SCREEN */
            <motion.div
              key="completion-screen"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, type: 'spring' }}
              className="w-full h-full flex flex-col items-center justify-center gap-4 sm:gap-6 py-6"
            >
              {/* Star Badge Icon */}
              <div className="relative">
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-br from-amber-300 to-yellow-500 border-6 border-white shadow-2xl flex items-center justify-center">
                  <Star className="w-16 h-16 sm:w-20 sm:h-20 text-white fill-white animate-spin-slow" />
                </div>
                <div className="absolute -top-2 -right-2 bg-pink-500 text-white p-2 rounded-full border-2 border-white shadow-lg animate-bounce">
                  <Sparkles className="w-6 h-6 fill-amber-200" />
                </div>
              </div>

              {/* Congratulations Title */}
              <div className="flex flex-col items-center">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-800 tracking-tight uppercase">
                  Awesome Job!
                </h2>
                <p className="text-base sm:text-lg font-bold text-sky-700 mt-1 max-w-md">
                  You discovered all 8 pairs that belong together!
                </p>
              </div>

              {/* Mini Showcase of Pairs Solved */}
              <div className="flex flex-wrap items-center justify-center gap-2 max-w-lg bg-white/80 p-3 rounded-2xl border-2 border-sky-200 shadow-sm">
                {rounds.map((r, i) => (
                  <span
                    key={`solved-${i}`}
                    className="inline-flex items-center gap-1 bg-sky-50 px-2.5 py-1 rounded-xl text-xs sm:text-sm font-black text-slate-700 border border-sky-200"
                  >
                    <span>{r.pair.prompt.emoji}</span>
                    <span>+</span>
                    <span>{r.pair.correct.emoji}</span>
                  </span>
                ))}
              </div>

              {/* Action Buttons: Replay & Next */}
              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-2">
                {/* Replay Button with fresh questions */}
                <button
                  id="wct-replay-btn"
                  onClick={handleReplay}
                  className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 active:scale-95 text-amber-950 px-6 sm:px-8 py-3 sm:py-3.5 rounded-2xl font-black text-base sm:text-lg shadow-lg border-2 border-white flex items-center gap-2 cursor-pointer transition-transform"
                >
                  <RotateCcw className="w-5 h-5 text-amber-950" />
                  <span>Play Again (New Pairs!)</span>
                </button>

                {/* Back to Home Button */}
                <button
                  id="wct-home-complete-btn"
                  onClick={onNavigateHome}
                  className="bg-sky-600 hover:bg-sky-500 active:scale-95 text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-2xl font-black text-base sm:text-lg shadow-lg border-2 border-sky-700 flex items-center gap-2 cursor-pointer transition-transform"
                >
                  <Home className="w-5 h-5 text-amber-300" />
                  <span>More Activities</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3. Bottom Activity Navigation */}
      <div className="w-full flex justify-center mt-2">
        <ActivityBottomNav
          onNavigatePrev={handleInternalPrev}
          onNavigateHome={onNavigateHome}
          onNavigateNext={onNavigateNext}
          isNextUnlocked={isGameComplete || Boolean(isActivityCompleted)}
        />
      </div>
    </div>
  );
};
