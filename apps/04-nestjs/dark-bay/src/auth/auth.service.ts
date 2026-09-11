import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { compareSecret } from '../common/utils/hash.utils';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<Omit<User, 'passwordHash'> | null> {
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      return null;
    }

    const isMatch = await compareSecret(password, user.passwordHash);
    if (!isMatch) {
      return null;
    }

    const { passwordHash: _passwordHash, ...safeUser } = user;
    return safeUser;
  }

  login(user: Omit<User, 'passwordHash'>): { access_token: string } {
    const payload = {
      sub: user.id,
      username: user.username,
      roles: user.roles,
    };
    return { access_token: this.jwtService.sign(payload) };
  }
}
