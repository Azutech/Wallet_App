import { MigrationInterface, QueryRunner } from "typeorm";

export class NotificationTypes1761223747994 implements MigrationInterface {
    name = 'NotificationTypes1761223747994'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "security_questions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "question" character varying(255) NOT NULL, "answerHash" character varying(255) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_40863dac02e72e1ea928b07d5ad" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD "IRS" character varying DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "security_questions" ADD CONSTRAINT "FK_fc31b5460e57c3607cc78021f5e" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "security_questions" DROP CONSTRAINT "FK_fc31b5460e57c3607cc78021f5e"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "IRS"`);
        await queryRunner.query(`DROP TABLE "security_questions"`);
    }

}
