import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import type { Request as ExpressRequest } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import type { User } from '../users/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { Public } from '../common/decorators/public.decorator';
import { GoogleAuthGuard } from './google-auth.guard';
import { GithubAuthGuard } from './github-auth.guard';

export interface RequestWithUser extends ExpressRequest {
  user: Omit<User, 'password'>;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(AuthGuard('local'))
  @Post('login')
  login(@Request() req: RequestWithUser, @Body() _loginDto: LoginDto) {
    return this.authService.login(req.user);
  }

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google')
  googleLogin() {}

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  googleCallback(@Request() req: RequestWithUser) {
    return this.authService.login(req.user);
  }

  @Public()
  @UseGuards(GithubAuthGuard)
  @Get('github')
  githubLogin() {}

  @Public()
  @UseGuards(GithubAuthGuard)
  @Get('github/callback')
  githubCallback(@Request() req: RequestWithUser) {
    return this.authService.login(req.user);
  }
}
