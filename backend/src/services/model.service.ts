import { Model } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { config } from '../config';
import { prisma } from '../config/database';
import { getI18n } from '../i18n';
import { AppError } from '../middleware';
import { convertGlbToUsdz } from '../utils/convertUsdz';
import { generateSlug } from '../utils/helpers';
import { logger } from '../utils/logger';
import { cloudinaryService } from './cloudinary.service';

const i18n = getI18n();

export interface CreateModelInput {
  name?: string;
  file: Express.Multer.File;
}

export interface CreateModelResult {
  id: string;
  name: string | null;
  slug: string;
  cloudinaryId: string;
  glbUrl: string;
  usdzUrl: string | null;
  usdzReady: boolean;
  status: string;
  viewerUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export class ModelService {
  /**
   * Tạo mô hình mới bằng cách upload lên Cloudinary
   */
  async createModel(input: CreateModelInput): Promise<CreateModelResult> {
    const { name, file } = input;

    // Tạo slug trước để dùng làm file ID
    const slug = generateSlug(name || file.originalname.replace(/\.[^/.]+$/, ''));

    logger.info('Starting model upload to Cloudinary', { name, filename: file.originalname });
    
    try {
      // Upload GLB to Cloudinary
      const uploadResult = await cloudinaryService.uploadGLB(file, {
        folder: 'webar-furniture/models',
        public_id: slug,
      });

      logger.info('GLB uploaded to Cloudinary successfully', {
        publicId: uploadResult.public_id,
        url: uploadResult.secure_url,
      });

      // Create model in database
      const model = await prisma.model.create({
        data: {
          name: name || null,
          slug,
          echoEntryId: uploadResult.public_id, // Using public_id as identifier
          glbUrl: uploadResult.secure_url,
          usdzUrl: null,
          usdzReady: false,
          status: 'converting',
        },
      });

      logger.info(i18n.t('model.created'), { modelId: model.id, slug: model.slug });

      // Start USDZ conversion process
      this.startUsdzConversion(model.id);

      return this.formatModelResult(model);
    } catch (error: any) {
      logger.error('Failed to create model', { error: error.message, name });
      throw new AppError(i18n.t('model.uploadFailed'), 400, error.message);
    }
  }

  /**
   * Lấy danh sách tất cả models
   */
  async getAllModels(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<{ models: CreateModelResult[]; total: number; totalPages: number }> {
    const skip = (page - 1) * limit;
    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { slug: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [models, total] = await Promise.all([
      prisma.model.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.model.count({ where }),
    ]);

    return {
      models: models.map((model) => this.formatModelResult(model)),
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Lấy model theo ID
   */
  async getModelById(id: string): Promise<Model | null> {
    return prisma.model.findUnique({
      where: { id },
    });
  }

  /**
   * Lấy model theo slug
   */
  async getModelBySlug(slug: string): Promise<CreateModelResult | null> {
    console.log('🔎 getModelBySlug service called with slug:', slug);
    const model = await prisma.model.findUnique({
      where: { slug },
    });

    if (model) {
      console.log('✅ Model found in database:', model);
      return this.formatModelResult(model);
    } else {
      console.log('❌ No model found in database for slug:', slug);
      return null;
    }
  }

  /**
   * Xóa model
   */
  async deleteModel(id: string): Promise<void> {
    const model = await this.getModelById(id);

    if (!model) {
      throw new AppError(i18n.t('model.notFound'), 404);
    }

    try {
      // Delete from Cloudinary
      await cloudinaryService.deleteFile(model.echoEntryId);
      
      // If USDZ exists, delete it too
      if (model.usdzUrl) {
        const usdzPublicId = `${model.slug}_usdz`;
        await cloudinaryService.deleteFile(usdzPublicId);
      }

      logger.info('Files deleted from Cloudinary successfully', { modelId: id });
    } catch (error: any) {
      logger.error('Failed to delete files from Cloudinary', {
        modelId: id,
        error: error.message,
      });
    }

    // Delete from database
    await prisma.model.delete({
      where: { id },
    });

    logger.info(i18n.t('model.deleted'), { modelId: id });
  }

  /**
   * Bắt đầu quá trình convert USDZ bằng Blender
   */
  private async startUsdzConversion(modelId: string): Promise<void> {
    logger.info('Starting USDZ conversion with Blender', { modelId });

    try {
      const model = await this.getModelById(modelId);
      
      if (!model) {
        logger.error('Model not found for USDZ conversion', { modelId });
        return;
      }

      if (!model.glbUrl) {
        logger.error('GLB URL not found for model', { modelId });
        return;
      }

      // Create temp directory for conversion
      const tempDir = path.join(__dirname, '../../temp');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      const tempGlbPath = path.join(tempDir, `${model.slug}_temp.glb`);
      const tempUsdzPath = path.join(tempDir, `${model.slug}_temp.usdz`);

      // Download GLB from Cloudinary
      logger.info('Downloading GLB from Cloudinary', { glbUrl: model.glbUrl });
      const response = await fetch(model.glbUrl);
      const buffer = await response.arrayBuffer();
      fs.writeFileSync(tempGlbPath, Buffer.from(buffer));

      // Convert GLB to USDZ using Blender
      logger.info('Converting GLB to USDZ', { tempGlbPath, tempUsdzPath });
      const conversionSuccess = await convertGlbToUsdz(tempGlbPath, tempUsdzPath);

      if (!conversionSuccess || !fs.existsSync(tempUsdzPath)) {
        logger.warn('Blender conversion failed or skipped - marking model as ready without USDZ', {
          modelId,
          conversionSuccess,
          fileExists: fs.existsSync(tempUsdzPath),
        });

        // Update model status to ready without USDZ
        await prisma.model.update({
          where: { id: modelId },
          data: {
            usdzUrl: null,
            usdzReady: false,
            status: 'ready',
          },
        });

        // Clean up temp files
        if (fs.existsSync(tempGlbPath)) fs.unlinkSync(tempGlbPath);
        if (fs.existsSync(tempUsdzPath)) fs.unlinkSync(tempUsdzPath);
        return;
      }

      // Delete old USDZ file if exists (remove invalid placeholder)
      if (model.usdzUrl) {
        try {
          await cloudinaryService.deleteFile(`webar-furniture/usdz/${model.slug}`);
          logger.info('Deleted old USDZ file', { modelId });
        } catch (deleteError: any) {
          logger.warn('Failed to delete old USDZ file', {
            modelId,
            error: deleteError.message,
          });
        }
      }

      // Upload USDZ to Cloudinary
      logger.info('Uploading USDZ to Cloudinary', { tempUsdzPath });
      const usdzUploadResult = await cloudinaryService.uploadUSDZ(tempUsdzPath, {
        folder: 'webar-furniture/usdz',
        public_id: model.slug,
      });

      logger.info('USDZ uploaded to Cloudinary successfully', {
        modelId,
        publicId: usdzUploadResult.public_id,
        url: usdzUploadResult.secure_url,
      });

      // Update model with USDZ URL
      await prisma.model.update({
        where: { id: modelId },
        data: {
          usdzUrl: usdzUploadResult.secure_url,
          usdzReady: true,
          status: 'ready',
        },
      });

      // Clean up temp files
      if (fs.existsSync(tempGlbPath)) fs.unlinkSync(tempGlbPath);
      if (fs.existsSync(tempUsdzPath)) fs.unlinkSync(tempUsdzPath);

      logger.info('USDZ conversion and upload completed successfully', { modelId });

    } catch (error: any) {
      logger.error('Failed to convert and upload USDZ', {
        modelId,
        error: error.message,
      });

      await prisma.model.update({
        where: { id: modelId },
        data: { status: 'failed' },
      });
    }
  }

  /**
   * Định dạng kết quả mô hình với URL trình xem
   */
  private formatModelResult(model: Model): CreateModelResult {
    return {
      ...model,
      cloudinaryId: model.echoEntryId, // Map echoEntryId to cloudinaryId for backward compatibility
      viewerUrl: `${config.baseUrl}/p/${model.slug}`,
    };
  }
}

export const modelService = new ModelService();
export default modelService;
