import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.ts';
import { UpdateUserDto } from './dto/update-user.dto.ts';
import { InjectRepository } from '@nestjs/typeorm';
import { User, type UserRole } from './entities/user.entity.ts';
import { Repository } from 'typeorm';
import { hashSecret } from '../common/utils/hash.util.ts';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from './dto/user-response.dto.ts';
import { canBypassOwnership } from '../common/utils/authorization.util.ts';

@Injectable()
export class UsersService {
  @InjectRepository(User)
  private readonly users!: Repository<User>;

  async create(createUserDto: CreateUserDto) {
    const user = this.users.create(createUserDto);
    const { password } = createUserDto;
    const hashedPassword = hashSecret(password);
    const savedUser = await this.users.save({
      ...user,
      passwordHash: hashedPassword,
    });
    return plainToInstance(UserResponseDto, savedUser, {
      excludeExtraneousValues: true,
    });
  }

  async findAll(requesterRoles: UserRole[]): Promise<UserResponseDto[]> {
    if (!canBypassOwnership(requesterRoles)) {
      throw new ForbiddenException('You do not have permission to list users');
    }

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

  async update(
    id: string,
    body: UpdateUserDto,
    userId: string,
    userRoles: UserRole[],
  ) {
    const user = await this.findUserEntity(id);

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found.`);
    }

    if (id !== userId && !canBypassOwnership(userRoles)) {
      throw new ForbiddenException(
        'You do not have permission to update this user',
      );
    }

    const { password, ...rest } = body;
    Object.assign(user, rest);
    if (password) {
      user.passwordHash = hashSecret(password);
    }

    const updatedUser = await this.users.save(user);

    return plainToInstance(UserResponseDto, updatedUser, {
      excludeExtraneousValues: true,
    });
  }

  async remove(id: string, userId: string, userRoles: UserRole[]) {
    const user = await this.findUserEntity(id);

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found.`);
    }

    if (id !== userId && !canBypassOwnership(userRoles)) {
      throw new ForbiddenException(
        'You do not have permission to delete this user',
      );
    }

    await this.users.delete(id);
  }

  private findUserEntity(id: string) {
    return this.users.findOne({
      where: { id },
    });
  }
}
