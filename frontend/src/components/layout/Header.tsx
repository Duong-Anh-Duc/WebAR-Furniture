import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { ThemeSwitcher } from '@/components/common/ThemeSwitcher';
import { Button } from '@/components/ui/Button';
import { useTranslation } from '@/hooks/useTranslation';
import { QrCode, Sofa, Upload } from 'lucide-react';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Header: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-semibold text-lg">
          <Sofa className="h-6 w-6 text-primary" />
          <span className="hidden sm:inline">{t('header.title')}</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          <Link to="/admin/upload">
            <Button
              variant={isActivePath('/admin/upload') ? 'default' : 'ghost'}
              size="sm"
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              {t('header.upload')}
            </Button>
          </Link>
          
          <Link to="/admin/qr-list">
            <Button
              variant={isActivePath('/admin/qr-list') ? 'default' : 'ghost'}
              size="sm"
              className="flex items-center gap-2"
            >
              <QrCode className="h-4 w-4" />
              {t('header.qrList')}
            </Button>
          </Link>
        </nav>

        {/* Các điều khiển bên phải */}
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
};
