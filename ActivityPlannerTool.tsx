import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  BookOpen,
  Sparkles,
  Printer,
  Download,
  Bookmark,
  BookmarkCheck,
  Search,
  CheckCircle2,
  Clock,
  Layers,
  Sparkle,
  Copy,
  Check,
  RotateCcw,
  Palette,
  Lightbulb,
  HeartHandshake,
  Users,
} from 'lucide-react';
import { soundManager } from '../../utils/audio';
import {
  ACTIVITY_CATEGORIES,
  READY_MADE_ACTIVITIES,
  PreschoolActivity,
  generatePreschoolActivity,
} from '../../data/readyMadeActivities';
import { ActivityStepIllustration } from './visuals/ActivityStepIllustration';

type ActivityPlannerView =
  | 'HOME'
  | 'READY_MADE_LIST'
  | 'READY_MADE_VIEW'
  | 'GENERATOR_FORM'
  | 'GENERATOR_RESULT'
  | 'SAVED_LIST';

interface ActivityPlannerToolProps {
  onBackToOverview: () => void;
}

const LOCAL_STORAGE_SAVED_ACTIVITIES_KEY = 'preschool_saved_activities_v1';

export const ActivityPlannerTool: React.FC<ActivityPlannerToolProps> = ({ onBackToOverview }) => {
  const [view, setView] = useState<ActivityPlannerView>('HOME');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedActivity, setSelectedActivity] = useState<PreschoolActivity | null>(null);

  // Saved Activities State
  const [savedActivities, setSavedActivities] = useState<PreschoolActivity[]>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_SAVED_ACTIVITIES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Generator Form State
  const [genTopic, setGenTopic] = useState('');
  const [genMaterials, setGenMaterials] = useState('');
  const [genAgeGroup, setGenAgeGroup] = useState('3–5 years');
  const [genNotes, setGenNotes] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [generatedActivity, setGeneratedActivity] = useState<PreschoolActivity | null>(null);

  // Copy Feedback State
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Sync Saved to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_SAVED_ACTIVITIES_KEY, JSON.stringify(savedActivities));
    } catch (e) {
      console.error('Failed to save activities to localStorage:', e);
    }
  }, [savedActivities]);

  const isActivitySaved = (activityId: string) => {
    return savedActivities.some((a) => a.id === activityId);
  };

  const toggleSaveActivity = (activity: PreschoolActivity) => {
    soundManager.playPop();
    if (isActivitySaved(activity.id)) {
      setSavedActivities((prev) => prev.filter((a) => a.id !== activity.id));
    } else {
      setSavedActivities((prev) => [...prev, { ...activity, isSaved: true }]);
    }
  };

  const handleCopy = (text: string, key: string) => {
    soundManager.playPop();
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handlePrint = () => {
    soundManager.playPop();
    window.print();
  };

  const handleDownload = (activity: PreschoolActivity) => {
    soundManager.playPop();
    const isGenerated = activity.id.startsWith('gen-');

    let content: string;
    let fileName: string;

    if (isGenerated) {
      // Pure Written Activity Format
      content = `
=====================================================
PRESCHOOL WRITTEN ACTIVITY PLAN
=====================================================
ACTIVITY TITLE: ${activity.name}
AGE GROUP: ${activity.ageGroup}
LEARNING AREA: ${activity.learningArea}
DURATION: ${activity.duration}

OBJECTIVE:
${activity.objective}

MATERIALS NEEDED:
${activity.materialsNeeded.map((m) => `• ${m}`).join('\n')}

TEACHER PREPARATION:
${activity.preparation}

STEP-BY-STEP WRITTEN INSTRUCTIONS:
${activity.writtenSteps.map((s) => `Step ${s.stepNumber}: ${s.title}\n${s.description}`).join('\n\n')}

TEACHER TIPS:
${activity.teacherTips.map((t) => `• ${t}`).join('\n')}

CHILD PARTICIPATION:
${activity.childParticipation}

LEARNING OUTCOME:
${activity.learningOutcome}
=====================================================
      `.trim();
      fileName = `${activity.name.replace(/[^a-zA-Z0-9]/g, '_')}_Written_Activity.txt`;
    } else {
      // Ready-made activity format with visual step guide summary
      content = `
=====================================================
PRESCHOOL ACTIVITY & VISUAL STEP GUIDE
=====================================================
ACTIVITY NAME: ${activity.name}
CATEGORY: ${activity.category}
AGE GROUP: ${activity.ageGroup}
LEARNING AREA: ${activity.learningArea}
DURATION: ${activity.duration}

OBJECTIVE:
${activity.objective}

MATERIALS NEEDED:
${activity.materialsNeeded.map((m) => `• ${m}`).join('\n')}

TEACHER PREPARATION:
${activity.preparation}

-----------------------------------------------------
WRITTEN STEP-BY-STEP GUIDE:
-----------------------------------------------------
${activity.writtenSteps.map((s) => `STEP ${s.stepNumber}: ${s.title}\n${s.description}`).join('\n\n')}

-----------------------------------------------------
VISUAL STEP GUIDE SUMMARY:
-----------------------------------------------------
${activity.visualSteps.map((vs) => `[Visual Step ${vs.stepNumber}] ${vs.title}: ${vs.instruction}`).join('\n')}

-----------------------------------------------------
TEACHER CLASSROOM TIPS:
-----------------------------------------------------
${activity.teacherTips.map((t) => `• ${t}`).join('\n')}

CHILD PARTICIPATION:
${activity.childParticipation}

TARGET LEARNING OUTCOME:
${activity.learningOutcome}
=====================================================
      `.trim();
      fileName = `${activity.name.replace(/[^a-zA-Z0-9]/g, '_')}_Activity_Guide.txt`;
    }

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleGenerate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!genTopic.trim()) {
      setFormError('Please enter a topic to generate an activity.');
      return;
    }
    setFormError(null);
    soundManager.playPop();

    const newActivity = generatePreschoolActivity({
      topic: genTopic,
      materials: genMaterials,
      ageGroup: genAgeGroup,
      additionalInstructions: genNotes,
    });

    setGeneratedActivity(newActivity);
    setView('GENERATOR_RESULT');
  };

  // Filtered Ready-Made Activities
  const filteredActivities = READY_MADE_ACTIVITIES.filter((act) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      act.category.toLowerCase().includes(selectedCategory.replace('_', ' ').toLowerCase());
    const matchesSearch =
      act.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.learningArea.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.objective.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="educator-activity-planner-card" className="bg-white border-4 border-amber-300 rounded-3xl p-5 sm:p-8 shadow-xl mb-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b-2 border-amber-100 pb-4 mb-6 gap-3">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 bg-amber-100 border-2 border-amber-300 rounded-2xl flex items-center justify-center text-3xl shrink-0 shadow-xs">
            🎨
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                Tool 3 of 7
              </span>
              {savedActivities.length > 0 && view !== 'SAVED_LIST' && (
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playPop();
                    setView('SAVED_LIST');
                  }}
                  className="text-[10px] font-black uppercase text-amber-900 bg-amber-200/80 hover:bg-amber-300 px-2.5 py-0.5 rounded-full transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Bookmark className="w-3 h-3" />
                  <span>{savedActivities.length} Saved</span>
                </button>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight mt-0.5">
              Activity Planner & Visual Step Guide
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {view !== 'HOME' && (
            <button
              type="button"
              onClick={() => {
                soundManager.playPop();
                setView('HOME');
              }}
              className="flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-black px-3.5 py-2 rounded-xl transition-colors cursor-pointer border border-amber-300 shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Planner Home</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              soundManager.playPop();
              onBackToOverview();
            }}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black px-3.5 py-2 rounded-xl transition-colors cursor-pointer border border-slate-300 shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Hub</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. HOME SCREEN: ONLY TWO PROMINENT MAIN OPTIONS                           */}
      {/* ========================================================================= */}
      {view === 'HOME' && (
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto mb-2">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 uppercase">
              Select an Activity Mode
            </h3>
            <p className="text-xs sm:text-sm font-bold text-slate-600 mt-1">
              Choose from our curated 2D visual preschool activity library or generate a custom hands-on activity with your available materials.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* OPTION 1: READY-MADE ACTIVITIES */}
            <button
              type="button"
              onClick={() => {
                soundManager.playPop();
                setView('READY_MADE_LIST');
              }}
              className="group relative bg-gradient-to-br from-amber-50 to-amber-100/70 border-3 border-amber-300 hover:border-amber-500 rounded-3xl p-6 sm:p-8 text-left transition-all duration-200 hover:shadow-xl hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
            >
              <div className="mb-6">
                <div className="w-16 h-16 bg-white border-2 border-amber-300 rounded-2xl flex items-center justify-center text-3xl shadow-sm mb-4 group-hover:scale-110 transition-transform">
                  📚
                </div>
                <span className="text-[11px] font-black uppercase text-amber-800 bg-amber-200/80 px-3 py-1 rounded-full">
                  Curated 2D Visual Library
                </span>
                <h4 className="text-2xl font-black text-slate-900 uppercase mt-2 group-hover:text-amber-900 transition-colors">
                  Ready-Made Activities
                </h4>
                <p className="text-xs sm:text-sm font-bold text-slate-600 mt-2 leading-relaxed">
                  Choose from {READY_MADE_ACTIVITIES.length} prepared preschool activities across Phonics, Math, Colors, Shapes, Fine Motor, Art, Sensory, and Movement.
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-amber-200 text-xs font-black text-amber-900">
                <span>Browse {READY_MADE_ACTIVITIES.length} Illustrated Activities</span>
                <span className="bg-amber-500 text-white rounded-full w-7 h-7 flex items-center justify-center shadow-xs group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </div>
            </button>

            {/* OPTION 2: ACTIVITY CREATOR */}
            <button
              type="button"
              onClick={() => {
                soundManager.playPop();
                setView('GENERATOR_FORM');
              }}
              className="group relative bg-gradient-to-br from-orange-50 to-orange-100/70 border-3 border-orange-300 hover:border-orange-500 rounded-3xl p-6 sm:p-8 text-left transition-all duration-200 hover:shadow-xl hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
            >
              <div className="mb-6">
                <div className="w-16 h-16 bg-white border-2 border-orange-300 rounded-2xl flex items-center justify-center text-3xl shadow-sm mb-4 group-hover:scale-110 transition-transform">
                  📝
                </div>
                <span className="text-[11px] font-black uppercase text-orange-800 bg-orange-200/80 px-3 py-1 rounded-full">
                  Written Activity Creator
                </span>
                <h4 className="text-2xl font-black text-slate-900 uppercase mt-2 group-hover:text-orange-900 transition-colors">
                  Activity Creator
                </h4>
                <p className="text-xs sm:text-sm font-bold text-slate-600 mt-2 leading-relaxed">
                  Enter your topic, available classroom materials, and age group to generate a complete step-by-step written activity plan.
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-orange-200 text-xs font-black text-orange-900">
                <span>Create Written Activity Plan</span>
                <span className="bg-orange-500 text-white rounded-full w-7 h-7 flex items-center justify-center shadow-xs group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </div>
            </button>
          </div>

          {/* Quick Saved Section Access if items exist */}
          {savedActivities.length > 0 && (
            <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 max-w-4xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BookmarkCheck className="w-6 h-6 text-amber-600" />
                <div>
                  <div className="text-xs font-black uppercase text-slate-900">
                    Saved Activities Bookmark ({savedActivities.length})
                  </div>
                  <div className="text-[11px] font-bold text-slate-500">
                    Access your saved and customized preschool activity plans.
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  soundManager.playPop();
                  setView('SAVED_LIST');
                }}
                className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-black px-4 py-1.5 rounded-xl cursor-pointer shadow-xs transition-colors"
              >
                View Saved
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. READY-MADE ACTIVITIES LIST VIEW                                        */}
      {/* ========================================================================= */}
      {view === 'READY_MADE_LIST' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-black text-slate-900 uppercase flex items-center gap-2">
                <span>📚</span>
                <span>Ready-Made Preschool Activities</span>
              </h3>
              <p className="text-xs font-bold text-slate-600 mt-0.5">
                Explore fully prepared classroom activities with complete 2D visual step guides.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search activities or topics..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-4 py-2 text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {ACTIVITY_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  soundManager.playPop();
                  setSelectedCategory(cat.id);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap cursor-pointer transition-colors flex items-center gap-1.5 shrink-0 ${
                  selectedCategory === cat.id
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Activity Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredActivities.map((act) => {
              const saved = isActivitySaved(act.id);
              return (
                <div
                  key={act.id}
                  className="bg-white border-2 border-slate-200 hover:border-amber-400 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-[10px] font-black uppercase text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-md">
                        {act.category}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleSaveActivity(act)}
                        className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                          saved
                            ? 'bg-amber-100 border-amber-300 text-amber-700'
                            : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600'
                        }`}
                        title={saved ? 'Remove from Saved' : 'Save Activity'}
                      >
                        {saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                      </button>
                    </div>

                    <h4 className="text-base font-black text-slate-900 uppercase line-clamp-1 mt-1">
                      {act.name}
                    </h4>

                    <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500 my-2">
                      <span className="bg-slate-100 px-2 py-0.5 rounded-md font-black text-slate-700">
                        {act.ageGroup}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {act.duration}
                      </span>
                    </div>

                    <p className="text-xs font-bold text-slate-600 line-clamp-2 leading-relaxed mb-3">
                      {act.objective}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-black text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md">
                      {act.visualSteps.length} Visual Steps
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        soundManager.playPop();
                        setSelectedActivity(act);
                        setView('READY_MADE_VIEW');
                      }}
                      className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-black px-3.5 py-1.5 rounded-xl cursor-pointer transition-colors shadow-xs"
                    >
                      Open Guide →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredActivities.length === 0 && (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300">
              <Search className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs font-black text-slate-600 uppercase">No activities found</p>
              <p className="text-xs font-bold text-slate-500 mt-0.5">Try searching for a different term or choose All Categories.</p>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. ACTIVITY DETAIL VIEW (READY-MADE OR FROM SAVED)                        */}
      {/* ========================================================================= */}
      {view === 'READY_MADE_VIEW' && selectedActivity && (
        <div className="space-y-6">
          {/* Top Bar with Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-amber-50/70 border border-amber-200 rounded-2xl p-4">
            <button
              type="button"
              onClick={() => {
                soundManager.playPop();
                setView('READY_MADE_LIST');
              }}
              className="flex items-center gap-1 text-xs font-black text-amber-950 bg-white hover:bg-amber-100 border border-amber-300 px-3 py-1.5 rounded-xl transition-colors cursor-pointer shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Activities</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => toggleSaveActivity(selectedActivity)}
                className={`flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-xl border transition-colors cursor-pointer shadow-xs ${
                  isActivitySaved(selectedActivity.id)
                    ? 'bg-amber-600 text-white border-amber-600'
                    : 'bg-white hover:bg-amber-100 text-amber-900 border-amber-300'
                }`}
              >
                {isActivitySaved(selectedActivity.id) ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                <span>{isActivitySaved(selectedActivity.id) ? 'Saved' : 'Save Activity'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleCopy(JSON.stringify(selectedActivity, null, 2), 'detail_copy')}
                className="bg-white hover:bg-amber-100 text-slate-700 border border-slate-300 text-xs font-black px-3 py-1.5 rounded-xl cursor-pointer flex items-center gap-1 shadow-xs"
              >
                {copiedKey === 'detail_copy' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'detail_copy' ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleDownload(selectedActivity)}
                className="bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-black px-3 py-1.5 rounded-xl cursor-pointer flex items-center gap-1 shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-black px-3.5 py-1.5 rounded-xl cursor-pointer flex items-center gap-1 shadow-md"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Guide</span>
              </button>
            </div>
          </div>

          {/* Activity Main Info Card */}
          <div className="bg-slate-50 border-2 border-slate-300 rounded-3xl p-6 relative">
            <div className="border-b border-slate-200 pb-4 mb-4">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="text-[11px] font-black uppercase text-amber-900 bg-amber-100 border border-amber-200 px-3 py-0.5 rounded-md">
                  {selectedActivity.category}
                </span>
                <span className="text-[11px] font-black uppercase text-blue-900 bg-blue-100 border border-blue-200 px-3 py-0.5 rounded-md">
                  {selectedActivity.learningArea}
                </span>
                <span className="text-[11px] font-black text-slate-700 bg-slate-200 px-2.5 py-0.5 rounded-md">
                  {selectedActivity.ageGroup}
                </span>
                <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1 bg-white border border-slate-200 px-2.5 py-0.5 rounded-md">
                  <Clock className="w-3 h-3" />
                  {selectedActivity.duration}
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black uppercase text-slate-900 tracking-tight">
                {selectedActivity.name}
              </h3>
            </div>

            {/* Objective & Prep */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-4">
                <div className="font-black text-xs uppercase text-amber-950 mb-1 flex items-center gap-1.5">
                  <span>🎯</span>
                  <span>Core Developmental Objective</span>
                </div>
                <p className="text-xs font-bold text-amber-900 leading-relaxed mb-3">
                  {selectedActivity.objective}
                </p>
                <div className="bg-white border border-amber-200/80 rounded-xl p-2.5 text-[11px] font-bold text-slate-700">
                  <strong className="text-amber-950 uppercase text-[10px] block mb-0.5">Teacher Preparation:</strong>
                  {selectedActivity.preparation}
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-4">
                <div className="font-black text-xs uppercase text-slate-900 mb-2 flex items-center gap-1.5">
                  <span>✂️</span>
                  <span>Required Materials</span>
                </div>
                <ul className="space-y-1.5">
                  {selectedActivity.materialsNeeded.map((mat, i) => (
                    <li key={i} className="text-xs font-bold text-slate-700 flex items-start gap-2">
                      <span className="text-amber-500 font-black">•</span>
                      <span>{mat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* ================================================================= */}
            {/* CONNECTED WRITTEN + EXACT MATCHING 2D VISUAL STEP GUIDE           */}
            {/* ================================================================= */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between border-b-2 border-amber-200 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">🎨</span>
                  <div>
                    <h4 className="font-black text-base uppercase text-slate-900">
                      Step-by-Step Activity & Visual Guide
                    </h4>
                    <p className="text-xs font-bold text-slate-600">
                      Each written step is connected directly with its matching 2D preschool classroom illustration.
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-black text-amber-900 bg-amber-200 px-3 py-1 rounded-full uppercase">
                  {selectedActivity.writtenSteps.length} Complete Steps
                </span>
              </div>

              <div className="space-y-4">
                {selectedActivity.writtenSteps.map((step) => {
                  const vStep =
                    selectedActivity.visualSteps.find((vs) => vs.stepNumber === step.stepNumber) ||
                    selectedActivity.visualSteps[step.stepNumber - 1];
                  return (
                    <div
                      key={step.stepNumber}
                      className="bg-white border-2 border-amber-300 rounded-3xl p-5 sm:p-6 shadow-sm hover:border-amber-500 transition-all flex flex-col lg:flex-row items-stretch gap-6"
                    >
                      {/* Left: Written Teaching Guide */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2.5 mb-2.5">
                            <span className="bg-amber-500 text-white font-black text-xs px-3 py-1 rounded-full uppercase shadow-xs">
                              STEP {step.stepNumber}
                            </span>
                            <h5 className="text-base sm:text-lg font-black uppercase text-slate-900">
                              {step.title}
                            </h5>
                          </div>

                          <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 mb-3">
                            <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 block mb-1">
                              Teacher Instruction & Child Action:
                            </span>
                            <p className="text-xs sm:text-sm font-bold text-slate-800 leading-relaxed">
                              {step.description}
                            </p>
                          </div>
                        </div>

                        {vStep && (
                          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-[11px] font-bold text-slate-600">
                            <span className="text-amber-600 font-black">Visual Focus:</span>
                            <span className="bg-slate-100 text-slate-800 px-2.5 py-0.5 rounded-md">
                              {vStep.highlightDetail || vStep.title}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Right: Exact Matching 2D Vector Illustration */}
                      <div className="w-full lg:w-80 shrink-0 flex flex-col justify-center">
                        <ActivityStepIllustration
                          activityId={selectedActivity.id}
                          stepNumber={step.stepNumber}
                          type={vStep?.illustrationType}
                          highlightDetail={vStep?.highlightDetail || step.title}
                          title={step.title}
                          instruction={step.description}
                          topic={selectedActivity.name}
                          materials={selectedActivity.materialsNeeded}
                          className="w-full h-48"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Teacher Tips, Child Participation & Learning Outcome */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                <div className="font-black text-xs uppercase text-amber-950 mb-2 flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                  <span>Teacher Tips & Prompts</span>
                </div>
                <ul className="space-y-1.5">
                  {selectedActivity.teacherTips.map((tip, i) => (
                    <li key={i} className="text-xs font-bold text-amber-900 leading-snug">
                      • {tip}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4">
                <div className="font-black text-xs uppercase text-sky-950 mb-2 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-sky-600" />
                  <span>Child Participation</span>
                </div>
                <p className="text-xs font-bold text-sky-900 leading-relaxed">
                  {selectedActivity.childParticipation}
                </p>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
                <div className="font-black text-xs uppercase text-emerald-950 mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Target Learning Outcome</span>
                </div>
                <p className="text-xs font-bold text-emerald-900 leading-relaxed">
                  {selectedActivity.learningOutcome}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. ACTIVITY CREATOR / GENERATOR FORM                                      */}
      {/* ========================================================================= */}
      {view === 'GENERATOR_FORM' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center">
            <span className="text-[10px] font-black uppercase tracking-wider text-orange-800 bg-orange-100 px-3 py-1 rounded-full">
              Activity Creator
            </span>
            <h3 className="text-2xl font-black text-slate-900 uppercase mt-1">
              Preschool Activity Creator
            </h3>
            <p className="text-xs font-bold text-slate-600 mt-1">
              Enter your topic, available materials, and age group to generate a complete step-by-step written activity.
            </p>
          </div>

          <form onSubmit={handleGenerate} className="bg-orange-50/60 border-2 border-orange-200 rounded-3xl p-6 sm:p-8 space-y-5 shadow-sm">
            {formError && (
              <div className="bg-rose-50 border-2 border-rose-300 text-rose-800 rounded-2xl p-3 text-xs font-black flex items-center justify-between">
                <span>⚠️ {formError}</span>
                <button
                  type="button"
                  onClick={() => setFormError(null)}
                  className="text-rose-600 hover:text-rose-900 text-[10px] uppercase font-black cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* TOPIC */}
            <div>
              <label className="block text-xs font-black uppercase text-orange-950 mb-1.5">
                Topic <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                value={genTopic}
                onChange={(e) => {
                  setGenTopic(e.target.value);
                  if (formError) setFormError(null);
                }}
                placeholder="e.g. Color Sorting, Counting 1–5, Animal Movements, Shapes, Leaf Collage"
                className="w-full bg-white border-2 border-orange-300 rounded-2xl px-4 py-2.5 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
              />

              {/* Quick Topic Presets */}
              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                <span className="text-[11px] font-bold text-slate-500">Quick ideas:</span>
                {['Color Sorting', 'Counting 1–5', 'Playdough Shapes', 'Animal Movements', 'Nature Collage'].map((pre) => (
                  <button
                    key={pre}
                    type="button"
                    onClick={() => {
                      soundManager.playPop();
                      setGenTopic(pre);
                      if (formError) setFormError(null);
                    }}
                    className="px-2.5 py-0.5 rounded-full bg-white border border-orange-200 text-orange-800 text-[11px] font-bold hover:bg-orange-100 cursor-pointer transition-colors"
                  >
                    {pre}
                  </button>
                ))}
              </div>
            </div>

            {/* MATERIALS / THINGS AVAILABLE */}
            <div>
              <label className="block text-xs font-black uppercase text-orange-950 mb-1.5">
                Materials / Things Available
              </label>
              <input
                type="text"
                value={genMaterials}
                onChange={(e) => setGenMaterials(e.target.value)}
                placeholder="e.g. Colored blocks, paper, markers, plastic cups, buttons"
                className="w-full bg-white border-2 border-orange-300 rounded-2xl px-4 py-2.5 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
              />
              <p className="text-[11px] font-bold text-slate-500 mt-1">
                Enter any materials on hand, or leave blank to use standard classroom craft supplies.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* TARGET AGE */}
              <div>
                <label className="block text-xs font-black uppercase text-orange-950 mb-1.5">
                  Age Group
                </label>
                <select
                  value={genAgeGroup}
                  onChange={(e) => setGenAgeGroup(e.target.value)}
                  className="w-full bg-white border-2 border-orange-300 rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm font-bold text-slate-900"
                >
                  <option value="2–3 years (Toddlers)">Toddlers (2–3 years)</option>
                  <option value="3–4 years (Early Preschool)">Early Preschool (3–4 years)</option>
                  <option value="3–5 years">Preschool (3–5 years)</option>
                  <option value="4–5 years (Pre-K)">Pre-K (4–5 years)</option>
                  <option value="5–6 years (Kindergarten)">Kindergarten (5–6 years)</option>
                </select>
              </div>

              {/* ADDITIONAL CLASSROOM INSTRUCTIONS (Optional) */}
              <div>
                <label className="block text-xs font-black uppercase text-orange-950 mb-1.5">
                  Classroom Context (Optional)
                </label>
                <input
                  type="text"
                  value={genNotes}
                  onChange={(e) => setGenNotes(e.target.value)}
                  placeholder="e.g. Small group of 6, 15-minute circle time"
                  className="w-full bg-white border-2 border-orange-300 rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-900 focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                />
              </div>
            </div>

            {/* GENERATE BUTTON */}
            <div className="pt-2 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => {
                  soundManager.playPop();
                  setView('HOME');
                }}
                className="bg-white hover:bg-slate-100 text-slate-700 text-xs font-black px-4 py-2.5 rounded-2xl border border-slate-300 cursor-pointer shadow-xs"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs sm:text-sm uppercase py-3 rounded-2xl shadow-md cursor-pointer transition-all hover:shadow-lg flex items-center justify-center gap-2"
              >
                <span>✨ GENERATE ACTIVITY</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. GENERATOR RESULT VIEW (WRITTEN ACTIVITY ONLY)                         */}
      {/* ========================================================================= */}
      {view === 'GENERATOR_RESULT' && generatedActivity && (
        <div className="space-y-6">
          {/* Top Bar with Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-orange-50/80 border border-orange-200 rounded-2xl p-4">
            <button
              type="button"
              onClick={() => {
                soundManager.playPop();
                setView('GENERATOR_FORM');
              }}
              className="flex items-center gap-1.5 text-xs font-black text-orange-950 bg-white hover:bg-orange-100 border border-orange-300 px-3.5 py-1.5 rounded-xl transition-colors cursor-pointer shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Back to Activity Creator</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => toggleSaveActivity(generatedActivity)}
                className={`flex items-center gap-1.5 text-xs font-black px-3.5 py-1.5 rounded-xl border transition-colors cursor-pointer shadow-xs ${
                  isActivitySaved(generatedActivity.id)
                    ? 'bg-amber-600 text-white border-amber-600'
                    : 'bg-white hover:bg-amber-100 text-amber-900 border-amber-300'
                }`}
              >
                {isActivitySaved(generatedActivity.id) ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                <span>{isActivitySaved(generatedActivity.id) ? 'SAVED' : 'SAVE ACTIVITY'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const writtenText = `
ACTIVITY TITLE: ${generatedActivity.name}
AGE GROUP: ${generatedActivity.ageGroup}
LEARNING AREA: ${generatedActivity.learningArea}
DURATION: ${generatedActivity.duration}

OBJECTIVE:
${generatedActivity.objective}

MATERIALS NEEDED:
${generatedActivity.materialsNeeded.map((m) => `• ${m}`).join('\n')}

STEP-BY-STEP WRITTEN INSTRUCTIONS:
${generatedActivity.writtenSteps.map((s) => `Step ${s.stepNumber}: ${s.title}\n${s.description}`).join('\n\n')}

TEACHER TIPS:
${generatedActivity.teacherTips.map((t) => `• ${t}`).join('\n')}

CHILD PARTICIPATION:
${generatedActivity.childParticipation}

LEARNING OUTCOME:
${generatedActivity.learningOutcome}
                  `.trim();
                  handleCopy(writtenText, 'gen_copy');
                }}
                className="bg-white hover:bg-orange-100 text-slate-700 border border-slate-300 text-xs font-black px-3 py-1.5 rounded-xl cursor-pointer flex items-center gap-1 shadow-xs"
              >
                {copiedKey === 'gen_copy' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'gen_copy' ? 'COPIED' : 'COPY'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleDownload(generatedActivity)}
                className="bg-white hover:bg-orange-100 text-orange-900 border border-orange-300 text-xs font-black px-3 py-1.5 rounded-xl cursor-pointer flex items-center gap-1 shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>DOWNLOAD</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="bg-orange-600 hover:bg-orange-700 text-white text-xs font-black px-3.5 py-1.5 rounded-xl cursor-pointer flex items-center gap-1 shadow-md"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>PRINT</span>
              </button>
            </div>
          </div>

          {/* Rendered Pure Written Activity Document */}
          <div className="bg-white border-2 border-orange-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
            {/* Header: Title & Meta */}
            <div className="border-b-2 border-orange-100 pb-5">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-[11px] font-black uppercase text-orange-900 bg-orange-100 border border-orange-200 px-3 py-0.5 rounded-md">
                  {generatedActivity.learningArea}
                </span>
                <span className="text-[11px] font-black uppercase text-slate-700 bg-slate-100 border border-slate-200 px-3 py-0.5 rounded-md">
                  AGE: {generatedActivity.ageGroup}
                </span>
                <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1 bg-slate-50 border border-slate-200 px-2.5 py-0.5 rounded-md">
                  <Clock className="w-3 h-3 text-orange-600" />
                  DURATION: {generatedActivity.duration}
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black uppercase text-slate-900 tracking-tight">
                {generatedActivity.name}
              </h3>
            </div>

            {/* Objective & Materials */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Objective */}
              <div className="bg-orange-50/60 border border-orange-200 rounded-2xl p-5">
                <h4 className="font-black text-xs uppercase tracking-wider text-orange-950 mb-2 flex items-center gap-1.5">
                  <span>🎯</span>
                  <span>OBJECTIVE</span>
                </h4>
                <p className="text-xs sm:text-sm font-bold text-slate-800 leading-relaxed mb-3">
                  {generatedActivity.objective}
                </p>
                <div className="bg-white border border-orange-200 rounded-xl p-3 text-xs font-bold text-slate-700">
                  <span className="text-orange-950 uppercase text-[10px] font-black block mb-0.5">Preparation:</span>
                  {generatedActivity.preparation}
                </div>
              </div>

              {/* Materials Needed */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                <h4 className="font-black text-xs uppercase tracking-wider text-slate-900 mb-2.5 flex items-center gap-1.5">
                  <span>✂️</span>
                  <span>MATERIALS NEEDED</span>
                </h4>
                <ul className="space-y-2">
                  {generatedActivity.materialsNeeded.map((mat, i) => (
                    <li key={i} className="text-xs sm:text-sm font-bold text-slate-800 flex items-start gap-2">
                      <span className="text-orange-500 font-black text-base leading-none">•</span>
                      <span>{mat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Step-by-Step Written Instructions */}
            <div className="space-y-3 pt-2">
              <div className="border-b-2 border-orange-200 pb-2">
                <h4 className="font-black text-sm uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block"></span>
                  <span>STEP-BY-STEP WRITTEN INSTRUCTIONS</span>
                </h4>
              </div>

              <div className="space-y-3">
                {generatedActivity.writtenSteps.map((step) => (
                  <div
                    key={step.stepNumber}
                    className="bg-slate-50 hover:bg-orange-50/30 border-2 border-slate-200 hover:border-orange-300 rounded-2xl p-4 sm:p-5 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 mb-2">
                      <span className="bg-orange-500 text-white font-black text-xs px-3 py-1 rounded-full uppercase shadow-xs">
                        Step {step.stepNumber}
                      </span>
                      <h5 className="text-sm sm:text-base font-black uppercase text-slate-900">
                        {step.title}
                      </h5>
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-slate-800 leading-relaxed pl-1">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Teacher Tips, Child Participation & Learning Outcome */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {/* Teacher Tips */}
              <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4">
                <h4 className="font-black text-xs uppercase tracking-wider text-amber-950 mb-2 flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                  <span>TEACHER TIPS</span>
                </h4>
                <ul className="space-y-2">
                  {generatedActivity.teacherTips.map((tip, i) => (
                    <li key={i} className="text-xs font-bold text-amber-900 leading-snug flex items-start gap-1.5">
                      <span className="text-amber-600 font-black">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Child Participation */}
              <div className="bg-sky-50/80 border border-sky-200 rounded-2xl p-4">
                <h4 className="font-black text-xs uppercase tracking-wider text-sky-950 mb-2 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-sky-600" />
                  <span>CHILD PARTICIPATION</span>
                </h4>
                <p className="text-xs font-bold text-sky-900 leading-relaxed">
                  {generatedActivity.childParticipation}
                </p>
              </div>

              {/* Learning Outcome */}
              <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4">
                <h4 className="font-black text-xs uppercase tracking-wider text-emerald-950 mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>LEARNING OUTCOME</span>
                </h4>
                <p className="text-xs font-bold text-emerald-900 leading-relaxed">
                  {generatedActivity.learningOutcome}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. SAVED ACTIVITIES BOOKMARK VIEW                                         */}
      {/* ========================================================================= */}
      {view === 'SAVED_LIST' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black text-slate-900 uppercase flex items-center gap-2">
                <BookmarkCheck className="w-5 h-5 text-amber-600" />
                <span>Saved Classroom Activities ({savedActivities.length})</span>
              </h3>
              <p className="text-xs font-bold text-slate-600 mt-0.5">
                Quick access to your bookmarked preschool activities and custom generated lesson aids.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                soundManager.playPop();
                setView('HOME');
              }}
              className="flex items-center gap-1 text-xs font-black text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 px-3 py-1.5 rounded-xl cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          </div>

          {savedActivities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedActivities.map((act) => {
                const isGenerated = act.id.startsWith('gen-');
                return (
                  <div
                    key={act.id}
                    className="bg-white border-2 border-amber-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-[10px] font-black uppercase text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-md">
                          {act.category}
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleSaveActivity(act)}
                          className="text-rose-500 hover:text-rose-700 text-xs font-bold p-1 cursor-pointer"
                          title="Remove"
                        >
                          Remove
                        </button>
                      </div>

                      <h4 className="text-base font-black text-slate-900 uppercase line-clamp-1 mt-1">
                        {act.name}
                      </h4>

                      <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500 my-2">
                        <span className="bg-slate-100 px-2 py-0.5 rounded-md font-black text-slate-700">
                          {act.ageGroup}
                        </span>
                        <span>{act.duration}</span>
                      </div>

                      <p className="text-xs font-bold text-slate-600 line-clamp-2 leading-relaxed mb-3">
                        {act.objective}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] font-black text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md">
                        {isGenerated ? 'Written Activity' : `${act.visualSteps.length} Visual Steps`}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          soundManager.playPop();
                          if (isGenerated) {
                            setGeneratedActivity(act);
                            setView('GENERATOR_RESULT');
                          } else {
                            setSelectedActivity(act);
                            setView('READY_MADE_VIEW');
                          }
                        }}
                        className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-black px-3.5 py-1.5 rounded-xl cursor-pointer transition-colors shadow-xs"
                      >
                        {isGenerated ? 'Open Activity →' : 'Open Guide →'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300">
              <Bookmark className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs font-black text-slate-600 uppercase">No saved activities yet</p>
              <p className="text-xs font-bold text-slate-500 mt-0.5">
                Click "Save Activity" on any ready-made or generated activity to pin it here.
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
