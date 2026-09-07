import { ThreadResponseDto } from './thread-response.dto';
import { Expose, Type } from 'class-transformer';
import { CommentResponseDto } from '../../comments/dto/comment-response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class ThreadWithCommentsResponseDto extends ThreadResponseDto {
  @ApiProperty({ type: () => CommentResponseDto, isArray: true })
  @Expose()
  @Type(() => CommentResponseDto)
  comments!: CommentResponseDto[];
}
