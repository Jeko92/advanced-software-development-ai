import {
  IsArray,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CommentResponse } from '../../comments/dto/CommentResponseDto';
import { Expose, Type } from 'class-transformer';

export class ThreadWithCommentsResponseDto {
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

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CommentResponse)
  @Expose()
  comments?: CommentResponse[];
}
