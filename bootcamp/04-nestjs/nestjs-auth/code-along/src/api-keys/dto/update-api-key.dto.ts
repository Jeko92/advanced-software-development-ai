import { PartialType } from '@nestjs/mapped-types';
import { CreateApiKeyDto } from './create-api-key.dto.ts';

export class UpdateApiKeyDto extends PartialType(CreateApiKeyDto) {}
