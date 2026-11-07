import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  RotateCcw,
  Volume2,
  Check,
  Star,
  Sparkles,
  Shuffle,
  Trophy,
  Palette,
  ArrowRight,
} from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { ActivityBottomNav } from './ActivityBottomNav';

// ============================================================================
// COLOR DEFINITIONS
// ============================================================================

export type ColorId = 'red' | 'yellow' | 'blue' | 'green' | 'orange' | 'purple';

export interface ColorSwatchDef {
  id: ColorId;
  name: string;
  hex: string;
  borderHex: string;
  bgHex: string;
  isPrimary: boolean;
  textColor: string;
}

export const COLOR_SWATCHES: Record<ColorId, ColorSwatchDef> = {
  red: {
    id: 'red',
    name: 'RED',
    hex: '#EF4444',
    borderHex: '#991B1B',
    bgHex: '#FEE2E2',
    isPrimary: true,
    textColor: '#991B1B',
  },
  yellow: {
    id: 'yellow',
    name: 'YELLOW',
    hex: '#FACC15',
    borderHex: '#854D0E',
    bgHex: '#FEF9C3',
    isPrimary: true,
    textColor: '#854D0E',
  },
  blue: {
    id: 'blue',
    name: 'BLUE',
    hex: '#3B82F6',
    borderHex: '#1E3A8A',
    bgHex: '#DBEAFE',
    isPrimary: true,
    textColor: '#1E40AF',
  },
  green: {
    id: 'green',
    name: 'GREEN',
    hex: '#22C55E',
    borderHex: '#14532D',
    bgHex: '#DCFCE7',
    isPrimary: false,
    textColor: '#166534',
  },
  orange: {
    id: 'orange',
    name: 'ORANGE',
    hex: '#F97316',
    borderHex: '#7C2D12',
    bgHex: '#FFEDD5',
    isPrimary: false,
    textColor: '#9A3412',
  },
  purple: {
    id: 'purple',
    name: 'PURPLE',
    hex: '#A855F7',
    borderHex: '#581C87',
    bgHex: '#F3E8FF',
    isPrimary: false,
    textColor: '#6B21A8',
  },
};

export const PRIMARY_COLORS: ColorId[] = ['red', 'yellow', 'blue'];
export const ALL_SIX_COLORS: ColorId[] = [
  'red',
  'yellow',
  'blue',
  'green',
  'orange',
  'purple',
];

// ============================================================================
// CHARACTER TYPES & GUIDED STEP STRUCTURE
// ============================================================================

export type CharacterType = 'snowman' | 'butterfly' | 'bunny';

export interface GuidedStep {
  partKey: string;
  partName: string;
  targetColor: ColorId;
  instruction: string;
  hintWrongColor: string;
  hintWrongPart: string;
}

export interface CharacterColorState {
  [partKey: string]: string; // hex color or default fill
}

// Sparkle Particle Effect on Color Fill
export interface ColorSparkleFX {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  opacity: number;
}

interface ColorFunProps {
  onCollectStar?: () => void;
  onNavigateHome: () => void;
  onNavigateNext?: () => void;
  onNavigatePrev?: () => void;
  isActivityCompleted?: boolean;
}

// Helper: Fisher-Yates shuffle array clone
function shuffleArray<T>(arr: T[]): T[] {
  const cloned = [...arr];
  for (let i = cloned.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cloned[i], cloned[j]] = [cloned[j], cloned[i]];
  }
  return cloned;
}

// ============================================================================
// 1. SNOWMAN WORKSHEET ILLUSTRATION
// ============================================================================

const SnowmanWorksheet: React.FC<{
  colors: CharacterColorState;
  onPartTap: (partKey: string, e: React.MouseEvent | React.TouchEvent) => void;
  activeTargetPart?: string;
  isGuided: boolean;
}> = ({ colors, onPartTap, activeTargetPart, isGuided }) => {
  const defaultWhite = '#FFFFFF';
  const strokeColor = '#1E293B';
  const strokeW = 4.5;

  const isTarget = (k: string) => isGuided && activeTargetPart === k;

  return (
    <div className="relative w-full max-w-[340px] sm:max-w-[400px] aspect-[4/5] mx-auto select-none">
      <svg
        viewBox="0 0 300 375"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md overflow-visible"
      >
        <defs>
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* --- STICK ARMS (Left & Right) --- */}
        <g
          id="part-arms"
          className="cursor-pointer transition-all duration-150 ease-out hover:brightness-105"
          onClick={(e) => onPartTap('arms', e)}
          onTouchStart={(e) => onPartTap('arms', e)}
        >
          {/* Left Arm & Twigs */}
          <path
            d="M85 220 L25 190 M45 200 L40 180 M55 205 L60 185"
            stroke={colors.arms || '#78350F'}
            strokeWidth={colors.arms ? 7 : 5.5}
            strokeLinecap="round"
          />
          {/* Right Arm & Twigs */}
          <path
            d="M215 220 L275 190 M255 200 L260 180 M245 205 L240 185"
            stroke={colors.arms || '#78350F'}
            strokeWidth={colors.arms ? 7 : 5.5}
            strokeLinecap="round"
          />
        </g>

        {/* --- LOWER BODY (Big Snowball) --- */}
        <g
          id="part-body"
          className={`cursor-pointer transition-all duration-150 ease-out ${
            isTarget('body')
              ? 'filter drop-shadow-[0_0_6px_rgba(251,191,36,0.85)]'
              : 'hover:brightness-102'
          }`}
          onClick={(e) => onPartTap('body', e)}
          onTouchStart={(e) => onPartTap('body', e)}
        >
          <circle
            cx="150"
            cy="270"
            r="80"
            fill={colors.body || defaultWhite}
            stroke={strokeColor}
            strokeWidth={strokeW}
          />
        </g>

        {/* --- HEAD (Middle Snowball) --- */}
        <g
          id="part-head"
          className={`cursor-pointer transition-all duration-150 ease-out ${
            isTarget('head')
              ? 'filter drop-shadow-[0_0_6px_rgba(251,191,36,0.85)]'
              : 'hover:brightness-102'
          }`}
          onClick={(e) => onPartTap('head', e)}
          onTouchStart={(e) => onPartTap('head', e)}
        >
          <circle
            cx="150"
            cy="145"
            r="56"
            fill={colors.head || defaultWhite}
            stroke={strokeColor}
            strokeWidth={strokeW}
          />
        </g>

        {/* --- CUTE EYES & MOUTH (Always on face) --- */}
        {/* Left Eye */}
        <circle cx="132" cy="135" r="5.5" fill="#1E293B" />
        <circle cx="134" cy="133" r="1.8" fill="#FFFFFF" />
        {/* Right Eye */}
        <circle cx="168" cy="135" r="5.5" fill="#1E293B" />
        <circle cx="170" cy="133" r="1.8" fill="#FFFFFF" />
        {/* Smiling Pebble Mouth */}
        <circle cx="130" cy="162" r="3.2" fill="#1E293B" />
        <circle cx="140" cy="166" r="3.2" fill="#1E293B" />
        <circle cx="150" cy="168" r="3.2" fill="#1E293B" />
        <circle cx="160" cy="166" r="3.2" fill="#1E293B" />
        <circle cx="170" cy="162" r="3.2" fill="#1E293B" />

        {/* --- CARROT NOSE --- */}
        <g
          id="part-nose"
          className={`cursor-pointer transition-all duration-150 ease-out ${
            isTarget('nose')
              ? 'filter drop-shadow-[0_0_6px_rgba(251,191,36,0.85)]'
              : 'hover:brightness-105'
          }`}
          onClick={(e) => onPartTap('nose', e)}
          onTouchStart={(e) => onPartTap('nose', e)}
        >
          <path
            d="M148 144 L195 150 L148 155 Z"
            fill={colors.nose || '#FB923C'}
            stroke={strokeColor}
            strokeWidth={3}
            strokeLinejoin="round"
          />
        </g>

        {/* --- COZY SCARF --- */}
        <g
          id="part-scarf"
          className={`cursor-pointer transition-all duration-150 ease-out ${
            isTarget('scarf')
              ? 'filter drop-shadow-[0_0_6px_rgba(251,191,36,0.85)]'
              : 'hover:brightness-105'
          }`}
          onClick={(e) => onPartTap('scarf', e)}
          onTouchStart={(e) => onPartTap('scarf', e)}
        >
          {/* Scarf loop around neck */}
          <path
            d="M102 185 C102 175, 198 175, 198 185 C198 202, 102 202, 102 185 Z"
            fill={colors.scarf || defaultWhite}
            stroke={strokeColor}
            strokeWidth={strokeW}
          />
          {/* Scarf hanging tail */}
          <path
            d="M165 195 L182 250 C182 255, 155 255, 155 250 L150 195 Z"
            fill={colors.scarf || defaultWhite}
            stroke={strokeColor}
            strokeWidth={strokeW}
            strokeLinejoin="round"
          />
          {/* Scarf fringe lines */}
          <line x1="160" y1="250" x2="160" y2="258" stroke={strokeColor} strokeWidth="3" />
          <line x1="168" y1="250" x2="168" y2="258" stroke={strokeColor} strokeWidth="3" />
          <line x1="176" y1="250" x2="176" y2="258" stroke={strokeColor} strokeWidth="3" />
        </g>

        {/* --- BUTTONS ON TUMMY --- */}
        <g
          id="part-buttons"
          className={`cursor-pointer transition-all duration-150 ease-out ${
            isTarget('buttons')
              ? 'filter drop-shadow-[0_0_6px_rgba(251,191,36,0.9)]'
              : 'hover:brightness-105 hover:opacity-95'
          }`}
          onClick={(e) => onPartTap('buttons', e)}
          onTouchStart={(e) => onPartTap('buttons', e)}
        >
          {/* Button 1 */}
          <circle
            cx="150"
            cy="235"
            r="9"
            fill={colors.buttons || defaultWhite}
            stroke={strokeColor}
            strokeWidth={3.5}
            className="transition-colors duration-150"
          />
          {/* Button 2 */}
          <circle
            cx="150"
            cy="270"
            r="9"
            fill={colors.buttons || defaultWhite}
            stroke={strokeColor}
            strokeWidth={3.5}
            className="transition-colors duration-150"
          />
          {/* Button 3 */}
          <circle
            cx="150"
            cy="305"
            r="9"
            fill={colors.buttons || defaultWhite}
            stroke={strokeColor}
            strokeWidth={3.5}
            className="transition-colors duration-150"
          />
        </g>

        {/* --- TOP HAT (Beanie / Classic Hat) --- */}
        <g
          id="part-hat"
          className={`cursor-pointer transition-all duration-150 ease-out ${
            isTarget('hat')
              ? 'filter drop-shadow-[0_0_6px_rgba(251,191,36,0.85)]'
              : 'hover:brightness-105'
          }`}
          onClick={(e) => onPartTap('hat', e)}
          onTouchStart={(e) => onPartTap('hat', e)}
        >
          {/* Hat Brim */}
          <path
            d="M100 102 C100 95, 200 95, 200 102 C200 108, 100 108, 100 102 Z"
            fill={colors.hat || defaultWhite}
            stroke={strokeColor}
            strokeWidth={strokeW}
          />
          {/* Hat Crown / Cylinder */}
          <path
            d="M118 98 L122 35 C122 28, 178 28, 178 35 L182 98 Z"
            fill={colors.hat || defaultWhite}
            stroke={strokeColor}
            strokeWidth={strokeW}
            strokeLinejoin="round"
          />
        </g>
      </svg>
    </div>
  );
};

// ============================================================================
// 2. BUTTERFLY WORKSHEET ILLUSTRATION
// ============================================================================

const ButterflyWorksheet: React.FC<{
  colors: CharacterColorState;
  onPartTap: (partKey: string, e: React.MouseEvent | React.TouchEvent) => void;
  activeTargetPart?: string;
  isGuided: boolean;
}> = ({ colors, onPartTap, activeTargetPart, isGuided }) => {
  const defaultWhite = '#FFFFFF';
  const strokeColor = '#1E293B';
  const strokeW = 4.5;

  const isTarget = (k: string) => isGuided && activeTargetPart === k;

  return (
    <div className="relative w-full max-w-[340px] sm:max-w-[400px] aspect-[4/5] mx-auto select-none">
      <svg
        viewBox="0 0 320 375"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md overflow-visible"
      >
        {/* --- LEFT UPPER WING --- */}
        <g
          id="part-leftUpperWing"
          className={`cursor-pointer transition-transform duration-150 ${
            isTarget('wings') || isTarget('upperWings')
              ? 'animate-pulse'
              : 'hover:scale-105 active:scale-95'
          }`}
          onClick={(e) => onPartTap('wings', e)}
          onTouchStart={(e) => onPartTap('wings', e)}
        >
          <path
            d="M150 160 C120 70, 30 50, 25 120 C20 180, 100 200, 150 185 Z"
            fill={colors.wings || defaultWhite}
            stroke={strokeColor}
            strokeWidth={strokeW}
            strokeLinejoin="round"
          />
        </g>

        {/* --- RIGHT UPPER WING --- */}
        <g
          id="part-rightUpperWing"
          className={`cursor-pointer transition-transform duration-150 ${
            isTarget('wings') || isTarget('upperWings')
              ? 'animate-pulse'
              : 'hover:scale-105 active:scale-95'
          }`}
          onClick={(e) => onPartTap('wings', e)}
          onTouchStart={(e) => onPartTap('wings', e)}
        >
          <path
            d="M170 160 C200 70, 290 50, 295 120 C300 180, 220 200, 170 185 Z"
            fill={colors.wings || defaultWhite}
            stroke={strokeColor}
            strokeWidth={strokeW}
            strokeLinejoin="round"
          />
        </g>

        {/* --- LEFT LOWER WING --- */}
        <g
          id="part-leftLowerWing"
          className={`cursor-pointer transition-transform duration-150 ${
            isTarget('lowerWings') || isTarget('wings')
              ? 'animate-pulse'
              : 'hover:scale-105 active:scale-95'
          }`}
          onClick={(e) => onPartTap(isGuided ? 'wings' : 'lowerWings', e)}
          onTouchStart={(e) => onPartTap(isGuided ? 'wings' : 'lowerWings', e)}
        >
          <path
            d="M150 195 C110 210, 45 230, 60 300 C80 345, 150 280, 155 240 Z"
            fill={colors.lowerWings || colors.wings || defaultWhite}
            stroke={strokeColor}
            strokeWidth={strokeW}
            strokeLinejoin="round"
          />
        </g>

        {/* --- RIGHT LOWER WING --- */}
        <g
          id="part-rightLowerWing"
          className={`cursor-pointer transition-transform duration-150 ${
            isTarget('lowerWings') || isTarget('wings')
              ? 'animate-pulse'
              : 'hover:scale-105 active:scale-95'
          }`}
          onClick={(e) => onPartTap(isGuided ? 'wings' : 'lowerWings', e)}
          onTouchStart={(e) => onPartTap(isGuided ? 'wings' : 'lowerWings', e)}
        >
          <path
            d="M170 195 C210 210, 275 230, 260 300 C240 345, 170 280, 165 240 Z"
            fill={colors.lowerWings || colors.wings || defaultWhite}
            stroke={strokeColor}
            strokeWidth={strokeW}
            strokeLinejoin="round"
          />
        </g>

        {/* --- WING CIRCLE PATTERNS --- */}
        <g
          id="part-wingPatterns"
          className={`cursor-pointer transition-transform duration-150 ${
            isTarget('patterns') ? 'animate-pulse' : 'hover:scale-110 active:scale-95'
          }`}
          onClick={(e) => onPartTap(isGuided ? 'wings' : 'patterns', e)}
          onTouchStart={(e) => onPartTap(isGuided ? 'wings' : 'patterns', e)}
        >
          {/* Upper Wing Big Circles */}
          <circle
            cx="80"
            cy="125"
            r="20"
            fill={colors.patterns || '#FED7AA'}
            stroke={strokeColor}
            strokeWidth={3.5}
          />
          <circle
            cx="240"
            cy="125"
            r="20"
            fill={colors.patterns || '#FED7AA'}
            stroke={strokeColor}
            strokeWidth={3.5}
          />
          {/* Lower Wing Circles */}
          <circle
            cx="105"
            cy="270"
            r="14"
            fill={colors.patterns || '#FED7AA'}
            stroke={strokeColor}
            strokeWidth={3}
          />
          <circle
            cx="215"
            cy="270"
            r="14"
            fill={colors.patterns || '#FED7AA'}
            stroke={strokeColor}
            strokeWidth={3}
          />
        </g>

        {/* --- ANTENNAE --- */}
        <g
          id="part-antennae"
          className={`cursor-pointer transition-transform duration-150 ${
            isTarget('antennae') ? 'animate-pulse' : 'hover:scale-105 active:scale-95'
          }`}
          onClick={(e) => onPartTap('antennae', e)}
          onTouchStart={(e) => onPartTap('antennae', e)}
        >
          {/* Left Antenna */}
          <path
            d="M152 110 Q130 50 110 55"
            stroke={strokeColor}
            strokeWidth={4.5}
            strokeLinecap="round"
            fill="none"
          />
          <circle
            cx="110"
            cy="55"
            r="9"
            fill={colors.antennae || defaultWhite}
            stroke={strokeColor}
            strokeWidth={3.5}
          />

          {/* Right Antenna */}
          <path
            d="M168 110 Q190 50 210 55"
            stroke={strokeColor}
            strokeWidth={4.5}
            strokeLinecap="round"
            fill="none"
          />
          <circle
            cx="210"
            cy="55"
            r="9"
            fill={colors.antennae || defaultWhite}
            stroke={strokeColor}
            strokeWidth={3.5}
          />
        </g>

        {/* --- MAIN BUTTERFLY BODY --- */}
        <g
          id="part-body"
          className={`cursor-pointer transition-transform duration-150 ${
            isTarget('body') ? 'animate-pulse' : 'hover:scale-105 active:scale-95'
          }`}
          onClick={(e) => onPartTap('body', e)}
          onTouchStart={(e) => onPartTap('body', e)}
        >
          {/* Head */}
          <circle
            cx="160"
            cy="125"
            r="22"
            fill={colors.body || defaultWhite}
            stroke={strokeColor}
            strokeWidth={strokeW}
          />

          {/* Caterpillar-style Segmented Tummy */}
          <rect
            x="146"
            y="145"
            width="28"
            height="135"
            rx="14"
            fill={colors.body || defaultWhite}
            stroke={strokeColor}
            strokeWidth={strokeW}
          />

          {/* Body Stripes */}
          <line x1="148" y1="180" x2="172" y2="180" stroke={strokeColor} strokeWidth="3" />
          <line x1="148" y1="210" x2="172" y2="210" stroke={strokeColor} strokeWidth="3" />
          <line x1="148" y1="240" x2="172" y2="240" stroke={strokeColor} strokeWidth="3" />

          {/* Big Cute Eyes */}
          <circle cx="152" cy="122" r="4.5" fill="#1E293B" />
          <circle cx="153.5" cy="120.5" r="1.5" fill="#FFFFFF" />

          <circle cx="168" cy="122" r="4.5" fill="#1E293B" />
          <circle cx="169.5" cy="120.5" r="1.5" fill="#FFFFFF" />

          {/* Sweet Smile */}
          <path
            d="M155 133 Q160 137 165 133"
            stroke={strokeColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Cute Cheeks */}
          <circle cx="149" cy="130" r="2.5" fill="#FB7185" opacity="0.6" />
          <circle cx="171" cy="130" r="2.5" fill="#FB7185" opacity="0.6" />
        </g>
      </svg>
    </div>
  );
};

// ============================================================================
// 3. BUNNY WORKSHEET ILLUSTRATION
// ============================================================================

const BunnyWorksheet: React.FC<{
  colors: CharacterColorState;
  onPartTap: (partKey: string, e: React.MouseEvent | React.TouchEvent) => void;
  activeTargetPart?: string;
  isGuided: boolean;
}> = ({ colors, onPartTap, activeTargetPart, isGuided }) => {
  const defaultWhite = '#FFFFFF';
  const strokeColor = '#1E293B';
  const strokeW = 4.5;

  const isTarget = (k: string) => isGuided && activeTargetPart === k;

  return (
    <div className="relative w-full max-w-[340px] sm:max-w-[400px] aspect-[4/5] mx-auto select-none">
      <svg
        viewBox="0 0 300 375"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md overflow-visible"
      >
        {/* --- FLUFFY TAIL (Peeking on left) --- */}
        <g
          id="part-tail"
          className="cursor-pointer transition-transform duration-150 hover:scale-110 active:scale-95"
          onClick={(e) => onPartTap('tail', e)}
          onTouchStart={(e) => onPartTap('tail', e)}
        >
          <circle
            cx="65"
            cy="275"
            r="20"
            fill={colors.tail || defaultWhite}
            stroke={strokeColor}
            strokeWidth={strokeW}
          />
        </g>

        {/* --- EARS (Left & Right) --- */}
        <g
          id="part-ears"
          className={`cursor-pointer transition-transform duration-150 ${
            isTarget('ears') ? 'animate-pulse' : 'hover:scale-105 active:scale-95'
          }`}
          onClick={(e) => onPartTap('ears', e)}
          onTouchStart={(e) => onPartTap('ears', e)}
        >
          {/* Left Ear Outer */}
          <path
            d="M105 130 C85 50, 95 15, 120 15 C145 15, 135 65, 125 130 Z"
            fill={colors.ears || defaultWhite}
            stroke={strokeColor}
            strokeWidth={strokeW}
            strokeLinejoin="round"
          />
          {/* Left Ear Inner Pink/Colored Area */}
          <path
            d="M108 120 C95 55, 102 30, 118 30 C132 30, 128 65, 122 120 Z"
            fill={colors.ears ? '#FBCFE8' : '#FCE7F3'}
            opacity="0.8"
          />

          {/* Right Ear Outer (Tilted/Cute) */}
          <path
            d="M175 130 C165 65, 155 15, 180 15 C205 15, 215 50, 195 130 Z"
            fill={colors.ears || defaultWhite}
            stroke={strokeColor}
            strokeWidth={strokeW}
            strokeLinejoin="round"
          />
          {/* Right Ear Inner Pink/Colored Area */}
          <path
            d="M178 120 C172 65, 168 30, 182 30 C198 30, 205 55, 192 120 Z"
            fill={colors.ears ? '#FBCFE8' : '#FCE7F3'}
            opacity="0.8"
          />
        </g>

        {/* --- BUNNY BODY --- */}
        <g
          id="part-body"
          className={`cursor-pointer transition-transform duration-150 ${
            isTarget('body') || isTarget('shirt')
              ? 'animate-pulse'
              : 'hover:scale-[1.02] active:scale-98'
          }`}
          onClick={(e) => onPartTap(isGuided ? 'shirt' : 'body', e)}
          onTouchStart={(e) => onPartTap(isGuided ? 'shirt' : 'body', e)}
        >
          <ellipse
            cx="150"
            cy="245"
            rx="65"
            ry="70"
            fill={colors.body || defaultWhite}
            stroke={strokeColor}
            strokeWidth={strokeW}
          />
        </g>

        {/* --- SHIRT / VEST OVER BODY --- */}
        <g
          id="part-shirt"
          className={`cursor-pointer transition-transform duration-150 ${
            isTarget('shirt') ? 'animate-pulse' : 'hover:scale-[1.02] active:scale-98'
          }`}
          onClick={(e) => onPartTap('shirt', e)}
          onTouchStart={(e) => onPartTap('shirt', e)}
        >
          <path
            d="M102 210 C100 240, 105 270, 150 275 C195 270, 200 240, 198 210 C180 200, 120 200, 102 210 Z"
            fill={colors.shirt || defaultWhite}
            stroke={strokeColor}
            strokeWidth={strokeW}
            strokeLinejoin="round"
          />
          {/* Cute Shirt Star or Pocket Detail */}
          <circle cx="150" cy="240" r="10" fill="#FFFFFF" opacity="0.6" />
          <path
            d="M150 234 L152 238 L156 238 L153 241 L154 245 L150 242 L146 245 L147 241 L144 238 L148 238 Z"
            fill="#F59E0B"
          />
        </g>

        {/* --- BIG CUTE FEET (Left & Right) --- */}
        <g
          id="part-feet"
          className={`cursor-pointer transition-transform duration-150 ${
            isTarget('feet') ? 'animate-pulse' : 'hover:scale-105 active:scale-95'
          }`}
          onClick={(e) => onPartTap('feet', e)}
          onTouchStart={(e) => onPartTap('feet', e)}
        >
          {/* Left Foot */}
          <ellipse
            cx="98"
            cy="318"
            rx="34"
            ry="20"
            fill={colors.feet || defaultWhite}
            stroke={strokeColor}
            strokeWidth={strokeW}
          />
          {/* Toe Pad Details */}
          <circle cx="82" cy="318" r="4.5" fill="#FDA4AF" opacity="0.75" />
          <circle cx="95" cy="322" r="4.5" fill="#FDA4AF" opacity="0.75" />
          <circle cx="108" cy="318" r="4.5" fill="#FDA4AF" opacity="0.75" />

          {/* Right Foot */}
          <ellipse
            cx="202"
            cy="318"
            rx="34"
            ry="20"
            fill={colors.feet || defaultWhite}
            stroke={strokeColor}
            strokeWidth={strokeW}
          />
          {/* Toe Pad Details */}
          <circle cx="192" cy="318" r="4.5" fill="#FDA4AF" opacity="0.75" />
          <circle cx="205" cy="322" r="4.5" fill="#FDA4AF" opacity="0.75" />
          <circle cx="218" cy="318" r="4.5" fill="#FDA4AF" opacity="0.75" />
        </g>

        {/* --- HEAD & FACE --- */}
        <g
          id="part-head"
          className={`cursor-pointer transition-transform duration-150 ${
            isTarget('head') ? 'animate-pulse' : 'hover:scale-[1.02] active:scale-98'
          }`}
          onClick={(e) => onPartTap('head', e)}
          onTouchStart={(e) => onPartTap('head', e)}
        >
          <circle
            cx="150"
            cy="150"
            r="54"
            fill={colors.head || defaultWhite}
            stroke={strokeColor}
            strokeWidth={strokeW}
          />

          {/* Big Expressive Eyes */}
          <circle cx="130" cy="142" r="6.5" fill="#1E293B" />
          <circle cx="132" cy="139.5" r="2.2" fill="#FFFFFF" />
          <circle cx="128" cy="144" r="1" fill="#FFFFFF" />

          <circle cx="170" cy="142" r="6.5" fill="#1E293B" />
          <circle cx="172" cy="139.5" r="2.2" fill="#FFFFFF" />
          <circle cx="168" cy="144" r="1" fill="#FFFFFF" />

          {/* Cheerful Rosy Cheeks */}
          <ellipse cx="120" cy="155" rx="6" ry="3.5" fill="#FB7185" opacity="0.65" />
          <ellipse cx="180" cy="155" rx="6" ry="3.5" fill="#FB7185" opacity="0.65" />

          {/* Whiskers */}
          <path d="M110 148 L90 144 M110 154 L88 155 M110 160 L92 166" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
          <path d="M190 148 L210 144 M190 154 L212 155 M190 160 L208 166" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />

          {/* Bunny Mouth */}
          <path
            d="M142 162 Q150 168 150 158 Q150 168 158 162"
            stroke={strokeColor}
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
        </g>

        {/* --- CUTE BUNNY NOSE --- */}
        <g
          id="part-nose"
          className={`cursor-pointer transition-transform duration-150 ${
            isTarget('nose') ? 'animate-pulse' : 'hover:scale-110 active:scale-95'
          }`}
          onClick={(e) => onPartTap('nose', e)}
          onTouchStart={(e) => onPartTap('nose', e)}
        >
          <polygon
            points="145,152 155,152 150,158"
            fill={colors.nose || '#F43F5E'}
            stroke={strokeColor}
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
        </g>

        {/* --- FRONT PAWS (Tucked over shirt) --- */}
        <g
          id="part-paws"
          className="cursor-pointer transition-transform duration-150 hover:scale-105 active:scale-95"
          onClick={(e) => onPartTap('paws', e)}
          onTouchStart={(e) => onPartTap('paws', e)}
        >
          <ellipse
            cx="128"
            cy="215"
            rx="14"
            ry="11"
            fill={colors.paws || defaultWhite}
            stroke={strokeColor}
            strokeWidth={strokeW}
          />
          <ellipse
            cx="172"
            cy="215"
            rx="14"
            ry="11"
            fill={colors.paws || defaultWhite}
            stroke={strokeColor}
            strokeWidth={strokeW}
          />
        </g>
      </svg>
    </div>
  );
};

// ============================================================================
// MAIN COLOR FUN COMPONENT
// ============================================================================

export const ColorFun: React.FC<ColorFunProps> = ({
  onCollectStar,
  onNavigateHome,
  onNavigateNext,
  onNavigatePrev,
  isActivityCompleted = false,
}) => {
  // --------------------------------------------------------------------------
  // TOP-LEVEL PROGRESS & CHARACTER FLOW (SNOWMAN -> BUTTERFLY -> BUNNY)
  // --------------------------------------------------------------------------
  const characterList: CharacterType[] = ['snowman', 'butterfly', 'bunny'];
  const [characterIndex, setCharacterIndex] = useState<number>(0);

  // Sub-mode for current character: 'guided' (Primary) vs 'free' (6 colors)
  const [characterMode, setCharacterMode] = useState<'guided' | 'free'>('guided');

  // Currently Selected Palette Color
  const [selectedColor, setSelectedColor] = useState<ColorId | null>(null);

  // Guided step index inside the current character
  const [guidedStepIndex, setGuidedStepIndex] = useState<number>(0);
  const [guidedSteps, setGuidedSteps] = useState<GuidedStep[]>([]);

  // Colored state for all 3 characters (persisted across free & replay stages)
  const [snowmanColors, setSnowmanColors] = useState<CharacterColorState>({});
  const [butterflyColors, setButterflyColors] = useState<CharacterColorState>({});
  const [bunnyColors, setBunnyColors] = useState<CharacterColorState>({});

  // Top-Level State Machine
  const [activityState, setActivityState] = useState<
    'intro' | 'active' | 'character_complete' | 'all_done'
  >('intro');

  // Particle sparkle burst on successful color fill
  const [sparkles, setSparkles] = useState<ColorSparkleFX[]>([]);

  // Floating Pop Chip ("Great Job! ✨")
  const [popFeedback, setPopFeedback] = useState<{
    text: string;
    x: number;
    y: number;
    color: string;
  } | null>(null);

  // Refs
  const timersRef = useRef<NodeJS.Timeout[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isColoringRef = useRef<boolean>(false);

  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  }, []);

  const currentCharacter = characterList[characterIndex] || 'snowman';

  // --------------------------------------------------------------------------
  // GENERATE GUIDED STEPS FOR A CHARACTER WITH SHUFFLED COLORS & PARTS
  // --------------------------------------------------------------------------
  const buildGuidedStepsForCharacter = useCallback(
    (char: CharacterType): GuidedStep[] => {
      // Shuffle primary colors: RED, YELLOW, BLUE
      const shuffledColors = shuffleArray<ColorId>(['red', 'yellow', 'blue']);

      if (char === 'snowman') {
        const parts = [
          { key: 'hat', name: 'hat' },
          { key: 'scarf', name: 'scarf' },
          { key: 'buttons', name: 'buttons' },
        ];
        const shuffledParts = shuffleArray(parts);

        return shuffledParts.map((p, idx) => {
          const col = shuffledColors[idx];
          const colName = COLOR_SWATCHES[col].name;
          return {
            partKey: p.key,
            partName: p.name,
            targetColor: col,
            instruction: `Color my ${p.name} ${colName}!`,
            hintWrongColor: `Try ${colName}!`,
            hintWrongPart: `Color the ${p.name}!`,
          };
        });
      }

      if (char === 'butterfly') {
        const parts = [
          { key: 'wings', name: 'wings' },
          { key: 'body', name: 'body' },
          { key: 'antennae', name: 'antennae' },
        ];
        const shuffledParts = shuffleArray(parts);

        return shuffledParts.map((p, idx) => {
          const col = shuffledColors[idx];
          const colName = COLOR_SWATCHES[col].name;
          return {
            partKey: p.key,
            partName: p.name,
            targetColor: col,
            instruction: `Color my ${p.name} ${colName}!`,
            hintWrongColor: `Try ${colName}!`,
            hintWrongPart: `Color the ${p.name}!`,
          };
        });
      }

      // Bunny
      const parts = [
        { key: 'ears', name: 'ears' },
        { key: 'shirt', name: 'shirt' },
        { key: 'feet', name: 'feet' },
      ];
      const shuffledParts = shuffleArray(parts);

      return shuffledParts.map((p, idx) => {
        const col = shuffledColors[idx];
        const colName = COLOR_SWATCHES[col].name;
        return {
          partKey: p.key,
          partName: p.name,
          targetColor: col,
          instruction: `Color my ${p.name} ${colName}!`,
          hintWrongColor: `Try ${colName}!`,
          hintWrongPart: `Color the ${p.name}!`,
        };
      });
    },
    []
  );

  // --------------------------------------------------------------------------
  // START FRESH GAME / REPLAY
  // --------------------------------------------------------------------------
  const startFreshGame = useCallback(() => {
    clearAllTimers();
    soundManager.stopSpeech();
    isColoringRef.current = false;

    // Reset color maps
    setSnowmanColors({});
    setButterflyColors({});
    setBunnyColors({});

    // Start with Snowman
    setCharacterIndex(0);
    setCharacterMode('guided');
    setSelectedColor(null);

    const initialSteps = buildGuidedStepsForCharacter('snowman');
    setGuidedSteps(initialSteps);
    setGuidedStepIndex(0);

    setActivityState('intro');
    setPopFeedback(null);
    setSparkles([]);

    const t1 = setTimeout(() => {
      soundManager.speak(
        'Color Fun! Let’s color the snowman, butterfly, and bunny!'
      );
    }, 500);

    const t2 = setTimeout(() => {
      setActivityState('active');
      const firstStep = initialSteps[0];
      if (firstStep) {
        soundManager.speak(firstStep.instruction);
      }
    }, 3800);

    timersRef.current.push(t1, t2);
  }, [buildGuidedStepsForCharacter, clearAllTimers]);

  // Mount effect
  useEffect(() => {
    soundManager.startBackgroundMusic();
    startFreshGame();

    return () => {
      clearAllTimers();
      soundManager.stopSpeech();
    };
  }, [clearAllTimers, startFreshGame]);

  // Current active guided step
  const currentStep =
    characterMode === 'guided' ? guidedSteps[guidedStepIndex] : null;

  // --------------------------------------------------------------------------
  // REPLAY AUDIO INSTRUCTION
  // --------------------------------------------------------------------------
  const handleReplayInstruction = useCallback(() => {
    if (characterMode === 'guided' && currentStep) {
      soundManager.speak(currentStep.instruction);
    } else {
      soundManager.speak('Now color me as you like! Choose any color!');
    }
  }, [characterMode, currentStep]);

  // --------------------------------------------------------------------------
  // SPARKLE PARTICLES TRIGGER
  // --------------------------------------------------------------------------
  const triggerSparklesAt = (clickX: number, clickY: number, colorHex: string) => {
    const newSparkles: ColorSparkleFX[] = [];
    for (let i = 0; i < 12; i++) {
      const angle = (Math.PI * 2 * i) / 12 + (Math.random() - 0.5) * 0.4;
      const speed = 2 + Math.random() * 3.5;
      newSparkles.push({
        id: `sparkle-${Date.now()}-${i}-${Math.random()}`,
        x: clickX,
        y: clickY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.2,
        size: 7 + Math.random() * 8,
        color: colorHex,
        opacity: 1,
      });
    }

    setSparkles((prev) => [...prev, ...newSparkles]);

    // Cleanup sparkles over time
    const interval = setInterval(() => {
      setSparkles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.1,
            opacity: p.opacity - 0.04,
          }))
          .filter((p) => p.opacity > 0)
      );
    }, 20);

    setTimeout(() => {
      clearInterval(interval);
      setSparkles([]);
    }, 800);
  };

  // --------------------------------------------------------------------------
  // SWITCH TO FREE COLORING MODE FOR CURRENT CHARACTER
  // --------------------------------------------------------------------------
  const enterFreeColoringMode = useCallback(() => {
    setCharacterMode('free');
    setSelectedColor(null);

    // Remove existing colors from picture so child gets a fresh, clean canvas for free coloring
    if (currentCharacter === 'snowman') {
      setSnowmanColors({});
    } else if (currentCharacter === 'butterfly') {
      setButterflyColors({});
    } else if (currentCharacter === 'bunny') {
      setBunnyColors({});
    }

    soundManager.speak('Now color me as you like! Choose any color!');
  }, [currentCharacter]);

  // --------------------------------------------------------------------------
  // ADVANCE TO NEXT CHARACTER (SNOWMAN -> BUTTERFLY -> BUNNY -> ALL DONE)
  // --------------------------------------------------------------------------
  const handleFinishCurrentCharacter = useCallback(() => {
    soundManager.playSuccess();
    const praise =
      currentCharacter === 'butterfly'
        ? 'Beautiful!'
        : 'Great job!';
    soundManager.speak(praise);

    setActivityState('character_complete');

    const nextCharIdx = characterIndex + 1;
    if (nextCharIdx < characterList.length) {
      const nextChar = characterList[nextCharIdx];
      const nextSteps = buildGuidedStepsForCharacter(nextChar);

      const t1 = setTimeout(() => {
        setCharacterIndex(nextCharIdx);
        setCharacterMode('guided');
        setGuidedSteps(nextSteps);
        setGuidedStepIndex(0);
        setSelectedColor(null);
        setActivityState('active');

        const firstStep = nextSteps[0];
        if (firstStep) {
          soundManager.speak(firstStep.instruction);
        }
      }, 2000);

      timersRef.current.push(t1);
    } else {
      // ALL 3 COMPLETED!
      if (onCollectStar) {
        onCollectStar();
      }
      const tDone = setTimeout(() => {
        setActivityState('all_done');
        soundManager.playCelebration();
        soundManager.speak('COLOR FUN COMPLETE! Great job!');
      }, 1600);

      timersRef.current.push(tDone);
    }
  }, [
    buildGuidedStepsForCharacter,
    characterIndex,
    characterList,
    currentCharacter,
    onCollectStar,
  ]);

  // --------------------------------------------------------------------------
  // PART TAP HANDLER (THE CORE WORKSHEET COLORING INTERACTION)
  // --------------------------------------------------------------------------
  const handlePartTap = (
    partKey: string,
    e: React.MouseEvent | React.TouchEvent
  ) => {
    if (activityState !== 'active' || isColoringRef.current) return;

    // Get tap coordinate
    const rect = containerRef.current?.getBoundingClientRect();
    let clickX = 160;
    let clickY = 160;

    if ('touches' in e && e.touches.length > 0) {
      clickX = e.touches[0].clientX;
      clickY = e.touches[0].clientY;
    } else if ('clientX' in e) {
      clickX = (e as React.MouseEvent).clientX;
      clickY = (e as React.MouseEvent).clientY;
    }

    if (rect) {
      clickX = Math.max(20, Math.min(rect.width - 20, clickX - rect.left));
      clickY = Math.max(20, Math.min(rect.height - 20, clickY - rect.top));
    }

    // ========================================================================
    // MODE 1: GUIDED PRIMARY COLOR MODE
    // ========================================================================
    if (characterMode === 'guided' && currentStep) {
      // Step A: Check if child has selected any color
      if (!selectedColor) {
        soundManager.playPop();
        soundManager.speak(currentStep.hintWrongColor);
        return;
      }

      // Step B: Check if child selected the WRONG color
      if (selectedColor !== currentStep.targetColor) {
        soundManager.playPop();
        soundManager.speak(currentStep.hintWrongColor);
        return;
      }

      // Step C: Check if child tapped the WRONG part
      if (partKey !== currentStep.partKey) {
        soundManager.playPop();
        soundManager.speak(currentStep.hintWrongPart);
        return;
      }

      // Step D: CORRECT! Fill part with color & advance
      isColoringRef.current = true;
      const targetHex = COLOR_SWATCHES[currentStep.targetColor].hex;

      // Apply fill to character color map
      if (currentCharacter === 'snowman') {
        setSnowmanColors((prev) => ({ ...prev, [partKey]: targetHex }));
      } else if (currentCharacter === 'butterfly') {
        setButterflyColors((prev) => ({ ...prev, [partKey]: targetHex }));
      } else {
        setBunnyColors((prev) => ({ ...prev, [partKey]: targetHex }));
      }

      soundManager.playSuccess();
      triggerSparklesAt(clickX, clickY, targetHex);
      soundManager.speak('Great job!');

      setPopFeedback({
        text: 'Great Job! ✨',
        x: clickX,
        y: Math.max(80, clickY - 30),
        color: COLOR_SWATCHES[currentStep.targetColor].bgHex,
      });

      setTimeout(() => {
        setPopFeedback(null);
      }, 1000);

      // Check if more guided steps remain for this character
      const nextGuidedIdx = guidedStepIndex + 1;
      const tNext = setTimeout(() => {
        isColoringRef.current = false;
        if (nextGuidedIdx < guidedSteps.length) {
          setGuidedStepIndex(nextGuidedIdx);
          setSelectedColor(null);
          const nextStep = guidedSteps[nextGuidedIdx];
          soundManager.speak(nextStep.instruction);
        } else {
          // Guided section finished for this character! Move to Free Coloring!
          enterFreeColoringMode();
        }
      }, 1500);

      timersRef.current.push(tNext);
      return;
    }

    // ========================================================================
    // MODE 2: FREE COLORING MODE (NO WRONG ANSWERS, FREELY RECOLOR ANY PART)
    // ========================================================================
    if (characterMode === 'free') {
      if (!selectedColor) {
        soundManager.playPop();
        soundManager.speak('Choose any color first!');
        return;
      }

      const chosenHex = COLOR_SWATCHES[selectedColor].hex;

      if (currentCharacter === 'snowman') {
        setSnowmanColors((prev) => ({ ...prev, [partKey]: chosenHex }));
      } else if (currentCharacter === 'butterfly') {
        setButterflyColors((prev) => ({ ...prev, [partKey]: chosenHex }));
      } else {
        setBunnyColors((prev) => ({ ...prev, [partKey]: chosenHex }));
      }

      soundManager.playSuccess();
      triggerSparklesAt(clickX, clickY, chosenHex);
    }
  };

  // Swatches displayed based on mode:
  // Guided: 3 Primary Colors only (RED, YELLOW, BLUE)
  // Free: 6 Primary + Secondary Colors (RED, YELLOW, BLUE, GREEN, ORANGE, PURPLE)
  const displayedColorIds =
    characterMode === 'guided' ? PRIMARY_COLORS : ALL_SIX_COLORS;

  const characterTitle =
    currentCharacter === 'snowman'
      ? 'Snowman'
      : currentCharacter === 'butterfly'
      ? 'Butterfly'
      : 'Bunny';

  return (
    <div
      id="color-fun-activity"
      className="relative w-full min-h-[calc(100vh-80px)] flex flex-col justify-between overflow-hidden select-none bg-gradient-to-b from-[#F0FDF4] via-[#ECFDF5] to-[#E0F2FE]"
    >
      {/* Subtle Background Art Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-amber-200/20 via-sky-200/15 to-transparent pointer-events-none -z-10" />

      {/* Floating gentle pastel bubbles */}
      <div className="absolute top-12 left-6 w-16 h-16 rounded-full bg-rose-200/30 blur-xs pointer-events-none -z-10 animate-pulse" />
      <div className="absolute bottom-16 right-8 w-24 h-24 rounded-full bg-amber-200/30 blur-xs pointer-events-none -z-10 animate-pulse" />
      <div className="absolute top-1/3 right-4 w-12 h-12 rounded-full bg-sky-200/30 blur-xs pointer-events-none -z-10" />

      {/* ===================================================================== */}
      {/* TOP HEADER: MINIMAL & CLEAN                                          */}
      {/* ===================================================================== */}
      <header className="w-full max-w-4xl mx-auto px-4 pt-3 z-30 shrink-0 flex items-center justify-between gap-2">
        {/* Left: Character Badge */}
        <div className="flex items-center gap-2">
          <div className="bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border-2 border-emerald-200 shadow-md flex items-center gap-2">
            <span className="text-xl">
              {currentCharacter === 'snowman'
                ? '⛄'
                : currentCharacter === 'butterfly'
                ? '🦋'
                : '🐰'}
            </span>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest leading-none">
                {characterMode === 'guided' ? 'PRIMARY COLORS' : 'FREE COLORING'}
              </span>
              <span className="text-xs sm:text-sm font-black text-slate-900 leading-tight">
                {characterTitle} ({characterIndex + 1}/3)
              </span>
            </div>
          </div>
        </div>

        {/* Center: Audio Instruction Replay ("Listen") */}
        <button
          type="button"
          onClick={handleReplayInstruction}
          className="flex items-center gap-1.5 bg-white/95 hover:bg-emerald-50 active:scale-95 text-emerald-950 font-black px-3.5 py-2 rounded-2xl border-2 border-emerald-300 shadow-md text-xs sm:text-sm cursor-pointer transition-all"
          aria-label="Listen again"
          title="Replay voice instruction"
        >
          <Volume2 className="w-4 h-4 text-emerald-700 animate-pulse" />
          <span>Listen</span>
        </button>

        {/* Right: Quick Shuffle / Restart & Progress Star */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={startFreshGame}
            className="flex items-center gap-1.5 bg-white/95 hover:bg-emerald-50 active:scale-95 text-emerald-900 font-black px-3 py-2 rounded-2xl border-2 border-emerald-200 shadow-md text-xs cursor-pointer transition-all"
            aria-label="Restart fresh"
            title="Start fresh coloring"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Shuffle</span>
          </button>

          <div className="w-10 h-10 rounded-2xl bg-amber-400 border-2 border-amber-300 flex items-center justify-center shadow-md">
            <Star
              className={`w-5 h-5 ${
                isActivityCompleted
                  ? 'text-amber-950 fill-amber-300'
                  : 'text-amber-950 fill-amber-200'
              }`}
            />
          </div>
        </div>
      </header>

      {/* ===================================================================== */}
      {/* MAIN WORKSHEET STAGE & COLOR PALETTE SWATCHES                         */}
      {/* ===================================================================== */}
      <main
        ref={containerRef}
        className="w-full max-w-4xl mx-auto flex-1 relative px-4 py-2 flex flex-col items-center justify-center z-10"
      >
        {/* CHARACTER 2D WORKSHEET ILLUSTRATION */}
        <div className="w-full flex items-center justify-center my-auto relative">
          {currentCharacter === 'snowman' && (
            <SnowmanWorksheet
              colors={snowmanColors}
              onPartTap={handlePartTap}
              activeTargetPart={currentStep?.partKey}
              isGuided={characterMode === 'guided'}
            />
          )}

          {currentCharacter === 'butterfly' && (
            <ButterflyWorksheet
              colors={butterflyColors}
              onPartTap={handlePartTap}
              activeTargetPart={currentStep?.partKey}
              isGuided={characterMode === 'guided'}
            />
          )}

          {currentCharacter === 'bunny' && (
            <BunnyWorksheet
              colors={bunnyColors}
              onPartTap={handlePartTap}
              activeTargetPart={currentStep?.partKey}
              isGuided={characterMode === 'guided'}
            />
          )}
        </div>

        {/* =================================================================== */}
        {/* COLOR PALETTE SWATCHES (LARGE ROUND INTERACTIVE SWATCH BUTTONS)    */}
        {/* =================================================================== */}
        <div className="w-full max-w-xl mx-auto mt-2 mb-1 flex flex-col items-center z-20">
          <div className="bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-3xl border-2 border-emerald-200 shadow-lg flex items-center justify-center gap-2 sm:gap-4 flex-wrap">
            {displayedColorIds.map((cId) => {
              const def = COLOR_SWATCHES[cId];
              const isSelected = selectedColor === cId;

              return (
                <button
                  key={def.id}
                  type="button"
                  onClick={() => {
                    setSelectedColor(def.id);
                    soundManager.playPop();
                    soundManager.speak(def.name);
                  }}
                  className={`group relative flex flex-col items-center justify-center transition-transform duration-150 ease-out cursor-pointer touch-manipulation ${
                    isSelected
                      ? 'scale-110 -translate-y-1'
                      : 'hover:scale-105 active:scale-95'
                  }`}
                  aria-label={`Select ${def.name} color`}
                >
                  {/* Round Color Swatch */}
                  <div
                    className={`w-11 h-11 sm:w-13 sm:h-13 rounded-full flex items-center justify-center shadow-md transition-all duration-150 ease-out ${
                      isSelected
                        ? 'ring-4 ring-slate-900 ring-offset-2 scale-105'
                        : 'border-2 border-slate-900/20 group-hover:border-slate-900/50 group-hover:shadow-lg group-hover:brightness-105'
                    }`}
                    style={{ backgroundColor: def.hex }}
                  >
                    {isSelected && (
                      <Check className="w-6 h-6 text-white drop-shadow-md stroke-[3]" />
                    )}
                  </div>
                  {/* Color Name Label */}
                  <span
                    className="text-[10px] sm:text-xs font-black tracking-wider mt-1 uppercase transition-colors duration-150"
                    style={{ color: def.textColor }}
                  >
                    {def.name}
                  </span>
                </button>
              );
            })}

            {/* FREE MODE: "I'M DONE" BUTTON TO PROGRESS TO NEXT CHARACTER */}
            {characterMode === 'free' && (
              <button
                type="button"
                onClick={handleFinishCurrentCharacter}
                className="ml-1 sm:ml-2 flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-black px-4 py-2.5 rounded-2xl border-b-3 border-emerald-700 shadow-md text-xs sm:text-sm cursor-pointer transition-all animate-bounce"
              >
                <span>Done</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* POP FEEDBACK BADGE ("Great Job! ✨") */}
        <AnimatePresence>
          {popFeedback && (
            <motion.div
              key="pop-feedback-color"
              initial={{ scale: 0.6, opacity: 0, y: 5 }}
              animate={{ scale: 1, opacity: 1, y: -20 }}
              exit={{ scale: 1.1, opacity: 0, y: -35 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="absolute pointer-events-none z-50 flex items-center justify-center"
              style={{
                left: popFeedback.x,
                top: popFeedback.y,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div className="bg-white/95 backdrop-blur-xs text-emerald-950 font-black text-sm sm:text-base px-3.5 py-1.5 rounded-full border-2 border-emerald-400 shadow-md flex items-center gap-1.5">
                <span>{popFeedback.text}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SPARKLE PARTICLES LAYER */}
        <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden">
          {sparkles.map((p) => (
            <div
              key={p.id}
              className="absolute rounded-full pointer-events-none"
              style={{
                left: p.x,
                top: p.y,
                width: p.size,
                height: p.size,
                backgroundColor: p.color,
                opacity: p.opacity,
                boxShadow: `0 0 8px ${p.color}`,
              }}
            />
          ))}
        </div>

        {/* =================================================================== */}
        {/* COMPACT MODALS (INTRO, CHARACTER COMPLETE, ALL DONE)               */}
        {/* =================================================================== */}
        <AnimatePresence>
          {/* 1. INTRO SPLASH */}
          {activityState === 'intro' && (
            <motion.div
              key="color-intro-splash"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 border-2 border-emerald-300 shadow-lg text-center max-w-xs mx-4 z-50 flex flex-col items-center"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-100 border-2 border-emerald-300 flex items-center justify-center text-2xl mb-1.5 shadow-inner">
                🎨
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-emerald-950 uppercase tracking-tight">
                Color Fun!
              </h2>
              <p className="text-xs sm:text-sm font-extrabold text-emerald-800 mt-1">
                Color the cute snowman, butterfly, and bunny!
              </p>
            </motion.div>
          )}

          {/* 2. CHARACTER COMPLETE CELEBRATION */}
          {activityState === 'character_complete' && (
            <motion.div
              key="char-complete-splash"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 border-2 border-emerald-300 shadow-lg text-center max-w-xs mx-4 z-50 flex flex-col items-center"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-100 border-2 border-emerald-300 flex items-center justify-center text-2xl mb-1.5 shadow-inner animate-bounce">
                🎉
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-emerald-950 tracking-tight">
                {currentCharacter === 'butterfly' ? 'Beautiful!' : 'Great Job!'}
              </h3>
              <p className="text-xs sm:text-sm font-extrabold text-emerald-800 mt-1">
                Get ready for the next coloring page!
              </p>
            </motion.div>
          )}

          {/* 3. FINAL COMPLETION (SHOWS ALL 3 CHARACTERS TOGETHER + REPLAY) */}
          {activityState === 'all_done' && (
            <motion.div
              key="color-all-done"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white/95 backdrop-blur-md rounded-2xl p-5 sm:p-6 border-2 border-amber-400 shadow-xl text-center max-w-sm mx-4 z-50 flex flex-col items-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-amber-600 mb-1.5 shadow-inner">
                <Trophy className="w-7 h-7 stroke-[2.5]" />
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-amber-950 tracking-tight uppercase">
                COLOR FUN COMPLETE!
              </h2>
              <p className="text-xs sm:text-sm font-bold text-amber-800 mt-1">
                You colored all three characters beautifully!
              </p>

              {/* Showcase the 3 colored characters together */}
              <div className="flex items-center justify-center gap-3 my-3 p-2 bg-amber-50 rounded-2xl border border-amber-200 w-full">
                <div className="w-16 h-20 scale-75 transform -mx-2">
                  <SnowmanWorksheet
                    colors={snowmanColors}
                    onPartTap={() => {}}
                    isGuided={false}
                  />
                </div>
                <div className="w-16 h-20 scale-75 transform -mx-2">
                  <ButterflyWorksheet
                    colors={butterflyColors}
                    onPartTap={() => {}}
                    isGuided={false}
                  />
                </div>
                <div className="w-16 h-20 scale-75 transform -mx-2">
                  <BunnyWorksheet
                    colors={bunnyColors}
                    onPartTap={() => {}}
                    isGuided={false}
                  />
                </div>
              </div>

              {/* REPLAY BUTTON */}
              <button
                type="button"
                onClick={startFreshGame}
                className="w-full flex items-center justify-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-black px-5 py-2.5 rounded-xl border-b-3 border-emerald-700 shadow-md text-sm cursor-pointer transition-all mt-1"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Replay</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ===================================================================== */}
      {/* BOTTOM: CLEAN 3-BUTTON NAV                                            */}
      {/* ===================================================================== */}
      <footer className="w-full max-w-4xl mx-auto px-4 pb-3 z-30 shrink-0 flex flex-col items-center">
        <ActivityBottomNav
          onNavigatePrev={
            characterIndex > 0
              ? () => {
                  const prevIdx = characterIndex - 1;
                  setCharacterIndex(prevIdx);
                  const prevSteps = buildGuidedStepsForCharacter(characterList[prevIdx]);
                  setCharacterMode('guided');
                  setGuidedSteps(prevSteps);
                  setGuidedStepIndex(0);
                  setSelectedColor(null);
                  soundManager.speak(prevSteps[0].instruction);
                }
              : onNavigatePrev || onNavigateHome
          }
          onNavigateHome={onNavigateHome}
          onNavigateNext={onNavigateNext}
        />
      </footer>
    </div>
  );
};
