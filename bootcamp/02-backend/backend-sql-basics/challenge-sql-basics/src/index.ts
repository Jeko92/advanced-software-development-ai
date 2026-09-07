import express from 'express';
import APIRouter from './routes/APIRouter';
import { connectDB } from './db/database';
import { handleShutdown } from './controller/APIController';

const app = express();
const port = process.env['PORT'] || 3000;

app.use(express.static('public'));
app.use('/api', APIRouter);

async function bootstrap(): Promise<void> {
  await connectDB();

  app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`);
  });
}

void bootstrap();

process.on('SIGINT', () => handleShutdown('SIGINT'));

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
