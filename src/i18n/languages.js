export const SUPPORTED_LANGUAGES = [
  { code: 'hi', nativeName: 'हिन्दी', englishName: 'Hindi', script: 'Devanagari', isTranslated: true, dir: 'ltr' },
  { code: 'en', nativeName: 'English', englishName: 'English', script: 'Latin', isTranslated: true, dir: 'ltr' },
  { code: 'mr', nativeName: 'मराठी', englishName: 'Marathi', script: 'Devanagari', isTranslated: false, dir: 'ltr' },
  { code: 'pa', nativeName: 'ਪੰਜਾਬੀ', englishName: 'Punjabi', script: 'Gurmukhi', isTranslated: false, dir: 'ltr' },
  { code: 'gu', nativeName: 'ગુજરાતી', englishName: 'Gujarati', script: 'Gujarati', isTranslated: false, dir: 'ltr' },
  { code: 'bn', nativeName: 'বাংলা', englishName: 'Bengali', script: 'Bengali', isTranslated: false, dir: 'ltr' },
  { code: 'ta', nativeName: 'தமிழ்', englishName: 'Tamil', script: 'Tamil', isTranslated: false, dir: 'ltr' },
  { code: 'te', nativeName: 'తెలుగు', englishName: 'Telugu', script: 'Telugu', isTranslated: false, dir: 'ltr' },
  { code: 'kn', nativeName: 'ಕನ್ನಡ', englishName: 'Kannada', script: 'Kannada', isTranslated: false, dir: 'ltr' },
  { code: 'ml', nativeName: 'മലയാളം', englishName: 'Malayalam', script: 'Malayalam', isTranslated: false, dir: 'ltr' },
  { code: 'or', nativeName: 'ଓଡ଼ିଆ', englishName: 'Odia', script: 'Odia', isTranslated: false, dir: 'ltr' },
  { code: 'ur', nativeName: 'اردو', englishName: 'Urdu', script: 'Arabic', isTranslated: false, dir: 'rtl' },
];

export const getLanguageConfig = (code) => {
  return SUPPORTED_LANGUAGES.find(l => l.code === code) || SUPPORTED_LANGUAGES[0];
};
