import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('documents')
export class Document {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 10 })
  type: string;

  @Column({ length: 50, nullable: true })
  size: string;

  @Column({ length: 500 })
  url: string;

  @Column({ length: 50, nullable: true })
  category: string;

  @Column({ length: 50, default: 'Interne' })
  confidentialityLevel: string;

  @CreateDateColumn()
  uploadDate: Date;

  @Column({ nullable: true })
  ownerId: number;

  @Column({ type: 'uuid', nullable: true })
  conventionId: string;

  @Column({ type: 'uuid', nullable: true })
  partnerId: string;
}
