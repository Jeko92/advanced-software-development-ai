import { AppDataSource } from './data-source.ts';
import { THREADS_SEED, COMMENTS_SEED, USERS_SEED } from './seed-data.ts';
import { Thread } from '../threads/entities/threads.entity.ts';
import { Comment } from '../comments/entities/comments.entity.ts';
import { User } from '../users/entities/user.entity.ts';

(async () => {
  const ds = await AppDataSource.initialize();

  const threadsRepo = ds.getRepository(Thread);
  const commentsRepo = ds.getRepository(Comment);
  const usersRepo = ds.getRepository(User);

  const threads = await threadsRepo.save(threadsRepo.create(THREADS_SEED));

  const comments = await commentsRepo.save(
    commentsRepo.create(
      COMMENTS_SEED.map(({ threadIndex, ...comment }) => ({
        ...comment,
        threadId: threads[threadIndex]!.id,
      })),
    ),
  );

  const users = await usersRepo.save(usersRepo.create(USERS_SEED));

  console.log(
    `Created ${threads.length} threads, ${comments.length} comments and ${users.length} users.`,
  );

  await ds.destroy();
})().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
