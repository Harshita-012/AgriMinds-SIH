// Video Guide Configuration for AgriMinds (Phase 3)
// Maps video id and language to structured interactive video guides and subtitles

export const VIDEO_GUIDES = [
  {
    id: 'how_to_login',
    titleEn: 'How to Log In & Select Language',
    titleHi: 'लॉगिन एवं भाषा चयन कैसे करें',
    duration: '1:15',
    steps: [
      {
        step: 1,
        titleEn: 'Step 1: Choose Your Language',
        titleHi: 'चरण 1: अपनी भाषा चुनें',
        descEn: 'Tap your preferred language tile and press the big Continue button.',
        descHi: 'अपनी पसंदीदा भाषा पर टैप करें और बड़े "आगे बढ़ें" बटन को दबाएं।',
        icon: 'Globe'
      },
      {
        step: 2,
        titleEn: 'Step 2: Choose Portal Role',
        titleHi: 'चरण 2: पोर्टल का चयन करें',
        descEn: 'Tap "Farmer Portal" for mandi bookings or "Admin Portal" for mandi staff terminal.',
        descHi: 'बुकिंग के लिए "किसान पोर्टल" अथवा मंडी स्टाफ के लिए "एडमिन पोर्टल" चुनें।',
        icon: 'Tractor'
      },
      {
        step: 3,
        titleEn: 'Step 3: State & Quick Registration',
        titleHi: 'चरण 3: राज्य चयन एवं त्वरित पंजीकरण',
        descEn: 'Select your state, enter mobile number, and choose the crops you harvest.',
        descHi: 'अपना राज्य चुनें, मोबाइल नंबर दर्ज करें और अपनी फसल का चयन करें।',
        icon: 'UserCheck'
      }
    ]
  },
  {
    id: 'how_to_book',
    titleEn: 'How to Book a Grain Delivery Slot',
    titleHi: 'अनाज डिलीवरी स्लॉट कैसे बुक करें',
    duration: '1:45',
    steps: [
      {
        step: 1,
        titleEn: 'Step 1: Select Nearby Mandi',
        titleHi: 'चरण 1: नजदीकी मंडी चुनें',
        descEn: 'Browse government APMC centers sorted by distance and live crowd level.',
        descHi: 'दूरी और लाइव भीड़ स्तर के आधार पर नजदीकी सरकारी खरीद केंद्र चुनें।',
        icon: 'Building2'
      },
      {
        step: 2,
        titleEn: 'Step 2: Pick Time Slot & Enter Quantity',
        titleHi: 'चरण 2: समय स्लॉट व फसल मात्रा भरें',
        descEn: 'Choose a morning or afternoon time slot and enter your estimated quintals.',
        descHi: 'सुबह या दोपहर का सुविधाजनक समय चुनें और अनुमानित क्विंटल मात्रा दर्ज करें।',
        icon: 'Calendar'
      },
      {
        step: 3,
        titleEn: 'Step 3: Instant Digital Token & QR Pass',
        titleHi: 'चरण 3: तत्काल डिजिटल टोकन व क्यूआर पास',
        descEn: 'Receive your unique token number and backup SMS code immediately.',
        descHi: 'अपना टोकन नंबर, क्यूआर पास और एसएमएस बैकअप कोड तुरंत प्राप्त करें।',
        icon: 'QrCode'
      }
    ]
  },
  {
    id: 'how_to_track_token',
    titleEn: 'How to Track Token & Live Gate Entry',
    titleHi: 'टोकन व लाइव गेट एंट्री कैसे ट्रैक करें',
    duration: '1:30',
    steps: [
      {
        step: 1,
        titleEn: 'Step 1: Gate Scan on Arrival',
        titleHi: 'चरण 1: गेट पर क्यूआर कोड स्कैन',
        descEn: 'Show your QR pass at Gate #1 for instant digital check-in without waiting.',
        descHi: 'बिना लाइन लगे प्रवेश के लिए गेट #1 पर अपना क्यूआर कोड दिखाएं।',
        icon: 'ScanLine'
      },
      {
        step: 2,
        titleEn: 'Step 2: Watch Live Queue Position',
        titleHi: 'चरण 2: मोबाइल पर लाइव कतार देखें',
        descEn: 'Track tractors ahead of you and estimated minutes remaining in real-time.',
        descHi: 'अपने आगे वाहनों की संख्या और शेष समय अपने मोबाइल पर लाइव देखें।',
        icon: 'Users'
      },
      {
        step: 3,
        titleEn: 'Step 3: 7-Stage Live Progression',
        titleHi: 'चरण 3: 7-स्तरीय चरण ट्रैकर',
        descEn: 'Track Quality Check, Electronic Weighbridge, and J-Form generation live.',
        descHi: 'गुणवत्ता जांच, इलेक्ट्रॉनिक धर्मकांटा तौल और जे-फॉर्म रसीद लाइव ट्रैक करें।',
        icon: 'Activity'
      }
    ]
  },
  {
    id: 'how_to_check_payment',
    titleEn: 'How to Check DBT Bank Payment',
    titleHi: 'डीबीटी बैंक भुगतान कैसे जांचें',
    duration: '1:20',
    steps: [
      {
        step: 1,
        titleEn: 'Step 1: Electronic Weighing Slip (J-Form)',
        titleHi: 'चरण 1: इलेक्ट्रॉनिक तौल रसीद (जे-फॉर्म)',
        descEn: 'Upon completion of weighing, a verified digital J-Form is generated.',
        descHi: 'तौल पूर्ण होते ही सत्यापित डिजिटल जे-फॉर्म रसीद जारी की जाती है।',
        icon: 'FileText'
      },
      {
        step: 2,
        titleEn: 'Step 2: PFMS Bank Payment Transfer',
        titleHi: 'चरण 2: पीएफएमएस बैंक ट्रांसफर',
        descEn: 'Payment is calculated at official MSP rate and sent for direct DBT transfer.',
        descHi: 'सरकारी एमएसपी दर पर राशि की गणना कर सीधे बैंक खाते (DBT) में भेजी जाती है।',
        icon: 'CreditCard'
      },
      {
        step: 3,
        titleEn: 'Step 3: In-App Receipt & SMS Confirmation',
        titleHi: 'चरण 3: रसीद डाउनलोड एवं एसएमएस पुष्टि',
        descEn: 'View receipt with payment UTR number within 48 hours directly in the app.',
        descHi: '48 घंटे के भीतर भुगतान यूटीआर नंबर सहित रसीद सीधे ऐप में देखें।',
        icon: 'CheckCircle2'
      }
    ]
  }
];

export const getGuideById = (guideId) => {
  return VIDEO_GUIDES.find(g => g.id === guideId) || VIDEO_GUIDES[0];
};
