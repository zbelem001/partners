import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text', { nullable: true })
  description: string;

  @Column()
  type: string; // validation, meeting, document, deadline

  @Column()
  priority: string; // urgent, high, medium, low

  @Column()
  status: string; // pending, in-progress, completed, late

  @Column({ nullable: true })
  assignedTo: string; // User ID

  @Column({ nullable: true })
  conventionId: string; // Related convention

  @Column({ type: 'date', nullable: true })
  dueDate: string;

  @Column({ default: false })
  completed: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
