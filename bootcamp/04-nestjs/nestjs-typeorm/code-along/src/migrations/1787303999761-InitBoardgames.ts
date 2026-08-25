import type { MigrationInterface, QueryRunner } from 'typeorm';

export class InitBoardgames1787303999761 implements MigrationInterface {
  name = 'InitBoardgames1787303999761';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "boardgames" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(120) NOT NULL, "minPlayers" integer NOT NULL, "maxPlayers" integer NOT NULL, "playtimeMinutes" integer NOT NULL, "complexity" numeric(3,1) NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_6b7d8ddd09d962289429426b3a7" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "boardgames"`);
  }
}
