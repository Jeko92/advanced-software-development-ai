import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service.ts';
import { User } from '../users/entities/user.entity.ts';
import { compareSecret } from '../common/utils/hash.util.ts';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.usersService.findByUsername(username);
    if (user && (await compareSecret(password, user.password))) {
      const { password: _, ...result } = user;
      return result;
    }

    return null;
  }

  login(user: Omit<User, 'password'>) {
    const payload = {
      username: user.username,
      sub: user.id,
      roles: user.roles,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
