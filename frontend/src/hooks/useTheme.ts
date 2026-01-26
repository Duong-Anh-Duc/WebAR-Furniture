import { useThemeStore } from '@/stores/themeStore';

export const useTheme = () => {
  const { theme, actualTheme, setTheme } = useThemeStore();

  return {
    theme,
    actualTheme,
    setTheme,
    isDark: actualTheme === 'dark',
  };
};
