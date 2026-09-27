import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('/')
  greet() {
    return {
      message: 'Real-time chat api (NestJS + Socket.io) is up and running',
      socketIo: `http://localhost:${process.env['PORT'] ?? 3000}`,
      routes: { health: '/health' },
    };
  }

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      service: 'real-time-chat-api',
      timestamp: new Date().toISOString(),
    };
  }
}
