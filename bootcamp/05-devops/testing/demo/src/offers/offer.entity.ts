import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { Auction } from '../auctions/auction.entity.ts';
import { User } from '../users/user.entity.ts';
import { numericTransformer } from '../common/transformers/numeric.transformer.ts';

/**
 * A single bid.
 *
 * The many-to-one relation to `Auction` is what gives a listing its complete
 * bid history: many offers point at one auction, and TypeORM materialises the
 * other side as `Auction.offers`. Offers are never updated or deleted — the
 * history of what was bid, and when, is part of the record.
 */
@Entity('offers')
export class Offer {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('decimal', {
    precision: 12,
    scale: 2,
    transformer: numericTransformer,
  })
  amount!: number;

  @CreateDateColumn()
  createdAt!: Date;

  /** Deleting a listing takes its bid history with it. */
  @ManyToOne(() => Auction, (auction) => auction.offers, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  auction!: Relation<Auction>;

  /** Taken from the verified JWT, never from the request body. */
  @ManyToOne(() => User, (user) => user.offers, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  bidder!: Relation<User>;
}
