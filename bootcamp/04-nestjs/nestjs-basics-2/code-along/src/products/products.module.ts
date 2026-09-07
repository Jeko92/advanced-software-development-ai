import { Module } from '@nestjs/common';
import { ProductsService } from './products.service.ts';
import { ProductsController } from './products.controller.ts';
import { UsersModule } from '../users/users.module.ts';

@Module({
  imports: [UsersModule],
  providers: [ProductsService],
  controllers: [ProductsController],
})
export class ProductsModule {}
