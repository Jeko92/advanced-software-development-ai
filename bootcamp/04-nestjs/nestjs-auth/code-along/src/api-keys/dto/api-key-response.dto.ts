import { Expose } from 'class-transformer';

export class ApiKeyResponseDto {
  @Expose()
  id!: string;

  @Expose()
  label!: string;

  @Expose()
  active!: boolean;
}
