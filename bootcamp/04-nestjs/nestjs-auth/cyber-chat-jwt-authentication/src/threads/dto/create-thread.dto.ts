import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateThreadDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  title!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(4000)
  body!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  author!: string;
}
