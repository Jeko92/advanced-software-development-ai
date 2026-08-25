import express from 'express';
import APIRouter from './routes/APIRouter.ts';
import { connectDB, closeDB } from './db/database.ts';

const app = express();
const port = process.env['PORT'] || 3000;

app.use(express.static('public'));
app.use('/api', APIRouter);

await connectDB();

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});

async function handleShutdown(signalName: string): Promise<void> {
  console.log(`Received signal: ${signalName}`);
  const forceExit = setTimeout(() => {
    console.error('Graceful shutdown timed out — forcing exit.');
    process.exit(1);
  }, 5000).unref();
  try {
    await closeDB();
    console.log('Database connection closed successfully.');
  } catch (err) {
    console.error(`Error closing database: ${err}`);
  } finally {
    clearTimeout(forceExit);
    process.exit(0);
  }
}

process.on('SIGINT', () => handleShutdown('SIGINT'));
process.on('SIGTERM', () => handleShutdown('SIGTERM'));
