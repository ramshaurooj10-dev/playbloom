import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Sparkles,
  BookOpen,
  GraduationCap,
  Heart,
  CheckCircle2,
  Lock,
  Compass,
  Smile,
  Award,
} from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface AboutPlayroomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutPlayroomModal: React.FC<AboutPlayroomModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const handleClose = () => {
    soundManager.playPop();
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-2xl bg-white border-4 border-slate-300 rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-5 text-white flex items-center justify-between border-b-2 border-slate-200 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-white/20 rounded-2xl flex items-center justify-center text-2xl border border-white/30 shadow-inner shrink-0">
                📚
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight">
                  ABOUT PLAYBLOOM
                </h2>
                <p className="text-xs text-blue-100 font-bold">
                  Preschool Learning & Educator Space
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="p-6 overflow-y-auto space-y-6 text-slate-700 text-sm leading-relaxed">
            {/* 1. Why We Created PlayBloom */}
            <div className="bg-blue-50/70 border-2 border-blue-200 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2 text-blue-950 font-black text-base">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <h3>Why We Created PlayBloom</h3>
              </div>
              <p className="text-slate-700 leading-relaxed">
                PlayBloom was created to make early learning more playful, engaging, and meaningful for young children. It combines simple educational activities with interactive learning experiences designed to help preschool children learn through play.
              </p>
            </div>

            {/* 2. Why Play-Based Learning Matters */}
            <div className="bg-amber-50/70 border-2 border-amber-200 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2 text-amber-950 font-black text-base">
                <Heart className="w-5 h-5 text-amber-600" />
                <h3>Why Play-Based Learning Matters</h3>
              </div>
              <p className="text-slate-700 mb-3">
                Young children learn naturally through:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  'Play',
                  'Exploration',
                  'Repetition',
                  'Movement',
                  'Visual learning',
                  'Hands-on activities',
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white border border-amber-200 rounded-xl px-3 py-2 flex items-center gap-2 font-bold text-xs text-amber-950"
                  >
                    <span className="text-amber-500">✦</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs font-bold text-amber-900 mt-3">
                PlayBloom brings these elements together in one child-friendly learning environment.
              </p>
            </div>

            {/* 3. Two-Page Experience */}
            <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3 text-slate-900 font-black text-base">
                <Compass className="w-5 h-5 text-indigo-600" />
                <h3>Two-Page Connected Experience</h3>
              </div>
              <p className="text-slate-600 text-xs mb-4">
                PlayBloom includes two thoughtfully connected experiences:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-4">
                {/* Page 1 */}
                <div className="bg-white border-2 border-blue-300 rounded-xl p-4 shadow-xs">
                  <div className="flex items-center gap-2 mb-2 text-blue-900 font-black text-xs uppercase">
                    <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md">Page 1</span>
                    <span>PLAYBLOOM</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-normal">
                    <strong>The children's learning space.</strong> It provides interactive preschool activities where children can practice foundational skills through play.
                  </p>
                </div>

                {/* Page 2 */}
                <div className="bg-white border-2 border-purple-300 rounded-xl p-4 shadow-xs">
                  <div className="flex items-center gap-2 mb-2 text-purple-900 font-black text-xs uppercase">
                    <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded-md">Page 2</span>
                    <span>PRESCHOOL EDUCATOR HUB</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-normal">
                    <strong>The teacher/educator resource space.</strong> It provides comprehensive tools and resources that help teachers:
                  </p>
                  <ul className="text-[11px] text-slate-600 mt-2 space-y-1 list-disc list-inside">
                    <li>Plan learning & lesson routines</li>
                    <li>Assess children's progress</li>
                    <li>Find classroom activities</li>
                    <li>Use printable worksheets & flash cards</li>
                    <li>Get teaching tips & classroom rhymes</li>
                  </ul>
                </div>
              </div>

              {/* Connected Flow */}
              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3 text-center">
                <div className="text-[11px] font-black text-indigo-900 uppercase tracking-wide">
                  CHILD LEARNS ➔ TEACHER SUPPORTS ➔ PROGRESS CAN BE OBSERVED
                </div>
              </div>
            </div>

            {/* 4. Who Created PlayBloom */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-1.5 text-emerald-950 font-black text-base">
                <Award className="w-5 h-5 text-emerald-600" />
                <h3>CREATED BY RAMSHA SHAIKH</h3>
              </div>
              <p className="text-slate-700 text-sm font-semibold">
                PlayBloom was designed and developed by <strong>Ramsha Shaikh</strong>.
              </p>
            </div>

            {/* 5. Playroom Features: Free vs Premium */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Free Features */}
              <div className="bg-white border-2 border-emerald-300 rounded-2xl p-4 shadow-xs">
                <div className="flex items-center gap-2 mb-2.5 text-emerald-900 font-black text-sm uppercase">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>FREE FEATURES</span>
                </div>
                <ul className="text-xs text-slate-600 space-y-2">
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span><strong>Level 1 Starter Activities — all 7 free</strong> (ABC Fun, Color Time, Counting Fun, Shape Match, Find The Difference, Animal Food Match, Identify the Items)</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span><strong>Full Curriculum Overview</strong> (8 Early Childhood Domains and Learning Outcomes)</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span><strong>Interactive Audio</strong>, speech narration, and reward stars</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span><strong>Daily Activity Tracker</strong> (Activities Completed Today)</span>
                  </li>
                </ul>
              </div>

              {/* Premium Features */}
              <div className="bg-white border-2 border-purple-300 rounded-2xl p-4 shadow-xs">
                <div className="flex items-center gap-2 mb-2.5 text-purple-900 font-black text-sm uppercase">
                  <Lock className="w-4 h-4 text-purple-600" />
                  <span>PREMIUM FEATURES</span>
                </div>
                <ul className="text-xs text-slate-600 space-y-2">
                  <li className="flex items-start gap-1.5">
                    <span className="text-purple-500 font-bold">★</span>
                    <span><strong>Full Page 1 for 30 days — Rs 5,000</strong> (All Activities pass). Page 1 only.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-purple-500 font-bold">★</span>
                    <span><strong>Complete Levels 2–6 curriculum</strong> (35 paid preschool activities)</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-purple-500 font-bold">★</span>
                    <span><strong>Smaller options:</strong> watch an ad to unlock the next activity, or Rs 500 for any 3 activities for 7 days</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-purple-500 font-bold">★</span>
                    <span><strong>Star Certificate</strong> celebration screen when all activities are complete</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Schools note: Educator Hub is schools-only */}
            <div className="bg-indigo-50 border-2 border-indigo-200 rounded-2xl p-4 text-xs text-indigo-950 leading-relaxed">
              <strong>Preschool Educator Hub (Page 2) is for schools only</strong> — Rs 50,000/month
              school subscription, which unlocks Page 1 + Page 2. The Rs 5,000 pass covers Page 1 only.
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-end shrink-0">
            <button
              type="button"
              onClick={handleClose}
              className="bg-slate-800 hover:bg-slate-900 text-white font-black text-xs uppercase tracking-wide px-5 py-2.5 rounded-xl transition-colors cursor-pointer shadow-sm"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
