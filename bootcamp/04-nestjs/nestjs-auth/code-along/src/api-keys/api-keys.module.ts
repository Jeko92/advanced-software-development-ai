import { Module } from '@nestjs/common';
import { ApiKeysService } from './api-keys.service.ts';
import { ApiKeysController } from './api-keys.controller.ts';
import { ApiKey } from './entities/api-key.entity.ts';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ApiKey])],
  controllers: [ApiKeysController],
  providers: [ApiKeysService],
  exports: [ApiKeysService],
})
export class ApiKeysModule {}
