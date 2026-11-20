import React, { useState } from 'react';
import { GRAMMAR_RULES } from '../data/hsk1Data';
import { SpeakButton } from './SpeakButton';
import { UiLang } from './TopBar';
import { sfx } from '../utils/sfxEngine';

interface GrammarViewProps {
  lang: UiLang;
  showPinyin: boolean;
  activeAudioKey: string | null;
}

type GrammarSubTab = 'rules' | 'numbers' | 'exam';

export const GrammarView: React.FC<GrammarViewProps> = ({
  lang,
  showPinyin,
  activeAudioKey,
}) => {
  const [subTab, setSubTab] = useState<GrammarSubTab>('rules');

  return (
    <div className="space-y-6 animate-settle" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Sub-Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 p-1.5 bg-slate-200/75 dark:bg-slate-800 rounded-xl">
        <button
          type="button"
          onClick={() => {
            sfx.play('tab');
            setSubTab('rules');
          }}
          className={`py-2.5 px-4 rounded-lg text-xs sm:text-sm font-semibold cursor-pointer transition-colors ${
            subTab === 'rules'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300'
          }`}
        >
          {lang === 'ar' ? 'القواعد العشر الأساسية' : '10 Core Grammar Rules'}
        </button>
        <button
          type="button"
          onClick={() => {
            sfx.play('tab');
            setSubTab('numbers');
          }}
          className={`py-2.5 px-4 rounded-lg text-xs sm:text-sm font-semibold cursor-pointer transition-colors ${
            subTab === 'numbers'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300'
          }`}
        >
          {lang === 'ar' ? 'مرجع الأرقام والوقت والتقويم' : 'Numbers, Time & Calendar Guide'}
        </button>
        <button
          type="button"
          onClick={() => {
            sfx.play('tab');
            setSubTab('exam');
          }}
          className={`py-2.5 px-4 rounded-lg text-xs sm:text-sm font-semibold cursor-pointer transition-colors ${
            subTab === 'exam'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300'
          }`}
        >
          {lang === 'ar' ? 'دليل امتحان HSK 1 الرسمي' : 'Official HSK 1 Exam Blueprint'}
        </button>
      </div>

      {subTab === 'rules' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {GRAMMAR_RULES.map((rule) => (
            <article
              key={rule.num}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-5"
            >
              <div className="space-y-3">
                <div className="text-xs font-semibold text-red-700 dark:text-red-400 font-mono-tabular">
                  {lang === 'ar'
                    ? `القاعدة ${String(rule.num).padStart(2, '0')}`
                    : `Structure ${String(rule.num).padStart(2, '0')}`}
                </div>

                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {lang === 'ar' ? rule.titleAr : rule.titleEn}
                </h2>

                <div
                  dir="ltr"
                  className="p-3 rounded-xl bg-slate-900 dark:bg-slate-950 text-amber-300 font-mono-tabular text-xs sm:text-sm font-semibold"
                >
                  {rule.pattern}
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {lang === 'ar' ? rule.explanationAr : rule.explanationEn}
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                {rule.examples.map((ex, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-3 pb-3 last:pb-0 border-b last:border-b-0 border-slate-100 dark:border-slate-800"
                  >
                    <div>
                      <div className="text-base font-bold font-hanzi text-slate-900 dark:text-slate-100">
                        {ex.h}
                      </div>
                      {showPinyin && (
                        <div className="text-xs font-mono-tabular text-red-700 dark:text-red-400">
                          {ex.p}
                        </div>
                      )}
                      <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                        {lang === 'ar' ? ex.ar : ex.en}
                      </div>
                    </div>
                    <SpeakButton
                      text={ex.h}
                      pinyin={ex.p}
                      playKey={`gr-${rule.num}-${idx}`}
                      activeKey={activeAudioKey}
                      size="sm"
                    />
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}

      {subTab === 'numbers' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Numbers 11-99 Builder */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {lang === 'ar' ? 'تكوين الأرقام من ١ إلى ٩٩' : 'Building Numbers 1–99'}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {lang === 'ar'
                ? 'تُركّب الأرقام بالمنطق البسيط: العشرات + 十 (عشرة) + الآحاد.'
                : 'Mandarin numbers follow pure base-10 logic: Tens + 十 (ten) + Ones.'}
            </p>
            <div className="space-y-2.5">
              {[
                { n: '11', h: '十一', p: 'shí yī', en: '10 + 1', ar: '١٠ + ١' },
                { n: '20', h: '二十', p: 'èr shí', en: '2 × 10', ar: '٢ × ١٠' },
                { n: '35', h: '三十五', p: 'sān shí wǔ', en: '3 × 10 + 5', ar: '٣ × ١٠ + ٥' },
                { n: '99', h: '九十九', p: 'jiǔ shí jiǔ', en: '9 × 10 + 9', ar: '٩ × ١٠ + ٩' },
              ].map((row) => (
                <div
                  key={row.n}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-lg bg-slate-900 text-amber-300 font-mono-tabular text-xs font-bold flex items-center justify-center">
                      {row.n}
                    </span>
                    <div>
                      <div className="font-bold font-hanzi text-lg text-slate-900 dark:text-slate-100">
                        {row.h}{' '}
                        {showPinyin && (
                          <span className="text-xs font-mono-tabular text-red-700 dark:text-red-400">
                            ({row.p})
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {lang === 'ar' ? row.ar : row.en}
                      </div>
                    </div>
                  </div>
                  <SpeakButton
                    text={row.h}
                    pinyin={row.p}
                    playKey={`num-${row.n}`}
                    activeKey={activeAudioKey}
                    size="sm"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Days of the Week & Telling Time */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {lang === 'ar' ? 'أيام الأسبوع والساعة والشهور' : 'Weekdays, Months & Telling Time'}
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {[
                { h: '星期一', p: 'xīngqīyī', en: 'Monday', ar: 'الاثنين' },
                { h: '星期二', p: 'xīngqī’èr', en: 'Tuesday', ar: 'الثلاثاء' },
                { h: '星期三', p: 'xīngqīsān', en: 'Wednesday', ar: 'الأربعاء' },
                { h: '星期四', p: 'xīngqīsì', en: 'Thursday', ar: 'الخميس' },
                { h: '星期五', p: 'xīngqīwǔ', en: 'Friday', ar: 'الجمعة' },
                { h: '星期六', p: 'xīngqīliù', en: 'Saturday', ar: 'السبت' },
                { h: '星期日', p: 'xīngqīrì', en: 'Sunday', ar: 'الأحد' },
                { h: '两点十五分', p: 'liǎng diǎn shíwǔ fēn', en: '2:15', ar: 'الساعة ٢:١٥' },
              ].map((d) => (
                <div
                  key={d.h}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2"
                >
                  <div>
                    <div className="font-bold font-hanzi text-sm text-slate-900 dark:text-slate-100">
                      {d.h}
                    </div>
                    {showPinyin && (
                      <div className="text-[11px] font-mono-tabular text-red-700 dark:text-red-400">
                        {d.p}
                      </div>
                    )}
                    <div className="text-xs text-slate-600 dark:text-slate-400">
                      {lang === 'ar' ? d.ar : d.en}
                    </div>
                  </div>
                  <SpeakButton
                    text={d.h}
                    pinyin={d.p}
                    playKey={`day-${d.h}`}
                    activeKey={activeAudioKey}
                    size="sm"
                    variant="subtle"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {subTab === 'exam' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
              {lang === 'ar' ? 'هيكل امتحان HSK المستوى الأول الرسمي' : 'Official HSK Level 1 Exam Blueprint'}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {lang === 'ar'
                ? 'يتكون الامتحان من ٤٠ سؤالاً (٢٠ استماع + ٢٠ قراءة)، الدرجة الكلية ٢٠٠ ودرجة النجاح ١٢٠ (٦٠٪). البينيين يكون ظاهراً في الامتحان.'
                : '40 questions total (20 Listening + 20 Reading). Total score: 200 points; Passing score: 120 (60%). Pinyin is printed on the HSK 1 exam.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 space-y-3">
              <div className="text-xs font-bold text-red-700 dark:text-red-400 font-mono-tabular">
                {lang === 'ar' ? 'القسم الأول · الاستماع (٢٠ سؤالاً · ~١٥ دقيقة)' : 'Section 1 · Listening (20 Qs · ~15 min)'}
              </div>
              <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 list-disc ps-5">
                <li>
                  {lang === 'ar'
                    ? 'الجزء ١ (٥ أسئلة): جملة مسموعة + صورة (صح أم خطأ).'
                    : 'Part 1 (5 Qs): Listen to a phrase and mark True/False against a picture.'}
                </li>
                <li>
                  {lang === 'ar'
                    ? 'الجزء ٢ (٥ أسئلة): جملة مسموعة + اختيار الصورة المطابقة (A/B/C).'
                    : 'Part 2 (5 Qs): Listen to a sentence and pick the matching photo (A/B/C).'}
                </li>
                <li>
                  {lang === 'ar'
                    ? 'الجزء ٣ (٥ أسئلة): حوار قصير واختيار الصورة المناسبة.'
                    : 'Part 3 (5 Qs): Listen to a short dialogue and choose the matching picture.'}
                </li>
                <li>
                  {lang === 'ar'
                    ? 'الجزء ٤ (٥ أسئلة): جملة وسؤال عليها مع ٣ خيارات.'
                    : 'Part 4 (5 Qs): Listen to a statement and answer a spoken question (3 choices).'}
                </li>
              </ul>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 space-y-3">
              <div className="text-xs font-bold text-teal-700 dark:text-teal-400 font-mono-tabular">
                {lang === 'ar' ? 'القسم الثاني · القراءة (٢٠ سؤالاً · ~١٧ دقيقة)' : 'Section 2 · Reading (20 Qs · ~17 min)'}
              </div>
              <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 list-disc ps-5">
                <li>
                  {lang === 'ar'
                    ? 'الجزء ١ (٥ أسئلة): مطابقة الكلمة مع الصورة (صح أم خطأ).'
                    : 'Part 1 (5 Qs): Match a word + Pinyin with a picture (True/False).'}
                </li>
                <li>
                  {lang === 'ar'
                    ? 'الجزء ٢ (٥ أسئلة): قراءة جملة واختيار الصورة المطابقة من ٥ صور.'
                    : 'Part 2 (5 Qs): Read a sentence and match it to one of 5 pictures.'}
                </li>
                <li>
                  {lang === 'ar'
                    ? 'الجزء ٣ (٥ أسئلة): توصيل السؤال بالإجابة الصحيحة.'
                    : 'Part 3 (5 Qs): Match 5 questions with 5 logical replies.'}
                </li>
                <li>
                  {lang === 'ar'
                    ? 'الجزء ٤ (٥ أسئلة): ملء الفراغ بالكلمة المناسبة في الجملة.'
                    : 'Part 4 (5 Qs): Fill in the blank in 5 sentences from a word bank.'}
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
