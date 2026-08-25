import type { MigrationInterface, QueryRunner } from 'typeorm';

export class InitUsersAndQuotes1787576909050 implements MigrationInterface {
  name = 'InitUsersAndQuotes1787576909050';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" varchar PRIMARY KEY NOT NULL, "username" varchar NOT NULL, "password" varchar NOT NULL, "roles" text NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "quotes" ("id" varchar PRIMARY KEY NOT NULL, "quote" varchar NOT NULL, "author" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "quotes"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
