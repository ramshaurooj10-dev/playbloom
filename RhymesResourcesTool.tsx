import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  Search,
  Printer,
  Download,
  Copy,
  Check,
  Eye,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  X,
  HelpCircle,
  Activity,
  Layers,
  GraduationCap,
  Heart,
  Palette,
  Users,
  Compass,
} from 'lucide-react';
import { soundManager } from '../../utils/audio';
import {
  RHYMES_DATA,
  RHYME_CATEGORIES,
  RhymeResource,
  RhymeCategory,
} from '../../data/rhymesResourcesData';
import { Rhyme2DSvg } from './visuals/Rhyme2DSvg';

interface RhymesResourcesToolProps {
  onBack?: () => void;
}

type SubTab = 'rhymes' | 'teacher_guide' | 'actions' | 'questions' | 'activities';

export const RhymesResourcesTool: React.FC<RhymesResourcesToolProps> = () => {
  const [activeTab, setActiveTab] = useState<SubTab>('rhymes');
  const [selectedCategory, setSelectedCategory] = useState<RhymeCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRhymeId, setSelectedRhymeId] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [downloadSuccessId, setDownloadSuccessId] = useState<string | null>(null);

  // Filtered Rhymes
  const filteredRhymes = useMemo(() => {
    let list = RHYMES_DATA;
    if (selectedCategory !== 'all') {
      list = list.filter((r) => r.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.categoryName.toLowerCase().includes(q) ||
          r.learningArea.toLowerCase().includes(q) ||
          r.rhymeText.toLowerCase().includes(q) ||
          r.vocabulary.some((v) => v.toLowerCase().includes(q))
      );
    }
    return list;
  }, [selectedCategory, searchQuery]);

  // Active selected rhyme for modal / deep view
  const selectedRhyme = useMemo(() => {
    if (!selectedRhymeId) return null;
    return RHYMES_DATA.find((r) => r.id === selectedRhymeId) || null;
  }, [selectedRhymeId]);

  // Copy handler
  const handleCopy = (text: string, key: string) => {
    soundManager.playPop();
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Direct print handler
  const handlePrint = () => {
    soundManager.playPop();
    window.print();
  };

  // Standalone A4 Download Handler
  const handleDownloadRhyme = (rhyme: RhymeResource) => {
    soundManager.playPop();
    setDownloadSuccessId(rhyme.id);
    setTimeout(() => setDownloadSuccessId(null), 2500);

    const svgEl = document.querySelector(`[data-rhyme-id="${rhyme.id}"] svg`) || document.querySelector(`#modal-rhyme-svg svg`);
    const svgMarkup = svgEl ? svgEl.outerHTML : `<div style="font-size:64px;margin:12px 0;">🎵</div>`;

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${rhyme.title} - Printable Rhyme & Classroom Resource</title>
  <style>
    @page { size: A4 portrait; margin: 15mm; }
    * { box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
    body { margin: 0; padding: 20px; background: #f8fafc; color: #0f172a; display: flex; justify-content: center; }
    .sheet {
      width: 180mm;
      min-height: 260mm;
      background: white;
      border: 3px solid #f43f5e;
      border-radius: 20px;
      padding: 24px;
      box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);
      position: relative;
    }
    .header-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #ffe4e6;
      padding-bottom: 12px;
      margin-bottom: 16px;
    }
    .badge {
      background: #ffe4e6;
      color: #be123c;
      font-weight: 800;
      font-size: 11px;
      padding: 4px 10px;
      border-radius: 999px;
      text-transform: uppercase;
    }
    .area-badge {
      background: #f1f5f9;
      color: #475569;
      font-weight: 700;
      font-size: 11px;
      padding: 4px 10px;
      border-radius: 999px;
    }
    .title-box { text-align: center; margin-bottom: 16px; }
    .title { font-size: 26px; font-weight: 900; color: #1e293b; margin: 0; }
    .theme { font-size: 13px; font-weight: 600; color: #e11d48; margin-top: 2px; }
    
    .illustration-box {
      display: flex;
      justify-content: center;
      align-items: center;
      background: #fff1f2;
      border-radius: 16px;
      padding: 12px;
      margin-bottom: 16px;
    }
    
    .rhyme-box {
      background: #ffffff;
      border: 2px dashed #fda4af;
      border-radius: 16px;
      padding: 16px 20px;
      margin-bottom: 16px;
      text-align: center;
    }
    .rhyme-line {
      font-size: 15px;
      font-weight: 700;
      line-height: 1.7;
      color: #0f172a;
    }
    
    .vocab-bar {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
      background: #fdf2f8;
      border: 1px solid #fbcfe8;
      padding: 8px 12px;
      border-radius: 12px;
      margin-bottom: 14px;
      font-size: 11px;
    }
    .vocab-chip {
      background: white;
      border: 1px solid #f472b6;
      color: #9d174d;
      font-weight: 800;
      padding: 2px 8px;
      border-radius: 6px;
    }

    .guide-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-bottom: 14px;
    }
    .guide-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 10px 12px;
      font-size: 11px;
      line-height: 1.5;
    }
    .guide-card h4 {
      margin: 0 0 4px 0;
      font-size: 11px;
      font-weight: 800;
      color: #334155;
      text-transform: uppercase;
    }
    
    .footer {
      border-top: 1px solid #e2e8f0;
      padding-top: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 10px;
      color: #94a3b8;
      font-weight: bold;
    }
    @media print {
      body { background: white; padding: 0; }
      .sheet { box-shadow: none; width: 100%; border: none; }
    }
  </style>
</head>
<body>
  <div class="sheet">
    <div class="header-bar">
      <span class="badge">${rhyme.categoryName} • ${rhyme.ageGroup}</span>
      <span class="area-badge">Area: ${rhyme.learningArea}</span>
    </div>

    <div class="title-box">
      <h1 class="title">${rhyme.title}</h1>
      <div class="theme">${rhyme.theme}</div>
    </div>

    <div class="illustration-box">
      ${svgMarkup}
    </div>

    <div class="rhyme-box">
      ${rhyme.rhymeLines.map((line) => `<div class="rhyme-line">${line}</div>`).join('')}
    </div>

    <div class="vocab-bar">
      <strong style="color:#831843;">New Vocabulary:</strong>
      ${rhyme.vocabulary.map((w) => `<span class="vocab-chip">${w}</span>`).join('')}
    </div>

    <div class="guide-grid">
      <div class="guide-card">
        <h4>🎭 Teacher Actions & Gestures</h4>
        <ul style="margin:0;padding-left:14px;">
          ${rhyme.actions.map((a) => `<li><strong>${a.lineHint || 'Action'}:</strong> ${a.instruction}</li>`).join('')}
        </ul>
      </div>

      <div class="guide-card">
        <h4>💬 Discussion Questions</h4>
        <ul style="margin:0;padding-left:14px;">
          ${rhyme.discussionQuestions.map((q) => `<li>${q}</li>`).join('')}
        </ul>
      </div>
    </div>

    <div class="guide-card" style="margin-bottom:12px;background:#fefce8;border-color:#fef08a;">
      <h4 style="color:#854d0e;">🎨 Follow-up Classroom Activity: ${rhyme.classroomActivity.title}</h4>
      <p style="margin:0;color:#713f12;">${rhyme.classroomActivity.instruction}</p>
    </div>

    <div class="footer">
      <span>Preschool Educators Hub • Rhyme & Classroom Resources</span>
      <span>Learning Outcome: ${rhyme.learningOutcome}</span>
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Rhyme_${rhyme.title.replace(/[^a-zA-Z0-9]/g, '_')}_A4.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div id="educator-rhyme-resources-card" className="space-y-6">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER BANNER (NO AUDIO/PLAYER)                                   */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden print:hidden">
        <div className="absolute -right-12 -bottom-12 w-56 h-56 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider text-rose-100">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              Preschool Educator Ready-Made Library
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Rhyme & Classroom Resources
            </h1>
            <p className="text-sm sm:text-base text-rose-100/95 leading-relaxed font-medium">
              A comprehensive written & printable library of original preschool rhymes, fingerplays, teacher guides, circle-time discussion questions, and low-prep classroom follow-up activities.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-3 bg-white text-rose-700 hover:bg-rose-50 rounded-2xl font-bold text-sm shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Print Resource Sheet
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. SECTION TABS (RHYMES, TEACHER GUIDE, ACTIONS, QUESTIONS, ACTIVITIES)   */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-2 shadow-sm flex flex-wrap items-center gap-1.5 print:hidden">
        {[
          { id: 'rhymes' as SubTab, label: '🎵 Ready-Made Rhymes', desc: 'Full verses & cards' },
          { id: 'teacher_guide' as SubTab, label: '👩‍🏫 Teacher Guides', desc: 'Before / During / After' },
          { id: 'actions' as SubTab, label: '🎭 Rhyme Actions', desc: 'Gestures & fingerplays' },
          { id: 'questions' as SubTab, label: '💬 Discussion Questions', desc: 'Comprehension prompts' },
          { id: 'activities' as SubTab, label: '🎨 Rhyme Activities', desc: 'Classroom games' },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                soundManager.playPop();
                setActiveTab(tab.id);
              }}
              className={`flex-1 min-w-[150px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                isActive
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                  : 'bg-transparent hover:bg-slate-100 text-slate-700'
              }`}
            >
              <span className="font-black">{tab.label}</span>
              <span className={`text-[10px] ${isActive ? 'text-rose-100' : 'text-slate-400'}`}>
                {tab.desc}
              </span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 3. CATEGORY PILLS & SEARCH BAR                                            */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-sm space-y-4 print:hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search rhymes (e.g. apple, train, manners, bunny, rain)..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 bg-slate-200 px-1.5 py-0.5 rounded cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
            <span>Showing <strong className="text-slate-800">{filteredRhymes.length}</strong> resources</span>
            <span>•</span>
            <span>Written & Printable Guide</span>
          </div>
        </div>

        {/* Category horizontal scrolling bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-200">
          {RHYME_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  soundManager.playPop();
                  setSelectedCategory(cat.id);
                }}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 border cursor-pointer ${
                  isSelected
                    ? 'bg-rose-500 text-white border-rose-600 shadow-sm shadow-rose-500/30'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. MAIN CONTENT VIEWS BASED ON SELECTED TAB                               */}
      {/* ========================================================================= */}

      {/* ------------------------------------------------------------------------- */}
      {/* VIEW 1: READY-MADE RHYMES (CARDS GRID)                                    */}
      {/* ------------------------------------------------------------------------- */}
      {activeTab === 'rhymes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 print:hidden">
          {filteredRhymes.map((rhyme) => (
            <motion.div
              key={rhyme.id}
              data-rhyme-id={rhyme.id}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.15 }}
              className="bg-white rounded-3xl border-2 border-slate-200/90 hover:border-rose-300 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header tags */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-black uppercase tracking-wider text-rose-800 bg-rose-100 border border-rose-200 px-2.5 py-0.5 rounded-full truncate">
                    {rhyme.categoryName}
                  </span>
                  <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full whitespace-nowrap">
                    {rhyme.ageGroup}
                  </span>
                </div>

                {/* Title & 2D Vector Illustration */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0 p-1">
                    <Rhyme2DSvg type={rhyme.svgType} size={56} />
                  </div>
                  <div>
                    <h3 className="font-black text-base text-slate-900 leading-tight">
                      {rhyme.title}
                    </h3>
                    <p className="text-xs font-semibold text-rose-600 mt-0.5">
                      {rhyme.theme}
                    </p>
                  </div>
                </div>

                {/* Rhyme lines preview */}
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 mb-3 text-xs text-slate-800 leading-relaxed font-medium space-y-1">
                  {rhyme.rhymeLines.slice(0, 4).map((line, idx) => (
                    <div key={idx} className="truncate">
                      {line}
                    </div>
                  ))}
                  {rhyme.rhymeLines.length > 4 && (
                    <div className="text-[10px] text-slate-400 font-bold italic pt-1">
                      + {rhyme.rhymeLines.length - 4} more verses...
                    </div>
                  )}
                </div>

                {/* Learning Area & Vocabulary chips */}
                <div className="space-y-1.5 mb-3">
                  <div className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                    <strong className="text-slate-700">Area:</strong> {rhyme.learningArea}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {rhyme.vocabulary.slice(0, 3).map((w, idx) => (
                      <span
                        key={idx}
                        className="text-[9px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md"
                      >
                        {w}
                      </span>
                    ))}
                    {rhyme.vocabulary.length > 3 && (
                      <span className="text-[9px] font-bold text-slate-400">+{rhyme.vocabulary.length - 3}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playPop();
                    setSelectedRhymeId(rhyme.id);
                  }}
                  className="flex-1 py-2 px-3 bg-rose-50 hover:bg-rose-500 hover:text-white text-rose-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Details</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDownloadRhyme(rhyme)}
                  className="py-2 px-2.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  title="Download A4 Sheet"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{downloadSuccessId === rhyme.id ? '✓' : 'A4'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleCopy(`${rhyme.title}\n\n${rhyme.rhymeText}\n\nTeacher Actions:\n${rhyme.actions.map(a => `- ${a.instruction}`).join('\n')}`, `card-${rhyme.id}`)}
                  className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  title="Copy Rhyme Text"
                >
                  {copiedKey === `card-${rhyme.id}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ------------------------------------------------------------------------- */}
      {/* VIEW 2: TEACHER GUIDES (BEFORE / DURING / AFTER)                          */}
      {/* ------------------------------------------------------------------------- */}
      {activeTab === 'teacher_guide' && (
        <div className="space-y-4 print:hidden">
          {filteredRhymes.map((rhyme) => (
            <div
              key={rhyme.id}
              className="bg-white rounded-3xl border-2 border-slate-200/80 p-5 sm:p-6 shadow-sm space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
                    <Rhyme2DSvg type={rhyme.svgType} size={42} />
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-slate-900">{rhyme.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold mt-0.5">
                      <span>{rhyme.categoryName}</span>
                      <span>•</span>
                      <span>{rhyme.ageGroup}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    soundManager.playPop();
                    setSelectedRhymeId(rhyme.id);
                  }}
                  className="px-3.5 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded-xl text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Full Resource</span>
                </button>
              </div>

              {/* 3-Step Teacher Guide (Before, During, After) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 space-y-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md">
                    1. Before The Rhyme
                  </span>
                  <p className="text-xs text-amber-950 font-medium leading-relaxed">
                    {rhyme.teacherGuide.before}
                  </p>
                </div>

                <div className="bg-sky-50/70 border border-sky-200/80 rounded-2xl p-4 space-y-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-sky-900 bg-sky-100 px-2 py-0.5 rounded-md">
                    2. During The Rhyme
                  </span>
                  <p className="text-xs text-sky-950 font-medium leading-relaxed">
                    {rhyme.teacherGuide.during}
                  </p>
                </div>

                <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 space-y-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded-md">
                    3. After The Rhyme
                  </span>
                  <p className="text-xs text-emerald-950 font-medium leading-relaxed">
                    {rhyme.teacherGuide.after}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ------------------------------------------------------------------------- */}
      {/* VIEW 3: RHYME ACTIONS & GESTURES                                          */}
      {/* ------------------------------------------------------------------------- */}
      {activeTab === 'actions' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 print:hidden">
          {filteredRhymes.map((rhyme) => (
            <div
              key={rhyme.id}
              className="bg-white rounded-3xl border-2 border-slate-200/80 p-5 shadow-sm space-y-3.5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{rhyme.icon}</span>
                    <h3 className="font-black text-base text-slate-900">{rhyme.title}</h3>
                  </div>
                  <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">
                    {rhyme.ageGroup}
                  </span>
                </div>

                <div className="space-y-2 mt-3">
                  {rhyme.actions.map((act, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-50 border border-slate-200/70 rounded-xl p-3 text-xs flex items-start gap-2.5"
                    >
                      <span className="w-5 h-5 rounded-full bg-rose-500 text-white font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <div className="space-y-0.5">
                        {act.lineHint && (
                          <div className="font-bold text-rose-900 text-[11px]">
                            "{act.lineHint}"
                          </div>
                        )}
                        <div className="text-slate-700 font-medium leading-relaxed">
                          {act.instruction}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => {
                    soundManager.playPop();
                    setSelectedRhymeId(rhyme.id);
                  }}
                  className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Full Rhyme & Verse</span>
                </button>
                <button
                  onClick={() => handleCopy(rhyme.actions.map(a => `${a.lineHint ? `"${a.lineHint}": ` : ''}${a.instruction}`).join('\n'), `actions-${rhyme.id}`)}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                >
                  {copiedKey === `actions-${rhyme.id}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === `actions-${rhyme.id}` ? 'Copied' : 'Copy Actions'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ------------------------------------------------------------------------- */}
      {/* VIEW 4: DISCUSSION QUESTIONS                                              */}
      {/* ------------------------------------------------------------------------- */}
      {activeTab === 'questions' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 print:hidden">
          {filteredRhymes.map((rhyme) => (
            <div
              key={rhyme.id}
              className="bg-white rounded-3xl border-2 border-slate-200/80 p-5 shadow-sm space-y-3.5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center font-black text-sm">
                      💬
                    </div>
                    <div>
                      <h3 className="font-black text-base text-slate-900">{rhyme.title}</h3>
                      <p className="text-[11px] font-bold text-sky-700">{rhyme.theme}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                    {rhyme.ageGroup}
                  </span>
                </div>

                <div className="space-y-2 mt-3">
                  {rhyme.discussionQuestions.map((q, idx) => (
                    <div
                      key={idx}
                      className="bg-sky-50/60 border border-sky-200/70 rounded-xl p-3 text-xs text-sky-950 flex items-start gap-2.5 font-medium"
                    >
                      <HelpCircle className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                      <span>{q}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => {
                    soundManager.playPop();
                    setSelectedRhymeId(rhyme.id);
                  }}
                  className="text-xs font-bold text-sky-700 hover:text-sky-900 flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Open Rhyme</span>
                </button>
                <button
                  onClick={() => handleCopy(rhyme.discussionQuestions.join('\n'), `q-${rhyme.id}`)}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                >
                  {copiedKey === `q-${rhyme.id}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === `q-${rhyme.id}` ? 'Copied' : 'Copy Questions'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ------------------------------------------------------------------------- */}
      {/* VIEW 5: RHYME ACTIVITIES (LOW-PREP CLASSROOM GAMES)                       */}
      {/* ------------------------------------------------------------------------- */}
      {activeTab === 'activities' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 print:hidden">
          {filteredRhymes.map((rhyme) => (
            <div
              key={rhyme.id}
              className="bg-white rounded-3xl border-2 border-slate-200/80 p-5 shadow-sm space-y-3.5 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🎨</span>
                    <div>
                      <h4 className="font-black text-sm text-slate-900">{rhyme.classroomActivity.title}</h4>
                      <span className="text-[10px] font-bold text-rose-600">Connected to: {rhyme.title}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Ready-Made
                  </span>
                </div>

                <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-3.5 text-xs text-amber-950 leading-relaxed font-medium">
                  {rhyme.classroomActivity.instruction}
                </div>

                {rhyme.classroomActivity.materialsNeeded && (
                  <div className="text-[11px] font-bold text-slate-600 flex items-center gap-1.5 bg-slate-50 p-2 rounded-xl border border-slate-100">
                    <strong className="text-slate-800">Materials:</strong> {rhyme.classroomActivity.materialsNeeded}
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => {
                    soundManager.playPop();
                    setSelectedRhymeId(rhyme.id);
                  }}
                  className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Rhyme</span>
                </button>
                <button
                  onClick={() => handleCopy(`${rhyme.classroomActivity.title}\n\n${rhyme.classroomActivity.instruction}\n\nMaterials: ${rhyme.classroomActivity.materialsNeeded || 'None'}`, `act-${rhyme.id}`)}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                >
                  {copiedKey === `act-${rhyme.id}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === `act-${rhyme.id}` ? 'Copied' : 'Copy Activity'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. COMPLETE RHYME DETAIL MODAL (VIEW / DOWNLOAD / PRINT)                  */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {selectedRhyme && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm print:hidden">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border-4 border-rose-300 max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-6 scrollbar-thin scrollbar-thumb-rose-200"
            >
              <button
                onClick={() => {
                  soundManager.playPop();
                  setSelectedRhymeId(null);
                }}
                className="absolute top-5 right-5 p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Top Tags */}
              <div className="flex flex-wrap items-center gap-2 pr-10">
                <span className="text-xs font-black uppercase tracking-wider text-rose-800 bg-rose-100 px-3 py-1 rounded-full">
                  {selectedRhyme.categoryName}
                </span>
                <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
                  {selectedRhyme.ageGroup}
                </span>
                <span className="text-xs font-bold text-indigo-800 bg-indigo-100 px-3 py-1 rounded-full">
                  Area: {selectedRhyme.learningArea}
                </span>
              </div>

              {/* Title & 2D Vector Illustration */}
              <div className="flex flex-col sm:flex-row items-center gap-5 bg-rose-50/70 p-5 rounded-2xl border border-rose-100">
                <div id="modal-rhyme-svg" className="w-28 h-28 rounded-2xl bg-white border border-rose-200 flex items-center justify-center shrink-0 p-2 shadow-sm">
                  <Rhyme2DSvg type={selectedRhyme.svgType} size={90} />
                </div>
                <div className="space-y-1 text-center sm:text-left">
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900">{selectedRhyme.title}</h2>
                  <p className="text-sm font-bold text-rose-600">{selectedRhyme.theme}</p>
                  <p className="text-xs text-slate-500 font-medium">
                    Learning Outcome: {selectedRhyme.learningOutcome}
                  </p>
                </div>
              </div>

              {/* Written Rhyme Box (Large readable text) */}
              <div className="bg-white border-2 border-dashed border-rose-300 rounded-2xl p-6 text-center space-y-2 shadow-inner">
                <div className="text-[10px] font-black uppercase tracking-wider text-rose-400 mb-2">
                  📖 Written Rhyme (Teacher Recitation)
                </div>
                {selectedRhyme.rhymeLines.map((line, idx) => (
                  <div key={idx} className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                    {line}
                  </div>
                ))}
              </div>

              {/* Vocabulary / New Words */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2">
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-rose-600" />
                  <span>Vocabulary & Words to Learn:</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedRhyme.vocabulary.map((word, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-white border border-rose-200 text-rose-800 font-black text-xs rounded-xl shadow-xs"
                    >
                      {word}
                    </span>
                  ))}
                </div>
              </div>

              {/* Simple Actions (Written Instructions Only) */}
              <div className="bg-rose-50/50 rounded-2xl p-5 border border-rose-200/80 space-y-3">
                <div className="text-xs font-black uppercase tracking-wider text-rose-900 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-rose-700" />
                  <span>Teacher Rhyme Actions & Physical Cues</span>
                </div>
                <div className="space-y-2">
                  {selectedRhyme.actions.map((act, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-xl border border-rose-100 text-xs flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-rose-500 text-white font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <div>
                        {act.lineHint && (
                          <div className="font-bold text-rose-900 mb-0.5">
                            "{act.lineHint}"
                          </div>
                        )}
                        <div className="text-slate-700 font-medium leading-relaxed">
                          {act.instruction}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Teacher 3-Stage Guide */}
              <div className="space-y-3">
                <div className="text-xs font-black uppercase tracking-wider text-slate-700">
                  👩‍🏫 Structured Lesson Delivery Guide
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-200 text-xs space-y-1">
                    <strong className="text-amber-900 font-bold block">1. Before Rhyme:</strong>
                    <p className="text-amber-950 font-medium">{selectedRhyme.teacherGuide.before}</p>
                  </div>
                  <div className="bg-sky-50 p-3.5 rounded-xl border border-sky-200 text-xs space-y-1">
                    <strong className="text-sky-900 font-bold block">2. During Rhyme:</strong>
                    <p className="text-sky-950 font-medium">{selectedRhyme.teacherGuide.during}</p>
                  </div>
                  <div className="bg-emerald-50 p-3.5 rounded-xl border border-emerald-200 text-xs space-y-1">
                    <strong className="text-emerald-900 font-bold block">3. After Rhyme:</strong>
                    <p className="text-emerald-950 font-medium">{selectedRhyme.teacherGuide.after}</p>
                  </div>
                </div>
              </div>

              {/* Discussion Questions */}
              <div className="bg-sky-50 rounded-2xl p-5 border border-sky-200 space-y-2.5">
                <div className="text-xs font-black uppercase tracking-wider text-sky-900 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-sky-700" />
                  <span>Circle-Time Discussion Questions</span>
                </div>
                <ul className="list-disc pl-5 text-xs text-sky-950 space-y-1 font-medium">
                  {selectedRhyme.discussionQuestions.map((q, idx) => (
                    <li key={idx}>{q}</li>
                  ))}
                </ul>
              </div>

              {/* Classroom Activity */}
              <div className="bg-amber-50 rounded-2xl p-5 border border-amber-200 space-y-2">
                <div className="text-xs font-black uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                  <Palette className="w-4 h-4 text-amber-700" />
                  <span>Classroom Activity: {selectedRhyme.classroomActivity.title}</span>
                </div>
                <p className="text-xs text-amber-950 font-medium leading-relaxed">
                  {selectedRhyme.classroomActivity.instruction}
                </p>
                {selectedRhyme.classroomActivity.materialsNeeded && (
                  <div className="text-[11px] font-bold text-amber-800 pt-1">
                    Materials needed: {selectedRhyme.classroomActivity.materialsNeeded}
                  </div>
                )}
              </div>

              {/* Action Buttons: Download A4 / Print / Copy */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(`${selectedRhyme.title}\n\n${selectedRhyme.rhymeText}\n\nVocabulary:\n${selectedRhyme.vocabulary.join(', ')}\n\nActions:\n${selectedRhyme.actions.map(a => `- ${a.instruction}`).join('\n')}`, 'modal-copy')}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedKey === 'modal-copy' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'modal-copy' ? 'Copied' : 'Copy All'}</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDownloadRhyme(selectedRhyme)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{downloadSuccessId === selectedRhyme.id ? '✓ Downloaded!' : 'Download A4 Sheet'}</span>
                  </button>

                  <button
                    onClick={handlePrint}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Card</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 6. DEDICATED PRINT SHEET (HIDDEN ON SCREEN, VISIBLE ON PRINT)             */}
      {/* ========================================================================= */}
      <div className="hidden print:block space-y-6">
        <div className="text-center pb-4 border-b-2 border-black">
          <h1 className="text-2xl font-bold uppercase tracking-wide">
            Preschool Rhymes & Classroom Resources Library
          </h1>
          <p className="text-xs text-gray-600 mt-1">
            Written rhymes, teacher lesson delivery guides, physical actions, discussion prompts & classroom activities.
          </p>
        </div>

        <div className="space-y-6">
          {filteredRhymes.map((rhyme) => (
            <div key={rhyme.id} className="border-2 border-gray-400 rounded-2xl p-6 space-y-4 break-inside-avoid">
              <div className="flex justify-between items-center border-b pb-2">
                <div>
                  <h2 className="text-xl font-black">{rhyme.title}</h2>
                  <div className="text-xs text-gray-600">{rhyme.theme} • {rhyme.ageGroup} • {rhyme.learningArea}</div>
                </div>
                <div className="p-1">
                  <Rhyme2DSvg type={rhyme.svgType} size={60} />
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-300 rounded-xl p-4 text-center font-bold text-sm leading-relaxed">
                {rhyme.rhymeLines.map((l, i) => (
                  <div key={i}>{l}</div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="border p-2.5 rounded-lg">
                  <strong className="block mb-1">Teacher Actions:</strong>
                  {rhyme.actions.map((a, i) => (
                    <div key={i} className="mb-0.5">• {a.instruction}</div>
                  ))}
                </div>

                <div className="border p-2.5 rounded-lg">
                  <strong className="block mb-1">Discussion Questions:</strong>
                  {rhyme.discussionQuestions.map((q, i) => (
                    <div key={i} className="mb-0.5">? {q}</div>
                  ))}
                </div>
              </div>

              <div className="text-xs border-t pt-2 text-gray-700">
                <strong>Activity:</strong> {rhyme.classroomActivity.title} — {rhyme.classroomActivity.instruction}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
