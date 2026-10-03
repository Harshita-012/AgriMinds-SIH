import React from 'react';
import { useTranslation } from 'react-i18next';
import { Home, Calendar, Users, Settings } from 'lucide-react';

export default function BottomNav({ currentScreen, onNavigate }) {
  const { t } = useTranslation();

  const navItems = [
    { id: 'home', label: t('common.home'), icon: Home },
    { id: 'centers', label: t('common.centers'), icon: Calendar },
    { id: 'queue', label: t('common.queue'), icon: Users },
    { id: 'settings', label: t('common.settings'), icon: Settings }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur-md border-t border-stone-200 z-30 shadow-lg">
      <div className="flex items-center justify-around py-2 px-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all ${
                isActive
                  ? 'text-emerald-800 font-black scale-105'
                  : 'text-stone-500 hover:text-stone-800 font-semibold'
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-colors ${
                isActive ? 'bg-emerald-100 text-emerald-800' : 'text-stone-500'
              }`}>
                <Icon className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-[11px] mt-0.5 tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
