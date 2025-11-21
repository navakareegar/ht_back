import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigration1763721978509 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create user table
    await queryRunner.query(`
            CREATE TABLE "user" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "email" varchar NOT NULL UNIQUE,
                "password" varchar NOT NULL,
                "name" varchar,
                "refreshToken" varchar,
                "date" TIMESTAMP NOT NULL DEFAULT now()
            )
        `);

    // Create habit table
    await queryRunner.query(`
            CREATE TABLE "habit" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "userId" uuid NOT NULL,
                "title" varchar NOT NULL,
                "description" varchar,
                "date" date,
                CONSTRAINT "fk_habit_user" FOREIGN KEY ("userId") 
                    REFERENCES "user"("id") ON DELETE CASCADE
            )
        `);

    // Create habit_log table
    await queryRunner.query(`
            CREATE TABLE "habit_log" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "habitId" uuid NOT NULL,
                "date" date NOT NULL,
                "done" boolean NOT NULL DEFAULT false,
                CONSTRAINT "fk_habit_log_habit" FOREIGN KEY ("habitId") 
                    REFERENCES "habit"("id") ON DELETE CASCADE,
                CONSTRAINT "uq_habit_log_habitId_date" UNIQUE ("habitId", "date")
            )
        `);

    // Create indexes for better query performance
    await queryRunner.query(`
            CREATE INDEX "idx_habit_userId" ON "habit"("userId")
        `);

    await queryRunner.query(`
            CREATE INDEX "idx_habit_log_habitId" ON "habit_log"("habitId")
        `);

    await queryRunner.query(`
            CREATE INDEX "idx_habit_log_date" ON "habit_log"("date")
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_habit_log_date"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_habit_log_habitId"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_habit_userId"`);

    // Drop tables in reverse order (respecting foreign key constraints)
    await queryRunner.query(`DROP TABLE IF EXISTS "habit_log"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "habit"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "user"`);
  }
}
