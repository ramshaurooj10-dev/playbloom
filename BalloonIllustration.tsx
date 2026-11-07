import React from 'react';
import { motion } from 'motion/react';

export type BalloonColor = 'red' | 'blue' | 'yellow' | 'green' | 'purple' | 'pink' | 'orange' | 'cyan';

export interface BalloonStyleConfig {
  name: string;
  gradientStart: string;
  gradientMid: string;
  gradientEnd: string;
  knotColor: string;
  stringColor: string;
  glowColor: string;
  strokeColor: string;
}

export const BALLOON_COLOR_CONFIGS: Record<BalloonColor, BalloonStyleConfig> = {
  red: {
    name: 'Red',
    gradientStart: '#FF7675',
    gradientMid: '#E84118',
    gradientEnd: '#C23616',
    knotColor: '#B32400',
    stringColor: '#7F8C8D',
    glowColor: 'rgba(232, 65, 24, 0.35)',
    strokeColor: '#B32400',
  },
  blue: {
    name: 'Blue',
    gradientStart: '#74B9FF',
    gradientMid: '#0984E3',
    gradientEnd: '#0652DD',
    knotColor: '#003DA5',
    stringColor: '#7F8C8D',
    glowColor: 'rgba(9, 132, 227, 0.35)',
    strokeColor: '#003DA5',
  },
  yellow: {
    name: 'Yellow',
    gradientStart: '#FFEAA7',
    gradientMid: '#FDCB6E',
    gradientEnd: '#F39C12',
    knotColor: '#D35400',
    stringColor: '#7F8C8D',
    glowColor: 'rgba(253, 203, 110, 0.4)',
    strokeColor: '#D35400',
  },
  green: {
    name: 'Green',
    gradientStart: '#55EFC4',
    gradientMid: '#00B894',
    gradientEnd: '#009432',
    knotColor: '#006266',
    stringColor: '#7F8C8D',
    glowColor: 'rgba(0, 184, 148, 0.35)',
    strokeColor: '#006266',
  },
  purple: {
    name: 'Purple',
    gradientStart: '#A29BFE',
    gradientMid: '#6C5CE7',
    gradientEnd: '#4834D4',
    knotColor: '#30336B',
    stringColor: '#7F8C8D',
    glowColor: 'rgba(108, 92, 231, 0.35)',
    strokeColor: '#30336B',
  },
  pink: {
    name: 'Pink',
    gradientStart: '#FD79A8',
    gradientMid: '#E84393',
    gradientEnd: '#D980FA',
    knotColor: '#B53471',
    stringColor: '#7F8C8D',
    glowColor: 'rgba(232, 67, 147, 0.35)',
    strokeColor: '#B53471',
  },
  orange: {
    name: 'Orange',
    gradientStart: '#FAB1A0',
    gradientMid: '#FF7675',
    gradientEnd: '#E67E22',
    knotColor: '#D35400',
    stringColor: '#7F8C8D',
    glowColor: 'rgba(230, 126, 34, 0.35)',
    strokeColor: '#D35400',
  },
  cyan: {
    name: 'Cyan',
    gradientStart: '#81ECEC',
    gradientMid: '#00CEC9',
    gradientEnd: '#0984E3',
    knotColor: '#0097E6',
    stringColor: '#7F8C8D',
    glowColor: 'rgba(0, 206, 201, 0.35)',
    strokeColor: '#0097E6',
  },
};

interface BalloonIllustrationProps {
  color?: BalloonColor;
  width?: number;
  height?: number;
  isTapped?: boolean;
  onTap?: () => void;
  className?: string;
  showString?: boolean;
  animated?: boolean;
}

export const BalloonIllustration: React.FC<BalloonIllustrationProps> = ({
  color = 'red',
  width = 90,
  height = 135,
  isTapped = false,
  onTap,
  className = '',
  showString = true,
  animated = false,
}) => {
  const config = BALLOON_COLOR_CONFIGS[color] || BALLOON_COLOR_CONFIGS.red;
  const gradientId = `balloon-grad-${color}-${Math.random().toString(36).substr(2, 6)}`;

  return (
    <motion.div
      onClick={onTap}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.94 }}
      animate={
        isTapped
          ? { scale: [1, 1.18, 1], y: [0, -8, 0] }
          : animated
          ? { y: [0, -6, 0] }
          : {}
      }
      transition={
        isTapped
          ? { duration: 0.35, ease: 'easeOut' }
          : animated
          ? { duration: 3, repeat: Infinity, ease: 'easeInOut' }
          : { duration: 0.2 }
      }
      className={`inline-block select-none cursor-pointer ${className}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        filter: `drop-shadow(0 6px 12px ${config.glowColor})`,
      }}
    >
      <svg
        viewBox="0 0 100 150"
        width="100%"
        height="100%"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
      >
        <defs>
          {/* Radial 3D shading for rich voluminous balloon look */}
          <radialGradient
            id={gradientId}
            cx="38%"
            cy="35%"
            r="65%"
            fx="32%"
            fy="28%"
          >
            <stop offset="0%" stopColor={config.gradientStart} />
            <stop offset="55%" stopColor={config.gradientMid} />
            <stop offset="100%" stopColor={config.gradientEnd} />
          </radialGradient>
        </defs>

        {/* Dangling Balloon String */}
        {showString && (
          <path
            d="M 50 100 Q 58 114 44 126 T 52 148"
            stroke={config.stringColor}
            strokeWidth="2.4"
            strokeLinecap="round"
            fill="none"
            opacity="0.85"
          />
        )}

        {/* Balloon Knot / Tie */}
        <path
          d="M 44 96 L 56 96 L 52 103 L 48 103 Z"
          fill={config.knotColor}
          stroke={config.strokeColor}
          strokeWidth="0.8"
        />

        {/* Main Egg/Teardrop Balloon Body */}
        <path
          d="M 50 8 C 24 8 10 32 10 58 C 10 82 32 96 46 98 L 54 98 C 68 96 90 82 90 58 C 90 32 76 8 50 8 Z"
          fill={`url(#${gradientId})`}
          stroke="rgba(255, 255, 255, 0.4)"
          strokeWidth="1.2"
        />

        {/* Glossy Upper-Left Reflection Curve */}
        <path
          d="M 32 20 C 22 30 20 46 24 58 C 22 46 26 30 38 22 C 41 19 36 17 32 20 Z"
          fill="white"
          opacity="0.75"
        />

        {/* Small Specular Highlight Dot */}
        <ellipse
          cx="33"
          cy="22"
          rx="4.5"
          ry="3"
          transform="rotate(-25 33 22)"
          fill="white"
          opacity="0.9"
        />

        {/* Subtle Right Rim Shimmer */}
        <path
          d="M 76 34 C 82 46 82 62 76 74 C 77 62 76 48 72 38 C 73 35 75 33 76 34 Z"
          fill="white"
          opacity="0.25"
        />
      </svg>
    </motion.div>
  );
};
