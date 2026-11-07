import React, { useState } from 'react';
import { motion } from 'motion/react';
import { RotateCcw, Volume2, Star as StarIcon } from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { ActivityBottomNav } from './ActivityBottomNav';

interface JigsawPuzzleProps {
  onCollectStar: () => void;
  onNavigateHome?: () => void;
  onNavigateNext?: () => void;
  onNavigatePrev?: () => void;
  isActivityCompleted?: boolean;
}

interface Scene {
  id: string;
  title: string;
  emoji: string;
  cols: number;
  pieces: string[]; // emoji per slot, index = correct slot
}

const SCENES: Scene[] = [
  {
    id: 'farm',
    title: 'Farm',
    emoji: '🚜',
    cols: 2,
    pieces: ['🐄', '🌻', '🚜', '🌾'],
  },
  {
    id: 'beach',
    title: 'Beach',
    emoji: '🏖️',
    cols: 3,
    pieces: ['🏖️', '🐚', '🌊', '☀️', '🐠', '⛵', '🦀', '🌴', '🐢'],
  },
];

const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

export const JigsawPuzzle: React.FC<JigsawPuzzleProps> = ({
  onCollectStar,
  onNavigateHome,
  onNavigateNext,
  onNavigatePrev,
  isActivityCompleted = false,
}) => {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [trayOrder, setTrayOrder] = useState<number[]>(() => shuffle(SCENES[0].pieces.map((_, i) => i)));
  const [placed, setPlaced] = useState<Record<number, number>>({}); // slot -> piece index
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null);
  const [wrongSlot, setWrongSlot] = useState<number | null>(null);
  const [scenesDone, setScenesDone] = useState(0);
  const [isAllFinished, setIsAllFinished] = useState(false);

  const scene = SCENES[sceneIndex];
  const placedCount = Object.keys(placed).length;

  const handlePieceClick = (pieceIndex: number) => {
    if (isAllFinished) return;
    if (placedSlotOf(pieceIndex) !== null) return;
    soundManager.playPop();
    setSelectedPiece(pieceIndex);
  };

  const placedSlotOf = (pieceIndex: number): number | null => {
    for (const [slot, piece] of Object.entries(placed)) {
      if (piece === pieceIndex) return Number(slot);
    }
    return null;
  };

  const handleSlotClick = (slot: number) => {
    if (selectedPiece === null || isAllFinished) return;
    if (placed[slot] !== undefined) return;
    if (selectedPiece === slot) {
      soundManager.playSuccess();
      soundManager.speak('Yes! That piece fits!');
      const nextPlaced = { ...placed, [slot]: selectedPiece };
      setPlaced(nextPlaced);
      setSelectedPiece(null);
      if (Object.keys(nextPlaced).length === scene.pieces.length) {
        const nextDone = scenesDone + 1;
        setScenesDone(nextDone);
        setTimeout(() => {
          if (nextDone === SCENES.length) {
            onCollectStar();
            setIsAllFinished(true);
            soundManager.playCelebration();
            soundManager.speak('Wonderful! You finished all the puzzles!');
          } else {
            soundManager.speak('Great puzzle! Here is a bigger one!');
            const nextScene = sceneIndex + 1;
            setSceneIndex(nextScene);
            setPlaced({});
            setTrayOrder(shuffle(SCENES[nextScene].pieces.map((_, i) => i)));
          }
        }, 900);
      }
    } else {
      soundManager.playError();
      soundManager.speak('That piece does not fit here. Try another spot!');
      setWrongSlot(slot);
      setTimeout(() => setWrongSlot(null), 700);
    }
  };

  const handlePlayAgain = () => {
    soundManager.playPop();
    soundManager.speak("Let's solve the puzzles again!");
    setSceneIndex(0);
    setTrayOrder(shuffle(SCENES[0].pieces.map((_, i) => i)));
    setPlaced({});
    setSelectedPiece(null);
    setWrongSlot(null);
    setScenesDone(0);
    setIsAllFinished(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center p-2 sm:p-4">
      {/* Top Banner Header */}
      <div className="w-full bg-white/90 backdrop-blur-md border-4 border-emerald-300 rounded-3xl p-3 sm:p-4 shadow-lg mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-emerald-100 px-3 py-1.5 rounded-2xl border-2 border-emerald-300">
            <span className="text-xl">🧩</span>
            <h1 className="text-base sm:text-xl font-black text-emerald-950 uppercase tracking-wide">
              Jigsaw Puzzle
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-blue-100 text-blue-900 font-black text-xs sm:text-sm px-3 py-1.5 rounded-2xl border-2 border-blue-300 flex items-center gap-1">
            <span>
              Puzzles: {scenesDone} / {SCENES.length}
            </span>
          </div>
          <div className="bg-amber-400 text-amber-950 font-black text-xs sm:text-sm px-3 py-1.5 rounded-2xl border-2 border-amber-300 flex items-center gap-1 shadow-xs">
            <StarIcon className="w-4 h-4 fill-amber-100 stroke-amber-950" />
            <span>{scenesDone === SCENES.length || isActivityCompleted ? 1 : 0}</span>
          </div>
        </div>
      </div>

      {/* Main Activity Card */}
      <div className="w-full bg-gradient-to-br from-emerald-100 via-teal-50 to-cyan-100 border-4 border-emerald-400 rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col items-center relative overflow-hidden min-h-[420px] justify-between">
        <div className="text-center mt-1 mb-3">
          <div className="inline-flex items-center gap-2 bg-white px-6 py-2 rounded-full border-4 border-emerald-300 shadow-md mb-1">
            <button
              type="button"
              onClick={() => soundManager.speak(`Tap a puzzle piece, then tap the right spot to make the ${scene.title}!`)}
              className="p-1 bg-emerald-100 hover:bg-emerald-200 rounded-full text-emerald-900 transition-transform active:scale-90 cursor-pointer"
            >
              <Volume2 className="w-5 h-5" />
            </button>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight uppercase">
              {scene.emoji} {scene.title} Puzzle
            </h2>
          </div>
          <p className="text-xs sm:text-sm font-black text-slate-600 uppercase tracking-wide">
            Tap a piece, then tap the right spot! ({placedCount} / {scene.pieces.length} placed)
          </p>
        </div>

        {!isAllFinished ? (
          <div className="w-full max-w-2xl flex flex-col items-center gap-5 my-auto">
            {/* Puzzle board */}
            <div
              className="grid gap-2 bg-white rounded-3xl border-4 border-emerald-300 shadow-xl p-3"
              style={{ gridTemplateColumns: `repeat(${scene.cols}, minmax(0, 1fr))` }}
            >
              {scene.pieces.map((emoji, slot) => {
                const placedPiece = placed[slot];
                const isWrong = wrongSlot === slot;
                return (
                  <motion.button
                    key={slot}
                    type="button"
                    onClick={() => handleSlotClick(slot)}
                    whileHover={{ scale: placedPiece !== undefined ? 1 : 1.05 }}
                    whileTap={{ scale: placedPiece !== undefined ? 1 : 0.95 }}
                    disabled={placedPiece !== undefined}
                    className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-4 flex items-center justify-center text-5xl sm:text-6xl select-none cursor-pointer ${
                      placedPiece !== undefined
                        ? 'bg-emerald-50 border-emerald-400'
                        : isWrong
                        ? 'bg-rose-50 border-rose-400'
                        : 'bg-slate-100 border-dashed border-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    {placedPiece !== undefined ? scene.pieces[placedPiece] : <span className="text-3xl text-slate-400">?</span>}
                  </motion.button>
                );
              })}
            </div>

            {/* Pieces tray */}
            <div>
              <p className="text-center text-sm font-black text-emerald-900 uppercase mb-2">🧩 Pieces</p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {trayOrder.map((pieceIndex) => {
                  const isPlaced = placedSlotOf(pieceIndex) !== null;
                  const isSelected = selectedPiece === pieceIndex;
                  return (
                    <motion.button
                      key={pieceIndex}
                      type="button"
                      onClick={() => handlePieceClick(pieceIndex)}
                      whileHover={{ scale: isPlaced ? 1 : 1.1 }}
                      whileTap={{ scale: isPlaced ? 1 : 0.92 }}
                      disabled={isPlaced}
                      className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border-4 flex items-center justify-center text-4xl sm:text-5xl select-none shadow-lg cursor-pointer ${
                        isPlaced
                          ? 'bg-emerald-100 border-emerald-300 opacity-40'
                          : isSelected
                          ? 'bg-amber-300 border-amber-500 ring-4 ring-amber-200'
                          : 'bg-white border-emerald-300 hover:bg-emerald-50'
                      }`}
                    >
                      {scene.pieces[pieceIndex]}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* Completion Screen */
          <div className="flex flex-col items-center justify-center text-center my-auto p-6 bg-white/90 backdrop-blur-md rounded-3xl border-4 border-emerald-400 shadow-xl max-w-lg">
            <div className="text-6xl mb-3 animate-bounce">🎉</div>
            <h3 className="text-2xl sm:text-3xl font-black text-emerald-950 uppercase mb-2">
              Puzzles Complete!
            </h3>
            <div className="flex items-center gap-1.5 bg-amber-200 border-2 border-amber-400 px-4 py-1.5 rounded-full mb-3">
              <StarIcon className="w-5 h-5 fill-amber-400 text-amber-600" />
              <span className="font-black text-amber-950 text-sm">Star Earned!</span>
            </div>
            <p className="text-base font-bold text-slate-700 mb-5">
              You finished all the puzzles! You are a puzzle master!
            </p>
            <button
              type="button"
              onClick={handlePlayAgain}
              className="flex items-center justify-center gap-2 bg-[#4D96FF] hover:bg-blue-500 text-white font-black py-3.5 px-8 rounded-2xl border-b-6 border-[#2563EB] shadow-lg active:border-b-2 active:translate-y-1 transition-all cursor-pointer text-base sm:text-lg uppercase"
            >
              <RotateCcw className="w-5 h-5 stroke-[3]" />
              <span>Play Again</span>
            </button>
          </div>
        )}
      </div>

      <ActivityBottomNav
        onNavigatePrev={onNavigatePrev}
        onNavigateHome={onNavigateHome}
        onNavigateNext={onNavigateNext}
        isNextUnlocked={isAllFinished || isActivityCompleted}
      />
    </div>
  );
};
