import {
  Injectable,
  UnauthorizedException,
  type CanActivate,
  type ExecutionContext,
} from '@nestjs/common';
import { AuthService } from '../../auth/auth.service.ts';

@Injectable()
export class BasicAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.toLowerCase().startsWith('basic ')) {
      throw new UnauthorizedException('Missing or invalid Authorization header');
    }

    const decoded = Buffer.from(authHeader.slice(6), 'base64').toString(
      'utf-8',
    );

    const indexOfSeparator = decoded.indexOf(':');
    if (indexOfSeparator === -1) {
      throw new UnauthorizedException('Malformed credentials');
    }

    const username = decoded.slice(0, indexOfSeparator);
    const password = decoded.slice(indexOfSeparator + 1);

    const user = await this.authService.validateUser(username, password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    request.user = {
      userId: user.id,
      username: user.username,
      roles: user.roles,
    };

    return true;
  }
}
