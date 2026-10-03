import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  MapPin, 
  Sparkles, 
  ArrowRight
} from 'lucide-react';
import Header from '../components/common/Header';
import BottomNav from '../components/common/BottomNav';
import { storage } from '../services/storage';
import { getCentersByState } from '../data/mockData';

export default function CentersListScreen({ onSelectCenter, onNavigate, onBack }) {
  const { t, i18n } = useTranslation();
  const isHindi = i18n.language.startsWith('hi');
  const savedState = storage.getState() || 'Haryana';

  const speakerText = t('centers.speakerText');
  const centers = getCentersByState(savedState);
  const sortedCenters = [...centers].sort((a, b) => a.distanceKm - b.distanceKm);

  // Smart suggestion check
  const nearestCenter = sortedCenters[0];
  const isNearestBusy = nearestCenter && nearestCenter.crowdLevel === 'high';
  const suggestedCenter = sortedCenters.find(c => c.crowdLevel === 'low');

  const getCrowdVisual = (level) => {
    switch (level) {
      case 'low':
        return {
          dotColor: 'bg-emerald-500',
          badgeText: t('centers.crowdLow'),
          badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-300'
        };
      case 'medium':
        return {
          dotColor: 'bg-amber-500',
          badgeText: t('centers.crowdMedium'),
          badgeClass: 'bg-amber-100 text-amber-900 border-amber-300'
        };
      case 'high':
      default:
        return {
          dotColor: 'bg-red-500',
          badgeText: t('centers.crowdHigh'),
          badgeClass: 'bg-red-100 text-red-900 border-red-300'
        };
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col max-w-md mx-auto">
      <Header
        showBack={true}
        onBack={onBack}
        title={t('centers.title')}
        screenSpeakerText={speakerText}
        onNavigate={onNavigate}
        currentScreen="centers"
      />

      <main className="p-4 space-y-3.5 flex-1 overflow-y-auto pb-24">
        {/* Header Title */}
        <div className="space-y-0.5">
          <h2 className="text-xl font-extrabold text-stone-900">{t('centers.title')}</h2>
          <p className="text-xs text-stone-500 font-medium">
            {t('centers.subtitle')}
          </p>
        </div>

        {/* Smart Suggestion Banner */}
        {isNearestBusy && suggestedCenter && (
          <div className="p-4 bg-amber-400 rounded-3xl text-stone-950 shadow-sm border border-amber-500 space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-stone-950 shrink-0" />
              <div>
                <h3 className="font-extrabold text-xs uppercase tracking-wide">
                  {t('centers.smartSuggestionTitle')}
                </h3>
                <p className="text-[11px] font-semibold text-stone-900">
                  {t('centers.smartSuggestionBody')}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onSelectCenter(suggestedCenter)}
              className="w-full py-2.5 px-4 bg-stone-950 hover:bg-stone-900 active:scale-98 text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs"
            >
              <span>{isHindi ? suggestedCenter.nameHi : suggestedCenter.nameEn}</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>
          </div>
        )}

        {/* Centers List - Visual Cards with Color Dot and Small Slots Left */}
        <div className="space-y-3">
          {sortedCenters.map((center, idx) => {
            const availableSlots = center.capacityPerSlot - center.activeBookings;
            const centerName = isHindi ? center.nameHi : center.nameEn;
            const centerAddress = isHindi ? center.addressHi : center.addressEn;
            const crowd = getCrowdVisual(center.crowdLevel);

            return (
              <div
                key={center.id}
                onClick={() => onSelectCenter(center)}
                className="p-4 rounded-3xl bg-white border border-stone-200 shadow-sm hover:border-emerald-600 hover:shadow-md active:scale-[0.99] transition-all cursor-pointer space-y-3 group"
              >
                {/* Top Row: Distance & Crowd Indicator Dot/Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
                    <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{t('common.distanceKm', { count: center.distanceKm })}</span>
                    {idx === 0 && (
                      <span className="text-[10px] text-amber-700 font-extrabold">({t('centers.nearest')})</span>
                    )}
                  </div>

                  {/* Crowd Level Badge with Dot */}
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${crowd.badgeClass}`}>
                    <span className={`w-2 h-2 rounded-full ${crowd.dotColor}`} />
                    <span>{crowd.badgeText}</span>
                  </span>
                </div>

                {/* Center Name & Address */}
                <div>
                  <h3 className="font-extrabold text-base text-stone-900 leading-snug group-hover:text-emerald-800">
                    {centerName}
                  </h3>
                  <p className="text-xs text-stone-500 font-medium mt-0.5 truncate">
                    {centerAddress}
                  </p>
                </div>

                {/* Bottom Row: Slots Left and Book Action */}
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-700 bg-stone-100 px-2.5 py-1 rounded-xl">
                    {t('centers.slotsLeft', { available: availableSlots })}
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectCenter(center);
                    }}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs flex items-center gap-1 shadow-sm active:scale-95"
                  >
                    <span>{t('centers.bookSlotForCenter')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Walk-in Notice */}
        <p className="text-[11px] text-stone-500 text-center font-medium pt-1">
          {t('centers.walkInNotice')}
        </p>
      </main>

      <BottomNav currentScreen="centers" onNavigate={onNavigate || (() => {})} />
    </div>
  );
}
