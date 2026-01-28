import { MainLayout } from '@/components/layout/MainLayout';
import { ToastContainer } from '@/components/ui/Toast';
import { NotificationProvider } from '@/contexts/NotificationContext';
import '@/locales'; // Khởi tạo i18n
import { AdminUploadPage } from '@/pages/AdminUpload';
import { NotFoundPage } from '@/pages/NotFound';
import { QRListPage } from '@/pages/QRList';
import { ViewerPage } from '@/pages/Viewer';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <NotificationProvider>
      <BrowserRouter>
        <Routes>
          {/* Các tuyến đường của MainLayout */}
          <Route element={<MainLayout />}>
            {/* Tuyến đường Admin */}
            <Route path="/admin/upload" element={<AdminUploadPage />} />
            <Route path="/admin/qr-list" element={<QRListPage />} />
            
            {/* Tuyến đường xem công khai */}
            <Route path="/p/:slug" element={<ViewerPage />} />
            
            {/* Chuyển hướng gốc đến tải lên admin */}
            <Route path="/" element={<Navigate to="/admin/upload" replace />} />
            
            {/* 404 Không tìm thấy */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </NotificationProvider>
  );
}

export default App;
