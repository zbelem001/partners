import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('conventions')
export class Convention {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  ref: string; // Ex: CONV-2026-042

  @Column({ type: 'uuid' })
  partnerId: string; // Foreign Key to Partner (we will link later)

  @Column({ length: 100 })
  type: string; // Accord Cadre, Convention Spécifique

  @Column({ length: 50, default: 'Draft' })
  status: string; // Draft, Active, Signed, Ended

  @Column({ length: 50, nullable: true })
  validationStatus: string; // DRAFT, PENDING_SRECIP, PENDING_DFC, PENDING_CAQ, PENDING_DG, APPROVED, REJECTED

  @Column({ type: 'date', nullable: true })
  startDate: string;

  @Column({ type: 'date', nullable: true })
  endDate: string;

  @Column('text', { nullable: true })
  objectives: string; // Objectifs de la convention

  @Column('integer', { nullable: true })
  responsibleUserId: number; // User responsible for this convention

  @Column({ nullable: true, type: 'varchar' })
  currentValidatorRole: string | null; // Current validation step: SRECIP, DFC, CAQ, DG

  @Column('simple-json', { nullable: true })
  validatedBy: {
    srecip?: { userId: string; name: string; date: string };
    dfc?: { userId: string; name: string; date: string };
    caq?: { userId: string; name: string; date: string };
    dg?: { userId: string; name: string; date: string };
  };

  @Column('integer', { default: 0 })
  progress: number; // 0-100

  @CreateDateColumn()
  createdAt: Date;
}
