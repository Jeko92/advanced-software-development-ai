import { CreateConcertDto } from './create-concert.dto.ts';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateConcertDto extends PartialType(CreateConcertDto) {}
