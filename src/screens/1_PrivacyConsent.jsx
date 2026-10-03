import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  ShieldCheck, 
  HelpCircle, 
  Eye, 
  Lock, 
  UserCheck, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  FileText,
  AlertTriangle,
  ArrowLeft
} from 'lucide-react';
import Header from '../components/common/Header';
import { storage } from '../services/storage';

export default function PrivacyConsentScreen({ onAgree, onBackToState }) {
  const { t, i18n } = useTranslation();
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [showFullNotice, setShowFullNotice] = useState(false);
  const [showDisagreeModal, setShowDisagreeModal] = useState(false);

  const speakerText = t('privacy.speakerText');

  const handleAgree = () => {
    storage.saveConsent(i18n.language);
    onAgree();
  };

  const toggleExpand = (idx) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  const privacyCards = [
    {
      id: 1,
      title: t('privacy.collectTitle'),
      body: t('privacy.collectBody'),
      icon: FileText,
      color: 'bg-blue-100 text-blue-700'
    },
    {
      id: 2,
      title: t('privacy.whyTitle'),
      body: t('privacy.whyBody'),
      icon: HelpCircle,
      color: 'bg-emerald-100 text-emerald-700'
    },
    {
      id: 3,
      title: t('privacy.whoTitle'),
      body: t('privacy.whoBody'),
      icon: Eye,
      color: 'bg-purple-100 text-purple-700'
    },
    {
      id: 4,
      title: t('privacy.protectTitle'),
      body: t('privacy.protectBody'),
      icon: Lock,
      color: 'bg-amber-100 text-amber-700'
    },
    {
      id: 5,
      title: t('privacy.rightsTitle'),
      body: t('privacy.rightsBody'),
      icon: UserCheck,
      color: 'bg-teal-100 text-teal-700'
    },
    {
      id: 6,
      title: t('privacy.retentionTitle'),
      body: t('privacy.retentionBody'),
      icon: Clock,
      color: 'bg-stone-200 text-stone-700'
    }
  ];

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col justify-between max-w-md mx-auto">
      <Header 
        showBack={true} 
        onBack={onBackToState}
        title={t('privacy.title')}
        screenSpeakerText={speakerText}
      />

      <main className="p-4 space-y-3 flex-1 overflow-y-auto pb-36">
        {/* Banner */}
        <div className="bg-emerald-800 text-white rounded-3xl p-5 shadow-sm space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-amber-300">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold leading-tight">
                {t('privacy.title')}
              </h2>
              <p className="text-xs text-emerald-200 font-medium">
                {t('privacy.badge')}
              </p>
            </div>
          </div>
          <p className="text-xs text-emerald-100 pt-1 leading-relaxed">
            {t('privacy.disclaimer')}
          </p>
        </div>

        {/* 6 Icon Cards (One short line each, tappable to expand) */}
        <div className="space-y-2.5">
          {privacyCards.map((card, idx) => {
            const Icon = card.icon;
            const isExpanded = expandedIndex === idx;

            return (
              <div
                key={card.id}
                onClick={() => toggleExpand(idx)}
                className="bg-white rounded-2xl border border-stone-200 p-3.5 shadow-sm transition-all cursor-pointer hover:border-emerald-500"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl ${card.color} flex items-center justify-center shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-stone-900 text-sm">
                      {card.title}
                    </h3>
                  </div>
                  <div className="text-stone-400">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>

                {isExpanded && (
                  <p className="mt-2.5 pt-2.5 border-t border-stone-100 text-xs text-stone-600 pl-12 leading-relaxed font-medium">
                    {card.body}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Read Full Notice Link */}
        <div className="border border-stone-300 rounded-2xl bg-stone-50 overflow-hidden mt-3">
          <button
            type="button"
            onClick={() => setShowFullNotice(!showFullNotice)}
            className="w-full p-3.5 flex items-center justify-between text-xs font-bold text-stone-700 hover:bg-stone-100"
          >
            <span>{showFullNotice ? t('privacy.collapseFull') : t('privacy.expandFull')}</span>
            {showFullNotice ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {showFullNotice && (
            <div className="p-3.5 pt-0 text-xs text-stone-600 border-t border-stone-200 space-y-2 leading-relaxed">
              <p>{t('privacy.fullLegalNotice')}</p>
            </div>
          )}
        </div>
      </main>

      {/* Pinned Bottom Decision Buttons */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-white/95 backdrop-blur-md border-t border-stone-200 shadow-2xl z-20 space-y-2">
        <button
          type="button"
          onClick={handleAgree}
          className="w-full btn-primary text-lg py-3.5"
        >
          <ShieldCheck className="w-5 h-5" />
          <span>{t('privacy.agreeBtn')}</span>
        </button>

        <button
          type="button"
          onClick={() => setShowDisagreeModal(true)}
          className="w-full py-2 px-4 rounded-xl text-stone-500 hover:text-stone-800 text-xs font-bold transition-all text-center"
        >
          {t('privacy.disagreeBtn')}
        </button>
      </div>

      {/* "Do not agree" Dialog */}
      {showDisagreeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl space-y-4 border border-stone-300">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-lg font-extrabold text-stone-900">
                {t('privacy.disagreeModalTitle')}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {t('privacy.disagreeModalDesc')}
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDisagreeModal(false)}
                className="w-full btn-primary text-base"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>{t('privacy.disagreeBackBtn')}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowDisagreeModal(false);
                  onBackToState();
                }}
                className="w-full btn-secondary text-sm"
              >
                <span>{t('privacy.disagreeWalkInBtn')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
