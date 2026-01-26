import { Badge } from '@/components/ui/Badge';
import { useTranslation } from '@/hooks/useTranslation';
import { Check, Loader2, Upload } from 'lucide-react';
import React from 'react';

interface UploadDropZoneProps {
  dragActive: boolean;
  isUploading: boolean;
  onDragEnter: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onBrowseClick: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const UploadDropZone: React.FC<UploadDropZoneProps> = ({
  dragActive,
  isUploading,
  onDragEnter,
  onDragOver,
  onDragLeave,
  onDrop,
  onBrowseClick,
  fileInputRef,
  onFileChange,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <div
        className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
          dragActive
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/50'
        }`}
        onDragEnter={onDragEnter}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".glb,.gltf"
          onChange={onFileChange}
          className="hidden"
          disabled={isUploading}
        />

        {isUploading ? (
          <div className="space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <div className="space-y-2">
              <p className="text-lg font-medium">{t('upload.status.uploading')}</p>
              <p className="text-sm text-muted-foreground">{t('upload.status.processing')}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Upload className="h-12 w-12 text-muted-foreground mx-auto" />
            <div className="space-y-2">
              <p className="text-lg font-medium">{t('upload.dragDrop')}</p>
              <p className="text-sm text-muted-foreground">
                {t('upload.or')}{' '}
                <button
                  onClick={onBrowseClick}
                  className="text-primary hover:underline font-medium"
                >
                  {t('upload.browseFiles')}
                </button>
              </p>
            </div>

            {/* Features */}
            <div className="flex items-center justify-center gap-4 pt-4">
              <Badge variant="secondary" className="gap-1">
                <Check className="h-3 w-3" />
                {t('upload.autoCompression')}
              </Badge>
              <Badge variant="secondary" className="gap-1">
                <Check className="h-3 w-3" />
                {t('upload.textureValidation')}
              </Badge>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
