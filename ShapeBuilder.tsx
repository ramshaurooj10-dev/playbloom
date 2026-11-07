import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Volume2, Star as StarIcon, Check, Sparkles } from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { ActivityBottomNav } from './ActivityBottomNav';

interface ShapeBuilderProps {
  onCollectStar: () => void;
  onNavigateHome?: () => void;
  onNavigateNext?: () => void;
  onNavigatePrev?: () => void;
  isActivityCompleted?: boolean;
}

export type ShapeKind = 'triangle' | 'square' | 'circle' | 'rectangle' | 'oval' | 'semicircle' | 'hexagon';

export interface ShapeSlot {
  id: string;
  kind: ShapeKind;
  name: string;
  x: number; // percentage (0-100) within target viewBox
  y: number; // percentage (0-100) within target viewBox
  width: number; // percentage relative size
  height: number;
  rotation?: number;
  color: string;
  borderColor: string;
  label?: string;
}

export interface PuzzleDefinition {
  id: string;
  name: string;
  title: string;
  iconEmoji: string;
  slots: ShapeSlot[];
}

export interface PieceItem {
  instanceId: string;
  kind: ShapeKind;
  color: string;
  borderColor: string;
  label: string;
  slotIdTarget: string; // which slot this is intended for
  isPlaced: boolean;
  isDistractor?: boolean;
}

export interface ActiveChallenge {
  id: string;
  puzzle: PuzzleDefinition;
  pieces: PieceItem[];
  placedSlotIds: Set<string>;
}

// 10 Preschool Shape Picture Puzzles
const PUZZLE_TEMPLATES: PuzzleDefinition[] = [
  {
    id: 'house',
    name: 'House',
    title: 'a Cozy House',
    iconEmoji: '🏠',
    slots: [
      { id: 'h_roof', kind: 'triangle', name: 'Roof', x: 50, y: 25, width: 38, height: 26, color: '#EF4444', borderColor: '#B91C1C' },
      { id: 'h_body', kind: 'square', name: 'Wall', x: 50, y: 64, width: 38, height: 38, color: '#3B82F6', borderColor: '#1D4ED8' },
      { id: 'h_door', kind: 'rectangle', name: 'Door', x: 50, y: 72, width: 14, height: 22, color: '#F59E0B', borderColor: '#B45309' },
      { id: 'h_window', kind: 'circle', name: 'Attic Window', x: 50, y: 27, width: 10, height: 10, color: '#FDE047', borderColor: '#EAB308' },
    ],
  },
  {
    id: 'car',
    name: 'Car',
    title: 'a Speedy Car',
    iconEmoji: '🚗',
    slots: [
      { id: 'c_cabin', kind: 'semicircle', name: 'Roof', x: 50, y: 34, width: 34, height: 22, color: '#3B82F6', borderColor: '#1D4ED8' },
      { id: 'c_body', kind: 'rectangle', name: 'Body', x: 50, y: 58, width: 62, height: 24, color: '#EF4444', borderColor: '#B91C1C' },
      { id: 'c_wheel_l', kind: 'circle', name: 'Front Wheel', x: 30, y: 76, width: 16, height: 16, color: '#334155', borderColor: '#0F172A' },
      { id: 'c_wheel_r', kind: 'circle', name: 'Back Wheel', x: 70, y: 76, width: 16, height: 16, color: '#334155', borderColor: '#0F172A' },
    ],
  },
  {
    id: 'tree',
    name: 'Tree',
    title: 'a Pine Tree',
    iconEmoji: '🌲',
    slots: [
      { id: 't_top', kind: 'triangle', name: 'Top Leaves', x: 50, y: 24, width: 28, height: 22, color: '#10B981', borderColor: '#047857' },
      { id: 't_mid', kind: 'triangle', name: 'Middle Leaves', x: 50, y: 44, width: 38, height: 24, color: '#059669', borderColor: '#065F46' },
      { id: 't_bot', kind: 'triangle', name: 'Bottom Leaves', x: 50, y: 64, width: 48, height: 26, color: '#047857', borderColor: '#064E3B' },
      { id: 't_trunk', kind: 'rectangle', name: 'Tree Trunk', x: 50, y: 84, width: 14, height: 20, color: '#854D0E', borderColor: '#713F12' },
    ],
  },
  {
    id: 'rocket',
    name: 'Rocket',
    title: 'a Space Rocket',
    iconEmoji: '🚀',
    slots: [
      { id: 'r_nose', kind: 'triangle', name: 'Nosecone', x: 50, y: 18, width: 22, height: 22, color: '#EF4444', borderColor: '#B91C1C' },
      { id: 'r_body', kind: 'rectangle', name: 'Fuselage', x: 50, y: 50, width: 22, height: 42, color: '#3B82F6', borderColor: '#1D4ED8' },
      { id: 'r_window', kind: 'circle', name: 'Window', x: 50, y: 45, width: 12, height: 12, color: '#67E8F9', borderColor: '#06B6D4' },
      { id: 'r_fin_l', kind: 'triangle', name: 'Left Wing', x: 28, y: 70, width: 18, height: 20, rotation: -30, color: '#F59E0B', borderColor: '#B45309' },
      { id: 'r_fin_r', kind: 'triangle', name: 'Right Wing', x: 72, y: 70, width: 18, height: 20, rotation: 30, color: '#F59E0B', borderColor: '#B45309' },
    ],
  },
  {
    id: 'fish',
    name: 'Fish',
    title: 'a Swimming Fish',
    iconEmoji: '🐟',
    slots: [
      { id: 'f_body', kind: 'oval', name: 'Fish Body', x: 42, y: 50, width: 44, height: 32, color: '#F97316', borderColor: '#C2410C' },
      { id: 'f_tail', kind: 'triangle', name: 'Tail Fin', x: 76, y: 50, width: 24, height: 30, rotation: 90, color: '#FBBF24', borderColor: '#D97706' },
      { id: 'f_fin_top', kind: 'triangle', name: 'Top Fin', x: 42, y: 26, width: 18, height: 16, color: '#FB923C', borderColor: '#EA580C' },
      { id: 'f_eye', kind: 'circle', name: 'Eye', x: 26, y: 46, width: 9, height: 9, color: '#0F172A', borderColor: '#334155' },
    ],
  },
  {
    id: 'flower',
    name: 'Flower',
    title: 'a Happy Flower',
    iconEmoji: '🌸',
    slots: [
      { id: 'fl_stem', kind: 'rectangle', name: 'Stem', x: 50, y: 70, width: 8, height: 38, color: '#10B981', borderColor: '#047857' },
      { id: 'fl_center', kind: 'circle', name: 'Flower Center', x: 50, y: 35, width: 20, height: 20, color: '#F59E0B', borderColor: '#D97706' },
      { id: 'fl_petal_t', kind: 'circle', name: 'Top Petal', x: 50, y: 16, width: 18, height: 18, color: '#EC4899', borderColor: '#BE185D' },
      { id: 'fl_petal_b', kind: 'circle', name: 'Bottom Petal', x: 50, y: 54, width: 18, height: 18, color: '#EC4899', borderColor: '#BE185D' },
      { id: 'fl_petal_l', kind: 'circle', name: 'Left Petal', x: 31, y: 35, width: 18, height: 18, color: '#EC4899', borderColor: '#BE185D' },
      { id: 'fl_petal_r', kind: 'circle', name: 'Right Petal', x: 69, y: 35, width: 18, height: 18, color: '#EC4899', borderColor: '#BE185D' },
    ],
  },
  {
    id: 'sun',
    name: 'Sun',
    title: 'a Bright Sun',
    iconEmoji: '☀️',
    slots: [
      { id: 's_center', kind: 'circle', name: 'Sun Center', x: 50, y: 50, width: 34, height: 34, color: '#FBBF24', borderColor: '#D97706' },
      { id: 's_ray_t', kind: 'triangle', name: 'Top Ray', x: 50, y: 18, width: 14, height: 16, color: '#F59E0B', borderColor: '#B45309' },
      { id: 's_ray_b', kind: 'triangle', name: 'Bottom Ray', x: 50, y: 82, width: 14, height: 16, rotation: 180, color: '#F59E0B', borderColor: '#B45309' },
      { id: 's_ray_l', kind: 'triangle', name: 'Left Ray', x: 18, y: 50, width: 14, height: 16, rotation: -90, color: '#F59E0B', borderColor: '#B45309' },
      { id: 's_ray_r', kind: 'triangle', name: 'Right Ray', x: 82, y: 50, width: 14, height: 16, rotation: 90, color: '#F59E0B', borderColor: '#B45309' },
    ],
  },
  {
    id: 'boat',
    name: 'Sailboat',
    title: 'a Sailboat',
    iconEmoji: '⛵',
    slots: [
      { id: 'b_hull', kind: 'semicircle', name: 'Boat Hull', x: 50, y: 74, width: 56, height: 24, rotation: 180, color: '#854D0E', borderColor: '#713F12' },
      { id: 'b_mast', kind: 'rectangle', name: 'Mast', x: 48, y: 44, width: 5, height: 38, color: '#94A3B8', borderColor: '#64748B' },
      { id: 'b_sail_l', kind: 'triangle', name: 'Big Sail', x: 33, y: 40, width: 24, height: 30, rotation: -20, color: '#38BDF8', borderColor: '#0284C7' },
      { id: 'b_sail_r', kind: 'triangle', name: 'Small Sail', x: 62, y: 44, width: 18, height: 24, rotation: 15, color: '#EF4444', borderColor: '#B91C1C' },
    ],
  },
  {
    id: 'truck',
    name: 'Truck',
    title: 'a Big Truck',
    iconEmoji: '🚚',
    slots: [
      { id: 'tr_cargo', kind: 'rectangle', name: 'Cargo Box', x: 38, y: 46, width: 40, height: 30, color: '#10B981', borderColor: '#047857' },
      { id: 'tr_cab', kind: 'square', name: 'Front Cab', x: 70, y: 51, width: 22, height: 20, color: '#F59E0B', borderColor: '#D97706' },
      { id: 'tr_w1', kind: 'circle', name: 'Front Wheel', x: 26, y: 74, width: 15, height: 15, color: '#1E293B', borderColor: '#0F172A' },
      { id: 'tr_w2', kind: 'circle', name: 'Middle Wheel', x: 48, y: 74, width: 15, height: 15, color: '#1E293B', borderColor: '#0F172A' },
      { id: 'tr_w3', kind: 'circle', name: 'Back Wheel', x: 72, y: 74, width: 15, height: 15, color: '#1E293B', borderColor: '#0F172A' },
    ],
  },
  {
    id: 'balloon_art',
    name: 'Balloon',
    title: 'a Floating Balloon',
    iconEmoji: '🎈',
    slots: [
      { id: 'bl_oval', kind: 'oval', name: 'Balloon', x: 50, y: 35, width: 42, height: 48, color: '#EF4444', borderColor: '#DC2626' },
      { id: 'bl_knot', kind: 'triangle', name: 'Knot', x: 50, y: 64, width: 12, height: 10, rotation: 180, color: '#B91C1C', borderColor: '#991B1B' },
      { id: 'bl_string', kind: 'rectangle', name: 'String', x: 50, y: 79, width: 4, height: 22, color: '#64748B', borderColor: '#475569' },
    ],
  },
];

const GRADIENTS = [
  'from-amber-100 via-sky-50 to-indigo-100',
  'from-emerald-100 via-yellow-50 to-teal-100',
  'from-sky-100 via-purple-50 to-pink-100',
  'from-rose-100 via-amber-50 to-emerald-100',
  'from-cyan-100 via-lime-50 to-amber-100',
];

function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Generate 8 distinct challenges
const generateGamePuzzles = (): { challenges: ActiveChallenge[]; bgGradient: string } => {
  const shuffledTemplates = shuffleArray(PUZZLE_TEMPLATES).slice(0, 8);
  const bgGradient = GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)];

  const challenges: ActiveChallenge[] = shuffledTemplates.map((puzzle) => {
    // Generate piece items for each slot
    const pieces: PieceItem[] = puzzle.slots.map((slot, index) => ({
      instanceId: `${puzzle.id}_p_${index}_${Math.random().toString(36).substring(2, 6)}`,
      kind: slot.kind,
      color: slot.color,
      borderColor: slot.borderColor,
      label: slot.name,
      slotIdTarget: slot.id,
      isPlaced: false,
    }));

    // Randomize the pieces in the tray
    const shuffledPieces = shuffleArray(pieces);

    return {
      id: `${puzzle.id}_${Math.random().toString(36).substring(2, 6)}`,
      puzzle,
      pieces: shuffledPieces,
      placedSlotIds: new Set<string>(),
    };
  });

  return { challenges, bgGradient };
};

// Shape Visual Component
export const ShapeGraphic: React.FC<{
  kind: ShapeKind;
  color: string;
  borderColor: string;
  className?: string;
  isGhost?: boolean;
}> = ({ kind, color, borderColor, className = '', isGhost = false }) => {
  if (kind === 'circle') {
    return (
      <div
        className={`w-full h-full rounded-full border-3 shadow-md flex items-center justify-center transition-all ${className}`}
        style={{
          backgroundColor: isGhost ? `${color}30` : color,
          borderColor: isGhost ? `${borderColor}80` : borderColor,
          borderStyle: isGhost ? 'dashed' : 'solid',
        }}
      />
    );
  }

  if (kind === 'oval') {
    return (
      <div
        className={`w-full h-full rounded-[50%] border-3 shadow-md flex items-center justify-center transition-all ${className}`}
        style={{
          backgroundColor: isGhost ? `${color}30` : color,
          borderColor: isGhost ? `${borderColor}80` : borderColor,
          borderStyle: isGhost ? 'dashed' : 'solid',
        }}
      />
    );
  }

  if (kind === 'square') {
    return (
      <div
        className={`w-full h-full rounded-xl border-3 shadow-md flex items-center justify-center transition-all ${className}`}
        style={{
          backgroundColor: isGhost ? `${color}30` : color,
          borderColor: isGhost ? `${borderColor}80` : borderColor,
          borderStyle: isGhost ? 'dashed' : 'solid',
        }}
      />
    );
  }

  if (kind === 'rectangle') {
    return (
      <div
        className={`w-full h-full rounded-lg border-3 shadow-md flex items-center justify-center transition-all ${className}`}
        style={{
          backgroundColor: isGhost ? `${color}30` : color,
          borderColor: isGhost ? `${borderColor}80` : borderColor,
          borderStyle: isGhost ? 'dashed' : 'solid',
        }}
      />
    );
  }

  if (kind === 'semicircle') {
    return (
      <div
        className={`w-full h-full rounded-t-full border-3 shadow-md flex items-center justify-center transition-all ${className}`}
        style={{
          backgroundColor: isGhost ? `${color}30` : color,
          borderColor: isGhost ? `${borderColor}80` : borderColor,
          borderStyle: isGhost ? 'dashed' : 'solid',
        }}
      />
    );
  }

  if (kind === 'triangle') {
    return (
      <svg viewBox="0 0 100 100" className={`w-full h-full drop-shadow-md ${className}`}>
        <polygon
          points="50,5 95,95 5,95"
          fill={isGhost ? `${color}30` : color}
          stroke={isGhost ? `${borderColor}80` : borderColor}
          strokeWidth="6"
          strokeDasharray={isGhost ? '6,6' : 'none'}
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (kind === 'hexagon') {
    return (
      <svg viewBox="0 0 100 100" className={`w-full h-full drop-shadow-md ${className}`}>
        <polygon
          points="50,5 90,25 90,75 50,95 10,75 10,25"
          fill={isGhost ? `${color}30` : color}
          stroke={isGhost ? `${borderColor}80` : borderColor}
          strokeWidth="6"
          strokeDasharray={isGhost ? '6,6' : 'none'}
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <div
      className={`w-full h-full rounded-xl border-3 ${className}`}
      style={{ backgroundColor: color, borderColor }}
    />
  );
};

export const ShapeBuilder: React.FC<ShapeBuilderProps> = ({
  onCollectStar,
  onNavigateHome,
  onNavigateNext,
  onNavigatePrev,
  isActivityCompleted = false,
}) => {
  const [{ challenges, bgGradient }, setGame] = useState(generateGamePuzzles);
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [placedSlots, setPlacedSlots] = useState<Set<string>>(new Set());
  const [selectedPieceId, setSelectedPieceId] = useState<string | null>(null);
  const [isSuccessCelebrating, setIsSuccessCelebrating] = useState(false);
  const [isAllFinished, setIsAllFinished] = useState(false);
  const [shakingPieceId, setShakingPieceId] = useState<string | null>(null);

  const targetBoardRef = useRef<HTMLDivElement>(null);
  const slotRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const activeChallenge = challenges[currentChallengeIndex] || challenges[0];
  const puzzle = activeChallenge.puzzle;

  // Voice instruction on challenge change
  useEffect(() => {
    if (isAllFinished) return;
    soundManager.speak(`Can you build ${puzzle.title}?`);
    setPlacedSlots(new Set());
    setSelectedPieceId(null);
    setIsSuccessCelebrating(false);
  }, [currentChallengeIndex, isAllFinished]);

  const handlePlayAgain = () => {
    soundManager.speak("Let's build shapes again!");
    setGame(generateGamePuzzles());
    setCurrentChallengeIndex(0);
    setPlacedSlots(new Set());
    setSelectedPieceId(null);
    setIsSuccessCelebrating(false);
    setIsAllFinished(false);
  };

  // Attempt placing a piece into a target slot
  const handleTryPlacePiece = (piece: PieceItem, targetSlotId?: string) => {
    if (isSuccessCelebrating || isAllFinished) return;

    // If specific target slot is specified
    let matchedSlot: ShapeSlot | undefined;

    if (targetSlotId) {
      const slot = puzzle.slots.find((s) => s.id === targetSlotId);
      if (slot && !placedSlots.has(slot.id) && slot.kind === piece.kind) {
        matchedSlot = slot;
      }
    } else {
      // Find the first unfilled slot of the same shape kind
      matchedSlot = puzzle.slots.find((s) => !placedSlots.has(s.id) && s.kind === piece.kind);
    }

    if (matchedSlot) {
      // CORRECT PLACEMENT
      soundManager.playPop();
      soundManager.speak('Great!');

      const nextPlaced = new Set(placedSlots);
      nextPlaced.add(matchedSlot.id);
      setPlacedSlots(nextPlaced);
      setSelectedPieceId(null);

      // Check if all slots in this puzzle are now filled
      if (nextPlaced.size === puzzle.slots.length) {
        setIsSuccessCelebrating(true);
        soundManager.playCelebration();
        soundManager.speak('You built it! Great job!');

        setTimeout(() => {
          if (currentChallengeIndex + 1 >= challenges.length) {
            // All 8 challenges complete!
            onCollectStar();
            setIsAllFinished(true);
            soundManager.speak('You built them all!');
          } else {
            // Automatic advance to next puzzle
            setCurrentChallengeIndex((prev) => prev + 1);
          }
        }, 1600);
      }
    } else {
      // WRONG PLACEMENT / NO MATCH
      soundManager.playPop();
      soundManager.speak('Try again!');
      setShakingPieceId(piece.instanceId);
      setTimeout(() => {
        setShakingPieceId(null);
        setSelectedPieceId(null);
      }, 600);
    }
  };

  // Drag end handler (detect which target slot is underneath the dropped point)
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, piece: PieceItem) => {
    if (isSuccessCelebrating || isAllFinished) return;

    const point = 'changedTouches' in event ? event.changedTouches[0] : (event as MouseEvent);
    const dropX = point.clientX;
    const dropY = point.clientY;

    let targetSlotFound: string | undefined;

    // Check collision with any unfilled slot element
    for (const slot of puzzle.slots) {
      if (placedSlots.has(slot.id)) continue;
      const el = slotRefs.current[slot.id];
      if (el) {
        const rect = el.getBoundingClientRect();
        // Give a generous hit area padding (18px) for toddlers
        if (
          dropX >= rect.left - 18 &&
          dropX <= rect.right + 18 &&
          dropY >= rect.top - 18 &&
          dropY <= rect.bottom + 18
        ) {
          targetSlotFound = slot.id;
          break;
        }
      }
    }

    // Also check if dropped inside the main target board
    if (!targetSlotFound && targetBoardRef.current) {
      const boardRect = targetBoardRef.current.getBoundingClientRect();
      if (
        dropX >= boardRect.left &&
        dropX <= boardRect.right &&
        dropY >= boardRect.top &&
        dropY <= boardRect.bottom
      ) {
        // Find best candidate slot for this piece kind
        const candidate = puzzle.slots.find((s) => !placedSlots.has(s.id) && s.kind === piece.kind);
        if (candidate) {
          targetSlotFound = candidate.id;
        }
      }
    }

    if (targetSlotFound) {
      handleTryPlacePiece(piece, targetSlotFound);
    } else {
      soundManager.playPop();
      soundManager.speak("Let's try there!");
      setShakingPieceId(piece.instanceId);
      setTimeout(() => setShakingPieceId(null), 500);
    }
  };

  // Tap fallback for piece selection (allows tap piece then tap target slot)
  const handlePieceClick = (piece: PieceItem) => {
    if (isSuccessCelebrating || isAllFinished) return;
    if (selectedPieceId === piece.instanceId) {
      setSelectedPieceId(null);
    } else {
      setSelectedPieceId(piece.instanceId);
      soundManager.playPop();
    }
  };

  const handleSlotClick = (slot: ShapeSlot) => {
    if (isSuccessCelebrating || isAllFinished || placedSlots.has(slot.id)) return;
    if (selectedPieceId) {
      const piece = activeChallenge.pieces.find((p) => p.instanceId === selectedPieceId);
      if (piece) {
        handleTryPlacePiece(piece, slot.id);
      }
    }
  };

  // Calculate unplaced pieces count
  const placedCount = placedSlots.size;
  const totalSlotsCount = puzzle.slots.length;

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center p-2 sm:p-4">
      {/* Top Banner Header */}
      <div className="w-full flex items-center justify-between bg-white border-4 border-amber-300 rounded-3xl px-4 sm:px-6 py-2.5 shadow-md mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl sm:text-3xl">🔷</span>
          <div>
            <h1 className="text-base sm:text-lg font-black text-amber-950 tracking-tight leading-tight">
              SHAPE BUILDER
            </h1>
            <p className="text-[11px] sm:text-xs font-bold text-amber-700">
              Completed: {currentChallengeIndex + (isAllFinished ? 1 : 0)} / {challenges.length}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-amber-100 border-2 border-amber-300 px-3 py-1 rounded-full text-amber-900 font-black text-xs">
          <StarIcon className="w-4 h-4 fill-amber-400 text-amber-500" />
          <span>{isActivityCompleted || isAllFinished ? '⭐ STAR EARNED' : '1 STAR'}</span>
        </div>
      </div>

      {/* Main Play Area */}
      <div
        className={`w-full bg-gradient-to-br ${bgGradient} border-4 border-amber-400 rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col items-center relative overflow-hidden min-h-[510px] justify-between transition-colors duration-500`}
      >
        {/* Instruction Subheader */}
        <div className="text-center mt-1 mb-2">
          <div className="inline-flex items-center gap-2 bg-white px-6 py-2 rounded-full border-4 border-amber-300 shadow-md mb-1">
            <button
              type="button"
              onClick={() => soundManager.speak(`Can you build ${puzzle.title}?`)}
              className="text-amber-600 hover:text-amber-800 transition-colors cursor-pointer"
              title="Repeat instruction"
            >
              <Volume2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <h2 className="text-base sm:text-xl font-black text-amber-950 tracking-wide flex items-center gap-1.5">
              <span>Can you build {puzzle.title}?</span>
              <span className="text-xl sm:text-2xl">{puzzle.iconEmoji}</span>
            </h2>
          </div>
          <p className="text-xs sm:text-sm font-black text-slate-600 uppercase tracking-wide">
            Drag or tap the shape pieces into the target picture!
          </p>
        </div>

        {/* Content Zone */}
        {!isAllFinished ? (
          <div className="w-full flex flex-col items-center justify-between gap-5 my-auto max-w-2xl flex-1">
            {/* TARGET BUILDING AREA */}
            <div
              ref={targetBoardRef}
              className={`w-full bg-white/90 backdrop-blur-xs border-4 ${
                isSuccessCelebrating ? 'border-emerald-400 ring-4 ring-emerald-300' : 'border-amber-300'
              } rounded-3xl p-4 sm:p-6 shadow-xl flex flex-col items-center justify-center relative min-h-[240px] sm:min-h-[260px] overflow-hidden transition-all`}
            >
              {/* Silhouette Stage Container (280x200 normalized box) */}
              <div className="w-full max-w-[320px] aspect-[4/3] relative flex items-center justify-center">
                {puzzle.slots.map((slot) => {
                  const isPlaced = placedSlots.has(slot.id);

                  return (
                    <motion.div
                      key={slot.id}
                      ref={(el) => {
                        slotRefs.current[slot.id] = el;
                      }}
                      onClick={() => handleSlotClick(slot)}
                      style={{
                        position: 'absolute',
                        left: `${slot.x}%`,
                        top: `${slot.y}%`,
                        width: `${slot.width}%`,
                        height: `${slot.height}%`,
                        transform: `translate(-50%, -50%) rotate(${slot.rotation || 0}deg)`,
                      }}
                      className={`cursor-pointer transition-transform ${
                        !isPlaced && selectedPieceId ? 'hover:scale-105' : ''
                      }`}
                    >
                      <AnimatePresence mode="wait">
                        {isPlaced ? (
                          <motion.div
                            key="placed"
                            initial={{ scale: 1.35, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: 'spring', damping: 15, stiffness: 300 }}
                            className="w-full h-full relative"
                          >
                            <ShapeGraphic
                              kind={slot.kind}
                              color={slot.color}
                              borderColor={slot.borderColor}
                            />
                            {isSuccessCelebrating && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: [0, 1.2, 1] }}
                                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                              >
                                <Sparkles className="w-5 h-5 text-white drop-shadow-md animate-spin" />
                              </motion.div>
                            )}
                          </motion.div>
                        ) : (
                          <motion.div
                            key="silhouette"
                            className="w-full h-full relative opacity-60 hover:opacity-85"
                          >
                            <ShapeGraphic
                              kind={slot.kind}
                              color={slot.color}
                              borderColor={slot.borderColor}
                              isGhost={true}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>

              {/* Status pill in corner */}
              <div className="absolute top-3 right-4 bg-amber-100 border-2 border-amber-300 px-3 py-0.5 rounded-full text-[11px] font-black text-amber-900">
                Pieces: {placedCount} / {totalSlotsCount}
              </div>
            </div>

            {/* LOWER SHAPE PIECES TRAY */}
            <div className="w-full bg-white/80 border-4 border-amber-300 rounded-3xl p-3 sm:p-4 shadow-lg flex flex-col items-center">
              <div className="text-center mb-2">
                <span className="text-xs sm:text-sm font-black text-amber-950 bg-amber-200/90 px-4 py-1 rounded-full border-2 border-amber-400 uppercase tracking-wide">
                  🧩 Drag or Tap Shape Pieces:
                </span>
              </div>

              <div className="w-full flex flex-wrap items-center justify-center gap-3 sm:gap-5 min-h-[75px] py-1">
                {activeChallenge.pieces.map((piece, pIdx) => {
                  // If matching slot is already filled, hide this piece
                  const matchingSlot = puzzle.slots.find((s) => s.id === piece.slotIdTarget);
                  const isPlaced = matchingSlot ? placedSlots.has(matchingSlot.id) : false;
                  if (isPlaced) return null;

                  const isSelected = selectedPieceId === piece.instanceId;
                  const isShaking = shakingPieceId === piece.instanceId;

                  return (
                    <motion.div
                      key={piece.instanceId}
                      layout
                      drag={!isSuccessCelebrating}
                      dragSnapToOrigin={true}
                      whileDrag={{ scale: 1.22, zIndex: 50 }}
                      onDragEnd={(event) => handleDragEnd(event, piece)}
                      animate={isShaking ? { x: [-8, 8, -6, 6, -3, 3, 0] } : {}}
                      transition={{ duration: 0.3 }}
                      onClick={() => handlePieceClick(piece)}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.95 }}
                      className={`relative w-16 h-16 sm:w-20 sm:h-20 p-2 rounded-2xl border-3 flex items-center justify-center cursor-grab active:cursor-grabbing select-none shadow-md transition-colors ${
                        isSelected
                          ? 'bg-amber-100 border-amber-500 ring-4 ring-amber-300'
                          : 'bg-white hover:bg-amber-50 border-amber-200'
                      }`}
                      title={`Drag ${piece.label}`}
                    >
                      <div className="w-full h-full relative flex items-center justify-center">
                        <ShapeGraphic
                          kind={piece.kind}
                          color={piece.color}
                          borderColor={piece.borderColor}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* COMPLETION CARD */
          <div className="w-full max-w-md bg-white border-4 border-amber-400 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col items-center text-center my-auto">
            <div className="text-5xl sm:text-6xl mb-3 animate-bounce">🎉</div>
            <h3 className="text-2xl sm:text-3xl font-black text-amber-950 tracking-tight mb-1">
              SHAPE BUILDER STAR!
            </h3>
            <div className="inline-flex items-center gap-2 bg-amber-100 border-2 border-amber-300 px-4 py-1.5 rounded-full mb-3 shadow-xs">
              <StarIcon className="w-5 h-5 fill-amber-400 text-amber-500 animate-spin" />
              <span className="font-black text-amber-950 text-sm">Star Earned!</span>
            </div>
            <p className="text-base font-bold text-slate-700 mb-5">
              You built them all! Outstanding spatial reasoning and shape composition skills!
            </p>

            {/* ONLY Replay Button */}
            <button
              type="button"
              onClick={handlePlayAgain}
              className="w-full bg-[#10B981] hover:bg-emerald-600 text-white font-black text-lg py-3.5 px-6 rounded-2xl border-b-4 border-emerald-700 shadow-xl active:border-b-0 active:translate-y-1 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-6 h-6 stroke-[3]" />
              <span>PLAY AGAIN</span>
            </button>
          </div>
        )}
      </div>

      {/* SINGLE GLOBAL BOTTOM NAVIGATION (PREV / HOME / NEXT) */}
      <ActivityBottomNav
        onPrev={onNavigatePrev}
        onHome={onNavigateHome}
        onNext={onNavigateNext}
        isNextDisabled={!isActivityCompleted && !isAllFinished}
      />
    </div>
  );
};
