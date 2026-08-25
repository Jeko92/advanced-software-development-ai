import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Concert')
export class Concert {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column()
  artist!: string;

  @Column()
  venue!: string;

  @Column({ type: 'datetime' })
  date!: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  ticketPrice!: number;

  @Column()
  genre!: string;
}
