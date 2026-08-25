import { NestFactory } from '@nestjs/core';
import { join } from 'node:path';
import nunjucks from 'nunjucks';
import { AppModule } from './app.module.ts';

const projectRoot = join(import.meta.dirname, '..');
const viewsDir = join(projectRoot, 'src', 'views');
const port = process.env['PORT'] ?? 3232;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const env = nunjucks.configure(viewsDir, {
    autoescape: true,
  });

  env.addGlobal('currentYear', () => new Date().getFullYear());

  await app.listen(port);
  console.log(`Server is running on port ${await app.getUrl()}`);
}

void bootstrap();
