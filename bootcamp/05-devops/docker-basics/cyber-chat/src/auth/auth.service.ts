import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import type { User, ValidatedUser } from '../users/entity/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<ValidatedUser | null> {
    const user = await this.usersService.findByUsername(username);
    if (user && user.password === password) {
      return { username: user.username, id: user.id, roles: user.roles }; //
    }
    return null;
  }

  login(user: ValidatedUser): { access_token: string } {
    const payload = {
      username: user.username,
      sub: user.id,
      roles: user.roles,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  register(user: Pick<User, 'username' | 'password'>): Promise<User> {
    return this.usersService.create({ ...user, roles: ['USER'] });
  }
}
