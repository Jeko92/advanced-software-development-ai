type USER_ROLE = 'admin' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  roles: USER_ROLE[];
}

export type PublicUser = Omit<User, 'password'>;
