import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddApiKeys1787591120049 implements MigrationInterface {
  name = 'AddApiKeys1787591120049';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "api_keys" ("id" varchar PRIMARY KEY NOT NULL, "keyHash" varchar NOT NULL, "label" varchar NOT NULL, "active" boolean NOT NULL DEFAULT (1), "createdAt" datetime NOT NULL DEFAULT (datetime('now')))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "api_keys"`);
  }
}
