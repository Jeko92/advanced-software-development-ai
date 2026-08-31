import { Module } from '@nestjs/common';
import { UserService } from './user.service.ts';
import { UserController } from './user.controller.ts';
import { AuthModule } from '../auth/auth.module.ts';

@Module({
  imports: [AuthModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
