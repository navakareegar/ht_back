import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1763667369002 implements MigrationInterface {
  name = 'InitialSchema1763667369002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Enable uuid-ossp extension
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // Create user table
    await queryRunner.query(`
            CREATE TABLE "user" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "email" character varying NOT NULL,
                "password" character varying NOT NULL,
                "name" character varying,
                "refreshToken" character varying,
                "date" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_user_email" UNIQUE ("email"),
                CONSTRAINT "PK_user_id" PRIMARY KEY ("id")
            )
        `);

    // Create habit table
    await queryRunner.query(`
            CREATE TABLE "habit" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "userId" uuid NOT NULL,
                "title" character varying NOT NULL,
                "description" character varying,
                "date" date,
                CONSTRAINT "PK_habit_id" PRIMARY KEY ("id")
            )
        `);

    // Create habit_log table
    await queryRunner.query(`
            CREATE TABLE "habit_log" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "habitId" uuid NOT NULL,
                "date" date NOT NULL,
                "done" boolean NOT NULL DEFAULT false,
                CONSTRAINT "UQ_habit_log_habitId_date" UNIQUE ("habitId", "date"),
                CONSTRAINT "PK_habit_log_id" PRIMARY KEY ("id")
            )
        `);

    // Add foreign key constraints
    await queryRunner.query(`
            ALTER TABLE "habit"
            ADD CONSTRAINT "FK_habit_userId"
            FOREIGN KEY ("userId")
            REFERENCES "user"("id")
            ON DELETE CASCADE
            ON UPDATE NO ACTION
        `);

    await queryRunner.query(`
            ALTER TABLE "habit_log"
            ADD CONSTRAINT "FK_habit_log_habitId"
            FOREIGN KEY ("habitId")
            REFERENCES "habit"("id")
            ON DELETE CASCADE
            ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key constraints
    await queryRunner.query(
      `ALTER TABLE "habit_log" DROP CONSTRAINT "FK_habit_log_habitId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "habit" DROP CONSTRAINT "FK_habit_userId"`,
    );

    // Drop tables
    await queryRunner.query(`DROP TABLE "habit_log"`);
    await queryRunner.query(`DROP TABLE "habit"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
