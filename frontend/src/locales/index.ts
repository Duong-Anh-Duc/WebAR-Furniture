import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en';
import vi from './vi';

const resources = {
  en: { translation: en },
  vi: { translation: vi },
};

// Get browser language
const getBrowserLanguage = (): string => {
  if (typeof window === 'undefined') return 'en';
  const browserLang = navigator.language.toLowerCase();
  if (browserLang.startsWith('vi')) return 'vi';
  return 'en';
};

// Get saved language from localStorage
const getSavedLanguage = (): string => {
  if (typeof window === 'undefined') return 'en';
  return localStorage.getItem('language-storage') || getBrowserLanguage();
};

const defaultLanguage = getSavedLanguage();

i18n.use(initReactI18next).init({
  resources,
  lng: defaultLanguage,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
