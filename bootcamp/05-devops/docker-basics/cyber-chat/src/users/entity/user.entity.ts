import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
export type Role = 'USER' | 'ADMIN' | 'SUPER_ADMIN';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  username!: string;

  @Column()
  password!: string;

  @Column({ type: 'simple-array', default: ['USER'] })
  roles!: Role[];
}

export type ValidatedUser = Omit<User, 'password'>;
