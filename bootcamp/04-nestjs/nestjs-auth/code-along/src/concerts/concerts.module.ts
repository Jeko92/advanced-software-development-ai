import { Module } from '@nestjs/common';
import { ConcertsService } from './concerts.service.ts';
import { ConcertsController } from './concerts.controller.ts';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Concert } from './entities/concert.entity.ts';
import { UsersModule } from '../users/users.module.ts';
import { SessionAuthGuard } from '../auth/session/session-auth.guard.ts';

@Module({
  imports: [TypeOrmModule.forFeature([Concert]), UsersModule],
  providers: [ConcertsService, SessionAuthGuard],
  controllers: [ConcertsController],
  exports: [ConcertsService],
})
export class ConcertsModule {}
