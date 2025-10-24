import { MigrationInterface, QueryRunner } from 'typeorm';

export class NotificationsDFixes1761311961125 implements MigrationInterface {
  name = 'NotificationsDFixes1761311961125';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notification" ALTER COLUMN "createdAt" SET DEFAULT now()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notification" ALTER COLUMN "createdAt" DROP DEFAULT`,
    );
  }
}
