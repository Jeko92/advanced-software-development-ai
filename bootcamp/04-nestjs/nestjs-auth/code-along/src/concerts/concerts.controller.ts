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
import { ConcertsService } from './concerts.service';
import { CreateConcertDto } from './dto/create-concert.dto';
import { UpdateConcertDto } from './dto/update-concert.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { Public } from '../common/decorators/public.decorator';
import { SessionAuthGuard } from '../auth/session/session-auth.guard';
import { IsAdminGuard } from '../common/guards/is-admin.guard';

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
