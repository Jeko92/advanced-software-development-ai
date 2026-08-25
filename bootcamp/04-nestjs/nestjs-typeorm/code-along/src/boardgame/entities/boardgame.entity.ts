import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('boardgames')
export class Boardgame {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 120 })
  name!: string;

  @Column({ type: 'integer' })
  minPlayers!: number;

  @Column({ type: 'integer' })
  maxPlayers!: number;

  @Column({ type: 'integer' })
  playtimeMinutes!: number;

  @Column({ type: 'numeric', precision: 3, scale: 1 })
  complexity!: number;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt!: Date;
}
