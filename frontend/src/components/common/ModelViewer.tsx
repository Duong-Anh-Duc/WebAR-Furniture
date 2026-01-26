/// <reference types="@google/model-viewer" />

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useTranslation } from '@/hooks/useTranslation';
import '@google/model-viewer';
import {
  Hand,
  Loader2,
  Maximize2,
  Mouse,
  RotateCcw,
  Scroll,
  Zap,
} from 'lucide-react';
import React, { CSSProperties, useEffect, useRef } from 'react';

// Định nghĩa Props cho component
interface ModelViewerProps {
  glbUrl: string;
  usdzUrl?: string | null;
  usdzReady: boolean;
  name: string;
  className?: string;
}

// Định nghĩa HTML Element cho model-viewer custom element
interface ModelViewerElement extends HTMLElement {
  src: string;
  'ios-src'?: string;
  hasModel: boolean;
  addEventListener: (event: 'load' | 'error', handler: (event: Event) => void) => void;
  removeEventListener: (event: 'load' | 'error', handler: (event: Event) => void) => void;
}

// Định nghĩa Event cho model-viewer
interface ModelViewerEvent extends Event {
  detail?: {
    message: string;
    [key: string]: unknown;
  };
  error?: Error;
  message?: string;
  stack?: string;
}

// Định nghĩa Style Props với CSS variables
interface ModelViewerStyleProps extends CSSProperties {
  '--progress-bar-height'?: string;
  [key: string]: string | number | undefined;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          'ios-src'?: string;
          alt?: string;
          ar?: boolean;
          'ar-modes'?: string;
          'camera-controls'?: boolean;
          'touch-action'?: string;
          'ar-scale'?: string;
          'ar-placement'?: string;
          loading?: string;
          exposure?: number | string;
          'camera-orbit'?: string;
          style?: ModelViewerStyleProps;
        },
        HTMLElement
      >;
    }
  }
}

export const ModelViewer: React.FC<ModelViewerProps> = ({
  glbUrl,
  usdzUrl,
  usdzReady,
  name,
  className = '',
}) => {
  const { t } = useTranslation();
  const modelViewerRef = useRef<ModelViewerElement>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);

  useEffect(() => {
    // Log URLs in development mode
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 [ModelViewer] URLs:', { glbUrl, usdzUrl, usdzReady });
    }

    const modelViewer = modelViewerRef.current;
    if (!modelViewer) return;

    const handleLoad = (): void => {
      setIsLoading(false);
      setHasError(false);
    };

    const handleError = (event: Event): void => {
      const errorEvent = event as ModelViewerEvent;
      console.error('❌ [ModelViewer] Load error:', errorEvent?.detail?.message || 'Unknown error');
      setIsLoading(false);
      setHasError(true);
    };

    modelViewer.addEventListener('load', handleLoad);
    modelViewer.addEventListener('error', handleError);

    return () => {
      modelViewer.removeEventListener('load', handleLoad);
      modelViewer.removeEventListener('error', handleError);
    };
  }, [glbUrl, usdzUrl, usdzReady]);

  const arButtonText = t('viewer.viewInSpace');

  return (
    <div className={`relative w-full ${className}`}>
      {/* Trạng thái đang tải */}
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">{t('viewer.loading')}</p>
          </div>
        </div>
      )}

      {/* Trạng thái lỗi */}
      {hasError && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg">
          <div className="text-center">
            <p className="text-destructive font-medium">{t('viewer.error')}</p>
          </div>
        </div>
      )}

      {/* Biểu ngũ tối ưu hóa iOS */}
      {!usdzReady && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
          <Badge variant="warning" className="shadow-lg">
            {t('viewer.iosOptimizing')}
          </Badge>
        </div>
      )}

      {/* Trình xem Mô hình với AR Controls */}
      <model-viewer
        ref={modelViewerRef}
        src={glbUrl}
        ios-src={usdzReady && usdzUrl ? usdzUrl : undefined}
        alt={name}
        ar
        ar-modes="webxr scene-viewer quick-look"
        camera-controls
        touch-action="manipulation"
        ar-scale="auto"
        ar-placement="floor wall"
        loading="eager"
        exposure="1"
        camera-orbit="45deg 65deg 2.5m"
        className="w-full h-[500px] md:h-[600px] rounded-lg bg-muted"
        style={{
          width: '100%',
          height: '500px',
          backgroundColor: 'var(--muted)',
          '--progress-bar-height': '0px',
        } as ModelViewerStyleProps}
      >
        {/* Nút AR */}
        {usdzReady && (
          <Button
            slot="ar-button"
            size="lg"
            className="absolute bottom-6 left-1/2 -translate-x-1/2 shadow-lg z-10 px-8 py-6 text-base font-semibold hover:scale-105 transition-transform"
          >
            {arButtonText}
          </Button>
        )}

        {/* Poster khi chưa load */}
        <div
          slot="poster"
          className="flex items-center justify-center w-full h-full bg-muted"
        >
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </model-viewer>

      {/* Control Instructions - Desktop & Mobile */}
      {!isLoading && !hasError && (
        <div className="mt-4 rounded-lg border border-border bg-card p-4 space-y-3">
          <p className="font-semibold text-sm text-foreground flex items-center gap-2">
            <Zap className="h-4 w-4" />
            {t('viewer.controls')}
          </p>
          <div className="space-y-2 text-sm text-muted-foreground">
            {/* Desktop */}
            <div className="hidden md:block space-y-1">
              <p className="flex items-center gap-2">
                <Mouse className="h-4 w-4 flex-shrink-0" />
                {t('viewer.desktopDrag')}
              </p>
              <p className="flex items-center gap-2">
                <Scroll className="h-4 w-4 flex-shrink-0" />
                {t('viewer.desktopScroll')}
              </p>
            </div>
            {/* Mobile */}
            <div className="md:hidden space-y-1">
              <p className="flex items-center gap-2">
                <Hand className="h-4 w-4 flex-shrink-0" />
                {t('viewer.mobileDrag')}
              </p>
              <p className="flex items-center gap-2">
                <Hand className="h-4 w-4 flex-shrink-0" />
                {t('viewer.mobilePinch')}
              </p>
              <p className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4 flex-shrink-0" />
                {t('viewer.mobileRotate')}
              </p>
            </div>
            
            {/* AR Instructions */}
            {usdzReady && (
              <div className="mt-3 pt-3 border-t border-border space-y-1">
                <p className="font-medium flex items-center gap-2">
                  <Maximize2 className="h-4 w-4" />
                  {t('viewer.arMode')}
                </p>
                <p className="flex items-center gap-2 ml-6">
                  <span className="text-muted-foreground">•</span>
                  {t('viewer.arPlaceFloor')}
                </p>
                <p className="flex items-center gap-2 ml-6">
                  <span className="text-muted-foreground">•</span>
                  {t('viewer.arResize')}
                </p>
                <p className="flex items-center gap-2 ml-6">
                  <span className="text-muted-foreground">•</span>
                  {t('viewer.arRotate')}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Thông báo tối ưu hóa iOS */}
      {!usdzReady && (
        <div className="mt-6 rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">
            {t('viewer.iosOptimizingDesc')}
          </p>
        </div>
      )}
    </div>
  );
};
