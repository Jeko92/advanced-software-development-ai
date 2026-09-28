import type { JobValue } from '@/lib/Job';
import { JobManager } from '@/lib/JobManager';
import { NextRequest } from 'next/server';

async function resolveWith(
  value: JobValue,
  waitMS: number = 600,
): Promise<JobValue> {
  return new Promise((resolve) => setTimeout(() => resolve(value), waitMS));
}

export async function GET(
  req: NextRequest,
  ctx: RouteContext<'/api/jobs/[id]/long'>,
) {
  const { id } = await ctx.params;
  const current = Number(req.nextUrl.searchParams.get('current')) || 0;
  const manager = JobManager.getInstance();

  if (!manager.hasJob(id)) {
    return new Response(null, {
      status: 404,
    });
  }

  const job = manager.getJob(id)!;

  const currentValue = job.getCurrentValue();

  if (currentValue.value > current) {
    return new Response(JSON.stringify(currentValue));
  }

  const nextValue = await Promise.race([
    job.getNextValue(),
    resolveWith(currentValue),
  ]);

  if (nextValue.value === currentValue.value) {
    return new Response(null, { status: 204 });
  }

  return new Response(JSON.stringify(nextValue));
}
