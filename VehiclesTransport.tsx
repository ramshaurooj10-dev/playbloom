import React, { useState } from 'react';
import { motion } from 'motion/react';
import { RotateCcw, Volume2, Star as StarIcon, Check } from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { ActivityBottomNav } from './ActivityBottomNav';

interface VehiclesTransportProps {
  onCollectStar: () => void;
  onNavigateHome?: () => void;
  onNavigateNext?: () => void;
  onNavigatePrev?: () => void;
  isActivityCompleted?: boolean;
}

interface Pair {
  id: string;
  vehicle: string;
  vehicleEmoji: string;
  place: string;
  placeEmoji: string;
}

const PAIRS: Pair[] = [
  { id: 'car', vehicle: 'Car', vehicleEmoji: '🚗', place: 'Road', placeEmoji: '🛣️' },
  { id: 'boat', vehicle: 'Boat', vehicleEmoji: '⛵', place: 'Sea', placeEmoji: '🌊' },
  { id: 'plane', vehicle: 'Plane', vehicleEmoji: '✈️', place: 'Sky', placeEmoji: '☁️' },
  { id: 'train', vehicle: 'Train', vehicleEmoji: '🚂', place: 'Railway', placeEmoji: '🛤️' },
  { id: 'bicycle', vehicle: 'Bicycle', vehicleEmoji: '🚲', place: 'Park', placeEmoji: '🌳' },
  { id: 'bus', vehicle: 'Bus', vehicleEmoji: '🚌', place: 'Bus Stop', placeEmoji: '🚏' },
];

const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

export const VehiclesTransport: React.FC<VehiclesTransportProps> = ({
  onCollectStar,
  onNavigateHome,
  onNavigateNext,
  onNavigatePrev,
  isActivityCompleted = false,
}) => {
  const [places] = useState(() => shuffle(PAIRS));
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<Set<string>>(new Set());
  const [wrongPlaceId, setWrongPlaceId] = useState<string | null>(null);
  const [isAllFinished, setIsAllFinished] = useState(false);

  const handleVehicleClick = (pair: Pair) => {
    if (matchedIds.has(pair.id) || isAllFinished) return;
    soundManager.playPop();
    soundManager.speak(pair.vehicle);
    setSelectedVehicleId(pair.id);
  };

  const handlePlaceClick = (pair: Pair) => {
    if (!selectedVehicleId || matchedIds.has(pair.id) || isAllFinished) return;
    if (pair.id === selectedVehicleId) {
      soundManager.playSuccess();
      const vehicle = PAIRS.find((p) => p.id === pair.id);
      soundManager.speak(`Yes! The ${vehicle?.vehicle} goes on the ${vehicle?.place}!`);
      setMatchedIds((prev) => {
        const next = new Set(prev);
        next.add(pair.id);
        if (next.size === PAIRS.length) {
          onCollectStar();
          setTimeout(() => {
            setIsAllFinished(true);
            soundManager.playCelebration();
            soundManager.speak('Fantastic! You matched all the vehicles!');
          }, 800);
        }
        return next;
      });
      setSelectedVehicleId(null);
    } else {
      soundManager.playError();
      soundManager.speak('Try again!');
      setWrongPlaceId(pair.id);
      setTimeout(() => setWrongPlaceId(null), 700);
    }
  };

  const handlePlayAgain = () => {
    soundManager.playPop();
    soundManager.speak("Let's match the vehicles again!");
    setSelectedVehicleId(null);
    setMatchedIds(new Set());
    setWrongPlaceId(null);
    setIsAllFinished(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center p-2 sm:p-4">
      {/* Top Banner Header */}
      <div className="w-full bg-white/90 backdrop-blur-md border-4 border-sky-300 rounded-3xl p-3 sm:p-4 shadow-lg mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-sky-100 px-3 py-1.5 rounded-2xl border-2 border-sky-300">
            <span className="text-xl">🚗</span>
            <h1 className="text-base sm:text-xl font-black text-sky-950 uppercase tracking-wide">
              Vehicles &amp; Transport
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-blue-100 text-blue-900 font-black text-xs sm:text-sm px-3 py-1.5 rounded-2xl border-2 border-blue-300 flex items-center gap-1">
            <span>
              Matched: {matchedIds.size} / {PAIRS.length}
            </span>
          </div>
          <div className="bg-amber-400 text-amber-950 font-black text-xs sm:text-sm px-3 py-1.5 rounded-2xl border-2 border-amber-300 flex items-center gap-1 shadow-xs">
            <StarIcon className="w-4 h-4 fill-amber-100 stroke-amber-950" />
            <span>{matchedIds.size === PAIRS.length || isActivityCompleted ? 1 : 0}</span>
          </div>
        </div>
      </div>

      {/* Main Activity Card */}
      <div className="w-full bg-gradient-to-br from-sky-100 via-blue-50 to-cyan-100 border-4 border-sky-400 rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col items-center relative overflow-hidden min-h-[420px] justify-between">
        <div className="text-center mt-1 mb-3">
          <div className="inline-flex items-center gap-2 bg-white px-6 py-2 rounded-full border-4 border-sky-300 shadow-md mb-1">
            <button
              type="button"
              onClick={() => soundManager.speak('Tap a vehicle, then tap where it goes!')}
              className="p-1 bg-sky-100 hover:bg-sky-200 rounded-full text-sky-900 transition-transform active:scale-90 cursor-pointer"
            >
              <Volume2 className="w-5 h-5" />
            </button>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight uppercase">
              Where does it go?
            </h2>
          </div>
          <p className="text-xs sm:text-sm font-black text-slate-600 uppercase tracking-wide">
            Tap a vehicle, then tap the place it travels!
          </p>
        </div>

        {!isAllFinished ? (
          <div className="w-full max-w-2xl flex flex-col gap-4 my-auto">
            {/* Vehicles row */}
            <div>
              <p className="text-center text-sm font-black text-sky-900 uppercase mb-2">🚗 Vehicles</p>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
                {PAIRS.map((pair) => {
                  const isMatched = matchedIds.has(pair.id);
                  const isSelected = selectedVehicleId === pair.id;
                  return (
                    <motion.button
                      key={pair.id}
                      type="button"
                      onClick={() => handleVehicleClick(pair)}
                      whileHover={{ scale: isMatched ? 1 : 1.05 }}
                      whileTap={{ scale: isMatched ? 1 : 0.94 }}
                      disabled={isMatched}
                      className={`relative flex flex-col items-center gap-1 rounded-3xl border-4 p-3 shadow-lg cursor-pointer ${
                        isMatched
                          ? 'bg-emerald-50 border-emerald-400 opacity-70'
                          : isSelected
                          ? 'bg-sky-400 border-sky-600 ring-4 ring-sky-200'
                          : 'bg-white border-sky-300 hover:bg-sky-50'
                      }`}
                    >
                      <span className="text-4xl sm:text-5xl select-none">{pair.vehicleEmoji}</span>
                      <span className="text-xs sm:text-sm font-black text-slate-700">{pair.vehicle}</span>
                      {isMatched && (
                        <span className="absolute top-1 right-1 bg-emerald-500 text-white rounded-full p-0.5">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Places row */}
            <div>
              <p className="text-center text-sm font-black text-sky-900 uppercase mb-2">📍 Places</p>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
                {places.map((pair) => {
                  const isMatched = matchedIds.has(pair.id);
                  const isWrong = wrongPlaceId === pair.id;
                  return (
                    <motion.button
                      key={pair.id}
                      type="button"
                      onClick={() => handlePlaceClick(pair)}
                      whileHover={{ scale: isMatched ? 1 : 1.05 }}
                      whileTap={{ scale: isMatched ? 1 : 0.94 }}
                      disabled={isMatched || !selectedVehicleId}
                      className={`relative flex flex-col items-center gap-1 rounded-3xl border-4 p-3 shadow-lg cursor-pointer ${
                        isMatched
                          ? 'bg-emerald-50 border-emerald-400 opacity-70'
                          : isWrong
                          ? 'bg-rose-50 border-rose-400'
                          : 'bg-white border-amber-300 hover:bg-amber-50'
                      }`}
                    >
                      <span className="text-4xl sm:text-5xl select-none">{pair.placeEmoji}</span>
                      <span className="text-xs sm:text-sm font-black text-slate-700">{pair.place}</span>
                      {isMatched && (
                        <span className="absolute top-1 right-1 bg-emerald-500 text-white rounded-full p-0.5">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* Completion Screen */
          <div className="flex flex-col items-center justify-center text-center my-auto p-6 bg-white/90 backdrop-blur-md rounded-3xl border-4 border-sky-400 shadow-xl max-w-lg">
            <div className="text-6xl mb-3 animate-bounce">🎉</div>
            <h3 className="text-2xl sm:text-3xl font-black text-sky-950 uppercase mb-2">
              Vehicles Complete!
            </h3>
            <div className="flex items-center gap-1.5 bg-amber-200 border-2 border-amber-400 px-4 py-1.5 rounded-full mb-3">
              <StarIcon className="w-5 h-5 fill-amber-400 text-amber-600" />
              <span className="font-black text-amber-950 text-sm">Star Earned!</span>
            </div>
            <p className="text-base font-bold text-slate-700 mb-5">
              You matched every vehicle to its place! Vroom vroom!
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
