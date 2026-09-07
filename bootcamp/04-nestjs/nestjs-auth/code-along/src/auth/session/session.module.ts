import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from './entities/session.entity.ts';
import { TypeormSessionStore } from './typeorm-session.store.ts';
import { SessionAuthController } from './session-auth.controller.ts';
import { SessionAuthGuard } from './session-auth.guard.ts';
import { AuthModule } from '../auth.module.ts';
import { UsersModule } from '../../users/users.module.ts';

@Module({
  imports: [TypeOrmModule.forFeature([Session]), AuthModule, UsersModule],
  controllers: [SessionAuthController],
  providers: [TypeormSessionStore, SessionAuthGuard],
  exports: [TypeormSessionStore],
})
export class SessionModule {}
