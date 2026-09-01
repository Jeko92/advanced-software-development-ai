import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    description:
      'Email address used to log in. Must not already be registered.',
    format: 'email',
    example: 'seller@darkbay.dev',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    description: 'Plaintext password. Stored only as a bcrypt hash.',
    minLength: 8,
    maxLength: 72,
    example: 'correct-horse-battery',
  })
  @IsString()
  @MinLength(8)
  // bcrypt silently ignores anything past 72 bytes, so reject it up front
  // rather than accept a password whose tail does nothing.
  @MaxLength(72)
  password!: string;
}
