import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('partenariats') // Mapped to 'partenariats' table
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  conventionId: string;

  @Column({ length: 255 })
  title: string;

  @Column({ length: 100, nullable: true })
  domain: string;

  @Column('decimal', { precision: 15, scale: 2, nullable: true })
  budget: number;

  @Column({ length: 10, default: 'XOF' })
  currency: string;

  @Column({ length: 50, default: 'Planned' })
  status: string;

  @Column('text', { nullable: true })
  description: string;
}
