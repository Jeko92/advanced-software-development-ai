import { IsNotEmpty, IsString } from 'class-validator';

export class CreateThreadDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  body!: string;
}
