import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { RotateCcw, Volume2, Star as StarIcon } from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { ActivityBottomNav } from './ActivityBottomNav';

interface EmotionsFeelingsProps {
  onCollectStar: () => void;
  onNavigateHome?: () => void;
  onNavigateNext?: () => void;
  onNavigatePrev?: () => void;
  isActivityCompleted?: boolean;
}

interface Feeling {
  id: string;
  word: string;
  emoji: string;
  hint: string;
}

const FEELINGS: Feeling[] = [
  { id: 'happy', word: 'Happy', emoji: '😊', hint: 'I smile and laugh!' },
  { id: 'sad', word: 'Sad', emoji: '😢', hint: 'I feel like crying.' },
  { id: 'angry', word: 'Angry', emoji: '😠', hint: 'I feel mad!' },
  { id: 'scared', word: 'Scared', emoji: '😨', hint: 'I feel afraid.' },
  { id: 'sleepy', word: 'Sleepy', emoji: '😴', hint: 'I want to sleep.' },
  { id: 'excited', word: 'Excited', emoji: '🤩', hint: 'I feel super happy!' },
];

const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

export const EmotionsFeelings: React.FC<EmotionsFeelingsProps> = ({
  onCollectStar,
  onNavigateHome,
  onNavigateNext,
  onNavigatePrev,
  isActivityCompleted = false,
}) => {
  const [rounds] = useState(() => shuffle(FEELINGS));
  const [roundIndex, setRoundIndex] = useState(0);
  const [options, setOptions] = useState<Feeling[]>([]);
  const [wrongId, setWrongId] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [isAllFinished, setIsAllFinished] = useState(false);

  const current = rounds[roundIndex];

  // Build 4 options for the current round (correct + 3 random others)
  useEffect(() => {
    if (!current) return;
    const others = shuffle(FEELINGS.filter((f) => f.id !== current.id)).slice(0, 3);
    setOptions(shuffle([current, ...others]));
    setWrongId(null);
    soundManager.speak(`How do I feel? ${current.word}! ${current.hint}`);
  }, [roundIndex]);

  const handlePick = (feeling: Feeling) => {
    if (isAllFinished) return;
    if (feeling.id === current.id) {
      soundManager.playSuccess();
      soundManager.speak(`Yes! ${current.word}! ${current.hint}`);
      const nextCount = correctCount + 1;
      setCorrectCount(nextCount);
      setTimeout(() => {
        if (nextCount === FEELINGS.length) {
          onCollectStar();
          setIsAllFinished(true);
          soundManager.playCelebration();
          soundManager.speak('Amazing! You know all the feelings!');
        } else {
          setRoundIndex(roundIndex + 1);
        }
      }, 900);
    } else {
      soundManager.playError();
      soundManager.speak('Try again! Look at the faces!');
      setWrongId(feeling.id);
      setTimeout(() => setWrongId(null), 700);
    }
  };

  const handlePlayAgain = () => {
    soundManager.playPop();
    soundManager.speak("Let's play feelings again!");
    setRoundIndex(0);
    setCorrectCount(0);
    setWrongId(null);
    setIsAllFinished(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center p-2 sm:p-4">
      {/* Top Banner Header */}
      <div className="w-full bg-white/90 backdrop-blur-md border-4 border-yellow-300 rounded-3xl p-3 sm:p-4 shadow-lg mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-yellow-100 px-3 py-1.5 rounded-2xl border-2 border-yellow-300">
            <span className="text-xl">😊</span>
            <h1 className="text-base sm:text-xl font-black text-yellow-950 uppercase tracking-wide">
              Emotions &amp; Feelings
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-blue-100 text-blue-900 font-black text-xs sm:text-sm px-3 py-1.5 rounded-2xl border-2 border-blue-300 flex items-center gap-1">
            <span>
              Feelings: {correctCount} / {FEELINGS.length}
            </span>
          </div>
          <div className="bg-amber-400 text-amber-950 font-black text-xs sm:text-sm px-3 py-1.5 rounded-2xl border-2 border-amber-300 flex items-center gap-1 shadow-xs">
            <StarIcon className="w-4 h-4 fill-amber-100 stroke-amber-950" />
            <span>{correctCount === FEELINGS.length || isActivityCompleted ? 1 : 0}</span>
          </div>
        </div>
      </div>

      {/* Main Activity Card */}
      <div className="w-full bg-gradient-to-br from-yellow-100 via-amber-50 to-orange-100 border-4 border-yellow-400 rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col items-center relative overflow-hidden min-h-[420px] justify-between">
        <div className="text-center mt-1 mb-3">
          <div className="inline-flex items-center gap-2 bg-white px-6 py-2 rounded-full border-4 border-yellow-300 shadow-md mb-1">
            <button
              type="button"
              onClick={() => current && soundManager.speak(`How do I feel? ${current.word}! ${current.hint}`)}
              className="p-1 bg-yellow-100 hover:bg-yellow-200 rounded-full text-yellow-900 transition-transform active:scale-90 cursor-pointer"
            >
              <Volume2 className="w-5 h-5" />
            </button>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight uppercase">
              How do I feel?
            </h2>
          </div>
          <p className="text-xs sm:text-sm font-black text-slate-600 uppercase tracking-wide">
            Tap the face that matches the feeling!
          </p>
        </div>

        {!isAllFinished && current ? (
          <div className="w-full max-w-2xl flex flex-col items-center gap-4 my-auto">
            {/* Feeling word card */}
            <motion.div
              key={current.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl border-4 border-yellow-300 shadow-xl px-8 py-5 flex flex-col items-center gap-1"
            >
              <span className="text-sm font-black text-slate-500 uppercase tracking-widest">I feel...</span>
              <span className="text-4xl sm:text-5xl font-black text-slate-800 uppercase">{current.word}!</span>
              <span className="text-base font-bold text-slate-600">{current.hint}</span>
            </motion.div>

            {/* Face options */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 w-full">
              {options.map((feeling) => {
                const isWrong = wrongId === feeling.id;
                return (
                  <motion.button
                    key={feeling.id}
                    type="button"
                    onClick={() => handlePick(feeling)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.94 }}
                    className={`flex flex-col items-center gap-1 rounded-3xl border-4 p-4 sm:p-5 shadow-lg cursor-pointer ${
                      isWrong ? 'bg-rose-50 border-rose-400' : 'bg-white border-yellow-300 hover:bg-yellow-50'
                    }`}
                  >
                    <span className="text-6xl sm:text-7xl select-none drop-shadow-xs">{feeling.emoji}</span>
                    <span className="text-sm font-black text-slate-700">{feeling.word}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        ) : (
          /* Completion Screen */
          <div className="flex flex-col items-center justify-center text-center my-auto p-6 bg-white/90 backdrop-blur-md rounded-3xl border-4 border-yellow-400 shadow-xl max-w-lg">
            <div className="text-6xl mb-3 animate-bounce">🎉</div>
            <h3 className="text-2xl sm:text-3xl font-black text-yellow-950 uppercase mb-2">
              Feelings Complete!
            </h3>
            <div className="flex items-center gap-1.5 bg-amber-200 border-2 border-amber-400 px-4 py-1.5 rounded-full mb-3">
              <StarIcon className="w-5 h-5 fill-amber-400 text-amber-600" />
              <span className="font-black text-amber-950 text-sm">Star Earned!</span>
            </div>
            <p className="text-base font-bold text-slate-700 mb-5">
              You know all the feelings! Happy, sad, excited and more!
            </p>
            <button
              type="button"
              onClick={handlePlayAgain}
              className="flex items-center justify-center gap-2 bg-[#4D96FF] hover:bg-blue-500 text-white font-black py-3.5 px-8 rounded-2xl border-b-6 border-[#2563EB] shadow-lg active:border-b-2 active:translate-y-1 transition-all cursor-pointer text-base sm:text-lg uppercase"
            >
              <RotateCcw className="w-5 h-5 stroke-[3]" />
              <span>Play Again</span>
            </button>
          </div>
        )}
      </div>

      <ActivityBottomNav
        onNavigatePrev={onNavigatePrev}
        onNavigateHome={onNavigateHome}
        onNavigateNext={onNavigateNext}
        isNextUnlocked={isAllFinished || isActivityCompleted}
      />
    </div>
  );
};
