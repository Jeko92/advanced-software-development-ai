import { Expose } from 'class-transformer';
import { IsDate, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class ThreadResponseDto {
  @IsInt()
  @IsNotEmpty()
  @Expose()
  id!: number;

  @IsString()
  @IsNotEmpty()
  @Expose()
  title!: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  author!: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  body!: string;

  @IsDate()
  @IsNotEmpty()
  @Expose()
  createdAt!: Date;
}
