# 🚀 Hướng Dẫn Sử Dụng Components Mới

## QRList Components Usage

### Import Components
```tsx
import { 
  QRListHeader, 
  QRListSearch, 
  QRListGridView, 
  QRListTableView,
  QRListEmpty,
  QRListNoResults,
  QRListDeleteModal 
} from '@/components/qrList';
```

### State Management
```tsx
const [models, setModels] = useState<Model[]>([]);
const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
const [searchText, setSearchText] = useState('');
const [currentPage, setCurrentPage] = useState(1);
const [pageSize, setPageSize] = useState(12);

// Computed states
const filteredModels = useMemo(() => {
  if (!searchText) return models;
  return models.filter(m => m.name.includes(searchText));
}, [models, searchText]);

const paginatedModels = useMemo(() => {
  const start = (currentPage - 1) * pageSize;
  return filteredModels.slice(start, start + pageSize);
}, [filteredModels, currentPage, pageSize]);
```

### Render Components
```tsx
return (
  <div className="container mx-auto">
    {/* Header */}
    <QRListHeader onUploadClick={() => navigate('/admin/upload')} />

    {/* Empty State */}
    <QRListEmpty 
      onUploadClick={() => navigate('/admin/upload')} 
      hasModels={models.length > 0} 
    />

    {/* Search & View Toggle */}
    <QRListSearch
      searchText={searchText}
      onSearchChange={(text) => {
        setSearchText(text);
        setCurrentPage(1);
      }}
      viewMode={viewMode}
      onViewModeChange={(mode) => {
        setViewMode(mode);
        setCurrentPage(1);
      }}
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
          pageSizeOptions={[12, 20, 50, 100]}
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
          pageSizeOptions={[12, 20, 50, 100]}
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
```

---

## Upload Components Usage

### Import Components
```tsx
import { 
  UploadHeader, 
  UploadDropZone, 
  UploadErrorMessage, 
  UploadSuccess 
} from '@/components/upload';
```

### State Management
```tsx
type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');
const [uploadedModel, setUploadedModel] = useState<Model | null>(null);
const [dragActive, setDragActive] = useState(false);
const [errorMessage, setErrorMessage] = useState('');
const fileInputRef = useRef<HTMLInputElement>(null);
```

### Handlers
```tsx
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
  if (e.dataTransfer.files?.[0]) {
    handleUpload(e.dataTransfer.files[0]);
  }
};

const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files?.[0]) {
    handleUpload(e.target.files[0]);
  }
};

const handleUpload = async (file: File) => {
  // Validate
  const validation = validateFile(file);
  if (!validation.valid) {
    setErrorMessage(validation.error || '');
    setUploadStatus('error');
    return;
  }

  // Upload
  try {
    setUploadStatus('uploading');
    const model = await modelApi.upload(file);
    setUploadedModel(model);
    setUploadStatus('success');
  } catch (err) {
    setErrorMessage(getErrorMessage(err));
    setUploadStatus('error');
  }
};

const resetUpload = () => {
  setUploadStatus('idle');
  setUploadedModel(null);
  setErrorMessage('');
  fileInputRef.current!.value = '';
};
```

### Render Components
```tsx
return (
  <div className="max-w-4xl mx-auto space-y-6">
    {/* Header */}
    <UploadHeader />

    {/* Upload Area */}
    {uploadStatus !== 'success' && (
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
    )}

    {/* Success State */}
    {uploadStatus === 'success' && uploadedModel && (
      <UploadSuccess
        model={uploadedModel}
        onUploadAnother={resetUpload}
      />
    )}
  </div>
);
```

---

## Component Props Reference

### QRListHeader
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| onUploadClick | () => void | ✓ | Called when upload button clicked |

### QRListSearch
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| searchText | string | ✓ | Current search text |
| onSearchChange | (text: string) => void | ✓ | Called when search text changes |
| viewMode | 'grid' \| 'table' | ✓ | Current view mode |
| onViewModeChange | (mode: 'grid' \| 'table') => void | ✓ | Called when view mode changes |
| hasModels | boolean | ✓ | Show search if true |

### QRListGridView & QRListTableView
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| paginatedModels | Model[] | ✓ | Models to display |
| onView | (url: string) => void | ✓ | Called when view button clicked |
| onDelete | (model: Model) => void | ✓ | Called when delete button clicked |
| getPublicUrl | (slug: string) => string | ✓ | Function to get public URL |
| formatDate | (date: string) => string | ✓ | Function to format dates |
| currentPage | number | ✓ | Current page number |
| pageSize | number | ✓ | Items per page |
| totalPages / totalCount | number | ✓ | Total pages / items |
| pageSizeOptions | number[] | ✓ | Available page sizes |
| onPageChange | (page: number) => void | ✓ | Called when page changes |
| onPageSizeChange | (size: number) => void | ✓ | Called when page size changes |

### UploadDropZone
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| dragActive | boolean | ✓ | Is drag active |
| isUploading | boolean | ✓ | Is uploading |
| onDragEnter | (e: React.DragEvent) => void | ✓ | Drag enter handler |
| onDragOver | (e: React.DragEvent) => void | ✓ | Drag over handler |
| onDragLeave | (e: React.DragEvent) => void | ✓ | Drag leave handler |
| onDrop | (e: React.DragEvent) => void | ✓ | Drop handler |
| onBrowseClick | () => void | ✓ | Browse button handler |
| fileInputRef | RefObject<HTMLInputElement> | ✓ | File input ref |
| onFileChange | (e: React.ChangeEvent<HTMLInputElement>) => void | ✓ | File change handler |

### UploadSuccess
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| model | Model | ✓ | Uploaded model |
| onUploadAnother | () => void | ✓ | Called when upload another clicked |

---

## Best Practices

1. **Use useMemo for computed states** - filteredModels, paginatedModels
2. **Reset pagination** - When search or view mode changes
3. **Handle loading states** - Show spinner during upload/delete
4. **Validate files** - Before upload attempt
5. **Use tooltips** - For action buttons (View, Delete, etc.)
6. **Bilingual support** - Use i18n keys instead of hardcoded strings
7. **Error handling** - Catch API errors and show user-friendly messages
8. **Empty states** - Handle no data, no results cases

---

## Common Patterns

### Search with pagination reset
```tsx
const handleSearchChange = (text: string) => {
  setSearchText(text);
  setCurrentPage(1); // Reset to first page
};
```

### View mode toggle with pagination reset
```tsx
const handleViewModeChange = (mode: 'grid' | 'table') => {
  setViewMode(mode);
  setCurrentPage(1); // Reset to first page
};
```

### Pagination size change with reset
```tsx
onPageSizeChange={(size) => {
  setPageSize(size);
  setCurrentPage(1); // Reset to first page
}}
```

### Delete with confirmation
```tsx
const handleDelete = (model: Model) => {
  setModelToDelete(model);
  setDeleteModalOpen(true);
};

const confirmDelete = async () => {
  try {
    setIsDeleting(true);
    await modelApi.delete(modelToDelete.id);
    await loadModels(); // Reload list
  } finally {
    setIsDeleting(false);
    setDeleteModalOpen(false);
  }
};
```

