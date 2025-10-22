import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatesWallets1761174563142 implements MigrationInterface {
    name = 'UpdatesWallets1761174563142'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wallets" ADD "network" character varying`);
        await queryRunner.query(`ALTER TABLE "wallets" ADD "address" character varying`);
        await queryRunner.query(`ALTER TABLE "wallets" ADD "providerWalletId" character varying`);
        await queryRunner.query(`ALTER TABLE "wallets" DROP COLUMN "balance"`);
        await queryRunner.query(`ALTER TABLE "wallets" ADD "balance" numeric(18,8) NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wallets" DROP COLUMN "balance"`);
        await queryRunner.query(`ALTER TABLE "wallets" ADD "balance" bigint NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "wallets" DROP COLUMN "providerWalletId"`);
        await queryRunner.query(`ALTER TABLE "wallets" DROP COLUMN "address"`);
        await queryRunner.query(`ALTER TABLE "wallets" DROP COLUMN "network"`);
    }

}
