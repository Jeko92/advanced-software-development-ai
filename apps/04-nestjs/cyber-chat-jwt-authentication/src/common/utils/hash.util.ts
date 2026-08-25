import bcrypt from 'bcrypt';

const SALT_ROUNDS = Number(process.env['BCRYPT_SALT_ROUNDS']) || 12;

export function hashSecret(plainText: string): string {
  return bcrypt.hashSync(plainText, SALT_ROUNDS);
}

export function compareSecret(
  plainText: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(plainText, hash);
}
