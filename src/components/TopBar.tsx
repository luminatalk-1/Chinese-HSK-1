import React from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { sfx } from '../utils/sfxEngine';

export type MainTab = 'units' | 'progress' | 'characters' | 'pinyin' | 'grammar' | 'practice';
export type UiLang = 'en' | 'ar';

interface TopBarProps {
  activeTab: MainTab;
  onSelectTab: (tab: MainTab) => void;
  lang: UiLang;
  onOpenAudioStudio: () => void;
}

const NAV_ITEMS: Array<{ id: MainTab; en: string; ar: string }> = [
  { id: 'units', en: 'Units', ar: 'الوحدات' },
  { id: 'progress', en: 'Progress', ar: 'التقدم' },
  { id: 'characters', en: 'Characters', ar: 'الحروف' },
  { id: 'pinyin', en: 'Pinyin', ar: 'الصوتيات' },
  { id: 'grammar', en: 'Grammar', ar: 'القواعد' },
  { id: 'practice', en: 'Practice', ar: 'الممارسة' },
];

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  onSelectTab,
  lang,
  onOpenAudioStudio,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div
        dir={lang === 'ar' ? 'rtl' : 'ltr'}
        className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 sm:gap-8"
      >
        {/* Zone 1: Single-line Brand Wordmark */}
        <button
          type="button"
          onClick={() => {
            sfx.play('tab');
            onSelectTab('units');
          }}
          className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100 whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-red-600 rounded"
        >
          <span className="font-hanzi text-red-700 dark:text-red-500 text-xl" aria-hidden="true">
            汉
          </span>
          <span>HSK 1 Studio</span>
        </button>

        {/* Zone 2: 5 concise single-line text navigation links */}
        <nav
          aria-label={lang === 'ar' ? 'الأقسام الرئيسية' : 'Primary sections'}
          className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar py-1"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  sfx.play('tab');
                  onSelectTab(item.id);
                }}
                className={`relative py-1.5 text-sm font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-red-600 rounded ${
                  isActive
                    ? 'text-red-700 dark:text-red-400'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
                }`}
              >
                {lang === 'ar' ? item.ar : item.en}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-700 dark:bg-red-400 rounded-full"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="shrink-0">
          <button
            type="button"
            onClick={() => {
              sfx.play('click');
              onOpenAudioStudio();
            }}
            className="min-h-[40px] px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-red-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-red-600 dark:hover:text-white rounded-lg transition-colors whitespace-nowrap shrink-0 inline-flex items-center gap-2 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
          >
            <SlidersHorizontal className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span className="hidden sm:inline">{lang === 'ar' ? 'استوديو الصوت' : 'Audio Studio'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
