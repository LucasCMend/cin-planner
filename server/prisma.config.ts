import { defineConfig } from 'prisma/config';

// Prisma 7 does not load .env on its own. Node 22 can, without a dotenv dependency.
try {
  process.loadEnvFile('../.env');
} catch {
  // No .env file: DATABASE_URL must already be in the environment (CI, production).
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: { path: 'prisma/migrations' },
  datasource: { url: process.env['DATABASE_URL'] ?? '' },
});
