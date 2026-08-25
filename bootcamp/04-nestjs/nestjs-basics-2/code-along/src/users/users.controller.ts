import {
  Body,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Controller,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service.ts';
import type { User } from './entities/user.entity.ts';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  getAll() {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    const user = this.userService.getUserById(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  @Post()
  create(@Body() body: Omit<User, 'id'>) {
    return this.userService.addNewUser(body);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: Partial<User>) {
    const user = this.userService.updateUser(id, body);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const removed = this.userService.deleteUser(id);
    if (!removed) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return { deleted: true };
  }
}
