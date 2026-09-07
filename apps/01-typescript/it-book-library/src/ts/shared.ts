import type { BookList } from './types.js';

const FAVORITES_KEY = 'it_book_library_favorites';

// VITE_API_BASE_URL comes from .env, loaded natively by Vite (see
// vite-env.d.ts). Left empty (the default), every path below stays
// relative to whichever page loaded it - no hardcoded deployment domain.
// Set it in .env only if pointing at a different host serving this same
// /.db data.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

export function apiPath(path: string): string {
  if (!API_BASE_URL) return path;
  return `${API_BASE_URL.replace(/\/$/, '')}/${path}`;
}

const API_URL = apiPath('.db/books.json');

export function getFavoriteIsbns(): string[] {
  const raw = localStorage.getItem(FAVORITES_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function toggleFavorite(isbn: string): void {
  const favorites = getFavoriteIsbns();
  const index = favorites.indexOf(isbn);
  if (index > -1) {
    favorites.splice(index, 1);
  } else {
    favorites.push(isbn);
  }
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  updateHeaderFavoritesBadge();
}

export function removeFavorite(isbn: string): void {
  const favorites = getFavoriteIsbns().filter((id) => id !== isbn);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  updateHeaderFavoritesBadge();
}

export function updateHeaderFavoritesBadge(): void {
  const countEl = document.querySelector('.mainnav-number');
  if (countEl) {
    countEl.textContent = getFavoriteIsbns().length.toString();
  }
}

export function populatePublisherSelect(
  select: HTMLSelectElement | null,
  books: BookList,
): void {
  if (!select) return;

  const publishers = Array.from(new Set(books.map((b) => b.publisher)));
  select.innerHTML = `<option value="-">-</option>`;

  publishers.forEach((publisher) => {
    const option = document.createElement('option');
    option.value = publisher;
    option.textContent = publisher;
    select.appendChild(option);
  });
}

const MOCK_BOOKS: BookList = [
  {
    title: 'Java Web Scraping Handbook',
    subtitle: 'Learn advanced Web Scraping techniques',
    isbn: '1001606140805',
    abstract:
      'Web scraping or crawling is the art of fetching data from a third party website by downloading and parsing the HTML code to extract the data you want. It can be hard. From bad HTML code to heavy Javascript use and anti-bot techniques, it is often tricky. Lots of companies use it to obtain knowledge ...',
    author: 'Kevin Sahin',
    publisher: 'Leanpub',
    numPages: 115,
    cover: apiPath('.db/book-images/1001606140805.png'),
  },
  {
    title: 'Hacking Exposed Web 2.0',
    subtitle: 'Web 2.0 Security Secrets and Solutions',
    isbn: '9780071494618',
    abstract:
      'Protect your Web 2.0 architecture against the latest wave of cybercrime using expert tactics from Internet security professionals. Hacking Exposed Web 2.0 shows how hackers perform reconnaissance, choose their entry point, and attack Web 2.0 - based services, and reveals detailed countermeasures and...',
    author: 'Rich Cannings, Himanshu Dwivedi, Zane Lackey',
    publisher: 'McGraw-Hill',
    numPages: 258,
    cover: apiPath('.db/book-images/9780071494618.png'),
  },
];

export async function fetchAllBooks(): Promise<BookList> {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.warn('Could not connect to API, using mock data instead:', error);
    return MOCK_BOOKS;
  }
}
