import React, { useState } from 'react';
import { motion } from 'motion/react';
import { RotateCcw, Volume2, Star as StarIcon, Check, Music } from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { ActivityBottomNav } from './ActivityBottomNav';

interface DaysMonthsProps {
  onCollectStar: () => void;
  onNavigateHome?: () => void;
  onNavigateNext?: () => void;
  onNavigatePrev?: () => void;
  isActivityCompleted?: boolean;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

export const DaysMonths: React.FC<DaysMonthsProps> = ({
  onCollectStar,
  onNavigateHome,
  onNavigateNext,
  onNavigatePrev,
  isActivityCompleted = false,
}) => {
  const [shuffledDays] = useState(() => shuffle(DAYS));
  const [dayProgress, setDayProgress] = useState(0); // how many days tapped in correct order
  const [wrongDay, setWrongDay] = useState<string | null>(null);
  const [daysDone, setDaysDone] = useState(false);
  const [monthQuestion, setMonthQuestion] = useState(0);
  const [monthOptions] = useState(() => {
    // 3 questions: month after March, after June, after September
    const pick = (afterIdx: number) => {
      const correct = MONTHS[afterIdx + 1];
      const others = shuffle(MONTHS.filter((m) => m !== correct && m !== MONTHS[afterIdx])).slice(0, 2);
      return shuffle([correct, ...others]);
    };
    return [pick(2), pick(5), pick(8)];
  });
  const [monthsDone, setMonthsDone] = useState(false);
  const [isAllFinished, setIsAllFinished] = useState(false);

  const monthAfter = ['March', 'June', 'September'];

  const handleDayClick = (day: string) => {
    if (daysDone || isAllFinished) return;
    const expected = DAYS[dayProgress];
    if (day === expected) {
      soundManager.playSuccess();
      soundManager.speak(day);
      const next = dayProgress + 1;
      setDayProgress(next);
      if (next === DAYS.length) {
        soundManager.playCelebration();
        soundManager.speak('Great! You know all the days of the week!');
        setDaysDone(true);
      }
    } else {
      soundManager.playError();
      soundManager.speak(`Try again! What comes after ${dayProgress === 0 ? 'Sunday' : DAYS[dayProgress - 1]}?`);
      setWrongDay(day);
      setTimeout(() => setWrongDay(null), 700);
    }
  };

  const handleMonthClick = (month: string) => {
    if (monthsDone || isAllFinished) return;
    const correct = MONTHS[MONTHS.indexOf(monthAfter[monthQuestion]) + 1];
    if (month === correct) {
      soundManager.playSuccess();
      soundManager.speak(`Yes! ${correct} comes after ${monthAfter[monthQuestion]}!`);
      setTimeout(() => {
        if (monthQuestion === monthAfter.length - 1) {
          setMonthsDone(true);
          onCollectStar();
          setTimeout(() => {
            setIsAllFinished(true);
            soundManager.playCelebration();
            soundManager.speak('Super! You know the days and the months!');
          }, 800);
        } else {
          setMonthQuestion(monthQuestion + 1);
        }
      }, 900);
    } else {
      soundManager.playError();
      soundManager.speak('Try again!');
    }
  };

  const handlePlayAgain = () => {
    soundManager.playPop();
    soundManager.speak("Let's learn the days and months again!");
    setDayProgress(0);
    setDaysDone(false);
    setMonthQuestion(0);
    setMonthsDone(false);
    setIsAllFinished(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center p-2 sm:p-4">
      {/* Top Banner Header */}
      <div className="w-full bg-white/90 backdrop-blur-md border-4 border-indigo-300 rounded-3xl p-3 sm:p-4 shadow-lg mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-indigo-100 px-3 py-1.5 rounded-2xl border-2 border-indigo-300">
            <span className="text-xl">📅</span>
            <h1 className="text-base sm:text-xl font-black text-indigo-950 uppercase tracking-wide">
              Days &amp; Months
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-blue-100 text-blue-900 font-black text-xs sm:text-sm px-3 py-1.5 rounded-2xl border-2 border-blue-300 flex items-center gap-1">
            <span>
              Days: {dayProgress} / {DAYS.length}
            </span>
          </div>
          <div className="bg-amber-400 text-amber-950 font-black text-xs sm:text-sm px-3 py-1.5 rounded-2xl border-2 border-amber-300 flex items-center gap-1 shadow-xs">
            <StarIcon className="w-4 h-4 fill-amber-100 stroke-amber-950" />
            <span>{isAllFinished || isActivityCompleted ? 1 : 0}</span>
          </div>
        </div>
      </div>

      {/* Main Activity Card */}
      <div className="w-full bg-gradient-to-br from-indigo-100 via-blue-50 to-sky-100 border-4 border-indigo-400 rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col items-center relative overflow-hidden min-h-[420px] justify-between">
        <div className="text-center mt-1 mb-3">
          <div className="inline-flex items-center gap-2 bg-white px-6 py-2 rounded-full border-4 border-indigo-300 shadow-md mb-1">
            <button
              type="button"
              onClick={() =>
                soundManager.speak(
                  daysDone
                    ? 'Which month comes next? Listen and tap!'
                    : 'Tap the days of the week in order!'
                )
              }
              className="p-1 bg-indigo-100 hover:bg-indigo-200 rounded-full text-indigo-900 transition-transform active:scale-90 cursor-pointer"
            >
              <Volume2 className="w-5 h-5" />
            </button>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight uppercase">
              {daysDone ? 'Months of the Year!' : 'Days of the Week!'}
            </h2>
          </div>
          <p className="text-xs sm:text-sm font-black text-slate-600 uppercase tracking-wide">
            {daysDone
              ? 'Which month comes after the one shown?'
              : 'Tap the days in order — Monday first!'}
          </p>
        </div>

        {!isAllFinished ? (
          !daysDone ? (
            /* Stage 1 — Days in order */
            <div className="w-full max-w-2xl flex flex-col items-center gap-4 my-auto">
              <div className="flex flex-wrap items-center justify-center gap-2 bg-white rounded-2xl border-4 border-indigo-300 shadow px-4 py-3">
                {DAYS.map((day, idx) => (
                  <span
                    key={day}
                    className={`text-xs sm:text-sm font-black px-2 py-1 rounded-full ${
                      idx < dayProgress ? 'bg-emerald-400 text-white' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {day.slice(0, 3)}
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
                {shuffledDays.map((day) => {
                  const idx = DAYS.indexOf(day);
                  const isDone = idx < dayProgress;
                  const isWrong = wrongDay === day;
                  return (
                    <motion.button
                      key={day}
                      type="button"
                      onClick={() => handleDayClick(day)}
                      whileHover={{ scale: isDone ? 1 : 1.05 }}
                      whileTap={{ scale: isDone ? 1 : 0.94 }}
                      disabled={isDone}
                      className={`relative flex flex-col items-center gap-1 rounded-3xl border-4 p-4 shadow-lg cursor-pointer ${
                        isDone
                          ? 'bg-emerald-50 border-emerald-400 opacity-80'
                          : isWrong
                          ? 'bg-rose-50 border-rose-400'
                          : 'bg-white border-indigo-300 hover:bg-indigo-50'
                      }`}
                    >
                      <span className="text-3xl sm:text-4xl font-black text-indigo-950">{day}</span>
                      {isDone && (
                        <span className="absolute top-1 right-1 bg-emerald-500 text-white rounded-full p-0.5">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      )}
                    </motion.button>
                  );
                })}
              </div>
              <button
                type="button"
                onClick={() => soundManager.speak(DAYS.join(', '))}
                className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white font-black py-2.5 px-6 rounded-2xl border-b-4 border-indigo-700 shadow active:border-b-2 active:translate-y-0.5 transition-all cursor-pointer text-sm sm:text-base uppercase"
              >
                <Music className="w-5 h-5 stroke-[3]" />
                <span>Sing the Days!</span>
              </button>
            </div>
          ) : (
            /* Stage 2 — Months quiz */
            <div className="w-full max-w-2xl flex flex-col items-center gap-4 my-auto">
              <motion.div
                key={monthQuestion}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl border-4 border-indigo-300 shadow-xl px-8 py-5 flex flex-col items-center gap-1"
              >
                <span className="text-sm font-black text-slate-500 uppercase tracking-widest">
                  Question {monthQuestion + 1} of {monthAfter.length}
                </span>
                <span className="text-3xl sm:text-4xl font-black text-slate-800 text-center">
                  What comes after {monthAfter[monthQuestion]}?
                </span>
              </motion.div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
                {monthOptions[monthQuestion].map((month) => (
                  <motion.button
                    key={month}
                    type="button"
                    onClick={() => handleMonthClick(month)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.94 }}
                    className="rounded-3xl border-4 p-4 sm:p-5 shadow-lg cursor-pointer bg-white border-indigo-300 hover:bg-indigo-50"
                  >
                    <span className="text-2xl sm:text-3xl font-black text-indigo-950">{month}</span>
                  </motion.button>
                ))}
              </div>
              <div className="flex flex-wrap items-center justify-center gap-1.5 bg-white rounded-2xl border-4 border-indigo-300 shadow px-3 py-2">
                {MONTHS.map((month) => (
                  <span key={month} className="text-[10px] sm:text-xs font-black text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-full">
                    {month.slice(0, 3)}
                  </span>
                ))}
              </div>
              <button
                type="button"
                onClick={() => soundManager.speak(MONTHS.join(', '))}
                className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white font-black py-2.5 px-6 rounded-2xl border-b-4 border-indigo-700 shadow active:border-b-2 active:translate-y-0.5 transition-all cursor-pointer text-sm sm:text-base uppercase"
              >
                <Music className="w-5 h-5 stroke-[3]" />
                <span>Sing the Months!</span>
              </button>
            </div>
          )
        ) : (
          /* Completion Screen */
          <div className="flex flex-col items-center justify-center text-center my-auto p-6 bg-white/90 backdrop-blur-md rounded-3xl border-4 border-indigo-400 shadow-xl max-w-lg">
            <div className="text-6xl mb-3 animate-bounce">🎉</div>
            <h3 className="text-2xl sm:text-3xl font-black text-indigo-950 uppercase mb-2">
              Days &amp; Months Complete!
            </h3>
            <div className="flex items-center gap-1.5 bg-amber-200 border-2 border-amber-400 px-4 py-1.5 rounded-full mb-3">
              <StarIcon className="w-5 h-5 fill-amber-400 text-amber-600" />
              <span className="font-black text-amber-950 text-sm">Star Earned!</span>
            </div>
            <p className="text-base font-bold text-slate-700 mb-5">
              You know the days of the week and the months of the year!
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
