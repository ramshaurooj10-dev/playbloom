import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { RotateCcw, Volume2, Star as StarIcon, Play, Music } from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { ActivityBottomNav } from './ActivityBottomNav';

interface PianoMusicProps {
  onCollectStar: () => void;
  onNavigateHome?: () => void;
  onNavigateNext?: () => void;
  onNavigatePrev?: () => void;
  isActivityCompleted?: boolean;
}

interface Key {
  note: string;
  freq: number;
  color: string;
  textColor: string;
}

const KEYS: Key[] = [
  { note: 'C', freq: 261.63, color: 'bg-white', textColor: 'text-slate-800' },
  { note: 'D', freq: 293.66, color: 'bg-amber-100', textColor: 'text-amber-900' },
  { note: 'E', freq: 329.63, color: 'bg-emerald-100', textColor: 'text-emerald-900' },
  { note: 'F', freq: 349.23, color: 'bg-sky-100', textColor: 'text-sky-900' },
  { note: 'G', freq: 392.0, color: 'bg-violet-100', textColor: 'text-violet-900' },
  { note: 'A', freq: 440.0, color: 'bg-pink-100', textColor: 'text-pink-900' },
  { note: 'B', freq: 493.88, color: 'bg-orange-100', textColor: 'text-orange-900' },
  { note: 'C', freq: 523.25, color: 'bg-white', textColor: 'text-slate-800' },
];

const PATTERNS: string[][] = [
  ['C', 'D', 'E'],
  ['C', 'E', 'G'],
  ['G', 'F', 'E', 'D'],
];

export const PianoMusic: React.FC<PianoMusicProps> = ({
  onCollectStar,
  onNavigateHome,
  onNavigateNext,
  onNavigatePrev,
  isActivityCompleted = false,
}) => {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const [patternIndex, setPatternIndex] = useState(0);
  const [patternProgress, setPatternProgress] = useState(0);
  const [playingNote, setPlayingNote] = useState<string | null>(null);
  const [patternsDone, setPatternsDone] = useState(0);
  const [isAllFinished, setIsAllFinished] = useState(false);

  // Clean up the audio context when the activity unmounts
  useEffect(() => {
    return () => {
      audioCtxRef.current?.close().catch(() => undefined);
      audioCtxRef.current = null;
    };
  }, []);

  const getContext = () => {
    if (!audioCtxRef.current) {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return null;
      audioCtxRef.current = new Ctor();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume().catch(() => undefined);
    }
    return audioCtxRef.current;
  };

  const playNoteSound = (freq: number) => {
    const ctx = getContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.9);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.95);
  };

  const handleKeyPress = (key: Key, keyIndex: number) => {
    if (isAllFinished) return;
    playNoteSound(key.freq);
    soundManager.playPop();
    setPlayingNote(`${keyIndex}-${patternProgress}`);
    setTimeout(() => setPlayingNote(null), 250);

    const pattern = PATTERNS[patternIndex];
    const expected = pattern[patternProgress];
    if (key.note === expected) {
      const nextProgress = patternProgress + 1;
      if (nextProgress === pattern.length) {
        soundManager.playSuccess();
        soundManager.speak('Great! You played the pattern!');
        const nextDone = patternsDone + 1;
        setPatternsDone(nextDone);
        setTimeout(() => {
          if (nextDone === PATTERNS.length) {
            onCollectStar();
            setIsAllFinished(true);
            soundManager.playCelebration();
            soundManager.speak('Amazing! You played all the patterns!');
          } else {
            setPatternIndex(patternIndex + 1);
            setPatternProgress(0);
          }
        }, 900);
      } else {
        setPatternProgress(nextProgress);
      }
    } else {
      soundManager.playError();
      soundManager.speak('Oops! Listen and try again!');
      setPatternProgress(0);
    }
  };

  const handleHearPattern = () => {
    const pattern = PATTERNS[patternIndex];
    soundManager.speak(`Listen: ${pattern.join(', ')}`);
    pattern.forEach((note, i) => {
      const key = KEYS.find((k) => k.note === note);
      if (!key) return;
      setTimeout(() => playNoteSound(key.freq), i * 600);
    });
  };

  const handlePlayAgain = () => {
    soundManager.playPop();
    soundManager.speak("Let's play the piano again!");
    setPatternIndex(0);
    setPatternProgress(0);
    setPatternsDone(0);
    setIsAllFinished(false);
  };

  const currentPattern = PATTERNS[patternIndex];

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center p-2 sm:p-4">
      {/* Top Banner Header */}
      <div className="w-full bg-white/90 backdrop-blur-md border-4 border-purple-300 rounded-3xl p-3 sm:p-4 shadow-lg mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-purple-100 px-3 py-1.5 rounded-2xl border-2 border-purple-300">
            <span className="text-xl">🎹</span>
            <h1 className="text-base sm:text-xl font-black text-purple-950 uppercase tracking-wide">
              Piano Music
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-blue-100 text-blue-900 font-black text-xs sm:text-sm px-3 py-1.5 rounded-2xl border-2 border-blue-300 flex items-center gap-1">
            <span>
              Patterns: {patternsDone} / {PATTERNS.length}
            </span>
          </div>
          <div className="bg-amber-400 text-amber-950 font-black text-xs sm:text-sm px-3 py-1.5 rounded-2xl border-2 border-amber-300 flex items-center gap-1 shadow-xs">
            <StarIcon className="w-4 h-4 fill-amber-100 stroke-amber-950" />
            <span>{patternsDone === PATTERNS.length || isActivityCompleted ? 1 : 0}</span>
          </div>
        </div>
      </div>

      {/* Main Activity Card */}
      <div className="w-full bg-gradient-to-br from-purple-100 via-fuchsia-50 to-pink-100 border-4 border-purple-400 rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col items-center relative overflow-hidden min-h-[420px] justify-between">
        <div className="text-center mt-1 mb-3">
          <div className="inline-flex items-center gap-2 bg-white px-6 py-2 rounded-full border-4 border-purple-300 shadow-md mb-1">
            <button
              type="button"
              onClick={() => soundManager.speak('Listen to the pattern, then play it on the piano!')}
              className="p-1 bg-purple-100 hover:bg-purple-200 rounded-full text-purple-900 transition-transform active:scale-90 cursor-pointer"
            >
              <Volume2 className="w-5 h-5" />
            </button>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight uppercase">
              Play the Pattern!
            </h2>
          </div>
          <p className="text-xs sm:text-sm font-black text-slate-600 uppercase tracking-wide">
            Tap the keys to play the notes in order!
          </p>
        </div>

        {!isAllFinished ? (
          <div className="w-full max-w-2xl flex flex-col items-center gap-4 my-auto">
            {/* Pattern display */}
            <div className="w-full bg-white rounded-3xl border-4 border-purple-300 shadow-xl p-4 flex flex-col items-center gap-3">
              <span className="text-sm font-black text-slate-500 uppercase tracking-widest">
                Pattern {patternIndex + 1} of {PATTERNS.length}
              </span>
              <div className="flex items-center gap-2">
                {currentPattern.map((note, idx) => (
                  <span
                    key={idx}
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl border-4 flex items-center justify-center text-xl sm:text-2xl font-black ${
                      idx < patternProgress
                        ? 'bg-emerald-400 border-emerald-600 text-white'
                        : idx === patternProgress
                        ? 'bg-amber-300 border-amber-500 text-amber-950 animate-pulse'
                        : 'bg-slate-100 border-slate-300 text-slate-600'
                    }`}
                  >
                    {note}
                  </span>
                ))}
              </div>
              <button
                type="button"
                onClick={handleHearPattern}
                className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white font-black py-2.5 px-6 rounded-2xl border-b-4 border-purple-700 shadow active:border-b-2 active:translate-y-0.5 transition-all cursor-pointer text-sm sm:text-base uppercase"
              >
                <Play className="w-5 h-5 fill-white" />
                <span>Hear the Pattern</span>
              </button>
            </div>

            {/* Piano keys */}
            <div className="w-full bg-slate-900 rounded-3xl border-4 border-slate-700 shadow-xl p-3 sm:p-4">
              <div className="grid grid-cols-8 gap-1.5 sm:gap-2">
                {KEYS.map((key, keyIndex) => {
                  const isActive = playingNote === `${keyIndex}-${patternProgress}`;
                  return (
                    <motion.button
                      key={keyIndex}
                      type="button"
                      onClick={() => handleKeyPress(key, keyIndex)}
                      whileTap={{ scale: 0.92 }}
                      className={`h-28 sm:h-36 rounded-2xl border-b-8 border-slate-300 shadow-lg flex flex-col items-center justify-end pb-2 cursor-pointer active:translate-y-1 active:border-b-2 transition-all ${
                        key.color
                      } ${isActive ? 'ring-4 ring-amber-400 scale-95' : ''}`}
                    >
                      <Music className={`w-4 h-4 sm:w-5 sm:h-5 ${key.textColor}`} />
                      <span className={`text-xl sm:text-2xl font-black ${key.textColor}`}>{key.note}</span>
                    </motion.button>
                  );
                })}
              </div>
              <p className="text-center text-xs font-black text-slate-400 uppercase mt-3 tracking-widest">
                Tap the keys to make music!
              </p>
            </div>
          </div>
        ) : (
          /* Completion Screen */
          <div className="flex flex-col items-center justify-center text-center my-auto p-6 bg-white/90 backdrop-blur-md rounded-3xl border-4 border-purple-400 shadow-xl max-w-lg">
            <div className="text-6xl mb-3 animate-bounce">🎉</div>
            <h3 className="text-2xl sm:text-3xl font-black text-purple-950 uppercase mb-2">
              Piano Complete!
            </h3>
            <div className="flex items-center gap-1.5 bg-amber-200 border-2 border-amber-400 px-4 py-1.5 rounded-full mb-3">
              <StarIcon className="w-5 h-5 fill-amber-400 text-amber-600" />
              <span className="font-black text-amber-950 text-sm">Star Earned!</span>
            </div>
            <p className="text-base font-bold text-slate-700 mb-5">
              You played all the patterns! What a little musician you are!
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
