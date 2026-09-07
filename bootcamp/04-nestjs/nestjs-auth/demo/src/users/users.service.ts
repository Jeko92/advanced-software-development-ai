import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository.ts';
import { type PublicUser, type User } from './users.interface.ts';
import { type UserPayload } from './users.dto.ts';
import { isValidEmail } from '../common/email.util.ts';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UsersRepository) {}

  getAllUsers(): PublicUser[] {
    return this.userRepository.findAll();
  }

  getUserById(id: string): PublicUser | undefined {
    return this.userRepository.findById(id);
  }

  findByEmail(email: string): Promise<PublicUser | null> {
    return this.userRepository.findOneBy({ email });
  }

  findByEmailWithPassword(email: string): User | undefined {
    return this.userRepository.findByEmailWithPassword(email);
  }

  addNewUser(name: string, email: string, password: string): PublicUser {
    if (!name || name.trim().length < 2) {
      throw new Error('Name must be at least 2 characters');
    }

    if (!isValidEmail(email)) {
      throw new Error('Invalid email format');
    }

    const existing = this.userRepository.findByEmail(email);
    if (existing) {
      throw new Error(`User with email ${email} already exists`);
    }

    return this.userRepository.create({ name, email, password });
  }

  updateUser(
    id: string,
    name?: string,
    email?: string,
    password?: string,
  ): PublicUser | undefined {
    if (name && name.trim().length < 2) {
      throw new Error('Invalid name format');
    }

    if (email && !isValidEmail(email)) {
      throw new Error('Invalid email format');
    }

    const updates: Partial<UserPayload> = {};
    if (name !== undefined) updates.name = name;
    if (email !== undefined) updates.email = email;
    if (password !== undefined) updates.password = password;

    return this.userRepository.update(id, updates);
  }

  deleteUser(id: string): boolean {
    return this.userRepository.delete(id);
  }
}
