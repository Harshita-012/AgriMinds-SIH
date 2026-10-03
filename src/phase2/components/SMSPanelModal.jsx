import React from 'react';
import { useTranslation } from 'react-i18next';
import { MessageSquare, X, Smartphone, Volume2, CheckCheck } from 'lucide-react';
import { speech } from '../../services/speech';

export default function SMSPanelModal({ messages, isOpen, onClose }) {
  const { t, i18n } = useTranslation();
  const isHindi = i18n.language.startsWith('hi');

  if (!isOpen) return null;

  const handleSpeak = (text) => {
    speech.speak(text, i18n.language);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-xs">
      <div className="bg-stone-900 text-white w-full max-w-md rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl border border-stone-700 flex flex-col max-h-[85vh]">
        {/* Header styled like a Mobile Phone SMS Inbox */}
        <div className="p-4 bg-stone-950 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-500 text-stone-950 flex items-center justify-center font-bold shadow-sm">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">
                {isHindi ? 'एसएमएस संदेश (ऑफलाइन बैकअप)' : 'SMS Messages'}
              </h3>
              <span className="text-[10px] text-emerald-400 font-semibold block">
                {isHindi ? 'मंडी द्वारा भेजे गए संदेश' : 'Direct SMS updates sent to mobile'}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-white bg-stone-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SMS List */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1 bg-stone-900/90">
          {!messages || messages.length === 0 ? (
            <div className="text-center py-12 text-stone-500 space-y-2">
              <MessageSquare className="w-10 h-10 mx-auto text-stone-700" />
              <p className="font-semibold text-xs">
                {isHindi ? 'कोई एसएमएस संदेश नहीं है।' : 'No SMS messages yet.'}
              </p>
            </div>
          ) : (
            messages.map((sms) => (
              <div
                key={sms.id}
                className="bg-stone-800/90 border border-stone-700/80 rounded-2xl p-3.5 space-y-2 shadow-xs"
              >
                <div className="flex items-center justify-between text-[11px] font-bold text-stone-400">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span className="text-emerald-400 uppercase tracking-wider">
                      {sms.type ? sms.type.replace('_', ' ') : 'SMS'}
                    </span>
                  </div>
                  <span>{sms.timestamp}</span>
                </div>

                <p className="text-xs text-stone-100 font-medium leading-relaxed">
                  {sms.text}
                </p>

                <div className="flex items-center justify-between pt-1 border-t border-stone-700/50">
                  <div className="flex items-center gap-1 text-[10px] text-stone-400 font-semibold">
                    <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{isHindi ? 'प्राप्त' : 'Delivered to phone'}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSpeak(sms.text)}
                    className="p-1.5 rounded-xl bg-stone-700 hover:bg-stone-600 text-amber-300 flex items-center gap-1 text-[11px] font-bold active:scale-95 transition-all"
                    title="Listen to SMS"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{isHindi ? 'सुनें' : 'Listen'}</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-stone-950 border-t border-stone-800 text-center text-[11px] text-stone-500">
          {isHindi 
            ? 'कम इंटरनेट या सामान्य फोन पर यह जानकारी सीधे एसएमएस से मिलती है।' 
            : 'SMS alerts work without internet on any standard mobile phone.'}
        </div>
      </div>
    </div>
  );
}
