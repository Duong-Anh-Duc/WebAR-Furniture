import { Model } from '@prisma/client';
import { config } from '../config';

export interface FormattedModel {
  id: string;
  name: string | null;
  slug: string;
  glbUrl: string;
  usdzUrl: string | null;
  usdzReady: boolean;
  status: string;
  viewerUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PublicModelData {
  id: string;
  name: string | null;
  slug: string;
  glbUrl: string;
  usdzUrl: string | null;
  usdzReady: boolean;
  status: string;
}

export class ModelFormatter {
  /**
   * Convert relative URL thành absolute URL cho API access
   */
  private static makeAbsoluteUrl(url: string): string {
    // Nếu đã là absolute URL, trả về ngay
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // URL từ database đã có /api, chỉ cần thêm domain:port
    // Từ: /api/models/test-xxx/file?format=glb
    // Thành: http://172.20.10.5:8000/api/models/test-xxx/file?format=glb
    const apiBaseUrl = config.baseUrl.replace(':3000', ':8000');
    return `${apiBaseUrl}${url}`;
  }
  /**
   * Định dạng mô hình cho phản hồi admin
   */
  static formatModel(model: Model): FormattedModel {
    return {
      id: model.id,
      name: model.name,
      slug: model.slug,
      glbUrl: this.makeAbsoluteUrl(model.glbUrl),
      usdzUrl: model.usdzUrl ? this.makeAbsoluteUrl(model.usdzUrl) : null,
      usdzReady: model.usdzReady,
      status: model.status,
      viewerUrl: `${config.baseUrl}/p/${model.slug}`,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };
  }

  /**
   * Định dạng mô hình cho trình xem công khai (không có dữ liệu nhạy cảm)
   */
  static formatPublicModel(model: Model): PublicModelData {
    return {
      id: model.id,
      name: model.name,
      slug: model.slug,
      glbUrl: this.makeAbsoluteUrl(model.glbUrl),
      usdzUrl: model.usdzUrl ? this.makeAbsoluteUrl(model.usdzUrl) : null,
      usdzReady: model.usdzReady,
      status: model.status,
    };
  }

  /**
   * Format multiple models
   */
  static formatModels(models: Model[]): FormattedModel[] {
    return models.map((model) => this.formatModel(model));
  }
}

export default ModelFormatter;
