import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column()
  threadId!: number;

  @Column()
  author!: string;

  @Column()
  body!: string;

  @CreateDateColumn()
  createdAt!: Date;
}

export type CreateCommentPayload = Omit<Comment, 'id' | 'createdAt'>;
