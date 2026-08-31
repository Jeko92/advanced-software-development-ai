import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export type UserRole = 'viewer' | 'editor' | 'admin';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  username!: string;

  @Column()
  passwordHash!: string;

  @Column('simple-array', { default: 'viewer' })
  roles!: UserRole[];
}
