import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  X, 
  Play, 
  Pause, 
  ChevronRight, 
  ChevronLeft, 
  Volume2, 
  VolumeX, 
  Video, 
  Globe, 
  Tractor, 
  UserCheck, 
  Building2, 
  Calendar, 
  QrCode, 
  ScanLine, 
  Users, 
  Activity, 
  FileText, 
  CreditCard, 
  CheckCircle2 
} from 'lucide-react';
import { getGuideById } from '../videoConfig';
import { speech } from '../../services/speech';

const ICON_MAP = {
  Globe,
  Tractor,
  UserCheck,
  Building2,
  Calendar,
  QrCode,
  ScanLine,
  Users,
  Activity,
  FileText,
  CreditCard,
  CheckCircle2
};

export default function VideoGuide({ guideId = 'how_to_book', isOpen, onClose }) {
  const { t, i18n } = useTranslation();
  const isHindi = i18n.language.startsWith('hi');

  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [audioNarrate, setAudioNarrate] = useState(true);

  const guide = getGuideById(guideId);
  const currentStep = guide.steps[activeStepIndex] || guide.steps[0];
  const StepIcon = ICON_MAP[currentStep.icon] || Video;

  // Spoken narration
  useEffect(() => {
    if (!isOpen) {
      speech.stop();
      return;
    }
    const textToSpeak = isHindi 
      ? `${currentStep.titleHi}. ${currentStep.descHi}`
      : `${currentStep.titleEn}. ${currentStep.descEn}`;

    if (audioNarrate) {
      speech.speak(textToSpeak, i18n.language);
    } else {
      speech.stop();
    }
  }, [activeStepIndex, isOpen, audioNarrate, i18n.language]);

  // Auto step timer when playing
  useEffect(() => {
    if (!isOpen || !isPlaying) return;
    const interval = setInterval(() => {
      setActiveStepIndex((prev) => (prev + 1) % guide.steps.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isOpen, isPlaying, guide.steps.length]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs animate-fade-in">
      <div className="bg-stone-900 text-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-stone-700 flex flex-col">
        {/* Header */}
        <div className="p-4 bg-stone-950 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center font-black">
              <Video className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white line-clamp-1">
                {isHindi ? guide.titleHi : guide.titleEn}
              </h3>
              <span className="text-[10px] text-stone-400 font-mono">
                {guide.duration} • {isHindi ? 'गाइड वीडियो' : 'Interactive Guide'}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-800 text-stone-400 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Animated Presentation Screen */}
        <div className="relative aspect-4/3 bg-gradient-to-br from-emerald-950 via-stone-950 to-stone-900 flex flex-col items-center justify-between p-6 text-center overflow-hidden">
          {/* Top Progress Dots */}
          <div className="flex items-center gap-2 z-10">
            {guide.steps.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setActiveStepIndex(idx);
                  setIsPlaying(false);
                }}
                className={`h-2 rounded-full transition-all ${
                  idx === activeStepIndex
                    ? 'w-8 bg-amber-400 shadow-md shadow-amber-400/30'
                    : 'w-2 bg-stone-700 hover:bg-stone-600'
                }`}
                aria-label={`Go to step ${idx + 1}`}
              />
            ))}
          </div>

          {/* Central Animated Illustration / Icon */}
          <div className="my-auto space-y-3 z-10 transform transition-all duration-500">
            <div className="w-20 h-20 rounded-3xl bg-amber-400 text-stone-950 flex items-center justify-center mx-auto shadow-2xl shadow-amber-400/20 animate-bounce">
              <StepIcon className="w-10 h-10 stroke-[2.2]" />
            </div>

            <h4 className="text-lg font-black text-white px-2">
              {isHindi ? currentStep.titleHi : currentStep.titleEn}
            </h4>

            <p className="text-xs text-stone-300 max-w-[280px] mx-auto leading-relaxed">
              {isHindi ? currentStep.descHi : currentStep.descEn}
            </p>
          </div>

          {/* Media Player Controls Bar */}
          <div className="flex items-center justify-between w-full pt-2 z-10 border-t border-white/10">
            <button
              type="button"
              onClick={() => {
                setActiveStepIndex(prev => (prev > 0 ? prev - 1 : guide.steps.length - 1));
                setIsPlaying(false);
              }}
              className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300"
              aria-label="Previous step"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isPlaying ? (isHindi ? 'रोकें' : 'Pause') : (isHindi ? 'चलाएं' : 'Play')}</span>
              </button>

              <button
                type="button"
                onClick={() => setAudioNarrate(!audioNarrate)}
                className={`p-2 rounded-xl border transition-all ${
                  audioNarrate
                    ? 'bg-emerald-900/60 border-emerald-500/50 text-emerald-300'
                    : 'bg-stone-800 border-stone-700 text-stone-500'
                }`}
                title={isHindi ? 'ऑडियो वाचन' : 'Voice Narration'}
              >
                {audioNarrate ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                setActiveStepIndex(prev => (prev + 1) % guide.steps.length);
                setIsPlaying(false);
              }}
              className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300"
              aria-label="Next step"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Footer info & Close */}
        <div className="p-4 bg-stone-950 border-t border-stone-800 text-center">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold text-xs transition-all active:scale-98 shadow-md"
          >
            {isHindi ? 'समझ गया (बंद करें)' : 'Got it (Close)'}
          </button>
        </div>
      </div>
    </div>
  );
}
