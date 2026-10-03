import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Bot, 
  X, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  User, 
  ShieldAlert, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Headphones,
  RotateCcw
} from 'lucide-react';
import { getAssistantReply, sanitizeTranscript } from '../services/aiAssistant';
import { storage } from '../../services/storage';
import { sharedStore } from '../../phase2/store';
import { speech } from '../../services/speech';

export default function AIAssistantModal({ isOpen, onClose, onNavigate }) {
  const { t, i18n } = useTranslation();
  const isHindi = i18n.language.startsWith('hi');

  const [messages, setMessages] = useState([
    {
      id: 'msg-init',
      sender: 'bot',
      text: isHindi
        ? 'नमस्ते किसान भाई! मैं AgriMinds AI सहायक हूँ। आप मुझसे कतार, स्लॉट बुकिंग, टोकन या भुगतान के बारे में बोलकर या लिखकर पूछ सकते हैं।'
        : 'Hello! I am your AgriMinds AI assistant. You can speak or type to ask about your queue, token, slot booking, or bank payment.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [autoVoiceReply, setAutoVoiceReply] = useState(true);
  const [handoverPending, setHandoverPending] = useState(false);
  const [handoverTicketId, setHandoverTicketId] = useState(null);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  const user = storage.getUser() || { fullName: 'Farmer', mobile: '9812345678' };
  const activeToken = storage.getActiveToken();
  const storeState = sharedStore.getState();

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, handoverPending]);

  // Check if staff resolved or replied to handover ticket
  useEffect(() => {
    if (handoverTicketId) {
      const ticket = storeState.centerInbox?.find(item => item.id === handoverTicketId);
      if (ticket && ticket.status === 'resolved') {
        const staffResolutionMsg = {
          id: 'staff-resp-' + Date.now(),
          sender: 'staff',
          text: isHindi
            ? `मंडी स्टाफ अपडेट: आपका अनुरोध (${ticket.reason}) मंडी कार्यालय द्वारा स्वीकार व निस्तारित कर दिया गया है।`
            : `Mandi Staff Update: Your request ("${ticket.reason}") has been addressed and resolved by the center desk.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
        };
        setMessages(prev => [...prev, staffResolutionMsg]);
        setHandoverPending(false);
        setHandoverTicketId(null);
      }
    }
  }, [storeState, handoverTicketId, isHindi]);

  // Web Speech API Voice Recognition setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = isHindi ? 'hi-IN' : 'en-IN';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          handleSendMessage(transcript);
        }
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [isHindi]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert(isHindi ? 'आपके ब्राउज़र में वॉइस रिकग्निशन उपलब्ध नहीं है।' : 'Voice recognition not supported in this browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      speech.stop();
      setIsListening(true);
      try {
        recognitionRef.current.lang = isHindi ? 'hi-IN' : 'en-IN';
        recognitionRef.current.start();
      } catch (e) {
        setIsListening(false);
      }
    }
  };

  const handleSendMessage = (textToSend) => {
    const userText = textToSend || inputText;
    if (!userText.trim()) return;

    // Sanitize message before saving transcript
    const sanitizedUserText = sanitizeTranscript(userText.trim());

    const userMsg = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: sanitizedUserText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    // Context for Assistant
    const context = {
      user,
      activeToken,
      storeState
    };

    // Get Intent-based Assistant Reply
    const response = getAssistantReply(context, userText, i18n.language);
    const sanitizedReplyText = sanitizeTranscript(response.text);

    setTimeout(() => {
      const botMsg = {
        id: 'bot-' + Date.now(),
        sender: 'bot',
        text: sanitizedReplyText,
        action: response.action,
        quickReplies: response.quickReplies,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
      };

      setMessages(prev => [...prev, botMsg]);

      // Speak reply aloud if auto-voice is enabled
      if (autoVoiceReply) {
        speech.speak(sanitizedReplyText, i18n.language);
      }

      // If Human Handover triggered, create ticket in center inbox
      if (response.action === 'INITIATE_HANDOVER' || response.action === 'OFFER_HANDOVER') {
        if (response.action === 'INITIATE_HANDOVER') {
          setHandoverPending(true);
          const ticket = sharedStore.submitFarmerRequest(
            'complaint',
            activeToken?.tokenNumber || 0,
            user?.fullName || 'Farmer',
            user?.mobile || '9812345678',
            activeToken?.cropName || 'Wheat',
            `[AI Handover Request]: ${sanitizedUserText}`
          );
          setHandoverTicketId(ticket.id);
        }
      }
    }, 450);
  };

  const handleActionClick = (action) => {
    if (action === 'VIEW_QUEUE') {
      onClose();
      onNavigate && onNavigate('queue');
    } else if (action === 'VIEW_PAYMENT') {
      onClose();
      onNavigate && onNavigate('payment_status');
    } else if (action === 'OPEN_BOOKING') {
      onClose();
      onNavigate && onNavigate('centers');
    } else if (action === 'RESCHEDULE_FLOW') {
      onClose();
      onNavigate && onNavigate('centers');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-fade-in font-sans">
      <div className="bg-stone-900 text-white w-full max-w-md h-[88vh] rounded-3xl overflow-hidden shadow-2xl border border-stone-700 flex flex-col justify-between">
        
        {/* Top Header */}
        <div className="p-4 bg-stone-950 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-stone-950 flex items-center justify-center font-black shadow-md">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm text-white">AgriMinds AI Assistant</h3>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              </div>
              <p className="text-[11px] text-emerald-400 font-semibold">
                {isHindi ? 'कतार, स्लॉट व भुगतान सहायता' : 'Grounded Mandi Guide'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setAutoVoiceReply(!autoVoiceReply)}
              className={`p-2 rounded-xl border transition-all ${
                autoVoiceReply 
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50' 
                  : 'bg-stone-800 text-stone-500 border-stone-700'
              }`}
              title={isHindi ? 'ऑटो वॉइस रिप्लाई' : 'Auto Voice Output'}
            >
              {autoVoiceReply ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={() => {
                speech.stop();
                onClose();
              }}
              className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat Stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950">
          {messages.map((msg) => {
            const isBot = msg.sender === 'bot';
            const isStaff = msg.sender === 'staff';

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isBot || isStaff ? 'items-start' : 'items-end'} animate-fade-in`}
              >
                <div
                  className={`p-3.5 max-w-[85%] rounded-3xl text-xs leading-relaxed space-y-2 shadow-md ${
                    isStaff
                      ? 'bg-blue-950 text-blue-100 border border-blue-500/60 rounded-tl-sm'
                      : isBot
                      ? 'bg-stone-800 text-stone-100 border border-stone-700 rounded-tl-sm'
                      : 'bg-emerald-700 text-white rounded-tr-sm'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-stone-400">
                    {isStaff ? (
                      <span className="text-blue-400 flex items-center gap-1">
                        <Headphones className="w-3 h-3" />
                        {isHindi ? 'मंडी स्टाफ डेस्क' : 'Mandi Staff Desk'}
                      </span>
                    ) : isBot ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        AgriMinds AI
                      </span>
                    ) : (
                      <span>{user.fullName || 'Farmer'}</span>
                    )}
                    <span className="ml-auto font-mono text-[9px]">{msg.timestamp}</span>
                  </div>

                  <p className="font-medium whitespace-pre-line">{msg.text}</p>

                  {/* Action Link button if present */}
                  {msg.action && (
                    <button
                      type="button"
                      onClick={() => handleActionClick(msg.action)}
                      className="mt-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold rounded-xl flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                    >
                      <span>
                        {msg.action === 'VIEW_QUEUE' && (isHindi ? 'लाइव कतार खोलें' : 'Open Live Queue')}
                        {msg.action === 'VIEW_PAYMENT' && (isHindi ? 'भुगतान स्क्रीन देखें' : 'View Payment Screen')}
                        {msg.action === 'OPEN_BOOKING' && (isHindi ? 'स्लॉट बुक करें' : 'Book a Slot')}
                        {msg.action === 'RESCHEDULE_FLOW' && (isHindi ? 'रीशेड्यूल करें' : 'Reschedule Now')}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Optional Quick Reply suggestions below bot message */}
                {msg.quickReplies && msg.quickReplies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2 pl-2">
                    {msg.quickReplies.map((qr, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSendMessage(qr)}
                        className="px-3 py-1 bg-stone-800/90 hover:bg-emerald-950 text-stone-300 hover:text-emerald-300 border border-stone-700 hover:border-emerald-600/50 rounded-full text-[10px] font-bold active:scale-95 transition-all"
                      >
                        {qr}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* Active Handover Status Banner */}
          {handoverPending && (
            <div className="p-3 bg-amber-950/70 border border-amber-500/50 rounded-2xl text-xs text-amber-200 flex items-center gap-2 animate-pulse">
              <Headphones className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                {isHindi 
                  ? 'मंडी सहायता अधिकारी से कनेक्ट किया जा रहा है... स्टाफ इनबॉक्स में टिकट भेजा गया है।'
                  : 'Connecting you to Mandi Staff... Ticket has been queued in their portal inbox.'}
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar with Voice Button */}
        <div className="p-3.5 bg-stone-950 border-t border-stone-800 space-y-2">
          {/* Quick Action Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-[11px]">
            <button
              type="button"
              onClick={() => handleSendMessage(isHindi ? 'मेरा टोकन और कतार स्थिति क्या है?' : 'What is my token and queue status?')}
              className="whitespace-nowrap px-3 py-1 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-full font-semibold border border-stone-700"
            >
              🌾 {isHindi ? 'मेरा टोकन' : 'My Token'}
            </button>
            <button
              type="button"
              onClick={() => handleSendMessage(isHindi ? 'मेरा भुगतान कब आएगा?' : 'When will I get paid?')}
              className="whitespace-nowrap px-3 py-1 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-full font-semibold border border-stone-700"
            >
              💰 {isHindi ? 'भुगतान स्थिति' : 'Payment Status'}
            </button>
            <button
              type="button"
              onClick={() => handleSendMessage(isHindi ? 'मंडी स्टाफ अधिकारी से बात कराएं' : 'Talk to Mandi Staff')}
              className="whitespace-nowrap px-3 py-1 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-full font-semibold border border-stone-700"
            >
              🧑‍💼 {isHindi ? 'स्टाफ से बात' : 'Talk to Staff'}
            </button>
          </div>

          {/* Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <button
              type="button"
              onClick={toggleListening}
              className={`p-3 rounded-2xl transition-all shadow-md active:scale-95 ${
                isListening
                  ? 'bg-red-600 text-white animate-pulse ring-4 ring-red-500/30'
                  : 'bg-stone-800 text-amber-400 hover:bg-stone-700 border border-stone-700'
              }`}
              title={isListening ? (isHindi ? 'सुनना बंद करें' : 'Stop Listening') : (isHindi ? 'बोलकर पूछें (माइक)' : 'Speak (Microphone)')}
              aria-label="Voice input"
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                isListening
                  ? (isHindi ? 'सुन रहा हूँ... बोलिए' : 'Listening... Speak now')
                  : (isHindi ? 'बोलें या संदेश लिखें...' : 'Ask queue, payment, MSP...')
              }
              className="flex-1 bg-stone-900 border border-stone-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-2xl px-4 py-3 text-xs text-white placeholder-stone-500 outline-hidden font-medium"
            />

            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white rounded-2xl active:scale-95 transition-all shadow-md"
              aria-label="Send message"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
