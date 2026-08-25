import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import type { Request as ExpressRequest } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service.ts';
import { LoginDto } from './dto/login.dto.ts';
import { CreateUserDto } from '../users/dto/create-user.dto.ts';
import { UsersService } from '../users/users.service.ts';
import { Public } from '../common/decorators/public.decorator.ts';
import type { User } from '../users/entities/user.entity.ts';

export interface RequestWithUser extends ExpressRequest {
  user: Omit<User, 'passwordHash'>;
}

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Public()
  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Public()
  @UseGuards(AuthGuard('local'))
  @Post('login')
  login(@Request() req: RequestWithUser, @Body() _loginDto: LoginDto) {
    return this.authService.login(req.user);
  }

  @Get('me')
  me(@Request() req: RequestWithUser) {
    return req.user;
  }
}
