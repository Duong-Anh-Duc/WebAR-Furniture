import { Button } from '@/components/ui/Button';
import { useTranslation } from '@/hooks/useTranslation';
import { X } from 'lucide-react';
import React from 'react';

interface UploadErrorMessageProps {
  message: string;
  onClose: () => void;
}

export const UploadErrorMessage: React.FC<UploadErrorMessageProps> = ({
  message,
  onClose,
}) => {
  const { t } = useTranslation();

  if (!message) return null;

  return (
    <div className="mt-4 rounded-lg border border-destructive/50 bg-destructive/10 p-4">
      <div className="flex items-start gap-3">
        <X className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="font-medium text-destructive">{t('upload.status.failed')}</p>
          <p className="text-sm text-destructive/80 mt-1">{message}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          {t('common.close')}
        </Button>
      </div>
    </div>
  );
};
