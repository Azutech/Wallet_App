import { MigrationInterface, QueryRunner } from "typeorm";

export class AccountNumber1761570377025 implements MigrationInterface {
    name = 'AccountNumber1761570377025'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wallets" DROP COLUMN "accountNumber"`);
        await queryRunner.query(`ALTER TABLE "wallets" ADD "accountNumber" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wallets" DROP COLUMN "accountNumber"`);
        await queryRunner.query(`ALTER TABLE "wallets" ADD "accountNumber" bigint`);
    }

}
