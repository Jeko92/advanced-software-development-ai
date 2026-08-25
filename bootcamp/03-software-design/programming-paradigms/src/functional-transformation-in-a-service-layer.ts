export interface BookRow {
  id: number;
  title: string;
  author_name: string;
  is_available: boolean;
  added_at: string;
}

export const mockBookRows: BookRow[] = [
  {
    id: 1,
    title: 'Dune',
    author_name: 'Frank Herbert',
    is_available: true,
    added_at: '2024-01-15',
  },
  {
    id: 2,
    title: '1984',
    author_name: 'George Orwell',
    is_available: false,
    added_at: '2024-02-03',
  },
  {
    id: 3,
    title: 'The Hobbit',
    author_name: 'J.R.R. Tolkien',
    is_available: true,
    added_at: '2024-03-10',
  },
  {
    id: 4,
    title: 'Brave New World',
    author_name: 'Aldous Huxley',
    is_available: false,
    added_at: '2024-04-22',
  },
  {
    id: 5,
    title: 'Fahrenheit 451',
    author_name: 'Ray Bradbury',
    is_available: true,
    added_at: '2024-05-01',
  },
];

export interface BookResponse {
  id: number;
  title: string;
  authorName: string;
  isAvailable: boolean;
  addedAt: string;
}

class BookTransformer {
  books: BookRow[];
  constructor(books: BookRow[]) {
    this.books = books;
  }

  getBooks(): BookRow[] {
    return this.books;
  }

  transformBooks(): BookResponse[] {
    return this.books
      .filter((book: BookRow) => book.is_available)
      .map((book) => ({
        id: book.id,
        title: book.title,
        authorName: book.author_name,
        isAvailable: book.is_available,
        addedAt: book.added_at,
      }));
  }
}

const bookTransformer = new BookTransformer(mockBookRows);
console.log(bookTransformer.getBooks());
console.log(bookTransformer.transformBooks());
