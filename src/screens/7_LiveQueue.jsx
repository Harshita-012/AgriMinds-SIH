import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Users, 
  Clock, 
  ChevronRight,
  Activity,
  CheckCircle2
} from 'lucide-react';
import Header from '../components/common/Header';
import BottomNav from '../components/common/BottomNav';
import { storage } from '../services/storage';
import { simulation } from '../services/simulation';
import { INITIAL_QUEUED_FARMERS } from '../data/mockData';
import OfflineBanner from '../phase3/components/OfflineBanner';
import FloatingAIAssistantButton from '../phase3/components/FloatingAIAssistantButton';

export default function LiveQueueScreen({ onNavigate, onBack }) {
  const { t, i18n } = useTranslation();
  const isHindi = i18n.language.startsWith('hi');
  const [simState, setSimState] = useState(simulation.state);
  const activeToken = storage.getActiveToken() || {
    tokenNumber: 147,
    cropId: 'wheat',
    quantity: 40,
    centerName: 'Nilokheri Main Mandi'
  };

  useEffect(() => {
    simulation.start();
    const unsub = simulation.subscribe((state) => {
      setSimState({ ...state });
    });
    return () => unsub();
  }, []);

  const myTokenNum = activeToken.tokenNumber;
  const currentToken = simState.currentServingToken;
  const farmersAhead = Math.max(0, myTokenNum - currentToken);
  const predictedWaitMins = simulation.calculateWaitTime(
    myTokenNum, 
    activeToken.cropId || 'wheat', 
    activeToken.quantity || 40
  );

  const isMyTurn = currentToken === myTokenNum;
  const isPastTurn = currentToken > myTokenNum;

  const speakerText = t('queue.speakerText', {
    current: currentToken,
    myToken: myTokenNum,
    ahead: farmersAhead,
    wait: predictedWaitMins
  });

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col max-w-md mx-auto relative font-sans">
      <OfflineBanner />

      <Header
        showBack={true}
        onBack={onBack}
        title={t('queue.title')}
        screenSpeakerText={speakerText}
        onNavigate={onNavigate}
        currentScreen="queue"
      />

      <main className="p-4 space-y-4 flex-1 overflow-y-auto pb-24">
        {/* Live Indicator */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
            </span>
            <span className="text-xs font-black text-red-600 uppercase tracking-wider">
              {t('queue.liveMandiQueue')}
            </span>
          </div>
          <span className="text-[11px] font-bold text-stone-500">
            {t('queue.weighingActive')}
          </span>
        </div>

        {/* Turn Alert if My Turn */}
        {isMyTurn && (
          <div className="p-4 bg-emerald-600 text-white rounded-3xl shadow-md space-y-1 animate-bounce-short">
            <div className="flex items-center gap-2 font-black text-sm">
              <CheckCircle2 className="w-5 h-5 text-amber-300" />
              <span>{t('queue.turnReadyNotification')}</span>
            </div>
          </div>
        )}

        {/* BIG NUMBERS: 3 Cards ("Now Serving", "Your Token", "Wait") */}
        <div className="grid grid-cols-3 gap-2.5">
          {/* 1. Now Serving */}
          <div className="bg-stone-900 text-white p-3.5 rounded-3xl text-center space-y-1 shadow-sm">
            <span className="text-[10px] font-bold text-stone-400 block truncate">
              {t('queue.nowServing')}
            </span>
            <div className="text-3xl font-black text-emerald-400 tracking-tight">
              #{currentToken}
            </div>
          </div>

          {/* 2. Your Token */}
          <div className="bg-emerald-800 text-white p-3.5 rounded-3xl text-center space-y-1 shadow-sm">
            <span className="text-[10px] font-bold text-emerald-200 block truncate">
              {t('queue.yourToken')}
            </span>
            <div className="text-3xl font-black text-amber-300 tracking-tight">
              #{myTokenNum}
            </div>
          </div>

          {/* 3. Wait */}
          <div className="bg-amber-400 text-stone-950 p-3.5 rounded-3xl text-center space-y-1 shadow-sm">
            <span className="text-[10px] font-bold text-stone-800 block truncate">
              {t('queue.wait')}
            </span>
            <div className="text-3xl font-black text-stone-950 tracking-tight">
              {isPastTurn ? '0' : predictedWaitMins}
              <span className="text-xs font-bold text-stone-800 ml-0.5">{t('common.minute')}</span>
            </div>
          </div>
        </div>

        {/* Progress Card */}
        <div className="card-farmer space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold text-stone-700">
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-emerald-700" />
              <span>{t('queue.farmersAhead')}:</span>
              <span className="text-base font-black text-stone-900 ml-1">
                {isPastTurn ? '0' : farmersAhead}
              </span>
            </div>
            <span className="text-stone-500">
              {isPastTurn ? '100%' : `${Math.min(100, Math.round(((8 - farmersAhead) / 8) * 100))}%`}
            </span>
          </div>

          <div className="h-2.5 bg-stone-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-600 rounded-full transition-all duration-700"
              style={{
                width: isPastTurn ? '100%' : `${Math.max(10, Math.min(100, ((8 - farmersAhead) / 8) * 100))}%`
              }}
            />
          </div>
        </div>

        {/* Compact Queue List */}
        <div className="card-farmer space-y-2.5">
          <h4 className="font-bold text-xs text-stone-700 uppercase tracking-wider">
            {t('queue.liveMandiQueue')}
          </h4>

          <div className="space-y-1.5 text-xs">
            {INITIAL_QUEUED_FARMERS.map((f) => {
              const isCurrent = f.token === currentToken;
              const isMine = f.token === myTokenNum;

              return (
                <div
                  key={f.token}
                  className={`p-2.5 rounded-2xl flex items-center justify-between border transition-all ${
                    isCurrent
                      ? 'bg-emerald-50 border-emerald-500 font-bold'
                      : isMine
                      ? 'bg-amber-50 border-amber-400 font-bold'
                      : 'bg-stone-50 border-stone-200 text-stone-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs ${
                      isCurrent ? 'bg-emerald-700 text-white' : isMine ? 'bg-amber-500 text-stone-950' : 'bg-stone-200 text-stone-700'
                    }`}>
                      #{f.token}
                    </span>
                    <span className="font-bold text-stone-900">
                      {isHindi ? f.nameHi : f.nameEn} {isMine && `(${t('queue.you')})`}
                    </span>
                  </div>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {isCurrent ? (
                      <span className="text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full animate-pulse">
                        {t('queue.serving')}
                      </span>
                    ) : f.token < currentToken ? (
                      <span className="text-stone-500 bg-stone-200 px-2 py-0.5 rounded-full">
                        {t('queue.done')}
                      </span>
                    ) : (
                      <span className="text-stone-600 bg-stone-100 px-2 py-0.5 rounded-full">
                        {t('queue.waiting')}
                      </span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Button to Stage Tracker */}
        <button
          type="button"
          onClick={() => onNavigate('tracker')}
          className="w-full btn-primary text-base py-3.5"
        >
          <Activity className="w-5 h-5" />
          <span>{t('queue.btnStageTracker')}</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </main>

      <BottomNav currentScreen="queue" onNavigate={onNavigate} />

      {/* Floating AI Assistant Trigger */}
      <FloatingAIAssistantButton onNavigate={onNavigate} />
    </div>
  );
}
