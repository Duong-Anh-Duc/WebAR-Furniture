import { NextFunction, Request, Response } from 'express';
import { ModelFormatter } from '../formatters';
import { getI18n } from '../i18n';
import { AppError } from '../middleware';
import { modelService } from '../services';

export class ModelController {
  /**
   * Tải lên mô hình (Admin)
   * POST /api/admin/models/upload
   */
  async uploadModel(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const lang = req.headers['accept-language']?.split(',')[0] || 'en';
      const i18n = getI18n(lang as 'en' | 'vi');

      // Kiểm tra xem tệp có tồn tại không
      if (!req.file) {
        throw new AppError(i18n.t('model.noFile'), 400);
      }

      const { name } = req.body;

      // Tạo mô hình
      const model = await modelService.createModel({
        name,
        file: req.file,
      });

      const formatted = ModelFormatter.formatModel(model as any);

      res.status(201).json({
        success: true,
        message: i18n.t('model.uploadSuccess'),
        data: formatted,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lấy mô hình theo slug (Công khai)
   * GET /api/models/:slug
   */
  async getModelBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const lang = req.headers['accept-language']?.split(',')[0] || 'en';
      const i18n = getI18n(lang as 'en' | 'vi');

      const { slug } = req.params;
      console.log('🔍 getModelBySlug called with slug:', slug);

      const model = await modelService.getModelBySlug(slug);
      console.log('📦 Model retrieved from service:', model);

      if (!model) {
        console.log('❌ Model not found for slug:', slug);
        throw new AppError(i18n.t('model.notFound'), 404);
      }

      const formatted = ModelFormatter.formatPublicModel(model);
      console.log('✅ Model formatted successfully:', formatted);

      res.json({
        success: true,
        data: formatted,
      });
    } catch (error) {
      console.error('🚨 Error in getModelBySlug:', error);
      next(error);
    }
  }

  /**
   * Lấy tất cả mô hình (Admin)
   * GET /api/admin/models
   */
  async getAllModels(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const models = await modelService.getAllModels();
      const formatted = ModelFormatter.formatModels(models);

      res.json({
        success: true,
        data: formatted,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lấy mô hình theo ID (Admin)
   * GET /api/admin/models/:id
   */
  async getModelById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const lang = req.headers['accept-language']?.split(',')[0] || 'en';
      const i18n = getI18n(lang as 'en' | 'vi');

      const { id } = req.params;

      const model = await modelService.getModelById(id);

      if (!model) {
        throw new AppError(i18n.t('model.notFound'), 404);
      }

      const formatted = ModelFormatter.formatModel(model);

      res.json({
        success: true,
        data: formatted,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Xóa mô hình (Admin)
   * DELETE /api/admin/models/:id
   */
  async deleteModel(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const lang = req.headers['accept-language']?.split(',')[0] || 'en';
      const i18n = getI18n(lang as 'en' | 'vi');

      const { id } = req.params;

      await modelService.deleteModel(id);

      res.json({
        success: true,
        message: i18n.t('model.deleteSuccess'),
      });
    } catch (error) {
      next(error);
    }
  }
}

export const modelController = new ModelController();
export default modelController;
