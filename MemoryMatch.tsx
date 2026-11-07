import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { RotateCcw, Volume2, Star as StarIcon, Check } from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { ActivityBottomNav } from './ActivityBottomNav';

interface MemoryMatchProps {
  onCollectStar: () => void;
  onNavigateHome?: () => void;
  onNavigateNext?: () => void;
  onNavigatePrev?: () => void;
  isActivityCompleted?: boolean;
}

interface CardItem {
  id: string; // unique instance ID (e.g. 'rabbit_1', 'rabbit_2')
  typeId: string; // object type ID (e.g. 'rabbit')
  name: string;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const OBJECT_POOL = [
  { id: 'rabbit', name: 'Rabbit', emoji: '🐰' },
  { id: 'apple', name: 'Apple', emoji: '🍎' },
  { id: 'star', name: 'Star', emoji: '⭐' },
  { id: 'car', name: 'Car', emoji: '🚗' },
  { id: 'fish', name: 'Fish', emoji: '🐟' },
  { id: 'flower', name: 'Flower', emoji: '🌸' },
  { id: 'balloon', name: 'Balloon', emoji: '🎈' },
  { id: 'teddy', name: 'Teddy Bear', emoji: '🧸' },
  { id: 'strawberry', name: 'Strawberry', emoji: '🍓' },
  { id: 'butterfly', name: 'Butterfly', emoji: '🦋' },
  { id: 'ball', name: 'Soccer Ball', emoji: '⚽' },
  { id: 'cookie', name: 'Cookie', emoji: '🍪' },
];

const GRADIENTS = [
  'from-sky-100 via-indigo-50 to-purple-100',
  'from-amber-100 via-orange-50 to-rose-100',
  'from-emerald-100 via-teal-50 to-cyan-100',
  'from-pink-100 via-purple-50 to-rose-100',
];

const generateShuffledBoard = (): { cards: CardItem[]; bgGradient: string } => {
  // Select 6 random distinct object types from the pool
  const shuffledPool = [...OBJECT_POOL].sort(() => Math.random() - 0.5);
  const selectedObjects = shuffledPool.slice(0, 6);

  // Create 2 cards for each selected object (12 cards total)
  const cards: CardItem[] = [];
  selectedObjects.forEach((obj) => {
    cards.push({
      id: `${obj.id}_a_${Math.random()}`,
      typeId: obj.id,
      name: obj.name,
      emoji: obj.emoji,
      isFlipped: false,
      isMatched: false,
    });
    cards.push({
      id: `${obj.id}_b_${Math.random()}`,
      typeId: obj.id,
      name: obj.name,
      emoji: obj.emoji,
      isFlipped: false,
      isMatched: false,
    });
  });

  // Shuffle card positions
  const shuffledCards = cards.sort(() => Math.random() - 0.5);
  const bgGradient = GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)];

  return { cards: shuffledCards, bgGradient };
};

export const MemoryMatch: React.FC<MemoryMatchProps> = ({
  onCollectStar,
  onNavigateHome,
  onNavigateNext,
  onNavigatePrev,
  isActivityCompleted = false,
}) => {
  const [{ cards, bgGradient }, setBoard] = useState(generateShuffledBoard);
  const [firstFlippedIndex, setFirstFlippedIndex] = useState<number | null>(null);
  const [secondFlippedIndex, setSecondFlippedIndex] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [matchedPairsCount, setMatchedPairsCount] = useState(0);
  const [isAllFinished, setIsAllFinished] = useState(false);

  // Initial spoken instruction
  useEffect(() => {
    if (!isAllFinished) {
      soundManager.speak('Find the matching pairs!');
    }
  }, [isAllFinished]);

  const handlePlayAgain = () => {
    soundManager.playPop();
    soundManager.speak("Let's play Memory Match again!");
    setBoard(generateShuffledBoard());
    setFirstFlippedIndex(null);
    setSecondFlippedIndex(null);
    setIsProcessing(false);
    setMatchedPairsCount(0);
    setIsAllFinished(false);
  };

  const handleCardClick = (index: number) => {
    if (isProcessing || isAllFinished) return;

    const clickedCard = cards[index];
    if (clickedCard.isFlipped || clickedCard.isMatched) return;

    soundManager.playPop();

    // Flip the clicked card
    const updatedCards = [...cards];
    updatedCards[index] = { ...clickedCard, isFlipped: true };
    setBoard((prev) => ({ ...prev, cards: updatedCards }));

    if (firstFlippedIndex === null) {
      // First card flipped
      setFirstFlippedIndex(index);
    } else {
      // Second card flipped
      setSecondFlippedIndex(index);
      setIsProcessing(true);

      const firstCard = updatedCards[firstFlippedIndex];
      const secondCard = updatedCards[index];

      if (firstCard.typeId === secondCard.typeId) {
        // MATCH!
        soundManager.playSuccess();
        soundManager.speak('Great match!');

        setTimeout(() => {
          const matchedCards = [...updatedCards];
          matchedCards[firstFlippedIndex] = { ...firstCard, isMatched: true };
          matchedCards[index] = { ...secondCard, isMatched: true };

          setBoard((prev) => ({ ...prev, cards: matchedCards }));
          setFirstFlippedIndex(null);
          setSecondFlippedIndex(null);
          setIsProcessing(false);

          const newPairsCount = matchedPairsCount + 1;
          setMatchedPairsCount(newPairsCount);

          if (newPairsCount === 6) {
            onCollectStar();
            setTimeout(() => {
              setIsAllFinished(true);
              soundManager.playCelebration();
              soundManager.speak('Fantastic! You found all the matching pairs!');
            }, 1000);
          }
        }, 600);
      } else {
        // NO MATCH
        setTimeout(() => {
          soundManager.speak('Try again! 💛');

          setTimeout(() => {
            const resetCards = [...updatedCards];
            resetCards[firstFlippedIndex] = { ...firstCard, isFlipped: false };
            resetCards[index] = { ...secondCard, isFlipped: false };

            setBoard((prev) => ({ ...prev, cards: resetCards }));
            setFirstFlippedIndex(null);
            setSecondFlippedIndex(null);
            setIsProcessing(false);
          }, 600);
        }, 500);
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center p-2 sm:p-4">
      {/* Top Banner Header: Title, Matched Pairs & Star Count */}
      <div className="w-full bg-white/90 backdrop-blur-md border-4 border-amber-300 rounded-3xl p-3 sm:p-4 shadow-lg mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-amber-100 px-3 py-1.5 rounded-2xl border-2 border-amber-300">
            <span className="text-xl">🃏</span>
            <h1 className="text-base sm:text-xl font-black text-amber-950 uppercase tracking-wide">
              Memory Match
            </h1>
          </div>
        </div>

        {/* Pairs & Star Counter */}
        <div className="flex items-center gap-2">
          <div className="bg-blue-100 text-blue-900 font-black text-xs sm:text-sm px-3 py-1.5 rounded-2xl border-2 border-blue-300 flex items-center gap-1">
            <span>Pairs: {matchedPairsCount} / 6</span>
          </div>

          <div className="bg-amber-400 text-amber-950 font-black text-xs sm:text-sm px-3 py-1.5 rounded-2xl border-2 border-amber-300 flex items-center gap-1 shadow-xs">
            <StarIcon className="w-4 h-4 fill-amber-100 stroke-amber-950" />
            <span>{matchedPairsCount === 6 || isActivityCompleted ? 1 : 0}</span>
          </div>
        </div>
      </div>

      {/* Main Activity Card */}
      <div
        className={`w-full bg-gradient-to-br ${bgGradient} border-4 border-amber-400 rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col items-center relative overflow-hidden min-h-[420px] justify-between transition-colors duration-500`}
      >
        <div className="text-center mt-1 mb-3">
          <div className="inline-flex items-center gap-2 bg-white px-6 py-2 rounded-full border-4 border-amber-300 shadow-md mb-1">
            <button
              type="button"
              onClick={() => soundManager.speak('Find the matching pairs!')}
              className="p-1 bg-amber-100 hover:bg-amber-200 rounded-full text-amber-900 transition-transform active:scale-90 cursor-pointer"
            >
              <Volume2 className="w-5 h-5" />
            </button>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight uppercase">
              FIND THE MATCHING PAIRS!
            </h2>
          </div>
          <p className="text-xs sm:text-sm font-black text-slate-600 uppercase tracking-wide">
            Tap cards to flip them over and match pairs!
          </p>
        </div>

        {!isAllFinished ? (
          /* 4x3 Grid of Memory Cards */
          <div className="w-full max-w-2xl grid grid-cols-3 sm:grid-cols-4 gap-2.5 sm:gap-4 my-auto p-1">
            {cards.map((card, idx) => {
              const isFaceUp = card.isFlipped || card.isMatched;

              return (
                <motion.div
                  key={card.id}
                  className="perspective-1000 h-24 sm:h-32"
                  whileHover={{ scale: card.isMatched ? 1 : 1.04 }}
                  whileTap={{ scale: card.isMatched ? 1 : 0.95 }}
                >
                  <button
                    type="button"
                    onClick={() => handleCardClick(idx)}
                    disabled={isFaceUp || isProcessing}
                    className="w-full h-full relative cursor-pointer focus:outline-none"
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <motion.div
                      animate={{ rotateY: isFaceUp ? 180 : 0 }}
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                      className="w-full h-full relative rounded-2xl sm:rounded-3xl shadow-lg"
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      {/* FRONT (Face Down) */}
                      <div
                        className="absolute inset-0 bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 border-4 border-amber-200 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-md active:bg-amber-400 transition-colors"
                        style={{ backfaceVisibility: 'hidden' }}
                      >
                        <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-amber-200/60 border-2 border-amber-100/80 flex items-center justify-center shadow-inner">
                          <span className="text-2xl sm:text-3xl select-none">⭐</span>
                        </div>
                      </div>

                      {/* BACK (Revealed Picture - STATIC) */}
                      <div
                        className={`absolute inset-0 rounded-2xl sm:rounded-3xl border-4 flex flex-col items-center justify-center shadow-md transition-colors ${
                          card.isMatched
                            ? 'bg-emerald-50 border-emerald-400 ring-4 ring-emerald-200'
                            : 'bg-white border-amber-300'
                        }`}
                        style={{
                          backfaceVisibility: 'hidden',
                          transform: 'rotateY(180deg)',
                        }}
                      >
                        <span className="text-3xl sm:text-5xl select-none drop-shadow-xs">
                          {card.emoji}
                        </span>
                        <span className="text-[10px] sm:text-xs font-black text-slate-700 mt-1 truncate max-w-[90%]">
                          {card.name}
                        </span>

                        {card.isMatched && (
                          <div className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-emerald-500 text-white rounded-full p-1 shadow-sm">
                            <Check className="w-3 h-3 sm:w-4 sm:h-4 stroke-[3]" />
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </button>
                </motion.div>
              );
            })}
          </div>
        ) : (
          /* Completion Screen with PLAY AGAIN button */
          <div className="flex flex-col items-center justify-center text-center my-auto p-6 bg-white/90 backdrop-blur-md rounded-3xl border-4 border-amber-400 shadow-xl max-w-lg">
            <div className="text-6xl mb-3 animate-bounce">🎉</div>
            <h3 className="text-2xl sm:text-3xl font-black text-amber-950 uppercase mb-2">
              MEMORY MATCH COMPLETE!
            </h3>
            <div className="flex items-center gap-1.5 bg-amber-200 border-2 border-amber-400 px-4 py-1.5 rounded-full mb-3">
              <StarIcon className="w-5 h-5 fill-amber-400 text-amber-600" />
              <span className="font-black text-amber-950 text-sm">Star Earned!</span>
            </div>
            <p className="text-base font-bold text-slate-700 mb-5">
              You found all the matching pairs! Your visual memory is amazing!
            </p>

            {/* ONLY Replay Button */}
            <button
              type="button"
              onClick={handlePlayAgain}
              className="flex items-center justify-center gap-2 bg-[#4D96FF] hover:bg-blue-500 text-white font-black py-3.5 px-8 rounded-2xl border-b-6 border-[#2563EB] shadow-lg active:border-b-2 active:translate-y-1 transition-all cursor-pointer text-base sm:text-lg uppercase"
            >
              <RotateCcw className="w-5 h-5 stroke-[3]" />
              <span>PLAY AGAIN</span>
            </button>
          </div>
        )}
      </div>

      {/* SINGLE Bottom Navigation Bar: PREV | HOME | NEXT */}
      <ActivityBottomNav
        onNavigatePrev={onNavigatePrev}
        onNavigateHome={onNavigateHome}
        onNavigateNext={onNavigateNext}
        isNextUnlocked={isAllFinished || isActivityCompleted}
      />
    </div>
  );
};
