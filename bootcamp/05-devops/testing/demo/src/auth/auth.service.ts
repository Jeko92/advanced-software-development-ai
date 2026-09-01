import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service.ts';
import { User } from '../users/user.entity.ts';
import { UserResponseDto } from '../users/dto/user-response.dto.ts';
import { AuthResponseDto } from './dto/auth-response.dto.ts';
import { RegisterDto } from './dto/register.dto.ts';
import { LoginDto } from './dto/login.dto.ts';
import type { JwtPayload } from './jwt-payload.interface.ts';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    const user = await this.usersService.create(dto.email, dto.password);
    return this.buildAuthResponse(user);
  }

  /**
   * Verifies credentials and issues a token.
   *
   * Both failure modes — unknown email and wrong password — produce the same
   * message on purpose. A more specific error would tell an attacker which
   * email addresses are registered.
   */
  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.usersService.findByEmailWithPassword(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatches = await this.usersService.verifyPassword(
      dto.password,
      user.passwordHash,
    );
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.buildAuthResponse(user);
  }

  private async buildAuthResponse(user: User): Promise<AuthResponseDto> {
    const payload: JwtPayload = { sub: user.id, email: user.email };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      user: UserResponseDto.fromEntity(user),
    };
  }
}
