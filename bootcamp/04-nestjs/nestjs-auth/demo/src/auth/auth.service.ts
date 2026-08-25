import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service.ts';
import * as bcrypt from 'bcrypt';
import { type PublicUser } from '../users/users.interface.ts';

export type AuthenticatedUser = PublicUser;

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<AuthenticatedUser | null> {
    const user = this.usersService.findByEmailWithPassword(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password: _, ...result } = user;
      return result;
    }
    return null;
  }

  login(user: AuthenticatedUser) {
    const payload = {
      email: user.email,
      sub: user.id,
      roles: user.roles,
      isTestingToken: true,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
