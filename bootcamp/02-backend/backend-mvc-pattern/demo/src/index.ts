import express from 'express';
import nunjucks from 'nunjucks';
import colors from './routes/color.route.ts';
import blog from './routes/blog.route.ts';

const app = express();

nunjucks.configure('src/views', {
  autoescape: true,
  express: app,
  watch: true, // Reload templates on change
});
app.set('view engine', 'njk');

app.use(express.static('public'));

app.use((req, _res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.get('/', (_req, res) => {
  res.render('home.njk', { title: 'Home' });
});

app.use('/colors', colors);
app.use('/blog', blog);

app.listen(3000, () => {
  console.log('Server is running at http://localhost:3000');
});
