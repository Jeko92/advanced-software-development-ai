import express from 'express';
import { WebSocketServer, WebSocket } from 'ws';

const PORT = Number(process.env['PORT'] ?? 3000);

const app = express();

app.get('/', (_req, res) => {
  res.json({
    message: 'Raw WebSocket server (ws) is up and running',
    websocket: `ws://localhost:${PORT}`,
    routes: { health: '/health' },
  });
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'websockets-native-ws' });
});

const server = app.listen(PORT, () => {
  console.log(`native-ws listening on http://localhost:${PORT}`);
});

const wss = new WebSocketServer({ server });

wss.on('connection', (socket: WebSocket) => {
  console.log(`client connected (${wss.clients.size} total)`);
  socket.on('message', (data) => {
    for (const client of wss.clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data.toString());
      }
    }
  });

  socket.on('close', () => {
    console.log(`client disconnected (${wss.clients.size} total)`);
  });
});
