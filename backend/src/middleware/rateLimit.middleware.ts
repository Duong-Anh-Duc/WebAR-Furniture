import rateLimit from 'express-rate-limit';
import { config } from '../config';
import { getI18n } from '../i18n';

const i18n = getI18n();

export const rateLimitMiddleware = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: {
    success: false,
    message: 'Quá nhiều yêu cầu, vui lòng thử lại sau.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export default rateLimitMiddleware;
