import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { getI18n } from '../i18n';
import { logger } from '../utils/logger';

const i18n = getI18n();

/**
 * Serve file từ uploads folder
 */
export const serveUploadFile = (req: Request, res: Response): void => {
  const { filename } = req.params;
  
  // Validate filename để tránh path traversal
  if (filename.includes('..') || filename.includes('/')) {
    res.status(400).json({ error: i18n.t('file.invalidFilename') });
    return;
  }

  const filePath = path.join(__dirname, '../../public/uploads', filename);
  
  logger.info('Serving upload file', { filename, filePath });

  try {
    if (!fs.existsSync(filePath)) {
      logger.error('Upload file not found', { filePath });
      res.status(404).json({ error: i18n.t('file.notFound') });
      return;
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
    res.status(500).json({ error: i18n.t('file.failedToServe') });
  }
};
