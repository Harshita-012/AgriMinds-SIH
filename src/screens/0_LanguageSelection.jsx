import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, Globe } from 'lucide-react';
import { SUPPORTED_LANGUAGES, getLanguageConfig } from '../i18n/languages';
import { storage } from '../services/storage';
import { speech } from '../services/speech';
import SpeakerButton from '../components/common/SpeakerButton';

export default function LanguageSelectionScreen({ onContinue }) {
  const { t, i18n } = useTranslation();
  // Hindi is the default on the Language screen
  const [selectedCode, setSelectedCode] = useState('hi');
  const [showDeletedBanner, setShowDeletedBanner] = useState(false);

  useEffect(() => {
    if (storage.getDeletedNotice()) {
      setShowDeletedBanner(true);
      setTimeout(() => setShowDeletedBanner(false), 4000);
    }
  }, []);

  // Spoken prompt in Hindi by default on first mount
  useEffect(() => {
    // Ensure language is set to Hindi on this screen
    i18n.changeLanguage('hi');
    const timer = setTimeout(() => {
      speech.speak('नमस्ते किसान भाई, अपनी भाषा चुनें और आगे बढ़ें।', 'hi');
    }, 400);
    return () => {
      clearTimeout(timer);
      speech.stop();
    };
  }, []);

  const handleSelect = (code) => {
    setSelectedCode(code);
    i18n.changeLanguage(code);
    const langObj = getLanguageConfig(code);
    document.documentElement.dir = langObj.dir || 'ltr';
    document.documentElement.lang = code;
    
    // Spoken feedback in the selected language
    if (code === 'hi') {
      speech.speak('हिन्दी भाषा चुी गई', 'hi');
    } else if (code === 'en') {
      speech.speak('English language selected', 'en');
    }
  };

  const handleConfirm = () => {
    storage.setLang(selectedCode);
    i18n.changeLanguage(selectedCode);
    speech.stop();
    onContinue();
  };

  const promptSpeakerText = selectedCode === 'hi' 
    ? 'नमस्ते किसान भाई, अपनी भाषा चुनें और आगे बढ़ें।' 
    : 'Welcome, please choose your language and press continue.';

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-900 via-emerald-800 to-stone-900 text-white flex flex-col justify-between p-4 md:p-6 max-w-md mx-auto">
      {/* Top Header */}
      <div className="space-y-4 pt-2">
        {showDeletedBanner && (
          <div className="p-3.5 bg-emerald-500 text-stone-950 font-black text-xs rounded-2xl flex items-center justify-center gap-2 shadow-lg animate-bounce">
            <span>✓ {t('settings.dataDeletedToast')}</span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white p-1.5 shadow-lg flex items-center justify-center">
              <img src="/logo.svg" alt="AgriMinds" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-wide">AgriMinds</h1>
              <p className="text-xs text-emerald-200 font-medium">{t('common.appTagline')}</p>
            </div>
          </div>
          <SpeakerButton textToRead={promptSpeakerText} size="sm" />
        </div>

        {/* Title and Instruction */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-4 border border-white/20 text-center space-y-1">
          <div className="flex items-center justify-center gap-2 text-amber-300 font-bold text-sm mb-1">
            <Globe className="w-4 h-4" />
            <span>{t('language.title')}</span>
          </div>
          <h2 className="text-xl font-extrabold text-white">
            {t('language.subtitle')}
          </h2>
        </div>
      </div>

      {/* Grid of Indian Languages */}
      <div className="my-4 grid grid-cols-2 sm:grid-cols-3 gap-2.5 overflow-y-auto max-h-[52vh] pr-1 py-1">
        {SUPPORTED_LANGUAGES.map((lang) => {
          const isSelected = selectedCode === lang.code;
          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => handleSelect(lang.code)}
              className={`p-3.5 rounded-2xl text-left border-2 transition-all flex flex-col justify-between min-h-[78px] active:scale-95 ${
                isSelected
                  ? 'bg-amber-400 text-stone-950 border-amber-300 shadow-xl shadow-amber-400/20 scale-[1.02]'
                  : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-lg font-black tracking-tight">{lang.nativeName}</span>
                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-stone-950 text-amber-400 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 stroke-[3.5]" />
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between text-[11px] font-semibold opacity-90 mt-1">
                <span>{lang.englishName}</span>
                {!lang.isTranslated && (
                  <span className="text-[9px] px-1 py-0.2 bg-black/30 rounded text-amber-200">
                    Hindi
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Bottom Pinned Continue Action */}
      <div className="pt-2 pb-1">
        <button
          type="button"
          onClick={handleConfirm}
          className="w-full min-h-[58px] bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-stone-950 font-black text-xl rounded-2xl shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-3 transition-transform active:scale-[0.98]"
        >
          <span>{t('language.continueBtn')}</span>
          <span className="text-xl">➔</span>
        </button>
      </div>
    </div>
  );
}

