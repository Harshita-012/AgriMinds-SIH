import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Calendar, 
  Users, 
  CreditCard, 
  HelpCircle, 
  QrCode, 
  ArrowRight, 
  Phone
} from 'lucide-react';
import Header from '../components/common/Header';
import BottomNav from '../components/common/BottomNav';
import { storage } from '../services/storage';
import OfflineBanner from '../phase3/components/OfflineBanner';
import FloatingAIAssistantButton from '../phase3/components/FloatingAIAssistantButton';

export default function HomeScreen({ onNavigate }) {
  const { t, i18n } = useTranslation();

  const user = storage.getUser() || { fullName: 'Farmer' };
  const activeToken = storage.getActiveToken();

  const speakerText = activeToken
    ? t('home.statusBannerActive', { token: activeToken.tokenNumber, center: activeToken.centerName })
    : t('home.greeting', { name: user.fullName || 'Farmer' });

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col max-w-md mx-auto relative font-sans">
      {/* Offline sync banner if offline */}
      <OfflineBanner />

      {/* Top Bar with language, bell, settings */}
      <Header
        currentScreen="home"
        onNavigate={onNavigate}
        screenSpeakerText={speakerText}
      />

      <main className="p-4 space-y-4 flex-1 overflow-y-auto pb-24">
        {/* Welcome Greeting & Active Token Banner */}
        <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 text-white rounded-3xl p-5 shadow-sm space-y-2">
          <h2 className="text-xl font-extrabold text-white">
            {t('home.greeting', { name: user.fullName || 'Farmer' })}
          </h2>

          {activeToken ? (
            <div 
              onClick={() => onNavigate('token')}
              className="mt-2 p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 flex items-center justify-between cursor-pointer hover:bg-white/15 active:scale-98 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center font-black text-base shadow-sm">
                  <QrCode className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs text-amber-300 font-bold">
                    {t('home.activeToken')} #{activeToken.tokenNumber}
                  </div>
                  <div className="text-[11px] text-emerald-100 truncate max-w-[170px]">
                    {activeToken.centerName}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-emerald-300">
                <span>{t('home.viewPass')}</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          ) : (
            <p className="text-xs text-emerald-100 font-medium pt-1">
              {t('home.statusBannerNone')}
            </p>
          )}
        </div>

        {/* EXACTLY 4 BIG ICON TILES */}
        <div className="grid grid-cols-2 gap-3.5 pt-1">
          {/* 1. Book Slot */}
          <button
            type="button"
            onClick={() => onNavigate('centers')}
            className="p-5 rounded-3xl bg-white border border-stone-200 shadow-sm hover:shadow-md hover:border-emerald-600 active:scale-95 transition-all text-left flex flex-col justify-between min-h-[140px] group"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Calendar className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-base font-black text-stone-900 group-hover:text-emerald-800">
                {t('home.btnBookSlot')}
              </h3>
              <p className="text-[11px] text-stone-500 font-semibold mt-0.5">
                {t('home.btnBookSlotDesc')}
              </p>
            </div>
          </button>

          {/* 2. Track Token */}
          <button
            type="button"
            onClick={() => onNavigate('queue')}
            className="p-5 rounded-3xl bg-white border border-stone-200 shadow-sm hover:shadow-md hover:border-amber-500 active:scale-95 transition-all text-left flex flex-col justify-between min-h-[140px] group"
          >
            <div className="flex items-center justify-between w-full">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Users className="w-6 h-6 stroke-[2.5]" />
              </div>
              <span className="text-[10px] font-black px-2 py-0.5 bg-red-100 text-red-700 rounded-full animate-pulse">
                {t('common.live')}
              </span>
            </div>
            <div>
              <h3 className="text-base font-black text-stone-900 group-hover:text-amber-800">
                {t('home.btnTrackQueue')}
              </h3>
              <p className="text-[11px] text-stone-500 font-semibold mt-0.5">
                {t('home.btnTrackQueueDesc')}
              </p>
            </div>
          </button>

          {/* 3. Payment Status */}
          <button
            type="button"
            onClick={() => onNavigate('payment_status')}
            className="p-5 rounded-3xl bg-white border border-stone-200 shadow-sm hover:shadow-md hover:border-blue-600 active:scale-95 transition-all text-left flex flex-col justify-between min-h-[140px] group"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center group-hover:scale-105 transition-transform">
              <CreditCard className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-base font-black text-stone-900 group-hover:text-blue-800">
                {t('home.btnPayment')}
              </h3>
              <p className="text-[11px] text-stone-500 font-semibold mt-0.5">
                {t('home.btnPaymentDesc')}
              </p>
            </div>
          </button>

          {/* 4. Help & Guides */}
          <button
            type="button"
            onClick={() => onNavigate('help')}
            className="p-5 rounded-3xl bg-white border border-stone-200 shadow-sm hover:shadow-md hover:border-teal-600 active:scale-95 transition-all text-left flex flex-col justify-between min-h-[140px] group"
          >
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center group-hover:scale-105 transition-transform">
              <HelpCircle className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-base font-black text-stone-900 group-hover:text-teal-800">
                {t('home.btnHelp')}
              </h3>
              <p className="text-[11px] text-stone-500 font-semibold mt-0.5">
                {t('home.btnHelpDesc')}
              </p>
            </div>
          </button>
        </div>

        {/* Helpline Strip */}
        <a
          href="tel:18001801551"
          className="p-3.5 bg-emerald-50 hover:bg-emerald-100 rounded-2xl border border-emerald-200 flex items-center justify-between text-xs font-bold text-emerald-900 transition-all"
        >
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-emerald-700" />
            <span>{t('home.helpline')}</span>
          </div>
          <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
            1800-180-1551
          </span>
        </a>
      </main>

      {/* Simple Bottom Navigation */}
      <BottomNav currentScreen="home" onNavigate={onNavigate} />

      {/* Floating AI Assistant Trigger */}
      <FloatingAIAssistantButton onNavigate={onNavigate} />
    </div>
  );
}

