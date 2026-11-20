import React, { useState } from 'react';
import { CheckCircle2, XCircle, RotateCcw, Trophy } from 'lucide-react';
import { SENTENCE_CHALLENGES, DIALOGUE_SCENARIOS } from '../data/hsk1Data';
import { SpeakButton } from './SpeakButton';
import { UiLang } from './TopBar';
import { audioEngine } from '../utils/audioEngine';
import { sfx } from '../utils/sfxEngine';

interface ArcadeViewProps {
  lang: UiLang;
  showPinyin: boolean;
  activeAudioKey: string | null;
  autoPlayAudio: boolean;
  onAwardXp: (amount: number, toastMsg?: string) => void;
  mode: 'builder' | 'dialogue';
}

export const ArcadeView: React.FC<ArcadeViewProps> = ({
  lang,
  showPinyin,
  activeAudioKey,
  autoPlayAudio,
  onAwardXp,
  mode,
}) => {
  // Part A: Sentence Builder state
  const [builderIdx, setBuilderIdx] = useState(0);
  const [tray, setTray] = useState<number[]>([]);
  const [builderChecked, setBuilderChecked] = useState(false);
  const [builderOk, setBuilderOk] = useState(false);

  // Part B: Dialogue Scenarios state
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [turnIdx, setTurnIdx] = useState(0);
  const [turnAnswered, setTurnAnswered] = useState(false);
  const [turnPicked, setTurnPicked] = useState<number | null>(null);
  const [scenarioDone, setScenarioDone] = useState(false);

  const challenge = SENTENCE_CHALLENGES[builderIdx];
  const scenario = DIALOGUE_SCENARIOS[scenarioIdx];
  const turn = scenario.turns[turnIdx];

  const handlePickTile = (idx: number) => {
    if (builderChecked || tray.includes(idx)) return;
    sfx.play('tilePick', tray.length);
    setTray((prev) => [...prev, idx]);
  };

  const handleRemoveTile = (pos: number) => {
    if (builderChecked) return;
    sfx.play('tileRemove');
    setTray((prev) => prev.filter((_, i) => i !== pos));
  };

  const handleVerifyBuilder = () => {
    const built = tray.map((i) => challenge.tiles[i]);
    const ok =
      built.length === challenge.target.length &&
      built.every((val, i) => val === challenge.target[i]);
    setBuilderChecked(true);
    setBuilderOk(ok);
    if (autoPlayAudio) {
      audioEngine.speak(challenge.fullH, { pinyin: challenge.fullP, key: `bld-${builderIdx}` });
    }
    if (ok) {
      sfx.play('correct');
      onAwardXp(
        25,
        lang === 'ar' ? '+25 نقطة! ترتيب جملة مثالي' : '+25 XP! Perfect Mandarin word order'
      );
    } else {
      sfx.play('wrong');
    }
  };

  const handleRetryBuilder = () => {
    sfx.play('click');
    setTray([]);
    setBuilderChecked(false);
    setBuilderOk(false);
  };

  const handleNextBuilder = () => {
    sfx.play('click');
    setBuilderIdx((prev) => (prev + 1) % SENTENCE_CHALLENGES.length);
    setTray([]);
    setBuilderChecked(false);
    setBuilderOk(false);
  };

  const handleSelectScenario = (idx: number) => {
    sfx.play('tab');
    setScenarioIdx(idx);
    setTurnIdx(0);
    setTurnAnswered(false);
    setTurnPicked(null);
    setScenarioDone(false);
    if (autoPlayAudio) {
      const first = DIALOGUE_SCENARIOS[idx].turns[0];
      audioEngine.speak(first.npcH, { pinyin: first.npcP, key: `dlg-npc-${idx}-0` });
    }
  };

  const handlePickOption = (optIdx: number) => {
    if (turnAnswered) return;
    const opt = turn.options[optIdx];
    setTurnAnswered(true);
    setTurnPicked(optIdx);
    audioEngine.speak(opt.h, { pinyin: opt.p, key: `dlg-opt-${scenarioIdx}-${turnIdx}-${optIdx}` });
    if (opt.ok) {
      sfx.play('correct');
      onAwardXp(
        30,
        lang === 'ar' ? '+30 نقطة! رد صيني طبيعي' : '+30 XP! Natural Mandarin response'
      );
    } else {
      sfx.play('wrong');
    }
  };

  const handleAdvanceTurn = () => {
    if (turnIdx + 1 >= scenario.turns.length) {
      sfx.play('complete');
      setScenarioDone(true);
      onAwardXp(50, lang === 'ar' ? '+50 نقطة لإتمام المحادثة!' : '+50 XP Scenario Mastered!');
    } else {
      sfx.play('click');
      const nextTurn = turnIdx + 1;
      setTurnIdx(nextTurn);
      setTurnAnswered(false);
      setTurnPicked(null);
      if (autoPlayAudio) {
        const nextObj = scenario.turns[nextTurn];
        audioEngine.speak(nextObj.npcH, {
          pinyin: nextObj.npcP,
          key: `dlg-npc-${scenarioIdx}-${nextTurn}`,
        });
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-settle" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {mode === 'builder' ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-xs font-semibold text-red-700 dark:text-red-400 font-mono-tabular">
                {lang === 'ar'
                  ? `الجملة ${builderIdx + 1} من ${SENTENCE_CHALLENGES.length}`
                  : `Pattern ${builderIdx + 1} of ${SENTENCE_CHALLENGES.length}`}
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {lang === 'ar' ? 'رتّب الكلمات لتكوين الجملة الصينية' : 'Assemble the Mandarin Sentence'}
              </h2>
            </div>
            <SpeakButton
              text={challenge.fullH}
              pinyin={challenge.fullP}
              playKey={`bld-${builderIdx}`}
              activeKey={activeAudioKey}
              label={lang === 'ar' ? 'استماع للهدف' : 'Hear Target'}
            />
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
            <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
              “{lang === 'ar' ? challenge.ar : challenge.en}”
            </div>
          </div>

          {/* Assembly Tray */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span>
                {lang === 'ar' ? 'جملتك (اضغط على الكلمة لإزالتها)' : 'Your sentence (tap a tile to remove)'}
              </span>
              {tray.length > 0 && !builderChecked && (
                <button
                  type="button"
                  onClick={handleRetryBuilder}
                  className="text-red-700 dark:text-red-400 hover:underline cursor-pointer"
                >
                  {lang === 'ar' ? 'مسح الكل' : 'Clear'}
                </button>
              )}
            </div>

            <div
              dir="ltr"
              className={`min-h-[76px] p-3.5 rounded-xl border-2 border-dashed flex flex-wrap items-center gap-2 transition-colors ${
                builderChecked
                  ? builderOk
                    ? 'border-teal-600 bg-teal-50/70 dark:bg-teal-950/40'
                    : 'border-red-600 bg-red-50/70 dark:bg-red-950/40'
                  : 'border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/30'
              }`}
            >
              {tray.length === 0 ? (
                <span className="text-xs text-slate-400 italic">
                  {lang === 'ar'
                    ? 'اختر الكلمات من الأسفل بالترتيب الصحيح...'
                    : 'Tap tiles below in Mandarin word order...'}
                </span>
              ) : (
                tray.map((tileIdx, pos) => (
                  <button
                    key={`${tileIdx}-${pos}`}
                    type="button"
                    disabled={builderChecked}
                    onClick={() => handleRemoveTile(pos)}
                    className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-amber-300 dark:text-slate-900 font-bold font-hanzi text-lg cursor-pointer hover:opacity-90 disabled:cursor-default"
                  >
                    {challenge.tiles[tileIdx]}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Word Bank */}
          <div dir="ltr" className="flex flex-wrap gap-2.5">
            {challenge.tiles.map((word, idx) => {
              const used = tray.includes(idx);
              return (
                <button
                  key={idx}
                  type="button"
                  disabled={used || builderChecked}
                  onClick={() => handlePickTile(idx)}
                  className={`min-h-[46px] px-4 py-2 rounded-xl border-2 font-bold font-hanzi text-lg transition-colors ${
                    used
                      ? 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-800 opacity-35 cursor-not-allowed'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-red-600 text-slate-900 dark:text-slate-100 cursor-pointer'
                  }`}
                >
                  {word}
                </button>
              );
            })}
          </div>

          {!builderChecked ? (
            <div className="flex justify-end">
              <button
                type="button"
                disabled={tray.length === 0}
                onClick={handleVerifyBuilder}
                className="min-h-[44px] px-6 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white font-semibold text-sm disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
              >
                {lang === 'ar' ? 'تحقق من الإجابة' : 'Check Sentence'}
              </button>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-slate-900 dark:bg-slate-950 text-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-settle">
              <div className="space-y-1">
                <div
                  className={`text-sm font-bold flex items-center gap-2 ${
                    builderOk ? 'text-teal-400' : 'text-red-400'
                  }`}
                >
                  {builderOk ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 shrink-0" />
                  )}
                  <span className="font-hanzi">
                    {builderOk
                      ? `${lang === 'ar' ? 'صحيح! ' : 'Correct! '}${challenge.fullH}`
                      : `${lang === 'ar' ? 'الإجابة الصحيحة: ' : 'Answer: '}${challenge.fullH} (${challenge.fullP})`}
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  {lang === 'ar' ? challenge.noteAr : challenge.noteEn}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {!builderOk && (
                  <button
                    type="button"
                    onClick={handleRetryBuilder}
                    className="min-h-[40px] px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{lang === 'ar' ? 'إعادة' : 'Retry'}</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleNextBuilder}
                  className="min-h-[40px] px-5 py-2 rounded-lg bg-red-700 hover:bg-red-800 text-white font-semibold text-xs sm:text-sm cursor-pointer"
                >
                  {lang === 'ar' ? 'الجملة التالية ←' : 'Next →'}
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* PART B: DIALOGUE SCENARIOS */
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {DIALOGUE_SCENARIOS.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectScenario(idx)}
                className={`p-3 rounded-xl border transition-colors cursor-pointer ${
                  lang === 'ar' ? 'text-right' : 'text-left'
                } ${
                  idx === scenarioIdx
                    ? 'bg-white dark:bg-slate-900 border-red-600 text-slate-900 dark:text-slate-100 font-bold shadow-xs'
                    : 'bg-slate-100/80 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-400'
                }`}
              >
                <div className="text-xs truncate">{lang === 'ar' ? item.titleAr : item.titleEn}</div>
              </button>
            ))}
          </div>

          {scenarioDone ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center space-y-4 animate-settle">
              <div className="w-14 h-14 mx-auto rounded-full bg-teal-50 dark:bg-teal-950/60 flex items-center justify-center text-teal-700 dark:text-teal-400">
                <Trophy className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {lang === 'ar'
                  ? `أتممت المحادثة: ${scenario.titleAr}`
                  : `Scenario Mastered: ${scenario.titleEn}`}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {lang === 'ar'
                  ? 'أجبت عن جميع الجولات الحوارية بلغة صينية طبيعية وسليمة!'
                  : 'You completed every conversational turn in natural HSK 1 Mandarin.'}
              </p>
              <div className="flex justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleSelectScenario(scenarioIdx)}
                  className="min-h-[42px] px-5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs font-semibold cursor-pointer"
                >
                  {lang === 'ar' ? 'إعادة المحادثة' : 'Replay'}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleSelectScenario((scenarioIdx + 1) % DIALOGUE_SCENARIOS.length)
                  }
                  className="min-h-[42px] px-5 py-2 rounded-xl bg-red-700 hover:bg-red-800 text-white text-xs font-semibold cursor-pointer"
                >
                  {lang === 'ar' ? 'المحادثة التالية ←' : 'Next Scenario →'}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {lang === 'ar' ? scenario.titleAr : scenario.titleEn}
                </h3>
                <span className="text-xs font-semibold font-mono-tabular text-slate-500 dark:text-slate-400">
                  {lang === 'ar'
                    ? `الجولة ${turnIdx + 1} / ${scenario.turns.length}`
                    : `Turn ${turnIdx + 1} / ${scenario.turns.length}`}
                </span>
              </div>

              {/* Partner Prompt */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-red-700 dark:text-red-400 mb-1">
                    {lang === 'ar' ? scenario.partnerAr : scenario.partnerEn}
                  </div>
                  <div className="text-xl font-bold font-hanzi text-slate-900 dark:text-slate-100">
                    {turn.npcH}
                  </div>
                  {showPinyin && (
                    <div className="text-xs font-mono-tabular text-red-700 dark:text-red-400 mt-0.5">
                      {turn.npcP}
                    </div>
                  )}
                  <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    {lang === 'ar' ? turn.npcAr : turn.npcEn}
                  </div>
                </div>
                <SpeakButton
                  text={turn.npcH}
                  pinyin={turn.npcP}
                  playKey={`dlg-npc-${scenarioIdx}-${turnIdx}`}
                  activeKey={activeAudioKey}
                  label={lang === 'ar' ? 'استماع' : 'Listen'}
                />
              </div>

              {/* Response Choices */}
              <div className="space-y-3">
                {turn.options.map((opt, idx) => {
                  const isPickedWrong = turnAnswered && idx === turnPicked && !opt.ok;
                  let cls =
                    'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-red-600';
                  if (turnAnswered) {
                    if (opt.ok) {
                      cls = 'bg-teal-50 dark:bg-teal-950/60 border-teal-600';
                    } else if (isPickedWrong) {
                      cls = 'bg-red-50 dark:bg-red-950/60 border-red-600 animate-shake';
                    } else {
                      cls = 'opacity-45 border-slate-200 dark:border-slate-800';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={turnAnswered}
                      onClick={() => handlePickOption(idx)}
                      className={`w-full p-4 rounded-xl border-2 flex items-center justify-between gap-3 transition-colors cursor-pointer disabled:cursor-default ${
                        lang === 'ar' ? 'text-right' : 'text-left'
                      } ${cls}`}
                    >
                      <div>
                        <div className="text-lg font-bold font-hanzi text-slate-900 dark:text-slate-100">
                          {opt.h}
                        </div>
                        {showPinyin && (
                          <div className="text-xs font-mono-tabular text-red-700 dark:text-red-400">
                            {opt.p}
                          </div>
                        )}
                        <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                          {lang === 'ar' ? opt.ar : opt.en}
                        </div>
                      </div>
                      <div className="shrink-0">
                        {turnAnswered && opt.ok && (
                          <CheckCircle2 className="w-5 h-5 text-teal-700 dark:text-teal-400" />
                        )}
                        {isPickedWrong && <XCircle className="w-5 h-5 text-red-600" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {turnAnswered && turnPicked !== null && (
                <div className="p-4 rounded-xl bg-slate-900 dark:bg-slate-950 text-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-settle">
                  <div className="text-xs sm:text-sm">
                    <strong className="text-amber-300">
                      {lang === 'ar' ? 'نصيحة لغوية: ' : 'Coach Tip: '}
                    </strong>
                    {lang === 'ar'
                      ? turn.options[turnPicked].tipAr
                      : turn.options[turnPicked].tipEn}
                  </div>
                  <button
                    type="button"
                    onClick={handleAdvanceTurn}
                    className="min-h-[40px] px-5 py-2 rounded-lg bg-red-700 hover:bg-red-800 text-white font-semibold text-xs sm:text-sm shrink-0 cursor-pointer"
                  >
                    {turnIdx + 1 >= scenario.turns.length
                      ? lang === 'ar'
                        ? 'إنهاء المحادثة'
                        : 'Complete Scenario'
                      : lang === 'ar'
                        ? 'الجولة التالية ←'
                        : 'Next Turn →'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
