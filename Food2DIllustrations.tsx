import React from 'react';
import { motion } from 'motion/react';

export type FoodId =
  // 13 Sour foods
  | 'lemon'
  | 'lime'
  | 'tamarind'
  | 'green_mango'
  | 'grapefruit'
  | 'sour_plum'
  | 'cranberry'
  | 'sour_cherry'
  | 'passion_fruit'
  | 'pomegranate'
  | 'green_apple'
  | 'kiwi'
  | 'pickle'
  // 15 Sweet foods
  | 'strawberry'
  | 'mango'
  | 'banana'
  | 'watermelon'
  | 'grapes'
  | 'apple'
  | 'pear'
  | 'pineapple'
  | 'peach'
  | 'melon'
  | 'cherries'
  | 'papaya'
  | 'dates'
  | 'raisins'
  | 'honey';

export type TasteType = 'sweet' | 'sour';

export interface FoodItemData {
  id: FoodId;
  name: string;
  article: string; // "a" or "an" or "" for plural
  taste: TasteType;
  emoji: string;
  colorTheme: {
    bg: string;
    border: string;
    text: string;
    badgeBg: string;
  };
  introGreeting: string; // e.g. "I am a lemon."
  introTaste: string; // e.g. "I am sour!"
  correctPhrase: string; // e.g. "Lemon is sour!"
}

export const FOOD_DATABASE: Record<FoodId, FoodItemData> = {
  // SOUR FOODS (13)
  lemon: {
    id: 'lemon',
    name: 'Lemon',
    article: 'a',
    taste: 'sour',
    emoji: '🍋',
    colorTheme: {
      bg: 'from-amber-50 to-yellow-100',
      border: 'border-yellow-400',
      text: 'text-amber-900',
      badgeBg: 'bg-yellow-400 text-yellow-950',
    },
    introGreeting: 'I am a lemon.',
    introTaste: 'I am sour!',
    correctPhrase: 'Lemon is sour!',
  },
  lime: {
    id: 'lime',
    name: 'Lime',
    article: 'a',
    taste: 'sour',
    emoji: '🍈',
    colorTheme: {
      bg: 'from-lime-50 to-emerald-100',
      border: 'border-lime-400',
      text: 'text-lime-950',
      badgeBg: 'bg-lime-400 text-lime-950',
    },
    introGreeting: 'I am a lime.',
    introTaste: 'I am sour!',
    correctPhrase: 'Lime is sour!',
  },
  tamarind: {
    id: 'tamarind',
    name: 'Tamarind',
    article: '',
    taste: 'sour',
    emoji: '🟤',
    colorTheme: {
      bg: 'from-amber-100 to-orange-100',
      border: 'border-amber-700',
      text: 'text-amber-950',
      badgeBg: 'bg-amber-700 text-amber-50',
    },
    introGreeting: 'I am tamarind.',
    introTaste: 'I am sour!',
    correctPhrase: 'Tamarind is sour!',
  },
  green_mango: {
    id: 'green_mango',
    name: 'Green Mango',
    article: 'a',
    taste: 'sour',
    emoji: '🥭',
    colorTheme: {
      bg: 'from-emerald-50 to-lime-100',
      border: 'border-emerald-500',
      text: 'text-emerald-950',
      badgeBg: 'bg-emerald-500 text-white',
    },
    introGreeting: 'I am a green mango.',
    introTaste: 'I am sour!',
    correctPhrase: 'Green mango is sour!',
  },
  grapefruit: {
    id: 'grapefruit',
    name: 'Grapefruit',
    article: 'a',
    taste: 'sour',
    emoji: '🍊',
    colorTheme: {
      bg: 'from-rose-50 to-orange-100',
      border: 'border-rose-400',
      text: 'text-rose-950',
      badgeBg: 'bg-rose-400 text-white',
    },
    introGreeting: 'I am a grapefruit.',
    introTaste: 'I am sour!',
    correctPhrase: 'Grapefruit is sour!',
  },
  sour_plum: {
    id: 'sour_plum',
    name: 'Sour Plum',
    article: 'a',
    taste: 'sour',
    emoji: '🟣',
    colorTheme: {
      bg: 'from-purple-50 to-fuchsia-100',
      border: 'border-purple-500',
      text: 'text-purple-950',
      badgeBg: 'bg-purple-600 text-white',
    },
    introGreeting: 'I am a sour plum.',
    introTaste: 'I am sour!',
    correctPhrase: 'Sour plum is sour!',
  },
  cranberry: {
    id: 'cranberry',
    name: 'Cranberry',
    article: 'a',
    taste: 'sour',
    emoji: '🍒',
    colorTheme: {
      bg: 'from-red-50 to-rose-100',
      border: 'border-rose-500',
      text: 'text-rose-950',
      badgeBg: 'bg-rose-600 text-white',
    },
    introGreeting: 'I am a cranberry.',
    introTaste: 'I am sour!',
    correctPhrase: 'Cranberry is sour!',
  },
  sour_cherry: {
    id: 'sour_cherry',
    name: 'Sour Cherry',
    article: 'a',
    taste: 'sour',
    emoji: '🍒',
    colorTheme: {
      bg: 'from-rose-50 to-red-100',
      border: 'border-red-500',
      text: 'text-red-950',
      badgeBg: 'bg-red-600 text-white',
    },
    introGreeting: 'I am a sour cherry.',
    introTaste: 'I am sour!',
    correctPhrase: 'Sour cherry is sour!',
  },
  passion_fruit: {
    id: 'passion_fruit',
    name: 'Passion Fruit',
    article: 'a',
    taste: 'sour',
    emoji: '🟤',
    colorTheme: {
      bg: 'from-purple-50 to-amber-100',
      border: 'border-purple-600',
      text: 'text-purple-950',
      badgeBg: 'bg-purple-700 text-white',
    },
    introGreeting: 'I am a passion fruit.',
    introTaste: 'I am sour!',
    correctPhrase: 'Passion fruit is sour!',
  },
  pomegranate: {
    id: 'pomegranate',
    name: 'Pomegranate',
    article: 'a',
    taste: 'sour',
    emoji: '🔴',
    colorTheme: {
      bg: 'from-rose-50 to-red-100',
      border: 'border-red-600',
      text: 'text-red-950',
      badgeBg: 'bg-red-700 text-white',
    },
    introGreeting: 'I am a pomegranate.',
    introTaste: 'I am sour!',
    correctPhrase: 'Pomegranate is sour!',
  },
  green_apple: {
    id: 'green_apple',
    name: 'Green Apple',
    article: 'a',
    taste: 'sour',
    emoji: '🍏',
    colorTheme: {
      bg: 'from-lime-50 to-green-100',
      border: 'border-lime-500',
      text: 'text-lime-950',
      badgeBg: 'bg-lime-600 text-white',
    },
    introGreeting: 'I am a green apple.',
    introTaste: 'I am sour!',
    correctPhrase: 'Green apple is sour!',
  },
  kiwi: {
    id: 'kiwi',
    name: 'Kiwi',
    article: 'a',
    taste: 'sour',
    emoji: '🥝',
    colorTheme: {
      bg: 'from-lime-50 to-amber-100',
      border: 'border-lime-600',
      text: 'text-lime-950',
      badgeBg: 'bg-lime-600 text-white',
    },
    introGreeting: 'I am a kiwi.',
    introTaste: 'I am sour!',
    correctPhrase: 'Kiwi is sour!',
  },
  pickle: {
    id: 'pickle',
    name: 'Pickle',
    article: 'a',
    taste: 'sour',
    emoji: '🥒',
    colorTheme: {
      bg: 'from-emerald-50 to-green-100',
      border: 'border-emerald-600',
      text: 'text-emerald-950',
      badgeBg: 'bg-emerald-600 text-white',
    },
    introGreeting: 'I am a pickle.',
    introTaste: 'I am sour!',
    correctPhrase: 'Pickle is sour!',
  },

  // SWEET FOODS (15)
  strawberry: {
    id: 'strawberry',
    name: 'Strawberry',
    article: 'a',
    taste: 'sweet',
    emoji: '🍓',
    colorTheme: {
      bg: 'from-rose-50 to-pink-100',
      border: 'border-rose-400',
      text: 'text-rose-950',
      badgeBg: 'bg-rose-500 text-white',
    },
    introGreeting: 'I am a strawberry.',
    introTaste: 'I am sweet!',
    correctPhrase: 'Strawberry is sweet!',
  },
  mango: {
    id: 'mango',
    name: 'Mango',
    article: 'a',
    taste: 'sweet',
    emoji: '🥭',
    colorTheme: {
      bg: 'from-amber-50 to-orange-100',
      border: 'border-amber-400',
      text: 'text-amber-950',
      badgeBg: 'bg-amber-500 text-white',
    },
    introGreeting: 'I am a mango.',
    introTaste: 'I am sweet!',
    correctPhrase: 'Mango is sweet!',
  },
  banana: {
    id: 'banana',
    name: 'Banana',
    article: 'a',
    taste: 'sweet',
    emoji: '🍌',
    colorTheme: {
      bg: 'from-yellow-50 to-amber-100',
      border: 'border-yellow-400',
      text: 'text-yellow-950',
      badgeBg: 'bg-yellow-400 text-yellow-950',
    },
    introGreeting: 'I am a banana.',
    introTaste: 'I am sweet!',
    correctPhrase: 'Banana is sweet!',
  },
  watermelon: {
    id: 'watermelon',
    name: 'Watermelon',
    article: 'a',
    taste: 'sweet',
    emoji: '🍉',
    colorTheme: {
      bg: 'from-emerald-50 to-rose-100',
      border: 'border-emerald-400',
      text: 'text-emerald-950',
      badgeBg: 'bg-emerald-500 text-white',
    },
    introGreeting: 'I am a watermelon.',
    introTaste: 'I am sweet!',
    correctPhrase: 'Watermelon is sweet!',
  },
  grapes: {
    id: 'grapes',
    name: 'Grapes',
    article: '',
    taste: 'sweet',
    emoji: '🍇',
    colorTheme: {
      bg: 'from-purple-50 to-indigo-100',
      border: 'border-purple-400',
      text: 'text-purple-950',
      badgeBg: 'bg-purple-500 text-white',
    },
    introGreeting: 'I am grapes.',
    introTaste: 'I am sweet!',
    correctPhrase: 'Grapes are sweet!',
  },
  apple: {
    id: 'apple',
    name: 'Apple',
    article: 'an',
    taste: 'sweet',
    emoji: '🍎',
    colorTheme: {
      bg: 'from-red-50 to-rose-100',
      border: 'border-red-400',
      text: 'text-red-950',
      badgeBg: 'bg-red-500 text-white',
    },
    introGreeting: 'I am an apple.',
    introTaste: 'I am sweet!',
    correctPhrase: 'Apple is sweet!',
  },
  pear: {
    id: 'pear',
    name: 'Pear',
    article: 'a',
    taste: 'sweet',
    emoji: '🍐',
    colorTheme: {
      bg: 'from-lime-50 to-emerald-100',
      border: 'border-lime-400',
      text: 'text-lime-950',
      badgeBg: 'bg-lime-500 text-white',
    },
    introGreeting: 'I am a pear.',
    introTaste: 'I am sweet!',
    correctPhrase: 'Pear is sweet!',
  },
  pineapple: {
    id: 'pineapple',
    name: 'Pineapple',
    article: 'a',
    taste: 'sweet',
    emoji: '🍍',
    colorTheme: {
      bg: 'from-amber-50 to-yellow-100',
      border: 'border-amber-500',
      text: 'text-amber-950',
      badgeBg: 'bg-amber-500 text-white',
    },
    introGreeting: 'I am a pineapple.',
    introTaste: 'I am sweet!',
    correctPhrase: 'Pineapple is sweet!',
  },
  peach: {
    id: 'peach',
    name: 'Peach',
    article: 'a',
    taste: 'sweet',
    emoji: '🍑',
    colorTheme: {
      bg: 'from-rose-50 to-orange-100',
      border: 'border-orange-400',
      text: 'text-orange-950',
      badgeBg: 'bg-orange-400 text-white',
    },
    introGreeting: 'I am a peach.',
    introTaste: 'I am sweet!',
    correctPhrase: 'Peach is sweet!',
  },
  melon: {
    id: 'melon',
    name: 'Melon',
    article: 'a',
    taste: 'sweet',
    emoji: '🍈',
    colorTheme: {
      bg: 'from-amber-50 to-orange-100',
      border: 'border-amber-400',
      text: 'text-amber-950',
      badgeBg: 'bg-amber-500 text-white',
    },
    introGreeting: 'I am a melon.',
    introTaste: 'I am sweet!',
    correctPhrase: 'Melon is sweet!',
  },
  cherries: {
    id: 'cherries',
    name: 'Cherries',
    article: '',
    taste: 'sweet',
    emoji: '🍒',
    colorTheme: {
      bg: 'from-rose-50 to-red-100',
      border: 'border-red-500',
      text: 'text-red-950',
      badgeBg: 'bg-red-600 text-white',
    },
    introGreeting: 'I am sweet cherries.',
    introTaste: 'I am sweet!',
    correctPhrase: 'Cherries are sweet!',
  },
  papaya: {
    id: 'papaya',
    name: 'Papaya',
    article: 'a',
    taste: 'sweet',
    emoji: '🥭',
    colorTheme: {
      bg: 'from-amber-50 to-orange-100',
      border: 'border-orange-500',
      text: 'text-orange-950',
      badgeBg: 'bg-orange-500 text-white',
    },
    introGreeting: 'I am a papaya.',
    introTaste: 'I am sweet!',
    correctPhrase: 'Papaya is sweet!',
  },
  dates: {
    id: 'dates',
    name: 'Dates',
    article: '',
    taste: 'sweet',
    emoji: '🟤',
    colorTheme: {
      bg: 'from-amber-50 to-amber-100',
      border: 'border-amber-800',
      text: 'text-amber-950',
      badgeBg: 'bg-amber-800 text-amber-50',
    },
    introGreeting: 'I am sweet dates.',
    introTaste: 'I am sweet!',
    correctPhrase: 'Dates are sweet!',
  },
  raisins: {
    id: 'raisins',
    name: 'Raisins',
    article: '',
    taste: 'sweet',
    emoji: '🍇',
    colorTheme: {
      bg: 'from-purple-50 to-amber-100',
      border: 'border-purple-700',
      text: 'text-purple-950',
      badgeBg: 'bg-purple-700 text-white',
    },
    introGreeting: 'I am raisins.',
    introTaste: 'I am sweet!',
    correctPhrase: 'Raisins are sweet!',
  },
  honey: {
    id: 'honey',
    name: 'Honey',
    article: '',
    taste: 'sweet',
    emoji: '🍯',
    colorTheme: {
      bg: 'from-yellow-50 to-amber-100',
      border: 'border-amber-500',
      text: 'text-amber-950',
      badgeBg: 'bg-amber-500 text-white',
    },
    introGreeting: 'I am honey.',
    introTaste: 'I am sweet!',
    correctPhrase: 'Honey is sweet!',
  },
};

export const SOUR_FOOD_IDS: FoodId[] = [
  'lemon',
  'lime',
  'tamarind',
  'green_mango',
  'grapefruit',
  'sour_plum',
  'cranberry',
  'sour_cherry',
  'passion_fruit',
  'pomegranate',
  'green_apple',
  'kiwi',
  'pickle',
];

export const SWEET_FOOD_IDS: FoodId[] = [
  'strawberry',
  'mango',
  'banana',
  'watermelon',
  'grapes',
  'apple',
  'pear',
  'pineapple',
  'peach',
  'melon',
  'cherries',
  'papaya',
  'dates',
  'raisins',
  'honey',
];

interface FoodIllustrationProps {
  foodId: FoodId;
  size?: number | 'sm' | 'md' | 'lg' | 'xl';
  isAnimated?: boolean;
  className?: string;
}

export const Food2DIllustration: React.FC<FoodIllustrationProps> = ({
  foodId,
  size = 'md',
  isAnimated = true,
  className = '',
}) => {
  let dimension = 120;
  if (typeof size === 'number') {
    dimension = size;
  } else {
    switch (size) {
      case 'sm':
        dimension = 64;
        break;
      case 'md':
        dimension = 110;
        break;
      case 'lg':
        dimension = 170;
        break;
      case 'xl':
        dimension = 220;
        break;
    }
  }

  const renderVectorFood = () => {
    switch (foodId) {
      case 'lemon':
        return (
          <svg viewBox="0 0 200 200" width={dimension} height={dimension} className="drop-shadow-md">
            <defs>
              <radialGradient id="lemonGrad" cx="40%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#FFF59D" />
                <stop offset="60%" stopColor="#FDD835" />
                <stop offset="100%" stopColor="#F57F17" />
              </radialGradient>
              <linearGradient id="leafGradLemon" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#A5D6A7" />
                <stop offset="100%" stopColor="#2E7D32" />
              </linearGradient>
            </defs>
            {/* Stem & Leaf */}
            <path d="M120 45 C 135 25, 165 30, 160 55 C 145 60, 125 55, 120 45 Z" fill="url(#leafGradLemon)" stroke="#1B5E20" strokeWidth="3" />
            <path d="M125 48 Q 140 40 155 48" stroke="#81C784" strokeWidth="2" fill="none" />
            <rect x="96" y="38" width="8" height="18" rx="4" fill="#6D4C41" stroke="#3E2723" strokeWidth="2" transform="rotate(-15 100 45)" />

            {/* Lemon Body */}
            <path
              d="M 38 100 C 38 58, 68 45, 100 45 C 138 45, 168 58, 168 100 C 168 142, 138 158, 100 158 C 68 158, 38 142, 38 100 Z"
              fill="url(#lemonGrad)"
              stroke="#F57F17"
              strokeWidth="5"
            />
            {/* Lemon Nibs */}
            <path d="M 34 96 C 24 100, 24 104, 34 106 Z" fill="#FDD835" stroke="#F57F17" strokeWidth="3" />
            <path d="M 172 96 C 182 100, 182 104, 172 106 Z" fill="#FDD835" stroke="#F57F17" strokeWidth="3" />

            {/* Gloss Highlight */}
            <path d="M 60 70 Q 100 56 135 68" stroke="#FFFFFF" strokeWidth="7" strokeLinecap="round" opacity="0.65" fill="none" />
            <circle cx="145" cy="76" r="3.5" fill="#FFFFFF" opacity="0.75" />

            {/* Cute Child Face / Expressions */}
            <ellipse cx="80" cy="100" rx="5" ry="7" fill="#4E342E" />
            <ellipse cx="120" cy="100" rx="5" ry="7" fill="#4E342E" />
            <circle cx="78" cy="98" r="2" fill="#FFFFFF" />
            <circle cx="118" cy="98" r="2" fill="#FFFFFF" />
            {/* Cute Wink / Smile */}
            <path d="M 92 112 Q 100 120 108 112" stroke="#4E342E" strokeWidth="4" strokeLinecap="round" fill="none" />
            {/* Rosy Blush */}
            <circle cx="68" cy="108" r="7" fill="#FF8A80" opacity="0.5" />
            <circle cx="132" cy="108" r="7" fill="#FF8A80" opacity="0.5" />
          </svg>
        );

      case 'lime':
        return (
          <svg viewBox="0 0 200 200" width={dimension} height={dimension} className="drop-shadow-md">
            <defs>
              <radialGradient id="limeGrad" cx="38%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#CCFF90" />
                <stop offset="55%" stopColor="#76FF03" />
                <stop offset="100%" stopColor="#33691E" />
              </radialGradient>
              <linearGradient id="limeLeaf" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#B9F6CA" />
                <stop offset="100%" stopColor="#00C853" />
              </linearGradient>
            </defs>
            {/* Leaf */}
            <path d="M115 45 C 130 20, 160 25, 155 52 C 140 56, 122 52, 115 45 Z" fill="url(#limeLeaf)" stroke="#1B5E20" strokeWidth="3" />
            <rect x="94" y="38" width="7" height="16" rx="3" fill="#5D4037" stroke="#3E2723" strokeWidth="2" transform="rotate(-10 98 44)" />

            {/* Round Lime Body */}
            <circle cx="100" cy="108" r="58" fill="url(#limeGrad)" stroke="#33691E" strokeWidth="5" />
            {/* Little Pointy Tip */}
            <path d="M 40 108 C 34 110, 34 114, 40 116 Z" fill="#76FF03" stroke="#33691E" strokeWidth="2" />
            <path d="M 160 108 C 166 110, 166 114, 160 116 Z" fill="#76FF03" stroke="#33691E" strokeWidth="2" />

            {/* Shimmer Highlight */}
            <path d="M 68 76 Q 95 62 128 72" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" opacity="0.65" fill="none" />

            {/* Cute Face */}
            <ellipse cx="82" cy="108" rx="4.5" ry="6.5" fill="#1B5E20" />
            <ellipse cx="118" cy="108" rx="4.5" ry="6.5" fill="#1B5E20" />
            <circle cx="80" cy="106" r="1.8" fill="#FFFFFF" />
            <circle cx="116" cy="106" r="1.8" fill="#FFFFFF" />
            <path d="M 94 118 Q 100 126 106 118" stroke="#1B5E20" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <circle cx="70" cy="116" r="6" fill="#69F0AE" opacity="0.6" />
            <circle cx="130" cy="116" r="6" fill="#69F0AE" opacity="0.6" />
          </svg>
        );

      case 'tamarind':
        return (
          <svg viewBox="0 0 200 200" width={dimension} height={dimension} className="drop-shadow-md">
            <defs>
              <linearGradient id="tamarindGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#A1887F" />
                <stop offset="40%" stopColor="#795548" />
                <stop offset="100%" stopColor="#4E342E" />
              </linearGradient>
              <linearGradient id="tamarindLeaf" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#C8E6C9" />
                <stop offset="100%" stopColor="#388E3C" />
              </linearGradient>
            </defs>
            {/* Small leaves on stem */}
            <path d="M60 48 Q 50 35 40 40 Q 50 48 60 48 Z" fill="url(#tamarindLeaf)" stroke="#2E7D32" strokeWidth="1.5" />
            <path d="M72 44 Q 70 28 60 32 Q 68 42 72 44 Z" fill="url(#tamarindLeaf)" stroke="#2E7D32" strokeWidth="1.5" />
            <path d="M85 45 Q 90 30 80 32 Q 82 42 85 45 Z" fill="url(#tamarindLeaf)" stroke="#2E7D32" strokeWidth="1.5" />
            <path d="M50 48 Q 80 44 110 52" stroke="#5D4037" strokeWidth="4" strokeLinecap="round" fill="none" />

            {/* Segmented Tamarind Pod */}
            <g stroke="#3E2723" strokeWidth="4" fill="url(#tamarindGrad)">
              <circle cx="62" cy="78" r="24" />
              <circle cx="88" cy="100" r="26" />
              <circle cx="118" cy="122" r="27" />
              <circle cx="148" cy="144" r="22" />
            </g>

            {/* Highlight Sheen on Pod Segments */}
            <path d="M 52 68 Q 62 62 72 68" stroke="#D7CCC8" strokeWidth="3" strokeLinecap="round" opacity="0.7" fill="none" />
            <path d="M 78 88 Q 88 82 98 88" stroke="#D7CCC8" strokeWidth="3.5" strokeLinecap="round" opacity="0.7" fill="none" />
            <path d="M 108 110 Q 118 104 128 110" stroke="#D7CCC8" strokeWidth="3.5" strokeLinecap="round" opacity="0.7" fill="none" />

            {/* Cute Face on Center Pod */}
            <ellipse cx="82" cy="98" rx="4" ry="5.5" fill="#271C19" />
            <ellipse cx="98" cy="102" rx="4" ry="5.5" fill="#271C19" />
            <circle cx="81" cy="96" r="1.5" fill="#FFFFFF" />
            <circle cx="97" cy="100" r="1.5" fill="#FFFFFF" />
            <path d="M 87 109 Q 92 114 97 110" stroke="#271C19" strokeWidth="3" strokeLinecap="round" fill="none" />
          </svg>
        );

      case 'green_mango':
        return (
          <svg viewBox="0 0 200 200" width={dimension} height={dimension} className="drop-shadow-md">
            <defs>
              <radialGradient id="greenMangoGrad" cx="35%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#D4E157" />
                <stop offset="45%" stopColor="#8BC34A" />
                <stop offset="85%" stopColor="#4CAF50" />
                <stop offset="100%" stopColor="#2E7D32" />
              </radialGradient>
            </defs>
            {/* Stem */}
            <path d="M 98 32 Q 95 20 85 24" stroke="#5D4037" strokeWidth="5" strokeLinecap="round" fill="none" />
            {/* Leaf */}
            <path d="M 96 32 C 120 18, 145 28, 138 52 C 120 54, 102 46, 96 32 Z" fill="#388E3C" stroke="#1B5E20" strokeWidth="2.5" />

            {/* Mango Kidney Shape */}
            <path
              d="M 95 38 C 135 38, 160 70, 160 115 C 160 160, 125 178, 85 172 C 55 168, 42 135, 48 95 C 52 65, 70 38, 95 38 Z"
              fill="url(#greenMangoGrad)"
              stroke="#2E7D32"
              strokeWidth="5"
            />
            {/* Gloss Arc */}
            <path d="M 68 62 Q 95 48 125 58" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" opacity="0.65" fill="none" />

            {/* Face */}
            <ellipse cx="88" cy="105" rx="5" ry="7" fill="#1B5E20" />
            <ellipse cx="125" cy="108" rx="5" ry="7" fill="#1B5E20" />
            <circle cx="86" cy="103" r="2" fill="#FFFFFF" />
            <circle cx="123" cy="106" r="2" fill="#FFFFFF" />
            <path d="M 100 122 Q 108 130 116 123" stroke="#1B5E20" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <circle cx="75" cy="115" r="7" fill="#CDDC39" opacity="0.6" />
            <circle cx="138" cy="118" r="7" fill="#CDDC39" opacity="0.6" />
          </svg>
        );

      case 'grapefruit':
        return (
          <svg viewBox="0 0 200 200" width={dimension} height={dimension} className="drop-shadow-md">
            <defs>
              <radialGradient id="gfOuter" cx="40%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#FFE082" />
                <stop offset="60%" stopColor="#FFA726" />
                <stop offset="100%" stopColor="#F57C00" />
              </radialGradient>
              <radialGradient id="gfFlesh" cx="45%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#FF8A80" />
                <stop offset="70%" stopColor="#FF5252" />
                <stop offset="100%" stopColor="#D50000" />
              </radialGradient>
            </defs>
            {/* Outer Rind */}
            <circle cx="100" cy="102" r="62" fill="url(#gfOuter)" stroke="#E65100" strokeWidth="4.5" />
            {/* White Rind */}
            <circle cx="100" cy="102" r="54" fill="#FFFDE7" />
            {/* Pink Flesh Segments */}
            <circle cx="100" cy="102" r="48" fill="url(#gfFlesh)" />

            {/* Citrus Segments overlay */}
            <g stroke="#FFFDE7" strokeWidth="3" fill="none">
              <line x1="100" y1="54" x2="100" y2="150" />
              <line x1="52" y1="102" x2="148" y2="102" />
              <line x1="66" y1="68" x2="134" y2="136" />
              <line x1="66" y1="136" x2="134" y2="68" />
            </g>
            <circle cx="100" cy="102" r="8" fill="#FFFDE7" />

            {/* Cute Face Center */}
            <ellipse cx="86" cy="98" rx="4" ry="6" fill="#3E2723" />
            <ellipse cx="114" cy="98" rx="4" ry="6" fill="#3E2723" />
            <circle cx="85" cy="96" r="1.5" fill="#FFFFFF" />
            <circle cx="113" cy="96" r="1.5" fill="#FFFFFF" />
            <path d="M 94 110 Q 100 116 106 110" stroke="#3E2723" strokeWidth="3" strokeLinecap="round" fill="none" />
          </svg>
        );

      case 'sour_plum':
        return (
          <svg viewBox="0 0 200 200" width={dimension} height={dimension} className="drop-shadow-md">
            <defs>
              <radialGradient id="plumGrad" cx="35%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#E1BEE7" />
                <stop offset="40%" stopColor="#BA68C8" />
                <stop offset="80%" stopColor="#7B1FA2" />
                <stop offset="100%" stopColor="#4A148C" />
              </radialGradient>
            </defs>
            {/* Stem & Leaf */}
            <path d="M 100 38 Q 96 22 84 26" stroke="#4E342E" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            <path d="M 98 34 C 122 20, 144 30, 138 52 C 120 54, 104 46, 98 34 Z" fill="#66BB6A" stroke="#2E7D32" strokeWidth="2.5" />

            {/* Plum Body */}
            <path
              d="M 100 48 C 138 48, 162 76, 162 114 C 162 152, 134 168, 100 166 C 66 168, 38 152, 38 114 C 38 76, 62 48, 100 48 Z"
              fill="url(#plumGrad)"
              stroke="#4A148C"
              strokeWidth="5"
            />
            {/* Characteristic Plum Crease */}
            <path d="M 100 48 Q 98 100 100 166" stroke="#4A148C" strokeWidth="3" opacity="0.5" strokeLinecap="round" fill="none" />
            {/* Gloss Highlight */}
            <path d="M 62 72 Q 88 58 120 66" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" opacity="0.65" fill="none" />

            {/* Face */}
            <ellipse cx="80" cy="112" rx="4.5" ry="6.5" fill="#311B92" />
            <ellipse cx="120" cy="112" rx="4.5" ry="6.5" fill="#311B92" />
            <circle cx="78" cy="110" r="1.8" fill="#FFFFFF" />
            <circle cx="118" cy="110" r="1.8" fill="#FFFFFF" />
            <path d="M 94 124 Q 100 132 106 124" stroke="#311B92" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <circle cx="68" cy="120" r="6" fill="#F48FB1" opacity="0.6" />
            <circle cx="132" cy="120" r="6" fill="#F48FB1" opacity="0.6" />
          </svg>
        );

      case 'cranberry':
        return (
          <svg viewBox="0 0 200 200" width={dimension} height={dimension} className="drop-shadow-md">
            <defs>
              <radialGradient id="cranGrad" cx="35%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#FF5252" />
                <stop offset="45%" stopColor="#D50000" />
                <stop offset="85%" stopColor="#880E4F" />
                <stop offset="100%" stopColor="#4A0033" />
              </radialGradient>
            </defs>
            {/* Leaves */}
            <path d="M 80 50 C 65 30, 95 20, 105 45 Z" fill="#43A047" stroke="#1B5E20" strokeWidth="2" />
            <path d="M 120 50 C 135 30, 105 20, 95 45 Z" fill="#43A047" stroke="#1B5E20" strokeWidth="2" />
            {/* Cranberry 1 (back left) */}
            <circle cx="68" cy="120" r="32" fill="url(#cranGrad)" stroke="#880E4F" strokeWidth="3.5" />
            {/* Cranberry 2 (back right) */}
            <circle cx="135" cy="120" r="30" fill="url(#cranGrad)" stroke="#880E4F" strokeWidth="3.5" />
            {/* Cranberry 3 (front center) */}
            <circle cx="100" cy="100" r="42" fill="url(#cranGrad)" stroke="#4A0033" strokeWidth="4.5" />
            {/* Top Calyx Star */}
            <path d="M 96 64 L 100 58 L 104 64 L 108 60 L 105 66 L 100 68 Z" fill="#2E7D32" />
            {/* Gloss highlight */}
            <path d="M 75 80 Q 95 68 118 75" stroke="#FFFFFF" strokeWidth="5.5" strokeLinecap="round" opacity="0.7" fill="none" />
            {/* Cute Face */}
            <ellipse cx="86" cy="102" rx="4" ry="6" fill="#311B92" />
            <ellipse cx="114" cy="102" rx="4" ry="6" fill="#311B92" />
            <circle cx="84" cy="100" r="1.5" fill="#FFFFFF" />
            <circle cx="112" cy="100" r="1.5" fill="#FFFFFF" />
            <path d="M 94 114 Q 100 120 106 114" stroke="#311B92" strokeWidth="3" strokeLinecap="round" fill="none" />
            <circle cx="74" cy="110" r="5" fill="#FF8A80" opacity="0.6" />
            <circle cx="126" cy="110" r="5" fill="#FF8A80" opacity="0.6" />
          </svg>
        );

      case 'sour_cherry':
        return (
          <svg viewBox="0 0 200 200" width={dimension} height={dimension} className="drop-shadow-md">
            <defs>
              <radialGradient id="sourCherryGrad" cx="35%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#FF5252" />
                <stop offset="45%" stopColor="#E53935" />
                <stop offset="85%" stopColor="#B71C1C" />
                <stop offset="100%" stopColor="#7F0000" />
              </radialGradient>
            </defs>
            {/* Stems meeting at top */}
            <path d="M 68 95 C 60 40, 95 30, 105 20" stroke="#5D4037" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M 132 108 C 130 50, 105 30, 105 20" stroke="#5D4037" strokeWidth="4" strokeLinecap="round" fill="none" />
            {/* Leaf at stem joint */}
            <path d="M 105 20 C 130 10, 150 25, 140 45 C 120 45, 110 32, 105 20 Z" fill="#66BB6A" stroke="#2E7D32" strokeWidth="2.5" />

            {/* Left Sour Cherry */}
            <circle cx="68" cy="120" r="38" fill="url(#sourCherryGrad)" stroke="#7F0000" strokeWidth="4" />
            <path d="M 48 100 Q 64 90 84 96" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" opacity="0.7" fill="none" />
            <ellipse cx="58" cy="120" rx="3.5" ry="5" fill="#212121" />
            <ellipse cx="78" cy="120" rx="3.5" ry="5" fill="#212121" />
            <path d="M 63 130 Q 68 135 73 130" stroke="#212121" strokeWidth="2.5" strokeLinecap="round" fill="none" />

            {/* Right Sour Cherry */}
            <circle cx="132" cy="132" r="36" fill="url(#sourCherryGrad)" stroke="#7F0000" strokeWidth="4" />
            <path d="M 112 114 Q 128 104 148 110" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" opacity="0.7" fill="none" />
            <ellipse cx="122" cy="132" rx="3.5" ry="5" fill="#212121" />
            <ellipse cx="142" cy="132" rx="3.5" ry="5" fill="#212121" />
            <path d="M 127 142 Q 132 147 137 142" stroke="#212121" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </svg>
        );

      case 'passion_fruit':
        return (
          <svg viewBox="0 0 200 200" width={dimension} height={dimension} className="drop-shadow-md">
            <defs>
              <radialGradient id="passionRind" cx="35%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#7E57C2" />
                <stop offset="60%" stopColor="#4527A0" />
                <stop offset="100%" stopColor="#260e58" />
              </radialGradient>
              <radialGradient id="passionPulp" cx="45%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#FFF176" />
                <stop offset="60%" stopColor="#FBC02D" />
                <stop offset="100%" stopColor="#F57F17" />
              </radialGradient>
            </defs>
            {/* Outer Purple Rind */}
            <circle cx="100" cy="102" r="62" fill="url(#passionRind)" stroke="#260e58" strokeWidth="5" />
            {/* Inner White Rind */}
            <circle cx="100" cy="102" r="52" fill="#FFFDE7" />
            {/* Juicy Golden Pulp */}
            <circle cx="100" cy="102" r="46" fill="url(#passionPulp)" />

            {/* Black Seeds in Pulp */}
            <g fill="#212121">
              <ellipse cx="78" cy="80" rx="3" ry="5" transform="rotate(-20 78 80)" />
              <ellipse cx="122" cy="80" rx="3" ry="5" transform="rotate(20 122 80)" />
              <ellipse cx="72" cy="115" rx="3.5" ry="5" transform="rotate(15 72 115)" />
              <ellipse cx="128" cy="115" rx="3.5" ry="5" transform="rotate(-15 128 115)" />
              <ellipse cx="100" cy="74" rx="3" ry="5" />
              <ellipse cx="100" cy="132" rx="3.5" ry="5" />
            </g>

            {/* Face in Center */}
            <ellipse cx="88" cy="98" rx="4" ry="6" fill="#3E2723" />
            <ellipse cx="112" cy="98" rx="4" ry="6" fill="#3E2723" />
            <circle cx="87" cy="96" r="1.5" fill="#FFFFFF" />
            <circle cx="111" cy="96" r="1.5" fill="#FFFFFF" />
            <path d="M 94 110 Q 100 116 106 110" stroke="#3E2723" strokeWidth="3" strokeLinecap="round" fill="none" />
          </svg>
        );

      case 'pomegranate':
        return (
          <svg viewBox="0 0 200 200" width={dimension} height={dimension} className="drop-shadow-md">
            <defs>
              <radialGradient id="pomGrad" cx="35%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#EF5350" />
                <stop offset="45%" stopColor="#C62828" />
                <stop offset="85%" stopColor="#8E0000" />
                <stop offset="100%" stopColor="#4A0000" />
              </radialGradient>
            </defs>
            {/* Crown / Calyx Top */}
            <path d="M 85 45 L 80 25 L 92 35 L 100 22 L 108 35 L 120 25 L 115 45 Z" fill="#C62828" stroke="#4A0000" strokeWidth="3" />

            {/* Pomegranate Round Body */}
            <circle cx="100" cy="110" r="58" fill="url(#pomGrad)" stroke="#4A0000" strokeWidth="5" />

            {/* Cut section showing ruby jewel seeds */}
            <path d="M 100 85 C 135 85, 148 115, 140 145 C 115 152, 95 130, 100 85 Z" fill="#FFEBEE" stroke="#C62828" strokeWidth="2" />
            <g fill="#D50000">
              <circle cx="112" cy="105" r="4" />
              <circle cx="124" cy="100" r="4" />
              <circle cx="134" cy="112" r="4" />
              <circle cx="118" cy="118" r="4.5" />
              <circle cx="128" cy="128" r="4" />
              <circle cx="110" cy="132" r="4" />
            </g>

            {/* Face on Left Side */}
            <ellipse cx="68" cy="106" rx="4.5" ry="6.5" fill="#212121" />
            <ellipse cx="88" cy="106" rx="4.5" ry="6.5" fill="#212121" />
            <circle cx="66" cy="104" r="1.8" fill="#FFFFFF" />
            <circle cx="86" cy="104" r="1.8" fill="#FFFFFF" />
            <path d="M 72 118 Q 78 124 84 118" stroke="#212121" strokeWidth="3" strokeLinecap="round" fill="none" />
            <circle cx="58" cy="114" r="5" fill="#FF8A80" opacity="0.6" />
          </svg>
        );

      case 'green_apple':
        return (
          <svg viewBox="0 0 200 200" width={dimension} height={dimension} className="drop-shadow-md">
            <defs>
              <radialGradient id="greenAppleGrad" cx="35%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#CCFF90" />
                <stop offset="45%" stopColor="#76FF03" />
                <stop offset="85%" stopColor="#43A047" />
                <stop offset="100%" stopColor="#1B5E20" />
              </radialGradient>
            </defs>
            {/* Stem & Leaf */}
            <path d="M 100 42 Q 102 22 92 18" stroke="#5D4037" strokeWidth="5" strokeLinecap="round" fill="none" />
            <path d="M 100 36 C 125 22, 146 32, 140 54 C 122 56, 106 48, 100 36 Z" fill="#66BB6A" stroke="#2E7D32" strokeWidth="2.5" />

            {/* Apple Body with double lobes */}
            <path
              d="M 100 52 C 122 45, 158 52, 162 95 C 166 142, 132 172, 100 166 C 68 172, 34 142, 38 95 C 42 52, 78 45, 100 52 Z"
              fill="url(#greenAppleGrad)"
              stroke="#1B5E20"
              strokeWidth="5"
            />
            {/* Gloss highlight arc */}
            <path d="M 58 72 Q 82 58 115 65" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" opacity="0.65" fill="none" />
            <circle cx="126" cy="72" r="3.5" fill="#FFFFFF" opacity="0.75" />

            {/* Face */}
            <ellipse cx="80" cy="108" rx="5" ry="7" fill="#1B5E20" />
            <ellipse cx="120" cy="108" rx="5" ry="7" fill="#1B5E20" />
            <circle cx="78" cy="106" r="2" fill="#FFFFFF" />
            <circle cx="118" cy="106" r="2" fill="#FFFFFF" />
            <path d="M 94 120 Q 100 128 106 120" stroke="#1B5E20" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <circle cx="68" cy="116" r="7" fill="#B2FF59" opacity="0.6" />
            <circle cx="132" cy="116" r="7" fill="#B2FF59" opacity="0.6" />
          </svg>
        );

      case 'kiwi':
        return (
          <svg viewBox="0 0 200 200" width={dimension} height={dimension} className="drop-shadow-md">
            <defs>
              <radialGradient id="kiwiFlesh" cx="45%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#FFF9C4" />
                <stop offset="35%" stopColor="#CCFF90" />
                <stop offset="70%" stopColor="#76FF03" />
                <stop offset="100%" stopColor="#43A047" />
              </radialGradient>
            </defs>
            {/* Fuzzy Brown Outer Skin */}
            <circle cx="100" cy="102" r="62" fill="#6D4C41" stroke="#3E2723" strokeWidth="5" />
            {/* Bright Green Flesh */}
            <circle cx="100" cy="102" r="52" fill="url(#kiwiFlesh)" />

            {/* Center Starburst White Core */}
            <ellipse cx="100" cy="102" rx="14" ry="18" fill="#FFFDE7" />

            {/* Black Seeds radiating */}
            <g fill="#212121">
              <ellipse cx="80" cy="85" rx="2" ry="4" transform="rotate(-30 80 85)" />
              <ellipse cx="120" cy="85" rx="2" ry="4" transform="rotate(30 120 85)" />
              <ellipse cx="72" cy="102" rx="2" ry="4" transform="rotate(-80 72 102)" />
              <ellipse cx="128" cy="102" rx="2" ry="4" transform="rotate(80 128 102)" />
              <ellipse cx="80" cy="120" rx="2" ry="4" transform="rotate(-130 80 120)" />
              <ellipse cx="120" cy="120" rx="2" ry="4" transform="rotate(130 120 120)" />
            </g>

            {/* Face in Center */}
            <ellipse cx="90" cy="98" rx="3.5" ry="5.5" fill="#33691E" />
            <ellipse cx="110" cy="98" rx="3.5" ry="5.5" fill="#33691E" />
            <circle cx="89" cy="96" r="1.2" fill="#FFFFFF" />
            <circle cx="109" cy="96" r="1.2" fill="#FFFFFF" />
            <path d="M 95 108 Q 100 114 105 108" stroke="#33691E" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </svg>
        );

      case 'pickle':
        return (
          <svg viewBox="0 0 200 200" width={dimension} height={dimension} className="drop-shadow-md">
            <defs>
              <radialGradient id="pickleGrad" cx="35%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#AEEA00" />
                <stop offset="45%" stopColor="#64DD17" />
                <stop offset="85%" stopColor="#33691E" />
                <stop offset="100%" stopColor="#1B5E20" />
              </radialGradient>
            </defs>
            {/* Pickle Curved Cucumber Body */}
            <path
              d="M 60 55 C 80 40, 130 45, 145 75 C 160 110, 150 150, 120 168 C 88 185, 48 160, 48 120 C 48 85, 45 68, 60 55 Z"
              fill="url(#pickleGrad)"
              stroke="#1B5E20"
              strokeWidth="5"
            />
            {/* Characteristic Pickle Bumps / Dots */}
            <g fill="#2E7D32" opacity="0.7">
              <circle cx="65" cy="80" r="4.5" />
              <circle cx="90" cy="65" r="5" />
              <circle cx="125" cy="80" r="4.5" />
              <circle cx="70" cy="125" r="5" />
              <circle cx="135" cy="120" r="5.5" />
              <circle cx="105" cy="155" r="5" />
            </g>
            {/* Gloss highlight */}
            <path d="M 70 65 Q 105 55 130 75" stroke="#FFFFFF" strokeWidth="5.5" strokeLinecap="round" opacity="0.6" fill="none" />

            {/* Happy Sour Wink Face */}
            <ellipse cx="85" cy="100" rx="5" ry="7" fill="#1B5E20" />
            <ellipse cx="118" cy="105" rx="5" ry="7" fill="#1B5E20" />
            <circle cx="83" cy="98" r="2" fill="#FFFFFF" />
            <circle cx="116" cy="103" r="2" fill="#FFFFFF" />
            <path d="M 94 118 Q 102 128 110 120" stroke="#1B5E20" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <circle cx="72" cy="112" r="6" fill="#CCFF90" opacity="0.6" />
            <circle cx="130" cy="118" r="6" fill="#CCFF90" opacity="0.6" />
          </svg>
        );

      case 'strawberry':
        return (
          <svg viewBox="0 0 200 200" width={dimension} height={dimension} className="drop-shadow-md">
            <defs>
              <radialGradient id="strawGrad" cx="35%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#FF8A80" />
                <stop offset="45%" stopColor="#FF1744" />
                <stop offset="90%" stopColor="#D50000" />
                <stop offset="100%" stopColor="#B71C1C" />
              </radialGradient>
              <linearGradient id="strawLeaf" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#81C784" />
                <stop offset="100%" stopColor="#2E7D32" />
              </linearGradient>
            </defs>
            {/* Strawberry Heart Body */}
            <path
              d="M 100 178 C 50 148, 38 108, 42 78 C 46 54, 72 48, 100 55 C 128 48, 154 54, 158 78 C 162 108, 150 148, 100 178 Z"
              fill="url(#strawGrad)"
              stroke="#B71C1C"
              strokeWidth="5"
            />
            {/* Cute Yellow Seeds */}
            <g fill="#FFF59D" stroke="#F57F17" strokeWidth="1">
              <ellipse cx="68" cy="80" rx="2.5" ry="4" transform="rotate(-15 68 80)" />
              <ellipse cx="132" cy="80" rx="2.5" ry="4" transform="rotate(15 132 80)" />
              <ellipse cx="60" cy="115" rx="2.5" ry="4" transform="rotate(-10 60 115)" />
              <ellipse cx="140" cy="115" rx="2.5" ry="4" transform="rotate(10 140 115)" />
              <ellipse cx="80" cy="145" rx="2.5" ry="4" transform="rotate(-5 80 145)" />
              <ellipse cx="120" cy="145" rx="2.5" ry="4" transform="rotate(5 120 145)" />
              <ellipse cx="100" cy="162" rx="2" ry="3.5" />
            </g>

            {/* Gloss Highlight */}
            <path d="M 64 68 Q 85 58 100 62" stroke="#FFFFFF" strokeWidth="5.5" strokeLinecap="round" opacity="0.65" fill="none" />

            {/* Leafy Crown Top */}
            <path
              d="M 100 24 C 98 42, 60 48, 45 42 C 60 58, 80 58, 85 64 C 70 74, 90 76, 100 65 C 110 76, 130 74, 115 64 C 120 58, 140 58, 155 42 C 140 48, 102 42, 100 24 Z"
              fill="url(#strawLeaf)"
              stroke="#1B5E20"
              strokeWidth="3"
            />
            {/* Small Stem */}
            <path d="M 100 30 Q 102 18 96 14" stroke="#5D4037" strokeWidth="4" strokeLinecap="round" fill="none" />

            {/* Face */}
            <ellipse cx="84" cy="106" rx="5" ry="7" fill="#3E2723" />
            <ellipse cx="116" cy="106" rx="5" ry="7" fill="#3E2723" />
            <circle cx="82" cy="104" r="2" fill="#FFFFFF" />
            <circle cx="114" cy="104" r="2" fill="#FFFFFF" />
            <path d="M 94 118 Q 100 126 106 118" stroke="#3E2723" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <circle cx="70" cy="116" r="6.5" fill="#FF8A80" opacity="0.7" />
            <circle cx="130" cy="116" r="6.5" fill="#FF8A80" opacity="0.7" />
          </svg>
        );

      case 'mango':
        return (
          <svg viewBox="0 0 200 200" width={dimension} height={dimension} className="drop-shadow-md">
            <defs>
              <radialGradient id="mangoGrad" cx="35%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#FFF176" />
                <stop offset="35%" stopColor="#FFB74D" />
                <stop offset="70%" stopColor="#FF9800" />
                <stop offset="100%" stopColor="#F57C00" />
              </radialGradient>
            </defs>
            {/* Stem */}
            <path d="M 98 32 Q 95 18 85 22" stroke="#5D4037" strokeWidth="5" strokeLinecap="round" fill="none" />
            {/* Leaf */}
            <path d="M 96 30 C 122 16, 146 26, 140 50 C 122 52, 102 44, 96 30 Z" fill="#43A047" stroke="#1B5E20" strokeWidth="2.5" />

            {/* Golden Ripe Mango Shape */}
            <path
              d="M 95 38 C 135 38, 162 70, 162 115 C 162 160, 125 178, 85 172 C 55 168, 40 135, 46 95 C 50 65, 70 38, 95 38 Z"
              fill="url(#mangoGrad)"
              stroke="#E65100"
              strokeWidth="5"
            />
            {/* Gloss highlight */}
            <path d="M 68 62 Q 95 48 125 58" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" opacity="0.65" fill="none" />

            {/* Sweet Face */}
            <ellipse cx="88" cy="105" rx="5" ry="7" fill="#4E342E" />
            <ellipse cx="125" cy="108" rx="5" ry="7" fill="#4E342E" />
            <circle cx="86" cy="103" r="2" fill="#FFFFFF" />
            <circle cx="123" cy="106" r="2" fill="#FFFFFF" />
            <path d="M 100 122 Q 108 132 116 123" stroke="#4E342E" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <circle cx="74" cy="116" r="7" fill="#FF8A80" opacity="0.6" />
            <circle cx="138" cy="118" r="7" fill="#FF8A80" opacity="0.6" />
          </svg>
        );

      case 'banana':
        return (
          <svg viewBox="0 0 200 200" width={dimension} height={dimension} className="drop-shadow-md">
            <defs>
              <linearGradient id="bananaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFF9C4" />
                <stop offset="35%" stopColor="#FFEE58" />
                <stop offset="85%" stopColor="#FDD835" />
                <stop offset="100%" stopColor="#FBC02D" />
              </linearGradient>
            </defs>
            {/* Top Stem */}
            <path d="M 148 40 C 158 35, 165 42, 160 52 L 148 50 Z" fill="#689F38" stroke="#33691E" strokeWidth="2.5" />
            {/* Bottom Tip */}
            <path d="M 38 135 C 32 142, 36 148, 42 146 Z" fill="#5D4037" stroke="#3E2723" strokeWidth="2" />

            {/* Curved Banana Body */}
            <path
              d="M 152 46 C 145 75, 120 135, 42 144 C 65 162, 130 162, 158 58 Z"
              fill="url(#bananaGrad)"
              stroke="#F57F17"
              strokeWidth="5"
            />
            {/* Banana Ridge Line */}
            <path d="M 148 52 C 135 90, 105 138, 45 142" stroke="#FBC02D" strokeWidth="3" opacity="0.6" fill="none" />
            {/* Highlight */}
            <path d="M 140 65 Q 120 100 85 130" stroke="#FFFFFF" strokeWidth="5.5" strokeLinecap="round" opacity="0.6" fill="none" />

            {/* Face on banana curve */}
            <ellipse cx="106" cy="116" rx="4.5" ry="6.5" fill="#4E342E" />
            <ellipse cx="132" cy="98" rx="4.5" ry="6.5" fill="#4E342E" />
            <circle cx="104" cy="114" r="1.8" fill="#FFFFFF" />
            <circle cx="130" cy="96" r="1.8" fill="#FFFFFF" />
            <path d="M 115 116 Q 124 122 128 110" stroke="#4E342E" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <circle cx="95" cy="122" r="6" fill="#FF8A80" opacity="0.6" />
            <circle cx="140" cy="104" r="6" fill="#FF8A80" opacity="0.6" />
          </svg>
        );

      case 'watermelon':
        return (
          <svg viewBox="0 0 200 200" width={dimension} height={dimension} className="drop-shadow-md">
            <defs>
              <radialGradient id="wmFlesh" cx="50%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#FF8A80" />
                <stop offset="60%" stopColor="#FF1744" />
                <stop offset="100%" stopColor="#D50000" />
              </radialGradient>
            </defs>
            {/* Outer Green Striped Rind */}
            <path
              d="M 28 85 C 38 160, 162 160, 172 85 Z"
              fill="#2E7D32"
              stroke="#1B5E20"
              strokeWidth="5"
            />
            {/* Inner Light Green / White Rind */}
            <path
              d="M 34 85 C 44 150, 156 150, 166 85 Z"
              fill="#DCEDC8"
            />
            {/* Juicy Red Flesh */}
            <path
              d="M 40 85 C 48 140, 152 140, 160 85 Z"
              fill="url(#wmFlesh)"
            />

            {/* Black Seeds */}
            <g fill="#212121">
              <ellipse cx="68" cy="100" rx="3" ry="5" transform="rotate(-15 68 100)" />
              <ellipse cx="132" cy="100" rx="3" ry="5" transform="rotate(15 132 100)" />
              <ellipse cx="82" cy="120" rx="3" ry="5" transform="rotate(-5 82 120)" />
              <ellipse cx="118" cy="120" rx="3" ry="5" transform="rotate(5 118 120)" />
              <ellipse cx="100" cy="105" rx="3" ry="5" />
            </g>

            {/* Gloss on Top Edge */}
            <path d="M 46 88 L 154 88" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" opacity="0.6" />

            {/* Cute Smile Face */}
            <ellipse cx="88" cy="102" rx="4.5" ry="6" fill="#212121" />
            <ellipse cx="112" cy="102" rx="4.5" ry="6" fill="#212121" />
            <circle cx="87" cy="100" r="1.5" fill="#FFFFFF" />
            <circle cx="111" cy="100" r="1.5" fill="#FFFFFF" />
            <path d="M 94 114 Q 100 120 106 114" stroke="#212121" strokeWidth="3" strokeLinecap="round" fill="none" />
          </svg>
        );

      case 'grapes':
        return (
          <svg viewBox="0 0 200 200" width={dimension} height={dimension} className="drop-shadow-md">
            <defs>
              <radialGradient id="grapeGrad" cx="35%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#E1BEE7" />
                <stop offset="45%" stopColor="#AB47BC" />
                <stop offset="85%" stopColor="#7B1FA2" />
                <stop offset="100%" stopColor="#4A148C" />
              </radialGradient>
            </defs>
            {/* Vine & Leaf */}
            <path d="M 100 45 Q 105 25 125 22 Q 115 35 105 45" stroke="#5D4037" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M 85 40 C 60 25, 45 45, 62 60 C 75 55, 82 48, 85 40 Z" fill="#66BB6A" stroke="#2E7D32" strokeWidth="2.5" />

            {/* Grape Cluster of spheres */}
            <g stroke="#4A148C" strokeWidth="3.5" fill="url(#grapeGrad)">
              <circle cx="75" cy="70" r="18" />
              <circle cx="105" cy="66" r="19" />
              <circle cx="132" cy="74" r="17" />
              <circle cx="64" cy="98" r="18" />
              <circle cx="94" cy="95" r="20" />
              <circle cx="124" cy="98" r="19" />
              <circle cx="148" cy="102" r="15" />
              <circle cx="78" cy="126" r="18" />
              <circle cx="108" cy="125" r="19" />
              <circle cx="134" cy="126" r="16" />
              <circle cx="92" cy="152" r="17" />
              <circle cx="118" cy="150" r="15" />
              <circle cx="104" cy="172" r="13" />
            </g>

            {/* Shimmers on grapes */}
            <circle cx="98" cy="88" r="3.5" fill="#FFFFFF" opacity="0.75" />
            <circle cx="68" cy="64" r="3" fill="#FFFFFF" opacity="0.75" />
            <circle cx="126" cy="92" r="3" fill="#FFFFFF" opacity="0.75" />

            {/* Face on Main Center Grape */}
            <ellipse cx="88" cy="95" rx="3.5" ry="5" fill="#2E0854" />
            <ellipse cx="102" cy="95" rx="3.5" ry="5" fill="#2E0854" />
            <circle cx="87" cy="93" r="1.2" fill="#FFFFFF" />
            <circle cx="101" cy="93" r="1.2" fill="#FFFFFF" />
            <path d="M 91 103 Q 95 107 99 103" stroke="#2E0854" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </svg>
        );

      case 'apple':
        return (
          <svg viewBox="0 0 200 200" width={dimension} height={dimension} className="drop-shadow-md">
            <defs>
              <radialGradient id="appleGrad" cx="35%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#FF8A80" />
                <stop offset="45%" stopColor="#E53935" />
                <stop offset="85%" stopColor="#C62828" />
                <stop offset="100%" stopColor="#8E0000" />
              </radialGradient>
            </defs>
            {/* Stem & Leaf */}
            <path d="M 100 42 Q 102 22 92 18" stroke="#5D4037" strokeWidth="5" strokeLinecap="round" fill="none" />
            <path d="M 100 36 C 125 22, 146 32, 140 54 C 122 56, 106 48, 100 36 Z" fill="#66BB6A" stroke="#2E7D32" strokeWidth="2.5" />

            {/* Apple Body with double lobes */}
            <path
              d="M 100 52 C 122 45, 158 52, 162 95 C 166 142, 132 172, 100 166 C 68 172, 34 142, 38 95 C 42 52, 78 45, 100 52 Z"
              fill="url(#appleGrad)"
              stroke="#8E0000"
              strokeWidth="5"
            />
            {/* Gloss highlight arc */}
            <path d="M 58 72 Q 82 58 115 65" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" opacity="0.65" fill="none" />
            <circle cx="126" cy="72" r="3.5" fill="#FFFFFF" opacity="0.75" />

            {/* Face */}
            <ellipse cx="80" cy="108" rx="5" ry="7" fill="#3E2723" />
            <ellipse cx="120" cy="108" rx="5" ry="7" fill="#3E2723" />
            <circle cx="78" cy="106" r="2" fill="#FFFFFF" />
            <circle cx="118" cy="106" r="2" fill="#FFFFFF" />
            <path d="M 94 120 Q 100 128 106 120" stroke="#3E2723" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <circle cx="68" cy="116" r="7" fill="#FF8A80" opacity="0.6" />
            <circle cx="132" cy="116" r="7" fill="#FF8A80" opacity="0.6" />
          </svg>
        );

      case 'pear':
        return (
          <svg viewBox="0 0 200 200" width={dimension} height={dimension} className="drop-shadow-md">
            <defs>
              <radialGradient id="pearGrad" cx="35%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#EEFF41" />
                <stop offset="45%" stopColor="#C6FF00" />
                <stop offset="85%" stopColor="#7CB342" />
                <stop offset="100%" stopColor="#558B2F" />
              </radialGradient>
            </defs>
            {/* Stem & Leaf */}
            <path d="M 100 36 Q 98 18 88 16" stroke="#5D4037" strokeWidth="5" strokeLinecap="round" fill="none" />
            <path d="M 100 32 C 122 18, 142 26, 136 48 C 120 50, 104 42, 100 32 Z" fill="#66BB6A" stroke="#2E7D32" strokeWidth="2.5" />

            {/* Bell-shaped Pear Body */}
            <path
              d="M 100 42 C 118 42, 126 65, 132 95 C 145 125, 160 145, 150 166 C 140 182, 60 182, 50 166 C 40 145, 55 125, 68 95 C 74 65, 82 42, 100 42 Z"
              fill="url(#pearGrad)"
              stroke="#558B2F"
              strokeWidth="5"
            />
            {/* Gloss highlight */}
            <path d="M 72 65 Q 92 50 115 58" stroke="#FFFFFF" strokeWidth="5.5" strokeLinecap="round" opacity="0.65" fill="none" />

            {/* Face on lower pear belly */}
            <ellipse cx="84" cy="126" rx="5" ry="7" fill="#33691E" />
            <ellipse cx="116" cy="126" rx="5" ry="7" fill="#33691E" />
            <circle cx="82" cy="124" r="2" fill="#FFFFFF" />
            <circle cx="114" cy="124" r="2" fill="#FFFFFF" />
            <path d="M 94 138 Q 100 146 106 138" stroke="#33691E" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <circle cx="72" cy="134" r="6.5" fill="#AED581" opacity="0.7" />
            <circle cx="128" cy="134" r="6.5" fill="#AED581" opacity="0.7" />
          </svg>
        );

      case 'pineapple':
        return (
          <svg viewBox="0 0 200 200" width={dimension} height={dimension} className="drop-shadow-md">
            <defs>
              <radialGradient id="pineGrad" cx="40%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#FFF59D" />
                <stop offset="50%" stopColor="#FFA726" />
                <stop offset="100%" stopColor="#E65100" />
              </radialGradient>
              <linearGradient id="crownLeaf" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#81C784" />
                <stop offset="100%" stopColor="#2E7D32" />
              </linearGradient>
            </defs>
            {/* Spiky Teal Crown */}
            <g fill="url(#crownLeaf)" stroke="#1B5E20" strokeWidth="3">
              <path d="M 100 18 L 85 55 L 100 65 L 115 55 Z" />
              <path d="M 75 28 L 78 60 L 92 68 L 72 50 Z" />
              <path d="M 125 28 L 122 60 L 108 68 L 128 50 Z" />
              <path d="M 58 45 L 75 70 L 62 65 Z" />
              <path d="M 142 45 L 125 70 L 138 65 Z" />
            </g>

            {/* Oval Textured Pineapple Body */}
            <ellipse cx="100" cy="124" rx="50" ry="58" fill="url(#pineGrad)" stroke="#E65100" strokeWidth="5" />

            {/* Diamond crisscross pattern */}
            <g stroke="#EF6C00" strokeWidth="3" opacity="0.7" fill="none">
              <path d="M 60 90 L 140 155" />
              <path d="M 75 75 L 150 135" />
              <path d="M 52 115 L 125 175" />
              <path d="M 140 90 L 60 155" />
              <path d="M 125 75 L 50 135" />
              <path d="M 148 115 L 75 175" />
            </g>

            {/* Face */}
            <ellipse cx="84" cy="120" rx="5" ry="7" fill="#4E342E" />
            <ellipse cx="116" cy="120" rx="5" ry="7" fill="#4E342E" />
            <circle cx="82" cy="118" r="2" fill="#FFFFFF" />
            <circle cx="114" cy="118" r="2" fill="#FFFFFF" />
            <path d="M 94 132 Q 100 140 106 132" stroke="#4E342E" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <circle cx="72" cy="128" r="6.5" fill="#FF8A80" opacity="0.6" />
            <circle cx="128" cy="128" r="6.5" fill="#FF8A80" opacity="0.6" />
          </svg>
        );

      case 'peach':
        return (
          <svg viewBox="0 0 200 200" width={dimension} height={dimension} className="drop-shadow-md">
            <defs>
              <radialGradient id="peachGrad" cx="35%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#FFE082" />
                <stop offset="35%" stopColor="#FFAB91" />
                <stop offset="70%" stopColor="#FF7043" />
                <stop offset="100%" stopColor="#F4511E" />
              </radialGradient>
            </defs>
            {/* Stem & Leaf */}
            <path d="M 100 42 Q 102 22 92 18" stroke="#5D4037" strokeWidth="5" strokeLinecap="round" fill="none" />
            <path d="M 100 36 C 125 22, 146 32, 140 54 C 122 56, 106 48, 100 36 Z" fill="#66BB6A" stroke="#2E7D32" strokeWidth="2.5" />

            {/* Heart-like Peach Body */}
            <path
              d="M 100 52 C 125 45, 160 55, 160 105 C 160 150, 128 172, 100 166 C 72 172, 40 150, 40 105 C 40 55, 75 45, 100 52 Z"
              fill="url(#peachGrad)"
              stroke="#D84315"
              strokeWidth="5"
            />
            {/* Peach Crease */}
            <path d="M 100 52 Q 95 100 100 166" stroke="#BF360C" strokeWidth="3" opacity="0.5" strokeLinecap="round" fill="none" />
            {/* Soft Glow */}
            <path d="M 58 72 Q 80 58 110 65" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" opacity="0.6" fill="none" />

            {/* Face */}
            <ellipse cx="80" cy="108" rx="5" ry="7" fill="#4E342E" />
            <ellipse cx="120" cy="108" rx="5" ry="7" fill="#4E342E" />
            <circle cx="78" cy="106" r="2" fill="#FFFFFF" />
            <circle cx="118" cy="106" r="2" fill="#FFFFFF" />
            <path d="M 94 120 Q 100 128 106 120" stroke="#4E342E" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <circle cx="68" cy="116" r="7" fill="#FFAB91" opacity="0.8" />
            <circle cx="132" cy="116" r="7" fill="#FFAB91" opacity="0.8" />
          </svg>
        );

      case 'melon':
        return (
          <svg viewBox="0 0 200 200" width={dimension} height={dimension} className="drop-shadow-md">
            <defs>
              <radialGradient id="melonFlesh" cx="50%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#FFF9C4" />
                <stop offset="50%" stopColor="#FFB74D" />
                <stop offset="100%" stopColor="#FB8C00" />
              </radialGradient>
            </defs>
            {/* Outer Melon Rind */}
            <path
              d="M 28 85 C 38 160, 162 160, 172 85 Z"
              fill="#7CB342"
              stroke="#33691E"
              strokeWidth="5"
            />
            {/* Inner Light Green Rind */}
            <path
              d="M 34 85 C 44 150, 156 150, 166 85 Z"
              fill="#DCEDC8"
            />
            {/* Juicy Sweet Orange Cantaloupe Flesh */}
            <path
              d="M 40 85 C 48 140, 152 140, 160 85 Z"
              fill="url(#melonFlesh)"
            />

            {/* Gloss on Top Edge */}
            <path d="M 46 88 L 154 88" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" opacity="0.6" />

            {/* Cute Face */}
            <ellipse cx="88" cy="102" rx="4.5" ry="6" fill="#4E342E" />
            <ellipse cx="112" cy="102" rx="4.5" ry="6" fill="#4E342E" />
            <circle cx="87" cy="100" r="1.5" fill="#FFFFFF" />
            <circle cx="111" cy="100" r="1.5" fill="#FFFFFF" />
            <path d="M 94 114 Q 100 120 106 114" stroke="#4E342E" strokeWidth="3" strokeLinecap="round" fill="none" />
            <circle cx="76" cy="110" r="5" fill="#FFCC80" opacity="0.7" />
            <circle cx="124" cy="110" r="5" fill="#FFCC80" opacity="0.7" />
          </svg>
        );

      case 'cherries':
        return (
          <svg viewBox="0 0 200 200" width={dimension} height={dimension} className="drop-shadow-md">
            <defs>
              <radialGradient id="sweetCherryGrad" cx="35%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#FF5252" />
                <stop offset="45%" stopColor="#D50000" />
                <stop offset="85%" stopColor="#880E4F" />
                <stop offset="100%" stopColor="#4A0033" />
              </radialGradient>
            </defs>
            {/* Curved stems */}
            <path d="M 68 95 C 60 40, 95 30, 105 20" stroke="#5D4037" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M 132 108 C 130 50, 105 30, 105 20" stroke="#5D4037" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M 105 20 C 130 10, 150 25, 140 45 C 120 45, 110 32, 105 20 Z" fill="#66BB6A" stroke="#2E7D32" strokeWidth="2.5" />

            {/* Left Sweet Cherry */}
            <circle cx="68" cy="120" r="38" fill="url(#sweetCherryGrad)" stroke="#4A0033" strokeWidth="4" />
            <path d="M 48 100 Q 64 90 84 96" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" opacity="0.75" fill="none" />
            <ellipse cx="58" cy="120" rx="3.5" ry="5" fill="#212121" />
            <ellipse cx="78" cy="120" rx="3.5" ry="5" fill="#212121" />
            <circle cx="57" cy="118" r="1.2" fill="#FFFFFF" />
            <circle cx="77" cy="118" r="1.2" fill="#FFFFFF" />
            <path d="M 63 130 Q 68 135 73 130" stroke="#212121" strokeWidth="2.5" strokeLinecap="round" fill="none" />

            {/* Right Sweet Cherry */}
            <circle cx="132" cy="132" r="36" fill="url(#sweetCherryGrad)" stroke="#4A0033" strokeWidth="4" />
            <path d="M 112 114 Q 128 104 148 110" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" opacity="0.75" fill="none" />
            <ellipse cx="122" cy="132" rx="3.5" ry="5" fill="#212121" />
            <ellipse cx="142" cy="132" rx="3.5" ry="5" fill="#212121" />
            <circle cx="121" cy="130" r="1.2" fill="#FFFFFF" />
            <circle cx="141" cy="130" r="1.2" fill="#FFFFFF" />
            <path d="M 127 142 Q 132 147 137 142" stroke="#212121" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </svg>
        );

      case 'papaya':
        return (
          <svg viewBox="0 0 200 200" width={dimension} height={dimension} className="drop-shadow-md">
            <defs>
              <radialGradient id="papayaFlesh" cx="45%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#FFE082" />
                <stop offset="45%" stopColor="#FF9800" />
                <stop offset="100%" stopColor="#E65100" />
              </radialGradient>
            </defs>
            {/* Greenish Yellow Outer Skin */}
            <path
              d="M 100 38 C 122 38, 138 65, 145 95 C 158 135, 150 172, 100 172 C 50 172, 42 135, 55 95 C 62 65, 78 38, 100 38 Z"
              fill="#9CCC65"
              stroke="#558B2F"
              strokeWidth="5"
            />
            {/* Sweet Orange Papaya Flesh Cavity */}
            <path
              d="M 100 48 C 116 48, 128 70, 134 98 C 144 130, 138 160, 100 160 C 62 160, 56 130, 66 98 C 72 70, 84 48, 100 48 Z"
              fill="url(#papayaFlesh)"
            />

            {/* Inner Seed Cavity with Round Black Papaya Seeds */}
            <g fill="#212121">
              <circle cx="95" cy="80" r="3.5" />
              <circle cx="105" cy="82" r="3.5" />
              <circle cx="90" cy="94" r="4" />
              <circle cx="110" cy="96" r="4" />
              <circle cx="94" cy="110" r="4" />
              <circle cx="106" cy="112" r="4" />
              <circle cx="100" cy="126" r="4" />
            </g>

            {/* Face */}
            <ellipse cx="80" cy="138" rx="4" ry="6" fill="#3E2723" />
            <ellipse cx="120" cy="138" rx="4" ry="6" fill="#3E2723" />
            <circle cx="78" cy="136" r="1.5" fill="#FFFFFF" />
            <circle cx="118" cy="136" r="1.5" fill="#FFFFFF" />
            <path d="M 94 148 Q 100 154 106 148" stroke="#3E2723" strokeWidth="3" strokeLinecap="round" fill="none" />
          </svg>
        );

      case 'dates':
        return (
          <svg viewBox="0 0 200 200" width={dimension} height={dimension} className="drop-shadow-md">
            <defs>
              <linearGradient id="dateGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8D6E63" />
                <stop offset="40%" stopColor="#5D4037" />
                <stop offset="100%" stopColor="#3E2723" />
              </linearGradient>
            </defs>
            {/* Left Date */}
            <ellipse cx="75" cy="115" rx="32" ry="52" fill="url(#dateGrad)" stroke="#3E2723" strokeWidth="4.5" transform="rotate(-20 75 115)" />
            {/* Wrinkle lines */}
            <path d="M 60 85 Q 75 115 65 145" stroke="#8D6E63" strokeWidth="2.5" opacity="0.6" fill="none" />
            <path d="M 85 80 Q 95 115 88 145" stroke="#8D6E63" strokeWidth="2.5" opacity="0.6" fill="none" />

            {/* Right Date */}
            <ellipse cx="125" cy="105" rx="34" ry="54" fill="url(#dateGrad)" stroke="#271C19" strokeWidth="4.5" transform="rotate(20 125 105)" />
            {/* Gloss on Right Date */}
            <path d="M 115 70 Q 140 85 135 125" stroke="#D7CCC8" strokeWidth="4.5" strokeLinecap="round" opacity="0.6" fill="none" />

            {/* Face on Right Date */}
            <ellipse cx="115" cy="102" rx="4" ry="6" fill="#1B120C" />
            <ellipse cx="138" cy="108" rx="4" ry="6" fill="#1B120C" />
            <circle cx="114" cy="100" r="1.5" fill="#FFFFFF" />
            <circle cx="137" cy="106" r="1.5" fill="#FFFFFF" />
            <path d="M 122 118 Q 128 124 134 118" stroke="#1B120C" strokeWidth="3" strokeLinecap="round" fill="none" />
            <circle cx="108" cy="112" r="5" fill="#A1887F" opacity="0.6" />
          </svg>
        );

      case 'raisins':
        return (
          <svg viewBox="0 0 200 200" width={dimension} height={dimension} className="drop-shadow-md">
            <defs>
              <radialGradient id="raisinGrad" cx="35%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#7E57C2" />
                <stop offset="50%" stopColor="#4527A0" />
                <stop offset="100%" stopColor="#260e58" />
              </radialGradient>
            </defs>
            {/* Raisin 1 (back left) */}
            <ellipse cx="65" cy="125" rx="26" ry="34" fill="url(#raisinGrad)" stroke="#260e58" strokeWidth="3.5" transform="rotate(-15 65 125)" />
            {/* Raisin 2 (back right) */}
            <ellipse cx="135" cy="125" rx="26" ry="34" fill="url(#raisinGrad)" stroke="#260e58" strokeWidth="3.5" transform="rotate(15 135 125)" />
            {/* Raisin 3 (front center) */}
            <ellipse cx="100" cy="105" rx="34" ry="42" fill="url(#raisinGrad)" stroke="#1a0033" strokeWidth="4.5" />
            {/* Wrinkle creases on front raisin */}
            <path d="M 85 85 Q 92 105 88 125" stroke="#B39DDB" strokeWidth="2.5" opacity="0.6" fill="none" />
            <path d="M 112 85 Q 118 105 114 125" stroke="#B39DDB" strokeWidth="2.5" opacity="0.6" fill="none" />
            {/* Gloss sheen */}
            <path d="M 82 78 Q 98 70 115 76" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" opacity="0.65" fill="none" />

            {/* Cute Face on Center Raisin */}
            <ellipse cx="88" cy="104" rx="4" ry="6" fill="#130026" />
            <ellipse cx="112" cy="104" rx="4" ry="6" fill="#130026" />
            <circle cx="86" cy="102" r="1.5" fill="#FFFFFF" />
            <circle cx="110" cy="102" r="1.5" fill="#FFFFFF" />
            <path d="M 94 116 Q 100 122 106 116" stroke="#130026" strokeWidth="3" strokeLinecap="round" fill="none" />
            <circle cx="76" cy="112" r="5" fill="#EA80FC" opacity="0.6" />
            <circle cx="124" cy="112" r="5" fill="#EA80FC" opacity="0.6" />
          </svg>
        );

      case 'honey':
        return (
          <svg viewBox="0 0 200 200" width={dimension} height={dimension} className="drop-shadow-md">
            <defs>
              <radialGradient id="honeyPotGrad" cx="35%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#FFE082" />
                <stop offset="45%" stopColor="#FFB300" />
                <stop offset="85%" stopColor="#FB8C00" />
                <stop offset="100%" stopColor="#E65100" />
              </radialGradient>
              <linearGradient id="honeyDripGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFF176" />
                <stop offset="100%" stopColor="#FFA000" />
              </linearGradient>
            </defs>
            {/* Wooden Honey Dipper Stick Top Left */}
            <path d="M 130 35 L 165 15" stroke="#8D6E63" strokeWidth="7" strokeLinecap="round" />
            {/* Dipper Head */}
            <g fill="#A1887F" stroke="#5D4037" strokeWidth="2">
              <ellipse cx="135" cy="38" rx="8" ry="12" transform="rotate(-30 135 38)" />
              <ellipse cx="128" cy="44" rx="7" ry="10" transform="rotate(-30 128 44)" />
            </g>
            {/* Golden Honey Dripping */}
            <path d="M 125 50 Q 120 70 122 85" stroke="url(#honeyDripGrad)" strokeWidth="6" strokeLinecap="round" fill="none" />

            {/* Honey Pot Jar Body */}
            <path
              d="M 65 72 L 135 72 L 148 115 C 152 155, 138 172, 100 172 C 62 172, 48 155, 52 115 Z"
              fill="url(#honeyPotGrad)"
              stroke="#BF360C"
              strokeWidth="5"
            />
            {/* Jar Rim / Lip */}
            <rect x="58" y="60" width="84" height="16" rx="8" fill="#FFD54F" stroke="#E65100" strokeWidth="4" />

            {/* White Label Banner on Honey Pot */}
            <rect x="62" y="98" width="76" height="30" rx="8" fill="#FFFDE7" stroke="#FFA000" strokeWidth="2" />
            <text x="100" y="119" textAnchor="middle" fill="#E65100" fontSize="15" fontWeight="900" fontFamily="sans-serif">
              HONEY
            </text>

            {/* Face above label */}
            <ellipse cx="84" cy="85" rx="4" ry="5.5" fill="#4E342E" />
            <ellipse cx="116" cy="85" rx="4" ry="5.5" fill="#4E342E" />
            <circle cx="82" cy="83" r="1.5" fill="#FFFFFF" />
            <circle cx="114" cy="83" r="1.5" fill="#FFFFFF" />
            <path d="M 94 92 Q 100 97 106 92" stroke="#4E342E" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </svg>
        );

      default:
        return null;
    }
  };

  if (!isAnimated) {
    return <div className={`inline-flex items-center justify-center ${className}`}>{renderVectorFood()}</div>;
  }

  return (
    <motion.div
      animate={{
        y: [0, -6, 0, 4, 0],
        rotate: [0, 1.5, 0, -1.5, 0],
      }}
      transition={{
        duration: 3.6,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className={`inline-flex items-center justify-center select-none ${className}`}
    >
      {renderVectorFood()}
    </motion.div>
  );
};
