import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ConcertsService } from './concerts.service.ts';
import { CreateConcertDto } from './dto/create-concert.dto.ts';
import { UpdateConcertDto } from './dto/update-concert.dto.ts';
import { PaginationQueryDto } from './dto/pagination-query.dto.ts';

@Controller('concerts')
export class ConcertsController {
  constructor(private readonly concertsService: ConcertsService) {}

  @Get()
  findAll(@Query() pagination: PaginationQueryDto) {
    return this.concertsService.findAll(pagination);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.concertsService.findOne(id);
  }

  @Post()
  create(@Body() body: CreateConcertDto) {
    return this.concertsService.create(body);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateConcertDto,
  ) {
    return this.concertsService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.concertsService.remove(id);
  }
}
