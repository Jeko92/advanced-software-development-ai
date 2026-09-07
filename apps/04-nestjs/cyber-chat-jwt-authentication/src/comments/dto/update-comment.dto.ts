import { PartialType } from '@nestjs/mapped-types';
import { CreateCommentDto } from './create-comment.dto.ts';

export class UpdateCommentDto extends PartialType(CreateCommentDto) {}
