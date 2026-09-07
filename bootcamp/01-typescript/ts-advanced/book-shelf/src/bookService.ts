import type {
  ApiResponse,
  Book,
  BookCreatePayload,
  BookPreview,
  BookUpdatePayload,
  EntityId,
  IsbnParts,
} from './types/book.ts';
import rawBooks from './data/books.json' with { type: 'json' };

const books: Book[] = rawBooks.map((book) => ({
  ...book,
  createdAt: new Date(book.createdAt),
  updatedAt: new Date(book.updatedAt),
}));

const toPreview = (book: Book): BookPreview => ({
  id: book.id,
  title: book.title,
  author: book.author,
});

// Same trick as fetchBooks/createBook in code-along: no real server, so
// every function below fakes the network with setTimeout instead of an
// actual fetch call, and wraps the result in the same ApiResponse<T>
// envelope a real endpoint would use.
const fakeDelay = <T>(data: T, ms = 400): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), ms);
  });
};

export const fetchBooks = async (): Promise<ApiResponse<BookPreview[]>> => {
  const data = await fakeDelay(books.map(toPreview));

  return {
    status: 200,
    message: 'Books fetched',
    data,
  };
};

export const fetchBook = async (id: EntityId): Promise<ApiResponse<Book>> => {
  const found = books.find((book) => book.id === id);

  if (!found) {
    throw new Error(`No book found with id "${id}"`);
  }

  const data = await fakeDelay(found);

  return {
    status: 200,
    message: 'Book fetched',
    data,
  };
};

export const createBook = async (
  payload: BookCreatePayload,
): Promise<ApiResponse<Book>> => {
  const newBook: Book = {
    id: Date.now().toString(),
    ...payload,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  books.push(newBook);
  const data = await fakeDelay(newBook);

  return {
    status: 201,
    message: 'Book created',
    data,
  };
};

export const updateBook = async (
  id: EntityId,
  changes: BookUpdatePayload,
): Promise<ApiResponse<Book>> => {
  const index = books.findIndex((book) => book.id === id);
  const existing = books[index];

  if (!existing) {
    throw new Error(`No book found with id "${id}" to update`);
  }

  const updated: Book = { ...existing, ...changes, updatedAt: new Date() };
  books[index] = updated;
  const data = await fakeDelay(updated);

  return {
    status: 200,
    message: 'Book updated',
    data,
  };
};

export const parseIsbn = (isbn: string): IsbnParts => {
  const [group, publisher, titleCode] = isbn.split('-');

  if (
    group === undefined ||
    publisher === undefined ||
    titleCode === undefined
  ) {
    throw new Error(`"${isbn}" is not a valid group-publisher-titleCode ISBN`);
  }

  return [Number(group), publisher, titleCode];
};
