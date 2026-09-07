import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { LoginDto } from './dto/login.dto';

const FIXTURE_USER = { username: 'alice', password: 'secret' };

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(loginDto: LoginDto): Promise<{ access_token: string }> {
    if (
      loginDto.username !== FIXTURE_USER.username ||
      loginDto.password !== FIXTURE_USER.password
    ) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const access_token = await this.jwtService.signAsync({
      username: loginDto.username,
    });

    return { access_token };
  }
}
