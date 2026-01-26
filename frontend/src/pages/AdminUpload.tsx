import { getErrorMessage } from '@/api/axiosInstance';
import { modelApi } from '@/api/modelApi';
import { Card, CardContent } from '@/components/ui/Card';
import { UploadDropZone, UploadErrorMessage, UploadHeader, UploadSuccess } from '@/components/upload';
import { useNotification } from '@/hooks/useNotification';
import { useTranslation } from '@/hooks/useTranslation';
import type { Model } from '@/types/model';
import React, { useRef, useState } from 'react';

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

export const AdminUploadPage: React.FC = () => {
  const { t } = useTranslation();
  const { success, error: showError } = useNotification();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');
  const [uploadedModel, setUploadedModel] = useState<Model | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Xác thực
  const validateFile = (file: File): { valid: boolean; error?: string } => {
    const validExtensions = ['.glb', '.gltf'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    const extension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
    if (!validExtensions.includes(extension)) {
      return { valid: false, error: t('upload.validation.invalidFormat') };
    }

    if (file.size > maxSize) {
      return { valid: false, error: t('upload.validation.tooLarge') };
    }

    return { valid: true };
  };

  // Xử lý tải lên tệp
  const handleUpload = async (file: File) => {
    const validation = validateFile(file);
    if (!validation.valid) {
      setErrorMessage(validation.error || '');
      setUploadStatus('error');
      showError(validation.error || '');
      return;
    }

    try {
      setUploadStatus('uploading');
      setErrorMessage('');

      const model = await modelApi.upload(file);
      
      setUploadedModel(model);
      setUploadStatus('success');
      success(t('upload.success.title'));
    } catch (err) {
      const message = getErrorMessage(err);
      setErrorMessage(message);
      setUploadStatus('error');
      showError(message);
    }
  };

  // Các trình xử lý kéo và thả
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleUpload(e.target.files[0]);
    }
  };

  // Đặt lại tải lên
  const resetUpload = () => {
    setUploadStatus('idle');
    setUploadedModel(null);
    setErrorMessage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <UploadHeader />

      {/* Upload Area */}
      {uploadStatus === 'idle' || uploadStatus === 'uploading' || uploadStatus === 'error' ? (
        <Card>
          <CardContent className="pt-6">
            <UploadDropZone
              dragActive={dragActive}
              isUploading={uploadStatus === 'uploading'}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onBrowseClick={() => fileInputRef.current?.click()}
              fileInputRef={fileInputRef}
              onFileChange={handleFileInput}
            />

            <UploadErrorMessage
              message={errorMessage}
              onClose={resetUpload}
            />
          </CardContent>
        </Card>
      ) : null}

      {/* Success State */}
      {uploadStatus === 'success' && uploadedModel && (
        <UploadSuccess
          model={uploadedModel}
          onUploadAnother={resetUpload}
        />
      )}
    </div>
  );
};
