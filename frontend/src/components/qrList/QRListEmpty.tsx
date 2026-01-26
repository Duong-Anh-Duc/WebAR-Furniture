import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useTranslation } from '@/hooks/useTranslation';
import { QrCode } from 'lucide-react';
import React from 'react';

interface QRListEmptyProps {
  onUploadClick: () => void;
  hasModels: boolean;
}

export const QRListEmpty: React.FC<QRListEmptyProps> = ({
  onUploadClick,
  hasModels,
}) => {
  const { t } = useTranslation();

  if (hasModels) return null;

  return (
    <Card className="p-16 text-center">
      <QrCode className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
      <h3 className="text-xl font-semibold mb-2">{t('qrList.noModels')}</h3>
      <p className="text-muted-foreground mb-6">{t('qrList.noModelsDesc')}</p>
      <Button onClick={onUploadClick} size="lg">
        {t('qrList.uploadFirst')}
      </Button>
    </Card>
  );
};
