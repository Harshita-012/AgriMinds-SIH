import React from 'react';
import { useTranslation } from 'react-i18next';
import { Clock, AlertTriangle, CheckCircle2, ChevronRight, Activity } from 'lucide-react';
import { BOTTLENECK_STAGES } from '../../mockGovtData';

export default function GovtBottleneckView() {
  const { t, i18n } = useTranslation();
  const isHindi = i18n.language.startsWith('hi');

  return (
    <div className="space-y-6">
      {/* Bottleneck Header */}
      <div className="bg-stone-900 border border-stone-800 p-5 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
            <Activity className="w-4 h-4" />
            <span>{isHindi ? 'चरणवार बॉटलनेक एवं समय विश्लेषण' : 'Stage Bottleneck & Cycle Time Analysis'}</span>
          </div>
          <h3 className="text-lg font-black text-white mt-1">
            {isHindi ? 'खरीद प्रक्रिया के 4 प्रमुख चरणों में समय की खपत' : 'Cycle Times Across 4 Core Procurement Stages'}
          </h3>
        </div>

        <span className="px-3 py-1 bg-red-950 border border-red-500/40 text-red-300 text-xs font-bold rounded-xl flex items-center gap-1.5">
          <AlertTriangle className="w-4 h-4 text-red-400" />
          <span>{isHindi ? 'गुणवत्ता जांच सबसे धीमा चरण' : 'Slowest Stage: Quality Check (14.5m)'}</span>
        </span>
      </div>

      {/* Stage-by-Stage Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {BOTTLENECK_STAGES.map((stg) => (
          <div
            key={stg.stageId}
            className={`p-6 rounded-3xl border transition-all space-y-4 shadow-lg ${
              stg.isSlowest
                ? 'bg-gradient-to-br from-red-950/40 via-stone-900 to-stone-900 border-red-500/50'
                : 'bg-stone-900 border-stone-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                stg.isSlowest
                  ? 'bg-red-500 text-stone-950 font-black'
                  : 'bg-stone-800 text-stone-300 border border-stone-700'
              }`}>
                {stg.isSlowest ? (isHindi ? 'धीमा चरण (बॉटलनेक)' : 'Bottleneck Stage') : (isHindi ? 'सामान्य' : 'Normal Pace')}
              </span>

              <span className="text-xs text-stone-400 font-mono">
                {isHindi ? 'मानक' : 'Target'}: {stg.benchmarkMins}m
              </span>
            </div>

            <div>
              <h4 className="text-base font-extrabold text-white">
                {isHindi ? stg.stageNameHi : stg.stageNameEn}
              </h4>
              <div className="flex items-baseline gap-2 mt-1">
                <span className={`text-3xl font-black font-mono ${
                  stg.isSlowest ? 'text-red-400' : 'text-emerald-400'
                }`}>
                  {stg.avgMins}
                </span>
                <span className="text-xs text-stone-400 font-semibold">{isHindi ? 'मिनट प्रति किसान' : 'Mins per farmer'}</span>
              </div>
            </div>

            {/* Visual Gauge */}
            <div className="space-y-1.5">
              <div className="w-full bg-stone-950 h-2.5 rounded-full overflow-hidden border border-stone-800">
                <div
                  className={`h-full rounded-full ${
                    stg.isSlowest ? 'bg-red-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(100, Math.round((stg.avgMins / 20) * 100))}%` }}
                />
              </div>
            </div>

            <div className="bg-stone-950/80 p-3.5 rounded-2xl border border-stone-800/80 text-xs space-y-1">
              <div className="text-stone-400">
                <span className="text-stone-500">{isHindi ? 'सर्वाधिक समय लेने वाला केंद्र' : 'Slowest Mandi'}: </span>
                <span className="text-stone-200 font-bold">{stg.slowestCenter}</span>
              </div>
              <div className="text-stone-400">
                <span className="text-stone-500">{isHindi ? 'कारण' : 'Root Cause'}: </span>
                <span className="text-amber-300/90">{isHindi ? stg.reasonsHi : stg.reasonsEn}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
