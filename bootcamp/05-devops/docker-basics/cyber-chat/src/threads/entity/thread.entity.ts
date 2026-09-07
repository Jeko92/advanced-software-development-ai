import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Thread {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column()
  title!: string;

  @Column()
  author!: string;

  @Column()
  body!: string;

  @CreateDateColumn()
  createdAt!: Date;
}

export type CreateThreadPayload = Omit<Thread, 'id' | 'createdAt'>;
