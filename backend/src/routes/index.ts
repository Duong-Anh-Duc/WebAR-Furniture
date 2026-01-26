import { Request, Response, Router } from 'express';
import adminRoutes from './admin.routes';
import modelRoutes from './model.routes';

const router = Router();

// Kiểm tra sức khỏe
router.get('/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

// Tuyến đường quản lý
router.use('/admin/models', adminRoutes);

// Tuyến đường mô hình công khai
router.use('/models', modelRoutes);

export default router;
