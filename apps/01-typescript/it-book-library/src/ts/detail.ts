import type { BookDetail } from './types.js';
import {
  apiPath,
  getFavoriteIsbns,
  toggleFavorite,
  updateHeaderFavoritesBadge,
} from './shared.js';

const titleEl = document.getElementById('book-title') as HTMLSpanElement;
const abstractEL = document.getElementById(
  'book-abstract',
) as HTMLParagraphElement;
const detailsListEl = document.getElementById(
  'book-details-list',
) as HTMLUListElement;
const coverImgEl = document.getElementById('book-cover') as HTMLImageElement;
const favBtnEl = document.getElementById('fav-btn') as HTMLButtonElement;

let currentIsbn: string | null = null;

function getIsbnFromUrl(): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get('isbn');
}

function updateFavButtonState(isbn: string): void {
  if (!favBtnEl) return;

  const isFav = getFavoriteIsbns().includes(isbn);
  favBtnEl.title = isFav ? 'Remove from favorites' : 'Add to favorites';

  const svg = favBtnEl.querySelector('svg');
  if (svg) {
    svg.setAttribute('fill', isFav ? 'currentColor' : 'none');
  }
}

function renderBookDetail(book: BookDetail): void {
  currentIsbn = book.isbn;

  if (titleEl) {
    titleEl.replaceChildren(book.title, document.createElement('br'));
    const subtitleEl = document.createElement('small');
    subtitleEl.textContent = book.subtitle || '';
    titleEl.append(subtitleEl);
  }
  if (abstractEL)
    abstractEL.textContent = book.abstract || 'No abstract available';

  if (detailsListEl) {
    detailsListEl.replaceChildren();
    const fields: [string, string][] = [
      ['Author', book.author],
      ['Publisher', book.publisher],
      ['Pages', String(book.numPages)],
      ['ISBN', book.isbn],
    ];
    for (const [label, value] of fields) {
      const li = document.createElement('li');
      const strong = document.createElement('strong');
      strong.textContent = `${label}:`;
      li.append(strong, ` ${value}`);
      detailsListEl.append(li);
    }
  }

  if (coverImgEl) {
    coverImgEl.src = book.cover || './images/1001606140805.png';
    coverImgEl.alt = book.title;
  }

  updateFavButtonState(book.isbn);

  favBtnEl?.addEventListener('click', () => {
    if (currentIsbn) {
      toggleFavorite(currentIsbn);
      updateFavButtonState(currentIsbn);
    }
  });
}

async function fetchBookDetail(): Promise<void> {
  updateHeaderFavoritesBadge();
  const isbn = getIsbnFromUrl();

  if (!isbn) {
    console.warn('No ISBN provided in URL params.');
    return;
  }

  try {
    const response = await fetch(apiPath('.db/books.json'));

    if (!response.ok) {
      throw new Error(`Failed to load books (Status: ${response.status})`);
    }

    const books: BookDetail[] = await response.json();
    const book = books.find((b) => b.isbn === isbn);

    if (!book) {
      throw new Error(`No book found with ISBN: ${isbn}`);
    }

    // Build the cover path from the ISBN, since it's not guaranteed to be in the JSON
    book.cover = apiPath(`.db/book-images/${isbn}.png`);

    renderBookDetail(book);
  } catch (error) {
    console.error('Error fetching book details:', error);

    const mockBook: BookDetail = {
      title: 'Java Web Scraping Handbook',
      subtitle: 'Learn advanced Web Scraping techniques',
      isbn: isbn,
      abstract:
        'Web scraping or crawling is the art of fetching data from a third party website...',
      numPages: 115,
      author: 'Kevin Sahin',
      publisher: 'Leanpub',
      cover: apiPath('.db/book-images/1001606140805.png'),
    };

    renderBookDetail(mockBook);
  }
}

fetchBookDetail();
