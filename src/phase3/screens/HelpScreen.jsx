import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  HelpCircle, 
  Phone, 
  Video, 
  Bot, 
  ChevronRight, 
  ChevronDown, 
  ArrowLeft, 
  ShieldCheck, 
  Clock, 
  FileText,
  Building2,
  Calendar,
  CreditCard,
  QrCode
} from 'lucide-react';
import Header from '../../components/common/Header';
import BottomNav from '../../components/common/BottomNav';
import SpeakerButton from '../../components/common/SpeakerButton';
import AIAssistantModal from '../components/AIAssistantModal';
import VideoGuide from '../components/VideoGuide';
import { VIDEO_GUIDES } from '../videoConfig';

const FAQ_ITEMS = [
  {
    qEn: 'What documents do I need to bring to the procurement center?',
    qHi: 'खरीद केंद्र (मंडी) में मुझे कौन से दस्तावेज लाने होंगे?',
    aEn: 'Bring your Kisan Passbook / Card, the digital QR token pass on your mobile phone, and an Aadhaar card for biometric verification at the gate.',
    aHi: 'अपना किसान पासबुक / कार्ड, मोबाइल में डिजिटल क्यूआर टोकन पास, और गेट पर सत्यापन हेतु आधार कार्ड साथ लाएं।'
  },
  {
    qEn: 'What is the maximum allowed moisture limit for grains?',
    qHi: 'अनाज में अधिकतम स्वीकार्य नमी (Moisture) की सीमा क्या है?',
    aEn: 'For Wheat, standard permissible moisture is 12.0% (accepted up to 14.0% with standard value deduction). For Paddy, maximum limit is 17.0%.',
    aHi: 'गेहूं के लिए मानक स्वीकार्य नमी 12.0% है (अधिकतम 14.0% कटौती के साथ)। धान के लिए अधिकतम नमी की सीमा 17.0% है।'
  },
  {
    qEn: 'What happens if I miss my scheduled delivery slot?',
    qHi: 'यदि मैं अपने तय समय स्लॉट पर नहीं पहुंच पाता तो क्या होगा?',
    aEn: 'A 30-minute grace period is provided. If you miss it, you can either reschedule to the next available day with 1-tap in the app or visit the Assisted Walk-In desk at the mandi.',
    aHi: 'प्रत्येक स्लॉट में 30 मिनट का ग्रेस समय मिलता है। इसके बाद आप ऐप में बिना पेनल्टी अगले दिन स्लॉट रीशेड्यूल कर सकते हैं या मंडी के वॉक-इन काउंटर पर जा सकते हैं।'
  },
  {
    qEn: 'When will the MSP payment reach my bank account?',
    qHi: 'एमएसपी का भुगतान मेरे बैंक खाते में कब तक आएगा?',
    aEn: 'Government DBT payments are credited directly to your Aadhaar-linked bank account within 48 to 72 hours of weighment and J-Form issuance.',
    aHi: 'धर्मकांटा तौल और जे-फॉर्म बनने के 48 से 72 घंटों के भीतर सीधे आपके आधार से जुड़े बैंक खाते (DBT) में राशि जमा हो जाती है।'
  }
];

export default function HelpScreen({ onNavigate, onBack }) {
  const { t, i18n } = useTranslation();
  const isHindi = i18n.language.startsWith('hi');

  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const speakerPrompt = isHindi
    ? 'AgriMinds सहायता केंद्र: आप वीडियो गाइड देख सकते हैं, अक्सर पूछे जाने वाले प्रश्न पढ़ सकते हैं, AI सहायक से बात कर सकते हैं, या 1800-180-1551 पर कॉल कर सकते हैं।'
    : 'AgriMinds Help Center: You can watch video guides, read FAQs, talk to our AI assistant, or call our toll-free helpline at 1800-180-1551.';

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col max-w-md mx-auto font-sans pb-24">
      {/* Header */}
      <Header
        currentScreen="settings"
        onNavigate={onNavigate}
        screenSpeakerText={speakerPrompt}
      />

      <main className="p-4 space-y-4 flex-1 overflow-y-auto">
        {/* Top Title Strip */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBack || (() => onNavigate('home'))}
            className="p-2 -ml-2 text-stone-600 hover:text-stone-900 flex items-center gap-1.5 text-xs font-bold active:scale-95 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('common.back')}</span>
          </button>

          <SpeakerButton textToRead={speakerPrompt} size="sm" />
        </div>

        {/* 2 Big Action Tiles: AI Assistant & Toll-Free Helpline */}
        <div className="grid grid-cols-2 gap-3">
          {/* AI Assistant */}
          <button
            type="button"
            onClick={() => setShowAIAssistant(true)}
            className="p-4 rounded-3xl bg-gradient-to-br from-emerald-800 to-emerald-950 text-white shadow-md hover:shadow-lg border border-emerald-700/50 flex flex-col justify-between min-h-[130px] text-left active:scale-95 transition-all group"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-stone-950 flex items-center justify-center font-black shadow-sm group-hover:scale-105 transition-transform">
              <Bot className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white group-hover:text-amber-300">
                {isHindi ? 'AI सहायक से पूछें' : 'Talk to AI Assistant'}
              </h3>
              <p className="text-[11px] text-emerald-200 font-semibold mt-0.5">
                {isHindi ? 'बोलकर या लिखकर समाधान' : 'Instant voice & chat help'}
              </p>
            </div>
          </button>

          {/* Toll-Free Call Helpline */}
          <a
            href="tel:18001801551"
            className="p-4 rounded-3xl bg-stone-900 text-white shadow-md hover:shadow-lg border border-stone-800 flex flex-col justify-between min-h-[130px] text-left active:scale-95 transition-all group"
          >
            <div className="w-12 h-12 rounded-2xl bg-stone-800 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-black group-hover:scale-105 transition-transform">
              <Phone className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white group-hover:text-emerald-300">
                {isHindi ? 'किसान हेल्पलाइन' : 'Call Helpline'}
              </h3>
              <p className="text-[11px] text-stone-400 font-mono font-bold mt-0.5">
                1800-180-1551
              </p>
            </div>
          </a>
        </div>

        {/* Video Tutorial Library */}
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-stone-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Video className="w-4 h-4 text-emerald-700" />
              <h3 className="text-xs font-black text-stone-900">
                {isHindi ? 'वीडियो गाइड एवं ट्यूटोरियल' : 'Video Guides & Tutorials'}
              </h3>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              4 {isHindi ? 'गाइड' : 'Videos'}
            </span>
          </div>

          <div className="space-y-2">
            {VIDEO_GUIDES.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setSelectedVideoId(v.id)}
                className="w-full p-3 bg-stone-50 hover:bg-emerald-50 border border-stone-200 hover:border-emerald-300 rounded-2xl text-left flex items-center justify-between active:scale-98 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white text-emerald-800 border border-stone-200 flex items-center justify-center group-hover:bg-amber-400 group-hover:text-stone-950 transition-colors">
                    <Video className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-900 group-hover:text-emerald-900">
                      {isHindi ? v.titleHi : v.titleEn}
                    </h4>
                    <span className="text-[10px] text-stone-500 font-mono font-medium">
                      ⏱ {v.duration} • 3 {isHindi ? 'चरण' : 'steps'}
                    </span>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition-all" />
              </button>
            ))}
          </div>
        </div>

        {/* Curated FAQ Accordion */}
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-stone-200 space-y-3">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-emerald-700" />
            <h3 className="text-xs font-black text-stone-900">
              {isHindi ? 'अक्सर पूछे जाने वाले सवाल (FAQ)' : 'Frequently Asked Questions'}
            </h3>
          </div>

          <div className="space-y-2">
            {FAQ_ITEMS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-stone-200 overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-3.5 bg-stone-50 hover:bg-stone-100 text-left flex items-center justify-between text-xs font-bold text-stone-800 gap-2"
                  >
                    <span>{isHindi ? faq.qHi : faq.qEn}</span>
                    {isOpen ? (
                      <ChevronDown className="w-4 h-4 text-emerald-700 shrink-0" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-stone-400 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="p-3.5 bg-white text-xs text-stone-600 font-medium leading-relaxed border-t border-stone-200 animate-fade-in">
                      {isHindi ? faq.aHi : faq.aEn}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNav currentScreen="settings" onNavigate={onNavigate} />

      {/* AI Assistant Modal */}
      <AIAssistantModal
        isOpen={showAIAssistant}
        onClose={() => setShowAIAssistant(false)}
        onNavigate={onNavigate}
      />

      {/* Video Guide Modal */}
      {selectedVideoId && (
        <VideoGuide
          guideId={selectedVideoId}
          isOpen={!!selectedVideoId}
          onClose={() => setSelectedVideoId(null)}
        />
      )}
    </div>
  );
}
