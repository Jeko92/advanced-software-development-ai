import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Concert } from './entities/concert.entity.ts';
import { Repository } from 'typeorm';
import type { UpdateConcertDto } from './dto/update-concert.dto.ts';
import type { CreateConcertDto } from './dto/create-concert.dto.ts';
import { plainToInstance } from 'class-transformer';
import { ConcertResponseDto } from './dto/concert-response.dto.ts';
import type { PaginationQueryDto } from './dto/pagination-query.dto.ts';

@Injectable()
export class ConcertsService {
  @InjectRepository(Concert)
  private readonly concerts!: Repository<Concert>;

  private findConcertEntity(id: string) {
    return this.concerts.findOne({
      where: { id },
    });
  }

  async findAll(pagination: PaginationQueryDto) {
    const { page, limit, sort, genre } = pagination;

    const [data, total] = await this.concerts.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      where: genre ? { genre } : {},
      order: { date: sort === '-date' ? 'DESC' : 'ASC' },
    });

    return {
      data: plainToInstance(ConcertResponseDto, data, {
        excludeExtraneousValues: true,
      }),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const concert = await this.findConcertEntity(id);

    if (!concert) {
      throw new NotFoundException(`Concert with id ${id} not found.`);
    }

    return plainToInstance(ConcertResponseDto, concert, {
      excludeExtraneousValues: true,
    });
  }

  async create(body: CreateConcertDto) {
    const concert = this.concerts.create(body);
    const savedConcert = await this.concerts.save(concert);

    return plainToInstance(ConcertResponseDto, savedConcert, {
      excludeExtraneousValues: true,
    });
  }

  async update(id: string, body: UpdateConcertDto) {
    const concert = await this.findConcertEntity(id);

    if (!concert) {
      throw new NotFoundException(`Concert with id ${id} not found.`);
    }

    Object.assign(concert, body);

    const updatedConcert = await this.concerts.save(concert);

    return plainToInstance(ConcertResponseDto, updatedConcert, {
      excludeExtraneousValues: true,
    });
  }

  async remove(id: string) {
    const result = await this.concerts.delete(id);

    if ((result.affected ?? 0) === 0) {
      throw new NotFoundException(`Concert with id ${id} not found.`);
    }
  }
}
