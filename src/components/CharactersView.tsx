import React, { useState, useRef, useEffect } from 'react';
import { Eraser, PenTool, Grid } from 'lucide-react';
import { RADICALS_DATA, STROKES_DATA, STROKE_ORDER_RULES, HSK1_WORDS } from '../data/hsk1Data';
import { SpeakButton } from './SpeakButton';
import { UiLang } from './TopBar';
import { sfx } from '../utils/sfxEngine';

interface CharactersViewProps {
  lang: UiLang;
  showPinyin: boolean;
  activeAudioKey: string | null;
}

type CharSubTab = 'radicals' | 'strokes' | 'practice';

const PRACTICE_CHARS = HSK1_WORDS.filter((w) => w.h.length === 1);

export const CharactersView: React.FC<CharactersViewProps> = ({
  lang,
  showPinyin,
  activeAudioKey,
}) => {
  const [subTab, setSubTab] = useState<CharSubTab>('radicals');
  const [practiceIdx, setPracticeIdx] = useState(0);
  const [showGhost, setShowGhost] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);

  const activeWord = PRACTICE_CHARS[practiceIdx] || HSK1_WORDS[0];

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  useEffect(() => {
    clearCanvas();
  }, [practiceIdx, subTab]);

  const getCoords = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * canvas.width,
      y: ((e.clientY - rect.top) / rect.height) * canvas.height,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.setPointerCapture(e.pointerId);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    isDrawingRef.current = true;
    const { x, y } = getCoords(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#C23B2B';
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { x, y } = getCoords(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handlePointerUp = () => {
    isDrawingRef.current = false;
  };

  return (
    <div className="space-y-6 animate-settle" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Sub-Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 p-1.5 bg-slate-200/75 dark:bg-slate-800 rounded-xl">
        <button
          type="button"
          onClick={() => {
            sfx.play('tab');
            setSubTab('radicals');
          }}
          className={`py-2.5 px-4 rounded-lg text-xs sm:text-sm font-semibold cursor-pointer transition-colors ${
            subTab === 'radicals'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300'
          }`}
        >
          {lang === 'ar' ? 'الجذور الأساسية (١٨ جذراً)' : 'Core HSK 1 Radicals (18)'}
        </button>
        <button
          type="button"
          onClick={() => {
            sfx.play('tab');
            setSubTab('strokes');
          }}
          className={`py-2.5 px-4 rounded-lg text-xs sm:text-sm font-semibold cursor-pointer transition-colors ${
            subTab === 'strokes'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300'
          }`}
        >
          {lang === 'ar' ? 'الخطوط الأساسية وقواعد الكتابة' : 'Basic Strokes & Order Rules'}
        </button>
        <button
          type="button"
          onClick={() => {
            sfx.play('tab');
            setSubTab('practice');
          }}
          className={`py-2.5 px-4 rounded-lg text-xs sm:text-sm font-semibold cursor-pointer transition-colors ${
            subTab === 'practice'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300'
          }`}
        >
          {lang === 'ar' ? 'لوحة التدريب على الكتابة' : 'Interactive Writing Canvas'}
        </button>
      </div>

      {subTab === 'radicals' && (
        <div className="space-y-5">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
              {lang === 'ar'
                ? 'أهم الجذور الصينية في مستوى HSK 1'
                : 'Essential HSK 1 Character Radicals (部首)'}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              {lang === 'ar'
                ? 'الجذور هي لبنات بناء الرموز الصينية؛ معرفتها تساعدك على فهم المعنى وحفظ الحروف بسرعة.'
                : 'Radicals are the building blocks of Chinese characters—recognizing them unlocks meaning and speeds up memorization.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {RADICALS_DATA.map((r) => (
              <div
                key={r.radical}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 flex items-center justify-center text-2xl font-bold font-hanzi text-red-700 dark:text-red-400 shrink-0">
                      {r.radical}
                    </div>
                    <div>
                      <div className="text-base font-bold text-slate-900 dark:text-slate-100">
                        {lang === 'ar' ? r.nameAr : r.nameEn}
                      </div>
                      {showPinyin && (
                        <div className="text-xs font-mono-tabular text-slate-500 dark:text-slate-400">
                          {r.pinyin}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  {r.examples.map((ex) => (
                    <div key={ex.h} className="flex items-center justify-between gap-2">
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold font-hanzi text-slate-900 dark:text-slate-100">
                          {ex.h}
                        </span>
                        {showPinyin && (
                          <span className="text-xs font-mono-tabular text-red-700 dark:text-red-400">
                            {ex.p}
                          </span>
                        )}
                        <span className="text-xs text-slate-600 dark:text-slate-400">
                          — {lang === 'ar' ? ex.ar : ex.en}
                        </span>
                      </div>
                      <SpeakButton
                        text={ex.h}
                        pinyin={ex.p}
                        playKey={`rad-${r.radical}-${ex.h}`}
                        activeKey={activeAudioKey}
                        size="sm"
                        variant="subtle"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {subTab === 'strokes' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-5">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {lang === 'ar' ? 'الضربات الثماني الأساسية للكتابة الصينية' : '8 Fundamental Chinese Strokes'}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {lang === 'ar'
                  ? 'كل رمز صيني يتكون من مزيج من هذه الضربات الأساسية.'
                  : 'Every Chinese character is constructed from combinations of these basic strokes.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {STROKES_DATA.map((st) => (
                <div
                  key={st.pinyin}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold font-hanzi text-red-700 dark:text-red-400">
                      {st.symbol}
                    </span>
                    <SpeakButton
                      text={st.sampleH}
                      pinyin={st.sampleP}
                      playKey={`stk-${st.pinyin}`}
                      activeKey={activeAudioKey}
                      size="sm"
                      variant="subtle"
                      label={st.sampleH}
                    />
                  </div>
                  <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {lang === 'ar' ? st.nameAr : st.nameEn}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {lang === 'ar' ? st.tipAr : st.tipEn}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {lang === 'ar' ? 'القواعد الست الذهبية لترتيب الكتابة' : '6 Golden Rules of Stroke Order'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {STROKE_ORDER_RULES.map((rule) => (
                <div
                  key={rule.num}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold font-mono-tabular flex items-center justify-center shrink-0">
                      {rule.num}
                    </span>
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {lang === 'ar' ? rule.ar : rule.en}
                    </span>
                  </div>
                  <span className="text-base font-bold font-hanzi text-red-700 dark:text-red-400 shrink-0">
                    {rule.sample}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {subTab === 'practice' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {lang === 'ar' ? 'لوحة التدريب على رسم الحروف الصينية' : 'Interactive Hanzi Writing Pad'}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {lang === 'ar'
                  ? 'اختر أي حرف من مفردات HSK 1 وتدرّب على كتابته فوق شبكة المربعات الصينية.'
                  : 'Select any single-character HSK 1 word and trace it over the traditional Tianzige grid.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  sfx.play('toggle');
                  setShowGhost((p) => !p);
                }}
                className="min-h-[38px] px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-100 inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Grid className="w-3.5 h-3.5" />
                <span>
                  {lang === 'ar'
                    ? showGhost ? 'إخفاء الحرف الاسترشادي' : 'إظهار الحرف الاسترشادي'
                    : showGhost ? 'Hide Trace Guide' : 'Show Trace Guide'}
                </span>
              </button>
              <button
                type="button"
                onClick={() => {
                  sfx.play('click');
                  clearCanvas();
                }}
                className="min-h-[38px] px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Eraser className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'مسح اللوحة' : 'Clear Pad'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Writing Canvas Stage */}
            <div className="lg:col-span-5 flex flex-col items-center space-y-4">
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 overflow-hidden touch-none select-none">
                {/* Tianzige Guide Lines */}
                <svg
                  viewBox="0 0 100 100"
                  className="absolute inset-0 w-full h-full pointer-events-none opacity-45"
                >
                  <line x1="50" y1="0" x2="50" y2="100" stroke="#94A3B8" strokeDasharray="3 3" strokeWidth="0.6" />
                  <line x1="0" y1="50" x2="100" y2="50" stroke="#94A3B8" strokeDasharray="3 3" strokeWidth="0.6" />
                  <line x1="0" y1="0" x2="100" y2="100" stroke="#CBD5E1" strokeDasharray="2 3" strokeWidth="0.4" />
                  <line x1="100" y1="0" x2="0" y2="100" stroke="#CBD5E1" strokeDasharray="2 3" strokeWidth="0.4" />
                </svg>

                {showGhost && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                    <span className="font-hanzi text-[170px] leading-none text-slate-300/65 dark:text-slate-700/60">
                      {activeWord.h}
                    </span>
                  </div>
                )}

                <canvas
                  ref={canvasRef}
                  width={320}
                  height={320}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerCancel={handlePointerUp}
                  className="relative z-10 w-full h-full cursor-crosshair"
                />
              </div>

              <div className="flex items-center gap-3">
                <div className="text-center">
                  <div className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {activeWord.h}{' '}
                    {showPinyin && (
                      <span className="font-mono-tabular text-red-700 dark:text-red-400">
                        ({activeWord.p})
                      </span>
                    )}
                  </div>
                  <div className="text-sm font-semibold text-teal-700 dark:text-teal-400">
                    {lang === 'ar' ? activeWord.ar : activeWord.en}
                  </div>
                </div>
                <SpeakButton
                  text={activeWord.h}
                  pinyin={activeWord.p}
                  playKey={`pad-${activeWord.id}`}
                  activeKey={activeAudioKey}
                />
              </div>
            </div>

            {/* Character Picker */}
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                <PenTool className="w-3.5 h-3.5 text-red-700 dark:text-red-400" />
                <span>
                  {lang === 'ar'
                    ? `اختر حرفاً للتدريب (${PRACTICE_CHARS.length} حرفاً):`
                    : `Select a character to practice (${PRACTICE_CHARS.length} characters):`}
                </span>
              </div>
              <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-1.5 max-h-72 overflow-y-auto p-1">
                {PRACTICE_CHARS.map((w, idx) => (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => {
                      sfx.play('click');
                      setPracticeIdx(idx);
                    }}
                    className={`h-11 rounded-lg font-hanzi text-lg font-bold border transition-colors cursor-pointer ${
                      idx === practiceIdx
                        ? 'bg-red-700 text-white border-red-700'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 hover:border-red-600'
                    }`}
                  >
                    {w.h}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
