import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Landmark, Lock, ArrowLeft, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';
import { GOVT_ACCOUNTS } from '../../phase2/roles';
import { sharedStore } from '../../phase2/store';

export default function GovtLoginScreen({ onLoginSuccess, onBack }) {
  const { t, i18n } = useTranslation();
  const isHindi = i18n.language.startsWith('hi');

  const [officialId, setOfficialId] = useState('');
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    const matchOfficial = GOVT_ACCOUNTS.find(
      g => g.officialId.toUpperCase() === officialId.trim().toUpperCase() && g.pin === pin.trim()
    );

    setTimeout(() => {
      setIsSubmitting(false);
      if (matchOfficial) {
        const govtSession = {
          role: 'govt_official',
          officialId: matchOfficial.officialId,
          name: matchOfficial.name,
          designationEn: matchOfficial.designationEn,
          designationHi: matchOfficial.designationHi,
          jurisdiction: matchOfficial.jurisdiction,
          loginTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
        };

        sharedStore.saveAdminSession(govtSession);
        sharedStore.addAuditLog(
          matchOfficial.name,
          'Government Portal Login',
          matchOfficial.jurisdiction,
          `Authorized access to district analytics & procurement controller console.`
        );
        onLoginSuccess(govtSession);
      } else {
        setErrorMsg(
          isHindi
            ? 'अमान्य अधिकारी आईडी या पिन। कृपया पुनः प्रयास करें।'
            : 'Invalid Official ID or PIN. Please try again.'
        );
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-stone-900 text-white flex flex-col justify-between p-4 md:p-8 max-w-md mx-auto font-sans">
      {/* Header */}
      <div className="space-y-4 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="p-2 -ml-2 text-stone-400 hover:text-white flex items-center gap-1.5 text-xs font-bold active:scale-95 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('common.back')}</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-stone-950 flex items-center justify-center font-black shadow-lg">
            <Landmark className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
              {isHindi ? 'सरकारी जिला अधिकारी लॉगिन' : 'Government Official Login'}
            </span>
            <h1 className="text-2xl font-black text-white">
              {isHindi ? 'अधिकारी प्रवेश' : 'Official Portal'}
            </h1>
          </div>
        </div>

        <p className="text-xs text-stone-400 leading-relaxed">
          {isHindi
            ? 'जिला एवं राज्य स्तरीय अनाज खरीद, लाइव हीटमैप एवं बॉटलनेक विश्लेषण कंसोल।'
            : 'District and state-level grain procurement, live heatmaps, bottleneck analytics, and payment tracking console.'}
        </p>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="my-auto py-6 space-y-4">
        {errorMsg && (
          <div className="p-3.5 bg-red-950/80 border border-red-800 rounded-2xl flex items-center gap-2.5 text-xs text-red-200 animate-shake">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Official ID */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-stone-300 block">
            {isHindi ? 'अधिकारी आईडी (Official ID)' : 'Official ID'}
          </label>
          <input
            type="text"
            required
            value={officialId}
            onChange={(e) => setOfficialId(e.target.value)}
            placeholder="e.g. GOV-101"
            className="w-full bg-stone-950 border border-stone-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-2xl px-4 py-3.5 text-sm font-bold text-white placeholder-stone-600 uppercase tracking-wider outline-hidden"
          />
        </div>

        {/* PIN */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-stone-300 block">
            {isHindi ? 'सुरक्षा पिन (4-अंकीय)' : 'Security PIN (4-Digit)'}
          </label>
          <div className="relative">
            <input
              type="password"
              required
              maxLength={6}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="••••"
              className="w-full bg-stone-950 border border-stone-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-2xl px-4 py-3.5 text-sm font-bold text-white placeholder-stone-600 tracking-widest outline-hidden"
            />
            <Lock className="w-4 h-4 text-stone-500 absolute right-4 top-4" />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !officialId || !pin}
          className="w-full py-4 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-stone-950 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg active:scale-98 transition-all"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-stone-950 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <span>{isHindi ? 'कंसोल में लॉगिन करें' : 'Sign In to Console'}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Footer */}
      <div className="pt-4 border-t border-stone-800 text-center space-y-2">
        <div className="flex items-center justify-center gap-1.5 text-stone-500 text-[11px]">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>{isHindi ? 'सुरक्षित सरकारी प्रमाणीकरण प्रणाली' : 'Official Government Authentication'}</span>
        </div>
      </div>
    </div>
  );
}
