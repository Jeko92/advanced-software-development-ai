import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('/')
  greet() {
    return {
      message: 'NestJS Socket.IO api is up and running',
      socketIo: `http://localhost:${process.env['PORT'] ?? 3030}`,
      routes: { health: '/health' },
    };
  }

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      service: 'websockets-api',
      timestamp: new Date().toISOString(),
    };
  }
}
