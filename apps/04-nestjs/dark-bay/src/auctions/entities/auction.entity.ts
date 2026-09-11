import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Offer } from '../../offers/entities/offer.entity';
import { User } from '../../users/entities/user.entity';

@Entity('auctions')
export class Auction {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column()
  description!: string;

  @Column()
  startingPrice!: number;

  @Column()
  endDate!: Date;

  @ManyToOne(() => User)
  seller!: User;

  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany(() => Offer, (offer) => offer.auction)
  offers!: Offer[];
}
