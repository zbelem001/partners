import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('partners')
export class Partner {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  ref: string; // Ex: P-2026-001

  @Column({ length: 255 })
  name: string;

  @Column({ length: 50 })
  type: string; // Entreprise, ONG, Université...

  @Column({ length: 100 })
  country: string;

  @Column({ length: 100, nullable: true })
  domain: string; // Énergie, Eau, Environnement...

  @Column({ length: 50, default: 'Active' })
  status: string; // Active, Inactive, En Attente

  @Column({ length: 255, nullable: true })
  email: string;

  @Column({ length: 255, nullable: true })
  website: string;

  @Column({ type: 'uuid', nullable: true })
  prospectId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
