import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { useTranslation } from '@/hooks/useTranslation';
import { AlertCircle } from 'lucide-react';
import React from 'react';

interface ErrorPageProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorPage: React.FC<ErrorPageProps> = ({ message, onRetry }) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md w-full border-destructive/50">
        <CardContent className="pt-6 text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
          
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-destructive">
              {t('error.title')}
            </h2>
            <p className="text-sm text-muted-foreground">
              {message || t('error.description')}
            </p>
          </div>

          {onRetry && (
            <Button onClick={onRetry} variant="outline">
              {t('error.retry')}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
