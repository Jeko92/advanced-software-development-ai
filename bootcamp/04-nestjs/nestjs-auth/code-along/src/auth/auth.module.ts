import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.ts';
import { AuthController } from './auth.controller.ts';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module.ts';
import { LocalStrategy } from './local.strategy.ts';
import { JwtStrategy } from './jwt.strategy.ts';
import { GoogleStrategy } from './google.strategy.ts';
import { GithubStrategy } from './github.strategy.ts';

const jwtSecret = process.env['JWT_SECRET'];
if (!jwtSecret) {
  throw new Error('Missing required environment variable: JWT_SECRET');
}

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: jwtSecret,
      signOptions: {
        expiresIn: '1d',
      },
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    GoogleStrategy,
    GithubStrategy,
  ],
  controllers: [AuthController],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
