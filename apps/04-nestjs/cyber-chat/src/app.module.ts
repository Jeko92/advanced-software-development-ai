import { Module } from '@nestjs/common';
import { AppController } from './app.controller.ts';
import { AppService } from './app.service.ts';
import { ThreadsModule } from './threads/threads.module.ts';
import { CommentsModule } from './comments/comments.module.ts';

@Module({
  imports: [ThreadsModule, CommentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
