import { v2 as cloudinary } from 'cloudinary';
import { config } from '../config';
import { AppError } from '../middleware';
import { logger } from '../utils/logger';

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  original_filename: string;
  resource_type: string;
  format: string;
  bytes: number;
}

export class CloudinaryService {
  constructor() {
    // Configure Cloudinary
    cloudinary.config({
      cloud_name: config.cloudinary.cloudName,
      api_key: config.cloudinary.apiKey,
      api_secret: config.cloudinary.apiSecret,
    });

    // Validate configuration
    if (!config.cloudinary.cloudName || !config.cloudinary.apiKey || !config.cloudinary.apiSecret) {
      logger.warn('Cloudinary credentials not fully configured. Upload functionality may be limited.');
    }
  }

  /**
   * Upload GLB file to Cloudinary
   */
  async uploadGLB(file: Express.Multer.File, options: { folder?: string; public_id?: string } = {}): Promise<CloudinaryUploadResult> {
    try {
      const uploadOptions = {
        folder: options.folder || 'webar-furniture/models',
        public_id: options.public_id ? `${options.public_id}.glb` : undefined,
        resource_type: 'raw' as const, // For non-image files like GLB
        use_filename: true,
        unique_filename: !options.public_id, // Use unique filename if no public_id specified
      };

      logger.info('Uploading GLB to Cloudinary', {
        originalname: file.originalname,
        size: file.size,
        folder: uploadOptions.folder,
      });

      const result = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          uploadOptions,
          (error, result) => {
            if (error) {
              logger.error('Cloudinary upload error', { error: error.message });
              reject(new AppError(`Upload failed: ${error.message}`, 500));
            } else if (result) {
              resolve(result as CloudinaryUploadResult);
            } else {
              reject(new AppError('Upload failed: No result returned', 500));
            }
          }
        ).end(file.buffer);
      });

      logger.info('GLB uploaded successfully to Cloudinary', {
        public_id: result.public_id,
        url: result.secure_url,
        bytes: result.bytes,
      });

      return result;
    } catch (error) {
      logger.error('Failed to upload GLB to Cloudinary', { error });
      throw new AppError('Failed to upload file to cloud storage', 500);
    }
  }

  /**
   * Upload USDZ file to Cloudinary
   */
  async uploadUSDZ(filePath: string, options: { folder?: string; public_id?: string } = {}): Promise<CloudinaryUploadResult> {
    try {
      const uploadOptions = {
        folder: options.folder || 'webar-furniture/usdz',
        public_id: options.public_id ? `${options.public_id}.usdz` : undefined,
        resource_type: 'raw' as const,
        use_filename: true,
        unique_filename: !options.public_id,
      };

      logger.info('Uploading USDZ to Cloudinary', {
        filePath,
        folder: uploadOptions.folder,
      });

      const result = await cloudinary.uploader.upload(filePath, uploadOptions);

      logger.info('USDZ uploaded successfully to Cloudinary', {
        public_id: result.public_id,
        url: result.secure_url,
        bytes: result.bytes,
      });

      return result as CloudinaryUploadResult;
    } catch (error) {
      logger.error('Failed to upload USDZ to Cloudinary', { error });
      throw new AppError('Failed to upload USDZ file to cloud storage', 500);
    }
  }

  /**
   * Delete file from Cloudinary
   */
  async deleteFile(publicId: string, resourceType: 'image' | 'video' | 'raw' = 'raw'): Promise<void> {
    try {
      logger.info('Deleting file from Cloudinary', { publicId, resourceType });

      const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
      
      if (result.result === 'ok') {
        logger.info('File deleted successfully from Cloudinary', { publicId });
      } else {
        logger.warn('File deletion result unclear', { publicId, result: result.result });
      }
    } catch (error) {
      logger.error('Failed to delete file from Cloudinary', { publicId, error });
      // Don't throw error for deletion failures to avoid breaking the main flow
    }
  }

  /**
   * Generate transformation URL for assets
   */
  generateUrl(publicId: string, options: Record<string, any> = {}): string {
    return cloudinary.url(publicId, {
      resource_type: 'raw',
      ...options,
    });
  }

  /**
   * Check if Cloudinary is properly configured
   */
  isConfigured(): boolean {
    return !!(config.cloudinary.cloudName && config.cloudinary.apiKey && config.cloudinary.apiSecret);
  }
}

export const cloudinaryService = new CloudinaryService();