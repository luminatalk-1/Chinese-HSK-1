import { useState, useEffect, useCallback, useRef } from 'react';
import { TopBar, MainTab, UiLang } from './components/TopBar';
import { WorkspaceToolbar } from './components/WorkspaceToolbar';
import { AudioStudioModal } from './components/AudioStudioModal';
import { EncyclopediaView } from './components/EncyclopediaView';
import { CharactersView } from './components/CharactersView';
import { PinyinLabView } from './components/PinyinLabView';
import { GrammarView } from './components/GrammarView';
import { PracticeView, PracticeSubTab } from './components/PracticeView';
import { HSK1_WORDS } from './data/hsk1Data';
import { audioEngine } from './utils/audioEngine';
import { sfx } from './utils/sfxEngine';

const STORAGE_KEYS = {
  mastered: 'hsk1_studio_mastered_v2',
  xp: 'hsk1_studio_xp_v2',
  lang: 'hsk1_studio_lang_v2',
  dark: 'hsk1_studio_dark_v2',
  sfx: 'hsk1_studio_sfx_v2',
};

export default function App() {
  const [activeTab, setActiveTab] = useState<MainTab>('units');
  const [selectedUnit, setSelectedUnit] = useState<number>(1);
  const [practiceSubTab, setPracticeSubTab] = useState<PracticeSubTab>('arena');
  const [arenaUnit, setArenaUnit] = useState<number>(1);

  const [lang, setLang] = useState<UiLang>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.lang);
      return saved === 'en' ? 'en' : 'ar';
    } catch {
      return 'ar';
    }
  });
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.dark) === 'true';
    } catch {
      return false;
    }
  });
  const [showPinyin, setShowPinyin] = useState(true);
  const [speechRate, setSpeechRate] = useState(1.0);
  const [voiceVolume, setVoiceVolume] = useState(1.0);
  const [sfxEnabled, setSfxEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.sfx);
      return saved === null ? true : saved === 'true';
    } catch {
      return true;
    }
  });
  const [sfxVolume, setSfxVolume] = useState(0.72);
  const [autoPlayAudio, setAutoPlayAudio] = useState(true);
  const [audioModalOpen, setAudioModalOpen] = useState(false);

  const [masteredIds, setMasteredIds] = useState<Set<string>>(() => {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEYS.mastered) || '[]');
      return Array.isArray(parsed) ? new Set(parsed) : new Set();
    } catch {
      return new Set();
    }
  });

  const [xp, setXp] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem(STORAGE_KEYS.xp) || '0', 10) || 0;
    } catch {
      return 0;
    }
  });

  const [activeAudioKey, setActiveAudioKey] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) root.classList.add('dark');
    else root.classList.remove('dark');
    try {
      localStorage.setItem(STORAGE_KEYS.dark, String(isDark));
    } catch {
      // ignore
    }
  }, [isDark]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.lang, lang);
    } catch {
      // ignore
    }
  }, [lang]);

  useEffect(() => {
    sfx.setEnabled(sfxEnabled);
    try {
      localStorage.setItem(STORAGE_KEYS.sfx, String(sfxEnabled));
    } catch {
      // ignore
    }
  }, [sfxEnabled]);

  useEffect(() => {
    sfx.setVolume(sfxVolume);
  }, [sfxVolume]);

  useEffect(() => {
    audioEngine.setRate(speechRate);
  }, [speechRate]);

  useEffect(() => {
    audioEngine.setVolume(voiceVolume);
  }, [voiceVolume]);

  useEffect(() => {
    return audioEngine.subscribe((key) => {
      setActiveAudioKey(key);
    });
  }, []);

  useEffect(() => {
    const unlock = () => {
      sfx.unlock();
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
    window.addEventListener('pointerdown', unlock, { passive: true });
    window.addEventListener('keydown', unlock, { passive: true });
    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
  }, []);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setToast(null);
    }, 2200);
  }, []);

  const persistProgress = useCallback((nextMastered: Set<string>, nextXp: number) => {
    try {
      localStorage.setItem(STORAGE_KEYS.mastered, JSON.stringify([...nextMastered]));
      localStorage.setItem(STORAGE_KEYS.xp, String(nextXp));
    } catch {
      // ignore
    }
  }, []);

  const handleToggleMastered = useCallback(
    (wordId: string) => {
      setMasteredIds((prev) => {
        const next = new Set(prev);
        let nextXp = xp;
        if (next.has(wordId)) {
          next.delete(wordId);
          sfx.play('click');
        } else {
          next.add(wordId);
          nextXp += 10;
          setXp(nextXp);
          sfx.play('mastered');
          showToast(lang === 'ar' ? 'تم إتقان الكلمة (+10 نقطة خبرة)' : 'Marked Mastered (+10 XP)');
        }
        persistProgress(next, nextXp);
        return next;
      });
    },
    [xp, lang, showToast, persistProgress]
  );

  const handleAwardXp = useCallback(
    (amount: number, msg?: string) => {
      setXp((prev) => {
        const nextXp = prev + amount;
        persistProgress(masteredIds, nextXp);
        return nextXp;
      });
      if (msg) showToast(msg);
    },
    [masteredIds, persistProgress, showToast]
  );

  const handleCycleRate = () => {
    const speeds = [0.75, 1.0, 1.15];
    const nextIdx = (speeds.indexOf(speechRate) + 1) % speeds.length;
    const nextRate = speeds[nextIdx];
    setSpeechRate(nextRate);
    showToast(
      lang === 'ar'
        ? `سرعة النطق: ${nextRate}x`
        : `Speech Speed: ${nextRate}x`
    );
  };

  const handleToggleSfx = () => {
    const next = !sfxEnabled;
    setSfxEnabled(next);
    if (next) {
      sfx.setEnabled(true);
      sfx.play('toggle');
    }
    showToast(
      lang === 'ar'
        ? next ? 'تم تفعيل المؤثرات الصوتية' : 'تم كتم المؤثرات الصوتية'
        : next ? 'Sound Effects Enabled' : 'Sound Effects Muted'
    );
  };

  const handleSelectTab = (tab: MainTab) => {
    audioEngine.stop();
    setActiveTab(tab);
  };

  const handleQuizUnit = (unitId: number) => {
    audioEngine.stop();
    setArenaUnit(unitId);
    setPracticeSubTab('arena');
    setActiveTab('practice');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <TopBar
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        lang={lang}
        onOpenAudioStudio={() => setAudioModalOpen(true)}
      />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <WorkspaceToolbar
          lang={lang}
          onSetLang={setLang}
          isDark={isDark}
          onToggleDark={() => setIsDark((prev) => !prev)}
          showPinyin={showPinyin}
          onTogglePinyin={() => setShowPinyin((prev) => !prev)}
          speechRate={speechRate}
          onCycleRate={handleCycleRate}
          sfxEnabled={sfxEnabled}
          onToggleSfx={handleToggleSfx}
          masteredCount={masteredIds.size}
          totalWords={HSK1_WORDS.length}
          xp={xp}
          activeAudioKey={activeAudioKey}
        />

        {activeTab === 'units' && (
          <EncyclopediaView
            lang={lang}
            showPinyin={showPinyin}
            masteredIds={masteredIds}
            onToggleMastered={handleToggleMastered}
            activeAudioKey={activeAudioKey}
            selectedUnit={selectedUnit}
            onSelectUnit={setSelectedUnit}
            onQuizUnit={handleQuizUnit}
          />
        )}

        {activeTab === 'characters' && (
          <CharactersView
            lang={lang}
            showPinyin={showPinyin}
            activeAudioKey={activeAudioKey}
          />
        )}

        {activeTab === 'pinyin' && (
          <PinyinLabView
            lang={lang}
            activeAudioKey={activeAudioKey}
            autoPlayAudio={autoPlayAudio}
            onAwardXp={(amt) =>
              handleAwardXp(
                amt,
                lang === 'ar' ? `+${amt} نقطة! تمييز صوتي دقيق` : `+${amt} XP! Accurate tone & Pinyin`
              )
            }
          />
        )}

        {activeTab === 'grammar' && (
          <GrammarView
            lang={lang}
            showPinyin={showPinyin}
            activeAudioKey={activeAudioKey}
          />
        )}

        {activeTab === 'practice' && (
          <PracticeView
            lang={lang}
            showPinyin={showPinyin}
            activeAudioKey={activeAudioKey}
            autoPlayAudio={autoPlayAudio}
            onAwardXp={handleAwardXp}
            subTab={practiceSubTab}
            onSelectSubTab={setPracticeSubTab}
            arenaUnit={arenaUnit}
            onSelectArenaUnit={setArenaUnit}
          />
        )}
      </main>

      <AudioStudioModal
        isOpen={audioModalOpen}
        onClose={() => setAudioModalOpen(false)}
        lang={lang}
        speechRate={speechRate}
        onChangeRate={setSpeechRate}
        voiceVolume={voiceVolume}
        onChangeVoiceVolume={setVoiceVolume}
        sfxEnabled={sfxEnabled}
        onToggleSfx={handleToggleSfx}
        sfxVolume={sfxVolume}
        onChangeSfxVolume={setSfxVolume}
        autoPlayAudio={autoPlayAudio}
        onToggleAutoPlay={() => setAutoPlayAudio((p) => !p)}
      />

      <div
        aria-live="polite"
        className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-50 pointer-events-none transition-all duration-200 ${
          toast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}
      >
        {toast && (
          <div className="px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs sm:text-sm font-semibold shadow-lg whitespace-nowrap">
            {toast}
          </div>
        )}
      </div>

      <footer
        dir={lang === 'ar' ? 'rtl' : 'ltr'}
        className="border-t border-slate-200 dark:border-slate-800 py-5 text-center text-xs text-slate-500 dark:text-slate-400 px-4"
      >
        {lang === 'ar'
          ? `استوديو HSK 1 الشامل · ${HSK1_WORDS.length} كلمة في ١٢ وحدة منفصلة + جذور الحروف + الصوتيات + القواعد + الاختبارات · يُحفظ التقدم تلقائياً`
          : `HSK 1 Complete Reference Studio · ${HSK1_WORDS.length} Words across 12 Isolated Units · Characters, Pinyin, Grammar & Practice · Progress Saved Automatically`}
      </footer>
    </div>
  );
}
