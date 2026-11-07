import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  GraduationCap,
  Sparkles,
  Printer,
  ChevronRight,
  ClipboardCheck,
  Calendar,
  Layers,
  FileText,
  Lightbulb,
  Grid,
  Music,
  CheckCircle2,
  BookOpen,
  ArrowLeft,
  Search,
  Download,
  Share2,
  Copy,
  Check,
  Eye,
  Plus,
  Trash2,
  Star,
  Users,
  Target,
} from 'lucide-react';
import { soundManager } from '../utils/audio';
import { LEARNING_AREAS_INFO, LEARNING_ITEMS } from '../data/learningItems';
import { TeacherAssessmentTool } from './educator/TeacherAssessmentTool';
import { LessonPlannerTool } from './educator/LessonPlannerTool';
import { ActivityPlannerTool } from './educator/ActivityPlannerTool';
import { PrintableWorksheetsTool } from './educator/PrintableWorksheetsTool';
import { TeachingTipsTool } from './educator/TeachingTipsTool';
import { FlashCardsTool } from './educator/FlashCardsTool';
import { RhymesResourcesTool } from './educator/RhymesResourcesTool';
import { EducatorBottomNav, EducatorCardId } from './educator/EducatorBottomNav';
import { EducatorCard2DIcon } from './educator/visuals/EducatorCard2DIcon';
import { EducatorHeader2DIllustration } from './educator/visuals/EducatorHeader2DIllustration';
import { SchoolAccessGate } from './educator/SchoolAccessGate';
import { SchoolPurchaseModal } from './educator/SchoolPurchaseModal';
import { UserAccount } from './PremiumAuthModal';
import { isAdminAppViewActive } from '../utils/userAuthService';
import { SchoolLicense } from '../types/payment';
import { googlePlayBilling } from '../services/billing/GooglePlayBillingService';
import { School, ShieldCheck, LogOut, Lock, Paperclip } from 'lucide-react';
import { isAdminAccount } from '../utils/userAuthService';

interface PreschoolEducatorHubProps {
  onBackToPlayroom: () => void;
  isLocked?: boolean;
  isAuthLoading?: boolean;
  activeSchoolLicense?: SchoolLicense | null;
  onSchoolLoginSuccess?: (schoolAccount: UserAccount, activeLicense?: SchoolLicense) => void;
  userAccount?: UserAccount | null;
  initialSection?: ActiveSection;
  onLogout?: () => void;
  revocationNotice?: { isRevoked: boolean; message?: string; schoolName?: string; licenseKey?: string } | null;
  expiredNotice?: { isExpired: boolean; message?: string; schoolName?: string; licenseKey?: string } | null;
}

type ActiveSection =
  | 'overview'
  | 'assessment'
  | 'lesson_planner'
  | 'activity_planner'
  | 'worksheets'
  | 'teaching_tips'
  | 'flash_cards'
  | 'rhyme_resources';

export const PreschoolEducatorHub: React.FC<PreschoolEducatorHubProps> = ({
  onBackToPlayroom,
  isLocked = false,
  isAuthLoading = false,
  activeSchoolLicense,
  onSchoolLoginSuccess,
  userAccount,
  initialSection = 'overview',
  onLogout,
  revocationNotice: propRevocationNotice,
  expiredNotice: propExpiredNotice,
}) => {
  const [activeSection, setActiveSection] = useState<ActiveSection>(() => {
    if (initialSection && initialSection !== ('admin_portal' as any)) {
      return initialSection;
    }
    return 'overview';
  });

  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [revocationNotice, setRevocationNotice] = useState<{
    isRevoked: boolean;
    message?: string;
    schoolName?: string;
    licenseKey?: string;
  } | null>(() => {
    if (propRevocationNotice) return propRevocationNotice;
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('playroom_revoked_notice');
        if (raw) return JSON.parse(raw);
      } catch (_) {}
    }
    return null;
  });

  const [expiredNotice, setExpiredNotice] = useState<{
    isExpired: boolean;
    message?: string;
    schoolName?: string;
    licenseKey?: string;
  } | null>(() => propExpiredNotice || null);

  // School subscription status (Play Billing) — drives the "Subscription
  // renews [date]" display. No license keys any more.
  const [schoolSubscription, setSchoolSubscription] = useState<{
    active: boolean;
    expiryDate?: string;
    daysRemaining?: number;
  } | null>(null);

  // --- 7. Rhyme & Classroom Resources State ---
  const [selectedRhymeCat, setSelectedRhymeCat] = useState('All');

  // --- Copy/Print feedback state ---
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    if (initialSection && initialSection !== ('admin_portal' as any)) {
      setActiveSection(initialSection);
    }
  }, [initialSection]);

  useEffect(() => {
    if (propRevocationNotice) {
      setRevocationNotice(propRevocationNotice);
    } else {
      setRevocationNotice(null);
    }

    if (propExpiredNotice) {
      setExpiredNotice(propExpiredNotice);
    } else {
      setExpiredNotice(null);
    }
  }, [propRevocationNotice, propExpiredNotice, isLocked]);

  // School subscription status (Play Billing) — replaces the old
  // license-key poller. NOTE FOR THE BACKEND AGENT:
  // googlePlayBilling.hasSchoolSubscription() is part of the parallel
  // contract and may not exist yet; this guards for it and reports
  // "not subscribed" until it lands.
  useEffect(() => {
    const readSubscription = () => {
      const svc = googlePlayBilling as unknown as {
        hasSchoolSubscription?: () => {
          active: boolean;
          expiryDate?: string;
          daysRemaining?: number;
        };
      };
      if (typeof svc.hasSchoolSubscription === 'function') {
        try {
          setSchoolSubscription(svc.hasSchoolSubscription());
          return;
        } catch (_) {}
      }
      setSchoolSubscription({ active: false });
    };

    readSubscription();
    const unsubscribe =
      typeof googlePlayBilling.subscribe === 'function'
        ? googlePlayBilling.subscribe(readSubscription)
        : () => {};
    window.addEventListener('playroom_license_update', readSubscription);
    return () => {
      unsubscribe();
      window.removeEventListener('playroom_license_update', readSubscription);
    };
  }, []);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    soundManager.playPop();
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handlePrint = () => {
    soundManager.playPop();
    window.print();
  };

  // Welcome voice once on initial mount
  useEffect(() => {
    soundManager.speak('Welcome to Preschool Educators Hub!');
  }, []);

  const educatorCards = [
    {
      id: 'assessment' as ActiveSection,
      sectionNumber: '1',
      title: 'TEACHER ASSESSMENT',
      subtitle: "Assess children's learning and progress.",
      iconType: 'assessment',
      badge: 'Assessment & Progress',
      targetCardId: 'educator-assessment-card',
      cardBg: 'bg-gradient-to-b from-[#FAF5FF] to-[#F3E8FF]/60',
      borderColor: 'border-[#D8B4FE] hover:border-[#A855F7]',
      shadowColor: 'hover:shadow-purple-200/60',
      badgeBg: 'bg-[#F3E8FF] text-[#6B21A8] border-[#D8B4FE]',
      accentColor: 'bg-[#9333EA] hover:bg-[#7E22CE] text-white',
    },
    {
      id: 'lesson_planner' as ActiveSection,
      sectionNumber: '2',
      title: 'LESSON PLANNER',
      subtitle: 'Plan preschool lessons and classroom routines.',
      iconType: 'lesson_planner',
      badge: 'Curriculum & Routines',
      targetCardId: 'educator-lesson-planner-card',
      cardBg: 'bg-gradient-to-b from-[#F0F9FF] to-[#E0F2FE]/60',
      borderColor: 'border-[#BAE6FD] hover:border-[#38BDF8]',
      shadowColor: 'hover:shadow-sky-200/60',
      badgeBg: 'bg-[#E0F2FE] text-[#0369A1] border-[#BAE6FD]',
      accentColor: 'bg-[#0284C7] hover:bg-[#0369A1] text-white',
    },
    {
      id: 'activity_planner' as ActiveSection,
      sectionNumber: '3',
      title: 'ACTIVITY PLANNER',
      subtitle: 'Find ready-made classroom activities.',
      iconType: 'activity_planner',
      badge: 'Hands-on Activities',
      targetCardId: 'educator-activity-planner-card',
      cardBg: 'bg-gradient-to-b from-[#FFF7ED] to-[#FFEDD5]/60',
      borderColor: 'border-[#FED7AA] hover:border-[#FB923C]',
      shadowColor: 'hover:shadow-orange-200/60',
      badgeBg: 'bg-[#FFEDD5] text-[#C2410C] border-[#FED7AA]',
      accentColor: 'bg-[#EA580C] hover:bg-[#C2410C] text-white',
    },
    {
      id: 'worksheets' as ActiveSection,
      sectionNumber: '4',
      title: 'PRINTABLE WORKSHEETS',
      subtitle: 'Browse ready-made preschool worksheets.',
      iconType: 'worksheets',
      badge: 'Ready-to-Print Worksheets',
      targetCardId: 'educator-worksheets-card',
      cardBg: 'bg-gradient-to-b from-[#FDF2F8] to-[#FCE7F3]/60',
      borderColor: 'border-[#FBCFE8] hover:border-[#F472B6]',
      shadowColor: 'hover:shadow-pink-200/60',
      badgeBg: 'bg-[#FCE7F3] text-[#BE185D] border-[#FBCFE8]',
      accentColor: 'bg-[#DB2777] hover:bg-[#BE185D] text-white',
    },
    {
      id: 'teaching_tips' as ActiveSection,
      sectionNumber: '5',
      title: 'TEACHING TIPS',
      subtitle: 'Practical tips for preschool educators.',
      iconType: 'teaching_tips',
      badge: 'Classroom Strategies',
      targetCardId: 'educator-teaching-tips-card',
      cardBg: 'bg-gradient-to-b from-[#FEFCE8] to-[#FEF08A]/60',
      borderColor: 'border-[#FEF08A] hover:border-[#FACC15]',
      shadowColor: 'hover:shadow-amber-200/60',
      badgeBg: 'bg-[#FEF08A] text-[#854D0E] border-[#FDE047]',
      accentColor: 'bg-[#D97706] hover:bg-[#B45309] text-white',
    },
    {
      id: 'flash_cards' as ActiveSection,
      sectionNumber: '6',
      title: 'FLASH CARDS',
      subtitle: 'Ready-made 2D educational flash cards.',
      iconType: 'flash_cards',
      badge: '2D Flash Cards',
      targetCardId: 'educator-flash-cards-card',
      cardBg: 'bg-gradient-to-b from-[#ECFDF5] to-[#D1FAE5]/60',
      borderColor: 'border-[#A7F3D0] hover:border-[#34D399]',
      shadowColor: 'hover:shadow-emerald-200/60',
      badgeBg: 'bg-[#D1FAE5] text-[#047857] border-[#A7F3D0]',
      accentColor: 'bg-[#059669] hover:bg-[#047857] text-white',
    },
    {
      id: 'rhyme_resources' as ActiveSection,
      sectionNumber: '7',
      title: 'RHYME & CLASSROOM RESOURCES',
      subtitle: 'Written rhymes and classroom resources.',
      iconType: 'rhyme_resources',
      badge: 'Written Rhymes & Guides',
      targetCardId: 'educator-rhyme-resources-card',
      cardBg: 'bg-gradient-to-b from-[#FFF1F2] to-[#FFE4E6]/60',
      borderColor: 'border-[#FECDD3] hover:border-[#FB7185]',
      shadowColor: 'hover:shadow-rose-200/60',
      badgeBg: 'bg-[#FFE4E6] text-[#BE123C] border-[#FECDD3]',
      accentColor: 'bg-[#E11D48] hover:bg-[#BE123C] text-white',
    },
  ];

  const isAdminView = isAdminAppViewActive();
  const isEffectiveLocked = !isAdminView && Boolean(isLocked || revocationNotice?.isRevoked || expiredNotice?.isExpired);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-16 font-sans">
      {/* Main Container - right below yellow bar */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6">
        {/* If Locked or Revoked: ONLY render SchoolAccessGate, nothing underneath */}
        {isEffectiveLocked ? (
          <SchoolAccessGate
            onBackToPlayroom={() => {
              onBackToPlayroom();
            }}
            revocationNotice={revocationNotice}
            expiredNotice={expiredNotice}
            onSchoolLoginSuccess={onSchoolLoginSuccess}
            onOpenInquiry={() => setIsInquiryModalOpen(true)}
          />
        ) : (
          <>
            {/* ========================================================================= */}
            {/* PAGE 1 HEADER (2D POLISHED EDUCATOR DASHBOARD BANNER) - ONLY ON PAGE 1    */}
            {/* ========================================================================= */}
            {activeSection === 'overview' && (
              <motion.header
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-gradient-to-r from-[#EEF2FF] via-[#F8FAFC] to-[#FAF5FF] border-4 border-[#C7D2FE] rounded-3xl p-6 sm:p-8 shadow-xl mb-6 sm:mb-8 relative overflow-hidden"
              >
                {/* Subtle 2D background accents */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-100/50 rounded-full blur-3xl -z-10 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-100/50 rounded-full blur-2xl -z-10 pointer-events-none" />

                <div className="flex flex-col sm:flex-row items-center justify-start gap-4 sm:gap-6 relative z-10 text-center sm:text-left">
                  <div className="shrink-0 bg-white border-3 border-[#C7D2FE] rounded-3xl p-2 sm:p-2.5 shadow-md">
                    <EducatorHeader2DIllustration className="w-18 h-18 sm:w-22 sm:h-22 md:w-24 md:h-24" />
                  </div>

                  <div className="flex flex-col items-center sm:items-start">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-indigo-950 uppercase tracking-tight drop-shadow-xs">
                      PRESCHOOL EDUCATOR HUB
                    </h1>
                    <p className="text-xs sm:text-sm font-bold text-indigo-800/80 mt-1">
                      Professional Curriculum, Assessment & Classroom Resources
                    </p>
                    {schoolSubscription?.active && schoolSubscription.expiryDate && (
                      <p className="text-xs font-black text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1 mt-2 inline-block">
                        Subscription renews{' '}
                        {new Date(schoolSubscription.expiryDate).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                        {typeof schoolSubscription.daysRemaining === 'number' &&
                          ` (${schoolSubscription.daysRemaining} days remaining)`}
                      </p>
                    )}
                  </div>
                </div>
              </motion.header>
            )}

            {/* ========================================================================= */}
            {/* INTERACTIVE EDUCATOR DASHBOARD CARDS (MAIN HUB PAGE)                     */}
            {/* ========================================================================= */}
            {activeSection === 'overview' && (
              <div className="w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
                  {educatorCards.map((card, index) => (
                    <motion.button
                      key={card.id}
                      id={`educator-card-${card.id}`}
                      type="button"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, delay: index * 0.04 }}
                      whileHover={{ y: -4, scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        soundManager.playPop();
                        setActiveSection(card.id);
                      }}
                      className={`group relative flex flex-col justify-between p-6 sm:p-7 rounded-3xl ${card.cardBg} border-4 ${card.borderColor} ${card.shadowColor} shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer text-left w-full h-full min-h-[290px] select-none`}
                    >
                      <div>
                        {/* Top Row: 2D Illustration and Tool Badge */}
                        <div className="flex items-center justify-between gap-3 mb-4">
                          <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-white border-2 border-white/90 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform shrink-0">
                            <EducatorCard2DIcon type={card.iconType} className="w-14 h-14 sm:w-16 sm:h-16" />
                          </div>
                          <span className={`text-[11px] font-black uppercase px-3 py-1 rounded-full border-2 tracking-wider ${card.badgeBg}`}>
                            Tool {card.sectionNumber} of 7
                          </span>
                        </div>

                        {/* Title */}
                        <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-slate-900 mb-1.5 group-hover:text-indigo-950 transition-colors">
                          {card.title}
                        </h2>

                        {/* Short description */}
                        <p className="text-xs sm:text-sm font-semibold text-slate-600 leading-relaxed mb-6">
                          {card.subtitle}
                        </p>
                      </div>

                      {/* Action Button Pill */}
                      <div className="pt-4 border-t border-black/5 flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                          Teacher Tool
                        </span>
                        <span className={`inline-flex items-center gap-1.5 text-xs font-black px-4 py-2 rounded-full transition-all shadow-sm ${card.accentColor}`}>
                          <span>OPEN TOOL</span>
                          <ChevronRight className="w-4 h-4 stroke-[3] transition-transform group-hover:translate-x-1" />
                        </span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* CARD 1: TEACHER ASSESSMENT                                               */}
            {/* ========================================================================= */}
            {activeSection === 'assessment' && (
              <TeacherAssessmentTool onBackToOverview={() => setActiveSection('overview')} />
            )}

            {/* ========================================================================= */}
            {/* CARD 2: LESSON PLANNER                                                   */}
            {/* ========================================================================= */}
            {activeSection === 'lesson_planner' && (
              <LessonPlannerTool onBackToOverview={() => setActiveSection('overview')} />
            )}

            {/* ========================================================================= */}
            {/* CARD 3: ACTIVITY PLANNER & VISUAL STEP GUIDE                             */}
            {/* ========================================================================= */}
            {activeSection === 'activity_planner' && (
              <ActivityPlannerTool onBackToOverview={() => setActiveSection('overview')} />
            )}

            {/* ========================================================================= */}
            {/* CARD 4: PRINTABLE WORKSHEETS (50 READY-MADE A4 WORKSHEETS)               */}
            {/* ========================================================================= */}
            {activeSection === 'worksheets' && (
              <PrintableWorksheetsTool onBackToOverview={() => setActiveSection('overview')} />
            )}

            {/* ========================================================================= */}
            {/* CARD 5: TEACHING TIPS (12 CATEGORIES, 50+ STRATEGIES, SEARCH & QUICK TIPS) */}
            {/* ========================================================================= */}
            {activeSection === 'teaching_tips' && (
              <TeachingTipsTool onBackToOverview={() => setActiveSection('overview')} />
            )}

            {/* ========================================================================= */}
            {/* CARD 6: READY-MADE FLASH CARDS LIBRARY                                   */}
            {/* ========================================================================= */}
            {activeSection === 'flash_cards' && (
              <FlashCardsTool onBack={() => setActiveSection('overview')} />
            )}

            {/* ========================================================================= */}
            {/* CARD 7: RHYME & CLASSROOM RESOURCES                                       */}
            {/* ========================================================================= */}
            {activeSection === 'rhyme_resources' && (
              <RhymesResourcesTool onBack={() => setActiveSection('overview')} />
            )}

            {/* ========================================================================= */}
            {/* UNIFIED EDUCATOR HUB BOTTOM NAVIGATION (PREV / HOME / NEXT)               */}
            {/* ========================================================================= */}
            {activeSection !== 'overview' && (
              <EducatorBottomNav
                currentSection={activeSection as EducatorCardId}
                onNavigate={(nextSection) => setActiveSection(nextSection as ActiveSection)}
              />
            )}
          </>
        )}

        {/* ========================================================================= */}
        {/* AUTH SESSION LOADING STATE                                                */}
        {/* ========================================================================= */}
        {isAuthLoading && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 border-4 border-indigo-300 shadow-2xl flex flex-col items-center gap-4 max-w-sm text-center">
              <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              <div className="text-lg font-black text-indigo-950 uppercase tracking-tight">
                Verifying School Access
              </div>
              <p className="text-xs text-slate-500 font-bold">
                Checking authenticated session and credentials...
              </p>
            </div>
          </div>
        )}
      </main>

      {/* School Inquiry / Request Modal */}
      <SchoolPurchaseModal
        isOpen={isInquiryModalOpen}
        onClose={() => setIsInquiryModalOpen(false)}
      />
    </div>
  );
};
