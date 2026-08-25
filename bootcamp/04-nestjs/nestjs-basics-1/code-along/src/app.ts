import { Controller, Get, Injectable, Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
const port = process.env['PORT'] ?? 3232;

@Injectable()
class AppService {
  generateMessage(): string {
    return 'Hello World';
  }
}

@Controller()
class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  showHello() {
    return this.appService.generateMessage();
  }
}

@Module({
  controllers: [AppController],
  providers: [AppService],
})
class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(port);
  console.log(`Server is running on port ${await app.getUrl()}`);
}

bootstrap();
