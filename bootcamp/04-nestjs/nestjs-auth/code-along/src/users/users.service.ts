import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.ts';
import { UpdateUserDto } from './dto/update-user.dto.ts';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity.ts';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from './dto/user-response.dto.ts';
import { hashSecret } from '../common/utils/hash.util.ts';

@Injectable()
export class UsersService {
  @InjectRepository(User)
  private readonly users!: Repository<User>;

  async create(body: CreateUserDto) {
    const user = this.users.create(body);
    const { password } = body;
    const hashedPassword = hashSecret(password);
    const savedUser = await this.users.save({
      ...user,
      password: hashedPassword,
      roles: ['viewer'],
    });

    return plainToInstance(UserResponseDto, savedUser, {
      excludeExtraneousValues: true,
    });
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.users.find();

    return plainToInstance(UserResponseDto, users, {
      excludeExtraneousValues: true,
    });
  }

  async findOne(id: string) {
    const user = await this.findUserEntity(id);

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found.`);
    }

    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  findByUsername(username: string): Promise<User | null> {
    return this.users.findOneBy({ username });
  }

  async findOrCreateByEmail(email: string): Promise<User> {
    // Normalize case so "Name@gmail.com" and "name@gmail.com" resolve to
    // the same row — findByUsername/the DB's unique constraint are both
    // case-sensitive, and different OAuth providers (or a provider vs.
    // manual signup) aren't guaranteed to report the same casing.
    const normalizedEmail = email.toLowerCase();

    const existing = await this.findByUsername(normalizedEmail);
    if (existing) return existing;

    const unusablePassword = hashSecret(crypto.randomUUID());
    const user = this.users.create({
      username: normalizedEmail,
      password: unusablePassword,
      roles: ['viewer'],
    });
    return this.users.save(user);
  }

  async update(id: string, body: UpdateUserDto) {
    const user = await this.findUserEntity(id);

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found.`);
    }

    Object.assign(user, body);

    const updatedUser = await this.users.save(user);

    return plainToInstance(UserResponseDto, updatedUser, {
      excludeExtraneousValues: true,
    });
  }

  async remove(id: string) {
    const result = await this.users.delete(id);

    if ((result.affected ?? 0) === 0) {
      throw new NotFoundException(`User with id ${id} not found.`);
    }
  }

  private findUserEntity(id: string) {
    return this.users.findOne({
      where: { id },
    });
  }
}
