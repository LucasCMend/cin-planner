import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';

const connectionString = process.env['DATABASE_URL'];

if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

// Single instance for the whole app. Only repositories import it, so Prisma types stay in this layer.
export const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
