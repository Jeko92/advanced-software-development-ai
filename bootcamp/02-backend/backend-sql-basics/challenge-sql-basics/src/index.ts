import express from 'express';
import APIRouter from './routes/APIRouter.ts';
import { connectDB } from './db/database.ts';
import { handleShutdown } from './controller/APIController.ts';

const app = express();
const port = process.env['PORT'] || 3000;

app.use(express.static('public'));
app.use('/api', APIRouter);

await connectDB();

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});

process.on('SIGINT', () => handleShutdown('SIGINT'));

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
