import { Button } from '@/components/ui/Button';
import { useNotification } from '@/hooks/useNotification';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import { Moon, Sun } from 'lucide-react';
import React from 'react';

export const ThemeSwitcher: React.FC = () => {
  const { setTheme, isDark } = useTheme();
  const { t } = useTranslation();
  const { success } = useNotification();

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    setTheme(newTheme);
    
    // Show notification
    const themeName = newTheme === 'dark' ? t('theme.dark') : t('theme.light');
    success(t('notifications.themeChanged', { theme: themeName }));
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      title={isDark ? t('theme.light') : t('theme.dark')}
      className="relative"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};
