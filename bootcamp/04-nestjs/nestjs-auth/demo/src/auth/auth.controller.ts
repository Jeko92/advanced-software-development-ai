import { Controller, Post, UseGuards, Body, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { type AuthenticatedUser, AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Public } from '../common/decorators/public.decorator';

type AuthenticatedRequest = Request & {
  user: AuthenticatedUser;
};

@Public()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  login(@Request() req: AuthenticatedRequest, @Body() _loginDto: LoginDto) {
    return this.authService.login(req.user);
  }
}
