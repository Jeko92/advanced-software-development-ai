import { Injectable } from '@nestjs/common';
import { User } from './entity/user.entity';
import type { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  findById(id: string) {
    return this.usersRepository.findOneBy({ id });
  }

  findByUsername(username: string) {
    return this.usersRepository.findOneBy({ username });
  }

  create(user: Omit<User, 'id'>) {
    return this.usersRepository.save(user);
  }
}
