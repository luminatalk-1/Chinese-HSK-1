import React, { useState, useCallback } from 'react';
import {
  TONE_DEMOS,
  PINYIN_INITIALS,
  PINYIN_FINALS,
  PINYIN_SOUNDBOARD,
  HSK1_WORDS,
  HskWord,
} from '../data/hsk1Data';
import { SpeakButton } from './SpeakButton';
import { UiLang } from './TopBar';
import { audioEngine } from '../utils/audioEngine';
import { sfx } from '../utils/sfxEngine';
import { Volume2, AudioWaveform } from 'lucide-react';

interface PinyinLabViewProps {
  lang: UiLang;
  activeAudioKey: string | null;
  autoPlayAudio: boolean;
  onAwardXp: (amount: number) => void;
}

type PinyinSubTab = 'tones' | 'initials' | 'finals' | 'board' | 'quiz';

function createToneQuiz() {
  const pool = HSK1_WORDS.filter((w) => w.h.length <= 2);
  const target = pool[Math.floor(Math.random() * pool.length)];
  const distractors = [...pool]
    .filter((w) => w.id !== target.id)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
  const options = [target, ...distractors].sort(() => Math.random() - 0.5);
  return { target, options };
}

export const PinyinLabView: React.FC<PinyinLabViewProps> = ({
  lang,
  activeAudioKey,
  autoPlayAudio,
  onAwardXp,
}) => {
  const [subTab, setSubTab] = useState<PinyinSubTab>('tones');
  const [quiz, setQuiz] = useState<{ target: HskWord; options: HskWord[] }>(() => createToneQuiz());
  const [pickedId, setPickedId] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);

  const switchSub = (next: PinyinSubTab) => {
    sfx.play('tab');
    setSubTab(next);
    if (next === 'quiz' && autoPlayAudio) {
      audioEngine.speak(quiz.target.h, { pinyin: quiz.target.p, key: `tq-${quiz.target.id}` });
    }
  };

  const handleSubmitQuiz = useCallback(
    (optId: string) => {
      if (answered) return;
      setAnswered(true);
      setPickedId(optId);
      if (optId === quiz.target.id) {
        sfx.play('correct');
        onAwardXp(15);
      } else {
        sfx.play('wrong');
      }
    },
    [answered, quiz.target.id, onAwardXp]
  );

  const handleNextQuiz = () => {
    sfx.play('click');
    const nextQ = createToneQuiz();
    setQuiz(nextQ);
    setPickedId(null);
    setAnswered(false);
    audioEngine.preload(nextQ.target.h);
    if (autoPlayAudio) {
      audioEngine.speak(nextQ.target.h, { pinyin: nextQ.target.p, key: `tq-${nextQ.target.id}` });
    }
  };

  return (
    <div className="space-y-6 animate-settle" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Segmented Sub-Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 p-1.5 bg-slate-200/75 dark:bg-slate-800 rounded-xl">
        {[
          { id: 'tones' as PinyinSubTab, en: '4 Tones & Sandhi', ar: 'النغمات الأربع' },
          { id: 'initials' as PinyinSubTab, en: '23 Initials', ar: 'البادئات (٢٣)' },
          { id: 'finals' as PinyinSubTab, en: 'Finals & Vowels', ar: 'النهايات الصوتية' },
          { id: 'board' as PinyinSubTab, en: 'Sound Comparison', ar: 'مقارنة الأصوات' },
          { id: 'quiz' as PinyinSubTab, en: 'Tone Ear Quiz', ar: 'اختبار السمع' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => switchSub(tab.id)}
            className={`py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold cursor-pointer transition-colors whitespace-nowrap ${
              subTab === tab.id
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            {lang === 'ar' ? tab.ar : tab.en}
          </button>
        ))}
      </div>

      {subTab === 'tones' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {lang === 'ar'
                ? 'النغمات الصينية الأربع + النغمة المحايدة'
                : 'The 4 Mandarin Tones + Neutral Tone'}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              {lang === 'ar'
                ? 'اضغط للاستماع إلى النطق الأصلي أو استمع لمنحنى طبقة الصوت.'
                : 'Listen to native Mandarin pronunciation or play the pure pitch-contour guide.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TONE_DEMOS.map((t) => (
              <div
                key={t.syl}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 flex flex-col justify-between space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-xs font-semibold text-red-700 dark:text-red-400">
                      {t.tone === 0
                        ? lang === 'ar' ? 'النغمة المحايدة' : 'Neutral Tone'
                        : lang === 'ar' ? `النغمة ${t.tone}` : `Tone ${t.tone}`}
                    </div>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-2xl font-mono-tabular font-bold text-slate-900 dark:text-slate-100">
                        {t.syl}
                      </span>
                      <span className="text-2xl font-hanzi font-bold text-teal-700 dark:text-teal-400">
                        {t.hanzi}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
                      {lang === 'ar' ? t.ar : t.en}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => audioEngine.playToneContour([t.tone])}
                      title={lang === 'ar' ? 'استماع لمنحنى الطبقة الصوتية' : 'Play pitch contour'}
                      className="min-h-[36px] w-9 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-red-600 text-slate-700 dark:text-slate-200 flex items-center justify-center cursor-pointer"
                    >
                      <AudioWaveform className="w-4 h-4" />
                    </button>
                    <SpeakButton
                      text={t.hanzi}
                      pinyin={t.syl}
                      playKey={`tone-${t.syl}`}
                      activeKey={activeAudioKey}
                      size="sm"
                    />
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-lg p-2 border border-slate-200 dark:border-slate-800">
                  <svg viewBox="0 0 120 100" className="w-full h-14 overflow-visible">
                    <line x1="10" y1="22" x2="110" y2="22" stroke="#CBD5E1" strokeDasharray="3 3" strokeWidth="1" />
                    <line x1="10" y1="52" x2="110" y2="52" stroke="#CBD5E1" strokeDasharray="3 3" strokeWidth="1" />
                    <line x1="10" y1="82" x2="110" y2="82" stroke="#CBD5E1" strokeDasharray="3 3" strokeWidth="1" />
                    <path d={t.path} fill="none" stroke="#C23B2B" strokeWidth="4.5" strokeLinecap="round" />
                  </svg>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {lang === 'ar' ? t.descAr : t.descEn}
                </p>
              </div>
            ))}
          </div>

          {/* Tone Sandhi Rules */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            {[
              {
                title: lang === 'ar' ? 'نغمة ٣ + نغمة ٣ ← ٢ + ٣' : '3rd + 3rd → 2nd + 3rd',
                body: lang === 'ar' ? '你好 (nǐ hǎo) تُنطق عملياً ní hǎo.' : '你好 (nǐ hǎo) is spoken naturally as ní hǎo.',
                h: '你好',
                p: 'nǐ hǎo',
              },
              {
                title: lang === 'ar' ? 'أداة النفي 不 قبل النغمة ٤' : '不 (bù) + 4th → bú',
                body: lang === 'ar' ? '不是 (bù shì) تتحول إلى bú shì.' : '不是 (bù shì) shifts to bú shì.',
                h: '不是',
                p: 'bú shì',
              },
              {
                title: lang === 'ar' ? 'تغيّر نغمة الرقم 一 (واحد)' : '一 (yī) Tone Shift',
                body: lang === 'ar' ? '一个 تصبح yí gè و 一本 تصبح yì běn.' : '一个 becomes yí gè; 一本 becomes yì běn.',
                h: '一个',
                p: 'yí gè',
              },
            ].map((rule, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-900 dark:bg-slate-950 text-slate-100 flex items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="text-xs font-bold text-amber-300">{rule.title}</div>
                  <div className="text-xs text-slate-300">{rule.body}</div>
                </div>
                <SpeakButton
                  text={rule.h}
                  pinyin={rule.p}
                  playKey={`sandhi-${idx}`}
                  activeKey={activeAudioKey}
                  size="sm"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {subTab === 'initials' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-5">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {lang === 'ar' ? 'جميع البادئات الصينية الـ ٢٣ (Initials)' : 'All 23 Mandarin Pinyin Initials'}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              {lang === 'ar'
                ? 'اضغط على أي صوت للاستماع لنطقه في كلمة من كلمات HSK 1.'
                : 'Tap any initial to hear it spoken inside a core HSK 1 word.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {PINYIN_INITIALS.map((item) => (
              <div
                key={item.sym}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-11 h-11 rounded-xl bg-red-700 text-white font-mono-tabular font-bold text-base flex items-center justify-center shrink-0">
                    {item.sym}
                  </span>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      <span className="font-hanzi">{item.sampleH}</span> ·{' '}
                      <span className="font-mono-tabular text-red-700 dark:text-red-400">{item.sampleP}</span>{' '}
                      <span className="text-teal-700 dark:text-teal-400">
                        ({lang === 'ar' ? item.ar : item.en})
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400 truncate">
                      {lang === 'ar' ? item.tipAr : item.tipEn}
                    </div>
                  </div>
                </div>
                <SpeakButton
                  text={item.sampleH}
                  pinyin={item.sampleP}
                  playKey={`init-${item.sym}`}
                  activeKey={activeAudioKey}
                  size="sm"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {subTab === 'finals' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-5">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {lang === 'ar' ? 'النهايات والحروف المتحركة الأساسية (Finals)' : 'Essential Mandarin Finals & Vowels'}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              {lang === 'ar'
                ? 'تشمل الحروف المتحركة البسيطة والمركبة والأنفية مع أمثلة صوتية.'
                : 'Simple, compound, and nasal finals with HSK 1 audio examples.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {PINYIN_FINALS.map((item) => (
              <div
                key={item.sym}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex items-center justify-between gap-2.5"
              >
                <div className="min-w-0">
                  <div className="text-lg font-mono-tabular font-bold text-red-700 dark:text-red-400">
                    -{item.sym}
                  </div>
                  <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    <span className="font-hanzi">{item.sampleH}</span> ({item.sampleP})
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    {lang === 'ar' ? item.tipAr : item.tipEn}
                  </div>
                </div>
                <SpeakButton
                  text={item.sampleH}
                  pinyin={item.sampleP}
                  playKey={`fin-${item.sym}`}
                  activeKey={activeAudioKey}
                  size="sm"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {subTab === 'board' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-5">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {lang === 'ar' ? 'مقارنة مخارج الحروف المتشابهة' : 'Mandarin Sound Comparison Board'}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              {lang === 'ar'
                ? 'اضغط على أي كلمة للمقارنة بين مخارج الحروف المتقاربة.'
                : 'Tap any card to compare flat-tongue (j/q/x), curled-tongue (zh/ch/sh/r), and dental (z/c/s) sounds.'}
            </p>
          </div>

          <div className="space-y-5">
            {PINYIN_SOUNDBOARD.map((grp) => (
              <div
                key={grp.groupEn}
                className="space-y-2.5 pt-4 first:pt-0 border-t first:border-t-0 border-slate-100 dark:border-slate-800"
              >
                <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {lang === 'ar' ? grp.groupAr : grp.groupEn}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {grp.items.map((it) => {
                    const key = `sb-${it.h}`;
                    const speaking = activeAudioKey === key;
                    return (
                      <button
                        key={it.h}
                        type="button"
                        onClick={() => audioEngine.speak(it.h, { pinyin: it.p, key })}
                        className={`p-3.5 rounded-xl border text-left transition-colors flex items-center justify-between gap-2 cursor-pointer ${
                          speaking
                            ? 'border-red-600 bg-red-50/70 dark:bg-red-950/40 is-speaking'
                            : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:border-red-600'
                        }`}
                      >
                        <div>
                          <div className="text-sm font-mono-tabular font-bold text-red-700 dark:text-red-400">
                            {it.p}
                          </div>
                          <div className="text-lg font-bold font-hanzi text-slate-900 dark:text-slate-100">
                            {it.h}
                          </div>
                          <div className="text-xs text-slate-600 dark:text-slate-400">
                            {lang === 'ar' ? it.ar : it.en}
                          </div>
                        </div>
                        {speaking ? (
                          <span className="eq-bars text-red-700 dark:text-red-400">
                            <span />
                            <span />
                            <span />
                            <span />
                          </span>
                        ) : (
                          <Volume2 className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {subTab === 'quiz' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 max-w-2xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-xs font-semibold text-red-700 dark:text-red-400">
                {lang === 'ar' ? 'تحدي الاستماع' : 'Listening Challenge'}
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {lang === 'ar'
                  ? 'استمع واختر البينيين والمعنى الصحيحين'
                  : 'Listen and Select the Exact Pinyin & Meaning'}
              </h2>
            </div>
            <SpeakButton
              text={quiz.target.h}
              pinyin={quiz.target.p}
              playKey={`tq-${quiz.target.id}`}
              activeKey={activeAudioKey}
              size="lg"
              label={lang === 'ar' ? 'استماع للكلمة' : 'Listen Word'}
            />
          </div>

          <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center space-y-1.5">
            <div className="text-4xl sm:text-5xl font-bold font-hanzi text-slate-900 dark:text-slate-50">
              {answered ? quiz.target.h : '？'}
            </div>
            <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              {answered
                ? `${quiz.target.p} — ${lang === 'ar' ? quiz.target.ar : quiz.target.en}`
                : lang === 'ar'
                  ? 'اضغط على "استماع للكلمة" ثم اختر الإجابة المطابقة'
                  : 'Click "Listen Word" above to hear the Mandarin pronunciation'}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {quiz.options.map((opt) => {
              let cls =
                'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-red-600';
              if (answered) {
                if (opt.id === quiz.target.id) {
                  cls = 'bg-teal-50 dark:bg-teal-950/60 border-teal-600 font-bold';
                } else if (opt.id === pickedId) {
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
                  onClick={() => handleSubmitQuiz(opt.id)}
                  className={`p-4 rounded-xl border-2 text-left transition-colors cursor-pointer disabled:cursor-default ${cls}`}
                >
                  <div className="text-base font-mono-tabular font-bold text-red-700 dark:text-red-400">
                    {opt.p}
                  </div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 mt-0.5">
                    {lang === 'ar' ? opt.ar : opt.en}
                  </div>
                </button>
              );
            })}
          </div>

          {answered && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleNextQuiz}
                className="min-h-[44px] px-6 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white font-semibold text-sm cursor-pointer"
              >
                {lang === 'ar' ? 'الصوت التالي ←' : 'Next Sound →'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
