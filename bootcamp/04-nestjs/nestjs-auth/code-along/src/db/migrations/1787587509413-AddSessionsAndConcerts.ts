import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSessionsAndConcerts1787587509413 implements MigrationInterface {
  name = 'AddSessionsAndConcerts1787587509413';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "sessions" ("sid" varchar PRIMARY KEY NOT NULL, "expiresAt" datetime NOT NULL, "data" text NOT NULL)`,
    );
    await queryRunner.query(
      `CREATE TABLE "Concert" ("id" varchar PRIMARY KEY NOT NULL, "title" varchar NOT NULL, "artist" varchar NOT NULL, "venue" varchar NOT NULL, "date" datetime NOT NULL, "ticketPrice" decimal(10,2) NOT NULL, "genre" varchar NOT NULL)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "Concert"`);
    await queryRunner.query(`DROP TABLE "sessions"`);
  }
}
