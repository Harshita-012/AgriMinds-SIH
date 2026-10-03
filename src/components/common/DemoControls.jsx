import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Settings, 
  FastForward, 
  SkipForward, 
  RotateCcw, 
  MessageSquare, 
  ChevronUp, 
  ChevronDown,
  UserX,
  CloudRain,
  Layers,
  Sparkles,
  WifiOff,
  Wifi,
  AlertTriangle,
  CreditCard,
  Building2
} from 'lucide-react';
import { simulation } from '../../services/simulation';
import { storage } from '../../services/storage';
import { sharedStore } from '../../phase2/store';
import { STAGES } from '../../data/mockData';
import { offlineSync } from '../../phase3/services/offlineSync';

export default function DemoControls() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [simState, setSimState] = useState(simulation.state);
  const [storeState, setStoreState] = useState(sharedStore.getState());
  const [isOfflineSim, setIsOfflineSim] = useState(offlineSync.simulatedOffline);

  const isHindi = i18n.language.startsWith('hi');

  useEffect(() => {
    const unsubSim = simulation.subscribe((state) => {
      setSimState({ ...state });
    });
    const unsubStore = sharedStore.subscribe((state) => {
      setStoreState({ ...state });
    });
    const unsubOffline = offlineSync.subscribe((status) => {
      setIsOfflineSim(!status);
    });
    return () => {
      unsubSim();
      unsubStore();
      unsubOffline();
    };
  }, []);

  const activeToken = storage.getActiveToken();
  const myToken = activeToken ? activeToken.tokenNumber : simState.farmerToken;

  const handleToggleOffline = () => {
    const nextVal = !isOfflineSim;
    offlineSync.setSimulatedOffline(nextVal);
    setIsOfflineSim(nextVal);
  };

  const handleSimulateNoShow = () => {
    const target = storeState.bookings.find(b => b.status === 'booked' || b.status === 'checked-in') || { tokenNumber: 143 };
    sharedStore.markNoShow(target.tokenNumber, 'Demo Evaluator');
    alert(isHindi ? `टोकन #${target.tokenNumber} को नो-शो मार्क किया गया और प्रतीक्षा सूची किसान को स्लॉट ऑफर किया गया!` : `Marked Token #${target.tokenNumber} as No-Show! Slot offered to top waitlisted farmer.`);
  };

  const handleTriggerRain = () => {
    sharedStore.triggerRainAlert(0);
    alert(isHindi ? 'आज के दिन भारी बारिश का पूर्वानुमान अलर्ट ट्रिगर किया गया!' : 'Rain alert triggered for scheduled date! Weather advisory banner active.');
  };

  const handleFillSlot = () => {
    sharedStore.fillSlot('center-1', 's2');
    alert(isHindi ? 'स्लॉट 09:30 AM - 11:00 AM को 100% फुल कर दिया गया। अब किसान वेटलिस्ट में शामिल हो सकते हैं।' : 'Slot 09:30 AM - 11:00 AM marked 100% full to test waitlist flow.');
  };

  const handleSimulateStuckStage = () => {
    alert(isHindi ? 'बॉटलनेक अलर्ट: HSAMB सेक्टर-4 मंडी में गुणवत्ता जांच पर 45 मिनट से वाहन फंसा हुआ दर्ज किया गया!' : 'Bottleneck Alert: Vehicle logged stuck > 45 mins at Quality Check in HSAMB Sector-4 Mandi!');
  };

  const handleSimulatePaymentDelay = () => {
    alert(isHindi ? 'डीबीटी अपवाद अलर्ट: बैंक आईएफएससी मिसमैच के कारण किसान बलदेव साहनी का भुगतान होल्ड पर दर्ज किया गया!' : 'DBT Exception Alert: Farmer payment logged on hold due to Bank IFSC mismatch!');
  };

  const handleJumpStage = (stageId) => {
    simulation.advanceStage(stageId);
    sharedStore.advanceStage(myToken, stageId, 'Demo Evaluator');
  };

  const handleResetAll = () => {
    simulation.resetDemo();
    sharedStore.resetAllData();
    offlineSync.setSimulatedOffline(false);
    alert(isHindi ? 'सभी डेमो डेटा, कतार एवं अलर्ट्स को रीसेट कर दिया गया।' : 'All Phase 1, 2 & 3 demo state reset successfully.');
  };

  return (
    <div className="fixed bottom-3 right-4 z-40 max-w-sm">
      {/* Minimized Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 bg-stone-900/95 text-amber-300 rounded-full shadow-2xl border border-amber-400/50 backdrop-blur-md text-xs font-bold hover:bg-stone-900 transition-transform active:scale-95"
        >
          <Settings className="w-3.5 h-3.5 animate-spin-slow text-amber-400" />
          <span>{isHindi ? 'डेमो कंट्रोल्स' : 'Demo Tools'}</span>
          <ChevronUp className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Expanded Control Box */}
      {isOpen && (
        <div className="bg-stone-900 text-white rounded-3xl p-5 shadow-2xl border-2 border-amber-400 w-84 max-h-[85vh] overflow-y-auto space-y-4 font-sans">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              <h4 className="font-bold text-sm text-amber-400">
                {isHindi ? 'डेमो कंट्रोल पैनल (Phase 3)' : 'Demo Evaluator Panel'}
              </h4>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-stone-400 hover:text-white rounded-full"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>

          {/* Offline Mode Toggle */}
          <div className="bg-stone-950 p-3 rounded-2xl border border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold">
              {isOfflineSim ? <WifiOff className="w-4 h-4 text-amber-400" /> : <Wifi className="w-4 h-4 text-emerald-400" />}
              <span>{isHindi ? 'ऑफलाइन मोड सिमुलेशन' : 'Simulate Offline Mode'}</span>
            </div>
            <button
              type="button"
              onClick={handleToggleOffline}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                isOfflineSim ? 'bg-amber-400 text-stone-950' : 'bg-stone-800 text-stone-300'
              }`}
            >
              {isOfflineSim ? 'Offline ON' : 'Online'}
            </button>
          </div>

          {/* Queue Clock Speed */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-300">
              {isHindi ? 'कतार समय गति' : 'Queue Clock Speed'}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[1, 3, 10].map((spd) => (
                <button
                  key={spd}
                  onClick={() => simulation.setSpeed(spd)}
                  className={`py-1.5 text-xs font-bold rounded-xl border transition-all ${
                    simulation.speedMultiplier === spd
                      ? 'bg-amber-500 text-stone-950 border-amber-400'
                      : 'bg-stone-800 text-stone-300 border-stone-700'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>

          {/* Live Scenarios */}
          <div className="space-y-2 pt-1 border-t border-stone-800">
            <label className="text-xs font-bold text-amber-300">
              {isHindi ? 'लाइव परिदृश्य (Live Scenarios)' : 'Live Hackathon Scenarios'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleSimulateNoShow}
                className="p-2 bg-stone-800 hover:bg-stone-700 text-red-300 text-xs font-bold rounded-xl border border-red-900/40 flex items-center justify-center gap-1.5 active:scale-95"
              >
                <UserX className="w-3.5 h-3.5 text-red-400" />
                <span>{isHindi ? 'नो-शो सिमुलेट' : 'No-Show'}</span>
              </button>

              <button
                type="button"
                onClick={handleTriggerRain}
                className="p-2 bg-stone-800 hover:bg-stone-700 text-blue-300 text-xs font-bold rounded-xl border border-blue-900/40 flex items-center justify-center gap-1.5 active:scale-95"
              >
                <CloudRain className="w-3.5 h-3.5 text-blue-400" />
                <span>{isHindi ? 'बारिश अलर्ट' : 'Trigger Rain'}</span>
              </button>

              <button
                type="button"
                onClick={handleSimulateStuckStage}
                className="p-2 bg-stone-800 hover:bg-stone-700 text-amber-300 text-xs font-bold rounded-xl border border-amber-900/40 flex items-center justify-center gap-1.5 active:scale-95"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>{isHindi ? 'स्टक स्टेज' : 'Stuck Stage'}</span>
              </button>

              <button
                type="button"
                onClick={handleSimulatePaymentDelay}
                className="p-2 bg-stone-800 hover:bg-stone-700 text-emerald-300 text-xs font-bold rounded-xl border border-emerald-900/40 flex items-center justify-center gap-1.5 active:scale-95"
              >
                <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isHindi ? 'भुगतान विलंब' : 'Payment Delay'}</span>
              </button>
            </div>
          </div>

          {/* Advance Stage Tracker */}
          <div className="space-y-1.5 pt-1 border-t border-stone-800">
            <label className="text-xs font-semibold text-stone-300">
              {isHindi ? `स्टेज जंप (${simState.currentStageId}/7)` : `Jump Farmer Stage (${simState.currentStageId}/7)`}
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {STAGES.map((stg) => (
                <button
                  key={stg.id}
                  onClick={() => handleJumpStage(stg.id)}
                  className={`py-1.5 text-[11px] font-bold rounded-lg border text-center transition-all ${
                    simState.currentStageId >= stg.id
                      ? 'bg-emerald-800 text-emerald-100 border-emerald-600'
                      : 'bg-stone-800 text-stone-400 border-stone-700'
                  }`}
                  title={isHindi ? stg.nameHi : stg.nameEn}
                >
                  {isHindi ? `चरण ${stg.id}` : `Stage ${stg.id}`}
                </button>
              ))}
            </div>
          </div>

          {/* Reset All */}
          <div className="pt-2 border-t border-stone-800">
            <button
              onClick={handleResetAll}
              className="w-full py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-bold rounded-xl flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isHindi ? 'सभी डेटा रीसेट करें' : 'Reset All Demo Data'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


