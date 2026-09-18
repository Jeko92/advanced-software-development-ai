import type { JobValue } from '@/lib/Job';
import { JobManager } from '@/lib/JobManager';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

const DROP_AFTER = 0;

export async function GET(
  req: NextRequest,
  ctx: RouteContext<'/api/jobs/[id]/sse'>,
) {
  const { id } = await ctx.params;

  const manager = JobManager.getInstance();

  if (!manager.hasJob(id)) {
    return new Response(null, {
      status: 404,
    });
  }
  const lastEventId = Number(req.headers.get('Last-Event-ID') || 0);
  const job = manager.getJob(id)!;

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      let closed = false;
      function finish() {
        if (closed) return;
        closed = true;
        // clearInterval(heartbeat);
        unsubscribe();
        controller.close();
        console.log('cleaned up');
      }

      function writeToStream(message: string) {
        controller.enqueue(encoder.encode(message));
      }

      function sendData(data: JobValue) {
        writeToStream(`id: ${data.packageId}\n`);
        writeToStream(`data: ${JSON.stringify(data)}\n\n`);
      }

      req.signal.addEventListener('abort', () => {
        console.log('Received abort signal');
        finish();
      });

      writeToStream('retry: 1000\n\n');

      if (DROP_AFTER > 0) {
        setTimeout(() => finish(), DROP_AFTER);
      }

      console.log('Last seen id:', lastEventId);
      const currentValue = job.getCurrentValue();
      if (currentValue.packageId > lastEventId) {
        sendData(currentValue);
      }

      const unsubscribe = job.subscribe((nextValue) => {
        sendData(nextValue);

        if (nextValue.done) {
          finish();
        }
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
