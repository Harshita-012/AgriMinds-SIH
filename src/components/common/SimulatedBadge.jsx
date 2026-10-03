import React from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles } from 'lucide-react';

export default function SimulatedBadge({ className = '', text }) {
  const { t } = useTranslation();

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300/80 shadow-xs ${className}`}>
      <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
      <span>{text || t('common.simulatedBadge')}</span>
    </span>
  );
}
