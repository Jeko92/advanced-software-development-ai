import { Controller, Get } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Controller()
export class AppController {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  @Get('/')
  greet() {
    return {
      message: 'NestJS is up and running',
    };
  }

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      service: 'polling-sse-api',
      database: { connected: this.dataSource.isInitialized },
      timestamp: new Date().toISOString(),
    };
  }
}
