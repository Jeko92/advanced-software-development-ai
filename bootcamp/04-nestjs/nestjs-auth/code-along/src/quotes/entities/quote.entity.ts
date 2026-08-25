import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsString, MaxLength } from 'class-validator';

@Entity('quotes')
export class Quote {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  @IsString()
  @MaxLength(2000)
  quote!: string;

  @Column()
  @IsString()
  author!: string;

  @Column({ type: 'date' })
  @CreateDateColumn()
  createdAt!: Date;
}
