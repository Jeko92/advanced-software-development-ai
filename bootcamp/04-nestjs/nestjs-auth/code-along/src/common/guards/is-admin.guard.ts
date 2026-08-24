import {
  Injectable,
  type CanActivate,
  type ExecutionContext,
} from '@nestjs/common';

@Injectable()
export class IsAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    return request.user?.roles?.includes('admin') ?? false;
  }
}
