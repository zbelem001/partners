import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Convention {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  ref: string; // Ex: CONV-2026-042

  @Column()
  partnerId: string; // Foreign Key to Partner (we will link later)

  @Column()
  type: string; // Accord Cadre, Convention Spécifique

  @Column()
  status: string; // Draft, Active, Signed, Ended

  @Column({ nullable: true })
  validationStatus: string; // DRAFT, PENDING_SRECIP, PENDING_DFC, PENDING_CAQ, PENDING_DG, APPROVED, REJECTED

  @Column({ type: 'date', nullable: true })
  startDate: string;

  @Column({ type: 'date', nullable: true })
  endDate: string;

  @Column('text', { nullable: true })
  objectives: string; // Objectifs de la convention

  @Column({ nullable: true })
  responsibleUserId: string; // User responsible for this convention

  @Column({ nullable: true })
  currentValidatorRole: string; // Current validation step: SRECIP, DFC, CAQ, DG

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
