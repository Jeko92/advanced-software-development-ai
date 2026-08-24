import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export type UserRoleType = 'admin' | 'viewer';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  username!: string;

  @Column()
  password!: string;

  @Column('simple-array')
  roles!: UserRoleType[];

  @Column({ type: 'date' })
  @CreateDateColumn()
  createdAt!: Date;
}
