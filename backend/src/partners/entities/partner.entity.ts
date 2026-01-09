import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Partner {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  ref: string; // Ex: P-2026-001

  @Column()
  name: string;

  @Column()
  type: string; // Entreprise, ONG, Université...

  @Column()
  country: string;

  @Column()
  domain: string; // Énergie, Eau, Environnement...

  @Column({ default: 'Active' })
  status: string; // Active, Inactive, En Attente

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  website: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
