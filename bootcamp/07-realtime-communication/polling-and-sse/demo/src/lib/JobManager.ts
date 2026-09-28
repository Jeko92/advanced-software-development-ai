import { Job } from './Job';

export class JobManager {
  private constructor() {}
  private static instance?: JobManager;
  static getInstance() {
    this.instance ??= new JobManager();
    return this.instance;
  }

  private jobs = new Map<string, Job>();

  spawnJob() {
    const job = new Job();
    const id = crypto.randomUUID();
    this.jobs.set(id, job);
    job.run();
    return id;
  }

  hasJob(id: string) {
    return this.jobs.has(id);
  }

  getJob(id: string) {
    return this.jobs.get(id);
  }

  clearJob(id: string) {
    this.jobs.get(id)?.abort();
    this.jobs.delete(id);
  }
}
