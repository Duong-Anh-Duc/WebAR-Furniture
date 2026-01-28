import cors from 'cors';
import express, { Application } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { config } from './config';
import { connectDatabase } from './config/database';
import { getI18n } from './i18n';
import { errorHandler, notFoundHandler, rateLimitMiddleware } from './middleware';
import routes from './routes';
import { logger } from './utils/logger';

const i18n = getI18n();

class Server {
  private app: Application;

  constructor() {
    this.app = express();
    
    // Trust proxy cho deployment trên cloud (Render, Heroku, etc.)
    // Chỉ enable trong production hoặc khi có biến môi trường TRUST_PROXY
    if (config.nodeEnv === 'production' || process.env.TRUST_PROXY === 'true') {
      this.app.set('trust proxy', true);
      logger.info('Trust proxy enabled for cloud deployment');
    }
    
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    // CORS - Cho phép tất cả origins (phải đặt TRƯỚC helmet)
    this.app.use(
      cors({
        origin: '*', // Cho phép tất cả domain
        credentials: false,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        exposedHeaders: ['Content-Type', 'Content-Length'],
      })
    );

    // Bảo mật (sau CORS để không block)
    this.app.use(helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' }, // Cho phép CORS access
    }));

    // Phân tích body
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // Ghi log
    if (config.nodeEnv === 'development') {
      this.app.use(morgan('dev'));
    }

    // Serve static files từ public/uploads với `/api/uploads` prefix
    this.app.use('/api/uploads', express.static(path.join(__dirname, '../public/uploads'), {
      maxAge: '1h', // Cache 1 giờ
      etag: false, // Disable etag để avoid 304 Not Modified
      setHeaders: (res) => {
        res.set('Content-Type', 'model/gltf-binary'); // GLB files
      }
    }));

    // Giới hạn tỷ lệ
    this.app.use('/api', rateLimitMiddleware);
  }

  private initializeRoutes(): void {
    // Các tuyến đường API
    this.app.use('/api', routes);

    // Tuyến đường gốc
    this.app.get('/', (req, res) => {
      res.json({
        success: true,
        message: 'WebAR Furniture API',
        version: '1.0.0',
        endpoints: {
          health: '/api/health',
          upload: 'POST /api/admin/models/upload',
          viewer: 'GET /api/models/:slug',
          adminModels: 'GET /api/admin/models',
        },
      });
    });
  }

  private initializeErrorHandling(): void {
    // Xử lý 404
    this.app.use(notFoundHandler);

    // Xử lý lỗi toàn cầu
    this.app.use(errorHandler);
  }

  public async start(): Promise<void> {
    try {
      // Kết nối cơ sở dữ liệu
      await connectDatabase();

      // Khởi động máy chủ
      this.app.listen(config.port, () => {
        logger.info(i18n.t('server.started', { port: config.port }));
        logger.info(`Environment: ${config.nodeEnv}`);
        logger.info(`Base URL: ${config.baseUrl}`);
      });
    } catch (error: any) {
      logger.error(i18n.t('server.error', { error: error.message }));
      process.exit(1);
    }
  }
}

// Tạo và khởi động máy chủ
const server = new Server();
server.start();

// Xử lý các ngoại lệ không bắt được
process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: any) => {
  logger.error('Unhandled Rejection:', reason);
  process.exit(1);
});

export default server;
