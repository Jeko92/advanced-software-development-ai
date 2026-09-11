import { AppDataSource } from './data-source';
import { User, UserRole } from '../users/entities/user.entity';
import { hashSecret } from '../common/utils/hash.utils';

// Local-only fixtures for exercising RBAC by hand: one admin, one regular
// user, both with known, fixed credentials — that's deliberate (it's what
// makes them useful for manual testing), which is exactly why this script
// refuses to run against a production environment below. Idempotent — safe
// to run more than once against the same database.
const SEED_USERS: { username: string; password: string; roles: UserRole[] }[] =
  [
    { username: 'admin', password: 'admin12345', roles: ['admin'] },
    { username: 'seeduser', password: 'user12345', roles: ['user'] },
  ];

async function seed(): Promise<void> {
  if (process.env['NODE_ENV'] === 'production') {
    throw new Error(
      'Refusing to run: this seeds a known/guessable admin account and must never touch production.',
    );
  }

  await AppDataSource.initialize();
  const usersRepository = AppDataSource.getRepository(User);

  for (const { username, password, roles } of SEED_USERS) {
    const existing = await usersRepository.findOneBy({ username });
    if (existing) {
      console.log(`Skipping "${username}" — already seeded`);
      continue;
    }
    const user = usersRepository.create({
      username,
      passwordHash: hashSecret(password),
      roles,
    });
    await usersRepository.save(user);
    console.log(`Seeded "${username}" (${roles.join(', ')}) / "${password}"`);
  }

  await AppDataSource.destroy();
}

seed().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
