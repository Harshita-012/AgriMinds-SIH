import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Bot, Sparkles } from 'lucide-react';
import AIAssistantModal from './AIAssistantModal';

export default function FloatingAIAssistantButton({ onNavigate }) {
  const { t, i18n } = useTranslation();
  const isHindi = i18n.language.startsWith('hi');
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-20 right-4 z-40">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="p-3.5 bg-gradient-to-br from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white rounded-full shadow-2xl border-2 border-emerald-300/60 active:scale-95 transition-all flex items-center gap-2 group"
          aria-label="Ask AI Assistant"
          title={isHindi ? 'AgriMinds AI सहायक से पूछें' : 'Ask AgriMinds AI'}
        >
          <Bot className="w-6 h-6 stroke-[2.2] animate-pulse" />
          <span className="text-xs font-black hidden sm:inline-block pr-1">
            {isHindi ? 'AI सहायक' : 'Ask AI'}
          </span>
          <span className="w-2 h-2 rounded-full bg-amber-400 absolute -top-0.5 -right-0.5 animate-ping"></span>
        </button>
      </div>

      <AIAssistantModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onNavigate={onNavigate}
      />
    </>
  );
}
