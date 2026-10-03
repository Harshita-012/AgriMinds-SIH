import React from 'react';
import { useTranslation } from 'react-i18next';
import { CloudRain, AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { weatherService, WEATHER_TYPES } from '../weather';

export default function WeatherAlertBanner({ bookingDate, forecastList, onReschedule, onDismiss }) {
  const { t, i18n } = useTranslation();
  const isHindi = i18n.language.startsWith('hi');

  // Check if booking date has rain
  const rainForecast = (forecastList || []).find(f => f.type === 'rain' || f.type === 'heavy_rain');

  if (!rainForecast) return null;

  return (
    <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 rounded-3xl p-4 shadow-md border border-amber-300 space-y-2.5 animate-fadeIn">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 font-black text-sm">
          <div className="w-8 h-8 rounded-xl bg-stone-950 text-amber-300 flex items-center justify-center shrink-0">
            <CloudRain className="w-5 h-5" />
          </div>
          <div>
            <h4 className="leading-tight">
              {isHindi ? 'मौसम चेतावनी: बारिश का अनुमान' : 'Weather Alert: Rain Expected'}
            </h4>
            <span className="text-[11px] font-bold text-stone-900 opacity-90 block">
              {isHindi 
                ? 'आपकी बुकिंग वाले दिन तेज बारिश का अलर्ट है। फसल को भीगने से बचाने के लिए सुरक्षित दिन चुनें।'
                : 'Rainfall expected on scheduled day. Reschedule to a clear weather day with high priority.'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-1">
        <button
          type="button"
          onClick={onReschedule}
          className="flex-1 py-2.5 px-3 bg-stone-950 hover:bg-stone-900 active:scale-95 text-amber-300 rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition-transform shadow-xs"
        >
          <span>{isHindi ? 'सुरक्षित दिन पर री-शेड्यूल करें' : 'Reschedule to Safer Day'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="py-2.5 px-3 bg-amber-600/30 hover:bg-amber-600/50 text-stone-950 rounded-2xl text-xs font-bold active:scale-95"
          >
            {t('common.cancel')}
          </button>
        )}
      </div>
    </div>
  );
}
