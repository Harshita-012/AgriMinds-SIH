import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Users, 
  PhoneCall, 
  UserX, 
  PauseCircle, 
  CheckCircle2, 
  Wheat, 
  Clock, 
  AlertTriangle, 
  Search,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import { STAGES, CROPS } from '../../../data/mockData';
import { sharedStore } from '../../store';

export default function QueueManagementView({ adminSession }) {
  const { t, i18n } = useTranslation();
  const isHindi = i18n.language.startsWith('hi');

  const [activeTab, setActiveTab] = useState('queue'); // 'queue' or 'waitlist'
  const [filterText, setFilterText] = useState('');

  const state = sharedStore.getState();
  const centerId = adminSession?.centerId || 'center-1';
  const staffName = adminSession?.staffName || 'Center Staff';

  const centerBookings = state.bookings.filter(b => b.centerId === centerId);
  const centerWaitlist = state.waitlist.filter(w => w.centerId === centerId);

  // Filtered queue items
  const filteredBookings = centerBookings.filter(b => {
    if (!filterText) return true;
    const term = filterText.toLowerCase();
    return (
      b.tokenNumber.toString().includes(term) ||
      b.farmerName.toLowerCase().includes(term) ||
      b.cropName.toLowerCase().includes(term)
    );
  });

  const handleCallNext = (tokenNumber) => {
    sharedStore.advanceStage(tokenNumber, 4, staffName, 'Called to Weighbridge #1');
  };

  const handleMarkNoShow = (tokenNumber) => {
    if (window.confirm(isHindi ? `क्या आप टोकन #${tokenNumber} को नो-शो (अनुपस्थित) चिह्नित करना चाहते हैं?` : `Mark Token #${tokenNumber} as No-Show? This will cancel the slot and offer capacity to waitlist.`)) {
      sharedStore.markNoShow(tokenNumber, staffName);
    }
  };

  const handleHoldToken = (tokenNumber) => {
    sharedStore.addAuditLog(
      staffName,
      'Token Put on Hold',
      `Token #${tokenNumber}`,
      'Farmer vehicle parked in holding bay.'
    );
  };

  const handlePromoteWaitlist = (waitlistId, slotTime) => {
    sharedStore.promoteWaitlistFarmer(waitlistId, slotTime, staffName);
  };

  return (
    <div className="space-y-6">
      {/* Header with Sub-tabs: Live Tokens vs Waitlist */}
      <div className="bg-stone-900 p-5 rounded-3xl border border-stone-800 text-white space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
              {isHindi ? 'मंडी कतार एवं प्रतीक्षा प्रबंधन' : 'Queue & Waitlist Management'}
            </span>
            <h2 className="text-xl font-black">
              {isHindi ? 'दैनिक टोकन कतार' : 'Today’s Active Tokens'}
            </h2>
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-stone-950 p-1.5 rounded-2xl border border-stone-800">
            <button
              type="button"
              onClick={() => setActiveTab('queue')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'queue' ? 'bg-emerald-600 text-white shadow-sm' : 'text-stone-400 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>{isHindi ? 'टोकन कतार' : 'Active Tokens'} ({centerBookings.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('waitlist')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'waitlist' ? 'bg-blue-600 text-white shadow-sm' : 'text-stone-400 hover:text-white'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>{isHindi ? 'प्रतीक्षा सूची' : 'Waitlist'} ({centerWaitlist.filter(w => w.status === 'waiting').length})</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {activeTab === 'queue' && (
          <div className="relative">
            <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder={isHindi ? 'टोकन संख्या, किसान का नाम या फसल खोजें...' : 'Search token #, farmer name, crop...'}
              className="w-full bg-stone-950 border border-stone-800 focus:border-emerald-500 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-stone-600 outline-hidden"
            />
          </div>
        )}
      </div>

      {/* TAB 1: ACTIVE TOKENS LIST */}
      {activeTab === 'queue' && (
        <div className="space-y-3">
          {filteredBookings.map((b) => {
            const cropObj = CROPS.find(c => c.id === b.cropId) || CROPS[0];
            const isNoShow = b.status === 'no-show';
            const isCompleted = b.status === 'completed';
            const isRejected = b.status === 'rejected';

            return (
              <div
                key={b.tokenNumber}
                className={`p-4 rounded-3xl border transition-all ${
                  b.status === 'in-service'
                    ? 'bg-emerald-950/60 border-emerald-500 shadow-md ring-1 ring-emerald-500/30'
                    : isNoShow
                    ? 'bg-red-950/20 border-red-900/40 opacity-70'
                    : isRejected
                    ? 'bg-amber-950/30 border-amber-800/40'
                    : 'bg-stone-900 border-stone-800'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Left: Token Number, Farmer, Crop Details */}
                  <div className="flex items-start gap-3.5">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-base shrink-0 ${
                      b.status === 'in-service'
                        ? 'bg-emerald-500 text-stone-950'
                        : isNoShow
                        ? 'bg-red-900/60 text-red-300'
                        : 'bg-stone-800 text-white'
                    }`}>
                      #{b.tokenNumber}
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-sm text-white">{b.farmerName}</h4>
                        {/* Soft warning for repeated no-shows (Staff only) */}
                        {b.noShowCount >= 2 && (
                          <span className="px-2 py-0.2 bg-amber-400/20 text-amber-300 border border-amber-500/40 rounded text-[10px] font-bold flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            <span>{isHindi ? '2 बार नो-शो' : `${b.noShowCount}x Past No-Shows`}</span>
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-stone-400 font-medium">
                        <span className="flex items-center gap-1 text-amber-300 font-bold">
                          <span>{cropObj.icon}</span>
                          <span>{b.cropName}</span>
                        </span>
                        <span>•</span>
                        <span>{b.quantity} {t('common.quintal')} ({b.landSize} ac)</span>
                        <span>•</span>
                        <span className="text-stone-300">{b.slotTime}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Stage Badge & Action Buttons */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {/* Current Stage Badge */}
                    <span className={`text-[11px] font-bold px-3 py-1 rounded-xl uppercase tracking-wider ${
                      isCompleted
                        ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700'
                        : isNoShow
                        ? 'bg-red-900/60 text-red-300 border border-red-700'
                        : isRejected
                        ? 'bg-amber-900/60 text-amber-300 border border-amber-700'
                        : 'bg-stone-800 text-emerald-400 border border-stone-700'
                    }`}>
                      {isNoShow 
                        ? (isHindi ? 'नो-शो' : 'No-Show')
                        : isRejected
                        ? (isHindi ? 'अस्वीकृत' : 'Rejected')
                        : isCompleted
                        ? (isHindi ? 'पूर्ण' : 'Completed')
                        : (isHindi ? `चरण ${b.currentStageId || 1}: ${STAGES.find(s => s.id === b.currentStageId)?.nameHi || 'जारी'}` : `Stage ${b.currentStageId || 1}: ${STAGES.find(s => s.id === b.currentStageId)?.nameEn || 'Issued'}`)}
                    </span>

                    {/* Operational Action Buttons */}
                    {!isCompleted && !isNoShow && (
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleCallNext(b.tokenNumber)}
                          className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 active:scale-95 shadow-xs"
                          title="Call to Weighbridge"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">{isHindi ? 'बारी बुलाएं' : 'Call'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleHoldToken(b.tokenNumber)}
                          className="p-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl text-xs font-bold active:scale-95"
                          title="Hold"
                        >
                          <PauseCircle className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleMarkNoShow(b.tokenNumber)}
                          className="p-2 bg-stone-800 hover:bg-red-900/60 text-red-400 rounded-xl text-xs font-bold active:scale-95"
                          title="Mark No-Show (+30m grace expired)"
                        >
                          <UserX className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">{isHindi ? 'नो-शो' : 'No-Show'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: WAITLIST QUEUE */}
      {activeTab === 'waitlist' && (
        <div className="space-y-4">
          <div className="p-4 bg-blue-950/40 border border-blue-500/40 rounded-3xl text-xs text-blue-200">
            {isHindi 
              ? 'स्लॉट फुल होने पर किसान वेटलिस्ट में शामिल होते हैं। जब कोई नो-शो या कैंसिलेशन होता है, तो पहले वेटलिस्ट किसान को स्वतः 15 मिनट की पुष्टि के साथ स्लॉट ऑफर किया जाता है।' 
              : 'Waitlisted farmers are queued when slots are full. On no-show or cancellation, top waitlisted farmer is offered the slot with a 15-minute confirmation timer.'}
          </div>

          <div className="space-y-3">
            {centerWaitlist.map((w) => (
              <div
                key={w.id}
                className="bg-stone-900 p-4.5 rounded-3xl border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-blue-900 text-blue-300 font-black text-sm flex items-center justify-center">
                    #{w.position}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-white">{w.farmerName}</h4>
                    <div className="flex items-center gap-2 text-xs text-stone-400">
                      <span className="font-bold text-amber-300">{w.cropName}</span>
                      <span>•</span>
                      <span>{w.quantity} {t('common.quintal')}</span>
                      <span>•</span>
                      <span>{w.slotTime}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-xl uppercase ${
                    w.status === 'promoted'
                      ? 'bg-amber-400 text-stone-950 animate-pulse'
                      : w.status === 'confirmed'
                      ? 'bg-emerald-900 text-emerald-300'
                      : 'bg-stone-800 text-stone-400'
                  }`}>
                    {w.status === 'promoted' ? (isHindi ? 'प्रमोशन भेजा गया' : 'Promotion Sent (15m)') : w.status}
                  </span>

                  {w.status === 'waiting' && (
                    <button
                      type="button"
                      onClick={() => handlePromoteWaitlist(w.id, w.slotTime)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 active:scale-95 shadow-sm"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{isHindi ? 'स्लॉट ऑफर करें' : 'Promote to Slot'}</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
