import { Module } from '@nestjs/common';
import { CommentsModule } from '../comments/comments.module';
import { ThreadsModule } from '../threads/threads.module';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entity/user.entity';
import { Thread } from '../threads/entity/thread.entity';
import { Comment } from '../comments/entity/comment.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'better-sqlite3',
        database: config.getOrThrow<string>('DATABASE_PATH'),
        synchronize: true,
        entities: [User, Comment, Thread],
        logging: true,
      }),
    }),

    CommentsModule,
    ThreadsModule,
    AuthModule,
  ],
})
export class AppModule {}
