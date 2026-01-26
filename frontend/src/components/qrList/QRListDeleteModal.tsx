import { Button } from '@/components/ui/Button';
import { Modal, ModalDescription, ModalFooter, ModalHeader, ModalTitle } from '@/components/ui/Modal';
import { useTranslation } from '@/hooks/useTranslation';
import { Model } from '@/types/model';
import { AlertTriangle, Trash2 } from 'lucide-react';
import React from 'react';

interface QRListDeleteModalProps {
  open: boolean;
  model: Model | null;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const QRListDeleteModal: React.FC<QRListDeleteModalProps> = ({
  open,
  model,
  isDeleting,
  onConfirm,
  onCancel,
}) => {
  const { t } = useTranslation();

  return (
    <Modal open={open} onClose={onCancel}>
      <ModalHeader>
        <ModalTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          {t('qrList.confirmDeleteTitle')}
        </ModalTitle>
        <ModalDescription>
          {model && (
            <>
              {t('qrList.confirmDeleteDesc')} <strong>{model.name || 'Untitled'}</strong>?
              <br />
              <span className="text-destructive text-sm mt-2 block">
                {t('qrList.confirmDeleteWarning')}
              </span>
            </>
          )}
        </ModalDescription>
      </ModalHeader>
      
      <ModalFooter>
        <Button 
          variant="outline" 
          onClick={onCancel}
          disabled={isDeleting}
        >
          {t('common.cancel')}
        </Button>
        <Button 
          variant="destructive" 
          onClick={onConfirm}
          disabled={isDeleting}
          className="flex items-center gap-2"
        >
          <Trash2 className="h-4 w-4" />
          {isDeleting ? t('common.loading') : t('qrList.deleteButton')}
        </Button>
      </ModalFooter>
    </Modal>
  );
};
