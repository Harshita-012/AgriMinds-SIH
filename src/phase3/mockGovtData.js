// Government Dashboard Mock Data & Analytics for AgriMinds Phase 3
// Strict privacy: all Kisan Card numbers are pre-masked (••••-••••-XXXX)

export const GOVT_CENTERS = [
  {
    id: 'center-1',
    nameEn: 'Nilokheri Main Grain Mandi',
    nameHi: 'अनाज मंडी, नीलोखेड़ी (मुख्य केंद्र)',
    district: 'Karnal',
    districtHi: 'करनाल',
    grainProcuredToday: 1450, // Quintals
    targetToday: 1600,
    farmersServedToday: 42,
    queueLength: 9,
    utilizationPercent: 88,
    status: 'crowded', // normal, crowded, delayed
    avgWaitMins: 35,
    avgServiceMins: 14,
    gunnyBagsStock: 12000,
    gunnyBagsRequired: 14500,
    staffActive: 8,
    cropDistribution: { wheat: 65, paddy: 25, mustard: 10 },
    lat: 29.8324,
    lng: 76.9214
  },
  {
    id: 'center-2',
    nameEn: 'Taraori APMC Procurement Center',
    nameHi: 'कृषि उपज मंडी समिति, तरावड़ी',
    district: 'Karnal',
    districtHi: 'करनाल',
    grainProcuredToday: 820,
    targetToday: 1000,
    farmersServedToday: 26,
    queueLength: 3,
    utilizationPercent: 52,
    status: 'normal',
    avgWaitMins: 18,
    avgServiceMins: 11,
    gunnyBagsStock: 9500,
    gunnyBagsRequired: 8200,
    staffActive: 6,
    cropDistribution: { wheat: 50, paddy: 40, mustard: 10 },
    lat: 29.7995,
    lng: 76.9327
  },
  {
    id: 'center-3',
    nameEn: 'HAFED Procurement Hub, Indri',
    nameHi: 'हैफेड खरीद केंद्र, इंद्री',
    district: 'Karnal',
    districtHi: 'करनाल',
    grainProcuredToday: 680,
    targetToday: 800,
    farmersServedToday: 22,
    queueLength: 5,
    utilizationPercent: 68,
    status: 'normal',
    avgWaitMins: 22,
    avgServiceMins: 13,
    gunnyBagsStock: 6000,
    gunnyBagsRequired: 6800,
    staffActive: 5,
    cropDistribution: { wheat: 70, paddy: 20, mustard: 10 },
    lat: 29.8821,
    lng: 77.0601
  },
  {
    id: 'center-4',
    nameEn: 'HSAMB Sector-4 Mandi, Karnal',
    nameHi: 'हरियाणा राज्य कृषि विपणन बोर्ड, करनाल',
    district: 'Karnal',
    districtHi: 'करनाल',
    grainProcuredToday: 1890,
    targetToday: 1800,
    farmersServedToday: 54,
    queueLength: 14,
    utilizationPercent: 94,
    status: 'delayed',
    avgWaitMins: 48,
    avgServiceMins: 16,
    gunnyBagsStock: 15000,
    gunnyBagsRequired: 18900,
    staffActive: 10,
    cropDistribution: { wheat: 80, mustard: 15, gram: 5 },
    lat: 29.6857,
    lng: 76.9907
  },
  {
    id: 'center-5',
    nameEn: 'Thanesar Main Grain Market',
    nameHi: 'अनाज मंडी, थानेसर',
    district: 'Kurukshetra',
    districtHi: 'कुरुक्षेत्र',
    grainProcuredToday: 1120,
    targetToday: 1300,
    farmersServedToday: 34,
    queueLength: 4,
    utilizationPercent: 64,
    status: 'normal',
    avgWaitMins: 20,
    avgServiceMins: 12,
    gunnyBagsStock: 11000,
    gunnyBagsRequired: 11200,
    staffActive: 7,
    cropDistribution: { wheat: 60, paddy: 35, pulses: 5 },
    lat: 29.9695,
    lng: 76.8783
  },
  {
    id: 'center-6',
    nameEn: 'Shahabad Markanda APMC Center',
    nameHi: 'शाहाबाद मारकंडा खरीद केंद्र',
    district: 'Kurukshetra',
    districtHi: 'कुरुक्षेत्र',
    grainProcuredToday: 950,
    targetToday: 1100,
    farmersServedToday: 30,
    queueLength: 8,
    utilizationPercent: 78,
    status: 'crowded',
    avgWaitMins: 29,
    avgServiceMins: 13,
    gunnyBagsStock: 8000,
    gunnyBagsRequired: 9500,
    staffActive: 6,
    cropDistribution: { wheat: 55, paddy: 40, maize: 5 },
    lat: 30.1691,
    lng: 76.8715
  },
  {
    id: 'center-7',
    nameEn: 'Kaithal APMC Yard-1',
    nameHi: 'कृषि उपज मंडी, कैथल यार्ड-1',
    district: 'Kaithal',
    districtHi: 'कैथल',
    grainProcuredToday: 1380,
    targetToday: 1500,
    farmersServedToday: 39,
    queueLength: 11,
    utilizationPercent: 86,
    status: 'crowded',
    avgWaitMins: 38,
    avgServiceMins: 15,
    gunnyBagsStock: 14000,
    gunnyBagsRequired: 13800,
    staffActive: 9,
    cropDistribution: { wheat: 75, gram: 15, mustard: 10 },
    lat: 29.8015,
    lng: 76.3998
  },
  {
    id: 'center-8',
    nameEn: 'Cheeka Grain Procurement Mandi',
    nameHi: 'चीका अनाज खरीद मंडी',
    district: 'Kaithal',
    districtHi: 'कैथल',
    grainProcuredToday: 540,
    targetToday: 700,
    farmersServedToday: 18,
    queueLength: 2,
    utilizationPercent: 44,
    status: 'normal',
    avgWaitMins: 15,
    avgServiceMins: 10,
    gunnyBagsStock: 5000,
    gunnyBagsRequired: 5400,
    staffActive: 5,
    cropDistribution: { wheat: 85, mustard: 15 },
    lat: 30.0542,
    lng: 76.2238
  }
];

export const DISTRICTS_LIST = ['All Districts', 'Karnal', 'Kurukshetra', 'Kaithal'];

// 7-Day Arrival Forecast (Quintals & Projected Farmer Footfall)
export const ARRIVAL_FORECAST_7DAYS = [
  { day: 'Wed (Today)', date: '24 Sep', Karnal: 4840, Kurukshetra: 2070, Kaithal: 1920, total: 8830, risk: 'normal' },
  { day: 'Thu', date: '25 Sep', Karnal: 5300, Kurukshetra: 2450, Kaithal: 2100, total: 9850, risk: 'high_arrival', flag: 'Karnal needs +15% Gunny Bags' },
  { day: 'Fri', date: '26 Sep', Karnal: 5900, Kurukshetra: 2800, Kaithal: 2350, total: 11050, risk: 'surge', flag: 'Peak harvest arrival expected' },
  { day: 'Sat', date: '27 Sep', Karnal: 4100, Kurukshetra: 1900, Kaithal: 1600, total: 7600, risk: 'normal' },
  { day: 'Sun', date: '28 Sep', Karnal: 1200, Kurukshetra: 600, Kaithal: 500, total: 2300, risk: 'low' },
  { day: 'Mon', date: '29 Sep', Karnal: 5100, Kurukshetra: 2300, Kaithal: 2050, total: 9450, risk: 'high_arrival' },
  { day: 'Tue', date: '30 Sep', Karnal: 4700, Kurukshetra: 2150, Kaithal: 1950, total: 8800, risk: 'normal' }
];

// Bottleneck stage analytics across centers (Average minutes spent per stage)
export const BOTTLENECK_STAGES = [
  {
    stageId: 3,
    stageNameEn: 'Quality Check & Moisture Testing',
    stageNameHi: 'गुणवत्ता व नमी परीक्षण',
    avgMins: 14.5,
    benchmarkMins: 8.0,
    isSlowest: true,
    slowestCenter: 'HSAMB Sector-4 Mandi, Karnal',
    reasonsEn: 'Manual moisture meters and sample lot waiting time',
    reasonsHi: 'मैनुअल नमी मापक और सैंपल लॉट प्रतीक्षा समय'
  },
  {
    stageId: 4,
    stageNameEn: 'Electronic Weighbridge Weighing',
    stageNameHi: 'धर्मकांटा इलेक्ट्रॉनिक तौल',
    avgMins: 9.2,
    benchmarkMins: 6.0,
    isSlowest: false,
    slowestCenter: 'Nilokheri Main Mandi',
    reasonsEn: 'Tractor trailer queue alignment at weighbridge #1',
    reasonsHi: 'धर्मकांटा #1 पर ट्रैक्टर ट्रॉली कतार'
  },
  {
    stageId: 5,
    stageNameEn: 'J-Form Generation & Unloading Slip',
    stageNameHi: 'जे-फॉर्म व अनलोडिंग रसीद',
    avgMins: 5.8,
    benchmarkMins: 4.0,
    isSlowest: false,
    slowestCenter: 'Kaithal APMC Yard-1',
    reasonsEn: 'Staff signature and gunny bag stacking sign-off',
    reasonsHi: 'स्टाफ हस्ताक्षर एवं बोरी स्टेकिंग अनुमोदन'
  },
  {
    stageId: 6,
    stageNameEn: 'Direct DBT Payment Authorization',
    stageNameHi: 'डीबीटी बैंक भुगतान प्राधिकार',
    avgMins: 7.0,
    benchmarkMins: 5.0,
    isSlowest: false,
    slowestCenter: 'Thanesar Main Grain Market',
    reasonsEn: 'PFMS portal batch verification processing',
    reasonsHi: 'पीएफएमएस पोर्टल बैच सत्यापन प्रक्रिया'
  }
];

// High-priority anomaly alerts for government controllers
export const GOVT_ALERTS_INITIAL = [
  {
    id: 'alert-101',
    type: 'stuck_stage',
    severity: 'high', // high, medium, low
    titleEn: 'Tractor Stuck at Quality Check > 45 mins',
    titleHi: 'गुणवत्ता जांच में 45 मिनट से अधिक समय से फंसा टोकन',
    centerName: 'HSAMB Sector-4 Mandi, Karnal',
    detailsEn: 'Token #145 (Dharmpal Yadav, Card: ••••-••••-1190) pending moisture re-test for 48 minutes.',
    detailsHi: 'टोकन #145 (धर्मपाल यादव, कार्ड: ••••-••••-1190) की नमी पुनः जांच 48 मिनट से लंबित।',
    timestamp: '09:42 AM',
    reviewed: false
  },
  {
    id: 'alert-102',
    type: 'quantity_anomaly',
    severity: 'high',
    titleEn: 'Procurement Quantity Exceeds Land Ceiling Ratio',
    titleHi: 'भूमि अनुपात से अत्यधिक मात्रा दर्ज',
    centerName: 'Nilokheri Main Grain Mandi',
    detailsEn: 'Farmer recorded 110 Quintals on 1.5 Acres land (Limit: 45 Qtl). Card: ••••-••••-1190.',
    detailsHi: 'किसान द्वारा 1.5 एकड़ भूमि पर 110 क्विंटल दर्ज (अधिकतम सीमा: 45 क्विंटल)। कार्ड: ••••-••••-1190।',
    timestamp: '09:35 AM',
    reviewed: false
  },
  {
    id: 'alert-103',
    type: 'duplicate_booking',
    severity: 'medium',
    titleEn: 'Same Kisan Card Booked at Multiple Mandis',
    titleHi: 'एक ही किसान कार्ड दो अलग मंडियों में बुक',
    centerName: 'Cross Center Check (Nilokheri & Taraori)',
    detailsEn: 'Card ••••-••••-7714 booked for 25 Sep in Nilokheri and 26 Sep in Taraori. Cross-verification triggered.',
    detailsHi: 'कार्ड ••••-••••-7714 का 25 सितंबर नीलोखेड़ी व 26 सितंबर तरावड़ी में दोहरा पंजीकरण।',
    timestamp: '08:50 AM',
    reviewed: false
  },
  {
    id: 'alert-104',
    type: 'capacity_overload',
    severity: 'medium',
    titleEn: 'Center Capacity Utilization > 90%',
    titleHi: 'केंद्र क्षमता 90% से अधिक भरी',
    centerName: 'HSAMB Sector-4 Mandi, Karnal',
    detailsEn: '94% yard capacity reached. Divert incoming traffic to Taraori APMC Center.',
    detailsHi: '94% यार्ड क्षमता पूर्ण। आगामी वाहनों को तरावड़ी एपीएमसी केंद्र पर डायवर्ट करें।',
    timestamp: '09:15 AM',
    reviewed: false
  },
  {
    id: 'alert-105',
    type: 'noshow_spike',
    severity: 'low',
    titleEn: 'No-Show Rate Exceeded 12% in Morning Slot',
    titleHi: 'सुबह के स्लॉट में नो-शो दर 12% से अधिक',
    centerName: 'Cheeka Grain Procurement Mandi',
    detailsEn: '4 out of 22 farmers did not report within 30 min grace period. Auto-waitlist promotion active.',
    detailsHi: '22 में से 4 किसान 30 मिनट ग्रेस पीरियड में नहीं पहुंचे। ऑटो-वेटलिस्ट सक्रिय।',
    timestamp: '09:00 AM',
    reviewed: false
  }
];

// DBT Payment Pipeline Status
export const GOVT_PAYMENT_METRICS = {
  totalPaidAmount: 48250000, // ₹4.82 Cr
  totalPendingAmount: 12400000, // ₹1.24 Cr
  farmersCreditedCount: 1840,
  farmersInitiatedCount: 312,
  farmersPendingCount: 94,
  avgDaysToCredit: 1.8, // Days
  benchmarkDays: 3.0,
  delayedPayments: [
    {
      paymentId: 'PAY-88210',
      farmerName: 'Baldev Sahni',
      kisanCardMasked: '••••-••••-9014',
      centerName: 'Nilokheri Main Mandi',
      amount: 102375,
      crop: 'Wheat (45 Qtl)',
      stage: 'Bank IFSC Verification Failed',
      delayedDays: 4,
      status: 'action_required'
    },
    {
      paymentId: 'PAY-88214',
      farmerName: 'Jagjit Sandhu',
      kisanCardMasked: '••••-••••-3329',
      centerName: 'Thanesar Main Mandi',
      amount: 68250,
      crop: 'Wheat (30 Qtl)',
      stage: 'Aadhaar NPCI Link Pending',
      delayedDays: 3,
      status: 'action_required'
    }
  ]
};
