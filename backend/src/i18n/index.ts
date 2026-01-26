import en from './en';
import vi from './vi';

type Language = 'en' | 'vi';

interface Translations {
  [key: string]: any;
}

const translations: Record<Language, Translations> = {
  en,
  vi,
};

export class I18n {
  private currentLanguage: Language = 'en';

  setLanguage(lang: Language): void {
    this.currentLanguage = lang;
  }

  getLanguage(): Language {
    return this.currentLanguage;
  }

  t(key: string, replacements?: Record<string, any>): string {
    const keys = key.split('.');
    let value: any = translations[this.currentLanguage];

    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }

    if (typeof value !== 'string') {
      return key;
    }

    // Replace placeholders
    if (replacements) {
      return Object.entries(replacements).reduce(
        (text, [placeholder, replacement]) =>
          text.replace(new RegExp(`\\{${placeholder}\\}`, 'g'), String(replacement)),
        value
      );
    }

    return value;
  }
}

// Singleton instance
export const i18n = new I18n();

// Helper function to get translation based on request language
export const getI18n = (lang?: string): I18n => {
  const instance = new I18n();
  if (lang === 'vi' || lang === 'en') {
    instance.setLanguage(lang);
  }
  return instance;
};

export default i18n;
