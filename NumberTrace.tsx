import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RotateCcw, Volume2, Star as StarIcon } from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { ActivityBottomNav } from './ActivityBottomNav';

interface NumberTraceProps {
  onCollectStar: () => void;
  onNavigateHome?: () => void;
  onNavigateNext?: () => void;
  onNavigatePrev?: () => void;
  isActivityCompleted?: boolean;
}

export interface Waypoint {
  x: number;
  y: number;
}

export interface NumberStroke {
  id: string;
  pathD: string;
  waypoints: Waypoint[];
  startPoint: Waypoint;
  endPoint: Waypoint;
  interpolatedSamples: Waypoint[];
}

export interface NumberDefinition {
  num: number;
  word: string;
  color: string;
  borderColor: string;
  strokes: NumberStroke[];
}

// Precompute smooth equidistant interpolation samples along waypoints polyline for visual guide
function precomputeStrokeSamples(waypoints: Waypoint[], sampleCount = 150): Waypoint[] {
  if (waypoints.length === 0) return [];
  if (waypoints.length === 1) return Array(sampleCount).fill(waypoints[0]);

  const segmentLengths: number[] = [];
  let totalLength = 0;
  for (let i = 0; i < waypoints.length - 1; i++) {
    const dist = Math.hypot(waypoints[i + 1].x - waypoints[i].x, waypoints[i + 1].y - waypoints[i].y);
    segmentLengths.push(dist);
    totalLength += dist;
  }

  if (totalLength === 0) return Array(sampleCount).fill(waypoints[0]);

  const samples: Waypoint[] = [];
  for (let s = 0; s < sampleCount; s++) {
    const targetDist = (s / (sampleCount - 1)) * totalLength;
    let accumulated = 0;
    let found = false;

    for (let i = 0; i < segmentLengths.length; i++) {
      const segLen = segmentLengths[i];
      if (accumulated + segLen >= targetDist || i === segmentLengths.length - 1) {
        const segProgress = segLen > 0 ? (targetDist - accumulated) / segLen : 0;
        const clampedProg = Math.max(0, Math.min(1, segProgress));
        samples.push({
          x: waypoints[i].x + (waypoints[i + 1].x - waypoints[i].x) * clampedProg,
          y: waypoints[i].y + (waypoints[i + 1].y - waypoints[i].y) * clampedProg,
        });
        found = true;
        break;
      }
      accumulated += segLen;
    }

    if (!found) {
      samples.push(waypoints[waypoints.length - 1]);
    }
  }

  return samples;
}

type RawStroke = Omit<NumberStroke, 'interpolatedSamples' | 'endPoint'>;
type RawNumberDefinition = {
  num: number;
  word: string;
  color: string;
  borderColor: string;
  strokes: RawStroke[];
};

// Educational Stroke Paths for numbers 1-10 in normalized 240x280 coordinate space
const RAW_NUMBER_DEFINITIONS: RawNumberDefinition[] = [
  {
    num: 1,
    word: 'one',
    color: '#3B82F6',
    borderColor: '#1D4ED8',
    strokes: [
      {
        id: '1_stem',
        pathD: 'M 90,75 L 120,40 L 120,230',
        startPoint: { x: 90, y: 75 },
        waypoints: [
          { x: 90, y: 75 },
          { x: 105, y: 55 },
          { x: 120, y: 40 },
          { x: 120, y: 90 },
          { x: 120, y: 140 },
          { x: 120, y: 190 },
          { x: 120, y: 230 },
        ],
      },
    ],
  },
  {
    num: 2,
    word: 'two',
    color: '#EC4899',
    borderColor: '#BE185D',
    strokes: [
      {
        id: '2_body',
        pathD: 'M 65,85 C 65,40 175,40 175,95 C 175,145 65,225 65,225 L 175,225',
        startPoint: { x: 65, y: 85 },
        waypoints: [
          { x: 65, y: 85 },
          { x: 95, y: 45 },
          { x: 140, y: 45 },
          { x: 175, y: 80 },
          { x: 170, y: 115 },
          { x: 140, y: 155 },
          { x: 100, y: 190 },
          { x: 65, y: 225 },
          { x: 105, y: 225 },
          { x: 145, y: 225 },
          { x: 175, y: 225 },
        ],
      },
    ],
  },
  {
    num: 3,
    word: 'three',
    color: '#10B981',
    borderColor: '#047857',
    strokes: [
      {
        id: '3_continuous',
        pathD: 'M 75,70 C 85,45 165,45 165,95 C 165,130 120,135 120,135 C 145,135 175,150 175,190 C 175,235 85,235 65,200',
        startPoint: { x: 75, y: 70 },
        waypoints: [
          { x: 75, y: 70 },
          { x: 115, y: 48 },
          { x: 160, y: 65 },
          { x: 165, y: 100 },
          { x: 140, y: 130 },
          { x: 120, y: 135 },
          { x: 150, y: 145 },
          { x: 175, y: 175 },
          { x: 165, y: 215 },
          { x: 120, y: 230 },
          { x: 80, y: 215 },
          { x: 65, y: 195 },
        ],
      },
    ],
  },
  {
    num: 4,
    word: 'four',
    color: '#F59E0B',
    borderColor: '#B45309',
    strokes: [
      {
        id: '4_angle',
        pathD: 'M 150,45 L 65,165 L 185,165',
        startPoint: { x: 150, y: 45 },
        waypoints: [
          { x: 150, y: 45 },
          { x: 105, y: 105 },
          { x: 65, y: 165 },
          { x: 125, y: 165 },
          { x: 185, y: 165 },
        ],
      },
      {
        id: '4_stem',
        pathD: 'M 150,45 L 150,230',
        startPoint: { x: 150, y: 45 },
        waypoints: [
          { x: 150, y: 45 },
          { x: 150, y: 110 },
          { x: 150, y: 170 },
          { x: 150, y: 230 },
        ],
      },
    ],
  },
  {
    num: 5,
    word: 'five',
    color: '#8B5CF6',
    borderColor: '#6D28D9',
    strokes: [
      {
        id: '5_down_belly',
        pathD: 'M 160,50 L 80,50 L 75,120 C 85,115 170,110 170,175 C 170,235 80,235 65,200',
        startPoint: { x: 160, y: 50 },
        waypoints: [
          { x: 160, y: 50 },
          { x: 120, y: 50 },
          { x: 80, y: 50 },
          { x: 77, y: 85 },
          { x: 75, y: 120 },
          { x: 120, y: 120 },
          { x: 165, y: 140 },
          { x: 170, y: 180 },
          { x: 145, y: 220 },
          { x: 100, y: 230 },
          { x: 65, y: 200 },
        ],
      },
    ],
  },
  {
    num: 6,
    word: 'six',
    color: '#06B6D4',
    borderColor: '#0891B2',
    strokes: [
      {
        id: '6_loop',
        pathD: 'M 155,60 C 120,40 65,110 65,180 C 65,235 175,235 175,175 C 175,125 75,125 70,180',
        startPoint: { x: 155, y: 60 },
        waypoints: [
          { x: 155, y: 60 },
          { x: 110, y: 65 },
          { x: 75, y: 115 },
          { x: 65, y: 165 },
          { x: 75, y: 215 },
          { x: 120, y: 230 },
          { x: 165, y: 215 },
          { x: 175, y: 175 },
          { x: 155, y: 140 },
          { x: 115, y: 135 },
          { x: 75, y: 175 },
        ],
      },
    ],
  },
  {
    num: 7,
    word: 'seven',
    color: '#F97316',
    borderColor: '#C2410C',
    strokes: [
      {
        id: '7_stroke',
        pathD: 'M 65,55 L 175,55 L 95,230',
        startPoint: { x: 65, y: 55 },
        waypoints: [
          { x: 65, y: 55 },
          { x: 120, y: 55 },
          { x: 175, y: 55 },
          { x: 150, y: 115 },
          { x: 125, y: 170 },
          { x: 95, y: 230 },
        ],
      },
    ],
  },
  {
    num: 8,
    word: 'eight',
    color: '#EF4444',
    borderColor: '#B91C1C',
    strokes: [
      {
        id: '8_curve',
        pathD: 'M 120,50 C 75,50 75,130 120,140 C 165,150 165,230 120,230 C 75,230 75,150 120,140 C 165,130 165,50 120,50',
        startPoint: { x: 120, y: 50 },
        waypoints: [
          { x: 120, y: 50 },
          { x: 80, y: 70 },
          { x: 85, y: 115 },
          { x: 120, y: 140 },
          { x: 155, y: 165 },
          { x: 155, y: 210 },
          { x: 120, y: 230 },
          { x: 85, y: 210 },
          { x: 85, y: 165 },
          { x: 120, y: 140 },
          { x: 155, y: 115 },
          { x: 155, y: 70 },
          { x: 120, y: 50 },
        ],
      },
    ],
  },
  {
    num: 9,
    word: 'nine',
    color: '#14B8A6',
    borderColor: '#0D9488',
    strokes: [
      {
        id: '9_loop_and_stem',
        pathD: 'M 165,100 C 165,45 75,45 75,105 C 75,160 165,160 165,100 L 165,210 C 165,235 125,235 105,225',
        startPoint: { x: 165, y: 100 },
        waypoints: [
          { x: 165, y: 100 },
          { x: 135, y: 50 },
          { x: 95, y: 50 },
          { x: 75, y: 100 },
          { x: 95, y: 150 },
          { x: 135, y: 150 },
          { x: 165, y: 100 },
          { x: 165, y: 160 },
          { x: 165, y: 205 },
          { x: 145, y: 230 },
          { x: 105, y: 225 },
        ],
      },
    ],
  },
  {
    num: 10,
    word: 'ten',
    color: '#F43F5E',
    borderColor: '#BE123C',
    strokes: [
      {
        id: '10_one',
        pathD: 'M 60,85 L 85,55 L 85,225',
        startPoint: { x: 60, y: 85 },
        waypoints: [
          { x: 60, y: 85 },
          { x: 85, y: 55 },
          { x: 85, y: 140 },
          { x: 85, y: 225 },
        ],
      },
      {
        id: '10_zero',
        pathD: 'M 165,55 C 120,55 120,225 165,225 C 210,225 210,55 165,55',
        startPoint: { x: 165, y: 55 },
        waypoints: [
          { x: 165, y: 55 },
          { x: 130, y: 95 },
          { x: 130, y: 185 },
          { x: 165, y: 225 },
          { x: 200, y: 185 },
          { x: 200, y: 95 },
          { x: 165, y: 55 },
        ],
      },
    ],
  },
];

// Precompute interpolated samples and explicit endPoint for maximum runtime accuracy
const NUMBER_DEFINITIONS: NumberDefinition[] = RAW_NUMBER_DEFINITIONS.map((def) => ({
  ...def,
  strokes: def.strokes.map((stroke) => {
    const endPoint = stroke.waypoints[stroke.waypoints.length - 1];
    return {
      ...stroke,
      endPoint,
      interpolatedSamples: precomputeStrokeSamples(stroke.waypoints, 150),
    };
  }),
}));

const GRADIENTS = [
  'from-amber-100 via-sky-50 to-indigo-100',
  'from-sky-100 via-purple-50 to-pink-100',
  'from-emerald-100 via-yellow-50 to-teal-100',
  'from-rose-100 via-amber-50 to-emerald-100',
  'from-cyan-100 via-lime-50 to-amber-100',
];

function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

const generateGameNumbers = (): { challenges: NumberDefinition[]; bgGradient: string } => {
  const shuffled = shuffleArray(NUMBER_DEFINITIONS).slice(0, 8);
  const bgGradient = GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)];
  return { challenges: shuffled, bgGradient };
};

// Generous, child-friendly stroke evaluation:
// STRICT about connecting ALL dots and covering the FULL path to the FINAL endpoint.
// Slightly wavy/imperfect lines within generous corridor are accepted.
// If tracing is significantly off the path or poorly traced, mark isSignificantlyOffPath for Try Again.
function evaluateStroke(points: Waypoint[], stroke: NumberStroke): {
  success: boolean;
  isSignificantlyOffPath: boolean;
  isSubstantialAttempt: boolean;
} {
  if (points.length < 3) {
    return { success: false, isSignificantlyOffPath: false, isSubstantialAttempt: false };
  }

  // Calculate total path length drawn by finger
  let totalLength = 0;
  for (let i = 1; i < points.length; i++) {
    totalLength += Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y);
  }

  if (totalLength < 35) {
    return { success: false, isSignificantlyOffPath: false, isSubstantialAttempt: false };
  }

  const waypoints = stroke.waypoints;
  const numWaypoints = waypoints.length;
  if (numWaypoints === 0) return { success: true, isSignificantlyOffPath: false, isSubstantialAttempt: true };

  // Generous invisible corridor (52px radius) around each waypoint so preschool wobbles,
  // wavy lines, and slight inside/outside deviations are warmly accepted.
  const CORRIDOR_RADIUS = 52;
  const OFF_PATH_RADIUS = 80;

  // Measure how many drawn points are wildly outside the stroke path
  let offPathCount = 0;
  for (const p of points) {
    const isNearAnyWp = waypoints.some((wp) => Math.hypot(p.x - wp.x, p.y - wp.y) <= OFF_PATH_RADIUS);
    if (!isNearAnyWp) {
      offPathCount++;
    }
  }
  const offPathRatio = offPathCount / points.length;

  // 1. MUST reach START section (startPoint or first waypoint)
  const startPt = stroke.startPoint;
  const firstWp = waypoints[0];
  const reachedStart = points.some(
    (p) => Math.hypot(p.x - startPt.x, p.y - startPt.y) <= CORRIDOR_RADIUS ||
           Math.hypot(p.x - firstWp.x, p.y - firstWp.y) <= CORRIDOR_RADIUS
  );

  // 2. MUST reach the FINAL ENDPOINT and the FINAL SECTION (last 1-2 dots)
  const endPt = stroke.endPoint;
  const lastWp = waypoints[numWaypoints - 1];
  const secondLastWp = numWaypoints >= 2 ? waypoints[numWaypoints - 2] : lastWp;

  const reachedEndPoint = points.some(
    (p) => Math.hypot(p.x - endPt.x, p.y - endPt.y) <= CORRIDOR_RADIUS ||
           Math.hypot(p.x - lastWp.x, p.y - lastWp.y) <= CORRIDOR_RADIUS
  );

  const reachedFinalSection = points.some(
    (p) => Math.hypot(p.x - secondLastWp.x, p.y - secondLastWp.y) <= CORRIDOR_RADIUS
  );

  // 3. MUST connect ALL dots (waypoints)
  let missedCount = 0;
  for (let i = 0; i < numWaypoints; i++) {
    const wp = waypoints[i];
    const covered = points.some((p) => Math.hypot(p.x - wp.x, p.y - wp.y) <= CORRIDOR_RADIUS);
    if (!covered) {
      missedCount++;
    }
  }

  // Strictly require all dots to be connected and the final endpoint reached.
  // If the final few dots are left unconnected or unfilled, tracing is incomplete.
  const allDotsConnected = missedCount === 0;
  const success = reachedStart && reachedEndPoint && reachedFinalSection && allDotsConnected;

  // Detect significantly off-path or poorly traced attempt
  const isSignificantlyOffPath =
    !success &&
    totalLength >= 65 &&
    (offPathRatio > 0.45 || (missedCount / numWaypoints >= 0.5 && totalLength >= 85));

  return {
    success,
    isSignificantlyOffPath,
    isSubstantialAttempt: totalLength >= 50,
  };
}

export const NumberTrace: React.FC<NumberTraceProps> = ({
  onCollectStar,
  onNavigateHome,
  onNavigateNext,
  onNavigatePrev,
  isActivityCompleted = false,
}) => {
  const [{ challenges, bgGradient }, setGame] = useState(generateGameNumbers);
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [isSuccessCelebrating, setIsSuccessCelebrating] = useState(false);
  const [isAllFinished, setIsAllFinished] = useState(false);
  const [showTryAgain, setShowTryAgain] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const strokeStartTimeRef = useRef<number>(performance.now());
  const successTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const tryAgainTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const currentNumberDef = challenges[currentChallengeIndex] || challenges[0];

  // High-performance tracking state stored in ref for 60fps non-blocking rendering
  const traceStateRef = useRef<{
    isTracing: boolean;
    strokeIndex: number;
    completedStrokeIndices: Set<number>;
    currentPoints: Waypoint[];
    completedPathSegments: Waypoint[][];
    numberDef: NumberDefinition;
    challengeIdx: number;
    totalChallenges: number;
    isFinished: boolean;
    activePointerId: number | null;
  }>({
    isTracing: false,
    strokeIndex: 0,
    completedStrokeIndices: new Set(),
    currentPoints: [],
    completedPathSegments: [],
    numberDef: currentNumberDef,
    challengeIdx: currentChallengeIndex,
    totalChallenges: challenges.length,
    isFinished: false,
    activePointerId: null,
  });

  // Keep ref synchronized with current state
  useEffect(() => {
    traceStateRef.current.numberDef = currentNumberDef;
    traceStateRef.current.challengeIdx = currentChallengeIndex;
    traceStateRef.current.totalChallenges = challenges.length;
    traceStateRef.current.isFinished = isAllFinished;
    strokeStartTimeRef.current = performance.now();
  }, [currentNumberDef, currentChallengeIndex, challenges.length, isAllFinished]);

  // Clear pending timers on unmount
  useEffect(() => {
    return () => {
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
      }
      if (tryAgainTimeoutRef.current) {
        clearTimeout(tryAgainTimeoutRef.current);
      }
    };
  }, []);

  // Voice instruction on number change
  useEffect(() => {
    if (isAllFinished) return;

    soundManager.speak(`Trace the number ${currentNumberDef.word}!`);
    traceStateRef.current.isTracing = false;
    traceStateRef.current.strokeIndex = 0;
    traceStateRef.current.completedStrokeIndices = new Set();
    traceStateRef.current.currentPoints = [];
    traceStateRef.current.completedPathSegments = [];
    traceStateRef.current.activePointerId = null;
    strokeStartTimeRef.current = performance.now();

    setIsSuccessCelebrating(false);
    setShowTryAgain(false);
    if (tryAgainTimeoutRef.current) {
      clearTimeout(tryAgainTimeoutRef.current);
    }
  }, [currentChallengeIndex, isAllFinished, currentNumberDef]);

  // Complete the current number challenge smoothly
  const triggerNumberSuccess = useCallback((def: NumberDefinition, challengeIdx: number, totalChallenges: number) => {
    const state = traceStateRef.current;
    state.isTracing = false;
    state.activePointerId = null;

    setIsSuccessCelebrating(true);
    setShowTryAgain(false);
    if (tryAgainTimeoutRef.current) {
      clearTimeout(tryAgainTimeoutRef.current);
    }
    soundManager.playCelebration();
    soundManager.speak(`Great job! You traced ${def.word}!`);

    if (successTimeoutRef.current) {
      clearTimeout(successTimeoutRef.current);
    }

    successTimeoutRef.current = setTimeout(() => {
      if (challengeIdx + 1 >= totalChallenges) {
        // Entire Number Trace activity completed!
        setIsAllFinished(true);
        onCollectStar();
        soundManager.speak('You traced them all!');
      } else {
        // Automatically move to the next number
        setCurrentChallengeIndex((prev) => prev + 1);
      }
    }, 1600);
  }, [onCollectStar]);

  // Permanent "Erase & Do It Again" Handler:
  // - Immediately clears current tracing progress
  // - Resets the current number and guide from the beginning
  // - Keeps the SAME number on screen for practice
  // - Works at ANY time (idle, midway, or even after completing a number)
  // - Does NOT remove earned stars or overall activity completion
  const handleEraseAndDoItAgain = () => {
    if (successTimeoutRef.current) {
      clearTimeout(successTimeoutRef.current);
      successTimeoutRef.current = null;
    }
    if (tryAgainTimeoutRef.current) {
      clearTimeout(tryAgainTimeoutRef.current);
      tryAgainTimeoutRef.current = null;
    }

    soundManager.playPop();
    soundManager.speak(`Let's trace the number ${currentNumberDef.word}!`);

    traceStateRef.current.isTracing = false;
    traceStateRef.current.strokeIndex = 0;
    traceStateRef.current.completedStrokeIndices = new Set();
    traceStateRef.current.currentPoints = [];
    traceStateRef.current.completedPathSegments = [];
    traceStateRef.current.activePointerId = null;
    strokeStartTimeRef.current = performance.now();

    setIsSuccessCelebrating(false);
    setShowTryAgain(false);
  };

  // Handle Play Again (Whole game reset)
  const handlePlayAgain = () => {
    if (successTimeoutRef.current) {
      clearTimeout(successTimeoutRef.current);
      successTimeoutRef.current = null;
    }
    if (tryAgainTimeoutRef.current) {
      clearTimeout(tryAgainTimeoutRef.current);
      tryAgainTimeoutRef.current = null;
    }
    soundManager.speak("Let's trace numbers again!");
    setGame(generateGameNumbers());
    setCurrentChallengeIndex(0);
    setIsSuccessCelebrating(false);
    setIsAllFinished(false);
    setShowTryAgain(false);
    strokeStartTimeRef.current = performance.now();
  };

  // Ultra-smooth requestAnimationFrame render loop
  useEffect(() => {
    let active = true;

    const renderLoop = () => {
      if (!active) return;

      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const state = traceStateRef.current;
          const { strokeIndex, completedPathSegments, currentPoints, numberDef, isTracing, isFinished } = state;
          const activeStroke = numberDef.strokes[strokeIndex];

          // Clear coordinate space (240x280)
          ctx.clearRect(0, 0, 240, 280);
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';

          // 1. Draw previously completed full strokes (using the child's ACTUAL raw drawn lines, never modified)
          ctx.strokeStyle = numberDef.color;
          ctx.lineWidth = 32;
          ctx.globalAlpha = 1.0;

          for (const segment of completedPathSegments) {
            if (segment.length < 2) continue;
            ctx.beginPath();
            ctx.moveTo(segment[0].x, segment[0].y);
            for (let i = 1; i < segment.length; i++) {
              ctx.lineTo(segment[i].x, segment[i].y);
            }
            ctx.stroke();
          }

          // 2. Draw currently traced active trail directly under finger
          if (currentPoints.length > 0) {
            ctx.strokeStyle = numberDef.color;
            ctx.lineWidth = 32;
            ctx.globalAlpha = 1.0;
            ctx.beginPath();
            ctx.moveTo(currentPoints[0].x, currentPoints[0].y);
            if (currentPoints.length === 1) {
              ctx.lineTo(currentPoints[0].x + 0.1, currentPoints[0].y + 0.1);
            } else {
              for (let i = 1; i < currentPoints.length; i++) {
                ctx.lineTo(currentPoints[i].x, currentPoints[i].y);
              }
            }
            ctx.stroke();
          }

          // 3. Draw SMOOTH GUIDANCE ANIMATION when not actively tracing and not celebrating
          if (activeStroke && !isTracing && !isSuccessCelebrating && !isFinished) {
            const now = performance.now();
            const elapsed = now - strokeStartTimeRef.current;
            const periodMs = 2400; // 2.4s calm loop time
            const cycleT = (elapsed % periodMs) / periodMs; // 0.0 -> 1.0

            let progress = 0;
            let guideAlpha = 1.0;

            if (cycleT < 0.8) {
              progress = cycleT / 0.8;
              if (progress < 0.1) {
                guideAlpha = progress / 0.1;
              } else if (progress > 0.9) {
                guideAlpha = (1.0 - progress) / 0.1;
              }
            } else {
              progress = 1.0;
              guideAlpha = Math.max(0, (1.0 - (cycleT - 0.8) / 0.2));
            }

            const samples = activeStroke.interpolatedSamples;
            const sampleIdx = Math.min(
              samples.length - 1,
              Math.max(0, Math.floor(progress * (samples.length - 1)))
            );
            const guidePoint = samples[sampleIdx] || activeStroke.startPoint;

            // A. Draw Start Point Beacon at stroke root
            const startPt = activeStroke.startPoint;
            ctx.fillStyle = numberDef.color;
            ctx.globalAlpha = 0.25;
            ctx.beginPath();
            ctx.arc(startPt.x, startPt.y, 16, 0, Math.PI * 2);
            ctx.fill();

            ctx.globalAlpha = 0.95;
            ctx.fillStyle = '#FFFFFF';
            ctx.strokeStyle = numberDef.color;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(startPt.x, startPt.y, 9, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // B. Draw Smooth Traveling Guidance Circle
            if (guideAlpha > 0.05) {
              ctx.globalAlpha = 0.3 * guideAlpha;
              ctx.fillStyle = numberDef.color;
              ctx.beginPath();
              ctx.arc(guidePoint.x, guidePoint.y, 20, 0, Math.PI * 2);
              ctx.fill();

              ctx.globalAlpha = guideAlpha;
              ctx.fillStyle = '#FFFFFF';
              ctx.strokeStyle = numberDef.color;
              ctx.lineWidth = 4;
              ctx.beginPath();
              ctx.arc(guidePoint.x, guidePoint.y, 12, 0, Math.PI * 2);
              ctx.fill();
              ctx.stroke();

              ctx.fillStyle = numberDef.color;
              ctx.beginPath();
              ctx.arc(guidePoint.x, guidePoint.y, 5, 0, Math.PI * 2);
              ctx.fill();
            }
          }

          ctx.globalAlpha = 1.0;
        }
      }

      animFrameRef.current = requestAnimationFrame(renderLoop);
    };

    animFrameRef.current = requestAnimationFrame(renderLoop);

    return () => {
      active = false;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
    };
  }, [isSuccessCelebrating]);

  // Convert screen touch/mouse coordinates to 240x280 canvas space
  const getCanvasCoords = (clientX: number, clientY: number): Waypoint | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return null;

    const x = ((clientX - rect.left) / rect.width) * 240;
    const y = ((clientY - rect.top) / rect.height) * 280;
    return { x, y };
  };

  // Pointer Interaction Logic (Smooth, Non-blocking, Child-friendly continuous tracking)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onPointerDown = (e: PointerEvent) => {
      if (isSuccessCelebrating || traceStateRef.current.isFinished) return;
      e.preventDefault();

      if (showTryAgain) {
        setShowTryAgain(false);
        if (tryAgainTimeoutRef.current) {
          clearTimeout(tryAgainTimeoutRef.current);
          tryAgainTimeoutRef.current = null;
        }
      }

      const pos = getCanvasCoords(e.clientX, e.clientY);
      if (!pos) return;

      const state = traceStateRef.current;
      const activeStroke = state.numberDef.strokes[state.strokeIndex];
      if (!activeStroke) return;

      // Check if touch is near start point or first waypoint
      const distToStart = Math.hypot(pos.x - activeStroke.startPoint.x, pos.y - activeStroke.startPoint.y);
      const distToFirstWp = Math.hypot(pos.x - activeStroke.waypoints[0].x, pos.y - activeStroke.waypoints[0].y);

      // Or if continuing from an existing in-progress stroke
      const lastPoint = state.currentPoints.length > 0 ? state.currentPoints[state.currentPoints.length - 1] : null;
      const distToLastPoint = lastPoint ? Math.hypot(pos.x - lastPoint.x, pos.y - lastPoint.y) : Infinity;

      if (distToStart <= 70 || distToFirstWp <= 70) {
        // Fresh start from the beginning of the stroke
        state.isTracing = true;
        state.activePointerId = e.pointerId;
        state.currentPoints = [pos];
        try {
          container.setPointerCapture(e.pointerId);
        } catch {
          // ignore
        }
        soundManager.playPop();
      } else if (distToLastPoint <= 65) {
        // Continue smoothly from where finger was lifted
        state.isTracing = true;
        state.activePointerId = e.pointerId;
        state.currentPoints.push(pos);
        try {
          container.setPointerCapture(e.pointerId);
        } catch {
          // ignore
        }
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      const state = traceStateRef.current;
      if (!state.isTracing || isSuccessCelebrating || state.isFinished) return;
      if (state.activePointerId !== null && e.pointerId !== state.activePointerId) return;

      e.preventDefault();

      const pos = getCanvasCoords(e.clientX, e.clientY);
      if (!pos) return;

      // Real-time finger position tracking: continuous smooth recording
      state.currentPoints.push(pos);

      // Keep array bounded for optimal performance
      if (state.currentPoints.length > 400) {
        state.currentPoints = state.currentPoints.slice(-300);
      }

      const activeStroke = state.numberDef.strokes[state.strokeIndex];
      if (!activeStroke) return;

      // Check if the stroke has reached the final endpoint during active dragging
      const distToEnd = Math.hypot(pos.x - activeStroke.endPoint.x, pos.y - activeStroke.endPoint.y);
      if (distToEnd <= 45) {
        const evalResult = evaluateStroke(state.currentPoints, activeStroke);
        if (evalResult.success) {
          // Stroke completed!
          state.completedStrokeIndices.add(state.strokeIndex);
          state.completedPathSegments.push([...state.currentPoints]);
          state.currentPoints = [];
          soundManager.playPop();

          if (state.completedStrokeIndices.size >= state.numberDef.strokes.length) {
            // Full number completed!
            triggerNumberSuccess(state.numberDef, state.challengeIdx, state.totalChallenges);
          } else {
            // Move to next stroke of the number (e.g. 4, 10)
            state.strokeIndex += 1;
            strokeStartTimeRef.current = performance.now();
          }
        }
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      const state = traceStateRef.current;
      if (state.activePointerId !== null && e.pointerId !== state.activePointerId) return;

      const wasTracing = state.isTracing;
      state.isTracing = false;
      state.activePointerId = null;

      try {
        if (container.hasPointerCapture(e.pointerId)) {
          container.releasePointerCapture(e.pointerId);
        }
      } catch {
        // ignore
      }

      if (
        wasTracing &&
        !isSuccessCelebrating &&
        !state.isFinished &&
        state.completedStrokeIndices.size < state.numberDef.strokes.length
      ) {
        const activeStroke = state.numberDef.strokes[state.strokeIndex];
        if (activeStroke) {
          const evalResult = evaluateStroke(state.currentPoints, activeStroke);

          if (evalResult.success) {
            // Stroke succeeded on lift
            state.completedStrokeIndices.add(state.strokeIndex);
            state.completedPathSegments.push([...state.currentPoints]);
            state.currentPoints = [];
            soundManager.playPop();

            if (state.completedStrokeIndices.size >= state.numberDef.strokes.length) {
              triggerNumberSuccess(state.numberDef, state.challengeIdx, state.totalChallenges);
            } else {
              state.strokeIndex += 1;
              strokeStartTimeRef.current = performance.now();
            }
          } else if (evalResult.isSignificantlyOffPath) {
            // Poorly traced or significantly off intended path -> show "Try Again"
            state.currentPoints = [];
            setShowTryAgain(true);
            soundManager.speak(`Try again! Follow the dots to trace the number ${state.numberDef.word}!`);

            if (tryAgainTimeoutRef.current) {
              clearTimeout(tryAgainTimeoutRef.current);
            }
            tryAgainTimeoutRef.current = setTimeout(() => {
              setShowTryAgain(false);
            }, 2200);
          } else if (state.currentPoints.length > 5) {
            // Tracing is along the path but incomplete (e.g. final dots left unconnected)
            // Audio prompt ONLY (no on-screen bar):
            soundManager.speak('Connect all the dots to complete the number.');
          }
        }
      }
    };

    container.addEventListener('pointerdown', onPointerDown, { passive: false });
    container.addEventListener('pointermove', onPointerMove, { passive: false });
    container.addEventListener('pointerup', onPointerUp, { passive: false });
    container.addEventListener('pointercancel', onPointerUp, { passive: false });

    return () => {
      container.removeEventListener('pointerdown', onPointerDown);
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerup', onPointerUp);
      container.removeEventListener('pointercancel', onPointerUp);
    };
  }, [isSuccessCelebrating, triggerNumberSuccess, showTryAgain]);

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center p-2 sm:p-4">
      {/* Top Banner Header */}
      <div className="w-full flex items-center justify-between bg-white border-4 border-amber-300 rounded-3xl px-4 sm:px-6 py-2.5 shadow-md mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl sm:text-3xl">🔢</span>
          <div>
            <h1 className="text-base sm:text-lg font-black text-amber-950 tracking-tight leading-tight">
              NUMBER TRACE
            </h1>
            <p className="text-[11px] sm:text-xs font-bold text-amber-700">
              Number: {currentChallengeIndex + (isAllFinished ? 1 : 0)} / {challenges.length}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-amber-100 border-2 border-amber-300 px-3 py-1 rounded-full text-amber-900 font-black text-xs">
          <StarIcon className="w-4 h-4 fill-amber-400 text-amber-500" />
          <span>{isActivityCompleted || isAllFinished ? '⭐ STAR EARNED' : '1 STAR'}</span>
        </div>
      </div>

      {/* Main Play Area */}
      <div
        className={`w-full bg-gradient-to-br ${bgGradient} border-4 border-amber-400 rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col items-center relative overflow-hidden min-h-[510px] justify-between transition-colors duration-500`}
      >
        {/* Instruction Subheader */}
        <div className="text-center mt-1 mb-2">
          <div className="inline-flex items-center gap-2 bg-white px-6 py-2 rounded-full border-4 border-amber-300 shadow-md mb-1">
            <button
              type="button"
              onClick={() => soundManager.speak(`Trace the number ${currentNumberDef.word}!`)}
              className="text-amber-600 hover:text-amber-800 transition-colors cursor-pointer"
              title="Repeat instruction"
            >
              <Volume2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <h2 className="text-base sm:text-xl font-black text-amber-950 tracking-wide">
              Trace the number {currentNumberDef.word}!
            </h2>
          </div>
          <p className="text-xs sm:text-sm font-black text-slate-600 uppercase tracking-wide">
            Follow the dots with your finger or mouse!
          </p>
        </div>

        {/* Content Zone: Tracing Canvas */}
        {!isAllFinished ? (
          <div className="w-full flex flex-col items-center justify-center my-auto flex-1 py-1 max-w-lg">
            <div
              ref={containerRef}
              className={`w-full max-w-[320px] sm:max-w-[350px] aspect-[4/5] bg-white/95 backdrop-blur-xs border-4 ${
                isSuccessCelebrating
                  ? 'border-emerald-400 ring-4 ring-emerald-300'
                  : 'border-amber-300'
              } rounded-3xl p-4 shadow-xl flex flex-col items-center justify-center relative touch-none select-none transition-all cursor-crosshair`}
              style={{ touchAction: 'none' }}
            >
              {/* STATIC BACKGROUND SVG GUIDE: Dotted educational guide */}
              <svg
                viewBox="0 0 240 280"
                className="absolute inset-4 w-[calc(100%-2rem)] h-[calc(100%-2rem)] pointer-events-none select-none"
              >
                {/* 1. Background Solid Guide Track */}
                {currentNumberDef.strokes.map((s) => (
                  <path
                    key={`bg_${s.id}`}
                    d={s.pathD}
                    fill="none"
                    stroke="#E2E8F0"
                    strokeWidth="38"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ))}

                {/* 2. Dotted Educational Tracing Path */}
                {currentNumberDef.strokes.map((s) => (
                  <path
                    key={`dot_${s.id}`}
                    d={s.pathD}
                    fill="none"
                    stroke="#94A3B8"
                    strokeWidth="10"
                    strokeDasharray="4 14"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ))}

                {/* Celebration Sparkles overlay */}
                {isSuccessCelebrating && (
                  <g>
                    {currentNumberDef.strokes.map((s) => (
                      <path
                        key={`spark_${s.id}`}
                        d={s.pathD}
                        fill="none"
                        stroke="#FFFFFF"
                        strokeWidth="8"
                        strokeDasharray="10 20"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity="0.8"
                      >
                        <animate
                          attributeName="stroke-dashoffset"
                          values="0;60"
                          dur="1s"
                          repeatCount="indefinite"
                        />
                      </path>
                    ))}
                  </g>
                )}
              </svg>

              {/* DEDICATED HARDWARE-ACCELERATED 2D TRACING CANVAS */}
              <canvas
                ref={canvasRef}
                width={240}
                height={280}
                className="w-full h-full relative z-10 touch-none select-none pointer-events-none"
                style={{ touchAction: 'none' }}
              />

              {/* FRIENDLY "TRY AGAIN" ENCOURAGING OVERLAY */}
              {showTryAgain && (
                <div className="absolute inset-x-3 bottom-5 z-20 flex items-center justify-center animate-bounce pointer-events-none">
                  <div className="bg-amber-400 text-amber-950 font-black text-xs sm:text-sm px-4 py-2 rounded-full border-2 border-amber-600 shadow-xl flex items-center gap-1.5 select-none">
                    <RotateCcw className="w-4 h-4 stroke-[3] text-amber-950" />
                    <span>Try Again! Follow the dots!</span>
                  </div>
                </div>
              )}
            </div>

            {/* PERMANENT, CONSISTENT "ERASE & DO IT AGAIN" PRACTICE/RESET BUTTON */}
            <div className="mt-3 w-full flex items-center justify-center">
              <button
                type="button"
                id="number-trace-erase-button"
                onClick={handleEraseAndDoItAgain}
                className="w-full max-w-[320px] sm:max-w-[350px] bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-sm sm:text-base py-3 px-6 rounded-2xl border-b-4 border-amber-600 shadow-md active:border-b-0 active:translate-y-1 transition-all cursor-pointer flex items-center justify-center gap-2 select-none"
                title="Reset and practice this number again"
              >
                <RotateCcw className="w-5 h-5 stroke-[3]" />
                <span>ERASE & DO IT AGAIN</span>
              </button>
            </div>
          </div>
        ) : (
          /* COMPLETION CARD */
          <div className="w-full max-w-md bg-white border-4 border-amber-400 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col items-center text-center my-auto">
            <div className="text-5xl sm:text-6xl mb-3 animate-bounce">🎉</div>
            <h3 className="text-2xl sm:text-3xl font-black text-amber-950 tracking-tight mb-1">
              NUMBER TRACING STAR!
            </h3>
            <div className="inline-flex items-center gap-2 bg-amber-100 border-2 border-amber-300 px-4 py-1.5 rounded-full mb-3 shadow-xs">
              <StarIcon className="w-5 h-5 fill-amber-400 text-amber-500 animate-spin" />
              <span className="font-black text-amber-950 text-sm">Star Earned!</span>
            </div>
            <p className="text-base font-bold text-slate-700 mb-5">
              You traced them all! Outstanding number formation, pencil control, and fine motor skills!
            </p>

            {/* Replay Button */}
            <button
              type="button"
              onClick={handlePlayAgain}
              className="w-full bg-[#10B981] hover:bg-emerald-600 text-white font-black text-lg py-3.5 px-6 rounded-2xl border-b-4 border-emerald-700 shadow-xl active:border-b-0 active:translate-y-1 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-6 h-6 stroke-[3]" />
              <span>PLAY AGAIN</span>
            </button>
          </div>
        )}
      </div>

      {/* SINGLE GLOBAL BOTTOM NAVIGATION (PREV / HOME / NEXT) */}
      <ActivityBottomNav
        onNavigatePrev={onNavigatePrev}
        onNavigateHome={onNavigateHome}
        onNavigateNext={onNavigateNext}
        isNextUnlocked={Boolean(isActivityCompleted || isAllFinished)}
      />
    </div>
  );
};
