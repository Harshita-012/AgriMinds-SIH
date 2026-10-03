import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  TrendingUp, 
  Users, 
  Clock, 
  Building2, 
  UserX, 
  Scale, 
  AlertTriangle, 
  CheckCircle2, 
  Layers 
} from 'lucide-react';
import { GOVT_CENTERS } from '../../mockGovtData';

export default function GovtOverviewView({ centers = GOVT_CENTERS }) {
  const { t, i18n } = useTranslation();
  const isHindi = i18n.language.startsWith('hi');

  // Compute live aggregates across all 8 centers
  const totalGrainProcured = centers.reduce((sum, c) => sum + (c.grainProcuredToday || 0), 0);
  const totalFarmersServed = centers.reduce((sum, c) => sum + (c.farmersServedToday || 0), 0);
  const totalActiveQueue = centers.reduce((sum, c) => sum + (c.queueLength || 0), 0);
  const activeCentersCount = centers.length;
  const avgWaitTime = Math.round(centers.reduce((sum, c) => sum + (c.avgWaitMins || 0), 0) / centers.length);
  const avgServiceTime = Math.round(centers.reduce((sum, c) => sum + (c.avgServiceMins || 0), 0) / centers.length);
  const avgNoShowRate = 6.4; // 6.4%

  const KPIS = [
    {
      id: 'grain',
      labelEn: 'Grain Procured Today',
      labelHi: 'आज कुल अनाज खरीद',
      value: totalGrainProcured.toLocaleString('en-IN') + ' Qtl',
      subEn: 'Target: 9,300 Qtl (95%)',
      subHi: 'लक्ष्य: 9,300 क्विंटल (95%)',
      icon: Scale,
      color: 'emerald'
    },
    {
      id: 'farmers',
      labelEn: 'Farmers Served Today',
      labelHi: 'लाभान्वित किसान संख्या',
      value: totalFarmersServed.toString(),
      subEn: `Active in queue: ${totalActiveQueue}`,
      subHi: `वर्तमान कतार में: ${totalActiveQueue}`,
      icon: Users,
      color: 'blue'
    },
    {
      id: 'wait',
      labelEn: 'Average Mandi Wait Time',
      labelHi: 'औसत मंडी प्रतीक्षा समय',
      value: `${avgWaitTime} Mins`,
      subEn: 'Benchmark: < 30 mins',
      subHi: 'मानक: < 30 मिनट',
      icon: Clock,
      color: 'amber'
    },
    {
      id: 'service',
      labelEn: 'Average Service Time',
      labelHi: 'औसत तौल व निस्तारण समय',
      value: `${avgServiceMins(centers)} Mins`,
      subEn: 'Entry to J-Form receipt',
      subHi: 'प्रवेश से जे-फॉर्म तक',
      icon: TrendingUp,
      color: 'teal'
    },
    {
      id: 'centers',
      labelEn: 'Active Mandi Centers',
      labelHi: 'सक्रिय खरीद केंद्र',
      value: `${activeCentersCount} / 8`,
      subEn: 'Karnal, Kurukshetra, Kaithal',
      subHi: 'करनाल, कुरुक्षेत्र, कैथल',
      icon: Building2,
      color: 'purple'
    },
    {
      id: 'noshow',
      labelEn: 'Average No-Show Rate',
      labelHi: 'औसत नो-शो दर',
      value: `${avgNoShowRate}%`,
      subEn: 'Auto-waitlist replaced: 98%',
      subHi: 'वेटलिस्ट से पूर्ति: 98%',
      icon: UserX,
      color: 'red'
    }
  ];

  function avgServiceMins(cntrs) {
    return Math.round(cntrs.reduce((sum, c) => sum + (c.avgServiceMins || 0), 0) / cntrs.length);
  }

  return (
    <div className="space-y-6">
      {/* Overview KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {KPIS.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.id}
              className="bg-stone-900 border border-stone-800 p-5 rounded-3xl shadow-md space-y-3 hover:border-stone-700 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-400">
                  {isHindi ? kpi.labelHi : kpi.labelEn}
                </span>
                <div className={`w-9 h-9 rounded-2xl flex items-center justify-center font-bold ${
                  kpi.color === 'emerald' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' :
                  kpi.color === 'blue' ? 'bg-blue-950 text-blue-400 border border-blue-500/30' :
                  kpi.color === 'amber' ? 'bg-amber-950 text-amber-400 border border-amber-500/30' :
                  kpi.color === 'teal' ? 'bg-teal-950 text-teal-400 border border-teal-500/30' :
                  kpi.color === 'purple' ? 'bg-purple-950 text-purple-400 border border-purple-500/30' :
                  'bg-red-950 text-red-400 border border-red-500/30'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div>
                <div className="text-2xl font-black text-white tracking-tight">
                  {kpi.value}
                </div>
                <p className="text-[11px] text-stone-500 font-medium mt-0.5">
                  {isHindi ? kpi.subHi : kpi.subEn}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* District Highlights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {['Karnal', 'Kurukshetra', 'Kaithal'].map((dist) => {
          const distCenters = centers.filter(c => c.district === dist);
          const distGrain = distCenters.reduce((sum, c) => sum + c.grainProcuredToday, 0);
          const distFarmers = distCenters.reduce((sum, c) => sum + c.farmersServedToday, 0);

          return (
            <div
              key={dist}
              className="bg-stone-900 border border-stone-800 p-5 rounded-3xl space-y-3"
            >
              <div className="flex items-center justify-between border-b border-stone-800 pb-2.5">
                <div>
                  <h3 className="font-extrabold text-base text-white">
                    {dist} {isHindi ? 'मंडल' : 'District'}
                  </h3>
                  <span className="text-[11px] text-stone-400">
                    {distCenters.length} {isHindi ? 'खरीद केंद्र' : 'Centers'}
                  </span>
                </div>
                <span className="px-2.5 py-1 bg-emerald-950 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold rounded-lg uppercase">
                  {isHindi ? 'सक्रिय' : 'Active'}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-stone-300">
                  <span className="text-stone-500">{isHindi ? 'आज की खरीद' : 'Today Grain'}:</span>
                  <span className="font-bold text-white">{distGrain.toLocaleString('en-IN')} Qtl</span>
                </div>
                <div className="flex justify-between text-stone-300">
                  <span className="text-stone-500">{isHindi ? 'किसान आवक' : 'Farmers'}:</span>
                  <span className="font-bold text-white">{distFarmers}</span>
                </div>
                <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-full rounded-full transition-all"
                    style={{ width: `${Math.min(100, Math.round((distGrain / 4500) * 100))}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
