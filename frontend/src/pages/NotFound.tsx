import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { useTranslation } from '@/hooks/useTranslation';
import { AlertCircle, Home } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

export const NotFoundPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <Card className="max-w-md w-full">
        <CardContent className="pt-6 text-center space-y-6">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl" />
              <AlertCircle className="relative h-20 w-20 text-primary" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">404</h1>
            <h2 className="text-xl font-semibold">{t('notFound.title')}</h2>
            <p className="text-muted-foreground">{t('notFound.description')}</p>
          </div>

          <Link to="/">
            <Button className="gap-2">
              <Home className="h-4 w-4" />
              {t('notFound.backToHome')}
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};
