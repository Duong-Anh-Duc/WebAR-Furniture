import { useTranslation } from '@/hooks/useTranslation';
import React, { useState } from 'react';

export const LanguageSwitcher: React.FC = () => {
  const { language, changeLanguage } = useTranslation();
  const [showMenu, setShowMenu] = useState(false);

  const getCurrentFlag = () => {
    return language === 'vi' ? '🇻🇳' : '🇺🇸';
  };

  const handleLanguageChange = (lang: 'en' | 'vi') => {
    changeLanguage(lang);
    setShowMenu(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="text-xl hover:opacity-80 transition-opacity"
        title={language === 'vi' ? 'Việt Nam' : 'United States'}
      >
        {getCurrentFlag()}
      </button>
      
      {showMenu && (
        <div className="absolute right-0 mt-2 w-32 bg-background border border-border rounded-lg shadow-lg z-50">
          <button
            onClick={() => handleLanguageChange('en')}
            className={`w-full px-4 py-2 text-left text-sm hover:bg-accent flex items-center gap-2 ${
              language === 'en' ? 'bg-accent' : ''
            }`}
          >
            🇺🇸 English
          </button>
          <button
            onClick={() => handleLanguageChange('vi')}
            className={`w-full px-4 py-2 text-left text-sm hover:bg-accent flex items-center gap-2 ${
              language === 'vi' ? 'bg-accent' : ''
            }`}
          >
            🇻🇳 Tiếng Việt
          </button>
        </div>
      )}
    </div>
  );
};
