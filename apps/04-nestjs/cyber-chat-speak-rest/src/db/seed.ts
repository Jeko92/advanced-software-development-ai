import { AppDataSource } from './data-source';
import { THREADS_SEED, COMMENTS_SEED } from './seed-data';
import { Thread } from '../threads/entities/threads.entity';
import { Comment } from '../comments/entities/comments.entity';

(async () => {
  const ds = await AppDataSource.initialize();

  const threadsRepo = ds.getRepository(Thread);
  const commentsRepo = ds.getRepository(Comment);

  const threads = await threadsRepo.save(threadsRepo.create(THREADS_SEED));

  const comments = await commentsRepo.save(
    commentsRepo.create(
      COMMENTS_SEED.map(({ threadIndex, ...comment }) => ({
        ...comment,
        threadId: threads[threadIndex]!.id,
      })),
    ),
  );

  console.log(
    `Created ${threads.length} threads and ${comments.length} comments`,
  );

  await ds.destroy();
})().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
