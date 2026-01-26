import { Button } from '@/components/ui/Button';
import { useTranslation } from '@/hooks/useTranslation';
import { Model } from '@/types/model';
import React from 'react';
import { QRModelCard } from './QRModelCard';

interface QRListGridViewProps {
  paginatedModels: Model[];
  onView: (url: string) => void;
  onDelete: (model: Model) => void;
  getPublicUrl: (slug: string) => string;
  formatDate: (date: string) => string;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  filteredCount: number;
  pageSizeOptions: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export const QRListGridView: React.FC<QRListGridViewProps> = ({
  paginatedModels,
  onView,
  onDelete,
  getPublicUrl,
  formatDate,
  currentPage,
  pageSize,
  totalPages,
  filteredCount,
  pageSizeOptions,
  onPageChange,
  onPageSizeChange,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
        {paginatedModels.map((model) => (
          <QRModelCard
            key={model.id}
            model={model}
            onView={onView}
            onDelete={onDelete}
            getPublicUrl={getPublicUrl}
            formatDate={formatDate}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col gap-6 border-t border-border pt-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              {t('qrList.showing')} {(currentPage - 1) * pageSize + 1} {t('qrList.to')} {Math.min(currentPage * pageSize, filteredCount)} {t('qrList.of')} {filteredCount}
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm text-muted-foreground">
                {t('qrList.recordsPerPage')}:
              </label>
              <select
                value={pageSize}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                className="border border-border rounded px-2 py-1 bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {pageSizeOptions.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              {t('qrList.previous')}
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onPageChange(page)}
                  className="w-8 h-8 p-0"
                >
                  {page}
                </Button>
              ))}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              {t('qrList.next')}
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
