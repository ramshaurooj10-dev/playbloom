import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Volume2, Star as StarIcon, Check, Sparkles } from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { ActivityBottomNav } from './ActivityBottomNav';

interface ShadowMatchProps {
  onCollectStar: () => void;
  onNavigateHome?: () => void;
  onNavigateNext?: () => void;
  onNavigatePrev?: () => void;
  isActivityCompleted?: boolean;
}

export interface ShadowObject {
  id: string;
  name: string;
  emoji: string;
  category: string;
}

export interface ActiveShadowChallenge {
  id: string;
  items: ShadowObject[];
  shadowOrder: ShadowObject[];
}

// Rich pool of distinct preschool objects with recognizable silhouettes
const OBJECT_POOL: ShadowObject[] = [
  { id: 'cat', name: 'Cat', emoji: '🐱', category: 'animal' },
  { id: 'dog', name: 'Dog', emoji: '🐶', category: 'animal' },
  { id: 'rabbit', name: 'Rabbit', emoji: '🐰', category: 'animal' },
  { id: 'lion', name: 'Lion', emoji: '🦁', category: 'animal' },
  { id: 'elephant', name: 'Elephant', emoji: '🐘', category: 'animal' },
  { id: 'bear', name: 'Teddy Bear', emoji: '🧸', category: 'toy' },
  { id: 'frog', name: 'Frog', emoji: '🐸', category: 'animal' },
  { id: 'duck', name: 'Duck', emoji: '🦆', category: 'animal' },
  { id: 'butterfly', name: 'Butterfly', emoji: '🦋', category: 'animal' },
  { id: 'apple', name: 'Apple', emoji: '🍎', category: 'food' },
  { id: 'banana', name: 'Banana', emoji: '🍌', category: 'food' },
  { id: 'strawberry', name: 'Strawberry', emoji: '🍓', category: 'food' },
  { id: 'flower', name: 'Flower', emoji: '🌸', category: 'nature' },
  { id: 'sunflower', name: 'Sunflower', emoji: '🌻', category: 'nature' },
  { id: 'tree', name: 'Tree', emoji: '🌳', category: 'nature' },
  { id: 'mushroom', name: 'Mushroom', emoji: '🍄', category: 'nature' },
  { id: 'car', name: 'Car', emoji: '🚗', category: 'vehicle' },
  { id: 'bus', name: 'Bus', emoji: '🚌', category: 'vehicle' },
  { id: 'bicycle', name: 'Bicycle', emoji: '🚲', category: 'vehicle' },
  { id: 'boat', name: 'Sailboat', emoji: '⛵', category: 'vehicle' },
  { id: 'rocket', name: 'Rocket', emoji: '🚀', category: 'vehicle' },
  { id: 'balloon', name: 'Balloon', emoji: '🎈', category: 'toy' },
  { id: 'ball', name: 'Ball', emoji: '⚽', category: 'toy' },
  { id: 'kite', name: 'Kite', emoji: '🪁', category: 'toy' },
  { id: 'house', name: 'House', emoji: '🏠', category: 'building' },
  { id: 'star', name: 'Star', emoji: '⭐', category: 'nature' },
];

const GRADIENTS = [
  'from-indigo-100 via-sky-50 to-amber-100',
  'from-sky-100 via-indigo-50 to-purple-100',
  'from-emerald-100 via-teal-50 to-amber-100',
  'from-amber-100 via-rose-50 to-indigo-100',
  'from-purple-100 via-pink-50 to-sky-100',
];

function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Generate 8 challenges with progressive difficulty (3 -> 4 -> 5 items)
const generateGameChallenges = (): { challenges: ActiveShadowChallenge[]; bgGradient: string } => {
  const bgGradient = GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)];

  // Preset curated groups to ensure high visual distinction in early rounds
  const challengeItemCounts = [3, 3, 4, 4, 4, 5, 5, 5];

  const challenges: ActiveShadowChallenge[] = challengeItemCounts.map((count, index) => {
    // Select 'count' random distinct objects from the pool
    const shuffledPool = shuffleArray(OBJECT_POOL);
    const selectedItems = shuffledPool.slice(0, count);

    // Separately shuffle the shadow order on the right so positions are never 1-to-1 predictable
    let shadowOrder = shuffleArray(selectedItems);
    // Ensure that if count > 2, at least one item isn't in the exact same index to make it an active challenge
    if (count > 2 && shadowOrder.every((s, i) => s.id === selectedItems[i].id)) {
      shadowOrder = [shadowOrder[1], shadowOrder[0], ...shadowOrder.slice(2)];
    }

    return {
      id: `shadow_c_${index}_${Math.random().toString(36).substring(2, 6)}`,
      items: selectedItems,
      shadowOrder,
    };
  });

  return { challenges, bgGradient };
};

export const ShadowMatch: React.FC<ShadowMatchProps> = ({
  onCollectStar,
  onNavigateHome,
  onNavigateNext,
  onNavigatePrev,
  isActivityCompleted = false,
}) => {
  const [{ challenges, bgGradient }, setGame] = useState(generateGameChallenges);
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [matchedIds, setMatchedIds] = useState<Set<string>>(new Set());
  const [selectedLeftId, setSelectedLeftId] = useState<string | null>(null);
  const [isSuccessCelebrating, setIsSuccessCelebrating] = useState(false);
  const [isAllFinished, setIsAllFinished] = useState(false);
  const [shakingId, setShakingId] = useState<string | null>(null);

  const shadowSlotRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const currentChallenge = challenges[currentChallengeIndex] || challenges[0];

  // Voice instruction on challenge change
  useEffect(() => {
    if (isAllFinished) return;
    soundManager.speak('Can you find the matching shadow?');
    setMatchedIds(new Set());
    setSelectedLeftId(null);
    setIsSuccessCelebrating(false);
  }, [currentChallengeIndex, isAllFinished]);

  const handlePlayAgain = () => {
    soundManager.speak("Let's match shadows again!");
    setGame(generateGameChallenges());
    setCurrentChallengeIndex(0);
    setMatchedIds(new Set());
    setSelectedLeftId(null);
    setIsSuccessCelebrating(false);
    setIsAllFinished(false);
  };

  // Evaluate matching an object with a target shadow
  const handleTryMatch = (objectId: string, targetShadowId: string) => {
    if (isSuccessCelebrating || isAllFinished) return;

    if (objectId === targetShadowId) {
      // CORRECT MATCH
      soundManager.playPop();
      soundManager.speak('Great job!');

      const nextMatched = new Set(matchedIds);
      nextMatched.add(objectId);
      setMatchedIds(nextMatched);
      setSelectedLeftId(null);

      // Check if all items in current challenge are matched
      if (nextMatched.size === currentChallenge.items.length) {
        setIsSuccessCelebrating(true);
        soundManager.playCelebration();
        soundManager.speak('You matched them all! Great job!');

        setTimeout(() => {
          if (currentChallengeIndex + 1 >= challenges.length) {
            // All 8 challenges complete!
            onCollectStar();
            setIsAllFinished(true);
            soundManager.speak('You matched them all!');
          } else {
            // Automatic advance to next challenge (NO manual next button)
            setCurrentChallengeIndex((prev) => prev + 1);
          }
        }, 1600);
      }
    } else {
      // WRONG MATCH
      soundManager.playPop();
      soundManager.speak('Try again!');
      setShakingId(objectId);
      setTimeout(() => {
        setShakingId(null);
        setSelectedLeftId(null);
      }, 600);
    }
  };

  // Drag End Collision Handler
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, item: ShadowObject) => {
    if (isSuccessCelebrating || isAllFinished || matchedIds.has(item.id)) return;

    const point = 'changedTouches' in event ? event.changedTouches[0] : (event as MouseEvent);
    const dropX = point.clientX;
    const dropY = point.clientY;

    let targetShadowIdFound: string | undefined;

    // Check collision with shadow targets on the right
    for (const shadowItem of currentChallenge.shadowOrder) {
      const el = shadowSlotRefs.current[shadowItem.id];
      if (el) {
        const rect = el.getBoundingClientRect();
        // Generous hit box for toddlers
        if (
          dropX >= rect.left - 20 &&
          dropX <= rect.right + 20 &&
          dropY >= rect.top - 20 &&
          dropY <= rect.bottom + 20
        ) {
          targetShadowIdFound = shadowItem.id;
          break;
        }
      }
    }

    if (targetShadowIdFound) {
      handleTryMatch(item.id, targetShadowIdFound);
    } else {
      soundManager.playPop();
      soundManager.speak("Let's try again!");
      setShakingId(item.id);
      setTimeout(() => setShakingId(null), 500);
    }
  };

  // Tap fallback for selection
  const handleLeftCardClick = (item: ShadowObject) => {
    if (isSuccessCelebrating || isAllFinished || matchedIds.has(item.id)) return;
    if (selectedLeftId === item.id) {
      setSelectedLeftId(null);
    } else {
      setSelectedLeftId(item.id);
      soundManager.playPop();
    }
  };

  const handleShadowSlotClick = (shadowItem: ShadowObject) => {
    if (isSuccessCelebrating || isAllFinished || matchedIds.has(shadowItem.id)) return;
    if (selectedLeftId) {
      handleTryMatch(selectedLeftId, shadowItem.id);
    }
  };

  const matchedCount = matchedIds.size;
  const totalCount = currentChallenge.items.length;

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center p-2 sm:p-4">
      {/* Top Banner Header */}
      <div className="w-full flex items-center justify-between bg-white border-4 border-amber-300 rounded-3xl px-4 sm:px-6 py-2.5 shadow-md mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl sm:text-3xl">🌑</span>
          <div>
            <h1 className="text-base sm:text-lg font-black text-amber-950 tracking-tight leading-tight">
              SHADOW MATCH
            </h1>
            <p className="text-[11px] sm:text-xs font-bold text-amber-700">
              Challenge: {currentChallengeIndex + (isAllFinished ? 1 : 0)} / {challenges.length}
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
              onClick={() => soundManager.speak('Can you find the matching shadow?')}
              className="text-amber-600 hover:text-amber-800 transition-colors cursor-pointer"
              title="Repeat instruction"
            >
              <Volume2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <h2 className="text-base sm:text-xl font-black text-amber-950 tracking-wide">
              Can you find the matching shadow?
            </h2>
          </div>
          <p className="text-xs sm:text-sm font-black text-slate-600 uppercase tracking-wide">
            Drag each colorful picture to its matching dark shadow!
          </p>
        </div>

        {/* Content Zone: Left (Pictures) vs Right (Shadows) */}
        {!isAllFinished ? (
          <div className="w-full max-w-2xl flex flex-col my-auto flex-1 justify-center gap-4 sm:gap-6 py-2">
            <div className="w-full grid grid-cols-2 gap-4 sm:gap-8">
              {/* LEFT COLUMN: PICTURES */}
              <div className="bg-white/85 backdrop-blur-xs border-4 border-amber-300 rounded-3xl p-3 sm:p-5 shadow-xl flex flex-col items-center">
                <div className="mb-3 px-3 py-1 bg-amber-100 rounded-full border-2 border-amber-300">
                  <span className="text-xs sm:text-sm font-black text-amber-950 uppercase tracking-wider flex items-center gap-1">
                    <span>🎨</span>
                    <span>Pictures</span>
                  </span>
                </div>

                <div className="w-full flex flex-col items-center gap-3 sm:gap-4">
                  {currentChallenge.items.map((item) => {
                    const isMatched = matchedIds.has(item.id);
                    const isSelected = selectedLeftId === item.id;
                    const isShaking = shakingId === item.id;

                    return (
                      <div
                        key={item.id}
                        className="w-full max-w-[170px] aspect-[4/3] relative flex items-center justify-center"
                      >
                        <AnimatePresence>
                          {!isMatched ? (
                            <motion.div
                              layout
                              drag={!isSuccessCelebrating}
                              dragSnapToOrigin={true}
                              whileDrag={{ scale: 1.2, zIndex: 50 }}
                              onDragEnd={(event) => handleDragEnd(event, item)}
                              animate={isShaking ? { x: [-8, 8, -6, 6, -3, 3, 0] } : {}}
                              transition={{ duration: 0.3 }}
                              onClick={() => handleLeftCardClick(item)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className={`w-full h-full bg-white rounded-2xl border-3 flex items-center justify-center cursor-grab active:cursor-grabbing select-none shadow-md transition-all ${
                                isSelected
                                  ? 'border-amber-500 ring-4 ring-amber-300 bg-amber-50'
                                  : 'border-slate-200 hover:border-amber-300'
                              }`}
                              title={`Drag ${item.name}`}
                            >
                              <span className="text-4xl sm:text-5xl filter drop-shadow-sm select-none">
                                {item.emoji}
                              </span>
                            </motion.div>
                          ) : (
                            // Matched placeholder (faint outline)
                            <div className="w-full h-full rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/50 flex items-center justify-center">
                              <span className="text-emerald-500 font-bold text-xs flex items-center gap-1">
                                <Check className="w-4 h-4" /> Matched
                              </span>
                            </div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* RIGHT COLUMN: SHADOWS */}
              <div className="bg-slate-900/10 backdrop-blur-xs border-4 border-slate-600/30 bg-white/70 rounded-3xl p-3 sm:p-5 shadow-xl flex flex-col items-center">
                <div className="mb-3 px-3 py-1 bg-slate-800 rounded-full border-2 border-slate-950 text-white shadow-xs">
                  <span className="text-xs sm:text-sm font-black uppercase tracking-wider flex items-center gap-1">
                    <span>🌑</span>
                    <span>Shadows</span>
                  </span>
                </div>

                <div className="w-full flex flex-col items-center gap-3 sm:gap-4">
                  {currentChallenge.shadowOrder.map((shadowItem) => {
                    const isMatched = matchedIds.has(shadowItem.id);

                    return (
                      <div
                        key={shadowItem.id}
                        ref={(el) => {
                          shadowSlotRefs.current[shadowItem.id] = el;
                        }}
                        onClick={() => handleShadowSlotClick(shadowItem)}
                        className={`w-full max-w-[170px] aspect-[4/3] rounded-2xl border-3 flex items-center justify-center relative transition-all cursor-pointer ${
                          isMatched
                            ? 'bg-emerald-50 border-emerald-500 ring-4 ring-emerald-300 shadow-md'
                            : selectedLeftId
                            ? 'bg-slate-100/90 border-slate-400 hover:border-amber-400 hover:scale-103'
                            : 'bg-slate-100 border-slate-300 shadow-inner'
                        }`}
                        title="Matching shadow"
                      >
                        <AnimatePresence mode="wait">
                          {isMatched ? (
                            // Matched Colorful State
                            <motion.div
                              key="matched"
                              initial={{ scale: 0.6, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ type: 'spring', damping: 15, stiffness: 300 }}
                              className="flex items-center justify-center relative"
                            >
                              <span className="text-4xl sm:text-5xl filter drop-shadow-md">
                                {shadowItem.emoji}
                              </span>
                              <div className="absolute -top-2 -right-2 bg-emerald-500 text-white p-1 rounded-full border-2 border-white shadow-md">
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                              </div>
                              {isSuccessCelebrating && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: [0, 1.2, 1] }}
                                  className="absolute -top-3 -left-3 pointer-events-none"
                                >
                                  <Sparkles className="w-5 h-5 text-amber-400 animate-spin" />
                                </motion.div>
                              )}
                            </motion.div>
                          ) : (
                            // Pure Charcoal Silhouette Shadow (Recognizable outline, no color hint)
                            <motion.div
                              key="shadow"
                              className="flex items-center justify-center relative select-none"
                            >
                              <span
                                className="text-4xl sm:text-5xl select-none"
                                style={{
                                  filter: 'brightness(0) contrast(150%) opacity(0.85) drop-shadow(0 2px 2px rgba(0,0,0,0.3))',
                                  transform: 'scale(1.02)',
                                  userSelect: 'none',
                                }}
                              >
                                {shadowItem.emoji}
                              </span>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Match Counter Badge */}
            <div className="flex justify-center">
              <span className="bg-amber-100 border-2 border-amber-300 px-4 py-1 rounded-full text-xs font-black text-amber-950 shadow-xs">
                Matched: {matchedCount} / {totalCount}
              </span>
            </div>
          </div>
        ) : (
          /* COMPLETION CARD */
          <div className="w-full max-w-md bg-white border-4 border-amber-400 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col items-center text-center my-auto">
            <div className="text-5xl sm:text-6xl mb-3 animate-bounce">🎉</div>
            <h3 className="text-2xl sm:text-3xl font-black text-amber-950 tracking-tight mb-1">
              SHADOW MATCH STAR!
            </h3>
            <div className="inline-flex items-center gap-2 bg-amber-100 border-2 border-amber-300 px-4 py-1.5 rounded-full mb-3 shadow-xs">
              <StarIcon className="w-5 h-5 fill-amber-400 text-amber-500 animate-spin" />
              <span className="font-black text-amber-950 text-sm">Star Earned!</span>
            </div>
            <p className="text-base font-bold text-slate-700 mb-5">
              You matched them all! Outstanding visual discrimination and shape recognition skills!
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
