import { hashSecret } from '../common/utils/hash.util';
import { AppDataSource } from './data-source';
import { quotes, users, concerts } from './seed-data';
import { Quote } from '../quotes/entities/quote.entity';
import { User } from '../users/entities/user.entity';
import { Concert } from '../concerts/entities/concert.entity';
import { ApiKey } from '../api-keys/entities/api-key.entity';

(async () => {
  const ds = await AppDataSource.initialize();

  const usersRepo = ds.getRepository(User);
  const quotesRepo = ds.getRepository(Quote);
  const concertsRepo = ds.getRepository(Concert);
  const apiKeysRepo = ds.getRepository(ApiKey);

  const hashedUsers = users.map((user) => ({
    ...user,
    password: hashSecret(user.password),
  }));
  const savedUsers = await usersRepo.save(usersRepo.create(hashedUsers));

  const savedQuotes = await quotesRepo.save(
    quotesRepo.create(quotes.map(({ id: _id, ...quote }) => quote)),
  );

  const savedConcerts = await concertsRepo.save(
    concertsRepo.create(
      concerts.map((concert) => ({
        ...concert,
        date: new Date(concert.date),
      })),
    ),
  );

  const rawApiKey = crypto.randomUUID();
  const savedApiKey = await apiKeysRepo.save(
    apiKeysRepo.create({
      keyHash: hashSecret(rawApiKey),
      label: 'partner-demo',
      active: true,
    }),
  );

  console.log(
    `Created ${savedUsers.length} users, ${savedQuotes.length} quotes, ${savedConcerts.length} concerts, and 1 API key`,
  );
  console.log(
    `API key for "${savedApiKey.label}" (shown once, save it now): ${rawApiKey}`,
  );

  await ds.destroy();
})().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
