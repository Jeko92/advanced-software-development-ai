import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('boardgames')
export class Boardgame {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  designer!: string;

  @Column('integer')
  yearPublished!: number;

  @Column('integer')
  minPlayers!: number;

  @Column('integer')
  maxPlayers!: number;

  @Column('integer')
  playTimeMinutes!: number;

  @Column('integer')
  minAge!: number;

  @Column({ type: 'numeric', scale: 1 })
  complexity!: number;

  @Column({ type: 'numeric', scale: 1 })
  rating!: number;

  @Column('simple-array')
  categories!: string[];

  @Column()
  available!: boolean;
}
