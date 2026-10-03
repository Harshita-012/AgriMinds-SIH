import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Ticket, 
  LogIn, 
  Microscope, 
  Scale, 
  FileText, 
  Send, 
  CheckCircle2, 
  Check, 
  Clock, 
  Users
} from 'lucide-react';
import Header from '../components/common/Header';
import BottomNav from '../components/common/BottomNav';
import { storage } from '../services/storage';
import { simulation } from '../services/simulation';
import { STAGES, CROPS } from '../data/mockData';
import OfflineBanner from '../phase3/components/OfflineBanner';
import FloatingAIAssistantButton from '../phase3/components/FloatingAIAssistantButton';

export default function StageTrackerScreen({ onNavigate, onBack }) {
  const { t } = useTranslation();
  const [simState, setSimState] = useState(simulation.state);
  const activeToken = storage.getActiveToken() || {
    tokenNumber: 147,
    cropId: 'wheat',
    cropName: 'Wheat',
    quantity: 40,
    centerName: 'Nilokheri Main Mandi'
  };

  useEffect(() => {
    const unsub = simulation.subscribe((state) => {
      setSimState({ ...state });
    });
    return () => unsub();
  }, []);

  const currentStage = simState.currentStageId || 1;
  const selectedCrop = CROPS.find(c => c.id === activeToken.cropId) || CROPS[0];
  const mspRate = selectedCrop.msp;
  const totalWeight = activeToken.quantity || 40;
  const totalAmount = (totalWeight * mspRate).toLocaleString('en-IN');

  const speakerText = t('tracker.speakerText');

  const getStageIcon = (iconName) => {
    const props = { className: 'w-5 h-5 stroke-[2.2]' };
    switch (iconName) {
      case 'Ticket': return <Ticket {...props} />;
      case 'LogIn': return <LogIn {...props} />;
      case 'Microscope': return <Microscope {...props} />;
      case 'Scale': return <Scale {...props} />;
      case 'FileText': return <FileText {...props} />;
      case 'Send': return <Send {...props} />;
      case 'CheckCircle2': return <CheckCircle2 {...props} />;
      default: return <Clock {...props} />;
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col max-w-md mx-auto relative font-sans">
      <OfflineBanner />

      <Header
        showBack={true}
        onBack={onBack}
        title={t('tracker.title')}
        screenSpeakerText={speakerText}
        onNavigate={onNavigate}
        currentScreen="tracker"
      />

      <main className="p-4 space-y-4 flex-1 overflow-y-auto pb-24">
        {/* Header Summary */}
        <div className="bg-emerald-800 text-white rounded-3xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-emerald-200 uppercase tracking-wider block">
              {t('tracker.tokenSummary', { token: activeToken.tokenNumber, crop: activeToken.cropName })}
            </span>
            <h2 className="text-lg font-black">{t('tracker.title')}</h2>
          </div>
          <span className="text-xs font-black bg-amber-400 text-stone-950 px-3 py-1 rounded-full shadow-sm">
            {t('tracker.stageProgress', { current: currentStage })}
          </span>
        </div>

        {/* HORIZONTAL ICON STEPPER (No long text) */}
        <div className="card-farmer space-y-3">
          <div className="flex items-center justify-between overflow-x-auto pb-2 pt-1 px-1 gap-2 scrollbar-none">
            {STAGES.map((stage, idx) => {
              const isCompleted = currentStage > stage.id;
              const isCurrent = currentStage === stage.id;

              return (
                <div key={stage.id} className="flex flex-col items-center min-w-[48px] shrink-0">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                      isCompleted
                        ? 'bg-emerald-100 text-emerald-800 border-2 border-emerald-500'
                        : isCurrent
                        ? 'bg-emerald-700 text-white ring-4 ring-emerald-300 animate-pulse'
                        : 'bg-stone-100 text-stone-400 border border-stone-200'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5 stroke-[3] text-emerald-700" />
                    ) : (
                      getStageIcon(stage.icon)
                    )}
                  </div>
                  <span className={`text-[10px] font-bold mt-1.5 text-center leading-tight ${
                    isCurrent ? 'text-emerald-800 font-black' : isCompleted ? 'text-stone-700' : 'text-stone-400'
                  }`}>
                    {idx + 1}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Current Active Stage Description Box */}
          <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-900">
                {t(`tracker.stages.${currentStage}.name`)}
              </span>
              <span className="text-[10px] font-black text-amber-900 bg-amber-300 px-2 py-0.5 rounded-full">
                {t('queue.serving')}
              </span>
            </div>
            <p className="text-xs text-emerald-800 mt-1 font-medium">
              {t(`tracker.stages.${currentStage}.desc`)}
            </p>
          </div>
        </div>

        {/* J-Form / Payment Summary */}
        <div className="card-farmer space-y-3">
          <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
            {t('tracker.receiptSummaryTitle')}
          </h3>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
              <span className="text-[10px] text-stone-500 block font-medium">{t('tracker.netWeight')}</span>
              <span className="text-base font-black text-stone-900">{totalWeight} {t('common.quintal')}</span>
            </div>

            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
              <span className="text-[10px] text-stone-500 block font-medium">{t('tracker.mspRate')}</span>
              <span className="text-base font-black text-emerald-800">₹{mspRate}</span>
            </div>
          </div>

          <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-stone-500 block">{t('tracker.dbtAmount')}</span>
              <span className="text-xl font-black text-emerald-800">₹{totalAmount}</span>
            </div>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-xl">
              {currentStage === 7 ? t('tracker.paymentCredited') : t('tracker.paymentInProgress')}
            </span>
          </div>
        </div>

        {/* Back to Live Queue */}
        <button
          type="button"
          onClick={() => onNavigate('queue')}
          className="w-full btn-secondary text-sm py-3.5"
        >
          <Users className="w-4 h-4" />
          <span>{t('tracker.btnLiveQueue')}</span>
        </button>
      </main>

      <BottomNav currentScreen="queue" onNavigate={onNavigate} />

      {/* Floating AI Assistant Trigger */}
      <FloatingAIAssistantButton onNavigate={onNavigate} />
    </div>
  );
}
