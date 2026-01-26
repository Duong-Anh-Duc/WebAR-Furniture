import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useTranslation } from '@/hooks/useTranslation';
import { Tooltip } from 'antd';
import { Grid3x3, List, Search } from 'lucide-react';
import React from 'react';

interface QRListSearchProps {
  searchText: string;
  onSearchChange: (text: string) => void;
  viewMode: 'grid' | 'table';
  onViewModeChange: (mode: 'grid' | 'table') => void;
  hasModels: boolean;
}

export const QRListSearch: React.FC<QRListSearchProps> = ({
  searchText,
  onSearchChange,
  viewMode,
  onViewModeChange,
  hasModels,
}) => {
  const { t } = useTranslation();

  if (!hasModels) return null;

  return (
    <div className="mb-6 flex items-center gap-4 justify-between">
      <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-4 py-2 flex-1">
        <Search className="h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder={t('qrList.searchPlaceholder')}
          value={searchText}
          onChange={(e) => onSearchChange(e.target.value)}
          className="flex-1 border-0 bg-transparent focus:outline-none"
        />
      </div>

      {/* View Mode Toggle */}
      <div className="flex items-center gap-2 border border-border rounded-lg p-1 bg-card">
        <Tooltip title={t('qrList.gridView')}>
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewModeChange('grid')}
            className="flex items-center gap-2"
          >
            <Grid3x3 className="h-4 w-4" />
          </Button>
        </Tooltip>
        <Tooltip title={t('qrList.tableView')}>
          <Button
            variant={viewMode === 'table' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewModeChange('table')}
            className="flex items-center gap-2"
          >
            <List className="h-4 w-4" />
          </Button>
        </Tooltip>
      </div>
    </div>
  );
};
