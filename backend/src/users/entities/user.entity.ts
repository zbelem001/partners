import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ type: 'varchar', unique: true, nullable: true })
  employeeId: string | null;

  @Column({ unique: true })
  email: string;

  @Column()
  role: string; // Admin, Direction, Manager

  @Column()
  department: string;

  @Column({ type: 'varchar', nullable: true })
  phone: string | null;

  @Column('text', { nullable: true })
  bio: string | null;

  @Column({ default: 'Active' })
  status: string;

  @Column({ type: 'varchar', nullable: true })
  passwordHash: string | null; // Store hashed passwords, not plain text!

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'datetime', nullable: true })
  lastLogin: Date | null;
}
