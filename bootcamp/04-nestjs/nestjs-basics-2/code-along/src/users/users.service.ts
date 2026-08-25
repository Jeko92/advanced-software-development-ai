import { Injectable } from '@nestjs/common';
import { type User, USERS } from './entities/user.entity.ts';

@Injectable()
export class UsersService {
  private users: User[] = [...USERS];

  getAllUsers() {
    return this.users;
  }

  getUserById(id: string) {
    return this.users.find((user) => user.id === id);
  }

  addNewUser(body: Omit<User, 'id'>) {
    const nextId = (
      Math.max(0, ...this.users.map((user) => Number(user.id))) + 1
    ).toString();

    const newUser: User = { id: nextId, ...body };
    this.users.push(newUser);

    return newUser;
  }

  updateUser(id: string, body: Partial<User>) {
    const user = this.getUserById(id);
    if (!user) return undefined;

    Object.assign(user, body, { id: user.id });

    return user;
  }

  deleteUser(id: string) {
    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) return false;

    this.users.splice(index, 1);

    return true;
  }
}
