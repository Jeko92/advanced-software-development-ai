import { Boardgame } from '../../boardgames/entities/boardgame.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('rooms')
export class Room {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Boardgame, (game) => game.id, { nullable: true })
  game!: Boardgame | null;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  date!: Date;

  @Column('simple-array')
  players!: string[];
}
