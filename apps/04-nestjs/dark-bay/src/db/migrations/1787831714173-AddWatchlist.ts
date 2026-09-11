import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddWatchlist1787831714173 implements MigrationInterface {
  name = 'AddWatchlist1787831714173';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "watchlist" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "userId" varchar, "auctionId" varchar, CONSTRAINT "UQ_c2168300f3352178a917cd8852b" UNIQUE ("userId", "auctionId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_watchlist" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "userId" varchar, "auctionId" varchar, CONSTRAINT "UQ_c2168300f3352178a917cd8852b" UNIQUE ("userId", "auctionId"), CONSTRAINT "FK_03878f3f177c680cc195900f80a" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_8ac3769fb52236dacd67785f2cf" FOREIGN KEY ("auctionId") REFERENCES "auctions" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_watchlist"("id", "createdAt", "userId", "auctionId") SELECT "id", "createdAt", "userId", "auctionId" FROM "watchlist"`,
    );
    await queryRunner.query(`DROP TABLE "watchlist"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_watchlist" RENAME TO "watchlist"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "watchlist" RENAME TO "temporary_watchlist"`,
    );
    await queryRunner.query(
      `CREATE TABLE "watchlist" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "userId" varchar, "auctionId" varchar, CONSTRAINT "UQ_c2168300f3352178a917cd8852b" UNIQUE ("userId", "auctionId"))`,
    );
    await queryRunner.query(
      `INSERT INTO "watchlist"("id", "createdAt", "userId", "auctionId") SELECT "id", "createdAt", "userId", "auctionId" FROM "temporary_watchlist"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_watchlist"`);
    await queryRunner.query(`DROP TABLE "watchlist"`);
  }
}
