import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Activity, 
  Check, 
  XCircle, 
  Ticket, 
  LogIn, 
  Microscope, 
  Scale, 
  FileText, 
  Send, 
  CheckCircle2,
  ChevronRight,
  AlertOctagon,
  X
} from 'lucide-react';
import { STAGES } from '../../../data/mockData';
import { sharedStore } from '../../store';

export default function StageProgressionView({ adminSession }) {
  const { t, i18n } = useTranslation();
  const isHindi = i18n.language.startsWith('hi');

  const state = sharedStore.getState();
  const centerId = adminSession?.centerId || 'center-1';
  const staffName = adminSession?.staffName || 'Center Staff';

  const centerBookings = state.bookings.filter(b => b.centerId === centerId);

  // Rejection Modal State
  const [rejectingBooking, setRejectingBooking] = useState(null);
  const [rejectReason, setRejectReason] = useState('High Moisture (>14%)');
  const [rejectNote, setRejectNote] = useState('');

  const REJECTION_REASONS = [
    { id: 'moisture', labelEn: 'High Moisture (>14%)', labelHi: 'अत्यधिक नमी (>14%)' },
    { id: 'foreign_matter', labelEn: 'Foreign Matter / Impurities (>2%)', labelHi: 'कचरा / अशुद्धियां (>2%)' },
    { id: 'damaged_grain', labelEn: 'Damaged / Discolored Grain', labelHi: 'क्षतिग्रस्त / बदरंग दाने' },
    { id: 'other', labelEn: 'Other Quality Non-Compliance', labelHi: 'अन्य गुणवत्ता विसंगति' }
  ];

  const handleAdvance = (tokenNumber, nextStageId) => {
    sharedStore.advanceStage(tokenNumber, nextStageId, staffName);
  };

  const handleOpenReject = (booking) => {
    setRejectingBooking(booking);
    setRejectReason(isHindi ? 'अत्यधिक नमी (>14%)' : 'High Moisture (>14%)');
    setRejectNote('');
  };

  const handleConfirmReject = () => {
    if (!rejectingBooking) return;
    sharedStore.rejectQuality(rejectingBooking.tokenNumber, rejectReason, rejectNote, staffName);
    setRejectingBooking(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-stone-900 p-5 rounded-3xl border border-stone-800 text-white space-y-1">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
          <Activity className="w-4 h-4" />
          <span>{isHindi ? 'एक-टैप चरण प्रगति व गुणवत्ता जांच' : 'One-Tap Stage Progression'}</span>
        </div>
        <h2 className="text-xl font-black">
          {isHindi ? 'मंडी चरण प्रबंधन (Stage Progression)' : 'Mandi Stage Updates & Quality'}
        </h2>
        <p className="text-xs text-stone-400">
          {isHindi 
            ? 'प्रवेश से लेकर डीबीटी भुगतान तक एक क्लिक में चरण आगे बढ़ाएं या गुणवत्ता अस्वीकृति दर्ज करें।' 
            : 'One-tap progress through all 7 stages. Real-time sync with farmer app & stage tracker.'}
        </p>
      </div>

      {/* Farmers Stage Progress Cards */}
      <div className="space-y-4">
        {centerBookings.map((b) => {
          const currentStage = b.currentStageId || 1;
          const isRejected = b.status === 'rejected';
          const isCompleted = b.status === 'completed';

          return (
            <div
              key={b.tokenNumber}
              className={`p-5 rounded-3xl border transition-all ${
                isRejected
                  ? 'bg-red-950/40 border-red-500'
                  : isCompleted
                  ? 'bg-stone-900/60 border-stone-800 opacity-80'
                  : 'bg-stone-900 border-stone-800'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800 pb-3">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-2xl bg-emerald-500 text-stone-950 font-black text-sm flex items-center justify-center">
                    #{b.tokenNumber}
                  </span>
                  <div>
                    <h4 className="font-extrabold text-sm text-white">{b.farmerName}</h4>
                    <span className="text-xs text-stone-400">
                      🌾 {b.cropName} ({b.quantity} q) • {b.slotTime}
                    </span>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="flex items-center gap-2">
                  {isRejected ? (
                    <span className="px-3 py-1 bg-red-900/60 text-red-300 border border-red-500/50 rounded-xl text-xs font-bold">
                      ⚠️ {isHindi ? 'गुणवत्ता अस्वीकृत' : 'Quality Rejected'}: {b.rejectionReason}
                    </span>
                  ) : isCompleted ? (
                    <span className="px-3 py-1 bg-emerald-900/60 text-emerald-300 border border-emerald-500/50 rounded-xl text-xs font-bold">
                      ✓ {isHindi ? 'भुगतान संपन्न (Stage 7)' : 'Payment Settled (Stage 7)'}
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-amber-400/20 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-bold">
                      {isHindi ? `वर्तमान: चरण ${currentStage} (${STAGES.find(s => s.id === currentStage)?.nameHi || ''})` : `Current: Stage ${currentStage} (${STAGES.find(s => s.id === currentStage)?.nameEn || ''})`}
                    </span>
                  )}
                </div>
              </div>

              {/* 7 STAGE PROGRESSION BUTTONS */}
              <div className="pt-4 space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                  {STAGES.map((stg) => {
                    const isPassed = currentStage > stg.id;
                    const isCurrent = currentStage === stg.id;
                    const isNext = currentStage + 1 === stg.id;

                    return (
                      <button
                        key={stg.id}
                        type="button"
                        disabled={isRejected || isPassed}
                        onClick={() => handleAdvance(b.tokenNumber, stg.id)}
                        className={`p-2.5 rounded-2xl text-left border flex flex-col justify-between min-h-[72px] transition-all ${
                          isPassed
                            ? 'bg-emerald-950/80 border-emerald-700 text-emerald-300'
                            : isCurrent
                            ? 'bg-emerald-500 text-stone-950 border-emerald-400 font-black shadow-lg ring-2 ring-emerald-400/40 scale-[1.02]'
                            : isNext
                            ? 'bg-stone-800 hover:bg-emerald-900/50 border-stone-600 hover:border-emerald-500 text-white font-bold cursor-pointer active:scale-95'
                            : 'bg-stone-950 border-stone-800 text-stone-500 cursor-not-allowed opacity-50'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-[10px] font-black uppercase">
                            {isHindi ? `चरण ${stg.id}` : `Stg ${stg.id}`}
                          </span>
                          {isPassed && <Check className="w-3.5 h-3.5 stroke-[3] text-emerald-400" />}
                        </div>
                        <span className="text-[11px] font-bold line-clamp-2 leading-tight">
                          {isHindi ? stg.nameHi : stg.nameEn}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Action Bar (Reject button during Quality Check stage 3) */}
                {!isRejected && !isCompleted && currentStage <= 3 && (
                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={() => handleOpenReject(b)}
                      className="px-3.5 py-1.5 bg-stone-800 hover:bg-red-900/60 text-red-400 border border-red-900/40 rounded-xl text-xs font-bold flex items-center gap-1.5 active:scale-95 transition-all"
                    >
                      <XCircle className="w-4 h-4 text-red-400" />
                      <span>{isHindi ? 'गुणवत्ता जांच अस्वीकार करें (Reject)' : 'Reject Quality'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quality Check Rejection Modal */}
      {rejectingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-stone-900 text-white w-full max-w-md rounded-3xl p-5 shadow-2xl border-2 border-red-500 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2 text-red-400">
                <AlertOctagon className="w-6 h-6" />
                <h3 className="font-extrabold text-base">
                  {isHindi ? 'फसल गुणवत्ता अस्वीकृति' : 'Reject Quality Check'}
                </h3>
              </div>
              <button
                onClick={() => setRejectingBooking(null)}
                className="p-1 rounded-full text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1 text-xs text-stone-300">
              <p>
                <strong>{isHindi ? 'किसान:' : 'Farmer:'}</strong> {rejectingBooking.farmerName} (#{rejectingBooking.tokenNumber})
              </p>
              <p>
                <strong>{isHindi ? 'फसल:' : 'Crop:'}</strong> {rejectingBooking.cropName} ({rejectingBooking.quantity} {t('common.quintal')})
              </p>
            </div>

            {/* Reason Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-300">
                {isHindi ? 'अस्वीकृति का प्राथमिक कारण चुनें' : 'Primary Rejection Reason'}
              </label>
              <select
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full bg-stone-950 border border-stone-700 rounded-2xl p-3 text-xs font-bold text-white outline-hidden"
              >
                {REJECTION_REASONS.map((r) => (
                  <option key={r.id} value={isHindi ? r.labelHi : r.labelEn}>
                    {isHindi ? r.labelHi : r.labelEn}
                  </option>
                ))}
              </select>
            </div>

            {/* Optional Note */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-300">
                {isHindi ? 'अतिरिक्त टिप्पणी (वैकल्पिक)' : 'Lab Inspector Note (Optional)'}
              </label>
              <textarea
                rows={2}
                value={rejectNote}
                onChange={(e) => setRejectNote(e.target.value)}
                placeholder={isHindi ? 'उदा. नमी मीटर रीडिंग 15.2% दर्ज की गई।' : 'e.g., Moisture meter showed 15.2% against 12% limit.'}
                className="w-full bg-stone-950 border border-stone-700 rounded-2xl p-3 text-xs text-white placeholder-stone-600 outline-hidden"
              />
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleConfirmReject}
                className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold text-sm rounded-2xl active:scale-95 shadow-lg"
              >
                {isHindi ? 'अस्वीकृति दर्ज करें एवं किसान को सूचित करें' : 'Confirm Rejection & Notify Farmer'}
              </button>
              <button
                type="button"
                onClick={() => setRejectingBooking(null)}
                className="w-full py-2.5 bg-stone-800 text-stone-400 font-bold text-xs rounded-xl hover:text-white"
              >
                {t('common.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
