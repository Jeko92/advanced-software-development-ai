import { Expose } from 'class-transformer';
import type { UserRoleType } from '../entities/user.entity';

export class UserResponseDto {
  @Expose()
  id!: string;

  @Expose()
  username!: string;

  @Expose()
  roles!: UserRoleType[];
}
