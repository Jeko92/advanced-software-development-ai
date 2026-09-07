import { Module } from '@nestjs/common';
import { ConcertsService } from './concerts.service';
import { ConcertsController } from './concerts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Concert } from './entities/concert.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Concert])],
  providers: [ConcertsService],
  controllers: [ConcertsController],
})
export class ConcertsModule {}
