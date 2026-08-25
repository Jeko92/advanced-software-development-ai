import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('boardgames')
export class Boardgame {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty()
  @Column()
  title!: string;

  @ApiProperty()
  @Column()
  designer!: string;

  @ApiProperty()
  @Column('integer')
  yearPublished!: number;

  @ApiProperty()
  @Column('integer')
  minPlayers!: number;

  @ApiProperty()
  @Column('integer')
  maxPlayers!: number;

  @ApiProperty()
  @Column('integer')
  playTimeMinutes!: number;

  @ApiProperty()
  @Column('integer')
  minAge!: number;

  @ApiProperty()
  @Column({ type: 'numeric', scale: 1 })
  complexity!: number;

  @ApiProperty()
  @Column({ type: 'numeric', scale: 1 })
  rating!: number;

  @ApiProperty({ type: [String] })
  @Column('simple-array')
  categories!: string[];

  @ApiProperty()
  @Column()
  available!: boolean;
}
