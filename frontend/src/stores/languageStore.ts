import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Language = 'en' | 'vi';

interface LanguageStore {
  language: Language;
  setLanguage: (language: Language) => void;
}

const getInitialLanguage = (): Language => {
  if (typeof window === 'undefined') return 'en';
  
  // Lấy từ localStorage
  const stored = localStorage.getItem('language');
  if (stored === 'en' || stored === 'vi') return stored;
  
  // Lấy từ browser
  const browserLang = navigator.language.startsWith('vi') ? 'vi' : 'en';
  return browserLang;
};

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set) => ({
      language: getInitialLanguage(),
      setLanguage: (language) => set({ language }),
    }),
    {
      name: 'language',
    }
  )
);
