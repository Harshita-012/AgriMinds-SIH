import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Tractor, ShieldCheck, ChevronRight, User, Building2 } from 'lucide-react';
import SpeakerButton from '../components/common/SpeakerButton';
import { speech } from '../services/speech';
import { ROLES } from '../phase2/roles';

export default function PortalChoiceScreen({ onSelectFarmer, onSelectAdmin, onBack }) {
  const { t, i18n } = useTranslation();
  const isHindi = i18n.language.startsWith('hi');

  const speakerPrompt = isHindi
    ? 'कृपया पोर्टल चुनें: किसान पोर्टल या एडमिन पोर्टल।'
    : 'Please choose your portal: Farmer Portal or Admin Portal.';

  useEffect(() => {
    const timer = setTimeout(() => {
      speech.speak(speakerPrompt, i18n.language);
    }, 400);
    return () => {
      clearTimeout(timer);
      speech.stop();
    };
  }, [i18n.language]);

  const handleAdminChoice = () => {
    // If only one role exists in the registry, go straight to its login form
    if (ROLES.length === 1) {
      onSelectAdmin('admin_login');
    } else {
      onSelectAdmin('admin_roles');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-950 via-stone-900 to-stone-950 text-white flex flex-col justify-between p-4 md:p-6 max-w-md mx-auto">
      {/* Top Bar with Back & App Title */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="p-2 -ml-2 rounded-2xl hover:bg-white/10 active:scale-95 transition-all text-stone-300 hover:text-white flex items-center gap-1.5 font-bold text-xs"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{t('common.back')}</span>
          </button>

          <SpeakerButton textToRead={speakerPrompt} size="sm" />
        </div>

        {/* Title & Subtitle */}
        <div className="text-center space-y-1.5 pt-2">
          <div className="w-14 h-14 rounded-3xl bg-white p-2 mx-auto shadow-xl flex items-center justify-center">
            <img src="/logo.svg" alt="AgriMinds" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-wide">AgriMinds</h1>
          <p className="text-xs font-semibold text-emerald-300">
            {isHindi ? 'कृपया अपना पोर्टल चुनें' : 'Choose Your Portal'}
          </p>
        </div>
      </div>

      {/* EXACTLY TWO VERY LARGE TILES */}
      <div className="my-auto py-6 space-y-4">
        {/* 1. Farmer Portal */}
        <button
          type="button"
          onClick={onSelectFarmer}
          className="w-full p-6 rounded-3xl bg-gradient-to-br from-emerald-800 to-emerald-950 border-2 border-emerald-500 hover:border-amber-400 active:scale-[0.98] shadow-2xl flex items-center justify-between text-left group transition-all min-h-[140px]"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-400 text-stone-950 flex items-center justify-center font-black shadow-lg group-hover:scale-105 transition-transform">
              <Tractor className="w-9 h-9 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight group-hover:text-amber-300 transition-colors">
                {isHindi ? 'किसान पोर्टल' : 'Farmer Portal'}
              </h2>
              <p className="text-xs font-semibold text-emerald-200 mt-1">
                {isHindi ? 'स्लॉट बुकिंग, क्यूआर पास और कतार' : 'Slot booking, QR pass & live queue'}
              </p>
            </div>
          </div>

          <div className="w-10 h-10 rounded-full bg-white/10 group-hover:bg-amber-400 group-hover:text-stone-950 flex items-center justify-center transition-all">
            <ChevronRight className="w-6 h-6 stroke-[3]" />
          </div>
        </button>

        {/* 2. Admin Portal */}
        <button
          type="button"
          onClick={handleAdminChoice}
          className="w-full p-6 rounded-3xl bg-stone-900 border-2 border-stone-700 hover:border-emerald-400 active:scale-[0.98] shadow-xl flex items-center justify-between text-left group transition-all min-h-[140px]"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-stone-800 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-black shadow-md group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-9 h-9 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight group-hover:text-emerald-300 transition-colors">
                {isHindi ? 'एडमिन पोर्टल' : 'Admin Portal'}
              </h2>
              <p className="text-xs font-semibold text-stone-400 mt-1">
                {isHindi ? 'मंडी स्टाफ, सत्यापन और तौल संचालन' : 'Mandi staff, verification & weighing'}
              </p>
            </div>
          </div>

          <div className="w-10 h-10 rounded-full bg-stone-800 group-hover:bg-emerald-400 group-hover:text-stone-950 flex items-center justify-center transition-all">
            <ChevronRight className="w-6 h-6 stroke-[3]" />
          </div>
        </button>
      </div>

      {/* Footer */}
      <div className="pb-3 text-center">
        <p className="text-[11px] text-stone-500 font-medium">
          {isHindi ? 'AgriMinds - डिजिटल कृषि विपणन मंच' : 'AgriMinds - Digital Agricultural Mandi Platform'}
        </p>
      </div>
    </div>
  );
}
