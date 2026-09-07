import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import type { User } from '../users/entities/user.entity';
import { compareSecret } from '../common/utils/hash.util';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<Omit<User, 'passwordHash'> | null> {
    const user = await this.usersService.findByUsername(username);
    if (user && (await compareSecret(password, user.passwordHash))) {
      const { passwordHash: _, ...result } = user;
      return result;
    }

    return null;
  }

  login(user: Omit<User, 'passwordHash'>) {
    const payload = {
      sub: user.id,
      username: user.username,
      roles: user.roles,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
