import {
  Injectable,
  UnauthorizedException,
  type CanActivate,
  type ExecutionContext,
} from '@nestjs/common';
import { UsersService } from '../../users/users.service.ts';

@Injectable()
export class SessionAuthGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.session?.userId;

    if (!userId) {
      throw new UnauthorizedException();
    }

    try {
      const user = await this.usersService.findOne(userId);
      request.user = {
        userId: user.id,
        username: user.username,
        roles: user.roles,
      };
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
