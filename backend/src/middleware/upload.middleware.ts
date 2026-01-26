import multer from 'multer';
import { config } from '../config';
import { getI18n } from '../i18n';
import { isValidFileType } from '../utils/helpers';

const i18n = getI18n();

// Cấu hình lưu trữ
const storage = multer.memoryStorage();

// Bộ lọc tệp - sử dụng khẳng định kiểu để xử lý tương thích kiểu của multer
const fileFilter = ((
  req: any,
  file: Express.Multer.File,
  cb: (error: Error | null, acceptFile?: boolean) => void
): void => {
  const isValid = isValidFileType(file.originalname, config.upload.allowedFileTypes);
  
  if (isValid) {
    cb(null, true);
  } else {
    cb(new Error(i18n.t('model.invalidFile')));
  }
}) as any;

// Middleware tải lên
export const uploadMiddleware = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.upload.maxFileSize,
  },
});

export default uploadMiddleware;
