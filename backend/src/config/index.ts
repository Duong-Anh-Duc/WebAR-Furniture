import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Máy chủ
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '8000', 10),
  baseUrl: process.env.BASE_URL || 'http://localhost:3000',

  // Cơ sở dữ liệu
  databaseUrl: process.env.DATABASE_URL || '',

  // echo3D
  echo3d: {
    apiKey: process.env.ECHO3D_API_KEY || '',
    securityKey: process.env.ECHO3D_SECURITY_KEY || '',
    apiUrl: process.env.ECHO3D_API_URL || 'https://api.echo3d.com',
  },

  // Tải lên
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10), // 10MB
    allowedFileTypes: (process.env.ALLOWED_FILE_TYPES || '.glb').split(','),
  },

  // Bỏ phiếu
  polling: {
    usdzInterval: parseInt(process.env.USDZ_POLLING_INTERVAL || '15000', 10), // 15 giây
    usdzTimeout: parseInt(process.env.USDZ_POLLING_TIMEOUT || '300000', 10), // 5 phút
  },

  // CORS
  cors: {
    origin: process.env.CORS_ORIGIN 
      ? process.env.CORS_ORIGIN.split(',').map(url => url.trim())
      : ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:3000', 'http://127.0.0.1:5173'],
  },

  // Giới hạn tỷ lệ
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 phút
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },
};

export default config;
