import { Controller, Get, UseGuards } from '@nestjs/common';
import { IsAdminGuard } from '../common/guards/is-admin.guard';
import { UsersRepository } from './users.repository';

@Controller('users')
export class UsersController {
  constructor(private readonly usersRepository: UsersRepository) {}

  @UseGuards(IsAdminGuard)
  @Get()
  findAll() {
    return this.usersRepository.findAll();
  }
}
