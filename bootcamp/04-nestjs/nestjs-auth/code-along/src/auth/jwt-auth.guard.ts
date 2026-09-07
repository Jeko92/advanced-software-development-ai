import { Injectable, type ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import type { Request as ExpressRequest } from 'express';
import { IS_PUBLIC_KEY } from '../common/decorators/public.decorator';
import type { UserRoleType } from '../users/entities/user.entity';

export interface RequestWithJwtUser extends ExpressRequest {
  user: {
    userId: string;
    username: string;
    roles: UserRoleType[];
  };
}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  override canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }
}
