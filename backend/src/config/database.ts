import { PrismaClient } from '@prisma/client';
import { getI18n } from '../i18n';
import { logger } from '../utils/logger';

const i18n = getI18n();

// Initialize Prisma Client with database URL from .env
const prismaClient = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'file:./dev.db',
    },
  },
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

export const prisma = prismaClient;

export const connectDatabase = async (): Promise<void> => {
  try {
    await prisma.$connect();
    logger.info(i18n.t('server.dbConnected'));
  } catch (error: any) {
    logger.error(i18n.t('server.dbError', { error: error.message }));
    process.exit(1);
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  await prisma.$disconnect();
};

export default prisma;
