import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './common/decorators/public.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  getHome(): { message: string } {
    return { message: 'Hello world from Nestjs' };
  }

  @Public()
  @Get('health')
  getHealth(): { message: string } {
    return this.appService.getHealth();
  }
}
