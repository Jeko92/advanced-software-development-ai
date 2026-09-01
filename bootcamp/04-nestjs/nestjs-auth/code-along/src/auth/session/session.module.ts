import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from './entities/session.entity';
import { TypeormSessionStore } from './typeorm-session.store';
import { SessionAuthController } from './session-auth.controller';
import { SessionAuthGuard } from './session-auth.guard';
import { AuthModule } from '../auth.module';
import { UsersModule } from '../../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Session]), AuthModule, UsersModule],
  controllers: [SessionAuthController],
  providers: [TypeormSessionStore, SessionAuthGuard],
  exports: [TypeormSessionStore],
})
export class SessionModule {}
