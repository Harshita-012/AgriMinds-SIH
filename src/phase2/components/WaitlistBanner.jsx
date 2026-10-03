import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Clock, CheckCircle2, ArrowRight, BellRing } from 'lucide-react';

export default function WaitlistBanner({ waitlistEntry, onConfirmPromotion }) {
  const { t, i18n } = useTranslation();
  const isHindi = i18n.language.startsWith('hi');
  const [timeLeftMins, setTimeLeftMins] = useState(14);
  const [timeLeftSecs, setTimeLeftSecs] = useState(59);

  useEffect(() => {
    if (waitlistEntry && waitlistEntry.status === 'promoted') {
      const timer = setInterval(() => {
        setTimeLeftSecs((prev) => {
          if (prev > 0) return prev - 1;
          setTimeLeftMins((m) => (m > 0 ? m - 1 : 0));
          return 59;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [waitlistEntry]);

  if (!waitlistEntry) return null;

  // Promoted state: 15-minute countdown and Big Confirm button
  if (waitlistEntry.status === 'promoted') {
    return (
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-3xl p-4 shadow-xl border-2 border-amber-300 space-y-3 animate-bounce-short">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-400 animate-ping"></span>
            <span className="text-xs font-black text-amber-300 uppercase tracking-wider">
              {isHindi ? 'स्लॉट उपलब्ध! पुष्टि आवश्यक' : 'Slot Available! Confirm Now'}
            </span>
          </div>
          <div className="text-xs font-mono font-bold bg-stone-950/40 px-2.5 py-1 rounded-xl text-amber-300 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>
              {String(timeLeftMins).padStart(2, '0')}:{String(timeLeftSecs).padStart(2, '0')}
            </span>
          </div>
        </div>

        <div>
          <h4 className="font-extrabold text-base">
            {isHindi ? `समय: ${waitlistEntry.promotedSlotTime || waitlistEntry.slotTime}` : `Time: ${waitlistEntry.promotedSlotTime || waitlistEntry.slotTime}`}
          </h4>
          <p className="text-xs text-emerald-100 font-medium">
            {isHindi 
              ? 'एक किसान के न आने से स्लॉट खाली हुआ है। 15 मिनट के अंदर पुष्टि करके अपना टोकन प्राप्त करें।'
              : 'A slot opened due to cancellation. Confirm within 15 minutes to secure your token pass.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onConfirmPromotion(waitlistEntry.id)}
          className="w-full py-3.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-sm rounded-2xl shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          <CheckCircle2 className="w-5 h-5 text-stone-950" />
          <span>{isHindi ? 'अभी स्लॉट पक्का करें' : 'Confirm My Slot Now'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // Waiting in Waitlist state
  if (waitlistEntry.status === 'waiting') {
    return (
      <div className="bg-stone-800 text-white rounded-3xl p-4 shadow-md border border-stone-700 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BellRing className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="text-xs font-bold text-amber-300">
              {isHindi ? 'प्रतीक्षा सूची (Waitlist)' : 'Active Waitlist'}
            </span>
          </div>
          <span className="text-xs font-black bg-stone-700 px-2.5 py-0.5 rounded-full text-white">
            {isHindi ? `स्थान #${waitlistEntry.position}` : `Position #${waitlistEntry.position}`}
          </span>
        </div>

        <div className="text-xs text-stone-300">
          <span className="font-bold text-white">{waitlistEntry.slotTime}</span>
          <p className="text-[11px] text-stone-400 mt-0.5">
            {isHindi 
              ? 'जैसे ही कोई स्लॉट खाली होगा, आपको तुरंत एसएमएस और नोटिफिकेशन द्वारा सूचित किया जाएगा।' 
              : 'You will be notified immediately via SMS when capacity frees up.'}
          </p>
        </div>
      </div>
    );
  }

  return null;
}
