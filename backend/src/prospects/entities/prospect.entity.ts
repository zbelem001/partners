import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('prospects')
export class Prospect {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  reference: string;

  @Column({ length: 255 })
  companyName: string;

  @Column({ length: 50, nullable: true })
  type: string;

  @Column({ length: 100, nullable: true })
  sector: string;

  @Column({ length: 100, nullable: true })
  country: string;

  @Column({ length: 255 })
  contactName: string;

  @Column({ length: 255 })
  email: string;

  @Column({ length: 50, nullable: true })
  phone: string;

  @Column('text', { nullable: true })
  projectDescription: string;

  @Column({ length: 50, default: 'New' })
  status: string;

  @CreateDateColumn()
  submissionDate: Date;

  @Column('text', { nullable: true })
  reviewNotes: string;
}
