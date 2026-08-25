import { Expose } from 'class-transformer';

export class CreatedApiKeyResponseDto {
  @Expose()
  id!: string;

  @Expose()
  label!: string;

  @Expose()
  active!: boolean;

  @Expose()
  createdAt!: Date;

  @Expose()
  rawKey!: string;
}
