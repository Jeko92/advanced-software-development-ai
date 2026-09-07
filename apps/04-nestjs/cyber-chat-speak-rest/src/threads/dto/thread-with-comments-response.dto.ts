import { ThreadResponseDto } from './thread-response.dto.ts';
import { Expose, Type } from 'class-transformer';
import { CommentResponseDto } from '../../comments/dto/comment-response.dto.ts';

export class ThreadWithCommentsResponseDto extends ThreadResponseDto {
  @Expose()
  @Type(() => CommentResponseDto)
  comments!: CommentResponseDto[];
}
