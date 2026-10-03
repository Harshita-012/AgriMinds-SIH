import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  LayoutDashboard, 
  ScanLine, 
  Users, 
  ShieldCheck, 
  Activity, 
  UserPlus, 
  History, 
  Inbox, 
  LogOut, 
  Globe, 
  Building2,
  Bell,
  RefreshCw,
  Menu,
  X,
  Settings
} from 'lucide-react';
import { sharedStore } from '../store';
import { SUPPORTED_LANGUAGES, getLanguageConfig } from '../../i18n/languages';

// Views
import DashboardView from './views/DashboardView';
import QRCheckInView from './views/QRCheckInView';
import QueueManagementView from './views/QueueManagementView';
import FarmerVerificationView from './views/FarmerVerificationView';
import StageProgressionView from './views/StageProgressionView';
import WalkInBookingView from './views/WalkInBookingView';
import AuditLogView from './views/AuditLogView';
import CenterInboxView from './views/CenterInboxView';

export default function CenterPortalScreen({ onLogout, onNavigate }) {
  const { t, i18n } = useTranslation();
  const isHindi = i18n.language.startsWith('hi');

  const [activeTab, setActiveTab] = useState('dashboard');
  const [adminSession, setAdminSession] = useState(sharedStore.getAdminSession());
  const [storeState, setStoreState] = useState(sharedStore.getState());
  const [syncPulse, setSyncPulse] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Subscribe to real-time BroadcastChannel sync
  useEffect(() => {
    const unsub = sharedStore.subscribe((newState) => {
      setStoreState({ ...newState });
      setSyncPulse(true);
      setTimeout(() => setSyncPulse(false), 1200);
    });
    return () => unsub();
  }, []);

  const handleLanguageToggle = () => {
    const nextLang = i18n.language === 'hi' ? 'en' : 'hi';
    i18n.changeLanguage(nextLang);
    localStorage.setItem('agriminds_lang', nextLang);
  };

  const handleLogout = () => {
    sharedStore.clearAdminSession();
    onLogout();
  };

  const NAV_ITEMS = [
    { id: 'dashboard', labelEn: 'Dashboard', labelHi: 'डैशबोर्ड', icon: LayoutDashboard },
    { id: 'qr_checkin', labelEn: 'QR Gate Scan', labelHi: 'क्यूआर चेक-इन', icon: ScanLine },
    { id: 'queue', labelEn: 'Queue & Waitlist', labelHi: 'कतार व वेटलिस्ट', icon: Users },
    { id: 'verification', labelEn: 'Farmer Verification', labelHi: 'किसान सत्यापन', icon: ShieldCheck },
    { id: 'stages', labelEn: 'Stage Progression', labelHi: 'चरण प्रगति', icon: Activity },
    { id: 'walkin', labelEn: 'Assisted Walk-In', labelHi: 'वॉक-इन बुकिंग', icon: UserPlus },
    { id: 'inbox', labelEn: 'Appeals & Inbox', labelHi: 'अपील इनबॉक्स', icon: Inbox },
    { id: 'audit', labelEn: 'Audit Log', labelHi: 'ऑडिट लॉग', icon: History }
  ];

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col md:flex-row font-sans">
      {/* DESKTOP SIDEBAR (Laptop/Tablet first layout) */}
      <aside className="hidden md:flex flex-col justify-between w-64 lg:w-72 bg-stone-900 border-r border-stone-800 p-4 shrink-0">
        <div className="space-y-6">
          {/* Logo & Portal Branding */}
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500 p-1 flex items-center justify-center font-black text-stone-950 shadow-md">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-black text-lg text-white leading-tight">AgriMinds</h1>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                {isHindi ? 'मंडी स्टाफ टर्मिनल' : 'Center Staff Terminal'}
              </span>
            </div>
          </div>

          {/* Assigned Center Info Box */}
          <div className="bg-stone-950/80 p-3.5 rounded-2xl border border-stone-800 space-y-1">
            <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
              {isHindi ? 'वर्तमान केंद्र' : 'Operating Mandi'}
            </span>
            <div className="text-xs font-bold text-emerald-300 line-clamp-1">
              {isHindi ? adminSession?.centerNameHi || adminSession?.centerNameEn : adminSession?.centerNameEn}
            </div>
            <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1">
              <span>{adminSession?.staffName || 'Staff'} ({adminSession?.staffId || 'EMP-101'})</span>
              <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
                <span className={`w-2 h-2 rounded-full bg-emerald-400 ${syncPulse ? 'scale-150 animate-ping' : ''}`}></span>
                {isHindi ? 'सिंक' : 'Live Sync'}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full px-3.5 py-3 rounded-2xl text-xs font-bold flex items-center gap-3 transition-all ${
                    isActive
                      ? 'bg-emerald-500 text-stone-950 shadow-lg shadow-emerald-500/20 scale-[1.02]'
                      : 'text-stone-300 hover:bg-stone-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{isHindi ? item.labelHi : item.labelEn}</span>
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
                <Settings className="w-4 h-4 text-emerald-400" />
                <span>{isHindi ? 'सेटिंग्स' : 'Settings'}</span>
              </div>
              <span className="text-[10px] text-stone-400">⚙</span>
            </button>
          )}

          <button
            type="button"
            onClick={onLogout}
            className="w-full py-2.5 px-3 bg-stone-800 hover:bg-stone-700 text-amber-300 rounded-xl text-xs font-bold flex items-center justify-between transition-all"
            title="Switch Portal"
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
            onClick={handleLogout}
            className="w-full py-2.5 px-3 bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/40 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <LogOut className="w-4 h-4" />
            <span>{isHindi ? 'लॉगआउट करें' : 'Sign Out'}</span>
          </button>
        </div>
      </aside>

      {/* MOBILE TOP BAR */}
      <header className="md:hidden sticky top-0 z-30 bg-stone-900 border-b border-stone-800 p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500 p-1 flex items-center justify-center font-black text-stone-950">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-sm text-white leading-tight">AgriMinds</h2>
            <span className="text-[9px] text-emerald-400 font-bold block">
              {adminSession?.centerNameEn?.split(' ')[0]} Mandi
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {onNavigate && (
            <button
              type="button"
              onClick={() => onNavigate('settings')}
              className="p-1.5 rounded-lg bg-stone-800 text-xs font-bold text-stone-300"
              title="Settings"
            >
              <Settings className="w-4 h-4 text-emerald-400" />
            </button>
          )}
          <button
            type="button"
            onClick={handleLanguageToggle}
            className="p-1.5 rounded-lg bg-stone-800 text-xs font-bold text-stone-300"
          >
            <Globe className="w-4 h-4 text-emerald-400" />
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="p-1.5 rounded-lg bg-red-900/50 text-red-300"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* MAIN VIEW CONTENT CONTAINER */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 max-w-6xl pb-24 md:pb-8">
        {activeTab === 'dashboard' && (
          <DashboardView adminSession={adminSession} onNavigateTab={setActiveTab} />
        )}
        {activeTab === 'qr_checkin' && (
          <QRCheckInView adminSession={adminSession} />
        )}
        {activeTab === 'queue' && (
          <QueueManagementView adminSession={adminSession} />
        )}
        {activeTab === 'verification' && (
          <FarmerVerificationView adminSession={adminSession} />
        )}
        {activeTab === 'stages' && (
          <StageProgressionView adminSession={adminSession} />
        )}
        {activeTab === 'walkin' && (
          <WalkInBookingView adminSession={adminSession} />
        )}
        {activeTab === 'inbox' && (
          <CenterInboxView adminSession={adminSession} />
        )}
        {activeTab === 'audit' && (
          <AuditLogView adminSession={adminSession} />
        )}
      </main>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <div className="md:hidden fixed bottom-0 inset-x-0 bg-stone-900/95 backdrop-blur-md border-t border-stone-800 z-40 grid grid-cols-4 gap-1 p-2">
        {NAV_ITEMS.slice(0, 4).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={`p-2 rounded-xl flex flex-col items-center justify-center text-[10px] font-bold ${
                isActive ? 'text-emerald-400 font-black' : 'text-stone-400'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="truncate max-w-[65px] mt-0.5">{isHindi ? item.labelHi : item.labelEn}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
