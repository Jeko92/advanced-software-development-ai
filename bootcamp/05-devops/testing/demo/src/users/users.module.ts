import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersService } from './users.service';

/**
 * Owns everything about accounts. It exports `UsersService` so the auth module
 * can register and look up users without reaching for the repository itself —
 * password hashing stays in exactly one place.
 */
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
