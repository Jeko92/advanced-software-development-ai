import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('api_keys')
export class ApiKey {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  keyHash!: string;

  @Column()
  label!: string;

  @Column({ default: true })
  active!: boolean;

  @Column({ type: 'date' })
  @CreateDateColumn()
  createdAt!: Date;
}
