import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Thread } from '../../threads/entities/threads.entity';
import { User } from '../../users/entities/user.entity';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  threadId!: string;

  @Column()
  authorId!: string;

  @Column('text')
  body!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => Thread, (thread) => thread.comments)
  @JoinColumn({ name: 'threadId' })
  thread!: Thread;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'authorId' })
  authorUser!: User;
}
