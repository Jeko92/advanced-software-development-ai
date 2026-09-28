import { JobManager } from '@/lib/JobManager';

export async function POST() {
  const manager = JobManager.getInstance();
  const id = manager.spawnJob();

  return new Response(
    JSON.stringify({
      id,
    }),
    {
      status: 201,
    },
  );
}
