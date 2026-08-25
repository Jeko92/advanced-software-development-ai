import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateApiKeyDto {
  @IsString()
  @IsNotEmpty()
  label!: string;

  @IsBoolean()
  active!: boolean;
}
