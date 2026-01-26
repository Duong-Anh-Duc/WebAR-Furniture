import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useTranslation } from '@/hooks/useTranslation';
import { QrCode } from 'lucide-react';
import React from 'react';

interface QRListNoResultsProps {
  onClearSearch: () => void;
  hasResults: boolean;
}

export const QRListNoResults: React.FC<QRListNoResultsProps> = ({
  onClearSearch,
  hasResults,
}) => {
  const { t } = useTranslation();

  if (hasResults) return null;

  return (
    <Card className="p-16 text-center">
      <QrCode className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
      <h3 className="text-xl font-semibold mb-2">{t('qrList.noResults')}</h3>
      <p className="text-muted-foreground mb-6">{t('qrList.noResultsDesc')}</p>
      <Button onClick={onClearSearch} variant="outline">
        {t('qrList.clearSearch')}
      </Button>
    </Card>
  );
};
