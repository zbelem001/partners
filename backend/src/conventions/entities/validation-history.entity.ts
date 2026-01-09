import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class ValidationHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  conventionId: string;

  @Column()
  validatorRole: string; // SRECIP, DFC, CAQ, DG

  @Column()
  validatorId: string; // User ID

  @Column()
  validatorName: string;

  @Column()
  action: string; // APPROVED, REJECTED, REQUESTED_CHANGES

  @Column('text', { nullable: true })
  comment: string;

  @Column()
  fromStatus: string;

  @Column()
  toStatus: string;

  @CreateDateColumn()
  createdAt: Date;
}
