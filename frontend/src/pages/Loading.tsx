import { useTranslation } from '@/hooks/useTranslation';
import { Loader2 } from 'lucide-react';
import React from 'react';

interface LoadingPageProps {
  message?: string;
}

export const LoadingPage: React.FC<LoadingPageProps> = ({ message }) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
        <p className="text-lg text-muted-foreground">
          {message || t('common.loading')}
        </p>
      </div>
    </div>
  );
};
