import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Circle,
  Download,
  Printer,
  BookOpen,
  Trash2,
  X,
  Sparkles,
  ChevronRight,
  Check,
  Award,
  HelpCircle,
  AlertTriangle
} from 'lucide-react';
import { LEARNING_AREAS_INFO } from '../../data/learningItems';
import { soundManager } from '../../utils/audio';

// Clean Types for Simple Teacher Assessment
export type ChildBehaviour = 'GOOD' | 'NORMAL' | 'NEED IMPROVEMENT' | '';

export interface AreaAssessmentState {
  covered: boolean;
  date: string; // YYYY-MM-DD
}

export interface SimpleChildAssessment {
  id: string;
  name: string;
  age: string;
  teacherName: string;
  coveredAreas: Record<string, AreaAssessmentState>;
  behaviour: ChildBehaviour;
  createdAt: string;
}

interface TeacherAssessmentToolProps {
  onBackToOverview?: () => void;
}

export const TeacherAssessmentTool: React.FC<TeacherAssessmentToolProps> = ({ onBackToOverview }) => {
  // Storage key
  const STORAGE_KEY = 'playroom_teacher_assessments_clean_v2';

  // State
  const [childrenList, setChildrenList] = useState<SimpleChildAssessment[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);

  // Modals & Forms State
  const [isAddChildModalOpen, setIsAddChildModalOpen] = useState(false);
  const [newChildName, setNewChildName] = useState('');
  const [newChildAge, setNewChildAge] = useState('');
  const [isTeacherGuideOpen, setIsTeacherGuideOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState(false);
  const [downloadNotice, setDownloadNotice] = useState(false);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(childrenList));
  }, [childrenList]);

  // Selected Child
  const selectedChild = childrenList.find((c) => c.id === selectedChildId) || null;

  // Handler: Add Child (ONLY Name and Age)
  const handleAddChild = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChildName.trim()) return;

    soundManager.playPop();
    const newId = `child_${Date.now()}`;
    const initialCoveredAreas: Record<string, AreaAssessmentState> = {};

    LEARNING_AREAS_INFO.forEach((area) => {
      initialCoveredAreas[area.id] = {
        covered: false,
        date: '',
      };
    });

    const newChild: SimpleChildAssessment = {
      id: newId,
      name: newChildName.trim(),
      age: newChildAge.trim() || '4',
      teacherName: '',
      coveredAreas: initialCoveredAreas,
      behaviour: '',
      createdAt: new Date().toISOString(),
    };

    setChildrenList((prev) => [...prev, newChild]);
    setSelectedChildId(newId);
    setNewChildName('');
    setNewChildAge('');
    setIsAddChildModalOpen(false);
  };

  // Handler: Delete Child
  const handleDeleteChild = (id: string) => {
    soundManager.playPop();
    setChildrenList((prev) => prev.filter((c) => c.id !== id));
    if (selectedChildId === id) {
      setSelectedChildId(null);
    }
    setDeleteConfirmId(null);
  };

  // Handler: Delete All Children
  const handleDeleteAllChildren = () => {
    soundManager.playPop();
    setChildrenList([]);
    setSelectedChildId(null);
    setIsDeleteAllModalOpen(false);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  // Handler: Toggle Learning Area Covered
  const handleToggleArea = (areaId: string) => {
    if (!selectedChildId) return;
    soundManager.playPop();

    const todayStr = new Date().toISOString().split('T')[0];

    setChildrenList((prev) =>
      prev.map((child) => {
        if (child.id !== selectedChildId) return child;

        const currentArea = child.coveredAreas[areaId] || { covered: false, date: '' };
        const nextCovered = !currentArea.covered;

        return {
          ...child,
          coveredAreas: {
            ...child.coveredAreas,
            [areaId]: {
              covered: nextCovered,
              date: nextCovered ? currentArea.date || todayStr : '',
            },
          },
        };
      })
    );
  };

  // Handler: Change Date for a specific Learning Area
  const handleAreaDateChange = (areaId: string, date: string) => {
    if (!selectedChildId) return;

    setChildrenList((prev) =>
      prev.map((child) => {
        if (child.id !== selectedChildId) return child;

        const currentArea = child.coveredAreas[areaId] || { covered: false, date: '' };
        return {
          ...child,
          coveredAreas: {
            ...child.coveredAreas,
            [areaId]: {
              ...currentArea,
              date,
              covered: true, // setting a date ensures it is marked covered
            },
          },
        };
      })
    );
  };

  // Handler: Select Behaviour
  const handleSelectBehaviour = (behaviour: ChildBehaviour) => {
    if (!selectedChildId) return;
    soundManager.playPop();

    setChildrenList((prev) =>
      prev.map((child) => {
        if (child.id !== selectedChildId) return child;
        return {
          ...child,
          behaviour: child.behaviour === behaviour ? '' : behaviour,
        };
      })
    );
  };

  // Handler: Update Teacher Name
  const handleTeacherNameChange = (name: string) => {
    if (!selectedChildId) return;

    setChildrenList((prev) =>
      prev.map((child) => {
        if (child.id !== selectedChildId) return child;
        return {
          ...child,
          teacherName: name,
        };
      })
    );
  };

  // Calculate Covered & Remaining Areas for Selected Child
  const totalAreasCount = LEARNING_AREAS_INFO.length; // 8
  const coveredAreasList = LEARNING_AREAS_INFO.filter(
    (area) => selectedChild?.coveredAreas[area.id]?.covered
  );
  const remainingAreasList = LEARNING_AREAS_INFO.filter(
    (area) => !selectedChild?.coveredAreas[area.id]?.covered
  );
  const coveredCount = coveredAreasList.length;
  const remainingCount = remainingAreasList.length;

  // Handler: Download Assessment Slip
  const handleDownload = () => {
    if (!selectedChild) return;
    soundManager.playPop();

    const todayFormatted = new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    const slipText = `=====================================================
PRESCHOOL TEACHER ASSESSMENT
=====================================================

CHILD PROFILE
• Child Name: ${selectedChild.name}
• Age: ${selectedChild.age}
• Teacher: ${selectedChild.teacherName.trim() || 'Not yet recorded'}
• Assessment Date: ${todayFormatted}

-----------------------------------------------------
LEARNING AREAS ASSESSMENT (8 CORE DOMAINS)
-----------------------------------------------------
${LEARNING_AREAS_INFO.map((area) => {
  const state = selectedChild.coveredAreas[area.id];
  if (state?.covered) {
    const formattedDate = state.date
      ? new Date(state.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
      : todayFormatted;
    return `[✓] ${area.title}: Covered (${formattedDate})`;
  } else {
    return `[○] ${area.title}: Not Yet Covered`;
  }
}).join('\n')}

-----------------------------------------------------
ASSESSMENT PROGRESS
-----------------------------------------------------
• Covered: ${coveredCount} / ${totalAreasCount}
• Remaining: ${remainingCount} / ${totalAreasCount}

Covered Areas:
${coveredAreasList.length > 0 ? coveredAreasList.map((a) => `  - ${a.title}`).join('\n') : '  - None'}

Remaining Areas to Assess:
${remainingAreasList.length > 0 ? remainingAreasList.map((a) => `  - ${a.title}`).join('\n') : '  - All 8 Learning Areas Covered'}

-----------------------------------------------------
BEHAVIOUR
-----------------------------------------------------
• Observed Behaviour: ${selectedChild.behaviour || 'Not yet recorded'}

=====================================================
Preschool Educator Suite — Official Teacher Assessment
=====================================================`;

    const blob = new Blob([slipText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedChild.name.replace(/\s+/g, '_')}_Teacher_Assessment_Slip.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadNotice(true);
    setTimeout(() => setDownloadNotice(false), 3000);
  };

  // Handler: Print Assessment Slip
  const handlePrint = () => {
    soundManager.playPop();
    window.print();
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Top Header Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs print:hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onBackToOverview && !selectedChild && (
              <button
                type="button"
                onClick={() => {
                  soundManager.playPop();
                  onBackToOverview();
                }}
                className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-xl text-xs font-black transition-colors cursor-pointer border border-slate-300"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Hub</span>
              </button>
            )}

            {selectedChild && (
              <button
                type="button"
                onClick={() => {
                  soundManager.playPop();
                  setSelectedChildId(null);
                }}
                className="flex items-center gap-1.5 bg-purple-100 hover:bg-purple-200 text-purple-900 px-3.5 py-1.5 rounded-xl text-xs font-black transition-colors cursor-pointer border border-purple-300"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Child Profiles</span>
              </button>
            )}

            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                Card 1 • Teacher Assessment
              </span>
              <h1 className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-tight">
                Teacher Assessment
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                soundManager.playPop();
                setIsTeacherGuideOpen(true);
              }}
              className="flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 px-3.5 py-1.5 rounded-xl text-xs font-black transition-colors cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-amber-700" />
              <span className="hidden sm:inline">Teacher Guide</span>
              <span className="sm:hidden">Guide</span>
            </button>

            {!selectedChild && (
              <div className="flex items-center gap-2">
                {childrenList.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playPop();
                      setIsDeleteAllModalOpen(true);
                    }}
                    className="flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 px-3 py-1.5 rounded-xl text-xs font-black transition-colors cursor-pointer"
                    title="Delete all children assessments"
                  >
                    <Trash2 className="w-4 h-4 text-rose-600" />
                    <span className="hidden sm:inline">Delete All</span>
                    <span className="sm:hidden">Delete</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playPop();
                    setIsAddChildModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 rounded-xl text-xs font-black shadow-xs transition-colors cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>+ Add Child</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {/* ========================================================================= */}
        {/* VIEW 1: CHILD PROFILES LIST (EMPTY OR CARDS)                               */}
        {/* ========================================================================= */}
        {!selectedChild ? (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight">
                  Child Profiles
                </h2>
                <p className="text-xs font-bold text-slate-600 mt-0.5">
                  Select a child to assess their 8 learning areas, record dates, and evaluate classroom behaviour.
                </p>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                {childrenList.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playPop();
                      setIsDeleteAllModalOpen(true);
                    }}
                    className="flex items-center justify-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border-2 border-rose-300 hover:border-rose-400 text-xs font-black px-4 py-2.5 rounded-2xl shadow-xs cursor-pointer transition-all active:scale-95"
                    title="Delete all assessment records"
                  >
                    <Trash2 className="w-4 h-4 text-rose-600" />
                    <span>Delete All</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    soundManager.playPop();
                    setIsAddChildModalOpen(true);
                  }}
                  className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black px-5 py-2.5 rounded-2xl shadow-xs cursor-pointer transition-all hover:scale-105 shrink-0"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>+ Add Child</span>
                </button>
              </div>
            </div>

            {/* EMPTY STATE */}
            {childrenList.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-slate-300 rounded-3xl p-12 text-center space-y-4 shadow-xs">
                <div className="w-16 h-16 bg-purple-50 border-2 border-purple-200 rounded-2xl flex items-center justify-center text-3xl mx-auto text-purple-600">
                  👶
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-800 uppercase">
                    No children added yet.
                  </h3>
                  <p className="text-xs font-bold text-slate-500 max-w-sm mx-auto mt-1">
                    Click the button below to add your first child profile using just their name and age.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playPop();
                    setIsAddChildModalOpen(true);
                  }}
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm px-6 py-3 rounded-2xl shadow-md cursor-pointer transition-all hover:scale-105"
                >
                  <UserPlus className="w-5 h-5" />
                  <span>+ Add Child</span>
                </button>
              </div>
            ) : (
              /* CHILD CARDS GRID */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {childrenList.map((child) => {
                  const covered = Object.values(child.coveredAreas || {}).filter(
                    (a: AreaAssessmentState) => a && a.covered
                  ).length;
                  const remaining = 8 - covered;

                  return (
                    <div
                      key={child.id}
                      onClick={() => {
                        soundManager.playPop();
                        setSelectedChildId(child.id);
                      }}
                      className="bg-white border-2 border-slate-200 hover:border-purple-400 rounded-3xl p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3">
                          <div className="w-12 h-12 bg-purple-100 border border-purple-300 rounded-2xl flex items-center justify-center text-2xl font-black text-purple-800">
                            {child.name.charAt(0).toUpperCase()}
                          </div>

                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-black uppercase text-purple-800 bg-purple-50 border border-purple-200 px-2.5 py-1 rounded-full">
                              Covered: {covered}/8
                            </span>
                            <button
                              type="button"
                              title="Delete Child"
                              onClick={(e) => {
                                e.stopPropagation();
                                soundManager.playPop();
                                setDeleteConfirmId(child.id);
                              }}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="mt-3">
                          <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight group-hover:text-purple-700 transition-colors">
                            {child.name}
                          </h3>
                          <p className="text-xs font-bold text-slate-500">
                            Age: {child.age}
                          </p>
                        </div>

                        {/* Mini progress bar */}
                        <div className="mt-4">
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                            <div
                              className="bg-emerald-500 h-full transition-all duration-300"
                              style={{ width: `${(covered / 8) * 100}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-[10px] font-bold text-slate-500 mt-1">
                            <span>{covered} Covered</span>
                            <span>{remaining} Remaining</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-black text-purple-700">
                        <span>Open Assessment</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  );
                })}

                {/* Card to add another child */}
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playPop();
                    setIsAddChildModalOpen(true);
                  }}
                  className="bg-slate-50 hover:bg-purple-50/50 border-2 border-dashed border-slate-300 hover:border-purple-300 rounded-3xl p-6 text-center flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors min-h-[170px]"
                >
                  <div className="w-10 h-10 bg-white border border-slate-300 rounded-xl flex items-center justify-center text-slate-600">
                    <UserPlus className="w-5 h-5 text-purple-600" />
                  </div>
                  <span className="text-xs font-black text-slate-800 uppercase">
                    + Add Another Child
                  </span>
                  <span className="text-[10px] font-bold text-slate-500">
                    Supports 20+ preschool children
                  </span>
                </button>
              </div>
            )}
          </div>
        ) : (
          /* ========================================================================= */
          /* VIEW 2: INDIVIDUAL CHILD ASSESSMENT SCREEN                                 */
          /* ========================================================================= */
          <div className="space-y-6">
            {/* Child Header Card */}
            <div className="bg-white border-2 border-purple-200 rounded-3xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 bg-purple-100 border-2 border-purple-300 rounded-2xl flex items-center justify-center text-2xl font-black text-purple-900 shrink-0">
                  {selectedChild.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                      Active Child Assessment
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight mt-0.5">
                    {selectedChild.name}
                  </h2>
                  <p className="text-xs font-bold text-slate-600">
                    Age: {selectedChild.age}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playPop();
                    setIsTeacherGuideOpen(true);
                  }}
                  className="flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 px-3 py-2 rounded-xl text-xs font-black transition-colors cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-amber-700" />
                  <span>Teacher Guide</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundManager.playPop();
                    setSelectedChildId(null);
                  }}
                  className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-black transition-colors cursor-pointer border border-slate-300"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Switch Child</span>
                </button>
              </div>
            </div>

            {/* 2-COLUMN LAYOUT: MAIN ASSESSMENT & RIGHT SIDEBAR */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* LEFT / MAIN COLUMN (8 LEARNING AREAS + BEHAVIOUR) */}
              <div className="lg:col-span-8 space-y-6">
                {/* 1. LEARNING AREAS */}
                <div className="bg-white border-2 border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
                  <div className="border-b border-slate-100 pb-3">
                    <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full">
                      Existing 8 Core Areas
                    </span>
                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight mt-1">
                      Learning Areas Assessment
                    </h3>
                    <p className="text-xs font-bold text-slate-600">
                      Tick each learning area when covered/assessed and enter the observation date.
                    </p>
                  </div>

                  {/* 8 Areas List */}
                  <div className="space-y-3">
                    {LEARNING_AREAS_INFO.map((area, idx) => {
                      const areaState = selectedChild.coveredAreas[area.id] || { covered: false, date: '' };
                      const isCovered = areaState.covered;

                      return (
                        <div
                          key={area.id}
                          className={`border-2 rounded-2xl p-4 transition-all ${
                            isCovered
                              ? 'bg-emerald-50/50 border-emerald-300 shadow-xs'
                              : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            {/* Area Title and Icon */}
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{area.icon}</span>
                              <div>
                                <h4 className="text-sm font-black text-slate-900 uppercase flex items-center gap-1.5">
                                  <span>{idx + 1}. {area.title}</span>
                                  {isCovered && (
                                    <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                                      ✓ Covered
                                    </span>
                                  )}
                                </h4>
                                <p className="text-[11px] font-bold text-slate-500">
                                  {area.description}
                                </p>
                              </div>
                            </div>

                            {/* Controls: Checkbox & Date Picker */}
                            <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                              {/* Date Picker */}
                              <div className="flex items-center gap-1.5 text-xs font-bold">
                                <label className="text-[11px] text-slate-500 font-black uppercase">
                                  Date:
                                </label>
                                <input
                                  type="date"
                                  value={areaState.date || ''}
                                  onChange={(e) => handleAreaDateChange(area.id, e.target.value)}
                                  className={`bg-white border rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-purple-400 ${
                                    isCovered ? 'border-emerald-300 font-black' : 'border-slate-300 text-slate-400'
                                  }`}
                                />
                              </div>

                              {/* Covered Button / Checkbox */}
                              <button
                                type="button"
                                onClick={() => handleToggleArea(area.id)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-black text-xs transition-all cursor-pointer shadow-xs ${
                                  isCovered
                                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300'
                                }`}
                              >
                                {isCovered ? (
                                  <>
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span>Covered</span>
                                  </>
                                ) : (
                                  <>
                                    <Circle className="w-4 h-4 text-slate-400" />
                                    <span>Mark Covered</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 2. BEHAVIOUR SECTION */}
                <div className="bg-white border-2 border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                      Behaviour
                    </h3>
                    <p className="text-xs font-bold text-slate-600">
                      Select the observed classroom behaviour for {selectedChild.name}.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Option 1: GOOD */}
                    <button
                      type="button"
                      onClick={() => handleSelectBehaviour('GOOD')}
                      className={`p-4 rounded-2xl border-2 font-black text-xs flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                        selectedChild.behaviour === 'GOOD'
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-300'
                          : 'bg-slate-50 text-emerald-900 border-emerald-200 hover:bg-emerald-50/60'
                      }`}
                    >
                      <span className="text-2xl">🌟</span>
                      <span className="uppercase text-sm">Good</span>
                      <span className={`text-[10px] font-bold ${selectedChild.behaviour === 'GOOD' ? 'text-emerald-100' : 'text-emerald-700'}`}>
                        Positive engagement & social harmony
                      </span>
                    </button>

                    {/* Option 2: NORMAL */}
                    <button
                      type="button"
                      onClick={() => handleSelectBehaviour('NORMAL')}
                      className={`p-4 rounded-2xl border-2 font-black text-xs flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                        selectedChild.behaviour === 'NORMAL'
                          ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-300'
                          : 'bg-slate-50 text-blue-900 border-blue-200 hover:bg-blue-50/60'
                      }`}
                    >
                      <span className="text-2xl">👍</span>
                      <span className="uppercase text-sm">Normal</span>
                      <span className={`text-[10px] font-bold ${selectedChild.behaviour === 'NORMAL' ? 'text-blue-100' : 'text-blue-700'}`}>
                        Age-appropriate participation
                      </span>
                    </button>

                    {/* Option 3: NEED IMPROVEMENT */}
                    <button
                      type="button"
                      onClick={() => handleSelectBehaviour('NEED IMPROVEMENT')}
                      className={`p-4 rounded-2xl border-2 font-black text-xs flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                        selectedChild.behaviour === 'NEED IMPROVEMENT'
                          ? 'bg-amber-500 text-white border-amber-500 shadow-md ring-2 ring-amber-300'
                          : 'bg-slate-50 text-amber-900 border-amber-200 hover:bg-amber-50/60'
                      }`}
                    >
                      <span className="text-2xl">🌱</span>
                      <span className="uppercase text-sm">Need Improvement</span>
                      <span className={`text-[10px] font-bold ${selectedChild.behaviour === 'NEED IMPROVEMENT' ? 'text-amber-100' : 'text-amber-700'}`}>
                        Requires gentle scaffolding & routine focus
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* RIGHT SIDEBAR (AUTOMATIC REMAINING AREAS + TEACHER NAME + DOWNLOAD) */}
              <div className="lg:col-span-4 space-y-6">
                {/* Assessment Progress Card */}
                <div className="bg-white border-2 border-slate-200 rounded-3xl p-5 shadow-xs space-y-4 sticky top-20">
                  <div className="border-b border-slate-100 pb-3">
                    <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                      Auto-Calculated
                    </span>
                    <h3 className="text-base font-black text-slate-900 uppercase tracking-tight mt-1">
                      Assessment Progress
                    </h3>
                  </div>

                  {/* Summary Metric Boxes */}
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-3">
                      <span className="text-[10px] font-black uppercase text-emerald-800 block">
                        Covered
                      </span>
                      <span className="text-2xl font-black text-emerald-700">
                        {coveredCount} / {totalAreasCount}
                      </span>
                    </div>

                    <div className="bg-slate-100 border border-slate-300 rounded-2xl p-3">
                      <span className="text-[10px] font-black uppercase text-slate-600 block">
                        Remaining
                      </span>
                      <span className="text-2xl font-black text-slate-800">
                        {remainingCount} / {totalAreasCount}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
                    <div
                      className="bg-emerald-500 h-full transition-all duration-300"
                      style={{ width: `${(coveredCount / totalAreasCount) * 100}%` }}
                    />
                  </div>

                  {/* Covered Areas List */}
                  <div>
                    <h4 className="text-xs font-black uppercase text-emerald-800 mb-2 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Covered Areas ({coveredCount})</span>
                    </h4>
                    {coveredAreasList.length === 0 ? (
                      <p className="text-xs font-bold text-slate-400 italic">
                        No areas marked covered yet.
                      </p>
                    ) : (
                      <ul className="space-y-1 text-xs font-bold text-slate-700">
                        {coveredAreasList.map((a) => (
                          <li key={a.id} className="flex items-center justify-between text-[11px] bg-emerald-50/60 px-2.5 py-1 rounded-lg">
                            <span className="flex items-center gap-1 text-emerald-950 font-black">
                              <span>{a.icon}</span>
                              <span className="truncate">{a.title}</span>
                            </span>
                            <span className="text-[10px] text-emerald-700 shrink-0 font-bold">
                              {selectedChild.coveredAreas[a.id]?.date || 'Done'}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Remaining Areas List */}
                  <div className="border-t border-slate-100 pt-3">
                    <h4 className="text-xs font-black uppercase text-slate-700 mb-2 flex items-center gap-1">
                      <Circle className="w-3.5 h-3.5 text-slate-400" />
                      <span>Remaining Areas ({remainingCount})</span>
                    </h4>
                    {remainingAreasList.length === 0 ? (
                      <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-black text-emerald-800 text-center">
                        🎉 All 8 Learning Areas Covered!
                      </div>
                    ) : (
                      <ul className="space-y-1 text-xs font-bold text-slate-600">
                        {remainingAreasList.map((a) => (
                          <li key={a.id} className="flex items-center gap-1.5 text-[11px] bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                            <span className="text-slate-400">○</span>
                            <span>{a.icon}</span>
                            <span className="truncate">{a.title}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Teacher Name Input */}
                  <div className="border-t border-slate-100 pt-3">
                    <label className="block text-xs font-black uppercase text-slate-700 mb-1">
                      Teacher Name
                    </label>
                    <input
                      type="text"
                      value={selectedChild.teacherName || ''}
                      onChange={(e) => handleTeacherNameChange(e.target.value)}
                      placeholder="e.g. Ms. Sarah"
                      className="w-full bg-slate-50 border-2 border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-hidden focus:border-purple-500 focus:bg-white"
                    />
                  </div>

                  {/* Action Buttons: DOWNLOAD & PRINT */}
                  <div className="border-t border-slate-100 pt-3 space-y-2">
                    <button
                      type="button"
                      onClick={handleDownload}
                      className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-black text-xs px-4 py-3 rounded-2xl shadow-md transition-all cursor-pointer hover:scale-[1.02]"
                    >
                      <Download className="w-4 h-4" />
                      <span>DOWNLOAD ASSESSMENT SLIP</span>
                    </button>

                    <button
                      type="button"
                      onClick={handlePrint}
                      className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-4 py-2.5 rounded-2xl border border-slate-300 transition-colors cursor-pointer"
                    >
                      <Printer className="w-4 h-4 text-slate-600" />
                      <span>Print Assessment Slip</span>
                    </button>

                    {downloadNotice && (
                      <p className="text-[11px] font-bold text-emerald-600 text-center animate-pulse">
                        ✓ Downloaded assessment slip successfully!
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* MODAL 1: ADD CHILD MODAL (ONLY NAME & AGE)                                */}
      {/* ========================================================================= */}
      {isAddChildModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-4 border-emerald-300 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-xl">
                  👶
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 uppercase">
                    + Add Child
                  </h3>
                  <p className="text-xs font-bold text-slate-500">
                    Create a new preschool assessment profile
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddChildModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddChild} className="space-y-4 text-xs font-bold">
              {/* Child Name */}
              <div>
                <label className="block text-slate-700 uppercase mb-1 font-black">
                  Child Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={newChildName}
                  onChange={(e) => setNewChildName(e.target.value)}
                  placeholder="e.g. Ayesha"
                  className="w-full bg-slate-50 border-2 border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-900 focus:outline-hidden focus:border-emerald-500 focus:bg-white"
                />
              </div>

              {/* Age */}
              <div>
                <label className="block text-slate-700 uppercase mb-1 font-black">
                  Age <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newChildAge}
                  onChange={(e) => setNewChildAge(e.target.value)}
                  placeholder="e.g. 4"
                  className="w-full bg-slate-50 border-2 border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-900 focus:outline-hidden focus:border-emerald-500 focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddChildModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black shadow-md cursor-pointer transition-all hover:scale-105"
                >
                  ADD CHILD
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: TEACHER GUIDE (HOW TO ASSESS A PRESCHOOL CHILD)                   */}
      {/* ========================================================================= */}
      {isTeacherGuideOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border-4 border-amber-300 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-amber-200 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-amber-100 rounded-2xl flex items-center justify-center text-2xl">
                  📖
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                    Pedagogical Guide
                  </span>
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mt-0.5">
                    Teacher Guide — How to Assess a Child
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsTeacherGuideOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs text-slate-700 leading-relaxed font-semibold">
              <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-3.5 flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-white font-black text-xs flex items-center justify-center shrink-0">1</span>
                <div>
                  <h4 className="font-black text-slate-900 uppercase">1. Observe</h4>
                  <p className="text-slate-600">Watch the child during normal classroom activities, guided games, and natural play.</p>
                </div>
              </div>

              <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-3.5 flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-white font-black text-xs flex items-center justify-center shrink-0">2</span>
                <div>
                  <h4 className="font-black text-slate-900 uppercase">2. Look for Participation</h4>
                  <p className="text-slate-600">Notice whether the child participates, explores freely, and engages with learning materials.</p>
                </div>
              </div>

              <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-3.5 flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-white font-black text-xs flex items-center justify-center shrink-0">3</span>
                <div>
                  <h4 className="font-black text-slate-900 uppercase">3. Check Learning Areas</h4>
                  <p className="text-slate-600">Mark a Learning Area as covered only after the teacher has had an opportunity to observe or assess the child in that area.</p>
                </div>
              </div>

              <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-3.5 flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-white font-black text-xs flex items-center justify-center shrink-0">4</span>
                <div>
                  <h4 className="font-black text-slate-900 uppercase">4. Record the Date</h4>
                  <p className="text-slate-600">Enter the exact date when the Learning Area was observed and assessed.</p>
                </div>
              </div>

              <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-3.5 flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-white font-black text-xs flex items-center justify-center shrink-0">5</span>
                <div>
                  <h4 className="font-black text-slate-900 uppercase">5. Observe Behaviour</h4>
                  <p className="text-slate-600">Select <span className="font-black text-emerald-700">Good</span>, <span className="font-black text-blue-700">Normal</span>, or <span className="font-black text-amber-700">Need Improvement</span> based on the teacher's classroom observation.</p>
                </div>
              </div>

              <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-3.5 flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-white font-black text-xs flex items-center justify-center shrink-0">6</span>
                <div>
                  <h4 className="font-black text-slate-900 uppercase">6. Do Not Guess</h4>
                  <p className="text-slate-600">Only record what the teacher actually observed during classroom sessions.</p>
                </div>
              </div>

              <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-3.5 flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-white font-black text-xs flex items-center justify-center shrink-0">7</span>
                <div>
                  <h4 className="font-black text-slate-900 uppercase">7. Assess Over Time</h4>
                  <p className="text-slate-600">A child does not need to be assessed in every area on one day. Continue assessing the remaining areas during future classroom activities.</p>
                </div>
              </div>

              <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-3.5 flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-white font-black text-xs flex items-center justify-center shrink-0">8</span>
                <div>
                  <h4 className="font-black text-slate-900 uppercase">8. Use Positive Support</h4>
                  <p className="text-slate-600">Focus on what the child can do and provide encouragement and support for areas that need improvement.</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-amber-200">
              <button
                type="button"
                onClick={() => setIsTeacherGuideOpen(false)}
                className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-black text-xs rounded-xl shadow-xs cursor-pointer"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: DELETE CONFIRMATION MODAL                                        */}
      {/* ========================================================================= */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-4 border-red-300 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 bg-red-100 border-2 border-red-200 rounded-2xl flex items-center justify-center text-red-600 mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-lg font-black text-slate-900 uppercase">
                Delete Child Profile
              </h3>
              <p className="text-xs font-bold text-slate-600">
                Are you sure you want to remove this child and their assessment data?
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteChild(deleteConfirmId)}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-black text-xs shadow-md cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: DELETE ALL CONFIRMATION MODAL                                    */}
      {/* ========================================================================= */}
      {isDeleteAllModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-4 border-rose-400 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-14 h-14 bg-rose-100 border-2 border-rose-300 rounded-2xl flex items-center justify-center text-rose-600 mx-auto">
              <Trash2 className="w-7 h-7" />
            </div>
            <div className="text-center space-y-1.5">
              <h3 className="text-lg font-black text-slate-900 uppercase">
                Delete All Child Assessments?
              </h3>
              <p className="text-xs font-bold text-slate-600 leading-relaxed">
                Are you sure you want to delete all <span className="text-rose-600 font-extrabold">{childrenList.length}</span> child profiles and assessment data? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsDeleteAllModalOpen(false)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAllChildren}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-black text-xs shadow-md cursor-pointer transition-all hover:scale-102 flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Yes, Delete All</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
