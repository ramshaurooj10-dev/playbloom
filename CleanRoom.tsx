import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Volume2, Sparkles, Check, Award } from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { ActivityBottomNav } from './ActivityBottomNav';

interface CleanRoomProps {
  onCollectStar: () => void;
  onNavigateHome?: () => void;
  onNavigateNext?: () => void;
  onNavigatePrev?: () => void;
  isActivityCompleted?: boolean;
}

export type StorageCategory = 'toy_box' | 'bookshelf' | 'laundry_basket' | 'shoe_rack';

export interface RoomItem {
  id: string;
  name: string;
  category: StorageCategory;
  emoji: string;
  speechName: string;
  colorBg: string;
  borderColor: string;
  shadowColor: string;
}

export interface StorageDestination {
  id: StorageCategory;
  name: string;
  shortName: string;
  icon: string;
  speechDestination: string;
  borderColor: string;
  bgGradient: string;
  headerBg: string;
  textColor: string;
  hint: string;
  sampleItems: string[];
}

// 4 Clearly visible, obvious storage destinations with rich preschool visual illustrations
export const STORAGE_DESTINATIONS: Record<StorageCategory, StorageDestination> = {
  toy_box: {
    id: 'toy_box',
    name: 'Toy Box',
    shortName: 'Toys',
    icon: '🧸',
    speechDestination: 'the toy box',
    borderColor: 'border-amber-400 hover:border-amber-500',
    bgGradient: 'from-amber-100/95 via-yellow-50/90 to-orange-100/90',
    headerBg: 'bg-amber-400 text-amber-950',
    textColor: 'text-amber-950',
    hint: 'Toys belong here',
    sampleItems: ['🧸', '⚽', '🚗', '🧱', '🪆'],
  },
  bookshelf: {
    id: 'bookshelf',
    name: 'Bookshelf',
    shortName: 'Books',
    icon: '📚',
    speechDestination: 'the shelf',
    borderColor: 'border-blue-400 hover:border-blue-500',
    bgGradient: 'from-blue-100/95 via-sky-50/90 to-indigo-100/90',
    headerBg: 'bg-blue-500 text-white',
    textColor: 'text-blue-950',
    hint: 'Books belong here',
    sampleItems: ['📖', '📕', '📗', '🎨'],
  },
  laundry_basket: {
    id: 'laundry_basket',
    name: 'Laundry Basket',
    shortName: 'Clothes',
    icon: '🧺',
    speechDestination: 'the laundry basket',
    borderColor: 'border-pink-400 hover:border-pink-500',
    bgGradient: 'from-pink-100/95 via-rose-50/90 to-purple-100/90',
    headerBg: 'bg-pink-500 text-white',
    textColor: 'text-pink-950',
    hint: 'Clothes belong here',
    sampleItems: ['👕', '👖', '🧦', '👗'],
  },
  shoe_rack: {
    id: 'shoe_rack',
    name: 'Shoe Rack',
    shortName: 'Shoes',
    icon: '👟',
    speechDestination: 'the shoe rack',
    borderColor: 'border-emerald-400 hover:border-emerald-500',
    bgGradient: 'from-emerald-100/95 via-teal-50/90 to-green-100/90',
    headerBg: 'bg-emerald-500 text-white',
    textColor: 'text-emerald-950',
    hint: 'Shoes belong here',
    sampleItems: ['👟', '👞', '🥾', '👡'],
  },
};

// ============================================================================
// COMPREHENSIVE OBJECT POOL (32+ Preschool Room Objects across 4 Categories)
// ============================================================================
export const COMPLETE_OBJECT_POOL: RoomItem[] = [
  // --- TOYS (toy_box) ---
  {
    id: 'teddy_bear',
    name: 'Teddy',
    category: 'toy_box',
    emoji: '🧸',
    speechName: 'Teddy',
    colorBg: 'bg-amber-100',
    borderColor: 'border-amber-400',
    shadowColor: 'shadow-amber-400/30',
  },
  {
    id: 'ball',
    name: 'Ball',
    category: 'toy_box',
    emoji: '⚽',
    speechName: 'The ball',
    colorBg: 'bg-indigo-100',
    borderColor: 'border-indigo-400',
    shadowColor: 'shadow-indigo-400/30',
  },
  {
    id: 'toy_car',
    name: 'Toy Car',
    category: 'toy_box',
    emoji: '🚗',
    speechName: 'The toy car',
    colorBg: 'bg-red-100',
    borderColor: 'border-red-400',
    shadowColor: 'shadow-red-400/30',
  },
  {
    id: 'toy_truck',
    name: 'Toy Truck',
    category: 'toy_box',
    emoji: '🚚',
    speechName: 'The toy truck',
    colorBg: 'bg-orange-100',
    borderColor: 'border-orange-400',
    shadowColor: 'shadow-orange-400/30',
  },
  {
    id: 'blocks',
    name: 'Blocks',
    category: 'toy_box',
    emoji: '🧱',
    speechName: 'Building blocks',
    colorBg: 'bg-yellow-100',
    borderColor: 'border-yellow-400',
    shadowColor: 'shadow-yellow-400/30',
  },
  {
    id: 'doll',
    name: 'Doll',
    category: 'toy_box',
    emoji: '🪆',
    speechName: 'The doll',
    colorBg: 'bg-purple-100',
    borderColor: 'border-purple-400',
    shadowColor: 'shadow-purple-400/30',
  },
  {
    id: 'toy_train',
    name: 'Toy Train',
    category: 'toy_box',
    emoji: '🚂',
    speechName: 'The toy train',
    colorBg: 'bg-blue-100',
    borderColor: 'border-blue-400',
    shadowColor: 'shadow-blue-400/30',
  },
  {
    id: 'toy_dinosaur',
    name: 'Dinosaur',
    category: 'toy_box',
    emoji: '🦖',
    speechName: 'The toy dinosaur',
    colorBg: 'bg-emerald-100',
    borderColor: 'border-emerald-400',
    shadowColor: 'shadow-emerald-400/30',
  },
  {
    id: 'stuffed_bunny',
    name: 'Bunny',
    category: 'toy_box',
    emoji: '🐰',
    speechName: 'Stuffed bunny',
    colorBg: 'bg-pink-100',
    borderColor: 'border-pink-400',
    shadowColor: 'shadow-pink-400/30',
  },
  {
    id: 'toy_airplane',
    name: 'Airplane',
    category: 'toy_box',
    emoji: '✈️',
    speechName: 'The toy airplane',
    colorBg: 'bg-sky-100',
    borderColor: 'border-sky-400',
    shadowColor: 'shadow-sky-400/30',
  },
  {
    id: 'puzzle_pieces',
    name: 'Puzzle',
    category: 'toy_box',
    emoji: '🧩',
    speechName: 'The puzzle',
    colorBg: 'bg-teal-100',
    borderColor: 'border-teal-400',
    shadowColor: 'shadow-teal-400/30',
  },

  // --- BOOKS / READING (bookshelf) ---
  {
    id: 'picture_book',
    name: 'Picture Book',
    category: 'bookshelf',
    emoji: '📖',
    speechName: 'Picture book',
    colorBg: 'bg-sky-100',
    borderColor: 'border-sky-400',
    shadowColor: 'shadow-sky-400/30',
  },
  {
    id: 'story_book',
    name: 'Story Book',
    category: 'bookshelf',
    emoji: '📕',
    speechName: 'Story book',
    colorBg: 'bg-rose-100',
    borderColor: 'border-rose-400',
    shadowColor: 'shadow-rose-400/30',
  },
  {
    id: 'coloring_book',
    name: 'Coloring Book',
    category: 'bookshelf',
    emoji: '🎨',
    speechName: 'Coloring book',
    colorBg: 'bg-purple-100',
    borderColor: 'border-purple-400',
    shadowColor: 'shadow-purple-400/30',
  },
  {
    id: 'comic_book',
    name: 'Comic Book',
    category: 'bookshelf',
    emoji: '📚',
    speechName: 'Comic book',
    colorBg: 'bg-amber-100',
    borderColor: 'border-amber-400',
    shadowColor: 'shadow-amber-400/30',
  },
  {
    id: 'animal_book',
    name: 'Animal Book',
    category: 'bookshelf',
    emoji: '🦁',
    speechName: 'Animal book',
    colorBg: 'bg-yellow-100',
    borderColor: 'border-yellow-400',
    shadowColor: 'shadow-yellow-400/30',
  },
  {
    id: 'fairy_tale',
    name: 'Fairy Tale',
    category: 'bookshelf',
    emoji: '🏰',
    speechName: 'Fairy tale book',
    colorBg: 'bg-indigo-100',
    borderColor: 'border-indigo-400',
    shadowColor: 'shadow-indigo-400/30',
  },
  {
    id: 'abc_book',
    name: 'ABC Book',
    category: 'bookshelf',
    emoji: '🔤',
    speechName: 'ABC book',
    colorBg: 'bg-emerald-100',
    borderColor: 'border-emerald-400',
    shadowColor: 'shadow-emerald-400/30',
  },

  // --- CLOTHES (laundry_basket) ---
  {
    id: 'shirt',
    name: 'Shirt',
    category: 'laundry_basket',
    emoji: '👕',
    speechName: 'The shirt',
    colorBg: 'bg-cyan-100',
    borderColor: 'border-cyan-400',
    shadowColor: 'shadow-cyan-400/30',
  },
  {
    id: 'pants',
    name: 'Pants',
    category: 'laundry_basket',
    emoji: '👖',
    speechName: 'Pants',
    colorBg: 'bg-blue-100',
    borderColor: 'border-blue-400',
    shadowColor: 'shadow-blue-400/30',
  },
  {
    id: 'socks',
    name: 'Socks',
    category: 'laundry_basket',
    emoji: '🧦',
    speechName: 'Socks',
    colorBg: 'bg-pink-100',
    borderColor: 'border-pink-400',
    shadowColor: 'shadow-pink-400/30',
  },
  {
    id: 'pajamas',
    name: 'Pajamas',
    category: 'laundry_basket',
    emoji: '👚',
    speechName: 'Pajamas',
    colorBg: 'bg-purple-100',
    borderColor: 'border-purple-400',
    shadowColor: 'shadow-purple-400/30',
  },
  {
    id: 'dress',
    name: 'Dress',
    category: 'laundry_basket',
    emoji: '👗',
    speechName: 'The dress',
    colorBg: 'bg-rose-100',
    borderColor: 'border-rose-400',
    shadowColor: 'shadow-rose-400/30',
  },
  {
    id: 'sweater',
    name: 'Sweater',
    category: 'laundry_basket',
    emoji: '🧥',
    speechName: 'The sweater',
    colorBg: 'bg-amber-100',
    borderColor: 'border-amber-400',
    shadowColor: 'shadow-amber-400/30',
  },
  {
    id: 'shorts',
    name: 'Shorts',
    category: 'laundry_basket',
    emoji: '🩳',
    speechName: 'Shorts',
    colorBg: 'bg-teal-100',
    borderColor: 'border-teal-400',
    shadowColor: 'shadow-teal-400/30',
  },
  {
    id: 'cap',
    name: 'Cap',
    category: 'laundry_basket',
    emoji: '🧢',
    speechName: 'The cap',
    colorBg: 'bg-blue-100',
    borderColor: 'border-blue-400',
    shadowColor: 'shadow-blue-400/30',
  },
  {
    id: 'scarf',
    name: 'Scarf',
    category: 'laundry_basket',
    emoji: '🧣',
    speechName: 'The scarf',
    colorBg: 'bg-red-100',
    borderColor: 'border-red-400',
    shadowColor: 'shadow-red-400/30',
  },

  // --- SHOES (shoe_rack) ---
  {
    id: 'shoes',
    name: 'Shoes',
    category: 'shoe_rack',
    emoji: '👟',
    speechName: 'Shoes',
    colorBg: 'bg-emerald-100',
    borderColor: 'border-emerald-400',
    shadowColor: 'shadow-emerald-400/30',
  },
  {
    id: 'sneakers',
    name: 'Sneakers',
    category: 'shoe_rack',
    emoji: '👟',
    speechName: 'Sneakers',
    colorBg: 'bg-cyan-100',
    borderColor: 'border-cyan-400',
    shadowColor: 'shadow-cyan-400/30',
  },
  {
    id: 'slippers',
    name: 'Slippers',
    category: 'shoe_rack',
    emoji: '👡',
    speechName: 'Slippers',
    colorBg: 'bg-pink-100',
    borderColor: 'border-pink-400',
    shadowColor: 'shadow-pink-400/30',
  },
  {
    id: 'sandals',
    name: 'Sandals',
    category: 'shoe_rack',
    emoji: '🩴',
    speechName: 'Sandals',
    colorBg: 'bg-amber-100',
    borderColor: 'border-amber-400',
    shadowColor: 'shadow-amber-400/30',
  },
  {
    id: 'boots',
    name: 'Boots',
    category: 'shoe_rack',
    emoji: '🥾',
    speechName: 'Boots',
    colorBg: 'bg-amber-200',
    borderColor: 'border-amber-500',
    shadowColor: 'shadow-amber-500/30',
  },
];

// Presets for safe, visible, non-overlapping item scatter locations across the messy bedroom canvas
const SAFE_ROOM_ANCHORS: Array<{ left: number; top: number; angle: number }> = [
  { left: 10, top: 48, angle: -8 },  // Beside bed
  { left: 22, top: 58, angle: 10 },  // Front of bed on rug
  { left: 36, top: 48, angle: -6 },  // Center floor
  { left: 48, top: 56, angle: 8 },   // Right floor near desk
  { left: 14, top: 76, angle: -12 }, // Bottom left corner
  { left: 28, top: 78, angle: 6 },   // Bottom middle rug
  { left: 42, top: 76, angle: -7 },  // Bottom right floor
  { left: 8,  top: 64, angle: 14 },  // Far left under nightstand
  { left: 28, top: 42, angle: -10 }, // Center under window
  { left: 45, top: 38, angle: 8 },   // Near desk
  { left: 18, top: 34, angle: -5 },  // Beside bed headboard
  { left: 54, top: 46, angle: 12 },  // Near divider
  { left: 53, top: 74, angle: -9 },  // Far bottom right
  { left: 34, top: 62, angle: 5 },   // Center rug
  { left: 20, top: 68, angle: -7 },  // Lower left rug
  { left: 40, top: 35, angle: 7 },   // Under window right
];

interface PlacedItemState {
  item: RoomItem;
  placedAt: number;
}

interface ActiveRoomItem extends RoomItem {
  startLeft: number;
  startTop: number;
  startAngle: number;
}

interface FlyingItemState {
  item: ActiveRoomItem;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  startAngle: number;
}

// Fisher-Yates array shuffler
function shuffleArray<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export const CleanRoom: React.FC<CleanRoomProps> = ({
  onCollectStar,
  onNavigateHome,
  onNavigateNext,
  onNavigatePrev,
  isActivityCompleted = false,
}) => {
  // Game session & randomized layout state
  const [sessionNonce, setSessionNonce] = useState(1);
  const [activeItems, setActiveItems] = useState<ActiveRoomItem[]>([]);
  const [placedItems, setPlacedItems] = useState<Record<string, PlacedItemState>>({});
  
  // Two-step decision states
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [shakeDestination, setShakeDestination] = useState<StorageCategory | null>(null);
  const [pulsingDestination, setPulsingDestination] = useState<StorageCategory | null>(null);
  const [flyingItem, setFlyingItem] = useState<FlyingItemState | null>(null);
  
  // Game outcome states
  const [isCompleted, setIsCompleted] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [feedbackBanner, setFeedbackBanner] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  // References for measuring flight path across DOM containers
  const boardRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const destinationRefs = {
    toy_box: useRef<HTMLDivElement | null>(null),
    bookshelf: useRef<HTMLDivElement | null>(null),
    laundry_basket: useRef<HTMLDivElement | null>(null),
    shoe_rack: useRef<HTMLDivElement | null>(null),
  };

  const bannerTimerRef = useRef<any>(null);
  const celebrationTimerRef = useRef<any>(null);
  const flightSafetyTimerRef = useRef<any>(null);

  // Find currently selected item
  const selectedItem = activeItems.find((item) => item.id === selectedItemId && !placedItems[item.id]) || null;

  // ==========================================================================
  // INITIALIZE A BRAND NEW RANDOM MESSY ROOM FROM LARGE 32+ OBJECT POOL
  // ==========================================================================
  const initializeMessyRoom = useCallback(() => {
    soundManager.stopSpeech();
    if (bannerTimerRef.current) clearTimeout(bannerTimerRef.current);
    if (celebrationTimerRef.current) clearTimeout(celebrationTimerRef.current);
    if (flightSafetyTimerRef.current) clearTimeout(flightSafetyTimerRef.current);

    // 1. Separate pool by category
    const toysPool = shuffleArray(COMPLETE_OBJECT_POOL.filter((i) => i.category === 'toy_box'));
    const booksPool = shuffleArray(COMPLETE_OBJECT_POOL.filter((i) => i.category === 'bookshelf'));
    const clothesPool = shuffleArray(COMPLETE_OBJECT_POOL.filter((i) => i.category === 'laundry_basket'));
    const shoesPool = shuffleArray(COMPLETE_OBJECT_POOL.filter((i) => i.category === 'shoe_rack'));

    // 2. Select variable number of items between 8 and 10 for preschool engagement
    const targetCount = 8 + Math.floor(Math.random() * 3); // 8, 9, or 10 items

    // 3. Guarantee balanced preschool representation across all 4 destinations:
    // (At least 2-3 toys, 1-2 books, 2 clothes, 1-2 shoes)
    const selected: RoomItem[] = [
      ...toysPool.slice(0, 2 + Math.floor(Math.random() * 2)), // 2 or 3 toys
      ...booksPool.slice(0, 1 + Math.floor(Math.random() * 2)), // 1 or 2 books
      ...clothesPool.slice(0, 2 + Math.floor(Math.random() * 2)), // 2 or 3 clothes
      ...shoesPool.slice(0, 1 + Math.floor(Math.random() * 2)), // 1 or 2 shoes
    ];

    // Ensure we fill exactly up to targetCount from remaining unused pool items without duplicates
    const selectedIds = new Set(selected.map((item) => item.id));
    const remainingPool = shuffleArray(COMPLETE_OBJECT_POOL.filter((item) => !selectedIds.has(item.id)));

    while (selected.length < targetCount && remainingPool.length > 0) {
      const nextItem = remainingPool.pop()!;
      selected.push(nextItem);
      selectedIds.add(nextItem.id);
    }

    // 4. Shuffle the final selected items so category order is completely randomized
    const shuffledItems = shuffleArray(selected.slice(0, targetCount));
    const shuffledAnchors = shuffleArray(SAFE_ROOM_ANCHORS);

    // 5. Scatter items naturally across room with subtle randomized jitter and angles
    const randomizedLayout: ActiveRoomItem[] = shuffledItems.map((item, index) => {
      const anchor = shuffledAnchors[index % shuffledAnchors.length];
      const jitterX = (Math.random() - 0.5) * 3; // +/- 1.5%
      const jitterY = (Math.random() - 0.5) * 3; // +/- 1.5%
      const jitterAngle = (Math.random() - 0.5) * 14;

      return {
        ...item,
        startLeft: Math.max(7, Math.min(56, anchor.left + jitterX)),
        startTop: Math.max(34, Math.min(82, anchor.top + jitterY)),
        startAngle: Math.max(-18, Math.min(18, anchor.angle + jitterAngle)),
      };
    });

    setActiveItems(randomizedLayout);
    setPlacedItems({});
    setSelectedItemId(null);
    setShakeDestination(null);
    setPulsingDestination(null);
    setFlyingItem(null);
    setIsCompleted(false);
    setShowCelebration(false);
    setFeedbackBanner(null);
    setSessionNonce((prev) => prev + 1);

    // Play welcoming preschool voice intro
    setTimeout(() => {
      soundManager.speak("Oh no! The room is messy. Let's clean it up! Tap an item first.");
    }, 200);
  }, []);

  // Initialize on mount
  useEffect(() => {
    initializeMessyRoom();

    return () => {
      if (bannerTimerRef.current) clearTimeout(bannerTimerRef.current);
      if (celebrationTimerRef.current) clearTimeout(celebrationTimerRef.current);
      if (flightSafetyTimerRef.current) clearTimeout(flightSafetyTimerRef.current);
      soundManager.stopSpeech();
    };
  }, [initializeMessyRoom]);

  // Repeat instruction voice
  const handleRepeatVoice = () => {
    soundManager.playPop();
    soundManager.stopSpeech();
    const remainingCount = activeItems.length - Object.keys(placedItems).length;
    if (remainingCount === 0) {
      soundManager.speak('Great job! Your room is completely clean!');
    } else if (selectedItem) {
      soundManager.speak(`${selectedItem.speechName}. Where does ${selectedItem.speechName} go?`);
    } else {
      soundManager.speak(`Tap any item on the floor to pick it up. There are ${remainingCount} items left to clean.`);
    }
  };

  // Replay activity completely fresh
  const handleReplay = () => {
    soundManager.playPop();
    initializeMessyRoom();
  };

  // =========================================================================
  // STEP 1: CHILD TAPS/SELECTS AN OBJECT (DOES NOT AUTOMATICALLY MOVE IT)
  // =========================================================================
  const handleItemSelect = (item: ActiveRoomItem) => {
    // Prevent tapping already placed items or while another is in flight or completed
    if (placedItems[item.id] || flyingItem !== null || isCompleted) return;

    soundManager.playPop();
    soundManager.stopSpeech();

    // Select the item and keep it in its floor location with a soft highlight
    setSelectedItemId(item.id);

    // Clear any previous destination shake
    setShakeDestination(null);

    // Voice instruction: State object name + ask where it goes
    soundManager.speak(`${selectedItem?.id === item.id ? '' : item.speechName + '. '}Where does ${item.speechName} go?`);

    setFeedbackBanner({
      text: `${item.name} selected! Where does it go? Tap a box or shelf!`,
      type: 'info',
    });
    if (bannerTimerRef.current) clearTimeout(bannerTimerRef.current);
    bannerTimerRef.current = setTimeout(() => {
      setFeedbackBanner(null);
    }, 3000);
  };

  // =========================================================================
  // STEP 2: CHILD TAPS A STORAGE DESTINATION -> CHECK ANSWER
  // =========================================================================
  const handleDestinationSelect = (destinationKey: StorageCategory) => {
    // If no item is selected, prompt child to select an item first
    if (!selectedItem || flyingItem !== null || isCompleted) {
      soundManager.playPop();
      soundManager.stopSpeech();
      soundManager.speak('Tap an item on the floor first!');
      setFeedbackBanner({
        text: 'Tap an item on the floor first!',
        type: 'info',
      });
      if (bannerTimerRef.current) clearTimeout(bannerTimerRef.current);
      bannerTimerRef.current = setTimeout(() => {
        setFeedbackBanner(null);
      }, 2000);
      return;
    }

    const dest = STORAGE_DESTINATIONS[destinationKey];

    // =======================================================================
    // CHECK ANSWER: Is this the correct destination for the selected item?
    // =======================================================================
    if (selectedItem.category === destinationKey) {
      // ---------------------------------------------------------------------
      // CORRECT ANSWER!
      // ---------------------------------------------------------------------
      soundManager.stopSpeech();
      soundManager.playTidySnap();

      // Destination snap pulse
      setPulsingDestination(destinationKey);
      setTimeout(() => {
        setPulsingDestination(null);
      }, 400);

      // Measure coordinates for smooth animated flight
      const itemEl = itemRefs.current[selectedItem.id];
      const destEl = destinationRefs[destinationKey].current;
      const boardEl = boardRef.current;

      const itemToPlace = selectedItem;
      // Clear selection so floor item isn't re-tapped
      setSelectedItemId(null);

      if (itemEl && destEl && boardEl) {
        const itemRect = itemEl.getBoundingClientRect();
        const destRect = destEl.getBoundingClientRect();
        const boardRect = boardEl.getBoundingClientRect();

        const startX = itemRect.left - boardRect.left + itemRect.width / 2;
        const startY = itemRect.top - boardRect.top + itemRect.height / 2;
        const endX = destRect.left - boardRect.left + destRect.width / 2;
        const endY = destRect.top - boardRect.top + destRect.height / 2;

        setFlyingItem({
          item: itemToPlace,
          startX,
          startY,
          endX,
          endY,
          startAngle: itemToPlace.startAngle,
        });

        if (flightSafetyTimerRef.current) clearTimeout(flightSafetyTimerRef.current);
        flightSafetyTimerRef.current = setTimeout(() => {
          finishCorrectPlacement(itemToPlace, dest);
        }, 750);
      } else {
        finishCorrectPlacement(itemToPlace, dest);
      }
    } else {
      // ---------------------------------------------------------------------
      // WRONG ANSWER:
      // DO NOT move the object.
      // DO NOT remove it.
      // DO NOT reveal or highlight the correct box!
      // Give gentle feedback & let child try again.
      // ---------------------------------------------------------------------
      soundManager.stopSpeech();
      soundManager.playError();

      // Trigger gentle shake on the tapped wrong destination
      setShakeDestination(destinationKey);
      setTimeout(() => {
        setShakeDestination(null);
      }, 450);

      // Gentle voice feedback
      const gentleErrorPhrases = [
        'Oops! Try again.',
        "That doesn't belong there.",
        'Oops! Try another spot.',
      ];
      const randomPhrase = gentleErrorPhrases[Math.floor(Math.random() * gentleErrorPhrases.length)];
      soundManager.speak(randomPhrase);

      setFeedbackBanner({
        text: `Oops! That doesn't belong in the ${dest.name}. Try again!`,
        type: 'error',
      });
      if (bannerTimerRef.current) clearTimeout(bannerTimerRef.current);
      bannerTimerRef.current = setTimeout(() => {
        setFeedbackBanner(null);
      }, 2500);

      // Selected item remains highlighted so the child can try another destination immediately!
    }
  };

  // Finalize placement into storage upon flight completion
  const finishCorrectPlacement = useCallback(
    (item: ActiveRoomItem, dest: StorageDestination) => {
      setPlacedItems((prev) => {
        const nextPlaced = {
          ...prev,
          [item.id]: { item, placedAt: Date.now() },
        };

        const totalCleaned = Object.keys(nextPlaced).length;
        const totalItems = activeItems.length;

        // Visual feedback banner
        setFeedbackBanner({
          text: `Great job! ${item.name} goes in ${dest.speechDestination}!`,
          type: 'success',
        });
        if (bannerTimerRef.current) clearTimeout(bannerTimerRef.current);
        bannerTimerRef.current = setTimeout(() => {
          setFeedbackBanner(null);
        }, 2200);

        // Voice Feedback tailored to category / item
        if (totalCleaned < totalItems) {
          let voiceText = `Great job! ${item.speechName} goes in ${dest.speechDestination}.`;
          if (item.category === 'toy_box') {
            voiceText = `Great job! ${item.speechName} goes in the toy box.`;
          } else if (item.category === 'bookshelf') {
            voiceText = `Great job! ${item.speechName} goes on the shelf.`;
          } else if (item.category === 'laundry_basket') {
            voiceText = `Great job! ${item.speechName} goes in the laundry basket.`;
          } else if (item.category === 'shoe_rack') {
            voiceText = `Great job! ${item.speechName} goes on the shoe rack.`;
          }

          soundManager.speak(voiceText);
        } else {
          // --- ALL ITEMS CLEANED! VICTORY & CELEBRATION ---
          setIsCompleted(true);
          onCollectStar();

          soundManager.playSparkleSweep();
          soundManager.speak('Wow! Great job! Your room is clean!');

          celebrationTimerRef.current = setTimeout(() => {
            setShowCelebration(true);
            soundManager.playCelebration();
          }, 1200);
        }

        return nextPlaced;
      });

      // Clear flying state
      setFlyingItem(null);
    },
    [activeItems.length, onCollectStar]
  );

  // Helper counts
  const cleanedCount = Object.keys(placedItems).length;
  const totalCount = activeItems.length || 8;
  const cleanPercentage = Math.round((cleanedCount / totalCount) * 100);

  return (
    <div className="w-full max-w-5xl mx-auto px-2 sm:px-4 py-2 sm:py-4 flex flex-col items-center select-none">
      {/* Main Activity Board Container */}
      <div
        ref={boardRef}
        className="w-full bg-gradient-to-b from-indigo-50 via-sky-50 to-blue-100 border-4 sm:border-6 border-indigo-400 rounded-3xl sm:rounded-4xl p-3 sm:p-5 shadow-2xl relative overflow-hidden transition-all duration-500"
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between gap-2 mb-2 sm:mb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleRepeatVoice}
              className="p-2.5 sm:p-3 bg-white hover:bg-indigo-50 active:scale-95 text-indigo-700 rounded-2xl border-2 sm:border-3 border-indigo-300 shadow-md transition-all flex items-center justify-center cursor-pointer"
              title="Repeat Voice Instructions"
              aria-label="Repeat Voice Instructions"
            >
              <Volume2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <button
              onClick={initializeMessyRoom}
              className="p-2.5 sm:p-3 bg-white hover:bg-slate-50 active:scale-95 text-slate-700 rounded-2xl border-2 sm:border-3 border-slate-300 shadow-md transition-all flex items-center justify-center cursor-pointer"
              title="Restart / Generate New Messy Room"
              aria-label="Restart / Generate New Messy Room"
            >
              <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Activity Title & Current Interaction Prompt */}
          <div className="text-center px-2">
            <div className="flex items-center justify-center gap-1.5">
              <span className="text-xl sm:text-2xl">🧹</span>
              <h2 className="text-lg sm:text-2xl font-black text-slate-800 tracking-tight uppercase">
                CLEAN THE ROOM
              </h2>
            </div>
            <div className="inline-flex items-center gap-1.5 bg-white/95 px-3.5 py-1 rounded-full border border-indigo-300 shadow-xs mt-0.5">
              {selectedItem ? (
                <span className="text-xs sm:text-sm font-black text-indigo-900 flex items-center gap-1">
                  <span className="text-base">{selectedItem.emoji}</span>
                  <span>Where does {selectedItem.name} go? Tap the right box!</span>
                </span>
              ) : isCompleted ? (
                <span className="text-xs sm:text-sm font-black text-emerald-700">
                  ✨ Room is Sparkling Clean!
                </span>
              ) : (
                <span className="text-xs sm:text-sm font-bold text-slate-700">
                  👉 Step 1: Tap an item to pick it up
                </span>
              )}
            </div>
          </div>

          {/* Clean Progress Pill: CLEANED: X / Total */}
          <div className="flex items-center gap-1.5 bg-white/95 px-3 py-1.5 rounded-2xl border-2 border-indigo-300 shadow-sm">
            <Sparkles className={`w-4 h-4 ${cleanedCount > 0 ? 'text-amber-500 animate-spin' : 'text-slate-400'}`} />
            <span className="text-xs sm:text-sm font-black text-indigo-950 whitespace-nowrap">
              CLEANED: {cleanedCount} / {totalCount}
            </span>
          </div>
        </div>

        {/* Feedback Banner (Friendly Pop-up) */}
        <AnimatePresence>
          {feedbackBanner && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.95 }}
              className={`w-full py-2 px-4 rounded-2xl mb-2 text-center text-xs sm:text-sm font-black border-2 shadow-sm transition-colors ${
                feedbackBanner.type === 'success'
                  ? 'bg-emerald-100 text-emerald-950 border-emerald-400'
                  : feedbackBanner.type === 'error'
                  ? 'bg-rose-100 text-rose-950 border-rose-400'
                  : 'bg-indigo-100 text-indigo-950 border-indigo-300'
              }`}
            >
              {feedbackBanner.text}
            </motion.div>
          )}
        </AnimatePresence>

        {/* MAIN PLAYABLE CANVAS: BEDROOM ON LEFT/CENTER + STORAGE DESTINATIONS ON RIGHT */}
        <div className="relative w-full grid grid-cols-1 lg:grid-cols-12 gap-3 min-h-[440px] sm:min-h-[500px]">
          
          {/* ========================================================= */}
          {/* LEFT/CENTER: BEAUTIFUL ILLUSTRATED BEDROOM CANVAS */}
          {/* ========================================================= */}
          <div
            className="lg:col-span-7 relative w-full h-[380px] sm:h-[460px] lg:h-[510px] rounded-3xl border-3 sm:border-4 border-indigo-300/80 overflow-hidden shadow-inner flex flex-col justify-between"
            style={{
              background: 'linear-gradient(180deg, #F0FDF4 0%, #EFF6FF 42%, #FDE68A 43%, #D97706 100%)',
            }}
          >
            {/* --- BEDROOM WALLPAPER (UPPER 43%) --- */}
            <div className="absolute inset-x-0 top-0 h-[43%] bg-gradient-to-b from-sky-100 via-indigo-50 to-pink-50 overflow-hidden">
              {/* Wallpaper stripes */}
              <div className="absolute inset-0 opacity-20 flex justify-around">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="w-4 h-full bg-indigo-300/40 transform -skew-x-12" />
                ))}
              </div>

              {/* Bedroom Window */}
              <div className="absolute top-3 left-[36%] w-24 sm:w-32 h-20 sm:h-26 rounded-t-full bg-gradient-to-b from-sky-300 to-sky-100 border-3 border-white shadow-md overflow-hidden">
                <div className="absolute top-2 right-2 text-xl animate-pulse">☀️</div>
                <div className="absolute top-6 left-1 text-lg opacity-80">☁️</div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-0.5 bg-white shadow-xs" />
                  <div className="h-full w-0.5 bg-white shadow-xs absolute" />
                </div>
                <div className="absolute top-0 left-0 w-3 h-full bg-rose-200/90 border-r border-rose-300" />
                <div className="absolute top-0 right-0 w-3 h-full bg-rose-200/90 border-l border-rose-300" />
              </div>

              {/* Cute Bed Headboard & Cozy Bed (Upper Left) */}
              <div className="absolute top-10 left-3 sm:left-4 w-32 sm:w-44">
                <div className="h-10 sm:h-12 bg-amber-800 rounded-t-2xl border-2 border-amber-950 flex items-center justify-center shadow-md">
                  <span className="text-xs text-amber-200 font-bold tracking-widest uppercase">Cozy Bed</span>
                </div>
                <div className="flex gap-1 -mt-2 px-2 z-10 relative">
                  <div className="w-12 h-6 bg-white rounded-t-xl border border-slate-300 shadow-xs flex items-center justify-center text-[10px]">☁️</div>
                  <div className="w-12 h-6 bg-sky-100 rounded-t-xl border border-sky-300 shadow-xs flex items-center justify-center text-[10px]">⭐</div>
                </div>
                <div className="h-18 sm:h-22 bg-gradient-to-b from-sky-400 to-blue-600 rounded-b-xl border-2 border-blue-800 shadow-lg p-2 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-25 flex flex-wrap gap-2 p-1">
                    {[...Array(6)].map((_, i) => (
                      <span key={i} className="text-xs text-white">✨</span>
                    ))}
                  </div>
                  <div className="relative z-10 text-[10px] sm:text-xs font-black text-white/90">
                    Bed
                  </div>
                </div>
              </div>

              {/* Bedside Table / Nightstand & Lamp */}
              <div className="absolute top-16 left-38 sm:left-50 w-12 sm:w-16 h-18 bg-amber-700 rounded-xl border-2 border-amber-900 shadow-md flex flex-col items-center justify-between p-1">
                <div className="flex flex-col items-center -mt-5">
                  <div className="w-7 h-5 bg-amber-300 rounded-t-full border border-amber-400 shadow-xs" />
                  <div className="w-1 h-3 bg-amber-900" />
                </div>
                <div className="w-full h-1 bg-amber-900 rounded-full" />
                <div className="w-2 h-2 bg-amber-400 rounded-full" />
              </div>

              {/* Desk / Study Area (Right side of wall) */}
              <div className="absolute top-14 right-4 sm:right-6 w-24 sm:w-32 h-20 bg-emerald-100 rounded-2xl border-2 border-emerald-300 shadow-sm p-2 flex flex-col justify-between">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black text-emerald-800">Study Desk</span>
                  <span className="text-sm">✏️</span>
                </div>
                <div className="flex gap-1 text-xs">
                  <span>🎨</span>
                  <span>📐</span>
                </div>
              </div>
            </div>

            {/* --- WOODEN BEDROOM FLOOR (LOWER 57%) --- */}
            <div className="absolute inset-x-0 bottom-0 h-[57%] overflow-hidden">
              {/* Floor Wood Plank Stripes */}
              <div className="absolute inset-0 opacity-15 flex flex-col justify-between">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="w-full h-0.5 bg-amber-950" />
                ))}
              </div>

              {/* Large Soft Star Bedroom Rug (Center) */}
              <div className="absolute top-4 left-[14%] w-[72%] h-[80%] rounded-[40px] bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 border-3 border-dashed border-indigo-300/80 shadow-md flex items-center justify-center">
                <div className="text-center opacity-35 select-none pointer-events-none">
                  <span className="text-5xl sm:text-7xl">⭐</span>
                  <p className="text-[10px] sm:text-xs font-black text-indigo-950 uppercase tracking-wider">Play Rug</p>
                </div>
              </div>

              {/* Clean Transformation Sparkles when Room is Cleaned */}
              {cleanedCount > 0 && (
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(Math.min(cleanedCount * 2, 14))].map((_, i) => (
                    <motion.div
                      key={`sparkle-${i}`}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: [0.8, 1.2, 0.9], opacity: [0.6, 1, 0.7] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.15 }}
                      className="absolute text-amber-300 font-bold"
                      style={{
                        left: `${10 + (i * 14) % 80}%`,
                        top: `${20 + (i * 18) % 65}%`,
                      }}
                    >
                      ✨
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* --- SCATTERED BEDROOM ITEMS ON FLOOR --- */}
            {activeItems.map((item) => {
              const isPlaced = placedItems[item.id] !== undefined;
              const isCurrentlyFlying = flyingItem?.item.id === item.id;
              const isSelected = selectedItemId === item.id;

              // Hide items from floor once placed or while flying in air
              if (isPlaced || isCurrentlyFlying) return null;

              return (
                <div
                  key={`item-${sessionNonce}-${item.id}`}
                  ref={(el) => {
                    itemRefs.current[item.id] = el;
                  }}
                  style={{
                    left: `${item.startLeft}%`,
                    top: `${item.startTop}%`,
                    position: 'absolute',
                  }}
                  className={`transform -translate-x-1/2 -translate-y-1/2 select-none ${
                    isSelected ? 'z-40' : 'z-30'
                  }`}
                >
                  <motion.button
                    type="button"
                    onClick={() => handleItemSelect(item)}
                    whileHover={{ scale: 1.12 }}
                    whileTap={{ scale: 0.95 }}
                    animate={
                      isSelected
                        ? {
                            scale: [1.12, 1.18, 1.12],
                            rotate: [item.startAngle - 2, item.startAngle + 2, item.startAngle - 2],
                          }
                        : {}
                    }
                    transition={isSelected ? { duration: 1.5, repeat: Infinity } : { duration: 0.2 }}
                    className="cursor-pointer focus:outline-none rounded-2xl group transition-all"
                  >
                    <div
                      className={`flex flex-col items-center justify-center p-2 sm:p-2.5 rounded-2xl border-3 ${
                        isSelected
                          ? 'border-indigo-600 ring-4 ring-indigo-400 ring-offset-2 bg-indigo-50 shadow-2xl shadow-indigo-500/40'
                          : `${item.borderColor} ${item.colorBg} shadow-lg ${item.shadowColor} group-hover:shadow-xl`
                      } transition-all`}
                      style={{ transform: `rotate(${isSelected ? 0 : item.startAngle}deg)` }}
                    >
                      <span className="text-3xl sm:text-4xl pointer-events-none drop-shadow-sm group-hover:scale-105 transition-transform">
                        {item.emoji}
                      </span>
                      <span
                        className={`text-[10px] sm:text-xs font-black tracking-tight whitespace-nowrap pointer-events-none px-2 py-0.5 rounded-md mt-0.5 border shadow-2xs ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-700'
                            : 'bg-white/95 text-slate-800 border-slate-200'
                        }`}
                      >
                        {item.name}
                      </span>
                      <span
                        className={`text-[9px] font-extrabold pointer-events-none mt-0.5 flex items-center gap-0.5 ${
                          isSelected ? 'text-indigo-700' : 'text-slate-600'
                        }`}
                      >
                        {isSelected ? '✓ Selected' : 'Tap to pick up'}
                      </span>
                    </div>
                  </motion.button>
                </div>
              );
            })}

            {/* Room Status Badge at bottom left */}
            <div className="absolute bottom-2 left-2 z-20 pointer-events-none bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-xl border border-slate-300 shadow-xs flex items-center gap-1.5">
              <span className="text-xs">🛏️</span>
              <span className="text-[10px] sm:text-xs font-bold text-slate-700">
                {cleanedCount === totalCount
                  ? 'All tidy and clean!'
                  : `${totalCount - cleanedCount} items left to clean`}
              </span>
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT SIDE: 4 CLEARLY LABELED STORAGE DESTINATIONS */}
          {/* ========================================================= */}
          <div className="lg:col-span-5 flex flex-col gap-2.5 justify-between">
            <div className="text-center lg:text-left px-1 flex items-center justify-between">
              <span className="text-xs sm:text-sm font-extrabold text-slate-800 bg-white/90 px-3 py-1 rounded-full border border-indigo-200 shadow-2xs">
                📦 Choose where it belongs:
              </span>
              {selectedItem && (
                <span className="text-[11px] font-black text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full border border-indigo-300 animate-pulse">
                  Tap a storage area!
                </span>
              )}
            </div>

            {/* The 4 Storage Destinations */}
            {(['toy_box', 'bookshelf', 'laundry_basket', 'shoe_rack'] as StorageCategory[]).map((categoryKey) => {
              const dest = STORAGE_DESTINATIONS[categoryKey];
              const isShaking = shakeDestination === categoryKey;
              const isPulsing = pulsingDestination === categoryKey;
              const itemsInDest = (Object.values(placedItems) as PlacedItemState[]).filter(
                (p) => p.item.category === categoryKey
              );

              return (
                <motion.div
                  key={dest.id}
                  ref={destinationRefs[categoryKey]}
                  onClick={() => handleDestinationSelect(categoryKey)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  animate={
                    isShaking
                      ? { x: [-8, 8, -6, 6, -3, 3, 0] }
                      : isPulsing
                      ? { scale: [1, 1.05, 1] }
                      : {}
                  }
                  transition={{ duration: 0.35 }}
                  className={`relative flex-1 p-2 sm:p-2.5 rounded-2xl sm:rounded-3xl border-3 sm:border-4 bg-gradient-to-r ${dest.bgGradient} shadow-md transition-all duration-200 flex flex-col justify-between cursor-pointer ${
                    isShaking
                      ? 'border-rose-500 ring-4 ring-rose-300 bg-rose-50'
                      : isPulsing
                      ? 'scale-103 border-emerald-500 ring-4 ring-emerald-300 bg-white shadow-xl'
                      : selectedItem
                      ? 'border-indigo-300 hover:border-indigo-500 hover:shadow-lg'
                      : dest.borderColor
                  }`}
                  role="button"
                  tabIndex={0}
                  aria-label={`Storage destination: ${dest.name}`}
                >
                  {/* Destination Header Banner */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/95 rounded-2xl border-2 border-slate-300 shadow-xs flex items-center justify-center text-2xl sm:text-3xl">
                        {dest.icon}
                      </div>
                      <div>
                        <h3 className={`text-xs sm:text-base font-black ${dest.textColor} uppercase tracking-tight flex items-center gap-1`}>
                          {dest.name}
                        </h3>
                        {/* Sample visuals to make destination 100% obvious for preschoolers */}
                        <div className="flex items-center gap-1 text-xs opacity-90 mt-0.5">
                          {dest.sampleItems.map((sample, sIdx) => (
                            <span key={sIdx} className="text-xs sm:text-sm drop-shadow-2xs">{sample}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Placed Count / Destination Pill */}
                    <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center gap-1 bg-white/95 px-2.5 py-0.5 rounded-full border border-slate-300 shadow-2xs">
                        <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                        <span className="text-xs font-black text-slate-800">
                          {itemsInDest.length}
                        </span>
                      </div>
                      {selectedItem && (
                        <span className="text-[9px] font-black text-indigo-700 bg-white/90 px-1.5 py-0.2 rounded border border-indigo-200">
                          Put here 👉
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Stored Items Shelf / Compartment View */}
                  <div className="mt-1 min-h-[34px] sm:min-h-[38px] bg-white/75 rounded-xl border border-dashed border-slate-300/80 p-1 flex items-center gap-1.5 overflow-x-auto">
                    {itemsInDest.length === 0 ? (
                      <div className="w-full text-center text-[10px] sm:text-xs font-bold text-slate-400 italic">
                        {dest.shortName} go here
                      </div>
                    ) : (
                      itemsInDest.map((p) => (
                        <motion.div
                          key={p.item.id}
                          initial={{ scale: 0, rotate: -20 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: 'spring', stiffness: 350, damping: 15 }}
                          className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-lg border border-slate-200 shadow-xs flex-shrink-0"
                          title={p.item.name}
                        >
                          <span className="text-base sm:text-lg">{p.item.emoji}</span>
                          <span className="text-[9px] font-black text-slate-700 hidden sm:inline">
                            {p.item.name}
                          </span>
                        </motion.div>
                      ))
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ========================================================= */}
        {/* VISIBLE TRAVELLING ITEM (SMOOTH FLIGHT ANIMATION) */}
        {/* ========================================================= */}
        <AnimatePresence>
          {flyingItem && (
            <motion.div
              key={`flying-${flyingItem.item.id}`}
              initial={{
                left: flyingItem.startX,
                top: flyingItem.startY,
                x: '-50%',
                y: '-50%',
                scale: 1.15,
                rotate: flyingItem.startAngle,
              }}
              animate={{
                left: [flyingItem.startX, (flyingItem.startX + flyingItem.endX) / 2, flyingItem.endX],
                top: [flyingItem.startY, Math.min(flyingItem.startY, flyingItem.endY) - 40, flyingItem.endY],
                scale: [1.15, 1.35, 0.85],
                rotate: [flyingItem.startAngle, 0, 5],
              }}
              transition={{
                duration: 0.65,
                ease: [0.22, 1, 0.36, 1], // Smooth snappy arc transition
              }}
              onAnimationComplete={() => {
                const targetDest = STORAGE_DESTINATIONS[flyingItem.item.category];
                finishCorrectPlacement(flyingItem.item, targetDest);
              }}
              className="absolute z-50 pointer-events-none"
            >
              <div
                className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border-3 ${flyingItem.item.borderColor} ${flyingItem.item.colorBg} shadow-2xl ring-4 ring-white`}
              >
                <span className="text-4xl drop-shadow-md">{flyingItem.item.emoji}</span>
                <span className="text-xs font-black text-slate-900 bg-white/95 px-2 py-0.5 rounded-md mt-0.5 border border-slate-300 shadow-xs">
                  {flyingItem.item.name}
                </span>
                <div className="flex items-center gap-1 text-[9px] font-black text-emerald-700 mt-0.5">
                  <Sparkles className="w-3 h-3 text-amber-500 animate-spin" /> Putting away...
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Clean Progress Bottom Bar */}
        <div className="w-full mt-3 sm:mt-4 flex flex-col sm:flex-row items-center justify-between gap-2 px-1">
          <div className="w-full sm:w-2/3 bg-slate-200/80 rounded-full h-3.5 p-0.5 border border-slate-300 overflow-hidden shadow-inner">
            <div
              className="bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${cleanPercentage}%` }}
            />
          </div>

          <div className="flex items-center gap-2 text-xs font-black text-slate-700 bg-white/90 px-3 py-1 rounded-full border border-slate-300 shadow-2xs">
            <span>{cleanedCount === totalCount ? '🎉 Room is 100% Clean!' : `${cleanPercentage}% Completed`}</span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* CELEBRATION MODAL ON FULL ROOM CLEANING COMPLETION */}
        {/* ========================================================= */}
        <AnimatePresence>
          {showCelebration && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              className="absolute inset-0 bg-indigo-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 z-50 text-center"
            >
              {/* Golden Trophy & Sparkles */}
              <div className="relative mb-3">
                <motion.div
                  animate={{ rotate: [0, -10, 10, -5, 5, 0], scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-tr from-amber-400 to-yellow-300 rounded-full flex items-center justify-center border-4 border-white shadow-2xl mx-auto"
                >
                  <Award className="w-14 h-14 sm:w-16 sm:h-16 text-amber-950" />
                </motion.div>
                <div className="absolute -top-2 -right-2 text-3xl animate-bounce">✨</div>
                <div className="absolute -bottom-1 -left-2 text-3xl animate-pulse">🌟</div>
              </div>

              {/* Victory Titles */}
              <h3 className="text-2xl sm:text-4xl font-black text-white tracking-wide uppercase drop-shadow-md mb-1">
                GREAT JOB!
              </h3>
              <p className="text-base sm:text-xl font-bold text-amber-300 mb-5 max-w-md">
                Your room is clean!
              </p>

              {/* Large, obvious [ REPLAY ] Button */}
              <button
                type="button"
                onClick={handleReplay}
                className="bg-[#F7D060] hover:bg-amber-400 text-amber-950 font-black py-4 px-10 rounded-2xl border-b-6 border-[#CA8A04] shadow-2xl active:border-b-2 active:translate-y-1 transition-all cursor-pointer text-lg sm:text-xl flex items-center gap-2.5 uppercase tracking-wide"
              >
                <RotateCcw className="w-6 h-6 stroke-[3]" />
                <span>REPLAY</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Activity Bottom Navigation Bar */}
      <ActivityBottomNav
        onHome={onNavigateHome}
        onNext={onNavigateNext}
        onPrev={onNavigatePrev}
      />
    </div>
  );
};
