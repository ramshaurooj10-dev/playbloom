import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, RotateCcw, Home, Award, Star, Heart } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface CompletionScreenProps {
  onPlayAgain: () => void;
  onGoHome: () => void;
  /** True only when the child has actually finished every playable activity.
      The "completed all activities" claim must never show otherwise (Wave 2):
      this screen is also reachable from the Level 6 "Star Certificate" card. */
  isComplete?: boolean;
  completedCount?: number;
  totalCount?: number;
}

interface LearningOutcome {
  icon: string;
  title: string;
  color: string;
  borderColor: string;
}

const LEARNING_OUTCOMES: LearningOutcome[] = [
  { icon: '🔤', title: 'Alphabet Recognition', color: 'bg-red-100 text-red-800', borderColor: 'border-red-300' },
  { icon: '🗣️', title: 'Letter & Word Recognition', color: 'bg-blue-100 text-blue-800', borderColor: 'border-blue-300' },
  { icon: '🎨', title: 'Color Recognition', color: 'bg-amber-100 text-amber-800', borderColor: 'border-amber-300' },
  { icon: '🔷', title: 'Shape Recognition', color: 'bg-sky-100 text-sky-800', borderColor: 'border-sky-300' },
  { icon: '🔢', title: 'Counting Skills (1–10)', color: 'bg-emerald-100 text-emerald-800', borderColor: 'border-emerald-300' },
  { icon: '🍎', title: 'Object Identification', color: 'bg-rose-100 text-rose-800', borderColor: 'border-rose-300' },
  { icon: '👀', title: 'Visual Observation Skills', color: 'bg-indigo-100 text-indigo-800', borderColor: 'border-indigo-300' },
  { icon: '🧩', title: 'Matching & Problem-Solving Skills', color: 'bg-purple-100 text-purple-800', borderColor: 'border-purple-300' },
  { icon: '🤲', title: 'Hand–Eye Coordination', color: 'bg-yellow-100 text-yellow-800', borderColor: 'border-yellow-300' },
  { icon: '🧠', title: 'Memory & Concentration', color: 'bg-teal-100 text-teal-800', borderColor: 'border-teal-300' },
  { icon: '💡', title: 'Logical Thinking', color: 'bg-orange-100 text-orange-800', borderColor: 'border-orange-300' },
  { icon: '✨', title: 'Attention to Detail', color: 'bg-fuchsia-100 text-fuchsia-800', borderColor: 'border-fuchsia-300' },
  { icon: '🎯', title: 'Fine Motor Skills', color: 'bg-lime-100 text-lime-800', borderColor: 'border-lime-300' },
  { icon: '🎵', title: 'Healthy Eating & Rhymes', color: 'bg-pink-100 text-pink-800', borderColor: 'border-pink-300' },
  { icon: '😊', title: 'Confidence Through Play', color: 'bg-amber-100 text-amber-800', borderColor: 'border-amber-300' },
  { icon: '🤝', title: 'Independent Learning', color: 'bg-cyan-100 text-cyan-800', borderColor: 'border-cyan-300' },
  { icon: '🎈', title: 'Fun-Based Learning Experience', color: 'bg-violet-100 text-violet-800', borderColor: 'border-violet-300' },

  // New outcome cards for Rhyme Time & Animal Food Match (appended after current outcomes)
  { icon: '🧠', title: 'Listening Skills', color: 'bg-indigo-100 text-indigo-900', borderColor: 'border-indigo-300' },
  { icon: '🍎', title: 'Healthy Eating Awareness', color: 'bg-emerald-100 text-emerald-900', borderColor: 'border-emerald-300' },
  { icon: '🐵', title: 'Animal Knowledge', color: 'bg-amber-100 text-amber-900', borderColor: 'border-amber-300' },
  { icon: '🧩', title: 'Memory & Recall', color: 'bg-purple-100 text-purple-900', borderColor: 'border-purple-300' },
  { icon: '🎯', title: 'Matching & Logical Thinking', color: 'bg-blue-100 text-blue-900', borderColor: 'border-blue-300' },
  { icon: '👀', title: 'Observation Skills', color: 'bg-cyan-100 text-cyan-900', borderColor: 'border-cyan-300' },
  { icon: '🗣️', title: 'Vocabulary Development', color: 'bg-rose-100 text-rose-900', borderColor: 'border-rose-300' },
  { icon: '💖', title: 'Healthy Lifestyle Habits', color: 'bg-pink-100 text-pink-900', borderColor: 'border-pink-300' },
];

export const CompletionScreen: React.FC<CompletionScreenProps> = ({
  onPlayAgain,
  onGoHome,
  isComplete = false,
  completedCount,
  totalCount,
}) => {
  const hasProgress = typeof completedCount === 'number' && typeof totalCount === 'number' && totalCount > 0;

  useEffect(() => {
    soundManager.playCelebration();
    soundManager.speak(
      isComplete
        ? 'Congratulations! You have successfully completed all PlayBloom activities!'
        : 'Great job! Keep playing to complete all PlayBloom activities!'
    );
  }, [isComplete]);

  const handlePlayAgainClick = () => {
    soundManager.playPop();
    soundManager.speak("Let's play again!");
    onPlayAgain();
  };

  const handleGoHomeClick = () => {
    soundManager.playPop();
    onGoHome();
  };

  return (
    <div id="completion-screen" className="w-full max-w-5xl mx-auto p-4 sm:p-6 text-center select-none relative overflow-hidden">
      {/* Confetti & Celebration Animations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: `${(i * 5) % 100}%`,
              y: -20,
              rotate: 0,
              scale: 0.8 + (i % 5) * 0.1,
            }}
            animate={{
              y: [0, 600],
              rotate: [0, 360 * (i % 2 === 0 ? 1 : -1)],
            }}
            transition={{
              duration: 3 + (i % 3),
              repeat: Infinity,
              delay: (i * 0.2) % 2,
              ease: 'linear',
            }}
            className="absolute text-xl sm:text-2xl"
          >
            {['🎉', '✨', '⭐', '🎈', '🎊', '🌸', '🏆'][i % 7]}
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, type: 'spring' }}
        className="relative bg-gradient-to-b from-[#E0F2FE] via-[#EDE9FE] to-[#DCFCE7] rounded-3xl border-8 border-indigo-200 shadow-2xl p-6 sm:p-10 z-20"
      >
        {/* Top Trophy & Sparkles Banner */}
        <div className="flex justify-center mb-4">
          <motion.div
            animate={{ rotate: [-8, 8, -8], scale: [1, 1.08, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className="relative bg-gradient-to-tr from-sky-400 via-indigo-500 to-purple-500 border-4 border-indigo-600 rounded-full p-5 shadow-lg"
          >
            <Award className="w-16 h-16 text-white" />
            <Sparkles className="w-8 h-8 text-yellow-300 absolute -top-2 -right-2 animate-bounce" />
            <Star className="w-7 h-7 text-amber-200 fill-yellow-300 absolute -bottom-1 -left-2 animate-pulse" />
          </motion.div>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-6xl font-black text-indigo-950 mb-2 tracking-tight drop-shadow-xs">
          {isComplete ? '🎉 Congratulations!' : '🌟 Star Certificate!'}
        </h1>

        {/* Message — the "completed all" claim only when actually complete */}
        <p className="text-lg sm:text-2xl font-bold text-indigo-800 mb-2 max-w-2xl mx-auto">
          {isComplete
            ? '"You have successfully completed all PlayBloom activities!"'
            : '"Keep playing and learning — you are doing great!"'}
        </p>

        {/* Honest progress (shown when not yet complete) */}
        {!isComplete && hasProgress && (
          <p className="text-base sm:text-lg font-black text-indigo-700 mb-8">
            You have completed {completedCount} of {totalCount} activities — keep going!
          </p>
        )}
        {isComplete && <div className="mb-6" />}

        {/* Learning Outcomes Header */}
        <div className="mb-6 flex items-center justify-center gap-2">
          <span className="text-2xl">🌟</span>
          <h2 className="text-2xl sm:text-3xl font-black text-indigo-950 uppercase tracking-wide">
            Key Learning Outcomes
          </h2>
          <span className="text-2xl">🌟</span>
        </div>

        {/* Learning Outcomes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-10 text-left">
          {LEARNING_OUTCOMES.map((outcome, idx) => (
            <motion.div
              key={outcome.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(idx * 0.025, 0.6) }}
              whileHover={{ scale: 1.03 }}
              className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 ${outcome.borderColor} ${outcome.color} shadow-sm transition-all`}
            >
              <span className="text-2xl sm:text-3xl shrink-0">{outcome.icon}</span>
              <span className="font-extrabold text-xs sm:text-sm leading-tight">
                {outcome.title}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <motion.button
            type="button"
            onClick={handlePlayAgainClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-black text-xl px-8 py-4 rounded-2xl border-b-6 border-green-800 shadow-xl cursor-pointer transition-all uppercase tracking-wide"
          >
            <RotateCcw className="w-6 h-6" />
            <span>Play Again</span>
          </motion.button>

          <motion.button
            type="button"
            onClick={handleGoHomeClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-black text-xl px-8 py-4 rounded-2xl border-b-6 border-blue-800 shadow-xl cursor-pointer transition-all uppercase tracking-wide"
          >
            <Home className="w-6 h-6" />
            <span>Back to Main Menu</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};
