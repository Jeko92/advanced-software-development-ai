import express, { type Request, type Response } from 'express';
import nunjucks from 'nunjucks';
import colors from './routes/color.route';
import blog from './routes/blog.route';
import { ensureLogFile, logger } from './middlewares/loggerMiddleware';
import { authenticate } from './auth/auth-mock';
import cors from 'cors';

const app = express();
const port = process.env['PORT'] || 3333;

nunjucks.configure('src/views', {
  autoescape: true,
  express: app,
  watch: true,
});

app.set('view engine', 'njk');

async function bootstrap(): Promise<void> {
  await ensureLogFile();

  app.use(cors());
  app.use(express.static('public'));
  app.use(logger);

  app.use('/colors', colors);
  app.use('/blog', blog);

  app.get('/', (_req: Request, res: Response) => {
    res.render('home.njk', { title: 'Home' });
  });

  app.get(
    '/api/greeting/:name',
    authenticate,
    (req: Request, res: Response) => {
      res.json({ message: `Hello, ${req.params['name']}!` });
    },
  );

  app.get('/greeting/Joe', (_req: Request, res: Response) => {
    res.render('greeting-joe.njk', { title: 'Greeting Joe' });
  });

  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

void bootstrap();
