import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('workflow_steps')
export class WorkflowStep {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid' })
  conventionId: string;

  @Column()
  stepOrder: number;

  @Column({ length: 100 })
  label: string;

  @Column({ length: 50, default: 'Pending' })
  status: string;

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date;

  @Column({ nullable: true })
  assignedTo: number;
}
