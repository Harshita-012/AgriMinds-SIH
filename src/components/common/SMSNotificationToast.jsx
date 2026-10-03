import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Smartphone } from 'lucide-react';
import { simulation } from '../../services/simulation';

export default function SMSNotificationToast() {
  const { i18n } = useTranslation();
  const [toast, setToast] = useState(null);

  const isHindi = i18n.language.startsWith('hi');

  useEffect(() => {
    const unsub = simulation.subscribeSMS((data) => {
      setToast(data);
      // Auto dismiss after 7 seconds
      const timer = setTimeout(() => {
        setToast(null);
      }, 7000);
      return () => clearTimeout(timer);
    });
    return () => unsub();
  }, []);

  if (!toast) return null;

  return (
    <div className="fixed top-4 left-4 right-4 z-50 max-w-md mx-auto animate-bounce-short">
      <div className="bg-stone-900 text-white p-4 rounded-3xl shadow-2xl border-2 border-emerald-500 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-stone-950 flex items-center justify-center font-bold">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wide">
                {isHindi ? 'नया एसएमएस अलर्ट' : 'New SMS Alert'}
              </div>
              <div className="text-[10px] text-stone-400">{toast.timestamp}</div>
            </div>
          </div>
          <button
            onClick={() => setToast(null)}
            className="p-1 text-stone-400 hover:text-white rounded-full"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <p className="text-sm font-medium text-stone-100 bg-stone-800/80 p-3 rounded-2xl border border-stone-700 leading-snug">
          {toast.message}
        </p>
      </div>
    </div>
  );
}
