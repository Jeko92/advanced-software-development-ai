import {
  Controller,
  Post,
  Get,
  Param,
  ParseUUIDPipe,
  NotFoundException,
  Header,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { JobsService, JobSnapshot } from './jobs.service';
import { TaskStatus } from './entities/export-job.entity';

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

  @Get(':id/updates')
  async getJobUpdates(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('since') sinceRaw: string | undefined,
    @Req() req: Request,
    @Res({ passthrough: false }) res: Response,
  ): Promise<void> {
    const since = Number(sinceRaw ?? -1);

    const job = await this.jobsService.getJob(id);
    if (!job) {
      res.status(404).json({ error: `Job with id ${id} not found` });
      return;
    }

    if (job.progress > since) {
      res.json(job);
      return;
    }

    const emitter = this.jobsService.getEmitter(id);
    if (!emitter) {
      res.status(204).end();
      return;
    }

    const onProgress = () => {
      clearTimeout(timer);
      void this.jobsService.getJob(id).then((updated) => res.json(updated));
    };
    emitter.once('progress', onProgress);

    const timer = setTimeout(() => {
      emitter.off('progress', onProgress);
      res.status(204).end();
    }, 25_000);

    req.on('close', () => {
      clearTimeout(timer);
      emitter.off('progress', onProgress);
    });
  }

  @Get(':id/stream')
  async streamJob(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: Request,
    @Res({ passthrough: false }) res: Response,
  ): Promise<void> {
    const initialJob = await this.jobsService.getJob(id);
    if (!initialJob) {
      res.status(404).json({ error: `Job with id ${id} not found` });
      return;
    }

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    });
    res.write('retry: 3000\n\n');

    const heartbeat = setInterval(() => res.write(': keep-alive\n\n'), 15_000);

    const emitter = this.jobsService.getEmitter(id);

    const send = (current: JobSnapshot) => {
      res.write(`id: ${current.progress}\n`);
      res.write(`data: ${JSON.stringify(current)}\n\n`);

      if (current.status === TaskStatus.DONE) {
        clearInterval(heartbeat);
        emitter?.off('progress', onProgress);
        res.end();
      }
    };

    const onProgress = () => {
      void this.jobsService.getJob(id).then((updated) => {
        if (updated) send(updated);
      });
    };

    emitter?.on('progress', onProgress);
    send(initialJob);

    req.on('close', () => {
      clearInterval(heartbeat);
      emitter?.off('progress', onProgress);
    });
  }
}
