import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Lightbulb,
  Search,
  ArrowLeft,
  Copy,
  Check,
  Printer,
  Sparkles,
  Bookmark,
  BookmarkCheck,
  ChevronRight,
  Filter,
  Layers,
  Star,
  Compass,
  CheckCircle2,
  X,
  Share2,
  BookOpen,
} from 'lucide-react';
import { soundManager } from '../../utils/audio';
import {
  TIP_CATEGORIES,
  TEACHING_TIPS_DATA,
  QUICK_TEACHING_TIPS,
  LEARNING_AREA_TIPS,
  TipCategory,
  TeachingTip,
} from '../../data/teachingTipsData';

interface TeachingTipsToolProps {
  onBackToOverview: () => void;
}

export const TeachingTipsTool: React.FC<TeachingTipsToolProps> = ({ onBackToOverview }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedTipId, setCopiedTipId] = useState<string | null>(null);
  const [savedTipIds, setSavedTipIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('saved_teaching_tips');
      return saved ? JSON.parse(saved) : ['cm-01', 'pb-01', 'em-01'];
    } catch {
      return ['cm-01', 'pb-01', 'em-01'];
    }
  });
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [showQuickTipsModal, setShowQuickTipsModal] = useState(false);

  // Toggle Save Favorite Tip
  const toggleSaveTip = (tipId: string) => {
    soundManager.playPop();
    setSavedTipIds((prev) => {
      const next = prev.includes(tipId) ? prev.filter((id) => id !== tipId) : [...prev, tipId];
      try {
        localStorage.setItem('saved_teaching_tips', JSON.stringify(next));
      } catch (err) {
        console.error(err);
      }
      return next;
    });
  };

  // Copy Tip to Clipboard
  const handleCopyTip = (tip: TeachingTip) => {
    soundManager.playPop();
    const textToCopy = `💡 ${tip.title}\n\n• TIP: ${tip.tip}\n• TRY THIS: ${tip.tryThis}\n• WHY IT HELPS: ${tip.whyItHelps}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedTipId(tip.id);
    setTimeout(() => setCopiedTipId(null), 2200);
  };

  // Filtered Tips Logic
  const filteredTips = useMemo(() => {
    let list = TEACHING_TIPS_DATA;

    // Filter by Saved
    if (showSavedOnly) {
      list = list.filter((t) => savedTipIds.includes(t.id));
    }

    // Filter by Category if selected and not searching
    if (selectedCategory && !searchQuery) {
      list = list.filter((t) => t.categoryId === selectedCategory);
    }

    // Filter by Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.tip.toLowerCase().includes(q) ||
          t.tryThis.toLowerCase().includes(q) ||
          t.whyItHelps.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    return list;
  }, [selectedCategory, searchQuery, showSavedOnly, savedTipIds]);

  const activeCategoryObj = useMemo(() => {
    return TIP_CATEGORIES.find((c) => c.id === selectedCategory) || null;
  }, [selectedCategory]);

  // Print Handout View
  const handlePrintTips = () => {
    soundManager.playPop();
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const tipsToPrint = filteredTips;
    const catName = activeCategoryObj ? activeCategoryObj.name : 'Preschool Teaching Strategies';

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Preschool Teaching Tips - ${catName}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 25px; color: #0f172a; line-height: 1.5; }
          .header { border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 20px; }
          .title { font-size: 22px; font-weight: 900; text-transform: uppercase; margin: 0; }
          .subtitle { font-size: 12px; color: #64748b; font-weight: bold; margin-top: 4px; }
          .tip-card { border: 1.5px solid #cbd5e1; border-radius: 10px; padding: 14px; margin-bottom: 14px; page-break-inside: avoid; }
          .tip-title { font-size: 15px; font-weight: 900; color: #0f172a; margin-bottom: 6px; }
          .tip-label { font-size: 10px; font-weight: 900; text-transform: uppercase; color: #64748b; }
          .tip-text { font-size: 13px; font-weight: 600; margin-bottom: 8px; }
          .try-box { background: #f8fafc; border-left: 3px solid #0284c7; padding: 8px 12px; font-size: 12px; margin-bottom: 6px; }
          .why-box { font-size: 11px; color: #475569; font-style: italic; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 class="title">💡 ${catName}</h1>
          <div class="subtitle">Preschool Educator Guide • ${tipsToPrint.length} Practical Strategies</div>
        </div>
        ${tipsToPrint
          .map(
            (t) => `
          <div class="tip-card">
            <div class="tip-title">${t.title}</div>
            <div class="tip-text"><strong>Tip:</strong> ${t.tip}</div>
            <div class="try-box"><strong>Try This in Class:</strong> ${t.tryThis}</div>
            <div class="why-box"><strong>Why it helps:</strong> ${t.whyItHelps}</div>
          </div>
        `
          )
          .join('')}
        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <section id="educator-teaching-tips-card" className="bg-white border-4 border-amber-300 rounded-3xl p-5 sm:p-8 shadow-xl mb-8">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-amber-100 pb-5 mb-6">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 bg-amber-100 border-2 border-amber-300 rounded-2xl flex items-center justify-center text-3xl shadow-xs shrink-0">
            💡
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 bg-amber-100 border border-amber-200 px-2.5 py-0.5 rounded-full">
                Tool 5 of 7
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                12 Categories • 50+ Practical Tips
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight">
              Preschool Teaching Tips & Strategies
            </h2>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Print Current Tips */}
          <button
            type="button"
            onClick={handlePrintTips}
            className="flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-800 text-xs font-black px-3.5 py-2 rounded-xl transition-all cursor-pointer border-2 border-slate-300 shadow-2xs"
            title="Print tips sheet"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span>Print Tips</span>
          </button>

          {/* Quick Tips Popout */}
          <button
            type="button"
            onClick={() => {
              soundManager.playPop();
              setShowQuickTipsModal(true);
            }}
            className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black px-3.5 py-2 rounded-xl transition-all cursor-pointer shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Quick 1-Liners</span>
          </button>

          {/* Back to Hub */}
          <button
            type="button"
            onClick={() => {
              soundManager.playPop();
              onBackToOverview();
            }}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black px-3.5 py-2 rounded-xl transition-colors cursor-pointer border border-slate-300 shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Hub</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-slate-50/80 border-2 border-slate-200 rounded-2xl p-4 mb-6 space-y-3">
        <div className="flex flex-col sm:flex-row gap-2.5 items-stretch">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tips (e.g. behavior, phonics, counting, transitions, shy, sharing, fine motor, routine)..."
              className="w-full bg-white border-2 border-slate-300 focus:border-amber-500 rounded-xl pl-9 pr-8 py-2.5 text-xs sm:text-sm font-bold text-slate-900 focus:ring-2 focus:ring-amber-200 focus:outline-hidden transition-all placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Saved / Favorites Toggle */}
          <button
            type="button"
            onClick={() => {
              soundManager.playPop();
              setShowSavedOnly((prev) => !prev);
            }}
            className={`flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wide cursor-pointer transition-all border-2 shrink-0 ${
              showSavedOnly
                ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${showSavedOnly ? 'fill-current' : ''}`} />
            <span>Saved ({savedTipIds.length})</span>
          </button>
        </div>

        {/* Quick Search Keyword Chips */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1">
          <span className="text-[10px] font-black uppercase text-slate-500 mr-1">Suggested:</span>
          {['Instructions', 'Positive Praise', 'Phonics Sound', 'One-to-One Count', 'Transitions', 'Shy Children', 'Turn Taking', 'Pencil Grip'].map((keyword) => (
            <button
              key={keyword}
              type="button"
              onClick={() => {
                soundManager.playPop();
                setSearchQuery(keyword);
              }}
              className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                searchQuery.toLowerCase() === keyword.toLowerCase()
                  ? 'bg-amber-100 text-amber-900 border-amber-300 font-black'
                  : 'bg-white hover:bg-slate-100 text-slate-600 border-slate-200'
              }`}
            >
              #{keyword}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. CATEGORY SELECTION CARDS (When no category is open & no search)        */}
      {/* ========================================================================= */}
      {!selectedCategory && !searchQuery && !showSavedOnly && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-600 flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-500" />
              <span>Select a Teaching Category (12 Areas)</span>
            </h3>
            <span className="text-xs font-bold text-slate-500">
              Click any card to view actionable strategies
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TIP_CATEGORIES.map((cat) => {
              const tipCount = TEACHING_TIPS_DATA.filter((t) => t.categoryId === cat.id).length;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    soundManager.playPop();
                    setSelectedCategory(cat.id);
                  }}
                  className={`group relative text-left bg-gradient-to-b ${cat.bgGradient} border-2 ${cat.borderColor} rounded-2xl p-4 sm:p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-md cursor-pointer flex flex-col justify-between`}
                >
                  <div>
                    {/* Top Row: Icon & Badge */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-12 h-12 rounded-xl bg-white border-2 border-slate-200/80 flex items-center justify-center text-2xl shadow-2xs group-hover:scale-105 transition-transform">
                        {cat.icon}
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${cat.color}`}>
                        {cat.badge}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <h4 className="text-base font-black text-slate-900 uppercase tracking-tight mb-1.5 group-hover:text-amber-700 transition-colors">
                      {cat.name}
                    </h4>
                    <p className="text-xs font-bold text-slate-600 leading-relaxed mb-4 line-clamp-2">
                      {cat.description}
                    </p>
                  </div>

                  {/* Bottom Action Footer */}
                  <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-black text-slate-700">
                    <span className="text-slate-500 font-bold">{tipCount} Practical Tips</span>
                    <span className="flex items-center gap-0.5 text-amber-700 group-hover:translate-x-1 transition-transform">
                      <span>View Tips</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Activity-Specific Tips Strip Linked to Learning Areas */}
          <div className="bg-amber-50/60 border-2 border-amber-200 rounded-2xl p-5 space-y-3 mt-6">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase tracking-wider text-amber-950 flex items-center gap-2">
                <span>🎯 Quick Activity Tips (By Learning Area)</span>
              </h4>
              <span className="text-[11px] font-bold text-amber-800">
                Direct classroom prompts
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {LEARNING_AREA_TIPS.map((lat, i) => (
                <div key={i} className="bg-white border border-amber-200 rounded-xl p-3 shadow-2xs space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{lat.emoji}</span>
                    <span className="text-xs font-black text-slate-900 uppercase">{lat.area}</span>
                  </div>
                  <p className="text-[11px] font-bold text-slate-700">{lat.tip}</p>
                  <div className="text-[10px] font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60 mt-1">
                    ⚡ {lat.quickAction}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. TIPS LIST VIEW (When a category is active OR when search is active)    */}
      {/* ========================================================================= */}
      {(selectedCategory || searchQuery || showSavedOnly) && (
        <div className="space-y-5">
          {/* Navigation Bar / Breadcrumb */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 border-2 border-slate-200 rounded-2xl p-3.5">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => {
                  soundManager.playPop();
                  setSelectedCategory(null);
                  setSearchQuery('');
                  setShowSavedOnly(false);
                }}
                className="text-xs font-black text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer hover:underline"
              >
                <span>All 12 Categories</span>
              </button>

              {activeCategoryObj && !searchQuery && (
                <>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs font-black text-amber-700 uppercase bg-amber-100 border border-amber-200 px-2.5 py-0.5 rounded-lg flex items-center gap-1.5">
                    <span>{activeCategoryObj.icon}</span>
                    <span>{activeCategoryObj.name}</span>
                  </span>
                </>
              )}

              {searchQuery && (
                <>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs font-black text-slate-800 bg-white border border-slate-300 px-2.5 py-0.5 rounded-lg">
                    Search: "{searchQuery}"
                  </span>
                </>
              )}

              {showSavedOnly && (
                <>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs font-black text-amber-800 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-lg">
                    Saved Tips
                  </span>
                </>
              )}
            </div>

            <div className="text-xs font-black text-slate-600">
              Showing {filteredTips.length} {filteredTips.length === 1 ? 'Tip' : 'Tips'}
            </div>
          </div>

          {/* Category Quick Horizontal Scroller when in Category View */}
          {!searchQuery && !showSavedOnly && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {TIP_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    soundManager.playPop();
                    setSelectedCategory(cat.id);
                  }}
                  className={`text-xs font-black uppercase px-3 py-1.5 rounded-xl border transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                    selectedCategory === cat.id
                      ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-xs'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
          )}

          {/* Tips Grid */}
          {filteredTips.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTips.map((tip) => {
                const categoryObj = TIP_CATEGORIES.find((c) => c.id === tip.categoryId);
                const isSaved = savedTipIds.includes(tip.id);
                const isCopied = copiedTipId === tip.id;

                return (
                  <div
                    key={tip.id}
                    className={`bg-white border-2 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between transition-all hover:shadow-md ${
                      tip.highlight ? 'border-amber-300 bg-amber-50/20' : 'border-slate-300'
                    }`}
                  >
                    <div>
                      {/* Tip Card Header */}
                      <div className="flex items-start justify-between gap-3 mb-2.5">
                        <div>
                          {categoryObj && (
                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">
                              {categoryObj.icon} {categoryObj.name}
                            </span>
                          )}
                          <h4 className="text-base font-black text-slate-900 tracking-tight">
                            {tip.title}
                          </h4>
                        </div>

                        {/* Top Actions: Copy & Bookmark */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleCopyTip(tip)}
                            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
                            title="Copy tip to clipboard"
                          >
                            {isCopied ? (
                              <Check className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => toggleSaveTip(tip.id)}
                            className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
                              isSaved
                                ? 'text-amber-600 bg-amber-50 hover:bg-amber-100'
                                : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'
                            }`}
                            title={isSaved ? 'Remove from saved' : 'Save tip'}
                          >
                            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                          </button>
                        </div>
                      </div>

                      {/* 1. Core Tip Statement */}
                      <div className="text-xs sm:text-sm font-bold text-slate-800 mb-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                        <span className="font-black text-amber-700 uppercase mr-1">Tip:</span>
                        {tip.tip}
                      </div>

                      {/* 2. "Try This" Practical Classroom Action */}
                      <div className="bg-sky-50/70 border-l-4 border-sky-500 p-3 rounded-r-xl mb-3">
                        <span className="text-[10px] font-black uppercase text-sky-950 block mb-0.5">
                          👉 Try This in Class:
                        </span>
                        <p className="text-xs font-bold text-sky-900 leading-relaxed">
                          {tip.tryThis}
                        </p>
                      </div>

                      {/* 3. "Why It Helps" Sentence */}
                      <div className="text-xs font-bold text-slate-600 italic bg-amber-50/50 p-2.5 rounded-xl border border-amber-100 mb-3">
                        <span className="font-black text-amber-800 not-italic mr-1">Why it helps:</span>
                        {tip.whyItHelps}
                      </div>
                    </div>

                    {/* Footer Tags */}
                    <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
                      {tip.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 space-y-2">
              <Compass className="w-8 h-8 text-slate-400 mx-auto" />
              <h4 className="text-sm font-black text-slate-800 uppercase">No Teaching Tips Found</h4>
              <p className="text-xs font-bold text-slate-500 max-w-sm mx-auto">
                No tips matched "{searchQuery}". Try a different keyword like "instructions", "counting", "behavior", or clear the search.
              </p>
              <button
                type="button"
                onClick={() => {
                  soundManager.playPop();
                  setSearchQuery('');
                  setShowSavedOnly(false);
                  setSelectedCategory(null);
                }}
                className="mt-2 text-xs font-black uppercase text-amber-700 bg-white border border-amber-300 px-3.5 py-1.5 rounded-xl hover:bg-amber-50 cursor-pointer shadow-2xs"
              >
                Reset Filters & View All
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. QUICK 1-LINERS MODAL / OVERLAY                                         */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showQuickTipsModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border-4 border-amber-300 rounded-3xl p-6 max-w-xl w-full shadow-2xl space-y-4 max-h-[85vh] flex flex-col"
            >
              <div className="flex items-center justify-between border-b-2 border-amber-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-amber-100 border border-amber-300 rounded-xl flex items-center justify-center text-xl">
                    ⚡
                  </div>
                  <div>
                    <h3 className="text-base font-black uppercase text-slate-900">
                      Quick Teaching 1-Liners
                    </h3>
                    <p className="text-[11px] font-bold text-slate-500">
                      High-impact preschool strategies you can use immediately
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playPop();
                    setShowQuickTipsModal(false);
                  }}
                  className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                {QUICK_TEACHING_TIPS.map((qt, i) => (
                  <div
                    key={qt.id}
                    className="flex items-start gap-3 bg-slate-50 border border-slate-200 p-3 rounded-xl hover:border-amber-300 transition-colors"
                  >
                    <span className="w-7 h-7 bg-white border border-slate-300 rounded-lg flex items-center justify-center text-sm font-black text-amber-700 shrink-0 shadow-2xs">
                      {i + 1}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-md">
                          {qt.category}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-800 leading-snug">{qt.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playPop();
                    setShowQuickTipsModal(false);
                  }}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs uppercase px-4 py-2 rounded-xl cursor-pointer transition-colors shadow-2xs"
                >
                  Got It!
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
