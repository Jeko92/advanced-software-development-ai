import { Module } from '@nestjs/common';
import { ConcertsService } from './concerts.service.ts';
import { ConcertsController } from './concerts.controller.ts';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Concert } from './entities/concert.entity.ts';

@Module({
  imports: [TypeOrmModule.forFeature([Concert])],
  providers: [ConcertsService],
  controllers: [ConcertsController],
})
export class ConcertsModule {}
