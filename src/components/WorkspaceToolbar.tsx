import React from 'react';
import { Volume2, VolumeX, Sun, Moon, Eye, EyeOff, Gauge } from 'lucide-react';
import { UiLang } from './TopBar';
import { sfx } from '../utils/sfxEngine';
import { audioEngine } from '../utils/audioEngine';

interface WorkspaceToolbarProps {
  lang: UiLang;
  onSetLang: (lang: UiLang) => void;
  isDark: boolean;
  onToggleDark: () => void;
  showPinyin: boolean;
  onTogglePinyin: () => void;
  speechRate: number;
  onCycleRate: () => void;
  sfxEnabled: boolean;
  onToggleSfx: () => void;
  masteredCount: number;
  totalWords: number;
  xp: number;
  activeAudioKey: string | null;
  onOpenProgress?: () => void;
}

export const WorkspaceToolbar: React.FC<WorkspaceToolbarProps> = ({
  lang,
  onSetLang,
  isDark,
  onToggleDark,
  showPinyin,
  onTogglePinyin,
  speechRate,
  onCycleRate,
  sfxEnabled,
  onToggleSfx,
  masteredCount,
  totalWords,
  xp,
  activeAudioKey,
  onOpenProgress,
}) => {
  const isTesting = activeAudioKey === '__test_nihao__';

  return (
    <section
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      aria-label={lang === 'ar' ? 'إعدادات لغة التعلم والصوت' : 'Study language and audio controls'}
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 sm:px-5 sm:py-3.5 flex flex-wrap items-center justify-between gap-3"
    >
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Explicit Study Language Selector: Arabic vs English */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">
            {lang === 'ar' ? 'لغة التعلم:' : 'Study in:'}
          </span>
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => {
                if (lang !== 'ar') {
                  sfx.play('toggle');
                  onSetLang('ar');
                }
              }}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                lang === 'ar'
                  ? 'bg-red-700 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              العربية
            </button>
            <button
              type="button"
              onClick={() => {
                if (lang !== 'en') {
                  sfx.play('toggle');
                  onSetLang('en');
                }
              }}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                lang === 'en'
                  ? 'bg-red-700 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              English
            </button>
          </div>
        </div>

        {/* Quick Test Mandarin Audio */}
        <button
          type="button"
          onClick={() => {
            audioEngine.speak('你好', { pinyin: 'nǐ hǎo', key: '__test_nihao__' });
          }}
          className={`min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            isTesting
              ? 'bg-teal-700 text-white is-speaking'
              : 'bg-teal-700 hover:bg-teal-800 text-white'
          }`}
        >
          {isTesting ? (
            <span className="eq-bars" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
            </span>
          ) : (
            <Volume2 className="w-4 h-4 shrink-0" aria-hidden="true" />
          )}
          <span>{lang === 'ar' ? 'اختبار الصوت (你好)' : 'Test Voice (你好)'}</span>
        </button>

        {/* Speech Speed Toggle */}
        <button
          type="button"
          onClick={() => {
            sfx.play('toggle');
            onCycleRate();
          }}
          title={lang === 'ar' ? 'سرعة النطق' : 'Speech speed'}
          className="min-h-[38px] px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 text-xs font-semibold font-mono-tabular inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer transition-colors"
        >
          <Gauge className="w-3.5 h-3.5 text-red-700 dark:text-red-400" aria-hidden="true" />
          <span>{speechRate.toFixed(2).replace(/\.00$/, '.0')}x</span>
        </button>

        {/* SFX Toggle */}
        <button
          type="button"
          onClick={onToggleSfx}
          className={`min-h-[38px] px-3 py-1.5 rounded-lg border text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
            sfxEnabled
              ? 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700'
              : 'border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-400 dark:text-slate-500'
          }`}
        >
          {sfxEnabled ? (
            <Volume2 className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400" aria-hidden="true" />
          ) : (
            <VolumeX className="w-3.5 h-3.5" aria-hidden="true" />
          )}
          <span>
            {lang === 'ar'
              ? sfxEnabled ? 'المؤثرات: مفعّلة' : 'المؤثرات: صامتة'
              : sfxEnabled ? 'SFX On' : 'SFX Off'}
          </span>
        </button>

        {/* Pinyin Toggle */}
        <button
          type="button"
          onClick={() => {
            sfx.play('toggle');
            onTogglePinyin();
          }}
          className="min-h-[38px] px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer transition-colors"
        >
          {showPinyin ? (
            <Eye className="w-3.5 h-3.5 text-red-700 dark:text-red-400" aria-hidden="true" />
          ) : (
            <EyeOff className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
          )}
          <span>
            {lang === 'ar'
              ? `البينيين: ${showPinyin ? 'ظاهر' : 'مخفي'}`
              : `Pinyin: ${showPinyin ? 'ON' : 'OFF'}`}
          </span>
        </button>

        {/* Theme Toggle */}
        <button
          type="button"
          onClick={() => {
            sfx.play('toggle');
            onToggleDark();
          }}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          className="min-h-[38px] w-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 inline-flex items-center justify-center shrink-0 cursor-pointer transition-colors"
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
        </button>
      </div>

      {/* Mastery & XP Readout */}
      <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium font-mono-tabular">
        {onOpenProgress ? (
          <button
            type="button"
            onClick={() => {
              sfx.play('tab');
              onOpenProgress();
            }}
            className="hover:text-teal-700 dark:hover:text-teal-400 transition-colors cursor-pointer whitespace-nowrap"
            title={lang === 'ar' ? 'فتح لوحة التقدم' : 'Open Progress Dashboard'}
          >
            {lang === 'ar' ? 'المتقنة:' : 'Mastered:'}{' '}
            <strong className="text-teal-700 dark:text-teal-400">{masteredCount}</strong>
            <span className="text-slate-400 dark:text-slate-500">/{totalWords}</span>
          </button>
        ) : (
          <span>
            {lang === 'ar' ? 'المتقنة:' : 'Mastered:'}{' '}
            <strong className="text-teal-700 dark:text-teal-400">{masteredCount}</strong>
            <span className="text-slate-400 dark:text-slate-500">/{totalWords}</span>
          </span>
        )}
        <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">
          ·
        </span>
        <span>
          <strong className="text-red-700 dark:text-red-400">{xp}</strong> XP
        </span>
      </div>
    </section>
  );
};
