import React, { useMemo, useState } from 'react';
import {
  CheckCircle2,
  Clock,
  CircleDashed,
  BookOpen,
  Target,
  ArrowUpDown,
  Check,
  TrendingUp,
} from 'lucide-react';
import { HSK1_WORDS, UNITS, HskWord } from '../data/hsk1Data';
import { UiLang } from './TopBar';
import { SpeakButton } from './SpeakButton';
import { sfx } from '../utils/sfxEngine';

interface ProgressDashboardViewProps {
  lang: UiLang;
  showPinyin: boolean;
  masteredIds: Set<string>;
  onToggleMastered: (wordId: string) => void;
  activeAudioKey: string | null;
  onOpenUnit: (unitId: number) => void;
  onQuizUnit: (unitId: number) => void;
}

type StatusFilter = 'all' | 'in_progress' | 'completed' | 'not_started';
type SortOrder = 'unit' | 'lowest' | 'highest';

interface UnitStat {
  id: number;
  titleEn: string;
  titleAr: string;
  descEn: string;
  descAr: string;
  words: HskWord[];
  total: number;
  mastered: number;
  remaining: number;
  pct: number;
  status: 'completed' | 'in_progress' | 'not_started';
}

interface DonutChartProps {
  mastered: number;
  total: number;
  size?: number;
  strokeWidth?: number;
  accentTone?: 'teal' | 'amber' | 'slate';
  labelText?: string;
}

const DonutChart: React.FC<DonutChartProps> = ({
  mastered,
  total,
  size = 128,
  strokeWidth = 12,
  accentTone = 'teal',
  labelText,
}) => {
  const pct = total > 0 ? Math.round((mastered / total) * 100) : 0;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference - (pct / 100) * circumference;
  const center = size / 2;

  const arcColorClass =
    accentTone === 'amber'
      ? 'stroke-amber-600 dark:stroke-amber-400'
      : accentTone === 'slate'
        ? 'stroke-slate-400 dark:stroke-slate-600'
        : 'stroke-teal-600 dark:stroke-teal-400';

  return (
    <div
      className="relative inline-flex items-center justify-center shrink-0"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
        role="img"
        aria-label={`${pct}% (${mastered} / ${total})`}
      >
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className="stroke-slate-200 dark:stroke-slate-800"
        />
        {pct > 0 && (
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={progressOffset}
            strokeLinecap="round"
            className={`${arcColorClass} transition-[stroke-dashoffset] duration-500 ease-out`}
          />
        )}
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
        <span className="text-xl sm:text-2xl font-bold font-mono-tabular text-slate-900 dark:text-slate-100 leading-none">
          {pct}%
        </span>
        <span className="text-[11px] font-semibold font-mono-tabular text-slate-500 dark:text-slate-400 mt-1">
          {labelText ?? `${mastered}/${total}`}
        </span>
      </div>
    </div>
  );
};

export const ProgressDashboardView: React.FC<ProgressDashboardViewProps> = ({
  lang,
  showPinyin,
  masteredIds,
  onToggleMastered,
  activeAudioKey,
  onOpenUnit,
  onQuizUnit,
}) => {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('unit');
  const [inspectedUnitId, setInspectedUnitId] = useState<number>(1);

  const unitStats: UnitStat[] = useMemo(() => {
    return UNITS.map((u) => {
      const words = HSK1_WORDS.filter((w) => w.u === u.id);
      const total = words.length;
      const mastered = words.filter((w) => masteredIds.has(w.id)).length;
      const remaining = total - mastered;
      const pct = total > 0 ? Math.round((mastered / total) * 100) : 0;
      const status: UnitStat['status'] =
        mastered === total && total > 0
          ? 'completed'
          : mastered > 0
            ? 'in_progress'
            : 'not_started';

      return {
        ...u,
        words,
        total,
        mastered,
        remaining,
        pct,
        status,
      };
    });
  }, [masteredIds]);

  const totals = useMemo(() => {
    const totalWords = HSK1_WORDS.length;
    const masteredWords = unitStats.reduce((sum, u) => sum + u.mastered, 0);
    const remainingWords = totalWords - masteredWords;
    const completedUnits = unitStats.filter((u) => u.status === 'completed').length;
    const inProgressUnits = unitStats.filter((u) => u.status === 'in_progress').length;
    const notStartedUnits = unitStats.filter((u) => u.status === 'not_started').length;

    const nextStudyUnit =
      unitStats.find((u) => u.status === 'in_progress') ||
      unitStats.find((u) => u.status === 'not_started') ||
      unitStats[0];

    const weakestUnit = [...unitStats].sort((a, b) => a.pct - b.pct || a.id - b.id)[0];

    return {
      totalWords,
      masteredWords,
      remainingWords,
      completedUnits,
      inProgressUnits,
      notStartedUnits,
      nextStudyUnit,
      weakestUnit,
    };
  }, [unitStats]);

  const filteredUnits = useMemo(() => {
    const list = unitStats.filter((u) => {
      if (statusFilter === 'all') return true;
      return u.status === statusFilter;
    });

    if (sortOrder === 'lowest') {
      return [...list].sort((a, b) => a.pct - b.pct || a.id - b.id);
    }
    if (sortOrder === 'highest') {
      return [...list].sort((a, b) => b.pct - a.pct || a.id - b.id);
    }
    return list;
  }, [unitStats, statusFilter, sortOrder]);

  const inspectedUnit =
    unitStats.find((u) => u.id === inspectedUnitId) || unitStats[0];

  const getStatusLabel = (status: UnitStat['status']) => {
    if (status === 'completed') {
      return {
        text: lang === 'ar' ? 'مكتملة' : 'Completed',
        cls: 'text-teal-700 dark:text-teal-400',
        Icon: CheckCircle2,
      };
    }
    if (status === 'in_progress') {
      return {
        text: lang === 'ar' ? 'قيد التعلّم' : 'In Progress',
        cls: 'text-amber-700 dark:text-amber-400',
        Icon: Clock,
      };
    }
    return {
      text: lang === 'ar' ? 'لم تبدأ بعد' : 'Not Started',
      cls: 'text-slate-500 dark:text-slate-400',
      Icon: CircleDashed,
    };
  };

  return (
    <div className="space-y-6 animate-settle" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Hero Overview: Master HSK 1 Donut + Key Completion Summary */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          {/* Left/Primary: Overall Donut & Explanation */}
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <DonutChart
              mastered={totals.masteredWords}
              total={totals.totalWords}
              size={156}
              strokeWidth={14}
              accentTone="teal"
              labelText={`${totals.masteredWords} / ${totals.totalWords}`}
            />

            <div className="space-y-3 text-center sm:text-start">
              <div className="text-xs font-semibold text-red-700 dark:text-red-400 flex items-center justify-center sm:justify-start gap-1.5">
                <TrendingUp className="w-4 h-4" aria-hidden="true" />
                <span>
                  {lang === 'ar'
                    ? 'لوحة متابعة التقدم في HSK 1'
                    : 'HSK 1 Completion Overview'}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
                {lang === 'ar'
                  ? 'نسبة إتقانك للمستوى الأول'
                  : 'Your Level 1 Mastery Progress'}
              </h1>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-mono-tabular">
                <span className="inline-flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm bg-teal-600 dark:bg-teal-400" aria-hidden="true" />
                  <span>
                    {lang === 'ar' ? 'المتقنة:' : 'Mastered:'}{' '}
                    <strong className="text-slate-900 dark:text-slate-100">
                      {totals.masteredWords}
                    </strong>
                  </span>
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm bg-slate-200 dark:bg-slate-700" aria-hidden="true" />
                  <span>
                    {lang === 'ar' ? 'المتبقية:' : 'Remaining:'}{' '}
                    <strong className="text-slate-900 dark:text-slate-100">
                      {totals.remainingWords}
                    </strong>
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Right: Unit Milestone Breakdown + Recommended Actions */}
          <div className="flex flex-col gap-4 lg:min-w-[340px]">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                <div className="text-xl font-bold font-mono-tabular text-teal-700 dark:text-teal-400">
                  {totals.completedUnits}
                </div>
                <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 mt-0.5">
                  {lang === 'ar' ? 'وحدات مكتملة' : 'Completed'}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                <div className="text-xl font-bold font-mono-tabular text-amber-700 dark:text-amber-400">
                  {totals.inProgressUnits}
                </div>
                <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 mt-0.5">
                  {lang === 'ar' ? 'قيد التعلّم' : 'In Progress'}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                <div className="text-xl font-bold font-mono-tabular text-slate-600 dark:text-slate-300">
                  {totals.notStartedUnits}
                </div>
                <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 mt-0.5">
                  {lang === 'ar' ? 'لم تبدأ' : 'Not Started'}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  sfx.play('tab');
                  onOpenUnit(totals.nextStudyUnit.id);
                }}
                className="flex-1 min-h-[42px] px-4 py-2 rounded-xl bg-red-700 hover:bg-red-800 text-white text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer transition-colors"
              >
                <BookOpen className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>
                  {lang === 'ar'
                    ? `استكمال الوحدة ${totals.nextStudyUnit.id}`
                    : `Continue Unit ${totals.nextStudyUnit.id}`}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sfx.play('tab');
                  onQuizUnit(totals.weakestUnit.id);
                }}
                className="flex-1 min-h-[42px] px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer transition-colors"
              >
                <Target className="w-4 h-4 shrink-0 text-red-700 dark:text-red-400" aria-hidden="true" />
                <span>
                  {lang === 'ar'
                    ? `اختبار الوحدة ${totals.weakestUnit.id}`
                    : `Quiz Unit ${totals.weakestUnit.id}`}
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Filter & Sort Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div
          role="group"
          aria-label={lang === 'ar' ? 'تصفية الوحدات حسب الحالة' : 'Filter units by status'}
          className="flex flex-wrap items-center gap-1 p-1 bg-slate-200/75 dark:bg-slate-800 rounded-xl w-fit"
        >
          {(
            [
              { id: 'all', en: `All Units (${UNITS.length})`, ar: `كل الوحدات (${UNITS.length})` },
              {
                id: 'in_progress',
                en: `In Progress (${totals.inProgressUnits})`,
                ar: `قيد التعلّم (${totals.inProgressUnits})`,
              },
              {
                id: 'completed',
                en: `Completed (${totals.completedUnits})`,
                ar: `مكتملة (${totals.completedUnits})`,
              },
              {
                id: 'not_started',
                en: `Not Started (${totals.notStartedUnits})`,
                ar: `لم تبدأ (${totals.notStartedUnits})`,
              },
            ] as Array<{ id: StatusFilter; en: string; ar: string }>
          ).map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => {
                sfx.play('click');
                setStatusFilter(f.id);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                statusFilter === f.id
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              {lang === 'ar' ? f.ar : f.en}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-slate-400" aria-hidden="true" />
          <select
            aria-label={lang === 'ar' ? 'ترتيب الوحدات' : 'Sort units'}
            value={sortOrder}
            onChange={(e) => {
              sfx.play('click');
              setSortOrder(e.target.value as SortOrder);
            }}
            className="min-h-[38px] px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-red-600 cursor-pointer"
          >
            <option value="unit">
              {lang === 'ar' ? 'الترتيب: تسلسل الوحدات (١–١٢)' : 'Sort: Unit Order (1–12)'}
            </option>
            <option value="lowest">
              {lang === 'ar' ? 'الترتيب: الأقل إنجازاً أولاً' : 'Sort: Lowest Mastery First'}
            </option>
            <option value="highest">
              {lang === 'ar' ? 'الترتيب: الأعلى إنجازاً أولاً' : 'Sort: Highest Mastery First'}
            </option>
          </select>
        </div>
      </div>

      {/* Individual HSK 1 Unit Donut Charts Grid */}
      {filteredUnits.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-10 text-center space-y-3">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
            {lang === 'ar'
              ? 'لا توجد وحدات مطابقة لهذه الحالة حالياً.'
              : 'No units match this completion filter yet.'}
          </p>
          <button
            type="button"
            onClick={() => {
              sfx.play('click');
              setStatusFilter('all');
            }}
            className="min-h-[40px] px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold cursor-pointer"
          >
            {lang === 'ar' ? 'عرض جميع الوحدات' : 'Show All 12 Units'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredUnits.map((unit) => {
            const statusMeta = getStatusLabel(unit.status);
            const StatusIcon = statusMeta.Icon;
            const isInspected = inspectedUnit.id === unit.id;
            const accentTone =
              unit.status === 'completed'
                ? 'teal'
                : unit.status === 'in_progress'
                  ? 'amber'
                  : 'slate';

            return (
              <article
                key={unit.id}
                className={`bg-white dark:bg-slate-900 rounded-2xl border p-5 flex flex-col justify-between gap-4 transition-colors ${
                  isInspected
                    ? 'border-red-600 dark:border-red-500 ring-1 ring-red-600/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {/* Header: Unboxed Unit # + Status Text with Icon */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2 text-xs font-semibold">
                    <span className="text-slate-500 dark:text-slate-400 font-mono-tabular">
                      {lang === 'ar' ? `الوحدة ${unit.id}` : `Unit ${unit.id}`}
                    </span>
                    <span className={`inline-flex items-center gap-1 ${statusMeta.cls}`}>
                      <StatusIcon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      <span>{statusMeta.text}</span>
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-snug line-clamp-2">
                    {lang === 'ar' ? unit.titleAr : unit.titleEn}
                  </h2>
                </div>

                {/* Donut Chart Centerpiece */}
                <div className="flex flex-col items-center py-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      sfx.play('click');
                      setInspectedUnitId(unit.id);
                    }}
                    title={
                      lang === 'ar'
                        ? 'اضغط لعرض كلمات الوحدة أدناه'
                        : 'Click to inspect words in this unit'
                    }
                    className="rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-600 cursor-pointer"
                  >
                    <DonutChart
                      mastered={unit.mastered}
                      total={unit.total}
                      size={122}
                      strokeWidth={11}
                      accentTone={accentTone}
                    />
                  </button>

                  {/* Explicit Numeric Breakdown */}
                  <div className="flex items-center justify-center gap-3 text-xs text-slate-600 dark:text-slate-400 font-mono-tabular">
                    <span>
                      {lang === 'ar' ? 'متقنة' : 'Mastered'}{' '}
                      <strong className="text-teal-700 dark:text-teal-400">{unit.mastered}</strong>
                    </span>
                    <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">
                      ·
                    </span>
                    <span>
                      {lang === 'ar' ? 'متبقية' : 'Left'}{' '}
                      <strong className="text-slate-800 dark:text-slate-200">{unit.remaining}</strong>
                    </span>
                    <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">
                      ·
                    </span>
                    <span>
                      {lang === 'ar' ? 'الكل' : 'Total'}{' '}
                      <strong className="text-slate-900 dark:text-slate-100">{unit.total}</strong>
                    </span>
                  </div>
                </div>

                {/* Unit Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      sfx.play('tab');
                      onOpenUnit(unit.id);
                    }}
                    className="min-h-[38px] px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors"
                  >
                    {lang === 'ar' ? 'دراسة الوحدة' : 'Study Unit'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      sfx.play('tab');
                      onQuizUnit(unit.id);
                    }}
                    className="min-h-[38px] px-3 py-1.5 rounded-lg bg-red-700 hover:bg-red-800 text-white text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors"
                  >
                    {lang === 'ar' ? 'اختبار' : 'Quiz'}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Interactive Unit Word Checklist (Live updates the Donut Charts above) */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="text-xs font-semibold text-red-700 dark:text-red-400 font-mono-tabular">
              {lang === 'ar'
                ? `تفاصيل الوحدة ${inspectedUnit.id} · ${inspectedUnit.mastered} من ${inspectedUnit.total} كلمة متقنة`
                : `Unit ${inspectedUnit.id} Breakdown · ${inspectedUnit.mastered} of ${inspectedUnit.total} Words Mastered`}
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">
              {lang === 'ar' ? inspectedUnit.titleAr : inspectedUnit.titleEn}
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <select
              aria-label={lang === 'ar' ? 'اختر وحدة للمعاينة' : 'Select unit to inspect'}
              value={inspectedUnit.id}
              onChange={(e) => {
                sfx.play('click');
                setInspectedUnitId(Number(e.target.value));
              }}
              className="min-h-[40px] px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-red-600 cursor-pointer"
            >
              {UNITS.map((u) => (
                <option key={u.id} value={u.id}>
                  {lang === 'ar' ? u.titleAr : u.titleEn}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {inspectedUnit.words.map((word) => {
            const isMastered = masteredIds.has(word.id);
            return (
              <div
                key={word.id}
                className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-colors ${
                  isMastered
                    ? 'bg-teal-50/70 dark:bg-teal-950/30 border-teal-300 dark:border-teal-800'
                    : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold font-hanzi text-slate-900 dark:text-slate-100">
                      {word.h}
                    </span>
                    {showPinyin && (
                      <span className="text-xs font-mono-tabular font-semibold text-red-700 dark:text-red-400 truncate">
                        {word.p}
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate mt-0.5">
                    {lang === 'ar' ? word.ar : word.en}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <SpeakButton
                    text={word.h}
                    pinyin={word.p}
                    playKey={`dash-${word.id}`}
                    activeKey={activeAudioKey}
                    size="sm"
                  />
                  <button
                    type="button"
                    onClick={() => onToggleMastered(word.id)}
                    aria-label={
                      isMastered
                        ? lang === 'ar'
                          ? 'إلغاء علامة الإتقان'
                          : 'Unmark mastered'
                        : lang === 'ar'
                          ? 'تحديد كمتقنة'
                          : 'Mark mastered'
                    }
                    className={`min-h-[34px] px-2.5 py-1 rounded-lg text-xs font-semibold inline-flex items-center gap-1 cursor-pointer transition-colors whitespace-nowrap ${
                      isMastered
                        ? 'bg-teal-700 text-white hover:bg-teal-800'
                        : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-teal-600'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span>
                      {isMastered
                        ? lang === 'ar'
                          ? 'متقنة'
                          : 'Done'
                        : lang === 'ar'
                          ? 'أتقنتها'
                          : 'Master'}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
