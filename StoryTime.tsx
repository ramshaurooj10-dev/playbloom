import React, { useState } from 'react';
import { motion } from 'motion/react';
import { RotateCcw, Volume2, Star as StarIcon, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { ActivityBottomNav } from './ActivityBottomNav';
import { STORIES } from '../../data/stories';

interface StoryTimeProps {
  onCollectStar: () => void;
  onNavigateHome?: () => void;
  onNavigateNext?: () => void;
  onNavigatePrev?: () => void;
  isActivityCompleted?: boolean;
}

export const StoryTime: React.FC<StoryTimeProps> = ({
  onCollectStar,
  onNavigateHome,
  onNavigateNext,
  onNavigatePrev,
  isActivityCompleted = false,
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [screenIndex, setScreenIndex] = useState(0);
  const [finishedIds, setFinishedIds] = useState<Set<string>>(new Set());
  const [isAllFinished, setIsAllFinished] = useState(false);

  const selected = STORIES.find((s) => s.id === selectedId) || null;
  const currentScreen = selected ? selected.screens[screenIndex] : null;
  const isLastScreen = selected ? screenIndex >= selected.screens.length - 1 : false;

  const handleSelectStory = (id: string, title: string) => {
    soundManager.playPop();
    soundManager.speak(title);
    setSelectedId(id);
    setScreenIndex(0);
  };

  const handleFinishStory = () => {
    if (!selected) return;
    soundManager.playSuccess();
    setFinishedIds((prev) => {
      if (prev.has(selected.id)) return prev;
      const next = new Set(prev);
      next.add(selected.id);
      if (next.size === STORIES.length) {
        onCollectStar();
        setTimeout(() => {
          setIsAllFinished(true);
          soundManager.playCelebration();
          soundManager.speak('Wonderful! You read all the stories!');
        }, 800);
      } else {
        soundManager.speak('Great story! Pick another one!');
      }
      return next;
    });
    setSelectedId(null);
    setScreenIndex(0);
  };

  const handlePlayAgain = () => {
    soundManager.playPop();
    soundManager.speak("Let's read the stories again!");
    setSelectedId(null);
    setScreenIndex(0);
    setFinishedIds(new Set());
    setIsAllFinished(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center p-2 sm:p-4">
      {/* Top Banner Header */}
      <div className="w-full bg-white/90 backdrop-blur-md border-4 border-amber-300 rounded-3xl p-3 sm:p-4 shadow-lg mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-amber-100 px-3 py-1.5 rounded-2xl border-2 border-amber-300">
            <span className="text-xl">📖</span>
            <h1 className="text-base sm:text-xl font-black text-amber-950 uppercase tracking-wide">
              Story Time
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-blue-100 text-blue-900 font-black text-xs sm:text-sm px-3 py-1.5 rounded-2xl border-2 border-blue-300 flex items-center gap-1">
            <span>
              Stories: {finishedIds.size} / {STORIES.length}
            </span>
          </div>
          <div className="bg-amber-400 text-amber-950 font-black text-xs sm:text-sm px-3 py-1.5 rounded-2xl border-2 border-amber-300 flex items-center gap-1 shadow-xs">
            <StarIcon className="w-4 h-4 fill-amber-100 stroke-amber-950" />
            <span>{finishedIds.size === STORIES.length || isActivityCompleted ? 1 : 0}</span>
          </div>
        </div>
      </div>

      {/* Main Activity Card */}
      <div className="w-full bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-100 border-4 border-amber-400 rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col items-center relative overflow-hidden min-h-[420px] justify-between">
        <div className="text-center mt-1 mb-3">
          <div className="inline-flex items-center gap-2 bg-white px-6 py-2 rounded-full border-4 border-amber-300 shadow-md mb-1">
            <button
              type="button"
              onClick={() => soundManager.speak('Pick a story to read!')}
              className="p-1 bg-amber-100 hover:bg-amber-200 rounded-full text-amber-900 transition-transform active:scale-90 cursor-pointer"
            >
              <Volume2 className="w-5 h-5" />
            </button>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight uppercase">
              {selected ? selected.title : 'Pick a story to read!'}
            </h2>
          </div>
          <p className="text-xs sm:text-sm font-black text-slate-600 uppercase tracking-wide">
            Tap the speaker to hear the story read aloud!
          </p>
        </div>

        {!isAllFinished ? (
          selected && currentScreen ? (
            /* Story Reader */
            <div className="w-full max-w-2xl flex flex-col items-center gap-4 my-auto">
              <motion.div
                key={`${selected.id}-${screenIndex}`}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full bg-white rounded-3xl border-4 border-amber-300 shadow-xl p-6 sm:p-8 flex flex-col items-center gap-4"
              >
                <span className="text-7xl sm:text-8xl select-none drop-shadow">{currentScreen.emoji}</span>
                <p className="text-xl sm:text-2xl font-bold text-slate-800 text-center leading-relaxed">
                  {currentScreen.text}
                </p>
                <button
                  type="button"
                  onClick={() => soundManager.speak(currentScreen.text)}
                  className="flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-amber-950 font-black py-2.5 px-6 rounded-2xl border-b-4 border-amber-600 shadow active:border-b-2 active:translate-y-0.5 transition-all cursor-pointer text-sm sm:text-base uppercase"
                >
                  <Volume2 className="w-5 h-5 stroke-[3]" />
                  <span>Read Aloud</span>
                </button>
              </motion.div>

              <div className="flex items-center gap-2">
                {selected.screens.map((_, idx) => (
                  <span
                    key={idx}
                    className={`w-3 h-3 rounded-full border-2 ${
                      idx === screenIndex ? 'bg-amber-500 border-amber-600' : 'bg-white border-amber-300'
                    }`}
                  />
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                {screenIndex > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playPop();
                      setScreenIndex(screenIndex - 1);
                    }}
                    className="flex items-center gap-1 bg-white hover:bg-amber-50 text-amber-950 font-black py-3 px-5 rounded-2xl border-b-6 border-amber-300 shadow-lg active:border-b-2 active:translate-y-1 transition-all cursor-pointer text-base uppercase"
                  >
                    <ChevronLeft className="w-5 h-5 stroke-[3]" />
                    <span>Back</span>
                  </button>
                )}
                {!isLastScreen ? (
                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playPop();
                      setScreenIndex(screenIndex + 1);
                    }}
                    className="flex items-center gap-1 bg-[#6BCB77] hover:bg-emerald-500 text-white font-black py-3 px-6 rounded-2xl border-b-6 border-[#16A34A] shadow-lg active:border-b-2 active:translate-y-1 transition-all cursor-pointer text-base uppercase"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-5 h-5 stroke-[3]" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleFinishStory}
                    className="flex items-center gap-2 bg-[#6BCB77] hover:bg-emerald-500 text-white font-black py-3 px-6 rounded-2xl border-b-6 border-[#16A34A] shadow-lg active:border-b-2 active:translate-y-1 transition-all cursor-pointer text-base uppercase"
                  >
                    <span>🎉 Finish Story</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Story List */
            <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 my-auto p-1">
              {STORIES.map((story) => (
                <motion.button
                  key={story.id}
                  type="button"
                  onClick={() => handleSelectStory(story.id, story.title)}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative flex flex-col items-center gap-2 rounded-3xl border-4 p-5 sm:p-6 shadow-lg cursor-pointer ${
                    finishedIds.has(story.id)
                      ? 'bg-emerald-50 border-emerald-400'
                      : 'bg-white border-amber-300 hover:bg-amber-50'
                  }`}
                >
                  <span className="text-6xl sm:text-7xl select-none drop-shadow-xs">{story.emoji}</span>
                  <span className="text-base sm:text-lg font-black text-slate-800 text-center leading-tight">
                    {story.title}
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    {story.screens.length} pages
                  </span>
                  <span className="flex items-center gap-1 bg-amber-500 text-white font-black text-xs px-3 py-1.5 rounded-full">
                    <BookOpen className="w-3 h-3 stroke-[3]" /> Read
                  </span>
                  {finishedIds.has(story.id) && (
                    <span className="absolute top-2 right-2 bg-emerald-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow">
                      ✓
                    </span>
                  )}
                </motion.button>
              ))}
            </div>
          )
        ) : (
          /* Completion Screen */
          <div className="flex flex-col items-center justify-center text-center my-auto p-6 bg-white/90 backdrop-blur-md rounded-3xl border-4 border-amber-400 shadow-xl max-w-lg">
            <div className="text-6xl mb-3 animate-bounce">🎉</div>
            <h3 className="text-2xl sm:text-3xl font-black text-amber-950 uppercase mb-2">
              Story Time Complete!
            </h3>
            <div className="flex items-center gap-1.5 bg-amber-200 border-2 border-amber-400 px-4 py-1.5 rounded-full mb-3">
              <StarIcon className="w-5 h-5 fill-amber-400 text-amber-600" />
              <span className="font-black text-amber-950 text-sm">Star Earned!</span>
            </div>
            <p className="text-base font-bold text-slate-700 mb-5">
              You read all the stories! What a great little reader you are!
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
