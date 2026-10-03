// Role registry for AgriMinds (Phase 2 & Phase 3)
// Center Staff & Government Official roles

export const ROLES = [
  {
    id: 'center_staff',
    labelEn: 'Center Staff',
    labelHi: 'खरीद केंद्र कर्मचारी',
    descEn: 'Procurement Center operations, gate check-in, quality check, weighing, and verification.',
    descHi: 'खरीद केंद्र संचालन, गेट क्यूआर स्कैन, गुणवत्ता जांच, धर्मकांटा तौल और सत्यापन।',
    icon: 'Building2',
    color: 'emerald',
    route: 'admin_login',
    enabled: true
  },
  {
    id: 'govt_official',
    labelEn: 'Government Official',
    labelHi: 'सरकारी जिला अधिकारी',
    descEn: 'District & state analytics, procurement heatmaps, bottleneck alerts, 7-day arrival forecasts, and payment tracking.',
    descHi: 'जिला एवं राज्य स्तरीय खरीद विश्लेषण, कतार हीटमैप, बॉटलनेक अलर्ट, 7 दिवसीय आगमन पूर्वानुमान और भुगतान ट्रैकिंग।',
    icon: 'Landmark',
    color: 'amber',
    route: 'govt_login',
    enabled: true
  }
];

export const STAFF_ACCOUNTS = [
  {
    employeeId: 'EMP-101',
    pin: '1234',
    name: 'Ramesh Verma',
    centerId: 'center-1',
    centerNameEn: 'Nilokheri Main Grain Mandi',
    centerNameHi: 'अनाज मंडी, नीलोखेड़ी (मुख्य केंद्र)'
  },
  {
    employeeId: 'EMP-102',
    pin: '1234',
    name: 'Suresh Kumar',
    centerId: 'center-2',
    centerNameEn: 'Taraori APMC Procurement Center',
    centerNameHi: 'कृषि उपज मंडी समिति, तरावड़ी'
  },
  {
    employeeId: 'EMP-103',
    pin: '1234',
    name: 'Vikram Singh',
    centerId: 'center-3',
    centerNameEn: 'HAFED Procurement Hub, Indri',
    centerNameHi: 'हैफेड खरीद केंद्र, इंद्री'
  }
];

export const GOVT_ACCOUNTS = [
  {
    officialId: 'GOV-101',
    pin: '1234',
    name: 'Dr. Rajesh Sharma (IAS)',
    designationEn: 'District Procurement Controller, Karnal Division',
    designationHi: 'जिला खरीद नियंत्रक, करनाल मंडल',
    jurisdiction: 'Karnal, Kurukshetra, Kaithal'
  },
  {
    officialId: 'GOV-102',
    pin: '1234',
    name: 'Anita Deshmukh',
    designationEn: 'State Agriculture Marketing Board Director',
    designationHi: 'राज्य कृषि विपणन बोर्ड निदेशक',
    jurisdiction: 'State Wide'
  }
];

