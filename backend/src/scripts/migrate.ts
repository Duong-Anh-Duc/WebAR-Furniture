import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

async function migrate() {
  try {
    logger.info('Starting database migration...');

    // Run Prisma migrations
    const { execSync } = require('child_process');
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });

    logger.info('Migration completed successfully');
    process.exit(0);
  } catch (error: any) {
    logger.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

migrate();
