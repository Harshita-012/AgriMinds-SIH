// AI Assistant Engine for AgriMinds (Phase 3)
// Modular intent-based architecture ready to plug into Gemini / OpenAI LLM APIs
import { CROPS, CENTERS } from '../../data/mockData';
import { sharedStore } from '../../phase2/store';

// Curated Mandi FAQ Knowledge Base (Strictly Grounded)
const FAQ_KNOWLEDGE = [
  {
    keywords: ['time', 'timing', 'hours', 'open', 'close', 'समय', 'खुलने', 'बंद'],
    replyEn: 'Procurement centers operate from 08:00 AM to 06:00 PM Monday through Saturday. Gate check-in opens at 07:30 AM.',
    replyHi: 'खरीद केंद्र सोमवार से शनिवार सुबह 08:00 बजे से शाम 06:00 बजे तक खुले रहते हैं। गेट एंट्री सुबह 07:30 बजे शुरू होती है।'
  },
  {
    keywords: ['document', 'card', 'id', 'proof', 'कागजात', 'दस्तावेज', 'कार्ड', 'पहचान'],
    replyEn: 'Required documents at the Mandi: 1) Kisan Passbook / Card, 2) Digital QR Token Pass on your phone, 3) Aadhaar Card for biometric verification.',
    replyHi: 'मंडी में आवश्यक दस्तावेज: 1) किसान पासबुक / कार्ड, 2) मोबाइल पर डिजिटल क्यूआर पास, 3) आधार कार्ड।'
  },
  {
    keywords: ['moisture', 'quality', 'faq_quality', 'नमी', 'गुणवत्ता', 'मानक'],
    replyEn: 'Permissible moisture limit for Wheat is 12.0% (max 14.0% with standard deduction). For Paddy, maximum moisture is 17.0%.',
    replyHi: 'गेहूं के लिए अधिकतम स्वीकार्य नमी 12.0% (कटौती सहित अधिकतम 14.0%) है। धान के लिए नमी की सीमा 17.0% है।'
  },
  {
    keywords: ['msp', 'rate', 'price', 'दर', 'भाव', 'मूल्य', 'एमएसपी'],
    replyEn: 'Government MSP (2024-25): Wheat ₹2,275/Quintal, Paddy ₹2,183/Quintal, Mustard ₹5,650/Quintal, Gram ₹5,440/Quintal, Maize ₹2,090/Quintal.',
    replyHi: 'सरकारी न्यूनतम समर्थन मूल्य (MSP): गेहूं ₹2,275/क्विंटल, धान ₹2,183/क्विंटल, सरसों ₹5,650/क्विंटल, चना ₹5,440/क्विंटल।'
  },
  {
    keywords: ['helpline', 'contact', 'phone', 'help', 'हेल्पलाइन', 'फोन', 'संपर्क', 'कॉल'],
    replyEn: 'Toll-Free AgriMinds Farmer Helpline: 1800-180-1551 (Operational 07:00 AM to 08:00 PM).',
    replyHi: 'टोल-फ्री किसान हेल्पलाइन: 1800-180-1551 (सुबह 07:00 बजे से रात 08:00 बजे तक उपलब्ध)।'
  }
];

// Privacy Sanitizer: Mask any full card numbers (12-16 digits) or OTPs (4-6 digits)
export const sanitizeTranscript = (text) => {
  if (!text || typeof text !== 'string') return text;
  return text
    .replace(/\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g, '••••-••••-••••')
    .replace(/\b\d{12,16}\b/g, (match) => '••••-••••-' + match.slice(-4))
    .replace(/\b(otp|pin|code)[\s:]*(\d{4,6})\b/gi, '$1: ••••');
};

/**
 * Main intent-based assistant reply engine
 * @param {Object} context - { activeToken, user, storeState, isOnline }
 * @param {string} rawMessage - Farmer's input text or transcribed voice
 * @param {string} language - 'hi' or 'en'
 * @returns {Object} { text, agent, confidence, action, quickReplies }
 */
export function getAssistantReply(context, rawMessage, language = 'hi') {
  const isHindi = language.startsWith('hi');
  const message = (rawMessage || '').trim().toLowerCase();
  const { activeToken, user } = context || {};

  // 1. Human Handover Request
  if (
    message.includes('human') || 
    message.includes('agent') || 
    message.includes('officer') || 
    message.includes('staff') || 
    message.includes('talk to person') ||
    message.includes('कर्मचारी') || 
    message.includes('अधिकारी') || 
    message.includes('इंसान') ||
    message.includes('बात करो')
  ) {
    return {
      agent: 'handover',
      confidence: 1.0,
      action: 'INITIATE_HANDOVER',
      text: isHindi
        ? 'मैं आपको मंडी सहायता अधिकारी से जोड़ रहा हूँ। आपकी बातचीत का विवरण सुरक्षित रूप से साझा कर दिया गया है।'
        : 'Connecting you to Mandi Support Staff right now. Your masked request has been queued in their priority inbox.',
      quickReplies: isHindi ? ['कतार स्थिति', 'भुगतान कब आएगा?'] : ['Queue Status', 'When will I get paid?']
    };
  }

  // 2. Queue Status Agent
  if (
    message.includes('queue') || 
    message.includes('token') || 
    message.includes('number') || 
    message.includes('turn') || 
    message.includes('wait') || 
    message.includes('कतार') || 
    message.includes('टोकन') || 
    message.includes('नंबर') || 
    message.includes('बारी') || 
    message.includes('प्रतीक्षा')
  ) {
    if (!activeToken) {
      return {
        agent: 'queue',
        confidence: 0.95,
        action: 'OPEN_BOOKING',
        text: isHindi
          ? 'आपके पास अभी कोई सक्रिय टोकन नहीं है। नजदीकी मंडी में स्लॉट बुक करने के लिए "स्लॉट बुक करें" पर टैप करें।'
          : 'You currently have no active token. Tap "Book Slot" to reserve your delivery pass at a nearby center.',
        quickReplies: isHindi ? ['स्लॉट बुक करें', 'नजदीकी केंद्र'] : ['Book Slot', 'Nearby Centers']
      };
    }

    const stageId = activeToken.currentStageId || 1;
    return {
      agent: 'queue',
      confidence: 0.95,
      action: 'VIEW_QUEUE',
      text: isHindi
        ? `आपका टोकन #${activeToken.tokenNumber} है (${activeToken.centerName})। आपकी स्थिति: स्टेज ${stageId}/7। स्लॉट समय: ${activeToken.slotTime}।`
        : `Your Token is #${activeToken.tokenNumber} at ${activeToken.centerName}. Current stage: Stage ${stageId} of 7. Slot: ${activeToken.slotTime}.`,
      quickReplies: isHindi ? ['लाइव कतार देखें', 'धर्मकांटा रास्ता', 'स्टाफ से बात'] : ['View Live Queue', 'Center Navigation', 'Talk to Staff']
    };
  }

  // 3. Payment Status Agent
  if (
    message.includes('payment') || 
    message.includes('money') || 
    message.includes('bank') || 
    message.includes('credit') || 
    message.includes('msp') || 
    message.includes('dbt') || 
    message.includes('rupee') ||
    message.includes('पैसा') || 
    message.includes('भुगतान') || 
    message.includes('बैंक') || 
    message.includes('खाता') || 
    message.includes('रुपये')
  ) {
    if (!activeToken) {
      return {
        agent: 'payment',
        confidence: 0.9,
        action: 'VIEW_PAYMENT',
        text: isHindi
          ? 'सरकारी नियम अनुसार तौल और जे-फॉर्म बनने के 48 से 72 घंटों के भीतर भुगतान सीधे आपके बैंक खाते (DBT) में जमा हो जाता है।'
          : 'Per government mandate, MSP payment is credited directly to your Aadhaar-linked bank account (DBT) within 48 to 72 hours of weighment.',
        quickReplies: isHindi ? ['गेहूं का समर्थन मूल्य', 'सहायता डेस्क'] : ['Wheat MSP Rate', 'Help Desk']
      };
    }

    const qty = activeToken.quantity || 40;
    const cropObj = CROPS.find(c => c.id === activeToken.cropId) || CROPS[0];
    const estimatedAmt = qty * (cropObj.msp || 2275);

    return {
      agent: 'payment',
      confidence: 0.98,
      action: 'VIEW_PAYMENT',
      text: isHindi
        ? `टोकन #${activeToken.tokenNumber} (${activeToken.cropName || 'फसल'}, ${qty} क्विंटल) के लिए अनुमानित भुगतान ₹${estimatedAmt.toLocaleString('en-IN')} है। तौल रसीद के बाद 48 घंटे में सीधे खाते में क्रेडिट होगा।`
        : `For Token #${activeToken.tokenNumber} (${activeToken.cropName || 'Crop'}, ${qty} Qtl), the estimated amount is ₹${estimatedAmt.toLocaleString('en-IN')}. It will be credited via DBT within 48h of weighment.`,
      quickReplies: isHindi ? ['भुगतान रसीद देखें', 'मंडी स्टाफ से पूछें'] : ['View Payment Screen', 'Ask Mandi Staff']
    };
  }

  // 4. Center Navigation Agent
  if (
    message.includes('address') || 
    message.includes('location') || 
    message.includes('where') || 
    message.includes('map') || 
    message.includes('reach') || 
    message.includes('distance') ||
    message.includes('पता') || 
    message.includes('रास्ता') || 
    message.includes('कहाँ') || 
    message.includes('दूरी') || 
    message.includes('नक्शा')
  ) {
    const center = activeToken
      ? CENTERS.find(c => c.nameEn === activeToken.centerName || c.id === activeToken.centerId) || CENTERS[0]
      : CENTERS[0];

    return {
      agent: 'navigation',
      confidence: 0.95,
      action: 'OPEN_MAP',
      text: isHindi
        ? `${center.nameHi}: ${center.addressHi} (दूरी: लगभग ${center.distanceKm} किमी)। गेट नंबर 1 मुख्य जीटी रोड पर स्थित है।`
        : `${center.nameEn}: ${center.addressEn} (Distance: ~${center.distanceKm} km). Gate #1 is on the main GT Road entrance.`,
      quickReplies: isHindi ? ['गेट क्यूआर कोड', 'स्लॉट समय'] : ['Gate QR Code', 'Slot Timing']
    };
  }

  // 5. Booking & Rescheduling Agent
  if (
    message.includes('reschedule') || 
    message.includes('change date') || 
    message.includes('cancel') || 
    message.includes('rain') || 
    message.includes('weather') ||
    message.includes('बदलना') || 
    message.includes('रद्द') || 
    message.includes('बारिश') || 
    message.includes('तारीख')
  ) {
    if (activeToken) {
      return {
        agent: 'booking',
        confidence: 0.95,
        action: 'RESCHEDULE_FLOW',
        text: isHindi
          ? `क्या आप टोकन #${activeToken.tokenNumber} (${activeToken.date}) को किसी अन्य दिन या स्लॉट में रीशेड्यूल करना चाहते हैं? बारिश या निजी कारण से कोई पेनल्टी नहीं लगेगी।`
          : `Would you like to reschedule Token #${activeToken.tokenNumber} (${activeToken.date})? You can choose a new date with priority without any penalty.`,
        quickReplies: isHindi ? ['तारीख बदलें', 'रद्द करें'] : ['Change Slot Date', 'Cancel Booking']
      };
    }
  }

  // 6. Curated FAQ Matching
  for (const faq of FAQ_KNOWLEDGE) {
    const matched = faq.keywords.some(k => message.includes(k));
    if (matched) {
      return {
        agent: 'support',
        confidence: 0.88,
        action: 'SHOW_FAQ',
        text: isHindi ? faq.replyHi : faq.replyEn,
        quickReplies: isHindi ? ['टोकन स्थिति', 'भुगतान कब आएगा?', 'स्टाफ से बात'] : ['Token Status', 'Payment Timeline', 'Talk to Staff']
      };
    }
  }

  // 7. Low Confidence Grounded Fallback -> Offer Staff Handover
  return {
    agent: 'fallback',
    confidence: 0.4,
    action: 'OFFER_HANDOVER',
    text: isHindi
      ? 'माफ़ कीजिए, मैं इस प्रश्न का सटीक उत्तर नहीं दे पा रहा हूँ। क्या आप मंडी सहायता अधिकारी से बात करना चाहते हैं?'
      : 'I want to be completely accurate with your grain procurement. Would you like me to connect you with our Mandi Staff desk?',
    quickReplies: isHindi ? ['हाँ, स्टाफ से जोड़ें', 'मेरी कतार स्थिति', 'हेल्पलाइन नंबर'] : ['Yes, Connect to Staff', 'My Queue Status', 'Helpline Number']
  };
}
