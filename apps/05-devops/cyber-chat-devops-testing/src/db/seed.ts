import { AppDataSource } from './data-source';
import { THREADS_SEED, COMMENTS_SEED, USERS_SEED } from './seed-data';
import { Thread } from '../threads/entities/threads.entity';
import { Comment } from '../comments/entities/comments.entity';
import { User } from '../users/entities/user.entity';
import { hashSecret } from '../common/utils/hash.util';

(async () => {
  const ds = await AppDataSource.initialize();

  const threadsRepo = ds.getRepository(Thread);
  const commentsRepo = ds.getRepository(Comment);
  const usersRepo = ds.getRepository(User);

  const users = await usersRepo.save(
    usersRepo.create(
      USERS_SEED.map(({ username, password, roles }) => ({
        username,
        passwordHash: hashSecret(password),
        roles,
      })),
    ),
  );

  const adminUser = users.find((user) => user.username === 'admin');
  if (!adminUser) {
    throw new Error('Seed data must include an "admin" user');
  }

  const threads = await threadsRepo.save(
    threadsRepo.create(
      THREADS_SEED.map((thread) => ({
        ...thread,
        authorId: adminUser.id,
      })),
    ),
  );

  const comments = await commentsRepo.save(
    commentsRepo.create(
      COMMENTS_SEED.map(({ threadIndex, ...comment }) => ({
        ...comment,
        threadId: threads[threadIndex]!.id,
        authorId: adminUser.id,
      })),
    ),
  );

  console.log(
    `Created ${users.length} users, ${threads.length} threads and ${comments.length} comments.`,
  );

  await ds.destroy();
})().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
