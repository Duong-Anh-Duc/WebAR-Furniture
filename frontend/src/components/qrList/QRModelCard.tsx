import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useTranslation } from '@/hooks/useTranslation';
import { Model } from '@/types/model';
import { Tooltip } from 'antd';
import { Eye, Trash2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import React from 'react';

interface QRModelCardProps {
  model: Model;
  onView: (url: string) => void;
  onDelete: (model: Model) => void;
  getPublicUrl: (slug: string) => string;
  formatDate: (date: string) => string;
}

export const QRModelCard: React.FC<QRModelCardProps> = ({
  model,
  onView,
  onDelete,
  getPublicUrl,
  formatDate,
}) => {
  const { t } = useTranslation();
  const publicUrl = getPublicUrl(model.slug);

  return (
    <Card className="p-6 space-y-4 flex flex-col h-full hover:shadow-md transition-shadow">
      {/* QR Code */}
      <div className="flex justify-center">
        <div className="bg-white p-3 rounded-lg shadow-sm border border-border">
          <QRCodeSVG
            value={publicUrl}
            size={100}
            level="M"
            includeMargin={false}
          />
        </div>
      </div>

      {/* Model Info */}
      <div className="text-center space-y-2 flex-1">
        <h3 
          className="font-semibold text-sm truncate" 
          title={model.name || undefined}
        >
          {model.name || 'Untitled'}
        </h3>
        <p className="text-xs text-muted-foreground">
          {model.createdAt ? formatDate(model.createdAt) : 'N/A'}
        </p>
        <div className="flex justify-center gap-1">
          <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
            model.usdzReady 
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300'
              : 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300'
          }`}>
            {model.usdzReady ? t('qrList.ready') : t('qrList.processing')}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-4">
        <Tooltip title={t('qrList.viewTooltip')}>
          <Button
            size="sm"
            variant="outline"
            className="flex-1"
            onClick={() => onView(publicUrl)}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </Tooltip>

        <Tooltip title={t('qrList.deleteTooltip')}>
          <Button
            size="sm"
            variant="destructive"
            className="flex-1"
            onClick={() => onDelete(model)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </Tooltip>
      </div>
    </Card>
  );
};
