import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'node:path';
import { AppController } from './app.controller.ts';
import { AppService } from './app.service.ts';

const projectRoot = join(import.meta.dirname, '..');

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(projectRoot, 'public'),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
