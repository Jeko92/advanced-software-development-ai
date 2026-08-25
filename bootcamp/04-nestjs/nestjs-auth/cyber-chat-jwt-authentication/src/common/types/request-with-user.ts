import type { Request as ExpressRequest } from 'express';
import type { User } from '../../users/entities/user.entity.ts';

export interface RequestWithUser extends ExpressRequest {
  user: Omit<User, 'passwordHash'>;
}
