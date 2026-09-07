// src/comments/entities/comments.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Thread } from '../../threads/entities/threads.entity.ts';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  threadId!: string;

  @Column()
  author!: string;

  @Column('text')
  body!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => Thread, (thread) => thread.comments)
  @JoinColumn({ name: 'threadId' })
  thread!: Thread;
}
