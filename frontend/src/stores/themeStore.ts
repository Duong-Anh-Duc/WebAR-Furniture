import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'system';

interface ThemeStore {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  actualTheme: 'light' | 'dark';
}

// Lấy tùy chọn giao diện hệ thống
const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
};

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: 'system',
      actualTheme: getSystemTheme(),
      setTheme: (theme) => {
        const actualTheme = theme === 'system' ? getSystemTheme() : theme;
        set({ theme, actualTheme });

        // Áp dụng mö giao diện cho tài liệu
        if (typeof document !== 'undefined') {
          const root = document.documentElement;
          root.classList.remove('light', 'dark');
          root.classList.add(actualTheme);
        }
      },
    }),
    {
      name: 'theme',
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Áp dụng giao diện sau khi tái nạp
          const actualTheme = state.theme === 'system' ? getSystemTheme() : state.theme;
          state.actualTheme = actualTheme;
          if (typeof document !== 'undefined') {
            const root = document.documentElement;
            root.classList.remove('light', 'dark');
            root.classList.add(actualTheme);
          }
        }
      },
    }
  )
);

// Listen to system theme changes
if (typeof window !== 'undefined' && window.matchMedia) {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const store = useThemeStore.getState();
    if (store.theme === 'system') {
      store.setTheme('system');
    }
  });
}
