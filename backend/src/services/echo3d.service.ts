import axios, { AxiosInstance } from 'axios';
import FormData from 'form-data';
import { config } from '../config';
import { AppError } from '../middleware';
import { logger } from '../utils/logger';

export interface Echo3DUploadResponse {
  success: boolean;
  db: {
    entries: Array<{
      id: string;
      hologram: {
        storageID: string;
        filename: string;
        type: string;
      };
      additionalData: {
        glbHologramStorageID?: string;
        usdzHologramStorageID?: string;
      };
    }>;
  };
}

export interface Echo3DUploadResult {
  entryId: string;
  glbUrl: string;
  usdzUrl: string | null;
}

export class Echo3DService {
  private client: AxiosInstance;
  private apiKey: string;
  private securityKey: string;

  constructor() {
    this.apiKey = config.echo3d.apiKey;
    this.securityKey = config.echo3d.securityKey;

    if (!this.apiKey || !this.securityKey) {
      throw new Error('Thông tin đăng nhập API echo3D không được cấu hình');
    }

    this.client = axios.create({
      baseURL: config.echo3d.apiUrl,
      timeout: 60000,
    });
  }

  /**
   * Tải lên tệp GLB lên echo3D
   */
  async uploadGLB(file: Express.Multer.File): Promise<Echo3DUploadResult> {
    // TEST MODE - bypass echo3D và trả về fake URLs
    if (process.env.TEST_MODE === 'true') {
      logger.info('TEST MODE: Simulating echo3D upload', {
        filename: file.originalname,
        size: file.size,
      });

      // Tạo fake entry ID dựa trên tên file
      const timestamp = Date.now();
      const entryId = `test-${timestamp}`;
      
      // Fake URLs - sẽ được serve từ /api/models/:id/file endpoint
      const glbUrl = `/api/models/${entryId}/file?format=glb`;
      const usdzUrl = `/api/models/${entryId}/file?format=usdz`;

      logger.info('TEST MODE: Simulated echo3D upload successful', {
        entryId,
        glbUrl,
        usdzUrl,
      });

      return {
        entryId,
        glbUrl,
        usdzUrl,
      };
    }

    try {
      const formData = new FormData();
      formData.append('key', this.apiKey);
      formData.append('secKey', this.securityKey);
      formData.append('target_type', '2'); // BẮT BUỘC: target_type = 2
      formData.append('file_model', file.buffer, {
        filename: file.originalname,
        contentType: file.mimetype,
      });

      logger.info('Uploading to echo3D', {
        filename: file.originalname,
        size: file.size,
      });

      const response = await this.client.post<Echo3DUploadResponse>(
        '/upload',
        formData,
        {
          headers: {
            ...formData.getHeaders(),
          },
        }
      );

      if (!response.data.success) {
        throw new AppError('echo3D upload failed', 502);
      }

      const entry = response.data.db.entries[0];
      if (!entry) {
        throw new AppError('No entry returned from echo3D', 502);
      }

      const entryId = entry.id;
      const glbStorageId = entry.hologram.storageID;
      
      // Xây dựng URL GLB
      const glbUrl = `${config.echo3d.apiUrl}/query?key=${this.apiKey}&secKey=${this.securityKey}&file=${glbStorageId}`;

      // Xây dựng URL USDZ (có thể chưa sẵn sàng ngay)
      let usdzUrl: string | null = null;
      const usdzStorageId = entry.additionalData?.usdzHologramStorageID;
      
      if (usdzStorageId) {
        usdzUrl = `${config.echo3d.apiUrl}/query?key=${this.apiKey}&secKey=${this.securityKey}&file=${usdzStorageId}`;
      } else {
        // USDZ sẽ được chuyển đổi, xây dựng URL dự kiến
        usdzUrl = `${config.echo3d.apiUrl}/query?key=${this.apiKey}&secKey=${this.securityKey}&file=${glbStorageId}.usdz`;
      }

      logger.info('echo3D upload successful', {
        entryId,
        glbUrl,
        usdzUrl,
      });

      return {
        entryId,
        glbUrl,
        usdzUrl,
      };
    } catch (error: any) {
      logger.error('echo3D upload error', {
        message: error.message,
        response: error.response?.data,
      });

      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError(
        `echo3D service error: ${error.message}`,
        502
      );
    }
  }

  /**
   * Kiểm tra xem tệp USDZ có sẵn sàng không
   */
  async checkUsdzReady(usdzUrl: string): Promise<boolean> {
    // TEST MODE - USDZ sẵn sàng ngay (mô phỏng)
    if (process.env.TEST_MODE === 'true') {
      logger.debug('TEST MODE: Simulating USDZ as ready immediately', { usdzUrl });
      return true;
    }

    try {
      const response = await axios.head(usdzUrl, {
        timeout: 10000,
      });
      return response.status === 200;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return false;
      }
      logger.warn('Error checking USDZ readiness', {
        error: error.message,
        url: usdzUrl,
      });
      return false;
    }
  }

  /**
   * Xóa mục từ echo3D
   */
  async deleteEntry(entryId: string): Promise<void> {
    try {
      await this.client.delete('/delete', {
        params: {
          key: this.apiKey,
          secKey: this.securityKey,
          id: entryId,
        },
      });
      logger.info('echo3D entry deleted', { entryId });
    } catch (error: any) {
      logger.error('echo3D delete error', {
        entryId,
        error: error.message,
      });
      throw new AppError('Failed to delete from echo3D', 502);
    }
  }
}

export const echo3dService = new Echo3DService();
export default echo3dService;
