import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'neo' })
  @IsString()
  @IsNotEmpty()
  username!: string;

  @ApiProperty({ minLength: 8, format: 'password', example: 'wakeUpNeo123' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password!: string;
}
