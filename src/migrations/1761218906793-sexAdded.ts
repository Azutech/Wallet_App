import { MigrationInterface, QueryRunner } from 'typeorm';

export class SexAdded1761218906793 implements MigrationInterface {
  name = 'SexAdded1761218906793';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "sex" "public"."users_sex_enum"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "sex"`);
  }
}
