import crypto from 'crypto';

/**
 * Tạo slug duy nhất từ tên hoặc chuỗi ngẫu nhiên
 */
export const generateSlug = (name?: string): string => {
  if (name) {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    return `${slug}-${crypto.randomBytes(4).toString('hex')}`;
  }
  return crypto.randomBytes(8).toString('hex');
};

/**
 * Lấy phần mở rộng tệp từ tên tệp
 */
export const getFileExtension = (filename: string): string => {
  return filename.slice(filename.lastIndexOf('.')).toLowerCase();
};

/**
 * Xác thực phần mở rộng tệp
 */
export const isValidFileType = (filename: string, allowedTypes: string[]): boolean => {
  const ext = getFileExtension(filename);
  return allowedTypes.includes(ext);
};

/**
 * Định dạng kích thước tệp thành định dạng dễ đọc
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Trợ giúp ngủ/trì hoãn
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Kiểm tra xem URL có thể truy cập không
 */
export const isUrlAccessible = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
};

/**
 * Hàm thử lại với backoff theo cấp số nhân
 */
export const retry = async <T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) throw error;
    await sleep(delay);
    return retry(fn, retries - 1, delay * 2);
  }
};
