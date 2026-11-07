import React from 'react';
import { motion } from 'motion/react';

export type AnimalFamilyId =
  | 'dog'
  | 'cat'
  | 'cow'
  | 'horse'
  | 'sheep'
  | 'goat'
  | 'pig'
  | 'hen'
  | 'duck'
  | 'lion';

export interface AnimalFamilyData {
  id: AnimalFamilyId;
  parentName: string;
  babyName: string;
  parentArticle: string;
  babyArticle: string;
  parentIntro: string;
  babyIntro: string;
  parentEmoji: string;
  babyEmoji: string;
  soundType: string;
  colorTheme: {
    bg: string;
    border: string;
    text: string;
    accent: string;
    lightBg: string;
  };
}

export const ANIMAL_FAMILIES: Record<AnimalFamilyId, AnimalFamilyData> = {
  dog: {
    id: 'dog',
    parentName: 'Dog',
    babyName: 'Puppy',
    parentArticle: 'a',
    babyArticle: 'a',
    parentIntro: 'I am a dog.',
    babyIntro: 'My baby is a puppy!',
    parentEmoji: '🐕',
    babyEmoji: '🐶',
    soundType: 'dog',
    colorTheme: {
      bg: 'from-amber-100 to-orange-100',
      border: 'border-amber-400',
      text: 'text-amber-950',
      accent: 'bg-amber-500',
      lightBg: 'bg-amber-50',
    },
  },
  cat: {
    id: 'cat',
    parentName: 'Cat',
    babyName: 'Kitten',
    parentArticle: 'a',
    babyArticle: 'a',
    parentIntro: 'I am a cat.',
    babyIntro: 'My baby is a kitten!',
    parentEmoji: '🐈',
    babyEmoji: '🐱',
    soundType: 'cat',
    colorTheme: {
      bg: 'from-pink-100 to-rose-100',
      border: 'border-rose-300',
      text: 'text-rose-950',
      accent: 'bg-rose-500',
      lightBg: 'bg-rose-50',
    },
  },
  cow: {
    id: 'cow',
    parentName: 'Cow',
    babyName: 'Calf',
    parentArticle: 'a',
    babyArticle: 'a',
    parentIntro: 'I am a cow.',
    babyIntro: 'My baby is a calf!',
    parentEmoji: '🐄',
    babyEmoji: '🐮',
    soundType: 'cow',
    colorTheme: {
      bg: 'from-emerald-100 to-teal-100',
      border: 'border-emerald-400',
      text: 'text-emerald-950',
      accent: 'bg-emerald-500',
      lightBg: 'bg-emerald-50',
    },
  },
  horse: {
    id: 'horse',
    parentName: 'Horse',
    babyName: 'Foal',
    parentArticle: 'a',
    babyArticle: 'a',
    parentIntro: 'I am a horse.',
    babyIntro: 'My baby is a foal!',
    parentEmoji: '🐎',
    babyEmoji: '🐴',
    soundType: 'horse',
    colorTheme: {
      bg: 'from-amber-100 to-yellow-100',
      border: 'border-amber-500',
      text: 'text-amber-950',
      accent: 'bg-amber-600',
      lightBg: 'bg-amber-50',
    },
  },
  sheep: {
    id: 'sheep',
    parentName: 'Sheep',
    babyName: 'Lamb',
    parentArticle: 'a',
    babyArticle: 'a',
    parentIntro: 'I am a sheep.',
    babyIntro: 'My baby is a lamb!',
    parentEmoji: '🐑',
    babyEmoji: '🐏',
    soundType: 'sheep',
    colorTheme: {
      bg: 'from-sky-100 to-blue-100',
      border: 'border-sky-300',
      text: 'text-sky-950',
      accent: 'bg-sky-500',
      lightBg: 'bg-sky-50',
    },
  },
  goat: {
    id: 'goat',
    parentName: 'Goat',
    babyName: 'Kid',
    parentArticle: 'a',
    babyArticle: 'a',
    parentIntro: 'I am a goat.',
    babyIntro: 'My baby is a kid!',
    parentEmoji: '🐐',
    babyEmoji: '🐐',
    soundType: 'goat',
    colorTheme: {
      bg: 'from-indigo-100 to-violet-100',
      border: 'border-indigo-300',
      text: 'text-indigo-950',
      accent: 'bg-indigo-500',
      lightBg: 'bg-indigo-50',
    },
  },
  pig: {
    id: 'pig',
    parentName: 'Pig',
    babyName: 'Piglet',
    parentArticle: 'a',
    babyArticle: 'a',
    parentIntro: 'I am a pig.',
    babyIntro: 'My baby is a piglet!',
    parentEmoji: '🐖',
    babyEmoji: '🐷',
    soundType: 'pig',
    colorTheme: {
      bg: 'from-pink-100 to-fuchsia-100',
      border: 'border-pink-300',
      text: 'text-pink-950',
      accent: 'bg-pink-500',
      lightBg: 'bg-pink-50',
    },
  },
  hen: {
    id: 'hen',
    parentName: 'Hen',
    babyName: 'Chick',
    parentArticle: 'a',
    babyArticle: 'a',
    parentIntro: 'I am a hen.',
    babyIntro: 'My baby is a chick!',
    parentEmoji: '🐔',
    babyEmoji: '🐥',
    soundType: 'chicken',
    colorTheme: {
      bg: 'from-orange-100 to-amber-100',
      border: 'border-orange-400',
      text: 'text-orange-950',
      accent: 'bg-orange-500',
      lightBg: 'bg-orange-50',
    },
  },
  duck: {
    id: 'duck',
    parentName: 'Duck',
    babyName: 'Duckling',
    parentArticle: 'a',
    babyArticle: 'a',
    parentIntro: 'I am a duck.',
    babyIntro: 'My baby is a duckling!',
    parentEmoji: '🦆',
    babyEmoji: '🐤',
    soundType: 'duck',
    colorTheme: {
      bg: 'from-teal-100 to-cyan-100',
      border: 'border-teal-300',
      text: 'text-teal-950',
      accent: 'bg-teal-500',
      lightBg: 'bg-teal-50',
    },
  },
  lion: {
    id: 'lion',
    parentName: 'Lion',
    babyName: 'Cub',
    parentArticle: 'a',
    babyArticle: 'a',
    parentIntro: 'I am a lion.',
    babyIntro: 'My baby is a cub!',
    parentEmoji: '🦁',
    babyEmoji: '🦁',
    soundType: 'lion',
    colorTheme: {
      bg: 'from-yellow-100 to-amber-100',
      border: 'border-yellow-400',
      text: 'text-amber-950',
      accent: 'bg-amber-500',
      lightBg: 'bg-amber-50',
    },
  },
};

export const ALL_ANIMAL_FAMILY_IDS: AnimalFamilyId[] = [
  'dog',
  'cat',
  'cow',
  'horse',
  'sheep',
  'goat',
  'pig',
  'hen',
  'duck',
  'lion',
];

interface AnimalVectorProps {
  type: 'parent' | 'baby';
  animalId: AnimalFamilyId;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  isAnimated?: boolean;
}

export const AnimalIllustration: React.FC<AnimalVectorProps> = ({
  type,
  animalId,
  size = 'md',
  className = '',
  isAnimated = false,
}) => {
  // Adult parents are noticeably larger with mature proportions;
  // Babies are significantly smaller with cute baby proportions!
  const parentPixelSizes = {
    sm: { w: 72, h: 72 },
    md: { w: 110, h: 110 },
    lg: { w: 165, h: 165 },
    xl: { w: 220, h: 220 },
  };

  const babyPixelSizes = {
    sm: { w: 46, h: 46 },
    md: { w: 70, h: 70 },
    lg: { w: 102, h: 102 },
    xl: { w: 135, h: 135 },
  };

  const { w, h } = type === 'parent' ? parentPixelSizes[size] : babyPixelSizes[size];

  const renderSvgContent = () => {
    switch (animalId) {
      // ----------------------------------------------------
      // 1. DOG & PUPPY
      // ----------------------------------------------------
      case 'dog':
        if (type === 'parent') {
          return (
            <svg viewBox="0 0 140 140" width={w} height={h} className="drop-shadow-md select-none">
              <defs>
                <linearGradient id="dogFur" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#D97706" />
                </linearGradient>
                <linearGradient id="dogEar" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#B45309" />
                  <stop offset="100%" stopColor="#92400E" />
                </linearGradient>
                <linearGradient id="dogChest" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FEF3C7" />
                  <stop offset="100%" stopColor="#FDE68A" />
                </linearGradient>
              </defs>
              {/* Tail */}
              <path d="M100 80 Q125 65 118 48 Q110 52 102 68" fill="url(#dogEar)" stroke="#92400E" strokeWidth="2.5" />
              {/* Body */}
              <ellipse cx="70" cy="92" rx="38" ry="32" fill="url(#dogFur)" stroke="#B45309" strokeWidth="3" />
              <ellipse cx="70" cy="95" rx="22" ry="20" fill="url(#dogChest)" />
              {/* Paws */}
              <ellipse cx="48" cy="120" rx="10" ry="7" fill="url(#dogFur)" stroke="#B45309" strokeWidth="2.5" />
              <ellipse cx="92" cy="120" rx="10" ry="7" fill="url(#dogFur)" stroke="#B45309" strokeWidth="2.5" />
              {/* Ears */}
              <path d="M36 38 C25 45 20 68 32 75 C38 68 40 50 44 42 Z" fill="url(#dogEar)" stroke="#92400E" strokeWidth="2.5" />
              <path d="M104 38 C115 45 120 68 108 75 C102 68 100 50 96 42 Z" fill="url(#dogEar)" stroke="#92400E" strokeWidth="2.5" />
              {/* Head */}
              <circle cx="70" cy="50" r="34" fill="url(#dogFur)" stroke="#B45309" strokeWidth="3" />
              {/* Snout */}
              <ellipse cx="70" cy="58" rx="18" ry="14" fill="url(#dogChest)" stroke="#D97706" strokeWidth="1.5" />
              <ellipse cx="70" cy="52" rx="6.5" ry="4.5" fill="#1F2937" />
              {/* Nose highlight */}
              <circle cx="68" cy="51" r="1.5" fill="#FFFFFF" />
              {/* Mouth & Tongue */}
              <path d="M66 59 Q70 64 74 59" stroke="#1F2937" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M67 61 Q70 69 73 61" fill="#F43F5E" stroke="#BE123C" strokeWidth="1" />
              {/* Eyes */}
              <circle cx="56" cy="42" r="5" fill="#1F2937" />
              <circle cx="54.5" cy="40" r="1.8" fill="#FFFFFF" />
              <circle cx="84" cy="42" r="5" fill="#1F2937" />
              <circle cx="82.5" cy="40" r="1.8" fill="#FFFFFF" />
              {/* Cheeks */}
              <circle cx="46" cy="54" r="5" fill="#FB7185" opacity="0.6" />
              <circle cx="94" cy="54" r="5" fill="#FB7185" opacity="0.6" />
              {/* Collar */}
              <path d="M48 76 Q70 85 92 76" stroke="#EF4444" strokeWidth="6" strokeLinecap="round" fill="none" />
              <circle cx="70" cy="83" r="4.5" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5" />
            </svg>
          );
        }
        // Dog Baby: PUPPY
        return (
          <svg viewBox="0 0 140 140" width={w} height={h} className="drop-shadow-md select-none">
            <defs>
              <linearGradient id="pupFur" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FBBF24" />
                <stop offset="100%" stopColor="#F59E0B" />
              </linearGradient>
              <linearGradient id="pupEar" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#D97706" />
                <stop offset="100%" stopColor="#B45309" />
              </linearGradient>
            </defs>
            {/* Wagging tiny tail */}
            <path d="M96 85 Q115 75 110 60" fill="none" stroke="url(#pupEar)" strokeWidth="5" strokeLinecap="round" />
            {/* Small Chubby Body */}
            <ellipse cx="70" cy="96" rx="30" ry="24" fill="url(#pupFur)" stroke="#D97706" strokeWidth="2.5" />
            <ellipse cx="70" cy="98" rx="16" ry="14" fill="#FEF3C7" />
            {/* Tiny Paws */}
            <ellipse cx="52" cy="118" rx="8" ry="6" fill="url(#pupFur)" stroke="#D97706" strokeWidth="2" />
            <ellipse cx="88" cy="118" rx="8" ry="6" fill="url(#pupFur)" stroke="#D97706" strokeWidth="2" />
            {/* Big Floppy Puppy Ears */}
            <path d="M38 42 C26 50 20 74 34 82 C40 74 42 54 46 46 Z" fill="url(#pupEar)" stroke="#B45309" strokeWidth="2.5" />
            <path d="M102 42 C114 50 120 74 106 82 C100 74 98 54 94 46 Z" fill="url(#pupEar)" stroke="#B45309" strokeWidth="2.5" />
            {/* Big Cute Head */}
            <circle cx="70" cy="52" r="32" fill="url(#pupFur)" stroke="#D97706" strokeWidth="3" />
            {/* Snout */}
            <ellipse cx="70" cy="60" rx="15" ry="12" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1" />
            <ellipse cx="70" cy="54" rx="5.5" ry="4" fill="#1F2937" />
            <circle cx="68.5" cy="53" r="1.3" fill="#FFFFFF" />
            {/* Cute Smile */}
            <path d="M66 60 Q70 65 74 60" stroke="#1F2937" strokeWidth="2" strokeLinecap="round" fill="none" />
            {/* Big Puppy Eyes */}
            <circle cx="56" cy="46" r="6" fill="#1F2937" />
            <circle cx="54" cy="43.5" r="2.2" fill="#FFFFFF" />
            <circle cx="57.5" cy="47.5" r="1" fill="#FFFFFF" />
            <circle cx="84" cy="46" r="6" fill="#1F2937" />
            <circle cx="82" cy="43.5" r="2.2" fill="#FFFFFF" />
            <circle cx="85.5" cy="47.5" r="1" fill="#FFFFFF" />
            {/* Rosy Cheeks */}
            <circle cx="45" cy="58" r="5.5" fill="#FDA4AF" opacity="0.8" />
            <circle cx="95" cy="58" r="5.5" fill="#FDA4AF" opacity="0.8" />
          </svg>
        );

      // ----------------------------------------------------
      // 2. CAT & KITTEN
      // ----------------------------------------------------
      case 'cat':
        if (type === 'parent') {
          return (
            <svg viewBox="0 0 140 140" width={w} height={h} className="drop-shadow-md select-none">
              <defs>
                <linearGradient id="catFur" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FB923C" />
                  <stop offset="100%" stopColor="#EA580C" />
                </linearGradient>
                <linearGradient id="catInnerEar" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FDA4AF" />
                  <stop offset="100%" stopColor="#F43F5E" />
                </linearGradient>
              </defs>
              {/* Elegant Curled Tail */}
              <path d="M102 96 Q128 85 122 55 Q115 52 110 65 Q112 80 96 88" fill="url(#catFur)" stroke="#C2410C" strokeWidth="2" />
              {/* Body */}
              <ellipse cx="70" cy="94" rx="34" ry="28" fill="url(#catFur)" stroke="#C2410C" strokeWidth="3" />
              <ellipse cx="70" cy="96" rx="18" ry="18" fill="#FFF7ED" />
              {/* Paws */}
              <ellipse cx="52" cy="120" rx="9" ry="6" fill="#FFF7ED" stroke="#C2410C" strokeWidth="2" />
              <ellipse cx="88" cy="120" rx="9" ry="6" fill="#FFF7ED" stroke="#C2410C" strokeWidth="2" />
              {/* Pointy Ears */}
              <path d="M42 42 L48 16 L66 34 Z" fill="url(#catFur)" stroke="#C2410C" strokeWidth="2.5" />
              <path d="M47 38 L51 22 L62 33 Z" fill="url(#catInnerEar)" />
              <path d="M98 42 L92 16 L74 34 Z" fill="url(#catFur)" stroke="#C2410C" strokeWidth="2.5" />
              <path d="M93 38 L89 22 L78 33 Z" fill="url(#catInnerEar)" />
              {/* Head */}
              <ellipse cx="70" cy="52" rx="32" ry="28" fill="url(#catFur)" stroke="#C2410C" strokeWidth="3" />
              {/* Muzzle */}
              <ellipse cx="70" cy="60" rx="14" ry="10" fill="#FFF7ED" />
              <polygon points="70,54 66,50 74,50" fill="#F43F5E" />
              {/* Whiskers */}
              <line x1="36" y1="58" x2="52" y2="59" stroke="#9A3412" strokeWidth="2" strokeLinecap="round" />
              <line x1="34" y1="64" x2="52" y2="63" stroke="#9A3412" strokeWidth="2" strokeLinecap="round" />
              <line x1="104" y1="58" x2="88" y2="59" stroke="#9A3412" strokeWidth="2" strokeLinecap="round" />
              <line x1="106" y1="64" x2="88" y2="63" stroke="#9A3412" strokeWidth="2" strokeLinecap="round" />
              {/* Mouth */}
              <path d="M66 58 Q70 63 74 58" stroke="#7C2D12" strokeWidth="2" strokeLinecap="round" fill="none" />
              {/* Emerald Eyes */}
              <ellipse cx="55" cy="46" rx="5" ry="6" fill="#10B981" />
              <ellipse cx="55" cy="46" rx="2" ry="5" fill="#064E3B" />
              <circle cx="53.5" cy="44" r="1.5" fill="#FFFFFF" />
              <ellipse cx="85" cy="46" rx="5" ry="6" fill="#10B981" />
              <ellipse cx="85" cy="46" rx="2" ry="5" fill="#064E3B" />
              <circle cx="83.5" cy="44" r="1.5" fill="#FFFFFF" />
              {/* Cheeks */}
              <circle cx="46" cy="56" r="4.5" fill="#FB7185" opacity="0.6" />
              <circle cx="94" cy="56" r="4.5" fill="#FB7185" opacity="0.6" />
            </svg>
          );
        }
        // Cat Baby: KITTEN
        return (
          <svg viewBox="0 0 140 140" width={w} height={h} className="drop-shadow-md select-none">
            <defs>
              <linearGradient id="kitFur" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FDBA74" />
                <stop offset="100%" stopColor="#FB923C" />
              </linearGradient>
            </defs>
            {/* Tiny Upright Tail */}
            <path d="M96 90 Q112 75 106 58" fill="none" stroke="#EA580C" strokeWidth="4.5" strokeLinecap="round" />
            {/* Small Body */}
            <ellipse cx="70" cy="98" rx="26" ry="20" fill="url(#kitFur)" stroke="#EA580C" strokeWidth="2.5" />
            <ellipse cx="70" cy="99" rx="14" ry="12" fill="#FFF7ED" />
            {/* Little Paws */}
            <ellipse cx="54" cy="118" rx="7" ry="5" fill="#FFF7ED" stroke="#EA580C" strokeWidth="1.8" />
            <ellipse cx="86" cy="118" rx="7" ry="5" fill="#FFF7ED" stroke="#EA580C" strokeWidth="1.8" />
            {/* Cute Kitten Ears */}
            <path d="M44 42 L48 20 L64 36 Z" fill="url(#kitFur)" stroke="#EA580C" strokeWidth="2.5" />
            <path d="M48 38 L51 26 L60 35 Z" fill="#FDA4AF" />
            <path d="M96 42 L92 20 L76 36 Z" fill="url(#kitFur)" stroke="#EA580C" strokeWidth="2.5" />
            <path d="M92 38 L89 26 L80 35 Z" fill="#FDA4AF" />
            {/* Big Kitten Head */}
            <ellipse cx="70" cy="54" rx="30" ry="26" fill="url(#kitFur)" stroke="#EA580C" strokeWidth="3" />
            {/* Cute Muzzle */}
            <ellipse cx="70" cy="62" rx="12" ry="8" fill="#FFF7ED" />
            <polygon points="70,57 67,54 73,54" fill="#F43F5E" />
            {/* Whiskers */}
            <line x1="38" y1="60" x2="52" y2="61" stroke="#9A3412" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="102" y1="60" x2="88" y2="61" stroke="#9A3412" strokeWidth="1.5" strokeLinecap="round" />
            {/* Big Round Kitten Eyes */}
            <circle cx="55" cy="48" r="6" fill="#1F2937" />
            <circle cx="53" cy="45.5" r="2.2" fill="#FFFFFF" />
            <circle cx="56.5" cy="49.5" r="1" fill="#FFFFFF" />
            <circle cx="85" cy="48" r="6" fill="#1F2937" />
            <circle cx="83" cy="45.5" r="2.2" fill="#FFFFFF" />
            <circle cx="86.5" cy="49.5" r="1" fill="#FFFFFF" />
            {/* Smile */}
            <path d="M66 61 Q70 65 74 61" stroke="#7C2D12" strokeWidth="1.8" strokeLinecap="round" fill="none" />
            {/* Cheeks */}
            <circle cx="44" cy="58" r="5" fill="#FDA4AF" opacity="0.8" />
            <circle cx="96" cy="58" r="5" fill="#FDA4AF" opacity="0.8" />
          </svg>
        );

      // ----------------------------------------------------
      // 3. COW & CALF
      // ----------------------------------------------------
      case 'cow':
        if (type === 'parent') {
          return (
            <svg viewBox="0 0 140 140" width={w} height={h} className="drop-shadow-md select-none">
              <defs>
                <linearGradient id="cowBody" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="100%" stopColor="#F1F5F9" />
                </linearGradient>
              </defs>
              {/* Horns */}
              <path d="M42 34 Q34 18 48 20" stroke="#FBBF24" strokeWidth="4" strokeLinecap="round" fill="none" />
              <path d="M98 34 Q106 18 92 20" stroke="#FBBF24" strokeWidth="4" strokeLinecap="round" fill="none" />
              {/* Ears */}
              <ellipse cx="32" cy="42" rx="14" ry="8" fill="#FFFFFF" stroke="#334155" strokeWidth="2" transform="rotate(-15 32 42)" />
              <ellipse cx="32" cy="42" rx="9" ry="5" fill="#FDA4AF" transform="rotate(-15 32 42)" />
              <ellipse cx="108" cy="42" rx="14" ry="8" fill="#FFFFFF" stroke="#334155" strokeWidth="2" transform="rotate(15 108 42)" />
              <ellipse cx="108" cy="42" rx="9" ry="5" fill="#FDA4AF" transform="rotate(15 108 42)" />
              {/* Body */}
              <ellipse cx="70" cy="94" rx="42" ry="30" fill="url(#cowBody)" stroke="#334155" strokeWidth="3" />
              {/* Black Spots on Body */}
              <path d="M45 80 Q52 70 60 84 Q55 96 42 90 Z" fill="#1E293B" />
              <path d="M85 85 Q98 75 104 90 Q95 105 82 98 Z" fill="#1E293B" />
              {/* Hooves */}
              <rect x="44" y="112" width="14" height="12" rx="3" fill="#334155" />
              <rect x="82" y="112" width="14" height="12" rx="3" fill="#334155" />
              {/* Head */}
              <ellipse cx="70" cy="48" rx="32" ry="26" fill="url(#cowBody)" stroke="#334155" strokeWidth="3" />
              <path d="M52 30 Q60 42 50 50 Q42 45 44 32 Z" fill="#1E293B" />
              {/* Big Pink Snout */}
              <ellipse cx="70" cy="62" rx="22" ry="14" fill="#FCE7F3" stroke="#F43F5E" strokeWidth="2" />
              {/* Nostrils */}
              <ellipse cx="62" cy="62" rx="3.5" ry="4.5" fill="#831843" />
              <ellipse cx="78" cy="62" rx="3.5" ry="4.5" fill="#831843" />
              {/* Cow Eyes */}
              <circle cx="56" cy="42" r="4.5" fill="#1E293B" />
              <circle cx="54.5" cy="40.5" r="1.5" fill="#FFFFFF" />
              <circle cx="84" cy="42" r="4.5" fill="#1E293B" />
              <circle cx="82.5" cy="40.5" r="1.5" fill="#FFFFFF" />
              {/* Cute Bell */}
              <circle cx="70" cy="88" r="5" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
            </svg>
          );
        }
        // Cow Baby: CALF
        return (
          <svg viewBox="0 0 140 140" width={w} height={h} className="drop-shadow-md select-none">
            <defs>
              <linearGradient id="calfBody" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="100%" stopColor="#F8FAFC" />
              </linearGradient>
            </defs>
            {/* Tiny Ear Nubs */}
            <ellipse cx="36" cy="44" rx="12" ry="7" fill="#FFFFFF" stroke="#334155" strokeWidth="2" transform="rotate(-20 36 44)" />
            <ellipse cx="36" cy="44" rx="7" ry="4" fill="#FDA4AF" transform="rotate(-20 36 44)" />
            <ellipse cx="104" cy="44" rx="12" ry="7" fill="#FFFFFF" stroke="#334155" strokeWidth="2" transform="rotate(20 104 44)" />
            <ellipse cx="104" cy="44" rx="7" ry="4" fill="#FDA4AF" transform="rotate(20 104 44)" />
            {/* Small Chubby Body */}
            <ellipse cx="70" cy="98" rx="30" ry="22" fill="url(#calfBody)" stroke="#334155" strokeWidth="2.5" />
            <path d="M82 90 Q92 82 96 95 Q88 106 78 100 Z" fill="#1E293B" />
            {/* Tiny Hooves */}
            <rect x="50" y="114" width="10" height="10" rx="2.5" fill="#475569" />
            <rect x="80" y="114" width="10" height="10" rx="2.5" fill="#475569" />
            {/* Big Cute Head */}
            <ellipse cx="70" cy="52" rx="30" ry="25" fill="url(#calfBody)" stroke="#334155" strokeWidth="3" />
            {/* Small Spot on Head */}
            <path d="M54 36 Q62 44 54 50 Q48 44 50 36 Z" fill="#1E293B" />
            {/* Big Friendly Pink Snout */}
            <ellipse cx="70" cy="64" rx="18" ry="12" fill="#FCE7F3" stroke="#F43F5E" strokeWidth="2" />
            <ellipse cx="64" cy="64" rx="2.5" ry="3.5" fill="#9D174D" />
            <ellipse cx="76" cy="64" rx="2.5" ry="3.5" fill="#9D174D" />
            {/* Big Shiny Calf Eyes */}
            <circle cx="56" cy="46" r="5.5" fill="#1E293B" />
            <circle cx="54" cy="44" r="2" fill="#FFFFFF" />
            <circle cx="57" cy="47.5" r="0.9" fill="#FFFFFF" />
            <circle cx="84" cy="46" r="5.5" fill="#1E293B" />
            <circle cx="82" cy="44" r="2" fill="#FFFFFF" />
            <circle cx="85" cy="47.5" r="0.9" fill="#FFFFFF" />
            {/* Rosy Cheeks */}
            <circle cx="46" cy="58" r="5" fill="#FDA4AF" opacity="0.8" />
            <circle cx="94" cy="58" r="5" fill="#FDA4AF" opacity="0.8" />
          </svg>
        );

      // ----------------------------------------------------
      // 4. HORSE & FOAL
      // ----------------------------------------------------
      case 'horse':
        if (type === 'parent') {
          return (
            <svg viewBox="0 0 140 140" width={w} height={h} className="drop-shadow-md select-none">
              <defs>
                <linearGradient id="horseFur" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#D97706" />
                  <stop offset="100%" stopColor="#92400E" />
                </linearGradient>
                <linearGradient id="horseMane" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#78350F" />
                  <stop offset="100%" stopColor="#451A03" />
                </linearGradient>
              </defs>
              {/* Flowing Mane */}
              <path d="M60 20 Q50 35 56 60 Q48 50 52 35 Z" fill="url(#horseMane)" />
              {/* Ears */}
              <path d="M54 28 L58 12 L68 25 Z" fill="url(#horseFur)" stroke="#78350F" strokeWidth="2" />
              <path d="M86 28 L82 12 L72 25 Z" fill="url(#horseFur)" stroke="#78350F" strokeWidth="2" />
              {/* Body */}
              <ellipse cx="70" cy="94" rx="38" ry="28" fill="url(#horseFur)" stroke="#78350F" strokeWidth="3" />
              {/* Hooves */}
              <rect x="46" y="112" width="12" height="12" rx="3" fill="#451A03" />
              <rect x="82" y="112" width="12" height="12" rx="3" fill="#451A03" />
              {/* Long Elegant Head */}
              <path d="M52 35 Q70 28 88 35 Q86 65 80 78 Q70 82 60 78 Q54 65 52 35 Z" fill="url(#horseFur)" stroke="#78350F" strokeWidth="3" />
              {/* Blaze (White mark on forehead) */}
              <path d="M67 32 Q70 45 68 62 Q72 62 73 45 Q71 32 67 32 Z" fill="#FFFFFF" />
              {/* Snout */}
              <ellipse cx="70" cy="74" rx="12" ry="8" fill="#B45309" />
              <circle cx="65" cy="74" r="2" fill="#451A03" />
              <circle cx="75" cy="74" r="2" fill="#451A03" />
              {/* Eyes */}
              <circle cx="58" cy="45" r="4.5" fill="#1F2937" />
              <circle cx="56.5" cy="43.5" r="1.5" fill="#FFFFFF" />
              <circle cx="82" cy="45" r="4.5" fill="#1F2937" />
              <circle cx="80.5" cy="43.5" r="1.5" fill="#FFFFFF" />
            </svg>
          );
        }
        // Horse Baby: FOAL
        return (
          <svg viewBox="0 0 140 140" width={w} height={h} className="drop-shadow-md select-none">
            <defs>
              <linearGradient id="foalFur" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#B45309" />
              </linearGradient>
            </defs>
            {/* Fluffy Baby Mane */}
            <path d="M62 25 Q54 36 60 52 Q52 42 56 32 Z" fill="#92400E" />
            {/* Cute Perky Ears */}
            <path d="M56 30 L60 16 L68 28 Z" fill="url(#foalFur)" stroke="#92400E" strokeWidth="2" />
            <path d="M84 30 L80 16 L72 28 Z" fill="url(#foalFur)" stroke="#92400E" strokeWidth="2" />
            {/* Small Body */}
            <ellipse cx="70" cy="98" rx="28" ry="22" fill="url(#foalFur)" stroke="#92400E" strokeWidth="2.5" />
            {/* Tiny Hooves */}
            <rect x="52" y="114" width="10" height="10" rx="2" fill="#78350F" />
            <rect x="78" y="114" width="10" height="10" rx="2" fill="#78350F" />
            {/* Head */}
            <path d="M55 36 Q70 30 85 36 Q83 62 78 72 Q70 76 62 72 Q57 62 55 36 Z" fill="url(#foalFur)" stroke="#92400E" strokeWidth="2.8" />
            {/* White Star on Forehead */}
            <polygon points="70,38 72,42 76,42 73,45 74,49 70,46 66,49 67,45 64,42 68,42" fill="#FFFFFF" />
            {/* Snout */}
            <ellipse cx="70" cy="69" rx="10" ry="6" fill="#D97706" />
            <circle cx="66" cy="69" r="1.6" fill="#451A03" />
            <circle cx="74" cy="69" r="1.6" fill="#451A03" />
            {/* Big Curious Eyes */}
            <circle cx="60" cy="46" r="5" fill="#1F2937" />
            <circle cx="58.5" cy="44" r="1.8" fill="#FFFFFF" />
            <circle cx="80" cy="46" r="5" fill="#1F2937" />
            <circle cx="78.5" cy="44" r="1.8" fill="#FFFFFF" />
            {/* Cheeks */}
            <circle cx="52" cy="56" r="4.5" fill="#FDA4AF" opacity="0.8" />
            <circle cx="88" cy="56" r="4.5" fill="#FDA4AF" opacity="0.8" />
          </svg>
        );

      // ----------------------------------------------------
      // 5. SHEEP & LAMB
      // ----------------------------------------------------
      case 'sheep':
        if (type === 'parent') {
          return (
            <svg viewBox="0 0 140 140" width={w} height={h} className="drop-shadow-md select-none">
              <defs>
                <linearGradient id="wool" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="100%" stopColor="#E2E8F0" />
                </linearGradient>
              </defs>
              {/* Fluffy Wool Cloud Body */}
              <g fill="url(#wool)" stroke="#CBD5E1" strokeWidth="2.5">
                <circle cx="48" cy="80" r="18" />
                <circle cx="70" cy="74" r="22" />
                <circle cx="92" cy="80" r="18" />
                <circle cx="50" cy="100" r="16" />
                <circle cx="70" cy="104" r="18" />
                <circle cx="90" cy="100" r="16" />
              </g>
              {/* Legs */}
              <rect x="52" y="112" width="8" height="14" rx="3" fill="#475569" />
              <rect x="80" y="112" width="8" height="14" rx="3" fill="#475569" />
              {/* Ears */}
              <ellipse cx="36" cy="48" rx="12" ry="6" fill="#F8FAFC" stroke="#64748B" strokeWidth="2" transform="rotate(-15 36 48)" />
              <ellipse cx="104" cy="48" rx="12" ry="6" fill="#F8FAFC" stroke="#64748B" strokeWidth="2" transform="rotate(15 104 48)" />
              {/* Face */}
              <ellipse cx="70" cy="54" rx="22" ry="24" fill="#F8FAFC" stroke="#64748B" strokeWidth="2.5" />
              {/* Wool Cap on Head */}
              <ellipse cx="70" cy="34" rx="18" ry="10" fill="url(#wool)" stroke="#CBD5E1" strokeWidth="2" />
              {/* Snout / Nose */}
              <ellipse cx="70" cy="65" rx="7" ry="5" fill="#FDA4AF" />
              <path d="M67 67 Q70 70 73 67" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              {/* Gentle Sheep Eyes */}
              <circle cx="58" cy="50" r="3.5" fill="#1E293B" />
              <circle cx="57" cy="49" r="1.2" fill="#FFFFFF" />
              <circle cx="82" cy="50" r="3.5" fill="#1E293B" />
              <circle cx="81" cy="49" r="1.2" fill="#FFFFFF" />
              {/* Cheeks */}
              <circle cx="50" cy="60" r="4.5" fill="#FDA4AF" opacity="0.6" />
              <circle cx="90" cy="60" r="4.5" fill="#FDA4AF" opacity="0.6" />
            </svg>
          );
        }
        // Sheep Baby: LAMB
        return (
          <svg viewBox="0 0 140 140" width={w} height={h} className="drop-shadow-md select-none">
            <defs>
              <linearGradient id="lambWool" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="100%" stopColor="#F1F5F9" />
              </linearGradient>
            </defs>
            {/* Small Fluffy Wool Body */}
            <g fill="url(#lambWool)" stroke="#E2E8F0" strokeWidth="2">
              <circle cx="54" cy="88" r="15" />
              <circle cx="70" cy="84" r="18" />
              <circle cx="86" cy="88" r="15" />
              <circle cx="58" cy="102" r="13" />
              <circle cx="70" cy="105" r="14" />
              <circle cx="82" cy="102" r="13" />
            </g>
            {/* Tiny Black Legs */}
            <rect x="56" y="114" width="6" height="12" rx="2" fill="#475569" />
            <rect x="78" y="114" width="6" height="12" rx="2" fill="#475569" />
            {/* Cute Droopy Ears */}
            <ellipse cx="38" cy="52" rx="10" ry="5" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1.8" transform="rotate(-15 38 52)" />
            <ellipse cx="102" cy="52" rx="10" ry="5" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1.8" transform="rotate(15 102 52)" />
            {/* Head */}
            <ellipse cx="70" cy="56" rx="20" ry="20" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="2.5" />
            {/* Wool Forelock */}
            <circle cx="65" cy="38" r="8" fill="url(#lambWool)" stroke="#E2E8F0" strokeWidth="1.5" />
            <circle cx="75" cy="38" r="8" fill="url(#lambWool)" stroke="#E2E8F0" strokeWidth="1.5" />
            {/* Pink Nose */}
            <polygon points="70,66 66,62 74,62" fill="#F43F5E" />
            {/* Big Innocent Lamb Eyes */}
            <circle cx="60" cy="52" r="4.5" fill="#1E293B" />
            <circle cx="58.5" cy="50.5" r="1.8" fill="#FFFFFF" />
            <circle cx="80" cy="52" r="4.5" fill="#1E293B" />
            <circle cx="78.5" cy="50.5" r="1.8" fill="#FFFFFF" />
            {/* Rosy Cheeks */}
            <circle cx="50" cy="62" r="5" fill="#FDA4AF" opacity="0.8" />
            <circle cx="90" cy="62" r="5" fill="#FDA4AF" opacity="0.8" />
          </svg>
        );

      // ----------------------------------------------------
      // 6. GOAT & KID
      // ----------------------------------------------------
      case 'goat':
        if (type === 'parent') {
          return (
            <svg viewBox="0 0 140 140" width={w} height={h} className="drop-shadow-md select-none">
              {/* Horns */}
              <path d="M52 28 Q40 8 36 12 Q45 22 55 32" fill="#94A3B8" stroke="#64748B" strokeWidth="1.5" />
              <path d="M88 28 Q100 8 104 12 Q95 22 85 32" fill="#94A3B8" stroke="#64748B" strokeWidth="1.5" />
              {/* Ears */}
              <ellipse cx="34" cy="46" rx="14" ry="7" fill="#F1F5F9" stroke="#64748B" strokeWidth="2" transform="rotate(-15 34 46)" />
              <ellipse cx="106" cy="46" rx="14" ry="7" fill="#F1F5F9" stroke="#64748B" strokeWidth="2" transform="rotate(15 106 46)" />
              {/* Body */}
              <ellipse cx="70" cy="94" rx="36" ry="26" fill="#F8FAFC" stroke="#64748B" strokeWidth="3" />
              {/* Legs */}
              <rect x="50" y="112" width="10" height="14" rx="3" fill="#475569" />
              <rect x="80" y="112" width="10" height="14" rx="3" fill="#475569" />
              {/* Head */}
              <path d="M54 36 Q70 30 86 36 Q84 66 76 76 Q70 78 64 76 Q56 66 54 36 Z" fill="#F8FAFC" stroke="#64748B" strokeWidth="3" />
              {/* Beard */}
              <path d="M66 76 L70 90 L74 76 Z" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.5" />
              {/* Snout */}
              <ellipse cx="70" cy="68" rx="8" ry="5" fill="#E2E8F0" />
              <polygon points="70,68 67,65 73,65" fill="#64748B" />
              {/* Eyes */}
              <ellipse cx="58" cy="48" rx="4" ry="5" fill="#1E293B" />
              <circle cx="56.5" cy="46.5" r="1.5" fill="#FFFFFF" />
              <ellipse cx="82" cy="48" rx="4" ry="5" fill="#1E293B" />
              <circle cx="80.5" cy="46.5" r="1.5" fill="#FFFFFF" />
            </svg>
          );
        }
        // Goat Baby: KID
        return (
          <svg viewBox="0 0 140 140" width={w} height={h} className="drop-shadow-md select-none">
            {/* Tiny Horn Nubs */}
            <circle cx="54" cy="30" r="3" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="1.5" />
            <circle cx="86" cy="30" r="3" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="1.5" />
            {/* Big Floppy Ears */}
            <ellipse cx="34" cy="48" rx="14" ry="7" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="2" transform="rotate(-20 34 48)" />
            <ellipse cx="34" cy="48" rx="8" ry="4" fill="#FDA4AF" transform="rotate(-20 34 48)" />
            <ellipse cx="106" cy="48" rx="14" ry="7" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="2" transform="rotate(20 106 48)" />
            <ellipse cx="106" cy="48" rx="8" ry="4" fill="#FDA4AF" transform="rotate(20 106 48)" />
            {/* Small Playful Body */}
            <ellipse cx="70" cy="98" rx="26" ry="20" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="2.5" />
            {/* Little Legs */}
            <rect x="54" y="114" width="8" height="12" rx="2" fill="#64748B" />
            <rect x="78" y="114" width="8" height="12" rx="2" fill="#64748B" />
            {/* Head */}
            <path d="M55 36 Q70 32 85 36 Q82 62 76 70 Q70 73 64 70 Q58 62 55 36 Z" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="2.5" />
            {/* Tiny Muzzle */}
            <ellipse cx="70" cy="65" rx="8" ry="5" fill="#FCE7F3" />
            <polygon points="70,64 67,62 73,62" fill="#F43F5E" />
            {/* Big Curious Eyes */}
            <circle cx="58" cy="48" r="5.5" fill="#1E293B" />
            <circle cx="56" cy="45.5" r="2" fill="#FFFFFF" />
            <circle cx="82" cy="48" r="5.5" fill="#1E293B" />
            <circle cx="80" cy="45.5" r="2" fill="#FFFFFF" />
            {/* Rosy Cheeks */}
            <circle cx="48" cy="58" r="5" fill="#FDA4AF" opacity="0.8" />
            <circle cx="92" cy="58" r="5" fill="#FDA4AF" opacity="0.8" />
          </svg>
        );

      // ----------------------------------------------------
      // 7. PIG & PIGLET
      // ----------------------------------------------------
      case 'pig':
        if (type === 'parent') {
          return (
            <svg viewBox="0 0 140 140" width={w} height={h} className="drop-shadow-md select-none">
              <defs>
                <linearGradient id="pigSkin" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#F472B6" />
                  <stop offset="100%" stopColor="#EC4899" />
                </linearGradient>
              </defs>
              {/* Curly Tail */}
              <path d="M102 90 Q118 78 114 68 Q108 68 112 76 Q118 84 104 88" fill="none" stroke="#DB2777" strokeWidth="3" strokeLinecap="round" />
              {/* Body */}
              <ellipse cx="70" cy="94" rx="40" ry="30" fill="url(#pigSkin)" stroke="#DB2777" strokeWidth="3" />
              {/* Feet */}
              <ellipse cx="48" cy="120" rx="9" ry="6" fill="#DB2777" />
              <ellipse cx="92" cy="120" rx="9" ry="6" fill="#DB2777" />
              {/* Ears */}
              <path d="M38 36 Q32 18 48 24 Z" fill="url(#pigSkin)" stroke="#DB2777" strokeWidth="2.5" />
              <path d="M102 36 Q108 18 92 24 Z" fill="url(#pigSkin)" stroke="#DB2777" strokeWidth="2.5" />
              {/* Head */}
              <circle cx="70" cy="50" r="32" fill="url(#pigSkin)" stroke="#DB2777" strokeWidth="3" />
              {/* Big Oval Snout */}
              <ellipse cx="70" cy="58" rx="16" ry="12" fill="#FDF2F8" stroke="#DB2777" strokeWidth="2" />
              <ellipse cx="64" cy="58" rx="3.5" ry="4.5" fill="#BE185D" />
              <ellipse cx="76" cy="58" rx="3.5" ry="4.5" fill="#BE185D" />
              {/* Cheerful Eyes */}
              <circle cx="54" cy="42" r="4.5" fill="#1F2937" />
              <circle cx="52.5" cy="40.5" r="1.5" fill="#FFFFFF" />
              <circle cx="86" cy="42" r="4.5" fill="#1F2937" />
              <circle cx="84.5" cy="40.5" r="1.5" fill="#FFFFFF" />
              {/* Rosy Cheeks */}
              <circle cx="44" cy="54" r="5.5" fill="#F43F5E" opacity="0.6" />
              <circle cx="96" cy="54" r="5.5" fill="#F43F5E" opacity="0.6" />
            </svg>
          );
        }
        // Pig Baby: PIGLET
        return (
          <svg viewBox="0 0 140 140" width={w} height={h} className="drop-shadow-md select-none">
            <defs>
              <linearGradient id="pigletSkin" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FBCFE8" />
                <stop offset="100%" stopColor="#F472B6" />
              </linearGradient>
            </defs>
            {/* Tiny Curly Tail */}
            <path d="M96 95 Q110 85 106 78 Q102 78 105 84 Q110 90 98 94" fill="none" stroke="#DB2777" strokeWidth="2.5" strokeLinecap="round" />
            {/* Tiny Chubby Body */}
            <ellipse cx="70" cy="98" rx="30" ry="22" fill="url(#pigletSkin)" stroke="#DB2777" strokeWidth="2.5" />
            {/* Tiny Feet */}
            <ellipse cx="52" cy="118" rx="7" ry="5" fill="#DB2777" />
            <ellipse cx="88" cy="118" rx="7" ry="5" fill="#DB2777" />
            {/* Cute Rounded Ears */}
            <path d="M40 38 Q34 22 48 28 Z" fill="url(#pigletSkin)" stroke="#DB2777" strokeWidth="2" />
            <path d="M100 38 Q106 22 92 28 Z" fill="url(#pigletSkin)" stroke="#DB2777" strokeWidth="2" />
            {/* Big Head */}
            <circle cx="70" cy="52" r="30" fill="url(#pigletSkin)" stroke="#DB2777" strokeWidth="3" />
            {/* Cute Snout */}
            <ellipse cx="70" cy="60" rx="14" ry="10" fill="#FFF1F2" stroke="#DB2777" strokeWidth="2" />
            <ellipse cx="65" cy="60" rx="2.8" ry="3.8" fill="#BE185D" />
            <ellipse cx="75" cy="60" rx="2.8" ry="3.8" fill="#BE185D" />
            {/* Big Sparkly Eyes */}
            <circle cx="54" cy="45" r="5.5" fill="#1F2937" />
            <circle cx="52" cy="42.5" r="2" fill="#FFFFFF" />
            <circle cx="86" cy="45" r="5.5" fill="#1F2937" />
            <circle cx="84" cy="42.5" r="2" fill="#FFFFFF" />
            {/* Cheeks */}
            <circle cx="42" cy="58" r="5.5" fill="#FDA4AF" opacity="0.9" />
            <circle cx="98" cy="58" r="5.5" fill="#FDA4AF" opacity="0.9" />
          </svg>
        );

      // ----------------------------------------------------
      // 8. HEN & CHICK
      // ----------------------------------------------------
      case 'hen':
        if (type === 'parent') {
          return (
            <svg viewBox="0 0 140 140" width={w} height={h} className="drop-shadow-md select-none">
              <defs>
                <linearGradient id="henFeather" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="100%" stopColor="#FED7AA" />
                </linearGradient>
              </defs>
              {/* Red Comb on Top */}
              <path d="M60 22 C60 12 68 12 70 20 C72 10 80 10 82 22 Z" fill="#EF4444" stroke="#B91C1C" strokeWidth="2" />
              {/* Tail Feathers */}
              <path d="M36 70 Q16 55 24 45 Q36 60 48 70 Z" fill="#EA580C" stroke="#C2410C" strokeWidth="2" />
              {/* Body */}
              <ellipse cx="72" cy="88" rx="36" ry="30" fill="url(#henFeather)" stroke="#EA580C" strokeWidth="3" />
              {/* Wing */}
              <ellipse cx="78" cy="88" rx="20" ry="16" fill="#FDBA74" stroke="#EA580C" strokeWidth="2" />
              {/* Feet */}
              <line x1="60" y1="116" x2="60" y2="128" stroke="#F59E0B" strokeWidth="3.5" strokeLinecap="round" />
              <line x1="56" y1="128" x2="64" y2="128" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
              <line x1="84" y1="116" x2="84" y2="128" stroke="#F59E0B" strokeWidth="3.5" strokeLinecap="round" />
              <line x1="80" y1="128" x2="88" y2="128" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
              {/* Head */}
              <circle cx="72" cy="46" r="22" fill="url(#henFeather)" stroke="#EA580C" strokeWidth="3" />
              {/* Beak */}
              <polygon points="90,46 104,50 90,56" fill="#F59E0B" stroke="#D97706" strokeWidth="1.5" />
              {/* Wattle under Beak */}
              <path d="M88 56 Q88 66 84 64 Q82 56 88 56 Z" fill="#EF4444" />
              {/* Eye */}
              <circle cx="80" cy="42" r="4" fill="#1F2937" />
              <circle cx="78.5" cy="40.5" r="1.5" fill="#FFFFFF" />
            </svg>
          );
        }
        // Hen Baby: CHICK
        return (
          <svg viewBox="0 0 140 140" width={w} height={h} className="drop-shadow-md select-none">
            <defs>
              <linearGradient id="chickFluff" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FEF08A" />
                <stop offset="100%" stopColor="#FACC15" />
              </linearGradient>
            </defs>
            {/* Tiny Wings */}
            <ellipse cx="44" cy="80" rx="10" ry="14" fill="url(#chickFluff)" stroke="#EAB308" strokeWidth="2" transform="rotate(-15 44 80)" />
            <ellipse cx="96" cy="80" rx="10" ry="14" fill="url(#chickFluff)" stroke="#EAB308" strokeWidth="2" transform="rotate(15 96 80)" />
            {/* Round Chubby Fluffy Body */}
            <circle cx="70" cy="84" r="32" fill="url(#chickFluff)" stroke="#EAB308" strokeWidth="3" />
            {/* Tiny Orange Feet */}
            <line x1="60" y1="114" x2="60" y2="124" stroke="#F97316" strokeWidth="3" strokeLinecap="round" />
            <line x1="56" y1="124" x2="64" y2="124" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="80" y1="114" x2="80" y2="124" stroke="#F97316" strokeWidth="3" strokeLinecap="round" />
            <line x1="76" y1="124" x2="84" y2="124" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" />
            {/* Head Fluff Feather */}
            <path d="M68 32 Q70 20 74 24 Q72 30 70 34" stroke="#EAB308" strokeWidth="3" strokeLinecap="round" fill="none" />
            {/* Tiny Triangle Beak */}
            <polygon points="66,54 74,54 70,62" fill="#F97316" stroke="#EA580C" strokeWidth="1" />
            {/* Big Shiny Chick Eyes */}
            <circle cx="56" cy="48" r="5.5" fill="#1F2937" />
            <circle cx="54" cy="45.5" r="2" fill="#FFFFFF" />
            <circle cx="84" cy="48" r="5.5" fill="#1F2937" />
            <circle cx="82" cy="45.5" r="2" fill="#FFFFFF" />
            {/* Cheeks */}
            <circle cx="46" cy="58" r="5" fill="#FDA4AF" opacity="0.8" />
            <circle cx="94" cy="58" r="5" fill="#FDA4AF" opacity="0.8" />
          </svg>
        );

      // ----------------------------------------------------
      // 9. DUCK & DUCKLING
      // ----------------------------------------------------
      case 'duck':
        if (type === 'parent') {
          return (
            <svg viewBox="0 0 140 140" width={w} height={h} className="drop-shadow-md select-none">
              <defs>
                <linearGradient id="duckHead" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#047857" />
                </linearGradient>
                <linearGradient id="duckBody" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="100%" stopColor="#E2E8F0" />
                </linearGradient>
              </defs>
              {/* Upright Tail Feathers */}
              <path d="M38 78 Q22 68 28 58 Q38 70 48 80 Z" fill="#047857" stroke="#065F46" strokeWidth="2" />
              {/* Body */}
              <ellipse cx="72" cy="92" rx="38" ry="26" fill="url(#duckBody)" stroke="#047857" strokeWidth="3" />
              {/* Wing */}
              <ellipse cx="76" cy="92" rx="20" ry="14" fill="#6EE7B7" stroke="#059669" strokeWidth="2" />
              {/* Webbed Feet */}
              <polygon points="56,116 50,126 62,126" fill="#F97316" stroke="#EA580C" strokeWidth="1.5" />
              <polygon points="80,116 74,126 86,126" fill="#F97316" stroke="#EA580C" strokeWidth="1.5" />
              {/* Shiny Green Mallard Head */}
              <circle cx="72" cy="46" r="22" fill="url(#duckHead)" stroke="#065F46" strokeWidth="3" />
              {/* White Neck Ring */}
              <path d="M60 66 Q72 70 84 66" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" fill="none" />
              {/* Wide Yellow Bill */}
              <ellipse cx="94" cy="52" rx="14" ry="7" fill="#FBBF24" stroke="#D97706" strokeWidth="2" />
              {/* Eye */}
              <circle cx="78" cy="42" r="4" fill="#1F2937" />
              <circle cx="76.5" cy="40.5" r="1.5" fill="#FFFFFF" />
            </svg>
          );
        }
        // Duck Baby: DUCKLING
        return (
          <svg viewBox="0 0 140 140" width={w} height={h} className="drop-shadow-md select-none">
            <defs>
              <linearGradient id="ducklingFur" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FEF08A" />
                <stop offset="100%" stopColor="#FACC15" />
              </linearGradient>
            </defs>
            {/* Tiny Wings */}
            <ellipse cx="44" cy="84" rx="10" ry="14" fill="url(#ducklingFur)" stroke="#EAB308" strokeWidth="2" transform="rotate(-15 44 84)" />
            <ellipse cx="96" cy="84" rx="10" ry="14" fill="url(#ducklingFur)" stroke="#EAB308" strokeWidth="2" transform="rotate(15 96 84)" />
            {/* Cute Yellow Body */}
            <ellipse cx="70" cy="88" rx="30" ry="24" fill="url(#ducklingFur)" stroke="#EAB308" strokeWidth="3" />
            {/* Tiny Webbed Feet */}
            <polygon points="56,112 50,122 62,122" fill="#F97316" stroke="#EA580C" strokeWidth="1.5" />
            <polygon points="80,112 74,122 86,122" fill="#F97316" stroke="#EA580C" strokeWidth="1.5" />
            {/* Big Round Head */}
            <circle cx="70" cy="50" r="25" fill="url(#ducklingFur)" stroke="#EAB308" strokeWidth="3" />
            {/* Wide Cute Orange Bill */}
            <ellipse cx="70" cy="62" rx="13" ry="7" fill="#FB923C" stroke="#EA580C" strokeWidth="2" />
            <circle cx="67" cy="60" r="1" fill="#C2410C" />
            <circle cx="73" cy="60" r="1" fill="#C2410C" />
            {/* Big Sparkly Eyes */}
            <circle cx="56" cy="45" r="5" fill="#1F2937" />
            <circle cx="54" cy="43" r="1.8" fill="#FFFFFF" />
            <circle cx="84" cy="45" r="5" fill="#1F2937" />
            <circle cx="82" cy="43" r="1.8" fill="#FFFFFF" />
            {/* Cheeks */}
            <circle cx="44" cy="55" r="4.5" fill="#FDA4AF" opacity="0.8" />
            <circle cx="96" cy="55" r="4.5" fill="#FDA4AF" opacity="0.8" />
          </svg>
        );

      // ----------------------------------------------------
      // 10. LION & CUB
      // ----------------------------------------------------
      case 'lion':
        if (type === 'parent') {
          return (
            <svg viewBox="0 0 140 140" width={w} height={h} className="drop-shadow-md select-none">
              <defs>
                <linearGradient id="lionMane" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#B45309" />
                </linearGradient>
                <linearGradient id="lionFur" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FDE68A" />
                  <stop offset="100%" stopColor="#F59E0B" />
                </linearGradient>
              </defs>
              {/* Magnificent Big Sunburst Mane */}
              <circle cx="70" cy="52" r="38" fill="url(#lionMane)" stroke="#92400E" strokeWidth="3" />
              {/* Mane Tufts */}
              <path d="M70 12 L75 22 L65 22 Z" fill="#B45309" />
              <path d="M32 30 L42 36 L38 24 Z" fill="#B45309" />
              <path d="M108 30 L98 36 L102 24 Z" fill="#B45309" />
              {/* Body */}
              <ellipse cx="70" cy="98" rx="36" ry="26" fill="url(#lionFur)" stroke="#D97706" strokeWidth="3" />
              {/* Paws */}
              <ellipse cx="48" cy="120" rx="10" ry="7" fill="url(#lionFur)" stroke="#D97706" strokeWidth="2.5" />
              <ellipse cx="92" cy="120" rx="10" ry="7" fill="url(#lionFur)" stroke="#D97706" strokeWidth="2.5" />
              {/* Ears */}
              <circle cx="42" cy="36" r="9" fill="url(#lionFur)" stroke="#92400E" strokeWidth="2" />
              <circle cx="42" cy="36" r="5" fill="#FEF3C7" />
              <circle cx="98" cy="36" r="9" fill="url(#lionFur)" stroke="#92400E" strokeWidth="2" />
              <circle cx="98" cy="36" r="5" fill="#FEF3C7" />
              {/* Head */}
              <circle cx="70" cy="54" r="26" fill="url(#lionFur)" stroke="#D97706" strokeWidth="2.5" />
              {/* Muzzle */}
              <ellipse cx="70" cy="62" rx="14" ry="10" fill="#FEF3C7" />
              <polygon points="70,57 65,52 75,52" fill="#78350F" />
              {/* Whiskers */}
              <circle cx="64" cy="62" r="1" fill="#78350F" />
              <circle cx="62" cy="65" r="1" fill="#78350F" />
              <circle cx="76" cy="62" r="1" fill="#78350F" />
              <circle cx="78" cy="65" r="1" fill="#78350F" />
              {/* Smile */}
              <path d="M66 64 Q70 68 74 64" stroke="#78350F" strokeWidth="2" strokeLinecap="round" fill="none" />
              {/* Eyes */}
              <circle cx="58" cy="46" r="4.5" fill="#1F2937" />
              <circle cx="56.5" cy="44.5" r="1.5" fill="#FFFFFF" />
              <circle cx="82" cy="46" r="4.5" fill="#1F2937" />
              <circle cx="80.5" cy="44.5" r="1.5" fill="#FFFFFF" />
            </svg>
          );
        }
        // Lion Baby: CUB
        return (
          <svg viewBox="0 0 140 140" width={w} height={h} className="drop-shadow-md select-none">
            <defs>
              <linearGradient id="cubFur" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FEF08A" />
                <stop offset="100%" stopColor="#FBBF24" />
              </linearGradient>
            </defs>
            {/* Small Chubby Body */}
            <ellipse cx="70" cy="98" rx="28" ry="22" fill="url(#cubFur)" stroke="#D97706" strokeWidth="2.5" />
            <ellipse cx="70" cy="99" rx="15" ry="14" fill="#FEF9C3" />
            {/* Paws */}
            <ellipse cx="52" cy="118" rx="8" ry="6" fill="url(#cubFur)" stroke="#D97706" strokeWidth="2" />
            <ellipse cx="88" cy="118" rx="8" ry="6" fill="url(#cubFur)" stroke="#D97706" strokeWidth="2" />
            {/* Big Round Ears */}
            <circle cx="40" cy="38" r="10" fill="url(#cubFur)" stroke="#D97706" strokeWidth="2.5" />
            <circle cx="40" cy="38" r="5.5" fill="#FEF3C7" />
            <circle cx="100" cy="38" r="10" fill="url(#cubFur)" stroke="#D97706" strokeWidth="2.5" />
            <circle cx="100" cy="38" r="5.5" fill="#FEF3C7" />
            {/* Head */}
            <circle cx="70" cy="54" r="30" fill="url(#cubFur)" stroke="#D97706" strokeWidth="3" />
            {/* Tiny Mane Hair Tuft */}
            <path d="M68 24 Q70 16 74 20 Q72 26 70 28" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            {/* Muzzle */}
            <ellipse cx="70" cy="64" rx="14" ry="9" fill="#FEF9C3" />
            <polygon points="70,59 66,55 74,55" fill="#78350F" />
            {/* Smile */}
            <path d="M66 64 Q70 68 74 64" stroke="#78350F" strokeWidth="1.8" strokeLinecap="round" fill="none" />
            {/* Big Shiny Cub Eyes */}
            <circle cx="56" cy="46" r="5.5" fill="#1F2937" />
            <circle cx="54" cy="43.5" r="2" fill="#FFFFFF" />
            <circle cx="84" cy="46" r="5.5" fill="#1F2937" />
            <circle cx="82" cy="43.5" r="2" fill="#FFFFFF" />
            {/* Cheeks */}
            <circle cx="45" cy="58" r="5.5" fill="#FDA4AF" opacity="0.8" />
            <circle cx="95" cy="58" r="5.5" fill="#FDA4AF" opacity="0.8" />
          </svg>
        );

      default:
        return null;
    }
  };

  if (isAnimated) {
    return (
      <motion.div
        animate={{
          y: [0, -4, 0, 3, 0],
          scale: [1, 1.02, 1, 0.99, 1],
        }}
        transition={{
          duration: 3.2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className={`flex items-center justify-center ${className}`}
      >
        {renderSvgContent()}
      </motion.div>
    );
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      {renderSvgContent()}
    </div>
  );
};
