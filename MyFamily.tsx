import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { RotateCcw, Volume2, Star as StarIcon } from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { ActivityBottomNav } from './ActivityBottomNav';

interface MyFamilyProps {
  onCollectStar: () => void;
  onNavigateHome?: () => void;
  onNavigateNext?: () => void;
  onNavigatePrev?: () => void;
  isActivityCompleted?: boolean;
}

interface Member {
  id: string;
  name: string;
  emoji: string;
}

const MEMBERS: Member[] = [
  { id: 'mom', name: 'Mom', emoji: '👩' },
  { id: 'dad', name: 'Dad', emoji: '👨' },
  { id: 'grandma', name: 'Grandma', emoji: '👵' },
  { id: 'grandpa', name: 'Grandpa', emoji: '👴' },
  { id: 'brother', name: 'Brother', emoji: '👦' },
  { id: 'sister', name: 'Sister', emoji: '👧' },
  { id: 'baby', name: 'Baby', emoji: '👶' },
];

const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

export const MyFamily: React.FC<MyFamilyProps> = ({
  onCollectStar,
  onNavigateHome,
  onNavigateNext,
  onNavigatePrev,
  isActivityCompleted = false,
}) => {
  const [rounds] = useState(() => shuffle(MEMBERS));
  const [roundIndex, setRoundIndex] = useState(0);
  const [options, setOptions] = useState<Member[]>([]);
  const [wrongId, setWrongId] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [isAllFinished, setIsAllFinished] = useState(false);

  const current = rounds[roundIndex];

  // Build 3 options for the current round (correct + 2 random others)
  useEffect(() => {
    if (!current) return;
    const others = shuffle(MEMBERS.filter((m) => m.id !== current.id)).slice(0, 2);
    setOptions(shuffle([current, ...others]));
    setWrongId(null);
    soundManager.speak('Who is this?');
  }, [roundIndex]);

  const handlePick = (member: Member) => {
    if (isAllFinished) return;
    if (member.id === current.id) {
      soundManager.playSuccess();
      soundManager.speak(`Yes! This is ${current.name}!`);
      const nextCount = correctCount + 1;
      setCorrectCount(nextCount);
      setTimeout(() => {
        if (nextCount === MEMBERS.length) {
          onCollectStar();
          setIsAllFinished(true);
          soundManager.playCelebration();
          soundManager.speak('Wonderful! You know your whole family!');
        } else {
          setRoundIndex(roundIndex + 1);
        }
      }, 900);
    } else {
      soundManager.playError();
      soundManager.speak('Try again! Who is this?');
      setWrongId(member.id);
      setTimeout(() => setWrongId(null), 700);
    }
  };

  const handlePlayAgain = () => {
    soundManager.playPop();
    soundManager.speak("Let's meet the family again!");
    setRoundIndex(0);
    setCorrectCount(0);
    setWrongId(null);
    setIsAllFinished(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center p-2 sm:p-4">
      {/* Top Banner Header */}
      <div className="w-full bg-white/90 backdrop-blur-md border-4 border-orange-300 rounded-3xl p-3 sm:p-4 shadow-lg mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-orange-100 px-3 py-1.5 rounded-2xl border-2 border-orange-300">
            <span className="text-xl">👨‍👩‍👧</span>
            <h1 className="text-base sm:text-xl font-black text-orange-950 uppercase tracking-wide">
              My Family
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-blue-100 text-blue-900 font-black text-xs sm:text-sm px-3 py-1.5 rounded-2xl border-2 border-blue-300 flex items-center gap-1">
            <span>
              Family: {correctCount} / {MEMBERS.length}
            </span>
          </div>
          <div className="bg-amber-400 text-amber-950 font-black text-xs sm:text-sm px-3 py-1.5 rounded-2xl border-2 border-amber-300 flex items-center gap-1 shadow-xs">
            <StarIcon className="w-4 h-4 fill-amber-100 stroke-amber-950" />
            <span>{correctCount === MEMBERS.length || isActivityCompleted ? 1 : 0}</span>
          </div>
        </div>
      </div>

      {/* Main Activity Card */}
      <div className="w-full bg-gradient-to-br from-orange-100 via-amber-50 to-rose-100 border-4 border-orange-400 rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col items-center relative overflow-hidden min-h-[420px] justify-between">
        <div className="text-center mt-1 mb-3">
          <div className="inline-flex items-center gap-2 bg-white px-6 py-2 rounded-full border-4 border-orange-300 shadow-md mb-1">
            <button
              type="button"
              onClick={() => soundManager.speak('Who is this?')}
              className="p-1 bg-orange-100 hover:bg-orange-200 rounded-full text-orange-900 transition-transform active:scale-90 cursor-pointer"
            >
              <Volume2 className="w-5 h-5" />
            </button>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight uppercase">
              Who is this?
            </h2>
          </div>
          <p className="text-xs sm:text-sm font-black text-slate-600 uppercase tracking-wide">
            Tap the right name for each family member!
          </p>
        </div>

        {!isAllFinished && current ? (
          <div className="w-full max-w-2xl flex flex-col items-center gap-4 my-auto">
            {/* Meet the family strip */}
            <div className="w-full bg-white rounded-3xl border-4 border-orange-300 shadow-xl px-4 py-3 flex flex-wrap items-center justify-center gap-2">
              {MEMBERS.map((member) => (
                <button
                  key={member.id}
                  type="button"
                  onClick={() => {
                    soundManager.playPop();
                    soundManager.speak(member.name);
                  }}
                  className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-2xl hover:bg-orange-50 active:scale-95 transition-all cursor-pointer"
                >
                  <span className="text-3xl sm:text-4xl select-none">{member.emoji}</span>
                  <span className="text-[10px] sm:text-xs font-black text-slate-600">{member.name}</span>
                </button>
              ))}
            </div>

            {/* Quiz face */}
            <motion.div
              key={current.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl border-4 border-orange-300 shadow-xl px-8 py-5 flex flex-col items-center gap-1"
            >
              <span className="text-7xl sm:text-8xl select-none drop-shadow">{current.emoji}</span>
              <span className="text-lg font-black text-slate-500 uppercase tracking-widest">Who is this?</span>
            </motion.div>

            {/* Name options */}
            <div className="grid grid-cols-3 gap-3 w-full">
              {options.map((member) => {
                const isWrong = wrongId === member.id;
                return (
                  <motion.button
                    key={member.id}
                    type="button"
                    onClick={() => handlePick(member)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.94 }}
                    className={`rounded-3xl border-4 p-4 sm:p-5 shadow-lg cursor-pointer ${
                      isWrong ? 'bg-rose-50 border-rose-400' : 'bg-white border-orange-300 hover:bg-orange-50'
                    }`}
                  >
                    <span className="text-xl sm:text-2xl font-black text-orange-950">{member.name}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        ) : (
          /* Completion Screen */
          <div className="flex flex-col items-center justify-center text-center my-auto p-6 bg-white/90 backdrop-blur-md rounded-3xl border-4 border-orange-400 shadow-xl max-w-lg">
            <div className="text-6xl mb-3 animate-bounce">🎉</div>
            <h3 className="text-2xl sm:text-3xl font-black text-orange-950 uppercase mb-2">
              Family Complete!
            </h3>
            <div className="flex items-center gap-1.5 bg-amber-200 border-2 border-amber-400 px-4 py-1.5 rounded-full mb-3">
              <StarIcon className="w-5 h-5 fill-amber-400 text-amber-600" />
              <span className="font-black text-amber-950 text-sm">Star Earned!</span>
            </div>
            <p className="text-base font-bold text-slate-700 mb-5">
              You know your whole family! Mom, Dad, Grandma, Grandpa and more!
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
