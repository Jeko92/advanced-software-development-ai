import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service.ts';
import { User } from '../users/user.entity.ts';
import type { JwtPayload } from './jwt-payload.interface.ts';

/**
 * Turns a bearer token into a `User`.
 *
 * Passport verifies the signature and expiry before `validate()` is called —
 * so by the time this method runs, the payload is known to be authentic.
 * Whatever it returns is attached to `request.user`.
 *
 * The database lookup is not redundant: a token stays cryptographically valid
 * until it expires, even if the account behind it was deleted in the meantime.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>(
        'JWT_SECRET',
        'dev-only-secret-change-me',
      ),
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException(
        'The account for this token no longer exists',
      );
    }
    return user;
  }
}
