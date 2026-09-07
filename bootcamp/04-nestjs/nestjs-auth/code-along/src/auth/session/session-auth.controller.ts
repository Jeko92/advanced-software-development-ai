import {
  Body,
  Controller,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import type { Request as ExpressRequest } from 'express';
import { Public } from '../../common/decorators/public.decorator';
import { SessionAuthGuard } from './session-auth.guard';
import { AuthService } from '../auth.service';
import { LoginDto } from '../dto/login.dto';

@Controller('auth/session')
export class SessionAuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Request() req: ExpressRequest) {
    const validatedUser = await this.authService.validateUser(
      loginDto.username,
      loginDto.password,
    );
    if (!validatedUser) {
      throw new UnauthorizedException(
        'Wrong credentials. Please try again with correct ones.',
      );
    } else {
      req.session.userId = validatedUser.id;
      return { message: 'Logged in' };
    }
  }

  @Public()
  @UseGuards(SessionAuthGuard)
  @Post('logout')
  logout(@Request() req: ExpressRequest) {
    return new Promise((resolve, reject) => {
      req.session.destroy((err: unknown) => {
        if (err) {
          reject(err);
          return;
        }
        resolve({ message: 'Logged out' });
      });
    });
  }
}
