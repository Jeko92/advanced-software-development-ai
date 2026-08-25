import type { MigrationInterface, QueryRunner } from 'typeorm';

export class InitCyberChat1787310599194 implements MigrationInterface {
  name = 'InitCyberChat1787310599194';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "threads" ("id" varchar PRIMARY KEY NOT NULL, "title" varchar NOT NULL, "body" text NOT NULL, "author" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')))`,
    );
    await queryRunner.query(
      `CREATE TABLE "comments" ("id" varchar PRIMARY KEY NOT NULL, "threadId" varchar NOT NULL, "author" varchar NOT NULL, "body" text NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_f682eb665c360168731f596b0e3" FOREIGN KEY ("threadId") REFERENCES "threads" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "comments"`);
    await queryRunner.query(`DROP TABLE "threads"`);
  }
}
