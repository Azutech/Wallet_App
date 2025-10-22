import { MigrationInterface, QueryRunner } from 'typeorm';

export class WalletsTYpes1761175220911 implements MigrationInterface {
  name = 'WalletsTYpes1761175220911';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."wallets_wallettypeenum_enum" AS ENUM('FIAT', 'CRYPTO')`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallets" ADD "walletTypeEnum" "public"."wallets_wallettypeenum_enum" NOT NULL DEFAULT 'FIAT'`,
    );
    await queryRunner.query(`ALTER TABLE "wallets" DROP COLUMN "currency"`);
    await queryRunner.query(
      `CREATE TYPE "public"."wallets_currency_enum" AS ENUM('NGN', 'USD', 'USDT')`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallets" ADD "currency" "public"."wallets_currency_enum" NOT NULL DEFAULT 'NGN'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "wallets" DROP COLUMN "currency"`);
    await queryRunner.query(`DROP TYPE "public"."wallets_currency_enum"`);
    await queryRunner.query(
      `ALTER TABLE "wallets" ADD "currency" character varying(3) NOT NULL DEFAULT 'NGN'`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallets" DROP COLUMN "walletTypeEnum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."wallets_wallettypeenum_enum"`);
  }
}
