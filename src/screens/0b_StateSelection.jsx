import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Search, ChevronRight } from 'lucide-react';
import Header from '../components/common/Header';
import { STATES_DATA } from '../data/mockData';
import { storage } from '../services/storage';

export default function StateSelectionScreen({ onSelectState, onBack }) {
  const { t, i18n } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  const isHindi = i18n.language.startsWith('hi');
  const speakerText = t('stateSelect.speakerText');

  const filteredStates = STATES_DATA.filter((state) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      state.nameEn.toLowerCase().includes(q) ||
      state.nameHi.includes(q) ||
      state.id.toLowerCase().includes(q)
    );
  });

  const handleChooseState = (stateObj) => {
    const chosenName = isHindi ? stateObj.nameHi : stateObj.nameEn;
    // Save state in storage
    storage.saveState(stateObj.nameEn);
    // Move on immediately (One tap selects and moves on. No extra Continue button)
    onSelectState(stateObj);
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col max-w-md mx-auto">
      <Header
        showBack={true}
        onBack={onBack}
        title={t('stateSelect.title')}
        screenSpeakerText={speakerText}
      />

      <main className="p-4 space-y-4 flex-1 overflow-y-auto pb-10">
        {/* Title Card */}
        <div className="bg-emerald-800 text-white rounded-3xl p-5 shadow-sm space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-amber-300">
              <MapPin className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold">{t('stateSelect.title')}</h2>
              <p className="text-xs text-emerald-200 font-medium">{t('stateSelect.subtitle')}</p>
            </div>
          </div>

          {/* Search Box */}
          <div className="pt-2">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3.5 top-3 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('stateSelect.searchPlaceholder')}
                className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-white text-stone-900 placeholder-stone-400 font-medium text-sm border border-emerald-600 outline-none shadow-inner"
              />
            </div>
          </div>
        </div>

        {/* Visual Grid of Large State Tiles */}
        <div className="grid grid-cols-2 gap-3">
          {filteredStates.map((state) => {
            const primaryName = isHindi ? state.nameHi : state.nameEn;
            const secondaryName = isHindi ? state.nameEn : state.nameHi;

            return (
              <button
                key={state.id}
                type="button"
                onClick={() => handleChooseState(state)}
                className="p-4 rounded-3xl bg-white border border-stone-200 shadow-sm hover:shadow-md hover:border-emerald-600 active:scale-95 transition-all text-left flex flex-col justify-between min-h-[90px] group"
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-2xl">{state.icon || '🌾'}</span>
                  <ChevronRight className="w-4 h-4 text-stone-300 group-hover:text-emerald-700 transition-colors" />
                </div>
                <div>
                  <h3 className="font-extrabold text-stone-900 text-sm leading-snug group-hover:text-emerald-800">
                    {primaryName}
                  </h3>
                  <p className="text-[11px] text-stone-500 font-medium mt-0.5">
                    {secondaryName}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {filteredStates.length === 0 && (
          <div className="text-center py-12 text-stone-500">
            <MapPin className="w-12 h-12 mx-auto text-stone-300 mb-2" />
            <p className="font-bold">{t('stateSelect.noResults')}</p>
          </div>
        )}
      </main>
    </div>
  );
}
