import {
  Controller,
  Post,
  Get,
  Param,
  ParseUUIDPipe,
  NotFoundException,
  Header,
} from '@nestjs/common';
import { JobsService, JobSnapshot } from './jobs.service';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  async createJob(): Promise<{ id: string }> {
    const job = await this.jobsService.createJob();
    return { id: job.id };
  }

  @Get(':id')
  @Header('Cache-Control', 'no-store')
  async getJob(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<JobSnapshot> {
    const job = await this.jobsService.getJob(id);

    if (!job) {
      throw new NotFoundException(`Job with id ${id} not found`);
    }
    return job;
  }
}
