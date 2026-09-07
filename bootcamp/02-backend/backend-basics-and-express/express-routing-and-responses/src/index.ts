import express, { type Request, type Response } from 'express';
import { books } from './data.ts';

const app = express();
const port = 3000;

// Parse JSON request bodies
app.use(express.json());

// ============================================================
// Route definitions
// ============================================================

// GET /
app.get('/', (_req: Request, res: Response) => {
  res.status(200).send('Hello express routes demo!');
});

// GET /books?author=George%20Orwell
app.get('/books', (req: Request, res: Response) => {
  const author = req.query['author'];
  const year = req.query['year'];
  const genre = req.query['genre'];

  let filteredBooks = books;

  if (author) {
    filteredBooks = filteredBooks.filter((book) => book.author === author);
  }

  if (year) {
    filteredBooks = filteredBooks.filter((book) => book.year === Number(year));
  }

  if (genre) {
    filteredBooks = filteredBooks.filter((book) => book.genre === genre);
  }

  res.json(filteredBooks);
});

// POST /books
app.post('/books', (req: Request, res: Response) => {
  const nextId = books.reduce((max, book) => Math.max(max, book.id), 0) + 1;

  const newBook = {
    id: nextId,
    ...req.body,
  };

  books.push(newBook);

  res.status(201).json(newBook);
});

// PUT /books/:id
app.put('/books/:id', (req: Request, res: Response) => {
  const id = Number(req.params['id']);
  const updatedBook = req.body;

  const bookIndex = books.findIndex((book) => book.id === id);

  if (bookIndex === -1) {
    res.status(404).json({ error: 'Book not found' });
    return;
  }

  books[bookIndex] = {
    id,
    ...updatedBook,
  };

  res.json(books[bookIndex]);
});

// DELETE /books/:id
app.delete('/books/:id', (req: Request, res: Response) => {
  const id = Number(req.params['id']);

  const bookIndex = books.findIndex((book) => book.id === id);

  if (bookIndex === -1) {
    res.status(404).json({ error: 'Book not found' });
    return;
  }

  books.splice(bookIndex, 1);

  res.status(204).send();
});

// ============================================================
// Route parameters
// ============================================================

// GET /books/:id
app.get('/books/:id', (req: Request, res: Response) => {
  const id = Number(req.params['id']);

  const book = books.find((book) => book.id === id);

  if (!book) {
    res.status(404).json({ error: 'Book not found' });
    return;
  }

  res.json(book);
});

// ============================================================
// Start server
// ============================================================

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
