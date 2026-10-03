import React from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, TrendingUp, AlertTriangle, Package, Users, ArrowUpRight } from 'lucide-react';
import { ARRIVAL_FORECAST_7DAYS } from '../../mockGovtData';

export default function GovtForecastView() {
  const { t, i18n } = useTranslation();
  const isHindi = i18n.language.startsWith('hi');

  const maxTotal = Math.max(...ARRIVAL_FORECAST_7DAYS.map(f => f.total));

  return (
    <div className="space-y-6">
      {/* Forecast Header */}
      <div className="bg-stone-900 border border-stone-800 p-5 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
            <Calendar className="w-4 h-4" />
            <span>{isHindi ? '7 दिवसीय अनाज आवक पूर्वानुमान' : '7-Day Grain Arrival Forecast'}</span>
          </div>
          <h3 className="text-lg font-black text-white mt-1">
            {isHindi ? 'जिलावार अनुमानित फसल आवक एवं संसाधन आवश्यकता' : 'Projected Harvest Arrivals & Resource Allocation'}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-amber-950 border border-amber-500/40 text-amber-300 text-xs font-bold rounded-xl flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>{isHindi ? 'शुक्रवार को पीक आवक अनुमान' : 'Peak Arrival: Friday (26 Sep)'}</span>
          </span>
        </div>
      </div>

      {/* SVG / CSS 7-Day Chart */}
      <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 space-y-4">
        <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider">
          {isHindi ? 'दैनिक आवक प्रक्षेपण (क्विंटल में)' : 'Daily Projected Arrivals (In Quintals)'}
        </h4>

        {/* Bar Chart Container */}
        <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-60 pt-6 pb-2 border-b border-stone-800">
          {ARRIVAL_FORECAST_7DAYS.map((item, idx) => {
            const heightPercent = Math.round((item.total / maxTotal) * 100);
            const isPeak = item.risk === 'surge';
            const isHigh = item.risk === 'high_arrival';

            return (
              <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end group">
                {/* Tooltip value */}
                <span className="text-[10px] font-bold font-mono text-stone-400 group-hover:text-amber-400 transition-colors">
                  {(item.total / 1000).toFixed(1)}k
                </span>

                {/* Bar */}
                <div className="w-full max-w-[48px] bg-stone-950 rounded-2xl p-1 h-full flex items-end">
                  <div
                    className={`w-full rounded-xl transition-all duration-500 ${
                      isPeak 
                        ? 'bg-gradient-to-t from-red-600 to-amber-400 shadow-lg shadow-amber-400/20' 
                        : isHigh 
                        ? 'bg-gradient-to-t from-amber-500 to-amber-300' 
                        : 'bg-gradient-to-t from-emerald-600 to-emerald-400'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>

                {/* Day Label */}
                <span className="text-[11px] font-bold text-stone-300 text-center">
                  {item.day}
                </span>
              </div>
            );
          })}
        </div>

        {/* Chart Legend */}
        <div className="flex flex-wrap items-center justify-between text-xs font-bold text-stone-400 pt-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-emerald-500"></span>
              <span>{isHindi ? 'सामान्य आवक (< 8,500 Qtl)' : 'Normal (< 8,500 Qtl)'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-amber-400"></span>
              <span>{isHindi ? 'उच्च आवक' : 'High'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-red-500"></span>
              <span>{isHindi ? 'पीक आवक (अलर्ट)' : 'Peak Harvest Surge'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Proactive Resource Flags */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-stone-900 border border-stone-800 p-5 rounded-3xl space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
            <Package className="w-4 h-4" />
            <span>{isHindi ? 'अतिरिक्त बारदाना (बोरी) आवंटन आवश्यकता' : 'Gunny Bag Reallocation Required'}</span>
          </div>
          <p className="text-xs text-stone-300 leading-relaxed">
            {isHindi
              ? 'करनाल मंडल में 25 व 26 सितंबर को +25,000 अतिरिक्त बोरियों की आवश्यकता होगी। नीलोखेड़ी एवं सेक्टर-4 मंडी में बफर स्टॉक भेजने का प्रस्ताव है।'
              : 'Karnal district will require +25,000 additional gunny bags on 25 & 26 Sep. Buffer stock dispatch recommended for Nilokheri and Sector-4 Mandis.'}
          </p>
        </div>

        <div className="bg-stone-900 border border-stone-800 p-5 rounded-3xl space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
            <Users className="w-4 h-4" />
            <span>{isHindi ? 'अतिरिक्त स्टाफ एवं वे-ब्रिज प्रबंधन' : 'Additional Weighbridge Staffing'}</span>
          </div>
          <p className="text-xs text-stone-300 leading-relaxed">
            {isHindi
              ? 'शुक्रवार को पीक आवक के दौरान कतार प्रतीक्षा समय < 25 मिनट बनाए रखने हेतु थानेसर व कैथल यार्ड में +3 अतिरिक्त ऑपरेटर तैनात किए जा रहे हैं।'
              : 'Deploying +3 temporary data entry and weighing operators to Thanesar and Kaithal to maintain average wait times below 25 minutes.'}
          </p>
        </div>
      </div>
    </div>
  );
}
