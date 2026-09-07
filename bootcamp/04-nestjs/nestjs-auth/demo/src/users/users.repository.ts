import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { type PublicUser, type User } from './users.interface';
import { type UserPayload } from './users.dto';

@Injectable()
export class UsersRepository {
  private users: User[] = [
    {
      id: '1',
      name: 'Alice',
      email: 'alice@example.com',
      password: '$2a$10$F4riUmvzSvmOmFGGHewf1./99Qxn1Pa7LMtO1govG.TV6u68tCv62', // password
      roles: ['user', 'admin'],
    },
    {
      id: '2',
      name: 'Bob',
      email: 'bob@example.com',
      password: '$2a$10$F4riUmvzSvmOmFGGHewf1./99Qxn1Pa7LMtO1govG.TV6u68tCv62', // password
      roles: ['user'],
    },
  ];

  private toPublicUser(user: User): PublicUser {
    const { password: _, ...publicUser } = user;
    return publicUser;
  }

  findAll(): PublicUser[] {
    return this.users.map((user) => this.toPublicUser(user));
  }

  findById(id: string): PublicUser | undefined {
    const user = this.users.find((user) => user.id === id);
    return user ? this.toPublicUser(user) : undefined;
  }

  findOneBy(filter: Partial<User>): Promise<PublicUser | null> {
    const entries = Object.entries(filter) as [keyof User, User[keyof User]][];
    const user = this.users.find((u) =>
      entries.every(([key, value]) => u[key] === value),
    );
    return Promise.resolve(user ? this.toPublicUser(user) : null);
  }

  findByEmail(email: string): PublicUser | undefined {
    const user = this.users.find((user) => user.email === email);
    return user ? this.toPublicUser(user) : undefined;
  }

  findByEmailWithPassword(email: string): User | undefined {
    return this.users.find((user) => user.email === email);
  }

  create(data: UserPayload): PublicUser {
    const user: User = {
      id: Date.now().toString(),
      ...data,
      password: bcrypt.hashSync(data.password, 10),
      roles: ['user'],
    };
    this.users.push(user);
    return this.toPublicUser(user);
  }

  update(id: string, data: Partial<UserPayload>): PublicUser | undefined {
    const index = this.users.findIndex((user) => user.id === id);
    const current = this.users[index];
    if (!current) return undefined;
    if (data.password) {
      data.password = bcrypt.hashSync(data.password, 10);
    }
    const updated: User = { ...current, ...data };
    this.users[index] = updated;
    return this.toPublicUser(updated);
  }

  delete(id: string): boolean {
    const before = this.users.length;
    this.users = this.users.filter((user) => user.id !== id);
    return this.users.length < before;
  }
}
