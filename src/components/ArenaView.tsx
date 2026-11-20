import React, { useState, useEffect, useCallback } from 'react';
import { Heart, Flame, CheckCircle2, XCircle, RotateCcw, Award } from 'lucide-react';
import { HSK1_WORDS, UNITS, HskWord } from '../data/hsk1Data';
import { SpeakButton } from './SpeakButton';
import { UiLang } from './TopBar';
import { audioEngine } from '../utils/audioEngine';
import { sfx } from '../utils/sfxEngine';

interface ArenaViewProps {
  lang: UiLang;
  showPinyin: boolean;
  activeAudioKey: string | null;
  autoPlayAudio: boolean;
  onAwardXp: (amount: number, toastMsg?: string) => void;
  selectedUnit: number;
  onSelectUnit: (unitId: number) => void;
}

type ArenaMode = 'listen' | 'hanzi2meaning' | 'meaning2hanzi' | 'mock20';

interface ArenaQuestion {
  target: HskWord;
  options: HskWord[];
  kind: 'listen' | 'hanzi2meaning' | 'meaning2hanzi';
}

function buildQuestion(unitId: number, mode: ArenaMode): ArenaQuestion {
  const pool = unitId === 0 ? HSK1_WORDS : HSK1_WORDS.filter((w) => w.u === unitId);
  const safePool = pool.length >= 4 ? pool : HSK1_WORDS;
  const target = safePool[Math.floor(Math.random() * safePool.length)];
  const distractorSource = pool.length >= 4 ? pool : HSK1_WORDS;
  const distractors = [...distractorSource]
    .filter((w) => w.id !== target.id)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
  const options = [target, ...distractors].sort(() => Math.random() - 0.5);

  let kind: 'listen' | 'hanzi2meaning' | 'meaning2hanzi';
  if (mode === 'mock20') {
    const kinds: Array<'listen' | 'hanzi2meaning' | 'meaning2hanzi'> = [
      'listen',
      'hanzi2meaning',
      'meaning2hanzi',
    ];
    kind = kinds[Math.floor(Math.random() * kinds.length)];
  } else {
    kind = mode;
  }

  return { target, options, kind };
}

export const ArenaView: React.FC<ArenaViewProps> = ({
  lang,
  showPinyin,
  activeAudioKey,
  autoPlayAudio,
  onAwardXp,
  selectedUnit,
  onSelectUnit,
}) => {
  const [mode, setMode] = useState<ArenaMode>('listen');
  const [hearts, setHearts] = useState(3);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [question, setQuestion] = useState<ArenaQuestion>(() =>
    buildQuestion(selectedUnit, 'listen')
  );
  const [answered, setAnswered] = useState(false);
  const [pickedId, setPickedId] = useState<string | null>(null);

  // Mock 20-question exam tracking
  const [mockIndex, setMockIndex] = useState(1);
  const [mockCorrect, setMockCorrect] = useState(0);
  const [mockDone, setMockDone] = useState(false);

  // Sync question when selectedUnit changes externally (e.g. clicking "Quiz Unit X")
  useEffect(() => {
    const q = buildQuestion(selectedUnit, mode);
    setQuestion(q);
    setAnswered(false);
    setPickedId(null);
    setHearts(3);
    setMockIndex(1);
    setMockCorrect(0);
    setMockDone(false);
  }, [selectedUnit, mode]);

  useEffect(() => {
    audioEngine.preload(question.target.h);
  }, [question.target.h]);

  const submitAnswer = useCallback(
    (optId: string) => {
      if (answered || (mode !== 'mock20' && hearts <= 0) || mockDone) return;
      const target = question.target;
      setAnswered(true);
      setPickedId(optId);

      if (autoPlayAudio) {
        audioEngine.speak(target.h, { pinyin: target.p, key: `arena-${target.id}` });
      }

      if (optId === target.id) {
        const nextStreak = streak + 1;
        setStreak(nextStreak);
        if (nextStreak > bestStreak) setBestStreak(nextStreak);
        if (mode === 'mock20') {
          setMockCorrect((c) => c + 1);
        }

        const bonus = 15 + Math.min(25, nextStreak * 2);
        if (nextStreak > 0 && nextStreak % 3 === 0) {
          sfx.play('streak');
        } else {
          sfx.play('correct');
        }

        onAwardXp(
          bonus,
          lang === 'ar'
            ? `+${bonus} نقطة خبرة! سلسلة نجاح ${nextStreak}`
            : `+${bonus} XP! Streak ${nextStreak}`
        );
      } else {
        setStreak(0);
        if (mode === 'mock20') {
          sfx.play('wrong');
        } else {
          const nextHearts = Math.max(0, hearts - 1);
          setHearts(nextHearts);
          sfx.play(nextHearts === 0 ? 'heartLost' : 'wrong');
        }
      }
    },
    [answered, mode, hearts, mockDone, question.target, autoPlayAudio, streak, bestStreak, onAwardXp, lang]
  );

  const nextQuestion = useCallback(() => {
    if (mode === 'mock20' && mockIndex >= 20) {
      sfx.play('complete');
      setMockDone(true);
      const score200 = Math.round((mockCorrect / 20) * 200);
      if (score200 >= 120) {
        onAwardXp(
          100,
          lang === 'ar'
            ? `+100 نقطة! نجحت في المحاكاة (${score200}/200)`
            : `+100 XP! Mock Exam Passed (${score200}/200)`
        );
      }
      return;
    }

    sfx.play('click');
    if (mode === 'mock20') {
      setMockIndex((i) => i + 1);
    }
    const q = buildQuestion(selectedUnit, mode);
    setQuestion(q);
    setAnswered(false);
    setPickedId(null);
    if (q.kind === 'listen' || autoPlayAudio) {
      audioEngine.speak(q.target.h, { pinyin: q.target.p, key: `arena-${q.target.id}` });
    }
  }, [mode, mockIndex, mockCorrect, selectedUnit, autoPlayAudio, onAwardXp, lang]);

  const resetRun = () => {
    sfx.play('tab');
    setHearts(3);
    setStreak(0);
    setMockIndex(1);
    setMockCorrect(0);
    setMockDone(false);
    const q = buildQuestion(selectedUnit, mode);
    setQuestion(q);
    setAnswered(false);
    setPickedId(null);
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLSelectElement || e.target instanceof HTMLInputElement) return;
      if ((mode !== 'mock20' && hearts <= 0) || mockDone) return;

      if (!answered && ['1', '2', '3', '4'].includes(e.key)) {
        const idx = Number(e.key) - 1;
        const opt = question.options[idx];
        if (opt) submitAnswer(opt.id);
      } else if (answered && e.key === 'Enter') {
        e.preventDefault();
        nextQuestion();
      } else if (e.key.toLowerCase() === 'r') {
        audioEngine.speak(question.target.h, {
          pinyin: question.target.p,
          key: `arena-${question.target.id}`,
        });
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [answered, mode, hearts, mockDone, question, submitAnswer, nextQuestion]);

  if (mode === 'mock20' && mockDone) {
    const score200 = Math.round((mockCorrect / 20) * 200);
    const passed = score200 >= 120;
    return (
      <div
        dir={lang === 'ar' ? 'rtl' : 'ltr'}
        className="max-w-lg mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center space-y-5 animate-settle"
      >
        <div
          className={`w-14 h-14 mx-auto rounded-full flex items-center justify-center ${
            passed
              ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400'
              : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400'
          }`}
        >
          <Award className="w-7 h-7" />
        </div>
        <div className="space-y-2">
          <div className="text-4xl font-bold font-mono-tabular text-slate-900 dark:text-slate-100">
            {score200} <span className="text-lg text-slate-400">/ 200</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            {passed
              ? lang === 'ar'
                ? 'مبروك! اجتزت امتحان HSK 1 التجريبي'
                : 'Congratulations! You Passed the HSK 1 Mock'
              : lang === 'ar'
                ? 'أحسنت المحاولة! واصل التدريب لتصل إلى 120/200'
                : 'Good Effort! Keep Practicing to Reach 120/200'}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {lang === 'ar'
              ? `أجبت إجابة صحيحة على ${mockCorrect} من أصل 20 سؤالاً (درجة النجاح الرسمية 120/200).`
              : `You answered ${mockCorrect} out of 20 correctly (official HSK 1 pass mark is 120/200).`}
          </p>
        </div>
        <button
          type="button"
          onClick={resetRun}
          className="min-h-[44px] px-6 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white font-semibold text-sm inline-flex items-center gap-2 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{lang === 'ar' ? 'إعادة الامتحان التجريبي' : 'Retake Mock Exam'}</span>
        </button>
      </div>
    );
  }

  if (mode !== 'mock20' && hearts <= 0) {
    return (
      <div
        dir={lang === 'ar' ? 'rtl' : 'ltr'}
        className="max-w-lg mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center space-y-5 animate-settle"
      >
        <div className="w-14 h-14 mx-auto rounded-full bg-red-50 dark:bg-red-950/60 flex items-center justify-center text-red-700 dark:text-red-400">
          <Heart className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {lang === 'ar' ? 'انتهت الجولة!' : 'Quiz Run Complete'}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {lang === 'ar'
              ? `أفضل سلسلة إجابات صحيحة في هذه الجلسة: ${bestStreak}`
              : `Best streak this session: ${bestStreak}`}
          </p>
        </div>
        <button
          type="button"
          onClick={resetRun}
          className="min-h-[44px] px-6 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white font-semibold text-sm inline-flex items-center gap-2 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{lang === 'ar' ? 'بدء جولة جديدة' : 'Start New Run'}</span>
        </button>
      </div>
    );
  }

  const { target, options, kind } = question;
  const activeUnitObj = UNITS.find((u) => u.id === selectedUnit);

  return (
    <div className="max-w-3xl mx-auto space-y-5 animate-settle" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Quiz Controls Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <select
            aria-label={lang === 'ar' ? 'اختر الوحدة للاختبار' : 'Select unit to quiz'}
            value={selectedUnit}
            onChange={(e) => {
              sfx.play('click');
              onSelectUnit(Number(e.target.value));
            }}
            className="min-h-[40px] px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-red-600 cursor-pointer"
          >
            {UNITS.map((u) => (
              <option key={u.id} value={u.id}>
                {lang === 'ar' ? u.titleAr : u.titleEn}
              </option>
            ))}
            <option value={0}>
              {lang === 'ar'
                ? `اختبار شامل لكل HSK 1 (${HSK1_WORDS.length} كلمة)`
                : `Comprehensive HSK 1 Review (${HSK1_WORDS.length} Words)`}
            </option>
          </select>

          <select
            aria-label={lang === 'ar' ? 'نمط الاختبار' : 'Quiz mode'}
            value={mode}
            onChange={(e) => {
              sfx.play('click');
              const nextMode = e.target.value as ArenaMode;
              setMode(nextMode);
            }}
            className="min-h-[40px] px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-red-600 cursor-pointer"
          >
            <option value="listen">
              {lang === 'ar' ? 'الاستماع ← المعنى' : 'Listening → Meaning'}
            </option>
            <option value="hanzi2meaning">
              {lang === 'ar' ? 'الحرف الصيني ← المعنى' : 'Hanzi → Meaning'}
            </option>
            <option value="meaning2hanzi">
              {lang === 'ar' ? 'المعنى ← الحرف الصيني' : 'Meaning → Hanzi'}
            </option>
            <option value="mock20">
              {lang === 'ar' ? 'محاكاة امتحان HSK 1 (٢٠ سؤالاً)' : 'HSK 1 Mock Exam (20 Qs · /200)'}
            </option>
          </select>
        </div>

        {/* Streak & Hearts OR Mock Progress */}
        {mode === 'mock20' ? (
          <div className="flex items-center gap-3 text-xs font-semibold font-mono-tabular">
            <span className="text-slate-600 dark:text-slate-300">
              {lang === 'ar' ? `السؤال ${mockIndex} / 20` : `Q ${mockIndex} / 20`}
            </span>
            <span className="text-teal-700 dark:text-teal-400">
              {lang === 'ar' ? `صحيح: ${mockCorrect}` : `Score: ${mockCorrect}`}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-4 text-xs font-semibold font-mono-tabular">
            <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400">
              <Flame className="w-4 h-4" aria-hidden="true" />
              <span>{lang === 'ar' ? `السلسلة: ${streak}` : `Streak: ${streak}`}</span>
            </span>
            <div className="flex items-center gap-1" aria-label={`${hearts} hearts remaining`}>
              {[0, 1, 2].map((i) => (
                <Heart
                  key={i}
                  className={`w-4 h-4 ${
                    i < hearts ? 'text-red-600 fill-red-600' : 'text-slate-300 dark:text-slate-700'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Question Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between gap-3">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>
              {activeUnitObj
                ? lang === 'ar'
                  ? `الوحدة ${target.u}`
                  : `Unit ${target.u}`
                : lang === 'ar'
                  ? `الوحدة ${target.u}`
                  : `Unit ${target.u}`}
            </span>
            <span aria-hidden="true" className="mx-1.5">
              ·
            </span>
            <span>{lang === 'ar' ? target.posAr : target.posEn}</span>
          </div>
          <SpeakButton
            text={target.h}
            pinyin={target.p}
            playKey={`arena-${target.id}`}
            activeKey={activeAudioKey}
            label={lang === 'ar' ? 'استماع (R)' : 'Pronounce (R)'}
          />
        </div>

        {/* Prompt Surface (Strictly selected language only) */}
        <div className="py-8 px-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-center space-y-2">
          {kind === 'listen' ? (
            <>
              <div className="text-5xl font-bold font-hanzi text-slate-900 dark:text-slate-50">
                {answered ? target.h : '？'}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                {answered
                  ? `${target.p} — ${lang === 'ar' ? target.ar : target.en}`
                  : lang === 'ar'
                    ? 'اضغط "استماع" واختر المعنى الصحيح'
                    : 'Press "Pronounce" and choose the matching meaning'}
              </div>
            </>
          ) : kind === 'hanzi2meaning' ? (
            <>
              <div className="text-5xl sm:text-6xl font-bold font-hanzi text-slate-900 dark:text-slate-50">
                {target.h}
              </div>
              {showPinyin && (
                <div className="text-base font-mono-tabular font-semibold text-red-700 dark:text-red-400">
                  {target.p}
                </div>
              )}
            </>
          ) : (
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
              {lang === 'ar' ? target.ar : target.en}
            </div>
          )}
        </div>

        {/* 4 Choices (Strictly selected language only) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {options.map((opt, idx) => {
            const isCorrectOpt = opt.id === target.id;
            const isPickedWrong = answered && opt.id === pickedId && !isCorrectOpt;

            let cls =
              'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-red-600';
            if (answered) {
              if (isCorrectOpt) {
                cls = 'bg-teal-50 dark:bg-teal-950/60 border-teal-600';
              } else if (isPickedWrong) {
                cls = 'bg-red-50 dark:bg-red-950/60 border-red-600 animate-shake';
              } else {
                cls = 'opacity-45 border-slate-200 dark:border-slate-800';
              }
            }

            return (
              <button
                key={opt.id}
                type="button"
                disabled={answered}
                onClick={() => submitAnswer(opt.id)}
                className={`p-4 rounded-xl border-2 transition-colors flex items-center justify-between gap-3 cursor-pointer disabled:cursor-default ${
                  lang === 'ar' ? 'text-right' : 'text-left'
                } ${cls}`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-mono-tabular font-semibold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  {kind === 'meaning2hanzi' ? (
                    <div>
                      <div className="text-2xl font-bold font-hanzi text-slate-900 dark:text-slate-100">
                        {opt.h}
                      </div>
                      {showPinyin && (
                        <div className="text-xs font-mono-tabular text-red-700 dark:text-red-400">
                          {opt.p}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-base font-bold text-slate-900 dark:text-slate-100">
                      {lang === 'ar' ? opt.ar : opt.en}
                    </div>
                  )}
                </div>

                {answered && isCorrectOpt && (
                  <CheckCircle2 className="w-5 h-5 text-teal-700 dark:text-teal-400 shrink-0" aria-label="Correct" />
                )}
                {isPickedWrong && (
                  <XCircle className="w-5 h-5 text-red-600 shrink-0" aria-label="Incorrect" />
                )}
              </button>
            );
          })}
        </div>

        {/* Post-Answer Bar */}
        {answered && (
          <div className="p-4 rounded-xl bg-slate-900 dark:bg-slate-950 text-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-settle">
            <div className="text-xs sm:text-sm space-y-0.5">
              <div>
                <span className="text-amber-300 font-semibold">
                  {lang === 'ar' ? 'مثال: ' : 'Example: '}
                </span>
                <span className="font-hanzi font-bold">{target.exH}</span>
                <span className="text-slate-400 mx-1.5">·</span>
                <span className="text-slate-300">{lang === 'ar' ? target.exAr : target.exEn}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={nextQuestion}
              className="min-h-[40px] px-5 py-2 rounded-lg bg-red-700 hover:bg-red-800 text-white font-semibold text-xs sm:text-sm shrink-0 cursor-pointer"
            >
              {mode === 'mock20' && mockIndex >= 20
                ? lang === 'ar'
                  ? 'عرض النتيجة النهائية'
                  : 'View Final Score'
                : lang === 'ar'
                  ? 'السؤال التالي ←'
                  : 'Next Question →'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
