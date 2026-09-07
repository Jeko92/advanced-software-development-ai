import { Module } from '@nestjs/common';
import { AppController } from './app.controller.ts';
import { AppService } from './app.service.ts';
import { UsersModule } from './users/users.module.ts';
import { ProductsModule } from './products/products.module.ts';

@Module({
  imports: [UsersModule, ProductsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
