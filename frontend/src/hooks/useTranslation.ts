import { useLanguageStore } from '@/stores/languageStore';
import { useEffect } from 'react';
import { useTranslation as useI18nTranslation } from 'react-i18next';

export const useTranslation = () => {
  const { t, i18n } = useI18nTranslation();
  const { language, setLanguage } = useLanguageStore();

  // Sync store to i18n when language changes
  useEffect(() => {
    if (language !== i18n.language) {
      i18n.changeLanguage(language);
    }
  }, [language, i18n]);

  // Sync i18n to store when it changes externally
  useEffect(() => {
    const handleLanguageChanged = (lng: string) => {
      if (lng === 'en' || lng === 'vi') {
        if (language !== lng) {
          setLanguage(lng);
        }
      }
    };

    i18n.on('languageChanged', handleLanguageChanged);
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [language, i18n, setLanguage]);

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
