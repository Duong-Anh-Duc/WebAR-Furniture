import { Button } from '@/components/ui/Button';
import { useTranslation } from '@/hooks/useTranslation';
import { Model } from '@/types/model';
import { Space, Table, Tag, Tooltip } from 'antd';
import { Eye, Trash2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import React from 'react';

interface QRListTableViewProps {
  paginatedModels: Model[];
  onView: (url: string) => void;
  onDelete: (model: Model) => void;
  getPublicUrl: (slug: string) => string;
  formatDate: (date: string) => string;
  currentPage: number;
  pageSize: number;
  totalCount: number;
  pageSizeOptions: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export const QRListTableView: React.FC<QRListTableViewProps> = ({
  paginatedModels,
  onView,
  onDelete,
  getPublicUrl,
  formatDate,
  currentPage,
  pageSize,
  totalCount,
  pageSizeOptions,
  onPageChange,
  onPageSizeChange,
}) => {
  const { t } = useTranslation();

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-card">
      <Table
        columns={[
          {
            title: t('qrList.qrCode'),
            key: 'qr',
            width: '80px',
            render: (_, record: Model) => {
              const publicUrl = getPublicUrl(record.slug);
              return (
                <div className="flex justify-center">
                  <div className="bg-white p-1 rounded border">
                    <QRCodeSVG
                      value={publicUrl}
                      size={60}
                      level="M"
                      includeMargin={false}
                    />
                  </div>
                </div>
              );
            },
          },
          {
            title: t('qrList.modelName'),
            key: 'name',
            render: (_, record: Model) => (
              <span title={record.name || undefined}>
                {record.name || 'Untitled'}
              </span>
            ),
          },
          {
            title: t('qrList.createdDate'),
            key: 'createdAt',
            render: (_, record: Model) => (
              <span>
                {record.createdAt ? formatDate(record.createdAt) : 'N/A'}
              </span>
            ),
          },
          {
            title: t('qrList.status'),
            key: 'status',
            width: '120px',
            render: (_, record: Model) => (
              <Tag
                color={record.usdzReady ? 'green' : 'gold'}
                style={{ cursor: 'default' }}
              >
                {record.usdzReady ? t('qrList.ready') : t('qrList.processing')}
              </Tag>
            ),
          },
          {
            title: t('qrList.actions'),
            key: 'actions',
            width: '100px',
            render: (_, record: Model) => {
              const publicUrl = getPublicUrl(record.slug);
              return (
                <Space size="small">
                  <Tooltip title={t('qrList.viewTooltip')}>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onView(publicUrl)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Tooltip>
                  <Tooltip title={t('qrList.deleteTooltip')}>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onDelete(record)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </Tooltip>
                </Space>
              );
            },
          },
        ]}
        dataSource={paginatedModels.map((model) => ({ ...model, key: model.id }))}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: totalCount,
          onChange: (page, newPageSize) => {
            onPageChange(page);
            onPageSizeChange(newPageSize);
          },
          pageSizeOptions: pageSizeOptions,
          showSizeChanger: true,
          showTotal: (total, range) =>
            `${t('qrList.showing')} ${range[0]} ${t('qrList.to')} ${range[1]} ${t('qrList.of')} ${total}`,
        }}
        bordered
        size="middle"
        className="ant-table-custom"
      />
    </div>
  );
};
