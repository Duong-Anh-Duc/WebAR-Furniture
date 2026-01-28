import { Router } from 'express';
import { serveUploadFile } from '../config';
import { modelController } from '../controllers';

const router = Router();

/**
 * Các tuyến đường công khai cho trình xem
 */

// Serve file thực từ disk: /api/uploads/{filename}
router.get('/uploads/:filename', serveUploadFile);

// Lấy mô hình theo slug
router.get(
  '/:slug',
  modelController.getModelBySlug.bind(modelController)
);

export default router;
