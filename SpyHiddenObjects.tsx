import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, RotateCcw, Home, Sparkles, Star, Check } from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { ActivityBottomNav } from './ActivityBottomNav';

interface SpyHiddenObjectsProps {
  onCollectStar: () => void;
  onNavigateHome?: () => void;
  onNavigateNext?: () => void;
  onNavigatePrev?: () => void;
  isActivityCompleted?: boolean;
}

// Single Scene Object Definition
export interface SceneObjectItem {
  id: string;
  name: string; // e.g. "cap", "red ball", "apple", "blue sock", "spoon"
  speechName: string; // e.g. "cap", "red ball", "apple", "blue sock", "spoon"
  emoji: string;
  colorLabel?: string;
  sizeScale?: number;
  // Plausible natural hiding spots in this scene (overlapping / tucked in)
  spots: {
    spotDesc: string;
    x: number; // percentage from left
    y: number; // percentage from top
    z: number; // zIndex
    scale?: number;
    rotation?: number;
  }[];
}

// Scene Backdrop Theme & Props Definition
export interface SceneTemplate {
  id: string;
  name: string;
  themeGradient: string;
  borderColor: string;
  wallOrSkyGradient: string;
  floorGradient: string;
  decorations: {
    emoji: string;
    x: number;
    y: number;
    size: string;
    z: number;
    opacity?: number;
    flip?: boolean;
  }[];
  objectPool: SceneObjectItem[];
}

// Fisher-Yates shuffle
function fisherYatesShuffle<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = copy[i];
    copy[i] = copy[j];
    copy[j] = temp;
  }
  return copy;
}

// ----------------------------------------------------------------------
// 10 RICH ILLUSTRATED CHILD-FRIENDLY SCENES (Cute, Messy, Distinct)
// ----------------------------------------------------------------------
export const SCENE_TEMPLATES: SceneTemplate[] = [
  // 1. PARK SCENE
  {
    id: 'park',
    name: 'Sunny Park',
    themeGradient: 'from-sky-400 via-emerald-200 to-green-300',
    borderColor: 'border-emerald-500',
    wallOrSkyGradient: 'bg-gradient-to-b from-sky-300 to-sky-100',
    floorGradient: 'bg-gradient-to-t from-emerald-500 via-green-400 to-emerald-300',
    decorations: [
      { emoji: '☀️', x: 82, y: 8, size: 'text-6xl', z: 2 },
      { emoji: '☁️', x: 18, y: 10, size: 'text-5xl', z: 2, opacity: 0.8 },
      { emoji: '🌳', x: 8, y: 26, size: 'text-7xl sm:text-8xl', z: 8 },
      { emoji: '🌳', x: 86, y: 28, size: 'text-7xl sm:text-8xl', z: 8 },
      { emoji: '🛝', x: 74, y: 50, size: 'text-6xl sm:text-7xl', z: 12 },
      { emoji: '🪑', x: 25, y: 64, size: 'text-5xl sm:text-6xl', z: 14 },
      { emoji: '⛲', x: 50, y: 44, size: 'text-5xl sm:text-6xl', z: 10 },
      { emoji: '🌸', x: 64, y: 78, size: 'text-3xl sm:text-4xl', z: 16 },
      { emoji: '🌼', x: 38, y: 82, size: 'text-3xl sm:text-4xl', z: 16 },
    ],
    objectPool: [
      {
        id: 'cap',
        name: 'cap',
        speechName: 'cap',
        emoji: '🧢',
        spots: [
          { spotDesc: 'on the wooden park bench', x: 26, y: 62, z: 18, rotation: -8 },
          { spotDesc: 'hanging from the slide handle', x: 72, y: 48, z: 18, rotation: 12 },
          { spotDesc: 'under the shade of the big tree', x: 14, y: 70, z: 18, rotation: 5 },
          { spotDesc: 'beside the flower bed', x: 60, y: 76, z: 20, rotation: -15 },
        ],
      },
      {
        id: 'apple',
        name: 'apple',
        speechName: 'apple',
        emoji: '🍎',
        spots: [
          { spotDesc: 'in the tree branches', x: 12, y: 28, z: 14 },
          { spotDesc: 'beside the park bench', x: 32, y: 72, z: 20 },
          { spotDesc: 'near the flower bush', x: 66, y: 74, z: 20 },
          { spotDesc: 'by the fountain edge', x: 46, y: 60, z: 16 },
        ],
      },
      {
        id: 'rabbit',
        name: 'rabbit',
        speechName: 'rabbit',
        emoji: '🐰',
        sizeScale: 1.15,
        spots: [
          { spotDesc: 'peeking behind the green bush', x: 62, y: 60, z: 18 },
          { spotDesc: 'beside the tree trunk', x: 18, y: 56, z: 16 },
          { spotDesc: 'under the park bench', x: 24, y: 74, z: 20 },
          { spotDesc: 'by the garden flowers', x: 42, y: 72, z: 18 },
        ],
      },
      {
        id: 'red_ball',
        name: 'red ball',
        speechName: 'red ball',
        emoji: '🔴',
        spots: [
          { spotDesc: 'rolling beside the slide', x: 80, y: 68, z: 18 },
          { spotDesc: 'under the park bench', x: 22, y: 76, z: 20 },
          { spotDesc: 'on the green grass', x: 44, y: 70, z: 18 },
          { spotDesc: 'near the flower patch', x: 58, y: 80, z: 20 },
        ],
      },
      {
        id: 'butterfly',
        name: 'butterfly',
        speechName: 'butterfly',
        emoji: '🦋',
        spots: [
          { spotDesc: 'fluttering over the pink flowers', x: 62, y: 70, z: 22 },
          { spotDesc: 'flying high near the tree', x: 16, y: 22, z: 14 },
          { spotDesc: 'near the park fountain', x: 52, y: 38, z: 14 },
          { spotDesc: 'by the sunny sky', x: 74, y: 20, z: 10 },
        ],
      },
      {
        id: 'kite',
        name: 'kite',
        speechName: 'kite',
        emoji: '🪁',
        sizeScale: 1.2,
        spots: [
          { spotDesc: 'floating in the sunny sky', x: 68, y: 16, z: 8 },
          { spotDesc: 'caught in the tree branches', x: 22, y: 24, z: 14 },
          { spotDesc: 'resting on the grass hill', x: 82, y: 48, z: 16 },
          { spotDesc: 'leaning on the slide ladder', x: 76, y: 56, z: 18 },
        ],
      },
      {
        id: 'squirrel',
        name: 'squirrel',
        speechName: 'squirrel',
        emoji: '🐿️',
        spots: [
          { spotDesc: 'on the high tree branch', x: 10, y: 22, z: 14 },
          { spotDesc: 'near the bench leg', x: 30, y: 74, z: 20 },
          { spotDesc: 'by the fountain water', x: 54, y: 56, z: 16 },
          { spotDesc: 'peeking from behind the slide', x: 84, y: 58, z: 16 },
        ],
      },
      {
        id: 'bird',
        name: 'bird',
        speechName: 'bird',
        emoji: '🐦',
        spots: [
          { spotDesc: 'perched on the park bench', x: 28, y: 58, z: 18 },
          { spotDesc: 'singing in the big tree', x: 14, y: 18, z: 14 },
          { spotDesc: 'splashing near the fountain', x: 48, y: 52, z: 16 },
          { spotDesc: 'flying in the bright sky', x: 38, y: 14, z: 8 },
        ],
      },
      {
        id: 'carrot',
        name: 'carrot',
        speechName: 'carrot',
        emoji: '🥕',
        spots: [
          { spotDesc: 'tucked in the flower grass', x: 64, y: 82, z: 22 },
          { spotDesc: 'beside the rabbit hole', x: 34, y: 76, z: 18 },
          { spotDesc: 'under the bench corner', x: 20, y: 80, z: 20 },
          { spotDesc: 'near the tree roots', x: 16, y: 64, z: 18 },
        ],
      },
    ],
  },

  // 2. BEDROOM SCENE
  {
    id: 'bedroom',
    name: 'Cozy Bedroom',
    themeGradient: 'from-purple-200 via-pink-100 to-indigo-200',
    borderColor: 'border-purple-500',
    wallOrSkyGradient: 'bg-gradient-to-b from-purple-100 to-indigo-50',
    floorGradient: 'bg-gradient-to-t from-pink-200 via-purple-100 to-indigo-100',
    decorations: [
      { emoji: '🪟', x: 20, y: 12, size: 'text-6xl', z: 4 },
      { emoji: '🛏️', x: 74, y: 44, size: 'text-7xl sm:text-8xl', z: 10 },
      { emoji: '🪑', x: 32, y: 58, size: 'text-6xl', z: 14 },
      { emoji: '🗄️', x: 14, y: 42, size: 'text-7xl', z: 8 },
      { emoji: '💡', x: 82, y: 26, size: 'text-4xl sm:text-5xl', z: 12 },
      { emoji: '🖼️', x: 50, y: 14, size: 'text-4xl', z: 4 },
      { emoji: '🧶', x: 48, y: 76, size: 'text-5xl', z: 12 },
    ],
    objectPool: [
      {
        id: 'blue_sock',
        name: 'blue sock',
        speechName: 'blue sock',
        emoji: '🧦',
        spots: [
          { spotDesc: 'partly under the chair', x: 32, y: 72, z: 18, rotation: 15 },
          { spotDesc: 'peeking from under the bed', x: 70, y: 64, z: 16, rotation: -20 },
          { spotDesc: 'beside the cozy rug', x: 44, y: 80, z: 20, rotation: 10 },
          { spotDesc: 'on the bedside nightstand', x: 80, y: 54, z: 18, rotation: -5 },
        ],
      },
      {
        id: 'teddy_bear',
        name: 'teddy bear',
        speechName: 'teddy bear',
        emoji: '🧸',
        sizeScale: 1.15,
        spots: [
          { spotDesc: 'resting on the bed pillow', x: 76, y: 38, z: 16 },
          { spotDesc: 'sitting in the chair', x: 30, y: 52, z: 18 },
          { spotDesc: 'on the middle bookshelf', x: 16, y: 42, z: 14 },
          { spotDesc: 'on the soft round rug', x: 52, y: 78, z: 20 },
        ],
      },
      {
        id: 'shoe',
        name: 'shoe',
        speechName: 'shoe',
        emoji: '👟',
        spots: [
          { spotDesc: 'beside the bed frame', x: 84, y: 68, z: 18 },
          { spotDesc: 'under the wooden chair', x: 36, y: 74, z: 20 },
          { spotDesc: 'by the bookcase edge', x: 22, y: 72, z: 18 },
          { spotDesc: 'on the bedroom floor', x: 56, y: 82, z: 20 },
        ],
      },
      {
        id: 'green_book',
        name: 'green book',
        speechName: 'green book',
        emoji: '📗',
        spots: [
          { spotDesc: 'stacked on the bookcase', x: 15, y: 36, z: 14 },
          { spotDesc: 'on the cozy bed blanket', x: 68, y: 48, z: 16 },
          { spotDesc: 'on the chair seat', x: 34, y: 56, z: 18 },
          { spotDesc: 'open on the bedroom rug', x: 48, y: 74, z: 20 },
        ],
      },
      {
        id: 'clock',
        name: 'clock',
        speechName: 'clock',
        emoji: '⏰',
        spots: [
          { spotDesc: 'on the bedside nightstand', x: 80, y: 40, z: 16 },
          { spotDesc: 'on the top bookshelf', x: 16, y: 24, z: 14 },
          { spotDesc: 'by the sunny window sill', x: 24, y: 22, z: 10 },
          { spotDesc: 'on the study table', x: 40, y: 54, z: 16 },
        ],
      },
      {
        id: 'backpack',
        name: 'backpack',
        speechName: 'backpack',
        emoji: '🎒',
        sizeScale: 1.15,
        spots: [
          { spotDesc: 'hanging on the chair back', x: 28, y: 56, z: 18 },
          { spotDesc: 'resting beside the bed', x: 86, y: 62, z: 18 },
          { spotDesc: 'in the cozy corner', x: 12, y: 72, z: 18 },
          { spotDesc: 'beside the nightstand', x: 74, y: 70, z: 18 },
        ],
      },
      {
        id: 'brush',
        name: 'brush',
        speechName: 'brush',
        emoji: '🪮',
        spots: [
          { spotDesc: 'on the nightstand table', x: 82, y: 50, z: 18 },
          { spotDesc: 'on the study chair', x: 36, y: 58, z: 18 },
          { spotDesc: 'on the bookcase shelf', x: 18, y: 46, z: 14 },
          { spotDesc: 'dropped near the bed', x: 64, y: 70, z: 18 },
        ],
      },
    ],
  },

  // 3. PLAYROOM SCENE
  {
    id: 'playroom',
    name: 'Playful Playroom',
    themeGradient: 'from-amber-200 via-orange-100 to-yellow-200',
    borderColor: 'border-amber-500',
    wallOrSkyGradient: 'bg-gradient-to-b from-yellow-100 to-amber-50',
    floorGradient: 'bg-gradient-to-t from-amber-300 via-yellow-200 to-amber-100',
    decorations: [
      { emoji: '🎪', x: 16, y: 16, size: 'text-6xl', z: 4 },
      { emoji: '🗄️', x: 14, y: 42, size: 'text-7xl', z: 8 },
      { emoji: '📦', x: 78, y: 62, size: 'text-7xl', z: 12 },
      { emoji: '🪵', x: 46, y: 52, size: 'text-6xl', z: 10 },
      { emoji: '🎨', x: 80, y: 18, size: 'text-5xl', z: 4 },
      { emoji: '🧩', x: 38, y: 78, size: 'text-4xl', z: 14 },
    ],
    objectPool: [
      {
        id: 'toy_car',
        name: 'red car',
        speechName: 'red car',
        emoji: '🚗',
        sizeScale: 1.1,
        spots: [
          { spotDesc: 'partly behind the toy box', x: 74, y: 72, z: 18, rotation: 8 },
          { spotDesc: 'zooming under the play table', x: 44, y: 66, z: 18, rotation: -12 },
          { spotDesc: 'on the middle toy shelf', x: 16, y: 42, z: 14, rotation: 0 },
          { spotDesc: 'in the middle of the play rug', x: 50, y: 80, z: 20, rotation: 20 },
        ],
      },
      {
        id: 'blocks',
        name: 'blocks',
        speechName: 'blocks',
        emoji: '🧱',
        spots: [
          { spotDesc: 'stacked near the play table', x: 38, y: 62, z: 16 },
          { spotDesc: 'inside the toy box', x: 80, y: 60, z: 16 },
          { spotDesc: 'on the low toy shelf', x: 14, y: 56, z: 14 },
          { spotDesc: 'scattered on the colorful rug', x: 54, y: 76, z: 18 },
        ],
      },
      {
        id: 'doll',
        name: 'doll',
        speechName: 'doll',
        emoji: '🪆',
        spots: [
          { spotDesc: 'sitting on the top shelf', x: 16, y: 24, z: 14 },
          { spotDesc: 'peeking out of the toy box', x: 84, y: 56, z: 16 },
          { spotDesc: 'beside the play table', x: 40, y: 50, z: 16 },
          { spotDesc: 'on the soft floor cushion', x: 62, y: 76, z: 18 },
        ],
      },
      {
        id: 'crayon',
        name: 'crayon',
        speechName: 'crayon',
        emoji: '🖍️',
        spots: [
          { spotDesc: 'on the wooden play table', x: 48, y: 48, z: 16, rotation: 45 },
          { spotDesc: 'dropped near the toy shelf', x: 22, y: 74, z: 18, rotation: -30 },
          { spotDesc: 'beside the drawing pad', x: 58, y: 74, z: 18, rotation: 15 },
          { spotDesc: 'under the table leg', x: 42, y: 72, z: 18, rotation: 60 },
        ],
      },
      {
        id: 'pencil',
        name: 'pencil',
        speechName: 'pencil',
        emoji: '✏️',
        spots: [
          { spotDesc: 'on the play table', x: 46, y: 52, z: 16, rotation: -40 },
          { spotDesc: 'on the middle shelf', x: 18, y: 38, z: 14, rotation: 10 },
          { spotDesc: 'beside the puzzle box', x: 64, y: 78, z: 18, rotation: 25 },
          { spotDesc: 'near the playroom wall', x: 30, y: 68, z: 16, rotation: -15 },
        ],
      },
      {
        id: 'toy_train',
        name: 'toy train',
        speechName: 'toy train',
        emoji: '🚂',
        sizeScale: 1.15,
        spots: [
          { spotDesc: 'chugging on the floor track', x: 46, y: 78, z: 20 },
          { spotDesc: 'on the middle toy shelf', x: 18, y: 48, z: 14 },
          { spotDesc: 'beside the big toy chest', x: 76, y: 68, z: 18 },
          { spotDesc: 'under the little table', x: 40, y: 68, z: 18 },
        ],
      },
      {
        id: 'star',
        name: 'yellow star',
        speechName: 'yellow star',
        emoji: '⭐',
        spots: [
          { spotDesc: 'stuck on the toy chest lid', x: 80, y: 54, z: 16 },
          { spotDesc: 'on the wall picture frame', x: 74, y: 22, z: 10 },
          { spotDesc: 'on the playroom shelf corner', x: 22, y: 28, z: 14 },
          { spotDesc: 'on the play table top', x: 52, y: 50, z: 16 },
        ],
      },
    ],
  },

  // 4. KITCHEN SCENE
  {
    id: 'kitchen',
    name: 'Cute Kitchen',
    themeGradient: 'from-teal-200 via-emerald-100 to-cyan-200',
    borderColor: 'border-teal-500',
    wallOrSkyGradient: 'bg-gradient-to-b from-teal-100 to-cyan-50',
    floorGradient: 'bg-gradient-to-t from-teal-300 via-teal-150 to-cyan-100',
    decorations: [
      { emoji: '🧊', x: 82, y: 38, size: 'text-7xl', z: 8 }, // fridge
      { emoji: '🪵', x: 42, y: 56, size: 'text-7xl', z: 10 }, // table
      { emoji: '🪑', x: 22, y: 54, size: 'text-6xl', z: 12 }, // chair
      { emoji: '🪟', x: 50, y: 14, size: 'text-5xl', z: 4 }, // window
      { emoji: '🪴', x: 16, y: 34, size: 'text-5xl', z: 6 }, // plant
      { emoji: '🍳', x: 78, y: 22, size: 'text-4xl', z: 6 }, // pan
    ],
    objectPool: [
      {
        id: 'spoon',
        name: 'spoon',
        speechName: 'spoon',
        emoji: '🥄',
        spots: [
          { spotDesc: 'partly beside the kitchen bowl', x: 46, y: 52, z: 18, rotation: 35 },
          { spotDesc: 'on the dining table edge', x: 38, y: 56, z: 18, rotation: -20 },
          { spotDesc: 'under the wooden chair leg', x: 26, y: 74, z: 20, rotation: 45 },
          { spotDesc: 'beside the kitchen counter', x: 68, y: 64, z: 18, rotation: 10 },
        ],
      },
      {
        id: 'blue_cup',
        name: 'blue cup',
        speechName: 'blue cup',
        emoji: '🥛',
        spots: [
          { spotDesc: 'on the kitchen table', x: 44, y: 48, z: 16 },
          { spotDesc: 'beside the fridge door', x: 76, y: 50, z: 16 },
          { spotDesc: 'on the counter shelf', x: 22, y: 36, z: 14 },
          { spotDesc: 'under the table shade', x: 40, y: 70, z: 18 },
        ],
      },
      {
        id: 'banana',
        name: 'banana',
        speechName: 'banana',
        emoji: '🍌',
        spots: [
          { spotDesc: 'in the fruit bowl on the table', x: 48, y: 50, z: 18, rotation: -15 },
          { spotDesc: 'beside the kitchen chair', x: 28, y: 62, z: 18, rotation: 25 },
          { spotDesc: 'on the kitchen counter', x: 70, y: 52, z: 16, rotation: 10 },
          { spotDesc: 'dropped by the table leg', x: 36, y: 76, z: 20, rotation: -30 },
        ],
      },
      {
        id: 'plate',
        name: 'plate',
        speechName: 'plate',
        emoji: '🍽️',
        spots: [
          { spotDesc: 'set in middle of kitchen table', x: 42, y: 52, z: 16 },
          { spotDesc: 'on the low kitchen shelf', x: 18, y: 42, z: 14 },
          { spotDesc: 'beside the kitchen fridge', x: 74, y: 60, z: 16 },
          { spotDesc: 'on the dining tray', x: 56, y: 58, z: 16 },
        ],
      },
      {
        id: 'bottle',
        name: 'bottle',
        speechName: 'bottle',
        emoji: '🍼',
        spots: [
          { spotDesc: 'on the kitchen table', x: 50, y: 46, z: 16 },
          { spotDesc: 'beside the fridge', x: 80, y: 56, z: 16 },
          { spotDesc: 'on the kitchen chair', x: 24, y: 56, z: 18 },
          { spotDesc: 'under the kitchen counter', x: 66, y: 72, z: 18 },
        ],
      },
      {
        id: 'cat',
        name: 'cat',
        speechName: 'cat',
        emoji: '🐱',
        sizeScale: 1.1,
        spots: [
          { spotDesc: 'napping under the kitchen chair', x: 24, y: 70, z: 20 },
          { spotDesc: 'peeking beside the fridge', x: 74, y: 68, z: 18 },
          { spotDesc: 'sitting by the warm table', x: 54, y: 68, z: 18 },
          { spotDesc: 'watching near the kitchen door', x: 14, y: 66, z: 18 },
        ],
      },
    ],
  },

  // 5. GARDEN SCENE
  {
    id: 'garden',
    name: 'Sunny Garden',
    themeGradient: 'from-lime-300 via-emerald-100 to-green-300',
    borderColor: 'border-lime-500',
    wallOrSkyGradient: 'bg-gradient-to-b from-sky-200 to-lime-100',
    floorGradient: 'bg-gradient-to-t from-emerald-500 via-green-400 to-lime-200',
    decorations: [
      { emoji: '☀️', x: 78, y: 8, size: 'text-6xl', z: 2 },
      { emoji: '🪴', x: 14, y: 54, size: 'text-6xl', z: 10 },
      { emoji: '🌻', x: 82, y: 46, size: 'text-7xl', z: 12 },
      { emoji: '🪵', x: 48, y: 40, size: 'text-6xl', z: 6 }, // fence
      { emoji: '🌷', x: 30, y: 72, size: 'text-4xl', z: 14 },
      { emoji: '🌸', x: 68, y: 74, size: 'text-4xl', z: 14 },
    ],
    objectPool: [
      {
        id: 'flower',
        name: 'pink flower',
        speechName: 'pink flower',
        emoji: '🌸',
        spots: [
          { spotDesc: 'blooming in the garden patch', x: 64, y: 76, z: 20 },
          { spotDesc: 'beside the wooden garden fence', x: 42, y: 52, z: 16 },
          { spotDesc: 'near the big clay pot', x: 22, y: 68, z: 18 },
          { spotDesc: 'by the tall sunflowers', x: 76, y: 64, z: 18 },
        ],
      },
      {
        id: 'butterfly',
        name: 'butterfly',
        speechName: 'butterfly',
        emoji: '🦋',
        spots: [
          { spotDesc: 'fluttering over the sunflowers', x: 74, y: 36, z: 16 },
          { spotDesc: 'in the bright sunny sky', x: 45, y: 16, z: 8 },
          { spotDesc: 'near the flower pot leaves', x: 18, y: 44, z: 14 },
          { spotDesc: 'hovering near the garden fence', x: 52, y: 42, z: 14 },
        ],
      },
      {
        id: 'watering_can',
        name: 'watering can',
        speechName: 'watering can',
        emoji: '🪴',
        spots: [
          { spotDesc: 'beside the flower pots', x: 22, y: 64, z: 18 },
          { spotDesc: 'near the garden gate', x: 50, y: 60, z: 16 },
          { spotDesc: 'under the tall sunflowers', x: 80, y: 68, z: 18 },
          { spotDesc: 'in the green grass walkway', x: 38, y: 74, z: 20 },
        ],
      },
      {
        id: 'carrot',
        name: 'carrot',
        speechName: 'carrot',
        emoji: '🥕',
        spots: [
          { spotDesc: 'sprouting in the soil patch', x: 58, y: 78, z: 20 },
          { spotDesc: 'beside the garden fence', x: 46, y: 54, z: 16 },
          { spotDesc: 'near the flower pot base', x: 16, y: 72, z: 18 },
          { spotDesc: 'tucked behind green leaves', x: 34, y: 68, z: 18 },
        ],
      },
      {
        id: 'leaf',
        name: 'green leaf',
        speechName: 'green leaf',
        emoji: '🍃',
        spots: [
          { spotDesc: 'floating on the garden grass', x: 42, y: 72, z: 18, rotation: 25 },
          { spotDesc: 'beside the flower bed', x: 68, y: 80, z: 20, rotation: -15 },
          { spotDesc: 'under the big plant pot', x: 20, y: 76, z: 20, rotation: 40 },
          { spotDesc: 'on the garden fence post', x: 54, y: 38, z: 14, rotation: -10 },
        ],
      },
      {
        id: 'ladybug',
        name: 'ladybug',
        speechName: 'ladybug',
        emoji: '🐞',
        spots: [
          { spotDesc: 'resting on a green flower leaf', x: 66, y: 68, z: 20 },
          { spotDesc: 'on the wooden garden fence', x: 48, y: 46, z: 16 },
          { spotDesc: 'beside the clay plant pot', x: 18, y: 58, z: 16 },
          { spotDesc: 'on the sunflower stalk', x: 84, y: 58, z: 16 },
        ],
      },
    ],
  },

  // 6. BEACH SCENE
  {
    id: 'beach',
    name: 'Tropical Beach',
    themeGradient: 'from-sky-300 via-cyan-100 to-amber-200',
    borderColor: 'border-sky-500',
    wallOrSkyGradient: 'bg-gradient-to-b from-sky-300 to-cyan-100',
    floorGradient: 'bg-gradient-to-t from-amber-300 via-amber-200 to-cyan-200',
    decorations: [
      { emoji: '☀️', x: 80, y: 10, size: 'text-6xl', z: 2 },
      { emoji: '🌴', x: 14, y: 28, size: 'text-7xl sm:text-8xl', z: 8 },
      { emoji: '⛱️', x: 44, y: 48, size: 'text-7xl', z: 12 },
      { emoji: '🌊', x: 68, y: 22, size: 'text-6xl', z: 4 },
      { emoji: '🏰', x: 74, y: 64, size: 'text-6xl', z: 14 },
      { emoji: '🧣', x: 38, y: 72, size: 'text-5xl', z: 10 }, // towel
    ],
    objectPool: [
      {
        id: 'shell',
        name: 'shell',
        speechName: 'shell',
        emoji: '🐚',
        spots: [
          { spotDesc: 'in the warm golden sand', x: 80, y: 78, z: 20 },
          { spotDesc: 'beside the big sandcastle', x: 68, y: 72, z: 18 },
          { spotDesc: 'tucked near the beach towel', x: 42, y: 76, z: 18 },
          { spotDesc: 'under the palm tree shade', x: 20, y: 70, z: 18 },
        ],
      },
      {
        id: 'bucket',
        name: 'yellow bucket',
        speechName: 'yellow bucket',
        emoji: '🪣',
        spots: [
          { spotDesc: 'beside the sandcastle', x: 66, y: 68, z: 18 },
          { spotDesc: 'on the striped beach towel', x: 44, y: 70, z: 18 },
          { spotDesc: 'under the beach umbrella', x: 40, y: 56, z: 16 },
          { spotDesc: 'near the shoreline water', x: 28, y: 74, z: 18 },
        ],
      },
      {
        id: 'crab',
        name: 'crab',
        speechName: 'crab',
        emoji: '🦀',
        sizeScale: 1.15,
        spots: [
          { spotDesc: 'scuttling near the sandcastle', x: 76, y: 72, z: 20 },
          { spotDesc: 'under the shade umbrella', x: 48, y: 60, z: 16 },
          { spotDesc: 'near the palm tree roots', x: 18, y: 64, z: 18 },
          { spotDesc: 'by the beach towel corner', x: 34, y: 76, z: 20 },
        ],
      },
      {
        id: 'hat',
        name: 'yellow hat',
        speechName: 'yellow hat',
        emoji: '👒',
        spots: [
          { spotDesc: 'resting on the beach towel', x: 40, y: 70, z: 18 },
          { spotDesc: 'hanging on the umbrella pole', x: 46, y: 46, z: 16 },
          { spotDesc: 'beside the sandcastle', x: 70, y: 74, z: 18 },
          { spotDesc: 'under the cool palm tree', x: 16, y: 58, z: 16 },
        ],
      },
      {
        id: 'fish',
        name: 'fish',
        speechName: 'fish',
        emoji: '🐟',
        spots: [
          { spotDesc: 'splashing in the blue sea', x: 66, y: 24, z: 10 },
          { spotDesc: 'near the distant sea waves', x: 54, y: 28, z: 10 },
          { spotDesc: 'swimming near the sand bar', x: 82, y: 34, z: 10 },
          { spotDesc: 'by the shallow shoreline', x: 30, y: 42, z: 12 },
        ],
      },
      {
        id: 'umbrella',
        name: 'umbrella',
        speechName: 'umbrella',
        emoji: '⛱️',
        sizeScale: 1.2,
        spots: [
          { spotDesc: 'standing proudly on the beach', x: 44, y: 48, z: 16 },
          { spotDesc: 'near the sandcastle', x: 62, y: 52, z: 16 },
          { spotDesc: 'by the palm tree', x: 26, y: 50, z: 16 },
          { spotDesc: 'on the golden sand dune', x: 52, y: 44, z: 16 },
        ],
      },
    ],
  },

  // 7. PICNIC SCENE
  {
    id: 'picnic',
    name: 'Sunny Picnic',
    themeGradient: 'from-amber-200 via-rose-100 to-emerald-200',
    borderColor: 'border-rose-400',
    wallOrSkyGradient: 'bg-gradient-to-b from-sky-200 to-rose-50',
    floorGradient: 'bg-gradient-to-t from-emerald-400 via-green-300 to-lime-200',
    decorations: [
      { emoji: '🌳', x: 12, y: 24, size: 'text-7xl sm:text-8xl', z: 8 },
      { emoji: '🧺', x: 48, y: 64, size: 'text-7xl', z: 14 },
      { emoji: '🧣', x: 48, y: 72, size: 'text-6xl sm:text-7xl', z: 10 }, // blanket
      { emoji: '🌸', x: 78, y: 68, size: 'text-5xl', z: 12 },
      { emoji: '☀️', x: 80, y: 12, size: 'text-5xl', z: 2 },
    ],
    objectPool: [
      {
        id: 'picnic_basket',
        name: 'basket',
        speechName: 'basket',
        emoji: '🧺',
        sizeScale: 1.15,
        spots: [
          { spotDesc: 'in the middle of picnic blanket', x: 48, y: 64, z: 18 },
          { spotDesc: 'under the shade of the tree', x: 20, y: 60, z: 16 },
          { spotDesc: 'beside the flower patch', x: 72, y: 66, z: 18 },
          { spotDesc: 'on the green grass edge', x: 34, y: 72, z: 18 },
        ],
      },
      {
        id: 'apple',
        name: 'apple',
        speechName: 'apple',
        emoji: '🍎',
        spots: [
          { spotDesc: 'resting on the picnic blanket', x: 54, y: 72, z: 20 },
          { spotDesc: 'beside the picnic basket', x: 42, y: 66, z: 20 },
          { spotDesc: 'under the leafy tree', x: 16, y: 56, z: 16 },
          { spotDesc: 'near the flower bush', x: 76, y: 74, z: 20 },
        ],
      },
      {
        id: 'banana',
        name: 'banana',
        speechName: 'banana',
        emoji: '🍌',
        spots: [
          { spotDesc: 'on the picnic plate', x: 44, y: 74, z: 20, rotation: 20 },
          { spotDesc: 'peeking out of the basket', x: 50, y: 62, z: 20, rotation: -15 },
          { spotDesc: 'on the grass lawn', x: 32, y: 76, z: 18, rotation: 35 },
          { spotDesc: 'beside the flowers', x: 82, y: 72, z: 20, rotation: -25 },
        ],
      },
      {
        id: 'cup',
        name: 'cup',
        speechName: 'cup',
        emoji: '🥤',
        spots: [
          { spotDesc: 'on the picnic blanket', x: 58, y: 70, z: 20 },
          { spotDesc: 'beside the picnic basket', x: 40, y: 64, z: 18 },
          { spotDesc: 'under the shade tree', x: 22, y: 68, z: 18 },
          { spotDesc: 'on the wooden bench', x: 68, y: 58, z: 16 },
        ],
      },
      {
        id: 'book',
        name: 'book',
        speechName: 'book',
        emoji: '📖',
        spots: [
          { spotDesc: 'open on the picnic blanket', x: 42, y: 76, z: 20 },
          { spotDesc: 'under the shady tree', x: 18, y: 64, z: 18 },
          { spotDesc: 'beside the picnic basket', x: 56, y: 66, z: 18 },
          { spotDesc: 'resting on the grass', x: 68, y: 76, z: 20 },
        ],
      },
    ],
  },

  // 8. CLASSROOM / ART ROOM SCENE
  {
    id: 'classroom',
    name: 'Art Classroom',
    themeGradient: 'from-blue-200 via-indigo-100 to-amber-100',
    borderColor: 'border-blue-500',
    wallOrSkyGradient: 'bg-gradient-to-b from-blue-100 to-indigo-50',
    floorGradient: 'bg-gradient-to-t from-amber-200 via-yellow-100 to-amber-50',
    decorations: [
      { emoji: '🏫', x: 48, y: 16, size: 'text-6xl', z: 4 }, // board
      { emoji: '🪵', x: 50, y: 54, size: 'text-7xl', z: 10 }, // big table
      { emoji: '🪑', x: 24, y: 52, size: 'text-6xl', z: 12 },
      { emoji: '🪑', x: 76, y: 52, size: 'text-6xl', z: 12 },
      { emoji: '🎨', x: 18, y: 32, size: 'text-6xl', z: 8 }, // easel
      { emoji: '📚', x: 80, y: 32, size: 'text-5xl', z: 8 },
    ],
    objectPool: [
      {
        id: 'pencil',
        name: 'pencil',
        speechName: 'pencil',
        emoji: '✏️',
        spots: [
          { spotDesc: 'on the classroom desk', x: 46, y: 50, z: 18, rotation: 30 },
          { spotDesc: 'by the easel drawing pad', x: 22, y: 40, z: 16, rotation: -20 },
          { spotDesc: 'dropped near student chair', x: 28, y: 72, z: 20, rotation: 45 },
          { spotDesc: 'beside the book stack', x: 74, y: 54, z: 18, rotation: -10 },
        ],
      },
      {
        id: 'crayon',
        name: 'crayon',
        speechName: 'crayon',
        emoji: '🖍️',
        spots: [
          { spotDesc: 'on the big art desk', x: 54, y: 48, z: 18, rotation: -35 },
          { spotDesc: 'on the student chair seat', x: 24, y: 54, z: 18, rotation: 15 },
          { spotDesc: 'beside the easel paint tray', x: 16, y: 44, z: 16, rotation: 50 },
          { spotDesc: 'on the classroom floor', x: 44, y: 76, z: 20, rotation: -15 },
        ],
      },
      {
        id: 'book',
        name: 'book',
        speechName: 'book',
        emoji: '📚',
        spots: [
          { spotDesc: 'stacked on the side desk', x: 78, y: 48, z: 16 },
          { spotDesc: 'in the middle of art table', x: 48, y: 52, z: 18 },
          { spotDesc: 'under the classroom chair', x: 26, y: 70, z: 20 },
          { spotDesc: 'on the teacher shelf', x: 52, y: 32, z: 12 },
        ],
      },
      {
        id: 'backpack',
        name: 'backpack',
        speechName: 'backpack',
        emoji: '🎒',
        sizeScale: 1.15,
        spots: [
          { spotDesc: 'hanging on the student chair', x: 22, y: 56, z: 18 },
          { spotDesc: 'beside the classroom door', x: 84, y: 64, z: 18 },
          { spotDesc: 'under the big desk', x: 48, y: 68, z: 18 },
          { spotDesc: 'by the easel stand', x: 14, y: 62, z: 16 },
        ],
      },
      {
        id: 'star',
        name: 'gold star',
        speechName: 'gold star',
        emoji: '⭐',
        spots: [
          { spotDesc: 'on the blackboard banner', x: 48, y: 22, z: 12 },
          { spotDesc: 'on the student drawing paper', x: 20, y: 34, z: 14 },
          { spotDesc: 'on the classroom desk corner', x: 56, y: 50, z: 18 },
          { spotDesc: 'on the classroom wall', x: 76, y: 20, z: 8 },
        ],
      },
    ],
  },

  // 9. BACKYARD SCENE
  {
    id: 'backyard',
    name: 'Fun Backyard',
    themeGradient: 'from-emerald-300 via-green-100 to-amber-200',
    borderColor: 'border-emerald-600',
    wallOrSkyGradient: 'bg-gradient-to-b from-sky-200 to-green-100',
    floorGradient: 'bg-gradient-to-t from-emerald-500 via-green-400 to-lime-200',
    decorations: [
      { emoji: '🏡', x: 80, y: 24, size: 'text-7xl', z: 6 },
      { emoji: '🌳', x: 14, y: 26, size: 'text-7xl sm:text-8xl', z: 8 },
      { emoji: '🪵', x: 48, y: 42, size: 'text-6xl', z: 6 }, // fence
      { emoji: '🐶', x: 74, y: 62, size: 'text-6xl', z: 14 },
      { emoji: '🌸', x: 28, y: 74, size: 'text-4xl', z: 14 },
    ],
    objectPool: [
      {
        id: 'ball',
        name: 'ball',
        speechName: 'ball',
        emoji: '⚽',
        spots: [
          { spotDesc: 'rolling near the doghouse', x: 68, y: 70, z: 18 },
          { spotDesc: 'under the shady backyard tree', x: 20, y: 64, z: 18 },
          { spotDesc: 'beside the backyard fence', x: 44, y: 58, z: 16 },
          { spotDesc: 'in the middle of green lawn', x: 48, y: 76, z: 20 },
        ],
      },
      {
        id: 'rabbit',
        name: 'rabbit',
        speechName: 'rabbit',
        emoji: '🐰',
        sizeScale: 1.15,
        spots: [
          { spotDesc: 'peeking from behind the tree', x: 18, y: 52, z: 16 },
          { spotDesc: 'beside the flower patch', x: 32, y: 72, z: 18 },
          { spotDesc: 'near the backyard fence', x: 52, y: 54, z: 16 },
          { spotDesc: 'hopping on the green grass', x: 42, y: 70, z: 18 },
        ],
      },
      {
        id: 'cap',
        name: 'cap',
        speechName: 'cap',
        emoji: '🧢',
        spots: [
          { spotDesc: 'on the wooden fence post', x: 46, y: 44, z: 16, rotation: 12 },
          { spotDesc: 'under the shade tree', x: 16, y: 62, z: 18, rotation: -15 },
          { spotDesc: 'beside the doghouse roof', x: 76, y: 54, z: 16, rotation: 8 },
          { spotDesc: 'dropped on the lawn', x: 38, y: 76, z: 20, rotation: 20 },
        ],
      },
      {
        id: 'watering_can',
        name: 'watering can',
        speechName: 'watering can',
        emoji: '🪴',
        spots: [
          { spotDesc: 'beside the flower bed', x: 26, y: 70, z: 18 },
          { spotDesc: 'near the doghouse', x: 82, y: 68, z: 18 },
          { spotDesc: 'by the backyard fence', x: 54, y: 56, z: 16 },
          { spotDesc: 'under the big tree', x: 14, y: 68, z: 18 },
        ],
      },
    ],
  },

  // 10. LIVING ROOM SCENE
  {
    id: 'living_room',
    name: 'Cozy Living Room',
    themeGradient: 'from-amber-100 via-orange-50 to-stone-200',
    borderColor: 'border-amber-600',
    wallOrSkyGradient: 'bg-gradient-to-b from-amber-50 to-stone-100',
    floorGradient: 'bg-gradient-to-t from-amber-300 via-amber-200 to-stone-200',
    decorations: [
      { emoji: '🛋️', x: 50, y: 46, size: 'text-7xl sm:text-8xl', z: 10 },
      { emoji: '🪴', x: 16, y: 38, size: 'text-6xl', z: 8 },
      { emoji: '🪵', x: 50, y: 68, size: 'text-7xl', z: 14 }, // coffee table
      { emoji: '💡', x: 82, y: 30, size: 'text-5xl', z: 8 },
      { emoji: '🖼️', x: 50, y: 14, size: 'text-5xl', z: 4 },
      { emoji: '🧶', x: 50, y: 80, size: 'text-6xl', z: 6 }, // rug
    ],
    objectPool: [
      {
        id: 'shoe',
        name: 'shoe',
        speechName: 'shoe',
        emoji: '👟',
        spots: [
          { spotDesc: 'partly under the sofa', x: 38, y: 60, z: 16, rotation: 18 },
          { spotDesc: 'beside the coffee table', x: 62, y: 72, z: 18, rotation: -22 },
          { spotDesc: 'near the house plant pot', x: 20, y: 70, z: 18, rotation: 10 },
          { spotDesc: 'on the living room rug', x: 44, y: 82, z: 20, rotation: -10 },
        ],
      },
      {
        id: 'cat',
        name: 'cat',
        speechName: 'cat',
        emoji: '🐱',
        sizeScale: 1.1,
        spots: [
          { spotDesc: 'sleeping on the sofa cushion', x: 54, y: 42, z: 16 },
          { spotDesc: 'under the coffee table', x: 48, y: 70, z: 18 },
          { spotDesc: 'by the tall plant pot', x: 22, y: 56, z: 16 },
          { spotDesc: 'curled up on the soft rug', x: 64, y: 78, z: 20 },
        ],
      },
      {
        id: 'cup',
        name: 'blue cup',
        speechName: 'blue cup',
        emoji: '🥛',
        spots: [
          { spotDesc: 'on the wooden coffee table', x: 48, y: 64, z: 18 },
          { spotDesc: 'beside the sofa armrest', x: 32, y: 50, z: 16 },
          { spotDesc: 'on the side lamp stand', x: 80, y: 48, z: 16 },
          { spotDesc: 'under the table shade', x: 42, y: 76, z: 20 },
        ],
      },
      {
        id: 'clock',
        name: 'clock',
        speechName: 'clock',
        emoji: '⏰',
        spots: [
          { spotDesc: 'on the mantel wall shelf', x: 50, y: 22, z: 10 },
          { spotDesc: 'on the side table', x: 82, y: 46, z: 16 },
          { spotDesc: 'beside the house plant', x: 18, y: 42, z: 14 },
          { spotDesc: 'on the coffee table', x: 54, y: 66, z: 18 },
        ],
      },
      {
        id: 'book',
        name: 'green book',
        speechName: 'green book',
        emoji: '📗',
        spots: [
          { spotDesc: 'resting on the sofa arm', x: 66, y: 48, z: 16 },
          { spotDesc: 'on the coffee table', x: 44, y: 66, z: 18 },
          { spotDesc: 'beside the soft floor rug', x: 34, y: 78, z: 20 },
          { spotDesc: 'under the sofa edge', x: 40, y: 58, z: 16 },
        ],
      },
    ],
  },
];

const SCREENS_PER_PLAYTHROUGH = 8;

// Placed Object in current scene challenge
export interface ActivePlacedItem {
  uid: string;
  obj: SceneObjectItem;
  isTarget: boolean;
  xPercent: number;
  yPercent: number;
  scale: number;
  rotation: number;
  zIndex: number;
  spotDesc: string;
}

// Single challenge round data
export interface ChallengeRoundData {
  scene: SceneTemplate;
  targetItem: SceneObjectItem;
  placedItems: ActivePlacedItem[];
}

// Pure function to generate a full playthrough set of screens with guaranteed anti-repetition
export const generatePlaythroughScreens = (
  playthroughNum: number,
  lastTargetSpeechNames: string[] = []
): ChallengeRoundData[] => {
  // 1. Shuffle scene templates thoroughly
  const shuffledScenes = fisherYatesShuffle(SCENE_TEMPLATES);
  const selectedScenes = shuffledScenes.slice(0, SCREENS_PER_PLAYTHROUGH);

  const rounds: ChallengeRoundData[] = [];
  const usedTargetSpeechInThisPlaythrough = new Set<string>();

  selectedScenes.forEach((scene, screenIdx) => {
    const fullPool = scene.objectPool;

    // Filter target candidates: prioritize items not used in immediate last playthrough AND not used in this run yet
    let candidateTargets = fullPool.filter(
      (item) =>
        !lastTargetSpeechNames.includes(item.speechName) &&
        !usedTargetSpeechInThisPlaythrough.has(item.speechName)
    );

    // Fallback if strictly filtered out
    if (candidateTargets.length === 0) {
      candidateTargets = fullPool.filter(
        (item) => !usedTargetSpeechInThisPlaythrough.has(item.speechName)
      );
    }
    if (candidateTargets.length === 0) {
      candidateTargets = fullPool;
    }

    const target = fisherYatesShuffle(candidateTargets)[0];
    usedTargetSpeechInThisPlaythrough.add(target.speechName);

    // Pick 5-7 distractor items from remaining pool
    const distractorCandidates = fullPool.filter((item) => item.id !== target.id);
    const chosenDistractors = fisherYatesShuffle(distractorCandidates).slice(0, 6);

    const occupiedCoords: { x: number; y: number }[] = [];

    const pickSpot = (spots: SceneObjectItem['spots']) => {
      const shuffledSpots = fisherYatesShuffle(spots);
      for (const sp of shuffledSpots) {
        const tooClose = occupiedCoords.some(
          (occ) => Math.hypot(occ.x - sp.x, occ.y - sp.y) < 10
        );
        if (!tooClose) {
          occupiedCoords.push({ x: sp.x, y: sp.y });
          return sp;
        }
      }
      const fallback = shuffledSpots[0];
      occupiedCoords.push({ x: fallback.x, y: fallback.y });
      return fallback;
    };

    const placedItems: ActivePlacedItem[] = [];

    // Place Target
    const targetSpot = pickSpot(target.spots);
    const tJitterX = (Math.random() - 0.5) * 3;
    const tJitterY = (Math.random() - 0.5) * 3;
    placedItems.push({
      uid: `target_${target.id}_screen${screenIdx}_round${playthroughNum}_${Date.now()}`,
      obj: target,
      isTarget: true,
      xPercent: Math.max(10, Math.min(88, targetSpot.x + tJitterX)),
      yPercent: Math.max(16, Math.min(84, targetSpot.y + tJitterY)),
      scale: (target.sizeScale || 1.0) * (targetSpot.scale || 1.0),
      rotation: targetSpot.rotation || (Math.random() - 0.5) * 16,
      zIndex: targetSpot.z + 4,
      spotDesc: targetSpot.spotDesc,
    });

    // Place Distractors
    chosenDistractors.forEach((dist, dIdx) => {
      const dSpot = pickSpot(dist.spots);
      const dJitterX = (Math.random() - 0.5) * 4;
      const dJitterY = (Math.random() - 0.5) * 4;
      placedItems.push({
        uid: `dist_${dist.id}_screen${screenIdx}_d${dIdx}_round${playthroughNum}_${Date.now()}`,
        obj: dist,
        isTarget: false,
        xPercent: Math.max(8, Math.min(90, dSpot.x + dJitterX)),
        yPercent: Math.max(14, Math.min(86, dSpot.y + dJitterY)),
        scale: (dist.sizeScale || 0.95) * (dSpot.scale || 1.0),
        rotation: dSpot.rotation || (Math.random() - 0.5) * 20,
        zIndex: dSpot.z,
        spotDesc: dSpot.spotDesc,
      });
    });

    rounds.push({
      scene,
      targetItem: target,
      placedItems: fisherYatesShuffle(placedItems),
    });
  });

  return rounds;
};

export const SpyHiddenObjects: React.FC<SpyHiddenObjectsProps> = ({
  onCollectStar,
  onNavigateHome,
  onNavigateNext,
  onNavigatePrev,
  isActivityCompleted,
}) => {
  // Playthrough count & History for strict anti-repetition on Replay
  const [playthrough, setPlaythrough] = useState<number>(1);
  const playthroughRef = useRef<number>(1);
  playthroughRef.current = playthrough;

  const prevTargetNamesRef = useRef<string[]>([]);

  // Array of 8-10 complete challenge screens for current playthrough
  const [screens, setScreens] = useState<ChallengeRoundData[]>([]);
  const [currentScreenIdx, setCurrentScreenIdx] = useState<number>(0);

  // Tap Feedback states
  const [wobbleUid, setWobbleUid] = useState<string | null>(null);
  const [celebratingUid, setCelebratingUid] = useState<string | null>(null);
  const [isRoundAdvancing, setIsRoundAdvancing] = useState<boolean>(false);
  const [isHuntComplete, setIsHuntComplete] = useState<boolean>(false);

  // Active Screen Data
  const currentRound = screens[currentScreenIdx];
  const currentTarget = currentRound?.targetItem;
  const currentScene = currentRound?.scene;

  // Helper to start a fresh playthrough
  const startPlaythrough = useCallback((roundNum: number) => {
    const lastTargets = prevTargetNamesRef.current;
    const generated = generatePlaythroughScreens(roundNum, lastTargets);

    // Save target names to prevent immediate duplicates in the next replay
    prevTargetNamesRef.current = generated.map((r) => r.targetItem.speechName);

    setScreens(generated);
    setCurrentScreenIdx(0);
    setIsHuntComplete(false);
    setIsRoundAdvancing(false);
    setWobbleUid(null);
    setCelebratingUid(null);

    // Speak initial target instruction immediately without any location intro!
    const firstTarget = generated[0]?.targetItem;
    if (firstTarget) {
      setTimeout(() => {
        soundManager.speak(`Find the ${firstTarget.speechName}.`);
      }, 350);
    }
  }, []);

  // Initial load
  useEffect(() => {
    startPlaythrough(1);
  }, [startPlaythrough]);

  // When screen index changes, speak direct prompt immediately: "Find the [object]."
  useEffect(() => {
    if (currentScreenIdx > 0 && currentTarget && !isHuntComplete) {
      soundManager.speak(`Find the ${currentTarget.speechName}.`);
    }
  }, [currentScreenIdx, currentTarget, isHuntComplete]);

  // Repeat speech on tapping speaker button
  const handleRepeatClue = () => {
    if (currentTarget) {
      soundManager.speak(`Find the ${currentTarget.speechName}.`);
    }
  };

  // Handle Child Tapping an Item in the Scene
  const handleItemTap = (item: ActivePlacedItem) => {
    if (celebratingUid || isRoundAdvancing || isHuntComplete) return;

    if (item.isTarget && currentTarget && item.obj.id === currentTarget.id) {
      // -------------------------------------------------------------
      // CORRECT TARGET FOUND!
      // -------------------------------------------------------------
      setIsRoundAdvancing(true);
      setCelebratingUid(item.uid);
      soundManager.playSuccess();
      soundManager.playStarCatch();

      // Voice praise: "Great job!"
      soundManager.speak('Great job!');

      // Smoothly advance to NEXT SCREEN (NO NEXT BUTTON!)
      setTimeout(() => {
        setCelebratingUid(null);
        setIsRoundAdvancing(false);

        if (currentScreenIdx + 1 < screens.length) {
          // Next screen
          setCurrentScreenIdx((prev) => prev + 1);
        } else {
          // All 8–10 screens complete!
          setIsHuntComplete(true);
          onCollectStar();
          soundManager.playCelebration();
          soundManager.playStarCatch();
          soundManager.speak('Wow! Great job! You found everything!');
        }
      }, 1100);
    } else {
      // -------------------------------------------------------------
      // WRONG OBJECT TAPPED (Gentle hint, no penalty, keeps looking)
      // -------------------------------------------------------------
      soundManager.playPop();
      setWobbleUid(item.uid);

      const gentleHints = ['Not that one. Keep looking!', 'Look carefully!'];
      const randomHint = gentleHints[Math.floor(Math.random() * gentleHints.length)];
      soundManager.speak(randomHint);

      setTimeout(() => setWobbleUid(null), 500);
    }
  };

  // Step-by-step previous navigation handler
  const handleInternalPrev = () => {
    soundManager.playPop();
    if (isHuntComplete) {
      setIsHuntComplete(false);
      setCurrentScreenIdx(screens.length - 1);
      setCelebratingUid(null);
      setWobbleUid(null);
    } else if (currentScreenIdx > 0) {
      setCurrentScreenIdx((prev) => prev - 1);
      setCelebratingUid(null);
      setWobbleUid(null);
    } else {
      if (onNavigatePrev) {
        onNavigatePrev();
      }
    }
  };

  // Replay Functionality (Generates a brand new set of screens, targets, and spots)
  const handleReplay = () => {
    soundManager.playPop();
    const nextRound = playthroughRef.current + 1;
    playthroughRef.current = nextRound;
    setPlaythrough(nextRound);
    startPlaythrough(nextRound);
  };

  if (!currentRound || !currentScene || !currentTarget) {
    return (
      <div className="w-full max-w-5xl mx-auto min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-400 border-t-transparent" />
      </div>
    );
  }

  return (
    <div
      id="spy-hidden-objects-activity"
      className="w-full max-w-5xl mx-auto flex flex-col gap-3 pb-6 select-none"
    >
      {/* 1. TOP BAR — SIMPLE, FAST & CLEAN (LOOK 👀 -> SEARCH 🔍 -> FIND 🎯) */}
      <div
        className={`w-full bg-gradient-to-r from-teal-600 via-teal-500 to-cyan-600 rounded-3xl p-3 sm:p-4 shadow-lg border-4 border-teal-700 text-white flex items-center justify-between gap-3`}
      >
        {/* Home Button */}
        <button
          id="spy-home-btn"
          onClick={onNavigateHome}
          aria-label="Back to Home"
          className="bg-black/25 hover:bg-black/40 active:scale-95 text-white px-3.5 py-2 rounded-2xl border-2 border-white/30 shadow-sm transition-transform flex items-center gap-1.5 font-black text-sm cursor-pointer shrink-0"
        >
          <Home className="w-5 h-5 text-amber-200" />
          <span className="hidden sm:inline">Home</span>
        </button>

        {/* Big Clear Target Instruction: "🔍 FIND THE CAP" */}
        <div className="flex items-center gap-2 sm:gap-3 justify-center text-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl shadow-inner border border-white/40 shrink-0">
            {currentTarget.emoji}
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-2xl md:text-3xl font-black tracking-wider text-white uppercase drop-shadow-sm leading-tight">
                FIND THE {currentTarget.name}
              </h1>
              <button
                id="spy-hear-voice-btn"
                onClick={handleRepeatClue}
                aria-label="Hear Prompt"
                className="bg-amber-300 hover:bg-amber-200 active:scale-90 text-amber-950 p-1.5 sm:p-2 rounded-xl border border-white shadow-sm transition-transform cursor-pointer"
                title="Hear clue"
              >
                <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-amber-950" />
              </button>
            </div>
          </div>
        </div>

        {/* Clean Screen Progress Pill: e.g. "3 / 8" */}
        <div className="bg-black/30 px-3.5 py-1.5 rounded-2xl border border-white/30 text-white font-black text-xs sm:text-sm flex items-center gap-1.5 shrink-0">
          <span className="text-amber-300">★</span>
          <span>
            {currentScreenIdx + 1} / {screens.length}
          </span>
        </div>
      </div>

      {!isHuntComplete ? (
        <>
          {/* 2. FULL-SCREEN ILLUSTRATED SCENE (Cute, Messy, Distinct Scene every screen) */}
          <div
            id="spy-scene-viewport"
            className={`relative w-full bg-gradient-to-b ${currentScene.themeGradient} rounded-3xl border-4 ${currentScene.borderColor} shadow-xl overflow-hidden min-h-[400px] sm:min-h-[480px] md:min-h-[530px] flex items-center justify-center transition-colors duration-400`}
          >
            {/* Split Wall/Sky and Floor for authentic indoor/outdoor environment depth */}
            <div
              className={`absolute top-0 left-0 right-0 h-[55%] ${currentScene.wallOrSkyGradient} opacity-90`}
            />
            <div
              className={`absolute bottom-0 left-0 right-0 h-[45%] ${currentScene.floorGradient} opacity-90`}
            />

            {/* Room / Scene Background Props (Trees, Beds, Couches, Counters, Windows, etc.) */}
            {currentScene.decorations.map((dec, idx) => (
              <div
                key={`dec_${currentScene.id}_${idx}`}
                className={`absolute select-none pointer-events-none ${dec.size} ${
                  dec.flip ? '-scale-x-100' : ''
                } drop-shadow-sm`}
                style={{
                  left: `${dec.x}%`,
                  top: `${dec.y}%`,
                  zIndex: dec.z,
                  opacity: dec.opacity ?? 0.85,
                }}
              >
                {dec.emoji}
              </div>
            ))}

            {/* Scattered Objects (Target + Distractors, naturally tucked and layered) */}
            {currentRound.placedItems.map((item) => {
              const isCelebrating = celebratingUid === item.uid;
              const isWobbling = wobbleUid === item.uid;

              return (
                <motion.button
                  key={item.uid}
                  id={`item-${item.obj.id}-${item.isTarget ? 'target' : 'dist'}`}
                  onClick={() => handleItemTap(item)}
                  animate={
                    isCelebrating
                      ? {
                          scale: [1, 1.45, 1.25],
                          rotate: [0, -15, 15, 0],
                        }
                      : isWobbling
                      ? {
                          x: [-8, 8, -6, 6, 0],
                          rotate: [-12, 12, -8, 8, 0],
                        }
                      : {
                          scale: 1,
                          rotate: item.rotation,
                        }
                  }
                  transition={{
                    duration: isCelebrating ? 0.7 : 0.45,
                    ease: 'easeOut',
                  }}
                  style={{
                    position: 'absolute',
                    left: `${item.xPercent}%`,
                    top: `${item.yPercent}%`,
                    transform: 'translate(-50%, -50%)',
                    zIndex: isCelebrating ? 99 : item.zIndex,
                  }}
                  className={`relative p-1 rounded-2xl cursor-pointer transition-transform active:scale-95 focus:outline-none select-none`}
                  aria-label={item.obj.name}
                >
                  {/* Item Emoji Display */}
                  <span
                    className="text-4xl sm:text-5xl md:text-6xl drop-shadow-md inline-block select-none pointer-events-none"
                    style={{
                      transform: `scale(${item.scale})`,
                    }}
                  >
                    {item.obj.emoji}
                  </span>

                  {/* Sparkle Burst on Correct Tap */}
                  {isCelebrating && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: [0, 1.5, 1.2], opacity: [1, 1, 0] }}
                      transition={{ duration: 0.9 }}
                      className="absolute -top-4 -left-4 -right-4 -bottom-4 flex items-center justify-center pointer-events-none"
                    >
                      <Sparkles className="w-12 h-12 text-yellow-300 animate-spin fill-yellow-200" />
                      <div className="absolute text-2xl animate-ping">✨</div>
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* 3. SUBTLE PROGRESS BAR AT BOTTOM */}
          <div className="w-full flex items-center justify-center gap-1.5 py-1">
            {screens.map((_, idx) => {
              const isPast = idx < currentScreenIdx;
              const isCurrent = idx === currentScreenIdx;
              return (
                <div
                  key={`step_${idx}`}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    isPast
                      ? 'w-8 bg-emerald-500 shadow-xs'
                      : isCurrent
                      ? 'w-12 bg-teal-500 shadow-sm animate-pulse'
                      : 'w-5 bg-slate-300'
                  }`}
                />
              );
            })}
          </div>
        </>
      ) : (
        /* 4. COMPLETION CELEBRATION SCREEN WITH REPLAY (GENUINE RANDOMIZATION) */
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 18 }}
          id="spy-completion-screen"
          className="w-full bg-gradient-to-b from-teal-500 via-teal-600 to-cyan-700 rounded-3xl p-6 sm:p-10 border-4 border-teal-400 shadow-2xl text-white flex flex-col items-center justify-center text-center gap-5 min-h-[420px]"
        >
          <div className="relative">
            <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-tr from-amber-300 to-yellow-100 rounded-full border-4 border-white flex items-center justify-center text-5xl sm:text-6xl shadow-xl animate-bounce">
              🔍
            </div>
            <Sparkles className="w-10 h-10 text-yellow-300 absolute -top-2 -right-2 animate-spin" />
            <Star className="w-8 h-8 text-amber-300 fill-amber-300 absolute -bottom-1 -left-2 animate-pulse" />
          </div>

          <div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-wide text-white drop-shadow-md">
              WOW! GREAT JOB!
            </h2>
            <p className="text-sm sm:text-lg text-teal-100 font-bold max-w-md mt-1">
              You found all the hidden objects like a real Super Detective!
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
            <button
              id="spy-replay-btn"
              onClick={handleReplay}
              className="bg-amber-400 hover:bg-amber-300 active:scale-95 text-amber-950 font-black text-base sm:text-xl px-8 py-3.5 rounded-2xl border-3 border-white shadow-xl flex items-center gap-2 cursor-pointer transition-transform"
            >
              <RotateCcw className="w-6 h-6 stroke-[2.5]" />
              <span>PLAY AGAIN (NEW HUNT)</span>
            </button>

            <button
              id="spy-finish-home-btn"
              onClick={onNavigateHome}
              className="bg-black/30 hover:bg-black/50 active:scale-95 text-white font-bold text-base sm:text-lg px-6 py-3.5 rounded-2xl border-2 border-white/40 shadow-md flex items-center gap-2 cursor-pointer transition-transform"
            >
              <Home className="w-5 h-5 text-amber-200" />
              <span>Back to Home</span>
            </button>
          </div>
        </motion.div>
      )}

      {/* BOTTOM NAVIGATION */}
      <div className="w-full flex justify-center mt-3">
        <ActivityBottomNav
          onNavigatePrev={handleInternalPrev}
          onNavigateHome={onNavigateHome}
          onNavigateNext={onNavigateNext}
          isNextUnlocked={isHuntComplete || Boolean(isActivityCompleted)}
        />
      </div>
    </div>
  );
};
