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
  UseGuards,
} from '@nestjs/common';
import { ConcertsService } from './concerts.service.ts';
import { CreateConcertDto } from './dto/create-concert.dto.ts';
import { UpdateConcertDto } from './dto/update-concert.dto.ts';
import { PaginationQueryDto } from './dto/pagination-query.dto.ts';
import { Public } from '../common/decorators/public.decorator.ts';
import { SessionAuthGuard } from '../auth/session/session-auth.guard.ts';
import { IsAdminGuard } from '../common/guards/is-admin.guard.ts';

@Controller('concerts')
export class ConcertsController {
  constructor(private readonly concertsService: ConcertsService) {}

  @Public()
  @Get()
  findAll(@Query() pagination: PaginationQueryDto) {
    return this.concertsService.findAll(pagination);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.concertsService.findOne(id);
  }

  @Public()
  @UseGuards(SessionAuthGuard, IsAdminGuard)
  @Post()
  create(@Body() body: CreateConcertDto) {
    return this.concertsService.create(body);
  }

  @Public()
  @UseGuards(SessionAuthGuard, IsAdminGuard)
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateConcertDto,
  ) {
    return this.concertsService.update(id, body);
  }

  @Public()
  @UseGuards(SessionAuthGuard, IsAdminGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.concertsService.remove(id);
  }
}
