import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertCircle, AlertTriangle, ShieldAlert, CheckCircle2, Check, Clock } from 'lucide-react';
import { GOVT_ALERTS_INITIAL } from '../../mockGovtData';

export default function GovtAlertsView() {
  const { t, i18n } = useTranslation();
  const isHindi = i18n.language.startsWith('hi');

  const [alerts, setAlerts] = useState(GOVT_ALERTS_INITIAL);

  const handleMarkReviewed = (id) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, reviewed: true } : a));
  };

  const activeAlerts = alerts.filter(a => !a.reviewed);

  return (
    <div className="space-y-6">
      {/* Alerts Header */}
      <div className="bg-stone-900 border border-stone-800 p-5 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-red-400 text-xs font-bold">
            <ShieldAlert className="w-4 h-4" />
            <span>{isHindi ? 'कंट्रोलर विसंगति एवं जोखिम अलर्ट' : 'Procurement Anomaly & Risk Alerts'}</span>
          </div>
          <h3 className="text-lg font-black text-white mt-1">
            {isHindi ? 'सक्रिय विसंगति चेतावनियां (5 नियम आधारित अलर्ट)' : 'Active Procurement Anomaly Alerts'}
          </h3>
        </div>

        <span className="px-3 py-1.5 bg-stone-950 border border-stone-800 text-stone-300 text-xs font-bold rounded-xl font-mono">
          {activeAlerts.length} {isHindi ? 'लंबित अलर्ट' : 'Unresolved Alerts'}
        </span>
      </div>

      {/* Alerts Stream */}
      <div className="space-y-3.5">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-5 rounded-3xl border transition-all space-y-3 shadow-md ${
              alert.reviewed
                ? 'bg-stone-900/50 border-stone-800 opacity-60'
                : alert.severity === 'high'
                ? 'bg-gradient-to-br from-red-950/40 via-stone-900 to-stone-900 border-red-500/60'
                : alert.severity === 'medium'
                ? 'bg-gradient-to-br from-amber-950/40 via-stone-900 to-stone-900 border-amber-500/60'
                : 'bg-stone-900 border-stone-700'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    alert.severity === 'high'
                      ? 'bg-red-500 text-stone-950 font-black'
                      : alert.severity === 'medium'
                      ? 'bg-amber-400 text-stone-950 font-bold'
                      : 'bg-stone-800 text-stone-300 border border-stone-700'
                  }`}>
                    {alert.severity === 'high' ? (isHindi ? 'उच्च प्राथमिकता' : 'High Severity') : alert.severity === 'medium' ? (isHindi ? 'मध्यम' : 'Medium') : (isHindi ? 'सामान्य' : 'Low')}
                  </span>

                  <span className="text-xs font-bold text-stone-400">
                    {alert.centerName}
                  </span>

                  <span className="text-[11px] text-stone-500 font-mono ml-auto sm:ml-0">
                    {alert.timestamp}
                  </span>
                </div>

                <h4 className="text-sm font-extrabold text-white mt-1">
                  {isHindi ? alert.titleHi : alert.titleEn}
                </h4>

                <p className="text-xs text-stone-300 bg-stone-950/80 p-3 rounded-2xl border border-stone-800/80 font-mono leading-relaxed">
                  {isHindi ? alert.detailsHi : alert.detailsEn}
                </p>
              </div>

              <div className="self-end sm:self-center">
                {alert.reviewed ? (
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isHindi ? 'समीक्षित ✓' : 'Reviewed ✓'}</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleMarkReviewed(alert.id)}
                    className="px-4 py-2 bg-stone-800 hover:bg-emerald-600 hover:text-white text-stone-200 border border-stone-700 rounded-xl text-xs font-bold flex items-center gap-1.5 active:scale-95 transition-all shadow-sm"
                  >
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>{isHindi ? 'समीक्षा मार्क करें' : 'Mark Reviewed'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
