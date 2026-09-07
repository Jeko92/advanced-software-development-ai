import { ThreadResponseDto } from './thread-response.dto';
import { ApiProperty } from '@nestjs/swagger';

class PaginationMetaDto {
  @ApiProperty() page!: number;
  @ApiProperty() limit!: number;
  @ApiProperty() total!: number;
  @ApiProperty() totalPages!: number;
}

export class PaginatedThreadsResponseDto {
  @ApiProperty({ type: () => ThreadResponseDto, isArray: true })
  data!: ThreadResponseDto[];

  @ApiProperty({ type: () => PaginationMetaDto })
  meta!: PaginationMetaDto;
}
