import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { PollModule } from './poll/poll.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PollModule],
  controllers: [AppController],
})
export class AppModule {}
