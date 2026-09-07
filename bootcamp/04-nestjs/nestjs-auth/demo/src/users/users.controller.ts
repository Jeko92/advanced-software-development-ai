import { Controller, Get, UseGuards } from '@nestjs/common';
import { IsAdminGuard } from '../common/guards/is-admin.guard.ts';
import { UsersRepository } from './users.repository.ts';

@Controller('users')
export class UsersController {
  constructor(private readonly usersRepository: UsersRepository) {}

  @UseGuards(IsAdminGuard)
  @Get()
  findAll() {
    return this.usersRepository.findAll();
  }
}
