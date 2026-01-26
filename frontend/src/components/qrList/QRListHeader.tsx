import { Button } from '@/components/ui/Button';
import { useTranslation } from '@/hooks/useTranslation';
import { QrCode } from 'lucide-react';
import React from 'react';

interface QRListHeaderProps {
  onUploadClick: () => void;
}

export const QRListHeader: React.FC<QRListHeaderProps> = ({ onUploadClick }) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <QrCode className="h-8 w-8" />
          {t('qrList.title')}
        </h1>
        <p className="text-muted-foreground mt-2">
          {t('qrList.subtitle')}
        </p>
      </div>
      <Button 
        onClick={onUploadClick}
        className="flex items-center gap-2"
      >
        <span>+</span>
        {t('qrList.uploadNew')}
      </Button>
    </div>
  );
};
