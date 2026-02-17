import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFeatureFlag1739442060000 implements MigrationInterface {
  name = 'CreateFeatureFlag1739442060000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    await queryRunner.query(`
      CREATE TABLE "feature_flag" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "key" character varying NOT NULL,
        "description" text,
        "enabled" boolean NOT NULL DEFAULT false,
        "rolloutPercentage" integer NOT NULL DEFAULT 0,
        "targetUserIds" text[] NOT NULL DEFAULT '{}',
        "deletedAt" TIMESTAMP,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_feature_flag_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_feature_flag_key" UNIQUE ("key")
      )
    `);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_feature_flag_key" ON "feature_flag" ("key")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_feature_flag_key"`);
    await queryRunner.query(`DROP TABLE "feature_flag"`);
  }
}
