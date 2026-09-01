import { ApiProperty } from '@nestjs/swagger';
import { User } from '../user.entity.ts';

/**
 * The public shape of a user.
 *
 * Response DTOs exist so the entity — which knows about password hashes and
 * relations — never travels to the client. Adding a column to the entity does
 * not silently widen the API surface.
 */
export class UserResponseDto {
  @ApiProperty({
    format: 'uuid',
    example: '3f1c2b7e-9a4d-4f61-8b2a-7c5d1e0f9a33',
  })
  id!: string;

  @ApiProperty({ format: 'email', example: 'seller@darkbay.dev' })
  email!: string;

  static fromEntity(user: User): UserResponseDto {
    const dto = new UserResponseDto();
    dto.id = user.id;
    dto.email = user.email;
    return dto;
  }
}
