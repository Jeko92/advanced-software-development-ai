import { Module } from '@nestjs/common';
import { ConcertsService } from './concerts.service';
import { ConcertsController } from './concerts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Concert } from './entities/concert.entity';
import { UsersModule } from '../users/users.module';
import { SessionAuthGuard } from '../auth/session/session-auth.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Concert]), UsersModule],
  providers: [ConcertsService, SessionAuthGuard],
  controllers: [ConcertsController],
  exports: [ConcertsService],
})
export class ConcertsModule {}
