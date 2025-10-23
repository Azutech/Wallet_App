import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveIRS1761223986144 implements MigrationInterface {
  name = 'RemoveIRS1761223986144';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "IRS"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "IRS" character varying DEFAULT ''`,
    );
  }
}
