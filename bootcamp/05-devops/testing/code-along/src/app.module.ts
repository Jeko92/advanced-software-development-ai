import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { User } from './user/entities/user.entity';

@Module({
  imports: [
    // In-memory SQLite keeps this sandbox dependency-free - the same
    // technique the individual test files use for their own test
    // databases, wired up here so the app can boot for real too (pnpm dev,
    // and full-app e2e tests via Test.createTestingModule({ imports: [AppModule] })).
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: ':memory:',
      entities: [User],
      synchronize: true,
    }),
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}
