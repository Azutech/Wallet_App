import { MigrationInterface, QueryRunner } from 'typeorm';

export class Tokens1760230150180 implements MigrationInterface {
  name = 'Tokens1760230150180';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" uuid NOT NULL, "code" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "expiresAt" TIMESTAMP NOT NULL, CONSTRAINT "PK_3001e89ada36263dabf1fb6210a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "tokens" ADD CONSTRAINT "FK_d60a53f7fd2e12866a82a02a9f4" FOREIGN KEY ("email") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tokens" DROP CONSTRAINT "FK_d60a53f7fd2e12866a82a02a9f4"`,
    );
    await queryRunner.query(`DROP TABLE "tokens"`);
  }
}
