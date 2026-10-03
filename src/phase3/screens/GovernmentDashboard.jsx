import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  LayoutDashboard, 
  Table, 
  Map, 
  Calendar, 
  Activity, 
  ShieldAlert, 
  CreditCard, 
  FileText, 
  LogOut, 
  Globe, 
  Landmark, 
  Menu, 
  X,
  Bell,
  Building2,
  RefreshCw,
  Settings
} from 'lucide-react';
import { sharedStore } from '../../phase2/store';
import { GOVT_CENTERS, GOVT_ALERTS_INITIAL } from '../mockGovtData';

// Subviews
import GovtOverviewView from './views/GovtOverviewView';
import GovtCenterTableView from './views/GovtCenterTableView';
import GovtHeatmapView from './views/GovtHeatmapView';
import GovtForecastView from './views/GovtForecastView';
import GovtBottleneckView from './views/GovtBottleneckView';
import GovtAlertsView from './views/GovtAlertsView';
import GovtPaymentTrackingView from './views/GovtPaymentTrackingView';
import GovtReportView from './views/GovtReportView';

export default function GovernmentDashboardScreen({ onLogout, onSwitchPortal, onNavigate }) {
  const { t, i18n } = useTranslation();
  const isHindi = i18n.language.startsWith('hi');

  const [activeTab, setActiveTab] = useState('overview');
  const [govtSession, setGovtSession] = useState(sharedStore.getAdminSession());
  const [storeState, setStoreState] = useState(sharedStore.getState());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [syncPulse, setSyncPulse] = useState(false);

  // Subscribe to real-time BroadcastChannel sync
  useEffect(() => {
    const unsub = sharedStore.subscribe((newState) => {
      setStoreState({ ...newState });
      setSyncPulse(true);
      setTimeout(() => setSyncPulse(false), 1000);
    });
    return () => unsub();
  }, []);

  const handleLanguageToggle = () => {
    const nextLang = i18n.language === 'hi' ? 'en' : 'hi';
    i18n.changeLanguage(nextLang);
    localStorage.setItem('agriminds_lang', nextLang);
  };

  const NAV_ITEMS = [
    { id: 'overview', labelEn: 'Overview KPI', labelHi: 'डैशबोर्ड अवलोकन', icon: LayoutDashboard },
    { id: 'centers', labelEn: 'Mandi Centers Table', labelHi: 'खरीद केंद्र तालिका', icon: Table },
    { id: 'heatmap', labelEn: 'District Heatmap', labelHi: 'जिला हीटमैप', icon: Map },
    { id: 'forecast', labelEn: '7-Day Arrival Forecast', labelHi: '7 दिवसीय पूर्वानुमान', icon: Calendar },
    { id: 'bottlenecks', labelEn: 'Bottleneck Analysis', labelHi: 'बॉटलनेक विश्लेषण', icon: Activity },
    { id: 'alerts', labelEn: 'Anomaly Alerts', labelHi: 'विसंगति अलर्ट', icon: ShieldAlert, badge: 5 },
    { id: 'payments', labelEn: 'DBT Payment Tracking', labelHi: 'डीबीटी भुगतान ट्रैकिंग', icon: CreditCard },
    { id: 'reports', labelEn: 'Daily Audit Report', labelHi: 'दैनिक रिपोर्ट व प्रिंट', icon: FileText }
  ];

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col md:flex-row font-sans">
      {/* DESKTOP SIDEBAR (Laptop-First Design) */}
      <aside className="hidden md:flex flex-col justify-between w-64 lg:w-72 bg-stone-900 border-r border-stone-800 p-4 shrink-0">
        <div className="space-y-6">
          {/* Logo & Portal Branding */}
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 p-1 flex items-center justify-center font-black text-stone-950 shadow-md">
              <Landmark className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-black text-lg text-white leading-tight">AgriMinds</h1>
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                {isHindi ? 'सरकारी जिला नियंत्रक' : 'District Controller Console'}
              </span>
            </div>
          </div>

          {/* Official Profile Badge */}
          <div className="bg-stone-950/80 p-3.5 rounded-2xl border border-stone-800 space-y-1">
            <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
              {isHindi ? 'अधिकृत अधिकारी' : 'Logged Official'}
            </span>
            <div className="text-xs font-bold text-amber-300">
              {govtSession?.name || 'Dr. Rajesh Sharma (IAS)'}
            </div>
            <div className="text-[11px] text-stone-400">
              {isHindi ? govtSession?.designationHi || govtSession?.designationEn : govtSession?.designationEn || 'Procurement Controller'}
            </div>
            <div className="flex items-center justify-between text-[10px] text-stone-400 pt-1 border-t border-stone-800">
              <span>{isHindi ? 'मुख्यालय: करनाल' : 'HQ: Karnal'}</span>
              <span className="flex items-center gap-1 text-emerald-400 font-bold">
                <span className={`w-2 h-2 rounded-full bg-emerald-400 ${syncPulse ? 'animate-ping' : ''}`}></span>
                {isHindi ? 'लाइव सिंक' : 'Live Sync'}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full px-3.5 py-3 rounded-2xl text-xs font-bold flex items-center justify-between transition-all ${
                    isActive
                      ? 'bg-amber-400 text-stone-950 shadow-lg shadow-amber-400/20 scale-[1.02]'
                      : 'text-stone-300 hover:bg-stone-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{isHindi ? item.labelHi : item.labelEn}</span>
                  </div>
                  {item.badge && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                      isActive ? 'bg-stone-950 text-amber-400' : 'bg-red-900 text-red-300'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer: Settings, Switch Portal, Language & Logout */}
        <div className="pt-4 border-t border-stone-800 space-y-2">
          {onNavigate && (
            <button
              type="button"
              onClick={() => onNavigate('settings')}
              className="w-full py-2.5 px-3 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-bold flex items-center justify-between transition-all"
              title="Settings"
            >
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-amber-400" />
                <span>{isHindi ? 'सेटिंग्स' : 'Settings'}</span>
              </div>
              <span className="text-[10px] text-stone-400">⚙</span>
            </button>
          )}

          <button
            type="button"
            onClick={onSwitchPortal || onLogout}
            className="w-full py-2.5 px-3 bg-stone-800 hover:bg-stone-700 text-amber-300 rounded-xl text-xs font-bold flex items-center justify-between transition-all"
          >
            <div className="flex items-center gap-2">
              <LogOut className="w-4 h-4 text-amber-400" />
              <span>{isHindi ? 'पोर्टल बदलें' : 'Switch Portal'}</span>
            </div>
            <span className="text-[10px] text-stone-400">⇄</span>
          </button>

          <button
            type="button"
            onClick={handleLanguageToggle}
            className="w-full py-2.5 px-3 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl text-xs font-bold flex items-center justify-between transition-all"
          >
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-400" />
              <span>{isHindi ? 'English में बदलें' : 'Switch to हिन्दी'}</span>
            </div>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 bg-stone-900 rounded">
              {i18n.language.toUpperCase()}
            </span>
          </button>

          <button
            type="button"
            onClick={onLogout}
            className="w-full py-2.5 px-3 bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/40 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <LogOut className="w-4 h-4" />
            <span>{isHindi ? 'लॉगआउट करें' : 'Sign Out'}</span>
          </button>
        </div>
      </aside>

      {/* MOBILE TOP BAR */}
      <div className="md:hidden bg-stone-900 border-b border-stone-800 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-400 flex items-center justify-center text-stone-950 font-black">
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-extrabold text-sm text-white">AgriMinds Govt</h2>
            <span className="text-[10px] text-amber-400 font-bold">Karnal Division</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {onNavigate && (
            <button
              type="button"
              onClick={() => onNavigate('settings')}
              className="p-2 bg-stone-800 text-amber-400 rounded-xl text-xs font-bold"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={handleLanguageToggle}
            className="p-2 bg-stone-800 text-stone-300 rounded-xl text-xs font-bold"
          >
            {i18n.language.toUpperCase()}
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 bg-stone-800 text-stone-300 rounded-xl"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* MOBILE SLIDE-OUT MENU */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-stone-900 border-b border-stone-800 p-4 space-y-2 animate-fade-in">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full p-3 rounded-xl text-xs font-bold flex items-center gap-3 ${
                  isActive ? 'bg-amber-400 text-stone-950' : 'text-stone-300 hover:bg-stone-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{isHindi ? item.labelHi : item.labelEn}</span>
              </button>
            );
          })}

          <button
            type="button"
            onClick={onLogout}
            className="w-full p-3 bg-red-950/40 text-red-300 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>{isHindi ? 'लॉगआउट' : 'Sign Out'}</span>
          </button>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl">
        {/* Top Header Bar inside view */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 gap-2 border-b border-stone-800/80 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                {isHindi ? 'हरियाणा राज्य कृषि विपणन नियंत्रण' : 'Haryana Mandi Procurement System'}
              </span>
              {syncPulse && (
                <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono animate-pulse">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  <span>SYNCED</span>
                </span>
              )}
            </div>
            <h2 className="text-2xl font-black text-white mt-1">
              {NAV_ITEMS.find(n => n.id === activeTab)?.labelEn || 'Dashboard'}
            </h2>
          </div>

          <div className="flex items-center gap-3 text-xs text-stone-400">
            <span className="bg-stone-900 border border-stone-800 px-3 py-1.5 rounded-xl font-mono">
              📅 24 Sep 2024
            </span>
          </div>
        </div>

        {/* View Switcher */}
        {activeTab === 'overview' && <GovtOverviewView />}
        {activeTab === 'centers' && <GovtCenterTableView />}
        {activeTab === 'heatmap' && <GovtHeatmapView />}
        {activeTab === 'forecast' && <GovtForecastView />}
        {activeTab === 'bottlenecks' && <GovtBottleneckView />}
        {activeTab === 'alerts' && <GovtAlertsView />}
        {activeTab === 'payments' && <GovtPaymentTrackingView />}
        {activeTab === 'reports' && <GovtReportView />}
      </main>
    </div>
  );
}
