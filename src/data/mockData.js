export const CROP_CATEGORIES = [
  { id: 'all', nameKey: 'cropSelect.all' },
  { id: 'cereals', nameKey: 'cropSelect.cereals' },
  { id: 'pulses', nameKey: 'cropSelect.pulses' },
  { id: 'oilseeds', nameKey: 'cropSelect.oilseeds' },
  { id: 'cash', nameKey: 'cropSelect.cash' }
];

export const CROPS = [
  {
    id: 'wheat',
    nameKey: 'crops.wheat',
    category: 'cereals',
    msp: 2275,
    icon: '🌾',
    baseMinutes: 8,
    extraMinPerQuintal: 0.1
  },
  {
    id: 'paddy',
    nameKey: 'crops.paddy',
    category: 'cereals',
    msp: 2183,
    icon: '🌾',
    baseMinutes: 10,
    extraMinPerQuintal: 0.12
  },
  {
    id: 'maize',
    nameKey: 'crops.maize',
    category: 'cereals',
    msp: 2090,
    icon: '🌽',
    baseMinutes: 8,
    extraMinPerQuintal: 0.1
  },
  {
    id: 'bajra',
    nameKey: 'crops.bajra',
    category: 'cereals',
    msp: 2500,
    icon: '🌾',
    baseMinutes: 8,
    extraMinPerQuintal: 0.1
  },
  {
    id: 'barley',
    nameKey: 'crops.barley',
    category: 'cereals',
    msp: 1850,
    icon: '🌾',
    baseMinutes: 8,
    extraMinPerQuintal: 0.1
  },
  {
    id: 'gram',
    nameKey: 'crops.gram',
    category: 'pulses',
    msp: 5440,
    icon: '🌱',
    baseMinutes: 8,
    extraMinPerQuintal: 0.1
  },
  {
    id: 'moong',
    nameKey: 'crops.moong',
    category: 'pulses',
    msp: 8558,
    icon: '🌱',
    baseMinutes: 8,
    extraMinPerQuintal: 0.1
  },
  {
    id: 'arhar',
    nameKey: 'crops.arhar',
    category: 'pulses',
    msp: 7000,
    icon: '🌱',
    baseMinutes: 8,
    extraMinPerQuintal: 0.1
  },
  {
    id: 'mustard',
    nameKey: 'crops.mustard',
    category: 'oilseeds',
    msp: 5650,
    icon: '🌻',
    baseMinutes: 8,
    extraMinPerQuintal: 0.1
  },
  {
    id: 'soybean',
    nameKey: 'crops.soybean',
    category: 'oilseeds',
    msp: 4600,
    icon: '🌱',
    baseMinutes: 8,
    extraMinPerQuintal: 0.1
  },
  {
    id: 'groundnut',
    nameKey: 'crops.groundnut',
    category: 'oilseeds',
    msp: 6377,
    icon: '🥜',
    baseMinutes: 8,
    extraMinPerQuintal: 0.1
  },
  {
    id: 'cotton',
    nameKey: 'crops.cotton',
    category: 'cash',
    msp: 6620,
    icon: '☁️',
    baseMinutes: 10,
    extraMinPerQuintal: 0.12
  },
  {
    id: 'sugarcane',
    nameKey: 'crops.sugarcane',
    category: 'cash',
    msp: 315,
    icon: '🎋',
    baseMinutes: 12,
    extraMinPerQuintal: 0.15
  }
];

export const STATES_DATA = [
  { id: 'HR', nameEn: 'Haryana', nameHi: 'हरियाणा', icon: '🌾', districts: ['Karnal', 'Kurukshetra', 'Ambala', 'Kaithal', 'Panipat', 'Sonipat', 'Hisar', 'Sirsa', 'Fatehabad', 'Rohtak', 'Jhajjar', 'Rewari'] },
  { id: 'PB', nameEn: 'Punjab', nameHi: 'पंजाब', icon: '🌾', districts: ['Ludhiana', 'Amritsar', 'Patiala', 'Jalandhar', 'Bathinda', 'Sangrur', 'Firozpur', 'Gurdaspur', 'Moga', 'Hoshiarpur'] },
  { id: 'UP', nameEn: 'Uttar Pradesh', nameHi: 'उत्तर प्रदेश', icon: '🌱', districts: ['Meerut', 'Mathura', 'Agra', 'Aligarh', 'Bareilly', 'Varanasi', 'Prayagraj', 'Gorakhpur', 'Lucknow', 'Kanpur'] },
  { id: 'MP', nameEn: 'Madhya Pradesh', nameHi: 'मध्य प्रदेश', icon: '🌻', districts: ['Indore', 'Bhopal', 'Ujjain', 'Hoshangabad', 'Sehore', 'Dewas', 'Jabalpur', 'Gwalior', 'Sagar', 'Vidisha'] },
  { id: 'RJ', nameEn: 'Rajasthan', nameHi: 'राजस्थान', icon: '🌾', districts: ['Jaipur', 'Kota', 'Sri Ganganagar', 'Hanumangarh', 'Alwar', 'Bharatpur', 'Bikaner', 'Jodhpur', 'Nagaur', 'Udaipur'] },
  { id: 'MH', nameEn: 'Maharashtra', nameHi: 'महाराष्ट्र', icon: '🌱', districts: ['Nashik', 'Pune', 'Nagpur', 'Kolhapur', 'Solapur', 'Aurangabad', 'Ahmednagar', 'Amravati', 'Latur', 'Satara'] },
  { id: 'GJ', nameEn: 'Gujarat', nameHi: 'गुजरात', icon: '🌾', districts: ['Ahmedabad', 'Rajkot', 'Surat', 'Vadodara', 'Bhavnagar', 'Junagadh', 'Mehsana', 'Banaskantha', 'Amreli', 'Kheda'] },
  { id: 'BR', nameEn: 'Bihar', nameHi: 'बिहार', icon: '🌾', districts: ['Patna', 'Gaya', 'Muzaffarpur', 'Bhagalpur', 'Darbhanga', 'Purnia', 'Rohtas', 'Bhojpur', 'Samastipur', 'Begusarai'] },
  { id: 'AP', nameEn: 'Andhra Pradesh', nameHi: 'आंध्र प्रदेश', icon: '🌾', districts: ['Guntur', 'Krishna', 'East Godavari', 'West Godavari', 'Kurnool', 'Nellore', 'Chittoor', 'Anantapur'] },
  { id: 'TG', nameEn: 'Telangana', nameHi: 'तेलंगाना', icon: '🌱', districts: ['Warangal', 'Karimnagar', 'Nizamabad', 'Khammam', 'Nalgonda', 'Mahabubnagar', 'Medak', 'Rangareddy'] },
  { id: 'KA', nameEn: 'Karnataka', nameHi: 'कर्नाटक', icon: '🌱', districts: ['Belagavi', 'Dharwad', 'Mandya', 'Mysuru', 'Ballari', 'Shivamogga', 'Tumakuru', 'Vijayapura', 'Davangere'] },
  { id: 'TN', nameEn: 'Tamil Nadu', nameHi: 'तमिलनाडु', icon: '🌾', districts: ['Thanjavur', 'Tiruchirappalli', 'Madurai', 'Coimbatore', 'Salem', 'Erode', 'Tirunelveli', 'Cuddalore'] },
  { id: 'WB', nameEn: 'West Bengal', nameHi: 'पश्चिम बंगाल', icon: '🌾', districts: ['Bardhaman', 'Murshidabad', 'Nadia', 'Hooghly', 'Birbhum', 'Malda', 'North 24 Parganas', 'Bankura'] },
  { id: 'OD', nameEn: 'Odisha', nameHi: 'ओडिशा', icon: '🌾', districts: ['Bargarh', 'Sambalpur', 'Cuttack', 'Balasore', 'Ganjam', 'Bhadrak', 'Kalahandi', 'Puri'] },
  { id: 'CT', nameEn: 'Chhattisgarh', nameHi: 'छत्तीसगढ़', icon: '🌾', districts: ['Raipur', 'Durg', 'Bilaspur', 'Rajnandgaon', 'Janjgir-Champa', 'Mahasamund', 'Bemetara'] },
  { id: 'JH', nameEn: 'Jharkhand', nameHi: 'झारखंड', icon: '🌱', districts: ['Ranchi', 'Hazaribagh', 'Dhanbad', 'Bokaro', 'Palamu', 'Deoghar', 'Dumka', 'Giridih'] },
  { id: 'AS', nameEn: 'Assam', nameHi: 'असम', icon: '🌱', districts: ['Kamrup', 'Nagaon', 'Sonitpur', 'Barpeta', 'Cachar', 'Dibrugarh', 'Jorhat', 'Golaghat'] },
  { id: 'HP', nameEn: 'Himachal Pradesh', nameHi: 'हिमाचल प्रदेश', icon: '🍎', districts: ['Kangra', 'Mandi', 'Shimla', 'Kullu', 'Solan', 'Una', 'Hamirpur', 'Sirmaur'] },
  { id: 'UT', nameEn: 'Uttarakhand', nameHi: 'उत्तराखंड', icon: '🌾', districts: ['Udham Singh Nagar', 'Haridwar', 'Dehradun', 'Nainital', 'Pauri Garhwal'] },
  { id: 'KL', nameEn: 'Kerala', nameHi: 'केरल', icon: '🌴', districts: ['Palakkad', 'Alappuzha', 'Kottayam', 'Thrissur', 'Wayanad', 'Idukki'] },
  { id: 'GA', nameEn: 'Goa', nameHi: 'गोवा', icon: '🌴', districts: ['North Goa', 'South Goa'] },
  { id: 'TR', nameEn: 'Tripura', nameHi: 'त्रिपुरा', icon: '🌱', districts: ['West Tripura', 'South Tripura', 'Gomati', 'Dhalai'] },
  { id: 'ML', nameEn: 'Meghalaya', nameHi: 'मेघालय', icon: '🌱', districts: ['East Khasi Hills', 'West Garo Hills', 'Ri-Bhoi'] },
  { id: 'MN', nameEn: 'Manipur', nameHi: 'मणिपुर', icon: '🌱', districts: ['Imphal West', 'Imphal East', 'Bishnupur', 'Thoubal'] },
  { id: 'NL', nameEn: 'Nagaland', nameHi: 'नागालैंड', icon: '🌱', districts: ['Kohima', 'Dimapur', 'Mokokchung'] },
  { id: 'MZ', nameEn: 'Mizoram', nameHi: 'मिज़ोरम', icon: '🌱', districts: ['Aizawl', 'Lunglei', 'Champhai'] },
  { id: 'AR', nameEn: 'Arunachal Pradesh', nameHi: 'अरुणाचल प्रदेश', icon: '🌱', districts: ['Papum Pare', 'Changlang', 'Lohit'] },
  { id: 'SK', nameEn: 'Sikkim', nameHi: 'सिक्किम', icon: '🌱', districts: ['East Sikkim', 'West Sikkim', 'South Sikkim'] },
  // UTs
  { id: 'DL', nameEn: 'Delhi', nameHi: 'दिल्ली', icon: '🏛️', districts: ['North Delhi', 'South West Delhi', 'North West Delhi', 'Alipur'] },
  { id: 'JK', nameEn: 'Jammu and Kashmir', nameHi: 'जम्मू और कश्मीर', icon: '🍎', districts: ['Jammu', 'Kathua', 'Samba', 'Anantnag', 'Baramulla', 'Pulwama'] },
  { id: 'LA', nameEn: 'Ladakh', nameHi: 'लद्दाख', icon: '🏔️', districts: ['Leh', 'Kargil'] },
  { id: 'CH', nameEn: 'Chandigarh', nameHi: 'चंडीगढ़', icon: '🏙️', districts: ['Chandigarh'] },
  { id: 'PY', nameEn: 'Puducherry', nameHi: 'पुडुचेरी', icon: '🌴', districts: ['Puducherry', 'Karaikal', 'Mahe', 'Yanam'] },
  { id: 'DN', nameEn: 'Dadra and Nagar Haveli and Daman and Diu', nameHi: 'दादरा और नगर हवेली और दमन और दीव', icon: '🌴', districts: ['Daman', 'Diu', 'Dadra and Nagar Haveli'] },
  { id: 'AN', nameEn: 'Andaman and Nicobar Islands', nameHi: 'अंडमान और निकोबार द्वीप समूह', icon: '🏝️', districts: ['South Andaman', 'North and Middle Andaman'] },
  { id: 'LD', nameEn: 'Lakshadweep', nameHi: 'लक्षद्वीप', icon: '🏝️', districts: ['Kavaratti', 'Agatti', 'Andrott'] }
];

export const CENTERS = [
  {
    id: 'center-1',
    state: 'Haryana',
    nameHi: 'अनाज मंडी, नीलोखेड़ी (मुख्य केंद्र)',
    nameEn: 'Nilokheri Main Grain Mandi',
    distanceKm: 2.1,
    addressHi: 'जीटी रोड, नीलोखेड़ी, जिला करनाल',
    addressEn: 'GT Road, Nilokheri, Karnal District',
    crowdLevel: 'high', // nearest is busy for smart suggestion
    capacityPerSlot: 20,
    walkInReserved: 3, // ~15%
    activeBookings: 17,
    currentRunningToken: 142,
    lat: 29.8324,
    lng: 76.9214
  },
  {
    id: 'center-2',
    nameHi: 'कृषि उपज मंडी समिति, तरावड़ी',
    nameEn: 'Taraori APMC Procurement Center',
    distanceKm: 4.3,
    addressHi: 'स्टेशन रोड, तरावड़ी, करनाल',
    addressEn: 'Station Road, Taraori, Karnal',
    crowdLevel: 'low', // Smart suggested alternative!
    capacityPerSlot: 25,
    walkInReserved: 4,
    activeBookings: 8,
    currentRunningToken: 88,
    lat: 29.7995,
    lng: 76.9327
  },
  {
    id: 'center-3',
    nameHi: 'हैफेड खरीद केंद्र, इंद्री',
    nameEn: 'HAFED Procurement Hub, Indri',
    distanceKm: 6.8,
    addressHi: 'लाडवा रोड, इंद्री',
    addressEn: 'Ladwa Road, Indri',
    crowdLevel: 'medium',
    capacityPerSlot: 20,
    walkInReserved: 3,
    activeBookings: 12,
    currentRunningToken: 64,
    lat: 29.8821,
    lng: 77.0601
  },
  {
    id: 'center-4',
    nameHi: 'हरियाणा राज्य कृषि विपणन बोर्ड, करनाल केंद्र',
    nameEn: 'HSAMB Sector-4 Mandi, Karnal',
    distanceKm: 9.5,
    addressHi: 'सेक्टर 4, नई अनाज मंडी, करनाल',
    addressEn: 'Sector 4, New Grain Market, Karnal',
    crowdLevel: 'medium',
    capacityPerSlot: 30,
    walkInReserved: 5,
    activeBookings: 18,
    currentRunningToken: 210,
    lat: 29.6857,
    lng: 76.9907
  },
  {
    id: 'center-5',
    nameHi: 'सहकारी विपणन समिति, असंध',
    nameEn: 'Cooperative Marketing Society, Assandh',
    distanceKm: 14.2,
    addressHi: 'सफीदों रोड, असंध',
    addressEn: 'Safidon Road, Assandh',
    crowdLevel: 'low',
    capacityPerSlot: 18,
    walkInReserved: 3,
    activeBookings: 5,
    currentRunningToken: 45,
    lat: 29.5218,
    lng: 76.6021
  },
  {
    id: 'center-6',
    nameHi: 'अनाज खरीद सब-यार्ड, निसिंग',
    nameEn: 'Grain Procurement Sub-Yard, Nissing',
    distanceKm: 16.0,
    addressHi: 'कैथल रोड, निसिंग',
    addressEn: 'Kaithal Road, Nissing',
    crowdLevel: 'low',
    capacityPerSlot: 15,
    walkInReserved: 2,
    activeBookings: 6,
    currentRunningToken: 31,
    lat: 29.6974,
    lng: 76.8251
  },
  {
    id: 'center-7',
    nameHi: 'भारतीय खाद्य निगम (FCI) गोदाम केंद्र, घरौंडा',
    nameEn: 'FCI Depot Procurement Point, Gharaunda',
    distanceKm: 21.5,
    addressHi: 'रेलवे क्रॉसिंग के पास, घरौंडा',
    addressEn: 'Near Railway Crossing, Gharaunda',
    crowdLevel: 'high',
    capacityPerSlot: 24,
    walkInReserved: 4,
    activeBookings: 20,
    currentRunningToken: 119,
    lat: 29.5412,
    lng: 76.9710
  },
  {
    id: 'center-8',
    nameHi: 'कृषि सेवा केंद्र सब-मंडी, जुंडला',
    nameEn: 'Krishi Seva Kendra Sub-Mandi, Jundla',
    distanceKm: 24.0,
    addressHi: 'मुख्य चौक, जुंडला, करनाल',
    addressEn: 'Main Chowk, Jundla, Karnal',
    crowdLevel: 'medium',
    capacityPerSlot: 16,
    walkInReserved: 2,
    activeBookings: 9,
    currentRunningToken: 52,
    lat: 29.6450,
    lng: 76.8850
  }
];

export const TIME_SLOTS = [
  { id: 's1', time: '08:00 AM - 09:30 AM', period: 'morning', status: 'available', bookedCount: 11, totalCapacity: 20 },
  { id: 's2', time: '09:30 AM - 11:00 AM', period: 'morning', status: 'full', bookedCount: 17, totalCapacity: 20 },
  { id: 's3', time: '11:00 AM - 12:30 PM', period: 'morning', status: 'available', bookedCount: 7, totalCapacity: 20 },
  { id: 's4', time: '01:30 PM - 03:00 PM', period: 'afternoon', status: 'available', bookedCount: 9, totalCapacity: 20 },
  { id: 's5', time: '03:00 PM - 04:30 PM', period: 'afternoon', status: 'available', bookedCount: 13, totalCapacity: 20 },
  { id: 's6', time: '04:30 PM - 06:00 PM', period: 'afternoon', status: 'walk-in', bookedCount: 3, totalCapacity: 20, isWalkInOnly: true }
];

export const INITIAL_QUEUED_FARMERS = [
  { token: 140, nameEn: 'Balwant Singh', nameHi: 'बलवंत सिंह', crop: 'wheat', qty: 45, status: 'completed' },
  { token: 141, nameEn: 'Surjit Kumar', nameHi: 'सुरजीत कुमार', crop: 'wheat', qty: 60, status: 'completed' },
  { token: 142, nameEn: 'Harpreet Singh', nameHi: 'हरप्रीत सिंह', crop: 'paddy', qty: 30, status: 'in-service' },
  { token: 143, nameEn: 'Kuldeep Sharma', nameHi: 'कुलदीप शर्मा', crop: 'mustard', qty: 25, status: 'waiting' },
  { token: 144, nameEn: 'Jagjit Singh', nameHi: 'जगजीत सिंह', crop: 'wheat', qty: 50, status: 'waiting' },
  { token: 145, nameEn: 'Dharmpal Yadav', nameHi: 'धर्मपाल यादव', crop: 'paddy', qty: 40, status: 'waiting' },
  { token: 146, nameEn: 'Satpal Gurjar', nameHi: 'सतपाल गुर्जर', crop: 'wheat', qty: 35, status: 'waiting' }
];

export const TUTORIAL_VIDEOS = [
  {
    id: 'vid-1',
    titleKey: 'help.v1Title',
    duration: '1:45',
    captions: {
      hi: 'इस वीडियो में देखें कि कैसे आप केवल 1 मिनट में अपने मोबाइल से नजदीकी मंडी में स्लॉट बुक कर सकते हैं।',
      en: 'Watch this quick step-by-step guide to reserve your grain delivery slot in under 1 minute.'
    }
  },
  {
    id: 'vid-2',
    titleKey: 'help.v2Title',
    duration: '1:15',
    captions: {
      hi: 'गेट पर अपना क्यूआर कोड कैसे दिखाएं और बिना लाइन के सीधे धर्मकांटे तक कैसे पहुंचे।',
      en: 'Learn how to present your QR code pass at the entry gate for instant digital entry.'
    }
  },
  {
    id: 'vid-3',
    titleKey: 'help.v3Title',
    duration: '2:10',
    captions: {
      hi: 'अपनी फसल की नमी जांच, वजन रसीद और सीधे बैंक खाते में भुगतान की प्रगति कैसे देखें।',
      en: 'Understand how electronic weighbridge receipts and direct DBT bank payments are tracked.'
    }
  }
];

export const STAGES = [
  { id: 1, key: '1', icon: 'Ticket', nameEn: 'Token Issued', nameHi: 'टोकन जारी' },
  { id: 2, key: '2', icon: 'LogIn', nameEn: 'Center Entry', nameHi: 'केंद्र प्रवेश' },
  { id: 3, key: '3', icon: 'Microscope', nameEn: 'Quality Check', nameHi: 'गुणवत्ता जांच' },
  { id: 4, key: '4', icon: 'Scale', nameEn: 'Electronic Weighing', nameHi: 'धर्मकांटा तौल' },
  { id: 5, key: '5', icon: 'FileText', nameEn: 'Receipt (J-Form)', nameHi: 'खरीद रसीद' },
  { id: 6, key: '6', icon: 'Send', nameEn: 'Payment Processing', nameHi: 'भुगतान प्रक्रिया' },
  { id: 7, key: '7', icon: 'CheckCircle2', nameEn: 'Payment Credited', nameHi: 'खाते में जमा' }
];

export const getCentersByState = (stateName) => {
  if (!stateName) return CENTERS;
  const matched = CENTERS.filter(c => 
    c.state && c.state.toLowerCase() === stateName.toLowerCase()
  );
  return matched.length > 0 ? matched : CENTERS;
};

export const getDistrictsByState = (stateName) => {
  if (!stateName) return STATES_DATA[0].districts;
  const found = STATES_DATA.find(s => 
    s.nameEn.toLowerCase() === stateName.toLowerCase() || 
    s.nameHi === stateName ||
    s.id.toLowerCase() === stateName.toLowerCase()
  );
  return found ? found.districts : [];
};

