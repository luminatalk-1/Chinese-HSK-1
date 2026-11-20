import React from 'react';
import { Volume2 } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

interface SpeakButtonProps {
  text: string;
  pinyin?: string;
  playKey?: string;
  activeKey: string | null;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'subtle';
  ariaLabel?: string;
  onAfterTrigger?: () => void;
}

export const SpeakButton: React.FC<SpeakButtonProps> = ({
  text,
  pinyin,
  playKey,
  activeKey,
  label,
  size = 'md',
  variant = 'primary',
  ariaLabel,
  onAfterTrigger,
}) => {
  const key = playKey || text;
  const isSpeaking = activeKey === key;

  const sizeClasses =
    size === 'sm'
      ? 'min-h-[36px] px-2.5 py-1.5 text-xs gap-1.5 rounded-lg'
      : size === 'lg'
        ? 'min-h-[44px] px-5 py-2.5 text-sm gap-2.5 rounded-xl'
        : 'min-h-[40px] px-3 py-2 text-xs gap-2 rounded-xl';

  const variantClasses =
    variant === 'primary'
      ? isSpeaking
        ? 'bg-red-700 text-white shadow-sm'
        : 'bg-slate-900 text-white hover:bg-red-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-red-600 dark:hover:text-white'
      : isSpeaking
        ? 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/60 dark:text-red-300 dark:border-red-800'
        : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-700';

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    audioEngine.speak(text, { pinyin, key });
    onAfterTrigger?.();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={ariaLabel || `Pronounce ${text}`}
      className={`inline-flex items-center justify-center font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 ${sizeClasses} ${variantClasses} ${isSpeaking ? 'is-speaking' : ''}`}
    >
      {isSpeaking ? (
        <span className="eq-bars" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </span>
      ) : (
        <Volume2 className="w-4 h-4 shrink-0" aria-hidden="true" />
      )}
      {label && <span>{label}</span>}
    </button>
  );
};
