import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ExportJob, TaskStatus } from './entities/export-job.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EventEmitter } from 'node:events';

export type JobSnapshot = {
  status: TaskStatus;
  progress: number;
  downloadUrl: string | undefined;
};

@Injectable()
export class JobsService {
  private readonly emitters = new Map<string, EventEmitter>();

  constructor(
    @InjectRepository(ExportJob)
    private readonly exportJobRepository: Repository<ExportJob>,
  ) {}

  async createJob(): Promise<ExportJob> {
    const initialJob: Partial<ExportJob> = {
      progress: 0,
      status: TaskStatus.RUNNING,
    };
    const job = await this.exportJobRepository.save(initialJob);

    const emitter = new EventEmitter();
    this.emitters.set(job.id, emitter);

    const tick = async (): Promise<void> => {
      job.progress = Math.min(job.progress + 10, 100);

      if (job.progress >= 100) {
        job.status = TaskStatus.DONE;
        job.downloadUrl = `/downloads/${job.id}.csv`;
        clearInterval(interval);

        await this.exportJobRepository.update(job.id, {
          progress: job.progress,
          status: job.status,
          downloadUrl: job.downloadUrl,
        });
        emitter.emit('progress');
        this.emitters.delete(job.id);
        return;
      }

      await this.exportJobRepository.update(job.id, {
        progress: job.progress,
      });
      emitter.emit('progress');
    };

    const interval = setInterval(() => void tick(), 2000);

    return job;
  }

  async getJob(id: string): Promise<JobSnapshot | null> {
    const job = await this.exportJobRepository.findOneBy({ id });
    if (!job) return null;
    return {
      status: job.status,
      progress: job.progress,
      downloadUrl: job.downloadUrl,
    };
  }

  getEmitter(id: string): EventEmitter | undefined {
    return this.emitters.get(id);
  }
}
