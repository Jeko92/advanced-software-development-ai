import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service.ts';
import type { Product } from './entities/product.entity.ts';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  getAll(@Query('ownerId') ownerId?: string) {
    return this.productsService.getProductsWithOwners(ownerId);
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    const product = this.productsService.getProductById(id);
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return product;
  }

  @Post()
  create(@Body() body: Omit<Product, 'id'>) {
    return this.productsService.addNewProduct(body);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: Partial<Product>) {
    const product = this.productsService.updateProduct(id, body);
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return product;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const removed = this.productsService.deleteProduct(id);
    if (!removed) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return { deleted: true };
  }
}
