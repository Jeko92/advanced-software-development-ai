/**
 * Every setting the app reads, in one place, each with a development default.
 *
 * Defaults mean a fresh clone runs with no setup at all — but `JWT_SECRET` must
 * be a real secret anywhere that matters. Anyone who knows the signing key can
 * mint a token for any account.
 */
export const configuration = () => ({
  PORT: parseInt(process.env['PORT'] ?? '', 10) || 3000,
  DATABASE_PATH: process.env['DATABASE_PATH'] || 'darkbay.sqlite',
  JWT_SECRET: process.env['JWT_SECRET'] || 'dev-only-secret-change-me',
  JWT_EXPIRES_IN: process.env['JWT_EXPIRES_IN'] || '1d',
});
