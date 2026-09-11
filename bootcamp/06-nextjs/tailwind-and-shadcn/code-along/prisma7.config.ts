import 'dotenv/config';
import { defineConfig } from 'prisma/config';
import { getDatabaseUrl } from './lib/get-database-url';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: getDatabaseUrl(),
  },
});
