import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateApiKeyDto } from './dto/create-api-key.dto.ts';
import { UpdateApiKeyDto } from './dto/update-api-key.dto.ts';
import { ApiKey } from './entities/api-key.entity.ts';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { hashSecret, compareSecret } from '../common/utils/hash.util.ts';
import { plainToInstance } from 'class-transformer';
import { CreatedApiKeyResponseDto } from './dto/created-api-key-response.dto.ts';
import { ApiKeyResponseDto } from './dto/api-key-response.dto.ts';

@Injectable()
export class ApiKeysService {
  @InjectRepository(ApiKey)
  private readonly apiKeys!: Repository<ApiKey>;

  async create(body: CreateApiKeyDto) {
    const rawKey = crypto.randomUUID();
    const hashedRawKey = hashSecret(rawKey);
    const savedApiKey = await this.apiKeys.save({
      ...body,
      keyHash: hashedRawKey,
    });

    return plainToInstance(
      CreatedApiKeyResponseDto,
      { ...savedApiKey, rawKey },
      { excludeExtraneousValues: true },
    );
  }

  async findAll(): Promise<ApiKeyResponseDto[]> {
    const apiKeys = await this.apiKeys.find();
    return plainToInstance(ApiKeyResponseDto, apiKeys, {
      excludeExtraneousValues: true,
    });
  }

  async findOne(id: string) {
    const apiKey = await this.findApiKeyEntity(id);
    if (!apiKey) {
      throw new NotFoundException(`Api key with id ${id} not found.`);
    }

    return plainToInstance(ApiKeyResponseDto, apiKey, {
      excludeExtraneousValues: true,
    });
  }

  async update(id: string, body: UpdateApiKeyDto) {
    const apiKey = await this.findApiKeyEntity(id);

    if (!apiKey) {
      throw new NotFoundException(`Api key with id ${id} not found.`);
    }

    Object.assign(apiKey, body);

    const updatedApiKey = await this.apiKeys.save(apiKey);
    return plainToInstance(ApiKeyResponseDto, updatedApiKey, {
      excludeExtraneousValues: true,
    });
  }

  async remove(id: string) {
    const result = await this.apiKeys.delete(id);

    if ((result.affected ?? 0) === 0) {
      throw new NotFoundException(`Api key with id ${id} not found.`);
    }
  }

  async isActiveApiKey(rawKey: string): Promise<boolean> {
    const activeApiKeys = await this.apiKeys.find({ where: { active: true } });
    for (const activeApiKey of activeApiKeys) {
      if (await compareSecret(rawKey, activeApiKey.keyHash)) {
        return true;
      }
    }
    return false;
  }

  private findApiKeyEntity(id: string) {
    return this.apiKeys.findOne({
      where: { id },
    });
  }
}
