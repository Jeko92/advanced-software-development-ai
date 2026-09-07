import { ApiProperty } from '@nestjs/swagger';
import { Boardgame } from '../../boardgames/entities/boardgame.entity.ts';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('rooms')
export class Room {
  @ApiProperty({ format: 'uuid' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({ type: () => Boardgame, nullable: true })
  @ManyToOne(() => Boardgame, (game) => game.id, { nullable: true })
  game!: Boardgame | null;

  @ApiProperty()
  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  date!: Date;

  @ApiProperty({ type: [String] })
  @Column('simple-array')
  players!: string[];
}
