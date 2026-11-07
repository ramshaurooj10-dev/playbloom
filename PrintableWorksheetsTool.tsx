import React, { useState } from 'react';
import {
  Printer,
  Download,
  Eye,
  Search,
  ArrowLeft,
  X,
  FileCheck,
} from 'lucide-react';
import { soundManager } from '../../utils/audio';
import {
  READY_MADE_50_WORKSHEETS,
  WorksheetData,
} from '../../data/printableWorksheets50';
import {
  SvgAppleOutline,
  SvgSunOutline,
  SvgLeafOutline,
  SvgWaveOutline,
  SvgBallOutline,
  SvgButterflyOutline,
  SvgRainbowOutline,
  SvgFaceOutline,
  SvgPuppyMaze,
  SvgDotToDotStar,
} from './WorksheetSvgAssets';
import {
  SvgDottedLetterA,
  SvgDottedLetterB,
  SvgDottedLetterC,
  SvgDottedLetterD,
  SvgDottedLetterE,
  SvgDottedNumber,
  SvgDottedShapesSheet,
  SvgDottedStraightTrack,
  SvgDottedWavyTrack,
  SvgDottedZigzagTrack,
} from './WorksheetTracingSvg';

interface PrintableWorksheetsToolProps {
  onBackToOverview: () => void;
}

export const PrintableWorksheetsTool: React.FC<PrintableWorksheetsToolProps> = ({
  onBackToOverview,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedLearningArea, setSelectedLearningArea] = useState<string>('All');
  const [selectedAge, setSelectedAge] = useState<string>('All');
  const [previewWorksheet, setPreviewWorksheet] = useState<WorksheetData | null>(null);
  const [downloadSuccessId, setDownloadSuccessId] = useState<string | null>(null);

  // Categories list
  const categories: { label: string; value: string; icon: string }[] = [
    { label: 'All 50 Worksheets', value: 'All', icon: '📚' },
    { label: 'ABC & Letters', value: 'ABC & Letters', icon: '🔤' },
    { label: 'Numbers & Counting', value: 'Numbers & Counting', icon: '🔢' },
    { label: 'Shapes', value: 'Shapes', icon: '🔺' },
    { label: 'Colors', value: 'Colors', icon: '🎨' },
    { label: 'Matching & Logic', value: 'Matching', icon: '🧩' },
    { label: 'Animals', value: 'Animals', icon: '🐶' },
    { label: 'Toys & Objects', value: 'Toys & Objects', icon: '🧸' },
    { label: 'Tracing & Motor', value: 'Tracing & Fine Motor', icon: '✏️' },
    { label: 'Creative & Coloring', value: 'Creative & Coloring', icon: '🖍️' },
  ];

  // Filter logic
  const filteredWorksheets = READY_MADE_50_WORKSHEETS.filter((ws) => {
    const matchesSearch =
      !searchQuery.trim() ||
      ws.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ws.instruction.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ws.learningArea.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ws.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `worksheet ${ws.worksheetNumber}`.includes(searchQuery.toLowerCase()) ||
      `#${ws.worksheetNumber}`.includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || ws.category === selectedCategory;
    const matchesLearningArea = selectedLearningArea === 'All' || ws.learningArea === selectedLearningArea;
    const matchesAge = selectedAge === 'All' || ws.ageGroup.includes(selectedAge);

    return matchesSearch && matchesCategory && matchesLearningArea && matchesAge;
  });

  // Direct Print Handler
  const handlePrintWorksheet = (ws: WorksheetData) => {
    soundManager.playPop();
    setPreviewWorksheet(ws);
    setTimeout(() => {
      window.print();
    }, 250);
  };

  // Standalone Download Handler
  const handleDownloadWorksheet = (ws: WorksheetData) => {
    soundManager.playPop();
    setDownloadSuccessId(ws.id);
    setTimeout(() => setDownloadSuccessId(null), 2500);

    const htmlContent = generateA4WorksheetHtml(ws);
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Worksheet_${ws.worksheetNumber.toString().padStart(2, '0')}_${ws.title.replace(/[^a-zA-Z0-9]/g, '_')}_A4.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <section id="educator-worksheets-card" className="space-y-6">
      {/* ========================================================================= */}
      {/* 1. HEADER BANNER                                                          */}
      {/* ========================================================================= */}
      <div className="bg-white border-4 border-pink-300 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-pink-100 pb-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-pink-100 border-3 border-pink-300 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl shadow-inner shrink-0">
              📄
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-pink-800 bg-pink-100 border border-pink-200 px-3 py-0.5 rounded-full">
                  Educator Hub Library
                </span>
                <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <FileCheck className="w-3 h-3" /> 50 Real Actionable Worksheets
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-tight">
                Printable A4 Preschool Worksheets
              </h2>
              <p className="text-xs sm:text-sm font-bold text-slate-600 mt-0.5">
                Ready to print and give to children: empty outlines for coloring, dotted paths for tracing, and open activities for kids to complete.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              soundManager.playPop();
              onBackToOverview();
            }}
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black px-4 py-2.5 rounded-2xl transition-colors cursor-pointer border border-slate-300 shadow-xs shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Hub Cards</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* 2. SEARCH & FILTER CONTROLS                                               */}
        {/* ========================================================================= */}
        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="md:col-span-6 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, number, or skill (e.g. 'Letter A', 'Count 1 to 5', 'Shapes', '12')..."
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm font-bold text-slate-900 focus:bg-white focus:border-pink-500 focus:outline-hidden transition-all shadow-xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Learning Area Filter */}
            <div className="md:col-span-3">
              <select
                value={selectedLearningArea}
                onChange={(e) => {
                  soundManager.playPop();
                  setSelectedLearningArea(e.target.value);
                }}
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs font-black text-slate-800 focus:bg-white focus:border-pink-500 focus:outline-hidden transition-all cursor-pointer shadow-xs"
              >
                <option value="All">All Learning Areas</option>
                <option value="Early Literacy">Early Literacy</option>
                <option value="Early Math">Early Math</option>
                <option value="Colors, Shapes & Visual Skills">Colors, Shapes & Visual</option>
                <option value="Logic & Classification">Logic & Classification</option>
                <option value="Focus & Observation">Focus & Observation</option>
                <option value="Thinking & Problem Solving">Problem Solving</option>
                <option value="Everyday Knowledge">Everyday Knowledge</option>
                <option value="Fine Motor Practice">Fine Motor Practice</option>
              </select>
            </div>

            {/* Age Filter */}
            <div className="md:col-span-3">
              <select
                value={selectedAge}
                onChange={(e) => {
                  soundManager.playPop();
                  setSelectedAge(e.target.value);
                }}
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs font-black text-slate-800 focus:bg-white focus:border-pink-500 focus:outline-hidden transition-all cursor-pointer shadow-xs"
              >
                <option value="All">All Preschool Ages (3–6 yrs)</option>
                <option value="2–4">Ages 2–4 (Toddler / Early)</option>
                <option value="3–5">Ages 3–5 (Preschool Core)</option>
                <option value="4–6">Ages 4–6 (Pre-K & Kindergarten)</option>
              </select>
            </div>
          </div>

          {/* Category Chips Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => {
                    soundManager.playPop();
                    setSelectedCategory(cat.value);
                  }}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all cursor-pointer shadow-2xs border ${
                    isSelected
                      ? 'bg-pink-600 text-white border-pink-700 shadow-md scale-[1.02]'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Counter & Features Summary */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-100 text-xs font-bold text-slate-600">
          <div className="flex items-center gap-2">
            <span className="font-black text-pink-700 bg-pink-50 px-2.5 py-0.5 rounded-lg border border-pink-200">
              Showing {filteredWorksheets.length} of {READY_MADE_50_WORKSHEETS.length} Worksheets
            </span>
            {selectedCategory !== 'All' && <span>• Category: {selectedCategory}</span>}
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-500 font-black">
            <span className="flex items-center gap-1">
              <span className="text-emerald-600">✍️</span> Uncompleted Tracing Dots
            </span>
            <span className="flex items-center gap-1">
              <span className="text-pink-600">🎨</span> Empty Line-Art for Coloring
            </span>
            <span className="flex items-center gap-1">
              <span className="text-indigo-600">🎯</span> Child Action Ready
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. WORKSHEETS GRID (50 CARDS)                                             */}
      {/* ========================================================================= */}
      {filteredWorksheets.length === 0 ? (
        <div className="bg-white border-4 border-dashed border-slate-300 rounded-3xl p-12 text-center">
          <div className="text-5xl mb-3">🔍</div>
          <h3 className="text-lg font-black uppercase text-slate-800 mb-1">No Worksheets Found</h3>
          <p className="text-xs font-bold text-slate-500 mb-4">
            Try adjusting your search keywords or clearing the category filters.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setSelectedLearningArea('All');
              setSelectedAge('All');
            }}
            className="bg-pink-600 hover:bg-pink-700 text-white text-xs font-black px-4 py-2 rounded-xl shadow-md cursor-pointer transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredWorksheets.map((ws) => (
            <div
              key={`${ws.id}-${ws.worksheetNumber}`}
              className="bg-white border-3 border-slate-200 hover:border-pink-400 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              {/* Top Meta */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                    #{ws.worksheetNumber.toString().padStart(2, '0')}
                  </span>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-pink-50 text-pink-700 border border-pink-200">
                    {ws.ageGroup}
                  </span>
                </div>

                {/* Card Title & Icon */}
                <div className="flex items-start gap-2.5 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform">
                    {ws.badgeEmoji}
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 leading-snug group-hover:text-pink-600 transition-colors">
                      {ws.title}
                    </h3>
                    <span className="text-[10px] font-bold text-slate-500 block mt-0.5">
                      {ws.learningArea}
                    </span>
                  </div>
                </div>

                {/* Action Instruction */}
                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 mb-3 text-[11px] font-bold text-slate-700 leading-tight">
                  <span className="text-[10px] font-black uppercase text-pink-700 block mb-0.5">
                    Child Action:
                  </span>
                  {ws.instruction}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playPop();
                    setPreviewWorksheet(ws);
                  }}
                  className="flex-1 flex items-center justify-center gap-1 bg-slate-100 hover:bg-pink-50 hover:text-pink-700 text-slate-800 text-xs font-black py-2 rounded-xl border border-slate-200 transition-colors cursor-pointer"
                  title="View full A4 worksheet preview"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View</span>
                </button>

                <button
                  type="button"
                  onClick={() => handlePrintWorksheet(ws)}
                  className="flex-1 flex items-center justify-center gap-1 bg-pink-600 hover:bg-pink-700 text-white text-xs font-black py-2 rounded-xl shadow-xs transition-colors cursor-pointer"
                  title="Print this worksheet on A4 paper"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDownloadWorksheet(ws)}
                  className={`p-2 rounded-xl border text-xs font-black transition-colors cursor-pointer ${
                    downloadSuccessId === ws.id
                      ? 'bg-emerald-500 text-white border-emerald-600'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                  }`}
                  title="Download standalone A4 HTML file"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. A4 FULL PREVIEW & PRINT MODAL                                          */}
      {/* ========================================================================= */}
      {previewWorksheet && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border-4 border-pink-300 overflow-hidden my-auto">
            {/* Modal Controls Top Bar (Hidden on Print) */}
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between gap-4 border-b border-slate-800 no-print">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-pink-600 flex items-center justify-center text-xl">
                  {previewWorksheet.badgeEmoji}
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-pink-400">
                    Worksheet #{previewWorksheet.worksheetNumber.toString().padStart(2, '0')} • A4 Portrait
                  </span>
                  <h3 className="text-base font-black uppercase text-white truncate max-w-[280px] sm:max-w-md">
                    {previewWorksheet.title}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDownloadWorksheet(previewWorksheet)}
                  className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-black px-3.5 py-2 rounded-xl transition-colors cursor-pointer border border-slate-700"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Download</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundManager.playPop();
                    window.print();
                  }}
                  className="flex items-center gap-1.5 bg-pink-600 hover:bg-pink-700 text-white text-xs font-black px-4 py-2 rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print A4</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundManager.playPop();
                    setPreviewWorksheet(null);
                  }}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Close Preview"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* A4 Document Printable Canvas Container */}
            <div className="p-4 sm:p-8 overflow-y-auto bg-slate-100 flex justify-center">
              <div
                id="a4-printable-page"
                className="bg-white border-2 border-slate-300 shadow-md rounded-2xl w-full max-w-[210mm] min-h-[280mm] p-6 sm:p-8 flex flex-col justify-between text-slate-900 font-sans"
              >
                {/* 1. Header with Student Info */}
                <div>
                  {/* Category & Grade Meta */}
                  <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2 mb-3 text-[11px] font-black uppercase text-slate-600">
                    <span>
                      Preschool Worksheet #{previewWorksheet.worksheetNumber} • {previewWorksheet.category}
                    </span>
                    <span>
                      {previewWorksheet.learningArea} • {previewWorksheet.ageGroup}
                    </span>
                  </div>

                  {/* Worksheet Big Title */}
                  <div className="text-center mb-3">
                    <h1 className="text-2xl sm:text-3xl font-black uppercase text-slate-900 tracking-tight">
                      {previewWorksheet.title}
                    </h1>
                  </div>

                  {/* Student Name & Date Lines */}
                  <div className="grid grid-cols-3 gap-3 border-2 border-slate-300 rounded-xl p-2.5 mb-4 text-xs font-black text-slate-700 bg-slate-50/50">
                    <div>
                      Name: <span className="inline-block w-28 border-b-2 border-slate-400"></span>
                    </div>
                    <div>
                      Date: <span className="inline-block w-20 border-b-2 border-slate-400"></span>
                    </div>
                    <div>
                      Class: <span className="inline-block w-16 border-b-2 border-slate-400"></span>
                    </div>
                  </div>

                  {/* Short Clean Instruction Box */}
                  <div className="bg-pink-50 border-2 border-pink-300 rounded-xl p-3 mb-6 text-xs sm:text-sm font-black text-pink-950 flex items-center gap-2">
                    <span className="text-lg">👉</span>
                    <span>
                      <strong>Instruction:</strong> {previewWorksheet.instruction}
                    </span>
                  </div>
                </div>

                {/* 2. Main Activity Body */}
                <div className="flex-1 flex flex-col justify-center py-2">
                  {renderA4WorksheetActivity(previewWorksheet)}
                </div>

                {/* 3. Footer with Star Sticker Box and Bonus Prompt */}
                <div className="mt-6 pt-3 border-t-2 border-slate-200">
                  {previewWorksheet.bonusPrompt && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-2 mb-2 text-xs font-bold text-amber-900 flex items-center justify-between">
                      <span>
                        🌟 <strong>Bonus Activity:</strong> {previewWorksheet.bonusPrompt}
                      </span>
                      <span className="text-amber-600 text-xs font-black uppercase">⭐ High Five!</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[10px] font-black uppercase text-slate-500">
                    <span>Teacher Objective: {previewWorksheet.teacherGoal}</span>
                    <span className="border border-slate-300 rounded-lg px-2 py-0.5 bg-slate-50">
                      Score / Sticker: ⭐ ⭐ ⭐
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

// =========================================================================
// RENDER FULL A4 WORKSHEET ACTIVITY BODY
// =========================================================================
function renderA4WorksheetActivity(ws: WorksheetData) {
  // SPECIAL 1: SHAPE TRACING (Worksheet #20)
  if (ws.id === 'ws-20' || ws.exerciseType === 'shape_trace') {
    return (
      <div className="space-y-4">
        <div className="bg-slate-50 border-2 border-slate-300 rounded-2xl p-3 text-xs font-black uppercase text-slate-800 text-center">
          Start at the colored dot ● and follow the dotted lines with your pencil:
        </div>
        <SvgDottedShapesSheet />
      </div>
    );
  }

  // SPECIAL 2: NUMBER TRACING TRACK 1 TO 5 (Worksheet #15)
  if (ws.id === 'ws-15' || ws.exerciseType === 'number_tracing_track') {
    return (
      <div className="space-y-3.5">
        <div className="bg-slate-50 border-2 border-slate-300 rounded-2xl p-2.5 text-xs font-black uppercase text-slate-800 text-center">
          Trace the dotted numbers on each row from left to right:
        </div>
        {[1, 2, 3, 4, 5].map((num) => (
          <div
            key={num}
            className="bg-white border-2 border-slate-400 rounded-2xl p-2.5 flex items-center justify-between shadow-2xs"
          >
            <div className="w-12 h-12 rounded-xl bg-pink-50 border-2 border-pink-300 flex items-center justify-center text-xl font-black text-pink-700 shrink-0">
              {num}
            </div>
            <div className="flex-1 flex items-center justify-around px-2">
              <SvgDottedNumber num={num} size={56} />
              <SvgDottedNumber num={num} size={56} />
              <SvgDottedNumber num={num} size={56} />
              <SvgDottedNumber num={num} size={56} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // 1. LETTER TRACE AND FIND ACTIVITY (Worksheets 1 to 6)
  if (ws.letterData) {
    const data = ws.letterData;

    // Worksheet #6: Full A to E handwriting sheet
    if (ws.worksheetNumber === 6) {
      return (
        <div className="space-y-3.5">
          <div className="bg-slate-50 border-2 border-slate-300 rounded-2xl p-3 text-xs font-black uppercase text-slate-800 text-center">
            Trace the dotted letters A, B, C, D, E with your pencil:
          </div>
          <div className="space-y-3">
            <div className="bg-white border-2 border-slate-400 rounded-2xl p-3 flex items-center justify-around shadow-2xs">
              <div className="text-xs font-black uppercase text-pink-600 w-12">Row 1:</div>
              <SvgDottedLetterA size={52} />
              <SvgDottedLetterA size={52} />
              <SvgDottedLetterA size={52} />
            </div>
            <div className="bg-white border-2 border-slate-400 rounded-2xl p-3 flex items-center justify-around shadow-2xs">
              <div className="text-xs font-black uppercase text-sky-600 w-12">Row 2:</div>
              <SvgDottedLetterB size={52} />
              <SvgDottedLetterB size={52} />
              <SvgDottedLetterB size={52} />
            </div>
            <div className="bg-white border-2 border-slate-400 rounded-2xl p-3 flex items-center justify-around shadow-2xs">
              <div className="text-xs font-black uppercase text-amber-600 w-12">Row 3:</div>
              <SvgDottedLetterC size={52} />
              <SvgDottedLetterC size={52} />
              <SvgDottedLetterC size={52} />
            </div>
            <div className="bg-white border-2 border-slate-400 rounded-2xl p-3 flex items-center justify-around shadow-2xs">
              <div className="text-xs font-black uppercase text-emerald-600 w-12">Row 4:</div>
              <SvgDottedLetterD size={52} />
              <SvgDottedLetterD size={52} />
              <SvgDottedLetterD size={52} />
            </div>
            <div className="bg-white border-2 border-slate-400 rounded-2xl p-3 flex items-center justify-around shadow-2xs">
              <div className="text-xs font-black uppercase text-purple-600 w-12">Row 5:</div>
              <SvgDottedLetterE size={52} />
              <SvgDottedLetterE size={52} />
              <SvgDottedLetterE size={52} />
            </div>
          </div>
        </div>
      );
    }

    // Worksheets 1 to 5: Single letter with prominent SVG dotted tracing & Phonics
    return (
      <div className="space-y-4">
        {/* Large Prominent Dotted Vector Letter Card */}
        <div className="flex items-center justify-between bg-slate-50 border-2 border-slate-400 rounded-2xl p-4 sm:p-5 shadow-2xs">
          <div className="flex items-center gap-4">
            <div className="bg-white border-2 border-slate-400 rounded-2xl p-2 flex items-center justify-center shadow-xs">
              {data.letter === 'A' && <SvgDottedLetterA size={75} />}
              {data.letter === 'B' && <SvgDottedLetterB size={75} />}
              {data.letter === 'C' && <SvgDottedLetterC size={75} />}
              {data.letter === 'D' && <SvgDottedLetterD size={75} />}
              {data.letter === 'E' && <SvgDottedLetterE size={75} />}
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-slate-500 block">Letter Sound:</span>
              <span className="text-lg sm:text-xl font-black text-slate-900">
                {data.letter} is for {data.phonicsWord}
              </span>
              <span className="text-[11px] font-bold text-pink-600 block mt-0.5">
                ● Start at the colored dot & trace!
              </span>
            </div>
          </div>
          <div className="text-4xl sm:text-5xl">{data.phonicsEmoji}</div>
        </div>

        {/* Real Dotted Handwriting Guidelines Tracks */}
        <div className="space-y-3">
          <div className="text-xs font-black uppercase tracking-wider text-slate-700">
            Trace the dotted letters across each line:
          </div>
          <div className="bg-white border-2 border-slate-400 rounded-2xl p-3 flex items-center justify-around shadow-2xs">
            {data.letter === 'A' && (
              <>
                <SvgDottedLetterA size={56} />
                <SvgDottedLetterA size={56} />
                <SvgDottedLetterA size={56} />
              </>
            )}
            {data.letter === 'B' && (
              <>
                <SvgDottedLetterB size={56} />
                <SvgDottedLetterB size={56} />
                <SvgDottedLetterB size={56} />
              </>
            )}
            {data.letter === 'C' && (
              <>
                <SvgDottedLetterC size={56} />
                <SvgDottedLetterC size={56} />
                <SvgDottedLetterC size={56} />
              </>
            )}
            {data.letter === 'D' && (
              <>
                <SvgDottedLetterD size={56} />
                <SvgDottedLetterD size={56} />
                <SvgDottedLetterD size={56} />
              </>
            )}
            {data.letter === 'E' && (
              <>
                <SvgDottedLetterE size={56} />
                <SvgDottedLetterE size={56} />
                <SvgDottedLetterE size={56} />
              </>
            )}
          </div>

          <div className="bg-white border-2 border-slate-400 rounded-2xl p-3 flex items-center justify-around shadow-2xs">
            {data.letter === 'A' && (
              <>
                <SvgDottedLetterA size={56} />
                <SvgDottedLetterA size={56} />
                <SvgDottedLetterA size={56} />
              </>
            )}
            {data.letter === 'B' && (
              <>
                <SvgDottedLetterB size={56} />
                <SvgDottedLetterB size={56} />
                <SvgDottedLetterB size={56} />
              </>
            )}
            {data.letter === 'C' && (
              <>
                <SvgDottedLetterC size={56} />
                <SvgDottedLetterC size={56} />
                <SvgDottedLetterC size={56} />
              </>
            )}
            {data.letter === 'D' && (
              <>
                <SvgDottedLetterD size={56} />
                <SvgDottedLetterD size={56} />
                <SvgDottedLetterD size={56} />
              </>
            )}
            {data.letter === 'E' && (
              <>
                <SvgDottedLetterE size={56} />
                <SvgDottedLetterE size={56} />
                <SvgDottedLetterE size={56} />
              </>
            )}
          </div>
        </div>

        {/* Un-Circled Pictures for Phonics Circle Activity */}
        {data.findPictures && data.findPictures.length > 0 && (
          <div className="bg-slate-50 border-2 border-slate-300 rounded-2xl p-3.5">
            <div className="text-xs font-black uppercase text-slate-800 mb-2.5">
              Circle the pictures that start with {data.letter}:
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
              {data.findPictures.map((pic, i) => (
                <div
                  key={i}
                  className="bg-white border-2 border-slate-300 rounded-xl p-2 flex flex-col items-center justify-center text-center shadow-xs hover:border-slate-400 transition-all"
                >
                  <span className="text-3xl mb-1">{pic.emoji}</span>
                  <span className="text-[11px] font-black text-slate-800">{pic.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // 2. MATCHING COLUMNS ACTIVITY (Completely UNCONNECTED for child to draw lines)
  if (ws.matchingData) {
    const data = ws.matchingData;
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-8 text-center text-xs font-black uppercase tracking-wider text-slate-700 border-b-2 border-slate-300 pb-2">
          <div>{data.leftHeading || 'Left Column'}</div>
          <div>{data.rightHeading || 'Right Column'}</div>
        </div>

        <div className="space-y-3.5">
          {data.pairs.map((pair, i) => (
            <div key={i} className="flex items-center justify-between gap-4">
              {/* Left Item with blank connection dot */}
              <div className="flex-1 bg-white border-2 border-slate-400 rounded-2xl p-3 flex items-center justify-between shadow-2xs">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl sm:text-3xl">{pair.leftEmoji}</span>
                  <span className="text-xs sm:text-sm font-black text-slate-900">{pair.leftLabel}</span>
                </div>
                {/* Blank Hollow Connector Circle */}
                <span className="w-5 h-5 rounded-full border-2 border-slate-900 bg-white shrink-0 shadow-inner" />
              </div>

              {/* Wide Open Space for Child's Pencil Line */}
              <div className="w-12 sm:w-16 border-b border-dotted border-slate-300 shrink-0" />

              {/* Right Item with blank connection dot */}
              <div className="flex-1 bg-white border-2 border-slate-400 rounded-2xl p-3 flex items-center justify-between shadow-2xs">
                {/* Blank Hollow Connector Circle */}
                <span className="w-5 h-5 rounded-full border-2 border-slate-900 bg-white shrink-0 shadow-inner" />
                <div className="flex items-center gap-2.5">
                  <span className="text-xs sm:text-sm font-black text-slate-900">{pair.rightLabel}</span>
                  <span className="text-2xl sm:text-3xl">{pair.rightEmoji}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 3. COUNTING ACTIVITY (With Uncircled Multiple Choice Options)
  if (ws.countingData) {
    const data = ws.countingData;
    return (
      <div className="space-y-4">
        {data.rows.map((row, i) => {
          // Check if this is a trace & count row with specific numbers 1 to 5
          const isTraceAndCount = ws.exerciseType === 'number_trace_and_count';
          const matchNum = row.prompt.match(/Trace\s*(\d)/i);
          const traceDigit = matchNum ? parseInt(matchNum[1], 10) : null;

          return (
            <div
              key={i}
              className="bg-white border-2 border-slate-400 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs"
            >
              <div className="flex-1">
                <div className="text-xs font-black uppercase text-slate-700 mb-2">{row.prompt}</div>

                <div className="flex items-center gap-4">
                  {/* Dotted vector number if trace and count */}
                  {isTraceAndCount && traceDigit && (
                    <div className="flex items-center gap-2 bg-slate-50 border-2 border-slate-300 p-2 rounded-xl shrink-0">
                      <SvgDottedNumber num={traceDigit} size={58} />
                      <SvgDottedNumber num={traceDigit} size={58} />
                    </div>
                  )}

                  {/* Empty/Uncolored item count sets */}
                  <div className="flex flex-wrap items-center gap-2 text-3xl sm:text-4xl">
                    {Array.from({ length: row.count }).map((_, c) => (
                      <span key={c} className="p-1.5 bg-slate-50 border-2 border-slate-300 rounded-xl shadow-2xs">
                        {row.itemEmoji}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* UN-MARKED Multiple Choice Options (Child circles or fills bubble) */}
              <div className="flex items-center gap-3 bg-slate-50 border-2 border-slate-300 p-2.5 rounded-xl shrink-0">
                <span className="text-[10px] font-black uppercase text-slate-500 mr-0.5">Choose:</span>
                {row.options.map((opt) => (
                  <div
                    key={opt}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white border-2 border-dashed border-slate-300 rounded-xl shadow-2xs hover:border-slate-500 transition-colors"
                  >
                    <span className="w-4 h-4 rounded-full border-2 border-slate-400 bg-white inline-block shrink-0" />
                    <span className="text-lg font-black text-slate-900 font-mono">{opt}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // 4. SHAPE HUNT ACTIVITY (Un-circled shapes grid)
  if (ws.shapeData) {
    const data = ws.shapeData;
    return (
      <div className="space-y-4">
        <div className="bg-slate-50 border-2 border-slate-300 rounded-2xl p-3.5 text-center text-xs font-black uppercase text-slate-700">
          Target Shape: {data.targetEmoji} {data.targetShapeName}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {data.shapesGrid.map((shape, i) => (
            <div
              key={i}
              className="bg-white border-3 border-slate-400 rounded-2xl p-5 flex flex-col items-center justify-center text-center shadow-xs min-h-[110px]"
            >
              <span className="text-5xl mb-2 font-mono text-slate-900">{shape.emoji}</span>
              <span className="text-xs font-black text-slate-800">{shape.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 5. COLORING ACTIVITY (Empty Line-Art Outlines)
  if (ws.colorData) {
    const data = ws.colorData;
    return (
      <div className="space-y-4 text-center">
        <div className="bg-slate-50 border-2 border-slate-300 rounded-2xl p-3 text-xs font-black uppercase text-slate-700">
          {data.coloringPrompt}
        </div>

        {/* Big Empty Line-Art Vector for Coloring */}
        <div className="border-4 border-dashed border-slate-400 rounded-3xl p-8 min-h-[220px] flex flex-col items-center justify-center bg-white shadow-xs">
          {data.svgOutlineType === 'apple' && <SvgAppleOutline size={140} />}
          {data.svgOutlineType === 'sun' && <SvgSunOutline size={140} />}
          {data.svgOutlineType === 'leaf_and_wave' && (
            <div className="flex items-center gap-8">
              <SvgLeafOutline size={110} />
              <SvgWaveOutline size={110} />
            </div>
          )}
          {data.svgOutlineType === 'ball' && <SvgBallOutline size={130} />}
          {data.svgOutlineType === 'butterfly' && <SvgButterflyOutline size={150} />}
          {data.svgOutlineType === 'rainbow' && <SvgRainbowOutline size={160} />}

          <div className="text-base font-black uppercase text-slate-800 mt-3">{data.itemLabel}</div>
          <div className="text-xs font-bold text-slate-400 mt-1">
            (Blank inside — color inside the lines!)
          </div>
        </div>

        {/* Color Palette Swatches */}
        {data.colorBoxes && data.colorBoxes.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {data.colorBoxes.map((box, i) => (
              <div
                key={i}
                className="flex items-center gap-2 bg-slate-50 border-2 border-slate-300 px-3 py-1.5 rounded-xl"
              >
                <span
                  className="w-5 h-5 rounded-full border border-slate-400 inline-block"
                  style={{ backgroundColor: box.colorHex }}
                />
                <span className="text-xs font-black text-slate-800">{box.colorName}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // 6. TRACING LINES ACTIVITY (Worksheets 44, 45, 46 — 100% SVG Vector Dotted Paths)
  if (ws.tracingData) {
    const data = ws.tracingData;
    return (
      <div className="space-y-4">
        <div className="bg-slate-50 border-2 border-slate-300 rounded-2xl p-2.5 text-xs font-black uppercase text-slate-800 text-center">
          Put your pencil at the colored start dot ● and trace all the way to the end!
        </div>

        {data.lines.map((line, i) => {
          if (line.lineType === 'straight') {
            return (
              <SvgDottedStraightTrack
                key={i}
                startEmoji={line.startEmoji}
                endEmoji={line.endEmoji}
                startLabel={line.startLabel}
                endLabel={line.endLabel}
              />
            );
          }
          if (line.lineType === 'wavy') {
            return (
              <SvgDottedWavyTrack
                key={i}
                startEmoji={line.startEmoji}
                endEmoji={line.endEmoji}
                startLabel={line.startLabel}
                endLabel={line.endLabel}
              />
            );
          }
          if (line.lineType === 'zigzag') {
            return (
              <SvgDottedZigzagTrack
                key={i}
                startEmoji={line.startEmoji}
                endEmoji={line.endEmoji}
                startLabel={line.startLabel}
                endLabel={line.endLabel}
              />
            );
          }

          return (
            <SvgDottedStraightTrack
              key={i}
              startEmoji={line.startEmoji}
              endEmoji={line.endEmoji}
              startLabel={line.startLabel}
              endLabel={line.endLabel}
            />
          );
        })}
      </div>
    );
  }

  // 7. CHOICE GRID ACTIVITY (Uncircled items)
  if (ws.choiceData) {
    const data = ws.choiceData;
    return (
      <div className="space-y-4">
        <div className="bg-slate-50 border-2 border-slate-300 rounded-2xl p-3 text-xs font-black uppercase text-slate-700 text-center">
          {data.instructionPrompt}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {data.items.map((item, i) => (
            <div
              key={i}
              className="bg-white border-3 border-slate-400 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-xs min-h-[110px]"
            >
              <span className="text-4xl sm:text-5xl mb-2">{item.emoji}</span>
              <span className="text-xs font-black text-slate-800">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 8. SEQUENCE ACTIVITY (With blank write-in bubbles)
  if (ws.sequenceData) {
    const data = ws.sequenceData;
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {data.steps.map((step) => (
            <div
              key={step.stepId}
              className="bg-white border-3 border-slate-400 rounded-2xl p-5 flex flex-col items-center justify-between text-center shadow-xs"
            >
              {/* Blank Number Circle for child to write 1, 2, or 3 */}
              <div className="w-12 h-12 rounded-full border-3 border-dashed border-slate-800 bg-white text-slate-400 flex items-center justify-center font-black text-lg mb-2 shadow-inner">
                ?
              </div>
              <span className="text-5xl my-2">{step.emoji}</span>
              <div className="text-xs font-black uppercase text-slate-900 mb-1">{step.label}</div>
              <div className="text-[11px] font-bold text-slate-500">{step.hint}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 9. DRAWING / MAZE / DOT-TO-DOT PROMPT
  if (ws.exerciseType === 'simple_maze') {
    return (
      <div className="flex flex-col items-center justify-center space-y-3">
        <div className="bg-slate-50 border-2 border-slate-300 rounded-2xl p-3 text-xs font-black uppercase text-slate-700 text-center w-full">
          START at 🐶 Puppy → Follow the open paths → Reach the 🦴 Bone!
        </div>
        <SvgPuppyMaze size={260} />
      </div>
    );
  }

  if (ws.exerciseType === 'dot_to_dot_drawing') {
    return (
      <div className="flex flex-col items-center justify-center space-y-3">
        <div className="bg-slate-50 border-2 border-slate-300 rounded-2xl p-3 text-xs font-black uppercase text-slate-700 text-center w-full">
          Connect the numbered dots in order: 1 → 2 → 3 ... 10!
        </div>
        <SvgDotToDotStar size={240} />
      </div>
    );
  }

  if (ws.exerciseType === 'draw_happy_face') {
    return (
      <div className="flex flex-col items-center justify-center space-y-3">
        <div className="bg-slate-50 border-2 border-slate-300 rounded-2xl p-3 text-xs font-black uppercase text-slate-700 text-center w-full">
          Draw 2 eyes, a cute nose, and a giant happy smile inside the face!
        </div>
        <SvgFaceOutline size={180} />
      </div>
    );
  }

  if (ws.drawingData) {
    const data = ws.drawingData;
    return (
      <div className="space-y-4 text-center">
        <div className="bg-slate-50 border-2 border-slate-300 rounded-2xl p-3 text-xs font-black uppercase text-slate-700">
          {data.promptGuidance}
        </div>

        {/* Large Drawing Canvas Box */}
        <div className="bg-white border-4 border-dashed border-slate-500 rounded-3xl p-8 min-h-[250px] flex flex-col items-center justify-between relative">
          <div className="text-4xl text-slate-300">{data.frameGuideEmoji}</div>
          <div className="my-auto space-y-1">
            <h4 className="text-base font-black uppercase text-slate-900">{data.promptTitle}</h4>
            <div className="text-xs font-bold text-slate-400">
              (Use crayons or pencils to draw your creative work here!)
            </div>
          </div>
          {data.tracingHint && (
            <div className="w-full text-xs font-black text-slate-700 border-t-2 border-slate-200 pt-3">
              {data.tracingHint}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Default fallback
  return (
    <div className="bg-slate-50 border-2 border-slate-300 rounded-2xl p-8 text-center text-xs font-black text-slate-800">
      {ws.instruction}
    </div>
  );
}

// =========================================================================
// STANDALONE PRINTABLE A4 HTML GENERATOR (WITH CLEAN LINE-ART SVG)
// =========================================================================
function generateA4WorksheetHtml(ws: WorksheetData): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Worksheet #${ws.worksheetNumber} - ${ws.title}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 10mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      margin: 0;
      padding: 0;
      background: #f8fafc;
      color: #0f172a;
    }
    .page {
      width: 210mm;
      min-height: 297mm;
      margin: 0 auto;
      background: white;
      padding: 12mm 15mm;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      border: 1px solid #cbd5e1;
    }
    @media print {
      body { background: white; }
      .page {
        width: 100%;
        min-height: 100%;
        margin: 0;
        padding: 8mm;
        border: none;
      }
      .no-print { display: none !important; }
    }
    .header {
      border-bottom: 2px solid #0f172a;
      padding-bottom: 8px;
      margin-bottom: 12px;
    }
    .badge-bar {
      display: flex;
      justify-content: space-between;
      font-size: 11px;
      font-weight: 900;
      text-transform: uppercase;
      margin-bottom: 6px;
      color: #475569;
    }
    .title {
      font-size: 24px;
      font-weight: 900;
      text-align: center;
      text-transform: uppercase;
      margin: 4px 0;
      letter-spacing: -0.5px;
    }
    .student-bar {
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
      font-size: 12px;
      font-weight: bold;
      border: 1.5px solid #cbd5e1;
      border-radius: 8px;
      padding: 8px 12px;
      background: #f8fafc;
    }
    .line {
      display: inline-block;
      width: 120px;
      border-bottom: 1.5px solid #64748b;
    }
    .instruction-box {
      background: #fdf2f8;
      border: 2px solid #fbcfe8;
      border-radius: 10px;
      padding: 10px 14px;
      font-size: 13px;
      font-weight: 900;
      color: #831843;
      margin-bottom: 16px;
    }
    .activity-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .footer-section {
      border-top: 2px solid #e2e8f0;
      padding-top: 8px;
      margin-top: 12px;
      font-size: 10px;
      color: #64748b;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .bonus-box {
      background: #fffbeb;
      border: 1px solid #fef3c7;
      border-radius: 8px;
      padding: 6px 10px;
      font-size: 11px;
      font-weight: bold;
      color: #78350f;
      margin-bottom: 6px;
    }
    .print-btn {
      position: fixed;
      top: 16px;
      right: 16px;
      background: #db2777;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 10px;
      font-weight: 900;
      cursor: pointer;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
  </style>
</head>
<body>
  <button class="print-btn no-print" onclick="window.print()">🖨️ Print Worksheet (A4)</button>

  <div class="page">
    <div>
      <div class="header">
        <div class="badge-bar">
          <span>Worksheet #${ws.worksheetNumber} • ${ws.category}</span>
          <span>${ws.learningArea} • ${ws.ageGroup}</span>
        </div>
        <h1 class="title">${ws.title}</h1>
        <div class="student-bar">
          <div>Name: <span class="line"></span></div>
          <div>Date: <span class="line" style="width: 90px;"></span></div>
          <div>Class: <span class="line" style="width: 70px;"></span></div>
        </div>
      </div>

      <div class="instruction-box">
        👉 <strong>INSTRUCTION:</strong> ${ws.instruction}
      </div>
    </div>

    <div class="activity-container">
      ${generateHtmlBodyForWorksheet(ws)}
    </div>

    <div>
      ${ws.bonusPrompt ? `<div class="bonus-box">🌟 <strong>Bonus Activity:</strong> ${ws.bonusPrompt}</div>` : ''}
      <div class="footer-section">
        <span>Teacher Objective: ${ws.teacherGoal}</span>
        <span>Score / Sticker: ⭐ ⭐ ⭐</span>
      </div>
    </div>
  </div>
</body>
</html>`;
}

function generateHtmlBodyForWorksheet(ws: WorksheetData): string {
  // SPECIAL 1: SHAPE TRACING (Worksheet #20)
  if (ws.id === 'ws-20' || ws.exerciseType === 'shape_trace') {
    return `<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; text-align: center;">
      <div style="border: 2px solid #64748b; border-radius: 14px; padding: 18px; background: white;">
        <svg width="120" height="120" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="40" stroke="#0f172a" stroke-width="4" stroke-dasharray="6 8" />
          <circle cx="50" cy="10" r="4" fill="#db2777" />
          <text x="50" y="55" text-anchor="middle" font-size="10" font-weight="bold" fill="#64748b">Start ●</text>
        </svg>
        <div style="font-weight: 900; font-size: 13px; margin-top: 8px;">Dotted Circle</div>
      </div>
      <div style="border: 2px solid #64748b; border-radius: 14px; padding: 18px; background: white;">
        <svg width="120" height="120" viewBox="0 0 100 100" fill="none">
          <rect x="12" y="12" width="76" height="76" stroke="#0f172a" stroke-width="4" stroke-dasharray="6 8" />
          <circle cx="12" cy="12" r="4" fill="#0284c7" />
          <text x="50" y="55" text-anchor="middle" font-size="10" font-weight="bold" fill="#64748b">Start ●</text>
        </svg>
        <div style="font-weight: 900; font-size: 13px; margin-top: 8px;">Dotted Square</div>
      </div>
      <div style="border: 2px solid #64748b; border-radius: 14px; padding: 18px; background: white;">
        <svg width="120" height="120" viewBox="0 0 100 100" fill="none">
          <polygon points="50,12 12,88 88,88" stroke="#0f172a" stroke-width="4" stroke-dasharray="6 8" />
          <circle cx="50" cy="12" r="4" fill="#d97706" />
          <text x="50" y="65" text-anchor="middle" font-size="10" font-weight="bold" fill="#64748b">Start ●</text>
        </svg>
        <div style="font-weight: 900; font-size: 13px; margin-top: 8px;">Dotted Triangle</div>
      </div>
      <div style="border: 2px solid #64748b; border-radius: 14px; padding: 18px; background: white;">
        <svg width="120" height="120" viewBox="0 0 100 100" fill="none">
          <rect x="10" y="24" width="80" height="52" stroke="#0f172a" stroke-width="4" stroke-dasharray="6 8" />
          <circle cx="10" cy="24" r="4" fill="#059669" />
          <text x="50" y="54" text-anchor="middle" font-size="10" font-weight="bold" fill="#64748b">Start ●</text>
        </svg>
        <div style="font-weight: 900; font-size: 13px; margin-top: 8px;">Dotted Rectangle</div>
      </div>
    </div>`;
  }

  // Matching columns (Completely UNCONNECTED with open line-drawing space)
  if (ws.matchingData) {
    return `<table style="width: 100%; border-collapse: separate; border-spacing: 0 12px;">
      ${ws.matchingData.pairs
        .map(
          (p) => `<tr>
        <td style="padding: 12px; border: 2px solid #64748b; border-radius: 12px; width: 44%; font-weight: bold; font-size: 14px; background: white;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span><span style="font-size: 22px;">${p.leftEmoji}</span> ${p.leftLabel}</span>
            <span style="display: inline-block; width: 16px; height: 16px; border: 2px solid #0f172a; border-radius: 50%; background: white;"></span>
          </div>
        </td>
        <td style="width: 12%; text-align: center; color: #cbd5e1; font-weight: bold;"></td>
        <td style="padding: 12px; border: 2px solid #64748b; border-radius: 12px; width: 44%; font-weight: bold; font-size: 14px; background: white;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="display: inline-block; width: 16px; height: 16px; border: 2px solid #0f172a; border-radius: 50%; background: white;"></span>
            <span>${p.rightLabel} <span style="font-size: 22px;">${p.rightEmoji}</span></span>
          </div>
        </td>
      </tr>`
        )
        .join('')}
    </table>`;
  }

  // Counting (Unmarked multiple choice options for child to circle)
  if (ws.countingData) {
    return `<div style="display: flex; flex-direction: column; gap: 14px;">
      ${ws.countingData.rows
        .map(
          (r) => `<div style="display: flex; justify-content: space-between; align-items: center; padding: 14px; border: 2px solid #64748b; border-radius: 14px; background: white;">
        <div>
          <div style="font-size: 11px; font-weight: bold; text-transform: uppercase; color: #475569; margin-bottom: 4px;">${r.prompt}</div>
          <div style="font-size: 28px;">${Array(r.count).fill(r.itemEmoji).join(' ')}</div>
        </div>
        <div style="display: flex; gap: 10px; align-items: center;">
          <span style="font-size: 11px; font-weight: bold; color: #64748b; text-transform: uppercase;">Options:</span>
          ${r.options.map((o) => `<div style="display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border: 2px dashed #94a3b8; border-radius: 10px; background: white; font-weight: 900; font-size: 18px;"><span style="display: inline-block; width: 14px; height: 14px; border: 2px solid #64748b; border-radius: 50%; background: white;"></span><span>${o}</span></div>`).join('')}
        </div>
      </div>`
        )
        .join('')}
    </div>`;
  }

  // Letter Trace & Find (Worksheets 1 to 6)
  if (ws.letterData) {
    return `<div style="display: flex; flex-direction: column; gap: 14px;">
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 14px; border: 2px solid #64748b; border-radius: 14px; background: #f8fafc;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="width: 70px; height: 70px; border: 2px dashed #0f172a; border-radius: 10px; display: flex; align-items: center; justify-content: center; background: white;">
            <svg width="60" height="60" viewBox="0 0 140 80" fill="none">
              <line x1="0" y1="10" x2="140" y2="10" stroke="#94a3b8" stroke-width="1" />
              <line x1="0" y1="45" x2="140" y2="45" stroke="#cbd5e1" stroke-width="1" stroke-dasharray="4 4" />
              <line x1="0" y1="75" x2="140" y2="75" stroke="#94a3b8" stroke-width="1" />
              <path d="M35 15 L15 75" stroke="#0f172a" stroke-width="4.5" stroke-dasharray="5 7" />
              <path d="M35 15 L55 75" stroke="#0f172a" stroke-width="4.5" stroke-dasharray="5 7" />
              <path d="M22 50 L48 50" stroke="#0f172a" stroke-width="4.5" stroke-dasharray="5 6" />
              <circle cx="35" cy="15" r="4" fill="#db2777" />
            </svg>
          </div>
          <div>
            <div style="font-size: 10px; font-weight: 900; text-transform: uppercase; color: #64748b;">Phonics Word:</div>
            <div style="font-size: 18px; font-weight: 900;">${ws.letterData.letter} is for ${ws.letterData.phonicsWord}</div>
            <div style="font-size: 11px; color: #db2777; font-weight: bold;">● Start at colored dot and trace</div>
          </div>
        </div>
        <div style="font-size: 40px;">${ws.letterData.phonicsEmoji}</div>
      </div>
      <div style="border: 2px solid #64748b; border-radius: 12px; padding: 12px; background: white;">
        <div style="font-size: 11px; font-weight: 900; text-transform: uppercase; color: #334155; margin-bottom: 6px;">Trace the dotted letters:</div>
        ${ws.letterData.traceRows.map((row) => `<div style="border-bottom: 2px dashed #cbd5e1; padding: 10px 0; display: flex; justify-content: space-around; font-family: monospace; font-size: 26px; color: #64748b;">${row.map((c) => `<span style="border: 2px dashed #64748b; padding: 4px 14px; border-radius: 8px; font-weight: 900; letter-spacing: 2px;">${c}</span>`).join('')}</div>`).join('')}
      </div>
      ${ws.letterData.findPictures && ws.letterData.findPictures.length > 0 ? `<div style="border: 2px solid #cbd5e1; border-radius: 12px; padding: 10px; background: #f8fafc;"><div style="font-size: 11px; font-weight: 900; text-transform: uppercase; margin-bottom: 8px;">Circle pictures starting with ${ws.letterData.letter}:</div><div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 8px; text-align: center;">${ws.letterData.findPictures.map((p) => `<div style="border: 1.5px solid #cbd5e1; border-radius: 8px; padding: 8px; background: white;"><div style="font-size: 24px;">${p.emoji}</div><div style="font-size: 10px; font-weight: bold; margin-top: 2px;">${p.label}</div></div>`).join('')}</div></div>` : ''}
    </div>`;
  }

  // Tracing lines (Worksheets 44, 45, 46 — Crisp Inline Vector SVG)
  if (ws.tracingData) {
    return `<div style="display: flex; flex-direction: column; gap: 16px;">
      ${ws.tracingData.lines
        .map((l) => {
          let svgPath = `<line x1="10" y1="15" x2="280" y2="15" stroke="#0f172a" stroke-width="4.5" stroke-dasharray="8 10" stroke-linecap="round" />`;
          if (l.lineType === 'wavy') {
            svgPath = `<path d="M10 20 Q35 2 60 20 T110 20 T160 20 T210 20 T260 20 L280 20" stroke="#0f172a" stroke-width="4.5" stroke-dasharray="8 10" stroke-linecap="round" fill="none" />`;
          } else if (l.lineType === 'zigzag') {
            svgPath = `<path d="M10 30 L35 10 L60 30 L85 10 L110 30 L135 10 L160 30 L185 10 L210 30 L235 10 L260 30 L280 10" stroke="#0f172a" stroke-width="4.5" stroke-dasharray="8 10" stroke-linecap="round" fill="none" />`;
          }

          return `<div style="display: flex; justify-content: space-between; align-items: center; padding: 14px; border: 2px solid #64748b; border-radius: 14px; background: white;">
            <span style="font-size: 28px;">${l.startEmoji}</span>
            <div style="flex: 1; padding: 0 16px;">
              <svg width="100%" height="34" viewBox="0 0 300 34" fill="none" preserveAspectRatio="none">
                ${svgPath}
                <circle cx="10" cy="15" r="4" fill="#db2777" />
              </svg>
            </div>
            <span style="font-size: 28px;">${l.endEmoji}</span>
          </div>`;
        })
        .join('')}
    </div>`;
  }

  // Shape Hunt
  if (ws.shapeData) {
    return `<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; text-align: center;">
      ${ws.shapeData.shapesGrid
        .map(
          (s) => `<div style="border: 2px solid #64748b; border-radius: 14px; padding: 22px; min-height: 110px; display: flex; flex-direction: column; justify-content: center; align-items: center; background: white;">
        <div style="font-size: 44px; margin-bottom: 6px; font-family: monospace;">${s.emoji}</div>
        <div style="font-size: 12px; font-weight: bold;">${s.label}</div>
      </div>`
        )
        .join('')}
    </div>`;
  }

  // General drawing or fallback
  return `<div style="padding: 40px; border: 3px dashed #64748b; border-radius: 16px; text-align: center; font-size: 14px; font-weight: bold; color: #334155; min-height: 250px; display: flex; flex-direction: column; justify-content: center; align-items: center; background: white;">
    <div style="font-size: 50px; margin-bottom: 12px;">${ws.badgeEmoji}</div>
    <div style="font-size: 18px; text-transform: uppercase; margin-bottom: 8px;">${ws.title}</div>
    <div style="font-size: 13px; color: #64748b; max-width: 450px;">${ws.instruction}</div>
  </div>`;
}
