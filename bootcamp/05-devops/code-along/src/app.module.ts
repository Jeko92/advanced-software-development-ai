import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module.ts';
import { AuthModule } from './auth/auth.module.ts';

@Module({
  imports: [UserModule, AuthModule],
})
export class AppModule {}
