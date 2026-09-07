import type { BookList } from './types.js';
import {
  fetchAllBooks,
  getFavoriteIsbns,
  toggleFavorite,
  updateHeaderFavoritesBadge,
  populatePublisherSelect,
} from './shared.js';

const bookListTable = document.getElementById('book-list') as HTMLTableElement;
const searchTitleInput = document.getElementById('search') as HTMLInputElement;
const publisherSelect = document.getElementById(
  'by-publisher',
) as HTMLSelectElement;
const headingCountEl = document.getElementById(
  'book-count',
) as HTMLHeadingElement;

if (!bookListTable) {
  throw new Error('HTML broken: #book-list not found');
}

let allBooks: BookList = [];

function renderBooks(books: BookList): void {
  const tbody = bookListTable.querySelector('tbody') || bookListTable;
  tbody.innerHTML = '';

  if (headingCountEl) {
    headingCountEl.textContent = `${books.length} Books displayed`;
  }

  if (books.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6">No books found.</td></tr>`;
    return;
  }

  const favIsbns = getFavoriteIsbns();

  books.forEach((book) => {
    const isFav = favIsbns.includes(book.isbn);
    const row = document.createElement('tr');

    const favCell = document.createElement('td');
    favCell.innerHTML = `
                <button class="button button-clear fav-btn" title="${isFav ? 'Remove from favorites' : 'Add to favorites'}">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                         fill="${isFav ? 'currentColor' : 'none'}"
                         stroke="currentColor" stroke-width="1.5" class="fav">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                </button>
            `;

    const titleCell = document.createElement('td');
    titleCell.textContent = book.title;

    const isbnCell = document.createElement('td');
    isbnCell.textContent = book.isbn;

    const authorCell = document.createElement('td');
    authorCell.textContent = book.author;

    const publisherCell = document.createElement('td');
    publisherCell.textContent = book.publisher;

    const detailCell = document.createElement('td');
    const detailBtn = document.createElement('button');
    detailBtn.className = 'button';
    detailBtn.textContent = 'Detail';
    detailBtn.addEventListener('click', () => {
      location.href = `detail.html?isbn=${encodeURIComponent(book.isbn)}`;
    });
    detailCell.append(detailBtn);

    row.append(
      favCell,
      titleCell,
      isbnCell,
      authorCell,
      publisherCell,
      detailCell,
    );

    const favBtn = favCell.querySelector('.fav-btn') as HTMLButtonElement;
    favBtn.addEventListener('click', () => {
      toggleFavorite(book.isbn);
      renderBooks(books);
    });

    tbody.appendChild(row);
  });
}

function applyFilters(): void {
  const titleQuery = searchTitleInput?.value.toLowerCase().trim() || '';
  const selectedPublisher = publisherSelect?.value || '';

  const filteredBooks = allBooks.filter((book) => {
    const matchesTitle = book.title.toLowerCase().includes(titleQuery);
    const matchesPublisher =
      selectedPublisher === '' ||
      selectedPublisher === '-' ||
      book.publisher === selectedPublisher;

    return matchesTitle && matchesPublisher;
  });

  renderBooks(filteredBooks);
}

searchTitleInput?.addEventListener('input', applyFilters);
publisherSelect?.addEventListener('change', applyFilters);

async function init(): Promise<void> {
  allBooks = await fetchAllBooks();
  updateHeaderFavoritesBadge();
  populatePublisherSelect(publisherSelect, allBooks);
  renderBooks(allBooks);
}

init();
