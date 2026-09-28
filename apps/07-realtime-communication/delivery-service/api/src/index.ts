import express from 'express';
import cors from 'cors';
import { randomUUID } from 'node:crypto';
import { EventEmitter } from 'node:events';

const app = express();
const PORT = Number(process.env['PORT'] ?? 3030);
const STAGES = ['PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED'] as const;
type OrderStatus = (typeof STAGES)[number];
type Order = {
  id: string;
  stageIndex: number;
  status: OrderStatus;
  events: EventEmitter;
};
type OrderSnapshot = {
  status: OrderStatus;
  stageIndex: number;
  isFinal: boolean;
};

app.use(cors());

const orders = new Map<string, Order>();

const toSnapshot = (order: Order): OrderSnapshot => {
  return {
    status: order.status,
    stageIndex: order.stageIndex,
    isFinal: order.stageIndex === STAGES.length - 1,
  };
};

const STAGE_DURATION_MS = 4000;

const advanceOrder = (order: Order): void => {
  const timer = setInterval(() => {
    const nextIndex = order.stageIndex + 1;
    const nextStatus = STAGES[nextIndex];

    if (!nextStatus) {
      clearInterval(timer);
      return;
    }

    order.stageIndex = nextIndex;
    order.status = nextStatus;

    order.events.emit('status', order);

    if (order.stageIndex === STAGES.length - 1) {
      clearInterval(timer);
    }
  }, STAGE_DURATION_MS);
};

app.get('/', (_req, res) => {
  res.json({ message: 'hello from backend' });
});

app.post('/api/orders', (_req, res) => {
  const order: Order = {
    id: randomUUID(),
    stageIndex: 0,
    status: STAGES[0],
    events: new EventEmitter(),
  };
  orders.set(order.id, order);
  advanceOrder(order);

  res.status(201).json({ id: order.id, ...toSnapshot(order) });
});

app.get('/api/orders/:id', (req, res) => {
  const id = req.params['id'];
  if (!id) {
    res.status(400).json({ error: 'missing id' });
    return;
  }

  const order = orders.get(id);
  if (!order) {
    res.status(404).json({ error: 'unknown order' });
    return;
  }
  res.header('Cache-Control', 'no-store');
  res.json(toSnapshot(order));
});

app.get('/api/orders/:id/updates', (req, res) => {
  const id = req.params['id'];
  if (!id) {
    res.status(400).json({ error: 'missing id' });
    return;
  }

  const order = orders.get(id);
  if (!order) {
    res.status(404).json({ error: 'unknown order' });
    return;
  }

  const since = Number(req.query['since'] ?? -1);

  if (order.stageIndex > since) {
    res.json(toSnapshot(order));
    return;
  }

  const onStatusChange = () => {
    clearTimeout(timer);
    res.json(toSnapshot(order));
  };
  order.events.once('status', onStatusChange);

  const timer = setTimeout(() => {
    order.events.off('status', onStatusChange);
    res.status(204).end();
  }, 25_000);

  req.on('close', () => {
    clearTimeout(timer);
    order.events.off('status', onStatusChange);
  });
});

app.get('/api/orders/:id/stream', (req, res) => {
  const id = req.params['id'];
  if (!id) {
    res.status(400).end();
    return;
  }

  const order = orders.get(id);
  if (!order) {
    res.status(404).end();
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

  const send = () => {
    const snapshot = toSnapshot(order);
    res.write(`id: ${snapshot.stageIndex}\n`);
    res.write(`data: ${JSON.stringify(snapshot)}\n\n`);

    if (snapshot.isFinal) {
      clearInterval(heartbeat);
      order.events.off('status', send);
      res.end();
    }
  };

  order.events.on('status', send);
  send();
  req.on('close', () => {
    clearInterval(heartbeat);
    order.events.off('status', send);
  });
});

app.listen(PORT, () => {
  console.log(`Delivery Service API listening on http://localhost:${PORT}`);
});
