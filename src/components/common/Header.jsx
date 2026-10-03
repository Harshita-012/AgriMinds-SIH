import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Bell, Settings, ChevronLeft, X, Check, Smartphone } from 'lucide-react';
import { SUPPORTED_LANGUAGES, getLanguageConfig } from '../../i18n/languages';
import { storage } from '../../services/storage';
import { sharedStore } from '../../phase2/store';
import SpeakerButton from './SpeakerButton';
import SMSPanelModal from '../../phase2/components/SMSPanelModal';

export default function Header({
  title,
  showBack = false,
  onBack,
  screenSpeakerText = '',
  currentScreen = 'home',
  onNavigate
}) {
  const { t, i18n } = useTranslation();
  const [showLangModal, setShowLangModal] = useState(false);
  const [showNotifModal, setShowNotifModal] = useState(false);
  const [showSMSModal, setShowSMSModal] = useState(false);
  const [notifications, setNotifications] = useState(storage.getNotifications());
  const [smsList, setSmsList] = useState(sharedStore.getState().smsMessages || []);

  const currentLangConfig = getLanguageConfig(i18n.language);

  useEffect(() => {
    setNotifications(storage.getNotifications());
  }, [showNotifModal]);

  useEffect(() => {
    const unsub = sharedStore.subscribe((state) => {
      setSmsList(state.smsMessages || []);
    });
    return () => unsub();
  }, []);

  const handleSelectLang = (code) => {
    i18n.changeLanguage(code);
    storage.setLang(code);
    const langObj = getLanguageConfig(code);
    document.documentElement.dir = langObj.dir || 'ltr';
    document.documentElement.lang = code;
    setShowLangModal(false);
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-emerald-800 text-white shadow-sm">
        <div className="max-w-md mx-auto px-4 py-2.5 flex items-center justify-between">
          {/* Left section: Back button or Logo */}
          <div className="flex items-center gap-2">
            {showBack ? (
              <button
                type="button"
                onClick={onBack}
                className="p-1.5 -ml-1.5 rounded-2xl hover:bg-emerald-700 active:scale-95 transition-all text-white flex items-center gap-1 font-bold text-sm"
                aria-label={t('common.back')}
              >
                <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
                <span>{t('common.back')}</span>
              </button>
            ) : (
              <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => onNavigate && onNavigate('home')}>
                <div className="w-9 h-9 rounded-2xl bg-white p-1 flex items-center justify-center shadow-inner">
                  <img src="/logo.svg" alt="AgriMinds Logo" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h1 className="font-extrabold text-base leading-tight tracking-wide text-emerald-50">
                    {t('common.appName')}
                  </h1>
                </div>
              </div>
            )}
          </div>

          {/* Right section: Speaker, SMS, Language, Notifications, Settings */}
          <div className="flex items-center gap-1.5">
            {/* Screen Reader Speaker */}
            {screenSpeakerText && (
              <SpeakerButton textToRead={screenSpeakerText} size="sm" />
            )}

            {/* Simulated SMS phone button */}
            <button
              type="button"
              onClick={() => setShowSMSModal(true)}
              className="relative p-2 rounded-xl bg-emerald-900/60 hover:bg-emerald-900 text-amber-300 active:scale-95 border border-emerald-600/40"
              title="SMS Messages (Offline proof)"
            >
              <Smartphone className="w-4 h-4" />
              {smsList.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-amber-400 rounded-full animate-ping"></span>
              )}
            </button>

            {/* Language Switcher */}
            <button
              type="button"
              onClick={() => setShowLangModal(true)}
              className="px-2.5 py-1.5 rounded-xl bg-emerald-900/60 hover:bg-emerald-900 text-emerald-100 border border-emerald-600/60 flex items-center gap-1 text-xs font-bold active:scale-95"
              title="Change Language"
            >
              <Globe className="w-4 h-4 text-emerald-300" />
              <span>{currentLangConfig.nativeName}</span>
            </button>

            {/* Notification Bell */}
            <button
              type="button"
              onClick={() => setShowNotifModal(true)}
              className="relative p-2 rounded-xl bg-emerald-900/40 hover:bg-emerald-900 text-white active:scale-95"
              aria-label={t('common.notifications')}
            >
              <Bell className="w-4 h-4" />
              {notifications.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-400 rounded-full ring-2 ring-emerald-800"></span>
              )}
            </button>

            {/* Settings */}
            {currentScreen !== 'settings' && onNavigate && (
              <button
                type="button"
                onClick={() => onNavigate('settings')}
                className="p-2 rounded-xl bg-emerald-900/40 hover:bg-emerald-900 text-white active:scale-95"
                aria-label={t('common.settings')}
              >
                <Settings className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {showBack && title && (
          <div className="bg-emerald-900 px-4 py-1.5 text-xs font-semibold text-emerald-100 flex items-center justify-between border-t border-emerald-700/50">
            <span className="truncate">{title}</span>
          </div>
        )}
      </header>

      {/* SMS Drawer Modal */}
      <SMSPanelModal
        messages={smsList}
        isOpen={showSMSModal}
        onClose={() => setShowSMSModal(false)}
      />

      {/* Language Selection Modal */}
      {showLangModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-stone-300 max-h-[85vh] flex flex-col">
            <div className="p-4 bg-emerald-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-emerald-300" />
                <h3 className="font-bold text-base">{t('language.title')}</h3>
              </div>
              <button
                onClick={() => setShowLangModal(false)}
                className="p-1 rounded-full text-emerald-200 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto grid grid-cols-2 gap-2.5">
              {SUPPORTED_LANGUAGES.map((lang) => {
                const isCurrent = i18n.language === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => handleSelectLang(lang.code)}
                    className={`p-3.5 rounded-2xl text-left border-2 transition-all flex flex-col justify-between min-h-[70px] ${isCurrent
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold shadow-sm'
                        : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-800'
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-base font-bold">{lang.nativeName}</span>
                      {isCurrent && <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />}
                    </div>
                    <span className="text-xs text-stone-500 font-medium">
                      {lang.englishName}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="p-3 bg-stone-100 border-t border-stone-200 text-center text-xs text-stone-500">
              {t('language.previewNote')}
            </div>
          </div>
        </div>
      )}

      {/* Notifications Drawer */}
      {showNotifModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-stone-300 max-h-[85vh] flex flex-col">
            <div className="p-4 bg-emerald-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-300" />
                <h3 className="font-bold text-base">{t('common.notifications')}</h3>
              </div>
              <button
                onClick={() => setShowNotifModal(false)}
                className="p-1 rounded-full text-emerald-200 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-3 divide-y divide-stone-100">
              {notifications.length === 0 ? (
                <div className="text-center py-10 text-stone-500">
                  <Bell className="w-10 h-10 mx-auto text-stone-300 mb-2" />
                  <p className="font-semibold text-sm">No new notifications</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div key={notif.id} className="pt-3 first:pt-0 space-y-1">
                    <div className="flex items-center justify-between">
                      <h5 className="font-bold text-sm text-stone-900">{notif.title}</h5>
                      <span className="text-[10px] font-semibold text-stone-400">{notif.timestamp}</span>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed">{notif.body}</p>
                  </div>
                ))
              )}
            </div>

            <div className="p-3 bg-stone-100 border-t border-stone-200">
              <button
                onClick={() => setShowNotifModal(false)}
                className="w-full btn-secondary text-sm py-2.5"
              >
                {t('common.close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
