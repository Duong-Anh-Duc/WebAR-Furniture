import { useTranslation } from '@/hooks/useTranslation';
import React from 'react';

export const UploadHeader: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="text-center space-y-2">
      <h1 className="text-3xl font-bold tracking-tight">{t('upload.title')}</h1>
      <p className="text-muted-foreground">{t('upload.subtitle')}</p>
      <p className="text-sm text-muted-foreground">{t('upload.supportedFormats')}</p>
    </div>
  );
};
