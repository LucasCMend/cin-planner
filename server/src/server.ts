import { z } from 'zod';
import { app } from './app.js';
import { prisma } from './repositories/prismaClient.js';

const env = z
  .object({ PORT: z.coerce.number().int().positive().default(3333) })
  .parse(process.env);

const server = app.listen(env.PORT, () => {
  console.log(`Server listening on http://localhost:${env.PORT}`);
});

const shutdown = (signal: string) => {
  console.log(`${signal} received, shutting down`);
  server.close(() => {
    void prisma.$disconnect().finally(() => process.exit(0));
  });
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
