import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import hi from './locales/hi.json';
import en from './locales/en.json';

const resources = {
  hi: { translation: hi },
  en: { translation: en }
};

const savedLang = localStorage.getItem('agriminds_lang') || 'hi';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLang,
    fallbackLng: {
      'en': ['en'],
      'default': ['hi']
    },
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
