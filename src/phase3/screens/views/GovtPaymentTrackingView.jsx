import React from 'react';
import { useTranslation } from 'react-i18next';
import { CreditCard, CheckCircle2, Clock, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';
import { GOVT_PAYMENT_METRICS } from '../../mockGovtData';

export default function GovtPaymentTrackingView() {
  const { t, i18n } = useTranslation();
  const isHindi = i18n.language.startsWith('hi');

  const metrics = GOVT_PAYMENT_METRICS;

  return (
    <div className="space-y-6">
      {/* Payment Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total DBT Paid */}
        <div className="bg-stone-900 border border-stone-800 p-5 rounded-3xl space-y-2">
          <span className="text-xs font-bold text-stone-400 block">
            {isHindi ? 'कुल डीबीटी भुगतान' : 'Total DBT Credited'}
          </span>
          <div className="text-2xl font-black text-emerald-400 font-mono">
            ₹{(metrics.totalPaidAmount / 10000000).toFixed(2)} Cr
          </div>
          <span className="text-[11px] text-emerald-300 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {metrics.farmersCreditedCount} {isHindi ? 'किसानों को जमा' : 'farmers paid'}
          </span>
        </div>

        {/* Total Pending */}
        <div className="bg-stone-900 border border-stone-800 p-5 rounded-3xl space-y-2">
          <span className="text-xs font-bold text-stone-400 block">
            {isHindi ? 'प्रक्रियाधीन राशि' : 'In-Process (48h SLA)'}
          </span>
          <div className="text-2xl font-black text-amber-400 font-mono">
            ₹{(metrics.totalPendingAmount / 10000000).toFixed(2)} Cr
          </div>
          <span className="text-[11px] text-amber-300 font-semibold flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {metrics.farmersInitiatedCount} {isHindi ? 'भुगतान पाइपलाइन' : 'in PFMS batch'}
          </span>
        </div>

        {/* Avg Days to Credit */}
        <div className="bg-stone-900 border border-stone-800 p-5 rounded-3xl space-y-2">
          <span className="text-xs font-bold text-stone-400 block">
            {isHindi ? 'औसत भुगतान समय' : 'Avg Credit Speed'}
          </span>
          <div className="text-2xl font-black text-white font-mono">
            {metrics.avgDaysToCredit} {isHindi ? 'दिन' : 'Days'}
          </div>
          <span className="text-[11px] text-stone-400 font-semibold">
            {isHindi ? 'सरकारी मानक: < 3.0 दिन' : 'Target SLA: < 3.0 Days'}
          </span>
        </div>

        {/* Delayed Exception Payments */}
        <div className="bg-stone-900 border border-stone-800 p-5 rounded-3xl space-y-2">
          <span className="text-xs font-bold text-stone-400 block">
            {isHindi ? 'विलंबित / अपवाद' : 'Delayed Exceptions'}
          </span>
          <div className="text-2xl font-black text-red-400 font-mono">
            {metrics.delayedPayments.length} Cases
          </div>
          <span className="text-[11px] text-red-300 font-semibold">
            {isHindi ? 'बैंक त्रुटि / आधार सुधार आवश्यक' : 'Bank IFSC / NPCI Error'}
          </span>
        </div>
      </div>

      {/* Delayed Payments Table */}
      <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h4 className="text-sm font-extrabold text-white">
              {isHindi ? 'विलंबित भुगतान समाधान सूची (Action Required)' : 'Delayed Payment Exception Queue'}
            </h4>
          </div>
          <span className="text-xs text-stone-400">
            {isHindi ? 'कार्ड नंबर गोपनीयता सुरक्षित' : 'Masked for Privacy'}
          </span>
        </div>

        <div className="space-y-3">
          {metrics.delayedPayments.map((pay) => (
            <div
              key={pay.paymentId}
              className="bg-stone-950 p-4 rounded-2xl border border-red-900/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-amber-400">{pay.paymentId}</span>
                  <span className="font-bold text-white">{pay.farmerName}</span>
                  <span className="text-stone-500 font-mono">({pay.kisanCardMasked})</span>
                </div>
                <div className="text-stone-400 flex items-center gap-2">
                  <span>🏛️ {pay.centerName}</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-bold">₹{pay.amount.toLocaleString('en-IN')}</span>
                  <span>•</span>
                  <span>{pay.crop}</span>
                </div>
                <div className="text-red-400 font-medium">
                  ⚠️ {isHindi ? 'त्रुटि' : 'Failure'}: {pay.stage} ({pay.delayedDays} {isHindi ? 'दिन विलंबित' : 'days delayed'})
                </div>
              </div>

              <button
                type="button"
                onClick={() => alert(isHindi ? `भुगतान ${pay.paymentId} के लिए बैंक को पुनः सत्यापन नोटिस भेजा गया!` : `Notice sent to bank for re-verification of ${pay.paymentId}`)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl font-bold text-xs shrink-0 active:scale-95 transition-all"
              >
                {isHindi ? 'पुनः सत्यापन भेजें' : 'Trigger Bank Re-check'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
