import type { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameConcertTable1787587909528 implements MigrationInterface {
  name = 'RenameConcertTable1787587909528';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "Concert" RENAME TO "concerts"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "concerts" RENAME TO "Concert"`);
  }
}
