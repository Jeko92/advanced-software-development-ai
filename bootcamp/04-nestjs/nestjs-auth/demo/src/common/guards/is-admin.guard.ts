import {
  Injectable,
  type CanActivate,
  type ExecutionContext,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { isPublicHandler } from './is-public.util.ts';

@Injectable()
export class IsAdminGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    if (isPublicHandler(context, this.reflector)) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    return request.user?.roles?.includes('admin') ?? false;
  }
}
