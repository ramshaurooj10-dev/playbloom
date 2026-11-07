import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { RotateCcw, Volume2, Star as StarIcon, Check } from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { PREMIUM_ACTIVITIES } from '../../data/activitiesList';
import { ActivityBottomNav } from './ActivityBottomNav';

interface GenericPremiumActivityProps {
  activityId: string;
  onCollectStar: () => void;
  onNavigateHome?: () => void;
  onNavigateNext?: () => void;
  onNavigatePrev?: () => void;
}

export const GenericPremiumActivity: React.FC<GenericPremiumActivityProps> = ({
  activityId,
  onCollectStar,
  onNavigateHome,
  onNavigateNext,
  onNavigatePrev,
}) => {
  const activityInfo = PREMIUM_ACTIVITIES.find((a) => a.id === activityId) || {
    id: activityId,
    title: 'Premium Learning Activity',
    emoji: '🌟',
  };

  const [currentRound, setCurrentRound] = useState(1);
  const [starsEarned, setStarsEarned] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [shakeIndex, setShakeIndex] = useState<number | null>(null);
  const [isRoundFinished, setIsRoundFinished] = useState(false);
  const [isAllFinished, setIsAllFinished] = useState(false);

  useEffect(() => {
    soundManager.speak(`${activityInfo.title}! Tap the target!`);
  }, [currentRound, activityId]);

  const handleShuffleReplay = () => {
    soundManager.playPop();
    soundManager.speak(`Replaying ${activityInfo.title}!`);
    setCurrentRound(1);
    setSelectedOption(null);
    setIsCorrect(null);
    setShakeIndex(null);
    setIsRoundFinished(false);
    setIsAllFinished(false);
  };

  const handleSelectOption = (index: number) => {
    if (isRoundFinished || isAllFinished) return;

    setSelectedOption(index);
    // Option 0 is correct for testing
    const correct = index === 0;

    if (correct) {
      soundManager.playSuccess();
      soundManager.speak(`Great job! That is correct!`);
      setIsCorrect(true);
      setIsRoundFinished(true);
      setStarsEarned((prev) => prev + 1);
      onCollectStar();

      if (currentRound === 8) {
        setTimeout(() => {
          setIsAllFinished(true);
          soundManager.playCelebration();
          soundManager.speak(`Fantastic! You completed ${activityInfo.title}!`);
        }, 1200);
      } else {
        setTimeout(() => {
          handleNextRound();
        }, 1200);
      }
    } else {
      soundManager.playPop();
      soundManager.speak(`Oops, try again!`);
      setIsCorrect(false);
      setShakeIndex(index);
      setTimeout(() => {
        setShakeIndex(null);
        setSelectedOption(null);
        setIsCorrect(null);
      }, 900);
    }
  };

  const handleNextRound = () => {
    soundManager.playPop();
    if (currentRound < 8) {
      setCurrentRound((prev) => prev + 1);
      setSelectedOption(null);
      setIsCorrect(null);
      setShakeIndex(null);
      setIsRoundFinished(false);
    } else {
      setIsAllFinished(true);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center p-2 sm:p-4">
      {/* Top Banner Header: Title, Progress & Star Counts ONLY */}
      <div className="w-full bg-white/90 backdrop-blur-md border-4 border-amber-300 rounded-3xl p-3 sm:p-4 shadow-lg mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-amber-100 px-3 py-1.5 rounded-2xl border-2 border-amber-300">
            <span className="text-xl">{activityInfo.emoji}</span>
            <h1 className="text-base sm:text-xl font-black text-amber-950 uppercase tracking-wide">
              {activityInfo.title}
            </h1>
          </div>
        </div>

        {/* Stars & Progress Badges */}
        <div className="flex items-center gap-2">
          <div className="bg-blue-100 text-blue-900 font-black text-xs sm:text-sm px-3 py-1.5 rounded-2xl border-2 border-blue-300 flex items-center gap-1">
            <span>{currentRound} / 8</span>
          </div>

          <div className="bg-amber-400 text-amber-950 font-black text-xs sm:text-sm px-3 py-1.5 rounded-2xl border-2 border-amber-300 flex items-center gap-1 shadow-xs">
            <StarIcon className="w-4 h-4 fill-amber-100 stroke-amber-950" />
            <span>{starsEarned}</span>
          </div>
        </div>
      </div>

      {/* Main Activity Card */}
      <div className="w-full bg-gradient-to-br from-amber-50 via-sky-50 to-pink-50 border-4 border-amber-400 rounded-3xl p-4 sm:p-8 shadow-2xl flex flex-col items-center relative overflow-hidden min-h-[420px] justify-between">
        <div className="text-center mt-4 mb-4">
          <div className="inline-flex items-center gap-2 bg-white px-6 py-2.5 rounded-full border-4 border-amber-300 shadow-md mb-2">
            <button
              onClick={() => soundManager.speak(`${activityInfo.title}! Tap the target!`)}
              className="p-1 bg-amber-100 hover:bg-amber-200 rounded-full text-amber-900 transition-transform active:scale-90"
            >
              <Volume2 className="w-5 h-5" />
            </button>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
              {activityInfo.title}
            </h2>
          </div>
          <p className="text-xs sm:text-sm font-black text-slate-600 uppercase tracking-wide">
            Tap the correct item!
          </p>
        </div>

        {!isAllFinished ? (
          <div className="w-full max-w-xl grid grid-cols-2 gap-4 my-auto">
            {/* Option 0 (Correct) */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              animate={shakeIndex === 0 ? { x: [-10, 10, -10, 10, 0] } : {}}
              onClick={() => handleSelectOption(0)}
              className={`bg-white border-4 rounded-3xl p-6 shadow-xl flex flex-col items-center justify-center cursor-pointer relative ${
                selectedOption === 0 && isCorrect
                  ? 'border-emerald-500 bg-emerald-50 ring-4 ring-emerald-300'
                  : 'border-amber-300 hover:border-amber-400'
              }`}
            >
              <span className="text-6xl mb-2 drop-shadow-xs">{activityInfo.emoji}</span>
              <span className="text-base font-black text-slate-800">Target Item</span>
              {selectedOption === 0 && isCorrect && (
                <div className="absolute top-3 right-3 bg-emerald-500 text-white rounded-full p-2 shadow-md">
                  <Check className="w-5 h-5 stroke-[3]" />
                </div>
              )}
            </motion.button>

            {/* Option 1 (Try Again) */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              animate={shakeIndex === 1 ? { x: [-10, 10, -10, 10, 0] } : {}}
              onClick={() => handleSelectOption(1)}
              className={`bg-white border-4 rounded-3xl p-6 shadow-xl flex flex-col items-center justify-center cursor-pointer relative ${
                selectedOption === 1 && isCorrect === false
                  ? 'border-rose-500 bg-rose-50'
                  : 'border-amber-300 hover:border-amber-400'
              }`}
            >
              <span className="text-6xl mb-2 opacity-60 drop-shadow-xs">❓</span>
              <span className="text-base font-black text-slate-800">Other Item</span>
            </motion.button>
          </div>
        ) : (
          /* Completion Screen with PLAY AGAIN button */
          <div className="flex flex-col items-center justify-center text-center my-auto p-6 bg-white/90 backdrop-blur-md rounded-3xl border-4 border-amber-400 shadow-xl max-w-lg">
            <div className="text-6xl mb-3 animate-bounce">🎉</div>
            <h3 className="text-2xl sm:text-3xl font-black text-amber-950 uppercase mb-2">
              {activityInfo.title.toUpperCase()} COMPLETE!
            </h3>
            <div className="flex items-center gap-1.5 bg-amber-200 border-2 border-amber-400 px-4 py-1.5 rounded-full mb-3">
              <StarIcon className="w-5 h-5 fill-amber-400 text-amber-600" />
              <span className="font-black text-amber-950 text-sm">Star Earned!</span>
            </div>
            <p className="text-base font-bold text-slate-700 mb-5">
              Great job practicing {activityInfo.title}!
            </p>

            {/* ONLY Replay Button */}
            <button
              type="button"
              onClick={handleShuffleReplay}
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
        isNextUnlocked={isAllFinished}
      />
    </div>
  );
};
