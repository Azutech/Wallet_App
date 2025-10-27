import { MigrationInterface, QueryRunner } from "typeorm";

export class WalletsRoutingNumber1761552194542 implements MigrationInterface {
    name = 'WalletsRoutingNumber1761552194542'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wallets" DROP COLUMN "routingNumber"`);
        await queryRunner.query(`ALTER TABLE "wallets" ADD "routingNumber" character varying(20)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wallets" DROP COLUMN "routingNumber"`);
        await queryRunner.query(`ALTER TABLE "wallets" ADD "routingNumber" bigint`);
    }

}
