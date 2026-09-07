import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service.ts';
import { Public } from './common/decorators/public.decorator.ts';

@Public()
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  pingHealth(): { message: string } {
    return this.appService.getHello();
  }
}
