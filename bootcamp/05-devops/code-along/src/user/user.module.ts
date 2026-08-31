import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service.ts';
import { UserController } from './user.controller.ts';
import { AuthModule } from '../auth/auth.module.ts';
import { User } from './entities/user.entity.ts';

@Module({
  imports: [TypeOrmModule.forFeature([User]), AuthModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
