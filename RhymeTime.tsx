import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, RotateCcw, Sparkles, Star, ArrowLeft, ArrowRight, Home, Volume2 } from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { trackRhymePlay } from '../../utils/analytics';

interface RhymeTimeProps {
  onCollectStar: () => void;
  onNavigateHome?: () => void;
  onNavigateNext?: () => void;
  onNavigatePrev?: () => void;
  isActivityCompleted?: boolean;
}

interface RhymeVerse {
  id: string;
  characterName: string;
  foodName: string;
  bgColor: string;
  borderColor: string;
  accentColor: string;
  speechText: string;
  emoji: string;
}

const RHYME_VERSES: RhymeVerse[] = [
  {
    id: 'monkey',
    characterName: 'Monkey',
    foodName: 'Banana',
    bgColor: 'bg-amber-100',
    borderColor: 'border-amber-400',
    accentColor: 'text-amber-900',
    speechText: 'Hi! I am a monkey. My favourite food is banana. Bananas give me energy, so I can jump, swing and play!',
    emoji: '🐵',
  },
  {
    id: 'rabbit',
    characterName: 'Rabbit',
    foodName: 'Carrot',
    bgColor: 'bg-orange-100',
    borderColor: 'border-orange-400',
    accentColor: 'text-orange-900',
    speechText: 'Hello! I am a rabbit. My favourite food is carrot. Carrots help keep our eyes healthy and bright!',
    emoji: '🐰',
  },
  {
    id: 'kitty',
    characterName: 'Cat',
    foodName: 'Milk',
    bgColor: 'bg-sky-100',
    borderColor: 'border-sky-400',
    accentColor: 'text-sky-900',
    speechText: 'Meow! I am a cat. My favourite food is milk. Milk helps make our bones and teeth strong!',
    emoji: '🐱',
  },
  {
    id: 'lion',
    characterName: 'Lion',
    foodName: 'Meat',
    bgColor: 'bg-red-100',
    borderColor: 'border-red-400',
    accentColor: 'text-red-900',
    speechText: 'Hello! I am a lion. I love meat. Meat gives our muscles protein to help us grow strong!',
    emoji: '🦁',
  },
  {
    id: 'bear',
    characterName: 'Bear',
    foodName: 'Honey',
    bgColor: 'bg-yellow-100',
    borderColor: 'border-yellow-400',
    accentColor: 'text-yellow-900',
    speechText: 'Hi! I am a bear. My favourite food is honey. Honey is a sweet and tasty treat!',
    emoji: '🐻',
  },
  {
    id: 'final_party',
    characterName: 'We Are Humans',
    foodName: 'Healthy Foods',
    bgColor: 'bg-emerald-100',
    borderColor: 'border-emerald-400',
    accentColor: 'text-emerald-900',
    speechText: "We are humans! We can eat many different kinds of healthy foods. Fruits, vegetables, milk and protein foods help us grow, learn and stay strong. So let's eat healthy food, grow every day, and have fun!",
    emoji: '👧',
  },
];

export const RhymeTime: React.FC<RhymeTimeProps> = ({
  onCollectStar,
  onNavigateHome,
  onNavigateNext,
  onNavigatePrev,
  isActivityCompleted,
}) => {
  const [currentVerseIdx, setCurrentVerseIdx] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [playingIdx, setPlayingIdx] = useState<number | null>(null);

  const safeVerseIdx = Math.max(0, Math.min(currentVerseIdx, RHYME_VERSES.length - 1));
  const currentVerse = RHYME_VERSES[safeVerseIdx] || RHYME_VERSES[0];

  // Auto-start background music and play initial Monkey card on mount
  useEffect(() => {
    soundManager.startBackgroundMusic();

    const timer = setTimeout(() => {
      playExactCard(0);
    }, 500);

    return () => {
      clearTimeout(timer);
      soundManager.stopSpeech();
    };
  }, []);

  // Independent playback trigger for any specific card (1 to 6)
  const playExactCard = (idx: number) => {
    const targetIdx = Math.max(0, Math.min(idx, RHYME_VERSES.length - 1));

    // 1. Stop any currently playing narration immediately
    soundManager.stopSpeech();

    // 2. Set current active card immediately for visual display
    setCurrentVerseIdx(targetIdx);
    setPlayingIdx(targetIdx);

    const verse = RHYME_VERSES[targetIdx];
    if (!verse) return;

    soundManager.playPop();

    // 3. Play ONLY the selected card's narration (no auto-advancing!)
    trackRhymePlay();
    soundManager.speak(verse.speechText, () => {
      setPlayingIdx(null);
      // Mark activity completed / reward star when listening
      if (!isCompleted) {
        setIsCompleted(true);
        setShowCelebration(true);
        onCollectStar();
        soundManager.playCelebration();
      }
    });
  };

  const handleFinished = () => {
    soundManager.stopSpeech();
    setPlayingIdx(null);
    if (!isCompleted) {
      setIsCompleted(true);
      setShowCelebration(true);
      onCollectStar();
      soundManager.playCelebration();
    } else {
      soundManager.playSuccess();
    }
  };

  const handleReplay = () => {
    soundManager.playPop();
    soundManager.stopSpeech();
    setIsCompleted(false);
    setShowCelebration(false);
    playExactCard(0);
  };

  // Step-by-step previous navigation handler
  const handleInternalPrev = () => {
    soundManager.playPop();
    soundManager.stopSpeech();
    if (isCompleted) {
      setIsCompleted(false);
      setShowCelebration(false);
      playExactCard(RHYME_VERSES.length - 1);
    } else if (currentVerseIdx > 0) {
      playExactCard(currentVerseIdx - 1);
    } else {
      if (onNavigatePrev) {
        onNavigatePrev();
      }
    }
  };

  return (
    <div id="animal-food-fun-activity" className="w-full max-w-5xl mx-auto flex flex-col items-center justify-between p-2 sm:p-4 min-h-[calc(100vh-120px)] select-none relative overflow-hidden">
      {/* Preschool Animated Canvas Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#BAE6FD] via-[#E0F2FE] to-[#DCFCE7] -z-20" />

      {/* Floating Decorative Scenery */}
      <div className="absolute top-2 left-6 text-4xl sm:text-5xl animate-spin-slow pointer-events-none -z-10">☀️</div>
      <div className="absolute top-4 right-8 text-4xl sm:text-5xl opacity-80 animate-pulse pointer-events-none -z-10">☁️</div>
      <div className="absolute top-10 left-1/4 text-3xl opacity-70 animate-bounce delay-150 pointer-events-none -z-10">☁️</div>
      <div className="absolute top-3 right-1/3 text-4xl opacity-90 pointer-events-none -z-10">🌈</div>

      {/* Activity Top Banner Card */}
      <div className="w-full max-w-2xl bg-white/95 rounded-3xl border-4 border-amber-300 shadow-lg p-3 sm:p-4 mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#92400E] border-2 border-white flex items-center justify-center text-2xl text-white shadow-md">
            🐾
          </div>
          <div className="text-left">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight">
              Animal Food Fun
            </h1>
            <p className="text-xs font-bold text-amber-800 flex items-center gap-1">
              <span>Learn What Animals Eat!</span>
            </p>
          </div>
        </div>

        {/* Control Buttons (Replay/Restart) */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleReplay}
            className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white font-black px-4 py-2.5 rounded-2xl border-b-4 border-purple-800 shadow-md active:translate-y-1 transition-all cursor-pointer text-xs sm:text-sm uppercase"
            title="Restart Scenes from Beginning"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Restart</span>
          </button>
        </div>
      </div>

      {/* Main Verse Stage Container */}
      <div className="w-full max-w-3xl flex-1 flex flex-col items-center justify-center my-2">
        {/* 6 Independent Card Play Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mb-3 w-full">
          {RHYME_VERSES.map((v, idx) => {
            const isSelected = idx === safeVerseIdx;
            const isPlayingThis = playingIdx === idx;
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => playExactCard(idx)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-2xl font-black text-xs sm:text-sm transition-all cursor-pointer border-b-4 ${
                  isSelected
                    ? 'bg-[#92400E] text-white border-[#451A03] scale-105 shadow-md ring-2 ring-amber-300'
                    : 'bg-white/90 text-slate-800 border-slate-300 hover:bg-white hover:scale-102 shadow-sm'
                }`}
                title={`Play ${v.characterName}`}
              >
                <span className="text-base sm:text-lg">{v.emoji}</span>
                <span>{v.characterName}</span>
                <span className={`flex items-center justify-center w-5 h-5 rounded-full ${isSelected ? 'bg-amber-400 text-amber-950' : 'bg-amber-100 text-amber-900'}`}>
                  <Play className={`w-3 h-3 fill-current ml-0.5 ${isPlayingThis ? 'animate-bounce' : ''}`} />
                </span>
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentVerse.id}
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -12 }}
            transition={{ duration: 0.4, type: 'spring' }}
            onClick={() => playExactCard(safeVerseIdx)}
            className={`w-full ${currentVerse.bgColor} rounded-3xl border-8 ${currentVerse.borderColor} shadow-2xl p-4 sm:p-5 flex flex-col items-center text-center relative overflow-hidden cursor-pointer group`}
          >

            {/* Stage Container with FULL-BODY 3D Animals & Rich Environmental Elements */}
            <div className="relative w-full h-64 sm:h-72 my-1 flex items-center justify-center bg-white/90 rounded-2xl border-4 border-white shadow-inner overflow-hidden">
              {/* Floor grass line */}
              <div className="absolute bottom-0 inset-x-0 h-10 bg-emerald-400 border-t-4 border-emerald-500 flex items-center justify-around z-0">
                <span className="text-xl animate-bounce">🌸</span>
                <span className="text-xl">🌼</span>
                <span className="text-xl">🌺</span>
                <span className="text-xl">🌸</span>
                <span className="text-xl animate-bounce delay-200">🌼</span>
              </div>

              {/* SCENE 1 — MONKEY 🐵 */}
              {currentVerse.id === 'monkey' && (
                <div className="relative w-full h-full flex items-center justify-center p-2 z-10">
                  {/* Tree leaves & vine above */}
                  <div className="absolute top-0 inset-x-0 flex items-center justify-between px-4 z-0">
                    <motion.div animate={{ rotate: [-2, 2, -2] }} transition={{ duration: 3, repeat: Infinity }} className="w-full h-5 bg-amber-800 rounded-b-xl border-b-2 border-amber-950 flex justify-around">
                      <span className="text-2xl -mt-2">🍃</span>
                      <span className="text-2xl -mt-2">🌿</span>
                      <span className="text-2xl -mt-2">🍃</span>
                      <span className="text-2xl -mt-2">🌿</span>
                    </motion.div>
                  </div>

                  {/* Playful Environmental Elements: Floating Balloons & Butterflies */}
                  <motion.div animate={{ y: [-8, 8, -8] }} transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }} className="absolute top-4 left-6 flex flex-col items-center">
                    <span className="text-3xl drop-shadow-sm">🎈</span>
                    <div className="w-0.5 h-8 bg-red-400" />
                  </motion.div>
                  <motion.div animate={{ y: [8, -8, 8] }} transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }} className="absolute top-6 right-8 flex flex-col items-center">
                    <span className="text-3xl drop-shadow-sm">🟡</span>
                    <div className="w-0.5 h-8 bg-amber-400" />
                  </motion.div>
                  <motion.span animate={{ x: [-15, 15, -15], y: [-10, 10, -10] }} transition={{ duration: 4, repeat: Infinity }} className="absolute top-10 left-20 text-2xl">🦋</motion.span>
                  <motion.span animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} className="absolute top-14 right-20 text-xl text-amber-500">✨</motion.span>

                  {/* Full Body Monkey Illustration */}
                  <motion.div
                    animate={{ rotate: [-3, 3, -3], y: [-2, 2, -2] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                    className="flex flex-col items-center justify-center relative z-10"
                  >
                    <svg className="w-48 h-52 drop-shadow-lg" viewBox="0 0 160 180" fill="none">
                      {/* Swinging Tail */}
                      <path d="M 45 115 C 15 115 5 155 25 165 C 40 173 50 150 40 140" stroke="#78350F" strokeWidth="8" strokeLinecap="round" fill="none" />
                      {/* Legs & Feet */}
                      <rect x="54" y="125" width="12" height="32" rx="6" fill="#92400E" />
                      <rect x="94" y="125" width="12" height="32" rx="6" fill="#92400E" />
                      <ellipse cx="60" cy="155" rx="12" ry="7" fill="#78350F" />
                      <ellipse cx="100" cy="155" rx="12" ry="7" fill="#78350F" />
                      {/* Body & Tummy */}
                      <ellipse cx="80" cy="115" rx="30" ry="32" fill="#92400E" />
                      <ellipse cx="80" cy="118" rx="20" ry="22" fill="#FDE68A" />
                      {/* Arms holding banana */}
                      <path d="M 55 100 Q 40 115 65 122" stroke="#92400E" strokeWidth="10" strokeLinecap="round" fill="none" />
                      <path d="M 105 100 Q 120 115 95 122" stroke="#92400E" strokeWidth="10" strokeLinecap="round" fill="none" />
                      {/* Banana held in Hand */}
                      <path d="M 65 110 C 70 130 95 130 100 112 C 92 122 75 122 65 110" fill="#FACC15" stroke="#EAB308" strokeWidth="2" />
                      {/* Ears */}
                      <circle cx="48" cy="55" r="12" fill="#92400E" />
                      <circle cx="48" cy="55" r="7" fill="#FDE68A" />
                      <circle cx="112" cy="55" r="12" fill="#92400E" />
                      <circle cx="112" cy="55" r="7" fill="#FDE68A" />
                      {/* Head */}
                      <circle cx="80" cy="55" r="28" fill="#92400E" />
                      <ellipse cx="80" cy="60" rx="20" ry="17" fill="#FDE68A" />
                      {/* Eyes */}
                      <circle cx="72" cy="52" r="3.5" fill="#1E293B" />
                      <circle cx="88" cy="52" r="3.5" fill="#1E293B" />
                      <circle cx="73" cy="50" r="1" fill="#FFFFFF" />
                      <circle cx="89" cy="50" r="1" fill="#FFFFFF" />
                      {/* Nose & Smile */}
                      <ellipse cx="80" cy="60" rx="4" ry="3" fill="#78350F" />
                      <path d="M 74 65 Q 80 72 86 65" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                      <circle cx="68" cy="62" r="3" fill="#F43F5E" opacity="0.6" />
                      <circle cx="92" cy="62" r="3" fill="#F43F5E" opacity="0.6" />
                    </svg>
                  </motion.div>
                </div>
              )}

              {/* SCENE 2 — RABBIT 🐰 */}
              {currentVerse.id === 'rabbit' && (
                <div className="relative w-full h-full flex items-center justify-center p-2 z-10">
                  {/* Environmental Elements: Mushrooms, Flowers, Butterflies, Floating Hearts */}
                  <div className="absolute bottom-1 left-4 flex gap-1 text-2xl z-0">
                    <span>🍄</span>
                    <span>🌸</span>
                  </div>
                  <div className="absolute bottom-1 right-4 flex gap-1 text-2xl z-0">
                    <span>🌷</span>
                    <span>🍄</span>
                  </div>
                  <motion.span animate={{ y: [-12, 12, -12], x: [-10, 10, -10] }} transition={{ duration: 3.5, repeat: Infinity }} className="absolute top-6 left-10 text-2xl">🦋</motion.span>
                  <motion.span animate={{ scale: [0.7, 1.2, 0.7], opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.8, repeat: Infinity }} className="absolute top-8 right-12 text-2xl text-pink-500">💖</motion.span>
                  <motion.span animate={{ scale: [0.8, 1.3, 0.8], opacity: [0.3, 0.9, 0.3] }} transition={{ duration: 2.2, repeat: Infinity }} className="absolute top-16 left-24 text-xl text-amber-400">✨</motion.span>

                  {/* Full Body Rabbit Illustration */}
                  <motion.div
                    animate={{ y: [3, -10, 3] }}
                    transition={{ duration: 1.3, repeat: Infinity, ease: 'easeInOut' }}
                    className="flex flex-col items-center justify-center relative z-10"
                  >
                    <svg className="w-48 h-52 drop-shadow-lg" viewBox="0 0 160 180" fill="none">
                      {/* Floppy Ears */}
                      <ellipse cx="66" cy="22" rx="8" ry="24" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="2" />
                      <ellipse cx="66" cy="22" rx="4" ry="18" fill="#F472B6" />
                      <ellipse cx="94" cy="22" rx="8" ry="24" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="2" />
                      <ellipse cx="94" cy="22" rx="4" ry="18" fill="#F472B6" />
                      {/* Fluffy Tail */}
                      <circle cx="120" cy="135" r="10" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
                      {/* Big Feet & Legs */}
                      <ellipse cx="55" cy="148" rx="16" ry="10" fill="#E2E8F0" />
                      <ellipse cx="105" cy="148" rx="16" ry="10" fill="#E2E8F0" />
                      {/* Body & Tummy */}
                      <ellipse cx="80" cy="118" rx="32" ry="30" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="2" />
                      <ellipse cx="80" cy="120" rx="20" ry="20" fill="#FFFFFF" />
                      {/* Paws holding carrot */}
                      <ellipse cx="65" cy="110" rx="7" ry="6" fill="#E2E8F0" />
                      <ellipse cx="95" cy="110" rx="7" ry="6" fill="#E2E8F0" />
                      {/* Carrot held in hands */}
                      <path d="M 72 98 L 88 98 L 80 130 Z" fill="#EA580C" stroke="#C2410C" strokeWidth="1.5" />
                      <path d="M 76 95 C 72 85 80 82 80 95 C 80 82 88 85 84 95" fill="#22C55E" />
                      {/* Head & Eyes */}
                      <circle cx="80" cy="58" r="26" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="2" />
                      <circle cx="72" cy="54" r="3.5" fill="#1E293B" />
                      <circle cx="88" cy="54" r="3.5" fill="#1E293B" />
                      <circle cx="73" cy="52" r="1" fill="#FFFFFF" />
                      <circle cx="89" cy="52" r="1" fill="#FFFFFF" />
                      {/* Pink Nose & Whiskers */}
                      <polygon points="77,61 83,61 80,65" fill="#F43F5E" />
                      <path d="M 77 66 Q 80 70 83 66" stroke="#64748B" strokeWidth="2" strokeLinecap="round" fill="none" />
                      <line x1="58" y1="60" x2="68" y2="62" stroke="#94A3B8" strokeWidth="1.5" />
                      <line x1="58" y1="66" x2="68" y2="65" stroke="#94A3B8" strokeWidth="1.5" />
                      <line x1="102" y1="60" x2="92" y2="62" stroke="#94A3B8" strokeWidth="1.5" />
                      <line x1="102" y1="66" x2="92" y2="65" stroke="#94A3B8" strokeWidth="1.5" />
                    </svg>
                  </motion.div>
                </div>
              )}

              {/* SCENE 3 — CAT 🐱 */}
              {currentVerse.id === 'kitty' && (
                <div className="relative w-full h-full flex items-center justify-center p-2 z-10">
                  {/* Environmental Elements: Soft Bubbles, Yarn Toy, Stars & Sparkles */}
                  <motion.div animate={{ y: [20, -50], opacity: [0.2, 0.8, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute bottom-6 left-8 text-2xl">🫧</motion.div>
                  <motion.div animate={{ y: [30, -40], opacity: [0.2, 0.9, 0] }} transition={{ duration: 3.5, repeat: Infinity, delay: 1 }} className="absolute bottom-4 right-10 text-2xl">🫧</motion.div>
                  <div className="absolute bottom-2 right-6 text-3xl z-0">🧶</div>
                  <motion.span animate={{ scale: [0.8, 1.2, 0.8], rotate: [0, 180, 360] }} transition={{ duration: 3, repeat: Infinity }} className="absolute top-6 left-12 text-2xl text-sky-400">⭐</motion.span>
                  <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.8, repeat: Infinity }} className="absolute top-10 right-14 text-xl text-amber-400">✨</motion.span>

                  {/* Full Body Cat Illustration */}
                  <motion.div
                    animate={{ x: [-2, 2, -2] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    className="flex flex-col items-center justify-center relative z-10"
                  >
                    <svg className="w-52 h-52 drop-shadow-lg" viewBox="0 0 180 180" fill="none">
                      {/* Swishing Tail */}
                      <path d="M 115 130 C 145 120 155 80 140 70 C 130 65 125 80 135 100" stroke="#F97316" strokeWidth="7" strokeLinecap="round" fill="none" />
                      {/* Cat Body & Stripes */}
                      <ellipse cx="85" cy="120" rx="32" ry="28" fill="#FB923C" />
                      <path d="M 85 102 L 85 110 M 75 105 L 77 112 M 95 105 L 93 112" stroke="#C2410C" strokeWidth="3" strokeLinecap="round" />
                      {/* Paws */}
                      <ellipse cx="65" cy="145" rx="9" ry="6" fill="#FFEDD5" />
                      <ellipse cx="85" cy="145" rx="9" ry="6" fill="#FFEDD5" />
                      <ellipse cx="105" cy="145" rx="9" ry="6" fill="#FFEDD5" />
                      {/* Ears */}
                      <polygon points="56,48 68,22 80,48" fill="#FB923C" />
                      <polygon points="60,46 68,28 76,46" fill="#F472B6" />
                      <polygon points="90,48 102,22 114,48" fill="#FB923C" />
                      <polygon points="94,46 102,28 110,46" fill="#F472B6" />
                      {/* Head & Eyes */}
                      <circle cx="85" cy="58" r="26" fill="#FB923C" />
                      <circle cx="76" cy="54" r="3.5" fill="#0284C7" />
                      <circle cx="94" cy="54" r="3.5" fill="#0284C7" />
                      <circle cx="77" cy="52" r="1" fill="#FFFFFF" />
                      <circle cx="95" cy="52" r="1" fill="#FFFFFF" />
                      {/* Nose, Whiskers & Smile */}
                      <polygon points="83,61 87,61 85,64" fill="#F43F5E" />
                      <path d="M 80 66 Q 85 70 90 66" stroke="#7C2D12" strokeWidth="2" strokeLinecap="round" fill="none" />
                      <line x1="60" y1="60" x2="72" y2="62" stroke="#7C2D12" strokeWidth="1.5" />
                      <line x1="60" y1="66" x2="72" y2="65" stroke="#7C2D12" strokeWidth="1.5" />
                      <line x1="110" y1="60" x2="98" y2="62" stroke="#7C2D12" strokeWidth="1.5" />
                      <line x1="110" y1="66" x2="98" y2="65" stroke="#7C2D12" strokeWidth="1.5" />
                      {/* Bowl with Milk */}
                      <ellipse cx="40" cy="150" rx="22" ry="8" fill="#0284C7" />
                      <ellipse cx="40" cy="148" rx="20" ry="6" fill="#FFFFFF" />
                      <text x="35" y="152" fontSize="10" fill="#0284C7" fontWeight="bold">🥛</text>
                    </svg>
                  </motion.div>
                </div>
              )}

              {/* SCENE 4 — LION 🦁 */}
              {currentVerse.id === 'lion' && (
                <div className="relative w-full h-full flex items-center justify-center p-2 z-10">
                  {/* Environmental Elements: Sun Rays, Butterflies, Floating Leaves & Sparkles */}
                  <div className="absolute top-2 left-4 text-3xl opacity-80 z-0">☀️</div>
                  <motion.span animate={{ x: [10, -10, 10], y: [-8, 8, -8] }} transition={{ duration: 3.2, repeat: Infinity }} className="absolute top-8 right-12 text-2xl">🦋</motion.span>
                  <motion.span animate={{ y: [0, 30], opacity: [0, 1, 0] }} transition={{ duration: 3, repeat: Infinity }} className="absolute top-4 left-1/3 text-xl">🍃</motion.span>
                  <motion.span animate={{ scale: [0.8, 1.3, 0.8], opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }} className="absolute top-12 right-24 text-xl text-amber-500">✨</motion.span>

                  {/* Full Body Realistic Lion Illustration */}
                  <motion.div
                    animate={{ x: [-3, 3, -3] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                    className="flex flex-col items-center justify-center relative z-10"
                  >
                    <svg className="w-60 h-56 drop-shadow-xl" viewBox="0 0 220 190" fill="none">
                      {/* Tail with dark brush tuft */}
                      <path d="M 155 120 C 185 115 195 85 180 65 C 175 58 165 65 170 75 C 173 82 170 95 155 105" stroke="#B45309" strokeWidth="7" strokeLinecap="round" fill="none" />
                      <path d="M 180 65 C 188 55 192 68 182 75 Z" fill="#451A03" />

                      {/* Back Hind Leg */}
                      <ellipse cx="148" cy="138" rx="14" ry="22" fill="#B45309" />
                      <rect x="138" y="145" width="16" height="22" rx="7" fill="#B45309" />
                      <ellipse cx="146" cy="165" rx="12" ry="7" fill="#92400E" />

                      {/* Muscular Torso & Body */}
                      <ellipse cx="118" cy="126" rx="42" ry="28" fill="#D97706" />
                      <ellipse cx="110" cy="130" rx="30" ry="20" fill="#F59E0B" />

                      {/* Front Legs */}
                      <rect x="72" y="128" width="16" height="38" rx="8" fill="#D97706" />
                      <ellipse cx="80" cy="165" rx="12" ry="7" fill="#B45309" />
                      <rect x="98" y="128" width="16" height="38" rx="8" fill="#D97706" />
                      <ellipse cx="106" cy="165" rx="12" ry="7" fill="#B45309" />

                      {/* Paw Toe Lines */}
                      <line x1="76" y1="163" x2="76" y2="168" stroke="#78350F" strokeWidth="1.5" />
                      <line x1="80" y1="163" x2="80" y2="168" stroke="#78350F" strokeWidth="1.5" />
                      <line x1="84" y1="163" x2="84" y2="168" stroke="#78350F" strokeWidth="1.5" />
                      <line x1="102" y1="163" x2="102" y2="168" stroke="#78350F" strokeWidth="1.5" />
                      <line x1="106" y1="163" x2="106" y2="168" stroke="#78350F" strokeWidth="1.5" />
                      <line x1="110" y1="163" x2="110" y2="168" stroke="#78350F" strokeWidth="1.5" />

                      {/* Outer Dark Brown Layered Mane */}
                      <path d="M 65 18 C 50 10 30 25 35 45 C 18 50 15 70 28 85 C 15 100 25 120 45 125 C 55 135 75 135 90 125 C 105 120 115 100 110 80 C 120 65 110 45 98 35 C 95 20 78 10 65 18 Z" fill="#78350F" />

                      {/* Inner Auburn Layered Mane */}
                      <path d="M 65 25 C 55 20 40 32 44 48 C 30 52 28 68 38 80 C 28 92 36 110 52 112 C 62 120 78 120 88 112 C 98 108 105 92 100 76 C 108 64 100 48 90 40 C 86 28 75 20 65 25 Z" fill="#9A3412" />

                      {/* Round Ears emerging from mane */}
                      <circle cx="48" cy="36" r="10" fill="#D97706" />
                      <circle cx="48" cy="36" r="5" fill="#FEF3C7" />
                      <circle cx="82" cy="36" r="10" fill="#D97706" />
                      <circle cx="82" cy="36" r="5" fill="#FEF3C7" />

                      {/* Golden Lion Face Head */}
                      <ellipse cx="65" cy="62" rx="24" ry="26" fill="#F59E0B" />

                      {/* Light Muzzle / Snout */}
                      <ellipse cx="65" cy="72" rx="14" ry="11" fill="#FEF3C7" />

                      {/* Proud Lion Nose */}
                      <polygon points="60,67 70,67 65,73" fill="#451A03" />

                      {/* Mouth Line */}
                      <path d="M 61 76 Q 65 81 69 76" stroke="#451A03" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                      <path d="M 65 73 L 65 76" stroke="#451A03" strokeWidth="2" />

                      {/* Whiskers */}
                      <line x1="45" y1="72" x2="57" y2="73" stroke="#78350F" strokeWidth="1.5" />
                      <line x1="45" y1="77" x2="57" y2="76" stroke="#78350F" strokeWidth="1.5" />
                      <line x1="85" y1="72" x2="73" y2="73" stroke="#78350F" strokeWidth="1.5" />
                      <line x1="85" y1="77" x2="73" y2="76" stroke="#78350F" strokeWidth="1.5" />

                      {/* Expressive Amber Eyes */}
                      <ellipse cx="55" cy="56" rx="4" ry="5" fill="#B45309" />
                      <circle cx="55" cy="56" r="3" fill="#1E293B" />
                      <circle cx="56" cy="54" r="1" fill="#FFFFFF" />
                      <ellipse cx="75" cy="56" rx="4" ry="5" fill="#B45309" />
                      <circle cx="75" cy="56" r="3" fill="#1E293B" />
                      <circle cx="76" cy="54" r="1" fill="#FFFFFF" />

                      {/* Plate with Fresh Meat placed right in front */}
                      <ellipse cx="38" cy="162" rx="22" ry="8" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="1.5" />
                      <ellipse cx="38" cy="160" rx="18" ry="6" fill="#E2E8F0" />
                      <path d="M 26 156 Q 38 148 50 156 Q 52 164 38 164 Q 24 164 26 156 Z" fill="#DC2626" stroke="#991B1B" strokeWidth="2" />
                      <circle cx="34" cy="158" r="3.5" fill="#FFFFFF" />
                      <path d="M 34 158 Q 42 154 44 160" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </motion.div>
                </div>
              )}

              {/* SCENE 5 — BEAR 🐻 */}
              {currentVerse.id === 'bear' && (
                <div className="relative w-full h-full flex items-center justify-center p-2 z-10">
                  {/* Environmental Elements: Flying Honey Bees, Trees, Leaves & Sparkles */}
                  <motion.span animate={{ x: [-20, 20, -20], y: [-10, 10, -10] }} transition={{ duration: 2.5, repeat: Infinity }} className="absolute top-6 left-10 text-2xl">🐝</motion.span>
                  <motion.span animate={{ x: [20, -20, 20], y: [10, -10, 10] }} transition={{ duration: 2.8, repeat: Infinity }} className="absolute top-10 right-12 text-2xl">🐝</motion.span>
                  <div className="absolute bottom-1 left-4 text-3xl opacity-80 z-0">🌳</div>
                  <div className="absolute bottom-1 right-4 text-3xl opacity-80 z-0">🌻</div>
                  <motion.span animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.9, repeat: Infinity }} className="absolute top-14 left-24 text-xl text-yellow-500">✨</motion.span>

                  {/* Full Body Bear Illustration */}
                  <motion.div
                    animate={{ rotate: [-2, 2, -2], y: [-2, 2, -2] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                    className="flex flex-col items-center justify-center relative z-10"
                  >
                    <svg className="w-52 h-52 drop-shadow-lg" viewBox="0 0 180 180" fill="none">
                      {/* Stubby Tail */}
                      <circle cx="122" cy="130" r="8" fill="#78350F" />
                      {/* Legs */}
                      <ellipse cx="65" cy="150" rx="14" ry="8" fill="#78350F" />
                      <ellipse cx="105" cy="150" rx="14" ry="8" fill="#78350F" />
                      {/* Body & Tummy */}
                      <ellipse cx="85" cy="120" rx="34" ry="32" fill="#92400E" />
                      <ellipse cx="85" cy="122" rx="22" ry="22" fill="#FDE68A" />
                      {/* Ears */}
                      <circle cx="58" cy="38" r="11" fill="#78350F" />
                      <circle cx="58" cy="38" r="6" fill="#FDE68A" />
                      <circle cx="112" cy="38" r="11" fill="#78350F" />
                      <circle cx="112" cy="38" r="6" fill="#FDE68A" />
                      {/* Head & Muzzle */}
                      <circle cx="85" cy="52" r="27" fill="#92400E" />
                      <ellipse cx="85" cy="60" rx="14" ry="10" fill="#FDE68A" />
                      {/* Eyes */}
                      <circle cx="76" cy="48" r="3.5" fill="#1E293B" />
                      <circle cx="94" cy="48" r="3.5" fill="#1E293B" />
                      <circle cx="77" cy="46" r="1" fill="#FFFFFF" />
                      <circle cx="95" cy="46" r="1" fill="#FFFFFF" />
                      {/* Nose & Smile */}
                      <ellipse cx="85" cy="56" rx="5" ry="3.5" fill="#451A03" />
                      <path d="M 80 62 Q 85 67 90 62" stroke="#451A03" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                      {/* Honey Pot held in paws */}
                      <path d="M 72 105 L 98 105 L 94 135 L 76 135 Z" fill="#D97706" stroke="#92400E" strokeWidth="2" />
                      <ellipse cx="85" cy="105" rx="13" ry="4" fill="#FACC15" />
                      <text x="78" y="124" fontSize="11" fill="#FFFFFF" fontWeight="bold">HONEY</text>
                    </svg>
                  </motion.div>
                </div>
              )}

              {/* SCENE 6 — WE ARE HUMANS 👧🧒 */}
              {currentVerse.id === 'final_party' && (
                <div className="relative flex items-center justify-around w-full h-full px-2 z-10 overflow-hidden">
                  <motion.span animate={{ y: [-10, 8, -10] }} transition={{ duration: 1.8, repeat: Infinity }} className="text-4xl sm:text-5xl">🐵</motion.span>
                  <motion.span animate={{ y: [8, -10, 8] }} transition={{ duration: 2, repeat: Infinity }} className="text-4xl sm:text-5xl">🐰</motion.span>

                  {/* Preschool Children with Healthy Food Tray */}
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="flex flex-col items-center justify-center p-3 bg-white/95 rounded-2xl border-4 border-amber-300 shadow-lg z-20"
                  >
                    <div className="flex items-center gap-2 text-5xl">
                      <span>👧</span>
                      <span>🧒</span>
                    </div>
                    <div className="flex items-center gap-2 text-2xl mt-1 bg-amber-100 px-3 py-1 rounded-xl border border-amber-300">
                      <span title="Fruit">🍎</span>
                      <span title="Vegetables">🥦</span>
                      <span title="Milk">🥛</span>
                      <span title="Protein">🥩</span>
                    </div>
                  </motion.div>

                  <motion.span animate={{ y: [-10, 8, -10] }} transition={{ duration: 2.2, repeat: Infinity }} className="text-4xl sm:text-5xl">🐱</motion.span>
                  <motion.span animate={{ y: [8, -10, 8] }} transition={{ duration: 1.9, repeat: Infinity }} className="text-4xl sm:text-5xl">🦁</motion.span>
                  <motion.span animate={{ y: [-10, 8, -10] }} transition={{ duration: 2.1, repeat: Infinity }} className="text-4xl sm:text-5xl">🐻</motion.span>
                </div>
              )}
            </div>

            {/* Spoken Text Display Box */}
            <div className="w-full bg-white/95 rounded-2xl border-4 border-white p-3 shadow-md mt-2 flex flex-col items-center gap-1">
              <div className="flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-amber-800 animate-pulse shrink-0" />
                <p className={`text-base sm:text-lg font-black ${currentVerse.accentColor} tracking-wide`}>
                  {currentVerse.speechText}
                </p>
              </div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Tap card to replay narrator voice
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Celebration Banner when completed */}
        <AnimatePresence>
          {showCelebration && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="mt-3 bg-amber-300 border-4 border-amber-500 rounded-2xl p-3 text-center shadow-lg w-full flex items-center justify-center gap-2"
            >
              <Star className="w-8 h-8 fill-amber-500 text-amber-700 animate-spin" />
              <span className="text-lg sm:text-xl font-black text-amber-950 uppercase">
                ⭐ Star Unlocked! Tap NEXT to continue!
              </span>
              <Sparkles className="w-8 h-8 text-amber-600 animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Child-Friendly Bottom Navigation Controls (PREV, HOME, NEXT) */}
      <div className="w-full max-w-2xl mt-3 grid grid-cols-3 gap-3 sm:gap-6 z-30">
        {/* Previous Button */}
        <button
          type="button"
          onClick={handleInternalPrev}
          className="flex items-center justify-center gap-2 bg-[#4D96FF] hover:bg-blue-500 text-white font-black py-3.5 px-3 sm:px-6 rounded-3xl border-b-8 border-[#2563EB] shadow-xl active:border-b-2 active:translate-y-1.5 transition-all cursor-pointer text-base sm:text-xl uppercase"
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
          className="flex items-center justify-center gap-2 bg-[#F7D060] hover:bg-amber-400 text-amber-950 font-black py-3.5 px-3 sm:px-6 rounded-3xl border-b-8 border-[#CA8A04] shadow-xl active:border-b-2 active:translate-y-1.5 transition-all cursor-pointer text-base sm:text-xl uppercase"
        >
          <Home className="w-6 h-6 stroke-[3]" />
          <span>HOME</span>
        </button>

        {/* Next Button */}
        <button
          type="button"
          onClick={() => {
            if (isCompleted || isActivityCompleted) {
              soundManager.playPop();
              if (onNavigateNext) onNavigateNext();
            } else {
              soundManager.playPop();
            }
          }}
          className={`flex items-center justify-center gap-2 font-black py-3.5 px-3 sm:px-6 rounded-3xl shadow-xl transition-all text-base sm:text-xl uppercase ${
            isCompleted || isActivityCompleted
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
