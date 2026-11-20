import React from 'react';
import { UiLang } from './TopBar';
import { ArenaView } from './ArenaView';
import { ArcadeView } from './ArcadeView';
import { LiveTutorView } from './LiveTutorView';
import { sfx } from '../utils/sfxEngine';

export type PracticeSubTab = 'live' | 'arena' | 'builder' | 'dialogue';

interface PracticeViewProps {
  lang: UiLang;
  showPinyin: boolean;
  activeAudioKey: string | null;
  autoPlayAudio: boolean;
  onAwardXp: (amount: number, toastMsg?: string) => void;
  subTab: PracticeSubTab;
  onSelectSubTab: (tab: PracticeSubTab) => void;
  arenaUnit: number;
  onSelectArenaUnit: (unitId: number) => void;
}

export const PracticeView: React.FC<PracticeViewProps> = ({
  lang,
  showPinyin,
  activeAudioKey,
  autoPlayAudio,
  onAwardXp,
  subTab,
  onSelectSubTab,
  arenaUnit,
  onSelectArenaUnit,
}) => {
  return (
    <div className="space-y-6" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1.5 p-1.5 bg-slate-200/75 dark:bg-slate-800 rounded-xl">
        <button
          type="button"
          onClick={() => {
            sfx.play('tab');
            onSelectSubTab('live');
          }}
          className={`py-2.5 px-4 rounded-lg text-xs sm:text-sm font-semibold cursor-pointer transition-colors whitespace-nowrap ${
            subTab === 'live'
              ? 'bg-white dark:bg-slate-700 text-red-700 dark:text-red-300 shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
          }`}
        >
          {lang === 'ar' ? 'محادثة مباشرة مع الذكاء الاصطناعي' : 'Live AI Voice Practice'}
        </button>

        <button
          type="button"
          onClick={() => {
            sfx.play('tab');
            onSelectSubTab('arena');
          }}
          className={`py-2.5 px-4 rounded-lg text-xs sm:text-sm font-semibold cursor-pointer transition-colors whitespace-nowrap ${
            subTab === 'arena'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
          }`}
        >
          {lang === 'ar' ? 'اختبار الوحدات والامتحان' : 'Unit Quiz & Mock Exam'}
        </button>

        <button
          type="button"
          onClick={() => {
            sfx.play('tab');
            onSelectSubTab('builder');
          }}
          className={`py-2.5 px-4 rounded-lg text-xs sm:text-sm font-semibold cursor-pointer transition-colors whitespace-nowrap ${
            subTab === 'builder'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
          }`}
        >
          {lang === 'ar' ? 'ترتيب الجمل الصينية' : 'Sentence Builder'}
        </button>

        <button
          type="button"
          onClick={() => {
            sfx.play('tab');
            onSelectSubTab('dialogue');
          }}
          className={`py-2.5 px-4 rounded-lg text-xs sm:text-sm font-semibold cursor-pointer transition-colors whitespace-nowrap ${
            subTab === 'dialogue'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
          }`}
        >
          {lang === 'ar' ? '٤ محادثات واقعية' : '4 Real-Life Dialogues'}
        </button>
      </div>

      {subTab === 'live' ? (
        <LiveTutorView
          lang={lang}
          showPinyin={showPinyin}
          onAwardXp={onAwardXp}
          defaultUnitId={arenaUnit || 1}
        />
      ) : subTab === 'arena' ? (
        <ArenaView
          lang={lang}
          showPinyin={showPinyin}
          activeAudioKey={activeAudioKey}
          autoPlayAudio={autoPlayAudio}
          onAwardXp={onAwardXp}
          selectedUnit={arenaUnit}
          onSelectUnit={onSelectArenaUnit}
        />
      ) : (
        <ArcadeView
          lang={lang}
          showPinyin={showPinyin}
          activeAudioKey={activeAudioKey}
          autoPlayAudio={autoPlayAudio}
          onAwardXp={onAwardXp}
          mode={subTab}
        />
      )}
    </div>
  );
};
