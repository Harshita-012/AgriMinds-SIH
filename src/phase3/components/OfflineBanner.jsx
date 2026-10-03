import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { WifiOff, RefreshCw, CheckCircle2 } from 'lucide-react';
import { offlineSync } from '../services/offlineSync';

export default function OfflineBanner({ lastSavedTime }) {
  const { t, i18n } = useTranslation();
  const isHindi = i18n.language.startsWith('hi');

  const [isOnline, setIsOnline] = useState(offlineSync.getEffectiveOnlineStatus());
  const [pendingCount, setPendingCount] = useState(offlineSync.getPendingQueueCount());
  const [showSyncSuccess, setShowSyncSuccess] = useState(false);

  useEffect(() => {
    const unsub = offlineSync.subscribe((status, pending) => {
      if (!isOnline && status) {
        // Just came back online
        setShowSyncSuccess(true);
        setTimeout(() => setShowSyncSuccess(false), 3000);
      }
      setIsOnline(status);
      setPendingCount(pending);
    });
    return () => unsub();
  }, [isOnline]);

  if (showSyncSuccess) {
    return (
      <div className="bg-emerald-600 text-white px-4 py-2 text-xs font-bold flex items-center justify-between shadow-md transition-all animate-fade-in">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-200" />
          <span>{isHindi ? 'इंटरनेट पुनः कनेक्ट हुआ! सभी डेटा सिंक हो गया है।' : 'Reconnected to server! All offline actions synchronized.'}</span>
        </div>
        <span className="text-[10px] bg-emerald-800 px-2 py-0.5 rounded-md">LIVE</span>
      </div>
    );
  }

  if (isOnline) return null;

  return (
    <div className="bg-amber-600 text-stone-950 px-4 py-2 text-xs font-bold flex items-center justify-between shadow-md transition-all animate-fade-in">
      <div className="flex items-center gap-2">
        <WifiOff className="w-4 h-4 text-stone-950 shrink-0" />
        <span>
          {isHindi 
            ? `ऑफलाइन मोड: अंतिम सहेजी गई जानकारी प्रदर्शित हो रही है ${lastSavedTime ? `(${lastSavedTime})` : ''}`
            : `Offline mode: showing last saved information ${lastSavedTime ? `(${lastSavedTime})` : ''}`}
        </span>
      </div>
      {pendingCount > 0 && (
        <span className="px-2 py-0.5 bg-amber-900 text-amber-200 rounded-full text-[10px] font-mono">
          {pendingCount} {isHindi ? 'लंबित' : 'pending'}
        </span>
      )}
    </div>
  );
}
