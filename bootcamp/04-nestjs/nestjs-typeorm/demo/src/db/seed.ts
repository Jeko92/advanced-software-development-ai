import { Boardgame } from '../boardgames/entities/boardgame.entity.ts';
import { AppDataSource } from './data-source.ts';
import { boardgames } from './seed-data.ts';

(async () => {
  const ds = await AppDataSource.initialize();
  await ds.synchronize(true);

  const boardGameRepo = ds.getRepository(Boardgame);
  const games = await boardGameRepo.save(boardgames);

  console.log(`Created ${games.length} boardgames`);

  await ds.destroy();
})().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
