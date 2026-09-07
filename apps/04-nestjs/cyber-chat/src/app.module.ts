import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ThreadsModule } from './threads/threads.module';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [ThreadsModule, CommentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
