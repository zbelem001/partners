import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  firstName: string;

  @Column({ length: 100 })
  lastName: string;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: true })
  employeeId: string | null;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ length: 50 })
  role: string; // Admin, SRECIP, DFC, CAQ, DG, Manager, User, Viewer

  @Column({ length: 100 })
  department: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  phone: string | null;

  @Column('text', { nullable: true })
  bio: string | null;

  @Column({ length: 50, default: 'Active' })
  status: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  passwordHash: string | null; // Store hashed passwords, not plain text!

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastLogin: Date | null;
}
