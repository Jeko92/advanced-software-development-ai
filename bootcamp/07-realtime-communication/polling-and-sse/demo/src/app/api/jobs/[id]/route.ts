import { JobManager } from '@/lib/JobManager';
import { NextRequest } from 'next/server';

export async function DELETE(
  _req: NextRequest,
  ctx: RouteContext<'/api/jobs/[id]'>,
) {
  const { id } = await ctx.params;
  const manager = JobManager.getInstance();
  manager.clearJob(id);
  return new Response(null, {
    status: 204,
  });
}
