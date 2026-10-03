import React from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, Building2, ChevronRight, ArrowLeft, Landmark } from 'lucide-react';
import { ROLES } from '../roles';

const ROLE_ICONS = {
  Building2,
  Landmark
};

export default function AdminRoleSelectionScreen({ onSelectRole, onBack }) {
  const { t, i18n } = useTranslation();
  const isHindi = i18n.language.startsWith('hi');

  return (
    <div className="min-h-screen bg-stone-900 text-white flex flex-col justify-between p-4 md:p-8 max-w-lg mx-auto font-sans">
      {/* Top Header */}
      <div className="space-y-4 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="p-2 -ml-2 text-stone-400 hover:text-white flex items-center gap-1.5 text-xs font-bold active:scale-95 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('common.back')}</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-stone-950 flex items-center justify-center font-black shadow-lg">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
              {isHindi ? 'अधिकारी / कर्मचारी पोर्टल' : 'Official / Staff Portal'}
            </span>
            <h1 className="text-2xl font-black text-white tracking-wide">
              {isHindi ? 'अपना पद / रोल चुनें' : 'Select Portal Role'}
            </h1>
          </div>
        </div>

        <p className="text-xs text-stone-400 leading-relaxed">
          {isHindi 
            ? 'मंडी खरीद संचालन, सत्यापन, जिला हीटमैप एवं रिपोर्टिंग के लिए अधिकृत रोल का चयन करें।'
            : 'Select your authorized administrative role to manage mandi operations, verification, district heatmaps, and reports.'}
        </p>
      </div>

      {/* Role Selection Tiles */}
      <div className="my-6 space-y-3.5">
        {ROLES.map((role) => {
          const Icon = ROLE_ICONS[role.icon] || Building2;
          const isGovt = role.id === 'govt_official';

          return (
            <button
              key={role.id}
              type="button"
              onClick={() => onSelectRole(role)}
              className="w-full p-5 rounded-3xl bg-stone-800/90 hover:bg-stone-800 border-2 border-stone-700 hover:border-amber-400 active:scale-98 text-left flex items-center justify-between group transition-all shadow-lg"
            >
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform ${
                  isGovt
                    ? 'bg-amber-950 border border-amber-500/30 text-amber-400'
                    : 'bg-emerald-950 border border-emerald-500/30 text-emerald-400'
                }`}>
                  <Icon className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-white group-hover:text-amber-300">
                      {isHindi ? role.labelHi : role.labelEn}
                    </h3>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-emerald-900/60 text-emerald-300 border border-emerald-600/40 rounded-md">
                      {isHindi ? 'सक्रिय' : 'Active'}
                    </span>
                  </div>
                  <p className="text-xs text-stone-400 font-medium mt-1 leading-snug max-w-[280px]">
                    {isHindi ? role.descHi : role.descEn}
                  </p>
                </div>
              </div>

              <ChevronRight className="w-6 h-6 text-stone-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
            </button>
          );
        })}
      </div>

      {/* Footer Return Action */}
      <div className="pt-4 border-t border-stone-800 text-center">
        <button
          type="button"
          onClick={onBack}
          className="text-xs font-bold text-stone-400 hover:text-amber-400 transition-colors py-2"
        >
          {isHindi ? '← पोर्टल चयन पर वापस जाएं' : '← Return to Portal Choice'}
        </button>
      </div>
    </div>
  );
}

