import { Injectable } from '@nestjs/common';
import { type Product, PRODUCTS } from './entities/product.entity.ts';
import { UsersService } from '../users/users.service.ts';

@Injectable()
export class ProductsService {
  private products: Product[] = [...PRODUCTS];

  constructor(private readonly usersService: UsersService) {}

  getAllProducts(ownerId?: string) {
    return ownerId
      ? this.products.filter((product) => product.ownerId === ownerId)
      : this.products;
  }

  getProductById(id: string) {
    return this.products.find((product) => product.id === id);
  }

  addNewProduct(body: Omit<Product, 'id'>) {
    const nextId = (
      Math.max(0, ...this.products.map((product) => Number(product.id))) + 1
    ).toString();

    const newProduct: Product = { id: nextId, ...body };
    this.products.push(newProduct);

    return newProduct;
  }

  updateProduct(id: string, body: Partial<Product>) {
    const product = this.getProductById(id);
    if (!product) return undefined;

    Object.assign(product, body, { id: product.id });

    return product;
  }

  deleteProduct(id: string) {
    const index = this.products.findIndex((product) => product.id === id);
    if (index === -1) return false;

    this.products.splice(index, 1);

    return true;
  }

  getProductsWithOwners(ownerId?: string) {
    const products = this.getAllProducts(ownerId);

    return products.map((product) => ({
      ...product,
      owner: this.usersService.getUserById(product.ownerId),
    }));
  }
}
