import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Volume2, Star as StarIcon, ArrowRight, Check } from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { ActivityBottomNav } from './ActivityBottomNav';

interface BodyPartsProps {
  onCollectStar: () => void;
  onNavigateHome?: () => void;
  onNavigateNext?: () => void;
  onNavigatePrev?: () => void;
  isActivityCompleted?: boolean;
}

export type BodyPartKey =
  | 'eyes'
  | 'nose'
  | 'mouth'
  | 'ears'
  | 'hair'
  | 'head'
  | 'arms'
  | 'elbows'
  | 'hands'
  | 'fingers'
  | 'tummy'
  | 'legs'
  | 'knees'
  | 'feet';

export interface BodyPartInfo {
  id: BodyPartKey;
  name: string;
  emoji: string;
  question: string;
  successFeedback: string;
  color: string;
  borderColor: string;
  textColor: string;
  shadowColor: string;
}

export const BODY_PARTS_DATA: Record<BodyPartKey, BodyPartInfo> = {
  eyes: {
    id: 'eyes',
    name: 'Eyes',
    emoji: '👀',
    question: 'Can you find the eyes?',
    successFeedback: "Great job! Those are the eyes!",
    color: 'bg-sky-500',
    borderColor: 'border-sky-700',
    textColor: 'text-white',
    shadowColor: 'shadow-sky-700/50',
  },
  nose: {
    id: 'nose',
    name: 'Nose',
    emoji: '👃',
    question: 'Where is the nose?',
    successFeedback: "Great job! That's the nose!",
    color: 'bg-amber-500',
    borderColor: 'border-amber-700',
    textColor: 'text-white',
    shadowColor: 'shadow-amber-700/50',
  },
  mouth: {
    id: 'mouth',
    name: 'Mouth',
    emoji: '👄',
    question: 'Where is the mouth?',
    successFeedback: "Great job! That's the mouth!",
    color: 'bg-rose-500',
    borderColor: 'border-rose-700',
    textColor: 'text-white',
    shadowColor: 'shadow-rose-700/50',
  },
  ears: {
    id: 'ears',
    name: 'Ears',
    emoji: '👂',
    question: 'Where are the ears?',
    successFeedback: "Great job! Those are the ears!",
    color: 'bg-orange-500',
    borderColor: 'border-orange-700',
    textColor: 'text-white',
    shadowColor: 'shadow-orange-700/50',
  },
  hair: {
    id: 'hair',
    name: 'Hair',
    emoji: '💇',
    question: 'Can you find the hair?',
    successFeedback: "Great job! That's the hair!",
    color: 'bg-yellow-500',
    borderColor: 'border-yellow-700',
    textColor: 'text-amber-950',
    shadowColor: 'shadow-yellow-700/50',
  },
  head: {
    id: 'head',
    name: 'Head',
    emoji: '🧒',
    question: 'Where is the head?',
    successFeedback: "Great job! That's the head!",
    color: 'bg-violet-500',
    borderColor: 'border-violet-700',
    textColor: 'text-white',
    shadowColor: 'shadow-violet-700/50',
  },
  arms: {
    id: 'arms',
    name: 'Arms',
    emoji: '💪',
    question: 'Can you find the arms?',
    successFeedback: "Great job! Those are the arms!",
    color: 'bg-teal-500',
    borderColor: 'border-teal-700',
    textColor: 'text-white',
    shadowColor: 'shadow-teal-700/50',
  },
  elbows: {
    id: 'elbows',
    name: 'Elbows',
    emoji: '✨',
    question: 'Where are the elbows?',
    successFeedback: "Great job! Those are the elbows!",
    color: 'bg-indigo-500',
    borderColor: 'border-indigo-700',
    textColor: 'text-white',
    shadowColor: 'shadow-indigo-700/50',
  },
  hands: {
    id: 'hands',
    name: 'Hands',
    emoji: '🙌',
    question: 'Where are the hands?',
    successFeedback: "Great job! Those are the hands!",
    color: 'bg-emerald-500',
    borderColor: 'border-emerald-700',
    textColor: 'text-white',
    shadowColor: 'shadow-emerald-700/50',
  },
  fingers: {
    id: 'fingers',
    name: 'Fingers',
    emoji: '🖐️',
    question: 'Can you find the fingers?',
    successFeedback: "Great job! Those are the fingers!",
    color: 'bg-emerald-600',
    borderColor: 'border-emerald-800',
    textColor: 'text-white',
    shadowColor: 'shadow-emerald-800/50',
  },
  tummy: {
    id: 'tummy',
    name: 'Tummy',
    emoji: '👕',
    question: 'Where is the tummy?',
    successFeedback: "Great job! That's the tummy!",
    color: 'bg-blue-600',
    borderColor: 'border-blue-800',
    textColor: 'text-white',
    shadowColor: 'shadow-blue-800/50',
  },
  legs: {
    id: 'legs',
    name: 'Legs',
    emoji: '👖',
    question: 'Can you find the legs?',
    successFeedback: "Great job! Those are the legs!",
    color: 'bg-blue-500',
    borderColor: 'border-blue-700',
    textColor: 'text-white',
    shadowColor: 'shadow-blue-700/50',
  },
  knees: {
    id: 'knees',
    name: 'Knees',
    emoji: '🦵',
    question: 'Where are the knees?',
    successFeedback: "Great job! Those are the knees!",
    color: 'bg-purple-500',
    borderColor: 'border-purple-700',
    textColor: 'text-white',
    shadowColor: 'shadow-purple-700/50',
  },
  feet: {
    id: 'feet',
    name: 'Feet',
    emoji: '👟',
    question: 'Where are the feet?',
    successFeedback: "Great job! Those are the feet!",
    color: 'bg-pink-500',
    borderColor: 'border-pink-700',
    textColor: 'text-white',
    shadowColor: 'shadow-pink-700/50',
  },
};

export interface BodyChallenge {
  id: string;
  targetKey: BodyPartKey;
  options: BodyPartKey[]; // Shuffled 3 options (1 target + 2 distractors)
}

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Progressive 12 challenges starting with easiest/obvious parts
const generateChallenges = (): BodyChallenge[] => {
  const sequence: BodyPartKey[] = [
    'eyes',
    'nose',
    'mouth',
    'ears',
    'hands',
    'feet',
    'tummy',
    'hair',
    'elbows',
    'fingers',
    'knees',
    'legs',
  ];

  const allKeys: BodyPartKey[] = Object.keys(BODY_PARTS_DATA) as BodyPartKey[];

  return sequence.map((target, idx) => {
    const otherKeys = allKeys.filter((k) => k !== target);
    const shuffledOthers = shuffleArray(otherKeys);
    const distractors = shuffledOthers.slice(0, 2);
    const options = shuffleArray([target, ...distractors]);

    return {
      id: `body_c_${idx}_${Math.random().toString(36).substring(2, 6)}`,
      targetKey: target,
      options,
    };
  });
};

const GRADIENTS = [
  'from-teal-100 via-sky-50 to-amber-100',
  'from-amber-100 via-orange-50 to-teal-100',
  'from-sky-100 via-indigo-50 to-rose-100',
  'from-emerald-100 via-teal-50 to-sky-100',
  'from-purple-100 via-pink-50 to-amber-100',
];

export const BodyParts: React.FC<BodyPartsProps> = ({
  onCollectStar,
  onNavigateHome,
  onNavigateNext,
  onNavigatePrev,
  isActivityCompleted = false,
}) => {
  const [challenges, setChallenges] = useState<BodyChallenge[]>(generateChallenges);
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [bgGradient, setBgGradient] = useState(GRADIENTS[0]);

  const [tappedKey, setTappedKey] = useState<BodyPartKey | null>(null);
  const [shakingOption, setShakingOption] = useState<BodyPartKey | null>(null);
  const [isSuccessCelebrating, setIsSuccessCelebrating] = useState(false);
  const [isAllFinished, setIsAllFinished] = useState(false);

  const currentChallenge = challenges[currentChallengeIndex] || challenges[0];
  const targetInfo = BODY_PARTS_DATA[currentChallenge.targetKey];

  // Voice instruction on challenge change
  useEffect(() => {
    if (isAllFinished) return;
    soundManager.speak(targetInfo.question);
    setTappedKey(null);
    setShakingOption(null);
    setIsSuccessCelebrating(false);
    setBgGradient(GRADIENTS[currentChallengeIndex % GRADIENTS.length]);
  }, [currentChallengeIndex, isAllFinished]);

  // Handle body part selection (either from tapping the SVG character directly or from the option card)
  const handleSelectBodyPart = (selectedKey: BodyPartKey) => {
    if (isSuccessCelebrating || isAllFinished) return;

    if (selectedKey === currentChallenge.targetKey) {
      // CORRECT SELECTION
      setTappedKey(selectedKey);
      soundManager.playPop();
      soundManager.playCelebration();
      soundManager.speak(targetInfo.successFeedback);
      setIsSuccessCelebrating(true);

      setTimeout(() => {
        if (currentChallengeIndex + 1 >= challenges.length) {
          // Finished all challenges!
          onCollectStar();
          setIsAllFinished(true);
          soundManager.speak('You found all the body parts! Great job!');
        } else {
          // Advance to next challenge
          setCurrentChallengeIndex((prev) => prev + 1);
        }
      }, 1900);
    } else {
      // WRONG SELECTION
      soundManager.playPop();
      soundManager.speak('Try again!');
      setShakingOption(selectedKey);
      setTimeout(() => {
        setShakingOption(null);
      }, 600);
    }
  };

  // Full Replay / Play Again
  const handlePlayAgain = () => {
    soundManager.speak("Let's find body parts again!");
    setChallenges(generateChallenges());
    setCurrentChallengeIndex(0);
    setTappedKey(null);
    setShakingOption(null);
    setIsSuccessCelebrating(false);
    setIsAllFinished(false);
  };

  // Step-by-step previous navigation handler
  const handleInternalPrev = () => {
    soundManager.playPop();
    if (isAllFinished) {
      setIsAllFinished(false);
      setCurrentChallengeIndex(challenges.length - 1);
      setTappedKey(null);
      setIsSuccessCelebrating(false);
      setShakingOption(null);
    } else if (currentChallengeIndex > 0) {
      setCurrentChallengeIndex((prev) => prev - 1);
      setTappedKey(null);
      setIsSuccessCelebrating(false);
      setShakingOption(null);
    } else {
      if (onNavigatePrev) {
        onNavigatePrev();
      }
    }
  };

  const isTargetHighlighted = (key: BodyPartKey) => {
    return isSuccessCelebrating && currentChallenge.targetKey === key;
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center p-2 sm:p-4">
      {/* Top Banner Header */}
      <div className="w-full flex items-center justify-between bg-white border-4 border-amber-300 rounded-3xl px-4 sm:px-6 py-2.5 shadow-md mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl sm:text-3xl">🧒</span>
          <div>
            <h1 className="text-base sm:text-lg font-black text-amber-950 tracking-tight leading-tight">
              BODY PARTS
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

      {/* Main Play Area Card */}
      <div
        className={`w-full bg-gradient-to-br ${bgGradient} border-4 border-amber-400 rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col items-center relative overflow-hidden min-h-[540px] justify-between transition-colors duration-500`}
      >
        {/* Instruction Header Question */}
        <div className="text-center mt-1 mb-1">
          <div className="inline-flex items-center gap-2 bg-white px-6 py-2 rounded-full border-4 border-amber-300 shadow-md mb-1">
            <button
              type="button"
              onClick={() => soundManager.speak(targetInfo.question)}
              className="text-amber-600 hover:text-amber-800 transition-colors cursor-pointer"
              title="Repeat question"
            >
              <Volume2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <h2 className="text-base sm:text-2xl font-black text-amber-950 tracking-wide">
              {targetInfo.question}
            </h2>
          </div>
          <p className="text-xs sm:text-sm font-black text-slate-600 uppercase tracking-wide">
            Tap the body part directly on the character or choose a card!
          </p>
        </div>

        {/* INTERACTIVE CHILD CHARACTER STAGE */}
        <div className="relative w-full max-w-md flex flex-col items-center justify-center my-auto py-1">
          {/* Main Friendly Character SVG with Direct Embedded Exact Hit Areas */}
          <div className="relative w-64 h-84 sm:w-76 sm:h-96 select-none flex items-center justify-center">
            <svg
              viewBox="0 0 300 400"
              className="w-full h-full drop-shadow-xl overflow-visible"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* DEFS FOR GLOWS / FILTERS */}
              <defs>
                <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* SHADOW BASE */}
              <ellipse cx="150" cy="385" rx="72" ry="10" fill="#000000" opacity="0.12" />

              {/* ---------------- 1. HAIR (BACK) ---------------- */}
              <path
                d="M 92 88 C 85 35, 215 35, 208 88 C 215 110, 85 110, 92 88 Z"
                fill="#854D0E"
              />

              {/* ---------------- 2. HEAD / FACE BASE ---------------- */}
              <g id="body_head" className="transition-all duration-300">
                <circle
                  cx="150"
                  cy="95"
                  r="56"
                  fill="#FED7AA"
                  stroke={isTargetHighlighted('head') ? '#F59E0B' : '#FDBA74'}
                  strokeWidth={isTargetHighlighted('head') ? 7 : 4}
                  className="transition-all duration-300"
                />
              </g>

              {/* ---------------- 3. HAIR (FRONT TUFT) ---------------- */}
              <g
                id="body_hair"
                onClick={() => handleSelectBodyPart('hair')}
                className="cursor-pointer group"
                style={{ pointerEvents: 'all' }}
              >
                <path
                  d="M 94 76 C 110 32, 190 32, 206 76 C 185 60, 165 70, 150 58 C 135 70, 115 60, 94 76 Z"
                  fill={isTargetHighlighted('hair') ? '#CA8A04' : '#854D0E'}
                  className="transition-all duration-300 group-hover:brightness-110"
                />
                {/* Hair Hit Shape (strictly top of head, well above eyes/ears) */}
                <ellipse cx="150" cy="52" rx="55" ry="24" fill="transparent" />
              </g>

              {/* ---------------- 4. EARS (LEFT & RIGHT) ---------------- */}
              {/* Left Ear - strictly on the far left side (cx=88) */}
              <g
                id="body_ear_left"
                onClick={() => handleSelectBodyPart('ears')}
                className="cursor-pointer group"
                style={{ pointerEvents: 'all' }}
              >
                <circle
                  cx="88"
                  cy="96"
                  r="16"
                  fill="#FED7AA"
                  stroke={isTargetHighlighted('ears') ? '#EA580C' : '#FDBA74'}
                  strokeWidth={isTargetHighlighted('ears') ? 5 : 3}
                  className="transition-all duration-300 group-hover:brightness-110"
                />
                <circle cx="88" cy="96" r="9" fill={isTargetHighlighted('ears') ? '#FB923C' : '#FDBA74'} />
                {/* Dedicated Ear Hit Circle (r=22, centered on ear, separated from eye by >35px) */}
                <circle cx="86" cy="96" r="22" fill="transparent" />
              </g>

              {/* Right Ear - strictly on the far right side (cx=212) */}
              <g
                id="body_ear_right"
                onClick={() => handleSelectBodyPart('ears')}
                className="cursor-pointer group"
                style={{ pointerEvents: 'all' }}
              >
                <circle
                  cx="212"
                  cy="96"
                  r="16"
                  fill="#FED7AA"
                  stroke={isTargetHighlighted('ears') ? '#EA580C' : '#FDBA74'}
                  strokeWidth={isTargetHighlighted('ears') ? 5 : 3}
                  className="transition-all duration-300 group-hover:brightness-110"
                />
                <circle cx="212" cy="96" r="9" fill={isTargetHighlighted('ears') ? '#FB923C' : '#FDBA74'} />
                {/* Dedicated Ear Hit Circle */}
                <circle cx="214" cy="96" r="22" fill="transparent" />
              </g>

              {/* CHEEKS BLUSH */}
              <circle cx="118" cy="112" r="8" fill="#FDA4AF" opacity="0.6" />
              <circle cx="182" cy="112" r="8" fill="#FDA4AF" opacity="0.6" />

              {/* ---------------- 5. EYES (LEFT & RIGHT) ---------------- */}
              <g
                id="body_eyes"
                onClick={() => handleSelectBodyPart('eyes')}
                className="cursor-pointer group"
                style={{ pointerEvents: 'all' }}
              >
                {/* Left Eye */}
                <g className={isTargetHighlighted('eyes') ? 'scale-110 origin-center' : ''}>
                  <ellipse cx="126" cy="92" rx="9" ry="11" fill="#1E293B" />
                  <circle cx="123" cy="89" r="3.5" fill="#FFFFFF" />
                  {/* Eyebrow */}
                  <path d="M 115 76 Q 126 70 135 77" stroke="#854D0E" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                </g>

                {/* Right Eye */}
                <g className={isTargetHighlighted('eyes') ? 'scale-110 origin-center' : ''}>
                  <ellipse cx="174" cy="92" rx="9" ry="11" fill="#1E293B" />
                  <circle cx="171" cy="89" r="3.5" fill="#FFFFFF" />
                  {/* Eyebrow */}
                  <path d="M 165 77 Q 174 70 185 76" stroke="#854D0E" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                </g>

                {/* Controlled non-overlapping Eyes Hit Area (cx=150, cy=88, rx=38, ry=18) strictly between the ears */}
                <ellipse cx="150" cy="88" rx="38" ry="18" fill="transparent" />
              </g>

              {/* ---------------- 6. NOSE ---------------- */}
              <g
                id="body_nose"
                onClick={() => handleSelectBodyPart('nose')}
                className="cursor-pointer group"
                style={{ pointerEvents: 'all' }}
              >
                <path
                  d="M 150 98 Q 155 106 147 108"
                  stroke={isTargetHighlighted('nose') ? '#E11D48' : '#EA580C'}
                  strokeWidth={isTargetHighlighted('nose') ? 5 : 3.5}
                  fill="none"
                  strokeLinecap="round"
                  className="transition-all duration-300 group-hover:stroke-rose-600"
                />
                {/* Controlled Nose Hit Area strictly between eyes & mouth (cx=150, cy=104, r=14) */}
                <circle cx="150" cy="104" r="14" fill="transparent" />
              </g>

              {/* ---------------- 7. MOUTH ---------------- */}
              <g
                id="body_mouth"
                onClick={() => handleSelectBodyPart('mouth')}
                className="cursor-pointer group"
                style={{ pointerEvents: 'all' }}
              >
                <path
                  d="M 132 122 Q 150 140 168 122"
                  stroke="#E11D48"
                  strokeWidth={isTargetHighlighted('mouth') ? 5 : 4}
                  fill={isTargetHighlighted('mouth') ? '#F43F5E' : '#BE123C'}
                  strokeLinecap="round"
                  className="transition-all duration-300"
                />
                {/* Controlled Mouth Hit Area strictly on smile (cx=150, cy=126, rx=24, ry=14) */}
                <ellipse cx="150" cy="126" rx="24" ry="14" fill="transparent" />
              </g>

              {/* ---------------- 8. NECK ---------------- */}
              <rect x="140" y="148" width="20" height="16" fill="#FDBA74" rx="4" />

              {/* ---------------- 9. ARMS (LEFT & RIGHT) ---------------- */}
              {/* Left Arm Upper & Lower */}
              <g
                id="body_arm_left"
                onClick={() => handleSelectBodyPart('arms')}
                className="cursor-pointer group"
                style={{ pointerEvents: 'all' }}
              >
                <path
                  d="M 105 174 Q 68 198 56 226"
                  stroke={isTargetHighlighted('arms') ? '#0D9488' : '#38BDF8'}
                  strokeWidth="20"
                  strokeLinecap="round"
                  fill="none"
                  className="transition-all duration-300 group-hover:stroke-sky-400"
                />
                {/* Arm Hit Area */}
                <path
                  d="M 105 174 Q 68 198 56 226"
                  stroke="transparent"
                  strokeWidth="32"
                  strokeLinecap="round"
                  fill="none"
                />
              </g>

              {/* Right Arm Upper & Lower */}
              <g
                id="body_arm_right"
                onClick={() => handleSelectBodyPart('arms')}
                className="cursor-pointer group"
                style={{ pointerEvents: 'all' }}
              >
                <path
                  d="M 195 174 Q 232 198 244 226"
                  stroke={isTargetHighlighted('arms') ? '#0D9488' : '#38BDF8'}
                  strokeWidth="20"
                  strokeLinecap="round"
                  fill="none"
                  className="transition-all duration-300 group-hover:stroke-sky-400"
                />
                {/* Arm Hit Area */}
                <path
                  d="M 195 174 Q 232 198 244 226"
                  stroke="transparent"
                  strokeWidth="32"
                  strokeLinecap="round"
                  fill="none"
                />
              </g>

              {/* ---------------- 10. ELBOWS (LEFT & RIGHT) ---------------- */}
              {/* Left Elbow */}
              <g
                id="body_elbow_left"
                onClick={() => handleSelectBodyPart('elbows')}
                className="cursor-pointer group"
                style={{ pointerEvents: 'all' }}
              >
                <circle
                  cx="70"
                  cy="200"
                  r="12"
                  fill={isTargetHighlighted('elbows') ? '#6366F1' : '#0284C7'}
                  stroke={isTargetHighlighted('elbows') ? '#4338CA' : '#0369A1'}
                  strokeWidth={isTargetHighlighted('elbows') ? 4 : 2}
                  className="transition-all duration-300 group-hover:brightness-125"
                />
                <circle cx="70" cy="200" r="5" fill="#BAE6FD" />
                {/* Dedicated Elbow Hit Circle */}
                <circle cx="70" cy="200" r="18" fill="transparent" />
              </g>

              {/* Right Elbow */}
              <g
                id="body_elbow_right"
                onClick={() => handleSelectBodyPart('elbows')}
                className="cursor-pointer group"
                style={{ pointerEvents: 'all' }}
              >
                <circle
                  cx="230"
                  cy="200"
                  r="12"
                  fill={isTargetHighlighted('elbows') ? '#6366F1' : '#0284C7'}
                  stroke={isTargetHighlighted('elbows') ? '#4338CA' : '#0369A1'}
                  strokeWidth={isTargetHighlighted('elbows') ? 4 : 2}
                  className="transition-all duration-300 group-hover:brightness-125"
                />
                <circle cx="230" cy="200" r="5" fill="#BAE6FD" />
                {/* Dedicated Elbow Hit Circle */}
                <circle cx="230" cy="200" r="18" fill="transparent" />
              </g>

              {/* ---------------- 11. SHIRT / BODY (TUMMY) ---------------- */}
              <g
                id="body_tummy"
                onClick={() => handleSelectBodyPart('tummy')}
                className="cursor-pointer group"
                style={{ pointerEvents: 'all' }}
              >
                <path
                  d="M 105 164 Q 150 154 195 164 L 205 248 Q 150 254 95 248 Z"
                  fill={isTargetHighlighted('tummy') ? '#2563EB' : '#0284C7'}
                  stroke={isTargetHighlighted('tummy') ? '#1D4ED8' : '#0369A1'}
                  strokeWidth="4"
                  className="transition-all duration-300 group-hover:brightness-110"
                />
                {/* Cute Star on Shirt */}
                <circle cx="150" cy="202" r="16" fill="#FDE047" opacity="0.9" />
                <text x="150" y="208" textAnchor="middle" fontSize="16" fill="#713F12" fontWeight="bold">
                  ⭐
                </text>
                {/* Tummy Hit Area */}
                <rect x="105" y="166" width="90" height="78" rx="16" fill="transparent" />
              </g>

              {/* ---------------- 12. HANDS & FINGERS (LEFT & RIGHT) ---------------- */}
              {/* Left Hand & Cartoon Fingers */}
              <g
                id="body_hand_left"
                onClick={() => handleSelectBodyPart('hands')}
                className="cursor-pointer group"
                style={{ pointerEvents: 'all' }}
              >
                {/* Palm Base */}
                <circle
                  cx="50"
                  cy="234"
                  r="15"
                  fill="#FED7AA"
                  stroke={isTargetHighlighted('hands') ? '#059669' : '#FDBA74'}
                  strokeWidth={isTargetHighlighted('hands') ? 4 : 3}
                  className="transition-all duration-300"
                />

                {/* Cartoon Fingers on Left Hand */}
                <g
                  id="body_fingers_left"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectBodyPart('fingers');
                  }}
                  className="cursor-pointer"
                  style={{ pointerEvents: 'all' }}
                >
                  {/* Thumb */}
                  <circle
                    cx="64"
                    cy="230"
                    r="5"
                    fill={isTargetHighlighted('fingers') ? '#34D399' : '#FED7AA'}
                    stroke={isTargetHighlighted('fingers') ? '#047857' : '#FDBA74'}
                    strokeWidth="2"
                  />
                  {/* Index */}
                  <circle
                    cx="56"
                    cy="248"
                    r="5"
                    fill={isTargetHighlighted('fingers') ? '#34D399' : '#FED7AA'}
                    stroke={isTargetHighlighted('fingers') ? '#047857' : '#FDBA74'}
                    strokeWidth="2"
                  />
                  {/* Middle */}
                  <circle
                    cx="48"
                    cy="252"
                    r="5"
                    fill={isTargetHighlighted('fingers') ? '#34D399' : '#FED7AA'}
                    stroke={isTargetHighlighted('fingers') ? '#047857' : '#FDBA74'}
                    strokeWidth="2"
                  />
                  {/* Ring */}
                  <circle
                    cx="40"
                    cy="248"
                    r="5"
                    fill={isTargetHighlighted('fingers') ? '#34D399' : '#FED7AA'}
                    stroke={isTargetHighlighted('fingers') ? '#047857' : '#FDBA74'}
                    strokeWidth="2"
                  />
                  {/* Pinky */}
                  <circle
                    cx="34"
                    cy="240"
                    r="4.5"
                    fill={isTargetHighlighted('fingers') ? '#34D399' : '#FED7AA'}
                    stroke={isTargetHighlighted('fingers') ? '#047857' : '#FDBA74'}
                    strokeWidth="2"
                  />
                  {/* Dedicated Fingers Hit Circle */}
                  <circle cx="48" cy="246" r="18" fill="transparent" />
                </g>

                {/* Hand Palm Hit Area */}
                <circle cx="50" cy="234" r="18" fill="transparent" />
              </g>

              {/* Right Hand & Cartoon Fingers */}
              <g
                id="body_hand_right"
                onClick={() => handleSelectBodyPart('hands')}
                className="cursor-pointer group"
                style={{ pointerEvents: 'all' }}
              >
                {/* Palm Base */}
                <circle
                  cx="250"
                  cy="234"
                  r="15"
                  fill="#FED7AA"
                  stroke={isTargetHighlighted('hands') ? '#059669' : '#FDBA74'}
                  strokeWidth={isTargetHighlighted('hands') ? 4 : 3}
                  className="transition-all duration-300"
                />

                {/* Cartoon Fingers on Right Hand */}
                <g
                  id="body_fingers_right"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectBodyPart('fingers');
                  }}
                  className="cursor-pointer"
                  style={{ pointerEvents: 'all' }}
                >
                  {/* Thumb */}
                  <circle
                    cx="236"
                    cy="230"
                    r="5"
                    fill={isTargetHighlighted('fingers') ? '#34D399' : '#FED7AA'}
                    stroke={isTargetHighlighted('fingers') ? '#047857' : '#FDBA74'}
                    strokeWidth="2"
                  />
                  {/* Index */}
                  <circle
                    cx="244"
                    cy="248"
                    r="5"
                    fill={isTargetHighlighted('fingers') ? '#34D399' : '#FED7AA'}
                    stroke={isTargetHighlighted('fingers') ? '#047857' : '#FDBA74'}
                    strokeWidth="2"
                  />
                  {/* Middle */}
                  <circle
                    cx="252"
                    cy="252"
                    r="5"
                    fill={isTargetHighlighted('fingers') ? '#34D399' : '#FED7AA'}
                    stroke={isTargetHighlighted('fingers') ? '#047857' : '#FDBA74'}
                    strokeWidth="2"
                  />
                  {/* Ring */}
                  <circle
                    cx="260"
                    cy="248"
                    r="5"
                    fill={isTargetHighlighted('fingers') ? '#34D399' : '#FED7AA'}
                    stroke={isTargetHighlighted('fingers') ? '#047857' : '#FDBA74'}
                    strokeWidth="2"
                  />
                  {/* Pinky */}
                  <circle
                    cx="266"
                    cy="240"
                    r="4.5"
                    fill={isTargetHighlighted('fingers') ? '#34D399' : '#FED7AA'}
                    stroke={isTargetHighlighted('fingers') ? '#047857' : '#FDBA74'}
                    strokeWidth="2"
                  />
                  {/* Dedicated Fingers Hit Circle */}
                  <circle cx="252" cy="246" r="18" fill="transparent" />
                </g>

                {/* Hand Palm Hit Area */}
                <circle cx="250" cy="234" r="18" fill="transparent" />
              </g>

              {/* ---------------- 13. SHORTS ---------------- */}
              <path
                d="M 98 246 L 202 246 L 205 284 L 158 284 L 150 268 L 142 284 L 95 284 Z"
                fill="#4F46E5"
                stroke="#3730A3"
                strokeWidth="3"
              />

              {/* ---------------- 14. LEGS (LEFT & RIGHT) ---------------- */}
              {/* Left Leg */}
              <g
                id="body_leg_left"
                onClick={() => handleSelectBodyPart('legs')}
                className="cursor-pointer group"
                style={{ pointerEvents: 'all' }}
              >
                <path
                  d="M 120 284 L 120 345"
                  stroke={isTargetHighlighted('legs') ? '#3B82F6' : '#FED7AA'}
                  strokeWidth="18"
                  strokeLinecap="round"
                  className="transition-all duration-300"
                />
                {/* Left Leg Hit Area */}
                <path d="M 120 284 L 120 345" stroke="transparent" strokeWidth="26" strokeLinecap="round" />
              </g>

              {/* Right Leg */}
              <g
                id="body_leg_right"
                onClick={() => handleSelectBodyPart('legs')}
                className="cursor-pointer group"
                style={{ pointerEvents: 'all' }}
              >
                <path
                  d="M 180 284 L 180 345"
                  stroke={isTargetHighlighted('legs') ? '#3B82F6' : '#FED7AA'}
                  strokeWidth="18"
                  strokeLinecap="round"
                  className="transition-all duration-300"
                />
                {/* Right Leg Hit Area */}
                <path d="M 180 284 L 180 345" stroke="transparent" strokeWidth="26" strokeLinecap="round" />
              </g>

              {/* ---------------- 15. KNEES (LEFT & RIGHT) ---------------- */}
              {/* Left Knee */}
              <g
                id="body_knee_left"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectBodyPart('knees');
                }}
                className="cursor-pointer group"
                style={{ pointerEvents: 'all' }}
              >
                <circle
                  cx="120"
                  cy="318"
                  r="11"
                  fill={isTargetHighlighted('knees') ? '#A855F7' : '#FDBA74'}
                  stroke={isTargetHighlighted('knees') ? '#7E22CE' : '#F97316'}
                  strokeWidth={isTargetHighlighted('knees') ? 4 : 2}
                  className="transition-all duration-300"
                />
                <circle cx="120" cy="318" r="17" fill="transparent" />
              </g>

              {/* Right Knee */}
              <g
                id="body_knee_right"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectBodyPart('knees');
                }}
                className="cursor-pointer group"
                style={{ pointerEvents: 'all' }}
              >
                <circle
                  cx="180"
                  cy="318"
                  r="11"
                  fill={isTargetHighlighted('knees') ? '#A855F7' : '#FDBA74'}
                  stroke={isTargetHighlighted('knees') ? '#7E22CE' : '#F97316'}
                  strokeWidth={isTargetHighlighted('knees') ? 4 : 2}
                  className="transition-all duration-300"
                />
                <circle cx="180" cy="318" r="17" fill="transparent" />
              </g>

              {/* ---------------- 16. FEET / SHOES (LEFT & RIGHT) ---------------- */}
              {/* Left Foot */}
              <g
                id="body_foot_left"
                onClick={() => handleSelectBodyPart('feet')}
                className="cursor-pointer group"
                style={{ pointerEvents: 'all' }}
              >
                <path
                  d="M 95 362 C 95 348, 138 348, 138 362 C 138 372, 95 372, 95 362 Z"
                  fill={isTargetHighlighted('feet') ? '#EC4899' : '#EF4444'}
                  stroke={isTargetHighlighted('feet') ? '#BE185D' : '#B91C1C'}
                  strokeWidth={isTargetHighlighted('feet') ? 4 : 3}
                  className="transition-all duration-300"
                />
                <rect x="100" y="362" width="32" height="4" fill="#FFFFFF" rx="1" />
                {/* Dedicated Foot Hit Area */}
                <ellipse cx="116" cy="362" rx="26" ry="15" fill="transparent" />
              </g>

              {/* Right Foot */}
              <g
                id="body_foot_right"
                onClick={() => handleSelectBodyPart('feet')}
                className="cursor-pointer group"
                style={{ pointerEvents: 'all' }}
              >
                <path
                  d="M 162 362 C 162 348, 205 348, 205 362 C 205 372, 162 372, 162 362 Z"
                  fill={isTargetHighlighted('feet') ? '#EC4899' : '#EF4444'}
                  stroke={isTargetHighlighted('feet') ? '#BE185D' : '#B91C1C'}
                  strokeWidth={isTargetHighlighted('feet') ? 4 : 3}
                  className="transition-all duration-300"
                />
                <rect x="168" y="362" width="32" height="4" fill="#FFFFFF" rx="1" />
                {/* Dedicated Foot Hit Area */}
                <ellipse cx="184" cy="362" rx="26" ry="15" fill="transparent" />
              </g>
            </svg>
          </div>
        </div>

        {/* 3 SHUFFLED ANSWER CARDS (BOTTOM AREA) */}
        <div className="w-full max-w-2xl flex flex-col items-center mt-2 mb-1">
          <div className="text-xs sm:text-sm font-black text-amber-950 uppercase tracking-wider mb-2 select-none">
            Or Tap The Word Card Below
          </div>

          <div className="w-full flex items-center justify-center gap-3 sm:gap-5 p-2 bg-white/70 backdrop-blur-xs rounded-3xl border-3 border-amber-200 shadow-inner">
            {currentChallenge.options.map((optionKey) => {
              const info = BODY_PARTS_DATA[optionKey];
              const isTarget = optionKey === currentChallenge.targetKey;
              const isShaking = shakingOption === optionKey;
              const isSelected = isSuccessCelebrating && isTarget;

              return (
                <motion.button
                  key={`opt_${optionKey}`}
                  type="button"
                  onClick={() => handleSelectBodyPart(optionKey)}
                  disabled={isSuccessCelebrating}
                  animate={
                    isShaking
                      ? { x: [-8, 8, -8, 8, 0] }
                      : isSelected
                      ? { scale: 1.08 }
                      : { scale: 1 }
                  }
                  transition={{ duration: isShaking ? 0.4 : 0.2 }}
                  className={`relative flex-1 max-w-[180px] flex flex-col items-center justify-center py-3.5 sm:py-4 px-2 sm:px-4 rounded-2xl sm:rounded-3xl border-b-6 shadow-lg transition-all select-none cursor-pointer active:scale-95 touch-none ${
                    info.color
                  } ${info.borderColor} ${info.shadowColor} ${info.textColor} ${
                    isSelected
                      ? 'ring-4 ring-white ring-offset-3 ring-offset-amber-500 scale-105'
                      : 'hover:scale-105 active:scale-95'
                  }`}
                >
                  <span className="text-2xl sm:text-4xl drop-shadow-md">{info.emoji}</span>
                  <span className="font-black text-sm sm:text-base tracking-wide mt-1 uppercase">
                    {info.name}
                  </span>

                  {isSelected && (
                    <span className="absolute -top-2 -right-2 bg-emerald-500 text-white rounded-full p-1 border-2 border-white shadow-md">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* SINGLE CHALLENGE SUCCESS OVERLAY */}
        <AnimatePresence>
          {isSuccessCelebrating && !isAllFinished && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 z-30 flex items-center justify-center bg-black/20 backdrop-blur-xs p-4 pointer-events-none"
            >
              <div className="bg-white border-6 border-amber-400 rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center animate-bounce">
                <div className="text-5xl mb-2">{targetInfo.emoji}</div>
                <h3 className="text-2xl sm:text-3xl font-black text-amber-950 uppercase tracking-wide">
                  Great Job!
                </h3>
                <p className="text-base sm:text-lg font-black text-amber-800 mt-1">
                  That's the {targetInfo.name}!
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ALL CHALLENGES FINISHED CELEBRATION OVERLAY */}
        <AnimatePresence>
          {isAllFinished && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 z-40 flex items-center justify-center bg-white/95 backdrop-blur-sm p-4"
            >
              <div className="bg-gradient-to-b from-amber-50 to-orange-50 border-8 border-amber-400 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col items-center text-center max-w-md w-full">
                <div className="text-6xl sm:text-7xl mb-2 animate-bounce">🌟</div>
                <h3 className="text-2xl sm:text-3xl font-black text-amber-950 tracking-tight">
                  BODY PARTS MASTER!
                </h3>
                <p className="text-sm sm:text-base font-bold text-amber-800 mt-2 mb-4">
                  You discovered and identified all the body parts!
                </p>

                <div className="flex items-center gap-2 bg-amber-200 border-2 border-amber-400 px-4 py-2 rounded-full font-black text-amber-950 text-base mb-6">
                  <StarIcon className="w-6 h-6 fill-amber-400 text-amber-600" />
                  <span>STAR EARNED!</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <button
                    type="button"
                    onClick={handlePlayAgain}
                    className="flex-1 flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-500 text-amber-950 font-black py-3.5 px-6 rounded-2xl border-b-6 border-amber-600 shadow-lg active:border-b-2 active:translate-y-1 transition-all cursor-pointer text-base uppercase"
                  >
                    <RotateCcw className="w-5 h-5 stroke-[3]" />
                    <span>Play Again</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (onNavigateNext) onNavigateNext();
                      else if (onNavigateHome) onNavigateHome();
                    }}
                    className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-black py-3.5 px-6 rounded-2xl border-b-6 border-emerald-700 shadow-lg active:border-b-2 active:translate-y-1 transition-all cursor-pointer text-base uppercase"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-5 h-5 stroke-[3]" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Standard Bottom Navigation: [ PREV ] [ HOME ] [ NEXT ] */}
      <ActivityBottomNav
        onNavigatePrev={handleInternalPrev}
        onNavigateHome={onNavigateHome}
        onNavigateNext={onNavigateNext}
        isNextUnlocked={isActivityCompleted || isAllFinished}
      />
    </div>
  );
};
