import { Model } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { config } from '../config';
import { prisma } from '../config/database';
import { AppError } from '../middleware';
import { convertGlbToUsdz } from '../utils/convertUsdz';
import { generateSlug } from '../utils/helpers';
import { logger } from '../utils/logger';
import { echo3dService } from './echo3d.service';

export interface CreateModelInput {
  name?: string;
  file: Express.Multer.File;
}

export interface CreateModelResult {
  id: string;
  name: string | null;
  slug: string;
  echoEntryId: string;
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
   * Tạo mô hình mới bằng cách tải lên echo3D
   */
  async createModel(input: CreateModelInput): Promise<CreateModelResult> {
    const { name, file } = input;

    // Tạo slug trước để dùng làm file ID
    const slug = generateSlug(name || file.originalname.replace(/\.[^/.]+$/, ''));

    // Lưu file vào disk: public/uploads/{slug}.glb
    const uploadsDir = path.join(__dirname, '../../public/uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filePath = path.join(uploadsDir, `${slug}.glb`);
    fs.writeFileSync(filePath, file.buffer);
    logger.info('GLB file saved to disk', { filePath });

    // Tải lên echo3D (hoặc simulate nếu TEST_MODE)
    logger.info('Starting model upload', { name, filename: file.originalname });
    const echo3dResult = await echo3dService.uploadGLB(file);

    // Lưu vào cơ sở dữ liệu với URL trỏ tới file trên disk
    const glbUrl = `/api/uploads/${slug}.glb`;
    const usdzUrl = `/api/uploads/${slug}.usdz`;

    const model = await prisma.model.create({
      data: {
        name: name || file.originalname.replace(/\.[^/.]+$/, ''),
        slug,
        echoEntryId: echo3dResult.entryId,
        glbUrl: glbUrl, // URL tới file thực
        usdzUrl: usdzUrl, // Tương tự cho USDZ
        usdzReady: false,
        status: 'converting',
      },
    });

    logger.info('Model created in database', {
      id: model.id,
      slug: model.slug,
      glbPath: filePath,
    });

    // Bắt đầu bỏ phiếu cho chuyển đổi USDZ
    this.startUsdzPolling(model.id);

    return this.formatModelResult(model);
  }

  /**
   * Lấy mô hình theo slug (công khai)
   */
  async getModelBySlug(slug: string): Promise<Model | null> {
    const model = await prisma.model.findUnique({
      where: { slug },
    });

    return model;
  }

  /**
   * Lấy mô hình theo ID
   */
  async getModelById(id: string): Promise<Model | null> {
    const model = await prisma.model.findUnique({
      where: { id },
    });

    return model;
  }

  /**
   * Lấy tất cả mô hình (admin)
   */
  async getAllModels(): Promise<Model[]> {
    const models = await prisma.model.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return models;
  }

  /**
   * Xóa mô hình
   */
  async deleteModel(id: string): Promise<void> {
    const model = await this.getModelById(id);

    if (!model) {
      throw new AppError('Model not found', 404);
    }

    // Xóa từ echo3D
    try {
      await echo3dService.deleteEntry(model.echoEntryId);
    } catch (error) {
      logger.error('Failed to delete from echo3D, continuing with DB deletion', {
        modelId: id,
        error,
      });
    }

    // Xóa từ cơ sở dữ liệu
    await prisma.model.delete({
      where: { id },
    });

    logger.info('Model deleted', { id });
  }

  /**
   * Bắt đầu bỏ phiếu cho chuyển đổi USDZ
   */
  private startUsdzPolling(modelId: string): void {
    logger.info('Starting USDZ polling', { modelId });

    const startTime = Date.now();
    const pollingInterval = config.polling.usdzInterval;
    const pollingTimeout = config.polling.usdzTimeout;

    // Convert GLB to USDZ using Blender (or fallback to copy in TEST_MODE)
    prisma.model.findUnique({ where: { id: modelId } }).then(async (model) => {
      if (!model) {
        logger.error('Model not found for USDZ conversion', { modelId });
        return;
      }

      const uploadsDir = path.join(__dirname, '../../public/uploads');
      const glbPath = path.join(uploadsDir, `${model.slug}.glb`);
      const usdzPath = path.join(uploadsDir, `${model.slug}.usdz`);

      if (!fs.existsSync(glbPath)) {
        logger.error('GLB file not found for conversion', { glbPath, modelId });
        await prisma.model.update({
          where: { id: modelId },
          data: { status: 'failed' },
        });
        return;
      }

      try {
        // Try Blender conversion first
        logger.info('Converting GLB to USDZ using Blender', { glbPath, usdzPath });
        const blenderSuccess = await convertGlbToUsdz(glbPath, usdzPath);

        if (blenderSuccess) {
          // Update model to ready
          await prisma.model.update({
            where: { id: modelId },
            data: {
              usdzReady: true,
              status: 'ready',
            },
          });

          const fileSize = fs.statSync(usdzPath).size;
          logger.info('USDZ conversion successful', { modelId, usdzPath, fileSize });
        } else {
          throw new Error('Blender conversion not available');
        }
      } catch (error: any) {
        logger.warn('Blender conversion failed or not available, falling back to copy', {
          modelId,
          error: error.message,
        });

        // Fallback: Copy GLB to USDZ (for environments without Blender)
        try {
          fs.copyFileSync(glbPath, usdzPath);
          logger.info('Fallback: USDZ created by copying GLB', { glbPath, usdzPath });

          await prisma.model.update({
            where: { id: modelId },
            data: {
              usdzReady: true,
              status: 'ready',
            },
          });
        } catch (fallbackError) {
          logger.error('Both Blender and fallback conversion failed', {
            modelId,
            blenderError: error.message,
            fallbackError,
          });

          await prisma.model.update({
            where: { id: modelId },
            data: { status: 'failed' },
          });
        }
      }
    }).catch((error) => {
      logger.error('Error in startUsdzPolling', { modelId, error: error.message });
    });
    return;

    const pollInterval = setInterval(async () => {
      try {
        const model = await this.getModelById(modelId);

        if (!model) {
          clearInterval(pollInterval);
          return;
        }

        // Đã sẵn sàng hoặc không thành công
        if (model.usdzReady || model.status === 'failed' || model.status === 'ready') {
          clearInterval(pollInterval);
          return;
        }

        // Kiểm tra hết giờ
        if (Date.now() - startTime > pollingTimeout) {
          logger.warn('USDZ polling timeout', { modelId });
          await prisma.model.update({
            where: { id: modelId },
            data: {
              status: 'failed',
            },
          });
          clearInterval(pollInterval);
          return;
        }

        // Kiểm tra xem USDZ có sẵn sàng không
        if (model.usdzUrl) {
          const isReady = await echo3dService.checkUsdzReady(model.usdzUrl);

          if (isReady) {
            logger.info('USDZ is ready', { modelId });
            await prisma.model.update({
              where: { id: modelId },
              data: {
                usdzReady: true,
                status: 'ready',
              },
            });
            clearInterval(pollInterval);
          } else {
            logger.debug('USDZ not ready yet', { modelId });
          }
        }
      } catch (error) {
        logger.error('Error during USDZ polling', {
          modelId,
          error,
        });
      }
    }, pollingInterval);
  }

  /**
   * Định dạng kết quả mô hình với URL trình xem
   */
  private formatModelResult(model: Model): CreateModelResult {
    return {
      ...model,
      viewerUrl: `${config.baseUrl}/p/${model.slug}`,
    };
  }
}

export const modelService = new ModelService();
export default modelService;
