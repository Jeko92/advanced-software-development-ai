import { DataSource } from 'typeorm';
import { MenuItemSchema } from './entities/menuItem';

const globalThisForDB = globalThis as unknown as {
  dataSource: DataSource | undefined;
};

export async function getDB() {
  if (!globalThisForDB.dataSource) {
    const host = process.env['DATABASE_HOST'];
    const port = process.env['DATABASE_PORT'];
    const username = process.env['DATABASE_USER'];
    const password = process.env['DATABASE_PASSWORD'];
    const database = process.env['DATABASE_NAME'];

    if (!host || !port || !username || !password || !database) {
      throw new Error(
        'Missing required DATABASE_HOST, DATABASE_PORT, DATABASE_USER, DATABASE_PASSWORD, or DATABASE_NAME environment variable.',
      );
    }

    globalThisForDB.dataSource = new DataSource({
      type: 'postgres',
      host,
      port: Number(port),
      username,
      password,
      database,
      entities: [MenuItemSchema],
      synchronize: true,
    });
  }

  return globalThisForDB.dataSource;
}
