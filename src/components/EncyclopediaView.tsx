import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Search,
  X,
  Check,
  LayoutGrid,
  Layers,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Map,
  Target,
} from 'lucide-react';
import { HSK1_WORDS, UNITS, HskWord, stripPinyinTones } from '../data/hsk1Data';
import { SpeakButton } from './SpeakButton';
import { UiLang } from './TopBar';
import { audioEngine } from '../utils/audioEngine';
import { sfx } from '../utils/sfxEngine';

interface EncyclopediaViewProps {
  lang: UiLang;
  showPinyin: boolean;
  masteredIds: Set<string>;
  onToggleMastered: (wordId: string) => void;
  activeAudioKey: string | null;
  selectedUnit: number;
  onSelectUnit: (unitId: number) => void;
  onQuizUnit: (unitId: number) => void;
}

type MasteryFilter = 'all' | 'todo' | 'mastered';
type ViewMode = 'grid' | 'flashcards';

export const EncyclopediaView: React.FC<EncyclopediaViewProps> = ({
  lang,
  showPinyin,
  masteredIds,
  onToggleMastered,
  activeAudioKey,
  selectedUnit,
  onSelectUnit,
  onQuizUnit,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [masteryFilter, setMasteryFilter] = useState<MasteryFilter>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showUnitsMap, setShowUnitsMap] = useState(false);
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const currentUnit = UNITS.find((u) => u.id === selectedUnit) || UNITS[0];

  // Strictly keep each Unit separate! Only search globally if searchQuery is typed.
  const unitAllWords = useMemo(
    () => HSK1_WORDS.filter((w) => w.u === currentUnit.id),
    [currentUnit.id]
  );

  const unitMasteredCount = useMemo(
    () => unitAllWords.filter((w) => masteredIds.has(w.id)).length,
    [unitAllWords, masteredIds]
  );

  const displayedWords = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const qPlain = stripPinyinTones(q).replace(/\s+/g, '');

    if (q) {
      return HSK1_WORDS.filter((w) => {
        const pPlain = stripPinyinTones(w.p).replace(/\s+/g, '');
        return (
          w.h.includes(q) ||
          w.p.toLowerCase().includes(q) ||
          pPlain.includes(qPlain) ||
          w.en.toLowerCase().includes(q) ||
          w.ar.includes(q)
        );
      });
    }

    return unitAllWords.filter((w) => {
      const isMastered = masteredIds.has(w.id);
      if (masteryFilter === 'mastered' && !isMastered) return false;
      if (masteryFilter === 'todo' && isMastered) return false;
      return true;
    });
  }, [searchQuery, unitAllWords, masteryFilter, masteredIds]);

  const safeIndex =
    displayedWords.length > 0 ? Math.min(cardIndex, displayedWords.length - 1) : 0;
  const currentCard: HskWord | undefined = displayedWords[safeIndex];

  useEffect(() => {
    setCardIndex(0);
    setIsFlipped(false);
  }, [selectedUnit, masteryFilter, searchQuery]);

  // Preload current + next flashcard audio
  useEffect(() => {
    if (viewMode === 'flashcards' && displayedWords.length > 0) {
      const cur = displayedWords[safeIndex];
      const next = displayedWords[(safeIndex + 1) % displayedWords.length];
      if (cur) audioEngine.preload(cur.h);
      if (next) audioEngine.preload(next.h);
    }
  }, [viewMode, safeIndex, displayedWords]);

  const goPrevCard = useCallback(() => {
    if (displayedWords.length === 0) return;
    sfx.play('click');
    setIsFlipped(false);
    setCardIndex((prev) => (prev - 1 + displayedWords.length) % displayedWords.length);
  }, [displayedWords.length]);

  const goNextCard = useCallback(() => {
    if (displayedWords.length === 0) return;
    sfx.play('click');
    setIsFlipped(false);
    setCardIndex((prev) => (prev + 1) % displayedWords.length);
  }, [displayedWords.length]);

  const toggleFlip = useCallback(() => {
    sfx.play('flip');
    setIsFlipped((prev) => !prev);
  }, []);

  useEffect(() => {
    if (viewMode !== 'flashcards' || !currentCard) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === 'Space') {
        e.preventDefault();
        toggleFlip();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        goNextCard();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        goPrevCard();
      } else if (e.key.toLowerCase() === 'a') {
        audioEngine.speak(currentCard.h, { pinyin: currentCard.p, key: `fc-${currentCard.id}` });
      } else if (e.key.toLowerCase() === 'm') {
        onToggleMastered(currentCard.id);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [viewMode, currentCard, toggleFlip, goNextCard, goPrevCard, onToggleMastered]);

  const unitPct =
    unitAllWords.length > 0 ? Math.round((unitMasteredCount / unitAllWords.length) * 100) : 0;

  return (
    <div className="space-y-6 animate-settle" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Unit Selector & Roadmap Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5">
        {/* Top Row: Active Unit Info + Map Button + Quiz This Unit */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-red-700 dark:text-red-400">
              <span>
                {lang === 'ar' ? `وحدة مستقلة ${currentUnit.id} من ١٢` : `Unit ${currentUnit.id} of 12`}
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-mono-tabular">
                {unitAllWords.length} {lang === 'ar' ? 'كلمة' : 'words'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
              {lang === 'ar' ? currentUnit.titleAr : currentUnit.titleEn}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {lang === 'ar' ? currentUnit.descAr : currentUnit.descEn}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => {
                sfx.play('click');
                setShowUnitsMap((prev) => !prev);
              }}
              className={`min-h-[40px] px-4 py-2 rounded-xl border text-xs font-semibold inline-flex items-center gap-2 cursor-pointer transition-colors ${
                showUnitsMap
                  ? 'bg-slate-900 text-white border-slate-900 dark:bg-slate-100 dark:text-slate-900'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:bg-slate-100'
              }`}
            >
              <Map className="w-4 h-4" aria-hidden="true" />
              <span>{lang === 'ar' ? 'خريطة الـ ١٢ وحدة' : 'All 12 Units Map'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                sfx.play('tab');
                onQuizUnit(currentUnit.id);
              }}
              className="min-h-[40px] px-4 py-2 rounded-xl bg-red-700 hover:bg-red-800 text-white text-xs font-semibold inline-flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Target className="w-4 h-4" aria-hidden="true" />
              <span>
                {lang === 'ar'
                  ? `اختبر نفسك في الوحدة ${currentUnit.id}`
                  : `Quiz Unit ${currentUnit.id}`}
              </span>
            </button>
          </div>
        </div>

        {/* Unit Mastery Progress */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 font-mono-tabular">
            <span>
              {lang === 'ar'
                ? `إتقان الوحدة ${currentUnit.id}`
                : `Unit ${currentUnit.id} Mastery`}
            </span>
            <span className="text-teal-700 dark:text-teal-400">
              {unitMasteredCount} / {unitAllWords.length} ({unitPct}%)
            </span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-teal-600 transition-all duration-300 rounded-full"
              style={{ width: `${unitPct}%` }}
            />
          </div>
        </div>

        {/* 12 Separate Unit Tabs (NO "All Units" mixed dump) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {UNITS.map((u) => {
            const count = HSK1_WORDS.filter((w) => w.u === u.id).length;
            const active = selectedUnit === u.id && !searchQuery;
            return (
              <button
                key={u.id}
                type="button"
                onClick={() => {
                  sfx.play('click');
                  setSearchQuery('');
                  setShowUnitsMap(false);
                  onSelectUnit(u.id);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                  active
                    ? 'bg-slate-900 text-white dark:bg-red-700'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {lang === 'ar' ? `الوحدة ${u.id} (${count})` : `Unit ${u.id} (${count})`}
              </button>
            );
          })}
        </div>

        {/* Collapsible 12-Unit Roadmap Grid */}
        {showUnitsMap && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-4 border-t border-slate-200 dark:border-slate-800 animate-settle">
            {UNITS.map((u) => {
              const words = HSK1_WORDS.filter((w) => w.u === u.id);
              const done = words.filter((w) => masteredIds.has(w.id)).length;
              const p = Math.round((done / words.length) * 100);
              const isSelected = u.id === currentUnit.id;
              return (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => {
                    sfx.play('tab');
                    setSearchQuery('');
                    setShowUnitsMap(false);
                    onSelectUnit(u.id);
                  }}
                  className={`p-4 rounded-xl border text-left transition-colors cursor-pointer space-y-2 ${
                    isSelected
                      ? 'border-red-600 bg-red-50/50 dark:bg-red-950/30'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:border-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 text-xs font-mono-tabular">
                    <span className="font-bold text-red-700 dark:text-red-400">
                      {lang === 'ar' ? `الوحدة ${u.id}` : `Unit ${u.id}`}
                    </span>
                    <span className="text-teal-700 dark:text-teal-400 font-semibold">
                      {done}/{words.length} ({p}%)
                    </span>
                  </div>
                  <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {lang === 'ar' ? u.titleAr.replace(/^الوحدة\s*\d+:\s*/, '') : u.titleEn.replace(/^Unit\s*\d+:\s*/, '')}
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div className="h-full bg-teal-600 rounded-full" style={{ width: `${p}%` }} />
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Search + Filter + View Mode Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="relative flex-1 max-w-md">
            <Search
              className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 ${
                lang === 'ar' ? 'right-3.5' : 'left-3.5'
              }`}
              aria-hidden="true"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                lang === 'ar'
                  ? 'ابحث في كل المنهج (صيني / بينيين / عربي)...'
                  : 'Search across HSK 1 (汉字 / pinyin / English)...'
              }
              className={`w-full min-h-[40px] py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-red-600 ${
                lang === 'ar' ? 'pr-10 pl-9' : 'pl-10 pr-9'
              }`}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  sfx.play('click');
                  setSearchQuery('');
                }}
                aria-label="Clear search"
                className={`absolute top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 cursor-pointer ${
                  lang === 'ar' ? 'left-2.5' : 'right-2.5'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {!searchQuery && (
              <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                {(['all', 'todo', 'mastered'] as MasteryFilter[]).map((f) => {
                  const label =
                    f === 'all'
                      ? lang === 'ar' ? 'كل كلمات الوحدة' : 'All in Unit'
                      : f === 'todo'
                        ? lang === 'ar' ? 'قيد الحفظ' : 'To Learn'
                        : lang === 'ar' ? 'المتقنة' : 'Mastered';
                  return (
                    <button
                      key={f}
                      type="button"
                      onClick={() => {
                        sfx.play('click');
                        setMasteryFilter(f);
                      }}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                        masteryFilter === f
                          ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            )}

            <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
              <button
                type="button"
                onClick={() => {
                  sfx.play('click');
                  setViewMode('grid');
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{lang === 'ar' ? 'بطاقات الوحدة' : 'Cards'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  sfx.play('flip');
                  setViewMode('flashcards');
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-colors ${
                  viewMode === 'flashcards'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <Layers className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{lang === 'ar' ? 'مراجعة تفاعلية' : 'Flashcards'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search Notice when searching across units */}
      {searchQuery && (
        <div className="flex items-center justify-between px-1 text-xs text-slate-600 dark:text-slate-400">
          <span>
            {lang === 'ar'
              ? `نتائج البحث في كامل المنهج: ${displayedWords.length} كلمة`
              : `Search results across all units: ${displayedWords.length} matches`}
          </span>
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="text-red-700 dark:text-red-400 font-semibold hover:underline cursor-pointer"
          >
            {lang === 'ar' ? `العودة إلى الوحدة ${currentUnit.id}` : `Back to Unit ${currentUnit.id}`}
          </button>
        </div>
      )}

      {/* Empty State */}
      {displayedWords.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center space-y-3">
          <p className="text-base font-bold text-slate-900 dark:text-slate-100">
            {lang === 'ar' ? 'لا توجد كلمات في هذا التصنيف' : 'No matching words in this filter'}
          </p>
          <button
            type="button"
            onClick={() => {
              sfx.play('click');
              setSearchQuery('');
              setMasteryFilter('all');
            }}
            className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold cursor-pointer"
          >
            {lang === 'ar' ? 'عرض جميع كلمات الوحدة' : 'Show All Words in Unit'}
          </button>
        </div>
      ) : viewMode === 'flashcards' && currentCard ? (
        /* FLASHCARD FOCUS MODE */
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono-tabular px-1">
            <span>
              {lang === 'ar'
                ? `البطاقة ${safeIndex + 1} من ${displayedWords.length}`
                : `Card ${safeIndex + 1} of ${displayedWords.length}`}
            </span>
            <span className="hidden sm:inline">
              {lang === 'ar'
                ? 'اختصارات: مسافة للقلب · A للصوت · M للإتقان'
                : 'Shortcuts: Space flip · A audio · M master · Arrows navigate'}
            </span>
          </div>

          <div
            onClick={toggleFlip}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter') toggleFlip();
            }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-10 min-h-[340px] flex flex-col justify-between cursor-pointer select-none shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                <span>
                  {lang === 'ar' ? `الوحدة ${currentCard.u}` : `Unit ${currentCard.u}`}
                </span>
                <span aria-hidden="true" className="mx-1.5">·</span>
                <span>{lang === 'ar' ? currentCard.posAr : currentCard.posEn}</span>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleMastered(currentCard.id);
                }}
                className={`min-h-[34px] px-3 py-1 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer transition-colors ${
                  masteredIds.has(currentCard.id)
                    ? 'bg-teal-700 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-teal-50 dark:hover:bg-teal-950'
                }`}
              >
                <Check className="w-3.5 h-3.5" aria-hidden="true" />
                <span>
                  {masteredIds.has(currentCard.id)
                    ? lang === 'ar' ? 'تم الإتقان' : 'Mastered'
                    : lang === 'ar' ? 'تحديد كمتقنة' : 'Mark Mastered'}
                </span>
              </button>
            </div>

            {!isFlipped ? (
              <div className="py-8 text-center space-y-4">
                <div className="text-6xl sm:text-7xl font-bold font-hanzi text-slate-900 dark:text-slate-50">
                  {currentCard.h}
                </div>
                {showPinyin && (
                  <div className="text-xl font-mono-tabular font-semibold text-red-700 dark:text-red-400">
                    {currentCard.p}
                  </div>
                )}
                <div className="pt-2 flex justify-center">
                  <SpeakButton
                    text={currentCard.h}
                    pinyin={currentCard.p}
                    playKey={`fc-${currentCard.id}`}
                    activeKey={activeAudioKey}
                    size="lg"
                    label={lang === 'ar' ? 'استماع للنطق' : 'Listen'}
                  />
                </div>
              </div>
            ) : (
              <div className="py-4 space-y-5 animate-settle">
                <div className="flex items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div>
                    <div className="text-3xl font-bold font-hanzi text-slate-900 dark:text-slate-100">
                      {currentCard.h}{' '}
                      <span className="text-lg font-mono-tabular text-red-700 dark:text-red-400 font-semibold">
                        {currentCard.p}
                      </span>
                    </div>
                    <div className="text-xl font-bold text-teal-700 dark:text-teal-400 mt-1.5">
                      {lang === 'ar' ? currentCard.ar : currentCard.en}
                    </div>
                  </div>
                  <SpeakButton
                    text={currentCard.h}
                    pinyin={currentCard.p}
                    playKey={`fc-back-${currentCard.id}`}
                    activeKey={activeAudioKey}
                  />
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  <strong className="text-slate-900 dark:text-slate-100">
                    {lang === 'ar' ? 'تلميح التذكر: ' : 'Memory Hook: '}
                  </strong>
                  {lang === 'ar' ? currentCard.hookAr : currentCard.hookEn}
                </p>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="text-base font-bold font-hanzi text-slate-900 dark:text-slate-100">
                      {currentCard.exH}
                    </div>
                    {showPinyin && (
                      <div className="text-xs font-mono-tabular text-red-700 dark:text-red-400">
                        {currentCard.exP}
                      </div>
                    )}
                    <div className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      {lang === 'ar' ? currentCard.exAr : currentCard.exEn}
                    </div>
                  </div>
                  <SpeakButton
                    text={currentCard.exH}
                    pinyin={currentCard.exP}
                    playKey={`fc-ex-${currentCard.id}`}
                    activeKey={activeAudioKey}
                    size="sm"
                    variant="subtle"
                    label={lang === 'ar' ? 'مثال' : 'Example'}
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-center gap-2 text-xs text-slate-400 pt-2">
              <RotateCw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>
                {isFlipped
                  ? lang === 'ar' ? 'اضغط للعودة للوجه الأمامي' : 'Click card to show front'
                  : lang === 'ar' ? 'اضغط على البطاقة لإظهار المعنى والمثال' : 'Click card to reveal meaning & example'}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={goPrevCard}
              className="min-h-[44px] px-5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-semibold text-slate-800 dark:text-slate-100 inline-flex items-center gap-2 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{lang === 'ar' ? 'السابق' : 'Previous'}</span>
            </button>
            <button
              type="button"
              onClick={toggleFlip}
              className="min-h-[44px] px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-sm font-semibold cursor-pointer"
            >
              {lang === 'ar' ? 'اقلب البطاقة' : 'Flip Card'}
            </button>
            <button
              type="button"
              onClick={goNextCard}
              className="min-h-[44px] px-5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-semibold text-slate-800 dark:text-slate-100 inline-flex items-center gap-2 cursor-pointer"
            >
              <span>{lang === 'ar' ? 'التالي' : 'Next'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* SINGLE-LANGUAGE UNIT CARDS GRID */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedWords.map((w) => {
            const mastered = masteredIds.has(w.id);
            return (
              <article
                key={w.id}
                className={`bg-white dark:bg-slate-900 rounded-2xl p-5 flex flex-col justify-between border transition-colors ${
                  mastered
                    ? 'border-teal-500/70 dark:border-teal-600/70'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      <span>{lang === 'ar' ? `الوحدة ${w.u}` : `Unit ${w.u}`}</span>
                      <span aria-hidden="true" className="mx-1.5">·</span>
                      <span>{lang === 'ar' ? w.posAr : w.posEn}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onToggleMastered(w.id)}
                      className={`min-h-[32px] px-2.5 py-1 rounded-lg text-xs font-semibold inline-flex items-center gap-1 cursor-pointer transition-colors ${
                        mastered
                          ? 'bg-teal-700 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-teal-50 dark:hover:bg-teal-950 hover:text-teal-700 dark:hover:text-teal-400'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>
                        {mastered
                          ? lang === 'ar' ? 'متقنة' : 'Mastered'
                          : lang === 'ar' ? 'إتقان' : 'Master'}
                      </span>
                    </button>
                  </div>

                  {/* Hanzi + Pinyin + Audio */}
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-3xl sm:text-4xl font-bold font-hanzi text-slate-900 dark:text-slate-50">
                        {w.h}
                      </div>
                      {showPinyin && (
                        <div className="text-sm font-mono-tabular font-semibold text-red-700 dark:text-red-400 mt-1">
                          {w.p}
                        </div>
                      )}
                    </div>
                    <SpeakButton
                      text={w.h}
                      pinyin={w.p}
                      playKey={`w-${w.id}`}
                      activeKey={activeAudioKey}
                    />
                  </div>

                  {/* Selected Learning Language Meaning ONLY */}
                  <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <div className="font-bold text-base text-slate-900 dark:text-slate-100">
                      {lang === 'ar' ? w.ar : w.en}
                    </div>
                  </div>

                  {/* Selected Learning Language Memory Hook ONLY */}
                  <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {lang === 'ar' ? w.hookAr : w.hookEn}
                  </p>
                </div>

                {/* Example Sentence in Selected Language ONLY */}
                <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-sm font-bold font-hanzi text-slate-900 dark:text-slate-100">
                        {w.exH}
                      </div>
                      {showPinyin && (
                        <div className="text-xs font-mono-tabular text-red-700 dark:text-red-400">
                          {w.exP}
                        </div>
                      )}
                    </div>
                    <SpeakButton
                      text={w.exH}
                      pinyin={w.exP}
                      playKey={`ex-${w.id}`}
                      activeKey={activeAudioKey}
                      size="sm"
                      variant="subtle"
                      label={lang === 'ar' ? 'مثال' : 'Ex'}
                    />
                  </div>
                  <div className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    {lang === 'ar' ? w.exAr : w.exEn}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Prev / Next Unit Navigation Footer */}
      {!searchQuery && (
        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            type="button"
            disabled={currentUnit.id <= 1}
            onClick={() => {
              sfx.play('tab');
              onSelectUnit(currentUnit.id - 1);
            }}
            className="min-h-[42px] px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed inline-flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>
              {lang === 'ar'
                ? `الوحدة السابقة (${Math.max(1, currentUnit.id - 1)})`
                : `Previous Unit (${Math.max(1, currentUnit.id - 1)})`}
            </span>
          </button>

          <button
            type="button"
            disabled={currentUnit.id >= UNITS.length}
            onClick={() => {
              sfx.play('tab');
              onSelectUnit(currentUnit.id + 1);
            }}
            className="min-h-[42px] px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed inline-flex items-center gap-2"
          >
            <span>
              {lang === 'ar'
                ? `الوحدة التالية (${Math.min(UNITS.length, currentUnit.id + 1)})`
                : `Next Unit (${Math.min(UNITS.length, currentUnit.id + 1)})`}
            </span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
