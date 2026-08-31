import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module.ts';

@Module({
  imports: [UserModule],
})
export class AppModule {}
