import { PartialType } from '@nestjs/mapped-types';
import { CreateQuoteDto } from './create-quote.dto.ts';

export class UpdateQuoteDto extends PartialType(CreateQuoteDto) {}
