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
  type: string; // Type de partenariat: Académique, Recherche, Industriel, etc.

  @Column({ length: 100, nullable: true })
  sector: string; // Secteur d'activité

  @Column({ length: 100, nullable: true })
  country: string;

  @Column({ length: 100, nullable: true })
  city: string; // Ville

  @Column({ length: 255 })
  contactName: string;

  @Column({ length: 255 })
  email: string;

  @Column({ length: 50, nullable: true })
  phone: string;

  @Column({ length: 100, nullable: true })
  position: string; // Poste/Fonction du contact

  @Column('text', { nullable: true })
  description: string; // Description de l'organisation

  @Column('text', { nullable: true })
  motivation: string; // Objectifs et motivations

  @Column('text', { nullable: true })
  collaborationAreas: string; // Domaines de collaboration

  @Column({ length: 50, nullable: true })
  agreementType: string; // Type d'accord: Cadre, Specifique, Inconnu

  @Column({ length: 100, nullable: true })
  website: string; // Site web

  @Column({ type: 'int', nullable: true })
  creationYear: number; // Année de création

  @Column({ length: 50, nullable: true })
  deadline: string; // Délai: Urgent, Moyen, Long

  @Column({ length: 100, nullable: true })
  estimatedBudget: string; // Budget estimé

  @Column({ length: 50, default: 'pending' })
  status: string; // pending, under_review, approved, rejected

  @Column({ length: 50, default: 'medium' })
  priority: string; // high, medium, low

  @CreateDateColumn()
  submissionDate: Date;

  @Column('text', { nullable: true })
  reviewNotes: string; // Notes de révision (admin)
}
