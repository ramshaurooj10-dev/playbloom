import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  RotateCcw,
  Volume2,
  Star,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { ActivityBottomNav } from './ActivityBottomNav';

// ----------------------------------------------------------------------------
// TYPES & DEFINITIONS
// ----------------------------------------------------------------------------

export type LightColor = 'red' | 'yellow' | 'green';

export interface TrafficRound {
  id: string;
  targetColor: LightColor;
  actionWord: 'STOP' | 'SLOW' | 'GO';
  promptSpeech: string;
  repeatSpeech: string;
  hintSpeech: string;
  praiseSpeech: string;
}

export interface Vehicle {
  id: string;
  type: 'car' | 'bus' | 'truck' | 'van' | 'taxi';
  color: string;
  secondaryColor: string;
  accentColor: string;
  xPercent: number; // 0 to 100
  lane: 'top' | 'bottom'; // slight vertical offset in road
  baseSpeed: number; // normal speed multiplier
  name: string;
}

const VEHICLE_PRESETS: Omit<Vehicle, 'id' | 'xPercent'>[] = [
  {
    type: 'car',
    color: '#EF4444',
    secondaryColor: '#B91C1C',
    accentColor: '#FEF08A',
    lane: 'top',
    baseSpeed: 1.05,
    name: 'Red Car',
  },
  {
    type: 'bus',
    color: '#FBBF24',
    secondaryColor: '#D97706',
    accentColor: '#1E293B',
    lane: 'bottom',
    baseSpeed: 0.85,
    name: 'Yellow Bus',
  },
  {
    type: 'truck',
    color: '#10B981',
    secondaryColor: '#047857',
    accentColor: '#F59E0B',
    lane: 'top',
    baseSpeed: 0.95,
    name: 'Green Truck',
  },
  {
    type: 'taxi',
    color: '#F59E0B',
    secondaryColor: '#B45309',
    accentColor: '#1E293B',
    lane: 'bottom',
    baseSpeed: 1.1,
    name: 'Taxi',
  },
  {
    type: 'van',
    color: '#8B5CF6',
    secondaryColor: '#6D28D9',
    accentColor: '#EC4899',
    lane: 'top',
    baseSpeed: 0.9,
    name: 'Purple Van',
  },
];

// Generate randomized vehicle fleet with distributed starting positions
function generateVehicles(): Vehicle[] {
  const count = 4;
  const shuffledPresets = [...VEHICLE_PRESETS].sort(() => Math.random() - 0.5).slice(0, count);
  const spacing = 100 / count;

  return shuffledPresets.map((preset, idx) => ({
    ...preset,
    id: `veh_${idx}_${Date.now()}_${Math.random()}`,
    xPercent: (idx * spacing + 10 + Math.random() * 8) % 100,
    lane: idx % 2 === 0 ? 'top' : 'bottom',
  }));
}

type ActionWord = 'STOP' | 'SLOW' | 'GO';

// Generate rounds for the two-round game
function createTrafficStep(action: ActionWord): TrafficRound {
  if (action === 'STOP') {
    return {
      id: `step_stop_${Date.now()}_${Math.random()}`,
      targetColor: 'red',
      actionWord: 'STOP',
      promptSpeech: 'STOP THE TRAFFIC!',
      repeatSpeech: 'Which light stops the traffic? Tap the RED STOP light!',
      hintSpeech: 'Red means STOP! Tap the RED STOP light!',
      praiseSpeech: 'Great job! Red means STOP!',
    };
  }
  if (action === 'SLOW') {
    return {
      id: `step_slow_${Date.now()}_${Math.random()}`,
      targetColor: 'yellow',
      actionWord: 'SLOW',
      promptSpeech: 'SLOW THE TRAFFIC!',
      repeatSpeech: 'Which light slows the traffic? Tap the YELLOW SLOW light!',
      hintSpeech: 'Yellow means SLOW! Tap the YELLOW SLOW light!',
      praiseSpeech: 'Great job! Yellow means SLOW!',
    };
  }
  return {
    id: `step_go_${Date.now()}_${Math.random()}`,
    targetColor: 'green',
    actionWord: 'GO',
    promptSpeech: 'GO THE TRAFFIC!',
    repeatSpeech: 'Which light lets the traffic go? Tap the GREEN GO light!',
    hintSpeech: 'Green means GO! Tap the GREEN GO light!',
    praiseSpeech: 'Great job! Green means GO!',
  };
}

// Generate all permutations of 3 actions
const ACTION_PERMUTATIONS: ActionWord[][] = [
  ['STOP', 'SLOW', 'GO'],
  ['STOP', 'GO', 'SLOW'],
  ['SLOW', 'STOP', 'GO'],
  ['SLOW', 'GO', 'STOP'],
  ['GO', 'STOP', 'SLOW'],
  ['GO', 'SLOW', 'STOP'],
];

function getRandomPermutation(excludeFirstAction?: ActionWord): ActionWord[] {
  let candidates: ActionWord[][] = ACTION_PERMUTATIONS;
  if (excludeFirstAction) {
    const filtered = ACTION_PERMUTATIONS.filter((p) => p[0] !== excludeFirstAction);
    if (filtered.length > 0) {
      candidates = filtered;
    }
  }
  const picked = candidates[Math.floor(Math.random() * candidates.length)];
  return [...picked];
}

function generateRounds(previousFirstAction?: ActionWord): TrafficRound[] {
  // If previousFirstAction is given (i.e. on replay), pick a permutation that starts differently
  const round1Actions: ActionWord[] = previousFirstAction
    ? getRandomPermutation(previousFirstAction)
    : (['STOP', 'SLOW', 'GO'] as ActionWord[]);

  // Round 2: Randomly shuffled permutation
  const round2Actions: ActionWord[] = getRandomPermutation(round1Actions[round1Actions.length - 1]);

  const allActions: ActionWord[] = [...round1Actions, ...round2Actions];
  return allActions.map((action: ActionWord) => createTrafficStep(action));
}

// ----------------------------------------------------------------------------
// COMPONENT PROPS
// ----------------------------------------------------------------------------

interface TrafficLightFunProps {
  onCollectStar?: () => void;
  onNavigateHome?: () => void;
  onNavigateNext?: () => void;
  onNavigatePrev?: () => void;
  isActivityCompleted?: boolean;
}

// ----------------------------------------------------------------------------
// MAIN COMPONENT
// ----------------------------------------------------------------------------

export const TrafficLightFun: React.FC<TrafficLightFunProps> = ({
  onCollectStar,
  onNavigateHome,
  onNavigateNext,
  onNavigatePrev,
  isActivityCompleted = false,
}) => {
  // Game Rounds State
  const [rounds, setRounds] = useState<TrafficRound[]>(generateRounds);
  const [currentRoundIdx, setCurrentRoundIdx] = useState<number>(0);
  const [activeLight, setActiveLight] = useState<LightColor>('green'); // Start with cars driving
  const [vehicles, setVehicles] = useState<Vehicle[]>(generateVehicles);

  // Phases: 'playing' | 'celebrating' | 'completed'
  const [phase, setPhase] = useState<'playing' | 'celebrating' | 'completed'>('playing');
  const [wrongShakeColor, setWrongShakeColor] = useState<LightColor | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number }[]>([]);
  const [honkingVehicleId, setHonkingVehicleId] = useState<string | null>(null);

  const currentRound = rounds[currentRoundIdx] || rounds[0];

  // Timers ref for cleanup
  const timersRef = useRef<NodeJS.Timeout[]>([]);
  const addTimer = (fn: () => void, ms: number) => {
    const timer = setTimeout(fn, ms);
    timersRef.current.push(timer);
    return timer;
  };

  const clearAllTimers = () => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  };

  // Speed physics calculation
  // currentSpeed is smoothed towards targetSpeed
  const speedRef = useRef<number>(1.0); // 1.0 = green, 0.35 = yellow, 0 = red
  const targetSpeedRef = useRef<number>(1.0);
  const vehiclesRef = useRef<Vehicle[]>(vehicles);
  vehiclesRef.current = vehicles;

  // --------------------------------------------------------------------------
  // BACKGROUND MUSIC & SOUND INITIALIZATION
  // --------------------------------------------------------------------------

  useEffect(() => {
    soundManager.startBackgroundMusic();
    return () => {
      clearAllTimers();
    };
  }, []);

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundManager.enabled = !next;
    if (next) {
      soundManager.stopBackgroundMusic();
    } else {
      soundManager.startBackgroundMusic();
    }
  };

  // --------------------------------------------------------------------------
  // SMOOTH ROAD VEHICLE ANIMATION LOOP (requestAnimationFrame)
  // --------------------------------------------------------------------------

  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const animate = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // Update target speed based on active light
      if (activeLight === 'green') {
        targetSpeedRef.current = 1.0;
      } else if (activeLight === 'yellow') {
        targetSpeedRef.current = 0.38; // noticeably slow crawl
      } else {
        targetSpeedRef.current = 0.0; // complete stop
      }

      // Smooth deceleration / acceleration
      const lerpFactor = activeLight === 'red' ? 3.2 : 2.4;
      speedRef.current += (targetSpeedRef.current - speedRef.current) * Math.min(dt * lerpFactor, 1.0);

      // Advance vehicles if speed > 0.005
      if (speedRef.current > 0.005) {
        setVehicles((prevVehicles) =>
          prevVehicles.map((veh) => {
            const speed = speedRef.current * veh.baseSpeed * 14 * dt;
            let newX = veh.xPercent + speed;
            if (newX > 108) {
              newX = -12; // wrap around seamlessly
            }
            return {
              ...veh,
              xPercent: newX,
            };
          })
        );
      }

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [activeLight]);

  // --------------------------------------------------------------------------
  // START / SETUP ROUND
  // --------------------------------------------------------------------------

  const startRound = useCallback((roundIdx: number, roundList: TrafficRound[]) => {
    clearAllTimers();
    const round = roundList[roundIdx];
    if (!round) return;

    setPhase('playing');
    setWrongShakeColor(null);

    // Speak the instruction
    addTimer(() => {
      soundManager.speak(round.promptSpeech);
    }, 300);
  }, []);

  useEffect(() => {
    if (phase !== 'completed') {
      startRound(currentRoundIdx, rounds);
    }
  }, [currentRoundIdx, rounds, startRound]);

  // --------------------------------------------------------------------------
  // REPEAT INSTRUCTION
  // --------------------------------------------------------------------------

  const handleRepeatInstruction = () => {
    soundManager.playPop();
    if (phase === 'playing') {
      soundManager.speak(currentRound.repeatSpeech);
    } else if (phase === 'completed') {
      soundManager.speak('Great job! You know your traffic lights! Tap replay to play again!');
    }
  };

  // --------------------------------------------------------------------------
  // VEHICLE TAP (HONK EFFECT)
  // --------------------------------------------------------------------------

  const handleVehicleTap = (vehId: string) => {
    soundManager.playCarHonk();
    setHonkingVehicleId(vehId);
    addTimer(() => setHonkingVehicleId(null), 600);
  };

  // --------------------------------------------------------------------------
  // COLOR BUTTON TAP HANDLER
  // --------------------------------------------------------------------------

  const handleSelectColor = (selectedColor: LightColor) => {
    if (phase !== 'playing') return;

    if (selectedColor === currentRound.targetColor) {
      // CORRECT ANSWER!
      setPhase('celebrating');
      setWrongShakeColor(null);
      setActiveLight(selectedColor);

      // Sound effects
      soundManager.playTrafficLightSwitch();
      if (selectedColor === 'red') {
        soundManager.playBrakeStop();
      } else if (selectedColor === 'green') {
        soundManager.playSuccess();
      } else {
        soundManager.playPop();
      }

      // Voice reinforcement
      soundManager.speak(currentRound.praiseSpeech);

      // Sparkles celebration
      setSparkles([
        { id: 1, x: 25, y: 35 },
        { id: 2, x: 50, y: 30 },
        { id: 3, x: 75, y: 35 },
      ]);

      // Automatically proceed to next round
      addTimer(() => {
        setSparkles([]);
        if (currentRoundIdx + 1 < rounds.length) {
          setCurrentRoundIdx((prev) => prev + 1);
        } else {
          // All rounds completed!
          setPhase('completed');
          soundManager.playCelebration();
          if (onCollectStar) onCollectStar();
          soundManager.speak('Great job! You know your traffic lights!');
        }
      }, 2200);
    } else {
      // WRONG ANSWER: Gentle hint without resetting
      soundManager.playError();
      setWrongShakeColor(selectedColor);
      soundManager.speak(currentRound.hintSpeech);
      addTimer(() => setWrongShakeColor(null), 800);
    }
  };

  // --------------------------------------------------------------------------
  // REPLAY GAME (SHUFFLE ALL ROUNDS, VEHICLES, COLORS, POSITIONS)
  // --------------------------------------------------------------------------

  const handleReplay = () => {
    soundManager.playPop();
    const previousFirstAction = rounds[0]?.actionWord;
    const freshRounds = generateRounds(previousFirstAction);
    const freshVehicles = generateVehicles();
    setPhase('playing');
    setRounds(freshRounds);
    setVehicles(freshVehicles);
    setCurrentRoundIdx(0);
    setActiveLight('green');
    setWrongShakeColor(null);
    setSparkles([]);
    startRound(0, freshRounds);
  };

  // --------------------------------------------------------------------------
  // VEHICLE SVG RENDERER
  // --------------------------------------------------------------------------

  const renderVehicleSvg = (veh: Vehicle) => {
    const isHonking = honkingVehicleId === veh.id;

    if (veh.type === 'bus') {
      return (
        <svg viewBox="0 0 140 70" className="w-full h-full drop-shadow-md overflow-visible">
          {/* Honk Speech Bubble */}
          {isHonking && (
            <g transform="translate(100, -10)">
              <rect x="0" y="0" width="34" height="20" rx="6" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.5" />
              <text x="6" y="14" fontSize="11" fontWeight="bold" fill="#B45309">BEEP!</text>
            </g>
          )}
          {/* Bus Body */}
          <rect x="10" y="10" width="120" height="42" rx="10" fill={veh.color} stroke={veh.secondaryColor} strokeWidth="3" />
          {/* Black Checker / Accent Strip */}
          <rect x="10" y="32" width="120" height="7" fill={veh.secondaryColor} />
          {/* Windows */}
          <rect x="20" y="16" width="16" height="13" rx="3" fill="#BAE6FD" stroke="#38BDF8" strokeWidth="1.5" />
          <rect x="42" y="16" width="16" height="13" rx="3" fill="#BAE6FD" stroke="#38BDF8" strokeWidth="1.5" />
          <rect x="64" y="16" width="16" height="13" rx="3" fill="#BAE6FD" stroke="#38BDF8" strokeWidth="1.5" />
          <rect x="86" y="16" width="16" height="13" rx="3" fill="#BAE6FD" stroke="#38BDF8" strokeWidth="1.5" />
          {/* Front Windshield */}
          <path d="M108 16 L124 16 L124 30 L108 30 Z" fill="#BAE6FD" stroke="#38BDF8" strokeWidth="1.5" />
          {/* Driver smiling */}
          <circle cx="114" cy="22" r="3" fill="#FDBA74" />
          <circle cx="116" cy="21" r="0.8" fill="#1E293B" />
          {/* Headlight */}
          <circle cx="128" cy="42" r="4.5" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1.2" />
          {/* Cute Smile on Front Grille */}
          <path d="M120 48 Q125 52 128 48" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" fill="none" />
          {/* Wheels */}
          <g transform="translate(30, 52)">
            <circle cx="0" cy="0" r="10" fill="#1E293B" stroke="#64748B" strokeWidth="3" />
            <circle cx="0" cy="0" r="4" fill="#94A3B8" />
          </g>
          <g transform="translate(100, 52)">
            <circle cx="0" cy="0" r="10" fill="#1E293B" stroke="#64748B" strokeWidth="3" />
            <circle cx="0" cy="0" r="4" fill="#94A3B8" />
          </g>
        </svg>
      );
    }

    if (veh.type === 'truck') {
      return (
        <svg viewBox="0 0 130 70" className="w-full h-full drop-shadow-md overflow-visible">
          {/* Truck Cargo Box */}
          <rect x="8" y="12" width="68" height="40" rx="6" fill={veh.color} stroke={veh.secondaryColor} strokeWidth="3" />
          {/* Cargo Details */}
          <line x1="26" y1="14" x2="26" y2="50" stroke="#FFFFFF" strokeWidth="2" opacity="0.4" />
          <line x1="48" y1="14" x2="48" y2="50" stroke="#FFFFFF" strokeWidth="2" opacity="0.4" />
          {/* Truck Cab */}
          <path d="M76 22 L98 22 L116 36 L116 52 L76 52 Z" fill={veh.color} stroke={veh.secondaryColor} strokeWidth="3" />
          {/* Windshield */}
          <polygon points="82,26 96,26 110,36 82,36" fill="#BAE6FD" stroke="#38BDF8" strokeWidth="1.5" />
          {/* Headlight */}
          <circle cx="114" cy="44" r="4" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1.2" />
          {/* Wheels */}
          <circle cx="28" cy="52" r="9" fill="#1E293B" stroke="#64748B" strokeWidth="3" />
          <circle cx="28" cy="52" r="3.5" fill="#94A3B8" />
          <circle cx="58" cy="52" r="9" fill="#1E293B" stroke="#64748B" strokeWidth="3" />
          <circle cx="58" cy="52" r="3.5" fill="#94A3B8" />
          <circle cx="98" cy="52" r="9" fill="#1E293B" stroke="#64748B" strokeWidth="3" />
          <circle cx="98" cy="52" r="3.5" fill="#94A3B8" />
        </svg>
      );
    }

    if (veh.type === 'taxi') {
      return (
        <svg viewBox="0 0 120 65" className="w-full h-full drop-shadow-md overflow-visible">
          {/* Taxi Sign on roof */}
          <rect x="52" y="6" width="22" height="10" rx="3" fill="#FFFFFF" stroke="#D97706" strokeWidth="1.5" />
          <text x="56" y="14" fontSize="7" fontWeight="black" fill="#1E293B">TAXI</text>
          {/* Taxi Roof & Body */}
          <path
            d="M20 32 L34 16 L84 16 L98 32 L110 36 L110 48 L10 48 L10 36 Z"
            fill={veh.color}
            stroke={veh.secondaryColor}
            strokeWidth="3"
          />
          {/* Checker Strip */}
          <g transform="translate(14, 34)">
            {[0, 10, 20, 30, 40, 50, 60, 70, 80].map((cx, i) => (
              <rect key={i} x={cx} y="0" width="5" height="4" fill={i % 2 === 0 ? '#1E293B' : '#FFFFFF'} />
            ))}
          </g>
          {/* Windows */}
          <polygon points="38,20 54,20 54,30 26,30" fill="#BAE6FD" stroke="#38BDF8" strokeWidth="1.5" />
          <polygon points="60,20 78,20 88,30 60,30" fill="#BAE6FD" stroke="#38BDF8" strokeWidth="1.5" />
          {/* Headlight */}
          <circle cx="108" cy="40" r="3.5" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1" />
          {/* Wheels */}
          <circle cx="32" cy="48" r="9" fill="#1E293B" stroke="#64748B" strokeWidth="2.5" />
          <circle cx="32" cy="48" r="3.5" fill="#94A3B8" />
          <circle cx="88" cy="48" r="9" fill="#1E293B" stroke="#64748B" strokeWidth="2.5" />
          <circle cx="88" cy="48" r="3.5" fill="#94A3B8" />
        </svg>
      );
    }

    if (veh.type === 'van') {
      return (
        <svg viewBox="0 0 120 65" className="w-full h-full drop-shadow-md overflow-visible">
          {/* Van Body */}
          <path
            d="M12 16 L88 16 L108 30 L108 48 L12 48 Z"
            fill={veh.color}
            stroke={veh.secondaryColor}
            strokeWidth="3"
            rx="6"
          />
          {/* Cute stripe */}
          <path d="M12 34 L108 34" stroke="#F472B6" strokeWidth="3" />
          {/* Windows */}
          <rect x="22" y="20" width="18" height="11" rx="3" fill="#BAE6FD" stroke="#38BDF8" strokeWidth="1.5" />
          <rect x="46" y="20" width="18" height="11" rx="3" fill="#BAE6FD" stroke="#38BDF8" strokeWidth="1.5" />
          <polygon points="70,20 86,20 100,29 70,29" fill="#BAE6FD" stroke="#38BDF8" strokeWidth="1.5" />
          {/* Headlight */}
          <circle cx="104" cy="39" r="3.5" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1" />
          {/* Wheels */}
          <circle cx="32" cy="48" r="9" fill="#1E293B" stroke="#64748B" strokeWidth="2.5" />
          <circle cx="32" cy="48" r="3.5" fill="#94A3B8" />
          <circle cx="88" cy="48" r="9" fill="#1E293B" stroke="#64748B" strokeWidth="2.5" />
          <circle cx="88" cy="48" r="3.5" fill="#94A3B8" />
        </svg>
      );
    }

    // Default Cute Sedan / Sport Car
    return (
      <svg viewBox="0 0 110 60" className="w-full h-full drop-shadow-md overflow-visible">
        {/* Car Body */}
        <path
          d="M12 28 L28 14 L76 14 L92 28 L104 32 L104 44 L8 44 L8 32 Z"
          fill={veh.color}
          stroke={veh.secondaryColor}
          strokeWidth="3"
        />
        {/* Windows */}
        <polygon points="32,18 50,18 50,26 22,26" fill="#BAE6FD" stroke="#38BDF8" strokeWidth="1.5" />
        <polygon points="56,18 72,18 82,26 56,26" fill="#BAE6FD" stroke="#38BDF8" strokeWidth="1.5" />
        {/* Headlight */}
        <circle cx="100" cy="36" r="3.5" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1" />
        {/* Wheels */}
        <circle cx="28" cy="44" r="8.5" fill="#1E293B" stroke="#64748B" strokeWidth="2.5" />
        <circle cx="28" cy="44" r="3" fill="#94A3B8" />
        <circle cx="82" cy="44" r="8.5" fill="#1E293B" stroke="#64748B" strokeWidth="2.5" />
        <circle cx="82" cy="44" r="3" fill="#94A3B8" />
      </svg>
    );
  };

  // --------------------------------------------------------------------------
  // TRAFFIC LIGHT LARGE SVG COMPONENT
  // --------------------------------------------------------------------------

  const renderLargeTrafficLight = () => {
    const isRedActive = activeLight === 'red';
    const isYellowActive = activeLight === 'yellow';
    const isGreenActive = activeLight === 'green';

    return (
      <div className="relative flex flex-col items-center select-none">
        {/* Hooded Traffic Light Enclosure */}
        <div className="w-24 sm:w-28 bg-gradient-to-b from-slate-800 to-slate-950 p-3 sm:p-4 rounded-3xl shadow-2xl border-4 border-slate-700 flex flex-col items-center gap-3 relative">
          {/* Top Decorative Cap */}
          <div className="absolute -top-3 w-12 h-3 bg-slate-700 rounded-t-full border-t border-slate-500" />

          {/* 1. RED LIGHT */}
          <div className="relative flex flex-col items-center">
            {/* Hood Visor */}
            <div className="w-16 h-3 bg-slate-900 rounded-t-full border-t-2 border-slate-600 -mb-1 z-10" />
            {/* Light Bulb */}
            <div
              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all duration-300 border-3 ${
                isRedActive
                  ? 'bg-gradient-to-tr from-rose-600 via-red-500 to-rose-400 border-red-300 shadow-[0_0_28px_rgba(239,68,68,0.9)] scale-105'
                  : 'bg-red-950/70 border-red-900/50 opacity-40'
              }`}
            >
              {isRedActive && (
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 bg-white/70 rounded-full blur-[1px] -mt-2 -ml-2" />
                  <span className="text-[10px] sm:text-xs font-black text-white tracking-widest drop-shadow-md">
                    STOP
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 2. YELLOW LIGHT */}
          <div className="relative flex flex-col items-center">
            {/* Hood Visor */}
            <div className="w-16 h-3 bg-slate-900 rounded-t-full border-t-2 border-slate-600 -mb-1 z-10" />
            {/* Light Bulb */}
            <div
              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all duration-300 border-3 ${
                isYellowActive
                  ? 'bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-300 border-yellow-200 shadow-[0_0_28px_rgba(245,158,11,0.95)] scale-105'
                  : 'bg-amber-950/70 border-amber-900/50 opacity-40'
              }`}
            >
              {isYellowActive && (
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 bg-white/70 rounded-full blur-[1px] -mt-2 -ml-2" />
                  <span className="text-[10px] sm:text-xs font-black text-amber-950 tracking-widest drop-shadow-sm">
                    SLOW
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 3. GREEN LIGHT */}
          <div className="relative flex flex-col items-center">
            {/* Hood Visor */}
            <div className="w-16 h-3 bg-slate-900 rounded-t-full border-t-2 border-slate-600 -mb-1 z-10" />
            {/* Light Bulb */}
            <div
              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all duration-300 border-3 ${
                isGreenActive
                  ? 'bg-gradient-to-tr from-emerald-600 via-green-500 to-emerald-400 border-green-300 shadow-[0_0_28px_rgba(34,197,94,0.9)] scale-105'
                  : 'bg-emerald-950/70 border-emerald-900/50 opacity-40'
              }`}
            >
              {isGreenActive && (
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 bg-white/70 rounded-full blur-[1px] -mt-2 -ml-2" />
                  <span className="text-[10px] sm:text-xs font-black text-white tracking-widest drop-shadow-md">
                    GO
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Traffic Light Post */}
        <div className="w-4 sm:w-5 h-16 sm:h-20 bg-gradient-to-r from-slate-600 via-slate-400 to-slate-700 shadow-md border-x border-slate-800 -mt-1" />
        <div className="w-12 h-3 bg-slate-800 rounded-full shadow-inner border border-slate-600" />
      </div>
    );
  };

  // --------------------------------------------------------------------------
  // RENDER
  // --------------------------------------------------------------------------

  return (
    <div className="relative w-full min-h-[92vh] flex flex-col items-center justify-between p-3 sm:p-5 select-none overflow-hidden font-sans">
      {/* -------------------------------------------------------------------- */}
      {/* SKY, CITYSCAPE & ENVIRONMENT BACKGROUND */}
      {/* -------------------------------------------------------------------- */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#60A5FA] via-[#93C5FD] to-[#E0F2FE] pointer-events-none overflow-hidden">
        {/* Soft Smiling Sun */}
        <div className="absolute top-4 right-6 sm:right-16 w-16 sm:w-20 h-16 sm:h-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
            className="w-full h-full relative"
          >
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
              <div
                key={deg}
                className="absolute top-1/2 left-1/2 w-4 h-1 bg-[#FDE047] rounded-full origin-left opacity-80"
                style={{ transform: `rotate(${deg}deg) translate(22px, -50%)` }}
              />
            ))}
            <div className="absolute inset-2 bg-gradient-to-tr from-[#F59E0B] via-[#FBBF24] to-[#FEF08A] rounded-full shadow-md border-2 border-amber-300 flex items-center justify-center text-lg sm:text-xl">
              ☀️
            </div>
          </motion.div>
        </div>

        {/* Fluffy Clouds */}
        <motion.div
          animate={{ x: [-20, 30, -20] }}
          transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-12 left-10 w-40 sm:w-52 h-14 sm:h-16 bg-white/85 rounded-full blur-[0.5px] shadow-sm"
        >
          <div className="w-16 h-16 bg-white/85 rounded-full absolute -top-6 left-6" />
          <div className="w-12 h-12 bg-white/85 rounded-full absolute -top-4 left-20" />
        </motion.div>

        {/* Background Preschool Buildings Skyline */}
        <div className="absolute bottom-[200px] sm:bottom-[240px] left-0 right-0 h-32 flex items-end justify-around px-4 opacity-75">
          {/* Building 1: Mint */}
          <div className="w-20 sm:w-28 h-24 bg-[#6EE7B7] rounded-t-2xl border-2 border-[#10B981] relative">
            <div className="grid grid-cols-2 gap-2 p-2">
              <div className="w-4 h-4 bg-white/80 rounded" />
              <div className="w-4 h-4 bg-white/80 rounded" />
            </div>
          </div>
          {/* Building 2: Orange House */}
          <div className="w-24 sm:w-32 h-32 bg-[#FDBA74] rounded-t-2xl border-2 border-[#F97316] relative">
            <div className="grid grid-cols-3 gap-2 p-2">
              <div className="w-4 h-4 bg-white/80 rounded" />
              <div className="w-4 h-4 bg-white/80 rounded" />
              <div className="w-4 h-4 bg-white/80 rounded" />
            </div>
          </div>
          {/* Tree 1 */}
          <div className="w-16 h-24 flex flex-col items-center justify-end">
            <div className="w-14 h-14 bg-emerald-500 rounded-full border-2 border-emerald-700" />
            <div className="w-3 h-8 bg-amber-800 rounded-t" />
          </div>
          {/* Building 3: Lavender */}
          <div className="w-20 sm:w-28 h-28 bg-[#C4B5FD] rounded-t-2xl border-2 border-[#8B5CF6] relative">
            <div className="grid grid-cols-2 gap-2 p-2">
              <div className="w-4 h-4 bg-white/80 rounded" />
              <div className="w-4 h-4 bg-white/80 rounded" />
            </div>
          </div>
          {/* Tree 2 */}
          <div className="w-14 h-20 flex flex-col items-center justify-end">
            <div className="w-12 h-12 bg-emerald-400 rounded-full border-2 border-emerald-600" />
            <div className="w-2.5 h-6 bg-amber-800 rounded-t" />
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* TOP BAR: HEADER, STARS & AUDIO CONTROLS */}
      {/* -------------------------------------------------------------------- */}
      <div className="relative z-20 w-full max-w-4xl flex items-center justify-between gap-2 bg-white/90 backdrop-blur-md px-3 sm:px-5 py-2.5 rounded-3xl shadow-lg border-2 border-sky-200">
        {/* Title & Round Indicator */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-tr from-rose-500 via-amber-400 to-emerald-500 rounded-2xl flex items-center justify-center text-xl sm:text-2xl shadow-md border-2 border-white">
            🚦
          </div>
          <div>
            <h1 className="text-base sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-1.5">
              Traffic Light Fun
            </h1>
            <div className="text-xs sm:text-sm font-bold text-sky-700">
              Round {phase === 'completed' ? rounds.length : currentRoundIdx + 1} of {rounds.length}
            </div>
          </div>
        </div>

        {/* Stars Progress Indicator */}
        <div className="flex items-center gap-1 sm:gap-1.5 bg-amber-100/90 px-3 py-1.5 rounded-full border border-amber-300 shadow-inner">
          {Array.from({ length: rounds.length }).map((_, idx) => (
            <Star
              key={idx}
              className={`w-5 h-5 sm:w-6 sm:h-6 transition-all duration-300 ${
                idx < currentRoundIdx || (phase === 'completed' && idx < rounds.length)
                  ? 'text-amber-500 fill-amber-400 scale-110 drop-shadow-sm'
                  : idx === currentRoundIdx && phase !== 'completed'
                  ? 'text-amber-400 fill-amber-200 animate-pulse'
                  : 'text-gray-300 fill-gray-200'
              }`}
            />
          ))}
        </div>

        {/* Action Controls: Repeat Voice & Mute */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={handleRepeatInstruction}
            className="p-2 sm:p-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-2xl shadow-md border-b-4 border-sky-700 active:border-b-0 active:translate-y-1 transition-all cursor-pointer"
            title="Hear instruction again"
            aria-label="Repeat Audio Instruction"
          >
            <Volume2 className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button
            type="button"
            onClick={toggleMute}
            className={`p-2 sm:p-2.5 rounded-2xl shadow-md border-b-4 active:border-b-0 active:translate-y-1 transition-all cursor-pointer ${
              isMuted
                ? 'bg-rose-500 border-rose-700 text-white'
                : 'bg-emerald-500 border-emerald-700 text-white'
            }`}
            title={isMuted ? 'Unmute audio' : 'Mute audio'}
            aria-label="Toggle Mute"
          >
            <span className="text-xs sm:text-sm font-black">{isMuted ? 'MUTED' : 'AUDIO'}</span>
          </button>
        </div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* SPOKEN INSTRUCTION BANNER */}
      {/* -------------------------------------------------------------------- */}
      <div className="relative z-20 w-full max-w-2xl my-2 flex justify-center">
        <motion.div
          key={`${currentRoundIdx}_${currentRound.actionWord}`}
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.25 }}
          className={`w-full text-center px-4 py-2.5 rounded-3xl shadow-xl border-4 text-white flex items-center justify-center gap-3 ${
            phase === 'celebrating'
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 border-white'
              : currentRound.targetColor === 'red'
              ? 'bg-gradient-to-r from-rose-600 to-red-500 border-rose-200'
              : currentRound.targetColor === 'yellow'
              ? 'bg-gradient-to-r from-amber-500 to-yellow-500 border-amber-200'
              : 'bg-gradient-to-r from-emerald-600 to-green-500 border-emerald-200'
          }`}
        >
          {phase === 'celebrating' ? (
            <p className="text-xl sm:text-2xl font-black tracking-wide drop-shadow-md flex items-center gap-2">
              🎉 {currentRound.praiseSpeech}
            </p>
          ) : (
            <p className="text-lg sm:text-2xl font-black tracking-wide drop-shadow-md flex items-center gap-2">
              📢 {currentRound.promptSpeech}
            </p>
          )}
        </motion.div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* MAIN INTERACTIVE SCENE: ROAD, TRAFFIC LIGHT & MOVING VEHICLES */}
      {/* -------------------------------------------------------------------- */}
      <div className="relative z-10 w-full max-w-5xl h-[290px] sm:h-[360px] my-auto flex flex-col justify-end rounded-3xl overflow-hidden shadow-2xl border-4 border-sky-300/80 bg-sky-200/50">
        {/* Sparkles on success */}
        <AnimatePresence>
          {sparkles.map((sp) => (
            <motion.div
              key={sp.id}
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: [0, 1.4, 0], opacity: [0, 1, 0] }}
              transition={{ duration: 1.4 }}
              className="absolute z-30 pointer-events-none text-4xl"
              style={{ left: `${sp.x}%`, top: `${sp.y}%`, transform: 'translate(-50%, -50%)' }}
            >
              ✨⭐✨
            </motion.div>
          ))}
        </AnimatePresence>

        {/* SIDEWALK WITH CURB */}
        <div className="w-full h-8 bg-slate-300 border-t-2 border-slate-400 flex items-center justify-between px-4 z-10">
          <div className="w-full h-full border-b-4 border-slate-400/50 flex justify-around">
            {Array.from({ length: 14 }).map((_, i) => (
              <div key={i} className="w-0.5 h-full bg-slate-400" />
            ))}
          </div>
        </div>

        {/* MAIN ROAD STRIP */}
        <div className="relative w-full h-[150px] sm:h-[180px] bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 border-y-4 border-slate-950 flex flex-col justify-between p-2 overflow-hidden">
          {/* Top White Edge Line */}
          <div className="w-full h-1 bg-white/70" />

          {/* Center Dashed Lane Divider */}
          <div className="w-full flex justify-between gap-4 py-1">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-2 w-12 sm:w-16 bg-[#FEF08A] rounded-full shadow-sm" />
            ))}
          </div>

          {/* Bottom White Edge Line */}
          <div className="w-full h-1 bg-white/70" />

          {/* MOVING VEHICLES ON ROAD */}
          {phase !== 'completed' &&
            vehicles.map((veh) => {
              const isTopLane = veh.lane === 'top';
              const topPos = isTopLane ? '14%' : '52%';

              return (
                <div
                  key={veh.id}
                  onClick={() => handleVehicleTap(veh.id)}
                  style={{
                    position: 'absolute',
                    left: `${veh.xPercent}%`,
                    top: topPos,
                    transform: 'translateY(-10%)',
                  }}
                  className="w-24 sm:w-32 h-12 sm:h-16 cursor-pointer touch-manipulation z-20 group transition-transform active:scale-95"
                  title="Tap to honk!"
                >
                  <div className="w-full h-full relative">
                    {renderVehicleSvg(veh)}
                  </div>
                </div>
              );
            })}
        </div>

        {/* PROMINENT TRAFFIC LIGHT (PLACED BESIDE ROAD / SIDEWALK) */}
        <div className="absolute top-2 right-4 sm:right-10 z-20">
          {renderLargeTrafficLight()}
        </div>

        {/* ROAD STATUS BADGE */}
        <div className="absolute top-3 left-4 z-20">
          <div
            className={`px-3 py-1.5 rounded-2xl font-black text-xs sm:text-sm shadow-md border-2 flex items-center gap-1.5 ${
              activeLight === 'red'
                ? 'bg-rose-500 border-rose-300 text-white animate-pulse'
                : activeLight === 'yellow'
                ? 'bg-amber-400 border-amber-200 text-amber-950'
                : 'bg-emerald-500 border-emerald-300 text-white'
            }`}
          >
            <span>{activeLight === 'red' ? '🛑 STOPPED' : activeLight === 'yellow' ? '⚠️ SLOWING' : '🟢 DRIVING'}</span>
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* COMPLETION OVERLAY */}
        {/* ------------------------------------------------------------------ */}
        {phase === 'completed' && (
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-40">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-amber-300 flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 bg-gradient-to-tr from-amber-400 to-yellow-300 rounded-3xl flex items-center justify-center text-4xl shadow-xl border-4 border-white mb-3 animate-bounce">
                <Trophy className="w-12 h-12 text-amber-900" />
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-1">
                You Know Your Traffic Lights! 🚦
              </h2>
              <p className="text-sm sm:text-base font-bold text-slate-600 mb-5">
                Red means STOP 🛑, Yellow means SLOW ⚠️, and Green means GO 🟢!
              </p>

              {/* Replay Button */}
              <button
                type="button"
                onClick={handleReplay}
                className="flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-black text-xl py-3.5 px-8 rounded-3xl border-b-6 border-green-800 shadow-xl active:border-b-2 active:translate-y-1 transition-all cursor-pointer w-full"
              >
                <RotateCcw className="w-6 h-6 stroke-[3]" />
                <span>REPLAY</span>
              </button>
            </motion.div>
          </div>
        )}
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* THREE LARGE INTERACTIVE COLOR BUTTONS (RED, YELLOW, GREEN) */}
      {/* -------------------------------------------------------------------- */}
      <div className="relative z-20 w-full max-w-3xl flex flex-col items-center mt-3">
        <div className="text-xs sm:text-sm font-black text-sky-950 mb-2 bg-white/80 backdrop-blur-sm px-4 py-1 rounded-full shadow-sm">
          Tap the light color to control the traffic:
        </div>

        <div className="grid grid-cols-3 gap-3 sm:gap-6 w-full max-w-xl">
          {/* 1. RED / STOP BUTTON */}
          <motion.button
            type="button"
            onClick={() => handleSelectColor('red')}
            animate={
              wrongShakeColor === 'red'
                ? { x: [-10, 10, -8, 8, -4, 4, 0] }
                : { scale: activeLight === 'red' ? 1.05 : 1 }
            }
            transition={{ duration: 0.4 }}
            className={`h-24 sm:h-28 rounded-3xl font-black shadow-xl flex flex-col items-center justify-center cursor-pointer transition-all border-b-8 active:border-b-2 active:translate-y-1.5 p-2 ${
              wrongShakeColor === 'red'
                ? 'bg-rose-200 border-rose-600 text-rose-950'
                : 'bg-gradient-to-b from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500 text-white border-red-800 shadow-red-500/40'
            }`}
          >
            {/* Color Swatch Disc */}
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/95 shadow-md flex items-center justify-center mb-1 border-2 border-red-700">
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-red-600 shadow-inner" />
            </div>
            <span className="text-sm sm:text-base tracking-wide uppercase font-black">RED</span>
            <span className="text-xs sm:text-sm font-black tracking-wider uppercase bg-black/25 px-3 py-0.5 rounded-full mt-0.5">
              STOP
            </span>
          </motion.button>

          {/* 2. YELLOW / SLOW BUTTON */}
          <motion.button
            type="button"
            onClick={() => handleSelectColor('yellow')}
            animate={
              wrongShakeColor === 'yellow'
                ? { x: [-10, 10, -8, 8, -4, 4, 0] }
                : { scale: activeLight === 'yellow' ? 1.05 : 1 }
            }
            transition={{ duration: 0.4 }}
            className={`h-24 sm:h-28 rounded-3xl font-black shadow-xl flex flex-col items-center justify-center cursor-pointer transition-all border-b-8 active:border-b-2 active:translate-y-1.5 p-2 ${
              wrongShakeColor === 'yellow'
                ? 'bg-amber-100 border-amber-600 text-amber-950'
                : 'bg-gradient-to-b from-amber-300 to-yellow-400 hover:from-amber-200 hover:to-yellow-300 text-amber-950 border-amber-600 shadow-amber-500/40'
            }`}
          >
            {/* Color Swatch Disc */}
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/95 shadow-md flex items-center justify-center mb-1 border-2 border-amber-600">
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-amber-400 shadow-inner" />
            </div>
            <span className="text-sm sm:text-base tracking-wide uppercase font-black">YELLOW</span>
            <span className="text-xs sm:text-sm font-black tracking-wider uppercase bg-amber-950/20 px-3 py-0.5 rounded-full mt-0.5">
              SLOW
            </span>
          </motion.button>

          {/* 3. GREEN / GO BUTTON */}
          <motion.button
            type="button"
            onClick={() => handleSelectColor('green')}
            animate={
              wrongShakeColor === 'green'
                ? { x: [-10, 10, -8, 8, -4, 4, 0] }
                : { scale: activeLight === 'green' ? 1.05 : 1 }
            }
            transition={{ duration: 0.4 }}
            className={`h-24 sm:h-28 rounded-3xl font-black shadow-xl flex flex-col items-center justify-center cursor-pointer transition-all border-b-8 active:border-b-2 active:translate-y-1.5 p-2 ${
              wrongShakeColor === 'green'
                ? 'bg-emerald-200 border-emerald-600 text-emerald-950'
                : 'bg-gradient-to-b from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white border-green-800 shadow-green-500/40'
            }`}
          >
            {/* Color Swatch Disc */}
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/95 shadow-md flex items-center justify-center mb-1 border-2 border-green-700">
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-emerald-500 shadow-inner" />
            </div>
            <span className="text-sm sm:text-base tracking-wide uppercase font-black">GREEN</span>
            <span className="text-xs sm:text-sm font-black tracking-wider uppercase bg-black/25 px-3 py-0.5 rounded-full mt-0.5">
              GO
            </span>
          </motion.button>
        </div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* BOTTOM NAVIGATION */}
      {/* -------------------------------------------------------------------- */}
      <div className="relative z-20 w-full flex justify-center">
        <ActivityBottomNav
          onNavigatePrev={onNavigatePrev}
          onNavigateHome={onNavigateHome}
          onNavigateNext={onNavigateNext}
          isNextUnlocked={isActivityCompleted || phase === 'completed'}
        />
      </div>
    </div>
  );
};
