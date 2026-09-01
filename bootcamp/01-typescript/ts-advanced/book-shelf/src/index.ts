import type { Book, EntityId } from './types/book';
import {
  createBook,
  fetchBook,
  fetchBooks,
  parseIsbn,
  updateBook,
} from './bookService';
import { groupBy, merge, pluck } from './collectionUtils';
import { EventEmitter } from './eventEmitter';

/*******************************************************/
/* Challenge 1 - BookShelf type layer + service module  */
/*******************************************************/

console.log('******* fetchBooks (BookPreview[]) *******');
const { data: previews } = await fetchBooks();
console.log(previews);

const books: Book[] = await Promise.all(
  previews.map((preview) =>
    fetchBook(preview.id).then((response) => response.data),
  ),
);

console.log('******* fetchBook: success *******');
console.log(books[0]);

console.log('******* fetchBook: not found *******');
try {
  await fetchBook('does-not-exist');
} catch (err) {
  console.error((err as Error).message);
}

console.log('******* createBook *******');
const { data: createdBook } = await createBook({
  title: 'Test-Driven Development',
  author: 'Kent Beck',
  isbn: '978-0321-146533',
  isAvailable: true,
});
console.log(createdBook);

console.log('******* updateBook *******');
const { data: updatedBook } = await updateBook(createdBook.id, {
  isAvailable: false,
});
console.log(updatedBook);

console.log('******* parseIsbn *******');
const [group, publisher, titleCode] = parseIsbn(books[0]!.isbn);
console.log({ group, publisher, titleCode });

/*******************************************************/
/* Challenge 2 - Generic collection utilities            */
/*******************************************************/

console.log('******* groupBy(books, "author") *******');
const booksByAuthor = groupBy(books, 'author');
console.log(booksByAuthor);

console.log('******* pluck(books, "title") *******');
const titles = pluck(books, 'title');
console.log(titles);

console.log('******* merge(book, changes) *******');
const mergedBook = merge(books[0]!, { isAvailable: false });
console.log(mergedBook);

/*******************************************************/
/* Stretch goal - type-safe event emitter                */
/*******************************************************/

type BookEvents = {
  bookAdded: Book;
  bookRemoved: { id: EntityId };
  searchPerformed: { query: string; resultCount: number };
};

const emitter = new EventEmitter<BookEvents>();

emitter.on('bookAdded', (book) => {
  console.log('[bookAdded]', book.title);
});

emitter.on('bookRemoved', (payload) => {
  console.log('[bookRemoved]', payload.id);
});

emitter.on('searchPerformed', (payload) => {
  console.log(
    '[searchPerformed]',
    `"${payload.query}" -> ${payload.resultCount} result(s)`,
  );
});

console.log('******* EventEmitter *******');
emitter.emit('bookAdded', createdBook);
emitter.emit('bookRemoved', { id: books[1]!.id });
emitter.emit('searchPerformed', { query: 'clean', resultCount: 2 });
