import { Module } from '@nestjs/common';
import { UserService } from './user.service.ts';
import { UserController } from './user.controller.ts';

@Module({
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
