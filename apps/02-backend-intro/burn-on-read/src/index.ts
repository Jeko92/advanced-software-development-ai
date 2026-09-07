import express, { type Request, type Response } from 'express';
import cors from 'cors';
import nunjucks from 'nunjucks';
import { getFullYear } from './utils/utils';
import messages from './routes/messages.route';
import { initLogger, logger } from './middlewares/loggerMiddleware';

const app = express();
const port = process.env['PORT'] || 3333;

nunjucks.configure('src/views', {
  autoescape: true,
  express: app,
  watch: true,
});

app.use((_req: Request, res: Response, next) => {
  res.locals['currentYear'] = getFullYear;
  next();
});

app.set('view engine', 'njk');

app.use(cors());

async function bootstrap(): Promise<void> {
  await initLogger();
  app.use(logger);
  app.use(express.static('public'));
  app.use(express.urlencoded({ extended: true }));

  app.use('/messages', messages);

  app.get('/', (_req: Request, res: Response) => {
    res.render('home.njk', { title: 'Burn on read' });
  });

  app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
  });
}

void bootstrap();
