import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Auction } from '../../auctions/entities/auction.entity';
import { User } from '../../users/entities/user.entity';

@Entity('offers')
export class Offer {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  amount!: number;

  @ManyToOne(() => User)
  bidder!: User;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => Auction, (auction) => auction.offers, {
    onDelete: 'CASCADE',
  })
  auction!: Auction;
}
