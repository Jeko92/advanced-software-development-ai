import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity.ts';

/** Cost factor for bcrypt. Higher is slower to crack — and slower to log in. */
const BCRYPT_ROUNDS = 10;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  /**
   * Creates an account, storing only the hash of the password.
   *
   * The unique index on `email` is the real guard against duplicates; this
   * lookup just turns the race into a friendly 409 in the common case.
   */
  async create(email: string, password: string): Promise<User> {
    const existing = await this.usersRepository.findOne({ where: { email } });
    if (existing) {
      throw new ConflictException('An account with this email already exists');
    }

    const user = this.usersRepository.create({
      email,
      passwordHash: await bcrypt.hash(password, BCRYPT_ROUNDS),
    });

    return this.usersRepository.save(user);
  }

  findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  /**
   * Looks a user up for the login flow.
   *
   * `passwordHash` is declared `select: false` on the entity, so it has to be
   * requested explicitly here. Every other query stays safe by default.
   */
  findByEmailWithPassword(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
      select: ['id', 'email', 'passwordHash', 'createdAt'],
    });
  }

  /** Constant-time comparison of a candidate password against the stored hash. */
  verifyPassword(password: string, passwordHash: string): Promise<boolean> {
    return bcrypt.compare(password, passwordHash);
  }
}
