import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import type { Comment } from '../../comments/entities/comments.entity.ts';

@Entity('threads')
export class Thread {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column('text')
  body!: string;

  @Column()
  author!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany('Comment', 'thread')
  comments!: Comment[];
}
