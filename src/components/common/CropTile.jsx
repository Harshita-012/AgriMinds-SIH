import React from 'react';
import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react';

export default function CropTile({ crop, isSelected, onToggle }) {
  const { t } = useTranslation();
  const cropName = t(crop.nameKey);

  return (
    <button
      type="button"
      onClick={() => onToggle(crop)}
      className={`p-3.5 rounded-3xl border-2 text-center transition-all flex flex-col items-center justify-between min-h-[110px] relative active:scale-95 group ${
        isSelected
          ? 'border-emerald-700 bg-emerald-50 text-emerald-950 font-black shadow-md ring-2 ring-emerald-600/30'
          : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-800 shadow-xs'
      }`}
    >
      {/* Checkmark icon badge */}
      {isSelected && (
        <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center shadow-sm">
          <Check className="w-4 h-4 stroke-[3.5]" />
        </div>
      )}

      {/* Large visual picture / emoji icon */}
      <div className="w-14 h-14 rounded-2xl bg-stone-100/80 flex items-center justify-center text-3xl shadow-inner group-hover:scale-105 transition-transform mt-1">
        {crop.icon || '🌾'}
      </div>

      {/* Crop Name below in the chosen language */}
      <div className="mt-2 w-full px-1">
        <span className="text-xs font-black block truncate">
          {cropName}
        </span>
        <span className="text-[10px] text-stone-500 font-semibold block">
          ₹{crop.msp}/q
        </span>
      </div>
    </button>
  );
}
