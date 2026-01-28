import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Language = 'en' | 'vi';

interface LanguageStore {
  language: Language;
  setLanguage: (language: Language) => void;
}

const getBrowserLanguage = (): Language => {
  if (typeof window === 'undefined') return 'en';
  const browserLang = navigator.language.toLowerCase();
  return browserLang.startsWith('vi') ? 'vi' : 'en';
};

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set) => ({
      language: getBrowserLanguage(),
      setLanguage: (language: Language) => set({ language }),
    }),
    {
      name: 'language-storage',
    }
  )
);
