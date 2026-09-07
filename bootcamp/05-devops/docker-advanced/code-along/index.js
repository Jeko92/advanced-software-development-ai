import http from 'node:http';

const port = process.env.PORT || 3000;

const server = http.createServer((_req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello from docker-advanced code-along!\n');
});

server.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully.');
  server.close(() => process.exit(0));
});
