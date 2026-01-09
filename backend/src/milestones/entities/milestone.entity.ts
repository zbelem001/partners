import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('milestones')
export class Milestone {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid' })
  conventionId: string;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'date' })
  dueDate: Date;

  @Column({ length: 50, default: 'Pending' })
  status: string;

  @Column({ length: 50, nullable: true })
  type: string;

  @Column({ default: false })
  alertSent: boolean;
}
