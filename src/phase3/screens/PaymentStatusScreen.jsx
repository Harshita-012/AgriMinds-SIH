import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  ArrowLeft, 
  Building2, 
  FileText, 
  Download, 
  HelpCircle, 
  AlertCircle, 
  ShieldCheck,
  Bot,
  Scale
} from 'lucide-react';
import Header from '../../components/common/Header';
import BottomNav from '../../components/common/BottomNav';
import SpeakerButton from '../../components/common/SpeakerButton';
import { storage } from '../../services/storage';
import { CROPS } from '../../data/mockData';
import AIAssistantModal from '../components/AIAssistantModal';

export default function PaymentStatusScreen({ onNavigate, onBack }) {
  const { t, i18n } = useTranslation();
  const isHindi = i18n.language.startsWith('hi');

  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const activeToken = storage.getActiveToken() || {
    tokenNumber: 147,
    centerName: 'Nilokheri Main Grain Mandi',
    date: 'Today, 24 Sep',
    cropId: 'wheat',
    cropName: 'Wheat',
    quantity: 40,
    kisanCardMasked: '••••-••••-8921',
    currentStageId: 5
  };

  const cropObj = CROPS.find(c => c.id === activeToken.cropId) || CROPS[0];
  const mspRate = cropObj.msp || 2275;
  const quantity = activeToken.quantity || 40;
  const totalAmount = quantity * mspRate;

  const currentStage = activeToken.currentStageId || 5;
  const isPaid = currentStage === 7;
  const isProcessing = currentStage >= 5 && currentStage < 7;

  const speakerPrompt = isHindi
    ? `टोकन #${activeToken.tokenNumber} के लिए भुगतान विवरण: फसल ${activeToken.cropName || 'गेहूं'}, मात्रा ${quantity} क्विंटल, कुल राशि ₹${totalAmount.toLocaleString('en-IN')}। वर्तमान स्थिति: ${isPaid ? 'खाते में क्रेडिट' : 'प्रक्रियाधीन'}।`
    : `Payment status for Token #${activeToken.tokenNumber}: Crop ${activeToken.cropName || 'Wheat'}, Quantity ${quantity} Quintals, Total Amount ₹${totalAmount.toLocaleString('en-IN')}. Current status: ${isPaid ? 'Credited to Bank' : 'Processing'}.`;

  const PAYMENT_STEPS = [
    {
      id: 1,
      titleEn: '1. Quality Approved',
      titleHi: '1. गुणवत्ता स्वीकृत',
      descEn: 'Grade A sample verified at mandi lab',
      descHi: 'मंडी प्रयोगशाला में ग्रेड ए नमूना प्रमाणित',
      completed: currentStage >= 3
    },
    {
      id: 2,
      titleEn: '2. Weighbridge Recorded',
      titleHi: '2. धर्मकांटा तौल रसीद',
      descEn: `${quantity}.0 Quintals net weight certified`,
      descHi: `${quantity}.0 क्विंटल कुल शुद्ध वजन प्रमाणित`,
      completed: currentStage >= 4
    },
    {
      id: 3,
      titleEn: '3. J-Form Generated',
      titleHi: '3. जे-फॉर्म (खरीद पर्ची)',
      descEn: 'Official procurement receipt issued',
      descHi: 'आधिकारिक खरीद रसीद जारी',
      completed: currentStage >= 5
    },
    {
      id: 4,
      titleEn: '4. Direct Bank Transfer (DBT)',
      titleHi: '4. डीबीटी बैंक ट्रांसफर',
      descEn: isPaid ? '₹' + totalAmount.toLocaleString('en-IN') + ' Credited (UTR: SBIN98410294)' : 'Expected within 48 hours to Aadhaar-linked account',
      descHi: isPaid ? '₹' + totalAmount.toLocaleString('en-IN') + ' खाते में जमा (UTR: SBIN98410294)' : 'आधार से जुड़े बैंक खाते में 48 घंटे में अपेक्षित',
      completed: isPaid,
      active: isProcessing
    }
  ];

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col max-w-md mx-auto font-sans pb-24">
      {/* Header */}
      <Header
        currentScreen="tracker"
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

        {/* Total Amount Hero Card */}
        <div className="bg-gradient-to-br from-emerald-800 via-emerald-900 to-stone-900 text-white rounded-3xl p-5 shadow-lg border border-emerald-700/40 space-y-3">
          <div className="flex items-center justify-between text-xs text-emerald-200">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-amber-400" />
              <span className="font-bold uppercase tracking-wider">
                {isHindi ? 'सरकारी एमएसपी भुगतान' : 'Official MSP Payment'}
              </span>
            </div>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
              isPaid ? 'bg-emerald-500 text-stone-950' : 'bg-amber-400 text-stone-950'
            }`}>
              {isPaid ? (isHindi ? 'खाते में जमा ✓' : 'Credited ✓') : (isHindi ? 'प्रक्रियाधीन' : 'Processing')}
            </span>
          </div>

          <div>
            <span className="text-xs text-emerald-300 font-semibold block">
              {isHindi ? 'कुल देय राशि (अनुमानित)' : 'Total Payable Amount'}
            </span>
            <div className="text-3xl font-black text-white tracking-tight mt-0.5">
              ₹{totalAmount.toLocaleString('en-IN')}
            </div>
          </div>

          <div className="pt-2 border-t border-white/10 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-white/5 p-2 rounded-xl">
              <span className="text-[10px] text-emerald-300 block">{isHindi ? 'फसल' : 'Crop'}</span>
              <span className="font-bold">{activeToken.cropName || 'Wheat'}</span>
            </div>
            <div className="bg-white/5 p-2 rounded-xl">
              <span className="text-[10px] text-emerald-300 block">{isHindi ? 'मात्रा' : 'Quantity'}</span>
              <span className="font-bold">{quantity} {t('common.quintal')}</span>
            </div>
            <div className="bg-white/5 p-2 rounded-xl">
              <span className="text-[10px] text-emerald-300 block">{isHindi ? 'एमएसपी दर' : 'MSP Rate'}</span>
              <span className="font-bold">₹{mspRate}</span>
            </div>
          </div>
        </div>

        {/* Progress Stepper */}
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-stone-200 space-y-4">
          <h3 className="text-sm font-black text-stone-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-700" />
            <span>{isHindi ? 'भुगतान प्रगति एवं चरण' : 'Payment Stepper'}</span>
          </h3>

          <div className="space-y-4 relative pl-2">
            {PAYMENT_STEPS.map((step, idx) => (
              <div key={step.id} className="flex items-start gap-3 relative">
                {/* Vertical Connector Line */}
                {idx < PAYMENT_STEPS.length - 1 && (
                  <div className={`absolute left-3.5 top-7 bottom-0 w-0.5 -mb-4 ${
                    step.completed ? 'bg-emerald-600' : 'bg-stone-200'
                  }`} />
                )}

                {/* Step Icon Indicator */}
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 ${
                  step.completed 
                    ? 'bg-emerald-600 text-white shadow-sm' 
                    : step.active 
                    ? 'bg-amber-400 text-stone-950 animate-pulse' 
                    : 'bg-stone-200 text-stone-400'
                }`}>
                  {step.completed ? (
                    <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                  ) : (
                    <span className="text-xs font-black">{step.id}</span>
                  )}
                </div>

                <div className="flex-1 pb-1">
                  <h4 className={`text-xs font-bold ${
                    step.completed ? 'text-stone-900' : step.active ? 'text-amber-900' : 'text-stone-400'
                  }`}>
                    {isHindi ? step.titleHi : step.titleEn}
                  </h4>
                  <p className="text-[11px] text-stone-500 font-medium mt-0.5">
                    {isHindi ? step.descHi : step.descEn}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Digital J-Form Receipt Box */}
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-stone-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-700" />
              <h3 className="text-xs font-black text-stone-900">
                {isHindi ? 'डिजिटल जे-फॉर्म रसीद' : 'Digital J-Form Receipt'}
              </h3>
            </div>
            <span className="text-[10px] font-mono font-bold text-stone-500">
              #JF-2024-89104
            </span>
          </div>

          <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 text-xs space-y-1.5 font-mono">
            <div className="flex justify-between">
              <span className="text-stone-500">{isHindi ? 'किसान कार्ड' : 'Kisan Card'}:</span>
              <span className="font-bold text-stone-800">{activeToken.kisanCardMasked || '••••-••••-8921'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">{isHindi ? 'खरीद केंद्र' : 'Procurement Mandi'}:</span>
              <span className="font-bold text-stone-800 truncate max-w-[170px]">{activeToken.centerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">{isHindi ? 'शुद्ध वजन' : 'Net Weight'}:</span>
              <span className="font-bold text-stone-800">{quantity}.0 Quintals</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">{isHindi ? 'बैंक खाता (DBT)' : 'DBT Bank'}:</span>
              <span className="font-bold text-stone-800">State Bank (••••4412)</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => window.print()}
            className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 active:scale-98 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>{isHindi ? 'रसीद डाउनलोड / प्रिंट करें' : 'Download / Print Receipt'}</span>
          </button>
        </div>

        {/* Ask for Help Strip -> Opens AI Assistant */}
        <div className="p-4 bg-amber-50 rounded-3xl border border-amber-200 flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-xs font-black text-amber-900">
              <Bot className="w-4 h-4 text-emerald-700" />
              <span>{isHindi ? 'भुगतान में कोई समस्या है?' : 'Need Help with Payment?'}</span>
            </div>
            <p className="text-[11px] text-amber-800 font-medium">
              {isHindi ? 'AgriMinds AI या मंडी सहायता अधिकारी से पूछें' : 'Ask AgriMinds AI or Mandi Staff'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAIAssistant(true)}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-xs active:scale-95 transition-all shrink-0"
          >
            {isHindi ? 'सहायता लें' : 'Ask AI'}
          </button>
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNav currentScreen="tracker" onNavigate={onNavigate} />

      {/* AI Assistant Modal */}
      <AIAssistantModal
        isOpen={showAIAssistant}
        onClose={() => setShowAIAssistant(false)}
        onNavigate={onNavigate}
      />
    </div>
  );
}
