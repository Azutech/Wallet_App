import { MigrationInterface, QueryRunner } from 'typeorm';

export class KycVerification1761829514160 implements MigrationInterface {
  name = 'KycVerification1761829514160';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "bvn_verified" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "nin_verified" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "nin_verified"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "bvn_verified"`);
  }
}
