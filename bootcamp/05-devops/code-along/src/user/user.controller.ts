import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { UserService } from './user.service.ts';
import type { User } from './entities/user.entity.ts';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id/name')
  getUserName(@Param('id', ParseIntPipe) id: number): Promise<string> {
    return this.userService.getUserName(id);
  }

  @Get('is-adult')
  isAdult(@Query('age', ParseIntPipe) age: number): boolean {
    return this.userService.isAdult(age);
  }
}
