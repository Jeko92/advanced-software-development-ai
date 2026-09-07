import { ThreadResponseDto } from './thread-response.dto';
import { Expose, Type } from 'class-transformer';
import { CommentResponseDto } from '../../comments/dto/comment-response.dto';

export class ThreadWithCommentsResponseDto extends ThreadResponseDto {
  @Expose()
  @Type(() => CommentResponseDto)
  comments!: CommentResponseDto[];
}
