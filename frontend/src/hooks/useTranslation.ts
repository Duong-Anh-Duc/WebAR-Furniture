import { useLanguageStore } from '@/stores/languageStore';
import { useEffect } from 'react';
import { useTranslation as useI18nTranslation } from 'react-i18next';

export const useTranslation = () => {
  const { t, i18n } = useI18nTranslation();
  const { language, setLanguage } = useLanguageStore();

  useEffect(() => {
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }, [language, i18n]);

  const changeLanguage = (newLanguage: 'en' | 'vi') => {
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
  };

  return {
    t,
    language,
    changeLanguage,
  };
};
