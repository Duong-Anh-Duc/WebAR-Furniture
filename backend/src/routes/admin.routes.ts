import { RequestHandler, Router } from 'express';
import { modelController } from '../controllers';
import { uploadMiddleware } from '../middleware';

const router = Router();

/**
 * Các tuyến đường quản lý mô hình cho admin
 */

// Tải lên mô hình
router.post(
  '/upload',
  uploadMiddleware.single('file') as unknown as RequestHandler,
  modelController.uploadModel.bind(modelController)
);

// Lấy tất cả mô hình
router.get(
  '/',
  modelController.getAllModels.bind(modelController)
);

// Lấy mô hình theo ID
router.get(
  '/:id',
  modelController.getModelById.bind(modelController)
);

// Xóa mô hình
router.delete(
  '/:id',
  modelController.deleteModel.bind(modelController)
);

export default router;
