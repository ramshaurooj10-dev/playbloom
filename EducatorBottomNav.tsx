import React from 'react';
import { ArrowLeft, Home, ArrowRight } from 'lucide-react';
import { soundManager } from '../../utils/audio';

export type EducatorCardId =
  | 'assessment'
  | 'lesson_planner'
  | 'activity_planner'
  | 'worksheets'
  | 'teaching_tips'
  | 'flash_cards'
  | 'rhyme_resources';

export interface EducatorCardMeta {
  id: EducatorCardId;
  title: string;
  sectionNumber: number;
}

export const EDUCATOR_CARDS_LIST: EducatorCardMeta[] = [
  { id: 'assessment', title: 'Teacher Assessment', sectionNumber: 1 },
  { id: 'lesson_planner', title: 'Lesson Planner', sectionNumber: 2 },
  { id: 'activity_planner', title: 'Activity Planner', sectionNumber: 3 },
  { id: 'worksheets', title: 'Printable Worksheets', sectionNumber: 4 },
  { id: 'teaching_tips', title: 'Teaching Tips', sectionNumber: 5 },
  { id: 'flash_cards', title: 'Flash Cards', sectionNumber: 6 },
  { id: 'rhyme_resources', title: 'Rhyme & Classroom Resources', sectionNumber: 7 },
];

interface EducatorBottomNavProps {
  currentSection: EducatorCardId;
  onNavigate: (section: EducatorCardId | 'overview') => void;
}

export const EducatorBottomNav: React.FC<EducatorBottomNavProps> = ({
  currentSection,
  onNavigate,
}) => {
  const currentIndex = EDUCATOR_CARDS_LIST.findIndex((c) => c.id === currentSection);
  const currentCard = EDUCATOR_CARDS_LIST[currentIndex] || EDUCATOR_CARDS_LIST[0];

  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < EDUCATOR_CARDS_LIST.length - 1;

  const previousCard = hasPrevious ? EDUCATOR_CARDS_LIST[currentIndex - 1] : null;
  const nextCard = hasNext ? EDUCATOR_CARDS_LIST[currentIndex + 1] : null;

  const handlePrevious = () => {
    if (!hasPrevious || !previousCard) return;
    soundManager.playPop();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    onNavigate(previousCard.id);
  };

  const handleHome = () => {
    soundManager.playPop();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    onNavigate('overview');
  };

  const handleNext = () => {
    if (!hasNext || !nextCard) return;
    soundManager.playPop();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    onNavigate(nextCard.id);
  };

  return (
    <nav
      id="educator-bottom-navigation-bar"
      aria-label="Educator Hub Card Navigation"
      className="mt-10 pt-6 sm:pt-8 border-t-4 border-indigo-100 print:hidden w-full select-none"
    >
      {/* Navigation Container */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-4 sm:p-5 shadow-xl border-4 border-indigo-400/40 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Previous Button */}
        <button
          id="educator-nav-prev-btn"
          type="button"
          disabled={!hasPrevious}
          onClick={handlePrevious}
          title={hasPrevious && previousCard ? `Go to ${previousCard.title}` : 'First card reached'}
          className={`w-full sm:w-auto flex-1 max-w-[200px] flex items-center justify-center gap-2 px-4 sm:px-6 py-3.5 rounded-2xl font-black text-xs sm:text-sm tracking-wide transition-all shadow-md ${
            hasPrevious
              ? 'bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white cursor-pointer border-2 border-indigo-400 hover:shadow-indigo-500/30'
              : 'bg-slate-800/80 text-slate-500 border-2 border-slate-700/50 cursor-not-allowed opacity-50'
          }`}
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3] shrink-0" />
          <span>PREVIOUS</span>
        </button>

        {/* Center / Home Button with Card Position Info */}
        <div className="flex flex-col items-center justify-center gap-1.5 w-full sm:w-auto">
          <button
            id="educator-nav-home-btn"
            type="button"
            onClick={handleHome}
            title="Return to Preschool Educator Hub Dashboard"
            className="w-full sm:w-auto px-6 sm:px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-black text-xs sm:text-sm tracking-wide rounded-2xl transition-all cursor-pointer border-2 border-emerald-400 shadow-md hover:shadow-emerald-500/30 flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5] shrink-0" />
            <span>HOME</span>
          </button>

          <span className="text-[11px] font-bold text-indigo-200/90 tracking-wide uppercase">
            Card {currentCard.sectionNumber} of 7 • {currentCard.title}
          </span>
        </div>

        {/* Next Button */}
        <button
          id="educator-nav-next-btn"
          type="button"
          disabled={!hasNext}
          onClick={handleNext}
          title={hasNext && nextCard ? `Go to ${nextCard.title}` : 'Last card reached'}
          className={`w-full sm:w-auto flex-1 max-w-[200px] flex items-center justify-center gap-2 px-4 sm:px-6 py-3.5 rounded-2xl font-black text-xs sm:text-sm tracking-wide transition-all shadow-md ${
            hasNext
              ? 'bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white cursor-pointer border-2 border-indigo-400 hover:shadow-indigo-500/30'
              : 'bg-slate-800/80 text-slate-500 border-2 border-slate-700/50 cursor-not-allowed opacity-50'
          }`}
        >
          <span>NEXT</span>
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3] shrink-0" />
        </button>

      </div>
    </nav>
  );
};
