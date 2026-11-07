import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Eye,
  Download,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Grid as GridIcon,
  HelpCircle,
} from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { FLASH_CARDS_DATA, FLASHCARD_CATEGORIES, FlashCardCategory, FlashCardItem } from '../../data/flashCardsData';
import { FlashCard2DSvg } from './visuals/FlashCard2DSvg';

interface FlashCardsToolProps {
  onBack?: () => void;
}

export const FlashCardsTool: React.FC<FlashCardsToolProps> = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCardIndex, setActiveCardIndex] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'slideshow'>('grid');
  const [slideshowIndex, setSlideshowIndex] = useState<number>(0);
  const [downloadSuccessId, setDownloadSuccessId] = useState<string | null>(null);

  // Category lookup map
  const categoryMap = useMemo(() => {
    const map = new Map<string, FlashCardCategory>();
    FLASHCARD_CATEGORIES.forEach((cat) => map.set(cat.id, cat));
    return map;
  }, []);

  const getCategoryName = (categoryId: string) => {
    return categoryMap.get(categoryId)?.name || categoryId;
  };

  // Filtered Cards
  const filteredCards = useMemo(() => {
    let list = FLASH_CARDS_DATA;
    if (selectedCategoryId !== 'all') {
      list = list.filter((c) => c.categoryId === selectedCategoryId);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (c) =>
          c.word.toLowerCase().includes(q) ||
          getCategoryName(c.categoryId).toLowerCase().includes(q) ||
          (c.phonics && c.phonics.toLowerCase().includes(q)) ||
          (c.subtext && c.subtext.toLowerCase().includes(q)) ||
          (c.prompt && c.prompt.toLowerCase().includes(q)) ||
          c.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return list;
  }, [selectedCategoryId, searchQuery, categoryMap]);

  // Active card from index in filtered list
  const activeCard = useMemo(() => {
    if (activeCardIndex === null || activeCardIndex < 0 || activeCardIndex >= filteredCards.length) {
      return null;
    }
    return filteredCards[activeCardIndex];
  }, [activeCardIndex, filteredCards]);

  // Download Single Flashcard as a clean standalone vector A4 printable document
  const handleDownloadSingleCard = (card: FlashCardItem) => {
    soundManager.playPop();
    setDownloadSuccessId(card.id);
    setTimeout(() => setDownloadSuccessId(null), 2500);

    const catName = getCategoryName(card.categoryId);
    const svgEl = document.querySelector(`[data-card-id="${card.id}"] svg`) || document.querySelector(`#modal-card-svg svg`);
    const svgMarkup = svgEl ? svgEl.outerHTML : `<div style="font-size:72px;margin:20px 0;">🎴</div>`;

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${card.word} - Preschool 2D Flash Card</title>
  <style>
    @page { size: A4 portrait; margin: 15mm; }
    * { box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
    body { margin: 0; padding: 24px; display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 100vh; background: #f8fafc; color: #0f172a; }
    .flash-card {
      width: 140mm;
      min-height: 190mm;
      background: white;
      border: 3px dashed #94a3b8;
      border-radius: 24px;
      padding: 28px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      text-align: center;
      box-shadow: 0 10px 30px -5px rgba(0,0,0,0.1);
      position: relative;
    }
    .header-tag {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      padding-bottom: 14px;
      border-bottom: 2px solid #f1f5f9;
      font-size: 13px;
      font-weight: 800;
      color: #475569;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .phonics-badge {
      background: #fef3c7;
      color: #92400e;
      padding: 3px 12px;
      border-radius: 999px;
      font-weight: 900;
      border: 1px solid #fde68a;
    }
    .svg-area {
      padding: 24px 0;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-grow: 1;
    }
    .svg-area svg {
      width: 190px;
      height: 190px;
    }
    .word-text {
      font-size: 46px;
      font-weight: 900;
      color: #0f172a;
      margin: 0;
      letter-spacing: -0.02em;
    }
    .subtext {
      font-size: 16px;
      font-weight: 600;
      color: #64748b;
      margin: 6px 0 12px 0;
    }
    .prompt-box {
      width: 100%;
      background: #fffbeb;
      border: 1.5px solid #fde68a;
      border-radius: 14px;
      padding: 12px 16px;
      font-size: 12px;
      color: #92400e;
      text-align: left;
      margin-top: 12px;
    }
    .prompt-title {
      font-weight: 800;
      margin-bottom: 4px;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .footer-note {
      margin-top: 14px;
      font-size: 11px;
      color: #94a3b8;
      font-weight: bold;
    }
    @media print {
      body { background: white; padding: 0; }
      .flash-card { box-shadow: none; width: 100%; height: 100%; }
    }
  </style>
</head>
<body>
  <div class="flash-card">
    <div class="header-tag">
      <span>${catName}</span>
      ${card.phonics ? `<span class="phonics-badge">Phonics: ${card.phonics}</span>` : ''}
    </div>
    
    <div class="svg-area">
      ${svgMarkup}
    </div>

    <div>
      <h1 class="word-text">${card.word}</h1>
      ${card.subtext ? `<div class="subtext">${card.subtext}</div>` : ''}
    </div>

    ${card.prompt ? `
    <div class="prompt-box">
      <div class="prompt-title">💬 Teacher Discussion Prompt</div>
      <div>"${card.prompt}"</div>
    </div>` : ''}

    <div class="footer-note">
      ✂️ Cut along dashed guidelines • Preschool Ready-Made 2D Flash Card Library
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Flashcard_${card.word.replace(/[^a-zA-Z0-9]/g, '_')}_Preschool.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Download complete set of cards as a clean multi-card classroom pack
  const handleDownloadSet = () => {
    soundManager.playPop();
    const catName = selectedCategoryId === 'all' ? 'All_Preschool_Flashcards' : getCategoryName(selectedCategoryId).replace(/\s+/g, '_');
    
    const cardsHtml = filteredCards.map((c) => {
      const svgEl = document.querySelector(`[data-card-id="${c.id}"] svg`);
      const svgMarkup = svgEl ? svgEl.outerHTML : `<div style="font-size:48px;margin:12px 0;">🎴</div>`;
      return `
      <div class="card-item">
        <div class="card-top">
          <span>${getCategoryName(c.categoryId)}</span>
          ${c.phonics ? `<span class="tag">${c.phonics}</span>` : ''}
        </div>
        <div class="card-svg">
          ${svgMarkup}
        </div>
        <div class="card-word">${c.word}</div>
        ${c.subtext ? `<div class="card-sub">${c.subtext}</div>` : ''}
      </div>`;
    }).join('');

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Preschool Flash Cards - ${catName}</title>
  <style>
    @page { size: A4; margin: 10mm; }
    * { box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
    body { margin: 0; padding: 20px; background: #f8fafc; color: #0f172a; }
    .header { text-align: center; margin-bottom: 24px; padding-bottom: 12px; border-bottom: 2px solid #cbd5e1; }
    .title { font-size: 26px; font-weight: 900; margin: 0; }
    .subtitle { font-size: 13px; color: #64748b; margin-top: 4px; }
    .grid-container {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }
    .card-item {
      background: white;
      border: 2px dashed #94a3b8;
      border-radius: 16px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      text-align: center;
      min-height: 270px;
      page-break-inside: avoid;
    }
    .card-top {
      display: flex;
      justify-content: space-between;
      width: 100%;
      font-size: 11px;
      font-weight: 800;
      color: #64748b;
      text-transform: uppercase;
      border-bottom: 1px solid #f1f5f9;
      padding-bottom: 6px;
    }
    .tag { background: #fef3c7; color: #92400e; padding: 1px 6px; border-radius: 999px; }
    .card-svg { padding: 12px 0; display: flex; justify-content: center; align-items: center; }
    .card-svg svg { width: 110px; height: 110px; }
    .card-word { font-size: 24px; font-weight: 900; color: #0f172a; margin-top: 4px; }
    .card-sub { font-size: 12px; color: #64748b; font-weight: 600; margin-top: 2px; }
    @media print {
      body { background: white; padding: 0; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1 class="title">Preschool 2D Flash Cards Pack</h1>
    <div class="subtitle">Category: ${selectedCategoryId === 'all' ? 'All Cards' : getCategoryName(selectedCategoryId)} • Ready for Classroom Cut & Laminate</div>
  </div>
  <div class="grid-container">
    ${cardsHtml}
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Flashcards_Pack_${catName}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div id="flash-cards-tool" className="space-y-6">
      {/* ---------------------------------------------------------------- */}
      {/* HEADER BANNER */}
      {/* ---------------------------------------------------------------- */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden print:hidden">
        <div className="absolute -right-12 -bottom-12 w-56 h-56 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider text-amber-100">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              Preschool Ready-Made 2D Library
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Ready-Made 2D Preschool Flash Cards
            </h1>
            <p className="text-sm sm:text-base text-amber-100/90 leading-relaxed">
              Explore 110+ crystal-clear 2D vector flash cards curated for vocabulary, phonics, numbers, colors, shapes, animals, classroom objects, and opposites. Clean, bold, and ready for instant classroom display or print.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleDownloadSet}
              className="inline-flex items-center gap-2 px-4 py-3 bg-white text-emerald-800 hover:bg-emerald-50 rounded-2xl font-bold text-sm shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
            >
              <Download className="w-4 h-4 text-emerald-600" />
              Download Set ({filteredCards.length})
            </button>
            <button
              onClick={() => {
                soundManager.playPop();
                setViewMode(viewMode === 'slideshow' ? 'grid' : 'slideshow');
                setSlideshowIndex(0);
              }}
              className="inline-flex items-center gap-2 px-4 py-3 bg-black/20 hover:bg-black/30 backdrop-blur-sm text-white rounded-2xl font-bold text-sm transition-all duration-200 border border-white/20 cursor-pointer"
            >
              {viewMode === 'slideshow' ? (
                <>
                  <GridIcon className="w-4 h-4" />
                  Grid View
                </>
              ) : (
                <>
                  <Maximize2 className="w-4 h-4" />
                  Slide Deck Mode
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* CATEGORY SELECTOR & SEARCH */}
      {/* ---------------------------------------------------------------- */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-sm space-y-4 print:hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search flash cards (e.g. apple, 5, red, circle, bear)..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
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
            <span>Showing <strong className="text-slate-800">{filteredCards.length}</strong> cards</span>
            <span>•</span>
            <span>100% Clean 2D Vectors</span>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-200">
          <button
            onClick={() => {
              soundManager.playPop();
              setSelectedCategoryId('all');
            }}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 border cursor-pointer ${
              selectedCategoryId === 'all'
                ? 'bg-amber-500 text-white border-amber-600 shadow-sm shadow-amber-500/30 ring-2 ring-amber-500/20'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80 hover:border-slate-300'
            }`}
          >
            <span>🌟</span>
            <span>All Cards</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                selectedCategoryId === 'all' ? 'bg-amber-700/60 text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              {FLASH_CARDS_DATA.length}
            </span>
          </button>

          {FLASHCARD_CATEGORIES.map((cat) => {
            const isSelected = selectedCategoryId === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  soundManager.playPop();
                  setSelectedCategoryId(cat.id);
                }}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 border cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500 text-white border-amber-600 shadow-sm shadow-amber-500/30 ring-2 ring-amber-500/20'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.name}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    isSelected ? 'bg-amber-700/60 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* SLIDESHOW DECK VIEW */}
      {/* ---------------------------------------------------------------- */}
      {viewMode === 'slideshow' && filteredCards.length > 0 && (
        <div className="bg-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-2xl flex flex-col items-center justify-center relative min-h-[460px] print:hidden">
          <button
            onClick={() => setViewMode('grid')}
            className="absolute top-4 right-4 p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full cursor-pointer"
            title="Close Slide Deck"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Current Card */}
          {(() => {
            const card = filteredCards[slideshowIndex] || filteredCards[0];
            return (
              <div className="w-full max-w-md flex flex-col items-center space-y-6">
                <div className="flex items-center justify-between w-full text-xs font-bold text-slate-400">
                  <span className="bg-slate-800 px-3 py-1 rounded-full uppercase tracking-wider">
                    {getCategoryName(card.categoryId)}
                  </span>
                  <span>
                    Card {slideshowIndex + 1} of {filteredCards.length}
                  </span>
                </div>

                {/* Big Flash Card Frame */}
                <div className="w-full bg-white rounded-3xl p-6 shadow-2xl border-4 border-slate-100 text-slate-900 flex flex-col items-center text-center relative">
                  {/* Top Letter / Number / Category highlight */}
                  {card.phonics && (
                    <div className="absolute top-4 left-4 bg-amber-100 text-amber-900 px-3 py-1 rounded-xl text-xs font-black">
                      {card.phonics}
                    </div>
                  )}

                  <div className="py-4 my-2 flex items-center justify-center">
                    <FlashCard2DSvg type={card.svgType} size={160} />
                  </div>

                  <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                    {card.word}
                  </h2>

                  {card.subtext && (
                    <p className="text-sm font-semibold text-slate-500 mt-1">
                      {card.subtext}
                    </p>
                  )}

                  {card.prompt && (
                    <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-medium text-amber-800 bg-amber-50/80 px-4 py-2 rounded-xl w-full">
                      💬 <span className="italic">{card.prompt}</span>
                    </div>
                  )}
                </div>

                {/* Controls */}
                <div className="flex flex-col w-full gap-3 pt-2">
                  <div className="flex items-center justify-between w-full gap-4">
                    <button
                      disabled={slideshowIndex === 0}
                      onClick={() => {
                        soundManager.playPop();
                        setSlideshowIndex((i) => Math.max(0, i - 1));
                      }}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none rounded-2xl text-sm font-bold text-white transition-all cursor-pointer shadow-md"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </button>

                    <button
                      disabled={slideshowIndex >= filteredCards.length - 1}
                      onClick={() => {
                        soundManager.playPop();
                        setSlideshowIndex((i) => Math.min(filteredCards.length - 1, i + 1));
                      }}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:pointer-events-none rounded-2xl text-sm font-bold text-white transition-all cursor-pointer shadow-md"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => handleDownloadSingleCard(card)}
                    className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow"
                  >
                    <Download className="w-4 h-4" />
                    {downloadSuccessId === card.id ? '✓ Downloaded!' : 'Download This Flash Card'}
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* GRID VIEW */}
      {/* ---------------------------------------------------------------- */}
      {viewMode !== 'slideshow' && (
        <>
          {filteredCards.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
              <div className="w-16 h-16 mx-auto bg-slate-100 rounded-full flex items-center justify-center text-2xl">
                🔍
              </div>
              <h3 className="text-lg font-bold text-slate-800">No flash cards match your search</h3>
              <p className="text-sm text-slate-500">
                Try searching for something else or switch to another category.
              </p>
              <button
                onClick={() => {
                  setSelectedCategoryId('all');
                  setSearchQuery('');
                }}
                className="px-4 py-2 bg-amber-500 text-white text-xs font-bold rounded-xl hover:bg-amber-600 cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5 print:hidden">
              {filteredCards.map((card, idx) => {
                return (
                  <motion.div
                    key={card.id}
                    data-card-id={card.id}
                    layout
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="bg-white rounded-2xl border-2 border-slate-200/90 hover:border-amber-400 p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group relative overflow-hidden cursor-pointer"
                    onClick={() => {
                      soundManager.playPop();
                      setActiveCardIndex(idx);
                    }}
                  >
                    {/* Header line inside card */}
                    <div className="flex items-center justify-between gap-1 mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md truncate max-w-[80px]">
                        {getCategoryName(card.categoryId)}
                      </span>
                      {card.phonics && (
                        <span className="text-xs font-black text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                          {card.phonics}
                        </span>
                      )}
                    </div>

                    {/* SVG Visual */}
                    <div className="py-3 flex items-center justify-center transition-transform group-hover:scale-105">
                      <FlashCard2DSvg type={card.svgType} size={90} />
                    </div>

                    {/* Card Title & Word */}
                    <div className="text-center pt-2 border-t border-slate-100">
                      <h4 className="text-base sm:text-lg font-black text-slate-800 tracking-tight">
                        {card.word}
                      </h4>
                      {card.subtext && (
                        <p className="text-[11px] font-semibold text-slate-400 mt-0.5 truncate">
                          {card.subtext}
                        </p>
                      )}
                    </div>

                    {/* Quick action buttons: View & Download */}
                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          soundManager.playPop();
                          setActiveCardIndex(idx);
                        }}
                        className="flex-1 py-1.5 px-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-amber-100 hover:text-amber-900 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                        title="View Card details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadSingleCard(card);
                        }}
                        className="py-1.5 px-2.5 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                        title="Download Flash Card"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{downloadSuccessId === card.id ? '✓' : 'Get'}</span>
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* EXPANDED CARD MODAL WITH PREVIOUS / NEXT BROWSING */}
      {/* ---------------------------------------------------------------- */}
      <AnimatePresence>
        {activeCard && activeCardIndex !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm print:hidden">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border-4 border-amber-300 max-w-lg w-full p-6 sm:p-8 shadow-2xl relative space-y-5"
            >
              <button
                onClick={() => {
                  soundManager.playPop();
                  setActiveCardIndex(null);
                }}
                className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Navigation Indicator */}
              <div className="flex items-center justify-between pr-8">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
                    {getCategoryName(activeCard.categoryId)}
                  </span>
                  {activeCard.phonics && (
                    <span className="text-xs font-black text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
                      Phonics: {activeCard.phonics}
                    </span>
                  )}
                </div>
                <span className="text-xs font-bold text-slate-400">
                  {activeCardIndex + 1} / {filteredCards.length}
                </span>
              </div>

              {/* Large Vector Illustration */}
              <div id="modal-card-svg" className="flex items-center justify-center py-5 bg-slate-50/80 rounded-2xl border border-slate-100">
                <FlashCard2DSvg type={activeCard.svgType} size={150} />
              </div>

              {/* Word & Subtitle */}
              <div className="text-center space-y-1">
                <h3 className="text-3xl sm:text-4xl font-black text-slate-900">{activeCard.word}</h3>
                {activeCard.subtext && (
                  <p className="text-sm font-semibold text-slate-500">{activeCard.subtext}</p>
                )}
              </div>

              {/* Teacher Prompt Box */}
              {activeCard.prompt && (
                <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200/80 space-y-1">
                  <div className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
                    Teacher Interaction & Discussion Prompt
                  </div>
                  <p className="text-xs text-amber-800 leading-relaxed font-medium">
                    "{activeCard.prompt}"
                  </p>
                </div>
              )}

              {/* Action & Navigation Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                {/* Previous & Next */}
                <div className="flex items-center gap-2">
                  <button
                    disabled={activeCardIndex === 0}
                    onClick={() => {
                      soundManager.playPop();
                      setActiveCardIndex((i) => (i !== null ? Math.max(0, i - 1) : 0));
                    }}
                    className="p-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:pointer-events-none text-slate-700 rounded-xl font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Prev
                  </button>
                  <button
                    disabled={activeCardIndex >= filteredCards.length - 1}
                    onClick={() => {
                      soundManager.playPop();
                      setActiveCardIndex((i) => (i !== null ? Math.min(filteredCards.length - 1, i + 1) : 0));
                    }}
                    className="p-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:pointer-events-none text-slate-700 rounded-xl font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Download Card Button */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDownloadSingleCard(activeCard)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    {downloadSuccessId === activeCard.id ? '✓ Downloaded!' : 'Download Card'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ---------------------------------------------------------------- */}
      {/* DEDICATED PRINT SHEET LAYOUT (HIDDEN ON SCREEN, VISIBLE ON PRINT) */}
      {/* ---------------------------------------------------------------- */}
      <div className="hidden print:block space-y-6">
        <div className="text-center pb-4 border-b-2 border-black">
          <h1 className="text-2xl font-bold uppercase tracking-wide">
            Preschool 2D Flash Cards — {selectedCategoryId === 'all' ? 'All Sets' : getCategoryName(selectedCategoryId).toUpperCase()}
          </h1>
          <p className="text-xs text-gray-600 mt-1">
            Cut along the dashed guidelines. Designed for preschool vocabulary and visual recognition.
          </p>
        </div>

        {/* 4 Flash Cards per printed page */}
        <div className="grid grid-cols-2 gap-4">
          {filteredCards.map((card) => (
            <div
              key={card.id}
              className="border-2 border-dashed border-gray-400 rounded-2xl p-6 flex flex-col items-center justify-between text-center min-h-[300px] break-inside-avoid"
            >
              <div className="w-full flex justify-between text-xs font-bold uppercase text-gray-500 pb-2 border-b border-gray-200">
                <span>{getCategoryName(card.categoryId)}</span>
                {card.phonics && <span>{card.phonics}</span>}
              </div>

              <div className="py-4">
                <FlashCard2DSvg type={card.svgType} size={110} />
              </div>

              <div className="pt-2">
                <h3 className="text-2xl font-black text-black tracking-tight">{card.word}</h3>
                {card.subtext && (
                  <p className="text-xs font-medium text-gray-600 mt-0.5">{card.subtext}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
