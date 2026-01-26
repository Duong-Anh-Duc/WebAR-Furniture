import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en';
import vi from './vi';

const resources = {
  en: { translation: en },
  vi: { translation: vi },
};

// Detect browser language
const getBrowserLanguage = (): string => {
  const browserLang = navigator.language.toLowerCase();
  if (browserLang.startsWith('vi')) return 'vi';
  return 'en';
};

// Get saved language or use browser language
const savedLanguage = localStorage.getItem('language');
const defaultLanguage = savedLanguage || getBrowserLanguage();

i18n.use(initReactI18next).init({
  resources,
  lng: defaultLanguage,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
