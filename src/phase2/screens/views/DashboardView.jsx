import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  CloudRain, 
  BellRing, 
  Building2, 
  Activity, 
  Send,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { TIME_SLOTS } from '../../../data/mockData';
import { sharedStore } from '../../store';

export default function DashboardView({ adminSession, onNavigateTab }) {
  const { t, i18n } = useTranslation();
  const isHindi = i18n.language.startsWith('hi');

  const state = sharedStore.getState();
  const centerId = adminSession?.centerId || 'center-1';
  const centerBookings = state.bookings.filter(b => b.centerId === centerId);
  const checkedInCount = centerBookings.filter(b => b.status === 'checked-in' || b.status === 'in-service' || b.status === 'completed').length;
  const expectedToday = centerBookings.length;
  const waitlistCount = state.waitlist.filter(w => w.centerId === centerId && w.status === 'waiting').length;

  const currentServing = centerBookings.find(b => b.status === 'in-service') || centerBookings.find(b => b.status === 'checked-in') || { tokenNumber: 142 };

  // Weather Rain Alert in center district
  const rainForecast = state.weatherForecast.find(f => f.type === 'rain' || f.type === 'heavy_rain');
  const [notifiedWeather, setNotifiedWeather] = useState(false);

  const handleNotifyWeather = () => {
    sharedStore.notifyAffectedWeatherFarmers(centerId, 'Tomorrow, 25 Sep', adminSession?.staffName);
    setNotifiedWeather(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Stats Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-900 text-white p-5 rounded-3xl border border-stone-800 shadow-md">
        <div>
          <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
            {isHindi ? 'दैनिक खरीद डैशबोर्ड' : 'Daily Mandi Operations'}
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            {isHindi ? adminSession?.centerNameHi || adminSession?.centerNameEn : adminSession?.centerNameEn}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-xs font-bold rounded-xl flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            {isHindi ? 'सत्र सक्रिय (लाइव)' : 'Procurement Active'}
          </span>
        </div>
      </div>

      {/* Weather Rain Advisory Banner for Staff */}
      {rainForecast && (
        <div className="bg-amber-500/15 border-2 border-amber-500/50 rounded-3xl p-4.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold shrink-0">
              <CloudRain className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-amber-300">
                {isHindi ? 'मौसम चेतावनी: बारिश का पूर्वानुमान' : 'District Weather Alert: Heavy Rain Forecast'}
              </h4>
              <p className="text-xs text-stone-300 mt-0.5">
                {isHindi 
                  ? `${centerBookings.length} पंजीकृत किसान प्रभावित हो सकते हैं। उन्हें सुरक्षित दिन पर री-शेड्यूल करने के लिए एसएमएस भेजें।`
                  : `${centerBookings.length} scheduled bookings may be affected. Send weather advisory SMS for priority rescheduling.`}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleNotifyWeather}
            disabled={notifiedWeather}
            className="w-full md:w-auto px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{notifiedWeather ? (isHindi ? 'एसएमएस भेजा गया ✓' : 'Advisory Sent ✓') : (isHindi ? 'किसानों को एसएमएस भेजें' : 'Broadcast Weather Advisory SMS')}</span>
          </button>
        </div>
      )}

      {/* KEY METRICS GRID: 4 Big Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* 1. Today's Expected */}
        <div className="bg-stone-900 p-4.5 rounded-3xl border border-stone-800 space-y-1">
          <div className="flex items-center justify-between text-stone-400 text-xs font-bold">
            <span>{isHindi ? 'अपेक्षित किसान' : 'Expected Today'}</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-white">{expectedToday}</div>
          <span className="text-[11px] text-stone-500 block font-medium">
            {isHindi ? 'कुल स्लॉट बुकिंग' : 'Total booked slots'}
          </span>
        </div>

        {/* 2. Checked-In */}
        <div className="bg-stone-900 p-4.5 rounded-3xl border border-stone-800 space-y-1">
          <div className="flex items-center justify-between text-stone-400 text-xs font-bold">
            <span>{isHindi ? 'गेट प्रवेश (चेक-इन)' : 'Checked-In'}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400">{checkedInCount}</div>
          <span className="text-[11px] text-stone-500 block font-medium">
            {expectedToday > 0 ? `${Math.round((checkedInCount / expectedToday) * 100)}% आगमन दर` : '0%'}
          </span>
        </div>

        {/* 3. Now Serving Token */}
        <div className="bg-emerald-900/40 p-4.5 rounded-3xl border border-emerald-600/40 space-y-1">
          <div className="flex items-center justify-between text-emerald-300 text-xs font-bold">
            <span>{isHindi ? 'वर्तमान टोकन' : 'Current Serving'}</span>
            <Activity className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-amber-300">#{currentServing.tokenNumber}</div>
          <span className="text-[11px] text-emerald-200 block font-medium">
            {currentServing.farmerName || 'In Progress'}
          </span>
        </div>

        {/* 4. Waitlist & Avg Service Time */}
        <div className="bg-stone-900 p-4.5 rounded-3xl border border-stone-800 space-y-1">
          <div className="flex items-center justify-between text-stone-400 text-xs font-bold">
            <span>{isHindi ? 'प्रतीक्षा सूची / समय' : 'Waitlist / Avg Time'}</span>
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-black text-blue-400">
            {waitlistCount} <span className="text-base text-stone-400 font-bold">/ 8.5m</span>
          </div>
          <span className="text-[11px] text-stone-500 block font-medium">
            {isHindi ? 'औसत सेवा समय प्रति किसान' : 'Avg time per weighbridge'}
          </span>
        </div>
      </div>

      {/* SLOT UTILIZATION PROGRESS BARS */}
      <div className="bg-stone-900 p-5 rounded-3xl border border-stone-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-white">
              {isHindi ? 'स्लॉट क्षमता उपयोग (Slot Utilization)' : 'Slot Utilization & Capacity'}
            </h3>
            <p className="text-xs text-stone-400">
              {isHindi ? 'प्रत्येक स्लॉट में ऑनलाइन और वॉक-इन क्षमता' : 'Real-time capacity tracking per time window'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('queue')}
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            <span>{isHindi ? 'कतार देखें' : 'View Queue'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 pt-1">
          {TIME_SLOTS.map((slot) => {
            const slotBookings = centerBookings.filter(b => b.slotId === slot.id);
            const booked = slotBookings.length > 0 ? slotBookings.length : slot.bookedCount;
            const cap = slot.totalCapacity;
            const pct = Math.min(100, Math.round((booked / cap) * 100));

            return (
              <div key={slot.id} className="bg-stone-800/80 p-3.5 rounded-2xl border border-stone-700/70 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <span className="text-stone-200">{slot.time}</span>
                    {slot.isWalkInOnly && (
                      <span className="text-[10px] px-2 py-0.2 bg-amber-400/20 text-amber-300 rounded font-semibold">
                        {isHindi ? 'वॉक-इन आरक्षित' : 'Walk-in Quota'}
                      </span>
                    )}
                  </div>
                  <span className={`font-mono ${pct >= 85 ? 'text-red-400' : 'text-emerald-400'}`}>
                    {booked} / {cap} ({pct}%)
                  </span>
                </div>

                <div className="h-2 bg-stone-950 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      pct >= 85 ? 'bg-red-500' : pct >= 60 ? 'bg-amber-400' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
