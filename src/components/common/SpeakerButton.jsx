import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { speech } from '../../services/speech';

export default function SpeakerButton({ textToRead, className = '', size = 'md' }) {
  const { t, i18n } = useTranslation();
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    const unsub = speech.subscribe((state) => {
      setSpeaking(state);
    });
    return () => unsub();
  }, []);

  const handleToggle = (e) => {
    e.stopPropagation();
    if (speaking) {
      speech.stop();
    } else {
      speech.speak(textToRead, i18n.language);
    }
  };

  const isSmall = size === 'sm';
  const isLarge = size === 'lg';

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`relative inline-flex items-center justify-center gap-2 rounded-2xl font-bold transition-all duration-200 active:scale-95 ${
        speaking
          ? 'bg-amber-500 text-stone-950 ring-4 ring-amber-300 shadow-lg'
          : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300'
      } ${
        isSmall ? 'p-2 text-xs' : isLarge ? 'px-5 py-3 text-base' : 'px-3.5 py-2 text-sm'
      } ${className}`}
      title={speaking ? t('common.speakerStop') : t('common.speaker')}
      aria-label={speaking ? t('common.speakerStop') : t('common.speaker')}
    >
      {speaking ? (
        <>
          <VolumeX className={isSmall ? 'w-4 h-4' : 'w-5 h-5'} />
          <div className="flex items-end gap-0.5 h-4">
            <span className="w-1 bg-stone-900 rounded-full animate-wave-1"></span>
            <span className="w-1 bg-stone-900 rounded-full animate-wave-2"></span>
            <span className="w-1 bg-stone-900 rounded-full animate-wave-3"></span>
          </div>
          {!isSmall && <span>{t('common.speakerStop')}</span>}
        </>
      ) : (
        <>
          <Volume2 className={`${isSmall ? 'w-4 h-4' : 'w-5 h-5'} text-emerald-800`} />
          {!isSmall && <span>{t('common.speaker')}</span>}
        </>
      )}
    </button>
  );
}
