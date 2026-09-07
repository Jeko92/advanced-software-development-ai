import express, { type Request, type Response } from 'express';
import { getAllColors, getColorById, getRandomColor } from './colorService.ts';
import nunjucks from 'nunjucks';

const app = express();

nunjucks.configure('src/views', {
  autoescape: true,
  express: app,
  watch: true, // Reload templates on change
});
app.set('view engine', 'njk');

app.use(express.static('public'));

app.get('/', (_req: Request, res: Response) => {
  const colors = getAllColors();
  res.render('home.njk', { title: 'Colors', colors });
});

app.get('/all', (_req: Request, res: Response) => {
  const colors = getAllColors();

  if (colors.length === 0) {
    res.status(400).send('No colors found');
    return;
  }

  res.json(colors);
});

app.get('/colors/random', function (_req, res) {
  const randomColor = getRandomColor();
  res.json(randomColor);
});

app.get('/colors/:id', function (req, res) {
  const { id } = req.params;
  const numId = Number(id);

  if (isNaN(numId)) {
    res.status(400).json({ message: 'bad request' });
    return;
  }

  const color = getColorById(numId);

  if (!color) {
    res.status(404).json({ message: 'Color not found' });
    return;
  }

  res.json(color);
});

app.listen(3000, () => {
  console.log('Server is running at http://localhost:3000');
});
