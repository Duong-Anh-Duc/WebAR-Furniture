import { getErrorMessage } from '@/api/axiosInstance';
import { modelApi } from '@/api/modelApi';
import { ModelViewer } from '@/components/common/ModelViewer';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useTranslation } from '@/hooks/useTranslation';
import type { Model } from '@/types/model';
import { AlertCircle, Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

type LoadingState = 'loading' | 'success' | 'error' | 'not-found';

export const ViewerPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  
  const [loadingState, setLoadingState] = useState<LoadingState>('loading');
  const [model, setModel] = useState<Model | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const fetchModel = async () => {
      if (!slug) {
        console.log('No slug provided');
        setLoadingState('not-found');
        return;
      }

      try {
        console.log('Fetching model with slug:', slug);
        setLoadingState('loading');
        const data = await modelApi.getBySlug(slug);
        console.log('Model loaded successfully:', data);
        setModel(data);
        setLoadingState('success');
      } catch (err: any) {
        const message = getErrorMessage(err);
        console.error('Error loading model:', message);
        console.error('Full error:', err);
        setErrorMessage(message);
        
        // Check if 404
        if (err?.response?.status === 404) {
          console.log('Model not found (404)');
          setLoadingState('not-found');
        } else {
          console.log('Error state set, status:', err?.response?.status);
          setLoadingState('error');
        }
      }
    };

    fetchModel();
  }, [slug]);

  // Trạng thái đang tải
  if (loadingState === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-lg text-muted-foreground">{t('viewer.loading')}</p>
        </div>
      </div>
    );
  }

  // Trạng thái Không tÌm thấy
  if (loadingState === 'not-found') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto" />
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">{t('viewer.notFound')}</h2>
              <p className="text-sm text-muted-foreground">
                {t('notFound.description')}
              </p>
            </div>
            <Button onClick={() => window.location.href = '/'}>
              {t('common.backToHome')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Trạng thái Lỗi
  if (loadingState === 'error') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md border-destructive/50">
          <CardContent className="pt-6 text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-destructive">{t('viewer.error')}</h2>
              <p className="text-sm text-muted-foreground">{errorMessage}</p>
            </div>
            <Button onClick={() => window.location.reload()} variant="outline">
              {t('error.retry')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Success state - show model
  if (loadingState === 'success' && model) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Model Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{model.name || 'Model'}</CardTitle>
          </CardHeader>
          <CardContent>
            <ModelViewer
              glbUrl={model.glbUrl}
              usdzUrl={model.usdzUrl}
              usdzReady={model.usdzReady}
              name={model.name || 'Model'}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
};
