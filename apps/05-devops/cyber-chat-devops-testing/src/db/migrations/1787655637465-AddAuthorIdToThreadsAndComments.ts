import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAuthorIdToThreadsAndComments1787655637465 implements MigrationInterface {
  name = 'AddAuthorIdToThreadsAndComments1787655637465';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "temporary_threads" ("id" varchar PRIMARY KEY NOT NULL, "title" varchar NOT NULL, "body" text NOT NULL, "authorId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')))`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_threads"("id", "title", "body", "authorId", "createdAt") SELECT "id", "title", "body", "author", "createdAt" FROM "threads"`,
    );
    await queryRunner.query(`DROP TABLE "threads"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_threads" RENAME TO "threads"`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_comments" ("id" varchar PRIMARY KEY NOT NULL, "threadId" varchar NOT NULL, "authorId" varchar NOT NULL, "body" text NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_f682eb665c360168731f596b0e3" FOREIGN KEY ("threadId") REFERENCES "threads" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_comments"("id", "threadId", "authorId", "body", "createdAt") SELECT "id", "threadId", "author", "body", "createdAt" FROM "comments"`,
    );
    await queryRunner.query(`DROP TABLE "comments"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_comments" RENAME TO "comments"`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_threads" ("id" varchar PRIMARY KEY NOT NULL, "title" varchar NOT NULL, "body" text NOT NULL, "authorId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_7d2172aeb12db58bf620d14792d" FOREIGN KEY ("authorId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_threads"("id", "title", "body", "authorId", "createdAt") SELECT "id", "title", "body", "authorId", "createdAt" FROM "threads"`,
    );
    await queryRunner.query(`DROP TABLE "threads"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_threads" RENAME TO "threads"`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_comments" ("id" varchar PRIMARY KEY NOT NULL, "threadId" varchar NOT NULL, "authorId" varchar NOT NULL, "body" text NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_f682eb665c360168731f596b0e3" FOREIGN KEY ("threadId") REFERENCES "threads" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_4548cc4a409b8651ec75f70e280" FOREIGN KEY ("authorId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_comments"("id", "threadId", "authorId", "body", "createdAt") SELECT "id", "threadId", "authorId", "body", "createdAt" FROM "comments"`,
    );
    await queryRunner.query(`DROP TABLE "comments"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_comments" RENAME TO "comments"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "comments" RENAME TO "temporary_comments"`,
    );
    await queryRunner.query(
      `CREATE TABLE "comments" ("id" varchar PRIMARY KEY NOT NULL, "threadId" varchar NOT NULL, "authorId" varchar NOT NULL, "body" text NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_f682eb665c360168731f596b0e3" FOREIGN KEY ("threadId") REFERENCES "threads" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "comments"("id", "threadId", "authorId", "body", "createdAt") SELECT "id", "threadId", "authorId", "body", "createdAt" FROM "temporary_comments"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_comments"`);
    await queryRunner.query(
      `ALTER TABLE "threads" RENAME TO "temporary_threads"`,
    );
    await queryRunner.query(
      `CREATE TABLE "threads" ("id" varchar PRIMARY KEY NOT NULL, "title" varchar NOT NULL, "body" text NOT NULL, "authorId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')))`,
    );
    await queryRunner.query(
      `INSERT INTO "threads"("id", "title", "body", "authorId", "createdAt") SELECT "id", "title", "body", "authorId", "createdAt" FROM "temporary_threads"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_threads"`);
    await queryRunner.query(
      `ALTER TABLE "comments" RENAME TO "temporary_comments"`,
    );
    await queryRunner.query(
      `CREATE TABLE "comments" ("id" varchar PRIMARY KEY NOT NULL, "threadId" varchar NOT NULL, "author" varchar NOT NULL, "body" text NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_f682eb665c360168731f596b0e3" FOREIGN KEY ("threadId") REFERENCES "threads" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "comments"("id", "threadId", "author", "body", "createdAt") SELECT "id", "threadId", "authorId", "body", "createdAt" FROM "temporary_comments"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_comments"`);
    await queryRunner.query(
      `ALTER TABLE "threads" RENAME TO "temporary_threads"`,
    );
    await queryRunner.query(
      `CREATE TABLE "threads" ("id" varchar PRIMARY KEY NOT NULL, "title" varchar NOT NULL, "body" text NOT NULL, "author" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')))`,
    );
    await queryRunner.query(
      `INSERT INTO "threads"("id", "title", "body", "author", "createdAt") SELECT "id", "title", "body", "authorId", "createdAt" FROM "temporary_threads"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_threads"`);
  }
}
