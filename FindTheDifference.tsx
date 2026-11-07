import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, RotateCcw, Home, Sparkles, Star as StarIcon, Check, ArrowRight, ArrowLeft, Lightbulb, Trophy } from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface FindTheDifferenceProps {
  onCollectStar: () => void;
  onNavigateHome?: () => void;
  onNavigateNext?: () => void;
  onNavigatePrev?: () => void;
  isActivityCompleted?: boolean;
}

export interface DifferenceItem {
  id: string;
  name: string;
  hint: string;
  // Bounding center coordinates in 0..500 x 0..380 SVG space
  x: number;
  y: number;
  radius: number;
  leftRender: (isFound: boolean) => React.ReactNode;
  rightRender: (isFound: boolean) => React.ReactNode;
}

export interface SceneConfig {
  id: string;
  title: string;
  environment: string;
  badgeEmoji: string;
  bgColor: string;
  frameColor: string;
  staticBackground: React.ReactNode;
  differences: DifferenceItem[];
}

// -------------------------------------------------------------
// PRE-SCHOOL SCENE DEFINITIONS WITH RICH VECTOR ARTWORK
// -------------------------------------------------------------

const SCENES: SceneConfig[] = [
  // 1. SUNNY PLAYGROUND
  {
    id: 'playground',
    title: 'Sunny Playground',
    environment: 'Outdoor Park',
    badgeEmoji: '🛝',
    bgColor: 'from-amber-100 via-sky-100 to-emerald-100',
    frameColor: 'border-emerald-400',
    staticBackground: (
      <g>
        {/* Sky & Grass */}
        <rect x="0" y="0" width="500" height="240" fill="#BAE6FD" />
        <rect x="0" y="240" width="500" height="140" fill="#86EFAC" />
        <path d="M 0 240 Q 120 220 250 240 T 500 240 L 500 380 L 0 380 Z" fill="#4ADE80" />

        {/* Tree on left */}
        <rect x="50" y="140" width="24" height="120" rx="6" fill="#92400E" />
        <circle cx="62" cy="130" r="48" fill="#15803D" />
        <circle cx="36" cy="115" r="32" fill="#16A34A" />
        <circle cx="88" cy="115" r="32" fill="#22C55E" />

        {/* Playground Slide */}
        <path d="M 330 140 L 330 260" stroke="#DC2626" strokeWidth="8" strokeLinecap="round" />
        <path d="M 360 140 L 360 260" stroke="#DC2626" strokeWidth="8" strokeLinecap="round" />
        <path d="M 330 180 L 360 180 M 330 220 L 360 220" stroke="#FBBF24" strokeWidth="6" strokeLinecap="round" />
        {/* Slide Chute */}
        <path d="M 345 140 Q 280 180 230 270" stroke="#3B82F6" strokeWidth="20" fill="none" strokeLinecap="round" />
        <path d="M 345 140 Q 280 180 230 270" stroke="#60A5FA" strokeWidth="12" fill="none" strokeLinecap="round" />

        {/* Sandbox */}
        <rect x="110" y="270" width="130" height="70" rx="16" fill="#FDE68A" stroke="#D97706" strokeWidth="4" />
        {/* Bucket */}
        <path d="M 135 295 L 140 325 L 165 325 L 170 295 Z" fill="#EC4899" />
        <path d="M 133 295 C 133 290 172 290 172 295" stroke="#BE185D" strokeWidth="3" fill="none" />

        {/* Clouds */}
        <g opacity="0.9">
          <circle cx="160" cy="60" r="22" fill="#FFFFFF" />
          <circle cx="185" cy="50" r="28" fill="#FFFFFF" />
          <circle cx="215" cy="60" r="22" fill="#FFFFFF" />
        </g>
      </g>
    ),
    differences: [
      {
        id: 'ball',
        name: 'Sandbox Ball',
        hint: 'Look near the sandbox for a colorful toy ball!',
        x: 205,
        y: 310,
        radius: 36,
        leftRender: () => (
          <g>
            {/* Red & Yellow Striped Ball */}
            <circle cx="205" cy="310" r="20" fill="#EF4444" stroke="#B91C1C" strokeWidth="2" />
            <path d="M 195 295 Q 215 310 195 325" stroke="#FDE047" strokeWidth="6" fill="none" />
            <circle cx="200" cy="305" r="4" fill="#FFFFFF" opacity="0.6" />
          </g>
        ),
        rightRender: () => (
          <g>
            {/* Blue & White Star Ball (Different Color/Pattern!) */}
            <circle cx="205" cy="310" r="20" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="2" />
            <polygon points="205,296 208,305 217,305 210,311 213,320 205,314 197,320 200,311 193,305 202,305" fill="#FDE047" />
            <circle cx="200" cy="305" r="4" fill="#FFFFFF" opacity="0.6" />
          </g>
        ),
      },
      {
        id: 'sun',
        name: 'Happy Sun',
        hint: 'Look up in the sky at the shining sun!',
        x: 430,
        y: 65,
        radius: 40,
        leftRender: () => (
          <g>
            {/* Sun with Cool Sunglasses */}
            <circle cx="430" cy="65" r="32" fill="#FBBF24" stroke="#F59E0B" strokeWidth="4" />
            {/* Sun Rays */}
            <line x1="430" y1="20" x2="430" y2="10" stroke="#F59E0B" strokeWidth="5" strokeLinecap="round" />
            <line x1="430" y1="110" x2="430" y2="120" stroke="#F59E0B" strokeWidth="5" strokeLinecap="round" />
            <line x1="385" y1="65" x2="375" y2="65" stroke="#F59E0B" strokeWidth="5" strokeLinecap="round" />
            <line x1="475" y1="65" x2="485" y2="65" stroke="#F59E0B" strokeWidth="5" strokeLinecap="round" />
            {/* Sunglasses */}
            <rect x="410" y="55" width="16" height="12" rx="4" fill="#1E293B" />
            <rect x="434" y="55" width="16" height="12" rx="4" fill="#1E293B" />
            <line x1="426" y1="60" x2="434" y2="60" stroke="#1E293B" strokeWidth="3" />
            {/* Big Smile */}
            <path d="M 418 76 Q 430 86 442 76" stroke="#9A3412" strokeWidth="3" fill="none" strokeLinecap="round" />
          </g>
        ),
        rightRender: () => (
          <g>
            {/* Sun with Friendly Eyes and Rosy Cheeks (No sunglasses!) */}
            <circle cx="430" cy="65" r="32" fill="#FBBF24" stroke="#F59E0B" strokeWidth="4" />
            {/* Sun Rays */}
            <line x1="430" y1="20" x2="430" y2="10" stroke="#F59E0B" strokeWidth="5" strokeLinecap="round" />
            <line x1="430" y1="110" x2="430" y2="120" stroke="#F59E0B" strokeWidth="5" strokeLinecap="round" />
            <line x1="385" y1="65" x2="375" y2="65" stroke="#F59E0B" strokeWidth="5" strokeLinecap="round" />
            <line x1="475" y1="65" x2="485" y2="65" stroke="#F59E0B" strokeWidth="5" strokeLinecap="round" />
            {/* Friendly Smiling Eyes */}
            <circle cx="420" cy="58" r="4" fill="#1E293B" />
            <circle cx="440" cy="58" r="4" fill="#1E293B" />
            {/* Rosy Cheeks */}
            <circle cx="414" cy="68" r="5" fill="#F87171" opacity="0.8" />
            <circle cx="446" cy="68" r="5" fill="#F87171" opacity="0.8" />
            {/* Smile with Tongue */}
            <path d="M 422 72 Q 430 84 438 72" stroke="#9A3412" strokeWidth="3" fill="#EF4444" strokeLinecap="round" />
          </g>
        ),
      },
      {
        id: 'butterfly',
        name: 'Flying Butterfly',
        hint: 'Look near the big green tree branches for a flying friend!',
        x: 105,
        y: 95,
        radius: 36,
        leftRender: () => (
          <g>
            {/* Bright Yellow & Purple Butterfly */}
            <circle cx="95" cy="90" r="10" fill="#FDE047" stroke="#CA8A04" strokeWidth="1.5" />
            <circle cx="115" cy="90" r="10" fill="#FDE047" stroke="#CA8A04" strokeWidth="1.5" />
            <circle cx="97" cy="104" r="7" fill="#A855F7" />
            <circle cx="113" cy="104" r="7" fill="#A855F7" />
            {/* Body */}
            <rect x="103" y="85" width="4" height="24" rx="2" fill="#1E293B" />
            <line x1="103" y1="85" x2="98" y2="78" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
            <line x1="107" y1="85" x2="112" y2="78" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
          </g>
        ),
        rightRender: () => (
          <g>
            {/* Pink Blossom Flower (Butterfly is replaced with a flower!) */}
            <circle cx="105" cy="95" r="7" fill="#FDE047" />
            <circle cx="105" cy="83" r="6" fill="#F472B6" />
            <circle cx="105" cy="107" r="6" fill="#F472B6" />
            <circle cx="93" cy="95" r="6" fill="#F472B6" />
            <circle cx="117" cy="95" r="6" fill="#F472B6" />
            <path d="M 105 107 Q 105 125 110 130" stroke="#15803D" strokeWidth="3" fill="none" />
          </g>
        ),
      },
    ],
  },

  // 2. COZY BEDROOM
  {
    id: 'bedroom',
    title: 'Cozy Bedroom',
    environment: 'Bed & Toy Corner',
    badgeEmoji: '🛏️',
    bgColor: 'from-indigo-100 via-purple-50 to-pink-100',
    frameColor: 'border-purple-400',
    staticBackground: (
      <g>
        {/* Wall & Floor */}
        <rect x="0" y="0" width="500" height="260" fill="#EDE9FE" />
        <rect x="0" y="260" width="500" height="120" fill="#FBCFE8" />
        {/* Floor Baseboard */}
        <rect x="0" y="252" width="500" height="10" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1" />

        {/* Bedroom Window with Night Sky */}
        <rect x="330" y="30" width="130" height="110" rx="14" fill="#1E1B4B" stroke="#A7F3D0" strokeWidth="6" />
        <path d="M 395 30 L 395 140 M 330 85 L 460 85" stroke="#A7F3D0" strokeWidth="4" />
        {/* Crescent Moon in Window */}
        <path d="M 370 50 A 18 18 0 0 0 355 75 A 22 22 0 1 1 370 50 Z" fill="#FDE047" />

        {/* Big Cozy Bed */}
        <rect x="40" y="160" width="220" height="14" rx="4" fill="#7C3AED" />
        <rect x="40" y="174" width="220" height="90" rx="10" fill="#818CF8" stroke="#4F46E5" strokeWidth="3" />
        {/* Blanket Fold */}
        <path d="M 40 210 Q 150 200 260 210 L 260 264 L 40 264 Z" fill="#6366F1" />
        {/* Bed Headboard */}
        <rect x="30" y="110" width="20" height="160" rx="8" fill="#6D28D9" />
        <rect x="250" y="150" width="16" height="120" rx="8" fill="#6D28D9" />

        {/* Rug on floor */}
        <ellipse cx="370" cy="320" rx="80" ry="34" fill="#DDD6FE" stroke="#C4B5FD" strokeWidth="3" />
      </g>
    ),
    differences: [
      {
        id: 'clock',
        name: 'Wall Clock',
        hint: 'Check the round clock hanging on the wall!',
        x: 180,
        y: 65,
        radius: 36,
        leftRender: () => (
          <g>
            {/* Orange Clock showing 3 o clock */}
            <circle cx="180" cy="65" r="26" fill="#FFEDD5" stroke="#EA580C" strokeWidth="5" />
            <circle cx="180" cy="65" r="3" fill="#1E293B" />
            <line x1="180" y1="65" x2="180" y2="48" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="180" y1="65" x2="196" y2="65" stroke="#EA580C" strokeWidth="3.5" strokeLinecap="round" />
          </g>
        ),
        rightRender: () => (
          <g>
            {/* Teal Clock showing 8 o clock (Different Color and Time!) */}
            <circle cx="180" cy="65" r="26" fill="#CCFBF1" stroke="#0D9488" strokeWidth="5" />
            <circle cx="180" cy="65" r="3" fill="#1E293B" />
            <line x1="180" y1="65" x2="180" y2="48" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="180" y1="65" x2="167" y2="76" stroke="#0D9488" strokeWidth="3.5" strokeLinecap="round" />
          </g>
        ),
      },
      {
        id: 'teddy',
        name: 'Bed Pillow/Teddy',
        hint: 'Look on the cozy bed near the pillow!',
        x: 105,
        y: 160,
        radius: 38,
        leftRender: () => (
          <g>
            {/* Pillow with Teddy Bear */}
            <rect x="60" y="145" width="60" height="35" rx="10" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
            {/* Teddy Head */}
            <circle cx="110" cy="150" r="16" fill="#D97706" />
            <circle cx="98" cy="138" r="6" fill="#B45309" />
            <circle cx="122" cy="138" r="6" fill="#B45309" />
            <ellipse cx="110" cy="154" rx="7" ry="5" fill="#FDE68A" />
            <circle cx="110" cy="152" r="2.5" fill="#1E293B" />
            {/* Red Bow Tie on Teddy */}
            <polygon points="105,164 115,164 110,167" fill="#EF4444" />
            <polygon points="105,170 115,170 110,167" fill="#EF4444" />
          </g>
        ),
        rightRender: () => (
          <g>
            {/* Pillow with Toy Robot (Teddy is replaced with a robot!) */}
            <rect x="60" y="145" width="60" height="35" rx="10" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
            {/* Robot Head */}
            <rect x="96" y="136" width="28" height="24" rx="4" fill="#38BDF8" stroke="#0284C7" strokeWidth="2" />
            <circle cx="103" cy="144" r="3" fill="#FDE047" />
            <circle cx="117" cy="144" r="3" fill="#FDE047" />
            <rect x="104" y="152" width="12" height="3" fill="#1E293B" />
            {/* Antenna */}
            <line x1="110" y1="136" x2="110" y2="128" stroke="#0284C7" strokeWidth="2" />
            <circle cx="110" cy="126" r="3" fill="#EF4444" />
          </g>
        ),
      },
      {
        id: 'floor_toy',
        name: 'Floor Toy Car',
        hint: 'Look down on the round floor rug for a toy!',
        x: 370,
        y: 310,
        radius: 36,
        leftRender: () => (
          <g>
            {/* Red Race Car on Rug */}
            <rect x="345" y="300" width="50" height="18" rx="8" fill="#EF4444" />
            <rect x="358" y="290" width="24" height="14" rx="4" fill="#FCA5A5" />
            {/* Wheels */}
            <circle cx="355" cy="320" r="7" fill="#1E293B" stroke="#94A3B8" strokeWidth="2" />
            <circle cx="385" cy="320" r="7" fill="#1E293B" stroke="#94A3B8" strokeWidth="2" />
          </g>
        ),
        rightRender: () => (
          <g>
            {/* Yellow Rubber Duck on Rug (Car is replaced with a duck!) */}
            <circle cx="370" cy="305" r="14" fill="#FDE047" stroke="#CA8A04" strokeWidth="1.5" />
            <circle cx="380" cy="296" r="9" fill="#FDE047" stroke="#CA8A04" strokeWidth="1.5" />
            <polygon points="388,296 397,298 388,302" fill="#F97316" />
            <circle cx="382" cy="294" r="2" fill="#1E293B" />
            {/* Water splash sparkles */}
            <circle cx="354" cy="306" r="3" fill="#60A5FA" opacity="0.8" />
          </g>
        ),
      },
    ],
  },

  // 3. FLOWER GARDEN
  {
    id: 'garden',
    title: 'Flower Garden',
    environment: 'Spring Nature',
    badgeEmoji: '🌸',
    bgColor: 'from-teal-100 via-emerald-50 to-yellow-100',
    frameColor: 'border-teal-400',
    staticBackground: (
      <g>
        {/* Sky and Rolling Green Hills */}
        <rect x="0" y="0" width="500" height="200" fill="#E0F2FE" />
        <path d="M 0 200 Q 150 160 300 200 T 500 180 L 500 380 L 0 380 Z" fill="#BBF7D0" />
        <path d="M 0 240 Q 200 210 380 250 T 500 240 L 500 380 L 0 380 Z" fill="#86EFAC" />

        {/* White Picket Fence */}
        <g opacity="0.9">
          {[40, 80, 120, 160, 200, 240, 280, 320, 360, 400, 440].map((fx, i) => (
            <polygon key={i} points={`${fx},180 ${fx + 8},165 ${fx + 16},180 ${fx + 16},240 ${fx},240`} fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
          ))}
          <rect x="30" y="195" width="430" height="8" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
          <rect x="30" y="220" width="430" height="8" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
        </g>

        {/* Flowers on left */}
        <circle cx="80" cy="300" r="14" fill="#F43F5E" />
        <circle cx="80" cy="300" r="6" fill="#FDE047" />
        <path d="M 80 314 L 80 350" stroke="#15803D" strokeWidth="4" />

        <circle cx="140" cy="320" r="12" fill="#8B5CF6" />
        <circle cx="140" cy="320" r="5" fill="#FFFFFF" />
        <path d="M 140 332 L 140 360" stroke="#15803D" strokeWidth="3" />
      </g>
    ),
    differences: [
      {
        id: 'watering_can',
        name: 'Watering Can',
        hint: 'Look near the garden fence for the watering can!',
        x: 390,
        y: 290,
        radius: 38,
        leftRender: () => (
          <g>
            {/* Green Watering Can with Water Drops */}
            <rect x="365" y="275" width="45" height="36" rx="8" fill="#10B981" stroke="#047857" strokeWidth="2.5" />
            <path d="M 410 280 L 435 265 L 438 273 L 410 292 Z" fill="#059669" />
            <circle cx="438" cy="269" r="6" fill="#34D399" />
            {/* Handle */}
            <path d="M 365 285 C 345 285 345 310 365 310" stroke="#047857" strokeWidth="5" fill="none" />
            {/* Water droplets */}
            <circle cx="446" cy="280" r="3" fill="#38BDF8" />
            <circle cx="452" cy="292" r="3.5" fill="#38BDF8" />
          </g>
        ),
        rightRender: () => (
          <g>
            {/* Orange Watering Can (Different Color, No Water Drops!) */}
            <rect x="365" y="275" width="45" height="36" rx="8" fill="#F97316" stroke="#C2410C" strokeWidth="2.5" />
            <path d="M 410 280 L 435 265 L 438 273 L 410 292 Z" fill="#EA580C" />
            <circle cx="438" cy="269" r="6" fill="#FB923C" />
            {/* Handle */}
            <path d="M 365 285 C 345 285 345 310 365 310" stroke="#C2410C" strokeWidth="5" fill="none" />
          </g>
        ),
      },
      {
        id: 'center_flower',
        name: 'Giant Sunflower',
        hint: 'Look in the middle of the garden bed for a flower!',
        x: 250,
        y: 280,
        radius: 38,
        leftRender: () => (
          <g>
            {/* Big Sunflower with smiling face */}
            <circle cx="250" cy="270" r="24" fill="#F59E0B" />
            <circle cx="250" cy="270" r="15" fill="#78350F" />
            {/* Petals */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((ang, i) => (
              <circle
                key={i}
                cx={250 + 24 * Math.cos((ang * Math.PI) / 180)}
                cy={270 + 24 * Math.sin((ang * Math.PI) / 180)}
                r="7"
                fill="#FDE047"
              />
            ))}
            <path d="M 250 294 L 250 360" stroke="#15803D" strokeWidth="6" />
            <path d="M 250 325 Q 275 315 280 330 Q 260 340 250 330" fill="#22C55E" />
          </g>
        ),
        rightRender: () => (
          <g>
            {/* Red Tulip with Leaves (Different flower type!) */}
            <path d="M 235 255 Q 235 285 250 295 Q 265 285 265 255 Q 255 270 250 250 Q 245 270 235 255 Z" fill="#EF4444" stroke="#DC2626" strokeWidth="2" />
            <path d="M 250 294 L 250 360" stroke="#15803D" strokeWidth="6" />
            <path d="M 250 325 Q 225 315 220 330 Q 240 340 250 330" fill="#22C55E" />
          </g>
        ),
      },
      {
        id: 'snail',
        name: 'Friendly Snail',
        hint: 'Look down in the grass for a slow-crawling creature!',
        x: 180,
        y: 335,
        radius: 34,
        leftRender: () => (
          <g>
            {/* Pink Snail with Swirl Shell */}
            <circle cx="175" cy="335" r="14" fill="#EC4899" stroke="#DB2777" strokeWidth="2" />
            <path d="M 175 330 A 6 6 0 1 1 170 340" stroke="#BE185D" strokeWidth="2" fill="none" />
            {/* Foot */}
            <path d="M 160 345 Q 185 348 200 345 Q 205 338 200 335 Q 185 340 160 345 Z" fill="#FDE68A" />
            {/* Antennas */}
            <circle cx="198" cy="330" r="2" fill="#1E293B" />
          </g>
        ),
        rightRender: () => (
          <g>
            {/* Red Ladybug with Dots (Snail is replaced with a ladybug!) */}
            <ellipse cx="180" cy="340" rx="14" ry="10" fill="#EF4444" stroke="#991B1B" strokeWidth="2" />
            <circle cx="192" cy="340" r="5" fill="#1E293B" />
            {/* Black spots */}
            <circle cx="174" cy="336" r="2.5" fill="#1E293B" />
            <circle cx="178" cy="344" r="2.5" fill="#1E293B" />
            <circle cx="184" cy="337" r="2.5" fill="#1E293B" />
          </g>
        ),
      },
    ],
  },

  // 4. CLASSROOM ART TABLE
  {
    id: 'classroom',
    title: 'Classroom Art Table',
    environment: 'School Fun',
    badgeEmoji: '🎨',
    bgColor: 'from-orange-100 via-amber-50 to-blue-100',
    frameColor: 'border-orange-400',
    staticBackground: (
      <g>
        {/* Wall & Chalkboard */}
        <rect x="0" y="0" width="500" height="230" fill="#FEF3C7" />
        <rect x="0" y="230" width="500" height="150" fill="#E2E8F0" />

        {/* Chalkboard with ABC */}
        <rect x="160" y="25" width="180" height="100" rx="8" fill="#14532D" stroke="#92400E" strokeWidth="8" />
        <text x="185" y="85" fill="#FFFFFF" fontSize="40" fontWeight="900" fontFamily="sans-serif">
          ABC
        </text>

        {/* Wooden Art Table */}
        <rect x="40" y="200" width="420" height="24" rx="6" fill="#B45309" />
        <rect x="60" y="224" width="20" height="130" fill="#78350F" />
        <rect x="420" y="224" width="20" height="130" fill="#78350F" />

        {/* Sheet of Paper on table */}
        <rect x="70" y="170" width="90" height="50" rx="4" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" transform="rotate(-5 115 195)" />
      </g>
    ),
    differences: [
      {
        id: 'crayons',
        name: 'Crayon Holder',
        hint: 'Look on the table for the cup of colorful crayons!',
        x: 380,
        y: 175,
        radius: 36,
        leftRender: () => (
          <g>
            {/* Yellow Cup with 4 colorful crayons */}
            <rect x="365" y="160" width="32" height="38" rx="6" fill="#FDE047" stroke="#CA8A04" strokeWidth="2" />
            <polygon points="368,140 372,160 366,160" fill="#EF4444" />
            <polygon points="377,135 381,160 374,160" fill="#3B82F6" />
            <polygon points="386,138 390,160 383,160" fill="#10B981" />
            <polygon points="393,142 396,160 391,160" fill="#A855F7" />
          </g>
        ),
        rightRender: () => (
          <g>
            {/* Blue Cup with Paint Brushes (Crayons replaced with brushes!) */}
            <rect x="365" y="160" width="32" height="38" rx="6" fill="#38BDF8" stroke="#0284C7" strokeWidth="2" />
            {/* Brush 1 */}
            <rect x="372" y="138" width="4" height="24" fill="#92400E" />
            <ellipse cx="374" cy="134" rx="4" ry="7" fill="#EF4444" />
            {/* Brush 2 */}
            <rect x="384" y="132" width="4" height="30" fill="#92400E" />
            <ellipse cx="386" cy="128" rx="4" ry="7" fill="#F59E0B" />
          </g>
        ),
      },
      {
        id: 'drawing',
        name: 'Paper Drawing',
        hint: 'Check the drawing on the white paper sheet!',
        x: 115,
        y: 190,
        radius: 36,
        leftRender: () => (
          <g>
            {/* Golden Star Drawn on Paper */}
            <polygon points="115,175 119,186 130,186 121,193 124,204 115,197 106,204 109,193 100,186 111,186" fill="#F59E0B" stroke="#D97706" strokeWidth="1" />
          </g>
        ),
        rightRender: () => (
          <g>
            {/* Red Heart Drawn on Paper (Star replaced with Heart!) */}
            <path d="M 115 183 A 6 6 0 0 1 127 183 Q 127 195 115 204 Q 103 195 103 183 A 6 6 0 0 1 115 183 Z" fill="#EF4444" stroke="#DC2626" strokeWidth="1" />
          </g>
        ),
      },
      {
        id: 'apple',
        name: 'Desk Fruit',
        hint: 'Look near the teacher chalkboard for a yummy fruit!',
        x: 250,
        y: 175,
        radius: 36,
        leftRender: () => (
          <g>
            {/* Red Apple with Green Leaf */}
            <circle cx="250" cy="180" r="16" fill="#EF4444" stroke="#B91C1C" strokeWidth="1.5" />
            <path d="M 250 164 Q 252 155 256 154" stroke="#78350F" strokeWidth="3" fill="none" />
            <ellipse cx="260" cy="158" rx="6" ry="3" fill="#22C55E" transform="rotate(-20 260 158)" />
          </g>
        ),
        rightRender: () => (
          <g>
            {/* Yellow Banana (Apple replaced with banana!) */}
            <path d="M 238 185 Q 250 195 264 175 Q 250 182 238 185 Z" fill="#FDE047" stroke="#CA8A04" strokeWidth="2" />
            <circle cx="237" cy="185" r="2" fill="#78350F" />
          </g>
        ),
      },
    ],
  },

  // 5. SUNNY BEACH DAY
  {
    id: 'beach',
    title: 'Sunny Beach Day',
    environment: 'Ocean Shore',
    badgeEmoji: '🏖️',
    bgColor: 'from-sky-100 via-blue-50 to-amber-100',
    frameColor: 'border-sky-400',
    staticBackground: (
      <g>
        {/* Ocean & Sand */}
        <rect x="0" y="0" width="500" height="180" fill="#7DD3FC" />
        <path d="M 0 180 Q 120 160 250 180 T 500 170 L 500 380 L 0 380 Z" fill="#FDE68A" />
        <path d="M 0 210 Q 180 190 350 220 T 500 210 L 500 380 L 0 380 Z" fill="#FCD34D" />

        {/* Ocean Waves */}
        <path d="M 0 165 Q 40 155 80 165 T 160 165 T 240 165 T 320 165 T 400 165 T 480 165" stroke="#FFFFFF" strokeWidth="4" fill="none" opacity="0.8" />

        {/* Beach Umbrella */}
        <path d="M 120 120 C 70 120 60 180 120 180 C 180 180 170 120 120 120 Z" fill="#EF4444" />
        <path d="M 100 125 C 70 140 70 170 90 178 L 120 120 Z" fill="#FFFFFF" />
        <path d="M 140 125 C 170 140 170 170 150 178 L 120 120 Z" fill="#FFFFFF" />
        <line x1="120" y1="120" x2="120" y2="270" stroke="#92400E" strokeWidth="5" />
      </g>
    ),
    differences: [
      {
        id: 'sailboat',
        name: 'Sailboat',
        hint: 'Look out on the blue ocean waves for a boat!',
        x: 380,
        y: 110,
        radius: 40,
        leftRender: () => (
          <g>
            {/* White Hull Boat with Red Sail */}
            <path d="M 355 125 L 405 125 L 395 140 L 365 140 Z" fill="#FFFFFF" stroke="#0284C7" strokeWidth="2" />
            <line x1="380" y1="80" x2="380" y2="125" stroke="#78350F" strokeWidth="3" />
            <polygon points="380,82 402,120 380,120" fill="#EF4444" />
            <polygon points="378,90 362,120 378,120" fill="#60A5FA" />
          </g>
        ),
        rightRender: () => (
          <g>
            {/* Yellow Hull Boat with Green/Yellow Sail (Different Colors!) */}
            <path d="M 355 125 L 405 125 L 395 140 L 365 140 Z" fill="#FDE047" stroke="#CA8A04" strokeWidth="2" />
            <line x1="380" y1="80" x2="380" y2="125" stroke="#78350F" strokeWidth="3" />
            <polygon points="380,82 402,120 380,120" fill="#10B981" />
            <polygon points="378,90 362,120 378,120" fill="#F59E0B" />
          </g>
        ),
      },
      {
        id: 'sandcastle',
        name: 'Sandcastle Flag',
        hint: 'Check the top of the big sandcastle on the beach!',
        x: 260,
        y: 250,
        radius: 38,
        leftRender: () => (
          <g>
            {/* Sandcastle with RED Flag */}
            <rect x="230" y="240" width="60" height="45" rx="6" fill="#F59E0B" stroke="#D97706" strokeWidth="2" />
            <rect x="245" y="215" width="30" height="30" rx="4" fill="#F59E0B" stroke="#D97706" strokeWidth="2" />
            {/* Flagpole & Red Triangular Flag */}
            <line x1="260" y1="215" x2="260" y2="185" stroke="#1E293B" strokeWidth="2" />
            <polygon points="260,185 285,195 260,205" fill="#EF4444" />
          </g>
        ),
        rightRender: () => (
          <g>
            {/* Sandcastle with BLUE STAR Flag (Flag replaced with Blue Star!) */}
            <rect x="230" y="240" width="60" height="45" rx="6" fill="#F59E0B" stroke="#D97706" strokeWidth="2" />
            <rect x="245" y="215" width="30" height="30" rx="4" fill="#F59E0B" stroke="#D97706" strokeWidth="2" />
            {/* Flagpole & Blue Star */}
            <line x1="260" y1="215" x2="260" y2="185" stroke="#1E293B" strokeWidth="2" />
            <circle cx="260" cy="185" r="10" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="1.5" />
            <polygon points="260,178 262,183 268,183 263,187 265,193 260,189 255,193 257,187 252,183 258,183" fill="#FDE047" />
          </g>
        ),
      },
      {
        id: 'starfish',
        name: 'Beach Starfish',
        hint: 'Look down in the warm yellow sand for a sea friend!',
        x: 390,
        y: 320,
        radius: 36,
        leftRender: () => (
          <g>
            {/* Orange Starfish */}
            <polygon points="390,298 396,314 412,314 399,324 404,340 390,330 376,340 381,324 368,314 384,314" fill="#F97316" stroke="#EA580C" strokeWidth="2" />
            <circle cx="390" cy="320" r="3" fill="#FFFFFF" />
          </g>
        ),
        rightRender: () => (
          <g>
            {/* Pink Seashell (Starfish replaced with seashell!) */}
            <path d="M 375 320 C 375 300 405 300 405 320 L 390 335 Z" fill="#F472B6" stroke="#DB2777" strokeWidth="2" />
            <line x1="390" y1="305" x2="390" y2="330" stroke="#DB2777" strokeWidth="2" />
            <line x1="382" y1="310" x2="390" y2="330" stroke="#DB2777" strokeWidth="2" />
            <line x1="398" y1="310" x2="390" y2="330" stroke="#DB2777" strokeWidth="2" />
          </g>
        ),
      },
    ],
  },
];

export const FindTheDifference: React.FC<FindTheDifferenceProps> = ({
  onCollectStar,
  onNavigateHome,
  onNavigateNext,
  onNavigatePrev,
  isActivityCompleted,
}) => {
  // Difficulty Level: 1 = 1 difference, 2 = 2 differences, 3 = 3 differences
  const [level, setLevel] = useState<number>(1);
  const [currentSceneIdx, setCurrentSceneIdx] = useState<number>(0);
  const [foundIds, setFoundIds] = useState<Set<string>>(new Set());
  const [activeHintId, setActiveHintId] = useState<string | null>(null);
  const [ripplePos, setRipplePos] = useState<{ x: number; y: number; side: 'left' | 'right' } | null>(null);
  const [isRoundFinished, setIsRoundFinished] = useState<boolean>(false);
  const [completedLevels, setCompletedLevels] = useState<Set<number>>(new Set());

  const currentScene = SCENES[currentSceneIdx] || SCENES[0];
  
  // Total differences active in current round based on level
  const activeDifferences = currentScene.differences.slice(0, Math.min(level, currentScene.differences.length));
  const totalDifferencesInRound = activeDifferences.length;
  const remainingCount = totalDifferencesInRound - foundIds.size;

  // Speak initial instruction
  useEffect(() => {
    soundManager.speak('Can you find the difference?');
  }, [currentSceneIdx, level]);

  const handleSpeakInstruction = () => {
    soundManager.speak('Can you find the difference?');
  };

  // Switch to a new distinct scene for Replay or Shuffle
  const handleShuffleOrReplay = useCallback(() => {
    soundManager.playPop();
    setFoundIds(new Set());
    setIsRoundFinished(false);
    setActiveHintId(null);
    setRipplePos(null);

    // Pick a DIFFERENT scene index
    let nextIdx = Math.floor(Math.random() * SCENES.length);
    if (nextIdx === currentSceneIdx) {
      nextIdx = (currentSceneIdx + 1) % SCENES.length;
    }
    setCurrentSceneIdx(nextIdx);
    soundManager.speak('Can you find the difference?');
  }, [currentSceneIdx]);

  // Click on SVG canvas (Left or Right image)
  const handleSvgClick = (
    e: React.MouseEvent<SVGSVGElement>,
    side: 'left' | 'right'
  ) => {
    if (isRoundFinished) return;

    const svgRect = e.currentTarget.getBoundingClientRect();
    const clickX = ((e.clientX - svgRect.left) / svgRect.width) * 500;
    const clickY = ((e.clientY - svgRect.top) / svgRect.height) * 380;

    // Check if clicked near any active difference
    let matchedDiff: DifferenceItem | null = null;
    for (const diff of activeDifferences) {
      if (foundIds.has(diff.id)) continue;
      const dist = Math.hypot(clickX - diff.x, clickY - diff.y);
      if (dist <= diff.radius + 15) {
        matchedDiff = diff;
        break;
      }
    }

    if (matchedDiff) {
      // Correct difference found!
      const newFound = new Set(foundIds).add(matchedDiff.id);
      setFoundIds(newFound);
      setActiveHintId(null);
      soundManager.playSuccess();
      soundManager.playStarCatch();
      soundManager.speak(`Great job! You found the ${matchedDiff.name}!`);

      if (newFound.size >= totalDifferencesInRound) {
        // Round Complete!
        setTimeout(() => {
          setIsRoundFinished(true);
          setCompletedLevels((prev) => new Set(prev).add(level));
          onCollectStar();
          soundManager.playCelebration();
          soundManager.speak('Awesome! You found all the differences!');
        }, 800);
      }
    } else {
      // Gentle non-punishing feedback for clicking outside
      soundManager.playPop();
      setRipplePos({ x: clickX, y: clickY, side });
      soundManager.speak('Try again! Look closely!');
      setTimeout(() => setRipplePos(null), 800);
    }
  };

  // Provide a friendly hint for remaining differences
  const handleGiveHint = () => {
    const undiscovered = activeDifferences.find((d) => !foundIds.has(d.id));
    if (undiscovered) {
      setActiveHintId(undiscovered.id);
      soundManager.playPop();
      soundManager.speak(undiscovered.hint);
      setTimeout(() => setActiveHintId(null), 3500);
    }
  };

  const handleNextRound = () => {
    soundManager.playPop();
    setFoundIds(new Set());
    setIsRoundFinished(false);
    setActiveHintId(null);

    // If level < 3, optionally progress level or go to next scene
    if (level < 3) {
      setLevel((prev) => prev + 1);
    }
    setCurrentSceneIdx((prev) => (prev + 1) % SCENES.length);
  };

  return (
    <div
      id="find-the-difference-activity"
      className="w-full max-w-5xl mx-auto flex flex-col items-center justify-between p-2 sm:p-4 min-h-[calc(100vh-120px)] select-none relative overflow-hidden"
    >
      {/* Background Ambience */}
      <div className={`absolute inset-0 bg-gradient-to-b ${currentScene.bgColor} -z-20 transition-colors duration-500`} />
      <div className="absolute top-2 left-6 text-4xl sm:text-5xl animate-spin-slow pointer-events-none -z-10">🔍</div>
      <div className="absolute top-4 right-8 text-4xl sm:text-5xl opacity-80 animate-pulse pointer-events-none -z-10">✨</div>
      <div className="absolute top-12 left-1/3 text-3xl opacity-70 animate-bounce delay-150 pointer-events-none -z-10">🌟</div>

      {/* 1. TOP HEADER & LEVEL / SCENE SELECTOR */}
      <div className="w-full max-w-4xl bg-white/95 backdrop-blur-md rounded-3xl border-4 border-amber-300 shadow-lg p-3 sm:p-4 mb-3 flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 border-2 border-white flex items-center justify-center text-2xl text-white shadow-md">
              {currentScene.badgeEmoji}
            </div>
            <div className="text-left">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight">
                Find The Difference
              </h1>
              <p className="text-xs sm:text-sm font-bold text-amber-800">
                {currentScene.title} • {currentScene.environment}
              </p>
            </div>
          </div>

          {/* Controls: Voice Instruction & Hint & Replay */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              id="voice-instruction-btn"
              type="button"
              onClick={handleSpeakInstruction}
              className="bg-amber-400 hover:bg-amber-500 active:scale-95 text-amber-950 px-3 py-1.5 rounded-2xl border-b-4 border-amber-600 shadow font-black text-xs sm:text-sm flex items-center gap-1 cursor-pointer transition-all uppercase"
              title="Hear Instruction"
            >
              <Volume2 className="w-4 h-4" />
              <span>Hear</span>
            </button>

            <button
              id="hint-btn"
              type="button"
              onClick={handleGiveHint}
              className="bg-sky-400 hover:bg-sky-500 active:scale-95 text-sky-950 px-3 py-1.5 rounded-2xl border-b-4 border-sky-600 shadow font-black text-xs sm:text-sm flex items-center gap-1 cursor-pointer transition-all uppercase"
              title="Get Clue"
            >
              <Lightbulb className="w-4 h-4" />
              <span>Clue</span>
            </button>

            <button
              id="replay-shuffle-btn"
              type="button"
              onClick={handleShuffleOrReplay}
              className="bg-purple-500 hover:bg-purple-600 active:scale-95 text-white px-3 py-1.5 rounded-2xl border-b-4 border-purple-800 shadow font-black text-xs sm:text-sm flex items-center gap-1 cursor-pointer transition-all uppercase"
              title="Shuffle & Replay New Scene"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Replay</span>
            </button>
          </div>
        </div>

        {/* Level Switcher & Difference Counter Pill */}
        <div className="flex items-center justify-between gap-2 px-1 flex-wrap">
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((lvlNum) => {
              const isActive = lvlNum === level;
              const isDone = completedLevels.has(lvlNum);
              return (
                <button
                  key={lvlNum}
                  type="button"
                  onClick={() => {
                    soundManager.playPop();
                    setLevel(lvlNum);
                    setFoundIds(new Set());
                    setIsRoundFinished(false);
                  }}
                  className={`px-3 py-1 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-1 transition-all cursor-pointer border-b-4 ${
                    isActive
                      ? 'bg-rose-500 text-white border-rose-700 shadow-md scale-105 ring-2 ring-rose-300'
                      : isDone
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200'
                      : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                  }`}
                >
                  <span>Level {lvlNum}</span>
                  <span className="text-[10px] opacity-80">({lvlNum} Spot{lvlNum > 1 ? 's' : ''})</span>
                  {isDone && <Check className="w-3.5 h-3.5 text-emerald-600 ml-0.5" />}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-1.5 bg-amber-100 border border-amber-300 px-3 py-1 rounded-full">
            <Sparkles className="w-4 h-4 text-amber-600 animate-spin-slow" />
            <span className="text-xs font-black text-amber-900 uppercase">
              {foundIds.size} / {totalDifferencesInRound} Found
            </span>
          </div>
        </div>
      </div>

      {/* 2. MAIN ACTIVITY: TWO SIDE-BY-SIDE PICTURES */}
      <div className="w-full max-w-4xl flex-1 flex flex-col items-center justify-center gap-3 my-1">
        {/* Instruction Banner */}
        <div className="w-full max-w-2xl bg-white/95 rounded-2xl p-2.5 shadow-sm border-2 border-amber-200 text-center flex items-center justify-center gap-2">
          <span className="text-lg">👀</span>
          <h2 className="text-sm sm:text-base font-black text-slate-800 uppercase tracking-tight">
            Can you find the difference? Tap the different spot on either picture!
          </h2>
        </div>

        {/* Two Large Picture Frames Side-by-Side */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 max-w-4xl">
          {/* LEFT PICTURE */}
          <div className="flex flex-col items-center">
            <div className="bg-amber-400 text-amber-950 font-black text-xs px-3 py-0.5 rounded-t-xl uppercase border-2 border-b-0 border-amber-500 shadow-xs">
              Left Picture
            </div>
            <div
              className={`w-full relative rounded-3xl overflow-hidden shadow-xl border-4 ${currentScene.frameColor} bg-white transition-transform cursor-pointer active:scale-[0.99]`}
            >
              <svg
                viewBox="0 0 500 380"
                className="w-full h-auto block select-none"
                onClick={(e) => handleSvgClick(e, 'left')}
              >
                {/* Static Background Art */}
                {currentScene.staticBackground}

                {/* Left Variants of Differences */}
                {activeDifferences.map((diff) => {
                  const isFound = foundIds.has(diff.id);
                  const isHintActive = activeHintId === diff.id;

                  return (
                    <g key={diff.id}>
                      {diff.leftRender(isFound)}

                      {/* Clue Pulsing Ring */}
                      {isHintActive && !isFound && (
                        <circle
                          cx={diff.x}
                          cy={diff.y}
                          r={diff.radius + 10}
                          fill="#38BDF8"
                          fillOpacity="0.25"
                          stroke="#0284C7"
                          strokeWidth="4"
                          strokeDasharray="8 6"
                          className="animate-pulse"
                        />
                      )}

                      {/* Found Golden Glowing Circle & Check */}
                      {isFound && (
                        <g>
                          <circle
                            cx={diff.x}
                            cy={diff.y}
                            r={diff.radius + 6}
                            fill="#10B981"
                            fillOpacity="0.2"
                            stroke="#059669"
                            strokeWidth="5"
                          />
                          <circle cx={diff.x} cy={diff.y} r={diff.radius + 6} stroke="#FDE047" strokeWidth="2" strokeDasharray="6 4" fill="none" />
                          <circle cx={diff.x + diff.radius} cy={diff.y - diff.radius + 4} r="14" fill="#059669" stroke="#FFFFFF" strokeWidth="2.5" />
                          <path
                            d={`M ${diff.x + diff.radius - 6} ${diff.y - diff.radius + 4} L ${diff.x + diff.radius - 2} ${diff.y - diff.radius + 8} L ${diff.x + diff.radius + 6} ${diff.y - diff.radius - 1}`}
                            stroke="#FFFFFF"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            fill="none"
                          />
                        </g>
                      )}
                    </g>
                  );
                })}

                {/* Soft Ripple Feedback on Wrong Tap */}
                {ripplePos && ripplePos.side === 'left' && (
                  <circle
                    cx={ripplePos.x}
                    cy={ripplePos.y}
                    r="24"
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth="4"
                    opacity="0.8"
                    className="animate-ping"
                  />
                )}
              </svg>
            </div>
          </div>

          {/* RIGHT PICTURE */}
          <div className="flex flex-col items-center">
            <div className="bg-rose-400 text-rose-950 font-black text-xs px-3 py-0.5 rounded-t-xl uppercase border-2 border-b-0 border-rose-500 shadow-xs">
              Right Picture
            </div>
            <div
              className={`w-full relative rounded-3xl overflow-hidden shadow-xl border-4 ${currentScene.frameColor} bg-white transition-transform cursor-pointer active:scale-[0.99]`}
            >
              <svg
                viewBox="0 0 500 380"
                className="w-full h-auto block select-none"
                onClick={(e) => handleSvgClick(e, 'right')}
              >
                {/* Static Background Art */}
                {currentScene.staticBackground}

                {/* Right Variants of Differences */}
                {activeDifferences.map((diff) => {
                  const isFound = foundIds.has(diff.id);
                  const isHintActive = activeHintId === diff.id;

                  return (
                    <g key={diff.id}>
                      {diff.rightRender(isFound)}

                      {/* Clue Pulsing Ring */}
                      {isHintActive && !isFound && (
                        <circle
                          cx={diff.x}
                          cy={diff.y}
                          r={diff.radius + 10}
                          fill="#38BDF8"
                          fillOpacity="0.25"
                          stroke="#0284C7"
                          strokeWidth="4"
                          strokeDasharray="8 6"
                          className="animate-pulse"
                        />
                      )}

                      {/* Found Golden Glowing Circle & Check */}
                      {isFound && (
                        <g>
                          <circle
                            cx={diff.x}
                            cy={diff.y}
                            r={diff.radius + 6}
                            fill="#10B981"
                            fillOpacity="0.2"
                            stroke="#059669"
                            strokeWidth="5"
                          />
                          <circle cx={diff.x} cy={diff.y} r={diff.radius + 6} stroke="#FDE047" strokeWidth="2" strokeDasharray="6 4" fill="none" />
                          <circle cx={diff.x + diff.radius} cy={diff.y - diff.radius + 4} r="14" fill="#059669" stroke="#FFFFFF" strokeWidth="2.5" />
                          <path
                            d={`M ${diff.x + diff.radius - 6} ${diff.y - diff.radius + 4} L ${diff.x + diff.radius - 2} ${diff.y - diff.radius + 8} L ${diff.x + diff.radius + 6} ${diff.y - diff.radius - 1}`}
                            stroke="#FFFFFF"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            fill="none"
                          />
                        </g>
                      )}
                    </g>
                  );
                })}

                {/* Soft Ripple Feedback on Wrong Tap */}
                {ripplePos && ripplePos.side === 'right' && (
                  <circle
                    cx={ripplePos.x}
                    cy={ripplePos.y}
                    r="24"
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth="4"
                    opacity="0.8"
                    className="animate-ping"
                  />
                )}
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* 3. ROUND COMPLETION MODAL */}
      <AnimatePresence>
        {isRoundFinished && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              className="bg-white rounded-3xl border-8 border-amber-400 shadow-2xl p-6 sm:p-8 max-w-md w-full flex flex-col items-center text-center relative overflow-hidden"
            >
              <div className="text-6xl sm:text-7xl mb-3 animate-bounce">🎉</div>
              <div className="flex gap-2 mb-3">
                {[...Array(totalDifferencesInRound)].map((_, i) => (
                  <StarIcon key={i} className="w-8 h-8 text-amber-400 fill-amber-400 animate-pulse" />
                ))}
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-tight mb-2">
                Great Job!
              </h2>

              <p className="text-slate-600 font-bold text-sm sm:text-base mb-6">
                You spotted all the differences in {currentScene.title}!
              </p>

              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <button
                  type="button"
                  onClick={handleNextRound}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-black py-3 px-4 rounded-2xl border-b-4 border-emerald-700 shadow-lg active:translate-y-1 transition-all cursor-pointer flex items-center justify-center gap-2 text-base uppercase"
                >
                  <span>Play Next Scene</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  onClick={handleShuffleOrReplay}
                  className="bg-amber-100 hover:bg-amber-200 text-amber-900 font-black py-3 px-4 rounded-2xl border-b-4 border-amber-300 shadow active:translate-y-1 transition-all cursor-pointer flex items-center justify-center gap-1.5 text-sm uppercase"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Replay</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. BOTTOM NAVIGATION BAR */}
      <div className="w-full max-w-3xl flex items-center justify-between mt-2 pt-2 border-t-2 border-slate-200/80">
        <button
          type="button"
          onClick={() => {
            soundManager.playPop();
            if (onNavigatePrev) onNavigatePrev();
          }}
          className="flex items-center gap-2 bg-white/90 hover:bg-white text-slate-700 font-black px-4 py-2 rounded-2xl border-2 border-slate-300 shadow-sm active:translate-y-0.5 transition-all cursor-pointer text-xs sm:text-sm uppercase"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <button
          type="button"
          onClick={() => {
            soundManager.playPop();
            if (onNavigateHome) onNavigateHome();
          }}
          className="flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-amber-950 font-black px-5 py-2.5 rounded-2xl border-b-4 border-amber-600 shadow-md active:translate-y-1 transition-all cursor-pointer text-xs sm:text-sm uppercase"
        >
          <Home className="w-4 h-4" />
          <span>Home</span>
        </button>

        <button
          type="button"
          onClick={() => {
            soundManager.playPop();
            if (onNavigateNext) onNavigateNext();
          }}
          className="flex items-center gap-2 bg-white/90 hover:bg-white text-slate-700 font-black px-4 py-2 rounded-2xl border-2 border-slate-300 shadow-sm active:translate-y-0.5 transition-all cursor-pointer text-xs sm:text-sm uppercase"
        >
          <span>Next</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
