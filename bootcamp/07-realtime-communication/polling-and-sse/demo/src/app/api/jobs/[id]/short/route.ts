import { JobManager } from '@/lib/JobManager';
import { NextRequest } from 'next/server';

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<'/api/jobs/[id]/short'>,
) {
  const { id } = await ctx.params;
  const manager = JobManager.getInstance();

  if (!manager.hasJob(id)) {
    return new Response(null, {
      status: 404,
    });
  }

  const job = manager.getJob(id)!;
  const currentValue = job.getCurrentValue();

  return new Response(JSON.stringify(currentValue));
}
