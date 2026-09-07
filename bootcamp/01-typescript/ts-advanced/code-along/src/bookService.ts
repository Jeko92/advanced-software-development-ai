import type { Book, BookCreatePayload, ApiResponse } from './types/book';

export const createBook = (
  payload: BookCreatePayload,
): Promise<ApiResponse<Book>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const createdBook: Book = {
        id: Date.now().toString(),
        ...payload,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      resolve({
        status: 201,
        message: 'Book created',
        data: createdBook,
      });
    }, 500);
  });
};
