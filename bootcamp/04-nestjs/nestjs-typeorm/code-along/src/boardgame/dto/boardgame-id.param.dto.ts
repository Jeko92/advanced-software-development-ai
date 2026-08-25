import { IsUUID } from 'class-validator';

export class BoardgameIdParamDto {
  @IsUUID()
  id!: string;
}
