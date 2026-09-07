import { IsInt, IsOptional, Min, Max, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationQueryDto {
  @ApiPropertyOptional({ minimum: 1, default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page: number = 1;

  @ApiPropertyOptional({ minimum: 1, maximum: 100, default: 10 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit: number = 10;

  @ApiPropertyOptional({ enum: ['createdAt', '-createdAt'] })
  @IsOptional()
  @IsIn(['createdAt', '-createdAt'])
  sort?: 'createdAt' | '-createdAt';

  @ApiPropertyOptional({ description: 'Filter by author username' })
  @IsOptional()
  author?: string;

  @ApiPropertyOptional({
    format: 'date-time',
    description: 'Only return threads created on or after this date',
  })
  @IsOptional()
  startDate?: string;
}
