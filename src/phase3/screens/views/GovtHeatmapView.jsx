import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Users, Scale, AlertCircle, Building2, Eye } from 'lucide-react';
import { GOVT_CENTERS } from '../../mockGovtData';

export default function GovtHeatmapView({ centers = GOVT_CENTERS }) {
  const { t, i18n } = useTranslation();
  const isHindi = i18n.language.startsWith('hi');

  const [selectedCenter, setSelectedCenter] = useState(centers[0]);

  return (
    <div className="space-y-6">
      {/* Legend Header */}
      <div className="bg-stone-900 border border-stone-800 p-5 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-black text-white">
            {isHindi ? 'जिला मंडी कतार एवं क्षमता हीटमैप' : 'District Mandi Queue & Capacity Heatmap'}
          </h3>
          <p className="text-xs text-stone-400 mt-0.5">
            {isHindi ? 'हरियाणा (करनाल, कुरुक्षेत्र, कैथल मंडल) के 8 खरीद केंद्रों की लाइव स्थिति' : 'Live utilization map across 8 procurement centers in Haryana'}
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-bold">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></span>
            <span className="text-stone-300">{isHindi ? 'सामान्य (< 65%)' : 'Free (< 65%)'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-amber-400 shadow-sm shadow-amber-400/50"></span>
            <span className="text-stone-300">{isHindi ? 'मध्यम (65-85%)' : 'Moderate'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-red-500 shadow-sm shadow-red-500/50"></span>
            <span className="text-stone-300">{isHindi ? 'अत्यधिक भीड़ (> 85%)' : 'Crowded'}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Map Grid (2 Columns) */}
        <div className="lg:col-span-2 bg-stone-900 border border-stone-800 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between min-h-[420px]">
          {/* District Zones */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 h-full">
            {['Karnal', 'Kurukshetra', 'Kaithal'].map((district) => {
              const districtCenters = centers.filter(c => c.district === district);

              return (
                <div
                  key={district}
                  className="bg-stone-950/80 border border-stone-800/80 rounded-2xl p-4 flex flex-col justify-between space-y-3"
                >
                  <div className="border-b border-stone-800 pb-2 flex items-center justify-between">
                    <span className="font-black text-sm text-amber-400">
                      {district}
                    </span>
                    <span className="text-[10px] text-stone-500 font-mono">
                      {districtCenters.length} centers
                    </span>
                  </div>

                  {/* Centers Inside Zone */}
                  <div className="space-y-2.5 flex-1">
                    {districtCenters.map((c) => {
                      const isSelected = selectedCenter?.id === c.id;
                      const badgeColor =
                        c.utilizationPercent > 85 ? 'bg-red-500' : c.utilizationPercent > 65 ? 'bg-amber-400' : 'bg-emerald-500';

                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => setSelectedCenter(c)}
                          className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between group ${
                            isSelected
                              ? 'bg-stone-800 border-amber-400 shadow-md ring-1 ring-amber-400/50'
                              : 'bg-stone-900 border-stone-800 hover:border-stone-700'
                          }`}
                        >
                          <div className="space-y-0.5 max-w-[130px]">
                            <h4 className="text-xs font-bold text-white truncate">
                              {isHindi ? c.nameHi : c.nameEn}
                            </h4>
                            <span className="text-[10px] text-stone-400 font-mono">
                              Queue: {c.queueLength} | {c.utilizationPercent}%
                            </span>
                          </div>

                          <div className={`w-4 h-4 rounded-full ${badgeColor} shrink-0 animate-pulse`} />
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 text-center text-stone-500 text-[11px] font-medium border-t border-stone-800/60 mt-4">
            {isHindi ? 'केंद्र पर क्लिक करके विस्तृत विवरण दाईं ओर देखें।' : 'Click any center node above to inspect real-time metrics in detail.'}
          </div>
        </div>

        {/* Center Details Card (Right Column) */}
        {selectedCenter && (
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-400 text-stone-950 flex items-center justify-center font-black shadow-md">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                    {selectedCenter.district} {isHindi ? 'जिला' : 'District'}
                  </span>
                  <h4 className="font-extrabold text-sm text-white line-clamp-1">
                    {isHindi ? selectedCenter.nameHi : selectedCenter.nameEn}
                  </h4>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-stone-950 p-3 rounded-2xl border border-stone-800">
                <span className="text-[10px] text-stone-500 block">{isHindi ? 'आज की खरीद' : 'Today Grain'}</span>
                <span className="text-base font-black text-emerald-400 font-mono">
                  {selectedCenter.grainProcuredToday.toLocaleString('en-IN')} Qtl
                </span>
              </div>
              <div className="bg-stone-950 p-3 rounded-2xl border border-stone-800">
                <span className="text-[10px] text-stone-500 block">{isHindi ? 'कतार में वाहन' : 'Active Queue'}</span>
                <span className="text-base font-black text-amber-400 font-mono">
                  {selectedCenter.queueLength} Tractors
                </span>
              </div>
              <div className="bg-stone-950 p-3 rounded-2xl border border-stone-800">
                <span className="text-[10px] text-stone-500 block">{isHindi ? 'औसत प्रतीक्षा' : 'Avg Wait'}</span>
                <span className="text-base font-black text-stone-200 font-mono">
                  {selectedCenter.avgWaitMins} Mins
                </span>
              </div>
              <div className="bg-stone-950 p-3 rounded-2xl border border-stone-800">
                <span className="text-[10px] text-stone-500 block">{isHindi ? 'बोरी स्टॉक' : 'Gunny Bags'}</span>
                <span className="text-base font-black text-stone-200 font-mono">
                  {selectedCenter.gunnyBagsStock.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Capacity Progress Bar */}
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs">
                <span className="text-stone-400">{isHindi ? 'यार्ड क्षमता उपयोग' : 'Yard Capacity'}:</span>
                <span className="font-bold text-white font-mono">{selectedCenter.utilizationPercent}%</span>
              </div>
              <div className="w-full bg-stone-950 h-2.5 rounded-full overflow-hidden border border-stone-800">
                <div
                  className={`h-full rounded-full transition-all ${
                    selectedCenter.utilizationPercent > 85 ? 'bg-red-500' : selectedCenter.utilizationPercent > 65 ? 'bg-amber-400' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${selectedCenter.utilizationPercent}%` }}
                />
              </div>
            </div>

            <div className="p-3 bg-stone-950 rounded-2xl border border-stone-800 text-xs text-stone-300 space-y-1">
              <span className="text-[10px] font-bold text-stone-500 uppercase block">{isHindi ? 'स्टाफ एवं संचालन' : 'Operations'}</span>
              <p>👨‍💼 {selectedCenter.staffActive} Staff Members on Duty</p>
              <p>🌾 Wheat (65%), Paddy (25%), Mustard (10%)</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
