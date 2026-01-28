import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { useNotification } from '@/hooks/useNotification';
import { useTranslation } from '@/hooks/useTranslation';
import { Model } from '@/types/model';
import { Check, CheckCircle, Link as LinkIcon, Upload } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import React, { useState } from 'react';

interface UploadSuccessProps {
  model: Model;
  onUploadAnother: () => void;
}

export const UploadSuccess: React.FC<UploadSuccessProps> = ({
  model,
  onUploadAnother,
}) => {
  const { t } = useTranslation();
  const { success } = useNotification();
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    const url = model.viewerUrl || `${window.location.origin}/p/${model.slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    success(t('common.copied'));
    setTimeout(() => setCopied(false), 2000);
  };

  const publicUrl = model.viewerUrl || `${window.location.origin}/p/${model.slug}`;

  return (
    <div className="space-y-6">
      {/* Success Notification */}
      <Card className="border-green-500/50 bg-green-50 dark:bg-green-950/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold text-green-900 dark:text-green-100">
                {t('upload.success.title')}
              </h3>
              <p className="text-sm text-green-800 dark:text-green-200 mt-1">
                {t('upload.success.description')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Public Link */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('upload.publicLink.title')}</CardTitle>
          <CardDescription>{t('upload.publicLink.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex-1 rounded-md border border-border bg-muted px-4 py-3 font-mono text-sm break-all">
              {publicUrl}
            </div>
            <Button onClick={handleCopyLink} variant="outline" className="gap-2 flex-shrink-0">
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  {t('common.copied')}
                </>
              ) : (
                <>
                  <LinkIcon className="h-4 w-4" />
                  {t('common.copy')}
                </>
              )}
            </Button>
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-2">
            <Badge variant={model.status === 'ready' ? 'success' : model.status === 'failed' ? 'destructive' : 'warning'}>
              {model.status === 'ready'
                ? t('upload.status.ready')
                : model.status === 'failed' 
                ? t('upload.status.failed')
                : t('upload.status.convertingIOS')}
            </Badge>
            {model.status !== 'ready' && model.status !== 'failed' && (
              <span className="text-sm text-muted-foreground">
                {t('upload.publicLink.expiresIn')}
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* QR Code */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('upload.qrCode.title')}</CardTitle>
          <CardDescription>{t('upload.qrCode.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center p-4 bg-white rounded-lg border border-border">
            <QRCodeSVG
              value={publicUrl}
              size={200}
              level="H"
              includeMargin
            />
          </div>
        </CardContent>
      </Card>

      {/* Upload Another */}
      <div className="flex justify-center">
        <Button onClick={onUploadAnother} variant="outline" size="lg" className="gap-2">
          <Upload className="h-4 w-4" />
          {t('upload.title')}
        </Button>
      </div>
    </div>
  );
};
