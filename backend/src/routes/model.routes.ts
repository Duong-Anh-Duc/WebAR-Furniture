import { Request, Response, Router } from 'express';
import fs from 'fs';
import path from 'path';
import { modelController } from '../controllers';
import { logger } from '../utils/logger';

const router = Router();

/**
 * Các tuyến đường công khai cho trình xem
 */

// Serve file thực từ disk: /api/uploads/{filename}
router.get('/uploads/:filename', (req: Request, res: Response) => {
  const { filename } = req.params;
  
  // Validate filename để tránh path traversal
  if (filename.includes('..') || filename.includes('/')) {
    return res.status(400).json({ error: 'Invalid filename' });
  }

  const filePath = path.join(__dirname, '../../public/uploads', filename);
  
  logger.info('Serving upload file', { filename, filePath });

  try {
    if (!fs.existsSync(filePath)) {
      logger.error('Upload file not found', { filePath });
      return res.status(404).json({ error: 'File not found' });
    }

    const fileContent = fs.readFileSync(filePath);
    
    // Determine content type based on extension
    const ext = path.extname(filename).toLowerCase();
    const contentType = ext === '.usdz' ? 'model/vnd.usdz+zip' : 'model/gltf-binary';
    
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
    res.setHeader('Content-Length', fileContent.length);
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    res.send(fileContent);
  } catch (error: any) {
    logger.error('Error serving upload file', { error: error.message });
    res.status(500).json({ error: 'Failed to serve file' });
  }
});

// TEST MODE - Phục vụ file test (GLB và USDZ) - phải đặt trước /:slug
if (process.env.TEST_MODE === 'true') {
  // Match /test-{number}/file pattern
  router.get('/:id/file', (req: Request, res: Response, next) => {
    const { id } = req.params;
    
    // Chỉ serve nếu id bắt đầu với 'test-'
    if (!id.startsWith('test-')) {
      return next();
    }

    const format = req.query.format || 'glb';

    logger.info('TEST MODE: Serving test file', { id, format });

    try {
      // Serve sample GLB file từ public/samples/
      const filePath = path.join(__dirname, '../../public/samples/Armchair.glb');
      
      if (!fs.existsSync(filePath)) {
        logger.error('Sample GLB file not found', { filePath });
        return res.status(404).json({ error: 'Model file not found' });
      }

      const fileContent = fs.readFileSync(filePath);
      
      res.setHeader('Content-Type', 'model/gltf-binary');
      res.setHeader('Content-Disposition', `inline; filename="model.${format}"`);
      res.setHeader('Content-Length', fileContent.length);
      res.setHeader('Cache-Control', 'public, max-age=3600');
      
      res.send(fileContent);
    } catch (error: any) {
      logger.error('Error serving test file', { error: error.message });
      res.status(500).json({ error: 'Failed to serve model file' });
    }
  });
}

// Lấy mô hình theo slug
router.get(
  '/:slug',
  modelController.getModelBySlug.bind(modelController)
);

export default router;
