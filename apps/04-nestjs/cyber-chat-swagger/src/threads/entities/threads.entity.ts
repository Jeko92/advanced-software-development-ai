import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import type { Comment } from '../../comments/entities/comments.entity.ts';
import { User } from '../../users/entities/user.entity.ts';

@Entity('threads')
export class Thread {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column('text')
  body!: string;

  @Column()
  authorId!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany('Comment', 'thread')
  comments!: Comment[];

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'authorId' })
  authorUser!: User;
}
