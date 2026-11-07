import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  RotateCcw,
  Volume2,
  Trophy,
  Check,
  ArrowRight,
  Home,
  Sparkles,
} from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { ActivityBottomNav } from './ActivityBottomNav';
import {
  SortObjectItem,
  SortObjectData,
  SortObjectType,
  SortObjectCategory,
} from '../common/SortObjectItem';

// ----------------------------------------------------------------------------
// TYPES & DEFINITIONS
// ----------------------------------------------------------------------------

export interface BasketTheme {
  bg: string;
  border: string;
  rim: string;
  glow: string;
  badgeBg: string;
  badgeText: string;
  accentHex: string;
}

export interface BasketConfig {
  id: 'basket_1' | 'basket_2';
  categoryKey: string;
  label: string;
  badgeEmoji: string;
  theme: BasketTheme;
}

export interface SortRoundItem extends SortObjectData {
  targetBasket: 'basket_1' | 'basket_2';
}

export interface SortRoundConfig {
  id: string;
  pairKey: string;
  title: string;
  ruleType: 'category' | 'color' | 'size';
  introPrompt: string;
  basket1: BasketConfig;
  basket2: BasketConfig;
  items: SortRoundItem[];
  step1Prompt: string;
  step2Prompt: string;
}

interface SortItFunProps {
  onCollectStar?: () => void;
  onNavigateHome?: () => void;
  onNavigateNext?: () => void;
  onNavigatePrev?: () => void;
  isActivityCompleted?: boolean;
}

// ----------------------------------------------------------------------------
// CATEGORY POOLS & THEMES (100% VALIDATED MUTUALLY EXCLUSIVE OBJECTS)
// ----------------------------------------------------------------------------

interface CategoryDefinition {
  key: string;
  label: string;
  badgeEmoji: string;
  promptWord: string;
  theme: BasketTheme;
  items: {
    name: string;
    type: SortObjectType;
    category: SortObjectCategory;
    colorName?: string;
    colorHex?: string;
    sizeCategory?: 'big' | 'small';
  }[];
}

const CATEGORY_DEFINITIONS: Record<string, CategoryDefinition> = {
  fruits: {
    key: 'fruits',
    label: 'FRUITS',
    badgeEmoji: '🍎',
    promptWord: 'FRUITS',
    theme: {
      bg: 'bg-rose-50',
      border: 'border-rose-500',
      rim: 'bg-rose-500',
      glow: 'ring-rose-400',
      badgeBg: 'bg-rose-100',
      badgeText: 'text-rose-800',
      accentHex: '#EF4444',
    },
    items: [
      { name: 'Apple', type: 'apple', category: 'fruit', colorName: 'red', colorHex: '#EF4444' },
      { name: 'Banana', type: 'banana', category: 'fruit', colorName: 'yellow', colorHex: '#FACC15' },
      { name: 'Orange', type: 'orange', category: 'fruit', colorName: 'orange', colorHex: '#FB923C' },
      { name: 'Strawberry', type: 'strawberry', category: 'fruit', colorName: 'red', colorHex: '#EF4444' },
      { name: 'Watermelon', type: 'watermelon', category: 'fruit', colorName: 'green', colorHex: '#22C55E' },
      { name: 'Grapes', type: 'grapes', category: 'fruit', colorName: 'purple', colorHex: '#9333EA' },
    ],
  },

  flowers: {
    key: 'flowers',
    label: 'FLOWERS',
    badgeEmoji: '🌸',
    promptWord: 'FLOWERS',
    theme: {
      bg: 'bg-pink-50',
      border: 'border-pink-500',
      rim: 'bg-pink-500',
      glow: 'ring-pink-400',
      badgeBg: 'bg-pink-100',
      badgeText: 'text-pink-800',
      accentHex: '#EC4899',
    },
    items: [
      { name: 'Pink Flower', type: 'flower', category: 'flower', colorName: 'pink', colorHex: '#F472B6' },
      { name: 'Red Tulip', type: 'tulip', category: 'flower', colorName: 'red', colorHex: '#EF4444' },
      { name: 'Sunflower', type: 'sunflower', category: 'flower', colorName: 'yellow', colorHex: '#FACC15' },
      { name: 'Red Rose', type: 'rose', category: 'flower', colorName: 'red', colorHex: '#DC2626' },
    ],
  },

  toys: {
    key: 'toys',
    label: 'TOYS',
    badgeEmoji: '🧸',
    promptWord: 'TOYS',
    theme: {
      bg: 'bg-amber-50',
      border: 'border-amber-500',
      rim: 'bg-amber-500',
      glow: 'ring-amber-400',
      badgeBg: 'bg-amber-100',
      badgeText: 'text-amber-800',
      accentHex: '#F59E0B',
    },
    items: [
      { name: 'Teddy Bear', type: 'teddy', category: 'toy', colorName: 'brown', colorHex: '#B45309' },
      { name: 'Toy Car', type: 'toy_car', category: 'toy', colorName: 'blue', colorHex: '#0284C7' },
      { name: 'Bouncy Ball', type: 'ball', category: 'toy', colorName: 'red', colorHex: '#EF4444' },
      { name: 'Toy Robot', type: 'robot', category: 'toy', colorName: 'blue', colorHex: '#38BDF8' },
      { name: 'Toy Blocks', type: 'blocks', category: 'toy', colorName: 'yellow', colorHex: '#FACC15' },
      { name: 'Rubber Duck', type: 'duck', category: 'toy', colorName: 'yellow', colorHex: '#FACC15' },
    ],
  },

  food: {
    key: 'food',
    label: 'FOOD',
    badgeEmoji: '🍦',
    promptWord: 'FOOD',
    theme: {
      bg: 'bg-orange-50',
      border: 'border-orange-500',
      rim: 'bg-orange-500',
      glow: 'ring-orange-400',
      badgeBg: 'bg-orange-100',
      badgeText: 'text-orange-800',
      accentHex: '#EA580C',
    },
    items: [
      { name: 'Ice Cream Cone', type: 'ice_cream', category: 'food', colorName: 'pink', colorHex: '#F472B6' },
      { name: 'Sweet Candy', type: 'candy', category: 'food', colorName: 'purple', colorHex: '#C084FC' },
      { name: 'Cupcake', type: 'cupcake', category: 'food', colorName: 'yellow', colorHex: '#FDE047' },
      { name: 'Donut', type: 'donut', category: 'food', colorName: 'pink', colorHex: '#F472B6' },
      { name: 'Pizza Slice', type: 'pizza', category: 'food', colorName: 'yellow', colorHex: '#F59E0B' },
    ],
  },

  animals: {
    key: 'animals',
    label: 'ANIMALS',
    badgeEmoji: '🐶',
    promptWord: 'ANIMALS',
    theme: {
      bg: 'bg-amber-50',
      border: 'border-amber-600',
      rim: 'bg-amber-600',
      glow: 'ring-amber-500',
      badgeBg: 'bg-amber-100',
      badgeText: 'text-amber-900',
      accentHex: '#D97706',
    },
    items: [
      { name: 'Puppy Dog', type: 'dog', category: 'animal', colorName: 'brown', colorHex: '#D97706' },
      { name: 'Cute Cat', type: 'cat', category: 'animal', colorName: 'orange', colorHex: '#F97316' },
      { name: 'Fluffy Bunny', type: 'bunny', category: 'animal', colorName: 'pink', colorHex: '#F8FAFC' },
      { name: 'Friendly Lion', type: 'lion', category: 'animal', colorName: 'yellow', colorHex: '#FBBF24' },
      { name: 'Green Frog', type: 'frog', category: 'animal', colorName: 'green', colorHex: '#22C55E' },
    ],
  },

  vehicles: {
    key: 'vehicles',
    label: 'VEHICLES',
    badgeEmoji: '🚗',
    promptWord: 'VEHICLES',
    theme: {
      bg: 'bg-sky-50',
      border: 'border-sky-500',
      rim: 'bg-sky-500',
      glow: 'ring-sky-400',
      badgeBg: 'bg-sky-100',
      badgeText: 'text-sky-800',
      accentHex: '#0284C7',
    },
    items: [
      { name: 'Toy Car', type: 'toy_car', category: 'vehicle', colorName: 'red', colorHex: '#EF4444' },
      { name: 'School Bus', type: 'bus', category: 'vehicle', colorName: 'yellow', colorHex: '#FACC15' },
      { name: 'Train Engine', type: 'train', category: 'vehicle', colorName: 'blue', colorHex: '#3B82F6' },
      { name: 'Airplane', type: 'plane', category: 'vehicle', colorName: 'blue', colorHex: '#60A5FA' },
    ],
  },

  red_color: {
    key: 'red_color',
    label: 'RED',
    badgeEmoji: '🔴',
    promptWord: 'RED',
    theme: {
      bg: 'bg-rose-50',
      border: 'border-rose-500',
      rim: 'bg-rose-500',
      glow: 'ring-rose-400',
      badgeBg: 'bg-rose-100',
      badgeText: 'text-rose-800',
      accentHex: '#EF4444',
    },
    items: [
      { name: 'Red Apple', type: 'apple', category: 'color_red', colorName: 'red', colorHex: '#EF4444' },
      { name: 'Red Strawberry', type: 'strawberry', category: 'color_red', colorName: 'red', colorHex: '#EF4444' },
      { name: 'Red Tulip', type: 'tulip', category: 'color_red', colorName: 'red', colorHex: '#EF4444' },
      { name: 'Red Rose', type: 'rose', category: 'color_red', colorName: 'red', colorHex: '#DC2626' },
      { name: 'Red Toy Car', type: 'toy_car', category: 'color_red', colorName: 'red', colorHex: '#EF4444' },
      { name: 'Red Ball', type: 'ball', category: 'color_red', colorName: 'red', colorHex: '#EF4444' },
    ],
  },

  yellow_color: {
    key: 'yellow_color',
    label: 'YELLOW',
    badgeEmoji: '🟡',
    promptWord: 'YELLOW',
    theme: {
      bg: 'bg-amber-50',
      border: 'border-amber-500',
      rim: 'bg-amber-500',
      glow: 'ring-amber-400',
      badgeBg: 'bg-amber-100',
      badgeText: 'text-amber-800',
      accentHex: '#FACC15',
    },
    items: [
      { name: 'Yellow Banana', type: 'banana', category: 'color_yellow', colorName: 'yellow', colorHex: '#FACC15' },
      { name: 'Yellow Sunflower', type: 'sunflower', category: 'color_yellow', colorName: 'yellow', colorHex: '#FACC15' },
      { name: 'Yellow Star', type: 'star', category: 'color_yellow', colorName: 'yellow', colorHex: '#FACC15' },
      { name: 'Yellow Duck', type: 'duck', category: 'color_yellow', colorName: 'yellow', colorHex: '#FACC15' },
      { name: 'Yellow Bus', type: 'bus', category: 'color_yellow', colorName: 'yellow', colorHex: '#FACC15' },
      { name: 'Yellow Ball', type: 'ball', category: 'color_yellow', colorName: 'yellow', colorHex: '#FACC15' },
    ],
  },

  blue_color: {
    key: 'blue_color',
    label: 'BLUE',
    badgeEmoji: '🔵',
    promptWord: 'BLUE',
    theme: {
      bg: 'bg-sky-50',
      border: 'border-sky-500',
      rim: 'bg-sky-500',
      glow: 'ring-sky-400',
      badgeBg: 'bg-sky-100',
      badgeText: 'text-sky-800',
      accentHex: '#0284C7',
    },
    items: [
      { name: 'Blue Toy Car', type: 'toy_car', category: 'color_blue', colorName: 'blue', colorHex: '#0284C7' },
      { name: 'Blue Plane', type: 'plane', category: 'color_blue', colorName: 'blue', colorHex: '#60A5FA' },
      { name: 'Blue Ball', type: 'ball', category: 'color_blue', colorName: 'blue', colorHex: '#3B82F6' },
      { name: 'Blue Train', type: 'train', category: 'color_blue', colorName: 'blue', colorHex: '#3B82F6' },
      { name: 'Blue Robot', type: 'robot', category: 'color_blue', colorName: 'blue', colorHex: '#38BDF8' },
    ],
  },

  green_color: {
    key: 'green_color',
    label: 'GREEN',
    badgeEmoji: '🟢',
    promptWord: 'GREEN',
    theme: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-500',
      rim: 'bg-emerald-500',
      glow: 'ring-emerald-400',
      badgeBg: 'bg-emerald-100',
      badgeText: 'text-emerald-800',
      accentHex: '#10B981',
    },
    items: [
      { name: 'Green Frog', type: 'frog', category: 'color_green', colorName: 'green', colorHex: '#22C55E' },
      { name: 'Green Apple', type: 'apple', category: 'color_green', colorName: 'green', colorHex: '#22C55E' },
      { name: 'Green Watermelon', type: 'watermelon', category: 'color_green', colorName: 'green', colorHex: '#22C55E' },
      { name: 'Green Ball', type: 'ball', category: 'color_green', colorName: 'green', colorHex: '#22C55E' },
    ],
  },

  big_size: {
    key: 'big_size',
    label: 'BIG',
    badgeEmoji: '🐘',
    promptWord: 'BIG',
    theme: {
      bg: 'bg-indigo-50',
      border: 'border-indigo-500',
      rim: 'bg-indigo-500',
      glow: 'ring-indigo-400',
      badgeBg: 'bg-indigo-100',
      badgeText: 'text-indigo-800',
      accentHex: '#6366F1',
    },
    items: [
      { name: 'Big Teddy Bear', type: 'teddy', category: 'big_object', colorName: 'brown', colorHex: '#B45309', sizeCategory: 'big' },
      { name: 'Big Bus', type: 'bus', category: 'big_object', colorName: 'yellow', colorHex: '#FACC15', sizeCategory: 'big' },
      { name: 'Big Lion', type: 'lion', category: 'big_object', colorName: 'yellow', colorHex: '#FBBF24', sizeCategory: 'big' },
      { name: 'Big Watermelon', type: 'watermelon', category: 'big_object', colorName: 'green', colorHex: '#22C55E', sizeCategory: 'big' },
      { name: 'Big Star', type: 'star', category: 'big_object', colorName: 'yellow', colorHex: '#FACC15', sizeCategory: 'big' },
    ],
  },

  small_size: {
    key: 'small_size',
    label: 'SMALL',
    badgeEmoji: '🐥',
    promptWord: 'SMALL',
    theme: {
      bg: 'bg-teal-50',
      border: 'border-teal-500',
      rim: 'bg-teal-500',
      glow: 'ring-teal-400',
      badgeBg: 'bg-teal-100',
      badgeText: 'text-teal-800',
      accentHex: '#14B8A6',
    },
    items: [
      { name: 'Small Candy', type: 'candy', category: 'small_object', colorName: 'purple', colorHex: '#C084FC', sizeCategory: 'small' },
      { name: 'Small Strawberry', type: 'strawberry', category: 'small_object', colorName: 'red', colorHex: '#EF4444', sizeCategory: 'small' },
      { name: 'Small Flower', type: 'flower', category: 'small_object', colorName: 'pink', colorHex: '#F472B6', sizeCategory: 'small' },
      { name: 'Small Ball', type: 'ball', category: 'small_object', colorName: 'blue', colorHex: '#3B82F6', sizeCategory: 'small' },
      { name: 'Small Donut', type: 'donut', category: 'small_object', colorName: 'pink', colorHex: '#F472B6', sizeCategory: 'small' },
    ],
  },
};

// Validated clean category pairs list
const VALID_CATEGORY_PAIRS: {
  pairKey: string;
  catA: string;
  catB: string;
  ruleType: 'category' | 'color' | 'size';
}[] = [
  { pairKey: 'fruits_vs_flowers', catA: 'fruits', catB: 'flowers', ruleType: 'category' },
  { pairKey: 'toys_vs_food', catA: 'toys', catB: 'food', ruleType: 'category' },
  { pairKey: 'animals_vs_vehicles', catA: 'animals', catB: 'vehicles', ruleType: 'category' },
  { pairKey: 'red_vs_yellow', catA: 'red_color', catB: 'yellow_color', ruleType: 'color' },
  { pairKey: 'blue_vs_green', catA: 'blue_color', catB: 'green_color', ruleType: 'color' },
  { pairKey: 'big_vs_small', catA: 'big_size', catB: 'small_size', ruleType: 'size' },
];

// Helper to generate a single round with completely shuffled distinct objects
function generateRound(
  pairConfig: typeof VALID_CATEGORY_PAIRS[0],
  roundNumber: number,
  shouldFlipSides: boolean = false
): SortRoundConfig {
  const roundTimestamp = Date.now() + Math.floor(Math.random() * 10000);
  const defA = CATEGORY_DEFINITIONS[pairConfig.catA];
  const defB = CATEGORY_DEFINITIONS[pairConfig.catB];

  // Optionally flip left/right baskets for extra variation
  const primaryDef = shouldFlipSides ? defB : defA;
  const secondaryDef = shouldFlipSides ? defA : defB;

  const basket1: BasketConfig = {
    id: 'basket_1',
    categoryKey: primaryDef.key,
    label: primaryDef.label,
    badgeEmoji: primaryDef.badgeEmoji,
    theme: primaryDef.theme,
  };

  const basket2: BasketConfig = {
    id: 'basket_2',
    categoryKey: secondaryDef.key,
    label: secondaryDef.label,
    badgeEmoji: secondaryDef.badgeEmoji,
    theme: secondaryDef.theme,
  };

  // Pick 2-3 distinct items from group 1 and 2-3 distinct items from group 2
  const count1 = 2 + Math.floor(Math.random() * 2); // 2 or 3 items
  const count2 = 5 - count1; // total 5 items (or 4/5)

  const shuffledGroup1 = [...primaryDef.items]
    .sort(() => Math.random() - 0.5)
    .slice(0, count1);

  const shuffledGroup2 = [...secondaryDef.items]
    .sort(() => Math.random() - 0.5)
    .slice(0, count2);

  const mapped1: SortRoundItem[] = shuffledGroup1.map((it, idx) => ({
    ...it,
    id: `item_${roundNumber}_b1_${idx}_${it.type}_${roundTimestamp}`,
    targetBasket: 'basket_1',
  }));

  const mapped2: SortRoundItem[] = shuffledGroup2.map((it, idx) => ({
    ...it,
    id: `item_${roundNumber}_b2_${idx}_${it.type}_${roundTimestamp}`,
    targetBasket: 'basket_2',
  }));

  // Combine and randomly shuffle presentation order in staging area
  const allItems = [...mapped1, ...mapped2].sort(() => Math.random() - 0.5);

  const step1TargetWord = primaryDef.promptWord;
  const step2TargetWord = secondaryDef.promptWord;

  return {
    id: `round_${roundNumber}_${pairConfig.pairKey}_${roundTimestamp}`,
    pairKey: pairConfig.pairKey,
    title: `${primaryDef.label} vs ${secondaryDef.label}`,
    ruleType: pairConfig.ruleType,
    introPrompt: "Let's sort the objects!",
    basket1,
    basket2,
    items: allItems,
    step1Prompt:
      pairConfig.ruleType === 'color' || pairConfig.ruleType === 'size'
        ? `Put the ${step1TargetWord} ones together.`
        : `Put the ${step1TargetWord} together.`,
    step2Prompt:
      pairConfig.ruleType === 'color' || pairConfig.ruleType === 'size'
        ? `Now put the ${step2TargetWord} ones together.`
        : `Now put the ${step2TargetWord} together.`,
  };
}

// Generate a full session of 4 distinct rounds
function generateSessionRounds(lastPlayedPairKey?: string): SortRoundConfig[] {
  // Shuffle all valid pairs, putting non-recent pairs first
  const pool = [...VALID_CATEGORY_PAIRS].sort(() => Math.random() - 0.5);

  // If lastPlayedPairKey is at index 0 and pool has other pairs, move it back
  if (lastPlayedPairKey && pool[0].pairKey === lastPlayedPairKey && pool.length > 1) {
    const temp = pool[0];
    pool[0] = pool[1];
    pool[1] = temp;
  }

  // Pick first 4 distinct pairs
  const selectedPairs = pool.slice(0, 4);

  return selectedPairs.map((pair, idx) => {
    const flip = Math.random() > 0.5;
    return generateRound(pair, idx + 1, flip);
  });
}

// ----------------------------------------------------------------------------
// MAIN SORT IT FUN COMPONENT
// ----------------------------------------------------------------------------

export const SortItFun: React.FC<SortItFunProps> = ({
  onCollectStar,
  onNavigateHome,
  onNavigateNext,
  onNavigatePrev,
  isActivityCompleted = false,
}) => {
  const [rounds, setRounds] = useState<SortRoundConfig[]>(() => generateSessionRounds());
  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);
  const [isSessionComplete, setIsSessionComplete] = useState(false);

  const currentRound = rounds[currentRoundIdx] || rounds[0];

  // Placed items in baskets
  const [basket1Items, setBasket1Items] = useState<string[]>([]);
  const [basket2Items, setBasket2Items] = useState<string[]>([]);

  // Dragging & Interaction states
  const [hoveredBasket, setHoveredBasket] = useState<'basket_1' | 'basket_2' | null>(null);
  const [activeDraggingId, setActiveDraggingId] = useState<string | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  // Feedback states
  const [wrongDropShakeId, setWrongDropShakeId] = useState<string | null>(null);
  const [isStep1Finished, setIsStep1Finished] = useState(false);
  const [isRoundWon, setIsRoundWon] = useState(false);
  const [spokenPrompt, setSpokenPrompt] = useState<string>('');

  // Refs for collision
  const basket1Ref = useRef<HTMLDivElement>(null);
  const basket2Ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Background audio setup
  useEffect(() => {
    soundManager.startBackgroundMusic();
    return () => {
      soundManager.stopSpeech();
    };
  }, []);

  // Voice narration helper
  const speakNarrative = useCallback((text: string, onEnd?: () => void) => {
    setSpokenPrompt(text);
    soundManager.speak(text, onEnd);
  }, []);

  // Initialize round state & prompt flow
  const initRound = useCallback(
    (round: SortRoundConfig) => {
      setBasket1Items([]);
      setBasket2Items([]);
      setIsStep1Finished(false);
      setIsRoundWon(false);
      setHoveredBasket(null);
      setActiveDraggingId(null);
      setSelectedItemId(null);
      setWrongDropShakeId(null);

      // Sequence: "Let's sort the objects!" -> then step 1 prompt
      speakNarrative(round.introPrompt, () => {
        setTimeout(() => {
          speakNarrative(round.step1Prompt);
        }, 400);
      });
    },
    [speakNarrative]
  );

  // On round index change
  useEffect(() => {
    if (currentRound && !isSessionComplete) {
      initRound(currentRound);
    }
  }, [currentRoundIdx, isSessionComplete]);

  // Check completions
  useEffect(() => {
    if (!currentRound || isRoundWon) return;

    const basket1Targets = currentRound.items.filter((i) => i.targetBasket === 'basket_1');
    const basket2Targets = currentRound.items.filter((i) => i.targetBasket === 'basket_2');

    const isB1Complete =
      basket1Targets.length > 0 && basket1Targets.every((it) => basket1Items.includes(it.id));
    const isB2Complete =
      basket2Targets.length > 0 && basket2Targets.every((it) => basket2Items.includes(it.id));

    // Step 1 completed (Basket 1 filled first)
    if (isB1Complete && !isStep1Finished && !isB2Complete) {
      setIsStep1Finished(true);
      soundManager.playSuccess();
      speakNarrative('Great job!', () => {
        setTimeout(() => {
          speakNarrative(currentRound.step2Prompt);
        }, 400);
      });
      return;
    }

    // Both baskets completely sorted -> Round Victory!
    if (isB1Complete && isB2Complete) {
      setIsRoundWon(true);
      soundManager.playCelebration();
      if (onCollectStar) onCollectStar();

      speakNarrative('Great job!', () => {
        setTimeout(() => {
          if (currentRoundIdx < rounds.length - 1) {
            setCurrentRoundIdx((prev) => prev + 1);
          } else {
            setIsSessionComplete(true);
            soundManager.playCelebration();
          }
        }, 1400);
      });
    }
  }, [
    basket1Items,
    basket2Items,
    currentRound,
    isStep1Finished,
    isRoundWon,
    currentRoundIdx,
    rounds.length,
    speakNarrative,
    onCollectStar,
  ]);

  // ----------------------------------------------------------------------------
  // STRICT CATEGORY & WRONG ANSWER VALIDATION
  // ----------------------------------------------------------------------------

  const handleDropValidation = (itemId: string, dropTargetBasket: 'basket_1' | 'basket_2' | null) => {
    const item = currentRound.items.find((i) => i.id === itemId);
    if (!item) return;

    if (dropTargetBasket && dropTargetBasket === item.targetBasket) {
      // Correct Basket!
      soundManager.playTidySnap();
      if (dropTargetBasket === 'basket_1') {
        setBasket1Items((prev) => [...prev, itemId]);
      } else {
        setBasket2Items((prev) => [...prev, itemId]);
      }
      setSelectedItemId(null);
    } else if (dropTargetBasket && dropTargetBasket !== item.targetBasket) {
      // Strictly WRONG Basket! Return object to staging area, shake, and speak "Try again."
      soundManager.playError();
      setWrongDropShakeId(itemId);
      speakNarrative('Try again.');
      setTimeout(() => {
        setWrongDropShakeId(null);
      }, 700);
    }

    setHoveredBasket(null);
    setActiveDraggingId(null);
  };

  // Collision detection during drag
  const checkDragOver = (point: { x: number; y: number }) => {
    if (!basket1Ref.current || !basket2Ref.current) return;

    const b1Rect = basket1Ref.current.getBoundingClientRect();
    const b2Rect = basket2Ref.current.getBoundingClientRect();

    const inB1 =
      point.x >= b1Rect.left - 20 &&
      point.x <= b1Rect.right + 20 &&
      point.y >= b1Rect.top - 20 &&
      point.y <= b1Rect.bottom + 20;

    const inB2 =
      point.x >= b2Rect.left - 20 &&
      point.x <= b2Rect.right + 20 &&
      point.y >= b2Rect.top - 20 &&
      point.y <= b2Rect.bottom + 20;

    if (inB1) {
      setHoveredBasket('basket_1');
    } else if (inB2) {
      setHoveredBasket('basket_2');
    } else {
      setHoveredBasket(null);
    }
  };

  // Direct Basket Click (Accessible Tap-to-Place)
  const handleBasketTap = (target: 'basket_1' | 'basket_2') => {
    if (!selectedItemId) return;
    handleDropValidation(selectedItemId, target);
  };

  // REPLAY HANDLER: Shuffles new category pairs, new objects, and resets session
  const handleReplay = () => {
    soundManager.playPop();
    const lastKey = currentRound?.pairKey;
    const freshRounds = generateSessionRounds(lastKey);
    setRounds(freshRounds);
    setCurrentRoundIdx(0);
    setIsSessionComplete(false);
  };

  // Unplaced items in staging area
  const unplacedItems = currentRound.items.filter(
    (item) => !basket1Items.includes(item.id) && !basket2Items.includes(item.id)
  );

  return (
    <div
      ref={containerRef}
      id="sort-it-fun-activity"
      className="relative w-full max-w-5xl mx-auto min-h-[580px] p-3 sm:p-5 flex flex-col justify-between select-none"
    >
      {/* ---------------------------------------------------------------------- */}
      {/* 1. TOP HEADER & PROMPT BANNER                                         */}
      {/* ---------------------------------------------------------------------- */}
      <div className="flex flex-col items-center justify-center gap-2 mb-3">
        <div className="w-full flex items-center justify-between bg-white/95 backdrop-blur-sm border-2 border-sky-300 shadow-md rounded-2xl px-4 py-2.5 sm:py-3">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl sm:text-3xl">🧺</span>
            <div>
              <h2 className="text-xs sm:text-sm font-black tracking-wider text-sky-900 uppercase">
                {currentRound.title}
              </h2>
              <p className="text-base sm:text-lg font-extrabold text-sky-800">
                {spokenPrompt || currentRound.step1Prompt}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Repeat Voice Button */}
            <button
              id="sort-voice-repeat-btn"
              onClick={() => {
                soundManager.playPop();
                speakNarrative(spokenPrompt || currentRound.step1Prompt);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-100 hover:bg-sky-200 active:scale-95 text-sky-800 font-bold text-xs sm:text-sm rounded-xl border border-sky-300 transition shadow-sm"
              title="Hear instructions again"
            >
              <Volume2 className="w-4 h-4 text-sky-600 animate-pulse" />
              <span>Listen</span>
            </button>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------------------- */}
      {/* 2. MAIN SORTING PLAY AREA (BASKETS & MIXED OBJECTS)                     */}
      {/* ---------------------------------------------------------------------- */}
      <div className="flex-1 flex flex-col justify-between gap-4">
        {/* BASKETS ROW */}
        <div className="grid grid-cols-2 gap-3 sm:gap-6 w-full max-w-4xl mx-auto">
          {/* BASKET 1 (LEFT) */}
          <div
            ref={basket1Ref}
            id="sort-basket-1"
            onClick={() => handleBasketTap('basket_1')}
            className={`relative flex flex-col items-center justify-between p-3 sm:p-4 rounded-3xl border-4 transition-all duration-200 ${
              currentRound.basket1.theme.bg
            } ${currentRound.basket1.theme.border} ${
              hoveredBasket === 'basket_1'
                ? `scale-105 ring-4 ${currentRound.basket1.theme.glow} shadow-xl`
                : 'shadow-md'
            } min-h-[165px] sm:min-h-[195px] cursor-pointer`}
          >
            {/* Basket Header Badge */}
            <div
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs sm:text-sm font-black tracking-wider uppercase shadow-sm border border-white/60 ${currentRound.basket1.theme.badgeBg} ${currentRound.basket1.theme.badgeText}`}
            >
              <span className="text-base sm:text-lg">{currentRound.basket1.badgeEmoji}</span>
              <span>{currentRound.basket1.label}</span>
            </div>

            {/* Basket Visual Tub */}
            <div className="relative w-full flex-1 flex flex-wrap items-center justify-center gap-2 p-2 mt-2 bg-white/80 rounded-2xl border-2 border-dashed border-slate-300 overflow-hidden min-h-[90px]">
              {basket1Items.length === 0 ? (
                <div className="text-center text-xs sm:text-sm font-semibold text-slate-400">
                  Drop {currentRound.basket1.label.toLowerCase()} here
                </div>
              ) : (
                basket1Items.map((id) => {
                  const it = currentRound.items.find((i) => i.id === id);
                  if (!it) return null;
                  return (
                    <motion.div
                      key={id}
                      initial={{ scale: 0, rotate: -20 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 350, damping: 22 }}
                      className="relative p-1 bg-white rounded-xl shadow-sm border border-slate-200"
                    >
                      <SortObjectItem item={it} size="sm" showSizeScale={currentRound.ruleType === 'size'} />
                      <div className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white rounded-full p-0.5 shadow-sm">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>

          {/* BASKET 2 (RIGHT) */}
          <div
            ref={basket2Ref}
            id="sort-basket-2"
            onClick={() => handleBasketTap('basket_2')}
            className={`relative flex flex-col items-center justify-between p-3 sm:p-4 rounded-3xl border-4 transition-all duration-200 ${
              currentRound.basket2.theme.bg
            } ${currentRound.basket2.theme.border} ${
              hoveredBasket === 'basket_2'
                ? `scale-105 ring-4 ${currentRound.basket2.theme.glow} shadow-xl`
                : 'shadow-md'
            } min-h-[165px] sm:min-h-[195px] cursor-pointer`}
          >
            {/* Basket Header Badge */}
            <div
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs sm:text-sm font-black tracking-wider uppercase shadow-sm border border-white/60 ${currentRound.basket2.theme.badgeBg} ${currentRound.basket2.theme.badgeText}`}
            >
              <span className="text-base sm:text-lg">{currentRound.basket2.badgeEmoji}</span>
              <span>{currentRound.basket2.label}</span>
            </div>

            {/* Basket Visual Tub */}
            <div className="relative w-full flex-1 flex flex-wrap items-center justify-center gap-2 p-2 mt-2 bg-white/80 rounded-2xl border-2 border-dashed border-slate-300 overflow-hidden min-h-[90px]">
              {basket2Items.length === 0 ? (
                <div className="text-center text-xs sm:text-sm font-semibold text-slate-400">
                  Drop {currentRound.basket2.label.toLowerCase()} here
                </div>
              ) : (
                basket2Items.map((id) => {
                  const it = currentRound.items.find((i) => i.id === id);
                  if (!it) return null;
                  return (
                    <motion.div
                      key={id}
                      initial={{ scale: 0, rotate: 20 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 350, damping: 22 }}
                      className="relative p-1 bg-white rounded-xl shadow-sm border border-slate-200"
                    >
                      <SortObjectItem item={it} size="sm" showSizeScale={currentRound.ruleType === 'size'} />
                      <div className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white rounded-full p-0.5 shadow-sm">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* -------------------------------------------------------------------- */}
        {/* MIXED OBJECTS STAGING AREA (DRAGGABLE OBJECTS)                       */}
        {/* -------------------------------------------------------------------- */}
        <div className="relative w-full bg-slate-100/90 border-2 border-slate-200 rounded-3xl p-4 sm:p-5 shadow-inner">
          <div className="text-center text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Drag or Tap Objects into their Matching Basket
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 min-h-[110px]">
            <AnimatePresence>
              {unplacedItems.map((item) => {
                const isSelected = selectedItemId === item.id;
                const isShaking = wrongDropShakeId === item.id;

                return (
                  <motion.div
                    key={item.id}
                    layoutId={item.id}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{
                      scale: isSelected ? 1.15 : 1,
                      opacity: 1,
                      x: isShaking ? [0, -14, 14, -10, 10, 0] : 0,
                    }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{
                      type: 'spring',
                      stiffness: 400,
                      damping: 25,
                      x: { duration: 0.4 },
                    }}
                    drag
                    dragConstraints={containerRef}
                    dragElastic={0.1}
                    onDragStart={() => {
                      soundManager.playPop();
                      setActiveDraggingId(item.id);
                      setSelectedItemId(item.id);
                    }}
                    onDrag={(_, info) => {
                      checkDragOver(info.point);
                    }}
                    onDragEnd={(_, info) => {
                      if (!basket1Ref.current || !basket2Ref.current) return;
                      const b1 = basket1Ref.current.getBoundingClientRect();
                      const b2 = basket2Ref.current.getBoundingClientRect();
                      const pt = info.point;

                      const inB1 =
                        pt.x >= b1.left - 25 &&
                        pt.x <= b1.right + 25 &&
                        pt.y >= b1.top - 25 &&
                        pt.y <= b1.bottom + 25;

                      const inB2 =
                        pt.x >= b2.left - 25 &&
                        pt.x <= b2.right + 25 &&
                        pt.y >= b2.top - 25 &&
                        pt.y <= b2.bottom + 25;

                      if (inB1) {
                        handleDropValidation(item.id, 'basket_1');
                      } else if (inB2) {
                        handleDropValidation(item.id, 'basket_2');
                      } else {
                        handleDropValidation(item.id, null);
                      }
                    }}
                    onClick={() => {
                      soundManager.playPop();
                      setSelectedItemId(isSelected ? null : item.id);
                    }}
                    className={`relative p-2 rounded-2xl bg-white shadow-md cursor-grab active:cursor-grabbing border-2 transition-colors ${
                      isSelected
                        ? 'border-sky-500 ring-4 ring-sky-300 shadow-lg'
                        : 'border-slate-200 hover:border-sky-300 hover:shadow-lg'
                    }`}
                  >
                    <SortObjectItem
                      item={item}
                      size="md"
                      showSizeScale={currentRound.ruleType === 'size'}
                    />
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {unplacedItems.length === 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-2 text-emerald-600 font-extrabold text-base sm:text-lg"
              >
                <Sparkles className="w-6 h-6 animate-bounce" />
                <span>All objects sorted!</span>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------------------- */}
      {/* 3. SESSION COMPLETION CELEBRATION MODAL                               */}
      {/* ---------------------------------------------------------------------- */}
      <AnimatePresence>
        {isSessionComplete && (
          <motion.div
            id="sort-completion-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.7, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.7, y: 20 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="relative w-full max-w-md bg-gradient-to-b from-white to-sky-50 rounded-3xl p-6 sm:p-8 text-center shadow-2xl border-4 border-sky-400"
            >
              {/* Trophy & Sparkles */}
              <div className="relative inline-block mb-3">
                <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center shadow-lg border-4 border-white animate-bounce">
                  <Trophy className="w-10 h-10 sm:w-12 sm:h-12 text-amber-900" />
                </div>
                <Sparkles className="absolute -top-1 -right-1 w-7 h-7 text-amber-500 animate-spin" />
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
                Sorting Master!
              </h3>
              <p className="text-slate-600 font-medium text-sm sm:text-base mt-1 mb-6">
                You correctly sorted fruits, flowers, toys, animals, and colors!
              </p>

              {/* Action Buttons: REPLAY (Shuffle fresh rounds) & HOME */}
              <div className="flex flex-col gap-3">
                <button
                  id="sort-replay-btn"
                  onClick={handleReplay}
                  className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-black text-lg shadow-lg shadow-sky-500/30 hover:brightness-105 active:scale-95 transition"
                >
                  <RotateCcw className="w-5 h-5 stroke-[2.5]" />
                  <span>PLAY AGAIN (NEW OBJECTS)</span>
                </button>

                <div className="grid grid-cols-2 gap-3 mt-1">
                  {onNavigateHome && (
                    <button
                      id="sort-home-btn"
                      onClick={() => {
                        soundManager.playPop();
                        onNavigateHome();
                      }}
                      className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition"
                    >
                      <Home className="w-4 h-4" />
                      <span>Home</span>
                    </button>
                  )}

                  {onNavigateNext && (
                    <button
                      id="sort-next-btn"
                      onClick={() => {
                        soundManager.playPop();
                        onNavigateNext();
                      }}
                      className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-md shadow-emerald-500/20 transition"
                    >
                      <span>Next</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---------------------------------------------------------------------- */}
      {/* 4. ACTIVITY BOTTOM NAVIGATION                                         */}
      {/* ---------------------------------------------------------------------- */}
      <div className="mt-4">
        <ActivityBottomNav
          onNavigateHome={onNavigateHome}
          onNavigateNext={onNavigateNext}
          onNavigatePrev={onNavigatePrev}
          isCompleted={isActivityCompleted || isSessionComplete}
        />
      </div>
    </div>
  );
};
