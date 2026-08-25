export interface User {
  id: string;
  name: string;
  email: string;
}

export const USERS: User[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com' },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com' },
  { id: '3', name: 'Carla Diaz', email: 'carla@example.com' },
  { id: '4', name: 'David Kim', email: 'david@example.com' },
  { id: '5', name: 'Elena Rossi', email: 'elena@example.com' },
];
