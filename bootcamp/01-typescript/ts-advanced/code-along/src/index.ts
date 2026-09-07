/*******************************************************/
/* TypeScript Advanced - Intersection Types and Tuples */
/*******************************************************/

// Intersection types
type HasId = {
  id: string;
};

type Timestamped = {
  createdAt: Date;
  updatedAt: Date;
};

type BookFields = {
  title: string;
  author: string;
  isbn: string;
  isAvailable: boolean;
};

type Book = HasId & Timestamped & BookFields;

const book: Book = {
  id: '1',
  createdAt: new Date(),
  updatedAt: new Date(),
  title: 'Clean Code',
  author: 'Robert C. Martin',
  isbn: '978-0132350884',
  isAvailable: true,
};

console.log('Book: ', book);

type AuthorFields = {
  name: string;
  bio: string;
};

type Author = HasId & Timestamped & AuthorFields;
const author: Author = {
  id: '1',
  createdAt: new Date(),
  updatedAt: new Date(),
  name: 'Robert C. Martin',
  bio: 'American software engineer and author known for Clean Code, Clean Architecture, and his contributions to software craftsmanship.',
};

console.log('Author: ', author);

// Intersection types vs union types
console.log('============================================');
console.log('======intersection types vs union types=====');
console.log('============================================');

// UNION: string OR number
type StringOrNumber = string | number;

const value1: StringOrNumber = 'Hello';
const value2: StringOrNumber = 42;

console.log("******* intersection 'OR' *******");
console.log('Union value 1: ', value1);
console.log('Union value 2: ', value2);

// INTERSECTION: name AND age
type HasNameAndAge = { name: string } & { age: number };

const person: HasNameAndAge = {
  name: 'Robert C. Martin',
  age: 72,
};

console.log("******* intersection 'AND' *******");
console.log('Intersection object: ', person);
console.log('Name: ', person.name);
console.log('Age: ', person.age);

// UNION inside an object
type HasIdWithUnion = {
  id: number | string;
};

const numericId: HasIdWithUnion = {
  id: 123,
};

const stringId: HasIdWithUnion = {
  id: 'author-123',
};

console.log('******* Union inside an object *******');
console.log('Numeric ID: ', numericId);
console.log('String ID: ', stringId);

// INTERSECTION =  ALL types must be satisfied
console.log('******* INTERSECTION *******');
console.log('His name: ', 'name' in person);
console.log('His name: ', person.name);
console.log('His age: ', 'age' in person);
console.log('His age: ', person.age);

// UNION = ONE of the possible types
console.log('******* UNION *******');
console.log('Type of value1:', typeof value1);
console.log('Type of value2:', typeof value2);
console.log('Type of numericId.id:', typeof numericId.id);
console.log('Type of stringId.id:', typeof stringId.id);

// Tuple types
type IsbnParts = [number, string, string];
const cleanCodeIsbn: IsbnParts = [978, '0132', '350884'];
const [group, publisher, titleCode] = cleanCodeIsbn;

console.log('******* TUPLE *******');
console.log('Whole ISBN:', cleanCodeIsbn);
console.log('ISBN-group:', group);
console.log('ISBN-publisher:', publisher);
console.log('ISBN-titleCode:', titleCode);

// Tuples for function return values
type BookResult = [Book | null, Error | null];

const findBook = (id: string): BookResult => {
  if (id === '1') {
    return [book, null];
  }

  return [null, new Error('Book not found')];
};

console.log('******* BOOK SEARCH *******');

const [foundBook, notFoundError] = findBook('1');

if (notFoundError) {
  console.log('Error finding book:', notFoundError.message);
} else {
  console.log('Found book:', foundBook);
}

const [missingBook, missingBookError] = findBook('999');

if (missingBookError) {
  console.log('Error finding book:', missingBookError.message);
} else {
  console.log('Found book:', missingBook);
}

// The `keyof` operator
type GenreDescriptions = {
  horror: string;
  romance: string;
  scienceFiction: string;
};

const descriptions: GenreDescriptions = {
  horror: 'Scary and thrilling stories',
  romance: 'Books about love and relationships',
  scienceFiction: 'Futuristic and space adventures',
};

const getGenreDescription = (genre: keyof GenreDescriptions): string => {
  return descriptions[genre];
};

console.log('******* KEYOF *******');
console.log(getGenreDescription('horror'));

const isGenreKey = (genre: string): genre is keyof GenreDescriptions => {
  return genre in descriptions;
};

const getGenreDescriptionSafely = (genre: string): string => {
  if (!isGenreKey(genre)) {
    console.error(`Unknown genre: "${genre}"`);
    return 'No description available';
  }

  return getGenreDescription(genre);
};

const userSubmittedGenre = 'fantasy';

console.log(getGenreDescriptionSafely(userSubmittedGenre));

/*******************************************************/
/* TypeScript Advanced - Generics */
/*******************************************************/

// Generic interfaces
export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

interface ApiBook {
  id: number;
  title: string;
  author: string;
}

interface ApiError {
  code: string;
  detail: string;
}

const bookList: ApiResponse<ApiBook[]> = {
  status: 200,
  message: 'Books fetched',
  data: [
    { id: 1, title: 'Clean Code', author: 'Robert C. Martin' },
    { id: 2, title: 'Refactoring', author: 'Martin Fowler' },
  ],
};

const error: ApiResponse<ApiError> = {
  status: 404,
  message: 'Resource not found',
  data: { code: 'NOT_FOUND', detail: 'No book with that ID' },
};

console.log('******* generic interfaces *******');
console.log('Book list: ', bookList);
console.log('Api Error: ', error);

// Built-in generic types
const books: Array<ApiBook> = [];
const alsoBooks: ApiBook[] = [];

books.push({ id: 1, title: 'Clean Code', author: 'Robert C. Martin' });
alsoBooks.push({ id: 2, title: 'Refactoring', author: 'Martin Fowler' });

console.log('******* Array<T> vs T[] *******');
console.log('Array<T> books:', books);
console.log('T[] alsoBooks:', alsoBooks);

const fetchBooks = (): Promise<ApiBook[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, title: 'Clean Code', author: 'Robert C. Martin' },
        { id: 2, title: 'Refactoring', author: 'Martin Fowler' },
      ]);
    }, 500);
  });
};

console.log('******* Promise<T> *******');
console.log('Fetching books...');
const fetchedBooks = await fetchBooks();
console.log('Fetched books (after a fake delay):', fetchedBooks);

const featured: ReadonlyArray<ApiBook> = Object.freeze([
  { id: 1, title: 'Clean Code', author: 'Robert C. Martin' },
]);

const anotherBook = { id: 2, title: 'Refactoring', author: 'Martin Fowler' };

console.log('******* ReadonlyArray<T> *******');
console.log('Featured (readonly):', featured);

// featured.push(anotherBook); // Compile error: Property 'push' does not exist on type 'readonly ApiBook[]'
console.log('Another book will not be added', anotherBook);

// Generic functions
const getFirst = (items: unknown[]): unknown => {
  return items[0];
};

console.log('******* Generic function call without type information *******');
const title = getFirst(['Clean Code', 'Refactoring']);
console.log('Title is: ', title);

const getFirstGeneric = <T>(items: T[]): T | undefined => {
  return items[0];
};

console.log('*******  Generic function call with type information *******');
const titleGeneric = getFirstGeneric(['Clean Code', 'Refactoring']);
const idGeneric = getFirstGeneric([1, 2, 3]);
console.log(
  `titleGeneric is: ${titleGeneric}, type of titleGeneric is: ${typeof titleGeneric}`,
);
console.log(
  `idGeneric is: ${idGeneric}, type of idGeneric is: ${typeof idGeneric}`,
);

// Generic constraints
const getEntityId = <T extends { id: number | string }>(
  entity: T,
): number | string => {
  return entity.id;
};

console.log('*******  Generic constraints(number | string) *******');
const idString = getEntityId({ id: 'author-123', title: 'Clean Code' });
const idNumber = getEntityId({ id: 1, name: 'no id here' });
console.log(
  `idString is: ${idString}, type of idString is: ${typeof idString}`,
);
console.log(
  `idNumber is: ${idNumber}, type of idNumber is: ${typeof idNumber}`,
);

// getEntityId({ name: "no id here" }); // compile error: property 'id' is missing

// Multiple type parameters
const createEntry = <K extends string, V>(key: K, value: V): [K, V] => {
  return [key, value];
};

console.log('*******  Multiple type parameters *******');
const entry = createEntry('isbn', '978-0132350884');
console.log('Entry: ', entry);

// Default type parameters
interface ApiResponseWithDefault<T = unknown> {
  status: number;
  message: string;
  data: T;
}

console.log('*******  Default type parameters *******');
const raw: ApiResponseWithDefault = { status: 200, message: 'OK', data: null };
const typed: ApiResponseWithDefault<Book> = {
  status: 200,
  message: 'OK',
  data: book,
};
console.log('Raw: ', raw);
console.log('Typed: ', typed);

/*******************************************************/
/* TypeScript Advanced - Utility Types */
/*******************************************************/

// Partial and Required
type BookUpdate = Partial<Book>;

const utilityBooks: Book[] = [
  {
    id: '1',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    isbn: '978-0132350884',
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    title: 'Refactoring',
    author: 'Martin Fowler',
    isbn: '978-0201485677',
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const updateBook = (id: string, changes: BookUpdate): Book => {
  const bookIndex = utilityBooks.findIndex((existing) => existing.id === id);
  const existingBook = utilityBooks[bookIndex];

  if (!existingBook) {
    throw new Error('No book found to update.');
  }

  const updatedBook = { ...existingBook, ...changes };
  utilityBooks[bookIndex] = updatedBook;

  return updatedBook;
};

console.log('******* Partial<T> *******');
const updatedBook1 = updateBook('1', { title: 'Clean Code, 2nd Edition' });
const updatedBook2 = updateBook('1', {
  isAvailable: false,
  title: 'Refactoring',
});
console.log('Updated book 1:', updatedBook1);
console.log('Updated book 2:', updatedBook2);

// Required
interface AppConfig {
  port?: number;
  debug?: boolean;
  dbUrl?: string;
}

type ResolvedConfig = Required<AppConfig>;

console.log('******* Required<T> *******');
const resolvedConfig: ResolvedConfig = {
  port: 3000,
  debug: false,
  dbUrl: 'postgres://localhost:5432/bookshelf',
};
console.log('Resolved config:', resolvedConfig);

// const incompleteConfig: ResolvedConfig = { port: 3000, debug: false };
// Property dbUrl is missing in type { port: number; debug: false; }
// but required in type Required<AppConfig>

type FrozenBook = Readonly<Book>;

const frozenBook: FrozenBook = Object.freeze({
  id: '1',
  title: 'Clean Code',
  author: 'Robert C. Martin',
  isbn: '978-0132350884',
  isAvailable: true,
  createdAt: new Date(),
  updatedAt: new Date(),
});

console.log('******* Readonly<T> *******');
console.log('Frozen book:', frozenBook);

try {
  (frozenBook as Book).title = 'New Title';
} catch (err) {
  console.error('Cannot mutate a frozen book:', (err as Error).message);
}

// Pick and Omit

type BookPreview = Pick<Book, 'id' | 'title' | 'author'>;
type BookCreatePayload = Omit<Book, 'id' | 'createdAt' | 'updatedAt'>;

const bookPreview: BookPreview = {
  id: '3',
  title: 'The Pragmatic Programmer',
  author: 'David Thomas',
};

console.log('******* Pick<T, K> *******');
console.log('Book preview:', bookPreview);

export const newBookPayload: BookCreatePayload = {
  title: 'Domain-Driven Design',
  author: 'Eric Evans',
  isbn: '978-0321125217',
  isAvailable: true,
};

console.log('******* Omit<T, K> *******');
console.log('New book payload:', newBookPayload);

// type Typo = Pick<Book, "Id">;
// ^ compile error: Type '"Id"' does not satisfy the constraint
// 'keyof Book' - the key must actually exist on Book (case-sensitive).

// Record

type BookLookup = Record<string, Book>;

const catalog: BookLookup = {
  '978-0132350884': {
    id: '1',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    isbn: '978-0132350884',
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};

console.log('******* Record<K, T> *******');
console.log('Catalog:', catalog);

type Shelf = 'fiction' | 'non-fiction' | 'technical';
type ShelfCounts = Record<Shelf, number>;

const counts: ShelfCounts = {
  fiction: 120,
  'non-fiction': 85,
  technical: 200,
};

console.log('******* Record<K, T> with a union key *******');
console.log('Shelf counts:', counts);

// const incompleteCounts: ShelfCounts = { fiction: 120, "non-fiction": 85 };
// ^ compile error: Property 'technical' is missing in type
// '{ fiction: number; "non-fiction": number; }' but required in type
// 'ShelfCounts' - Record<K, T> guarantees every key in the union is present.

// Composing utility types

// POST /books: excludes server-generated fields
type BookCreatePayloadComposed = Omit<Book, 'id' | 'createdAt' | 'updatedAt'>;

const bookCreatePayloadComposed: BookCreatePayloadComposed = {
  title: 'Domain-Driven Design',
  author: 'Eric Evans',
  isbn: '978-0321125217',
  isAvailable: true,
};

// PATCH /books/:id: excludes server fields, everything else optional
type BookUpdatePayload = Partial<Omit<Book, 'id' | 'createdAt' | 'updatedAt'>>;

const bookUpdatePayload: BookUpdatePayload = {
  title: 'Clean Code, 2nd Edition',
};

// GET /books (list view): only the fields needed for display
type BookPreviewComposed = Pick<Book, 'id' | 'title' | 'author'>;

const bookPreviewComposed: BookPreviewComposed = {
  id: '3',
  title: 'The Pragmatic Programmer',
  author: 'David Thomas',
};

// Application state
interface AppStateComposed {
  books: Book[];
  isLoading: boolean;
  filterByAuthor: string | null;
}

const appStateComposed: AppStateComposed = {
  books: [book],
  isLoading: false,
  filterByAuthor: null,
};

console.log('******* Composing utility types *******');
console.log(
  'Book create payload (Omit<Book, ...>):',
  bookCreatePayloadComposed,
);
console.log(
  'Book update payload (Partial<Omit<Book, ...>>):',
  bookUpdatePayload,
);
console.log('Book preview (Pick<Book, ...>):', bookPreviewComposed);
console.log('App state (uses Book[] directly):', appStateComposed);

/*******************************************************/
/* TypeScript Advanced - Declaration Files */
/*******************************************************/

// Declaring types for your own project
//
// A .d.ts file can only contain type declarations - no console.log, no
// function bodies, nothing runnable - so this section can't be demonstrated
// inline the way earlier sections were without turning this script into a
// module other files depend on. Instead, see:
//
//   - src/types/book.d.ts  the shared Book/BookCreatePayload/ApiResponse
//                          declarations, `export`-ed exactly like a
//                          regular .ts file would export them.
//   - src/bookService.ts   imports those types with `import type`, so none
//                          of the declaration file exists in compiled JS.
//
// index.ts deliberately keeps its own local Book/ApiResponse types from
// earlier sections rather than importing from types/book.d.ts, so this
// walkthrough stays a single, self-contained script top to bottom.
console.log('******* Declaration files *******');
console.log(
  'See src/types/book.d.ts and src/bookService.ts for the full example.',
);

/*******************************************************/
/* TypeScript Advanced - Types Packages  */
/*******************************************************/
import * as _ from 'lodash';

console.log('******* @types/lodash *******');
const grouped = _.groupBy(['cat', 'dog', 'crow'], 'length');
console.log('Grouped by string length:', grouped);

import fs from 'node:fs';
import path from 'node:path';

console.log('******* @types/node *******');
const appEnv: string | undefined = process.env['APP_ENV'];
console.log('APP_ENV:', appEnv ?? '(not set)');

const filePath = path.join(import.meta.dirname, 'data', 'volunteers.json');
const volunteersRaw = fs.readFileSync(filePath, 'utf8');
console.log('Volunteers loaded from disk:', JSON.parse(volunteersRaw));
