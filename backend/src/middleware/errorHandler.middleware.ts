import { NextFunction, Request, Response } from 'express';
import { getI18n } from '../i18n';
import { logger } from '../utils/logger';

export interface ApiError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export class AppError extends Error implements ApiError {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const lang = req.headers['accept-language']?.split(',')[0] || 'en';
  const i18n = getI18n(lang as 'en' | 'vi');

  let statusCode = err.statusCode || 500;
  let message = err.message || i18n.t('common.internalServerError');

  // Xử lý các loại lỗi cụ thể
  if (err.name === 'ValidationError') {
    statusCode = 400;
  } else if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    message = i18n.t('common.unauthorized');
  } else if (err.name === 'MulterError') {
    if (err.message.includes('File too large')) {
      statusCode = 413;
      message = i18n.t('model.fileTooLarge', { size: config.upload.maxFileSize / 1024 / 1024 });
    } else {
      statusCode = 400;
      message = err.message;
    }
  }

  // Ghi log lỗi
  logger.error({
    message: err.message,
    statusCode,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Gửi phản hồi lỗi
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

// Xử lý 404
export const notFoundHandler = (req: Request, res: Response): void => {
  const lang = req.headers['accept-language']?.split(',')[0] || 'en';
  const i18n = getI18n(lang as 'en' | 'vi');

  res.status(404).json({
    success: false,
    message: i18n.t('common.notFound'),
  });
};

import { config } from '../config';

// Xử lý lỗi

