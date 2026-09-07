import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'node:path';
import { AppController } from './app.controller';
import { AppService } from './app.service';

const projectRoot = join(__dirname, '..');

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
