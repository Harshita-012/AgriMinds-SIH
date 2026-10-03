import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Flag, 
  AlertTriangle, 
  FileText, 
  User, 
  Clock, 
  Scale,
  Check
} from 'lucide-react';
import { sharedStore, MAX_YIELD_PER_ACRE } from '../../store';

export default function FarmerVerificationView({ adminSession }) {
  const { t, i18n } = useTranslation();
  const isHindi = i18n.language.startsWith('hi');

  const state = sharedStore.getState();
  const centerId = adminSession?.centerId || 'center-1';
  const staffName = adminSession?.staffName || 'Center Staff';

  // List of checked-in or active bookings at this center
  const centerBookings = state.bookings.filter(b => b.centerId === centerId);

  // Track temporarily revealed card numbers by tokenNumber
  const [revealedTokens, setRevealedTokens] = useState({});

  const handleReveal = (tokenNumber, farmerName) => {
    // Generate realistic unmasked mock card
    const unmasked = `HR-KR-2024-${String(tokenNumber).padStart(4, '0')}`;
    setRevealedTokens(prev => ({ ...prev, [tokenNumber]: unmasked }));

    // Log to Audit Log
    sharedStore.logCardReveal(tokenNumber, farmerName, staffName);

    // Auto-hide after 5 seconds
    setTimeout(() => {
      setRevealedTokens(prev => {
        const copy = { ...prev };
        delete copy[tokenNumber];
        return copy;
      });
    }, 5000);
  };

  const handleVerify = (tokenNumber) => {
    sharedStore.verifyFarmer(tokenNumber, staffName);
  };

  const handleFlag = (tokenNumber) => {
    const reason = window.prompt(
      isHindi ? 'फ्लैग करने का कारण दर्ज करें (उदा. जमीन रकबा असमानता, संदिग्ध दस्तावेज):' : 'Enter flag reason (e.g., Land size mismatch, document doubt):',
      'Declared quantity exceeds yield limit for declared acreage'
    );
    if (reason) {
      sharedStore.flagFarmer(tokenNumber, reason, staffName);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-stone-900 p-5 rounded-3xl border border-stone-800 text-white space-y-1">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
          <ShieldCheck className="w-4 h-4" />
          <span>{isHindi ? 'पहचान एवं भूमि उपज सत्यापन' : 'Identity & Land Yield Verification'}</span>
        </div>
        <h2 className="text-xl font-black">
          {isHindi ? 'किसान कार्ड व उपज सीमा सत्यापन' : 'Farmer Document & Yield Verification'}
        </h2>
        <p className="text-xs text-stone-400">
          {isHindi 
            ? 'किसान क्रेडिट कार्ड/पहचान पत्र और घोषित फसल मात्रा की जमीन के रकबे से मिलान जांच करें।' 
            : 'Verify Kisan ID and validate declared quantity against regional yield-per-acre benchmarks.'}
        </p>
      </div>

      {/* Verification Cards */}
      <div className="space-y-4">
        {centerBookings.map((b) => {
          const maxYieldLimit = (MAX_YIELD_PER_ACRE[b.cropId] || 25) * (b.landSize || 2.0);
          const isSuspiciousYield = b.quantity > maxYieldLimit;
          const isRevealed = !!revealedTokens[b.tokenNumber];

          return (
            <div
              key={b.tokenNumber}
              className={`p-5 rounded-3xl border transition-all ${
                b.flagged
                  ? 'bg-red-950/40 border-red-500'
                  : b.verified
                  ? 'bg-stone-900 border-emerald-600/60'
                  : 'bg-stone-900 border-stone-800'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Farmer & Card Info */}
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-xl bg-stone-800 text-white font-black text-sm flex items-center justify-center">
                      #{b.tokenNumber}
                    </span>
                    <div>
                      <h4 className="font-extrabold text-base text-white">{b.farmerName}</h4>
                      <span className="text-xs text-stone-400 font-medium">{b.mobile}</span>
                    </div>
                    {b.verified && (
                      <span className="px-2.5 py-0.5 bg-emerald-900/60 text-emerald-300 border border-emerald-500/40 rounded-full text-[10px] font-bold flex items-center gap-1">
                        <Check className="w-3 h-3 stroke-[3]" />
                        <span>{isHindi ? 'सत्यापित' : 'Verified'}</span>
                      </span>
                    )}
                    {b.flagged && (
                      <span className="px-2.5 py-0.5 bg-red-900/60 text-red-300 border border-red-500/40 rounded-full text-[10px] font-bold flex items-center gap-1">
                        <Flag className="w-3 h-3" />
                        <span>{isHindi ? 'जांच हेतु फ्लैग' : 'Flagged'}</span>
                      </span>
                    )}
                  </div>

                  {/* Masked Card Number with Reveal Action */}
                  <div className="flex items-center gap-2 text-xs bg-stone-950 p-2.5 rounded-2xl border border-stone-800 max-w-md">
                    <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-stone-400">{isHindi ? 'किसान कार्ड:' : 'Kisan Card:'}</span>
                    <span className="font-mono font-bold text-amber-300 tracking-wider">
                      {isRevealed ? revealedTokens[b.tokenNumber] : (b.kisanCardMasked || '••••-••••-8921')}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleReveal(b.tokenNumber, b.farmerName)}
                      className="ml-auto px-2 py-1 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg text-[10px] font-bold flex items-center gap-1 active:scale-95 transition-all"
                      title="Reveal for 5s (Logged in audit)"
                    >
                      {isRevealed ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3 text-amber-400" />}
                      <span>{isRevealed ? (isHindi ? '5s में छिपेगा' : 'Hiding in 5s') : (isHindi ? 'नंबर देखें' : 'Reveal')}</span>
                    </button>
                  </div>
                </div>

                {/* Reasonableness check calculation & Badge */}
                <div className="bg-stone-950/80 p-3.5 rounded-2xl border border-stone-800 space-y-1.5 text-xs min-w-[260px]">
                  <div className="flex items-center justify-between">
                    <span className="text-stone-400">{isHindi ? 'भूमि रकबा:' : 'Land Size:'}</span>
                    <span className="font-bold text-white">{b.landSize || 2.0} {t('common.acres')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-400">{isHindi ? 'घोषित फसल:' : 'Crop / Qty:'}</span>
                    <span className="font-bold text-emerald-400">{b.cropName} ({b.quantity} q)</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-stone-500 border-t border-stone-800/80 pt-1">
                    <span>{isHindi ? 'मानक अधिकतम उपज:' : 'Max Normal Yield:'}</span>
                    <span>~{Math.round(maxYieldLimit)} {t('common.quintal')}</span>
                  </div>

                  {/* Warning Badge if declared quantity looks unreasonably high for land size */}
                  {isSuspiciousYield && (
                    <div className="p-2 bg-amber-500/20 border border-amber-500/60 rounded-xl flex items-center gap-1.5 text-amber-300 text-[11px] font-bold mt-1">
                      <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
                      <span>
                        {isHindi 
                          ? 'चेतावनी: जमीन के हिसाब से फसल मात्रा बहुत अधिक है' 
                          : 'Quantity looks too high for land size'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Staff Actions */}
                <div className="flex lg:flex-col items-center gap-2 self-end lg:self-center">
                  <button
                    type="button"
                    onClick={() => handleVerify(b.tokenNumber)}
                    disabled={b.verified}
                    className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-sm ${
                      b.verified
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-600/40 cursor-default'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{b.verified ? (isHindi ? 'सत्यापित ✓' : 'Verified ✓') : (isHindi ? 'सत्यापित करें' : 'Verify')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleFlag(b.tokenNumber)}
                    className="w-full px-4 py-2.5 bg-stone-800 hover:bg-red-900/60 text-red-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                  >
                    <Flag className="w-3.5 h-3.5" />
                    <span>{isHindi ? 'फ्लैग करें' : 'Flag'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
