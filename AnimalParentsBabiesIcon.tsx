import React from 'react';
import { motion } from 'motion/react';

interface AnimalParentsBabiesIconProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const AnimalParentsBabiesIcon: React.FC<AnimalParentsBabiesIconProps> = ({
  size = 'md',
  className = '',
}) => {
  const isSmall = size === 'sm';
  const isLarge = size === 'lg';

  const containerW = isSmall ? 'w-14 h-12' : isLarge ? 'w-24 h-20' : 'w-20 h-16';

  return (
    <div className={`relative flex items-center justify-center select-none ${containerW} ${className}`}>
      {/* Parent Dog on Left */}
      <motion.div
        animate={{
          y: [0, -3, 0],
          rotate: [-4, 2, -4],
        }}
        transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -left-1 z-10 drop-shadow-md"
      >
        <span className={isSmall ? 'text-2xl' : isLarge ? 'text-4xl' : 'text-3xl'}>🐕</span>
      </motion.div>

      {/* Heart / Bond icon in center */}
      <motion.div
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        className="z-20 bg-white/95 border border-pink-300 rounded-full w-5 h-5 flex items-center justify-center shadow-xs"
      >
        <span className="text-[10px]">❤️</span>
      </motion.div>

      {/* Baby Puppy on Right */}
      <motion.div
        animate={{
          y: [0, 3, 0],
          rotate: [4, -2, 4],
        }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -right-1 z-10 drop-shadow-md"
      >
        <span className={isSmall ? 'text-2xl' : isLarge ? 'text-4xl' : 'text-3xl'}>🐶</span>
      </motion.div>
    </div>
  );
};
