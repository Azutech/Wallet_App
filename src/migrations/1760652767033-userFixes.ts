import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserFixes1760652767033 implements MigrationInterface {
  name = 'UserFixes1760652767033';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "address" character varying DEFAULT ''`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "address"`);
  }
}
