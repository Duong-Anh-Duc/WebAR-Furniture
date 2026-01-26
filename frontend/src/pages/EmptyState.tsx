import { Card, CardContent } from '@/components/ui/Card';
import { useTranslation } from '@/hooks/useTranslation';
import { Inbox } from 'lucide-react';
import React from 'react';

interface EmptyStateProps {
  message?: string;
  description?: string;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  message,
  description,
  icon,
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <Card className="max-w-md w-full">
        <CardContent className="pt-6 text-center space-y-4">
          {icon || <Inbox className="h-12 w-12 text-muted-foreground mx-auto" />}
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">
              {message || t('empty.title')}
            </h3>
            <p className="text-sm text-muted-foreground">
              {description || t('empty.description')}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
