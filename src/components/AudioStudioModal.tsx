import React, { useState } from 'react';
import { X, Volume2, Sparkles, Music } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';
import { sfx, SfxName } from '../utils/sfxEngine';
import { UiLang } from './TopBar';

interface AudioStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: UiLang;
  speechRate: number;
  onChangeRate: (rate: number) => void;
  voiceVolume: number;
  onChangeVoiceVolume: (vol: number) => void;
  sfxEnabled: boolean;
  onToggleSfx: () => void;
  sfxVolume: number;
  onChangeSfxVolume: (vol: number) => void;
  autoPlayAudio: boolean;
  onToggleAutoPlay: () => void;
}

const SFX_PREVIEW_LIST: Array<{ id: SfxName; en: string; ar: string }> = [
  { id: 'tilePick', en: 'Tile Tap', ar: 'نقرة الكلمة' },
  { id: 'flip', en: 'Card Flip', ar: 'قلب البطاقة' },
  { id: 'correct', en: 'Correct Chime', ar: 'إجابة صحيحة' },
  { id: 'streak', en: 'Streak Combo', ar: 'سلسلة نجاح' },
  { id: 'mastered', en: 'Word Mastered', ar: 'إتقان كلمة' },
  { id: 'complete', en: 'Level Fanfare', ar: 'إتمام المرحلة' },
  { id: 'wrong', en: 'Gentle Retry', ar: 'تنبيه لطيف' },
];

export const AudioStudioModal: React.FC<AudioStudioModalProps> = ({
  isOpen,
  onClose,
  lang,
  speechRate,
  onChangeRate,
  voiceVolume,
  onChangeVoiceVolume,
  sfxEnabled,
  onToggleSfx,
  sfxVolume,
  onChangeSfxVolume,
  autoPlayAudio,
  onToggleAutoPlay,
}) => {
  const [engineBadge, setEngineBadge] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTestVoice = () => {
    audioEngine.speak('你好，欢迎来到汉语学习中心！', {
      pinyin: 'nǐ hǎo, huānyíng láidào Hànyǔ xuéxí zhōngxīn!',
      key: '__studio_demo__',
      onEngineUsed: (engine) => {
        if (engine === 'tts-proxy') {
          setEngineBadge(lang === 'ar' ? 'نطق صيني أصلي عالي الجودة' : 'Native Mandarin HD Stream');
        } else if (engine === 'web-speech') {
          setEngineBadge(lang === 'ar' ? 'محرك المتصفح الصيني' : 'Browser Mandarin Speech');
        } else {
          setEngineBadge(lang === 'ar' ? 'محاكي النغمات الصينية' : 'Tone Contour Synthesizer');
        }
      },
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={lang === 'ar' ? 'إعدادات الصوت والمؤثرات' : 'Audio & Sound Effects Studio'}
      className="fixed inset-0 z-50 bg-slate-950/55 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        dir={lang === 'ar' ? 'rtl' : 'ltr'}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl animate-settle"
      >
        <div className="flex items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <Music className="w-5 h-5 text-red-700 dark:text-red-400" aria-hidden="true" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {lang === 'ar' ? 'استوديو الصوت والمؤثرات' : 'Audio & Sound Effects Studio'}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => {
              sfx.play('click');
              onClose();
            }}
            aria-label="Close"
            className="w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mandarin Voice Controls */}
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {lang === 'ar' ? 'النطق الصيني (ماندرين)' : 'Mandarin Pronunciation'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {engineBadge || (lang === 'ar' ? 'يعمل بنظام متعدد الطبقات مع تخزين فوري' : 'Multi-layer cached Mandarin speech engine')}
              </p>
            </div>
            <button
              type="button"
              onClick={handleTestVoice}
              className="min-h-[40px] px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold inline-flex items-center gap-2 cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>{lang === 'ar' ? 'تجربة جملة كاملة' : 'Test Full Phrase'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span>{lang === 'ar' ? 'مستوى صوت النطق' : 'Voice Volume'}</span>
                <span className="font-mono-tabular">{Math.round(voiceVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={Math.round(voiceVolume * 100)}
                onChange={(e) => onChangeVoiceVolume(Number(e.target.value) / 100)}
                className="w-full accent-teal-700 cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {lang === 'ar' ? 'سرعة النطق' : 'Playback Speed'}
              </div>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                {[0.75, 1.0, 1.15].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => {
                      sfx.play('toggle');
                      onChangeRate(r);
                    }}
                    className={`py-1.5 text-xs font-semibold font-mono-tabular rounded-md cursor-pointer transition-colors ${
                      speechRate === r
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {r}x
                  </button>
                ))}
              </div>
            </div>
          </div>

          <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
              {lang === 'ar' ? 'تشغيل الصوت تلقائياً في الاختبارات والمحادثات' : 'Auto-play pronunciation in Quizzes & Dialogues'}
            </span>
            <input
              type="checkbox"
              checked={autoPlayAudio}
              onChange={() => {
                sfx.play('toggle');
                onToggleAutoPlay();
              }}
              className="w-4 h-4 accent-teal-700 cursor-pointer"
            />
          </label>
        </div>

        {/* Studio Sound Effects Section */}
        <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-red-700 dark:text-red-400" aria-hidden="true" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {lang === 'ar' ? 'المؤثرات الصوتية التفاعلية' : 'Studio Sound Effects (SFX)'}
              </h3>
            </div>
            <button
              type="button"
              onClick={onToggleSfx}
              className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                sfxEnabled
                  ? 'bg-teal-700 text-white'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {sfxEnabled ? (lang === 'ar' ? 'مفعّلة' : 'Enabled') : lang === 'ar' ? 'صامتة' : 'Muted'}
            </button>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span>{lang === 'ar' ? 'مستوى المؤثرات' : 'SFX Volume'}</span>
              <span className="font-mono-tabular">{Math.round(sfxVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={Math.round(sfxVolume * 100)}
              onChange={(e) => onChangeSfxVolume(Number(e.target.value) / 100)}
              className="w-full accent-red-700 cursor-pointer"
            />
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {SFX_PREVIEW_LIST.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                onClick={() => sfx.play(item.id, idx)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:border-red-600 text-xs font-medium text-slate-800 dark:text-slate-200 cursor-pointer transition-colors"
              >
                {lang === 'ar' ? item.ar : item.en}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
