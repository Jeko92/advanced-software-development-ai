import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto.ts';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
