import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Volume2, Sparkles, Heart } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface WelcomeScreenProps {
  onStart: () => void;
  userAccount?: any;
  onContinueWithGoogle?: () => Promise<void>;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onStart,
}) => {
  // Play warm child voice welcome message when Welcome Screen opens
  useEffect(() => {
    soundManager.speak("Welcome to PlayBloom! Let's Learn Through Play!");
  }, []);

  const handleHearWelcome = () => {
    soundManager.playPop();
    soundManager.speak("Welcome to PlayBloom! Let's Learn Through Play!");
  };

  const handleStart = () => {
    soundManager.playPop();
    soundManager.speak("Let's play!");
    onStart();
  };

  return (
    <div id="welcome-screen" className="w-full max-w-4xl mx-auto p-4 sm:p-6 text-center select-none">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, type: 'spring', stiffness: 120 }}
        className="relative bg-gradient-to-b from-[#BAE6FD] via-[#E0F2FE] to-[#FEF08A] rounded-3xl border-8 border-white shadow-2xl p-6 sm:p-12 overflow-hidden flex flex-col items-center justify-center min-h-[520px]"
      >
        {/* Floating background decorative items */}
        <motion.div
          animate={{ y: [-10, 10, -10], rotate: [-5, 5, -5] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-6 left-8 text-4xl sm:text-5xl opacity-80 pointer-events-none"
        >
          🎈
        </motion.div>
        <motion.div
          animate={{ y: [-8, 8, -8] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-10 left-10 text-4xl sm:text-5xl opacity-80 pointer-events-none"
        >
          🎨
        </motion.div>
        <motion.div
          animate={{ y: [8, -8, 8] }}
          transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-8 right-12 text-4xl sm:text-5xl opacity-80 pointer-events-none"
        >
          🧩
        </motion.div>

        {/* Playroom Logo Badge */}
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="inline-flex items-center gap-3 bg-white/90 backdrop-blur-sm border-4 border-amber-300 rounded-full px-6 py-2 shadow-md mb-6"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-300 to-yellow-400 border-2 border-amber-500 flex items-center justify-center text-2xl shadow-inner">
            🧸
          </div>
          <span className="text-3xl sm:text-4xl font-black text-[#1D4ED8] tracking-wider uppercase drop-shadow-xs">
            PLAYBLOOM
          </span>
          <Sparkles className="w-6 h-6 text-amber-500 animate-spin" />
        </motion.div>

        {/* Welcome Headlines */}
        <motion.h1
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="text-4xl sm:text-6xl font-black text-[#1E3A8A] mb-3 tracking-tight drop-shadow-sm"
        >
          Welcome to PlayBloom!
        </motion.h1>

        <p className="text-xl sm:text-2xl font-bold text-[#0284C7] mb-6 max-w-lg">
          Let's Learn Through Play! 🌟
        </p>

        {/* Direct Big Play/Start Button */}
        <div className="flex flex-col items-center gap-3">
          <motion.button
            type="button"
            onClick={handleStart}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            animate={{
              scale: [1, 1.04, 1],
              transition: { repeat: Infinity, duration: 2, ease: 'easeInOut' },
            }}
            className="group relative inline-flex items-center gap-4 bg-gradient-to-r from-[#22C55E] to-[#16A34A] hover:from-[#16A34A] hover:to-[#15803D] text-white font-black text-2xl sm:text-3xl px-10 sm:px-14 py-5 sm:py-6 rounded-3xl border-b-8 border-[#15803D] shadow-2xl active:border-b-2 active:translate-y-2 cursor-pointer transition-all uppercase tracking-wider"
          >
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Play className="w-8 h-8 fill-white text-white translate-x-0.5" />
            </div>
            <span>Start</span>
          </motion.button>
        </div>

        {/* Speaker Replay Button */}
        <button
          type="button"
          onClick={handleHearWelcome}
          className="mt-6 inline-flex items-center gap-2 bg-white/80 hover:bg-white text-blue-900 font-bold px-4 py-2 rounded-2xl border-2 border-blue-200 shadow-sm text-sm cursor-pointer transition-all"
        >
          <Volume2 className="w-4 h-4 text-blue-600" />
          <span>Listen Again</span>
        </button>

        {/* Bottom decorative banner */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs font-black text-blue-800/80 uppercase tracking-widest">
          <span className="flex items-center gap-1">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> Made for Kids
          </span>
          <span className="hidden sm:inline">•</span>
          <span>Ages 3–6</span>
          <span className="hidden sm:inline">•</span>
          <span>Developed by Ramsha Shaikh</span>
        </div>
      </motion.div>
    </div>
  );
};
