import { IsInt, IsOptional, Min, Max, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationQueryDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit: number = 10;

  @IsOptional()
  @IsIn(['createdAt', '-createdAt'])
  sort?: 'createdAt' | '-createdAt';

  @IsOptional()
  author?: string;

  @IsOptional()
  startDate?: string;
}
