import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateProspectEntity1735000000000 implements MigrationInterface {
    name = 'UpdateProspectEntity1735000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add new columns to prospect table
        await queryRunner.query(`
            ALTER TABLE "prospect" ADD COLUMN "city" varchar
        `);
        
        await queryRunner.query(`
            ALTER TABLE "prospect" ADD COLUMN "position" varchar
        `);
        
        await queryRunner.query(`
            ALTER TABLE "prospect" ADD COLUMN "description" text
        `);
        
        await queryRunner.query(`
            ALTER TABLE "prospect" ADD COLUMN "motivation" text
        `);
        
        await queryRunner.query(`
            ALTER TABLE "prospect" ADD COLUMN "collaborationAreas" varchar
        `);
        
        await queryRunner.query(`
            ALTER TABLE "prospect" ADD COLUMN "agreementType" varchar
        `);
        
        await queryRunner.query(`
            ALTER TABLE "prospect" ADD COLUMN "website" varchar
        `);
        
        await queryRunner.query(`
            ALTER TABLE "prospect" ADD COLUMN "creationYear" integer
        `);
        
        await queryRunner.query(`
            ALTER TABLE "prospect" ADD COLUMN "deadline" varchar
        `);
        
        await queryRunner.query(`
            ALTER TABLE "prospect" ADD COLUMN "estimatedBudget" varchar
        `);
        
        await queryRunner.query(`
            ALTER TABLE "prospect" ADD COLUMN "priority" varchar DEFAULT 'Medium'
        `);
        
        // Update existing status values from 'New' to 'pending'
        await queryRunner.query(`
            UPDATE "prospect" SET "status" = 'pending' WHERE "status" = 'New'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove added columns
        await queryRunner.query(`ALTER TABLE "prospect" DROP COLUMN "priority"`);
        await queryRunner.query(`ALTER TABLE "prospect" DROP COLUMN "estimatedBudget"`);
        await queryRunner.query(`ALTER TABLE "prospect" DROP COLUMN "deadline"`);
        await queryRunner.query(`ALTER TABLE "prospect" DROP COLUMN "creationYear"`);
        await queryRunner.query(`ALTER TABLE "prospect" DROP COLUMN "website"`);
        await queryRunner.query(`ALTER TABLE "prospect" DROP COLUMN "agreementType"`);
        await queryRunner.query(`ALTER TABLE "prospect" DROP COLUMN "collaborationAreas"`);
        await queryRunner.query(`ALTER TABLE "prospect" DROP COLUMN "motivation"`);
        await queryRunner.query(`ALTER TABLE "prospect" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "prospect" DROP COLUMN "position"`);
        await queryRunner.query(`ALTER TABLE "prospect" DROP COLUMN "city"`);
        
        // Revert status values
        await queryRunner.query(`
            UPDATE "prospect" SET "status" = 'New' WHERE "status" = 'pending'
        `);
    }
}
