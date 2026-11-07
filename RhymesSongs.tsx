import React, { useState } from 'react';
import { motion } from 'motion/react';
import { RotateCcw, Volume2, Star as StarIcon, ExternalLink, Play } from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { ActivityBottomNav } from './ActivityBottomNav';
import { RHYMES } from '../../data/rhymes';

interface RhymesSongsProps {
  onCollectStar: () => void;
  onNavigateHome?: () => void;
  onNavigateNext?: () => void;
  onNavigatePrev?: () => void;
  isActivityCompleted?: boolean;
}

// A driveFileId that still holds a placeholder value (not a real video yet).
const isPlaceholderId = (id?: string) => !id || id.startsWith('REPLACE_');

export const RhymesSongs: React.FC<RhymesSongsProps> = ({
  onCollectStar,
  onNavigateHome,
  onNavigateNext,
  onNavigatePrev,
  isActivityCompleted = false,
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [watchedIds, setWatchedIds] = useState<Set<string>>(new Set());
  const [isAllFinished, setIsAllFinished] = useState(false);

  const selected = RHYMES.find((r) => r.id === selectedId) || null;

  const handleSelectRhyme = (id: string, title: string) => {
    soundManager.playPop();
    soundManager.speak(title);
    setSelectedId(id);
    setWatchedIds((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      if (next.size === RHYMES.length) {
        onCollectStar();
        setTimeout(() => {
          setIsAllFinished(true);
          soundManager.playCelebration();
          soundManager.speak('Amazing! You watched all the rhymes!');
        }, 800);
      }
      return next;
    });
  };

  const handlePlayAgain = () => {
    soundManager.playPop();
    soundManager.speak("Let's sing the rhymes again!");
    setSelectedId(null);
    setWatchedIds(new Set());
    setIsAllFinished(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center p-2 sm:p-4">
      {/* Top Banner Header */}
      <div className="w-full bg-white/90 backdrop-blur-md border-4 border-pink-300 rounded-3xl p-3 sm:p-4 shadow-lg mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-pink-100 px-3 py-1.5 rounded-2xl border-2 border-pink-300">
            <span className="text-xl">🎵</span>
            <h1 className="text-base sm:text-xl font-black text-pink-950 uppercase tracking-wide">
              Rhymes &amp; Songs
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-blue-100 text-blue-900 font-black text-xs sm:text-sm px-3 py-1.5 rounded-2xl border-2 border-blue-300 flex items-center gap-1">
            <span>
              Watched: {watchedIds.size} / {RHYMES.length}
            </span>
          </div>
          <div className="bg-amber-400 text-amber-950 font-black text-xs sm:text-sm px-3 py-1.5 rounded-2xl border-2 border-amber-300 flex items-center gap-1 shadow-xs">
            <StarIcon className="w-4 h-4 fill-amber-100 stroke-amber-950" />
            <span>{watchedIds.size === RHYMES.length || isActivityCompleted ? 1 : 0}</span>
          </div>
        </div>
      </div>

      {/* Main Activity Card */}
      <div className="w-full bg-gradient-to-br from-pink-100 via-rose-50 to-amber-100 border-4 border-pink-400 rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col items-center relative overflow-hidden min-h-[420px] justify-between">
        <div className="text-center mt-1 mb-3">
          <div className="inline-flex items-center gap-2 bg-white px-6 py-2 rounded-full border-4 border-pink-300 shadow-md mb-1">
            <button
              type="button"
              onClick={() => soundManager.speak('Pick a rhyme and watch the video!')}
              className="p-1 bg-pink-100 hover:bg-pink-200 rounded-full text-pink-900 transition-transform active:scale-90 cursor-pointer"
            >
              <Volume2 className="w-5 h-5" />
            </button>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight uppercase">
              {selected ? selected.title : 'Pick a rhyme to watch!'}
            </h2>
          </div>
          <p className="text-xs sm:text-sm font-black text-slate-600 uppercase tracking-wide">
            Tap a rhyme card to watch its video!
          </p>
        </div>

        {!isAllFinished ? (
          selected ? (
            /* Video Player View */
            <div className="w-full max-w-2xl flex flex-col items-center gap-3 my-auto">
              <div className="w-full bg-black rounded-3xl border-4 border-pink-300 shadow-xl overflow-hidden">
                {selected.localSrc ? (
                  /* Bundled video — plays offline */
                  <video
                    src={selected.localSrc}
                    controls
                    playsInline
                    preload="metadata"
                    className="w-full aspect-video"
                  />
                ) : !isPlaceholderId(selected.driveFileId) ? (
                  /* Google Drive streaming */
                  <iframe
                    src={`https://drive.google.com/file/d/${selected.driveFileId}/preview`}
                    allow="autoplay; fullscreen"
                    allowFullScreen
                    title={selected.title}
                    className="w-full aspect-video"
                  />
                ) : (
                  /* Placeholder — video not added yet */
                  <div className="w-full aspect-video flex flex-col items-center justify-center gap-2 bg-pink-50 text-center p-6">
                    <span className="text-5xl">{selected.emoji}</span>
                    <p className="text-lg font-black text-pink-900">Video coming soon!</p>
                    <p className="text-sm font-bold text-slate-600">
                      Ask a grown-up to add this rhyme video.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playPop();
                    setSelectedId(null);
                  }}
                  className="flex items-center justify-center gap-2 bg-white hover:bg-pink-50 text-pink-900 font-black py-3 px-6 rounded-2xl border-b-6 border-pink-300 shadow-lg active:border-b-2 active:translate-y-1 transition-all cursor-pointer text-base uppercase"
                >
                  <span>← All Rhymes</span>
                </button>
                {selected.driveFileId && !isPlaceholderId(selected.driveFileId) && (
                  <a
                    href={`https://drive.google.com/file/d/${selected.driveFileId}/view`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-[#4D96FF] hover:bg-blue-500 text-white font-black py-3 px-6 rounded-2xl border-b-6 border-[#2563EB] shadow-lg active:border-b-2 active:translate-y-1 transition-all cursor-pointer text-base uppercase"
                  >
                    <ExternalLink className="w-5 h-5 stroke-[3]" />
                    <span>Open in Drive</span>
                  </a>
                )}
              </div>

              {/* Rhyme picker strip */}
              <div className="w-full grid grid-cols-3 sm:grid-cols-6 gap-2 mt-1">
                {RHYMES.map((rhyme) => (
                  <button
                    key={rhyme.id}
                    type="button"
                    onClick={() => handleSelectRhyme(rhyme.id, rhyme.title)}
                    className={`flex flex-col items-center gap-1 rounded-2xl border-4 p-2 shadow-md active:scale-95 transition-all cursor-pointer ${
                      rhyme.id === selectedId
                        ? 'bg-pink-400 border-pink-600 ring-4 ring-pink-200'
                        : watchedIds.has(rhyme.id)
                        ? 'bg-emerald-50 border-emerald-400'
                        : 'bg-white border-pink-300 hover:bg-pink-50'
                    }`}
                  >
                    <span className="text-3xl select-none">{rhyme.emoji}</span>
                    <span className="text-[10px] font-black text-slate-700 text-center leading-tight">
                      {rhyme.title}
                    </span>
                    {watchedIds.has(rhyme.id) && <span className="text-xs">✅</span>}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Rhyme List */
            <div className="w-full max-w-2xl grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 my-auto p-1">
              {RHYMES.map((rhyme) => (
                <motion.button
                  key={rhyme.id}
                  type="button"
                  onClick={() => handleSelectRhyme(rhyme.id, rhyme.title)}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative flex flex-col items-center gap-2 rounded-3xl border-4 p-4 sm:p-5 shadow-lg cursor-pointer ${
                    watchedIds.has(rhyme.id)
                      ? 'bg-emerald-50 border-emerald-400'
                      : 'bg-white border-pink-300 hover:bg-pink-50'
                  }`}
                >
                  <span className="text-5xl sm:text-6xl select-none drop-shadow-xs">{rhyme.emoji}</span>
                  <span className="text-sm sm:text-base font-black text-slate-800 text-center leading-tight">
                    {rhyme.title}
                  </span>
                  <span className="flex items-center gap-1 bg-pink-500 text-white font-black text-xs px-3 py-1.5 rounded-full">
                    <Play className="w-3 h-3 fill-white" /> Watch
                  </span>
                  {watchedIds.has(rhyme.id) && (
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
          <div className="flex flex-col items-center justify-center text-center my-auto p-6 bg-white/90 backdrop-blur-md rounded-3xl border-4 border-pink-400 shadow-xl max-w-lg">
            <div className="text-6xl mb-3 animate-bounce">🎉</div>
            <h3 className="text-2xl sm:text-3xl font-black text-pink-950 uppercase mb-2">
              Rhymes Complete!
            </h3>
            <div className="flex items-center gap-1.5 bg-amber-200 border-2 border-amber-400 px-4 py-1.5 rounded-full mb-3">
              <StarIcon className="w-5 h-5 fill-amber-400 text-amber-600" />
              <span className="font-black text-amber-950 text-sm">Star Earned!</span>
            </div>
            <p className="text-base font-bold text-slate-700 mb-5">
              You watched all the rhymes! What a wonderful singer you are!
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
