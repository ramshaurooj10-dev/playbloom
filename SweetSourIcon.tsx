import React from 'react';
import { motion } from 'motion/react';

interface SweetSourIconProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const SweetSourIcon: React.FC<SweetSourIconProps> = ({ size = 'md', className = '' }) => {
  const isSmall = size === 'sm';
  const isLarge = size === 'lg';

  const containerW = isSmall ? 'w-14 h-12' : isLarge ? 'w-24 h-20' : 'w-20 h-16';

  return (
    <div className={`relative flex items-center justify-center select-none ${containerW} ${className}`}>
      {/* Sour Lemon on Left */}
      <motion.div
        animate={{
          y: [0, -3, 0],
          rotate: [-6, -2, -6],
        }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -left-1 z-10 drop-shadow-md"
      >
        <span className={isSmall ? 'text-2xl' : isLarge ? 'text-5xl' : 'text-4xl'}>🍋</span>
      </motion.div>

      {/* Sparkle divider in center */}
      <div className="z-20 bg-white/90 border border-amber-300 rounded-full px-1.5 py-0.5 shadow-xs">
        <span className="text-[10px] sm:text-xs font-black text-amber-900 tracking-tighter">VS</span>
      </div>

      {/* Sweet Strawberry on Right */}
      <motion.div
        animate={{
          y: [0, 3, 0],
          rotate: [6, 2, 6],
        }}
        transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -right-1 z-10 drop-shadow-md"
      >
        <span className={isSmall ? 'text-2xl' : isLarge ? 'text-5xl' : 'text-4xl'}>🍓</span>
      </motion.div>
    </div>
  );
};
