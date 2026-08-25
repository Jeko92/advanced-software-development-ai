export interface Product {
  id: string;
  name: string;
  price: number;
  /** id of the User (see src/users/entities/user.entity.ts) who owns this product */
  ownerId: string;
}

export const PRODUCTS: Product[] = [
  { id: '1', name: 'Mechanical Keyboard', price: 89.99, ownerId: '1' },
  { id: '2', name: 'Standing Desk', price: 349.0, ownerId: '1' },
  { id: '3', name: 'Noise-Cancelling Headphones', price: 199.5, ownerId: '2' },
  { id: '4', name: 'Ultrawide Monitor', price: 429.0, ownerId: '3' },
  { id: '5', name: 'Ergonomic Chair', price: 259.99, ownerId: '4' },
  { id: '6', name: 'Webcam 4K', price: 79.0, ownerId: '5' },
];
