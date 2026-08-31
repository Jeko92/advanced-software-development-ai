import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service.ts';
import type { User } from './entities/user.entity.ts';
import { CreateUserDto } from './dto/create-user.dto.ts';
import { AuthGuard } from '../auth/auth.guard.ts';

@Controller('users')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  getUserById(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.userService.findById(id);
  }

  @Get(':id/name')
  getUserName(@Param('id', ParseIntPipe) id: number): Promise<string> {
    return this.userService.getUserName(id);
  }

  @Get('is-adult')
  isAdult(@Query('age', ParseIntPipe) age: number): boolean {
    return this.userService.isAdult(age);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
}
