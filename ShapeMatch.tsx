import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, RotateCcw, Volume2, Star as StarIcon, ArrowLeft, ArrowRight, Home } from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface ShapeMatchProps {
  onCollectStar: () => void;
  onNavigateHome?: () => void;
  onNavigateNext?: () => void;
  onNavigatePrev?: () => void;
  isActivityCompleted?: boolean;
}

interface ShapeData {
  id: string;
  name: string;
  colorClass: string;
  fillColor: string;
  bgGradient: string;
  borderColor: string;
  svgPath: (color: string) => React.ReactNode;
}

const SHAPES: ShapeData[] = [
  {
    id: 'circle',
    name: 'Circle',
    colorClass: 'text-rose-500',
    fillColor: '#F43F5E',
    bgGradient: 'from-rose-100 to-red-200',
    borderColor: 'border-rose-400',
    svgPath: (color: string) => (
      <svg viewBox="0 0 100 100" className="w-16 h-16 sm:w-20 sm:h-20 drop-shadow-md">
        <circle cx="50" cy="50" r="40" fill={color} />
      </svg>
    ),
  },
  {
    id: 'square',
    name: 'Square',
    colorClass: 'text-blue-500',
    fillColor: '#3B82F6',
    bgGradient: 'from-sky-100 to-blue-200',
    borderColor: 'border-blue-400',
    svgPath: (color: string) => (
      <svg viewBox="0 0 100 100" className="w-16 h-16 sm:w-20 sm:h-20 drop-shadow-md">
        <rect x="10" y="10" width="80" height="80" rx="16" fill={color} />
      </svg>
    ),
  },
  {
    id: 'triangle',
    name: 'Triangle',
    colorClass: 'text-emerald-500',
    fillColor: '#10B981',
    bgGradient: 'from-emerald-100 to-teal-200',
    borderColor: 'border-emerald-400',
    svgPath: (color: string) => (
      <svg viewBox="0 0 100 100" className="w-16 h-16 sm:w-20 sm:h-20 drop-shadow-md">
        <path d="M50 10 L90 85 Q50 92 10 85 Z" fill={color} strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'star',
    name: 'Star',
    colorClass: 'text-amber-400',
    fillColor: '#F59E0B',
    bgGradient: 'from-amber-100 to-yellow-200',
    borderColor: 'border-amber-400',
    svgPath: (color: string) => (
      <svg viewBox="0 0 100 100" className="w-16 h-16 sm:w-20 sm:h-20 drop-shadow-md">
        <polygon
          points="50,5 64,36 98,36 70,57 81,91 50,70 19,91 30,57 2,36 36,36"
          fill={color}
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

const generateShuffledShapes = (prevShapes?: ShapeData[]) => {
  let shuffled = [...SHAPES].sort(() => Math.random() - 0.5);
  if (prevShapes && prevShapes.length > 0) {
    const prevIds = prevShapes.map((s) => s.id).join(',');
    let attempts = 0;
    while (shuffled.map((s) => s.id).join(',') === prevIds && attempts < 20) {
      shuffled = [...SHAPES].sort(() => Math.random() - 0.5);
      attempts++;
    }
  }
  return shuffled;
};

export const ShapeMatch: React.FC<ShapeMatchProps> = ({
  onCollectStar,
  onNavigateHome,
  onNavigateNext,
  onNavigatePrev,
  isActivityCompleted,
}) => {
  const [leftShapes, setLeftShapes] = useState<ShapeData[]>(() => generateShuffledShapes());
  const [rightShapes, setRightShapes] = useState<ShapeData[]>(() => generateShuffledShapes(leftShapes));
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [shakingOutlineId, setShakingOutlineId] = useState<string | null>(null);
  const [celebratingId, setCelebratingId] = useState<string | null>(null);
  const [celebrationMsg, setCelebrationMsg] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [isGameFinished, setIsGameFinished] = useState(false);

  // Play voice instruction on start
  useEffect(() => {
    soundManager.speak('Choose the matching shape.');
  }, []);

  const handleHearPrompt = () => {
    soundManager.speak('Choose the matching shape.');
  };

  const handleSelectColoredShape = (shape: ShapeData) => {
    if (matchedIds.includes(shape.id)) return;

    soundManager.playPop();
    setSelectedShapeId(shape.id);
    setFeedbackMsg(`Selected ${shape.name}. Now tap its matching outline! 👇`);
    soundManager.speak(shape.name);
  };

  const handleTargetOutlineClick = (outlineShape: ShapeData) => {
    if (matchedIds.includes(outlineShape.id)) return;

    if (!selectedShapeId) {
      // No shape selected yet
      soundManager.playPop();
      setFeedbackMsg('Tap a colored shape on the left first! 👇');
      soundManager.speak('Tap a colored shape first!');
      return;
    }

    if (selectedShapeId === outlineShape.id) {
      // Correct Match!
      const newMatched = [...matchedIds, outlineShape.id];
      setMatchedIds(newMatched);
      setCelebratingId(outlineShape.id);
      setSelectedShapeId(null);
      setCelebrationMsg('Great job! 🎉');
      setFeedbackMsg(null);
      soundManager.playSuccess();
      soundManager.speak('Great job!');

      setTimeout(() => {
        setCelebratingId(null);
        setCelebrationMsg(null);

        if (newMatched.length === SHAPES.length) {
          setIsGameFinished(true);
          onCollectStar();
          soundManager.playCelebration();
          soundManager.speak('Great job! You matched all the shapes!');
        }
      }, 1500);
    } else {
      // Wrong Match!
      setShakingOutlineId(outlineShape.id);
      setFeedbackMsg('Try again! 🌸');
      soundManager.playError();
      soundManager.speak('Try again!');

      setTimeout(() => {
        setShakingOutlineId(null);
      }, 600);
    }
  };

  const handleRestart = () => {
    soundManager.playPop();
    const newLeft = generateShuffledShapes(leftShapes);
    const newRight = generateShuffledShapes(rightShapes);
    setLeftShapes(newLeft);
    setRightShapes(newRight);
    setMatchedIds([]);
    setSelectedShapeId(null);
    setShakingOutlineId(null);
    setCelebratingId(null);
    setCelebrationMsg(null);
    setFeedbackMsg(null);
    setIsGameFinished(false);
    soundManager.speak('Match the shapes!');
  };

  // Step-by-step previous navigation handler
  const handleInternalPrev = () => {
    soundManager.playPop();
    if (isGameFinished) {
      setIsGameFinished(false);
    } else if (matchedIds.length > 0) {
      setMatchedIds((prev) => prev.slice(0, prev.length - 1));
      setSelectedShapeId(null);
      setShakingOutlineId(null);
      setCelebratingId(null);
    } else {
      if (onNavigatePrev) {
        onNavigatePrev();
      }
    }
  };

  return (
    <div id="activity-shape-match" className="w-full max-w-4xl mx-auto p-4 sm:p-6 select-none">
      {/* Scene Container */}
      <div className="relative bg-gradient-to-b from-amber-100 via-orange-50 to-pink-100 rounded-3xl border-8 border-white shadow-2xl p-5 sm:p-8 overflow-hidden">
        {/* Background Decorative Shapes */}
        <div className="absolute top-3 left-4 text-3xl opacity-20 pointer-events-none">🔷</div>
        <div className="absolute top-4 right-6 text-3xl opacity-20 pointer-events-none">⭐</div>
        <div className="absolute bottom-4 left-6 text-4xl opacity-15 pointer-events-none">🔴</div>
        <div className="absolute bottom-3 right-8 text-3xl opacity-20 pointer-events-none">✨</div>

        {!isGameFinished ? (
          <>
            {/* Header & Instructions */}
            <div className="text-center mb-6 relative z-10">
              <div className="inline-flex items-center gap-2 bg-orange-600 text-white font-black text-xs sm:text-sm px-4 py-1 rounded-full shadow-md mb-2 uppercase tracking-wide">
                <span>Shape Match</span>
                <span className="bg-orange-800 px-2 py-0.5 rounded-full text-[10px]">
                  {matchedIds.length} / {SHAPES.length} Matched
                </span>
              </div>

              {/* Main Prompt Banner */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white/90 backdrop-blur-sm border-4 border-orange-300 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3 max-w-2xl mx-auto"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-amber-200 to-orange-300 rounded-2xl border-3 border-amber-400 flex items-center justify-center text-3xl sm:text-4xl shadow-inner animate-bounce">
                    🔷
                  </div>
                  <div className="text-left">
                    <h2 className="text-2xl sm:text-3xl font-black text-orange-950">
                      Match the <span className="text-orange-600 font-extrabold underline">Shapes</span>!
                    </h2>
                    <p className="text-xs sm:text-sm font-bold text-orange-700">
                      Tap a colored shape on the left, then tap its outline! 👇
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleHearPrompt}
                  className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-black text-xs sm:text-sm px-4 py-2.5 rounded-xl border-b-4 border-orange-700 shadow-md cursor-pointer transition-all"
                  title="Listen to instruction"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Listen</span>
                </button>
              </motion.div>

              {/* Feedback Message */}
              {feedbackMsg && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 text-sm sm:text-base font-black text-amber-900 bg-amber-100 border-2 border-amber-300 rounded-full py-1 px-4 inline-block shadow-sm"
                >
                  {feedbackMsg}
                </motion.p>
              )}
            </div>

            {/* 2-Column Matching Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto relative z-10">
              {/* Left Side: Full Colored Shapes */}
              <div className="bg-white/80 backdrop-blur-xs p-4 sm:p-5 rounded-3xl border-4 border-amber-300 shadow-md">
                <h3 className="text-center font-black text-amber-950 text-base sm:text-lg mb-4 flex items-center justify-center gap-2">
                  <span>🎨</span> Colored Shapes
                </h3>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {leftShapes.map((shape) => {
                    const isMatched = matchedIds.includes(shape.id);
                    const isSelected = selectedShapeId === shape.id;

                    return (
                      <motion.button
                        key={shape.id}
                        type="button"
                        disabled={isMatched}
                        onClick={() => handleSelectColoredShape(shape)}
                        whileHover={!isMatched ? { scale: 1.05 } : {}}
                        whileTap={!isMatched ? { scale: 0.92 } : {}}
                        animate={
                          isSelected
                            ? { scale: [1, 1.08, 1], transition: { repeat: Infinity, duration: 1 } }
                            : { scale: 1 }
                        }
                        className={`p-4 sm:p-5 rounded-2xl border-b-6 shadow-md flex flex-col items-center justify-center gap-2 transition-all min-h-[120px] sm:min-h-[140px] ${
                          isMatched
                            ? 'bg-slate-100 border-slate-300 opacity-40 cursor-not-allowed'
                            : isSelected
                            ? 'bg-amber-200 border-amber-500 ring-4 ring-orange-400 ring-offset-2 cursor-pointer'
                            : `bg-gradient-to-b ${shape.bgGradient} ${shape.borderColor} cursor-pointer hover:brightness-105`
                        }`}
                      >
                        {shape.svgPath(shape.fillColor)}
                        <span className="text-sm sm:text-base font-black text-slate-800">
                          {shape.name}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Right Side: Matching Outlines / Shadows */}
              <div className="bg-white/80 backdrop-blur-xs p-4 sm:p-5 rounded-3xl border-4 border-orange-300 shadow-md">
                <h3 className="text-center font-black text-orange-950 text-base sm:text-lg mb-4 flex items-center justify-center gap-2">
                  <span>🖼️</span> Shape Outlines
                </h3>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {rightShapes.map((shape) => {
                    const isMatched = matchedIds.includes(shape.id);
                    const isShaking = shakingOutlineId === shape.id;
                    const isCelebrating = celebratingId === shape.id;

                    return (
                      <div key={shape.id} className="relative">
                        <motion.button
                          type="button"
                          onClick={() => handleTargetOutlineClick(shape)}
                          whileHover={!isMatched ? { scale: 1.03 } : {}}
                          whileTap={!isMatched ? { scale: 0.95 } : {}}
                          animate={
                            isCelebrating
                              ? { scale: [1, 1.15, 0.95, 1.1, 1], rotate: [0, -5, 5, -3, 0] }
                              : isShaking
                              ? { x: [-10, 10, -8, 8, -4, 4, 0] }
                              : { scale: 1, x: 0 }
                          }
                          transition={{ duration: isCelebrating ? 0.6 : isShaking ? 0.4 : 0.2 }}
                          className={`w-full p-4 sm:p-5 rounded-2xl border-4 border-dashed transition-all flex flex-col items-center justify-center gap-2 min-h-[120px] sm:min-h-[140px] cursor-pointer ${
                            isMatched
                              ? `bg-gradient-to-b ${shape.bgGradient} ${shape.borderColor} border-solid shadow-md`
                              : 'bg-slate-50 border-slate-300 hover:border-orange-400 hover:bg-orange-50'
                          }`}
                        >
                          {isMatched ? (
                            shape.svgPath(shape.fillColor)
                          ) : (
                            /* Outline silhouette rendering */
                            shape.svgPath('#CBD5E1')
                          )}

                          <span className={`text-sm sm:text-base font-black ${isMatched ? 'text-slate-800' : 'text-slate-400'}`}>
                            {shape.name}
                          </span>
                        </motion.button>

                        {/* Sparkle Overlay on Match */}
                        <AnimatePresence>
                          {isCelebrating && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={{ opacity: 1, scale: 1.2 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              className="absolute inset-0 pointer-events-none flex items-center justify-center"
                            >
                              <Sparkles className="w-12 h-12 text-yellow-400 animate-spin" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Celebration Popup Banner */}
            <AnimatePresence>
              {celebrationMsg && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -20 }}
                  className="mt-6 text-center z-20"
                >
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-lg sm:text-xl px-6 py-3 rounded-2xl border-4 border-white shadow-2xl">
                    <Sparkles className="w-6 h-6 text-yellow-300" />
                    <span>{celebrationMsg}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          /* Completion Screen */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8 sm:py-12 relative z-10"
          >
            <div className="w-24 h-24 bg-yellow-300 rounded-full border-4 border-yellow-500 mx-auto flex items-center justify-center text-5xl shadow-xl mb-4 animate-bounce">
              🏆
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-orange-950 mb-2">
              Shape Match Master!
            </h2>
            <p className="text-base sm:text-lg font-bold text-orange-800 mb-6 max-w-md mx-auto">
              Hooray! You matched all the shapes perfectly! 🌟
            </p>

            <div className="flex items-center justify-center gap-2 mb-8">
              {[...Array(6)].map((_, i) => (
                <StarIcon key={i} className="w-8 h-8 text-yellow-400 fill-yellow-400 drop-shadow-md animate-pulse" />
              ))}
            </div>

            <button
              type="button"
              onClick={handleRestart}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 active:scale-95 text-white font-black text-lg px-8 py-4 rounded-2xl border-b-6 border-emerald-800 shadow-xl cursor-pointer transition-all"
            >
              <RotateCcw className="w-6 h-6" />
              <span>Play Again</span>
            </button>
          </motion.div>
        )}
      </div>

      {/* Child-Friendly Navigation Controls */}
      <div className="w-full max-w-2xl mt-6 grid grid-cols-3 gap-3 sm:gap-6">
        {/* Previous Button */}
        <button
          type="button"
          onClick={handleInternalPrev}
          className="flex items-center justify-center gap-2 bg-[#4D96FF] hover:bg-blue-500 text-white font-black py-4 px-3 sm:px-6 rounded-3xl border-b-8 border-[#2563EB] shadow-xl active:border-b-2 active:translate-y-1.5 transition-all cursor-pointer text-base sm:text-xl uppercase"
        >
          <ArrowLeft className="w-6 h-6 stroke-[3]" />
          <span>PREV</span>
        </button>

        {/* Home Button */}
        <button
          type="button"
          onClick={() => {
            soundManager.playPop();
            if (onNavigateHome) onNavigateHome();
          }}
          className="flex items-center justify-center gap-2 bg-[#F7D060] hover:bg-amber-400 text-amber-950 font-black py-4 px-3 sm:px-6 rounded-3xl border-b-8 border-[#CA8A04] shadow-xl active:border-b-2 active:translate-y-1.5 transition-all cursor-pointer text-base sm:text-xl uppercase"
        >
          <Home className="w-6 h-6 stroke-[3]" />
          <span>HOME</span>
        </button>

        {/* Next Button */}
        <button
          type="button"
          onClick={() => {
            if (isGameFinished || isActivityCompleted) {
              soundManager.playPop();
              if (onNavigateNext) onNavigateNext();
            } else {
              soundManager.playPop();
              soundManager.speak('Match all shapes to unlock next!');
            }
          }}
          className={`flex items-center justify-center gap-2 font-black py-4 px-3 sm:px-6 rounded-3xl shadow-xl transition-all text-base sm:text-xl uppercase ${
            isGameFinished || isActivityCompleted
              ? 'bg-[#6BCB77] hover:bg-emerald-500 text-white border-b-8 border-[#16A34A] active:border-b-2 active:translate-y-1.5 cursor-pointer'
              : 'bg-slate-300 text-slate-500 border-b-4 border-slate-400 cursor-not-allowed opacity-70'
          }`}
        >
          <span>NEXT</span>
          <ArrowRight className="w-6 h-6 stroke-[3]" />
        </button>
      </div>
    </div>
  );
};

