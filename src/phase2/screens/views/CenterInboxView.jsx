import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Inbox, CheckCircle2, MessageSquare, AlertCircle, Phone, ArrowRight } from 'lucide-react';
import { sharedStore } from '../../store';

export default function CenterInboxView({ adminSession }) {
  const { t, i18n } = useTranslation();
  const isHindi = i18n.language.startsWith('hi');

  const state = sharedStore.getState();
  const [inboxList, setInboxList] = useState(state.centerInbox || []);

  const handleResolve = (id) => {
    const updated = inboxList.map(item => {
      if (item.id === id) return { ...item, status: 'resolved' };
      return item;
    });
    setInboxList(updated);
    state.centerInbox = updated;
    sharedStore.saveState();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-stone-900 p-5 rounded-3xl border border-stone-800 text-white space-y-1">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
          <Inbox className="w-4 h-4" />
          <span>{isHindi ? 'पुनः जांच व शिकायत निवारण' : 'Re-Check & Complaint Inbox'}</span>
        </div>
        <h2 className="text-xl font-black">
          {isHindi ? 'किसान अनुरोध एवं शिकायत इनबॉक्स' : 'Farmer Requests & Grievance Inbox'}
        </h2>
        <p className="text-xs text-stone-400">
          {isHindi 
            ? 'गुणवत्ता अस्वीकृति के बाद किसानों द्वारा भेजी गई पुनः जांच अपील एवं शिकायतें।' 
            : 'In-app re-inspection appeals and complaints submitted by farmers.'}
        </p>
      </div>

      {/* Inbox items */}
      <div className="space-y-3">
        {inboxList.length === 0 ? (
          <div className="text-center py-12 bg-stone-900 rounded-3xl border border-stone-800 text-stone-500 text-xs font-semibold">
            {isHindi ? 'कोई लंबित अनुरोध या शिकायत नहीं है।' : 'No pending re-check requests or complaints.'}
          </div>
        ) : (
          inboxList.map((item) => (
            <div
              key={item.id}
              className={`p-5 rounded-3xl border transition-all ${
                item.status === 'resolved'
                  ? 'bg-stone-900/60 border-stone-800 opacity-60'
                  : item.type === 'recheck'
                  ? 'bg-stone-900 border-blue-500/50'
                  : 'bg-stone-900 border-amber-500/50'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      item.type === 'recheck'
                        ? 'bg-blue-900 text-blue-300 border border-blue-600/40'
                        : 'bg-amber-900 text-amber-300 border border-amber-600/40'
                    }`}>
                      {item.type === 'recheck' ? (isHindi ? 'पुनः जांच अनुरोध' : 'Re-Check Request') : (isHindi ? 'शिकायत' : 'Grievance Complaint')}
                    </span>
                    <span className="text-xs font-bold text-white">
                      Token #{item.tokenNumber} • {item.farmerName}
                    </span>
                    <span className="text-[11px] text-stone-500 font-mono ml-auto sm:ml-0">{item.timestamp}</span>
                  </div>

                  <p className="text-xs text-stone-200 font-medium bg-stone-950 p-3 rounded-2xl border border-stone-800/80">
                    "{item.reason}"
                  </p>

                  <div className="flex items-center gap-3 text-xs text-stone-400">
                    <span>🌾 {item.crop}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-emerald-400" />
                      <span>{item.mobile}</span>
                    </span>
                  </div>
                </div>

                <div className="self-end sm:self-center">
                  {item.status === 'resolved' ? (
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isHindi ? 'निस्तारित ✓' : 'Resolved ✓'}</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleResolve(item.id)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold active:scale-95 transition-all shadow-sm"
                    >
                      {isHindi ? 'निस्तारण मार्क करें' : 'Mark Resolved'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
