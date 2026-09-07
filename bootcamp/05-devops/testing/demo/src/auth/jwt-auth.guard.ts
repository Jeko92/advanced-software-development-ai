import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Applied per route with `@UseGuards(JwtAuthGuard)`.
 *
 * This is the answer to "how do I protect writes while browsing stays public":
 * the guard is opt-in, so `GET /auctions` needs no token while `POST /auctions`
 * does. The alternative — registering this globally via `APP_GUARD` and marking
 * public routes with a custom `@Public()` decorator — is the better default once
 * an API has far more protected routes than open ones.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
