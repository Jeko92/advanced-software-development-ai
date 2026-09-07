import { Expose } from 'class-transformer';
import type { UserRole } from '../entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ format: 'uuid' })
  @Expose()
  id!: string;

  @ApiProperty({ example: 'admin' })
  @Expose()
  username!: string;

  @ApiProperty({ enum: ['viewer', 'editor', 'admin'], isArray: true })
  @Expose()
  roles!: UserRole[];
}
