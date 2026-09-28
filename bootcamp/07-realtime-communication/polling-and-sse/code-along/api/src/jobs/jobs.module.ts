import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExportJob } from './entities/export-job.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExportJob])],
  controllers: [JobsController],
  providers: [JobsService],
})
export class JobsModule {}
