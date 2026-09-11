import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1787831082692 implements MigrationInterface {
  name = 'InitialSchema1787831082692';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" varchar PRIMARY KEY NOT NULL, "username" varchar NOT NULL, "passwordHash" varchar NOT NULL, "roles" text NOT NULL DEFAULT ('user'), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "offers" ("id" varchar PRIMARY KEY NOT NULL, "amount" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "bidderId" varchar, "auctionId" varchar)`,
    );
    await queryRunner.query(
      `CREATE TABLE "auctions" ("id" varchar PRIMARY KEY NOT NULL, "title" varchar NOT NULL, "description" varchar NOT NULL, "startingPrice" integer NOT NULL, "endDate" datetime NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "sellerId" varchar)`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_offers" ("id" varchar PRIMARY KEY NOT NULL, "amount" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "bidderId" varchar, "auctionId" varchar, CONSTRAINT "FK_2ddd259ea2ea1c3b540f79fc661" FOREIGN KEY ("bidderId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_9efdf260cd45b23f2d03808a435" FOREIGN KEY ("auctionId") REFERENCES "auctions" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_offers"("id", "amount", "createdAt", "bidderId", "auctionId") SELECT "id", "amount", "createdAt", "bidderId", "auctionId" FROM "offers"`,
    );
    await queryRunner.query(`DROP TABLE "offers"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_offers" RENAME TO "offers"`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_auctions" ("id" varchar PRIMARY KEY NOT NULL, "title" varchar NOT NULL, "description" varchar NOT NULL, "startingPrice" integer NOT NULL, "endDate" datetime NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "sellerId" varchar, CONSTRAINT "FK_7562985483a1d83d0790b19d186" FOREIGN KEY ("sellerId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_auctions"("id", "title", "description", "startingPrice", "endDate", "createdAt", "sellerId") SELECT "id", "title", "description", "startingPrice", "endDate", "createdAt", "sellerId" FROM "auctions"`,
    );
    await queryRunner.query(`DROP TABLE "auctions"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_auctions" RENAME TO "auctions"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "auctions" RENAME TO "temporary_auctions"`,
    );
    await queryRunner.query(
      `CREATE TABLE "auctions" ("id" varchar PRIMARY KEY NOT NULL, "title" varchar NOT NULL, "description" varchar NOT NULL, "startingPrice" integer NOT NULL, "endDate" datetime NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "sellerId" varchar)`,
    );
    await queryRunner.query(
      `INSERT INTO "auctions"("id", "title", "description", "startingPrice", "endDate", "createdAt", "sellerId") SELECT "id", "title", "description", "startingPrice", "endDate", "createdAt", "sellerId" FROM "temporary_auctions"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_auctions"`);
    await queryRunner.query(
      `ALTER TABLE "offers" RENAME TO "temporary_offers"`,
    );
    await queryRunner.query(
      `CREATE TABLE "offers" ("id" varchar PRIMARY KEY NOT NULL, "amount" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "bidderId" varchar, "auctionId" varchar)`,
    );
    await queryRunner.query(
      `INSERT INTO "offers"("id", "amount", "createdAt", "bidderId", "auctionId") SELECT "id", "amount", "createdAt", "bidderId", "auctionId" FROM "temporary_offers"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_offers"`);
    await queryRunner.query(`DROP TABLE "auctions"`);
    await queryRunner.query(`DROP TABLE "offers"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
