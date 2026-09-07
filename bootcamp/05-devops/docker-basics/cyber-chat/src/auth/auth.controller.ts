import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { LoginDto } from './LoginDto';
import { RegisterDto } from './RegisterDto';
import type { User, ValidatedUser } from '../users/entity/user.entity';
import type { RequestWith } from './RequestWith';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local')) // calls validate(), uses local strategy to append user to request
  @Post('login')
  login(
    @Request() request: RequestWith<ValidatedUser>,
    @Body() _loginDto: LoginDto,
  ): { access_token: string } {
    return this.authService.login(request.user);
  }

  @Post('register')
  async register(@Body() dto: RegisterDto): Promise<User> {
    return this.authService.register(dto);
  }
}
