import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserStatus1760558192845 implements MigrationInterface {
  name = 'UserStatus1760558192845';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "NIN" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "NIN"`);
  }
}
