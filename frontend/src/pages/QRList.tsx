import { modelApi } from '@/api/modelApi';
import { QRListDeleteModal, QRListEmpty, QRListGridView, QRListHeader, QRListNoResults, QRListSearch, QRListTableView } from '@/components/qrList';
import { useNotification } from '@/hooks/useNotification';
import { useTranslation } from '@/hooks/useTranslation';
import { Model } from '@/types/model';
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const QRListPage: React.FC = () => {
  const { t } = useTranslation();
  const { error, success } = useNotification();
  const navigate = useNavigate();
  const [models, setModels] = useState<Model[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [modelToDelete, setModelToDelete] = useState<Model | null>(null);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const pageSizeOptions = [12, 20, 50, 100];

  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = async () => {
    try {
      setIsLoading(true);
      const data = await modelApi.getAll();
      setModels(data);
      setCurrentPage(1);
    } catch (err) {
      console.error('Failed to load models:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getPublicUrl = (slug: string) => {
    return `${window.location.origin}/p/${slug}`;
  };

  const filteredModels = useMemo(() => {
    if (!searchText) return models;
    return models.filter((model) =>
      (model.name || '').toLowerCase().includes(searchText.toLowerCase())
    );
  }, [models, searchText]);

  const paginatedModels = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredModels.slice(startIndex, startIndex + pageSize);
  }, [filteredModels, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredModels.length / pageSize);

  const handleSearchChange = (text: string) => {
    setSearchText(text);
    setCurrentPage(1);
  };

  const handleViewModeChange = (mode: 'grid' | 'table') => {
    setViewMode(mode);
    setCurrentPage(1);
  };

  const handleDelete = (model: Model) => {
    setModelToDelete(model);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!modelToDelete) return;

    try {
      setIsDeleting(true);
      await modelApi.delete(modelToDelete.id);
      await loadModels();
      success(t('qrList.deleteSuccess'));
    } catch (deleteError) {
      console.error('Failed to delete model:', deleteError);
      error(t('qrList.deleteError'));
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
      setModelToDelete(null);
    }
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setModelToDelete(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <QRListHeader onUploadClick={() => navigate('/admin/upload')} />

      {/* Empty State */}
      <QRListEmpty onUploadClick={() => navigate('/admin/upload')} hasModels={models.length > 0} />

      {/* Search & View Toggle */}
      <QRListSearch
        searchText={searchText}
        onSearchChange={handleSearchChange}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        hasModels={models.length > 0}
      />

      {/* No Results */}
      <QRListNoResults
        onClearSearch={() => setSearchText('')}
        hasResults={filteredModels.length > 0}
      />

      {/* Grid or Table View */}
      {filteredModels.length > 0 && (
        viewMode === 'grid' ? (
          <QRListGridView
            paginatedModels={paginatedModels}
            onView={(url) => window.open(url, '_blank')}
            onDelete={handleDelete}
            getPublicUrl={getPublicUrl}
            formatDate={formatDate}
            currentPage={currentPage}
            pageSize={pageSize}
            totalPages={totalPages}
            filteredCount={filteredModels.length}
            pageSizeOptions={pageSizeOptions}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
          />
        ) : (
          <QRListTableView
            paginatedModels={paginatedModels}
            onView={(url) => window.open(url, '_blank')}
            onDelete={handleDelete}
            getPublicUrl={getPublicUrl}
            formatDate={formatDate}
            currentPage={currentPage}
            pageSize={pageSize}
            totalCount={filteredModels.length}
            pageSizeOptions={pageSizeOptions}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
          />
        )
      )}

      {/* Delete Modal */}
      <QRListDeleteModal
        open={deleteModalOpen}
        model={modelToDelete}
        isDeleting={isDeleting}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
};