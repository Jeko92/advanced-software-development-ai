import { createParamDecorator } from '@nestjs/common';
import type { ExecutionContext } from '@nestjs/common';
import { User } from '../users/user.entity';

/**
 * Injects the user that `JwtStrategy.validate()` put on the request.
 *
 * Controllers then read identity as a first-class parameter instead of digging
 * through `@Req()` — and it is only ever populated on routes behind
 * `JwtAuthGuard`, which is exactly where identity is trustworthy.
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): User => {
    const request = context.switchToHttp().getRequest();
    return request.user;
  },
);
