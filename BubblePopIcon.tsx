import React from 'react';

interface BubblePopIconProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const BubblePopIcon: React.FC<BubblePopIconProps> = ({ size = 'md', className = '' }) => {
  // Scaling configuration
  const sizeMap = {
    xs: {
      container: 'gap-0.5 py-0.5',
      b1: 'w-4 h-4',
      b2: 'w-5 h-5',
      b3: 'w-3.5 h-3.5',
      spark: 'text-[8px] -top-1 -right-1',
    },
    sm: {
      container: 'gap-1 py-0.5',
      b1: 'w-5 h-5',
      b2: 'w-6 h-6',
      b3: 'w-4 h-4',
      spark: 'text-[10px] -top-1.5 -right-1.5',
    },
    md: {
      container: 'gap-1.5 py-1',
      b1: 'w-7 h-7',
      b2: 'w-9 h-9',
      b3: 'w-6 h-6',
      spark: 'text-sm -top-2 -right-2',
    },
    lg: {
      container: 'gap-2 py-1.5',
      b1: 'w-10 h-10',
      b2: 'w-12 h-12',
      b3: 'w-8 h-8',
      spark: 'text-lg -top-2.5 -right-2.5',
    },
    xl: {
      container: 'gap-3 py-2',
      b1: 'w-14 h-14',
      b2: 'w-18 h-18',
      b3: 'w-12 h-12',
      spark: 'text-2xl -top-3 -right-3',
    },
  };

  const current = sizeMap[size] || sizeMap.md;

  return (
    <div
      className={`inline-flex items-center justify-center select-none ${current.container} ${className}`}
      aria-label="Bubble Pop Icon"
    >
      {/* Pink Soft Round Glossy Bubble */}
      <div
        className={`${current.b1} rounded-full bg-gradient-to-tr from-pink-400 via-pink-300 to-pink-200 border-2 border-white shadow-md relative flex items-center justify-center shrink-0`}
      >
        <div className="absolute top-1 left-1.5 w-1/3 h-1/3 rounded-full bg-white/90 blur-[0.3px]" />
      </div>

      {/* Sky Blue Soft Round Glossy Bubble with Pop Burst Effect */}
      <div
        className={`${current.b2} rounded-full bg-gradient-to-tr from-sky-400 via-sky-300 to-sky-200 border-2 border-white shadow-md relative flex items-center justify-center shrink-0`}
      >
        <div className="absolute top-1 left-2 w-1/3 h-1/3 rounded-full bg-white/90 blur-[0.3px]" />
        <span className={`absolute ${current.spark} leading-none drop-shadow-xs select-none`}>
          💥
        </span>
      </div>

      {/* Yellow Soft Round Glossy Bubble */}
      <div
        className={`${current.b3} rounded-full bg-gradient-to-tr from-amber-300 via-yellow-300 to-yellow-100 border-2 border-white shadow-md relative flex items-center justify-center shrink-0`}
      >
        <div className="absolute top-0.5 left-1 w-1/3 h-1/3 rounded-full bg-white/90 blur-[0.3px]" />
      </div>
    </div>
  );
};
